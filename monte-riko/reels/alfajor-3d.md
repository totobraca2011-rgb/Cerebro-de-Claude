# Reel "Así se hace un alfajor" en 3D (noviembre 2026)

Idea de Tomás (4 de noviembre 2026): un reel en el estilo de @loconstruiste.mx (ver `editor-de-ia/referencias/README.md`), donde un pastelero chiquito en 3D arma un alfajor paso a paso. Es candidato para el martes 17, que quedó libre.

## Prueba v1 (4 de noviembre 2026)
- **Video:** `editor-de-ia/terminados/2026-11-04-alfajor-3d-prueba-v1.mp4` (5 s, 1080x1920, sin sonido).
- **Qué muestra:** el pastelero (gorro blanco y delantal naranja), el bollo de masa de chocolate que rebota, cae harina y lo estira con el palo de amasar. Subtítulo "Así se hace un alfajor Monte Riko" palabra por palabra y la tarjeta "Paso 1 · La masa".
- **Cómo se hizo:** HyperFrames con Three.js, todo armado con código (no hay modelos 3D bajados). El código es `alfajor-3d-prueba.html`. El proyecto para renderizar vive en la compu, en `C:\Users\MARCOS\Videos\monte-riko-3d\alfajor-3d\`, fuera de `AppData`: ahí está Three.js en `assets/lib/`. Se renderiza con `npx hyperframes render --output <archivo>.mp4` y tarda unos 20 s cada 5 s de video.
- **Falta, si Tomás la aprueba:** el resto de los pasos y su voz. Los datos reales del proceso ya están en `../proceso.md` (5 de noviembre 2026).

## Prueba v2 (5 de noviembre 2026)
- **Video:** `editor-de-ia/terminados/2026-11-05-alfajor-3d-prueba-v2.mp4`. El código actualizado es el mismo `alfajor-3d-prueba.html`.
- **Cambios que pidió Tomás:** la frase queda solo "Así se hace un alfajor", sin "Monte Riko". El delantal se rehízo para que se lea como delantal: pechera, tiras al cuello, tira en la cintura, falda que sigue el cuerpo y bolsillo. Se sacó el bowl verde con cacao que estaba al lado del pastelero.
- Tomás lo veía "pixeleado": Tomás lo ve "pixeleado". Son las caras planas del estilo low poly (cabeza, gorro, masa, harina en triangulitos), no la calidad del video. Se corrigió en la v3.

## Prueba v3 (5 de noviembre 2026)
- **Video:** `editor-de-ia/terminados/2026-11-05-alfajor-3d-prueba-v3.mp4`.
- **Menos pixeleado:** superficies lisas en vez de caras planas, con más detalle en las piezas redondas. La harina cae como polvo redondo y no en triangulitos. Se dibuja al doble de tamaño y se achica, así que los bordes quedan finos. Renderizar tarda unos 3 minutos cada 5 segundos en la nube.
- **Logo en el delantal** (pedido de Tomás): es el SVG oficial blanco (`logo/Monteriko-blanco-v03.svg`), estampado en la falda y siguiendo su curva, en lugar del bolsillo. En el proyecto va copiado como `assets/logo-blanco.svg`.


## Reel completo v1 (5 de noviembre 2026)
- **Video:** `editor-de-ia/terminados/2026-11-05-alfajor-3d-v1.mp4` (36 s, 1080x1920, sin sonido todavía).
- **Los 8 pasos** (los aprobó Tomás, con su proceso de `../proceso.md`): la masa y una noche en el freezer, estirar a 5 mm, las tapas 30 min a la heladera, horno a 160 °C por 8 min y a enfriar, 55 g de dulce con la panza para adentro, otra vez a la heladera para que el dulce no se escape, baño de chocolate semiamargo a 45 °C con un segundo baño abajo, y papel dorado con el sticker de la corona. Cierra con "Pedilo en monteriko.com.ar".
- **Lo que se tomó de las referencias** (`editor-de-ia/referencias/`): el muñequito que arma todo paso a paso en una cocina en miniatura (@loconstruiste.mx), cortes de cámara de lejos a cerca cada 1 a 2 s (pastelería), subtítulo blanco con borde negro palabra por palabra, el dato grande en naranja arriba de cada paso y la tarjeta blanca del paso.
- **Código:** `alfajor-3d/escena.js` (la escena 3D) y `alfajor-3d/armar.py` (los textos y tiempos; arma el `index.html`). Para renderizar, armá el proyecto como dice abajo, copiá `logo/Monteriko-color-v03.svg` como `assets/logo-color.svg` y corré `python3 armar.py` con la carpeta del proyecto `alfajor-3d/` al lado. En la nube tarda unos 3 minutos cada 5 segundos.
- **Probado y sacado:** una flecha curva para mostrar "panza para adentro" se confundía con un hilo de dulce.
- **Falta:** que Tomás lo vea, y el sonido (sonidos reales, sin música) y su voz si la quiere.

## Seguir desde la nube u otra compu
El proyecto de `C:\Users\MARCOS\Videos\` no está en el repo. Para rearmarlo: `npx hyperframes init alfajor-3d --example=blank --resolution=portrait --non-interactive`, copiar `alfajor-3d-prueba.html` como `index.html` y bajar Three.js con `npm pack three@0.170.0`. De ese paquete, `build/three.module.min.js` va a `assets/lib/`, y `logo/Monteriko-blanco-v03.svg` se copia como `assets/logo-blanco.svg`. Antes del primer render: `npx hyperframes browser ensure`.
