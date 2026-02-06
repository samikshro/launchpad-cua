import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LAUNCH_DATA } from "./LaunchData";
import { SceneFrame } from "./SceneFrame";
import { LAUNCH_COLORS, PANEL_SHADOW, TYPOGRAPHY } from "./Theme";

export const DASHBOARD_SCENE_DURATION = 230;

const CAMERA_KEYFRAMES = [
  { frame: 0, x: 0, y: 0, scale: 0.86 },
  { frame: 9, x: 0, y: 0, scale: 1 },
  { frame: 48, x: 0, y: 0, scale: 1 },
  { frame: 57, x: 220, y: 132, scale: 1.24 },
  { frame: 102, x: 220, y: 132, scale: 1.24 },
  { frame: 111, x: -190, y: 126, scale: 1.24 },
  { frame: 156, x: -190, y: 126, scale: 1.24 },
  { frame: 165, x: 0, y: -142, scale: 1.2 },
  { frame: 208, x: 0, y: -142, scale: 1.2 },
  { frame: 217, x: 0, y: 0, scale: 1 },
  { frame: DASHBOARD_SCENE_DURATION, x: 0, y: 0, scale: 1 },
] as const;

const FOCUS_WINDOWS = [
  { start: 57, end: 102, index: 0 },
  { start: 111, end: 156, index: 1 },
  { start: 165, end: 208, index: 2 },
] as const;

const barSet = [64, 88, 102, 76, 122, 94, 136];
const funnelSet = [100, 82, 65, 46, 32];

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const springProgress = (frame: number, fps: number, durationInFrames: number): number => {
  const raw = spring({
    frame,
    fps,
    durationInFrames,
    config: { damping: 30, stiffness: 120, mass: 0.95, overshootClamping: true },
  });
  return clamp01(raw);
};

