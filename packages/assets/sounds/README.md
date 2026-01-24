# Sound Effects

Place shared sound effects here. These can be imported in any video project.

## Recommended sounds to add:
- `whoosh.wav` - Transition swoosh
- `pop.wav` - Element appearance
- `typing.wav` - Keyboard typing
- `click.wav` - Button/UI click
- `success.wav` - Success/completion chime

## Usage in videos

```tsx
import { Audio, staticFile } from "remotion";

// In your composition:
<Audio src={staticFile("sounds/whoosh.wav")} />
```

Note: Copy sounds you need to your video's `public/` folder,
or reference them from a shared location.
