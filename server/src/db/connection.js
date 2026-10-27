import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";
export function openDatabase(filename) {
  if (filename !== ":memory:")
    mkdirSync(path.dirname(filename), { recursive: true });
  const db = new Database(filename);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("busy_timeout = 5000");
  return db;
}
