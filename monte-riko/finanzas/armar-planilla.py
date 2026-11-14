# Arma la planilla de finanzas de Monte Riko (planilla-finanzas.xlsx).
# Uso (desde la carpeta del Cerebro):
#   uv run --no-project --with openpyxl python monte-riko/finanzas/armar-planilla.py
# La planilla viva está en Google Drive (ver README.md de esta carpeta). Este programa arma la plantilla
# con los precios relevados; si cambian precios o receta, se corrigen acá y en la planilla de Drive.

import datetime as dt
import json
import sys
from pathlib import Path

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

AQUI = Path(__file__).resolve().parent
SALIDA = AQUI / "planilla-finanzas.xlsx"
DATOS = json.loads((AQUI / "datos-planilla.json").read_text(encoding="utf-8"))

# ---------- estilo ----------
FUENTE = "Arial"
NEGRO = Font(name=FUENTE, size=10, color="000000")
AZUL = Font(name=FUENTE, size=10, color="0000FF")          # datos cargados a mano (precios, supuestos)
VERDE = Font(name=FUENTE, size=10, color="008000")         # traído de otra pestaña
GRIS = Font(name=FUENTE, size=9, color="666666", italic=True)
TITULO = Font(name=FUENTE, size=16, bold=True, color="000000")
SUBT = Font(name=FUENTE, size=11, bold=True, color="FFFFFF")
NEGRITA = Font(name=FUENTE, size=10, bold=True, color="000000")
AMARILLO = PatternFill("solid", fgColor="FFFF00")           # lo completa Tomás
NARANJA = PatternFill("solid", fgColor="FF6900")            # color de la marca, encabezados
CREMA = PatternFill("solid", fgColor="FFF4EC")
GRIS_F = PatternFill("solid", fgColor="F2F2F2")
FINO = Side(style="thin", color="BFBFBF")
BORDE = Border(left=FINO, right=FINO, top=FINO, bottom=FINO)
PESOS = '"$"#,##0;("$"#,##0);"-"'
PESOS2 = '"$"#,##0.00;("$"#,##0.00);"-"'
PCT = '0.0%;(0.0%);"-"'
NUM = '#,##0.####'
FECHA = "dd/mm/yyyy"
MES = "mmm yyyy"


def encabezado(ws, fila, textos, anchos=None):
    for i, t in enumerate(textos, start=1):
        c = ws.cell(row=fila, column=i, value=t)
        c.font = SUBT
        c.fill = NARANJA
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = BORDE
    ws.row_dimensions[fila].height = 32
    if anchos:
        for i, a in enumerate(anchos, start=1):
            ws.column_dimensions[get_column_letter(i)].width = a


def celda(ws, ref, valor, fuente=NEGRO, formato=None, relleno=None, nota=None, borde=True):
    c = ws[ref]
    c.value = valor
    c.font = fuente
    if formato:
        c.number_format = formato
    if relleno:
        c.fill = relleno
    if borde:
        c.border = BORDE
    if nota:
        c.comment = Comment(nota, "Claude")
    return c


wb = Workbook()

# =====================================================================
# 1. INICIO
# =====================================================================
ini = wb.active
ini.title = "Inicio"
ini.sheet_view.showGridLines = False
ini.column_dimensions["A"].width = 3
ini.column_dimensions["B"].width = 26
for col in "CDEFGHIJK":
    ini.column_dimensions[col].width = 14
