import { test, expect, loginUI } from "./fixtures.js";
test("error de lectura recuperable y formulario conservado ante fallo", async ({
  page,
  adminApi,
}) => {
  expect(adminApi.products).toHaveLength(3);
  await page.route("**/api/products", (r) =>
    r.fulfill({
      status: 503,
      json: {
        error: {
          code: "STORAGE_UNAVAILABLE",
          message: "No se pudo acceder a los datos. Intenta nuevamente.",
        },
      },
    }),
  );
  await page.goto("/");
  await expect(page.getByRole("alert")).toBeVisible();
  await page.unroute("**/api/products");
  await page.getByRole("button", { name: "Reintentar" }).click();
  await expect(page.locator(".product-card")).toHaveCount(3);
  await loginUI(page);
  await page
    .getByRole("button", { name: "Editar Café molido", exact: true })
    .click();
  await page.getByLabel("Nombre", { exact: true }).fill("Café editado");
  await page.route("**/api/admin/products/*", (r) =>
    r.fulfill({
      status: 503,
      json: {
        error: {
          code: "STORAGE_UNAVAILABLE",
          message: "No se pudo guardar. Intenta nuevamente.",
        },
      },
    }),
  );
  await page.getByRole("button", { name: "Guardar producto" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByLabel("Nombre", { exact: true })).toHaveValue(
    "Café editado",
  );
});
