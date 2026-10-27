import React from "react";
import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider } from "../src/state/CartProvider.jsx";
import StorePage from "../src/pages/StorePage.jsx";
import { api } from "../src/services/api.js";
vi.mock("../src/services/api.js", () => ({ api: vi.fn() }));
test("búsqueda sin coincidencias, limpieza y carrito independiente", async () => {
  api.mockImplementation((path) =>
    Promise.resolve(
      path === "/store"
        ? { whatsappConfigured: true }
        : {
            products: [
              { id: "a", name: "Café", description: "Bolsa", priceCents: 1250 },
            ],
          },
    ),
  );
  render(
    <CartProvider>
      <StorePage />
    </CartProvider>,
  );
  fireEvent.click(await screen.findByRole("button", { name: "Agregar Café" }));
  fireEvent.change(screen.getByLabelText("Buscar productos"), {
    target: { value: "xxx" },
  });
  expect(screen.getByText("No se encontraron productos")).toBeInTheDocument();
  expect(screen.getByLabelText("Cantidad de Café")).toHaveValue("1");
  fireEvent.click(screen.getByRole("button", { name: "Limpiar" }));
  expect(
    screen.getByRole("button", { name: "Agregar Café" }),
  ).toBeInTheDocument();
});
