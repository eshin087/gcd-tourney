# Sasuke: moves and visual effects

How each of Sasuke's moves should look in the game, which **engine effects** (fixed names, shared by
every character) draw on top of his sprite, and which **Sasuke-specific effect art** to request.
Frame-by-frame poses: [ANIMATIONS.md](ANIMATIONS.md). Effect sheet rules:
[art/vfx/EFFECTS.md](../../vfx/EFFECTS.md) and [art/SPEC.md](../../SPEC.md). Cell coordinates follow
**art spec v2** ([ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md)): 256×256 cell,
pivot `[128, 240]`, `pixelsPerUnit` 128, facing right.

Gameplay numbers below are copied from `src/game/moves.js` and `src/characters/sasuke.js` for
reference (60 fps frames). **The code is the source of truth.** If they differ, update this file and
note it in `CHANGELOG.md`.

Converting between cell pixels and the engine's world offsets (from the feet, facing right):
**forward = (cell x − 128) ÷ 128, up = (240 − cell y) ÷ 128**; back the other way: cell x = 128 +
forward × 128, cell y = 240 − up × 128. The engine offsets did not change in v2; only their pixel
positions moved.

## 1. Move list

| input (VS CPU · pad) | move | animation(s) | engine data | look |
|---|---|---|---|---|
| J ×4 · □/X ×4 | auto combo | `light1` → `light2` → `light3` → `light4` | `MOVES.light1..4` | jab, rear straight, front kick (counts as low), spinning roundhouse (wall bounce) |
| K · △/Y | launcher | `heavy` | `MOVES.heavy` (hop 5, launch [2.4, 15.5]) | rising uppercut, small hop; Jump on hit chases into the air |
| J in air ×3 · K in air | air combo | `airLight1..3`, `airHeavy` | `MOVES.airLight1..3`, `airHeavy` | air jab, air front kick, air spin kick (wall bounce), double-fist spike (ground bounce) |
| L tap · ○/B tap | **CHIDORI** (1 bar) | `special` | `SPECIALS.chidori` | lightning in the hand held low behind, low sprint, spear-hand thrust |
| L in air · ○/B in air | **FIREBALL** (½ bar) | `throw` | `PROJECTILES.fireball` | Great Fireball breathed from the mouth |
| K+L · △+○ | **LIGHTNING LANCE** (3 bars) | `beamCharge` → `beamFire` | `ULTIMATE`, `def.beam` | super flash with the red-eye cut-in, then a blue lightning beam from a spear-hand |
| hold L · hold ○ | ki charge | `charge` | — | aura powering up |
| Shift+L · L1+○ | vanish (1 bar) | `vanish` → `light4` | `VANISH`, `MOVES.vanishKick` (uses `light4`) | high-speed blur, reappear behind, spinning roundhouse |
| O / double-tap · R1 | dash / **super dash** | `dash`, `backDash`, `superDash` | `SUPER_DASH` | low dash, back hop, homing flight angled upward |
| Shift · L1 | guard | `guard`, `block` | — | X-block with the navy arm guards |
| — | reactions | `hurtHigh`, `hurtLow`, `launched`, `spin`, `airRecover`, `down`, `getup`, `stagger`, `ko` | — | see ANIMATIONS.md |
| — | match moments | `intro`, `taunt`, `win` | — | arms-crossed cold stare, beckon with the Sharingan, back-turned salute |

The sword at the back of his belt is costume only: **no move draws or swings it**, and no sprite shows
it out of the sheath. A sword move would need new animation names, an engine task and an ADR.

## 2. Engine effects Sasuke uses (shared atlas)

These names are fixed (`src/art/vfxPainter.js`). Their art lives in `art/vfx/` and is generated once
for everyone (prompts in `art/vfx/PROMPTS.md`). "Tinted" effects are drawn white or grey and colored
by the engine. This table says what Sasuke's moves need from them, so the shared art also works for
his lightning and fire. VFX cells stay 128×128 (ppu 56) in spec v2.

