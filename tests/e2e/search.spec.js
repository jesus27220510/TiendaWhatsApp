import { test, expect } from "./fixtures.js";
test("buscar por nombre ignora tildes, limpia y mantiene selección", async ({
  page,
  adminApi,
}) => {
  expect(adminApi.products).toHaveLength(3);
  await page.goto("/");
  await page
    .getByRole("button", { name: "Agregar Té verde", exact: true })
    .click();
  await page.getByLabel("Buscar productos").fill(" CAFE ");
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.getByLabel("Buscar productos").fill("no-existe");
  await expect(page.getByText("No se encontraron productos")).toBeVisible();
  await expect(page.getByLabel("Cantidad de Té verde")).toHaveValue("1");
  await page.getByRole("button", { name: "Limpiar", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(3);
});
