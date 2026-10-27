# AGENTS.md — BioNut

## Proyecto y objetivo

BioNut es una aplicación web de catálogo comercial para preparar pedidos y abrir
su resumen en WhatsApp. Las decisiones de producto deben respetar la constitución y la
spec aprobada. Este archivo guía el trabajo técnico; no amplía el alcance del producto.
Antes de trabajar, leer `.specify/memory/constitution.md`, `specs/README.md` y los artefactos
de la funcionalidad correspondiente. Preferir la solución más simple para la versión 1.

## Stack y arquitectura

Stack obligatorio: React, Vite, Node.js, Express y SQLite. Usar npm para gestionar dependencias.
La implementación debe fijar y documentar las versiones compatibles de Node.js y npm.

Estructura implementada (Node.js 24.22.1 y npm 11.19.1 comprobados):

- `client/`: aplicación React con Vite. Componentes de presentación, páginas, estado de
  selección de productos y cliente HTTP para consumir la API. No accede directamente a SQLite.
- `server/`: servidor Node.js con Express. Rutas bajo `/api`, validación, autorización,
  reglas de negocio y acceso a SQLite. Separar estas responsabilidades sin crear capas vacías.
- `server/data/`: ubicación predeterminada de la base SQLite local, configurable por entorno.
  No publicar la base de datos ni sus archivos auxiliares; documentar inicialización y respaldo.
- `specs/`: especificaciones, planes, tareas y evidencias de aceptación por funcionalidad.
- `package.json` raíz: scripts que coordinan frontend y backend mediante npm workspaces.

En desarrollo, Vite debe redirigir `/api` a Express. Para la ejecución de la compilación,
Express debe servir la API y los archivos generados por Vite desde el mismo origen.
Mantener el acceso a datos en el backend y usar consultas parametrizadas. Guardar importes
como enteros en céntimos para evitar errores de redondeo; formatearlos al presentarlos.

## Instalación, ejecución y pruebas

Los comandos siguientes existen en los workspaces. Ejecutarlos desde la raíz y consultar README.md para entorno, HTTPS, pruebas de navegador y evidencias. No crear scripts vacíos ni comandos que simulen éxito.

| Comando desde la raíz | Comportamiento implementado |
| --- | --- |
| `npm install` | Instalar las dependencias de la raíz, frontend y backend. |
| `npm ci` | Instalar de forma reproducible usando el `package-lock.json` versionado. |
| `npm run db:init` | Crear el esquema SQLite de forma idempotente, sin borrar datos existentes. |
| `npm run admin:create` | Crear el administrador mediante entrada interactiva, sin mostrar ni registrar la contraseña. |
| `npm run dev` | Iniciar Vite y Express en desarrollo e informar sus direcciones locales. |
| `npm run build` | Generar la compilación de producción del frontend y validar su generación. |
| `npm start` | Iniciar Express y servir la API y el frontend previamente compilado. |
| `npm run lint` | Revisar las convenciones del código de frontend y backend. |
| `npm test` | Ejecutar las pruebas automatizadas de frontend y backend una vez, sin modo observación. |

La documentación de implementación debe incluir requisitos previos, archivos de configuración,
variables obligatorias y ejemplos ficticios, puertos, inicialización de base de datos y creación
del administrador. Ningún secreto puede usar el prefijo público `VITE_`.

Verificar en un entorno limpio: `npm ci`, configurar el entorno según la documentación,
`npm run db:init`, `npm run admin:create`, `npm run lint`, `npm test`, `npm run build` y
`npm start`. Comprobar también `npm run dev` por separado. Registrar resultados reales y
actualizar `specs/README.md`; no afirmar que un comando pasó si no se ejecutó.

## Convenciones de programación

- Mantener módulos pequeños con responsabilidades claras y reutilizar código cuando exista
  una necesidad concreta; no anticipar frameworks internos ni funcionalidades futuras.
- Usar módulos ES, nombres descriptivos, `camelCase` para funciones y variables, y `PascalCase`
  para componentes React. Respetar las convenciones existentes cuando ya haya código.
- Mantener reglas de negocio fuera de componentes de presentación y acceso SQL fuera de rutas.
- Validar entradas en el servidor; la validación del navegador solo mejora la experiencia.
  Manejar errores con respuestas consistentes, sin revelar trazas ni detalles internos.
