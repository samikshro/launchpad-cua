# Getting Started

This guide will help you set up Launchpad and create your first video.

## Prerequisites

- Node.js 18+
- pnpm 9+ (`npm install -g pnpm`)

## Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd launchpad
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create your first video:
   ```bash
   pnpm create-video
   ```

4. Follow the prompts to name your video and choose dimensions.

## Development Workflow

### 1. Open Remotion Studio

Remotion Studio is a visual editor for your video with live preview:

```bash
pnpm remotion --filter=@launchpad/YourVideo
```

This opens a browser with:
- Live video preview
- Timeline scrubbing
- Composition selector
- Props editor

### 2. Edit Scenes

Open your video's scene files in `videos/your-video/src/remotion/scenes/`:

```tsx
// IntroScene.tsx
import { AbsoluteFill } from "remotion";
import { FadeIn } from "@launchpad/shared/components/animations";

export const IntroScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <FadeIn>
        <h1>Your Title Here</h1>
      </FadeIn>
    </AbsoluteFill>
  );
};
```

Changes auto-reload in Remotion Studio.

### 3. Preview in Web Player

For a simpler preview with the Next.js web player:

```bash
pnpm dev --filter=@launchpad/YourVideo
```

Open http://localhost:3000 to see the player.

### 4. Render Your Video

When ready, render the final video:

```bash
pnpm render --filter=@launchpad/YourVideo
```

The output will be in `videos/your-video/out/`.

## Next Steps

- Read [Creating Videos](./CREATING_VIDEOS.md) for detailed scene creation
- Explore [Shared Components](./SHARED_COMPONENTS.md) for reusable animations
- Try [Claude Code Workflow](./CLAUDE_CODE_WORKFLOW.md) for AI-assisted development
