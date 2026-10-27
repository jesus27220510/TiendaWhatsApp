import { test, expect } from "vitest";
import { searchProducts } from "../src/utils/search.js";
test("busca solo nombre sin tildes ni mayúsculas", () => {
  const list = [
    { name: "Café molido" },
    { name: "Cafetera" },
    { name: "Té", description: "cafe" },
  ];
  expect(searchProducts(list, " CAFE ")).toHaveLength(2);
  expect(searchProducts(list, "  ")).toHaveLength(3);
  expect(searchProducts(list, "x")).toEqual([]);
});
