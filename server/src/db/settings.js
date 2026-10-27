import { AppError } from "../middleware/errors.js";
export const getSettings = (db) =>
  db
    .prepare(
      "SELECT whatsapp_number AS whatsappNumber,version FROM settings WHERE id=1",
    )
    .get();
export function saveSettings(db, s) {
  return db.transaction(() => {
    if (getSettings(db).version !== s.version)
      throw new AppError(
        409,
        "VERSION_CONFLICT",
        "La configuración cambió. Recárgala.",
      );
    db.prepare(
      "UPDATE settings SET whatsapp_number=?,version=version+1,updated_at=? WHERE id=1",
    ).run(s.whatsappNumber, new Date().toISOString());
    return getSettings(db);
  })();
}
