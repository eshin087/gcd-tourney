# Claude art handoff — ENG-112 Killua normals

## Status

**Blocked for technical correction and a user scope decision. Do not merge or ship the selected v01 strips.** The worker branch is `art/normals-killua`; the full Killua source inventory is present. Whole-character live pack output remains the complete 44-animation / 181-frame pack. The ten unapproved v01 candidates remain in the manifest as `raw` and do not appear in that live atlas.

The branch includes a diagnostic review page at `public/reviews/normals-killua/index.html`. It compares every packed candidate frame and cycle with the current fallback strip and approved idle. The crops came from a separate 48-color whole-character pack with a temporary manifest and are marked technical holds. All original generated attempts remain under `raw/_qa_hold/`; selected v01 files are copies of their chosen attempts. All moves used their 3/3 calls. No new generation calls remain authorized by the current batch.

## Verification and audit

- `npm run pr -- art killua`: restored / verified all 305 tracked Killua raw files in the task worktree.
- Whole-character pack before candidate selection: 44 animations / 181 frames; `packer: 2`.
- Diagnostic candidate atlas: 54 animations / 251 frames; all ten moves split to 70 frames (fSmash uses a versioned `split: even` sidecar). Diagnostic atlas SHA-256 `b9b99d8812d7cdb1f38e96bc5143fd2f1d4666b47a595dcb1ace041deecef130`.
- `node tools/pack-sprites.mjs killua --quantize 48`: failed the automatic scale gate for all ten candidates; did not write the candidate character atlas. The previously packed full character remains in `public/characters/killua/`.
- GPT-6 Astra medium inspected all 70 actual quantized candidate frames. All ten are HOLD. The detailed per-move findings, uncertainty and limitations are in `production/ENG112_NORMALS_AUDIT.md`; exact H/F frame metrics and atlas metadata are in `production/ENG112_NORMALS_METRICS.json`.
- Known issues include detached hand fragments (uTilt), clipped active frames (dTilt, dashAttack, fair), overlapping neighboring figures/severed legs (fSmash), body/head mismatch not repairable by a measured uniform scale (dSmash and others), and incorrect automatic head selection for uair f2/f3. Full body segment measurements within ±6% remain unverified. The source contours are smooth/illustrated, not verified as hard-pixel style.
- No runtime contact check was run; the strips are not ready for that check.

## User decision requested

The review page is for a **decision**, not image approval. Please ask the user whether to authorize a new, explicit correction-generation budget for the held moves, or keep the current stand-ins and continue to Gojo. Exact v01 versions and the page are in `art/REVIEW.md`. No strip has been visually approved.

## Integration notes

- The diagnostic output is temporary evidence only; do not replace `public/characters/killua/` with it.
- Do not apply uniform packScale based only on the packer's pre-quantization head proxy: Astra found disproportional head/body and/or clipping on every strip. `bair` is the strongest measured-scale trial but still lacks body parity evidence.
- Existing candidate assets, sidecar, review page, full pack updates, manifest, tracker and review rows are committed on this branch.
- This branch is not ready for `npm run pr -- check art/normals-killua`, approval, or merge. Re-enter after the user decision; if new calls are authorized, keep each old v01 and attempt unchanged and allocate the new version per the chosen scope.
