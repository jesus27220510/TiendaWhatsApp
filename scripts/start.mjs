import { existsSync } from "node:fs";
if (!existsSync(new URL("../client/dist/index.html", import.meta.url)))
  throw new Error("Falta la compilación. Ejecuta npm run build.");
process.env.NODE_ENV = "production";
await import("../server/src/index.js");