ini["B2"] = "MONTE RIKO · FINANZAS"
ini["B2"].font = TITULO
ini["B3"] = f"Planilla del contador. Precios de insumos relevados el {DATOS['fecha_precios']}."
ini["B3"].font = GRIS
filas = [
    ("Cómo se lee", ""),
    ("Celda amarilla", "La completás vos (o Claude cuando le contás algo)."),
    ("Número azul", "Dato cargado a mano: un precio, un supuesto. Se puede cambiar."),
    ("Número negro", "Cuenta automática. No se toca."),
    ("Número verde", "Viene de otra pestaña."),
    ("", ""),
    ("Pestañas", ""),
    ("Costos", "Cuánto te cuesta y cuánto ganás con cada producto. Lo más importante."),
    ("Ventas", "Una fila por venta. Fecha, producto, cantidad, precio y cómo pagó."),
    ("Gastos", "Una fila por compra o gasto. Ingredientes, cajas, envíos, equipos."),
    ("Resumen", "Mes por mes: vendido, gastado, ganado y el reparto 50 / 30 / 20."),
    ("Insumos", "Precio de cada insumo, con fecha y de dónde salió."),
    ("Receta", "Cuánto de cada insumo lleva una docena. Sale de tu planilla de 2025 y de cómo hacés el alfajor."),
]
f = 5
for a, b in filas:
    ini.cell(row=f, column=2, value=a).font = NEGRITA if b == "" else NEGRO
    ini.cell(row=f, column=3, value=b).font = NEGRO
    f += 1
ini["B6"].fill = AMARILLO
ini["B7"].font = AZUL
ini["B9"].font = VERDE

f += 1
ini.cell(row=f, column=2, value="Así se carga una venta (ejemplo, no cuenta)").font = NEGRITA
f += 1
ej_titulos = ["Fecha", "Producto", "Cantidad", "Precio c/u", "Total", "Cómo pagó", "Entrega", "Envío cobrado", "Nota"]
for i, t in enumerate(ej_titulos):
    c = ini.cell(row=f, column=2 + i, value=t)
    c.font = SUBT
    c.fill = NARANJA
    c.border = BORDE
f += 1
ej = [dt.date(2026, 11, 14), "Docena", 1, 31900, 31900, "Transferencia", "Envío MdP", 0, "Surtida 6 y 6"]
for i, v in enumerate(ej):
    c = ini.cell(row=f, column=2 + i, value=v)
    c.font = GRIS
    c.fill = GRIS_F
    c.border = BORDE
    if i == 0:
        c.number_format = FECHA
    if i in (3, 4, 7):
        c.number_format = PESOS
f += 2
ini.cell(row=f, column=2, value="Reglas").font = NEGRITA
for t in [
    "Nunca nombres ni teléfonos de clientes: alcanza con qué llevó y cómo pagó.",
    "Los precios de insumos se actualizan cada vez que comprás (Insumos, con fecha).",
    "La ganancia de Costos es antes de pagar tu tiempo y los gastos fijos: mirá también la ganancia por hora.",
    "No es asesoramiento contable ni de inversiones: lo impositivo se confirma con un contador.",
]:
    f += 1
    ini.cell(row=f, column=2, value="•").font = NEGRO
    ini.cell(row=f, column=3, value=t).font = NEGRO

# =====================================================================
# 2. INSUMOS
# =====================================================================
ins = wb.create_sheet("Insumos")
ins.freeze_panes = "B2"
encabezado(ins, 1, [
    "Insumo", "Rubro", "Presentación", "Cantidad del paquete", "Unidad", "Precio del paquete ($)",
    "Precio por unidad ($)", "Fecha del precio", "Dónde", "Feb 2025 por unidad ($)", "Variación desde feb 2025",
], [30, 11, 26, 11, 8, 14, 14, 12, 40, 14, 13])
fila_insumo = {}
for n, it in enumerate(DATOS["insumos"], start=2):
    fila_insumo[it["insumo"]] = n
    celda(ins, f"A{n}", it["insumo"], NEGRO)
    celda(ins, f"B{n}", it["rubro"], NEGRO)
    celda(ins, f"C{n}", it["presentacion"], AZUL)
    celda(ins, f"D{n}", it["cantidad"], AZUL, NUM)
    celda(ins, f"E{n}", it["unidad"], NEGRO)
    celda(ins, f"F{n}", it["precio"], AZUL, PESOS, nota=it.get("nota"))
    celda(ins, f"G{n}", f"=IF(D{n}>0,F{n}/D{n},0)", NEGRO, PESOS2)
    celda(ins, f"H{n}", dt.date.fromisoformat(it["fecha"]), AZUL, FECHA)
    celda(ins, f"I{n}", it["fuente"], AZUL)
    if it.get("feb2025") is not None:
        celda(ins, f"J{n}", it["feb2025"], AZUL, PESOS2)
        celda(ins, f"K{n}", f'=IF(J{n}>0,G{n}/J{n}-1,"")', NEGRO, PCT)
    else:
        celda(ins, f"J{n}", None, AZUL)
        celda(ins, f"K{n}", None, NEGRO)
