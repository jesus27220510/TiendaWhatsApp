import { fields, text, invalid, uuid, version } from "./common.js";
export function validateProduct(b, mode = "create") {
  fields(b, [
    "name",
    "description",
    "priceCents",
    "imageUrl",
    mode === "create" ? "id" : "version",
  ]);
  const name = text(b.name, "name", 1, 100),
    description = text(b.description, "description", 1, 1000);
  if (
    !Number.isInteger(b.priceCents) ||
    b.priceCents < 1 ||
    b.priceCents > 99999999
  )
    invalid("priceCents", "Ingresa un precio de S/ 0.01 a S/ 999999.99.");
  let imageUrl = b.imageUrl === null || b.imageUrl === "" ? null : b.imageUrl;
  if (imageUrl !== null) {
    try {
      if (typeof imageUrl !== "string" || imageUrl.length > 2048) throw Error();
      const u = new URL(imageUrl);
      if (u.protocol !== "https:" || u.username || u.password) throw Error();
    } catch {
      invalid(
        "imageUrl",
        "Usa una URL HTTPS válida, sin credenciales (máximo 2048 caracteres).",
      );
    }
  }
  return {
    name,
    description,
    priceCents: b.priceCents,
    imageUrl,
    ...(mode === "create"
      ? { id: uuid(b.id) }
      : { version: version(b.version) }),
  };
}
