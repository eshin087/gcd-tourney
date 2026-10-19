# 0046: Reserve part of a fighter's 48 colours for strips drawn in other colours (`paletteReserve`)

**Status:** Accepted (user approved PR #162, 2026-10-18)
**Date:** 2026-10-18
**Task:** TOOL-PALETTE-RESERVE (follow-up of ENG-SKL-NAR-2)
**Extends:** [ADR 0007](0007-art-spec-v2-shippuden-256.md) (at most 48 colours per character) and
[ADR 0041](0041-fighter-pack-scale.md) §4 (`--keep-palette`)

## Context

`--quantize 48` snaps a whole fighter to one 48-colour median cut, so every frame shares one palette. Naruto's
ultimate (ADR 0045) turns him into the Four-Tails fox, drawn crimson and near-black red with white eyes and teeth
(beamCharge v17, beamFire v15, approved by the user). Packed at 48 colours, his orange jumpsuit dominated the cut:
the fox's crimsons snapped to a brown-red (#9c1d0a) and a dark brown (#341816), its whites to his skin peach
(#fbd6b4), and in game it read red-brown with a peach mouth. Measured against the unquantized cells, the two fox
strips were off by 45 RGB levels on average and half their pixels by more than 40; every other strip was off by
about 15.

Three ways to fix it were measured on Naruto's real cells:

- **Another median cut without the fox** (or with fewer colours for the rest): the fox is fine, but 93 % of the
  other strips' pixels change and 7 % by more than 30 levels. Each change is closer to the drawing, but the user
  approved the sheet as it looks, and "the rest keeps its colours" was the brief.
- **Extra colours for the fox on top of the 48** (56 in all): the other strips are untouched, but it breaks the 48
  of ADR 0007.
- **Give the fox some of the 48 and take them from where the rest needs them least.** The usual cut holds several
  near-duplicate shades (six dark greys within 10 levels of each other); merging those costs the other strips almost
  nothing.

## Decision

1. **`characters.<id>.paletteReserve`** in `art/manifest.json` names groups of strips and how many of the fighter's
   `--quantize` colours each group gets for itself:
   `{ "fourTails": { "colors": 8, "animations": ["beamCharge", "beamFire"] } }`. A strip belongs to one group; a
   malformed group or an unknown animation is reported and ignored, and the reserves together may take at most half
   the palette.
2. **The shared palette** starts as the usual one (the median cut over every strip, or with `--keep-palette` the
   current sheet's colours less those only the group's strips used last time). The packer then drops the entries
   whose pixels in the *other* strips lose least by moving to their nearest remaining entry (pixels x squared RGB
   distance), one at a time, until the reserves fit. The other strips snap to what is left and never to a group's own
   colours, so a group's art can never move them.
3. **Each group** gets that many colours from a median cut of its own strips, and its strips snap to the shared
   palette plus their own. The sheet keeps at most `--quantize` colours.
4. **Naruto reserves 8** for the fox. The other strips lose eight near-duplicate dark greys and navies: 2 % of their
   pixels move, almost all by 2-10 levels (313 px, 0.016 %, by more than 30), with no visible change at 3x. The fox's
   mean error falls from 45 to 24 levels; with 6 colours its eyes and teeth still went peach.
5. Without a `paletteReserve` the packer behaves exactly as before (byte for byte).

## Alternatives considered

- **A per-strip palette in the engine** (a second sheet or a palette texture per animation): real support for
  recolours, but an engine and format change for one transformation. Not needed while the 48 colours suffice.
- **Raising the spec to 64 colours for every fighter:** changes every sheet and the look ADR 0007 chose.
- **Hand-picked colours for the fox** (a fixed hex list): the median cut of its own pixels finds them, and stays
  right when the drawing is replaced.

## Consequences

- A transformation or a recolour drawn in colours the fighter never uses keeps them, at the cost of its own share
  of the 48. More colours for it means fewer for the rest: keep the reserve as small as looks right (the review
  compares the packed strip with its raw at one scale).
- The shared cut still sees the reserved strips (so adding a reserve moves nothing but the merged shades). A fresh
  `--quantize 48` reproduces the shipped sheet; changing the fox's art can still nudge the shared cut, as any new
  strip does (TOOL-PALETTE-LOCK; `--keep-palette` avoids it).
- `npm run test:sprites` covers it: the reserved strip keeps its colours, every other pixel whose colour is still
  shared is unchanged, `--keep-palette` repacks byte for byte, too large or malformed reserves are refused.

## Amendment (2026-10-19, ENG-SKL-GOK): `"cut": "misfits"`

Goku's `intro` strip shows his black base-form hair in one frame of four; the rest is his usual gi and blond hair. A
group cut from its whole strip spends its colours on those (8 colours still gave the hair his maroon outline shade).
With `"cut": "misfits"` a group's colours are cut only from its colours more than 20 levels from every shared entry,
each weighted by its pixels times its squared distance (by pixels alone, skin drawn a few levels off his palette
outvoted the hair). Goku reserves 2 (`baseForm`, `intro`): the hair packs near-black, and his other strips move 0.41 %
of their pixels (22 by more than 30 levels). Without `cut` a group is cut from its whole strips as before, so Naruto's
fox is unchanged; an unknown `cut` is reported and ignored. `npm run test:sprites` covers both.
