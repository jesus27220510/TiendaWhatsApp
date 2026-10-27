import { test as base, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
export const samples = [
  {
    name: "Café molido",
    description: "Café peruano, bolsa de 250 g.",
    priceCents: 1250,
    imageUrl: null,
  },
  {
    name: "Té verde",
    description: "Infusión natural, caja de 20 sobres.",
    priceCents: 800,
    imageUrl: "https://images.example.test/missing.jpg",
  },
  {
    name: "Cafetera",
    description: "Para compartir en casa.",
    priceCents: 4500,
    imageUrl: null,
  },
];
export const test = base.extend({
  adminApi: async ({ playwright, baseURL }, use) => {
    const api = await playwright.request.newContext({
      baseURL,
      ignoreHTTPSErrors: true,
    });
    const c = await (await api.get("/api/auth/csrf")).json();
    const r = await api.post("/api/auth/login", {
      headers: { Origin: baseURL, "X-CSRF-Token": c.data.csrfToken },
      data: { username: "admin", password: process.env.E2E_PASSWORD },
    });
    expect(r.ok()).toBeTruthy();
    const { data } = await r.json();
    const headers = { Origin: baseURL, "X-CSRF-Token": data.csrfToken };
    const change = async (method, url, body) =>
      api.fetch(url, { method, headers, data: body });
    for (const p of (await (await api.get("/api/admin/products")).json()).data
      .products)
      await change("DELETE", "/api/admin/products/" + p.id, {
        version: p.version,
      });
    const products = [];
    for (const sample of samples) {
      const result = await change("POST", "/api/admin/products", {
        ...sample,
        id: randomUUID(),
      });
      products.push((await result.json()).data.product);
    }
    const settings = (await (await api.get("/api/admin/settings")).json()).data;
    await change("PUT", "/api/admin/settings", {
      whatsappNumber: "51999888777",
      version: settings.version,
    });
    await use({ api, change, products });
    await api.dispose();
  },
});
export { expect };
export async function loginUI(page) {
  await page.goto("/admin");
  await page.getByLabel("Usuario", { exact: true }).fill("admin");
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill(process.env.E2E_PASSWORD);
  await page.getByRole("button", { name: "Ingresar al panel" }).click();
  await expect(
    page.getByRole("heading", { name: "Tu catálogo, al día." }),
  ).toBeVisible();
}
export async function addAB(page) {
  await page
    .getByRole("button", { name: "Agregar Café molido", exact: true })
    .click({ clickCount: 2 });
  await page
    .getByRole("button", { name: "Agregar Té verde", exact: true })
    .click();
}
