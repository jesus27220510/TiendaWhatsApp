# Verificación de Finalizar pedido

La configuración local usa el número proporcionado por el propietario; permanece en SQLite y no está fijado en el código.

La generación se mantiene en server/src/services/whatsapp.js:

```js
const whatsappUrl =
  "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
```

El mensaje incluye cada producto, cantidad, precio unitario, subtotal y total referencial, además de la coordinación de disponibilidad y entrega.

## Cambios comprobados

- Aviso visible con carrito vacío; acción deshabilitada.
- Consulta pública de configuración al entrar y al recuperar el foco; sin número o ante fallo de comprobación, aviso y opción Comprobar WhatsApp.
- La API conserva la verificación del número y de productos/precios vigentes antes de generar el enlace.
- Si cambia el carrito mientras se prepara el resumen, se descarta la respuesta anterior; un CART_CHANGED anterior tampoco sobrescribe la selección posterior.
- El enlace alternativo de ventanas bloqueadas desaparece al modificar o vaciar el carrito.
- El aviso de acceso a WhatsApp y revisión/envío manual aparece antes de abrir el destino.

## Resultados reales

- La prueba nueva de la URL codificada pasó antes de modificar la interfaz: el generador ya cumplía el formato.
- Las regresiones nuevas de interfaz fallaron inicialmente en 8 casos y pasaron después del ajuste.
- npm run lint: aprobado.
- npm test: 43 pruebas aprobadas (20 cliente, 23 servidor).
- npm run build: aprobado.
- npm run test:e2e -- checkout.spec.js cart.spec.js: 12 casos aprobados, en 360×800 y 1366×768.
- Verificación adicional con la tienda local y productos de prueba: Café molido peruano ×2 a S/ 12.50 (S/ 25.00), Té verde ×1 a S/ 8.00, total referencial S/ 33.00. Se comprobó el destinatario solicitado y la igualdad exacta del enlace con encodeURIComponent(message); el carrito conservó S/ 33.00.

Las salidas externas se interceptaron durante la verificación; no se envió ningún mensaje. No se incorporaron WhatsApp Business API, pagos ni captura de tarjetas.

Se completan T062, T063 y T071. Las demás brechas de convergencia y la aceptación humana T060 conservan su estado pendiente.
