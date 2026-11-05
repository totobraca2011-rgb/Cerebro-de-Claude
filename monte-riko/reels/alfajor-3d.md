# Reel "Así se hace un alfajor" en 3D (noviembre 2026)

Idea de Tomás (4 de noviembre 2026): un reel en el estilo de @loconstruiste.mx (ver `editor-de-ia/referencias/README.md`), donde un pastelero chiquito en 3D arma un alfajor paso a paso. Es candidato para el martes 17, que quedó libre.

## Prueba v1 (4 de noviembre 2026)
- **Video:** `editor-de-ia/terminados/2026-11-04-alfajor-3d-prueba-v1.mp4` (5 s, 1080x1920, sin sonido).
- **Qué muestra:** el pastelero (gorro blanco y delantal naranja), el bollo de masa de chocolate que rebota, cae harina y lo estira con el palo de amasar. Subtítulo "Así se hace un alfajor Monte Riko" palabra por palabra y la tarjeta "Paso 1 · La masa".
- **Cómo se hizo:** HyperFrames con Three.js, todo armado con código (no hay modelos 3D bajados). El código es `alfajor-3d-prueba.html`. El proyecto para renderizar vive en la compu, en `C:\Users\MARCOS\Videos\monte-riko-3d\alfajor-3d\`, fuera de `AppData`: ahí está Three.js en `assets/lib/`. Se renderiza con `npx hyperframes render --output <archivo>.mp4` y tarda unos 20 s cada 5 s de video.
- **Falta, si Tomás la aprueba:** el resto de los pasos (tapas con el cortante, horno, dulce de leche, tapa, baño de chocolate, papel dorado y caja), su voz y los datos reales de su proceso para las tarjetas (temperatura y minutos de horno, cuánto dulce lleva cada uno, algún porqué).

## Prueba v2 (5 de noviembre 2026)
- **Video:** `editor-de-ia/terminados/2026-11-05-alfajor-3d-prueba-v2.mp4`. El código actualizado es el mismo `alfajor-3d-prueba.html`.
- **Cambios que pidió Tomás:** la frase queda solo "Así se hace un alfajor", sin "Monte Riko". El delantal se rehízo para que se lea como delantal: pechera, tiras al cuello, tira en la cintura, falda que sigue el cuerpo y bolsillo. Se sacó el bowl verde con cacao que estaba al lado del pastelero.
- **Pendiente:** Tomás lo ve "pixeleado". Son las caras planas del estilo low poly (cabeza, gorro, masa, harina en triangulitos), no la calidad del video. Se le propuso suavizarlo.

## Seguir desde la nube u otra compu
El proyecto de `C:\Users\MARCOS\Videos\` no está en el repo. Para rearmarlo: `npx hyperframes init alfajor-3d --example=blank --resolution=portrait --non-interactive`, copiar `alfajor-3d-prueba.html` como `index.html` y bajar Three.js con `npm pack three@0.170.0`. De ese paquete, `build/three.module.min.js` va a `assets/lib/`. Antes del primer render: `npx hyperframes browser ensure`.
