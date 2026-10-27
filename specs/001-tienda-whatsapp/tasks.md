---
description: "Tareas de implementación de BioNut por historia de usuario"
---

# Tasks: BioNut

**Input**: Documentos de `specs/001-tienda-whatsapp/`.
**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [contratos](contracts/api.md) y [quickstart](quickstart.md).
**Tests**: Incluidas por solicitud explícita de pruebas automatizadas y constitución IX.
**Organization**: USn corresponde a HUn, aunque las fases siguen el orden de prioridad de la spec.

## Format: `[ID] [P?] [Story] Description`

T001–T059 completadas; T060 pendiente de aceptación humana. [P] permite trabajo en archivos distintos una vez completados
los prerrequisitos de la fase y los indicados en la tarea. No autoriza ejecutar agentes ni omitir
pruebas. Escribir pruebas de comportamiento antes de su implementación y observar el fallo
esperado; posteriormente ejecutar y registrar el resultado real.

## Path Conventions

Rutas relativas a la raíz: client/ y server/. Documentación de la funcionalidad en
specs/001-tienda-whatsapp/. No crear frontend/ ni backend/. No modificar marcas de checklists
propiedad del revisor. Cada fase termina con su comprobación independiente.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Resolver condiciones de entrada y preparar herramientas reproducibles.

- [X] T001 Registrar en specs/001-tienda-whatsapp/review-decisions.md la revisión pendiente de checklists/review.md y resolver con el responsable CHK009 (garantía de carrito al regresar de WhatsApp) y CHK034 (criterios visuales), sincronizando spec.md y contracts/ui.md con las decisiones aceptadas; no marcar el checklist sin autorización explícita del revisor.
- [X] T002 Crear package.json, client/package.json y server/package.json con workspaces client/server, Node 24.x, npm 11.x, módulos ES y dependencias del plan; generar package-lock.json con versiones compatibles comprobadas, sin latest flotante.
- [X] T003 [P] Configurar ESLint para JSX, servidor y scripts en eslint.config.js y conectar npm run lint en package.json sin ignorar archivos del producto.
- [X] T004 [P] Configurar Vitest, Testing Library y Supertest en client/vitest.config.js, server/vitest.config.js y client/tests/setup.js; preparar SQLite temporal con limpieza acotada en server/tests/helpers/database.js.
- [X] T005 [P] Configurar Playwright con servidores aislados, credenciales efímeras y viewports 360×800/1366×768 en playwright.config.js y tests/e2e/fixtures.js; no usar DB real ni enviar WhatsApp.
- [X] T006 Crear lanzadores portables en scripts/dev.mjs, scripts/build.mjs y scripts/start.mjs y scripts raíz en package.json para dev/build/start/test/test:setup/test:e2e/db:init/admin:create; preparar client/vite.config.js con proxy /api y finalización conjunta de procesos; enlazar cada comando a su implementación real conforme avance la funcionalidad.
- [X] T007 Documentar variables ficticias en .env.example y ampliar .gitignore para DB, auxiliares, sesiones, resultados de pruebas y secretos sin sobrescribir reglas existentes; preservar package-lock.json versionado.

**Checkpoint**: Herramientas configuradas; scripts que aún dependen de historias no se declaran aprobados. T001 requiere resolución antes de desarrollar el recorrido afectado.

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Base compartida; debe completarse antes de las historias.

