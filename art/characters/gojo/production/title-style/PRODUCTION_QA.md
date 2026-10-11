# Gojo title-style production QA — checkpoint 2026-10-11

The user approved the four title-style pilots and their neutral/combat lineups, then authorized all 42 animations and three UI images without intermediate approval stops. New animation sources in this branch are **candidates**. The working atlas and preview are incomplete, and Claude alone may integrate/merge to main or deploy production.

## Reference and attempt record

- Fixed visual references: `reference/title_style_approved.png` and `reference/title_neutral_approved.png` (neutral occupied 91 x 236 px in a 256 px cell). The idle v06 is a provisional supporting reference, independently inspected at native atlas scale, not user-approved final art.
- Root handoff generated idle A/B once, guard once, run A/B twice, light1 A/B twice, and the other initial movement/reaction strips once. Idle v05's old-reference stitch failed; v06 is the measured restitch. Run v07 and light1 v04 source parts were retained as failed attempts before v08/v05.
- This checkpoint generated land three targeted attempts from the approved neutral and v04, retaining v05 as a failed gate candidate and v06 as the current head-fit candidate. Each other newly filed attack, reaction, special, or win source or part used one built-in image-generation call so far. No source version was overwritten.
- Down v04 and KO v05 were generated with their original pose sources as references; the original lying silhouettes and orientations were preserved. Existing floor-band warnings require Claude's manual anatomy assessment, not distortion of those poses to satisfy a metric.

## Validated and open checks

| Asset | Checkpoint result |
|---|---|
| idle v06, guard v04 | Native atlas comparison against approved neutral/combat pilot found matching head, torso and limb relationships; root's pack passed. Final user review remains. |
| land v04/v05/v06 | v04 head ratio 0.93 and v05 0.94 failed; both remain in rejected history. v06 auto-head fit x0.92 and no new `land` gate line. Full packed anatomy and motion QA pending. |
| jumpSquat v04 | Probe reports `unmeasured` even though nominal head ratio is 1.00. No numeric pass or manual acceptance recorded yet. |
| run v08 | Measured stitch and head gate pass. Source and atlas contact show repeated leg lead across A/B; loop needs correction. |
| superDash v06 | Head gate passes; rightmost frame appears clipped by about 7 px. Offset only after checking the left margin and all frame pixels. |
| light2 v04, light4 v05 | Generated A/B parts cannot be stitched: pose components touch according to `stitch-parts.mjs` even with explicit `--counts`. Light4 also reads closer to a front kick than the specified spinning roundhouse. New source parts required. |
| light3 v03 | Measured stitch B factor x0.9814 completed; packed anatomy and motion pending. |
| heavy v04 | Measured stitch B factor x0.9098 completed, but the source impact reads raised fist instead of a clear leading elbow. Correct before review. |
| getup v03 | Four visible source poses for five required frames; correct before review. |
| remaining new strips | Source images or A parts filed with review rows; frame count, head gate, packed anatomy, contact zones and loops remain open. |

`node tools/pack-sprites.mjs gojo --quantize 48` currently exits 1 because jumpSquat is unmeasured; earlier runs also failed land until v06. No strict pack or build pass is claimed for this checkpoint. The current `public/characters/gojo` edits are a partial working atlas and are not release evidence.
