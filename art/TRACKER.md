# Art tracker

> Naruto light4 v07 approved2026-10-11; full strict pack passes (exit0). Localized f0 hair patch,1/3 calls used; bodies/other7poses unchanged. Heavy10/throw5/airLight3_5 remain approved. [QA](characters/naruto/production/light4-local/QA.md).

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

Brief: [characters/naruto/](characters/naruto/). Shippuden design, ~6.5 heads.

| step | asset | frames | phases | core | body px | status | version | approved | notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 | reference/model_sheet_vNN.png -> model_sheet.png | - | - | yes | - | approved | v03 | v03 | User approved v03 on 2026-10-10 (seven-head proportions); promoted to model_sheet.png. v03 seven-head candidate needs review with lineup; see PROPORTION_REDRAW.md and v03 QA. User approved shorter-hair v02 on 2026-10-09; fixed model_sheet.png saved unchanged. Hair propagation complete: expressions/idle v02 and run v03 approved (ART-NAR-12) |
| 2 | reference/expressions_vNN.png -> expressions.png | - | - | yes | - | approved | v02 | v02 | User approved short-hair v02 on 2026-10-09; copied unchanged to expressions.png. Idle v02 and run v03 also approved; hair propagation complete (ART-NAR-12) |
| 3 | idle | 8 | - | **yes** | 204 | approved | v04 | v02 | v04 seven-head candidate pending; v03 superseded after probe check.  User approved short-hair v02 on 2026-10-09; copied unchanged to idle_approved.png. 48 colors, zero pack warnings; inherited small head-loop shift documented (ART-NAR-12) |
| 4 | run | 8 | - | **yes** | 204 | approved | v04 | v04 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 5 | light1 | 7 | 2/2/3 | **yes** | 204 | approved | v02 | v02 | Final batch approved; see production/QA.md |
| 5 | light2 | 7 | 2/2/3 | **yes** | 204 | approved | v01 | v01 | Final batch approved; see production/QA.md |
| 5 | light3 | 7 | 2/2/3 | **yes** | 215 | approved | v01 | v01 | Final batch approved; see production/QA.md |
| 5 | light4 | 8 | 3/2/3 | **yes** | 207 | approved | v01 | v01 | Final batch approved; see production/QA.md |
| 5 | heavy | 8 | 3/2/3 | **yes** | 218 | approved | v07 | v07 | User approved everything 2026-10-10; documented QA caveats accepted; Claude integration pending. |
| 5 | airLight1 | 5 | 1/2/2 | **yes** | 198 | approved | v03 | v03 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 5 | airHeavy | 6 | 2/2/2 | **yes** | 198 | approved | v03 | v03 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 6 | guard | 2 | - | **yes** | 198 | approved | v03 | v03 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 6 | hurtHigh | 3 | - | **yes** | 195 | approved | v01 | v01 | Final batch approved; see production/QA.md |
| 6 | launched | 2 | - | **yes** | 136 | approved | v02 | v02 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 6 | down | 2 | - | **yes** | 96 | approved | v02 | v02 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). Regenerate side-on (ART-KO-01, [scale/KO_DOWN_BRIEF.md](scale/KO_DOWN_BRIEF.md)): drawn from above, it floats; the packer ground check warns (ADR 0020). |
| 6 | getup | 5 | - | **yes** | 204 | approved | v02 | v02 | Final batch approved; see production/QA.md |
| 7 | charge | 4 | - | **yes** | 198 | approved | v04 | v04 | User approved everything 2026-10-10; documented QA caveats accepted; Claude integration pending. |
| 7 | beamCharge | 3 | - | **yes** | 198 | approved | v05 | v05 | User approved everything 2026-10-10; documented QA caveats accepted; Claude integration pending. |
| 7 | beamFire | 3 | - | **yes** | 198 | approved | v07 | v07 | User approved everything 2026-10-10; documented QA caveats accepted; Claude integration pending. |
| 7 | special | 8 | 3/3/2 | **yes** | 204 | approved | v03 | v03 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 8 | dash | 2 | - | **yes** | 160 | approved | v02 | v02 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 8 | jumpUp | 2 | - | **yes** | 198 | approved | v01 | v01 | Final batch approved; see production/QA.md |
| 8 | jumpFall | 2 | - | **yes** | 209 | approved | v01 | v01 | Final batch approved; see production/QA.md |
| 8 | land | 2 | - | **yes** | 174 | approved | v01 | v01 | Final batch approved; see production/QA.md |
| 8 | win | 4 | - | **yes** | 212 | approved | v03 | v03 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | backDash | 3 | - | no | 207 | approved | v01 | v01 | Final batch approved; see production/QA.md |
| 9 | superDash | 2 | - | no | 120 | approved | v01 | v01 | Final batch approved; see production/QA.md |
| 9 | jumpSquat | 1 | - | no | 162 | approved | v02 | v02 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | airLight2 | 5 | 1/2/2 | no | 207 | approved | v03 | v03 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | airLight3 | 6 | 2/2/2 | no | 201 | approved | v02 | v02 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | block | 2 | - | no | 204 | approved | v03 | v03 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | hurtLow | 3 | - | no | 183 | approved | v01 | v01 | Final batch approved; see production/QA.md |
| 9 | spin | 4 | - | no | 160 | approved | v02 | v02 | Final batch approved; see production/QA.md |
| 9 | airRecover | 3 | - | no | 180 | approved | v02 | v02 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | throw | 4 | 1/1/2 | no | 201 | approved | v02 | v02 | Final batch approved; see production/QA.md |
| 9 | vanish | 2 | - | no | 221 | approved | v01 | v01 | Final batch approved; see production/QA.md |
| 9 | stagger | 4 | - | no | 207 | approved | v01 | v01 | Final batch approved; see production/QA.md |
| 9 | ko | 1 | - | no | 64 | approved | v05 | v05 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). Regenerate side-on (ART-KO-01, [scale/KO_DOWN_BRIEF.md](scale/KO_DOWN_BRIEF.md)): drawn from above, it floats; the packer ground check warns (ADR 0020). |
| 9 | intro | 4 | - | no | 210 | approved | v01 | v01 | Final batch approved; see production/QA.md |
| 9 | taunt | 2 | - | no | 212 | approved | v01 | v01 | Final batch approved; see production/QA.md |
| 9 | specialForward | 7 | 2/2/3 | no | 204 | approved | v02 | v02 | Final batch approved; see production/QA.md |
| 9 | specialUp | 6 | 2/2/2 | no | 214 | approved | v01 | v01 | Final batch approved; see production/QA.md |
| 9 | specialDown | 4 | 2/1/1 | no | 204 | approved | v02 | v02 | Final batch approved; see production/QA.md |
| 9 | superPose | 4 | - | no | 208 | approved | v03 | v03 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 11 | ui/portrait.png (96x96) | - | - | no | - | approved | v01 | v01 | Final batch approved; see production/QA.md |
| 11 | ui/cutin.png (480x128) | - | - | no | - | approved | v02 | v02 | Final batch approved; see production/QA.md |
| 11 | ui/select.png (384x384) | - | - | no | - | approved | v01 | v01 | Final batch approved; see production/QA.md |

