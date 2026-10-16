# Gojo phase 2 production handoff v01

- Branch/worktree: `art/gojo-run` at `E:\Vibe Coding\Claude Code\gcdTourney\.worktrees\art-gojo-run`.
- Direction: K selected by the user as a direction only; none of these images is approved.
- Generation director: `gpt-6-luna`, medium; built-in image generation. Full per-call provenance is in [phase2_attempt_inventory_v01.json](phase2_attempt_inventory_v01.json).
- References: approved title-style, neutral and idle Gojo references only for identity/anatomy; K v01 was used as direction reference. Approved combat cell confirms R is near/camera and L is far.

## Candidate status

| Animation | Saved candidates | Calls | Status |
|---|---|---:|---|
| run | none; intended v13 | 3/3 | No v13 saved. Calls 2/3 did not provide the required mirrored second half; run v12 remains approved. |
| dash | v07, v08, v09 | 3/3 | All three preserved in `raw/_qa_hold/`. v09 passed strict packer gate but failed the independent Astra audit; no active candidate. |
| backDash | v05, v06 | 3/3 | Both preserved in `raw/_qa_hold/`; v06 failed head/feet scale gate. No active candidate. |
| superDash | v10, v11 | 3/3 | Both preserved in `raw/_qa_hold/`; call 3 was not saved, and silhouette target remains unmet. No active candidate. |

Dash v09 source/output SHA256: `56C50DC259FC60CE8D7791C7221F549B40E5E1ECDAB4155302FAABF563918727`.
Generation source: `E:/Vibe Coding/.codex/generated_images/01a142a9-86a5-7460-b08e-92a456bcdaaf/exec-4d3ee831-a0ed-4539-ae7d-d739ddebfd92.png`.

## Packing and measured review

Exact command: `node tools/pack-sprites.mjs gojo --quantize 48` — exit 0; dash v09 selected; 48-color atlas written. The actual packed atlas is `public/characters/gojo/sheet.png`, SHA256 `7CB18EB86F22FAAF9ABF05BEA18EC21C500CF51D1B7637B5CD4082B290C52252`.

Alpha bounds in the quantized atlas, all at 256×256 native cell scale: approved idle f0 is 103×231 px at x80..182/y10..240; dash f0 is 143×174 px at x54..196/y67..240; dash f1 is 134×174 px at x30..163/y67..240. Both dash soles land on y=240; the frames stay in the cell. These are posed envelope measurements, not skeleton-height or anatomy passes. Contact sheet and quantitative record: [dash_v09_contact_v01.png](../../../../../public/reviews/gojo-run-jkl/dash_v09_contact_v01.png) and [phase2_dash_qa_v01.json](phase2_dash_qa_v01.json).

The pack report also noted existing warnings: approved down v05 and ko v06 lying poses float above the floor line; light2#3 uses fallback hitbox. It reported 33 automatic scale-gate passes and 8 manual cases. These are not newly introduced by dash v09.

`npm run build` passed. Prebuild emitted the existing optional-animation-default warnings for Naruto, Sasuke, Killua and Gojo; no build errors.

## Audit and review state

- Independent `gpt-6-astra` / medium audit of actual atlas hash `7CB18EB86F22FAAF9ABF05BEA18EC21C500CF51D1B7637B5CD4082B290C52252` returned **HOLD**: slot 17 loses the near/right arm pump behind the torso; torso garment axis appears shortened versus approved refs; head shifts approximately 37 px across the loop. v09 is preserved at `raw/_qa_hold/dash_v09.png` (same candidate hash above). Its 3/3 generation budget is exhausted; no production strip is review-ready.
- Run v13, backDash v06 and superDash v11 are exhausted technical holds. Full reasons and all source/output hashes are in the attempt inventory.
- Review rows: [REVIEW_ROWS.md](../../REVIEW_ROWS.md). Public review page: [Gojo J/K/L and phase 2](../../../../../public/reviews/gojo-run-jkl/index.html).
- The public review page clearly labels the audited atlas as a technical hold and lists all unavailable strips. PR #102 is the existing branch PR; preview refresh is pending coordinator review of this commit. No merge, deployment, image approval or relay ring is claimed.
