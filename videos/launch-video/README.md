# Launch Video

Launch video template

This project uses the **Launch Explainer template** with scenes for:

- problem framing with feed-style text motion
- a clear solution narrative (problem -> solution -> proof)
- large dashboard UI with section fly-through camera moves
- feature cards tied to measurable value
- final CTA close for hero pages, homepage videos, and YouTube uploads
- `ManifestoMotionToolkit` composition with reusable transition templates (kinetic text, portal masks, pill wipes, morphs, glass UI, and staggered card scroll)

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