- [X] T008 Implementar y probar configuración de entorno en server/src/config.js y server/tests/config.test.js: rutas desde raíz, PORT 1–65535, APP_ORIGIN HTTPS en producción, secreto de al menos 32 bytes, proxy explícito y fallo temprano sin secretos en mensajes.
- [X] T009 Crear conexión y migrador en server/src/db/connection.js, server/src/db/migrate.js y server/scripts/db-init.js: «Migraciones numeradas transaccionales registradas en schema_migrations», «SQLite WAL, foreign_keys=ON, busy_timeout=5000», repetición sin borrar datos; comprobar rollback en server/tests/migrations.test.js.
- [X] T010 Definir migración compartida server/src/db/migrations/001-catalog.sql: Product «UUID generado por cliente administrador para alta idempotente; PK inmutable», «Texto trim, 1–100 caracteres Unicode; no único», descripción «Texto trim, 1–1000 caracteres Unicode», precio «Entero 1–99999999. Nunca almacenar precio como float», imagen «URL HTTPS absoluta o null; sin credenciales en URL; máximo técnico 2048 caracteres», versión «Entero positivo, aumenta por cada edición» y fechas «Instantes UTC»; StoreSettings «Fila única id=1», número nullable normalizado a 51 más nueve dígitos comenzando por 9, version y updated_at.
- [X] T011 Implementar fábrica Express en server/src/app.js y arranque/apagado en server/src/index.js: montaje /api, JSON 16 KiB salvo checkout 256 KiB, Helmet, static client/dist, 404 JSON antes del fallback React y cierre ordenado de conexiones.
- [X] T012 Crear errores y logs en server/src/middleware/errors.js y server/src/middleware/request-log.js: formato del contrato, errores españoles, requestId y duración sin cuerpo/query/cookies/tokens; probar 400/404/413/500/503 en server/tests/errors.test.js.
- [X] T013 Crear shell React y cliente HTTP en client/src/App.jsx, client/src/main.jsx, client/index.html y client/src/services/api.js; separar páginas públicas/administrativas, conservar error fields/requestId y no almacenar secretos del administrador en navegador.
- [X] T014 Crear formato de soles y conversión exacta en client/src/utils/money.js y server/src/services/money.js, con pruebas en client/tests/money.test.js y server/tests/money.test.js: coma/punto sin miles, sin redondeo silencioso, céntimos enteros seguros y salida S/ con dos decimales.

**Checkpoint**: Infraestructura y pruebas propias pasan; no hay datos demo ni credenciales sembradas en producción.

## Phase 3: User Story 1 - Catálogo público (Priority: P1) — MVP de consulta

**Goal**: Mostrar información comercial sin registro.
**Independent Test**: HU1.1–HU1.4 con dos productos de fixture, catálogo vacío e imagen rota en ambos tamaños.

### Tests for User Story 1

- [X] T015 [P] [US1] Escribir contratos de GET /api/products para listado ordenado, vacío y fallo de lectura en server/tests/catalog.test.js, verificando ausencia de sesión y de datos administrativos.
- [X] T016 [P] [US1] Escribir pruebas de tarjetas, placeholder, carga/error/vacío y precio en client/tests/catalog.test.jsx.

### Implementation for User Story 1

- [X] T017 [US1] Implementar consultas de catálogo en server/src/db/products.js y GET /api/products en server/src/routes/catalog.js según contracts/api.md, sin convertir errores de DB en lista vacía.
- [X] T018 [US1] Crear cabecera, tarjetas y página pública en client/src/components/Header.jsx, client/src/components/ProductCard.jsx y client/src/pages/StorePage.jsx; imagen URL opcional con fallback y texto escapado.
- [X] T019 [US1] Aplicar jerarquía y adaptación del catálogo en client/src/styles/store.css y comprobar HU1 mediante tests/e2e/catalog.spec.js; registrar resultado independiente en specs/001-tienda-whatsapp/evidence/us1.md.

**Checkpoint**: Catálogo público demostrable con fixtures aislados; no requiere CRUD para su prueba independiente.

## Phase 4: User Story 3 - Carrito (Priority: P1)

**Goal**: Selección por identidad, cantidades y total exacto.
**Independent Test**: A×2 + B×1 = S/ 33.00; A×3 + B = S/ 45.50; sin B = S/ 37.50; IDs distintos no se fusionan por nombre.

### Tests for User Story 3

- [X] T020 [P] [US3] Escribir pruebas del reducer para agregado repetido, nombres iguales, cantidades inválidas y eliminación final en client/tests/cart-state.test.js.
- [X] T021 [P] [US3] Escribir pruebas de campos de cantidad, mensajes y totales A/B en client/tests/cart.test.jsx.

### Implementation for User Story 3

