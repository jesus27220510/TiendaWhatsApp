import { test, expect } from "vitest";
import request from "supertest";
import { fixture, login, mutation, product } from "./helpers/database.js";
test("permiso servidor, csrf, cierre y sesiones antiguas", async () => {
  const f = await fixture();
  try {
    expect((await request(f.app).get("/api/admin/products")).status).toBe(401);
    const { agent, token } = await login(f);
    expect(
      (await agent.post("/api/admin/products").send(product())).status,
    ).toBe(403);
    expect(
      (await mutation(agent, "post", "/api/admin/products", token, product()))
        .status,
    ).toBe(201);
    expect(
      (await mutation(agent, "post", "/api/auth/logout", token, {})).status,
    ).toBe(204);
    expect(
      (await mutation(agent, "post", "/api/admin/products", token, product()))
        .status,
    ).toBe(401);
  } finally {
    f.close();
  }
});
test("credenciales inválidas, origen ajeno y limitación persistente", async () => {
  const f = await fixture();
  try {
    const a = request.agent(f.app);
    const c = (await a.get("/api/auth/csrf")).body.data.csrfToken;
    expect(
      (
        await a
          .post("/api/auth/login")
          .set("Origin", "https://otro.test")
          .set("X-CSRF-Token", c)
          .send({ username: "admin", password: "incorrecta" })
      ).status,
    ).toBe(403);
    for (let i = 0; i < 5; i++)
      expect(
        (
          await mutation(a, "post", "/api/auth/login", c, {
            username: "admin",
            password: "incorrecta",
          })
        ).status,
      ).toBe(401);
    const r = await mutation(a, "post", "/api/auth/login", c, {
      username: "admin",
      password: f.password,
    });
    expect(r.status).toBe(429);
    expect(Number(r.headers["retry-after"])).toBeGreaterThan(0);
  } finally {
    f.close();
  }
});
