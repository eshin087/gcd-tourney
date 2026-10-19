# Combat design

The combat model is DBFZ-inspired (see [ADR 0004](decisions/0004-dbfz-combat-model.md)): easy auto
combos, launchers and air combos, super dash, vanish, signature specials, a 3-bar ultimate with a beam
clash, and spectacular KOs. On top of it sit Smash-style directional normals and Smash air
([ADR 0042](decisions/0042-smash-directional-normals.md)): tilts, smash attacks and aerials picked by the stick, linked
rather than cancelled, with short hops, a double jump and fast falls. Every gameplay number lives in `src/game/moves.js` and
`src/game/constants.js`. The state logic lives in `src/game/fighter.js` and `src/game/game.js`.
**If you change a number there, update the tables here.**

## Design pillars

1. **Feel first.** Hitstop on both fighters, screen shake toward the hit, sparks at the contact point, slow-mo
   on big moments, super flashes that freeze time. Every hit should *land* visually.
2. **Readable at a glance.** Strikes travel across the screen the way the sprite is drawn (2.5D lanes), and
   a hit only registers where a fist, foot or palm touches the body.
3. **Accessible depth.** Mashing Light gives a real combo. Routes (launcher, chase, air combo, spike,
   super dash, vanish) reward learning.
4. **Same rules for everyone.** The CPU presses buttons on a `Pad` exactly like a human, so it can't cheat.
5. **Data over code.** New characters reuse the shared moveset and swap data (stats, special, projectile,
   beam, art).

## Ruleset

| Constant | Value | Where |
|---|---|---|
| Simulation rate | 60 Hz fixed step, render interpolation | `FPS`, `DT` |
| HP | 1000 | `MAX_HP` |
| Ki | 0 to 300 (3 bars of 100), each round starts at 100 | `MAX_KI`, `KI_BAR` |
| Round | 99 s, best of 3 (first to 2) | `ROUND_TIME`, `ROUNDS_TO_WIN` |
| Ring | x, z in -9..9, fighters clamped to ±8.55 (ki barrier) | `RING_HALF`, `ARENA_LIMIT` |
| Gravity | 42 units/s² | `GRAVITY` |

Per-character stats (`stats` in `src/characters/<id>.js`): `speed` (run speed in units/s), `power`
(damage multiplier) and `defense` (damage divisor).

| Character | speed | power | defense | special | projectile | ultimate |
|---|---|---|---|---|---|---|
| Naruto | 5.9 | 1.0 | 1.0 | Rasengan | Shuriken ×3 | Four-Tails: Tailed Beast Ball (beam) |
| Sasuke | 6.2 | 1.05 | 0.95 | Chidori | Fireball | Amaterasu |

## Controls (default bindings, rebindable)

| Action | VS CPU keyboard | Gamepad |
|---|---|---|
| Move | WASD / Arrows | left stick / D-pad |
| Light (+ direction: tilts; in the air: aerials) | J | □ / X |
| Heavy (+ direction: smash attacks, hold to charge; in the air: down air) | K | △ / Y |
| Special (tap, + direction) / charge (hold) | L | ○ / B |
| Jump (tap: short hop, hold: full hop; again in the air: double jump) | Space | ✕ / A |
| Short hop aerial | Jump + Light / Heavy together | ✕ + □ / △ |
| Fast fall | ↓ at or past the top of a jump | stick ↓ |
| Dash attack | Light during a dash, stick still held | □ in a dash |
| C-stick: smash attack that way (in the air: that aerial) | - | right stick |
| Guard | Shift (or hold back: blocks on the ground) | L1 / LB (or hold the stick back) |
| Dash (+direction) / super dash (neutral), or double-tap a direction | O | R1 / RB (also R2 / RT) |
| Ultimate | Heavy + Special | △ + ○ |
| Vanish | Guard + Special | L1 + ○ |
| Super (second super) | H or B | L2 / LT |
| Parry | tap Guard just before a hit lands | tap L1 |
| Spot dodge | Guard + push ↓ | L1 + stick ↓ |
| Air dodge (+direction) | Guard in the air | L1 in the air |
| Wavedash | Jump, then Guard + direction right away | ✕ then L1 + stick |
| Throw (close) / throw break (when grabbed) | Light + Heavy | □ + △ |
| Tech / tech roll (ADR 0022) | hold Guard while hit (+ direction) | hold L1 |
| Timed tech (ADR 0028) | tap Guard just before hitting the floor / barrier (+ ← / → roll, ↑ wall jump) | tap L1 |
| Burst (2 bars, once per round) | Guard + Special while hit | L1 + ○ |

Adding SUPER took L2/LT from guard. Bindings moved to a new localStorage key (`gcd.bindings.v2`), so saved
custom bindings reset once.

2P keyboard bindings are in README.md. Bindings are rebindable in the controls panel and saved to localStorage.

## Moveset and frame data

Frames are at 60 fps. **Startup** is the frames before the hitbox is live, **active** is the frames the
hitbox can connect, and **recovery** is the frames after. Animation frames are spread across these
phases using `phases` in anims.json (see `SpriteActor.setPhase`). Damage is before scaling (HP 1000).

**Attack alts** ([ADR 0031](decisions/0031-attack-alt-animations.md)): each normal (light1-4, heavy, airLight1-3,
airHeavy, and the kit moves that borrow those strips, e.g. `vanishKick` = `light4`) and both hit reactions may have an
`<anim>Alt` strip. The fighter alternates base and alt per use in a fixed Thue-Morse pattern (no randomness; never the
same version three times in a row; `src/game/animAlts.js`), only when its sheet has that alt. The row's numbers never
change: an alt plays the same move data on the same phases, and the packer gives every alt frame its base frame's hit
and hurt boxes, so the alternation is visual only (amended 2026-10-14). The alt is still drawn to land where the base's
hit lands, so the hit spark sits on the fist or foot (the packer warns past 24 px). The throw keeps its `light1` / `light4` poses.

| Move | Input | Startup | Active | Recovery | Total | Dmg | Reach / width | Hitstop | On hit | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| light1 | Light | 5 | 3 | 11 | 19 | 28 | 1.3 / 0.95 | 7 | stun 22, push 2.2 | jab; chains to light2 from f7; lunge 4.5 |
| light2 | Light (chain) | 5 | 3 | 12 | 20 | 30 | 1.35 / 0.95 | 7 | stun 22, push 2.4 | chains to light3 from f7 |
| light3 | Light (chain) | 6 | 4 | 14 | 24 | 36 | 1.55 / 1.0 | 8 | stun 24, push 2.8 | front kick, `low` (hurtLow); chains to light4 from f9 |
| light4 | Light (chain) | 9 | 4 | 22 | 35 | 58 | 1.65 / 1.05 | 13 | launch [14, 6] | roundhouse smash, **wall bounce** |
| heavy | Heavy | 12 | 5 | 22 | 39 | 64 | 1.4 / 1.05 | 12 | launch [2.4, 15.5] | **launcher**, hop at f5, yTol 1.7 |
| airLight1 | Light (air) | 4 | 4 | 9 | 17 | 24 | 1.4 / 1.0 | 7 | air pop 6.2 | chains to airLight2 from f7 |
| airLight2 | Light (chain) | 4 | 4 | 10 | 18 | 26 | 1.45 / 1.0 | 7 | air pop 6.4 | chains to airLight3 from f8 |
| airLight3 | Light (chain) | 6 | 4 | 14 | 24 | 40 | 1.55 / 1.05 | 11 | launch [12, 4.5] | knock-away, **wall bounce** |
| airHeavy | Heavy (air) | 9 | 6 | 16 | 31 | 62 | 1.45 / 1.15 | 15 | launch [3, -22] | double-axe **spike**, **ground bounce** (budget: 2 per combo), yTol 2.4, `boxPad` [0.5, 0.45] |
| fTilt | → + Light | 7 | 3 | 15 | 25 | 46 | 1.6 / 1.0 | 9 | stun 22, push 4 | forward tilt: +4 on hit, -5 on block; lunge 3 |
| uTilt | ↑ + Light | 6 | 6 | 14 | 26 | 38 | 1.15 / 1.0 | 8 | launch [0.4, 8.5], **feet** | up tilt, anti-air: pops them over the head; juggles into itself or an up air; yTol 2.2, lunge 2.5 |
| dTilt | ↓ + Light | 5 | 3 | 12 | 20 | 30 | 1.5 / 0.95 | 7 | stun 26, push 1.6 | down tilt, `low`: +11 on hit (links into a jab or a tilt), +1 on block |
| dashAttack | Light in a dash (stick held) | 8 | 5 | 25 | 38 | 50 | 1.5 / 1.05 | 10 | launch [4, 8.5], **feet** | lunge 10; -6 on block |
| fSmash | → + Heavy | 15 | 4 | 30 | 49 | 90 | 1.7 / 1.05 | 14 | launch [17, 7] | **charge** at f6 up to 60 f (×1.4 dmg); wall bounce; -10 on block |
| uSmash | ↑ + Heavy | 11 | 6 | 26 | 43 | 80 | 1.2 / 1.05 | 13 | launch [2, 17] | **charge** at f5; yTol 2.4, lunge 3; -8 on block |
| dSmash | ↓ + Heavy | 9 | 5 | 28 | 42 | 76 | 1.5 / 1.0 | 13 | launch [12, 4.5] | **charge** at f4; hits in front **and behind** (`both`), `low`; -9 on block |
| fair | air → + Light | 6 | 4 | 14 | 24 | 42 | 1.5 / 1.0 | 9 | air pop 6.5, stun 22, **feet** | landing lag 9 (5 from f20) |
| bair | air ← + Light | 7 | 3 | 15 | 25 | 56 | 1.5 / 1.05 | 12 | launch [13, 6] | hits **behind** (`back`), wall bounce; landing lag 11 (5 from f21) |
| uair | air ↑ + Light | 5 | 5 | 12 | 22 | 34 | 1.1 / 1.0 | 8 | launch [0.4, 9.5], **feet** | juggles upward; yTol 2.4; landing lag 7 (5 from f18) |
| throw | Special (air) | 8 | 3 | 14 | 25 | (projectile) | | | | costs 50 ki; spawns the projectile at f8 |
| vanishKick | after Vanish | 2 | 5 | 20 | 27 | 75 | 1.7 / 1.15 | 16 | launch [17, 6.5] | uses the `light4` anim, wall bounce |
| super dash | Dash (neutral) | | contact | | ≤ 42 | 38 | contact < 1.0 | 9 | stun 26, air pop 7 | homing at 18 u/s, projectile-invulnerable |
| Rasengan | tap Special | 24 (14 cancelled) | 22 | 20 | 66 | 150 | 1.3 / 1.05 | 18 | launch [16, 9] | rush 14 u/s, 1 bar, wall bounce |
| Chidori | tap Special | 28 (16 cancelled) | 18 | 20 | 66 | 165 | 1.3 / 1.05 | 20 | launch [14, 11] | rush 18 u/s, 1 bar, wall bounce |
| Throw | Light + Heavy (close) | 5 | 3 | 26 (whiff) | 34 | 80 | 1.05 / 0.6 lane | 10 | launch [12, 8.5] | grab, 18 f hold (breakable in 12), unblockable toss, wall bounce |
| Ultimate beam | Heavy + Special | windup 46 (counter 14) | 84 | | | 12 per 5 f + 130 final | width 1.25, ≤ 26 long | | launch [17, 10] | 3 bars, invulnerable through windup |

