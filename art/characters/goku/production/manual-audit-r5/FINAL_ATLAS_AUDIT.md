# Goku relay 11 final atlas audit

Astra, 2026-10-16. **PASS within measurement uncertainty for light3 v13 and all 108 selected quantized frames.** This is technical anatomy and scale evidence, not user drawing approval or runtime contact certification.

## Exact final identity

- Sheet: `final-fixture-public/characters/goku/sheet.png`, SHA256 `ebb27850371179a0fdc9da5d76816ebdb52b747712643b60cd40e14bfe6460ca`.
- Metadata: same directory `anims.json`, SHA256 `b43af90a609dc0a36e688bad916c50694962ce2fced6fb02384cd400bcd814ca`.
- Pack report SHA256 `8729003a5e3dd7e2be172f21f1dd754853a0ccdf034ca11fc55b193d5dbdaa21`.
- 23 animations, 108 frames, 48 colors. Light3 v13 uses bodyHeight 237 and actually packs at x1. Raw source and diagnostic identities are in CANDIDATE_AUDIT.md.

This report supersedes the invalid first fixture sheet `ff139d8f71bfb59b6edd3fdd8ee2b9cd10f0d00aa9e57ae2003dc84fc29e99c5` and metadata `db121a6fdfd4dc2976c472743223a95caadd4f8caf04dbcc084a8a98468759be`. That fixture changed retained geometry and was rejected. INVALID_FIRST_FIXTURE_HASHES.json preserves the evidence. It is not an alternate passed atlas.

## Actual x1 proof and correction of the earlier hypothesis

The earlier possible 237/238 reduction was a hypothesis, not an applied transformation. The packer's native tolerance retains the 238px source extent when bodyHeight differs by one pixel. Reported scale and every light3 frameScale are 1. Independent pixel matching corroborates this: after integer translations, every final light3 alpha pixel is present at the identical native location in the cleaned standalone diagnostic. Differences are only 0,1,1,1,0,2,0 removed pixels across the seven frames, consistent with small-speck cleanup; no rescale is required to register the masks. See LIGHT3_DIAGNOSTIC_TO_ATLAS_GEOMETRY.json. Comparing raw magenta directly includes ordinary background-edge cleanup, so that larger count is not evidence of resizing.

Thus the current inbox x1 condition is satisfied by actual pixels. No calibration exception for a capped rescale is requested. Source factor remains uniformly 0.696133; nominal top margin is narrow but complete anatomy is preserved. No clipped hair, boot or hand is observed.

## Light3 v13 anatomy and sequence

All seven final quantized cells were inspected against approved neutral, combat and idle at native density. The compact stomach-height front kick and bent-knee recovery maintain consistent face/head size, chest/neck, exposed arms, belt, gi volume and boots. Frame 0 guards; frame 1 chambers; frames 2 and 3 extend the front kick; frame 4 retracts the bent knee; frames 5 and 6 return to guard. Last guard to idle is coherent. No former tall recovery, detached limb, neighboring fragment or visible truncation remains.

SOURCE_MEASUREMENTS.json records endpoints and uncertainty. The reference-ensemble estimator is about 0.696, while idle-only central ratios are around 0.72; this sensitivity is explicit. At the selected factor, torso predictions 36.8–37.5px compare with idle 38.1 +/-5, boots 41.9–42.1 with 43.7 +/-4, belt 32.7–34.8 with 36 +/-4. Approved title references independently support the lower central estimate. Final pixels also agree visually with idle, so this is not a separate small-character allowance or an overlap-only numeric pass. Hidden knee and ankle centers remain unmeasured; forearm projection changes are assessed visually.

## Whole-atlas recheck

FINAL_PIXEL_HASHES.json binds all 108 exact extracted cells, animation indices, loop flags and durations; native contacts are in final-cells/. All 101 retained frame alpha masks match the prior public baseline `f117d996d5d9f225b13bfc6d7b19a741e603fa04a329b1410422263eadd824f2` exactly. Every final RGB frame was independently viewed after shared palette recomputation. Skin, orange gi, blue clothing/boots, face detail and joint outlines remain readable; no new body drift or palette-induced limb loss was found.

Passed selected versions: idle02, run09, dash09, jumpUp04, jumpFall04, land07, light1 v04, light2 v05, light3 v13, light4 v09, heavy14, airLight1 v07, airHeavy06, guard05, hurtHigh08, launched08, down05, getup11, charge05, beamCharge07, beamFire07, special05 and win05. Prior per-strip uncertainty remains in manual-audit-r4 and earlier reports. Static consecutive poses, recoveries and loop seams were inspected for every row. The existing getup grounding/contact warning remains Claude's runtime responsibility.

No timed playback, gameplay contact-zone or hidden-joint accuracy claim is made. Heavy14's user approval is preserved; this audit does not approve light3 v13. Parent owns exact-byte public/hosted adoption checks, review publication and relay. Changed final pixels require recheck.
