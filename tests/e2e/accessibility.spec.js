import { test, expect, loginUI } from "./fixtures.js";
test("teclado, foco, tamaño móvil y ampliación sin desbordes", async ({
  page,
  adminApi,
}, testInfo) => {
  expect(adminApi.products).toHaveLength(3);
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Ir al contenido" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await page
    .getByRole("button", { name: "Agregar Café molido", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Cantidad de Café molido")).toHaveValue("1");
  const check = async () =>
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  await check();
  await page.screenshot({
    path: "test-results/store-" + testInfo.project.name + ".png",
    fullPage: true,
  });
  await page.evaluate(() => {
    document.documentElement.style.zoom = "2";
  });
  await check();
  await page.evaluate(() => {
    document.documentElement.style.zoom = "1";
  });
  await loginUI(page);
  await check();
  await page.screenshot({
    path: "test-results/admin-" + testInfo.project.name + ".png",
    fullPage: true,
  });
});
