import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
  Audio,
  Sequence,
  staticFile,
  Video,
  Img,
} from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Urbanist";
import { COLORS } from "@launchpad/assets/brand";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});

const TEXT = "so we built";
const REVEAL_TEXT = "cua-bench";
const BLACK_BACKGROUND = COLORS.background.dark;
const FONT_SIZE = 72;

// Counter animation (continues from IntroScene)
const SKY_BLUE = "#0EA5E9";
const COUNTER_START_VALUE = 62.9;
const COUNTER_END_VALUE = 100;
const COUNTER_CLIMB_DURATION = 50; // frames to go from 62.9% to 100%

// Typing speed (frames per character)
const FRAMES_PER_CHAR = 3;
const START_DELAY = 5;

// Phase timings
const TYPING_DURATION = TEXT.length * FRAMES_PER_CHAR; // 33 frames
const TYPING_END = START_DELAY + TYPING_DURATION; // 38
const HOLD_AFTER_TYPING = 12;
const MOVE_UP_START = TYPING_END + HOLD_AFTER_TYPING; // 50
const MOVE_UP_DURATION = 8;
const REVEAL_START = MOVE_UP_START + 4; // Start reveal while moving up
const REVEAL_DURATION = 5; // Very fast decrypt effect
const REVEAL_SLIDE_DURATION = 5;

// "so we built" fade out timing - starts fading immediately when cua-bench appears
const TOP_TEXT_FADE_START = REVEAL_START;
const TOP_TEXT_FADE_DURATION = 8;

// cua-bench text fades when video starts appearing
const CUABENCH_FADE_START = REVEAL_START + 20; // Fade shortly after video starts
const CUABENCH_FADE_DURATION = 15; // Smooth fade out

// Video starts while cua-bench is visible, with blur transition
const VIDEO_START = REVEAL_START + 15; // Video starts shortly after cua-bench appears
const VIDEO_BLUR_DURATION = 25; // Blur transition duration - clears as cua-bench fades
const VIDEO_DURATION = 60; // 2 seconds at 30fps
const VIDEO_FADE_START = VIDEO_START + VIDEO_DURATION - 12;
const VIDEO_FADE_DURATION = 12;

// Total scene duration - no extra padding
export const TYPING_SCENE_DURATION = VIDEO_START + VIDEO_DURATION;