- [X] T022 [US3] Implementar client/src/state/cart.js y client/src/state/CartProvider.jsx: «Cart es un mapa productId → {productId, name, priceCents, quantity}; cantidad 1–999», «Dos IDs con igual nombre son líneas distintas» y «Subtotales y total usan enteros seguros»; no persistir datos personales.
- [X] T023 [US3] Crear client/src/components/Cart.jsx y client/src/styles/cart.css con subtotal, total, contador de unidades, retirar y restauración del último valor válido; integrar Agregar en ProductCard.jsx y estado compartido en App.jsx.
- [X] T024 [US3] Cubrir HU3 completo en tests/e2e/cart.spec.js y registrar evidencia en specs/001-tienda-whatsapp/evidence/us3.md, incluida navegación interna sin pérdida de selección.

**Checkpoint**: Carrito verificable con catálogo de fixture; finalizar vacío queda bloqueado.

## Phase 5: User Story 4 - Mensaje WhatsApp (Priority: P1)

**Goal**: Revisar y abrir un mensaje referencial sin envío automático.
**Independent Test**: Fixture de vendedor y productos; destinatario y resumen A/B correctos sin enviar; cambios requieren nueva revisión.

### Tests for User Story 4

- [X] T025 [P] [US4] Escribir contrato GET /api/store y POST /api/checkout en server/tests/checkout.test.js: 200, carrito vacío, IDs duplicados, cantidad inválida, número ausente, eliminación/cambio de precio, fallo DB y límites sin truncamiento.
- [X] T026 [P] [US4] Escribir pruebas del flujo de revisión, error y conservación del carrito conforme a T001 en client/tests/checkout.test.jsx.

### Implementation for User Story 4

- [X] T027 [US4] Crear lectura de configuración en server/src/db/settings.js y validación de snapshot en server/src/validation/checkout.js: IDs únicos válidos, cantidad 1–999, campos desconocidos rechazados; «Se limita el cuerpo HTTP a 256 KiB y el enlace final a 8000 caracteres codificados».
- [X] T028 [US4] Implementar server/src/services/checkout.js y server/src/services/whatsapp.js con lectura coherente de configuración/productos, precio autoritativo, cambios 409 sin enlace, total seguro y UTF-8 codificado una vez; «no se guarda como orden ni reserva».
- [X] T029 [US4] Implementar rutas públicas en server/src/routes/checkout.js y server/src/routes/store.js, límite 60 solicitudes/IP/minuto, respuestas no-store, errores del contrato y montaje en server/src/app.js sin exigir sesión de cliente.
- [X] T030 [US4] Integrar revisión y finalización en client/src/components/CheckoutButton.jsx y client/src/services/checkout.js; bloquear doble acción, conservar selección ante errores y aplicar decisión T001 de regreso de WhatsApp sin prometer recepción.
- [X] T031 [US4] Añadir tests/e2e/checkout.spec.js interceptando enlace de salida, cambios desde otra sesión, tildes/ñ/& y sin datos personales; registrar HU4 en specs/001-tienda-whatsapp/evidence/us4.md.

**Checkpoint**: Recorrido comercial comprobable con configuración de fixture; administración real se entrega en US6.

## Phase 6: User Story 5 - Autenticación administrativa (Priority: P1)

**Goal**: Solo el administrador autorizado obtiene acceso protegido.
**Independent Test**: HU5 con cuenta efímera, anónimo, credenciales inválidas, expiración y cierre desde otra pestaña.

### Tests for User Story 5

- [X] T032 [P] [US5] Escribir pruebas de sesión, CSRF, Origin, regeneración/logout y expiración con reloj controlado en server/tests/auth.test.js; comprobar que rechazos no autorizan operaciones.
- [X] T033 [P] [US5] Escribir pruebas de login, acceso protegido y errores genéricos en client/tests/auth.test.jsx.

### Implementation for User Story 5

