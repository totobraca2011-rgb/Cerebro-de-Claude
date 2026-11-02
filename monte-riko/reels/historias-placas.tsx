import React from "react";
import { AbsoluteFill, Composition, useCurrentFrame } from "remotion";
import { loadFont as loadRubik } from "@remotion/google-fonts/RubikMonoOne";
import { loadFont as loadMont } from "@remotion/google-fonts/Montserrat";
import { PLACAS } from "./historias-data";

const { fontFamily: rubik } = loadRubik("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });
const { fontFamily: mont } = loadMont("normal", { weights: ["800"], subsets: ["latin", "latin-ext"] });

// Una imagen transparente por placa: cada cuadro de la composición es una historia.
// El texto va chico y arriba o abajo, en la parte de la foto que no muestra el alfajor.
const Placa: React.FC = () => {
  const p = PLACAS[useCurrentFrame()];
  const largo = Math.max(...p.t.split(" ").map((w) => w.length));
  const size = Math.min(p.t.length > 22 ? 66 : 80, 900 / (largo * 0.86));
  const abajo = p.pos === "abajo";
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: abajo
            ? "linear-gradient(0deg, rgba(0,0,0,.62) 0%, rgba(0,0,0,.42) 24%, rgba(0,0,0,0) 36%)"
            : "linear-gradient(180deg, rgba(0,0,0,.62) 0%, rgba(0,0,0,.42) 17%, rgba(0,0,0,0) 29%)",
        }}
      />
      <div style={{ position: "absolute", ...(abajo ? { bottom: 330 } : { top: 200 }), left: 64, right: 64, textAlign: "center" }}>
        <div style={{ fontFamily: rubik, fontSize: size, lineHeight: 1.08, color: "#FF6900", textShadow: "0 4px 18px rgba(0,0,0,.75)" }}>{p.t}</div>
        {p.s ? (
          <div style={{ fontFamily: mont, fontWeight: 800, fontSize: 38, lineHeight: 1.25, color: "#fff", marginTop: 18, whiteSpace: "pre-line", textShadow: "0 3px 12px rgba(0,0,0,.85)" }}>{p.s}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const Historias = () => (
  <Composition id="Historias" component={Placa} durationInFrames={PLACAS.length} fps={30} width={1080} height={1920} />
);
