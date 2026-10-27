export function money(cents) {
  if (!Number.isSafeInteger(cents) || cents < 0)
    throw new Error("Importe inválido");
  return (
    "S/ " +
    new Intl.NumberFormat("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: false,
    }).format(cents / 100)
  );
}
