import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  durationInFrames?: number;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  easing?: (t: number) => number;
  style?: React.CSSProperties;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  durationInFrames = 20,
  delay = 0,
  direction = "up",
  distance = 30,
  easing = Easing.out(Easing.cubic),
  style,
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);

  const opacity = interpolate(adjustedFrame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
    easing,
  });

  const getTransform = () => {
    if (direction === "none") return "none";

    const progress = interpolate(adjustedFrame, [0, durationInFrames], [distance, 0], {
      extrapolateRight: "clamp",
      easing,
    });

    switch (direction) {
      case "up":
        return `translateY(${progress}px)`;
      case "down":
        return `translateY(-${progress}px)`;
      case "left":
        return `translateX(${progress}px)`;
      case "right":
        return `translateX(-${progress}px)`;
      default:
        return "none";
    }
  };

  return (
    <AbsoluteFill style={{ opacity, transform: getTransform(), ...style }}>
      {children}
    </AbsoluteFill>
  );
};
