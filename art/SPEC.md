# Art spec: hi-res sprite spec v1

The **single source of truth** for every image the game uses. If another document disagrees with
this file, this file wins. Changing a number here needs an ADR in `docs/decisions/`
and matching updates to `art/manifest.json`, `tools/pack-sprites.mjs` and the briefs (owner:
Claude, see `docs/AI_COLLABORATION.md`).

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
| cell | one 192x192 frame slot in the sheet; one pose per cell |
| strip | one raw image with all poses of one animation in a single horizontal row |
| sheet | `public/characters/<id>/sheet.png`: every cell of a character, 16 columns, row-major |
| pivot | the cell pixel that sits on the fighter's world position: `[96, 180]` (between the feet, on the floor) |
| near / far | the side of the body closer to / farther from the camera. Facing right in 3/4 view, the **near** side is the character's right side, drawn over the body; the **far** side is partly hidden behind it |
| lead / rear | orthodox stance: the **lead** (far, left) hand and foot are forward, the **rear** (near, right) ones are back |
| phases | `[startup, active, recovery]` frame counts of an attack strip |
| active frame | a frame where the strike is fully out; only active frames get a hitbox |
| hurtbox / hitbox | where the body can be hit / where the attack hits, in frame-local px |
| lane | the depth row a fighter stands in (2.5D). A hit needs box overlap **and** the same lane |

## Character cell

| property | value |
|---|---|
| cell | **192 x 192 px**, transparent PNG, one pose per cell |
| sheet columns | **16** (sheet width 3072 px; ~154 frames per character = 10 rows = 1920 px tall) |
| facing | **right** (the engine mirrors the sprite when the fighter faces left) |
| pivot | **[96, 180]**: x 96 = midpoint between the feet / body center line; y 180 = floor line. Soles touch y 180, 12 px empty below |
| airborne / lying poses | the lowest body pixel also rests on y 180 (the engine moves the sprite in the air) |
| pixelsPerUnit | **86** (a 136 px standing body is about 1.58 world units, same world size as the old placeholder) |
| colors | at most **32** per character (the packer warns above 48) |
| outline | 1 px dark outline (selective / colored outline allowed) |
| sheet margin | keep every pixel at least 4 px inside the cell (x 4..187, y 4..180) so nothing gets clipped |

## Camera and view

- **3/4 view**: the body is turned about **35 degrees toward the camera**; the head is turned a bit
  more so **both eyes show**.
- The camera is slightly above (about **12 degrees** down): the top of the head and shoulders
  read a little; the far foot sits 2-4 px higher than the near foot.
- **Strikes go horizontally toward screen-right** (punches, kicks, palms, thrusts). The only
  exception is `airHeavy` (down-forward) and the overhead follow-through of `heavy`.
