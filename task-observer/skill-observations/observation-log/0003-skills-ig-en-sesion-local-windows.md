---
id: 3
title: "Las skills ig-* no contemplan la sesión local de Windows: sin Python para sus revisores y con una regla contra entrar a la cuenta"
status: open
type: internal
skill: [ig-profile, ig-human, ig-caption]
proposes_skill: []
target_file: []
siblings_checked: "familia ig-*: ig-human e ig-caption agregadas porque traen scripts de Python; ig-carousel e ig-plan no tienen scripts (leídas); las demás assumed"
area: "Requisitos para correr y regla de entrada de ig-profile"
date: 2026-10-30
session_context: "Ordenar el Instagram de Monte Riko y planificar noviembre 2026, desde la sesión local con Chrome"
parked_until:
resolved:
resolution:
reference:
commands_verified: "run: python --version → sin Python instalado, solo el acceso a Microsoft Store"
---

**Issue:** En la compu de Tomás no hay Python, así que `humanize.py`, `detect.py` y `caption.py` no corrieron y los textos de noviembre salieron sin esa revisión automática. Además, ig-profile dice "Do not log into Instagram on their behalf", pero el proyecto usa justamente una sesión local con Chrome, con la sesión de Tomás ya abierta. Tampoco avisa qué se puede hacer en la web: el link, fijar y archivar solo se pueden desde la app.

**Suggested improvement:** En ig-human e ig-caption, decir qué hacer si no hay Python (instalarlo con permiso o aplicar la lista de `slop.json` a mano). En ig-profile, aclarar que no se piden contraseñas pero se puede usar una sesión ya abierta si la persona lo pide, y sumar qué cosas solo se cambian desde el celu.

**Principle:** Una skill que depende de un programa tiene que decir qué hacer cuando ese programa no está, y sus reglas de seguridad tienen que distinguir entre pedir una contraseña y usar una sesión que la persona ya abrió.
