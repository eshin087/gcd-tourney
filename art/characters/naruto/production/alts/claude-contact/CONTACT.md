# Naruto attack alts: Claude calibration and contact (QA-NAR-ALTS-CAL, 2026-10-14)

Requested by NOW.md (PR88 blocked on Claude's calibration and contact work); reserved in
docs/agents/CLAUDE_ART_HANDOFF.md. Inputs: Astra's `../astra-audit/REPORT.md` and `ANATOMY-TABLE.md`, source `92ac54c`.
No generation, no budget change, no art approval, no merge, no deploy.

## 1. Contact is now the base's by construction (main, PR92, ADR 0031 amendment)

Seven of nine attack alts failed the old 12 / 16 px art-box contract. Most failures were the packer's auto hit box
finder reading a torso, a guard fist or a foot area on the new drawings, not where the alt actually strikes. The packer
now copies each base frame's hit and hurt boxes onto its alt frame (`inheritAltBoxes`), so an alt can never change
what connects, what can be hit or the AI's reach estimate. This is what the user was promised: "damage, timing and
hitboxes stay the same; only the art changes". `altCheck` now judges the drawing only: the alt's drawn strike must land
within **24 px** of the base's hit, or the hit spark (drawn where the base's boxes meet the opponent) floats off the
fist or foot. This branch merged main (`47a73a6`) to get that packer.

## 2. Calibrated on this branch (Claude's files)

| alt | change | why | after (warn-mode pack) |
|---|---|---|---|
| light1Alt v01 | bodyHeight 173 -> 168 (k 0.97) | head probe 1.06; Astra H 40-41 vs 40: k 0.928-1.000 | head 1.022, no warning |
| light1Alt v01 | `hitboxes.json` light1Alt f2/f3 on the drawn hook fist | the auto finder read the strike at knee height (-63 px); the drawn fist lands 12-19 px short of light1's hit and 6 px lower, inside 24 px | no visual warning; ships light1's boxes |
| light4Alt v01 | bodyHeight 192 -> 177 (k 0.92) | probe 1.12; H 41-43: k 0.895-0.946; S stays within 6 % | head 1.038, no warning |
| airLight3Alt v01 | bodyHeight 192 -> 169 (k 0.88), f2/f3 7 px back | probe 1.19; H 42-44: k 0.874-0.891; the smaller size cut the 15/21 px clip to 3 px, the shift removes the rest | head 1.031, no warning |
| hurtLowAlt v01 | bodyHeight 170 -> 161 (k 0.945) | probe 1.09; H 41: k 0.917-0.972 | head 1.037 |
| airLight1Alt v01 | f1/f2 3 px back | f1 reached 3 px into the 4 px margin | no warning |
| airLight2Alt v01 | f1/f2 4 px back | f2 reached 4 px into the margin | no warning |

Sizes live in each version's raw sidecar (top-level `bodyHeight` / `frameOffsets`, next to the stitch data), so a
redraw is not resized by them. hurtHighAlt v01 needed nothing (head 1.059 strip, f2 1.103: Astra's audit decides).

## 3. Needs Codex (no Claude fix exists)

| alt | finding | suggested remedy |
|---|---|---|
| light3Alt v01 | the sweep is drawn at shin height, **95 px below** light3's hit (a front kick to the body; the move counts as a low but its contact is mid-height), and its head reads 1.18 | redraw: a mid-height technique, e.g. a side kick or knee to the body, at the base's contact. Claude's original technique suggestion ("low sweep at shin height") caused this; the miss is on Claude, not the art |
| light2Alt v02 | f2 clipped 7 px at the right; the kick lands 33 px further and 34 px lower than light2's fist | redraw with the foot at chest height and inside x 4..251 (a snap kick lands where the straight lands) |
| heavyAlt v01 | two parts at two scales (f1 1.15 vs f5 0.95 of the idle head) | re-stitch with a measured factor (`npm run stitch -- naruto heavyAlt v01`, no new call), then Claude recalibrates and rechecks where the kick lands |
| airHeavyAlt v02 | two scales (f1 0.90 vs f3 1.16); the drawn strike is 95 px short of the hammer's hit; f5 clipped 7 px at the left and is another attack, not the air-base recovery (Astra) | re-stitch can fix the scale but not the strike or f5: a redraw is the remedy. Its budget is exhausted, so it needs the user's authorization |

Technique and pose fidelity findings (light1Alt reads close to the jab, airLight1-3Alt not clearly distinct from their
bases, start/end pose differences) are Astra's and the user's art-direction call; calibration does not touch them.

## 4. What is not on the branch yet, and why

`public/characters/naruto/` on this branch is not repacked: the normal scale gate (strict for unapproved new versions)
refuses the pack while light3Alt drifts and heavyAlt / airHeavyAlt pop, and nothing is shipped from a forced pack. The
numbers above come from a warn-mode diagnostic pack in Claude's scratch (manifest copy with naruto `scaleGate: "warn"`;
sheet sha256 `b064ef97e24a67e3da75f9c1c3221b93124a6333930d6f05cf376ebc5953d5b4`, anims.json
`76a422246c59f5d22f39b7fc40039a23ecfb226eec30d3c4531ecce64138ea58`). The branch pack is written once the three
strips above are re-stitched or redrawn; Claude repacks and rechecks then.

Evidence: `calibrated-2x.png` (idle f0, then base / alt strike frames of light1, light4, airLight3, hurtLow) and
`needs-codex-2x.png` (base / alt of light2, light3, heavy, airHeavy, plus airHeavyAlt f5), both from the diagnostic pack.
