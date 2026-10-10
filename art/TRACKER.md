# Art tracker

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

A character's sheet is used by the game automatically once **every core animation** (marked
**yes**) is at least `packed` (the packer then writes `"complete": true`). Before that, preview
with `http://127.0.0.1:5188/?art=custom`. Use the notes column for problems ("F03 fist too
low", "regenerate: hair color drifted"); per-version QA notes go in REVIEW.md.

## Summary

| character | reference (2) | core anims (23) | optional anims | UI (3) | sheet complete |
|---|---|---|---|---|---|
| naruto | 2/2 approved | 2/23 approved | 0/19 | 0/3 | no |
| sasuke | 2/2 approved | 2/23 approved | 0/15 | 0/3 | no |
| killua | 0/2 | 0/23 | 0/19 | 0/3 | no |
| gojo | 0/2 | 0/23 | 0/19 | 0/3 | no |
| VFX atlas | 0/1 (style sheet, optional) | 0/15 effects | - | - | procedural fallback |
| shared UI | - | - | - | 0/2 | - |

Naruto and Sasuke can be produced in parallel (separate Codex threads); each thread updates only
its own section below.

## naruto

Brief: [characters/naruto/](characters/naruto/). Shippuden design, ~6.5 heads.

| step | asset | frames | phases | core | body px | status | version | approved | notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 | reference/model_sheet_vNN.png -> model_sheet.png | - | - | yes | - | approved | v02 | v02 | User approved shorter-hair v02 on 2026-10-09; fixed model_sheet.png saved unchanged. Hair propagation complete: expressions/idle v02 and run v03 approved (ART-NAR-12) |
| 2 | reference/expressions_vNN.png -> expressions.png | - | - | yes | - | approved | v02 | v02 | User approved short-hair v02 on 2026-10-09; copied unchanged to expressions.png. Idle v02 and run v03 also approved; hair propagation complete (ART-NAR-12) |
| 3 | idle | 8 | - | **yes** | 204 | approved | v02 | v02 | User approved short-hair v02 on 2026-10-09; copied unchanged to idle_approved.png. 48 colors, zero pack warnings; inherited small head-loop shift documented (ART-NAR-12) |
| 4 | run | 8 | - | **yes** | 204 | approved | v03 | v03 | User approved the short-hair run v03; same gait/placement/timing, 48 colors, zero pack warnings. Hair propagation complete. |
| 5 | light1 | 7 | 2/2/3 | **yes** | 204 | todo | - | - | |
| 5 | light2 | 7 | 2/2/3 | **yes** | 204 | todo | - | - | |
| 5 | light3 | 7 | 2/2/3 | **yes** | 215 | todo | - | - | |
| 5 | light4 | 8 | 3/2/3 | **yes** | 207 | todo | - | - | |
| 5 | heavy | 8 | 3/2/3 | **yes** | 218 | todo | - | - | |
| 5 | airLight1 | 5 | 1/2/2 | **yes** | 198 | todo | - | - | |
| 5 | airHeavy | 6 | 2/2/2 | **yes** | 198 | todo | - | - | |
| 6 | guard | 2 | - | **yes** | 198 | todo | - | - | |
| 6 | hurtHigh | 3 | - | **yes** | 195 | todo | - | - | |
| 6 | launched | 2 | - | **yes** | 136 | todo | - | - | |
| 6 | down | 2 | - | **yes** | 96 | todo | - | - | |
| 6 | getup | 5 | - | **yes** | 204 | todo | - | - | |
| 7 | charge | 4 | - | **yes** | 198 | todo | - | - | |
| 7 | beamCharge | 3 | - | **yes** | 198 | todo | - | - | |
| 7 | beamFire | 3 | - | **yes** | 198 | todo | - | - | |
| 7 | special | 8 | 3/3/2 | **yes** | 204 | todo | - | - | |
| 8 | dash | 2 | - | **yes** | 160 | todo | - | - | |
| 8 | jumpUp | 2 | - | **yes** | 198 | todo | - | - | |
| 8 | jumpFall | 2 | - | **yes** | 209 | todo | - | - | |
| 8 | land | 2 | - | **yes** | 174 | todo | - | - | |
| 8 | win | 4 | - | **yes** | 212 | todo | - | - | |
| 9 | backDash | 3 | - | no | 207 | todo | - | - | |
| 9 | superDash | 2 | - | no | 120 | todo | - | - | |
| 9 | jumpSquat | 1 | - | no | 162 | todo | - | - | |
| 9 | airLight2 | 5 | 1/2/2 | no | 207 | todo | - | - | |
| 9 | airLight3 | 6 | 2/2/2 | no | 201 | todo | - | - | |
| 9 | block | 2 | - | no | 204 | todo | - | - | |
| 9 | hurtLow | 3 | - | no | 183 | todo | - | - | |
| 9 | spin | 4 | - | no | 160 | todo | - | - | |
| 9 | airRecover | 3 | - | no | 180 | todo | - | - | |
| 9 | throw | 4 | 1/1/2 | no | 201 | todo | - | - | |
| 9 | vanish | 2 | - | no | 221 | todo | - | - | |
| 9 | stagger | 4 | - | no | 207 | todo | - | - | |
| 9 | ko | 1 | - | no | 64 | todo | - | - | |
| 9 | intro | 4 | - | no | 210 | todo | - | - | |
| 9 | taunt | 2 | - | no | 212 | todo | - | - | |
| 9 | specialForward | 7 | 2/2/3 | no | 204 | todo | - | - | kit (ADR 0009/0011): Rasenshuriken held in the hand; palm EMPTY |
| 9 | specialUp | 6 | 2/2/2 | no | 214 | todo | - | - | kit: Uzumaki Barrage rise; f5 = airHeavy f0 |
| 9 | specialDown | 4 | 2/1/1 | no | 204 | todo | - | - | kit: Nine-Tails cloak activation; red slit eyes in this strip only; no hit box |
| 9 | superPose | 4 | - | no | 208 | todo | - | - | kit: Shadow Clone seal for the Shadow Clone Barrage super flash |
| 11 | ui/portrait.png (96x96) | - | - | no | - | todo | - | - | candidates raw/ui_portrait_vNN.png |
| 11 | ui/cutin.png (480x128) | - | - | no | - | todo | - | - | candidates raw/ui_cutin_vNN.png |
| 11 | ui/select.png (384x384) | - | - | no | - | todo | - | - | candidates raw/ui_select_vNN.png |

## sasuke

Brief: [characters/sasuke/](characters/sasuke/). Shippuden (Hebi-era) design, ~6.5 heads, sword
sheathed at the back of the belt.

Body scale: same as Naruto and the same `bodyHeight` table (spec v1's "minus 6 px" offsets are
gone). After both idles are packed, compare his head size (about 31 px) with Naruto's `idle` in the
Sprite Lab; if his hair adds clearly less height and his head comes out bigger, lower his upright
`bodyHeight` overrides in `manifest.json` and note it here.

| step | asset | frames | phases | core | body px | status | version | approved | notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 | reference/model_sheet_vNN.png -> model_sheet.png | - | - | yes | - | approved | v01 | v01 | User approved v01 on 2026-10-09; documented QA: V too deep, estimated 7.3 heads, sword projection drift, 36/34 swatches, near-magenta background; see REVIEW.md |
| 2 | reference/expressions_vNN.png -> expressions.png | - | - | yes | - | approved | v01 | v01 | User approved v01 on 2026-10-09; recorded QA: 8 readable expressions, approved identity; Sharingan marks stylized; raw head scale and magenta differ from prompt; see REVIEW.md |
| 3 | idle | 8 | - | **yes** | 204 | approved | v01 | v01 | User approved 2026-10-09; 6 px breathing bob accepted; fixed idle_approved.png saved unchanged; 48-color pack, game/Sprite Lab checked |
| 4 | run | 8 | - | **yes** | 204 | approved | v02 | v02 | User approved 2026-10-09; 48 colors, zero final warnings, corrected placement and flight lift. Naruto hair update is a separate reference revision. |
| 5 | light1 | 7 | 2/2/3 | **yes** | 204 | todo | - | - | |
| 5 | light2 | 7 | 2/2/3 | **yes** | 204 | todo | - | - | |
| 5 | light3 | 7 | 2/2/3 | **yes** | 215 | todo | - | - | |
| 5 | light4 | 8 | 3/2/3 | **yes** | 207 | todo | - | - | |
| 5 | heavy | 8 | 3/2/3 | **yes** | 218 | todo | - | - | |
| 5 | airLight1 | 5 | 1/2/2 | **yes** | 198 | todo | - | - | |
| 5 | airHeavy | 6 | 2/2/2 | **yes** | 198 | todo | - | - | |
| 6 | guard | 2 | - | **yes** | 198 | todo | - | - | |
| 6 | hurtHigh | 3 | - | **yes** | 195 | todo | - | - | |
| 6 | launched | 2 | - | **yes** | 136 | todo | - | - | |
| 6 | down | 2 | - | **yes** | 96 | todo | - | - | |
| 6 | getup | 5 | - | **yes** | 204 | todo | - | - | |
| 7 | charge | 4 | - | **yes** | 198 | todo | - | - | |
| 7 | beamCharge | 3 | - | **yes** | 198 | todo | - | - | |
| 7 | beamFire | 3 | - | **yes** | 198 | todo | - | - | |
| 7 | special | 8 | 3/3/2 | **yes** | 204 | todo | - | - | |
| 8 | dash | 2 | - | **yes** | 160 | todo | - | - | |
| 8 | jumpUp | 2 | - | **yes** | 198 | todo | - | - | |
| 8 | jumpFall | 2 | - | **yes** | 209 | todo | - | - | |
| 8 | land | 2 | - | **yes** | 174 | todo | - | - | |
| 8 | win | 4 | - | **yes** | 212 | todo | - | - | |
| 9 | backDash | 3 | - | no | 207 | todo | - | - | |
| 9 | superDash | 2 | - | no | 120 | todo | - | - | |
| 9 | jumpSquat | 1 | - | no | 162 | todo | - | - | |
| 9 | airLight2 | 5 | 1/2/2 | no | 207 | todo | - | - | |
| 9 | airLight3 | 6 | 2/2/2 | no | 201 | todo | - | - | |
| 9 | block | 2 | - | no | 204 | todo | - | - | |
| 9 | hurtLow | 3 | - | no | 183 | todo | - | - | |
| 9 | spin | 4 | - | no | 160 | todo | - | - | |
| 9 | airRecover | 3 | - | no | 180 | todo | - | - | |
| 9 | throw | 4 | 1/1/2 | no | 201 | todo | - | - | |
| 9 | vanish | 2 | - | no | 221 | todo | - | - | |
| 9 | stagger | 4 | - | no | 207 | todo | - | - | |
| 9 | ko | 1 | - | no | 64 | todo | - | - | |
| 9 | intro | 4 | - | no | 210 | todo | - | - | |
| 9 | taunt | 2 | - | no | 212 | todo | - | - | |
| 11 | ui/portrait.png (96x96) | - | - | no | - | todo | - | - | candidates raw/ui_portrait_vNN.png |
| 11 | ui/cutin.png (480x128) | - | - | no | - | todo | - | - | candidates raw/ui_cutin_vNN.png |
| 11 | ui/select.png (384x384) | - | - | no | - | todo | - | - | candidates raw/ui_select_vNN.png |

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
| 1 | reference/model_sheet_vNN.png -> model_sheet.png | - | - | yes | - | todo | - | - | true side profile + claw-hand close-ups |
| 2 | reference/expressions_vNN.png -> expressions.png | - | - | yes | - | todo | - | - | |
| 3 | idle | 8 | - | **yes** | 186 | todo | - | - |  |
| 4 | run | 8 | - | **yes** | 186 | todo | - | - |  |
| 5 | light1 | 7 | 2/2/3 | **yes** | 186 | todo | - | - |  |
| 5 | light2 | 7 | 2/2/3 | **yes** | 186 | todo | - | - |  |
| 5 | light3 | 7 | 2/2/3 | **yes** | 196 | todo | - | - |  |
| 5 | light4 | 8 | 3/2/3 | **yes** | 188 | todo | - | - |  |
| 5 | heavy | 8 | 3/2/3 | **yes** | 206 | todo | - | - |  |
| 5 | airLight1 | 5 | 1/2/2 | **yes** | 180 | todo | - | - |  |
| 5 | airHeavy | 6 | 2/2/2 | **yes** | 180 | todo | - | - |  |
| 6 | guard | 2 | - | **yes** | 180 | todo | - | - |  |
| 6 | hurtHigh | 3 | - | **yes** | 177 | todo | - | - |  |
| 6 | launched | 2 | - | **yes** | 124 | todo | - | - |  |
| 6 | down | 2 | - | **yes** | 87 | todo | - | - |  |
| 6 | getup | 5 | - | **yes** | 186 | todo | - | - |  |
| 7 | charge | 4 | - | **yes** | 180 | todo | - | - |  |
| 7 | beamCharge | 3 | - | **yes** | 180 | todo | - | - |  |
| 7 | beamFire | 3 | - | **yes** | 180 | todo | - | - |  |
| 7 | special | 8 | 3/3/2 | **yes** | 186 | todo | - | - |  |
| 8 | dash | 2 | - | **yes** | 146 | todo | - | - |  |
| 8 | jumpUp | 2 | - | **yes** | 180 | todo | - | - |  |
| 8 | jumpFall | 2 | - | **yes** | 190 | todo | - | - |  |
| 8 | land | 2 | - | **yes** | 158 | todo | - | - |  |
| 8 | win | 4 | - | **yes** | 193 | todo | - | - |  |
| 9 | backDash | 3 | - | no | 188 | todo | - | - |  |
| 9 | superDash | 2 | - | no | 109 | todo | - | - |  |
| 9 | jumpSquat | 1 | - | no | 147 | todo | - | - |  |
| 9 | airLight2 | 5 | 1/2/2 | no | 188 | todo | - | - |  |
| 9 | airLight3 | 6 | 2/2/2 | no | 183 | todo | - | - |  |
| 9 | block | 2 | - | no | 186 | todo | - | - |  |
| 9 | hurtLow | 3 | - | no | 167 | todo | - | - |  |
| 9 | spin | 4 | - | no | 146 | todo | - | - |  |
| 9 | airRecover | 3 | - | no | 164 | todo | - | - |  |
| 9 | throw | 4 | 1/1/2 | no | 183 | todo | - | - |  |
| 9 | vanish | 2 | - | no | 201 | todo | - | - |  |
| 9 | stagger | 4 | - | no | 188 | todo | - | - |  |
| 9 | ko | 1 | - | no | 58 | todo | - | - |  |
| 9 | intro | 4 | - | no | 191 | todo | - | - |  |
| 9 | taunt | 2 | - | no | 193 | todo | - | - |  |
| 9 | specialForward | 7 | 2/2/3 | no | 186 | todo | - | - | kit animation (ADR 0009) |
| 9 | specialUp | 6 | 2/2/2 | no | 198 | todo | - | - | kit animation (ADR 0009) |
| 9 | specialDown | 4 | 2/1/1 | no | 188 | todo | - | - | kit animation (ADR 0009) |
| 9 | superPose | 4 | - | no | 191 | todo | - | - | kit animation (ADR 0009) |
| 11 | ui/portrait.png (96x96) | - | - | no | - | todo | - | - | candidates raw/ui_portrait_vNN.png |
| 11 | ui/cutin.png (480x128) | - | - | no | - | todo | - | - | candidates raw/ui_cutin_vNN.png |
| 11 | ui/select.png (384x384) | - | - | no | - | todo | - | - | candidates raw/ui_select_vNN.png |

## gojo

Brief: [characters/gojo/](characters/gojo/). Jujutsu Kaisen: black blindfold in every sprite (the Six
Eyes show only in `superPose`, the cut-in and expression 8), dark navy high-collar uniform, spiky
white hair swept up. User-selected model v03 overrides the numeric head ratio: compact head, slim torso and long legs.

Body scale: **taller than the cast** (standing body 215 px, `standingBodyPx: 215`,
[ADR 0010](../docs/decisions/0010-per-character-body-scale.md)): every `bodyHeight` is the shared
value x ~1.09, capped at the 236 px cell ceiling. Kit animations (ADR 0009): `special` = Lapse:
Blue, `specialForward` = Reversal: Red, `specialUp` = Blink (not shown by the engine yet, ENG-032),
`specialDown` = Infinity, `superPose` = Domain Expansion hand sign. 42 animations = 175 frames = an
11-row sheet.

| step | asset | frames | phases | core | body px | status | version | approved | notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 | reference/model_sheet_vNN.png -> model_sheet.png | - | - | yes | - | approved | v03 | v03 | User approved complete batch 2026-10-09; see production/QA.md. |
| 2 | reference/expressions_vNN.png -> expressions.png | - | - | yes | - | approved | v02 | v02 | User approved complete batch 2026-10-09; see production/QA.md. |
| 3 | idle | 8 | - | **yes** | 222 | approved | v02 | v02 | User approved complete batch 2026-10-09; see production/QA.md. |
| 4 | run | 8 | - | **yes** | 222 | approved | v03 | v03 | User approved complete batch 2026-10-09; see production/QA.md. |
| 5 | light1 | 7 | 2/2/3 | **yes** | 222 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 5 | light2 | 7 | 2/2/3 | **yes** | 222 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 5 | light3 | 7 | 2/2/3 | **yes** | 228 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 5 | light4 | 8 | 3/2/3 | **yes** | 225 | approved | v02 | v02 | User approved complete batch 2026-10-09; see production/QA.md. |
| 5 | heavy | 8 | 3/2/3 | **yes** | 228 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 5 | airLight1 | 5 | 1/2/2 | **yes** | 215 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 5 | airHeavy | 6 | 2/2/2 | **yes** | 215 | approved | v02 | v02 | User approved complete batch 2026-10-09; see production/QA.md. |
| 6 | guard | 2 | - | **yes** | 215 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 6 | hurtHigh | 3 | - | **yes** | 212 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 6 | launched | 2 | - | **yes** | 148 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 6 | down | 2 | - | **yes** | 104 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 6 | getup | 5 | - | **yes** | 222 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 7 | charge | 4 | - | **yes** | 215 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 7 | beamCharge | 3 | - | **yes** | 215 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 7 | beamFire | 3 | - | **yes** | 215 | approved | v02 | v02 | User approved complete batch 2026-10-09; see production/QA.md. |
| 7 | special | 8 | 3/3/2 | **yes** | 222 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 8 | dash | 2 | - | **yes** | 174 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 8 | jumpUp | 2 | - | **yes** | 215 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 8 | jumpFall | 2 | - | **yes** | 227 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 8 | land | 2 | - | **yes** | 189 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 8 | win | 4 | - | **yes** | 230 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | backDash | 3 | - | no | 225 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | superDash | 2 | - | no | 140 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | jumpSquat | 1 | - | no | 176 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | airLight2 | 5 | 1/2/2 | no | 225 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | airLight3 | 6 | 2/2/2 | no | 219 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | block | 2 | - | no | 222 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | hurtLow | 3 | - | no | 199 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | spin | 4 | - | no | 174 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | airRecover | 3 | - | no | 196 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | throw | 4 | 1/1/2 | no | 219 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | vanish | 2 | - | no | 232 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | stagger | 4 | - | no | 225 | approved | v01 | v01 | User approved complete batch 2026-10-09; see production/QA.md. |
| 9 | ko | 1 | - | no | 70 | approved | v02 | v02 | User approved complete batch 2026-10-09; see production/QA.md. |
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
| spark | 5 | 30 | white (tinted) | center | packed | v01 | - | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. |
| burst | 5 | 35 | white (tinted) | center | packed | v01 | - | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. |
| ring | 6 | 35 | white (tinted) | center | packed | v02 | - | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. |
| dust | 6 | 60 | full color | bottom | packed | v01 | - | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. |
| smoke | 7 | 55 | full color | center | packed | v01 | - | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. |
| shuriken | 4 | 40 | full color | center | packed | v01 | - | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. |
| fire | 4 | 60 | full color | center | packed | v01 | - | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. |
| flame | 7 | 55 | white (tinted) | bottom | packed | v01 | - | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. |
| lightning | 6 | 40 | white (tinted) | center | packed | v01 | - | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. |
| orb | 6 | 40 | full color | center | packed | v01 | - | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. |
| glow | 2 | 60 | white (tinted) | center | packed | v01 | - | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. |
| streak | 6 | 45 | white (tinted) | bottom | packed | v02 | - | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. |
| star | 5 | 40 | white (tinted) | center | packed | v01 | - | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. |
| crater | 3 | 1000 (static; 3 random variants) | full color | decal | packed | v01 | - | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. |
| lines | 4 | 40 | white (tinted) | center | packed | v01 | - | Canonical palette/76-frame atlas QA passed; see final packet for deviations and integration. |

## Shared UI (step 11)

Brief: [ui/README.md](ui/README.md). Candidates `art/ui/raw/<asset>_vNN.png`; the approved one is
cleaned into `art/ui/final/`.

| asset | size | status | version | approved | notes |
|---|---|---|---|---|---|
| ui/final/logo.png ("GCD TOURNEY" + 天下一武闘祭) | ~480x180 | raw | v01 | - | Fitted candidate in ui/review; final approval and engine hooks pending. |
| ui/final/title_art.png (title key art) | 640x360 | raw | v01 | - | Fitted candidate in ui/review; final approval and engine hooks pending. |

## World art (ADR 0008)

World batches are reviewed together in [REVIEW.md](REVIEW.md); the claim queue tracks production in [queue/STATUS.md](queue/STATUS.md). `raw` means the review candidate exists, while `packed` awaits the corresponding world packer mode.

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

| crowd | crowd-dragon-ball-03 | 10 | raw | v01/v03 | - | [Files/QA](queue/reviews/crowd-dragon-ball-03.md); final review pending |
| crowd | crowd-dragon-ball-04 | 10 | raw | v01/v02 | - | [Files/QA](queue/reviews/crowd-dragon-ball-04.md); final review pending |
| crowd | crowd-elders-01 | 10 | raw | v01/v02 | - | [Files/QA](queue/reviews/crowd-elders-01.md); final review pending |
| crowd | crowd-elders-02 | 5 | raw | v01 | - | [Files/QA](queue/reviews/crowd-elders-02.md); final review pending |
| crowd | crowd-evangelion-01 | 6 | raw | v01 | - | [Files/QA](queue/reviews/crowd-evangelion-01.md); final review pending |
| crowd | crowd-families-kids-01 | 10 | raw | v01/v02 | - | [Files/QA](queue/reviews/crowd-families-kids-01.md); final review pending |
| crowd | crowd-families-kids-02 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-families-kids-02.md); final review pending |
| crowd | crowd-farmers-villagers-01 | 10 | raw | v02/v01 | - | [Files/QA](queue/reviews/crowd-farmers-villagers-01.md); final review pending |
| crowd | crowd-farmers-villagers-02 | 3 | raw | v01 | - | [Files/QA](queue/reviews/crowd-farmers-villagers-02.md); final review pending |
| crowd | crowd-fist-of-the-north-star-01 | 8 | raw | v01/v02 | - | [Files/QA](queue/reviews/crowd-fist-of-the-north-star-01.md); final review pending |
| crowd | crowd-fullmetal-alchemist-01 | 10 | raw | v01/v02 | - | [Files/QA](queue/reviews/crowd-fullmetal-alchemist-01.md); final review pending |
| crowd | crowd-gintama-01 | 8 | raw | v01 | - | [Files/QA](queue/reviews/crowd-gintama-01.md); final review pending |
| crowd | crowd-hajime-no-ippo-01 | 8 | raw | v01 | - | [Files/QA](queue/reviews/crowd-hajime-no-ippo-01.md); final review pending |
| crowd | crowd-hunter-x-hunter-01 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-hunter-x-hunter-01.md); final review pending |
| crowd | crowd-hunter-x-hunter-02 | 5 | raw | v01 | - | [Files/QA](queue/reviews/crowd-hunter-x-hunter-02.md); final review pending |
| crowd | crowd-idol-fans-01 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-idol-fans-01.md); final review pending |
| crowd | crowd-idol-fans-02 | 3 | raw | v01 | - | [Files/QA](queue/reviews/crowd-idol-fans-02.md); final review pending |
| crowd | crowd-jojo-01 | 10 | raw | v01/v02 | - | [Files/QA](queue/reviews/crowd-jojo-01.md); final review pending |
| crowd | crowd-jojo-02 | 5 | raw | v01 | - | [Files/QA](queue/reviews/crowd-jojo-02.md); final review pending |
| crowd | crowd-jujutsu-kaisen-01 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-jujutsu-kaisen-01.md); final review pending |
| crowd | crowd-jujutsu-kaisen-02 | 5 | raw | v01 | - | [Files/QA](queue/reviews/crowd-jujutsu-kaisen-02.md); final review pending |
| crowd | crowd-kengan-ashura-01 | 6 | raw | v01 | - | [Files/QA](queue/reviews/crowd-kengan-ashura-01.md); final review pending |
| crowd | crowd-kenichi-01 | 6 | raw | v01 | - | [Files/QA](queue/reviews/crowd-kenichi-01.md); final review pending |
| crowd | crowd-martial-artists-01 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-martial-artists-01.md); final review pending |
| crowd | crowd-martial-artists-02 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-martial-artists-02.md); final review pending |
| crowd | crowd-mob-psycho-100-01 | 8 | raw | v01 | - | [Files/QA](queue/reviews/crowd-mob-psycho-100-01.md); final review pending |
| crowd | crowd-monks-priests-01 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-monks-priests-01.md); final review pending |
| crowd | crowd-my-hero-academia-01 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-my-hero-academia-01.md); final review pending |
| crowd | crowd-my-hero-academia-02 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-my-hero-academia-02.md); final review pending |
| crowd | crowd-naruto-01 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-naruto-01.md); final review pending |
| crowd | crowd-naruto-02 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-naruto-02.md); final review pending |
| crowd | crowd-naruto-03 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-naruto-03.md); final review pending |
| crowd | crowd-ninja-samurai-cosplayers-01 | 10 | raw | v01/v02 | - | [Files/QA](queue/reviews/crowd-ninja-samurai-cosplayers-01.md); final review pending |
| crowd | crowd-ninja-samurai-cosplayers-02 | 3 | raw | v01 | - | [Files/QA](queue/reviews/crowd-ninja-samurai-cosplayers-02.md); final review pending |
| crowd | crowd-one-piece-01 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-one-piece-01.md); final review pending |
| crowd | crowd-one-piece-02 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-one-piece-02.md); final review pending |
| crowd | crowd-one-piece-03 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-one-piece-03.md); final review pending |
| crowd | crowd-one-punch-man-01 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-one-punch-man-01.md); final review pending |
| crowd | crowd-one-punch-man-02 | 2 | raw | v01 | - | [Files/QA](queue/reviews/crowd-one-punch-man-02.md); final review pending |
| crowd | crowd-punks-delinquents-01 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-punks-delinquents-01.md); final review pending |
| crowd | crowd-punks-delinquents-02 | 5 | raw | v01 | - | [Files/QA](queue/reviews/crowd-punks-delinquents-02.md); final review pending |
| crowd | crowd-ranma-01 | 8 | raw | v01 | - | [Files/QA](queue/reviews/crowd-ranma-01.md); final review pending |
| crowd | crowd-rich-patrons-01 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-rich-patrons-01.md); final review pending |
| crowd | crowd-rich-patrons-02 | 4 | raw | v01 | - | [Files/QA](queue/reviews/crowd-rich-patrons-02.md); final review pending |
| crowd | crowd-robots-aliens-01 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-robots-aliens-01.md); final review pending |
| crowd | crowd-sailor-moon-01 | 10 | raw | v01/v02 | - | [Files/QA](queue/reviews/crowd-sailor-moon-01.md); final review pending |
| crowd | crowd-saint-seiya-01 | 8 | raw | v01 | - | [Files/QA](queue/reviews/crowd-saint-seiya-01.md); final review pending |
| crowd | crowd-slam-dunk-01 | 6 | raw | v01 | - | [Files/QA](queue/reviews/crowd-slam-dunk-01.md); final review pending |
| crowd | crowd-spy-x-family-01 | 6 | raw | v01 | - | [Files/QA](queue/reviews/crowd-spy-x-family-01.md); final review pending |
| crowd | crowd-students-01 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-students-01.md); final review pending |
| crowd | crowd-students-02 | 5 | raw | v01 | - | [Files/QA](queue/reviews/crowd-students-02.md); final review pending |
| crowd | crowd-travelers-tourists-01 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-travelers-tourists-01.md); final review pending |
| crowd | crowd-travelers-tourists-02 | 5 | raw | v02/v01 | - | [Files/QA](queue/reviews/crowd-travelers-tourists-02.md); final review pending |
| crowd | crowd-vendors-workers-01 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-vendors-workers-01.md); final review pending |
| crowd | crowd-vendors-workers-02 | 5 | raw | v01 | - | [Files/QA](queue/reviews/crowd-vendors-workers-02.md); final review pending |
| crowd | crowd-yu-yu-hakusho-01 | 10 | raw | v01 | - | [Files/QA](queue/reviews/crowd-yu-yu-hakusho-01.md); final review pending |
| crowd | crowd-yu-yu-hakusho-02 | 2 | raw | v01 | - | [Files/QA](queue/reviews/crowd-yu-yu-hakusho-02.md); final review pending |
| stage | stage-ringTop | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-ringTop.md); final review pending |
| stage | stage-ringSide | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-ringSide.md); final review pending |
| stage | stage-grass | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-grass.md); final review pending |
| stage | stage-steps | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-steps.md); final review pending |
| stage | stage-stoneBase | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-stoneBase.md); final review pending |
| stage | stage-brick | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-brick.md); final review pending |
| stage | stage-path | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-path.md); final review pending |
| stage | stage-templeFacade | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-templeFacade.md); final review pending |
| stage | stage-roof | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-roof.md); final review pending |
| stage | stage-bannerBu | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-bannerBu.md); final review pending |
| stage | stage-bannerDo | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-bannerDo.md); final review pending |
| stage | stage-bannerSai | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-bannerSai.md); final review pending |
| stage | stage-bannerTo | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-bannerTo.md); final review pending |
| stage | stage-plaster | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-plaster.md); final review pending |
| stage | stage-sky | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-sky.md); final review pending |
| stage | stage-cloudA | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-cloudA.md); final review pending |
| stage | stage-cloudB | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-cloudB.md); final review pending |
| stage | stage-cloudC | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-cloudC.md); final review pending |
| stage | stage-gong | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-gong.md); final review pending |
| stage | stage-parasol | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-parasol.md); final review pending |
| stage | stage-woodDark | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-woodDark.md); final review pending |
| stage | stage-treeRoundA | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-treeRoundA.md); final review pending |
| stage | stage-treeRoundB | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-treeRoundB.md); final review pending |
| stage | stage-treePine | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-treePine.md); final review pending |
| stage | stage-treePalm | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-treePalm.md); final review pending |
| stage | stage-sign | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-sign.md); final review pending |
| stage | stage-lanternBu | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-lanternBu.md); final review pending |
| stage | stage-lanternSai | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-lanternSai.md); final review pending |
| stage | stage-woodPillar | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-woodPillar.md); final review pending |
| stage | stage-wood | 1 | raw | v01 | - | [Files/QA](queue/reviews/stage-wood.md); final review pending |
| npc | npc-announcer | 5 | raw | v01 | - | [Files/QA](queue/reviews/npc-announcer.md); final review pending |
| npc | npc-monk-a | 3 | raw | v02 | - | [Files/QA](queue/reviews/npc-monk-a.md); final review pending |
| npc | npc-monk-b | 3 | raw | v01 | - | [Files/QA](queue/reviews/npc-monk-b.md); final review pending |
| npc | npc-vendor | 2 | raw | v02 | - | [Files/QA](queue/reviews/npc-vendor.md); final review pending |
| ui | ui-logo | 1 | raw | v01 | - | [Files/QA](queue/reviews/ui-logo.md); final review pending |
| ui | ui-title_art | 1 | raw | v01 | - | [Files/QA](queue/reviews/ui-title_art.md); final review pending |
| vfx | vfx-spark | 1 | packed | v01 | - | [Files/QA](queue/reviews/vfx-spark.md); final review pending |
| vfx | vfx-burst | 1 | packed | v01 | - | [Files/QA](queue/reviews/vfx-burst.md); final review pending |
| vfx | vfx-ring | 1 | packed | v02 | - | [Files/QA](queue/reviews/vfx-ring.md); final review pending |
| vfx | vfx-dust | 1 | packed | v01 | - | [Files/QA](queue/reviews/vfx-dust.md); final review pending |
| vfx | vfx-smoke | 1 | packed | v01 | - | [Files/QA](queue/reviews/vfx-smoke.md); final review pending |
| vfx | vfx-shuriken | 1 | packed | v01 | - | [Files/QA](queue/reviews/vfx-shuriken.md); final review pending |
| vfx | vfx-fire | 1 | packed | v01 | - | [Files/QA](queue/reviews/vfx-fire.md); final review pending |
| vfx | vfx-flame | 1 | packed | v01 | - | [Files/QA](queue/reviews/vfx-flame.md); final review pending |
| vfx | vfx-lightning | 1 | packed | v01 | - | [Files/QA](queue/reviews/vfx-lightning.md); final review pending |
| vfx | vfx-orb | 1 | packed | v01 | - | [Files/QA](queue/reviews/vfx-orb.md); final review pending |
| vfx | vfx-glow | 1 | packed | v01 | - | [Files/QA](queue/reviews/vfx-glow.md); final review pending |
| vfx | vfx-streak | 1 | packed | v02 | - | [Files/QA](queue/reviews/vfx-streak.md); final review pending |
| vfx | vfx-star | 1 | packed | v01 | - | [Files/QA](queue/reviews/vfx-star.md); final review pending |
| vfx | vfx-crater | 1 | packed | v01 | - | [Files/QA](queue/reviews/vfx-crater.md); final review pending |
| vfx | vfx-lines | 1 | packed | v01 | - | [Files/QA](queue/reviews/vfx-lines.md); final review pending |
| crowd | crowd-farmers-villagers-01-r1 | 2 | raw | v02 | - | [Files/QA](queue/reviews/crowd-farmers-villagers-01-r1.md); final review pending |
| crowd | crowd-fist-of-the-north-star-01-r1 | 3 | raw | v02 | - | [Files/QA](queue/reviews/crowd-fist-of-the-north-star-01-r1.md); final review pending |
| crowd | crowd-dragon-ball-03-r1 | 1 | raw | v03 | - | [Files/QA](queue/reviews/crowd-dragon-ball-03-r1.md); final review pending |
| crowd | crowd-dragon-ball-04-r1 | 4 | raw | v02 | - | [Files/QA](queue/reviews/crowd-dragon-ball-04-r1.md); final review pending |
| crowd | crowd-elders-01-r1 | 1 | raw | v02 | - | [Files/QA](queue/reviews/crowd-elders-01-r1.md); final review pending |
| crowd | crowd-families-kids-01-r1 | 1 | raw | v02 | - | [Files/QA](queue/reviews/crowd-families-kids-01-r1.md); final review pending |
| npc | npc-monk-a-r1 | 3 | raw | v02 | - | [Files/QA](queue/reviews/npc-monk-a-r1.md); final review pending |
| npc | npc-vendor-r1 | 2 | raw | v02 | - | [Files/QA](queue/reviews/npc-vendor-r1.md); final review pending |
| vfx | vfx-ring-r1 | 1 | packed | v02 | - | [Files/QA](queue/reviews/vfx-ring-r1.md); final review pending |
| vfx | vfx-streak-r1 | 1 | packed | v02 | - | [Files/QA](queue/reviews/vfx-streak-r1.md); final review pending |
| crowd | crowd-dragon-ball-03-r2 | 1 | raw | v03 | - | [Files/QA](queue/reviews/crowd-dragon-ball-03-r2.md); final review pending |
| crowd | crowd-fullmetal-alchemist-01-r1 | 2 | raw | v02 | - | [Files/QA](queue/reviews/crowd-fullmetal-alchemist-01-r1.md); final review pending |
| crowd | crowd-jojo-01-r1 | 1 | raw | v02 | - | [Files/QA](queue/reviews/crowd-jojo-01-r1.md); final review pending |
| crowd | crowd-ninja-samurai-cosplayers-01-r1 | 1 | raw | v02 | - | [Files/QA](queue/reviews/crowd-ninja-samurai-cosplayers-01-r1.md); final review pending |
| crowd | crowd-sailor-moon-01-r1 | 1 | raw | v02 | - | [Files/QA](queue/reviews/crowd-sailor-moon-01-r1.md); final review pending |
| crowd | crowd-travelers-tourists-02-r1 | 1 | raw | v02 | - | [Files/QA](queue/reviews/crowd-travelers-tourists-02-r1.md); final review pending |

## Adding a character

Copy the naruto section, rename it, and add the same block to `manifest.json`
(`characters.<id>`, copied from `animationDefaults`, every asset with `version: 0` and
`approvedVersion: null`). See [PIPELINE.md](PIPELINE.md#adding-a-new-character). The four kit animations
(`specialForward`, `specialUp`, `specialDown`, `superPose`, step 9) are only needed when the
fighter's kit uses them ([ADR 0009](../docs/decisions/0009-move-system-v2.md)); Naruto and Sasuke
don't, so their sections leave them out. A fighter whose body is genuinely taller or shorter sets
`standingBodyPx` and scaled `bodyHeight`s ([ADR 0010](../docs/decisions/0010-per-character-body-scale.md)).
