# Página web de Monte Riko

Landing de Monte Riko, alfajores artesanales de Mar del Plata hechos por Tomás Bracamonte.

- **Código:** `monte-riko/pagina-web/` de este Cerebro (desde octubre 2026; el repo `totobraca2011-rgb/Monte-Riko` se borró el 29 de octubre de 2026 y esta es la única copia). No hay build: HTML, CSS y JS planos, todas las rutas relativas.
- **Publicada:** https://monteriko.com.ar (también responde con www). Tomás la subió a su propio hosting, con dominio y SSL (octubre 2026). Ya no se publica desde GitHub Pages.
- **Vista previa para Tomás:** artifact "Monte Riko · Alfajor artesanal de Mar del Plata", https://claude.ai/artifact/W6b4VNqNgafUvDrnu1A5HB. Mostrarle cada cambio ahí: publicar `pagina-web/index.html` con `assets/` en esa misma URL.
- **Para subirla:** cuando la pida, zip con `index.html`, `.nojekyll` y `assets/` de `pagina-web/` (nada más del Cerebro).

## Antes de tocar nada
Leé `monte-riko/brief.md`: productos, precios, cómo se compra, historia, frases de marca e identidad. Si un pedido lo contradice, preguntá; no inventes.

## Estructura
- `index.html`, `assets/styles.css`, `assets/main.js`: el sitio. `main.js` tiene el armador de pedidos, que genera el mensaje para wa.me/5492236188694.
- `assets/img/`: fotos optimizadas en AVIF, WebP y JPG, en anchos 480, 800, 1200 y el original. Si agregás una foto, generá las tres variantes y usá `<picture>` con `srcset`, `sizes`, `width` y `height`. Los originales están en `monte-riko/fotos-originales/`.
- `assets/logo/`: los SVG oficiales tal cual vienen, sin redibujar (originales en `monte-riko/logo/`).

## Reglas de marca (fijas)
- El logo es siempre el SVG oficial. Nunca se escribe "MONTE RIKO" en otra fuente para hacer de logo.
- Títulos en Rubik Mono One, textos en Montserrat (Google Fonts).
- Colores: naranja #FF6900, negro #222221, arena #EBD9C6, más los neutros del packaging (dorado y kraft).
- El naranja nunca va como texto chico sobre fondo claro, porque no llega a 4,5:1.
- Rubik Mono One es monoespaciada: los puntos y comas van en `<span class="p">` y los títulos llevan word-spacing negativo, así los precios no se leen "$2 . 800".
- No va el chocolate blanco. No va ninguna foto de Tomás en la web. No hay foto del interior del marplatense: no se simula.
- No se inventan reseñas, cifras, clientes, premios ni ingredientes.

## Cómo se trabaja el diseño
Con el kit de diseño, que está en este Cerebro (ver `diseno/README.md`):
1. El agente `constructor-ui` hace los cambios.
2. `auditor-visual` y `auditor-tecnico` revisan en paralelo.
3. Se corrige y se repite hasta que los dos aprueben. Tomás autorizó que estas vueltas se hagan solas.
- Si una recomendación de los auditores deshace algo que él pidió, preguntarle antes de aplicarla.
- Taste-skill: correr `inspect.mjs` con `--allow mono`. Playwright: `NODE_PATH=$(npm root -g)` y `chromium.launch({ args: ['--no-sandbox'] })`.

## Decisiones tomadas (octubre 2026)
- **Burbujas flotantes** abajo a la derecha: WhatsApp (arriba) y "volver arriba" (en la esquina), círculos negros con borde arena. WhatsApp se esconde en el armador y en el pie, donde ya hay WhatsApp; la flecha aparece pasado el hero y se esconde sobre "Pedir ahora". Para no chocar con ellas, los stickers ($2.800, $3.000, "3 partes", corona) se movieron a la izquierda de sus fotos según el ancho.
- **Logo de la barra**: versión oficial con solo el nombre (`monteriko-color.svg`, sin "alfajor artesanal"), 184–190px en celular, 232px en tablet y 312px en escritorio, con margen negativo para alinear la M con el título.
- **Hero**: el párrafo dice solo "Alfajores artesanales hechos en una casa de Mar del Plata, por una sola persona." (sin precios).
- **Animaciones**: disco del hero que crece apenas con el scroll (quieto en celular) y foto con parallax suave; stickers que "se pegan" con rebote; circulitos de precios que aparecen de a uno; salto del total del armador; persiana al abrir las fotos solo en hero, alfajores, playa e historia; acordeón de "Cómo te llega" animado en celular, con el título que sube si el panel no entra. Todo respeta `prefers-reduced-motion` y queda visible sin JS y al imprimir.
- **Descartado** (Tomás aceptó lo que recomendó el auditor visual): el brillo dorado (no se leía como papel), la persiana en todas las fotos y el movimiento continuo de la foto de la playa.
- **Legales**: la página no guarda datos, no tiene cookies, analítica ni píxel, y no hay claves en el código. Por eso no van banner de cookies, botón de borrar datos ni registro de base de datos. Las tipografías son de licencia OFL y las fotos son de Tomás. Si se agrega Google Analytics, el píxel de Meta o un formulario que guarde datos, ahí sí hacen falta política de privacidad y banner.

## Pendiente
- `og:url` y `og:image` ya apuntan a monteriko.com.ar (29 de octubre de 2026). Tomás tiene que subir el zip nuevo para que tome el cambio.
- Política de privacidad y términos y condiciones: Tomás no los pidió todavía. Para los términos faltan nombre o razón social, CUIT, email, formas de pago y qué pasa con cancelaciones o reclamos.
- Data Fiscal de ARCA y botón de arrepentimiento: Tomás tiene que consultarlo con un contador; si corresponde, el QR va al pie.
- Opcionales que marcaron los auditores: ocultar las burbujas y no partir stickers de sus fotos al imprimir (`@media print`).
- Probar en Safari de iPhone el acordeón de "Cómo te llega".
- Tomás tiene que revisar los textos que escribió el constructor.
