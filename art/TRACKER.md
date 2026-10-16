> 2026-10-11 title-style pilot: Naruto, Sasuke, Killua and Gojo title_style_draft v01 and both lineups **approved**; they are the scale and anatomy baseline ([contract](scale/title-style-pilot/PRODUCTION_CONTRACT.md), ADR 0029). Production strips on PR69-72 are separate candidates.

# Art tracker

Gojo round4 checkpoint: idle_v07 and superDash_v08/v09 **needs review / QA HOLD**. Named drafts filed, no approvals changed. New idle wrong target bounds; full strict pack fails from changed head-probe denominator. superDash v09 isolated strict head1.03 but torso/limb chains remain short. [checkpoint](characters/gojo/production/round4/CHECKPOINT.md). Other listed suspects need complete segment audit before redraw.

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

| character | reference (2) | core anims (23) | optional anims | UI (3) | sheet complete |
|---|---|---|---|---|---|
| naruto | 2/2 approved | 23/23 approved | 19/19 approved | 3/3 approved | yes; final batch approved |
| sasuke | 2/2 approved | 2/23 approved | 0/15 | 0/3 | no |
| killua | 2/2 approved | 23/23 approved | 19/19 approved | 3/3 approved | yes; final batch approved |
| gojo | 2/2 approved | 23/23 approved | 19/19 approved | 3/3 approved | yes; final batch approved |
| VFX atlas | 0/1 (style sheet, optional) | 15/20 effects approved (5 power-up effects todo, ENG-069) | - | - | custom atlas (approved 2026-10-10); new effects use procedural stand-ins |
| shared UI | - | - | - | 2/2 approved | - |
| ground decals | 0/1 (style sheet, required first) | 19/31 names (99 approved variants) | - | - | procedural (ADR 0024) |

Naruto and Sasuke can be produced in parallel (separate Codex threads); each thread updates only
its own section below.

## naruto

**Title-style approval (2026-10-11):** the user approved the latest candidates shown in the final review preview; `approved` = the exact version that played (UI portrait v02, cutin v03, select v02 promoted to ui/). The four historical strips that played (light1 v02, special v03, specialForward v02, specialUp v01) stay approved originals. Claude assembled the approved source-only parts with the fixed stitch (light1 v04, light2 v06, airLight3 v07, airHeavy v09, special v08 from v06 parts, specialForward v04, specialUp v04) and re-stitched heavy v12; their playback review is pending. Not shipped yet: see the holds per row and docs/NOW.md.

Title-style production in progress on `art/naruto-title-production`: the user approved `title_style_draft_v01` and neutral/combat samples as the current visual direction. BackDash v04 passed isolated candidate packing and awaits final review. The previously approved animation versions in this table describe historical shipped art; new idle v07, run v07, dash v04, jumpSquat v04, jumpUp v04, jumpFall v04, land v06, guard v05, block v05, hurtHigh v04, down v05, KO v07 and three UI images remain unapproved candidates. Dash/block/jumpFall passed isolated candidate packing; jumpSquat passed with explicit manual low-confidence QA. Idle/run/jumpUp and small-foot land have animation/anatomy holds; down/KO preserve original poses but have low-confidence scale/floor-contact holds; light1 v04 parts are rejected after stitch isolation failure. See [title-style QA](characters/naruto/production/title-style-qa/QA.md).

Brief: [characters/naruto/](characters/naruto/). Shippuden design, ~6.5 heads.

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

User approved v07 as drawn on 2026-10-15. Visual approval only; all Astra anatomy and technical HOLDs remain for Claude. No merge or production authorization.

## killua

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
| 6 | down | 2 | - | **yes** | 90 | approved | v07 | v07 | HOLD (strict gate): v07 f0 hair flare reads 1.09 with the body at reference size (needs a decision or a redraw). Title-style v07 approved by the user 2026-10-11 (shown in the final review preview). |
| 6 | getup | 5 | - | **yes** | 158 | approved | v07 | v07 | Title-style v07 approved by the user 2026-10-11 (shown in the final review preview). |
| 7 | charge | 4 | - | **yes** | 125 | approved | v13 | v13 | Title-style v13 approved by the user 2026-10-12 as a stand-in until the round-3 redraw. Size exception recorded: the head reads 0.92 of the combat cell (strict drift) until charge v14. |
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
| 9 | ko | 1 | - | no | 78 | approved | v08 | v08 | Title-style v08 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | intro | 4 | - | no | 186 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | taunt | 2 | - | no | 186 | approved | v05 | v05 | User approved v05 on 2026-10-12. Previous production QA below is retained as evidence; other held assets are not approved by this decision. New v05 needs review: compact hair, head0.996 ok; recommend approval. One authorized call remains unused. [QA](characters/killua/production/title-style/round2/QA.md). |
| 9 | specialForward | 7 | 2/2/3 | no | 139 | approved | v12 | v12 | Title-style v12 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | specialUp | 6 | 2/2/2 | no | 197 | approved | v08 | v08 | Title-style v08 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | specialDown | 4 | 2/1/1 | no | 180 | approved | v07 | v07 | Title-style v07 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | superPose | 4 | - | no | 186 | approved | v08 | v08 | Title-style v08 approved by the user 2026-10-11 (shown in the final review preview). |
| 11 | ui/portrait.png (96x96) | - | - | no | - | approved | v02 | v02 | Title-style v02 approved by the user 2026-10-11 (shown in the final review preview); copied to ui/. |
| 11 | ui/cutin.png (480x128) | - | - | no | - | approved | v03 | v03 | Title-style v03 approved by the user 2026-10-11 (shown in the final review preview); copied to ui/. |
| 11 | ui/select.png (384x384) | - | - | no | - | approved | v02 | v02 | Title-style v02 approved by the user 2026-10-11 (shown in the final review preview); copied to ui/. |

