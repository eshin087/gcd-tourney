# Killua: moves and visual effects

How each of Killua's moves should look in the game, which **engine effects** (fixed names, shared by
every character) draw on top of his sprite, and which **Killua-specific effect art** to request.
Frame-by-frame poses: [ANIMATIONS.md](ANIMATIONS.md). Effect sheet rules:
[art/vfx/EFFECTS.md](../../vfx/EFFECTS.md) and [art/SPEC.md](../../SPEC.md). Cell coordinates follow
**art spec v2** ([ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md)): 256×256 cell,
pivot `[128, 240]`, `pixelsPerUnit` 128, facing right. His kit follows **move system v2**
([ADR 0009](../../../docs/decisions/0009-move-system-v2.md)).

Gameplay numbers below are copied from `src/game/moves.js` (`MOVES`, `PROJECTILES`, `SPECIAL_MOVES`,
`SUPERS`, as of 2026-10-09, while ENG-028 is still in progress) for reference (60 fps frames). **The
code is the source of truth.** If they differ, update this file and note it in `CHANGELOG.md`. How each
kind uses its animations in detail lives in `src/game/kit.js`; where this file guesses,
it says so.

Converting between cell pixels and the engine's world offsets (from the feet, facing right):
**forward = (cell x − 128) ÷ 128, up = (240 − cell y) ÷ 128**; back the other way: cell x = 128 +
forward × 128, cell y = 240 − up × 128. The engine offsets are the same for every fighter; Killua's
smaller body (CHARACTER.md §3) reaches them with his own poses.

## 1. Move list

Keys: solo layout (move WASD, light J, heavy K, special L, jump Space, guard ShiftLeft, dash O,
SUPER H / B). "→" = toward the opponent, "←" = away (ADR 0009 "Inputs").

| input (solo keys · pad) | move | animation(s) | engine data | look |
|---|---|---|---|---|
| J ×4 · □/X ×4 | auto combo | `light1` → `light2` → `light3` → `light4` | `MOVES.light1..4` | knife-hand thrust, claw swipe, snap kick (counts as low), spinning high roundhouse (wall bounce) |
| K · △/Y | launcher | `heavy` | `MOVES.heavy` (hop 5, launch [2.4, 15.5]) | rising claw uppercut, small hop; Jump on hit chases into the air |
| J in air ×3 · K in air | air combo | `airLight1..3`, `airHeavy` | `MOVES.airLight1..3`, `airHeavy` | air knife-hand, air snap kick, air spinning heel kick (wall bounce), double-hand hammer (ground bounce) |
| L · ○/B | **NARUKAMI** (½ bar) | `special` | `SPECIAL_MOVES.narukami` (shot, `proj: 'bolt'`) | lightning bolt fired from the open palm, long stun |
| → + L | **RHYTHM ECHO** (1 bar) | `vanish` → (hidden, 3 ghosts) → `specialForward` | `SPECIAL_MOVES.rhythmEcho` (teleport behind) + `MOVES.echoStrike` | rhythm-step blur, afterimages, reappears behind the opponent, claw thrust (wall bounce) |
| ↑ + L | **THUNDERBOLT** (1 bar) | `specialUp` → `airHeavy` → `land` | `SPECIAL_MOVES.thunderbolt` (dive) | lightning leap (anti-air on the way up), double-hand slam with an area hit (ground bounce) |
| ↓ + L or ← + L | **GODSPEED** (1 bar, 8 s) | `specialDown` | `SPECIAL_MOVES.godspeed` (mode) | power-up snap; then +35 % speed, lightning blink dashes, +15 % damage, crackling aura |
| L in air | **NARUKAMI** (air, ½ bar) | `throw` | `SPECIAL_MOVES.narukamiAir` | the same bolt from the palm in mid-air |
| ↓ + L in air | **THUNDERBOLT** (air, 1 bar) | `airHeavy` → `land` | `SPECIAL_MOVES.thunderboltAir` (dive, no rise) | straight lightning slam from the air |
| K+L · △+○ | **LIGHTNING PALM** (3 bars) | `beamCharge` → `beamFire` | `ULTIMATE`, `def.beam` | super flash with the cut-in, then a blue-white lightning beam from both palms |
| H (SUPER) · L2/LT | **GODSPEED: WHIRLWIND** (3 bars) | `superPose` (flash) → lightning dash → flurry → slam | `SUPERS.whirlwind` (flurry) | cut-in pose, lightning dash; on contact the opponent is held and struck from every direction, then slammed |
| hold L · hold ○ | ki charge | `charge` | — | charging his body with electricity |
| Shift+L · L1+○ | vanish (1 bar) | `vanish` → `light4` | `VANISH`, `MOVES.vanishKick` (uses `light4`) | high-speed blur, reappear behind, spinning roundhouse |
| O / double-tap · R1 | dash / **super dash** | `dash`, `backDash`, `superDash` | `SUPER_DASH` | low dash, catlike back hop, homing flight led by a spear-hand |
| Shift · L1 | guard | `guard`, `block` | — | X-block with loose open hands |
| — | reactions | `hurtHigh`, `hurtLow`, `launched`, `spin`, `airRecover`, `down`, `getup`, `stagger`, `ko` | — | see ANIMATIONS.md |
| — | match moments | `intro`, `taunt`, `win` | — | hands in pockets (bored), tongue-out akanbe, hands behind the head with a cat grin |

