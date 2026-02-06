import { AbsoluteFill } from "remotion";
import { TerminalContent } from "./TerminalContent";

export const MacTerminal: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#f8fafc",
        padding: 30,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 24,
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          boxShadow: "0 32px 90px rgba(15, 23, 42, 0.14)",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          style={{
            height: 62,
            backgroundColor: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
          }}
        >
          <div style={{ display: "flex", gap: 9, width: 66 }}>
            <span
              style={{
                width: 13,
                height: 13,
                borderRadius: 999,
                backgroundColor: "#ff5f57",
                display: "inline-block",
              }}
            />
            <span
              style={{
                width: 13,
                height: 13,
                borderRadius: 999,
                backgroundColor: "#febc2e",
                display: "inline-block",
              }}
            />
            <span
              style={{
                width: 13,
                height: 13,
                borderRadius: 999,
                backgroundColor: "#28c840",
                display: "inline-block",
              }}
            />
          </div>
          <div
            style={{
              color: "#475569",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            Chatbot
          </div>
          <div style={{ width: 66 }} />
        </div>
        <div style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <TerminalContent />
        </div>
      </div>
    </AbsoluteFill>
  );
};
