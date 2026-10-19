# Claude art handoff — ART-CHARGE Killua v15

## Status (2026-10-18 Pacific; relay charge #11)

Killua charge v15 is the user's next image review after Sasuke. The candidate is the unchanged 3×2 raw generation art/characters/killua/raw/charge_v15.png (SHA-256 eee81e7655d1d63a3223f45cc1e79c2c335983b05db77d01a71aeef6f018b108), approvedVersion remains 14 until the user responds. The review page is public/reviews/charge-killua/index.html; PR #212 is the review branch.

Merged main at 3b4ae71d, then packed Killua with node tools/pack-sprites.mjs killua --quantize 48 --keep-palette: complete 54-animation/253-frame sheet, 48 colors, charge cells 115–120 with loopFrom 2. Build passed with the local .codex/vite.mjs adapter. Astra post-merge recheck found raw, atlas, metadata, and all six decoded packed charge cells byte/pixel-identical to its prior exact audit, so the prior visual and registration findings remain bound to the current pack.

Astra's head and loop registration findings pass. The quantitative torso/limb segment certification remains a technical HOLD because joints are occluded/foreshortened and the configured garment palette misses the candidate's darker purples (B=.43–.45; alternate broad-purple diagnostic .931–.953). No redraw or rescale is justified by that metric. This technical hold does not decide the user's art approval. Do not alter the preserved version or make more image calls.

## Claude next

Review the user-visible drawing at https://gcd-tourney-5skrchi56-eshin087s-projects.vercel.app/reviews/charge-killua/ and the game preview https://gcd-tourney-5skrchi56-eshin087s-projects.vercel.app/?fight=killua,naruto&mode=solo&art=custom (hold Special for gather/loop). If the user approves, record approvedVersion 15, then check contact/floor behavior in game and merge/integrate. Do not treat Astra's technical HOLD as visual rejection; retain it unless new evidence resolves it.

Evidence: production/charge-v15/ASTRA_AUDIT.md, production/charge-v15/ASTRA_MERGE_RECHECK.md, and the packed review page.

---
# Claude art handoff — ENG-112 Killua normals

## Current status (2026-10-18; relay combat #24)

The user chose a two-branch ship order. This branch contains the first seven approved moves only: **fTilt v02, dTilt v02, dashAttack v02, fSmash v02, fair v02, bair v02 and dSmash v03**. The user visually approved the first six via relay #20 and dSmash v03 via relay #22. No new image approval is requested here.

The other three approved drawings remain unchanged under `raw/_qa_hold/` for the follow-up branch: uTilt v02, uSmash v02 and uair v02, along with their version-bound sidecars. Older v01 raws are held too because the packer otherwise selects them instead of the stand-ins. `raw/_qa_hold/README.md` records the follow-up scope. The manifest retains the user approvals and exact v02 probe exemptions; this first pack uses the game's existing stand-ins for those three moves.

## Pack and contact work

- Full-character repack: **51 animations / 230 frames**, 4096×3840 atlas, 48 colors. All existing character sources remain present; the three deferred moves are absent from this atlas and use fallbacks.
- Version-bound auto-head import sidecars remain on the seven shipped candidates: fTilt .939, dTilt .8576, dashAttack .8734, fSmash .9116, fair .9208, bair .834 and dSmash .8039.
- Contact overrides measured on the final quantized cells: fTilt f2/f3 boxes on the punching fist; bair f2/f3 on the leftward striking shoe; dSmash f3/f4 each have boxes for both low shoes. The measured-size markers prevent the packer from rescaling these final-cell boxes again.
- Review page and packed crops, including red-box active-frame overlays and stand-in comparisons: [public/reviews/normals-killua/ship-seven/index.html](../../../public/reviews/normals-killua/ship-seven/index.html). Crops are extracted from the current packed sheet. Atlas SHA-256 is recorded on the page.
- Final Astra import notes and remaining measurement limits: `production/ENG112_NORMALS_FINAL_IMPORT_AUDIT.md`. The seven moves had visual scale passes in that audit, not a five-segment numerical ±6% certification. The body-volume note on dSmash remains unresolved; the selected ship order includes this move, but no numerical five-segment pass is asserted.
- `node tools/pr.mjs check art/normals-killua` from main **passes** after merging main into this branch. Merge commit: `d8f197e1`; branch art commit: `d62a961c`.

## Claude's next action

Run the contact check on the seven shipped moves against their stand-ins, especially fTilt fist, bair rear shoe and both sides of dSmash. Check that the draw reaches contact at least as well as each stand-in and confirm the 51-animation pack has no integration regressions. The runtime contact check is not performed by this art branch. If it passes, Claude owns merge/integration; this branch is not merged or deployed yet. The branch worktree is `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-normals-killua`.

## Relevant approvals and hold history

- Relay #20: user approved fTilt, uTilt, dTilt, dashAttack, fSmash, uSmash, fair, bair and uair v02 as drawn.
- Relay #21: dSmash v02 not approved; one further three-call round authorized.
- Relay #22: user approved dSmash v03 as drawn.
- Relay #24: ship seven first; uTilt/uSmash/uair remain on stand-ins and continue in a second branch.

