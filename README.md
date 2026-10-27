# BioNut

Catálogo para pequeños negocios en Perú: el cliente busca productos, arma un carrito y abre un mensaje de WhatsApp para enviarlo por su cuenta. No requiere registro ni realiza pagos. El administrador autenticado mantiene productos y el número del vendedor.

## Requisitos

Probado en Windows con **Node.js 24.22.1**, **npm 11.19.1** y Chromium de Playwright. Se admite Node 24.x y npm 11.x. React 19, Vite 7, Express 5 y SQLite mediante better-sqlite3; las versiones resueltas están en package-lock.json. Los módulos nativos pueden requerir herramientas de compilación si no existe un binario para tu plataforma.

## Primer inicio

Ejecuta desde la raíz, en PowerShell o una terminal de Linux/macOS:

```sh
npm install
npm run env:init
npm run db:init
npm run admin:create
npm run dev
```

En PowerShell, si una política bloquea npm.ps1, usa **npm.cmd** en lugar de npm. Abre **http://localhost:5173**. Vite usa ese puerto y redirige /api a Express en 127.0.0.1:3000. Usa localhost también al iniciar sesión; el origen debe coincidir con APP_ORIGIN. Ctrl+C detiene el desarrollo.

env:init crea .env con un secreto aleatorio sin imprimirlo; si ya existe, no lo cambia. db:init se puede repetir sin borrar datos. admin:create pide usuario (3–64 caracteres) y contraseña (15–128) con entrada oculta y confirmación. No hay cuenta ni contraseña predeterminada; repetir el comando no sobrescribe la cuenta existente.

El catálogo comienza vacío. En **Administración**, agrega productos y guarda el celular peruano del negocio. Se admite un número de nueve dígitos empezando por 9, con 51 o +51 opcional, espacios y guiones. Queda normalizado a 51 y nueve dígitos. Vaciarlo bloquea la finalización.

Cada producto tiene nombre, descripción, precio e imagen opcional mediante URL HTTPS pública sin usuario/contraseña. No se suben archivos. Una imagen ausente o inaccesible muestra un reemplazo sin ocultar el producto.

## Comandos reales

| Comando | Resultado |
| --- | --- |
| npm install | Instala los workspaces y genera/actualiza el lock. |
| npm ci | Reinstala exactamente las dependencias del lock. |
| npm run env:init | Prepara .env sin reemplazar uno existente. |
| npm run db:init | Aplica migraciones SQLite pendientes. |
| npm run admin:create | Crea el único administrador con contraseña oculta. |
| npm run dev | Inicia frontend y API. |
| npm run lint | Comprueba JavaScript y JSX. |
| npm test | Ejecuta Vitest, Testing Library y Supertest con SQLite temporal. |
| npm run build | Compila el frontend y comprueba la sintaxis del backend/scripts. |
| npm run test:setup | Instala Chromium para Playwright. |
| npm run test:e2e | Recorre la app compilada en 360×800 y 1366×768 con HTTPS y datos aislados. |
| npm run test:performance | Mide 500 productos, 20 lectores concurrentes y filtro visible. |
| npm run test:commands | Comprueba CLI, desarrollo y producción en almacenamiento temporal; necesita puertos 3000, 5173 y 4318 libres. |
| npm run preview:https | Ejecuta la compilación tras un proxy HTTPS local en https://localhost:3443. |
| npm start | Inicia Express en modo producción; requiere compilación y origen HTTPS. |

Antes de E2E o rendimiento, ejecuta npm run build. Las pruebas no envían mensajes reales: interceptan WhatsApp. Sus cuentas, secretos y bases son efímeros. Los reportes quedan en playwright-report/ y test-results/, excluidos de Git. El perfil de rendimiento escribe evidencia en specs/001-tienda-whatsapp/evidence/performance.md.

## Variables de entorno

.env.example documenta los valores de desarrollo. Nunca publiques .env ni valores VITE_* con secretos.

