import { AbsoluteFill } from "remotion";
import { MasterScene, MASTER_SCENE_DURATION } from "./MasterScene";

export const FULL_VIDEO_DURATION = MASTER_SCENE_DURATION;

export const FullVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <MasterScene />
    </AbsoluteFill>
  );
};
