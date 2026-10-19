# Luffy skills batches 3–4 — final Astra audit

Auditor: GPT-6 Astra, medium. Scope: actual 48-colour quantized sheet and metadata for specialForward v01, specialUp v01, specialDown v03. Compared every frame with all eight packed idle frames, the approved title-style references, and neutral/combat lineups. Both batch packs are byte-identical.

**Result: HOLD all three character strips.** No art approval is implied.

| Candidate | Finding |
|---|---|
| specialForward v01 (atlas 112–118) | f2/f3 have flat severed arm ends inside the cell; f3/f4 contain detached palm fragments at the left; f5 has a stray sandal-colour fragment. Other sampled body regions are broadly comparable to idle. Hold for segmentation/anatomical continuity. |
| specialUp v01 (atlas 119–124) | f0–f3 have severed raised-arm ends inside the cells (top rows y91, y44, y50, y46). f4/f5 are visibly smaller in head/build/clothing volume than idle. Hold for limb continuity and scale. |
| specialDown v03 (atlas 125–128) | f1 touches x0 at raised sandal; f2 reaches x255 with extended leg cut. All frames are enlarged vs idle. Hold for clipping and scale. |

Exact opaque bounds (left,top,right-exclusive,bottom-exclusive): idle f0 (41,54,210,241); forward f0–f6 (61,96,206,241), (50,110,205,241), (46,87,204,241), (42,85,206,241), (44,78,194,241), (52,61,194,241), (70,53,186,241); up f0–f5 (81,91,179,241), (102,44,170,241), (114,50,164,241), (110,46,161,241), (105,83,178,241), (91,152,179,241); down f0–f3 (9,57,248,241), (0,54,244,241), (8,57,256,241), (23,53,238,241).

Garment linear-area ratios from body report: forward 1.017, .962, 1.052, 1.067, .866, .926, .974; up .861, .860, .875, .934, .787, .854; down 1.469, 1.412, 1.441, 1.496. The method has approximately ±10% pose noise and is advisory. Down head probe values are 1.670, .972, 1.686, 1.691; f1 selects the raised-foot region, so that value does not establish head consistency. Manual head envelope is roughly 1.6–1.8× idle with ±4–6 px landmark uncertainty. Forward f3 head probe 2.037 is a merged-region artifact.

Sheet SHA-256 88a26f8a172c8121506da00084a95da9cbc3c98ff18cd6ff77bb8d20ded26c6b; metadata SHA-256 665f778bf7151ae742e34aedfb1e68a9880131ee1ac9622d948a40fff4bb0e36. Sidecar/frame placement correction and any redraw remain required before technical clearance.
