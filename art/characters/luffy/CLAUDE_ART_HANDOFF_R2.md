# ENG-112 Luffy directional normals r2 handoff

Branch: art/normals-luffy-r2
Worktree: .worktrees/art-normals-luffy-r2
Base: current main at the Luffy first-batch merge/fixture re-record
Status: four new candidates are packed for user review; none is cleared for integration. No production pack or live stand-in changed.
Commits: 3abee4eb (candidate pack, review assets and records), 73d59999 (audit file-path correction)
PR: #214

## User review

Review page: https://gcd-tourney-38jigxvc2-eshin087s-projects.vercel.app/reviews/normals-luffy-r2/. It compares dTilt v04, uSmash v05, dSmash v03 and uair v02 from the exact packed cells with the previously user-approved drawings, live stand-ins and approved idle f0. dashAttack v02 has no new candidate after its three authorized calls; attempts 04–06 and the existing approved version are shown. The four new candidates are not yet approved; further dashAttack calls require a new user decision.

## Technical audit

GPT-6 Astra (medium) inspected all 28 candidate frames in a 4096 x 2816, 48-color whole-character diagnostic atlas against idle f0 and the approved neutral/combat cells at one density. Exact sheet SHA-256 f61ebe70fe7814f23861e3749f5d204b49fa6d7d7f0057995b88f0451e104c73; metadata SHA-256 da1dd7f86fa1d595d1f91beb7269dbbe3fb997a87520dc9e4c3c4084b25d5e24. See public/reviews/normals-luffy-r2/ASTRA_FINAL3_STRICT_AUDIT.md and the adjacent evidence.

- dTilt v04: clipping fixed; HOLD for matched-guard anatomy/transition consistency. Combat reference hat projection is larger than idle, so the difference does not alone prove skull enlargement.
- uSmash v05: HOLD; the return guard remains visibly smaller in torso, shorts and footwear. No exact rescale is supported.
- dSmash v03: HOLD; bilateral sweep is complete and inside bounds, but manual anatomy calibration, especially hidden thighs, remains unresolved. No redraw/shrink is prescribed by the evidence.
- uair v02: HOLD; phases [2,1,3] put only full-kick f2 in active and move retracting f3 to recovery. Anatomy consistency across rotated poses remains uncertain.

Visible endpoint uncertainty is about +/-3 px and segment uncertainty about +/-6 px. Hidden or strongly foreshortened anatomy is not numerically certified. No runtime contact/playback certification was performed. New hitbox overrides are version-bound to uSmash v05, dSmash v03 (both sandals) and uair v02; dTilt's automatically packed contact box follows the low extended shin/sandal. Claude owns contact/hurtbox integration.

The read-only PR guard ran with the documented GCD_SCRATCH_DIR override after the default E:\gcd-scratch was denied in this sandbox. It refused the four new raw versions because they are not user-approved, and refused their manual scale checks because Astra recorded HOLD. This is expected for a candidate review branch; do not merge or pack the new raws into production. The review preview is built from committed files only.

## Source inventory and user decisions

Relay #50 authorized one redraw round for dTilt, uSmash, dSmash and uair; relay #53 added dashAttack. The selected source copies are unchanged generator outputs: dTilt v04 from attempt05, uSmash v05 from attempt06, dSmash v03 from attempt06, and uair v02 from attempt05. Calls used: 3/3 for dTilt, dashAttack, uSmash and dSmash; 2/3 for uair. All old approved drawings and attempts remain preserved. Full provenance and source hashes are in art/characters/luffy/raw/ENG-112_R2_RECEIPTS.md.

The previously approved versions remain approved as drawings but stay on hold in raw/_qa_hold/: dTilt v02, dashAttack v02 plus its sidecar, uSmash v03, dSmash v02 and uair v01. The active live game remains on stand-ins for all five.

No user approval has yet been relayed for this round. Review all four new candidates against the old drawings and decide whether to approve each as drawn while accepting its technical hold. dashAttack has no candidate; keep the stand-in or issue a new redraw authorization. Any approval is visual only and does not clear the manifest's version-bound Astra holds.
