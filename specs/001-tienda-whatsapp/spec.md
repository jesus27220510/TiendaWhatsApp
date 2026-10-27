# Feature Specification: BioNut — catálogo y pedidos para pequeños negocios

**Feature Branch**: `001-tienda-whatsapp`

**Created**: 2026-10-26

**Status**: Implementada y comprobada automáticamente; aceptación humana final pendiente

**Input**: Tienda virtual para pequeños negocios en Perú: catálogo público con fotografías,
nombres, descripciones y precios; búsqueda por nombre; carrito con cantidades; pedidos por
WhatsApp; administración autenticada de productos y almacenamiento persistente. Sin pagos,
facturación, cuentas de clientes, seguimiento de envíos, descuentos ni inventario avanzado.

## Clarifications

### Session 2026-10-26

Confirmaciones proporcionadas directamente por el usuario; no se solicitaron nuevas respuestas.

- Q: ¿El cliente inicia sesión en BioNut? → A: No; consulta, busca, usa el carrito y abre el pedido sin registro ni inicio de sesión.
- Q: ¿La administración requiere autenticación? → A: Sí; acceder al panel y modificar productos o el número del vendedor requiere un administrador autenticado y autorizado.
- Q: ¿Cómo se proporcionan las imágenes? → A: Mediante URL de una imagen ya alojada; no se cargan archivos desde el panel.
- Q: ¿Cómo agrupa productos el carrito? → A: Una línea por identidad de producto; agregar el mismo producto aumenta su cantidad y no duplica la línea.
- Q: ¿WhatsApp envía automáticamente el pedido? → A: No; se abre el mensaje preparado y el cliente decide enviarlo desde WhatsApp.

## User Scenarios & Testing *(mandatory)*

Las historias conservan los identificadores HU1–HU7 del usuario. P1 corresponde al recorrido
esencial y su administración; P2 mejora el descubrimiento. Las pruebas independientes usan
productos y credenciales de prueba preparados previamente, sin exigir completar otras historias
como parte de la misma prueba. Todos los textos y resultados visibles están en español de Perú.

### User Story 1 - HU1: Consultar el catálogo (Priority: P1)

Como cliente quiero visualizar fotografías, nombres, descripciones y precios en soles para
elegir productos sin registrarme.

**Why this priority**: Permite conocer la oferta del negocio.

**Independent Test**: Abrir el catálogo en una sesión sin autenticar con dos productos preparados.

**Acceptance Scenarios**:

1. **Given** dos productos publicados, **When** abro el catálogo, **Then** veo su nombre,
   descripción, fotografía y precio con `S/` y dos decimales, sin solicitar cuenta.
2. **Given** un producto sin imagen o con imagen inaccesible, **When** lo consulto,
   **Then** veo un reemplazo identificable como imagen no disponible y puedo agregarlo.
3. **Given** un catálogo sin productos, **When** lo abro, **Then** veo «Aún no hay productos»
   y no aparecen productos ficticios ni controles para agregar elementos inexistentes.
4. **Given** pantallas de 360 × 800 y 1366 × 768, **When** consulto productos y navego,
   **Then** puedo leer la información y activar los controles sin desplazamiento horizontal.

### User Story 3 - HU3: Gestionar el carrito (Priority: P1)

Como cliente quiero agregar productos, cambiar cantidades y retirarlos para preparar mi pedido.

**Why this priority**: Define qué desea solicitar el cliente y su importe referencial.

**Independent Test**: Usar productos A a S/ 12.50 y B a S/ 8.00 en un catálogo de prueba.

**Acceptance Scenarios**:

1. **Given** un carrito vacío, **When** agrego A dos veces y B una vez, **Then** veo dos líneas:
   A con cantidad 2 y subtotal S/ 25.00, B con cantidad 1 y subtotal S/ 8.00; total S/ 33.00.
2. **Given** ese carrito, **When** cambio A a cantidad 3, **Then** su subtotal es S/ 37.50
   y el total es S/ 45.50; al retirar B, el total queda en S/ 37.50.
3. **Given** una cantidad válida, **When** ingreso 0, -1, 1.5, texto o 1000,
   **Then** se explica el rango permitido y se conserva la última cantidad válida y su total.