## 2. Engine effects Killua uses (shared atlas)

These names are fixed (`src/art/vfxPainter.js`). Their art lives in `art/vfx/` and is generated once
for everyone (prompts in `art/vfx/PROMPTS.md`). "Tinted" effects are drawn white or grey and colored
by the engine. This table says what Killua's moves need from them, so the shared art also works for his
lightning. VFX cells stay 128×128 (ppu 56) in spec v2.

| effect | Killua uses it for | tint the engine applies | what his moves need from the art |
|---|---|---|---|
| `lightning` (6 f, tinted) | **Narukami bolt** (`PROJECTILES.bolt`: `sprite: 'lightning'`, scale 0.95, random rotation, `trail: 'bolt'`), Godspeed crackle (engine choice), beam-clash bolt | `#d8f0ff` (bolt) | a dense knot of jagged, forked bolts radiating from the center, 2 to 3 px trunks with 1 px branches; must read when rotated to any angle and when stretched along a fast flight path |
| `glow` (2 f) | bolt glow, aura glow, smash flash | `#6ab8ff` (bolt), aura colors | soft disc in 3 to 4 hard alpha steps |
| `flame`, `streak` (tinted) | ki **charge** aura, **Lightning Palm** charge aura, (likely) the Godspeed mode aura | his aura colors (§7) | flame tongues and vertical light streaks, bottom-anchored |
| `smoke` (7 f, full color) | vanish, the Rhythm Echo departure | none | grey-white puffs |
| `spark`, `star`, `lines`, `burst`, `ring` | hit sparks: light = spark + star + lines; heavy adds burst + ring; smash (`light4`, `heavy`, `echoStrike`, Thunderbolt slam, Whirlwind final hit) adds a white glow flash and two bursts | per hit | see `art/vfx/EFFECTS.md` |
| `dust`, `crater` | dashes, landings, Thunderbolt slam, ground bounce, KO, final beam hit | none | — |

Character-colored engine touches (no art needed): the 3 Rhythm Echo ghost afterimages, super-dash
bursts and lines, the move-name banners in `#bfe6ff`, and the beam shader colors (§7).

## 3. Move-by-move visual brief

### Auto combo and launcher (`light1`–`light4`, `heavy`)

- Fast, light, sharp strikes along the screen horizontal. The **active frames must put the hand, claw
  or foot where the opponent's body is** (ADR 0007 contact zones, also in CHARACTER.md §3). He is
  shorter, so his HIGH strikes reach out at his own brow height and most strikes include a small
  step-in.
- Contact zones (x, y, 256 cell): `light1` knife-hand 206-226, 64-86 · `light2` claw 214-236, 70-92 ·
  `light3` sole 222-246, 122-148 · `light4` foot 224-248, 56-88 · `heavy` f3 claw 180-208, 58-86, f4
  overhead 160-188, 22-46 (his claw tops out at about y 34).
- Timing: `light1` 5/3/11, `light2` 5/3/12, `light3` 6/4/14, `light4` 9/4/22, `heavy` 12/5/22
  (startup/active/recovery frames at 60 fps). Light hits get a small spark; `light4` and `heavy` get the
  big smash spark, screen shake and (light4) a wall bounce.