ult_ins = 1 + len(DATOS["insumos"])
nota_ins = ult_ins + 2
ins.cell(row=nota_ins, column=1, value="Precios relevados por Claude en internet; los de feb 2025 son de tu planilla vieja. Cuando compres, poné tu precio real y la fecha.").font = GRIS
ins.cell(row=nota_ins + 1, column=1, value="Detalle de cada fuente: monte-riko/finanzas/precios-insumos.md en el Cerebro.").font = GRIS

# =====================================================================
# 3. RECETA (por docena)
# =====================================================================
rec = wb.create_sheet("Receta")
rec.freeze_panes = "B3"
rec["A1"] = "Cuánto lleva UNA DOCENA (12 alfajores). Cantidades en la unidad de la pestaña Insumos (kg, L o unidades)."
rec["A1"].font = GRIS
encabezado(rec, 2, [
    "Insumo", "Unidad", "Marplatense (por docena)", "Patagónico (por docena)", "Precio por unidad ($)",
    "Costo marplatense ($/docena)", "Costo patagónico ($/docena)", "De dónde sale la cantidad",
], [30, 8, 14, 14, 14, 15, 15, 60])
rec.row_dimensions[2].height = 45
r = 3
filas_ingred = []
filas_empaque = []
for bloque in DATOS["receta"]:
    c = rec.cell(row=r, column=1, value=bloque["bloque"])
    c.font = NEGRITA
    c.fill = CREMA
    for col in range(2, 9):
        rec.cell(row=r, column=col).fill = CREMA
    r += 1
    for it in bloque["items"]:
        fi = fila_insumo[it["insumo"]]
        celda(rec, f"A{r}", it["insumo"], NEGRO)
        celda(rec, f"B{r}", f"=Insumos!E{fi}", VERDE)
        relleno = AMARILLO if it.get("confirmar") else None
        celda(rec, f"C{r}", it["marplatense"], AZUL, NUM, relleno)
        celda(rec, f"D{r}", it["patagonico"], AZUL, NUM, relleno)
        celda(rec, f"E{r}", f"=Insumos!G{fi}", VERDE, PESOS2)
        celda(rec, f"F{r}", f"=C{r}*E{r}", NEGRO, PESOS)
        celda(rec, f"G{r}", f"=D{r}*E{r}", NEGRO, PESOS)
        celda(rec, f"H{r}", it["origen"], GRIS)
        (filas_empaque if bloque["empaque"] else filas_ingred).append(r)
        r += 1
r += 1


def suma_filas(col, filas):
    return "=" + "+".join(f"{col}{x}" for x in filas)


celda(rec, f"A{r}", "Ingredientes por docena", NEGRITA)
celda(rec, f"F{r}", suma_filas("F", filas_ingred), NEGRITA, PESOS)
celda(rec, f"G{r}", suma_filas("G", filas_ingred), NEGRITA, PESOS)
FILA_REC_INGRED = r
r += 1
celda(rec, f"A{r}", "Envoltorio de cada alfajor, por docena", NEGRITA)
celda(rec, f"F{r}", suma_filas("F", filas_empaque), NEGRITA, PESOS)
celda(rec, f"G{r}", suma_filas("G", filas_empaque), NEGRITA, PESOS)
FILA_REC_EMPAQUE = r
r += 2
rec.cell(row=r, column=1, value="Amarillo = cantidad a confirmar por Tomás (pesar una tanda y corregir acá).").font = GRIS

# =====================================================================
# 4. COSTOS
# =====================================================================
co = wb.create_sheet("Costos", 1)
co.sheet_view.showGridLines = False
co.column_dimensions["A"].width = 30
for col, w in zip("BCDEFGHIJKLM", [13, 10, 13, 11, 13, 13, 11, 13, 13, 12, 13, 14]):
    co.column_dimensions[col].width = w
