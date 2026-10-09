# Gojo: moves and visual effects

How each of Gojo's moves should look in the game, which **engine effects** (fixed names, shared by
every character) draw on top of his sprite, and which **Gojo-specific effect art** to request.
Frame-by-frame poses: [ANIMATIONS.md](ANIMATIONS.md). Effect sheet rules:
[art/vfx/EFFECTS.md](../../vfx/EFFECTS.md) and [art/SPEC.md](../../SPEC.md). Cell coordinates follow
**art spec v2** ([ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md)): 256×256 cell,
pivot `[128, 240]`, `pixelsPerUnit` 128, facing right. His kit follows the move system v2
([ADR 0009](../../../docs/decisions/0009-move-system-v2.md)).

Gameplay numbers below are copied from `src/game/moves.js` (`MOVES`, `SPECIAL_MOVES`, `SUPERS`,
`PROJECTILES`), `src/game/kit.js` and `src/characters/gojo.js` for reference (60 fps frames). **The
code is the source of truth.** The kit is new (ENG-028) and may still be tuned: if the numbers differ,
update this file and note it in `CHANGELOG.md`.

Converting between cell pixels and the engine's world offsets (from the feet, facing right):
**forward = (cell x − 128) ÷ 128, up = (240 − cell y) ÷ 128**; back the other way: cell x = 128 +
forward × 128, cell y = 240 − up × 128.

## 1. Move list

| input (VS CPU · pad) | move | animation(s) | engine data | look |
|---|---|---|---|---|
| J ×4 · □/X ×4 | auto combo | `light1` → `light2` → `light3` → `light4` | `MOVES.light1..4` | lead palm jab (other hand in the pocket), rear palm strike, push kick with both hands in the pockets (counts as low), spinning roundhouse (wall bounce) |
| K · △/Y | launcher | `heavy` | `MOVES.heavy` (hop 5, launch [2.4, 15.5]) | rising elbow, small hop; Jump on hit chases into the air |
| J in air ×3 · K in air | air combo | `airLight1..3`, `airHeavy` | `MOVES.airLight1..3`, `airHeavy` | air palm jab, air front kick, air spinning heel kick (wall bounce), two-handed hammer (ground bounce) |
| L tap · ○/B tap | **LAPSE: BLUE** (1 bar) | `special` | `SPECIAL_MOVES.blue` (kind `pull`) | two-finger point; a blue gravity vortex opens in front of him, drags the opponent in, pops them up |
| toward + L · → + ○ | **REVERSAL: RED** (1 bar) | `specialForward` (fallback `special`) | `SPECIAL_MOVES.red` (kind `shot`, projectile `red`) | finger flick, recoil; a red orb blasts the opponent into the wall |
| up + L · ↑ + ○ | **BLINK** (½ bar) | today `vanish` (hidden) → `jumpFall`; briefed as `specialUp` (§3) | `SPECIAL_MOVES.blink` (kind `teleport`, to `above`) | vanishes and reappears above the opponent |
| down or away + L · ↓/← + ○ | **INFINITY** (½ bar) | `specialDown` (fallback `charge`) | `SPECIAL_MOVES.infinity` (kind `counter`) | calm raised open palm; melee attackers freeze, projectiles stop |
| L in air · ○/B in air | **REVERSAL: RED** (air, 1 bar) | `throw` | `SPECIAL_MOVES.redAir` (kind `shot`) | air finger flick, recoil |
| K+L · △+○ | **HOLLOW PURPLE** (3 bars) | `beamCharge` → `beamFire` | `ULTIMATE`, `def.beam` (width 1.85) | super flash with the Six-Eyes cut-in, hands apart (blue and red), palm thrust, a wide purple beam |
| H (alt B) · L2/LT | **DOMAIN EXPANSION: UNLIMITED VOID** (SUPER, 3 bars) | `superPose` (fallback `taunt`) | `SUPERS.unlimitedVoid` (kind `domain`) | crossed-fingers sign, blindfold up, glowing blue eyes; the stage becomes the void and the opponent freezes |
| — | **Infinity** (passive) | none | `kit.passive: 'infinity'` | non-beam projectiles stop and fade before touching him; no chip damage while blocking |
| hold L · hold ○ | ki charge | `charge` | — | calm power-up, palms down |
| Shift+L · L1+○ | vanish (1 bar) | `vanish` → `light4` | `VANISH`, `MOVES.vanishKick` (uses `light4`) | high-speed blur, reappear behind, spinning roundhouse |
| O / double-tap · R1 | dash / **super dash** | `dash`, `backDash`, `superDash` | `SUPER_DASH` | hands-in-pockets glide, back hop, flying palm with the other hand in the pocket |
| Shift · L1 | guard | `guard`, `block` | — | casual crossed-wrist high block, open palms |
| — | reactions | `hurtHigh`, `hurtLow`, `launched`, `spin`, `airRecover`, `down`, `getup`, `stagger`, `ko` | — | see ANIMATIONS.md; the blindfold stays on |
| — | match moments | `intro`, `taunt`, `win` | — | hands-in-pockets shrug, looming grin, peace sign |

