import { Router } from "express";
import { listProducts } from "../db/products.js";
export function catalogRoutes(db) {
  const r = Router();
  r.get("/", (req, res) => res.json({ data: { products: listProducts(db) } }));
  return r;
}
