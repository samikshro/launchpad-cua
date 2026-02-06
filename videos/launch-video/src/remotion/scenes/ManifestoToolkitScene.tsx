import React from "react";
import {
  AbsoluteFill,
  Easing,
  Series,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import {
  CheckmarkDraw,
  ChromaPulseBadge,
  CoinSpinTransition,
  DashboardCardReveal,
  DotSlashMorph,
  GlassFloatCard,
  GlowOutlineWord,
  GradientShiftBackground,
  GravityDrop,
  KineticWordStagger,
  MotionBlurWord,
  NodeMapFlow,
  PillIconWipe,
  PortalCircleTransition,
  SmoothScrollCards,
} from "@launchpad/shared/components/animations";
import { LAUNCH_COLORS, TYPOGRAPHY } from "./Theme";

const EASE_IN_OUT_CUBIC = Easing.bezier(0.645, 0.045, 0.355, 1);

const TEMPLATE_DURATION = 30;
const TEMPLATE_COUNT = 15;
const TRANSITION_DURATION = 8;
export const MANIFESTO_TOOLKIT_SCENE_DURATION = TEMPLATE_DURATION * TEMPLATE_COUNT;

const timelineBoundaries = Array.from(
  { length: TEMPLATE_COUNT - 1 },
  (_, index) => (index + 1) * TEMPLATE_DURATION
);

const TemplateFrame: React.FC<{
  title: string;
  subtitle: string;
  children: React.ReactNode;
  background?: string;
}> = ({ title, subtitle, children, background }) => {
  const frame = useCurrentFrame();
  const glowX = 14 + Math.sin(frame * 0.03) * 8;
  const glowY = 10 + Math.cos(frame * 0.04) * 7;

  return (
    <AbsoluteFill
      style={{
        background:
          background ??
          `linear-gradient(140deg, ${LAUNCH_COLORS.night} 0%, ${LAUNCH_COLORS.deep} 44%, #111827 100%), radial-gradient(circle at 84% 12%, rgba(56, 189, 248, 0.18), transparent 44%)`,
        color: "#f8fafc",
        fontFamily: TYPOGRAPHY.display,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          opacity: 0.18,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(34, 211, 238, 0.14), transparent 32%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 36,
          right: 36,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          letterSpacing: "0.03em",
          color: "rgba(186, 230, 253, 0.94)",
          zIndex: 2,
        }}
      >
        <span>{title}</span>
        <span style={{ color: "rgba(203, 213, 225, 0.85)" }}>{subtitle}</span>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 56px",
          zIndex: 2,
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, transparent 0%, transparent 72%, rgba(2, 6, 23, 0.5) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

const MatchCutOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const activeBoundary = timelineBoundaries.find((boundary) => {
    const start = boundary - TRANSITION_DURATION / 2;
    const end = boundary + TRANSITION_DURATION / 2;
    return frame >= start && frame <= end;
  });

  if (!activeBoundary) {
    return null;
  }

  const start = activeBoundary - TRANSITION_DURATION / 2;
  const progress = (frame - start) / TRANSITION_DURATION;
  const sweepX = interpolate(progress, [0, 1], [-150, 150], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_CUBIC,
  });
  const barOpacity =
    progress < 0.5
      ? interpolate(progress, [0, 0.5], [0, 1])
      : interpolate(progress, [0.5, 1], [1, 0]);
  const flashOpacity =
    progress < 0.45
      ? interpolate(progress, [0, 0.45], [0, 0.18])
      : interpolate(progress, [0.45, 1], [0.18, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: -320,
          bottom: -320,
          left: "50%",
          width: 420,
          marginLeft: -210,
          transform: `translateX(${sweepX}%) skewX(-16deg)`,
          background:
            "linear-gradient(180deg, rgba(34, 211, 238, 0.92) 0%, rgba(56, 189, 248, 0.74) 46%, rgba(16, 185, 129, 0.8) 100%)",
          opacity: barOpacity,
          boxShadow: "0 0 70px rgba(34, 211, 238, 0.62)",
          mixBlendMode: "screen",
          pointerEvents: "none",
          zIndex: 30,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#ffffff",
          opacity: flashOpacity,
          pointerEvents: "none",
          zIndex: 29,
        }}
      />
    </>
  );
};

