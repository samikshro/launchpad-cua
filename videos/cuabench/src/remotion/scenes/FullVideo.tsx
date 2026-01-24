import React from "react";
import { AbsoluteFill, Series, Audio, Sequence, staticFile, interpolate, useCurrentFrame, Img } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Urbanist";
import { loadFont as loadMono, fontFamily as monoFamily } from "@remotion/google-fonts/JetBrainsMono";
import { CombinedIntroScene, COMBINED_INTRO_DURATION } from "./CombinedIntroScene";
import { CodeEditorScene, CODE_EDITOR_DURATION } from "./CodeEditorScene";
import { RegistryScene, REGISTRY_SCENE_DURATION } from "./RegistryScene";
import { COLORS } from "@launchpad/assets/brand";

loadFont("normal", { subsets: ["latin"], weights: ["400", "500", "600", "700"] });
loadMono("normal", { subsets: ["latin"], weights: ["400", "500"] });

// Thumbnail frame duration
const THUMBNAIL_DURATION = 1;

// Total duration of all scenes combined
export const FULL_VIDEO_DURATION =
  THUMBNAIL_DURATION +
  COMBINED_INTRO_DURATION +
  CODE_EDITOR_DURATION +
  REGISTRY_SCENE_DURATION;

// Thumbnail component - mirrors final CTA slide
const ThumbnailFrame: React.FC = () => {
  const BLACK_BACKGROUND = COLORS.background.dark;
  const WHITE_TEXT = COLORS.text.inverse;
  const MUTED_TEXT = "rgba(255, 255, 255, 0.5)";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK_BACKGROUND,
        fontFamily,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* CUA logo - top left */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 10,
        }}
      >
        <Img
          src={staticFile("cua-logo.svg")}
          style={{
            height: 72,
            width: "auto",
          }}
        />
        <span
          style={{
            fontFamily: monoFamily,
            fontSize: 28,
            fontWeight: 500,
            color: COLORS.text.inverse,
          }}
        >
          cua.ai
        </span>
      </div>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          maxWidth: 900,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: WHITE_TEXT,
            letterSpacing: 2,
            fontFamily: monoFamily,
          }}
        >
          cuabench.ai
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: MUTED_TEXT,
            lineHeight: 1.5,
          }}
        >
          A harness for evaluating computer-use agents on real desktop & mobile tasks.
        </span>

        {/* CTA row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 32,
          }}
        >
          <span style={{ fontSize: 32, fontWeight: 600, color: WHITE_TEXT, marginRight: 12 }}>
            Now
          </span>
          <span style={{ fontSize: 32, fontWeight: 600, color: WHITE_TEXT, marginRight: 12 }}>
            Open-Source
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Img
              src={staticFile("github-logo.svg")}
              style={{ height: 28, width: "auto" }}
            />
            <span
              style={{
                fontSize: 28,
                fontWeight: 500,
                color: "#58a6ff",
                fontFamily: monoFamily,
              }}
            >
              github.com/trycua/cua
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Background music starts after thumbnail
const MUSIC_START = THUMBNAIL_DURATION;
const MUSIC_DURATION = FULL_VIDEO_DURATION - THUMBNAIL_DURATION;
const MUSIC_FADE_IN = 30; // 1 second fade in
const MUSIC_FADE_OUT = 45; // 1.5 second fade out
const MUSIC_VOLUME = 0.3;

// Background music component with fade in/out
const BackgroundMusic: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in at start
  const fadeIn = interpolate(frame, [0, MUSIC_FADE_IN], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [MUSIC_DURATION - MUSIC_FADE_OUT, MUSIC_DURATION],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const volume = fadeIn * fadeOut * MUSIC_VOLUME;

  return <Audio src={staticFile("background-music.wav")} volume={volume} />;
};

export const FullVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={THUMBNAIL_DURATION}>
          <ThumbnailFrame />
        </Series.Sequence>
        <Series.Sequence durationInFrames={COMBINED_INTRO_DURATION}>
          <CombinedIntroScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CODE_EDITOR_DURATION}>
          <CodeEditorScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={REGISTRY_SCENE_DURATION}>
          <RegistryScene />
        </Series.Sequence>
      </Series>

      {/* Background music - starts after intro scene with fade in/out */}
      <Sequence from={MUSIC_START} durationInFrames={MUSIC_DURATION}>
        <BackgroundMusic />
      </Sequence>
    </AbsoluteFill>
  );
};
