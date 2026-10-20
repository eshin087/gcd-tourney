# Clash HD generation call inventory

Status: candidates only. No image has user approval or technical QA approval. One call per image; zero retries and zero failed calls.

Routing evidence: user decision via Claude relay `beam-clash-6` #2 routed image generation to `gpt-6-luna` with medium reasoning. This is generation routing only, not image/design approval. Brief: `art/vfx/CLASH_HD_BRIEF.md`, sections 2-4. Branch: `art/clash-hd` in `.worktrees/art-clash-hd`.

All calls used built-in `image_gen.imagegen`, `transparent_background:false`. Returned files were copied unchanged from the exact call output path. The generator did not offer a destination-path argument.

## C1 clashKnot

- Call: 1/3; verdict: generated; no retry.
- Prompt source: `art/vfx/CLASH_HD_BRIEF.md` sections 2-3, C1; exact prompt below.
- Generator path: `E:\Vibe Coding\.codex\generated_images\01a15742-e3c3-7343-b117-e6fdf3135f45\exec-3e3a4595-7fb6-4c1e-8c83-dd392ef6ed35.png`
- Saved path: `art/vfx/raw/clashKnot_v01.png`
- SHA-256: `1CE72B32954B86CD1C525CE25140DD1F26AA19A15C856786AEBB8414BB3ABAC6`
- Prompt:

```text
Use case: stylized-concept
Asset type: game VFX source sprite strip, 8 animation frames laid out left to right
Primary request: Create clashKnot, a compact roiling collision knot where two energy attacks grind together. Eight distinct consecutive frames with a smooth looping motion from frame 7 back to frame 0. Keep the collision centered in every frame.
Input images: none; follow the written approved-effects brief only.
Scene/backdrop: solid flat pure magenta #FF00FF, uniform and perfectly clean.
Subject: In each of 8 equal square frames, a compact irregular folded core about 44-52 pixels wide, with jagged forked energy spikes and arcs spraying up/down, short ragged tongues entering from both left and right, and a few tiny 2-4px chips. The largest spikes reach about 110 pixels above and below the core and the whole shape is about 120px wide. The core churns and folds differently each frame; spikes shoot, fork, fall back, and f7 leads smoothly into f0. It must look like a knot under pressure, never a round flash or starburst.
Style/medium: crisp hard-edged HD pixel art, exactly 8 square animation cells in one horizontal row, transparent-like magenta key background, hard stepped color bands, no outline.
Composition/framing: each cell 256x256 conceptual square, visual center at (128,128), consistent scale; all pixels contained inside each cell with clear spacing between cells. Full image is an 8-frame horizontal sprite strip.
Color palette: white and light greys only: #FFFFFF, #E6E6E6, #C8C8C8, #9A9A9A; hard 3-4 stepped tones.
Constraints: no text, no symbols, no black outline, no soft blur, no gradients, no anti-aliasing, no dithering/noise, no solid white disc or filled cell. Keep the background exactly #FF00FF.
```

## C2 spearStream

- Call: 1/3; verdict: generated; no retry.
- Prompt source: brief sections 2-3, C2; approved reference: `art/vfx/raw/chidoriSpear_v01.png`.
- Generator path: `E:\Vibe Coding\.codex\generated_images\01a15742-e3c3-7343-b117-e6fdf3135f45\exec-1af7445d-50e7-476e-9afe-761335081f1f.png`
- Saved path: `art/vfx/raw/spearStream_v01.png`
- SHA-256: `71B22594538E0D3B50F85BF906B017BE85A62FE836275D773BC9BDDF4B33E151`
- Prompt:

```text
Create a game VFX source sprite strip with FOUR consecutive square frames in one horizontal row, frame order left to right, for the Sasuke Chidori Spear held as a lightning lance. Continue the visual identity of the approved reference image 1 (chidoriSpear v01): straight white-hot blade with blue lightning. Each frame: perfectly straight 10-14px blade core exactly horizontal through y=128, white center with pale-cyan edge, blue jagged crackling arcs 1-3px jumping above and below it, a few hooking back onto the blade; vary arcs per frame but preserve stable straight core. Full-width continuous band: core and band cross both left and right edges at identical y and thickness so it tiles seamlessly horizontally. Keep crackle mostly within 30px of center; max band height about 96px. Center anchor (128,128). Crisp hard-edged pixel art with stepped color bands, no anti-aliasing, no blur, no dithering. Flat uniform #FF00FF background. Palette only #FFFFFF #E8F7FF #BFE8FF #7CC8FF #3E8CFF #2350D8 #141E78. No outline, text, frame dividers, extra objects. Each cell conceptually 256x256; four equal cells side by side.
Input image 1 is style/color reference only.
```