- [X] T034 [US5] Crear server/src/db/migrations/002-admin.sql, server/src/db/admin.js y server/scripts/admin-create.js: «Fila única id=1, username único normalizado, password_hash Argon2id, created_at», «Username 3–64 caracteres; contraseña 15–128 caracteres, se admiten espacios sin recortarla»; entrada oculta, no sobrescribir cuenta, Argon2id 19456 KiB/2 iteraciones/paralelismo 1, sin usuario predeterminado.
- [X] T035 [US5] Implementar server/src/middleware/session.js y server/src/middleware/auth.js con almacén SQLite separado, adminId/csrfToken/authenticatedAt/expiresAt, cookie firmada HttpOnly/SameSite=Lax/Secure en producción y expiración «por inactividad a 30 minutos o a 8 horas absolutas, lo que ocurra primero»; catálogo no crea sesión.
- [X] T036 [US5] Implementar token y origen en server/src/middleware/csrf.js y rutas csrf/login/me/logout en server/src/routes/auth.js; regenerar sesión/token al autenticar, comparación segura, hash ficticio para usuario inexistente y 401 genérico.
- [X] T037 [US5] Implementar contadores persistentes en server/src/db/login-attempts.js y server/src/middleware/login-limit.js: «key, failureCount, windowStart, blockedUntil», «Tras 5 fallos en 15 minutos bloquear pareja 15 minutos; 100 fallos/IP por 24 horas bloquea hasta vencer ventana diaria», limpieza «como máximo 24 horas después de expirar»; probar 429/Retry-After y reinicio en server/tests/login-limit.test.js.
- [X] T038 [US5] Crear client/src/pages/LoginPage.jsx, client/src/components/RequireAdmin.jsx y client/src/services/auth.js; consultar sesión, manejar CSRF renovado y salida, sin persistir credenciales; integrar rutas de App.jsx.
- [X] T039 [US5] Comprobar acceso/expiración/logout y pestaña antigua en tests/e2e/auth.spec.js y registrar evidencia en specs/001-tienda-whatsapp/evidence/us5.md; cubrir creación CLI sin exposición de contraseña en server/tests/admin-create.test.js.

**Checkpoint**: Autenticación completa; la UI oculta no sustituye las comprobaciones del servidor.

## Phase 7: User Story 6 - Gestión de productos (Priority: P1)

**Goal**: CRUD y configuración del vendedor con permisos, validaciones y conflictos explícitos.
**Independent Test**: Crear/editar/eliminar desde panel, cancelar y rechazar valores inválidos; destino configurado aparece en pedido posterior.

### Tests for User Story 6

- [X] T040 [P] [US6] Escribir contratos de /api/admin/products y /api/admin/settings en server/tests/admin-catalog.test.js: 401/403 sin cambios, 422, alta repetida, conflicto de versión y 404 tras eliminación.
- [X] T041 [P] [US6] Escribir pruebas de formulario, URL opcional, precio, confirmación de borrado y número vendedor en client/tests/admin-catalog.test.jsx.

### Implementation for User Story 6

- [X] T042 [US6] Implementar validadores en server/src/validation/product.js y server/src/validation/settings.js usando literalmente las restricciones de T010; UUID y versión positiva, campos extra rechazados, URL vacía a null, precio entero y número con formato RN-06 normalizado o null.
- [X] T043 [US6] Extender server/src/db/products.js y server/src/db/settings.js con transacciones CRUD/configuración, alta idempotente por UUID con respuesta 200/201 o 409 por contenido diferente, control de versión y sin éxito anterior al commit.
- [X] T044 [US6] Implementar server/src/routes/admin-products.js y server/src/routes/admin-settings.js con auth/CSRF, errores y respuestas exactas del contrato; montar en server/src/app.js sin ruta pública de registro.
- [X] T045 [US6] Crear client/src/pages/AdminPage.jsx, client/src/components/ProductForm.jsx y client/src/components/DeleteProductDialog.jsx: URL sin carga de archivos, conversión exacta de precio, ID conservado en reintento, cancelar sin guardar y conflictos sin sobrescritura automática.
- [X] T046 [US6] Crear client/src/components/SellerSettings.jsx y client/src/styles/admin.css con número guardable/eliminable, avisos de impacto, formularios accesibles y diseño móvil sin tabla desbordada.
- [X] T047 [US6] Completar tests/e2e/admin-catalog.spec.js y specs/001-tienda-whatsapp/evidence/us6.md con HU6.1–HU6.7, error de formulario conservando entradas y actualización pública del catálogo.

