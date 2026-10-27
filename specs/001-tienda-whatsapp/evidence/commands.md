# Comandos ejecutados — 2026-10-27

Entorno: Windows, Node.js 24.22.1, npm 11.19.1; rama 001-tienda-whatsapp.

| Comando | Resultado real |
| --- | --- |
| npm install | Dependencias instaladas, lockfile generado; se actualizaron dependencias vulnerables detectadas inicialmente. |
| npm ci | Reinstalación de 501 paquetes desde lock, código 0. |
| npm audit --audit-level=moderate | 0 vulnerabilidades reportadas. |
| npm run env:init | .env local creado con secreto aleatorio sin mostrarlo. |
| npm run db:init (dos veces) | SQLite local preparada sin borrar datos. |
| npm run admin:create | CLI real con entrada oculta y cuenta efímera; repetir se rechaza sin sobrescribir. |
| npm run dev | Vite/Express y proxy /api comprobados en bases temporales. |
| npm run lint | Código 0. |
| npm test | 34 pruebas aprobadas: 12 cliente y 22 servidor, 27 archivos. |
| npm run build | Vite compila 51 módulos y valida sintaxis del servidor/scripts. |
| npm run test:setup | Chromium y dependencias de Playwright descargados. |
| npm run test:e2e | 22 pruebas aprobadas: 11 por tamaño de pantalla; 45.5 segundos en la última corrida. |
| npm run test:performance | Presupuestos aprobados; resultados y equipo en performance.md. |
| npm run test:commands | db:init, CLI, dev y start aprobados en almacenamiento temporal. |
| npm start | Frontend compilado y API desde Express comprobados por test:commands. |
| npm run preview:https | HTTPS local real, index y csrf 200; cookie Secure/HttpOnly/SameSite=Lax. |

La creación de administrador comercial queda al propietario: no se sembró una contraseña conocida. Catálogo local inicial vacío. Se comprobó que .env, SQLite, sesiones, compilaciones y reportes se excluyen de Git. git diff --check no detecta errores.

La primera compilación falló por JSX en AdminPage y fue corregida. Las pruebas detectaron un código EMPTY_CART distinto del contrato y se corrigió. El primer verificador de dev usaba una espera demasiado corta; se ajustó y se comprobó el arranque real. No se presenta ninguna de esas corridas fallidas como éxito.

El código y las pruebas se construyeron en incrementos: hubo fallo inicial por módulos de cliente ausentes; varias pruebas de robustez se añadieron después del código base. No se afirma TDD estricto para todos los archivos. Los resultados anteriores corresponden a verificaciones reales.
