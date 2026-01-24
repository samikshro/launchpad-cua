# Shared Images

Place shared images and backgrounds here.

## Organization
- `logos/` - Brand logos
- `backgrounds/` - Reusable background images
- `icons/` - Common icons

## Usage in videos

```tsx
import { Img, staticFile } from "remotion";

// In your composition:
<Img src={staticFile("images/logo.png")} />
```
