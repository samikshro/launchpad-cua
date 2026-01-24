import React from "react";
import { Composition } from "remotion";
import { CombinedIntroScene, COMBINED_INTRO_DURATION } from "./scenes/CombinedIntroScene";
import { CodeEditorScene, CODE_EDITOR_DURATION } from "./scenes/CodeEditorScene";
import { RegistryScene, REGISTRY_SCENE_DURATION } from "./scenes/RegistryScene";
import { FullVideo, FULL_VIDEO_DURATION } from "./scenes/FullVideo";
import { VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS } from "../../types/constants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Individual scenes for development/preview */}
      <Composition
        id="CuaBenchCombinedIntro"
        component={CombinedIntroScene}
        durationInFrames={COMBINED_INTRO_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="CuaBenchCodeEditor"
        component={CodeEditorScene}
        durationInFrames={CODE_EDITOR_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="CuaBenchRegistry"
        component={RegistryScene}
        durationInFrames={REGISTRY_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      {/* Full video composition */}
      <Composition
        id="CuaBenchFull"
        component={FullVideo}
        durationInFrames={FULL_VIDEO_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
