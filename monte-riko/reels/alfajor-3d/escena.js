import * as THREE from "./assets/lib/three.module.min.js";

// ---------- Render ----------
const canvas = document.getElementById("escena");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(2); // se dibuja al doble y se achica: bordes más finos
renderer.setSize(1080, 1920, false);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
const fondo = new THREE.Color("#3a2418");
scene.background = fondo;
scene.fog = new THREE.Fog("#3a2418", 16, 34);
const camera = new THREE.PerspectiveCamera(34, 1080 / 1920, 0.1, 100);

const key = new THREE.DirectionalLight("#ffd2a1", 2.6);
key.position.set(4, 8, 5);
key.castShadow = true;
key.shadow.mapSize.set(4096, 4096);
Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6 });
key.shadow.radius = 6;
key.shadow.bias = -0.0008;
scene.add(key);
const rim = new THREE.DirectionalLight("#9fc4ff", 0.7);
rim.position.set(-5, 4, -6);
scene.add(rim);
const cielo = new THREE.HemisphereLight("#ffe9d2", "#4a2a1a", 0.9);
scene.add(cielo);

const mat = (c, extra = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.75, ...extra });
const sombra = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };

// ---------- Utilidades de tiempo (todo depende solo de t) ----------
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const ease = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };
const tramo = (t, a, b) => ease((t - a) / (b - a));
const lineal = (t, a, b) => clamp01((t - a) / (b - a));
const entre = (t, a, b) => t >= a && t < b;
const mezcla = (a, b, k) => a + (b - a) * k;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const arco = (desde, hasta, k, alto) => {
  const p = desde.clone().lerp(hasta, k);
  p.y += Math.sin(k * Math.PI) * alto;
  return p;
};
const seed = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- Cocina ----------
for (let i = 0; i < 9; i++) {
  const tabla = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.4, 9), mat(i % 2 ? "#b9824f" : "#a87143"));
  tabla.position.set(-5.7 + i * 1.44, -0.2, 0);
  tabla.receiveShadow = true;
  scene.add(tabla);
}
const pared = new THREE.Mesh(new THREE.BoxGeometry(14, 6, 0.2), mat("#4a2e1f"));
pared.position.set(0, 3, -2.4);
pared.receiveShadow = true;
scene.add(pared);
const tablaAmasar = sombra(new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.14, 2.6), mat("#e2c39b")));
tablaAmasar.position.set(0.3, 0.07, 0.6);
scene.add(tablaAmasar);

// Heladera con freezer arriba: las puertas giran desde la izquierda
const helX = 3.0, helZ = -1.15;
const caraFria = mat("#d8ecf6", { emissive: "#9cc8e0", emissiveIntensity: 0.35 });
const blancoHel = mat("#f2efe9", { roughness: 0.4 });
const helCuerpo = sombra(new THREE.Mesh(new THREE.BoxGeometry(1.3, 2.7, 1.1), [blancoHel, blancoHel, blancoHel, blancoHel, caraFria, blancoHel]));
helCuerpo.position.set(helX, 1.35, helZ);
scene.add(helCuerpo);
const puerta = (y, alto) => {
  const g = new THREE.Group();
  g.position.set(helX - 0.65, y, helZ + 0.57);
  const p = sombra(new THREE.Mesh(new THREE.BoxGeometry(1.3, alto, 0.06), blancoHel));
  p.position.x = 0.65;
  const manija = new THREE.Mesh(new THREE.BoxGeometry(0.06, alto * 0.45, 0.06), mat("#b8bcc4", { metalness: 0.6, roughness: 0.3 }));
  manija.position.set(1.15, 0, 0.07);
  g.add(p, manija);
  scene.add(g);
  return g;
};
const puertaFreezer = puerta(2.25, 0.86);
const puertaHeladera = puerta(0.88, 1.68);
const abrir = (p, k) => { p.rotation.y = -k * 1.7; };

// Horno sobre la mesada: la puerta baja desde abajo
const hornoX = -2.95, hornoZ = -1.0;
const hornoCuerpo = sombra(new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.25, 1.2), mat("#3b3b42", { roughness: 0.5 })));
hornoCuerpo.position.set(hornoX, 0.625, hornoZ);
scene.add(hornoCuerpo);
const hornoInterior = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.8), mat("#1b1210", { emissive: "#ff7a1a", emissiveIntensity: 0 }));
hornoInterior.position.set(hornoX, 0.55, hornoZ + 0.601);
scene.add(hornoInterior);
const hornoPuerta = new THREE.Group();
hornoPuerta.position.set(hornoX, 0.12, hornoZ + 0.63);
const hpMarco = sombra(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.86, 0.06), mat("#2b2b30", { roughness: 0.45 })));
hpMarco.position.y = 0.43;
const vidrio = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.5), mat("#201512", { emissive: "#ff7a1a", emissiveIntensity: 0, roughness: 0.2 }));
vidrio.position.set(0, 0.45, 0.035);
const hpManija = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 0.06), mat("#c9ccd2", { metalness: 0.7, roughness: 0.3 }));
hpManija.position.set(0, 0.78, 0.08);
hornoPuerta.add(hpMarco, vidrio, hpManija);
scene.add(hornoPuerta);
for (let i = 0; i < 3; i++) {
  const perilla = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 24), mat("#c9ccd2", { metalness: 0.6 }));
  perilla.rotation.x = Math.PI / 2;
  perilla.position.set(hornoX - 0.4 + i * 0.4, 1.12, hornoZ + 0.62);
  scene.add(perilla);
}
const hornoLuz = new THREE.PointLight("#ff8a3a", 0, 4, 2);
hornoLuz.position.set(hornoX, 0.7, hornoZ + 1.0);
scene.add(hornoLuz);

