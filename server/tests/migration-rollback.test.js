import { test, expect } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { fixture } from "./helpers/database.js";
import { migrate } from "../src/db/migrate.js";
test("una migración fallida revierte su SQL y no se registra", async () => {
  const f = await fixture();
  try {
    const dir = path.join(f.dir, "migrations");
    mkdirSync(dir);
    writeFileSync(
      path.join(dir, "003-invalid.sql"),
      "UPDATE settings SET whatsapp_number='51999888777'; INSERT INTO missing_table VALUES(1);",
    );
    expect(() =>
      migrate(f.app.locals.db, pathToFileURL(dir + path.sep)),
    ).toThrow();
    expect(
      f.app.locals.db.prepare("SELECT whatsapp_number FROM settings").get()
        .whatsapp_number,
    ).toBeNull();
    expect(
      f.app.locals.db.prepare("SELECT name FROM schema_migrations").all(),
    ).toHaveLength(2);
  } finally {
    f.close();
  }
});
