export function attempts(db, now = Date.now) {
  db.exec(
    "CREATE TABLE IF NOT EXISTS login_attempts(key TEXT PRIMARY KEY,failureCount INTEGER NOT NULL,windowStart INTEGER NOT NULL,blockedUntil INTEGER NOT NULL)",
  );
  const day = 86400000,
    quarter = 900000;
  function read(key, window) {
    const r = db.prepare("SELECT * FROM login_attempts WHERE key=?").get(key);
    return r && (now() - r.windowStart < window || r.blockedUntil > now())
      ? r
      : null;
  }
  function cleanup() {
    db.prepare(
      "DELETE FROM login_attempts WHERE MAX(blockedUntil,windowStart+CASE WHEN key LIKE 'ip|%' THEN 86400000 ELSE 900000 END) <= ?",
    ).run(now());
  }
  return {
    cleanup,
    retry(user, ip) {
      cleanup();
      return Math.max(
        0,
        ...[
          ["user|" + user + "|" + ip, quarter],
          ["ip|" + ip, day],
        ].map(([k, w]) => {
          const r = read(k, w);
          return r ? Math.ceil((r.blockedUntil - now()) / 1000) : 0;
        }),
      );
    },
    fail(user, ip) {
      db.transaction(() => {
        for (const [key, window, max] of [
          ["user|" + user + "|" + ip, quarter, 5],
          ["ip|" + ip, day, 100],
        ]) {
          const r = read(key, window);
          const start = r?.windowStart ?? now(),
            count = (r?.failureCount || 0) + 1;
          const until =
            count >= max ? (max === 5 ? now() + quarter : start + day) : 0;
          db.prepare(
            "INSERT OR REPLACE INTO login_attempts VALUES(?,?,?,?)",
          ).run(key, count, start, until);
        }
      })();
    },
    success(user, ip) {
      db.prepare("DELETE FROM login_attempts WHERE key=?").run(
        "user|" + user + "|" + ip,
      );
    },
  };
}
