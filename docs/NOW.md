# NOW: what's happening and what you do next

_Updated by Claude (integration coordinator), 2026-10-12: **the title-style cast is live** at
https://gcd-tourney.vercel.app (production dfab2fb, PR #69-72 and the spot-dodge fix #77 merged). It is the
preview you approved, pixel for pixel, including seven stand-ins that Codex's round 3 will replace. Two of them carry
a recorded size exception: Killua's charge (head 8% small) and Naruto's spin (head 12% big). ART-TECH-01 stays
paused._

## Your next actions

**Online play, determinism check, run 3 (2026-10-15, PR #109, ADR 0036, ENG-090):** run 2 traced the iPhone split to `Math.hypot` (Safari rounds it one last digit differently). The test now uses its own deterministic math; open each link on the iPhone (Vercel login), wait about a minute, screenshot the whole result and send both to Claude. Nothing to approve.<br>https://gcd-tourney-5vvkn62it-eshin087s-projects.vercel.app/?det=naruto-sasuke-s7<br>https://gcd-tourney-5vvkn62it-eshin087s-projects.vercel.app/?det=gojo-killua-s3

**Sasuke backdrops live (2026-10-15):** the approved Kirin and Amaterasu backdrops are on https://gcd-tourney.vercel.app (merge d84127c0); his eye strip stands in for the cutouts. Codex is preparing the v02 cutouts on PR #111; Claude will bring you the preview to approve.

**Effects and ground live (2026-10-15):** you approved after the demo; PR #108 (natural ground damage) and PR #113 (super banner, ultimate splash, Sharingan) are merged and on https://gcd-tourney.vercel.app. Nothing to do.

**Sasuke super/ultimate pilot (2026-10-15):** you approved the Kirin and Amaterasu backdrops (ui_super_bg v01, ui_ult_bg v01) via Claude and rejected both foregrounds (ui_super_fg v01, ui_ult_fg v01). The rejected sources are archived; do not use them. Claude is integrating the two approved backgrounds with ENG-083 and runtime fallback layers for a playable preview. No further art generation or production deploy is authorized.


**Automatic handback rule (2026-10-15, OPS-009):** every agent must check whether Claude needs its result before finishing and ring the matching lane when required. No manual reminder is needed once the chat reads the updated main-checkout rules/inbox. Already-running chats may still hold older instructions; approval and paused-lane stops remain.

**Gojo running (2026-10-15):** [Phase 2 preview](https://gcd-tourney-ncaxh7yr0-eshin087s-projects.vercel.app/reviews/gojo-run-jkl/) is live on PR #102. K was a direction pick only; no image is approved or ready for approval. Run v13 has no saved candidate; all four strips exhausted their 3-call budgets, and Astra held the dash atlas. Review the [Astra audit](<E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-gojo-run/art/characters/gojo/production/run-jkl/ASTRA_DASH_AUDIT_v01.md>) and decide whether to authorize a fresh repair round for run, dash, backDash and superDash, or leave them held. No relay ring was sent.

**Beam clash (2026-10-15):** the engine fixes, ground and air, are live (PR #107, d16aa67e). Codex round 2 is drawing the ground and air struggle poses for Sasuke, Killua and Gojo in "5 - beam clash chat"; Claude will ask you to approve them with the review link. **Your decisions now (asked in Claude's chat):** Naruto `beamStruggle` v01 (technical hold: head 1.40x, feet 0.62x) — redraw v02 or skip; see it at https://gcd-tourney-4cq30x1as-eshin087s-projects.vercel.app/reviews/beam-clash-r1/ . And whether to ship the five approved clash effects now (PR #110).

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
_Generated by `npm run status` at 2026-10-16 03:48 UTC._

### Waiting for your review (166)
- **naruto** (17): light2Alt v04, airHeavyAlt v03, light2Alt v03, light2Alt v02, …. Approve in Claude (its question box relays it, ADR 0037) or type `approve naruto <asset> vNN` in the naruto Codex thread
- **gojo** (56): idle v07, D run/glide study study v01, E run/glide study study v01, F run/glide study study v01, …. Approve in Claude (its question box relays it, ADR 0037) or type `approve gojo <asset> vNN` in the gojo Codex thread
- **killua** (58): win round4 v05, light2 v05, down v05, ko v06, …. Approve in Claude (its question box relays it, ADR 0037) or type `approve killua <asset> vNN` in the killua Codex thread
- **sasuke** (23): ko v07, ko v06, down v08, down v07, …. Approve in Claude (its question box relays it, ADR 0037) or type `approve sasuke <asset> vNN` in the sasuke Codex thread
- **Killua** (8): light4 v09, specialForward v11, light4 v08, special v06, …. Approve in Claude (its question box relays it, ADR 0037) or type `approve Killua <asset> vNN` in the Killua Codex thread
- **decals** (1): decal_style_sheet v01. Approve in Claude (its question box relays it, ADR 0037) or type `approve decals <asset> vNN` in the decals Codex thread
- **cast QA** (1): candidate_idle_comparison v01. Approve in Claude (its question box relays it, ADR 0037) or type `approve cast QA <asset> vNN` in the cast QA Codex thread
- **cast** (2): proportion_lineup v04, proportion_lineup v03. Approve in Claude (its question box relays it, ADR 0037) or type `approve cast <asset> vNN` in the cast Codex thread

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

### Finished, waiting for a check (58)
- ART-KIL-TITLE-R2 (Codex), ART-SCALE-R4-NAR (Codex Naruto worker), ART-NAR-KO-KICK-V09 (Codex), ART-NAR-TITLE-R2 (Codex), DOC-001 (Claude), ENG-056 (Claude), ART-NAR-4T (Claude), ENG-042 (Claude), ENG-043 (Claude), ENG-044 (Claude), ENG-045 (Claude), ENG-049 (Claude), TOOL-005 (Claude), DOC-004 (Claude), TOOL-013 (Codex), TOOL-014 (Codex), TOOL-017 (Codex), ART-SAS-04 (Codex), ART-SAS-05 (Codex), ART-SAS-06 (Codex), ART-SAS-07 (Codex), ART-SAS-08 (Codex), ART-SAS-09 (Codex), ART-SAS-10 (Codex), ENG-062 (Claude), ENG-063 (Claude), ENG-064 (Claude), ENG-065 (Claude), ENG-066 (Claude), TOOL-024 (Claude), TOOL-025 (Claude), ENG-067 (Claude), ENG-068 (Claude), ENG-069 (Claude), ART-VFX-PWR (Codex), TOOL-026 (Claude), ENG-070 (Claude), ENG-071 (Claude), ENG-072 (Claude), ENG-073 (Claude), TOOL-029 (Claude), TOOL-030 (Claude), ENG-078 (Claude), QA-R4-ASTRA (Codex), ART-SCALE-R4-KIL (Codex), ART-SCALE-R4-SAS (Codex Sasuke sub-agent), TOOL-045 (Claude), ART-TITLE-PRODUCTION-QA (Codex), OPS-PERM-20261012 (Codex), ART-R5-APPROVE-NARUTO (Codex), ART-R5-APPROVE-GOJO (Codex), ART-DECISION-SASUKE-20261015 (Codex), ART-R5-APPROVE-SASUKE (Codex), ART-DECISION-KILLUA-20261015 (Codex), ART-R5-APPROVE-KILLUA (Codex), ART-DECISION-NARUTO-20261015 (Codex), ART-R5-APPROVE-NARUTO-ALTS (Codex), ART-SCALE-LOOSE-20261015 (Codex)

### Last commits
- 01738a10 10-15 20:47 docs(inbox): beam clash round 2 (ground + air struggle poses); ENG-082 done
- d84127c0 10-15 20:47 Merge branch 'art/sasuke-backdrops'
- d16aa67e 10-15 20:46 Merge branch 'feature/beam-clash-fx'
- 0aab3098 10-15 20:46 Merge branch 'main' into feature/beam-clash-fx
- b6fc4638 10-15 20:45 Merge branch 'feature/online-determinism'
- b4412fe1 10-15 20:45 test(net): re-record the determinism fixtures on the melee-clash code (ENG-090)
<!-- status:end -->



