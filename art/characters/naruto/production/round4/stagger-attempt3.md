# Naruto stagger v08 round-4 attempt 3 reservation

Reserved before generation on 2026-10-15. Exactly one final round-4 call is authorized for this asset. Call budget before: 3 historical + 2 prior round-4 = 5 cumulative; this is round-4 call 3 of 3, bringing cumulative calls to 6. No retry, variants or regeneration. Next immutable filename: `art/characters/naruto/raw/stagger_v08.png`. Version-history scan covered raw, `_parts`, `_rejected`, `_qa_hold`, REVIEW.md and all Git history; v08 is unused.

## Input files and SHA-256

- Target strip `raw/stagger_v07.png`: `51B9E2717B5BFE448FD1EF53A9DD895AF6157978B2DC284291B0AE9DCD8B9B6B`
- Approved neutral `public/art-review/title-style-pilot/naruto-neutral_v01.png`: `ACFD7240F9EE7FBE71C1B6C50EA8A269CEEDEB05DE44B929850CA8DE06A0610F`
- Approved combat `public/art-review/title-style-pilot/naruto-combat_v01.png`: `CDC6FF9838BBAE102301B738EF7596BE3B2CC8ECB6F24C98D27C02A0BB479751`
- Approved idle `reference/idle_approved.png`: `EEB62E3D8981C168CCC48FFEB847EF8308E267C84F9B3B5E2B29A690D1A15DB3`

## Exact prompt

Use case: identity-preserve. Asset type: four-frame Naruto Shippuden anime fan-art reaction sprite strip for GCD Tourney, art spec v2.

Input images: Image 1 is the exact edit target, the current four-frame stagger v07 strip. Image 2 is the user-approved Naruto title-style neutral cell and governs upright body proportions. Image 3 is the user-approved title-style combat cell for posed-limb anatomy. Image 4 is the approved idle strip for identity, head and footwear scale.

Primary request: redraw the same four dazed stagger poses in the same left-to-right order, preserving planted foot positions, relaxed hanging arms and hands, slight shoulder hunch, head angle, expression, facing, perspective and timing cues. Keep the head and sandals the same pixel size as Image 1. Correct only the upright torso: from the top of the upright black collar to the jacket hem, make the torso length about 1.3 times the crown-to-chin head height, matching the approved neutral cell's collar-to-hem/head relationship. Preserve the same head size and footwear size; lengthen the internal neck-to-waist/hip anatomy and jacket torso to achieve this proportion. Do not enlarge the head, shoes or whole figure. Keep the torso upright with only the existing shoulder hunch; do not turn the pose into a crouch or lean. Keep all four characters on the same existing floor line, in the same four-cell horizontal layout, with complete bodies inside the canvas.

Subject and rendering: retain Naruto's approved compact golden-blond hair, blue eyes, three cheek marks, black forehead protector with two tails, black-and-orange high-collar jacket, orange trousers, thigh pouch and black open-toed sandals. Preserve the existing face, hair silhouette, outfit, palette, hard pixel edges and framing.

Constraints: flat exact #FF00FF background; no anti-aliasing, blur, gradients, dithering, glow, floor or shadow, text, grid, border, extra characters or props. Same poses, head size, shoe size, camera, cell layout and character design. No whole-body scaling.

## Tool result

Completed: exactly one built-in imagegen call. Returned original output path: `E:\Vibe Coding\.codex\generated_images\01a14102-1cd6-7b50-804f-631878a54650\exec-6618c8f0-444f-414e-9f83-1ec30ed6bfeb.png`. Copied that exact returned file unchanged to `raw/stagger_v08.png`. SHA-256 `BE43BF84A100D4B4E0E03EB794B48D941291F426ADA8630F291F4B5DD6F11AC7`; byte count `1500203`. Visual result: four complete figures in the same pose order and layout; candidate remains source-only pending Claude calibration and Astra audit. No retries, pack, calibration, sidecar, offset, hitbox, atlas or approval. Budget after call: 3 historical + 3 of 3 round-4 = 6 cumulative; no round-4 calls remain.
