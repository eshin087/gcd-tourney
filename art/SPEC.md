> **Scale and anatomy ([ADR 0029](../docs/decisions/0029-title-style-scale-baseline.md), 2026-10-11):** the approved title-style cells and the [production contract](scale/title-style-pilot/PRODUCTION_CONTRACT.md) set every fighter's scale and anatomy, including new characters. The 200 px body, 31 px head, 6.5/7-head, canon-height and pixels/cm numbers in this file describe today's shipped art or a superseded direction; never use them as targets for new drawings. Inspect the actual quantized atlas: `--quantize 48` does not refresh `frames/`.

# Art spec: hi-res sprite spec v2 (ADR 0007)

The **single source of truth** for every image the game uses. If another document in `art/` disagrees
with this file, this file wins; this file follows
[ADR 0007](../docs/decisions/0007-art-spec-v2-shippuden-256.md), which fixed every v2 number. Changing a
number here needs a new ADR in `docs/decisions/` and matching updates to `art/manifest.json`,
`tools/pack-sprites.mjs` and the briefs (owner: Claude, see `docs/AI_COLLABORATION.md`).

Spec v1 (192 px cells, ~4.3-head chibi proportions, Part 1 outfits) is retired. Its one model-sheet
candidate is archived in `art/characters/naruto/reference/_old/` and recorded as rejected in
[REVIEW.md](REVIEW.md).

