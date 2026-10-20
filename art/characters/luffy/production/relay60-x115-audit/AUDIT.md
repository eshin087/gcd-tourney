# Relay combat #60: Luffy uSmash v05 x1.15 FINAL5 audit

2026-10-19. GPT-6 Astra, medium. **PASS within visible-landmark and projection uncertainty.** All eight actual quantized uSmash cells were freshly extracted and visually inspected at equal pixel density beside idle f0/f7 and the approved title-style neutral/combat crops. No resolved body-proportion, clothing-volume, color-boundary, clipped-limb or static sequence defect was found. This is a technical audit, not image approval or runtime contact certification.

## Immutable scope

- Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-normals-luffy-r2`.
- Verified clean starting HEAD: `dbf3e0e59ff84489d821f69d805e8d9d4f7a0b49`.
- `public/characters/luffy/sheet.png` SHA256: `4c776508cd6c9ca5a6a84cfc4ed22ccc8837e9eb53984e4622c8773a30a85640`.
- `public/characters/luffy/anims.json` SHA256: `722a153352e4458481abd4ebab4c39def034658cafa31d969cbfcbb963324666`.
- Cells 154-161; durations 50/40/30/50/70/70/60/30 ms; phases [3,2,3]; loop false; total 400 ms. Cell size 256, 16 columns, pivot [128,240], ppu 128. Independently counted 48 opaque colors.
- Neutral crop SHA256: `8e9da76421c52e5fa449ce55b2dba1933b52e74d15ccd4a69090b9f97eb082b1`; combat crop: `439678e0a9689edc3cc9686d51a65f9d546e2e68aae20760de8e7f4391a306e0`. Inputs are `../native-audit-20261015/neutral.png` and `combat.png`.
- Sheet/metadata hashes and all ten independently extracted idle/uSmash RGBA hashes exactly match relay57. This commit changes no audited pixels relative to that audit. Fresh visual review confirms the earlier finding; this is not a pass inferred solely from hash equality.

## FINAL5 method and evidence

Applied the actual final quantized-pixel bar in Goku `production/manual-audit-r3/FINAL5_STRICT_AUDIT.md` and Luffy `production/manual-audit-r3/AUDIT.md`: inspect every final frame, whole-body proportions, connected joints, garment volume, palette readability, clipping and sequence endpoints against the approved references. Read the title-style production contract. A head-only gate or occupied height is insufficient.

`contact-native.png` contains unscaled 256px cells with labels: neutral, combat, idle f0, idle f7; then uSmash f0-f3; then f4-f7. `contact-2x.png` is nearest-neighbor enlargement. Individual cells are fresh atlas extractions. `evidence.json` records exact bounds, hashes and metadata. No repack, image generation, source alteration, manifest edit or production output edit occurred.

## Per-frame findings and exact occupied measurements

Bounds below are inclusive; height includes all visible pixels including hat/raised hand. They are placement measurements, not skull-to-sole anatomical stature.

| Frame/cell | x bounds | y bounds | Occupied height | Anatomy and clothing finding |
|---|---|---|---:|---|
| idle f0/0 | 41-209 | 54-240 | 187 | Reference: broad bent stance, slim torso, complete sandals. |
| f0/154 | 67-188 | 80-240 | 161 | Crouched windup accounts for low head; torso leans and knees bend. Both arms connect, both exposed shins and sandals remain intact; shorts/cuffs follow bent thighs. |
| f1/155 | 65-191 | 62-240 | 179 | Rising torso, fists and shoulder joints remain coherent; no local body-size jump from f0. Vest and sash retain appropriate volume. |
| f2/156 | 63-190 | 54-240 | 187 | Upright preparation shows readable neck/chest and two bent arms; leg thickness and cuffs remain consistent. |
| f3/157 | 61-193 | 42-240 | 199 | Turning uppercut has connected shoulder, elbow, forearm and fist. Vest rotation partly hides torso; no detached fragment or invented joint. |
| f4/158 | 61-198 | 10-240 | 231 | Raised fist/extended arm explains tallest bounds. Head and torso preserve scale; legs, sandals and attacking hand complete. 10px top margin. |
| f5/159 | 61-193 | 42-240 | 199 | Follow-through crosses face/hat. Face and shoulder are partly occluded, not numerically certified; visible arm/vest boundary remains intelligible. |
| f6/160 | 60-193 | 55-240 | 186 | Recovery guard returns to slim torso and comparable head/hand/foot size. Narrower bent stance explains width/projection difference from idle. |
| f7/161 | 62-192 | 55-240 | 186 | Stable final guard; no resolved head, torso, limb or garment-size discontinuity into idle. Feet spread during the pose change. |

Across all frames: straw hat/red band, black hair, skin, open red vest, yellow sash, blue shorts, white cuffs and brown sandals remain distinct under the final palette. No new color-boundary merger hides an otherwise visible joint. No limb touches any cell edge; occupied extrema are x60-198/y10-240. Body build stays slim and adult. Hat-brim angle, torso twist and cloth flare vary with pose and are not treated as skull or bone changes.

## Measurements, uncertainty and interpretation

The requested 186px guard versus 187px idle is confirmed exactly for occupied alpha bounds. It includes hat and therefore does not prove standing anatomical equality. Recovery head-top y55 versus idle y54 and common soles y240 support consistent placement. Final recovery width is 131px versus idle 169px, a stance/arm-spread change rather than evidence for resizing.

Because every RGBA pixel equals relay57, its manually recorded visible landmarks remain applicable after this reinspection: screen-left projected knee-to-ankle lengths f0-f7 are 47.5, 49.2, 48.8, 47.5, 49.2, 47.0, 45.7, 47.0px, each +/-8px; idle f0 52.4+/-8px. Exact landmark coordinates and method are retained in `../relay57-x115-audit/measurements.json`; these are inherited coordinate readings rechecked against identical pixels, not falsely presented as new independent landmark selections. Cuffs obscure knees and stance changes projected lengths. Title neutral/combat prior readings are 59.1/54.6px (+/-6); visual comparison supports a coherent leg build, not a precise reconstructed bone ratio.

Recovery f7 neck-base (128,98) to waist (120,137) is 39.8px versus idle (122,98) to (112,137), 40.3px; +/-8px segment uncertainty. Title reference torso readings ~43.1/40.5px are compatible. Visible face/head excluding hat/hair is roughly 22-25px (+/-4) in readable views. Forearm and thigh dimensions hidden by foreshortening, shorts or overlap receive qualitative continuity inspection only; no numeric pass is assigned to invisible joints. Sandal/hand volume is visually consistent at shared density. There is no independently established need for a further uniform scale change.

uSmash is non-looping; f7-to-f0 is not a required loop seam. Static progression and f7-to-idle transition show a pose change, with no resolved anatomical growth/shrink. Timed smoothness, engine grounding and hit/hurtbox contact require Claude's runtime check. No build or pack was run for this read-only art audit.

## Verdict and handoff

**PASS for this exact x1.15 uSmash v05 atlas only**, with the measurement/occlusion limits above. No anatomy redraw or additional scaling is justified by the inspected evidence. Any later changed pixels require a changed-artifact review. This result grants no approval to other held normals and does not merge/deploy or modify approval status. Only this evidence directory was written; parent owns commit/bookkeeping and relay handoff.

Final concurrency check: another process advanced worktree HEAD to e8b488bcfe1eae0493cddf7ad7755cda1344a97d during the audit and introduced Naruto/bookkeeping changes. I did not edit or stage them. Final sheet and metadata hashes were rechecked and remain exactly the requested dbf3e0e artifact hashes above. The verdict remains bound to those hashes.
