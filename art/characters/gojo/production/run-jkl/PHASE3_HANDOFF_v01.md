# Gojo phase 3 run v13 handoff v01

- Branch/worktree: `art/gojo-run` at `E:\Vibe Coding\Claude Code\gcdTourney\.worktrees\art-gojo-run`.
- Status: **USER APPROVED v13; ASTRA TECHNICAL HOLD**. After the hold decision in relay #5, Claude stitched Part A plus held Part B attempt 02 without new calls, packed the candidate and prepared a review. User approved run v13 via relay #6: "Approve run v13". The accepted visual holds are same lead leg in both halves, near fist forward in every frame, and B half ~10 px lower; this is not a numeric anatomy clearance. Astra audit found a new f6 free-arm/fist disappearance at atlas slot 14; see `ASTRA_RUN_V13_AUDIT_v01.md` (report SHA256 `BA77A42F1EB2AE279B6F3E2FDFD373EB6FB0B2A502BC5BA7C1C07A72DE6D2445`, atlas SHA256 `610E84DC5972D2F810EC5114D4521E21282C3C4C87DFD89B0E92E9E8380B49D2`).
- Model/generator: `gpt-6-luna`, medium; built-in `image_gen__imagegen`.
- Durable per-call ledger: [phase3_run_v13_attempt_inventory_v01.json](phase3_run_v13_attempt_inventory_v01.json). This includes the original three-call budget and the one additional user-authorized Part B call.
- User decision via Claude relay #5 was **“Hold the run”**, with no new Part B budget. The later relay #6 approval supersedes that hold for the stitched candidate. All generation artifacts remain preserved; no new image calls were made for the stitch.

## Artifacts and attempts

| Call | Part | Result | SHA256 |
|---:|---|---|---|
| 1 | A, f0-f3 | Saved as `raw/_parts/run_v13_A.png`; source and output hashes match. Visual plausibility only; leg identity was not validated in a completed atlas. | `561951D6C1FE5DA76ABC3AEB5521EAC662572C9C0E31897019BD6037E18DD0CE` |
| 2 | B, f4-f7 | Discarded because it repeated A's lead-leg sequence; not copied into raw. | `89505143FBF0FA9D5FAF0C9798128649D72015288F45F9F4E0BF2086BB47F869` |
| 3 | B correction | Failed before generation: image tool could not read malformed reference path ending `\.worktrees\art\gojo-run\...`; no source or output returned. | unavailable |
| 4 | B, additional user-authorized call | Repeated A's contact/down/passing/flight lead-leg sequence. Preserved outside active raw parts at `raw/_qa_hold/run_v13_B_attempt02.png`; source and held output hashes match. | `1EC01513032CB9EDDCF0802BC1BE69CF03A53B880069039BD307BB030EC7F0DF` |

Run v13 is approved as drawn and packed on the branch, replacing the older run candidate for future integration. Technical HOLD: the f6 arm dropout is not among the user's accepted holds. Astra verified all eight atlas/GIF frames at 60 ms, but live browser playback timed out and remains unverified. Claude decides whether to correct or otherwise disposition the new defect; no art was edited during audit. No dashes were generated; their retries are a separate future item with their own budget.
