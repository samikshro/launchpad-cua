import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
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

// =====================
// PHASE 1: Word-by-word intro
// =====================
const WORD_DATA = [
  { word: "Computer-Use", appearFrame: 0 },
  { word: "agents", appearFrame: 5 },
  { word: "are", appearFrame: 14 },
  { word: "becoming", appearFrame: 22 },
  { word: "more", appearFrame: 30 },
  { word: "capable", appearFrame: 35 },
  { word: "than", appearFrame: 44 },
  { word: "ever.", appearFrame: 50 },
];

const WORD_GAP = 18;
const FONT_SIZE = 72;
const LINE_HEIGHT = 100;
const MAX_LINE_WIDTH = 1400;
const SLIDE_UP_DURATION = 6;
const SHIFT_DURATION = 10;

// Intro phase timing
const LAST_WORD_APPEAR = 50;
const INTRO_HOLD_DURATION = 15;
const INTRO_EXIT_START = LAST_WORD_APPEAR + SLIDE_UP_DURATION + INTRO_HOLD_DURATION; // ~71
const INTRO_EXIT_DURATION = 8;

// Counter for intro phase
const COUNTER_START = 22; // When "becoming" appears
const COUNTER_DURATION = 35;
const COUNTER_TARGET = 62.9;
const SKY_BLUE = "#0EA5E9";

// =====================
// PHASE 2: Typing "so we built cua-bench"
// =====================
const PHASE2_START = INTRO_EXIT_START + INTRO_EXIT_DURATION; // 79

const TEXT = "so we built";
const REVEAL_TEXT = "cua-bench";
const BLACK_BACKGROUND = COLORS.background.dark;

// Counter animation (continues from phase 1)
const COUNTER_START_VALUE = 62.9;
const COUNTER_END_VALUE = 100;
const COUNTER_CLIMB_DURATION = 50;

// Typing speed (frames per character) - slower for emphasis
const FRAMES_PER_CHAR = 5;
const TYPING_START_DELAY = 5;

// Phase 2 timings (relative to PHASE2_START)
const TYPING_DURATION = TEXT.length * FRAMES_PER_CHAR; // 55 frames
const TYPING_END = TYPING_START_DELAY + TYPING_DURATION; // 60
const HOLD_AFTER_TYPING = 30; // 1s hold before reveal
const MOVE_UP_START = TYPING_END + HOLD_AFTER_TYPING; // 72
const MOVE_UP_DURATION = 8;
const REVEAL_START = MOVE_UP_START + 4; // 76
const REVEAL_SLIDE_DURATION = 5;

// Hold on cua-bench before counter climbs (1 second = 30 frames)
const CUABENCH_HOLD_DURATION = 30;
const COUNTER_CLIMB_START = REVEAL_START + CUABENCH_HOLD_DURATION; // 106

// "so we built" fade out timing
const TOP_TEXT_FADE_START = REVEAL_START;
const TOP_TEXT_FADE_DURATION = 8;

// When counter reaches 100%
const COUNTER_100_FRAME = COUNTER_CLIMB_START + COUNTER_CLIMB_DURATION;

// Video timing (relative to PHASE2_START) - starts after counter begins climbing
const VIDEO_START_RELATIVE = COUNTER_CLIMB_START + 15; // 121
const VIDEO_BLUR_DURATION = 25;
const VIDEO_DURATION = 90; // 3 seconds (was 2)
const VIDEO_FADE_START = VIDEO_START_RELATIVE + VIDEO_DURATION - 12;
const VIDEO_FADE_DURATION = 12;

// cua-bench text fades when video appears
const CUABENCH_FADE_START = VIDEO_START_RELATIVE;
const CUABENCH_FADE_DURATION = 20;

// Absolute video start for Sequence
const VIDEO_START_ABSOLUTE = PHASE2_START + VIDEO_START_RELATIVE;

