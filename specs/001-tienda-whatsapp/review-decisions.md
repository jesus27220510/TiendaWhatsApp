# Decisiones de implementación — 2026-10-26

El usuario autorizó expresamente continuar con los 36 ítems del checklist pendientes. No se alteran sus marcas.

CHK009: se conserva la garantía HU4.6. El gesto inicial reserva una pestaña vacía; después de validar, se navega esa pestaña a WhatsApp. La tienda original conserva el carrito en memoria. Si el navegador bloquea ventanas, se ofrece un enlace explícito en pestaña nueva. Errores o cambios cierran la pestaña reservada y requieren revisión. No se depende de la caché de historial ni se agrega persistencia de clientes.

CHK034: contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande/controles; foco visible de 3 px, objetivos táctiles 44 px. Contenedor máximo 1280 px, una columna en 360 px; cuadrícula desde 768 px; carrito lateral solo desde 1100 px. Estos valores concretan el diseño, sin ampliar el producto.

La autorización de implementación permite estas decisiones técnicas conservando la spec. No equivale a aprobación automática del checklist. SC-007 con una segunda persona se registrará pendiente hasta una validación humana real.
