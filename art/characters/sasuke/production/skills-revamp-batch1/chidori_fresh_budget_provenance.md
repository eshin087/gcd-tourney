# Chidori A1 fresh budget provenance (2026-10-18)

## Authorization

User decision relayed via Claude, `skills` relay #15:

> ART-SKL-SAS batch 1 holds: (1) file special v14 attempt 3 (special_call03_hold.png) as raw/special_v14.png, run the pack, npm run body sasuke special and the Astra audit, then bring it back for the user's approval; (2) a fresh budget of 3 calls for chidori A1 (effect-only crackling knot).

This is a new A1 budget, separate from the prior exhausted three calls documented in `chidori_effects_provenance.md`. All three fresh outputs are preserved; no fourth call was made.

## Call inventory

| Call | Built-in output ID | Original output path | Preserved path | SHA-256 | Verdict |
|---:|---|---|---|---|---|
| 1 | `exec-68a9e1d6-5b15-4ee1-ad3e-6438e699af22.png` (embedded C2PA id `2c81c702-fc50-415e-b61d-e4077d3f34ae`) | `E:\Vibe Coding\.codex\generated_images\01a14e4f-1f72-7360-bc0e-0c03aa8d0684\exec-68a9e1d6-5b15-4ee1-ad3e-6438e699af22.png` | `art/vfx/raw/_qa_hold/chidori_fresh_attempt01.png` | `6D4CCCF5C967489D0C0C686AD7CAC940BC2361B727EAE1530964F7F3AE1BEE8A` | Eight visible crackle knots in one row; overall pattern changes only modestly frame to frame. Preserved as hold. |
| 2 | `exec-4449bc0d-dd5b-4c14-a871-5d932aa48545.png` | `E:\Vibe Coding\.codex\generated_images\01a14e4f-1f72-7360-bc0e-0c03aa8d0684\exec-4449bc0d-dd5b-4c14-a871-5d932aa48545.png` | `art/vfx/raw/_qa_hold/chidori_fresh_attempt02.png` | `0230D3654300F085DB1AEF239469AA8B1A793C819A441FC661190550A972C139` | Branch patterns vary more, but the overall motif is uneven and less cohesive than call 3. Preserved as hold. |
| 3 | `exec-e0961e8e-a1ad-4f3a-b533-f2726f109611.png` | `E:\Vibe Coding\.codex\generated_images\01a14e4f-1f72-7360-bc0e-0c03aa8d0684\exec-e0961e8e-a1ad-4f3a-b533-f2726f109611.png` | `art/vfx/raw/_qa_hold/chidori_fresh_attempt03.png` and selected candidate `art/vfx/raw/chidori_v01.png` | `4A9709D48C958DD69E6B83916CD6BC6E4A6B8C44A003A3E86C647046F3E8DDE6` | Best visual match: effect-only, eight distinct centered crackle knots with stable size, branching blue arcs and small white cores. |

All three generated PNGs are 2172×724. The generated art appears as one horizontal row with large magenta margins above and below; it is not the requested 2048×256 canvas. The image itself visibly reads as eight effect-only frames, so call 3 is filed as the best review candidate with that source-layout caveat. `art/vfx/raw/chidori.json` records `{"split":"even"}` for eight-column parsing. The candidate pack command was `node tools/pack-sprites.mjs vfx --candidates`: it returned 0 and packed 17 effects/90 frames into a 1024×2176 standard atlas; `chidori` split to eight frames at x0.307 and 21 specks were removed. This branch did not produce an HD atlas. A source pixel scan found 125,575 distinct RGBA colors and top-left background RGB(242,13,242), so hard-palette compliance and exact `#FF00FF` background fail. These technical caveats remain visible in REVIEW and the gallery.

## Prompts used

### Call 1

Use case: stylized-concept. Asset type: source pixel-art VFX animation strip for a game. Create ONLY the effect, no fighter, hands, weapons, text, labels, borders, backgrounds or extra subjects. One horizontal row of exactly 8 equal square frames, intended as eight 256x256 cells side by side (2048x256 total). Every cell has the same center anchor at (128,128) relative to its cell. Flat solid pure #FF00FF magenta background.

