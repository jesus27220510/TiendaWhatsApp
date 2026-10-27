export function money(cents) {
  return (
    "S/ " +
    new Intl.NumberFormat("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: false,
    }).format(cents / 100)
  );
}
export function parsePrice(value) {
  const v = String(value).trim();
  if (!/^\d{1,6}([.,]\d{1,2})?$/.test(v))
    throw new Error("Ingresa un precio válido, con hasta dos decimales.");
  const [whole, decimal = ""] = v.replace(",", ".").split(".");
  const cents = Number(whole) * 100 + Number(decimal.padEnd(2, "0"));
  if (cents < 1 || cents > 99999999)
    throw new Error("El precio debe estar entre S/ 0.01 y S/ 999999.99.");
  return cents;
}
