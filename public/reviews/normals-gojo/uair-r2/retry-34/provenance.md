# Gojo uair fresh generation round (2026-10-18)

ENG-112 helper authorization: one fresh round, maximum three built-in image-generation calls. Historical v01 and earlier held attempts were left unchanged. No candidate met the framing and pose constraints, so no `raw/uair_vNN.png` was selected; these two available outputs are QA holds.

## Call 1 — generated, source path not captured

The first call completed, but the wrapper emitted neither the image nor `output_hint`. Its source path is unavailable. Per provenance rules, it was not recovered by searching generated-image folders and was not copied or selected. References: approved Gojo `reference/model_sheet.png` and `reference/idle_approved.png`.

Prompt:

> Use case: stylized-concept
> Asset type: six-frame horizontal anime fan-art fighting-game sprite strip, intended to be cut into six equal 256×256 cells
> Input images: Image 1 is the approved Gojo model sheet and locks identity, outfit, palette, and adult proportions. Image 2 is the approved idle strip and locks the exact head, torso, limb, clothing volume, and overall body scale. Treat both as identity and proportion references.
> Primary request: Draw exactly six sequential frames of Gojo's upward aerial kick (uair), a clear, powerful straight-up kick over his head. The leg must visibly extend vertically so the raised shoe reaches above opponent-head height, while staying below Gojo's own white-hair top. The kick should read as a deliberate aerial attack with a compact chamber, then controlled retraction and air-neutral finish.
> Subject: Satoru Gojo, tall athletic adult man, compact approved head with black blindfold and spiky white hair; high-collar dark navy jacket, matching trousers and black shoes. Preserve the approved model and idle proportions exactly; pose the body, never shrink or stretch it to fit.
> Style/medium: crisp high-resolution pixel-art sprite, serious modern shonen anime fan-art, 3/4 view facing screen-right, clean hard pixel clusters and flat cel-shaded color blocks.
> Composition/framing: one row of exactly six distinct, evenly spaced frames, left to right in order: f0-f1 airborne chamber/preparation, f2-f3 maximum vertical kick with the near leg striking straight up over the head, f4 leg retracts, f5 air-neutral recovery. Each frame occupies one square cell equivalent to 256×256. Keep every part of hair, body, raised leg and shoe safely inside its own cell with generous magenta margin; no clipping, cropping, overlap between cells, or text. Keep consistent apparent figure scale across all six cells. The main kick motion should be clear without excessive torso travel.
> Hands/pocket schedule: both hands visibly out for frames 0 through 4 as natural balance arms; frame 5 returns both hands to trouser pockets with wrists hidden below the jacket hem and elbows relaxed, matching Gojo's pocketed idle. Do not let a hand enter a pocket before frame 5.
> Color palette: match the references, especially white hair, black blindfold, dark navy suit and pale skin. Use flat pure magenta #FF00FF behind every frame.
> Constraints: six frames only; one character only; facing right in every frame; hard pixel edges with no anti-aliasing, blur, gradients, glow, speed effects, shadows beyond the sprite, or dithering fills. No labels, borders, grid lines or extra decorative elements. Keep the entire figure comfortably inside each cell.

## Call 2 — held

Source: `E:\Vibe Coding\.codex\generated_images\01a150f5-2ad8-77e3-b066-8893f48ed4d7\exec-a8b7a830-3068-4d1c-afce-c2816fdffbbc.png`
Copy: `uair_fresh_call02_hold.png`
SHA-256: `BE2766581FD0806A33B6C0C7F9678E71CFF364E1886396FF4EC3716F1F6B85EF`
Dimensions: 2172×724.
Finding: six distinct kick/recovery frames; hands are out through f4 and pocketed at f5. The f2-f3 shoe rises well above Gojo's own hair top. The long figures exceed the implied 256-square cell height, so this does not meet the required cell framing.

Exact prompt:

> Use case: stylized-concept. Asset: exactly six sequential sprite frames as one horizontal strip, cut into six equal 256×256 cells. Image 1 is approved Gojo model-sheet identity/outfit/palette reference; Image 2 is approved idle reference locking the compact head and exact adult body proportions/scale. Draw only Gojo, a tall athletic adult man in a dark navy high-collar jacket and trousers, black blindfold, spiky white hair, black shoes. Match those references exactly in pixel density, head size, torso, limbs, build and clothing volume.
>
> Create Gojo's upward aerial kick (uair), clearly a powerful straight-up kick over his head. Six frames left to right: f0-f1 airborne chamber; f2-f3 near leg extends vertically and shoe strikes above opponent-head height but remains below his own hair top; f4 retracts; f5 air-neutral recovery. Pose the body; never resize him. Keep his apparent scale stable.
>
> Gojo faces screen-right in a 3/4 view in every frame. Both hands are out for balance on f0-f4. On f5 both hands return to trouser pockets with wrists hidden below jacket hem and elbows relaxed, matching the approved idle. Do not pocket either hand earlier.
>
> Each frame fills one square 256×256 cell equivalent, with the entire hair, body, raised leg and shoes well inside its own cell and generous pure-magenta #FF00FF margin. No cropping, clipping, overlap between cells, extra frames, text or borders. Crisp hard pixel clusters, limited flat cel-shaded colors matching the references; no antialiasing, blur, gradients, glow, effects or dithering.