4. **Given** un carrito con productos, **When** retiro todos, **Then** veo «Tu carrito está vacío»,
   total S/ 0.00 y no puedo finalizar el pedido.
5. **Given** un carrito preparado, **When** busco otro producto o regreso al catálogo dentro
   de la misma pestaña sin recargar, **Then** se conservan los productos y cantidades.

6. **Given** dos productos diferentes con el mismo nombre, **When** agrego ambos y repito
   uno, **Then** permanecen dos líneas y solo aumenta la cantidad del producto repetido.

### User Story 4 - HU4: Preparar el pedido por WhatsApp (Priority: P1)

Como cliente quiero abrir WhatsApp con un resumen y total referencial para enviar mi pedido
al vendedor después de revisarlo.

**Why this priority**: Completa el objetivo comercial sin pagos en la tienda.

**Independent Test**: Con un número de prueba configurado, preparar A × 2 y B × 1 y abrir
el mensaje sin enviarlo.

**Acceptance Scenarios**:

1. **Given** el carrito de S/ 33.00, **When** pulso «Finalizar pedido por WhatsApp», **Then**
   se abre el destino configurado con nombres, cantidades, precios unitarios, subtotales
   y «Total referencial: S/ 33.00», además de la indicación de coordinar entrega con el vendedor.
2. **Given** nombres con tildes, ñ y signos como &, **When** abro el pedido, **Then** el mensaje
   conserva esos caracteres, las líneas de productos y todos los importes sin truncarlos.
3. **Given** que el número no está configurado o es inválido, **When** intento finalizar,
   **Then** se informa que WhatsApp no está disponible, no se abre un destinatario incorrecto
   y el carrito permanece intacto.
4. **Given** un producto eliminado desde otra sesión, **When** intento finalizar, **Then**
   se indica su nombre, se retira del carrito y se recalcula el total sin abrir WhatsApp;
   debo revisar y pulsar nuevamente para continuar si quedan productos.
5. **Given** un producto cuyo nombre o precio cambió, **When** intento finalizar, **Then**
   se muestran los datos vigentes y el total actualizado, se informa el cambio y debo
   pulsar nuevamente para continuar. No se abre un mensaje con los datos anteriores.
6. **Given** el mensaje abierto, **When** regreso a la tienda sin enviarlo, **Then** el carrito
   se conserva y no aparece una confirmación de envío, recepción, reserva ni pago.
7. **Given** un error al comprobar los productos vigentes, **When** intento finalizar,
   **Then** se bloquea la apertura, se explica que debo reintentar y se conserva el carrito.

8. **Given** una sesión anónima de BioNut, **When** busco, agrego productos y finalizo,
   **Then** no se solicita registro ni inicio de sesión en la tienda y WhatsApp muestra el
   mensaje preparado sin enviarlo; puedo salir sin pulsar enviar.

### User Story 5 - HU5: Acceder a la administración (Priority: P1)

Como administrador quiero autenticarme para modificar el catálogo sin permitir cambios de terceros.

**Why this priority**: Protege la información comercial.

**Independent Test**: Utilizar una cuenta administradora previamente habilitada y una sesión anónima.

**Acceptance Scenarios**:

1. **Given** una sesión anónima, **When** abro la dirección del panel, **Then** se solicita
   autenticación y no puedo modificar productos ni la configuración del vendedor.
2. **Given** credenciales correctas, **When** inicio sesión, **Then** accedo a las operaciones
   administrativas; con credenciales incorrectas se rechaza el acceso con un mensaje genérico.
3. **Given** una sesión abierta, **When** cierro sesión y vuelvo al panel, **Then** se exige
   autenticarme nuevamente; volver atrás no permite guardar modificaciones.
4. **Given** un formulario abierto cuya sesión expiró o se cerró desde otra pestaña,
   **When** intento guardar o eliminar, **Then** se rechaza la operación y los datos no cambian.

### User Story 6 - HU6: Mantener productos (Priority: P1)

Como administrador quiero agregar, editar y eliminar productos para mantener vigente la oferta.

**Why this priority**: Permite al negocio operar el catálogo sin cambiar el programa.

