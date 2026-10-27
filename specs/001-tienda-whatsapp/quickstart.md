# Inicio rápido y validación

Implementación disponible. Comandos y requisitos completos en [README.md](../../README.md). Entorno probado: Windows, Node.js 24.22.1 y npm 11.19.1. Véanse [comandos](evidence/commands.md), [rendimiento](evidence/performance.md) y [aceptación pendiente](evidence/acceptance.md).

## Preparar y ejecutar

Desde la raíz, en PowerShell o Linux/macOS:

```sh
npm ci
npm run env:init
npm run db:init
npm run admin:create
npm run dev
```

En PowerShell se puede usar npm.cmd. Abre http://localhost:5173 y entra a Administración. La CLI pide una contraseña oculta de 15–128 caracteres; no existe cuenta predeterminada. Configura el número del negocio y crea tus productos. Ctrl+C detiene el desarrollo.

.env se crea con un secreto aleatorio sin imprimirlo; no se reemplaza si ya existe. SQLite empieza vacío y las migraciones se pueden repetir. Productos y configuración están en server/data/tienda.sqlite; las sesiones usan un archivo separado. Estos archivos están excluidos de Git. No uses las bases reales para pruebas.

## Comprobar

```sh
npm run lint
npm test
npm run build
npm run test:setup
npm run test:e2e
npm run test:performance
npm run test:commands
```

test:setup descarga Chromium. Playwright inicia una tienda HTTPS aislada, con credenciales efímeras y pantallas 360×800 y 1366×768; intercepta WhatsApp sin enviar mensajes. Para ver los recorridos, usa npm run test:e2e -- --headed.

test:commands comprueba db:init dos veces, admin:create con entrada oculta, rechazo de sobrescritura, dev y start con bases temporales. Los puertos 3000, 5173 y 4318 deben estar libres.

## HTTPS local de producción

```sh
npm run build
npm run preview:https
```

Abre https://localhost:3443 y acepta el certificado autofirmado únicamente para esta comprobación local. El lanzador usa npm start detrás de un proxy de prueba, fija APP_ORIGIN y TRUST_PROXY en sus procesos y conserva Secure. No ejecutarlo al mismo tiempo que dev. Un despliegue real necesita certificado confiable y almacenamiento persistente; consulta README.

## Recorrido manual

1. Crea A a S/ 12.50 y B a S/ 8.00. Sin sesión, agrega A×2 y B×1: S/ 33.00.
2. Cambia A a 3: S/ 45.50; retira B: S/ 37.50. Cantidad cero se rechaza.
3. Busca por nombre, con espacios/mayúsculas/tildes; limpia y comprueba la selección.
4. Finaliza, revisa el mensaje en WhatsApp sin enviar y regresa a la pestaña de la tienda. El carrito se conserva.
5. Desde otra sesión cambia precio/elimina un producto; el pedido exige revisar y pulsar nuevamente.
6. Prueba imagen ausente, catálogo vacío, número sin configurar, credenciales inválidas y cierre de sesión en otra pestaña.
7. Crea/edita/elimina desde el panel, reinicia y comprueba que los cambios y el número permanecen.
8. Repite en móvil/escritorio con teclado. Registra tiempos SC-001/SC-003; otra persona sigue esta guía para SC-007.

## Recuperación

Supertest usa un bloqueo real SQLite y cierre de conexión para comprobar 503 sin cambios parciales. Playwright intercepta errores y pierde una respuesta después de un alta confirmada para comprobar mensajes, conservación del formulario y reintento sin duplicados. No existe un endpoint público para provocar fallos.

Para respaldar, detén la app, comprueba cierre limpio y copia SQLite a un lugar privado. Restaura primero en una ruta distinta configurada en DATABASE_PATH y una base de sesiones nueva. No reemplaces datos reales durante una prueba. Detalle y límites en README.
