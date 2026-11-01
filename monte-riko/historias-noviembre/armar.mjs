import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync, statSync } from "fs";
import { execFileSync } from "child_process";

const BASE = "M:/reel-v2/trabajo-noviembre/historias";
const REPO = "C:/Users/MARCOS/Documents/GitHub/Cerebro-de-Claude";
const V = "M:/reel-v2/video";
const dias = JSON.parse(readFileSync(`${BASE}/historias.json`, "utf8"));
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-");

const placas = [];
for (const d of dias) {
  let i = 0;
  for (const p of d.placas) {
    if (p.app) continue;
    i++;
    p.nombre = `${slug(d.dia)}-${i}`;
    placas.push({ ...p, semana: Math.floor((Number(d.dia.split(" ")[1]) - 2) / 7) + 1 });
  }
}
writeFileSync(`${V}/src/historias-data.ts`, `export const PLACAS: { t: string; s?: string }[] = ${JSON.stringify(placas.map(({ t, s }) => ({ t, s })))};\n`);

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const sh = (cmd) => execFileSync("cmd", ["/c", cmd], { cwd: V, stdio: "inherit" });
const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a], { stdio: "inherit" });

const capas = `${BASE}/capas`;
rmSync(capas, { recursive: true, force: true });
mkdirSync(capas, { recursive: true });
sh(`${npx} remotion bundle src/index.ts --out-dir=build`);
sh(`${npx} remotion render build Historias ${capas} --sequence --image-format=png --concurrency=2 --log=error`);
const pngs = readdirSync(capas).filter((x) => x.endsWith(".png")).sort();
if (pngs.length !== placas.length) throw new Error(`capas ${pngs.length} != placas ${placas.length}`);

const salida = `${BASE}/salida`;
rmSync(salida, { recursive: true, force: true });
placas.forEach((p, n) => {
  const dir = `${salida}/semana-${p.semana}`;
  mkdirSync(dir, { recursive: true });
  const capa = `${capas}/${pngs[n]}`;
  if (p.v) {
    const clip = (c) => (existsSync(`${V}/public/v/n/${c}.mp4`) ? `${V}/public/v/n/${c}.mp4` : `${V}/public/v/${c}.mp4`);
    const entradas = p.v.flatMap((c) => ["-i", clip(c)]);
    const m = p.v.length;
    const unir = p.v.map((_, i) => `[${i}:v]`).join("") + `concat=n=${m}:v=1:a=0[b];[b][${m}:v]overlay=0:0,format=yuv420p[o]`;
    ff(...entradas, "-i", capa, "-filter_complex", unir, "-map", "[o]", "-c:v", "libx264", "-crf", "25", "-preset", "medium", "-threads", "4", "-movflags", "+faststart", `${dir}/${p.nombre}.mp4`);
  } else {
    const foto = p.f ? `${REPO}/monte-riko/fotos-originales/${p.f}.jpg` : `${REPO}/monte-riko/fotos-proceso/${p.p}.jpg`;
    const [w, h] = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v", "-show_entries", "stream=width,height", "-of", "csv=p=0", foto]).toString().trim().split(",").map(Number);
    // Las fotos cuadradas van enteras sobre negro; las verticales ocupan toda la pantalla
    const base = w / h > 0.8
      ? "[0:v]scale=1080:-2[f];color=black:s=1080x1920[n];[n][f]overlay=0:640[b]"
      : "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920[b]";
    ff("-i", foto, "-i", capa, "-filter_complex", `${base};[b][1:v]overlay=0:0`, "-frames:v", "1", "-q:v", "3", "-update", "1", `${dir}/${p.nombre}.jpg`);
  }
});

let md = "";
for (const d of dias) {
  md += `\n### ${d.dia}: ${d.tema}\n`;
  for (const p of d.placas) {
    if (p.app) { md += `- **En la app:** ${p.app}\n`; continue; }
    const ext = p.v ? "mp4" : "jpg";
    md += `- \`${p.nombre}.${ext}\`: ${p.t}${p.n ? `. *${p.n}.*` : ""}\n`;
  }
}
writeFileSync(`${BASE}/calendario.md`, md);
console.log("placas", placas.length, "videos", placas.filter((p) => p.v).length);
