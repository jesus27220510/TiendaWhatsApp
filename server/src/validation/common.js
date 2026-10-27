import { AppError } from "../middleware/errors.js";
export const invalid = (field, message) => {
  throw new AppError(422, "VALIDATION_ERROR", "Revisa los datos ingresados.", {
    [field]: message,
  });
};
export function fields(body, keys) {
  if (!body || typeof body !== "object" || Array.isArray(body))
    invalid("form", "Datos inválidos.");
  for (const k of Object.keys(body))
    if (!keys.includes(k)) invalid(k, "Campo no permitido.");
}
export function text(value, key, min, max) {
  if (typeof value !== "string") invalid(key, "Ingresa texto.");
  const v = value.trim();
  if ([...v].length < min || [...v].length > max)
    invalid(key, "Debe tener entre " + min + " y " + max + " caracteres.");
  return v;
}
export function uuid(v) {
  if (
    typeof v !== "string" ||
    !/^([0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i.test(
      v,
    )
  )
    invalid("id", "Identificador inválido.");
  return v;
}
export function version(v) {
  if (!Number.isSafeInteger(v) || v < 1)
    invalid("version", "Versión inválida.");
  return v;
}
