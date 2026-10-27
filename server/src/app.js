import express from "express";
import helmet from "helmet";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { root } from "./config.js";
import { openDatabase } from "./db/connection.js";
import { migrate } from "./db/migrate.js";
import { hashPassword } from "./db/admin.js";
import { attempts } from "./db/login-attempts.js";
import { sessions } from "./middleware/session.js";
import { expireSession, requireAdmin } from "./middleware/auth.js";
import { csrf } from "./middleware/csrf.js";
import { errors, AppError } from "./middleware/errors.js";
import { requestLog } from "./middleware/request-log.js";
import { authRoutes } from "./routes/auth.js";
import { catalogRoutes } from "./routes/catalog.js";
import { storeRoutes } from "./routes/store.js";
import { checkoutRoutes } from "./routes/checkout.js";
import { adminProducts } from "./routes/admin-products.js";
import { adminSettings } from "./routes/admin-settings.js";
export async function createApp(config, { now = Date.now } = {}) {
  const db = openDatabase(config.database);
  migrate(db);
  const sessionDb = openDatabase(config.sessions);
  const { middleware, store } = sessions(sessionDb, config);
  const counter = attempts(sessionDb, now);
  const cleanupTimer = setInterval(() => {
    try {
      counter.cleanup();
    } catch {
      /* Next request reports storage errors through the API. */
    }
  }, 3600000);
  cleanupTimer.unref();
  const dummyHash = await hashPassword(randomBytes(32).toString("hex"));
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", config.trustProxy);
  app.use(requestLog(config.log));
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "img-src": ["'self'", "https:", "data:"],
          "upgrade-insecure-requests": config.production ? [] : null,
        },
      },
    }),
  );
  app.use("/api", (_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  app.use(
    "/api/checkout",
    express.json({ limit: "256kb" }),
    checkoutRoutes(db),
  );
  app.use(express.json({ limit: "16kb" }));
  app.use("/api/products", catalogRoutes(db));
  app.use("/api/store", storeRoutes(db));
  app.use(["/api/auth", "/api/admin"], middleware, expireSession(now));
  app.use("/api/auth", authRoutes(db, config, counter, dummyHash, now));
  app.use("/api/admin", requireAdmin);
  app.use("/api/admin/products", adminProducts(db, csrf(config.origin)));
  app.use("/api/admin/settings", adminSettings(db, csrf(config.origin)));
  app.use("/api", (_req, _res, next) =>
    next(new AppError(404, "NOT_FOUND", "Recurso no encontrado.")),
  );
  if (config.production || config.serveStatic) {
    app.use(express.static(path.join(root, "client/dist")));
    app.get("/{*path}", (_req, res) =>
      res.sendFile(path.join(root, "client/dist/index.html")),
    );
  }
  app.use(errors);
  Object.assign(app.locals, {
    db,
    sessionDb,
    store,
    close() {
      clearInterval(cleanupTimer);
      store.close();
      if (db.open) db.close();
      if (sessionDb.open) sessionDb.close();
    },
  });
  return app;
}
