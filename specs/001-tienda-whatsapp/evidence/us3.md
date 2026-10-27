# HU3 — Carrito

Comprobado el 2026-10-27 con Node.js 24.22.1, npm 11.19.1 y datos temporales. Navegador Chromium en 1366×768 y 360×800. La comprobación automatizada y la inspección visual del agente no sustituyen la aceptación humana de T060.

cart-state.test.js, cart.test.jsx y cart.spec.js: agrupación por ID incluso con nombres iguales; A×2+B×1=S/ 33.00, A×3+B=S/ 45.50, retirar B=S/ 37.50. Cantidad cero restaura 3 con aviso. Navegar a administración y volver conserva selección. Carrito vacío no permite finalizar. Resultado: satisfactorio.
