# Revisión de requisitos Checklist: BioNut

**Purpose**: Evaluar completitud, claridad, coherencia y verificabilidad de los requisitos
antes de generar tareas, con énfasis en pedidos y seguridad administrativa.
**Created**: 2026-10-26
**Feature**: [spec.md](../spec.md)

**Note**: Generado por `$speckit-checklist`. Alcance general y profundidad estándar elegidos
por el usuario. Audiencia: responsable/revisor del proyecto, antes de tareas e implementación.
**Review Ownership**: El revisor decide las marcas. Este comando solo genera preguntas.
**Marker Semantics**: `[x]` significa requisito revisado y satisfactorio en calidad documental;
no significa funcionalidad implementada ni pruebas del producto aprobadas.

Fuentes: [plan](../plan.md), [modelo de datos](../data-model.md),
[contrato de interfaz](../contracts/ui.md), [contrato de servicio](../contracts/api.md),
[investigación](../research.md) y [guía de validación](../quickstart.md).
No existe tasks.md al generar esta lista. Las referencias «Spec §» identifican requisitos,
reglas e historias de spec.md; las referencias «Plan», «UI», «Contrato» y «Modelo» remiten a
los documentos enlazados arriba.

## Requirement Completeness

- [ ] CHK001 ¿Están delimitadas las capacidades del cliente anónimo y del administrador, sin requisitos de cuenta para consultar, buscar, preparar o abrir el pedido? [Completitud, Spec §FR-001, §FR-007, §RN-07]
- [ ] CHK002 ¿Están documentados los campos obligatorios y opcionales del producto, sus límites y la ausencia de carga de archivos para imágenes? [Completitud, Spec §RN-01, §FR-008]
- [ ] CHK003 ¿Está definida toda la información del resumen de pedido, incluyendo cantidades, precios unitarios, subtotales, total referencial y condiciones de entrega? [Completitud, Spec §FR-004, §RN-05]
- [ ] CHK004 ¿Están definidos los requisitos de configuración, eliminación y conservación del número del vendedor, junto con quién puede modificarlos? [Completitud, Spec §FR-009, §RN-06, §HU6.6]

## Requirement Clarity

- [ ] CHK005 ¿La agrupación del carrito distingue inequívocamente identidad del producto y coincidencia de nombres, y define el significado del contador de unidades? [Claridad, Spec §FR-003, §HU3.6; UI §Tienda pública]
- [ ] CHK006 ¿Los requisitos de cantidades e importes precisan límites, tratamiento de valores inválidos, separador decimal y ausencia de redondeo silencioso? [Claridad, Spec §RN-01, §RN-03; Modelo §Invariantes y persistencia]
- [ ] CHK007 ¿La diferencia entre preparar, abrir y enviar un pedido está definida sin implicar pago, reserva o recepción confirmada? [Claridad, Spec §FR-004, §RN-05, §HU4.6]
- [ ] CHK008 ¿Las reglas de búsqueda precisan coincidencia parcial, mayúsculas, tildes, espacios y campos incluidos? [Claridad, Spec §RN-02, §HU2]

## Requirement Consistency

- [ ] CHK009 ¿La garantía de conservar el carrito al regresar de WhatsApp en HU4.6 es coherente con la conservación condicionada al historial del navegador en el diseño, y está resuelta cualquier diferencia? [Consistencia, Conflict, Spec §HU4.6, §Assumptions; UI §Tienda pública; Investigación §Interfaz, importes y WhatsApp]
- [ ] CHK010 ¿Los requisitos de moneda, precisión y total referencial coinciden entre catálogo, carrito, panel y mensaje? [Consistencia, Spec §FR-012, §RN-03, §SC-002]
- [ ] CHK011 ¿Las cinco decisiones confirmadas en Clarifications se mantienen sin alternativas contradictorias en historias, reglas y contratos? [Consistencia, Spec §Clarifications, §FR-001, §FR-003, §FR-004, §FR-007, §FR-008]
- [ ] CHK012 ¿Los límites adicionales del diseño para imágenes y longitud del mensaje están justificados y reconciliados con los límites comerciales de la especificación? [Consistencia, Assumption, Spec §RN-01, §Edge Cases; Modelo §Product, §Cart y Checkout]

## Acceptance Criteria Quality

- [ ] CHK013 ¿Cada requisito funcional remite a criterios observables que permiten decidir cumplimiento sin inferir resultados esperados? [Verificabilidad, Spec §FR-001–FR-015]
- [ ] CHK014 ¿Los objetivos temporales precisan inicio, fin, preparación previa y condiciones suficientes para obtener mediciones comparables? [Medibilidad, Gap, Spec §SC-001, §SC-003]
- [ ] CHK015 ¿La aceptación de los siete casos límite define evidencia visible y distingue la preparación operativa de fallos de su revisión por una persona no técnica? [Verificabilidad, Spec §SC-005, §Assumptions; Guía §Errores y recuperación en pruebas]
- [ ] CHK016 ¿El criterio de documentación reproducible diferencia comandos comprometidos, disponibilidad futura y resultados efectivamente comprobados? [Claridad, Spec §FR-015, §SC-007; Guía §Contrato de scripts raíz]

## Scenario Coverage

