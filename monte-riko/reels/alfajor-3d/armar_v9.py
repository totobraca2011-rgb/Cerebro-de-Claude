# v9: mismo armado que v8 con tramos de largo variable (tomas cortas de una palabra al principio).
import subprocess, json
SRC = r"C:/Users/MARCOS/Documents/GitHub/Cerebro-de-Claude/editor-de-ia/terminados/2026-11-05-alfajor-3d-v3-sonido.mp4"
VID = r"M:/reel-v2/versiones-3d/build/con-subs-v9.mp4"
XF = 0.12
segs = json.load(open("subs_v9.json", encoding="utf-8"))["segs"]
starts = [s["inicio"] for s in segs]; L = [s["largo"] for s in segs]
L[-1] = 6.0  # la última toma llega al cartel "Comentá ALFAJOR" (35,1 s del 3D)
n = len(segs)
fc = []; inputs = ["-i", SRC, "-i", VID] + sum([["-i", f"seg{i}.wav"] for i in range(n)], []) + ["-i", "fin.wav"]
for i,(s,l) in enumerate(zip(starts,L)):
    fc.append(f"[1:v]trim={s}:{s+l},setpts=PTS-STARTPTS[v{i}];[0:a]atrim={s}:{s+l},asetpts=PTS-STARTPTS[b{i}]")
off = 0; vprev = "v0"; aprev = "b0"; t_ini = [0]
for i in range(1,n):
    off += L[i-1] - XF; t_ini.append(off)
    fc.append(f"[{vprev}][v{i}]xfade=transition=fade:duration={XF}:offset={round(off,3)}[vx{i}]"); vprev = f"vx{i}"
    fc.append(f"[{aprev}][b{i}]acrossfade=d={XF}[ax{i}]"); aprev = f"ax{i}"
T_FIN = off + 5.3
D_FIN = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0","fin.wav"],capture_output=True,text=True).stdout)
total = T_FIN + D_FIN + 0.7
HOLD = round(total - (off + L[-1]) + 0.1, 3)
for i in range(n):
    fc.append(f"[{i+2}:a]adelay={int((t_ini[i]+0.08)*1000)}:all=1[w{i}]")
fc.append(f"[{n+2}:a]adelay={int(T_FIN*1000)}:all=1[w{n}]")
fc.append("".join(f"[w{i}]" for i in range(n+1)) + f"amix=inputs={n+1}:normalize=0,highpass=f=80,acompressor=threshold=-18dB:ratio=3,apad=whole_dur={total}[voz]")
fc.append(f"[{vprev}]tpad=stop_mode=clone:stop_duration={HOLD}[vfin]"); fc.append("[voz]asplit[k1][k2]")
fc.append(f"[{aprev}]volume=0.28,apad=whole_dur={total}[bg]")
fc.append("[bg][k1]sidechaincompress=threshold=0.03:ratio=8:release=250[bgd]")
fc.append("[bgd][k2]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-2[a]")
cmd = ["ffmpeg","-loglevel","error","-y",*inputs,"-filter_complex",";".join(fc),"-map","[vfin]","-map","[a]","-c:v","libx264","-crf","18","-preset","medium","-c:a","aac","-b:a","192k","-t",str(round(total,3)),"v9-retencion.mp4"]
subprocess.run(cmd, check=True)
print("total", round(total,2), "inicios", [round(t,2) for t in t_ini])
