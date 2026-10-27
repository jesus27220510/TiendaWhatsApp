import { AppError } from "./errors.js";
export function loginLimit(counter) {
  return (req, res, next) => {
    const retry = counter.retry(req.body.username, req.ip);
    if (retry) {
      res.set("Retry-After", String(retry));
      return next(
        new AppError(
          429,
          "LOGIN_LIMIT",
          "Demasiados intentos. Espera antes de volver a ingresar.",
        ),
      );
    }
    next();
  };
}