// Total scene duration
const PHASE2_DURATION = VIDEO_START_RELATIVE + VIDEO_DURATION;
export const COMBINED_INTRO_DURATION = PHASE2_START + PHASE2_DURATION;

// Measure word width
const measureWordWidth = (word: string): number => {
  if (typeof document === "undefined") {
    return word.length * FONT_SIZE * 0.55;
  }
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.font = `600 ${FONT_SIZE}px Urbanist, sans-serif`;
    return ctx.measureText(word).width;
  }
  return word.length * FONT_SIZE * 0.55;
};

// Pre-calculate line assignments
const getLineAssignments = () => {
  const assignments: number[] = [];
  let currentLine = 0;
  let currentWidth = 0;

  WORD_DATA.forEach((wordData, idx) => {
    const wordWidth = measureWordWidth(wordData.word);
    const needed = idx === 0 || currentWidth === 0 ? wordWidth : wordWidth + WORD_GAP;

    if (currentWidth + needed > MAX_LINE_WIDTH && currentWidth > 0) {
      currentLine++;
      currentWidth = wordWidth;
    } else {
      currentWidth += needed;
    }
    assignments.push(currentLine);
  });

  return assignments;
};

const LINE_ASSIGNMENTS = getLineAssignments();
const TOTAL_LINES = Math.max(...LINE_ASSIGNMENTS) + 1;

