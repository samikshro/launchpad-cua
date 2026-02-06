import React from "react";
import { AbsoluteFill, Series, Easing, interpolate, useCurrentFrame } from "remotion";
import { IntroScene, INTRO_SCENE_DURATION } from "./IntroScene";
import { ProblemScene, PROBLEM_SCENE_DURATION } from "./ProblemScene";
import { SolutionScene, SOLUTION_SCENE_DURATION } from "./SolutionScene";
import { TextMotionScene, TEXT_MOTION_SCENE_DURATION } from "./TextMotionScene";
import { DashboardScene, DASHBOARD_SCENE_DURATION } from "./DashboardScene";
import { FeaturesScene, FEATURES_SCENE_DURATION } from "./FeaturesScene";
import { CtaScene, CTA_SCENE_DURATION } from "./CtaScene";

export const FULL_VIDEO_DURATION =
  INTRO_SCENE_DURATION +
  PROBLEM_SCENE_DURATION +
  SOLUTION_SCENE_DURATION +
  TEXT_MOTION_SCENE_DURATION +
  DASHBOARD_SCENE_DURATION +
  FEATURES_SCENE_DURATION +
  CTA_SCENE_DURATION;

const TRANSITION_DURATION = 18;

const boundaries = [
  INTRO_SCENE_DURATION,
  INTRO_SCENE_DURATION + PROBLEM_SCENE_DURATION,
  INTRO_SCENE_DURATION + PROBLEM_SCENE_DURATION + SOLUTION_SCENE_DURATION,
  INTRO_SCENE_DURATION + PROBLEM_SCENE_DURATION + SOLUTION_SCENE_DURATION + TEXT_MOTION_SCENE_DURATION,
  INTRO_SCENE_DURATION +
    PROBLEM_SCENE_DURATION +
    SOLUTION_SCENE_DURATION +
    TEXT_MOTION_SCENE_DURATION +
    DASHBOARD_SCENE_DURATION,
  INTRO_SCENE_DURATION +
    PROBLEM_SCENE_DURATION +
    SOLUTION_SCENE_DURATION +
    TEXT_MOTION_SCENE_DURATION +
    DASHBOARD_SCENE_DURATION +
    FEATURES_SCENE_DURATION,
];

const TransitionOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  const activeBoundary = boundaries.find((boundary) => {
    const start = boundary - TRANSITION_DURATION / 2;
    const end = boundary + TRANSITION_DURATION / 2;
    return frame >= start && frame <= end;
  });

  if (!activeBoundary) {
    return null;
  }

  const start = activeBoundary - TRANSITION_DURATION / 2;
  const progress = (frame - start) / TRANSITION_DURATION;

  const sweepX = interpolate(progress, [0, 1], [-140, 140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const opacity = progress < 0.5
    ? interpolate(progress, [0, 0.5], [0, 0.95])
    : interpolate(progress, [0.5, 1], [0.95, 0]);

  const flashOpacity = progress < 0.5
    ? interpolate(progress, [0, 0.5], [0, 0.22])
    : interpolate(progress, [0.5, 1], [0.22, 0]);

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -260,
            bottom: -260,
            left: "50%",
            width: 420,
            marginLeft: -210,
            transform: `translateX(${sweepX}%) skewX(-14deg)`,
            background:
              "linear-gradient(180deg, rgba(34, 211, 238, 0.96) 0%, rgba(56, 189, 248, 0.72) 48%, rgba(251, 146, 60, 0.84) 100%)",
            boxShadow: "0 0 60px rgba(34, 211, 238, 0.75)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#ffffff",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

export const FullVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={INTRO_SCENE_DURATION}>
          <IntroScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={PROBLEM_SCENE_DURATION}>
          <ProblemScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SOLUTION_SCENE_DURATION}>
          <SolutionScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={TEXT_MOTION_SCENE_DURATION}>
          <TextMotionScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DASHBOARD_SCENE_DURATION}>
          <DashboardScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={FEATURES_SCENE_DURATION}>
          <FeaturesScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={CTA_SCENE_DURATION}>
          <CtaScene />
        </Series.Sequence>
      </Series>

      <TransitionOverlay />
    </AbsoluteFill>
  );
};
