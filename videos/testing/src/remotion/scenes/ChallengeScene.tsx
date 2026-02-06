import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CASE_STUDY_DATA } from "./CaseStudyData";
import { SceneFrame } from "./SceneFrame";
import { CASE_COLORS, PANEL_SHADOW, TYPOGRAPHY } from "./Theme";

export const CHALLENGE_SCENE_DURATION = 180;

export const ChallengeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const summaryRise = spring({
    frame,
    fps,
    config: {
      damping: 15,
      stiffness: 120,
    },
  });

  return (
    <SceneFrame tone="warm" eyebrow="The Challenge" title="What Was Breaking Down">
      <p
        style={{
          margin: 0,
          marginBottom: 26,
          fontSize: 34,
          lineHeight: 1.35,
          color: "rgba(241, 245, 249, 0.88)",
          maxWidth: 1380,
          transform: `translateY(${(1 - summaryRise) * 16}px)`,
          opacity: summaryRise,
        }}
      >
        {CASE_STUDY_DATA.challengeSummary}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 16,
          marginTop: 8,
        }}
      >
        {CASE_STUDY_DATA.problemBullets.map((bullet, index) => {
          const localFrame = Math.max(0, frame - index * 12);

          const reveal = spring({
            frame: localFrame,
            fps,
            config: {
              damping: 16,
              stiffness: 145,
            },
          });

          const markerPulse = interpolate(localFrame, [0, 20], [0.6, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={bullet.issue}
              style={{
                display: "grid",
                gridTemplateColumns: "44px 1fr",
                alignItems: "start",
                gap: 16,
                borderRadius: 22,
                border: "1px solid rgba(249, 115, 22, 0.3)",
                backgroundColor: "rgba(15, 23, 42, 0.64)",
                boxShadow: PANEL_SHADOW,
                padding: "18px 22px",
                transform: `translateY(${(1 - reveal) * 20}px)`,
                opacity: reveal,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  backgroundColor: CASE_COLORS.coral,
                  transform: `scale(${markerPulse})`,
                  boxShadow: "0 0 22px rgba(249, 115, 22, 0.7)",
                  marginTop: 4,
                }}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 29,
                    lineHeight: 1.32,
                    letterSpacing: -0.3,
                    fontWeight: 600,
                    color: CASE_COLORS.white,
                  }}
                >
                  {bullet.issue}
                </p>

                <p
                  style={{
                    margin: 0,
                    fontFamily: TYPOGRAPHY.body,
                    fontSize: 24,
                    lineHeight: 1.4,
                    color: "rgba(203, 213, 225, 0.92)",
                  }}
                >
                  What happened: {bullet.outcome}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};
