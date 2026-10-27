import React, { useState, useEffect } from "react";
import { api } from "../services/api.js";
import { logout } from "../services/auth.js";
import { money } from "../utils/money.js";
import ProductForm from "../components/ProductForm.jsx";
import DeleteProductDialog from "../components/DeleteProductDialog.jsx";
import SellerSettings from "../components/SellerSettings.jsx";
export default function AdminPage({ onUnauthorized }) {
  const [products, setProducts] = useState([]),
    [editing, setEditing] = useState(undefined),
    [deleting, setDeleting] = useState(null),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  async function load() {
    try {
      setProducts((await api("/admin/products")).products);
    } catch (e) {
      setNotice(e.message);
      if (e.status === 401) onUnauthorized();
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function remove() {
    setBusy(true);
    try {
      await api("/admin/products/" + deleting.id, {
        method: "DELETE",
        body: { version: deleting.version },
        csrf: true,
      });
      setNotice("Producto eliminado.");
      setDeleting(null);
      await load();
    } catch (e) {
      setNotice(e.message);
      setDeleting(null);
      if (e.status === 401) onUnauthorized();
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="admin-wrap">
      <div className="section-title">
        <div>
          <span className="eyebrow">PANEL DEL NEGOCIO</span>
          <h1>Tu catálogo, al día.</h1>
        </div>
        <button
          className="secondary"
          onClick={async () => {
            try {
              await logout();
              onUnauthorized();
            } catch (e) {
              setNotice(e.message);
              if (e.status === 401) onUnauthorized();
            }
          }}
        >
          Cerrar sesión
        </button>
      </div>
      {notice && (
        <p role="status" className="notice">
          {notice}
        </p>
      )}
      <div className="admin-layout">
        <section>
          {editing !== undefined ? (
            <ProductForm
              key={editing?.id || "new"}
              product={editing}
              onUnauthorized={onUnauthorized}
              onCancel={() => setEditing(undefined)}
              onSaved={() => {
                setEditing(undefined);
                setNotice("Producto guardado.");
                load();
              }}
            />
          ) : (
            <div className="panel">
              <div className="section-title">
                <h2>
                  Productos <small>({products.length})</small>
                </h2>
                <button onClick={() => setEditing(null)}>
                  + Agregar producto
                </button>
              </div>
              <button className="quiet" onClick={load}>
                Actualizar lista
              </button>
              {!products.length ? (
                <p>Aún no hay productos. Agrega el primero.</p>
              ) : (
                <ul className="admin-list">
                  {products.map((p) => (
                    <li key={p.id}>
                      <div>
                        <h3>{p.name}</h3>
                        <p>{money(p.priceCents)}</p>
                      </div>
                      <div className="actions">
                        <button
                          className="secondary"
                          onClick={() => setEditing(p)}
                          aria-label={"Editar " + p.name}
                        >
                          Editar
                        </button>
                        <button
                          className="quiet danger-text"
                          onClick={() => setDeleting(p)}
                          aria-label={"Eliminar " + p.name}
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
        <SellerSettings onUnauthorized={onUnauthorized} />
      </div>
      {deleting && (
        <DeleteProductDialog
          product={deleting}
          busy={busy}
          onConfirm={remove}
          onCancel={() => setDeleting(null)}
        />
      )}
    </main>
  );
}
