# Implementation Plan: BioNut

**Branch**: `001-tienda-whatsapp` | **Date**: 2026-10-26 | **Spec**: [spec.md](spec.md)

**Input**: Especificación de `specs/001-tienda-whatsapp/spec.md` y solicitud de plan con
React/Vite, Express/SQLite y carpetas `client/` y `server/`.

## Summary

Crear una tienda pública en español de Perú con catálogo, búsqueda, carrito temporal y apertura
de un mensaje de WhatsApp. Administrador autenticado para productos y número del vendedor.
Una aplicación React consume la API REST Express; SQLite conserva catálogo y configuración.
Diseño implementado. Resultados en evidence/ y estado en ../README.md. La aceptación humana final permanece pendiente.

## Technical Context

**Language/Version**: JavaScript con módulos ES y JSX; Node.js 24.x, npm 11.x.

**Primary Dependencies**: React 19, Vite con plugin React; Express 5, better-sqlite3,
express-session con almacenamiento SQLite, argon2, helmet y express-rate-limit.
Elegir versiones compatibles al implementar y fijarlas en package-lock.json; no usar latest
como dependencia flotante. No se necesita un ORM ni un gestor global de estado externo.

**Storage**: SQLite en `server/data/tienda.sqlite`; migraciones versionadas, consultas
parametrizadas, transacciones, claves foráneas y WAL. Sesiones en almacén SQLite separado.

**Testing**: Vitest, React Testing Library y jsdom para cliente; Vitest y Supertest para API;
Playwright para recorridos de navegador. SQLite temporal por suite, sin tocar datos reales.

**Target Platform**: Desarrollo Windows PowerShell y Linux; producción en un solo proceso
Node con disco persistente local y HTTPS mediante proxy confiable; navegadores modernos móvil/PC.

**Project Type**: Aplicación web con API REST del mismo origen.

**Performance Goals**: Presupuesto de diseño, no resultado medido: con 500 productos y
20 lectores concurrentes, respuestas de lectura p95 menor a 500 ms en entorno de prueba
registrado; filtro visible menor a 300 ms una vez cargado el catálogo. Medir sin imágenes
externas y reportar equipo/condiciones. Se conservan los objetivos manuales SC-001–SC-007.

**Constraints**: Una tienda y un administrador; sin registro de clientes, pagos, facturación,
inventario, envío automático ni almacenamiento de pedidos. Imágenes exclusivamente por URL.
Carrito en memoria de pestaña. No poner secretos en VITE_* ni en Git. No prometer alta disponibilidad.

**Scale/Scope**: Perfil de validación de 500 productos (no límite comercial nuevo), una instancia
Express y escrituras administrativas ocasionales. Evaluar otra arquitectura solo si mediciones
futuras justifican un cambio de alcance. No agregar Redis, microservicios ni colas.

## Constitution Check

Evaluación previa a investigación y posterior al diseño: APROBADA en ambos casos.

| Principio | Evidencia en el diseño | Antes / después |
| --- | --- | --- |
| I. Simplicidad | Dos workspaces, una API y SQLite; sin servicios adicionales. | Cumple / cumple |
| II. Español y soles | Mensajes es-PE, céntimos enteros y formato S/ con dos decimales. | Cumple / cumple |
| III. Alcance | Componentes y contratos ligados a FR-001–FR-015; sin nuevas funciones comerciales. | Cumple / cumple |
| IV. Verificable | quickstart reproduce HU1–HU7 con importes concretos. | Cumple / cumple |
| V. Sin registro | Rutas públicas y checkout sin sesión del cliente. | Cumple / cumple |
| VI. Administración | Sesión, autorización y CSRF comprobados en servidor. | Cumple / cumple |
| VII. Sin pagos | Enlace a mensaje de WhatsApp, sin envío automático. | Cumple / cumple |
| VIII. Secretos | Entorno privado, hash, logs redactados y revisión de diff. | Cumple / cumple |
| IX. Validar y probar | Esquemas, transacciones, pruebas unitarias/integración/E2E. | Cumple / cumple |
| X. Responsive | Contrato UI y pruebas 360×800 y 1366×768. | Cumple / cumple |
| XI. Documentación | Contrato npm y guía de instalación, reinicio y aceptación. | Cumple / cumple |

