const normalize = (s) =>
  s.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("es-PE").trim();
export const searchProducts = (products, query) =>
  products.filter((p) => normalize(p.name).includes(normalize(query)));