## Call 3 — held

Source: `E:\Vibe Coding\.codex\generated_images\01a150f5-2ad8-77e3-b066-8893f48ed4d7\exec-b2fbe6cb-08dc-4f9b-8023-98d17f944f2b.png`
Copy: `uair_fresh_call03_hold.png`
SHA-256: `F5AFC40AA8306350DEFB576838B44941275A958549260B9414C7D568E0F202EC`
Dimensions: 2172×724.
Finding: six distinct sequential frames and correct f5 pocket finish. The f2-f3 shoe still rises above the hair top, and the full poses exceed a square cell's height. Not selected.

Exact prompt:

> Use case: stylized-concept. Asset: Gojo six-frame horizontal fighting-game sprite strip. Reference roles: Image 1 approved Gojo model identity/outfit/palette; Image 2 approved idle exact adult proportions and body scale.
>
> Draw one row of EXACTLY six sequential depictions of the same Gojo, facing screen-right in a 3/4 view, all in consistent scale. Each frame is designed for one square 256×256 cell. Since the full strip is wide, center each entire pose inside its own imaginary square cell with generous pure-magenta margins; keep the full figure within a compact square area, never let shoes, hair, arms, or limbs cross cell edges. Do not make tall rectangular poses or enlarge the figures to fill the strip.
>
> Gojo is the tall athletic adult man from the references: compact approved head with black blindfold and spiky white hair; high-collar dark navy jacket, matching trousers, black shoes. Preserve his approved head size, body proportions, clothing volume, and figure scale.
>
> Six clear kick phases, left to right: f0-f1 airborne chamber; f2-f3 near leg kicks straight up, reaching above opponent-head height but the raised shoe stays BELOW the top of Gojo's own white hair; f4 retracts; f5 settles into air-neutral. The kick remains readable and compact enough to keep the whole figure inside each square cell. Both hands are out as balance arms on frames 0-4. On frame 5 both hands are in trouser pockets with wrists hidden below jacket hem and relaxed elbows, matching the approved idle.
>
> Hard pixel-art edges with crisp flat color clusters; match the reference palette. Pure flat #FF00FF background. No antialiasing, soft shading, blur, gradients, glow, effects, text, labels, borders, grid, cropping, overlap, or extra characters. Exactly six frames in a single row.

## Outcome

Fresh-round generation calls completed: 3 (maximum authorized). No compliant candidate. Old v01 and prior `_qa_hold` files remain unchanged. No manifest, tracker, review, or packer files changed; no commit made.

## Up-forward round — Call 1 held

Source: `E:\Vibe Coding\.codex\generated_images\01a15112-3502-7f81-93d4-96495f48f1d4\exec-048da5eb-7ba0-44b4-a695-665c45ac72db.png`
Copy: `uair_upforward_call01_hold.png`
SHA-256: `C0925F222122007E8633AFFD934F501EDB108F7E0DE61B3DB00717A6F4BFDF80`
Dimensions: 2172x724.
Finding: exactly six separated poses, readable up-and-forward diagonal kick, approved blindfolded outfit, and hands out f0-f4 / pocketed f5. Raised shoe is roughly one head above the hairline. The figures span over 400 px vertically in the 2172x724 output, preventing safe separation into six square 362x362 regions while preserving full anatomy; not structurally viable as a six-cell strip.

Exact prompt:

> Generate one six-frame horizontal pixel-art sprite strip for Gojo's uair, using the two reference images as identity, outfit, palette, exact proportions and scale. Image 1 is the approved model sheet. Image 2 is the approved idle, locking his compact head, body build and pixel density. Draw only Gojo, a tall athletic adult man in the dark navy high-collar jacket and trousers, black blindfold, spiky white hair and black shoes; facing screen-right in a 3/4 view.
>
> Exactly six distinct, sequential poses left to right, designed as six equal square 256x256 sprite cells with clear magenta gaps between poses: f0-f1 airborne chamber, f2-f3 active up-and-forward diagonal aerial kick like his up smash (near leg and shoe strike diagonally toward the upper-right, not vertical; clear forward reach), f4 retracting, f5 airborne neutral finish. Preserve anatomy and figure scale across all poses. Keep the complete silhouette comfortably inside its own square cell. The highest point of the raised shoe must be no more than approximately one head-height above the top of Gojo's hair. Do not scale or squash the figure to fit. Both hands are out and balancing for f0-f4; on f5 both hands return fully into trouser pockets, wrists hidden below jacket hem, elbows loose, matching the approved idle. No hands pocketed before f5.
>
> Use crisp hard pixel clusters, flat cel shading, reference-matched limited colors, pure flat #FF00FF background. No antialiasing, blur, gradients, glow, effects, shadows beyond the sprite, speed lines, text, labels, borders, grid, crop, overlap, or extra figures. Ensure exactly six widely separated poses with visible magenta gaps.

## Up-forward round — Call 2 held

