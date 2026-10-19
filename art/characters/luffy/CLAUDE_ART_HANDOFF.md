# Claude handoff — Luffy skills Batch 1

Relay lane `luffy-skills`, authorization #1. Branch `art/luffy-skills`. No new image is user-approved; do not integrate or promote the candidates based on this handoff.

## Batch 1 status

- `special_v04` is the selected Pistol drawing candidate, but technical HOLD: `node tools/pack-sprites.mjs luffy --quantize 48 --keep-palette` splits it as 7/8, detects touching poses, and reports f5/f6 clipping. The manual scale record still applies to approved v02 only. Luna found no measured crop/re-stitch that preserves the source and fixes this. No character atlas/body sheet was produced; no Astra review was possible.
- `throw_v01` is held: the packer's head probe reads 1.07–1.21, and it misses the required pulled-back air wind-up. Calls 2 and 3 were unsuitable and unsaved. Budget is exhausted.
- `gumFist_v01` packs to four HD frames; remains unapproved.
- `gumImpact_v01` imports as 9 frames instead of 7; technical HOLD.
- `gumArm_v01`–`v03` all have blank f0; preserved in `art/vfx/raw/_qa_hold/`. Three-call budget is exhausted and the procedural stand-in remains.

## Evidence and files

- Candidate inventory, imagegen paths, hashes and pack logs: [candidate-inventory.md](production/skills-revamp-batch1/candidate-inventory.md).
- User-facing candidate gallery: [Batch 1 review](../../../public/reviews/luffy-skills-batch1/).
- Review rows: `art/REVIEW.md`; manifest/tracker reflect the candidates and holds.
- VFX pack command succeeded with candidate output; the Luffy pack gate failed. `npm run build` passed. No test suite was run.

## Next actions

1. Ask the user through the Claude approvals desk to review the gallery and decide what, if anything, to approve visually. Visual approval does not clear these technical holds.
2. Before any integration, correct or replace the held strip/effect candidates under a new authorized call budget; keep existing versions and call history intact.
3. Re-run the Luffy pack gate and body sheet, then have Astra audit the actual quantized B1/B2 cells. Re-pack VFX and inspect exact frame counts. No production integration or merge is authorized by this handoff.
