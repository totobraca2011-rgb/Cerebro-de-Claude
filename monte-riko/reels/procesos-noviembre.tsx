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
  tomas: [{ src: "proceso-masa", desde: 0, hasta: 15.4 }],
  gancho: [
    [{ t: "ASÍ", at: 3, size: 100 }, { t: "ARRANCA", at: 14, size: 100 }],
    [{ t: "CADA", at: 28, size: 118 }],
    [{ t: "ALFAJOR", at: 38, size: 150 }],
  ],
};
const TAPAS: Props = {
  tomas: [{ src: "cortar-tapas", desde: 0, hasta: 8.25 }],
  gancho: [
    [{ t: "UNA", at: 3, size: 150 }],
    [{ t: "POR", at: 16, size: 150 }],
    [{ t: "UNA", at: 29, size: 150 }],
  ],
};
const APILAR: Props = {
  tomas: [
    { src: "estirar-masa", desde: 0, hasta: 9.25 },
    { src: "apilar-tapas", desde: 0, hasta: 3.35 },
  ],
  gancho: [
    [{ t: "ESTIRAR", at: 3, size: 140 }],
    [{ t: "CORTAR", at: 18, size: 140 }],
    [{ t: "APILAR", at: 33, size: 140 }],
  ],
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
  </>
);
