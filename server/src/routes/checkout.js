import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { validateCheckout } from "../validation/checkout.js";
import { checkout } from "../services/checkout.js";
import { AppError } from "../middleware/errors.js";
export function checkoutRoutes(db) {
  const r = Router();
  r.use(
    rateLimit({
      windowMs: 60000,
      limit: 60,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      handler: (_req, _res, next) =>
        next(
          new AppError(
            429,
            "RATE_LIMIT",
            "Espera un momento antes de volver a intentar.",
          ),
        ),
    }),
  );
  r.post("/", (req, res) =>
    res.json({ data: checkout(db, validateCheckout(req.body)) }),
  );
  return r;
}
