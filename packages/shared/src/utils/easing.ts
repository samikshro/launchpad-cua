import { Easing } from "remotion";

/**
 * Common easing functions for animations
 */
export const easings = {
  // Smooth ease out (most common)
  smooth: Easing.out(Easing.cubic),

  // Bouncy spring-like
  bounce: Easing.out(Easing.back(1.5)),

  // Linear (no easing)
  linear: Easing.linear,

  // Ease in-out (slow start and end)
  inOut: Easing.inOut(Easing.cubic),

  // Sharp ease out
  sharp: Easing.out(Easing.quad),

  // Elastic bounce
  elastic: Easing.out(Easing.elastic(1)),
} as const;
