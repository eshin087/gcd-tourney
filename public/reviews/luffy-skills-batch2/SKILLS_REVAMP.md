# Luffy: skills revamp (specials, Jet Gatling, Gigant Pistol)

> Brief for the Codex chat **"5 - Luffy"** (relay lane `luffy-skills`), written by the Claude chat "Luffy skills
> revamp (ENG-SKL-LUF)" on 2026-10-18. Claude does all engine work (`src/game/**`, effect names and their procedural
> stand-ins, the rubber limbs, the Gear Second flush and steam, the fist storm, the giant arm, the chibi) on branch
> `feature/luffy-skills`. Codex draws the art below. Everything in [art/SPEC.md](../../SPEC.md),
> [ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md), the title-style contract
> ([ADR 0029](../../../docs/decisions/0029-title-style-scale-baseline.md)), [art/vfx/README.md](../../vfx/README.md) and
> the HD effect cell of [ADR 0044](../../../docs/decisions/0044-signature-techniques.md) still applies unless this file
> says otherwise. The Naruto and Sasuke revamps ([naruto/SKILLS_REVAMP.md](../naruto/SKILLS_REVAMP.md),
> [sasuke/SKILLS_REVAMP.md](../sasuke/SKILLS_REVAMP.md)) are the worked examples. Luffy stays in the **Enies Lobby arc**
> (Gear Second and Gear Third, ADR 0032).

## 1. The user's request and decisions

**Request (2026-10-18):** revamp the specials, supers and ultimates so they look like the iconic anime/manga moves:
"right now most are meh and don't seem like the iconic animations, effects from the original anime/manga".

**What Claude found in game (2026-10-18):**

- **Gum-Gum Pistol** barely stretches (`special` v02 reaches about 1.4 arm lengths). The fist is the shared `orb` tile
  (a small blue-white swirl) flying alone, and the hit whites out the screen.
- **Gum-Gum Bazooka** has no strip (`specialForward` is todo), so he throws the Pistol's one-arm punch. The hit is a
  full-screen white-out.
- **Gum-Gum Rocket** has no strip (the Pistol pose plays while he flies off the top of the screen). The slam is a
  white-out.
- **Gum-Gum Whip** has no strip (his Gear Second crouch plays), no leg ever stretches, and he hits from 2.6 units away
  under a pink fog.
- **Gear Second** is pink flame tongues behind a normal-skinned Luffy. No steam.
- **Jet Gatling** is one fist per hit (`light2` / `light4`) under white ring bursts, ending in a white-out and pink smoke.
- **Gigant Pistol**: smoke puffs hide the inflating arm, and the "giant fist" is the shared `orb`, which is now Naruto's
  blue Rasengan spiral, so Luffy punches with a Rasengan. The hit is a white-out. The giant fist in `beamFire` v02 is
  cut off at the cell edge (ART-LUFFY-GIGANT-ARM).

**The user's answers (2026-10-18, question box in this Claude chat):**

| Question | Answer |
|---|---|
| Ultimate | **Gear 3 + chibi**: stay in Enies Lobby. The thumb bite, the arm inflating (nothing hiding it), a real giant arm and fist down his lane, a big impact; afterwards he shrinks to chibi Luffy for the recovery (visual only). |
| Jet Gatling | **Fist storm + Jet Bazooka**: the Gear Second pump pose in the flash, dozens of blurred fists from his shoulders into them with knuckle impacts, then a double-palm Jet Bazooka into the wall. |
| Gear Second | **Pink skin + steam + JET**: his skin flushes pink in every animation, white steam pours off him while it lasts, his moves leave afterimages with JET callouts. |
| Specials | **All four:** Pistol (far wind-up, stretched arm and real fist that snaps back, knuckle impact; also the air Pistol), Bazooka (both arms stretched back, both palms together, a double-palm shockwave), Rocket (arms grab something high, slingshot launch, no white-out), Whip (hands on the floor, the leg stretched along the floor, a whip-crack sweep). |

**Claude's calls on the details:**

- **The stretched limbs are split between the strip and the engine.** A rubber arm or leg longer than the 256 px cell
  leaves the cell at its edge in the strip (cut clean, no hand or foot inside the cell). The engine continues it from
  that exit point (`hand` anchor) with a stretched limb effect and puts the fist (or the sandal) at the end. This is
  how a Pistol reaches 6 units, a Whip 2.3 and the Gigant Pistol 7 without leaving the cell.
