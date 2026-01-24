import { useCurrentFrame, interpolate, Easing } from "remotion";
import { ReactNode } from "react";

interface TextRevealProps {
  children: ReactNode;
  durationInFrames?: number;
  delay?: number;
  direction?: "left" | "right";
  easing?: (t: number) => number;
  style?: React.CSSProperties;
  maskColor?: string;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  durationInFrames = 30,
  delay = 0,
  direction = "left",
  easing = Easing.inOut(Easing.cubic),
  style,
  maskColor = "#000",
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);

  const clipProgress = interpolate(adjustedFrame, [0, durationInFrames], [0, 100], {
    extrapolateRight: "clamp",
    easing,
  });

  const clipPath =
    direction === "left"
      ? `inset(0 ${100 - clipProgress}% 0 0)`
      : `inset(0 0 0 ${100 - clipProgress}%)`;

  return (
    <div style={{ position: "relative", ...style }}>
      <div style={{ clipPath }}>{children}</div>
    </div>
  );
};