// Bolsa de harina de fondo
const bolsa = sombra(new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.15, 0.55), mat("#f3ece2")));
bolsa.position.set(-1.7, 0.58, -1.9); bolsa.rotation.y = 0.4;
scene.add(bolsa);
const etiq = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.32, 0.57), mat("#ff6900"));
etiq.position.set(-1.7, 0.62, -1.9); etiq.rotation.y = 0.4;
scene.add(etiq);

// ---------- Texturas: logo del delantal, sticker y papel dorado ----------
const cargar = (src) => new Promise((ok) => { const img = new Image(); img.onload = () => ok(img); img.onerror = () => ok(null); img.src = src; });
const logoCanvas = document.createElement("canvas"); logoCanvas.width = 1230; logoCanvas.height = 500;
const logoTex = new THREE.CanvasTexture(logoCanvas); logoTex.colorSpace = THREE.SRGBColorSpace; logoTex.anisotropy = 8;
const stickerCanvas = document.createElement("canvas"); stickerCanvas.width = stickerCanvas.height = 512;
const stickerTex = new THREE.CanvasTexture(stickerCanvas); stickerTex.colorSpace = THREE.SRGBColorSpace; stickerTex.anisotropy = 8;
const oroCanvas = document.createElement("canvas"); oroCanvas.width = 1024; oroCanvas.height = 256;
{
  const c = oroCanvas.getContext("2d");
  c.fillStyle = "#e1b552"; c.fillRect(0, 0, 1024, 256);
  c.fillStyle = "#b98a2c";
  const estrella = (x, y, r) => { c.beginPath(); for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 - Math.PI / 2; const rr = i % 2 ? r * 0.45 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); };
  for (let y = 0; y < 5; y++) for (let x = 0; x < 20; x++) estrella(x * 52 + (y % 2) * 26 + 13, y * 52 + 26, 10);
}
const oroTex = new THREE.CanvasTexture(oroCanvas); oroTex.colorSpace = THREE.SRGBColorSpace; oroTex.wrapS = THREE.RepeatWrapping;
const texturasListas = Promise.all([cargar("assets/logo-blanco.svg"), cargar("assets/logo-color.svg")]).then(([blanco, color]) => {
  if (blanco) logoCanvas.getContext("2d").drawImage(blanco, 0, 0, 1230, 500);
  logoTex.needsUpdate = true;
  const c = stickerCanvas.getContext("2d");
  c.fillStyle = "#111"; c.beginPath(); c.arc(256, 256, 256, 0, Math.PI * 2); c.fill();
  if (color) c.drawImage(color, 76, 190, 360, 146);
  stickerTex.needsUpdate = true;
});

// ---------- El pastelero ----------
const pj = new THREE.Group();
const blanco = mat("#f7f3ee"), piel = mat("#f0b58c"), negro = mat("#1a1a1a");
const cuerpo = sombra(new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 1.0, 40), blanco));
cuerpo.position.y = 0.95;
const doble = { side: THREE.DoubleSide };
const delantal = new THREE.Group();
const falda = sombra(new THREE.Mesh(new THREE.CylinderGeometry(0.485, 0.535, 0.6, 48, 1, true, -1.05, 2.1), mat("#ff6900", doble)));
falda.position.y = 0.7;
const pechera = sombra(new THREE.Mesh(new THREE.CylinderGeometry(0.448, 0.478, 0.38, 32, 1, true, -0.5, 1.0), mat("#ff6900", doble)));
pechera.position.y = 1.18;
const cintura = new THREE.Mesh(new THREE.CylinderGeometry(0.488, 0.49, 0.07, 64, 1, true), mat("#d95500", doble));
cintura.position.y = 1.0;
const tira = (lado) => { const t = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.26, 0.03), mat("#d95500")); t.position.set(0.19 * lado, 1.47, 0.33); t.rotation.set(-0.5, 0, 0.35 * lado); return t; };
const logoAlto = 0.29, logoY = 0.7, rFalda = (y) => 0.535 - 0.05 * (y - 0.4) / 0.6 + 0.004;
const logoAng = 0.71 / rFalda(logoY);
const logo = new THREE.Mesh(
  new THREE.CylinderGeometry(rFalda(logoY + logoAlto / 2), rFalda(logoY - logoAlto / 2), logoAlto, 32, 1, true, -logoAng / 2, logoAng),
  new THREE.MeshStandardMaterial({ map: logoTex, emissive: "#ffffff", emissiveMap: logoTex, emissiveIntensity: 0.35, transparent: true, roughness: 0.8, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 })
);
logo.position.y = logoY;
delantal.add(falda, pechera, cintura, tira(-1), tira(1), logo);
const piernaI = sombra(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.5, 20), mat("#2d2d36")));
piernaI.position.set(-0.18, 0.25, 0);
const piernaD = piernaI.clone(); piernaD.position.x = 0.18;
const cabezaG = new THREE.Group(); cabezaG.position.y = 1.72;
const cabeza = sombra(new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 6), piel));
const ojoI = new THREE.Mesh(new THREE.SphereGeometry(0.055, 20, 14), negro); ojoI.position.set(-0.14, 0.04, 0.38);
const ojoD = ojoI.clone(); ojoD.position.x = 0.14;
const nariz = new THREE.Mesh(new THREE.SphereGeometry(0.07, 20, 14), mat("#e89a72")); nariz.position.set(0, -0.06, 0.41);
const sonrisa = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.016, 8, 24, Math.PI), mat("#7a3b2a"));
sonrisa.position.set(0, -0.17, 0.375); sonrisa.rotation.set(0.25, 0, Math.PI);
const gorroBase = sombra(new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.34, 40), blanco)); gorroBase.position.y = 0.42;
const gorroPuff = sombra(new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 6), blanco)); gorroPuff.position.y = 0.72; gorroPuff.scale.set(1.05, 0.75, 1.05);
cabezaG.add(cabeza, ojoI, ojoD, nariz, sonrisa, gorroBase, gorroPuff);
const brazo = (lado) => {
  const g = new THREE.Group(); g.position.set(0.5 * lado, 1.32, 0.05);
  const b = sombra(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 1, 20), blanco)); b.position.y = -0.5;
  const m = sombra(new THREE.Mesh(new THREE.IcosahedronGeometry(0.13, 4), piel)); m.position.y = -1.0;
  const largo = new THREE.Group(); largo.add(b);
  g.add(largo, m); g.userData = { largo, mano: m }; return g;
};
const abajo = V(0, -1, 0), tmp = new THREE.Vector3();
const apuntar = (br, objetivo) => {
  tmp.copy(objetivo); pj.worldToLocal(tmp); tmp.sub(br.position);
  const L = Math.min(1.25, Math.max(0.7, tmp.length()));
  br.quaternion.setFromUnitVectors(abajo, tmp.normalize());
  br.userData.largo.scale.y = L; br.userData.mano.position.y = -L;
};
const brazoI = brazo(-1), brazoD = brazo(1);
pj.add(cuerpo, delantal, piernaI, piernaD, cabezaG, brazoI, brazoD);
scene.add(pj);

