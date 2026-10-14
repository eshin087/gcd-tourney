# Naruto win v09, round-4 attempt 2 reservation

Reserved before image generation; 2026-10-14.

Call budget: 3 historical calls + 1 prior round-4 call + this one authorized round-4 call = 5 total; 1 of 3 round-4 calls remains afterward. This is exactly one built-in image generation call. Do not retry, regenerate, or produce variants. The selected output, if usable, will be saved once as `art/characters/naruto/raw/win_v09.png`. No existing version may be overwritten.

Authorization: Astra confirmed robust residual in calibrated win08: each win torso is upright with minimal side lean; f0 collar-to-hem is 36.1 px versus approved neutral 50.4 px. Conservative intervals do not overlap the ±6% gate (win max 40 / neutral min 48 = .833, below .94). Coordinator authorized exactly one redraw.

## Inputs and hashes

1. Edit target: `art/characters/naruto/raw/win_v08.png` — SHA-256 `61B39B5D3FCB7EDC217BBA99453A10AF5777DAB5369F85A4667599CED63A39DA`.
2. Approved title-style neutral cell: `public/art-review/title-style-pilot/naruto-neutral_v01.png` — SHA-256 `ACFD7240F9EE7FBE71C1B6C50EA8A269CEEDEB05DE44B929850CA8DE06A0610F`.
3. Approved title-style combat cell: `public/art-review/title-style-pilot/naruto-combat_v01.png` — SHA-256 `CDC6FF9838BBAE102301B738EF7596BE3B2CC8ECB6F24C98D27C02A0BB479751`.
4. Fixed approved idle identity/anatomy reference: `art/characters/naruto/reference/idle_approved.png` — SHA-256 `EEB62E3D8981C168CCC48FFEB847EF8308E267C84F9B3B5E2B29A690D1A15DB3`.

All four files were visually inspected before generation. No historical model sheet is attached.

## Exact prompt

Use case: identity-preserve. Asset type: four-frame Naruto Shippuden anime fan-art victory animation sprite strip for GCD Tourney, art spec v2.

Input images: Image 1 is the edit target, the current four-pose win v08 strip. Image 2 is the exact approved Naruto title-style neutral cell and governs upright body anatomy. Image 3 is the exact approved title-style combat cell and governs the same character's anatomy during dynamic poses. Image 4 is the approved fixed idle v07 and confirms current face, hair, clothing, colors and scale. Treat Images 2–4 as the sole anatomy and identity authorities; do not use any other remembered or historical Naruto proportions.

Subject: exactly one Naruto in each of four poses, with approved compact golden hair spikes, blue eyes, three cheek whisker marks, leaf steel forehead plate on a black headband with two tails, orange-and-black jacket, orange trousers, thigh pouch and black open-toed sandals. Preserve the exact approved identity, palette, hard-pixel outline and flat cel shading.

Primary request: redraw the same four win poses and sequence from Image 1 while correcting the body anatomy to match Images 2–4. Preserve the existing head identity, hair silhouette and approved head scale. Each win pose is upright with only a small side lean: restore the jacket torso's collar-to-hem length and the connected body proportions to the approved neutral's anatomy. Match the neutral and idle relationships among head, neck, shoulders, torso, waist, arms, legs and sandals; use the combat reference to keep limb lengths coherent when posed. The approved reference anatomy controls proportions. The torso must lengthen as needed to match the reference body; do not set a percentage target or derive one from the interim measurement.

Preserve the exact four-pose action from Image 1: first, relaxed smile with one fist near chest and the other down; second, joyful open-mouth cheer with one fist raised; third, same raised-fist cheer settling into a smile; fourth, confident smile with the other fist raised. Keep the same order, gestures, facing, perspective, and broadly the same foot placement. Maintain natural limb lengths and the approved shoe scale across poses.

Composition: four complete, clearly separated full-body poses in one horizontal row, facing screen-right in three-quarter view, with broad magenta gutters and outer margins. Flat solid `#FF00FF` background. Keep every figure inside the canvas and do not crop, overlap, add motion effects, duplicate figures, or change the cell/canvas framing to disguise proportions.

Style: crisp pixel-art fan-art sprite, hard pixel edges and flat cel-shaded color bands; no anti-aliasing, blur, gradients, dithering, glow, ground shadow, text, labels, grids, extra characters or props.

Constraints: preserve identity and the four win actions; correct the upright torso and connected anatomy to the exact approved title-style references. Do not shrink the whole character, head, shoes, or canvas bounds. Do not compress the body to fit a bounding-box or use historical model-sheet proportions. Pose changes may alter occupied silhouette, never the character's underlying anatomy. No new design elements.

Tool result: one built-in call completed, producing one four-pose strip. Original generated path: `E:\Vibe Coding\.codex\generated_images\01a138f3-10c4-7151-a6a3-0461c4717979\exec-2a408eb7-c8dd-4a38-bea0-f137ff2795e6.png`. SHA-256: `17AB6249B1447148BEBDEDFDFEC425A0BDB4A051DCC3046E383D66002D1FB23D`. Saved unchanged to `art/characters/naruto/raw/win_v09.png`; saved file SHA-256 matches. Candidate awaits Claude calibration and technical review. No pack, sidecar, bodyHeight, offset, hitbox or production atlas changes were made.
