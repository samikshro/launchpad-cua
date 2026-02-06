import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LAUNCH_DATA } from "./LaunchData";
import { SceneFrame } from "./SceneFrame";
import { LAUNCH_COLORS, PANEL_SHADOW, TYPOGRAPHY } from "./Theme";

export const PROBLEM_SCENE_DURATION = 150;

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame
      tone="night"
      eyebrow="The Problem"
      title="The message breaks before users see the value"
      subtitle="Call out the pain quickly with high-contrast text that feels native to social feeds."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 22, flex: 1 }}>
        <div
          style={{
            borderRadius: 22,
            border: "1px solid rgba(148, 163, 184, 0.3)",
            backgroundColor: "rgba(15, 23, 42, 0.58)",
            boxShadow: PANEL_SHADOW,
            padding: "22px 26px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {LAUNCH_DATA.problemTicker.map((line, index) => {
            const tickerFrame = frame - index * 8;
            const y = interpolate(tickerFrame, [0, 70], [40, -180], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            const opacity = interpolate(tickerFrame, [0, 12, 58, 70], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <p
                key={line}
                style={{
                  margin: 0,
                  position: "absolute",
                  left: 26,
                  right: 26,
                  top: 140 + index * 58,
                  transform: `translateY(${y}px)`,
                  opacity,
                  fontSize: 48,
                  fontWeight: 700,
                  letterSpacing: -1,
                  color: index % 2 === 0 ? "rgba(248, 250, 252, 0.95)" : "rgba(251, 146, 60, 0.95)",
                }}
              >
                {line}
              </p>
            );
          })}

          <div
            style={{
              marginTop: "auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "rgba(125, 211, 252, 0.88)",
              fontFamily: TYPOGRAPHY.mono,
              fontSize: 19,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span>attention window</span>
            <span style={{ color: "rgba(248, 250, 252, 0.9)" }}>~2 seconds</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {LAUNCH_DATA.audiencePain.map((point, index) => {
            const localFrame = Math.max(0, frame - 8 - index * 10);
            const reveal = spring({
              frame: localFrame,
              fps,
              config: {
                damping: 18,
                stiffness: 140,
              },
            });

            const glow = interpolate(localFrame, [0, 26], [0, 1], {
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={point}
                style={{
                  borderRadius: 20,
                  border: "1px solid rgba(251, 146, 60, 0.42)",
                  backgroundColor: "rgba(15, 23, 42, 0.7)",
                  padding: "18px 20px",
                  minHeight: 120,
                  display: "flex",
                  gap: 12,
                  transform: `translateY(${(1 - reveal) * 16}px)`,
                  opacity: reveal,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(110deg, rgba(251, 146, 60, 0.2), transparent 65%)",
                    opacity: glow,
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    width: 34,
                    height: 34,
                    borderRadius: 999,
                    border: "1px solid rgba(251, 146, 60, 0.7)",
                    color: "rgba(255, 237, 213, 0.95)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: TYPOGRAPHY.mono,
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  0{index + 1}
                </div>
                <p
                  style={{
                    position: "relative",
                    margin: 0,
                    fontSize: 29,
                    lineHeight: 1.32,
                    color: LAUNCH_COLORS.text,
                    fontWeight: 600,
                  }}
                >
                  {point}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </SceneFrame>
  );
};
