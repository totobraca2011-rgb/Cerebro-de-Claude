// Control de idioma (pedido de Tomás; observación 0001 del Task Observer, noviembre 2026).
// Al terminar cada turno revisa lo que Claude le escribió a Tomás en ese turno.
// Si algún párrafo salió en inglés, frena el cierre y pide repetirlo en castellano.
import { readFileSync } from "node:fs";

let input = "";
try { input = JSON.parse(readFileSync(0, "utf8") || "{}"); } catch { process.exit(0); }
if (input.stop_hook_active) process.exit(0); // ya se pidió una corrección: no entrar en bucle
let lines = [];
try { lines = readFileSync(input.transcript_path, "utf8").split("\n").filter(Boolean); } catch { process.exit(0); }

// Textos de Claude desde el último mensaje escrito por una persona
const texts = [];
for (let i = lines.length - 1; i >= 0; i--) {
  let e; try { e = JSON.parse(lines[i]); } catch { continue; }
  const c = e.message?.content;
  if (e.type === "user") {
    const humano = typeof c === "string" || (Array.isArray(c) && c.some(b => b.type === "text"));
    if (humano && !e.isMeta) break;
    continue;
  }
  if (e.type === "assistant" && Array.isArray(c))
    for (const b of c) if (b.type === "text" && b.text) texts.push(b.text);
}

const EN = new Set("the and is are you your i i'll i'm let me this that with it's it will was were have has for of to on now here there what which would should could just done let's we're can't don't".split(" "));
const ES = new Set("el la los las de del que y en con para por es son no lo un una se te tu vos al lo como más pero ya está están hay listo".split(" "));
const malos = [];
for (const t of texts) {
  for (const parr of t.replace(/```[\s\S]*?```/g, " ").replace(/`[^`]*`/g, " ").split(/\n\s*\n/)) {
    const words = parr.toLowerCase().replace(/https?:\S+/g, " ").match(/[a-záéíóúñü']+/g) || [];
    if (words.length < 5) continue;
    const en = words.filter(w => EN.has(w)).length;
    const es = words.filter(w => ES.has(w)).length;
    if (en >= 3 && en > es * 2) malos.push(parr.trim().slice(0, 120));
  }
}
if (malos.length) {
  console.log(JSON.stringify({
    decision: "block",
    reason: `Parte de tu respuesta a Tomás salió en inglés (${malos.map(m => `"${m}"`).join(" / ")}). Tomás no entiende inglés: volvé a escribirle esa respuesta completa en castellano rioplatense, con voseo.`
  }));
}
