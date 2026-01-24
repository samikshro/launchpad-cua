/**
 * Font configurations for videos
 *
 * Usage:
 * import { loadFonts, FONTS } from "@launchpad/assets/brand";
 * const { fontFamily } = loadFonts();
 */

// Font family names (for use in styles)
export const FONTS = {
  heading: "Urbanist",
  body: "Inter",
  mono: "JetBrains Mono",
} as const;

/**
 * Load fonts from @remotion/google-fonts
 * Call this in your Root.tsx or composition entry point
 *
 * Example:
 * const { urbanist, inter, jetbrainsMono } = loadFonts();
 */
export const loadFonts = () => {
  // These are loaded dynamically by @remotion/google-fonts
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { loadFont: loadUrbanist } = require("@remotion/google-fonts/Urbanist");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { loadFont: loadInter } = require("@remotion/google-fonts/Inter");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { loadFont: loadJetBrainsMono } = require("@remotion/google-fonts/JetBrainsMono");

  const urbanist = loadUrbanist();
  const inter = loadInter();
  const jetbrainsMono = loadJetBrainsMono();

  return {
    urbanist,
    inter,
    jetbrainsMono,
    fontFamily: {
      heading: urbanist.fontFamily,
      body: inter.fontFamily,
      mono: jetbrainsMono.fontFamily,
    },
  };
};
