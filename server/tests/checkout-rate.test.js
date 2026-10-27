import { test, expect } from "vitest";
import request from "supertest";
import { fixture } from "./helpers/database.js";
test("checkout limita 60 solicitudes por IP/minuto sin sesión", async () => {
  const f = await fixture();
  try {
    for (let i = 0; i < 60; i++)
      expect(
        (await request(f.app).post("/api/checkout").send({ items: [] })).status,
      ).toBe(422);
    const r = await request(f.app).post("/api/checkout").send({ items: [] });
    expect(r.status).toBe(429);
    expect(r.body.requestId).toBeTruthy();
    expect(r.headers["retry-after"]).toBeTruthy();
    expect(r.headers["set-cookie"]).toBeUndefined();
  } finally {
    f.close();
  }
});