// Palo de amasar
const palo = new THREE.Group();
const rodillo = sombra(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.5, 40), mat("#d9a86c"))); rodillo.rotation.z = Math.PI / 2;
const manijaI = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.36, 20), mat("#b07a44")); manijaI.rotation.z = Math.PI / 2; manijaI.position.x = -0.93;
const manijaD = manijaI.clone(); manijaD.position.x = 0.93;
palo.add(rodillo, manijaI, manijaD);
scene.add(palo);

// ---------- La masa, las tapas y los alfajores ----------
const chocoMasa = new THREE.Color("#5b3421"), escarcha = new THREE.Color("#b9d6e6");
const masaMat = mat("#5b3421", { roughness: 0.6 });
const masa = sombra(new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 6), masaMat));
scene.add(masa);

const R_TAPA = 0.2, H_TAPA = 0.06;
const tapaGeo = new THREE.CylinderGeometry(R_TAPA, R_TAPA * 0.97, H_TAPA, 48);
const tapaMat = mat("#4e2d1d", { roughness: 0.85 });
const tapas = [];
for (let i = 0; i < 6; i++) { const m = sombra(new THREE.Mesh(tapaGeo, tapaMat)); scene.add(m); tapas.push(m); }
// Dónde se cortan (y dónde quedan en la fuente): 3 x 2 sobre la tabla
const corte = (i) => V(0.3 + ((i % 3) - 1) * 0.5, 0, 0.6 + (i < 3 ? -0.25 : 0.25));
// Al enfriar se separan: las de adelante son la base, las de atrás van arriba
const enfria = (i) => V(0.3 + ((i % 3) - 1) * 0.9, 0, i < 3 ? 1.1 : 0.4);

const perfilDulce = [[0, 0], [0.17, 0], [0.175, 0.035], [0.16, 0.09], [0.125, 0.15], [0.08, 0.2], [0.04, 0.245], [0.012, 0.28], [0, 0.29]].map(([x, y]) => new THREE.Vector2(x, y));
const dulceGeo = new THREE.LatheGeometry(perfilDulce, 48);
const dulceMat = mat("#a9682b", { roughness: 0.3 });
const dulces = [0, 1, 2].map(() => { const m = sombra(new THREE.Mesh(dulceGeo, dulceMat)); scene.add(m); return m; });

// Cobertura de chocolate y papel dorado (solo el alfajor protagonista)
const perfilCaja = (r, h, rc) => {
  const pts = [new THREE.Vector2(0, 0)];
  for (let i = 0; i <= 6; i++) { const a = -Math.PI / 2 + (i / 6) * (Math.PI / 2); pts.push(new THREE.Vector2(r - rc + Math.cos(a) * rc, rc + Math.sin(a) * rc)); }
  for (let i = 0; i <= 6; i++) { const a = (i / 6) * (Math.PI / 2); pts.push(new THREE.Vector2(r - rc + Math.cos(a) * rc, h - rc + Math.sin(a) * rc)); }
  pts.push(new THREE.Vector2(0, h));
  return new THREE.LatheGeometry(pts, 64);
};
const cobertura = sombra(new THREE.Mesh(perfilCaja(0.218, 0.25, 0.035), mat("#2a1509", { roughness: 0.22 })));
scene.add(cobertura);
const oro = sombra(new THREE.Mesh(perfilCaja(0.226, 0.262, 0.04), new THREE.MeshStandardMaterial({ color: "#ffffff", map: oroTex, metalness: 0.35, roughness: 0.3, emissive: "#6b4a10", emissiveIntensity: 0.25 })));
scene.add(oro);
const sticker = new THREE.Mesh(new THREE.CircleGeometry(0.13, 48), new THREE.MeshStandardMaterial({ map: stickerTex, transparent: true, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2 }));
sticker.rotation.x = -Math.PI / 2;
scene.add(sticker);

// Fuente para llevar las tapas y los alfajores
const fuente = new THREE.Group();
const metal = mat("#b8bcc4", { metalness: 0.6, roughness: 0.35 });
const piso = sombra(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.04, 1.0), metal)); piso.position.y = 0.02;
fuente.add(piso);
[[0, 0.5, 1.5, 0.04], [0, -0.5, 1.5, 0.04], [0.75, 0, 0.04, 1.0], [-0.75, 0, 0.04, 1.0]].forEach(([x, z, w, d]) => {
  const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, d), metal); b.position.set(x, 0.06, z); fuente.add(b);
});
scene.add(fuente);

