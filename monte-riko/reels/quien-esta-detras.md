# Reel "Quién está detrás de Monte Riko" (octubre 2026, en armado)

Tomás hablando a cámara, 5 tomas verticales grabadas con el celu y micrófono corbatero. Orden propuesto (el de los archivos), unos 35 s:

| # | Toma | Qué dice | Corte sugerido (s) |
|---|---|---|---|
| 1 | IMG_0404, cocina, termo y mate | "¿Por qué vas a esperar a tener todo resuelto para empezar a hacer algo grande?" | 1,45–6,35 |
| 2 | IMG_0413, cocina con ventana, ceba un mate | "No todos los que llegan lejos empiezan sabiendo lo que hacen. La mayoría de cosas se aprenden mientras construís." | 0,95–7,85 |
| 3 | IMG_0417, entra a la silla vacía, se sienta y se va | "Por eso, yo creo que muchas veces no es necesario tener todo resuelto." (sigue con "Necesitás animarte…") | 4,50–8,80 |
| 4 | IMG_0418, se asoma al lado del piano | "Necesitás animarte a dar el primer paso y comprometerte con lo que querés lograr." | 1,80–7,10 |
| 5 | IMG_0439, primer plano con mate, fondo blanco; termina tapando la cámara con el mate | "Soy Tomás Bracamonte, el creador de Monte Riko, y esto recién empieza. Si querés ver cómo crece Monte Riko, seguí a @monteriko.oficial y acompañame en este camino." | 0,50–13,90 |

- Audio limpio, sin ruido de fondo; volumen bajo y desparejo entre tomas (−21,7 a −27,2 LUFS): emparejar a −14 LUFS al editar.
- Audio que faltaba (29 de octubre de 2026): `Nueva-grabacion.m4a`, 13,7 s, voz en off sin video. Dice: "Yo, por ejemplo, empecé sin tener idea de cómo llevar un negocio. Literalmente ni idea. Pero fue tomando forma, y hoy con 16 años, tengo mi propia marca de alfajores. Y sigo aprendiendo cómo hacerla crecer." (habla de 0,8 a 13,1 s).
- Orden propuesto con el audio nuevo: 0404 → 0413 → audio en off con tomas del proceso encima (`crudos/proceso-masa/`) → 0417 → 0418 → 0439. Unos 48 s.
- Los crudos están en `editor-de-ia/crudos/quien-esta-detras/`.

## Versión 1 (29 de octubre de 2026)
`editor-de-ia/terminados/2026-10-29-quien-esta-detras-v1.mp4`: 47,6 s, vertical 1080x1920, unos −15 LUFS.
- Orden: 0404 → 0413 → voz en off con tomas del proceso (harina, estirar la masa, cortar tapas, apilar tapas, de `crudos/proceso-masa/`) → 0417 → 0418 → 0439.
- Estilo tomado de la referencia de Instagram: colores cálidos y saturados en todo el reel; en las tomas hablando se alterna plano normal y plano cerrado (acercamiento de 1,15 a 1,25 veces) para dar ritmo. La toma del piano va sin acercamiento porque la cara está al costado.
- Subtítulos en Montserrat Bold, blancos con borde negro, en mayúsculas, de a 3 palabras como máximo. "Monte Riko", "16" y "@monteriko.oficial" en naranja.
- Sin música: se le pone en Instagram al subirlo.
- A Tomás no lo convenció: pidió rehacerlo más profesional, con referencias y sonidos.

## Versión 4 (31 de octubre de 2026, esperando que Tomás la apruebe)
`editor-de-ia/terminados/2026-10-31-quien-esta-detras-v4.mp4`: 46,5 s, 27 MB, −16,3 LUFS. Pedidos de Tomás sobre la v3:
- **Subtítulos palabra por palabra:** cada palabra aparece cuando la dice y se va sumando a la frase. Los tiempos salen de la transcripción (`monte-riko/reels/quien-esta-detras-palabras.json`).
- **Sin música de fondo.** Quedan la voz y los efectos.
- **Golpe metálico** apenas termina el gancho ("...algo grande?"), con un cuarto de segundo más de pausa antes de la cocina. Sonido: "Metal Clang sound" de kermite607 (CC0, Freesound). Elegido por medición y forma de onda, sin escucharlo: Tomás tiene que decir si es lo que imaginó.
El código de `quien-esta-detras-v2.tsx` es el de esta versión.

## Versión 3 (31 de octubre de 2026)
`editor-de-ia/terminados/2026-10-31-quien-esta-detras-v3.mp4`: igual que la v2, con los textos de la cocina, la silla, el piano y el primer plano final más cerca de la cara. Tomás lo pidió para poder leer y mirarle la cara al mismo tiempo: **en las tomas hablando, el texto va pegado a la cara**. El código de `quien-esta-detras-v2.tsx` ya tiene estos cambios.

## Versión 2 (31 de octubre de 2026)
`editor-de-ia/terminados/2026-10-31-quien-esta-detras-v2.mp4`: 46,3 s, vertical 1080x1920, −16,3 LUFS, 28 MB. Hecha con Remotion. El código queda en `monte-riko/reels/quien-esta-detras-v2.tsx`, por si hay que hacer una v3.
- Estilo de las referencias de `editor-de-ia/referencias/`: zoom lento en todas las tomas, salto de encuadre entre frases, textos palabra por palabra sincronizados con la voz.
- Tipografías: Rubik Mono One naranja (la de la marca) para las palabras fuertes, Playfair cursiva y Montserrat para el resto.
- Texto detrás de la cabeza en tres momentos: el gancho, "EMPIEZA" y "SEGUÍ A". Se logró recortando su silueta cuadro por cuadro.
- La harina cae justo en "pero fue tomando forma". En "tengo mi propia marca" va la foto de la caja con cuatro alfajores.
- Termina tapando la cámara con el mate, y corta al logo con un golpe.
- Música y efectos sin obligación de dar crédito (CC0, de Freesound vía Openverse). Música: "Cinematic Lofi Beat" de Seth_Makes_Sounds. Efectos: whooshes de qubodup, "Deep Whoosh #1" de Kinoton, "Hit Impact" de Mrguff e "Impact" de chriskalos.
- Volumen medido, pero el sonido no se escuchó: la música y los efectos los tiene que aprobar Tomás. La música de esta versión ya no necesita sumarse en Instagram.
