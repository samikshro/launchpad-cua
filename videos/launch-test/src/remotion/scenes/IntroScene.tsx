import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LAUNCH_DATA } from "./LaunchData";
import { SceneFrame } from "./SceneFrame";
import { LAUNCH_COLORS, TYPOGRAPHY } from "./Theme";

export const INTRO_SCENE_DURATION = 102;

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingIn = spring({
    frame,
    fps,
    config: {
      damping: 14,
      stiffness: 120,
    },
  });

  const subtitleOpacity = interpolate(frame, [18, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  const chipItems = ["Launch Film", "Motion Graphics", "Product Story"];

  return (
    <SceneFrame
      tone="electric"
      eyebrow="Launch Ready"
      title={`${LAUNCH_DATA.productName} launch video template`}
      subtitle="Built for homepage heroes, social cuts, and polished launch moments."
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 44,
            lineHeight: 1.18,
            color: LAUNCH_COLORS.text,
            maxWidth: 1420,
            opacity: headingIn,
            transform: `translateY(${interpolate(headingIn, [0, 1], [24, 0], {
              easing: Easing.out(Easing.cubic),
            })}px)`,
            fontWeight: 600,
          }}
        >
          {LAUNCH_DATA.strapline}
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: "auto" }}>
          {chipItems.map((chip, index) => {
            const chipFrame = Math.max(0, frame - 10 - index * 7);
            const chipIn = spring({
              frame: chipFrame,
              fps,
              config: {
                damping: 16,
                stiffness: 150,
              },
            });

            return (
              <div
                key={chip}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(34, 211, 238, 0.48)",
                  backgroundColor: "rgba(15, 23, 42, 0.72)",
                  padding: "12px 20px",
                  fontFamily: TYPOGRAPHY.mono,
                  fontSize: 20,
                  color: "rgba(186, 230, 253, 0.95)",
                  transform: `translateY(${(1 - chipIn) * 14}px) scale(${0.95 + chipIn * 0.05})`,
                  opacity: chipIn,
                }}
              >
                {chip}
              </div>
            );
          })}
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 25,
            lineHeight: 1.4,
            color: "rgba(203, 213, 225, 0.9)",
            opacity: subtitleOpacity,
            maxWidth: 1360,
          }}
        >
          Start with the pain, move into the fix, zoom through your UI, and finish with a clean call-to-action.
        </p>
      </div>
    </SceneFrame>
  );
};
