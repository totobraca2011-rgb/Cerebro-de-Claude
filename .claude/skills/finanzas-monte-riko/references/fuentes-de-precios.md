# Dónde relevar precios de insumos (aprendido el 13 de noviembre 2026)

Para gastar poco: primero los tickets de Tomás; después, solo las fuentes que funcionaron. Pocas búsquedas por insumo y nada de muchos agentes a la vez (la investigación grande de noviembre 2026 agotó el límite del plan).

## Funcionan (se abren con WebFetch y muestran precio)
- **Maxiconsumo** (`maxiconsumo.com/sucursal_moreno/...`): mayorista con sucursal en Mar del Plata (Av. Champagnat 2600). Muestra precio por bulto y suelto, con y sin IVA.
- **Yaguar** (`yaguar.com.ar/producto/...`): mayorista con sucursal en MdP (Ruta 88 y Fortunato de la Plaza).
- **Toledo Digital** (`toledodigital.com.ar`): supermercado de Mar del Plata.
- **Precios Claros** (API `d3e6htiiul5ek9.cloudfront.net/prod/productos?string=...&lat=-38.0055&lng=-57.5426`): precios de góndola de las sucursales cercanas a MdP.
- **Carrefour, Día, Jumbo** online: referencia de súper.
- **Distribuidoras pasteleras**: La Repo (chocolate Alpino 6 kg), Mercadito Pastelero, Distribuidora Alpes, Razzetto, Botica del Pastelero (dulce de leche, manteca, malta, mermelada).
- **Empaque**: Bioboxar (papel dorado por kilo), Multienvases (cajas, en MdP), Baripack (cajas por cantidad).
- **Inflación**: API de series de datos.gob.ar (INDEC) y el Excel del REM del BCRA.

## No funcionan
- **Mercado Libre**: bloquea la lectura automática (error 403). Solo sirven los precios que muestra el buscador, sin verificar.
- Páginas de la Municipalidad de General Pueyrredon y de la provincia: suelen dar 403 o 503. Si hace falta, se miran desde el Chrome de Tomás.

## Cómo anotar
Cada precio con producto, presentación, precio del paquete, precio por kg o unidad, tienda, fecha y link, en `monte-riko/finanzas/precios-insumos.md`, y el valor en la pestaña Insumos de la planilla.