const CryptoPillIcon: React.FC<{ label: string; bg: string; ring?: string }> = ({
  label,
  bg,
  ring = "#e2e8f0",
}) => (
  <div
    style={{
      width: 58,
      height: 58,
      borderRadius: 999,
      background: bg,
      color: "#f8fafc",
      border: `1px solid ${ring}`,
      fontSize: 18,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 12px 22px rgba(2, 6, 23, 0.35)",
    }}
  >
    {label}
  </div>
);

const BrainPopTemplate: React.FC = () => {
  return (
    <TemplateFrame title="00:00 Entrance" subtitle="Kinetic type + overshoot + bubble">
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <KineticWordStagger text="your crypto brain" highlightIndex={1} fontSize={104} />
        <div
          style={{
            width: 150,
            height: 116,
            borderRadius: 40,
            background:
              "linear-gradient(120deg, rgba(56, 189, 248, 0.74), rgba(34, 211, 238, 0.55), rgba(16, 185, 129, 0.48))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 54,
            boxShadow: "0 20px 48px rgba(2, 6, 23, 0.45)",
            border: "1px solid rgba(224, 242, 254, 0.35)",
          }}
        >
          🧠
        </div>
      </div>
    </TemplateFrame>
  );
};

const PortalTemplate: React.FC = () => {
  const frame = useCurrentFrame();
  const textX = interpolate(frame, [0, TEMPLATE_DURATION - 10], [0, -280], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT_CUBIC,
  });
  const textBlur = interpolate(frame, [0, TEMPLATE_DURATION - 10], [0, 7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <TemplateFrame title="00:01 Transition" subtitle="Whip pan + expanding O portal">
      <div
        style={{
          transform: `translateX(${textX}px)`,
          filter: `blur(${textBlur.toFixed(2)}px)`,
          fontSize: 84,
          fontWeight: 760,
          letterSpacing: -2,
        }}
      >
        It lives exactly <span style={{ color: "#38bdf8" }}>O</span>
      </div>

      <PortalCircleTransition from={10} durationInFrames={10} minRadius={26}>
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(130deg, rgba(15, 23, 42, 0.96), rgba(8, 47, 73, 0.9)), radial-gradient(circle at 82% 18%, rgba(34, 211, 238, 0.2), transparent 44%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 70,
            fontWeight: 720,
            color: "#e0f2fe",
            letterSpacing: -2,
          }}
        >
          where wallets already transact
        </AbsoluteFill>
      </PortalCircleTransition>
    </TemplateFrame>
  );
};

const PillTemplate: React.FC = () => {
  return (
    <TemplateFrame title="00:02 Masking" subtitle="Pill wipe + channel/icon reveal">
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <span style={{ fontSize: 60, fontWeight: 700 }}>where</span>
        <PillIconWipe
          icons={[
            <CryptoPillIcon key="usdc" label="USDC" bg="#0ea5e9" />,
            <CryptoPillIcon key="usdt" label="USDT" bg="#22c55e" />,
            <CryptoPillIcon key="eth" label="ETH" bg="#8b5cf6" />,
          ]}
        />
        <span style={{ fontSize: 50, color: "rgba(241, 245, 249, 0.9)" }}>you already are</span>
      </div>
    </TemplateFrame>
  );
};

const DotSlashTemplate: React.FC = () => {
  return (
    <TemplateFrame title="00:03 Morph" subtitle="Collapse text into mark geometry">
      <DotSlashMorph size={240} />
    </TemplateFrame>
  );
};

