# Luffy charge redraw handoff

## ART-CHARGE v02 approved (2026-10-18)

The user approved Luffy charge v02 via Claude relay #6, exact quote: “Approve v02 as drawn”. No new calls or pixel changes were made. The 3x2 candidate was moved byte-identically from `_qa_hold` to `raw/charge_v02.png` (SHA-256 `69e94d35c8e7832f5a08104e93a7fd61d1268ecdb1e491678396403522c2dd5`). The three-call budget is exhausted; call 1's returned path was lost by the imagegen wrapper and counted, call 2 produced the selected user-approved drawing, and call 3 produced a non-selected 3:1 strip with soft contours and nearly static f2-f5. Exact hashes and paths remain in `production/charge-v02-attempts/ATTEMPTS.md`.

Image approval is recorded in `art/REVIEW.md`, the Luffy manifest entry, `art/TRACKER.md` and `ANIMATIONS.md`. Current main is merged into this worktree. Pack with `--quantize 48 --keep-palette`, inspect registration/body sheets and lab playback, then obtain Astra's packed-loop audit. If the probe is manual in `builds.json` or strict scale fails on unreadable poses, Astra must record version-bound landmark `scaleManualQA` using rigid parts (feet, wristbands, boots/sandals) before the Claude handoff. Claude owns `public/det` and the in-game check/merge. After technical evidence is committed, ring charge (no `--for user`) for Claude; then begin Naruto according to the ordered inbox instruction.

Claude's technical note relayed in charge #5: merge current `main` before packing (done in this worktree at merge commit recorded in Git history). Claude owns `public/det`.
