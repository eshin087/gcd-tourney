# 0035. Super banners and ultimate splashes: layered cut-in art per move

- Status: Proposed
- Date: 2026-10-15
- Deciders: User, Claude
- Amends: the `ui/cutin.png` row of [art/SPEC.md](../../art/SPEC.md#per-character-ui-images) (the eye strip stays as
  the fallback and becomes the eye flash)

## Context

The user (2026-10-15): improve every special, super and ultimate so it has "the iconic anime/manga stunning epic
feel". When Sasuke uses the Sharingan, his eyes should clearly be red, with a Sharingan backdrop. Ultimates should
"show more than just their partial face"; there is "a lot of background space in the rectangle to show cool stuff".

Today every super and ultimate uses one picture: `cutin.png`, a 480 x 128 crop of the eyes and brows, scaled to the
height of a full-width speed-line banner (`hud.superCutin`, style.css `.cutin`). On a 16:9 screen the image fills
about a third of the banner; the rest is stripes. Kirin and Amaterasu, Domain Expansion and Hollow Purple all show
the same eyes. Specials have no presentation beyond an 8-12 frame flash, and Sasuke's Sharingan counter shows a
generic red ring.

The user decided (2026-10-15): **tiered** art (a wide banner for the super, a full-screen splash for the ultimate),
**hi-res pixel art** in the title style, and **Sasuke as the pilot** before the rest of the cast.

## Decision

### 1. Two layered images per move

Each fighter gets art for its SUPER and its ULTIMATE (kit `super` / `ultimate`), each in two layers so the engine can
move them separately (parallax, a slide-in that breaks the frame):

| file (public/characters/<id>/) | size | content |
|---|---|---|
| `super_bg.png` | 768 x 192 (4:1), opaque | the move's backdrop: sky, energy, symbol. No character, no text |
| `super_fg.png` | at most 768 x 240, transparent | the fighter chest-up in the move's pose. The banner is 192 tall; the head may break 48 px out of its top edge |
| `ult_bg.png` | 768 x 432 (16:9), opaque | the ultimate's full-screen backdrop. No character, no text |
| `ult_fg.png` | at most 768 x 432, transparent | the fighter, three-quarter or full figure, in the ultimate's pose |

The art-pixel grid is 768 across for all four (2.5x on a 1080p screen, nearest-neighbor), so banner, splash and
fighter share one pixel density. Raws are generated as usual (`art/characters/<id>/raw/ui_super_bg_vNN.png` etc.), the
user approves each version, Codex copies it to `ui/<name>.png`, and the packer fits it like the other UI images (bg:
center-crop to the aspect; fg: magenta removed, trimmed, contain-fitted, bottom-aligned).

### 2. Presentation (engine)

- **Super banner.** The banner gets taller (192 art px = a quarter of the screen width), the backdrop pans slowly, the
  fighter slides in from their side with a slight overshoot and keeps drifting, and the move name sits on it. It lasts
  the super's existing `flash`.
- **Ultimate splash.** A full-screen splash: a colored flash in, letterbox bars, the backdrop slowly zooming, the
  fighter sliding in over it, the move name large. The splash is cropped to the screen (`cover`), keeping the middle
  4:3 safe. The ultimate's flash freeze becomes long enough to read it (about 1.1 s, a number in moves.js, the same
  for every fighter whether or not the art exists).
- **Fail soft.** A missing layer falls back: no `*_bg` gives today's speed-line stripes, no `*_fg` gives today's eye
  strip, and a fighter with neither looks exactly like today. One `[sprites]` console line per missing file.
- **Eye flash.** The existing eye strip (`cutin.png`) becomes a short eye flash for a fighter's eye techniques (data:
  a move's `eyeFlash`), e.g. the Sharingan counter. It no longer stands in for supers once the banner art exists.

### 3. Sharingan and other in-game eye effects

Drawn in code, not image art: a large, crisp, rotating Sharingan (iris, ring, three tomoe; the Mangekyō pattern for
Amaterasu) behind the fighter for the counter, a red eye glint at the head with a short light trail, and the eye
flash. The pattern is data on the character (`eyes: { kind, color }`), so Gojo's Six Eyes and later fighters use the
same system without a character check.

## Consequences

- Four new images per fighter (24 for the cast of six). Sasuke first; the recipe goes to Naruto, Killua, Gojo, Goku and
  Luffy after the user approves the pilot.
- The eye strip stays useful (eye flash, fallback), so nothing approved is thrown away.
- The ultimate's flash gets longer for everyone, which pauses both fighters for about 0.4 s more; it does not change
  frame data or who wins an ultimate clash.
- Splash art is cropped on narrow screens; the briefs keep the subject inside the middle 4:3.
