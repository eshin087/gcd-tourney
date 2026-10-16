# NOW: what's happening and what you do next

_Updated by Claude (integration coordinator), 2026-10-12: **the title-style cast is live** at
https://gcd-tourney.vercel.app (production dfab2fb, PR #69-72 and the spot-dodge fix #77 merged). It is the
preview you approved, pixel for pixel, including seven stand-ins that Codex's round 3 will replace. Two of them carry
a recorded size exception: Killua's charge (head 8% small) and Naruto's spin (head 12% big). ART-TECH-01 stays
paused._

## Your next actions
**Super art Round 2b ready for your review:** eight Goku and Luffy v01 candidates (super_bg, super_fg, ult_bg, ult_fg) are in [the review gallery](https://gcd-tourney-hk1p80en5-eshin087s-projects.vercel.app/reviews/super-art-r2b/), PR #131. All remain unapproved. Astra placed technical holds on all eight for color counts above 48; both SUPER cutouts also clip at the side edges, with additional face/build findings noted in the gallery. Please approve or request redo for each image through the 0 - Approvals desk. No image is packed into the game yet.

**Super art round 2a approved (2026-10-16):** all 12 Naruto, Killua and Gojo v01s were approved via Claude relay effects #8, including the six foregrounds with Astra holds. Sources and fitted UI outputs are committed on PR #129. Claude's next step is the full-checkout pack/runtime check and integration; the sparse worktree pack emitted missing-animation warnings, documented in the [handoff](agents/CLAUDE_ART_HANDOFF.md). [Approved preview](https://gcd-tourney-891njl4yw-eshin087s-projects.vercel.app/reviews/super-art-r2/).

**Beam clash art Round 2:** all seven poses are approved, including Killua `beamStruggleAir` v02 (Claude approval desk relay #10). The updated gallery is at [round-2 review](https://gcd-tourney-em7kwfazh-eshin087s-projects.vercel.app/reviews/beam-clash-r2/). Claude's next step is the pending Astra anatomy audit and exact hand-anchor measurements before runtime integration. See the newest beam-clash handoff in [CLAUDE_ART_HANDOFF.md](agents/CLAUDE_ART_HANDOFF.md).

**One place to answer (2026-10-15, ADR 0039, PR #117):** every approval and decision now comes to the Claude chat **"0 - Approvals"** (pinned while something waits, plus a phone notification). Other Claude chats and Codex lanes queue their questions there instead of asking you. `npm run status` opens with "Needs you now". It is also the one central chat: say "status" there for the overview, or "tell the <x> chat ..." to reach a Codex chat. The Codex "0 - G" control chat and its monitor are retired (you can archive 0 - G). After deleting chats: name a Claude chat `0 - Approvals` and type `/approvals`.

**Scale loose ends live (2026-10-15):** your five approvals are in the game: Naruto light2Alt v05 and airHeavyAlt v04 (all 11 Naruto attack alts now play), Killua charge v14 (head fixed), down v08 and ko v09 (side-on, resting on the floor; ko mirrored). Merged PRs #105/#106, in-game check and 3-match soak clean, production `7a554bb6`. Nothing waiting on you from the scale chat.

**Goku/Luffy approvals recorded (2026-10-16, relay #10):** your "Approved" decision is committed for **Goku heavy v14**, **Luffy down v03**, and **Luffy getup v03**. Updated [Goku approval preview](https://gcd-tourney-j1kdu3fnk-eshin087s-projects.vercel.app/characters/goku/calibration-r4/index.html) and [Luffy approval preview](https://gcd-tourney-1sgd4nb1t-eshin087s-projects.vercel.app/characters/luffy/calibration-r5/index.html) preserve the audited pixels exactly. No repeat approval needed. Claude owns runtime/contact checks and integration of PRs #123/#96. **Light3 v11 and special v01 stay held:** while this update finished, relay #11 queued your separate "Goku luffy retry" decision for one additional call each (special preserves f0-f5, at most five references). That retry work is the next scoped request; no new calls were used in this approval update. Nothing merged or deployed to production by Codex. [Handoff](agents/CLAUDE_ART_HANDOFF.md).

**Online play, ENG-094 built (2026-10-16, PR #132, ADR 0036):** online rooms work against a local copy of the lobby server: invite links, winner stays on, live spectating, every frame matched through the real server code. **Your step (asked in the 0 chat):** sign in to Cloudflare once at your PC (free account: https://dash.cloudflare.com/sign-up ), then reply ready; I deploy the server and send you the links to play phone vs PC. Nothing is on production yet.

**Sasuke super art live (2026-10-15):** Kirin banner and Amaterasu splash, backdrops and cutouts, are on https://gcd-tourney.vercel.app (merges d84127c0, 6e3a6d8a). Naruto, Killua and Gojo are live too (PR #129). Codex is now drawing Goku and Luffy; the approvals desk will ask you when their review page is ready.

**Effects and ground live (2026-10-15):** you approved after the demo; PR #108 (natural ground damage) and PR #113 (super banner, ultimate splash, Sharingan) are merged and on https://gcd-tourney.vercel.app. Nothing to do.

**Automatic handback rule (2026-10-15, OPS-009):** every agent must check whether Claude needs its result before finishing and ring the matching lane when required. No manual reminder is needed once the chat reads the updated main-checkout rules/inbox. Already-running chats may still hold older instructions; approval and paused-lane stops remain.

**Gojo run v14 (2026-10-15):** Astra's packed-atlas recheck passes visible anatomy and discrete-frame continuity; the v13 f6 arm/fist dropout is resolved. No new visible defect was established. The eight 60 ms GIF frames match the atlas. Strict hidden-segment measurements, live browser playback and runtime contacts remain unverified; Claude owns those checks and technical disposition. V14 repeats Part A for both halves, preserving the accepted same-lead-leg and forward-fist choices. The report and handoff are committed on `art/gojo-run` at `9b25a5a8`: [audit](<E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-gojo-run/art/characters/gojo/production/run-jkl/ASTRA_RUN_V14_AUDIT_v01.md>) · [review GIF](<E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-gojo-run/public/reviews/gojo-run-jkl/run_v14_loop_v01.gif>). This is technical screening, not a new visual approval; Claude will return with the review step after runtime checks. No art, pack or sidecar was changed in the audit.

**Gojo dashes (2026-10-16):** backDash v07 is packed for technical review and Astra holds it on tucked-frame placement and uncertain occluded anatomy; dash v10 and superDash v12 remain quarantined after scale/clipping failures. No user action yet: Claude must review contact/root placement and decide whether the candidates can proceed. [PR #124 preview](https://gcd-tourney-p0i2vm96d-eshin087s-projects.vercel.app/reviews/gojo-dashes/) · [handoff](agents/CLAUDE_ART_HANDOFF.md).

**Beam clash (2026-10-16):** engine fixes and five effects are live. All seven round-2 poses are approved, including Killua air v02. Claude owns the pending Astra audit, exact hand-anchor measurements and runtime integration. The [round-2 phone page](https://gcd-tourney-em7kwfazh-eshin087s-projects.vercel.app/reviews/beam-clash-r2/) reflects the approval.

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
_Generated by `npm run status` at 2026-10-16 12:07 UTC._

### Needs you now (2)
_Answered only in the Claude chat "0 - Approvals" (ADR 0039); its watcher is off: open that chat and type /approvals._
- **approval** from Codex lane effects: Review Goku and Luffy v01 super_bg, super_fg, ult_bg, ult_fg (8 images); approve each or request redos. Astra technical holds on all 8 for >48 colors; Goku and Luffy SUPER arm crops plus face/build findings. Preview: ht…
- **blocked** from Claude chat "6 - Multiplayer": ENG-094 online rooms are built and tested against a local copy of the server (PR #132): invite links, winner stays on, live spectating, and every frame matched through the real server code. To put it on the internet I n… https://github.com/eshin087/gcd-tourney/pull/132

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

### Finished, waiting for a check (64)
- ART-KIL-TITLE-R2 (Codex), ART-SCALE-R4-NAR (Codex Naruto worker), ART-NAR-KO-KICK-V09 (Codex), ART-NAR-TITLE-R2 (Codex), OPS-013 (Claude), DOC-001 (Claude), ENG-056 (Claude), ART-NAR-4T (Claude), ENG-042 (Claude), ENG-043 (Claude), ENG-044 (Claude), ENG-045 (Claude), ENG-049 (Claude), TOOL-005 (Claude), DOC-004 (Claude), TOOL-013 (Codex), TOOL-014 (Codex), TOOL-017 (Codex), ART-SAS-04 (Codex), ART-SAS-05 (Codex), ART-SAS-06 (Codex), ART-SAS-07 (Codex), ART-SAS-08 (Codex), ART-SAS-09 (Codex), ART-SAS-10 (Codex), ART-BEAM-CLASH (Codex), ENG-062 (Claude), ENG-063 (Claude), ENG-064 (Claude), ENG-065 (Claude), ENG-066 (Claude), TOOL-024 (Claude), TOOL-025 (Claude), ENG-067 (Claude), ENG-068 (Claude), ENG-069 (Claude), ART-VFX-PWR (Codex), TOOL-026 (Claude), ENG-070 (Claude), ENG-071 (Claude), ENG-072 (Claude), ENG-073 (Claude), TOOL-029 (Claude), TOOL-030 (Claude), ENG-078 (Claude), QA-R4-ASTRA (Codex), ART-SCALE-R4-KIL (Codex), ART-SCALE-R4-SAS (Codex Sasuke sub-agent), TOOL-045 (Claude), TOOL-048 (Claude), ART-TITLE-PRODUCTION-QA (Codex), OPS-PERM-20261012 (Codex), ART-R5-APPROVE-NARUTO (Codex), ART-R5-APPROVE-GOJO (Codex), ART-DECISION-SASUKE-20261015 (Codex), ART-R5-APPROVE-SASUKE (Codex), ART-DECISION-KILLUA-20261015 (Codex), ART-R5-APPROVE-KILLUA (Codex), ART-DECISION-NARUTO-20261015 (Codex), ART-R5-APPROVE-NARUTO-ALTS (Codex), ART-GOJO-RUN-JKL (Codex + Claude), ART-SCALE-LOOSE-20261015 (Codex), ART-LOOSE-NARUTO-20261015 (Codex), ART-LOOSE-KILLUA-20261015 (Codex)

### Last commits
- 25a28275 10-16 04:58 docs(art): record three fighter approvals via Claude
- c0990fb3 10-16 00:43 docs(art): record queued Goku and Luffy review
- 94fc1a7a 10-16 00:42 docs(art): hand off Goku and Luffy repair previews
- b5e961d9 10-16 00:05 docs(now): ENG-094 built; Cloudflare sign-in asked at the desk
- c81fcdbf 10-16 00:03 docs(goku): record two authorized redraw calls
- f22945b1 10-15 23:37 docs(now): request Goku and Luffy super art review
<!-- status:end -->
