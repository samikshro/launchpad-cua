import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LAUNCH_DATA } from "./LaunchData";
import { SceneFrame } from "./SceneFrame";
import { PANEL_SHADOW, TYPOGRAPHY } from "./Theme";

export const FEATURES_SCENE_DURATION = 160;

export const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame
      tone="sunrise"
      eyebrow="Key Features"
      title="Anchor each feature to an outcome viewers can repeat"
      subtitle="Use one sentence to explain capability and one number to make it memorable."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, flex: 1 }}>
        {LAUNCH_DATA.features.map((feature, index) => {
          const localFrame = Math.max(0, frame - 10 - index * 9);
          const reveal = spring({
            frame: localFrame,
            fps,
            config: {
              damping: 16,
              stiffness: 140,
            },
          });

          return (
            <div
              key={feature.name}
              style={{
                borderRadius: 24,
                border: "1px solid rgba(251, 146, 60, 0.4)",
                backgroundColor: "rgba(15, 23, 42, 0.72)",
                boxShadow: PANEL_SHADOW,
                padding: "22px 22px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                transform: `translateY(${(1 - reveal) * 18}px) scale(${0.94 + reveal * 0.06})`,
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
                    "linear-gradient(135deg, rgba(251, 146, 60, 0.2) 0%, rgba(251, 113, 133, 0.1) 60%, transparent 100%)",
                }}
              />

              <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 12 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    border: "1px solid rgba(251, 146, 60, 0.62)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255, 237, 213, 0.95)",
                    fontFamily: TYPOGRAPHY.mono,
                    fontSize: 18,
                    backgroundColor: "rgba(124, 45, 18, 0.35)",
                  }}
                >
                  F{index + 1}
                </div>

                <h3
                  style={{
                    margin: 0,
                    fontSize: 36,
                    lineHeight: 1.08,
                    color: "rgba(248, 250, 252, 0.96)",
                    letterSpacing: -0.8,
                  }}
                >
                  {feature.name}
                </h3>

                <p
                  style={{
                    margin: 0,
                    fontSize: 24,
                    lineHeight: 1.36,
                    color: "rgba(226, 232, 240, 0.92)",
                  }}
                >
                  {feature.description}
                </p>

                <div
                  style={{
                    marginTop: "auto",
                    display: "inline-flex",
                    alignSelf: "flex-start",
                    borderRadius: 999,
                    border: "1px solid rgba(251, 146, 60, 0.55)",
                    padding: "9px 14px",
                    fontFamily: TYPOGRAPHY.mono,
                    fontSize: 19,
                    color: "rgba(255, 237, 213, 0.95)",
                    letterSpacing: "0.03em",
                  }}
                >
                  {feature.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};
