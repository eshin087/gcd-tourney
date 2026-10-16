# Win v03 candidate QA

## Source and measurement

- Source: [win_v03_attempt02_source.png](generation-source/win_v03_attempt02_source.png), exact captured call and prompt in [win_v03_attempt02.md](generation-source/win_v03_attempt02.md).
- Rendered candidate: `raw/_qa_hold/win_v03.png` (4×256x256 cells, 1024x256 strip). It is preserved as a held versioned candidate; no fixed-name reference is created.
- Source panel rectangles and whole figure bbox from a magenta-background mask: f0 x108–488/y64–690 (381×627); f1 x631–1012/y68–690 (382×623); f2 x1156–1540/y65–690 (385×626); f3 x1688–2070/y64–690 (383×627). Inclusive endpoint measurements; ±3px at hat/sole due source edge pixels.
- Approved title-style neutral cell: `production/native-audit-20261015/neutral.png`, 256x256, SHA-256 `8e9da76421c52e5fa449ce55b2db1933b52e74d15ccd4a69090b9f97eb082b1`; measured hat top y=7, sandal sole y=244 inclusive, 238px total. This is the upright stature anchor. Approved combat cell is `production/native-audit-20261015/combat.png`, SHA-256 `439678e0a9689edc3cc9686d51a65f9d546e2e68aae20760de8e7f4391a306e0`; it informs design/anatomy comparison, not upright stature.
- A single scale factor `0.3803435877` was derived from the four complete source-body heights and 238px neutral target. It was applied identically to all poses: resulting hat-top-to-sole spans are 238, 237, 238, 238px. No per-pose rescaling was used. All feet share baseline y=240; horizontal placement only centers each complete source figure in its 256px cell. The reference idle and combat cells appear to use a lower/crouched pose, so they are not substituted for standing stature.
- Contact sheet [win-v03-contact.png](win-v03-contact.png) places the exact approved neutral, approved combat, approved idle f0, and all four output candidate cells at native 256px density in that order. Direct visual check: four complete figures; fists at head height; no apparent edge clipping. Pose variation between loop frames is restrained. No independent Astra anatomy/loop audit has been performed.

## Technical result and limits

- Candidate strip SHA-256: `957950d053ba77680a3b0f9343ff142ab0afd25fe61688ae9e455c0819aa84a5`; pre-pack transform metrics are in [win_v03.json](../raw/_qa_hold/win_v03.json).
- Strict local diagnostic command: `node tools/pack-sprites.mjs luffy --quantize 48 --out art/characters/luffy/production/diagnostic-output --no-writeback`.
- The packer selected `win_v03` and failed its automatic scale gate: win head 0.94 of idle (feet 0.88), “whole figure is off”; that run wrote no atlas. This actual failure is retained as a technical HOLD. The source-coordinate stature comparison is consistent with the approved upright neutral, but the packer's idle-relative measure disagrees; manifest `bodyHeight` remains 212 while the measured neutral is 238px (`212/238 = 0.891`). Do not compensate in the source or change this calibration field here; Claude owns the contact/body-scale reconciliation.
- After moving `win_v03` into `_qa_hold`, the same local-output command emitted a partial diagnostic pack with idle plus dash v02, jumpFall v03, light2 v01, and hurtHigh v01 (5 animations/22 frames); win is missing/held. It is not public output, complete fighter QA, or a final Astra audit. Output hashes are recorded in [light1 v02 QA](light1-v02-QA.md).
- All other previously excluded core animations remain held/missing as documented in [REVIEW_ROWS.md](../REVIEW_ROWS.md). This candidate is unapproved and not ready for production packing.
