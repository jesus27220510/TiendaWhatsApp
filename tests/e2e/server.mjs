import https from "node:https";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";
import selfsigned from "selfsigned";
import { createApp } from "../../server/src/app.js";
import { createAdmin } from "../../server/src/db/admin.js";
const dir = mkdtempSync(path.join(tmpdir(), "tienda-e2e-"));
const config = {
  production: true,
  host: "127.0.0.1",
  port: 4317,
  origin: "https://127.0.0.1:4317",
  secret: randomBytes(32).toString("hex"),
  database: path.join(dir, "data.sqlite"),
  sessions: path.join(dir, "sessions.sqlite"),
  trustProxy: false,
  log: false,
};
const app = await createApp(config);
await createAdmin(app.locals.db, "admin", process.env.E2E_PASSWORD);
const cert = await selfsigned.generate(
  [{ name: "commonName", value: "localhost" }],
  {
    days: 1,
    keySize: 2048,
    extensions: [
      {
        name: "subjectAltName",
        altNames: [
          { type: 7, ip: "127.0.0.1" },
          { type: 2, value: "localhost" },
        ],
      },
    ],
  },
);
const server = https
  .createServer({ key: cert.private, cert: cert.cert }, app)
  .listen(config.port, config.host);
function stop() {
  server.close(() => {
    app.locals.close();
    rmSync(dir, { recursive: true, force: true });
    process.exit(0);
  });
  server.closeAllConnections();
}
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
