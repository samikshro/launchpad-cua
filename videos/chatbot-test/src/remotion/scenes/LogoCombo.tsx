import { AbsoluteFill, Easing, Series, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANNOUNCEMENT_DATA } from "./AnnouncementData";

const AnnouncementText: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: "GT Planar, Inter, sans-serif",
          fontSize: 62,
          fontWeight: 700,
          color: "#1f2937",
          transform: `scale(${scale})`,
        }}
      >
        {ANNOUNCEMENT_DATA.headlineText}
      </span>
    </AbsoluteFill>
  );
};

const Logos: React.FC = () => {
  const [first, second, third] = ANNOUNCEMENT_DATA.brands;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <div style={brandStyle}>{first}</div>
        <div style={plusStyle}>+</div>
        <div style={brandStyle}>{second}</div>
        <div
          style={{
            ...brandStyle,
            transform: "scale(0.72)",
            transformOrigin: "left center",
          }}
        >
          {third}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const LogoCombo: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const textDuration = Math.min(ANNOUNCEMENT_DATA.headlineDurationInFrames, durationInFrames - 1);
  const logosDuration = Math.max(1, durationInFrames - textDuration);

  return (
    <Series>
      <Series.Sequence durationInFrames={textDuration}>
        <AnnouncementText />
      </Series.Sequence>
      <Series.Sequence durationInFrames={logosDuration}>
        <Logos />
      </Series.Sequence>
    </Series>
  );
};

const brandStyle: React.CSSProperties = {
  padding: "14px 24px",
  borderRadius: 14,
  border: "1px solid rgba(148, 163, 184, 0.35)",
  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.12)",
  backgroundColor: "rgba(255, 255, 255, 0.94)",
  color: "#0f172a",
  fontFamily: "Inter, sans-serif",
  fontSize: 44,
  fontWeight: 600,
  letterSpacing: "-0.02em",
};

const plusStyle: React.CSSProperties = {
  color: "#475569",
  fontFamily: "Inter, sans-serif",
  fontSize: 72,
  fontWeight: 300,
};
