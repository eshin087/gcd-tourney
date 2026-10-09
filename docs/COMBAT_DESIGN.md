# Combat design

The combat model is DBFZ-inspired (see [ADR 0004](decisions/0004-dbfz-combat-model.md)): easy auto
combos, launchers and air combos, super dash, vanish, signature specials, a 3-bar ultimate with a beam
clash, and spectacular KOs. Every gameplay number lives in `src/game/moves.js` and
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
| Naruto | 5.9 | 1.0 | 1.0 | Rasengan | Shuriken ×3 | Rasen Cannon |
| Sasuke | 6.2 | 1.05 | 0.95 | Chidori | Fireball | Lightning Lance |

## Controls (default bindings, rebindable)

| Action | VS CPU keyboard | Gamepad |
|---|---|---|
| Move | WASD / Arrows | left stick / D-pad |
| Light | J | □ / X |
| Heavy | K | △ / Y |
| Special (tap, + direction) / charge (hold) | L | ○ / B |
| Jump | Space | ✕ / A |
| Guard | Shift | L1 / LB |
| Dash (+direction) / super dash (neutral), or double-tap a direction | O | R1 / RB (also R2 / RT) |
| Ultimate | Heavy + Special | △ + ○ |
| Vanish | Guard + Special | L1 + ○ |
| Super (second super) | H or B | L2 / LT |

Adding SUPER took L2/LT from guard. Bindings moved to a new localStorage key (`gcd.bindings.v2`), so saved
custom bindings reset once.

2P keyboard bindings are in README.md. Bindings are rebindable in the controls panel and saved to localStorage.

## Moveset and frame data

Frames are at 60 fps. **Startup** is the frames before the hitbox is live, **active** is the frames the
hitbox can connect, and **recovery** is the frames after. Animation frames are spread across these
phases using `phases` in anims.json (see `SpriteActor.setPhase`). Damage is before scaling (HP 1000).

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
| airHeavy | Heavy (air) | 9 | 6 | 16 | 31 | 62 | 1.45 / 1.15 | 15 | launch [3, -22] | double-axe **spike**, **ground bounce**, yTol 2.4 |
| throw | Special (air) | 8 | 3 | 14 | 25 | (projectile) | | | | costs 50 ki; spawns the projectile at f8 |
| vanishKick | after Vanish | 2 | 5 | 20 | 27 | 75 | 1.7 / 1.15 | 16 | launch [17, 6.5] | uses the `light4` anim, wall bounce |
| super dash | Dash (neutral) | | contact | | ≤ 42 | 38 | contact < 1.0 | 9 | stun 26, air pop 7 | homing at 18 u/s, projectile-invulnerable |
| Rasengan | tap Special | 24 | 22 | 20 | 66 | 150 | 1.3 / 1.05 | 18 | launch [16, 9] | rush 14 u/s, 1 bar, wall bounce |
| Chidori | tap Special | 28 | 18 | 20 | 66 | 165 | 1.3 / 1.05 | 20 | launch [14, 11] | rush 18 u/s, 1 bar, wall bounce |
| Ultimate beam | Heavy + Special | windup 46 (counter 14) | 84 | | | 12 per 5 f + 130 final | width 1.25, ≤ 26 long | | launch [17, 10] | 3 bars, invulnerable through windup |

Projectiles (`PROJECTILES`):

| Projectile | Count | Speed | Radius | Dmg | On hit | Life |
|---|---|---|---|---|---|---|
| shuriken (Naruto) | 3, fan 0.2 rad | 22 | 0.35 | 22 each | stun 16, pop 4 | 1.2 s |
| fireball (Sasuke) | 1 | 12 | 0.85 | 80 | launch [8, 7], explodes on floor | 1.6 s |

Field glossary for `MOVES`: `reach`/`width` are the fallback hit range when a sheet has no boxes. `yTol` is
the vertical tolerance for that fallback. `lunge` is the forward step speed during startup and active.
`hop` gives vertical speed at frame 5. `next`/`cancel` define the chain target and the first frame it's
allowed. `light`/`low`/`big`/`launcher`/`air` are behavior flags. `spark` is the impact tier
(`light | heavy | smash`), and `shake` is the camera trauma.

## Systems

### Auto combo and chains
- `Light ×4`: light1 → light2 → light3 → light4. Chains happen on **whiff or hit** once the move reaches its
  `cancel` frame, with a 10-frame input buffer.
- On hit, a light can cancel into **heavy** (the launcher), so `Light ×3 → Heavy` is the core route.
- On hit, a ground normal can cancel into the **signature special** if Special was pressed and there's 1 bar.

### Launcher and chase
- `heavy` hops and launches the victim upward ([2.4, 15.5]).
- After it connects, **Jump or Dash** (buffered 10 f) triggers `startChase()`: a super jump toward the
  victim's predicted position, with reduced gravity for 16 frames and ghost trails.

### Air combo
- In the air: airLight1 → airLight2 → airLight3 (knock-away, wall bounce), or cancel any air light into
  **airHeavy** on hit.