// Video background component (uses local frame from Sequence)
const VideoBackground: React.FC<{ globalFrame: number }> = ({ globalFrame }) => {
  const phase2Frame = globalFrame - PHASE2_START;

  const bgRevealOpacity = interpolate(
    phase2Frame,
    [VIDEO_START_RELATIVE, VIDEO_START_RELATIVE + 45],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );

  const bgFadeOpacity = interpolate(
    phase2Frame,
    [VIDEO_FADE_START, VIDEO_FADE_START + VIDEO_FADE_DURATION],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const videoBlur = interpolate(
    phase2Frame,
    [VIDEO_START_RELATIVE, VIDEO_START_RELATIVE + VIDEO_BLUR_DURATION],
    [12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: bgRevealOpacity * bgFadeOpacity,
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
  );
};

export const CombinedIntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Determine which phase we're in
  const isPhase1 = frame < PHASE2_START;
  const phase2Frame = Math.max(0, frame - PHASE2_START);

  // =====================
  // PHASE 1: Intro words
  // =====================

  // Exit animation for phase 1
  const introExitProgress =
    frame >= INTRO_EXIT_START
      ? interpolate(
          frame,
          [INTRO_EXIT_START, INTRO_EXIT_START + INTRO_EXIT_DURATION],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.quad),
          }
        )
      : 0;

  const introExitTranslateY = interpolate(introExitProgress, [0, 1], [0, -120]);
  const introExitOpacity = interpolate(introExitProgress, [0, 1], [1, 0]);

  // =====================
  // UNIFIED COUNTER (continuous across both phases)
  // =====================
  // Absolute timing for counter fade out (PHASE2_START + CUABENCH_FADE_START)
  const counterFadeOutStart = PHASE2_START + CUABENCH_FADE_START;
  const counterFadeOutEnd = counterFadeOutStart + CUABENCH_FADE_DURATION;

  // Counter value: 0 → 62.9% in phase 1, then 62.9% → 100% in phase 2
  const phase1CounterEnd = COUNTER_START + COUNTER_DURATION; // When 62.9% is reached
  const phase2CounterStart = PHASE2_START + COUNTER_CLIMB_START; // When it starts climbing to 100% (after 1s hold)
  const phase2CounterEnd = phase2CounterStart + COUNTER_CLIMB_DURATION;

  let unifiedCounterValue: number;
  if (frame < COUNTER_START) {
    unifiedCounterValue = 0;
  } else if (frame < phase1CounterEnd) {
    // Phase 1: 0 → 62.9%
    const progress = interpolate(frame, [COUNTER_START, phase1CounterEnd], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    unifiedCounterValue = progress * COUNTER_TARGET;
  } else if (frame < phase2CounterStart) {
    // Hold at 62.9%
    unifiedCounterValue = COUNTER_TARGET;
  } else if (frame < phase2CounterEnd) {
    // Phase 2: 62.9% → 100%
    const progress = interpolate(frame, [phase2CounterStart, phase2CounterEnd], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    unifiedCounterValue = COUNTER_TARGET + progress * (COUNTER_END_VALUE - COUNTER_TARGET);
  } else {
    // Hold at 100%
    unifiedCounterValue = COUNTER_END_VALUE;
  }

  // Counter opacity: fade in once, stay visible, fade out once at the end
  const counterFadeIn = frame >= COUNTER_START
    ? interpolate(frame, [COUNTER_START, COUNTER_START + 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const counterFadeOut = frame >= counterFadeOutStart
    ? interpolate(frame, [counterFadeOutStart, counterFadeOutEnd], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.quad),
      })
    : 1;

  const unifiedCounterOpacity = counterFadeIn * counterFadeOut;

  // Scale bounce + glow when counter hits 100%
  const BOUNCE_DURATION = 20; // frames for bounce animation
  const counterAt100 = frame >= phase2CounterEnd;
  const bounceProgress = counterAt100
    ? interpolate(frame, [phase2CounterEnd, phase2CounterEnd + BOUNCE_DURATION], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Elastic bounce: overshoot then settle
  const counterScale = counterAt100
    ? 1 + 0.15 * Math.sin(bounceProgress * Math.PI) * (1 - bounceProgress)
    : 1;

  // Glow intensity peaks and fades
  const glowIntensity = counterAt100
    ? interpolate(bounceProgress, [0, 0.3, 1], [0, 1, 0.6], {
        extrapolateRight: "clamp",
      })
    : 0;

  // =====================
  // PHASE 2: Typing scene
  // =====================

  // Typing animation
  const typingFrame = Math.max(0, phase2Frame - TYPING_START_DELAY);
  const charsToShow = Math.min(Math.floor(typingFrame / FRAMES_PER_CHAR), TEXT.length);
  const displayedText = TEXT.slice(0, charsToShow);
  const isTypingComplete = charsToShow >= TEXT.length;

  // Cursor blink
  const cursorVisible = Math.floor(phase2Frame / 15) % 2 === 0 || !isTypingComplete;

  // Move up phase
  const moveUpProgress =
    phase2Frame >= MOVE_UP_START
      ? interpolate(phase2Frame, [MOVE_UP_START, MOVE_UP_START + MOVE_UP_DURATION], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.in(Easing.quad),
        })
      : 0;

  const topTextTranslateY = interpolate(moveUpProgress, [0, 1], [0, -80]);

  // Top text fade out
  const topTextFadeProgress =
    phase2Frame >= TOP_TEXT_FADE_START
      ? interpolate(
          phase2Frame,
          [TOP_TEXT_FADE_START, TOP_TEXT_FADE_START + TOP_TEXT_FADE_DURATION],
          [1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.quad),
          }
        )
      : 1;

  // Reveal/decrypt phase
  const revealSlideProgress =
    phase2Frame >= REVEAL_START
      ? interpolate(phase2Frame, [REVEAL_START, REVEAL_START + REVEAL_SLIDE_DURATION], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.in(Easing.quad),
        })
      : 0;

  const revealOpacity = interpolate(revealSlideProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Move cuabench up to center
  const centeringProgress =
    phase2Frame >= TOP_TEXT_FADE_START
      ? interpolate(
          phase2Frame,
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

  // Cuabench fade out
  const cuabenchFadeProgress =
    phase2Frame >= CUABENCH_FADE_START
      ? interpolate(
          phase2Frame,
          [CUABENCH_FADE_START, CUABENCH_FADE_START + CUABENCH_FADE_DURATION],
          [1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.quad),
          }
        )
      : 1;

  const cuabenchExitY =
    phase2Frame >= CUABENCH_FADE_START
      ? interpolate(
          phase2Frame,
          [CUABENCH_FADE_START, CUABENCH_FADE_START + CUABENCH_FADE_DURATION],
          [0, -60],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.quad),
          }
        )
      : 0;

  // (Counter logic moved to unified counter section above)

  // Dark overlay
  const darkOverlayOpacity =
    phase2Frame >= VIDEO_START_RELATIVE
      ? interpolate(phase2Frame, [VIDEO_START_RELATIVE, VIDEO_START_RELATIVE + 30], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.quad),
        })
      : 0;

  const displayText = phase2Frame >= REVEAL_START ? REVEAL_TEXT : "";
  const showCursor = phase2Frame < MOVE_UP_START + 5;

  const isDarkMode = !isPhase1 && phase2Frame >= VIDEO_START_RELATIVE;
  const textColor = isDarkMode ? COLORS.text.inverse : COLORS.text.primary;
  const cursorColor = isDarkMode ? COLORS.text.inverse : COLORS.text.primary;

  // =====================
  // PHASE 1: Word elements
  // =====================
  const lineGroups: number[][] = Array.from({ length: TOTAL_LINES }, () => []);
  LINE_ASSIGNMENTS.forEach((lineIdx, wordIdx) => {
    lineGroups[lineIdx].push(wordIdx);
  });

  const totalHeight = TOTAL_LINES * LINE_HEIGHT;
  const baseY = (height - totalHeight) / 2;

  const wordElements: React.ReactElement[] = [];

  if (frame < PHASE2_START) {
    lineGroups.forEach((wordIndices, lineIdx) => {
      const visibleIndices = wordIndices.filter((i) => frame >= WORD_DATA[i].appearFrame);
      if (visibleIndices.length === 0) return;

      const wordWidths = wordIndices.map((i) => measureWordWidth(WORD_DATA[i].word));

      const latestVisibleIdx = visibleIndices[visibleIndices.length - 1];
      const latestAppearFrame = WORD_DATA[latestVisibleIdx].appearFrame;
      const framesSinceLatest = frame - latestAppearFrame;

      const prevVisibleIndices = visibleIndices.slice(0, -1);

      let prevTotalWidth = 0;
      prevVisibleIndices.forEach((wordIdx, i) => {
        prevTotalWidth += wordWidths[wordIndices.indexOf(wordIdx)];
        if (i > 0) prevTotalWidth += WORD_GAP;
      });

      let currentTotalWidth = 0;
      visibleIndices.forEach((wordIdx, i) => {
        currentTotalWidth += wordWidths[wordIndices.indexOf(wordIdx)];
        if (i > 0) currentTotalWidth += WORD_GAP;
      });

      const shiftProgress = interpolate(framesSinceLatest, [0, SHIFT_DURATION], [0, 1], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
      });

      const animatedTotalWidth =
        prevVisibleIndices.length > 0
          ? interpolate(shiftProgress, [0, 1], [prevTotalWidth, currentTotalWidth])
          : currentTotalWidth;

      const lineStartX = (width - animatedTotalWidth) / 2;

      let xOffset = 0;
      visibleIndices.forEach((wordIdx) => {
        const wordData = WORD_DATA[wordIdx];
        const wordWidth = wordWidths[wordIndices.indexOf(wordIdx)];
        const wordAppearFrame = wordData.appearFrame;
        const framesSinceAppear = frame - wordAppearFrame;

        const slideProgress = interpolate(framesSinceAppear, [0, SLIDE_UP_DURATION], [0, 1], {
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });

        const appearTranslateY = interpolate(slideProgress, [0, 1], [50, 0]);
        const appearOpacity = interpolate(framesSinceAppear, [0, SLIDE_UP_DURATION * 0.5], [0, 1], {
          extrapolateRight: "clamp",
        });

        const totalTranslateY = appearTranslateY + introExitTranslateY;
        const totalOpacity = appearOpacity * introExitOpacity;

        const x = lineStartX + xOffset;
        const y = baseY + lineIdx * LINE_HEIGHT;

        wordElements.push(
          <span
            key={wordIdx}
            suppressHydrationWarning
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translateY(${totalTranslateY}px)`,
              opacity: totalOpacity,
              fontSize: FONT_SIZE,
              fontWeight: 600,
              color: COLORS.text.primary,
              whiteSpace: "nowrap",
              fontFamily,
            }}
          >
            {wordData.word}
          </span>
        );

        xOffset += wordWidth + WORD_GAP;
      });
    });
  }

  // Use unified counter
  const showCounter = frame >= COUNTER_START && unifiedCounterOpacity > 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background.cream,
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
          opacity: interpolate(
            frame,
            [0, 10],
            [0, 1],
            { extrapolateRight: "clamp" }
          ),
        }}
      >
        <Img
          src={staticFile("cua-logo.svg")}
          style={{
            height: 72,
            width: "auto",
            filter: isDarkMode ? "none" : "invert(1)",
          }}
        />
        <span
          style={{
            fontFamily,
            fontSize: 28,
            fontWeight: 500,
            color: textColor,
          }}
        >
          cua.ai
        </span>
      </div>

      {/* Dark overlay for video */}
      {!isPhase1 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: BLACK_BACKGROUND,
            opacity: darkOverlayOpacity,
          }}
        />
      )}

      {/* Video background - use Sequence for proper timing */}
      <Sequence from={VIDEO_START_ABSOLUTE} durationInFrames={VIDEO_DURATION}>
        <VideoBackground globalFrame={frame} />
      </Sequence>

      {/* Phase 1: Word elements */}
      {wordElements}

      {/* Phase 2: Typing content */}
      {!isPhase1 && (
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

          {/* "cua-bench" with koala logo */}
          {phase2Frame >= REVEAL_START && cuabenchFadeProgress > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                transform: `translateX(-30px) translateY(${cuabenchCenterY + cuabenchExitY}px)`,
                opacity: revealOpacity * cuabenchFadeProgress,
              }}
            >
              <Img
                src={staticFile("koala-ascii.svg")}
                style={{
                  height: FONT_SIZE * 1.8,
                  width: "auto",
                  marginRight: -16,
                  marginLeft: -32,
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
      )}

      {/* Counter animation - unified across both phases */}
      {showCounter && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            opacity: unifiedCounterOpacity,
            zIndex: 1,
            transform: `scale(${counterScale})`,
            transformOrigin: "bottom right",
            filter: glowIntensity > 0 ? `drop-shadow(0 0 ${30 * glowIntensity}px ${SKY_BLUE})` : "none",
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
              {unifiedCounterValue.toFixed(1)}
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

      {/* Sound effects for intro words */}
      {WORD_DATA.map((wordData, idx) => (
        <Sequence key={`sound-${idx}`} from={wordData.appearFrame}>
          <Audio src={staticFile("whoosh.wav")} volume={0.4} />
        </Sequence>
      ))}

      {/* Typing sound - use absolute timing */}
      <Sequence from={PHASE2_START + TYPING_START_DELAY} durationInFrames={TYPING_DURATION}>
        <Audio src={staticFile("typing.wav")} volume={0.5} />
      </Sequence>

      {/* Sound effect when cua-bench is revealed */}
      <Sequence from={PHASE2_START + REVEAL_START}>
        <Audio src={staticFile("unscramble.wav")} volume={0.6} playbackRate={2} />
      </Sequence>

      {/* Sound effect when counter starts climbing to 100% */}
      <Sequence from={PHASE2_START + COUNTER_CLIMB_START}>
        <Audio src={staticFile("whoosh.wav")} volume={0.6} />
      </Sequence>

      {/* Celebratory sound when counter hits 100% */}
      <Sequence from={phase2CounterEnd}>
        <Audio src={staticFile("whoosh.wav")} volume={0.8} playbackRate={1.5} />
      </Sequence>
    </AbsoluteFill>
  );
};