## C3 palmStream

- Call: 1/3; verdict: generated; no retry.
- Prompt source: brief sections 2-3, C3; approved reference: `art/vfx/raw/lightningPalm_v01.png`.
- Generator path: `E:\Vibe Coding\.codex\generated_images\01a15742-e3c3-7343-b117-e6fdf3135f45\exec-305187d8-cd78-4ea7-87cf-9bf2bb052286.png`
- Saved path: `art/vfx/raw/palmStream_v01.png`
- SHA-256: `74E0D7EC7904954292F9A05F1A4446E0692421B33CAE1F83B1F782266AEABBCF`
- Prompt:

```text
Create a game VFX source sprite strip: FOUR consecutive square frames in one horizontal row for palmStream, a continuous Lightning Palm bolt stream. Use approved reference image 1 (lightningPalm v01) as the exact visual identity for Killua's white-violet lightning. In every cell, a jagged main bolt 6-10px thick sharply kinks along y=128, never more than 30px away; a thinner second bolt weaves beside it and short forks spring off the kinks. Make each frame's zigzag different and flickering, always crossing both left and right cell edges at y=128 with the same thickness and height for a seamless horizontal tile. Band maximum 110px high, centered at anchor (128,128). Crisp hard pixel edges and stepped bands; flat pure #FF00FF background. Palette only #FFFFFF #EAFCFF #B4F0FF #62D8FF #3A9BF0 #8C6BFF #5534D0 #24125E; white only at bolt cores. No text, no black outline, no blur, gradients, anti-aliasing, dithering, props or dividers. Four equal 256px-square conceptual cells arranged side by side.
Reference image is for palette and lightning design only.
```

## C4 fireballStream

- Call: 1/3; verdict: generated; no retry.
- Prompt source: brief sections 2-3, C4; approved reference: `art/vfx/raw/greatFireball_v01.png`.
- Generator path: `E:\Vibe Coding\.codex\generated_images\01a15742-e3c3-7343-b117-e6fdf3135f45\exec-52b9652d-6f5c-4746-a7fb-22b72778c5ad.png`
- Saved path: `art/vfx/raw/fireballStream_v01.png`
- SHA-256: `CB90CE0017455760FFAB98F7B988571EEFDBBC6B989BC02A4F3AC7957C87ED3E`
- Prompt:

```text
Generate a four-frame horizontal sprite strip for game effect fireballStream: Great Fireball torrent, left-to-right animation. Reference image 1 is the approved greatFireball v01 and controls its fire shapes/colors. In each of four square cells, a torrent of rolling billowing fire lobes fills a horizontal band, with a yellow-white core line exactly on y=128. Lobes repeat naturally across full cell width for seamless tiling: top and bottom edges roll forward to the right; flame licks curl backward from edges; a few small dark-red smoke flecks. Keep widest mass in the center, total band up to 150px tall, anchor (128,128). Keep edge geometry continuous at columns 0/255 and core crossing both edges at same thickness/height. Crisp pixel art, hard stepped fire bands, no blur, gradients, anti-aliasing, dithering, black outlines. Solid #FF00FF background. Palette derived from reference: dark red rim, red, orange, yellow, pale yellow and white only in core. Four equal 256px conceptual cells in a single row, no text/dividers/other objects.
```

## C5 kamehamehaStream

- Call: 1/3; verdict: generated; no retry.
- Prompt source: brief sections 2-3, C5; approved reference: `art/vfx/raw/kamehamehaHead_v01.png`.
- Generator path: `E:\Vibe Coding\.codex\generated_images\01a15742-e3c3-7343-b117-e6fdf3135f45\exec-5fb3339c-44fc-4712-b13f-b8431285b439.png`
- Saved path: `art/vfx/raw/kamehamehaStream_v01.png`
- SHA-256: `24CAB28645253DA87EC3B2D8C497196806231E1552C1BCEB6C02FDF0FA80597A`
- Prompt:

