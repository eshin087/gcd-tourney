# 0003. 3D-baked placeholder sprites

- Status: Accepted
- Date: 2026-10-04 (recorded retroactively 2026-10-08)
- Deciders: User, Claude

## Context
A fighter has 38 animations (~154 frames). Hand-drawn or AI-generated art for that is slow and arrives in
batches, but the game must be playable and tunable from day one, and new characters must be playable
before their art exists. The first placeholders were painted procedurally in 2D (`src/art/pixel.js`). They
were stiff and hard to animate well.

## Decision
- Each character gets a **posable 3D chibi model built from smooth primitives** (`src/art/rig/`), described in its
  character file (palette ramps, outfit mapping, hair spikes, headband, face).
- Animations are **keyframed joint-angle poses** (`pose.js`, shared moveset in `anims.js`, character extras in
  `extraAnims`).
- At startup, `baker.js` renders every sampled pose with a **toon shader** plus an ID/depth pass into 112×112
  cells. It adds contour lines, a dark outline, stamped pixel-art anime eyes and motion smears, and generates
  hit/hurt boxes from the limbs and silhouette, a HUD portrait and a cut-in eye strip.
- The output is the **same format as hand-made sheets** (sheet + anims.json meta: `frameWidth`, `pivot`,
  `pixelsPerUnit`, `animations`, `phases`, `boxes`), so the engine has exactly one sprite path.
- Custom art in `public/characters/<id>/` **replaces** the bake per character when present (ADR 0006).

## Alternatives considered
- **Wait for real art**: blocks all gameplay work.
- **Pure 2D procedural painting**: tried first; poor motion quality and a high cost per pose.
- **Pre-baked placeholder PNGs committed to the repo**: faster boot, but every model or pose tweak needs a
  re-export step. Baking at boot keeps the Sprite Lab instant.

## Consequences
- Gameplay, timing and hitboxes can be tuned immediately, and new characters are playable at readiness L0.
- Boot cost grows with the roster (currently < 1 s per character). Lazy baking on select is planned
  (ENG-020).
- The rig defines a reference for proportions, pivot and timing that the hi-res art briefs mirror (scaled
  ~2×).
- Two art sources must stay world-size compatible (PPU chosen so both give ~1.6 units of standing height).
