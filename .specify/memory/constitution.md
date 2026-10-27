<!--
Sync Impact Report
Cambio de versión: plantilla sin versión → 1.0.0 (adopción inicial).
Principios: los cinco espacios genéricos se sustituyen por once principios:
I. Simplicidad ante todo; II. Español de Perú y soles; III. Alcance definido por la spec;
IV. Requisitos verificables; V. Clientes sin registro; VI. Administración exclusiva;
VII. Sin pagos ni facturación electrónica; VIII. Secretos fuera de GitHub;
IX. Validación de datos y pruebas; X. Diseño para celulares y PC;
XI. Documentación reproducible.
Secciones incorporadas: Alcance y tratamiento de datos; Flujo de trabajo y aceptación;
reglas concretas de Governance.
Secciones eliminadas: ninguna; se reemplaza el contenido de ejemplo de la plantilla.
TODO pendientes: ninguno.
Retirar este informe temporal después de su revisión y antes de confirmar el archivo en Git.
-->
# TiendaWhatsApp Constitution

## Core Principles

### I. Simplicidad ante todo

TiendaWhatsApp es una versión 1. Ante dos soluciones que satisfacen los mismos requisitos,
se DEBE elegir la más simple de implementar, comprender y mantener. Toda complejidad adicional
DEBE justificar una necesidad actual de la spec. NO se permite anticipar funcionalidades,
infraestructura ni autenticación compleja para necesidades futuras.

### II. Español de Perú y soles

Toda interfaz, mensaje de validación, instrucción para el usuario y mensaje de pedido DEBE
estar en español de Perú. Los precios, subtotales y totales DEBEN expresarse en soles con el
símbolo S/, de forma consistente en el catálogo y en WhatsApp. La aceptación DEBE comprobar
el idioma y la moneda visibles en ambos lugares.

### III. Alcance definido por la spec

Cada funcionalidad implementada DEBE corresponder a un requisito explícito de la
especificación aprobada. NO se permite implementar funcionalidades fuera de ella. Una nueva
necesidad DEBE incorporarse y aprobarse en la spec antes de planificarla o implementarla,
siempre dentro de esta constitución.

### IV. Requisitos verificables

Cada requisito DEBE incluir un criterio de aceptación con condiciones, acciones y resultados
observables. Los criterios de éxito del catálogo y del pedido DEBEN poder comprobarse por
una persona no técnica agregando y quitando productos, revisando importes y abriendo WhatsApp,
sin inspeccionar código. Los requisitos técnicos DEBEN indicar una prueba o revisión concreta
y su resultado esperado; expresiones como «funciona bien» no constituyen criterios válidos.

### V. Clientes sin registro

Los clientes DEBEN poder consultar el catálogo, preparar un pedido y abrirlo en WhatsApp
sin crear una cuenta ni iniciar sesión. NO se permite exigir un registro como condición
para completar ese recorrido. La aceptación DEBE ejecutarlo desde una sesión sin autenticar.

### VI. Administración exclusiva de productos

Solo un administrador autenticado y autorizado PUEDE crear, editar o eliminar productos.
La autorización DEBE comprobarse en el servidor para cada operación de modificación;
ocultar controles en la interfaz no basta. Las pruebas DEBEN verificar que el administrador
puede realizar las operaciones previstas y que una solicitud no autorizada es rechazada
sin modificar datos. La protección DEBE ser la más simple que cumpla estas garantías.

### VII. Sin pagos ni facturación electrónica

NO se permite implementar pagos en línea, pasarelas como Stripe o Mercado Pago, cobros con
tarjeta ni facturación electrónica. Todo cierre de pedido DEBE consistir en un enlace a
WhatsApp con el resumen de productos, cantidades e importes de la selección vigente.
Abrir ese enlace NO DEBE presentarse como confirmación de pago ni de recepción del pedido.
La verificación DEBE comprobar el mensaje preparado sin exigir su envío.

### VIII. Secretos fuera de GitHub

NO se permite incluir contraseñas, tokens, claves privadas ni otros secretos en archivos
versionados, historial de Git, ejemplos o publicaciones en GitHub. La configuración sensible
DEBE proporcionarse mediante variables de entorno u otro mecanismo externo al repositorio;
los ejemplos DEBEN usar valores ficticios. Antes de cada commit y publicación se DEBEN
revisar los cambios para detectar secretos. Si se expone alguno, se DEBE revocar o rotar
antes de continuar y retirar su exposición del repositorio y su historial cuando corresponda.