Projectiles (`PROJECTILES`):

| Projectile | Count | Speed | Radius | Dmg | On hit | Life |
|---|---|---|---|---|---|---|
| shuriken (Naruto) | 3, fan 0.2 rad | 22 | 0.35 | 22 each | stun 16, pop 4 | 1.2 s |
| fireball (Sasuke) | 1 | 12 | 0.85 | 80 | launch [8, 7], explodes on floor | 1.6 s |

Field glossary for `MOVES`: `reach`/`width` are the fallback hit range when a sheet has no boxes. `yTol` is
the vertical tolerance for that fallback. `lunge` is the forward step speed during startup and active.
`hop` gives vertical speed at frame 5. `next`/`cancel` define the chain target and the first frame it's
allowed. `light`/`low`/`big`/`launcher`/`air` are behavior flags. ADR 0042 adds `btn` (the button: a throw
still reads from it), `chain` (a jab-string move: the only normals that cancel into another normal), `landLag` /
`autoCancel` (an aerial's landing lag, and the frame from which it lands like a plain jump), `back` / `both` (hits
behind / both sides), `feet` (a light pop: they land on their feet) and `charge` (a smash attack's hold). `spark` is the impact tier
(`light | heavy | smash`), and `shake` is the camera trauma.

## Systems

### Auto combo and chains
- `Light ×4` (the **jab string**, stick neutral): light1 → light2 → light3 → light4. Chains happen on **whiff or hit**
  once the move reaches its `cancel` frame, with a 10-frame input buffer. Only the jab strings (`chain`) chain into
  other normals; the directional normals link (below).
- On hit, a light can cancel into **heavy** (the launcher), so `Light ×3 → Heavy` is the core route.
- On hit, a ground normal can cancel into the **signature special** if Special was pressed and there's 1 bar.
  A rush special cancelled this way starts at its `cancelStartup` (Rasengan 14, Chidori 16, Rasenshuriken 18;
  raw 24 / 28 / 30), so light ×3 → special is a true combo while a raw one stays slow (ADR 0015).

### Directional normals and Smash air (ADR 0042)
- **The stick picks the normal** (`NORMALS`, `Fighter.normalFor`), read as the attack starts (a stick neutral by then
  falls back to the one held at the press). Ground Light: neutral jab, ←/→ forward tilt, ↑ up tilt, ↓ down tilt. Ground
  Heavy: neutral launcher, ←/→ forward smash, ↑ up smash, ↓ down smash. Air Light: neutral the air string (neutral air),
  forward air or back air along the facing, ↑ up air, ↓ the spike (down air); air Heavy is the spike. ↑ / ↓ also walk in
  depth, so a Light while walking up or down the lane is a tilt (as for specials).
- **Links.** Tilts, smash attacks, the dash attack and the forward / back / up airs never cancel into another normal:
  the next move has to land inside the hit stun (down tilt → jab, up tilt → up tilt, up tilt → short-hop up air). On hit
  they still cancel into a special, vanish, super, ultimate, and a launching hit into the super dash.
- **Smash attacks** hold on their charge frame while Heavy stays down (up to 60 frames, up to ×1.4 damage, the sprite
  glows and trembles); the knockback stays the move's. All startup, so it can be hit out of.
- **Jumps.** Let go of Jump before the 4-frame squat ends: short hop (9.6 u/s, about 1.2 units high); held: full hop
  (13.6, about 2.3). Jump + Light / Heavy within 2 frames: short hop with that aerial out as it leaves the floor. One
  double jump (12.6), back on landing or when hit. A fresh ↓ at or past the top fast-falls (15 u/s).
- **Smash air** (not juggling): the facing holds through the jump (a back air hits behind; jumping over someone is a
  cross-up), aerials fall with normal gravity and air control, a jump can carry several aerials, each aerial has its own
  landing lag. **The DBFZ juggle** (an air attack started beside an opponent reeling in the air, within 3.2 units) floats
  level with them, turns to them, rides the air string along and keeps one air string per jump, as before. In a DBFZ
  juggle (they reel from a launch, a spike, a bounce, a super dash or the air string, not from a light pop) **Light is
  the air string whatever the stick says** and ↓ + Light the spike (`Fighter.dbfzJuggle`, ENG-113): the stick held toward
  them to follow the launcher no longer swaps the string for a single forward air, and an up air there can't land them
  on their feet and end the combo. The C-stick still picks its aerial; after a light pop (up tilt, up / forward air) the
  directional aerials are back.
- **Light pops land on the feet** (`feet`: up tilt, dash attack, forward and up air): a short landing (4 frames), no
  knockdown, no floor bounce.
- **Stand-in strips.** Until a fighter's sheet has its own strip, a move shows the strip `FALLBACK` names (forward
  tilt `light2`, up tilt / up smash / up air `heavy`, down tilt / down smash `light3`, dash attack / forward smash
  `light4`, forward air `airLight2`) and uses its hit boxes; the back air shows `airLight3` mirrored, boxes too.
