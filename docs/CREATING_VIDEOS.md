# Creating Videos

This guide explains how to create and structure videos in Launchpad.

## Creating a New Video Project

```bash
pnpm create-video
```

This interactive CLI will:
1. Ask for a video name (kebab-case, e.g., `product-launch`)
2. Ask for a display name (e.g., "Product Launch")
3. Let you choose video dimensions (1080p, 720p, 4K, square, vertical)
4. Scaffold all necessary files

## Video Project Structure

```
videos/your-video/
├── package.json
├── tsconfig.json
├── remotion.config.ts
├── next.config.js
├── public/                 # Video-specific assets
│   ├── music.wav
│   └── images/
├── src/
│   ├── app/               # Next.js web player
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── remotion/
│   │   ├── Root.tsx       # Composition registry
│   │   ├── index.ts       # Entry point
│   │   └── scenes/        # Your video scenes
│   │       ├── IntroScene.tsx
│   │       └── FullVideo.tsx
│   └── styles/
│       └── global.css
└── types/
    └── constants.ts       # Video dimensions, FPS
```

## Creating Scenes

### Basic Scene Structure

```tsx
// src/remotion/scenes/MyScene.tsx
import { AbsoluteFill, useCurrentFrame } from "remotion";

// Export duration constant (in frames, at 30fps: 30 frames = 1 second)
export const MY_SCENE_DURATION = 90; // 3 seconds

export const MyScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#fff" }}>
      <h1>Frame: {frame}</h1>
    </AbsoluteFill>
  );
};
```

### Using Shared Components

```tsx
import { FadeIn, SlideUp } from "@launchpad/shared/components/animations";
import { COLORS } from "@launchpad/assets/brand";

export const MyScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background.cream }}>
      <FadeIn durationInFrames={30} direction="up">
        <h1>Hello World</h1>
      </FadeIn>

      <SlideUp delay={15} distance={50}>
        <p>Subtitle appears after title</p>
      </SlideUp>
    </AbsoluteFill>
  );
};
```

### Register the Composition

Add your scene to `src/remotion/Root.tsx`:

```tsx
import { Composition } from "remotion";
import { MyScene, MY_SCENE_DURATION } from "./scenes/MyScene";
import { VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS } from "../../types/constants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyScene"
        component={MyScene}
        durationInFrames={MY_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
```

## Combining Scenes (Full Video)

Use `Series` to sequence multiple scenes:

```tsx
// src/remotion/scenes/FullVideo.tsx
import { AbsoluteFill, Series, Audio, staticFile } from "remotion";
import { IntroScene, INTRO_DURATION } from "./IntroScene";
import { DemoScene, DEMO_DURATION } from "./DemoScene";
import { OutroScene, OUTRO_DURATION } from "./OutroScene";

export const FULL_VIDEO_DURATION = INTRO_DURATION + DEMO_DURATION + OUTRO_DURATION;

export const FullVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Background music */}
      <Audio src={staticFile("music.wav")} volume={0.3} />

      <Series>
        <Series.Sequence durationInFrames={INTRO_DURATION}>
          <IntroScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={DEMO_DURATION}>
          <DemoScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={OUTRO_DURATION}>
          <OutroScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
```

## Adding Audio

Place audio files in `public/`:

```tsx
import { Audio, staticFile } from "remotion";

// Background music (plays throughout)
<Audio src={staticFile("music.wav")} volume={0.3} />

// Sound effect at specific frame
<Audio src={staticFile("whoosh.wav")} startFrom={30} />
```

## Adding Images/Videos

```tsx
import { Img, Video, staticFile } from "remotion";

// Image
<Img src={staticFile("screenshot.png")} />

// Video
<Video src={staticFile("demo.mp4")} />
```

## Animation Tips

### Frame-based Animation

```tsx
const frame = useCurrentFrame();

// Animate over 30 frames (1 second)
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateRight: "clamp",
});

return <div style={{ opacity }}>Fading in</div>;
```

### Spring Animation

```tsx
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const scale = spring({
  frame,
  fps,
  config: { damping: 10, stiffness: 100 },
});

return <div style={{ transform: `scale(${scale})` }}>Bouncy!</div>;
```

### Staggered Elements

```tsx
const items = ["First", "Second", "Third"];

return (
  <>
    {items.map((item, i) => (
      <FadeIn key={item} delay={i * 15} direction="up">
        <div>{item}</div>
      </FadeIn>
    ))}
  </>
);
```

## Rendering

```bash
# Full quality render
pnpm render --filter=@launchpad/YourVideo

# Half resolution (faster preview)
pnpm render --filter=@launchpad/YourVideo -- --scale=0.5

# Specific composition
pnpm render --filter=@launchpad/YourVideo -- --composition=IntroScene
```
