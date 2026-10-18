# Sasuke beamStruggle v02 measurements

Candidate source: `raw/_qa_hold/beamStruggle_v02.png`, SHA256 `C51B1D9A4FE3393DBD460E2DB36161AB8326989B47DA8E5147D6185A67477591`, 2172x724; attempt 03 selected. Packed candidate: bodyHeight 153, x0.299, 48-color quantization, diagnostic only.

| Evidence | Measurement | Meaning |
|---|---:|---|
| Source crown-to-chin | attempt 02: 130–133 px ±4–6; attempt 03 visually near-equivalent, approx 130 px | Astra's source observation; not a hand-measured pass against every approved cell. |
| Density estimate from 40–44 px reference head | factor range 0.305–0.338; central about 0.322 | Range carries crown/chin and reference landmark uncertainty. |
| Packed candidate head vs approved idle | f0 0.991, f1 0.993, f2 1.004 | Automatic scale probe, tolerance 6%; pass is idle-relative only. |
| Packed candidate feet vs idle | 0.971, 1.036, 1.095 | Probe output; pose/footprint is not a universal standing-height target. |
| Packed body sheet H | 0.991, 0.993, 1.004 | Same head ratios. |
| Packed body sheet B | 0.891, 0.886, 0.961; median 0.891 | Advisory area metric, not segment certification; review torso/limbs. |
| Packer | exit 0; palette snapped to 48; candidate recognized v02 with approved v01 retained | No official atlas was written; output is isolated under scratch/public review. |

The central source factor estimate and packer scale factor are not interchangeable: bodyHeight 153 yielded x0.299 in the actual candidate pack and the resulting idle-relative heads listed above. No manual title-reference equivalency pass is claimed. Astra's source observation noted the collar/base-neck-to-rope region remains compact (roughly 30–35 px at the head-matched density, against an approved reference estimate of about 39–44 px) and visible leg chain roughly 77–84 px, with joint uncertainty. Attempts 01–03 did not show defensible source-level torso improvement beyond uncertainty. Astra completed the quantized segment, hand/contact, loop and anatomy review and left the candidate on HOLD.

## Contact and framing

The brief's contact point is the forward knuckle tip, not the palm or hand centroid. This ledger does not claim a version-bound pixel coordinate for the knuckle tip or contact-zone deviation; that must be measured from the frozen quantized cells by the final reviewer. The candidate has not been silently repositioned or given an anchor override. Frame count is 3, loop is true, and the packer returned all three frames with no clipped-frame warning in the candidate row. Full sheet hashes are bound in `GENERATION_LOG.md` and the review asset filenames.

## Astra final quantized-atlas audit

Hash-bound report: `ASTRA_AUDIT_v01.md`; sheet SHA256 `7AD5EAB46EAB261FB043C073EE44A5A8A5B9F69195494C24F6A9865F7980AA06`, anims SHA256 `A59F0752941D50410E6C2B342B970911B10A62FE674C8F7EFD880FF24F1CCEAA`. Verdict: HOLD torso/arm certification and loop/contact stability. Head is about 39–41 px against 40–44 px references; leg chain about 81–86 px against 83–90 px, improving the old ~65 px chain. Neck/base to rope measures about 32–35 px versus 39–44 px and remains compact. Forward fingertips are approximately x214, x199, x208 (±2 px), y116–119; they are within the zone but translate about 15 px and then 9 px, exceeding the ~6 px stability target. Shoulder occlusion/view leaves the arm-chain comparison uncertain. No approval or production promotion.