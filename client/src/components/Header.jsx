import React from "react";
import { useCart } from "../state/CartProvider.jsx";
export default function Header({ navigate, admin = false }) {
  const { items } = useCart();
  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          className="brand"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          <span className="brand-mark" aria-hidden="true">
            b.
          </span>
          <span>
            Bio<span className="brand-light">Nut</span>
            <small>HECHO PARA TU DÍA A DÍA</small>
          </span>
        </a>
        <nav aria-label="Principal">
          <a
            href={admin ? "/" : "/admin"}
            onClick={(e) => {
              e.preventDefault();
              navigate(admin ? "/" : "/admin");
            }}
          >
            {admin ? "Ver tienda" : "Administración"}
          </a>
          {!admin && (
            <a className="cart-link" href="#carrito">
              Mi carrito{" "}
              <span>{items.reduce((s, l) => s + l.quantity, 0)}</span>
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