- Air attacks hover. Gravity is 0.35× and upward speed is damped, so the attacker stays level with the victim.

### Spike and ground bounce
- `airHeavy` spikes downward ([3, -22]). A spiked victim that hits the floor **ground-bounces** back up
  (vel.y 11, air stun 30) **once per combo**. A grounded victim of a spike gets popped up instead.
- Hard landings without a pending ground bounce do one small floor bounce (impact > 8 → 32% rebound).

### Wall bounce (ring ki barrier)
- `wallBounce` moves (light4, airLight3, vanishKick, specials) mark the victim. When a launched victim hits the
  barrier at ±8.55 faster than 5 u/s, it bounces back (55% speed, vel.y ≥ 7, air stun 32) **once per combo**,
  with a barrier flash effect.

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

### Specials and kits (ADR 0009)
Every fighter has a **kit** (`kit` in `src/characters/<id>.js`): input slots mapped to special ids in
`SPECIAL_MOVES` (`src/game/moves.js`). The behavior of each *kind* lives in `src/game/kit.js`.

- **Slots.** Tap Special = `neutral`. Hold a direction: → `forward`, ← `back`, ↑ `up`, ↓ `down`. In the
  air: `air`, or `airDown` with ↓. The stick is read when Special is released, and falls back to the stick
  at the press if it's neutral by then, so a quick tap of direction + button works. A missing slot falls
  back: forward/up/down → neutral, back → down → neutral, airDown → air. Fighters without a `kit`
  (Naruto, Sasuke) get `neutral` = `def.special` and `air` = `def.projectile + 'Air'`.
- **Kinds.**

| kind | does | examples |
|---|---|---|
| `rush` | the classic 1-bar rush below | Rasengan, Chidori |
| `shot` | a projectile from a `shot`/`throw` move; feet planted | Narukami, Reversal: Red, shuriken |
| `teleport` | hide for `hide` frames, reappear `behind` or `above`, with afterimages; optional `follow` strike | Rhythm Echo, Blink |
| `pull` | spawns a `Vortex` `dist` ahead: drags the opponent in, `tickHit` every `tick` frames, then `pop` | Lapse: Blue |
| `dive` | `rise` toward the opponent (anti-air `riseHit`), `hang`, then slam (homes in at up to ~45°); landing hits an `area` | Thunderbolt |
| `counter` | `len` frames where any hit is absorbed: a melee attacker is frozen (`held`) for `stagger` frames, a projectile just stops | Infinity |
| `mode` | a timed buff on `f.mode`: `speed` x, `damage` x, `blinkDash` (dashes become instant blinks); drains a HUD bar | Godspeed |

- Named kit moves get the special callout and an 8-frame flash. A kit move hit out of startup is
  cancelled cleanly (`kitState` cleared, the fighter made visible again).
- **Tap Special** (press and release within 14 frames) on a `rush` kit move: a 1-bar rush special. Startup forms the technique in the
  hand (hand VFX via `Effects.handTick`), active rushes forward at `rush` speed, and on hit the move skips to
  recovery.
- Starting a special triggers a 12-frame **super flash** (time freeze, 45% stage dim, callout).
- Two specials whose active frames meet within 1.6 units cause a **special clash**: an explosion, and both
  fighters take 60 dmg and get blown apart.

### Second supers (SUPER button)
- 3 bars, on the ground or in the air, out of guard or a dash, or as a cancel from a normal. Invulnerable
  through the flash and 12 frames past it.
- **Flurry** (`whirlwind`, Killua): a 34-frame flash, then a 14-frame dash (range 6.5). On contact the
  opponent is `held` and Killua teleports around them: 8 hits of 22, then a 130 slam from above with a
  ground bounce. It whiffs if the dash misses.
- **Domain** (`unlimitedVoid`, Gojo): a 50-frame flash, then the stage becomes the void
  (`src/world/voidStage.js`) and the opponent is `held` for 150 frames (~2.5 s) while Gojo combos freely.
  The domain ends early on a KO.
- Super hits carry `minScale` (0.8 for Whirlwind): combo scaling never takes them below 80 %.
- A fighter without a second super fires the beam ultimate from SUPER.

### Passives
- **Infinity** (Gojo): a projectile that comes within its radius + 1.15 units of him is stopped (ring
  effect, "INFINITY" callout at most every 2 s) whenever he isn't in hitstun, launched, down, getting up or
  held. Beams, melee and supers still hit. Chip damage doesn't apply to him while he blocks.

### Held state
- `held` (Domain, Infinity counter, flurry): the victim can't act or air-tech, drifts down slowly if
  airborne (gravity x 0.25), and counts down `heldT`. Hits during it combo normally.

### Charge ki
- **Hold Special** for 12+ frames on the ground: charge state with an aura, +1.45 ki per frame. Release,
  Guard or Jump cancels it. Heavy during charge with 3 bars fires the ultimate.

