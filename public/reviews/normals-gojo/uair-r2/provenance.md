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
