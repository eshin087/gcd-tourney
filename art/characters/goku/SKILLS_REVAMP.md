# Goku: skills revamp (Kamehameha, Spirit Bomb, Kaio-ken, Dragon Fist, Instant Transmission)

> Brief for the Codex chat **"5 - Goku"** (relay lane `goku-skills`), written by the Claude chat "Goku skills
> revamp (ENG-SKL-GOK)" on 2026-10-18. Claude does all engine work (`src/game/**`, effect names and their procedural
> stand-ins, the Kamehameha's ball and head, the Spirit Bomb, the Kaio-ken mode, the dragon's coil, the afterimage
> chase, the intro) on branch `feature/goku-skills`. Codex draws the art below. Everything in
> [art/SPEC.md](../../SPEC.md), [ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md), the title-style
> contract ([ADR 0029](../../../docs/decisions/0029-title-style-scale-baseline.md)), [art/vfx/README.md](../../vfx/README.md)
> and the HD effect cell of [ADR 0044](../../../docs/decisions/0044-signature-techniques.md) still applies unless this
> file says otherwise. The Naruto and Sasuke revamps ([naruto/SKILLS_REVAMP.md](../naruto/SKILLS_REVAMP.md),
> [sasuke/SKILLS_REVAMP.md](../sasuke/SKILLS_REVAMP.md)) are the worked examples.

## 1. The user's request and decisions

**Request (2026-10-18):** "i want to revamp most of the characters specials, supers, and ultimates. right now most are
meh and don't seem like the iconic animations, effects from the original anime/manga". Naruto and Sasuke are done and
live; Killua, Gojo, Goku and Luffy run in parallel.

**What Claude found in game (2026-10-18):** five of Goku's eight kit strips were never drawn (`specialForward`,
`specialUp`, `specialDown`, `throw`, `superPose` are `todo`), so the game plays stand-ins:

- **Kamehameha:** his approved `beamCharge` v07 / `beamFire` v07 are already the classic cupped hands at the hip and
  the two-palm thrust. But the charge is only his golden power-up aura (no blue ball between the hands, no chant), and
  the beam is a plain blue-white ribbon with two glow bulbs.
- **Kaio-ken Rush:** he stands in `idle` through the flash (no `superPose`); only his afterimages are red, he is not,
  and every blow is a white impact star.
- **Dragon Fist:** the Ki Blast palm push (`special` stand-in) behind a huge yellow glow disc that hides him; the hit
  is the generic explosion, a full-screen white-out. No dragon.
- **Instant Transmission:** his power-up stance (`charge` stand-in), not two fingers to the forehead; a smoke puff,
  then the kick from behind.
- **Ki Blast Volley:** three blasts fired at once as one big blue glow disc (the generic 64 px `orb`); in the air he
  fires from a jab (`light1` stand-in).
- **Rising Kick:** he floats up in the palm-push pose (no kick at all), then drops.

**The user's answers (2026-10-18, question box in this Claude chat):**

| Question | Answer |
|---|---|
| Kamehameha | **Classic, revamped:** a blue ball grows between his cupped hands while KA-ME-HA-ME calls out one syllable at a time; on HA! a bright sphere at his palms, a blue beam with a white core, a rounded swirling head and shock rings. His current poses stay. |
| SUPER | **Spirit Bomb + Kaio-ken mode:** the SUPER becomes the Spirit Bomb (arms raised, a giant blue-white sphere gathers above him and he throws it onto their spot, dodgeable like Kirin). Kaio-ken moves to Back + Special as a red-aura power-up mode. |
| Dragon Fist | **Full anime dragon:** golden fist drawn back, he flies in fist-first; on hit a golden dragon erupts from the punch, coils around them and bursts in gold. No white-out. |
| Also revamp | **All four:** Instant Transmission (two fingers to the forehead, a ki shimmer instead of smoke), Ki Blast Volley (HD ki spheres, muzzle flashes, small bursts, a new air pose), Rising Kick into an afterimage chase (double axe-handle smash), the Super Saiyan intro (black hair flashing gold). |

**Claude's calls on the details (no extra art):**

