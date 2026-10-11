# Naruto: proportion correction and full redraw

User decision, 2026-10-10. This brief follows Gojo BUILD_REDRAW.md, but changes only Naruto head-to-body proportions. Claude alone integrates. User approval is required at the model and idle gates. No idle or other animation is authorized for generation before model approval.

## Targets and invariants

| Measurement | Existing nominal | Target |
|---|---|---|
| Standing skeleton | 200 px | 200 px unchanged |
| Skull-to-chin | 31 px (6.45 heads) | 28.57 px (7 heads) |
| Head and hair linear scale | 1.0 | 0.9214 (7.86% smaller) |
| Source multiplier | varies in prior sources | 2x: 400 px skeleton, 57.14 px skull |
| Athletic teenage deltoid width | about 62 px, DR 0.31 | preserve about 62 px, DR 0.31 |
| Upper arm / thigh / calf | about 20 / 20-22 / 19-23 px | preserve build; verify against approved reference |
| Cell / columns / pivot / ppu | 256 / 16 / [128,240] / 128 | unchanged |

Skull landmarks behind hair are uncertain: record manual crown/chin coordinates and uncertainty; never claim a silhouette probe measures skull alone. Compare measured heads and body separately. Preserve all 42 canonical poses and frame counts, contacts and bodyHeight. No tuning. Nominal heads-tall table updates to 7 only when the new idle is approved, not while this model candidate waits.

## Gate order

1. New model_sheet_v03 and candidate cast lineup; STOP for `approve naruto model_sheet v03`.
2. Only after approval, copy approved model to fixed name, generate new idle at next free version with lineup; STOP for explicit idle approval.
3. Only after idle approval, redraw all remaining 41 animations against new idle, preserving all 42 in final set. This replaces SCALE_FIX_BRIEF Batches 2-3 for Naruto and incorporates KO_DOWN_BRIEF. Down and ko must be true side-on at the game camera, head left, back/hips/legs on floor, not overhead.
4. Every new strip: strict candidate pack exit 0 and `ok`; heads sheet and lineup linked to review. Exempt only actual probe misreads with version-scoped written evidence. Use measured anatomy sidecars when needed; never rescale by eye.
5. Keep versions, up to three attempts per image, save best only. No overwriting fixed approved references before approval. All changes stay in art/naruto-proportions.

## Frame list

Current manifest, all42 animations; no UI or expression generation is included. Preserve latest approved pose designs and KIT scope. beamCharge/beamFire use the merged Four-Tails shroud, NOT the old Rasen Cannon descriptions in PROMPTS.md. Before later generation re-read the latest approved raw source and Four-Tails brief.

| animation | frames | bodyHeight | approved version |
|---|---|---|---|
| idle | 8 | 204 | v02 |
| run | 8 | 204 | v04 |
| dash | 2 | 160 | v02 |
| backDash | 3 | 207 | v01 |
| superDash | 2 | 120 | v01 |
| jumpSquat | 1 | 162 | v02 |
| jumpUp | 2 | 198 | v01 |
| jumpFall | 2 | 209 | v01 |
| land | 2 | 174 | v01 |
| light1 | 7 | 204 | v02 |
| light2 | 7 | 204 | v01 |
| light3 | 7 | 215 | v01 |
| light4 | 8 | 207 | v01 |
| heavy | 8 | 218 | v07 |
| airLight1 | 5 | 198 | v03 |
| airLight2 | 5 | 207 | v03 |
| airLight3 | 6 | 201 | v02 |
| airHeavy | 6 | 198 | v03 |
| guard | 2 | 198 | v03 |
| block | 2 | 204 | v03 |
| hurtHigh | 3 | 195 | v01 |
| hurtLow | 3 | 183 | v01 |
| launched | 2 | 136 | v02 |
| spin | 4 | 160 | v02 |
| airRecover | 3 | 180 | v02 |
| down | 2 | 96 | v02 |
| getup | 5 | 204 | v02 |
| charge | 4 | 198 | v04 |
| throw | 4 | 201 | v02 |
| beamCharge | 3 | 198 | v05 |
| beamFire | 3 | 198 | v07 |
| vanish | 2 | 221 | v01 |
| stagger | 4 | 207 | v01 |
| ko | 1 | 64 | v05 |
| special | 8 | 204 | v03 |
| intro | 4 | 210 | v01 |
| taunt | 2 | 212 | v01 |
| win | 4 | 212 | v03 |
| specialForward | 7 | 204 | v02 |
| specialUp | 6 | 214 | v01 |
| specialDown | 4 | 204 | v02 |
| superPose | 4 | 208 | v03 |

## Model prompt (current generation)