| effect | Sasuke uses it for | tint the engine applies | what his moves need from the art |
|---|---|---|---|
| `lightning` (6 f) | **Chidori** ball in his hand (randomly rotated every tick), short extra arcs around it, beam-clash bolt | `#d8f0ff` (hand), `#ffffff` (arcs) | a dense knot of jagged, forked bolts radiating from the center, 2 to 3 px thick trunks with 1 px branches; must still read when rotated to any angle |
| `glow` (2 f) | Chidori hand glow, fireball glow, smash flash, aura glow | `#5aa8ff` (Chidori), `#ff7a20` (fireball), aura `#408cff` | soft disc in 3 to 4 hard alpha steps |
| `fire` (4 f, full color) | **Fireball** body (scaled 1.5×, looping) and its trailing puffs | none (full color) | a round roiling fireball: yellow-white core, orange body, red-orange licks trailing to the **left** (it flies right) |
| `smoke` (7 f, full color) | fireball explosion (5 puffs), vanish | none | grey-white puffs |
| `spark`, `star`, `lines`, `burst`, `ring` | hit sparks: light = spark + star + lines; heavy adds burst + ring; smash (light4, heavy, Chidori, Fireball) adds a white glow flash and two bursts | per hit | see `art/vfx/EFFECTS.md` |
| `flame`, `streak` (tinted) | ki **charge** aura and **Lightning Lance** charge aura (stronger) | flame `#408cff`, streak `#ccebff` | flame tongues and vertical light streaks, bottom-anchored |
| `dust`, `crater` | dashes, landings, ground bounce, KO, final beam hit | none | — |

Character-colored engine touches (no art needed): rush afterimages tinted `#9ad8ff` during the Chidori
sprint, super-dash burst and lines in `#4a7bff`, beam shader colors core `#f0fbff`, mid `#62b8ff`, edge
`#3a54ff`, beam-hit explosion in `#62b8ff`.

## 3. Move-by-move visual brief

### Auto combo and launcher (`light1`–`light4`, `heavy`)

- Short, sharp, straight strikes along the screen horizontal. The **active frames must put the fist or
  foot where the opponent's body is** (ADR 0007 contact zones, also in CHARACTER.md §3). This is the fix
  for "hits that land on air": the hitbox comes from the drawn limb.
- Contact zones (x, y, 256 cell): `light1` fist 206-226, 64-86 · `light2` fist 214-236, 70-92 ·
  `light3` sole 222-246, 122-148 · `light4` foot 224-248, 56-88 · `heavy` f3 fist 180-208, 58-86, f4
  overhead 160-188, 22-46.
- Timing: `light1` 5/3/11, `light2` 5/3/12, `light3` 6/4/14, `light4` 9/4/22, `heavy` 12/5/22
  (startup/active/recovery frames at 60 fps). Light hits get a small spark. `light4` and `heavy` get the
  big smash spark, screen shake and (light4) a wall bounce.
- Sasuke flavor: compact chambering, pointed toes, a straight supporting leg on kicks, long clean
  lines from the realistic proportions, and the collar crest, rope bow and sword flashing past in the
  `light4` spin. The waist cloth parts for the kicking leg and never covers the foot.

### CHIDORI (`special`): signature rush, 1 ki bar

