# Goku specialDown v02 — final diagnostic anatomy/scale audit

2026-10-18. GPT-6 Astra, medium reasoning. **HOLD: all four diagnostic packed cells remain visibly undersized relative to the current packed idle.** This is a concrete torso/build and head-silhouette concern, independently of the unreadable automatic head probe. v01 evidence remains preserved in its separate directory.

## Exact inputs and comparison basis

Worktree `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-goku-skills`, branch `art/goku-skills`. Candidate `art/characters/goku/raw/specialDown_v02.png`, 2172x724; parent reports bodyHeight 204 and a temporary-only version-2 head exemption for this diagnostic quantize-48 pack. Production has no exemption; the diagnostic pass is not a production strict-pack pass.

Verified SHA256:

- raw v02: `25543eddefd72a295f0f98a55fab0b557acda3cd4043f6eabcc9be02dc5b7b9a`
- `diagnostic-sheet.png`: `97befd22d34c9995e64cc13b04ed6e3c0217483b7f804075751bd009da1ea728`
- `diagnostic-anims.json`: `a55e84c9ec0b1e07f9ba144a142a9e5f2006d50e0ed6a899f96831e6880379bb`
- approved Goku title-style fixed neutral/combat pair (v02): `f7ae672771e9282f31e7804b02bb3f0ed46488618efd6050a4b864b2203dea42`

I inspected every specialDown cell, the packed idle cell 0, the raw candidate and the approved title-style neutral/combat pair. Current size-r7 inbox directs numeric Goku comparison only against his own idle, with differences at 5% or more flagged. Title-style cells supply identity/build context; they are not a substitute numeric denominator for the current rescaled idle. The production contract requires anatomy beyond the head and forbids equating crouched silhouette height with standing-body height.

## Reproducible evidence

The supplied 4096x2816 atlas has 16 columns of 256px cells; idle is cell 0 and v02 f0–f3 are cells 115–118. Crop cell c at `(c%16*256, floor(c/16)*256, 256, 256)`.

- [All frames beside idle at equal density](contact-2x.png): 2x nearest-neighbor, with a 24px native label band; no per-figure fit.
- [Idle and f0 with native y-grid](landmark-grid.png): 3x nearest-neighbor, lines every 16 native pixels.
- Supplied atlas and metadata remain next to this report.

| Frame | Exact alpha bounds (half-open) | Occupied size | Scale verdict |
|---|---|---|---|
| idle f0 | 55,28,205,241 | 150x213 | Working comparator |
| specialDown f0 | 84,54,176,241 | 92x187 | HOLD |
| f1 | 84,54,176,241 | 92x187 | HOLD |
| f2 | 84,54,176,241 | 92x187 | HOLD |
| f3 | 79,53,181,241 | 102x188 | HOLD |

Bounds prove margin and complete silhouettes, not anatomical scale. The stance is narrower and straighter than idle; its width cannot be used as a body-size multiplier.

## Anatomical measurements and uncertainty

**Torso/build:** hand-selected lower-neck/belt centers in idle are approximately `(137,86)` / `(129,123)`, projected distance **37.9px**. v02 f0 is approximately `(133,103)` / `(132,133)`, distance **30.0px**, about **0.79x idle (-21%)**. Endpoints have approximately +/-3px uncertainty apiece because they are garment/anatomy landmarks, not exposed joints. f1/f2 retain essentially the same collar-to-belt span (about 29–31px); f3 turns slightly and remains around 30–32px. These estimates cannot certify a tight 5% gate. Together with visibly reduced chest, upper-arm and waist volume at native density, they establish the scale hold. The upright pose does not plausibly explain the full decrease.

**Head:** approximate hair-top-to-chin envelope is 56px in idle and 44–46px in v02 (about 0.79–0.82x), with about +/-3px landmark uncertainty. This includes hair and is only a silhouette indicator. Skull crown is hidden, so there is no numeric anatomical head pass. Face/jaw and hair silhouette visibly shrink at the same density.

**Arms:** each frame has coherent shoulder/elbow/wrist connections; the near arm bends naturally and the relaxed far arm remains intact. Upper-arm volume is visibly smaller than idle. Different projections and overlapping hands prevent a reliable tight chain-length ratio; no arm-length pass is asserted.

**Legs/clothing:** orange trousers retain the correct loose shape and taper into both boots. Hidden hip/knee centers and the wide bent idle versus upright candidate prevent a reliable femur/shin ratio. No dislocation or extra limb was seen. Unmeasured skeletal lengths are not a pass.

**Boots:** screen-right trouser-exit-to-sole span is roughly 35–37px in idle versus 29–31px in v02 (approximately 0.78–0.89x). Endpoint uncertainty is about +/-2px, with differing cuff coverage and ankle angles. Complete shafts/toes remain readable; the reduced volume supports the overall hold without claiming an exact shoe ratio.

These estimates do not establish one safe universal rescale factor. First inspect measured import/assembly scaling against idle; preserve the raw and repack a measured correction before contemplating another redraw. Never fit this upright pose merely to idle's occupied height.

## Frame-by-frame pose and technical review

| Frame | Findings |
|---|---|
| f0 | Complete right-facing three-quarter figure. Raised near hand reads as two extended fingers away from forehead; far hand relaxed/down. Eyes appear closed or closing. Identity and connected anatomy read, but torso/head/boot scale is reduced: HOLD. |
| f1 | Two fingers contact the forehead, eye closed, calm expression. Complete hands/boots, coherent elbow bend. Same reduced body scale: HOLD. |
| f2 | Forehead contact and closed eye retained. Small lifted gi/shoulder contour conveys the held vanish beat; no gross shape breakup. Hair's overall top bound is unchanged from f1, so a distinct 1–2px hair lift is not strongly legible. Same scale HOLD. |
| f3 | Eye opens and torso/head rotate slightly toward opponent; fingers stay at forehead. Wider silhouette is a turn, not restored body size. Complete arms and boots; same scale HOLD. |

Metadata is nonlooping, phases 2/1/1, durations 80/80/160/90ms. All frames and the return-to-idle comparison were inspected statically. The latter would produce a conspicuous scale increase. No browser playback or runtime hit/hurtbox/contact test was performed.

All candidate soles end at y240. No occupied pixel touches a cell edge; no clipped fingertip, hair, boot or neighboring fragment was seen. The two-finger and eye-state details survive at limited resolution. Gold hair, orange gi, blue undershirt/sash/wristbands/boots match the title-style identity. Internal consistency across v02 is substantially better than its consistency with idle.

## Disposition

**specialDown v02: technical HOLD, not ready for production approval as packed.** Resolve measured import size and rerun strict pack plus exact-atlas audit; TOOL-GOKU-PROBE remains a separate unresolved gate. This audit grants no exemption and no user art approval. No production manifest, public pack, raw input, REVIEW or approval state was changed. Only this report and its two evidence images were written by the auditor; diagnostic atlas/metadata were supplied by the parent.
