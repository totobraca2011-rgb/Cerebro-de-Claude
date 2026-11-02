import React from "react";
import {
  AbsoluteFill,
  Composition,
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

const { fontFamily: rubik } = loadRubik("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
const { fontFamily: mont } = loadMont("normal", { weights: ["800"], subsets: ["latin", "latin-ext"] });

const FPS = 30;
const ORANGE = "#FF6900";
const CIERRE = 75;

type Toma = { src: string; desde: number; hasta: number };
type Palabra = { t: string; at: number; size: number };
type Props = { tomas: Toma[]; gancho: Palabra[][] };

const Clip: React.FC<{ toma: Toma; dur: number }> = ({ toma, dur }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], [1.02, 1.09]);
  return (
    <AbsoluteFill style={{ transform: `scale(${z})` }}>
      <OffthreadVideo
        src={staticFile(`v/${toma.src}.mp4`)}
        trimBefore={Math.round(toma.desde * FPS)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

const Word: React.FC<{ p: Palabra }> = ({ p }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = f >= p.at;
  const s = spring({ frame: f - p.at, fps, config: { damping: 13, stiffness: 240, mass: 0.6 } });
  return (
    <span
      style={{
        fontFamily: rubik,
        fontSize: p.size,
        lineHeight: 1.06,
        color: ORANGE,
        display: "inline-block",
        visibility: on ? "visible" : "hidden",
        transform: `scale(${interpolate(s, [0, 1], [1.32, 1])})`,
        textShadow: "0 6px 26px rgba(0,0,0,.65), 0 2px 0 rgba(0,0,0,.3)",
      }}
    >
      {p.t}
    </span>
  );
};

const Gancho: React.FC<{ lineas: Palabra[][] }> = ({ lineas }) => (
  <>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 42%)" }} />
    <div style={{ position: "absolute", top: 260, left: 0, right: 0, textAlign: "center" }}>
      {lineas.map((l, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "center", gap: 34 }}>
          {l.map((p, j) => (
            <Word key={j} p={p} />
          ))}
        </div>
      ))}
    </div>
  </>
);