- **C-stick** (gamepad right stick, Smash's default): a flick past half way is an attack that way, read like a buffered
  button (`cUp` / `cDown` / `cLeft` / `cRight` on the Pad, its dominant axis picks the way). On the ground a smash
  attack (never charged: Heavy isn't held), during a dash too; in the air the aerial that way (← behind the facing is a
  back air) while the left stick keeps the drift; flicked during the jump squat it comes out as the jump leaves the
  floor; out of a super dash it is that attack. Holding it does nothing more; flicking another way is a new press. Not
  rebindable, no keyboard binding.
- **CPUs** (ENG-111): every brain aims its stick and plays the short and full hops (CPU AI, "Directional normals"). A
  brain that doesn't set `aimsNormals` would read as a neutral stick at the press and a held jump; none is left, and a
  CPU slot without its brain (a replayed CPU match) aims too.

### Launcher and chase
- `heavy` hops and launches the victim upward ([2.4, 15.5]).
- After it connects, **Jump or Dash** (buffered 10 f) triggers `startChase()`: a super jump toward the
  victim's predicted position, with reduced gravity for 16 frames and ghost trails.

### Air combo
- In the air: airLight1 → airLight2 → airLight3 (knock-away, wall bounce), or cancel any air light into
  **airHeavy** on hit.
- Air attacks hover. Gravity is 0.35× and upward speed is damped, so the attacker stays level with the victim.
- **Juggle tracking** (ADR 0014): while riding a connected air hit, and during the next air move's startup, the
  attacker closes to `JUGGLE_GAP` (0.76, just outside `Game.separate`'s 0.72). A launched pose leans back, so its
  hurtbox starts behind the victim's feet; without this the air string dropped on the art packs.

### Spike and ground bounce
- `airHeavy` spikes downward ([3, -22]). A spiked victim that hits the floor **ground-bounces** back up
  (vel.y 11). A grounded victim of a spike gets popped up instead.
- Hard landings without a pending ground bounce do one small floor bounce (impact > 8 → 32% rebound).

### Wall bounce (ring ki barrier)
- `wallBounce` moves (light4, airLight3, vanishKick, specials) mark the victim. When a launched victim hits the
  barrier at ±8.55 faster than 5 u/s, it bounces back (55% speed, vel.y ≥ 7) with a barrier flash effect. A victim
  bounced back can be met and bounced into the same wall again: the **handball**.

### Bounce budget (ADR 0026)
All numbers in `JUGGLE` (`src/game/moves.js`). Each combo has at most **3 wall bounces** and **2 ground bounces**; a
`wallBounce` / `groundBounce` hit only arms the victim while their combo has bounces of that kind left (`wbCount`,
`gbCount` on the fighter, reset on a fresh combo, an air tech, a tech roll or a burst). Each bounce's air stun is flat
(no hitstun decay) and shorter every time: wall 32, 28, 22 frames; ground 30, 24. The bounce hooks get the count
(`Game.onWallBounce(f, axis, sign, n)`, `onGroundBounce(f, impact, n)`), so the n-th bounce gets its own callout (WALL
BOUNCE!, WALL BOUNCE ×2!, HANDBALL!; GROUND BOUNCE!). A wall bounce gives no super dash back. Before ADR 0026 the docs
said "once per combo" while the code re-armed on every bounce hit (unlimited).

### Super dash
- Dash with **no direction** (or Dash in the air): a homing flight at 18 u/s toward the opponent for up to 42
  frames. It hits on contact (38 dmg) and is **projectile-invulnerable**.
- **One per airtime.** `airDashes` resets only on landing.
- It can cancel into light/heavy (or airLight1/airHeavy) after frame 6. A move with `launch` or `wallBounce` can
  cancel into super dash after its active frames to chase the victim.

### Dash and jump
- Dash: 15 frames at 16 u/s (back dash 12) with decay, invulnerable for the first 8 frames. From frame 4 it can
  cancel into light (lunge 9), heavy, jump or ultimate. Double-tapping a direction also dashes.
- Jump: 4-frame jump squat, then vel.y 13.6 with air control capped at the character's speed.

### Vanish
- Guard + Special, **1 bar** (also works out of block as a guard cancel, and on hit as a combo extender).
- The fighter hides for 9 frames (invulnerable), reappears 1.2 units behind the opponent at their height,
  then does an automatic `vanishKick` (75 dmg, wall bounce). A 5-frame world freeze sells the teleport.

### Specials and kits (ADR 0009, baseline ADR 0011)
Every fighter has a **kit** (`kit` in `src/characters/<id>.js`): input slots mapped to special ids in
`SPECIAL_MOVES` (`src/game/moves.js`), a second super and optionally a non-beam ultimate. The behavior of each
*kind* lives in `src/game/kit.js`. **Every fighter fills the same slots within the same budgets**: see the slot
and budget table in [ADR 0011](decisions/0011-kit-baseline-and-balance.md), which also lists the whole cast.

- **Slots.** Tap Special = `neutral`. Hold a direction: → `forward`, ← `back`, ↑ `up`, ↓ `down`. In the
  air: `air`, or `airDown` with ↓. Forward/back count **toward the opponent**, not the current facing
  (walking back turns the sprite). The stick is read when Special is released, and falls back to the stick
  at the press if it's neutral by then, so a quick tap of direction + button works. A missing slot falls
  back: forward/up/down → neutral, back → down → neutral, airDown → air. A fighter without a `kit` (only a
  safety net now) gets `neutral` = `def.special` and `air` = `def.projectile + 'Air'`.
- **Kinds.**

| kind | does | examples |
|---|---|---|
| `rush` | the classic 1-bar rush below; optional `selfDmg` (paid on use), `vortex` (a grind `Vortex` spawned where it connects; `dome`: its look as one HD effect), `blastFx` (its own hit blast instead of the generic explosion, ADR 0044), `trench` (a ground style torn along the floor where the drawn hand drags through the run) and `hitPose` (contact jumps to the drawn strike: that frame's place in the active phase; ADR 0047), `coil` (an HD effect winds round the victim through the hit stop, its frames following the stop, then its `burst`; ADR 0050) | Rasengan, Chidori, Rasenshuriken, Dragon Fist |
| `shot` | a projectile from a `shot`/`throw` move; feet planted. The projectile may name its look: `lance` (an HD blade laid from the hand along the shot), `orient` (its sprite turned along its flight), `burstFx` (its own hit blast; ADR 0047), `muzzle` (a flash at the hand as it leaves), `halo` (its glow's opacity, 0 none); `every` fires a volley one shot per `every` frames through the active phase instead of all at once (ADR 0050) | Narukami, Reversal: Red, shuriken, Chidori Spear, Great Fireball, Ki Blast Volley |
| `teleport` | optional `anim` wind-up for `startup` frames, then a puff and hide for `hide` frames, reappear `behind` or `above` (with afterimages), optional `recovery` frames of the same animation and an optional `follow` strike. `shimmer`: no puff or afterimage, its own effect closing on him as he goes and played backward where he reappears (ADR 0050) | Rhythm Echo, Blink, Instant Transmission |
| `pull` | spawns a `Vortex` `dist` ahead: drags the opponent in, `tickHit` every `tick` frames, then `pop` | Lapse: Blue |
| `dive` | `rise` toward the opponent (anti-air `riseHit`), `hang` (on `specialUp`'s last frames), then slam (homes in at up to ~45°); landing hits an `area`. `clones` (that many shadow clones poof out and kick up beside him, ADR 0044; `riseCallout` when the rise hits), `shadow` (when the rising kick connects he blinks behind them as they rise, lands `hits` in the air, flips over them and carries them down into the floor with the slam; ADR 0047; with no `hits` and `below` < 0 he blinks above them, holds `hangPose` and drives them down: Goku's afterimage chase, ADR 0050), `landFx: 'thunder' \| 'dust'` | Thunderbolt, Uzumaki Barrage, Lion's Barrage, Rising Kick |
| `counter` | `len` frames where any hit is absorbed (a projectile just stops). `onCounter`: `freeze` (melee attacker `held` for `stagger`), `strike` (answer at once with `follow`), `behind` (a puff where he stood, the log left in it with `log`, teleport behind, `follow`); `current`: an effect bursting from his body on the read, with an afterimage (Chidori Current, ADR 0047) | Infinity, Sharingan, Substitution |
| `mode` | a timed buff on `f.mode`: `speed` ×, `damage` ×, `defense` (divides damage taken), `blinkDash`; look: `fx: 'lightning' \| 'chakra'`, `auraColor`/`auraCore`, or a `cloak` on the body (see-through chakra over it, a boiling rim, one tail; ADR 0044); `burstFx` (its own start burst at the feet instead of the white one) and, while it lasts, `shell` (an AuraShell outline on the body, a charge style's shell shape), `tint` (a body tint) and `aura` (an effect kept at the feet: one copy behind, a see-through `front` copy); the same look block is read from a reflex super or a running kit move (`kit.modeLook`); drains a HUD bar | Godspeed, Nine-Tails Cloak, Gear Second, Kaio-ken |

- Named kit moves get the special callout and an 8-frame flash. A kit move hit out of startup is
  cancelled cleanly (`kitState` cleared, the fighter made visible again).
- **Tap Special** (press and release within 14 frames) on a `rush` kit move: a 1-bar rush special. Startup forms the technique in the
  hand (hand VFX via `Effects.handTick`), active rushes forward at `rush` speed, and on hit the move skips to
  recovery.
- Starting a special triggers a 12-frame **super flash** (time freeze, 45% stage dim, callout).
- Two specials whose active frames meet within 1.6 units cause a **special clash** (ADR 0017): the world holds
  still and one ring closes on the target (46 f). The closer press (better grade, then fewer frames off) wins: the
  loser takes 60 and is blown back, the winner's special goes through. Both missing, or a dead heat, is the old
  trade (both take 60). For 480 frames after one, specials simply trade. (A Rasengan or Chidori driven into an
  energy *shot* is a beam clash instead, below.)

### Second supers (SUPER button)
- 3 bars, on the ground or in the air, out of guard or a dash, or as a cancel from a normal. Invulnerable
  through the flash and 12 frames past it.
- **Flurry** (`speedOfLightning`, Killua's Godspeed: Speed of Lightning; `shadowCloneBarrage`, Naruto): a 34-frame flash, then a 14-frame dash
  (range 6.5). On contact the opponent is `held` and the fighter teleports around them (8 × 22 for Killua), then a
  130 slam from above with a ground bounce. It whiffs if the dash misses.
- **Shadow Clone Barrage** (Naruto, a flurry with `crew`, ADR 0044): he dashes in alone and lands the first blow
  (13), then holds the seal while 8 clones come one at a time, one every 5 frames: each poofs in on its own side of
  the target, plays its own attack (punch, flying kick, uppercut, roundhouse, heel drop...) and poofs out (8 × 13).
  Four clones then kick it skyward one after another (4 × 12, "U! ZU! MA! KI!"), and Naruto drops on it from above
  with a big Rasengan (120, ground bounce). Same dash, range and catch as the plain flurry. The clones are drawn only:
  every hit is Naruto's.
- **Sky strike** (`kirin`, Sasuke): a 40-frame flash, then the storm **marks the spot** where the opponent
  stands and a lightning dragon hits it 40 frames later (280, unblockable, radius 2). The opponent can dash
  out of the mark ("DODGED!"). Uses Sasuke's `beamCharge` / `beamFire` poses. Its `storm` (ADR 0047) plays the
  anime inside those frames: a Great Fireball breathed into the sky, thunderclouds over the spot (the stage dims and
  the camera tips up), lightning crawling on the spot, his arm swung down 9 frames before the strike and the dragon
  diving out of the clouds for the last 6. Frame data unchanged.
- **Spirit Bomb** (`spiritBomb`, Goku, ADR 0050): a sky strike with Kirin's numbers (40-frame flash, the mark, 280 on
  the spot 40 frames later, radius 2, dodge by dashing out). Its `bomb` plays the anime: arms raised (`superPose`,
  through the flash too), the sphere gathering over his hands as energy streams in from all around the stage (the
  stage dims and the camera tips up), then 16 frames before the strike he shoves it (`beamFire`) and it falls onto the
  marked spot, where it lands as a dome. Frame data unchanged.
- **Domain** (`unlimitedVoid`, Gojo): a 50-frame flash, then the stage becomes the void
  (`src/world/voidStage.js`) and the opponent is `held` for 150 frames (~2.5 s) while Gojo combos freely.
  The domain ends early on a KO.
- Super hits carry `minScale` (0.8 for the flurries): combo scaling never takes them below 80 %.
- A fighter without a second super fires their ultimate from SUPER.

### Non-beam ultimates (`kit.ultimate`, ADR 0017)
- Heavy + Special fires the shared beam for a fighter without a `kit.ultimate` (Goku's Kamehameha; Naruto's Tailed
  Beast Ball since the user's call of 2026-10-18, ADR 0045). Every other ultimate is a `SUPERS` entry of its own kind,
  started with `kitState.ultimate`.
- **Hollow Purple** (Gojo, kind `orb`): a 46-frame flash, then Red (near hand) and Blue (far hand) drift together
  for 26 frames and fuse 0.9 ahead of him; the orb (radius 1.45) rolls forward at 15 units/s for up to 2.4 s,
  erases the opponent's projectiles and vortices, carves a trench, and hits once for 260 (unblockable, unscaled,
  wall bounce). Gojo recovers 24 frames after the release. Avoid it by leaving its lane or vanishing.
- **Rampage** (kind `rampage`, ADR 0017): a roar, a pounce on all fours committed to its line, a mauling for what it
  catches. Naruto's old Four-Tails; no fighter uses it since ADR 0045, the kind stays for a future one.
- **Godspeed: Whirlwind** (Killua, kind `reflex`): a 40-frame flash, then for 300 frames his body answers up to 4
  blockable strikes or shots by itself (`Fighter.takeHit` → `kit.reflexCounter`): the hit misses, a melee attacker
  is held for 12 frames, he blinks behind the attacker (the thrower, for a shot) and lands the Rhythm Echo strike
  (70). Unblockable hits (supers, ultimates), beams and throws go through it; not while he's stunned or held.
- **Amaterasu** (Sasuke, kind `ignite`): a 46-frame flash, then the Mangekyō gaze ignites black flames on
  the opponent wherever they are (no range limit, can't be blocked, misses only if they're invulnerable or
  hidden): 80 on ignition, then a **burn** status, 14 every 20 frames for 200 frames. Burn ticks never stun
  or add to the combo, but they can KO. The flames burst on them with no white flash (`hitFlash: 'ignite'`), and
  while they burn the black blaze clings to the body and the body itself burns black (ADR 0047).
- **Gear Third: Gigant Pistol** (Luffy, kind `laneStrike`, ADR 0032): a 44-frame flash, a 34-frame windup while the
  arm blows up, then the giant fist shoots down the lane he faces to 7 units in 8 frames and hits once for 270
  (unblockable, wall bounce) anything within 1.1 of the lane and below 2.0 up. It commits to the lane when the punch
  leaves: leave the lane or jump during the windup. It never clashes. 30 frames of recovery.
- **Kamehameha** (Goku): the shared beam (below), his `beam` palette and look (ADR 0050).

### Passives
- **Infinity** (Gojo): a projectile that comes within its radius + 1.15 units of him is stopped (ring
  effect, "INFINITY" callout at most every 2 s) whenever he isn't in hitstun, launched, down, getting up or
  held **and has at least 15 ki; each stopped volley costs 15 ki** (`PASSIVES.infinity`; a 3-shuriken throw is one charge). Beams, melee and supers still
  hit. Chip damage doesn't apply to him while he blocks.

### Simultaneous hits (trades)
- Melee hits found during a frame are applied together after both fighters have moved
  (`Game.resolveMelee`). Two attacks that connect on the same frame **trade**. (Before, P1 always updated first
  and won every exchange: in CPU soaks P1 won 81 % of matches; after the fix 51 %.) Two lights or two heavies
  meeting don't trade: they clash (below).

### Melee clash (ADR 0038)
- Every normal has a class in `MOVES` (`meleeClash`): light1-4 and airLight1-3 are **light**, heavy and airHeavy
  **heavy**. A swing that lands while the other fighter's classed swing is live (active, or at most
  `MELEE_CLASH.window` = 4 frames before its first active frame) meets it (`Game.swingsMeet`). Lights pressed up
  to about 3 frames apart clash at close range.
- **Same class: CLASH!** Neither hit applies. The strikes are held pressed together (hit stop 12 light / 14
  heavy, no slow-mo): sparks and arcs in both fighters' colors at the contact, a
  thin shockwave ring, speed lines on the contact, the stage dimmed a little and the camera pushing in on the fists.
  No screen flash. Then both are pushed back a step in the `clashBack` state (6.5 / 7.5 units/s, playing the move's own
  recovery). After 3 frames of it they can do anything; a Light or Heavy pressed while the strikes are held comes out then,
  so pressing again meets the next swing. Air clashes hop a little.
- **Chain:** a clash within 80 frames of the last one counts up `Game.meleeChain` (CLASH ×2, ×3...). Each step
  grows the spray, the shockwave, the camera push-in and the cheer, and gives both fighters ki: 10 per light
  clash, 18 per heavy, ×(1 + 0.25 per step). The **5th** is **CLASH BREAK!**: the biggest spray, smoke and a
  crater, and both skid far back on their feet (about a unit each, free after 12 frames): no damage, no knockdown.
- **Light vs heavy: CRUSH!** The light's hits that frame are dropped and the heavy lands now, even a few frames
  before its active frames.
- Specials, the vanish kick, the super dash hit and throws have no class: they trade as before.

### Held state
- `held` (Domain, Infinity counter, flurry): the victim can't act or air-tech, drifts down slowly if
  airborne (gravity x 0.25), and counts down `heldT`. Hits during it combo normally. A super that grabs a victim
  who is still in a combo (a flurry, the Four-Tails maul) carries that combo on, count and scaling, instead of
  starting a new one at 1 (ADR 0026); a throw's grip always starts a fresh combo.

### Charge ki
- **Hold Special** for 12+ frames on the ground: charge state with an aura, +1.45 ki per frame. Release,
  Guard or Jump cancels it. Heavy during charge with 3 bars fires the ultimate.
- **Each fighter powers up like their anime** (ENG-069, [ADR 0023](decisions/0023-canon-power-up-styles.md)). The
  look is data, `charge` in `src/characters/<id>.js` over `CHARGE_DEFAULT`, run by `src/game/chargeFx.js`:
  - a **body shell** (`src/game/auraShell.js`): a band of energy hugging the silhouette of the frame on screen;
  - a few **emitters** (bubbles, wisps, arcs, pebbles...) and an **eye glint**, unlocked per ki level;
  - a **bar beat** for each new bar and a **MAX beat** (rings, a burst behind the body, a short focus-line pulse, a
    camera punch), plus a one-pixel tremble on the sprite and a charge hum per style (`sound`).
- Level = filled bars + the active mode's `charge.level` (Nine-Tails cloak and Godspeed add 1), 0 to 3 (3 = the MAX
  look). The first 45 frames only widen the shell.

| Fighter | Shell | On the body / around | Eyes | Floor, beats |
|---|---|---|---|---|
| Naruto | `boil`: red Nine-Tails chakra boiling on his outline | chakra bubbles, wisps off the head; one chakra tail at MAX (`naruto_chakraTail`) | red slit eyes from bar 2 | pebbles, dust rings, a crack from bar 2, rumble |
| Sasuke | `dark`: near-black curse-mark chakra with a violet rim | dark wisps from his back, black tongues from bar 2, Chidori current arcs over the body | Sharingan from bar 1 (bigger at MAX) | a crack at MAX, light rumble |
| Killua | `electric`: a flickering blue-white outline | small arcs over the body and the floor (his charge strip raises his hair) | none | no crack, slight rumble |
| Gojo | `shimmer`: a faint Infinity outline | pebbles that lift and stop dead in mid-air, a faint ripple every 3 s | Six Eyes at MAX | nothing: no rumble, dust, crack or flash |

- **Restraint rules** (enforced in code): at most 16 live charge sprites per fighter (Gojo uses about 7), glow at
  most 0.6, big sprites behind the body and translucent, no focus lines while holding (a bar pulses them up to
  0.35), a screen flash only at MAX (at most 0.1, in the style's dark color, none for Gojo), a steady body tint of
  at most 6 %, and rumble at most 0.05 per 4 frames. During a super flash or a special clash the charge only
  refreshes (no new sprites, no new cracks). A mode's own aura pauses while charging.
- Ground cracks go through the ground-damage hooks (`fx.ground.chargeTick` / `chargeMax`, ADR 0024): from the
  style's `ground.crackAt` level one crack grows under the fighter (crack, then a fracture ring), and the full gauge
  breaks the floor in the fighter's own pattern. Without that module a style would lay at most one crater per charge
  at its `ground.crackAt` level.
- Each new bar still fires `Game.onChargeBar` ("MAX POWER!" with a louder chime on the last one).

### Ultimate, super flash and ultimate clash
- The shared beam below is the ultimate of a fighter without a `kit.ultimate` (Goku's Kamehameha, Naruto's Tailed
  Beast Ball).
- **Four-Tails: Tailed Beast Ball** (Naruto, ADR 0045): the shared beam in the four-tailed shroud. Through the flash
  the red-black chakra swallows him from the feet up (`def.beam.flashPose` held, `shroud`); the fox roars as the
  charge starts, red and blue chakra converge into a dark ball at its mouth (`gather`), and the beam (width 1.7, red
  and white) leaves the mouth with shock rings running down it (`muzzle`). The shroud bursts off him when it ends.
  `beamCharge` v17 is the fox gathering, `beamFire` v15 the fox firing; their `hand` anchors sit on the mouth.
- **Kamehameha** (Goku, ADR 0050): the ki ball grows between his cupped hands at the hip (`gather` at the drawn hand
  anchors of `beamCharge` v07, ki sparks converging, a thinner golden aura still on him) while KA, ME, HA, ME are called
  out a syllable at a time through the windup (`chant`), then HA! as it fires: the ball held bright at his palms
  (`originFx`), the beam's own rounded head (`headFx`, in place of the two glow bulbs) and shock rings down it
  (`muzzle`). Frame data unchanged.
- **Heavy + Special** (5-frame buffer), 3 bars. 46-frame windup (14 when answering, see below), invulnerable
  through the windup. A 42-frame super flash with a cut-in strip (`cutin.png` or the baked eye strip), stage dim
  72%, focus camera.
- The beam travels at 34 u/s up to 26 units long, ticks 12 dmg every 5 frames, and adds 130 on the final hit.
- **Answering an ultimate:** firing yours into the opponent's running beam or Hollow Purple (started on an earlier
  frame) gives a 20-frame flash ("COUNTER!") and a short windup: the beam's 14 frames, Purple merges in 8
  (`answerMerge`), a rampage's roar is `answerRoar`. Then the two can meet.
- **Ultimate clash** (a rhythm duel, ADR 0017, `src/game/clash.js`): two clashable ultimates (beam, orb, rampage)
  that meet head-on lock where they met. A beam still charging or a Purple still merging can be met too; it goes
  off on the spot. Both fighters are invulnerable; the round timer stops.
  - Both players play the same chart (seeded by the two ultimates): approach rings close on a target; press
    Light, Heavy or Special as each ring closes. 20 notes in three faster phases (doubles: two quick taps), then
    the **FINAL PUSH**: press and hold until the target fills. 7.7 s.
  - Grades by frames off the note: Perfect ≤ 3 (3 points), Great ≤ 6 (2), Good ≤ 9 (1), Miss (0). A press with no
    note near it is **OFF BEAT** (-1, at most once per 4 frames), so mashing loses. A hold let go early is graded
    by how early.
  - The struggle point follows the score lead (`0.5 + lead × 0.018`, capped at ±0.45); the loser's beam is pushed
    back to a stub, an orb into its owner's hands, and then the owner slides back (up to 2.2 units).
  - The end: the chart ends (or, in a blowout, the trailing player can no longer catch up before the FINAL PUSH).
    A lead of 2+ wins: the winner's ultimate goes through (the beam runs on, the orb rolls over them, Naruto roars
    it out) and the loser takes 250 (unscaled, unblockable, wall bounce, "OVERWHELMED!"). Under 2 is a **draw**:
    both blown back for 90.

### Beam clash (ADR 0027)
Two **energy attacks** that meet head-on become a **BEAM CLASH**: a shorter rhythm struggle between 1-bar specials,
with each side's attack drawn as a stream from their hands. Numbers in `CLASH.struggle` (`src/game/moves.js`).
- **Energy**: a shot whose projectile has `clash: 'beam'` (Killua's Narukami, Gojo's Reversal: Red, Sasuke's Chidori
  Spear and air Great Fireball; ground or air versions) or a rush special with `clash: 'rush'` (Naruto's Rasengan and
  Rasenshuriken, Sasuke's Chidori), which he drives into the other's stream by hand. Rush against rush stays the
  one-beat special clash; a physical shot (shuriken) still just cancels a shot. So every pairing has one except the
  Naruto mirror (two Rasengans).
- **How it starts** (`Game.checkEnergyClash`, before the shots move each frame and when two shots touch):
  - two shots in flight (or a shot and a running Rasengan) that touch head-on;
  - **the answer**: an energy special started while theirs flies at you from up to 5.5 units (`answerRange`) meets it
    at once (shot startup or Rasengan windup included), so you can answer a shot instead of blocking it.
  - Both owners must be free to lock (not stunned, blocking, dodging, mid-kit-move or teleport, not KO'd), at least
    2.2 units apart (`minDist`, closer they just trade), and 900 frames (`cooldown`) after the last beam clash.
- **The struggle**: BEAM CLASH!, both attack names called out, the clash camera and HUD (rings + struggle bar), the
  round timer stops, both invulnerable. A shot becomes a stream (`Beam`, the shot's `stream` palette, width 0.95)
  from its owner's hands, an airborne owner hovers; a Rasengan / Chidori is held on its rush frame with its orb lit.
  Two streams meet halfway between the hands, a stream meets a Rasengan at the held orb's front (the drawn hand +
  `orbReach`; a shot detects it `rushReach` 1.5 ahead of the fist).
- **How it looks** (ADR 0034): each move keeps its shape (`stream.style`): Narukami a branching lightning zigzag,
  Chidori Spear a straight lightning lance, Great Fireball a fire torrent (atlas bands tiled along the stream), Reversal:
  Red the orb at Gojo's fingertips sending repulsion ripples, a Rasengan / Dragon Fist held at the hand. Two `clashBurst`
  knots (one per side's color) mark the meeting point inside a size budget; the aura thins and the flashes are short and
  colored, so both fighters stay readable. A fighter whose sheet has `beamStruggle` plays it for the whole struggle.
- **From the air** (ADR 0034 section 5): the airborne owner eases down to a low hover (`airHover`) in its air pose
  (`beamStruggleAir`, else the `throw` release frame). A grounded rush answering it stays planted and holds the technique
  up the stream line; losing ground shoves the rusher back along the floor or the air owner back and up. A winning rush
  blasts up the line into them; a winning stream runs through the grounded loser.
- **The chart**: a fresh chart every time (the same for both players): count-in 30 f, 4 notes every 24 f, 5 every
  18 f with a double, then the FINAL PUSH (30 f); about 4.5 s, 12 graded presses. Same grades as the ultimate clash;
  the point moves 0.045 per point of lead.
- **The end**: a lead of 1+ (`drawMargin`) wins: the winner's stream runs through (a Rasengan goes on into its
  follow-through) and the loser takes **120** (unscaled, unblockable, launch [16, 9], **wall bounce**, a hard
  knockdown; "OVERWHELMED!"). A dead heat is a **DRAW**: both blown back for 45. A locked owner knocked out of the
  lock (a burn tick's KO) loses it.

### Ki economy

| Source | Ki |
|---|---|
| Passive (input live, not charging) | +0.1 per frame (+6/s) |
| Charging | +1.45 per frame (~87/s) |
| Landing a hit | +4 + 7% of damage dealt |
| Getting hit | +2 + 4% of damage taken |
| Blocking a hit | +4 |
| Costs | projectile 50 · vanish 100 · special 100 (kit moves: ½ or 1 bar, see `SPECIAL_MOVES`) · ultimate 300 · super 300 |

### Damage scaling, hitstun decay and the combo cap
- Combo counter: hits while the victim is in `hitstun` or `launched` add to `combo`.
- All of these numbers live in `JUGGLE` (`src/game/moves.js`), which the CPU combo composer reads too (ADR 0026).
- **Damage scaling**: `dmg × max(minScale ?? 0.4, 1 − (combo−1) × 0.065) × power × modeDamage ÷ defense`
  (`modeDamage` is 1.15 in Godspeed).
- **Hitstun decay**: `decay = max(0.35, 1 − (combo−1) × 0.045)` scales grounded hitstun and air stun.
  Launch air stun is `max(6, 40 − 1.6·combo) × decay`, and a juggle hit's air stun is
  `max(5, 26 − combo) × decay`. Juggle pop shrinks with the combo (`airPop × max(0.5, 1 − 0.03·combo)`), and
  launched gravity grows (`min(1.35, 0.6 + 0.035·combo)`).
- **Combo cap**: at **22 hits** a launched victim is forced to air tech automatically.
- **Multi-hit lock** (`lock` on a hit): beam ticks (`tickEvery + 3`) and Rasenshuriken / Blue vortex ticks
  (`tick + 3`) keep air stun and hit stun at least that long, so one committed multi-hit move can't be teched
  midway and never turns blue.

### Combo escape: tech, tech roll, timed tech, Burst (ADR 0022, ADR 0028)
Numbers in `DEFENSE.tech`, `DEFENSE.impactTech` and `DEFENSE.burst` (`src/game/moves.js`), logic in `Fighter`
(`techOpen`, `airRecover`, `startTechRoll`, `readTechPress` / `tryImpactTech` / `startImpactTech` / `wallKick`,
`canBurst` / `startBurst` / `burstWave`).

| Option | Input | Rules |
|---|---|---|
| Air tech | launched: **hold Guard**, or press any button | on an **open frame** (not KO'd or `held`, air stun over, above 0.35 units); holding Guard techs on the first one. 10 f, 16 f invulnerable. The stick picks the hop, against the opponent's side of the screen: neutral or away [−2.5, 6.5] (back), toward [3, 7], ↑ [0, 7.5] (rise in place), ↓ [0, −9] (drop to the floor, 4 f landing lag). |
| Tech roll | land from a launch while **holding Guard** | instead of lying `down`: 20 f, invulnerable 18 f, 7.5 u/s in the stick's direction (else away from the attacker), friction 0.88. Not after a **hard knockdown**: `hardKnockdown` on the last hit, by default ground-bounce spikes (air heavy, dive slams) and big unblockable hits (throw toss, super and ultimate finishes, clash results), plus the beam's final hit. Not on a KO. |
| Timed impact tech (ADR 0028) | a **fresh Guard press** (an edge: holding doesn't count) while in `hitstun` / `launched`, made during the combo, at most **11** live frames before the impact (`DEFENSE.impactTech.window`) | Impacts: the first floor contact of a fall (ground bounce, hard knockdown from a spike or throw, plain landing) and a wall bounce. Live frames skip hitstop and world freezes, so a press during either counts from the first frame after it. A press that doesn't tech locks it out for **40** live frames from that press (presses inside are ignored: mashing fails). Never on a KO, while `held` or grabbed, or after a `noTech` hit (super and ultimate finishes, ultimate clash results). Floor, stick neutral: **tech in place** 18 f, invulnerable 14 f; stick ← / →: **roll** 8 u/s (friction 0.88), 22 f, invulnerable 18 f. Barrier: **WALL TECH** clings 6 f, kicks off away at [7, 6.5], free (falling) 12 f later, invulnerable 22 f; with ↑ or Jump held at the kick, **WALL-JUMP TECH** [5, 13], actionable at once, invulnerable 14 f. Ends the combo; the bounce never happens (no budget spent). Checked before the tech roll. TECH! / WALL TECH! in white-cyan, a small white-cyan ring and spark at the contact point, a ting and a crowd pop. |
| Burst | **Guard + Special** in `hitstun` or `launched` (the later press within 3 f; Special pressed during the combo and under 6 f ago, so Guard pressed while a hit charge still holds Special is a tech; read during hitstop too; a burst on the frame a hit connects wins) | 200 ki, once per round. Not while `held` or grabbed, not during the opponent's three-bar `kit` move or beam, a clash or Domain. 8 f world freeze and BURST!, then startup 4 f and 6 active frames: an invulnerable shockwave (radius 2.4, 10 dmg, launch [14, 9], hit stun 14, hitstop 12) that ends the combo and lets go of a grinding vortex. **Blockable and parryable.** Recovery 20 f, or 30 f when it was blocked or parried (**burst bait**). The HUD gem by the ki gauge: lit (unused), glowing (enough ki), dark (spent). |

Tech poses (ADR 0030): with its strip in the fighter's sheet, each tech shows a dedicated pose on its own clock (the
`animPhases` beats in `DEFENSE`: tech in place 4 / 10 / 4 `techGround`, rolls 3 / 15 / 4 and 3 / 15 / 2 `techRoll`, wall
tech 6 / 4 / 8 `wallTech`, the wall jump's push-off 4 frames); without it the legacy poses (`land`, `airRecover`,
`jumpUp`). The art never changes a tech's timing, invulnerability or movement.

### True combos and the blue counter (ADR 0022)
- `gapF` counts the victim's open frames since the last hit (the air tech gate, and the landing when a tech roll
  was possible and not taken). A hit after a gap sets `comboBlue` for the rest of the combo; the counter turns blue
  (with a pop on the hit that turned it) and the training room shows `GAP nF`, the widest gap.
- Grounded hit stun can't gap (it returns to idle and the combo restarts), and `held` victims (Domain, flurries,
  mauls, staggers) can't act, so their hits stay true.
- Reference: the bread-and-butter route below is true. Juggle air stun is 10 f at hit 10, 5 f at 14 and 2 f at 20,
  so air-chain extensions past about 12 hits turn blue unless they go through a bounce (flat: wall 32 / 28 / 22 f,
  ground 30 / 24 f, the bounce budget), a vanish or a relaunch.

### Technique callouts (ADR 0022)
Banners slide in at the screen edge of the fighter who did it, stacked newest on top (3 per side), in every match:
PARRY! and BURST! (big), DODGE!, AIR DODGE!, TECH!, TECH ROLL!, the timed tech's TECH! / WALL TECH! (white-cyan,
ADR 0028), THROW BREAK, REVERSAL (the first hit of an attack
started within 3 f of leaving hit stun, block stun, wake-up, a tech or a stagger), PUNISH! (a fresh combo on a
fighter in their own recovery: a whiffed or blocked move, a parry stagger, the end of a dodge, landing lag over
6 f, a whiffed throw, a kit move's recovery, a blocked burst, a beam), WAVEDASH (small, once per 6 s per
fighter) and BACKSTEP (ADR 0025: a back dash's 8 invulnerable frames let a swing pass, or carried them just out of
its reach). The table is `TAGS` in `src/ui/hud.js` and the one entry point is `Game.tag(f, id)`; special names and
kit callouts keep their own row, so they never wipe a banner out.

### Blocking
- **Hold back to block** (ENG-057, always on): on the ground, the stick held away from the opponent on screen
  (`Fighter.holdingBack`, |stick x| > 0.5) blocks like Guard. From idle or run a hit that lands turns you and is
  blocked; and while something threatens (`underPressure`: an attack, kit move, super dash or vanish of theirs within
  4.5 units, a beam charging or out, a shot within 4.5 or an orb within 5.5, or 14 frames after you blocked) holding
  back holds the `guard` state instead of running away, so strings stay blocked. With nothing coming it still runs
  away. Only a person's pad gets it (and the lab's scripts and replays): CPU levels guard at their own rates.
- Hold Guard while **facing the attacker** (block is directional). Chip damage is 10% (30% for beams) and
  never kills. Block stun is `hitstun × 0.6 (+8 for big moves)`, pushback applies, and the attacker shares 70%
  of the hitstop. Unblockable: beam-clash results, special clashes.
- A held Guard loses to the **throw** (below), to cross-ups it fails to turn for in time, and to unblockable supers.

### Defensive options: parry, spot dodge, air dodge, wavedash (ADR 0014)
All free, all on Guard, numbers in `DEFENSE` (`src/game/moves.js`). They reuse existing poses (no new animation
names yet) with ghosts and a blue intangibility shimmer.

| Option | Input | Frames and rules |
|---|---|---|
| Parry | Guard pressed ≤ 6 f before a blockable hit lands (from idle, run, guard or block stun) | no damage, chip or block stun, the defender acts at once, +12 ki, "PARRY!" and a 7 f world freeze. A melee attacker is staggered (`held`) 16 f, 24 f after a big move or special; a projectile is swatted away. Not against beams, unblockables or a kit counter stance. **Lockout**: every Guard press starts 24 f in which a new press is only a block, so mashing Guard never parries; a successful parry re-arms at once, so a string can be parried hit by hit. |
| Spot dodge | in Guard, push ↓ (an edge within 3 f; holding ↓ from before doesn't count) | 24 f, intangible on frames 2-14, then 9 f of recovery. Staleness: each dodge within 150 f of the last adds 4 recovery frames, up to 3 times. The fighter holds the `vanish` strip's first frame (its low crouch) for the whole dodge (`DEFENSE.spotDodge.pose` / `poseFrame`). |
| Air dodge | Guard in the air, once per airtime (landing or getting hit gives it back; works after an air attack) | 30 f, intangible on frames 2-17, no gravity while intangible. With a direction: burst at 12.5 u/s that way, angled down 6.5 u/s (24 u/s below 0.95 units, so a dodge right after takeoff meets the floor); neutral: hover. Landing in a neutral dodge costs 10 f of lag. Special within 3 f turns it into a vanish. |
| Wavedash | a directional air dodge that meets the floor, or Guard pressed with Jump (from 2 f before the jump squat) | slide on the floor (friction 0.875 per frame, ~1.6 units), facing the opponent, invulnerability ends on landing. Acts from frame 5 of 16; an attack, guard, special or charge started from the slide keeps its momentum (`carry`). Jump + Guard with no direction lands on the spot with 10 f of lag. |

### Throw and throw break (ADR 0015)
Numbers in `THROW` (`src/game/moves.js`), logic in `Fighter.updateThrow` and `Game.tryGrab` / `breakThrow` /
`throwHit`.

| | |
|---|---|
| Input | Light + Heavy within 2 frames (buffered). From neutral, a dash, a wavedash slide or straight out of Guard; ground only. |
| Frames | startup 5, active 3, whiff recovery 26 |
| Reach | 1.05 along the screen, 0.6 in depth |
| Grabs | grounded `idle`, `run`, `guard`, `land`, `wavedash`, `charge`, `dash`, `jumpSquat`, `held`; an attack in its startup; a counter stance, mode power-up or Blue cast. Not hit or block stun, airborne, invincible or hidden. |
| Break | the victim is pinned 18 f; Light + Heavy within the first 12 f breaks it (no damage, both pushed apart, 10 f recovery). Two throws at once break each other. |
| Toss | 80 dmg (`minScale` 0.8), launch [12, 8.5], wall bounce, unblockable; super dash or vanish can follow from frame 6 |

Strike beats throw, throw beats guard / parry / counter stances, guard and parry beat strikes, and spot dodge,
jumping or a break beat throws.

### Knockdown and wake-up
- A launched victim that lands goes `down` (invulnerable), unless they hold Guard and the last hit wasn't a hard
  knockdown: then they tech roll (above). Get up automatically after 40 frames, or press any button after 16.
  Get-up is 20 frames with 28 frames of invulnerability.

### KO and the destructive finish
- At 0 HP the victim is launched at least [14, 8.5], or [23, 10] by a big move, special or beam. The ring
  barrier is off: they fly off the ring onto the grass and can crash into the stands' walls (explosion,
  debris). KO slow-mo is 0.22× for 1.4 s, with a KO camera.
- A KO'd body never comes to rest across the ring edge (ADR 0020): lying within `KO_EDGE` (1 unit, half a lying
  sprite) of the edge on the ring, or within the lip (`RING_LIP` 0.35) plus `KO_EDGE` of it on the grass, it keeps
  sliding outward at `KO_SLIDE` (3 units/s) and drops onto the grass clear of the ring (`Fighter.slideOffEdge`).
- A flurry super or the Four-Tails mauling that knocks the victim out lets go of them: the KO launch plays out.

## Hit detection: 2.5D lanes and frame boxes

**The problem it solves.** The old test (`checkMelee` before the lanes work) was a forgiving cylinder: anything
within `reach + 0.3` ahead and `width` (~1 unit) sideways connected. In a free-roam 3D ring seen through a
tilted camera, a victim one unit deeper than the attacker looked like a whiff above or below the body,
but still took the hit. Sparks also spawned at a fixed body height, not where the fist was.

**The rule now** (see [ADR 0005](decisions/0005-25d-lanes-frame-hitboxes.md)):

1. **Facing is screen-horizontal.** Fighters face screen-left or screen-right only (`Fighter.side`), so strikes
   travel across the screen the way the sprite is drawn.
2. **Auto-step into the lane.** During an attack's startup and active frames, the attacker steps in depth toward
   the opponent (up to 0.1 units per frame while the depth gap is under 2.6). The CPU also lines up in depth
   before attacking.
3. **Same lane.** A melee hit requires `|depth offset| ≤ LANE` (0.6 units by default, `m.lane` per move) in
   `src/game/game.js`.
4. **Box overlap.** The attacker's **hit** boxes on the current sprite frame (active frames only) must overlap the
   defender's **hurt** boxes on *their* current frame, in screen-plane coordinates (x along the screen, y up).
   The boxes come from `anims.json` `boxes` (baked placeholders generate them from the 3D limbs, and the packer
   generates them for custom art, with `hitboxes.json` overrides). Sheets without boxes fall back to
   `reach`/`yTol`. Custom art is drawn so active-frame strikes land in the contact zones of
   [art/SPEC.md](../art/SPEC.md) (spec v2, [ADR 0007](decisions/0007-art-spec-v2-shippuden-256.md): HIGH /
   face y 58-90, MID / chest y 92-124, LOW / stomach y 122-152 in the 256 px cell, soles on y 240), so the
   packer's boxes meet a same-size opponent's hurt boxes at the height the move is meant to hit.
5. **Spark at contact.** The impact effect spawns at the center of the overlap.

When tuning, use the debug overlay (once available, see docs/TASKS.md) or step frame by frame with `step(1)`
and check that the spark sits on the body.

Projectiles use a body capsule (feet +0.25 to +1.4, radius + 0.42) instead of boxes. Beams use a
distance-to-line test.

## Camera and feedback per hit tier

| Tier | Effects | Victim flash (`HIT_FLASH`, default `pop` style) |
|---|---|---|
| light | small spark, `hit` sfx, shake 0.14 | 1 white frame, then lift + white rim through hitstop, 6-frame fade |
| heavy | big spark, `hitHeavy`, shake 0.4 toward the hit, zoom punch 0.45 | 2 white frames, warm rim, 7-frame fade |
| smash | burst + lines, `smash`, shake 0.6, zoom punch 0.8, white flash, slow-mo 0.4× for 0.18 s | 3 white frames, gold rim, 8-frame fade |
| special | explosion + ground damage in the move's style, impact frame, color flash, slow-mo 0.3× for 0.5 s, crowd cheer | 2 white frames (about a smash's 3 on screen under the 0.3× slow-mo), white rim, 10-frame fade |