- [ ] CHK017 ¿Están especificadas las consecuencias de productos eliminados o modificados durante la preparación del pedido y la nueva revisión exigida al cliente? [Cobertura, Spec §FR-006, §RN-04, §HU4.4–HU4.5]
- [ ] CHK018 ¿Los requisitos distinguen catálogo vacío, búsqueda sin coincidencias, carga en curso y error recuperable sin confundir sus mensajes? [Cobertura, Spec §HU1.3, §HU2.3, §FR-014; UI §Tienda pública]
- [ ] CHK019 ¿Están documentados los recorridos alternativos de cancelación de edición/eliminación, sesión vencida y conflicto entre modificaciones administrativas? [Cobertura, Spec §HU5.4, §HU6.2, §HU6.4; Modelo §Product]
- [ ] CHK020 ¿La recuperación tras una confirmación de guardado incierta define cómo distinguir un cambio ya conservado de uno pendiente sin duplicar productos? [Cobertura, Spec §RN-08, §HU7.2; Contrato §Administración]

## Edge Case Coverage

- [ ] CHK021 ¿Los requisitos delimitan carrito vacío, cantidades inválidas, máximo permitido y eliminación de la última línea? [Cobertura, Spec §HU3.3–HU3.4, §RN-03]
- [ ] CHK022 ¿Está definida la diferencia entre URL de imagen inválida, imagen ausente e imagen inaccesible, con consecuencias inequívocas para la edición y el catálogo? [Cobertura, Spec §RN-01, §HU1.2, §HU6.7]
- [ ] CHK023 ¿Están definidos los casos de número ausente, formato inválido y número de formato válido que no dispone de WhatsApp? [Cobertura, Spec §RN-06, §HU4.3; Assumption]
- [ ] CHK024 ¿Los requisitos contemplan mensaje demasiado largo, caracteres especiales y dependencia externa no disponible sin omitir líneas ni afirmar envío? [Cobertura, Spec §HU4.2, §Edge Cases, §RN-05]

## Non-Functional Requirements

- [ ] CHK025 ¿La protección administrativa cubre todos los recursos y cambios restringidos, incluidos formularios antiguos, y diferencia autenticación de autorización? [Seguridad, Spec §FR-007, §HU5; Contrato §Administración]
- [ ] CHK026 ¿Se especifican de forma medible expiración, cierre y revocación de sesiones, así como el efecto sobre pestañas abiertas? [Seguridad, Spec §HU5.3–HU5.4; Modelo §Session]
- [ ] CHK027 ¿Los requisitos de intentos fallidos y solicitudes no legítimas incluyen umbrales, duración de bloqueo, recuperación y mensajes sin revelar credenciales? [Seguridad, Spec §FR-014; Investigación §CSRF, fuerza bruta y errores; Modelo §LoginAttempt]
- [ ] CHK028 ¿Está definido qué información sensible no se recoge, publica o registra, y cuánto tiempo se conservan los datos operativos de seguridad? [Privacidad, Spec §FR-013; Plan §Diseño y validación; Modelo §LoginAttempt; Constitución §VIII]
- [ ] CHK029 ¿Los requisitos responsive y de accesibilidad abarcan tienda y administración con tamaños, teclado, foco, errores y criterios de contraste objetivamente evaluables? [Accesibilidad, Gap, Spec §FR-011, §SC-006; UI §Accesibilidad y estilo]
- [ ] CHK030 ¿Los presupuestos de rendimiento y la conservación de datos indican condiciones de medición y recuperación, sin convertirse implícitamente en garantías de disponibilidad no acordadas? [Medibilidad, Plan §Technical Context; Spec §FR-010; Guía §Errores y recuperación en pruebas]

## Dependencies & Assumptions

- [ ] CHK031 ¿Las dependencias de WhatsApp e imágenes externas documentan sus límites y distinguen acceso al servicio externo de inicio de sesión en la tienda? [Dependencias, Spec §Assumptions, §Clarifications]
- [ ] CHK032 ¿Los supuestos de una tienda, un administrador, número peruano y carrito temporal son explícitos y coherentes con los recorridos de aceptación? [Supuestos, Spec §Assumptions, §RN-06, §RN-07]
- [ ] CHK033 ¿Las responsabilidades de configuración inicial, almacenamiento persistente y recuperación operativa están documentadas sin exigir funciones comerciales fuera de alcance? [Completitud, Spec §FR-015, §Assumptions; Guía §Configuración de entorno, §Errores y recuperación en pruebas]

## Ambiguities & Conflicts

- [ ] CHK034 ¿Expresiones como «alto contraste», «cuando quepa» y «ancho legible» están definidas mediante criterios suficientes para una revisión objetiva? [Ambiguity, UI §Tienda pública, §Accesibilidad y estilo]
- [ ] CHK035 ¿El alcance excluye consistentemente pagos, facturación, clientes registrados, envíos automáticos, descuentos e inventario avanzado en todos los documentos? [Consistencia, Spec §Assumptions; Plan §Constraints]
- [ ] CHK036 ¿Los desacuerdos detectados entre especificación y diseño tienen una decisión documentada antes de convertirse en tareas, sin interpretar supuestos como aprobación automática? [Trazabilidad, Gap, Spec §Status; Plan §Constitution Check]

## Notes

- 36 preguntas generadas; ninguna evaluada ni marcada por este comando.
- Marcar `[x]` solo cuando el revisor determine que el criterio documental está satisfecho.
- Las referencias Gap, Ambiguity y Conflict señalan asuntos que revisar, no resultados de pruebas.
- Registrar hallazgos y la referencia de su resolución junto al ítem correspondiente.
- `$speckit-implement` lee el estado como condición de entrada y no modifica las marcas.
- `requirements.md` conserva su ciclo independiente; sus marcas previas no aprueban esta lista.
- Esta lista no contiene procedimientos de QA ni acredita que exista implementación.
