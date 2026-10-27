import { test, expect } from "vitest";
import Database from "better-sqlite3";
import { migrate } from "../src/db/migrate.js";
test("migración repetible y transacción SQL fallida revierte", () => {
  const db = new Database(":memory:");
  try {
    migrate(db);
    migrate(db);
    expect(
      db.prepare("SELECT count(*) AS n FROM schema_migrations").get().n,
    ).toBe(2);
    expect(() =>
      db.transaction(() => {
        db.exec("INSERT INTO admins VALUES(1,'temp','hash','now')");
        db.exec("INSERT INTO nonexistent VALUES(1)");
      })(),
    ).toThrow();
    expect(db.prepare("SELECT * FROM admins").all()).toEqual([]);
  } finally {
    db.close();
  }
});
