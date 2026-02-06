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
        width: 18,
        height: 46,
        marginLeft: 6,
        borderRadius: 2,
        backgroundColor: "#1f2937",
        display: "inline-block",
        opacity,
      }}
    />
  );
};
