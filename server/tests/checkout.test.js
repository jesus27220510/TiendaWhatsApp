import { test, expect } from "vitest";
import request from "supertest";
import { fixture, login, mutation, product } from "./helpers/database.js";
test("resumen autoritativo, vacío, cambios, borrado y vendedor ausente", async () => {
  const f = await fixture();
  try {
    const { agent: a, token: t } = await login(f);
    const p = product({ name: "Café & ñ" });
    await mutation(a, "post", "/api/admin/products", t, p);
    const items = [
      { productId: p.id, name: p.name, priceCents: 1250, quantity: 2 },
    ];
    expect(
      (await request(f.app).post("/api/checkout").send({ items: [] })).status,
    ).toBe(422);
    expect(
      (await request(f.app).post("/api/checkout").send({ items })).body.error
        .code,
    ).toBe("WHATSAPP_UNAVAILABLE");
    await mutation(a, "put", "/api/admin/settings", t, {
      whatsappNumber: "+51 999-888-777",
      version: 1,
    });
    let r = await request(f.app).post("/api/checkout").send({ items });
    expect(r.status).toBe(200);
    expect(r.body.data.totalCents).toBe(2500);
    expect(new URL(r.body.data.whatsappUrl).searchParams.get("text")).toContain(
      "Café & ñ",
    );
    expect(r.headers["set-cookie"]).toBeUndefined();
    r = await request(f.app)
      .post("/api/checkout")
      .send({ items: [{ ...items[0], priceCents: 1 }] });
    expect(r.status).toBe(409);
    expect(r.body.data.whatsappUrl).toBeUndefined();
    await mutation(a, "delete", "/api/admin/products/" + p.id, t, {
      version: 1,
    });
    r = await request(f.app).post("/api/checkout").send({ items });
    expect(r.body.data.lines).toEqual([]);
  } finally {
    f.close();
  }
});