Contents: [Glossary](#glossary) · [Character cell](#character-cell) · [Camera and view](#camera-and-view) ·
[Proportions and landmarks](#proportions-and-landmarks) · [Pixel rules](#pixel-rules) ·
[Raw generations](#raw-generations) · [Animation list](#animation-list) ·
[Strikes and contact zones](#strikes-and-contact-zones) · [Effect anchor points](#effect-anchor-points) ·
[anims.json](#animsjson) · [Hitboxes and hurtboxes](#hitboxes-and-hurtboxes) · [Fallbacks](#fallbacks) ·
[UI images](#per-character-ui-images) · [VFX atlas](#vfx-atlas) · [Ground decals](#ground-decals) · [Files and naming](#files-and-naming) ·
[Packer](#packer) · [Game-side contract](#game-side-contract)

## Glossary

| term | meaning |
|---|---|
| cell | one 256x256 frame slot in the sheet; one pose per cell |
| strip | one raw image with all poses of one animation in a single horizontal row |
| sheet | `public/characters/<id>/sheet.png`: every cell of a character, 16 columns, row-major; past 256 cells it goes on in `sheet2.png` ... ([Sheet pages](#sheet-pages)) |
| pivot | the cell pixel that sits on the fighter's world position: `[128, 240]` (between the feet, on the floor) |
| near / far | the side of the body closer to / farther from the camera. Facing right in 3/4 view, the **near** side is the character's right side, drawn over the body; the **far** side is partly hidden behind it |
| lead / rear | orthodox stance: the **lead** (far, left) hand and foot are forward, the **rear** (near, right) ones are back |
| phases | `[startup, active, recovery]` frame counts of an attack strip |
| active frame | a frame where the strike is fully out; only active frames get a hitbox |
| hurtbox / hitbox | where the body can be hit / where the attack hits, in frame-local px |
| lane | the depth row a fighter stands in (2.5D). A hit needs box overlap **and** the same lane |
| candidate | one generated image of an asset, saved with a version suffix `_vNN` and queued in [REVIEW.md](REVIEW.md) |
| version | the two-digit `NN` of a candidate (`v01`, `v02`, ...); never reused, the highest is the latest |
| approved version | the candidate the user approved; recorded as `approvedVersion` in `manifest.json` |

## Character cell

| property | value |
|---|---|
| cell | **256 x 256 px**, transparent PNG, one pose per cell |
| sheet columns | **16** (sheet width 4096 px; 154 frames per character = 10 rows = 2560 px tall; with the 4 kit animations 175 frames = 11 rows = 2816 px). At most **16 rows** (4096 px, 256 cells) per sheet page: the frames past them go on `sheet2.png` ([Sheet pages](#sheet-pages)) |
| facing | **right** (the engine mirrors the sprite when the fighter faces left) |
| pivot | **[128, 240]**: x 128 = midpoint between the feet / body center line; y 240 = floor line. Soles touch y 240, 16 px empty below |
| airborne / lying poses | the lowest body pixel also rests on y 240 (the engine moves the sprite in the air). Lying poses are drawn **side-on from the same 12 degree camera**, never from above: head, back, hips and legs rest on y 240 along the body (packer ground check: at least 40 % of the body's width within 6 px of y 240, no fifth of its length more than 12 px above it, at most bodyHeight x 1.15 tall; see [Lying poses](#lying-poses), ADR 0020) |
| pixelsPerUnit | **128** (a 200 px standing body is about 1.56 world units, about the same world size as v1 and the placeholder) |
| colors | at most **48** per character (the packer warns above 64) |
| outline | 1 px dark outline (selective / colored outline allowed) |
| cell margin | keep every opaque pixel inside **x 4..251, y 4..240** so nothing gets clipped |

## Camera and view

- **3/4 view**: the body is turned about **35 degrees toward the camera**; the head is turned a bit
  more so **both eyes show**.
- The camera is slightly above (about **12 degrees** down): the top of the head and shoulders
  read a little; the far foot sits a few px higher than the near foot.
- **Strikes go horizontally toward screen-right** (punches, kicks, palms, thrusts). The only
  exception is `airHeavy` (down-forward) and the overhead follow-through of `heavy`.
- Key light from the **upper-front-right** (the character's front).
- Sprites are billboards: never draw a floor, ground shadow, or perspective floor plane.

## Proportions and landmarks

- Era: **Naruto Shippuden** designs (both starter fighters are about 16). Each character's
  `CHARACTER.md` describes the outfit.
- **About 6.5 heads tall**, anime-accurate: the official Shippuden look, **not chibi, not
  super-deformed, not western-realistic**. Serious, athletic anatomy: longer legs, defined shoulders,
  a smaller head.
- **Standing upright body** (soles to top of skull, not counting hair): **about 200 px**; the head
  (top of skull to chin) is **about 31 px**. Hair may add up to about **20 px** above the skull.
- The fighting stance (idle) has bent knees, so its total height **including hair** is about **204 px**.
- **Every character uses the same body scale**: a 200 px standing body, so the landmarks below hold
  for every fighter and a hit lands at the same heights on anyone. Both current characters use the
  same `bodyHeight` table; per-character overrides stay possible in `manifest.json` (for example when
  a character's hair adds clearly more or less height than ~16-20 px, so the head would come out a
  different size). A genuinely taller or shorter character needs an ADR and a reach/lunge check by Claude:
  [ADR 0010](../docs/decisions/0010-per-character-body-scale.md) sets the rule. The character gets
  `standingBodyPx` in `manifest.json` and a `bodyHeight` table scaled by `standingBodyPx / 200`, the head
  stays ~31 px, and strike zones stay the same. Today **Killua is 182 px** and **Gojo is 215 px**.

Landmarks for the idle fighting stance, y in the 256 cell, soles on y 240 (use them to aim strikes;
a same-size opponent's body is at the same heights):

| landmark | y |
|---|---|
| top of hair | 36 |
| top of skull | 52 |
| eyes | 66-70 |
| chin | 83 |
| shoulders | 92 |
| chest | 96-124 |
| stomach / belt | 124-150 |
| hips / crotch | 152 |
| knees | 196 |
| soles (floor) | 240 |

Strike height zones on a same-size opponent: **HIGH** (face) y 58-90 · **MID** (chest) y 92-124 ·
**LOW** (stomach) y 122-152.

## Pixel rules

- Hard pixels: **no anti-aliasing, no blur, no gradients, no noise or dithering fills**.
- **3-5 tone cel shading per material** (shadow, base, light, optional deep shadow and highlight). The
  larger budget is for realistic form shading on skin, hair and the main cloth, not for noise.
- **1 px dark outline**; selective or colored outlines (darker shade of the fill) are welcome.
- **Palette <= 48 colors per character** (the packer warns above 64), built from the character's hex
  palette (`art/characters/<id>/CHARACTER.md`). Same colors in every frame.
- Same design, size and proportions in every frame. Details that are hard to keep consistent
  (logos, tiny symbols) should be simplified to a few clear pixels.
- **Smear frames** are drawn as solid shapes in the limb's colors (or a pale tint of them), never as
  motion blur or transparency.
- **No effects in body sprites**: no aura, no energy, no beam, no hit sparks, no speed lines. The
  engine draws all VFX. (A held or worn weapon, such as a shuriken in the hand or a sheathed sword, is
  part of the sprite.)

## Raw generations

What the image generator (Codex's built-in generator, or ChatGPT run by the user) should output; the
packer cleans the rest:

- Flat solid **magenta `#FF00FF`** background (never used in the character), no ground shadow,
  no text, no labels, no frame numbers, no borders or grid lines.
- One animation per image, poses in **one horizontal row**, left to right in play order, with clear
  empty space between poses (poses must not touch or overlap).
- Every pose at the **same scale** as the approved idle (the packer computes one scale per strip from the tallest
  frame, then its scale gate measures every frame's head, hair included, against the idle: see
  [CHARACTER_SCALE.md "Scale gate (automatic)"](CHARACTER_SCALE.md#scale-gate-automatic)). A raised fist or slash
  arc above the head makes the tallest frame taller and shrinks the whole person.
- Landscape images (1536 x 1024) work best. With 6.5-head bodies, a row of more than 4-5 poses gets
  small; generate long strips in two parts and stitch them (see `PIPELINE.md`). Each pose should come
  out clearly taller than its target body height so the packer only downscales (it warns when it has
  to upscale).
- Exact pixel size does not matter otherwise. The packer removes the background, trims, scales each
  strip so its tallest frame equals the animation's **body height**, and aligns the feet on the pivot.
- Every generated image is saved under a **versioned name** (`_vNN`, see [Files and naming](#files-and-naming))
  and gets a row in [REVIEW.md](REVIEW.md).

## Animation list

Canonical names, frame counts and phases come from `src/art/animGuide.js` (gameplay timing lives
in `src/game/moves.js`; the engine time-stretches attack frames over the move phases).
**Body height** = height in px of the tallest trimmed frame of the strip (hair included) in the
final 256 cell; the packer scales each strip to it. Upright poses are v1 x 204/135; horizontal and
lying poses are set so the pose also fits the 256 px width. **Core** = required before the game uses
a custom sheet by default. **ms** = default per-frame durations written to `anims.json` (used by loops
and free-running animations). Frame-by-frame descriptions: `art/characters/<id>/ANIMATIONS.md`.

| anim | frames | loop | phases (S/A/R) | body height px | core | default ms | what to draw |
|---|---|---|---|---|---|---|---|
| `idle` | 8 | yes | - | 204 | **yes** | 150 each | fighting stance, fists up, breathing bob (loop) |
| `run` | 8 | yes | - | 204 | **yes** | 60 each | run cycle; ninja run with the torso leaned forward and arms trailing straight back (loop) |
| `dash` | 2 | yes | - | 160 | **yes** | 60 each | low fast forward dash, body leaning far forward, arms back (loop) |
| `backDash` | 3 | - | - | 207 | - | 60 60 80 | quick hop backwards |
| `superDash` | 2 | yes | - | 120 | - | 50 each | flying like a missile, angled about 25 degrees upward, knees bent, one fist thrust forward (loop) |
| `jumpSquat` | 1 | - | - | 162 | - | 70 | crouch right before jumping |
| `jumpUp` | 2 | yes | - | 198 | **yes** | 80 each | rising in the air, knees tucked, one arm up (loop) |
| `jumpFall` | 2 | yes | - | 209 | **yes** | 80 each | falling, legs extending down, arms out for balance (loop) |
| `land` | 2 | - | - | 174 | **yes** | 50 70 | landing crouch, then rising |
| `light1` | 7 | - | 2/2/3 | 204 | **yes** | 30 30 40 50 50 50 30 | jab: wind-up, lead fist fully extended (2 frames), recover |
| `light2` | 7 | - | 2/2/3 | 204 | **yes** | 35 30 40 50 60 50 30 | straight punch with the rear arm: wind-up, extended (2 frames), recover |
| `light3` | 7 | - | 2/2/3 | 215 | **yes** | 40 35 45 60 60 60 30 | front kick at stomach height: knee chambered, leg extended (2 frames), recover |
| `light4` | 8 | - | 3/2/3 | 207 | **yes** | 50 45 35 40 70 70 70 40 | spinning roundhouse finisher: wind-up and spin, leg high and extended (2 frames), recover |
| `heavy` | 8 | - | 3/2/3 | 218 | **yes** | 40 35 30 50 70 70 60 30 | rising uppercut launcher: deep crouch, explode upward with the fist straight up (2 frames), land |
| `airLight1` | 5 | - | 1/2/2 | 198 | **yes** | 45 35 50 50 30 | mid-air jab |
| `airLight2` | 5 | - | 1/2/2 | 207 | - | 45 40 50 50 30 | mid-air front kick |
| `airLight3` | 6 | - | 2/2/2 | 201 | - | 50 40 50 70 60 30 | mid-air spinning kick that knocks away |
| `airHeavy` | 6 | - | 2/2/2 | 198 | **yes** | 50 45 45 70 70 40 | double-fist hammer: both fists raised overhead, then smashed down-forward |
| `guard` | 2 | yes | - | 198 | **yes** | 300 each | blocking, forearms crossed in front of the face (loop) |
| `block` | 2 | - | - | 204 | - | 60 80 | blocking while being pushed back, eyes shut |
| `hurtHigh` | 3 | - | - | 195 | **yes** | 70 90 100 | hit in the face: head snapped back, arms flung back |
| `hurtLow` | 3 | - | - | 183 | - | 70 90 100 | hit in the stomach: doubled over |
| `launched` | 2 | yes | - | 136 | **yes** | 70 each | knocked flying backwards, body arched back diagonally (not fully horizontal), limbs flailing (loop) |
| `spin` | 4 | yes | - | 160 | - | 60 each | tumbling head over heels through the air (one full backward rotation, loop) |
| `airRecover` | 3 | - | - | 180 | - | 50 50 60 | backflip recovery in mid-air |
| `down` | 2 | - | - | 96 | **yes** | 80 420 | hitting the ground, then lying flat on the back, head toward screen-left; side-on, not seen from above ([Lying poses](#lying-poses)) |
| `getup` | 5 | - | - | 204 | **yes** | 70 60 60 80 70 | kip-up from lying on the back to standing |
| `charge` | 4 | yes | - | 198 | **yes** | 50 each | powering up: wide stance, fists clenched at the sides, shouting upward (loop) |
| `throw` | 4 | - | 1/1/2 | 201 | - | 50 60 70 50 | throwing a projectile in mid-air: arm cocked back, whipped forward, follow-through |
| `beamCharge` | 3 | yes | - | 198 | **yes** | 50 each | charging a beam: both hands cupped together at the rear hip, shouting (loop) |
| `beamFire` | 3 | yes | - | 198 | **yes** | 50 each | firing a beam: both arms thrust straight forward, palms open, shouting (loop) |
| `vanish` | 2 | - | - | 221 | - | 50 each | crouch and blur before teleporting; the spot dodge holds frame 00 (the crouch), so keep it at or below the idle's height |
| `stagger` | 4 | yes | - | 207 | - | 150 each | dizzy stagger (loop) |
| `ko` | 1 | - | - | 64 | - | 500 | knocked out, lying flat on the back, head toward screen-left; side-on, not seen from above ([Lying poses](#lying-poses)) |
| `special` | 8 | - | 3/3/2 | 204 | **yes** | 120 120 120 120 120 160 110 70 | signature rush move: 3 frames charging the technique in hand, 2 running frames holding it forward, 1 thrust, 2 recover |
| `intro` | 4 | yes | - | 210 | - | 150 each | pre-fight intro pose (character-specific attitude, loop) |
| `taunt` | 2 | yes | - | 212 | - | 250 each | confident taunt / pointing at the opponent (loop) |
| `win` | 4 | yes | - | 212 | **yes** | 200 each | victory pose (loop) |
| `specialForward` | 7 | - | 2/2/3 | 204 | - | 50 50 60 80 70 60 50 | **kit** ([ADR 0009](../docs/decisions/0009-move-system-v2.md)): the forward special's strike or cast (Killua's Rhythm Echo strike, Gojo's Reversal: Red flick). Missing → `special` |
| `specialUp` | 6 | - | 2/2/2 | 214 | - | 50 50 60 60 70 70 | **kit**: a rising special (Killua's Thunderbolt leap; f5 hands over to `airHeavy` f0). Missing → `special` |
| `specialDown` | 4 | - | 2/1/1 | 204 | - | 80 80 160 90 | **kit**: a stance or power-up, no hit box (Killua's Godspeed activation, Gojo's Infinity palm). Missing → `charge` |
| `superPose` | 4 | yes | - | 208 | - | 140 each | **kit**: the second super's pose during the super flash (Whirlwind, Domain Expansion hand sign; Gojo lifts the blindfold here). Missing → `taunt` |
| `beamStruggle` | 3 | yes | - | 198 | - | 70 each | **struggle** ([ADR 0034](../docs/decisions/0034-beam-clash-visuals.md)): the beam clash push: braced and straining, the fighter's 1-bar energy technique thrust forward in the hand(s) against the opponent's (front knee bent, back leg driving, hair and clothes blown back; loop). Only fighters with an energy move draw it (not Luffy). Missing → `beamFire` |
| `beamStruggleAir` | 3 | yes | - | 190 | - | 70 each | **struggle** (ADR 0034): the same struggle from the air: hovering low, legs tucked under the body, the air energy technique driven down-forward at a target below (hair and clothes blown back and up; loop). Only fighters with an air energy shot draw it (Killua, Sasuke, Gojo). Missing → the `throw` release frame, held |
| `techGround` | 4 | - | 1/2/1 beats | 204 | - | 67 83 83 67 | **tech** ([Tech poses](#tech-poses), ADR 0030): ground tech in place: impact brace low on the floor, push up, rise, back in the fighting stance. Missing → `land` |
| `techRoll` | 6 | - | 1/4/1 beats | 162 | - | 50 63 62 63 62 67 | **tech**: ground tech roll: shoulder contact, one tight forward roll toward screen-right (4 quarter turns), low crouch. Missing → `airRecover` |
| `wallTech` | 5 | - | 2/1/2 beats | 209 | - | 50 50 67 67 66 | **tech**: wall tech: lands feet-first on a wall at the cell's left (2 frames), pushes off toward screen-right, airborne recovery into `jumpFall`. Missing → `land`, then `airRecover` |
| `light1Alt` | 7 | - | 2/2/3 | 204 | - | 30 30 40 50 50 50 30 | **alt** ([Attack alts](#attack-alts), ADR 0031) of `light1`: another technique at the jab's height and reach (e.g. a short hook or a backfist). Missing → `light1` |
| `light2Alt` | 7 | - | 2/2/3 | 204 | - | 35 30 40 50 60 50 30 | **alt** of `light2`: e.g. a front snap kick to the midsection, the foot at the fist's reach. Missing → `light2` |
| `light3Alt` | 7 | - | 2/2/3 | 215 | - | 40 35 45 60 60 60 30 | **alt** of `light3`: e.g. a low sweep; **it stays a low** (light3 is `low` in MOVES). Missing → `light3` |
| `light4Alt` | 8 | - | 3/2/3 | 207 | - | 50 45 35 40 70 70 70 40 | **alt** of `light4`: e.g. a stepping double-palm shove at chest height; it still sends them forward (wall bounce). Missing → `light4` |
| `heavyAlt` | 8 | - | 3/2/3 | 218 | - | 40 35 30 50 70 70 60 30 | **alt** of `heavy`: e.g. a rising flip kick; it still launches upward. Missing → `heavy` |
| `airLight1Alt` | 5 | - | 1/2/2 | 198 | - | 45 35 50 50 30 | **alt** of `airLight1`: e.g. a mid-air backfist. Missing → `airLight1` |
| `airLight2Alt` | 5 | - | 1/2/2 | 207 | - | 45 40 50 50 30 | **alt** of `airLight2`: e.g. a mid-air knee. Missing → `airLight2` |
| `airLight3Alt` | 6 | - | 2/2/2 | 201 | - | 50 40 50 70 60 30 | **alt** of `airLight3`: e.g. a mid-air roundhouse; it still knocks them forward. Missing → `airLight3` |
| `airHeavyAlt` | 6 | - | 2/2/2 | 198 | - | 50 45 45 70 70 40 | **alt** of `airHeavy`: e.g. an axe kick chopping down-forward; it still spikes downward. Missing → `airHeavy` |
| `hurtHighAlt` | 3 | - | - | 195 | - | 70 90 100 | **alt** of `hurtHigh`: another reaction to a hit in the face (e.g. head and shoulders snapped sideways). Missing → `hurtHigh` |
| `hurtLowAlt` | 3 | - | - | 183 | - | 70 90 100 | **alt** of `hurtLow`: another reaction to a hit in the body (e.g. folding sideways, one arm clutching the ribs). Missing → `hurtLow` |
| `fTilt` | 7 | - | 2/2/3 | 204 | - | 35 30 40 50 60 50 30 | **normal** ([Directional normals](#directional-normals), ADR 0042): forward tilt: a long strike at chest height (a stepping straight punch or a side kick). Missing → `light2` |
| `uTilt` | 7 | - | 2/2/3 | 218 | - | 40 35 40 60 60 50 30 | **normal** ([Directional normals](#directional-normals), ADR 0042): up tilt: an anti-air strike in an arc over the head, reaching a standing opponent in front on its way up. Missing → `heavy` |
| `dTilt` | 6 | - | 2/2/2 | 215 | - | 35 30 50 50 50 30 | **normal** ([Directional normals](#directional-normals), ADR 0042): down tilt: a quick low poke from a crouch, the strike at shin height (LOW). Missing → `light3` |
| `dashAttack` | 7 | - | 2/2/3 | 207 | - | 40 40 50 60 60 60 40 | **normal** ([Directional normals](#directional-normals), ADR 0042): dash attack: a running lunge strike carrying the run forward (a flying kick or a shoulder charge). Missing → `light4` |
| `fSmash` | 9 | - | 4/2/3 | 207 | - | 50 60 50 40 40 70 70 60 40 | **normal** ([Directional normals](#directional-normals), ADR 0042): forward smash: a big wind-up into a full-body blow at chest height; frame 2 is the pose it holds while charging. Missing → `light4` |
| `uSmash` | 8 | - | 3/2/3 | 218 | - | 50 40 30 50 70 70 60 30 | **normal** ([Directional normals](#directional-normals), ADR 0042): up smash: a powerful strike straight up from a crouch, hitting above the head. Missing → `heavy` |
| `dSmash` | 8 | - | 3/2/3 | 215 | - | 50 40 30 50 70 70 60 30 | **normal** ([Directional normals](#directional-normals), ADR 0042): down smash: a low strike to both sides at once (a spinning sweep, or both fists slammed down on either side); draw the strikes on both sides. Missing → `light3` |
| `fair` | 6 | - | 2/2/2 | 207 | - | 45 40 50 60 50 30 | **normal** ([Directional normals](#directional-normals), ADR 0042): forward air: a mid-air strike in front, the main aerial. Missing → `airLight2` |
| `bair` | 6 | - | 2/2/2 | 201 | - | 50 40 50 70 60 30 | **normal** ([Directional normals](#directional-normals), ADR 0042): back air: a mid-air strike BEHIND the body (toward screen-left while the body faces right), the strongest aerial. Missing → `airLight3` mirrored |
| `uair` | 6 | - | 2/2/2 | 218 | - | 45 40 50 60 50 30 | **normal** ([Directional normals](#directional-normals), ADR 0042): up air: a mid-air strike straight up over the head. Missing → `heavy` |

Totals: 38 animations, 154 frames per character; 23 core animations. Every fighter has a kit
([ADR 0011](../docs/decisions/0011-kit-baseline-and-balance.md)), so every fighter also draws the 4 **kit**
animations (optional for the `complete` flag because they fall back): 42 animations, 175 frames, an 11-row
sheet. The three **tech** strips ([Tech poses](#tech-poses)) are optional for every fighter and fall back too: with them,
45 animations, 190 frames, a 12-row sheet (4096 x 3072). The eleven **alt** strips ([Attack alts](#attack-alts)) are optional
for every fighter as well: with all of them, 56 animations, 255 frames, a 16-row sheet (4096 x 4096, still inside a
4096 texture). A fighter whose ultimate is not a beam redraws `beamCharge` / `beamFire` as the charge and release poses
of whatever uses them (Sasuke: Kirin); the names stay, the content follows the kit. The optional `beamStruggle` (ADR 0034)
follows the fighter's 1-bar energy move the same way (Naruto's Rasengan, Sasuke's Chidori Spear, Killua's Narukami, Gojo's
Reversal: Red, Goku's Dragon Fist): one more 3-frame strip, and `beamStruggleAir` for a fighter with an air energy shot
(Killua's air Narukami, Sasuke's Great Fireball, Gojo's air Red). `special`, `intro`, `taunt` and
`win` timings may differ per character (see `manifest.json`). The ten **normal** strips of the
[Directional normals](#directional-normals) (ADR 0042) add 68 frames: a fighter with every alt and all of them is past the
256 cells of one 4096 sheet: the packer puts the frames past them on a second page, `sheet2.png`
([Sheet pages](#sheet-pages), TOOL-060).

**Pose notes forced by the 256 px width.** A realistic body lying flat or flying is about 210-240 px
long, so:

- `superDash` flies **angled about 25 degrees upward with the knees bent** (fits about 230 px wide),
  not stretched fully horizontal.
- `down` and `ko` lie flat with the **head toward screen-left**, about 210 px long.
- `launched` is **arched diagonally**, not fully horizontal.
- Wide strikes (`light3`, `light4`, `airLight2`, `airLight3`) must keep the back foot and hair inside
  x 4 and the striking foot inside x 251; the contact zones below already respect that.

<a id="tech-poses"></a>

**Tech poses** (`techGround`, `techRoll`, `wallTech`; [ADR 0030](../docs/decisions/0030-tech-recovery-animations.md)).
The engine plays them on the tech state's own clock in three beats, `DEFENSE` `animPhases` in `src/game/moves.js`
(contact / main motion / settle, in 60 fps frames; the art's `phases` are frames per beat), so the art never changes a
tech's timing, invulnerability or movement:

| strip | beats in game frames | art frames per beat | what each beat shows |
|---|---|---|---|
| `techGround` | 4 / 10 / 4 (18 f) | 1 / 2 / 1 | brace on impact (invulnerable) · push up and rise (invulnerable to f14) · stance |
| `techRoll` timed | 3 / 15 / 4 (22 f) | 1 / 4 / 1 | shoulder contact · the tumble (invulnerable to f18) · low crouch |
| `techRoll` hold-Guard | 3 / 15 / 2 (20 f) | 1 / 4 / 1 | the same strip on the shorter roll |
| `wallTech` | 6 / 4 / 8 (18 f) | 2 / 1 / 2 | the cling (exactly the 6-frame stick) · the push-off · the airborne recovery into `jumpFall` |

- **Orientation.** Every strip faces right like the rest of the sheet. `techRoll` is a **forward** roll toward screen-right;
  a fighter rolling away from the opponent plays its tumble beat backward (a back roll) without turning around, so the
  four tumble frames are even quarter turns that read in either order. The roll keeps the facing it started with on
  screen, even when the opponent crosses over mid-roll. `wallTech` has its **wall at the cell's left**, behind the
  fighter: on the ring barrier's left and right walls (the x walls, at a screen side) the game turns the strip away from
  the wall and puts its wall line on the barrier; on the front and back walls (the z walls, seen in depth) the fighter
  keeps facing the opponent and the strip is re-centred on the fighter (`wallAnchor` below). The facing for gameplay
  never changes.
- **Wall contact.** The packer puts the leftmost opaque pixel of the cling and push-off frames (beats 1-2: frames 0-2)
  on the **wall line, x 8** (just inside the 4 px cell margin), not on the pivot: a full diagonal push-off has the whole
  cell width, x 8-251, to reach right. The game draws that line on the barrier (`wallLine` below). So the soles drawn
  flat on the wall must be the leftmost part of the figure, with the near hand optionally on the same line; hair, scarf
  and headband tails trail up or to the right, never past the soles. The packer warns `wallTech: N cling frame(s) barely
  touch the wall line` when fewer than about 12 opaque px (at a 200 px standing body) of a cling frame lie on x 8-11.
  The push-off frame only needs its toes there. A frame that still clips is reposed inside the cell at the same
  anatomical scale; never lower `bodyHeight` below it. The airborne frames are centred on the feet as usual. The wall
  jump (↑ at the kick) shows the cling, then the push-off frame for 4 frames, then `jumpUp`: no extra strip.
- **Scale.** One anatomical scale with the approved neutral and idle: the same head, torso and limb lengths, folded or
  braced. **Never stretch a tucked, rolling or braced pose to a standing height.** The tallest frame sets the strip's
  `bodyHeight`: the stance of `techGround` (the idle's height), the crouch of `techRoll` (about the `jumpSquat` crouch),
  the airborne recovery of `wallTech` (about `jumpFall`); a fighter drawn at another stature sets them in its manifest
  entry. The packer warns when a tucked or braced frame leaves its height band against the idle's median height:
  `techGround` brace 0.45-0.85, `techRoll` shoulder contact and tumble 0.30-0.68, `wallTech` cling 0.35-0.90.
- **Scale gate.** The probe cannot read a head in the shoulder contact, the tumble or the rotated cling: `techRoll`
  frames 0-4 and `wallTech` frames 0-2 are reported **not read** (manifest `spec.scaleGate.lowConfPhases`), the
  readable frames are judged as usual, and a strip that passes on them is `partial`, which is not a pass: a candidate
  needs a person's `scaleManualQA` record of that version (unread frames compared with the approved neutral at one
  scale: head, torso, limb lengths, not the box height) before it ships. `techGround` is measured in full.
- **Transitions.** `techGround` f3 and `techRoll` f5 hand over to `idle`; `wallTech` f4 hands over to `jumpFall`; their
  first frames follow `launched` / `spin` (a body falling into the floor or the wall). Keep `down` and `ko` separate:
  a tech never lies down.

<a id="directional-normals"></a>

**Directional normals** (`fTilt`, `uTilt`, `dTilt`, `dashAttack`, `fSmash`, `uSmash`, `dSmash`, `fair`, `bair`,
`uair`; [ADR 0042](../docs/decisions/0042-smash-directional-normals.md)). Smash-style moves picked by the stick: tilts
(→ / ↑ / ↓ + Light), smash attacks (→ / ↑ / ↓ + Heavy), the dash attack and the forward, back and up airs. All optional:
until a sheet has one, the move shows the strip in the fallback table below and uses its boxes (the back air shows
`airLight3` mirrored). The move data in `src/game/moves.js` never depends on the drawing. Drawing rules:

- **Strike where the move hits.** The hit boxes come from the drawn fist or foot on the active frames, so each strike has
  to reach its zone: `fTilt` and `fSmash` MID (chest), `dTilt` and `dSmash` LOW (shins), `uTilt` and `uSmash` an arc
  from in front of the face up over the head (an up tilt must still reach a standing opponent in front), `uair` above
  the head, `fair` in front at the body's height, `bair` behind the body ([Strikes and contact
  zones](#strikes-and-contact-zones)).
- **`bair` is drawn facing right with the strike to the LEFT** (behind): the engine knows it hits behind. `dSmash` draws
  a strike on both sides on its active frames.
- **`fSmash` frame 2 is the charge pose**: the engine holds it while Heavy is held (up to a second), so it reads as
  gathering power (weight back, fist or leg cocked).
- Same title-style body as every other strip ([PRODUCTION_CONTRACT.md](scale/title-style-pilot/PRODUCTION_CONTRACT.md));
  crouches and lunges are posed, not resized.

<a id="attack-alts"></a>

**Attack alts** (`light1Alt` ... `light4Alt`, `heavyAlt`, `airLight1Alt` ... `airLight3Alt`, `airHeavyAlt`, `hurtHighAlt`,
`hurtLowAlt`; [ADR 0031](../docs/decisions/0031-attack-alt-animations.md)). Every attack and both hit reactions may have
one alternate strip. The game alternates each base with its alt in a fixed, balanced pattern (never the same version
three times in a row; `src/game/animAlts.js`) and plays the base while the alt is missing, so an alt only adds
variety: it never changes a move. The move data stays the base's (startup, active, recovery, damage, reach, launch in
`src/game/moves.js`), and so do the **hit and hurt boxes**: the packer copies the base's boxes onto the alt frame for
frame, so what connects and what can be hit never depend on the alt's drawing (amended 2026-10-14). The rules:

- **Same frame count and phases** as the base strip (the table above). The engine stretches either over the base
  move's startup / active / recovery.
- **Drawn to land where the base's hit lands.** The hit spark appears where the base's boxes meet the opponent, so
  the alt's fist or foot has to reach that spot on its active frames ([Strikes and contact
  zones](#strikes-and-contact-zones)). The packer reads the alt's own drawn strike (its auto hit box, or a
  `hitboxes.json` entry on the alt pointing at the fist or foot; that entry only feeds this check) and warns
  `<alt>: drawn strike reach ...` / `drawn strike height ...` when it lands more than **24 px** from the base's hit
  (cell px, facing right). Keep each move's character: a mid-height strike stays mid-height (`light3`'s contact is a
  front kick to the body even though the move counts as a low), `heavyAlt` rises, `light4Alt` and `airLight3Alt`
  drive forward, `airHeavyAlt` comes down. A hit reaction alt keeps the height it was hit at (face or body).
- **Same frame count as the base** is also what lets the boxes copy frame for frame: an alt with another frame count
  keeps its own boxes, and the packer warns.
- **Start and end on the base's poses.** The first frame leaves from the base's first pose and the last frame returns
  to its recovery pose, so any mix of base and alt in a string blends. Air alts start and end in the air base pose.
- **A different technique**: another limb or motion, not a re-pose of the same strike.
- **The same anatomy at the idle's scale** (one anatomical scale with the approved neutral and idle, the measuring rule
  of the current scale round); the alt's `bodyHeight` starts at its base's.

The packer also warns when an alt's frame count or phases differ from its base's, and when an alt is packed without
its base. All of it warns, never fails.

<a id="lying-poses"></a>

**Lying poses** (`ko`, the resting `down` frame, the first `getup` frame; [ADR 0020](../docs/decisions/0020-lying-pose-ground-contact.md)).
The body lies on the floor and the camera sees it **from the side**, from the same spec camera as every other pose
(about 12 degrees down), never from above: a spread-eagle seen from overhead touches y 240 with one hand or shoe and
hangs its head 15-35 px in the air, which reads as floating in the game. Draw:

- the **back of the head, the shoulder blades, the back, the hips, the backs of the legs and the heels** all on one
  horizontal floor line (y 240), arms limp along the sides on the floor; the far limbs at most about 8 px higher than
  the near ones (the 12 degree camera), the chest turned only slightly toward the viewer;
- the pose **flat and long**: about 3 times as wide as it is tall, no higher than the table's body height (`ko` 64,
  `down` 96 on the bounce frame, the resting frame lower); a bent knee stays low;
- the same character scale as the idle (SCALE LOCK): a lying body is as long as the standing one is tall, plus
  the hair and the feet; never enlarge it to fill the canvas.

The packer checks every resting lying frame and warns `<anim>: N lying frame(s) float above the floor line` unless at
least **40 %** of the body's columns have their lowest pixel within **6 px** of y 240, **no fifth** of the body's length
is more than **12 px** above it at its lowest, and the frame is at most **bodyHeight x 1.15** tall (px at a 200 px
standing body, scaled with `standingBodyPx`). `down`'s bounce frame and `getup`'s rising frames may leave the floor.
The game lays the contact shadow along the whole lying body (anims.json `footprint`).

## Strikes and contact zones

The user-facing rule: **when the game shows a hit, the fist or foot must visibly touch the body.**
On active frames the striking point must be the **forward-most** part of the silhouette (no hair,
scarf, sword hilt or cloth sticking out further forward), extended **horizontally toward
screen-right**, at the height of the zone it hits. Coordinates are frame-local px in the final 256
cell, facing right. Active-frame numbers are the same as in v1.

| anim | strike point | active frames | zone | contact zone (x, y px) |
|---|---|---|---|---|
| `light1` | lead (far) fist | 02, 03 | HIGH | x 206-226, y 64-86 |
| `light2` | rear (near) fist | 02, 03 | HIGH | x 214-236, y 70-92 |
| `light3` | near foot (sole/heel) | 02, 03 | LOW | x 222-246, y 122-148 |
| `light4` | kicking foot | 03, 04 | HIGH | x 224-248, y 56-88 |
| `heavy` | rear (near) fist | 03, 04 | HIGH (chin), then overhead | F03 x 180-208, y 58-86; F04 x 160-188, y 22-46 |
| `airLight1` | lead fist | 01, 02 | MID | x 206-230, y 100-120 |
| `airLight2` | near foot | 01, 02 | LOW (stomach) | x 220-246, y 130-155 |
| `airLight3` | kicking heel | 02, 03 | MID | x 222-248, y 105-150 |
| `airHeavy` | both clasped fists | 02, 03 | down-forward | x 180-218, y 160-206 |
| `throw` | throwing hand (release point) | 01 | release point | x 186-212, y 116-142 |
| `beamFire` | both palms (beam origin) | all (loop) | beam origin | x 222-238, y 112-132 |
| `beamStruggle` | the technique hand (stream origin) | all (loop) | stream origin | x 196-240, y 100-150; record it as `hand` on every frame |
| `beamStruggleAir` | the technique hand, driven down-forward (stream origin) | all (loop) | stream origin | x 190-240, y 110-170; record it as `hand` on every frame |
| `special` | technique hand | 03, 04, 05 | LOW (stomach) | x 194-222, y 128-158 |

Notes: the `heavy` row names the fist, but the striking limb is the fighter's own launcher (Sasuke's rising foot,
Killua's claw, Gojo's elbow then palm heel, KIT.md); the F03 / F04 zones are the same for every limb. The `heavy` F04
zone (y 22-46) is where the overhead fist can reach at bodyHeight 218 (the top of
the tallest frame sits at about y 22); ADR 0007 originally listed y 8-32. **Chidori-type specials** (the
hand trails low behind at the lightning anchor (64, 199) during startup and the run): frames 03-04 hit
with the leading shoulder/head (a `hitboxes.json` override); only 05, the thrust, uses the hand zone
x 194-222, y 128-158.

Hit detection uses the packed boxes, so **where the art puts the fist is where the hit lands**: a
strike that stops short of its contact zone simply misses at normal spacing. Claude tunes `reach` /
`lunge` in `src/game/moves.js` to the packed boxes so attacks connect at normal combo range. An attack alt plays its
base's move with its base's boxes, copied frame for frame by the packer ([Attack alts](#attack-alts)).

## Effect anchor points

**Art packs set their own anchor points (since 2026-10-10).** For a packed sheet the engine puts
hand effects (Rasengan / Chidori / Rasenshuriken orbs), projectile spawns and the beam origin at the
frame's **hand point**: the frame's `hand` from `hitboxes.json` (below), else the frame's hit box (60 %
across, mid height), else the nearest frame of the same animation that has one. Measure the drawn palm
on frames without a hit box (special startup, `throw` release, `beamFire`) and record it as `hand`.
Only when an animation has no hand point at all does the engine use the fixed offsets below (the
baked placeholder always uses them). Convert: **px = (128 + forward x 128, 240 - up x 128)**.

| what | engine offset (world units from the feet) | cell px (x, y) |
|---|---|---|
| Rasengan-type orb in hand (startup + active, including the thrust frame) | 0.6 forward, 0.72 up | (205, 148); the full-size orb is about 86 px across, so keep the palm within ~15 px of this point on every frame |
| Chidori-type lightning, startup + whole active phase (hand trailing low behind; also on the thrust frame) | 0.5 back, 0.32 up | (64, 199) |
| Chidori-type lightning, impact / recovery after a hit (the impact frame, ~6 game frames; not the thrust frame) | 0.7 forward, 0.78 up | (218, 140) |
| beam origin (`beamFire` palms) | 0.8 forward, 0.92 up | (230, 122) |
| stream origin (`beamStruggle` technique hand: the Rasengan palm, the spear hand, Red's fingertips) | its `hand` per frame | about (218, 125) |
| projectile spawn (`throw` release) | 0.5 forward, 0.9 up | (192, 125) |
| projectile / beam aim point on the opponent (chest) | 0.8-0.85 up | y 131-138 |

Known gap (task ENG-015): the Chidori lightning stays at the back point for the whole active phase,
so on a whiffed rush it sits behind the leg while the thrust frame's hand is forward. Until the
engine switches to the forward point for the last third of the active phase, the thrust frame's
hand may trail or thrust as the character brief says, but the brief must note where the lightning is.

## anims.json

Written by the packer next to `sheet.png` in `public/characters/<id>/`; read by the game.

```json
{
  "frameWidth": 256,
  "frameHeight": 256,
  "columns": 16,
  "pivot": [128, 240],
  "pixelsPerUnit": 128,
  "facing": "right",
  "source": "art-pack",
  "complete": true,
  "animations": {
    "idle":   { "frames": [0, 1, 2, 3, 4, 5, 6, 7], "durations": [150, 150, 150, 150, 150, 150, 150, 150], "loop": true },
    "light1": { "frames": [8, 9, 10, 11, 12, 13, 14], "durations": [30, 30, 40, 50, 50, 50, 30], "loop": false, "phases": [2, 2, 3] }
  },
  "boxes": {
    "0":  { "hurt": [[100, 44, 58, 196]], "hit": [] },
    "10": { "hurt": [[102, 44, 64, 196]], "hit": [[204, 64, 24, 22]] }
  }
}
```

- `frames`: sheet cell indices, row-major (index = row x 16 + column), numbered straight through the pages of a
  fighter with more than one ([Sheet pages](#sheet-pages)).
- `durations`: ms per frame. `loop`: whether it cycles.
- `phases` (attacks only): number of frames in `[startup, active, recovery]`.
- `boxes`: keyed by **sheet frame index** (string). `[x, y, w, h]` in frame-local px of the 256 cell
  (origin = top-left of the cell, facing right). `hit` only on active frames of attacks. `"hit": []`
  means "this frame cannot hit"; a frame with no `hit` key falls back to the move's reach numbers. The
  engine grows hit boxes slightly before the overlap test (`boxPad` in `src/game/moves.js`: 0.1 x /
  0.12 y world units by default, 0.18 / 0.45 for air attacks; at ppu 128 that is about 13 x 15 px and
  23 x 58 px) so a fist that visibly brushes the body counts.
- `complete`: `true` only when every core animation is present.
- `source`: `"art-pack"` for packer output.
- `scaleAudit` (packer output since TOOL-025, dev tools only): the scale gate's measurement. `ref.box` = the idle
  f0 head box `[x0, y0, x1, y1]` (cell px), `ref.headPx`; per animation `head` (median head scale vs the idle, 1.00 =
  idle), `feet`, `verdict` (`ref ok uniform drift pop unmeasured exempt`), `v` (the strip's version), `frames` (each
  frame's head scale) and `boxes` (each frame's head box). `?scaleaudit` logs the flagged strips as they play, the
  test lab draws the boxes, `scaleReport()` (`?debug`) lists them. The game ignores it otherwise.
- `footprint` (only when the pack has lying frames): `{ "<sheet frame>": [x0, x1] }`, the opaque x span (inclusive
  cell px) of every `ko` and `down` frame and the first `getup` frame. The engine stretches the contact shadow along
  it ([Lying poses](#lying-poses)).
- `wallAnchor` (only when the pack has a `wallTech` strip): `{ "<sheet frame>": px }`, for every wall-anchored frame
  (the cling and push-off), where the body's centre was packed against the pivot (px right of it; negative when it
  lies left of the pivot, as it usually does). The engine shifts the frame back by it on a wall seen in depth.
- `wallLine` (with `wallAnchor`): the cell column the packer put the wall-anchored frames' leftmost pixel on (8). On a
  wall at a screen side the engine draws that column on the barrier ([Tech poses](#tech-poses)).
- `pages` and `pageFrames` (only when the fighter has more than 256 frames): the sheet page files in order and the
  cells per page ([Sheet pages](#sheet-pages)).

### Sheet pages

A sheet page is at most **4096 x 4096 px** (16 columns x 16 rows of 256 px cells, **256 frames**): the texture limit of
the phones the game targets, so no page is ever downscaled (blurry) on one. A fighter with more frames (every alt plus
the [Directional normals](#directional-normals) is about 320) continues on `sheet2.png`, then `sheet3.png` ... in the
same folder (TOOL-060, [ADR 0007](../docs/decisions/0007-art-spec-v2-shippuden-256.md) amendment 2026-10-18):

```json
  "columns": 16,
  "pages": ["sheet.png", "sheet2.png"],
  "pageFrames": 256,
```

- Frames are numbered **straight through** the pages: frame `f` is on page `floor(f / pageFrames)` (0 = `sheet.png`),
  at cell `f % pageFrames` of it, row-major. `boxes`, `footprint`, `wallAnchor` and the animations' `frames` keep these
  numbers, so nothing else in `anims.json` changes. A strip may run across a page boundary.
- Every page is 4096 px wide; each is only as tall as its frames need (the last one is usually shorter).
- A fighter with 256 frames or fewer has no `pages` or `pageFrames` key and one `sheet.png`, exactly as before.
- `src/art/sheetPages.js` (`frameCell`, `sheetFiles`) is the one place the game, the art review page and the tools
  find a frame's page and cell. A repack onto fewer pages deletes the pages left over.
- To see a fighter on two pages before it has 256 frames (engine or tool work), pack it with `--page-rows <n>` (n rows
  per page, e.g. `node tools/pack-sprites.mjs naruto --page-rows 8`); never commit such a pack.

## Hitboxes and hurtboxes

- **hurt** = where the body can be hit. **hit** = only on ACTIVE frames: where the fist, foot,
  palm or weapon actually is.
- The engine registers a hit only when an attacker hitbox overlaps the defender hurtbox **and**
  both fighters are in the same depth lane.
- Auto boxes (packer):
  - hurt = opaque bounding box, inset **18 %** on each side horizontally and **4 %** from the top.
  - hit (active frames only), first rule that applies:
    1) forward strike: the part of the silhouette that extends forward (screen-right) beyond the
       idle pose's bounding box `maxX - 9 px` (6 px at the spec v1 scale, scaled by
       standingBodyPx / 136), as one box (the limb only: the box stops where the
       columns get torso-thick, and a guard fist next to a kick is left out);
    2) rising strike above the **standing head** (uppercut): the fist/forearm blob around the highest pixel
       (when it rises further above the standing head than it reaches forward, this rule is tried first). The
       standing head is the top of the fighter's approved upright cell (`art/scale/builds.json` fighter
       `standingReference.cells`, the title-style neutral cell), not the idle's: the title-style idles are crouched
       combat stances (Killua's is 146 px tall against a 186 px neutral), so against the idle every upright pose's
       hair "rose above the head". A fighter without a `standingReference` keeps the idle as the measure (TOOL-037);
    3) otherwise the forward-most **28 %** of the bounding box, full height.
  - That is why the idle pose must stay compact (lead fist around x 170-185, the v1 position at the v2
    scale) and the strike must be the forward-most point.
- **Overrides**: `art/characters/<id>/hitboxes.json` replaces the auto boxes for the frames it
  lists (coordinates in 256-cell px, inside the contact zones above):

```json
{
  "light1": {
    "2": { "hit": [[204, 64, 24, 22]] },
    "3": { "hit": [[206, 64, 24, 22]] }
  },
  "down": {
    "1": { "hurt": [[28, 196, 200, 44]] }
  }
}
```

  Keys: animation name, then **frame number within the animation, 0-based** (the same `NN` as
  `frames/<anim>/<anim>_NN.png`). Values: `hit` and/or `hurt` lists of `[x, y, w, h]` in final
  256-cell px, and optionally `hand: [x, y]`, the palm / fingertip point effects anchor to (see
  "Effect anchor points"), e.g. `"special": { "0": { "hand": [168, 116] } }`. `"hit": []` turns a frame's hit off. A template lives in
  `art/characters/_template/hitboxes.example.json`.

## Fallbacks

A missing animation plays a similar one (`FALLBACK` in `src/game/sprites.js` at the time of writing),
repeated until something exists (last resort `idle`):

| missing | plays | missing | plays |
|---|---|---|---|
| intro, taunt, win | idle | jumpSquat | land |
| land, getup, guard, charge, run, jumpUp | idle | block | guard |
| hurtLow, stagger, launched, down | hurtHigh | airLight1 | airLight -> light3 |
| airLight2 | airLight1 | airLight3 | airLight2 |
| airHeavy, special, light4 | heavy | throw, beamFire, heavy | light1 |
| light2, light3 | light1 | beamCharge | charge |
| ko | down | dash | run |
| superDash | dash | backDash | jumpFall |
| airRecover | jumpUp | vanish | dash |
| spin | launched | jumpFall | jumpUp |
| techGround, wallTech | land | techRoll | airRecover |
| light1Alt ... airHeavyAlt | its base (`light1` ...) | hurtHighAlt, hurtLowAlt | hurtHigh, hurtLow |
| beamStruggle | beamFire | beamStruggleAir | throw (its release frame, held) |
| fTilt | light2 | uTilt, uSmash, uair | heavy |
| dTilt, dSmash | light3 | dashAttack, fSmash | light4 |
| fair | airLight2 | bair | airLight3, mirrored |

The tech strips are also switched on per strip: until a sheet has one, the engine keeps showing exactly what that tech
showed before (`land`; `airRecover`; the wall tech's `land` cling, `airRecover` kick and `jumpUp` wall jump). An attack alt
is picked only when the sheet has it as its own strip ([Attack alts](#attack-alts)); a FALLBACK to its base is never
counted as an alt.

## Per-character UI images

Optional. UI image sizes did not change in v2. Save each generated candidate as
`art/characters/<id>/raw/ui_<name>_vNN.png` (the packer skips `ui_*` files in `raw/`) and queue it
in [REVIEW.md](REVIEW.md). When the user approves one, Codex copies it to `ui/<name>.png`. The packer
removes a magenta background and fits `ui/<name>.png` to the **exact** size below (transparent art:
trimmed and contain-fitted, bottom-aligned for portrait/select; opaque art: center-cropped to the
aspect ratio), using nearest-neighbor or "mode" sampling, and writes it to `public/characters/<id>/`.
A file that already has the exact size is copied as is, so hand touch-ups go into `ui/<name>.png` at
final size.

| file | size | content |
|---|---|---|
| `ui/portrait.png` | 96 x 96 | head and shoulders, facing right, transparent background, same pixel style |
| `ui/cutin.png` | 480 x 128 | DBFZ super-flash eye strip: both eyes and brows, intense expression. The face fills the strip (opaque); a flat background band color (the character color or dark navy) may show only around the eyes/brows. No speed lines: the HUD adds them |
| `ui/select.png` | 384 x 384 | full-body character-select art, facing right, transparent background |
| `ui/super_bg.png` | 768 x 192 | super banner backdrop (4:1), opaque, no character or text ([ADR 0035](../docs/decisions/0035-super-banners-and-ultimate-splashes.md), brief: [characters/SUPER_ART_BRIEF.md](characters/SUPER_ART_BRIEF.md)) |
| `ui/super_fg.png` | 384 x 240 | the fighter chest-up in the super's pose, facing right, transparent, contain-fitted and bottom-aligned; the HUD lets it break out of the 192 banner's top |
| `ui/ult_bg.png` | 768 x 432 | ultimate splash backdrop (16:9), opaque, focal symbol inside the middle 4:3 |
| `ui/ult_fg.png` | 576 x 432 | the fighter, three-quarter to full figure, in the ultimate's pose, facing right, transparent, bottom-aligned |

The four super/ultimate layers are optional and fall back one by one (no `bg`: speed-line stripes; no `fg`: the eye
strip), so `cutin.png` stays required as the fallback and as the eye flash.

## VFX atlas

Custom effect art replaces the procedural atlas (`src/art/vfxPainter.js`) effect by effect.
Engine names are fixed. Brief: `art/vfx/EFFECTS.md`. VFX cells did not change in v2.

- Cell **128 x 128**, transparent, `ppu` **56**. Center-anchored effects are centered on (64, 64);
  bottom-anchored effects (`dust`, `flame`, `streak`) are centered on x 64 with their base on **y 120**.
- Hard-edged pixel art. **white (tinted)** effects are drawn in white / light grey only (alpha
  allowed in 3-4 hard steps) because the engine multiplies a color into them.
- Raw: `art/vfx/raw/<effect>_vNN.png` strip on magenta (the packer uses the highest version; a plain
  `raw/<effect>.png` only when no versioned file exists; rejected versions move to
  `art/vfx/raw/_rejected/`). Final frames: `art/vfx/frames/<effect>/<effect>_NN.png`.
- The packer scales each strip with one factor so its largest frame = `fill` x 128 px (the
  procedural effect's world size) and keeps each frame's position inside the strip row (details:
  `art/vfx/README.md` "Packing notes"). `glow` is drawn as opaque grey rings and converted luma ->
  alpha.
- Packer output: `public/vfx/atlas.png` + `public/vfx/atlas.json`:
  `{ "cell": 128, "cols": <max frames>, "rows": <n effects>, "ppu": 56, "anims": { "<name>": { "row": r, "n": frames, "ms": ms } } }`.
  Missing effects fall back to the procedural ones.

| effect | frames | ms | color rule | anchor | what |
|---|---|---|---|---|---|
| `spark` | 5 | 30 | white (tinted) | center | crescent hit-spark slash with a small star tip |
| `burst` | 5 | 35 | white (tinted) | center | spiky radial impact burst that hollows out |
| `ring` | 6 | 35 | white (tinted) | center | expanding flattened shock ring (ellipse ~0.55 tall) |
| `dust` | 6 | 60 | full color | bottom (y 120) | ground dust puffs (beige), drifting up and out |
| `smoke` | 7 | 55 | full color | center | cool white/grey smoke cloud (substitution / vanish poof; no pink or lavender) |
| `shuriken` | 4 | 40 | full color | center | spinning 4-point shuriken (one quarter turn over the loop) |
| `fire` | 4 | 60 | full color | center | fireball (red-orange-yellow-white core) |
| `flame` | 7 | 55 | white (tinted) | bottom (y 120) | single aura flame tongue rising and fading |
| `lightning` | 6 | 40 | white (tinted) | center | crackling lightning bolts from the center (Chidori) |
| `orb` | 6 | 40 | full color | center | spiraling blue wind sphere (Rasengan) |
| `glow` | 2 | 60 | white (tinted) | center | soft round glow disc in 3 hard alpha steps |
| `streak` | 6 | 45 | white (tinted) | bottom (y 120) | thin vertical aura light streak rising |
| `star` | 5 | 40 | white (tinted) | center | four-point twinkle shrinking |
| `crater` | 3 | static (3 random variants) | full color | decal: center (64, 64), drawn straight top-down | cracked floor decal; 3 variants, one picked at random (not an animation) |
| `lines` | 4 | 40 | white (tinted) | center | radial manga impact lines |
| `clashBurst` | 6 | 45 | white (tinted) | center | beam clash (ADR 0034): the knot where two streams collide, a roiling core spraying jagged spikes up and down (loop) |
| `streamBolt` | 4 | 40 | white (tinted) | center, **tiles** | Narukami stream: a horizontal band of thick branching zigzag lightning (loop) |
| `streamLance` | 4 | 40 | white (tinted) | center, **tiles** | Chidori Spear stream: a thin straight lightning blade with crackle (loop) |
| `streamFlame` | 4 | 50 | full color | center, **tiles** | Great Fireball stream: a horizontal band of rolling fire (loop) |
| `redOrb` | 6 | 40 | full color | center | Reversal: Red held in a struggle: a crimson sphere, white-hot core, a ring pushing out (loop) |

**Tiling bands** (`streamBolt`, `streamLance`, `streamFlame`): the engine lays the frames end to end along a stream, so
each frame runs the full cell width, centered on y 64, and column 0 continues column 127 seamlessly. Deliver them as
exact 128 x 128 frames in `art/vfx/frames/<effect>/` (cut from the versioned raw); the packer keeps such frames as they are
and warns about a frame that does not reach both cell edges.

The `crater` effect is superseded by the ground decals below (the engine draws ground damage with them);
it stays in the atlas only as long as the engine still reads it. No new `crater` art.

## Ground decals

Cracks, craters, scorches and scars left on the ring, the grass, the ki barrier and the stand walls
([ADR 0024](../docs/decisions/0024-ground-damage-decals.md)). Custom art replaces the procedural decals
(`src/art/decalPainter.js`) name by name. Engine names are fixed. Brief: `art/decals/DECALS.md`;
prompts: `art/decals/PROMPTS.md`; workflow and packing notes: `art/decals/README.md`.

- **Own atlas, not VFX**: `ppu` **64** (the approved ring floor's density): a 256 px cell = 4 world
  units, a 512 px cell = 8. The engine scales a decal to the size the hit calls for, so the cell is the
  whole decal, cracks included.
- **31 names** in 7 style groups (`base`, `edge`, `lightning`, `fire`, `chakra`, `cursed`, `ki`), cells
  256 x 256, 512 x 512, 256 x 128, 512 x 128 or 512 x 256, 2-8 variants each (143 in all). The table is
  in `art/decals/README.md` and `DECAL_SPECS` in `tools/pack-decals.mjs` (the manifest restates it in
  `decals.items`; drift is warned).
- **Modes**: `flat` decals are drawn **straight top-down** with **radial shading only** (the engine
  rotates them freely and lights them); `wall` decals (`barrier_crack`, `crater_wall`) are face-on and
  never rotated. **Directional** decals are drawn with the motion **left to right**.
- **Colors**: hard pixel art, binary alpha, **<= 24 colors per name**, palettes in `DECALS.md`.
  **Hot key**: pure **#FFFFFF** marks glowing hot seams in the hot-key names (the engine glows them in the
  fighter's tint, then cools them); no other pixel is pure white. `barrier_crack` is **white only**
  (tinted, drawn additive). Never magenta, pink, purple or violet.
- **Raw**: `art/decals/raw/<name>_vNN.png` on a 1536 x 1024 magenta canvas, the variants in one row, or
  **parts of one version** `<name>_vNN_A.png`, `_B.png`, `_C.png` (joined in letter order by the packer).
  Rejected versions move to `art/decals/raw/_rejected/`. Final cells: `art/decals/frames/<name>/<name>_NN.png`.
- The packer splits each image into its count from `DECALS.md` (extra pieces such as the halves of a
  broken ring are joined by slot, in order), scales each image so its largest variant fills **97%** of the
  cell (`erasure_trench` tiles: every variant is stretched to the full width), centers every variant,
  snaps near-white to the hot key in hot-key names and tones it down elsewhere, converts the tinted name
  to greyscale, and caps colors at 24 with the hot key kept exact.
- **Packer output** `public/decals/atlas.json` + one PNG page per page set (base + edge = the floor set,
  chakra + ki, lightning + fire, cursed: `decals_<set>.png`, or `decals_<set>_1.png`, `_2.png` ... when a
  set needs several), each <= 2048 x 2048, a name never split across pages. A match loads the floor
  pages (2) plus one element set per fighter: at most 4, the engine's cap (the report checks it):
  `{ "ppu": 64, "source", "packer", "pages": [...], "pageSizes": [[w, h], ...], "decals": { "<name>": { "page", "w", "h", "frames": [[x, y], ...], "mode": "flat"|"wall", "tinted", "group", "directional"?, "hotKey"?, "tile"?, "version" } } }`.
  Only approved names ship; the rest stay procedural. `--candidates` writes `public/preview/decals/`.
- **Style sheet first**: `art/decals/reference/decal_style_sheet_vNN.png` needs the user's approval; the
  approved copy `decal_style_sheet.png` is attached to every decal prompt, and the claim queue holds the
  decal batches back until it exists.

## Files and naming

**Versioning rule (ADR 0007).** Every generated image gets a two-digit version suffix `_vNN` (`v01`,
`v02`, ...). Versions are **never overwritten and never reused**: the next candidate of an asset is
1 + the highest number used for that asset anywhere (its folder, `raw/_parts/`, the `_rejected/`
folder and [REVIEW.md](REVIEW.md)). The highest version still in the folder is always the latest candidate.
Rejected versions move to a `_rejected/` subfolder (ignored by the packer). Every candidate gets a row
in [REVIEW.md](REVIEW.md); `manifest.json` records each asset's latest `version` and its
`approvedVersion`.

```
art/characters/<id>/
  reference/model_sheet_vNN.png   model-sheet candidates: turnaround (front, 3/4 right, side, back),
                                  fighting stance, palette swatches
  reference/model_sheet.png       COPY of the approved candidate (identity anchor every prompt attaches)
  reference/expressions_vNN.png   expression-sheet candidates
  reference/expressions.png       COPY of the approved candidate
  reference/idle_approved.png     COPY of the approved idle strip (pose + proportion anchor)
  reference/notes.md              optional: what was fixed between attempts
  reference/_rejected/            rejected reference candidates (keep their names)
  reference/_old/                 archived art from an older spec (e.g. the spec v1 candidate)
  reference/source/               optional, local only: official pictures for the user's own comparison
                                  (copyrighted: never uploaded to an image generator, never committed
                                  to a public repo)
  raw/<anim>_vNN.png              one generated strip per animation candidate, poses left -> right;
                                  the packer uses the highest version
  raw/<anim>.png                  legacy unversioned strip: used only when no versioned file exists
  raw/<anim>_NN.png               single frames (NN = 00, 01, ...; no v): an animation delivered frame
                                  by frame
  raw/_parts/<anim>_vNN_A.png, _B.png   long strips generated in parts (stitched into raw/<anim>_vNN.png)
  raw/<anim>_NN_fixMM.png         single-frame fix-up attempts (NN = frame, MM = attempt; skipped; the
                                  patched strip is saved as the next raw/<anim>_vNN.png)
  raw/ui_<name>_vNN.png           UI candidates (portrait, cutin, select; skipped by the sheet packer)
  raw/_rejected/                  rejected strip and UI candidates (keep their names)
  raw/_proposed/, raw/_old/       art the engine does not read yet / old attempts
  frames/<anim>/<anim>_NN.png     cleaned 256x256 frames (packer output; hand touch-ups go here)
  ui/portrait.png cutin.png select.png   COPY of the approved UI candidate (or a touched-up final-size file)
  hitboxes.json                   optional box overrides
art/vfx/raw/<effect>_vNN.png      VFX strip candidates (highest version packed); rejected -> art/vfx/raw/_rejected/
art/vfx/reference/vfx_style_sheet_vNN.png   VFX style-sheet candidates; approved one copied to vfx_style_sheet.png
art/vfx/raw/_proposed/<charId>_<effect>_vNN.png   character-specific effect art waiting for engine support
art/decals/raw/<name>_vNN.png     ground-decal candidates (or parts <name>_vNN_A.png, _B.png ... of one version); rejected -> raw/_rejected/
art/decals/reference/decal_style_sheet_vNN.png   decal style-sheet candidates; approved one copied to decal_style_sheet.png
art/ui/raw/<asset>_vNN.png        shared UI candidates (logo, title art); approved one cleaned into art/ui/final/
art/REVIEW.md                     the review queue: one row per candidate
```

The sheet packer reads `raw/<anim>_vNN.png` (highest version), else `raw/<anim>.png`, else
`raw/<anim>_NN.png`. It skips `ui_*`, `fx_*` and `*_fix<digits>.png` files and every subfolder of `raw/`
(`_parts/`, `_rejected/`, `_proposed/`, `_old/`) without a warning.

- Animation names are **camelCase exactly as in the table** (`airLight1`, not `air_light_1`).
- `NN` is two digits. Frame numbers are 0-based (`_00`); versions start at `v01`.
- Character ids are lowercase ascii letters, digits and `_` (not leading: the packer skips folders
  that start with `_` or `.`), e.g. `naruto`, `sasuke`, `rock_lee`.

## Packer

`tools/pack-sprites.mjs` (Node ESM, `pngjs`):

```bash
npm run sprites            # every character
npm run sprites naruto     # one character
npm run sprites vfx        # the VFX atlas (approved effects only)
npm run sprites crowd      # the crowd atlas (approved spectators only)
npm run sprites decals     # the ground-decal atlas and pages (approved decals only)
npm run test:sprites       # packer regression test (after any change to tools/)
npm run sprites naruto -- --update-manifest   # also raise status / version in manifest.json
```

`--update-manifest` raises `status` (`raw` / `packed`) and `version` (the highest `_vNN` found); it
never lowers a status and never touches `approvedVersion`.

The packer reads the cell numbers from the **`spec` block of `manifest.json`** (`frameWidth`,
`frameHeight`, `columns`, `pivot`, `pixelsPerUnit`, `facing`, `maxColors`, `warnColors`,
`rawBackground`, `standingBodyPx`, `cellMargin`, `versionSuffix`), with the v2 values as defaults.

For each character folder (except `_template` and other `_`/`.` folders) and each animation in
`manifest.json`, it takes `frames/<anim>/*.png` if present (see below), else the **highest-version**
`raw/<anim>_vNN.png`, else `raw/<anim>.png`, else `raw/<anim>_NN.png`, and **prints which file it
used** (and notes when that candidate is newer than the manifest's `approvedVersion`: the highest
version is packed even before it is approved, so a rejected one must move to `raw/_rejected/`). A
strip is split at empty columns, or by the expected frame count. It removes the flat
background (corner color / magenta, flood fill from the edges plus near-magenta pixels), trims,
downscales with palette-preserving "mode" sampling so the tallest frame equals `bodyHeight` (times the fighter's
`packScale`, ADR 0041: a whole fighter resized against the cast, its `frameOffsets` and `hitboxes.json` points with it; a
strip's own `animations.<anim>.packScale` multiplies it for one strip drawn at the wrong size). `--quantize 48 --keep-palette`
keeps the current sheet's palette and each colour's previous choice, so a repack that resizes one strip changes no other
(nearest-neighbor if upscaling, with a warning), puts the feet center (mean x of opaque pixels in the
bottom 20 % of rows) on x 128 and the lowest opaque pixel on y 240, and writes 256x256 cells into the
16-column sheet (16 rows per page; past 256 frames `sheet2.png` ..., [Sheet pages](#sheet-pages)). It computes boxes,
applies `hitboxes.json`, writes cleaned frames back to `frames/<anim>/` when they came from `raw/`, writes
`public/characters/<id>/sheet.png` (+ its other pages) + `anims.json`,
fits and copies `ui/*.png`, and prints a report (packed animations and source files, missing core
animations, frame-count mismatches, frames clipped by the cell margin, palettes over 64 colors, attack alts whose frame
count, phases or strike differ from their base's: [Attack alts](#attack-alts)). Missing folders never crash it.

Packer-written `frames/<anim>/` folders carry a `.packer.json` marker: they are re-imported
automatically when the chosen raw file changes (a new `_vNN` counts as a change). Delete
`frames/<anim>/` only if you hand-edited it and want to discard the edits (hand-edited frames win over
a newer raw, with a warning).

**Scale gate** (TOOL-025, [ADR 0021](../docs/decisions/0021-scale-gate-and-depth-normalized-sprites.md),
[CHARACTER_SCALE.md](CHARACTER_SCALE.md#scale-gate-automatic)): after packing, every strip's head silhouette (hair
included) and feet are measured against the idle of the same pack. A strip off by more than ±6 %, or with a pop of
more than 12 points inside it, fails the pack (exit code 1, and nothing is written for that fighter: the last pack
stays) when it is not approved yet (a candidate version, a new fighter) or with `--strict-scale`; approved strips are
listed as findings until they are fixed. Exemptions (`scaleExempt`, `scaleExemptFrames`) name the strip version they
cover (`scaleExemptVersion`). The result goes into
the report (`scale gate (...)` line, `~` findings, `scale gate:` failures) and into `anims.json` (`scaleAudit`).
Opt-in **auto head fit**: a raw strip with the sidecar `{ "anatomy": { "measurement": "auto-head" } }` (or
`--fit-head <id>:<anim>`) whose verdict is `uniform` is rescaled from the raw by 1/head, once (an applied factor is
kept in the frames marker as `autoHead`; an unfitted request is measured again on every pack), and its `hitboxes.json` boxes follow. Two-part strips are joined with
`npm run stitch` (a measured factor). `npm run scale` writes `art/scale/heads-<id>.png`, `scale-report.json`,
`scale-baseline.json` and, with `--guide`, `reference/head_scale_guide.png`.

## Game-side contract

Implemented by the lead engineer (Claude) in `src/`; documented here so art and code agree:

- The game loads `public/characters/<id>/anims.json` + `sheet.png` when present and
  `"complete": true`, or with the URL flag `?art=custom` for partial previews. Otherwise it uses
  the procedural placeholder (which stays chibi until a separate restyle task).
- It reads frame size, pivot and ppu from `anims.json` (`SheetAsset` / `SpriteActor`), so v2 needs no
  engine change. ppu 128 switches the sharper HD render mode on automatically.
- A sheet page is at most 4096 x 4096 ([Sheet pages](#sheet-pages)): full size on desktop GPUs and on phones with a
  4096 px texture limit; a GPU with a 2048 px limit gets downscaled pages (three.js warns). The game loads every page
  `anims.json` lists, uploads them all at match start (no stall on a page's first frame mid-fight) and draws each frame
  from its page (`SheetAsset.page`, `SpriteActor.usePage`). A page that fails to load, or is too small for its frames,
  sends the fighter to the placeholder with one `[sprites]` warning.
- It uses `boxes` for hit detection.
- It alternates each attack and hit reaction with its `<anim>Alt` strip when the sheet has one, in a fixed pattern
  (`src/game/animAlts.js`; `?alts=0` never, `?alts=1` always), on the base move's timing ([Attack alts](#attack-alts)).
- It loads `portrait.png` / `cutin.png` when present.
- It loads `public/vfx/atlas.png` + `atlas.json` when present (approved effects only; missing effects stay
  procedural). `?art=custom` prefers the unapproved candidates in `public/preview/` (local only).
- It loads `public/decals/atlas.json` and the pages it needs when present and merges them per name over the
  procedural decals (one `[decals]` console line; any error falls back to procedural).
- Combat uses 2.5D lanes: attacks fire along the screen horizontal and auto-step to line up
  depth; a hit needs hitbox/hurtbox overlap **and** the same lane.
