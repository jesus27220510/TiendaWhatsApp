import { AppError } from "./errors.js";
export function requireAdmin(req, res, next) {
  if (!req.session?.adminId)
    return next(
      new AppError(401, "UNAUTHORIZED", "Inicia sesión para administrar."),
    );
  next();
}
export function expireSession(now = Date.now) {
  return (req, res, next) => {
    if (
      req.session.adminId &&
      (now() - req.session.authenticatedAt >= 28800000 ||
        now() - req.session.lastActivity >= 1800000)
    ) {
      return req.session.destroy((err) => {
        res.clearCookie("tienda.sid", { path: "/" });
        if (err) return next(err);
        next(
          new AppError(
            401,
            "SESSION_EXPIRED",
            "La sesión expiró. Ingresa nuevamente.",
          ),
        );
      });
    }
    if (req.session.adminId) {
      req.session.lastActivity = now();
      req.session.cookie.maxAge = Math.min(
        1800000,
        28800000 - (now() - req.session.authenticatedAt),
      );
    }
    next();
  };
}