| | |
|---|---|
| Timing | startup 28 (f0–f2, charge in hand), active 18 (f3–f5, rush at speed 18), recovery 20 (f6–f7). **On hit the animation jumps to f6.** |
| Damage | 165, launch [14, 11], hitstop 20, wall bounce, smash spark, shake 0.9 |
| Name banner | `CHIDORI`, color `#9ad8ff` |
| Sound | loop `chidori` (chirping birds) while the lightning is out |
| Engine effects | `lightning` kept on the hand (scale grows 0.4 → 0.9 over startup, tint `#d8f0ff`, new random rotation every tick), `glow` behind it (`#5aa8ff`, opacity 0.5), 60 % chance per tick of a short white `lightning` arc 0.3 units away. Afterimages tinted `#9ad8ff` during the sprint. |
| Hand anchor (cell px) | **f0–f5 (startup and the whole active phase): ~(64, 199)** (engine offset 0.5 back, 0.32 up), low behind his near (R) leg, so the lightning drags along the floor during the sprint. **After a hit only (about 6 game frames of f6): ~(218, 140)** (0.7 forward, 0.78 up), thrust forward at stomach height; on a whiff the lightning is gone in recovery. Same values as ADR 0007 "Effect anchor points". Known gap: on the f5 whiff thrust the lightning still sits at the back point while the hand is forward (task ENG-015 moves it forward for the last third of the active phase). |
| Contact zone | ADR 0007 lists the special's technique hand at x 194–222, y 128–158 on f3–f5. **Sasuke differs on purpose:** on f3–f4 his hand trails behind (the lightning anchor above), so the rush hits with his leading body. Only f5 (thrust, tip x 206–222, y 130–150) and f6 (impact, around (218, 140)) put the hand in that zone. Check the f3–f4 hitbox after packing (§5). |
| Sprite rules | R hand open and empty (no lightning drawn). Sharingan on in every frame. The R arm must trail **low and behind** in f1–f4 and be **fully forward** in f5–f6. Sword stays sheathed. |

Look target (anime): a crackling ball of blue-white lightning with a high chirping sound. Many thin
forked arcs whip out of the palm, the glow lights his arm and face from below, and the bolts gouge the
floor as he runs.

If the drawn hand ends up somewhere else, do not redraw the strip. Write the measured cell point here
and tell Claude: the anchor offsets live in `handTick()` in `src/game/effects.js` (convert with the
formula at the top of this file).

### FIREBALL (`throw`): air projectile, ½ ki bar

| | |
|---|---|
| Timing | `MOVES.throw` 8/3/14, the fireball spawns at the start of f1 (end of startup) |
| Spawn point | 0.5 units in front, 0.9 units up: **(192, 125)** in the cell (ADR 0007). Sasuke's release point is his **mouth**, not a throwing hand. Target lips at about **(192, 125)** in f1 (x 186–198, y 118–132). If the packed mouth sits more than 12 px from the spawn point, write the measured point here and Claude moves the offset in `src/game/projectiles.js`. |
| Projectile | speed 12, radius 0.85, life 1.6 s, 80 damage, launch [8, 7], 1 per cast |
| Engine effects | `fire` sprite at 1.5× looping as the ball, `glow` `#ff7a20` behind it, `fire` puffs (0.7×, fading) trailing behind every other tick. On hit or when it hits the floor: explosion = `glow` `#ff8a30` + smash spark + floor `ring` + 5 `smoke` puffs, screen shake 0.5. |
| Sprite rules | tiger hand seal at the chin in f0, mouth wide open blowing in f1, no fire drawn. Sharingan on. |

Look target: a huge roiling ball of orange fire, much bigger than his head, rolling forward with flames
licking back along its path.

### LIGHTNING LANCE (`beamCharge` → `beamFire`): ultimate, 3 ki bars

| | |
|---|---|
| Sequence | super flash (42 f world freeze, dimmed screen) with the **red-eye cut-in** (`ui/cutin.png`, Sharingan) → `beamCharge` for 46 f (14 f when countering an enemy beam) → `beamFire` while the beam lasts (84 f) |
| Beam | drawn by a shader (no bitmap): core `#f0fbff`, mid `#62b8ff`, edge `#3a54ff`, width 1.25 units, extends at speed 34 up to 26 units, 12 damage every 5 f plus a 130 final hit (launch [17, 10]) |
| Beam origin | 0.8 units in front, 0.92 units up: **(230, 122)** (ADR 0007). In `beamFire` the spear-hand tip sits at x 222–238, y 112–132. The beam aims at the opponent's chest (y 131–138 on a same-size opponent). |
| Engine effects | charge: strong aura (`flame` `#408cff`, `streak` `#ccebff`, `glow`) and speed lines aimed at him. Fire: lighter aura. Clash with an enemy beam: white `lightning` bolt + rings and stars mixing both beam colors. Final hit: explosion in `#62b8ff` + floor crater. |
| Sprite rules | `beamCharge`: R hand low at the R hip (about x 76–92, y 146–164), open, L hand gripping the R wrist (Chidori charge pose). `beamFire`: R spear-hand thrust forward, L hand gripping the R forearm. Sharingan on. No lightning or beam drawn. |

