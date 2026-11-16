#!/bin/bash
# Arma el reel "envolver y caja" (15/11/2026). Uso: bash envolver-y-caja-armar.sh <carpeta crudos> <carpeta temporal> <salida.mp4>
# Cada línea: archivo|inicio (s)|duración (s). Sin sonido, velocidad normal, zoom suave en cada toma.
D="$1"; T="$2"; OUT="$3"; mkdir -p "$T"; : > "$T/lista.txt"
C1="Video1-envolviendo-alfajor-de-cerca-toma-2.mp4"; L1="Video1-envolviendo-alfajor-de-lejos-toma-1.mp4"
C3="Video3-armando-caja-de-cerca-toma-2.mp4"; L3="Video3-armando-caja-de-lejos-toma-1.mp4"
AR="Video7y10-guardando-alfajor-desde-arriba-toma-4.mp4"
EDL="$AR|12.0|1.6
$C1|2.7|1.5
$L1|34.5|1.5
$C1|7.5|1.6
$C1|31.5|1.5
$C1|55.5|1.5
$C1|119.4|1.5
$C1|138.6|2.4
Video2-poniendo-caja-para-armar-en-la-mesada-de-lejos-toma-1.mp4|6.0|1.4
$C3|38.5|1.6
$L3|50.5|1.4
$C3|53.5|1.6
$L3|63.0|1.4
$C3|98.5|1.5
Video4-guardando-alfajor-de-lejos-toma-1.mp4|7.6|1.8
Video5-guardando-alfajor-de-cerca-toma-2.mp4|2.6|1.6
$AR|0.3|1.6
Video8-poniendo-tarjeta-en-la-caja-de-cerca-toma-2.mp4|1.3|1.6
Video9-cerrando-caja-con-alfajores-de-cerca-toma-2.mp4|1.0|1.6
$AR|22.0|1.5
Video11-poniendo-sticker-MonteRiko-a-la-caja-de-cerca-toma-3.mp4|9.3|2.4
$AR|60.3|2.0
Video12-escribiendo-la-caja-de-cerca-toma-2-v1.mp4|6.0|2.0
Video12-escribiendo-la-caja-de-cerca-toma-2-v1.mp4|17.0|2.2"
i=0
while IFS='|' read -r f ss dur; do
  i=$((i+1)); o="$T/c$(printf %02d $i).mp4"
  ffmpeg -v error -y -ss "$ss" -t "$dur" -i "$D/$f" -an -vf "fps=30,scale=w='2*trunc(540*(1+0.06*t/$dur))':h=-2:eval=frame:flags=lanczos,crop=1080:1920,eq=saturation=1.12:contrast=1.03,unsharp=5:5:0.5,format=yuv420p" -c:v libx264 -crf 17 -preset medium "$o" </dev/null || echo "FALLO $f"
  echo "file 'c$(printf %02d $i).mp4'" >> "$T/lista.txt"
done <<< "$EDL"
ffmpeg -v error -y -f concat -safe 0 -i "$T/lista.txt" -f lavfi -i anullsrc=r=44100:cl=stereo -shortest -c:v copy -c:a aac -b:a 64k -movflags +faststart "$OUT"
