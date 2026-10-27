import React, { useState, useEffect } from "react";
import { CartProvider } from "./state/CartProvider.jsx";
import Header from "./components/Header.jsx";
import StorePage from "./pages/StorePage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import RequireAdmin from "./components/RequireAdmin.jsx";
export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const pop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  function navigate(p) {
    window.history.pushState({}, "", p);
    setPath(p);
    window.scrollTo(0, 0);
  }
  const admin = path.startsWith("/admin");
  return (
    <CartProvider>
      <a className="skip-link" href="#main-content">
        Ir al contenido
      </a>
      <Header navigate={navigate} admin={admin} />
      <div id="main-content" tabIndex={-1}>
        {admin ? (
          <RequireAdmin>
            {(onUnauthorized) => <AdminPage onUnauthorized={onUnauthorized} />}
          </RequireAdmin>
        ) : (
          <StorePage />
        )}
      </div>
    </CartProvider>
  );
}
