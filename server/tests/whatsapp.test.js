import { test, expect } from "vitest";
import { whatsapp } from "../src/services/whatsapp.js";
test("enlace wa.me codificado una sola vez con todas las líneas e importes", () => {
  const lines = [
    {
      name: "Café & ñ 100%",
      quantity: 2,
      priceCents: 1250,
      subtotalCents: 2500,
    },
    { name: "Té verde", quantity: 1, priceCents: 800, subtotalCents: 800 },
  ];
  const { message, whatsappUrl } = whatsapp("51999888777", lines, 3300);
  expect(whatsappUrl).toBe(
    "https://wa.me/51999888777?text=" + encodeURIComponent(message),
  );
  expect(new URL(whatsappUrl).searchParams.get("text")).toBe(message);
  expect(message).toContain("Café & ñ 100% — 2 × S/ 12.50 = S/ 25.00");
  expect(message).toContain("Té verde — 1 × S/ 8.00 = S/ 8.00");
  expect(message).toContain("Total referencial: S/ 33.00");
  expect(whatsappUrl).not.toMatch(/\s/);
});
