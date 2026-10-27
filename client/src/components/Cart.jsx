import React, { useState } from "react";
import { useCart } from "../state/CartProvider.jsx";
import { total } from "../state/cart.js";
import { money } from "../utils/money.js";
import CheckoutButton from "./CheckoutButton.jsx";
function Quantity({ line, dispatch }) {
  const [draft, setDraft] = useState(String(line.quantity));
  const [error, setError] = useState("");
  function commit() {
    const n = Number(draft);
    if (!/^\d+$/.test(draft) || !Number.isInteger(n) || n < 1 || n > 999) {
      setDraft(String(line.quantity));
      setError("Usa una cantidad entera de 1 a 999.");
      return;
    }
    setError("");
    dispatch({ type: "quantity", id: line.productId, quantity: n });
  }
  return (
    <div>
      <label className="sr-only" htmlFor={"qty-" + line.productId}>
        {"Cantidad de " + line.name}
      </label>
      <input
        className="quantity"
        id={"qty-" + line.productId}
        inputMode="numeric"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
      />
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
export default function Cart() {
  const { items, dispatch } = useCart();
  return (
    <aside className="cart" id="carrito" aria-labelledby="cart-heading">
      <div className="cart-heading">
        <h2 id="cart-heading">Tu pedido</h2>
        <span className="eyebrow">
          {items.reduce((s, l) => s + l.quantity, 0)} UNIDADES
        </span>
      </div>
      {!items.length ? (
        <div className="empty-cart">
          <span aria-hidden="true">＋</span>
          <h3>Tu carrito está vacío</h3>
          <p>Agrega tus favoritos y coordina tu pedido con nosotros.</p>
        </div>
      ) : (
        <ul className="cart-lines">
          {items.map((l) => (
            <li key={l.productId}>
              <div className="line-top">
                <h3>{l.name}</h3>
                <button
                  className="remove"
                  aria-label={"Quitar " + l.name}
                  onClick={() => dispatch({ type: "remove", id: l.productId })}
                >
                  ×
                </button>
              </div>
              <p className="muted">{money(l.priceCents)} por unidad</p>
              <div className="line-bottom">
                <Quantity
                  key={l.productId + ":" + l.quantity}
                  line={l}
                  dispatch={dispatch}
                />
                <strong>{money(l.priceCents * l.quantity)}</strong>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="total" aria-live="polite">
        <span>Total referencial</span>
        <strong>{money(total(items))}</strong>
      </div>
      <CheckoutButton />
      <p className="cart-note">
        Sin pagos en línea. La disponibilidad y la entrega se coordinan
        directamente con el vendedor.
      </p>
    </aside>
  );
}