```text
Character model sheet for a hi-res pixel-art 2D anime arena fighting game (anime fan-art).
CHARACTER: an anime fan-art sprite of the teenage ninja shown in the attached approved references. Keep his exact face, short compact golden-blond spikes, upper-ear temple tufts, blue eyes, three whisker marks per cheek, black headband and two long tails, steel leaf-swirl plate, orange-and-black high-collar jacket, red back spiral, folded orange trouser cuffs, right-thigh holster and black open-toed sandals.
PROPORTIONS: about 7 heads tall. At unchanged 200 px standing skeleton, skull-to-chin is about 28.57 px instead of 31 px. Reduce the whole head and compact hair mass together to 92.14% of the approved proportional size (about 8% smaller). Keep the same athletic body build, shoulder/chest/limb widths, hands, feet, costume and palette. Do not make the body slimmer, broader or taller. Preserve facial identity at the smaller size.

SCALE LOCK: standing skeleton (soles to skull crown, hair excluded) stays 200 px; skull-to-chin target is 200/7 = 28.57 px. Draw at common 2x source scale: 400 px standing skeleton and about 57 px skull-to-chin, with the hair mass also 92.14% of its previous proportional size. Keep shoulder width, torso width, limb lengths and thickness constant in all views, poses and parts. Crouching and leaning change pose bounds, never camera distance. Do not enlarge a pose to fill its slot. Preserve the approved identity, compact hair silhouette, face, clothing and colors. After approval, the new model and idle are the anatomical anchors; old expression references supply facial identity only.

CHANGE ONLY THE PROPORTIONS described above; attached sheet is identity reference, not canvas scale. Deliberately draw the five figures about 400 px tall on the 1024 px high sheet, with ample empty magenta; do not copy its oversized layout.

Draw the same character 5 times in one row on a 1536x1024 landscape canvas, all at exactly the same scale and height, standing on one shared baseline, with clear gaps between them:
1. FRONT view, relaxed neutral stand, arms slightly away from the body, facing the viewer;
2. 3/4 view facing RIGHT (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), relaxed neutral stand;
3. TRUE SIDE PROFILE facing RIGHT: the body seen exactly from the side, only one eye visible, the nose, lips and chin in silhouette, the shoulders seen edge-on, the headband tails hanging behind the head. A real profile, not a 3/4 view;
4. BACK view: the back of the spiky hair, the headband knot with its two long black tails, the black shoulders and upper back of the jacket and the red spiral emblem on the back, the holster strap on the right thigh;
5. 3/4 view facing RIGHT in his fighting stance: left foot forward, right foot back and turned out, feet a little wider than the shoulders, knees bent, left fist up at chin height, right fist guarding the right jaw, determined expression.
Below the figures, one row of 34 small square color swatches (no text), one per palette color, in the palette order listed below.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. On this sheet draw at 2x: every art pixel is a 2x2 block, so the standing body (soles to top of the skull) is about 400 px tall on the canvas, the hair on top of that.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No text, no labels, no ground shadow, no floor.
```

## New SCALE LOCK for every later prompt

```text
SCALE LOCK: standing skeleton (soles to skull crown, hair excluded) stays 200 px; skull-to-chin target is 200/7 = 28.57 px. Draw at common 2x source scale: 400 px standing skeleton and about 57 px skull-to-chin, with the hair mass also 92.14% of its previous proportional size. Keep shoulder width, torso width, limb lengths and thickness constant in all views, poses and parts. Crouching and leaning change pose bounds, never camera distance. Do not enlarge a pose to fill its slot. Preserve the approved identity, compact hair silhouette, face, clothing and colors. After approval, the new model and idle are the anatomical anchors; old expression references supply facial identity only.
```

## Later strip edit prompt (after both approval gates)

```text
Edit the attached approved <animation> <part/frame> as anime fan-art pixel sprites. Preserve each pose, timing, costume, contact zone, perspective, limb lengths and build. Change only head and compact hair proportions to the attached newly approved model and idle: about 7 heads on a 200 px standing skeleton. Expression reference supplies identity only.
SCALE LOCK: standing skeleton (soles to skull crown, hair excluded) stays 200 px; skull-to-chin target is 200/7 = 28.57 px. Draw at common 2x source scale: 400 px standing skeleton and about 57 px skull-to-chin, with the hair mass also 92.14% of its previous proportional size. Keep shoulder width, torso width, limb lengths and thickness constant in all views, poses and parts. Crouching and leaning change pose bounds, never camera distance. Do not enlarge a pose to fill its slot. Preserve the approved identity, compact hair silhouette, face, clothing and colors. After approval, the new model and idle are the anatomical anchors; old expression references supply facial identity only.
Use hard pixel edges, flat #FF00FF background, existing palette, no glow, blur, text, shadows or new effects. Keep exact existing frame count and canonical ordering from ANIMATIONS.md and the matching PROMPTS.md block. For six or more frames generate A then B with A attached, then measured stitch. For down/ko follow KO_DOWN_BRIEF side-on grounded profile.
```

## Fresh strip prompts (after both gates)

Use the latest approved poses and current manifest frame counts. For beamCharge/beamFire use the Four-Tails brief and latest approved raw (v05/v07 in this checkout), never obsolete Rasen Cannon poses. Otherwise use each complete A01-A42 block in PROMPTS.md with its unchanged frame descriptions and palette. Replace its PROPORTIONS line with the model prompt proportion line above; append the SCALE LOCK above after SCALE. Attach new approved fixed model, expressions (identity only), and new approved idle from run onward. No old nominal 31 px enlargement instruction applies. This is a prompt transformation recipe, not permission to skip either gate.