- **Kamehameha poses:** `beamCharge` v07 and `beamFire` v07 stay. Claude records their drawn hands (`hand` anchors in
  `hitboxes.json`) so the ball sits in the cupped hands and the beam leaves the palms.
- **Spirit Bomb throw:** the throw is his approved two-palm push, `beamFire` v07 (Goku shoves the sphere forward with
  both hands, as against Frieza). Only the raised-arms gathering pose is new (B3).
- **Kaio-ken activation:** his approved power-up stance `charge` v05 (fists clenched); the red aura (A11, A12), a red
  body tint and the AuraShell flame outline in red carry the look. The old Kaio-ken `superPose` brief is superseded:
  `superPose` is now the Spirit Bomb pose.
- **Afterimage chase:** the smash down is his approved `airHeavy` v06 (f3 is the two-fist hammer); the afterimage is
  the engine's ghost of his sprite. Only the kick-up strip is new (B4).
- **Instant Transmission kick** stays his approved `light4` v09.

## 2. Rules for this task

- **Models:** generate and direct every image with `gpt-6-luna`, reasoning `medium` (CLAUDE.md "Agent model
  selection"); if this chat runs another model, spawn a Luna subagent (`model`, `reasoning_effort: "medium"`,
  `fork_turns: "none"`) for the generation. The final **Astra** anatomy/scale audit (`gpt-6-astra`, medium) applies to
  the six character strips (B1-B6) only. Effects (part A) need no Astra audit.
- **Budget:** at most 3 generation calls per image, cumulative across retries. One candidate inventory with every
  call, its prompt file and its verdict.
- **Versions:** never overwrite, reuse or delete a `_vNN` file. Next free versions (checked against disk, `raw/_rejected/`,
  `raw/_parts/`, `raw/_qa_hold/`, REVIEW.md and git history on 2026-10-18; none of these names has ever had a file):
  **`specialForward_v01`**, **`specialDown_v01`**, **`superPose_v01`**, **`specialUp_v01`**, **`throw_v01`**,
  **`intro_v01`**, and **`ui_super_bg_v02`** (B7, optional); every new effect starts at `_v01` (none of the fifteen
  names below exists in `art/vfx/` or its history).
