# ART-SIZE-R8 B11 — Goku bair redraw and R3 replacement

User decision (Claude relay audit2 #2) moved Goku bair out of resize/repair R3 and into redraw B11. Target `bair` v02 at the approved idle scale with all six back-kick frames intact, the rear kick wholly inside its cell, and no change to bodyHeight or packScale. This redraw also replaces R3 by removing f0's dark chin blob and pale waist patch and f2's skin patch on the gi.

## Generation call

| Call | Returned image path | SHA-256 | Filed path | Selection |
|---:|---|---|---|---|
| 1 | `E:/Vibe Coding/.codex/generated_images/01a1bdc7-7f63-74b0-aa73-a9f06981795a/exec-99379ffc-22b6-4633-9f20-ae26243f450c.png` | `EB0B2CF2B0254A27F730ED0FA24CEDB4B04B75D80662DB1C7886FD4D6FD13530` | `raw/bair_v02.png` | Selected for user review: all six frames and the f2/f3 leftward kick remain; requested color defects are corrected. Frame 3 needed only a measured x offset to clear the cell border. |

## Packed evidence and limits

The 48-color comparison board is [bair-v02-compare.png](../../../../../public/reviews/size-r8-audit2-goku-b8-b11/bair-v02-compare.png), SHA-256 `861637CF8C932032312A90422735EA6F85424C96A9BAA5F56F3081AA06BCFFA7`. It shows approved idle f0, title-style neutral/combat, prior packed bair v01 and each v02 frame at one 256x256 density.

The automatic Goku head probe is disabled by TOOL-GOKU-PROBE. The version-specific manual comparison judged the head, torso and visible limb/build landmarks coherent with the approved references within about 6-8 px uncertainty for airborne rotation. Frame 3's versioned `frameOffsets` [14,0] at strip scale 1 place the full kick inside the cell (actual +13 px at fighter packScale 0.92); no scale change is applied. The manifest carries the manual scale record and keeps final Astra anatomy review and runtime contact separate. User drawing approval is pending.

R3 is satisfied by the B11 redraw; no separate pixel-repair version is generated.
