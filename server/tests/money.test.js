import { test, expect } from "vitest";
import { money } from "../src/services/money.js";
test("soles exactos con dos decimales", () => {
  expect(money(1)).toBe("S/ 0.01");
  expect(money(3300)).toBe("S/ 33.00");
  expect(money(99999999)).toBe("S/ 999999.99");
});
