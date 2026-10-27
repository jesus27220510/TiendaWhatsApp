import { Router } from "express";
import { getSettings, saveSettings } from "../db/settings.js";
import { validateSettings } from "../validation/settings.js";
export function adminSettings(db, csrf) {
  const r = Router();
  r.get("/", (req, res) => res.json({ data: getSettings(db) }));
  r.put("/", csrf, (req, res) =>
    res.json({ data: saveSettings(db, validateSettings(req.body)) }),
  );
  return r;
}
