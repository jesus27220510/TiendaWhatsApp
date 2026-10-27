import { timingSafeEqual } from "node:crypto";
import { AppError } from "./errors.js";
export const csrf = (origin) => (req, res, next) => {
  const provided = String(req.get("X-CSRF-Token") || ""),
    expected = req.session?.csrfToken || "";
  if (
    req.get("Origin") !== origin ||
    !expected ||
    Buffer.byteLength(provided) !== Buffer.byteLength(expected) ||
    !timingSafeEqual(Buffer.from(provided), Buffer.from(expected))
  )
    return next(
      new AppError(
        403,
        "FORBIDDEN",
        "La solicitud no está autorizada. Recarga la página.",
      ),
    );
  next();
};
