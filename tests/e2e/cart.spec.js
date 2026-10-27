import { test, expect, addAB } from "./fixtures.js";
test("totales A/B, agrupación, cantidad inválida y navegación", async ({
  page,
  adminApi,
}) => {
  expect(adminApi.products).toHaveLength(3);
  await page.goto("/");
  await addAB(page);
  await expect(page.locator(".total")).toContainText("S/ 33.00");
  await page.getByLabel("Cantidad de Café molido").fill("3");
  await page.getByLabel("Cantidad de Café molido").press("Tab");
  await expect(page.locator(".total")).toContainText("S/ 45.50");
  await page.getByLabel("Cantidad de Café molido").fill("0");
  await page.getByLabel("Cantidad de Café molido").press("Tab");
  await expect(page.getByLabel("Cantidad de Café molido")).toHaveValue("3");
  await page.getByRole("button", { name: "Quitar Té verde" }).click();
  await expect(page.locator(".total")).toContainText("S/ 37.50");
  await page.getByRole("link", { name: "Administración" }).click();
  await expect(page.getByLabel("Usuario", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Ver tienda" }).click();
  await expect(page.locator(".total")).toContainText("S/ 37.50");
});
