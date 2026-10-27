import { performance } from "node:perf_hooks";
import { cpus, totalmem, platform } from "node:os";
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { fixture, product } from "../../server/tests/helpers/database.js";
import { saveProduct } from "../../server/src/db/products.js";
import { createApp } from "../../server/src/app.js";
const f = await fixture();
let server, browser;
try {
  f.app.locals.close();
  f.app = await createApp({ ...f.config, serveStatic: true });
  f.app.locals.db.transaction(() => {
    for (let i = 0; i < 500; i++)
      saveProduct(
        f.app.locals.db,
        product({ name: "Producto " + String(i).padStart(4, "0") }),
      );
  })();
  server = f.app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  const url = "http://127.0.0.1:" + server.address().port;
  const samples = [];
  await fetch(url + "/api/products");
  await Promise.all(
    Array.from({ length: 20 }, async () => {
      for (let i = 0; i < 10; i++) {
        const start = performance.now();
        const r = await fetch(url + "/api/products");
        if (!r.ok) throw Error("HTTP " + r.status);
        await r.json();
        samples.push(performance.now() - start);
      }
    }),
  );
  browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1366, height: 768 },
  });
  await page.goto(url);
  await page.locator(".product-card").last().waitFor();
  const filter = [];
  for (let i = 0; i < 20; i++) {
    await page.getByLabel("Buscar productos").fill("");
    const start = performance.now();
    await page.getByLabel("Buscar productos").fill("0499");
    await page.waitForFunction(
      () => document.querySelectorAll(".product-card").length === 1,
    );
    filter.push(performance.now() - start);
  }
  const p95 = (a) => a.sort((x, y) => x - y)[Math.ceil(a.length * 0.95) - 1];
  const result = {
    date: new Date().toISOString(),
    node: process.version,
    os: platform(),
    cpu: cpus()[0].model,
    ramGiB: Math.round(totalmem() / 2 ** 30),
    products: 500,
    concurrentReaders: 20,
    requests: 200,
    apiP95Ms: +p95(samples).toFixed(2),
    filterP95Ms: +p95(filter).toFixed(2),
  };
  result.passed = result.apiP95Ms < 500 && result.filterP95Ms < 300;
  mkdirSync("specs/001-tienda-whatsapp/evidence", { recursive: true });
  writeFileSync(
    "specs/001-tienda-whatsapp/evidence/performance.md",
    "# Rendimiento medido\n\nPerfil local sin imágenes externas, Chromium, API y navegador en el mismo equipo. No representa un servidor público ni latencia de internet.\n\n```json\n" +
      JSON.stringify(result, null, 2) +
      "\n```\n",
  );
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server) {
    server.closeAllConnections();
    await new Promise((r) => server.close(r));
  }
  f.app.locals.close();
  f.close();
}
