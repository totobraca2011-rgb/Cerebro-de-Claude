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

// Cuadro elegido de las placas que salían de video: toma y segundo
const CUADRO = {
  "lun-2-1": ["p1", 1], "lun-2-3": ["p16", 0.8], "jue-5-1": ["r2", 1.2], "lun-9-1": ["harina-mesada", 2],
  "mar-10-1": ["estirar-masa", 4], "jue-12-1": ["r2", 1.5], "vie-13-1": ["a2", 1], "lun-16-1": ["p4", 0.6],
  "mar-17-1": ["cortar-tapas", 7.5], "mie-18-1": ["b2", 1], "vie-20-1": ["b7", 1.5], "mar-24-1": ["a4", 2],
};

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
    // Tomás quiere las historias solo como imágenes: se toma un cuadro de la toma
    const clip = (c) => (existsSync(`${V}/public/v/n/${c}.mp4`) ? `${V}/public/v/n/${c}.mp4` : `${V}/public/v/${c}.mp4`);
    const [c, t] = CUADRO[p.nombre] ?? [p.v[p.v.length - 1], 1.2];
    const color = lleva(p) ? `,${GUSTOSO}` : "";
    ff("-ss", String(t), "-i", clip(c), "-i", capa, "-filter_complex", `[0:v]null${color}[b];[b][1:v]overlay=0:0`, "-frames:v", "1", "-q:v", "3", "-update", "1", `${dir}/${p.nombre}.jpg`);
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
    md += `- \`${p.nombre}.jpg\`: ${p.t.replace(/\?$/, "?")}${p.n ? `${p.t.endsWith("?") ? "" : "."} **${/Encuesta|Caja de|Barra|Sticker/.test(p.n) ? "Sticker" : "Ojo"}:** ${p.n}.` : ""}\n`;
  }
}
writeFileSync(`${BASE}/calendario.md`, md);
console.log("placas", placas.length, "videos", placas.filter((p) => p.v).length);
