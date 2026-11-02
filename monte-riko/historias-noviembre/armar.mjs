import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync, statSync } from "fs";
import { execFileSync } from "child_process";

const BASE = "M:/reel-v2/trabajo-noviembre/historias";
const REPO = "C:/Users/MARCOS/Documents/GitHub/Cerebro-de-Claude";
const V = "M:/reel-v2/video";
const dias = JSON.parse(readFileSync(`${BASE}/historias.json`, "utf8"));
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-");

// Placas con el texto abajo porque el alfajor está arriba
const ABAJO = new Set(JSON.parse(readFileSync(`${BASE}/abajo.json`, "utf8")));
// Encuadre horizontal de las fotos cuadradas: 0 izquierda, 0.5 centro, 1 derecha
const ENCUADRE = { "caja-envio": 0.2, "mano-alfajor-frente": 0.75, "alfajor-papel-dorado": 0.45 };
// Sube el color del dulce de leche, que en estas tomas sale verdoso
const GUSTOSO = "eq=saturation=1.3:gamma=1.05,colorbalance=rs=0.04:rm=0.11:gm=0.01:bm=-0.13:bh=-0.04";
const lleva = (p) => (p.v ? p.v.some((c) => /^(r\d|p8|p9)$/.test(c)) : /^(dulce|patagonico)/.test(p.p || ""));

const placas = [];
for (const d of dias) {
  let i = 0;
  for (const p of d.placas) {
    if (p.app) continue;
    i++;
    p.nombre = `${slug(d.dia)}-${i}`;
    p.pos = ABAJO.has(p.nombre) ? "abajo" : "arriba";
    placas.push({ ...p, semana: Math.floor((Number(d.dia.split(" ")[1]) - 2) / 7) + 1 });
  }
}
writeFileSync(`${V}/src/historias-data.ts`, `export const PLACAS: { t: string; s?: string; pos?: string }[] = ${JSON.stringify(placas.map(({ t, s, pos }) => ({ t, s, pos })))};\n`);

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
    const color = lleva(p) ? `,${GUSTOSO}` : "";
    const unir = p.v.map((_, i) => `[${i}:v]`).join("") + `concat=n=${m}:v=1:a=0${color}[b];[b][${m}:v]overlay=0:0,format=yuv420p[o]`;
    ff(...entradas, "-i", capa, "-filter_complex", unir, "-map", "[o]", "-c:v", "libx264", "-crf", "25", "-preset", "medium", "-threads", "4", "-movflags", "+faststart", `${dir}/${p.nombre}.mp4`);
  } else {
    const foto = p.f ? `${REPO}/monte-riko/fotos-originales/${p.f}.jpg` : `${REPO}/monte-riko/fotos-proceso/${p.p}.jpg`;
    const x = ENCUADRE[p.f] ?? 0.5;
    const color = lleva(p) ? `,${GUSTOSO}` : "";
    const base = `[0:v]scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920:(iw-1080)*${x}:(ih-1920)/2${color}[b]`;
    ff("-i", foto, "-i", capa, "-filter_complex", `${base};[b][1:v]overlay=0:0`, "-frames:v", "1", "-q:v", "3", "-update", "1", `${dir}/${p.nombre}.jpg`);
  }
});

let md = "";
for (const d of dias) {
  md += `\n### ${d.dia}: ${d.tema}\n`;
  for (const p of d.placas) {
    if (p.app) { md += `- **En la app:** ${p.app}\n`; continue; }
    const ext = p.v ? "mp4" : "jpg";
    md += `- \`${p.nombre}.${ext}\`: ${p.t.replace(/\?$/, "?")}${p.n ? `${p.t.endsWith("?") ? "" : "."} **${/Encuesta|Caja de|Barra|Sticker/.test(p.n) ? "Sticker" : "Ojo"}:** ${p.n}.` : ""}\n`;
  }
}
writeFileSync(`${BASE}/calendario.md`, md);
console.log("placas", placas.length, "videos", placas.filter((p) => p.v).length);
