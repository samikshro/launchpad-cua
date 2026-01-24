import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Audio, Sequence, staticFile, Img } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Urbanist";
import { loadFont as loadMono, fontFamily as monoFamily } from "@remotion/google-fonts/JetBrainsMono";
import { COLORS } from "@launchpad/assets/brand";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});

loadMono("normal", {
  subsets: ["latin"],
  weights: ["400", "500"],
});

const BLACK_BACKGROUND = COLORS.background.dark;
const CARD_BG = "#1a1a1a";
const CARD_BORDER = "rgba(255, 255, 255, 0.1)";
const WHITE_TEXT = COLORS.text.inverse;
const MUTED_TEXT = "rgba(255, 255, 255, 0.5)";

// 2048 tile colors
const getTileColor = (num: number): string => {
  const colors: Record<number, string> = {
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e",
  };
  return colors[num] || "#3c3a32";
};

// Word data with custom appear times
const WORD_DATA = [
  { word: "an", appearFrame: 5 },
  { word: "open-source", appearFrame: 10 },
  { word: "registry", appearFrame: 18 },
  { word: "of", appearFrame: 26 },
  { word: "tasks", appearFrame: 32 },
];

const SLIDE_UP_DURATION = 8;

// Task registry cards data
const REGISTRY_CARDS = [
  {
    name: "cua-bench-basic",
    description: "A collection of basic desktop interaction environments for CUA agents.",
    envs: 15,
    tasks: 40,
  },
  {
    name: "cua-bench-real",
    description: "A collection of realistic desktop interaction environments simulating real applications.",
    envs: 3,
    tasks: 0,
  },
  {
    name: "cua-bench-security",
    description: "Hand crafted tasks focused on CUA agent security, such as prompt injection and poisoning.",
    envs: 2,
    tasks: 0,
  },
  {
    name: "cua-bench-osworld",
    description: "Adapter for OSWorld benchmark tasks.",
    envs: 1,
    tasks: 369,
  },
  {
    name: "cua-bench-waa",
    description: "Adapter for WindowsAgentArena benchmark tasks.",
    envs: 1,
    tasks: 154,
  },
  {
    name: "cua-bench-miniwob",
    description: "Adapter for MiniWoB++ RL environments.",
    envs: 0,
    tasks: 0,
  },
];

// Timing
const CARDS_START = 65;
const CARD_STAGGER = 6;
const CARDS_END = CARDS_START + REGISTRY_CARDS.length * CARD_STAGGER;
const LINGER_DURATION = 60;

// Counter animation - shows total tasks when cards appear
const COUNTER_START = CARDS_START + 12; // Start shortly after first card
const COUNTER_DURATION = 40; // frames to count up
const TOTAL_TASKS = REGISTRY_CARDS.reduce((sum, card) => sum + card.tasks, 0); // 105 tasks
const SKY_BLUE = "#0EA5E9";

// Shrink to terminal timing
const SHRINK_START = CARDS_END + LINGER_DURATION;
const SHRINK_DURATION = 30;

// Terminal content timing (after shrink completes)
const TERMINAL_READY = SHRINK_START + SHRINK_DURATION;

// "a CLI for parallelized evaluations..." word-by-word (faster timing)
const CLI_WORDS = [
  { word: "a", appearFrame: TERMINAL_READY + 5 },
  { word: "CLI", appearFrame: TERMINAL_READY + 10 },
  { word: "for", appearFrame: TERMINAL_READY + 16 },
  { word: "parallelized", appearFrame: TERMINAL_READY + 24 },
  { word: "evaluations...", appearFrame: TERMINAL_READY + 34 },
];

const COMMAND_START = TERMINAL_READY + 90;
const COMMAND = "cb run dataset datasets/cua-bench-basic";
const TYPING_SPEED = 1; // frames per character
const COMMAND_END = COMMAND_START + COMMAND.length * TYPING_SPEED;
const OUTPUT_START = COMMAND_END + 15;
const PROGRESS_START = OUTPUT_START + 20;
const PROGRESS_DURATION = 40;
const RESULTS_START = PROGRESS_START + PROGRESS_DURATION + 10;

