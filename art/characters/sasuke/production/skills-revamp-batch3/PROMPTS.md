# Skills revamp batch 3 prompts

Generation via the built-in image_gen tool. Outputs were returned as inline PNG data URLs; the tool wrapper exposed no call ID. Attempt names below preserve saved output paths. beamFire attempt 01 was returned inline but not written to disk at the time; it cannot be recovered from the truncated tool response. It still counts against the 3-call budget.

## beamFire v08

### Attempt 01 and 02 prompt (same prompt)

Use case: stylized-concept
Asset type: one-row sprite animation sheet for a 2D fighter, exactly 3 frames left-to-right; final sheet has 3 equal 256x256 cells (768x256 overall).
Primary request: Sasuke Kirin strike character strip, beamFire v08. Frame 0: one readable full-body Sasuke sprite with right arm swung down and forward from overhead, arm straight and pointing down-forward about 40 degrees below horizontal; open palm down, fingers point toward floor about one body length in front. Leaning forward over bent front knee, rear leg extended back; head turned down toward target, mouth set, red Sharingan. Left arm back and low for balance. Hair, sleeves, rope ends and waist cloth blown upward and back. Frames 1 and 2 repeat the same pose with only 1-2 pixel tremble and small new hair/cloth shapes.
Input images: Image 1 approved Sasuke model sheet identity/design reference; Image 2 approved expressions identity reference; Image 3 approved idle scale/anatomy/facing reference. Do not copy their poses except for consistent identity and proportions.
Scene/backdrop: flat uniform pure magenta #FF00FF.
Subject: only Sasuke, one fighter per cell, consistent approved Shippuden outfit, sword sheathed at small of back in every frame.
Style/medium: crisp hard-edged high-resolution pixel-art matching supplied approved refs; serious anime proportions, title-style anatomy, no chibi; tightly controlled pixel clusters and flat hard color bands.
Composition/framing: each frame centered within its own 256x256 cell, consistent scale and pixel density matching approved idle; soles at y=240, pivot x=128; facing screen-right, three-quarter view; whole body and limbs visible.
Constraints: bodyHeight contract 198; preserve approved head, torso, limb lengths, build and clothing volume. No lightning, fire, glow, energy, effects, opponent, text, labels, grids, borders, shadows or extra objects. Hard pixels only, no antialiasing, blur, gradients or dithering. Keep clear cell boundaries through uniform magenta gaps.

### Attempt 03 prompt (selected)

Create a usable game sprite sheet, NOT concept art. 3 equal square frames across, each precisely 256 x 256, one same full-body Sasuke sprite in each cell; output a clean 768 x 256 horizontal strip. Use use-case: pixel-art animation sprite.
Frame 0: Sasuke's Kirin strike. Right arm swung down-forward from overhead, straight at about 40 degrees below horizontal; open palm facing down, fingers pointing to the floor one body length ahead. Torso pitched forward, front knee bent, rear leg stretched back, face turned down, mouth set, red Sharingan. Left arm back low for balance. Hair, sleeves, rope ends, waist cloth whip upward/back. Frames 1-2 identical pose with only 1-2 pixel tremble and slight cloth/hair changes. Sword stays sheathed at small of back.
Identity references: use supplied approved Sasuke refs for outfit/face/anatomy only. serious anime title style proportions, no chibi.
Pixel treatment: genuinely crisp limited-palette pixel-art, blocky square clusters with visible coarse pixel grid, no painterly strokes, no smooth edges, no gradients, no antialiasing, no soft shading, no thin vector lines. Flat hard stepped color clusters.
Canvas: flat exact #FF00FF magenta background; each frame occupies its own 256x256 cell with equal empty magenta separators. Full body visible, same scale across all frames, facing right in three-quarter view. Body height roughly 198 pixels, feet at y=240, pivot x=128.
Absolutely no lightning/effects/glows, no opponent, text, frame numbers, guides, borders, shadows, extra props.

Inputs for all beamFire attempts: approved Sasuke `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`.

## greatFireball v01, attempt 01 (selected)

