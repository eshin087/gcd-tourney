# ENG-112 Luffy directional normals handoff

Branch: `art/normals-luffy`  
Worktree: `.worktrees/art-normals-luffy`  
Commits: `4095b72c` (generation, versioned raw candidates, receipts and packed review-frame extraction); `0573ffd6` (review page and audit records)

## User review

Review page: `https://gcd-tourney-2s44u8pip-eshin087s-projects.vercel.app/reviews/normals-luffy/` (`public/reviews/normals-luffy/index.html`). It shows all ten latest packed candidates beside the current live stand-ins and approved idle f0. Four candidates are technically ready for the user's drawing decision: fTilt v01, fSmash v02, fair v03, bair v03. Six remain technical holds and should stay on their current stand-ins: uTilt v02, dTilt v02, dashAttack v02, uSmash v03, dSmash v02 and uair v01. No drawings are user-approved yet.

The attached review atlas is diagnostic only: 4096×3072, 178 frames, 48 colors, `scaleGate: warn`. Its exact hashes and frame-by-frame findings are in `public/reviews/normals-luffy/ASTRA_FINAL_AUDIT.md`. Astra rechecked every one of the 70 selected frames against idle and live same-kind strips. Four version-bound `scaleManualQA` PASS records exist in the Luffy manifest for fTilt v01, fSmash v02, fair v03 and bair v03. Visible endpoint uncertainty is recorded there; hidden/foreshortened anatomy is not numerically certified. This is not a strict production gate pass or runtime contact check.

## Candidate and source inventory

The current packed candidate versions are fTilt v01, uTilt v02, dTilt v02, dashAttack v02, fSmash v02, uSmash v03, dSmash v02, fair v03, bair v03 and uair v01. Older versioned candidates and all generator attempts are preserved. `raw/_qa_hold/ENG-112_RECEIPTS.md` contains source hashes, output IDs, prompts and per-move call inventory; the accidental fSmash/bair filename-copy incident is documented there and the original attempt02 sources were restored. Do not repeat generation calls: fTilt, dashAttack, fSmash, uSmash, dSmash, fair, bair and uair have exhausted their three-call budgets; uTilt/dTilt have no further call authorization from relay #47.

The diagnostic selected-version map is in the review page and audit. fSmash v02 has a version-bound uniform `frameOffsets: [-7,0]` sidecar across nine frames; fair v03 has uniform `[-18,0]` across six. These are measured import-only placements, with no source pixel changes or body rescale. The character-level pack scale is 0.92 per the existing approved Luffy size decision.

## Integration boundary

The branch's existing live pack remains unchanged; candidates are shown from a separate diagnostic atlas under the review page. After the user's relayed decisions, update approvedVersion/statuses, hold rejected or superseded raws as the art rules require, then run the strict `node tools/pr.mjs check art/normals-luffy` and produce the full-character production pack. Claude owns runtime contact/hurtbox review and integration/merge. In particular, bair's runtime hitbox direction has not been certified. No branch merge, main edit or production change has been made.
