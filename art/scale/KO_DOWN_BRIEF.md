# ART-KO-01: `ko` and `down` redrawn side-on, lying on the floor (brief for Codex, 2026-10-10)

> Written by Claude for the user's bug "the defeated character floats instead of lying naturally on the ground"
> ([ADR 0020](../../docs/decisions/0020-lying-pose-ground-contact.md), engine work ENG-066 / TOOL-024). Covers
> **Naruto, Sasuke and Killua**. Gojo's `ko` and `down` are redrawn inside his build redraw (ART-GOJ-BUILD, see
> [BUILD_REDRAW.md](../characters/gojo/BUILD_REDRAW.md#6-redraw-order-and-method-all-42-animations--ui)) with the same rule and
> the same VIEW / FLOOR CONTACT / LAYOUT lines as below. Every new image still needs the user's `approve vNN`.

## 1. What is wrong

The game is right: the KO'd body is on the floor and every packed frame's lowest pixel sits on the floor line (y 240).
The **art** is drawn from high above (a spread-eagle seen from overhead), not from the spec camera (about 12 degrees
down). Only one hand or shoe touches y 240; the head end hangs in the air, which reads as floating at the low KO and
victory cameras. The KO frames are also taller than their body height (the anatomy sidecar bypasses the cap).
Measured on the shipped sheets (`npm run sprites` now prints these as warnings):

| fighter | `ko` (approved) | body columns within 6 px of y 240 | worst fifth above y 240 | height vs bodyHeight | `down` f1 (approved) | contact | worst fifth |
|---|---|---|---|---|---|---|---|
| naruto | v05 | 21 % | 29 px (head end) | 90 px vs 64 | v02 | 12 % | 14 px |
| sasuke | v02 | 9 % | 36 px (head end) | 97 px vs 64 | v01 | 9 % | 13 px |
| killua | v02 | 10 % (5 px at his size) | 30 px (head end) | 85 px vs 58 | v01 | 19 % | 15 px |
| gojo | v02 | 34 % | 15 px | 70 px vs 70 | v01 | 13 % | 16 px |

`getup` f0 (lying on the back, knees to the chest) is fine for everyone (70-91 % contact, at most 6 px): the redraw
must flow into it, not replace it.

## 2. The rule ([SPEC.md "Lying poses"](../SPEC.md#lying-poses))

- **Side-on, from the spec camera** (about 12 degrees down, the same camera as the idle), never from above.
- The **back of the head, the shoulder blades, the back, the hips, the backs of the legs and the heels** rest on one
  horizontal floor line; the arms lie limp along the sides **on** the floor; the far limbs at most about 8 px higher
  than the near ones (final px).
- **Flat and long**: about 3 times as wide as tall. `ko` at most its body height (Naruto 64, Sasuke 64, Killua 58 px;
  the packer warns above x 1.15); `down` f0 (the bounce) at most 96 / 96 / 87, f1 lower.
- **Same scale as the idle** (SCALE LOCK, anatomy sidecar): a lying body is as long as the standing one is tall plus
  the hair and the feet (Naruto and Sasuke about 205-225 px, Killua about 185-200 px). Never enlarge it to fill the
  canvas. Keep every pixel inside x 4..251: bend a knee a little rather than shrink him.
- **Measured gate** (packer, warns otherwise): at least **40 %** of the body's columns have their lowest pixel within
  **6 px** of y 240 (Killua 5 px), **no fifth** of the body's length is more than **12 px** above y 240 at its lowest
  (Killua 11 px), and the frame is at most body height x 1.15.

## 3. Assets and versions

Next free versions read today from `raw/`, `raw/_parts/`, `raw/_rejected/` and REVIEW.md (recheck before saving:
1 + the highest number anywhere, AGENTS.md):

| fighter | asset | save as | frames | ms | body height | attach |
|---|---|---|---|---|---|---|
| naruto | `ko` | `raw/ko_v06.png` + `raw/ko_v06.json` | 1 | 500 | 64 | model sheet, expressions, idle_approved, the approved `getup` strip (`raw/getup_v02.png`) |
| naruto | `down` | `raw/down_v03.png` + `raw/down_v03.json` | 2 | 80, 420 | 96 | the same, plus the new `ko_v06` |
| sasuke | `ko` | `raw/ko_v03.png` + `raw/ko_v03.json` | 1 | 500 | 64 | model sheet, expressions, idle_approved, `raw/getup_v01.png` |
| sasuke | `down` | `raw/down_v02.png` + `raw/down_v02.json` | 2 | 80, 420 | 96 | the same, plus the new `ko_v03` |
| killua | `ko` | `raw/ko_v03.png` + `raw/ko_v03.json` | 1 | 500 | 58 | model sheet, expressions, idle_approved, `raw/getup_v02.png` |
| killua | `down` | `raw/down_v02.png` + `raw/down_v02.json` | 2 | 80, 420 | 87 | the same, plus the new `ko_v03` |
| gojo | `ko` / `down` | `ko_v03` / `down_v02` | 1 / 2 | | 70 / 104 | with ART-GOJ-BUILD (route B, after his new idle) |

Draw `ko` first: it is the KO and victory shot the user sees for seconds, and `down` f1 copies its lying line.

Each sidecar carries `anatomy` (`"measurement": "skull-to-chin"`, the `targetHeadPx` of the character's other
approved strips, one measured `sourceHeadPx` per frame; [CHARACTER_SCALE.md](../CHARACTER_SCALE.md#measurement-and-packing)).
A flat body is centred by the packer on its own (the whole back is the bottom 20 % of the frame); add `frameOffsets`
only if a frame lands off-centre or touches the margin. Never a negative dy.

## 4. Frame tables

**`ko`** (1 frame, held; every fighter)

| f | file | ms | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `ko_00` | 500 | Knocked out cold, lying flat on the back, head toward screen-LEFT, seen side-on: the back of the head, back, hips, the backs of the legs and the heels on the floor line; arms limp along the sides on the floor (hands by the hips, palms up or down); legs straight or the far knee only slightly bent; the toes pointing up; the head turned a little toward the viewer, resting on the floor. | out: eyes closed, mouth slightly open | Hair spread on the floor behind the head (Naruto: headband tails lying flat; Sasuke: the sword grip beside the near hip, waist cloth flat; Killua: shirt splayed, white hem showing) |

**`down`** (2 frames, plays once; f1 shows about 0.6 s on every knockdown)

| f | file | ms | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `down_00` | 80 | IMPACT: the back slams flat onto the floor from the shoulders to the hips (head toward screen-LEFT, seen side-on); the bounce lifts the bent knees and the feet up toward the upper right, at most about 20 px above the floor; the arms flung out to the sides close to the floor. | pain: eyes shut, mouth open | Hair and cloth splash out; the whole back stays the lowest part so the frame stays centred |
| f1 | `down_01` | 420 | AT REST: like `ko` f0 but conscious: flat on the back, seen side-on, head, back, hips, legs and heels on the floor line, arms out along the floor, one knee slightly raised. Must flow into `getup` f0 (lying on the back, knees pulled to the chest, palms by the head). | dazed, grimacing, eyes half shut | Same head end, same body line and same scale as `ko` f0 |

## 5. Prompt blocks

The blocks keep each character's CHARACTER, PROPORTIONS, SIZE, STYLE, PALETTE and BACKGROUND lines from PROMPTS.md
and replace the VIEW and LAYOUT lines (the old ones said "camera slightly above" and "make the character as large as
the canvas allows", which produced the top-down poses). Each adds the SCALE LOCK line
([CHARACTER_SCALE.md](../CHARACTER_SCALE.md) "Prompt paragraph") and a FLOOR CONTACT line.

### Naruto · `ko` → `raw/ko_v06.png`

```text
Hi-res pixel-art sprite for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale. Also attached: the approved "getup" strip; its first pose shows him lying on his back from the same camera.

ANIMATION: "ko", knocked out cold, lying on the floor. 1 frame.
1. Knocked out, lying flat on his back with his head on the LEFT and his feet on the RIGHT, completely limp: arms lying loose along his sides on the floor, hands by his hips; legs straight, the far knee only slightly bent; toes pointing up; head resting on the floor, turned a little toward the viewer. Face: out cold, eyes closed, mouth slightly open. Hair spikes splayed on the floor behind his head, the headband tails lying flat on the floor.
FLOOR CONTACT: the back of his head, his shoulder blades, his back, his hips, the backs of his legs and his heels all rest on ONE straight horizontal floor line at the bottom of the pose, so the underside of the whole body is one long, nearly straight line. Nothing hangs in the air: the head does not lift, the arms are not raised, only the toes and a slightly bent knee rise above the floor. The far arm and leg are only a few pixels higher than the near ones.
MOTION: Flat and long: the pose is about three times as wide as it is tall.

LAYOUT: one single pose centered on a 1536x1024 landscape canvas, the whole body visible with a clear magenta margin. Keep the declared source scale: do NOT enlarge the pose to fill the canvas; leave empty background above and around it.
SCALE: exactly the same character scale as the attached idle strip (same head size).
SCALE LOCK: preserve the approved character's skull-to-chin length, excluding hair; never enlarge or shrink the head to reach a number. Standing skeleton height is 200 px. Draw the source art at a declared common multiplier of 2x (skull 2 x the approved skull length, standing skeleton 2 x 200 px). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. Lying, he is about 210-220 px long and at most about 60 px tall.
VIEW: he lies on his back on the floor, seen from the SIDE by the same camera as the attached idle strip, only slightly above (about 12 degrees down). NOT seen from above: not a top-down or bird's-eye view, not a spread-eagle seen from overhead. His head is on the LEFT and his feet on the RIGHT; his chest is turned only slightly toward the viewer; his right arm and right leg are nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front).
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### Naruto · `down` → `raw/down_v03.png`

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the new "ko" pose (pose 2 lies on the same floor line, from the same camera) and the approved "getup" strip (pose 2 must flow into its first pose).

ANIMATION: "down", slammed down, then lying on the back. 2 frames in total, numbered 1 and 2 from left to right.
1. Impact: his back slams flat onto the floor from the shoulders to the hips, head on the LEFT and feet on the RIGHT; the bounce lifts his bent knees and feet a little toward the upper right (the feet at most about a tenth of his height off the floor); the arms flung out to the sides close to the floor. Face: pain, eyes squeezed shut, mouth open. Hair spikes and headband tails splash out to the left.
2. At rest: lying flat on his back like the attached "ko" pose but conscious: arms out along the floor at his sides, legs straight, the left knee only slightly raised, head resting on the floor turned toward the viewer. Face: dazed, eyes half shut, grimacing. The headband tails lying flat.
FLOOR CONTACT: in pose 2 the back of his head, his shoulder blades, his back, his hips, the backs of his legs and his heels all rest on ONE straight horizontal floor line, the same line as pose 1's back. Nothing hangs in the air: the head does not lift, the arms are not raised. Both poses share the same floor line (the bottom of the image row).
MOTION: Flat and long poses, the whole back the lowest part in both.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size), the same as the attached idle strip and "ko" pose.
SCALE LOCK: preserve the approved character's skull-to-chin length, excluding hair; never enlarge or shrink the head to reach a number. Standing skeleton height is 200 px. Draw the source art at a declared common multiplier of 2x (skull 2 x the approved skull length, standing skeleton 2 x 200 px). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. Lying, he is about 210-220 px long.
VIEW: he lies on his back on the floor, seen from the SIDE by the same camera as the attached idle strip, only slightly above (about 12 degrees down). NOT seen from above: not a top-down or bird's-eye view, not a spread-eagle seen from overhead. His head is on the LEFT and his feet on the RIGHT; his chest is turned only slightly toward the viewer; his right arm and right leg are nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front).
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### Sasuke · `ko` → `raw/ko_v03.png`

```text
Hi-res pixel-art sprite for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale. Also attached: the approved "getup" strip; its first pose shows him lying on his back from the same camera.

ANIMATION: "ko", knocked out cold, lying on the floor. 1 frame.
1. Knocked out, lying flat on his back with his head on the LEFT and his feet on the RIGHT, completely limp: arms lying loose along his sides on the floor, hands by his hips; legs straight, the far knee only slightly bent; toes pointing up; head resting on the floor, turned a little toward the viewer. Face: out cold, eyes closed, mouth slightly open. Hair spread on the floor behind his head, the waist cloth lying flat, the sword grip visible beside his near hip (sheathed, under him along the floor).
FLOOR CONTACT: the back of his head, his shoulder blades, his back, his hips, the backs of his legs and his heels all rest on ONE straight horizontal floor line at the bottom of the pose, so the underside of the whole body is one long, nearly straight line. Nothing hangs in the air: the head does not lift, the arms are not raised, only the toes and a slightly bent knee rise above the floor. The far arm and leg are only a few pixels higher than the near ones.
MOTION: Flat and long: the pose is about three times as wide as it is tall.

LAYOUT: one single pose centered on a 1536x1024 landscape canvas, the whole body visible with a clear magenta margin. Keep the declared source scale: do NOT enlarge the pose to fill the canvas; leave empty background above and around it.
SCALE: exactly the same character scale as the attached idle strip (same head size).
SCALE LOCK: preserve the approved character's skull-to-chin length, excluding hair; never enlarge or shrink the head to reach a number. Standing skeleton height is 200 px. Draw the source art at a declared common multiplier of 2x (skull 2 x the approved skull length, standing skeleton 2 x 200 px). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. Lying, he is about 210-220 px long and at most about 60 px tall.
VIEW: he lies on his back on the floor, seen from the SIDE by the same camera as the attached idle strip, only slightly above (about 12 degrees down). NOT seen from above: not a top-down or bird's-eye view, not a spread-eagle seen from overhead. His head is on the LEFT and his feet on the RIGHT; his chest is turned only slightly toward the viewer; his right arm and right leg are nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front).
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### Sasuke · `down` → `raw/down_v02.png`

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Sasuke Uchiha from Naruto Shippuden in his Hebi-era outfit, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 6.5 heads tall, anime-accurate Shippuden-era proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, rope bow, sword, colors, proportions and character scale in every pose. Also attached: the new "ko" pose (pose 2 lies on the same floor line, from the same camera) and the approved "getup" strip (pose 2 must flow into its first pose).

ANIMATION: "down", slammed into the floor, then lying on the back. 2 frames in total, numbered 1 and 2 from left to right.
1. Impact: his back slams flat onto the floor from the shoulders to the hips, head on the LEFT and feet on the RIGHT; the bounce lifts his bent knees and feet a little toward the upper right (the feet at most about a tenth of his height off the floor); the arms flung out to the sides close to the floor. Face: pain, eyes shut, mouth open. Hair splashing out to the left.
2. At rest: lying flat on his back like the attached "ko" pose but conscious: arms out along the floor at his sides, legs straight, one knee only slightly raised, head resting on the floor. Face: eyes half shut, grimacing. The waist cloth splayed, the sword grip visible beside his near hip.
FLOOR CONTACT: in pose 2 the back of his head, his shoulder blades, his back, his hips, the backs of his legs and his heels all rest on ONE straight horizontal floor line, the same line as pose 1's back. Nothing hangs in the air: the head does not lift, the arms are not raised. Both poses share the same floor line (the bottom of the image row).
MOTION: Flat and long poses, the whole back the lowest part in both.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size), the same as the attached idle strip and "ko" pose.
SCALE LOCK: preserve the approved character's skull-to-chin length, excluding hair; never enlarge or shrink the head to reach a number. Standing skeleton height is 200 px. Draw the source art at a declared common multiplier of 2x (skull 2 x the approved skull length, standing skeleton 2 x 200 px). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall (soles to the top of the skull; the head is about 31 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. Lying, he is about 210-220 px long.
VIEW: he lies on his back on the floor, seen from the SIDE by the same camera as the attached idle strip, only slightly above (about 12 degrees down). NOT seen from above: not a top-down or bird's-eye view, not a spread-eagle seen from overhead. His head is on the LEFT and his feet on the RIGHT; his chest is turned only slightly toward the viewer; his right arm and right leg are nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front).
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no fire, no aura, no energy effects, no extra characters.
```

### Killua · `ko` → `raw/ko_v03.png`

```text
Hi-res pixel-art sprite for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips. No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale. Also attached: the approved "getup" strip; its first pose shows him lying on his back from the same camera.

ANIMATION: "ko", knocked out cold, lying on the floor. 1 frame.
1. Knocked out, lying flat on his back with his head on the LEFT and his feet on the RIGHT, completely limp: arms lying loose along his sides on the floor, hands by his hips; legs straight, the far knee only slightly bent; the sneaker toes pointing up; head resting on the floor, turned a little toward the viewer. Face: out cold, eyes closed, mouth slightly open. The fluffy hair spread on the floor behind his head (it does not lift his head), the shirt splayed, the white hem showing.
FLOOR CONTACT: the back of his head, his shoulder blades, his back, his hips, the backs of his legs and his heels all rest on ONE straight horizontal floor line at the bottom of the pose, so the underside of the whole body is one long, nearly straight line. Nothing hangs in the air: the head does not lift, the arms are not raised, only the toes and a slightly bent knee rise above the floor. The far arm and leg are only a few pixels higher than the near ones.
MOTION: Flat and long: the pose is about three times as wide as it is tall.

LAYOUT: one single pose centered on a 1536x1024 landscape canvas, the whole body visible with a clear magenta margin. Keep the declared source scale: do NOT enlarge the pose to fill the canvas; leave empty background above and around it.
SCALE: exactly the same character scale as the attached idle strip (same head size).
SCALE LOCK: preserve the approved character's skull-to-chin length, excluding hair; never enlarge or shrink the head to reach a number. Standing skeleton height is 182 px. Draw the source art at a declared common multiplier of 2x (skull 2 x the approved skull length, standing skeleton 2 x 182 px). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. Lying, he is about 190 px long and at most about 55 px tall.
VIEW: he lies on his back on the floor, seen from the SIDE by the same camera as the attached idle strip, only slightly above (about 12 degrees down). NOT seen from above: not a top-down or bird's-eye view, not a spread-eagle seen from overhead. His head is on the LEFT and his feet on the RIGHT; his chest is turned only slightly toward the viewer; his right arm and right leg are nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front).
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### Killua · `down` → `raw/down_v02.png`

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Killua Zoldyck from Hunter x Hunter (2011 anime) in his Chimera Ant arc outfit, about 13 years old, drawn as an anime fan-art sprite: a slim, wiry, pale boy with a cold, detached, catlike air. Messy, fluffy, spiky silver-white hair (cool lavender-grey shading) that sticks out in soft pointed tufts in every direction, a few tufts falling over his forehead. Sharp, upturned, cat-like blue eyes, thin brows, a small nose, a narrow chin. A loose long-sleeved purple shirt with a wide, loose dark-navy rolled collar, worn over a white long-sleeved undershirt that shows as white cuffs at both wrists and as a white hem below the purple hem at his hips. Baggy dark-navy shorts ending just above the knees. Bare shins. Purple high-top sneakers with white soles, white toe caps and white laces. Bare hands with normal fingertips. No headband, no skateboard, no yo-yos.
PROPORTIONS: about 6 heads tall, anime-accurate Hunter x Hunter (2011) proportions for a slim, wiry 13-year-old: clearly shorter and slimmer than the older teenage fighters, narrow shoulders, long thin arms and legs with lean defined forearms and calves, the crotch at about half his height, a slightly larger head than an adult's but a sharp, serious face; cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not a toddler, not adult proportions, not western-realistic.
Match the attached model sheet and approved idle strip exactly: same face, hair, outfit, colors, proportions and character scale in every pose. Also attached: the new "ko" pose (pose 2 lies on the same floor line, from the same camera) and the approved "getup" strip (pose 2 must flow into its first pose).

ANIMATION: "down", slammed into the floor, then lying on the back. 2 frames in total, numbered 1 and 2 from left to right.
1. Impact: his back slams flat onto the floor from the shoulders to the hips, head on the LEFT and feet on the RIGHT; the bounce lifts his bent knees and sneakers a little toward the upper right (the feet at most about a tenth of his height off the floor); the arms flung out to the sides close to the floor. Face: pain, eyes shut, mouth open. Hair splashing out to the left.
2. At rest: lying flat on his back like the attached "ko" pose but conscious: arms out along the floor at his sides, legs straight, one knee only slightly raised, head resting on the floor. Face: eyes half shut, grimacing. The shirt splayed, the white hem showing.
FLOOR CONTACT: in pose 2 the back of his head, his shoulder blades, his back, his hips, the backs of his legs and his heels all rest on ONE straight horizontal floor line, the same line as pose 1's back. Nothing hangs in the air: the head does not lift, the arms are not raised. Both poses share the same floor line (the bottom of the image row).
MOTION: Flat and long poses, the whole back the lowest part in both.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Keep the declared source scale identical across all animations and parts; leave unused space instead of enlarging poses to fill slots.
SCALE: exactly the same character scale in every pose (same head size), the same as the attached idle strip and "ko" pose.
SCALE LOCK: preserve the approved character's skull-to-chin length, excluding hair; never enlarge or shrink the head to reach a number. Standing skeleton height is 182 px. Draw the source art at a declared common multiplier of 2x (skull 2 x the approved skull length, standing skeleton 2 x 182 px). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout.
SIZE: each pose is cut into a 256x256 game sprite where his standing body is about 182 px tall (soles to the top of the skull; the head is about 30 px; he is shorter than the other fighters, whose standing bodies are 200 px): draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. Lying, he is about 190 px long.
VIEW: he lies on his back on the floor, seen from the SIDE by the same camera as the attached idle strip, only slightly above (about 12 degrees down). NOT seen from above: not a top-down or bird's-eye view, not a spread-eagle seen from overhead. His head is on the LEFT and his feet on the RIGHT; his chest is turned only slightly toward the viewer; his right arm and right leg are nearest the viewer.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#16121f) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, the fluffy hair tufts, collarbones, knuckles, the loose shirt, sleeve and shorts folds, sneaker panels), key light from the upper right (the character's front).
PALETTE (use only these 30 colors): outline #16121f; skin #fff5ee #fde2cf #eebba3 #d39a84 #a9705f; silver-white hair, claws and eye whites #ffffff #f3f3fb #dedfee #bec0d6 #9597b4 #6b6d8c; blue eyes #9ad6ff #3d8fe0 #1d4c94; mouth #6e2633; tongue #e27d8c; purple shirt and sneakers #b8a2ec #9478d6 #6f52b4 #4c3586 #2f2058; dark navy collar and shorts #4a5888 #2f3a64 #1f2646 #141a32; white undershirt, sneaker soles, toe caps and laces #f2f0ea #dad5cc #b3ada4 #8a847c.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no lightning, no electricity, no sparks, no aura, no energy effects, no extra characters.
```

### Gojo (with ART-GOJ-BUILD)

Use his PROMPTS.md A36 / A13 blocks with the section 5 lines of BUILD_REDRAW.md (CHARACTER, PROPORTIONS, the
"expression sheet shows his face only" line, his SCALE LOCK with the build lock), his BLINDFOLD line, and replace the
ANIMATION poses, FLOOR CONTACT, LAYOUT and VIEW lines with the ones above (`ko`: at most 70 px tall, about 225 px
long: one knee bent a little so he fits inside x 4..251; `down` f0 at most 104 px). His thresholds scale with his
215 px body: contact within 6 px, no fifth more than 13 px up.

## 6. QA after `node tools/pack-sprites.mjs <id> --quantize 48 --json`

- **Ground check:** no `float above the floor line` warning for `ko` or `down`. In the JSON report, `ground.ko[0]`
  and `ground.down[0]` (it measures `down` f1) show `ok: true`: contact at least 0.4, `worst` at most 12 (Killua 11),
  height at most body height x 1.15 (Naruto / Sasuke 73, Killua 67). `ground.getup[0]` stays `ok`.
- **Fit:** no clipped, cell-margin or upscale warnings; every pixel inside x 4..251.
- **Scale:** the sidecar's `anatomy` measured per frame; the packed skull-to-chin within 2 px of the approved idle
  (CHARACTER_SCALE.md acceptance gate). The lying body is as long as the idle is tall plus hair and feet; a much
  shorter body means the pose was drawn too small, a longer one too big.
- **Continuity:** at game speed, `down` f0 → f1 → `getup` f0 reads as one fall and a kip-up from the same spot (same
  head end, same floor line, no jump of more than about 6 px); `ko` matches `down` f1's body line.
- **In game** (`?fight=<other>,<id>&mode=solo&level=hard&debug`; the brain off with `game.brains[1] = null`, the
  victim's `hp = 1`, then a light attack): during the KO orbit and in the victory shot the body lies on the floor along
  its whole length, with the contact shadow under it from head to feet, in both facings (KO them from the left and
  from the right). A heavy launcher then an air-heavy spike shows `down` f1 resting on the floor.
- **Review:** one REVIEW.md row per new version with these results (no lineup needed: no standing pose changes).
  Stop for the user's `approve vNN`.

## 7. Merge (Codex)

1. One art branch for the three fighters (`npm run pr -- start art/ko-down --full`), packed and previewed
   (`npm run pr -- preview`) so the user can look at the KO on a phone.
2. **PROMPTS.md:** replace each fighter's A36 (`ko`) and A13 (`down`) blocks with the blocks above, so a later
   regeneration keeps the rule.
3. **ANIMATIONS.md:** the `ko` / `down` entries already carry the lying rule (ADR 0020); update the QA numbers if the
   new art differs (length, height).
4. **manifest / TRACKER / REVIEW** per AGENTS.md (new versions, REVIEW rows, `approvedVersion` after the user's
   approval). No `frames`, `ms` or `bodyHeight` change.