### Ki charge (`charge`)

Engine: aura flames and light streaks in his colors, glow, small floor pebbles. Sprite: wide stance,
fists clenched at his sides, head up shouting, Sharingan on, hair, rope ends and waist cloth blown
upward.

### Super dash, dash, vanish

Engine: floor ring, `lines` and `burst` in `#4a7bff` (super dash), dust, afterimages. Sprite:
`superDash` flies angled about 25° upward, led by the R fist, knees bent as if kneeling in the air;
`vanish` f1 breaks into solid afterimage slices.

### Reactions and KO

Shared effects only (hit sparks, dust, crater, ground-bounce ring, barrier flash on wall bounce, KO
explosion). His job is clear, readable pain poses (ANIMATIONS.md). `down` and `ko` lie flat with the
head toward screen-left; `launched` is an arched diagonal with the hips lowest.

## 4. Sasuke-specific effect art (proposed: the engine does not read it yet)

The engine currently uses the shared effects above for everyone. These optional Sasuke-only sheets
would make his jutsu look like the anime. Generate them **after** the core character strips are
packed. They are **not** listed in `art/manifest.json` until an engine task adds support (ENG-014).
Until then, note them as "proposed" in the Sasuke notes of `art/TRACKER.md`.

Rules: same as the VFX atlas (128×128 cells, transparent, hard-edged pixel art, flat magenta `#FF00FF`
background in the raw image, no text). Effects face **right**. Names follow the shared rule for
character effects (`art/vfx/README.md` "Adding a new effect"): **`<charId>_<effect>`**, here
`sasuke_<effect>`. Codex saves every version as **`art/vfx/raw/_proposed/sasuke_<effect>_vNN.png`**
(ADR 0007 versioning, a row in `art/REVIEW.md` per version). The packer never reads `_proposed/`, so
they stay safe until the engine supports them.

| name | frames · ms | colors | what to draw |
|---|---|---|---|
| `sasuke_chidoriBall` | 8 · 40, loop | full color: `#ffffff` core, `#d8f0ff`, `#9ad8ff`, `#5aa8ff`, `#3a54ff` outer | dense crackling ball (about 56 px) of forked lightning around a white-hot core; every frame a different arc pattern; 3 to 6 long tendrils whip out to 60 px |
| `sasuke_chidoriDrag` | 6 · 40 | same blues | the bolts and sparks where the lightning scrapes the floor during the sprint: jagged ground-level arcs, a bright white cut line on the floor and spark chips flying back to the **left**; bottom-anchored on y 120 |
| `sasuke_chidoriPierce` | 6 · 35 | same blues + white | impact: a forward-pointing spear burst of lightning (arcs exploding to the right and around), frames 0–1 white-hot, then breaking into branching arcs |
| `sasuke_fireballCore` | 6 · 50, loop | `#fff4c0`, `#ffd04a`, `#ff9a24`, `#f05a14`, `#c42a10`, `#6a1a0a` (dark edge) | a large roiling fireball (fills about 110 px) rolling to the right, flame tongues streaming back to the left, swirling core |
| `sasuke_fireballBreath` | 4 · 50 | same fire colors | the stream leaving the mouth: a cone of fire widening to the right from a small point at the left edge (x ~8, y 64) |
| `sasuke_fireballBlast` | 7 · 50 | same fire colors + smoke greys `#c8c4d6`, `#f2f0f6` | explosion: white-yellow flash, expanding fire ring, then rolling smoke |
| `sasuke_lanceTip` | 4 · 40, loop, tinted | white and light grey only | the beam's spearhead: a sharp arrowhead of jagged lightning pointing right, with forked crackles along its edges |
| `sasuke_sharinganGlint` | 4 · 40, tinted | white only (engine tints red) | a tiny horizontal eye-gleam streak (anime "eye flash"), 24 px wide, for the instant the Sharingan turns on |