| Variable | Uso |
| --- | --- |
| NODE_ENV | development por defecto; npm start fuerza production. |
| HOST | Dirección de escucha; por defecto 127.0.0.1. |
| PORT | API; 3000 por defecto, entero 1–65535. El proxy de Vite espera 3000. |
| APP_ORIGIN | Origen exacto del navegador. http://localhost:5173 en desarrollo, HTTPS en producción. |
| DATABASE_PATH | SQLite de productos, administrador y configuración; ruta desde la raíz. |
| SESSION_DATABASE_PATH | SQLite separado para sesiones y límites de acceso. |
| SESSION_SECRET | Al menos 32 bytes aleatorios en hexadecimal; env:init lo genera. |
| TRUST_PROXY | false o número explícito de saltos de un proxy controlado. |

Cambiar SESSION_SECRET invalida cookies existentes. No configures TRUST_PROXY sin un proxy que reemplace los encabezados reenviados; restringe el acceso directo a Express.

## Configurar administrador, sesión y WhatsApp

1. **Secreto de sesión:** ejecuta `npm run env:init` desde la raíz. Genera `.env` a partir de [.env.example](.env.example) y completa `SESSION_SECRET` con 32 bytes aleatorios en hexadecimal (64 caracteres), sin imprimirlos. Si `.env` ya existe, lo conserva. Copiar la plantilla manualmente no basta: el secreto vacío impide iniciar el backend. Usa un secreto distinto por instalación; no reutilices la contraseña del administrador. Reinicia el backend después de modificar el entorno. Cambiar el secreto obliga a iniciar sesión nuevamente.
2. **Contraseña administrativa:** ejecuta `npm run db:init` y luego `npm run admin:create`. Ingresa un usuario de 3–64 caracteres y una contraseña propia de 15–128 caracteres, y confírmala. La entrada se oculta y el backend guarda únicamente su hash Argon2id en SQLite. No hay credenciales predeterminadas ni variable `ADMIN_PASSWORD`; este comando crea la cuenta inicial y rechaza sobrescribir una existente.
3. **Número de WhatsApp:** ejecuta `npm run dev`, abre la tienda y entra a **Administración** con tu cuenta. Guarda el celular peruano del negocio en la configuración de WhatsApp: nueve dígitos empezando por 9, con `51` o `+51` opcional. El backend lo valida y guarda en SQLite, normalizado como `51` seguido de los nueve dígitos. No existe una variable `WHATSAPP_NUMBER`: añadirla a `.env` no cambiaría el destinatario. Si dejas el número vacío, se muestra un aviso y se bloquea Finalizar pedido. Para comprobarlo, arma un carrito y revisa el destinatario y resumen que abre WhatsApp, sin enviar el mensaje.

React solo recoge los datos del formulario de acceso y los envía al backend; no contiene credenciales configuradas, hashes ni el secreto de sesión, y no decide si la contraseña es correcta. Express verifica la contraseña y autoriza cada operación administrativa. En producción se requiere HTTPS; no guardes contraseñas en el código del cliente ni en `localStorage`, ni uses variables `VITE_*` para secretos.

**GitHub:** solo se versiona `.env.example`, con `SESSION_SECRET` vacío. `.gitignore` excluye `.env`, sus variantes privadas y las bases SQLite; permite explícitamente la plantilla. Antes de publicar, `git check-ignore .env` debe mostrar `.env` y `git ls-files -- .env` no debe mostrar nada. No uses `git add -f` para forzar la inclusión de archivos privados. La contraseña administrativa se establece de forma local, nunca en un archivo versionado.

## Compilación y HTTPS

Para comprobar cookies de producción localmente:

```sh
npm run build
npm run preview:https
```

Abre **https://localhost:3443**. El certificado autofirmado se genera en memoria, solo para esa ejecución: el navegador avisará que no es de confianza. Autoriza únicamente este sitio local para la prueba. El lanzador establece APP_ORIGIN y TRUST_PROXY para su proceso, inicia la compilación y termina ambos servidores con Ctrl+C. No ejecutes dev a la vez: ambos usan el puerto 3000.

En un servidor real, coloca un proxy con certificado válido delante de Express; configura APP_ORIGIN con tu dominio HTTPS, SESSION_SECRET propio y el número exacto de saltos en TRUST_PROXY, conserva SQLite en un volumen persistente y ejecuta npm run build seguido de npm start. El proxy debe reenviar /api y páginas al mismo origen, fijar X-Forwarded-Proto y evitar el acceso público directo al puerto interno. El proyecto no publica ni despliega automáticamente.

## Seguridad y comportamiento

