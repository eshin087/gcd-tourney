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
[UI images](#per-character-ui-images) · [VFX atlas](#vfx-atlas) · [Files and naming](#files-and-naming) ·
[Packer](#packer) · [Game-side contract](#game-side-contract)

## Glossary

| term | meaning |
|---|---|
| cell | one 256x256 frame slot in the sheet; one pose per cell |
| strip | one raw image with all poses of one animation in a single horizontal row |
| sheet | `public/characters/<id>/sheet.png`: every cell of a character, 16 columns, row-major |
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
| sheet columns | **16** (sheet width 4096 px; 154 frames per character = 10 rows = 2560 px tall) |
| facing | **right** (the engine mirrors the sprite when the fighter faces left) |
| pivot | **[128, 240]**: x 128 = midpoint between the feet / body center line; y 240 = floor line. Soles touch y 240, 16 px empty below |
| airborne / lying poses | the lowest body pixel also rests on y 240 (the engine moves the sprite in the air) |
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
  different size). A genuinely taller or shorter character needs an ADR and a reach/lunge check by Claude.

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
- Every pose at the **same scale** (the packer computes one scale per strip from the tallest frame).
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
| `down` | 2 | - | - | 96 | **yes** | 80 420 | hitting the ground, then lying flat on the back, head toward screen-left |
| `getup` | 5 | - | - | 204 | **yes** | 70 60 60 80 70 | kip-up from lying on the back to standing |
| `charge` | 4 | yes | - | 198 | **yes** | 50 each | powering up: wide stance, fists clenched at the sides, shouting upward (loop) |
| `throw` | 4 | - | 1/1/2 | 201 | - | 50 60 70 50 | throwing a projectile in mid-air: arm cocked back, whipped forward, follow-through |
| `beamCharge` | 3 | yes | - | 198 | **yes** | 50 each | charging a beam: both hands cupped together at the rear hip, shouting (loop) |
| `beamFire` | 3 | yes | - | 198 | **yes** | 50 each | firing a beam: both arms thrust straight forward, palms open, shouting (loop) |
| `vanish` | 2 | - | - | 221 | - | 50 each | crouch and blur before teleporting |
| `stagger` | 4 | yes | - | 207 | - | 150 each | dizzy stagger (loop) |
| `ko` | 1 | - | - | 64 | - | 500 | knocked out, lying flat on the back, head toward screen-left |
| `special` | 8 | - | 3/3/2 | 204 | **yes** | 120 120 120 120 120 160 110 70 | signature rush move: 3 frames charging the technique in hand, 2 running frames holding it forward, 1 thrust, 2 recover |
| `intro` | 4 | yes | - | 210 | - | 150 each | pre-fight intro pose (character-specific attitude, loop) |
| `taunt` | 2 | yes | - | 212 | - | 250 each | confident taunt / pointing at the opponent (loop) |
| `win` | 4 | yes | - | 212 | **yes** | 200 each | victory pose (loop) |

Totals: 38 animations, 154 frames per character; 23 core animations. `special`, `intro`, `taunt` and
`win` timings may differ per character (see `manifest.json`).

**Pose notes forced by the 256 px width.** A realistic body lying flat or flying is about 210-240 px
long, so:

- `superDash` flies **angled about 25 degrees upward with the knees bent** (fits about 230 px wide),
  not stretched fully horizontal.
- `down` and `ko` lie flat with the **head toward screen-left**, about 210 px long.
- `launched` is **arched diagonally**, not fully horizontal.
- Wide strikes (`light3`, `light4`, `airLight2`, `airLight3`) must keep the back foot and hair inside
  x 4 and the striking foot inside x 251; the contact zones below already respect that.

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
| `special` | technique hand | 03, 04, 05 | LOW (stomach) | x 194-222, y 128-158 |

Notes: the `heavy` F04 zone (y 22-46) is where the overhead fist can reach at bodyHeight 218 (the top of
the tallest frame sits at about y 22); ADR 0007 originally listed y 8-32. **Chidori-type specials** (the
hand trails low behind at the lightning anchor (64, 199) during startup and the run): frames 03-04 hit
with the leading shoulder/head (a `hitboxes.json` override); only 05, the thrust, uses the hand zone
x 194-222, y 128-158.

Hit detection uses the packed boxes, so **where the art puts the fist is where the hit lands**: a
strike that stops short of its contact zone simply misses at normal spacing. Claude tunes `reach` /
`lunge` in `src/game/moves.js` to the packed boxes so attacks connect at normal combo range.

## Effect anchor points

The engine draws signature-move energy, beams and projectiles at fixed offsets from the fighter
(read from `src/game/effects.js` and `src/game/projectiles.js` when this spec was written). The
offsets in world units did not change in v2; only their pixel position moved:
**px = (128 + forward x 128, 240 - up x 128)**. Draw the hands **at these points** so the VFX sits in
the hand. If the art needs different points, write the measured coordinates in the character's
`MOVES_AND_VFX.md` and Claude moves the offsets.

| what | engine offset (world units from the feet) | cell px (x, y) |
|---|---|---|
| Rasengan-type orb in hand (startup + active, including the thrust frame) | 0.6 forward, 0.72 up | (205, 148); the full-size orb is about 86 px across, so keep the palm within ~15 px of this point on every frame |
| Chidori-type lightning, startup + whole active phase (hand trailing low behind; also on the thrust frame) | 0.5 back, 0.32 up | (64, 199) |
| Chidori-type lightning, impact / recovery after a hit (the impact frame, ~6 game frames; not the thrust frame) | 0.7 forward, 0.78 up | (218, 140) |
| beam origin (`beamFire` palms) | 0.8 forward, 0.92 up | (230, 122) |
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

- `frames`: sheet cell indices, row-major (index = row x 16 + column).
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
    2) rising strike above the idle head (uppercut): the fist/forearm blob around the highest pixel
       (when it rises further above the idle head than it reaches forward, this rule is tried first);
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
  256-cell px. `"hit": []` turns a frame's hit off. A template lives in
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
npm run sprites vfx        # the VFX atlas
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
downscales with palette-preserving "mode" sampling so the tallest frame equals `bodyHeight`
(nearest-neighbor if upscaling, with a warning), puts the feet center (mean x of opaque pixels in the
bottom 20 % of rows) on x 128 and the lowest opaque pixel on y 240, and writes 256x256 cells into the
16-column sheet. It computes boxes, applies `hitboxes.json`, writes cleaned frames back to
`frames/<anim>/` when they came from `raw/`, writes `public/characters/<id>/sheet.png` + `anims.json`,
fits and copies `ui/*.png`, and prints a report (packed animations and source files, missing core
animations, frame-count mismatches, frames clipped by the cell margin, palettes over 64 colors).
Missing folders never crash it.