**Independent Test**: Crear un producto de prueba, editarlo y eliminarlo desde el panel.

**Acceptance Scenarios**:

1. **Given** acceso autorizado, **When** guardo nombre «Café», descripción «Bolsa de 250 g»,
   precio 12.50 e imagen válida, **Then** recibo confirmación y el producto aparece al
   actualizar el catálogo público con esos valores.
2. **Given** el producto guardado, **When** cambio nombre, descripción, precio o imagen y guardo,
   **Then** al actualizar el catálogo se muestran los nuevos valores; cancelar la edición
   conserva los valores anteriores.
3. **Given** campos fuera de RN-01 o un precio vacío, cero, negativo, no numérico o con más
   de dos decimales, **When** intento guardar, **Then** veo el campo y motivo del error,
   no se guarda el cambio y se conservan los demás valores ingresados para corregirlos.
4. **Given** un producto existente, **When** solicito eliminarlo, **Then** debo confirmar;
   cancelar lo conserva y confirmar lo retira del catálogo al actualizarlo.
5. **Given** un producto eliminado en otra sesión, **When** intento editarlo o eliminarlo,
   **Then** se informa que ya no existe, sin recrearlo ni mostrar éxito ficticio.
6. **Given** acceso autorizado, **When** configuro un número válido según RN-06 y guardo,
   **Then** los nuevos pedidos abren ese destinatario. Un valor inválido muestra error y
   conserva la configuración anterior; quitarlo deja la finalización deshabilitada.

7. **Given** el formulario de producto, **When** indico la URL de una fotografía ya alojada
   y guardo, **Then** se muestra esa imagen al consultar el catálogo; el formulario no ofrece
   carga de archivos. Si dejo la URL vacía se muestra el reemplazo de imagen no disponible.

### User Story 7 - HU7: Conservar el catálogo (Priority: P1)

Como administrador quiero conservar los productos después de reiniciar la aplicación.

**Why this priority**: Evita perder el trabajo y la oferta publicada.

**Independent Test**: Preparar un alta, una edición y una eliminación confirmadas y reiniciar
mediante el procedimiento documentado con ayuda operativa si es necesario.

**Acceptance Scenarios**:

1. **Given** cambios confirmados y un número de vendedor guardado, **When** reinicio la app
   y vuelvo a consultar, **Then** el alta y la edición conservan sus valores, el producto
   eliminado no reaparece y el número configurado sigue siendo el mismo.
2. **Given** un fallo de almacenamiento preparado en un entorno de prueba, **When** intento
   guardar o eliminar, **Then** aparece un error recuperable, no se confirma éxito y no se
   presentan cambios parciales como guardados; después de restablecer el servicio puedo
   comprobar el resultado y reintentar sin duplicar un alta ya confirmada.

### User Story 2 - HU2: Buscar productos (Priority: P2)

Como cliente quiero buscar productos por nombre para encontrar lo que necesito.

**Why this priority**: Reduce el esfuerzo de recorrer el catálogo.

**Independent Test**: Preparar «Café molido», «Cafetera» y «Té verde» y buscar por nombre.

**Acceptance Scenarios**:

1. **Given** esos productos, **When** busco « cafe », **Then** veo Café molido y Cafetera,
   sin distinguir mayúsculas ni tildes y sin incluir Té verde.
2. **Given** un filtro activo, **When** borro la búsqueda o ingreso solo espacios,
   **Then** vuelvo a ver todo el catálogo sin modificar el carrito.
3. **Given** una búsqueda sin coincidencias, **When** consulto resultados, **Then** veo
   «No se encontraron productos» y puedo cambiar o limpiar el término.

### Edge Cases

