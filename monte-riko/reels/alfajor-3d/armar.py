# Arma index.html del reel 3D "Así se hace un alfajor" (8 pasos, 36 s).
# Los textos se escriben en el HTML (uno por clip, con id fijo) y la escena 3D va en escena.js.
import pathlib, html

AQUI = pathlib.Path(__file__).parent
DUR = 36

# Subtítulos: (inicio, fin, texto, palabras clave en naranja)
SUBS = [
    (0.0, 1.0, "Así se hace", []),
    (1.0, 2.0, "un alfajor", ["alfajor"]),
    (2.0, 3.6, "Primero, la masa", ["masa"]),
    (3.6, 4.8, "derecho al freezer", ["freezer"]),
    (4.8, 6.0, "una noche o más", ["noche"]),
    (6.0, 7.4, "La saco", []),
    (7.4, 8.8, "y la estiro", ["estiro"]),
    (8.8, 10.0, "hasta 5 milímetros", ["5"]),
    (10.0, 11.4, "Salen las tapas", ["tapas"]),
    (11.4, 12.6, "a la heladera", ["heladera"]),
    (12.6, 14.0, "media hora", ["media"]),
    (14.0, 15.2, "De la heladera", []),
    (15.2, 16.6, "directo al horno", ["horno"]),
    (16.6, 18.0, "y a enfriar", []),
    (18.0, 19.4, "55 gramos", ["55"]),
    (19.4, 20.4, "de dulce de leche", ["dulce"]),
    (20.4, 22.0, "panza para adentro", ["panza"]),
    (22.0, 23.4, "Otra vez al frío", ["frío"]),
    (23.4, 24.8, "así el dulce", []),
    (24.8, 26.0, "no se escapa", ["escapa"]),
    (26.0, 27.4, "Chocolate semiamargo", ["semiamargo"]),
    (27.4, 28.6, "a 45 grados", ["45"]),
    (28.6, 30.0, "y abajo, otra vez", []),
    (30.0, 31.3, "Papel dorado", ["dorado"]),
    (31.3, 32.6, "y la corona", ["corona"]),
    (32.6, 34.0, "Listo para vos", ["vos"]),
]
# Tarjeta del paso: (inicio, fin, número, nombre)
PASOS = [
    (2.3, 6.0, 1, "La masa"), (6.3, 10.0, 2, "Estirar"), (10.3, 14.0, 3, "Al frío"),
    (14.3, 18.0, 4, "Horno"), (18.3, 22.0, 5, "Relleno"), (22.3, 26.0, 6, "A orear"),
    (26.3, 30.0, 7, "El baño"), (30.3, 34.0, 8, "Envolver"),
]
# Dato grande en la escena: (inicio, fin, texto)
DATOS = [
    (4.8, 6.0, "UNA NOCHE"), (8.8, 10.0, "5 MM"), (12.4, 14.0, "30 MIN"), (15.0, 17.0, "160 °C · 8 MIN"),
    (18.4, 20.2, "55 G"), (23.2, 25.4, "BIEN FRÍOS"), (27.2, 28.8, "45 °C"), (30.3, 31.6, "PAPEL DORADO"),
]

def r(x):
    return f"{x:g}"

clips, anim = [], []
for i, (a, b, txt, claves) in enumerate(SUBS, 1):
    spans = []
    for j, w in enumerate(txt.split(" "), 1):
        limpio = w.strip(",").lower()
        cls = ' class="clave"' if limpio in [c.lower() for c in claves] else ""
        spans.append(f'<span id="s{i}w{j}"{cls}>{html.escape(w)}</span>')
        if not (i == 1):
            anim.append(f'pop("#s{i}w{j}", {r(a + 0.12 * (j - 1))});')
    clips.append(f'<div id="sub-{i}" class="sub clip" data-start="{r(a)}" data-duration="{r(round(b - a, 3))}" data-track-index="2">{" ".join(spans)}</div>')
anim.append('tl.fromTo("#sub-1 span", { scale: 1 }, { scale: 1.08, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1, stagger: 0.12 }, 0.15);')

for (a, b, n, nombre) in PASOS:
    clips.append(
        f'<div id="paso-{n}" class="paso clip" data-start="{r(a)}" data-duration="{r(round(b - a, 3))}" data-track-index="3">'
        f'<div id="paso-{n}-caja" class="paso-caja"><div id="paso-{n}-num" class="paso-num">{n}</div>'
        f'<div class="paso-txt"><small>PASO</small><b>{html.escape(nombre)}</b></div></div></div>')
    anim.append(f'tl.fromTo("#paso-{n}-caja", {{ scale: 0.6, opacity: 0, y: -40 }}, {{ scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.8)" }}, {r(a)});')
    anim.append(f'tl.fromTo("#paso-{n}-num", {{ rotation: -90 }}, {{ rotation: 0, duration: 0.45, ease: "power3.out" }}, {r(a + 0.05)});')