- No introducir dependencias sin justificar su utilidad para un requisito aprobado.
- Actualizar documentación y pruebas cuando cambie el comportamiento correspondiente.

## Testing y aceptación

Las pruebas deben verificar comportamientos observables y riesgos del cambio, no copiar su
implementación. Usar pruebas unitarias para cálculos y formación del mensaje, pruebas de
componentes para interacción y pruebas de integración para API, SQLite y autorización.
Cada prueba de integración debe usar una base aislada y nunca modificar datos reales.

Cubrir selección y eliminación de productos, cantidades e importes, resumen de WhatsApp,
entradas inválidas y rechazo de modificaciones sin autorización. Verificar que los rechazos
no alteren datos. Evitar enviar mensajes reales durante las pruebas.

Ejecutar los controles pertinentes antes de cerrar una tarea. Para la aceptación de producto,
comprobar manualmente el recorrido sin registro en celular y PC: catálogo, selección,
eliminación, importes y apertura de WhatsApp. Registrar dimensiones de pantalla y resultados.
No declarar terminada una funcionalidad con pruebas fallidas o criterios sin verificar.

## Seguridad del panel de administración

- Exigir autenticación del administrador y autorización en el servidor para toda creación,
  edición y eliminación de productos. No confiar en controles ocultos ni en valores del cliente.
- No implementar registro público de administradores ni credenciales predeterminadas.
  Guardar contraseñas únicamente mediante un hash adaptativo con sal y una biblioteca mantenida.
- Preferir sesiones con cookies `HttpOnly`, `SameSite` y `Secure` en producción sobre HTTPS.
  Proteger las operaciones de modificación frente a CSRF y limitar intentos de inicio de sesión.
- Invalidar la sesión al cerrar sesión y definir su expiración. Mantener secretos en el entorno;
  no enviarlos al frontend ni incluirlos en registros, documentación o mensajes de error.
- Proteger el archivo SQLite y usar consultas parametrizadas. Validar tipos, límites e
  identificadores en el servidor antes de escribir datos.
- Probar acceso anónimo, credenciales incorrectas, sesión inválida y operaciones autorizadas.
  Aplicar solo la protección necesaria para esta arquitectura, sin anticipar roles adicionales.

## Git y ramas feature

- Revisar el estado y los cambios existentes antes de editar. No revertir trabajo ajeno ni
  usar operaciones destructivas para limpiar el repositorio.
- Trabajar las funcionalidades en ramas `NNN-descripcion-corta`, por ejemplo
  `001-catalogo-productos`, siguiendo la numeración de Spec Kit. Vincular la rama con su
  carpeta de especificación y usar el flujo de creación de ramas del proyecto.
- Mantener commits pequeños y coherentes con prefijos como `feat:`, `fix:`, `test:` o `docs:`.
  Revisar el diff y preparar archivos concretos; no incluir cambios ajenos a la tarea.
- Versionar el archivo de bloqueo de npm. Excluir dependencias, compilaciones, bases SQLite,
  archivos auxiliares, `.env` y secretos; los ejemplos de entorno solo llevan valores ficticios.
- Antes de un commit o publicación, revisar secretos y ejecutar las verificaciones pertinentes.
  No publicar, fusionar ni reescribir historial sin autorización del usuario.
- Si falta identidad de Git, solicitar los datos; no inventar nombre o correo.

## Idioma y moneda

Todo texto visible, errores, instrucciones y mensajes de pedido deben usar español de Perú.
Mostrar importes en soles con el símbolo `S/` y dos decimales, de manera consistente en la
interfaz y WhatsApp. Centralizar el formato con configuración regional `es-PE` y moneda `PEN`,
comprobando que el resultado respete el símbolo requerido. El diseño debe funcionar en
celulares y PC y permitir completar las acciones mediante controles accesibles.

## Mantenimiento del estado

Actualizar `specs/README.md` cuando cambie el estado real de una funcionalidad. Enlazar su
spec, plan, tareas y evidencias cuando existan, distinguir pendiente, en curso y verificado,
y registrar bloqueos. Marcar como verificados solo los contratos respaldados por pruebas ejecutadas.

Las reglas de producto viven en .specify/memory/constitution.md y el estado del producto en specs/README.md
