# NOW: what's happening and what you do next

_Updated by Claude (integration coordinator), 2026-10-12: **the title-style cast is live** at
https://gcd-tourney.vercel.app (production dfab2fb, PR #69-72 and the spot-dodge fix #77 merged). It is the
preview you approved, pixel for pixel, including seven stand-ins that Codex's round 3 will replace. Two of them carry
a recorded size exception: Killua's charge (head 8% small) and Naruto's spin (head 12% big). ART-TECH-01 stays
paused._

## Your next actions

**Online play, determinism check, run 2 (2026-10-15, PR #109, ADR 0036, ENG-090):** your first iPhone run split from Chrome (the same winner and HP, but different internal values). On the iPhone open https://gcd-tourney-8cch9kvj1-eshin087s-projects.vercel.app/?det=naruto-sasuke-s7 and then `?det=gojo-killua-s3` again (Vercel login). Each now ends with a TRACE section naming the frame and fields that differ; screenshot the whole result (scroll if needed) and send both to Claude. Firefox too if you have it. Nothing to approve.

**Effects and ground live (2026-10-15):** you approved after the demo; PR #108 (natural ground damage) and PR #113 (super banner, ultimate splash, Sharingan) are merged and on https://gcd-tourney.vercel.app. Nothing to do.

**Sasuke super/ultimate pilot (2026-10-15):** you approved all four v01 images for an in-game preview demo. Foreground Astra technical holds remain documented; no further generation or production deploy is authorized. Claude is integrating ENG-083 and these approved layers for a playable preview; wait for that preview.


**Automatic handback rule (2026-10-15, OPS-009):** every agent must check whether Claude needs its result before finishing and ring the matching lane when required. No manual reminder is needed once the chat reads the updated main-checkout rules/inbox. Already-running chats may still hold older instructions; approval and paused-lane stops remain.

**Gojo running (2026-10-15):** [Phase 2 preview](https://gcd-tourney-ncaxh7yr0-eshin087s-projects.vercel.app/reviews/gojo-run-jkl/) is live on PR #102. K was a direction pick only; no image is approved or ready for approval. Run v13 has no saved candidate; all four strips exhausted their 3-call budgets, and Astra held the dash atlas. Review the [Astra audit](<E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-gojo-run/art/characters/gojo/production/run-jkl/ASTRA_DASH_AUDIT_v01.md>) and decide whether to authorize a fresh repair round for run, dash, backDash and superDash, or leave them held. No relay ring was sent.

**Beam clash — five VFX approved:** you approved all five v01 clash effects in Codex chat on 2026-10-15. [Updated review page / preview](https://gcd-tourney-4cq30x1as-eshin087s-projects.vercel.app/reviews/beam-clash-r1/); PR #110, branch only, not merged or deployed to production. Naruto `beamStruggle` v01 remains a technical hold: strict scale failed (head/hair 1.40x; feet 0.62x); body sheet/Astra audit pending. Await Claude's calibration/relay before deciding whether to authorize another Naruto pilot or begin round 2. Claude's engine fixes remain in PR #107 (not merged, on hold for you): preview https://gcd-tourney-30a3jfy30-eshin087s-projects.vercel.app/lab.html (Scenarios -> Beam clash); tell Claude what to change.

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
_Generated by `npm run status` at 2026-10-16 03:35 UTC._

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
| goku | 3/3 | 1/23 | 1/57 | run (step 4, todo) |
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

### Finished, waiting for a check (59)
- ART-KIL-TITLE-R2 (Codex), ART-SCALE-R4-NAR (Codex Naruto worker), ART-NAR-KO-KICK-V09 (Codex), ART-NAR-TITLE-R2 (Codex), DOC-001 (Claude), ENG-056 (Claude), ART-NAR-4T (Claude), ENG-042 (Claude), ENG-043 (Claude), ENG-044 (Claude), ENG-045 (Claude), ENG-049 (Claude), TOOL-005 (Claude), DOC-004 (Claude), TOOL-013 (Codex), TOOL-014 (Codex), TOOL-017 (Codex), ART-SAS-04 (Codex), ART-SAS-05 (Codex), ART-SAS-06 (Codex), ART-SAS-07 (Codex), ART-SAS-08 (Codex), ART-SAS-09 (Codex), ART-SAS-10 (Codex), ART-SUPER-ART (Codex), ENG-062 (Claude), ENG-063 (Claude), ENG-064 (Claude), ENG-065 (Claude), ENG-066 (Claude), TOOL-024 (Claude), TOOL-025 (Claude), ENG-067 (Claude), ENG-068 (Claude), ENG-069 (Claude), ART-VFX-PWR (Codex), TOOL-026 (Claude), ENG-070 (Claude), ENG-071 (Claude), ENG-072 (Claude), ENG-073 (Claude), TOOL-029 (Claude), TOOL-030 (Claude), ENG-078 (Claude), QA-R4-ASTRA (Codex), ART-SCALE-R4-KIL (Codex), ART-SCALE-R4-SAS (Codex Sasuke sub-agent), TOOL-045 (Claude), ART-TITLE-PRODUCTION-QA (Codex), OPS-PERM-20261012 (Codex), ART-R5-APPROVE-NARUTO (Codex), ART-R5-APPROVE-GOJO (Codex), ART-DECISION-SASUKE-20261015 (Codex), ART-R5-APPROVE-SASUKE (Codex), ART-DECISION-KILLUA-20261015 (Codex), ART-R5-APPROVE-KILLUA (Codex), ART-DECISION-NARUTO-20261015 (Codex), ART-R5-APPROVE-NARUTO-ALTS (Codex), ART-SCALE-LOOSE-20261015 (Codex)

### Last commits
- 7f4f7cb3 10-15 20:34 Merge branch 'feature/super-splash'
- cc1092be 10-15 20:33 docs(scale): hand back calibrated atlas re-audit
- 951fb271 10-15 20:32 Merge branch 'main' into feature/super-splash
- 42329589 10-15 20:31 Merge branch 'feature/ground-natural'
- 16d8fb54 10-15 20:30 docs(gojo): record phase two blocker and preview
- 1d64361f 10-15 20:28 docs(now): second iPhone determinism run with field traces (ENG-090, PR #109)
<!-- status:end -->


