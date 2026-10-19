# Claude art handoff — ART-CHARGE Goku pilot

## Current status (2026-10-18; relay charge #3)

Goku charge v10 is the unchanged file copied byte-for-byte from `raw/_qa_hold/charge_v08_attempt03.png` (SHA256 `6317AF1187A981D7FD44DB59A9E5C0F5ED69356FE8D4F5571A9D3E7A8F6B6BE5`). No new image calls or pixel edits. ENG-117 is merged into this branch. The 48-color `--keep-palette` review pack contains 31 animations / 160 frames; charge frames are cells 86–91, durations `[70,90,110,110,110,110]`, `loopFrom: 2`. The exact pack hashes and audit are in `production/charge-v10/REGISTRATION.md`.

### Audit and holds

Astra qualitatively passes identity, pose intent, anatomy screening and approximate registration. Exact loop lock remains HOLD: f2-to-f3/f4/f5 floor-mask changes are 2/1/2 pixels, feet contours are within 1 px, and knee/hip region estimates are about 1 px high with ±1 px uncertainty. Body sheet B is `0.973, 1.164, 1.165, 1.189, 1.199, 1.184` (median `1.175`, advisory-high); exact segment measurements remain uncertain and Goku’s automatic head probe is unreliable. No `scaleManualQA` pass is recorded. Quantization has no obvious magenta halo or clipping. The timed lab route is linked but interactive playback was not independently checked because Windows browser automation could not confirm the browser URL; the review GIF shows f0, f1, four f2-f5 cycles, then pause.

Review page: `public/reviews/charge-goku/`. Local route: `/lab.html?p1=goku&p2=naruto`; match route: `/?fight=goku,naruto&mode=solo&debug`. Preview: pending `npm run pr -- preview`. This candidate is not approved and is not cleared for integration. Do not start another fighter before the user answers on Goku.

## Branch and preserved history

- Branch: `art/charge-goku`
- Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-charge-goku`
- Earlier rounds v06-v09 and their prompts/holds remain preserved under `raw/_qa_hold/`; this v10 is promoted from v08 attempt03 without modification.
