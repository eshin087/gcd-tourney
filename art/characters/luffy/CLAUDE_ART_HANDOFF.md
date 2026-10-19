# ENG-112 Luffy directional normals handoff

Branch: `art/normals-luffy`  
Worktree: `.worktrees/art-normals-luffy`  
Commits: `4095b72c` (generation and raw candidates); `0573ffd6` (review page and audit); `2993e98c` (preview handoff); `2d25d155` (tracker); `2134489a` (relay #49 approvals and superseded-version preservation)

## User review

Review page: `https://gcd-tourney-53e4uypi7-eshin087s-projects.vercel.app/reviews/normals-luffy/` (`public/reviews/normals-luffy/index.html`). It shows all ten latest packed candidates beside the current live stand-ins and approved idle f0. The user approved all ten drawings as drawn via Claude relay combat #49: fTilt v01, uTilt v02, dTilt v02, dashAttack v02, fSmash v02, uSmash v03, dSmash v02, fair v03, bair v03 and uair v01. Four have version-bound Astra visual/scale PASS records; six remain technical holds and should stay on their stand-ins.

The attached review atlas is diagnostic only: 4096×3072, 178 frames, 48 colors, `scaleGate: warn`. Its exact hashes and frame-by-frame findings are in `public/reviews/normals-luffy/ASTRA_FINAL_AUDIT.md`. Astra rechecked every one of the 70 selected frames against idle and live same-kind strips. Four version-bound `scaleManualQA` PASS records exist in the Luffy manifest for fTilt v01, fSmash v02, fair v03 and bair v03. Visible endpoint uncertainty is recorded there; hidden/foreshortened anatomy is not numerically certified. This is not a strict production gate pass or runtime contact check.

## Candidate and source inventory

The current packed candidate versions are fTilt v01, uTilt v02, dTilt v02, dashAttack v02, fSmash v02, uSmash v03, dSmash v02, fair v03, bair v03 and uair v01. Older versioned candidates and all generator attempts are preserved. `raw/_qa_hold/ENG-112_RECEIPTS.md` contains source hashes, output IDs, prompts and per-move call inventory; the accidental fSmash/bair filename-copy incident is documented there and the original attempt02 sources were restored. Do not repeat generation calls: fTilt, dashAttack, fSmash, uSmash, dSmash, fair, bair and uair have exhausted their three-call budgets; uTilt/dTilt have no further call authorization from relay #47.

The diagnostic selected-version map is in the review page and audit. fSmash v02 has a version-bound uniform `frameOffsets: [-7,0]` sidecar across nine frames; fair v03 has uniform `[-18,0]` across six. These are measured import-only placements, with no source pixel changes or body rescale. The character-level pack scale is 0.92 per the existing approved Luffy size decision.

## Integration boundary

The branch's existing live pack remains unchanged; candidates are shown from a separate diagnostic atlas under the review page. Relay #49 approvals are recorded in REVIEW.md, manifest and TRACKER; older superseded versions are preserved under raw/_rejected/. Run the strict `node tools/pr.mjs check art/normals-luffy` and produce a full-character production pack only if the strict gate clears every selected strip. The four visual/scale PASS records and six technical HOLDs remain separate from drawing approval. Claude owns runtime contact/hurtbox review and integration/merge. In particular, bair's runtime hitbox direction has not been certified. No branch merge, main edit or production change has been made.


## Relay #49 approval and strict check

All ten exact versions above are user-approved as drawn via Claude relay combat #49; `approvalSource`, `approvedVersion`, `art/REVIEW.md` and `art/TRACKER.md` record the quote. Older reviewed candidates were preserved in `raw/_rejected/`. The preview was refreshed after approval at the link above.

`node tools/pack-sprites.mjs luffy --quantize 48 --dry-run --strict-scale` confirmed the four existing version-bound manual QA passes and refused to write because uTilt v02, dTilt v02, dashAttack v02, uSmash v03, dSmash v02 and uair v01 remain unmeasured technical holds. The report also shows clipping for dTilt f2, dashAttack f2/f4 and dSmash f2/f3. `node tools/pr.mjs check art/normals-luffy` cannot validate the approvals against the merge tree yet: the stale branch conflicts in `art/manifest.json` and `art/TRACKER.md`, so the checker reads no merged approval map and reports all ten as unapproved in addition to the strict scale findings. No production atlas was written. Claude must resolve the integration conflict and technical holds before merge; runtime contact review remains open.