- **Branch:** one worktree, branch `art/goku-skills`, sparse with the raw art you need
  (`npm run pr -- start art/goku-skills --art goku,vfx`, or the host's managed worktree plus `npm run pr -- art goku,vfx`).
  Dev server on a free port (52xx). Commit only your own paths.
- **Shared files:** the Codex chat "4 - Combat Overhaul" (lane `combat`, branch `art/normals-goku`) is drawing Goku's
  directional normals (`fTilt`, `uTilt`, `dTilt`, `dashAttack`, `fSmash`, `uSmash`, `dSmash`, `fair`, `bair`, `uair`) at
  the same time. In `art/manifest.json`, `art/characters/goku/hitboxes.json`, `art/REVIEW.md` and `art/TRACKER.md`
  change only the rows of the animations and effects in this brief.
- **Packing:** the HD cell (256 px, 112 px per unit, `atlas_hd.png`) is on main. A manifest entry
  `vfx.effects.<name>` with `"hd": true` plus `frames`, `ms`, `anchor` and `fill` from the tables below is all the
  packer needs, so `node tools/pack-sprites.mjs vfx --candidates` works for the new names right away. Claude registers
  the same names with procedural stand-ins on `feature/goku-skills`. Do not edit `src/` or `tools/`.
- **Approval:** the user approves every image version. The approvals desk is off: when a batch is ready, ring Claude
  with `node tools/relay.mjs ring goku-skills --for user --kind approval --note "<items, versions, review link>"` from main
  and stop on that batch; Claude asks the user and relays the answer word for word. Never treat anything else as
  approval.

### The HD effect cell (every part A effect)

256 x 256 px cell at 112 px per world unit (2.29 units across at scale 1). **Goku standing is about 186 px tall in this
cell's pixels** (hair included; his packed idle is 213 px at 128 px per unit). Anchors: **center** = the effect's center
on pixel (128, 128) in every frame; **bottom** = centered on x = 128, base on y = 240 (16 px empty below). The packer
scales each strip so its largest frame is `fill` x 256 px; only the relative sizes between frames come from the art.
Draw the sizes below at that final scale. Effects are drawn **facing screen-right** where they have a direction; the
engine mirrors them.

**Style for every effect:** crisp hard-edged pixel art like the approved HD effects (`art/vfx/raw/rasengan_v01.png`,
`chidori_v01.png`, `kirinHead_v01.png`), flat magenta background, no text, no black outline around the effect, no soft
blur, airbrush, dithering noise or anti-aliased gradients; shading in hard color bands; at most 16 colors per effect.
Effects must read at small scale in a busy fight: a bright core, clear shapes, a dark rim for contrast. **No effect may
be a solid white disc or fill most of its cell with white**: Dragon Fist's white-out and the Ki Blast's glow disc are
exactly what the user rejected. White only in cores, thin edges and sparks.

**Palettes:**

| Name | Colors (light to dark; the last is the rim) | Effects |
|---|---|---|
| ki blue | `#FFFFFF`, `#E6FAFF`, `#AEE8FF`, `#6CCBFF`, `#2E9BFF`, `#1A62E0`, `#123A9E` | A1-A6 (Kamehameha, ki blasts) |
| spirit | `#FFFFFF`, `#EEFBFF`, `#CDEFFF`, `#9EDCFF`, `#62B8FF`, `#2E7CE8`, `#1A4AB0` | A13, A14 (Spirit Bomb: paler, more white-blue than the Kamehameha) |
| dragon gold | `#FFFFFF`, `#FFF6C0`, `#FFE066`, `#FFC21A`, `#F08C0A`, `#B85A06`, `#6A3004` | A7-A9, A15 (Dragon Fist, Super Saiyan) |
| kaio-ken red | `#FFFFFF`, `#FFD2C8`, `#FF7A6A`, `#FF3A2A`, `#D8140E`, `#8E0A08`, `#4A0404` | A11, A12 |
| transmission | `#FFFFFF`, `#FFF8D8`, `#CFE9FF`, `#8CC8FF`, `#5A8CE0` | A10 |

## 3. Part A: new effects (art/vfx, HD cell, full color)

Raws: `art/vfx/raw/<name>_v01.png`, one row of frames left to right. Cleaned frames: `art/vfx/frames/<name>/<name>_00.png`
... at exactly 256 x 256.

| # | Name | Frames | ms | Plays | Anchor | fill | Used for |
|---|---|---|---|---|---|---|---|
| A1 | `kamehameha` | 8 | 40 | loop | center | 0.5 | the ki ball growing in his cupped hands (charge); the sphere held at his palms while the beam fires |
| A2 | `kamehamehaHead` | 6 | 40 | loop | center | 0.9 | the Kamehameha's rounded, swirling head |
| A3 | `kamehamehaRing` | 6 | 40 | once | center | 0.95 | the shock rings sent down the beam from his palms |
| A4 | `kiBlast` | 6 | 35 | loop | center | 0.45 | each ki blast in flight (ground and air volley) |
| A5 | `kiMuzzle` | 5 | 35 | once | center | 0.6 | the flash at his palm as each blast leaves |
| A6 | `kiBlastBurst` | 7 | 40 | once | center | 0.8 | a ki blast hitting |
| A7 | `dragonFistAura` | 6 | 40 | loop | center | 0.98 | the golden ki wrapped round him in the flying punch |
| A8 | `dragonFistDragon` | 10 | 50 | once | center | 1.0 | the golden dragon erupting from the punch and coiling round them |
| A9 | `dragonFistBurst` | 8 | 45 | once | center | 0.98 | the dragon bursting: the golden explosion |
| A10 | `instantTransmission` | 6 | 35 | once | bottom | 0.9 | his vanish (played forward) and his arrival (played backward) |
| A11 | `kaiokenBurst` | 7 | 40 | once | bottom | 0.98 | the red aura exploding out as Kaio-ken starts |
| A12 | `kaiokenAura` | 6 | 50 | loop | bottom | 0.95 | the red Kaio-ken aura around him while the mode lasts |
| A13 | `spiritBomb` | 8 | 60 | loop | center | 1.0 | the Spirit Bomb (the engine grows it from small to giant) |
| A14 | `spiritBombBlast` | 8 | 60 | once | bottom | 1.0 | the Spirit Bomb hitting the floor: the dome |
| A15 | `superSaiyanBurst` | 8 | 45 | once | bottom | 0.98 | the golden aura exploding as he turns Super Saiyan (the intro) |

### A1 `kamehameha`: the ki ball (8 frames, seamless loop)

The ball of ki cupped between his hands (the engine places it there and scales it from small to full through the
charge, then holds it bigger at his palms while the beam fires; do not draw hands). A **glowing sphere about 120 px
across**: a white core about 36 px, then hard rings of pale cyan, light blue and blue, and a **crackling rim** where
short ki wisps curl inward over the surface (energy being drawn in), plus 4-6 tiny sparks orbiting just outside it.
The wisps and sparks advance about 1/8 turn per frame so f7 flows into f0; the core pulses 2-4 px in size. It must read
as a ball of light with a hot center, not a flat disc: white is at most a third of its area. Palette: ki blue.

### A2 `kamehamehaHead`: the beam's head (6 frames, seamless loop)

The leading end of the Kamehameha travelling to screen-right, seen from the side: a **rounded bulb about 230 px long
and 200 px tall**, its front a dome at about x 245, a white-cyan core about 90 px tall along the middle, and **bands of
blue energy spiralling back from the front** like the tip of a drill, with short energy licks peeling off its top and
bottom edges. The back of the bulb is open: from x = 0 to about x 40 it narrows into the beam itself, a band about 110 px
tall centered on y = 128 (white core 40 px, pale and light blue bands), cut straight at x = 0 so the engine's beam
joins it. The spiral advances each frame so f5 flows into f0. Palette: ki blue.

### A3 `kamehamehaRing`: the shock ring (6 frames, once)

A ring of ki around the beam, seen almost edge-on: a **tall thin ellipse (about 4 to 1)** with a white-cyan core line,
pale blue bands on both sides and a few sparks flying off its rim. f0 about 60 px tall, f1 120, f2 180, f3 about 230 px
tall at its brightest, f4 thinner and broken into arcs, f5 faint fragments. Palette: ki blue. (Naruto's
`beastBeamRing` is the same shape in his colors.)

### A4 `kiBlast`: a ki blast (6 frames, seamless loop)

A ki sphere flying to screen-right: a **round core about 64 px across** centered on (140, 128), white center about
22 px, pale cyan and blue bands, a bright rim; **a short tapered tail** of 3-4 ki streaks reaching back to about
x 40, thinner and darker toward the end. The tail streaks flicker and the rim sparkles change each frame; the sphere
keeps its size. It appears three at a time, one per palm thrust, so it must read clearly when small. Palette: ki blue.

### A5 `kiMuzzle`: the palm flash (5 frames, once)

The flash at his open palm as a blast leaves it (the engine puts the palm at the cell center). f0: a bright 40 px
four-point star. f1: about 90 px, with short rays reaching to about 140 px, the longest pointing to screen-right. f2: a
broken ring about 120 px, the rays gone. f3-f4: a few sparks drifting forward, fading. Palette: ki blue.

### A6 `kiBlastBurst`: a ki blast hitting (7 frames, once)

f0: the sphere flattening against the target, a bright 70 px flash with a white center. f1: a jagged burst about
150 px across, spiky rays. f2-f3: a spiky ring of ki at about 220 px, its inside empty. f4-f6: sparks and small ki
fragments flying outward and fading. White only in the f0-f1 center. Palette: ki blue.

### A7 `dragonFistAura`: the golden ki envelope (6 frames, seamless loop)

The golden ki around Goku as he flies fist-first to screen-right (the engine draws it behind his flying pose, B1 f3,
centered on his body): a **long flame-shaped envelope of golden ki about 245 px long and 120 px tall**, pointed at the
front (the tip at about (250, 124), just ahead of his fist) and widening behind into **flame tongues streaming back** to
screen-left, the tongues longest along the top. A bright pale-yellow inner band where it hugs the body, deeper gold
and orange bands outside, an amber rim. The tongues ripple backward each frame so f5 flows into f0. Palette: dragon gold.

### A8 `dragonFistDragon`: the golden dragon (10 frames, once)

The heart of the move: a **golden Eastern dragon** made of ki (long serpentine body, two swept-back horns, long
whiskers, a flame-like mane, fierce white-hot eyes, jaws with sharp teeth, small clawed forelegs; scales suggested by
hard band shading, not drawn one by one) that bursts out of Goku's punch and **coils round the opponent**. The cell
center is the opponent's chest (the engine centers it on them; they are about 186 px tall and 80 px wide in this cell).

- **f0:** a golden flash at the left edge (x 0-60, y 100-160, where his fist is) with the dragon's **head bursting out of
  it**, jaws wide, facing screen-right, its neck still inside the flash.
- **f1:** the head has shot across to the right side (x about 170-250, y 90-170), the long body trailing back through the
  center to the left edge.
- **f2-f5:** the body **coiling round the center in a spiral** (about one and a half turns, the coil about 190 px wide
  and 220 px tall), loops passing alternately in front of and behind the victim's place (the parts behind darker); the
  middle (x 98-158, y 50-210) stays mostly clear so the victim shows. The head circles round and up as the coil tightens.
- **f6-f7:** the head at the top center (about x 90-170, y 0-80), **rearing up with its jaws wide open, roaring**, the
  coil wound tight round the middle.
- **f8:** the whole dragon flaring bright (pale gold and white edges), cracks of light opening along the body.
- **f9:** the dragon breaking apart into golden light shards (the engine crossfades into A9 here).

Palette: dragon gold (white only in the eyes, the f0 flash, and the f8 edges).

### A9 `dragonFistBurst`: the golden explosion (8 frames, once)

Not a white-out. f0: a 90 px gold-white core with a thin bright ring. f1: a burst about 170 px with spiky golden rays.
f2-f3: billowing golden ki lobes reaching the cell edge, the core fading to amber. f4: the lobes breaking into flame-like
ki tongues with dark amber edges. f5-f7: golden sparks and small shards drifting up and fading, nothing in the center by
f7. White only in the f0-f1 center (at most 15 % of the burst). Palette: dragon gold.

### A10 `instantTransmission`: the shimmer (6 frames, once, bottom anchor)

Instant Transmission is silent and clean in the anime: no smoke. The engine plays this strip over him as he vanishes
(forward; he disappears at f2) and backward where he reappears (he appears at f3). Drawn round a standing body about
186 px tall (feet on y = 240):

- **f0:** two thin wavering vertical lines of light on either side of the body's place, about 80 px apart and 180 px
  tall, with short horizontal ripple dashes between them (a heat-haze shimmer).
- **f1:** the lines pulled in to about 40 px apart and brighter, the ripple dashes denser.
- **f2:** one bright vertical line about 200 px tall and 6 px wide (white core, pale blue edges).
- **f3:** the line squeezed into a bright point at chest height (about (128, 140)) with a thin horizontal glint about
  120 px wide.
- **f4:** a small four-point sparkle.
- **f5:** three or four fading specks.

Palette: transmission.

### A11 `kaiokenBurst`: Kaio-ken! (7 frames, once, bottom anchor)

The red aura exploding out of him as he shouts "KAIO-KEN!" (he stands in his power-up stance, about 186 px tall; keep
a vertical oval x 88-168, y 50-238 clear so his body shows through). f0: a tight crimson flame outline hugging that
oval, a bright pink-white inner edge. f1-f2: **huge flame tongues bursting up and out** to the top and side edges, a
flat shock ring about 240 px wide along the floor line. f3: at full size. f4-f6: the outer tongues breaking off and
rising away, leaving the steady aura shape of A12 (the engine crossfades into it). Palette: kaio-ken red.

### A12 `kaiokenAura`: the red aura (6 frames, seamless loop, bottom anchor)

The steady Kaio-ken aura, the classic DBZ aura shape in red: **tall flame tongues about 150 px wide and 245 px tall**
around a standing body, base on y = 240, rising past his head and curling inward at the top into a pointed crown.
**Body area clear:** a vertical oval x 88-168, y 45-238 has only a few thin licks crossing it, so his red-tinted sprite
shows. Hard bands from a bright pink-red inner edge to the deep crimson rim, a few sparks rising. The tongues rise and
change shape so f5 flows into f0. Palette: kaio-ken red.

### A13 `spiritBomb`: the Spirit Bomb (8 frames, seamless loop)

The Genki Dama: **a huge sphere of gathered energy about 240 px across** (the engine grows it from a small ball over his
raised hands to several times his height). A white-hot center about 70 px, then a luminous pale cyan-white body with
**hard bands** and **slow swirling surface currents**, a bright crackling rim, and 6-8 small energy motes outside the
rim streaking toward it (the energy of all living things flowing in). Paler and whiter-blue than the Kamehameha, but
still a sphere with visible bands and swirls, never a flat white disc: white is at most 35 % of its area. The currents
turn slowly (about 1/16 turn per frame) and the motes move inward, so f7 flows into f0. Palette: spirit.

### A14 `spiritBombBlast`: the impact (8 frames, once, bottom anchor)

The Spirit Bomb landing on the opponent's spot. f0: the sphere squashed onto the floor, about 240 px wide and 150 px tall,
a bright line along y = 240. f1: a **dome of energy** about 250 px wide and 200 px tall rising from the floor, a bright
core at its base. f2-f3: the dome at full size (the cell), columns and rays of light shooting up out of it, shockwave
lines racing along the floor. f4: the dome thinning to a banded shell with cracks of light. f5-f7: the shell breaking
into motes that drift up and fade. Keep the dome banded (no solid white). Palette: spirit.

### A15 `superSaiyanBurst`: Super Saiyan (8 frames, once, bottom anchor)

The golden aura exploding as he transforms in the intro (he screams in a wide stance, about 186 px tall; keep a vertical
oval x 88-168, y 50-238 clear). f0: a golden flash outlining that oval, a bright vertical spike shooting up from his
head to the top edge. f1-f2: **tall golden flame tongues** shooting up and out to the top and sides, a few straight
energy spikes, a flat shock ring along the floor. f3: at full size. f4-f7: the tongues settling into the classic tall
Super Saiyan aura shape round the body, the outer parts breaking into rising sparks. Palette: dragon gold.

## 4. Part B: Goku character art

Scale and anatomy follow the title-style contract: the same pixel density as his approved idle and combat cell, 256 px
cells, pivot `[128, 240]`, facing right, 48-color sheet palette. Super Saiyan in every frame (golden hair, teal-green
eyes, the orange gi over the dark blue undershirt), except B6 f0. Attach his approved title-style neutral/combat cells
(`reference/title_style_lineup_v02.png`) and his approved idle v02 as references. **No ki, glow, aura, dragon or energy
in any sprite:** the engine draws every effect. Never scale a pose to standing height: a crouch or a flight is shorter
or longer than he stands. Frame counts, phases, `bodyHeight` and `ms` stay as the manifest has them (S = startup,
A = active, R = recovery).

### B1 `specialForward` v01: DRAGON FIST (7 frames, phases 2/2/3)

- **f0 · S, the stance:** a deep wide horse stance, torso turned, the **near fist chambered at the hip** (knuckles down),
  the far hand open forward at chest height; head down, glaring past the far hand, teeth gritted.
- **f1 · S, the coil:** weight shifted onto the rear leg, the near fist drawn further back past the hip (elbow high
  behind him), the far arm swinging back too; about to launch. Hair and gi stirring upward.
- **f2 · A, the launch:** he springs off the rear foot, body leaning about 45 degrees forward, the **near arm driving
  forward to full extension at chest height** (fist at about x 220-236, y 110-130), the far fist pulled to the hip, front
  knee bent, rear leg straight, the rear foot leaving the floor; mouth open shouting.
- **f3 · A, the flight:** **flying fist-first**, his body straight and **nearly horizontal at chest height** (hips about
  y 150-170), the near fist leading at about x 236-248, y 118-136, the far arm tucked along his side, legs together
  trailing behind to about x 20-40, toes pointed; shouting, fierce. The whole figure inside x 4-252. This is the frame the
  engine holds while the dragon strikes.
- **f4 · R, landing past them:** one foot down and sliding, the other trailing, body rising toward upright, the near fist
  still forward.
- **f5 · R:** upright, half turned, the near fist drawn back to the chest.
- **f6 · R:** back toward his fighting stance.

**Anchors (hitboxes.json `specialForward`):** the **near fist** as `hand` in every frame, measured on the packed cells.
`hit` boxes on f2 and f3 on the fist and forearm (the punch connects anywhere along the flight).

### B2 `specialDown` v01: INSTANT TRANSMISSION (4 frames, phases 2/1/1, no hit boxes)

- **f0 · S:** standing upright and still, feet about shoulder-width, the near hand rising toward his face with the
  **index and middle fingers extended together** (the other fingers curled), the far arm relaxed at his side; eyes
  closing.
- **f1 · S:** the **two fingers pressed to the center of his forehead**, eyes shut, brow focused, mouth closed; the far
  arm loose at his side. Perfectly calm.
- **f2 · A:** the same pose, the hair and gi lifted 1-2 px as if by a breeze (the frame he vanishes on).
- **f3 · R, the arrival:** the same fingers-to-forehead pose, **eyes open**, glancing at the opponent, the body
  already turning toward them (shown where he reappears behind them, just before the kick).

Record the forehead fingertips as `hand` in all four frames (the shimmer gathers there).

### B3 `superPose` v01: SPIRIT BOMB (4-frame loop)

The gathering pose, held through the super flash and while the Spirit Bomb grows: feet planted wide, knees slightly
bent, chest out, **both arms raised high in a wide V** (each about 25-30 degrees out from vertical), elbows nearly
straight, **palms open and facing the sky**, fingers spread; head tilted back, looking up at the sphere, mouth set. The
fingertips must stay inside the cell (y >= 4): widen the stance and spread the arms rather than shrinking him. f1-f3: the
same pose trembling 1-2 px, the hair and gi stirred upward in new shapes by the energy streaming in. Record the point
midway between his palms as `hand` in every frame (the engine grows the sphere above it).

### B4 `specialUp` v01: RISING KICK (6 frames, phases 2/2/2)

The kick-up that opens the afterimage chase (after it connects the engine leaves an afterimage, puts him above them and
plays his approved `airHeavy` v06 for the two-fist hammer).

- **f0 · S:** a low crouch, both feet planted, fists in, looking up.
- **f1 · S:** deeper, coiled to spring.
- **f2 · A:** springing up off the floor: the **near leg kicking straight up**, the foot above his head, toes up; the far
  leg trailing straight down; arms flung down and back for balance; body leaning back.
- **f3 · A:** higher, the kicking leg fully extended upward, the body stretched vertical, the other knee tucked.
- **f4 · R:** tucking into a forward flip: knees to chest, the body rotating forward.
- **f5 · R:** mid-flip, both fists clasped together above his head, ready for the hammer; drawn to flow into `airHeavy`
  v06 f0.

**Anchors:** `hit` boxes on f2 and f3 on the kicking foot and shin.

### B5 `throw` v01: AIR KI BLAST (4 frames, phases 1/1/2)

In the air, feet off the floor with the legs bent beneath him (the air volley and the air beam-clash hold).

- **f0 · S:** twisting back, the near palm drawn back beside the hip, the far arm forward for balance.
- **f1 · A:** the **near arm thrust straight forward and slightly down** (about 15 degrees below horizontal), the **open
  palm facing the opponent**, fingers up; body squared; shouting.
- **f2 · R:** the arm still out, the body recoiling 2-3 px back.
- **f3 · R:** the arm coming back, settling into his air pose.

Record the near palm as `hand` in all four frames (the blasts and the muzzle flash leave it).

### B6 `intro` v01: SUPER SAIYAN (4 frames, played once and held on f3)

The match intro becomes the transformation. The engine plays the strip once (the manifest's `ms` paces it) and adds the
golden burst (A15) on f1.

- **f0 · base form:** Goku **in his base form: his famous black spiky hair** (the classic base silhouette, same skull and
  hairline as his Super Saiyan design), **black eyes**; a wide stance, fists clenched at his sides, arms and shoulders
  tensed, head thrown back, **screaming** as the power wells up.
- **f1 · the instant:** the same screaming pose, the **hair standing straight up and flashing gold** (the Super Saiyan
  spikes rising, pale yellow-gold with white highlights), the eyes turning teal.
- **f2 · Super Saiyan:** his approved Super Saiyan design exactly, still screaming, fists clenched, the golden hair fully
  spiked up.
- **f3 · settled:** Super Saiyan, standing tall in his fighting guard, a hard calm stare at the opponent, a faint smirk.

The black hair adds dark colors to his 48-color sheet palette; Claude handles the palette reserve when packing
(ADR 0046). Same body, head and outfit in all four frames; only the hair and eyes change.

### B7 `ui_super_bg` v02: the SUPER banner backdrop, Spirit Bomb (optional: only on the user's yes)

The approved `ui_super_bg` v01 shows red Kaio-ken fists flying across a rocky wasteland: the old Kaio-ken Rush. With
the Spirit Bomb as the SUPER it no longer matches its move. Same contract as v01 (`art/characters/SUPER_ART_BRIEF.md`:
1536 x 1024 source, the middle 4:1 band y = 320-704 is what shows, background only, no character, text, logo or border,
hard pixel clusters, at most 48 colors): the same rocky wasteland and broken stone pillars under a **deep blue twilight
sky**, a **huge glowing blue-white Spirit Bomb** high in the band's upper middle (pale white-blue core, banded shell,
crackling rim), and **thin streams and motes of light rising from the ground, the rocks and the far mountains into
it** (the energy of everything around). Cool blue and white light on the rock tops; no red. The `ui_super_fg` v01
cutout stays. Claude asks the user about it with batch 1; draw it only once the user says yes (relayed as usual).

## 5. Order, review and handback

1. **Batch 1, the ultimate and the SUPER:** A1 `kamehameha`, A2 `kamehamehaHead`, A3 `kamehamehaRing`,
   B3 `superPose` v01, A13 `spiritBomb`, A14 `spiritBombBlast`. Pack Goku with the candidate, run
   `npm run body goku superPose` and the Astra audit on B3, then one review page (the raw strips, packed frames beside
   idle f0 and the approved combat cell, the effects at game scale as GIFs over a stage-colored background; show A1 at
   three sizes in his `beamCharge` hands and A2 on the end of a beam band); ring Claude for the user's approval. B7
   joins this batch if the user has said yes by then (show it in the 4:1 crop with the `super_fg` cutout over it).
2. **Batch 2, Dragon Fist:** B1 `specialForward` v01 (with `npm run body goku specialForward` and the Astra audit),
   A7 `dragonFistAura`, A8 `dragonFistDragon`, A9 `dragonFistBurst`. One review page (A8 over a standing body
   silhouette, A7 behind B1 f3); ring Claude.
3. **Batch 3, Kaio-ken and Instant Transmission:** B2 `specialDown` v01 (with `npm run body goku specialDown` and the
   Astra audit), A10 `instantTransmission`, A11 `kaiokenBurst`, A12 `kaiokenAura`. One review page (A11 and A12 around
   his `charge` v05 frames); ring Claude.
4. **Batch 4, ki blasts, Rising Kick and the intro:** B4 `specialUp` v01, B5 `throw` v01, B6 `intro` v01 (with
   `npm run body goku specialUp throw intro` and the Astra audit), A4 `kiBlast`, A5 `kiMuzzle`, A6 `kiBlastBurst`,
   A15 `superSaiyanBurst`. One review page; ring Claude.

Each ring names the versions, any holds and the review URL. Record each candidate in `art/REVIEW.md`, the effect
entries in `art/manifest.json` (`vfx.effects.<name>`: frames, ms, colorRule `fullColor`, anchor, fill, `hd: true`,
step, status, version) and `art/TRACKER.md`. Claude integrates each approved batch in game and shows the user an
in-game preview.
