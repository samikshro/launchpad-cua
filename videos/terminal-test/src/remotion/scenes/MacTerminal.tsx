import { AbsoluteFill } from "remotion";
import { ANNOUNCEMENT_DATA } from "./AnnouncementData";
import { TerminalContent } from "./TerminalContent";

export const MacTerminal: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        padding: 32,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: "0 32px 90px rgba(15, 23, 42, 0.24)",
          border: "1px solid rgba(148, 163, 184, 0.3)",
        }}
      >
        <div
          style={{
            height: 58,
            backgroundColor: "#f8fafc",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: "#ff5f57",
              }}
            />
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: "#febc2e",
              }}
            />
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: "#28c840",
              }}
            />
          </div>

          <div
            style={{
              flex: 1,
              textAlign: "center",
              color: "#475569",
              fontSize: 24,
              fontWeight: 550,
              marginRight: 54,
            }}
          >
            {ANNOUNCEMENT_DATA.windowTitle}
          </div>
        </div>

        <TerminalContent />
      </div>
    </AbsoluteFill>
  );
};