**The blindfold** is on in every body sprite except `superPose`; the eyes otherwise appear only on the
UI cut-in (§6).

## 2. Engine effects Gojo uses (shared atlas)

These names are fixed (`src/art/vfxPainter.js`). Their art lives in `art/vfx/` and is generated once
for everyone (prompts in `art/vfx/PROMPTS.md`). "Tinted" effects are drawn white or grey and colored
by the engine. This table says what Gojo's moves need from them. VFX cells stay 128×128 (ppu 56).

| effect | Gojo uses it for | tint the engine applies | what his moves need from the art |
|---|---|---|---|
| `orb` (6 f, full color) | **Blue** vortex core (scale grows 0.25 → 1.25 over 8 frames) and the **Red** orb (scale 1.25) | `#7ab8ff` (Blue), `#ff4050` (Red) | a spiraling sphere that still reads when tinted blue or red (today it is Naruto's Rasengan art; §4 proposes Gojo-only sheets) |
| `glow` (2 f) | Blue vortex halo (`#2a6aff`, up to 2.6×), Red orb halo (`#ff2038`) and trail puffs (`#ff3048`), Infinity stop flash (`#9fd8ff`) | per use | soft disc in 3 to 4 hard alpha steps |
| `ring` (6 f, tinted) | Blue pull rings every 4 frames (`#4aa8ff`), Infinity counter ring around his body (`#d8f2ff`, at 0.9 up), Infinity projectile stop (`#d8f2ff`) | per use | flattened shock ring |
| `star` (5 f, tinted) | particles sucked into the Blue vortex (`#bfe4ff`) | `#bfe4ff` | small four-point twinkle |
| `smoke`, `lines` | Blink / vanish poof | none / white | grey-white puffs, radial lines |
| explosion (glow, bursts, ring, smoke) | Blue pop at the end of the vortex (`#6ab4ff`), Red impact (`#ff3048`), Hollow Purple final hit (`#b46cff`) | per use | see `art/vfx/EFFECTS.md` |
| `spark`, `star`, `lines`, `burst`, `ring` | hit sparks: light = spark + star + lines; heavy adds burst + ring; smash (light4, heavy, Red, Blue pop) adds a white glow flash and two bursts | per hit | see `art/vfx/EFFECTS.md` |
| `flame`, `streak` (tinted) | ki **charge** aura and **Hollow Purple** charge aura (stronger) | flame `#73b8ff`, streak `#e6f5ff` | flame tongues and vertical light streaks, bottom-anchored |
| `dust`, `crater` | dashes, landings, ground bounce, KO, final beam hit | none | — |

Character-colored engine touches (no art needed): afterimages and the Blink ghost in `#9fd8ff` /
`#7ac8ff`, super-dash burst and lines in `#7ac8ff`, beam shader colors core `#ffffff`, mid `#b46cff`,
edge `#6a2cd8` (width 1.85), the **void stage** for the Domain (engine `setStage('void')`), the
"UNLIMITED VOID" announcement and the white flash.

## 3. Move-by-move visual brief

### Auto combo and launcher (`light1`–`light4`, `heavy`)

- Effortless, long-reach strikes along the screen horizontal. **Palm strikes** (heel of the palm
  forward, fingers up) instead of fists, fast clean kicks, a rising elbow. The **active frames must put
  the palm, foot or elbow where the opponent's body is** (ADR 0007 contact zones, also in
  CHARACTER.md §3). The hitbox comes from the drawn limb.
