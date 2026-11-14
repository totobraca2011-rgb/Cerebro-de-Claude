# Voz v8: cada toma tiene un "arranque" y un "remate" con tono distinto (más carácter).
import subprocess, json, re
STARTS = [0.0, 3.9, 7.0, 11.0, 14.6, 17.8, 26.0, 30.0]
# (dicho, mostrado, claves, rate, pitch)
L = [
 [("¡Más de cien gramos!", "¡Más de cien gramos!", ["cien"], "+15%", "+10Hz"),
  ("Esto no es un alfajor... es un almuerzo.", "Esto no es un alfajor, es un almuerzo.", ["almuerzo"], "+8%", "-4Hz")],
 [("Una noche entera en el freezer.", "Una noche entera en el freezer.", ["freezer"], "+18%", "+0Hz"),
  ("¡Pobrecito!", "¡Pobrecito!", ["pobrecito"], "+0%", "+18Hz")],
 [("Cinco milímetros.", "Cinco milímetros.", ["cinco"], "+18%", "+2Hz"),
  ("¿Con regla? Con fe.", "¿Con regla? Con fe.", ["fe"], "+12%", "-6Hz")],
 [("¿Otra vez al frío?", "¿Otra vez al frío?", ["frío"], "+18%", "+12Hz"),
  ("Media hora. Respirá.", "Media hora. Respirá.", ["respirá"], "+5%", "-8Hz")],
 [("¡Ocho minutos!", "¡Ocho minutos!", ["ocho"], "+15%", "+14Hz"),
  ("Uno más y llamo a los bomberos.", "Uno más y llamo a los bomberos.", ["bomberos"], "+20%", "+2Hz")],
 [("Cincuenta y cinco gramos de dulce de leche.", "55 gramos de dulce de leche.", ["55"], "+15%", "+5Hz"),
  ("¡Sí, los conté! Bueno... casi todos.", "¡Sí, los conté! Bueno… casi todos.", ["conté"], "+10%", "+10Hz")],
 [("¡Doble chocolate!", "¡Doble chocolate!", ["doble"], "+15%", "+10Hz"),
  ("¿Por qué? Porque sí.", "¿Por qué? Porque sí.", ["sí"], "+5%", "-6Hz")],
 [("Papel dorado. Listo para regalar.", "Papel dorado. Listo para regalar.", ["dorado"], "+12%", "+5Hz"),
  ("O comételo vos. No te juzgo.", "O comételo vos. No te juzgo.", ["juzgo"], "+10%", "-4Hz")],
]
dur = lambda f: float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f],capture_output=True,text=True).stdout)
PAUSA = 0.18
subs = []; segdur = []
for i, partes in enumerate(L):
    wavs = []
    for j, (dicho, mostrado, claves, rate, pitch) in enumerate(partes):
        mp3 = f"p{i}{j}.mp3"; wav = f"p{i}{j}.wav"
        subprocess.run(["uvx","edge-tts","--voice","es-AR-TomasNeural",f"--rate={rate}",f"--pitch={pitch}","--text",dicho,"--write-media",mp3], check=True, capture_output=True)
        # recorta silencio de punta y cola
        subprocess.run(["ffmpeg","-loglevel","error","-y","-i",mp3,"-af","silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse","-ar","48000","-ac","1",wav], check=True)
        wavs.append(wav)
    # une arranque + pausa + remate
    subprocess.run(["ffmpeg","-loglevel","error","-y","-i",wavs[0],"-i",wavs[1],"-filter_complex",f"[0:a]apad=pad_dur={PAUSA}[a0];[a0][1:a]concat=n=2:v=0:a=1[o]","-map","[o]",f"seg{i}.wav"], check=True)
    d0, d1 = dur(wavs[0]), dur(wavs[1])
    segdur.append(d0 + PAUSA + d1)
    t0 = STARTS[i] + 0.08
    for (dicho, mostrado, claves, *_), a, d in [(partes[0], t0, d0), (partes[1], t0 + d0 + PAUSA, d1)]:
        pal = mostrado.split(); pesos = [len(re.sub(r"\W", "", p)) + 2 for p in pal]; tot = sum(pesos)
        tw = []; acc = a
        for p in pesos: tw.append(round(acc, 3)); acc += d * 0.9 * p / tot
        subs.append({"t": round(a, 3), "fin": round(a + d + 0.15, 3), "texto": mostrado, "claves": claves, "palabras": tw})
json.dump({"subs": subs, "segdur": segdur}, open("subs_v8.json", "w", encoding="utf-8"), ensure_ascii=False)
for i, d in enumerate(segdur):
    gap = (STARTS[i+1] - STARTS[i]) if i < 7 else 99
    print(i, round(d, 2), "lugar", gap, "OK" if d + 0.45 < gap else "LARGO")
