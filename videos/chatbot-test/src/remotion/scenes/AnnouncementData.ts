export const ANNOUNCEMENT_DATA = {
  readyText: "Ready when you are.",
  inputPlaceholder: "Ask anything",
  typingText: "Best plumber near me for emergency repairs",
  sendButtonLabel: "Voice",
  charsPerSecond: 22,
  inputFontSize: 48,
  backgroundColor: "#f8fafc",
  outputDoneFrame: 120,
  terminalIntroOffsetY: 520,
  terminalRestOffsetY: 40,
  terminalRotateX: 14,
  terminalRotateYStart: 8,
  terminalRotateYEnd: -8,
  terminalStartScale: 0.92,
  terminalEndScale: 1,
  flipOutDegrees: -90,
  headlineText: "Agent Skills are here",
  headlineDurationInFrames: 60,
  brands: ["Remotion", "Claude Code", "OpenCode"] as const,
};

export const getFramesPerCommandChar = (fps: number): number => {
  return fps / ANNOUNCEMENT_DATA.charsPerSecond;
};

export const getOutputDoneFrame = (): number => {
  return ANNOUNCEMENT_DATA.outputDoneFrame;
};