- Killua flavor: loose hands snapping into a knife-hand or a claw and straight back to loose; kicks are
  quick snaps with pointed toes from the balls of his feet; the back of the purple shirt and the navy
  collar flash past in the `light4` spin. Claws only on the frames listed in CHARACTER.md §6.

### NARUKAMI (`special` on the ground, `throw` in the air): ½ bar

| | |
|---|---|
| Data | ground `narukami`: shot, `anim: 'special'`, startup 10, active 3, recovery 16, cost 50 · air `narukamiAir`: `anim: 'throw'`, 8 / 3 / 14 |
| Projectile `bolt` | speed 36 (three times the fireball), radius 0.45, life 0.55 s, 58 damage, hitstun 38 (long stun), push 3, airPop 7; sprite `lightning` ×0.95 tinted `#d8f0ff`, glow `#6ab8ff`, a bolt trail, random rotation |
| Spawn point | 0.5 units in front, 0.9 up: **(192, 125)** (the shared projectile spawn, ADR 0007). It appears at the start of the active phase: `special` f3, `throw` f1. Draw the **open R palm** on that point (palm center within about 12 px). If the packed palm sits further away, write the measured point here and Claude moves the offset. |
| Name banner | `NARUKAMI`, color `#bfe6ff` |
| Sprite rules | R palm open, fingers spread, facing the target; no lightning drawn; normal blue eyes. On the ground the active phase lasts only 3 game frames, so `special` f6 (recoil) must still show the arm extended. |

Look target (anime): a sharp, sudden bolt of blue-white lightning that leaps from his palm across the
ring almost instantly, cracking the air.

### RHYTHM ECHO (`vanish` → `specialForward`): 1 bar

