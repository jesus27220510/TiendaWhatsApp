import { test, expect } from "vitest";
import request from "supertest";
import { fixture, product } from "./helpers/database.js";
import { saveProduct } from "../src/db/products.js";
import { saveSettings } from "../src/db/settings.js";
test("checkout valida IDs, cantidades, límites, DB y códigos de contrato", async () => {
  const f = await fixture();
  try {
    saveSettings(f.app.locals.db, {
      whatsappNumber: "51999888777",
      version: 1,
    });
    const p = product();
    saveProduct(f.app.locals.db, p);
    const line = {
      productId: p.id,
      name: p.name,
      priceCents: 1250,
      quantity: 1,
    };
    let r = await request(f.app).post("/api/checkout").send({ items: [] });
    expect(r.body.error.code).toBe("EMPTY_CART");
    for (const items of [
      [line, line],
      [{ ...line, quantity: 0 }],
      [{ ...line, quantity: 1.5 }],
      [{ ...line, other: true }],
    ])
      expect(
        (await request(f.app).post("/api/checkout").send({ items })).status,
      ).toBe(422);
    const items = [];
    for (let i = 0; i < 30; i++) {
      const next = product({ name: "ñ & ".repeat(24) });
      saveProduct(f.app.locals.db, next);
      items.push({ ...line, productId: next.id, name: next.name });
    }
    r = await request(f.app).post("/api/checkout").send({ items });
    expect(r.body.error.code).toBe("MESSAGE_TOO_LONG");
    expect(r.body.data).toBeUndefined();
    expect(
      (
        await request(f.app)
          .post("/api/checkout")
          .send({ text: "x".repeat(270000) })
      ).status,
    ).toBe(413);
    f.app.locals.db.close();
    expect(
      (
        await request(f.app)
          .post("/api/checkout")
          .send({ items: [line] })
      ).status,
    ).toBe(503);
  } finally {
    f.close();
  }
});
