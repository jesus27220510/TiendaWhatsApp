import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
export function loadConfig(env = process.env) {
  if (env === process.env)
    dotenv.config({ path: path.join(root, ".env"), quiet: true });
  const production = env.NODE_ENV === "production";
  const port = Number(env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("PORT inválido.");
  let origin;
  try {
    const url = new URL(env.APP_ORIGIN || "http://localhost:5173");
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.origin !== url.href.replace(/\/$/, "")
    )
      throw Error();
    origin = url.origin;
    if (production && url.protocol !== "https:") throw Error();
  } catch {
    throw new Error("APP_ORIGIN inválido; producción requiere HTTPS.");
  }
  const secret = env.SESSION_SECRET || "";
  if (!/^[a-f0-9]{64,}$/i.test(secret))
    throw new Error(
      "SESSION_SECRET requiere al menos 32 bytes aleatorios en hexadecimal.",
    );
  let trustProxy = false;
  if (env.TRUST_PROXY && env.TRUST_PROXY !== "false") {
    if (!/^\d+$/.test(env.TRUST_PROXY) || Number(env.TRUST_PROXY) < 1)
      throw new Error(
        "TRUST_PROXY debe ser false o un número explícito de saltos.",
      );
    trustProxy = Number(env.TRUST_PROXY);
  }
  return {
    production,
    port,
    origin,
    secret,
    host: env.HOST || "127.0.0.1",
    trustProxy,
    database: path.resolve(
      root,
      env.DATABASE_PATH || "server/data/tienda.sqlite",
    ),
    sessions: path.resolve(
      root,
      env.SESSION_DATABASE_PATH || "server/data/sessions.sqlite",
    ),
    log: env.NODE_ENV !== "test",
  };
}