export const TypingScene: React.FC = () => {
  const frame = useCurrentFrame();

  // === TYPING PHASE ===
  const typingFrame = Math.max(0, frame - START_DELAY);
  const charsToShow = Math.min(
    Math.floor(typingFrame / FRAMES_PER_CHAR),
    TEXT.length
  );
  const displayedText = TEXT.slice(0, charsToShow);
  const isTypingComplete = charsToShow >= TEXT.length;

  // Cursor blink
  const cursorVisible = Math.floor(frame / 15) % 2 === 0 || !isTypingComplete;

  // === MOVE UP PHASE ===
  const moveUpProgress =
    frame >= MOVE_UP_START
      ? interpolate(
          frame,
          [MOVE_UP_START, MOVE_UP_START + MOVE_UP_DURATION],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.quad),
          }
        )
      : 0;

  const topTextTranslateY = interpolate(moveUpProgress, [0, 1], [0, -80]);

  // === TOP TEXT FADE OUT ===
  const topTextFadeProgress =
    frame >= TOP_TEXT_FADE_START
      ? interpolate(
          frame,
          [TOP_TEXT_FADE_START, TOP_TEXT_FADE_START + TOP_TEXT_FADE_DURATION],
          [1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.quad),
          }
        )
      : 1;

  // === REVEAL/DECRYPT PHASE ===
  const revealSlideProgress =
    frame >= REVEAL_START
      ? interpolate(
          frame,
          [REVEAL_START, REVEAL_START + REVEAL_SLIDE_DURATION],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.quad),
          }
        )
      : 0;

  const revealTranslateY = interpolate(revealSlideProgress, [0, 1], [50, 0]);
  const revealOpacity = interpolate(revealSlideProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Move cuabench.ai up to center when "so we built" fades
  const centeringProgress =
    frame >= TOP_TEXT_FADE_START
      ? interpolate(
          frame,
          [TOP_TEXT_FADE_START, TOP_TEXT_FADE_START + TOP_TEXT_FADE_DURATION],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.quad),
          }
        )
      : 0;

  const cuabenchCenterY = interpolate(centeringProgress, [0, 1], [0, -40]);

  // === CUABENCH FADE OUT (moves up like "so we built") ===
  const cuabenchFadeProgress =
    frame >= CUABENCH_FADE_START
      ? interpolate(
          frame,
          [CUABENCH_FADE_START, CUABENCH_FADE_START + CUABENCH_FADE_DURATION],
          [1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.quad),
          }
        )
      : 1;

  // Move cua-bench up when fading out (like "so we built")
  const cuabenchExitY =
    frame >= CUABENCH_FADE_START
      ? interpolate(
          frame,
          [CUABENCH_FADE_START, CUABENCH_FADE_START + CUABENCH_FADE_DURATION],
          [0, -60],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.quad),
          }
        )
      : 0;

  // === COUNTER ANIMATION ===
  // Counter starts at 62.9% and climbs to 100% when cua-bench appears
  const counterClimbProgress = frame >= REVEAL_START
    ? interpolate(
        frame,
        [REVEAL_START, REVEAL_START + COUNTER_CLIMB_DURATION],
        [0, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }
      )
    : 0;

  const counterValue = COUNTER_START_VALUE + (counterClimbProgress * (COUNTER_END_VALUE - COUNTER_START_VALUE));

  // Counter fades in at start, fades out with cua-bench
  const counterFadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const counterFadeOut = frame >= CUABENCH_FADE_START
    ? interpolate(
        frame,
        [CUABENCH_FADE_START, CUABENCH_FADE_START + CUABENCH_FADE_DURATION],
        [1, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.in(Easing.quad),
        }
      )
    : 1;
  const counterOpacity = counterFadeIn * counterFadeOut;

  // === VIDEO BACKGROUND ===
  // Fade in very gradually with blur transition
  const bgRevealOpacity =
    frame >= VIDEO_START
      ? interpolate(frame, [VIDEO_START, VIDEO_START + 45], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad),
        })
      : 0;

  const bgFadeOpacity =
    frame >= VIDEO_FADE_START
      ? interpolate(
          frame,
          [VIDEO_FADE_START, VIDEO_FADE_START + VIDEO_FADE_DURATION],
          [1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        )
      : 1;

  const videoBgOpacity = bgRevealOpacity * bgFadeOpacity;

  // Blur transition - starts blurry, becomes clear
  const videoBlur =
    frame >= VIDEO_START
      ? interpolate(
          frame,
          [VIDEO_START, VIDEO_START + VIDEO_BLUR_DURATION],
          [12, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }
        )
      : 12;

  // Just show the text directly (no scramble effect)
  const displayText = frame >= REVEAL_START ? REVEAL_TEXT : "";

  // Hide cursor after move up starts
  const showCursor = frame < MOVE_UP_START + 5;

  // Background stays cream, dark overlay fades in gradually with video
  const darkOverlayOpacity =
    frame >= VIDEO_START
      ? interpolate(frame, [VIDEO_START, VIDEO_START + 30], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad),
        })
      : 0;

  // Text color transitions to light as dark overlay fades in
  const isDarkMode = frame >= VIDEO_START;
  const textColor = isDarkMode ? COLORS.text.inverse : COLORS.text.primary;
  const cursorColor = isDarkMode ? COLORS.text.inverse : COLORS.text.primary;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background.cream,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Dark overlay that fades in gradually before video */}
      {frame >= VIDEO_START && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: BLACK_BACKGROUND,
            opacity: darkOverlayOpacity,
          }}
        />
      )}

      {/* Website video background - starts after cua-bench fades with blur transition */}
      <Sequence from={VIDEO_START} durationInFrames={VIDEO_DURATION}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: videoBgOpacity,
            filter: `blur(${videoBlur}px)`,
          }}
        >
          <Video
            src={staticFile("cuabench-short.mp4")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            muted
          />
        </div>
      </Sequence>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          zIndex: 1,
        }}
      >
        {/* "so we built" text */}
        {topTextFadeProgress > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily,
              fontSize: FONT_SIZE,
              fontWeight: 600,
              color: textColor,
              transform: `translateY(${topTextTranslateY}px)`,
              opacity: topTextFadeProgress,
            }}
          >
            <span>{displayedText}</span>
            {showCursor && (
              <span
                style={{
                  display: "inline-block",
                  width: 4,
                  height: FONT_SIZE * 0.85,
                  backgroundColor: cursorVisible ? cursorColor : "transparent",
                  marginLeft: 2,
                }}
              />
            )}
          </div>
        )}

        {/* "cua-bench" with koala logo - same style as "so we built", moves up when fading out */}
        {frame >= REVEAL_START && cuabenchFadeProgress > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              transform: `translateY(${cuabenchCenterY + cuabenchExitY}px)`,
              opacity: revealOpacity * cuabenchFadeProgress,
            }}
          >
            <Img
              src={staticFile("koala-ascii.svg")}
              style={{
                height: FONT_SIZE * 1.8,
                width: "auto",
                marginRight: -32,
                // Invert white SVG to black on cream background, keep white on dark
                filter: isDarkMode ? "none" : "invert(1)",
              }}
            />
            <span
              style={{
                fontFamily,
                fontSize: FONT_SIZE,
                fontWeight: 600,
                color: textColor,
              }}
            >
              {displayText}
            </span>
          </div>
        )}
      </div>

      {/* Counter animation - 62.9% → 100% */}
      {counterOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            opacity: counterOpacity,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontFamily,
                fontSize: 160,
                fontWeight: 700,
                color: textColor,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {counterValue.toFixed(1)}
            </span>
            <span
              style={{
                fontFamily,
                fontSize: 70,
                fontWeight: 600,
                color: textColor,
                marginLeft: 6,
              }}
            >
              %
            </span>
          </div>
          <span
            style={{
              fontFamily,
              fontSize: 32,
              fontWeight: 600,
              color: SKY_BLUE,
              marginTop: 12,
            }}
          >
            success rate
          </span>
          <span
            style={{
              fontFamily,
              fontSize: 20,
              fontWeight: 400,
              color: textColor,
              opacity: 0.5,
              marginTop: 8,
            }}
          >
            OSWorld (Xie et al., 2024)
          </span>
        </div>
      )}

      {/* Typing sound - plays once at start of typing */}
      <Sequence from={START_DELAY} durationInFrames={TYPING_DURATION}>
        <Audio src={staticFile("typing.wav")} volume={0.5} />
      </Sequence>

    </AbsoluteFill>
  );
};
