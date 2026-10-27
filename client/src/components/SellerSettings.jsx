import React, { useEffect, useState } from "react";
import { api } from "../services/api.js";
export default function SellerSettings({ onUnauthorized }) {
  const [settings, setSettings] = useState(null),
    [number, setNumber] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  async function load() {
    try {
      const s = await api("/admin/settings");
      setSettings(s);
      setNumber(s.whatsappNumber || "");
    } catch (e) {
      setNotice(e.message);
      if (e.status === 401) onUnauthorized();
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const s = await api("/admin/settings", {
        method: "PUT",
        body: {
          whatsappNumber: number.trim() || null,
          version: settings.version,
        },
        csrf: true,
      });
      setSettings(s);
      setNumber(s.whatsappNumber || "");
      setNotice(
        s.whatsappNumber
          ? "Número guardado."
          : "Número retirado: la finalización queda deshabilitada.",
      );
    } catch (e) {
      setNotice(e.fields ? Object.values(e.fields).join(" ") : e.message);
      if (e.status === 401) onUnauthorized();
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="panel seller-settings" onSubmit={save}>
      <span className="eyebrow">ATENCIÓN DIRECTA</span>
      <h2>WhatsApp del negocio</h2>
      <p>
        Los pedidos se abrirán en este número. Déjalo vacío para deshabilitar la
        finalización.
      </p>
      <label>
        Número del vendedor
        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          inputMode="tel"
          placeholder="+51 999 888 777"
        />
      </label>
      <button disabled={!settings || busy}>Guardar número</button>
      <button type="button" className="quiet" onClick={load}>
        Recargar configuración
      </button>
      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}
    </form>
  );
}
