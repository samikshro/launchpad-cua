import React, { ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  blurByVelocity,
  sineFloat,
  staggeredProgress,
  timedProgress,
} from "../../utils/motionToolkit";

interface TimedProps {
  from?: number;
  durationInFrames?: number;
}

const EASE_OUT_CUBIC = Easing.bezier(0.215, 0.61, 0.355, 1);
const EASE_OUT_QUART = Easing.bezier(0.165, 0.84, 0.44, 1);
const EASE_OUT_QUINT = Easing.bezier(0.23, 1, 0.32, 1);
const EASE_OUT_EXPO = Easing.bezier(0.19, 1, 0.22, 1);
const EASE_IN_OUT_CUBIC = Easing.bezier(0.645, 0.045, 0.355, 1);
const EASE_IN_OUT_QUART = Easing.bezier(0.77, 0, 0.175, 1);

const loopProgress = (frame: number, duration: number): number => {
  const safeDuration = Math.max(1, duration);
  const wrapped = ((frame % safeDuration) + safeDuration) % safeDuration;
  return wrapped / Math.max(1, safeDuration - 1);
};

interface KineticWordStaggerProps extends TimedProps {
  text: string;
  wordStaggerInFrames?: number;
  fontSize?: number;
  color?: string;
  highlightColor?: string;
  highlightIndex?: number;
  style?: React.CSSProperties;
}

