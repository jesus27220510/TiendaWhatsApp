import { test, expect } from "vitest";
import { parsePrice, money } from "../src/utils/money.js";
test("céntimos exactos sin redondear", () => {
  expect(parsePrice("12,50")).toBe(1250);
  expect(money(3300)).toBe("S/ 33.00");
  for (const v of ["0", "-1", "1.001", "1,000.00", "x"])
    expect(() => parsePrice(v)).toThrow();
});
