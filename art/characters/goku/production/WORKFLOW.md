# Goku production: diagnose before spending a redraw

Adopted for the user's 2026-10-15 request to improve the workflow and resume. Applies to this fighter's resumed batch. This reduces avoidable retries; it cannot guarantee that every generated pose is usable. Existing call budgets and user approvals still apply.

## What went wrong

Three different problems were being treated as drawing failures:

1. Commit 441b2910 accidentally serialized the entire production manifest and appended a literal backslash-n. The packer fell back to template values. Claude repaired it at 728fa9d7. Production manifest edits must preserve formatting and other character blocks; parse the edited file and compare the changed values before packing.
2. The assembly script chose `min(240 / tallest, 248 / widest)` independently for each strip. That makes the size of the character depend on the pose. The packer then normalized those strips again to template `bodyHeight` values. Guard, for example, used a second factor about 0.828; light2 used 0.850. A broad kick and a crouch must not define the anatomical scale.
3. The automatic head detector is not reliable for this gold palette. The unchanged approved idle itself reads 0.50–2.667 across its eight frames, with a median detected region of 6x10px. The fragment measurements cannot establish whole-head drift. `preflight-v01/measurement-controls.json` reproduces this independently of any candidate redraw.

There are also real defects. Astra found severed/stray arms in light3, cell/pivot clipping in several attacks and reactions, and a stance snap in charge. Calibration and measurement repair will not fix those automatically.

## Required sequence

Before a large new batch, prove this sequence on a planted pose and an extended or airborne pose. Claude calibrates those pilots and Astra inspects their final packed pixels first. A failed control or uncertain measurement pauses expansion of that failure pattern; it does not spend the remaining batch budget. For this existing batch, salvage retained sources while the measurement/tooling work proceeds.

1. **Freeze inputs.** Record approved reference hashes, exact selected source/candidate/sidecar versions, cumulative calls (failed calls included), source dimensions, frame count, layout and crop rectangles. Save the exact returned generator path, copy its bytes into the fighter's source folder, and hash them before any further image call. A missing path is a recovery task, not authorization to repeat the call. Reassembly never resets the image budget. Diagnostic inventories are immutable snapshots, not additional production candidates.
2. **Validate the measurement.** Parse the production manifest without fallback. Check the approved idle against itself and known 0.8x/1.0x copies. Inspect the actual regions the detector marked. A fragmented, occluded or unstable region is a measurement hold; it must not automatically trigger a redraw or a pass. Claude owns detector/palette fixes.
3. **Calibrate original sources.** Measure at least two usable body landmarks against the approved idle and title cells: boot-top to sole along the boot axis, collar to belt, eye to chin, visible belt width, or unforeshortened forearm. Record endpoints, units, pose limitations and uncertainty. Reliable landmarks must support one common factor; if they disagree, investigate anatomy/projection rather than average away the difference. Hair-inclusive bounds and total posed height are recorded separately.
4. **Assemble once.** Use one measured source-to-native factor per source or genuinely separate source part. Keep all figure pixels. Never choose a factor from the largest pose, rescale each frame to fit, or stretch body parts. Roomy raw panels may preserve overflow; the eventual 256px cell and pivot must be shown as guides. Report overflow at the intended density. Record every new calibration image as a new version.
5. **Inspect the whole motion.** Put idle f0 and the approved neutral/combat beside every resulting frame at one density, with guides at idle top and y240. Inspect segment lengths, clothing volume, connected limbs, strike direction and first/last frame relationships. Timed playback and runtime transitions come after calibrated packing. A source contact sheet cannot certify the packed atlas.
6. **Route each failure.** Bad segmentation goes to recutting intact sources. A second normalization, palette misread or anchor issue goes to Claude calibration/tooling. A visibly malformed limb, irrecoverable missing pixels or wrong pose is a source repair. Spend a generation call only for a documented source defect, within the remaining authorized budget, with the affected frame and intended correction named first.
7. **Pack and audit final pixels.** Claude sets measured `bodyHeight`, placement/contact data and any narrowly justified version-bound manual check. Run the unchanged strict gate. Astra checks all frames and loops of the resulting quantized atlas against the approved reference cells; a passing head number alone is insufficient. Retain the user's image/design gate.

## Resumed work

The Goku batch resumes by reassembling existing sources, with no image calls, as requested in Claude's inbox section dated 2026-10-15. Guard and light2 are the calibration pilots. The remaining coherent drawings follow their measured-source procedure. Clipping/source/motion holds retain their exact evidence and approvals; an approval of the drawing does not certify a new pack.

The earlier `scaleManualQA: pass` entries for launched06/down04/getup03 were based on a raw contact sheet. Astra found that evidence insufficient for actual packed pixels. Claude must supersede those records during calibration; this workflow does not add any exemption or approval.

## Reproducible evidence

Run from the Goku task worktree; each run needs a new output directory:

```powershell
node art/characters/goku/production/preflight.mjs art/characters/goku/production/preflight-v02
node art/characters/goku/production/preflight-view.mjs art/characters/goku/production/preflight-v02
node art/characters/goku/production/preflight-controls.mjs art/characters/goku/production/preflight-v02
```

The selected version map inside `preflight.mjs` is deliberately explicit; update it only after reviewing the new candidate inventory. The fixture copies source pixels without altering them. It runs strict reports first, then uses a separate warn-only diagnostic manifest to render held pixels for inspection. The native-control experiment changes occupied-height normalization in that isolated fixture only; it is not the measured reassembly or a release fix. `complete: true` in a diagnostic atlas means source coverage only.

Evidence: `preflight-v01/inventory.json`, `measurement-controls.json`, `comparison.json`, the 23 paired contact sheets, and `preflight-v01/astra/AUDIT.md`. All 23 animations / 108 frames are represented. No source generation, production manifest change, approval, merge or deployment is implied by these diagnostics.
