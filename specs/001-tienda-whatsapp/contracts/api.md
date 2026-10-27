# Contrato REST — BioNut

Base `/api`, JSON UTF-8, mismo origen. Fechas ISO UTC, importes enteros en céntimos.
No HTML en respuestas de API. No almacenar pedidos ni datos personales de clientes.

## Convenciones

Éxito: `{data: ...}`. Error: `{error: {code, message, fields?}, requestId}`;
message y fields en español, code estable para pruebas. Rechazar campos desconocidos.
400 JSON mal formado; 401 sesión ausente/expirada; 403 CSRF/origen no permitido;
404 recurso inexistente; 409 conflicto; 413 cuerpo grande; 422 datos inválidos;
429 límite de intentos; 503 almacenamiento inaccesible; 500 error inesperado sin trazas.

Límite JSON 16 KiB para formularios, 256 KiB para checkout. Mutaciones administrativas
requieren cookie de sesión, Origin válido y X-CSRF-Token. Todas las rutas /admin comprueban
sesión en servidor. Respuestas de auth/admin/checkout: Cache-Control: no-store.
GET productos también no-store para v1; no confundir error con arreglo vacío.

Product: `{id, name, description, priceCents, imageUrl, version}` según data-model.md.
ProductInput: `{name, description, priceCents, imageUrl}`; imageUrl nullable.
Normalizar comas/puntos en formulario antes de transmitir entero; servidor valida entero y rango.

## Rutas públicas

| Método y ruta | Entrada | Éxito |
| --- | --- | --- |
| GET /products | Sin parámetros obligatorios | 200 `{data: {products: Product[]}}`; orden name e id estable. |
| GET /store | Ninguna | 200 `{data: {whatsappConfigured: boolean}}`; no exponer secretos. |
| POST /checkout | `{items: [{productId, quantity, name, priceCents}]}` | 200 respuesta ready descrita abajo. |

La búsqueda por nombre se realiza sobre el catálogo cargado, normalizando Unicode/tildes,
mayúsculas y extremos. No requiere servicio de búsqueda ni índices externos.

Checkout no requiere autenticación ni crea sesión. Items no vacío; IDs únicos, UUID válidos;
quantity entero 1–999; nombres/precios del snapshot se validan en forma pero no se consideran
verdad comercial. La API lee configuración y productos en una misma transacción de lectura,
calcula líneas y total con los valores vigentes, y comprueba Number.isSafeInteger.

- 200: `{data: {status: "ready", lines: [{productId,name,quantity,priceCents,subtotalCents}],
  totalCents, message, whatsappUrl}}`. whatsappUrl contiene destinatario normalizado y message
  codificado una sola vez; mensaje con cada producto y «Total referencial: S/ ...» y coordinación
  de entrega. No hay instrucción de envío automático.
- 409 CART_CHANGED: `{error:{code,message}, data:{lines,totalCents,
  changes:[{productId,type:"removed"|"updated",previousName}]}}`. Sin whatsappUrl.
  El cliente aplica líneas, informa y requiere nueva pulsación. Si vacío, botón deshabilitado.
- 409 WHATSAPP_UNAVAILABLE si no hay número válido; no generar enlace.
- 422 EMPTY_CART, INVALID_QUANTITY o MESSAGE_TOO_LONG. El enlace completo codificado no supera
  8000 caracteres; nunca truncar ni omitir una línea. 503 si no se puede verificar vigencia.
- La verificación garantiza el estado al instante de lectura, no reserva precio ni existencias.
  El total es referencial. No reintentar automáticamente la navegación tras un error.

## Autenticación

| Método y ruta | Entrada | Resultado |
| --- | --- | --- |
| GET /auth/csrf | Ninguna | 200 `{data:{csrfToken}}`; crea sesión previa solo para administración. |
| POST /auth/login | `{username,password}` y CSRF | 200 `{data:{admin:{username},csrfToken}}`; regenera ID y token. |
| GET /auth/me | Cookie | 200 `{data:{admin:{username}}}` o 401. |
| POST /auth/logout | Cookie y CSRF | 204; destruye sesión y limpia cookie con mismos atributos. |

Credenciales inválidas: 401 genérico sin distinguir usuario inexistente; comparar hash ficticio
cuando no existe cuenta para reducir filtración temporal. Contraseña nunca se devuelve ni registra.
Origin ausente/no coincidente en mutaciones de navegador: 403. Clientes de pruebas deben
proporcionarlo explícitamente. Token tiene 32 bytes aleatorios; comparación segura en servidor.

Cookie `tienda.sid`, HttpOnly, SameSite=Lax, Secure con HTTPS, Path=/, sin Domain.
Producción exige APP_ORIGIN HTTPS, secreto aleatorio de al menos 32 bytes y proxy explícito.
Límite 30 minutos inactividad y 8 horas absolutas se impone en servidor y almacén de sesión.
Actualizar caducidad sin extender el límite absoluto. Logout/revocación invalida pestañas antiguas.

## Administración

| Método y ruta | Entrada | Éxito |
| --- | --- | --- |
| GET /admin/products | Cookie | 200 `{data:{products:Product[]}}`. |
| POST /admin/products | `{id,...ProductInput}` | 201 `{data:{product}}`; repetición idéntica por ID: 200. |
| PUT /admin/products/:id | `{...ProductInput,version}` | 200 `{data:{product}}`; incrementa versión. |
| DELETE /admin/products/:id | `{version}` | 204 tras confirmación en interfaz. |
| GET /admin/settings | Cookie | 200 `{data:{whatsappNumber,version}}`. |
| PUT /admin/settings | `{whatsappNumber,version}` | 200 configuración normalizada; null quita número. |

IDs existentes con contenido distinto en alta: 409 DUPLICATE_ID; versión antigua:
409 VERSION_CONFLICT, actualizar formulario tras avisar. Inexistente en edición/borrado: 404.
No permitir cambios parciales por validación fallida o error de escritura. El administrador
conserva el ID del alta durante reintentos para evitar duplicados tras perder la respuesta.
Números normalizados según RN-06; las URL admiten solo https sin usuario/contraseña.

## Contrato de prueba

Supertest verifica respuestas y ausencia de escrituras ante 401/403/422, CSRF/login/logout,
expiración, regeneración, límites y conflictos. Pruebas con SQLite real verifican persistencia,
rollback, alta repetida, cambios de carrito, suma exacta, número ausente y URL larga.
Playwright intercepta la salida a WhatsApp y verifica destinatario/mensaje; nunca envía mensajes.