co["A1"] = "COSTO Y GANANCIA POR PRODUCTO"
co["A1"].font = TITULO
co["A2"] = "Ganancia = precio menos ingredientes, envoltorio, caja y gas/luz. Todavía sin descontar tu tiempo ni los gastos fijos."
co["A2"].font = GRIS

S = DATOS["supuestos"]
sup = [
    ("Merma (insumos que se pierden: tapas rotas, chocolate que sobra)", S["merma"], PCT, "merma"),
    ("Gas y luz por docena ($)", S["energia_docena"], PESOS, "energia"),
    ("Horas de trabajo por docena (de punta a punta)", S["horas_docena"], '0.0', "horas"),
    ("Valor de tu hora de trabajo ($)", S["valor_hora"], PESOS, "valor_hora"),
    ("Cajas surtidas: parte de marplatenses", S["mix_marplatense"], PCT, "mix"),
    ("Margen objetivo (para el precio sugerido)", S["margen_objetivo"], PCT, "margen_obj"),
]
co["A4"] = "Supuestos (cambialos y todo se recalcula)"
co["A4"].font = NEGRITA
REF = {}
for i, (txt, val, fmt, clave) in enumerate(sup, start=5):
    celda(co, f"A{i}", txt, NEGRO)
    celda(co, f"B{i}", val, AZUL, fmt, AMARILLO, nota=S["notas"].get(clave))
    REF[clave] = f"$B${i}"

# costo por alfajor
co["D4"] = "Costo de UN alfajor"
co["D4"].font = NEGRITA
encabezado_fila = 5
for j, t in enumerate(["", "Marplatense", "Patagónico"]):
    c = co.cell(row=encabezado_fila, column=4 + j, value=t)
    c.font = SUBT if t else NEGRO
    if t:
        c.fill = NARANJA
        c.alignment = Alignment(horizontal="center")
co.column_dimensions["D"].width = 24
lineas = [
    ("Ingredientes (con merma)", f"=Receta!F{FILA_REC_INGRED}/12*(1+{REF['merma']})", f"=Receta!G{FILA_REC_INGRED}/12*(1+{REF['merma']})"),
    ("Papel, sticker y etiqueta", f"=Receta!F{FILA_REC_EMPAQUE}/12", f"=Receta!G{FILA_REC_EMPAQUE}/12"),
    ("Gas y luz", f"={REF['energia']}/12", f"={REF['energia']}/12"),
]
fila = 6
for txt, fm, fp in lineas:
    celda(co, f"D{fila}", txt, NEGRO)
    celda(co, f"E{fila}", fm, VERDE if "Receta" in fm else NEGRO, PESOS)
    celda(co, f"F{fila}", fp, VERDE if "Receta" in fp else NEGRO, PESOS)
    fila += 1
celda(co, f"D{fila}", "Costo de un alfajor", NEGRITA)
celda(co, f"E{fila}", f"=SUM(E6:E{fila-1})", NEGRITA, PESOS)
celda(co, f"F{fila}", f"=SUM(F6:F{fila-1})", NEGRITA, PESOS)
FILA_COSTO_U = fila  # E = marplatense, F = patagónico
CM = f"$E${FILA_COSTO_U}"
CP = f"$F${FILA_COSTO_U}"

