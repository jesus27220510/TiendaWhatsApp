# Modelo de datos — BioNut

Diseño lógico y validaciones; no es una migración ejecutable.

## Product

| Campo | Tipo / regla |
| --- | --- |
| id | UUID generado por cliente administrador para alta idempotente; PK inmutable. |
| name | Texto trim, 1–100 caracteres Unicode; no único. |
| description | Texto trim, 1–1000 caracteres Unicode. |
| price_cents | Entero 1–99999999. Nunca almacenar precio como float. |
| image_url | URL HTTPS absoluta o null; sin credenciales en URL; máximo técnico 2048 caracteres. |
| version | Entero positivo, aumenta por cada edición. |
| created_at / updated_at | Instantes UTC. |

Transición: inexistente → creado → editado → eliminado. Borrado físico sin historial comercial.
Los IDs no se reutilizan por la UI. Edición/borrado exige versión esperada; conflicto responde
409 y obliga recarga, sin sobrescribir silenciosamente otra pestaña. La creación repetida con
el mismo ID y mismos datos devuelve el producto existente; si difieren, 409. No hay inventario.

## StoreSettings

Fila única id=1. whatsapp_number nullable, normalizado a 51 más nueve dígitos móviles
comenzando por 9; version y updated_at. Ausencia de número no impide publicar catálogo.
Cambio y eliminación de número son transaccionales y sobreviven al reinicio.

## Admin

Fila única id=1, username único normalizado, password_hash Argon2id, created_at.
Creación local interactiva; no ruta pública de registro ni contraseña por defecto.
Username 3–64 caracteres; contraseña 15–128 caracteres, se admiten espacios sin recortarla.
La creación no sobrescribe una cuenta existente. Recuperación operativa queda fuera de la UI v1.

## Session

Almacén SQLite separado: identificador opaco firmado en cookie, datos de sesión (adminId,
csrfToken, authenticatedAt), expiresAt. Antes de login puede existir una sesión anónima solo
para CSRF del formulario administrativo; navegar por catálogo no crea sesiones.
Regeneración al autenticar; destrucción al salir; expira por inactividad a 30 minutos o a
8 horas absolutas, lo que ocurra primero. No se envía hash de contraseña al cliente.

## Cart y Checkout (no persistentes)

Cart es un mapa productId → {productId, name, priceCents, quantity}; cantidad 1–999.
Dos IDs con igual nombre son líneas distintas. Subtotales y total usan enteros seguros.
Snapshot de checkout contiene líneas vigentes, eliminadas, cambios y totalCents; no se guarda
como orden ni reserva. La entrada del cliente nunca es fuente autoritativa de precios.
Se limita el cuerpo HTTP a 256 KiB y el enlace final a 8000 caracteres codificados; al exceder,
se devuelve error explícito sin truncar. Son protecciones técnicas con explicación al cliente.

## Invariantes y persistencia

Consultas parametrizadas; campos desconocidos rechazados. La conversión de precio de formulario
admite coma o punto decimal, no miles ni redondeo silencioso; el transporte utiliza céntimos.
Texto se renderiza escapado, nunca como HTML. URL vacía se transforma a null; imagen rota
usa placeholder y nunca provoca una descarga en el servidor.

Migraciones numeradas transaccionales registradas en schema_migrations. db:init repetible,
sin borrar datos ni sembrar credenciales. SQLite WAL, foreign_keys=ON, busy_timeout=5000;
al agotar espera, 503 recuperable. No devolver éxito antes del commit. Tests usan rutas temporales.

## LoginAttempt (seguridad operativa)

Contadores persistentes en el almacén de sesiones para pareja username normalizado + IP y para
IP diaria: key, failureCount, windowStart, blockedUntil. Tras 5 fallos en 15 minutos bloquear
pareja 15 minutos; 100 fallos/IP por 24 horas bloquea hasta vencer ventana diaria. Borrar entradas
expiradas; conservar como máximo 24 horas después de expirar para limpieza. No registrar
contraseñas ni otros datos de solicitudes. Pruebas usan reloj controlado y comprueban reinicio.