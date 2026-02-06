import React from "react";
import { AbsoluteFill, Series, interpolate, useCurrentFrame } from "remotion";
import { IntroScene, INTRO_SCENE_DURATION } from "./IntroScene";
import { ChallengeScene, CHALLENGE_SCENE_DURATION } from "./ChallengeScene";
import { ResponseScene, RESPONSE_SCENE_DURATION } from "./ResponseScene";
import { ResultsScene, RESULTS_SCENE_DURATION } from "./ResultsScene";
import { QuoteScene, QUOTE_SCENE_DURATION } from "./QuoteScene";
import { OutroScene, OUTRO_SCENE_DURATION } from "./OutroScene";

export const FULL_VIDEO_DURATION =
  INTRO_SCENE_DURATION +
  CHALLENGE_SCENE_DURATION +
  RESPONSE_SCENE_DURATION +
  RESULTS_SCENE_DURATION +
  QUOTE_SCENE_DURATION +
  OUTRO_SCENE_DURATION;

const TRANSITION_DURATION = 16;

const boundaries = [
  INTRO_SCENE_DURATION,
  INTRO_SCENE_DURATION + CHALLENGE_SCENE_DURATION,
  INTRO_SCENE_DURATION + CHALLENGE_SCENE_DURATION + RESPONSE_SCENE_DURATION,
  INTRO_SCENE_DURATION + CHALLENGE_SCENE_DURATION + RESPONSE_SCENE_DURATION + RESULTS_SCENE_DURATION,
  INTRO_SCENE_DURATION + CHALLENGE_SCENE_DURATION + RESPONSE_SCENE_DURATION + RESULTS_SCENE_DURATION + QUOTE_SCENE_DURATION,
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

  const translateX =
    progress < 0.5
      ? interpolate(progress, [0, 0.5], [100, 0])
      : interpolate(progress, [0.5, 1], [0, -100]);

  const opacity =
    progress < 0.5
      ? interpolate(progress, [0, 0.5], [0, 0.96])
      : interpolate(progress, [0.5, 1], [0.96, 0]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translateX(${translateX}%)`,
        opacity,
        background:
          "linear-gradient(115deg, rgba(2, 6, 23, 0.96) 0%, rgba(15, 23, 42, 0.96) 36%, rgba(2, 132, 199, 0.54) 100%)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "calc(100% - 8px)",
          width: 8,
          background: "linear-gradient(180deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)",
          boxShadow: "0 0 30px rgba(14, 165, 233, 0.8)",
        }}
      />
    </div>
  );
};

export const FullVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={INTRO_SCENE_DURATION}>
          <IntroScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={CHALLENGE_SCENE_DURATION}>
          <ChallengeScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={RESPONSE_SCENE_DURATION}>
          <ResponseScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={RESULTS_SCENE_DURATION}>
          <ResultsScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={QUOTE_SCENE_DURATION}>
          <QuoteScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={OUTRO_SCENE_DURATION}>
          <OutroScene />
        </Series.Sequence>
      </Series>

      <TransitionOverlay />
    </AbsoluteFill>
  );
};