- Contact zones (x, y, 256 cell): `light1` palm 206-226, 64-86 · `light2` palm 214-236, 70-92 ·
  `light3` sole 222-246, 122-148 · `light4` foot 224-248, 56-88 · `heavy` f3 elbow 180-208, 58-86, f4
  overhead 160-188, 22-46.
- Timing: `light1` 5/3/11, `light2` 5/3/12, `light3` 6/4/14, `light4` 9/4/22, `heavy` 12/5/22
  (startup/active/recovery frames at 60 fps). Light hits get a small spark. `light4` and `heavy` get the
  big smash spark, screen shake and (light4) a wall bounce.
- Gojo flavor: **no step-in** (his reach does it), the R hand stays in its pocket on `light1`, both
  hands stay in the pockets on `light3`, and the hands go back into the pockets on the last recovery
  frame. `heavy` is a **rising elbow** so nothing rises above his hair (the height ceiling).
- Reach check for Claude: his limbs are about 7 % longer than the cast's and the art keeps the same
  contact zones, so his `reach` / `lunge` in `MOVES` may need a small per-character bonus or none; tune
  to the packed boxes.

### LAPSE: BLUE (`special`): pull, 1 ki bar

| | |
|---|---|
| Data | `SPECIAL_MOVES.blue`: kind `pull`, startup 12, recovery 20, vortex at `dist` 2.6 in front (y = max(0.9, opponent + 0.9)), radius 3.6, lasts 50 frames, pull 9, a tick hit (9 damage) every 9 frames, then a pop (42 damage, launch [0, 13.5]). Name banner `LAPSE: BLUE`, color `#4aa8ff`. Gojo is free to act while the vortex runs. |
| Animation timing | `kit.js` `pose(f, 'special', t, 12, 14, 32)`: startup 12 game frames over f0–f2, **active 2 game frames** over f3–f5 (the vortex spawns on the first one), recovery 18 game frames over f6–f7. So **f6 is the frame the player sees while the vortex pulls**. |
| Engine effects | the vortex: `orb` tinted `#7ab8ff` growing to 1.25×, `glow` `#2a6aff` up to 2.6×, a `ring` `#4aa8ff` every 4 frames, `star` particles `#bfe4ff` sucked inward; on the pop an explosion tinted `#6ab4ff` and a 0.4 shake. |
| Hand | R two-finger sign, fingertips at about x 212–222, y 100–110 on f2–f6. There is **no hand anchor**: the vortex sits 2.6 units (about 333 px) in front of him, far outside the cell. An optional fingertip glint is proposed in §4. |
| Sprite rules | L hand in the pocket. Two straight fingers (index + middle), the others curled. No blue drawn. Hair tips and hem pulled 1–2 px toward the vortex on f3–f6. **No melee hitbox** (§5). |

Look target (anime): an imploding sphere of blue light that bends space toward it, rubble and air
spiraling inward.

### REVERSAL: RED (`specialForward` on the ground, `throw` in the air): shot, 1 ki bar

