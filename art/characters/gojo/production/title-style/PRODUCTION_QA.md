# Gojo title-style production QA — in progress, 2026-10-11

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
| jumpSquat v04 | Probe is unmeasured. Native `jumpSquat-compare.png` compares the approved neutral, packed idle and squat; Codex recorded a version-specific manual scale pass based on head, torso and compressed leg anatomy. User review remains. |
| run v08 | Measured stitch and head gate pass. Source and atlas contact show repeated leg lead across A/B; loop needs correction. |
| superDash v06 | Head gate passes; rightmost frame appears clipped by about 7 px. Offset only after checking the left margin and all frame pixels. |
| light2 v04, light4 v05 | Generated A/B parts cannot be stitched: pose components touch according to `stitch-parts.mjs` even with explicit `--counts`. Light4 also reads closer to a front kick than the specified spinning roundhouse. New source parts required. |
| light3 v03 | Measured stitch B factor x0.9814 completed; head ratio 0.91 fails, so redraw needed. |
| heavy v04 | Measured stitch B factor x0.9098 completed, but the source impact reads raised fist instead of a clear leading elbow. Correct before review. |
| getup v03 | Four visible source poses for five required frames; correct before review. |
| airLight3 v08 | A/B parts generated; A's slash separates as a fifth component, so measured stitch cannot accept four poses. |
| airHeavy v07, special v03, specialForward v05, specialUp v03 | Both parts generated and measured stitches saved. airHeavy has a severe within-strip head pop; special and specialForward have head drift. specialUp passes automated gate but needs visual QA for disappearing pose. |
| portrait, cutin, select v02 | Three title-style UI candidates saved; initial visual check found intended blindfold, exposed-eye and vortex motifs. Approval and final packed UI QA pending. |
| remaining new strips | Source images filed with review rows; frame count, head gate, packed anatomy, contact zones and loops remain open. |

Latest `node tools/pack-sprites.mjs gojo --quantize 48 --out art/characters/gojo/production/title-style/qa-public` exits 1 with 16 scale-gate holds listed in `pack-batch2b.txt`. It writes no new atlas. `beamFire v04` has a measured uniform auto-head fit; attempted auto-fit for `airLight1`, `specialDown` and `superPose` increased clipping or head drift and was removed. Down and KO retain the original prone silhouettes pending Claude adjudication. A production build passed at the first committed checkpoint (`cb0bf4c`), and draft PR #72 has a committed preview of that partial atlas. Neither indicates completed art or a release-ready atlas.
