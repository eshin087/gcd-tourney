# Luffy relay 11 final strict atlas audit

Astra, 2026-10-16. **PASS within measurement uncertainty for special v02 and all 108 selected frames in the exact strict atlas below.** User drawing approval remains pending. This does not certify timed gameplay, contact zones or release integration.

## Final binding

- Directory: `art/characters/luffy/production/relay11-generation/strict-r6/characters/luffy/`.
- Sheet SHA256: `e8d5ba9f95a833af82bd13441d3099d15cf44449573e15db5af404f01eb92ce0`.
- Metadata SHA256: `7acf280f3c8a7b7b7f2ae8ec75119d8bc61c42e507faaa6ae14a1ee84816ebcd`.
- Normal strict pack selected 23 animations / 108 frames at 48 colors, with no scale-gate failure. Six pre-existing placement/hitbox warnings remain; none is a new special defect.

Independently hashed both final files and compared the full strict PNG bytes against the audited diagnostic PNG: identical. Parsed animation maps, frame indices, durations and loop flags are also identical. The metadata hash changed after version-bound manualQA was recorded; the visual evidence does not rely on that record as proof.

DIAGNOSTIC_AUDIT.md records the complete source-preservation, anatomy, uncertainty and static sequence findings. FINAL_PIXEL_HASHES.json and final-cells/ bind all 108 actual pixels; their diagnostic metadata identity is historical, superseded for final binding by the strict metadata hash above. All 100 retained alpha masks are unchanged from the preceding public atlas, and every final shared-palette frame was visually inspected. No RGB or geometry change occurred between that inspection and this strict result.

## Special v02 result

All eight frames pass technical anatomy and fit within uncertainty. Original A frames 0–5 remain preserved as source drawings; native comparison has identical crop geometry and opaque RGB, with only 14 isolated pixels removed by ordinary second-pass cleanup. Both A copies hash to `7ec7381d83ca597c9e91f6c05bc7390c241a0fc24befa9a77e506828d1a55ceb`.

Frame 6 visibly retracts the extended arm; frame 7 returns to a compact guard. Neither new frame has a missing limb or cut recovery. Native frame 7 torso is 38.8 +/-5px and shin 52.8 +/-6px, compatible with approved idle 41.5 +/-6 and 52.8 +/-6. SPECIAL_MEASUREMENTS.json and the endpoint overlay document these readings. Head/face, shoulders, arms, chest, clothing volume and sandals were also inspected. Hidden or foreshortened joints receive no invented numeric pass. Hat size and posed bounding-box height were not used to certify body density.

Stitch B factor 0.5057 and per-strip factor approximately 0.518 produce an effective B factor approximately 0.2619526; this is not an x1 claim. Final pixels, rather than the head probe or stitch report, support the pass. Static recovery and loop relationships were reviewed, but no timed playback claim is made.

## Selected inventory

Technical passes: idle01, run01, dash02, jumpUp01, jumpFall03, land01, light1 v02, light2 v01, light3 v02, light4 v02, heavy01, airLight1 v01, airHeavy01, guard01, hurtHigh01, launched02, down03, getup03, charge01, beamCharge01, beamFire02, special02 and win03. Existing user-accepted run/light3/light4/airLight1 clipping and Claude's beamFire arm-continuation condition remain explicit exceptions; no new exception is added. Down03/getup03 approval is unchanged.

## Handoff

The exact isolated strict output is technically audited. Parent owns byte-identical public/hosted adoption checks, preview publication and the approval-desk request. Changed pixels require recheck. Main AGENTS, current inbox and goku-luffy relay state were rechecked; no relay ring was sent by this subagent. No source, production manifest or public output was edited by the auditor. No additional image call is requested.
