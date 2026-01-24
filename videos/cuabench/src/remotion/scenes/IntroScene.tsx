import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Audio, Sequence, staticFile } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Urbanist";
import { COLORS } from "@launchpad/assets/brand";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});

// Word data with custom appear times (in frames)
const WORD_DATA = [
  { word: "Computer-Use", appearFrame: 0 },
  { word: "agents", appearFrame: 5 },         // quick after Computer-Use
  { word: "are", appearFrame: 14 },           // pause, then are
  { word: "becoming", appearFrame: 22 },      // linear after are
  { word: "more", appearFrame: 30 },          // then more
  { word: "capable", appearFrame: 35 },       // quick after more
  { word: "than", appearFrame: 44 },          // pause
  { word: "ever.", appearFrame: 50 },         // then ever
];

const WORD_GAP = 18;
const FONT_SIZE = 72;
const LINE_HEIGHT = 100;
const MAX_LINE_WIDTH = 1400;
const SLIDE_UP_DURATION = 6;
const SHIFT_DURATION = 10;

// Timing for phases
const LAST_WORD_APPEAR = 50;
const HOLD_DURATION = 15;  // Hold after all words appear
const EXIT_START = LAST_WORD_APPEAR + SLIDE_UP_DURATION + HOLD_DURATION; // ~71
const EXIT_DURATION = 8;   // Fast fade-out transition

// Counter animation timing
const COUNTER_START = 22; // When "becoming" appears
const COUNTER_DURATION = 35; // How long to count up
const COUNTER_TARGET = 62.9; // Target percentage
const SKY_BLUE = "#0EA5E9"; // Vibrant sky blue for counter

// Measure word width - using canvas for accuracy
const measureWordWidth = (word: string): number => {
  if (typeof document === "undefined") {
    // SSR fallback
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

// Pre-calculate which line each word belongs to
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

// Export the scene duration for use in Root.tsx
export const INTRO_SCENE_DURATION = EXIT_START + EXIT_DURATION;

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Exit animation progress (ease-in: slow start, bulk at end)
  const exitProgress = frame >= EXIT_START
    ? interpolate(
        frame,
        [EXIT_START, EXIT_START + EXIT_DURATION],
        [0, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.in(Easing.quad), // Parabolic: slow start, fast end
        }
      )
    : 0;

  // Exit transforms
  const exitTranslateY = interpolate(exitProgress, [0, 1], [0, -120]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  // Counter animation
  const counterProgress = frame >= COUNTER_START
    ? interpolate(
        frame,
        [COUNTER_START, COUNTER_START + COUNTER_DURATION],
        [0, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic), // Fast start, slow end for dramatic effect
        }
      )
    : 0;

  const counterValue = counterProgress * COUNTER_TARGET;
  const counterOpacity = frame >= COUNTER_START
    ? interpolate(frame, [COUNTER_START, COUNTER_START + 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Group words by line
  const lineGroups: number[][] = Array.from({ length: TOTAL_LINES }, () => []);
  LINE_ASSIGNMENTS.forEach((lineIdx, wordIdx) => {
    lineGroups[lineIdx].push(wordIdx);
  });

  // Calculate vertical center
  const totalHeight = TOTAL_LINES * LINE_HEIGHT;
  const baseY = (height - totalHeight) / 2;

  // Build word positions
  const wordElements: React.ReactElement[] = [];

  lineGroups.forEach((wordIndices, lineIdx) => {
    // For this line, figure out which words are visible
    const visibleIndices = wordIndices.filter(i => frame >= WORD_DATA[i].appearFrame);
    if (visibleIndices.length === 0) return;

    // Calculate widths for positioning
    const wordWidths = wordIndices.map(i => measureWordWidth(WORD_DATA[i].word));

    // Find the most recent word that appeared on this line
    const latestVisibleIdx = visibleIndices[visibleIndices.length - 1];
    const latestAppearFrame = WORD_DATA[latestVisibleIdx].appearFrame;
    const framesSinceLatest = frame - latestAppearFrame;

    // Previous visible count (before latest word)
    const prevVisibleIndices = visibleIndices.slice(0, -1);

    // Calculate previous total width
    let prevTotalWidth = 0;
    prevVisibleIndices.forEach((wordIdx, i) => {
      prevTotalWidth += wordWidths[wordIndices.indexOf(wordIdx)];
      if (i > 0) prevTotalWidth += WORD_GAP;
    });

    // Calculate current total width
    let currentTotalWidth = 0;
    visibleIndices.forEach((wordIdx, i) => {
      currentTotalWidth += wordWidths[wordIndices.indexOf(wordIdx)];
      if (i > 0) currentTotalWidth += WORD_GAP;
    });

    // Animate the horizontal shift
    const shiftProgress = interpolate(
      framesSinceLatest,
      [0, SHIFT_DURATION],
      [0, 1],
      {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
      }
    );

    const animatedTotalWidth = prevVisibleIndices.length > 0
      ? interpolate(shiftProgress, [0, 1], [prevTotalWidth, currentTotalWidth])
      : currentTotalWidth;

    const lineStartX = (width - animatedTotalWidth) / 2;

    // Position each visible word
    let xOffset = 0;
    visibleIndices.forEach((wordIdx) => {
      const wordData = WORD_DATA[wordIdx];
      const wordWidth = wordWidths[wordIndices.indexOf(wordIdx)];
      const wordAppearFrame = wordData.appearFrame;
      const framesSinceAppear = frame - wordAppearFrame;

      // Slide up animation for appearing
      const slideProgress = interpolate(
        framesSinceAppear,
        [0, SLIDE_UP_DURATION],
        [0, 1],
        {
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }
      );

      const appearTranslateY = interpolate(slideProgress, [0, 1], [50, 0]);
      const appearOpacity = interpolate(framesSinceAppear, [0, SLIDE_UP_DURATION * 0.5], [0, 1], {
        extrapolateRight: "clamp",
      });

      // Combine appear animation with exit animation
      const totalTranslateY = appearTranslateY + exitTranslateY;
      const totalOpacity = appearOpacity * exitOpacity;

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

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background.cream,
      }}
    >
      {wordElements}

      {/* Counter animation */}
      {frame >= COUNTER_START && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            opacity: counterOpacity * exitOpacity,
            transform: `translateY(${exitTranslateY}px)`,
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
                color: COLORS.text.primary,
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
                color: COLORS.text.primary,
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
              color: COLORS.text.primary,
              opacity: 0.5,
              marginTop: 8,
            }}
          >
            OSWorld (Xie et al., 2024)
          </span>
        </div>
      )}

      {/* Sound effects for each word */}
      {WORD_DATA.map((wordData, idx) => (
        <Sequence key={`sound-${idx}`} from={wordData.appearFrame}>
          <Audio src={staticFile("whoosh.wav")} volume={0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
