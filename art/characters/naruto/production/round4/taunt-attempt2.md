# Naruto taunt v09, round-4 attempt 2 reservation

Reserved before image generation; 2026-10-14.

Call budget before this call: 3 historical + 1 prior round-4 = 4 cumulative. This one explicitly authorized round-4 call makes 5 cumulative and leaves 1 of the 3 round-4 calls unused. Exactly one built-in generation call completed; no retry, variants, or regeneration. The initially reserved v08 path was occupied by a misfiled unrelated-worker image, so this call's correct immutable source is `art/characters/naruto/raw/taunt_v09.png`. Preserve both version records.

Authorization: Claude's round-2 calibration and the calibrated Astra audit confirmed the residual in the upright collar-to-hem relationship after head/shoe calibration. Preserve the exact two-frame point/callout and head scale; restore the upright torso proportion to the approved neutral cell. Do not change bodyHeight, sidecars, offsets, hitboxes, packer or public output.

## Inputs and SHA-256

1. Target strip, `art/characters/naruto/raw/taunt_v07.png`: `9A8C014D73394DC9161D4AD43F59158AD0B3D583ACEC9393EF08631C2C3FD35F`.
2. Approved neutral cell, `public/art-review/title-style-pilot/naruto-neutral_v01.png`: `ACFD7240F9EE7FBE71C1B6C50EA8A269CEEDEB05DE44B929850CA8DE06A0610F`.
3. Approved combat cell, `public/art-review/title-style-pilot/naruto-combat_v01.png`: `CDC6FF9838BBAE102301B738EF7596BE3B2CC8ECB6F24C98D27C02A0BB479751`.
4. Approved idle identity/anatomy reference, `art/characters/naruto/reference/idle_approved.png`: `EEB62E3D8981C168CCC48FFEB847EF8308E267C84F9B3B5E2B29A690D1A15DB3`.

All four input files were visually inspected before generation. Neutral governs the upright collar-to-hem proportion; combat and idle guide anatomy for the posed limbs and identity. No unapproved, historical, or copyrighted source is attached.

## Exact prompt

Use case: identity-preserve. Asset type: two-frame Naruto Shippuden anime fan-art taunt sprite strip for GCD Tourney, art spec v2.

Input images: Image 1 is the exact edit target, the current two-frame taunt v07 strip. Image 2 is the exact user-approved Naruto title-style neutral cell and is the authority for upright torso and body proportions. Image 3 is the exact user-approved title-style combat cell and guides anatomy in posed limbs. Image 4 is the fixed approved idle v07 strip and confirms identity, palette, head and footwear scale. Use no other remembered, historical, or external proportions.

Primary request: redraw the same two taunt poses in the same left-to-right order. Preserve the confident expression (closed-mouth grin, then open-mouth callout), the screen-right pointing arm and hand, the other hand at the hip, the stance and planted feet, facing, perspective and general silhouette. Correct the upright torso: restore the jacket collar-to-hem length and connected waist/hip anatomy to the approved neutral's relationship among head, neck, shoulders, torso and legs. This is an upright point with a mild side turn, not a combat crouch. Keep the head the same pixel size as in Image 1 and consistent with Images 2 and 4. Keep the sandals the same size and preserve the visible limb lengths and gesture; do not resize the whole figure. Make the torso longer by changing its internal anatomy, not by enlarging the head or footwear. Keep both figures aligned on their existing common floor line and inside the same two-cell horizontal layout.

Subject: the same approved compact golden-haired, blue-eyed ninja with three cheek marks, black forehead protector and two tails, black-and-orange high-collar jacket, orange trousers, thigh pouch and black open-toed sandals. Preserve face, hair silhouette, outfit design, palette and hard-pixel rendering from the references.

Style and constraints: exact flat #FF00FF background; crisp hard-edged pixel art; no anti-aliasing, blur, gradients, dithering, glow, ground shadow, text, grid, border, extra characters or props. Two complete, separate frames, all body parts inside the image. Preserve the approved title-style anatomy. Do not change pose, head scale, shoe scale, camera, cell layout, crop, or character design; no body-wide scaling.

Tool result: exactly one built-in image generation call completed. Task-local original generated path: `E:\Vibe Coding\.codex\generated_images\01a13b12-5df4-7322-a494-50dbdcf5a961\exec-7144ede8-ce8f-41b6-a335-a3f72cb75ba1.png` (timestamp 08:44:40); SHA-256 `FA32086AF1CF55398F81D840E8AF7EF96EB31FF85BC69CEF840B481CB47967FF`. Root visually confirmed this is the correct two-figure pointing/callout output. Saved unchanged as `art/characters/naruto/raw/taunt_v09.png`, with the same SHA-256. A different worker's four-frame chest-kick image was mistakenly copied to v08 from global latest output; it was not this call's result. Its bytes are preserved at `art/characters/naruto/raw/_qa_hold/taunt_v08.png`, SHA-256 `C95B19C4D375EA10F5AE9AA07C40FA34334A4C55ED822A5BE48B7BBCEA510569`, and it is excluded from this call's provenance and pose assessment. The actual v09 keeps the requested point/callout poses; torso proportion still needs Claude calibration and Astra measurement. No retry authorized. No pack, sidecar, bodyHeight, offset, hitbox or public output changed. Budget after this call: 5 cumulative (3 historical + 2 round4), 1 of 3 round4 calls unused.