### Ultimate, super flash and beam clash
- **Heavy + Special** (5-frame buffer), 3 bars. 46-frame windup (14 if countering a beam), invulnerable through
  the windup. A 42-frame super flash with a cut-in strip (`cutin.png` or the baked eye strip), stage dim
  72%, focus camera.
- The beam travels at 34 u/s up to 26 units long, ticks 12 dmg every 5 frames, and adds 130 on the final hit.
- **Beam clash**: if both beams are live and roughly opposed (dot < -0.4) and their lengths meet, a clash
  starts. Both fighters become invulnerable and mash Light, Heavy and Special. The balance point moves with
  the mash-rate difference (plus wobble). At 96% one side wins (280 dmg + wall bounce to the loser). After 9 s
  it's a draw explosion (90 dmg each).

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
- **Damage scaling**: `dmg × max(minScale ?? 0.4, 1 − (combo−1) × 0.065) × power × modeDamage ÷ defense`
  (`modeDamage` is 1.15 in Godspeed).
- **Hitstun decay**: `decay = max(0.35, 1 − (combo−1) × 0.045)` scales grounded hitstun and air stun.
  Launch air stun is `max(6, 40 − 1.6·combo) × decay`, and a juggle hit's air stun is
  `max(5, 26 − combo) × decay`. Juggle pop shrinks with the combo (`airPop × max(0.5, 1 − 0.03·combo)`), and
  launched gravity grows (`min(1.35, 0.6 + 0.035·combo)`).
- **Combo cap**: at **22 hits** a launched victim is forced to air tech automatically.

### Air tech (air recover)
- When launched, once air stun has run out and the victim is above 0.35 units, **any button** does a backflip
  recovery (16 frames invulnerable, small backward hop). This is why long combos become escapable.

### Blocking
- Hold Guard while **facing the attacker** (block is directional). Chip damage is 10% (30% for beams) and
  never kills. Block stun is `hitstun × 0.6 (+8 for big moves)`, pushback applies, and the attacker shares 70%
  of the hitstop. Unblockable: beam-clash results, special clashes.

### Knockdown and wake-up
- A launched victim that lands goes `down` (invulnerable). Get up automatically after 40 frames, or press any
  button after 16. Get-up is 20 frames with 28 frames of invulnerability.

### KO and the destructive finish
- At 0 HP the victim is launched at least [14, 8.5], or [23, 10] by a big move, special or beam. The ring
  barrier is off: they fly off the ring onto the grass and can crash into the stands' walls (explosion,
  debris). KO slow-mo is 0.22× for 1.4 s, with a KO camera.

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

| Tier | Effects |
|---|---|
| light | small spark, `hit` sfx, shake 0.14 |
| heavy | big spark, `hitHeavy`, shake 0.4 toward the hit, zoom punch 0.45 |
| smash | burst + lines, `smash`, shake 0.6, zoom punch 0.8, white flash, slow-mo 0.4× for 0.18 s |
| special | explosion + crater + debris, impact frame, color flash, slow-mo 0.3× for 0.5 s, crowd cheer |

## CPU AI

`CpuBrain` (`src/game/ai.js`) presses buttons on its Pad. Levels are Easy, Normal and Hard
(reaction frames, guard and aggression rates, combo completion, mash speed, special/vanish/tech
probabilities). It lines up in the depth lane, then executes the bread-and-butter route by watching its
own hit confirms. `DummyBrain` drives the training dummy (stand, guard, hop, fight back).

Kits (ADR 0009): `pickSpecial` weighs each slot's kind by the situation. Shots and teleports are for
range, pull for mid range, dive against a jumper, and a mode only when it isn't active. The CPU holds the
direction through the release frame. On Hard it sometimes answers an incoming attack with a `counter`, and it
always punishes a `held` or popped-up opponent with a combo. Fighters with a kit choose specials more often
than legacy fighters, and they use SUPER at 3 bars about half the time (a domain from any range, a
flurry only within 6 units).

## Bread-and-butter route (reference)

`Light ×3 → Heavy → Jump (chase) → airLight ×2 → airHeavy (spike) → ground bounce → super dash → ...`.
Spend 1 bar on Vanish or Special to extend. End with the Ultimate for 3 bars.

## Balance process

1. Change numbers in `moves.js` or the character's `stats`, one idea per change.
2. Update the tables above.
3. Test in the training room (frame stepping), then run a CPU-vs-CPU soak (docs/TESTING.md).
4. Record notable balance changes in CHANGELOG.md under **Changed**.

## Glossary

**Startup / active / recovery**: the three phases of an attack. **Hitstop**: a freeze on hit that sells
impact. **Hitstun**: frames the victim can't act. **Launcher**: a move that pops the victim into the air.
**Juggle**: hitting an airborne victim. **Tech**: recovering from a launch. **Chip**: damage through block.
**Super flash**: a short time freeze when a special or ultimate starts. **Lane**: the depth band in which
melee can connect. **Hurtbox / hitbox**: where a fighter can be hit / where an attack hits.