| Caso | Comportamiento y comprobación manual |
| --- | --- |
| Catálogo vacío | HU1.3: mensaje específico, sin confundirlo con un error de carga. |
| Carrito vacío | HU3.4: total cero y finalización bloqueada. |
| Precio inválido | HU6.3 y RN-01: no guardar, mostrar motivo y conservar entradas corregibles. |
| Producto eliminado | HU4.4 y HU6.5: informar, actualizar selección y no recrear productos. |
| Imagen ausente o rota | HU1.2: reemplazo visual y compra por WhatsApp disponible. |
| WhatsApp sin configurar | HU4.3: informar y conservar carrito, sin abrir enlaces incorrectos. |
| Error de base de datos | HU7.2: sin éxito falso; al fallar la lectura, mostrar error con reintento, nunca «catálogo vacío»; HU4.7 bloquea pedidos no verificables. |
| Precio o nombre desactualizado | HU4.5: actualizar y exigir nueva acción del cliente. |
| Cantidad inválida | HU3.3: conservar último valor válido y explicar límites. |
| WhatsApp no accesible en el dispositivo | Mantener el carrito y mostrar antes de salir que se necesita acceso a WhatsApp; no afirmar que se envió el pedido. |
| Mensaje demasiado largo | Si no puede prepararse completo, informar que debe reducir el carrito; nunca omitir productos ni abrir un resumen truncado. |

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Mostrar un catálogo público con nombre, descripción, precio e imagen o reemplazo
  por producto. El cliente consulta, busca, usa el carrito y abre WhatsApp sin registro ni inicio
  de sesión en BioNut. Aceptación: HU1.1–HU1.3 y HU4.8.
- **FR-002**: Permitir buscar por coincidencia parcial del nombre y limpiar la búsqueda conforme
  a RN-02, sin alterar el carrito. Aceptación: HU2.1–HU2.3.
- **FR-003**: Permitir agregar, agrupar por identidad de producto en una sola línea, cambiar cantidades y retirar líneas con
  subtotales y total actualizados conforme a RN-03. Aceptación: HU3.1–HU3.6.
- **FR-004**: Ofrecer «Finalizar pedido por WhatsApp» con resumen completo, destinatario
  configurado y total referencial. Solo abrir el mensaje preparado; el cliente lo envía desde
  WhatsApp si así lo decide. Aceptación: HU4.1, HU4.2, HU4.6 y HU4.8.
- **FR-005**: Impedir finalizar con carrito vacío, configuración ausente o inválida, o productos
  cuya vigencia no pueda comprobarse. Aceptación: HU3.4, HU4.3 y HU4.7.
- **FR-006**: Comprobar productos y precios vigentes antes de abrir WhatsApp e informar cambios
  que exijan nueva revisión del cliente. Aceptación: HU4.4–HU4.5.
- **FR-007**: Exigir autenticación y autorización para acceder al panel y realizar toda modificación administrativa,
  incluidas operaciones iniciadas desde una pantalla antigua; permitir cerrar sesión.
  Aceptación: HU5.1–HU5.4 y pruebas de acceso no autorizado en la implementación.
- **FR-008**: Permitir al administrador crear, editar y eliminar productos con validaciones
  explícitas y confirmación de eliminación. La imagen se indica por URL de una fotografía
  ya alojada; no se ofrece carga de archivos. Aceptación: HU6.1–HU6.5 y HU6.7.
- **FR-009**: Permitir únicamente al administrador configurar o quitar el número del vendedor
  y conservarlo tras reiniciar. Aceptación: HU5.1, HU6.6 y HU7.1.
- **FR-010**: Conservar los cambios confirmados de productos en almacenamiento persistente
  y distinguir fallos de lectura o escritura de estados vacíos. Aceptación: HU7.1–HU7.2 y Edge Cases.
- **FR-011**: Mantener catálogo, carrito y panel utilizables en celular y PC, sin controles
  esenciales recortados y con navegación por teclado. Aceptación: repetir HU1–HU6 a 360 × 800
  y 1366 × 768, y recorrer sus controles con Tab, Enter y espacio según corresponda.
- **FR-012**: Mostrar textos en español de Perú e importes `S/` con dos decimales en catálogo,
  carrito, panel y mensaje. Aceptación: inspeccionar esas cuatro superficies con los ejemplos
  A y B y comprobar S/ 33.00 tanto en carrito como en WhatsApp.
- **FR-013**: No pedir nombre, documento, dirección, correo ni teléfono del cliente para preparar
  el pedido. Aceptación: completar HU4 en sesión anónima sin ingresar datos personales.
- **FR-014**: Mostrar errores comprensibles sin contraseñas ni detalles internos y permitir
  corregir entradas o reintentar. Aceptación: HU5.2, HU6.3, HU7.2 y fallo de lectura de Edge Cases.
