import { useCurrentFrame, interpolate, Easing } from "remotion";
import { ReactNode } from "react";

interface SlideUpProps {
  children: ReactNode;
  durationInFrames?: number;
  delay?: number;
  distance?: number;
  easing?: (t: number) => number;
  style?: React.CSSProperties;
}

export const SlideUp: React.FC<SlideUpProps> = ({
  children,
  durationInFrames = 20,
  delay = 0,
  distance = 50,
  easing = Easing.out(Easing.cubic),
  style,
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);

  const translateY = interpolate(adjustedFrame, [0, durationInFrames], [distance, 0], {
    extrapolateRight: "clamp",
    easing,
  });

  const opacity = interpolate(adjustedFrame, [0, durationInFrames * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        transform: `translateY(${translateY}px)`,
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
