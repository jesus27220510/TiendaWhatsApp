import React, { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { useCart } from "../state/CartProvider.jsx";
import { searchProducts } from "../utils/search.js";
import ProductCard from "../components/ProductCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Cart from "../components/Cart.jsx";
export default function StorePage() {
  const [products, setProducts] = useState([]),
    [query, setQuery] = useState(""),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const { dispatch } = useCart();
  async function load() {
    setLoading(true);
    setError("");
    try {
      setProducts((await api("/products")).products);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  const visible = searchProducts(products, query);
  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">TU NEGOCIO, MÁS CERCA</span>
          <h1>
            Lo que buscas.
            <br />
            <em>A un mensaje de distancia.</em>
          </h1>
          <p>
            Explora nuestro catálogo, arma tu pedido y conversemos por WhatsApp.
            Así de simple.
          </p>
          <div className="hero-features">
            <span>✓ Precios en soles</span>
            <span>✓ Sin crear una cuenta</span>
            <span>✓ Atención directa</span>
          </div>
        </div>
        <div className="hero-note">
          <span aria-hidden="true">↗</span>
          <p>
            Elige aquí.
            <br />
            <strong>Coordinamos por WhatsApp.</strong>
          </p>
        </div>
      </section>
      <main className="store-layout">
        <section className="catalog" aria-labelledby="catalog-title">
          <div className="section-title">
            <div>
              <span className="eyebrow">DESCUBRE NUESTROS PRODUCTOS</span>
              <h2 id="catalog-title">El catálogo</h2>
            </div>
            <span className="count" aria-live="polite">
              {visible.length} productos
            </span>
          </div>
          <SearchBar query={query} setQuery={setQuery} />
          <p className="sr-only" role="status">
            {notice}
          </p>
          {loading ? (
            <div className="state-box" role="status">
              Cargando productos…
            </div>
          ) : error ? (
            <div className="state-box">
              <p role="alert">{error}</p>
              <button onClick={load}>Reintentar</button>
            </div>
          ) : !products.length ? (
            <div className="state-box">
              <span aria-hidden="true">◇</span>
              <h3>Aún no hay productos</h3>
              <p>Pronto encontrarás aquí el catálogo del negocio.</p>
            </div>
          ) : !visible.length ? (
            <div className="state-box">
              <h3>No se encontraron productos</h3>
              <p>Prueba con otro nombre o limpia la búsqueda.</p>
            </div>
          ) : (
            <div className="product-grid">
              {visible.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAdd={(p) => {
                    dispatch({ type: "add", product: p });
                    setNotice(p.name + " agregado al carrito.");
                  }}
                />
              ))}
            </div>
          )}
        </section>
        <Cart />
      </main>
      <footer>
        Compra cerca. Coordina fácil.<span>BioNut · Perú</span>
      </footer>
    </>
  );
}
