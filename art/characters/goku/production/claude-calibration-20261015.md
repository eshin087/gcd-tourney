# Goku idle v02: Claude calibration (2026-10-15)

The user approved idle v02 as drawn (Codex handoff 13d4ec7). Claude measured it against Goku's approved title-style
v02 cells at native density (`reference/title_style_lineup_v02.png`, the same 256 px cells):

| measure | idle v02 f0-f7 | approved combat cell | approved neutral cell |
|---|---|---|---|
| occupied height incl. hair | 232-233 px | 214 px | 233 px |
| hair band height | 66-69 px | 68 px | 59 px |
| blue belt width | 79-83 px | 74 px | 77 px |

Uncertainty about ±3 px per landmark (belt width also moves with torso turn). The hair matches the combat cell exactly
and the belt reads +5-9 %, so the drawing already sits at the approved density (mean about +4 %): no rescale factor.
The idle's stance is narrower and less crouched than the combat key, so its total height is not comparable to the
combat cell, and the earlier "body ~180 vs reference 207" compared a crouched body with an upright one.

What actually made the packed idle small was the manifest: the idle's `bodyHeight` was still the template's 204, so
the packer fitted the 232 px drawing by x0.876. Claude set Goku's idle `bodyHeight` to **233** (its measured height at
the approved scale, the same convention as the cast: Gojo 236, Sasuke 180, Naruto 165), so it packs at x1. That edit
went into Codex's commit 124d157 because both worked in this worktree at once; it is Claude's.

Done here: `reference/idle_approved.png` is now a byte copy of `raw/idle_v02.png` (v01's copy is superseded; v01 stays
in raw/). `node tools/pack-sprites.mjs goku --quantize 48`: idle x1, 48 colours, 0 warnings, scale gate reference
only. `npm run lineup` idle row: Goku clearly taller than Naruto and Sasuke; crouched with the Super Saiyan hair he
reaches upright Gojo's height while his body without hair stays below Gojo's (the approved v02 relationship).
Runtime `standingBodyPx` is untouched until the contact/hurtbox migration. The other strips get their `bodyHeight`
calibrated the same way when they arrive.
