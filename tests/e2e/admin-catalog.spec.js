import { test, expect, loginUI } from "./fixtures.js";
test("CRUD protegido, cancelar, validaciones y número vendedor", async ({
  page,
  adminApi,
}) => {
  expect(adminApi.products).toHaveLength(3);
  await loginUI(page);
  await page
    .getByRole("button", { name: "+ Agregar producto", exact: true })
    .click();
  await page.getByLabel("Nombre", { exact: true }).fill("Miel & limón");
  await page
    .getByLabel("Descripción", { exact: true })
    .fill("Frasco artesanal");
  await page.getByLabel("Precio en soles").fill("0");
  await page.getByRole("button", { name: "Guardar producto" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByLabel("Precio en soles").fill("20,50");
  await page.getByRole("button", { name: "Guardar producto" }).click();
  await expect(
    page.getByRole("heading", { name: "Miel & limón" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Editar Miel & limón", exact: true })
    .click();
  await page.getByLabel("Precio en soles").fill("21");
  await page.getByRole("button", { name: "Guardar producto" }).click();
  await expect(
    page.locator(".admin-list li").filter({ hasText: "Miel & limón" }),
  ).toContainText("S/ 21.00");
  await page
    .getByRole("button", { name: "Eliminar Miel & limón", exact: true })
    .click();
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Miel & limón" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Eliminar Miel & limón", exact: true })
    .click();
  await page.getByRole("button", { name: "Eliminar definitivamente" }).click();
  await expect(page.getByRole("heading", { name: "Miel & limón" })).toHaveCount(
    0,
  );
  await page.getByLabel("Número del vendedor").fill("+51 988-777-666");
  await page.getByRole("button", { name: "Guardar número" }).click();
  await expect(page.getByText("Número guardado.")).toBeVisible();
  await expect(page.getByLabel("Número del vendedor")).toHaveValue(
    "51988777666",
  );
});