User approved v08 as drawn on 2026-10-15. Visual approval only; all Astra anatomy and technical HOLDs remain for Claude. No merge or production authorization.

## gojo

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
| 6 | hurtHigh | 3 | - | **yes** | 212 | approved | v03 | v03 | Title-style v03 approved by the user 2026-10-11 (shown in the final review preview). |
| 6 | launched | 2 | - | **yes** | 170 | approved | v06 | v06 | Title-style v06 approved by the user 2026-10-11 (shown in the final review preview). |
| 6 | down | 2 | - | **yes** | 104 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 6 | getup | 5 | - | **yes** | 234 | approved | v05 | v05 | Title-style v05 approved by the user 2026-10-11 (shown in the final review preview). |
| 7 | charge | 4 | - | **yes** | 215 | approved | v07 | v07 | Title-style v07 approved by the user 2026-10-11 (shown in the final review preview). |
| 7 | beamCharge | 3 | - | **yes** | 215 | approved | v03 | v03 | Title-style v03 approved by the user 2026-10-11 (shown in the final review preview). |
| 7 | beamFire | 3 | - | **yes** | 215 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 7 | special | 8 | 3/3/2 | **yes** | 232 | approved | v07 | v07 | Title-style v07 approved by the user 2026-10-12 as a stand-in until the round-3 redraw. |
| 8 | dash | 2 | - | **yes** | 174 | approved | v06 | v06 | Title-style v06 approved by the user 2026-10-11 (shown in the final review preview). |
| 8 | jumpUp | 2 | - | **yes** | 215 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 8 | jumpFall | 2 | - | **yes** | 227 | approved | v06 | v06 | User approved jumpFall v06 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass. |
| 8 | land | 2 | - | **yes** | 189 | approved | v06 | v06 | Title-style v06 approved by the user 2026-10-11 (shown in the final review preview). |
| 8 | win | 4 | - | **yes** | 230 | approved | v07 | v07 | Title-style v07 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | backDash | 3 | - | no | 225 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | superDash | 2 | - | no | 140 | approved | v09 | v09 | User approved superDash v09 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass. |
| 9 | jumpSquat | 1 | - | no | 176 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | airLight2 | 5 | 1/2/2 | no | 225 | approved | v05 | v05 | User approved airLight2 v05 as drawn on 2026-10-15 (all 24 remaining round5 strips). Historical Astra evidence and uncertainty remain; visual approval does not establish a new numeric anatomy pass. |
| 9 | airLight3 | 6 | 2/2/2 | no | 219 | approved | v12 | v12 | User approved v12 on 2026-10-12. Previous production QA below is retained as evidence; other held assets are not approved by this decision. v12 needs review; full strict ok (0.972), all x59..214, six heel-kick phases. Impact heel reach requires Claude gameplay/contact check. A1/B2 budget exhausted. Approved v10 retained. |
| 9 | block | 2 | - | no | 222 | approved | v03 | v03 | Title-style v03 approved by the user 2026-10-11 (shown in the final review preview). |
| 9 | hurtLow | 3 | - | no | 199 | approved | v04 | v04 | Title-style v04 approved by the user 2026-10-11 (shown in the final review preview). |
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
| naruto | raw | - | Rasengan, two-handed push | v01 remains held; user chose redraw v02 (one call, 2nd of 3) via Claude relay beam-clash #3. v02 packed; body sheet B=0.60 of idle and Astra audit pending, so technical hold. |
| sasuke | raw | raw | Chidori Spear thrust; in the air the Great Fireball (blown from the mouth, hand sign at the lips) | v01 ground and air candidates packed in sparse worktree; body/contact checks and Astra audit pending; technical hold. |
| killua | raw | raw | Narukami, open palm (in the air driven down) | v01 ground and air candidates packed in sparse worktree; body/contact checks and Astra audit pending; technical hold. |
| gojo | raw | raw | Reversal: Red at two fingertips, other hand in the pocket (in the air pointed down) | v01 ground and air candidates packed in sparse worktree; body/contact checks and Astra audit pending; technical hold. |
| goku | todo | - | Dragon Fist lunge | after his core art is on main; no air energy shot |

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
| naruto | 5 candidates: light1Alt v01, light2Alt v01/v02/v03/v04, light3Alt v01/v02, light4Alt v01 | heavyAlt v01/v02 (v02 is byte-identical measured restitch) | 3 candidates: airLight1Alt/2Alt/3Alt v01 | airHeavyAlt v01/v02; v03 held under `raw/_qa_hold/` | hurtHighAlt/HurtLowAlt v01 | ART-ALTS-NAR: light2Alt v04 source repair filed 2026-10-15 under one extra user-authorized imagegen call; local diagnostic pack still reports +30px reach / -30px height contact residual. All candidates await independent anatomy/contact review. airHeavyAlt v03 is quarantined; v02 may remain the highest raw candidate and base fallback is unverified. Claude owns repack/cache/fallback resolution (see production/alts/HOLD_AIRHEAVY_20261015.md). No candidate approved or deployed. |
| sasuke | todo | todo | todo | todo | todo | after the Naruto pilot (ART-ALTS) |
| killua | todo | todo | todo | todo | todo | after the Naruto pilot (ART-ALTS) |
| gojo | todo | todo | todo | todo | todo | after the Naruto pilot (ART-ALTS) |

