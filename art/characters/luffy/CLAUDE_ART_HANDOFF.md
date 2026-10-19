# Claude handoff — Luffy skills Batch 1

Relay lane `luffy-skills`, authorization #1. Branch `art/luffy-skills`. The user approved special v04, throw v01, gumArm v03, gumFist v01 and gumImpact v01 as drawn via Claude relay #2. This is visual approval only; do not treat it as technical or integration clearance.

## Batch 1 status

- `special_v04` is visually approved but on technical HOLD: the approved-art pack writes a 48-color sheet, yet maps it as 7/8, detects touching poses, reports f5/f6 clipping, and its `scaleManualQA` is still version-bound to approved v02. Luna found no measured crop/re-stitch that preserves the source and fixes this.
- `throw_v01` is visually approved but on technical HOLD: Astra inspected actual cells 90–93 and found the active forward arm ends at x221/x220, leaving 34/35 transparent columns before x255. Its head-probe values 1.72, 1.68, 1.68, 1.01 are suspect rather than evidence of enlarged anatomy. It misses the required pulled-back air wind-up. Calls 2 and 3 were unsuitable and unsaved. Budget is exhausted.
- `gumFist_v01` packs to four HD frames; visually approved.
- `gumImpact_v01` imports as 9 frames instead of 7; visually approved, technical HOLD. Calls 2 and 3 were unsaved because neither image met the seven-square-cell strip contract; its three-call budget is exhausted.
- `gumArm_v03` is visually approved, but has blank f0; `gumArm_v01`–`v02` were superseded and filed under `art/vfx/raw/_rejected/`. Three-call budget is exhausted and the procedural stand-in remains.
- `special_v03` was superseded by approved v04 and moved to `art/characters/luffy/raw/_rejected/`.
- Final Astra audit of the actual quantized atlas holds `special_v04` and `throw_v01`; exact cell findings, measurements, uncertainty and atlas hash are in the candidate inventory. The audit is complete, not pending.
- User decision via Claude relay `luffy-skills #3`: leave the untracked `art/vfx/frames/` folders in this worktree; do not delete them. They are to go when the worktree is archived after merge.

## Evidence and files

- Candidate inventory, imagegen paths, hashes and pack logs: [candidate-inventory.md](production/skills-revamp-batch1/candidate-inventory.md).
- User-facing candidate gallery: [Batch 1 review](../../../public/reviews/luffy-skills-batch1/).
- Review rows: `art/REVIEW.md`; manifest/tracker reflect the candidates and holds.
- `npm run body luffy special throw` reports no >12% body-area outliers, but B is advisory: special has an almost empty f2 and enlarged f5/f6; exact values and source pack evidence are in the candidate inventory. `npm run sprites vfx` writes the approved-art atlas but reports gumArm 1/2 and gumImpact 9/7. These outputs are diagnostic only.
- `npm run build` passed after approval bookkeeping. The exact quantized source evidence is preserved in `production/skills-revamp-batch1/quantized/`. PR #193 preview: https://gcd-tourney-mgfvxez55-eshin087s-projects.vercel.app/reviews/luffy-skills-batch1/.

## Next actions

1. Keep the five drawing approvals recorded; do not request them again. Visual approval does not clear technical holds.
2. Before integration, resolve the held strip/effect candidates only under a new authorized call budget; keep existing versions and call history intact.
3. Resolve the reported frame-count, segmentation, clipping and blank-frame issues only under authorized work. The user approved drawings, but no production integration or merge is authorized by this handoff. Preserve the untracked VFX frame folders until the worktree is archived after merge, per relay #3.