const getKeyframedValue = (
  frame: number,
  keyframes: ReadonlyArray<{ frame: number; value: number }>,
  fps: number
): number => {
  for (let i = 0; i < keyframes.length - 1; i++) {
    const current = keyframes[i];
    const next = keyframes[i + 1];
    if (frame <= next.frame) {
      const progress = springProgress(frame - current.frame, fps, next.frame - current.frame);
      return interpolate(progress, [0, 1], [current.value, next.value], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
  }

  return keyframes[keyframes.length - 1].value;
};

const getFocusStrength = (frame: number, start: number, end: number, fps: number): number => {
  const enterProgress = springProgress(frame - (start - 5), fps, 9);
  const exitProgress = springProgress(frame - end, fps, 9);
  return clamp01(enterProgress * (1 - exitProgress));
};

export const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cameraX = getKeyframedValue(
    frame,
    CAMERA_KEYFRAMES.map((point) => ({ frame: point.frame, value: point.x })),
    fps
  );
  const cameraY = getKeyframedValue(
    frame,
    CAMERA_KEYFRAMES.map((point) => ({ frame: point.frame, value: point.y })),
    fps
  );
  const cameraScale = getKeyframedValue(
    frame,
    CAMERA_KEYFRAMES.map((point) => ({ frame: point.frame, value: point.scale })),
    fps
  );

  const focusStrengths = FOCUS_WINDOWS.map((window) =>
    getFocusStrength(frame, window.start, window.end, fps)
  );
  const activeFocus = FOCUS_WINDOWS.find((window) => frame >= window.start && frame < window.end);
  const activeSection = activeFocus ? LAUNCH_DATA.dashboardSections[activeFocus.index] : null;

  const panelOpacity = interpolate(springProgress(frame, fps, 9), [0, 1], [0.2, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <SceneFrame
      tone="night"
      eyebrow="Product UI"
      title="Fly through a dashboard people can actually read"
      subtitle="Start wide, then push into key modules so viewers understand exactly where value appears."
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 16 }}>
        <div
          style={{
            borderRadius: 24,
            border: "1px solid rgba(56, 189, 248, 0.35)",
            boxShadow: PANEL_SHADOW,
            backgroundColor: "rgba(2, 6, 23, 0.72)",
            overflow: "hidden",
            flex: 1,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 56,
              background: "linear-gradient(90deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.72))",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px",
              borderBottom: "1px solid rgba(148, 163, 184, 0.25)",
              zIndex: 4,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: "#f87171" }}
              />
              <div
                style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: "#facc15" }}
              />
              <div
                style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: "#4ade80" }}
              />
              <span
                style={{
                  fontFamily: TYPOGRAPHY.mono,
                  color: "rgba(186, 230, 253, 0.92)",
                  fontSize: 14,
                  marginLeft: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                command center
              </span>
            </div>
            <span
              style={{
                fontSize: 14,
                color: "rgba(203, 213, 225, 0.8)",
                fontFamily: TYPOGRAPHY.mono,
              }}
            >
              live mode
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              top: 56,
              padding: 16,
              opacity: panelOpacity,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                transform: `translate(${cameraX}px, ${cameraY}px) scale(${cameraScale})`,
                transformOrigin: "50% 50%",
                willChange: "transform",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.45fr 1fr",
                  gridTemplateRows: "1fr 0.9fr",
                  gap: 14,
                  height: "100%",
                }}
              >
                <div
                  style={{
                    borderRadius: 16,
                    border: `1px solid rgba(56, 189, 248, ${0.3 + focusStrengths[0] * 0.5})`,
                    backgroundColor: "rgba(15, 23, 42, 0.76)",
                    padding: 14,
                    boxShadow: `0 0 ${14 + focusStrengths[0] * 14}px rgba(56, 189, 248, ${0.16 + focusStrengths[0] * 0.28})`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    transform: `scale(${1 + focusStrengths[0] * 0.014})`,
                    willChange: "transform",
                  }}
                >
                  <span
                    style={{ fontSize: 17, color: "rgba(203, 213, 225, 0.9)", fontWeight: 600 }}
                  >
                    Pipeline Velocity
                  </span>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 7, flex: 1 }}>
                    {barSet.map((bar, index) => {
                      const barIn = interpolate(
                        springProgress(frame - (18 + index * 2), fps, 8),
                        [0, 1],
                        [0.24, 1],
                        {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        }
                      );
                      const pulse = 1 + Math.sin((frame - index * 3) * 0.08) * 0.03;
                      const scaleY = Math.max(0.24, barIn * pulse);

                      return (
                        <div
                          key={index}
                          style={{
                            flex: 1,
                            height: `${bar}%`,
                            borderRadius: 9,
                            background:
                              "linear-gradient(180deg, rgba(56, 189, 248, 0.95), rgba(14, 116, 144, 0.55))",
                            transform: `scaleY(${scaleY})`,
                            transformOrigin: "bottom center",
                            willChange: "transform",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: 16,
                    border: `1px solid rgba(132, 204, 22, ${0.3 + focusStrengths[1] * 0.52})`,
                    backgroundColor: "rgba(15, 23, 42, 0.76)",
                    padding: 14,
                    boxShadow: `0 0 ${14 + focusStrengths[1] * 14}px rgba(132, 204, 22, ${0.16 + focusStrengths[1] * 0.28})`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    transform: `scale(${1 + focusStrengths[1] * 0.014})`,
                    willChange: "transform",
                  }}
                >
                  <span
                    style={{ fontSize: 17, color: "rgba(203, 213, 225, 0.9)", fontWeight: 600 }}
                  >
                    Activation Funnel
                  </span>
                  {funnelSet.map((width, index) => {
                    const funnelIn = interpolate(
                      springProgress(frame - (22 + index * 2), fps, 8),
                      [0, 1],
                      [0.45, 1],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      }
                    );
                    return (
                      <div
                        key={index}
                        style={{
                          height: 24,
                          width: `${width}%`,
                          borderRadius: 999,
                          backgroundColor: `rgba(132, 204, 22, ${0.3 + (5 - index) * 0.13})`,
                          transform: `scaleX(${funnelIn})`,
                          transformOrigin: "left center",
                          willChange: "transform",
                        }}
                      />
                    );
                  })}
                </div>

                <div
                  style={{
                    borderRadius: 16,
                    border: `1px solid rgba(251, 146, 60, ${0.3 + focusStrengths[2] * 0.5})`,
                    backgroundColor: "rgba(15, 23, 42, 0.76)",
                    padding: 14,
                    boxShadow: `0 0 ${14 + focusStrengths[2] * 14}px rgba(251, 146, 60, ${0.15 + focusStrengths[2] * 0.3})`,
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1fr",
                    gap: 10,
                    transform: `scale(${1 + focusStrengths[2] * 0.014})`,
                    willChange: "transform",
                  }}
                >
                  <div
                    style={{
                      borderRadius: 12,
                      border: "1px solid rgba(148, 163, 184, 0.25)",
                      padding: 12,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      backgroundColor: "rgba(15, 23, 42, 0.65)",
                    }}
                  >
                    <span style={{ color: "rgba(203, 213, 225, 0.85)", fontSize: 14 }}>
                      Renewal confidence
                    </span>
                    <span
                      style={{ color: "rgba(251, 191, 36, 0.95)", fontSize: 36, fontWeight: 700 }}
                    >
                      89%
                    </span>
                  </div>

                  <div
                    style={{
                      borderRadius: 12,
                      border: "1px solid rgba(148, 163, 184, 0.25)",
                      padding: 12,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      backgroundColor: "rgba(15, 23, 42, 0.65)",
                    }}
                  >
                    <span style={{ color: "rgba(203, 213, 225, 0.85)", fontSize: 14 }}>
                      Revenue at risk
                    </span>
                    <span
                      style={{ color: "rgba(74, 222, 128, 0.95)", fontSize: 36, fontWeight: 700 }}
                    >
                      -26%
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: 16,
                    border: "1px solid rgba(148, 163, 184, 0.3)",
                    backgroundColor: "rgba(15, 23, 42, 0.76)",
                    padding: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <span
                    style={{ fontSize: 17, color: "rgba(203, 213, 225, 0.9)", fontWeight: 600 }}
                  >
                    Live Ops Feed
                  </span>
                  {[
                    "Pricing page spike detected",
                    "Onboarding ticket backlog cleared",
                    "Expansion signal from enterprise cohort",
                  ].map((item, index) => {
                    const itemIn = springProgress(frame - (30 + index * 3), fps, 8);
                    const itemY = interpolate(itemIn, [0, 1], [8, 0], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    });
                    return (
                      <div
                        key={item}
                        style={{
                          borderRadius: 10,
                          border: "1px solid rgba(148, 163, 184, 0.24)",
                          padding: "8px 10px",
                          fontSize: 14,
                          color: "rgba(226, 232, 240, 0.88)",
                          backgroundColor: "rgba(30, 41, 59, 0.58)",
                          transform: `translateY(${itemY}px)`,
                          opacity: itemIn,
                          willChange: "transform, opacity",
                        }}
                      >
                        {item}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            minHeight: 74,
            borderRadius: 14,
            border: "1px solid rgba(148, 163, 184, 0.26)",
            backgroundColor: "rgba(15, 23, 42, 0.54)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                color: "rgba(186, 230, 253, 0.9)",
                fontFamily: TYPOGRAPHY.mono,
                fontSize: 14,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {activeSection ? activeSection.label : "Dashboard Overview"}
            </span>
            <span style={{ color: "rgba(248, 250, 252, 0.95)", fontSize: 24, fontWeight: 600 }}>
              {activeSection ? activeSection.headline : "Full-system snapshot"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: LAUNCH_COLORS.lime, fontSize: 22, fontWeight: 700 }}>
              {activeSection ? activeSection.metric : "3-section fly-through"}
            </span>
          </div>
        </div>
      </div>
    </SceneFrame>
  );
};
