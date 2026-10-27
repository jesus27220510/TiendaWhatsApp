# HU6 — Gestión

Comprobado el 2026-10-27 con Node.js 24.22.1, npm 11.19.1 y datos temporales. Navegador Chromium en 1366×768 y 360×800. La comprobación automatizada y la inspección visual del agente no sustituyen la aceptación humana de T060.

admin-catalog.test.js/.jsx, admin-settings.test.js y admin-catalog.spec.js: crear, editar, eliminar con confirmación, cancelar, precio inválido, imagen URL opcional, campos desconocidos, versiones, alta idempotente y conflictos. Número guardado y normalizado, inválido rechazado, retiro y conflicto de versión. Rechazos sin escritura. lost-response.spec.js confirma un alta en servidor, pierde la respuesta y reintenta con el mismo ID: un solo producto. Resultado: satisfactorio.
