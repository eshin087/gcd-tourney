# Goku charge v10: Claude's landmark scale check (integration, 2026-10-18)

Why: Goku's head probe is off (builds.json `headProbe: manual`, TOOL-GOKU-PROBE), so the art guard needs a landmark
`scaleManualQA` for every strip. Astra's v10 audit (public/reviews/charge-goku/technical-notes.md) passed identity and
anatomy qualitatively; the body sheet read B 1.16-1.20 (garment area vs idle f0, advisory ±10 %). This check measures
parts a pose cannot stretch, in the packed cells (`public/characters/goku/sheet.png` SHA256
`9a1417af010ead2f9ce0027c3835b2aee61964e2ffb08b1014eed4ecaa2ae0b4`, `anims.json` SHA256
`3b3de8f659f6326c2fccc3248daa24dfe0b246128761dba6394582ed16ae0d99`; charge = cells 86-91, idle f0 = cell 0).

Method: connected blobs of Goku's blue (boots, wristbands, sash, undershirt; `b > r + 50 && b > g + 30`) per cell, bbox
and area in cell px; comparison crops at 3x (`claude-idle-vs-hold-3x.png`, `claude-heads-3x.png`).

| landmark | idle f0 (cell 0) | idle f4 | charge f2 (cell 88) | charge f4 (cell 90) | ratio |
|---|---|---|---|---|---|
| near foot (widest boot blob) | 32 x 15, 279 px² | 32 x 16, 291 | 32 x 16, 295 | 32 x 17, 313 | width 1.00 |
| boot height, sole to cuff (near / far) | 37 / 41 px | 36 / 41 | 37 / 38 | 38 / 40 | 0.93-1.03 |
| wristbands | 119, 130 px² | 117, 128 | 128, 119 | 115, 121 | 0.92-1.08 |
| sleeves (blue cuff blobs) | 227 px² | 224 | 258 | 289 | 1.1-1.3 (arms raised and open: more sleeve shows) |

Feet, boots and wristbands match the idle within the ±1-2 px reading uncertainty: Goku is drawn at his own scale. The
body sheet's larger garment area comes from the pose (upright, chest open, arms out and down, legs spread), not from a
bigger body. Head: hair hides the crown and the head is tilted back shouting, so no numeric head ratio; by eye at 3x
the skull, face and neck read the same size as the idle's (`claude-heads-3x.png`). No packScale.

Result: pass for scaleManualQA v10. Not a design approval (the user approved v10 as drawn, relay charge #4) and not a
contact check.
