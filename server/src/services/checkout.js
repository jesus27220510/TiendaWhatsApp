import { getProduct } from "../db/products.js";
import { getSettings } from "../db/settings.js";
import { AppError } from "../middleware/errors.js";
import { whatsapp } from "./whatsapp.js";
export function checkout(db, items) {
  return db.transaction(() => {
    const number = getSettings(db).whatsappNumber;
    if (!/^519\d{8}$/.test(number || ""))
      throw new AppError(
        409,
        "WHATSAPP_UNAVAILABLE",
        "WhatsApp no está configurado. Intenta más tarde.",
      );
    const lines = [],
      changes = [];
    for (const item of items) {
      const p = getProduct(db, item.productId);
      if (!p) {
        changes.push({
          productId: item.productId,
          type: "removed",
          previousName: item.name,
        });
        continue;
      }
      if (p.name !== item.name || p.priceCents !== item.priceCents)
        changes.push({
          productId: p.id,
          type: "updated",
          previousName: item.name,
        });
      lines.push({
        productId: p.id,
        name: p.name,
        quantity: item.quantity,
        priceCents: p.priceCents,
        subtotalCents: p.priceCents * item.quantity,
      });
    }
    const totalCents = lines.reduce((s, l) => s + l.subtotalCents, 0);
    if (!Number.isSafeInteger(totalCents))
      throw new AppError(
        422,
        "INVALID_TOTAL",
        "El total excede el límite permitido.",
      );
    if (changes.length)
      throw new AppError(
        409,
        "CART_CHANGED",
        "El catálogo cambió. Revisa tu carrito y finaliza nuevamente.",
        undefined,
        { lines, totalCents, changes },
      );
    return {
      status: "ready",
      lines,
      totalCents,
      ...whatsapp(number, lines, totalCents),
    };
  })();
}
