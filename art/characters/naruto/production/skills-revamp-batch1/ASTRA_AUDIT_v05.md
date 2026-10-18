# Astra audit v05: Naruto beamCharge v14

Date: 2026-10-18 UTC. Auditor: GPT-6 Astra, medium. Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-naruto-skills`, branch `art/naruto-skills`.

**HOLD. The f0 fork and f2 vertical cut remain.** v14 is unapproved. No final packed anatomy/scale clearance is supplied. Previous audit records are preserved.

## Evidence

Inspected the complete 2172 x 724 raw strip and native-resolution fourth-tail crops for all three frames (local x350..559/y140..439). Compared decoded RGB pixels with v13. No image generation, source-image change, packing or tracking edit was performed by this audit; only this report was added.

| Frame | Changed pixels vs v13 | Local inclusive change bounds |
|---|---|---|
| f0 | 4655 | x500..534/y173..305 |
| f1 | 0 | None |
| f2 | 1372 | x502..534/y173..305 |

Every pixel outside these bounds is unchanged from v13. In particular, the f0 fork at approximately x448..482/y249 and the f2 vertical edge at x499 remain untouched. These coordinates refer to source pixels, not the resized full-strip display. Crop inspection confirms the defects rather than relying only on the difference bounds.

## Findings

- f0: fourth tail still has two pointed peaks separated by a V notch. This is the same doubled/forked contour as v13, visibly unlike f1's clean single taper.
- f1: unchanged donor frame; four intact tail tips.
- f2: fourth-tail material still rises to roughly y165 and ends abruptly along x499/500 down to about y305 (visual endpoints +/-5 px). A smaller replacement tip remains to its left around x447/y249. The old/new overlap forms a severed tall wedge. The x500..534 field deletion cannot fix material remaining left of that field.
- The isolated fifth remnant is no longer apparent, and the earlier y409 horizontal fan seam remains visually cleared. Neither improvement clears the remaining fork/cut.
- Four principal tail trunks remain visible, but there is no pass for four clean complete tail shapes. The fourth-tail silhouette still differs conspicuously across f0/f1/f2. No playback smoothness pass is claimed.
- All lower-body pixels at y>=436 remain unchanged from v11 by the v13 comparison plus the strictly higher v14 edits. The head, torso and four limbs remain visibly intact. This is preservation evidence, not calibration to approved title anatomy.

## Remaining boundary

Candidate remains HOLD and unapproved. The actual new quantized atlas, equal-density approved idle/neutral/combat comparison, uncertain skull/torso/limb/build measurements, all loop transitions and Claude contact checks remain pending as recorded in v03/v04. No old partial atlas, raw silhouette bounds or unchanged body can be relabeled as a current anatomy/scale pass. Other assets' approval decisions are outside this audit.

## SHA-256

- `art/characters/naruto/raw/beamCharge_v14.png`: `d4903ae92790ffb9ffd31a18ccd186d4ca8295d51a404823ada113e2c4a484de`
- `art/characters/naruto/raw/beamCharge_v13.png`: `196f3ff4b516c28b26875ea116a9a0ec77a14c6eb6010952cb33174f570582ce`
