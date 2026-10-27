# Prueba real de comandos

2026-10-27T19:22:45.856Z · Node v24.22.1 · bases aisladas.

- db:init 1: OK
- db:init 2: OK
- admin:create: entrada interactiva oculta, hash y creación OK
- admin:create repetido: rechazo esperado sin sobrescribir
- dev: Vite + Express + proxy /api OK
- start: frontend compilado + API mismo origen OK
