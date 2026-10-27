import { test, expect, addAB } from "./fixtures.js";
test("abre mensaje externo sin enviar y conserva carrito", async ({
  page,
  context,
  adminApi,
}) => {
  expect(adminApi.products).toHaveLength(3);
  await context.route("https://wa.me/**", (r) =>
    r.fulfill({
      contentType: "text/html",
      body: "<p>Destino WhatsApp interceptado: ningún mensaje enviado.</p>",
    }),
  );
  await page.goto("/");
  await addAB(page);
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: /Finalizar pedido/ }).click();
  const popup = await popupPromise;
  await popup.waitForURL("https://wa.me/**");
  const url = new URL(popup.url());
  expect(url.pathname).toBe("/51999888777");
  expect(url.searchParams.get("text")).toContain("Total referencial: S/ 33.00");
  const message = url.searchParams.get("text");
  expect(message).toContain("Café molido — 2 × S/ 12.50 = S/ 25.00");
  expect(message).toContain("Té verde — 1 × S/ 8.00 = S/ 8.00");
  expect(popup.url()).toBe(
    "https://wa.me/51999888777?text=" + encodeURIComponent(message),
  );
  await popup.close();
  await expect(page.locator(".total")).toContainText("S/ 33.00");
});
test("cambio o eliminación requiere revisar; número ausente bloquea", async ({
  page,
  adminApi,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Agregar Café molido", exact: true })
    .click();
  const p = adminApi.products[0];
  const { id, ...values } = p;
  await adminApi.change("PUT", "/api/admin/products/" + id, {
    ...values,
    priceCents: 1400,
  });
  await page.getByRole("button", { name: /Finalizar pedido/ }).click();
  await expect(page.getByText(/El catálogo cambió/)).toBeVisible();
  await expect(page.locator(".total")).toContainText("S/ 14.00");
  await adminApi.change("DELETE", "/api/admin/products/" + id, { version: 2 });
  await page.getByRole("button", { name: /Finalizar pedido/ }).click();
  await expect(
    page.getByRole("button", { name: /Finalizar pedido/ }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Agregar Té verde", exact: true })
    .click();
  const s = (await (await adminApi.api.get("/api/admin/settings")).json()).data;
  await adminApi.change("PUT", "/api/admin/settings", {
    whatsappNumber: null,
    version: s.version,
  });
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(
    page.getByText("WhatsApp no está configurado. Intenta más tarde."),
  ).toBeVisible();
  await expect(page.getByLabel("Cantidad de Té verde")).toHaveValue("1");
});

test("sin vendedor muestra aviso y recupera la finalización al configurarlo", async ({
  page,
  adminApi,
}) => {
  const s = (await (await adminApi.api.get("/api/admin/settings")).json()).data;
  await adminApi.change("PUT", "/api/admin/settings", {
    whatsappNumber: null,
    version: s.version,
  });
  await page.goto("/");
  await expect(
    page.getByText("WhatsApp no está configurado. Intenta más tarde.", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Agregar Café molido", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: /Finalizar pedido/ }),
  ).toBeDisabled();
  await expect(page.getByLabel("Cantidad de Café molido")).toHaveValue("1");
  const absent = (await (await adminApi.api.get("/api/admin/settings")).json())
    .data;
  await adminApi.change("PUT", "/api/admin/settings", {
    whatsappNumber: "51999888777",
    version: absent.version,
  });
  await page.getByRole("button", { name: "Comprobar WhatsApp" }).click();
  await expect(
    page.getByRole("button", { name: /Finalizar pedido/ }),
  ).toBeEnabled();
});
test("respuesta diferida no abre un mensaje anterior al cambio de cantidad", async ({
  page,
  context,
  adminApi,
}) => {
  expect(adminApi.products).toHaveLength(3);
  await context.route("https://wa.me/**", (r) =>
    r.fulfill({ body: "Salida interceptada" }),
  );
  let release, ready;
  const gate = new Promise((r) => (release = r)),
    captured = new Promise((r) => (ready = r));
  await page.route("**/api/checkout", async (route) => {
    const response = await route.fetch();
    ready();
    await gate;
    await route.fulfill({ response });
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Agregar Café molido", exact: true })
    .click();
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: /Finalizar pedido/ }).click();
  const popup = await popupPromise;
  await captured;
  await page
    .getByRole("button", { name: "Agregar Café molido", exact: true })
    .click();
  release();
  await expect(page.getByText(/Tu carrito cambió/)).toBeVisible();
  expect(popup.isClosed()).toBe(true);
  await expect(page.getByLabel("Cantidad de Café molido")).toHaveValue("2");
  await expect(page.getByRole("link", { name: /Abrir mensaje/ })).toHaveCount(
    0,
  );
});
test("ventana bloqueada no mantiene el enlace después de vaciar el carrito", async ({
  page,
  adminApi,
}) => {
  expect(adminApi.products).toHaveLength(3);
  await page.addInitScript(() => {
    window.open = () => null;
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Agregar Café molido", exact: true })
    .click();
  await page.getByRole("button", { name: /Finalizar pedido/ }).click();
  await expect(page.getByRole("link", { name: /Abrir mensaje/ })).toBeVisible();
  await page.getByRole("button", { name: "Quitar Café molido" }).click();
  await expect(page.getByRole("link", { name: /Abrir mensaje/ })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("button", { name: /Finalizar pedido/ }),
  ).toBeDisabled();
  await expect(page.getByText(/Agrega al menos un producto/)).toBeVisible();
});
