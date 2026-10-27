import { test, expect } from "vitest";
import request from "supertest";
import { fixture, login, mutation } from "./helpers/database.js";
test("número validado, protegido y sin sobrescritura concurrente", async () => {
  const f = await fixture();
  try {
    expect(
      (
        await request(f.app)
          .put("/api/admin/settings")
          .send({ whatsappNumber: "51999888777", version: 1 })
      ).status,
    ).toBe(401);
    const { agent, token } = await login(f);
    expect(
      (
        await agent
          .put("/api/admin/settings")
          .send({ whatsappNumber: "51999888777", version: 1 })
      ).status,
    ).toBe(403);
    expect(
      (
        await mutation(agent, "put", "/api/admin/settings", token, {
          whatsappNumber: "123",
          version: 1,
        })
      ).status,
    ).toBe(422);
    expect((await agent.get("/api/admin/settings")).body.data.version).toBe(1);
    expect(
      (
        await mutation(agent, "put", "/api/admin/settings", token, {
          whatsappNumber: "999888777",
          version: 1,
        })
      ).body.data.whatsappNumber,
    ).toBe("51999888777");
    expect(
      (
        await mutation(agent, "put", "/api/admin/settings", token, {
          whatsappNumber: null,
          version: 1,
        })
      ).status,
    ).toBe(409);
    expect(
      (await request(f.app).get("/api/store")).body.data.whatsappConfigured,
    ).toBe(true);
  } finally {
    f.close();
  }
});
