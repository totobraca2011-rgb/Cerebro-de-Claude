import React from "react";
import { AbsoluteFill, Composition, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";

const FPS = 30;
// Cuántos cuadros tarda cada zoom in o zoom out
const PASO = 7;

// at: segundo en que arranca el zoom; z: cuánto se acerca; x, y: punto que queda fijo (0 a 1)
type Clave = { at: number; z: number; x?: number; y?: number };
type Props = { src: string; dur: number; claves: Clave[] };

// Zoom in y zoom out sobre un reel ya terminado, como en las referencias de pastelería de noviembre 2026
const Zoom: React.FC<Props> = ({ src, claves }) => {
  const f = useCurrentFrame();
  const t = claves.flatMap((c, i) => {
    const a = Math.round(c.at * FPS);
    const prev = claves[i - 1] ?? c;
    return [{ f: a, c: prev }, { f: a + PASO, c }];
  });
  const fs = t.map((k) => k.f);
  const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.inOut(Easing.cubic) };
  const val = (g: (c: Clave) => number) => {
    for (let i = 0; i < t.length - 1; i++) {
      if (f < fs[i + 1]) return interpolate(f, [fs[i], Math.max(fs[i] + 1, fs[i + 1])], [g(t[i].c), g(t[i + 1].c)], ease);
    }
    return g(t[t.length - 1].c);
  };
  const z = val((c) => c.z);
  const x = val((c) => c.x ?? 0.5);
  const y = val((c) => c.y ?? 0.5);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${x * 100}% ${y * 100}%` }}>
        <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const RELLENO_V5: Props = {
  src: "z/relleno-v5.mp4",
  dur: 25.4,
  claves: [
    { at: 0, z: 1 },
    { at: 5.0, z: 1.35, x: 0.42, y: 0.45 },
    { at: 7.2, z: 1, x: 0.42, y: 0.45 },
    { at: 8.4, z: 1.4, x: 0.42, y: 0.38 },
    { at: 9.67, z: 1, x: 0.5, y: 0.45 },
    { at: 10.4, z: 1.3, x: 0.5, y: 0.45 },
    { at: 11.35, z: 1, x: 0.5, y: 0.45 },
    { at: 12.5, z: 1.35, x: 0.5, y: 0.45 },
    { at: 13.97, z: 1, x: 0.55, y: 0.45 },
    { at: 15.4, z: 1.3, x: 0.55, y: 0.45 },
    { at: 17.1, z: 1, x: 0.55, y: 0.45 },
    { at: 18.5, z: 1.35, x: 0.55, y: 0.45 },
    { at: 20.5, z: 1, x: 0.5, y: 0.45 },
  ],
};

const comp = (id: string, props: Props) => (
  <Composition
    id={id}
    component={Zoom as unknown as React.FC<Record<string, unknown>>}
    defaultProps={props as unknown as Record<string, unknown>}
    durationInFrames={Math.round(props.dur * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);

export const Zooms = () => <>{comp("ZoomRelleno", RELLENO_V5)}</>;
