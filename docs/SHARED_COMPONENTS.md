# Shared Components

The `@launchpad/shared` package provides reusable animations and utilities.

## Animations

### FadeIn

Fades in content with optional directional movement.

```tsx
import { FadeIn } from "@launchpad/shared/components/animations";

<FadeIn
  durationInFrames={30}  // Animation duration (default: 20)
  delay={0}              // Delay before starting (default: 0)
  direction="up"         // "up" | "down" | "left" | "right" | "none"
  distance={30}          // Movement distance in pixels (default: 30)
>
  <h1>Hello</h1>
</FadeIn>
```

### SlideUp

Slides content up while fading in.

```tsx
import { SlideUp } from "@launchpad/shared/components/animations";

<SlideUp
  durationInFrames={20}
  delay={15}
  distance={50}
>
  <p>Sliding up!</p>
</SlideUp>
```

### TextReveal

Reveals text with a clip-path animation.

```tsx
import { TextReveal } from "@launchpad/shared/components/animations";

<TextReveal
  durationInFrames={30}
  delay={0}
  direction="left"  // "left" | "right"
>
  <h1>Revealed!</h1>
</TextReveal>
```

## Hooks

### useAnimatedValue

Interpolates a value over time.

```tsx
import { useAnimatedValue } from "@launchpad/shared/hooks";

const scale = useAnimatedValue({
  from: 0,
  to: 1,
  durationInFrames: 30,
  delay: 10,
});

return <div style={{ transform: `scale(${scale})` }}>Growing</div>;
```

### useFadeIn

Returns opacity style for fade-in effect.

```tsx
import { useFadeIn } from "@launchpad/shared/hooks";

const { opacity } = useFadeIn({ durationInFrames: 20, delay: 5 });

return <div style={{ opacity }}>Fading in</div>;
```

## Utilities

### Timing

```tsx
import { framesToSeconds, secondsToFrames, formatDuration } from "@launchpad/shared/utils";

// Convert 90 frames to seconds at 30fps
framesToSeconds(90, 30); // 3

// Convert 2 seconds to frames at 30fps
secondsToFrames(2, 30); // 60

// Format as MM:SS
formatDuration(150, 30); // "0:05"
```

### Easings

```tsx
import { easings } from "@launchpad/shared/utils";

// Use in interpolate()
interpolate(frame, [0, 30], [0, 1], { easing: easings.smooth });

// Available easings:
easings.smooth   // Ease out cubic (most common)
easings.bounce   // Bouncy spring-like
easings.linear   // No easing
easings.inOut    // Slow start and end
easings.sharp    // Sharp ease out
easings.elastic  // Elastic bounce
```

## Types

### Video Presets

```tsx
import { VIDEO_PRESETS, FPS } from "@launchpad/shared/types";

VIDEO_PRESETS["1080p"];   // { width: 1920, height: 1080 }
VIDEO_PRESETS["720p"];    // { width: 1280, height: 720 }
VIDEO_PRESETS["4k"];      // { width: 3840, height: 2160 }
VIDEO_PRESETS["square"];  // { width: 1080, height: 1080 }
VIDEO_PRESETS["vertical"]; // { width: 1080, height: 1920 }

FPS.STANDARD;   // 30
FPS.CINEMATIC;  // 24
FPS.SMOOTH;     // 60
```

## Brand Assets

### Colors

```tsx
import { COLORS } from "@launchpad/assets/brand";

COLORS.primary           // "#0070f3"
COLORS.background.cream  // "#FDF8F3"
COLORS.background.dark   // "#000000"
COLORS.text.primary      // "#1a1a1a"
COLORS.accent.success    // "#10b981"
```

### Fonts

```tsx
import { loadFonts, FONTS } from "@launchpad/assets/brand";

// In your scene
const { fontFamily } = loadFonts();

<h1 style={{ fontFamily: fontFamily.heading }}>Title</h1>
<p style={{ fontFamily: fontFamily.body }}>Body text</p>
<code style={{ fontFamily: fontFamily.mono }}>Code</code>

// Font names
FONTS.heading  // "Urbanist"
FONTS.body     // "Inter"
FONTS.mono     // "JetBrains Mono"
```