# tabla de productos
t0 = 14
co.cell(row=t0 - 1, column=1, value="Cada producto").font = NEGRITA
encabezado(co, t0, [
    "Producto", "Precio de venta", "Alfajores", "Costo de los alfajores", "Caja", "Costo total",
    "Ganancia", "Margen", "Ganancia por alfajor", "Horas", "Ganancia por hora", "Ganancia menos tu hora", "Precio sugerido",
])
co.row_dimensions[t0].height = 45
fi_caja12 = fila_insumo["Caja para docena"]
fi_caja6 = fila_insumo["Caja para media docena"]
P = DATOS["precios_venta"]
productos = [
    ("Marplatense suelto", P["marplatense"], 1, f"={CM}", None),
    ("Patagónico suelto", P["patagonico"], 1, f"={CP}", None),
    ("Media docena", P["media_docena"], 6, f"=C{{f}}*({REF['mix']}*{CM}+(1-{REF['mix']})*{CP})", f"=Insumos!G{fi_caja6}"),
    ("Docena", P["docena"], 12, f"=C{{f}}*({REF['mix']}*{CM}+(1-{REF['mix']})*{CP})", f"=Insumos!G{fi_caja12}"),
    ("Media docena (todos patagónicos)", P["media_docena"], 6, f"=C{{f}}*{CP}", f"=Insumos!G{fi_caja6}"),
    ("Docena (todos patagónicos)", P["docena"], 12, f"=C{{f}}*{CP}", f"=Insumos!G{fi_caja12}"),
]
FILAS_PROD = {}
for k, (nombre, precio, n_alf, f_costo, f_caja) in enumerate(productos):
    f_ = t0 + 1 + k
    FILAS_PROD[nombre] = f_
    celda(co, f"A{f_}", nombre, NEGRO)
    celda(co, f"B{f_}", precio, AZUL, PESOS, AMARILLO)
    celda(co, f"C{f_}", n_alf, NEGRO, "0")
    celda(co, f"D{f_}", f_costo.format(f=f_), NEGRO, PESOS)
    celda(co, f"E{f_}", f_caja if f_caja else 0, VERDE if f_caja else NEGRO, PESOS)
    celda(co, f"F{f_}", f"=D{f_}+E{f_}", NEGRO, PESOS)
    celda(co, f"G{f_}", f"=B{f_}-F{f_}", NEGRITA, PESOS)
    celda(co, f"H{f_}", f"=IF(B{f_}>0,G{f_}/B{f_},0)", NEGRITA, PCT)
    celda(co, f"I{f_}", f"=G{f_}/C{f_}", NEGRO, PESOS)
    celda(co, f"J{f_}", f"={REF['horas']}*C{f_}/12", NEGRO, '0.00')
    celda(co, f"K{f_}", f"=IF(J{f_}>0,G{f_}/J{f_},0)", NEGRO, PESOS)
    celda(co, f"L{f_}", f"=G{f_}-J{f_}*{REF['valor_hora']}", NEGRO, PESOS)
    celda(co, f"M{f_}", f"=F{f_}/(1-{REF['margen_obj']})", NEGRO, PESOS)
ult_prod = t0 + len(productos)
co.conditional_formatting.add(f"H{t0+1}:H{ult_prod}", CellIsRule(operator="lessThan", formula=["0.5"], font=Font(name=FUENTE, bold=True, color="C00000")))
co.conditional_formatting.add(f"L{t0+1}:L{ult_prod}", CellIsRule(operator="lessThan", formula=["0"], font=Font(name=FUENTE, bold=True, color="C00000")))
co.cell(row=ult_prod + 1, column=1, value="Margen en rojo = queda menos de la mitad del precio. Precio sugerido = costo total ÷ (1 − margen objetivo).").font = GRIS

# gastos fijos y punto de equilibrio
g0 = ult_prod + 3
co.cell(row=g0, column=1, value="Gastos fijos por mes (los que pagás vendas o no)").font = NEGRITA
FILAS_FIJOS = []
for i, (txt, val, nota) in enumerate(DATOS["fijos"], start=g0 + 1):
    celda(co, f"A{i}", txt, NEGRO)
    celda(co, f"B{i}", val, AZUL, PESOS, AMARILLO, nota=nota)
    FILAS_FIJOS.append(i)
fila_tf = FILAS_FIJOS[-1] + 1
celda(co, f"A{fila_tf}", "Total gastos fijos por mes", NEGRITA)
celda(co, f"B{fila_tf}", f"=SUM(B{FILAS_FIJOS[0]}:B{FILAS_FIJOS[-1]})", NEGRITA, PESOS)
fila_sueldo = fila_tf + 1
celda(co, f"A{fila_sueldo}", "Lo que querés sacar para vos por mes", NEGRO)
celda(co, f"B{fila_sueldo}", S["sueldo_objetivo"], AZUL, PESOS, AMARILLO, nota=S["notas"].get("sueldo"))

