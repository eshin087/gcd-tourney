# 0041: Resize a whole fighter against the cast with `packScale`

**Status:** Accepted (user decision, 2026-10-18)
**Date:** 2026-10-18
**Task:** ART-SIZE-R7
**Amends:** [ADR 0029](0029-title-style-scale-baseline.md) (adds a measured cast density for new fighters)

## Context

On 2026-10-18 the user asked for a full size audit and said Goku and Luffy "seem way bigger than the other
characters and feels out of place". Measured at one pixel density:

- The four title-style fighters share one density: standing body (soles to skull, no hair) over canon height is
  Naruto 195 px / 166 cm, Sasuke 197 / 168, Gojo 222 / 190, all about **1.17 px per cm** (Killua 176 / 158 is 1.11).
- Goku shipped at **1.08x** his approved title-style combat cell (`title_style_draft_v02`, silhouette fit, IoU 0.93):
  about 224 px of body for 175 cm, 1.28 px/cm, as tall as Gojo.
- Luffy matches his approved reference, but that reference was itself drawn large: about 217 px of body for 172 cm
  (1.26 px/cm). His lineup cell had been fitted into the comparison cell rather than placed at the cast's density.

Both fighters' strips were otherwise consistent with their own idles. Redrawing about 47 approved strips to fix one
number would spend image calls and approvals on drawings that are already right.

## Decision

1. **`characters.<id>.packScale`** in `art/manifest.json` (0.5-1.5, default 1) resizes a whole fighter when it is
   packed. Every strip's `bodyHeight` (manifest or sidecar), its sidecar `frameOffsets` and every `hitboxes.json`
   box and hand anchor are multiplied by it (anchors about the pivot, so the feet stay on y 240). Hit and hurt boxes,
   footprints and the scale audit come from the packed art, so they follow. A declared `standingBodyPx` is scaled
   too. Each drawing keeps its pose; only its size changes.
2. **Goku and Luffy pack at x0.92** (user's option A from a lineup of x1.00 / x0.92 / x0.85). That puts both on the
   cast's 1.17 px per cm: Goku about 206 px of body, Luffy about 200 px.
3. **One strip drawn at the wrong size** gets `animations.<anim>.packScale` (same range), which multiplies the
   fighter's. An attack alt never inherits its base's. The automatic head fit (`anatomy: auto-head`) keeps it: the
   fit is measured on cells that already carry it, so it is applied after the fit instead of being fitted away. The
   audit that sets these numbers (ART-SIZE-R7) acts only where the median of independent measures (head template,
   body area, hand landmarks) is 6 % or more off the fighter's other strips; one measure alone misreads turned heads
   and folded poses by up to 10 %.
4. **`--keep-palette`** (with `--quantize`) snaps a repack to the colours of the fighter's current `sheet.png`, and
   each source colour to the palette colour it got last time wherever a strip kept its shape. Resizing one strip then
   leaves every other strip byte for byte; a fresh median cut moved up to 2,500 px of Gojo's untouched idle by up to
   87 levels.
5. **New fighters** are placed at about 1.17 px per cm of canon standing height (body without hair or hat), measured
   on the title-style neutral beside the four approved cells. The lineup is still the user's call (ADR 0029); this
   number is where the first candidate starts.

## Alternatives considered

- **Redraw every strip at the right size.** Same drawings, about 47 image calls and approvals. Rejected.
- **Re-assemble each strip from its high-resolution source at factor x 0.92.** Cleanest pixels, but every Goku strip
  uses its own one-off re-assembly script and sidecar schema. A second "mode" downscale of the 256 px cells was
  checked side by side on Goku's face and hair and holds up, so the packer route was chosen.
- **Lower each strip's `bodyHeight` by hand.** Same result for the size, but 47 numbers to keep in step, and
  `frameOffsets` and hand anchors would not follow.
- **An engine-side sprite scale.** It would leave the packed cells, boxes and anchors at the old size and make the
  atlas lie about what ships.

## Consequences

- One number per fighter brings a fighter back to the cast's scale, and it can be changed or removed later.
- The art is resampled twice for fighters whose raws are already 256 px cells (Goku). This is fine at x0.92;
  far from 1, re-assemble from the sources instead.
- Smaller art means shorter hit boxes: Goku's and Luffy's attacks reach about 8 % less (Goku heavy 127 to 117 px from
  the pivot), in line with the rest of the cast.
- A `builds.json` `scaleReference` or `standingReference` cell is compared at its own size: the packer warns when a
  fighter with one gets a `packScale`, and the cell has to be cut again at the new size.
- `hitboxes.json` points measured on the resized cells must carry `"_scale": <packScale>` in their animation's block,
  so they are not scaled twice.
