# Terminal Test

Terminal Test video

This project uses the **Terminal Announcement template** inspired by the Remotion prompt flow:
- big macOS-style terminal with command typewriter animation
- staggered output lines (50ms cadence)
- 3D terminal movement (slide-in, drift rotation, scale-in)
- flip transition toward camera with bottom transform origin
- behind-terminal reveal sequence for headline + brand row

## Development

```bash
pnpm remotion
pnpm dev
```

## Rendering

```bash
pnpm render
pnpm render:preview
```

## Where to customize

- `src/remotion/scenes/AnnouncementData.ts`
  - command text, output lines, headline text, brands, timing values, motion values
- `src/remotion/scenes/MasterScene.tsx`
  - tune camera motion and flip transition style
- `types/constants.ts`
  - set composition dimensions and fps
