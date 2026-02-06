import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ANNOUNCEMENT_DATA,
  getFramesPerCommandChar,
  getFramesPerOutputLine,
  getOutputStartFrame,
} from "./AnnouncementData";
import { Cursor } from "./Cursor";

export const TerminalContent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typingEndFrame = ANNOUNCEMENT_DATA.command.length * getFramesPerCommandChar(fps);
  const outputStartFrame = getOutputStartFrame(fps);

  const visibleChars = Math.floor(
    interpolate(frame, [0, typingEndFrame], [0, ANNOUNCEMENT_DATA.command.length], {
      extrapolateRight: "clamp",
    })
  );

  const displayedText = ANNOUNCEMENT_DATA.command.slice(0, visibleChars);
  const isTyping = visibleChars < ANNOUNCEMENT_DATA.command.length;
  const showOutput = frame >= outputStartFrame;

  const framesPerLine = getFramesPerOutputLine(fps);
  const linesStartFrame = outputStartFrame + framesPerLine;

  const visibleLines = Math.floor(
    interpolate(
      frame,
      [
        linesStartFrame,
        linesStartFrame + ANNOUNCEMENT_DATA.outputLines.length * framesPerLine,
      ],
      [0, ANNOUNCEMENT_DATA.outputLines.length],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    )
  );

  return (
    <div
      style={{
        flex: 1,
        padding: 24,
        backgroundColor: "#ffffff",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          color: "#1f2937",
          fontSize: 46,
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: "#16a34a", fontWeight: 600 }}>{ANNOUNCEMENT_DATA.promptPrefix}</span>
        <span style={{ color: "#1f2937", margin: "0 10px" }}>$</span>
        <span>{displayedText}</span>
        {!showOutput ? <Cursor blinking={!isTyping} /> : null}
      </div>

      {showOutput ? (
        <div style={{ marginTop: 20, color: "#334155", fontSize: 22, lineHeight: 1.2 }}>
          <pre
            style={{
              margin: "0 0 8px 0",
              fontFamily: "inherit",
              fontSize: 20,
              color: "#0f172a",
            }}
          >
            {ANNOUNCEMENT_DATA.outputHeader.join("\n")}
          </pre>
          {ANNOUNCEMENT_DATA.outputLines.slice(0, visibleLines).map((line) => {
            return (
              <div key={line} style={{ color: "#1f2937" }}>
                {line}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
