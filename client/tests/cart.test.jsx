import React from "react";
import { test, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { CartProvider, useCart } from "../src/state/CartProvider.jsx";
import Cart from "../src/components/Cart.jsx";
function Harness() {
  const { dispatch } = useCart();
  return (
    <>
      <button
        onClick={() =>
          dispatch({
            type: "add",
            product: { id: "a", name: "A", priceCents: 1250 },
          })
        }
      >
        A
      </button>
      <button
        onClick={() =>
          dispatch({
            type: "add",
            product: { id: "b", name: "B", priceCents: 800 },
          })
        }
      >
        B
      </button>
      <Cart />
    </>
  );
}
test("A/B, cantidad inválida restaurada y retiro final", () => {
  render(
    <CartProvider>
      <Harness />
    </CartProvider>,
  );
  expect(
    screen.getByRole("button", { name: /Finalizar pedido/ }),
  ).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "A", exact: true }));
  fireEvent.click(screen.getByRole("button", { name: "A", exact: true }));
  fireEvent.click(screen.getByRole("button", { name: "B", exact: true }));
  const total = document.querySelector(".total");
  expect(within(total).getByText("S/ 33.00")).toBeInTheDocument();
  let input = screen.getByLabelText("Cantidad de A");
  fireEvent.change(input, { target: { value: "3" } });
  fireEvent.blur(input);
  expect(within(total).getByText("S/ 45.50")).toBeInTheDocument();
  input = screen.getByLabelText("Cantidad de A");
  fireEvent.change(input, { target: { value: "0" } });
  fireEvent.blur(input);
  expect(input).toHaveValue("3");
  expect(screen.getByRole("alert")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Quitar B" }));
  expect(within(total).getByText("S/ 37.50")).toBeInTheDocument();
});
