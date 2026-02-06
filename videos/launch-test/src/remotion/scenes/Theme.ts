import { loadFont, fontFamily } from "@remotion/google-fonts/Urbanist";
import { loadFont as loadMono, fontFamily as monoFamily } from "@remotion/google-fonts/JetBrainsMono";

loadFont("normal", { subsets: ["latin"], weights: ["400", "500", "600", "700", "800"] });
loadMono("normal", { subsets: ["latin"], weights: ["400", "500", "700"] });

export const TYPOGRAPHY = {
  display: fontFamily,
  body: fontFamily,
  mono: monoFamily,
};

export const LAUNCH_COLORS = {
  night: "#020617",
  deep: "#0f172a",
  panel: "#111b2f",
  panelSoft: "#16223b",
  text: "#f8fafc",
  muted: "#cbd5e1",
  cyan: "#22d3ee",
  blue: "#38bdf8",
  lime: "#84cc16",
  amber: "#fb923c",
  rose: "#fb7185",
};

export const PANEL_SHADOW = "0 32px 90px rgba(2, 6, 23, 0.55)";
