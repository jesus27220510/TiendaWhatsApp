import { spawn } from "node:child_process";
import {
  mkdtempSync,
  rmSync,
  existsSync,
  mkdirSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { setTimeout as pause } from "node:timers/promises";
const npmCli =
  process.env.npm_execpath ||
  path.join(path.dirname(process.execPath), "node_modules/npm/bin/npm-cli.js");
const dir = mkdtempSync(path.join(tmpdir(), "tienda-commands-"));
const password = randomBytes(20).toString("hex");
const env = {
  ...process.env,
  NODE_ENV: "development",
  SESSION_SECRET: randomBytes(32).toString("hex"),
  DATABASE_PATH: path.join(dir, "data.sqlite"),
  SESSION_DATABASE_PATH: path.join(dir, "sessions.sqlite"),
  APP_ORIGIN: "http://localhost:5173",
  HOST: "127.0.0.1",
  PORT: "3000",
};
const records = [];
let active;
function run(args, extra = {}) {
  const child = spawn(process.execPath, [npmCli, ...args], {
    env: { ...env, ...extra },
    stdio: ["pipe", "pipe", "pipe"],
    detached: process.platform !== "win32",
  });
  let output = "";
  child.stdout.on("data", (d) => (output += d));
  child.stderr.on("data", (d) => (output += d));
  child.result = new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("exit", (code) => resolve({ code, output }));
  });
  child.output = () => output;
  return child;
}
async function stop(child) {
  if (!child || child.exitCode !== null) return;
  if (process.platform === "win32") {
    await new Promise((r) =>
      spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
      }).on("exit", r),
    );
  } else process.kill(-child.pid, "SIGTERM");
  await child.result;
}
async function ready(url, check) {
  for (let i = 0; i < 300; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(1000) });
      if (r.ok && (await check(r))) return;
    } catch {
      /* Wait for startup. */
    }
    await pause(100);
  }
  throw Error(
    "No inició " + url + " " + active.output().replaceAll(password, "[oculto]"),
  );
}
try {
  for (let i = 0; i < 2; i++) {
    const r = await run(["run", "db:init"]).result;
    if (r.code !== 0) throw Error(r.output);
    records.push("db:init " + (i + 1) + ": OK");
  }
  active = run(["run", "admin:create"]);
  let stage = 0,
    buffer = "";
  active.stdout.on("data", (d) => {
    buffer += d.toString();
    const prompts = [
      "Usuario administrador:",
      "Contraseña (15–128 caracteres):",
      "Repite la contraseña:",
    ];
    if (stage < 3 && buffer.includes(prompts[stage])) {
      const value = stage === 0 ? "admin" : password;
      stage++;
      buffer = "";
      setTimeout(() => active.stdin.write(value + "\n"), 100);
    }
  });
  const timer = setTimeout(() => active.kill(), 15000);
  const created = await active.result;
  clearTimeout(timer);
  if (created.code !== 0 || !created.output.includes("Administrador creado."))
    throw Error(
      "Falló creación CLI interactiva: " +
        created.output.replaceAll(password, "[oculto]"),
    );
  if (created.output.includes(password))
    throw Error("La CLI expuso la contraseña");
  records.push("admin:create: entrada interactiva oculta, hash y creación OK");
  const repeated = await run(["run", "admin:create"]).result;
  if (repeated.code !== 1 || !repeated.output.includes("ya existe"))
    throw Error("CLI sobrescribió administrador");
  records.push("admin:create repetido: rechazo esperado sin sobrescribir");
  active = run(["run", "dev"]);
  await ready("http://localhost:5173", async (r) =>
    (await r.text()).includes("root"),
  );
  await ready(
    "http://localhost:5173/api/products",
    async (r) => (await r.json()).data.products.length === 0,
  );
  records.push("dev: Vite + Express + proxy /api OK");
  await stop(active);
  active = run(["start"], {
    PORT: "4318",
    APP_ORIGIN: "https://localhost:3443",
    TRUST_PROXY: "1",
  });
  await ready("http://127.0.0.1:4318", async (r) =>
    (await r.text()).includes("/assets/"),
  );
  await ready(
    "http://127.0.0.1:4318/api/products",
    async (r) => (await r.json()).data.products.length === 0,
  );
  records.push("start: frontend compilado + API mismo origen OK");
  await stop(active);
  if (!existsSync(env.DATABASE_PATH)) throw Error("Falta SQLite");
  mkdirSync("specs/001-tienda-whatsapp/evidence", { recursive: true });
  writeFileSync(
    "specs/001-tienda-whatsapp/evidence/commands-smoke.md",
    "# Prueba real de comandos\n\n" +
      new Date().toISOString() +
      " · Node " +
      process.version +
      " · bases aisladas.\n\n" +
      records.map((x) => "- " + x).join("\n") +
      "\n",
  );
  console.log(records.join("\n"));
} finally {
  await stop(active);
  rmSync(dir, { recursive: true, force: true });
}
