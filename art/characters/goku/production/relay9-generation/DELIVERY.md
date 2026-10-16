# Goku relay 9 delivery record

- Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-goku-core`
- Branch: `art/goku-core`
- Pull request: #123
- Art/audit commit: `1a0b198d` (`art(goku): relay9 heavy and light3 repairs`)
- Preview build commit: `1a0b198d`
- Preview: https://gcd-tourney-4hfbyo2rn-eshin087s-projects.vercel.app
- Direct calibration gallery: https://gcd-tourney-4hfbyo2rn-eshin087s-projects.vercel.app/characters/goku/calibration-r4/index.html

## Result

The strict real-input 48-color pack exited 0 and reproduced the Astra-audited sheet SHA-256 `f117d996d5d9f225b13bfc6d7b19a741e603fa04a329b1410422263eadd824f2` and metadata SHA-256 `2ee25e2a2103a145f1a888700b5e55cd19ddb0fd7a755649f1056226e6fdbbd6` at 22 animations / 101 frames. Parent browser QA passed the gallery scale, image loading, phase stepping, one-shot/loop playback and local game-load smoke checks; exact results are in `PARENT_BROWSER_R4.md`.

Relay 9 used exactly one new generation call each for light3 and heavy, the fifth cumulative call for each. No further image calls occurred. light3 v11 remains on hold: its 256px diagnostic clips 800 foreground-mask pixels, and it is excluded; the roomy same-density companion is preserved. heavy v14 passed the exact final atlas anatomy/scale audit at uniform .720, bodyHeight235, x1. The user approved heavy v14 via Claude relay #10 on 2026-10-16 with the quote "Approved"; manifest approvedVersion is 14. The light3 source path was recovered from the exact generator session and call time window after the wrapper omitted `output_hint`; the original output hint was not captured. See `GENERATION_LEDGER.md` and `light3-call05-recovery-receipt.json`.

The hosted calibration page is for review. Runtime contacts/timing and full gameplay behavior remain outside the completed QA; the getup floor/contact warning is documented for Claude. No tests, merge, or production deployment were performed.

## Hosted verification

Parent authenticated fetch verified the hosted sheet and metadata bytes against the exact hashes above. Hosted HTML reports the heavy14 PASS / user-approved state, light3v11 HOLD/excluded state and 101-frame count. Browser navigation reaches Vercel login, so hosted interactive rendering was not verified; local interactive QA passed.

## Relay #10 user approval

The user approved exactly Goku heavy v14 via Claude relay #10. Exact quote: "Approved". light3 v11 remains technical HOLD/excluded; no sixth call is authorized.
