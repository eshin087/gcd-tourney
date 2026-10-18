# Sasuke skills revamp batch 2 image provenance

Date: 2026-10-18
Worktree branch: `art/sasuke-skills`
Scope: A6 `amaterasu`, A7 `amaterasuIgnite`. No identity references supplied.
The user approved the initially selected v01 drawings via Claude relay skills #16, with no pixel cleanup. User quote: “Approve both v01 (Recommended): Approve amaterasu v01 and amaterasuIgnite v01 as they pack; I put them in the game and Codex moves on to the Kirin batch.” The v01 files were restored from `_qa_hold/` to `art/vfx/raw/`; manifest records them as approved HD candidates. Claude's trial pack split each source grid and keyed/quantized near-magenta cleanly. The nonselected/final attempts remain quarantined, preserving the call history. Claude owns final HD packing and game integration.

## A6 `amaterasu`

Initial visual selection: `amaterasu_attempt02.png` -> `art/vfx/raw/_qa_hold/amaterasu_v01.png` (moved to hold after the final attempt failed layout/background/palette requirements)
Imagegen output identifier: `urn:c2pa:18bf813a-d0c8-4ad1-a805-33eec42c9192`
Source dimensions: 1774 x 887 px, RGB. Source SHA-256: `35b932fa8873e92d8558f3c89e0d44cd9241cda8f1423d2ecd3cbd8aac476f9f`
Calls: 2/3. No references attached.

Attempt 1 was an initial horizontal-strip generation. Its data URL was returned transiently but was not saved; the output cannot be recovered from this session. The available PNG header indicated 2172 x 724 px. Its output ID and hash are unavailable. It is not represented as a preserved candidate; this provenance entry records the loss explicitly.

Attempt 1 exact prompt:
> Create one clean horizontal sprite strip of exactly 8 sequential 256×256 pixel-art frames, 2048×256 overall, for a game VFX named Amaterasu. Effects only, no people, no text, no labels, no border. Flat exact #FF00FF background in every frame. Hard-edged pixel art, crisp nearest-neighbor pixels, no anti-aliasing, blur, gradients, noise, or glow. Use only this palette: #000000, #07040A, #140A14, #22101C, #3A0E1E, #5C1226 (thin inner rims only), and at most a few pixels of #8A1A30 per frame. Absolutely no purple and no orange. Each cell has bottom anchor at y=240. Draw tall licking tongues of pure black and near-black flames forming a vertical blaze about 130 px wide and 215 px tall, base on y=240. Leave about one third of the flame area open as gaps between tongues so an underlying body remains visible; tongues are densest at the bottom. Thin dark crimson inner rims only where tongues overlap or along selected edges. Add only a few 2–3 px black embers above the tips. Eight adjacent animation frames f0 through f7, each flame silhouette changes subtly as tongues rise and curl, with a seamless cyclic transition from f7 back to f0. Preserve identical overall bounds, baseline and style across frames. No characters, no clothing, no props.

Attempt 2 exact prompt (selected):
> Create a pixel-art VFX sprite sheet ONLY: exactly 8 equal square frames in a strict 4 columns × 2 rows grid, no gutters, no labels, no margins; each cell 256×256 (total 1024×512). Every cell has flat #FF00FF background. Effects only, absolutely no characters, figures, silhouettes, text, borders. Amaterasu: tall black flame tongues clinging upward, about 130 px wide by 215 px high within each cell, bottom anchored at y=240. Tongues pure black and near-black, densest at the base, separated by open gaps occupying about one third of the shape. A few 2–3 px black embers rise from tips. Thin dark crimson inner rims only at select overlaps. Exact restricted palette: #000000 #07040A #140A14 #22101C #3A0E1E #5C1226 (rim only) and a few pixels #8A1A30 maximum per frame. No purple, no orange, no glow. Crisp hard-edged pixel art, no antialiasing, blur, gradients, dithering or noise. Eight animation poses advance left to right across top row then left to right across bottom row, subtle upward licking motion; the eighth loops into the first. Preserve frame footprints aligned and consistent. Do not depict fire as red/orange: it is black flame.

Visual verdict: eight dark flame poses read as a clinging blaze, with gaps, a bottom mass, and subtle movement. Technical verdict: HOLD. The output is a 1774×887 RGB grid rather than an exact 256px-per-cell sheet; sampled background is near-magenta rather than exact #FF00FF; source contains 50,978 distinct RGB colors, so strict palette compliance is not demonstrated. Packer/QA was intentionally not run by task scope. User/design approval is still required.

## A7 `amaterasuIgnite`