export const KineticWordStagger: React.FC<KineticWordStaggerProps> = ({
  text,
  from = 0,
  durationInFrames = 9,
  wordStaggerInFrames = 3,
  fontSize = 120,
  color = "#f8fafc",
  highlightColor = "#22d3ee",
  highlightIndex,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.trim().split(/\s+/g);

  return (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", ...style }}>
      {words.map((word, index) => {
        const delay = from + index * wordStaggerInFrames;
        const entrance = spring({
          frame: frame - delay,
          fps,
          config: { stiffness: 210, damping: 24, mass: 0.9 },
        });
        const driftProgress = timedProgress({
          frame,
          from: delay,
          durationInFrames,
          easing: EASE_OUT_CUBIC,
        });
        const opacity = interpolate(driftProgress, [0, 0.12, 1], [0, 1, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const y = interpolate(entrance, [0, 1], [30, 0]);
        const scale = interpolate(entrance, [0, 0.65, 1], [0.82, 1.1, 1]);
        const rotate = interpolate(entrance, [0, 1], [-6, 0]);
        const blur = blurByVelocity({
          frame: frame - index * 0.5,
          from: delay,
          durationInFrames: Math.max(10, durationInFrames * 0.5),
          distance: 120,
          maxBlur: 12,
        });
        const highlightPulse =
          highlightIndex === index ? 1 + Math.sin((frame - delay) * 0.24) * 0.04 : 1;

        return (
          <span
            key={`${word}-${index}`}
            style={{
              fontSize,
              lineHeight: 0.9,
              fontWeight: 800,
              letterSpacing: -2,
              display: "inline-block",
              opacity,
              transform: `translateY(${y}px) rotate(${rotate}deg) scale(${scale * highlightPulse})`,
              color: highlightIndex === index ? highlightColor : color,
              textShadow:
                highlightIndex === index
                  ? "0 0 34px rgba(34, 211, 238, 0.45)"
                  : "0 12px 34px rgba(15, 23, 42, 0.35)",
              filter: `blur(${blur.toFixed(2)}px)`,
              whiteSpace: "pre",
              willChange: "transform, opacity, filter",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

interface PortalCircleTransitionProps extends TimedProps {
  children: ReactNode;
  centerXPercent?: number;
  centerYPercent?: number;
  minRadius?: number;
  showRing?: boolean;
}

export const PortalCircleTransition: React.FC<PortalCircleTransitionProps> = ({
  children,
  from = 0,
  durationInFrames = 10,
  centerXPercent = 50,
  centerYPercent = 50,
  minRadius = 20,
  showRing = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const progress = timedProgress({
    frame,
    from,
    durationInFrames,
    easing: EASE_OUT_QUINT,
  });
  const maxRadius = Math.hypot(width, height);
  const radius = interpolate(progress, [0, 1], [minRadius, maxRadius]);
  const ringOpacity = interpolate(progress, [0, 0.35, 1], [1, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringThickness = interpolate(progress, [0, 1], [8, 1.4]);
  const coreGlow = interpolate(progress, [0, 0.22, 1], [0.85, 0.4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contentScale = interpolate(progress, [0, 1], [1.03, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `circle(${radius}px at ${centerXPercent}% ${centerYPercent}%)`,
          transform: `scale(${contentScale})`,
          willChange: "clip-path, transform",
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          left: `${centerXPercent}%`,
          top: `${centerYPercent}%`,
          width: 56,
          height: 56,
          marginLeft: -28,
          marginTop: -28,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 30%, rgba(224, 242, 254, 0.95), rgba(34, 211, 238, 0.18))",
          filter: "blur(1px)",
          opacity: coreGlow,
        }}
      />
      {showRing ? (
        <>
          <div
            style={{
              position: "absolute",
              left: `${centerXPercent}%`,
              top: `${centerYPercent}%`,
              width: radius * 2,
              height: radius * 2,
              marginLeft: -radius,
              marginTop: -radius,
              borderRadius: "50%",
              border: `${ringThickness}px solid rgba(34, 211, 238, 0.9)`,
              boxShadow: "0 0 60px rgba(34, 211, 238, 0.45)",
              opacity: ringOpacity,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${centerXPercent}%`,
              top: `${centerYPercent}%`,
              width: radius * 2,
              height: radius * 2,
              marginLeft: -radius,
              marginTop: -radius,
              borderRadius: "50%",
              border: "1px solid rgba(125, 211, 252, 0.7)",
              opacity: ringOpacity * 0.7,
              transform: "scale(1.05)",
            }}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

interface PillIconWipeProps extends TimedProps {
  icons: ReactNode[];
  label?: string;
  widthRange?: [number, number];
  height?: number;
}

export const PillIconWipe: React.FC<PillIconWipeProps> = ({
  icons,
  from = 0,
  durationInFrames = 9,
  label,
  widthRange = [110, 340],
  height = 90,
}) => {
  const frame = useCurrentFrame();
  const progress = timedProgress({
    frame,
    from,
    durationInFrames,
    easing: EASE_OUT_EXPO,
  });
  const width = interpolate(progress, [0, 1], widthRange);
  const containerX = interpolate(progress, [0, 1], [26, 0]);
  const wipe = interpolate(progress, [0, 1], [100, 0]);
  const shimmerX = interpolate(progress, [0, 1], [-120, width + 140]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      {label ? (
        <span style={{ color: "#dbeafe", fontSize: 48, fontWeight: 600, letterSpacing: -1 }}>
          {label}
        </span>
      ) : null}
      <div
        style={{
          width,
          height,
          borderRadius: 999,
          overflow: "hidden",
          background:
            "linear-gradient(100deg, rgba(8, 47, 73, 0.74), rgba(14, 116, 144, 0.55), rgba(34, 211, 238, 0.34))",
          border: "1px solid rgba(125, 211, 252, 0.6)",
          boxShadow: "0 18px 45px rgba(2, 6, 23, 0.45)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 80,
            left: shimmerX,
            background:
              "linear-gradient(90deg, transparent, rgba(224, 242, 254, 0.38), transparent)",
            transform: "skewX(-25deg)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            gap: 16,
            transform: `translateX(${containerX}px)`,
            clipPath: `inset(0 ${wipe}% 0 0 round 999px)`,
            willChange: "transform, clip-path",
          }}
        >
          {icons.map((icon, index) => {
            const iconProgress = timedProgress({
              frame,
              from: from + 6 + index * 2,
              durationInFrames: 8,
              easing: EASE_OUT_CUBIC,
            });
            const iconScale = interpolate(iconProgress, [0, 1], [0.9, 1]);
            const iconY = interpolate(iconProgress, [0, 1], [8, 0]);
            const iconOpacity = interpolate(iconProgress, [0, 0.3, 1], [0, 1, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={`pill-icon-${index}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `translateY(${iconY}px) scale(${iconScale})`,
                  opacity: iconOpacity,
                  willChange: "transform, opacity",
                }}
              >
                {icon}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface DotSlashMorphProps extends TimedProps {
  dotColor?: string;
  slashColor?: string;
  size?: number;
}

export const DotSlashMorph: React.FC<DotSlashMorphProps> = ({
  from = 0,
  durationInFrames = 10,
  dotColor = "#f8fafc",
  slashColor = "#22d3ee",
  size = 150,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = timedProgress({
    frame,
    from,
    durationInFrames,
    easing: EASE_IN_OUT_QUART,
  });
  const slashSpring = spring({
    frame: frame - from - 5,
    fps,
    config: { stiffness: 190, damping: 26, mass: 0.9 },
  });
  const ringScale = interpolate(progress, [0, 0.35, 1], [1.5, 0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringOpacity = interpolate(progress, [0, 0.5, 1], [0.4, 0.2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dotScale = interpolate(progress, [0, 0.2, 1], [0.12, 1.15, 1]);
  const slashX = interpolate(slashSpring, [0, 1], [size * 0.8, 0]);
  const slashOpacity = interpolate(progress, [0.25, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: size * 0.86,
          height: size * 0.86,
          borderRadius: "50%",
          border: "2px solid rgba(148, 163, 184, 0.55)",
          transform: `scale(${ringScale})`,
          opacity: ringOpacity,
          willChange: "transform, opacity",
        }}
      />
      <div
        style={{
          width: size * 0.17,
          height: size * 0.17,
          borderRadius: "50%",
          backgroundColor: dotColor,
          transform: `scale(${dotScale})`,
          boxShadow: "0 0 38px rgba(248, 250, 252, 0.45)",
          willChange: "transform",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: size * 0.74,
          height: size * 0.09,
          borderRadius: 10,
          backgroundColor: slashColor,
          transform: `translateX(${slashX}px) rotate(-35deg)`,
          opacity: slashOpacity,
          boxShadow: "0 0 35px rgba(34, 211, 238, 0.55)",
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
};

interface GradientShiftBackgroundProps extends TimedProps {
  fromColors?: [string, string];
  toColors?: [string, string];
  children?: ReactNode;
}

export const GradientShiftBackground: React.FC<GradientShiftBackgroundProps> = ({
  from = 0,
  durationInFrames = 9,
  fromColors = ["#2e1065", "#111827"],
  toColors = ["#86efac", "#4ade80"],
  children,
}) => {
  const frame = useCurrentFrame();
  const progress = timedProgress({
    frame,
    from,
    durationInFrames,
    easing: EASE_OUT_QUART,
  });
  const first = interpolateColors(progress, [0, 1], fromColors);
  const second = interpolateColors(progress, [0, 1], toColors);
  const hueShift = Math.sin((frame - from) * 0.05) * 8;
  const orbX = 20 + Math.sin((frame - from) * 0.03) * 8;
  const orbY = 16 + Math.cos((frame - from) * 0.04) * 6;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${orbX}% ${orbY}%, ${first} 0%, ${second} 52%, #04131f 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: `hue-rotate(${hueShift}deg)`,
        willChange: "filter",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(0deg, rgba(2, 6, 23, 0.2), rgba(2, 6, 23, 0.05)), repeating-linear-gradient(90deg, rgba(248, 250, 252, 0.02), rgba(248, 250, 252, 0.02) 2px, transparent 2px, transparent 14px)",
          mixBlendMode: "soft-light",
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

interface GravityDropProps extends TimedProps {
  children: ReactNode;
  dropHeight?: number;
}

export const GravityDrop: React.FC<GravityDropProps> = ({
  children,
  from = 0,
  durationInFrames = 12,
  dropHeight = 280,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - from,
    fps,
    config: { damping: 24, stiffness: 150, mass: 0.95 },
    durationInFrames,
  });
  const y = interpolate(progress, [0, 0.82, 1], [-dropHeight, 28, 0]);
  const squish = interpolate(progress, [0.78, 1], [1.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shadowScale = interpolate(progress, [0, 0.85, 1], [0.44, 1.05, 0.98]);
  const shadowOpacity = interpolate(progress, [0, 0.8, 1], [0.1, 0.32, 0.28]);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: -20,
          width: 130,
          height: 26,
          borderRadius: "50%",
          background: "rgba(2, 6, 23, 0.58)",
          filter: "blur(8px)",
          transform: `scale(${shadowScale})`,
          opacity: shadowOpacity,
          willChange: "transform, opacity, filter",
        }}
      />
      <div
        style={{
          transform: `translateY(${y}px) scaleX(${squish})`,
          transformOrigin: "50% 100%",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
};

interface CoinSpinTransitionProps extends TimedProps {
  label?: string;
  startScale?: number;
  endScale?: number;
}

export const CoinSpinTransition: React.FC<CoinSpinTransitionProps> = ({
  from = 0,
  durationInFrames = 12,
  label = "USDC",
  startScale = 0.82,
  endScale = 3.6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - from,
    fps,
    config: { stiffness: 165, damping: 24, mass: 0.92 },
    durationInFrames,
  });
  const rotateY = interpolate(progress, [0, 1], [0, 520]);
  const rotateX = interpolate(progress, [0, 1], [0, 24]);
  const scale = interpolate(progress, [0, 1], [startScale, endScale]);
  const opacity = interpolate(progress, [0, 0.88, 1], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowScale = interpolate(progress, [0, 1], [0.8, 1.4]);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.46), rgba(56, 189, 248, 0))",
          transform: `scale(${glowScale})`,
          opacity: opacity * 0.8,
          filter: "blur(4px)",
          willChange: "transform, opacity, filter",
        }}
      />
      <div
        style={{
          width: 188,
          height: 188,
          borderRadius: "50%",
          background:
            "conic-gradient(from 15deg, #f8fafc 0%, #dbeafe 22%, #93c5fd 44%, #e2e8f0 70%, #f8fafc 100%)",
          border: "5px solid rgba(15, 23, 42, 0.22)",
          boxShadow: "0 30px 64px rgba(2, 6, 23, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 34,
          fontWeight: 800,
          color: "#0f172a",
          letterSpacing: 1,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
          opacity,
          position: "relative",
          willChange: "transform, opacity",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 18,
            borderRadius: "50%",
            border: "2px solid rgba(15, 23, 42, 0.24)",
            boxShadow: "inset 0 0 0 2px rgba(248, 250, 252, 0.25)",
          }}
        />
        {label}
      </div>
    </div>
  );
};

const cubicBezierPoint = (
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number]
): { x: number; y: number } => {
  const oneMinusT = 1 - t;
  const x =
    oneMinusT ** 3 * p0[0] +
    3 * oneMinusT ** 2 * t * p1[0] +
    3 * oneMinusT * t ** 2 * p2[0] +
    t ** 3 * p3[0];
  const y =
    oneMinusT ** 3 * p0[1] +
    3 * oneMinusT ** 2 * t * p1[1] +
    3 * oneMinusT * t ** 2 * p2[1] +
    t ** 3 * p3[1];
  return { x, y };
};

interface NodeMapFlowProps extends TimedProps {
  width?: number;
  height?: number;
}

export const NodeMapFlow: React.FC<NodeMapFlowProps> = ({
  from = 0,
  durationInFrames = 24,
  width = 900,
  height = 380,
}) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - from);
  const looped = loopProgress(localFrame, durationInFrames);
  const pathAProgress = timedProgress({
    frame: localFrame % durationInFrames,
    from: 0,
    durationInFrames: Math.floor(durationInFrames * 0.5),
    easing: EASE_IN_OUT_CUBIC,
  });
  const pathBProgress = timedProgress({
    frame: localFrame % durationInFrames,
    from: 8,
    durationInFrames: Math.floor(durationInFrames * 0.55),
    easing: EASE_OUT_CUBIC,
  });
  const cursorProgress = timedProgress({
    frame: localFrame % durationInFrames,
    from: 12,
    durationInFrames: Math.floor(durationInFrames * 0.72),
    easing: EASE_IN_OUT_CUBIC,
  });
  const cursor = cubicBezierPoint(cursorProgress, [100, 250], [300, 70], [575, 300], [790, 130]);
  const clickRipple = timedProgress({
    frame: localFrame % durationInFrames,
    from: 14,
    durationInFrames: 8,
    easing: EASE_OUT_CUBIC,
  });

  const nodeEntries = [
    [100, 250],
    [270, 120],
    [470, 270],
    [790, 130],
  ] as const;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 28,
        border: "1px solid rgba(125, 211, 252, 0.34)",
        background:
          "linear-gradient(160deg, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.84)), radial-gradient(circle at 82% 20%, rgba(56, 189, 248, 0.18), transparent 45%)",
        boxShadow: "0 24px 70px rgba(2, 6, 23, 0.5)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          opacity: 0.2,
        }}
      />
      <svg width={width} height={height} style={{ position: "relative", zIndex: 1 }}>
        <path
          d="M100 250 C300 70 575 300 790 130"
          fill="none"
          stroke="rgba(34, 211, 238, 0.96)"
          strokeWidth={5}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - pathAProgress}
        />
        <path
          d="M100 250 C260 280 470 90 790 130"
          fill="none"
          stroke="rgba(125, 211, 252, 0.72)"
          strokeWidth={3}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - pathBProgress}
        />
        {nodeEntries.map(([x, y], index) => {
          const nodeProgress = staggeredProgress({
            frame: localFrame % durationInFrames,
            from: 6,
            durationInFrames: 8,
            staggerInFrames: 2,
            index,
            easing: EASE_OUT_CUBIC,
          });
          const nodeScale = interpolate(nodeProgress, [0, 1], [0, 1]);
          const pulse = 1 + Math.sin((looped * Math.PI * 2 + index) * 1.25) * 0.08;
          return (
            <g
              key={`node-${x}-${y}`}
              transform={`translate(${x} ${y}) scale(${nodeScale * pulse})`}
            >
              <circle r={19} fill="rgba(34, 211, 238, 0.15)" />
              <circle r={13} fill="#22d3ee" />
              <circle r={5} fill="#0f172a" />
            </g>
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          left: cursor.x - 11,
          top: cursor.y - 11,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#f8fafc",
          boxShadow: "0 0 24px rgba(248, 250, 252, 0.85)",
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: cursor.x - 22,
          top: cursor.y - 22,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "2px solid rgba(248, 250, 252, 0.72)",
          transform: `scale(${interpolate(clickRipple, [0, 1], [0.2, 1.5])})`,
          opacity: interpolate(clickRipple, [0, 1], [0.95, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          zIndex: 2,
        }}
      />
    </div>
  );
};

interface ChromaPulseBadgeProps extends TimedProps {
  label?: string;
  colors?: string[];
}

export const ChromaPulseBadge: React.FC<ChromaPulseBadgeProps> = ({
  from = 0,
  durationInFrames = 24,
  label = "M",
  colors = ["#fde047", "#fb923c", "#fb7185", "#f472b6", "#a78bfa"],
}) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - from);
  const progress = loopProgress(localFrame, durationInFrames);
  const pulse = 1 + Math.sin(localFrame * 0.18) * 0.06;
  const haloPulse = 1 + Math.sin(localFrame * 0.12 + 0.6) * 0.12;
  const colorStops = colors.map((_, index) => index / Math.max(1, colors.length - 1));
  const background = interpolateColors(progress, colorStops, colors);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249, 115, 22, 0.42), rgba(249, 115, 22, 0))",
          transform: `scale(${haloPulse})`,
          filter: "blur(4px)",
          willChange: "transform, filter",
        }}
      />
      <div
        style={{
          width: 230,
          height: 230,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background,
          boxShadow: "0 0 76px rgba(249, 115, 22, 0.55)",
          transform: `scale(${pulse})`,
          border: "1px solid rgba(255, 255, 255, 0.35)",
          willChange: "transform",
        }}
      >
        <span style={{ fontSize: 122, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
          {label}
        </span>
      </div>
    </div>
  );
};

interface GlowOutlineWordProps extends TimedProps {
  word: string;
  color?: string;
  fontSize?: number;
}

export const GlowOutlineWord: React.FC<GlowOutlineWordProps> = ({
  word,
  from = 0,
  durationInFrames = 10,
  color = "#67e8f9",
  fontSize = 118,
}) => {
  const frame = useCurrentFrame();
  const progress = timedProgress({
    frame,
    from,
    durationInFrames,
    easing: EASE_IN_OUT_CUBIC,
  });
  const flicker = 0.9 + Math.sin((frame - from) * 0.45) * 0.1;
  const drawOffset = 1 - progress;

  return (
    <svg width={980} height={230} viewBox="0 0 980 230">
      <defs>
        <linearGradient id="manifesto-glow-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
      </defs>
      <text
        x={490}
        y={155}
        textAnchor="middle"
        fill="transparent"
        stroke="url(#manifesto-glow-gradient)"
        strokeWidth={3}
        strokeDasharray={1}
        strokeDashoffset={drawOffset}
        pathLength={1}
        style={{
          fontSize,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          filter: `drop-shadow(0 0 16px rgba(103, 232, 249, ${0.85 * flicker}))`,
        }}
      >
        {word}
      </text>
      <text
        x={490}
        y={155}
        textAnchor="middle"
        fill={`rgba(224, 242, 254, ${0.14 * flicker})`}
        style={{
          fontSize,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          mixBlendMode: "screen",
        }}
      >
        {word}
      </text>
    </svg>
  );
};

interface DashboardMetric {
  label: string;
  value: string;
  progress: number;
}

interface DashboardCardRevealProps extends TimedProps {
  metrics: DashboardMetric[];
}

export const DashboardCardReveal: React.FC<DashboardCardRevealProps> = ({
  metrics,
  from = 0,
  durationInFrames = 14,
}) => {
  const frame = useCurrentFrame();
  const reveal = timedProgress({
    frame,
    from,
    durationInFrames: Math.max(8, durationInFrames * 0.5),
    easing: EASE_OUT_CUBIC,
  });
  const maxMetricIndex = metrics.reduce((best, metric, index) => {
    return metric.progress > metrics[best].progress ? index : best;
  }, 0);

  return (
    <div
      style={{
        width: 980,
        borderRadius: 26,
        overflow: "hidden",
        border: "1px solid rgba(148, 163, 184, 0.35)",
        background:
          "linear-gradient(160deg, rgba(17, 24, 39, 0.96), rgba(15, 23, 42, 0.78)), radial-gradient(circle at 20% 0%, rgba(34, 211, 238, 0.15), transparent 40%)",
        boxShadow: "0 28px 80px rgba(2, 6, 23, 0.5)",
        clipPath: `inset(${interpolate(reveal, [0, 1], [100, 0])}% 0 0 0 round 26px)`,
        willChange: "clip-path",
      }}
    >
      <div style={{ padding: "34px 38px" }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: "#e2e8f0", marginBottom: 26 }}>
          Stablecoin Ops Dashboard
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 22 }}>
          {metrics.map((metric, index) => {
            const cardProgress = timedProgress({
              frame,
              from: from + 8 + index * 3,
              durationInFrames: 8,
              easing: EASE_OUT_CUBIC,
            });
            const barProgress = timedProgress({
              frame,
              from: from + 12 + index * 4,
              durationInFrames,
              easing: EASE_OUT_QUART,
            });
            const fill = interpolate(barProgress, [0, 1], [0, metric.progress], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const isPrimary = index === maxMetricIndex;
            const y = interpolate(cardProgress, [0, 1], [28, 0]);
            const scale = interpolate(cardProgress, [0, 1], [0.94, isPrimary ? 1.03 : 1]);
            const valueSize = isPrimary ? 40 : 34;
            return (
              <div
                key={metric.label}
                style={{
                  borderRadius: 18,
                  padding: 18,
                  background: isPrimary ? "rgba(15, 23, 42, 0.88)" : "rgba(15, 23, 42, 0.76)",
                  border: isPrimary
                    ? "1px solid rgba(34, 211, 238, 0.4)"
                    : "1px solid rgba(125, 211, 252, 0.2)",
                  transform: `translateY(${y}px) scale(${scale})`,
                  boxShadow: isPrimary ? "0 0 26px rgba(34, 211, 238, 0.25)" : undefined,
                  willChange: "transform",
                }}
              >
                <div style={{ fontSize: 18, color: "#bae6fd", marginBottom: 10 }}>
                  {metric.label}
                </div>
                <div
                  style={{
                    fontSize: valueSize,
                    color: "#f8fafc",
                    fontWeight: 700,
                    marginBottom: 14,
                  }}
                >
                  {metric.value}
                </div>
                <div
                  style={{
                    height: 10,
                    borderRadius: 999,
                    background: "rgba(51, 65, 85, 0.9)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${fill}%`,
                      height: "100%",
                      background: isPrimary
                        ? "linear-gradient(90deg, #22d3ee, #67e8f9)"
                        : "linear-gradient(90deg, #38bdf8, #22d3ee)",
                      boxShadow: "0 0 16px rgba(34, 211, 238, 0.55)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface GlassFloatCardProps {
  title: string;
  subtitle?: string;
  frameOffset?: number;
  width?: number;
  height?: number;
}

export const GlassFloatCard: React.FC<GlassFloatCardProps> = ({
  title,
  subtitle,
  frameOffset = 0,
  width = 360,
  height = 160,
}) => {
  const frame = useCurrentFrame();
  const y = sineFloat(frame + frameOffset, 10, 0.08, frameOffset * 0.04);
  const x = Math.sin((frame + frameOffset) * 0.05) * 5;
  const shimmer = loopProgress(frame + frameOffset * 2, 70);

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 24,
        border: "1px solid rgba(255, 255, 255, 0.32)",
        background: "linear-gradient(140deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.12))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: 22,
        transform: `translate(${x}px, ${y}px)`,
        boxShadow: "0 20px 40px rgba(15, 23, 42, 0.35)",
        position: "relative",
        overflow: "hidden",
        willChange: "transform",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -20,
          left: interpolate(shimmer, [0, 1], [-160, width + 140]),
          width: 120,
          height: height + 40,
          background: "linear-gradient(90deg, transparent, rgba(248, 250, 252, 0.28), transparent)",
          transform: "skewX(-18deg)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{ fontSize: 30, fontWeight: 700, color: "#f8fafc", position: "relative", zIndex: 1 }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            fontSize: 20,
            marginTop: 10,
            color: "rgba(241, 245, 249, 0.9)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
};

interface MotionBlurWordProps extends TimedProps {
  word: string;
  fromX?: number;
  toX?: number;
  fontSize?: number;
}

export const MotionBlurWord: React.FC<MotionBlurWordProps> = ({
  word,
  from = 0,
  durationInFrames = 8,
  fromX = 240,
  toX = 0,
  fontSize = 170,
}) => {
  const frame = useCurrentFrame();
  const progress = timedProgress({
    frame,
    from,
    durationInFrames,
    easing: EASE_OUT_QUINT,
  });
  const x = interpolate(progress, [0, 1], [fromX, toX]);
  const skew = interpolate(progress, [0, 1], [-12, 0]);
  const opacity = interpolate(progress, [0, 0.2, 1], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blur = blurByVelocity({
    frame,
    from,
    durationInFrames,
    distance: Math.abs(fromX - toX),
    maxBlur: 18,
  });
  const chroma = Math.max(0, blur - 2);

  return (
    <span
      style={{
        fontSize,
        fontWeight: 800,
        letterSpacing: -4,
        color: "#e2e8f0",
        opacity,
        display: "inline-block",
        transform: `translateX(${x}px) skewX(${skew}deg)`,
        filter: `blur(${blur.toFixed(2)}px)`,
        textShadow: `${chroma * 0.35}px 0 0 rgba(34, 211, 238, 0.45), ${-chroma * 0.35}px 0 0 rgba(251, 113, 133, 0.35)`,
        willChange: "transform, opacity, filter",
      }}
    >
      {word}
    </span>
  );
};

interface CheckmarkDrawProps extends TimedProps {
  size?: number;
}

export const CheckmarkDraw: React.FC<CheckmarkDrawProps> = ({
  from = 0,
  durationInFrames = 8,
  size = 94,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = timedProgress({
    frame,
    from,
    durationInFrames,
    easing: EASE_OUT_QUART,
  });
  const pop = spring({
    frame: frame - from - 2,
    fps,
    config: { stiffness: 260, damping: 26, mass: 0.85 },
    durationInFrames: 8,
  });
  const fillOpacity = interpolate(progress, [0.12, 0.58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        transform: `scale(${interpolate(pop, [0, 1], [0.82, 1])})`,
        willChange: "transform",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 96 96">
        <rect
          x={6}
          y={6}
          width={84}
          height={84}
          rx={22}
          fill={`rgba(16, 185, 129, ${fillOpacity})`}
          stroke="rgba(52, 211, 153, 0.95)"
          strokeWidth={4}
        />
        <path
          d="M26 50 L42 66 L70 34"
          fill="none"
          stroke="#ecfdf5"
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - progress}
        />
      </svg>
    </div>
  );
};

interface SmoothScrollCardsProps extends TimedProps {
  cards: Array<{ title: string; subtitle: string }>;
  rowGap?: number;
}

export const SmoothScrollCards: React.FC<SmoothScrollCardsProps> = ({
  cards,
  from = 0,
  durationInFrames = 10,
  rowGap = 16,
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 840, display: "flex", flexDirection: "column", gap: rowGap }}>
      {cards.map((card, index) => {
        const progress = timedProgress({
          frame,
          from: from + index * 2,
          durationInFrames,
          easing: EASE_OUT_CUBIC,
        });
        const y = interpolate(progress, [0, 1], [80, 0]);
        const x = interpolate(progress, [0, 1], [14 - index * 6, 0]);
        const rotation = interpolate(progress, [0, 1], [index % 2 === 0 ? 1.8 : -1.8, 0]);
        const opacity = interpolate(progress, [0, 0.35, 1], [0, 1, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={card.title}
            style={{
              transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
              opacity,
              borderRadius: 20,
              padding: "24px 30px",
              background:
                "linear-gradient(120deg, rgba(14, 116, 144, 0.28), rgba(15, 23, 42, 0.82), rgba(56, 189, 248, 0.16))",
              border: "1px solid rgba(56, 189, 248, 0.34)",
              boxShadow: "0 20px 42px rgba(2, 6, 23, 0.42)",
              willChange: "transform, opacity",
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 700, color: "#f8fafc" }}>{card.title}</div>
            <div style={{ marginTop: 8, fontSize: 20, color: "rgba(186, 230, 253, 0.9)" }}>
              {card.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
};
