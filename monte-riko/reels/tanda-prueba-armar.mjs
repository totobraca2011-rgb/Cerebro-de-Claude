// Tanda de reels de prueba "El alfajor por dentro" (10 de noviembre 2026).
// Mismo tema, distinto gancho, orden y duración. Uso: node armar.mjs [id...]
import { execFileSync } from "child_process";
import { writeFileSync, mkdirSync, existsSync } from "fs";

const D = "M:/reel-v2/crudos-noviembre";
const W = "M:/reel-v2/trabajo-noviembre/tanda-prueba";
const V = "M:/reel-v2/video";
const C = "zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p,eq=saturation=0.72:gamma=0.92,colorbalance=rm=-0.06:bm=0.05";
const GUSTOSO = "eq=saturation=1.3:gamma=1.05,colorbalance=rs=0.04:rm=0.11:gm=0.01:bm=-0.13:bh=-0.04";

// Tramos: toma, desde, dura, sonido (ganancia dB, corte de graves Hz, reducción de ruido), filtro del dulce
const T = {
  corte: ["0446", 13.5, 12.5, [22, 180, 1]],
  corteCorto: ["0446", 15.5, 9, [22, 180, 1]],
  capas: ["0446", 21, 5, [22, 180, 1]],
  copete: ["0481", 86, 6, [10, 120, 1], 1],
  copeteCorto: ["0481", 88, 3, [10, 120, 1], 1],
  cierre: ["0481", 101.5, 4, [10, 120, 1], 1],
  cierreCorto: ["0481", 102.5, 3, [10, 120, 1], 1],
  bano: ["0498", 12, 5, [6, 90, 0]],
  banoCorto: ["0498", 13, 3, [6, 90, 0]],
  apoyo: ["0500", 1.5, 2.5, [14, 160, 1]],
};

// Cada versión: tramos, textos (texto, desde, hasta, top, tamaño, resaltado)
const VERSIONES = [
  { id: "01-espera", tramos: ["corte"], textos: [["Esperá a que se abra.", 0, 4, 1380, 72]] },
  { id: "02-100-gramos", tramos: ["copeteCorto", "corteCorto"], textos: [["Lo que tiene adentro un alfajor de más de 100 gramos.", 0, 5, 200, 62]] },
  { id: "03-capas", tramos: ["corte"], textos: [["¿Cuántas capas contás?", 0, 8, 1380, 72]] },
  { id: "04-un-poquito-dulce", tramos: ["copete", "capas"], textos: [["Dijeron un poquito de dulce de leche.", 0, 6, 200, 66], ["Un poquito.", 2.5, 6, 470, 84, true]] },
  { id: "05-mandaselo", tramos: ["bano", "corteCorto"], textos: [["Mandáselo a quien te debe un alfajor.", 0, 5, 1150, 64]] },
  { id: "06-dieta", tramos: ["corte"], textos: [["No lo partas si estás a dieta.", 0, 4.5, 1380, 70]] },
  { id: "07-hecho-a-mano", tramos: ["cierre", "banoCorto", "corteCorto"], textos: [["Así es por dentro un alfajor hecho a mano en Mar del Plata.", 0, 4, 200, 60]] },
  { id: "08-15-segundos", tramos: ["copeteCorto", "cierreCorto", "banoCorto", "apoyo", "capas"], textos: [["Un alfajor de principio a fin, en 16 segundos.", 0, 3, 200, 62]] },
  { id: "09-nadie-muestra", tramos: ["banoCorto", "apoyo", "corteCorto"], textos: [["La parte que nadie te muestra de un alfajor.", 0, 3, 1150, 64]] },
];

const sh = (cmd, args, cwd) => execFileSync(cmd, args, { stdio: ["ignore", "inherit", "inherit"], cwd });
const pedidas = process.argv.slice(2);
mkdirSync(`${W}/placas`, { recursive: true });
mkdirSync(`${W}/salida`, { recursive: true });

for (const v of VERSIONES) {
  if (pedidas.length && !pedidas.includes(v.id)) continue;
  // Placas de texto transparentes con la letra de la marca
  const placas = v.textos.map(([texto, , , top, size, resaltar], i) => {
    const png = `${W}/placas/${v.id}-${i}.png`;
    const props = `${W}/placas/${v.id}-${i}.json`;
    writeFileSync(props, JSON.stringify({ texto, top, size, resaltar: !!resaltar }));
    if (!existsSync(png)) execFileSync(`npx remotion still src/index.ts ChistePlaca "${png}" --props="${props}" --image-format=png --log=error`, { cwd: V, shell: true, stdio: ["ignore", "inherit", "inherit"] });
    return png;
  });
  const args = [];
  v.tramos.forEach((k) => { const [toma, ss, dur] = T[k]; args.push("-ss", String(ss), "-t", String(dur), "-i", `${D}/IMG_${toma}.MOV`); });
  const total = v.tramos.reduce((s, k) => s + T[k][2], 0);
  placas.forEach((p) => args.push("-loop", "1", "-t", String(total), "-i", p));
  let f = "", cat = "";
  v.tramos.forEach((k, i) => {
    const [, , , [g, hp, nr], dulce] = T[k];
    f += `[${i}:v]${C}${dulce ? "," + GUSTOSO : ""},scale=1080:1920,fps=30,setsar=1,format=yuv420p[v${i}];`;
    f += `[${i}:a]aformat=sample_rates=48000:channel_layouts=stereo,highpass=f=${hp}${nr ? ",afftdn=nf=-30" : ""},volume=${g}dB[a${i}];`;
    cat += `[v${i}][a${i}]`;
  });
  f += `${cat}concat=n=${v.tramos.length}:v=1:a=1[v][a];`;
  let ult = "v";
  v.textos.forEach(([, desde, hasta], i) => {
    f += `[${ult}][${v.tramos.length + i}:v]overlay=0:0:enable='between(t,${desde},${hasta})'[t${i}];`;
    ult = `t${i}`;
  });
  f += `[a]loudnorm=I=-18:TP=-2:LRA=11,alimiter=limit=0.79:level=false,afade=t=out:st=${total - 0.3}:d=0.3,aresample=48000[ao]`;
  const out = `${W}/salida/${v.id}.mp4`;
  sh("ffmpeg", ["-v", "error", "-y", ...args, "-filter_complex", f, "-map", `[${ult}]`, "-map", "[ao]", "-c:v", "libx264", "-crf", "19", "-preset", "medium", "-threads", "4", "-r", "30", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-t", String(total), out]);
  console.log("listo", v.id, total + " s");
}
