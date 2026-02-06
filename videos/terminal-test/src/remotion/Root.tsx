import { Composition } from "remotion";
import { FullVideo, FULL_VIDEO_DURATION } from "./scenes/FullVideo";
import { MasterScene, MASTER_SCENE_DURATION } from "./scenes/MasterScene";
import { VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS } from "../../types/constants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TerminalTestAnnouncement"
        component={MasterScene}
        durationInFrames={MASTER_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="TerminalTestFull"
        component={FullVideo}
        durationInFrames={FULL_VIDEO_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
