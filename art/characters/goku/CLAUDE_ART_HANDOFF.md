# Claude art handoff — ART-CHARGE Goku pilot

## Current status (2026-10-18; relay charge #1)

The Goku pilot has no reviewable candidate yet. Four generation rounds (v06–v09) were attempted with the required Luna/medium routing; all were stopped within their per-image limits and preserved under `raw/_qa_hold/` with exact prompts, source hashes and QA in each `charge_vNN_HOLD.md`. The best outputs read as Goku and show a clear gather/release, but every held-loop image drifts by roughly 30–44 px between f2–f5, far beyond the 2 px loop lock. Several outputs also have painterly/antialiased detail and a nonuniform near-magenta background. v07's measured stitch visibly shrank its hold frames. A scripted composite was assessed for v09; uncertain masks across painterly outlines and gradients make it unsafe to preserve the required hard-pixel art and isolate only hair, hems and mouth. No `raw/charge_vNN.png` candidate, manifest/REVIEW/TRACKER row, pack, registration sheet, body sheet, lab loop, Astra audit, or review page was created.

## Engine dependency

`loopFrom` was absent from `tools/pack-sprites.mjs` and the game when this task started. ENG-117 is needed before a six-frame `charge` can be packed and displayed with f0–f1 once and f2–f5 held. No pack was attempted.

## User decision needed

The four attempted rounds exhausted their limits without a technically usable candidate. Pause here for user direction through relay lane `charge`: either authorize a fresh bounded generation round with a revised approach, or hold the Goku pilot while Claude revises the production method. Do not start another image round or begin another fighter until that answer arrives. The existing Goku art and approved v05 remain unchanged.

## Branch and evidence

- Branch: `art/charge-goku`
- Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-charge-goku`
- Source attempt and QA ledger: `raw/_qa_hold/charge_v06.png`, `charge_v07_HOLD.md`, `charge_v08_HOLD.md`, `charge_v09_HOLD.md`, and their referenced attempt images.
- User image review: not ready; there is no candidate to approve.
- Claude next: after the user's direction and, if continuing, once a technically usable candidate exists and ENG-117 is on main, run the engine-supported pack/integration checks. Codex has not merged or deployed anything.
