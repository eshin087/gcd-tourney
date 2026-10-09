# 0002. HD-2D pixel renderer

- Status: Accepted
- Date: 2026-10-04 (recorded retroactively 2026-10-08)
- Deciders: User, Claude
- Amended by [0007](0007-art-spec-v2-shippuden-256.md): hi-res sheets are spec v2 (256 px cells, ppu 128);
  HD mode switches on when `pixelsPerUnit >= 70`.

## Context
The target look is "HD-2D": pixel-art characters standing in a 3D world with modern lighting, depth,
bloom and camera motion. A naive Three.js render at native resolution makes geometry crisp and sprites look
pasted on. Pixel art needs a consistent pixel grid and nearest-neighbor sampling to read as pixel art.

## Decision
- `PixelRenderer` (`src/core/renderer.js`) renders the whole scene into a **small drawing buffer**: an integer
  scale of the window, `round(height / 340)`, so 360 px tall at 1080p. CSS upscales it with **nearest-neighbor**
  (`image-rendering: pixelated`). Geometry, textures and sprites share one chunky pixel grid.
- Post-processing is an **EffectComposer**: RenderPass → **UnrealBloom** (HDR values > 1.0 glow: beams, auras,
  sparks) → a light grade (saturation, contrast, vignette) → OutputPass. No anti-aliasing and no tone mapping.
- Fighters are **camera-facing sprite planes** anchored at the feet, with a hidden sun-facing silhouette caster
  for real shadows and a blob contact shadow.
- Pixel textures use `NearestFilter`, no mipmaps, sRGB.
- **HD render mode** (in progress): when a fighter uses a hi-res custom sheet (`pixelsPerUnit >= 70`; spec v2:
  256 px cells, ppu 128), the renderer
  switches to a sharper mode (higher internal resolution for sprites or the whole frame), so the extra
  art detail isn't averaged away by the low-res buffer.

## Alternatives considered
- **Native-resolution render + pixel shader post-effect**: sprites get resampled twice and shimmer more.
- **2D canvas compositing of a 3D background**: loses depth sorting, shadows and camera moves.

## Consequences
- A strong, consistent look for cheap. The low-res buffer also keeps fill rate low at 4K.
- Sub-pixel movement can shimmer. Placement, scale and PPU must stay consistent across art sources.
- Hi-res art (2× the placeholder) only pays off with the HD render mode. The renderer needs a second
  configuration path and tests at several window sizes (1080p, 1440p, 4K, small laptop).
- Bloom thresholds are part of the art direction. VFX use a `glow` uniform to opt into bloom.