const ImagineGradientTemplate: React.FC = () => {
  return (
    <GradientShiftBackground fromColors={["#312e81", "#111827"]} toColors={["#6ee7b7", "#34d399"]}>
      <div
        style={{
          fontFamily: TYPOGRAPHY.display,
          fontSize: 166,
          color: "#f8fafc",
          fontWeight: 800,
          letterSpacing: -4,
          textShadow: "0 20px 40px rgba(2, 6, 23, 0.5)",
        }}
      >
        Imagine
      </div>
    </GradientShiftBackground>
  );
};

const StablecoinDropTemplate: React.FC = () => {
  return (
    <TemplateFrame title="00:05 Entrance" subtitle="Staggered copy + gravity coin drop">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <KineticWordStagger
          text="depositing stablecoins instantly"
          wordStaggerInFrames={4}
          fontSize={84}
        />
        <GravityDrop durationInFrames={10}>
          <div
            style={{
              width: 132,
              height: 132,
              borderRadius: "50%",
              background: "conic-gradient(from 20deg, #f8fafc, #bfdbfe, #7dd3fc, #f8fafc)",
              border: "3px solid rgba(224, 242, 254, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0f172a",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            USDC
          </div>
        </GravityDrop>
      </div>
    </TemplateFrame>
  );
};

const CoinZoomTemplate: React.FC = () => {
  return (
    <TemplateFrame title="00:06 Z-axis" subtitle="Spin + camera push transition">
      <CoinSpinTransition label="USDC" />
    </TemplateFrame>
  );
};

const NodeMapTemplate: React.FC = () => {
  return (
    <TemplateFrame title="00:07-08 Flow" subtitle="Trim paths + node pops + route cursor">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <NodeMapFlow />
        <div style={{ fontSize: 24, color: "rgba(125, 211, 252, 0.94)", letterSpacing: "0.06em" }}>
          WALLET → ROUTER → LIQUIDITY → SETTLEMENT
        </div>
      </div>
    </TemplateFrame>
  );
};

const ChromaPulseTemplate: React.FC = () => {
  return (
    <TemplateFrame title="00:09-10 Pulse" subtitle="Brand mark pulse + chroma cycle">
      <ChromaPulseBadge label="M" />
    </TemplateFrame>
  );
};

const GlowWriterTemplate: React.FC = () => {
  return (
    <TemplateFrame title="00:11-13 Glow" subtitle="Vector draw + optical glow">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <GlowOutlineWord word="AI SCRIPT WRITER" />
        <div style={{ fontSize: 24, color: "rgba(125, 211, 252, 0.96)", letterSpacing: "0.11em" }}>
          COMPLIANCE + EXPLANATION IN ONE PASS
        </div>
      </div>
    </TemplateFrame>
  );
};

const DashboardTemplate: React.FC = () => {
  return (
    <TemplateFrame title="00:14-17 UI" subtitle="Card masking + prioritized metrics">
      <DashboardCardReveal
        metrics={[
          { label: "Settlement Success", value: "99.8%", progress: 95 },
          { label: "Tx Finality (p95)", value: "18s", progress: 82 },
          { label: "Treasury Yield Lift", value: "+3.2%", progress: 88 },
        ]}
      />
    </TemplateFrame>
  );
};

const GlassTemplate: React.FC = () => {
  return (
    <TemplateFrame title="00:18-21 Overlay" subtitle="Glassmorphism cards + float loop">
      <div style={{ display: "flex", gap: 22 }}>
        <GlassFloatCard
          title="AR Risk Lens"
          subtitle="Flag volatility spikes in real time"
          frameOffset={0}
        />
        <GlassFloatCard
          title="Persona Copilot"
          subtitle="Explain on-chain moves to operators"
          frameOffset={14}
        />
      </div>
    </TemplateFrame>
  );
};

const FasterChecklistTemplate: React.FC = () => {
  return (
    <TemplateFrame title="00:22-25 Typography" subtitle="Velocity blur + check draw/fill">
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <MotionBlurWord word="Faster" durationInFrames={8} />
        <CheckmarkDraw from={8} />
      </div>
    </TemplateFrame>
  );
};

const SmoothScrollTemplate: React.FC = () => {
  return (
    <TemplateFrame title="00:26-29 Scroll" subtitle="Vertical flow + 2-frame card stagger">
      <SmoothScrollCards
        cards={[
          { title: "Treasury Automation", subtitle: "Route idle balances into compliant yield" },
          { title: "Stablecoin Payments", subtitle: "Programmatic payouts across global rails" },
          { title: "Liquidity Guardrails", subtitle: "Protect slippage with route-level policies" },
        ]}
      />
    </TemplateFrame>
  );
};

const OutroTemplate: React.FC = () => {
  const frame = useCurrentFrame();
  const hueCycle = interpolateColors(
    (Math.sin(frame * 0.05) + 1) / 2,
    [0, 1],
    ["rgba(34, 211, 238, 0.35)", "rgba(16, 185, 129, 0.35)"]
  );

  return (
    <TemplateFrame
      title="Toolkit"
      subtitle="Match-cut ready crypto motion system"
      background={`linear-gradient(145deg, ${LAUNCH_COLORS.deep} 0%, ${LAUNCH_COLORS.night} 100%)`}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -2 }}>
          Manifesto Motion Toolkit
        </div>
        <div style={{ marginTop: 18, fontSize: 34, color: "rgba(125, 211, 252, 0.96)" }}>
          Stablecoin + crypto transitions, polished for fast cuts
        </div>
        <div style={{ marginTop: 20, fontSize: 24, color: hueCycle, letterSpacing: "0.08em" }}>
          BUILT FOR REMOTION SERIES.SEQUENCE
        </div>
      </div>
    </TemplateFrame>
  );
};

