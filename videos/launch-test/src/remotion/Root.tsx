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

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LaunchTestIntro"
        component={IntroScene}
        durationInFrames={INTRO_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="LaunchTestProblem"
        component={ProblemScene}
        durationInFrames={PROBLEM_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="LaunchTestSolution"
        component={SolutionScene}
        durationInFrames={SOLUTION_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="LaunchTestTextMotion"
        component={TextMotionScene}
        durationInFrames={TEXT_MOTION_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="LaunchTestDashboard"
        component={DashboardScene}
        durationInFrames={DASHBOARD_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="LaunchTestFeatures"
        component={FeaturesScene}
        durationInFrames={FEATURES_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="LaunchTestCta"
        component={CtaScene}
        durationInFrames={CTA_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="LaunchTestFull"
        component={FullVideo}
        durationInFrames={FULL_VIDEO_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
