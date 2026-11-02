import subprocess, sys
import numpy as np
import soundfile as sf

SR = 48000
BASE = "M:/reel-v2/trabajo-noviembre/sonido"


def leer(path, desde=0.0, dur=None, tempo=1.0):
    cmd = ["ffmpeg", "-v", "error", "-ss", str(desde)]
    if dur:
        cmd += ["-t", str(dur)]
    cmd += ["-i", path, "-vn", "-ac", "1", "-ar", str(SR)]
    if tempo != 1.0:
        cmd += ["-af", f"atempo={tempo}"]
    cmd += ["-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, dtype=np.float32).copy()


def norm(x, pico_db):
    return x / (np.abs(x).max() + 1e-9) * 10 ** (pico_db / 20)


def bordes(x, ent=0.003, sal=0.05):
    a, b = int(ent * SR), int(sal * SR)
    x[:a] *= np.linspace(0, 1, a)
    x[-b:] *= np.linspace(1, 0, b)
    return x


def poner(pista, x, t):
    i = int(t * SR)
    j = min(len(pista), i + len(x))
    pista[i:j] += x[: j - i]


pop = bordes(leer(f"{BASE}/assets/ui/fs-401542_pop.mp3"))
swoosh = bordes(leer(f"{BASE}/assets/motion/fs-427823_whoosh1.mp3"), sal=0.15)
crack = bordes(leer(f"{BASE}/assets/crack/fs-660866.mp3", 7.987, 1.25), sal=0.3)
caja = bordes(leer(f"{BASE}/assets/thud/fs-364932.mp3", 0.829, 0.4))
CRUDO = "M:/reel-v2/crudos-noviembre/IMG_{}.MOV"


def real(video, desde, hasta, tempo):
    return bordes(leer(CRUDO.format(video), desde, hasta - desde, tempo), 0.02, 0.15)


REELS = {
    "Relleno": dict(
        dur=16.2, palabras=[3, 16, 29], whoosh=[3.2, 7.7], parte=9.7, cierre=13.7, reales=[],
    ),
    "Bano": dict(
        dur=22.7, palabras=[3, 14, 26, 31, 38], whoosh=[3.1, 7.1, 12.1], parte=None, cierre=20.2,
        reales=[("0498", 22, 28, 2.0, 12.1), ("0500", 1, 5.5, 1.8, 15.1)],
    ),
    "Todo": dict(
        dur=28.6, palabras=[3, 9, 15, 28, 38], whoosh=[3.6, 8.3, 10.5, 14.2], parte=20.6, cierre=26.1,
        reales=[("0498", 23, 26, 2.0, 15.7), ("0500", 1.5, 4.9, 2.0, 17.2)],
    ),
    "Partido": dict(
        dur=15.5, palabras=[3, 17, 23, 34, 40], whoosh=[9.0], parte=5.5, cierre=13.0, reales=[],
        musica_desde=16, baja=(2.6, 5.2),
        crujidos=[(5.82, 0.175, -15, 1.0), (5.82, 0.175, -13, 1.9), (5.82, 0.175, -12, 2.6), (0.787, 0.37, -10, 4.4)],
    ),
    "Harina": dict(
        dur=537 / 30, palabras=[3, 14, 28, 38], whoosh=[], parte=None, cierre=15.4, reales=[], musica_desde=32,
    ),
    "Tapas": dict(
        dur=323 / 30, palabras=[3, 16, 29], whoosh=[], parte=None, cierre=8.25, reales=[], musica_desde=48,
    ),
    "Apilar": dict(
        dur=454 / 30, palabras=[3, 18, 33], whoosh=[9.25], parte=None, cierre=12.6, reales=[], musica_desde=64,
    ),
    # Tomás pidió velocidad normal y sin música: queda el ambiente real del video y los crujidos
    "PartidoV2": dict(
        dur=22.0, palabras=[3, 17, 23, 34, 40], whoosh=[], parte=None, cierre=19.5, reales=[],
        sin_musica=True, cama=("0446", 9.0, 28.5),
        crujidos=[(5.82, 0.175, -18, 1.1), (5.82, 0.175, -16, 2.7), (0.787, 0.37, -14, 4.3), (5.82, 0.175, -14, 6.1),
                  (0.787, 0.37, -12, 8.6), (7.987, 1.25, -3, 9.4), (0.787, 0.37, -14, 11.0)],
    ),
}

# Velocidad normal: cada toma lleva su propio sonido real, sin música
BANO_TOMAS = [("0498", 12.5, 4), ("0490", 20, 4), ("0493", 18, 4), ("0494", 33.5, 4), ("0497", 6, 4), ("0498", 22, 4), ("0500", 1, 4), ("0502", 1.2, 3.4)]
TODO_TOMAS = [("0466", 14, 2.4), ("0466", 40, 1.8), ("0466", 80, 1.2), ("0460", 2, 1.2), ("0470", 1.8, 2.2), ("0474", 9.6, 1.8),
              ("0475", 2.2, 1.2), ("0482", 5, 2.5), ("0481", 88, 3), ("0490", 20, 3), ("0494", 34, 3), ("0497", 6, 3.6),
              ("0498", 15, 3), ("0498", 23, 3), ("0500", 1.5, 3.4), ("0502", 1.5, 3), ("0446", 17, 9)]


def camas(tomas):
    t, out = 0.0, []
    for v, a, d in tomas:
        out.append((v, a, a + d, t))
        t += d
    return out


REELS["BanoNormal"] = dict(dur=1017 / 30, palabras=[3, 14, 26, 31, 38], whoosh=[], parte=None, cierre=31.4, reales=[],
                           sin_musica=True, camas=camas(BANO_TOMAS))
REELS["TodoNormal"] = dict(dur=1524 / 30, palabras=[3, 9, 15, 28, 38], whoosh=[], parte=None, cierre=48.3, reales=[],
                           sin_musica=True, camas=camas(TODO_TOMAS), crujidos=[(0.787, 0.37, -14, 40.0), (7.987, 1.25, -3, 40.7)])

RELLENO_TOMAS = [("0482", 4.0, 3.6), ("0481", 82, 6), ("0481", 101.5, 6), ("0446", 17, 9)]
REELS["RellenoNormal"] = dict(dur=813 / 30, palabras=[3, 16, 29], whoosh=[], parte=None, cierre=24.6, reales=[],
                              sin_musica=True, camas=camas(RELLENO_TOMAS), crujidos=[(0.787, 0.37, -14, 16.3), (7.987, 1.25, -3, 17.0)])

# Tomás pidió estos reels sin música, solo con los efectos
for k in ("Harina", "Tapas", "Apilar"):
    REELS[f"{k}Solo"] = dict(REELS[k], sin_musica=True)

solo = sys.argv[1:]

for id, r in REELS.items():
    if solo and id not in solo:
        continue
    n = int(r["dur"] * SR)
    # La música arranca en el primer tiempo del loop de 120 pulsos
    desde = r.get("musica_desde", 0)
    musica = leer(f"{BASE}/assets/music/fs-567959_disco-funk-drums-long.mp3", desde, r["dur"] + 1)[:n]
    env = np.ones(n) * 10 ** (-5 / 20)
    if r.get("baja"):
        # Música bajita mientras crece la tensión
        a, b = [int(t * SR) for t in r["baja"]]
        env[a:b] = 10 ** (-17 / 20)
    if r["parte"]:
        # Corte de música justo antes de que se parta el alfajor
        a, b, c = [int(t * SR) for t in (r["parte"] - 0.3, r["parte"] - 0.02, r["parte"] + 0.9)]
        env[a:b] = np.linspace(env[a], 10 ** (-28 / 20), b - a)
        env[b:c] = 10 ** (-28 / 20)
        d = int(0.12 * SR)
        env[c:c + d] = np.linspace(10 ** (-28 / 20), 10 ** (-5 / 20), d)
    f = int(0.9 * SR)
    env[-f:] *= np.linspace(1, 0, f) ** 1.5
    mezcla = np.zeros(n) if r.get("sin_musica") else musica * env

    fx = np.zeros(n)
    if r.get("cama"):
        v, a, b = r["cama"]
        poner(fx, norm(real(v, a, b, 1.0), -24), 0)
    for v, a, b, t in r.get("camas", []):
        # En la toma 0502 se escucha hablar a Tomás: va muda
        if v != "0502":
            poner(fx, norm(real(v, a, b, 1.0), -16), t)
    for fr in r["palabras"]:
        poner(fx, norm(pop.copy(), -16), fr / 30)
    for t in r["whoosh"]:
        poner(fx, norm(swoosh.copy(), -15), max(0, t - 0.12))
    if r["parte"]:
        # El chasquido fuerte está 0,5 s adentro del recorte: cae cuando el alfajor ya se abre
        poner(fx, norm(crack.copy(), -3), r["parte"] - 0.2)
    for desde_c, dur_c, nivel, t in r.get("crujidos", []):
        poner(fx, norm(bordes(leer(f"{BASE}/assets/crack/fs-660866.mp3", desde_c, dur_c), 0.002, 0.03), nivel), t)
    poner(fx, norm(swoosh.copy(), -12), r["cierre"] - 0.12)
    poner(fx, norm(caja.copy(), -5), r["cierre"] + 8 / 30)
    for v, a, b, tempo, t in r["reales"]:
        poner(fx, norm(real(v, a, b, tempo), -8), t)

    salida = mezcla + fx
    sf.write(f"{BASE}/review/{id}.wav", salida, SR, subtype="FLOAT")
    print(id, "pico", round(20 * np.log10(np.abs(salida).max()), 1))
