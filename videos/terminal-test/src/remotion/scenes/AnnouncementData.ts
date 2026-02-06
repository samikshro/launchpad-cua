export const ANNOUNCEMENT_DATA = {
  windowTitle: "Terminal",
  promptPrefix: "~",
  command: "npx skills add remotion-dev/remotion",
  charsPerSecond: 15,
  outputDelaySeconds: 0.5,
  outputLineIntervalMs: 50,
  backgroundColor: "#f8fafc",
  terminalIntroOffsetY: 700,
  terminalRestOffsetY: 100,
  terminalRotateX: 20,
  terminalRotateYStart: 10,
  terminalRotateYEnd: -10,
  terminalStartScale: 0.9,
  terminalEndScale: 1,
  flipOutDegrees: -90,
  headlineText: "Agent Skills now available",
  headlineDurationInFrames: 60,
  brands: ["Remotion", "Claude Code", "OpenCode"] as const,
  outputHeader: ["SKILLS CLI", "----------"],
  outputLines: [
    "[skills] Source: https://github.com/remotion-dev/remotion",
    "[skills] Repository cloned",
    "[skills] Found 1 template",
    "[skills] Template: terminal-announcement",
    "[skills] Installing dependencies",
    "[skills] Ready to animate",
  ],
};

export const getFramesPerCommandChar = (fps: number): number => {
  return fps / ANNOUNCEMENT_DATA.charsPerSecond;
};

export const getFramesPerOutputLine = (fps: number): number => {
  return Math.max(1, Math.round((fps * ANNOUNCEMENT_DATA.outputLineIntervalMs) / 1000));
};

export const getOutputStartFrame = (fps: number): number => {
  const typingFrames = ANNOUNCEMENT_DATA.command.length * getFramesPerCommandChar(fps);
  const delayFrames = ANNOUNCEMENT_DATA.outputDelaySeconds * fps;

  return Math.ceil(typingFrames + delayFrames);
};

export const getOutputDoneFrame = (fps: number): number => {
  return getOutputStartFrame(fps) + ANNOUNCEMENT_DATA.outputLines.length * getFramesPerOutputLine(fps);
};