| | |
|---|---|
| Data | `SPECIAL_MOVES.red`: kind `shot`, anim `specialForward`, startup 14, active 3, recovery 22. `redAir`: anim `throw`, startup 10, active 3, recovery 16. Projectile `PROJECTILES.red`: speed 21, radius 0.95, life 0.42 s (short range), 88 damage, launch [20, 7], wall bounce, smash spark. Name banner `REVERSAL: RED`, color `#ff3a4a`. |
| Spawn point | every projectile spawns 0.5 forward, 0.9 up: **(192, 125)** (`projectiles.js`). Gojo's release point is his **R fingertips** at about **(196, 124)** on `specialForward` f2 and `throw` f1 (inside the ADR release zone x 186–212, y 116–142). If the packed fingertips sit more than 12 px from (192, 125), write the measured point here and Claude adds a per-move spawn offset. |
| Engine effects | `orb` tinted `#ff4050` (1.25×) with a `glow` `#ff2038`, red glow puffs `#ff3048` trailing behind; on hit an explosion tinted `#ff3048`, smash spark, wall bounce. |
| Sprite rules | L hand in the pocket. f0–f1 finger-gun with the middle finger cocked against the thumb, f2 the flick (mouth open), f3 the recoil (arm kicked up and back, hair and hem blown back). No orb drawn. **No melee hitbox** (§5). |

Look target: a small, dense red sphere that detonates outward from his fingertip, a shock of repelling
force that hurls the opponent away.

### BLINK (`specialUp`): teleport, ½ ki bar

| | |
|---|---|
| Data | `SPECIAL_MOVES.blink`: kind `teleport`, hide 6 frames, to `above` (offset 0.9 beside the opponent, 2.3 up), no ghosts, no follow-up move, color `#9fd8ff`. |
| Engine today | `kit.js` `START.teleport` enters **`vanish`** and hides the sprite **from the first frame** (smoke + `lines` poof, a ghost in `#9fd8ff`), then after 6 frames he reappears above the opponent in `jumpFall`. So with the current engine **no Blink frame is visible**: the poof, then `jumpFall`. |
| Brief (user design) | `specialUp` = a teleport pose that reuses the `vanish` timing: f0–f1 a one-hand sign at the chin and a crouch (startup), f2–f3 the sliced blur (active), f4–f5 reappearing in mid-air looking down (recovery). |
| Needed from Claude to use it | give `blink` an `anim: 'specialUp'`, let the teleport kind play `m.anim || 'vanish'`, show f0–f1 before hiding and f4–f5 after reappearing (then `jumpFall`). Until then the strip is optional polish; generate it last among A39–A42. |

### INFINITY (`specialDown`): counter, ½ ki bar

| | |
|---|---|
| Data | `SPECIAL_MOVES.infinity`: kind `counter`, len 26, recovery 14, stagger 50, color `#d8f2ff`. Melee attackers that touch him during the window are frozen (stagger); projectiles stop. |
| Animation timing | `pose(f, 'specialDown', t, 3, 26, 40)`: startup 3 game frames over f0–f1, **f2 held for the whole 23-frame window**, recovery 14 over f3. |
| Engine effects | a `ring` `#d8f2ff` (1.1×) around his body at 0.9 up (cell (128, 125)) when the stance starts; the passive's stop effect (`ring` + `glow` `#9fd8ff`) on stopped projectiles. |
| Palm | R open palm raised forward at about **(200, 90)** (0.56 forward, 1.17 up) on f1–f2. Not an engine anchor today; an optional ripple at the palm is proposed in §4. |
| Sprite rules | L hand in the pocket. Calm smile, perfectly still on f2. No barrier drawn. **No hitbox** (§5). |

### Infinity passive

Engine only (`projectiles.js`): a non-beam projectile that would touch him slows to nothing and fades,
with a `ring` and `glow` flash and a callout, while he can act. No sprite needed. When he blocks he
takes no chip damage; `block` still reads as a normal block.

### HOLLOW PURPLE (`beamCharge` → `beamFire`): ultimate, 3 ki bars

