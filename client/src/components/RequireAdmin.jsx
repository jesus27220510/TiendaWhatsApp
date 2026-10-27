import React, { useEffect, useState } from "react";
import { me } from "../services/auth.js";
import LoginPage from "../pages/LoginPage.jsx";
export default function RequireAdmin({ children }) {
  const [state, setState] = useState("loading");
  async function check() {
    try {
      await me();
      setState("ready");
    } catch (e) {
      setState(e.status === 401 ? "login" : "error");
    }
  }
  useEffect(() => {
    check();
  }, []);
  if (state === "loading")
    return <main className="state-box">Comprobando sesión…</main>;
  if (state === "error")
    return (
      <main className="state-box">
        <p>No se pudo comprobar la sesión.</p>
        <button onClick={check}>Reintentar</button>
      </main>
    );
  if (state === "login") return <LoginPage onLogin={check} />;
  return children(() => setState("login"));
}
