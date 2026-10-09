# Art tracker

Human-readable status of every art asset. The machine-readable twin is
[manifest.json](manifest.json): **update both in the same commit** (Codex does this after every
pack). Spec: [SPEC.md](SPEC.md). Order of work: [PIPELINE.md](PIPELINE.md#generation-order).

## Status legend

| status | meaning | who sets it |
|---|---|---|
| `todo` | nothing generated yet | - |
| `raw` | raw ChatGPT image saved in `raw/` (or reference image saved), not packed yet | user / Codex |
| `packed` | `npm run sprites <id>` packed it with no errors; it previews correctly in the Sprite Lab / `?art=custom` | Codex / Claude |
| `approved` | the user played with it: it looks right, hits visibly connect, no glitches | user (Codex records it) |

A character's sheet is used by the game automatically once **every core animation** (marked
**yes**) is at least `packed` (the packer then writes `"complete": true`). Before that, preview
with `http://127.0.0.1:5188/?art=custom`. Use the notes column for problems ("F03 fist too
low", "regenerate: hair color drifted").

## Summary

| character | reference | core anims (23) | optional anims (15) | UI (3) | sheet complete |
|---|---|---|---|---|---|
| naruto | 0/2 | 0/23 | 0/15 | 0/3 | no |
| sasuke | 0/2 | 0/23 | 0/15 | 0/3 | no |
| VFX atlas | - | 0/15 effects | - | - | procedural fallback |
| shared UI | - | - | - | 0/2 | - |

## naruto

Brief: [characters/naruto/](characters/naruto/)

| step | asset | frames | phases | core | status | notes |
|---|---|---|---|---|---|---|
| 1 | reference/model_sheet.png | - | - | yes | todo | approved model sheet: turnaround (front, 3/4 right, side, back), fighting stance, palette swatches |
| 2 | reference/expressions.png | - | - | yes | todo | neutral, angry, shout, grin/smirk, hurt, eyes closed |
| 3 | idle | 8 | - | **yes** | todo |  |
| 4 | run | 8 | - | **yes** | todo |  |
| 5 | light1 | 7 | 2/2/3 | **yes** | todo |  |
| 5 | light2 | 7 | 2/2/3 | **yes** | todo |  |
| 5 | light3 | 7 | 2/2/3 | **yes** | todo |  |
| 5 | light4 | 8 | 3/2/3 | **yes** | todo |  |
| 5 | heavy | 8 | 3/2/3 | **yes** | todo |  |
| 5 | airLight1 | 5 | 1/2/2 | **yes** | todo |  |
| 5 | airHeavy | 6 | 2/2/2 | **yes** | todo |  |
| 6 | guard | 2 | - | **yes** | todo |  |
| 6 | hurtHigh | 3 | - | **yes** | todo |  |
| 6 | launched | 2 | - | **yes** | todo |  |
| 6 | down | 2 | - | **yes** | todo |  |
| 6 | getup | 5 | - | **yes** | todo |  |
| 7 | charge | 4 | - | **yes** | todo |  |
| 7 | beamCharge | 3 | - | **yes** | todo |  |
| 7 | beamFire | 3 | - | **yes** | todo |  |
| 7 | special | 8 | 3/3/2 | **yes** | todo |  |
| 8 | dash | 2 | - | **yes** | todo |  |
| 8 | jumpUp | 2 | - | **yes** | todo |  |
| 8 | jumpFall | 2 | - | **yes** | todo |  |
| 8 | land | 2 | - | **yes** | todo |  |
| 8 | win | 4 | - | **yes** | todo |  |
| 9 | backDash | 3 | - | no | todo |  |
| 9 | superDash | 2 | - | no | todo |  |
| 9 | jumpSquat | 1 | - | no | todo |  |
| 9 | airLight2 | 5 | 1/2/2 | no | todo |  |
| 9 | airLight3 | 6 | 2/2/2 | no | todo |  |
| 9 | block | 2 | - | no | todo |  |
| 9 | hurtLow | 3 | - | no | todo |  |
| 9 | spin | 4 | - | no | todo |  |
| 9 | airRecover | 3 | - | no | todo |  |
| 9 | throw | 4 | 1/1/2 | no | todo |  |
| 9 | vanish | 2 | - | no | todo |  |
| 9 | stagger | 4 | - | no | todo |  |
| 9 | ko | 1 | - | no | todo |  |
| 9 | intro | 4 | - | no | todo |  |
| 9 | taunt | 2 | - | no | todo |  |
| 11 | ui/portrait.png (96x96) | - | - | no | todo |  |
| 11 | ui/cutin.png (480x128) | - | - | no | todo |  |
| 11 | ui/select.png (384x384) | - | - | no | todo |  |

## sasuke

Brief: [characters/sasuke/](characters/sasuke/)

Body scale: same as Naruto. His swept-back hair adds about 6 px less height, so his upright
`bodyHeight` values in `manifest.json` are the defaults minus 6 (idle 129, heavy 138, ...); lying and
horizontal poses (`superDash`, `launched`, `spin`, `down`, `ko`) keep the defaults. After packing,
compare his head size with Naruto's `idle` in the Sprite Lab and note any correction here.

| step | asset | frames | phases | core | status | notes |
|---|---|---|---|---|---|---|
| 1 | reference/model_sheet.png | - | - | yes | todo | approved model sheet: turnaround (front, 3/4 right, side, back), fighting stance, palette swatches |
| 2 | reference/expressions.png | - | - | yes | todo | neutral, angry, shout, grin/smirk, hurt, eyes closed |
| 3 | idle | 8 | - | **yes** | todo |  |
| 4 | run | 8 | - | **yes** | todo |  |
| 5 | light1 | 7 | 2/2/3 | **yes** | todo |  |
| 5 | light2 | 7 | 2/2/3 | **yes** | todo |  |
| 5 | light3 | 7 | 2/2/3 | **yes** | todo |  |
| 5 | light4 | 8 | 3/2/3 | **yes** | todo |  |
| 5 | heavy | 8 | 3/2/3 | **yes** | todo |  |
| 5 | airLight1 | 5 | 1/2/2 | **yes** | todo |  |
| 5 | airHeavy | 6 | 2/2/2 | **yes** | todo |  |
| 6 | guard | 2 | - | **yes** | todo |  |
| 6 | hurtHigh | 3 | - | **yes** | todo |  |
| 6 | launched | 2 | - | **yes** | todo |  |
| 6 | down | 2 | - | **yes** | todo |  |
| 6 | getup | 5 | - | **yes** | todo |  |
| 7 | charge | 4 | - | **yes** | todo |  |
| 7 | beamCharge | 3 | - | **yes** | todo |  |
| 7 | beamFire | 3 | - | **yes** | todo |  |
| 7 | special | 8 | 3/3/2 | **yes** | todo |  |
| 8 | dash | 2 | - | **yes** | todo |  |
| 8 | jumpUp | 2 | - | **yes** | todo |  |
| 8 | jumpFall | 2 | - | **yes** | todo |  |
| 8 | land | 2 | - | **yes** | todo |  |
| 8 | win | 4 | - | **yes** | todo |  |
| 9 | backDash | 3 | - | no | todo |  |
| 9 | superDash | 2 | - | no | todo |  |
| 9 | jumpSquat | 1 | - | no | todo |  |
| 9 | airLight2 | 5 | 1/2/2 | no | todo |  |
| 9 | airLight3 | 6 | 2/2/2 | no | todo |  |
| 9 | block | 2 | - | no | todo |  |
| 9 | hurtLow | 3 | - | no | todo |  |
| 9 | spin | 4 | - | no | todo |  |
| 9 | airRecover | 3 | - | no | todo |  |
| 9 | throw | 4 | 1/1/2 | no | todo |  |
| 9 | vanish | 2 | - | no | todo |  |
| 9 | stagger | 4 | - | no | todo |  |
| 9 | ko | 1 | - | no | todo |  |
| 9 | intro | 4 | - | no | todo |  |
| 9 | taunt | 2 | - | no | todo |  |
| 11 | ui/portrait.png (96x96) | - | - | no | todo |  |
| 11 | ui/cutin.png (480x128) | - | - | no | todo |  |
| 11 | ui/select.png (384x384) | - | - | no | todo |  |

## VFX atlas (step 10)

Brief: [vfx/EFFECTS.md](vfx/EFFECTS.md). Missing effects fall back to the procedural ones.

| effect | frames | ms | color rule | anchor | status | notes |
|---|---|---|---|---|---|---|
| reference/vfx_style_sheet.png (optional style anchor) | - | - | - | - | todo | attach to every VFX prompt once approved |
| spark | 5 | 30 | white (tinted) | center | todo |  |
| burst | 5 | 35 | white (tinted) | center | todo |  |
| ring | 6 | 35 | white (tinted) | center | todo |  |
| dust | 6 | 60 | full color | bottom | todo |  |
| smoke | 7 | 55 | full color | center | todo |  |
| shuriken | 4 | 40 | full color | center | todo |  |
| fire | 4 | 60 | full color | center | todo |  |
| flame | 7 | 55 | white (tinted) | bottom | todo |  |
| lightning | 6 | 40 | white (tinted) | center | todo |  |
| orb | 6 | 40 | full color | center | todo |  |
| glow | 2 | 60 | white (tinted) | center | todo |  |
| streak | 6 | 45 | white (tinted) | bottom | todo |  |
| star | 5 | 40 | white (tinted) | center | todo |  |
| crater | 3 | 1000 (static; 3 random variants) | full color | decal | todo |  |
| lines | 4 | 40 | white (tinted) | center | todo |  |

## Shared UI (step 11)

Brief: [ui/README.md](ui/README.md)

| asset | size | status | notes |
|---|---|---|---|
| ui/final/logo.png ("GCD TOURNEY" + 天下一武闘祭) | ~480x180 | todo | not wired into the game yet (needs a task for Claude) |
| ui/final/title_art.png (title key art) | 640x360 | todo | not wired into the game yet |

## Adding a character

Copy the naruto section, rename it, and add the same block to `manifest.json`
(`characters.<id>`, copied from `animationDefaults`). See
[PIPELINE.md](PIPELINE.md#adding-a-new-character).