The victim flash has its own tiers (`flashTier` in `src/game/hitFlash.js`, first match wins): **ko** (the hit that
KOs: white for up to 5 frames, about 0.4 s under the KO slow-mo), the move's **`hitFlash`** field (3-bar super
finals, Hollow Purple and the special-clash outcomes say `'special'`: white through the hitstop, up to 5 frames),
**special** (a big beam), **tick** (hitstop ≤ 3 and not big: beam, vortex, Lapse: Blue and flurry hits never pop,
only a pulse of lift and rim), **counter** (the hit lands in the startup or active frames of the victim's own attack,
a kit move, a throw reach or a beam charge: white for up to 4 frames, orange rim; punishing a whiff or a recovery,
such as a dive's landing, a stance after it ends or a missed throw, is a normal hit, `kit.inRecovery`), **rush**
(`special`: the 1-bar rush specials, the table's special row), then smash, heavy, light as in the table. Full white
longer than a smash's 3 frames is only for counter hits, supers and KOs. From combo hit 6 a normal hit pops 1 frame
at most. A **parry** gives the parrier 1 white frame and a cyan rim through the freeze; a
**burn** tick (Amaterasu) gives no pop, just a soft lift and a rim in the burn's color. All of it is render only and
counts every sim frame (through hitstop and freezes), so it never changes timing. The hitstop shake is a whole-frame
alternation per tier (0.035 light .. 0.09 special; 0.04 on block), so the sprite never sits between pixels.

Styles for A/B: `pop` (default), `tint` (no rim), `rim` (no pop below counter), `classic` (the old look: solid white
through the hitstop plus 5 frames) and `off`. Switch them with `?flash=<style>` on the game page or the HIT FLASH and
FLASH STR chips in the lab's Tools tab; under `?debug`, `window.HIT_FLASH` is the live table.

### Ground damage per force (ADR 0024)

The floor answers how hard something hit it (`GROUND` in `src/game/ground.js`). Force comes from the fall speed of a
landing (`(vy - 8) / 26`, +0.25 for a ground bounce, +0.35 for a KO), from the hit (spark weight, damage, special,
super), from a dive slam (0.7, 0.9 when it caught someone) or a fixed value per event. A special, styled shot or
smash on an **airborne** victim leaves its crater where they land (impact debt, 90 frames); on a grounded victim
(specials and styled shots) at once.

| Force | Mark | Size (units) | Extras | Typical source |
|---|---|---|---|---|
| < 0.15 | none | | | a soft landing |
| 0.15 | `crack_s` hairline star | 1.4-2.2 | | a launcher's fall, the super jump, charge after 30 f |
| 0.35 | `crack` web around a dent | 2.0-3.0 | | a hard fall, Narukami / Chidori Spear on a standing victim or the floor |
| 0.55 | `crater` | 2.6-3.6 | rim chunks, dust ring | specials on a grounded victim, a fireball on the floor, dive slams, maul slams |
| 0.85 | `crater_big` | 3.8-5.2 | crack satellites, rubble, floor slabs | an air heavy spike's ground bounce, KO landings |
| 1.15 | `crater_huge` (stays for the round) | 5.4-7.6 | fracture ring, crack satellites, smoke | clash wins and draws, Kirin, a maul that kept growing |

The move's **style** (`ground` on the move, projectile or super, else the attacker's `ground.style` for specials;
normals and throws are stone) draws over the crater or replaces it: chakra scorch, spiral scour (Rasengan),
wind cuts (Rasenshuriken), claw furrows and a roar scorch fan (Four-Tails), lightning burns (Chidori, Narukami,
Thunderbolt, Kirin's starburst), fire scorch (Great Fireball), black flame (Amaterasu, and under a burning victim),
glass-like cursed fractures (Gojo), the implosion of Lapse: Blue, Reversal: Red's gouges and Hollow Purple's
erasure trench. Hot seams glow in the move's color, then cool. Repeated slams in one spot within 4 s grow one
crater (a hit two tiers weaker, such as the super jump beside it, leaves it alone). Wall bounces crack the ki
barrier, KO crashes leave a hole in the stand wall (body-shaped when fast), off-ring KOs a dirt crater in the grass,
and knockdown and KO slides a skid. Holding Special grows one crack under the fighter into a fracture from the
power-up's `charge.ground.crackAt` level (Naruto bar 2, Sasuke MAX; Killua and Gojo never crack it), and the full
gauge breaks the floor in the fighter's own pattern (`ground.charge`). The ring is clean every round.

## CPU AI

`CpuBrain` (`src/game/ai.js`) presses buttons on its Pad. Levels are Easy, Normal and Hard
(reaction frames, guard and aggression rates, combo completion, clash timing (`beat`), special/vanish/tech
probabilities). It lines up in the depth lane, then executes the bread-and-butter route by watching its
own hit confirms. `DummyBrain` drives the training dummy (stand, guard, hop, fight back).

Kits (ADR 0009/0011): `pickSpecial` weighs each slot's kind by the situation. Shots and teleports are for
range, pull for mid range, dive against a jumper, and a mode only when it isn't active. The CPU holds the
direction through the release frame. On Hard it sometimes answers an incoming attack with a `counter`, and it
always punishes a `held` or popped-up opponent with a combo. Fighters with a kit choose specials more often
than legacy fighters. At 3 bars they split between the second super (if its `range` allows) and the
ultimate (a beam wants some distance; a kit ultimate fires from anywhere). A counter may sit on ↓ or ←, and
the CPU dashes out of a Kirin mark.

**Directional normals** (ADR 0042, ENG-111, `src/game/aiNormals.js`). The stick picks the normal as the attack starts,
so a brain presses one with `normal(name)` ('uTilt', 'fSmash', 'fair' ...; a plain Light or Heavy is the neutral one)
and holds the stick on its direction from the press until the fighter has read the button (or the buffer's 12 frames
are over, or it got hit first: the stick is the tech's then). Jumps: Jump held 8 frames is a full hop (the squat's 4
plus a buffered start), a 2-frame tap a short hop, Jump + Light a short hop with the aerial out at once. In the air the
stick is kept off a fresh ↓ (a fast fall) unless the brain means one; an air dodge and an air ↓ special read their own
stick. The aerial out of a jump is the one whose art hit box meets the opponent at its first active frame
(`aerialFor` in aiCombo.js: up air above, back air behind the jump's facing, neutral or forward air in front, the spike
below; the air string in a juggle). Both brains fast-fall a Smash aerial past its active frames. They aim with the
left stick only (the C-stick gives smash attacks, never the tilts, and would leave the jump's drift to the left stick).

- `CpuBrain` (Easy, Normal, Hard): up tilt or launcher anti-airs (`antiAir` per jump of theirs: 10 / 30 / 55 %, each
  pressed in its own window), smash attacks into a whiff with time to spare (`smash` per whiffed move: 10 / 25 / 40 %,
  charged by the frames left over), and in neutral tilt pokes, short-hop aerials (rising, or the late one below) and
  back airs after running off. Links: down tilt → jab; up tilt → up tilt or short hop → up air; a short-hop aerial on a
  standing victim → down tilt once it lands (`linkDt`), each decided once per hit at the level's `combo` rate.
- `MasterBrain`: anti-airs picked once per jump (launcher, up tilt, the showman's up smash, a rising dive special),
  `smashPunish` (forward / down / up smash or the forward tilt from past the jab's reach, decided once per opening and
  charged by its spare frames), the dash attack out of a dash-in now and then, and neutral plans `poke` (down or
  forward tilt at its art's reach), `hop` (rising Jump + Light, or late: the aerial from the hop's top with a fast fall
  right after the press, so it hits low and lands with their stun to spare) and `bair` (run off four frames, Jump +
  Light with ← along the turned facing). Jump-ins are full hops now and then short ones, with the stick held through
  the squat. The Showcase counts every new normal (`fTilt` ... `uair`, `nair` for airLight1 out of a jump), so the
  showman reaches for the ones the viewer hasn't seen.

Melee clash (ADR 0038, `src/game/aiClash.js`): once per opposing light or heavy that has just started in reach,
the CPU presses the same button at its level's `meleeClash` rate (Easy 4 %, Normal 8 %, Hard 12 %, ×1.5 when
spectated; INSANE 8 %, IMPOSSIBLE 10 %, the CPU-vs-CPU showman 18 %), and once per clash slide it goes again at
that rate × 1.1, so chains happen in solo and spectated play.

Easy, Normal and Hard also use the defensive options at their level's rate (`parry` with a timing error of
`slop` frames, `spot`, `airDodge`, `wavedash` in `LEVELS`): a timed Guard press against attacks and
projectiles, Guard + ↓ against big swings, an air dodge when something reaches them in the air, and wavedashes
in and out in neutral.

Combo escape (ADR 0022): `CpuBrain` holds Guard through a launch with `techHold` per launch (Easy 5 %, Normal
20 %, Hard 45 %; its per-frame `tech` tap stays as a late fallback) and bursts with `burst` per combo of 3+ hits
(0 / 4 % / 12 %, pressed at hit 3-5). `MasterBrain` holds Guard to tech on its `tech` roll with a direction picked
per launch (back 0.5, toward 0.2 when close, down 0.2, up 0.1), bursts per combo of 3+ hits with `burst`
(IMPOSSIBLE 30 %, INSANE 15 %, showman 35 %; ×1.5 under 350 HP or when the attacker has three bars; the showman
leans toward it until the viewer has seen one), and IMPOSSIBLE and showman **bait** bursts (`bait` 25 % / 30 % per
combo against a victim who has one): stop after hit 3-5, guard, punish the recovery. The training dummy has
`DUMMY TECH` (never / hold / random / timed) and `DUMMY BURST` (off / on, at hit 3) rows (`game.dummyOpts`).

Timed impact tech (ADR 0028, `src/game/aiTech.js`): `impactAhead` forecasts the live frames to a launched fighter's
next floor or wall impact; a `TechTimer` is armed per launch with the level's `impactTech` (Easy 5 %, Normal 15 %,
Hard 35 %, INSANE 55 %, IMPOSSIBLE and showman 65 %) and presses Guard 5 ± `techSd` frames before each impact (5 / 4 /
3 / 2.5 / 2 / 2 frames: a wide error presses too early and gets locked out), picking in place / roll away / roll
toward or wall tech / wall jump. Armed, a brain that rolled the hold tech taps Jump at the air gaps instead of holding
Guard (that press would lock the timed tech out). The combo composer weighs bounce routes by the victim's timed-tech
rate this match (`techRisk`); a teched bounce ends its route (`groundTech` / `wallTech`). DUMMY TECH `timed` techs
every impact mid-window with a random option.

**Showcase** (ADR 0016, `src/game/aiShow.js`): every CPU keeps a match-long count of the tools it has used
(kit specials, the second super, the ultimate or beam, vanish, super dash, wavedash, parry, spot dodge, air
dodge, throw, charge, burst, backstep, vanish war) and weights its options by `bias(tool)`: up to `1 + 3·push` for a tool the viewer
hasn't seen. It only reweights options the brain already judged sensible, so the fight stays real. `push`:
Easy 0.3, Normal 0.5, Hard 0.7, IMPOSSIBLE 0.35, showman 1. The CPUs end strings with the special the player
hasn't seen, pick the super or ultimate by the same weights, and spend more of their ki on the kit.

**IMPOSSIBLE** (ADR 0014) is a separate brain, `MasterBrain` in `src/game/aiMaster.js`, chosen by
`makeBrain(fighter, level, spectate, seed)` in `ai.js`. It still only presses buttons, and it reads what the screen
shows (states, frames, positions), never the opponent's Pad. Each frame, in order: recover (tech at the first
legal frame, varied wake-up), its own move (its combos are the **combo composer**'s, below, plus a lethal check
that spends supers and ultimates), threats (when and whether the opponent's move can reach it,
seen after `react` frames, answered once with a timed parry, a spot dodge that leaves a punish, block, super
dash through projectiles, counter, vanish, counter-beam, depth sidestep or air dodge), punishes (the
opponent's remaining recovery against jab, dash-in light, shots, teleports or a lethal super), wake-up meaties
and anti-airs, then neutral plans (approach by walk / dash / wavedash / super dash, pressure, guard with parry
fishing, bait, wavedash footsies, jump-ins with an air-dodge mix-up, zoning, charging, modes, beams).
Its answer to a threat is a weighted pick among the ones that work against it (parry, spot dodge, air dodge,
counter, vanish, super dash through a shot, sidestep, counter-beam, block), weighted by the style and the
Showcase. `STYLES` hold the fairness knobs: `impossible` (vs a player: sees an attack after 7 f, parries about
half the time, max-damage routes), `insane` (the INSANE level between HARD and IMPOSSIBLE: sees an attack after
12 f, parries 28%, dodges and techs less, and drops 15% of its combos after 2-3 hits via `drop`) and `showman`
(CPU vs CPU, ADR 0016). CPU vs CPU defaults to IMPOSSIBLE.

The **showman** plays for the viewer: long, varied combos from the combo composer (below), mid-range neutral with
the kit (zoning, kit tools, air specials, modes, three-bar moves, "power up" charging at a distance, a wake-up reset
to mid range) rather than
jab pressure, a plain block as its least likely answer, and free ki spending except that it saves up (and
powers up) for its first three-bar move of the match. When both fighters' ultimates can clash (Hollow Purple,
Four-Tails, a beam), that first three-bar moment is reserved for a **clash** (ENG-056, once per match): it keeps
three bars, fires its ultimate only once the opponent has three too, and otherwise answers theirs; it gives up for
the round after 10 s at three bars or with under 20 s on the clock. The training dummy plays any clash at the CLASH level picked in the lab.

