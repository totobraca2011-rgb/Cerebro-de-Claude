# Destacadas de Instagram

Portadas para las destacadas de @monteriko.oficial (noviembre 2026). Se arman en `portadas.html` (una `<section>` por portada, se abre con `?s=1`) y se exportan en 1080x1920.

- **Estilo:** fondo negro y el ícono macizo en naranja `#FF6900`, con la corona oficial (`../logo/Monteriko-icono-negro-v03.svg`) adentro. Instagram la recorta en un círculo chico: todo va dentro de los 700 px del centro. El nombre lo pone Instagram abajo, por eso la portada no lleva texto.
- **Formato:** JPG común (color 4:2:0). Un JPG que sale de FFmpeg con `-q:v` desde un PNG queda en 4:4:4 y el celu no lo cargaba (5 de noviembre 2026): pasarlo por Pillow con `subsampling=2`.
- **Cómo se pone:** en el celu, abrí la destacada → Editar destacada → Editar portada → elegí la imagen de la galería.

| Archivo | Destacada | Estado |
|---|---|---|
| `pedi-aca.jpg` | Pedí acá: una bolsa con la corona | Armada el 5 de noviembre 2026; falta que Tomás la vea |
| `precios.jpg` | Precios: una etiqueta de precio con la corona | Armada el 6 de noviembre 2026; falta que Tomás la vea |
| `envios.jpg` | Envíos: un camioncito con la corona en la caja | Armada el 6 de noviembre 2026; falta que Tomás la vea |
