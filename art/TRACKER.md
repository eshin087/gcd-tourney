Sasuke special v15 (2026-10-18): user approved via Claude skills relay send #20. Claude reports its trial pack with `special_v15.json` (`anatomy: auto-head`, `bodyHeight: 157`) resolves splitting/scale/clipping: auto-head x0.905, head 1.10, no clipping. v15 is restored to raw and manifest approvedVersion=15; v14 stays held. Claude owns adding sidecar/bodyHeight, remeasuring hand anchors and integration; final atlas/Astra/runtime checks are pending. The earlier unadjusted pack failed; its body report measured v13 only. [Review gallery](../public/reviews/sasuke-skills-batch1/index.html) · [provenance](characters/sasuke/production/skills-revamp-batch1/special_v15_provenance.md).

Sasuke skills revamp batch 1 approval (2026-10-18): user approved `chidori` v01 for Claude HD packing and approved `special` v14 as drawn, with head/clothing fullness preserved; Claude will fix its frame split (relay skills #17). Recorded in REVIEW/manifest. Visual approval does not clear special v14 strict scale/Astra/clipping holds or Chidori source layout/palette caveats; Claude owns technical packing and split correction.

Sasuke skills revamp batch 3 (2026-10-18): user approved `beamFire` v08 and all six A8-A13 effects via Claude relay skills #19. BeamFire sizing decision: Claude sets bodyHeight for head ~8% over idle and low-lunge body ~7% under; earlier auto-fit floor left head 1.15x, while matched-body read was 1.16. This is the user's sizing direction, not a Codex numeric calibration. `kirinStrike` reaches the cell top as briefed, per user clarification. Claude owns HD packing and in-game integration. [Batch 3 gallery](../public/reviews/sasuke-skills-batch3/index.html) · [provenance](characters/sasuke/production/skills-revamp-batch3/PROVENANCE.md).

Sasuke skills revamp batch 1 (2026-10-18): user approved chidoriForm, chidoriBurst, chidoriSpear and chidoriCurrent v01 via Claude relay skills #14; this approves those drawings only, and Claude owns their HD packing/game wiring. Via relay #15, user authorized special attempt 3 as v14 for pack/body/Astra review and a fresh three-call A1 Chidori budget. `special` v14 is filed and remains on Astra HOLD: scale gate fails, four frames clip, and the hand is absent on the thrust; the body tool has no v14 measurement because the gate prevented a candidate atlas. Fresh `chidori` v01 call 3 is filed for user review from 3/3 calls; it packs to eight 128 px preview frames but has 2172x724 letterboxed source, 125,575 RGBA colors and corner RGB(242,13,242), so the exact background/restricted palette fail and the branch packer does not create its HD atlas. [Gallery](../public/reviews/sasuke-skills-batch1/index.html) · [Astra audit](characters/sasuke/production/skills-revamp-batch1/special_v14_astra_audit_2026-10-18.md) · [Chidori provenance](characters/sasuke/production/skills-revamp-batch1/chidori_fresh_budget_provenance.md).

Naruto skills revamp batch 3 (2026-10-18): user approved rasenshuriken v01 (3 calls; selected call 3) and rasenshurikenDome v01 (1 call) via Claude relay skills #10. Approval is recorded; neither has candidate pack or runtime QA on this branch. Claude owns integration. [Gallery](../public/reviews/naruto-skills-batch3/index.html) · [provenance](characters/naruto/production/skills-revamp-batch3-provenance.md).

Naruto skills revamp batch 2 (2026-10-18): user approved rasengan, rasenganForm, rasenganBurst, poof and subLog v01 via Claude relay skills #9. Visual approval is recorded; no candidate pack or runtime check on this branch. Claude owns integration. Gallery: [batch 2](../public/reviews/naruto-skills-batch2/index.html).

Naruto Four-Tails beam round 2 (2026-10-18): user approved beamCharge v17, fourTailsRoar v02, beamFire v15 (+13px sidecar), beastBall v01 and beastBeamRing v01 via Claude relay skills #7. beamFire placement clears the candidate pack 4px margin; Claude confirmed effect pack/game placement. Visual approvals do not clear the headless character scale gate or contact/integration checks. Gallery: [round 2](../public/reviews/naruto-skills-round2/index.html).

> 2026-10-11 title-style pilot: Naruto, Sasuke, Killua and Gojo title_style_draft v01 and both lineups **approved**; they are the scale and anatomy baseline ([contract](scale/title-style-pilot/PRODUCTION_CONTRACT.md), ADR 0029). Production strips on PR69-72 are separate candidates.

# Art tracker

Naruto skills revamp batch 1 (2026-10-18): user approved beamCharge v17, fourTailsRoar v02, beamFire v15 with its +13px placement sidecar, beastBall v01 and beastBeamRing v01 via Claude relay skills #7. Earlier beamFire v14 pounce approval is superseded for this ultimate; ui_ult_fg v04 remains approved. Technical HOLD remains for the headless character scale gate and Claude-owned contacts/integration; do not claim final pack clearance. No new image calls.

Gojo dash family v10/v07/v12 (2026-10-15): backDash v07 is packed and remains needs review under Astra HOLD for tucked-frame placement and uncertain occluded torso/limb measurements; dash v10 and superDash v12 are quarantined after clipping/scale failures. Approved versions remain dash v06, backDash v04 and superDash v09. All call budgets are exhausted except one unused backDash call; no further generation authorized. See [Gojo review rows](characters/gojo/REVIEW_ROWS.md), [Astra audit](characters/gojo/production/dashes/ASTRA_DASHES_AUDIT_v01.md), and [preview](../public/reviews/gojo-dashes/index.html). No user approval, merge or production deploy.

Gojo production run v13: **user approved via Claude relay #6 ("Approve run v13")** on 2026-10-15. Approval is recorded in [REVIEW.md](REVIEW.md), [Gojo review rows](characters/gojo/REVIEW_ROWS.md) and the manifest (`run.approvedVersion=13`). Candidate is packed on `art/gojo-run`, but remains branch-only. Astra's final atlas audit returned **HOLD** for the new f6 free-arm/fist disappearance (slot 14); see [audit](characters/gojo/production/run-jkl/ASTRA_RUN_V13_AUDIT_v01.md). The user accepted the same lead leg in both halves, near fist forward in every frame and the B half ~10 px lower; this approval does not certify anatomy or clear the new defect. [Packed contact](../public/reviews/gojo-run-jkl/run_v13_contact_v01.png) · [GIF](../public/reviews/gojo-run-jkl/run_v13_loop_v01.gif).

Gojo J/L run-direction redo v02: the user favored K and asked to redo only J and L; K_v01 remains unchanged. J_v02 and L_v02 each used 3/3 calls; both stay **needs review / technical hold** because the mirrored lead-leg phases still repeat. J source f0 also touches the generation canvas edge. Side-by-side J_v02/K_v01/L_v02 contact sheets, GIF/MP4s, measured envelopes and provenance are in [review page](../public/reviews/gojo-run-jkl/index.html), [inventory](characters/gojo/production/run-jkl/attempt_inventory_v02.json) and [QA package](characters/gojo/production/run-jkl/package_qa_v02.json). These remain direction studies; no production raw or approval changed.

Gojo round4 checkpoint: idle_v07 and superDash_v08/v09 **needs review / QA HOLD**. Named drafts filed, no approvals changed. New idle wrong target bounds; full strict pack fails from changed head-probe denominator. superDash v09 isolated strict head1.03 but torso/limb chains remain short. [checkpoint](characters/gojo/production/round4/CHECKPOINT.md). Other listed suspects need complete segment audit before redraw.

Gojo J/K/L run-direction studies v01: **needs review; user pick pending**. Built-in generation used J 3 calls, K 1, L 1; selected candidates, shared 48-color strips, idle+8-frame contact sheets, looping GIF/MP4 and comparison GIF are filed in [review page](../public/reviews/gojo-run-jkl/index.html) with [QA](characters/gojo/production/run-jkl/QA_v01.md). J f3/f7 leave the far hand out of pocket; K f2/f6 hair is about 26% wide; all three second halves closely reprise the first instead of reading as a mirrored stride, so loop/alternation remain on hold. These are not production strips; the manifest remains shipped run v12 / approvedVersion12.
Gojo phase 2 production: at that handoff **no production strip was review-ready**. Dash v09 passed packer scale but Astra held the actual quantized atlas: slot 17 loses the near/right arm pump, torso garment axis appears shortened, and head shifts ~37 px across the loop. Its source is preserved under `raw/_qa_hold/`; the atlas was not changed after audit and is not release-ready. BackDash v05/v06 and superDash v10/v11 are also preserved under `raw/_qa_hold/` after exhausted budgets. Phase 3 later stitched run v13 from Part A and held Part B attempt 02 with no new calls; the user approved that candidate as drawn. Astra's audit now holds the packed run for the new f6 arm disappearance; the three user-accepted deviations were not failed. Exact hashes and findings are in [phase-2 inventory](characters/gojo/production/run-jkl/phase2_attempt_inventory_v01.json), [dash QA](characters/gojo/production/run-jkl/phase2_dash_qa_v01.json), [run audit](characters/gojo/production/run-jkl/ASTRA_RUN_V13_AUDIT_v01.md) and the [review page](../public/reviews/gojo-run-jkl/index.html). No merge or production deployment is claimed.
Gojo G/H/I run-direction studies v01: **G direction selected by user; H/I rejected**. G relaxed-arm glide proceeds to technical cleanup before production approval. [24 frames](../public/reviews/gojo-run-ghi/GHI_all_24_frames_v01.png), [playable GIF](../public/reviews/gojo-run-ghi/GHI_comparison_v01.gif), [QA](characters/gojo/production/run-ghi/QA_v01.md). Neutral head probes pass; alternating leg identity and seam remain technical holds. Production runv12 stays approved.

Gojo D/E/F run-direction studies v01: **needs review / technical HOLD**, three calls each, B/C rejected. [Combined24frames](../public/reviews/gojo-run-def/DEF_all_24_frames_v01.png), [playable comparison](../public/reviews/gojo-run-def/DEF_comparison_v01.gif), [QA](characters/gojo/production/run-def/QA_v01.md). Production run remains v12/approvedVersion12.
Gojo full B/C movement demo (2026-10-12): needs direction review. [Durable offline HTML v04](../docs/art-review/gojo-bc/gojo_BC_standalone_v04.html), normal/half-speed GIFs and all frames preserve the selected eight-frame v02 render after TEMP expired. Five drawing calls total (B A1/B2; C A1/B1), no new generation during recovery. 48 shared colors, zero clipped pixels; syntax and simulated controls pass. Browser playback, full anatomy and production scale gate remain unverified. Raw source filing still needs an accessible real worktree. Manifest run remains approved v12.

Gojo movement direction study v01 (2026-10-12): needs review, automatic tool output pending versioned filing in the attached real worktree. A athletic stride / B low pocket glide / C upright float. One concept call used; production run remains approved v12 in the manifest. No production strips were generated or packed this session. See newest REVIEW row.

Candidate idle comparison v01: derived QA of Naruto5/Sasuke6/Killua3/Gojo4 against approved neutrals; needs review, no animation approvals. See scale/CANDIDATE_IDLE_COMPARISON_V01.md.

Human-readable status of every art asset (hi-res sprite spec v2,
[ADR 0007](../docs/decisions/0007-art-spec-v2-shippuden-256.md)). The machine-readable twin is
[manifest.json](manifest.json); every generated image also has a row in the review queue
[REVIEW.md](REVIEW.md). **Update all three in the same commit** (Codex does this after every
generation, pack and review decision). Spec: [SPEC.md](SPEC.md). Order of work:
[PIPELINE.md](PIPELINE.md#generation-order).

All statuses were reset to `todo` when spec v2 replaced spec v1 (2026-10-08). The only v1 image, a
Naruto model-sheet candidate, is archived in `art/characters/naruto/reference/_old/` and recorded as
rejected (chibi) in REVIEW.md.

## Status legend

| status | meaning | who sets it |
|---|---|---|
| `todo` | nothing generated yet for spec v2 | - |
| `raw` | at least one candidate `_vNN` is saved (and queued in REVIEW.md), not packed yet | Codex / user |
| `packed` | `npm run sprites <id>` packed the latest version with no errors; it previews correctly in game with `?art=custom` (or in the Sprite Lab after "Load full sheet (.png + .json)…" with `public/characters/<id>/sheet.png` + `anims.json`; without that it shows the placeholder) | Codex / Claude |
| `approved` | the user approved a version in REVIEW.md (for strips: it looks right, hits visibly connect, no glitches) | user (Codex records it) |

Columns: **body px** = the animation's `bodyHeight` (tallest trimmed frame incl. hair, in the 256
cell); **version** = latest candidate `vNN` (`-` = none yet, `0` in the manifest); **approved** =
the approved `vNN` (`-` = none yet, `null` in the manifest). A status never goes down: when a newer
candidate arrives for an approved asset, it stays `approved` (version > approved means a candidate is
waiting in REVIEW.md), and the approved version stays until the user approves another one.

`packed` also needs the **scale gate** (TOOL-025): a new version passes `node tools/pack-sprites.mjs <id> --quantize 48`
(exit 0, no `scale gate:` line for it; a failure writes nothing) and its REVIEW row links `art/scale/heads-<id>.png`
(art/CHARACTER_SCALE.md "Scale gate (automatic)"). Approved strips the gate measured off their idle are listed with
their fix in [scale/SCALE_FIX_BRIEF.md](scale/SCALE_FIX_BRIEF.md) (ART-SCALE-02).

A character's sheet is used by the game automatically once **every core animation** (marked
**yes**) is at least `packed` (the packer then writes `"complete": true`). Before that, preview
with `http://127.0.0.1:5188/?art=custom`. Use the notes column for problems ("F03 fist too
low", "regenerate: hair color drifted"); per-version QA notes go in REVIEW.md.

## Corrected cast pilot — awaiting review

Latest height/build proposal: cast `proportion_lineup v04`, raw, no approved version. Naruto v02 is leaner with a larger head; Sasuke v01 is the user-preferred unchanged reference. Killua v01 and Gojo v03 use new review factors; Gojo v03 is slimmer after official-design review. [Latest QA](scale/PROPORTION_PILOT_V03.md). Full production still paused.

Reference samples only; existing production approvals stay unchanged. Full animation redraw waits for user review. [Gallery](../public/art-review/cast-proportion-pilot/index.html) · [QA](scale/PROPORTION_PILOT.md).

| Fighter | Asset | Latest | Status | Approved |
|---|---|---|---|---|
| Naruto | proportion_sample | v02 (v01 rejected: bulky/small head) | raw | — |
| Sasuke | proportion_sample | v01 | raw | — |
| Killua | proportion_sample | v01 | raw | — |
| Gojo | proportion_sample | v03 (v02 rejected: excess bulk) | raw | — |

## Summary

| character | reference (2) | core anims (23) | optional anims | UI (7) | sheet complete |
|---|---|---|---|---|---|
| naruto | 2/2 approved | 23/23 approved | 19/19 approved | 3/7 approved | yes; final batch approved |
| sasuke | 2/2 approved | 2/23 approved | 0/15 | 4/7 approved | no |
| killua | 2/2 approved | 23/23 approved | 19/19 approved | 3/7 approved | yes; final batch approved |
| gojo | 2/2 approved | 23/23 approved | 19/19 approved | 3/7 approved | yes; final batch approved |
| VFX atlas | 0/1 (style sheet, optional) | 15/20 effects approved (5 power-up effects todo, ENG-069) | - | - | custom atlas (approved 2026-10-10); new effects use procedural stand-ins |
| shared UI | - | - | - | 2/2 approved | - |
| ground decals | 0/1 (style sheet, required first) | 19/31 names (99 approved variants) | - | - | procedural (ADR 0024) |

Naruto and Sasuke can be produced in parallel (separate Codex threads); each thread updates only
its own section below.

## naruto

**Title-style approval (2026-10-11):** the user approved the latest candidates shown in the final review preview; `approved` = the exact version that played (UI portrait v02, cutin v03, select v02 promoted to ui/). The four historical strips that played (light1 v02, special v03, specialForward v02, specialUp v01) stay approved originals. Claude assembled the approved source-only parts with the fixed stitch (light1 v04, light2 v06, airLight3 v07, airHeavy v09, special v08 from v06 parts, specialForward v04, specialUp v04) and re-stitched heavy v12; their playback review is pending. Not shipped yet: see the holds per row and docs/NOW.md.

Title-style production in progress on `art/naruto-title-production`: the user approved `title_style_draft_v01` and neutral/combat samples as the current visual direction. BackDash v04 passed isolated candidate packing and awaits final review. The previously approved animation versions in this table describe historical shipped art; new idle v07, run v07, dash v04, jumpSquat v04, jumpUp v04, jumpFall v04, land v06, guard v05, block v05, hurtHigh v04, down v05, KO v07 and three UI images remain unapproved candidates. Dash/block/jumpFall passed isolated candidate packing; jumpSquat passed with explicit manual low-confidence QA. Idle/run/jumpUp and small-foot land have animation/anatomy holds; down/KO preserve original poses but have low-confidence scale/floor-contact holds; light1 v04 parts are rejected after stitch isolation failure. See [title-style QA](characters/naruto/production/title-style-qa/QA.md).

Brief: [characters/naruto/](characters/naruto/). Shippuden design, ~6.5 heads.

**Palette (2026-10-18, ADR 0046):** the Four-Tails fox (beamCharge, beamFire) packs with 8 of the 48 colours of its own (`paletteReserve.fourTails` in the manifest), so it keeps the approved crimson and white eyes/teeth; a new fox version keeps the reserve (re-check the packed strip against its raw at one scale).

| step | asset | frames | phases | core | body px | status | version | approved | notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 | reference/model_sheet_vNN.png -> model_sheet.png | - | - | yes | - | approved | v03 | v03 | User approved v03 on 2026-10-10 (seven-head proportions); promoted to model_sheet.png. v03 seven-head candidate needs review with lineup; see PROPORTION_REDRAW.md and v03 QA. User approved shorter-hair v02 on 2026-10-09; fixed model_sheet.png saved unchanged. Hair propagation complete: expressions/idle v02 and run v03 approved (ART-NAR-12) |
| 2 | reference/expressions_vNN.png -> expressions.png | - | - | yes | - | approved | v02 | v02 | User approved short-hair v02 on 2026-10-09; copied unchanged to expressions.png. Idle v02 and run v03 also approved; hair propagation complete (ART-NAR-12) |
| 3 | idle | 8 | - | **yes** | 165 | approved | v07 | v07 | HOLD (visual): part B packs ~3% small: 6 px crown snap at f7->f0 (re-stitch v08 rejected). Title-style v07 approved by the user 2026-10-11 (shown in the final review preview). |
| 4 | run | 8 | - | **yes** | 167 | approved | v08 | v07 | Round2 candidate needs review: Part B now places holstered right leg trailing on flight phases, opposite A. Isolated strict head ok .981–1.022; all x50..228. MOTION HOLD: native crown moves y74..114 and the f7→f0 seam changes posture/horizontal position sharply. Do not approve for shipping yet. |
| 5 | light1 | 7 | 2/2/3 | **yes** | 173 | approved | v04 | v02 | Review pending: v04 assembled from the approved parts. Approved original v02. |
| 5 | light2 | 7 | 2/2/3 | **yes** | 180 | approved | v06 | v05 | Review pending: v06 assembled; boots 1.36-1.42x in v05 and v06. Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | light3 | 7 | 2/2/3 | **yes** | 196 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | light4 | 8 | 3/2/3 | **yes** | 192 | approved | v08 | v08 | HOLD (visual): part A/B size step ~11%. Title-style v08 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | heavy | 8 | 3/2/3 | **yes** | 218 | approved | v12 | v11 | Review pending: v12 re-stitch (part B no longer 5-8% small). Title-style v11 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | airLight1 | 5 | 1/2/2 | **yes** | 198 | approved | v06 | v06 | Title-style v06 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | airHeavy | 6 | 2/2/2 | **yes** | 183 | approved | v09 | v08 | HOLD (strict gate): v09 pops (bowed-head f3); v08 ships. Title-style v08 approved by the user 2026-10-11 (shown in the final review preview). |
| 6 | guard | 2 | - | **yes** | 165 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 6 | hurtHigh | 3 | - | **yes** | 183 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 6 | launched | 2 | - | **yes** | 136 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 6 | down | 2 | - | **yes** | 96 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 6 | getup | 5 | - | **yes** | 195 | approved | v07 | v07 | Title-style v07 approved by the user 2026-10-11 (shown in the final review preview). |
| 7 | charge | 4 | - | **yes** | 172 | approved | v07 | v07 | User approved v07 on 2026-10-12. Previous production QA below is retained as evidence; other held assets are not approved by this decision. Round2 candidate needs review: Lean torso restored. Isolated strict ok; heads 1.020–1.083, no margins. Recommend approval after visual review. |
| 7 | beamCharge | 3 | - | **yes** | 174 | approved | v08 | v08 | Title-style v08 approved by the user 2026-10-11 (shown in the final review preview). |
| 7 | beamFire | 3 | - | **yes** | 153 | approved | v12 | v12 | Title-style v12 approved by the user 2026-10-11 (shown in the final review preview). |
| 7 | special | 8 | 3/3/2 | **yes** | 170 | approved | v08 | v03 | Review pending: v08 assembled from the approved v06 parts. Approved original v03. |
| 8 | dash | 2 | - | **yes** | 128 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 8 | jumpUp | 2 | - | **yes** | 198 | approved | v06 | v06 | User approved v06 on 2026-10-12. Previous production QA below is retained as evidence; other held assets are not approved by this decision. Round2 candidate needs review: Hair pulse corrected. Isolated strict ok; heads .947/1.000, no margins. Recommend approval after visual review. |
| 8 | jumpFall | 2 | - | **yes** | 209 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 8 | land | 2 | - | **yes** | 174 | approved | v06 | v06 | Title-style v06 approved by the user 2026-10-11 (shown in the final review preview). |
| 8 | win | 4 | - | **yes** | 193 | approved | v09 | v09 | User approved win v09 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass. |
| 9 | fTilt | 7 | 2/2/3 | no | 160 | approved | v02 | v02 | User approved as drawn via Claude relay combat #20; visual approval only. Technical HOLD (scale/anatomy, strip dimensions and hard-pixel checks); see [v02 review](../public/reviews/normals-killua/v02/index.html#fTilt). |
| 9 | uTilt | 7 | 3/2/2 | no | 214 | approved | v03 | v03 | v02 approved via Claude relay #20; v03 approved as drawn via relay combat #27. Per #28, source pixels are unchanged and imported with ×0.75 auto-head fit. Final Astra audit passes visual scale/anatomy (head median 1.025, feet proxy 1.287; B=.918 advisory); Claude contact check remains. [packed R2 review](../public/reviews/normals-killua/r2-uTilt/index.html) · [Astra audit](characters/killua/production/ENG112_R2_FINAL_FITTED_ASTRA_AUDIT.md). |
| 9 | dTilt | 6 | 2/2/2 | no | 171 | approved | v02 | v02 | User approved as drawn via Claude relay combat #20; visual approval only. Technical HOLD (scale/anatomy, strip dimensions and hard-pixel checks); see [v02 review](../public/reviews/normals-killua/v02/index.html#dTilt). |
| 9 | dashAttack | 7 | 2/2/3 | no | 166 | approved | v02 | v02 | User approved as drawn via Claude relay combat #20; visual approval only. Technical HOLD (timing, scale/anatomy, strip dimensions and hard-pixel checks); see [v02 review](../public/reviews/normals-killua/v02/index.html#dashAttack). |
| 9 | fSmash | 9 | 4/2/3 | no | 166 | approved | v02 | v02 | User approved as drawn via Claude relay combat #20; visual approval only. Technical HOLD (scale/anatomy, strip dimensions and hard-pixel checks); see [v02 review](../public/reviews/normals-killua/v02/index.html#fSmash). |
| 9 | uSmash | 8 | 4/2/2 | no | 214 | approved | v02 | v02 | User approved as drawn via Claude relay combat #20; imported at ×0.8613 with version-bound f4/f5 false-probe exemptions. Final Astra audit finds no conspicuously small body (B=.853 advisory; no five-segment ±6% certification); Claude contact check remains. [packed R2 review](../public/reviews/normals-killua/r2-uTilt/index.html) · [Astra audit](characters/killua/production/ENG112_R2_FINAL_FITTED_ASTRA_AUDIT.md). |
| 9 | dSmash | 8 | 3/2/3 | no | 171 | approved | v03 | v03 | User approved as drawn via Claude relay #22. Visual approval only. Technical HOLD (source layout/style, x=0 boot cut, weak rear reach and scale/anatomy); see [v03 review](../public/reviews/normals-killua/v03/index.html#dSmash). |
| 9 | fair | 6 | 2/2/2 | no | 174 | approved | v02 | v02 | User approved as drawn via Claude relay combat #20; visual approval only. Technical HOLD (margin, scale/anatomy, strip dimensions and hard-pixel checks); see [v02 review](../public/reviews/normals-killua/v02/index.html#fair). |
| 9 | bair | 6 | 2/2/2 | no | 180 | approved | v02 | v02 | User approved as drawn via Claude relay combat #20; visual approval only. Technical HOLD (clipping, aerial read, scale/anatomy, strip dimensions and hard-pixel checks); see [v02 review](../public/reviews/normals-killua/v02/index.html#bair). |
| 9 | uair | 6 | 2/2/2 | no | 214 | approved | v02 | v02 | User approved as drawn via Claude relay combat #20; shipped with ×0.75 auto-head fit per user decision relay #28; f2/f3 have version-bound false-probe exemptions. Astra confirms compact body volume (B=.783) as an advisory accepted by the user, with connected limbs and all frames inside the cell; not unrestricted anatomy certification. Claude contact check remains. [packed R2 review](../public/reviews/normals-killua/r2-uTilt/index.html) · [Astra audit](characters/killua/production/ENG112_R2_FINAL_FITTED_ASTRA_AUDIT.md). |
| 9 | backDash | 3 | - | no | 180 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | superDash | 2 | - | no | 120 | approved | v03 | v03 | Title-style v03 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | jumpSquat | 1 | - | no | 128 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | airLight2 | 5 | 1/2/2 | no | 179 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | airLight3 | 6 | 2/2/2 | no | 201 | approved | v09 | v09 | v08 user-rejected; v09 art approved by user 2026-10-12; technical holds are separate. New whole kick cycle, same title anatomy and compact crescent. Fresh-idle measured stitchB0.7164; measuredf2 -8pxplacement restoresmargin. Final isolated strict exit0, ok heads1.016–1.054, x61..251,48colors,0warnings. Strict QA passed. |
| 9 | block | 2 | - | no | 170 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | hurtLow | 3 | - | no | 171 | approved | v03 | v03 | Title-style v03 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | spin | 4 | - | no | 160 | approved | v07 | v07 | Title-style v07 approved by the user 2026-10-12 as a stand-in until the round-3 redraw. Size exception recorded: the head is drawn 10-18% big for the body (strict: unmeasured tumble, no manual pass) until spin v08. |
| 9 | airRecover | 3 | - | no | 180 | approved | v07 | v07 | Title-style v07 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | throw | 4 | 1/1/2 | no | 163 | approved | v09 | v09 | Title-style v09 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | vanish | 2 | - | no | 221 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | stagger | 4 | - | no | 207 | approved | v08 | v08 | User approved stagger v08 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass. |
| 9 | ko | 1 | - | no | 59 | approved | v09 | v09 | v08 user-rejected; v09 art approved by user 2026-10-12; technical holds are separate. Whole original supine pose redrawn; clearer sourceface/neck. Official59pxpack x4..177 but visiblyunder-scale; strict exit1 unmeasured, contact30%, worstfifth18px. HOLD. Separate77px whole-fit proposal x6..232 isDIAGNOSTICONLY, unmeasured and notproductiontarget/pass; Claude calibration/anatomy/contactreview required. |
| 9 | intro | 4 | - | no | 167 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | taunt | 2 | - | no | 198 | approved | v10 | v10 | User approved v10 as drawn 2026-10-15; visual decision only. Astra round5 full-anatomy HOLD remains; Claude owns technical clearance. Round4 v10 is a source-only torso redraw preserving both pointing/callout poses, head and shoes; explicitly targets upright collar-to-hem about 1.3x head height. Calibrated atlas715a1773 audited; no anatomy pass. Calls: historical3 + round4 3 of 3 = 6 cumulative; budget exhausted. Earlier unrelated v08 remains quarantined. [attempt](characters/naruto/production/round4/taunt-attempt3.md).
| 9 | specialForward | 7 | 2/2/3 | no | 210 | approved | v04 | v02 | Review pending: v04 assembled from the approved parts. Approved original v02. |
| 9 | specialUp | 6 | 2/2/2 | no | 237 | approved | v04 | v01 | Review pending: v04 assembled (bodyHeight 237 = cell maximum). Approved original v01. |
| 9 | specialDown | 4 | 2/1/1 | no | 204 | approved | v05 | v05 | User approved v05 on 2026-10-12. Previous production QA below is retained as evidence; other held assets are not approved by this decision. Round2 candidate needs review: Bowed head kept compact across feral phases. Isolated strict ok; heads .973–1.059. Stale v02 exemption remains historical, not applied. Recommend approval after visual review. |
| 9 | superPose | 4 | - | no | 165 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 11 | ui/portrait.png (96x96) | - | - | no | - | approved | v02 | v02 | Title-style v02 approved by the user 2026-10-11 (shown in the final review preview); copied to ui/. |
| 11 | ui/cutin.png (480x128) | - | - | no | - | approved | v03 | v03 | Title-style v03 approved by the user 2026-10-11 (shown in the final review preview); copied to ui/. |
| 11 | ui/select.png (384x384) | - | - | no | - | approved | v02 | v02 | Title-style v02 approved by the user 2026-10-11 (shown in the final review preview); copied to ui/. |
| 11 | ui/super_bg.png (768x192) | - | - | no | - | approved | v01 | v01 | Round 2a Naruto candidate; approval pending via the desk. Source 1536x1024; final 4:1 crop and hard-pixel/color checks are pending. User approved v01 via Claude relay effects #8 (2026-10-16); technical findings retained where applicable. |
| 11 | ui/super_fg.png (384x240) | - | - | no | - | approved | v01 | v01 | Round 2a Naruto candidate; approval pending via the desk. Astra HOLD: required clone silhouettes absent, palm angles viewer-left; source has soft edges, excessive colors/partial alpha. User approved v01 via Claude relay effects #8 (2026-10-16); technical findings retained where applicable. |
| 11 | ui/ult_bg.png (768x432) | - | - | no | - | approved | v01 | v01 | Round 2a Naruto candidate; approval pending via the desk. Source 1672x941; final crop and hard-pixel/color checks are pending. User approved v01 via Claude relay effects #8 (2026-10-16); technical findings retained where applicable. |
| 11 | ui/ult_fg.png (576x432) | - | - | no | - | approved | v01 | v01 | Round 2a Naruto candidate; approval pending via the desk. Astra HOLD: substantial normal hair, skin and orange clothing remain exposed rather than a continuous Four-Tails shroud; soft edges/excessive colors/partial alpha. User approved v01 via Claude relay effects #8 (2026-10-16); technical findings retained where applicable. New v04 was also approved via Claude relay skills #4 on 2026-10-18 and is the current approved source. |

User explicitly kept v04 held on 2026-10-15. Not approved; contact and technical HOLD retained; no further generation authorized.

- User approved airLight1Alt v01 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass.

- User approved airLight2Alt v01 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass.

- User approved airLight3Alt v01 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass.

- User approved heavyAlt v02 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass.

- User approved hurtHighAlt v01 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass.

- User approved hurtLowAlt v01 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass.

- User approved light1Alt v01 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass.

- User approved light3Alt v02 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass.

- User approved light4Alt v01 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass.

## sasuke

Beam clash round 4: ground `beamStruggle_v02` selected from attempt03 after relay #14 authorized 3 additional calls (cumulative 6/6). Quantized candidate auto head gate passes against idle; Astra holds torso (32–35 px vs39–44) and hand stability (fingertips x214/199/208 ±2 move 15/9 px); legs improve to 81–86 vs83–90 px. v02 remains in `raw/_qa_hold/`, v01 stays approved/live (`approvedVersion` 1), no production atlas or user approval. See [generation ledger](characters/sasuke/production/beam-clash-r4/GENERATION_LOG.md), [measurements](characters/sasuke/production/beam-clash-r4/MEASUREMENTS.md), and [round-4 review assets](../public/reviews/beam-clash-r3/). All three air strips unchanged.



Round4: superDash v07, beamFire v07, dash v07 need review. jumpSquat v07 is user-approved as drawn; technical HOLD remains; standard strict pack fails because v06 manual QA does not apply. A separate gate-warn diagnostic atlas is filed under `production/round6/diagnostic-v07/`; its head/body scale verdict remains unmeasured. All9 prior strips inspected; numerical joint/skull certification remains inconclusive, SD clips10/4px, strict pack holds JS. Production atlas preserved. [Audit](characters/sasuke/production/round4/SEGMENT_AUDIT.md).


**Title-style approval (2026-10-11):** the user approved the latest candidates shown in the final review preview; `approved` = the exact version that played for the 33 title-style strips. The preview also played throw v05 and stagger v06: approved, but they fail the strict scale gate and stay in raw/_rejected, so the approved originals ship. The approved originals also ship for launched, spin, airRecover, down, ko, specialUp and superPose (scale-checked against the new idle). UI: the preview showed v01 labelled v02, so v02 is still unreviewed and v01 ships. Not shipped yet: see docs/NOW.md.

Title-style redraw in progress: user approved `title_style_draft_v01` and the neutral/combat cells. New idle v07 and guard v04 are provisional candidates for the full 42-animation/3-UI batch; old approved versions remain recorded separately. [Production QA](characters/sasuke/production/title-style/QA.md). The pilot's 90×209 neutral, 155×180 combat and 197 px body target supersede the old universal head ratio for this batch.

Brief: [characters/sasuke/](characters/sasuke/). Shippuden (Hebi-era) design, ~6.5 heads, sword
sheathed at the back of the belt.

Body scale: same as Naruto and the same `bodyHeight` table (spec v1's "minus 6 px" offsets are
gone). After both idles are packed, compare his head size (about 31 px) with Naruto's `idle` in the
Sprite Lab; if his hair adds clearly less height and his head comes out bigger, lower his upright
`bodyHeight` overrides in `manifest.json` and note it here.

| step | asset | frames | phases | core | body px | status | version | approved | notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 | reference/model_sheet_vNN.png -> model_sheet.png | - | - | yes | - | approved | v02 | v02 | User approved v02 on 2026-10-10 (seven-head proportions); promoted to model_sheet.png. New smaller-head v02 needs review; approved fixed reference remains v01. See PROPORTION_REDRAW.md and v02 QA. User approved v01 on 2026-10-09; documented QA: V too deep, estimated 7.3 heads, sword projection drift, 36/34 swatches, near-magenta background; see REVIEW.md |
| 2 | reference/expressions_vNN.png -> expressions.png | - | - | yes | - | approved | v01 | v01 | User approved v01 on 2026-10-09; recorded QA: 8 readable expressions, approved identity; Sharingan marks stylized; raw head scale and magenta differ from prompt; see REVIEW.md |
| 3 | idle | 8 | - | **yes** | 180 | approved | v07 | v07 | Title-style v07 approved by the user 2026-10-11 (shown in the final review preview). |
| 4 | run | 8 | - | **yes** | 150 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | light1 | 7 | 2/2/3 | **yes** | 180 | approved | v09 | v09 | Title-style v09 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | light2 | 7 | 2/2/3 | **yes** | 180 | approved | v07 | v07 | Title-style v07 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | light3 | 7 | 2/2/3 | **yes** | 190 | approved | v08 | v08 | Title-style v08 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | light4 | 8 | 3/2/3 | **yes** | 193 | approved | v08 | v08 | Title-style v08 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | heavy | 8 | 3/2/3 | **yes** | 218 | approved | v11 | v11 | User approved v11 on 2026-10-12. Previous production QA below is retained as evidence; other held assets are not approved by this decision. Round 2 strict ok candidate; needs user review; approved version retained. [QA](characters/sasuke/production/title-style/round2/QA.md). |
| 5 | airLight1 | 5 | 1/2/2 | **yes** | 198 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | airHeavy | 6 | 2/2/2 | **yes** | 198 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 6 | guard | 2 | - | **yes** | 180 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 6 | hurtHigh | 3 | - | **yes** | 174 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 6 | launched | 2 | - | **yes** | 136 | approved | v07 | v01 | Round 2 HOLD candidate; not recommended; approved version retained. [QA](characters/sasuke/production/title-style/round2/QA.md). |
| 6 | down | 2 | - | **yes** | 96 | approved | v08 | v01 | Round 2 HOLD candidate; not recommended; approved version retained. [QA](characters/sasuke/production/title-style/round2/QA.md). |
| 6 | getup | 5 | - | **yes** | 180 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 7 | charge | 4 | - | **yes** | 180 | approved | v12 | v12 | User approved v12 on 2026-10-12. Previous production QA below is retained as evidence; other held assets are not approved by this decision. Round 2 strict ok candidate; needs user review; approved version retained. [QA](characters/sasuke/production/title-style/round2/QA.md). |
| 7 | beamCharge | 3 | - | **yes** | 230 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 7 | beamFire | 3 | - | **yes** | 198 | approved | v07 | v07 | User approved beamFire v07 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass. |
| 7 | special | 8 | 3/3/2 | **yes** | 204 | approved | v13 | v13 | Title-style v13 approved by the user 2026-10-11 (shown in the final review preview). |
| 8 | dash | 2 | - | **yes** | 160 | approved | v07 | v07 | User approved dash v07 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass. |
| 8 | jumpUp | 2 | - | **yes** | 198 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 8 | jumpFall | 2 | - | **yes** | 209 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 8 | land | 2 | - | **yes** | 174 | approved | v03 | v03 | Title-style v03 approved by the user 2026-10-11 (shown in the final review preview). |
| 8 | win | 4 | - | **yes** | 212 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | backDash | 3 | - | no | 180 | approved | v07 | v07 | User approved v07 on 2026-10-12. Previous production QA below is retained as evidence; other held assets are not approved by this decision. Round 2 strict ok candidate; needs user review; approved version retained. [QA](characters/sasuke/production/title-style/round2/QA.md). |
| 9 | superDash | 2 | - | no | 108 | approved | v07 | v07 | User approved superDash v07 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass. |
| 9 | jumpSquat | 1 | - | no | 162 | approved | v07 | v07 | User approved v07 as drawn on 2026-10-15. Visual approval only; all Astra anatomy and technical HOLDs remain for Claude. No merge or production authorization. |
| 9 | airLight2 | 5 | 1/2/2 | no | 207 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | airLight3 | 6 | 2/2/2 | no | 201 | approved | v07 | v07 | Title-style v07 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | block | 2 | - | no | 180 | approved | v07 | v07 | User approved v07 on 2026-10-12. Previous production QA below is retained as evidence; other held assets are not approved by this decision. Round 2 strict ok candidate; needs user review; approved version retained. [QA](characters/sasuke/production/title-style/round2/QA.md). |
| 9 | hurtLow | 3 | - | no | 166 | approved | v03 | v03 | Title-style v03 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | spin | 4 | - | no | 160 | approved | v01 | v01 | Fallback: original v01 (manual scale pass; title v03 viable but unreviewed). Approved original v01. |
| 9 | airRecover | 3 | - | no | 180 | approved | v01 | v01 | Fallback: original v01 (manual scale pass; title v03 viable but unreviewed). Approved original v01. |
| 9 | throw | 4 | 1/1/2 | no | 201 | approved | v07 | v07 | User approved v07 on 2026-10-12. Previous production QA below is retained as evidence; other held assets are not approved by this decision. Round 2 strict ok candidate; needs user review; approved version retained. [QA](characters/sasuke/production/title-style/round2/QA.md). |
| 9 | vanish | 2 | - | no | 221 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | stagger | 4 | - | no | 216 | approved | v08 | v08 | User approved v08 on 2026-10-12. Previous production QA below is retained as evidence; other held assets are not approved by this decision. Round 2 strict ok candidate; needs user review; approved version retained. [QA](characters/sasuke/production/title-style/round2/QA.md). |
| 9 | ko | 1 | - | no | 64 | approved | v07 | v02 | Round 2 HOLD candidate; not recommended; approved version retained. [QA](characters/sasuke/production/title-style/round2/QA.md). |
| 9 | intro | 4 | - | no | 210 | approved | v03 | v03 | Title-style v03 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | taunt | 2 | - | no | 212 | approved | v03 | v03 | Title-style v03 approved by the user 2026-10-11 (shown in the final review preview). |
| 11 | ui/portrait.png (96x96) | - | - | no | - | approved | v02 | v01 | v02 never shown (the preview showed v01); v01 ships. Approved v01. |
| 11 | ui/cutin.png (480x128) | - | - | no | - | approved | v02 | v01 | v02 never shown; v01 ships. Approved v01. |
| 11 | ui/select.png (384x384) | - | - | no | - | approved | v02 | v01 | v02 never shown; v01 ships. Approved v01. |

| 9 | specialForward | 7 | 2/2/3 | no | 204 | approved | v10 | v10 | Title-style v10 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | specialUp | 6 | 2/2/2 | no | 203 | approved | v09 | v09 | User approved v09 on 2026-10-12. Previous production QA below is retained as evidence; other held assets are not approved by this decision. Round 2 strict ok candidate; needs user review; approved version retained. [QA](characters/sasuke/production/title-style/round2/QA.md). |
| 9 | specialDown | 4 | 2/1/1 | no | 204 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | superPose | 4 | - | no | 208 | approved | v01 | v01 | Fallback: original v01 (title v03 passes but was never shown). Approved original v01. |
| 9 | fTilt | 7 | 3/2/2 | no | 180 | approved | v03 | v03 | User approved as drawn via Claude relay combat #7. Strict scale gate reports true head drift 1.14 vs feet 1.04; v03 remains in `_qa_hold` and fallback active. Relay #16 authorized one deterministic ~12% head shrink with no image calls; prototypes showed magenta seams through the hair/face, so no v04 was saved and v03 remains byte-untouched (SHA-256 `8BEADFCD2FF7D0490BE491D123D55C5F1F25D0ED4E8019A12C5D7DB3A8FCF440`). Await a new user decision on any alternate edit method. [ENG-112 review](../public/reviews/normals-sasuke/). |
| 9 | uTilt | 7 | 2/2/3 | no | 213 | approved | v05 | v05 | User approved v01 via relay #3; v05 approved as edited via Claude relay combat #15: “Approve uTilt v05”. Per relay #11, v05 deterministically enlarges only head/hair about 8% from v01 pixels; v02/v03 failures and v04 local edit are preserved, not reused. Astra inspected quantized cells 181–187 and found the head-edit seam/pose pass for review; full numerical scale remains HOLD (readable f6 head .921 ±2–3 px; body B median .917 vs .93 target). Default candidate gate passes with version-bound v05 f2/f3 false arm-probe exemptions; drawing approval recorded via relay #15; strict pack passes with v05-only Astra-evidenced exemptions. B=.917 and readable f6 head .921 ±2–3px remain advisory; runtime contact remains Claude's check. [ENG-112 review](../public/reviews/normals-sasuke/#utile-v05). [v05 pixel-edit/Astra record](characters/sasuke/production/uTilt_v05_pixel_edit.md). |
| 9 | dTilt | 6 | 3/2/1 | no | 200 | approved | v06 | v05 | Approved by the user via Claude relay combat #13: “Approve dTilt v05”. Relay #14 rejected v06 (“v05 stays the approved dTilt; keep v06 on file, no more dTilt work”); v06 is preserved under `raw/_rejected/` and excluded from packing. The approved v05 pack/audit found the crouched shin-height kick on active f3/f4; body B=.73 is a quantitative advisory and runtime hit landing/timing remain Claude's check. [ENG-112 review](../public/reviews/normals-sasuke/). [v06 generation ledger](characters/sasuke/production/dTilt_v06_generation_attempts.md). |
| 9 | dashAttack | 7 | 2/2/3 | no | 193 | approved | v05 | v05 | User approved as drawn via Claude relay combat #7. Astra scale/anatomy and phases now [3,2,2]; auto-head importer fit measured x0.7502. Strict pack includes v05; source has touching groups and runtime contact remains Claude's check. [ENG-112 review](../public/reviews/normals-sasuke/). |
| 9 | fSmash | 9 | 4/2/3 | no | 193 | approved | v02 | v02 | User approved v02 as drawn via Claude relay combat #3. Astra technical HOLD remains; v03 stays held for 2 px margin clipping. f1 is the held charge pose. [ENG-112 review](../public/reviews/normals-sasuke/). |
| 9 | uSmash | 8 | 3/2/3 | no | 213 | approved | v05 | v05 | User approved as drawn via Claude relay combat #7. User-approved v05 is packed after uniform import `packScale: 1.111`; Astra corrected-atlas PASS for visual anatomy/assembly/clipping (head .968–1.000, median .996; f4 top margin 4px). Frames 3/4 have version-bound false-probe exemptions; intrinsic segment tolerances/runtime contact remain unverified. [ENG-112 review](../public/reviews/normals-sasuke/). |
| 9 | dSmash | 8 | 3/2/3 | no | 200 | technical hold | v03 | - | User directed via Claude relay combat #8 that dSmash keeps its stand-in. Prior v03 remains preserved in hold; no further dSmash candidate is requested. [ENG-112 review](../public/reviews/normals-sasuke/). |
| 9 | fair | 6 | 2/2/2 | no | 203 | approved | v03 | v03 | User approved v03 as drawn via Claude relay combat #3. Astra post-fit head audit passes (median .992, range .033) after measured importer fit x0.9407; source drawing unchanged. Body sheet B=.73–.81 remains advisory pending precise segment measurements; runtime contact remains Claude's check. [ENG-112 review](../public/reviews/normals-sasuke/). |
| 9 | bair | 6 | 2/2/2 | no | 194 | approved | v01 | v01 | User approved v01 as drawn via Claude relay combat #3. Astra technical HOLD remains for scale/anatomy, registration and runtime contact. [ENG-112 review](../public/reviews/normals-sasuke/). |
| 9 | uair | 6 | 2/2/2 | no | 213 | approved | v01 | v01 | User approved v01 as drawn via Claude relay combat #3. Astra confirms the f1 probe box hits a raised forearm; version-bound f1 exemption yields `ok` (median head 1.000, range .056). Runtime contact remains Claude's check. [ENG-112 review](../public/reviews/normals-sasuke/). |

User approved v07 as drawn on 2026-10-15. Visual approval only; all Astra anatomy and technical HOLDs remain for Claude. No merge or production authorization.

## killua

ENG-112 Killua (2026-10-18): user approved fTilt, uTilt, dTilt, dashAttack, fSmash, uSmash, fair, bair and uair v02 as drawn via Claude relay combat #20, and approved dSmash v03 as drawn via relay #22 (v02 not approved). All ten drawings are visually approved; all ten still have technical holds. v03 diagnostic pack: 54 animations / 251 frames; the branch's shipped baseline remains 44 animations / 181 frames. Packer head/feet proxies for dSmash v03 are 1.244/1.402. Raw canvas is 2172x724, not the required 2048x256 strip. Review: [dSmash v03 page](../public/reviews/normals-killua/v03/index.html); [v02 packed page](../public/reviews/normals-killua/v02/index.html); [generation provenance](characters/killua/raw/_qa_hold/ENG112_NORMALS_V02_PROVENANCE.md).

**Title-style approval (2026-10-11):** the user approved the latest candidates shown in the final review preview (all 42 strips and UI portrait v02, cutin v03, select v02, promoted to ui/); `approved` = the exact version that played. The scale gate measures against the approved title-style combat cell (art/scale/builds.json scaleReference). Not shipped yet: see the holds per row and docs/NOW.md.

Brief: [characters/killua/](characters/killua/). Godspeed era (Chimera Ant arc): loose purple
long-sleeved shirt with a navy rolled collar, white undershirt cuffs and hem, navy shorts,
purple-and-white high-tops; ~6 heads. Confirm the outfit at the S1 model-sheet review.

Body scale: **shorter than the cast** (standing body 182 px instead of 200, `standingBodyPx: 182`,
[ADR 0010](../docs/decisions/0010-per-character-body-scale.md)): every `bodyHeight` is the shared
value x 0.91 (`heavy` 206 so its claw still reaches the F04 zone). Kit animations (ADR 0009):
`specialForward` = Rhythm Echo strike, `specialUp` = Thunderbolt rise, `specialDown` = Godspeed
activation, `superPose` = Whirlwind pose. 42 animations = 175 frames = an 11-row sheet.

| step | asset | frames | phases | core | body px | status | version | approved | notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 | reference/model_sheet_vNN.png -> model_sheet.png | - | - | yes | - | approved | v01 | v01 | user approved 2026-10-09 with documented palette/background deviations; complete final batch now approved |
| 2 | reference/expressions_vNN.png -> expressions.png | - | - | yes | - | approved | v01 | v01 | User approved final batch 2026-10-09; fixed reference/UI promoted |
| 3 | idle | 8 | - | **yes** | 146 | approved | v11 | v11 | User approved idle v11 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass. |
| 4 | run | 8 | - | **yes** | 158 | approved | v09 | v09 | Title-style v09 approved by the user 2026-10-12 as a stand-in until the round-3 redraw. |
| 5 | light1 | 7 | 2/2/3 | **yes** | 151 | approved | v10 | v10 | Title-style v10 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | light2 | 7 | 2/2/3 | **yes** | 160 | approved | v06 | v06 | Title-style v06 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | light3 | 7 | 2/2/3 | **yes** | 180 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | light4 | 8 | 3/2/3 | **yes** | 166 | approved | v10 | v10 | Title-style v10 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | heavy | 8 | 3/2/3 | **yes** | 214 | approved | v11 | v11 | Title-style v11 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | airLight1 | 5 | 1/2/2 | **yes** | 166 | approved | v06 | v06 | Title-style v06 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | airHeavy | 6 | 2/2/2 | **yes** | 164 | approved | v08 | v08 | Title-style v08 approved by the user 2026-10-11 (shown in the final review preview). |
| 6 | guard | 2 | - | **yes** | 140 | approved | v09 | v09 | User approved guard v09 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass. |
| 6 | hurtHigh | 3 | - | **yes** | 150 | approved | v06 | v06 | Title-style v06 approved by the user 2026-10-11 (shown in the final review preview). |
| 6 | launched | 2 | - | **yes** | 106 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 6 | down | 2 | - | **yes** | 90 | approved | v08 | v08 | User approved v08 as drawn via Claude 2026-10-15 (relay scale#6, quote: “i approve those 5”). Runtime grounding/contact remains Claude-owned; calibration uncertainty is not a numeric ±6% pass. |
| 6 | getup | 5 | - | **yes** | 158 | approved | v07 | v07 | Title-style v07 approved by the user 2026-10-11 (shown in the final review preview). |
| 7 | charge | 4 | - | **yes** | 125 | approved | v14 | v14 | User approved v14 as drawn via Claude 2026-10-15 (relay scale#6, quote: “i approve those 5”). Aura retention in quantized cells remains unverified; calibration uncertainty is not a numeric ±6% pass. |
| 7 | beamCharge | 3 | - | **yes** | 170 | approved | v08 | v08 | Title-style v08 approved by the user 2026-10-11 (shown in the final review preview). |
| 7 | beamFire | 3 | - | **yes** | 123 | approved | v09 | v09 | Title-style v09 approved by the user 2026-10-12 as a stand-in until the round-3 redraw. |
| 7 | special | 8 | 3/3/2 | **yes** | 170 | approved | v07 | v07 | Title-style v07 approved by the user 2026-10-11 (shown in the final review preview). |
| 8 | dash | 2 | - | **yes** | 122 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 8 | jumpUp | 2 | - | **yes** | 148 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 8 | jumpFall | 2 | - | **yes** | 165 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 8 | land | 2 | - | **yes** | 132 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 8 | win | 4 | - | **yes** | 186 | approved | v05 | v04 | Round4 v05 needs review; no full-body pass, calibration/anatomy hold. [QA](characters/killua/production/round4/QA.md).  Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | backDash | 3 | - | no | 160 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | superDash | 2 | - | no | 98 | approved | v08 | v08 | User approved superDash v08 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass. |
| 9 | jumpSquat | 1 | - | no | 115 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | airLight2 | 5 | 1/2/2 | no | 170 | approved | v07 | v07 | Title-style v07 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | airLight3 | 6 | 2/2/2 | no | 180 | approved | v09 | v09 | Title-style v09 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | block | 2 | - | no | 151 | approved | v07 | v07 | Title-style v07 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | hurtLow | 3 | - | no | 149 | approved | v06 | v06 | Title-style v06 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | spin | 4 | - | no | 136 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | airRecover | 3 | - | no | 145 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | throw | 4 | 1/1/2 | no | 173 | approved | v06 | v06 | Title-style v06 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | vanish | 2 | - | no | 185 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | stagger | 4 | - | no | 186 | approved | v08 | v08 | User approved v08 as drawn on 2026-10-15. Visual approval only; all Astra anatomy and technical HOLDs remain for Claude. No merge or production authorization. |
| 9 | ko | 1 | - | no | 78 | approved | v09 | v09 | User approved v09 as drawn via Claude 2026-10-15 (relay scale#6, quote: “i approve those 5”). Runtime grounding and state-transition remain Claude-owned; calibration uncertainty is not a numeric ±6% pass. |
| 9 | intro | 4 | - | no | 186 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | taunt | 2 | - | no | 186 | approved | v05 | v05 | User approved v05 on 2026-10-12. Previous production QA below is retained as evidence; other held assets are not approved by this decision. New v05 needs review: compact hair, head0.996 ok; recommend approval. One authorized call remains unused. [QA](characters/killua/production/title-style/round2/QA.md). |
| 9 | specialForward | 7 | 2/2/3 | no | 139 | approved | v12 | v12 | Title-style v12 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | specialUp | 6 | 2/2/2 | no | 197 | approved | v08 | v08 | Title-style v08 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | specialDown | 4 | 2/1/1 | no | 180 | approved | v07 | v07 | Title-style v07 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | superPose | 4 | - | no | 186 | approved | v08 | v08 | Title-style v08 approved by the user 2026-10-11 (shown in the final review preview). |
| 11 | ui/portrait.png (96x96) | - | - | no | - | approved | v02 | v02 | Title-style v02 approved by the user 2026-10-11 (shown in the final review preview); copied to ui/. |
| 11 | ui/cutin.png (480x128) | - | - | no | - | approved | v03 | v03 | Title-style v03 approved by the user 2026-10-11 (shown in the final review preview); copied to ui/. |
| 11 | ui/select.png (384x384) | - | - | no | - | approved | v02 | v02 | Title-style v02 approved by the user 2026-10-11 (shown in the final review preview); copied to ui/. |
| 11 | ui/super_bg.png (768x192) | - | - | no | - | approved | v01 | v01 | Round 2a Killua candidate; approval pending via the desk. Source 1536x1024; final 4:1 crop and hard-pixel/color checks are pending. User approved v01 via Claude relay effects #8 (2026-10-16); technical findings retained where applicable. |
| 11 | ui/super_fg.png (384x240) | - | - | no | - | approved | v01 | v01 | Round 2a Killua candidate; visual identity passes Astra review; technical HOLD: wide source leaves the bust small at fit, with edge contact/soft pixels and excessive colors/partial alpha. User approved v01 via Claude relay effects #8 (2026-10-16); technical findings retained where applicable. |
| 11 | ui/ult_bg.png (768x432) | - | - | no | - | approved | v01 | v01 | Round 2a Killua candidate; approval pending via the desk. Source 1536x1024; final crop and hard-pixel/color checks are pending. User approved v01 via Claude relay effects #8 (2026-10-16); technical findings retained where applicable. |
| 11 | ui/ult_fg.png (576x432) | - | - | no | - | approved | v01 | v01 | Round 2a Killua candidate; visual identity passes Astra review; technical HOLD for soft aura edges and excessive colors/partial alpha. User approved v01 via Claude relay effects #8 (2026-10-16); technical findings retained where applicable. |

User approved v08 as drawn on 2026-10-15. Visual approval only; all Astra anatomy and technical HOLDs remain for Claude. No merge or production authorization.

## gojo

**ENG-112 Smash normals (2026-10-18):** the user approved the first nine drawings as drawn via Claude relay combat #30 and `uair` v01 as drawn via relay combat #35; versions and approval sources are recorded in the [Gojo review page](../public/reviews/normals-gojo/) and manifest. The whole-character atlas contains 54 animations / 251 frames with packed `uair_v01`. The strict scale gate passes after measured auto-head fit ×0.9434 and frame 2 offset [-11,0] (cells 245–250; head median 1.000, feet proxy 1.057, no clipping). The [packed uair review page](../public/reviews/normals-gojo/uair-r2/retry-34/) records the approved drawing. Relay #36 sets uair phases to [2,1,3], making f2 the only active frame and f3 recovery. Astra's body-volume uncertainty remains on technical HOLD; Claude still owns runtime contact verification.

**2026-10-18 Gojo posture D user approval via Claude relay #14:** USER APPROVAL via Claude relay gojo-run #14: “hurtHigh: Approve v04 (Recommended). hurtLow: Keep v04 (Recommended). launched: Approve v08 (Recommended).” The approved artwork is visual-only; technical holds remain (hurtHigh v04 strict head/feet 1.23/1.35; launched v08 torso 66±4px vs neutral 78±4px). hurtLow v05-v07 were rejected and approved v04 stays. No candidate atlas is promoted; see posture-D handoff and generation ledger.

**2026-10-15 idle decision:** User explicitly approved gojo idle v08 as drawn on 2026-10-15. Visual approval only; Claude calibration, clipping/scale/loop checks and final packed-atlas audit remain pending. No new generation, merge or production deployment authorized. Fixed idle anchor remains unchanged until Claude calibrates the accepted source; existing technical findings remain open.

**Title-style approval (2026-10-11):** the user approved the latest candidates shown in the final review preview (all 42 strips); `approved` = the exact version that played. light4 v08 is Claude's re-stitch of the approved v06 parts (review pending). UI: the preview showed v01 labelled v02, so v02 is still unreviewed and v01 ships. Not shipped yet: see the holds per row and docs/NOW.md.

**Round4 candidate checkpoint (2026-10-13):** jumpFall v06, airRecover v05, throw v05, airLight1 v07, airLight2 v05 and light3 v05 are saved for review; all remain `needs review` and QA HOLD. Prior approvedVersion values are unchanged. Full strict pack exits 1; see [round4 QA](characters/gojo/production/round4/QA-FINAL.md) and [review gallery](../public/reviews/gojo-round4/index.html). AirLight2 source-call overrun (5/3) and recovery are disclosed; no production calibration or atlas changed.

Brief: [characters/gojo/](characters/gojo/). Jujutsu Kaisen: black blindfold in every sprite (the Six
Eyes show only in `superPose`, the cut-in and expression 8), dark navy high-collar uniform, spiky
white hair swept up. User approved the broader model v06 on 2026-10-10. Existing animation art still follows the older model until a separately scoped redraw.

Body scale: **taller than the cast** (standing body 215 px, `standingBodyPx: 215`,
[ADR 0010](../docs/decisions/0010-per-character-body-scale.md)): every `bodyHeight` is the shared
value x ~1.09, capped at the 236 px cell ceiling. Kit animations (ADR 0009): `special` = Lapse:
Blue, `specialForward` = Reversal: Red, `specialUp` = Blink (not shown by the engine yet, ENG-032),
`specialDown` = Infinity, `superPose` = Domain Expansion hand sign. 42 animations = 175 frames = an
11-row sheet.

| step | asset | frames | phases | core | body px | status | version | approved | notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 | reference/model_sheet_vNN.png -> model_sheet.png | - | - | yes | - | approved | v06 | v06 | User approved v06 on 2026-10-10; fixed model reference promoted. Source-scale/raw-palette caveats retained; no idle redraw in this batch. |
| 2 | reference/expressions_vNN.png -> expressions.png | - | - | yes | - | approved | v02 | v02 | User approved complete batch 2026-10-09; see production/QA.md. |
| 3 | idle | 8 | - | **yes** | 236 | approved | v08 | v08 | v08 is the one-call redraw from the approved combat cell; needs review and has a pose hold (upright torso/hands down differ from combat). v06 remains the approved version. | User explicitly approved gojo idle v08 as drawn on 2026-10-15. Visual approval only; Claude calibration, clipping/scale/loop checks and final packed-atlas audit remain pending. No new generation, merge or production deployment authorized.
| 4 | run | 8 | - | **yes** | 222 | approved | v12 | v12 | Title-style v12 approved by the user 2026-10-12 as a stand-in until the round-3 redraw. The hover-glide is the user-chosen direction (2026-10-12). |
| 5 | light1 | 7 | 2/2/3 | **yes** | 222 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | light2 | 7 | 2/2/3 | **yes** | 222 | approved | v06 | v06 | Title-style v06 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | light3 | 7 | 2/2/3 | **yes** | 228 | approved | v06 | v06 | User approved light3 v06 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass. |
| 5 | light4 | 8 | 3/2/3 | **yes** | 225 | approved | v08 | v06 | Review pending: v08 re-stitch of the approved v06 parts. Title-style v06 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | heavy | 8 | 3/2/3 | **yes** | 228 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 5 | airLight1 | 5 | 1/2/2 | **yes** | 215 | approved | v07 | v07 | User approved airLight1 v07 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass. |
| 5 | airHeavy | 6 | 2/2/2 | **yes** | 215 | approved | v08 | v08 | Title-style v08 approved by the user 2026-10-12 as a stand-in until the round-3 redraw. |
| 6 | guard | 2 | - | **yes** | 218 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 6 | hurtHigh | 3 | - | **yes** | 216 | approved | v04 | v04 | Approved by the user via Claude relay gojo-run #14, as drawn. Final atlas head probes .961/1.000/1.029; Astra HOLD for anatomy (torso 58–66±7px vs neutral ~78±4px; segments not certifiable ±6%). Packed only in PR #143; runtime/contact pending. [Astra](characters/gojo/production/posture-d/ASTRA_FINAL_ATLAS.md) · [review](../public/reviews/gojo-posture-d/index.html). |
| 6 | launched | 2 | - | **yes** | 170 | approved | v08 | v08 | Approved by the user via Claude relay gojo-run #14, as drawn. Final atlas head probes .893/.924 and torso ~67/66±5px vs neutral ~78±4px; scale remains unmeasured/HOLD. Old scaleManualQA is v06 only. Packed in PR #143; runtime/contact pending. [Astra](characters/gojo/production/posture-d/ASTRA_FINAL_ATLAS.md) · [review](../public/reviews/gojo-posture-d/index.html). |
| 6 | down | 2 | - | **yes** | 104 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 6 | getup | 5 | - | **yes** | 234 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 7 | charge | 4 | - | **yes** | 215 | approved | v07 | v07 | Title-style v07 approved by the user 2026-10-11 (shown in the final review preview). |
| 7 | beamCharge | 4 | - | **yes** | 221 | approved | v04 | v04 | User approved v04 as drawn via Claude relay gojo-skills #3: “Approve all five”. Packer head gate/body sheet and Astra visual audit passed with occlusion uncertainty; source format still noncanonical and extracted frames cache is stale v01. |
| 7 | beamFire | 3 | - | **yes** | 215 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 7 | special | 8 | 3/3/2 | **yes** | 232 | approved | v07 | v07 | Title-style v07 approved by the user 2026-10-12 as a stand-in until the round-3 redraw. |
| 8 | dash | 2 | - | **yes** | 174 | approved | v11 | v11 | User approved v11 via Claude relay gojo-run #11 despite Astra size holds; values and uncertainty remain in the audit. Packed v11 is in this branch; Claude owns contact check before merge. [Review](../public/reviews/gojo-dash-size/) |
| 8 | jumpUp | 2 | - | **yes** | 215 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 8 | jumpFall | 2 | - | **yes** | 227 | approved | v06 | v06 | User approved jumpFall v06 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass. |
| 8 | land | 2 | - | **yes** | 189 | approved | v06 | v06 | Title-style v06 approved by the user 2026-10-11 (shown in the final review preview). |
| 8 | win | 4 | - | **yes** | 230 | approved | v07 | v07 | Title-style v07 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | backDash | 3 | - | no | 225 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | superDash | 2 | - | no | 140 | approved | v13 | v13 | User approved v13 via Claude relay gojo-run #11 despite Astra size holds; values and uncertainty remain in the audit. Packed v13 is in this branch; Claude owns contact check before merge. [Review](../public/reviews/gojo-dash-size/) |
| 9 | jumpSquat | 1 | - | no | 176 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | airLight2 | 5 | 1/2/2 | no | 225 | approved | v05 | v05 | User approved airLight2 v05 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass. |
| 9 | airLight3 | 6 | 2/2/2 | no | 219 | approved | v12 | v12 | User approved v12 on 2026-10-12. Previous production QA below is retained as evidence; other held assets are not approved by this decision. v12 needs review; full strict ok (0.972), all x59..214, six heel-kick phases. Impact heel reach requires Claude gameplay/contact check. A1/B2 budget exhausted. Approved v10 retained. |
| 9 | block | 2 | - | no | 222 | approved | v03 | v03 | Title-style v03 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | hurtLow | 3 | - | no | 199 | approved | v07 | v04 | User chose to keep v04 via Claude relay gojo-run #14; v05/v06/v07 rejected; no new art promoted. Historical technical measurements remain in review ledger. |
| 9 | spin | 4 | - | no | 174 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | airRecover | 3 | - | no | 196 | approved | v05 | v05 | User approved airRecover v05 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass. |
| 9 | throw | 4 | 1/1/2 | no | 219 | approved | v05 | v05 | User approved throw v05 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass. |
| 9 | vanish | 2 | - | no | 232 | approved | v03 | v03 | Title-style v03 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | stagger | 4 | - | no | 225 | approved | v03 | v03 | Title-style v03 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | ko | 1 | - | no | 81 | approved | v06 | v06 | Title-style v06 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | intro | 4 | - | no | 228 | approved | v03 | v03 | Title-style v03 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | taunt | 2 | - | no | 228 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | specialForward | 7 | 2/2/3 | no | 222 | approved | v06 | v06 | Title-style v06 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | specialUp | 6 | 2/2/2 | no | 232 | approved | v03 | v03 | Title-style v03 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | specialDown | 4 | 2/1/1 | no | 222 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | superPose | 4 | - | no | 230 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 11 | ui/portrait.png (96x96) | - | - | no | - | approved | v02 | v01 | v02 never shown (the preview showed v01); v01 ships. Approved v01. |
| 11 | ui/cutin.png (480x128) | - | - | no | - | approved | v02 | v01 | v02 never shown; v01 ships. Approved v01. |
| 11 | ui/select.png (384x384) | - | - | no | - | approved | v02 | v01 | v02 never shown; v01 ships. Approved v01. |
| 11 | ui/super_bg.png (768x192) | - | - | no | - | approved | v01 | v01 | Round 2a Gojo candidate; approval pending via the desk. Source 2172x724; final crop and hard-pixel/color checks are pending. User approved v01 via Claude relay effects #8 (2026-10-16); technical findings retained where applicable. |
| 11 | ui/super_fg.png (384x240) | - | - | no | - | approved | v01 | v01 | Round 2a Gojo candidate; Astra HOLD: blindfold is raised rather than pulled down; gesture is near the face instead of chest height. Technical size, edge, color and alpha checks also HOLD. User approved v01 via Claude relay effects #8 (2026-10-16); technical findings retained where applicable. |
| 11 | ui/ult_bg.png (768x432) | - | - | no | - | approved | v01 | v01 | Round 2a Gojo candidate; approval pending via the desk. Source 1536x1024; final crop and hard-pixel/color checks are pending. User approved v01 via Claude relay effects #8 (2026-10-16); technical findings retained where applicable. |
| 11 | ui/ult_fg.png (576x432) | - | - | no | - | approved | v01 | v01 | Round 2a Gojo candidate; Astra HOLD: energy color assignment appears reversed by anatomical hand, red reads hot pink and reflects on figure; technical colors/partial alpha HOLD. User approved v01 via Claude relay effects #8 (2026-10-16); technical findings retained where applicable. |

## Tech poses (ADR 0030)

Three optional strips every fighter draws (step 9): `techGround` (4 frames, beats 1/2/1), `techRoll` (6 frames,
1/4/1), `wallTech` (5 frames, 2/1/2). Until a fighter's strip is packed, the game keeps the poses those techs always
showed (`land`, `airRecover`, `jumpUp`), so nothing waits on them. Brief, per-frame poses, prompts and QA:
[characters/TECH_POSES_BRIEF.md](characters/TECH_POSES_BRIEF.md) (ART-TECH-01). Each fighter's rows move into its own
section's table when its strips are generated (the manifest gets the same entries in `characters.<id>.animations`).

| fighter | techGround | techRoll | wallTech | notes |
|---|---|---|---|---|
| naruto | todo | todo | todo | title-style production branch (PR #69) |
| sasuke | todo | todo | todo | title-style production branch (PR #71) |
| killua | todo | todo | todo | title-style production branch (PR #70) |
| gojo | todo | todo | todo | title-style production branch (PR #72) |

## Beam clash struggle (ADR 0034)

One optional strip for every fighter with an energy move (step 9): `beamStruggle` (3 frames, loop, 70 ms), braced and
pushing the 1-bar energy technique into the other side's, and `beamStruggleAir` for a fighter with an air energy shot
(the same, hovering). Until a fighter's strip is packed, the clash shows `beamFire` / the `throw` release frame.
Brief, per-fighter poses and rules: [characters/BEAM_STRUGGLE_BRIEF.md](characters/BEAM_STRUGGLE_BRIEF.md)
(ART-BEAM-CLASH). Luffy has no energy move and draws none.

| fighter | beamStruggle | beamStruggleAir | the technique | notes |
|---|---|---|---|---|
| naruto | approved | - | Rasengan, two-handed push | v02 approved as drawn via Claude approval desk relay #7 (“Approve all 6”); v01 remains held. Strict pack passes (head .95-.98); body-area B=.65-.67 advisory accepted. Palm anchor [232,124] across frames. Astra audit pending; see Round 2 review page. |
| sasuke | approved | approved | Chidori Spear thrust; in the air the Great Fireball (blown from the mouth, hand sign at the lips) | Ground v02 approved by the user via Claude relay beam-clash #15 (quote: “Goku v01: Approve v01. Sasuke v02: Approve v02.”); approvedVersion 2. Packer head gate passes, but Astra holds torso/loop and arm certainty; approval does not clear technical holds. Three air strips unchanged. See Round 4 review page and audit. |
| killua | approved | approved | Narukami, open palm (in the air driven down) | Ground v01 approved via Claude approval desk relay #7; air v02 approved as drawn via relay #10 (“Approve v02”). Air v01 remains preserved as rejected/superseded in raw/_rejected after its technical gate failure. V02 strict quantized pack passes; body sheet H=.97–1.03, B=.97–.99, no body flag. Astra audit and exact hand-anchor measurement remain before runtime integration. See Round 2 review page. |
| gojo | approved | approved | Reversal: Red at two fingertips, other hand in the pocket (in the air pointed down) | Ground and air v01 approved via Claude approval desk relay #7; strict packs pass. Astra audit pending; see Round 2 review page. |
| goku | approved | v01 | Dragon Fist lunge | Ground-only v01 approved by the user via Claude relay beam-clash #15 (quote: “Goku v01: Approve v01. Sasuke v02: Approve v02.”); bodyHeight 205/factor .338. Technical holds remain: strict quantized diagnostic fails unmeasured-head gate and clips f2 right 1 px; title-combat vs beamFire head/boot density differs, front knuckles exceed brief zone, Astra holds shoulder/chest anatomy. Diagnostic atlas is not official and no runtime offsets/anchors promoted; no air strip. See Round 4 review and MEASUREMENTS.md. |

## Attack alts (ADR 0031)

Eleven optional strips per fighter (step 9), one alternate of each attack and hit reaction: `light1Alt`, `light2Alt`,
`light3Alt` (7 frames, 2/2/3), `light4Alt`, `heavyAlt` (8, 3/2/3), `airLight1Alt`, `airLight2Alt` (5, 1/2/2),
`airLight3Alt`, `airHeavyAlt` (6, 2/2/2), `hurtHighAlt`, `hurtLowAlt` (3). Each keeps its base's frame count, phases and
strike height and reach with another technique (art/SPEC.md "Attack alts"); the game alternates it with the base and
plays the base until it is packed, so nothing waits on them. The manifest lists all eleven per fighter (status `todo`,
`altOf` = the base, frames / phases / ms / bodyHeight copied from that fighter's base). Naruto pilots them (ART-ALTS-NAR,
brief docs/agents/CODEX_INBOX.md round 4 Part 2); the others follow his in-game review (ART-ALTS). Each fighter's rows
move into its own section's table when its alts are generated.

| fighter | light1-4 Alt | heavyAlt | airLight1-3 Alt | airHeavyAlt | hurtHigh / hurtLow Alt | notes |
|---|---|---|---|---|---|---|
| naruto | 5 candidates: light1Alt v01, light2Alt v01/v02/v03/v04/v05 (v05 user-approved), light3Alt v01/v02, light4Alt v01 | heavyAlt v01/v02 (v02 is byte-identical measured restitch) | 3 candidates: airLight1Alt/2Alt/3Alt v01 | airHeavyAlt v01/v02; v03 held; v04 user-approved | hurtHighAlt/HurtLowAlt v01 | ART-ALTS-NAR: user approved light2Alt v05 and airHeavyAlt v04 as drawn via Claude on 2026-10-15; manifest approval recorded. Claude still owns production calibration/contact checks: light2Alt full intrinsic +/-6% anatomy remains uncertain; airHeavyAlt strict f3 center-contact certification and numeric anatomy remain held. Calibrated quantized dry-run exits 0 (44 ok, 7 manual, 1 historical unmeasured); no production promotion. Older candidates are rejected as superseded and retained at their listed source paths.
| sasuke | todo | todo | todo | todo | todo | after the Naruto pilot (ART-ALTS) |
| killua | todo | todo | todo | todo | todo | after the Naruto pilot (ART-ALTS) |
| gojo | todo | todo | todo | todo | todo | after the Naruto pilot (ART-ALTS) |

## Directional normals (ADR 0042)

Ten optional strips per fighter (step 9), the Smash-style moves the stick picks: `fTilt`, `uTilt`, `dashAttack` (7 frames,
2/2/3), `dTilt`, `fair`, `bair`, `uair` (6, 2/2/2), `fSmash` (9, 4/2/3; frame 2 is the held charge pose), `uSmash`,
`dSmash` (8, 3/2/3). The engine plays them on stand-in strips until they are packed (art/SPEC.md "Directional normals":
`light2`, `heavy`, `light3`, `light4`, `airLight2`, `airLight3` mirrored for the back air), so nothing waits on them. The
manifest lists all ten per fighter (status `todo`, bodyHeight copied from that fighter's stand-in strip). **In progress**
(2026-10-18, ENG-112): Codex chat "4 - Combat Overhaul" (relay lane `combat`) draws them one fighter per branch
(`art/normals-<id>`): Sasuke, Killua, Gojo, Goku, Luffy, then Naruto after the packer's second sheet page (TOOL-060).

| fighter | tilts (f / u / d) | dashAttack | smash attacks (f / u / d) | aerials (fair / bair / uair) | notes |
|---|---|---|---|---|---|
| naruto | todo | todo | todo | todo | ENG-112, branch art/normals-naruto (last, after TOOL-060) |
| sasuke | fTilt v03 approved, held; uTilt v05 approved; dTilt v05 approved | dashAttack v05 approved | fSmash v02 approved; uSmash v05 approved; dSmash stand-in | fair v03, bair v01, uair v01 approved | ENG-112, branch art/normals-sasuke; strict pack passes with 52 animations / 236 frames; fTilt decision pending; runtime contact check by Claude |
| killua | fTilt v02 approved; dTilt v02 approved | dashAttack v02 approved | fSmash v02 approved; uSmash stand-in; dSmash v03 approved | fair/bair v02 approved; uair stand-in | ENG-112: all ten drawings approved via Claude relays #20/#22. Relay #24 first pack d62a961c ships seven; uTilt/uSmash/uair remain in _qa_hold for follow-up; contact crops in public/reviews/normals-killua/ship-seven/. |
| gojo | fTilt v01, uTilt v01, dTilt v02 approved | dashAttack v01 approved | fSmash/uSmash/dSmash v01 approved | fair v01, bair v02, uair v01 approved | ENG-112: all ten drawings approved via Claude relays #30/#35. Nine-move branch merged; uair v01 reviewed at retry-34. Astra technical holds and Claude runtime contact check remain. |
| goku | fTilt v01 approved; uTilt v04 approved via Claude relay #45 at strip packScale 1.09; dTilt v01 approved | dashAttack v01 approved | fSmash v01 approved; uSmash v05 held (relay #46; packed body 160–216px vs idle 213–214px, contact boxes oversized); dSmash v06 held (relay #46; active boots clipped, anatomy enlarged, contacts misplaced) | fair v01, bair v01, uair v01 approved | ENG-112 branch art/normals-goku-r2: uTilt v04 restored unchanged from _qa_hold at strip packScale 1.09. Astra relay #45 final5 scale/anatomy pass; version-bound f3/f4 strike boxes verified. Runtime combat contact remains with Claude. Relay #46 used all six authorized calls; uSmash v05 and dSmash v06 stay in _qa_hold after Astra final5 HOLD. See relay46 review page/audit; call budgets exhausted pending a new user decision. |
| luffy | todo | todo | todo | todo | ENG-112, branch art/normals-luffy |

## VFX atlas (step 10)

Brief: [vfx/EFFECTS.md](vfx/EFFECTS.md). Candidates `art/vfx/raw/<effect>_vNN.png` (the packer uses
the highest version). VFX cells stay 128 x 128 (ppu 56). Missing effects fall back to the procedural
ones.

| effect | frames | ms | color rule | anchor | status | version | approved | notes |
|---|---|---|---|---|---|---|---|---|
| gumArm | 2 | 60 | full color | center, tile | approved | v03 | v03 | User approved as drawn via Claude relay luffy-skills #2. Relay #4 sidecar `split: even` imports both frames; tube f0 ends 1px short of the right edge and packer warns it cannot tile perfectly. Claude checked the stretch in game and reports the gap is hidden. v01-v02 preserved in `_rejected/`. |
| gumFist | 4 | 40 | full color | center | approved | v01 | v01 | User approved as drawn via Claude relay luffy-skills #2; packed to four HD frames. Integration pending. |
| gumImpact | 7 | 35 | full color | center | approved | v01 | v01 | User approved as drawn via Claude relay luffy-skills #2. Relay #4 sidecar erases box borders and drops the split last half; packer now imports 7/7. |
| reference/vfx_style_sheet_vNN.png -> vfx_style_sheet.png (optional style anchor) | - | - | - | - | todo | - | - | attach the approved copy to every VFX prompt |
| spark | 5 | 30 | white (tinted) | center | approved | v01 | v01 | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| burst | 5 | 35 | white (tinted) | center | approved | v01 | v01 | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| ring | 6 | 35 | white (tinted) | center | approved | v02 | v02 | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| dust | 6 | 60 | full color | bottom | approved | v01 | v01 | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| smoke | 7 | 55 | full color | center | approved | v01 | v01 | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| shuriken | 4 | 40 | full color | center | approved | v01 | v01 | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| fire | 4 | 60 | full color | center | approved | v01 | v01 | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| flame | 7 | 55 | white (tinted) | bottom | approved | v01 | v01 | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| lightning | 6 | 40 | white (tinted) | center | approved | v01 | v01 | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| orb | 6 | 40 | full color | center | approved | v01 | v01 | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| glow | 2 | 60 | white (tinted) | center | approved | v01 | v01 | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| streak | 6 | 45 | white (tinted) | bottom | approved | v02 | v02 | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| star | 5 | 40 | white (tinted) | center | approved | v01 | v01 | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crater | 3 | 1000 (static; 3 random variants) | full color | decal | approved | v01 | v01 | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| lines | 4 | 40 | white (tinted) | center | approved | v01 | v01 | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| bubble | 6 | 50 | white (tinted) | center | approved | v01 | v01 | User explicitly approved; normal atlas repacked; ready for Claude integration. |
| wisp | 7 | 55 | white (tinted) | bottom | approved | v01 | v01 | User explicitly approved; normal atlas repacked; ready for Claude integration. |
| arc | 6 | 40 (random frame) | white (tinted) | center | approved | v01 | v01 | User explicitly approved; normal atlas repacked; ready for Claude integration. |
| ripple | 5 | 50 | white (tinted) | center | approved | v02 | v02 | User explicitly approved; normal atlas repacked; ready for Claude integration. |
| naruto_chakraTail | 6 | 60 (loop) | white (tinted) | bottom | approved | v01 | v01 | User explicitly approved; normal atlas repacked; ready for Claude integration. |
| dustWave | 6 | 60 | full color | bottom | todo | - | - | New for ground damage (ENG-070, ADR 0024): rolling dust walls around big craters; procedural until approved. Brief in EFFECTS.md. |
| clashBurst | 6 | 45 | white (tinted) | center | approved | v01 | v01 | User approved v01 2026-10-15 (Codex chat); shipped by Claude. Beam clash (ADR 0034, ART-BEAM-CLASH): the knot where two streams collide; procedural until approved. Brief in EFFECTS.md "Beam clash". |
| streamBolt | 4 | 40 | white (tinted) | center, tiles | approved | v01 | v01 | User approved v01 2026-10-15 (Codex chat); shipped by Claude. Beam clash: Narukami stream band; exact 128 x 128 tiles in frames/streamBolt/. |
| streamLance | 4 | 40 | white (tinted) | center, tiles | approved | v01 | v01 | User approved v01 2026-10-15 (Codex chat); shipped by Claude. Beam clash: Chidori Spear stream band; exact tiles. |
| streamFlame | 4 | 50 | full color | center, tiles | approved | v01 | v01 | User approved v01 2026-10-15 (Codex chat); shipped by Claude. Beam clash: Great Fireball stream band; exact tiles. |
| redOrb | 6 | 40 | full color | center | approved | v01 | v01 | User approved v01 2026-10-15 (Codex chat); shipped by Claude. Beam clash: Reversal: Red held in a struggle. |
| lapseBlue | 8 | 40 | full color | center | approved | v01 | v01 | Gojo skills batch 1, A1; HD, fill 0.9; user approved as drawn via Claude relay gojo-skills #2. Source-format deviations documented in REVIEW.md. |
| blueCollapse | 8 | 40 | full color | center | approved | v01 | v01 | Gojo skills batch 1, A2; HD, fill 0.98; user approved as drawn via Claude relay gojo-skills #2. Source-format deviations documented in REVIEW.md. |
| redForm | 6 | 40 | full color | center | approved | v01 | v01 | Gojo skills batch 1, A3; HD, fill 0.6; user approved as drawn via Claude relay gojo-skills #2. Source-format deviations documented in REVIEW.md. |
| reversalRed | 8 | 40 | full color | center | approved | v01 | v01 | Gojo skills batch 1, A4; HD, fill 0.9; user approved as drawn via Claude relay gojo-skills #2. Source-format deviations documented in REVIEW.md. |
| redBurst | 8 | 40 | full color | center | approved | v01 | v01 | Gojo skills batch 1, A5; HD, fill 0.98; user approved as drawn via Claude relay gojo-skills #2. Source-format deviations documented in REVIEW.md. |
| sixEyesGlint | 6 | 35 | full color | center | approved | v01 | v01 | Gojo skills batch 2, A7; HD, fill 0.4; user approved as drawn via Claude relay gojo-skills #3: “Approve all five”. Normalized candidate and original retained; source hold is documented. |
| purpleForm | 8 | 40 | full color | center | approved | v01 | v01 | Gojo skills batch 2, A8; HD, fill 0.9; user approved as drawn via Claude relay gojo-skills #3: “Approve all five”. Normalized candidate and original retained; source hold is documented. |
| hollowPurple | 8 | 45 | full color | center | approved | v01 | v01 | Gojo skills batch 2, A9; HD, fill 1.0; user approved as drawn via Claude relay gojo-skills #3: “Approve all five”. Semantic output swap and source-format holds documented. |
| purpleBurst | 8 | 45 | full color | center | approved | v01 | v01 | Gojo skills batch 2, A10; HD, fill 0.98; user approved as drawn via Claude relay gojo-skills #3: “Approve all five”. Semantic output swap and source-format holds documented. |
| infinityRipple | 6 | 40 | full color | center | approved | v01 | v01 | Gojo skills batch 3, A6; HD, fill 0.6; user approved as drawn via Claude relay gojo-skills #4: “Approve all three”. 6/6 production frames; source dimensions, palette and magenta holds remain documented. |
| voidFlood | 8 | 40 | full color | center | approved | v01 | v01 | Gojo skills batch 3, A11; HD, fill 0.9; user approved as drawn via Claude relay gojo-skills #4: “Approve all three”. Motion is subtle and center ring appears oversized; source holds remain documented. |
| voidShatter | 8 | 50 | full color | center | approved | v01 | v01 | Gojo skills batch 3, A12; HD, fill 1.0; user approved as drawn via Claude relay gojo-skills #4: “Approve all three”. Source dimensions, palette and magenta holds remain documented. |

## Shared UI (step 11)

Brief: [ui/README.md](ui/README.md). Candidates `art/ui/raw/<asset>_vNN.png`; the approved one is
cleaned into `art/ui/final/`.

| asset | size | status | version | approved | notes |
|---|---|---|---|---|---|
| ui/final/logo.png ("GCD TOURNEY" + 天下一武闘祭) | ~480x180 | approved | v01 | v01 | Fitted candidate in ui/review; final approval and engine hooks pending. User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| ui/final/title_art.png (title key art) | 640x360 | approved | v01 | v01 | Fitted candidate in ui/review; final approval and engine hooks pending. User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |

## Ground decals (step 12)

Brief: [decals/DECALS.md](decals/DECALS.md), prompts [decals/PROMPTS.md](decals/PROMPTS.md), workflow [decals/README.md](decals/README.md)
([ADR 0024](../docs/decisions/0024-ground-damage-decals.md)). Candidates `art/decals/raw/<name>_vNN.png` or the parts
`<name>_vNN_A.png`, `_B.png` ... of one version; ppu 64. Approved names ship with `npm run sprites decals`; the rest stay
procedural. The style sheet comes first: the claim queue holds every decal batch until its approved copy exists.

| name | group | cell | variants | mode | color rule | status | version | approved | notes |
|---|---|---|---|---|---|---|---|---|---|
| reference/decal_style_sheet_vNN.png -> decal_style_sheet.png (required style anchor) | - | 1536 x 1024 | - | - | palettes in DECALS.md | raw | v01 | - | Provisional unapproved style; user allowed uninterrupted production |
| crack_s | base | 256 x 256 | 8 | flat | full color | approved | v02 | v02 | User approved 2026-10-11; documented visual deviations accepted; see decals/APPROVAL_QA.md |
| crack | base | 256 x 256 | 8 | flat | full color | approved | v01 | v01 | User approved 2026-10-11; documented visual deviations accepted; see decals/APPROVAL_QA.md |
| crater | base | 256 x 256 | 8 | flat | full color | approved | v01 | v01 | User approved 2026-10-11; documented visual deviations accepted; see decals/APPROVAL_QA.md |
| crater_big | base | 512 x 512 | 6 | flat | full color | approved | v01 | v01 | User approved 2026-10-11; documented visual deviations accepted; see decals/APPROVAL_QA.md |
| crater_huge | base | 512 x 512 | 4 | flat | full color | approved | v01 | v01 | User approved 2026-10-11; documented visual deviations accepted; see decals/APPROVAL_QA.md |
| fracture_ring | base | 512 x 512 | 4 | flat | full color | approved | v01 | v01 | User approved 2026-10-11; documented visual deviations accepted; see decals/APPROVAL_QA.md |
| scuff | base | 256 x 128 | 8 | flat, directional | full color | approved | v02 | v02 | User approved 2026-10-11; documented visual deviations accepted; see decals/APPROVAL_QA.md |
| skid | base | 512 x 128 | 4 | flat, directional | full color | approved | v02 | v02 | User approved 2026-10-11; documented visual deviations accepted; see decals/APPROVAL_QA.md |
| rubble | base | 256 x 256 | 6 | flat | full color | approved | v01 | v01 | User approved 2026-10-11; documented visual deviations accepted; see decals/APPROVAL_QA.md |
| dirt_crater | edge | 256 x 256 | 4 | flat | full color | approved | v01 | v01 | User approved 2026-10-11; documented visual deviations accepted; see decals/APPROVAL_QA.md |
| dirt_skid | edge | 512 x 128 | 3 | flat, directional | full color | approved | v01 | v01 | User approved 2026-10-11; documented visual deviations accepted; see decals/APPROVAL_QA.md |
| barrier_crack | edge | 256 x 256 | 6 | wall | white only (tinted) | approved | v02 | v02 | User approved 2026-10-11; documented visual deviations accepted; see decals/APPROVAL_QA.md |
| crater_wall | edge | 512 x 512 | 4 | wall | full color | approved | v01 | v01 | User approved 2026-10-11; documented visual deviations accepted; see decals/APPROVAL_QA.md |
| burn_lightning | lightning | 256 x 256 | 6 | flat | full color + hot key | approved | v02 | v02 | User approved 2026-10-11; documented visual deviations accepted; see decals/APPROVAL_QA.md |
| burn_lightning_big | lightning | 512 x 512 | 4 | flat | full color + hot key | approved | v02 | v02 | User approved 2026-10-11; documented visual deviations accepted; see decals/APPROVAL_QA.md |
| fracture_lightning | lightning | 512 x 512 | 2 | flat | full color + hot key | approved | v01 | v01 | User approved 2026-10-11; documented visual deviations accepted; see decals/APPROVAL_QA.md |
| burn_fire | fire | 256 x 256 | 6 | flat | full color + hot key | approved | v01 | v01 | User approved 2026-10-11; documented visual deviations accepted; see decals/APPROVAL_QA.md |
| burn_black | fire | 256 x 256 | 4 | flat | full color | approved | v01 | v01 | User approved 2026-10-11; documented visual deviations accepted; see decals/APPROVAL_QA.md |
| scour_spiral | chakra | 256 x 256 | 6 | flat | full color + hot key | approved | v01 | v01 | User approved 2026-10-11; existing QA deviations accepted, not fixed. Ready for coordinator integration. |
| scour_spiral_big | chakra | 512 x 512 | 3 | flat | full color + hot key | approved | v02 | v02 | User approved 2026-10-11; existing QA deviations accepted, not fixed. Ready for coordinator integration. |
| cut_wind | chakra | 256 x 256 | 6 | flat | full color + hot key | approved | v03 | v03 | User approved 2026-10-11; existing QA deviations accepted, not fixed. Ready for coordinator integration. |
| claw | chakra | 512 x 256 | 4 | flat, directional | full color + hot key | approved | v02 | v02 | User approved 2026-10-11; existing QA deviations accepted, not fixed. Ready for coordinator integration. |
| scorch_chakra | chakra | 512 x 512 | 3 | flat, directional | full color + hot key | approved | v02 | v02 | User approved 2026-10-11; existing QA deviations accepted, not fixed. Ready for coordinator integration. |
| fracture_chakra | chakra | 512 x 512 | 2 | flat | full color + hot key | approved | v02 | v02 | User approved 2026-10-11; existing QA deviations accepted, not fixed. Ready for coordinator integration. |
| erasure | cursed | 256 x 256 | 3 | flat | full color + hot key | approved | v02 | v02 | |
| erasure_trench | cursed | 512 x 256 | 3 | flat, directional | full color + hot key | approved | v02 | v02 | |
| crush_implode | cursed | 256 x 256 | 4 | flat | full color | approved | v03 | v03 | |
| gouge_repel | cursed | 512 x 256 | 4 | flat, directional | full color + hot key | approved | v02 | v02 | |
| fracture_cursed | cursed | 256 x 256 | 4 | flat | full color + hot key | approved | v03 | v03 | |
| fracture_cursed_big | cursed | 512 x 512 | 2 | flat | full color + hot key | approved | v02 | v02 | |
| scorch_ki | ki | 256 x 256 | 4 | flat | full color + hot key | approved | v01 | v01 | User approved 2026-10-11; documented visual deviations accepted; see decals/APPROVAL_QA.md |

## World art (ADR 0008)

World batches are reviewed together in [REVIEW.md](REVIEW.md); the claim queue tracks production in [queue/STATUS.md](queue/STATUS.md). `raw` means the review candidate exists, while `packed` awaits the corresponding world packer mode.

**2026-10-10 (Claude):** the world packer modes exist (`npm run sprites vfx|crowd|stage|npc|ui`, ADR 0012) and ship approved items only; `--candidates` packs the rest into the git-ignored `public/preview/` for `?art=custom`. **The user approved all existing world art on 2026-10-10** (VFX 15, crowd 576 incl. the Killua/Gojo cameos, stage 30, NPC 4, UI 2); everything is packed with zero warnings and in the game, which supersedes the "pending TOOL-011" / "final review pending" notes below.

| area | batch | items | status | current versions | approved | notes |
|---|---|---|---|---|---|---|
| crowd | crowd-animal-folk-01 | org-af-001..010 | approved | v01 | v01 | User approved batch on 2026-10-09; visual QA passed with minor pose details noted in REVIEW.md. Near-magenta/noisy palette and packed QA pending TOOL-011. |
| crowd | crowd-animal-folk-02 | org-af-011..020 | approved | v01 except 013, 015, 019 v02 | same as current | User approved pilot on 2026-10-09; raw backgrounds are near-magenta; `npm run sprites crowd` unavailable (TOOL-011), so atlas and in-game QA are pending. |
| crowd | crowd-athletes-01 | org-athl-001..010 | approved | v01 except 005, 006, 009 v02 | same as current | User approved seven on 2026-10-09; 005, 006 and 009 reopened as crowd-athletes-01-r1 for detached splash/impact marks. Near-magenta and packed QA pending TOOL-011. User approved all current versions on 2026-10-09; corrected v02 items are in crowd-athletes-01-r1. |
| crowd | crowd-athletes-02 | org-athl-011..012 | rejected | v01 | - | User requested redo of both on 2026-10-09 for coarse pixel scale; reopened as crowd-athletes-02-r1. Packed QA pending TOOL-011. |
| crowd | crowd-athletes-01-r1 | org-athl-005, 006, 009 | approved | v02 | v02 | Redo removes detached marks; three visual passes need batch review. Near-magenta and packed QA pending TOOL-011. User approved v02 redo on 2026-10-09. |
| crowd | crowd-athletes-02-r1 | org-athl-011..012 | approved | v02 | v02 | Redo matches approved crowd pixel scale more closely; two visual passes need batch review. Packed QA pending TOOL-011. User approved v02 redo on 2026-10-09. |

| crowd | crowd-attack-on-titan-01 | aot-001..010 | approved | v01 except 008, 009 v02 | same as current | Lead rejected 008/009 for cheer arms crossing a pose-column cut line; eight other v01 images visually pass. 004 reacts subtly by design. Packed QA pending TOOL-011. User approved all current versions on 2026-10-09; corrected v02 items are in crowd-attack-on-titan-01-r1. |
| crowd | crowd-baki-01 | baki-001..008 | approved | v01 except 002, 003, 005, 006, 007 v02 | same as current | Lead rejected 002/005/006/007 for pose-column spill and 003 for an eyepatch that switched eyes; 001/004/008 visually pass. Packed QA pending TOOL-011. User approved all current versions on 2026-10-09; corrected v02 items are in crowd-baki-01-r1. |
| crowd | crowd-bleach-01 | bl-001..010 | approved | v01 except 001, 003, 005, 006 v02 | same as current | Lead rejected 001/005/006 for pose-column spill and 003 for an impossible third arm; six other v01 images visually pass. 008 roster was corrected to one spectator; 009 has a minor seven-pixel cut-line touch. Packed QA pending TOOL-011. User approved all current versions on 2026-10-09; corrected v02 items are in crowd-bleach-01-r1. |
| crowd | crowd-bleach-02 | bl-011..020 | approved | v01 | v01 | All ten v01 images visually pass: distinct identities, three full poses and no obvious crop or text. 020 is large in raw art despite tiny height class; check scaled result when packer exists. 015/018 cross pose cuts; verify adaptive extraction. Packed QA pending TOOL-011. User approved v01 batch on 2026-10-09. |
| crowd | crowd-chainsaw-man-01 | csm-001..010 | approved | v01 except 010 v02 | same as current | Lead rejected 010 for detached motion ticks above the shocked fin; nine other v01 images visually pass. 001 shocked head turns slightly toward profile. 001/009 cross pose cuts; verify adaptive extraction. Packed QA pending TOOL-011. User approved all current versions on 2026-10-09; corrected v02 items are in crowd-chainsaw-man-01-r1. |
| crowd | crowd-cowboy-bebop-01 | bebop-001..006 | approved | v01 except 003, 004 v02 | same as current | Lead rejected 003/004 because the bonsai and laptop vanished in cheer; four other v01 images visually pass. 002 dark violet hair needs key-color check; 006 wing stays inside canvas. 005 crosses a pose cut; verify adaptive extraction. Packed QA pending TOOL-011. User approved all current versions on 2026-10-09; corrected v02 items are in crowd-cowboy-bebop-01-r1. |
| crowd | crowd-demon-slayer-01 | ds-001..010 | approved | v01 | v01 | All ten v01 images visually pass. 004 raised blades are high but not clipped; 007 forehead mark and 010 prayer follow the roster. 005/008/010 cross pose cuts; verify adaptive extraction. Packed QA pending TOOL-011. User approved v01 batch on 2026-10-09. |
| crowd | crowd-demon-slayer-02 | ds-011..015 | approved | v01 | v01 | All five v01 images visually pass. 015 soft pink remains visibly separate from the magenta background. Packed QA pending TOOL-011. User approved v01 batch on 2026-10-09. |
| crowd | crowd-dragon-ball-01 | db-001..010 | approved | v01 | v01 | All ten v01 images visually pass. 008 purple needs key-color check; 009 axe appears only in idle as posed in the roster. 001/009 cross pose cuts; verify adaptive extraction. Packed QA pending TOOL-011. User approved v01 batch on 2026-10-09. |
| crowd | crowd-dragon-ball-02 | db-011..020 | approved | v01 | v01 | All ten v01 images visually pass. 012 turns slightly off front view; 013/014 read as children. 014 crosses a pose cut; verify adaptive extraction. Packed QA pending TOOL-011. User approved v01 batch on 2026-10-09. |
| crowd | crowd-attack-on-titan-01-r1 | aot-008, aot-009 | approved | v02 | v02 | Lead raw QA: both v02 cheers now fit their 512 px thirds with clean cut lines; identity, three poses and baseline remain. Recommend visual approval. Packed QA pending TOOL-011. User approved v02 redo on 2026-10-09. |
| crowd | crowd-baki-01-r1 | baki-002, baki-003, baki-005, baki-006, baki-007 | approved | v02 | v02 | Lead raw QA: five targeted v02 corrections; pose columns and eyepatch consistency checked. Recommend visual approval if the linked redraws look right. Packed QA pending TOOL-011. User approved v02 redo on 2026-10-09. |
| crowd | crowd-bleach-01-r1 | bl-001, bl-003, bl-005, bl-006 | approved | v02 | v02 | Lead raw QA: four targeted v02 corrections; pose columns and two-arm anatomy checked. Recommend visual approval if the linked redraws look right. Packed QA pending TOOL-011. User approved v02 redo on 2026-10-09. |
| crowd | crowd-chainsaw-man-01-r1 | csm-010 | approved | v02 | v02 | Lead raw QA: 010 v02 removes the detached fin ticks and retains identity, three poses and shared baseline. Recommend visual approval. 010 v02 still crosses both pose cuts; verify adaptive extraction. Packed QA pending TOOL-011. User approved v02 redo on 2026-10-09. |
| crowd | crowd-cowboy-bebop-01-r1 | bebop-003, bebop-004 | approved | v02 | v02 | Lead raw QA: 003/004 v02 keep bonsai/laptop visible across all three poses, with stable baselines and clean gaps. Recommend visual approval. 004 v02 crosses a pose cut; verify adaptive extraction. Packed QA pending TOOL-011. User approved v02 redo on 2026-10-09. |

| crowd | crowd-dragon-ball-03 | 10 | approved | v01/v03 | v01/v03 | [Files/QA](queue/reviews/crowd-dragon-ball-03.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-dragon-ball-04 | 10 | approved | v01/v02 | v01/v02 | [Files/QA](queue/reviews/crowd-dragon-ball-04.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-elders-01 | 10 | approved | v01/v02 | v01/v02 | [Files/QA](queue/reviews/crowd-elders-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-elders-02 | 5 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-elders-02.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-evangelion-01 | 6 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-evangelion-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-families-kids-01 | 10 | approved | v01/v02 | v01/v02 | [Files/QA](queue/reviews/crowd-families-kids-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-families-kids-02 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-families-kids-02.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-farmers-villagers-01 | 10 | approved | v02/v01 | v02/v01 | [Files/QA](queue/reviews/crowd-farmers-villagers-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-farmers-villagers-02 | 3 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-farmers-villagers-02.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-fist-of-the-north-star-01 | 8 | approved | v01/v02 | v01/v02 | [Files/QA](queue/reviews/crowd-fist-of-the-north-star-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-fullmetal-alchemist-01 | 10 | approved | v01/v02 | v01/v02 | [Files/QA](queue/reviews/crowd-fullmetal-alchemist-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-gintama-01 | 8 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-gintama-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-hajime-no-ippo-01 | 8 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-hajime-no-ippo-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-hunter-x-hunter-01 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-hunter-x-hunter-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-hunter-x-hunter-02 | 5 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-hunter-x-hunter-02.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-idol-fans-01 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-idol-fans-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-idol-fans-02 | 3 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-idol-fans-02.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-jojo-01 | 10 | approved | v01/v02 | v01/v02 | [Files/QA](queue/reviews/crowd-jojo-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-jojo-02 | 5 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-jojo-02.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-jujutsu-kaisen-01 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-jujutsu-kaisen-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-jujutsu-kaisen-02 | 5 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-jujutsu-kaisen-02.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-kengan-ashura-01 | 6 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-kengan-ashura-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-kenichi-01 | 6 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-kenichi-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-martial-artists-01 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-martial-artists-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-martial-artists-02 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-martial-artists-02.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-mob-psycho-100-01 | 8 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-mob-psycho-100-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-monks-priests-01 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-monks-priests-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-my-hero-academia-01 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-my-hero-academia-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-my-hero-academia-02 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-my-hero-academia-02.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-naruto-01 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-naruto-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-naruto-02 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-naruto-02.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-naruto-03 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-naruto-03.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-ninja-samurai-cosplayers-01 | 10 | approved | v01/v02 | v01/v02 | [Files/QA](queue/reviews/crowd-ninja-samurai-cosplayers-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-ninja-samurai-cosplayers-02 | 3 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-ninja-samurai-cosplayers-02.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-one-piece-01 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-one-piece-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-one-piece-02 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-one-piece-02.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-one-piece-03 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-one-piece-03.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-one-punch-man-01 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-one-punch-man-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-one-punch-man-02 | 2 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-one-punch-man-02.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-punks-delinquents-01 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-punks-delinquents-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-punks-delinquents-02 | 5 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-punks-delinquents-02.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-ranma-01 | 8 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-ranma-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-rich-patrons-01 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-rich-patrons-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-rich-patrons-02 | 4 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-rich-patrons-02.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-robots-aliens-01 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-robots-aliens-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-sailor-moon-01 | 10 | approved | v01/v02 | v01/v02 | [Files/QA](queue/reviews/crowd-sailor-moon-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-saint-seiya-01 | 8 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-saint-seiya-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-slam-dunk-01 | 6 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-slam-dunk-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-spy-x-family-01 | 6 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-spy-x-family-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-students-01 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-students-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-students-02 | 5 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-students-02.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-travelers-tourists-01 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-travelers-tourists-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-travelers-tourists-02 | 5 | approved | v02/v01 | v02/v01 | [Files/QA](queue/reviews/crowd-travelers-tourists-02.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-vendors-workers-01 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-vendors-workers-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-vendors-workers-02 | 5 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-vendors-workers-02.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-yu-yu-hakusho-01 | 10 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-yu-yu-hakusho-01.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-yu-yu-hakusho-02 | 2 | approved | v01 | v01 | [Files/QA](queue/reviews/crowd-yu-yu-hakusho-02.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-ringTop | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-ringTop.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-ringSide | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-ringSide.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-grass | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-grass.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-steps | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-steps.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-stoneBase | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-stoneBase.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-brick | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-brick.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-path | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-path.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-templeFacade | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-templeFacade.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-roof | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-roof.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-bannerBu | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-bannerBu.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-bannerDo | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-bannerDo.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-bannerSai | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-bannerSai.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-bannerTo | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-bannerTo.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-plaster | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-plaster.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-sky | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-sky.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-cloudA | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-cloudA.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-cloudB | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-cloudB.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-cloudC | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-cloudC.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-gong | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-gong.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-parasol | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-parasol.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-woodDark | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-woodDark.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-treeRoundA | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-treeRoundA.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-treeRoundB | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-treeRoundB.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-treePine | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-treePine.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-treePalm | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-treePalm.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-sign | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-sign.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-lanternBu | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-lanternBu.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-lanternSai | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-lanternSai.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-woodPillar | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-woodPillar.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| stage | stage-wood | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/stage-wood.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| npc | npc-announcer | 5 | approved | v01 | v01 | [Files/QA](queue/reviews/npc-announcer.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| npc | npc-announcer-r1 | 4 | approved | walk v02, run v03, shocked v03, micThrust v03 | same | [Phone review](../public/reviews/announcer-moves/index.html); user approved all four as drawn via Claude on 2026-10-18 and accepted technical holds. Astra holds remain unresolved: walk repeated same-leg phases, foot x88–89 > x86; run repeated phases, hair shift ~13–16 px, f2 feet x31–96 > x34–94; shocked shoe contour mismatch 13 mask pixels (x38–90 vs x39–90); micThrust hands reversed and feet differ from idle. All generation budgets exhausted 3/3. Packer reports 32 colors; independent atlas unique opaque RGB count 31. |
| npc | npc-monk-a | 3 | approved | v02 | v02 | [Files/QA](queue/reviews/npc-monk-a.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| npc | npc-monk-b | 3 | approved | v01 | v01 | [Files/QA](queue/reviews/npc-monk-b.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| npc | npc-vendor | 2 | approved | v02 | v02 | [Files/QA](queue/reviews/npc-vendor.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| ui | ui-logo | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/ui-logo.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| ui | ui-title_art | 1 | approved | v02 | v02 | [Files/QA](queue/reviews/ui-title_art.md); Naruto vs Killua title art approved with its painted audience. |
| vfx | vfx-spark | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/vfx-spark.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| vfx | vfx-burst | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/vfx-burst.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| vfx | vfx-ring | 1 | approved | v02 | v02 | [Files/QA](queue/reviews/vfx-ring.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| vfx | vfx-dust | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/vfx-dust.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| vfx | vfx-smoke | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/vfx-smoke.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| vfx | vfx-shuriken | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/vfx-shuriken.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| vfx | vfx-fire | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/vfx-fire.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| vfx | vfx-flame | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/vfx-flame.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| vfx | vfx-lightning | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/vfx-lightning.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| vfx | vfx-orb | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/vfx-orb.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| vfx | vfx-glow | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/vfx-glow.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| vfx | vfx-streak | 1 | approved | v02 | v02 | [Files/QA](queue/reviews/vfx-streak.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| vfx | vfx-star | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/vfx-star.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| vfx | vfx-crater | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/vfx-crater.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| vfx | vfx-lines | 1 | approved | v01 | v01 | [Files/QA](queue/reviews/vfx-lines.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-farmers-villagers-01-r1 | 2 | approved | v02 | v02 | [Files/QA](queue/reviews/crowd-farmers-villagers-01-r1.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-fist-of-the-north-star-01-r1 | 3 | approved | v02 | v02 | [Files/QA](queue/reviews/crowd-fist-of-the-north-star-01-r1.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-dragon-ball-03-r1 | 1 | approved | v03 | v03 | [Files/QA](queue/reviews/crowd-dragon-ball-03-r1.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-dragon-ball-04-r1 | 4 | approved | v02 | v02 | [Files/QA](queue/reviews/crowd-dragon-ball-04-r1.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-elders-01-r1 | 1 | approved | v02 | v02 | [Files/QA](queue/reviews/crowd-elders-01-r1.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-families-kids-01-r1 | 1 | approved | v02 | v02 | [Files/QA](queue/reviews/crowd-families-kids-01-r1.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| npc | npc-monk-a-r1 | 3 | approved | v02 | v02 | [Files/QA](queue/reviews/npc-monk-a-r1.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| npc | npc-vendor-r1 | 2 | approved | v02 | v02 | [Files/QA](queue/reviews/npc-vendor-r1.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| vfx | vfx-ring-r1 | 1 | approved | v02 | v02 | [Files/QA](queue/reviews/vfx-ring-r1.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| vfx | vfx-streak-r1 | 1 | approved | v02 | v02 | [Files/QA](queue/reviews/vfx-streak-r1.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-dragon-ball-03-r2 | 1 | approved | v03 | v03 | [Files/QA](queue/reviews/crowd-dragon-ball-03-r2.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-fullmetal-alchemist-01-r1 | 2 | approved | v02 | v02 | [Files/QA](queue/reviews/crowd-fullmetal-alchemist-01-r1.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-jojo-01-r1 | 1 | approved | v02 | v02 | [Files/QA](queue/reviews/crowd-jojo-01-r1.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-ninja-samurai-cosplayers-01-r1 | 1 | approved | v02 | v02 | [Files/QA](queue/reviews/crowd-ninja-samurai-cosplayers-01-r1.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-sailor-moon-01-r1 | 1 | approved | v02 | v02 | [Files/QA](queue/reviews/crowd-sailor-moon-01-r1.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |
| crowd | crowd-travelers-tourists-02-r1 | 1 | approved | v02 | v02 | [Files/QA](queue/reviews/crowd-travelers-tourists-02-r1.md); final review pending User approved all existing world art on 2026-10-10 (chat with Claude); packed and shipped by Claude. |

## goku

**ENG-112 redraw follow-up (2026-10-18, relays #41–#42):** uTilt v03, uSmash v03 and dSmash v03 are the selected candidates from the one authorized round (three image calls per move). The exact 48-color atlas under `characters/goku/production/eng112-r2-selected-atlas/` is diagnostic only; its temporary placeholder scale records are not evidence and must not ship. Astra technical HOLD: uTilt and uSmash remain visibly undersized against approved idle02; dSmash remains oversized, does not show both clear low active strikes, and one frame is too wide for the 4px margin. No further calls remain authorized. [candidate review](../public/reviews/normals-goku-r2/index.html) · [Astra audit](characters/goku/production/ENG112_R2_ASTRA_AUDIT.md) · [generation provenance](characters/goku/raw/ENG-112_GOKU_R2_PROVENANCE.md).

**ART-CHARGE pilot (2026-10-18):** charge v10 was approved as drawn by the user via Claude relay charge #4 (quote: “Approve v10”). Manifest version and approvedVersion are 10; the unchanged source was copied byte-for-byte from `raw/_qa_hold/charge_v08_attempt03.png` (SHA256 `6317AF1187A981D7FD44DB59A9E5C0F5ED69356FE8D4F5571A9D3E7A8F6B6BE5`). The 48-color pack has 31 animations / 160 frames and loopFrom 2. Technical holds remain: exact f2-f5 floor mask lock (2/1/2 changed pixels), B median 1.175 advisory-high, uncertain segment measurements, and no independently checked interactive lab playback. No scaleManualQA pass is recorded. Approval is visual only; see packed registration/body sheet and review gallery in `public/reviews/charge-goku/`. Claude still needs in-game/contact integration review before merge.

Relay 9 (2026-10-16) authorized one redraw call each for `light3` and `heavy` (fifth cumulative call each). Original outputs `light3_v10` and `heavy_v12` remain preserved under `characters/goku/raw/_qa_hold/`; relay9 assemblies are `light3_v11` (.62, 256px diagnostic plus complete 280px companion) and `heavy_v14` (.720). Relay #10 user-approved heavy v14 as drawn (“Approved”); its exact 22-animation/101-frame strict atlas technical PASS is documented. Relay #11 authorized exactly one sixth cumulative light3 call (user quote: “Goku luffy retry”). Its v12 source is preserved under `_qa_hold`, and v13 is active at `characters/goku/raw/light3_v13.png` with a byte-identical preservation copy under `_qa_hold`; factor .696133442603862 comes from multi-reference torso/boot/belt landmarks, not posed bbox fitting. Astra passed the exact 23-animation/108-frame quantized atlas within measurement uncertainty; all 101 retained alpha masks match the prior audited baseline and light3 v13 packs x1 at bodyHeight237 within native-size tolerance. The real strict branch pack reproduces audited sheet/meta hashes. Manifest newest and approved version is 13. The user approved Goku light3 v13 via Claude relay #12: "Approve Goku light3 v13 and Luffy special v02 as drawn." Heavy v14 stays user-approved/approvedVersion 14. See `characters/goku/production/relay11-generation/` and `characters/goku/production/manual-audit-r5/`. No further generation call is authorized.

**Current repair checkpoint (2026-10-16):** [r05 strict audit](characters/goku/production/manual-audit-r5/FINAL_ATLAS_AUDIT.md). The exact 48-color atlas contains 23 animations / 108 frames and passes Astra review; branch sheet/meta hashes are ebb27850371179a0fdc9da5d76816ebdb52b747712643b60cd40e14bfe6460ca and b43af90a609dc0a36e688bad916c50694962ce2fced6fb02384cd400bcd814ca. Heavy v14 is technically PASS at bodyHeight235 and approved by the user via Claude relay #10 ("Approved"); manifest approvedVersion is 14. Light3 v11 remains a historical 800-pixel clipping hold; light3 v13 passed the exact final atlas audit at x1 and is user-approved via Claude relay #12 ("Approve Goku light3 v13 and Luffy special v02 as drawn."). [r05 review gallery](../public/characters/goku/calibration-r5/index.html) · [r04 parent browser QA](characters/goku/production/relay9-generation/PARENT_BROWSER_R4.md) · [r03 historical handoff](characters/goku/production/reassembly-r03/FINAL_HANDOFF_R03.md). Parent CUA browser session was unavailable for the r5 gallery; no new browser-interaction claim is made. The known getup floor/contact warning still needs Claude runtime review; technical anatomy pass does not certify contacts, timing or gameplay.

**2026-10-15 reference approvals:** User approved model_sheet_v02 and expressions_v02. Both fixed reference PNGs now match v02 byte-for-byte; manifest status approved and approvedVersion 2. Idle02 visual approval is recorded separately; Claude calibration and technical checks remain pending.

**2026-10-15 idle decision:** User explicitly approved goku idle v02 as drawn on 2026-10-15. Visual approval only; Claude calibration, clipping/scale/loop checks and final packed-atlas audit remain pending. No new generation, merge or production deployment authorized. Fixed idle anchor remains unchanged until Claude calibrates the accepted source; existing technical findings remain open.

Data PR feature/char-goku-luffy (ADR 0032): playable on the baked placeholder; moveset in
  [KIT.md](characters/goku/KIT.md). The user withdrew title-style v01 and approved corrected title-style v02
  on 2026-10-14. The fixed reference/title_style_draft.png copies v02 (207±4px body excluding hair; 234px
  including hair); its lineup preserves the four exact approved cells at common density. Body-only ordering is
  above Naruto/Sasuke and below Gojo within uncertainty. Model-sheet v01 and expressions v01 remain held because
  they derive from withdrawn v01; their versioned sources are preserved. The fixed model and expression anchors
  now contain the user-approved v02 files. Idle02 is approved as drawn, with technical checks pending. Idle v01 approval remains historical and is not used as a candidate input.
  Proposed candidate rows: [REVIEW_ROWS.md](characters/goku/REVIEW_ROWS.md). Core batch triage on
  `art/goku-core` began 2026-10-15. Run v04 remains held after the user's one extra authorized call (4 calls total); light1 v02 remains held after 3 calls. The user directed continuing the other six attacks. light2, light3, light4, heavy, airLight1 and airHeavy each received one extra user-authorized redraw call. The six v04 candidates were visually approved as drawn by the user, moved into `raw/`, and marked approved in the manifest; all six still have scale-gate warnings, and light4, heavy and airLight1 also clip. The light2 attempt-4 output was not retained; attempt 5 was saved as v04. `run` and `light1` remain held and unchanged. A partial quantized atlas with idle plus the six approved v04 candidates is in `characters/goku/production/packed-v04-approved-preview/`; the other 16 required core strips are missing or held. The continuation generated candidates for jumpUp v03, jumpFall v02, land v03, guard v04, hurtHigh v07, launched v06, down v04, getup v03, charge v04, beamCharge v04, beamFire v04, special v02 and win v03, at cumulative limits of 2-3 calls each. Automated scale failures are quarantined in raw/_qa_hold; launched/down/getup passed only a manual low-pose proportion comparison (uncertainty ±8-10px), not numeric stature. The latest dry run contains 10 selected animations, fails on six previously user-approved attack candidates (head pops/clips), and is missing 13 required core animations; no full quantized atlas, Astra audit, or preview is ready. See `characters/goku/REVIEW_ROWS.md` and `characters/goku/production/scale-qa/goku-lowpose-contact-v01.png` for evidence. No call remains for these six or light1; do not generate for run.

**Relay #10 approval (2026-10-16):** The user approved exactly Goku heavy v14 via Claude. User quote: "Approved". No other Goku candidate was approved by that reply; light3 v11 remains a historical technical HOLD.

**Relay #12 approval (2026-10-16):** The user approved Goku light3 v13 via Claude. Exact quote: "Approve Goku light3 v13 and Luffy special v02 as drawn." This Goku record covers light3 v13 only; Luffy special v02 is recorded by its worker. Manifest approvedVersion is 13. Four other latest strips retain their original v04 drawing approval by exact-source reassembly at measured density: light2 v05, light4 v09, airLight1 v07, airHeavy v06. Evidence table is in characters/goku/REVIEW_ROWS.md.


**Relay #14 approval (2026-10-16):** The user approved all 16 remaining Goku core drawings via Claude. Exact quote: "Approve all 16 Goku strips and all 19 Luffy strips as drawn." Approved latest versions: run v09, dash v09, jumpUp v04, jumpFall v04, land v07, light1 v04, guard v05, hurtHigh v08, launched v08, down v05, getup v11, charge v05, beamCharge v07, beamFire v07, special v05, win v05. Manifest version and approvedVersion match for every strip. Combined with idle v02, retained v04-design reassemblies and earlier light3 v13/heavy v14 approvals, all 23 core drawings are user-approved. No new calls or pixel changes. The getup floor/contact caveat still needs Claude runtime review; no integration, contact or timing approval is implied.

Round 2b UI (ADR 0035): super_bg, super_fg, ult_bg and ult_fg v01 approved by the user via the approvals desk (relay effects #10, PR #131).
## luffy

Data PR feature/char-goku-luffy (ADR 0032): playable on the baked placeholder; moveset in [KIT.md](characters/luffy/KIT.md). Title-style reference, model sheet, expressions, and idle v01 are user-approved. The user approved down v03 and getup v03 via Claude relay #10, quote “Approved”, and special v02 via Claude relay #12, quote “Approve Goku light3 v13 and Luffy special v02 as drawn.” On 2026-10-16, all 19 remaining core strips were approved via Claude relay #14, exact quote “Approve all 16 Goku strips and all 19 Luffy strips as drawn.”: run v01, dash v02, jumpUp v01, jumpFall v03, land v01, light1 v02, light2 v01, light3 v02, light4 v02, heavy v01, airLight1 v01, airHeavy v01, guard v01, hurtHigh v01, launched v02, charge v01, beamCharge v01, beamFire v02, win v03. Exact attempt history is in [REVIEW_ROWS.md](characters/luffy/REVIEW_ROWS.md).

The final strict r6 review pack exits 0: 23 animations / 108 frames, 4096×1792, 48 colors; 1 approved idle reference + 22 version-bound manual body/scale results. It includes special v02, now user-approved via Claude relay #12. Final atlas SHA-256 e8d5ba9f95a833af82bd13441d3099d15cf44449573e15db5af404f01eb92ce0, metadata SHA-256 7acf280f3c8a7b7b7f2ae8ec75119d8bc61c42e507faaa6ae14a1ee84816ebcd. Astra final strict r6 audit PASSed all 108 actual quantized frames within recorded uncertainty. All 23 core drawings are user-approved; exact versions and relay quotes are recorded in REVIEW_ROWS.md. This technical evidence does not certify runtime/contact/grounding or gameplay.

The earlier down v01 and getup v01 holds are superseded by user-approved v03; manifest approvedVersion is 3 for both. Special v02 was generated under relay #11 (attempt 5/5 cumulative) as a two-pose f6/f7 recovery continuation assembled with the original source-A part. Its manifest status is approved and approvedVersion is 2, following the user's approval via Claude relay #12, exact quote “Approve Goku light3 v13 and Luffy special v02 as drawn.” Astra final r6 review found body-scale and static sequence PASS within measurement uncertainty. The four user-accepted placement exceptions remain run rear foot f3/f4/f7, airLight1 fist f2/f3, light3 toe f3, and light4 foot f4; beamFire arm-only clipping is a separate Claude continuation exception. Ten active frames use the front-28% fallback hitbox and the documented placement clips. See [r6 review gallery](../public/characters/luffy/calibration-r6/index.html), [final Astra audit](characters/luffy/production/manual-audit-r6/FINAL_STRICT_AUDIT.md), and [r5 parent browser check](characters/luffy/production/relay8-generation/PARENT_BROWSER_R5.md). Runtime contacts/grounding remain Claude's responsibility.


Skills revamp Batch 1 (ART-SKL-LUF, relays #1-4): user approved special v04, throw v01, gumArm v03, gumFist v01 and gumImpact v01 as drawn via Claude. Relay #4 sidecars split special to 8/8, reimport gumArm as 2 frames and gumImpact as 7/7; hand anchors were added for special/throw. GPT-6 Astra manually passed all 12 actual quantized special/throw cells for anatomy/scale on the exact pack; version-bound scaleManualQA is recorded. gumArm f0 is a true tile source, but its opaque tube ends 1px short of the right edge; the packer warns, while Claude reports the stretch hides it in game. Runtime hand reach/contact and integration remain Claude's checks. See [Batch 1 provenance](characters/luffy/production/skills-revamp-batch1/candidate-inventory.md), [Astra audit](characters/luffy/production/skills-revamp-batch1/FINAL_RELAY4_ASTRA_AUDIT.md) and [gallery](../public/reviews/luffy-skills-batch1/).

Round 2b UI (ADR 0035): super_bg, super_fg, ult_bg and ult_fg v01 approved by the user via the approvals desk (relay effects #10, PR #131).
## Adding a character

Copy the naruto section, rename it, and add the same block to `manifest.json`
(`characters.<id>`, copied from `animationDefaults`, every asset with `version: 0` and
`approvedVersion: null`). See [PIPELINE.md](PIPELINE.md#adding-a-new-character). The four kit animations
(`specialForward`, `specialUp`, `specialDown`, `superPose`, step 9) are only needed when the
fighter's kit uses them ([ADR 0009](../docs/decisions/0009-move-system-v2.md)); Naruto and Sasuke use all four under ADR 0011. A fighter whose body is genuinely taller or shorter sets
`standingBodyPx` and scaled `bodyHeight`s ([ADR 0010](../docs/decisions/0010-per-character-body-scale.md)).

Neutral height checkpoint: cast height_lineup v01 and four height_neutral v01 sources, all approved 2026-10-11. Full42-animation redraw per fighter authorized; generated strips still need review. Common 200/166 px per cm; no production approval changes. [QA](scale/HEIGHT_STUDY_V01.md).

Gojo title-style production (ART-GOJO-TITLE): approved pilot reference; idle v06 and guard v04 candidates pass first native anatomy inspection. Versioned source strips cover all 42 animations and all three UI candidates v02. Getup v05 now has five segmented poses; superDash v07, launched v06, down v05 and KO v06 clear cell clipping or margins through measured whole-pose placement. A separate diagnostic player at `/qa-gojo/` in the draft preview shows all current candidates and UI without changing the production gate. Corrected specialDown, superPose, throw, airLight1, light3, specialForward and special now pass the automated head gate, with full anatomy and contact QA pending; special's A/B size seam remains held. Run's repeated leg lead, light4's part-size seam and heavy's unclear launcher exhausted three source rounds. The latest strict pack still has 10 scale-gate holds and writes no updated game atlas. Original down/KO pixels remain preserved for Claude's grounding review; their oblique floor contours are inherited from the original poses, not automatic redraw defects. No new animation or UI is approved for release. The original approved Gojo set remains shipped.
Killua additional correction round: idle v06 HOLD (narrow stance), idle_00_fix01 standalone unassembled. Three extra authorized calls used; no passing idle yet.

Killua title production: eight additional independent source candidates (dash05,jumpUp05,jumpFall05,hurtHigh06,land04,intro04,taunt04,win04), one attempt each; six reference-gate ok, taunt/win HOLD. Full production idle and loops remain unresolved.

Killua title continuation: 16 independent candidates now saved; added backDash04,superDash06,jumpSquat05,down07,ko08,airLight1_06,airLight2_07,hurtLow06. v05 idle retained provisionally after controlled anatomy re-evaluation, v06 technically rejected. Candidate approvals unchanged; full pack pending.

Killua continuation now has32 independent animation candidates plus idle/guard and3UI; all title-style versions remain unapproved. Long attacks/reactions and measured fits are listed in production/title-style/candidate-settings.json, with attempt counts in generation-ledger.json.

Killua title-style checkpoint: all42 canonical source strips now assembled (41 candidate settings plus idle05), plus3UI. Source coverage only: strict pack fails and numerous anatomy/motion/contact holds remain. No new approval or live release.

Killua corrections checkpoint: light2v06/light4v10 improve combat recovery; specialv07 removes sliced hand artifacts. RunA/B and specialForwardA/B budgets exhausted with motion/segmentation holds. Existing declared-color probe experiment remains isolated and unpromoted; full gate still pending.

Killua latest QA: specialDown07 retained after final hair-only correction; diagnostic reference28 ok/8 unmeasured/5 flagged. Block151/specialUp197 measured fits retained after peer anatomy review. Full production remains blocked; no new image approved.
Title-style pilot v01: all four sheets and neutral/combat lineups approved by user 2026-10-11. Full animation production authorized; new strips require final review. Original down/KO poses retained with new style.


## Sasuke super / ultimate UI pilot (ART-SUPER-ART)

| Fighter | Asset | Latest | Status | Approved | Notes |
|---|---|---|---|---|---|
| Sasuke | super_bg | v01 | approved | v01 | Kirin; approved via Claude relay effects #2; packed to public/characters/sasuke/super_bg.png. |
| Sasuke | super_fg | v03 | approved | v03 | User approved via Claude relay effects #6 despite Astra hold; arm passes, eyes remain relatively open/round and chin slightly elevated. |
| Sasuke | ult_bg | v01 | approved | v01 | Amaterasu; approved via Claude relay effects #2; packed to public/characters/sasuke/ult_bg.png. |
| Sasuke | ult_fg | v03 | approved | v03 | User approved via Claude relay effects #6 despite Astra hold; connected eye motif faint at fit and blood remains below uncovered eye; rope and sword pass. |

User approved super_bg and ult_bg v01 via Claude relay effects #2 and rejected super_fg and ult_fg v01 via Claude relay effects #3 on 2026-10-15. Both v01 backdrops and both v03 foregrounds are approved. Foreground v01s were rejected; v02s were superseded after user-authorized redraws via relay #5. v03s were approved by the user via Claude relay effects #6 despite Astra holds; each used 3 additional calls (cumulative 6/6). See [review gallery](../public/reviews/super-art-sasuke-r1/) and [production log](characters/sasuke/production/super-art-sasuke-r1/GENERATION_LOG.md).

Killua skills revamp batch 1 (2026-10-18): A1-A7 effect candidates are filed and awaiting user review via Claude relay `killua-skills`. Selected versions: lightningPalm v01, palmCrackle v01, palmShock v02, shockCrawl v02, godspeedBurst v01, godspeedAura v03 and godspeedStreak v03. Frame-count checks pass except `godspeedAura` remains clipped after 3/3 calls; source background/palette strictness is also disclosed. Full saved-version gallery and provenance: [batch 1 review](../public/reviews/killua-skills-batch1/index.html). No candidate is approved.

Killua skills revamp batch 1 approval (2026-10-18): the user approved lightningPalm v01, palmCrackle v01, palmShock v02, shockCrawl v02, godspeedBurst v01, godspeedAura v03 and godspeedStreak v03 as drawn via Claude relay killua-skills #2. Recorded in manifest and REVIEW; superseded saved versions moved to `_rejected/`. `godspeedAura` remains technically clipped despite visual approval. [Gallery](../public/reviews/killua-skills-batch1/index.html). Batch 2 Narukami is now authorized to proceed.

Killua skills revamp batch 2 (2026-10-18): user approved `specialUp` v09, `narukamiBolt` v01 and `narukamiStrike` v01 as drawn via Claude relay killua-skills #3 (“Approve all three”). `specialUp` v09 packs at quantize 48 with auto-head x0.9251 and frame-5 scale exemption; hand anchors and f2-f3 hitboxes measured on fitted cells. Refreshed body median B .897 / H .903. Final Astra audit still HOLDs anatomy/scale, especially dive f5. `narukamiStrike` was manually split to 8 frames. `narukamiBolt` edge mismatch and effect source palette/background deviations remain. [Batch 2 gallery](../public/reviews/killua-skills-batch2/index.html) · [attempt inventory](characters/killua/production/skills-revamp-batch2/ATTEMPT_INVENTORY.md) · [Astra audit](characters/killua/production/skills-revamp-batch3/ASTRA_SPECIALUP.md).

Killua skills revamp batch 3 (2026-10-18): user approved `throw` v07 and `yoyo` v01 as drawn via Claude relay killua-skills #4 (“Approve both”). Throw v07 packs at quantize 48 with auto-head x0.7831 and no clipping; hand anchors measured on fitted cells. Refreshed body median B .879 / H .871. Final Astra audit HOLDs arm-role continuity and the f1 middle-finger/string anchor; no numeric anatomy pass. Yoyo v01 packs 8/8 but the disc is about 88px vs the 52px target; call 1 provenance is incomplete. Approval records the drawings, not technical clearance. [Batch 3 gallery](../public/reviews/killua-skills-batch3/index.html) · [pack evidence](characters/killua/production/skills-revamp-batch3/PACK_REPORT.md) · [Astra audit](characters/killua/production/skills-revamp-batch3/ASTRA_THROW.md).