| | |
|---|---|
| Sequence | super flash (world freeze, dimmed screen) with the **Six-Eyes cut-in** (`ui/cutin.png`) → `beamCharge` → `beamFire` while the beam lasts (timings in `ULTIMATE`, `src/game/moves.js`) |
| Beam | drawn by a shader (no bitmap): core `#ffffff`, mid `#b46cff`, edge `#6a2cd8`, **width 1.85** (wider than the cast's 1.25), final-hit explosion in `#b46cff` + floor crater |
| Beam origin | 0.8 forward, 0.92 up: **(230, 122)** (ADR 0007). In `beamFire` the heel of the R palm sits at x 222–238, y 112–132. The beam aims at the opponent's chest (y 131–138 on a same-size opponent). |
| Hands in `beamCharge` | L (far) hand forward at about **(204, 104)** (0.59 forward, 1.06 up) = blue; R (near) hand back at about **(54, 104)** (−0.58 forward, 1.06 up) = red. Today the engine draws only the shared charge aura; the blue and red orbs at the hands are an engine follow-up (§4). |
| Engine effects | charge: strong aura (`flame` `#73b8ff`, `streak` `#e6f5ff`, `glow`) and speed lines aimed at him. Fire: lighter aura. Clash with an enemy beam: white `lightning` bolt + rings and stars mixing both beam colors. |
| Sprite rules | `beamCharge`: hands apart, palms up, empty. `beamFire`: R palm thrust, L hand back at the hip, mouth open. Blindfold on (the eyes show only on the cut-in). No orbs or beam drawn. |

### DOMAIN EXPANSION: UNLIMITED VOID (`superPose`): SUPER, 3 ki bars

| | |
|---|---|
| Data | `SUPERS.unlimitedVoid`: kind `domain`, flash 50 frames, len 150 (about 2.5 s), color `#9fd8ff`. Sure-hit unless the opponent is invulnerable: the opponent is held (`stagger`) for the whole domain, a free combo. |
| Sequence | `superPose` plays during the 50-frame super flash (with the cut-in), then the engine swaps the stage to the void (`setStage('void')`), flashes white, shakes, announces "UNLIMITED VOID" and Gojo fights normally until it ends. |
| Hand sign | R hand at about **(170, 68)** (0.33 forward, 1.35 up): middle finger crossed over the index finger, back of the hand toward the opponent. Eyes at about (150 to 162, 40). |
| Sprite rules | **The only body sprite with the eyes showing**: blindfold pushed up onto his forehead, bright blue eyes, white lashes and brows. L hand in the pocket. Calm superior half-smile. No void, stars or glow drawn. |

Look target: the world drops away into an infinite starry black void; a calm, glowing-eyed figure in
the middle of it.

### Ki charge (`charge`)

Engine: aura flames and light streaks in his colors, glow, small floor pebbles. Sprite: wide stance,
arms slightly out with the palms down, head tilted back, calm smile, hair tips and hem blown upward.

### Super dash, dash, vanish

Engine: floor ring, `lines` and `burst` in `#7ac8ff` (super dash), dust, afterimages. Sprite:
`superDash` flies angled about 30° upward, led by the R open palm, the L hand in the pocket, knees bent
as if kneeling in the air; `dash` glides with both hands in the pockets; `vanish` f1 breaks into solid
afterimage slices and stretches thinner, not taller.

### Reactions and KO

Shared effects only (hit sparks, dust, crater, ground-bounce ring, barrier flash on wall bounce, KO
explosion). His job is clear, readable pain poses with the blindfold on (ANIMATIONS.md). `down` and
`ko` lie flat with the head toward screen-left (about 224–226 px long: a knee stays slightly bent);
`launched` is an arched diagonal with the hips lowest and the elbows bent.

## 4. Gojo-specific effect art (proposed: the engine does not read it yet)

The engine currently draws Gojo's techniques with the shared effects above (the Blue vortex and the Red
orb both reuse the `orb` sheet, tinted). These optional Gojo-only sheets would make them look like the
anime. Generate them **after** the core character strips are packed. They are **not** listed in
`art/manifest.json` until an engine task adds support. Until then, note them as "proposed" in the Gojo
notes of `art/TRACKER.md`.