- **FR-015**: Entregar instrucciones reproducibles de instalación, ejecución, configuración,
  reinicio y pruebas, incluyendo los comandos comprometidos en AGENTS.md. Aceptación: otra
  persona sigue la guía y ejecuta los comandos con resultados documentados, sin leer código.

### Business Rules

- **RN-01 — Producto válido**: nombre obligatorio de 1 a 100 caracteres y descripción obligatoria
  de 1 a 1000, después de quitar espacios de los extremos; no se aceptan solo espacios.
  Precio entre S/ 0.01 y S/ 999999.99, con hasta dos decimales. Se acepta coma o punto decimal
  sin separadores de millares. Una imagen opcional por producto, indicada mediante URL web
  segura de una fotografía ya alojada, sin carga de archivos; un enlace mal formado se rechaza, y una imagen inaccesible usa el reemplazo visual.
  Los nombres pueden repetirse: dos productos diferentes no se fusionan por compartir nombre.
- **RN-02 — Búsqueda**: coincidencia parcial en el nombre, ignorando mayúsculas, tildes y espacios
  al inicio/final del término; no buscar por descripción. Un término vacío muestra todos.
- **RN-03 — Cantidades e importes**: cantidades enteras de 1 a 999 por producto. Agregar de nuevo
  incrementa la misma línea, identificada por el producto y no por su nombre, sin superar 999. Retirar requiere la acción de quitar; cero no
  elimina silenciosamente. Subtotal = precio unitario × cantidad; total = suma de subtotales,
  exactos a céntimos. No añadir descuentos, recargos ni cálculos de envío o impuestos separados.
- **RN-04 — Vigencia**: al finalizar se usan nombres y precios vigentes. Una eliminación retira
  la línea y avisa; un cambio de nombre o precio actualiza y avisa. Cualquier ajuste bloquea
  esa apertura y requiere otra pulsación después de revisar. Si queda vacío, no se puede continuar.
- **RN-05 — Pedido referencial**: el resumen incluye cada nombre, cantidad, precio unitario,
  subtotal y total referencial. El envío y las condiciones finales se coordinan por WhatsApp.
  No se crea reserva, comprobante, pago ni confirmación de recepción; abrir WhatsApp no borra
  el carrito. El cliente decide si envía el mensaje desde WhatsApp.
- **RN-06 — Vendedor**: una tienda y un número peruano de WhatsApp. El administrador ingresa
  nueve dígitos móviles comenzando por 9, o los mismos precedidos por 51 o +51; se permiten
  espacios y guiones de presentación. Otros valores se rechazan. El destino conserva el
  código de país 51. La validación de formato no garantiza que el número tenga WhatsApp:
  el administrador debe comprobar el destino con un pedido de prueba sin enviarlo.
- **RN-07 — Acceso**: solo el administrador autenticado puede modificar catálogo y número.
  No hay alta pública de administradores. El cliente no se registra ni inicia sesión en BioNut. El cierre o expiración
  de sesión impide nuevas modificaciones aunque permanezcan formularios abiertos.
- **RN-08 — Persistencia y errores**: un éxito de guardado significa que el cambio quedó
  almacenado. Un error nunca se presenta como éxito ni como catálogo vacío. Los fallos de
  escritura no deben dejar cambios parciales; antes de reintentar tras un resultado incierto,
  se debe poder consultar el estado real para evitar duplicados.

### Key Entities *(include if feature involves data)*

- **Producto**: identidad estable, nombre, descripción, precio en soles e imagen opcional;
  puede actualizarse o eliminarse por el administrador y conservarse tras reinicio.
- **Carrito**: selección temporal del cliente; contiene líneas por identidad de producto,
  cantidades, precios referenciales, subtotales y total; no requiere identidad del cliente.
- **Resumen de pedido**: representación revisable de la selección vigente destinada al mensaje
  de WhatsApp; no constituye un pedido confirmado ni un historial comercial almacenado.
