import { AppError } from "../middleware/errors.js";
const columns =
  "id,name,description,price_cents AS priceCents,image_url AS imageUrl,version";
export const listProducts = (db) =>
  db
    .prepare(
      "SELECT " + columns + " FROM products ORDER BY name COLLATE NOCASE,id",
    )
    .all();
export const getProduct = (db, id) =>
  db.prepare("SELECT " + columns + " FROM products WHERE id=?").get(id);
export function saveProduct(db, p) {
  return db.transaction(() => {
    const old = getProduct(db, p.id);
    if (old) {
      if (
        ["name", "description", "priceCents", "imageUrl"].every(
          (k) => old[k] === p[k],
        )
      )
        return { product: old, created: false };
      throw new AppError(
        409,
        "DUPLICATE_ID",
        "El producto ya existe con otros datos. Recarga la lista.",
      );
    }
    const now = new Date().toISOString();
    db.prepare("INSERT INTO products VALUES(?,?,?,?,?,1,?,?)").run(
      p.id,
      p.name,
      p.description,
      p.priceCents,
      p.imageUrl,
      now,
      now,
    );
    return { product: getProduct(db, p.id), created: true };
  })();
}
export function updateProduct(db, id, p) {
  return db.transaction(() => {
    const old = getProduct(db, id);
    if (!old) throw new AppError(404, "NOT_FOUND", "El producto ya no existe.");
    if (old.version !== p.version)
      throw new AppError(
        409,
        "VERSION_CONFLICT",
        "El producto cambió. Recarga sus datos antes de editar.",
      );
    db.prepare(
      "UPDATE products SET name=?,description=?,price_cents=?,image_url=?,version=version+1,updated_at=? WHERE id=?",
    ).run(
      p.name,
      p.description,
      p.priceCents,
      p.imageUrl,
      new Date().toISOString(),
      id,
    );
    return getProduct(db, id);
  })();
}
export function deleteProduct(db, id, v) {
  db.transaction(() => {
    const p = getProduct(db, id);
    if (!p) throw new AppError(404, "NOT_FOUND", "El producto ya no existe.");
    if (p.version !== v)
      throw new AppError(
        409,
        "VERSION_CONFLICT",
        "El producto cambió. Recarga la lista.",
      );
    db.prepare("DELETE FROM products WHERE id=?").run(id);
  })();
}