**Beam clashes** (ADR 0027). Against a player, every CPU sometimes answers an incoming energy shot (or a Rasengan /
Chidori from range) with an energy special of its own: `CpuBrain` at `special × 0.6` (Easy 9 %, Normal 18 %, Hard
27 %, up to ×3 while the player hasn't seen a beam clash), IMPOSSIBLE / INSANE at a weight of `0.25 × flair` among
its other answers. It only answers when a clash can start (`kit.canBeamClashNow`: not inside the 900-frame cooldown,
over 2.2 units apart, the thrower free to lock); otherwise it blocks or dodges the shot like any other. In **CPU vs
CPU** (any level) a spectator-only **show director** (`src/game/showDirector.js`, created only when
`Game.watching`) makes sure the viewer sees one every match: at a random moment 15-40 s into round 1 (8-20 s into a
later round that started without one) it picks a random challenger and cues both brains for 480 frames. The cued
challenger plays a `challenge` plan (into their lane at a gap their answer reaches, then fires its energy special once
they are free and have the ki to answer); the cued answerer keeps to mid range and answers (MasterBrain: weight 50;
CpuBrain: for sure; both read the shot's startup at once, so a 9-frame Chidori Spear can be met). A cue that comes to nothing expires and returns
6-12 s later; after the match's first beam clash the director is done and further ones happen only by themselves
(the showman answers at `0.15 × flair`). While the director still has one to cue, the showman keeps the ki for its
cheapest energy move (`spend()` stops above it), powers up when short, and each clash is played at a jittered
timing (`sd` ×0.6-1.8) so even showmen rarely draw. The director never presses a button.

**Defense showcase** (ADR 0025). Every CPU times threats to the drawn strike (`reachT`: the first active frame whose
hit box reaches in front of the body), re-picks an answer it chose while it couldn't act, and tracks a vanish or
teleport strike from the smoke to the kick; `CpuBrain` reacts on a live-frame clock. Each CPU rolls a hidden
**defense persona** per match (parrier, dancer, phantom, rock, scrapper; `DEF_PERSONAS` in `aiShow.js`, jittered per
match and per round) that reweights its answers: fully for the showman and spectated Easy-Hard (their technique rates
also ×1.5, capped at 0.9), normalized for IMPOSSIBLE, INSANE and Easy-Hard against a person (it changes which
technique comes out, not how often one does). The showman (`DEF_KNOBS` in `aiMaster.js`, methods in
`src/game/aiDefense.js`) also: reacts in 6 frames; wavedashes out of a shot's line, backsteps through a swing,
vanishes back against a vanish (the **vanish war**); guesses at an approach (parry, dodge, backstep, wavedash or jump
out, a jab to stuff it, a vanish behind them) and at the next hit of a blocked string (parry it on rhythm,
guard-cancel vanish); reverses at the end of hit stun when the combo has a gap and on wake-up (parry, dodge,
backstep); escapes after an air tech (air dodge away or through, waveland, vanish, super dash); rotates its answers
(`rotate` per repeat among its last four, half as many dodges within 150 f of the last); and after a parry picks a
jab, heavy, throw, vanish or a **rally**: a hit timed to land after their stagger (a raw rush or shot, a vanish that
reappears as they recover, or a heavy already in sight), which they can parry back. IMPOSSIBLE and INSANE keep the
sure jab. `game.brains.map((b) => b.show.report())` returns the persona, the answers picked (`defLog`) and carried
out (`done`), parries, evades and rallies.

### Combo composer (ADR 0026, `src/game/aiCombo.js`)

MasterBrain's combos come from a `ComboComposer`. At each decision point of a combo it runs (a ground light, the
launcher or an air light connected; the down or up tilt connected; a short-hop aerial connected on a standing victim;
another move connected; free in the air beside the victim; air-locked after an air string; the victim bounced off the
barrier or the floor; free on the ground while they reel) it picks one **edge**: a chain, launch, chase, super dash,
vanish (a 2nd and 3rd in one combo are the ping-pong), any kit special by its kind, waiting for a bounce that is
coming, meeting the victim from the ground (the handball light off the wall, a jab, a dash-in light, a heavy relaunch,
an up or down tilt), a short hop under them for the up air, a three-bar move that carries the combo on, or the end.

- **Smash links** (ADR 0042, ENG-111): nodes `DT` (down tilt hit: the jab string, a special cancel, a vanish), `UT` (up
  tilt hit: another up tilt, a short hop whose up air the free-air node then leans on, the super dash) and `HOP` (a
  short-hop aerial on a standing victim: the down tilt or the jab once it lands). A link chosen there carries on after
  the move ends, through the landing, until it is pressed (`linking()`). Every link is checked like the rest: the
  predicted flight (a light pop lands on the feet and ends the combo there), a Smash aerial's own landing lag, the
  art's boxes.

- **Only true links.** Each edge's link gap is checked against the victim's stun left with **2+ frames of margin**
  (a victim holding Guard techs on the first open frame), using `JUGGLE`, a forecast of the victim's flight (barrier
  and floor bounces, the bounce budget, hitstop) and the art's hit boxes (a strike drawn high misses a crouched body).
  It learns per match from the links it pressed (success rate, how late they land).
