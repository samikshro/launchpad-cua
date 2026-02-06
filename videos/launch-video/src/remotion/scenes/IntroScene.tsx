import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LAUNCH_DATA } from "./LaunchData";
import { SceneFrame } from "./SceneFrame";
import { LAUNCH_COLORS, TYPOGRAPHY } from "./Theme";

export const INTRO_SCENE_DURATION = 132;

const HOOK_DURATION = 42;
const HOOK_LINES = ["STOP THE SCROLL", "SHOW THE PAIN", "LAND THE IMPACT"];
const CHIP_ITEMS = ["Launch Film", "Motion Graphics", "Product Story"];
const STORY_STEPS = ["Problem", "Solution", "CTA"];

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contentFrame = Math.max(0, frame - 24);

  const contentIn = spring({
    frame: contentFrame,
    fps,
    config: {
      damping: 14,
      stiffness: 130,
    },
  });

  const subtitleOpacity = interpolate(contentFrame, [16, 38], [0, 1], {
    extrapolateRight: "clamp",
  });

  const railProgress = interpolate(frame, [36, INTRO_SCENE_DURATION - 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const hookOpacity = interpolate(frame, [0, HOOK_DURATION - 8, HOOK_DURATION], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const hookShiftY = interpolate(frame, [0, HOOK_DURATION], [0, -36], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const scanOffset = interpolate(frame, [0, HOOK_DURATION], [0, 160], {
    extrapolateRight: "clamp",
  });

  const introJitter = frame < 18 ? (frame % 2 === 0 ? 1.8 : -1.8) : 0;

  return (
    <AbsoluteFill>
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
            gap: 22,
            opacity: contentIn,
            transform: `translateY(${(1 - contentIn) * 24}px)`,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 48,
              lineHeight: 1.16,
              color: LAUNCH_COLORS.text,
              maxWidth: 1440,
              fontWeight: 650,
            }}
          >
            {LAUNCH_DATA.strapline}
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {CHIP_ITEMS.map((chip, index) => {
              const chipFrame = Math.max(0, contentFrame - 6 - index * 7);
              const chipIn = spring({
                frame: chipFrame,
                fps,
                config: {
                  damping: 18,
                  stiffness: 145,
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
              fontSize: 26,
              lineHeight: 1.4,
              color: "rgba(203, 213, 225, 0.9)",
              opacity: subtitleOpacity,
              maxWidth: 1380,
            }}
          >
            Start with the pain, move into the fix, zoom through your UI, and finish with a clean call-to-action.
          </p>

          <div
            style={{
              marginTop: "auto",
              borderRadius: 16,
              border: "1px solid rgba(148, 163, 184, 0.28)",
              backgroundColor: "rgba(2, 6, 23, 0.56)",
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.mono,
                  fontSize: 15,
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  color: "rgba(125, 211, 252, 0.92)",
                }}
              >
                Story rail
              </span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.mono,
                  fontSize: 14,
                  color: "rgba(148, 163, 184, 0.95)",
                }}
              >
                Hook to narrative
              </span>
            </div>

            <div style={{ position: "relative", height: 12, borderRadius: 999, backgroundColor: "rgba(30, 41, 59, 0.9)" }}>
              <div
                style={{
                  width: `${railProgress * 100}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: "linear-gradient(90deg, rgba(34, 211, 238, 0.95), rgba(132, 204, 22, 0.95))",
                  boxShadow: "0 0 24px rgba(34, 211, 238, 0.45)",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              {STORY_STEPS.map((step, index) => {
                const threshold = index / (STORY_STEPS.length - 1 || 1);
                const isActive = railProgress >= threshold;

                return (
                  <span
                    key={step}
                    style={{
                      fontFamily: TYPOGRAPHY.mono,
                      fontSize: 14,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: isActive ? "rgba(248, 250, 252, 0.98)" : "rgba(148, 163, 184, 0.78)",
                    }}
                  >
                    {step}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </SceneFrame>

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: hookOpacity,
          pointerEvents: "none",
          transform: `translateY(${hookShiftY}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 10% 25%, rgba(34, 211, 238, 0.24), transparent 44%), radial-gradient(circle at 85% 80%, rgba(251, 146, 60, 0.2), transparent 42%), linear-gradient(140deg, #020617 0%, #0b1120 46%, #0f172a 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: -200,
            opacity: 0.25,
            transform: `translateX(${scanOffset}px) rotate(-7deg)`,
            background:
              "repeating-linear-gradient(90deg, rgba(148, 163, 184, 0.18) 0px, rgba(148, 163, 184, 0.18) 2px, transparent 2px, transparent 28px)",
          }}
        />

        {HOOK_LINES.map((line, index) => {
          const start = index * 10;
          const end = start + 24;

          const lineOpacity = interpolate(frame, [start, start + 4, end - 4, end], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const lineY = interpolate(frame, [start, end], [30, -8], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });

          const lineScale = interpolate(frame, [start, end], [1.12, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });

          return (
            <div
              key={line}
              style={{
                position: "absolute",
                top: 240 + index * 162,
                left: 90,
                right: 90,
                opacity: lineOpacity,
                transform: `translateY(${lineY + introJitter}px) scale(${lineScale})`,
              }}
            >
              <span
                style={{
                  fontFamily: TYPOGRAPHY.display,
                  fontSize: 124,
                  fontWeight: 800,
                  letterSpacing: -2.6,
                  color: index === 1 ? "rgba(186, 230, 253, 0.98)" : "rgba(248, 250, 252, 0.98)",
                  textShadow: "0 0 30px rgba(34, 211, 238, 0.34)",
                }}
              >
                {line}
              </span>
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: 90,
            right: 90,
            bottom: 72,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 250,
              height: 10,
              borderRadius: 999,
              backgroundColor: "rgba(30, 41, 59, 0.85)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${interpolate(frame, [0, HOOK_DURATION], [0, 100], {
                  extrapolateRight: "clamp",
                })}%`,
                height: "100%",
                borderRadius: 999,
                background: "linear-gradient(90deg, rgba(251, 146, 60, 0.95), rgba(34, 211, 238, 0.95))",
              }}
            />
          </div>

          <span
            style={{
              fontFamily: TYPOGRAPHY.mono,
              fontSize: 16,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: "rgba(125, 211, 252, 0.92)",
            }}
          >
            Hook sequence engaged
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
