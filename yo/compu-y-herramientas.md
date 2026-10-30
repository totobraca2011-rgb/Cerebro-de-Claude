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

Si la sesión local guarda algo en el Cerebro, tiene que hacer commit y push a `main` igual que la de la nube.

## Reglas para manejar su Chrome
- Solo con Tomás presente. Antes de cada cambio en su cuenta, pedirle permiso.
- Pocos cambios por vez: muchos movimientos rápidos pueden hacer que Instagram crea que es un robot.
- Nunca pedirle ni guardar contraseñas.

## Conexiones
- **Metricool** (conectado el 30 de octubre 2026, cuenta monteriko.oficial, hora de Buenos Aires): estadísticas de los posts, mejores horarios y posts programados. Funciona desde la nube. Los posts que prepare Claude van como **borrador**: no se publica nada sin que Tomás lo apruebe.
- Ningún programa puede cambiar la bio, las destacadas ni el orden del feed por su cuenta: eso se hace en la app o con la sesión local en Chrome.
