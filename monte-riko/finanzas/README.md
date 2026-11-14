# Finanzas de Monte Riko

Pedido de Tomás (13 de noviembre 2026): un agente experto que maneje la plata, sea su "contador maestro", le dé recomendaciones, averigüe precios de insumos y calcule cuánto cuesta y cuánto deja cada alfajor.

## Situación (13 de noviembre 2026)
- Ya vende. No anota ventas ni gastos. Sabe más o menos cuánto le cuesta y cuánto gana por alfajor (falta que pase sus números para comparar).
- Cobra casi todo por transferencia o en efectivo.
- Es menor de edad y no está en el monotributo. Falta saber la edad exacta: a partir de los 16 cambian algunas reglas.
- En su Drive está la "Panilla de gastos" de febrero 2025 (carpeta compartida `0000-Monteriko`): lista de insumos con precios de entonces, cantidades por docena y su idea de reparto: **50% negocio, 30% personal, 20% ahorro** (también probó 60/25/15).

## Receta por docena (lo que usa la cuenta)
Masa, de la planilla 2025: harina 200 g, maicena 50 g, 1 huevo, manteca 100 g, azúcar 100 g, cacao 25 g, miel 25 g, extracto de malta 25 g, naranja 250 g, vainilla 5 ml, bicarbonato de sodio 2,5 g, bicarbonato de amonio 2,5 g, polvo de hornear 3,75 g y un chorrito de ron.
Relleno y baño, confirmado por Tomás: **55 g de dulce de leche y 20 g de chocolate por alfajor** (660 g y 240 g por docena).
Envoltorio de cada alfajor (planilla 2025): unos 2,5 g de papel metalizado, una calcomanía y una etiqueta nutricional.
**Falta confirmar:** cuánta mermelada lleva el patagónico y si además lleva los 55 g de dulce; si se sigue usando el dulce de leche clásico (en 2025, 120 g por docena); la naranja (¿una por docena?); horas de trabajo por docena.

## Lo que ya está armado
- **Skill** `.claude/skills/finanzas-monte-riko/SKILL.md`: rutinas (anotar venta y gasto, costo y ganancia, revisar precios, relevar insumos, cierre semanal y mensual, compras, monotributo) y reglas (no mueve plata, no cambia precios publicados sin el sí de Tomás, no da consejos de inversión, nada de datos de clientes).
- **Agente** `.claude/agents/contador.md`, que usa esa skill.
- **Planilla**: `armar-planilla.py` arma `planilla-finanzas.xlsx` con las pestañas Inicio, Costos, Resumen, Ventas, Gastos, Insumos y Receta, todo con fórmulas. Los datos salen de `datos-planilla.json`. **Hoy ese archivo tiene precios de prueba**: no usar sus números.
- Para verificar las cuentas sin Excel: `uv run --no-project --with formulas --with openpyxl python` con el paquete `formulas` (probado: calcula bien).

## Cómo seguir (lo que falta)
1. **Precios de noviembre 2026** de cada insumo. La investigación grande con muchos agentes a la vez se cortó el 13 de noviembre porque agotó el límite del plan: ninguno llegó a entregar. La próxima vez, de a poco: un rubro por vez (secos, lácteos, chocolate, empaque) con un solo agente o directo en la sesión.
2. Cargar los precios en `datos-planilla.json`, armar la planilla, verificar las cuentas y subirla a Drive (carpeta `0000-Monteriko`) convertida en planilla de Google.
3. Investigar, también de a un tema: monotributo y opciones siendo menor; habilitación para vender alimentos hechos en casa en Mar del Plata; cuentas para cobrar siendo menor; precios de la competencia; inflación.
4. Escribir las referencias de la skill: `references/metodo.md`, `references/reglas-argentina.md` y `references/fuentes-de-precios.md`. Por ahora la skill las nombra pero no existen.
5. Que Tomás conecte **Google Sheets** en Claude, así el contador escribe en la planilla.

## Conectores y herramientas (revisado el 13 de noviembre 2026)
| Herramienta | Opinión |
|---|---|
| Google Sheets (conector oficial) | Sí, el principal. Falta conectarlo (lo hace Tomás con un clic) |
| Google Drive, Trello | Ya conectados. Sirven para la planilla y la tarjeta del resumen semanal |
| WhatsApp Business Tools | Más adelante: cada pedido confirmado podría anotarse solo |
| Mercado Pago (servidor oficial, mcp.mercadopago.com) | No sirve para esto: es para programadores; no vimos que traiga los cobros reales |
| Plugin "Small Business" de Anthropic | No por ahora: 44 skills pensadas para empresas con empleados y programas como QuickBooks o Shopify. Se toman sus ideas (pronóstico de caja, punto de reposición) en la skill propia |
| QuickBooks, Xero, FreshBooks, Stripe, plugin "Finance" | No: son para otros países o para empresas grandes |
| Bancos argentinos | No hay conector. Extracto en archivo si hace falta |

## Monotributo (dato a confirmar)
Desde el 1 de agosto 2026, tope anual de la categoría A $12.009.410 y de la B $17.595.182 (prensa; confirmar en la tabla oficial de ARCA). Se mide lo facturado en los últimos 12 meses y se recategoriza en febrero y agosto. Siendo menor de edad hay que averiguar cómo puede inscribirse o si conviene que lo haga un adulto: está en el punto 3.
