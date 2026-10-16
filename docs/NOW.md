# NOW: what's happening and what you do next

_Updated by Claude (integration coordinator), 2026-10-12: **the title-style cast is live** at
https://gcd-tourney.vercel.app (production dfab2fb, PR #69-72 and the spot-dodge fix #77 merged). It is the
preview you approved, pixel for pixel, including seven stand-ins that Codex's round 3 will replace. Two of them carry
a recorded size exception: Killua's charge (head 8% small) and Naruto's spin (head 12% big). ART-TECH-01 stays
paused._

## Your next actions

**Online play, determinism check (2026-10-15, PR #109, ADR 0036, ENG-090):** on your iPhone (Safari) and, if you have it, in Firefox, open https://gcd-tourney-qqautjthg-eshin087s-projects.vercel.app/?det=naruto-sasuke-s7 and then `?det=gojo-killua-s3` (Vercel login). Each replays a recorded match for about a minute and prints MATCH or SPLIT plus timings; screenshot both results and send them to Claude. Chrome already matches. Nothing to approve.

**Effects and ground, engine side (2026-10-15, Claude):** two PRs ready, not merged. Ground damage that looks like broken stone in the floor (no stickers, no glowing seams, craters stay): PR #108, preview https://gcd-tourney-3tlxz5jg3-eshin087s-projects.vercel.app (any match, land a big hit). Super banner + ultimate splash + in-game Sharingan: PR #113, preview https://gcd-tourney-9nel3owux-eshin087s-projects.vercel.app/?fight=sasuke,naruto&mode=solo (Sasuke down+Special = Sharingan; the banner/splash art appears once you approve Codex's images). Tell Claude: merge both, or what to change.

**Sasuke super/ultimate pilot (2026-10-15):** you approved all four v01 images for an in-game preview demo. Foreground Astra technical holds remain documented; no further generation or production deploy is authorized. Claude is integrating ENG-083 and these approved layers for a playable preview; wait for that preview.


**Automatic handback rule (2026-10-15, OPS-009):** every agent must check whether Claude needs its result before finishing and ring the matching lane when required. No manual reminder is needed once the chat reads the updated main-checkout rules/inbox. Already-running chats may still hold older instructions; approval and paused-lane stops remain.

**Gojo running (2026-10-15): you picked K (fast athletic).** Codex is drawing the production run, dash, backDash and superDash in the K one-hand pose on PR #102 (relay lane `gojo-run`). Nothing to do until the review preview arrives.

**Beam clash — five VFX approved:** you approved all five v01 clash effects in Codex chat on 2026-10-15. [Updated review page / preview](https://gcd-tourney-4cq30x1as-eshin087s-projects.vercel.app/reviews/beam-clash-r1/); PR #110, branch only, not merged or deployed to production. Naruto `beamStruggle` v01 remains a technical hold: strict scale failed (head/hair 1.40x; feet 0.62x); body sheet/Astra audit pending. Await Claude's calibration/relay before deciding whether to authorize another Naruto pilot or begin round 2. Claude's engine fixes remain in PR #107 (not merged, on hold for you): preview https://gcd-tourney-30a3jfy30-eshin087s-projects.vercel.app/lab.html (Scenarios -> Beam clash); tell Claude what to change.

**Scale loose ends handed to Claude:** [five-candidate diagnostic page](https://gcd-tourney-j13tag52l-eshin087s-projects.vercel.app/reviews/scale-loose-ends/index.html) (Vercel login required; not ready for approval). Naruto PR106 / Killua PR105; allfive remain technical HOLDs after Astra. Claude owns calibration/contact/grounding checks and final-pixel re-audit. No user review or manual Claude prompt needed now. Gojo stays in its separate chat. One accidental extra charge call was quarantined and disclosed; no further calls authorized.

**Round5 review complete:** the user approved all24 remaining strips as drawn on 2026-10-15. No further review is needed for this batch. Approval commits: Gojo d17bc8d; Naruto 4fb4d04; Naruto alts56ef2b2; Killua e5539ff; Sasuke b410b29. The earlier gallery labels are superseded by these decisions.

**Live (2026-10-15):** Claude merged all five art branches (Killua `768fecd`, Sasuke `35e275e`, Gojo `1301c0c`, Naruto `74f312d`, Naruto alts `8049098`), ran the in-game check and a 3-match CPU soak (0 violations, clean console) and deployed production `8049098` to https://gcd-tourney.vercel.app. Naruto plays 9 attack alts; light2Alt and airHeavyAlt stay held, so those slots play the base move.

**GitHub mirror fixed (2026-10-15, your choice):** the publish tool now keeps commit ids in messages as written (TOOL-043, PR #99), and GitHub main was replaced once (`8250b23` -> `48036ca`). Local history is untouched; PRs #79, #80, #81, #83, #88 and #99 show merged. Normal publishes fast-forward again.

1. **The Claude-Codex relay is live** (PR #95, ADR 0033): Claude now sends work straight into the Codex chats "1 - Scale Consistency" (lane `scale`) and "2 - Goku Luffy" (lane `goku-luffy`), and Codex rings Claude back, so no more pasting prompts between the apps. You step in only for approvals, BLOCKED items or decisions (you get a notification), or after 4 round trips without you. Say "stop the relay" to either AI to pause it; "status" shows each lane.
2. **Gojo G is selected.** User chose the relaxed-arm glide direction. H/I alternatives are rejected and preserved. Direction review is finished; [selection and technical handoff](<E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-gojo-title-r3/art/characters/gojo/production/run-ghi/SELECTION_v01.md>) records intact sources and cumulative calls. Leg-phase and loop-join cleanup plus anatomical checks remain before production approval. Restored real worktree `.worktrees/art-gojo-title-r3`, same branch `codex/gojo-run-def`; production runv12 unchanged, no merge/deploy.
3. **Gojo idle08 and Goku idle02: user approved as drawn (2026-10-15).** Approval commits 7dd0a5d and 8788b46. Claude now owns calibration, safe anchor promotion, packing and technical checks. No further pose decision is pending for either idle; no new generation or production release.
4. **All scale-batch visual decisions recorded:** the24 approvals above join previously approved Sasuke jumpSquat07, Killua stagger08 and Naruto taunt10. Astra measurements and uncertainty remain in the evidence; no new numeric anatomy certification is claimed.
5. **Claude handoff:** newest CLAUDE_ART_HANDOFF note lists all24 versions, branch commits and validation. Claude already cleared the prior three technical decisions; now reconcile final packs (including the approved Killua idle11 anchor), merge guards and integration. No user review remains for this batch.
6. **Goku references approved (2026-10-15):** model_sheet02 and expressions02 recorded and promoted at 124d157; no reference review remains. Idle02 was approved as drawn; Claude owns calibration and technical checks. **Luffy:** its separate relay work continues.

## Generated status

This generated block describes **main only**. Unmerged PR candidates are listed above and in each real worktree's REVIEW.md; they are not part of main yet.

<!-- status:begin -->
_Generated by `npm run status` at 2026-10-16 03:23 UTC._

### Waiting for your review (166)
- **naruto** (17): light2Alt v04, airHeavyAlt v03, light2Alt v03, light2Alt v02, …. Reply in the naruto Codex thread: `approve naruto <asset> vNN` or feedback
- **gojo** (56): idle v07, D run/glide study study v01, E run/glide study study v01, F run/glide study study v01, …. Reply in the gojo Codex thread: `approve gojo <asset> vNN` or feedback
- **killua** (58): win round4 v05, light2 v05, down v05, ko v06, …. Reply in the killua Codex thread: `approve killua <asset> vNN` or feedback
- **sasuke** (23): ko v07, ko v06, down v08, down v07, …. Reply in the sasuke Codex thread: `approve sasuke <asset> vNN` or feedback
- **Killua** (8): light4 v09, specialForward v11, light4 v08, special v06, …. Reply in the Killua Codex thread: `approve Killua <asset> vNN` or feedback
- **decals** (1): decal_style_sheet v01. Reply in the decals Codex thread: `approve decals <asset> vNN` or feedback
- **cast QA** (1): candidate_idle_comparison v01. Reply in the cast QA Codex thread: `approve cast QA <asset> vNN` or feedback
- **cast** (2): proportion_lineup v04, proportion_lineup v03. Reply in the cast Codex thread: `approve cast <asset> vNN` or feedback

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
- ART-SCALE-LOOSE-20261015: Five Naruto/Killua repairs and Astra audits [in-progress]

### Finished, waiting for a check (59)
- ART-KIL-TITLE-R2 (Codex), ART-SCALE-R4-NAR (Codex Naruto worker), ART-NAR-KO-KICK-V09 (Codex), ART-NAR-TITLE-R2 (Codex), DOC-001 (Claude), ENG-056 (Claude), ART-NAR-4T (Claude), ENG-042 (Claude), ENG-043 (Claude), ENG-044 (Claude), ENG-045 (Claude), ENG-049 (Claude), TOOL-005 (Claude), DOC-004 (Claude), TOOL-013 (Codex), TOOL-014 (Codex), TOOL-017 (Codex), ART-SAS-04 (Codex), ART-SAS-05 (Codex), ART-SAS-06 (Codex), ART-SAS-07 (Codex), ART-SAS-08 (Codex), ART-SAS-09 (Codex), ART-SAS-10 (Codex), ENG-083 (Claude), ENG-084 (Claude), ART-SUPER-ART (Codex), ENG-062 (Claude), ENG-063 (Claude), ENG-064 (Claude), ENG-065 (Claude), ENG-066 (Claude), TOOL-024 (Claude), TOOL-025 (Claude), ENG-067 (Claude), ENG-068 (Claude), ENG-069 (Claude), ART-VFX-PWR (Codex), TOOL-026 (Claude), ENG-070 (Claude), ENG-071 (Claude), ENG-072 (Claude), ENG-073 (Claude), TOOL-029 (Claude), TOOL-030 (Claude), ENG-078 (Claude), QA-R4-ASTRA (Codex), ART-SCALE-R4-KIL (Codex), ART-SCALE-R4-SAS (Codex Sasuke sub-agent), ART-TITLE-PRODUCTION-QA (Codex), OPS-PERM-20261012 (Codex), ART-R5-APPROVE-NARUTO (Codex), ART-R5-APPROVE-GOJO (Codex), ART-DECISION-SASUKE-20261015 (Codex), ART-R5-APPROVE-SASUKE (Codex), ART-DECISION-KILLUA-20261015 (Codex), ART-R5-APPROVE-KILLUA (Codex), ART-DECISION-NARUTO-20261015 (Codex), ART-R5-APPROVE-NARUTO-ALTS (Codex)

### Last commits
- 8a590cec 10-15 20:23 docs(now): Sasuke approved for preview demo
- 7a8682ce 10-15 20:22 docs(beam-clash): record user approval of vfx
- 6783d840 10-15 20:21 docs(scale): claim calibrated atlas re-audit
- 7b2f6d7c 10-15 20:20 docs(art): loose ends calibrated; scale lane re-audit after calibration
- fdccbd44 10-15 20:19 docs(now): online determinism check is ADR 0036 / ENG-090, new preview URL
- bcd57dfb 10-15 20:19 docs(status): require clear next actions in every handback
<!-- status:end -->