## sasuke

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
| 3 | idle | 8 | - | **yes** | 204 | approved | v01 | v01 | User approved 2026-10-09; 6 px breathing bob accepted; fixed idle_approved.png saved unchanged; 48-color pack, game/Sprite Lab checked |
| 4 | run | 8 | - | **yes** | 204 | approved | v02 | v02 | User approved 2026-10-09; 48 colors, zero final warnings, corrected placement and flight lift. Naruto hair update is a separate reference revision. |
| 5 | light1 | 7 | 2/2/3 | **yes** | 204 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 5 | light2 | 7 | 2/2/3 | **yes** | 204 | approved | v02 | v02 | User approved latest version 2026-10-10; documented QA deviations accepted. Ready for integration. |
| 5 | light3 | 7 | 2/2/3 | **yes** | 215 | approved | v02 | v02 | User approved latest version 2026-10-10; documented QA deviations accepted. Ready for integration. |
| 5 | light4 | 8 | 3/2/3 | **yes** | 207 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 5 | heavy | 8 | 3/2/3 | **yes** | 218 | approved | v06 | v06 | User approved latest version 2026-10-10; documented QA deviations accepted. Ready for integration. |
| 5 | airLight1 | 5 | 1/2/2 | **yes** | 198 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 5 | airHeavy | 6 | 2/2/2 | **yes** | 198 | approved | v02 | v02 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 6 | guard | 2 | - | **yes** | 198 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 6 | hurtHigh | 3 | - | **yes** | 195 | approved | v02 | v02 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 6 | launched | 2 | - | **yes** | 136 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 6 | down | 2 | - | **yes** | 96 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). Regenerate side-on (ART-KO-01, [scale/KO_DOWN_BRIEF.md](scale/KO_DOWN_BRIEF.md)): drawn from above, it floats; the packer ground check warns (ADR 0020). |
| 6 | getup | 5 | - | **yes** | 204 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 7 | charge | 4 | - | **yes** | 198 | approved | v04 | v02 | User rejected new charge; approved v02 active. v03/v04 archived; v04 is historical newest, not active. |
| 7 | beamCharge | 3 | - | **yes** | 198 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 7 | beamFire | 3 | - | **yes** | 198 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 7 | special | 8 | 3/3/2 | **yes** | 204 | approved | v03 | v03 | User approved latest version 2026-10-10; documented QA deviations accepted. Ready for integration. |
| 8 | dash | 2 | - | **yes** | 160 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 8 | jumpUp | 2 | - | **yes** | 198 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 8 | jumpFall | 2 | - | **yes** | 209 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 8 | land | 2 | - | **yes** | 174 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 8 | win | 4 | - | **yes** | 212 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | backDash | 3 | - | no | 207 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | superDash | 2 | - | no | 120 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | jumpSquat | 1 | - | no | 162 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | airLight2 | 5 | 1/2/2 | no | 207 | approved | v02 | v02 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | airLight3 | 6 | 2/2/2 | no | 201 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | block | 2 | - | no | 204 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | hurtLow | 3 | - | no | 183 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | spin | 4 | - | no | 160 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | airRecover | 3 | - | no | 180 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | throw | 4 | 1/1/2 | no | 201 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | vanish | 2 | - | no | 221 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | stagger | 4 | - | no | 207 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | ko | 1 | - | no | 64 | approved | v02 | v02 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). Regenerate side-on (ART-KO-01, [scale/KO_DOWN_BRIEF.md](scale/KO_DOWN_BRIEF.md)): drawn from above, it floats; the packer ground check warns (ADR 0020). |
| 9 | intro | 4 | - | no | 210 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | taunt | 2 | - | no | 212 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 11 | ui/portrait.png (96x96) | - | - | no | - | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 11 | ui/cutin.png (480x128) | - | - | no | - | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 11 | ui/select.png (384x384) | - | - | no | - | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |

