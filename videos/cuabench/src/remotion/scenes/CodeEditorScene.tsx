import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, staticFile, Img, Audio, Sequence, spring } from "remotion";
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

// Syntax highlighting colors
const SYNTAX_COLORS = {
  keyword: "#ff7b72",
  function: "#d2a8ff",
  string: "#a5d6ff",
  variable: "#ffa657",
  operator: "#ff7b72",
  default: "#e6edf3",
};

interface Token {
  text: string;
  color: string;
}

const tokenizeLine = (line: string): Token[] => {
  if (!line.trim()) return [{ text: line, color: SYNTAX_COLORS.default }];

  const tokens: Token[] = [];

  if (line.includes('import')) {
    tokens.push({ text: 'import', color: SYNTAX_COLORS.keyword });
    tokens.push({ text: ' cuabench ', color: SYNTAX_COLORS.variable });
    tokens.push({ text: 'as', color: SYNTAX_COLORS.keyword });
    tokens.push({ text: ' cb', color: SYNTAX_COLORS.variable });
  } else if (line.includes('cb.Env')) {
    tokens.push({ text: 'env', color: SYNTAX_COLORS.variable });
    tokens.push({ text: ' = ', color: SYNTAX_COLORS.operator });
    tokens.push({ text: 'cb.Env', color: SYNTAX_COLORS.function });
    tokens.push({ text: '(task=', color: SYNTAX_COLORS.default });
    tokens.push({ text: '"Book a flight from NYC to LA"', color: SYNTAX_COLORS.string });
    tokens.push({ text: ')', color: SYNTAX_COLORS.default });
  } else if (line.includes('env.reset')) {
    tokens.push({ text: 'obs', color: SYNTAX_COLORS.variable });
    tokens.push({ text: ' = ', color: SYNTAX_COLORS.operator });
    tokens.push({ text: 'env.reset', color: SYNTAX_COLORS.function });
    tokens.push({ text: '()', color: SYNTAX_COLORS.default });
  } else if (line.includes('while')) {
    tokens.push({ text: 'while', color: SYNTAX_COLORS.keyword });
    tokens.push({ text: ' ', color: SYNTAX_COLORS.default });
    tokens.push({ text: 'not', color: SYNTAX_COLORS.keyword });
    tokens.push({ text: ' done', color: SYNTAX_COLORS.variable });
    tokens.push({ text: ':', color: SYNTAX_COLORS.operator });
  } else if (line.includes('model.act')) {
    tokens.push({ text: '    action', color: SYNTAX_COLORS.variable });
    tokens.push({ text: ' = ', color: SYNTAX_COLORS.operator });
    tokens.push({ text: 'model.act', color: SYNTAX_COLORS.function });
    tokens.push({ text: '(obs)', color: SYNTAX_COLORS.default });
  } else if (line.includes('env.step')) {
    tokens.push({ text: '    obs, reward, done', color: SYNTAX_COLORS.variable });
    tokens.push({ text: ' = ', color: SYNTAX_COLORS.operator });
    tokens.push({ text: 'env.step', color: SYNTAX_COLORS.function });
    tokens.push({ text: '(action)', color: SYNTAX_COLORS.default });
  } else {
    tokens.push({ text: line, color: SYNTAX_COLORS.default });
  }

  return tokens;
};

const CODE_LINES = [
  'import cuabench as cb',
  '',
  'env = cb.Env(task="Book a flight from NYC to LA")',
  '',
  'obs = env.reset()',
  'while not done:',
  '    action = model.act(obs)',
  '    obs, reward, done = env.step(action)',
];

const COMMENT_TEXT = "Comes w/ a simple python API for creating tasks & RL environments!";
const DOTS_DURATION = 40;

const BLACK_BACKGROUND = COLORS.background.dark;
const DIFF_GREEN_BG = "rgba(46, 160, 67, 0.15)";
const DIFF_GREEN_LINE = "#2ea043";
const LINE_NUMBER_COLOR = "rgba(255, 255, 255, 0.4)";
const BORDER_COLOR = "rgba(255, 255, 255, 0.1)";

