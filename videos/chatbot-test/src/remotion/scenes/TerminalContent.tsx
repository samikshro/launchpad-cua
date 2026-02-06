import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANNOUNCEMENT_DATA, getFramesPerCommandChar } from "./AnnouncementData";
import { Cursor } from "./Cursor";

export const TerminalContent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typingEndFrame = ANNOUNCEMENT_DATA.typingText.length * getFramesPerCommandChar(fps);
  const visibleChars = Math.floor(
    interpolate(frame, [0, typingEndFrame], [0, ANNOUNCEMENT_DATA.typingText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const displayedText = ANNOUNCEMENT_DATA.typingText.slice(0, visibleChars);
  const isTyping = visibleChars < ANNOUNCEMENT_DATA.typingText.length;

  const inputAppear = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 55%)",
        color: "#0f172a",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div style={{ height: 340 }} />

      <div
        style={{
          fontSize: 62,
          fontWeight: 500,
          letterSpacing: "-0.03em",
          marginBottom: 90,
        }}
      >
        {ANNOUNCEMENT_DATA.readyText}
      </div>

      <div
        style={{
          width: "67%",
          minHeight: 94,
          border: "1px solid #cbd5e1",
          borderRadius: 46,
          boxShadow: "0 12px 28px rgba(15, 23, 42, 0.09)",
          display: "flex",
          alignItems: "center",
          padding: "16px 18px 16px 22px",
          opacity: inputAppear,
          transform: `translateY(${(1 - inputAppear) * 14}px)`,
          backgroundColor: "#ffffff",
        }}
      >
        <div
          style={{
            fontSize: 54,
            fontWeight: 300,
            color: "#111827",
            marginRight: 20,
            lineHeight: 1,
          }}
        >
          +
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            fontSize: ANNOUNCEMENT_DATA.inputFontSize,
            lineHeight: 1,
            color: displayedText.length > 0 ? "#0f172a" : "#94a3b8",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: 56,
          }}
        >
          {displayedText || ANNOUNCEMENT_DATA.inputPlaceholder}
          <Cursor blinking={!isTyping} />
        </div>

        <div
          style={{
            width: 30,
            height: 34,
            margin: "0 14px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 2,
              width: 12,
              height: 16,
              marginLeft: -6,
              border: "3px solid #111827",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              borderBottom: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 15,
              width: 18,
              height: 10,
              marginLeft: -9,
              border: "3px solid #111827",
              borderTop: "none",
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 25,
              width: 3,
              height: 7,
              marginLeft: -1.5,
              backgroundColor: "#111827",
              borderRadius: 2,
            }}
          />
        </div>

        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: 999,
            backgroundColor: "#44c65f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={waveBar(9)} />
            <span style={waveBar(18)} />
            <span style={waveBar(11)} />
          </div>
        </div>
      </div>
    </div>
  );
};

const waveBar = (height: number): React.CSSProperties => ({
  width: 4,
  height,
  borderRadius: 999,
  backgroundColor: "#ffffff",
  display: "inline-block",
});
