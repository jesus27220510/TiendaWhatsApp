import { readdirSync, readFileSync } from "node:fs";
export function migrate(
  db,
  directory = new URL("./migrations/", import.meta.url),
) {
  db.exec(
    "CREATE TABLE IF NOT EXISTS schema_migrations(name TEXT PRIMARY KEY)",
  );
  for (const name of readdirSync(directory)
    .filter((n) => n.endsWith(".sql"))
    .sort()) {
    if (db.prepare("SELECT 1 FROM schema_migrations WHERE name=?").get(name))
      continue;
    db.transaction(() => {
      db.exec(readFileSync(new URL(name, directory), "utf8"));
      db.prepare("INSERT INTO schema_migrations VALUES(?)").run(name);
    })();
  }
}
