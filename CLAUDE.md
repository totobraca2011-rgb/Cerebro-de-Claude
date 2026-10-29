# Cerebro de Claude

Lo que Claude tiene que saber de Tomás Bracamonte y de lo que hace, en un solo lugar. Tomás agrega este repo a cada sesión para que Claude no arranque de cero.

## Al empezar cada sesión
1. Leé `yo/perfil.md`: quién es Tomás y cómo trabaja con vos. Vale para todo, también para los otros repos.
2. Según el pedido, leé la carpeta que corresponda:
   - `monte-riko/`: la marca, los productos y precios, el material original y la página web.
   - `diseno/`: cómo se trabaja el diseño, el kit y los gustos de Tomás.
3. Si algo de acá contradice lo que pide Tomás, preguntale. No inventes datos que no estén escritos.

## Guardar lo nuevo (lo más importante)
Este repo se llena a medida que trabajamos. Cuando Tomás te pase información, un archivo o una decisión que sirva para más adelante:
1. Guardalo en la carpeta que corresponda. Si es un dato suelto, sumalo al archivo `.md` que ya existe. Si es un tema nuevo, creá un `.md` nuevo y anotalo en el `README.md` de esa carpeta.
2. Escribí con fecha (por ejemplo, "octubre 2026") lo que cambia con el tiempo: precios, decisiones, pendientes.
3. Si un dato nuevo reemplaza a otro, corregí el viejo. No dejes las dos versiones.
4. Hacé commit y push a `main` en el momento, con un mensaje en castellano que diga qué se guardó.
5. Avisale a Tomás en una línea qué guardaste y dónde.

Lo que se dice en el chat se pierde al cerrar la sesión: solo queda lo que se guarda acá.

## Skills
Las skills de `.claude/skills/` se cargan solas con este repo (la lista y el origen están en su `README.md`).
- **Instagram (`ig-*`):** donde digan `~/.claude/instagram/voice.md`, usá `monte-riko/instagram-voz.md`. Escribí siempre en castellano rioplatense con voseo: los ganchos y el humanizador vienen pensados en inglés, así que adaptá la idea, no la traduzcas. Si Tomás completa algo de su voz, guardalo en ese archivo.
- **`ig-viral`:** desde la nube no se puede entrar a la cuenta de Instagram de Tomás. Pedile links o capturas, o usá YouTube Shorts, que es público.
- **`video-lens`:** necesita `youtube-transcript-api` y `yt-dlp` de Python. Si faltan, instalalos con permiso de Tomás. YouTube a veces bloquea servidores en la nube: si falla, decíselo y pedile la transcripción.
- **Pasar audio a texto (Whisper):** no es una skill; se instala en el momento: `python3 -m venv <scratchpad>/whisper/venv && <venv>/bin/pip install faster-whisper` y modelo `medium` en español. El modelo baja de huggingface.co (la red del entorno tiene que permitirlo). Pasale el audio ya convertido con ffmpeg (`-ac 1 -ar 16000 -f s16le`) como arreglo de numpy: abrir el video directo falla por una versión de `av`. Así se transcribieron los reels de octubre 2026.
- **Herramientas de video** (octubre 2026; se instalan en cada sesión porque la nube se borra):
  - FFmpeg viene instalado.
  - yt-dlp (bajar videos o subtítulos de YouTube): `pip install --user yt-dlp`.
  - HyperFrames: el programa corre con `npx hyperframes` (necesita Node 22+). Antes del primer render: `npx hyperframes browser ensure`. Docker no hace falta para renderizar en la compu.
- Antes de sumar una skill nueva, explicale a Tomás qué hace y si le sirve, revisá el código y anotala en `.claude/skills/README.md`.

## Task Observer
Instalado a pedido de Tomás (octubre 2026), aunque hoy no lo usa mucho. Aprende de cómo trabajamos y propone mejoras a las skills. Su registro vive en `task-observer/`.
- Esta sesión corre en la nube y se borra: cada vez que escribas algo en `task-observer/`, hacé commit y push a `main` en ese momento, igual que con el resto del Cerebro.
- Hablale a Tomás de lo que registra solo en una línea y sin tecnicismos. Las mejoras a las skills se proponen en la revisión semanal y se aplican solo si Tomás dice que sí.