pe = fila_sueldo + 2
co.cell(row=pe, column=1, value="¿Cuánto hay que vender?").font = NEGRITA
fd = FILAS_PROD["Docena"]
celda(co, f"A{pe+1}", "Docenas por mes para cubrir los gastos fijos", NEGRO)
celda(co, f"B{pe+1}", f"=IF(G{fd}>0,B{fila_tf}/G{fd},0)", NEGRITA, '0.0')
celda(co, f"A{pe+2}", "Docenas por mes para cubrir gastos fijos y tu sueldo", NEGRO)
celda(co, f"B{pe+2}", f"=IF(G{fd}>0,(B{fila_tf}+B{fila_sueldo})/G{fd},0)", NEGRITA, '0.0')
celda(co, f"A{pe+3}", "Horas de trabajo por mes para eso", NEGRO)
celda(co, f"B{pe+3}", f"=B{pe+2}*{REF['horas']}", NEGRO, '0.0')
co.cell(row=pe + 4, column=1, value="Calculado con cajas de docena surtidas; si vendés más sueltos o medias docenas, cambia.").font = GRIS
FILA_TOTAL_FIJOS = fila_tf

# =====================================================================
# 5. VENTAS
# =====================================================================
ve = wb.create_sheet("Ventas")
ve.freeze_panes = "A2"
encabezado(ve, 1, [
    "Fecha", "Producto", "Cantidad", "Precio c/u ($)", "Total ($)", "Cómo pagó", "Entrega", "Envío cobrado ($)",
    "Alfajores", "Costo estimado ($)", "Ganancia estimada ($)", "Nota (sin nombres)",
], [12, 22, 10, 13, 13, 15, 13, 13, 10, 14, 15, 36])
N_FILAS = 600
prod_rango = f"Costos!$A${t0+1}:$A${ult_prod}"
alf_rango = f"Costos!$C${t0+1}:$C${ult_prod}"
cos_rango = f"Costos!$F${t0+1}:$F${ult_prod}"
for n in range(2, N_FILAS + 2):
    for col in "ABCDFGHL":
        ve[f"{col}{n}"].fill = AMARILLO if n == 2 else PatternFill()
    ve[f"A{n}"].number_format = FECHA
    ve[f"D{n}"].number_format = PESOS
    ve[f"H{n}"].number_format = PESOS
    ve[f"E{n}"] = f'=IF(C{n}="","",C{n}*D{n})'
    ve[f"E{n}"].number_format = PESOS
    ve[f"I{n}"] = f'=IF(OR(C{n}="",B{n}=""),"",IFERROR(C{n}*INDEX({alf_rango},MATCH(B{n},{prod_rango},0)),0))'
    ve[f"J{n}"] = f'=IF(OR(C{n}="",B{n}=""),"",IFERROR(C{n}*INDEX({cos_rango},MATCH(B{n},{prod_rango},0)),0))'
    ve[f"J{n}"].number_format = PESOS
    ve[f"K{n}"] = f'=IF(E{n}="","",E{n}-J{n})'
    ve[f"K{n}"].number_format = PESOS
    for col in "ABCDEFGHIJKL":
        ve[f"{col}{n}"].font = NEGRO
dv_prod = DataValidation(type="list", formula1='"Marplatense suelto,Patagónico suelto,Media docena,Docena,Otro"', allow_blank=True)
dv_pago = DataValidation(type="list", formula1='"Transferencia,Efectivo,Mercado Pago,Otro"', allow_blank=True)
dv_entrega = DataValidation(type="list", formula1='"Retiro,Envío MdP,Envío país"', allow_blank=True)
for dv, col in ((dv_prod, "B"), (dv_pago, "F"), (dv_entrega, "G")):
    ve.add_data_validation(dv)
    dv.add(f"{col}2:{col}{N_FILAS+1}")
ve["A2"].comment = Comment("Una fila por venta. Si una caja tiene precio especial, poné el precio que cobraste de verdad.", "Claude")

