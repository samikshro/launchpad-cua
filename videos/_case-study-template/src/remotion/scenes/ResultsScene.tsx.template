import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CASE_STUDY_DATA } from "./CaseStudyData";
import { SceneFrame } from "./SceneFrame";
import { CASE_COLORS, PANEL_SHADOW, TYPOGRAPHY } from "./Theme";

export const RESULTS_SCENE_DURATION = 210;

const numberFormatter = new Intl.NumberFormat("en-US");

const formatMetricValue = (value: number, unit: string): string => {
  const rounded = unit === "%" || unit === "h" ? Number(value.toFixed(1)) : Math.round(value);
  return `${numberFormatter.format(rounded)}${unit}`;
};

export const ResultsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame tone="contrast" eyebrow="The Outcome" title="Proof In The Metrics">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 16,
          marginBottom: 18,
        }}
      >
        {CASE_STUDY_DATA.metricBullets.map((metric, index) => {
          const delayedFrame = Math.max(0, frame - 12 - index * 14);

          const reveal = spring({
            frame: delayedFrame,
            fps,
            config: {
              damping: 16,
              stiffness: 128,
            },
          });

          const countProgress = interpolate(delayedFrame, [0, 44], [0, 1], {
            extrapolateRight: "clamp",
          });

          const currentValue = metric.before + (metric.after - metric.before) * countProgress;
          const improvement =
            metric.before === 0
              ? 0
              : metric.direction === "decrease"
                ? ((metric.before - metric.after) / metric.before) * 100
                : ((metric.after - metric.before) / metric.before) * 100;

          return (
            <div
              key={metric.label}
              style={{
                borderRadius: 24,
                border: "1px solid rgba(56, 189, 248, 0.34)",
                backgroundColor: "rgba(15, 23, 42, 0.72)",
                boxShadow: PANEL_SHADOW,
                padding: "16px 24px",
                display: "grid",
                gridTemplateColumns: "2fr 1.2fr 1.2fr",
                alignItems: "center",
                gap: 18,
                transform: `translateY(${(1 - reveal) * 16}px)`,
                opacity: reveal,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 27,
                    lineHeight: 1.25,
                    fontWeight: 700,
                    color: CASE_COLORS.white,
                  }}
                >
                  {metric.label}
                </p>

                <p
                  style={{
                    margin: 0,
                    fontSize: 21,
                    lineHeight: 1.35,
                    color: "rgba(203, 213, 225, 0.86)",
                  }}
                >
                  {metric.summary}
                </p>
              </div>

              <div
                style={{
                  fontFamily: TYPOGRAPHY.mono,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 15, textTransform: "uppercase", color: "rgba(148, 163, 184, 0.92)" }}>
                  Before
                </span>
                <span style={{ fontSize: 30, color: "rgba(248, 250, 252, 0.72)" }}>
                  {formatMetricValue(metric.before, metric.unit)}
                </span>
              </div>

              <div
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(16, 185, 129, 0.46)",
                  backgroundColor: "rgba(2, 132, 199, 0.12)",
                  padding: "12px 16px",
                  fontFamily: TYPOGRAPHY.mono,
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                <span style={{ fontSize: 15, textTransform: "uppercase", color: "rgba(125, 211, 252, 0.95)" }}>
                  After
                </span>
                <span style={{ fontSize: 34, color: CASE_COLORS.white }}>
                  {formatMetricValue(currentValue, metric.unit)}
                </span>
                <span
                  style={{
                    fontSize: 16,
                    color: CASE_COLORS.mint,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {improvement > 0 ? `${improvement.toFixed(0)}% better` : "Improved"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};
