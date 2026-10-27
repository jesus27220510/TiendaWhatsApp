import { money } from "./money.js";
import { AppError } from "../middleware/errors.js";
export function whatsapp(number, lines, totalCents) {
  const message = [
    "Hola, quisiera hacer este pedido:",
    ...lines.map(
      (l) =>
        l.name +
        " — " +
        l.quantity +
        " × " +
        money(l.priceCents) +
        " = " +
        money(l.subtotalCents),
    ),
    "",
    "Total referencial: " + money(totalCents),
    "La disponibilidad y la entrega se coordinan con el vendedor.",
  ].join("\n");
  const whatsappUrl =
    "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
  if (whatsappUrl.length > 8000)
    throw new AppError(
      422,
      "MESSAGE_TOO_LONG",
      "El mensaje es demasiado largo. Reduce los productos del carrito.",
    );
  return { message, whatsappUrl };
}
