# Title-style draft v01 provenance and inventory

- Character/version: Monkey D. Luffy, One Piece Enies Lobby arc, age 17; commonly published stature about 172 cm. This is canon metadata only, not a pixel conversion.
- Source fidelity: outfit and character landmarks transcribed from the user-approved kit brief: messy black hair, left-eye scar, red open sleeveless vest, blue shorts with white cuffs, yellow sash, straw sandals, straw hat with red band. No official screenshots were attached to generation.
- Shared calibration: exact neutral cells from Naruto, Sasuke, Killua and Gojo in `public/art-review/title-style-pilot/`; this is a visual relationship baseline, not formal pixels/cm. Their approved lineup is reproduced in `title_style_lineup_v01.svg` beside Luffy's two cells.
- Candidate: `title_style_draft_v01.png`, generated 2026-10-14. One image-generation attempt total; selected candidate inventory: v01. Cumulative attempt budget: maximum 3 for this image; 1 used, 2 remain only if the user gives v02 feedback.
- SHA-256: candidate `1b7717c259a4da07a512508d702a6bd5775bdfc4298b4f1c3fcc671d283cb963`; comparison sources: Naruto `acfd7240f9ee7fbe71c1b6c50ea8a269ceedeb05de44b929850ca8de06a0610f`, Sasuke `fbc6b37701c9055b7e1349aec0b1f035ed1aa21638a66541ffbf71ba3e222352`, Killua `86278707ba8f0fcb78942cbcedb3341d8ad8f559e95f8cbf48273d0bbdca1855`, Gojo `d9fd4dca67c7cc133e897773a3c8128d6c5320a42402642c11409fea770175a0`.
- Measurement: source raster 2172×724. The two pose regions are each approximately 724×724 before normalization into 256×256 comparison cells. Hair/hat crown and perspective make exact skull, shoulder, hip, knee and sole landmarks uncertain; no numeric anatomy pass is claimed. Record measured landmarks after the user selects or revises the image.
- Technical review: image has two full-body poses and magenta background. Rendering appears softly shaded/outlined and less strictly hard-pixel than the requested production specification. At 256px display, confirm detail, anatomy, proportions and alignment directly in the lineup.
- Approval: user approved both title-style neutral and combat poses on 2026-10-14. This approval does not approve model sheet, expressions or idle.

## Follow-up candidate batch (2026-10-14)

The user's explicit `approved for both` authorized the following three candidates and no further assets. Each image used one generation attempt; no further attempts were used. The model sheet candidate was allowed as a working continuity reference for expressions and idle. The user subsequently approved all three v01 candidates; their versioned files remain unchanged and fixed-name copies are now present.

| candidate | dimensions | SHA-256 | provenance and review uncertainty |
|---|---:|---|---|
| `model_sheet_v01.png` | 1536×1024 | `c81bbe79608f291b70c8146a5ec3e95833d2c786470c7de05dc022902103e0cb` | One attempt; generated from approved title-style draft v01. Four views, fighting stance and palette. Perspective, cross-view anatomy and profile accuracy need human review; it is not a measured scale document. |
| `expressions_v01.png` | 1774×887 | `cc214ac79f5eb453ac62b33db43b6e8585a87c85ecd083b25485828e2b70e700` | One attempt; generated using approved title-style v01 and model-sheet v01 as explicit continuity input. Eight states appear; exact scar placement, face landmarks and consistency need review. |
| `raw/idle_v01.png` | 2048×256 | `b11ae08cddc02bd2be95a21663f0dfba993d2743c356a7a346dfdd00d7cecb4b` | One attempt; generated with approved title-style v01 and model-sheet v01. Source was an 8-cell 4×2 grid, cropped and nearest-neighbor arranged as eight 256×256 frames. Body fills about 225 px including hat; this is an occupied bounding estimate, not a stature measurement. Feet sit near a common baseline. Frames 0–7 have very subtle changes and a near-static loop; motion readability is uncertain. |

The approved neutral and combat provide visual reference only; title-style pilot has no formal pixels/cm calibration. The user must independently review every candidate. No packer, head probe, anatomy audit, game preview or physical scale pass was performed on these three candidates.

## Approval record

The user explicitly approved `model_sheet_v01`, `expressions_v01` and `idle_v01` on 2026-10-14. The manifest records `approvedVersion: 1` for each. Approved copies: `reference/model_sheet.png`, `reference/expressions.png` and `reference/idle_approved.png`. This records image approval only; it does not claim the idle passed packing, the scale gate, in-game QA, or the full anatomy audit.
