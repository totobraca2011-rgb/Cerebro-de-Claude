# v8: voz con más carácter (arranque + remate con tonos distintos). Mismo armado que v7, sin acelerar la voz.
import subprocess, json
SRC = r"C:/Users/MARCOS/Documents/GitHub/Cerebro-de-Claude/editor-de-ia/terminados/2026-11-05-alfajor-3d-v3-sonido.mp4"
VID = r"M:/reel-v2/versiones-3d/build/con-subs-v8.mp4"
XF = 0.15
starts = [0.0, 3.9, 7.0, 11.0, 14.6, 17.8, 26.0, 30.0]
segdur = json.load(open("subs_v8.json", encoding="utf-8"))["segdur"]
L = [round(v + 0.35, 3) for v in segdur]; L[7] = 6.0  # el final deja ver el cartel
fc = []; inputs = ["-i", SRC, "-i", VID] + sum([["-i", f"seg{i}.wav"] for i in range(8)], []) + ["-i", "fin.wav"]
for i,(s,l) in enumerate(zip(starts,L)):
    fc.append(f"[1:v]trim={s}:{s+l},setpts=PTS-STARTPTS[v{i}];[0:a]atrim={s}:{s+l},asetpts=PTS-STARTPTS[b{i}]")
off = 0; vprev = "v0"; aprev = "b0"; t_ini = [0]
for i in range(1,8):
    off += L[i-1] - XF; t_ini.append(off)
    fc.append(f"[{vprev}][v{i}]xfade=transition=fade:duration={XF}:offset={round(off,3)}[vx{i}]"); vprev = f"vx{i}"
    fc.append(f"[{aprev}][b{i}]acrossfade=d={XF}[ax{i}]"); aprev = f"ax{i}"
# cierre: el cartel "Comentá ALFAJOR" sale a los 35,1 s del 3D (5,1 s de la última toma) y la voz lo dice
T_FIN = off + 5.3
D_FIN = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0","fin.wav"],capture_output=True,text=True).stdout)
total = T_FIN + D_FIN + 0.7
HOLD = round(total - (off + L[-1]) + 0.1, 3)  # el último cuadro queda quieto mientras habla
for i in range(8):
    fc.append(f"[{i+2}:a]adelay={int((t_ini[i]+0.08)*1000)}:all=1[w{i}]")
fc.append(f"[10:a]adelay={int(T_FIN*1000)}:all=1[w8]")
fc.append("".join(f"[w{i}]" for i in range(9)) + f"amix=inputs=9:normalize=0,highpass=f=80,acompressor=threshold=-18dB:ratio=3,apad=whole_dur={total}[voz]")
fc.append(f"[{vprev}]tpad=stop_mode=clone:stop_duration={HOLD}[vfin]"); fc.append("[voz]asplit[k1][k2]")
fc.append(f"[{aprev}]volume=0.28,apad=whole_dur={total}[bg]")
fc.append("[bg][k1]sidechaincompress=threshold=0.03:ratio=8:release=250[bgd]")
fc.append("[bgd][k2]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-2[a]")
cmd = ["ffmpeg","-loglevel","error","-y",*inputs,"-filter_complex",";".join(fc),"-map","[vfin]","-map","[a]","-c:v","libx264","-crf","18","-preset","medium","-c:a","aac","-b:a","192k","-t",str(round(total,3)),"v8-caracter.mp4"]
subprocess.run(cmd, check=True)
print("total", round(total,2))
