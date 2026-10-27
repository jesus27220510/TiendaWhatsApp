import React, { useState } from "react";
import { login } from "../services/auth.js";
export default function LoginPage({ onLogin }) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await login({
        username: data.get("username"),
        password: data.get("password"),
      });
      onLogin();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <span className="eyebrow">SOLO PARA TU NEGOCIO</span>
        <h1>Administración</h1>
        <p>Ingresa para mantener tu catálogo al día.</p>
        <label>
          Usuario
          <input
            name="username"
            autoComplete="username"
            required
            minLength={3}
            maxLength={64}
          />
        </label>
        <label>
          Contraseña
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        {error && (
          <p role="alert" className="notice">
            {error}
          </p>
        )}
        <button disabled={busy}>
          {busy ? "Ingresando…" : "Ingresar al panel"}
        </button>
        <small>El catálogo público no requiere una cuenta.</small>
      </form>
    </main>
  );
}
