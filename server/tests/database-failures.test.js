import { test, expect } from "vitest";
import request from "supertest";
import { fixture, login, mutation, product } from "./helpers/database.js";
import { openDatabase } from "../src/db/connection.js";
test("bloqueo SQLite real rechaza sin escritura parcial y permite reintentar", async () => {
  const f = await fixture();
  const lock = openDatabase(f.config.database);
  try {
    const { agent, token } = await login(f);
    const p = product();
    f.app.locals.db.pragma("busy_timeout=20");
    lock.exec("BEGIN IMMEDIATE");
    expect(
      (await mutation(agent, "post", "/api/admin/products", token, p)).status,
    ).toBe(503);
    expect(
      (await request(f.app).get("/api/products")).body.data.products,
    ).toEqual([]);
    lock.exec("ROLLBACK");
    expect(
      (await mutation(agent, "post", "/api/admin/products", token, p)).status,
    ).toBe(201);
    expect(
      (await mutation(agent, "post", "/api/admin/products", token, p)).status,
    ).toBe(200);
    expect(
      (await request(f.app).get("/api/products")).body.data.products,
    ).toHaveLength(1);
  } finally {
    if (lock.inTransaction) lock.exec("ROLLBACK");
    lock.close();
    f.close();
  }
});
