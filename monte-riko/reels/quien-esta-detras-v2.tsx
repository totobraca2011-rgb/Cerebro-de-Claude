import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadRubik } from "@remotion/google-fonts/RubikMonoOne";
import { loadFont as loadMont } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily: rubik } = loadRubik("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
const { fontFamily: mont } = loadMont("normal", { weights: ["700", "800"], subsets: ["latin", "latin-ext"] });
const { fontFamily: playfair } = loadPlayfair("italic", { weights: ["700"], subsets: ["latin", "latin-ext"] });

const FPS = 30;
const ORANGE = "#FF6900";

// ---------- Cortes ----------
type Clip = {
  id: string; // toma, para ubicar tiempos con t()
  src: string;
  in: number; // segundos en la toma
  out: number;
  z: [number, number]; // zoom lento de principio a fin
  o?: string; // punto del zoom
  audio?: boolean;
  cut?: boolean; // tiene silueta recortada para el texto detrás
};

const CLIPS: Clip[] = [
  { id: "0404", src: "IMG_0404", in: 1.5, out: 2.96, z: [1.12, 1.18], o: "50% 30%", audio: true, cut: true },
  { id: "0404", src: "IMG_0404", in: 2.96, out: 4.76, z: [1.42, 1.5], o: "50% 27%", audio: true, cut: true },
  { id: "0404", src: "IMG_0404", in: 4.76, out: 6.3, z: [1.2, 1.28], o: "50% 30%", audio: true, cut: true },
  { id: "0413", src: "IMG_0413", in: 0.95, out: 4.35, z: [1.03, 1.12], o: "70% 15%", audio: true },
  { id: "0413", src: "IMG_0413", in: 4.95, out: 7.8, z: [1.2, 1.3], o: "75% 12%", audio: true },
  { id: "voz1", src: "apilar-tapas", in: 0.3, out: 1.95, z: [1.04, 1.12] },
  { id: "voz2", src: "estirar-masa", in: 1, out: 3.64, z: [1.05, 1.15] },
  { id: "voz3", src: "proceso-masa", in: 0.2, out: 3.16, z: [1.0, 1.1], o: "45% 42%" },
  { id: "voz4", src: "cortar-tapas", in: 6, out: 7.4, z: [1.08, 1.16] },
  { id: "foto", src: "foto", in: 0, out: 1.9, z: [1.0, 1.1] },
  { id: "voz6", src: "estirar-masa", in: 5, out: 6.85, z: [1.1, 1.2] },
  { id: "0417", src: "IMG_0417", in: 4.55, out: 8.8, z: [1.03, 1.12], o: "50% 15%", audio: true },
  { id: "0418", src: "IMG_0418", in: 1.85, out: 4.0, z: [1.0, 1.06], o: "80% 20%", audio: true },
  { id: "0418", src: "IMG_0418", in: 4.6, out: 7.05, z: [1.14, 1.22], o: "85% 18%", audio: true },
  { id: "0439", src: "IMG_0439", in: 0.6, out: 3.5, z: [1.02, 1.1], o: "45% 40%", audio: true },
  { id: "0439", src: "IMG_0439", in: 3.62, out: 5.0, z: [1.3, 1.38], o: "45% 38%", audio: true, cut: true },
  { id: "0439", src: "IMG_0439", in: 5.4, out: 7.25, z: [1.05, 1.12], o: "45% 40%", audio: true },
  { id: "0439", src: "IMG_0439", in: 7.3, out: 9.55, z: [1.3, 1.38], o: "45% 38%", audio: true, cut: true },
  { id: "0439", src: "IMG_0439", in: 9.55, out: 12.93, z: [1.02, 1.1], o: "45% 40%", audio: true },
];

type Placed = Clip & { from: number; dur: number };
const PLACED: Placed[] = (() => {
  let at = 0;
  return CLIPS.map((c) => {
    const dur = Math.round((c.out - c.in) * FPS);
    const p = { ...c, from: at, dur };
    at += dur;
    return p;
  });
})();
const CUT_END = PLACED[PLACED.length - 1].from + PLACED[PLACED.length - 1].dur;
const LOGO_DUR = 66;
const TOTAL = CUT_END + LOGO_DUR;

const VOZ_FROM = PLACED.find((c) => c.id === "voz1")!.from;
const VOZ_IN = 0.75;

// Pasa un segundo de la toma al cuadro del video final
const t = (id: string, s: number): number => {
  if (id === "voz") return VOZ_FROM + Math.round((s - VOZ_IN) * FPS);
  const c = PLACED.find((p) => p.id === id && s >= p.in && s < p.out);
  if (!c) throw new Error(`Sin clip para ${id} ${s}`);
  return c.from + Math.round((s - c.in) * FPS);
};

// ---------- Zoom compartido por video y silueta ----------
const clipStyle = (c: Placed, f: number): React.CSSProperties => {
  const p = f / c.dur;
  const slow = c.z[0] + (c.z[1] - c.z[0]) * p;
  const punch = 1 + 0.07 * (1 - Easing.out(Easing.cubic)(Math.min(1, f / 6)));
  return {
    transform: `scale(${slow * punch})`,
    transformOrigin: c.o ?? "50% 50%",
    filter: c.audio || c.src === "foto" ? "saturate(1.14) contrast(1.05)" : "brightness(.74) saturate(1.3) contrast(1.08)",
  };
};

const ClipVideo: React.FC<{ c: Placed }> = ({ c }) => {
  const f = useCurrentFrame();
  if (c.src === "foto") {
    return (
      <AbsoluteFill style={clipStyle(c, f)}>
        <Img src={staticFile("i/caja-cuatro-alfajores.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={clipStyle(c, f)}>
      <OffthreadVideo
        src={staticFile(`v/${c.src}.mp4`)}
        trimBefore={Math.round(c.in * FPS)}
        muted={!c.audio}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

const ClipCutout: React.FC<{ c: Placed }> = ({ c }) => {
  const f = useCurrentFrame();
  const n = Math.round(c.in * FPS) + f;
  return (
    <AbsoluteFill style={clipStyle(c, f)}>
      <Img src={staticFile(`cut/${c.src}/${n}.webp`)} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};

// ---------- Textos ----------
type Kind = "big" | "bigWhite" | "white" | "script" | "dark" | "scriptDark" | "pill";
type Word = { s: string; at: number; k: Kind; size?: number };
type Block = { from: number; to: number; y: number; lines: Word[][]; behind?: boolean; align?: "left" | "center"; x?: number };

const fit = (s: string, max = 170, width = 960) => Math.min(max, Math.floor(width / (s.length * 0.92)));

const styleOf = (w: Word): React.CSSProperties => {
  switch (w.k) {
    case "big":
      return {
        fontFamily: rubik,
        color: ORANGE,
        fontSize: w.size ?? fit(w.s),
        lineHeight: 1.02,
        textShadow: "0 6px 26px rgba(0,0,0,.45), 0 2px 0 rgba(0,0,0,.25)",
      };
    case "bigWhite":
      return {
        fontFamily: rubik,
        color: "#fff",
        fontSize: w.size ?? fit(w.s),
        lineHeight: 1.02,
        textShadow: "0 6px 26px rgba(0,0,0,.6)",
      };
    case "white":
      return {
        fontFamily: mont,
        fontWeight: 800,
        color: "#fff",
        fontSize: w.size ?? 62,
        lineHeight: 1.12,
        textShadow: "0 3px 16px rgba(0,0,0,.65)",
      };
    case "script":
      return {
        fontFamily: playfair,
        fontStyle: "italic",
        fontWeight: 700,
        color: "#fff",
        fontSize: w.size ?? 84,
        lineHeight: 1.08,
        textShadow: "0 3px 18px rgba(0,0,0,.65)",
      };
    case "dark":
      return { fontFamily: mont, fontWeight: 800, color: "#141414", fontSize: w.size ?? 62, lineHeight: 1.12 };
    case "scriptDark":
      return {
        fontFamily: playfair,
        fontStyle: "italic",
        fontWeight: 700,
        color: "#141414",
        fontSize: w.size ?? 84,
        lineHeight: 1.08,
      };
    case "pill":
      return {
        fontFamily: mont,
        fontWeight: 800,
        color: "#fff",
        background: ORANGE,
        borderRadius: 18,
        padding: "12px 30px",
        fontSize: w.size ?? 66,
        boxShadow: "0 8px 30px rgba(0,0,0,.3)",
      };
  }
};

const Pop: React.FC<{ w: Word; f: number }> = ({ w, f }) => {
  const { fps } = useVideoConfig();
  if (f < w.at) return <span style={{ ...styleOf(w), visibility: "hidden", display: "inline-block" }}>{w.s}</span>;
  const heavy = w.k === "big" || w.k === "bigWhite" || w.k === "pill";
  const sc = spring({ frame: f - w.at, fps, config: { damping: 13, stiffness: 240, mass: 0.6 } });
  const scale = interpolate(sc, [0, 1], [heavy ? 1.32 : 0.86, 1]);
  const op = Math.min(1, (f - w.at + 1) / 2);
  return <span style={{ ...styleOf(w), display: "inline-block", transform: `scale(${scale})`, opacity: op }}>{w.s}</span>;
};

const TextBlock: React.FC<{ b: Block }> = ({ b }) => {
  const f = useCurrentFrame();
  if (f < b.from || f >= b.to) return null;
  const left = b.align === "left";
  return (
    <div
      style={{
        position: "absolute",
        top: b.y,
        left: left ? b.x ?? 60 : 0,
        right: left ? undefined : 0,
        textAlign: left ? "left" : "center",
      }}
    >
      {b.lines.map((line, i) => (
        <div key={i} style={{ display: "flex", gap: 20, flexWrap: "nowrap", justifyContent: left ? "flex-start" : "center", alignItems: "baseline" }}>
          {line.map((word, j) => (
            <Pop key={j} w={word} f={f} />
          ))}
        </div>
      ))}
    </div>
  );
};

const w = (s: string, at: number, k: Kind, size?: number): Word => ({ s, at, k, size });

const BLOCKS: Block[] = [
  // Gancho, detrás de la cabeza
  {
    from: t("0404", 1.5), to: t("0404", 2.95), y: 215, behind: true,
    lines: [[w("¿Por qué vas", t("0404", 1.5), "script", 92)], [w("A ESPERAR", t("0404", 2.5), "big")]],
  },
  {
    from: t("0404", 2.96), to: t("0404", 4.75), y: 170, behind: true,
    lines: [[w("a tener todo", t("0404", 3.1), "script", 92)], [w("RESUELTO", t("0404", 4.12), "big")]],
  },
  {
    from: t("0404", 4.76), to: t("0404", 6.29), y: 140, behind: true,
    lines: [[w("para empezar", t("0404", 4.8), "script", 88)], [w("ALGO", t("0404", 5.54), "big", 120)], [w("GRANDE?", t("0404", 5.74), "big")]],
  },
  // Cocina
  {
    from: t("0413", 0.95), to: t("0413", 4.34), y: 760,
    lines: [
      [w("No todos los que", t("0413", 1.1), "white")],
      [w("llegan lejos", t("0413", 1.7), "script", 96)],
      [w("EMPIEZAN", t("0413", 2.3), "big", 130)],
      [w("SABIENDO", t("0413", 3.2), "big", 130)],
    ],
  },
  {
    from: t("0413", 4.95), to: t("0413", 7.79), y: 800,
    lines: [
      [w("La mayoría de cosas", t("0413", 5.02), "white", 58)],
      [w("SE APRENDEN", t("0413", 5.96), "big")],
      [w("mientras construís", t("0413", 6.72), "script", 96)],
    ],
  },
  // Voz en off
  {
    from: t("voz", 0.76), to: t("voz", 2.4), y: 760,
    lines: [[w("Yo, por ejemplo", t("voz", 0.76), "script", 100)]],
  },
  {
    from: t("voz", 2.4), to: t("voz", 5.0), y: 300,
    lines: [[w("Empecé sin tener idea", t("voz", 2.5), "white", 66)], [w("de cómo llevar", t("voz", 3.6), "script", 88)], [w("UN NEGOCIO", t("voz", 4.2), "big")]],
  },
  {
    from: t("voz", 5.04), to: t("voz", 6.8), y: 620,
    lines: [[w("Literalmente", t("voz", 5.04), "script", 96)], [w("NI IDEA", t("voz", 5.56), "big")]],
  },
  {
    from: t("voz", 6.84), to: t("voz", 8.0), y: 300,
    lines: [[w("Pero fue", t("voz", 6.84), "white", 66)], [w("TOMANDO", t("voz", 7.08), "big", 130)], [w("FORMA", t("voz", 7.46), "big", 130)]],
  },
  {
    from: t("voz", 8.0), to: t("voz", 9.4), y: 620,
    lines: [[w("y hoy con", t("voz", 8.0), "script", 96)], [w("16 AÑOS", t("voz", 8.42), "bigWhite", 165)]],
  },
  {
    from: t("voz", 9.4), to: t("voz", 11.3), y: 230,
    lines: [[w("tengo", t("voz", 9.4), "script", 96)], [w("MI PROPIA", t("voz", 9.8), "big", 130)], [w("MARCA", t("voz", 10.3), "big", 130)]],
  },
  {
    from: t("voz", 11.45), to: t("voz", 13.15), y: 300,
    lines: [[w("Y sigo", t("voz", 11.48), "white", 66)], [w("APRENDIENDO", t("voz", 11.76), "big")], [w("cómo hacerla crecer", t("voz", 12.44), "script", 90)]],
  },
  // Silla
  {
    from: t("0417", 4.6), to: t("0417", 5.72), y: 1150,
    lines: [[w("Por eso", t("0417", 4.68), "script", 110)]],
  },
  {
    from: t("0417", 5.72), to: t("0417", 8.79), y: 1040,
    lines: [
      [w("yo creo que muchas veces", t("0417", 5.76), "white", 54)],
      [w("no es necesario", t("0417", 6.56), "script", 92)],
      [w("TENER TODO", t("0417", 7.2), "big", 110)],
      [w("RESUELTO", t("0417", 7.8), "big", 130)],
    ],
  },
  // Piano
  {
    from: t("0418", 1.85), to: t("0418", 3.99), y: 170, align: "left", x: 50,
    lines: [
      [w("Necesitás", t("0418", 2), "scriptDark", 80)],
      [w("animarte", t("0418", 2.44), "scriptDark", 80)],
      [w("A DAR", t("0418", 2.9), "big", 78)],
      [w("EL PRIMER", t("0418", 3.06), "big", 78)],
      [w("PASO", t("0418", 3.48), "big", 124)],
    ],
  },
  {
    from: t("0418", 4.6), to: t("0418", 7.04), y: 1090,
    lines: [
      [w("y comprometerte", t("0418", 4.7), "script", 92)],
      [w("con lo que querés", t("0418", 5.36), "script", 92)],
      [w("LOGRAR", t("0418", 5.88), "big", 150)],
    ],
  },
  // Primer plano final
  {
    from: t("0439", 0.7), to: t("0439", 2.3), y: 230,
    lines: [
      [w("Soy", t("0439", 0.72), "scriptDark", 92)],
      [w("TOMÁS", t("0439", 1.28), "big", 118)],
      [w("BRACAMONTE", t("0439", 1.56), "big", 96)],
    ],
  },
  {
    from: t("0439", 2.3), to: t("0439", 3.49), y: 250,
    lines: [[w("el creador de", t("0439", 2.34), "scriptDark", 92)], [w("MONTE RIKO", t("0439", 2.88), "big", 104)]],
  },
  {
    from: t("0439", 3.62), to: t("0439", 4.99), y: 285, behind: true,
    lines: [[w("y esto recién", t("0439", 3.74), "scriptDark", 96)], [w("EMPIEZA", t("0439", 4.46), "big", 170)]],
  },
  {
    from: t("0439", 5.4), to: t("0439", 7.24), y: 240,
    lines: [[w("Si querés ver", t("0439", 5.5), "scriptDark", 92)], [w("cómo crece", t("0439", 5.88), "scriptDark", 92)], [w("MONTE RIKO", t("0439", 6.44), "big", 104)]],
  },
  {
    from: t("0439", 7.3), to: t("0439", 9.54), y: 300, behind: true,
    lines: [[w("SEGUÍ A", t("0439", 7.44), "big", 150)]],
  },
  {
    from: t("0439", 7.9), to: t("0439", 9.54), y: 470,
    lines: [[w("@monteriko.oficial", t("0439", 7.9), "pill", 66)]],
  },
  {
    from: t("0439", 9.55), to: t("0439", 11.5), y: 240,
    lines: [[w("y acompañame", t("0439", 9.9), "scriptDark", 96)], [w("EN ESTE", t("0439", 10.72), "big", 118)], [w("CAMINO", t("0439", 11.0), "big", 118)]],
  },
];

// ---------- Cierre ----------
const Logo: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - 2, fps, config: { damping: 14, stiffness: 170 } });
  const out = interpolate(f, [LOGO_DUR - 8, LOGO_DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000", alignItems: "center", justifyContent: "center", opacity: out }}>
      <Img
        src={staticFile("i/Monteriko-color-v03.svg")}
        style={{ width: 900, transform: `scale(${interpolate(s, [0, 1], [0.8, 1 + f * 0.0007])})`, opacity: s }}
      />
      <div style={{ fontFamily: mont, fontWeight: 700, color: "#fff", fontSize: 60, marginTop: 80, opacity: interpolate(f, [12, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        @monteriko.oficial
      </div>
    </AbsoluteFill>
  );
};

// ---------- Sonido ----------
const SFX: { f: number; src: string; v: number }[] = [
  { f: PLACED[3].from - 3, src: "whoosh1", v: 0.5 },
  { f: VOZ_FROM - 3, src: "whoosh2", v: 0.5 },
  { f: PLACED[6].from - 3, src: "whoosh1", v: 0.4 },
  { f: t("voz", 6.84) - 6, src: "deep", v: 0.45 },
  { f: PLACED[11].from - 3, src: "whoosh2", v: 0.5 },
  { f: PLACED[12].from - 3, src: "whoosh1", v: 0.5 },
  { f: PLACED[14].from - 3, src: "whoosh2", v: 0.5 },
  { f: t("0404", 4.12), src: "hit", v: 0.45 },
  { f: t("voz", 5.56), src: "hit", v: 0.5 },
  { f: t("voz", 8.42), src: "hit", v: 0.5 },
  { f: t("0417", 7.8), src: "hit", v: 0.4 },
  { f: t("0418", 3.48), src: "hit", v: 0.4 },
  { f: t("0439", 4.46), src: "hit", v: 0.45 },
  { f: CUT_END - 2, src: "boom", v: 0.7 },
];

const Reel: React.FC = () => {
  const musicVol = (f: number) => {
    const base = interpolate(f, [0, 12, CUT_END - 6, CUT_END + 4], [0.12, 0.2, 0.2, 0.55], { extrapolateRight: "clamp" });
    return base * interpolate(f, [TOTAL - 14, TOTAL], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {PLACED.map((c, i) => (
        <Sequence key={i} from={c.from} durationInFrames={c.dur} name={`${c.id} ${c.in}`}>
          <ClipVideo c={c} />
        </Sequence>
      ))}
      {BLOCKS.filter((b) => b.behind).map((b, i) => (
        <TextBlock key={i} b={b} />
      ))}
      {PLACED.filter((c) => c.cut).map((c, i) => (
        <Sequence key={i} from={c.from} durationInFrames={c.dur} name={`silueta ${c.id}`}>
          <ClipCutout c={c} />
        </Sequence>
      ))}
      {BLOCKS.filter((b) => !b.behind).map((b, i) => (
        <TextBlock key={i} b={b} />
      ))}
      <Sequence from={CUT_END} durationInFrames={LOGO_DUR} name="logo">
        <Logo />
      </Sequence>

      <Sequence from={VOZ_FROM} name="voz en off">
        <Audio src={staticFile("s/voz.wav")} trimBefore={Math.round(VOZ_IN * FPS)} trimAfter={Math.round(13.15 * FPS)} />
      </Sequence>
      <Audio src={staticFile("s/music.mp3")} volume={musicVol} trimBefore={32 * FPS} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.f} name={`sfx ${s.src}`}>
          <Audio src={staticFile(`s/${s.src}.mp3`)} volume={s.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const MyComposition = () => (
  <Composition id="Reel" component={Reel} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
);