Packer-written `frames/<anim>/` folders carry a `.packer.json` marker: they are re-imported
automatically when the chosen raw file changes (a new `_vNN` counts as a change). Delete
`frames/<anim>/` only if you hand-edited it and want to discard the edits (hand-edited frames win over
a newer raw, with a warning).

## Game-side contract

Implemented by the lead engineer (Claude) in `src/`; documented here so art and code agree:

- The game loads `public/characters/<id>/anims.json` + `sheet.png` when present and
  `"complete": true`, or with the URL flag `?art=custom` for partial previews. Otherwise it uses
  the procedural placeholder (which stays chibi until a separate restyle task).
- It reads frame size, pivot and ppu from `anims.json` (`SheetAsset` / `SpriteActor`), so v2 needs no
  engine change. ppu 128 switches the sharper HD render mode on automatically.
- Sheets are 4096 x 2560: fine on desktop GPUs; a GPU with a 2048 px texture limit gets a downscaled
  sheet (three.js warns).
- It uses `boxes` for hit detection.
- It loads `portrait.png` / `cutin.png` when present.
- It loads `public/vfx/atlas.png` + `atlas.json` when present (missing effects stay procedural).
- Combat uses 2.5D lanes: attacks fire along the screen horizontal and auto-step to line up
  depth; a hit needs hitbox/hurtbox overlap **and** the same lane.
