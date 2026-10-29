# Skills del Cerebro

Se cargan solas cuando este repo está en la sesión. Copias revisadas el 27 de octubre de 2026; cada carpeta conserva su licencia.

| Skill | Para qué | Origen (versión) · licencia |
|---|---|---|
| `grill-me`, `grilling` | Entrevistar a Tomás de a tandas hasta que el pedido quede claro | [mattpocock/skills](https://github.com/mattpocock/skills) `59db609` · MIT |
| `ig-*` (13) | Instagram: reels, ganchos, descripciones, carruseles, historias, perfil, plan semanal, comentarios, respuestas, mensajes, reciclar contenido, auditoría, humanizador. Solo escriben borradores: nada se publica sin Tomás | [Jakeschincariol/instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill) `d03c56b` · MIT |
| `web-design-guidelines` | Revisar una página contra las guías de interfaz de Vercel | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) `6ec2693` · MIT |
| `video-lens` | Resumir un video de YouTube con puntos clave y minutos | [kar2phi/video-lens](https://github.com/kar2phi/video-lens) `e2be9cd` · MIT |
| `task-observer` | Aprende de cómo trabajamos, registra correcciones y propone mejoras a las skills en una revisión semanal. Se activa al inicio de cada sesión; su registro está en `task-observer/` | [rebelytics/one-skill-to-rule-them-all](https://github.com/rebelytics/one-skill-to-rule-them-all) `ba696b2` (v3.8.1) · CC BY 4.0, de Eoghan Henn y colaboradores |
| `hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `media-use` | HyperFrames de HeyGen: arma y renderiza videos con textos animados, subtítulos, transiciones y gráficos (unos 450 bloques listos), y consigue o arregla el material (música, voz, color). Sin cuenta ni clave para lo básico; las funciones de HeyGen en la nube sí piden cuenta | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) `17ffe47` · Apache 2.0 |
| `claude-automation-recommender` | Plugin "Claude Code Setup" de Anthropic: lee un proyecto y recomienda avisos automáticos, skills, ayudantes y conexiones. Solo recomienda, no toca nada | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) `f8c5e7a` · Apache 2.0 |

Para actualizar una: volver a bajar el repo de origen, revisar qué cambió y reemplazar la carpeta.

## Pendiente
- **Video Use** ([browser-use/video-use](https://github.com/browser-use/video-use)), para editar reels (octubre 2026): Tomás ya creó la cuenta en ElevenLabs. Falta crear la clave (solo con permiso "Speech to Text") y cargarla en el entorno como `ELEVENLABS_API_KEY`, nunca en el chat ni en el repo. Lo dejó para más adelante: cuando la retome, instalarla y probarla con un reel suyo.
- **Para cuando Tomás use Claude Code en su compu** (octubre 2026): en la nube no sirven, así que se dejaron para ese momento. Si Tomás avisa que está trabajando desde su compu, recordarle estos dos:
  - **Claude-Mem** ([thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)): memoria entre sesiones. Guarda todo en la compu. No activar la copia en su nube (cmem.ai) sin que Tomás lo decida.
  - **Headroom** ([chopratejas/headroom](https://github.com/chopratejas/headroom)): achica lo que se manda a Claude para gastar menos.
- **Descartados** (octubre 2026): OmniRoute (manda los pedidos a otras IAs; Tomás ya paga Claude). Task Observer se instaló igual a pedido de Tomás.
