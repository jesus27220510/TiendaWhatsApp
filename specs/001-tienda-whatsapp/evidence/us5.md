# HU5 — Administrador

Comprobado el 2026-10-27 con Node.js 24.22.1, npm 11.19.1 y datos temporales. Navegador Chromium en 1366×768 y 360×800. La comprobación automatizada y la inspección visual del agente no sustituyen la aceptación humana de T060.

auth.test.js, session-expiry.test.js, login-limit.test.js, admin-create.test.js, auth.spec.js y security.spec.js: acceso anónimo rechazado, error genérico, CSRF/Origin, regeneración ID/token, cierre y pestaña antigua. Reloj controlado verifica 30 minutos de inactividad y 8 horas absolutas; no se esperaron ocho horas reales en navegador. Contadores sobreviven reapertura de SQLite y bloquean 15 minutos desde el quinto fallo. CLI real comprobada con contraseña aleatoria oculta, Argon2id y rechazo de sobrescritura; ninguna cuenta de prueba en la base local. HTTPS real verifica Secure/HttpOnly/SameSite=Lax. Resultado: satisfactorio.
