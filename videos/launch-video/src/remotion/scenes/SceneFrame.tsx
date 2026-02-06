import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { LAUNCH_COLORS, TYPOGRAPHY } from "./Theme";

type SceneTone = "night" | "electric" | "sunrise";

const TONE_BACKGROUNDS: Record<SceneTone, string> = {
  night:
    "radial-gradient(circle at 12% 20%, rgba(56, 189, 248, 0.2), transparent 36%), radial-gradient(circle at 88% 80%, rgba(132, 204, 22, 0.12), transparent 40%), linear-gradient(145deg, #020617 0%, #0f172a 42%, #111b2f 100%)",
  electric:
    "radial-gradient(circle at 10% 15%, rgba(34, 211, 238, 0.26), transparent 38%), radial-gradient(circle at 90% 85%, rgba(251, 146, 60, 0.16), transparent 40%), linear-gradient(140deg, #030712 0%, #111827 45%, #0f172a 100%)",
  sunrise:
    "radial-gradient(circle at 20% 15%, rgba(251, 146, 60, 0.24), transparent 35%), radial-gradient(circle at 82% 86%, rgba(251, 113, 133, 0.16), transparent 40%), linear-gradient(150deg, #111827 0%, #0f172a 42%, #1e293b 100%)",
};

interface SceneFrameProps {
  tone?: SceneTone;
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const SceneFrame: React.FC<SceneFrameProps> = ({
  tone = "night",
  eyebrow,
  title,
  subtitle,
  children,
}) => {
  const frame = useCurrentFrame();

  const panelOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const panelLift = interpolate(frame, [0, 22], [22, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        background: TONE_BACKGROUNDS[tone],
        padding: "56px 64px",
        color: LAUNCH_COLORS.text,
        fontFamily: TYPOGRAPHY.body,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -240,
          left: -100,
          width: 520,
          height: 520,
          borderRadius: 999,
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.22), transparent 72%)",
          transform: `translateX(${interpolate(frame, [0, 160], [0, 90], {
            extrapolateRight: "clamp",
          })}px)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          right: -180,
          bottom: -220,
          width: 600,
          height: 600,
          borderRadius: 999,
          background: "radial-gradient(circle, rgba(251, 146, 60, 0.18), transparent 72%)",
          transform: `translateY(${interpolate(frame, [0, 180], [80, -20], {
            extrapolateRight: "clamp",
          })}px)`,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "34px 36px",
          borderRadius: 30,
          border: "1px solid rgba(148, 163, 184, 0.25)",
          backgroundColor: "rgba(2, 6, 23, 0.46)",
          boxShadow: "0 36px 120px rgba(2, 6, 23, 0.45)",
          transform: `translateY(${panelLift}px)`,
          opacity: panelOpacity,
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          <span
            style={{
              fontFamily: TYPOGRAPHY.mono,
              fontSize: 17,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(125, 211, 252, 0.92)",
            }}
          >
            {eyebrow}
          </span>

          <h1
            style={{
              margin: 0,
              fontFamily: TYPOGRAPHY.display,
              fontSize: 64,
              lineHeight: 1.06,
              letterSpacing: -1.8,
              maxWidth: 1320,
            }}
          >
            {title}
          </h1>

          {subtitle ? (
            <p
              style={{
                margin: 0,
                color: "rgba(203, 213, 225, 0.92)",
                fontSize: 28,
                lineHeight: 1.36,
                maxWidth: 1380,
              }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>{children}</div>
      </div>
    </AbsoluteFill>
  );
};
