/**
 * Brand color palette - consistent across all videos
 */
export const COLORS = {
  // Primary colors
  primary: "#0070f3",
  primaryDark: "#0051a8",
  primaryLight: "#3291ff",

  // Backgrounds
  background: {
    light: "#ffffff",
    dark: "#000000",
    cream: "#FDF8F3",
    slate: "#f8fafc",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },

  // Text colors
  text: {
    primary: "#1a1a1a",
    secondary: "#666666",
    muted: "#8d8d8d",
    inverse: "#ffffff",
  },

  // Accent colors
  accent: {
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  },
} as const;
