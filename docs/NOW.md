# NOW: what's happening and what you do next

_Updated by Claude (integration coordinator), 2026-10-12: **the title-style cast is live** at
https://gcd-tourney.vercel.app (production dfab2fb, PR #69-72 and the spot-dodge fix #77 merged). It is the
preview you approved, pixel for pixel, including seven stand-ins that Codex's round 3 will replace. Two of them carry
a recorded size exception: Killua's charge (head 8% small) and Naruto's spin (head 12% big). ART-TECH-01 stays
paused._

## Your next actions
**Gojo proportion study decision (2026-10-17, relay gojo-run #13):** Choose A/B/C/D or give another direction. [Review PR #143](https://github.com/eshin087/gcd-tourney/pull/143) · [latest study preview](https://gcd-tourney-aaf1jnvjg-eshin087s-projects.vercel.app/reviews/gojo-proportions/). A is current (106±5px legs; 215px body; 49.3%). B targets −8%; C targets −10% plus sturdier build but its neutral v02 is on Astra hold for smaller relative head, and its call budget is exhausted. D keeps A anatomy and changes pose direction. Nothing is approved or shipped.

**ART-SIZE-R6 — waiting for Claude merge (2026-10-18, relay #7):** main is merged into `art/size-r6`. Sasuke `beamStruggle` v02 from PR #140 remains approved and live; v05 is quarantined under `raw/_qa_hold/`; rejected v04 remains under `raw/_rejected/`, so no user art review is needed. PR #142 is refreshed for Claude's merge. The art guard and production build pass; Killua airLight2 v08 stays held and Gojo heavy is unchanged. Broader candidate audit remains open. No camera/engine change.

**Beam clash done (2026-10-17, PR #140 + #139, live):** every fighter with an energy move has its clash pose in the game: Goku's Dragon Fist v01 and Sasuke's redrawn Chidori Spear v02 joined, Naruto's hand anchor was fixed. Sasuke v02 remains the live approved strip. The later v04/v05 R6 alternates were superseded by the shipped v02; no review is pending. Astra holds on Sasuke, Killua and Gojo's air poses stay as known (your call).

**Super art Round 2b approved (2026-10-16):** the user approved all eight Goku and Luffy v01 images via Claude relay effects #10, including the four cutouts despite Astra holds. Approved source copies and fitted UI pack outputs are committed on `art/super-art-r2b` (`b41d344d`, PR #131). [Review gallery preview](https://gcd-tourney-8bi197074-eshin087s-projects.vercel.app/reviews/super-art-r2b/). The Vercel preview build passed; the art worktree is sparse and its pack report has missing animation sheets, so Claude owns the full-checkout pack and in-game/runtime integration check. No production merge or deploy is claimed.

**Super art round 2a approved (2026-10-16):** all 12 Naruto, Killua and Gojo v01s were approved via Claude relay effects #8, including the six foregrounds with Astra holds. Sources and fitted UI outputs are committed on PR #129. Claude's next step is the full-checkout pack/runtime check and integration; the sparse worktree pack emitted missing-animation warnings, documented in the [handoff](agents/CLAUDE_ART_HANDOFF.md). [Approved preview](https://gcd-tourney-891njl4yw-eshin087s-projects.vercel.app/reviews/super-art-r2/).

**One place to answer (2026-10-15, ADR 0039, PR #117):** every approval and decision now comes to the Claude chat **"0 - Approvals"** (pinned while something waits, plus a phone notification). Other Claude chats and Codex lanes queue their questions there instead of asking you. `npm run status` opens with "Needs you now". It is also the one central chat: say "status" there for the overview, or "tell the <x> chat ..." to reach a Codex chat. The Codex "0 - G" control chat and its monitor are retired (you can archive 0 - G). After deleting chats: name a Claude chat `0 - Approvals` and type `/approvals`.

**Scale loose ends live (2026-10-15):** your five approvals are in the game: Naruto light2Alt v05 and airHeavyAlt v04 (all 11 Naruto attack alts now play), Killua charge v14 (head fixed), down v08 and ko v09 (side-on, resting on the floor; ko mirrored). Merged PRs #105/#106, in-game check and 3-match soak clean, production `7a554bb6`. Nothing waiting on you from the scale chat.

**Goku/Luffy core drawings approved (2026-10-16, relay #14):** all 23 core drawings per fighter are user-approved, recorded on PRs #123/#96 and in the shared review log. No further drawing decision is needed. Both strict packs, committed preview builds and merge guards passed; hosted atlases match the audited files exactly. Claude owns remaining contact/grounding/runtime checks and sequential integration; these branches are still unmerged. See [the final handoff](agents/CLAUDE_ART_HANDOFF.md). No new image calls. [Approved Goku set](https://gcd-tourney-n4nm8l3wq-eshin087s-projects.vercel.app/characters/goku/core-review-final/index.html) · [Approved Luffy set](https://gcd-tourney-2evwtyr04-eshin087s-projects.vercel.app/characters/luffy/final-core-review/index.html).

**Online play live, work paused (2026-10-16, ENG-094/095/097):** ONLINE on https://gcd-tourney.vercel.app : public and private rooms, quick-chat, moderation, winner stays on, spectating, rejoining after a dropped connection. Paused at your call; open follow-ups on the task board: peer-to-peer private rooms (ENG-098), switching on the anti-bot check (ENG-099, built but off), and your licensing decision before promoting public play (OPS-017). Nothing to do now.

**Super banners and ultimate splashes live for the whole cast (2026-10-16):** Sasuke, Naruto, Killua, Gojo, Goku and Luffy on https://gcd-tourney.vercel.app (PRs #111, #129, #131). Nothing to do.

**Effects and ground live (2026-10-15):** you approved after the demo; PR #108 (natural ground damage) and PR #113 (super banner, ultimate splash, Sharingan) are merged and on https://gcd-tourney.vercel.app. Nothing to do.

**Automatic handback rule (2026-10-15, OPS-009):** every agent must check whether Claude needs its result before finishing and ring the matching lane when required. No manual reminder is needed once the chat reads the updated main-checkout rules/inbox. Already-running chats may still hold older instructions; approval and paused-lane stops remain.

**Gojo run v14 (2026-10-15):** Astra's packed-atlas recheck passes visible anatomy and discrete-frame continuity; the v13 f6 arm/fist dropout is resolved. No new visible defect was established. The eight 60 ms GIF frames match the atlas. Strict hidden-segment measurements, live browser playback and runtime contacts remain unverified; Claude owns those checks and technical disposition. V14 repeats Part A for both halves, preserving the accepted same-lead-leg and forward-fist choices. The report and handoff are committed on `art/gojo-run` at `9b25a5a8`: [audit](<E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-gojo-run/art/characters/gojo/production/run-jkl/ASTRA_RUN_V14_AUDIT_v01.md>) · [review GIF](<E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-gojo-run/public/reviews/gojo-run-jkl/run_v14_loop_v01.gif>). This is technical screening, not a new visual approval; Claude will return with the review step after runtime checks. No art, pack or sidecar was changed in the audit.

**Gojo dashes (2026-10-17):** dash v11 and superDash v13 (redrawn at the idle's body size) are approved and live (PR #141, `ca5e1fdd`); backDash v07 unchanged. Nothing waiting.


**Scale loose ends: all five drawings approved via Claude.** User approved Naruto light2Alt05/airHeavyAlt04 and Killua charge14/down08/ko09 on 2026-10-15 (relay scale#6). Recorded on PR106 at1216e707 and PR105 atc9b2f9bc. [Reviewed preview](https://gcd-tourney-d2l8ht4cf-eshin087s-projects.vercel.app/reviews/scale-loose-ends/index.html) has historical pre-approval labels. No user action remains for these five. Claude owns final contact/grounding/aura checks and integration; no merge or production deployment by Codex.

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
_Generated by `npm run status` at 2026-10-18 00:21 UTC._

### Needs you now (1)
_Answered only in the Claude chat "0 - Approvals" (ADR 0039); its watcher is off: open that chat and type /approvals._
- **decision** from Codex lane gojo-run: Gojo proportion study ready; choose A/B/C/D or another direction. Review preview: https://gcd-tourney-le2925xxp-eshin087s-projects.vercel.app/reviews/gojo-proportions/. A=current: neutral leg 106±5px / 215px standing bo…

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
| goku | 3/3 | 23/23 | 24/58 | backDash (step 9, todo) |
| luffy | 3/3 | 23/23 | 23/56 | backDash (step 9, todo) |
| naruto | 2/3 | 23/23 | 54/54 | proportionSample (step 1, raw v02) |
| sasuke | 2/3 | 23/23 | 44/55 | proportionSample (step 1, raw v01) |
| killua | 2/3 | 23/23 | 44/55 | proportionSample (step 1, raw v01) |
| gojo | 2/3 | 23/23 | 44/55 | proportionSample (step 1, raw v03) |

### Claude is on
- DOC-010: One Codex prompt: an art lead with parallel sub-agents per workstream; Claude is the inte… [in-progress]
- TOOL-GOKU-PROBE: Shape-based head probe for fighters whose hair or hat shares colours with the outfit (Gok… [in-progress]

### Codex is on
- OPS-004: Project-scoped autonomous agents and sequential integration [blocked]
- ART-NAR-TITLE: Redraw all 42 animations and 3 UI images in approved title style [in-progress]
- ART-NAR-R4-REPAIR: Correct Naruto round-4 scale before another user review [in-progress]
- ART-SCALE-R4: Scale consistency round 4: Killua taller idle/guard, Gojo combat-cell idle, superDash x3,… [in-progress]
- ART-ALTS-NAR: Naruto attack alts pilot (11 strips) [in-progress]
- ART-KIL-TITLE-20261011: Killua full title-style redraw from the approved pilot [in-progress]
- ART-TITLE-R3: Title-style round-3 redraws and movement scale reports [blocked]

### Finished, waiting for a check (66)
- ART-KIL-TITLE-R2 (Codex), ART-SCALE-R4-NAR (Codex Naruto worker), ART-NAR-KO-KICK-V09 (Codex), ART-NAR-TITLE-R2 (Codex), OPS-013 (Claude), DOC-001 (Claude), ENG-056 (Claude), ART-NAR-4T (Claude), ENG-042 (Claude), ENG-043 (Claude), ENG-044 (Claude), ENG-045 (Claude), ENG-049 (Claude), TOOL-005 (Claude), DOC-004 (Claude), TOOL-013 (Codex), TOOL-014 (Codex), TOOL-017 (Codex), ART-SAS-04 (Codex), ART-SAS-05 (Codex), ART-SAS-06 (Codex), ART-SAS-07 (Codex), ART-SAS-08 (Codex), ART-SAS-09 (Codex), ART-SAS-10 (Codex), ENG-062 (Claude), ENG-063 (Claude), ENG-064 (Claude), ENG-065 (Claude), ENG-066 (Claude), TOOL-024 (Claude), TOOL-025 (Claude), ENG-067 (Claude), ENG-068 (Claude), ENG-069 (Claude), ART-VFX-PWR (Codex), TOOL-026 (Claude), ENG-070 (Claude), ENG-071 (Claude), ENG-072 (Claude), ENG-073 (Claude), TOOL-029 (Claude), TOOL-030 (Claude), ENG-078 (Claude), QA-R4-ASTRA (Codex), ART-SCALE-R4-KIL (Codex), ART-SCALE-R4-SAS (Codex Sasuke sub-agent), TOOL-045 (Claude), TOOL-048 (Claude), TOOL-053 (Claude), ART-TITLE-PRODUCTION-QA (Codex), OPS-PERM-20261012 (Codex), ART-R5-APPROVE-NARUTO (Codex), ART-R5-APPROVE-GOJO (Codex), ART-DECISION-SASUKE-20261015 (Codex), ART-R5-APPROVE-SASUKE (Codex), ART-DECISION-KILLUA-20261015 (Codex), ART-R5-APPROVE-KILLUA (Codex), ART-DECISION-NARUTO-20261015 (Codex), ART-R5-APPROVE-NARUTO-ALTS (Codex), ART-GOJO-RUN-JKL (Codex + Claude), ART-SCALE-LOOSE-20261015 (Codex), ART-LOOSE-NARUTO-20261015 (Codex), ART-SIZE-R6 (Codex + Claude), ART-LOOSE-KILLUA-20261015 (Codex), ART-GOJO-PROPORTIONS (Codex + Claude)

### Open user decisions
- OPS-017: Licensing decision before promoting public online play (ROADMAP: anime characters are fin… [open]

### Last commits
- b76b3651 10-17 17:20 Merge branch 'art/beam-clash-r3'
- 17698b2c 10-17 17:19 docs(now): queue Gojo proportion study decision
- ad08c4d6 10-17 17:16 docs(agents): update ART-SIZE-R6 approval handoff
- ed5dc42d 10-17 17:08 docs(agents): hand off Sasuke calibration review
- 3e321c7b 10-17 17:03 test(net): re-record the determinism fixtures after the Goku and Sasuke struggle strips
- 5c0ed0bf 10-17 17:03 docs(agents): ART-SIZE-R6 measured correction (beamStruggle x1.10, Gojo heavy borderline)
<!-- status:end -->