Use case: stylized-concept
Asset type: one-row 8-frame sprite animation sheet, 2048 x 256 overall, eight equal 256 x 256 frames left-to-right.
Primary request: Great Fireball effect loop, frame-by-frame pixel art. In every frame show a fire sphere flying toward screen-right, approximately 150 px diameter centered near (140,128); bright yellow-white center around 50 px, layered orange/red rolling flames wrapping the sphere, flame tongues trailing back toward screen-left to x≈20. Across frames the surface visibly rolls forward about one eighth turn per frame while overall silhouette/size/center stay consistent; frame 7 flows smoothly back to frame 0. Use only palette #FFF6C8 #FFE07A #FFB43A #FF7A1A #E8420E #A81E0A #5A0E06, hard stepped color bands.
Input images: three supplied approved HD effects are style references only; do not copy their content.
Scene/backdrop: flat pure #FF00FF magenta.
Style/medium: crisp hard-edged pixel art, same density/clusters as refs; no antialiasing, blur, gradients, dithering; no text, no black outline, no ground shadow; max 16 colors.
Composition/framing: one coherent 256x256 cell per frame; same center and scale; leave a clear magenta gutter between cells. Directional facing screen-right.
Constraints: retain recognizable layered sphere and backward trailing tongues at small game scale. No solid white disc, no extra effects or objects.
Inputs: `art/vfx/raw/rasengan_v01.png`, `rasenganBurst_v01.png`, `fourTailsRoar_v02.png` as style refs.

## greatFireballBurst v01, attempt 01 (selected)

Use case: stylized-concept. Asset type: one-row 8-frame sprite animation sheet, eight equal frames left-to-right. Create 8 sequential frames showing a Great Fireball hitting and exploding; flat pure magenta #FF00FF background; crisp HD pixel art matching the three attached approved effect refs, hard stepped color bands, no blur, no antialiasing, no text. In frame order: f0 orange-red sphere squashes against target, 140px across, flames splash sideways; f1 roiling 190px fireball with yellow center; f2-f3 expanding billowing lobes filling the cell, bright yellow core fades toward orange; f4 lobes fragment with dark red edges and first dark smoke puffs (#3A2A26, #6A5A54); f5-f7 smoke puffs and embers drift upward and fade, nothing white-out. Palette fire #FFF6C8 #FFE07A #FFB43A #FF7A1A #E8420E #A81E0A #5A0E06 plus specified smoke. Not a white flash, no solid white disc, no other objects. One frame per slot, consistent placement and coherent growth/fade.
Inputs: same three approved HD effect style refs as above.

## stormCloud v01, attempt 01 (selected)

Use case: stylized-concept. Asset type: 4-frame horizontal sprite animation sheet, left to right, one thundercloud bank tile per frame.
Create a seamless loop of a heavy Kirin storm cloud seen from below and the side. Each 256x256 cell has cloud filling its width, about 150px tall; flat-ish dark underside around y=180, billowing tops and irregular ends that blend when adjacent tiles overlap by 25%. Palette #0E1020 #1A1E36 #2A3052 #3E4670 #5A6496. f0 dark slate/indigo cloud; f1 same cloud with an internal lightning flash illuminating one patch pale blue #7CC8FF #BFE8FF; f2 dark again with billows shifted slightly; f3 different illuminated patch and a short fork of lightning dropping from underside. Pure magenta #FF00FF outside the cloud silhouette.
Input images: supplied approved HD effect examples are style references only.
Pixel art: hard pixel clusters and stepped shading bands, crisp edges, no blur, anti-aliasing, soft gradients, noise/dither, no black outline, no text. Max 16 colors. Keep ends irregular and edge compatible for seamless side-by-side repetition; no storm background or other objects.
Inputs: same three approved HD effect style refs.

### Attempt 02 prompt (selected instead)