# =====================================================================
# 6. GASTOS
# =====================================================================
ga = wb.create_sheet("Gastos")
ga.freeze_panes = "A2"
encabezado(ga, 1, ["Fecha", "Categoría", "Qué fue", "Monto ($)", "Cómo pagó", "¿Es para stock?", "Nota"],
           [12, 24, 36, 13, 15, 12, 36])
for n in range(2, N_FILAS + 2):
    ga[f"A{n}"].number_format = FECHA
    ga[f"D{n}"].number_format = PESOS
    for col in "ABCDEFG":
        ga[f"{col}{n}"].font = NEGRO
        if n == 2:
            ga[f"{col}{n}"].fill = AMARILLO
dv_cat = DataValidation(type="list", formula1='"Ingredientes,Empaque,Envíos,Equipos y herramientas,Marketing,Servicios,Impuestos y trámites,Otros"', allow_blank=True)
dv_pago2 = DataValidation(type="list", formula1='"Transferencia,Efectivo,Mercado Pago,Tarjeta,Otro"', allow_blank=True)
dv_stock = DataValidation(type="list", formula1='"Sí,No"', allow_blank=True)
for dv, col in ((dv_cat, "B"), (dv_pago2, "E"), (dv_stock, "F")):
    ga.add_data_validation(dv)
    dv.add(f"{col}2:{col}{N_FILAS+1}")

# =====================================================================
# 7. RESUMEN (mes por mes)
# =====================================================================
re_ = wb.create_sheet("Resumen", 2)
re_.sheet_view.showGridLines = False
re_["A1"] = "MES POR MES"
re_["A1"].font = TITULO
re_["A2"] = "Se llena solo con Ventas y Gastos. El reparto sigue tu idea de 2025: una parte para el negocio, otra para vos y otra para ahorrar."
re_["A2"].font = GRIS
R = DATOS["reparto"]
re_["A4"] = "Reparto de lo vendido"
re_["A4"].font = NEGRITA
celda(re_, "A5", "Negocio (insumos, cajas, gastos)", NEGRO)
celda(re_, "B5", R["negocio"], AZUL, PCT, AMARILLO)
celda(re_, "A6", "Personal (para vos)", NEGRO)
celda(re_, "B6", R["personal"], AZUL, PCT, AMARILLO)
celda(re_, "A7", "Ahorro (local, equipos, imprevistos)", NEGRO)
celda(re_, "B7", R["ahorro"], AZUL, PCT, AMARILLO)
celda(re_, "A8", "Tiene que dar 100%", GRIS)
celda(re_, "B8", "=B5+B6+B7", NEGRO, PCT)
re_.conditional_formatting.add("B8", CellIsRule(operator="notEqual", formula=["1"], font=Font(name=FUENTE, bold=True, color="C00000")))

h = 10
encabezado(re_, h, [
    "Mes", "Ventas ($)", "Alfajores vendidos", "Costo de lo vendido ($)", "Ganancia por producto ($)",
    "Gastos anotados ($)", "Ventas menos gastos ($)", "Parte negocio ($)", "Parte personal ($)", "Parte ahorro ($)",
    "¿Alcanza la parte del negocio?",
], [30, 14, 11, 14, 14, 14, 14, 14, 14, 14, 16])
re_.row_dimensions[h].height = 45
meses = []
y, m = DATOS["resumen_desde"]
for k in range(DATOS["resumen_meses"]):
    meses.append(dt.date(y, m, 1))
    m += 1
    if m == 13:
        m, y = 1, y + 1
