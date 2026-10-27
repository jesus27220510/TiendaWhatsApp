import { Router } from "express";
import { randomBytes } from "node:crypto";
import argon2 from "argon2";
import { csrf } from "../middleware/csrf.js";
import { requireAdmin } from "../middleware/auth.js";
import { loginLimit } from "../middleware/login-limit.js";
import { fields, text, invalid } from "../validation/common.js";
import { AppError } from "../middleware/errors.js";
export function authRoutes(db, config, counter, dummyHash, now) {
  const r = Router();
  r.get("/csrf", (req, res) => {
    req.session.csrfToken ||= randomBytes(32).toString("hex");
    res.json({ data: { csrfToken: req.session.csrfToken } });
  });
  r.post(
    "/login",
    csrf(config.origin),
    (req, res, next) => {
      try {
        fields(req.body, ["username", "password"]);
        req.body.username = text(
          req.body.username,
          "username",
          3,
          64,
        ).toLowerCase();
        if (
          typeof req.body.password !== "string" ||
          req.body.password.length > 256
        )
          invalid("password", "Contraseña inválida.");
        next();
      } catch (e) {
        next(e);
      }
    },
    loginLimit(counter),
    async (req, res) => {
      const admin = db
        .prepare("SELECT * FROM admins WHERE username=?")
        .get(req.body.username);
      const valid = await argon2.verify(
        admin?.password_hash || dummyHash,
        req.body.password,
      );
      if (!admin || !valid) {
        counter.fail(req.body.username, req.ip);
        throw new AppError(
          401,
          "INVALID_CREDENTIALS",
          "Usuario o contraseña incorrectos.",
        );
      }
      counter.success(req.body.username, req.ip);
      await new Promise((resolve, reject) =>
        req.session.regenerate((e) => (e ? reject(e) : resolve())),
      );
      req.session.adminId = admin.id;
      req.session.username = admin.username;
      req.session.authenticatedAt = now();
      req.session.lastActivity = now();
      req.session.csrfToken = randomBytes(32).toString("hex");
      res.json({
        data: {
          admin: { username: admin.username },
          csrfToken: req.session.csrfToken,
        },
      });
    },
  );
  r.get("/me", requireAdmin, (req, res) =>
    res.json({ data: { admin: { username: req.session.username } } }),
  );
  r.post("/logout", requireAdmin, csrf(config.origin), (req, res, next) =>
    req.session.destroy((e) => {
      if (e) return next(e);
      res.clearCookie("tienda.sid", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: config.production,
      });
      res.status(204).end();
    }),
  );
  return r;
}