Use case: stylized-concept. Generate a sprite sheet for game VFX with exactly 4 distinct thundercloud frames arranged left-to-right in a wide 4:1 horizontal strip; one separate cloud per frame, visible flat #FF00FF gutters between them so they can be auto-split. Each frame is square composition and contains one dark thundercloud tile with 150px-tall mass, flat underside, billowing top, irregular side edges. Do NOT connect cloud pixels across the gutters or place detached lightning in neighboring frames. These tiles will be overlapped side-by-side in the game, so each cloud should have naturally irregular but bounded left/right edges.
Frame sequence: 0 dark slate/indigo cloud; 1 same cloud internally lit by a pale blue flash; 2 dark cloud with billows shifted slightly; 3 different pale blue internal flash and short fork of lightning descending from underside. Palette #0E1020 #1A1E36 #2A3052 #3E4670 #5A6496 #7CC8FF #BFE8FF. Style: hard-edged crisp pixel art, stepped bands, no blur, antialias, gradients, dithering, text or black outline. Each frame independently readable and separated by clear magenta. Reference images are only style guidance.
Inputs: same three approved HD effect style refs.

## kirinBody v01, attempt 01 (selected)

Use case: stylized-concept. Asset type: four-frame looping lightning sprite strip, four equal cells left-to-right.
Draw only a vertical column of Kirin lightning, centered at x=128, about 100 px wide, reaching continuously from y=0 to y=255. It must tile seamlessly top-to-bottom: exact same bolt path at both top and bottom edges so stacked copies join with no seam in every frame. Thick white-blue core around 30px wide zigzags slightly; pale-blue and blue outer bands; jagged contour and forked side arcs snapping outward to cell edges. Four different crackle patterns but same column silhouette and same top/bottom alignment, appropriate to stack from storm clouds down to a dragon head. Lightning palette #FFFFFF #E8F7FF #BFE8FF #7CC8FF #3E8CFF #2350D8 #141E78; use white only for thin core and tips. Pure #FF00FF background. Pixel-perfect hard clusters, no blur, gradients, antialiasing, dithering, text, outline, other objects; readable not a solid white rectangle. Attached approved effects are pixel-art style refs only.
Inputs: same three approved HD effect style refs.

## kirinHead v01, attempt 01 (selected)

Use case: stylized-concept. Asset type: six-frame horizontal loop sprite sheet, six equal cells left-to-right. Create a gigantic beast head made entirely of jagged lightning, diving straight down. The head is about 160px wide x 240px tall within each 256 square cell, profile facing screen-right with snout pointing down, long dragon snout and wide open jaws with jagged lightning teeth, fierce white glowing eye, swept-back horns, crackling bolt mane streaming upward into top edge and joining a bolt column centered x=128 about 100px wide. Keep head silhouette consistent in all six frames while only mane/outline crackle details alter slightly. White hot only thin jaw/eye cores, pale blue and bright blue bands, dark blue rim for sky contrast; palette #FFFFFF #E8F7FF #BFE8FF #7CC8FF #3E8CFF #2350D8 #141E78. Pure #FF00FF background. Pixel art with coarse hard clusters, no blur, antialiasing, gradients, dithering, text, extra body or backdrop. The reference effects guide pixel style only.
Inputs: same three approved HD effect style refs.

## kirinStrike v01, attempt 01 (selected)

Use case: stylized-concept. Asset type: 8-frame horizontal sprite effect animation, 8 sequential equal frames left-to-right, bottom anchor at y=240, pure magenta background.
Kirin lightning dragon strikes the floor; readable, never a white-out. f0 a 60px wide white-blue vertical column from top edge down to floor, flat bright splash about 150px wide along y=240. f1 splash spreads nearly cell-width with lightning racing sideways along floor and up in branches; crackling dome about 200px wide x120px tall. f2-f3 dome reaches about 240x160px, column thins to 30px, forked bolts leap from dome. f4 column disappears, dome separates into individual arcs. f5-f7 low floor arcs and sparks crackle and fade. Keep space below y=240 clear; x=128 centered. Lightning palette #FFFFFF #E8F7FF #BFE8FF #7CC8FF #3E8CFF #2350D8 #141E78; white only thin cores and tips, mostly pale blue with dark blue rim. Hard-edged true pixel art, stepped bands, no blur, antialiasing, gradients, dithering, text, black outline or other objects. Use attached approved effects only for pixel-art style guidance.
Inputs: same three approved HD effect style refs.
