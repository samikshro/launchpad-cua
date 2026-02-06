import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CASE_COLORS, TYPOGRAPHY } from "./Theme";

type Tone = "warm" | "cool" | "contrast" | "neutral";

interface SceneFrameProps {
  tone: Tone;
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}

const TONE_BACKGROUND: Record<Tone, string> = {
  warm: "radial-gradient(circle at 12% 16%, rgba(249, 115, 22, 0.28), transparent 48%), radial-gradient(circle at 88% 85%, rgba(245, 158, 11, 0.22), transparent 44%), linear-gradient(135deg, #0f172a 0%, #111827 45%, #172033 100%)",
  cool: "radial-gradient(circle at 16% 20%, rgba(14, 165, 233, 0.26), transparent 44%), radial-gradient(circle at 86% 82%, rgba(16, 185, 129, 0.18), transparent 46%), linear-gradient(135deg, #0b1327 0%, #111b30 50%, #13263f 100%)",
  contrast: "radial-gradient(circle at 15% 18%, rgba(249, 115, 22, 0.22), transparent 40%), radial-gradient(circle at 88% 84%, rgba(14, 165, 233, 0.2), transparent 45%), linear-gradient(125deg, #020617 0%, #101827 54%, #1f2937 100%)",
  neutral: "radial-gradient(circle at 12% 12%, rgba(100, 116, 139, 0.26), transparent 42%), radial-gradient(circle at 90% 88%, rgba(148, 163, 184, 0.14), transparent 42%), linear-gradient(125deg, #0f172a 0%, #172033 44%, #111827 100%)",
};

export const SceneFrame: React.FC<SceneFrameProps> = ({ tone, title, eyebrow, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const reveal = spring({
    frame,
    fps,
    config: {
      damping: 16,
      stiffness: 120,
      mass: 0.8,
    },
  });

  const haloDrift = interpolate(frame, [0, 210], [0, 1], {
    extrapolateRight: "extend",
  });

  return (
    <AbsoluteFill
      style={{
        fontFamily: TYPOGRAPHY.body,
        color: CASE_COLORS.white,
        background: TONE_BACKGROUND[tone],
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -100,
          background: "radial-gradient(circle, rgba(148, 163, 184, 0.1), transparent 60%)",
          transform: `translate(${Math.sin(haloDrift * 2.4) * 40}px, ${Math.cos(haloDrift * 2.1) * 26}px) scale(1.08)`,
          filter: "blur(30px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 58,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: interpolate(frame, [0, 14], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontFamily: TYPOGRAPHY.mono,
            textTransform: "uppercase",
            letterSpacing: 2,
            fontWeight: 500,
            fontSize: 20,
            color: "rgba(226, 232, 240, 0.88)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 999,
              backgroundColor: CASE_COLORS.sky,
              boxShadow: "0 0 20px rgba(14, 165, 233, 0.8)",
            }}
          />
          {eyebrow}
        </div>

        <div
          style={{
            fontFamily: TYPOGRAPHY.mono,
            fontSize: 18,
            color: "rgba(203, 213, 225, 0.84)",
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(148, 163, 184, 0.28)",
            borderRadius: 999,
            padding: "9px 18px",
          }}
        >
          Blue Alpha x 1440
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: "150px 88px 82px",
          borderRadius: 40,
          border: "1px solid rgba(148, 163, 184, 0.34)",
          backgroundColor: "rgba(15, 23, 42, 0.58)",
          backdropFilter: "blur(10px)",
          padding: "54px 58px",
          transform: `translateY(${(1 - reveal) * 36}px) scale(${0.98 + reveal * 0.02})`,
          opacity: reveal,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1
          style={{
            margin: 0,
            marginBottom: 30,
            fontSize: 64,
            lineHeight: 1.03,
            letterSpacing: -1.8,
            fontWeight: 700,
            color: CASE_COLORS.white,
          }}
        >
          {title}
        </h1>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>{children}</div>
      </div>
    </AbsoluteFill>
  );
};
