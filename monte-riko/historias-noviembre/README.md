# Historias de noviembre 2026

Pedido de Tomás (1 de noviembre 2026): historias al menos 5 veces por semana, porque hacen presencia entre los seguidores. Son de lunes a viernes, del 2 al 27 de noviembre: 20 días y 52 imágenes listas, más las que se hacen directo en la app. Tomás las quiere solo como imágenes, sin videos (2 de noviembre 2026). **Tomás todavía no las revisó.**

Cada placa está en 1080x1920, dentro de `semana-1/` a `semana-4/`. El nombre dice el día y el orden: `mar-3-2.jpg` es la segunda de ese martes.

## Cómo subirlas
- Las encuestas, cajas de preguntas, enlaces y música se agregan en la app: no se pueden dejar hechos en la imagen. En el calendario, las placas que llevan uno dicen **Sticker** (son 20). Ponelo en la parte de la foto donde no tape el alfajor.
- La música se elige en Instagram.
- Las placas con enlace van a monteriko.com.ar.
- Nada queda programado todavía. Metricool puede publicar historias solas, pero sin stickers: esas 20 las termina Tomás en la app. El plan de Metricool permite 20 publicaciones por mes y necesita las imágenes en un link público o en un Google Drive conectado.
- Las fotos de `fotos-proceso/` se usan acá aunque Tomás todavía no las aprobó.
- Los días con reel, la placa de la mañana anticipa y a la noche se comparte el reel con un comentario: compartirlo pelado es lo que más se saltea la gente.
- El día que pase algo real (hornada, cajas saliendo, un cliente que etiqueta), eso va primero y la placa queda para otro día.

## Cómo las quiere Tomás (1 de noviembre 2026)
- **Nunca decir que estuvimos ausentes:** la gente no se da cuenta, se olvida. Solo hay que aparecer de nuevo.
- **Sin bordes negros:** la foto ocupa toda la pantalla.
- **Las letras no tapan el alfajor ni el relleno.** Van chicas y arriba o abajo, donde la foto queda libre.
- **Nada movido (5 de noviembre 2026):** los cuadros sacados de video pueden salir movidos. Antes de entregar una placa de video, mirala a tamaño real; si se ve movida, usá una foto quieta de `fotos-proceso/` o `fotos-originales/`.
- **Color del dulce de leche:** en las tomas sale verdoso. Lleva el filtro `GUSTOSO` de `armar.mjs`, que lo deja color caramelo.

**Placas hechas desde la nube (9 de noviembre 2026):** `armar.mjs` corre en la compu de Tomás. En la nube se usan `nube/placa.html` (misma letra y estilo) y `nube/placas.js` con Playwright; los cuadros limpios del reel 3D salen de `nube/cuadro-3d.js`, con el proyecto armado como dice `../reels/alfajor-3d.md`. Si se vuelve a correr `armar.mjs`, las de `lun-9` se pisan con las viejas: copiarlas de nuevo desde el repo.

Lo que se miró de otras marcas está en `../instagram-referentes.md`.

**Historias que piden algo (10 de noviembre 2026, pedido de Tomás):** se aplicó el carrusel de @duostudio.digital (ver `../instagram-referentes.md`). Cada historia que muestra producto hace elegir con una encuesta y pone el link al lado; la de fiestas crea expectativa con una cuenta regresiva en vez de solo avisar. Cambiaron los stickers del jueves 12, viernes 13 y lunes 23, y se rehicieron `mie-18-2`, `mie-18-3`, `lun-23-1` y `lun-23-3` (en el repo y en Drive). Queda para que Tomás decida: una historia de promo que pida una reacción a cambio de un descuento, y una de "quedan X cajas para el viernes" si produce por tandas. Las placas sueltas se rehacen con la composición `CapaHistoria` de `M:eel-v2ideosrcChiste.tsx` (`npx remotion still` con el texto por props) y FFmpeg encima de la foto.

## Calendario

### Lun 2: Así arranca (publicadas por Tomás el 2 de noviembre 2026)
- `lun-2-1.jpg`: ASÍ ARRANCA CADA ALFAJOR
- `lun-2-2.jpg`: ¿MATE O CAFÉ? **Sticker:** Encuesta: Mate / Café.
- `lun-2-3.jpg`: DE LA MASA A LA CAJA

### Mar 3: Quién está detrás (publicadas por Tomás el 3 de noviembre 2026, con el reel v6)
- Según Tomás, al reel le fue bastante bien. En Metricool todavía no aparecía el 4 de noviembre.
- En la caja de preguntas llegó: "¿Cómo surgió Monte Riko?". Se responde el miércoles 4.
- `mar-3-1.jpg`: ¿QUIÉN ESTÁ DETRÁS DE ESTO? **Ojo:** Subila antes del reel.
- **En la app:** Después de publicar, compartí el reel y escribile encima: "Te cuento cómo arrancó todo".
- `mar-3-2.jpg`: PREGUNTAME LO QUE QUIERAS. **Sticker:** Caja de preguntas: "¿Qué querés saber de Monte Riko?".