- **Personas** (one per CPU per match, drawn from the brain's seeded rng and the kit data): rushdown, juggler,
  vanish artist, wall bouncer, kit showman, with 30 % of a second one blended in. They weight edge tags (wall,
  handball, vanish, air, relaunch, kit, ...), the length tiers and ki appetite, and nudge the neutral starters.
  IMPOSSIBLE and INSANE use `optimal`: the highest-priority edge that links, as long as it links.
- **Length tiers** per combo: short 4-7, medium 8-12, highlight 13-20 hits, with a governor: a highlight is likelier
  after 20 s of a round without one and with two bars of meter, rarer after one, and both long tiers are rarer while
  combos fill more than half the fight time. Enders weigh less while the target is far; extenders weigh less once it
  is reached. Long tiers look one step ahead (the stun window an edge leaves; no dead ends).
- **Variety**: freshness (an edge used often this match weighs less), a cooldown on routes that repeat a 3-edge
  opening of either CPU's recent routes, and the Showcase bias. `?seed=N` fixes the match seed (the personas and
  every draw).
- **Burst threat** (ADR 0022): against an unused burst with 2 bars, cautious personas draw fewer highlights and cash
  out sooner, risk-loving ones bait it more.

The viewer sees it all in every match: WALL BOUNCE! / WALL BOUNCE ×2! / HANDBALL!, GROUND BOUNCE!, RELAUNCH! and
VANISH ×2! banners, a ticker of the combo's techniques beside the counter, and a rating when it ends (GREAT 10+,
AMAZING 15+, LEGENDARY 20+ hits, STYLISH! with 4+ different techniques).

