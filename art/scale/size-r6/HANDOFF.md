# ART-SIZE-R6 partial technical handoff

Task branch: `art/size-r6`; worktree: `.worktrees/art-size-r6`; local dev port reserved: 5246.

## State

This is an incomplete technical handoff, not a tier-1 review-ready batch. Initial estimated segment ranges were withdrawn because they lacked reproducible endpoint evidence. Gojo `heavy` f7 showed no demonstrated torso/leg mismatch in the grounded recovery; remaining Gojo and Killua tier-1 segment measurements are unresolved. Sasuke `beamStruggle` has conflicting visual endpoint estimates and body-sheet H; no redraw is justified from the current comparison. Tier 2 has no certified passes. The full per-row record and limitations are in [CONFIRMED.md](CONFIRMED.md).

## Claude action

Review the original packed/native source calibration for Sasuke `beamStruggle` and determine why visual crown-to-chin estimates (idle about 43 px, beam f0 about 33 px in the grid) differ from the body report H=.949 and from the clean scale-gate result at the existing manifest `bodyHeight: 122`. Do not change camera or ship a metadata change on this evidence. A valid diagnostic at `bodyHeight: 159` made `node tools/pack-sprites.mjs sasuke --quantize 48` report `beamStruggle head 1.24 of idle (feet 1.44)`; this was worse. The diagnostic manifest and complete Sasuke public output were restored to their original hashes. No 159 diagnostic atlas is retained, so no claim is made that the rendered result improved.

After calibration, complete reproducible per-frame landmark measurements for all six tier-1 strips and tier-2 rows, including limb chains, clothing volume, and uncertainty. Only then make any justified tier-1 correction and prepare a review-ready candidate page. Final Astra audit remains pending until user approval; this worker did not conduct one.

## Killua candidate hold

`airLight2` v07 remains the approved version (`approvedVersion: 7`). v08 is preserved under `art/characters/killua/raw/_qa_hold/airLight2_v08.png` (SHA-256 `214A3A6F4A11F556D135A8BB20120005B8CEDCBF37865360368DF45FAC4898EC`). It failed strict packing with `head 1.06, feet 1.21 of idle`, and wrote no atlas/frames. It is not submitted for user approval. The generation ledger records two cumulative calls used, including the unpersisted first-call incident, exact second-call source path, prompt, hash and validation.

## Verification and limits

- `npm run build`: passed.
- `npm run test:sprites`: 364 passed, 1 failed; the stitch fixture hit `EPERM` creating `E:\gcd-scratch\gcd-stitch-ref-XXXXXX` and reported `xNaN vs x1.469`. No tools/code were changed by this task.
- Goku and Luffy body reports were copied to distinct files in this directory before the shared report was restored to its original tracked bytes. Their body-color definitions and flagged rows are diagnostic only.
- No final art approval, Astra audit, merge, or production deploy occurred.