// Bowl de chocolate derretido y papel manteca
const perfilBowl = []; for (let i = 0; i <= 10; i++) perfilBowl.push(new THREE.Vector2(0.22 + Math.sin((i / 10) * Math.PI * 0.5) * 0.36, i * 0.04));
const bowl = sombra(new THREE.Mesh(new THREE.LatheGeometry(perfilBowl, 64), mat("#e9e4dc", { side: THREE.DoubleSide, roughness: 0.3 })));
const bowlX = -0.75, bowlZ = 0.55;
bowl.position.set(bowlX, 0.14, bowlZ);
scene.add(bowl);
const chocoBowl = new THREE.Mesh(new THREE.CircleGeometry(0.55, 64), mat("#2a1509", { roughness: 0.15 }));
chocoBowl.rotation.x = -Math.PI / 2; chocoBowl.position.set(bowlX, 0.45, bowlZ);
scene.add(chocoBowl);
const papel = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.8), mat("#f6eedb", { roughness: 0.9 }));
papel.rotation.x = -Math.PI / 2; papel.position.set(1.25, 0.142, 0.75); papel.receiveShadow = true;
scene.add(papel);

// Flecha curva para "panza para adentro"
const flecha = new THREE.Group();
const flechaMat = mat("#ffffff", { emissive: "#ffffff", emissiveIntensity: 0.5 });
const flechaArco = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.03, 12, 48, Math.PI * 0.9), flechaMat);
const flechaPunta = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.16, 20), flechaMat);
flechaPunta.position.set(0.36 * Math.cos(Math.PI * 0.9), 0.36 * Math.sin(Math.PI * 0.9), 0);
flechaPunta.rotation.z = Math.PI * 0.9 + Math.PI;
flecha.add(flechaArco, flechaPunta);
flecha.rotation.y = -Math.PI / 2;
scene.add(flecha);

// ---------- Partículas: harina, frío, vapor y gotas ----------
const parts = (n, geo, m) => { const a = []; for (let i = 0; i < n; i++) { const p = new THREE.Mesh(geo, m); scene.add(p); a.push(p); } return a; };
const harina = parts(110, new THREE.SphereGeometry(0.025, 10, 8), mat("#fffaf0", { roughness: 1 }));
const frio = parts(40, new THREE.OctahedronGeometry(0.04, 0), mat("#eaf6ff", { emissive: "#bfe3ff", emissiveIntensity: 0.8 }));
const vaporMat = new THREE.MeshStandardMaterial({ color: "#ffffff", transparent: true, opacity: 0.35, roughness: 1, depthWrite: false });
const vapor = parts(18, new THREE.SphereGeometry(0.08, 16, 12), vaporMat);
const gotas = parts(8, new THREE.SphereGeometry(0.03, 12, 10), mat("#2a1509", { roughness: 0.2 }));
const brillos = parts(14, new THREE.OctahedronGeometry(0.035, 0), mat("#fff4c2", { emissive: "#ffd56a", emissiveIntensity: 1.2 }));

// ---------- Cámara: tomas con cortes, como en las referencias ----------
// [inicio, fin, posición desde, posición hasta, mira desde, mira hasta]
const TOMAS = [
  [0, 2, [-5.0, 7.2, 8.0], [-3.6, 6.2, 7.2], [0.2, 1.05, 0.1], [0.2, 0.95, 0.1]],
  [2, 4, [2.5, 3.7, 5.3], [1.9, 3.4, 4.8], [0.3, 1.0, 0.0], [0.3, 0.95, 0.1]],
  [4, 6, [-0.6, 3.8, 6.4], [0.3, 3.4, 5.8], [2.0, 1.5, -0.7], [2.3, 1.6, -0.8]],
  [6, 8.6, [-1.8, 4.3, 5.4], [-1.0, 3.7, 4.8], [0.4, 0.8, 0.2], [0.3, 0.6, 0.4]],
  [8.6, 10, [2.3, 1.3, 2.3], [2.0, 1.15, 2.0], [0.9, 0.25, 0.6], [0.8, 0.2, 0.6]],
  [10, 12, [0.3, 5.4, 3.1], [0.55, 4.9, 2.7], [0.3, 0.1, 0.55], [0.3, 0.1, 0.6]],
  [12, 14, [0.2, 3.1, 5.2], [0.9, 2.8, 4.7], [2.5, 1.0, -0.7], [2.7, 1.0, -0.8]],
  [14, 16, [-0.4, 2.9, 4.8], [-1.0, 2.6, 4.3], [-2.4, 0.8, -0.6], [-2.6, 0.7, -0.7]],
  [16, 17.2, [-2.2, 1.45, 2.5], [-2.45, 1.3, 2.05], [-2.9, 0.65, -0.4], [-2.9, 0.6, -0.4]],
  [17.2, 18, [1.9, 3.7, 4.3], [1.6, 3.5, 4.0], [0.3, 0.3, 0.7], [0.3, 0.3, 0.7]],
  [18, 20, [1.3, 1.55, 2.75], [0.95, 1.35, 2.45], [0.3, 0.3, 1.0], [0.3, 0.3, 0.95]],
  [20, 22, [-1.2, 2.6, 3.8], [-0.7, 2.3, 3.5], [0.3, 0.3, 0.8], [0.3, 0.3, 0.8]],
  [22, 26, [0.0, 2.7, 4.8], [0.8, 2.5, 4.2], [2.6, 1.0, -0.7], [2.8, 1.0, -0.8]],
  [26, 28.4, [0.9, 2.6, 3.4], [0.4, 2.3, 3.0], [-0.5, 0.85, 0.45], [-0.6, 0.8, 0.45]],
  [28.4, 30, [2.4, 1.6, 2.6], [2.1, 1.4, 2.3], [1.2, 0.3, 0.75], [1.2, 0.3, 0.75]],
  [30, 32.2, [2.0, 1.0, 1.9], [1.55, 0.9, 1.75], [1.25, 0.25, 0.75], [1.25, 0.25, 0.75]],
  [32.2, 36, [3.3, 2.9, 7.4], [2.9, 2.6, 6.7], [0.85, 1.05, 0.0], [0.85, 1.0, 0.05]],
];
const camara = (t) => {
  const s = TOMAS.find(([a, b]) => t >= a && t < b) || TOMAS[TOMAS.length - 1];
  const k = ease((t - s[0]) / (s[1] - s[0]));
  camera.position.set(...s[2].map((v, i) => mezcla(v, s[3][i], k)));
  camera.lookAt(...s[4].map((v, i) => mezcla(v, s[5][i], k)));
};