```text
Generate kamehamehaStream, a game VFX source strip with FOUR consecutive square frames in one horizontal row. Match approved reference image 1, the blue and white swirling stripes of kamehamehaHead v01. Each frame is a solid horizontal beam body about 130px thick, centered at (128,128), with white core about 50px thick, then pale blue, light blue, deep blue bands; long diagonal bands twist forward and shift right frame by frame, with small curled tongues rippling along top and bottom edges. Core and all bands cross left and right edges at consistent heights/thicknesses so each frame tiles seamlessly. Max band height 150px. Crisp hard-edged pixel art, strong silhouette, hard stepped shades, flat #FF00FF background. Palette only #FFFFFF #E6FAFF #AEE8FF #6CCBFF #2E9BFF #1A62E0 #123A9E; white limited to core. No text, outline, blur, gradient, anti-aliasing, dithering, divider lines or other objects. Four equal 256px conceptual cells side by side.
```

## C6 beastBeamStream

- Call: 1/3; verdict: generated; no retry.
- Prompt source: brief sections 2-3, C6; approved references: `beastBall_v01.png`, `beastBeamRing_v01.png`, `fourTailsRoar_v02.png` under `art/vfx/raw/`.
- Generator path: `E:\Vibe Coding\.codex\generated_images\01a15742-e3c3-7343-b117-e6fdf3135f45\exec-9c4751e4-6d9f-4df0-b9d8-19edda4e80b8.png`
- Saved path: `art/vfx/raw/beastBeamStream_v01.png`
- SHA-256: `933558C0C7A77E7B34D566F23F1384AE3A704FAD3CBE0FC738FC733F06E2AAEB`
- Prompt:

```text
Create beastBeamStream: FOUR consecutive square frames in one horizontal row for the Four-Tails' chakra beam body. Match reference image 1 beastBall and image 2 beastBeamRing and the visual style of fourTailsRoar: dark red-black boiling chakra, hot orange-red core and occasional blue flecks. Each frame has a heavy 180px-thick central torrent at y=128, hot core about 60px with a thin white-hot center line, dark mass bubbling and blobbing along edges, shapes rolling forward to the right. Seamlessly tile horizontally: all layers including center core cross both edges at same heights/thicknesses. Band max 200px, anchor (128,128). Crisp hard-edged pixel art, maximum 8 colors: #1A0204 #4A0606 #7A0C0C #C8281E #FF4A2A #FFB08A #FFE8DC (only in thin core line) and #3A8AFF (sparse flecks). Flat uniform #FF00FF background. No outlines, text, blur, gradients, anti-aliasing, dithering, dividers, white disc. Four equal conceptual 256px cells side by side.
```

## C7 redPush

- Call: 1/3; verdict: generated; no retry.
- Prompt source: brief sections 2-3, C7; approved references: `reversalRed_v01.png`, `redBurst_v01.png` under `art/vfx/raw/`.
- Generator path: `E:\Vibe Coding\.codex\generated_images\01a15742-e3c3-7343-b117-e6fdf3135f45\exec-ba26b984-b405-44b7-bf0e-7fa91a6c4943.png`
- Saved path: `art/vfx/raw/redPush_v01.png`
- SHA-256: `FDBA26EB32BD37B4939D0FD30EF93782931A3D0B9C03BDB2AA87B22392EF4ABB`
- Prompt:

```text
Generate redPush, an 8-frame looping horizontal source sprite strip for Gojo's Reversal: Red shoving forward. Use reference images 1 (approved reversalRed v01) and 2 (redBurst v01) for the same crimson sphere and white-hot center. In each square frame: one roughly 72px orb centered x=110, y=128, slightly flattened at its front against an invisible wall at x=150. From its right face, 2-3 concentric crimson repulsion shockwave arcs push toward x=250; arcs widen then break into dashes, with a new wave starting every few frames. Short faint 1-2 thin arcs trail behind left; small red chips spray at contact. Vary wave and chips across frames with f7 flowing naturally into f0. Definitely an orb shoving, not fire, flame, or beam. Center anchor (128,128); compact inside each cell. Crisp hard-edged pixel art and stepped palette only #FFFFFF #FFE0DC #FF8A8A #FF3A4A #E0122E #A00C22 #5A0614; white only hot core. Uniform flat #FF00FF background, no outline, blur, gradient, anti-aliasing, dithering, text, dividers or extra objects. Eight equal 256px conceptual cells arranged left-to-right.
```

