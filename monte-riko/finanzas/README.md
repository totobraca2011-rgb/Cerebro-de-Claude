# Finanzas de Monte Riko

Pedido de Tomás (13 de noviembre 2026): un agente experto que maneje la plata, sea su "contador maestro", le dé recomendaciones, averigüe precios de insumos y calcule cuánto cuesta y cuánto deja cada alfajor. Lo hacen la skill `finanzas-monte-riko` y el agente `contador`.

**Planilla viva (Google Sheets, carpeta compartida `0000-Monteriko`):** [Monte Riko · Finanzas](https://docs.google.com/spreadsheets/d/1U4cqiBjSsh9I8cMQNUOJ6uUZ0mS3mPS44YYT3aHF-DY/edit). Para escribir en ella hace falta que Tomás conecte Google Sheets en Claude; mientras tanto, Claude puede leerla por Drive.

| Archivo | Qué tiene |
|---|---|
| `costos.md` | Costo y ganancia de cada producto y lo que recomienda el contador |
| `precios-insumos.md` | Precios de cada insumo relevados en noviembre 2026, con fuentes |
| `mercado.md` | Competencia, inflación, gas, envíos, herramientas y preguntas pendientes para Tomás |
| `armar-planilla.py` + `datos-planilla.json` | Arman `planilla-finanzas.xlsx` (plantilla). Precios y receta se cambian en el JSON |
| Reglas (monotributo, menor de edad, alimentos, cuentas) | `.claude/skills/finanzas-monte-riko/references/reglas-argentina.md` |
| Método del contador | `.claude/skills/finanzas-monte-riko/references/metodo.md` |

## Situación (13 de noviembre 2026)
- Ya vende. No anota ventas ni gastos. Cobra casi todo por transferencia o en efectivo.
- Es menor de edad y no está en el monotributo. Falta saber la edad exacta.
- Su "Panilla de gastos" de febrero 2025 (en `0000-Monteriko`) tenía la receta por docena y su idea de reparto: **50% negocio, 30% personal, 20% ahorro**. La planilla nueva la usa.

## Receta por docena
Masa (planilla 2025): harina 200 g, maicena 50 g, 1 huevo, manteca 100 g, azúcar 100 g, cacao 25 g, miel 25 g, extracto de malta 25 g, naranja 250 g, vainilla 5 ml, bicarbonato de sodio 2,5 g, bicarbonato de amonio 2,5 g, polvo de hornear 3,75 g y un chorrito de ron.
Relleno y baño (Tomás, 13/11/2026): **55 g de dulce de leche y 20 g de chocolate por alfajor**.
Envoltorio (planilla 2025): unos 2,5 g de papel metalizado, una calcomanía y una etiqueta nutricional por alfajor.

## Resultado (detalle en `costos.md`)
Un marplatense cuesta unos **$1.128** y deja **$1.672** (60%). Una docena cuesta **$13.892** y deja **$18.008** (56%). Es antes de pagar su tiempo y los gastos fijos.

## Lo legal, en corto (detalle y fuentes en `reglas-argentina.md`; se confirma con un contador)
- **Con 16 o 17 años** puede sacar CUIT y entrar al monotributo a su nombre, con autorización de un padre o madre firmada ante escribano (RG ARCA 5803/2025). Siendo menor no paga jubilación ni obra social: la categoría A le cuesta unos **$15.600 por mes** (ARCA + ARBA, agosto 2026 a enero 2027). Tope de la A: $12.009.410 por año.
- **Con menos de 16** la ley no permite trabajar: el emprendimiento tendría que estar a nombre de un adulto.
- **Alimentos:** el Código Alimentario no habilita vender lo hecho en una cocina de casa sin habilitar. El primer paso barato es el carnet de manipulador de alimentos; después, producir en una cocina habilitada (alquilada por turno o una sala anexa a la casa con entrada propia). Para mandar a otras provincias hacen falta RNE y RNPA. La etiqueta tiene que tener alérgenos y, casi seguro, los octógonos.
- **Cobrar:** existe la Cuenta DNI 13/17 del Banco Provincia, que abre un chico de 13 a 17 años, con tope de ingresos de 3 salarios mínimos por mes. Si cobra en la cuenta de un padre o madre, la plata figura como ingreso de ese adulto.
- **Envíos a otras provincias** pueden meterlo en el Convenio Multilateral de Ingresos Brutos al formalizarse: consultarlo con el contador.

## Pendientes
1. Tomás: edad exacta, cuánto rellena el patagónico, horas por docena, si usa el dulce de leche clásico, tickets de sus últimas compras y cómo lo calculaba él (para comparar). El resto de las preguntas está al final de `mercado.md`.
2. Tomás: conectar Google Sheets en Claude.
3. Quedaron sin datos (la investigación se quedó sin búsquedas): precios de equipos y locales para crecer, habilitación en General Pueyrredon y precios de Gula, Rasta y Lucciano's. Se buscan de a uno cuando haga falta.
4. Revisar que la planilla de Google se vea bien (se subió convertida desde Excel; las cuentas se verificaron antes de subirla).

## Conectores y herramientas (13 de noviembre 2026)
| Herramienta | Opinión |
|---|---|
| Google Sheets (conector oficial) | Sí, el principal. Falta conectarlo (lo hace Tomás con un clic) |
| Google Drive, Trello | Ya conectados |
| WhatsApp Business Tools | Más adelante: cada pedido confirmado podría anotarse solo |
| Mercado Pago (servidor oficial) | No sirve para esto: es para programadores, no lee cobros reales |
| Plugin "Small Business" de Anthropic | No por ahora: pensado para empresas con empleados y programas como QuickBooks o Shopify. Sus ideas (pronóstico de caja, punto de reposición) están en la skill propia |
| QuickBooks, Xero, FreshBooks, Stripe, plugin "Finance" | No: son para otros países o empresas grandes |

**Para gastar pocos créditos:** investigar de a un tema, con pocas búsquedas, y empezar por los tickets de Tomás (`references/fuentes-de-precios.md`).
