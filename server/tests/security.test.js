import { test, expect, vi } from "vitest";
import request from "supertest";
import { fixture, product, mutation } from "./helpers/database.js";
import { createApp } from "../src/app.js";
test("cookie Secure en producción, origen/token y logging sin datos sensibles", async () => {
  const f = await fixture();
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  try {
    f.app.locals.close();
    f.app = await createApp({
      ...f.config,
      production: true,
      origin: "https://tienda.test",
      trustProxy: 1,
      log: true,
    });
    const r = await request(f.app)
      .get("/api/auth/csrf?private=oculto")
      .set("X-Forwarded-Proto", "https");
    expect(r.headers["set-cookie"][0]).toMatch(/HttpOnly/);
    expect(r.headers["set-cookie"][0]).toMatch(/Secure/);
    expect(r.headers["set-cookie"][0]).toMatch(/SameSite=Lax/);
    expect(r.headers["content-security-policy"]).toContain(
      "default-src 'self'",
    );
    expect(r.headers["cache-control"]).toBe("no-store");
    expect(JSON.stringify(log.mock.calls)).not.toContain("oculto");
    expect(JSON.stringify(log.mock.calls)).not.toContain(r.body.data.csrfToken);
  } finally {
    log.mockRestore();
    f.app.locals.close();
    f.close();
  }
});
test("token Unicode malformado no provoca 500 y CSRF no escribe", async () => {
  const f = await fixture();
  try {
    const a = request.agent(f.app);
    await a.get("/api/auth/csrf");
    expect(
      (
        await mutation(a, "post", "/api/auth/login", "é".repeat(64), {
          username: "admin",
          password: f.password,
        })
      ).status,
    ).toBe(403);
    expect(
      (await request(f.app).post("/api/admin/products").send(product())).status,
    ).toBe(401);
    expect(
      (await request(f.app).get("/api/products")).body.data.products,
    ).toEqual([]);
  } finally {
    f.close();
  }
});
