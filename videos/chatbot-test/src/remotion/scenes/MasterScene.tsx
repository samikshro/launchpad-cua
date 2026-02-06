import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ANNOUNCEMENT_DATA, getOutputDoneFrame } from "./AnnouncementData";
import { LogoCombo } from "./LogoCombo";
import { MacTerminal } from "./MacTerminal";

export const MASTER_SCENE_DURATION = 240;

export const MasterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 220,
    },
  });

  const outputDoneFrame = getOutputDoneFrame(fps);
  const flipOut = spring({
    frame: frame - outputDoneFrame,
    fps,
    config: {
      damping: 200,
      stiffness: 120,
    },
  });

  const translateY = interpolate(
    enter,
    [0, 1],
    [ANNOUNCEMENT_DATA.terminalIntroOffsetY, ANNOUNCEMENT_DATA.terminalRestOffsetY]
  );
  const rotateY = interpolate(
    frame,
    [0, MASTER_SCENE_DURATION],
    [ANNOUNCEMENT_DATA.terminalRotateYStart, ANNOUNCEMENT_DATA.terminalRotateYEnd]
  );
  const scale = interpolate(
    frame,
    [0, MASTER_SCENE_DURATION],
    [ANNOUNCEMENT_DATA.terminalStartScale, ANNOUNCEMENT_DATA.terminalEndScale]
  );

  const flipRotateX = frame >= outputDoneFrame
    ? interpolate(flipOut, [0, 1], [0, ANNOUNCEMENT_DATA.flipOutDegrees])
    : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: ANNOUNCEMENT_DATA.backgroundColor,
        perspective: 1200,
      }}
    >
      <Sequence
        from={outputDoneFrame}
        durationInFrames={Math.max(1, MASTER_SCENE_DURATION - outputDoneFrame)}
      >
        <LogoCombo />
      </Sequence>

      <Sequence
        durationInFrames={MASTER_SCENE_DURATION}
        style={{
          transform: `translateY(${translateY}px) rotateX(${ANNOUNCEMENT_DATA.terminalRotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
        }}
      >
        <div style={{ width: "100%", height: "100%", perspective: 1000 }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "center bottom",
              transform: `rotateX(${flipRotateX}deg)`,
            }}
          >
            <MacTerminal />
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
