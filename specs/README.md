# Estado de BioNut

Actualizado: 2026-10-27. Rama: 001-tienda-whatsapp.

Aplicación implementada con React/Vite, Express y SQLite. Catálogo público, búsqueda por nombre, carrito, mensaje de WhatsApp, administración autenticada, CRUD, configuración del vendedor y persistencia disponibles. Sin pagos, facturación ni registro de clientes.

| Área | Estado | Evidencia |
| --- | --- | --- |
| HU1 Catálogo | Comprobada automáticamente | [HU1](001-tienda-whatsapp/evidence/us1.md) |
| HU2 Búsqueda | Comprobada automáticamente | [HU2](001-tienda-whatsapp/evidence/us2.md) |
| HU3 Carrito | Comprobada automáticamente | [HU3](001-tienda-whatsapp/evidence/us3.md) |
| HU4 WhatsApp | Comprobada sin envío real | [HU4](001-tienda-whatsapp/evidence/us4.md) |
| HU5 Autenticación | Comprobada con HTTPS y sesiones | [HU5](001-tienda-whatsapp/evidence/us5.md) |
| HU6 Gestión | Comprobada automáticamente | [HU6](001-tienda-whatsapp/evidence/us6.md) |
| HU7 Persistencia | Comprobada con SQLite temporal real | [HU7](001-tienda-whatsapp/evidence/us7.md) |
| Instalación y ejecución | Comandos reales comprobados | [Comandos](001-tienda-whatsapp/evidence/commands.md) |
| Rendimiento | Presupuesto local cumplido | [Medición](001-tienda-whatsapp/evidence/performance.md) |
| Seguridad y diseño | Pruebas y revisión de capturas | [Seguridad](001-tienda-whatsapp/evidence/security.md), [Accesibilidad](001-tienda-whatsapp/evidence/accessibility.md) |
| Aceptación final T060 | Pendiente de personas y tiempos manuales | [Registro](001-tienda-whatsapp/evidence/acceptance.md) |

43 pruebas Vitest aprobadas. La verificación actual de WhatsApp/carrito aprobó 12 casos en celular y PC; la corrida E2E completa anterior aprobó 22 recorridos. Lint, build, instalación limpia y comandos comprobados. Auditoría npm sin vulnerabilidades reportadas. SQLite local preparada con 10 productos de prueba agregados por solicitud del usuario y verificados mediante la API pública. Incluyen nombre, descripción, precio en soles e imágenes externas de referencia. Se verificó la carga de las 10 imágenes en Chromium. No hay administrador predeterminado; el propietario debe ejecutar npm run admin:create.

## Documentos

- [Constitución](../.specify/memory/constitution.md)
- [Especificación](001-tienda-whatsapp/spec.md)
- [Plan](001-tienda-whatsapp/plan.md), [investigación](001-tienda-whatsapp/research.md), [modelo](001-tienda-whatsapp/data-model.md)
- [API](001-tienda-whatsapp/contracts/api.md), [interfaz](001-tienda-whatsapp/contracts/ui.md)
- [Tareas](001-tienda-whatsapp/tasks.md), [decisiones](001-tienda-whatsapp/review-decisions.md)
- [Instalación](../README.md), [inicio rápido](001-tienda-whatsapp/quickstart.md)

## Checklists y límites de la validación

requirements.md mantiene 16/16 marcas documentales; review.md mantiene sus 36 ítems pendientes del revisor. El usuario autorizó continuar sin modificarlos. Su estado no se confunde con el progreso del código.

T001–T059, T062, T063 y T071 cuentan con implementación y evidencia. Las otras brechas de convergencia y T060 permanecen abiertas. No se afirma que una persona no técnica o una segunda persona haya completado la aceptación. No hubo despliegue, publicación ni envío de mensajes. Los cambios están en el directorio de trabajo para revisión.

El número del vendedor solicitado quedó configurado en SQLite. Finalizar pedido y sus avisos están comprobados; detalle en [verificación de WhatsApp](001-tienda-whatsapp/evidence/whatsapp-checkout.md).

Configuración documentada: `.env.example` incluye comentarios sin secretos; README explica la creación administrativa interactiva, `SESSION_SECRET` generado por `env:init` y WhatsApp configurable en SQLite desde Administración. Verificación del 2026-10-27: 7 pruebas de configuración, creación administrativa, autenticación, ajustes y seguridad aprobadas. Git ignora `.env`, no lo tiene versionado y permite `.env.example`. Esta actualización no modifica credenciales ni el entorno local existente.

Nombre comercial actualizado a BioNut por solicitud del propietario. Se conservan las rutas de especificaciones y la rama existentes para mantener sus referencias.

Cierre de rama solicitado el 2026-10-27: lint, 43 pruebas Vitest, build, 28 pruebas E2E, rendimiento (500 productos/20 lectores) y comandos reales aprobados antes de integrar. Las tareas de convergencia y aceptación humana indicadas arriba siguen pendientes; integrar la rama no las completa.
