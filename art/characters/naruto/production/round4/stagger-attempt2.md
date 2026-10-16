# Naruto stagger v07, round-4 attempt 2 reservation

Reserved before image generation; 2026-10-14.

Call budget before this call: 3 historical + 1 prior round-4 = 4 cumulative. This one explicitly authorized round-4 call makes 5 cumulative and leaves 1 of the 3 round-4 calls unused. Exactly one built-in generation call is authorized; no retry, variants, or regeneration. Next immutable source path: `art/characters/naruto/raw/stagger_v07.png`. Preserve existing versions.

Authorization: Claude's round-2 calibration and the calibrated Astra audit confirmed the residual in the upright collar-to-hem relationship after head/shoe calibration. Preserve the exact four-frame dazed sway and head scale; restore the upright torso proportion to the approved neutral cell. Do not change bodyHeight, sidecars, offsets, hitboxes, packer or public output.

## Inputs and SHA-256

1. Target strip, `art/characters/naruto/raw/stagger_v06.png`: `77B7774AA8E61BE98C15A26E3D2759B3233CC9832D68E059F1C510B0AADD183F`.
2. Approved neutral cell, `public/art-review/title-style-pilot/naruto-neutral_v01.png`: `ACFD7240F9EE7FBE71C1B6C50EA8A269CEEDEB05DE44B929850CA8DE06A0610F`.
3. Approved combat cell, `public/art-review/title-style-pilot/naruto-combat_v01.png`: `CDC6FF9838BBAE102301B738EF7596BE3B2CC8ECB6F24C98D27C02A0BB479751`.
4. Approved idle identity/anatomy reference, `art/characters/naruto/reference/idle_approved.png`: `EEB62E3D8981C168CCC48FFEB847EF8308E267C84F9B3B5E2B29A690D1A15DB3`.

All four input files were visually inspected before generation. Neutral governs the upright collar-to-hem proportion; combat and idle guide anatomy for the posed limbs and identity. No unapproved, historical, or copyrighted source is attached.

## Exact prompt

Use case: identity-preserve. Asset type: four-frame Naruto Shippuden anime fan-art reaction sprite strip for GCD Tourney, art spec v2.

Input images: Image 1 is the exact edit target, the current four-frame stagger v06 strip. Image 2 is the exact user-approved Naruto title-style neutral cell and is the authority for upright torso and body proportions. Image 3 is the exact user-approved title-style combat cell and guides anatomy in posed limbs. Image 4 is the fixed approved idle v07 strip and confirms identity, palette, head and footwear scale. Use no other remembered, historical, or external proportions.

Primary request: redraw the same four dazed stagger poses in the same left-to-right order, preserving the planted foot positions, relaxed hanging arms and hands, slight shoulder hunch, head angle, facial expression, facing and perspective. Correct the upright torso: the back remains essentially straight with only the existing shoulder hunch, so restore the jacket collar-to-hem length and connected waist/hip anatomy to the approved neutral's relationship among head, neck, shoulders, torso and legs. Keep the head the same pixel size as in Image 1 and consistent with Images 2 and 4. Keep the sandals the same size and preserve the visible limb lengths and pose; do not resize the whole figure. Make the torso longer by changing its internal anatomy, not by enlarging the head or footwear. Keep the four figures aligned on their existing common floor line and inside the same four-cell horizontal layout.

Subject: the same approved compact golden-haired, blue-eyed ninja with three cheek marks, black forehead protector and two tails, black-and-orange high-collar jacket, orange trousers, thigh pouch and black open-toed sandals. Preserve face, hair silhouette, outfit design, palette and hard-pixel rendering from the references.

Style and constraints: exact flat #FF00FF background; crisp hard-edged pixel art; no anti-aliasing, blur, gradients, dithering, glow, ground shadow, text, grid, border, extra characters or props. Four complete, separate frames, all body parts inside the image. Preserve the approved title-style anatomy. Do not change pose, head scale, shoe scale, camera, cell layout, crop, or character design; no body-wide scaling.

Tool result: exactly one built-in image generation call completed. Original generated path: `E:\Vibe Coding\.codex\generated_images\01a13b12-5df4-7322-a494-50dbdcf5a961\exec-0c8394b8-d697-422f-ba93-0404721aa26c.png`. Original and saved source SHA-256: `51B9E2717B5BFE448FD1EF53A9DD895AF6157978B2DC284291B0AE9DCD8B9B6B`. Saved unchanged as `art/characters/naruto/raw/stagger_v07.png`. Visual check: four figures, same pose order/layout, floor alignment and apparent head/foot scale; the requested collar-to-hem correction is subtle in this preview and needs the planned Claude/Astra remeasurement. Candidate remains unapproved; no pack, sidecar, bodyHeight, offset, hitbox or public output changed. Budget after this call: 5 cumulative (3 historical + 2 round4), 1 of 3 round4 calls unused.
