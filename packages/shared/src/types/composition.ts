/**
 * Standard video dimension presets
 */
export const VIDEO_PRESETS = {
  "1080p": { width: 1920, height: 1080 },
  "720p": { width: 1280, height: 720 },
  "4k": { width: 3840, height: 2160 },
  square: { width: 1080, height: 1080 },
  vertical: { width: 1080, height: 1920 },
} as const;

export type VideoPreset = keyof typeof VIDEO_PRESETS;

/**
 * Common frame rates
 */
export const FPS = {
  STANDARD: 30,
  CINEMATIC: 24,
  SMOOTH: 60,
} as const;
