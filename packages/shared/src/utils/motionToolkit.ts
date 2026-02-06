import { Easing, interpolate } from "remotion";

interface TimedProgressOptions {
  frame: number;
  from?: number;
  durationInFrames?: number;
  easing?: ((input: number) => number) | undefined;
}

export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const timedProgress = ({
  frame,
  from = 0,
  durationInFrames = 30,
  easing,
}: TimedProgressOptions): number =>
  interpolate(frame, [from, from + durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

interface StaggeredProgressOptions extends TimedProgressOptions {
  index: number;
  staggerInFrames?: number;
}

export const staggeredProgress = ({
  frame,
  index,
  staggerInFrames = 3,
  from = 0,
  durationInFrames = 30,
  easing = Easing.out(Easing.cubic),
}: StaggeredProgressOptions): number =>
  timedProgress({
    frame,
    from: from + index * staggerInFrames,
    durationInFrames,
    easing,
  });

interface BlurByVelocityOptions {
  frame: number;
  from?: number;
  durationInFrames?: number;
  distance?: number;
  maxBlur?: number;
  easing?: ((input: number) => number) | undefined;
}

/**
 * Approximate motion blur by sampling interpolation velocity between neighboring frames.
 */
export const blurByVelocity = ({
  frame,
  from = 0,
  durationInFrames = 20,
  distance = 120,
  maxBlur = 20,
  easing = Easing.out(Easing.cubic),
}: BlurByVelocityOptions): number => {
  const current = interpolate(frame, [from, from + durationInFrames], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
  const prev = interpolate(frame - 1, [from, from + durationInFrames], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
  return Math.min(maxBlur, Math.abs(current - prev) * 0.55);
};

export const sineFloat = (frame: number, amplitude = 10, speed = 0.06, phase = 0): number =>
  Math.sin(frame * speed + phase) * amplitude;
