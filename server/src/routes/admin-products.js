import { Router } from "express";
import { validateProduct } from "../validation/product.js";
import { fields, uuid, version } from "../validation/common.js";
import {
  listProducts,
  saveProduct,
  updateProduct,
  deleteProduct,
} from "../db/products.js";
export function adminProducts(db, csrf) {
  const r = Router();
  r.get("/", (req, res) => res.json({ data: { products: listProducts(db) } }));
  r.post("/", csrf, (req, res) => {
    const result = saveProduct(db, validateProduct(req.body));
    res
      .status(result.created ? 201 : 200)
      .json({ data: { product: result.product } });
  });
  r.put("/:id", csrf, (req, res) =>
    res.json({
      data: {
        product: updateProduct(
          db,
          uuid(req.params.id),
          validateProduct(req.body, "update"),
        ),
      },
    }),
  );
  r.delete("/:id", csrf, (req, res) => {
    fields(req.body, ["version"]);
    deleteProduct(db, uuid(req.params.id), version(req.body.version));
    res.status(204).end();
  });
  return r;
}