for k, (a, b, txt) in enumerate(DATOS, 1):
    clips.append(f'<div id="dato-{k}" class="dato clip" data-start="{r(a)}" data-duration="{r(round(b - a, 3))}" data-track-index="4"><span id="dato-{k}-t">{html.escape(txt)}</span></div>')
    anim.append(f'tl.fromTo("#dato-{k}-t", {{ scale: 0.3, opacity: 0, rotation: -14 }}, {{ scale: 1, opacity: 1, rotation: -4, duration: 0.3, ease: "back.out(2.6)" }}, {r(a)});')

clips.append('<div id="cierre" class="cierre clip" data-start="34" data-duration="2" data-track-index="5">'
             '<div id="cierre-caja" class="cierre-caja"><small>Pedilo en</small><b>monteriko.com.ar</b></div></div>')
anim.append('tl.fromTo("#cierre-caja", { scale: 0.6, opacity: 0, y: 40 }, { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.8)" }, 34);')

escena = (AQUI / "escena.js").read_text(encoding="utf-8")
doc = f'''<!doctype html>
<html lang="es" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <!-- Reel 3D "Así se hace un alfajor" (Monte Riko, noviembre 2026). Lo arma armar.py: los textos salen de ahí. -->
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      :root {{ --naranja: #ff6900; --negro: #000000; --arena: #ebd9c5; }}
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: #2a1a12; }}
      #root {{ position: relative; width: 100%; height: 100%; font-family: "Montserrat", sans-serif; }}
      #escena {{ position: absolute; inset: 0; width: 1080px; height: 1920px; display: block; }}
      /* Subtítulo palabra por palabra, blanco grueso con borde negro (como los de referencia) */
      .sub {{ position: absolute; left: 0; right: 0; top: 1190px; text-align: center; z-index: 5; }}
      .sub span {{ display: inline-block; margin: 0 0.14em; font-weight: 900; font-size: 92px; color: #fff; letter-spacing: -0.01em;
        -webkit-text-stroke: 10px #000; paint-order: stroke fill; text-shadow: 0 8px 0 rgba(0,0,0,.35); }}
      .sub span.clave {{ color: var(--naranja); }}
      /* Tarjeta del paso */
      .paso {{ position: absolute; left: 140px; right: 140px; top: 250px; z-index: 6; display: flex; justify-content: center; }}
      .paso-caja {{ display: flex; align-items: center; gap: 26px; background: #fffaf3; border-radius: 30px; padding: 26px 40px 26px 30px; box-shadow: 0 18px 40px rgba(0,0,0,.35); }}
      .paso-num {{ width: 92px; height: 92px; border-radius: 50%; background: var(--naranja); color: #1d120c; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 54px; }}
      .paso-txt small {{ display: block; font-weight: 700; font-size: 30px; letter-spacing: .12em; color: #8a6a55; }}
      .paso-txt b {{ display: block; font-weight: 900; font-size: 58px; color: #1d120c; line-height: 1.05; }}
      /* Dato grande dentro de la escena */
      .dato {{ position: absolute; left: 0; right: 0; top: 470px; text-align: center; z-index: 5; }}
      .dato span {{ display: inline-block; font-weight: 900; font-size: 104px; color: var(--naranja); letter-spacing: -0.01em;
        -webkit-text-stroke: 12px #1d120c; paint-order: stroke fill; text-shadow: 0 10px 0 rgba(0,0,0,.3); }}
      /* Cierre */
      .cierre {{ position: absolute; left: 0; right: 0; top: 1150px; z-index: 7; display: flex; justify-content: center; }}
      .cierre-caja {{ background: #fffaf3; border-radius: 34px; padding: 34px 56px; text-align: center; box-shadow: 0 18px 40px rgba(0,0,0,.35); }}
      .cierre-caja small {{ display: block; font-weight: 700; font-size: 40px; color: #8a6a55; }}
      .cierre-caja b {{ display: block; font-weight: 900; font-size: 74px; color: var(--naranja); }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="1080" data-height="1920">
      <canvas id="escena" width="1080" height="1920"></canvas>
      {chr(10).join("      " + c for c in clips).strip()}
    </div>
    <script>
      window.__hf = window.__hf || {{}};
      window.__hf.buildReady = window.__hf.buildReady || {{}};
      window.__hf.buildReady["escena"] = new Promise((r) => (window.__escenaLista = r));
      const tl = gsap.timeline({{ paused: true }});
      const pop = (sel, t) => tl.fromTo(sel, {{ scale: 0.4, opacity: 0, y: 30 }}, {{ scale: 1, opacity: 1, y: 0, duration: 0.22, ease: "back.out(2.4)" }}, t);
      {chr(10).join("      " + a for a in anim).strip()}
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
    <script type="module">
{escena}
    </script>
  </body>
</html>
'''
(AQUI / "alfajor-3d" / "index.html").write_text(doc, encoding="utf-8")
print("ok", len(SUBS), "subtítulos")
