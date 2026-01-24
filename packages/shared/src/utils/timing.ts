/**
 * Convert frames to seconds
 */
export const framesToSeconds = (frames: number, fps: number = 30): number => {
  return frames / fps;
};

/**
 * Convert seconds to frames
 */
export const secondsToFrames = (seconds: number, fps: number = 30): number => {
  return Math.round(seconds * fps);
};

/**
 * Format duration as MM:SS
 */
export const formatDuration = (frames: number, fps: number = 30): string => {
  const totalSeconds = Math.floor(frames / fps);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