**Checkpoint**: Administración operativa con seguridad y validación en servidor, número persistente y permisos probados.

## Phase 8: User Story 7 - Persistencia y recuperación (Priority: P1)

**Goal**: Mantener cambios confirmados y distinguir errores de estados vacíos.
**Independent Test**: Reiniciar con mismo archivo después de alta/edición/borrado y cambio de número; conservar todo sin duplicar.

### Tests for User Story 7

- [X] T048 [P] [US7] Escribir pruebas de reinicio/migración repetida y conservación de configuración en server/tests/persistence.test.js usando SQLite en directorio temporal.
- [X] T049 [P] [US7] Escribir pruebas de bloqueo de escritura real, rollback, respuesta perdida y fallo de lectura controlado en server/tests/database-failures.test.js, sin endpoint de fallo en producción.

### Implementation for User Story 7

- [X] T050 [US7] Completar manejo de busy/rollback/cierre seguro en server/src/db/connection.js, server/src/index.js y server/src/middleware/errors.js: 503 recuperable, ninguna escritura parcial, consulta de estado antes de reintentos inciertos.
- [X] T051 [US7] Añadir tests/e2e/recovery.spec.js para presentación de error/reintento sin borrar carrito/formulario y documentar backup/restauración en copia en README.md; registrar HU7 en specs/001-tienda-whatsapp/evidence/us7.md sin afectar DB real.

**Checkpoint**: Reinicios y fallos comprobados con almacenamiento real aislado; producto confirmado no reaparece tras borrado.

## Phase 9: User Story 2 - Búsqueda (Priority: P2)

**Goal**: Buscar por nombre sin alterar selección.
**Independent Test**: Café molido/Cafetera/Té verde; « cafe » devuelve los dos primeros, limpiar restaura todos y búsqueda inexistente muestra mensaje específico.

### Tests for User Story 2

- [X] T052 [P] [US2] Escribir pruebas de coincidencia parcial, tildes/mayúsculas/espacios y exclusión de descripción en client/tests/search.test.js.
- [X] T053 [P] [US2] Escribir pruebas de limpieza, cero resultados y conservación del carrito en client/tests/search-bar.test.jsx.

### Implementation for User Story 2

- [X] T054 [US2] Crear client/src/utils/search.js y client/src/components/SearchBar.jsx, integrar filtro en client/src/pages/StorePage.jsx y resultado anunciado sin robar foco.
- [X] T055 [US2] Comprobar HU2 en tests/e2e/search.spec.js y registrar resultado en specs/001-tienda-whatsapp/evidence/us2.md.

**Checkpoint**: Búsqueda independiente comprobada; prioridad P2 no la excluye de la entrega solicitada.

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar criterios transversales y comandos reales, sin ampliar producto.

- [X] T056 [P] Completar accesibilidad, foco, contraste acordado en T001 y responsive de todas las páginas en client/src/styles/base.css y tests/e2e/accessibility.spec.js; comprobar teclado, zoom 200 % y ambos tamaños sin controles ocultos.
- [X] T057 [P] Medir perfil 500 productos/20 lectores y presupuesto del plan en tests/performance/catalog.mjs; registrar equipo, p95 y filtro en specs/001-tienda-whatsapp/evidence/performance.md sin optimizaciones especulativas.
- [X] T058 [P] Revisar secretos, cabeceras, proxy, cookies de producción y ausencia de datos sensibles en respuestas/logs mediante server/tests/security.test.js y tests/e2e/security.spec.js; documentar comprobación HTTPS de producción en specs/001-tienda-whatsapp/evidence/security.md.
- [X] T059 Completar README.md y specs/001-tienda-whatsapp/quickstart.md con versiones probadas, entorno, comandos Windows/Linux y procedimiento HTTPS local reproducible; ejecutar install/ci, db:init dos veces, admin:create, dev, lint, test, test:setup, test:e2e, build y start en entorno limpio y registrar resultados reales en specs/001-tienda-whatsapp/evidence/commands.md.
- [ ] T060 Ejecutar aceptación HU1–HU7/SC-001–SC-007, incluidos tiempos y segunda persona para documentación, en specs/001-tienda-whatsapp/evidence/acceptance.md; resolver fallos, actualizar specs/README.md y estado de tareas sin alterar checklists del revisor ni afirmar validación no realizada.

