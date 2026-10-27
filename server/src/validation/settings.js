import { fields, version, invalid } from "./common.js";
export function validateSettings(b) {
  fields(b, ["whatsappNumber", "version"]);
  const v = version(b.version);
  if (b.whatsappNumber === null || b.whatsappNumber === "")
    return { whatsappNumber: null, version: v };
  if (typeof b.whatsappNumber !== "string")
    invalid("whatsappNumber", "Número inválido.");
  let n = b.whatsappNumber.replace(/[ -]/g, "");
  if (/^9\d{8}$/.test(n)) n = "51" + n;
  if (n.startsWith("+")) n = n.slice(1);
  if (!/^519\d{8}$/.test(n))
    invalid(
      "whatsappNumber",
      "Ingresa un celular peruano de 9 dígitos, con 51 opcional.",
    );
  return { whatsappNumber: n, version: v };
}