| 9 | specialForward | 7 | 2/2/3 | no | 204 | approved | v02 | v02 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | specialUp | 6 | 2/2/2 | no | 214 | approved | v02 | v02 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | specialDown | 4 | 2/1/1 | no | 204 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | superPose | 4 | - | no | 208 | approved | v01 | v01 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |

## killua

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
| 3 | idle | 8 | - | **yes** | 186 | approved | v01 | v01 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 4 | run | 8 | - | **yes** | 186 | approved | v03 | v03 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 5 | light1 | 7 | 2/2/3 | **yes** | 186 | approved | v02 | v02 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 5 | light2 | 7 | 2/2/3 | **yes** | 186 | approved | v02 | v02 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 5 | light3 | 7 | 2/2/3 | **yes** | 196 | approved | v02 | v02 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 5 | light4 | 8 | 3/2/3 | **yes** | 188 | approved | v02 | v02 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 5 | heavy | 8 | 3/2/3 | **yes** | 206 | approved | v05 | v05 | Approved2026-10-10 with documented QA caveats; ready for integration. |
| 5 | airLight1 | 5 | 1/2/2 | **yes** | 180 | approved | v02 | v02 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 5 | airHeavy | 6 | 2/2/2 | **yes** | 180 | approved | v01 | v01 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 6 | guard | 2 | - | **yes** | 180 | approved | v03 | v03 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 6 | hurtHigh | 3 | - | **yes** | 177 | approved | v02 | v02 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 6 | launched | 2 | - | **yes** | 124 | approved | v01 | v01 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 6 | down | 2 | - | **yes** | 87 | approved | v01 | v01 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md Regenerate side-on (ART-KO-01, [scale/KO_DOWN_BRIEF.md](scale/KO_DOWN_BRIEF.md)): drawn from above, it floats; the packer ground check warns (ADR 0020). |
| 6 | getup | 5 | - | **yes** | 186 | approved | v02 | v02 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 7 | charge | 4 | - | **yes** | 180 | approved | v07 | v07 | Approved2026-10-10 with documented QA caveats; ready for integration. |
| 7 | beamCharge | 3 | - | **yes** | 180 | approved | v05 | v05 | Approved2026-10-10 with documented QA caveats; ready for integration. |
| 7 | beamFire | 3 | - | **yes** | 180 | approved | v04 | v04 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 7 | special | 8 | 3/3/2 | **yes** | 186 | approved | v02 | v02 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 8 | dash | 2 | - | **yes** | 146 | approved | v02 | v02 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 8 | jumpUp | 2 | - | **yes** | 180 | approved | v01 | v01 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 8 | jumpFall | 2 | - | **yes** | 190 | approved | v01 | v01 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 8 | land | 2 | - | **yes** | 158 | approved | v01 | v01 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 8 | win | 4 | - | **yes** | 193 | approved | v01 | v01 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 9 | backDash | 3 | - | no | 188 | approved | v01 | v01 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 9 | superDash | 2 | - | no | 109 | approved | v02 | v02 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | jumpSquat | 1 | - | no | 147 | approved | v02 | v02 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | airLight2 | 5 | 1/2/2 | no | 188 | approved | v02 | v02 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 9 | airLight3 | 6 | 2/2/2 | no | 183 | approved | v02 | v02 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 9 | block | 2 | - | no | 186 | approved | v03 | v03 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | hurtLow | 3 | - | no | 167 | approved | v02 | v02 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | spin | 4 | - | no | 146 | approved | v01 | v01 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 9 | airRecover | 3 | - | no | 164 | approved | v02 | v02 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 9 | throw | 4 | 1/1/2 | no | 183 | approved | v02 | v02 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 9 | vanish | 2 | - | no | 201 | approved | v01 | v01 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 9 | stagger | 4 | - | no | 188 | approved | v01 | v01 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 9 | ko | 1 | - | no | 58 | approved | v02 | v02 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). Regenerate side-on (ART-KO-01, [scale/KO_DOWN_BRIEF.md](scale/KO_DOWN_BRIEF.md)): drawn from above, it floats; the packer ground check warns (ADR 0020). |
| 9 | intro | 4 | - | no | 191 | approved | v01 | v01 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 9 | taunt | 2 | - | no | 193 | approved | v01 | v01 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 9 | specialForward | 7 | 2/2/3 | no | 186 | approved | v04 | v04 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 9 | specialUp | 6 | 2/2/2 | no | 198 | approved | v02 | v02 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 9 | specialDown | 4 | 2/1/1 | no | 188 | approved | v01 | v01 | User approved final batch 2026-10-09; QA caveats retained in production/QA.md |
| 9 | superPose | 4 | - | no | 191 | approved | v03 | v03 | User approved the final batch 2026-10-10 (chat with Claude, PR #9). |
| 11 | ui/portrait.png (96x96) | - | - | no | - | approved | v01 | v01 | User approved final batch 2026-10-09; fixed reference/UI promoted |
| 11 | ui/cutin.png (480x128) | - | - | no | - | approved | v02 | v02 | User approved final batch 2026-10-09; fixed reference/UI promoted |
| 11 | ui/select.png (384x384) | - | - | no | - | approved | v01 | v01 | User approved final batch 2026-10-09; fixed reference/UI promoted |

## gojo

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
| 3 | idle | 8 | - | **yes** | 222 | approved | v03 | v02 | ART-SCALE-01 corrected-scale candidate; previous approval retained; final motion review pending. |
| 4 | run | 8 | - | **yes** | 222 | approved | v04 | v03 | enlarged-head candidate rejected; original approved art active |
| 5 | light1 | 7 | 2/2/3 | **yes** | 222 | approved | v02 | v01 | enlarged-head candidate rejected; original approved art active |
| 5 | light2 | 7 | 2/2/3 | **yes** | 222 | approved | v02 | v01 | enlarged-head candidate rejected; original approved art active |
| 5 | light3 | 7 | 2/2/3 | **yes** | 228 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 5 | light4 | 8 | 3/2/3 | **yes** | 225 | approved | v02 | v02 | User approved complete batch 2026-10-09; see production/QA.md. |
| 5 | heavy | 8 | 3/2/3 | **yes** | 228 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 5 | airLight1 | 5 | 1/2/2 | **yes** | 215 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 5 | airHeavy | 6 | 2/2/2 | **yes** | 215 | approved | v02 | v02 | User approved complete batch 2026-10-09; see production/QA.md. |
| 6 | guard | 2 | - | **yes** | 215 | approved | v02 | v01 | enlarged-head candidate rejected; original approved art active |
| 6 | hurtHigh | 3 | - | **yes** | 212 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 6 | launched | 2 | - | **yes** | 148 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 6 | down | 2 | - | **yes** | 104 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. Regenerate side-on with ART-GOJ-BUILD (route B, [scale/KO_DOWN_BRIEF.md](scale/KO_DOWN_BRIEF.md)): drawn from above, it floats; the packer ground check warns (ADR 0020). |
| 6 | getup | 5 | - | **yes** | 222 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 7 | charge | 4 | - | **yes** | 215 | approved | v02 | v01 | enlarged-head candidate rejected; original approved art active |
| 7 | beamCharge | 3 | - | **yes** | 215 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 7 | beamFire | 3 | - | **yes** | 215 | approved | v02 | v02 | User approved complete batch 2026-10-09; see production/QA.md. |
| 7 | special | 8 | 3/3/2 | **yes** | 222 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 8 | dash | 2 | - | **yes** | 174 | approved | v02 | v01 | enlarged-head candidate rejected; original approved art active |
| 8 | jumpUp | 2 | - | **yes** | 215 | approved | v02 | v01 | enlarged-head candidate rejected; original approved art active |
| 8 | jumpFall | 2 | - | **yes** | 227 | approved | v02 | v01 | enlarged-head candidate rejected; original approved art active |
| 8 | land | 2 | - | **yes** | 189 | approved | v02 | v01 | enlarged-head candidate rejected; original approved art active |
| 8 | win | 4 | - | **yes** | 230 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | backDash | 3 | - | no | 225 | approved | v02 | v01 | enlarged-head candidate rejected; original approved art active |
| 9 | superDash | 2 | - | no | 140 | approved | v02 | v01 | enlarged-head candidate rejected; original approved art active |
| 9 | jumpSquat | 1 | - | no | 176 | approved | v02 | v01 | enlarged-head candidate rejected; original approved art active |
| 9 | airLight2 | 5 | 1/2/2 | no | 225 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | airLight3 | 6 | 2/2/2 | no | 219 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | block | 2 | - | no | 222 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | hurtLow | 3 | - | no | 199 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | spin | 4 | - | no | 174 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | airRecover | 3 | - | no | 196 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | throw | 4 | 1/1/2 | no | 219 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | vanish | 2 | - | no | 232 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | stagger | 4 | - | no | 225 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | ko | 1 | - | no | 70 | approved | v02 | v02 | User approved complete batch 2026-10-09; see production/QA.md. Regenerate side-on with ART-GOJ-BUILD (route B, [scale/KO_DOWN_BRIEF.md](scale/KO_DOWN_BRIEF.md)): drawn from above, it floats; the packer ground check warns (ADR 0020). |
| 9 | intro | 4 | - | no | 228 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | taunt | 2 | - | no | 228 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | specialForward | 7 | 2/2/3 | no | 222 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | specialUp | 6 | 2/2/2 | no | 232 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | specialDown | 4 | 2/1/1 | no | 222 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | superPose | 4 | - | no | 230 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 11 | ui/portrait.png (96x96) | - | - | no | - | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 11 | ui/cutin.png (480x128) | - | - | no | - | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 11 | ui/select.png (384x384) | - | - | no | - | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |

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

## Adding a character

Copy the naruto section, rename it, and add the same block to `manifest.json`
(`characters.<id>`, copied from `animationDefaults`, every asset with `version: 0` and
`approvedVersion: null`). See [PIPELINE.md](PIPELINE.md#adding-a-new-character). The four kit animations
(`specialForward`, `specialUp`, `specialDown`, `superPose`, step 9) are only needed when the
fighter's kit uses them ([ADR 0009](../docs/decisions/0009-move-system-v2.md)); Naruto and Sasuke use all four under ADR 0011. A fighter whose body is genuinely taller or shorter sets
`standingBodyPx` and scaled `bodyHeight`s ([ADR 0010](../docs/decisions/0010-per-character-body-scale.md)).

## Naruto neutral production checkpoint (2026-10-11)

All42 new sources attempted;32 packed candidates,10 technical holds. No new animation approved. Latest versions and individual gate/hold states: [production QA](characters/naruto/PRODUCTION_QA.md). ApprovedVersion values remain unchanged. Shared production standing target192.562px overrides historical table heights for these candidates.

| Animation | Latest | Packed | Gate | Recommendation |
|---|---|---|---|---|
| airHeavy | v04 | v04 | ok | Candidate visual review |
| airLight1 | v04 | v04 | ok | Candidate visual review |
| airLight2 | v04 | v03 | old fallback: drift | Hold; correction required |
| airLight3 | v04 | v02 | old fallback: pop | Hold; correction required |
| airRecover | v03 | v03 | unmeasured | Manual scale verification required |
| backDash | v03 | v03 | ok | Candidate visual review |
| beamCharge | v06 | v06 | exempt | Review transformed anatomy separately |
| beamFire | v08 | v08 | exempt | Review transformed anatomy separately |
| block | v04 | v04 | ok | Candidate visual review |
| charge | v05 | v04 | old fallback: drift | Hold; correction required |
| dash | v03 | v03 | ok | Candidate visual review |
| down | v03 | v03 | unmeasured | Manual scale verification required |
| getup | v04 | v04 | unmeasured | Manual scale verification required |
| guard | v04 | v04 | ok | Candidate visual review |
| heavy | v08 | v07 | old fallback: pop | Hold; correction required |
| hurtHigh | v02 | v01 | old fallback: unmeasured | Hold; correction required |
| hurtLow | v02 | v02 | ok | Candidate visual review |
| idle | v05 | v05 | ref | Candidate visual review |
| intro | v02 | v02 | ok | Candidate visual review |
| jumpFall | v03 | v03 | ok | Candidate visual review |
| jumpSquat | v03 | v03 | unmeasured | Manual scale verification required |
| jumpUp | v03 | v03 | ok | Candidate visual review |
| ko | v06 | v06 | unmeasured | Manual scale verification required |
| land | v03 | v03 | ok | Candidate visual review |
| launched | v03 | v03 | unmeasured | Manual scale verification required |
| light1 | v03 | v03 | ok | Candidate visual review |
| light2 | v02 | v02 | ok | Candidate visual review |
| light3 | v02 | v02 | ok | Candidate visual review |
| light4 | v03 | v01 | old fallback: drift | Hold; correction required |
| run | v05 | v05 | ok | Candidate visual review |
| special | v05 | v05 | ok | Candidate visual review |
| specialDown | v03 | v02 | old fallback: drift | Hold; correction required |
| specialForward | v03 | v02 | old fallback: drift | Hold; correction required |
| specialUp | v03 | v03 | ok | Candidate visual review |
| spin | v03 | v03 | unmeasured | Manual scale verification required |
| stagger | v02 | v02 | ok | Candidate visual review |
| superDash | v02 | v02 | ok | Candidate visual review |
| superPose | v04 | v04 | ok | Candidate visual review |
| taunt | v02 | v01 | old fallback: unmeasured | Hold; correction required |
| throw | v04 | v02 | old fallback: ok | Hold; correction required |
| vanish | v02 | v02 | unmeasured | Manual scale verification required |
| win | v04 | v04 | ok | Candidate visual review |

## Naruto visual approval recorded (2026-10-11)

User visual approval, 2026-10-11: "ok whats left to do? i approve everything and would like to see it live on the game". Applies to the42 latest reviewed checkpoint versions below. Technical clearance is separate:10 strict holds and8 unmeasured candidates remain. Shipping approvedVersion updates and fixed-name promotion are deferred until technical QA clears; no thresholds, baseline, or exemptions changed. No extra generation attempts inferred. Claude alone integrates and deploys production.

[Exact42-version approval record](characters/naruto/VISUAL_APPROVAL_2026-10-11.md).
Neutral height checkpoint: cast height_lineup v01 and four height_neutral v01 sources, all approved 2026-10-11. Full42-animation redraw per fighter authorized; generated strips still need review. Common 200/166 px per cm; no production approval changes. [QA](scale/HEIGHT_STUDY_V01.md).
