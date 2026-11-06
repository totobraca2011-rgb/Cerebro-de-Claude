# Rearma los tiempos del reel 3D a partir de la voz de Tomás.
# Cada paso dura lo que dura su frase (mínimo lo que duraba antes), la escena 3D se estira dentro de cada paso
# y los subtítulos salen de los tiempos de cada palabra dicha.
import json, pathlib, sys

AQUI = pathlib.Path(__file__).parent
palabras = json.load(open(sys.argv[1]))  # [{w, s, e}] de faster-whisper sobre la toma completa

# Frases: tramo de la grabación (s) y grupos de subtítulo (índices de palabras, texto, claves)
FRASES = [
    ((5.26, 8.87), [((0, 4), "Así es como se hace", []), ((5, 6), "un alfajor", ["alfajor"]), ((7, 11), "de más de 100 g", ["100"])]),
    ((9.29, 13.53), [((12, 14), "Primero, la masa", ["masa"]), ((15, 17), "derecho al freezer", ["freezer"]), ((18, 21), "una noche o más", ["noche"])]),
    ((14.00, 16.89), [((22, 23), "La saco", []), ((24, 26), "y la estiro", ["estiro"]), ((27, 29), "hasta 5 milímetros", ["5"])]),
    ((17.51, 20.36), [((30, 32), "Salen las tapas", ["tapas"]), ((33, 35), "a la heladera", ["heladera"]), ((36, 37), "media hora", ["media"])]),
    ((20.97, 24.10), [((38, 40), "De la heladera", []), ((41, 43), "directo al horno", ["horno"]), ((44, 46), "y a enfriar", [])]),
    ((24.80, 28.10), [((47, 48), "55 gramos", ["55"]), ((49, 51), "de dulce de leche", ["dulce"]), ((52, 54), "panza para adentro", ["panza"])]),
    ((29.01, 31.79), [((55, 58), "Otra vez al frío", ["frío"]), ((59, 61), "así el dulce", []), ((62, 64), "no se escapa", ["escapa"])]),
    ((32.15, 37.05), [((65, 66), "Chocolate semiamargo", ["semiamargo"]), ((67, 69), "a 45 grados", ["45"]), ((70, 73), "y abajo, otra vez", [])]),
    ((37.57, 41.10), [((74, 75), "Papel dorado", ["dorado"]), ((76, 78), "y la corona", ["corona"]), ((79, 81), "Listo para vos", ["vos"])]),
]
VIEJO = [0, 2, 6, 10, 14, 18, 22, 26, 30, 34, 36]  # límites de cada paso en la escena original
ENTRA = 0.1  # la voz entra 0,1 s después de que arranca el paso
AIRE = 0.35  # silencio mínimo después de cada frase

nuevo, voz, subs = [0.0], [], []
for k, ((a, b), grupos) in enumerate(FRASES):
    ini = nuevo[-1]
    dur_vieja = VIEJO[k + 1] - VIEJO[k]
    dur = max(dur_vieja, ENTRA + (b - a) + AIRE)
    voz.append({"src": [a, b], "at": round(ini + ENTRA, 3)})
    for g, ((i0, i1), texto, claves) in enumerate(grupos):
        ws = [round(ini + ENTRA + max(0.0, palabras[i]["s"] - a), 3) for i in range(i0, i1 + 1)]
        n = len(texto.split(" "))
        while len(ws) < n:  # "de dulce de leche": a Whisper se le escapó un "de"
            ws.insert(0, round(ws[0] - 0.12, 3))
        ws = ws[:n] if len(ws) > n else ws
        if k == 0 and g == 0:
            ws = [0.0] * n  # el gancho ya está en pantalla en el primer cuadro
        subs.append({"t": ws[0], "texto": texto, "claves": claves, "palabras": ws})
    nuevo.append(round(ini + dur, 3))
nuevo.append(round(nuevo[-1] + 2.0, 3))  # cierre
for i in range(len(subs)):
    subs[i]["fin"] = subs[i + 1]["t"] if i + 1 < len(subs) else nuevo[-2]
    # un grupo no queda en pantalla después de que termina su paso
json.dump({"viejo": VIEJO, "nuevo": nuevo, "voz": voz, "subs": subs}, open(AQUI / "tiempos.json", "w"), ensure_ascii=False, indent=1)
print("duración", nuevo[-1], "pasos", nuevo)
