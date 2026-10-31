# La compu de Tomás y cómo trabaja Claude con ella

Armado el 30 de octubre de 2026.

## Su compu
- Usa **Windows**.
- Tiene instalados (octubre 2026): la app de escritorio de Claude, la extensión **Claude** de Chrome (con su cuenta) y **GitHub Desktop**.
- El Cerebro está clonado con GitHub Desktop, en `Documentos\GitHub\Cerebro-de-Claude` salvo que lo haya cambiado.

## Dos formas de trabajar
| | Sesión en la nube (claude.ai/code) | Sesión local (app de escritorio, en su compu) |
|---|---|---|
| Sigue trabajando si Tomás se va o apaga la compu | Sí | No: la compu tiene que estar prendida |
| Puede manejar su Chrome (Instagram, etc.) | No | Sí, con la extensión y `/chrome` |
| Lee el Cerebro | Sí | Sí, la copia clonada |

- **Nube:** para dejar trabajo hecho mientras no está (análisis, textos, planes, video, página).
- **Local:** para hacer cosas en su Chrome con él mirando, por ejemplo cambiar la bio de Instagram.
- Una sesión de la nube **no se puede conectar con su compu**: Remote Control solo anda con Mac o Linux (octubre 2026).

## Cómo abrir la sesión local con Chrome
1. En GitHub Desktop, apretar **Fetch origin** y después **Pull**, para traer lo último que se guardó desde la nube.
2. En la app de Claude: pestaña **Code** → sesión nueva **local** → carpeta del Cerebro.
3. Con Chrome abierto y la extensión con su cuenta, escribir `/chrome` en la sesión.
4. Prueba rápida: "abrí instagram.com en Chrome y decime cuántos seguidores tiene monteriko.oficial".

Si la sesión local guarda algo en el Cerebro, tiene que hacer commit a `main`. La subida la hace Tomás (octubre 2026): `git` no está instalado aparte, se usa el que viene con GitHub Desktop (`%LOCALAPPDATA%\GitHubDesktop\app-*\resources\app\git\cmd\git.exe`), y desde Claude ese `git` no tiene permiso para subir a GitHub. Hay que pedirle que apriete **Push origin** en GitHub Desktop.

## Reglas para manejar su Chrome
- Solo con Tomás presente. Antes de cada cambio en su cuenta, pedirle permiso.
- Pocos cambios por vez: muchos movimientos rápidos pueden hacer que Instagram crea que es un robot.
- Nunca pedirle ni guardar contraseñas.

## Voz (octubre 2026)
Tomás prefiere escuchar en vez de leer todo. Para hablar usa Windows + H, y en esta compu las respuestas de Claude se leen con ElevenLabs (plan gratis). No es una charla de ida y vuelta.
- Se lee el comienzo de cada respuesta, hasta 400 caracteres: lo más importante tiene que ir al principio, en frases que se entiendan al oído.
- Está en `C:\Users\MARCOS\.claude\voz\`, fuera del repo: `hablar.ps1` (lector), `config.json` (voz, modelo y largo) y `clave.txt` (la clave, que nunca va al Cerebro). Lo dispara un hook Stop en `~/.claude/settings.json`.
- Si ElevenLabs falla, habla la voz de Windows y el error queda en `error.log`. Para apagarlo, se vacía `clave.txt`.
- En el plan gratis, por la clave se ven 21 voces en inglés o británicas que también hablan español. Ninguna tiene acento argentino. Tomás eligió George (31 de octubre 2026) y confirmó que suena sola al terminar cada respuesta.

## Video (31 de octubre 2026)
- FFmpeg está instalado en la compu con winget. Node 26 está en `%LOCALAPPDATA%\Programs\node-v26.13.0-win-x64`, sin permisos de administrador, y se suma al PATH en las sesiones nuevas. Python común no; Claude-Mem usa uno propio, con `uv`.
- **La app de Claude esconde lo que guarda en `AppData`** (probado el 31 de octubre 2026): lo manda a una carpeta suya (`AppData\Local\Packages\Claude_pzs8sxrjxfjjc\LocalCache`), y algunos programas después no lo encuentran. Por eso Remotion no arrancaba desde la carpeta temporal de la sesión y sí desde `C:\Users\MARCOS\`. Los proyectos de video van fuera de `AppData`.
- **Las tomas del iPhone vienen en HDR** (probado el 31 de octubre 2026): hay que pasarlas a color normal antes de editar, o se ven mal y Remotion puede fallar. Con FFmpeg: `zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p`.
- **La compu se queda sin memoria con video pesado:** convertir de a un archivo por vez y renderizar con Remotion por tramos de 120 cuadros, cada uno en su propia corrida, con `npx remotion bundle` una vez y después `--frames=A-B --concurrency=2 --offthreadvideo-threads=1 --offthreadvideo-cache-size-in-bytes=200000000`; al final se unen con FFmpeg. De una sola tirada falla al azar (31 de octubre 2026: dos renders anduvieron y cuatro no); por tramos salió a la primera. Un reel de 46 s tarda unos 10 minutos.
- Para Python de video (transcribir o recortar siluetas): `uv` con `UV_PYTHON_INSTALL_DIR` y `UV_CACHE_DIR` fuera de `AppData`. `yt-dlp` corre con `uvx yt-dlp` y baja reels públicos de Instagram sin iniciar sesión. Openverse limita las búsquedas seguidas: con `license=cc0` responde mejor.
- La carpeta de trabajo de los reels es `C:\Users\MARCOS\reel-v2\` (fuera del Cerebro, porque pesa mucho).
- Tomás tiene CapCut 8.3 con plan pago, pero no tiene tiempo de editar: los reels los edita Claude con FFmpeg y Tomás los revisa.
- No hay conexión oficial de Claude con CapCut. Existen conectores no oficiales (por ejemplo `jmsldrn/capcut-mcp`), que dependen de un formato de proyecto sin documentar y no se probaron con esta versión.

## Conexiones
- **Metricool** (conectado el 30 de octubre 2026, cuenta monteriko.oficial, hora de Buenos Aires): estadísticas de los posts, mejores horarios y posts programados. Funciona desde la nube. Los posts que prepare Claude van como **borrador**: no se publica nada sin que Tomás lo apruebe.
- Ningún programa puede cambiar la bio, las destacadas ni el orden del feed por su cuenta: eso se hace en la app o con la sesión local en Chrome.
- **Qué se puede desde Chrome (octubre 2026):** la bio (Editar perfil) y el nombre (Centro de cuentas, que a veces cuelga la pestaña aunque guarde). Desde la compu **no** se puede cambiar el link, fijar ni archivar: eso va en la app del celu. Tampoco conviene editar destacadas: la lista de historias aparece vacía y se podría vaciar.
- **Metricool (octubre 2026):** no trae estadísticas de lo publicado antes de conectarse. Para cargar un post necesita la foto o el video en un link público: las fotos de monteriko.com.ar sirven; los videos del repo no, porque es privado.