## VFX atlas (step 10)

Brief: [vfx/EFFECTS.md](vfx/EFFECTS.md). Candidates `art/vfx/raw/<effect>_vNN.png` (the packer uses
the highest version). VFX cells stay 128 x 128 (ppu 56). Missing effects fall back to the procedural
ones.

| effect | frames | ms | color rule | anchor | status | version | approved | notes |
|---|---|---|---|---|---|---|---|---|
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

**2026-10-15 reference approvals:** User approved model_sheet_v02 and expressions_v02. Both fixed reference PNGs now match v02 byte-for-byte; manifest status approved and approvedVersion 2. Idle02 visual approval is recorded separately; Claude calibration and technical checks remain pending.

**2026-10-15 idle decision:** User explicitly approved goku idle v02 as drawn on 2026-10-15. Visual approval only; Claude calibration, clipping/scale/loop checks and final packed-atlas audit remain pending. No new generation, merge or production deployment authorized. Fixed idle anchor remains unchanged until Claude calibrates the accepted source; existing technical findings remain open.

Data PR feature/char-goku-luffy (ADR 0032): playable on the baked placeholder; moveset in
  [KIT.md](characters/goku/KIT.md). The user withdrew title-style v01 and approved corrected title-style v02
  on 2026-10-14. The fixed reference/title_style_draft.png copies v02 (207±4px body excluding hair; 234px
  including hair); its lineup preserves the four exact approved cells at common density. Body-only ordering is
  above Naruto/Sasuke and below Gojo within uncertainty. Model-sheet v01 and expressions v01 remain held because
  they derive from withdrawn v01; their versioned sources are preserved. The fixed model and expression anchors
  now contain the user-approved v02 files. Idle02 is approved as drawn, with technical checks pending. Idle v01 approval remains historical and is not used as a candidate input.
  Proposed candidate rows: [REVIEW_ROWS.md](characters/goku/REVIEW_ROWS.md).
## luffy

Data PR feature/char-goku-luffy (ADR 0032): playable on the baked placeholder; moveset in [KIT.md](characters/luffy/KIT.md). The title-style neutral/combat reference v01, model sheet v01, expressions v01, and idle v01 are user-approved. Fixed-name reference copies are in place. The idle remains un-packed and has no scale-gate or in-game QA claim. Proposed review rows and provenance are in the Luffy art folder. Core animation production belongs in a separate branch from main after this refs PR is merged by Claude.

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
| Sasuke | super_bg | v01 | approved | v01 | Kirin; approved via Claude relay effects #2; not packed. |
| Sasuke | super_fg | v01 (rejected) | raw | — | Kirin; user rejected via Claude relay effects #3; source archived. |
| Sasuke | ult_bg | v01 | approved | v01 | Amaterasu; approved via Claude relay effects #2; not packed. |
| Sasuke | ult_fg | v01 (rejected) | raw | — | Amaterasu; user rejected via Claude relay effects #3; source archived. |

User approved super_bg and ult_bg v01 via Claude relay effects #2 and rejected super_fg and ult_fg v01 via Claude relay effects #3 on 2026-10-15. Only the backdrops are approved; foreground technical holds remain documented. See [review gallery](../public/reviews/super-art-sasuke-r1/) and [production log](characters/sasuke/production/super-art-sasuke-r1/GENERATION_LOG.md).
