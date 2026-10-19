# Naruto charge v08: Claude's landmark scale check (integration, 2026-10-18)

Why: the strict scale gate refuses v08 with "charge pops inside the strip: f5 0.98 vs f0 1.20 of the idle head". f0 is
the gather: head bowed, the hair and headband seen from above and the face hidden, a pose the head template probe
misreads. Astra's packed-cell audit (relay charge #9) found the anatomy qualitatively consistent but recorded no
numeric pass. This check measures parts a pose cannot stretch, in the branch's packed cells (charge = cells 115-120,
idle f0 = cell 0).

Method: connected blobs of Naruto's near-black (sandals, leg holster; `r < 75 && g < 75 && b < 85`) and light grey
(headband plate; `r, g, b > 150`, near neutral) per cell, bbox and area in cell px; crop `claude-gather-vs-hold-3x.png`.

| landmark | idle f0 | charge f0 (gather) | charge f2 (hold) | charge f5 (hold) |
|---|---|---|---|---|
| near sandal | 32 x 30, 461 px² | 32 x 27, 425 | 32 x 29, 437 | 32 x 29, 438 |
| far sandal | 25 x 30, 363 | 23 x 28, 308 | 22 x 31, 313 | 25 x 28, 320 |
| leg holster | 33 x 24, 302 | 31 x 24, 259 | 32 x 23, 288 | 31 x 27, 288 |
| headband plate | 11 x 6, 50 | 13 x 5, 43 | (turned, hair covers) | (turned) |

Every frame, the gather included, is at the idle's scale within the ±1-2 px reading uncertainty: the near sandal is 32 px
wide in all four, and the gather's headband plate is no larger than the idle's. The probe's f0 1.20 is the bowed head,
not a bigger head. The hold frames read 0.98 on the probe. No packScale, no re-stitch.

Result: frame 0 recorded as `scaleExemptFrames` for v08 (the gate reads the bowed head; the manual QA record only covers poses the probe cannot read at all), as for his `specialDown` f0-f1 and `airHeavy` f3. Not a design approval (the user approved v08 as drawn, relay charge #8) and not a
contact check.