// Phase 1: Code editor timing
const CODE_START = 10;
const FRAMES_PER_LINE = 4;
const COMMENT_START = CODE_START + (CODE_LINES.length * FRAMES_PER_LINE) + 10;
const COMMENT_REVEAL = COMMENT_START + DOTS_DURATION;
const TEXT_REVEAL_START = COMMENT_REVEAL + 25;
const LINE2_START = TEXT_REVEAL_START + 40;
const LINE2_LINGER = 50;

// Phase 2: VM transition timing
const VM_TRANSITION_START = LINE2_START + LINE2_LINGER;
const VM_EXPAND_DURATION = 25;
const CODE_FADE_DURATION = 15;
const MANAGED_APPEAR = VM_TRANSITION_START + 30;
const OS_APPEAR = MANAGED_APPEAR + 12;

// OS rotation timing
const OS_DISPLAY_DURATION = 30; // How long each OS is shown
const OS_TRANSITION_DURATION = 15; // Crossfade/morph duration

// OS configurations: dimensions, images, and styling
interface OSConfig {
  name: string;
  width: number;
  height: number;
  borderRadius: number;
  image: string;
  headerType: "macos" | "windows" | "none";
}

const OS_CONFIGS: OSConfig[] = [
  { name: "macOS", width: 1000, height: 580, borderRadius: 16, image: "macos-desktop.webp", headerType: "macos" },
  { name: "Windows", width: 1000, height: 580, borderRadius: 10, image: "windows-desktop.webp", headerType: "windows" },
  { name: "Linux", width: 1000, height: 580, borderRadius: 12, image: "linux-desktop.webp", headerType: "none" },
  { name: "Android", width: 300, height: 650, borderRadius: 32, image: "android-desktop.jpg", headerType: "none" },
];

// Zoom transition timing
const ZOOM_START = OS_APPEAR + OS_CONFIGS.length * OS_DISPLAY_DURATION;
const ZOOM_DURATION = 25;

export const CODE_EDITOR_DURATION = ZOOM_START + ZOOM_DURATION;