## C8 dragonFistPush

- Call: 1/3; verdict: generated; no retry.
- Prompt source: brief sections 2-3, C8; approved references: `dragonFistDragon_v01.png`, `dragonFistAura_v01.png` under `art/vfx/raw/`.
- Generator path: `E:\Vibe Coding\.codex\generated_images\01a15742-e3c3-7343-b117-e6fdf3135f45\exec-30f68064-ff7c-499e-af45-b3a24b7b60b8.png`
- Saved path: `art/vfx/raw/dragonFistPush_v01.png`
- SHA-256: `A993F00A29A9A508A23B68F860B844A7ED6B4E43B7E2B88F134905D934B1B13B`
- Prompt:

```text
Create dragonFistPush, an 8-frame looping horizontal game VFX sprite strip of the approved golden ki dragon bursting straight from Goku's fist toward the right. Use reference image 1 (dragonFistDragon v01) and image 2 (dragonFistAura v01) for identity/style. Each square cell: dragon's recognizable head on right, x=150-245, jaws open roaring, horns and whiskers streaming back; neck and body trail tightly in S-curves to the left edge, tail end at x=0-30 y=128 where fist is. Body writhes across frames, jaws snap slightly open/closed, golden ki flames lick off body; f7 should flow into f0. Fill height no more than 170px; center anchor (128,128). This is a golden dragon pressing forward, not merely a beam. Crisp hard-edged pixel art, palette only #FFFFFF #FFF6C0 #FFE066 #FFC21A #F08C0A #B85A06 #6A3004; white only eyes, teeth and tiny core highlights. Flat #FF00FF background. No outline, blur, gradient, anti-aliasing, dithering, text, divider marks or other objects. Eight equal 256px conceptual cells in one horizontal row.
```

## Preliminary visual/technical observations (not approval)

All eight calls returned and were saved, but none was packed or checked in-game. Source raster dimensions returned by the generator: `clashKnot` 1774x887; each other image 2172x724. These do not match the brief's expected frame grid of 8 or 4 square 256px cells. Visual inspection shows recognizable intended motifs and magenta backgrounds on seven files. `beastBeamStream_v01.png` visibly includes large white bars above and below the central magenta strip, violating the flat-magenta background requirement. `redPush` reads as a repeated orb/shockwave motif, and `dragonFistPush` reads as a gold dragon, but frame boundaries/loop and dimensions need technical ingestion QA. The bands look broadly centered and continuous in the previews, but exact edge seam/tile and palette checks remain unverified. No pass or approval is claimed.

## C1 corrective generation: clashKnot v02

- Call: 2/3; verdict: saved as `v02`, clearly cleaner than v01 for the stated target. The full visible canvas is uniformly magenta with no grey backing panel. The collision knots remain recognizable and differ across the 8-frame sequence. This verdict is limited to visual comparison; cell geometry, exact palette, loop, and technical use remain unverified.
- Prompt source: brief sections 2-3, C1; no reference images, as C1 is a shared tinted collision effect.
- Generator path: `E:\Vibe Coding\.codex\generated_images\01a15742-e3c3-7343-b117-e6fdf3135f45\exec-400bfb8b-3c08-43c0-922a-34401973a04a.png`
- Saved path: `art/vfx/raw/clashKnot_v02.png`
- SHA-256: `0ACE849A23AE98BE541ACCB53A755C9F46497E1451A17D22560222F249C3F0F1`
- Dimensions: 2172x724; still not the expected 8-square-cell source dimensions.
- Prompt:

