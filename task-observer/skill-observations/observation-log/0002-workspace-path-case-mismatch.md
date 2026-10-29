---
id: 2
title: "La ruta fija del Task Observer en CLAUDE.md no coincide en mayúsculas con la carpeta real del repo"
status: open
type: internal
skill: [task-observer]
proposes_skill: []
target_file: ["CLAUDE.md"]
siblings_checked: "none — no skill family; the path is pinned in the project instructions file"
area: "Bloque de activación del Task Observer en CLAUDE.md (ruta del workspace)"
date: 2026-10-29
session_context: "Cambio del armador de pedidos de la página de Monte Riko (octubre 2026)"
parked_until:
resolved:
resolution:
reference:
commands_verified: "run: ls /home/user → only Cerebro-de-Claude exists; /home/user/cerebro-de-claude does not resolve"
---

**Issue:** El bloque de activación de CLAUDE.md fija el workspace en `/home/user/cerebro-de-claude/task-observer` (minúsculas), pero el repo se clona en `/home/user/Cerebro-de-Claude` (como el nombre de GitHub). En Linux son rutas distintas: la ruta fija no existe, y el protocolo, leído al pie de la letra, mandaría a crear un workspace nuevo fuera del repo, que no se commitea y se pierde al cerrar la sesión. En esta sesión se usó a mano la carpeta real `task-observer/` del repo.

**Suggested improvement:** Corregir en CLAUDE.md todas las rutas del bloque a `/home/user/Cerebro-de-Claude/...`, o escribirlas relativas a la raíz del repo resuelta con `git rev-parse --show-toplevel`.

**Principle:** Una ruta absoluta fija en las instrucciones tiene que coincidir byte a byte con la carpeta real, mayúsculas incluidas. Si la sonda falla, primero hay que buscar una variante con otras mayúsculas o el workspace dentro del repo, y recién después crear uno nuevo.