`client/` y `server/` sustituyen a los nombres anteriores de AGENTS.md por instrucción expresa
del usuario; no es una excepción a la constitución. Ninguna decisión de producto queda bloqueada.

## Project Structure

### Documentation (this feature)

```text
specs/001-tienda-whatsapp/
  spec.md
  plan.md
  research.md
  data-model.md
  quickstart.md
  contracts/
    api.md
    ui.md
  checklists/requirements.md
```

`tasks.md` será generado por speckit-tasks; no se crea en esta fase.

### Source Code (repository root)

Estructura prevista; estos archivos de aplicación se crearán durante implementación:

```text
package.json
package-lock.json
.env.example
README.md
scripts/                    # coordinación portable y validación de entorno
client/
  package.json
  vite.config.js
  src/
    components/             # Header, SearchBar, ProductCard, Cart
    pages/                  # StorePage, LoginPage, AdminPage
    state/                  # reducer de carrito por productId
    services/               # cliente HTTP, sin reglas de autorización
    utils/                  # validación de formularios y moneda
    styles/
  tests/
server/
  package.json
  src/
    app.js                  # fábrica testeable, sin escuchar al importar
    index.js                # configuración, arranque y apagado
    routes/
    middleware/             # auth, CSRF, errores, límites
    services/               # checkout y operaciones de negocio
    db/                     # conexión, migraciones y consultas
    validation/
  scripts/                  # db:init, admin:create
  data/                     # ignorado por Git
  tests/
tests/e2e/
```

**Structure Decision**: npm workspaces client/server, bloqueo único en raíz. Vite sirve en 5173
y redirige /api a Express 3000 en desarrollo; Express sirve client/dist en producción.
Rutas API desconocidas devuelven JSON 404 antes del fallback de React. No usar vite preview
como servidor de producción. Ruta de archivos resuelta respecto al proyecto, no al cwd incidental.

## Complexity Tracking

Sin violaciones constitucionales ni excepciones solicitadas.

## Diseño y validación

Decisiones y fuentes: [research.md](research.md). Entidades: [data-model.md](data-model.md).
Contratos: [API](contracts/api.md) y [UI](contracts/ui.md). Operación y pruebas: [quickstart.md](quickstart.md).

| Cobertura | Diseño / prueba prevista |
| --- | --- |
| HU1/HU2, FR-001/002/011/012 | Tarjetas, búsqueda normalizada, responsive, estados de carga/error/vacío. |
| HU3, FR-003 | Reducer por ID; casos de nombres iguales, cantidades y céntimos. |
| HU4, FR-004/005/006/013 | Checkout público recalcula datos; cambios requieren nueva acción; sin envío real. |
| HU5, FR-007/014 | Login/logout, cookie, CSRF, expiración, límites, intentos directos rechazados. |
| HU6, FR-008/009 | CRUD, URL, validación, configuración y conflictos; aislamiento de escrituras. |
| HU7, FR-010 | Reinicio con DB en disco; fallo controlado, rollback y reintento verificable. |
| FR-015 | Verificación de todos los comandos en clon limpio y README operativo. |

Logs de servidor con requestId, método, ruta sin query, estado, duración y código de error;
no registrar cuerpos, contraseñas, cookies, tokens ni mensajes del carrito. Errores al usuario
en español y sin trazas. Apagado ordenado cierra DB; copia de respaldo solo con proceso detenido
(o herramienta de backup SQLite), restauración probada en copia. No usar SQLite en disco efímero.

## Decisiones aplicadas

El checkout abre WhatsApp en una pestaña separada para mantener el carrito original; véase review-decisions.md. Implementación comprobada con Node.js 24.22.1, npm 11.19.1 y versiones del lockfile. Presupuesto de rendimiento medido en evidence/performance.md.