## Dependencies & Execution Order

Setup T001–T007 → fundamentos T008–T014 → historias. Secuencia segura por defecto: orden
numérico T001–T060. Las pruebas [P] se pueden escribir simultáneamente dentro de su fase;
no deben marcarse terminadas hasta comprobar el comportamiento después de implementar.
T003/T004/T005 se paralelizan solo después de T002 y sin editar simultáneamente package.json;
T006 integra los scripts. Las tareas finales [P] esperan todas las historias.

### User Story Dependencies

```text
Setup → Fundamentos → US1 → US3 → US4
                    └→ US5 → US6 → US7
                         US1 ─┘
                    US1 + US3 → US2
Todas las historias → cierre transversal
```

US4 usa productos/número sembrados solo en fixtures para su prueba independiente, no depende
del panel US6. Su uso comercial sí requiere configuración real de US6. Dependencia adicional de archivos compartidos: T027 (US4) → T043 (US6).
US5 es comprobable con
cuenta efímera sin CRUD; US6 requiere US5, consultas de US1 y configuración de US4 según orden
secuencial. Para adelantar US6, extraer primero settings.js de T027 sin duplicarlo.
US7 prueba operaciones de US6. US2 se integra con US1/US3; su función de búsqueda se prueba aislada.
Archivos compartidos app.js, App.jsx y StorePage.jsx se modifican secuencialmente.

### Parallel Examples per Story

| Historia | Trabajo paralelo permitido tras sus prerrequisitos |
| --- | --- |
| US1 | T015 (contrato servidor) y T016 (componentes). |
| US3 | T020 (estado) y T021 (formulario de carrito). |
| US4 | T025 (contrato checkout) y T026 (flujo cliente). |
| US5 | T032 (seguridad servidor) y T033 (login cliente). |
| US6 | T040 (CRUD servidor) y T041 (formularios). |
| US7 | T048 (reinicio) y T049 (fallos), cada suite con DB temporal propia. |
| US2 | T052 (normalización) y T053 (buscador). |

## Implementation Strategy

MVP demostrable inicial: fases 1–3, catálogo público HU1 con fixtures de prueba.
Incremento comercial mínimo: HU1 + HU3 + HU4, apoyado por HU5 + HU6 + HU7 para operación real.
La entrega final incluye también HU2; ninguna historia solicitada se descarta.
Entregar y validar cada fase sin requerir publicar ni desplegar automáticamente.

## Notes

- Checklist review.md permanece pendiente de su revisor; generar tareas no lo aprueba.
- T001 registra decisiones pendientes; no inventar una aprobación ni rebajar HU4.6 unilateralmente.
- Implementación y pruebas registradas en evidence/; aceptación humana pendiente en evidence/acceptance.md.
- Todas las tareas tienen ID único, ruta concreta y etiqueta US solo en fases de historia.
- FR-001/011/012: US1 y cierre; FR-002: US2; FR-003: US3; FR-004/005/006/013: US4;
  FR-007: US5; FR-008/009: US6; FR-010: US7; FR-014: fundamentos y errores de historias;
  FR-015: T059–T060. No incluir pagos, inventario, clientes registrados ni envío automático.

## Estado de ejecución — 2026-10-27

59 tareas completadas con evidencia técnica; T060 permanece abierta para tiempos manuales y segunda persona. No se alteraron checklists del revisor. 34 pruebas Vitest, 22 E2E, lint y build aprobados; npm ci, CLI y arranque comprobados. Los detalles y límites están en evidence/commands.md y evidence/acceptance.md.

