import { test, expect, loginUI } from "./fixtures.js";
test("reintentar alta tras respuesta perdida no duplica producto", async ({
  page,
  adminApi,
}) => {
  await loginUI(page);
  await page
    .getByRole("button", { name: "+ Agregar producto", exact: true })
    .click();
  await page.getByLabel("Nombre", { exact: true }).fill("Miel ñ & limón");
  await page.getByLabel("Descripción", { exact: true }).fill("Frasco");
  await page.getByLabel("Precio en soles").fill("12.50");
  await page.route("**/api/admin/products", async (route) => {
    if (route.request().method() === "POST") {
      await route.fetch();
      await route.abort("failed");
    } else await route.continue();
  });
  await page.getByRole("button", { name: "Guardar producto" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByLabel("Nombre", { exact: true })).toHaveValue(
    "Miel ñ & limón",
  );
  await page.unroute("**/api/admin/products");
  await page.getByRole("button", { name: "Guardar producto" }).click();
  await expect(
    page.getByRole("heading", { name: "Miel ñ & limón" }),
  ).toBeVisible();
  const result = (await (await adminApi.api.get("/api/admin/products")).json())
    .data.products;
  expect(result.filter((p) => p.name === "Miel ñ & limón")).toHaveLength(1);
});
