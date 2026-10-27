import React from "react";
import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "../src/components/ProductCard.jsx";
import StorePage from "../src/pages/StorePage.jsx";
import { CartProvider } from "../src/state/CartProvider.jsx";
import { api } from "../src/services/api.js";
vi.mock("../src/services/api.js", () => ({ api: vi.fn() }));
test("tarjeta muestra soles, escapa texto y ofrece imagen de respaldo", () => {
  render(
    <ProductCard
      product={{
        id: "1",
        name: "<script>",
        description: "Detalle",
        priceCents: 1250,
        imageUrl: "https://example.test/a.jpg",
      }}
      onAdd={() => {}}
    />,
  );
  expect(screen.getByText("S/ 12.50")).toBeInTheDocument();
  fireEvent.error(screen.getByRole("img"));
  expect(screen.getByText("Imagen no disponible")).toBeInTheDocument();
  expect(document.querySelector("script")).toBeNull();
});
test("catálogo distingue carga, error recuperable y vacío", async () => {
  let reads = 0;
  api.mockReset().mockImplementation((path) => {
    if (path === "/store") return Promise.resolve({ whatsappConfigured: true });
    return reads++ === 0
      ? Promise.reject(new Error("No se pudo acceder a los datos."))
      : Promise.resolve({ products: [] });
  });
  render(
    <CartProvider>
      <StorePage />
    </CartProvider>,
  );
  expect(screen.getByText("Cargando productos…")).toBeInTheDocument();
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "No se pudo acceder",
  );
  fireEvent.click(screen.getByText("Reintentar"));
  expect(await screen.findByText("Aún no hay productos")).toBeInTheDocument();
});
