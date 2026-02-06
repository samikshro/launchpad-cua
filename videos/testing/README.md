# Blue Alpha x 1440

Blue Alpha x 1440 case study video.

This project now maps to the published Blue Alpha case study:
https://bluealpha.ai/case-studies/1440

Highlights covered in the scenes:
- Attribution conflict across channels and measurement systems
- Weekly decisioning with Blue Alpha's Bayesian MMM workflow
- Measurable outcomes like faster model cadence and clearer organic social contribution
- Final CTA linked directly to the source case study

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

- `src/remotion/scenes/CaseStudyData.ts`
  - Contains the Blue Alpha x 1440 facts, bullets, and metric values
- `src/remotion/scenes/*Scene.tsx`
  - Scene choreography and visual transitions
- `types/constants.ts`
  - Composition dimensions and fps