Rules: same as the VFX atlas (128×128 cells, transparent, hard-edged pixel art, flat magenta `#FF00FF`
background in the raw image, no text). Effects face **right**. Names follow the shared rule for
character effects (`art/vfx/README.md` "Adding a new effect"): **`gojo_<effect>`**. Codex saves every
version as **`art/vfx/raw/_proposed/gojo_<effect>_vNN.png`** (ADR 0007 versioning, a row in
`art/REVIEW.md` per version). The packer never reads `_proposed/`.

| name | frames · ms | colors | what to draw |
|---|---|---|---|
| `gojo_blueVortex` | 8 · 40, loop | full color: `#ffffff`, `#c6ecff`, `#7ab8ff`, `#4aa8ff`, `#2a6aff`, `#0a1450` (dark eye) | an imploding gravity vortex (about 100 px): a dark navy eye in the center, bright blue spiral arms curling **inward**, a thin white rim, small debris specks being pulled in; every frame rotated a little further clockwise |
| `gojo_blueGlint` | 4 · 40, tinted | white and light grey only (engine tints blue) | a tiny cross-shaped glint (about 20 px) for the fingertips on the Blue release |
| `gojo_redOrb` | 6 · 40, loop | full color: `#fff0ec`, `#ffb0a0`, `#ff4050`, `#ff2038`, `#c80e2a`, `#5a0614` | a compact, dense red sphere (about 56 px) with a white-hot core and a thin pulsing shell pushing **outward**, a few short repulsion spikes |
| `gojo_redBlast` | 6 · 35 | same reds + white | the repulsion detonation: a white flash, then a red shock ring and spikes blasting outward to the right |
| `gojo_purpleCore` | 6 · 40, loop | `#ffffff`, `#e8d0ff`, `#b46cff`, `#6a2cd8`, `#2a0a6a` | the merged purple sphere at the head of the Hollow Purple beam: swirling blue and red streaks folding into violet |
| `gojo_infinityRipple` | 5 · 40, tinted | white and light grey only (engine tints `#d8f2ff`) | a hard-edged concentric distortion ripple (3 thin rings, slightly hexagonal) where an attack stops just before touching him; usable at the palm (200, 90) during `specialDown` |
| `gojo_voidStar` | 6 · 60, loop | `#ffffff`, `#c8f4ff`, `#5a4ad0`, `#1a1640` | one drifting void particle (a star with a faint indigo trail) for the Unlimited Void stage |
| `gojo_sixEyesGlint` | 4 · 40, tinted | white only (engine tints `#9fd8ff`) | a tiny horizontal eye-gleam streak (about 24 px) for the instant the eyes open on `superPose` f0 |

Engine follow-ups to copy into `docs/TASKS.md` (owner: Claude):

1. Read per-character effect sheets (`gojo_<effect>`, raws in `art/vfx/raw/_proposed/`) and prefer
   them over the tinted `orb` for the Blue vortex and the Red orb.
2. During `beamCharge`, draw a blue orb at the L hand (about (204, 104): 0.59 forward, 1.06 up) and a
   red orb at the R hand (about (54, 104): −0.58 forward, 1.06 up), merging into purple on `beamFire`.
3. Blink: play `specialUp` (startup visible, then hide, then f4–f5 on reappearing) instead of `vanish`
   (§3).
4. Optional: `gojo_blueGlint` at the Blue fingertips (about (218, 104)) on f3, `gojo_infinityRipple` at
   the palm (200, 90) during `specialDown`, `gojo_sixEyesGlint` at the eyes on `superPose` f0.

## 5. Hitbox overrides (`art/characters/gojo/hitboxes.json`)