Subject: A1 Chidori, the thousand birds: a dense, compact knot of crackling lightning about 110 px across around a small 20 px white-hot center, with many short jagged arcs branching in all directions. Longest arcs stream toward screen-left, total silhouette up to about 150 px across, forked ends, and a few tiny sparks. This is a living crackle, not a spinning orb: all eight frames show different random-looking arc patterns with stable density and silhouette size; frame 7 must flow seamlessly back to frame 0 without a size jump. Mostly pale blue arcs (#BFE8FF and #7CC8FF), with vivid blue (#3E8CFF, #2350D8) and dark indigo (#141E78) rims on thick arcs. White (#FFFFFF / #E8F7FF) is limited to the tiny center and only 2-3 thin arc cores per frame. Crisp hard-edged pixel art, square pixel clusters, stepped contours, hard color bands, maximum 16 colors; vivid readable silhouette at small game scale. Keep the lightning localized near the center with a clean magenta margin in every frame. Avoid a solid white disc, large white areas, soft glow, blur, antialiasing, gradients, dithering, painterly texture, noise, or palette colors outside the lightning palette. Respect one effect per cell and the same knot center in all 8 frames.

### Call 2

Use case: stylized-concept. Asset type: pixel-art game VFX animation strip. Generate an effect-only strip: no person, no hands, no props, no text. EXACT canvas layout: one horizontal row of 8 equal square frames, 2048 x 256 overall, each 256x256, with one effect centered at (128,128) in each cell. Pure flat #FF00FF background in every empty pixel.

A1 Chidori: a dense crackling knot of lightning about 110px across around a tiny 20px white-hot center. Many short, forked, jagged arcs branch in every direction; some longer arcs stream toward screen-left, with the whole silhouette no more than 150px across. A few tiny sparks. The lightning is made of pale blue (#BFE8FF, #7CC8FF) with vivid blue (#3E8CFF, #2350D8) and dark indigo (#141E78) rims. White only as a very small center and 2-3 thin arc cores per frame. Max 16 colors.

Eight distinct crackle snapshots for a seamless loop. Make the branching paths and forks change visibly from frame to frame: each frame must have an individually different, irregular arc pattern, no repeated or duplicated pose. Preserve the same center, density, and overall knot size across frames; f7 must transition naturally to f0. Use hard-edged pixel clusters and crisp stepped contours, clear readable shape at small scale. Leave magenta margins around each effect. No white disc, no broad white fill, no glow, soft blur, anti-aliasing, gradients, dithering, painterly texture or noise.

### Call 3

Use case: stylized-concept. Asset type: source pixel-art visual-effects sprite strip, game-ready. Generate only crackling lightning; absolutely no human, hands, props, lettering or other subject. Arrange exactly 8 distinct equal square cells in a single left-to-right row, with each cell 256x256 pixels, 2048x256 total. Keep every frame's effect centered at the same location (128,128) inside its own cell. Empty background is perfectly flat solid #FF00FF.

The Chidori: a dense 110px-wide knot of pale blue lightning surrounding a tiny 20px white-hot core, many short forked jagged arcs in every direction. A few of the longest forks stream toward screen-left, with total silhouette around 150px wide. Only a few tiny sparks. Core and arcs remain compact, centered, and the same scale in every cell. The 8 frames are a seamless crackle loop with a visibly different irregular arrangement of branches in every frame; f7 and f0 must match in density and overall size. Color palette only: #FFFFFF, #E8F7FF, #BFE8FF, #7CC8FF, #3E8CFF, #2350D8, #141E78; use white only for the small center and 2-3 very thin arc cores, mostly pale blue. At most 16 colors. Crisp pixel art with hard square pixel clusters, stepped edges, hard color bands, no outline around the lightning, clear readable shape at small scale. Keep generous magenta space between frames so they don't touch. No white disc or large white fills, no glow, blur, antialiasing, gradients, dithering, noise, texture, or extra elements.
