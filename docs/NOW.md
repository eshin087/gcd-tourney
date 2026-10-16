# NOW: what's happening and what you do next

_Updated by Claude (integration coordinator), 2026-10-12: **the title-style cast is live** at
https://gcd-tourney.vercel.app (production dfab2fb, PR #69-72 and the spot-dodge fix #77 merged). It is the
preview you approved, pixel for pixel, including seven stand-ins that Codex's round 3 will replace. Two of them carry
a recorded size exception: Killua's charge (head 8% small) and Naruto's spin (head 12% big). ART-TECH-01 stays
paused._

## Your next actions

**Beam clash art Round 2 (2026-10-15):** Codex generated Sasuke/Killua/Gojo ground and air v01 candidates plus Naruto `beamStruggle_v02` after your relayed “Redraw v02” decision. All remain technical holds: strict scale failures on four strips; Naruto v02 body area is 60% of idle; hand checks and the required Astra audit are incomplete. No review page or approval request exists. Claude has been notified through the beam-clash lane and must coordinate the technical/audit path before asking you to review images. See the newest beam-clash handoff in [CLAUDE_ART_HANDOFF.md](agents/CLAUDE_ART_HANDOFF.md).

**One place to answer (2026-10-15, ADR 0039, PR #117):** every approval and decision now comes to the Claude chat **"0 - Approvals"** (pinned while something waits, plus a phone notification). Other Claude chats and Codex lanes queue their questions there instead of asking you. `npm run status` opens with "Needs you now". It is also the one central chat: say "status" there for the overview, or "tell the <x> chat ..." to reach a Codex chat. The Codex "0 - G" control chat and its monitor are retired (you can archive 0 - G). After deleting chats: name a Claude chat `0 - Approvals` and type `/approvals`.

**Goku/Luffy workflow repair: waiting for Claude (2026-10-15).** No user action yet. Goku has two provisional calibration pilots (ec37e3ae), four disputed beam trials held, and18 strips still to reassemble. Luffy's new light1v02 and winv03 (5f0bbf66, PR #96) are filed with technical holds; the recovered special source is unusable. Claude must validate the scale measurements, calibrate final packs and provide an updated review preview before the next audit/approval. The historical preview does not contain these new candidates. See the newest [handoff](agents/CLAUDE_ART_HANDOFF.md); no more redraw calls are running.



**Online play, determinism spike done (2026-10-15, PR #109 + #115, ADR 0036, ENG-090):** your iPhone and Chrome now compute the same fight frame for frame (deterministic math + the camera/clock fixes in the test). Live and matching: https://gcd-tourney.vercel.app/?det=naruto-sasuke-s7 and https://gcd-tourney.vercel.app/?det=gojo-killua-s3. Nothing to do; next is ENG-091 (the simulation fixes for real) when you want online work to continue.

**Sasuke v03 art approved (2026-10-15, effects relay #6):** the user approved Kirin `ui_super_fg v03` and Amaterasu `ui_ult_fg v03` via Claude despite Astra holds. The approved art is packed in the live PR #111 preview at commit `4da6f6b6`: [review gallery](https://gcd-tourney-enuuc9gcz-eshin087s-projects.vercel.app/reviews/super-art-sasuke-r1/) and [in-game demo](https://gcd-tourney-enuuc9gcz-eshin087s-projects.vercel.app/?fight=sasuke,sasuke&mode=solo&level=hard). The gallery keeps Astra's findings: Kirin's eyes remain relatively open/round and chin slightly elevated; Amaterasu's connected eye motif is faint at fit and blood remains under the uncovered eye. Both budgets are exhausted at 6/6 cumulative. Claude is next for integration and final in-game review; nothing is waiting on you in this art task.

**Effects and ground live (2026-10-15):** you approved after the demo; PR #108 (natural ground damage) and PR #113 (super banner, ultimate splash, Sharingan) are merged and on https://gcd-tourney.vercel.app. Nothing to do.

**Sasuke art history:** v01 foregrounds were rejected and archived; v02s were superseded and archived after the v03 redo. No foreground is approved or packed; no production deploy has been made for this art branch.


**Automatic handback rule (2026-10-15, OPS-009):** every agent must check whether Claude needs its result before finishing and ring the matching lane when required. No manual reminder is needed once the chat reads the updated main-checkout rules/inbox. Already-running chats may still hold older instructions; approval and paused-lane stops remain.

**Gojo run v14 (2026-10-15):** Astra's packed-atlas recheck passes visible anatomy and discrete-frame continuity; the v13 f6 arm/fist dropout is resolved. No new visible defect was established. The eight 60 ms GIF frames match the atlas. Strict hidden-segment measurements, live browser playback and runtime contacts remain unverified; Claude owns those checks and technical disposition. V14 repeats Part A for both halves, preserving the accepted same-lead-leg and forward-fist choices. The report and handoff are committed on `art/gojo-run` at `9b25a5a8`: [audit](<E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-gojo-run/art/characters/gojo/production/run-jkl/ASTRA_RUN_V14_AUDIT_v01.md>) · [review GIF](<E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-gojo-run/public/reviews/gojo-run-jkl/run_v14_loop_v01.gif>). This is technical screening, not a new visual approval; Claude will return with the review step after runtime checks. No art, pack or sidecar was changed in the audit.

**Beam clash (2026-10-15):** engine fixes and the five effects are live. Your six round 2 approvals are recorded on `art/beam-clash` (PR #110): Naruto ground v02; Sasuke ground/air v01; Killua ground v01; Gojo ground/air v01. [Phone review page](https://gcd-tourney-m1mjwpw3c-eshin087s-projects.vercel.app/reviews/beam-clash-r2/). Killua air v01 remains held; its v02 redraw is authorized (one call remains) but blocked because the active Codex chat cannot switch to the required `gpt-6-luna` / medium model. Continue in a Codex chat configured to Luna/medium. Astra audit and five non-Naruto hand-anchor measurements remain pending before runtime integration.

**Scale loose ends: corrected preview, waiting for Claude.** [All five calibrated candidates](https://gcd-tourney-d2l8ht4cf-eshin087s-projects.vercel.app/reviews/scale-loose-ends/index.html) (Vercel login required; preview dfad51d5). Astra visual anatomy screening passes all five; Killua down08/ko09 gross oversizing and clipping are fixed. Claude must resolve airHeavyAlt04 borderline f3 contact, in-game grounding/state transition, and charge14 aura retention. No approval or manual Claude prompt needed yet; all five remain unapproved. No new generation; Gojo stays in its separate chat.

**Round5 review complete:** the user approved all24 remaining strips as drawn on 2026-10-15. No further review is needed for this batch. Approval commits: Gojo d17bc8d; Naruto 4fb4d04; Naruto alts56ef2b2; Killua e5539ff; Sasuke b410b29. The earlier gallery labels are superseded by these decisions.

**Live (2026-10-15):** Claude merged all five art branches (Killua `768fecd`, Sasuke `35e275e`, Gojo `1301c0c`, Naruto `74f312d`, Naruto alts `8049098`), ran the in-game check and a 3-match CPU soak (0 violations, clean console) and deployed production `8049098` to https://gcd-tourney.vercel.app. Naruto plays 9 attack alts; light2Alt and airHeavyAlt stay held, so those slots play the base move.

**GitHub mirror fixed (2026-10-15, your choice):** the publish tool now keeps commit ids in messages as written (TOOL-043, PR #99), and GitHub main was replaced once (`8250b23` -> `48036ca`). Local history is untouched; PRs #79, #80, #81, #83, #88 and #99 show merged. Normal publishes fast-forward again.

1. **Approvals now happen in Claude** (PR #114, ADR 0037; relay PR #95, ADR 0033): Claude and Codex pass work back and forth on their own. When something needs you, Codex rings Claude, you get a notification, and Claude asks you with buttons (Approve / Reject / Hold); your click is relayed to Codex word for word. Typing `approve vNN` in a Codex chat still works. The loop also pauses after 4 round trips without you. Say "stop the relay" to either AI to pause it; "status" shows each lane, and "turn: you" means it's waiting on you.
2. **Gojo G is selected.** User chose the relaxed-arm glide direction. H/I alternatives are rejected and preserved. Direction review is finished; [selection and technical handoff](<E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-gojo-title-r3/art/characters/gojo/production/run-ghi/SELECTION_v01.md>) records intact sources and cumulative calls. Leg-phase and loop-join cleanup plus anatomical checks remain before production approval. Restored real worktree `.worktrees/art-gojo-title-r3`, same branch `codex/gojo-run-def`; production runv12 unchanged, no merge/deploy.
3. **Gojo idle08 and Goku idle02: user approved as drawn (2026-10-15).** Approval commits 7dd0a5d and 8788b46. Claude now owns calibration, safe anchor promotion, packing and technical checks. No further pose decision is pending for either idle; no new generation or production release.
4. **All scale-batch visual decisions recorded:** the24 approvals above join previously approved Sasuke jumpSquat07, Killua stagger08 and Naruto taunt10. Astra measurements and uncertainty remain in the evidence; no new numeric anatomy certification is claimed.
5. **Claude handoff:** newest CLAUDE_ART_HANDOFF note lists all24 versions, branch commits and validation. Claude already cleared the prior three technical decisions; now reconcile final packs (including the approved Killua idle11 anchor), merge guards and integration. No user review remains for this batch.
6. **Goku references approved (2026-10-15):** model_sheet02 and expressions02 recorded and promoted at 124d157; no reference review remains. Idle02 was approved as drawn; Claude owns calibration and technical checks. **Luffy:** its separate relay work continues.

## Generated status

This generated block describes **main only**. Unmerged PR candidates are listed above and in each real worktree's REVIEW.md; they are not part of main yet.

<!-- status:begin -->
_Generated by `npm run status` at 2026-10-16 04:33 UTC._

### Needs you now (1)
_Answered only in the Claude chat "0 - Approvals" (ADR 0039); its watcher is off: open that chat and type /approvals._
- **approval** from Claude chat "3 - Gojo Running": Gojo run v14 (replaces approved v13 before merge). Astra held v13: in f6 the near arm and fist are missing in the Part B drawing, so the fist pops out for one frame. v14 uses Part A for both halves (no new calls): the f… https://gcd-tourney-q9s5r9pnt-eshin087s-projects.vercel.app/reviews/gojo-run-jkl/

### Still marked "needs review" in art/REVIEW.md (39)
_Bookkeeping: the newest row of each asset. Anything the user must actually answer is in "Needs you now"._
- **naruto** (4): light2Alt v04, airHeavyAlt v03, run v08, proportion_sample v02
- **gojo** (25): D run/glide study study v01, E run/glide study study v01, F run/glide study study v01, idle source part v04, …
- **killua** (2): win round4 v05, proportion_sample v01
- **sasuke** (4): ko v07, down v08, launched v07, proportion_sample v01
- **Killua** (1): specialForward v11
- **decals** (1): decal_style_sheet v01
- **cast QA** (1): candidate_idle_comparison v01
- **cast** (1): proportion_lineup v04

### Fighter art (approved)

| fighter | references | core anims | all anims | next asset |
|---|---|---|---|---|
| goku | 3/3 | 1/23 | 1/58 | run (step 4, todo) |
| luffy | 3/3 | 1/23 | 1/56 | run (step 4, todo) |
| naruto | 2/3 | 23/23 | 51/53 | proportionSample (step 1, raw v02) |
| sasuke | 2/3 | 23/23 | 42/53 | proportionSample (step 1, raw v01) |
| killua | 2/3 | 23/23 | 42/53 | proportionSample (step 1, raw v01) |
| gojo | 2/3 | 23/23 | 42/53 | proportionSample (step 1, raw v03) |

### Claude is on
- DOC-010: One Codex prompt: an art lead with parallel sub-agents per workstream; Claude is the inte… [in-progress]

### Codex is on
- OPS-004: Project-scoped autonomous agents and sequential integration [blocked]
- ART-NAR-TITLE: Redraw all 42 animations and 3 UI images in approved title style [in-progress]
- ART-NAR-R4-REPAIR: Correct Naruto round-4 scale before another user review [in-progress]
- ART-SCALE-R4: Scale consistency round 4: Killua taller idle/guard, Gojo combat-cell idle, superDash x3,… [in-progress]
- ART-ALTS-NAR: Naruto attack alts pilot (11 strips) [in-progress]
- ART-KIL-TITLE-20261011: Killua full title-style redraw from the approved pilot [in-progress]
- ART-TITLE-R3: Title-style round-3 redraws and movement scale reports [blocked]

### Finished, waiting for a check (62)
- ART-KIL-TITLE-R2 (Codex), ART-SCALE-R4-NAR (Codex Naruto worker), ART-NAR-KO-KICK-V09 (Codex), ART-NAR-TITLE-R2 (Codex), OPS-013 (Claude), DOC-001 (Claude), ENG-056 (Claude), ART-NAR-4T (Claude), ENG-042 (Claude), ENG-043 (Claude), ENG-044 (Claude), ENG-045 (Claude), ENG-049 (Claude), TOOL-005 (Claude), DOC-004 (Claude), TOOL-013 (Codex), TOOL-014 (Codex), TOOL-017 (Codex), ART-SAS-04 (Codex), ART-SAS-05 (Codex), ART-SAS-06 (Codex), ART-SAS-07 (Codex), ART-SAS-08 (Codex), ART-SAS-09 (Codex), ART-SAS-10 (Codex), ART-SUPER-ART (Codex), ENG-062 (Claude), ENG-063 (Claude), ENG-064 (Claude), ENG-065 (Claude), ENG-066 (Claude), TOOL-024 (Claude), TOOL-025 (Claude), ENG-067 (Claude), ENG-068 (Claude), ENG-069 (Claude), ART-VFX-PWR (Codex), TOOL-026 (Claude), ENG-070 (Claude), ENG-071 (Claude), ENG-072 (Claude), ENG-073 (Claude), TOOL-029 (Claude), TOOL-030 (Claude), ENG-078 (Claude), QA-R4-ASTRA (Codex), ART-SCALE-R4-KIL (Codex), ART-SCALE-R4-SAS (Codex Sasuke sub-agent), TOOL-045 (Claude), TOOL-048 (Claude), ART-TITLE-PRODUCTION-QA (Codex), OPS-PERM-20261012 (Codex), ART-R5-APPROVE-NARUTO (Codex), ART-R5-APPROVE-GOJO (Codex), ART-DECISION-SASUKE-20261015 (Codex), ART-R5-APPROVE-SASUKE (Codex), ART-DECISION-KILLUA-20261015 (Codex), ART-R5-APPROVE-KILLUA (Codex), ART-DECISION-NARUTO-20261015 (Codex), ART-R5-APPROVE-NARUTO-ALTS (Codex), ART-GOJO-RUN-JKL (Codex + Claude), ART-SCALE-LOOSE-20261015 (Codex)

### Last commits
- 58e8094a 10-15 21:30 docs(coordination): Codex control chat forwards every approval to the Claude desk (ADR 0039)
- 0dfb996e 10-15 21:27 docs(gojo): record approved run audit hold
- 6f988772 10-15 21:24 docs(tasks): OPS-013 audit totals and review link
- 5a718ced 10-15 21:23 Merge branch 'fix/sparse-art-raw'
- f80edd47 10-15 21:23 feat(skill): add on-demand GCD Tourney attention check
- 169e43a3 10-15 21:23 Merge branch 'main' into fix/sparse-art-raw
<!-- status:end -->



