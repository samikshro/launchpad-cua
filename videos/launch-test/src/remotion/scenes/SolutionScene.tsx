import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LAUNCH_DATA } from "./LaunchData";
import { SceneFrame } from "./SceneFrame";
import { LAUNCH_COLORS, PANEL_SHADOW, TYPOGRAPHY } from "./Theme";

export const SOLUTION_SCENE_DURATION = 138;

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineProgress = interpolate(frame, [18, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneFrame
      tone="electric"
      eyebrow="The Solution"
      title="Tell the transformation as a three-step system"
      subtitle="Keep this section crisp and visual so anyone can explain your product after one watch."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
        <div
          style={{
            position: "relative",
            marginTop: 10,
            paddingTop: 18,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 45,
              right: 45,
              top: 50,
              height: 4,
              borderRadius: 999,
              backgroundColor: "rgba(148, 163, 184, 0.35)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 45,
              top: 50,
              height: 4,
              borderRadius: 999,
              background: "linear-gradient(90deg, rgba(34, 211, 238, 0.95), rgba(132, 204, 22, 0.95))",
              width: `calc((100% - 90px) * ${lineProgress})`,
              boxShadow: "0 0 24px rgba(34, 211, 238, 0.65)",
            }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
            {LAUNCH_DATA.solutionSteps.map((step, index) => {
              const localFrame = Math.max(0, frame - 10 - index * 12);
              const reveal = spring({
                frame: localFrame,
                fps,
                config: {
                  damping: 16,
                  stiffness: 130,
                },
              });

              return (
                <div
                  key={step.title}
                  style={{
                    borderRadius: 24,
                    border: "1px solid rgba(56, 189, 248, 0.4)",
                    backgroundColor: "rgba(2, 6, 23, 0.62)",
                    boxShadow: PANEL_SHADOW,
                    padding: "20px 22px",
                    minHeight: 220,
                    transform: `translateY(${(1 - reveal) * 18}px) scale(${0.95 + reveal * 0.05})`,
                    opacity: reveal,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(135deg, rgba(34, 211, 238, 0.18) 0%, rgba(132, 204, 22, 0.1) 60%, transparent 100%)",
                    }}
                  />
                  <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 14 }}>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        border: "1px solid rgba(34, 211, 238, 0.6)",
                        backgroundColor: "rgba(14, 116, 144, 0.36)",
                        fontFamily: TYPOGRAPHY.mono,
                        color: "rgba(186, 230, 253, 0.95)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                      }}
                    >
                      0{index + 1}
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: 36,
                        lineHeight: 1.1,
                        fontWeight: 700,
                        letterSpacing: -0.8,
                        color: LAUNCH_COLORS.text,
                      }}
                    >
                      {step.title}
                    </p>

                    <p
                      style={{
                        margin: 0,
                        fontSize: 25,
                        lineHeight: 1.35,
                        color: "rgba(203, 213, 225, 0.9)",
                      }}
                    >
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};