### IX. Validación de datos y pruebas

Los datos recibidos DEBEN validarse antes de usarlos o persistirlos: campos obligatorios,
tipos, límites y reglas de negocio definidos en la spec. El servidor DEBE validar los datos
y permisos de las operaciones que procesa, sin confiar solo en el navegador. Los errores
DEBEN mostrarse en español y permitir corregir la entrada sin perder datos innecesariamente.
Antes de aceptar cambios se DEBEN ejecutar las pruebas pertinentes al comportamiento afectado,
incluidos casos válidos, inválidos y accesos no autorizados cuando correspondan. Se DEBEN
registrar los resultados y resolver los fallos antes de dar el trabajo por terminado.

### X. Diseño para celulares y PC

El catálogo, la selección de productos, el cierre por WhatsApp y las funciones administrativas
incluidas en la spec DEBEN ser utilizables en celulares y PC. NO se admite contenido esencial
recortado, controles inaccesibles ni desplazamiento horizontal necesario para el recorrido
principal. Cada entrega DEBE verificarse en al menos un tamaño de pantalla móvil y uno de
escritorio, registrando las dimensiones y comprobando lectura, navegación y acciones.

### XI. Documentación reproducible

El proyecto DEBE documentar en español los requisitos previos, instalación, configuración,
ejecución y pruebas. Los comandos y pasos DEBEN permitir que otra persona prepare el entorno,
inicie la aplicación y compruebe los resultados. La documentación DEBE explicar las variables
necesarias con ejemplos sin secretos y los pasos de verificación manual. Todo cambio que
altere estos procedimientos DEBE actualizar su documentación en la misma entrega.

## Alcance y tratamiento de datos

TiendaWhatsApp es un catálogo comercial web con pedidos directos por WhatsApp. La spec DEBE
precisar el catálogo, las operaciones administrativas y los datos del pedido dentro de estos
límites; esta constitución no selecciona tecnologías ni incorpora funcionalidades adicionales.

Solo se DEBEN solicitar datos del cliente imprescindibles para preparar el mensaje de pedido.
Cada dato solicitado DEBE tener una finalidad explícita en la spec. NO se permite recolectar
información personal adicional por conveniencia futura. El cliente DEBE poder revisar el
resumen antes de enviarlo desde WhatsApp.

## Flujo de trabajo y aceptación

1. Antes de planificar, comprobar que cada requisito respeta los once principios y tiene
   criterios de aceptación verificables.
2. Antes de implementar, vincular cada tarea con un requisito aprobado y justificar cualquier
   complejidad necesaria para la versión 1.
3. Antes de aceptar una entrega, ejecutar las pruebas pertinentes y la verificación manual
   del catálogo y WhatsApp, revisar permisos de administración, idioma, moneda, datos
   solicitados y funcionamiento en celular y PC según el alcance afectado.
4. Registrar los resultados, revisar que no se incorporen secretos y comprobar que la
   documentación de instalación, ejecución y pruebas corresponda al estado entregado.
5. Si una entrega incumple la constitución, corregirla antes de aceptarla. Una prueba técnica
   satisfactoria no sustituye la comprobación manual de los criterios visibles del producto.

## Governance

Esta constitución prevalece sobre especificaciones, planes, tareas y decisiones de
implementación. Cada revisión de especificación y cada revisión de cambios DEBE comprobar
su cumplimiento. No se admiten excepciones implícitas por conveniencia técnica.

Una enmienda DEBE documentar el motivo, los principios afectados, el impacto sobre los
artefactos existentes y las acciones necesarias para ajustarlos. El responsable del proyecto
DEBE aprobarla antes de aplicar decisiones incompatibles con la versión vigente. La enmienda
DEBE actualizar este documento, su versión y la fecha de última modificación; la fecha de
ratificación original se conserva. Los artefactos afectados DEBEN revisarse antes de continuar
el trabajo que dependa de ellos.

El versionado sigue MAJOR.MINOR.PATCH: MAJOR para eliminar o redefinir principios de forma
incompatible; MINOR para añadir principios o ampliar materialmente las obligaciones;
PATCH para aclaraciones y correcciones que no cambien las obligaciones. La versión 1.0.0
representa la adopción inicial de los once principios de TiendaWhatsApp.

**Version**: 1.0.0 | **Ratified**: 2026-10-26 | **Last Amended**: 2026-10-26