Engine follow-ups to copy into `docs/TASKS.md` (owner: Claude; ENG-014 covers 1 to 4):

1. Read per-character effect sheets (`sasuke_<effect>`, raws in `art/vfx/raw/_proposed/`) and prefer
   them over the shared ones for his moves.
2. During `beamCharge`, show Chidori lightning at the R hand (about cell **(84, 155)**: 0.34 back,
   0.66 up), the same way `handTick('chidori')` does for the special.
3. Optional: a jagged-edge "lightning" style for the beam shader for characters whose beam is
   lightning.
4. Optional: play `sasuke_sharinganGlint` at the eye on the first frame of `special`, `throw` and
   `beamCharge`.

## 5. Hitbox overrides (`art/characters/sasuke/hitboxes.json`)

The packer builds hitboxes from the drawn silhouette (the part that sticks out forward on active
frames). Most moves need nothing. Create `hitboxes.json` (format:
`art/characters/_template/hitboxes.example.json`) only if a Sprite Lab or in-game (`?debug`) check shows
a bad box. Starting values below are **frame-local pixels in the final 256×256 cell**, facing right,
keyed by animation and 0-based frame number. **Verify them after packing.**

| anim · frame | why | starting `hit` box `[x, y, w, h]` |
|---|---|---|
| `special` · 3, 4 | the rush hits on contact while the hand trails behind, so the box belongs on his leading shoulder and head | `[166, 70, 50, 90]` |
| `special` · 5 | spear-hand thrust (ADR zone x 194–222, y 128–158) | `[194, 128, 30, 30]` |
| `heavy` · 4 | fist is above the head, but the uppercut must still catch a chin just in front (HIGH zone y 58–90) | `[158, 14, 32, 62]` |
| `light4` · 3, 4 | make sure the box covers shin and foot, not only the toes (ADR zone x 224–248, y 56–88) | `[196, 56, 52, 32]` |

Example file:

```json
{
  "special": {
    "3": { "hit": [[166, 70, 50, 90]] },
    "4": { "hit": [[166, 70, 50, 90]] },
    "5": { "hit": [[194, 128, 30, 30]] }
  }
}
```

## 6. UI art (per character)

Prompts: [PROMPTS.md](PROMPTS.md) U1–U3 (step 11). Codex saves every candidate as
**`raw/ui_<name>_vNN.png`** (ADR 0007; the packer skips `ui_*` files in `raw/`) and adds a row to
`art/REVIEW.md`. After "approve vNN" Codex **copies** that version to `ui/<name>.png`; the packer removes
the magenta background, fits it to the exact size below and writes it to `public/characters/sasuke/`
(SPEC.md "Per-character UI images"). Rejected UI versions move to `raw/_rejected/`. UI sizes did not
change in v2.

| file | size | content |
|---|---|---|
| `ui/portrait.png` | 96×96, transparent | head and shoulders, 3/4 facing right, cold glare, **dark eyes** (no Sharingan), long bangs framing the face, the tall white collar open at the throat, **no headband** |
| `ui/cutin.png` | 480×128, opaque | DBFZ super-flash eye strip: both eyes with the **Sharingan** (three tomoe), brows down, black-blue bangs crossing the frame, a few blue lightning glints; the face fills the strip, with a flat dark navy band showing only around the eyes and brows; no speed lines (the HUD adds them) |
| `ui/select.png` | 384×384, transparent | full body facing right in the Shippuden outfit, low Chidori stance: R hand low behind him crackling with blue-white lightning (drawn into this illustration), L hand gripping the R forearm, Sharingan on, bangs, rope ends and waist cloth blown by the chakra wind, sword sheathed at his back |