// ---------- Posiciones clave ----------
const TABLA_Y = 0.14;
const masaTabla = V(0.3, TABLA_Y, 0.4);
const enFreezer = V(helX, 2.2, helZ + 0.2);
const enHeladera = V(helX, 0.95, helZ + 0.15);
const enHorno = V(hornoX, 0.32, hornoZ + 0.1);
const fuenteTabla = V(0.3, TABLA_Y, 0.6);
const fuenteFinal = V(0.3, TABLA_Y, 1.0);
const PJ_BASE = V(0.3, TABLA_Y, -0.78);

// Fuente: dónde está y con qué escala (0 = escondida)
function fuenteEn(t) {
  if (t < 11.2) return [fuenteTabla, 0];
  if (t < 12.2) return [fuenteTabla, tramo(t, 11.2, 11.6)];
  if (t < 13.0) return [arco(fuenteTabla, enHeladera, tramo(t, 12.2, 13.0), 1.0), 1];
  if (t < 14.0) return [enHeladera, 1];
  if (t < 14.9) return [arco(enHeladera, enHorno, tramo(t, 14.0, 14.9), 1.4), 1];
  if (t < 17.0) return [enHorno, 1];
  if (t < 17.6) return [arco(enHorno, fuenteTabla, tramo(t, 17.0, 17.6), 1.0), 1 - tramo(t, 17.45, 17.6)];
  if (t < 22.0) return [fuenteTabla, 0];
  if (t < 22.6) return [fuenteFinal, tramo(t, 22.0, 22.3)];
  if (t < 23.4) return [arco(fuenteFinal, enHeladera, tramo(t, 22.6, 23.4), 1.0), 1];
  if (t < 25.4) return [enHeladera, 1];
  if (t < 26.0) return [arco(enHeladera, fuenteFinal, tramo(t, 25.4, 26.0), 1.0), 1];
  return [fuenteFinal, 1];
}
const SLOT = (i) => V(((i % 3) - 1) * 0.5, 0.04, i < 3 ? -0.25 : 0.25);
const SLOT_ALF = (k) => V((k - 1) * 0.45, 0.04, 0);

// Centro del alfajor k (base) después de armado
function alfajorEn(k, t, fp) {
  const enTabla = V(enfria(k).x, TABLA_Y, enfria(k).z);
  if (t < 22.0) return enTabla;
  const enFuente = fp.clone().add(SLOT_ALF(k));
  if (t < 22.5) return arco(enTabla, enFuente, tramo(t, 22.0, 22.5), 0.4);
  if (k !== 1 || t < 26.1) return enFuente;
  // El protagonista: al bowl, se baña, al papel manteca
  const arriba = V(bowlX, 1.05, bowlZ), adentro = V(bowlX, 0.26, bowlZ), papelP = V(1.25, 0.145, 0.75);
  if (t < 26.7) return arco(enFuente, arriba, tramo(t, 26.1, 26.7), 0.3);
  if (t < 27.1) return arriba.clone().lerp(adentro, tramo(t, 26.7, 27.1));
  if (t < 27.4) return adentro;
  if (t < 27.9) return adentro.clone().lerp(arriba, tramo(t, 27.4, 27.9));
  if (t < 28.6) return arco(arriba, papelP, tramo(t, 27.9, 28.6), 0.2);
  if (t < 29.0) return papelP;
  // segundo baño de abajo: lo levanta, lo da vuelta y vuelve
  if (t < 29.8) { const p = papelP.clone(); p.y += Math.sin(lineal(t, 29.0, 29.8) * Math.PI) * 0.45; return p; }
  return papelP;
}

