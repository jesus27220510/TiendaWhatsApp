# Contrato de interfaz — BioNut

## Tienda pública / (HU1–HU4)

Cabecera con BioNut, acceso discreto a Administración y contador de unidades del carrito.
Buscador con etiqueta visible «Buscar productos», limpieza y resultado anunciado sin robar foco.
Catálogo en tarjetas: imagen de proporción uniforme, nombre, descripción completa accesible,
precio S/ y botón Agregar. Imagen URL con carga diferida y reemplazo local al fallar; nunca
ocultar el producto. No interpretar descripciones como HTML.

360 px: una columna, carrito debajo del catálogo y acceso por ancla desde cabecera.
Desde 768 px: catálogo de dos o más columnas según espacio; carrito lateral cuando quepa.
No superponer controles fijos que tapen productos. En escritorio máximo ancho legible.
Carrito: una fila por ID, nombre, precio unitario, cantidad editable, subtotal, quitar y total.
El contador representa unidades, no número de líneas. Cantidad inválida restaura el último valor
válido al confirmar/salir y muestra mensaje asociado. Botón final «Finalizar pedido por WhatsApp».

Estado de carga distinto de vacío; error con reintentar sin borrar selección. Búsqueda vacía
restaura catálogo, cero resultados informa específicamente. Cantidad/precio/cambios de carrito
se anuncian en región aria-live. Durante checkout, deshabilitar doble pulsación y mostrar
«Verificando pedido…». Tras cambios, mostrar aviso y nuevo total; no navegar hasta otra pulsación.
La pulsación reserva una pestaña vacía. Tras 200 se abre allí WhatsApp; la pestaña original conserva el carrito. Si se bloquean ventanas, ofrecer un enlace explícito en otra pestaña. Cambios o errores cierran la pestaña reservada. Una recarga de la tienda puede perder su selección.
Antes de salir indicar que el cliente revisa y envía el mensaje desde WhatsApp.

## Administración /admin/login y /admin (HU5–HU7)

Login con usuario, contraseña y acción Ingresar; errores genéricos y sin autocompletar secretos
inventados. Comprobar sesión al entrar; solo renderizar datos protegidos tras validarla.
Panel con lista de productos, Agregar, Editar, Eliminar, número WhatsApp y Cerrar sesión.
Formulario con nombre, descripción, precio decimal e imagen URL opcional; no input de archivos.
Cancelar no guarda. Eliminar exige diálogo con nombre del producto y confirmación explícita.
Avisar éxito solo tras respuesta confirmada. 401 vuelve a login; 409 permite recargar datos
sin guardar automáticamente valores antiguos; 422 conserva entradas y marca campos.

Configuración del vendedor visible solo en panel. Guardar/quitar número con explicación del
impacto en checkout. Link de prueba abre mensaje sin enviarlo, usando el mismo recorrido público.
Diseño móvil: lista administrativa como tarjetas o filas apiladas, sin tabla desbordada.

## Accesibilidad y estilo

CSS propio, fondo claro, texto de alto contraste, acento verde para acción WhatsApp y botones
consistentes. Jerarquía cabecera → búsqueda → catálogo → carrito. No añadir promociones falsas.
Foco visible, etiquetas asociadas, botones semánticos, navegación Tab/Enter/espacio, mensajes
que no dependan solo de color, imágenes con texto alternativo del producto y objetivos táctiles
mínimos de 44 px. Validar 360×800 y 1366×768, zoom 200 % y ausencia de scroll horizontal esencial.

## Evidencia de aceptación

Ejecutar HU1–HU7 y SC-001–SC-007 de spec.md. Registrar pantallas, tamaños, resultados y tiempos;
no afirmar que las pruebas pasaron durante la fase de diseño. Los tests E2E cubren errores,
carrito por ID, UTF-8, no registro de clientes, URL de imagen y controles de administración.

Criterios concretados en review-decisions.md: contraste 4.5:1 para texto normal y 3:1 para texto grande/controles, foco de 3 px, contenedor máximo 1280 px y carrito lateral desde 1100 px.