## Bread-and-butter route (reference)

`Light ×3 → Heavy → Jump (chase) → airLight ×2 → airHeavy (spike) → ground bounce → super dash → ...` with the
stick neutral on the Lights (a held direction picks a tilt or an aerial, ADR 0042). Smash-style starters: down tilt →
jab string; up tilt → up tilt → short-hop up air; short-hop neutral or forward air → down tilt.
Spend 1 bar on Vanish or Special to extend. End with the Ultimate for 3 bars.

## Balance process

1. Change numbers in `moves.js` or the character's `stats`, one idea per change.
2. Update the tables above.
3. Test in the training room (frame stepping), then run a CPU-vs-CPU soak (docs/TESTING.md).
4. Record notable balance changes in CHANGELOG.md under **Changed**.

## Glossary

**Startup / active / recovery**: the three phases of an attack. **Hitstop**: a freeze on hit that sells
impact. **Hitstun**: frames the victim can't act. **Launcher**: a move that pops the victim into the air.
**Juggle**: hitting an airborne victim. **Tech**: recovering from a launch (air tech, or a tech roll on landing).
**Hard knockdown**: a hit after which landing can't be teched. **Burst**: the once-per-round combo breaker.
**True combo**: a combo the victim had no chance to tech out of; a **blue** combo had a gap. **Chip**: damage through block.
**Super flash**: a short time freeze when a special or ultimate starts. **Lane**: the depth band in which
melee can connect. **Hurtbox / hitbox**: where a fighter can be hit / where an attack hits.
