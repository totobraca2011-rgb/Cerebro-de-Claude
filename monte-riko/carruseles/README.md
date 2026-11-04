# Carruseles

## Regla: todos los carruseles van en estilo VOX (Tomás, 4 de noviembre 2026)
Tomás vio el carrusel "Cómo pedir tu caja" rehecho en este estilo y le encantó. Pidió usarlo en **todos** los carruseles de Monte Riko. El modelo que hay que copiar es `como-pedir/diapositivas.html` y sus PNG. La referencia original es el carrusel de @soyfranramos, anotado en `../instagram-referentes.md`.

### Cómo se arma
- **Medida:** 1080x1350, entre 6 y 10 imágenes. Un `<section>` por imagen en un solo HTML. Se abre con `?s=1`, `?s=2`, etc., y se saca una captura con Chrome headless (`--window-size=1080,1350 --virtual-time-budget=6000 --screenshot=...`). Antes de entregarlas, mirá las imágenes una por una.
- **Fondos:** alternar negro con cuadriculado finito y arena con cuadriculado. El cierre va en naranja.
- **Colores:** naranja `#FF6900`, negro y arena `#EBD9C5`. Las tarjetas y los recortes van en papel `#F4EADF`. Un solo color de acento: el naranja.
- **Letras:**
  - Títulos en Rubik Mono One, en mayúsculas.
  - Textos en Montserrat.
  - Rótulos chicos en Space Mono.
  - Remates escritos a mano en Caveat.
- **Arriba de cada imagen:** el contador ("02 / 06") a la izquierda y el tema de la imagen a la derecha ("LOS SABORES"), en Space Mono.
- **Abajo:** "@monteriko.oficial" a la izquierda. A la derecha va "Deslizá →" en la portada y "→" en las demás. En la última no va nada.
- **Recursos:**
  - Resaltador naranja detrás de la palabra clave del título. En el fondo naranja va negro, con la letra clara.
  - Círculo hecho a mano alrededor del gancho de la portada.
  - Fotos de la marca recortadas en papel, un poco giradas, con sombra y cinta.
  - Flechas hechas a mano que señalan la foto.
  - Listas numeradas (01, 02…) con líneas finas.
  - Tarjetas de papel para comparar opciones.
  - En el cierre, la foto va dentro de una ventana de navegador con "monteriko.com.ar".
- **Lo que se tomó de las otras referencias:** una sola idea por imagen, con título corto y poco texto (@nicofastt), y las listas numeradas con líneas (@ramiro.cubria).
- **Logo:** siempre el SVG oficial de `../logo/`, sin redibujar. Para que la marca se vea, el carrusel lleva una imagen con el logo grande sobre papel y el link de la página grande (pedido de Tomás, 4 de noviembre 2026).
- **Fotos:** las de `../pagina-web/assets/img/` (tamaños 800 o 1200). No repetir una misma foto en un carrusel.

## Carruseles armados
| Carpeta | Qué es | Estado |
|---|---|---|
| `como-pedir/` | Cómo pedir tu caja: precios, cajas, envío, los 3 pasos, la marca y el cierre (7 imágenes) | Rehecho en estilo VOX el 4 de noviembre 2026, para publicar el jueves 5. Ese mismo día, a pedido de Tomás, se sumó la imagen 6 "Buscá la corona", con el logo grande y el link de la página bien visible (el logo casi no aparecía, solo en las etiquetas), y se agrandó el link del cierre, que pasó a ser la 7. **Pendiente:** Tomás tiene que aprobar la versión nueva. En Drive (`0000-Monteriko/redes/Carruseles para publicar/Como pedir`) sigue la de 6 imágenes |
