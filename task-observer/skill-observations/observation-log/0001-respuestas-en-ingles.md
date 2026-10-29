---
id: 1
title: "Respuestas en inglés a un usuario que pidió castellano, a mitad de sesión"
status: open
type: internal
skill: []
proposes_skill: []
target_file: ["yo/perfil.md", "CLAUDE.md"]
siblings_checked: "none — no skill family; the rule lives in instruction files, not a skill"
area: "Idioma de las respuestas al usuario"
date: 2026-10-29
session_context: "Edición de un reel del proceso de la masa (octubre 2026); ver monte-riko/reels/proceso-masa.md"
parked_until:
resolved:
resolution:
reference:
commands_verified: none
---

**Issue:** Las instrucciones del proyecto (CLAUDE.md de Monte-Riko y yo/perfil.md) dicen que a Tomás se le habla siempre en castellano rioplatense. Las primeras respuestas salieron en castellano, pero después de varias vueltas de trabajo técnico con herramientas (ffmpeg, scripts), tres respuestas seguidas al usuario salieron en inglés. Tomás tuvo que pedir "acordate de no hablarme en inglés pq no entiendo". La regla estaba escrita y cargada en el contexto; no había ningún control que la hiciera cumplir.

**Suggested improvement:** Una barrera estructural en vez de otra frase: por ejemplo, un hook de fin de turno que revise si la respuesta final al usuario está en inglés y avise antes de mandarla. Si no se puede, como mínimo una línea en yo/perfil.md que diga que la regla también vale en sesiones largas y técnicas, que es donde falla.

**Principle:** Una regla de idioma escrita en el contexto se cumple al principio y se pierde en sesiones largas con mucho trabajo técnico en otro idioma (los comandos y lo que devuelven las herramientas). Necesita un control automático, no solo estar escrita.
