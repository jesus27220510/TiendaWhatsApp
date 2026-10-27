# HU7 — Persistencia y recuperación

Comprobado el 2026-10-27 con Node.js 24.22.1, npm 11.19.1 y datos temporales. Navegador Chromium en 1366×768 y 360×800. La comprobación automatizada y la inspección visual del agente no sustituyen la aceptación humana de T060.

persistence.test.js reabre los mismos archivos reales después de alta/edición/borrado y configuración: conserva precio y versión, no reaparece el borrado y mantiene número. migrations.test.js/migration-rollback.test.js: repetición sin pérdida, migración fallida revierte y no queda registrada. database-failures.test.js usa otra conexión SQLite con bloqueo de escritura y confirma 503 sin datos parciales; después libera y reintenta. recovery.spec.js presenta 503 y conserva entradas; lost-response.spec.js verifica respuesta perdida sin duplicar. Backup/restauración en copia documentados en README. Resultado: satisfactorio para automatización; restauración por otra persona pendiente en T060.