- **Gear Second's pink skin is a palette swap in the body shader**, so no strip needs a pink redraw: his sheet's exact
  skin colours (`#fcc081`, `#fbba79`, `#fbb675`, `#f9b171`, `#f4a57b`, `#dc8440`, `#c97c45`) map to pinks. `charge` v01
  (already pink in f2-f3) stays the activation strip.
- **Jet Gatling's flash** plays `charge` (the Gear Second pump), and its fist storm is an effect over his approved
  punches. Its final blow, the Jet Bazooka, uses the new Bazooka strip. No `superPose` is needed.
- **Gigant Pistol's windup** is the approved `beamCharge` v01, played once through (thumb bite f0, arm swelling f1,
  giant fist raised f2) instead of looping. Only the strike (`beamFire`) is redrawn so the giant arm leaves the cell
  cleanly.
- **The chibi** is an HD effect drawn where his body is (the body is hidden for the recovery), so it needs no new
  animation name. It is a deliberate SD gag, not held to the title-style contract.

## 2. Rules for this task

- **Models:** generate and direct every image with `gpt-6-luna`, reasoning `medium` (CLAUDE.md "Agent model
  selection"); if this chat runs another model, spawn a Luna subagent (`model`, `reasoning_effort: "medium"`,
  `fork_turns: "none"`) for the generation. The final **Astra** anatomy/scale audit (`gpt-6-astra`, medium) applies to
  the six character strips (B1-B6) only. Effects (part A, the chibi A14 included) need no Astra audit.
- **Budget:** at most 3 generation calls per image, cumulative across retries. One candidate inventory with every
  call, its prompt file and its verdict.
- **Versions:** never overwrite, reuse or delete a `_vNN` file. Next free versions (checked against disk, `_rejected/`,
  `_qa_hold/`, `_parts/`, REVIEW.md and git history on 2026-10-18): **`special_v03`**, **`beamFire_v03`**,
  **`specialForward_v01`**, **`specialUp_v01`**, **`specialDown_v01`**, **`throw_v01`**; every new effect starts at
  `_v01` (none of the names below exists in `art/vfx/raw/`).
- **Branch:** one worktree, branch `art/luffy-skills`, sparse with the raw art you need
  (`npm run pr -- start art/luffy-skills --art luffy,vfx`, or the host's managed worktree plus
  `npm run pr -- art luffy,vfx`). Dev server on a free port (52xx). Commit only your own paths.
- **Shared files:** the Codex chat "4 - Combat Overhaul" (lane `combat`, ENG-112) may start Luffy's directional normals
  (branch `art/normals-luffy`) while this runs. In `art/manifest.json`, `art/REVIEW.md`, `art/TRACKER.md` and
  `art/characters/luffy/hitboxes.json` change only the rows of the animations and effects in this brief. Luffy has no
  `hitboxes.json` on main yet: create it with only this brief's animations if your base still lacks it.
- **Packing:** a manifest entry `vfx.effects.<name>` with `"hd": true` plus `frames`, `ms`, `anchor` and `fill` from the
  tables below is all the packer needs (`"tile": true` for A1 and A11), so `node tools/pack-sprites.mjs vfx --candidates`
  works for the new names right away. Claude registers the same names with procedural stand-ins on
  `feature/luffy-skills`. Pack Luffy with `--quantize 48 --keep-palette` so his untouched strips stay byte for byte
  (ART-SIZE-R7). Do not edit `src/` or `tools/`.
- **Approval:** the user approves every image version. The approvals desk is off: when a batch is ready, ring Claude
  with `node tools/relay.mjs ring luffy-skills --for user --kind approval --note "<items, versions, review link>"` from
  main and stop on that batch; Claude asks the user and relays the answer word for word. Never treat anything else as
  approval.

### The HD effect cell (every part A effect)

