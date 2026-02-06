export const ANNOUNCEMENT_DATA = {
  readyText: "Ready when you are.",
  inputPlaceholder: "Ask anything",
  typingText: "Best plumber near me for emergency repairs",
  sendButtonLabel: "Voice",
  charsPerSecond: 22,
  submitDelayInFrames: 4,
  submitPointerTravelInFrames: 10,
  submitClickInFrames: 6,
  collapseInFrames: 10,
  inputFontSize: 48,
  backgroundColor: "#f8fafc",
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

export const getTypingDoneFrame = (fps: number): number => {
  return Math.ceil(ANNOUNCEMENT_DATA.typingText.length * getFramesPerCommandChar(fps));
};

export const getSubmitMoveStartFrame = (fps: number): number => {
  return getTypingDoneFrame(fps) + ANNOUNCEMENT_DATA.submitDelayInFrames;
};

export const getSubmitClickStartFrame = (fps: number): number => {
  return getSubmitMoveStartFrame(fps) + ANNOUNCEMENT_DATA.submitPointerTravelInFrames;
};

export const getCollapseStartFrame = (fps: number): number => {
  return getSubmitClickStartFrame(fps) + ANNOUNCEMENT_DATA.submitClickInFrames;
};

export const getOutputDoneFrame = (fps: number): number => {
  return getCollapseStartFrame(fps) + ANNOUNCEMENT_DATA.collapseInFrames;
};
