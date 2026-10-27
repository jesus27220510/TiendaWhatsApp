import { test, expect } from "vitest";
import { loadConfig, root } from "../src/config.js";
import { randomBytes } from "node:crypto";
test("configuración estricta sin divulgar secretos", () => {
  const env = { SESSION_SECRET: randomBytes(32).toString("hex") };
  expect(loadConfig(env).database.startsWith(root)).toBe(true);
  for (const bad of [
    { PORT: "65536" },
    { PORT: "0" },
    { APP_ORIGIN: "http://x/path" },
    { NODE_ENV: "production" },
    { SESSION_SECRET: "short" },
    { TRUST_PROXY: "true" },
  ])
    expect(() => loadConfig({ ...env, ...bad })).toThrow();
  expect(
    loadConfig({
      ...env,
      NODE_ENV: "production",
      APP_ORIGIN: "https://tienda.test",
      TRUST_PROXY: "1",
    }).trustProxy,
  ).toBe(1);
});