Sesiones del lado del servidor, contraseña Argon2id, cookie HttpOnly/SameSite=Lax y Secure en producción. Caducidad tras 30 minutos de inactividad o 8 horas absolutas. Logout invalida pestañas antiguas. Las escrituras comprueban autorización, Origin y token CSRF; los intentos inválidos se limitan por cuenta/IP y por IP. Los registros contienen ID de petición, ruta sin query, método, estado y duración; no cuerpos, cookies ni contraseñas.

Precios enteros en céntimos, presentados como **S/ 12.50**. Cantidades 1–999; productos agrupados por ID. Antes de abrir WhatsApp, la API recalcula con el catálogo vigente. Si un producto cambió o fue eliminado, actualiza el carrito y exige revisión y otra pulsación. El total es referencial; no se guarda una orden ni se confirma recepción, reserva o pago.

WhatsApp abre en otra pestaña para conservar el carrito de la tienda; si se bloquea la ventana, aparece un enlace explícito. El cliente revisa y envía. Recargar o cerrar la pestaña de la tienda puede perder el carrito. No se solicita información personal del cliente.

Los formularios conservan entradas ante errores. Si hay conflicto de edición, cancela, pulsa Actualizar lista y vuelve a editar. Ante una respuesta perdida, consulta primero el catálogo; el alta conserva el mismo ID al reintentar y no duplica el producto.

## Copia de seguridad y restauración

Para una copia sencilla y coherente, detén la aplicación con Ctrl+C y confirma que terminó. Copia el archivo indicado por DATABASE_PATH (por defecto server/data/tienda.sqlite) a una carpeta privada, fuera de Git. Si quedan archivos -wal o -shm, no copies solo el principal: vuelve a abrir/cerrar limpiamente SQLite o copia el conjunto con la app detenida. La base contiene el hash administrativo: protege el respaldo.

Comprueba una restauración **en una copia**, sin reemplazar la base real: configura DATABASE_PATH con la ruta de la copia, SESSION_DATABASE_PATH con otra ruta vacía y un puerto libre; ejecuta db:init y verifica catálogo y configuración. La migración no elimina datos. Las pruebas automáticas cubren reapertura del mismo archivo, migración repetida, rollback y bloqueo de escritura. No es necesario restaurar sesiones; usar una base nueva obliga a iniciar sesión nuevamente.

## Verificación manual

1. Carga A a S/ 12.50 y B a S/ 8.00. Agrega A dos veces y B una vez: S/ 33.00.
2. Cambia A a tres unidades: S/ 45.50. Retira B: S/ 37.50. Una cantidad cero se rechaza.
3. Busca por nombre con mayúsculas/tildes; limpia la búsqueda y comprueba que el carrito sigue igual.
4. Finaliza y revisa destinatario, productos, cantidades e importes sin enviar el mensaje. Vuelve a la pestaña de la tienda.
5. Comprueba catálogo vacío, imagen ausente, WhatsApp sin configurar y producto eliminado desde otra sesión.
6. En el panel, crea/edita/elimina, cancela una eliminación, prueba precio inválido y cierra sesión. Reinicia y comprueba los cambios confirmados.
7. Repite en celular y PC, con teclado. Registra tiempos y resultados en evidence/acceptance.md; una segunda persona debe seguir estas instrucciones para cerrar SC-007.

## Arquitectura y estado

client/src contiene componentes, páginas, estado del carrito, servicios HTTP y CSS. server/src separa rutas REST, validación, reglas de pedido, middleware y acceso SQLite. server/src/db/migrations registra cambios transaccionales. Los clientes no acceden a SQLite.

Las reglas del producto están en [.specify/memory/constitution.md](.specify/memory/constitution.md). El estado real, las tareas y las evidencias están en [specs/README.md](specs/README.md). No se incluyen pagos, facturación electrónica, cuentas de clientes, descuentos, envíos ni inventario avanzado.

El enlace de pedido usa https://wa.me/ seguido del número configurado y ?text= con encodeURIComponent aplicado una sola vez al resumen. Con carrito vacío o número ausente se muestra un aviso y se bloquea Finalizar; Comprobar WhatsApp permite reintentar. Si cambias el carrito mientras se verifica, debes finalizar nuevamente para abrir el resumen vigente. Evidencia técnica: specs/001-tienda-whatsapp/evidence/whatsapp-checkout.md.