export const ManifestoToolkitScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: TYPOGRAPHY.display }}>
      <Series>
        <Series.Sequence durationInFrames={TEMPLATE_DURATION}>
          <BrainPopTemplate />
        </Series.Sequence>
        <Series.Sequence durationInFrames={TEMPLATE_DURATION}>
          <PortalTemplate />
        </Series.Sequence>
        <Series.Sequence durationInFrames={TEMPLATE_DURATION}>
          <PillTemplate />
        </Series.Sequence>
        <Series.Sequence durationInFrames={TEMPLATE_DURATION}>
          <DotSlashTemplate />
        </Series.Sequence>
        <Series.Sequence durationInFrames={TEMPLATE_DURATION}>
          <ImagineGradientTemplate />
        </Series.Sequence>
        <Series.Sequence durationInFrames={TEMPLATE_DURATION}>
          <StablecoinDropTemplate />
        </Series.Sequence>
        <Series.Sequence durationInFrames={TEMPLATE_DURATION}>
          <CoinZoomTemplate />
        </Series.Sequence>
        <Series.Sequence durationInFrames={TEMPLATE_DURATION}>
          <NodeMapTemplate />
        </Series.Sequence>
        <Series.Sequence durationInFrames={TEMPLATE_DURATION}>
          <ChromaPulseTemplate />
        </Series.Sequence>
        <Series.Sequence durationInFrames={TEMPLATE_DURATION}>
          <GlowWriterTemplate />
        </Series.Sequence>
        <Series.Sequence durationInFrames={TEMPLATE_DURATION}>
          <DashboardTemplate />
        </Series.Sequence>
        <Series.Sequence durationInFrames={TEMPLATE_DURATION}>
          <GlassTemplate />
        </Series.Sequence>
        <Series.Sequence durationInFrames={TEMPLATE_DURATION}>
          <FasterChecklistTemplate />
        </Series.Sequence>
        <Series.Sequence durationInFrames={TEMPLATE_DURATION}>
          <SmoothScrollTemplate />
        </Series.Sequence>
        <Series.Sequence durationInFrames={TEMPLATE_DURATION}>
          <OutroTemplate />
        </Series.Sequence>
      </Series>
      <MatchCutOverlay />
    </AbsoluteFill>
  );
};