// Second command - task generation
const GENERATE_PAUSE = 40; // Pause after first results
const GENERATE_PROMPT_START = RESULTS_START + GENERATE_PAUSE;
const GENERATE_COMMAND = "cb task generate \"2048 game\"";
const GENERATE_COMMAND_END = GENERATE_PROMPT_START + GENERATE_COMMAND.length * TYPING_SPEED;
const GENERATE_OUTPUT_START = GENERATE_COMMAND_END + 15;

// Output lines for task generation (staggered appearance)
const GENERATE_LINES = [
  { text: "Generating task environment...", frame: GENERATE_OUTPUT_START, color: "rgba(255, 255, 255, 0.8)" },
  { text: "Created task: 2048-game", frame: GENERATE_OUTPUT_START + 20, color: "#28c840" },
  { text: "Generated gui/index.html", frame: GENERATE_OUTPUT_START + 32, color: "#28c840" },
  { text: "Generated evaluation logic", frame: GENERATE_OUTPUT_START + 44, color: "#28c840" },
  { text: "Generated solution oracle", frame: GENERATE_OUTPUT_START + 56, color: "#28c840" },
  { text: "Ready to run: cua-bench run --task 2048-game", frame: GENERATE_OUTPUT_START + 72, color: "#4ec9b0" },
];

// 2048 preview timing
const PREVIEW_START = GENERATE_OUTPUT_START + 30;
const PREVIEW_SLIDE_DURATION = 15;

// "and an agent for generating environments..." word-by-word (appears with preview)
const BOTTOM_WORDS = [
  { word: "and", appearFrame: PREVIEW_START + 5 },
  { word: "an", appearFrame: PREVIEW_START + 10 },
  { word: "agent", appearFrame: PREVIEW_START + 15 },
  { word: "for", appearFrame: PREVIEW_START + 20 },
  { word: "generating", appearFrame: PREVIEW_START + 25 },
  { word: "environments...", appearFrame: PREVIEW_START + 32 },
];

// Ending sequence timing
const CONTENT_LINGER = 25; // Linger before fade out
const FADE_OUT_START = GENERATE_OUTPUT_START + 80 + CONTENT_LINGER;
const FADE_OUT_DURATION = 20;

// "Try it now" timing (appears before cuabench.ai)
const TRY_IT_START = FADE_OUT_START + FADE_OUT_DURATION + 5;
const TRY_IT_HOLD = 30; // Hold time before fading
const TRY_IT_FADE_DURATION = 12;

// cuabench.ai logo timing
const LOGO_APPEAR_START = TRY_IT_START + TRY_IT_HOLD;
const LOGO_SCRAMBLE_DURATION = 25; // Duration of scramble effect
const LOGO_LINGER = 90; // Extended for CTA
const LOGO_FADE_START = LOGO_APPEAR_START + LOGO_SCRAMBLE_DURATION + LOGO_LINGER;
const LOGO_FADE_DURATION = 15;

// "Now Open-Source with Cua" CTA timing (cascade animation)
const CTA_START = LOGO_APPEAR_START + LOGO_SCRAMBLE_DURATION + 15;
const CTA_WORD_DELAY = 6; // Frames between each word
const CTA_WORDS = ["Now", "Open-Source"];
const CTA_URL = "github.com/trycua/cua";

// Scramble effect constants
const LOGO_TEXT = "cuabench.ai";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

// Seeded random for consistent scramble across frames
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

export const REGISTRY_SCENE_DURATION = LOGO_FADE_START + LOGO_FADE_DURATION + 10;

