---
name: openverse
description: Buscar y bajar sonidos y música con licencia abierta desde Openverse (el banco de WordPress que junta Freesound, Jamendo, Wikimedia y otros) para ponerle sonido a un video o reel. Usala cuando haga falta un efecto (whoosh, golpe, harina, cuchillo, ambiente de cocina), una música de fondo o cualquier audio para un video de Tomás, y antes de bajar audio de cualquier otro lado.
---

# Openverse: sonidos con licencia abierta

Skill propia del Cerebro (octubre 2026). Openverse no tiene skill ni servidor oficial: se usa su API pública, sin cuenta ni clave.

## Buscar
```bash
curl -s -m 40 -A "CerebroDeClaude/1.0" "https://api.openverse.org/v1/audio/?q=<términos en inglés>&page_size=20"
```
- Términos en inglés y cortos: `whoosh`, `flour`, `rolling pin`, `kitchen ambience`, `knife cut`, `paper rustle`, `pop`.
- Filtros útiles: `category=sound_effect` o `category=music`; `source=freesound` o `source=jamendo`; `extension=wav`.
- La API es lenta y a veces devuelve 504 o se corta: probá otra vez la misma búsqueda, y si sigue fallando sacá filtros (el filtro `license_type` es el que más se cuelga; filtrá la licencia vos con el campo `license` del resultado).
- Sin cuenta hay un límite de búsquedas por día: buscá con criterio, no en bucle.

Cada resultado trae `title`, `url` (el archivo para bajar), `license`, `license_version`, `creator`, `source`, `duration` (milisegundos) y `attribution` (el crédito ya armado).

## Licencias (Monte Riko es una marca: el uso es comercial)
- Sí: `cc0`, `pdm` (dominio público) y `by` (pide crédito). `by-sa` solo si Tomás acepta que el video quede bajo la misma licencia.
- No: todo lo que tenga `nc` (no comercial) o `nd` (sin cambios: no se puede cortar ni mezclar).
- Guardá el texto de `attribution` de cada sonido usado en las notas del reel (`monte-riko/reels/<reel>.md`) y, si la licencia es `by`, en la descripción del post.

## Bajar y revisar
- Bajá el archivo a la carpeta de trabajo de la sesión (no al Cerebro), uno por carpeta.
- Antes de usarlo, medilo y revisalo: con `earshot describe` / `earshot find` (para recortar el mejor momento) o, como mínimo, `ffprobe` y el volumen con `ffmpeg -af ebur128`.
- Para elegir qué sonido va en cada momento del video, seguí la skill `real-sound`: Openverse es una fuente más, junto con Freesound y Mixkit.
