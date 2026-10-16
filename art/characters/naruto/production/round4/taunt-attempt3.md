# Naruto taunt v10 round-4 attempt 3 reservation

Reserved before generation on 2026-10-15. Exactly one final round-4 call is authorized for this asset. Call budget before: 3 historical + 2 prior round-4 = 5 cumulative; this is round-4 call 3 of 3, bringing cumulative calls to 6. No retry, variants or regeneration. Next immutable filename: `art/characters/naruto/raw/taunt_v10.png`. Version-history scan covered raw, `_parts`, `_rejected`, `_qa_hold`, REVIEW.md and all Git history; v10 is unused (the unrelated taunt v08 is preserved in `_qa_hold`; correct current source is v09).

## Input files and SHA-256

- Target strip `raw/taunt_v09.png`: `FA32086AF1CF55398F81D840E8AF7EF96EB31FF85BC69CEF840B481CB47967FF`
- Approved neutral `public/art-review/title-style-pilot/naruto-neutral_v01.png`: `ACFD7240F9EE7FBE71C1B6C50EA8A269CEEDEB05DE44B929850CA8DE06A0610F`
- Approved combat `public/art-review/title-style-pilot/naruto-combat_v01.png`: `CDC6FF9838BBAE102301B738EF7596BE3B2CC8ECB6F24C98D27C02A0BB479751`
- Approved idle `reference/idle_approved.png`: `EEB62E3D8981C168CCC48FFEB847EF8308E267C84F9B3B5E2B29A690D1A15DB3`

## Exact prompt

Use case: identity-preserve. Asset type: two-frame Naruto Shippuden anime fan-art taunt sprite strip for GCD Tourney, art spec v2.

Input images: Image 1 is the exact edit target, the current two-frame taunt v09 strip. Image 2 is the user-approved Naruto title-style neutral cell and governs upright body proportions. Image 3 is the user-approved title-style combat cell for posed-limb anatomy. Image 4 is the approved idle strip for identity, head and footwear scale.

Primary request: redraw the same two taunt poses in the same left-to-right order. Preserve the confident closed-mouth grin then open-mouth callout, screen-right pointing arm and hand, other hand at hip, stance, planted foot positions, facing, perspective and timing cues. Keep the head and sandals the same pixel size as Image 1. Correct only the upright torso: from the top of the upright black collar to the jacket hem, make the torso length about 1.3 times the crown-to-chin head height, matching the approved neutral cell's collar-to-hem/head relationship. Preserve the same head size and footwear size; lengthen the internal neck-to-waist/hip anatomy and jacket torso to achieve this proportion. Do not enlarge the head, shoes or whole figure. Keep the back upright with its existing mild turn, not folded into a combat crouch. Keep both figures on the same existing floor line, in the same two-cell horizontal layout, with complete bodies inside the canvas.

Subject and rendering: retain Naruto's approved compact golden-blond hair, blue eyes, three cheek marks, black forehead protector with two tails, black-and-orange high-collar jacket, orange trousers, thigh pouch and black open-toed sandals. Preserve the existing face, hair silhouette, outfit, palette, hard pixel edges and framing.

Constraints: flat exact #FF00FF background; no anti-aliasing, blur, gradients, dithering, glow, floor or shadow, text, grid, border, extra characters or props. Same poses, head size, shoe size, camera, cell layout and character design. No whole-body scaling.

## Tool result

Completed: exactly one built-in imagegen call. Returned original output path: `E:\Vibe Coding\.codex\generated_images\01a14102-1cd6-7b50-804f-631878a54650\exec-b85a4657-0da1-4a7f-be09-bc91afc17a9d.png`. Copied that exact returned file unchanged to `raw/taunt_v10.png`. SHA-256 `A7699B300B2600979E3FE11BB78DDFEDE0FE7F28F918433D6210E19F9180EB7F`; byte count `1403816`. Visual result: two complete figures retaining the grin/callout poses and pointing gesture; candidate remains source-only pending Claude calibration and Astra audit. No retries, pack, calibration, sidecar, offset, hitbox, atlas or approval. Budget after call: 3 historical + 3 of 3 round-4 = 6 cumulative; no round-4 calls remain.
