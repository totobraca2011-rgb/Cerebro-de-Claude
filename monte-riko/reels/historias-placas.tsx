import React from "react";
import { AbsoluteFill, Composition, useCurrentFrame } from "remotion";
import { loadFont as loadRubik } from "@remotion/google-fonts/RubikMonoOne";
import { loadFont as loadMont } from "@remotion/google-fonts/Montserrat";
import { PLACAS } from "./historias-data";

const { fontFamily: rubik } = loadRubik("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
const { fontFamily: mont } = loadMont("normal", { weights: ["800"], subsets: ["latin", "latin-ext"] });

// Una imagen transparente por placa: cada cuadro de la composición es una historia
const Placa: React.FC = () => {
  const p = PLACAS[useCurrentFrame()];
  const largo = Math.max(...p.t.split(" ").map((w) => w.length));
  const size = p.t.length > 22 ? Math.min(88, 860 / (largo * 0.86)) : Math.min(108, 960 / (largo * 0.86));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.72) 0%, rgba(0,0,0,.5) 26%, rgba(0,0,0,0) 44%)" }} />
      <div style={{ position: "absolute", top: 262, left: 64, right: 64, textAlign: "center" }}>
        <div style={{ fontFamily: rubik, fontSize: size, lineHeight: 1.08, color: "#FF6900", textShadow: "0 5px 22px rgba(0,0,0,.7)" }}>{p.t}</div>
        {p.s ? (
          <div style={{ fontFamily: mont, fontWeight: 800, fontSize: 44, lineHeight: 1.28, color: "#fff", marginTop: 26, whiteSpace: "pre-line", textShadow: "0 3px 14px rgba(0,0,0,.8)" }}>{p.s}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const Historias = () => (
  <Composition id="Historias" component={Placa} durationInFrames={PLACAS.length} fps={30} width={1080} height={1920} />
);
