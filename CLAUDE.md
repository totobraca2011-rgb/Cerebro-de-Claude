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
- Antes de sumar una skill nueva, explicale a Tomás qué hace y si le sirve, revisá el código y anotala en `.claude/skills/README.md`.

## Qué no va
- Contraseñas, claves, tokens, datos de tarjetas ni documentos de identidad. Aunque el repo sea privado, eso no se guarda.
- Datos de clientes o de otras personas.
- Copias del código de otros repos: acá va el resumen y el link.