The packer builds hitboxes from the drawn silhouette (the part that sticks out forward on active
frames). Create `hitboxes.json` (format: `art/characters/_template/hitboxes.example.json`) only if a
Sprite Lab or in-game (`?debug`) check shows a bad box. Starting values below are **frame-local
pixels in the final 256×256 cell**, facing right, keyed by animation and 0-based frame number.
**Verify them after packing.**

| anim · frame | why | starting `hit` box `[x, y, w, h]` |
|---|---|---|
| `heavy` · 3 | rising elbow through the chin zone (ADR x 180–208, y 58–86) | `[178, 56, 32, 32]` |
| `heavy` · 4 | the elbow points up in front of his face, but must still catch a chin just in front (HIGH zone y 58–90) | `[156, 18, 36, 60]` |
| `light4` · 3, 4 | make sure the box covers shin and foot, not only the toes (ADR zone x 224–248, y 56–88) | `[196, 56, 52, 32]` |
| `special` · 3, 4, 5 | Blue does its damage through the vortex; the pointing fingers must not count as a melee hit | `[]` |
| `specialForward` · 2, 3 | Red hits with the projectile; the flick and the recoil hand are not a hit | `[]` |
| `specialUp` · 2, 3 | Blink has no hit | `[]` |
| `specialDown` · 2 | Infinity freezes attackers in code; the raised palm is not a hit | `[]` |
| `throw` · 1 | the air Red hits with the projectile | `[]` |

The `[]` rows matter only if the engine reads sprite hit boxes for these kit kinds (pull, shot,
teleport, counter); `kit.js` handles their hits itself today, so they are a safety net. The packer
writes auto boxes for every active frame of a phased animation, so blanking them keeps the data clean.

Example file:

```json
{
  "heavy": {
    "3": { "hit": [[178, 56, 32, 32]] },
    "4": { "hit": [[156, 18, 36, 60]] }
  },
  "special": {
    "3": { "hit": [] },
    "4": { "hit": [] },
    "5": { "hit": [] }
  },
  "specialForward": {
    "2": { "hit": [] },
    "3": { "hit": [] }
  },
  "specialDown": {
    "2": { "hit": [] }
  }
}
```

## 6. UI art (per character)

Prompts: [PROMPTS.md](PROMPTS.md) U1–U3 (step 11). Codex saves every candidate as
**`raw/ui_<name>_vNN.png`** (ADR 0007; the packer skips `ui_*` files in `raw/`) and adds a row to
`art/REVIEW.md`. After "approve vNN" Codex **copies** that version to `ui/<name>.png`; the packer removes
the magenta background, fits it to the exact size below and writes it to `public/characters/gojo/`
(SPEC.md "Per-character UI images"). Rejected UI versions move to `raw/_rejected/`. UI sizes did not
change in v2.

| file | size | content |
|---|---|---|
| `ui/portrait.png` | 96×96, transparent | head and shoulders, 3/4 facing right, **blindfold on**, lazy cocky smile, the white hair crown standing up above the band, the tall zipped collar |
| `ui/cutin.png` | 480×128, opaque | DBFZ super-flash eye strip, **eyes revealed** (`src/characters/gojo.js` `cutinEyes: 'six'`): the blindfold pushed up (its lower edge a black band along the top of the strip), both eyes open with glowing sky-blue Six-Eyes irises, white lashes and brows, a few white hair strands crossing the band, calm overwhelming confidence; the face fills the strip, with a flat dark navy band (`#0d0f1c`) showing only around the eyes and brows; a few tiny pale-blue glints at the edges; no speed lines (the HUD adds them). Used for both Hollow Purple and the Domain. |
| `ui/select.png` | 384×384, transparent | full body facing right, **blindfold on**, relaxed and tall: the R hand raised forward in the two-finger Blue sign with a small swirling blue vortex in front of the fingertips (drawn into this illustration), the L hand in his pocket, lazy smile, the jacket hem and hair tips stirred by the pull |
