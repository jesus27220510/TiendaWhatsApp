# HU2 — Buscar

Comprobado el 2026-10-27 con Node.js 24.22.1, npm 11.19.1 y datos temporales. Navegador Chromium en 1366×768 y 360×800. La comprobación automatizada y la inspección visual del agente no sustituyen la aceptación humana de T060.

search.test.js, search-bar.test.jsx y search.spec.js: coincidencia parcial por nombre, « CAFE » encuentra Café molido/Cafetera, ignora tildes y mayúsculas, no busca por descripción, sin coincidencias y limpieza. La selección de Té verde se conserva al filtrar. Resultado: satisfactorio.
