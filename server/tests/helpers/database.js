import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomBytes, randomUUID } from "node:crypto";
import { createApp } from "../../src/app.js";
import { createAdmin } from "../../src/db/admin.js";
import request from "supertest";
export async function fixture() {
  const dir = mkdtempSync(path.join(tmpdir(), "tienda-test-"));
  const secret = randomBytes(32).toString("hex");
  const password = randomBytes(20).toString("hex");
  const config = {
    production: false,
    host: "127.0.0.1",
    port: 3000,
    origin: "http://localhost:5173",
    secret,
    database: path.join(dir, "data.sqlite"),
    sessions: path.join(dir, "sessions.sqlite"),
    trustProxy: false,
    log: false,
  };
  const app = await createApp(config);
  await createAdmin(app.locals.db, "admin", password);
  return {
    app,
    config,
    dir,
    password,
    close() {
      app.locals.close();
      rmSync(dir, { recursive: true, force: true });
    },
  };
}
export async function login(f) {
  const agent = request.agent(f.app);
  let r = await agent.get("/api/auth/csrf");
  r = await agent
    .post("/api/auth/login")
    .set("Origin", f.config.origin)
    .set("X-CSRF-Token", r.body.data.csrfToken)
    .send({ username: "admin", password: f.password });
  if (r.status !== 200) throw new Error(JSON.stringify(r.body));
  return { agent, token: r.body.data.csrfToken };
}
export const product = (extra = {}) => ({
  id: randomUUID(),
  name: "Café",
  description: "Bolsa de 250 g",
  priceCents: 1250,
  imageUrl: null,
  ...extra,
});
export const mutation = (agent, method, url, token, body) =>
  agent[method](url)
    .set("Origin", "http://localhost:5173")
    .set("X-CSRF-Token", token)
    .send(body);
