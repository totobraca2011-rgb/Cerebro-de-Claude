// Versiones con sonido del reel "Envolver y caja" (15/11/2026), sobre la v4 que editó Tomás.
// Uso: node envolver-y-caja-sonido.mjs <video base h264> <carpeta de sonidos> <carpeta crudos> <carpeta salida>
// Los sonidos no se guardan en el Cerebro: de dónde salió cada uno está en envolver-y-caja.md.
import { execFileSync } from "node:child_process";
import path from "node:path";

const [BASE, SND, CRUDOS, OUT] = process.argv.slice(2);
const DUR = 25.233;

// [inicio en el video, archivo, desde dónde del archivo, duración, volumen en dB]
const EFECTOS = [
  [0.0, "papel", 0.0, 1.1, 12], [0.45, "taps", 2.0, 0.4, -8],          // apoya el alfajor en el papel
  [1.1, "foil3", 0.5, 1.07, -1],                                        // envuelve, de lejos
  [2.17, "foil3", 4.5, 1.16, 0],                                        // envuelve, de cerca
  [3.33, "foil3", 7.0, 0.84, -2],
  [4.17, "foil1", 1.5, 1.0, 18],                                        // alfajor con sticker
  [5.83, "caja2", 0.0, 1.2, -2],                                        // caja plana en la mesada
  [7.03, "caja1", 1.0, 1.57, 0], [8.6, "caja1", 4.5, 1.33, -3],         // armado de la caja
  [9.93, "caja2", 2.5, 1.4, -3], [11.33, "caja1", 5.0, 1.4, 0],
  [12.73, "foil3", 9.5, 0.94, -6], [13.2, "taps", 0.0, 0.4, -10],       // guarda alfajores
  [13.67, "foil3", 2.5, 1.03, -3], [14.05, "taps", 1.0, 0.4, -10],
  [14.7, "foil3", 6.0, 1.5, -3], [15.3, "taps", 3.0, 0.4, -8],
  [16.23, "foil3", 11.0, 1.0, -4],
  [17.83, "papelcorto", 0.0, 0.67, 12],                                 // tarjeta
  [18.5, "caja1", 0.5, 1.5, 0],                                         // cierra la tapa
  [20.0, "taps", 4.0, 0.5, -6], [20.0, "caja2", 3.0, 0.85, -6],
  [20.9, "papel", 3.0, 1.5, 8],                                         // sticker de la caja
  [22.6, "taps", 4.5, 0.5, -8],                                         // aprieta el sticker
  [23.7, "roce", 0.0, 1.5, 18],                                         // corre la caja
];

const ff = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: ["ignore", "inherit", "inherit"] });

// gancho: { archivo, desde, dur, efectos: [...] } se pega antes del video base
function armar(nombre, { efectos = false, cancion = null, gancho = null }) {
  const corr = gancho ? gancho.dur : 0;
  const total = DUR + corr;
  const ins = ["-i", BASE];
  const f = [];
  let n = 1;
  let vmap = "0:v";
  if (gancho) {
    ins.push("-ss", String(gancho.desde), "-t", String(gancho.dur), "-i", path.join(CRUDOS, gancho.archivo));
    f.push(`[${n}:v]fps=30,scale=1080:1920:flags=lanczos,setsar=1,format=yuv420p,setpts=PTS-STARTPTS[g];[0:v]fps=30,setsar=1,format=yuv420p[b];[g][b]concat=n=2:v=1[v]`);
    vmap = "[v]"; n++;
  }
  const pistas = [];
  if (efectos) {
    const lista = [...(gancho?.efectos ?? []), ...EFECTOS.map(([t, ...r]) => [t + corr, ...r])];
    for (const [t, arch, desde, dur, db] of lista) {
      ins.push("-ss", String(desde), "-t", String(dur), "-i", path.join(SND, arch + ".mp3"));
      f.push(`[${n}:a]aresample=44100,aformat=channel_layouts=stereo,volume=${db}dB,afade=t=in:d=0.02,afade=t=out:st=${Math.max(0, dur - 0.08).toFixed(2)}:d=0.08,adelay=${Math.round(t * 1000)}:all=1[e${n}]`);
      pistas.push(`[e${n}]`); n++;
    }
  }
  if (cancion) {
    ins.push("-t", String(total), "-i", path.join(SND, cancion + ".mp3"));
    const vol = efectos ? -11 : -4;
    f.push(`[${n}:a]aresample=44100,aformat=channel_layouts=stereo,volume=${vol}dB,afade=t=in:d=0.3,afade=t=out:st=${(total - 1.5).toFixed(2)}:d=1.5[m]`);
    pistas.push("[m]"); n++;
  }
  f.push(pistas.length > 1 ? `${pistas.join("")}amix=inputs=${pistas.length}:normalize=0:duration=longest,alimiter=limit=0.7:level=0[a]` : `${pistas[0]}alimiter=limit=0.7:level=0[a]`);
  const salida = path.join(OUT, nombre);
  ff([...ins, "-filter_complex", f.join(";"), "-map", vmap, "-map", "[a]",
    ...(gancho ? ["-c:v", "libx264", "-crf", "18", "-preset", "medium"] : ["-c:v", "copy"]),
    "-t", total.toFixed(3), "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", salida]);
  console.log("ok", nombre);
}

const P = "2026-11-15-envolver-y-caja-v5-";
const AR = "Video7y10-guardando-alfajor-desde-arriba-toma-4.mp4";
if (!process.env.SOLO_FALTAN) {
  armar(P + "a-efectos.mp4", { efectos: true });
  armar(P + "b-efectos-y-cancion.mp4", { efectos: true, cancion: "m24" });
}
armar(P + "c-cancion-jazz.mp4", { cancion: "m24" });
armar(P + "d-cancion-lofi.mp4", { cancion: "m765" });
armar(P + "e-gancho-logo.mp4", { efectos: true, cancion: "m24",
  gancho: { archivo: AR, desde: 12.0, dur: 1.4, efectos: [[0.0, "foil3", 3.0, 1.4, -2]] } });
armar(P + "f-gancho-caja-llena.mp4", { efectos: true, cancion: "m24",
  gancho: { archivo: AR, desde: 0.2, dur: 1.5, efectos: [[0.0, "foil3", 8.0, 1.5, -5], [0.6, "taps", 1.0, 0.4, -10]] } });