```text
(task-observer activation block — template of v3.8.1)
Before the first tool call of any session — and before writing or
proposing a plan, not merely before executing one — invoke the
task-observer skill AND execute its Session Start Protocol (storage
check, frontmatter scan, review trigger). Loading the skill and running
the protocol are separate steps; a session that loads the file and stops
has activated nothing. Any turn that will involve a tool call counts; do
not classify the session as "too simple" from its opening message.
A step you did not run is reported before the answer, in one line — never
after it, where it reads as a suggestion. If the skill does not resolve on
this turn, say which probe told you so (the skill listing, or the skill
directory on disk), re-check the listing on every later turn that makes a
tool call, and run the protocol the first time it resolves — a "not
installed" verdict holds for one turn.

Select skills on the DECISION the request is about, not on the artefact it
arrived as. Name what the user is deciding, then match the installed skill
descriptions against that — a request handed over as a file to review
still needs the skill whose description names its subject.

After completing each task, list the observation records written this
session in the same turn and report a one-line summary from that listing
(ids and titles, or "none logged and why") — never from memory of
writing them. This is the activation backstop: it forces a look at the log,
so a session that silently skipped the protocol is discovered at the
first task boundary instead of never.

Loading a skill is not complete until you have queried the observation
log for OPEN observations naming it and read their bodies:
  find "/home/user/cerebro-de-claude/task-observer/skill-observations/observation-log" -maxdepth 1 \
    -name '*.md' -exec grep -l -E "^(skill|target_file):.*<skill-name>" {} +
(<skill-name> is the bare name: drop a plugin: prefix, up to the last
colon. A qualified pattern misses every entry filed under the bare name
and reports a clean zero; the bare one matches both spellings. For an
agent definition or instructions file it is the file name, which the
target_file: field carries by any path.)
(Use find, not a bare *.md glob: under zsh an unmatched glob aborts the
whole block, and on an empty log it is unmatched in every session.)
Apply their insights to the current work — meaning: let them change what
you do in THIS task. Editing the skill file, or writing the rule into any
other file a later session reads, is acting on the observation and waits
for the review. See "Log, don't act" in SKILL.md: the test is whether the
action leaves a durable change outside the observation log. Run this at every skill load, however many skills load
in one session. The session-start scan does not cover it: that is a
frontmatter sweep over every observation at session start, this is a
body-level lookup for one skill at the moment its rules are applied.

The converse holds too: the grep, and any checkpoint line recording the
load, run only in the same batch as the Skill invocation, and take the
skill name from a load that has actually happened — never from a list of
skills you built to load. A checkpoint line written without the load is a
false record. Before writing to any file a skill reads at run time (a
state file), load that skill: a state file that describes itself is not a
substitute for the skill that owns it.

Where scripts run, the lookup and its checkpoint line are one command:
  bash "/home/user/cerebro-de-claude/.claude/skills/task-observer/scripts/skill-load.sh" "/home/user/cerebro-de-claude/task-observer" <skill-name>
The Skill invocation and that call are ONE batch — emit them together,
one call per skill loaded, never the call in a later batch. On a first
run the log does not exist yet (step 1 creates it): the call says so and
exits 0 with no checkpoint line; re-run it once per skill loaded in that
batch after the Workspace creation command.

The task-observer workspace for this project is:
  /home/user/cerebro-de-claude/task-observer
It does not exist until the first session creates it: a failed probe whose
parent resolves and is writable is a first run — run Workspace creation,
then re-run the lookup above once per skill loaded in that batch (on the
first batch it finds no log and writes no checkpoint line; that is expected).
Every path the skill uses derives from that root and nothing else:
  /home/user/cerebro-de-claude/task-observer/skill-observations/observation-log/   (the log)
  /home/user/cerebro-de-claude/task-observer/skill-observations/cross-cutting-principles.md
  /home/user/cerebro-de-claude/task-observer/skill-updates/                        (staging root)
  /home/user/cerebro-de-claude/task-observer/skill-updates/PENDING.md              (staging manifest)
Never resolve any of them from the current working
directory — a cwd inside an ephemeral checkout (a git worktree, a temporary
clone) is torn down and takes the log with it. Never place the workspace
inside a skills-discovery directory or any path linked into one. If this
environment mints a separate project identity per checkout, or more than
one agent works this project, the pinned path above is the single shared
location; do not derive one per session, tool or project.

The user's repositories live under:
  /home/user
(the root the sibling check sweeps before declaring a skill absent;
observation-log.md, "Skill families and the sibling check").

A subagent dispatched by a session that already runs this protocol does
not run it again and does not write to the log. The controller observes,
because only it sees the whole task and its review; a subagent that
notices something worth logging says so in its final report, and the
controller writes it, running the id snippet per write. A start-up rule
in a project file reaches every agent whose working folder is inside the
project — a subagent, or a session started there. When this session starts
another session (not a subagent), pass it a working folder inside the
project, or the workspace root, so the block is in context from its first
turn; a folder named only in the brief does not load it.
Before briefing a delegate under an agent definition or instructions
file, run the lookup for that file's name; its open entries shape the
brief.

A run of this block that cannot write here or get an approval answered —
a child run with no protocol-running caller, a job with a narrow tool
allowlist, a scheduled task in default permission mode — skips the write
steps, never stalls on them, and ends its final message with a
`## Task-observer notes` section (environments.md, "Sessions whose
output channel is owned by a caller"). Such runs write their output to:
  none

An observation file comes into being only through
  bash "/home/user/cerebro-de-claude/.claude/skills/task-observer/scripts/new-observation.sh" <slug> "/home/user/cerebro-de-claude/task-observer"
which prints the path to write into. Never by copying another file's
header or counting a listing — including on the turn after a
compaction, when the skill body is out of context.
```

## Qué no va
- Contraseñas, claves, tokens, datos de tarjetas ni documentos de identidad. Aunque el repo sea privado, eso no se guarda.
- Datos de clientes o de otras personas.
- Copias del código de otros repos: acá va el resumen y el link.
