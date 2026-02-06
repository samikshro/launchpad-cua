import React from "react";
import { Composition } from "remotion";
import { VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS } from "../../types/constants";
import { IntroScene, INTRO_SCENE_DURATION } from "./scenes/IntroScene";
import { ChallengeScene, CHALLENGE_SCENE_DURATION } from "./scenes/ChallengeScene";
import { ResponseScene, RESPONSE_SCENE_DURATION } from "./scenes/ResponseScene";
import { ResultsScene, RESULTS_SCENE_DURATION } from "./scenes/ResultsScene";
import { QuoteScene, QUOTE_SCENE_DURATION } from "./scenes/QuoteScene";
import { OutroScene, OUTRO_SCENE_DURATION } from "./scenes/OutroScene";
import { FullVideo, FULL_VIDEO_DURATION } from "./scenes/FullVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BlueAlpha1440Intro"
        component={IntroScene}
        durationInFrames={INTRO_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="BlueAlpha1440Challenge"
        component={ChallengeScene}
        durationInFrames={CHALLENGE_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="BlueAlpha1440Response"
        component={ResponseScene}
        durationInFrames={RESPONSE_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="BlueAlpha1440Results"
        component={ResultsScene}
        durationInFrames={RESULTS_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="BlueAlpha1440Quote"
        component={QuoteScene}
        durationInFrames={QUOTE_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="BlueAlpha1440Outro"
        component={OutroScene}
        durationInFrames={OUTRO_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="BlueAlpha1440Full"
        component={FullVideo}
        durationInFrames={FULL_VIDEO_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
