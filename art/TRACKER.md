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

| character | reference (2) | core anims (23) | optional anims (15) | UI (3) | sheet complete |
|---|---|---|---|---|---|
| naruto | 2/2 approved | 0/23 | 0/15 | 0/3 | no |
| sasuke | 2/2 approved | 0/23 | 0/15 | 0/3 | no |
| VFX atlas | 0/1 (style sheet, optional) | 0/15 effects | - | - | procedural fallback |
| shared UI | - | - | - | 0/2 | - |

Naruto and Sasuke can be produced in parallel (separate Codex threads); each thread updates only
its own section below.

## naruto

Brief: [characters/naruto/](characters/naruto/). Shippuden design, ~6.5 heads.

| step | asset | frames | phases | core | body px | status | version | approved | notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 | reference/model_sheet_vNN.png -> model_sheet.png | - | - | yes | - | approved | v01 | v01 | User approved v01 on 2026-10-09; documented QA: estimated 6.8 heads and true profile; side locks too straight, 36/34 swatches, near-magenta background. V1 remains archived/rejected; see REVIEW.md |
| 2 | reference/expressions_vNN.png -> expressions.png | - | - | yes | - | approved | v01 | v01 | User approved v01 on 2026-10-09; recorded QA: 9 readable expressions; far-cheek third whisker obscured; 1254-square raw and oversized heads, near-magenta; see REVIEW.md |
| 3 | idle | 8 | - | **yes** | 204 | todo | - | - | approved strip is copied to reference/idle_approved.png |
| 4 | run | 8 | - | **yes** | 204 | todo | - | - | |
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
| 3 | idle | 8 | - | **yes** | 204 | todo | - | - | approved strip is copied to reference/idle_approved.png |
| 4 | run | 8 | - | **yes** | 204 | todo | - | - | |
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

## VFX atlas (step 10)

Brief: [vfx/EFFECTS.md](vfx/EFFECTS.md). Candidates `art/vfx/raw/<effect>_vNN.png` (the packer uses
the highest version). VFX cells stay 128 x 128 (ppu 56). Missing effects fall back to the procedural
ones.

| effect | frames | ms | color rule | anchor | status | version | approved | notes |
|---|---|---|---|---|---|---|---|---|
| reference/vfx_style_sheet_vNN.png -> vfx_style_sheet.png (optional style anchor) | - | - | - | - | todo | - | - | attach the approved copy to every VFX prompt |
| spark | 5 | 30 | white (tinted) | center | todo | - | - |  |
| burst | 5 | 35 | white (tinted) | center | todo | - | - |  |
| ring | 6 | 35 | white (tinted) | center | todo | - | - |  |
| dust | 6 | 60 | full color | bottom | todo | - | - |  |
| smoke | 7 | 55 | full color | center | todo | - | - |  |
| shuriken | 4 | 40 | full color | center | todo | - | - |  |
| fire | 4 | 60 | full color | center | todo | - | - |  |
| flame | 7 | 55 | white (tinted) | bottom | todo | - | - |  |
| lightning | 6 | 40 | white (tinted) | center | todo | - | - |  |
| orb | 6 | 40 | full color | center | todo | - | - |  |
| glow | 2 | 60 | white (tinted) | center | todo | - | - |  |
| streak | 6 | 45 | white (tinted) | bottom | todo | - | - |  |
| star | 5 | 40 | white (tinted) | center | todo | - | - |  |
| crater | 3 | 1000 (static; 3 random variants) | full color | decal | todo | - | - |  |
| lines | 4 | 40 | white (tinted) | center | todo | - | - |  |

## Shared UI (step 11)

Brief: [ui/README.md](ui/README.md). Candidates `art/ui/raw/<asset>_vNN.png`; the approved one is
cleaned into `art/ui/final/`.

| asset | size | status | version | approved | notes |
|---|---|---|---|---|---|
| ui/final/logo.png ("GCD TOURNEY" + 天下一武闘祭) | ~480x180 | todo | - | - | not wired into the game yet (needs a task for Claude) |
| ui/final/title_art.png (title key art) | 640x360 | todo | - | - | not wired into the game yet; attaches both approved v2 model sheets |

## World art (ADR 0008)

World batches are reviewed together in [REVIEW.md](REVIEW.md); the claim queue tracks production in [queue/STATUS.md](queue/STATUS.md). `raw` means the review candidate exists, while `packed` awaits the corresponding world packer mode.

| area | batch | items | status | current versions | approved | notes |
|---|---|---|---|---|---|---|
| crowd | crowd-animal-folk-01 | org-af-001..010 | approved | v01 | v01 | User approved batch on 2026-10-09; visual QA passed with minor pose details noted in REVIEW.md. Near-magenta/noisy palette and packed QA pending TOOL-011. |
| crowd | crowd-animal-folk-02 | org-af-011..020 | approved | v01 except 013, 015, 019 v02 | same as current | User approved pilot on 2026-10-09; raw backgrounds are near-magenta; `npm run sprites crowd` unavailable (TOOL-011), so atlas and in-game QA are pending. |

## Adding a character

Copy the naruto section, rename it, and add the same block to `manifest.json`
(`characters.<id>`, copied from `animationDefaults`, every asset with `version: 0` and
`approvedVersion: null`). See [PIPELINE.md](PIPELINE.md#adding-a-new-character).