Initial visual selection: `amaterasuIgnite_attempt02.png` -> `art/vfx/raw/_qa_hold/amaterasuIgnite_v01.png` (moved to hold after the final attempt failed layout/background/palette requirements)
Imagegen output identifier: `urn:c2pa:feecb7a1-37fb-472e-af0f-845b3b7ab868`
Source dimensions: 1536 x 1024 px, RGB. Source SHA-256: `2e2d716d95b6278c7b7f0e30b291e45701f607613b0c94ad7f6a157864825743`
Calls: 2/3. No references attached.

Attempt 1 exact prompt (nonselected, preserved at `art/vfx/raw/_qa_hold/amaterasuIgnite_attempt01.png` and in this production folder):
> Generate a horizontal pixel-art VFX sprite sheet with exactly 6 equal square frames in a strict 3 columns × 2 rows grid, no gutters, no labels, no margins; each cell 256×256 (total 768×512). Every cell flat exact #FF00FF background. Effects only, no people or silhouettes. AmaterasuIgnite: a black flame ignition burst, six sequential frames. f0: tiny black point at center with a thin dark crimson ring about 30 px across. f1: black flames erupt in an outward-pointing burst about 120 px across. f2: burst about 200 px across, the tongues curling upward. f3: full burst about 240 px across, lower half settling into upward flames. f4–f5: outer tongues break into small black embers; central flame mass becomes the base of an upward blaze for crossfade into the looping Amaterasu effect. Exact restricted palette only: #000000, #07040A, #140A14, #22101C, #3A0E1E, #5C1226 used only as thin inner rims, and at most a few pixels of #8A1A30 per frame. No purple, no orange, no other colors except #FF00FF background. Hard-edged crisp pixel art, no antialiasing, blur, gradients, dithering, noise or glow. Keep all frames centered and precisely aligned, progression must be visually readable.
Output ID: `urn:c2pa:f38f853c-57ce-416d-a507-25a32ad79c99`. Dimensions: 1536 x 1024 px. SHA-256: `f0442cdfad1d81d00a5708b28b2465a1225ff85e4b79b3c1257899f058bfed21`.

Attempt 2 exact prompt (selected):
> Create an effects-only hard-pixel-art sprite sheet, exactly 6 sequential frames in a 3-column × 2-row grid, each square frame same size and centered. Flat uniform #FF00FF background. For game effect AmaterasuIgnite: f0 small black point with a very thin dark crimson ring about 30px; f1 erupts into an outward-pointing black flame burst about 120px; f2 about 200px with flame tongues beginning to curl upward; f3 about 240px, lower half settling into upward flames; f4-f5 outer tongues fragment into tiny black embers while the center becomes the base of an upward blaze. Strict palette: background #FF00FF; flame pixels only #000000, #07040A, #140A14, #22101C, #3A0E1E; extremely sparse thin rims only #5C1226 and no more than 3 pixels of #8A1A30 per frame. No other colors. Crimson must be a tiny edge accent only, never fill large regions. No purple, pink within the effect, orange, yellow, white, smoke, glow, shadows, gradients, noise, dithering, blur, anti-aliasing, texture or soft edges. Use discrete flat pixel clusters and crisp stepped contours. No people, body, clothing, text, labels, borders or frame separators. Show all six phases clearly and keep centers aligned.

Attempt 1 nonselected reason: the burst progresses legibly, but the crimson regions are too prominent relative to the requested thin rims; selected attempt 2 reduces the crimson usage.
Visual verdict: selected frames read as ignition point, outward burst, upward curling flames, and the start of a sustained blaze with embers. Technical verdict: HOLD. Source is 1536×1024 RGB, not a normalized 256px-per-cell strip; sampled background is near-magenta rather than exact #FF00FF; source contains 63,536 distinct RGB colors, so strict palette compliance is not demonstrated. Packer/QA was intentionally not run by task scope. User/design approval is still required.

## Files and selection

The initial v01 files are now quarantined under `art/vfx/raw/_qa_hold/`; no Amaterasu candidate is packer-visible.
Nonselected A7 attempt 1 is under `_qa_hold` with an unversioned attempt name; it will not be selected as the latest `_vNN` source. Attempt images are kept in this production folder as well. No candidate is approved or packed. The decision gallery is `public/reviews/sasuke-skills-batch2/index.html`; both v01s are quarantined and no current candidate is packer-visible.

## Final correction calls (attempt 03/3 per asset)

These were image edits referencing only the corresponding v01 raw candidate. The outputs are preserved under `art/characters/sasuke/production/skills-revamp-batch2/` and held in `art/vfx/raw/_qa_hold/` as version-named files. Neither became a packer-visible v02; their v01 predecessors have also been moved under `_qa_hold/`.

### A6 `amaterasu`, attempt 03