export const RegistryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Stay on black background
  const bgColor = BLACK_BACKGROUND;
  const textColor = WHITE_TEXT;

  // Shrink to terminal animation
  const shrinkProgress = frame >= SHRINK_START
    ? interpolate(frame, [SHRINK_START, SHRINK_START + SHRINK_DURATION], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const easedShrink = Easing.bezier(0.4, 0, 0.2, 1)(shrinkProgress);

  // Registry content fades out and shrinks
  const registryScale = interpolate(easedShrink, [0, 1], [1, 0.4]);
  const registryOpacity = interpolate(easedShrink, [0, 0.5], [1, 0], {
    extrapolateRight: "clamp",
  });

  // Counter animation - counts up total tasks
  const counterProgress = frame >= COUNTER_START
    ? interpolate(frame, [COUNTER_START, COUNTER_START + COUNTER_DURATION], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      })
    : 0;
  const counterValue = Math.floor(counterProgress * TOTAL_TASKS);
  const counterFadeIn = frame >= COUNTER_START
    ? interpolate(frame, [COUNTER_START, COUNTER_START + 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const counterOpacity = counterFadeIn * registryOpacity;

  // Terminal fades in
  const terminalFadeIn = interpolate(easedShrink, [0.3, 0.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Content fade out (terminal, preview, text)
  const contentFadeOut = frame >= FADE_OUT_START
    ? interpolate(frame, [FADE_OUT_START, FADE_OUT_START + FADE_OUT_DURATION], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : 1;

  const terminalOpacity = terminalFadeIn * contentFadeOut;

  // "Try it now" animation
  const tryItAppearProgress = frame >= TRY_IT_START
    ? interpolate(frame, [TRY_IT_START, TRY_IT_START + 10], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      })
    : 0;

  const tryItFadeOut = frame >= TRY_IT_START + TRY_IT_HOLD
    ? interpolate(frame, [TRY_IT_START + TRY_IT_HOLD, TRY_IT_START + TRY_IT_HOLD + TRY_IT_FADE_DURATION], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.quad),
      })
    : 1;

  const tryItTranslateY = interpolate(tryItAppearProgress, [0, 1], [30, 0]);
  const tryItOpacity = tryItAppearProgress * tryItFadeOut;

  // Logo animation
  const logoAppearProgress = frame >= LOGO_APPEAR_START
    ? interpolate(frame, [LOGO_APPEAR_START, LOGO_APPEAR_START + 12], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : 0;

  const logoFadeOut = frame >= LOGO_FADE_START
    ? interpolate(frame, [LOGO_FADE_START, LOGO_FADE_START + LOGO_FADE_DURATION], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : 1;

  const logoTranslateY = interpolate(logoAppearProgress, [0, 1], [40, 0]);
  const logoOpacity = logoAppearProgress * logoFadeOut;

  // Generate scrambled/decrypted logo text
  const decryptedLogoText = useMemo(() => {
    if (frame < LOGO_APPEAR_START) return "";

    const framesSinceReveal = frame - LOGO_APPEAR_START;

    return LOGO_TEXT.split("").map((char, idx) => {
      // Each character resolves quickly, staggered by index
      const charRevealFrame = idx * 1.5; // Fast stagger
      const framesSinceCharStart = framesSinceReveal - charRevealFrame;

      if (framesSinceCharStart >= 8) {
        // Fully revealed after 8 frames of scrambling
        return char;
      } else if (framesSinceCharStart >= 0) {
        // Scrambling - change every frame
        const seed = idx * 100 + frame;
        const randomIdx = Math.floor(seededRandom(seed) * SCRAMBLE_CHARS.length);
        return SCRAMBLE_CHARS[randomIdx];
      } else {
        // Not yet started - show scramble anyway for effect
        const seed = idx * 100 + frame;
        const randomIdx = Math.floor(seededRandom(seed) * SCRAMBLE_CHARS.length);
        return SCRAMBLE_CHARS[randomIdx];
      }
    }).join("");
  }, [frame]);

  // Terminal size (starts large, shrinks to final size)
  const terminalWidth = interpolate(easedShrink, [0.3, 1], [1200, 900], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const terminalHeight = interpolate(easedShrink, [0.3, 1], [800, 550], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
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
            color: WHITE_TEXT,
          }}
        >
          cua.ai
        </span>
      </div>

      {/* Registry content - shrinks and fades */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 60,
          width: "100%",
          height: "100%",
          transform: `scale(${registryScale})`,
          opacity: registryOpacity,
        }}
      >
        {/* Title - word by word animation */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 16,
            marginBottom: 60,
            marginTop: 40,
          }}
        >
        {WORD_DATA.map((wordData, idx) => {
          const isVisible = frame >= wordData.appearFrame;
          if (!isVisible) return null;

          const framesSinceAppear = frame - wordData.appearFrame;
          const slideProgress = interpolate(
            framesSinceAppear,
            [0, SLIDE_UP_DURATION],
            [0, 1],
            {
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.4, 0, 0.2, 1),
            }
          );

          const translateY = interpolate(slideProgress, [0, 1], [50, 0]);
          const opacity = interpolate(framesSinceAppear, [0, SLIDE_UP_DURATION * 0.5], [0, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <span
              key={idx}
              style={{
                fontSize: 56,
                fontWeight: 600,
                color: textColor,
                transform: `translateY(${translateY}px)`,
                opacity,
              }}
            >
              {wordData.word}
            </span>
          );
        })}
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
          flex: 1,
          alignContent: "center",
        }}
      >
        {REGISTRY_CARDS.map((card, idx) => {
          const cardAppearFrame = CARDS_START + idx * CARD_STAGGER;
          const isVisible = frame >= cardAppearFrame;
          if (!isVisible) return null;

          const framesSinceAppear = frame - cardAppearFrame;
          const slideProgress = interpolate(
            framesSinceAppear,
            [0, 12],
            [0, 1],
            {
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.4, 0, 0.2, 1),
            }
          );

          const translateY = interpolate(slideProgress, [0, 1], [60, 0]);
          const opacity = interpolate(framesSinceAppear, [0, 8], [0, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={card.name}
              style={{
                backgroundColor: CARD_BG,
                borderRadius: 12,
                border: `1px solid ${CARD_BORDER}`,
                padding: 24,
                transform: `translateY(${translateY}px)`,
                opacity,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: monoFamily,
                    fontSize: 20,
                    fontWeight: 600,
                    color: WHITE_TEXT,
                  }}
                >
                  {card.name}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    color: MUTED_TEXT,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  GitHub <span style={{ fontSize: 12 }}>-&gt;</span>
                </span>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: 15,
                  color: MUTED_TEXT,
                  lineHeight: 1.5,
                  margin: 0,
                  flex: 1,
                }}
              >
                {card.description}
              </p>

              {/* Stats */}
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.4)",
                  fontFamily: monoFamily,
                }}
              >
                {card.envs} envs - {card.tasks} tasks
              </div>
            </div>
          );
        })}
        </div>

        {/* Counter - shows task breakdown horizontally */}
        {frame >= COUNTER_START && counterOpacity > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: 60,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 48,
              opacity: counterOpacity,
            }}
          >
            {/* Cua-Bench tasks */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span
                style={{
                  fontFamily,
                  fontSize: 48,
                  fontWeight: 700,
                  color: WHITE_TEXT,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {Math.floor(counterProgress * 40)}
              </span>
              <span style={{ fontFamily, fontSize: 14, color: MUTED_TEXT }}>
                Cua-Bench
              </span>
            </div>
            {/* Separator */}
            <span style={{ fontSize: 32, color: "rgba(255, 255, 255, 0.3)" }}>+</span>
            {/* OSWorld tasks */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span
                style={{
                  fontFamily,
                  fontSize: 48,
                  fontWeight: 700,
                  color: WHITE_TEXT,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {Math.floor(counterProgress * 369)}
              </span>
              <span style={{ fontFamily, fontSize: 14, color: MUTED_TEXT }}>
                OSWorld
              </span>
            </div>
            {/* Separator */}
            <span style={{ fontSize: 32, color: "rgba(255, 255, 255, 0.3)" }}>+</span>
            {/* WAA tasks */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span
                style={{
                  fontFamily,
                  fontSize: 48,
                  fontWeight: 700,
                  color: WHITE_TEXT,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {Math.floor(counterProgress * 154)}
              </span>
              <span style={{ fontFamily, fontSize: 14, color: MUTED_TEXT }}>
                Windows Agent Arena
              </span>
            </div>
            {/* Equals */}
            <span style={{ fontSize: 32, color: SKY_BLUE }}>=</span>
            {/* Total */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span
                style={{
                  fontFamily,
                  fontSize: 56,
                  fontWeight: 700,
                  color: SKY_BLUE,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {counterValue}
              </span>
              <span style={{ fontFamily, fontSize: 14, fontWeight: 600, color: SKY_BLUE }}>
                total tasks
              </span>
            </div>
          </div>
        )}
      </div>

      {/* "a cli for parallelized evaluations..." - word by word above terminal */}
      {frame >= TERMINAL_READY && contentFadeOut > 0 && (
        <div
          style={{
            position: "absolute",
            top: 100,
            left: 0,
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 16,
            // Shift left when 2048 preview appears
            transform: `translateX(${interpolate(
              frame,
              [PREVIEW_START, PREVIEW_START + PREVIEW_SLIDE_DURATION],
              [0, -100],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.4, 0, 0.2, 1),
              }
            )}px)`,
          }}
        >
          {CLI_WORDS.map((wordData, idx) => {
            const isVisible = frame >= wordData.appearFrame;
            if (!isVisible) return null;

            const framesSinceAppear = frame - wordData.appearFrame;
            const slideProgress = interpolate(
              framesSinceAppear,
              [0, SLIDE_UP_DURATION],
              [0, 1],
              {
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.4, 0, 0.2, 1),
              }
            );

            const translateY = interpolate(slideProgress, [0, 1], [50, 0]);
            const opacity = interpolate(framesSinceAppear, [0, SLIDE_UP_DURATION * 0.5], [0, 1], {
              extrapolateRight: "clamp",
            });

            return (
              <span
                key={idx}
                style={{
                  fontSize: 48,
                  fontWeight: 500,
                  color: WHITE_TEXT,
                  transform: `translateY(${translateY}px)`,
                  opacity: opacity * contentFadeOut,
                }}
              >
                {wordData.word}
              </span>
            );
          })}
        </div>
      )}

      {/* Terminal window - fades in during shrink, shifts left when preview appears */}
      {shrinkProgress > 0 && terminalOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            width: terminalWidth,
            height: terminalHeight,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 25px 80px rgba(0, 0, 0, 0.6)",
            opacity: terminalOpacity,
            display: "flex",
            flexDirection: "column",
            marginTop: 80,
            // Shift left when 2048 preview appears
            transform: `translateX(${interpolate(
              frame,
              [PREVIEW_START, PREVIEW_START + PREVIEW_SLIDE_DURATION],
              [0, -100],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.4, 0, 0.2, 1),
              }
            )}px)`,
          }}
        >
          {/* Terminal title bar */}
          <div
            style={{
              height: 32,
              backgroundColor: "#3d3d3d",
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              gap: 8,
            }}
          >
            {/* Traffic lights */}
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#febc2e" }} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#28c840" }} />
            </div>
            {/* Title */}
            <div
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.8)",
                fontFamily: monoFamily,
              }}
            >
              cuabench - zsh - 80x24
            </div>
          </div>

          {/* Terminal content */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#1a1a1a",
              padding: 20,
              fontFamily: monoFamily,
              fontSize: 15,
              color: WHITE_TEXT,
              lineHeight: 1.8,
            }}
          >
            {/* Prompt line with typing command */}
            <div>
              <span style={{ color: "#4ec9b0" }}>user@cuabench</span>
              <span style={{ color: "rgba(255, 255, 255, 0.6)" }}> ~ % </span>
              <span style={{ color: WHITE_TEXT }}>
                {frame >= COMMAND_START
                  ? COMMAND.slice(0, Math.min(Math.floor((frame - COMMAND_START) / TYPING_SPEED), COMMAND.length))
                  : ""}
              </span>
              {/* Cursor - shows while typing or before command starts */}
              {frame < COMMAND_END && (
                <span
                  style={{
                    display: "inline-block",
                    width: 10,
                    height: 18,
                    backgroundColor: frame % 30 < 15 ? "rgba(255, 255, 255, 0.8)" : "transparent",
                    marginLeft: 2,
                    verticalAlign: "middle",
                  }}
                />
              )}
            </div>

            {/* Output: Running message */}
            {frame >= OUTPUT_START && (
              <div style={{ marginTop: 16 }}>
                <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  Running 100 tasks across 10 workers...
                </span>
              </div>
            )}

            {/* Progress bar */}
            {frame >= PROGRESS_START && (
              <div style={{ marginTop: 16 }}>
                {(() => {
                  const progressPercent = Math.min(
                    interpolate(frame, [PROGRESS_START, PROGRESS_START + PROGRESS_DURATION], [0, 100], {
                      extrapolateRight: "clamp",
                    }),
                    100
                  );
                  const filledBars = Math.floor(progressPercent / 2.5); // 40 bars total
                  const progressBar = String.fromCharCode(9608).repeat(filledBars) + String.fromCharCode(9617).repeat(40 - filledBars);
                  const count = Math.floor(progressPercent);
                  return (
                    <span style={{ color: "#28c840" }}>
                      {progressBar}
                    </span>
                  );
                })()}
                <span style={{ color: "rgba(255, 255, 255, 0.6)", marginLeft: 8 }}>
                  {Math.floor(interpolate(frame, [PROGRESS_START, PROGRESS_START + PROGRESS_DURATION], [0, 100], { extrapolateRight: "clamp" }))}/100
                </span>
              </div>
            )}

            {/* Results */}
            {frame >= RESULTS_START && (
              <div style={{ marginTop: 16 }}>
                <span style={{ color: "#28c840" }}>v 94 passed</span>
                <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>  </span>
                <span style={{ color: "#ff5f57" }}>x 6 failed</span>
                <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>  </span>
                <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>time: 4m 32s</span>
              </div>
            )}

            {/* Second prompt - task generation */}
            {frame >= GENERATE_PROMPT_START && (
              <div style={{ marginTop: 24 }}>
                <span style={{ color: "#4ec9b0" }}>user@cuabench</span>
                <span style={{ color: "rgba(255, 255, 255, 0.6)" }}> ~ % </span>
                <span style={{ color: WHITE_TEXT }}>
                  {GENERATE_COMMAND.slice(0, Math.min(Math.floor((frame - GENERATE_PROMPT_START) / TYPING_SPEED), GENERATE_COMMAND.length))}
                </span>
                {/* Cursor while typing */}
                {frame < GENERATE_COMMAND_END && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 18,
                      backgroundColor: frame % 30 < 15 ? "rgba(255, 255, 255, 0.8)" : "transparent",
                      marginLeft: 2,
                      verticalAlign: "middle",
                    }}
                  />
                )}
              </div>
            )}

            {/* Generate command output lines */}
            {GENERATE_LINES.map((line, idx) => (
              frame >= line.frame && (
                <div key={idx} style={{ marginTop: idx === 0 ? 16 : 4 }}>
                  <span style={{ color: line.color }}>{line.text}</span>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* 2048 Preview - slides in from right, closer to terminal */}
      {frame >= PREVIEW_START && contentFadeOut > 0 && (
        <div
          style={{
            position: "absolute",
            right: 180,
            top: "50%",
            transform: `translateY(-50%) translateX(${interpolate(
              frame,
              [PREVIEW_START, PREVIEW_START + PREVIEW_SLIDE_DURATION],
              [200, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.4, 0, 0.2, 1),
              }
            )}px)`,
            opacity: interpolate(
              frame,
              [PREVIEW_START, PREVIEW_START + PREVIEW_SLIDE_DURATION * 0.6],
              [0, 1],
              { extrapolateRight: "clamp" }
            ) * contentFadeOut,
          }}
        >
          {/* 2048 Game Preview Card */}
          <div
            style={{
              width: 320,
              backgroundColor: "#1a1a1a",
              borderRadius: 16,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Preview header */}
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#28c840" }} />
              <span style={{ fontFamily: monoFamily, fontSize: 13, color: WHITE_TEXT }}>2048-game</span>
              <span style={{ fontSize: 11, color: MUTED_TEXT, marginLeft: "auto" }}>generated</span>
            </div>

            {/* 2048 Game Grid */}
            <div style={{ padding: 20 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 8,
                  backgroundColor: "#0d0d0d",
                  borderRadius: 8,
                  padding: 8,
                }}
              >
                {[2, 4, 2, null, 4, 8, 16, 2, null, 2, 4, 8, 2, null, null, 4].map((num, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 6,
                      backgroundColor: num ? getTileColor(num) : "rgba(255, 255, 255, 0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: num && num >= 100 ? 18 : 22,
                      fontWeight: 700,
                      color: num && num >= 8 ? WHITE_TEXT : "#1a1a1a",
                    }}
                  >
                    {num || ""}
                  </div>
                ))}
              </div>
            </div>

            {/* Generated files list */}
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                fontFamily: monoFamily,
                fontSize: 11,
                color: MUTED_TEXT,
              }}
            >
              <div>gui/index.html</div>
              <div>eval.py</div>
              <div>oracle.py</div>
            </div>
          </div>
        </div>
      )}

      {/* "and an agent for generating environments..." - word by word at bottom */}
      {frame >= PREVIEW_START && contentFadeOut > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 100,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {BOTTOM_WORDS.map((wordData, idx) => {
            const isVisible = frame >= wordData.appearFrame;
            if (!isVisible) return null;

            const framesSinceAppear = frame - wordData.appearFrame;
            const slideProgress = interpolate(
              framesSinceAppear,
              [0, SLIDE_UP_DURATION],
              [0, 1],
              {
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.4, 0, 0.2, 1),
              }
            );

            const translateY = interpolate(slideProgress, [0, 1], [50, 0]);
            const opacity = interpolate(framesSinceAppear, [0, SLIDE_UP_DURATION * 0.5], [0, 1], {
              extrapolateRight: "clamp",
            });

            return (
              <span
                key={idx}
                style={{
                  fontSize: 48,
                  fontWeight: 500,
                  color: WHITE_TEXT,
                  transform: `translateY(${translateY}px)`,
                  opacity: opacity * contentFadeOut,
                }}
              >
                {wordData.word}
              </span>
            );
          })}
        </div>
      )}

      {/* "Try it now" - appears before cuabench.ai */}
      {frame >= TRY_IT_START && tryItOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `translateY(${tryItTranslateY}px)`,
            opacity: tryItOpacity,
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontWeight: 600,
              color: WHITE_TEXT,
              fontFamily,
            }}
          >
            Try it now
          </span>
        </div>
      )}

      {/* cuabench.ai logo - appears after everything fades out with scramble effect */}
      {frame >= LOGO_APPEAR_START && logoOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            transform: `translateY(${logoTranslateY}px)`,
            opacity: logoOpacity,
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
            {decryptedLogoText}
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

          {/* "Now Open-Source with Cua" CTA with GitHub logo - cascade animation */}
          {frame >= CTA_START && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 32,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {CTA_WORDS.map((word, idx) => {
                const wordStartFrame = CTA_START + idx * CTA_WORD_DELAY;
                const isVisible = frame >= wordStartFrame;
                if (!isVisible) return null;

                const framesSinceAppear = frame - wordStartFrame;
                const slideProgress = interpolate(
                  framesSinceAppear,
                  [0, 12],
                  [0, 1],
                  {
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.4, 0, 0.2, 1),
                  }
                );
                const translateY = interpolate(slideProgress, [0, 1], [30, 0]);
                const opacity = interpolate(framesSinceAppear, [0, 8], [0, 1], {
                  extrapolateRight: "clamp",
                });

                return (
                  <span
                    key={idx}
                    style={{
                      fontSize: 32,
                      fontWeight: 600,
                      color: WHITE_TEXT,
                      transform: `translateY(${translateY}px)`,
                      opacity,
                      marginRight: 12,
                    }}
                  >
                    {word}
                  </span>
                );
              })}

              {/* GitHub logo + URL - appears after words */}
              {(() => {
                const githubStartFrame = CTA_START + CTA_WORDS.length * CTA_WORD_DELAY;
                if (frame < githubStartFrame) return null;

                const framesSinceAppear = frame - githubStartFrame;
                const slideProgress = interpolate(
                  framesSinceAppear,
                  [0, 12],
                  [0, 1],
                  {
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.4, 0, 0.2, 1),
                  }
                );
                const translateY = interpolate(slideProgress, [0, 1], [30, 0]);
                const opacity = interpolate(framesSinceAppear, [0, 8], [0, 1], {
                  extrapolateRight: "clamp",
                });

                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transform: `translateY(${translateY}px)`,
                      opacity,
                    }}
                  >
                    <Img
                      src={staticFile("github-logo.svg")}
                      style={{
                        height: 28,
                        width: "auto",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 28,
                        fontWeight: 500,
                        color: "#58a6ff",
                        fontFamily: monoFamily,
                      }}
                    >
                      {CTA_URL}
                    </span>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Word appear sounds */}
      {WORD_DATA.map((wordData, idx) => (
        <Sequence key={`word-sound-${idx}`} from={wordData.appearFrame}>
          <Audio src={staticFile("whoosh.wav")} volume={0.3} />
        </Sequence>
      ))}

      {/* Card appear sounds */}
      {REGISTRY_CARDS.map((_, idx) => (
        <Sequence key={`card-sound-${idx}`} from={CARDS_START + idx * CARD_STAGGER}>
          <Audio src={staticFile("pop.wav")} volume={0.5} />
        </Sequence>
      ))}

      {/* Shrink transition whoosh */}
      <Sequence from={SHRINK_START}>
        <Audio src={staticFile("whoosh.wav")} volume={0.5} />
      </Sequence>

      {/* CLI words whoosh sounds */}
      {CLI_WORDS.map((wordData, idx) => (
        <Sequence key={`cli-word-sound-${idx}`} from={wordData.appearFrame}>
          <Audio src={staticFile("whoosh.wav")} volume={0.3} />
        </Sequence>
      ))}

      {/* Typing sound while command is being typed */}
      <Sequence from={COMMAND_START} durationInFrames={COMMAND_END - COMMAND_START}>
        <Audio src={staticFile("typing.wav")} volume={0.5} />
      </Sequence>

      {/* Pop sound when command completes */}
      <Sequence from={COMMAND_END}>
        <Audio src={staticFile("pop.wav")} volume={0.5} />
      </Sequence>

      {/* Second command typing sound */}
      <Sequence from={GENERATE_PROMPT_START} durationInFrames={GENERATE_COMMAND_END - GENERATE_PROMPT_START}>
        <Audio src={staticFile("typing.wav")} volume={0.5} />
      </Sequence>

      {/* Pop sounds for generate output lines */}
      {GENERATE_LINES.filter(line => line.text.startsWith("Created") || line.text.startsWith("Generated")).map((line, idx) => (
        <Sequence key={`gen-line-sound-${idx}`} from={line.frame}>
          <Audio src={staticFile("pop.wav")} volume={0.4} />
        </Sequence>
      ))}

      {/* Whoosh for 2048 preview sliding in */}
      <Sequence from={PREVIEW_START}>
        <Audio src={staticFile("whoosh.wav")} volume={0.4} />
      </Sequence>

      {/* Bottom words whoosh sounds */}
      {BOTTOM_WORDS.map((wordData, idx) => (
        <Sequence key={`bottom-word-sound-${idx}`} from={wordData.appearFrame}>
          <Audio src={staticFile("whoosh.wav")} volume={0.3} />
        </Sequence>
      ))}

      {/* "Try it now" appear sound */}
      <Sequence from={TRY_IT_START}>
        <Audio src={staticFile("whoosh.wav")} volume={0.5} />
      </Sequence>

      {/* Logo unscramble sound - same as TypingScene */}
      <Sequence from={LOGO_APPEAR_START}>
        <Audio src={staticFile("unscramble.wav")} volume={0.6} playbackRate={3} />
      </Sequence>

      {/* CTA word appear sounds */}
      {CTA_WORDS.map((_, idx) => (
        <Sequence key={`cta-word-sound-${idx}`} from={CTA_START + idx * CTA_WORD_DELAY}>
          <Audio src={staticFile("whoosh.wav")} volume={0.3} />
        </Sequence>
      ))}

      {/* GitHub logo appear sound */}
      <Sequence from={CTA_START + CTA_WORDS.length * CTA_WORD_DELAY}>
        <Audio src={staticFile("pop.wav")} volume={0.5} />
      </Sequence>
    </AbsoluteFill>
  );
};
