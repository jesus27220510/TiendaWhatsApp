import { test, expect, loginUI } from "./fixtures.js";
test("login, error genérico, cierre y pestaña antigua sin permiso", async ({
  page,
  context,
  adminApi,
}) => {
  expect(adminApi.products).toHaveLength(3);
  await page.goto("/admin");
  await page.getByLabel("Usuario", { exact: true }).fill("admin");
  await page.getByLabel("Contraseña", { exact: true }).fill("incorrecta");
  await page.getByRole("button", { name: "Ingresar al panel" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Usuario o contraseña incorrectos",
  );
  await loginUI(page);
  const old = await context.newPage();
  await old.goto("/admin");
  await expect(
    old.getByRole("heading", { name: "Tu catálogo, al día." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page.getByLabel("Usuario", { exact: true })).toBeVisible();
  await old.getByRole("button", { name: "Actualizar lista" }).click();
  await expect(old.getByLabel("Usuario", { exact: true })).toBeVisible();
});