| | |
|---|---|
| Data | `rhythmEcho`: teleport, `hide` 7 frames, `to: 'behind'`, `off` 0.85 units, `ghosts` 3, follow `echoStrike` · `echoStrike`: `anim: 'specialForward'`, startup 3, active 4, recovery 18, 70 damage, reach 1.6, launch [15, 6], wall bounce, smash spark, `boxPad` [0.2, 0.3] |
| Sequence | `vanish` (his rhythm-step blur) → hidden for 7 frames while the engine draws 3 ghost afterimages → reappears 0.85 units **behind** the opponent, facing them → `specialForward`: reappear crouch, lunge, claw thrust at chest height |
| Contact zone (new) | `specialForward` f2-f3: claw tips **x 212-240, y 92-124** (MID, an opponent's chest) |
| Sprite rules | assassin eyes f0-f5; claws f0-f5; no afterimages or lightning drawn in the strip (the ghosts are engine copies of his sprite) |
| Fallback | without `specialForward` the engine plays `special` (the Narukami palm thrust) for the strike |

Look target: he sways once and is gone; three pale copies of him linger where he stood; a heartbeat
later he is behind the opponent, already lunging, and the claw goes in.

### THUNDERBOLT (`specialUp` → `airHeavy` → `land`): 1 bar

| | |
|---|---|
| Data | `thunderbolt`: dive, `rise` 14 frames (riseV 15), `hang` 5, `slamV` −34, `area` 1.7, recovery 16; rise hit 34 damage, launch [3, 11]; slam hit 104 damage, launch [5, 13], ground bounce, smash spark, shake 0.8 · `thunderboltAir`: no rise, hang 3, slam 98 damage |
| Animation use | `specialUp` for the takeoff, rise (anti-air on f2-f3) and hang (f4-f5 end in the clasped-hands pose of `airHeavy` f0); `airHeavy` for the slam; `land` on impact. Confirmed in `src/game/kit.js`. |
| Rise contact (new) | `specialUp` f2-f3: R claw at about x 172-206, y 42-70 plus the rising R knee at about x 160-180, y 120-140 |
| Slam contact | `airHeavy` f2-f3 clasped hands x 180-218, y 160-206; the engine adds an area hit (1.7 units) around the landing point |
| Sprite rules | no lightning drawn; the slam's lightning strike and floor crater are engine VFX |
| Fallback | without `specialUp` the engine plays `special` for the rise |

Look target: a blue-white streak shoots up and over the opponent, hangs for an instant, and comes
down like a lightning strike, cracking the floor.

### GODSPEED (`specialDown`): 1 bar, 8 s mode

| | |
|---|---|
| Data | `godspeed`: mode, `anim: 'specialDown'`, startup 18, recovery 6, `len` 480 frames (8 s), speed ×1.35, damage ×1.15, `blinkDash` |
| Animation use | `specialDown` f0-f1 coil (startup), f2 activation snap, f3 settle (recovery). During the 8 s every animation plays normally; the engine adds the crackling aura and replaces dashes with lightning blinks. |
| Sprite rules | assassin eyes and claws on every frame, hair bristling on f2-f3; **no lightning, no aura drawn** (the mode lasts 8 s on top of every animation, so it can only be an engine effect) |
| Fallback | without `specialDown` the engine plays `charge` |

Look target: his hair stands up with static, a hard blue-white flash wraps his whole body, and from
then on he moves in jagged lightning blinks with little arcs crawling over his limbs.

### LIGHTNING PALM (`beamCharge` → `beamFire`): ultimate, 3 bars

> **Superseded by ADR 0017:** the ultimate is now **Godspeed: Whirlwind** (a reflex mode) and the SUPER below is
> renamed **Godspeed: Speed of Lightning**; see [KIT.md](KIT.md). These sections are kept as the record.

| | |
|---|---|
| Sequence | super flash (42 f world freeze, dimmed screen) with the **cut-in** (`ui/cutin.png`, assassin eyes) → `beamCharge` for 46 f (14 f when countering an enemy beam) → `beamFire` while the beam lasts (84 f) |
| Beam | drawn by a shader (no bitmap): colors from `def.beam` (proposed in §7), width 1.25 units, extends at speed 34 up to 26 units, 12 damage every 5 f plus a 130 final hit (launch [17, 10]) |
| Beam origin | 0.8 units in front, 0.92 up: **(230, 122)** (ADR 0007). In `beamFire` both palms sit at x 222-238, y 112-132 (his own shoulder height, reached with a deep lunge). The beam aims at the opponent's chest (y 131-138 on a standard opponent). |
| Engine effects | charge: strong aura (`flame`, `streak`, `glow`) and speed lines aimed at him. Fire: lighter aura. Clash: white `lightning` bolt plus rings and stars mixing both beam colors. Final hit: explosion in the beam's mid color plus a floor crater. |
| Sprite rules | `beamCharge`: both hands at the R hip, palms facing each other a fist-width apart, claws out. `beamFire`: both palms thrust forward, heels of the hands together. Assassin eyes. No lightning or beam drawn. |

### GODSPEED: WHIRLWIND (SUPER button): 3 bars

| | |
|---|---|
| Data | `whirlwind`: flurry, cost 300, `flash` 34, `dash` 14, `range` 6.5, `hits` 8 every 7 frames at 22 damage, final hit 130 |
| Sequence | super flash (34 f) with the cut-in and `superPose` → a lightning dash toward the opponent (up to 6.5 units) → on contact the opponent is held and struck from every direction (8 hits) → a final slam. `src/game/kit.js` plays `superPose` during the flash, `dash` for the dash, alternates the active frames of `light2` / `light4` for the 8 hits (with afterimages), then `airHeavy` for the slam from above and `land`. |
| Sprite rules | `superPose` holds the claw in front of his face with assassin eyes and bristling hair; the normals it reuses must read clearly when the engine flips and repositions him around the opponent. No lightning drawn. |
| Fallback | without `superPose` the flash shows `taunt` (the tongue-out taunt), so generate A42. |

Look target: a flash, the eye cut-in, then he becomes a zig-zag of lightning around the opponent,
eight strikes from eight directions, and a last slam.

### Ki charge (`charge`)

Engine: aura flames and light streaks in his colors, glow, small floor pebbles. Sprite: wide low stance,
fingers spread rigid with the claws out, teeth clenched, hair bristling, normal blue eyes.

### Super dash, dash, vanish

Engine: floor ring, `lines` and `burst` in his character color (super dash), dust, afterimages. Sprite:
`superDash` flies angled about 25° upward, led by an R spear-hand with the claws out, knees bent as if
kneeling in the air; `vanish` f1 breaks into solid afterimage slices.

### Reactions and KO

Shared effects only (hit sparks, dust, crater, ground-bounce ring, barrier flash on wall bounce, KO
explosion). His job is clear, readable pain poses (ANIMATIONS.md). `down` and `ko` lie flat with the
head toward screen-left; `launched` is an arched diagonal with the hips lowest. He is smaller and
lighter than the others, so his reactions are already slightly smaller on screen; do not exaggerate
them in the art.

## 4. Killua-specific effect art (proposed: the engine does not read it yet)

The engine currently uses the shared effects above for everyone. These optional Killua-only sheets would
make his lightning look like the anime. Generate them **after** the core character strips are packed.
They are **not** listed in `art/manifest.json` until an engine task adds support (ENG-014 covers
per-character effect sheets). Until then, note them as "proposed" in the Killua notes of
`art/TRACKER.md`.

Rules: same as the VFX atlas (128×128 cells, transparent, hard-edged pixel art, flat magenta `#FF00FF`
background in the raw image, no text). Effects face **right**. Names follow the shared rule for
character effects (`art/vfx/README.md` "Adding a new effect"): **`killua_<effect>`**. Codex saves every
version as **`art/vfx/raw/_proposed/killua_<effect>_vNN.png`** (ADR 0007 versioning, a row in
`art/REVIEW.md` per version). The packer never reads `_proposed/`.

| name | frames · ms | colors | what to draw |
|---|---|---|---|
| `killua_narukamiBolt` | 6 · 35, loop | full color: `#ffffff` core, `#e8f8ff`, `#bfe6ff`, `#7fcfff`, `#3f8cff` outer | a horizontal jagged lightning bolt flying right: a bright white-hot head on the right, a forked zig-zag body trailing left with 1 px side branches; a new zig-zag every frame |
| `killua_thunderStrike` | 6 · 40 | same blues | the Thunderbolt slam: a thick vertical lightning strike from the top of the cell down to the floor, splitting into ground arcs; bottom-anchored on y 120 |
| `killua_godspeedCrackle` | 6 · 40, loop, tinted | white and light grey only | small static arcs crawling over a body-sized area: 6 to 10 short zig-zag arcs, 1 to 2 px thick, different every frame (the engine scatters several over his body during the 8 s mode) |
| `killua_blinkTrail` | 5 · 35, tinted | white and light grey only | a lightning blink-dash trail: a long horizontal zig-zag streak that thins and breaks up from right to left |
| `killua_palmCharge` | 6 · 40, loop | same blues | a small crackling ball of lightning (about 40 px) between two palms (the hands are NOT drawn), arcs jumping up and down |
| `killua_assassinGlint` | 4 · 40, tinted | white only | a tiny horizontal eye-gleam streak, 24 px wide, for the instant the assassin eyes switch on |

Engine follow-ups to copy into `docs/TASKS.md` (owner: Claude; ENG-014 covers 1):

1. Read per-character effect sheets (`killua_<effect>`, raws in `art/vfx/raw/_proposed/`) and prefer
   them over the shared ones for his moves (bolt, slam, Godspeed crackle, blink trail).
2. During `beamCharge`, show lightning between the palms at about cell **(96, 151)**: 0.25 back, 0.70
   up.
3. During the Godspeed mode, scatter `killua_godspeedCrackle` (or the tinted `lightning`) over the
   hair and hands, about cell (128, 60) and the hands.
4. Optional: play `killua_assassinGlint` at the eye on the first frame of `specialForward`,
   `specialDown` and `superPose`.

## 5. Hitbox overrides (`art/characters/killua/hitboxes.json`)

The packer builds hitboxes from the drawn silhouette (the part that sticks out forward on active
frames). Most moves need nothing. Create `hitboxes.json` (format:
`art/characters/_template/hitboxes.example.json`) only if a Sprite Lab or in-game (`?debug`) check shows
a bad box. Starting values below are **frame-local pixels in the final 256×256 cell**, facing right,
keyed by animation and 0-based frame number. **Verify them after packing.**

| anim · frame | why | starting `hit` box `[x, y, w, h]` |
|---|---|---|
| `heavy` · 4 | the claw is above his head, but the uppercut must still catch a chin just in front (HIGH zone y 58-90) | `[158, 30, 32, 60]` |
| `light4` · 3, 4 | cover shin and foot, not only the toes (ADR zone x 224-248, y 56-88) | `[196, 56, 52, 32]` |
| `specialForward` · 2, 3 | the claw thrust, not the sleeve (zone x 212-240, y 92-124) | `[208, 92, 34, 32]` |
| `specialUp` · 2, 3 | anti-air claw and knee, only if `kit.js` uses sprite boxes for the rise hit | `[160, 40, 48, 100]` |
| `special` · 3, 4, 5 | Narukami is a projectile, so the melee check never runs; keep the auto boxes (they double as the strike box when `specialForward` falls back to `special`) | none |

Example file:

```json
{
  "heavy": {
    "4": { "hit": [[158, 30, 32, 60]] }
  },
  "specialForward": {
    "2": { "hit": [[208, 92, 34, 32]] },
    "3": { "hit": [[208, 92, 34, 32]] }
  }
}
```

## 6. UI art (per character)

Prompts: [PROMPTS.md](PROMPTS.md) U1–U3 (step 11). Codex saves every candidate as
**`raw/ui_<name>_vNN.png`** (ADR 0007; the packer skips `ui_*` files in `raw/`) and adds a row to
`art/REVIEW.md`. After "approve vNN" Codex **copies** that version to `ui/<name>.png`; the packer removes
the magenta background, fits it to the exact size below and writes it to `public/characters/killua/`
(SPEC.md "Per-character UI images"). Rejected UI versions move to `raw/_rejected/`. UI sizes did not
change in v2. Lightning **is** allowed in UI art (not in sprites).

| file | size | content |
|---|---|---|
| `ui/portrait.png` | 96×96, transparent | head and shoulders, 3/4 facing right, cold half-lidded stare with **normal blue eyes** and a faint cocky smirk, fluffy silver-white hair, the navy rolled collar and the purple shirt shoulders |
| `ui/cutin.png` | 480×128, opaque | DBFZ super-flash eye strip: both eyes as **assassin eyes** (dark irises, pinpoint pupils, no catch-light), brows down, silver-white tufts crossing the strip, a few tiny blue-white lightning crackles at the edges; the face fills the strip, a flat dark navy band (`#141a32`) only around the eyes and brows; no speed lines (the HUD adds them). Used for both the Lightning Palm and the Whirlwind flash. |
| `ui/select.png` | 384×384, transparent | full body facing right in a low Godspeed crouch: R claw forward low, L hand back, hair bristling, assassin eyes, blue-white lightning crackling around his body and hands (drawn into this illustration) |

## 7. Engine fields (as implemented in `src/characters/killua.js`; the code wins)

| field | value | why |
|---|---|---|
| `id` / `name` | `killua` / `KILLUA` | folder id |
| `subtitle` | `Godspeed Assassin` | |
| `look` | "fluffy spiky silver-white hair, sharp cat-like blue eyes, loose long-sleeved purple shirt with a dark navy rolled collar over a white undershirt (white cuffs and hem), baggy dark navy shorts above the knee, purple-and-white high-top sneakers" | Sprite Lab prompt builder |
| `color` | `#8fd4ff` (pale electric blue; Sasuke is the deeper `#4a7bff`) | HUD, ghosts, vanish ring, super-dash bursts |
| `aura` / `auraCore` | `[0.55, 0.82, 1.0]` / `[0.92, 0.97, 1.0]` | whiter and more cyan than Sasuke's aura |
| `beam` | `{ core: '#ffffff', mid: '#9fdcff', edge: '#4a8cff', name: 'LIGHTNING PALM' }` | blue-white lightning |
| `stats` | `{ speed: 6.8, power: 0.92, defense: 0.9 }`: fastest of the cast, lower power and defense | ADR 0010 reach check |
| `kit` | `{ specials: { neutral: 'narukami', forward: 'rhythmEcho', up: 'thunderbolt', down: 'godspeed', air: 'narukamiAir', airDown: 'thunderboltAir' }, super: 'whirlwind' }` (back falls back to down = Godspeed) | ADR 0009 table |
| `model.palette` | simplified ramps for the chibi placeholder bake | the art uses CHARACTER.md §7 |
| reach / lunge | checked on the placeholder ([ADR 0010](../../../docs/decisions/0010-per-character-body-scale.md)); re-check with the packed boxes (ENG-035) | his limbs are about 9 % shorter (CHARACTER.md §3) |