VR = f"Ventas!$A$2:$A${N_FILAS+1}"
GR = f"Gastos!$A$2:$A${N_FILAS+1}"
for k, mes in enumerate(meses):
    n = h + 1 + k
    desde = f"$A{n}"
    hasta = f"DATE(YEAR($A{n}),MONTH($A{n})+1,1)"
    celda(re_, f"A{n}", mes, NEGRO, MES)
    celda(re_, f"B{n}", f'=SUMIFS(Ventas!$E$2:$E${N_FILAS+1},{VR},">="&{desde},{VR},"<"&{hasta})', NEGRO, PESOS)
    celda(re_, f"C{n}", f'=SUMIFS(Ventas!$I$2:$I${N_FILAS+1},{VR},">="&{desde},{VR},"<"&{hasta})', NEGRO, "#,##0")
    celda(re_, f"D{n}", f'=SUMIFS(Ventas!$J$2:$J${N_FILAS+1},{VR},">="&{desde},{VR},"<"&{hasta})', NEGRO, PESOS)
    celda(re_, f"E{n}", f"=B{n}-D{n}", NEGRO, PESOS)
    celda(re_, f"F{n}", f'=SUMIFS(Gastos!$D$2:$D${N_FILAS+1},{GR},">="&{desde},{GR},"<"&{hasta})', NEGRO, PESOS)
    celda(re_, f"G{n}", f"=B{n}-F{n}", NEGRITA, PESOS)
    celda(re_, f"H{n}", f"=B{n}*$B$5", NEGRO, PESOS)
    celda(re_, f"I{n}", f"=B{n}*$B$6", NEGRO, PESOS)
    celda(re_, f"J{n}", f"=B{n}*$B$7", NEGRO, PESOS)
    celda(re_, f"K{n}", f'=IF(B{n}=0,"",IF(F{n}<=H{n},"Sí","No: gastaste más"))', NEGRO)
ult_mes = h + len(meses)
re_.conditional_formatting.add(f"K{h+1}:K{ult_mes}", FormulaRule(formula=[f'LEFT(K{h+1},2)="No"'], font=Font(name=FUENTE, bold=True, color="C00000")))
tot = ult_mes + 1
celda(re_, f"A{tot}", "Total", NEGRITA)
for col in "BCDEFGHIJ":
    celda(re_, f"{col}{tot}", f"=SUM({col}{h+1}:{col}{ult_mes})", NEGRITA, "#,##0" if col == "C" else PESOS)

mo = tot + 2
re_.cell(row=mo, column=1, value="Para el día que te inscribas en el monotributo").font = NEGRITA
celda(re_, f"A{mo+1}", "Hoy", NEGRO)
celda(re_, f"B{mo+1}", "=TODAY()", NEGRO, FECHA)
celda(re_, f"A{mo+2}", "Vendido en los últimos 12 meses ($)", NEGRO)
celda(re_, f"B{mo+2}", f'=SUMIFS(Ventas!$E$2:$E${N_FILAS+1},{VR},">"&EDATE(B{mo+1},-12),{VR},"<="&B{mo+1})', NEGRITA, PESOS)
celda(re_, f"A{mo+3}", "Tope anual de la categoría A ($)", NEGRO)
celda(re_, f"B{mo+3}", DATOS["monotributo"]["tope_a"], AZUL, PESOS, AMARILLO, nota=DATOS["monotributo"]["nota"])
celda(re_, f"A{mo+4}", "Usado del tope", NEGRO)
celda(re_, f"B{mo+4}", f"=IF(B{mo+3}>0,B{mo+2}/B{mo+3},0)", NEGRITA, PCT)
re_.conditional_formatting.add(f"B{mo+4}", CellIsRule(operator="greaterThan", formula=["0.8"], font=Font(name=FUENTE, bold=True, color="C00000")))

# orden de pestañas: Inicio, Costos, Resumen, Ventas, Gastos, Insumos, Receta
wb._sheets = [wb[n] for n in ["Inicio", "Costos", "Resumen", "Ventas", "Gastos", "Insumos", "Receta"]]
for ws in wb.worksheets:
    ws.sheet_properties.tabColor = "FF6900" if ws.title in ("Costos", "Resumen") else "222221"

wb.save(SALIDA)
print(f"Planilla guardada en {SALIDA}")
print(json.dumps({"fila_costo_unitario": FILA_COSTO_U, "filas_productos": FILAS_PROD, "fila_total_fijos": FILA_TOTAL_FIJOS,
                  "fila_receta_ingredientes": FILA_REC_INGRED, "fila_receta_empaque": FILA_REC_EMPAQUE}, ensure_ascii=False))
