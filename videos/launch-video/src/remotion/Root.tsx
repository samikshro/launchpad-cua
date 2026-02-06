import React from "react";
import { Composition } from "remotion";
import { VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS } from "../../types/constants";
import { IntroScene, INTRO_SCENE_DURATION } from "./scenes/IntroScene";
import { ProblemScene, PROBLEM_SCENE_DURATION } from "./scenes/ProblemScene";
import { SolutionScene, SOLUTION_SCENE_DURATION } from "./scenes/SolutionScene";
import { TextMotionScene, TEXT_MOTION_SCENE_DURATION } from "./scenes/TextMotionScene";
import { DashboardScene, DASHBOARD_SCENE_DURATION } from "./scenes/DashboardScene";
import { FeaturesScene, FEATURES_SCENE_DURATION } from "./scenes/FeaturesScene";
import { CtaScene, CTA_SCENE_DURATION } from "./scenes/CtaScene";
import { FullVideo, FULL_VIDEO_DURATION } from "./scenes/FullVideo";
import {
  ManifestoToolkitScene,
  MANIFESTO_TOOLKIT_SCENE_DURATION,
} from "./scenes/ManifestoToolkitScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LaunchVideoIntro"
        component={IntroScene}
        durationInFrames={INTRO_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="LaunchVideoProblem"
        component={ProblemScene}
        durationInFrames={PROBLEM_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="LaunchVideoSolution"
        component={SolutionScene}
        durationInFrames={SOLUTION_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="LaunchVideoTextMotion"
        component={TextMotionScene}
        durationInFrames={TEXT_MOTION_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="LaunchVideoDashboard"
        component={DashboardScene}
        durationInFrames={DASHBOARD_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="LaunchVideoFeatures"
        component={FeaturesScene}
        durationInFrames={FEATURES_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="LaunchVideoCta"
        component={CtaScene}
        durationInFrames={CTA_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="LaunchVideoFull"
        component={FullVideo}
        durationInFrames={FULL_VIDEO_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="ManifestoMotionToolkit"
        component={ManifestoToolkitScene}
        durationInFrames={MANIFESTO_TOOLKIT_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