### Mié 4: Los dos alfajores (publicadas por Tomás el 4 de noviembre 2026)
- `mie-4-1.jpg`: MARPLATENSE
- `mie-4-2.jpg`: PATAGÓNICO
- `mie-4-3.jpg`: ¿CUÁL VA EN TU CAJA? **Sticker:** Encuesta: Marplatense / Patagónico.
- **En la app:** Respondé en una historia dos preguntas de ayer, con tu mano o el alfajor en la foto.
- **Respuesta a "¿cómo surgió?"** (Tomás, 4 de noviembre 2026): compartir la pregunta con "Empezó en la escuela. Te cuento la historia completa en un reel el sábado 21." Queda prometido el reel del sábado 21.

### Jue 5: Cómo pedir (publicadas por Tomás el 5 de noviembre 2026, con el carrusel)
- `jue-5-1.jpg`: PEDIR LLEVA MENOS QUE COMERTE UNO. Rehecha el 5 de noviembre 2026 con la foto `patagonico-cerrado`: el cuadro del video salía movido (Tomás). En Drive se reemplazó el 10 de noviembre 2026.
- `jue-5-2.jpg`: ARMÁS TU CAJA EN LA PÁGINA. **Ojo:** Guardala en la destacada "Pedí acá".
- `jue-5-3.jpg`: ME LLEGA POR WHATSAPP. **Sticker:** Sticker de enlace a monteriko.com.ar. Guardala en "Pedí acá".

### Vie 6: Precios y envíos (publicadas por Tomás el 6 de noviembre 2026, a la tarde)
- `vie-6-1.jpg`: PRECIOS. **Sticker:** Sticker de enlace. Guardala en la destacada "Precios".
- `vie-6-2.jpg`: LAS CAJAS VAN A TODO EL PAÍS. **Ojo:** Guardala en la destacada "Envíos".
- `vie-6-3.jpg`: ¿DESDE DÓNDE ME VES? **Sticker:** Caja de preguntas: "Decime tu ciudad".

### Lun 9: Alguien nuevo en la cocina (rehechas el 9 de noviembre 2026: anuncian el reel 3D del martes)
- `lun-9-1.jpg`: HAY ALGUIEN NUEVO EN LA COCINA. "Mañana lo conocés." El pastelero 3D con la masa, sin los textos del reel.
- `lun-9-2.jpg`: MAÑANA TE MUESTRO CÓMO SE HACE. "Un alfajor de +100 g. A las 18:00." Foto `alfajor-partido-mitades` con el filtro del dulce. El texto va más arriba para dejar lugar al contador (pedido de Tomás, 9 de noviembre 2026). **Sticker:** cuenta regresiva para mañana a las 18:00, en el hueco gris de abajo del texto.

### Mar 10: Reel 3D "Así se hace un alfajor"
**Cambio (10 de noviembre 2026, a la noche):** Tomás se olvidó de publicar ese día. El reel pasó al miércoles 11 a las 20:00 (programado en Metricool) y `mar-10-1` no se subió: la reemplaza `mie-11-0`. `mar-10-2` se sube esa noche (23 h).
- `mar-10-1.jpg`: HOY A LAS 18:00. "El pastelero nuevo te muestra cómo se hace, paso a paso." Foto `bano-chorreando` con el filtro del chocolate. Rehecha el 10 de noviembre 2026: la vieja (un cuadro borroso de la masa) no le convencía a Tomás. **Sticker:** cuenta regresiva a las 18:00 (opcional).
- **En la app:** Después de publicar, compartí el reel y escribile encima: "Así se hace, paso a paso".
- `mar-10-2.jpg`: ¿TE COMERÍAS LA TAPA SOLA? **Sticker:** Encuesta: Sí, y dos / Con dulce siempre.

### Mié 11: El horno
- `mie-11-0.jpg` (sumada el 10 de noviembre 2026, va primero, al mediodía): HOY A LAS 20:00. "El pastelero nuevo te muestra cómo se hace, paso a paso." Misma foto que `mar-10-1`, para el reel 3D que se corrió a las 20:00. Está en el repo y en Drive (no en `historias.json`). **Sticker:** cuenta regresiva a las 20:00 (opcional). Después del reel, compartilo con el texto "Así se hace, paso a paso".
- `mie-11-1.jpg`: ASÍ ENTRAN
- `mie-11-2.jpg`: ASÍ SALEN
- `mie-11-3.jpg`: ¿CUÁNTO DULCE LE PONEMOS? **Sticker:** Barra deslizante con el emoji 🤤.