Output: `amaterasu_attempt03.png` -> `art/vfx/raw/_qa_hold/amaterasu_v02.png`
Imagegen output ID: `urn:c2pa:a6249a15-c159-4e01-a101-89fb786692f3`
Dimensions: 1774 x 887 px, RGB. Distinct RGB values: 42,870. SHA-256: `66750b31d260e6a7a07778e7cf7d7695437f1197a0e81df26b33b5d200fe56da`.
Calls: 3/3 total.

Exact prompt:
> Correct this sprite sheet and redraw as ONE SINGLE HORIZONTAL ROW: exactly 8 equal isolated square frames, left-to-right, no second row, no grid layout, no labels, no margins. Final canvas aspect 8:1 with eight equal square cells. Each cell is one successive frame of the same Amaterasu effect. Preserve a consistent black flame design. Every cell has a flat, perfectly uniform exact #FF00FF background, including corners. Flames only use this exact palette and no other colors: #000000, #07040A, #140A14, #22101C, #3A0E1E, #5C1226 only as thin inner rims, at most a few #8A1A30 pixels per frame. No magenta or pink in the flames; no purple, orange, red fill, gradients, noise, texture, dithering, antialiasing, blur or glow. Use only hard-edged discrete pixel clusters with a small fixed palette. Effect only, no person or body. Each cell: flame blaze about 130 px wide and 215 px tall on a 256x256 cell, bottom anchored at y=240, tongues densely clustered at the base with gaps about one third open so a body can show through; a few tiny 2-3 px black embers above tips. The eight silhouettes subtly lick and curl across time; frame 8 transitions seamlessly back to frame 1. Leave clear gutters of flat magenta between frames and keep all eight cells distinct. Do not retain the 4x2 grid or dimensions of the reference. This is a strict layout-and-palette correction.

Verdict: One horizontal band is visible, and the black flames retain the requested base and open gaps. HOLD: actual canvas remains 1774x887 (2:1), not an 8:1 row of square cells; top-left background sample is RGB(243,15,243), not exact #FF00FF; 42,870 colors show palette/noise noncompliance. No further generation calls are available.

### A7 `amaterasuIgnite`, attempt 03

Output: `amaterasuIgnite_attempt03.png` -> `art/vfx/raw/_qa_hold/amaterasuIgnite_v02.png`
Imagegen output ID: `urn:c2pa:15c055ae-c14e-4847-8e20-6b5c3c7c8934`
Dimensions: 2172 x 724 px, RGB. Distinct RGB values: 69,098. SHA-256: `d4cc35342512969de6679f13981a71c7017763ac9bdf5db710615660637fae6f`.
Calls: 3/3 total.

Exact prompt:
> Correct and redraw this sprite sheet as ONE SINGLE HORIZONTAL ROW: exactly 6 equal isolated square frames arranged left-to-right, no second row, no grid, labels, gutters inside cells, or margins; final canvas aspect 6:1 with six same-size square cells. Each frame 256×256 in design. Effect only. The six phases must clearly progress: f0 a centered black point with thin dark crimson ring about 30px; f1 outward-pointing black flame burst about 120px; f2 about 200px, tongues now curl upward; f3 about 240px, lower half settles into upright flames; f4 outer tongues break into tiny black embers; f5 embers thin out and center is the base of an upward blaze for transition to Amaterasu. Every pixel of background is perfectly flat exact #FF00FF. Use only these effect colors: #000000, #07040A, #140A14, #22101C, #3A0E1E, #5C1226 only as very thin inner rims, at most a few pixels of #8A1A30 per frame. No other colors. No magenta inside effect, purple, orange, crimson fill, gradients, noise, texture, dithering, antialiasing, blur, glow, shadows, or soft edges. Render as discrete crisp hard pixel clusters. Keep each frame distinct, isolated with magenta background gaps and all centers aligned. Do not retain the 3x2 grid or dimensions of the reference.

Verdict: The ignition point, outward burst, and upward flames read in a left-to-right sequence. HOLD: actual canvas is 2172x724 (3:1), not a 6:1 row of square cells; top-left background sample is RGB(230,14,236), not exact #FF00FF, and raw colors (69,098 distinct RGB values) exceed the strict palette, so exact background and hard palette requirements are unverified/failed. No further generation calls are available.

## Batch disposition after all attempts

The latest attempts remain v02 and are quarantined in `_qa_hold`; the user approved the original selected v01 drawings via Claude relay skills #16. Those v01 files are restored to `art/vfx/raw/` without pixel edits, and the manifest marks them approved (`hd: true`; Amaterasu fill 0.9, Ignite fill 0.95). Claude's trial pack confirmed the grid split and clean near-magenta key/quantize; no additional generation call was made. Claude owns final HD packing and in-game validation.