## Phase 11: Convergence

Evaluación de convergencia del estado presente frente a spec.md, plan.md y T001–T060.
Las marcas anteriores no sustituyen evidencia; se conservan intactas. Revisión de 15 FR,
34 escenarios HU, componentes verificables de 7 SC, 8 RN, 11 casos límite, 12 decisiones
del plan y 11 principios constitucionales. Hallazgos: 1 CRITICAL, 4 HIGH, 4 MEDIUM, 2 LOW;
missing=2, partial=8, contradicts=1, unrequested=0. La aceptación humana y sus tiempos
siguen en T060: no se duplican como trabajo de código ni se declaran realizados.

- [ ] T061 [F1] CRITICAL Garantizar mensajes de validación en español de Perú en client/src/components/ProductForm.jsx y client/src/pages/LoginPage.jsx, incluyendo campos obligatorios y URL mal formada, sin depender del idioma del navegador; añadir regresiones en client/tests/admin-catalog.test.jsx, client/tests/auth.test.jsx y tests/e2e/admin-catalog.spec.js con navegador en inglés y verificar conservación de entradas y ausencia de escrituras inválidas. Evidencia: un Nombre vacío expone «Please fill out this field.» en Chromium en-US. per Constitution II, FR-012, FR-014, SC-006 (contradicts)
- [X] T062 [F2] HIGH Vincular la preparación de WhatsApp a la selección vigente en client/src/components/CheckoutButton.jsx y al estado de client/src/state/CartProvider.jsx: si cambia el carrito durante la petición, impedir abrir su respuesta obsoleta y no sobrescribir cambios posteriores con un CART_CHANGED antiguo; invalidar también el enlace alternativo al cambiar cantidades, agregar o retirar productos, y retirarlo al vaciar el carrito. Añadir pruebas diferidas y de ventana bloqueada en client/tests/checkout.test.jsx y tests/e2e/checkout.spec.js que reproduzcan cantidad solicitada 1 frente a cantidad visible 2 y enlace todavía presente después de retirar todo. per FR-004, FR-006, RN-04, RN-05, SC-002, T026, T030 (partial)
- [X] T063 [F3] HIGH Integrar el estado público GET /api/store en client/src/pages/StorePage.jsx y client/src/components/CheckoutButton.jsx para impedir finalizar cuando WhatsApp no esté configurado, no se pueda comprobar o el servidor informe WHATSAPP_UNAVAILABLE; mostrar el motivo y permitir comprobar nuevamente sin perder selección. Actualizar el estado al regresar del panel con número guardado o retirado, conservar la validación autoritativa del checkout y cubrir número ausente, retiro, recuperación y guardado en client/tests/checkout.test.jsx y tests/e2e/checkout.spec.js. Evidencia: el botón solo depende de items.length/busy y no se consume whatsappConfigured. per FR-005, FR-009, US6/AC6, T029, T030, T046 (partial)
- [ ] T064 [F4] HIGH Separar carga, error de lectura y lista vacía confirmada en client/src/pages/AdminPage.jsx; presentar «Aún no hay productos» únicamente tras una lectura exitosa vacía, ofrecer reintento y distinguir cualquier lista anterior del estado actual. Añadir pruebas de 503 inicial y recuperación con catálogo no vacío en client/tests/admin-catalog.test.jsx y tests/e2e/recovery.spec.js. Evidencia reproducida: un GET /api/admin/products con 503 muestra simultáneamente el error y «Aún no hay productos. Agrega el primero.». per FR-010, FR-014, RN-08, US7/AC2, T045, T051 (partial)
- [ ] T065 [F5] HIGH Identificar y asociar cada error con su campo en client/src/components/ProductForm.jsx, usando etiquetas españolas, identificadores, aria-describedby y aria-invalid, para nombre, descripción, precio e imagen; conservar los valores corregibles y mostrar aparte los errores generales. Añadir pruebas con nombre/descripción de solo espacios y respuesta 422 en client/tests/admin-catalog.test.jsx y tests/e2e/admin-catalog.spec.js. Evidencia: Object.entries(fields) presenta «Debe tener entre 1 y 100 caracteres.» sin indicar Nombre y sin asociación al control. per FR-008, FR-014, US6/AC3, T041, T045 (partial)
- [ ] T066 [F6] MEDIUM Unificar el cómputo de longitud Unicode de nombre y descripción entre client/src/components/ProductForm.jsx y server/src/validation/common.js; permitir los límites de 100/1000 caracteres definidos por el servidor sin que maxLength en UTF-16 rechace antes entradas válidas. Verificar límites y exceso con caracteres suplementarios en client/tests/admin-catalog.test.jsx y server/tests/admin-catalog.test.js, sin ampliar los límites del producto. per RN-01, T010, T042 (partial)
- [ ] T067 [F7] MEDIUM Completar tests/e2e/auth.spec.js y su soporte aislado con un formulario administrativo abierto cuya sesión caduca: comprobar rechazo al guardar/eliminar, regreso a autenticación y ausencia de cambios persistidos. Cubrir los límites de inactividad y absoluto mediante reloj controlado del servidor de pruebas, o enlazar una simulación explícita de UI con las pruebas reales de server/tests/session-expiry.test.js; no crear rutas de control en producción. Registrar el alcance real en specs/001-tienda-whatsapp/evidence/us5.md. per FR-007, US5/AC4, SC-004, T032, T039 (partial)
- [ ] T068 [F8] MEDIUM Completar tests/e2e/accessibility.spec.js con navegación por teclado y ampliación al 200 % de login, panel, formulario de producto y diálogo de eliminación, además de tienda/carrito, en los tamaños previstos; verificar controles esenciales, foco y ausencia de recorte, no solo scrollWidth. Comprobar y documentar el zoom de navegador por separado de la simulación CSS, registrar resultados reales en specs/001-tienda-whatsapp/evidence/accessibility.md y corregir los estilos afectados si se detectan fallos. Evidencia: el test actual restaura zoom antes de loginUI y no recorre formulario ni diálogo ampliados. per FR-011, SC-006, T056 (partial)
- [ ] T069 [F9] MEDIUM Verificar la restauración independiente del respaldo descrito en README.md mediante una prueba aislada en server/tests/persistence.test.js o server/tests/backup-restore.test.js: cerrar la base temporal, crear copia coherente, restaurarla en otra ruta, usar sesiones nuevas y comprobar productos, edición, borrado, administrador y configuración sin modificar la fuente. Registrar procedimiento y resultado en specs/001-tienda-whatsapp/evidence/us7.md, distinguiéndolo de reabrir el mismo archivo y de la aceptación humana pendiente. per plan: copia de respaldo y restauración probada en copia, FR-010, FR-015, T048, T051, T059 (missing)
- [ ] T070 [F10] LOW Completar server/src/middleware/request-log.js y server/src/middleware/errors.js para registrar el código público de error y una ruta estable con prefijo /api antes de los montajes de routers, junto con requestId, método, estado y duración; conservar la exclusión de query, cuerpos, cookies, tokens y mensajes. Añadir pruebas de dos rutas montadas y un rechazo controlado en server/tests/security.test.js o server/tests/errors.test.js. per plan: logs con ruta y código de error, T012, T058 (partial)
- [X] T071 [F11] LOW Mostrar antes de iniciar la navegación, en client/src/components/CheckoutButton.jsx o client/src/components/Cart.jsx, que se necesita acceso a WhatsApp y que el cliente revisará y enviará el mensaje por su cuenta; conservar carrito y ausencia de confirmación de envío. Verificar que el aviso existe antes del clic, tanto con ventana disponible como bloqueada, en client/tests/checkout.test.jsx. per spec: Edge Cases — WhatsApp no accesible en el dispositivo, US4/AC6, US4/AC8, T030 (missing)

Validación posterior del pedido: T062, T063 y T071 completadas. Evidencia en evidence/whatsapp-checkout.md: 43 pruebas Vitest y 12 E2E de WhatsApp/carrito aprobadas, además de lint y build. Las otras brechas y T060 siguen pendientes.
