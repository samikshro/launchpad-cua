# Claude Code Workflow

This guide explains how to use Claude Code effectively with Launchpad for AI-assisted video creation.

## Setup

Add the Remotion skill to enable Claude Code to understand Remotion's APIs:

```bash
npx skills add remotion-dev/skills
```

Run this from the launchpad root directory. The skill files will be stored in `.claude/skills/`.

This gives Claude Code deep knowledge of:
- Remotion APIs (`useCurrentFrame`, `interpolate`, `spring`, etc.)
- Animation patterns and best practices
- Composition structure and organization

## Creating Scenes with AI

### Basic Prompts

Ask Claude Code to create scenes naturally:

```
Create an intro scene that fades in a title "Product Launch" from below,
then reveals a subtitle after 1 second.
```

```
Add a typing animation that types out "Hello World" character by character.
```

```
Create a scene with 3 feature cards that slide in from the left, staggered by 0.5 seconds each.
```

### Using Shared Components

Reference the shared packages in your prompts:

```
Create a scene using FadeIn from @launchpad/shared that shows our
brand colors from @launchpad/assets.
```

```
Add a text reveal animation using TextReveal from the shared package.
```

### Complex Animations

For complex animations, be specific:

```
Create a scene where:
1. The background fades from cream to dark over 2 seconds
2. A logo scales in from 0 to 1 with a spring animation
3. Text appears below the logo with a staggered word-by-word fade
4. After 3 seconds, everything fades out
```

## Project Context

The `.context/notes.md` file helps Claude understand your project. Add notes like:

```markdown
# Project Context

## Brand Guidelines
- Primary color: #0070f3
- Background: cream (#FDF8F3) for intro scenes, dark for demos
- Font: Urbanist for headings

## Video Style
- Keep animations smooth and professional
- Use 30fps timing (30 frames = 1 second)
- Prefer subtle movements over flashy effects

## Common Patterns
- Always export DURATION constant from scenes
- Use Series for sequencing multiple scenes
- Add sound effects from public/ folder
```

## Example Session

```
You: Create a new scene called "FeatureShowcase" that displays 4 feature cards
     in a 2x2 grid. Each card should have an icon, title, and description.
     Animate them in one by one with a stagger effect.

Claude: I'll create the FeatureShowcase scene...
        [Creates src/remotion/scenes/FeatureShowcase.tsx]

You: The cards are too close together, add more spacing.
     Also make the animation faster.

Claude: I'll update the spacing and animation timing...
        [Edits FeatureShowcase.tsx]

You: Add this scene to the FullVideo composition after the intro.

Claude: I'll import and add the scene to FullVideo.tsx...
        [Updates FullVideo.tsx and Root.tsx]
```

## Tips

1. **Be specific about timing** - Use frames or seconds: "fade in over 30 frames" or "after 2 seconds"

2. **Reference shared components** - Claude knows about `@launchpad/shared` and `@launchpad/assets`

3. **Describe visual output** - "The title should slide up from below while fading in"

4. **Iterate incrementally** - Start simple, then refine: "Make it bounce more" or "Slow down the animation"

5. **Ask for explanations** - "Explain how the spring animation works in this code"

## Common Tasks

### Adding Sound Effects
```
Add a whoosh sound effect when the logo appears at frame 30.
```

### Creating Transitions
```
Add a fade transition between IntroScene and DemoScene.
```

### Responsive Text
```
Make the title text scale down on mobile (vertical) format.
```

### Data-Driven Scenes
```
Create a scene that takes an array of features as props and
renders them dynamically.
```
