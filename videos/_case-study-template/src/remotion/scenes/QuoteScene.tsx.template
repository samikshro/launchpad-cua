import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CASE_STUDY_DATA } from "./CaseStudyData";
import { SceneFrame } from "./SceneFrame";
import { CASE_COLORS, PANEL_SHADOW, TYPOGRAPHY } from "./Theme";

export const QUOTE_SCENE_DURATION = 135;

export const QuoteScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const quoteRise = spring({
    frame,
    fps,
    delay: 6,
    config: {
      damping: 14,
      stiffness: 110,
    },
  });

  const barWidth = interpolate(frame, [8, 42], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <SceneFrame tone="neutral" eyebrow="Customer Voice" title="What Changed In Practice">
      <div
        style={{
          borderRadius: 30,
          border: "1px solid rgba(148, 163, 184, 0.34)",
          backgroundColor: "rgba(15, 23, 42, 0.72)",
          boxShadow: PANEL_SHADOW,
          padding: "34px 36px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          transform: `translateY(${(1 - quoteRise) * 18}px)`,
          opacity: quoteRise,
        }}
      >
        <div
          style={{
            width: `${barWidth * 100}%`,
            maxWidth: 260,
            height: 6,
            borderRadius: 999,
            background: "linear-gradient(90deg, #38bdf8 0%, #22d3ee 52%, #10b981 100%)",
          }}
        />

        <p
          style={{
            margin: 0,
            fontSize: 44,
            lineHeight: 1.25,
            letterSpacing: -0.7,
            color: CASE_COLORS.white,
            maxWidth: 1400,
          }}
        >
          "{CASE_STUDY_DATA.quote}"
        </p>

        <p
          style={{
            margin: 0,
            fontFamily: TYPOGRAPHY.mono,
            fontSize: 20,
            color: "rgba(125, 211, 252, 0.94)",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {CASE_STUDY_DATA.quoteAttribution}
        </p>
      </div>
    </SceneFrame>
  );
};
