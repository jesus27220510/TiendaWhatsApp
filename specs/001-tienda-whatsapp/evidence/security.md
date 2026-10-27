# Seguridad verificada — 2026-10-27

- Pruebas de API: 401/403 rechazan cambios; CSRF sincronizado y Origin exacto en login/escrituras; token malformado Unicode produce 403; credenciales inválidas genéricas; sesión regenerada y logout invalida pestañas antiguas.
- Argon2id, 19456 KiB, 2 iteraciones, paralelismo 1. CLI oculta contraseña, confirma entrada y rechaza sobrescribir.
- Sesiones SQLite separadas; expiración de inactividad y absoluta comprobadas con reloj controlado. Contadores de login persistentes, limpieza horaria y eliminación de sesiones caducadas.
- Playwright usa HTTPS real con certificado efímero y confirma cookie Secure, HttpOnly y SameSite=Lax, sin token en localStorage/sessionStorage/document.cookie.
- Se ejecutó además npm run preview:https, que inicia la compilación tras proxy local: GET / y /api/auth/csrf devolvieron 200 y las cookies conservaron las tres propiedades. Se cerraron los procesos de prueba.
- Cabeceras Helmet, no-store en API y sin X-Powered-By. Logs solo método/ruta sin query, estado, duración e identificador. Prueba de logging comprueba ausencia de token y query.
- git check-ignore confirma .env y bases ignorados. npm audit: 0 vulnerabilidades reportadas tras npm ci. No se imprimieron secretos locales.
- Datos personales de clientes, pagos y envío automático no existen.

Es una comprobación de los controles implementados y pruebas de regresión; no equivale a una auditoría externa ni a validación de un despliegue público.
