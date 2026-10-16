# Killua beam clash round 2 QA

Date: 2026-10-15. Candidate: `beamStruggleAir_v02.png`. User approved v02 via Claude relay #10. Superseded v01 is preserved in `raw/_rejected/` with its gate findings.

## Packing and scale

- `npm run sprites -- killua` packed 44 animations / 181 frames. The v02 air strip was selected; it produced no scale-gate finding. The command also rewrote other generated local pack outputs; those are excluded from the handoff commit.
- `node tools/pack-sprites.mjs killua --quantize 48` exited 0 and quantized the atlas to 48 colors. The candidate is 3 frames; no candidate-specific scale-gate warning appeared. Existing unrelated findings remain: charge v13 drift and the approved down/ko grounding notes.
- `npm run scale -- killua` wrote `art/scale/heads-killua.png`; aggregate result 34 ok / 9 manual / 1 drift (the drift is the pre-existing approved charge v13). No new beamStruggleAir v02 drift was listed.
- `npm run body -- killua beamStruggleAir` reported 0/1 strips flagged. Packed frame head ratios H=.97, 1.01, 1.03; garment/body ratios B=.97–.99. B is advisory. The equal-density sheet is `art/scale/body-killua-beamStruggleAir.png`.
- Atlas anatomy review by Astra is still pending. The three palm anchors have not been exactly measured; do not treat them as final runtime anchors.

## Visual scope

The selected v02 uses the approved purple sweater, navy collar and shorts, white cuffs/hem, and purple-white sneakers. All three poses hover with bent/tucked knees; the open palm reaches down-forward. The strip contains no energy effect. The earlier v01 stays preserved and held; no other raw strip was changed.

Review page: `public/reviews/beam-clash-r2/`.