// Tiempo del video (con la voz) -> tiempo de la escena original: cada paso se estira lo que dura su frase
const TI = window.__TIEMPOS || { viejo: [0, 1], nuevo: [0, 1] };
function aEscena(tf) {
  const V0 = TI.viejo, N0 = TI.nuevo;
  for (let i = 0; i < N0.length - 1; i++) {
    if (tf <= N0[i + 1] || i === N0.length - 2) return V0[i] + (tf - N0[i]) * (V0[i + 1] - V0[i]) / (N0[i + 1] - N0[i]);
  }
  return tf;
}
function renderAt(tf) {
  const t = aEscena(tf);
  camara(t);
  const fp = fuenteEn(t);
  fuente.position.copy(fp[0]);
  fuente.scale.setScalar(Math.max(0.0001, fp[1]));
  fuente.visible = fp[1] > 0.001;

  // Puertas
  const kFreezer = Math.max(tramo(t, 4.0, 4.4) * (1 - tramo(t, 4.85, 5.2)), tramo(t, 5.85, 6.1) * (1 - tramo(t, 6.4, 6.7)));
  abrir(puertaFreezer, kFreezer);
  const kHel = Math.max(
    tramo(t, 12.1, 12.5) * (1 - tramo(t, 13.0, 13.3)), tramo(t, 13.8, 14.0) * (1 - tramo(t, 14.3, 14.6)),
    tramo(t, 22.5, 22.8) * (1 - tramo(t, 23.4, 23.7)), tramo(t, 25.2, 25.45) * (1 - tramo(t, 25.9, 26.2)));
  abrir(puertaHeladera, kHel);
  const kHorno = Math.max(tramo(t, 14.3, 14.7) * (1 - tramo(t, 14.95, 15.25)), tramo(t, 16.85, 17.05) * (1 - tramo(t, 17.6, 17.9)));
  hornoPuerta.rotation.x = kHorno * 1.45;
  const brasa = tramo(t, 15.0, 15.6) * (1 - tramo(t, 16.8, 17.2));
  vidrio.material.emissiveIntensity = brasa * 2.2 + Math.sin(t * 9) * 0.08 * brasa;
  hornoInterior.material.emissiveIntensity = Math.max(brasa, kHorno * (t > 16 ? 1 : 0.3)) * 1.6;
  hornoLuz.intensity = brasa * 3.0;

  // "Una noche": baja la luz un momento
  const noche = Math.sin(lineal(t, 4.95, 5.95) * Math.PI);
  key.intensity = 2.6 * (1 - 0.6 * noche);
  cielo.intensity = 0.9 * (1 - 0.4 * noche);
  scene.background = fondo.clone().lerp(new THREE.Color("#141a2a"), noche * 0.8);

  // ---- La masa ----
  let masaPos = masaTabla.clone(), sx = 1, sy = 1, sz = 1, masaVis = true;
  const rebote = Math.sin(lineal(t, 0.2, 0.6) * Math.PI) * 0.12;
  if (t < 2) { sx = sz = 1 + rebote; sy = 1 - rebote; }
  else if (t < 4.0) { const ap = Math.abs(Math.sin((t - 2) * Math.PI * 2.2)) * 0.14 * tramo(t, 2.0, 2.3); sx = sz = 1 + ap * 0.6; sy = 1 - ap; }
  else if (t < 5.0) { masaPos = arco(masaTabla, enFreezer, tramo(t, 4.1, 4.9), 1.2); masaVis = t < 4.95; }
  else if (t < 6.0) masaVis = false;
  else if (t < 6.6) masaPos = arco(enFreezer, masaTabla, tramo(t, 6.0, 6.6), 1.0);
  const aplasta = tramo(t, 6.7, 7.1), estira = tramo(t, 7.1, 9.8);
  const ancho = 1 + aplasta * 0.5 + estira * 0.85;
  const alto = 1 - aplasta * 0.55 - estira * 0.27;
  if (t >= 6.6) { sx = ancho; sy = alto; sz = ancho * 0.8; }
  const cortando = tramo(t, 10.0, 10.9);
  if (t >= 10) { sy = alto * (1 - cortando); masaVis = cortando < 0.98; }
  masa.visible = masaVis;
  masa.scale.set(sx, Math.max(0.01, sy), sz);
  masa.position.set(masaPos.x, masaPos.y + 0.5 * sy, masaPos.z);
  masa.rotation.y = t * 0.15;
  masaMat.color.copy(chocoMasa).lerp(escarcha, (1 - tramo(t, 6.4, 7.4)) * (t >= 6 ? 1 : 0));

  // ---- Las tapas ----
  for (let i = 0; i < 6; i++) {
    const m = tapas[i];
    const aparece = tramo(t, 10.15 + i * 0.12, 10.45 + i * 0.12);
    m.visible = aparece > 0.001;
    let p;
    if (t < 11.2) p = corte(i).add(V(0, TABLA_Y + H_TAPA / 2, 0));
    else if (t < 17.45) { p = fp[0].clone().add(SLOT(i)); p.y += H_TAPA / 2 + Math.sin(lineal(t, 11.2, 11.6) * Math.PI) * 0.1; }
    else if (t < 18) { const desde = enfria(i).clone(); desde.y = TABLA_Y; p = fp[0].clone().add(SLOT(i)).lerp(desde, tramo(t, 17.45, 17.9)); p.y = Math.max(p.y, TABLA_Y) + H_TAPA / 2; }
    else p = V(enfria(i).x, TABLA_Y + H_TAPA / 2, enfria(i).z);
    m.rotation.set(0, 0, 0);
    m.scale.setScalar(Math.max(0.0001, aparece));
    // Las de arriba se dan vuelta y caen sobre su base (panza para adentro)
    if (i >= 3 && t >= 19.8) {
      const k = i - 3, d = tramo(t, 19.8 + k * 0.25, 20.6 + k * 0.25);
      const base = enfria(k).clone(); base.y = TABLA_Y;
      const destino = base.clone().add(V(0, H_TAPA + 0.1 + H_TAPA / 2, 0));
      p = arco(p, destino, d, 0.55);
      m.rotation.x = d * Math.PI;
      if (t >= 22.0) { const c = alfajorEn(k, t, fp[0]); p = c.clone().add(V(0, H_TAPA + 0.1 + H_TAPA / 2, 0)); }
    }
    if (i < 3 && t >= 22.0) { const c = alfajorEn(i, t, fp[0]); p = c.clone().add(V(0, H_TAPA / 2, 0)); }
    m.position.copy(p);
  }
  // Dulce de leche: crece el copete y se aplasta al cerrar
  for (let k = 0; k < 3; k++) {
    const d = dulces[k];
    const orden = [1, 0, 2].indexOf(k), crece = tramo(t, 18.3 + orden * 0.35, 19.1 + orden * 0.35);
    const cierra = tramo(t, 20.4 + k * 0.25, 20.7 + k * 0.25);
    d.visible = crece > 0.001;
    const c = t >= 22 ? alfajorEn(k, t, fp[0]) : V(enfria(k).x, TABLA_Y, enfria(k).z);
    d.position.set(c.x, c.y + H_TAPA, c.z);
    d.scale.set(mezcla(1, 1.12, cierra) * crece, mezcla(1, 0.36, cierra) * crece, mezcla(1, 1.12, cierra) * crece);
  }
  flecha.visible = false; // probada: se confundía con un hilo de dulce
  flecha.position.set(0.3, TABLA_Y + 0.25, 0.75);
  flecha.scale.setScalar(tramo(t, 19.6, 19.9) * (1 - tramo(t, 20.8, 21.0)) + 0.0001);

  // ---- El protagonista: chocolate, papel dorado y sticker ----
  const heroe = alfajorEn(1, t, fp[0]);
  const giro = t >= 29.0 && t < 29.8 ? lineal(t, 29.0, 29.8) * Math.PI * 2 : 0;
  const bañado = t >= 27.1;
  cobertura.visible = bañado && t < 30.55;
  cobertura.position.copy(heroe);
  cobertura.rotation.set(giro, 0, 0);
  const envuelve = tramo(t, 30.2, 31.0);
  oro.visible = envuelve > 0.001;
  oro.position.copy(heroe);
  oro.scale.set(mezcla(1.25, 1, envuelve), envuelve, mezcla(1.25, 1, envuelve));
  oro.rotation.y = (1 - envuelve) * 3;
  const pega = tramo(t, 31.4, 31.85);
  sticker.visible = t >= 31.4;
  sticker.position.set(heroe.x, heroe.y + 0.264 + (1 - pega) * 0.7 + Math.sin(lineal(t, 31.85, 32.15) * Math.PI) * 0.02, heroe.z);
  sticker.rotation.z = (1 - pega) * 2;
  // Mientras está bañado, el alfajor de adentro no se ve
  if (bañado) for (const m of [tapas[1], tapas[4], dulces[1]]) m.visible = false;

  // ---- El pastelero ----
  pj.position.copy(PJ_BASE);
  if (t >= 26.0 && t < 29.0) pj.position.x = mezcla(0.3, -0.25, tramo(t, 26.0, 26.4)) ;
  if (t >= 29.0 && t < 32.2) pj.position.x = mezcla(-0.25, 0.65, tramo(t, 29.0, 29.4));
  if (t >= 32.2) pj.position.x = 0.65;
  const salto = Math.max(0, Math.sin(lineal(t, 0.3, 0.75) * Math.PI)) * 0.22 + Math.max(0, Math.sin(lineal(t, 32.3, 32.7) * Math.PI)) * 0.25;
  pj.position.y = TABLA_Y + salto;
  const respiro = Math.sin(t * Math.PI * 1.2) * 0.02;
  cuerpo.scale.set(1 + respiro, 1 - respiro, 1 + respiro);

  // Palo: aparece para estirar
  const conPalo = t >= 6.5 && t < 10.1;
  palo.visible = conPalo;
  const vaiven = Math.sin((t - 7.1) * Math.PI * 1.8) * 0.32 * lineal(t, 7.1, 7.3);
  const sobreMasa = TABLA_Y + alto * 0.5 + 0.16;
  palo.position.lerpVectors(V(0.3, 0.95, -0.25), V(0.3, sobreMasa + 0.02, 0.4 + vaiven), tramo(t, 6.6, 7.0));
  rodillo.rotation.x = -(vaiven / 0.16);

  // A dónde mira y apunta en cada momento
  let objI, objD, lean = 0.04;
  const sobre = (p, dy = 0.15) => p.clone().add(V(0, dy, 0));
  if (t < 2) { objI = V(-0.2, 0.7, 0.2); objD = V(0.8, 0.7, 0.2); }
  else if (t < 4.0) { const ap = Math.sin((t - 2) * Math.PI * 2.2); objI = masaTabla.clone().add(V(-0.15, 0.85 - Math.max(0, ap) * 0.2, 0)); objD = masaTabla.clone().add(V(0.15, 0.85 - Math.max(0, -ap) * 0.2, 0)); lean = 0.25; }
  else if (t < 6.6) { objI = V(-0.3, 0.8, 0.3); objD = masa.visible ? masa.position.clone() : V(1.4, 1.6, -0.2); }
  else if (t < 10.1) { objI = V(palo.position.x - 0.78, palo.position.y, palo.position.z); objD = V(palo.position.x + 0.78, palo.position.y, palo.position.z); lean = 0.04 + tramo(t, 6.6, 7.0) * (0.26 + vaiven * 0.35); }
  else if (t < 11.2) { const i = Math.min(5, Math.floor((t - 10.1) / 0.18)); objD = sobre(corte(i).add(V(0, TABLA_Y, 0)), 0.2); objI = V(-0.3, 0.7, 0.3); lean = 0.3; }
  else if (t < 18.0) { objD = sobre(fp[0], 0.3); objI = V(-0.3, 0.75, 0.2); lean = 0.15; }
  else if (t < 22.0) { objI = sobre(V(enfria(1).x, TABLA_Y, enfria(1).z), 0.35); objD = tapas[4].position.clone().add(V(0, 0.1, 0)); lean = 0.3; }
  else if (t < 26.1) { objD = sobre(fp[0], 0.3); objI = V(-0.3, 0.75, 0.2); lean = 0.15; }
  else if (t < 30.0) { objI = heroe.clone().add(V(-0.24, 0.12, 0)); objD = heroe.clone().add(V(0.24, 0.12, 0)); lean = 0.3; }
  else if (t < 32.2) { objI = heroe.clone().add(V(-0.3, 0.2, 0)); objD = heroe.clone().add(V(0.3, 0.25, 0)); lean = 0.28; }
  else { objI = V(pj.position.x - 0.6, 0.35, -0.6); objD = V(pj.position.x + 0.75, 2.4 + Math.sin(t * Math.PI * 4) * 0.12, -0.55 + Math.sin(t * Math.PI * 4) * 0.3); lean = 0; }
  // Gira el cuerpo hacia lo que hace (la heladera y el horno quedan a los costados)
  const mira = (objD.x + objI.x) / 2 - pj.position.x, miraZ = (objD.z + objI.z) / 2 - pj.position.z;
  pj.rotation.set(0, 0, 0);
  pj.rotation.y = Math.max(-0.9, Math.min(0.9, Math.atan2(mira, Math.max(0.4, miraZ)))) * (t >= 32.2 ? 0 : 1);
  pj.rotation.x = lean;
  cabezaG.rotation.set(-0.05 + (t >= 6.6 && t < 10.1 ? Math.sin((t - 6.95) * Math.PI * 1.8) * 0.1 : 0), Math.sin(t * 0.9) * 0.1, t >= 32.2 ? Math.sin(t * 5) * 0.08 : 0);
  pj.updateMatrixWorld(true);
  apuntar(brazoI, objI);
  apuntar(brazoD, objD);

  // ---- Partículas ----
  for (let i = 0; i < harina.length; i++) {
    const t0 = 0.1 + seed(i + 7) * 0.6, f = lineal(t, t0, t0 + 0.7);
    const h = harina[i];
    h.position.set(0.3 + (seed(i + 31) - 0.5) * 2.8, TABLA_Y + 0.02 + (1 - ease(f)) * 3.2, 0.6 + (seed(i + 59) - 0.5) * 2.2);
    h.visible = t >= t0 && t < 10.0;
  }
  const frioK = Math.max(lineal(t, 4.95, 5.2) * (1 - lineal(t, 5.8, 6.0)), lineal(t, 13.0, 13.2) * (1 - lineal(t, 13.8, 14.0)), lineal(t, 23.5, 23.7) * (1 - lineal(t, 25.1, 25.3)));
  for (let i = 0; i < frio.length; i++) {
    const f = frio[i];
    f.visible = frioK > 0.01;
    const fase = (t * 0.6 + seed(i)) % 1;
    f.position.set(helX + (seed(i + 3) - 0.5) * 1.5, 0.3 + seed(i + 9) * 2.6 + fase * 0.3, helZ + 0.7 + seed(i + 5) * 0.3);
    f.scale.setScalar(frioK * (0.5 + 0.5 * Math.sin((t + seed(i)) * 9) ** 2) + 0.0001);
    f.rotation.set(t * 2 + i, t * 3, 0);
  }
  for (let i = 0; i < vapor.length; i++) {
    const v = vapor[i], tapa = enfria(i % 6);
    const fase = (t * 0.7 + seed(i + 11)) % 1;
    v.visible = entre(t, 17.6, 18.9);
    v.position.set(tapa.x + (seed(i + 2) - 0.5) * 0.2, TABLA_Y + 0.15 + fase * 0.8, tapa.z + (seed(i + 4) - 0.5) * 0.2);
    v.scale.setScalar((0.6 + fase) * (1 - fase) * 1.6 + 0.0001);
  }
  vaporMat.opacity = 0.35 * (1 - tramo(t, 18.5, 18.9));
  for (let i = 0; i < gotas.length; i++) {
    const g = gotas[i], t0 = 27.5 + seed(i + 21) * 0.5, f = lineal(t, t0, t0 + 0.45);
    g.visible = t >= t0 && f < 1 && t < 28.2;
    g.position.set(heroe.x + (seed(i) - 0.5) * 0.3, heroe.y - f * 0.9, heroe.z + (seed(i + 1) - 0.5) * 0.3);
  }
  for (let i = 0; i < brillos.length; i++) {
    const b = brillos[i], a = (i / brillos.length) * Math.PI * 2 + t * 2;
    const k = Math.sin(lineal(t, 30.3, 31.6) * Math.PI);
    b.visible = k > 0.01;
    b.position.set(heroe.x + Math.cos(a) * 0.4, heroe.y + 0.15 + Math.sin(a * 2) * 0.12, heroe.z + Math.sin(a) * 0.4);
    b.scale.setScalar(k + 0.0001);
    b.rotation.set(t * 4, t * 3, 0);
  }

  const kBowl = tramo(t, 25.8, 26.2);
  bowl.visible = chocoBowl.visible = kBowl > 0.001;
  bowl.scale.setScalar(kBowl + 0.0001); chocoBowl.scale.setScalar(kBowl + 0.0001);
  chocoBowl.position.y = TABLA_Y + 0.31 * kBowl;
  const kPapel = tramo(t, 27.8, 28.1);
  papel.visible = kPapel > 0.001; papel.scale.setScalar(kPapel + 0.0001);

  renderer.render(scene, camera);
}

window.addEventListener("hf-seek", (e) => renderAt(e.detail.time));
window.__renderAt = renderAt;
texturasListas.then(() => { renderAt(0); window.__escenaLista(); });
