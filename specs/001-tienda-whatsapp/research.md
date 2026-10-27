# Investigación y decisiones — BioNut

Fecha: 2026-10-26. Investigación de runtime, workspaces y pruebas, complementada por un agente
para autenticación Express/SQLite. Todas las decisiones necesarias para la fase de diseño están
resueltas. Los parches exactos se fijarán al instalar y comprobar compatibilidad, no se inventan.

## Runtime y organización

- Decision: Node.js 24.x, npm 11.x, JavaScript ES modules, React 19 y Vite; dos workspaces
  client/server. Versiones exactas en lockfile y engines antes de entregar implementación.
- Rationale: respeta stack solicitado, instalación central y scripts portables Windows/Linux.
- Alternatives considered: TypeScript agregaría una fase de tipado no solicitada; monorepo con
  herramientas adicionales no aporta valor a dos paquetes. No se usará SSR para este catálogo.
- Fuentes: [Vite](https://vite.dev/guide/), [React](https://react.dev/versions),
  [npm workspaces](https://docs.npmjs.com/cli/v11/using-npm/workspaces/).

## Persistencia

- Decision: better-sqlite3, SQL parametrizado, transacciones y migraciones pequeñas; WAL y
  disco local persistente. Sesiones con better-sqlite3-session-store.
- Rationale: API directa y adecuada a una tienda con pocas escrituras, sin servicio separado.
- Alternatives considered: ORM innecesario; PostgreSQL requiere operar otro servicio;
  node:sqlite evita un paquete pero se prefiere integración existente del driver con sesiones.
- Fuente: [better-sqlite3](https://github.com/WiseLibs/better-sqlite3).
- Riesgo: driver nativo; comprobar instalación npm ci en Windows y Linux. La implementación
  debe documentar las herramientas necesarias si el entorno no dispone de binario precompilado.

## Sesiones y credenciales

- Decision: express-session con almacén SQLite; cookie HttpOnly, SameSite=Lax, Secure en
  producción, Path=/ y sin Domain. resave=false y saveUninitialized=false. Regenerar sesión
  al autenticar; destruir al salir. Inactividad 30 minutos y máximo absoluto de 8 horas.
- Rationale: revocación simple y autorización comprobable en servidor.
- Alternatives considered: JWT en localStorage complica revocación y expone tokens a JavaScript;
  MemoryStore no sirve como almacenamiento de producción.
- Fuente: [express-session](https://expressjs.com/en/resources/middleware/session/).
- Decision: Argon2id con memoria 19456 KiB, iteraciones 2, paralelismo 1 como mínimo inicial;
  sal aleatoria de la biblioteca. Creación de administrador por terminal con entrada oculta.
- Rationale: hash adaptativo mantenido; no almacenar secretos legibles ni credenciales por defecto.
- Alternatives considered: bcrypt no es primera opción para un proyecto nuevo; scrypt sería
  alternativa solo ante incompatibilidad documentada, sin cambio silencioso.
- Fuentes: [OWASP contraseñas](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html),
  [node-argon2](https://github.com/ranisalt/node-argon2).

## CSRF, fuerza bruta y errores

- Decision: token sincronizado de sesión en X-CSRF-Token para login, logout y escrituras
  administrativas. Validar Origin contra APP_ORIGIN. Renovar token después del login.
- Rationale: SameSite por sí solo no sustituye protección explícita.
- Alternatives considered: sin protección o solo cookie SameSite, descartados.
- Fuente: [OWASP CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
- Decision: tras 5 fallos usuario+IP en 15 minutos bloquear esa pareja 15 minutos; límite
  adicional de 100 fallos por IP en 24 horas. Persistir contadores en SQLite. Éxito borra
  contador de pareja, no contador diario. Responder 429 con Retry-After. No bloquear la cuenta
  globalmente por IP ajena. Express-rate-limit limita checkout público a 60 solicitudes/IP/minuto.
- Rationale: reduce abuso sin un servicio nuevo; valores de proyecto sujetos a pruebas.
- Alternatives considered: Redis y plataforma de identidad externa exceden necesidad de v1.
- Fuente: [seguridad Express](https://expressjs.com/en/advanced/best-practice-security/).

## Interfaz, importes y WhatsApp

- Decision: componentes React, CSS responsive, estado local/reducer por ID; API de mismo origen.
  Precios enteros en céntimos, validados de nuevo en servidor antes del resumen.
- Rationale: evita divergencias de importes y dependencia de estado persistente de clientes.
- Alternatives considered: Redux y persistencia del carrito no son necesarios según spec.
- Decision: checkout responde con enlace al mensaje, no envío. Comparar snapshot recibido
  con productos actuales; si cambian, devolver 409 y carrito actualizado, sin enlace.
  Nueva pulsación repite validación. Se reserva una pestaña en el gesto inicial y se abre allí el enlace tras validar; la tienda original conserva su estado. Si se bloquea, se ofrece enlace explícito. No se garantiza recuperación tras recargar la tienda. Decisión de implementación registrada en review-decisions.md.
- Rationale: satisface HU4 sin afirmar recepción ni crear pedidos almacenados.
- Alternatives considered: API de envío automático, reservas e historial están fuera de alcance.

## Pruebas y operación

- Decision: Vitest en ambos paquetes; Testing Library en cliente, Supertest para API, Playwright
  para recorridos. Casos de seguridad y persistencia usan SQLite temporal real.
- Rationale: verificar comportamiento y contratos, no solo mocks ni detalles internos.
- Alternatives considered: solo E2E hace más difícil aislar fallos; solo unitarias no prueba sesiones.
- Fuente: [Vitest](https://vitest.dev/guide/).
- Decision: una instancia con backup en parada y restauración en copia, logs mínimos sin datos
  sensibles. Rendimiento se mide con perfil pequeño antes de agregar complejidad.
- Rationale: operación reproducible para v1; no se asume escalado horizontal ni uptime garantizado.
