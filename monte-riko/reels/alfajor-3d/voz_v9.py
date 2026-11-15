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
         ("¿Por qué? Porque sí.", "¿Por qué? Porque sí.", ["sí"], "+5%", "-6Hz")], 0.3),
 (30.0, [("Papel dorado. Listo para regalar.", "Papel dorado. Listo para regalar.", ["dorado"], "+12%", "+5Hz"),
         ("O comételo vos. No te juzgo.", "O comételo vos. No te juzgo.", ["juzgo"], "+10%", "-4Hz")], 0.3),
]
dur = lambda f: float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f],capture_output=True,text=True).stdout)
PAUSA = 0.18
subs = []; segs = []
for i, (s0, partes, cola) in enumerate(SEGS):
    wavs = []
    for j, (dicho, mostrado, claves, rate, pitch) in enumerate(partes):
        mp3, wav = f"p{i}{j}.mp3", f"p{i}{j}.wav"
        subprocess.run(["uvx","edge-tts","--voice","es-AR-TomasNeural",f"--rate={rate}",f"--pitch={pitch}","--text",dicho,"--write-media",mp3], check=True, capture_output=True)
        subprocess.run(["ffmpeg","-loglevel","error","-y","-i",mp3,"-af","silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse","-ar","48000","-ac","1",wav], check=True)
        wavs.append(wav)
    ds = [dur(w) for w in wavs]
    if len(wavs) == 2:
        subprocess.run(["ffmpeg","-loglevel","error","-y","-i",wavs[0],"-i",wavs[1],"-filter_complex",f"[0:a]apad=pad_dur={PAUSA}[a0];[a0][1:a]concat=n=2:v=0:a=1[o]","-map","[o]",f"seg{i}.wav"], check=True)
        total = ds[0] + PAUSA + ds[1]; inicios = [0, ds[0] + PAUSA]
    else:
        subprocess.run(["ffmpeg","-loglevel","error","-y","-i",wavs[0],f"seg{i}.wav"], check=True)
        total = ds[0]; inicios = [0]
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
