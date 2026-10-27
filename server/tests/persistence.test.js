import { test, expect } from "vitest";
import { fixture, product } from "./helpers/database.js";
import { createApp } from "../src/app.js";
import {
  saveProduct,
  updateProduct,
  deleteProduct,
  listProducts,
} from "../src/db/products.js";
import { saveSettings, getSettings } from "../src/db/settings.js";
test("reinicio conserva alta, edición, borrado y número", async () => {
  const f = await fixture();
  try {
    const p = product(),
      removed = product();
    saveProduct(f.app.locals.db, p);
    saveProduct(f.app.locals.db, removed);
    updateProduct(f.app.locals.db, p.id, {
      ...p,
      priceCents: 1500,
      version: 1,
    });
    deleteProduct(f.app.locals.db, removed.id, 1);
    saveSettings(f.app.locals.db, {
      whatsappNumber: "51999888777",
      version: 1,
    });
    f.app.locals.close();
    f.app = await createApp(f.config);
    expect(listProducts(f.app.locals.db)).toMatchObject([
      { id: p.id, priceCents: 1500, version: 2 },
    ]);
    expect(getSettings(f.app.locals.db).whatsappNumber).toBe("51999888777");
  } finally {
    f.app.locals.close();
    f.close();
  }
});