- **Administrador**: persona autorizada con credenciales y una sesión de acceso al panel.
- **Configuración del vendedor**: único número de WhatsApp de la tienda, persistente y
  modificable únicamente por el administrador.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una persona sin conocimientos técnicos completa búsqueda, agregado de dos productos,
  cambio de cantidad, retiro y apertura del resumen en menos de 3 minutos, sin registrarse,
  en cada tamaño de pantalla de FR-011 con productos de prueba ya cargados.
- **SC-002**: El 100 % de las comprobaciones del ejemplo A/B produce S/ 33.00, S/ 45.50 y
  S/ 37.50 en los pasos correspondientes; el mensaje coincide con el carrito vigente.
- **SC-003**: El administrador completa un alta, edición y eliminación desde el panel en menos
  de 5 minutos con datos preparados; después del reinicio se conserva el 100 % de los cambios
  confirmados y la configuración del vendedor.
- **SC-004**: En las cuatro situaciones de HU5 se permite solo el acceso autorizado y se conserva
  el catálogo sin cambios tras todos los intentos rechazados.
- **SC-005**: Los siete casos límite solicitados (catálogo vacío, carrito vacío, precio inválido,
  producto eliminado, imagen ausente, WhatsApp sin configurar y error de base de datos)
  tienen una comprobación manual satisfactoria sin inspeccionar código ni perder datos confirmados.
- **SC-006**: El 100 % de las pantallas y mensajes de los recorridos de aceptación usa español
  de Perú y soles; catálogo, carrito y panel permiten completar sus acciones en los dos tamaños
  y con teclado sin controles esenciales inaccesibles.
- **SC-007**: Una segunda persona prepara, inicia y verifica la aplicación siguiendo únicamente
  la documentación; todos los comandos documentados existen y terminan con el resultado previsto.

## Assumptions

- La versión inicial atiende un solo negocio, con un administrador previamente habilitado y
  un número peruano de vendedor. No incluye múltiples tiendas, roles ni recuperación pública
  de cuentas. La preparación inicial del administrador se documentará durante la implementación.
- Para mantener simple la gestión de imágenes, se usa un enlace a una fotografía ya alojada, decisión confirmada por el usuario;
  carga de archivos, galerías y edición de imágenes quedan fuera de esta versión.
- El carrito se conserva durante la navegación en la misma pestaña. No se exige recuperarlo
  tras recargar, cerrar el navegador o cambiar de dispositivo. La persistencia obligatoria
  corresponde a productos y configuración del vendedor.
- Los precios publicados son los importes unitarios referenciales completos. No se calculan
  cargos de entrega; disponibilidad y condiciones finales se coordinan con el vendedor.
- Se requiere conectividad y acceso a WhatsApp para revisar el mensaje en el destino.
  La ausencia de inicio de sesión corresponde a BioNut; WhatsApp puede exigir acceso
  a la cuenta del cliente en su propio servicio. No se
  garantiza el envío, entrega o disponibilidad del servicio externo desde la tienda.
- Los límites de campos, precio y cantidades de RN-01/RN-03 son valores iniciales para hacer
  verificable la validación; no representan control de existencias ni inventario.
- Reinicios y fallos de almacenamiento se preparan en un entorno de prueba siguiendo una guía
  operativa, sin afectar datos reales. La persona que valida observa resultados en la interfaz;
  puede recibir ayuda para provocar el fallo y no necesita inspeccionar código.
- Fuera de alcance: pagos, pasarelas, tarjetas, facturación electrónica, cuentas de clientes,
  seguimiento de envíos, descuentos, inventario avanzado, historial de pedidos, reservas,
  mensajes automáticos y gestión de entregas.
- Las restricciones técnicas, seguridad de secretos y comandos del proyecto están en AGENTS.md;
  el plan debe respetarlas junto con la constitución sin ampliar esta especificación.

## Decisiones de implementación (2026-10-27)

HU4.6 conserva la tienda en su pestaña original: WhatsApp abre en otra pestaña, con enlace explícito si el navegador bloquea ventanas. Cerrar o recargar la tienda no tiene garantía de recuperación. Diseño: contraste 4.5:1 normal y 3:1 texto grande/controles, foco 3 px y objetivos de 44 px; ancho máximo 1280 px, una columna a 360 px y carrito lateral desde 1100 px. Véase review-decisions.md; no equivale a aprobación del checklist por su revisor.
