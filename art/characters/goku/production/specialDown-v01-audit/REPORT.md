# Goku specialDown v01 — diagnostic atlas anatomy audit

2026-10-18. GPT-6 Astra, medium reasoning. **HOLD: all four packed cells are visibly undersized relative to the packed idle.** The unreadable automatic head probe is not the only issue. Do not promote this diagnostic atlas or add a production exemption on the strength of this audit.

## Exact scope and inputs

Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-goku-skills`, branch `art/goku-skills` (observed HEAD `88d4ee21`). Candidate raw `specialDown_v01.png`, 1983x793, configured bodyHeight 204. Parent supplied a diagnostic pack with quantize 48 and a temporary-only head exemption; production strict pack did not pass. This audit inspects those diagnostic pixels, not a production-approved pack.

SHA256:

- Raw candidate: `59e8edafe8c4fca2515f0e3f6ef84689935d3ec0553059fbfc08b553ec9bf02a`.
- `diagnostic-sheet.png`: `4a4017337314a418522e883b166ad8eb6d03baf53d57dc212e4ece97a53784b5`.
- `diagnostic-anims.json`: `15c7af01079728873eb9a1df1f0995f180e88b3ce0a345a925f0beb30a4d4ff3`.
- Approved fixed title-style reference (v02 neutral/combat pair): `f7ae672771e9282f31e7804b02bb3f0ed46488618efd6050a4b864b2203dea42`.

Atlas is 4096x2816, 16 columns of 256px cells. Idle comparator is cell 0. Candidate f0–f3 are cells 115–118. Current size-r7 inbox directs Goku comparison against his own idle and flags size differences at 5% or more. The approved title-style neutral/combat pair was also visually inspected for identity, build and anatomical relationships; it is not substituted for the current rescaled idle as a numeric denominator. The production contract forbids using posed height as standing-body scale and requires full anatomy inspection.

## Evidence and measurements

[Every candidate and idle at equal density](contact-2x.png) is a 2x nearest-neighbor contact sheet, with a 24px native label band. No independent per-pose resizing. [Idle and f0 landmark grid](landmark-grid.png) is 3x nearest-neighbor with native y-coordinate lines every 16px. The atlas and metadata copied by the parent remain beside this report for exact reproduction: crop `(cell%16*256, floor(cell/16)*256, 256, 256)`.

Alpha bounds below are exact half-open cell-local bounds. They establish margins, not anatomical scale.

| Frame | Bounds x0,y0,x1,y1 | Occupied size | Finding |
|---|---|---|---|
| idle f0 | 55,28,205,241 | 150x213 | Working scale comparator |
| specialDown f0 | 85,58,175,241 | 90x183 | Torso, head silhouette and boots smaller |
| f1 | 85,58,176,241 | 91x183 | Same undersized body as f0 |
| f2 | 85,54,176,241 | 91x187 | Hair rises; body remains undersized |
| f3 | 82,58,178,241 | 96x183 | Slightly wider turn; same size failure |

Manual native-pixel indicators, approximate:

- **Torso:** idle lower-neck center approximately `(137,86)` to belt center `(129,123)` gives 37.9px. f0 approximately `(132,102)` to `(132,130)` gives 28px, about **0.74x idle (-26%)**. Garment/neck endpoints have about +/-3px uncertainty each; these are projected indicators, not skeleton measurements. The more upright candidate should not require the large shortening visible here. f1–f3 retain essentially the same collar-to-belt span (roughly 27–30px) and visibly reduced chest/gi width. This is a concrete scale concern beyond the unreadable skull probe.
- **Head:** hair-top-to-chin envelope is approximately 56px in idle and 41–43px in f0/f1/f3 (about 0.73–0.77x). f2's raised hair increases that envelope. These are hair-inclusive silhouette indicators only, with roughly +/-3px landmark uncertainty; hidden skull crown prevents a numeric anatomical head pass. Face/jaw and hair are also visibly reduced in the equal-density comparison.
- **Boots:** screen-right boot from trouser exit to sole is approximately 35–37px in idle versus 27–29px in the candidate (roughly 0.73–0.83x). Endpoint uncertainty is about +/-2px and cuff coverage differs, so this is supporting evidence rather than an independent skeletal ratio. Complete shafts/toes are present in every frame but visibly smaller.
- **Arms:** all four poses have connected shoulders, elbows, wrists and hands. Upper-arm and forearm volume is visibly reduced with the torso. The relaxed far arm is not the same projection as idle's bent arm; no defensible tight length ratio is claimed.
- **Legs:** baggy trousers hide hip/knee centers; narrower upright stance and idle's bent wide stance make silhouette-chain comparison misleading. Both legs taper coherently into boots, with no obvious dislocation. Full femur/shin lengths remain unmeasured, not passed within 5% or 6%.

A single accurate universal correction factor is **not** established by these manual indicators. Preserve the raw image and first examine import/body-height measurement and assembly. Repack a measured correction and re-audit the actual output. Do not choose a factor solely from overall sprite height or these approximate hair envelopes.

## Every frame and sequence

| Frame | Anatomy, pose and readability |
|---|---|
| f0 | Complete upright figure, right-facing three-quarter view, relaxed far arm. Near hand shows two raised fingers separate from the forehead, matching anticipation. No disconnected limb or clipping. Scale HOLD versus idle. |
| f1 | Fingers reach forehead; lowered eyelid/closed-eye intent reads. Far arm and both boots remain intact. Calm pose reads, but same torso/head/boot reduction: HOLD. |
| f2 | Forehead contact retained and far arm stable. Hair tip moves up about 4 packed pixels versus f1, exceeding the brief's nominal 1–2px lift; this is a minor motion deviation, not the principal hold. No new gross anatomy defect. Same body scale HOLD. |
| f3 | Eye opens and body/head turn slightly toward the opponent; forehead contact remains. The width change is compatible with turning, not evidence of recovered size. Same scale HOLD. |

Metadata: nonlooping, durations 80/80/160/90ms, phases 2/1/1. All four frames were inspected, including f3-to-idle comparison: returning to idle would produce a conspicuous size increase. This is frame-by-frame inspection; no browser playback, contact/hurtbox test, or runtime transition verification is claimed. The fingertips and closed/open eye distinction survive but have few pixels; the raw supplies clearer intent than the small diagnostic pack.

No occupied pixel touches a cell edge. Soles end at y240 in all candidates. No clipped hair, hand, boot or stray neighboring figure was seen. Identity (gold hair, orange gi, blue undershirt/sash/wristbands/boots) matches the reference. Internally the four frames are consistent; the failure is their scale relationship to idle.

## Disposition

**Technical HOLD for specialDown v01 as currently packed.** Inspect and correct measured import scale before considering another generation; then rerun strict packing and the final atlas anatomy review. Automatic probe failure remains separately unresolved. This report grants neither a production exemption nor user image approval. Production manifest, raw, approval records and public outputs were not edited by this auditor. Only report/evidence files in this audit directory were created; the parent supplied diagnostic atlas/metadata.
