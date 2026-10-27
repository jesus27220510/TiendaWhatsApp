import { test, expect } from "vitest";
import argon2 from "argon2";
import { fixture } from "./helpers/database.js";
import { createAdmin } from "../src/db/admin.js";
test("admin usa Argon2id y nunca sobrescribe cuenta existente", async () => {
  const f = await fixture();
  try {
    const a = f.app.locals.db.prepare("SELECT * FROM admins").get();
    expect(a.password_hash).toContain("$argon2id$v=19$m=19456,t=2,p=1$");
    expect(await argon2.verify(a.password_hash, f.password)).toBe(true);
    await expect(
      createAdmin(f.app.locals.db, "other", f.password),
    ).rejects.toThrow("ya existe");
    await expect(
      createAdmin(f.app.locals.db, "other", "short"),
    ).rejects.toMatchObject({
      fields: { password: expect.stringContaining("15") },
    });
    expect(f.app.locals.db.prepare("SELECT * FROM admins").all()).toEqual([a]);
  } finally {
    f.close();
  }
});