256 x 256 px cell at 112 px per world unit (2.29 units across at scale 1; a standing Luffy is about 178 px tall in
this cell's pixels). Anchors: **center** = the effect's center on pixel (128, 128) in every frame; **bottom** =
centered on x = 128, base on y = 240 (16 px empty below). The packer scales each strip so its largest frame is `fill`
x 256 px; only the relative sizes between frames come from the art. Draw the sizes below at that final scale.
**Tile** effects (A1, A11) ship as exact 256 x 256 frames in `art/vfx/frames/<name>/` and are never rescaled.
Effects are drawn **facing screen-right** where they have a direction; the engine mirrors and turns them.

**Style for every effect:** crisp hard-edged pixel art like the approved HD effects (`art/vfx/raw/rasengan_v01.png`,
`chidoriBurst_v01.png`, `greatFireballBurst_v01.png`), flat magenta background, no text, no soft blur, airbrush,
dithering noise or anti-aliased gradients; shading in hard colour bands; at most 16 colours per effect. Effects must
read at small scale in a busy fight: a bright core, clear shapes, a dark rim for contrast. **No effect may be a solid
white disc or fill most of its cell with white**: the white-outs are exactly what this revamp removes.

**Luffy's skin (A1, A2, A6, A9, A11, A12, A14):** take it from his packed sheet so the limbs join his drawn arm with
no seam: `#fcc081` (light), `#fbba79` (base), `#f9b171`, `#dc8440` (shadow), `#c97c45` (deep shadow), outline
`#492610` and `#100706`. **Gear Second pink (A9):** `#f99a96`, `#f5958d`, `#f28981`, `#f07174`, `#d8655f`, `#984e47`
(shadow), outline `#723834`.

**Impact palette (A3, A13 and the accents of A4):** `#fff6c8` (core only), `#ffe07a`, `#ffb43a`, `#ff7a1a`, `#e8420e`,
`#a81e0a`, `#5a0e06` (rim). **Air and dust (A4, A5, A10, A13):** `#f8f4ec`, `#e6dccb`, `#cdb9a2`, `#b9a28a`,
`#8a7560`, `#5e4e40` (rim). **Steam (A7, A8):** `#ffffff` (highlights only), `#fff0f0`, `#ffd8d8`, `#f5b8b8`,
`#e09a9a`, `#b87a7a` (rim).

## 3. Part A: new effects (art/vfx, HD cell, full colour)

Raws: `art/vfx/raw/<name>_v01.png`, one row of frames left to right. Cleaned frames:
`art/vfx/frames/<name>/<name>_00.png` ... at exactly 256 x 256.

| # | Name | Frames | ms | Plays | Anchor | fill | Used for |
|---|---|---|---|---|---|---|---|
| A1 | `gumArm` | 2 | 60 | loop | center, **tile** | 1.0 | the stretched rubber arm (Pistol, air Pistol, the Rocket's arms) |
| A2 | `gumFist` | 4 | 40 | loop | center | 0.55 | the Pistol's fist at the end of the arm |
| A3 | `gumImpact` | 7 | 35 | once | center | 0.85 | a rubber blow landing: Pistol, Whip, Rocket slam, each Jet Gatling hit |
| A4 | `bazookaBlast` | 8 | 45 | once | center | 0.98 | the Bazooka's double palm (and the Jet Bazooka) |
| A5 | `rocketSnap` | 6 | 45 | once | bottom | 0.9 | the Rocket's take-off |
| A6 | `whipSweep` | 6 | 40 | once | center | 1.0 | the Whip: the stretched leg lashing along the floor |
| A7 | `gear2Steam` | 8 | 60 | loop | bottom | 0.95 | Gear Second steam pouring off his body (held while the mode lasts) |
| A8 | `gear2Burst` | 7 | 45 | once | center | 0.98 | Gear Second kicking in: steam bursting from his body |
| A9 | `gatlingFists` | 6 | 35 | loop | center | 0.98 | Jet Gatling: the storm of fists |
| A10 | `gear3Puff` | 6 | 45 | once | center | 0.6 | Gear Third's Bone Balloon: air rushing into the thumb and the arm |
| A11 | `gigantArm` | 2 | 60 | loop | center, **tile** | 1.0 | the giant inflated arm down the lane |
| A12 | `gigantFist` | 4 | 40 | loop | center | 0.98 | the giant fist at the end of it |
| A13 | `gigantImpact` | 8 | 50 | once | center | 0.98 | the giant fist landing |
| A14 | `luffyChibi` | 6 | 80 | loop | bottom | 0.45 | chibi Luffy after Gear Third (the recovery) |

### A1 `gumArm`: the stretched arm (2 frames, tile)

A **horizontal tube 24 px thick** centred on y = 128 (rows 116-139) running from x = 0 to x = 255. The engine
**stretches** it to any length and scales it to the drawn forearm's thickness, so **every column must be identical**:
only horizontal detail (bands, outlines, lines running along the arm), never a vertical mark, wrinkle or end. Rows top
to bottom: 2 px `#492610`, 4 px `#fcc081`, 8 px `#fbba79`, 5 px `#dc8440`, 3 px `#c97c45`, 2 px `#492610`. f0: the tube
alone. f1: the tube plus two pale speed lines (`#f8e8d1`, 2 px) running the full width at y = 108 and y = 148.

### A2 `gumFist`: the Pistol's fist (4 frames, loop)

Luffy's clenched fist flying screen-right, seen from the side: knuckles to the right, about **56 px tall and 60 px
long** around the centre (128, 128). **The wrist is cut flat on its left side at x = 98, exactly 24 px tall on
y = 116-139** (the engine joins `gumArm` there with the same rows), the thumb wrapped over the fingers, two knuckle
highlights. Behind it, 3-5 short speed lines (`#f8e8d1`, `#e6dccb`) streaming back to about x = 20, above and below the
wrist only. The lines change from frame to frame; the fist trembles 1 px. The widest frame (lines included) is about
140 px.

### A3 `gumImpact`: a rubber blow landing (7 frames, once)

A comic-style impact, not a white-out. f0: a 24 px `#fff6c8` core with 8-10 short, thick spikes radiating (a
starburst about 70 px across). f1: the starburst at about 150 px, the spikes in hard yellow-orange bands, a thin
compression ring round it. f2: full size, about 210 px, thick spikes with `#5a0e06` rims, white only in a 10 px core.
f3: the ring breaking into dashes, the spikes thinning and splitting. f4-f6: fragments and dust specks flying outward,
fading; nothing in the centre by f6.

### A4 `bazookaBlast`: the double palm (8 frames, once)

The air itself shoved by two palms, blasting **to screen-right**. f0: a bright vertical pressure front at x = 120-132,
about 100 px tall (the two palm prints, one above the other, as two rounded light shapes), a thin ring of compressed
air round it. f1: **curved shock fronts `)))` expanding to the right** from the prints, wind streaks along them, a few
`#ffe07a` impact spikes at the prints. f2-f3: the cone of fronts reaching the right edge, about 240 px tall there, dust
and grit pushed right, the prints fading. f4-f5: the fronts breaking into streaks. f6-f7: dust drifting right and
fading. Air palette with the impact accents; a `#5e4e40` rim on the fronts so it reads over a light floor.

### A5 `rocketSnap`: the take-off (6 frames, once, bottom anchor)

f0: a flat ring of dust bursting on the floor, about 200 px wide and 30 px tall on y = 240. f1: a dust plume rising
from the base centre and **vertical speed lines shooting up** to the top edge, two wavy vertical lines either side of
centre (the rubber twang). f2-f3: the dust billowing sideways to the cell width, the speed lines thinning. f4-f5: the
dust settling and fading.

### A6 `whipSweep`: the Whip (6 frames, once)

Luffy's lower leg stretched into a long rubber tube lashing along the floor, drawn on y = 128 from the **left edge
(x = 0, where the engine joins it to the drawn leg)** to the **straw sandal at the right**: the shin tube 16 px thick
in his skin palette, the sandal (brown straps `#8a5a34` / `#5a3820`, the foot in skin colours) about 34 px long at the
tip, sole facing forward. Behind the leg a **crescent of motion arcs**, pale (`#f8e8d1`, `#e6dccb`) with a `#8a7560`
rim, sweeping from above-left down to the leg (the path of the swing). f0: the leg half out (sandal at x about 130),
curving down to it, the arcs short. f1: full length (sandal at x about 240), the arcs long. f2: the crack: the leg
straight and full, a small three-spike snap at the sandal (`#ffe07a`), the arcs brightest. f3: full, the arcs fading.
f4: the leg pulling back to x about 150, wavy. f5: back to x about 60, faint arcs.

### A7 `gear2Steam`: Gear Second steam (8 frames, seamless loop, bottom anchor)

White-pink steam pouring off a body, about **150 px wide and 230 px tall**, base on y = 240. Columns of steam wisps
rise along the left and right sides of the body shape and above the head, curling and breaking into small puffs at the
top. **Leave the body area clear:** an open vertical oval at x 88-168, y 60-240 with only a few thin wisps crossing it,
so his drawn body shows through. The wisps rise about 1/8 of their height per frame so f7 flows into f0. Steam palette
with the `#b87a7a` rim on the outer edges. The engine draws it behind him and a thin copy in front.

### A8 `gear2Burst`: Gear Second kicking in (7 frames, once)

Steam exploding from his whole body. f0: thin steam jets shooting out of the outline of a body-shaped oval (about
80 x 180 px round the centre, left clear). f1-f2: big billowing steam clouds blasting outward in every direction to
near the cell edges, the centre still mostly clear. f3-f4: the clouds rolling up and out. f5-f6: dissipating into
rising wisps.

### A9 `gatlingFists`: Jet Gatling (6 frames, loop)

The storm of fists. From the left edge (x 0-30, y 90-170: his shoulders) **14-20 stretched arms with fists** blast
screen-right, fanned about ±25 degrees: each arm a speed-blurred streak 8-12 px thick in the **Gear Second pink**
palette, ending in a fist 30-44 px tall (knuckles right, the same design as A2 but pink), at different lengths; the
fists cluster over the right 60 % of the cell, overlapping. 3-4 small `#ffe07a` impact stars (6-10 px) where the
frontmost fists land at x 200-240, and a few steam wisps between the arms. Every frame a different arrangement, so the
loop reads as a blur of punches.

### A10 `gear3Puff`: the Bone Balloon (6 frames, once)

Air rushing in as he blows into his thumb. f0: a small round puff (about 20 px) at the centre. f1: three concentric
puff rings expanding (about 40, 70, 100 px), `#f8f4ec` with `#c8b89a` / `#8a7560` rims, **open in the middle**. f2: a
burst of round cartoon air puffs around the rings. f3-f5: the puffs drifting outward and fading. It must never cover
the arm: rings and puffs, no solid cloud.

### A11 `gigantArm`: the giant arm (2 frames, tile)

The Gear Third arm: a **horizontal tube 96 px thick** centred on y = 128 (rows 80-175) running from x = 0 to x = 255,
**every column identical** (the engine stretches it down the lane). Rows top to bottom: 3 px `#492610`, 12 px
`#fcc081`, 34 px `#fbba79`, 16 px `#f9b171`, 16 px `#dc8440`, 12 px `#c97c45`, 3 px `#492610`. f0: the tube alone.
f1: plus long pale speed lines (`#f8e8d1`, 2-3 px) along it at y = 70, 76, 180 and 186.

### A12 `gigantFist`: the giant fist (4 frames, loop)

The giant fist rocketing screen-right: a huge clenched fist, knuckles to the right, about **200 px tall and 190 px
long** (x 40-230), **the wrist cut flat on its left side at x = 40, exactly 96 px tall on y = 80-175** (joins
`gigantArm` with the same rows), knuckle highlights, finger creases, the thumb wrapped over, a 3 px dark brown outline.
A few speed lines and wind trails stream back to the left edge above and below the wrist. Each frame the trails change
and the fist trembles 1-2 px.

### A13 `gigantImpact`: the giant fist landing (8 frames, once)

Huge, but not a white-out. f0: a flat vertical compression front at x about 150 with big impact spikes radiating
right, up and down; white only in a core of at most 20 px. f1: a massive starburst filling most of the cell, spikes in
the impact palette's hard bands with dark rims, a shock ring. f2-f3: the ring expanding beyond the spikes, stone chips
and dust flying (air and dust palette). f4: the burst breaking apart. f5-f7: dust clouds and chips falling and fading.

### A14 `luffyChibi`: after Gear Third (6 frames, loop, bottom anchor)

The anime's side effect: **chibi (SD) Luffy**, about **2.5 heads tall and 100 px tall** in total, base on y = 240,
facing screen-right: the straw hat, red vest, blue shorts with white cuffs, sandals, his sheet's palette and dark line
art. He is tiny and furious: f0-f1 flailing his little arms and shouting (mouth wide), f2-f3 hopping in place 4-8 px,
f4-f5 stamping one foot, a sweat drop. A deliberate SD gag: not held to the title-style contract, no Astra audit.

## 4. Part B: Luffy character art

Scale and anatomy follow the title-style contract: the same pixel density as his approved idle and combat cell, 256 px
cells, pivot `[128, 240]`, facing right, 48-colour sheet palette, the straw hat on in every frame. Attach his approved
title-style neutral/combat cells and his approved idle as references. **No steam, glow, speed lines or effects in any
sprite:** the engine draws every effect. The rubber stretch **is** drawn where it stays inside the cell; where a limb
leaves the cell it is cut clean at the edge (no hand, fist or foot inside the cell) and the engine draws the rest
from the `hand` anchor. Record `hand` per frame in `art/characters/luffy/hitboxes.json`, measured on the packed cells.

### B1 `special` v03: GUM-GUM PISTOL (8 frames, phases 3/3/2, bodyHeight 204, ms unchanged)

The punching arm is the near arm, as in v02. S = startup, A = active, R = recovery.

- **f0 · S:** he twists the torso away from the opponent, the punching fist drawn back past his hip, the other fist up
  at the chin, feet wide.
- **f1 · S, the wind-up:** the punching arm **stretched far back behind him**, straight, about twice its normal
  length, the fist near the left edge (x 8-30, shoulder height). Body leaning forward, grinning.
- **f2 · S:** the arm stretched even further, taut, the fist at x 0-15; feet planted.
- **f3 · A, the snap:** body twisted forward, the punching arm thrust **straight forward at shoulder height, leaving
  the cell at the right edge** (cut clean at x = 255, the arm about 9-10 px thick there, no fist in the cell),
  shouting.
- **f4 · A:** the same, the body leaning 2-4 px further in.
- **f5 · A:** the same (held while the fist flies), the vest and sash flapping.
- **f6 · R, the snap back:** the arm normal length again, the fist at about x 200, the arm slightly wavy (rubber
  recoil), the body jolted back 2-4 px.
- **f7 · R:** back to the guard.

`hand`: the arm's exit point on the right edge (the centre of its cross-section) in f3-f5; the fist's centre in f0-f2
and f6-f7.

### B2 `throw` v01: the air Pistol (4 frames, phases 1/1/2, bodyHeight 201, ms 50 60 70 50)

In the air, legs tucked under him, the hat on. f0: the punching arm stretched far back (fist at the left edge). f1:
the arm thrust forward at shoulder height, **leaving the cell at the right edge** (cut clean). f2: the same, held.
f3: the arm normal length, the fist back near his chest, legs dropping. `hand`: the exit point in f1-f2, the fist in
f0 and f3.

### B3 `specialForward` v01: GUM-GUM BAZOOKA (7 frames, phases 2/2/3, bodyHeight 204, ms 50 50 60 80 70 60 50)

- **f0 · S:** crouched, **both arms stretched straight back** behind him, palms open, the hands at x 10-30 (about
  twice normal arm length), body leaning forward.
- **f1 · S:** deeper, the arms at full stretch (hands at the left edge), palms facing forward.
- **f2 · A, the Bazooka:** a lunge (front knee bent, rear leg straight), **both palms shoved forward together at chest
  height**, heels of the palms touching, one hand's fingers pointing up and the other's down, arms straight at normal
  length, palms at x 215-240, y 110-150; mouth open shouting.
- **f3 · A:** the same, the body 4-6 px further forward, the vest and sash flying forward. The engine holds this frame
  when the Bazooka connects.
- **f4-f6 · R:** the arms drawn back, rising out of the lunge to the stance.

`hit` boxes on the palms in f2-f3; `hand` = the centre of the two palms in every frame.

### B4 `specialUp` v01: GUM-GUM ROCKET (6 frames, phases 2/2/2, bodyHeight 214, ms 50 50 60 60 70 70)

He grabbed something high with stretched arms and slingshots himself up. The engine draws the arms from the cell's
top edge up to the grab point.

- **f0:** knees bent deep, body leaning back and stretched taut, **both arms straight up and leaving the top of the
  cell** (cut clean at y = 0, no hands in the cell), face up, shouting.
- **f1:** the legs straightening, feet leaving the floor, the body pulled long like a rubber band (torso and neck at
  most 10 % longer), arms still up off the cell.
- **f2:** flying up like a rocket: body straight and vertical, legs together pointing down, arms up off the cell.
- **f3:** the same, the vest, sash and hat brim blown downward by the climb.
- **f4:** letting go: the arms back at normal length, fists coming down to his sides, the body starting to curl.
- **f5:** curled, turning over into `airHeavy` f0 (match that pose).

`hand`: the centre between the two arms where they leave the top edge in f0-f3; the fists' centre in f4-f5.

### B5 `specialDown` v01: GUM-GUM WHIP (4 frames, phases 2/1/1, bodyHeight 204, ms 80 80 160 90)

- **f0 · S:** dropping low, **both hands planted on the floor** in front, body turned, weight on the hands.
- **f1 · S:** on the hands, the near leg cocked back and up behind him, knee bent.
- **f2 · A, the Whip:** the near leg swung forward and **stretched straight out along the floor, leaving the cell at
  the right edge at shin height** (y 215-232, cut clean, no foot in the cell), hands on the floor, the other knee
  down, mouth open.
- **f3 · R:** the leg snapped back to normal length, the foot near x 200, rising.

`hand`: the leg's exit point (the centre of the shin at x = 255) in f2; the near foot in f0, f1 and f3.

### B6 `beamFire` v03: GIGANT PISTOL, the strike (3 frames, loop, bodyHeight 198, ms 50 each)

After the approved Gear Third windup (`beamCharge` v01: thumb bite, swelling arm, the giant fist raised). The giant
arm is **as thick as in `beamCharge` v01 f2** (upper arm and forearm about 45-55 px).

- **f0, the wind-back:** body twisted away, the giant inflated arm thrown back behind him, the giant fist at the left
  edge (x 0-90, y 40-140), body coiled, teeth gritted.
- **f1, the punch:** body twisted forward in a deep lunge, the giant inflated arm straight forward from the shoulder,
  **leaving the cell at the right edge** at about y 90-150 (cut clean, no fist in the cell), the other arm thrown back
  for balance, shouting.
- **f2:** the same, trembling 1-2 px, the hair, vest and sash blown back.

`hand`: the arm's exit point at the right edge (the centre of its cross-section) in f1-f2; the giant fist's centre in
f0. This replaces v02, whose giant fist is cut off at the cell edge (ART-LUFFY-GIGANT-ARM).

## 5. Order, review and handback

1. **Batch 1, the Pistol:** B1 `special` v03, B2 `throw` v01, A1 `gumArm`, A2 `gumFist`, A3 `gumImpact`. Pack Luffy
   with the candidates, run `npm run body luffy special throw` and the Astra audit on B1-B2, then one review page (the
   raw strips, packed frames beside idle f0 and the approved combat cell, the effects at game scale as GIFs over a
   stage-coloured background, A1 joined to A2 at the wrist); ring Claude for the user's approval.
2. **Batch 2, Gear Third:** B6 `beamFire` v03 (with `npm run body luffy beamFire` and the Astra audit), A10
   `gear3Puff`, A11 `gigantArm`, A12 `gigantFist`, A13 `gigantImpact`, A14 `luffyChibi`. One review page (A11 joined to
   A12, the chibi beside idle f0 for size); ring Claude.
3. **Batch 3, Gear Second, Jet Gatling and the Bazooka:** B3 `specialForward` v01 (body sheet and Astra audit), A4
   `bazookaBlast`, A7 `gear2Steam`, A8 `gear2Burst`, A9 `gatlingFists`. One review page (A7 over his idle); ring Claude.
4. **Batch 4, Rocket and Whip:** B4 `specialUp` v01 and B5 `specialDown` v01 (body sheets and Astra audits), A5
   `rocketSnap`, A6 `whipSweep`. One review page; ring Claude.

Each ring names the versions, any holds and the review URL. Record each candidate in `art/REVIEW.md`, the effect
entries in `art/manifest.json` (`vfx.effects.<name>`: frames, ms, colorRule `fullColor`, anchor, fill, `hd: true`,
`tile: true` for A1 and A11, step, status, version) and `art/TRACKER.md`. Claude integrates each approved batch in game
and shows the user an in-game preview.
