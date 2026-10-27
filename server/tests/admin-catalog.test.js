import { test, expect } from "vitest";
import { fixture, login, mutation, product } from "./helpers/database.js";
test("CRUD validado, idempotencia y conflictos no escriben", async () => {
  const f = await fixture();
  try {
    const { agent: a, token: t } = await login(f);
    const p = product();
    expect(
      (
        await mutation(a, "post", "/api/admin/products", t, {
          ...p,
          priceCents: 0,
        })
      ).status,
    ).toBe(422);
    expect(
      (
        await mutation(a, "post", "/api/admin/products", t, {
          ...p,
          imageUrl: "javascript:alert(1)",
        })
      ).status,
    ).toBe(422);
    expect(
      (await mutation(a, "post", "/api/admin/products", t, p)).status,
    ).toBe(201);
    expect(
      (await mutation(a, "post", "/api/admin/products", t, p)).status,
    ).toBe(200);
    expect(
      (
        await mutation(a, "post", "/api/admin/products", t, {
          ...p,
          name: "Otro",
        })
      ).status,
    ).toBe(409);
    const { id, ...values } = p;
    let r = await mutation(a, "put", "/api/admin/products/" + id, t, {
      ...values,
      priceCents: 1400,
      version: 1,
    });
    expect(r.body.data.product.version).toBe(2);
    expect(
      (
        await mutation(a, "put", "/api/admin/products/" + id, t, {
          ...values,
          version: 1,
        })
      ).status,
    ).toBe(409);
    expect(
      (
        await mutation(a, "delete", "/api/admin/products/" + id, t, {
          version: 2,
        })
      ).status,
    ).toBe(204);
    expect(
      (
        await mutation(a, "delete", "/api/admin/products/" + id, t, {
          version: 2,
        })
      ).status,
    ).toBe(404);
  } finally {
    f.close();
  }
});
