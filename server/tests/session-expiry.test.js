import { test, expect } from "vitest";
import request from "supertest";
import { fixture, login } from "./helpers/database.js";
import { createApp } from "../src/app.js";
test("regenera ID y token, caducidad por inactividad", async () => {
  const f = await fixture();
  let now = Date.now();
  try {
    f.app.locals.close();
    f.app = await createApp(f.config, { now: () => now });
    const a = request.agent(f.app);
    const before = await a.get("/api/auth/csrf");
    const r = await a
      .post("/api/auth/login")
      .set("Origin", f.config.origin)
      .set("X-CSRF-Token", before.body.data.csrfToken)
      .send({ username: "admin", password: f.password });
    expect(r.headers["set-cookie"][0].split(";")[0]).not.toBe(
      before.headers["set-cookie"][0].split(";")[0],
    );
    expect(r.body.data.csrfToken).not.toBe(before.body.data.csrfToken);
    now += 1800000;
    expect((await a.get("/api/auth/me")).status).toBe(401);
    expect((await a.get("/api/admin/products")).status).toBe(401);
  } finally {
    f.app.locals.close();
    f.close();
  }
});
test("actividad no extiende las ocho horas absolutas", async () => {
  const f = await fixture();
  let now = Date.now();
  try {
    f.app.locals.close();
    f.app = await createApp(f.config, { now: () => now });
    const { agent } = await login(f);
    for (let i = 0; i < 23; i++) {
      now += 1200000;
      expect((await agent.get("/api/auth/me")).status).toBe(200);
    }
    now += 1200000;
    expect((await agent.get("/api/auth/me")).status).toBe(401);
  } finally {
    f.app.locals.close();
    f.close();
  }
});
