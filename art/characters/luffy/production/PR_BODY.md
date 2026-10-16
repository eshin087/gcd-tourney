## Luffy core art calibration

This update adds a deterministic, source-based launched v02 calibration candidate and adopts the independently rechecked strict pack. It uses the intact original source with one measured uniform resample; it did not consume an image-generation call. The old undersized launched v01 remains preserved in `_qa_hold`.

### Pack and audit

- Strict `node tools/pack-sprites.mjs luffy --quantize 48 --no-writeback` exits 0: 20 animations / 93 frames, 48 colors, 4096×1536.
- Actual public atlas SHA-256: `563832d5fc499f860a5a35e21f8e576c3885b4e1a9c76bd7173807187707a996`.
- Actual metadata SHA-256: `7c4cee7a4817fc31f2546c0eb358ed4f9533dcf9fb75c5c4c977d84bac144c6a`.
- Astra rechecked all 93 actual quantized frames across 20 animations. The 18 prior version-bound body/scale passes remain supported; launched v02 also passes within measured uncertainty. Idle v01 remains the approved comparison reference.
- Build passed with the documented restricted-profile adapter. Parent browser QA verified the r4 timed player, native-size references and contacts, custom sprites in a local fight, and no captured console warning/error.

### Review and remaining holds

The proposed launched v02 review row and provenance are in `art/characters/luffy/REVIEW_ROWS.md` and `production/launched-calibration-r4/launched_v02-QA.md`. User design approval remains pending; Astra's technical pass is not image approval or runtime contact/grounding certification.

Three core moves remain excluded and held:

- `down v01`: f1 loses about 9px at the right edge and its floor contour is about 7px above the contact line. A future targeted source correction needs a narrower/reposed f1 with continuous floor contact; rigid translation cannot solve both width and grounding.
- `getup v01`: lying f0 loses about 6px left and 7px right and has an 8px floor gap; f3 is strongly foreshortened. A future five-pose correction needs a narrower/reposed f0 and continuous floor contact.
- `special v01`: selected source files have six complete action poses and two guard poses; requested f6/f7 recovery actions are absent. Its 3/3 source-call budget is exhausted; a focused two-frame correction requires a newly authorized budget.

The user's four accepted placement exceptions and Claude's separate beamFire arm continuation exception are recorded in the character-local review rows and gallery. No new generation call or user art approval occurred.

### Evidence

- Review gallery: `public/characters/luffy/calibration-r4/index.html`.
- Final Astra report and exact atlas binding: `art/characters/luffy/production/manual-audit-r3/LAUNCHED02_AUDIT.md`.
- Candidate source, measurement uncertainty and strict-pack provenance: `art/characters/luffy/production/launched-calibration-r4/launched_v02-QA.md`.
- Version rows and current status: `art/characters/luffy/REVIEW_ROWS.md`, `art/TRACKER.md`, and `art/manifest.json`.
- Parent browser evidence: `art/characters/luffy/production/PARENT_BROWSER_R4.md`.
- Strict output log: `art/characters/luffy/production/launched-calibration-r4/final-public-pack.log`.

This is a partial custom-art pack, not a complete fighter. Runtime contacts, held-move corrections, user image approval, integration and release remain separate steps.
