# Luffy charge redraw handoff

## ART-CHARGE v02 blocked (2026-10-18)

The user authorized Luffy after approving Goku charge v10 via Claude relay charge #4. The three-call budget is exhausted. Call 1's returned path was lost by the imagegen wrapper and counted; call 2 was saved then held because it was a 3x2 grid; call 3 was a 3:1 strip with soft contours and nearly static f2-f5, so it was not saved into the project. Exact hashes and output paths are in `production/charge-v02-attempts/ATTEMPTS.md`. The call-2 image and hold reason are in `raw/_qa_hold/`.

No manifest, REVIEW, TRACKER, ANIMATIONS, pack, review page, PR, or art approval update was made for an unusable candidate. The currently approved charge v01 remains in force. Because v02 exists in `_qa_hold/`, a new candidate requires v03. Awaiting user decision: authorize a fresh three-call budget for Luffy v03, or skip Luffy and continue the ordered fighter list at Naruto. No other fighter has been started.

Claude's technical note relayed in charge #5: merge current `main` into this worktree before any future pack. If Luffy's head probe is marked manual in `builds.json`, or strict scale fails on an unreadable pose, obtain Astra's version-bound `scaleManualQA` using rigid landmarks (feet, wristbands, boots/sandals) before ringing for image review. Claude owns `public/det`; these instructions do not change the pending user decision or authorize more generation calls.
