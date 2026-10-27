import https from "node:https";
import http from "node:http";
import selfsigned from "selfsigned";
import { spawn } from "node:child_process";
import { loadConfig } from "../server/src/config.js";
const config = loadConfig();
const origin = "https://localhost:3443";
const cert = await selfsigned.generate(
  [{ name: "commonName", value: "localhost" }],
  {
    days: 1,
    keySize: 2048,
    extensions: [
      { name: "subjectAltName", altNames: [{ type: 2, value: "localhost" }] },
    ],
  },
);
const child = spawn(process.execPath, ["scripts/start.mjs"], {
  stdio: "inherit",
  env: {
    ...process.env,
    HOST: "127.0.0.1",
    PORT: String(config.port),
    APP_ORIGIN: origin,
    TRUST_PROXY: "1",
  },
});
const proxy = https
  .createServer({ key: cert.private, cert: cert.cert }, (req, res) => {
    const upstream = http.request(
      {
        host: "127.0.0.1",
        port: config.port,
        path: req.url,
        method: req.method,
        headers: {
          ...req.headers,
          "x-forwarded-proto": "https",
          "x-forwarded-for": req.socket.remoteAddress,
          "x-forwarded-host": "localhost:3443",
        },
      },
      (response) => {
        res.writeHead(response.statusCode, response.headers);
        response.pipe(res);
      },
    );
    upstream.on("error", () => {
      res.writeHead(503);
      res.end("El servidor está iniciando. Vuelve a intentar.");
    });
    req.pipe(upstream);
  })
  .listen(3443, "127.0.0.1", () =>
    console.log(
      origin + " — certificado local autofirmado, solo para pruebas.",
    ),
  );
function stop() {
  proxy.close();
  proxy.closeAllConnections();
  child.kill();
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
child.on("exit", (code) => {
  proxy.close();
  proxy.closeAllConnections();
  process.exitCode = code || 0;
});