export const CodeEditorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Phase check
  const isVMPhase = frame >= VM_TRANSITION_START;

  // === PHASE 1: Code Editor Entry Animation ===
  // Spring-based entrance with scale and slide
  const entranceSpring = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 80,
      mass: 0.8,
    },
  });

  const editorTranslateY = interpolate(entranceSpring, [0, 1], [80, 0]);
  const editorScale = interpolate(entranceSpring, [0, 1], [0.92, 1]);
  const editorOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  const showDots = frame >= COMMENT_START && frame < COMMENT_REVEAL;
  const showFullComment = frame >= COMMENT_REVEAL;

  // Text animations
  const text1Progress = frame >= TEXT_REVEAL_START
    ? interpolate(frame, [TEXT_REVEAL_START, TEXT_REVEAL_START + 10], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : 0;

  const text2Progress = frame >= LINE2_START
    ? interpolate(frame, [LINE2_START, LINE2_START + 10], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : 0;

  // === PHASE 2: VM Transition ===

  // Surrounding text fade out
  const surroundingTextFade = isVMPhase
    ? interpolate(frame, [VM_TRANSITION_START, VM_TRANSITION_START + 12], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Editor expansion
  const expandProgress = isVMPhase
    ? interpolate(frame, [VM_TRANSITION_START, VM_TRANSITION_START + VM_EXPAND_DURATION], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : 0;

  const editorWidth = interpolate(expandProgress, [0, 1], [1100, 1500]);
  const editorHeight = interpolate(expandProgress, [0, 1], [450, 850]);
  const editorBorderRadius = interpolate(expandProgress, [0, 1], [16, 20]);

  // Code content fade out, desktop fade in
  const codeFadeOut = isVMPhase
    ? interpolate(frame, [VM_TRANSITION_START, VM_TRANSITION_START + CODE_FADE_DURATION], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const desktopFadeIn = isVMPhase
    ? interpolate(frame, [VM_TRANSITION_START + 5, VM_TRANSITION_START + CODE_FADE_DURATION + 5], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // "managed" text animation
  const managedProgress = frame >= MANAGED_APPEAR
    ? interpolate(frame, [MANAGED_APPEAR, MANAGED_APPEAR + 10], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : 0;

  // OS rotation logic
  const framesSinceOSAppear = Math.max(0, frame - OS_APPEAR);
  const currentOSIndex = Math.min(
    Math.floor(framesSinceOSAppear / OS_DISPLAY_DURATION),
    OS_CONFIGS.length - 1
  );
  const framesInCurrentOS = framesSinceOSAppear % OS_DISPLAY_DURATION;

  // Check if we're transitioning to the next OS
  const isOSTransitioning = framesInCurrentOS >= OS_DISPLAY_DURATION - OS_TRANSITION_DURATION && currentOSIndex < OS_CONFIGS.length - 1;
  const osTransitionProgress = isOSTransitioning
    ? (framesInCurrentOS - (OS_DISPLAY_DURATION - OS_TRANSITION_DURATION)) / OS_TRANSITION_DURATION
    : 0;

  // Current and next OS configs
  const currentOS = OS_CONFIGS[currentOSIndex];
  const nextOS = currentOSIndex < OS_CONFIGS.length - 1 ? OS_CONFIGS[currentOSIndex + 1] : currentOS;

  // Ease the OS transition progress for smooth size morphing
  const easedOSTransition = Easing.bezier(0.4, 0, 0.2, 1)(osTransitionProgress);

  // Zoom transition - zoom into screen (stays black)
  const zoomProgress = frame >= ZOOM_START
    ? interpolate(frame, [ZOOM_START, ZOOM_START + ZOOM_DURATION], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const easedZoom = Easing.bezier(0.4, 0, 0.2, 1)(zoomProgress);
  const zoomScale = interpolate(easedZoom, [0, 1], [1, 8]);

  // Interpolate VM frame dimensions during OS transition with easing
  const vmFrameWidth = frame >= OS_APPEAR
    ? interpolate(easedOSTransition, [0, 1], [currentOS.width, nextOS.width])
    : interpolate(expandProgress, [0, 1], [1100, OS_CONFIGS[0].width]);

  const vmFrameHeight = frame >= OS_APPEAR
    ? interpolate(easedOSTransition, [0, 1], [currentOS.height, nextOS.height])
    : interpolate(expandProgress, [0, 1], [450, OS_CONFIGS[0].height]);

  const vmFrameBorderRadius = frame >= OS_APPEAR
    ? interpolate(easedOSTransition, [0, 1], [currentOS.borderRadius, nextOS.borderRadius])
    : interpolate(expandProgress, [0, 1], [16, OS_CONFIGS[0].borderRadius]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK_BACKGROUND,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        {/* "Create tasks & RL Environments ..." - fades during VM transition */}
        {frame >= TEXT_REVEAL_START && surroundingTextFade > 0 && (
          <div
            style={{
              transform: `translateY(${interpolate(text1Progress, [0, 1], [50, 0])}px)`,
              opacity: interpolate(text1Progress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }) * surroundingTextFade,
              fontSize: 48,
              fontWeight: 400,
              color: COLORS.text.inverse,
              textAlign: "center",
            }}
          >
            Create tasks & RL Environments ...
          </div>
        )}


        {/* Code Editor / VM Frame */}
        <div
          style={{
            position: isVMPhase ? "absolute" : "relative",
            top: isVMPhase ? "50%" : undefined,
            left: isVMPhase ? "50%" : undefined,
            transform: isVMPhase
              ? `translate(-50%, -50%) scale(${zoomScale})`
              : `translateY(${editorTranslateY}px) scale(${editorScale})`,
            opacity: editorOpacity,
            width: frame >= OS_APPEAR ? vmFrameWidth : (isVMPhase ? interpolate(expandProgress, [0, 1], [1100, OS_CONFIGS[0].width]) : 1100),
            height: frame >= OS_APPEAR ? vmFrameHeight : (isVMPhase ? interpolate(expandProgress, [0, 1], [450, OS_CONFIGS[0].height]) : 450),
            borderRadius: frame >= OS_APPEAR ? vmFrameBorderRadius : (isVMPhase ? interpolate(expandProgress, [0, 1], [16, OS_CONFIGS[0].borderRadius]) : 16),
            overflow: "hidden",
            border: `1px solid ${BORDER_COLOR}`,
            backgroundColor: "#161b22",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Code editor header - before VM phase */}
          {!isVMPhase && (
            <div
              style={{
                padding: "14px 20px",
                borderBottom: `1px solid ${BORDER_COLOR}`,
                fontSize: 15,
                color: LINE_NUMBER_COLOR,
                fontFamily: monoFamily,
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              benchmark.py
            </div>
          )}

          {/* Platform-specific headers - with crossfade during transitions */}
          {isVMPhase && frame >= OS_APPEAR && (
            <div style={{ position: "relative", height: 28, flexShrink: 0 }}>
              {/* macOS header */}
              {(currentOS.name === "macOS" || (isOSTransitioning && nextOS.name === "macOS")) && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 28,
                    padding: "0 12px",
                    fontSize: 13,
                    fontFamily,
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "rgba(30, 30, 30, 0.95)",
                    opacity: currentOS.name === "macOS" ? (isOSTransitioning ? 1 - easedOSTransition : 1) : easedOSTransition,
                  }}
                >
                  <div style={{ display: "flex", gap: 6 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
                    <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#febc2e" }} />
                    <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c840" }} />
                  </div>
                  <div style={{ display: "flex", gap: 16, marginLeft: 16, color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
                    <span></span>
                    <span>Finder</span>
                    <span>File</span>
                    <span>Edit</span>
                    <span>View</span>
                  </div>
                  <div style={{ marginLeft: "auto", color: "rgba(255,255,255,0.9)" }}>
                    Thu Jun 19 10:52 AM
                  </div>
                </div>
              )}

              {/* Windows header */}
              {(currentOS.name === "Windows" || (isOSTransitioning && nextOS.name === "Windows")) && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 28,
                    padding: "0 12px",
                    fontSize: 12,
                    fontFamily,
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "rgba(32, 32, 32, 0.95)",
                    opacity: currentOS.name === "Windows" ? (isOSTransitioning ? 1 - easedOSTransition : 1) : easedOSTransition,
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>File Explorer</span>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>-</span>
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>[  ]</span>
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>x</span>
                  </div>
                </div>
              )}

              {/* Linux header */}
              {(currentOS.name === "Linux" || (isOSTransitioning && nextOS.name === "Linux")) && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 28,
                    padding: "0 12px",
                    fontSize: 12,
                    fontFamily,
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "rgba(40, 40, 40, 0.95)",
                    opacity: currentOS.name === "Linux" ? (isOSTransitioning ? 1 - easedOSTransition : 1) : easedOSTransition,
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>Activities</span>
                  <div style={{ flex: 1, textAlign: "center", color: "rgba(255,255,255,0.9)" }}>
                    Wed 12:50 PM
                  </div>
                  <div style={{ display: "flex", gap: 8, color: "rgba(255,255,255,0.7)" }}>
                    <span>vol</span>
                    <span>wifi</span>
                    <span>bat</span>
                  </div>
                </div>
              )}

              {/* Android - no header */}
            </div>
          )}

          {/* Initial VM transition header (before OS_APPEAR) */}
          {isVMPhase && frame < OS_APPEAR && (
            <div
              style={{
                height: 28,
                padding: "0 12px",
                fontSize: 13,
                fontFamily,
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(30, 30, 30, 0.95)",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#febc2e" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c840" }} />
              </div>
              <div style={{ display: "flex", gap: 16, marginLeft: 16, color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
                <span></span>
                <span>Finder</span>
                <span>File</span>
                <span>Edit</span>
                <span>View</span>
              </div>
              <div style={{ marginLeft: "auto", color: "rgba(255,255,255,0.9)" }}>
                Thu Jun 19 10:52 AM
              </div>
            </div>
          )}

          {/* Content area */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            {/* Code content - fades out during VM transition */}
            <div style={{ opacity: codeFadeOut, padding: "8px 0" }}>
              {CODE_LINES.map((line, idx) => {
                const lineVisible = frame >= CODE_START + idx * FRAMES_PER_LINE;
                const lineOpacity = lineVisible
                  ? interpolate(frame - (CODE_START + idx * FRAMES_PER_LINE), [0, 4], [0, 1], { extrapolateRight: "clamp" })
                  : 0;

                const tokens = tokenizeLine(line);

                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: line ? DIFF_GREEN_BG : "transparent",
                      opacity: lineOpacity,
                      borderLeft: line ? `4px solid ${DIFF_GREEN_LINE}` : "4px solid transparent",
                      minHeight: 32,
                    }}
                  >
                    <span style={{ width: 60, textAlign: "right", paddingRight: 16, color: LINE_NUMBER_COLOR, fontSize: 16, fontFamily: monoFamily }}>
                      {idx + 1}
                    </span>
                    <span style={{ width: 24, color: DIFF_GREEN_LINE, fontSize: 16, fontFamily: monoFamily }}>
                      {line ? "+" : ""}
                    </span>
                    <span style={{ flex: 1, padding: "8px 16px 8px 0", fontSize: 17, fontFamily: monoFamily, whiteSpace: "pre" }}>
                      {tokens.map((token, tidx) => (
                        <span key={tidx} style={{ color: token.color }}>{token.text}</span>
                      ))}
                    </span>
                  </div>
                );
              })}

              {/* Comment section */}
              {frame >= COMMENT_START - 10 && (
                <div
                  style={{
                    borderTop: `1px solid ${BORDER_COLOR}`,
                    padding: "20px 20px 40px 20px",
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                    opacity: interpolate(frame - (COMMENT_START - 10), [0, 8], [0, 1], { extrapolateRight: "clamp" }),
                  }}
                >
                  <Img src={staticFile("francesco.jpg")} style={{ width: 44, height: 44, borderRadius: "50%" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: SYNTAX_COLORS.default, marginBottom: 6 }}>
                      Francesco Bonacci - Chief Cuala Officer
                    </div>
                    <div style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", minHeight: 22 }}>
                      {showDots && (
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          {[0, 1, 2].map((i) => {
                            const bounce = Math.sin(((frame - COMMENT_START) + i * 5) * 0.3) * 4;
                            return (
                              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.5)", transform: `translateY(${bounce}px)` }} />
                            );
                          })}
                        </div>
                      )}
                      {showFullComment && COMMENT_TEXT}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop images - crossfade between OSes */}
            {isVMPhase && (
              <>
                {OS_CONFIGS.map((os, idx) => {
                  // Calculate opacity for this OS's desktop
                  let desktopOpacity = 0;

                  if (frame < OS_APPEAR) {
                    // Initial transition - only show first OS
                    if (idx === 0) desktopOpacity = desktopFadeIn;
                  } else if (idx === currentOSIndex) {
                    // Current OS
                    if (isOSTransitioning) {
                      desktopOpacity = 1 - osTransitionProgress;
                    } else {
                      desktopOpacity = 1;
                    }
                  } else if (idx === currentOSIndex + 1 && isOSTransitioning) {
                    // Next OS fading in
                    desktopOpacity = osTransitionProgress;
                  }

                  if (desktopOpacity <= 0) return null;

                  return (
                    <Img
                      key={os.name}
                      src={staticFile(os.image)}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: desktopOpacity,
                      }}
                    />
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* "... in 6 lines of code" - fades during VM transition */}
        {frame >= LINE2_START && (
          <div
            style={{
              transform: `translateY(${interpolate(text2Progress, [0, 1], [50, 0])}px)`,
              opacity: interpolate(text2Progress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }) * surroundingTextFade,
              fontSize: 48,
              fontWeight: 400,
              color: COLORS.text.inverse,
              textAlign: "center",
            }}
          >
            ... with a simple Python API
          </div>
        )}
      </div>

      {/* Audio */}
      {/* Editor entrance sound */}
      <Sequence from={0}>
        <Audio src={staticFile("deep-whoosh.wav")} volume={0.5} />
      </Sequence>
      {CODE_LINES.map((line, idx) => (
        line && (
          <Sequence key={`code-sound-${idx}`} from={CODE_START + idx * FRAMES_PER_LINE}>
            <Audio src={staticFile("whoosh.wav")} volume={0.3} />
          </Sequence>
        )
      ))}
      {/* Typing dots tick sounds - alternating ascending/descending */}
      <Sequence from={COMMENT_START} durationInFrames={DOTS_DURATION}>
        <Audio src={staticFile("ascending-ticks.wav")} volume={0.4} />
      </Sequence>
      {/* Pop sound when comment appears */}
      <Sequence from={COMMENT_REVEAL}>
        <Audio src={staticFile("pop.wav")} volume={0.5} />
      </Sequence>
      <Sequence from={TEXT_REVEAL_START}>
        <Audio src={staticFile("deep-whoosh.wav")} volume={0.5} />
      </Sequence>
      <Sequence from={LINE2_START}>
        <Audio src={staticFile("deep-whoosh.wav")} volume={0.5} />
      </Sequence>
      {/* Platform change sounds */}
      {OS_CONFIGS.map((_, idx) => (
        <Sequence key={`os-sound-${idx}`} from={OS_APPEAR + idx * OS_DISPLAY_DURATION}>
          <Audio src={staticFile("selection-tap.wav")} volume={0.6} />
        </Sequence>
      ))}
      {/* Zoom transition whoosh */}
      <Sequence from={ZOOM_START}>
        <Audio src={staticFile("whoosh.wav")} volume={0.5} />
      </Sequence>

      {/* "managed environments" text - absolutely positioned at TOP */}
      {frame >= MANAGED_APPEAR && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: "50%",
            transform: `translateX(-50%) translateY(${interpolate(managedProgress, [0, 1], [40, 0])}px)`,
            opacity: interpolate(managedProgress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }) * (1 - easedZoom),
            fontFamily,
            fontSize: 36,
            fontWeight: 400,
            color: COLORS.text.inverse,
          }}
        >
          managed environments (self-hostable)
        </div>
      )}

      {/* OS names - absolutely positioned at BOTTOM */}
      {frame >= OS_APPEAR && (
        <div
          style={{
            position: "absolute",
            bottom: 140,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 1 - easedZoom,
          }}
        >
          {OS_CONFIGS.map((os, idx) => {
            let opacity = 0;
            let translateY = 0;

            if (idx === currentOSIndex) {
              if (idx === 0 && framesSinceOSAppear < 10) {
                // First OS appearing - slide up from below
                opacity = interpolate(framesSinceOSAppear, [0, 10], [0, 1], {
                  extrapolateRight: "clamp",
                });
                translateY = interpolate(framesSinceOSAppear, [0, 10], [40, 0], {
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.4, 0, 0.2, 1)
                });
              } else if (isOSTransitioning) {
                // Current OS exiting - slide up and out
                opacity = 1 - easedOSTransition;
                translateY = interpolate(easedOSTransition, [0, 1], [0, -40]);
              } else {
                opacity = 1;
                translateY = 0;
              }
            } else if (idx === currentOSIndex + 1 && isOSTransitioning) {
              // Next OS entering - slide up from below
              opacity = easedOSTransition;
              translateY = interpolate(easedOSTransition, [0, 1], [40, 0]);
            }

            if (opacity <= 0) return null;

            return (
              <div
                key={os.name}
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: `translateX(-50%) translateY(${translateY}px)`,
                  opacity,
                  fontSize: 64,
                  fontWeight: 600,
                  color: COLORS.text.inverse,
                  whiteSpace: "nowrap",
                }}
              >
                {os.name}
              </div>
            );
          })}
        </div>
      )}

      {/* Black overlay - fades in during zoom */}
      {zoomProgress > 0 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: BLACK_BACKGROUND,
            opacity: easedZoom,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