Source: `E:\Vibe Coding\.codex\generated_images\01a15112-3502-7f81-93d4-96495f48f1d4\exec-6d9abe1a-b911-4100-8d62-2ab0919f3348.png`
Copy: `uair_upforward_call02_hold.png`
SHA-256: `ED652468285FD7C58EE2204DFA11309452C19384F5CCD332F74DBB8D9B19F5BD`
Dimensions: 2172x724.
Finding: diagonal kick, six distinct poses, consistent proportions and f5 pocket finish. Figures are too wide for their implied 362px square cells: component bounds touch/clip cell boundaries in f0-f5, eliminating the required clear magenta gaps; not selected.

Exact prompt:

> Create one horizontal strip of exactly six Gojo pixel-art fighting animation frames, with the two reference images as strict identity and anatomy locks. Image 1 approved model sheet; image 2 approved idle. Preserve Gojo's exact compact head, adult body proportions, clothing volume, palette, blindfold, white hair, dark navy uniform, black shoes, and screen-right 3/4 facing.
>
> CRITICAL FRAME GEOMETRY: The output must be a single very wide horizontal strip with six equal square frame areas in one row. Each pose must fit entirely inside a square frame whose height equals its width. Leave substantial blank pure-magenta space above and below each pose. Do not use tall rectangular pose areas. Keep each full figure silhouette under 330 pixels tall relative to a 362-pixel square frame, without changing head/body proportions: angle and fold the body into a compact airborne shape instead of standing vertically. Maintain clear empty magenta gutters between every figure.
>
> Six distinct sequential frames: f0 airborne compact chamber; f1 load; f2-f3 active, decisive UP-AND-FORWARD diagonal aerial kick like Gojo's up smash, near leg and black shoe thrust toward upper-right at about 45 degrees, extending in front of his torso; f4 retracts; f5 air-neutral finish. The f2-f3 raised shoe tip is at most about one of Gojo's own head-heights above the top of his white hair. The kick must read as a strong forward/upward strike, not straight vertical and not a side kick. Hands are visibly out as balance arms on frames 0-4. Both hands are pocketed with wrists hidden and loose elbows only on f5.
>
> Crisp hard pixel art, consistent scale across all frames, pure flat #FF00FF background. No effects, speed lines, shadows outside figures, blur, gradients, antialiasing, dithering, text, labels, borders, overlap, crop or extra characters. Exactly six poses, one row.

## Up-forward round — Call 3 held

Source: `E:\Vibe Coding\.codex\generated_images\01a15112-3502-7f81-93d4-96495f48f1d4\exec-357892a6-10cb-4ea2-a966-be2bbe6586dc.png`
Copy: `uair_upforward_call03_hold.png`
SHA-256: `E72BD190248A78A30FAF284114E3458A63D755B24CE4ED46B12FF55F7FE1F232`
Dimensions: 1827x861.
Finding: good distinct up-forward diagonal attack, shoe is within about one head above hair, and the f5 pocket finish is correct. But poses exceed the implied 304px frame width and height (silhouette extents ~253-304px wide by 363-439px high), so they cannot fit isolated square cells with safe margins. Not selected.

Exact prompt:

> Draw exactly six sequential anime fan-art pixel sprite frames for Gojo's uair, in one horizontal row. Image 1 is the approved Gojo model identity/outfit/palette reference. Image 2 is the approved idle, exact head and adult anatomy scale reference. Keep the blindfold, white hair, dark navy high-collar jacket and trousers, black shoes, facing screen-right in 3/4 view. Match body proportions and clothing volume exactly.
>
> LAYOUT IS CRITICAL: six equal square frame cells in one row, each cell 362 pixels wide by 362 pixels tall in the intended strip. Every complete pose must remain within the middle 250 pixels of its cell width, leaving at least 55 pixels of flat pure-magenta clearance on both left and right sides of every cell. Keep all six figures individually separated by broad visible magenta gaps. Do not spread hands or feet sideways to cell edges. Every full pose must be less than 330 pixels high, contained in the middle of its square area, with ample flat magenta above and below. Do not resize body parts or change anatomy.
>
> Pose sequence: f0 compact airborne chamber, f1 load; f2 and f3 unmistakable up-and-forward diagonal aerial kick like an up smash, body leaning diagonally forward and the near leg/black shoe driving up-right at about 45 degrees; f4 controlled retraction; f5 relaxed air-neutral pose with BOTH hands hidden in trouser pockets, wrists under jacket hem. Both hands are out for balance during f0-f4. Raised shoe tip may be no more than about one of Gojo's head-heights above his hair crown. This is a diagonal forward/up kick, never straight vertical.
>
> High-contrast crisp hard pixel clusters with limited flat colors, pure flat #FF00FF background. No blur, antialiasing, gradient, glow, aura, effects, speed lines, text, borders, grid, other characters, crop or overlap. Exactly six poses.

## Round outcome

All three authorized calls were used. No candidate met the square-cell framing and clearance limits while preserving the approved body proportions. No raw `uair_v03.png` was selected. All three outputs are preserved as holds. Prior candidates remain untouched.
