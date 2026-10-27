import React, { useState } from "react";
import { money } from "../utils/money.js";
export default function ProductCard({ product, onAdd }) {
  const [failed, setFailed] = useState(false);
  return (
    <article className="product-card">
      <div className="product-image">
        {product.imageUrl && !failed ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="image-fallback">
            <span aria-hidden="true">◇</span>
            <small>Imagen no disponible</small>
          </div>
        )}
      </div>
      <div className="product-content">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-bottom">
          <strong>{money(product.priceCents)}</strong>
          <button
            onClick={() => onAdd(product)}
            aria-label={"Agregar " + product.name}
          >
            Agregar <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>
    </article>
  );
}
