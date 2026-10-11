# Title-art style restoration pilot — 2026-10-11

User direction: the title-screen Naruto and Killua are the exact look-and-feel reference. The user dislikes the newly shipped Naruto/Gojo treatment, sees Killua larger than Sasuke in fights, and prefers the older fallen poses. This replaces the previous visual direction for this study. Do not continue full animation redraws or promote these drafts without review.

Deliver only four initial character sheets, each with a neutral three-quarter standing view and a right-facing combat stance. Compose same-scale comparisons from those separate images. Naruto and Killua preserve the title's identity, clothing, faces and silhouette; Sasuke and Gojo adopt its clean anime contours, restrained cel shading and readable clothing shapes. Gojo stays tall and lean, not frail or broad-chested. Naruto and Sasuke have similar teenage builds; Killua is shorter and narrower.

## References and provenance

- Art/style master: approved `art/ui/raw/title_art_v02.png`; displayed title: `public/ui/title_art.png`.
- Sasuke identity only: historical approved `reference/model_sheet_v01.png`.
- Gojo identity only: historical approved `reference/model_sheet_v03.png`.
- The user's direct choice of the title and original art authorizes these historical references. Do not attach the rejected recent full-redraw models as identity targets.

## Review scale

Use one floor and pixel density. Proposed neutral skull-to-sole heights before a common 236/238 cell-fit factor: Naruto 195, Sasuke 197, Killua 176, Gojo 222 px. This is a visual size proposal for user review, NOT a claim of exact canon stature: Killua is deliberately about 10% shorter than Naruto in body length so his larger hair does not erase the visible size relationship, addressing the user's direct feedback. That choice must be reviewed explicitly rather than silently inherited into future production. Crown landmarks are estimates (±12 source pixels), not exact anthropometry. Do not resize each combat pose to its bounding-box height: reuse its neutral's scale and inspect head/limb consistency. Review the actual render at native size and enlarged nearest-neighbor. The one common cell-fit factor preserves all proposed ratios.

This is a style study, not new canonical animations. Keep the game atlases, references, animation approvals and production unchanged. The animation pack/scale gate does not certify these concept sheets. Record image-specific QA and uncertainty; after approval, the first genuine idle/guard trial must pass packing and live same-depth checks before more frames are produced.

## Current runtime finding

Read-only audit of main 7005b17: packed idle Killua 202–203 px including hair vs Sasuke 202 px; Naruto 193–195 px. Killua's hair proxy is 43×32 vs Sasuke 35×34. Both use 256 cells, ppu128 and the same 2×2-world-unit sprite geometry. At equal camera depth there is no character-specific renderer multiplier. Hair and pose are therefore material contributors to the inverted visual relationship. Run bounds Killua 163–180 vs Sasuke 144–167 px. These are silhouette measurements, not standing skeleton heights.

## Review gate

Save `reference/title_style_draft_v01.png` per character, retain only the best of at most three attempts, and add individual REVIEW rows. No new fallen sprites. User reviews this pilot before any full set, rollback or runtime change. Claude remains integration and production coordinator.
