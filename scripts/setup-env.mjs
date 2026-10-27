import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
const target = new URL("../.env", import.meta.url);
if (existsSync(target)) {
  console.log(".env ya existe; se conserva sin cambios.");
} else {
  const example = readFileSync(
    new URL("../.env.example", import.meta.url),
    "utf8",
  );
  writeFileSync(
    target,
    example.replace(
      /^SESSION_SECRET=.*$/m,
      "SESSION_SECRET=" + randomBytes(32).toString("hex"),
    ),
    { flag: "wx", mode: 0o600 },
  );
  console.log(".env creado con secreto local aleatorio.");
}
