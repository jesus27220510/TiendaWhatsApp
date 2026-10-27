import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";
const run = (args) => {
  const r = spawnSync(process.execPath, args, { stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status || 1);
};
run(["node_modules/vite/bin/vite.js", "build", "client"]);
for (const root of ["server/src", "server/scripts", "scripts"])
  for (const f of readdirSync(root, { recursive: true }))
    if (/\.(js|mjs)$/.test(f)) run(["--check", path.join(root, f)]);
