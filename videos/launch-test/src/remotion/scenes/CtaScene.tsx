import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LAUNCH_DATA } from "./LaunchData";
import { SceneFrame } from "./SceneFrame";
import { LAUNCH_COLORS, TYPOGRAPHY } from "./Theme";

export const CTA_SCENE_DURATION = 108;

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({
    frame,
    fps,
    config: {
      damping: 13,
      stiffness: 120,
    },
  });

  const buttonsIn = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <SceneFrame
      tone="electric"
      eyebrow="Call To Action"
      title={LAUNCH_DATA.cta.headline}
      subtitle={LAUNCH_DATA.cta.body}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          gap: 22,
          transform: `translateY(${(1 - titleIn) * 22}px)`,
          opacity: titleIn,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 14,
            transform: `translateY(${(1 - buttonsIn) * 20}px)`,
            opacity: buttonsIn,
          }}
        >
          <div
            style={{
              borderRadius: 999,
              padding: "14px 24px",
              fontSize: 26,
              fontWeight: 700,
              background: "linear-gradient(120deg, rgba(34, 211, 238, 0.95), rgba(56, 189, 248, 0.95))",
              color: "#082f49",
              boxShadow: "0 0 26px rgba(34, 211, 238, 0.45)",
            }}
          >
            {LAUNCH_DATA.cta.primary}
          </div>

          <div
            style={{
              borderRadius: 999,
              padding: "14px 24px",
              fontSize: 26,
              fontWeight: 600,
              border: "1px solid rgba(148, 163, 184, 0.45)",
              color: "rgba(226, 232, 240, 0.94)",
              backgroundColor: "rgba(15, 23, 42, 0.55)",
            }}
          >
            {LAUNCH_DATA.cta.secondary}
          </div>
        </div>

        <div
          style={{
            marginTop: 6,
            padding: "12px 18px",
            borderRadius: 14,
            border: "1px solid rgba(148, 163, 184, 0.32)",
            backgroundColor: "rgba(15, 23, 42, 0.62)",
            fontFamily: TYPOGRAPHY.mono,
            fontSize: 23,
            color: LAUNCH_COLORS.muted,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {LAUNCH_DATA.cta.url}
        </div>
      </div>
    </SceneFrame>
  );
};
