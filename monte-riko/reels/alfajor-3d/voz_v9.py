# v9: arreglo de la retención de v8 (14/11/2026): la mitad se iba en los primeros 8 s (masa, freezer, estirar).
# El gancho promete el relleno; freezer, estirar, cortar y frío pasan en tomas cortas de una palabra (cortar y frío, pedido de Tomás).
import subprocess, json, re
# (inicio en el 3D, [(dicho, mostrado, claves, rate, pitch), ...], cola)
SEGS = [
 (0.0,  [("¡Más de cien gramos!", "¡Más de cien gramos!", ["cien"], "+15%", "+10Hz"),
         ("Y esperá a ver el relleno.", "Y esperá a ver el relleno.", ["relleno"], "+12%", "+2Hz")], 0.15),
 (4.2,  [("¡Freezer!", "¡Freezer!", ["freezer"], "+20%", "+12Hz")], 0.12),
 (7.6,  [("¡Estirar!", "¡Estirar!", ["estirar"], "+20%", "+12Hz")], 0.12),
 (11.1, [("¡Cortar!", "¡Cortar!", ["cortar"], "+20%", "+12Hz")], 0.12),
 (12.2, [("¡Más frío!", "¡Más frío!", ["frío"], "+20%", "+14Hz")], 0.15),  # la bandeja entra a la heladera
 (14.6, [("¡Ocho minutos!", "¡Ocho minutos!", ["ocho"], "+15%", "+14Hz"),
         ("Uno más y llamo a los bomberos.", "Uno más y llamo a los bomberos.", ["bomberos"], "+20%", "+2Hz")], 0.3),
 (17.8, [("Y acá está: cincuenta y cinco gramos de dulce de leche.", "Y acá está: 55 gramos de dulce de leche.", ["55"], "+15%", "+6Hz"),
         ("¡Sí, los conté!", "¡Sí, los conté!", ["conté"], "+10%", "+10Hz")], 0.3),
 (26.0, [("¡Doble chocolate!", "¡Doble chocolate!", ["doble"], "+15%", "+10Hz"),
         ("¿Por qué?", "¿Por qué?", ["qué"], "+0%", "-6Hz", 0.4),
         ("¡Porque sí!", "¡Porque sí!", ["sí"], "+5%", "+12Hz")], 0.3),  # "porque sí" agudo, como el principio (Tomás)
 (30.0, [("Papel dorado. Listo para regalar.", "Papel dorado. Listo para regalar.", ["dorado"], "+12%", "+5Hz"),
         ("O comételo vos. No te juzgo.", "O comételo vos. No te juzgo.", ["juzgo"], "+10%", "-4Hz")], 0.3),
]
dur = lambda f: float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f],capture_output=True,text=True).stdout)
PAUSA = 0.18
subs = []; segs = []
for i, (s0, partes, cola) in enumerate(SEGS):
    wavs = []
    for j, (dicho, mostrado, claves, rate, pitch, *_) in enumerate(partes):
        mp3, wav = f"p{i}{j}.mp3", f"p{i}{j}.wav"
        subprocess.run(["uvx","edge-tts","--voice","es-AR-TomasNeural",f"--rate={rate}",f"--pitch={pitch}","--text",dicho,"--write-media",mp3], check=True, capture_output=True)
        subprocess.run(["ffmpeg","-loglevel","error","-y","-i",mp3,"-af","silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse","-ar","48000","-ac","1",wav], check=True)
        wavs.append(wav)
    ds = [dur(w) for w in wavs]
    # une las partes con una pausa corta entre cada una
    n = len(wavs); ins = sum([["-i", w] for w in wavs], [])
    pausas = [(pt[5] if len(pt) > 5 else PAUSA) for pt in partes]  # una parte puede pedir más silencio después
    fcx = "".join(f"[{k}:a]apad=pad_dur={pausas[k]}[a{k}];" for k in range(n - 1)) + "".join(f"[a{k}]" for k in range(n - 1)) + f"[{n-1}:a]concat=n={n}:v=0:a=1[o]"
    subprocess.run(["ffmpeg","-loglevel","error","-y",*ins,"-filter_complex",fcx,"-map","[o]",f"seg{i}.wav"], check=True)
    inicios = []; acc = 0
    for d, pz in zip(ds, pausas): inicios.append(acc); acc += d + pz
    total = acc - pausas[-1]
    segs.append({"inicio": s0, "voz": total, "largo": round(total + 0.08 + cola, 3)})
    for (dicho, mostrado, claves, *_), off, d in zip(partes, inicios, ds):
        a = s0 + 0.08 + off
        pal = mostrado.split(); pesos = [len(re.sub(r"\W", "", p)) + 2 for p in pal]; tot = sum(pesos)
        tw = []; acc = a
        for p in pesos: tw.append(round(acc, 3)); acc += d * 0.9 * p / tot
        subs.append({"t": round(a, 3), "fin": round(a + d + min(cola, 0.15), 3), "texto": mostrado, "claves": claves, "palabras": tw})
json.dump({"subs": subs, "segs": segs}, open("subs_v9.json", "w", encoding="utf-8"), ensure_ascii=False)
for i, s in enumerate(segs):
    sig = SEGS[i+1][0] if i + 1 < len(SEGS) else 36
    print(i, s["inicio"], round(s["largo"], 2), "lugar", round(sig - s["inicio"], 2), "OK" if s["largo"] < sig - s["inicio"] else "LARGO")
