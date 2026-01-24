import { useCurrentFrame, interpolate, Easing } from "remotion";

interface UseAnimatedValueOptions {
  from: number;
  to: number;
  durationInFrames: number;
  delay?: number;
  easing?: (t: number) => number;
}

export const useAnimatedValue = ({
  from,
  to,
  durationInFrames,
  delay = 0,
  easing = Easing.out(Easing.cubic),
}: UseAnimatedValueOptions): number => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);

  return interpolate(adjustedFrame, [0, durationInFrames], [from, to], {
    extrapolateRight: "clamp",
    easing,
  });
};
