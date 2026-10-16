# Sasuke round 4 calibration handoff — 2026-10-14

Status: **HOLD**. This is a calibration handoff, not an anatomy pass or art approval. Do not spend another generation call on the current evidence.

## Source and atlas identity

- Worktree: `.worktrees/art-sasuke-title-r3`, branch `art/sasuke-title-r3`, source HEAD `fe4dd88244444904ea4f8b8a24cc50cee69ad01f`.
- Selected source: `raw/superDash_v07.png`, SHA-256 `5f67a214dc6c4e8f680aa32083d83b0fe81f384add9bd68f53506407d6989a14`. This matches `production/round4/candidate-inventory.json`; source has two complete figures and both fists.
- Production sheet currently checked in this branch: `public/characters/sasuke/sheet.png`, SHA-256 `b2a847f90d261ccc20ecb801442b63150a0ab422ab6be2913ac29b6927aad0f4` (the existing production baseline).
- Quantized diagnostic candidate sheet: `production/round4/diagnostic-final/characters/sasuke/sheet.png`, SHA-256 `92fefb5770f429da4ce3cafbd70ee3a07b7f3eba26d51595cc438c081af92e50`. This matches both `final-candidates/atlas-metadata.json` and the independent Astra audit in `deliverables/round4-qa/astra-three-fighters_v01.md`.
- Candidate animation metadata SHA-256: `257fa279ea98b2bf37890743b7c64278561301384769f37fac0fd276444a0974`.
- Candidate inventory SHA-256: `Get-FileHash art/characters/sasuke/production/round4/candidate-inventory.json` can be rerun; its listed selected-source hashes and call counts are the controlling record.

## Reproduction and observed failure

The saved strict command was `node tools/pack-sprites.mjs sasuke --quantize 48 --no-writeback --json`; `production/round4/pack-final.json` and `diagnostic-final-pack.txt` preserve its result. The strict candidate pack exits 1 because the auto-head fit is outside the permitted range on `superDash` and the `jumpSquat` manual QA record applies to v03, not selected v06. The warning-only diagnostic atlas is complete, 48 colors, and is not a shipping pass.

For `superDash_v07`, the measured auto-head factor is 1.42, outside the packer's 0.75–1.33 range, so it clamps to 1.33. The diagnostic report says frame 0 clips 10 px and frame 1 clips 4 px at the right edge. Astra independently confirms both packed fists/forearms end at exclusive x=256 while both raw source fists are complete. This establishes a source-versus-pack placement/fit defect; it does not establish the lost limb lengths or prove an anatomical source failure. No numeric body pass is supported.

Other selected strips remain held: `jumpSquat_v06` has a low-confidence automatic head read and no current-version manual QA; `beamFire_v07` and `dash_v07` have sandal intervals that cross the ±6% boundary, with covered or projected torso and limb landmarks too uncertain for full-body certification. Retained `run_v05`, `airLight3_v07`, `specialUp_v09`, `hurtLow_v03`, and `airRecover_v01` remain inconclusive; do not convert garment-area warnings or uncertain landmarks into failures or passes. Detailed frame evidence is in `SEGMENT_AUDIT.md` and `deliverables/round4-qa/astra-three-fighters_v01.md`.

## Recommended Claude calibration work

1. Reproduce the source-to-cell transform for `superDash_v07` from the raw PNG and the exact candidate atlas metadata. Identify which measured fit, pivot/placement, or cell-bound constraint causes the clamped transform and right-edge clipping. Keep the raw source unchanged.
2. Evaluate a pack-supported calibration using Claude-owned body-height / frame-offset data or a justified tooling correction, with the current anatomy reference and contact requirements visible. Derive values from measured source and packed landmarks; do not choose a scale or offset by eye. Preserve both fist silhouettes and confirm active contact reach after quantization.
3. Repack to a fresh diagnostic output and report exact command, source and output hashes, per-frame opaque bounds, transform values, and hit/contact evidence. Then rerun strict packing. If the source cannot fit while preserving its measured anatomy and contact, document the evidence before deciding whether any new source call is justified.
4. Reassess `jumpSquat_v06` manual QA against that exact version. For `beamFire_v07` and `dash_v07`, record sandal endpoints and uncertainty at native atlas scale; leave full-body verdict inconclusive wherever covered joints prevent a ±6% interval pass.

Do not edit the raw sidecars, manifest `bodyHeight`, frame offsets, hitboxes, packer, or public atlas as part of this Codex handoff. All selected art remains unapproved and the production atlas remains the prior version.

## Remaining round-4 generation budget

From `candidate-inventory.json`: `superDash_v07` 3/3 used, 0 remaining; `jumpSquat_v06` 3/3 used, 0 remaining; `beamFire_v07` 3/3 used, 0 remaining; `dash_v07` 2/3 used, 1 remaining. The five retained suspects were not redrawn because the inspected evidence did not establish a robust failure; this handoff does not spend or reclassify budget. These counts are the round-4 recorded counts and make no claim about unknown earlier cumulative calls.
