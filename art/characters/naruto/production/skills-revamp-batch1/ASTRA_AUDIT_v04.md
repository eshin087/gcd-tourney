# Astra audit v04: Naruto beamCharge v13

Date: 2026-10-18 UTC. Auditor: GPT-6 Astra, medium. Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-naruto-skills`, branch `art/naruto-skills`.

**HOLD.** The detached f2 fragment and old horizontal fan join are cleared, but f2 now has a vertically severed fourth-tail contour; f0 has a doubled/forked fourth-tail tip. Candidate remains unapproved. This audit supplies no final packed anatomy/scale pass and does not change other assets' decisions. ASTRA_AUDIT_v03 is preserved as history.

## Inspection and measurements

Directly inspected all three v13 source frames against v11 and the preceding v12 inspection; inspected a native-resolution f2 crop at local x0..559/y80..469. The approved Naruto neutral/combat cells, production contract and anatomy limitations inspected in v03 remain applicable. No image generation, image modification, packing, manifest or review change was made. Only this report was added.

Raw dimensions: 2172 x 724, three 724 x 724 frames. Compared decoded RGB pixels against v11. Foreground predicate: `not (r > 200 and b > 200 and g < 80)`; connected components use four-neighbor adjacency. Coordinates are zero-based local source pixels, inclusive.

| Frame | Changed RGB pixels vs v11 | Change bounds | Foreground component larger than 20 pixels |
|---|---|---|---|
| f0 | 131878 | x0..490/y0..435 | 155238 pixels; x41..690/y96..658 |
| f1 | 0 | None | 157881 pixels; x41..691/y96..656 |
| f2 | 135156 | x0..534/y0..435 | 158413 pixels; x41..691/y96..658 |

Every pixel at y>=436 is identical to v11 in all three frames. f1 is entirely identical to v11. This confirms lower body/limb preservation below the fan edit's maximum extent; the difference rectangle itself includes background and does not establish preservation of every anatomical pixel above that row. Visual inspection found the head, torso and four limbs intact and stable. No new extra/severed limb is apparent.

## Fan and seam verdict

- **Detached fragment cleared:** the old separate 3283-pixel f2 component is gone. Each frame has only one foreground component larger than 20 pixels. This component statistic alone does not certify a correct tail contour.
- **Horizontal seam cleared visually:** the former straight boundary near y409/410 across f2's left fan is no longer evident; the lower fan follows a curved tapered outline into its root.
- **f2 fourth tail remains defective:** the former old-tail material within x<500 remains connected to the root, while the old detached-component mask removed material at x500 and beyond. Its right edge is now a straight vertical severing line at approximately x499/500 from y165..305 (visual endpoints +/-5 px). The tail ends in a tall truncated wedge rather than a complete tapered tip. There is also a smaller new tip immediately left of it around x447/y249. The native crop shows overlapping old/new fourth-tail geometry. Four principal trunks are visible, but this is not a pass for four clean, independently readable tails.
- **f0 fourth tip remains doubled:** the fourth tail has adjacent peaks around x448 and x480 at approximately y249, separated by a V-shaped notch (visual coordinates +/-5 px). This reads as a forked tip from overlapping contours. f1 has the clean single fourth-tail tip and is unchanged.

Consequently, removal of a disconnected component from v12 cannot be used as a sufficient edit mask on v11: the same pixels belonged to the exterior of a still-connected, longer old tail in v11. The defects are visible in the full strip and would vary between f0/f1/f2 and the wrap to f0. No playback smoothness pass is claimed.

## Anatomy and approval boundary

All frames retain fully engulfed crimson-black identity, two ears, white roar mouth and four connected limbs. Lower body preservation does not establish correspondence to the approved human neutral/combat skull, torso, limb lengths or build. Open jaw, shroud musculature, crouch and far-limb occlusion retain the measurement uncertainty described in v03. No current quantized v13 atlas or version-bound same-density packed idle/reference comparison was supplied or produced here. Previous v10 atlas estimates cannot become v13 measurements. Final anatomy, scale, contacts and loop verification remain pending. Do not grant a head exemption or numeric pass from these raw measurements.

Preserve v13. Correct the entire old/new fourth-tail overlap without introducing another rectangular cut, then re-audit the actual new version. User image approval remains pending and separate from this technical hold.

## SHA-256

- `art/characters/naruto/raw/beamCharge_v13.png`: `196f3ff4b516c28b26875ea116a9a0ec77a14c6eb6010952cb33174f570582ce`
- `art/characters/naruto/raw/beamCharge_v11.png`: `9a739a0b8a860c05e1099e739ea11b4757562a39a3fb8cc6491febad35ee8317`

Approved reference hashes and prior version evidence remain recorded in ASTRA_AUDIT_v03.md.
