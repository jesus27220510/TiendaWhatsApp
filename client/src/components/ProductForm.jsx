import React, { useState } from "react";
import { parsePrice } from "../utils/money.js";
import { api } from "../services/api.js";
export default function ProductForm({
  product,
  onSaved,
  onCancel,
  onUnauthorized,
}) {
  const [id] = useState(() => product?.id || crypto.randomUUID());
  const [error, setError] = useState(""),
    [fields, setFields] = useState({}),
    [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setError("");
    setFields({});
    const data = new FormData(e.currentTarget);
    let priceCents;
    try {
      priceCents = parsePrice(data.get("price"));
    } catch (e) {
      setFields({ priceCents: e.message });
      return;
    }
    const body = {
      name: data.get("name"),
      description: data.get("description"),
      priceCents,
      imageUrl: data.get("imageUrl").trim() || null,
      ...(product ? { version: product.version } : { id }),
    };
    setBusy(true);
    try {
      await api("/admin/products" + (product ? "/" + id : ""), {
        method: product ? "PUT" : "POST",
        body,
        csrf: true,
      });
      onSaved();
    } catch (e) {
      setError(e.message);
      setFields(e.fields || {});
      if (e.status === 401) onUnauthorized();
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="panel product-form" onSubmit={submit}>
      <div className="section-title">
        <h2>{product ? "Editar producto" : "Nuevo producto"}</h2>
        <button type="button" className="quiet" onClick={onCancel}>
          Cancelar
        </button>
      </div>
      <label>
        Nombre
        <input
          name="name"
          defaultValue={product?.name || ""}
          maxLength={100}
          required
        />
      </label>
      <label>
        Descripción
        <textarea
          name="description"
          defaultValue={product?.description || ""}
          maxLength={1000}
          required
          rows={3}
        />
      </label>
      <div className="form-grid">
        <label>
          Precio en soles
          <input
            name="price"
            inputMode="decimal"
            defaultValue={product ? (product.priceCents / 100).toFixed(2) : ""}
            placeholder="12.50"
            required
            aria-invalid={!!fields.priceCents}
          />
        </label>
        <label>
          URL de imagen (opcional)
          <input
            name="imageUrl"
            type="url"
            defaultValue={product?.imageUrl || ""}
            placeholder="https://…"
            maxLength={2048}
          />
        </label>
      </div>
      {Object.entries(fields).map(([k, v]) => (
        <p key={k} role="alert" className="field-error">
          {v}
        </p>
      ))}
      {error && (
        <p role="alert" className="notice">
          {error}
        </p>
      )}
      <button disabled={busy}>
        {busy ? "Guardando…" : "Guardar producto"}
      </button>
    </form>
  );
}
