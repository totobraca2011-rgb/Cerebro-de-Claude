---
id: 5
title: "En la nube Freesound no deja bajar: real-sound y openverse lo dan como fuente principal; Mixkit por etiquetas sí anda"
status: open
type: internal
skill: [real-sound, openverse]
proposes_skill: []
target_file: []
siblings_checked: "sonido: real-sound, openverse, earshot — earshot excluido (no busca ni baja sonidos, solo escucha; earshot/SKILL.md)"
area: "Paso 2 (sourcing) de real-sound y sección Bajar de openverse"
date: 2026-11-05
session_context: "Sonido del reel 3D de Monte Riko (monte-riko/reels/alfajor-3d.md, 5 de noviembre 2026)"
parked_until:
resolved:
resolution:
reference:
commands_verified: "run: curl a cdn.freesound.org y freesound.org desde la nube → 403 de la página (no del proxy); casi todos los resultados de Openverse apuntan a cdn.freesound.org. run: curl -L https://mixkit.co/free-sound-effects/<etiqueta>/ → 200, y los WAV de assets.mixkit.co bajan bien"
---

**Issue:** En una sesión en la nube, Freesound devuelve 403 a cualquier descarga, también a los links que trae Openverse. real-sound pone a Freesound primero en el sourcing, y openverse no avisa que esos links fallan en la nube, así que se pierde tiempo antes de cambiar de fuente. Sin pasar `-L`, las etiquetas de Mixkit devuelven 0 bytes porque redirigen (por ejemplo `/fridge/`).

**Suggested improvement:** En real-sound (paso 2) y en openverse ("Bajar y revisar"), agregar que en la nube Freesound no deja bajar: hay que usar Mixkit con las páginas `mixkit.co/free-sound-effects/<etiqueta>/` y `curl -L`, sacar los ids de `data-audio-player-preview-url-value` y bajar el WAV de `assets.mixkit.co/active_storage/sfx/<id>/<id>.wav`. Freesound queda para la sesión local, desde la compu de Tomás.

**Principle:** Una skill que depende de una fuente de internet tiene que decir en qué entornos esa fuente responde y cuál es el reemplazo, para no descubrirlo en cada sesión.