const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - 8, fps, config: { damping: 14, stiffness: 180 } });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, CIERRE], [1, 1.08])})` }}>
        <Img src={staticFile("i/caja-cuatro-alfajores.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.72) 0%, rgba(0,0,0,0) 45%)" }} />
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, textAlign: "center", opacity: s, transform: `scale(${interpolate(s, [0, 1], [1.2, 1])})` }}>
        <div style={{ fontFamily: rubik, color: ORANGE, fontSize: 120, lineHeight: 1.06 }}>ARMÁ TU CAJA</div>
        <div style={{ fontFamily: mont, fontWeight: 800, color: "#fff", fontSize: 58, marginTop: 24 }}>Link de la bio</div>
      </div>
    </AbsoluteFill>
  );
};

const duracion = (tomas: Toma[]) => tomas.reduce((a, x) => a + Math.round((x.hasta - x.desde) * FPS), 0);

const Proceso: React.FC<Props> = ({ tomas, gancho }) => {
  let at = 0;
  const total = duracion(tomas);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {tomas.map((x, i) => {
        const dur = Math.round((x.hasta - x.desde) * FPS);
        const from = at;
        at += dur;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <Clip toma={x} dur={dur} />
          </Sequence>
        );
      })}
      <Sequence from={0} durationInFrames={75}>
        <Gancho lineas={gancho} />
      </Sequence>
      <Sequence from={total} durationInFrames={CIERRE}>
        <Cierre />
      </Sequence>
    </AbsoluteFill>
  );
};

const HARINA: Props = {
  tomas: [{ src: "c/proceso-masa", desde: 0, hasta: 15.4 }],
  gancho: [
    [{ t: "ASÍ", at: 3, size: 100 }, { t: "ARRANCA", at: 14, size: 100 }],
    [{ t: "CADA", at: 28, size: 118 }],
    [{ t: "ALFAJOR", at: 38, size: 150 }],
  ],
};
const TAPAS: Props = {
  tomas: [{ src: "c/cortar-tapas", desde: 0, hasta: 8.25 }],
  gancho: [
    [{ t: "UNA", at: 3, size: 150 }],
    [{ t: "POR", at: 16, size: 150 }],
    [{ t: "UNA", at: 29, size: 150 }],
  ],
};
const APILAR: Props = {
  tomas: [
    { src: "c/estirar-masa", desde: 0, hasta: 9.25 },
    { src: "c/apilar-tapas", desde: 0, hasta: 3.35 },
  ],
  gancho: [
    [{ t: "ESTIRAR", at: 3, size: 140 }],
    [{ t: "CORTAR", at: 18, size: 140 }],
    [{ t: "APILAR", at: 33, size: 140 }],
  ],
};

// Tomas nuevas de noviembre: cada archivo ya viene cortado, con color corregido y a su velocidad
const n = (src: string, hasta: number): Toma => ({ src: `n/${src}`, desde: 0, hasta });

const RELLENO: Props = {
  tomas: [
    n("r1", 3.2), n("r2", 2), n("r3", 2.5), n("r4", 2), n("r8", 4),
  ],
  gancho: [
    [{ t: "ESTO", at: 3, size: 150 }],
    [{ t: "VA", at: 16, size: 150 }],
    [{ t: "ADENTRO", at: 29, size: 150 }],
  ],
};
const BANO: Props = {
  tomas: [
    n("b1", 3.1), n("b2", 2), n("b4", 2), n("b5", 2.5),
    n("b6", 2.5), n("b7", 3), n("b8", 2.5), n("b9", 2.6),
  ],
  gancho: [
    [{ t: "CADA", at: 3, size: 118 }, { t: "UNO", at: 14, size: 118 }],
    [{ t: "SE", at: 26, size: 130 }, { t: "BAÑA", at: 31, size: 130 }],
    [{ t: "A MANO", at: 38, size: 150 }],
  ],
};
const TODO: Props = {
  tomas: [
    n("p1", 1.2), n("p2", 1.2), n("p3", 1.2), n("p4", 1.2), n("p5", 1.1),
    n("p6", 1.2), n("p7", 1.2), n("p8", 1), n("p9", 1.2),
    n("p13", 1.2), n("p14", 1.2), n("p15", 1.3),
    n("p16", 1.5), n("p17", 1.5), n("p18", 1.7), n("p19", 1.7), n("p20", 5.5),
  ],
  gancho: [
    [{ t: "DE", at: 3, size: 118 }, { t: "LA", at: 9, size: 118 }, { t: "MASA", at: 15, size: 118 }],
    [{ t: "AL", at: 28, size: 118 }],
    [{ t: "ALFAJOR", at: 38, size: 150 }],
  ],
};

const PARTIDO: Props = {
  tomas: [n("a5", 19.5)],
  gancho: [
    [{ t: "ESPERÁ", at: 3, size: 150 }],
    [{ t: "A", at: 17, size: 130 }, { t: "QUE", at: 23, size: 130 }],
    [{ t: "SE", at: 34, size: 130 }, { t: "ABRA", at: 40, size: 130 }],
  ],
};

// Versiones a velocidad normal, pedidas por Tomás
const BANO_NORMAL: Props = {
  tomas: [n("v1", 4), n("v2", 4), n("v3", 4), n("v4", 4), n("v5", 4), n("v6", 4), n("v7", 4), n("v8", 3.4)],
  gancho: BANO.gancho,
};
const TODO_NORMAL: Props = {
  tomas: [
    n("w1", 2.4), n("w2", 1.8), n("w3", 1.2), n("w4", 1.2), n("w5", 2.2), n("w6", 1.8),
    n("w7", 1.2), n("w8", 2.5), n("w9", 3), n("w10", 3), n("w11", 3), n("w12", 3.6),
    n("w13", 3), n("w14", 3), n("w15", 3.4), n("w16", 3), n("w17", 9),
  ],
  gancho: TODO.gancho,
};
// El relleno a velocidad normal; z1 a z3 llevan el filtro GUSTOSO para que el dulce no salga verdoso
const RELLENO_NORMAL: Props = {
  tomas: [n("z1", 3.6), n("z2", 11), n("z3", 6), n("z4", 9)],
  gancho: RELLENO.gancho,
};

const comp = (id: string, props: Props) => (
  <Composition
    id={id}
    component={Proceso as unknown as React.FC<Record<string, unknown>>}
    defaultProps={props as unknown as Record<string, unknown>}
    durationInFrames={duracion(props.tomas) + CIERRE}
    fps={FPS}
    width={1080}
    height={1920}
  />
);

export const Procesos = () => (
  <>
    {comp("Harina", HARINA)}
    {comp("Tapas", TAPAS)}
    {comp("Apilar", APILAR)}
    {comp("Relleno", RELLENO)}
    {comp("Bano", BANO)}
    {comp("Todo", TODO)}
    {comp("Partido", PARTIDO)}
    {comp("BanoNormal", BANO_NORMAL)}
    {comp("TodoNormal", TODO_NORMAL)}
    {comp("RellenoNormal", RELLENO_NORMAL)}
  </>
);
