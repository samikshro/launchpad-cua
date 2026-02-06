# Launch Test

Launch Test video

This project uses the **Launch Explainer template** with scenes for:
- problem framing with feed-style text motion
- a clear solution narrative (problem -> solution -> proof)
- large dashboard UI with section fly-through camera moves
- feature cards tied to measurable value
- final CTA close for hero pages, homepage videos, and YouTube uploads

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

- `src/remotion/scenes/LaunchData.ts`
  - Replace product name, pain points, motion lines, features, and CTA copy
- `src/remotion/scenes/*Scene.tsx`
  - Tune timing, transitions, and visual style for your brand
- `types/constants.ts`
  - Change composition dimensions and fps
