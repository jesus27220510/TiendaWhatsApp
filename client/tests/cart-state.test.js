import { test, expect } from "vitest";
import { cartReducer, total } from "../src/state/cart.js";
test("agrupa IDs y calcula cantidades exactas", () => {
  let c = [];
  const a = { id: "a", name: "Igual", priceCents: 1250 };
  const b = { id: "b", name: "Igual", priceCents: 800 };
  c = cartReducer(c, { type: "add", product: a });
  c = cartReducer(c, { type: "add", product: a });
  c = cartReducer(c, { type: "add", product: b });
  expect(c).toHaveLength(2);
  expect(total(c)).toBe(3300);
  c = cartReducer(c, { type: "quantity", id: "a", quantity: 3 });
  expect(total(c)).toBe(4550);
  expect(cartReducer(c, { type: "quantity", id: "a", quantity: 0 })).toEqual(c);
  expect(total(cartReducer(c, { type: "remove", id: "b" }))).toBe(3750);
});
