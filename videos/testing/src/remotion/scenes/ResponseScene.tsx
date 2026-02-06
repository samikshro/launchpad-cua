import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CASE_STUDY_DATA } from "./CaseStudyData";
import { SceneFrame } from "./SceneFrame";
import { CASE_COLORS, PANEL_SHADOW, TYPOGRAPHY } from "./Theme";

export const RESPONSE_SCENE_DURATION = 165;

export const ResponseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame tone="cool" eyebrow="The Response" title="What The Team Changed">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 18,
          marginTop: 4,
        }}
      >
        {CASE_STUDY_DATA.responseBullets.map((item, index) => {
          const delayedFrame = Math.max(0, frame - 10 - index * 8);
          const reveal = spring({
            frame: delayedFrame,
            fps,
            config: {
              damping: 18,
              stiffness: 120,
            },
          });

          const glowOpacity = interpolate(delayedFrame, [0, 26], [0, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={item}
              style={{
                borderRadius: 24,
                border: "1px solid rgba(14, 165, 233, 0.36)",
                backgroundColor: "rgba(15, 23, 42, 0.64)",
                boxShadow: PANEL_SHADOW,
                padding: "20px 24px",
                minHeight: 132,
                transform: `translateY(${(1 - reveal) * 18}px) scale(${0.96 + reveal * 0.04})`,
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
                    "linear-gradient(120deg, rgba(14, 165, 233, 0.18) 0%, rgba(16, 185, 129, 0.08) 55%, transparent 100%)",
                  opacity: glowOpacity,
                }}
              />

              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 15,
                }}
              >
                <div
                  style={{
                    fontFamily: TYPOGRAPHY.mono,
                    fontSize: 20,
                    minWidth: 44,
                    height: 44,
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(2, 132, 199, 0.2)",
                    color: CASE_COLORS.white,
                    border: "1px solid rgba(125, 211, 252, 0.5)",
                  }}
                >
                  0{index + 1}
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: 29,
                    lineHeight: 1.32,
                    fontWeight: 600,
                    letterSpacing: -0.3,
                    color: CASE_COLORS.white,
                  }}
                >
                  {item}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};
