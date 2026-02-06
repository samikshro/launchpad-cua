import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { LAUNCH_DATA } from "./LaunchData";
import { LAUNCH_COLORS, TYPOGRAPHY } from "./Theme";

export const TEXT_MOTION_SCENE_DURATION = 116;

export const TextMotionScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        flex: 1,
        background:
          "linear-gradient(130deg, #020617 0%, #0f172a 45%, #111827 100%), radial-gradient(circle at 80% 10%, rgba(251, 146, 60, 0.18), transparent 40%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: TYPOGRAPHY.display,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          opacity: 0.35,
        }}
      />

      {LAUNCH_DATA.motionLines.map((line, index) => {
        const start = index * 22;
        const end = start + 42;

        const opacity = interpolate(frame, [start, start + 10, end - 8, end], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const x = interpolate(frame, [start, end], [220, -220], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        });

        const y = -150 + index * 100;

        return (
          <div
            key={line}
            style={{
              position: "absolute",
              left: "50%",
              width: "1600px",
              marginLeft: "-800px",
              transform: `translateX(${x}px) translateY(${y}px)`,
              opacity,
              textAlign: index % 2 === 0 ? "left" : "right",
              padding: "0 60px",
            }}
          >
            <span
              style={{
                fontSize: 96,
                lineHeight: 1,
                fontWeight: 800,
                letterSpacing: -2,
                color: index % 2 === 0 ? "rgba(248, 250, 252, 0.95)" : "rgba(186, 230, 253, 0.95)",
                textShadow: "0 0 30px rgba(34, 211, 238, 0.35)",
              }}
            >
              {line}
            </span>
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 56,
          right: 56,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: TYPOGRAPHY.mono,
          fontSize: 18,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(125, 211, 252, 0.9)",
        }}
      >
        <span>Text-first launch cut</span>
        <span style={{ color: LAUNCH_COLORS.muted }}>Optimized for feeds</span>
      </div>
    </div>
  );
};
