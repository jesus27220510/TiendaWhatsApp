import { test, expect } from "vitest";
import request from "supertest";
import { fixture, login, product, mutation } from "./helpers/database.js";
test("catálogo público vacío, productos y errores no equivalen a vacío", async () => {
  const f = await fixture();
  try {
    let r = await request(f.app).get("/api/products");
    expect(r.body.data.products).toEqual([]);
    expect(r.headers["set-cookie"]).toBeUndefined();
    const { agent, token } = await login(f);
    await mutation(agent, "post", "/api/admin/products", token, product());
    r = await request(f.app).get("/api/products");
    expect(r.body.data.products[0].priceCents).toBe(1250);
    f.app.locals.db.close();
    expect((await request(f.app).get("/api/products")).status).toBe(503);
  } finally {
    f.close();
  }
});
