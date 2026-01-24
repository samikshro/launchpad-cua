import { useCurrentFrame, interpolate, Easing } from "remotion";

interface UseFadeInOptions {
  durationInFrames?: number;
  delay?: number;
  easing?: (t: number) => number;
}

interface FadeInStyle {
  opacity: number;
}

export const useFadeIn = ({
  durationInFrames = 20,
  delay = 0,
  easing = Easing.out(Easing.cubic),
}: UseFadeInOptions = {}): FadeInStyle => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);

  const opacity = interpolate(adjustedFrame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
    easing,
  });

  return { opacity };
};
