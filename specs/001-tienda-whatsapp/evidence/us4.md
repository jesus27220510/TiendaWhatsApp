# HU4 — WhatsApp

Comprobado el 2026-10-27 con Node.js 24.22.1, npm 11.19.1 y datos temporales. Navegador Chromium en 1366×768 y 360×800. La comprobación automatizada y la inspección visual del agente no sustituyen la aceptación humana de T060.

checkout*.test.js, checkout.test.jsx y checkout.spec.js: número peruano normalizado, mensaje UTF-8 codificado una vez, precios autoritativos y total referencial; no cookie del cliente ni pedido almacenado. La navegación externa se interceptó: ningún mensaje enviado. Pestaña original conserva S/ 33.00; ventana bloqueada ofrece enlace. Cambios y borrados producen revisión sin enlace; falta de número y fallo DB conservan selección. Carrito vacío, duplicados, cantidades, 256 KiB, enlace >8000 caracteres y 60 solicitudes/minuto se rechazan. Resultado: satisfactorio.
