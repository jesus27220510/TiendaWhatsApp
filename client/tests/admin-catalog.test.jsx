import React from "react";
import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductForm from "../src/components/ProductForm.jsx";
import SellerSettings from "../src/components/SellerSettings.jsx";
import { api } from "../src/services/api.js";
vi.mock("../src/services/api.js", () => ({ api: vi.fn() }));
test("precio inválido, imagen opcional y reintento mantienen identidad y entradas", async () => {
  api.mockReset().mockRejectedValue(new Error("No se pudo guardar"));
  render(
    <ProductForm
      onSaved={() => {}}
      onCancel={() => {}}
      onUnauthorized={() => {}}
    />,
  );
  fireEvent.change(screen.getByLabelText("Nombre"), {
    target: { value: "Café" },
  });
  fireEvent.change(screen.getByLabelText("Descripción"), {
    target: { value: "Bolsa" },
  });
  const price = screen.getByLabelText("Precio en soles");
  fireEvent.change(price, { target: { value: "0" } });
  fireEvent.submit(
    screen.getByRole("button", { name: "Guardar producto" }).closest("form"),
  );
  expect(await screen.findByRole("alert")).toBeInTheDocument();
  expect(api).not.toHaveBeenCalled();
  fireEvent.change(price, { target: { value: "12,50" } });
  fireEvent.submit(price.closest("form"));
  await screen.findByText("No se pudo guardar");
  const id = api.mock.calls[0][1].body.id;
  expect(api.mock.calls[0][1].body).toMatchObject({
    priceCents: 1250,
    imageUrl: null,
  });
  fireEvent.submit(price.closest("form"));
  await screen.findByText("No se pudo guardar");
  expect(api.mock.calls[1][1].body.id).toBe(id);
  expect(screen.getByLabelText("Nombre")).toHaveValue("Café");
});
test("vendedor puede retirar número conservando versión", async () => {
  api
    .mockReset()
    .mockResolvedValueOnce({ whatsappNumber: "51999888777", version: 1 })
    .mockResolvedValueOnce({ whatsappNumber: null, version: 2 });
  render(<SellerSettings onUnauthorized={() => {}} />);
  const input = await screen.findByDisplayValue("51999888777");
  fireEvent.change(input, { target: { value: "" } });
  fireEvent.submit(input.closest("form"));
  expect(await screen.findByText(/Número retirado/)).toBeInTheDocument();
  expect(api.mock.calls[1][1].body).toEqual({
    whatsappNumber: null,
    version: 1,
  });
});