### Jue 12: Reel del relleno
- `jue-12-1.jpg`: ESTO VA ADENTRO
- **En la app:** Después de publicar, compartí el reel y escribile encima: "Mirá cómo se abre al final".
- `jue-12-2.jpg`: ¿MUCHO O MUCHÍSIMO? **Sticker:** Encuesta: Mucho / Muchísimo, y abajo un sticker de enlace a monteriko.com.ar que diga "Pedí el tuyo".

### Vie 13: Por dentro
- `vie-13-1.jpg`: ESPERÁ A QUE SE ABRA
- `vie-13-2.jpg`: UN MARPLATENSE POR DENTRO
- `vie-13-3.jpg`: ¿CAJA PARA EL FINDE? **Sticker:** Encuesta: Sí / La semana que viene, y abajo un sticker de enlace a monteriko.com.ar.

### Lun 16: Las tapas
- `lun-16-1.jpg`: PLACAS Y MÁS PLACAS
- `lun-16-2.jpg`: ¿CUÁNTAS TAPAS HAY? **Sticker:** Caja de preguntas. Contalas antes y al otro día decí quién acertó.

### Mar 17: Reel de las tapas
- `mar-17-1.jpg`: UNA POR UNA
- **En la app:** Después de publicar, compartí el reel y escribile encima: "Mirá la masa al final".

### Mié 18: El chocolate
- `mie-18-1.jpg`: ACÁ MANDA EL CHOCOLATE
- `mie-18-2.jpg`: NEGRO. SIEMPRE. Rehecha el 10 de noviembre 2026: el chocolate salía verdoso.
- `mie-18-3.jpg`: ¿FINITO O BIEN GRUESO? Rehecha el 10 de noviembre 2026: el chocolate salía verdoso. **Sticker:** Encuesta: Finito / Bien grueso.

### Jue 19: El patagónico
- `jue-19-1.jpg`: PRIMERO, LA CORONA
- `jue-19-2.jpg`: DESPUÉS, EL CORAZÓN
- `jue-19-3.jpg`: ASÍ QUEDA. **Sticker:** Sticker de enlace a monteriko.com.ar.
- **En la app:** Compartí el post del día y escribile encima: "Este es el que más te sorprende".

### Vie 20: El baño
- `vie-20-1.jpg`: CADA UNO SE BAÑA A MANO
- `vie-20-2.jpg`: A SECAR
- `vie-20-3.jpg`: DESPUÉS, PAPEL DORADO. **Sticker:** Sticker de enlace a monteriko.com.ar.
- `vie-20-4.jpg`: VOS SOS NUESTRO MEJOR INFLUENCER. **Ojo:** Lo que te manden, compartilo y guardalo en la destacada "Ustedes".

### Lun 23: Fiestas
- `lun-23-1.jpg`: ¿YA PENSASTE EN LAS FIESTAS? "El sábado te muestro las cajas para regalar." Rehecha el 10 de noviembre 2026 con otra foto (la de antes era la misma del viernes 13). **Sticker:** Cuenta regresiva "Cajas para las fiestas" al sábado 28 a las 10:00: la gente toca "Recordarme" y Instagram le avisa.
- `lun-23-2.jpg`: ¿A QUIÉN LE REGALARÍAS UNA CAJA? **Sticker:** Caja de preguntas.
- `lun-23-3.jpg`: ¿DE 6 O DE 12? Rehecha el 10 de noviembre 2026. **Sticker:** Encuesta: De 6 / De 12, y abajo un sticker de enlace a monteriko.com.ar.

### Mar 24: Reel por dentro
- `mar-24-1.jpg`: ASÍ SE ABRE UN MONTE RIKO
- **En la app:** Después de publicar, compartí el reel y escribile encima: "Mirá cómo se abre".

### Mié 25: Cómo empezó
- `mie-25-1.jpg`: ESTO EMPEZÓ EN LA ESCUELA
- `mie-25-2.jpg`: HOY VAN A TODO EL PAÍS
- `mie-25-3.jpg`: ¿QUÉ QUERÉS VER DEL PROCESO? **Sticker:** Caja de preguntas.

### Jue 26: El freezer
- `jue-26-1.jpg`: NO LO COMAS TODAVÍA
- `jue-26-2.jpg`: 10 MINUTOS EN EL FREEZER
- `jue-26-3.jpg`: ¿YA LO PROBASTE ASÍ? **Sticker:** Encuesta: Sí / Hoy mismo.

### Vie 27: Auténtico marplatense
- `vie-27-1.jpg`: AUTÉNTICO MARPLATENSE
- `vie-27-2.jpg`: ¿TENÉS A ALGUIEN LEJOS DE MAR DEL PLATA?
- `vie-27-3.jpg`: MANDALE UNA CAJA. **Sticker:** Sticker de enlace a monteriko.com.ar.
