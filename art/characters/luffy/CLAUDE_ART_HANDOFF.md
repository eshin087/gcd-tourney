# Claude handoff — Luffy skills Batch 1

Relay lane `luffy-skills`, authorization #1. Branch `art/luffy-skills`. The user approved special v04, throw v01, gumArm v03, gumFist v01 and gumImpact v01 as drawn via Claude relay #2. This is visual approval only; do not treat it as technical or integration clearance.

## Batch 1 status

- `special_v04` is visually approved but on technical HOLD: the approved-art pack writes a 48-color sheet, yet maps it as 7/8, detects touching poses, reports f5/f6 clipping, and its `scaleManualQA` is still version-bound to approved v02. Luna found no measured crop/re-stitch that preserves the source and fixes this.
- `throw_v01` is visually approved but needs technical review: the initial unapproved pack probe read 1.07–1.21; the packed body sheet head ratios are 1.72, 1.68, 1.68, 1.01. It misses the required pulled-back air wind-up. Calls 2 and 3 were unsuitable and unsaved. Budget is exhausted.
- `gumFist_v01` packs to four HD frames; visually approved.
- `gumImpact_v01` imports as 9 frames instead of 7; visually approved, technical HOLD.
- `gumArm_v03` is visually approved, but has blank f0; `gumArm_v01`–`v02` were superseded and filed under `art/vfx/raw/_rejected/`. Three-call budget is exhausted and the procedural stand-in remains.
- `special_v03` was superseded by approved v04 and moved to `art/characters/luffy/raw/_rejected/`.

## Evidence and files

- Candidate inventory, imagegen paths, hashes and pack logs: [candidate-inventory.md](production/skills-revamp-batch1/candidate-inventory.md).
- User-facing candidate gallery: [Batch 1 review](../../../public/reviews/luffy-skills-batch1/).
- Review rows: `art/REVIEW.md`; manifest/tracker reflect the candidates and holds.
- `npm run body luffy special throw` reports no >12% body-area outliers, but B is advisory: special has an almost empty f2 and enlarged f5/f6; exact values and source pack evidence are in the candidate inventory. `npm run sprites vfx` writes the approved-art atlas but reports gumArm 1/2 and gumImpact 9/7. These outputs are diagnostic only.
- `npm run build` passed before approval bookkeeping; no test suite was run. The exact quantized source evidence is preserved in `production/skills-revamp-batch1/quantized/`. Final Astra review of the packed B1/B2 cells is pending.

## Next actions

1. Keep the five drawing approvals recorded; do not request them again. Visual approval does not clear technical holds.
2. Before integration, resolve the held strip/effect candidates only under a new authorized call budget; keep existing versions and call history intact.
3. Complete the Astra audit of the preserved actual quantized B1/B2 cells. Resolve the reported frame-count, clipping, blank-frame and scale issues before considering production integration. No production integration or merge is authorized by this handoff.
