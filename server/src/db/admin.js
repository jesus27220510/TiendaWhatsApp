import argon2 from "argon2";
import { text, invalid } from "../validation/common.js";
export const hashPassword = (p) =>
  argon2.hash(p, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
export async function createAdmin(db, username, password) {
  const u = text(username, "username", 3, 64).toLowerCase();
  if (
    typeof password !== "string" ||
    [...password].length < 15 ||
    [...password].length > 128
  )
    invalid("password", "La contraseña debe tener entre 15 y 128 caracteres.");
  if (db.prepare("SELECT 1 FROM admins").get())
    throw new Error("El administrador ya existe; no se sobrescribió.");
  const hash = await hashPassword(password);
  db.prepare("INSERT INTO admins VALUES(1,?,?,?)").run(
    u,
    hash,
    new Date().toISOString(),
  );
}
