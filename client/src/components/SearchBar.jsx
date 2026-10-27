import React from "react";
export default function SearchBar({ query, setQuery }) {
  return (
    <div className="search">
      <label htmlFor="search">Buscar productos</label>
      <div>
        <span aria-hidden="true">⌕</span>
        <input
          id="search"
          type="search"
          placeholder="¿Qué estás buscando hoy?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button type="button" className="quiet" onClick={() => setQuery("")}>
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
