import { Router } from "express";
import { getSettings } from "../db/settings.js";
export function storeRoutes(db) {
  const r = Router();
  r.get("/", (req, res) =>
    res.json({
      data: {
        whatsappConfigured: /^519\d{8}$/.test(
          getSettings(db).whatsappNumber || "",
        ),
      },
    }),
  );
  return r;
}
