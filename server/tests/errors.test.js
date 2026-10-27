import { test, expect } from "vitest";
import request from "supertest";
import express from "express";
import { fixture } from "./helpers/database.js";
import { errors } from "../src/middleware/errors.js";
test("400, 404, 413 y 503 tienen mensajes seguros", async () => {
  const f = await fixture();
  try {
    for (const [r, status] of [
      [
        await request(f.app)
          .post("/api/auth/login")
          .set("Content-Type", "application/json")
          .send("{"),
        400,
      ],
      [await request(f.app).get("/api/no-existe"), 404],
      [
        await request(f.app)
          .post("/api/auth/login")
          .send({ text: "x".repeat(17000) }),
        413,
      ],
    ]) {
      expect(r.status).toBe(status);
      expect(r.body.requestId).toBeTruthy();
    }
    f.app.locals.db.close();
    expect((await request(f.app).get("/api/products")).status).toBe(503);
  } finally {
    f.close();
  }
});
test("500 oculta detalles internos", async () => {
  const app = express();
  app.get("/", () => {
    throw new Error("private database path");
  });
  app.use(errors);
  const r = await request(app).get("/");
  expect(r.status).toBe(500);
  expect(JSON.stringify(r.body)).not.toContain("private");
});
