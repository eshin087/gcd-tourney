# Gojo phase 3 run v13 handoff v01

- Branch/worktree: `art/gojo-run` at `E:\Vibe Coding\Claude Code\gcdTourney\.worktrees\art-gojo-run`.
- Status: **BLOCKED**. Part A was saved, but all three Part B results failed the required lead-leg alternation or generation call; no complete run strip exists. No stitch, strict pack, Astra audit, review preview, approval, or relay was performed.
- Model/generator: `gpt-6-luna`, medium; built-in `image_gen__imagegen`.
- Durable per-call ledger: [phase3_run_v13_attempt_inventory_v01.json](phase3_run_v13_attempt_inventory_v01.json). This includes the original three-call budget and the one additional user-authorized Part B call.
- User decision via Claude relay #5: **“Hold the run.”** No new Part B budget. Keep Part A and the held Part B attempt unchanged; the shipped Gojo run remains in the game. This is not image approval.

## Artifacts and attempts

| Call | Part | Result | SHA256 |
|---:|---|---|---|
| 1 | A, f0-f3 | Saved as `raw/_parts/run_v13_A.png`; source and output hashes match. Visual plausibility only; leg identity was not validated in a completed atlas. | `561951D6C1FE5DA76ABC3AEB5521EAC662572C9C0E31897019BD6037E18DD0CE` |
| 2 | B, f4-f7 | Discarded because it repeated A's lead-leg sequence; not copied into raw. | `89505143FBF0FA9D5FAF0C9798128649D72015288F45F9F4E0BF2086BB47F869` |
| 3 | B correction | Failed before generation: image tool could not read malformed reference path ending `\.worktrees\art\gojo-run\...`; no source or output returned. | unavailable |
| 4 | B, additional user-authorized call | Repeated A's contact/down/passing/flight lead-leg sequence. Preserved outside active raw parts at `raw/_qa_hold/run_v13_B_attempt02.png`; source and held output hashes match. | `1EC01513032CB9EDDCF0802BC1BE69CF03A53B880069039BD307BB030EC7F0DF` |

Part A remains preserved. No K_v01, J_v02, L_v02, or other production strip was changed. Do not treat Part A or the held B result as a complete run candidate. Work stops here by the user's hold decision; the current shipped Gojo run remains active.
