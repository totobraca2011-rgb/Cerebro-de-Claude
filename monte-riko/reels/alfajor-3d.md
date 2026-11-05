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

## Reel completo v2 (5 de noviembre 2026)
- **Video:** `editor-de-ia/terminados/2026-11-05-alfajor-3d-v2.mp4`.
- **Gancho nuevo** (lo eligió Tomás, sacado de `../ganchos.md`, el 9 "Así es como yo..."): el subtítulo dice "Así es como se hace un alfajor de más de 100 g" y arriba aparece **+100 G** bien grande desde el primer cuadro. Antes decía "Así se hace un alfajor", sin ningún dato.

## Con sonido v3 (5 de noviembre 2026)
- **Video:** `editor-de-ia/terminados/2026-11-05-alfajor-3d-v3-sonido.mp4`. Es la v2 con sonido, sin música (Tomás prefiere solo sonidos reales).
- **De dónde salen:** todos de Mixkit (Sound Effects Free License: uso comercial sin dar crédito). Desde la nube no se puede bajar de Freesound (la página bloquea los programas). Cada sonido pasó por `earshot realness` como grabación real; se sacaron los que sonaban hechos por computadora (brillos mágicos y pops de notificación).
- **Qué suena:** las puertas de la heladera y del horno (abren y cierran en el cuadro exacto), el palo de amasar en cada pasada, la masa al caer, el amasado y el dulce (sonidos húmedos), el cortado de las tapas, la bandeja de metal, el zumbido de la heladera y del horno, el vapor, el chocolate burbujeando, las gotas, el papel manteca, el papel dorado y un pop suave en cada tarjeta y en cada dato, como en los reels de referencia de @loconstruiste.mx.
- **Medido:** -14 LUFS, pico -2,3 dBTP, sin clics ni cortes. El control automático marca algunos sonidos suaves (pops y amasado) entre 0,1 y 0,25 s después del cuadro que se puso. Caen mientras la tarjeta o la masa se mueve, pero si se nota, se adelantan.
- **Diseño:** `alfajor-3d/sonido/sounddesign.json` (se arma con `mix.py` de la skill `real-sound`). Los archivos de sonido no se guardan en el Cerebro: se vuelven a bajar de `https://assets.mixkit.co/active_storage/sfx/<id>/<id>.wav`:
  - `mk-1104_paper-slide.wav` (Mixkit 1104)
  - `mk-125_chopping-food-on-the-table.wav` (Mixkit 125)
  - `mk-1304_bathroom-sink-water-drip.wav` (Mixkit 1304)
  - `mk-137_shaking-jelly-liquid-on-a-plastic-box.wav` (Mixkit 137)
  - `mk-154_gas-stove-hum.wav` (Mixkit 154)
  - `mk-1800_cast-iron-pan-set-down.wav` (Mixkit 1800)
  - `mk-1840_kitchen-oven-open.wav` (Mixkit 1840)
  - `mk-1851_kitchen-oven-close.wav` (Mixkit 1851)
  - `mk-1863_refrigerator-door-close.wav` (Mixkit 1863)
  - `mk-1864_fridge-soft-motor-hum.wav` (Mixkit 1864)
  - `mk-1865_refrigerator-door-open.wav` (Mixkit 1865)
  - `mk-188_cupboard-sliding-door.wav` (Mixkit 188)
  - `mk-2357_explainer-video-pops-whoosh-light-pop.wav` (Mixkit 2357)
  - `mk-2380_papers-being-moved-or-wrinkling.wav` (Mixkit 2380)
  - `mk-2885_soft-quick-punch.wav` (Mixkit 2885)
  - `mk-2936_dish-placed-in-a-wood-table.wav` (Mixkit 2936)
  - `mk-3115_short-wind-swoosh.wav` (Mixkit 3115)
  - `mk-3165_steam-swoosh.wav` (Mixkit 3165)
  - `mk-3179_deep-water-bubbles.wav` (Mixkit 3179)
  - `mk-3205_quick-swoosh-accent.wav` (Mixkit 3205)
  - `mk-414_hard-pop-click.wav` (Mixkit 414)

## Pendiente: la voz (5 de noviembre 2026)
Tomás eligió narrarlo con su voz (no con una voz de IA). Lo graba él con el celu: se le rompió el micrófono corbatero, así que hay que escuchar cómo suena antes de usarlo. Cuando llegue el audio: limpiarlo (ruido y volumen), cortar cada frase y ponerla en su paso, y bajar un poco los sonidos mientras habla. Texto (el mismo de los subtítulos, una línea por paso):

> Así es como se hace un alfajor de más de 100 gramos.
> Primero, la masa, derecho al freezer: una noche o más.
> La saco y la estiro hasta 5 milímetros.
> Salen las tapas, a la heladera, media hora.
> De la heladera, directo al horno… y a enfriar.
> 55 gramos de dulce de leche, panza para adentro.
> Otra vez al frío, así el dulce no se escapa.
> Chocolate semiamargo, a 45 grados, y abajo, otra vez.
> Papel dorado y la corona. Listo para vos.

## Seguir desde la nube u otra compu
El proyecto de `C:\Users\MARCOS\Videos\` no está en el repo. Para rearmarlo: `npx hyperframes init alfajor-3d --example=blank --resolution=portrait --non-interactive`, copiar `alfajor-3d-prueba.html` como `index.html` y bajar Three.js con `npm pack three@0.170.0`. De ese paquete, `build/three.module.min.js` va a `assets/lib/`, y `logo/Monteriko-blanco-v03.svg` se copia como `assets/logo-blanco.svg`. Antes del primer render: `npx hyperframes browser ensure`.
