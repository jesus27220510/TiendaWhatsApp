import { input, password } from "@inquirer/prompts";
import { loadConfig } from "../src/config.js";
import { openDatabase } from "../src/db/connection.js";
import { migrate } from "../src/db/migrate.js";
import { createAdmin } from "../src/db/admin.js";
const db = openDatabase(loadConfig().database);
try {
  migrate(db);
  if (db.prepare("SELECT 1 FROM admins").get())
    throw new Error("El administrador ya existe.");
  const username = await input({ message: "Usuario administrador:" });
  const secret = await password({
    message: "Contraseña (15–128 caracteres):",
    mask: true,
  });
  const confirmation = await password({
    message: "Repite la contraseña:",
    mask: true,
  });
  if (secret !== confirmation) throw new Error("Las contraseñas no coinciden.");
  await createAdmin(db, username, secret);
  console.log("Administrador creado.");
} catch (e) {
  console.error(e.fields ? Object.values(e.fields).join(" ") : e.message);
  process.exitCode = 1;
} finally {
  db.close();
}
