import { test, expect } from "vitest";
import { fixture } from "./helpers/database.js";
import { attempts } from "../src/db/login-attempts.js";
import { openDatabase } from "../src/db/connection.js";
test("bloqueo dura 15 minutos desde quinto fallo y sobrevive reinicio", async () => {
  const f = await fixture();
  let now = 1000000;
  try {
    let c = attempts(f.app.locals.sessionDb, () => now);
    for (let i = 0; i < 4; i++) c.fail("admin", "ip");
    now += 14 * 60000;
    c.fail("admin", "ip");
    now += 2 * 60000;
    expect(c.retry("admin", "ip")).toBe(780);
    f.app.locals.sessionDb.close();
    const db = openDatabase(f.config.sessions);
    try {
      c = attempts(db, () => now);
      expect(c.retry("admin", "ip")).toBe(780);
      now += 780000;
      expect(c.retry("admin", "ip")).toBe(0);
      for (let i = 0; i < 100; i++) c.fail("u" + i, "another");
      expect(c.retry("different", "another")).toBe(86400);
    } finally {
      db.close();
    }
  } finally {
    f.close();
  }
});