```text
Use case: stylized-concept
Asset type: game VFX source sprite strip, eight-frame seamless animation
Primary request: Generate clashKnot frame sequence, eight distinct horizontal animation cells in ONE row, each cell exactly square in a conceptual 2048x256 strip (eight 256x256 cells).
Scene/backdrop: Every pixel of the entire canvas, including all space around/between effects, must be one perfectly uniform flat solid pure #FF00FF. There is NO panel, card, grey box, white bar, border, backdrop shape, gradient or background texture.
Subject: Each frame has a compact roiling collision knot where two energy attacks grind together. Irregular folded core 40-50px across, never a circle; jagged forked energy spikes and arcs spray up/down, short ragged tongues enter from left and right, a few 2-4px chips. Highest spikes vary up to about 110px above/below core, whole knot about 120px wide. Core folds differently each frame; spikes shoot, fork, fall back; f7 flows into f0. The sequence must read as a knot under pressure, never a round flash or starburst.
Style/medium: Crisp hard-edged pixel art, white and light greys only (#FFFFFF, #E6E6E6, #C8C8C8, #9A9A9A), 3-4 discrete hard color steps, no outline.
Composition/framing: eight equally sized square 256x256 cells, arranged left-to-right with clear even boundaries only implied by the magenta background; effect centered in each cell at (128,128). Do not add separators or labels. Retain pure magenta across all eight cells.
Constraints: no text, symbols, black outline, soft blur, gradient, anti-aliasing, dithering/noise, backing panel, grey or white background. White appears only in the energy effect, never in any background area.
```

## C6 corrective generation: beastBeamStream v02

- Call: 2/3; verdict: saved as `v02`, clearly cleaner than v01 for the stated target. The full visible canvas is uniformly magenta with no white bars; the dark chakra torrent, bright core and sparse blue flecks remain present. This verdict is limited to visual comparison; cell geometry, exact palette, seam, loop, and technical use remain unverified.
- Prompt source: brief sections 2-3, C6; approved references: `beastBall_v01.png`, `beastBeamRing_v01.png`, and `fourTailsRoar_v02.png` under `art/vfx/raw/`.
- Generator path: `E:\Vibe Coding\.codex\generated_images\01a15742-e3c3-7343-b117-e6fdf3135f45\exec-8a58238e-fc57-4bb1-b82e-8153460042d3.png`
- Saved path: `art/vfx/raw/beastBeamStream_v02.png`
- SHA-256: `0D6799088648CF96509C163C13C2CF1443217622574DBCEBC930B942BA613C5A`
- Dimensions: 2172x724; still not the expected 4-square-cell source dimensions.
- Prompt:

```text
Use case: stylized-concept
Asset type: four-frame game VFX source strip, seamless horizontal beam tile animation
Primary request: Generate beastBeamStream, a Four-Tails chakra torrent, four distinct horizontal frames in ONE row, each cell square in a conceptual 1024x256 strip (four 256x256 cells). Match the look of the provided approved references: image 1 beastBall v01, image 2 beastBeamRing v01, image 3 fourTailsRoar v02.
Scene/backdrop: Every pixel of the full canvas, including empty space above and below the band and all space between frames, must be a perfectly uniform flat solid pure #FF00FF. No panels, cards, white bars, borders, backing shapes, gradients or texture anywhere.
Subject: In each cell, a boiling torrent of dark red-black chakra about 180px thick centered on y=128, with hot orange-red core about 60px thick and a thin white-hot line at its center. Dark chakra bubbles and blobs boil along the top and bottom edges and roll forward. A few sparse blue chakra flecks. It is heavier and more menacing than a blue beam. Each band fills the full width of its cell, and every color layer including core crosses the left and right edges at identical height and thickness for a seamless tile.
Style/medium: crisp hard-edged pixel art, discrete hard color bands, no black outline. Palette only #1A0204 #4A0606 #7A0C0C #C8281E #FF4A2A #FFB08A #FFE8DC (white-hot core line only) and sparse #3A8AFF flecks.
Composition/framing: Four equally sized square 256x256 cells in one horizontal row, center anchor (128,128); keep all chakra inside cell bounds, the entire remaining background pure magenta.
Constraints: no text, no labels, no cell dividers, no blur, gradient, anti-aliasing or dithering. Do not create white or grey background bars. White only in the thin chakra core line.
```
