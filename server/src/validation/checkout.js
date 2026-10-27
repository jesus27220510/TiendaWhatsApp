import { fields, uuid, text, invalid } from "./common.js";
import { AppError } from "../middleware/errors.js";
export function validateCheckout(b) {
  fields(b, ["items"]);
  if (!Array.isArray(b.items)) invalid("items", "Lista de productos inválida.");
  if (!b.items.length)
    throw new AppError(422, "EMPTY_CART", "Tu carrito está vacío.");
  const seen = new Set();
  return b.items.map((item) => {
    fields(item, ["productId", "name", "priceCents", "quantity"]);
    uuid(item.productId);
    if (seen.has(item.productId))
      invalid("items", "Un producto está repetido.");
    seen.add(item.productId);
    text(item.name, "name", 1, 100);
    if (
      !Number.isInteger(item.priceCents) ||
      item.priceCents < 1 ||
      item.priceCents > 99999999
    )
      invalid("priceCents", "Precio inválido.");
    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 999
    )
      throw new AppError(422, "INVALID_QUANTITY", "Cantidad entre 1 y 999.", {
        quantity: "Usa una cantidad entera de 1 a 999.",
      });
    return item;
  });
}
