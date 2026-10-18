# Astra audit v07: Naruto beamCharge v16

Date: 2026-10-18 UTC. Auditor: GPT-6 Astra, medium. Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-naruto-skills`, branch `art/naruto-skills`.

**HOLD.** Four principal tails remain, and the v15 horizontal join is cleared, but a conspicuous vertical step now interrupts the fourth tail at local x447/448 in f0/f2. The candidate remains unapproved. This is a fresh v16 inspection, not reuse of the v15 report. v06 was also written to preserve v15 history.

## Direct evidence

Inspected the complete v16 raw source and fresh native crops of all three frames, local x350..559/y140..459. Source is 2172 x 724, with three 724 x 724 frames. Compared decoded RGB pixels directly against v15 and relevant preservation regions against v11. No generation calls, art edits, manifest/review changes or packing by this audit. Only this report added.

| Frame | Changed pixels vs v15 | Inclusive local difference bounds | Pixels changed vs v11 at y>=436 | Pixels changed vs v11 at x>=535 |
|---|---|---|---|---|
| f0 | 11226 | x448..534/y306..435 | 0 | 0 |
| f1 | 0 | None | 0 | 0 |
| f2 | 11218 | x448..534/y306..435 | 0 | 0 |

The known v15 fork/stump region is not reintroduced. f1 remains unchanged. The lower body below y435 and right-hand face region from x535 are pixel-preserved from v11. These exact checks do not assert preservation of anatomy within the replacement rectangle.

## Tail and seam findings

Four main trunks and four main tips are visible in each frame. No large detached fifth-tail fragment or doubled pointed fourth tip is apparent. The former y305/306 horizontal shading/contour join is no longer visible.

However, the lower edge of the fourth tail in f0/f2 drops vertically at x447/448, approximately y326..365 (visual endpoint estimates +/-5 source pixels). It reads as a hanging rectangular step/spur: the narrow old lower tail to the left fails to meet the wider donor tail to the right. Native crops show the straight vertical join plainly; f1's corresponding lower contour is a smooth taper. This is a high-confidence raw patch discontinuity. The tail is connected, so connectivity alone would not detect this defect.

The new rectangle also includes parts of the rear ear and upper neck/back rather than only tail pixels. f2 shows a small angular alignment discontinuity near its right edge x534/535 beside the ear/neck. This secondary visual finding has lower confidence than the tail step because the ear overlaps dark contours, but it prevents a claim that all facial/neck pixels were preserved. The main mouth/eye region farther right remains intact; no extra or detached limb is apparent.

## Anatomy, motion and approval limits

Trunk and all four limbs remain visually stable and intact. Their lower pixels are preserved as measured above. Reference comparison limitations from v03 remain: open jaw, ears, shroud muscle rendering, crouch and occluded far limbs prevent reliable raw-to-title segment and volume calibration. No actual quantized v16 atlas, version-bound equal-density packed idle/reference comparison, runtime contacts or playback was inspected. Identical lower-body pixels do not establish scale correctness. The tail step differs between frames and remains a loop concern; no loop pass is claimed.

Overall HOLD until the fan contour is continuous through the entire old/new boundary and any ear/neck overlap is checked. Preserve all versions. Final packed anatomy/scale verification and user image approval remain separate and pending. No manual numeric pass, scale exemption, production integration or approval is granted.

## SHA-256

- `art/characters/naruto/raw/beamCharge_v16.png`: `ec041c2c287304471d7b0fa174e17e9681b7a86b376261456965171458df077c`
- `art/characters/naruto/raw/beamCharge_v15.png`: `6e06f676ddb4abe3776827e4998ca47de9e35dcd01c0bfa7bde24a554623d5c3`

Prior approved reference and v11 hashes are retained in v03.
