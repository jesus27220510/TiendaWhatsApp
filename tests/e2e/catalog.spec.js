import { test, expect } from "./fixtures.js";
test("catálogo público, imagen ausente, carga y vacío", async ({
  page,
  adminApi,
}) => {
  await page.route("https://images.example.test/**", (r) => r.abort());
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Café molido", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Café peruano, bolsa de 250 g.")).toBeVisible();
  await expect(
    page
      .locator(".product-card")
      .filter({ hasText: "Café molido" })
      .getByText("S/ 12.50"),
  ).toBeVisible();
  await expect(page.getByText("Imagen no disponible")).toHaveCount(3);
  expect(
    (await page.context().cookies()).filter((c) => c.name === "tienda.sid"),
  ).toHaveLength(0);
  for (const p of adminApi.products)
    await adminApi.change("DELETE", "/api/admin/products/" + p.id, {
      version: 1,
    });
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Aún no hay productos" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Finalizar pedido/ }),
  ).toBeDisabled();
});
