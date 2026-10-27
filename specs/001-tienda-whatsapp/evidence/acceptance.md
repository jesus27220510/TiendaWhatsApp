# Aceptación final — pendiente de una persona

Fecha de implementación: 2026-10-27. Estado: implementación comprobada automáticamente; T060 abierta.

**No se ha realizado una aceptación por una persona no técnica ni por una segunda persona.** No se atribuyen a personas los tiempos de Playwright. Tampoco se envió un pedido real por WhatsApp.

| Criterio | Evidencia técnica disponible | Validación humana pendiente |
| --- | --- | --- |
| SC-001 | Búsqueda/carrito/WhatsApp en ambos tamaños, sin login. | Cronometrar el recorrido completo, objetivo <3 minutos. |
| SC-002 | Importes 33.00, 45.50 y 37.50 comprobados en componentes y navegador. | Revisar visualmente mensaje en WhatsApp real sin enviarlo. |
| SC-003 | CRUD en ambos tamaños y persistencia tras reapertura. | Cronometrar alta/edición/eliminación, objetivo <5 minutos; reiniciar usando guía. |
| SC-004 | Anónimo, credenciales inválidas, sesión válida, logout/expiración comprobados. | Recorrer los casos desde el navegador con una cuenta del propietario. |
| SC-005 | Siete casos límite cubiertos por API/componentes/E2E. | Confirmar mensajes comprensibles sin inspeccionar código. |
| SC-006 | Español, soles, teclado, capturas y tamaños revisados; zoom CSS automatizado. | Confirmar uso de todas las pantallas en dispositivos disponibles. |
| SC-007 | Comandos reales y prueba de instalación limpia/CLI/dev/start. | Segunda persona instala y verifica siguiendo solo README/quickstart. |

## Registro a completar

- Revisor/a:
- Fecha:
- Dispositivos y navegador:
- Tiempo recorrido cliente:
- Tiempo recorrido administrador:
- Resultado HU1–HU7 / incidencias:
- Segunda persona y resultado de instalación:
- Decisión de aceptación:

Guía: [quickstart](../quickstart.md) y [README](../../../README.md). Cada historia tiene evidencia técnica us1.md–us7.md. Los 36 ítems del checklist del revisor permanecen sin modificar, conforme a la autorización del usuario para continuar con la implementación.