- Key light from the **upper-front-right** (the character's front).
- Sprites are billboards: never draw a floor, ground shadow, or perspective floor plane.

## Proportions and landmarks

- Anime-accurate design, slightly stylized for readability: **about 4 to 4.5 heads tall**
  (head about 30-34 px).
- **Standing body height** (soles to top of skull, upright, not counting spiky hair): **about
  136 px**. Hair may add up to about **16 px**.
- The fighting stance (idle) has bent knees, so its total height including hair is about **135 px**.
- **Every character uses the same body scale** (decision for v1): a 136 px standing body, so the
  landmarks below hold for every fighter and a hit lands at the same heights on anyone. Characters
  differ only in what sits on top: hair, hats or ears change the trimmed height, so a character whose
  hair adds less height (Sasuke's swept-back hair) gets proportionally lower `bodyHeight` values in
  `manifest.json` (Sasuke: 6 px lower on upright poses). A genuinely taller or shorter character needs
  an ADR and a reach/lunge check by Claude.

Landmarks for the idle fighting stance, y in the 192 cell (use them to aim strikes; a same-size
opponent's body is at the same heights):

| landmark | y (approx.) |
|---|---|
| top of hair | 45 |
| top of skull | 58 |
| eyes | 72-76 |
| chin | 88 |
| shoulders | 94 |
| chest | 98-112 |
| stomach / belt | 112-126 |
| hips / crotch | 130 |
| knees | 155 |
| soles (floor) | 180 |

Strike height zones on the opponent: **HIGH** (face) y 66-92 · **MID** (chest) y 94-114 ·
**LOW** (stomach) y 110-130.

## Pixel rules

- Hard pixels: **no anti-aliasing, no blur, no gradients, no noise or dithering fills**.
- **3-4 tone cel shading per material** (shadow, base, light, optional highlight).
- **1 px dark outline**; selective or colored outlines (darker shade of the fill) are welcome.
- **Palette <= 32 colors per character**, built from the character's hex palette
  (`art/characters/<id>/CHARACTER.md`). Same colors in every frame.
- Same design, size and proportions in every frame. Details that are hard to keep consistent
  (logos, tiny symbols) should be simplified to a few clear pixels.
- **Smear frames** are drawn as solid shapes in the limb's colors (or a pale tint of them), never as
  motion blur or transparency.
- **No effects in body sprites**: no aura, no energy, no beam, no hit sparks, no speed lines. The
  engine draws all VFX. (A small held weapon such as a shuriken in the hand is fine.)

## Raw generations

What the ChatGPT image generator should output (the packer cleans the rest):

- Flat solid **magenta `#FF00FF`** background (never used in the character), no ground shadow,
  no text, no labels, no frame numbers, no borders or grid lines.
- One animation per image, poses in **one horizontal row**, left to right in play order, with clear
  empty space between poses (poses must not touch or overlap).
- Every pose at the **same scale** (the packer computes one scale per strip from the tallest frame).
- Landscape images (1536 x 1024) work best. Strips with more than 4-5 wide poses can be made in
  two parts and stitched (see `PIPELINE.md`).
- Exact pixel size does not matter. The packer removes the background, trims, scales each strip so
  its tallest frame equals the animation's **body height**, and aligns the feet on the pivot.

## Animation list

Canonical names, frame counts and phases come from `src/art/animGuide.js` (gameplay timing lives
in `src/game/moves.js`; the engine time-stretches attack frames over the move phases).
**Body height** = height in px of the tallest trimmed frame of the strip (hair included) in the
final cell; the packer scales each strip to it. **Core** = required before the game uses a custom
sheet by default. **ms** = default per-frame durations written to `anims.json` (used by loops and
free-running animations). Frame-by-frame descriptions: `art/characters/<id>/ANIMATIONS.md`.

| anim | frames | loop | phases (S/A/R) | body height px | core | default ms | what to draw |
|---|---|---|---|---|---|---|---|
| `idle` | 8 | yes | - | 135 | **yes** | 150 each | fighting stance, fists up, breathing bob (loop) |
| `run` | 8 | yes | - | 135 | **yes** | 60 each | run cycle; ninja run with the torso leaned forward and arms trailing straight back (loop) |
| `dash` | 2 | yes | - | 111 | **yes** | 60 each | low fast forward dash, body leaning far forward, arms back (loop) |
| `backDash` | 3 | - | - | 137 | - | 60 60 80 | quick hop backwards |
| `superDash` | 2 | yes | - | 70 | - | 50 each | flying horizontally like a missile, one fist thrust forward, legs trailing (loop) |
| `jumpSquat` | 1 | - | - | 107 | - | 70 | crouch right before jumping |
| `jumpUp` | 2 | yes | - | 131 | **yes** | 80 each | rising in the air, knees tucked, one arm up (loop) |
| `jumpFall` | 2 | yes | - | 138 | **yes** | 80 each | falling, legs extending down, arms out for balance (loop) |
| `land` | 2 | - | - | 115 | **yes** | 50 70 | landing crouch, then rising |
| `light1` | 7 | - | 2/2/3 | 135 | **yes** | 30 30 40 50 50 50 30 | jab: wind-up, lead fist fully extended (2 frames), recover |
| `light2` | 7 | - | 2/2/3 | 135 | **yes** | 35 30 40 50 60 50 30 | straight punch with the rear arm: wind-up, extended (2 frames), recover |
| `light3` | 7 | - | 2/2/3 | 142 | **yes** | 40 35 45 60 60 60 30 | front kick at stomach height: knee chambered, leg extended (2 frames), recover |
| `light4` | 8 | - | 3/2/3 | 137 | **yes** | 50 45 35 40 70 70 70 40 | spinning roundhouse finisher: wind-up and spin, leg high and extended (2 frames), recover |
| `heavy` | 8 | - | 3/2/3 | 144 | **yes** | 40 35 30 50 70 70 60 30 | rising uppercut launcher: deep crouch, explode upward with the fist straight up (2 frames), land |
| `airLight1` | 5 | - | 1/2/2 | 131 | **yes** | 45 35 50 50 30 | mid-air jab |
| `airLight2` | 5 | - | 1/2/2 | 137 | - | 45 40 50 50 30 | mid-air front kick |
| `airLight3` | 6 | - | 2/2/2 | 133 | - | 50 40 50 70 60 30 | mid-air spinning kick that knocks away |
| `airHeavy` | 6 | - | 2/2/2 | 131 | **yes** | 50 45 45 70 70 40 | double-fist hammer: both fists raised overhead, then smashed down-forward |
| `guard` | 2 | yes | - | 131 | **yes** | 300 each | blocking, forearms crossed in front of the face (loop) |
| `block` | 2 | - | - | 135 | - | 60 80 | blocking while being pushed back, eyes shut |
| `hurtHigh` | 3 | - | - | 129 | **yes** | 70 90 100 | hit in the face: head snapped back, arms flung back |
| `hurtLow` | 3 | - | - | 121 | - | 70 90 100 | hit in the stomach: doubled over |
| `launched` | 2 | yes | - | 94 | **yes** | 70 each | knocked flying backwards, body arched back, limbs flailing (loop) |
| `spin` | 4 | yes | - | 123 | - | 60 each | tumbling head over heels through the air (one full backward rotation, loop) |
| `airRecover` | 3 | - | - | 119 | - | 50 50 60 | backflip recovery in mid-air |
| `down` | 2 | - | - | 68 | **yes** | 80 420 | hitting the ground, then lying flat on the back |
| `getup` | 5 | - | - | 135 | **yes** | 70 60 60 80 70 | kip-up from lying on the back to standing |
| `charge` | 4 | yes | - | 131 | **yes** | 50 each | powering up: wide stance, fists clenched at the sides, shouting upward (loop) |
| `throw` | 4 | - | 1/1/2 | 133 | - | 50 60 70 50 | throwing a projectile in mid-air: arm cocked back, whipped forward, follow-through |
| `beamCharge` | 3 | yes | - | 131 | **yes** | 50 each | charging a beam: both hands cupped together at the rear hip, shouting (loop) |
| `beamFire` | 3 | yes | - | 131 | **yes** | 50 each | firing a beam: both arms thrust straight forward, palms open, shouting (loop) |
| `vanish` | 2 | - | - | 146 | - | 50 each | crouch and blur before teleporting |
| `stagger` | 4 | yes | - | 137 | - | 150 each | dizzy stagger (loop) |
| `ko` | 1 | - | - | 62 | - | 500 | knocked out, lying flat on the back |
| `special` | 8 | - | 3/3/2 | 135 | **yes** | 120 120 120 120 120 160 110 70 | signature rush move: 3 frames charging the technique in hand, 2 running frames holding it forward, 1 thrust, 2 recover |
| `intro` | 4 | yes | - | 139 | - | 150 each | pre-fight intro pose (character-specific attitude, loop) |
| `taunt` | 2 | yes | - | 140 | - | 250 each | confident taunt / pointing at the opponent (loop) |
| `win` | 4 | yes | - | 140 | **yes** | 200 each | victory pose (loop) |

Totals: 38 animations, 154 frames per character; 23 core animations. `special`, `intro`, `taunt` and `win` timings may differ per character (see `manifest.json`).

## Strikes and contact zones

The user-facing rule: **when the game shows a hit, the fist or foot must visibly touch the body.**
On active frames the striking point must be the **forward-most** part of the silhouette (no hair,
scarf or cloth sticking out further forward), extended **horizontally toward screen-right**, at the
height of the zone it hits. Coordinates are frame-local px in the final 192 cell, facing right.

| anim | strike point | active frames | zone | contact zone (x, y px) |
|---|---|---|---|---|
| `light1` | lead (far) fist | 02, 03 | HIGH | fist tip around x 150-162, y 70-84 |
| `light2` | rear (near) fist | 02, 03 | HIGH | fist tip around x 158-172, y 76-92 |
| `light3` | near foot (sole/heel) | 02, 03 | LOW | sole around x 166-184, y 110-128 |
| `light4` | kicking foot | 03, 04 | HIGH | foot around x 170-186, y 64-88 |
| `heavy` | rear (near) fist | 03, 04 | HIGH (chin), then overhead | F03 fist around x 132-150, y 66-86; F04 fist overhead around x 118-136, y 36-52 |
| `airLight1` | lead fist | 01, 02 | MID | fist around x 150-166, chest height of the attacker |
| `airLight2` | near foot | 01, 02 | MID | foot around x 164-184, hip height of the attacker |
| `airLight3` | kicking heel | 02, 03 | MID | heel around x 166-186, chest/hip height |
| `airHeavy` | both clasped fists | 02, 03 | down-forward | fists around x 140-166, y 120-150 (below the attacker's chest, in front) |
| `throw` | throwing hand (release point) | 01 | release point | hand around x 140-160, y 92-110 |
| `beamFire` | both palms (beam origin) | all (loop) | beam origin | palms around x 158-170, y 94-108 |
| `special` | technique hand | 03, 04, 05 | MID | thrust hand around x 148-166, y 100-120 |

Hit detection uses the packed boxes, so **where the art puts the fist is where the hit lands**: a
strike that stops short of its contact zone simply misses at normal spacing. Claude tunes `reach` /
`lunge` in `src/game/moves.js` to the packed boxes so attacks connect at normal combo range.

## Effect anchor points

The engine draws signature-move energy, beams and projectiles at fixed offsets from the fighter
(read from `src/game/effects.js` and `src/game/projectiles.js` when this spec was written). Draw
the hands **at these points** so the VFX sits in the hand. If the art needs different points,
write the measured coordinates in the character's `MOVES_AND_VFX.md` and Claude moves the offsets.

| what | engine offset (world units from the feet) | cell px (x, y) |
|---|---|---|
| Rasengan-type orb in hand (startup + active, including the thrust frame) | 0.6 forward, 0.72 up | (148, 118); the full-size orb is about 58 px across, so keep the palm within ~10 px of this point on every frame (thrust palm at about x 152-158, y 112-118) |
| Chidori-type lightning, startup + whole active phase (hand trailing low behind; also on the thrust frame) | 0.5 back, 0.32 up | (53, 152) |
| Chidori-type lightning, impact / recovery after a hit (the impact frame, ~6 game frames; not the thrust frame) | 0.7 forward, 0.78 up | (156, 113) |
| beam origin (`beamFire` palms) | 0.8 forward, 0.92 up | (165, 101) |
| projectile spawn (`throw` release) | 0.5 forward, 0.9 up | (139, 103) |
| projectile / beam aim point on the opponent (chest) | 0.8-0.85 up | y 107-111 |

Known gap (task ENG-015): the Chidori lightning stays at the back point for the whole active phase,
so on a whiffed rush it sits behind the leg while the thrust frame's hand is forward. Until the
engine switches to the forward point for the last third of the active phase, the thrust frame's
hand may trail or thrust as the character brief says, but the brief must note where the lightning is.

## anims.json

Written by the packer next to `sheet.png` in `public/characters/<id>/`; read by the game.

```json
{
  "frameWidth": 192,
  "frameHeight": 192,
  "columns": 16,
  "pivot": [96, 180],
  "pixelsPerUnit": 86,
  "facing": "right",
  "source": "art-pack",
  "complete": true,
  "animations": {
    "idle":   { "frames": [0, 1, 2, 3, 4, 5, 6, 7], "durations": [150, 150, 150, 150, 150, 150, 150, 150], "loop": true },
    "light1": { "frames": [8, 9, 10, 11, 12, 13, 14], "durations": [30, 30, 40, 50, 50, 50, 30], "loop": false, "phases": [2, 2, 3] }
  },
  "boxes": {
    "0":  { "hurt": [[73, 50, 44, 130]], "hit": [] },
    "10": { "hurt": [[74, 48, 50, 132]], "hit": [[146, 68, 18, 16]] }
  }
}
```

- `frames`: sheet cell indices, row-major (index = row x 16 + column).
- `durations`: ms per frame. `loop`: whether it cycles.
- `phases` (attacks only): number of frames in `[startup, active, recovery]`.
- `boxes`: keyed by **sheet frame index** (string). `[x, y, w, h]` in frame-local px (origin =
  top-left of the cell, facing right). `hit` only on active frames of attacks. `"hit": []` means
  "this frame cannot hit"; a frame with no `hit` key falls back to the move's reach numbers. The engine
  grows hit boxes slightly before the overlap test (`boxPad` in `src/game/moves.js`: 0.1 x / 0.12 y world
  units by default, 0.18 / 0.45 for air attacks) so a fist that visibly brushes the body counts.
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
       idle pose's bounding box `maxX - 6 px`, as one box (the limb only: the box stops where the
       columns get torso-thick, and a guard fist next to a kick is left out);
    2) rising strike above the idle head (uppercut): the fist/forearm blob around the highest pixel
       (when it rises further above the idle head than it reaches forward, this rule is tried first);
    3) otherwise the forward-most **28 %** of the bounding box, full height.
  - That is why the idle pose must stay compact and the strike must be the forward-most point.
- **Overrides**: `art/characters/<id>/hitboxes.json` replaces the auto boxes for the frames it
  lists:

```json
{
  "light1": {
    "2": { "hit": [[146, 66, 20, 18]] },
    "3": { "hit": [[148, 66, 20, 18]] }
  },
  "down": {
    "1": { "hurt": [[30, 150, 132, 30]] }
  }
}
```

  Keys: animation name, then **frame number within the animation, 0-based** (the same `NN` as
  `frames/<anim>/<anim>_NN.png`). Values: `hit` and/or `hurt` lists of `[x, y, w, h]` in final
  192-cell px. A template lives in `art/characters/_template/hitboxes.example.json`.

## Fallbacks

A missing animation plays a similar one (`FALLBACK` in `src/game/sprites.js` at the time of writing), repeated until something exists
(last resort `idle`):

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

Optional. Save the ChatGPT image as `art/characters/<id>/ui/<name>.png`. The packer removes a
magenta background and fits it to the **exact** size below (transparent art: trimmed and
contain-fitted, bottom-aligned for portrait/select; opaque art: center-cropped to the aspect ratio),
using nearest-neighbor or "mode" sampling, and writes it to `public/characters/<id>/`. A file that
already has the exact size is copied as is, so hand touch-ups go into `ui/<name>.png` at final
size. Optionally keep the untouched ChatGPT original as `raw/ui_<name>.png` (the packer skips
`ui_*` files in `raw/`).

| file | size | content |
|---|---|---|
| `ui/portrait.png` | 96 x 96 | head and shoulders, facing right, transparent background, same pixel style |
| `ui/cutin.png` | 480 x 128 | DBFZ super-flash eye strip: both eyes and brows, intense expression. The face fills the strip (opaque); a flat background band color (the character color or dark navy) may show only around the eyes/brows. No speed lines: the HUD adds them |
| `ui/select.png` | 384 x 384 | full-body character-select art, facing right, transparent background |

## VFX atlas

Custom effect art replaces the procedural atlas (`src/art/vfxPainter.js`) effect by effect.
Engine names are fixed. Brief: `art/vfx/EFFECTS.md`.

- Cell **128 x 128**, transparent. Center-anchored effects are centered on (64, 64); bottom-anchored
  effects (`dust`, `flame`, `streak`) are centered on x 64 with their base on **y 120**.
- Hard-edged pixel art. **white (tinted)** effects are drawn in white / light grey only (alpha
  allowed in 3-4 hard steps) because the engine multiplies a color into them.
- Raw: `art/vfx/raw/<effect>.png` strip on magenta. Final frames:
  `art/vfx/frames/<effect>/<effect>_NN.png`.
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

```
art/characters/<id>/
  reference/model_sheet.png       approved model sheet: turnaround (front, 3/4 right, side, back),
                                  fighting stance, palette swatches (identity anchor for every prompt)
  reference/expressions.png       approved expression sheet
  reference/idle_approved.png     copy of the approved idle strip (pose + proportion anchor)
  reference/notes.md              optional: what was fixed between attempts
  reference/source/               optional, local only: official pictures for the user's own comparison
                                  (copyrighted: never uploaded to ChatGPT, never committed to a public repo)
  raw/<anim>.png                  one ChatGPT strip per animation, poses left -> right
  raw/<anim>_NN.png               ...or single frames (NN = 00, 01, ...)
  raw/_parts/<anim>_A.png, _B.png long strips generated in parts (stitched into raw/<anim>.png)
  raw/<anim>_fixNN.png            single-frame fix-up attempts (Codex cleans the keeper into frames/)
  raw/ui_portrait.png etc.        optional untouched UI originals
  raw/_proposed/, raw/_old/       art the engine does not read yet / old attempts
  frames/<anim>/<anim>_NN.png     cleaned 192x192 frames (packer output; hand touch-ups go here)
  ui/portrait.png cutin.png select.png   UI images (ChatGPT output or touched-up final size)
  hitboxes.json                   optional box overrides
art/vfx/raw/_proposed/<charId>_<effect>.png   character-specific effect art waiting for engine support
```

The packer reads only `raw/<anim>.png` and `raw/<anim>_NN.png`; it skips `ui_*`, `fx_*` and
`*_fixNN.png` files and every subfolder of `raw/` without a warning.

- Animation names are **camelCase exactly as in the table** (`airLight1`, not `air_light_1`).
- `NN` is two digits, 0-based.
- Character ids are lowercase ascii letters, digits and `_` (not leading: the packer skips folders
  that start with `_` or `.`), e.g. `naruto`, `sasuke`, `rock_lee`.

## Packer

`tools/pack-sprites.mjs` (Node ESM, `pngjs`):

```bash
npm run sprites            # every character
npm run sprites naruto     # one character
npm run sprites vfx        # the VFX atlas
npm run test:sprites       # packer regression test (after any change to tools/)
```

For each character folder (except `_template` and other `_`/`.` folders) and each animation in
`manifest.json`, it takes `frames/<anim>/*.png` if present, else `raw/<anim>.png` (split at empty
columns, or by the expected frame count), else `raw/<anim>_NN.png`. It removes the flat background (corner color / magenta,
flood fill from the edges plus near-magenta pixels), trims, downscales with palette-preserving
"mode" sampling so the tallest frame equals `bodyHeight` (nearest-neighbor if upscaling), puts the
feet center (mean x of opaque pixels in the bottom 20 % of rows) on x 96 and the lowest opaque
pixel on y 180, and writes 192x192 cells into the 16-column sheet. It computes boxes, applies
`hitboxes.json`, writes cleaned frames back to `frames/<anim>/` when they came from `raw/`, writes
`public/characters/<id>/sheet.png` + `anims.json`, fits and copies `ui/*.png`, and prints a report
(packed animations, missing core animations, frame-count mismatches, clipped frames, palettes over
48 colors). Missing folders never crash it.

Packer-written `frames/<anim>/` folders carry a `.packer.json` marker: they are re-imported
automatically when `raw/` changes. Delete `frames/<anim>/` only if you hand-edited it and want to
discard the edits (hand-edited frames win over a newer raw, with a warning).

## Game-side contract

Implemented by the lead engineer (Claude) in `src/`; documented here so art and code agree:

- The game loads `public/characters/<id>/anims.json` + `sheet.png` when present and
  `"complete": true`, or with the URL flag `?art=custom` for partial previews. Otherwise it uses
  the procedural placeholder.
- It uses `boxes` for hit detection.
- It loads `portrait.png` / `cutin.png` when present.
- It loads `public/vfx/atlas.png` + `atlas.json` when present (missing effects stay procedural).
- It switches to a sharper render mode automatically for hi-res sheets.
- Combat uses 2.5D lanes: attacks fire along the screen horizontal and auto-step to line up
  depth; a hit needs hitbox/hurtbox overlap **and** the same lane.
