# Agente de finanzas de Monte Riko

Armado el 13 de noviembre 2026, a pedido de Tomás ("estamos vendiendo ya"). **Estado:** propuesta. Nada instalado ni conectado todavía; faltan las decisiones del final.

## Para qué
Que Tomás no lleve las cuentas de cabeza. El agente anota ventas y gastos, dice cuánto gana de verdad por alfajor y por caja, cuánta plata separar para reponer insumos y para el monotributo, y le deja un resumen corto cada semana. Nunca mueve plata ni toca ARCA por su cuenta.

## Qué hace (de lo más útil a lo menos)
1. **Ventas:** cada pedido confirmado (por WhatsApp o Instagram) queda en una fila: fecha, qué llevó, cuánto, cómo pagó, si es envío. Sin nombre de cliente en el repo.
2. **Gastos:** insumos (chocolate, dulce de leche, harina, cajas, papel dorado), envíos, gas/luz, Metricool, herramientas. Tomás pasa foto del ticket o el monto y el agente lo categoriza.
3. **Costo y margen por producto:** con los gramos de `proceso.md` y los precios de insumos, el costo de un marplatense, un patagónico, media docena y docena, y cuánto queda. Avisa si una suba de insumos se come el margen y hay que cambiar un precio.
4. **Resumen semanal:** vendido, gastado, ganado, cajas por vender, cobros pendientes.
5. **Monotributo:** cuánto lleva facturado en los últimos 12 meses contra el tope de su categoría, y aviso antes de febrero y agosto (recategorización, hasta el día 5).
6. **Plata para crecer:** cuánto va separando para el local, empleados y mini fábrica (la meta de `yo/perfil.md`).

## Cómo se arma (recomendación)
**Base de datos: una planilla de Google Sheets** en `0000-Monteriko` de Drive, con solapas Ventas, Gastos, Costos y Resumen. Es lo que entiende cualquier contador y se ve desde el celu.
**El agente:** una skill propia `finanzas-monte-riko` en `.claude/skills/` (reglas de precios, categorías, cómo se calcula el costo, formato del resumen), más un agente en `.claude/agents/` que la usa, igual que el kit de diseño.
**Automático:** una tarea programada cada lunes que arma el resumen de la semana y lo deja en Trello o en la planilla. Cuando ande el asistente de WhatsApp (`whatsapp-asistente.md`), cada pedido que Tomás confirma crea la fila de venta solo.

## Conectores
| Conector | Para qué | Estado | Opinión |
|---|---|---|---|
| Google Sheets | Leer y escribir la planilla | Existe, **no conectado** | Sí. Es el principal. Tomás lo autoriza con un clic |
| Google Drive | Guardar tickets, facturas, reportes | Ya conectado | Sí |
| Trello | Tarjeta semanal de resumen, pendientes de cobro | Ya conectado | Sí |
| WhatsApp Business Tools | Origen de los pedidos | Conectado, falta registrar el número | Sí, más adelante |
| Mercado Pago (oficial) | — | Existe (mcp.mercadopago.com) | **No sirve para esto:** es para programadores (documentación, webhooks, usuarios de prueba); no vimos que traiga los movimientos reales de la cuenta |
| Mercado Pago, movimientos | Ver cobros reales | Sin conector oficial | Hoy: Tomás baja el reporte (CSV) desde la app cada semana y se lo pasa al agente. Después se puede probar con un token de la API (el token nunca va al repo) |
| Bancos argentinos | — | No encontramos conector | Igual que Mercado Pago: extracto en archivo |
| QuickBooks, Xero, FreshBooks, Stripe | Contabilidad | Existen | No: están hechos para otros países y para empresas más grandes; complican sin sumar |
| Plugin "Finance" de Anthropic y otros del catálogo | Cierres contables, asientos | Existen | No por ahora: sobran para un negocio de una persona |

## Skills y mods
- **Ya instaladas que sirven:** `xlsx` (planillas Excel), `dataviz` (gráficos del resumen), `docs` (informes para el contador).
- **Skills de afuera de finanzas:** ninguna por ahora (regla del Cerebro: antes de sumar una, se explica y se revisa el código).
- **Mod (opcional, después):** un panel al costado del chat con ventas del día y de la semana, hecho con `plugin-authoring`. Es un extra; no hace falta para empezar.

## Reglas del agente
- No paga, no transfiere, no factura en ARCA ni cambia de categoría solo. Muestra y avisa; Tomás hace.
- No guarda claves, tokens, números de cuenta ni datos de clientes en este repo. Eso vive solo en la planilla o en el celu de Tomás.
- Cuando hay un número que no está escrito, lo pregunta; no lo inventa.
- No es contador. En temas de impuestos da la cuenta y dice "confirmalo con un contador".

## Monotributo (dato a confirmar)
ARCA actualizó las escalas el 1 de agosto 2026 (+16,8%): tope de la categoría A $12.009.410 y de la B $17.595.182 por año. El parámetro es lo facturado en los últimos 12 meses. Las notas que encontramos no coinciden entre sí en algunas categorías: **antes de usar un tope, bajarlo de la tabla oficial de ARCA**. No sabemos todavía si Tomás está inscripto ni en qué categoría.

## Lo que falta decidir y saber (Tomás)
1. ¿Hoy dónde anota las ventas y los gastos? (cuaderno, notas del celu, nada)
2. ¿Cómo le pagan: transferencia, Mercado Pago, efectivo? ¿Cuánto de cada una?
3. ¿Está en monotributo? ¿Qué categoría?
4. Precios de los insumos que compra (una foto de los tickets alcanza).
5. ¿Se paga un sueldo o retira plata de la caja? Define cuánto "ganó" de verdad.
6. ¿Planilla de Google (recomendado) o Notion, que ya está conectado?
