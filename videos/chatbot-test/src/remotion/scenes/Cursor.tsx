import { useCurrentFrame, useVideoConfig } from "remotion";

interface CursorProps {
  blinking: boolean;
}

export const Cursor: React.FC<CursorProps> = ({ blinking }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blinkFrame = frame % fps;
  const opacity = blinking ? (blinkFrame < fps / 2 ? 1 : 0) : 1;

  return (
    <span
      style={{
        width: 3,
        height: 44,
        marginLeft: 4,
        borderRadius: 2,
        backgroundColor: "#111827",
        display: "inline-block",
        opacity,
      }}
    />
  );
};
