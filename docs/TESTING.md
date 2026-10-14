# Testing

Apart from the packer self-test (`npm run test:sprites`) and the music composer test (`npm run test:music`),
there's no automated test suite yet (see
[ROADMAP.md](ROADMAP.md) and [TASKS.md](TASKS.md)). Quality comes from a disciplined manual protocol,
deterministic debug helpers and CPU-vs-CPU soaks. Run the parts that match your change, and always run the
**smoke test** and `npm run build`. After any change to `tools/`, also run `npm run test:sprites`.

## Setup

```bash
npm run dev          # http://127.0.0.1:5188  (npm run dev:alt -> port 5200)
```

| URL | Use |
|---|---|
| `/` | normal boot: title, mode select, char select |
| `/?fight=naruto,sasuke&mode=solo&level=hard` | skip menus into a VS CPU match (`level` = easy, normal, hard, insane or impossible) |
| `/?fight=naruto,sasuke&mode=cpu` | spectate CPU vs CPU (defaults to `level=impossible`, showman style) |
| `/?fight=naruto,sasuke&mode=versus` | skip into a 2P match |
| `&debug` | expose console helpers (below) |
| `&art=custom` | use custom sheets even when they're incomplete (falls back per animation) |
| `&res=pixel` / `&res=hd` | force the render detail (default: `hd` when any loaded sheet has `pixelsPerUnit` >= 70, e.g. spec v2 art) |
| `&flash=pop\|tint\|rim\|classic\|off` | the victim's hit flash style (default `pop`; `classic` = the old solid white), also on `/lab.html`; with `&debug`, `window.HIT_FLASH` tunes it live |
| `&depthscale=0` | true perspective for fighter sprites (turns off the depth-normalized size, ENG-067); `0.5` = half strength |
| `&alts=0` / `&alts=1` | attack alts (ADR 0031): `0` never plays an `<anim>Alt` strip, `1` always plays it when the sheet has one (review); default alternates in the fixed pattern. Also on `/lab.html` |
| `/sprites.html` | Sprite Lab: preview every animation, prompts, import |
| `/lab.html?p1=<id>&p2=<id>` | Test lab (ADR 0018): one-tap moves and scenarios, animation viewer with boxes, time tools; `window.lab.tick()` drives it in a hidden tab |

## Debug helpers (`?debug`)

| Helper | Does |
|---|---|
| `step(n, dt=1/60)` | advance n frames deterministically. Pauses the live loop. Returns `{ state, t, f: [fighter summaries] }`. |
| `resumeLoop()` | hand control back to requestAnimationFrame |
| `press(code, frames=3)` | press a key for one poll, step `frames`, release |
| `hold(code)` / `release(code)` | hold or release a key across steps |
| `tap(codes, ms=50)` | real-time keydown/keyup of one key or a chord (async; the loop must be running) |
| `sleep(ms)`, `waitFight()` | async helpers. `waitFight` waits until the round is live. |
| `freezeCpu()` | P2's CPU stops moving and pressing (a training dummy) |
| `snap()` / `unsnap()` | copy the WebGL frame into a 2D canvas so screenshots of background tabs aren't blank |
| `scaleReport()` | per fighter: the strip on screen, its head scale vs the idle (this frame and the strip median), the packer's scale verdict, every strip the scale gate flagged, and `depthK` (the sprite's depth normalization, 1 without it) |
| `groundDemo(group = 'all')` | lay every ground-damage decal name × variant out on the ring (`'base'`, `'chakra'`, ... or one name), fully revealed with hot seams lit, for art review (ADR 0024) |
| `groundTest(force = 0.7, style = 'stone')` | one impact in the middle of the ring; returns its tier, size, parts and `fx.ground.stats()` |
| `window.game` | the live Game: `fighters`, `brains`, `cam`, `fx`, `hud`, `state`, `projectiles`, `beams` |
| `music.state()` | the music (ADR 0019): mood, seed, song, section, bar, heat, ducks, volume, scheduler running |
| `music.next()` / `music.seed(n)` | a new song (or song `n`) from the next bar; `?musicSeed=N` seeds the first one |
| `soak(n, opts)` | n CPU vs CPU matches back to back on the fixed step (ENG-012), every frame checked for NaN positions / velocities, a fighter outside the ring barrier outside a KO, a non-idle state running 600+ frames, console and uncaught errors, a stalled game. `opts`: `pairs` (`[['naruto','sasuke'], ...]`, cycled), `level`, `stuck`, `maxFrames`, `seed`. Returns the live status at once (also `window.__soak`); see **Soak** below |
| `comboStats()` | the CPU combos since the page loaded (ADR 0026): hit histogram, 12+ hit combos per match, matches with a handball (2+ wall bounces) or 3 wall bounces, in-combo vanishes per match, distinct routes, repeats of a CPU's previous route, combo-time share, round lengths, how combos ended, link success, personas, edge counts. Raw data: `comboRecs`, `comboLog` (with each decision's options in `steps`), `comboLinks`, `roundRecs` |
| `?seed=N` | fixes the match seed: the same CPU personas and combo draws (the rest of the sim still uses `Math.random`) |

Solo key codes: `KeyW/A/S/D` move, `KeyJ` light, `KeyK` heavy, `KeyL` special, `Space` jump, `ShiftLeft`
guard, `KeyO` dash.

Example: a deterministic launcher check.

```js
freezeCpu();
game.skipIntro(); step(110);      // skip the flythrough, run "ROUND 1 ... FIGHT!" (or: await waitFight())
const [p1, p2] = game.fighters;
p2.teleport(p1.pos.x + 1.1, 0, p1.pos.z);   // put the dummy in range, same depth lane
press('KeyJ', 8); press('KeyJ', 8); press('KeyJ', 10); press('KeyK', 14);
step(1);                          // inspect: p2.state should be 'launched'
press('Space', 10);               // chase
press('KeyJ', 8); press('KeyJ', 8); press('KeyK', 20);
p2.combo                          // about 7 if everything connected
```

Timings are approximate. If a step misses, print `step(1)` after each press and adjust the frame counts.

`?scaleaudit` (any page, not only `?debug`) logs once per fighter and animation, as it plays, every strip the
packer's scale gate flagged: `[sprites] killua guard: head 0.80 of idle (drift, packer scale audit)`. These are
console warnings on purpose; the console without the flag stays clean.

## Test lab (`/lab.html`, ADR 0018)

The fastest way to check a change by hand, locally or on a PR's preview link (`npm run pr -- preview`):

- **MOVES**: every move of YOU (normals, movement, defense, each directional special, SUPER, ultimate) with its frame
  data; ▶ resets the distance for that move and plays it against the dummy. Swap fighters with ⇄.
- **ANIMATIONS**: all 42 animations frame by frame on the real sheet, with hurt (blue) and hit (red) boxes, the
  frame's phase and timing, and a warning when the sheet lacks the animation (its fallback is shown). The scale
  check draws the approved idle's head size (white box) around this frame's measured head (gold, orange when the
  packer flagged the strip) and prints both numbers (TOOL-025).
- **SCENARIOS**: both fighters scripted: ultimate clash, answering an ultimate, special clash, beam clash, answering an
  energy shot, beam clash from the air (the dummy plays clashes at Normal timing; you press), throw and break, parry,
  spot dodge, air dodge, wavedash, hold Guard to tech, tech roll, timed tech off a spike, wall tech, wall-jump tech,
  tech too early (locked out) (ADR 0028), blue combo, burst, burst bait (ADR 0022), air combo,
  wall bounce, ground damage, handball (3 wall bounces) and vanish ping-pong (ADR 0026), vanish, super dash, counter
  hit (hit flash), counter stance, Whirlwind, Hollow Purple vs a projectile. A scenario that the current pair can't
  show says so (for example "needs two rush specials").
- **TOOLS**: time (1×, ½×, ¼×, ⅒×), pause (P) and frame step (.), the dummy's behavior, record YOU and replay it on the
  dummy, infinite meter, boxes, the hit flash style (POP, TINT, RIM, CLASSIC, OFF) and strength, **CPU YOU** (you play
  as the showman CPU with a combo persona, or AUTO; with DUMMY STAND every route the combo composer plans shows, and
  the readout names the persona and the route), reset. ` hides the panel; the keyboard and touch controls still play YOU.
- Scripts are timelines on the fighter's pad (`src/lab/scripts.js`), built from the kit data, so new fighters and moves
  appear without lab changes. Add a scenario to `SCENARIOS` when a new shared mechanic lands.

## Smoke test (every change)

- [ ] The page loads, and the console shows only info lines (`[sprites] ...`, and one `[decals] ...` line). **No errors.**
- [ ] Title → mode select → char select → match starts. The intro flythrough can be skipped with Enter.
- [ ] One full round plays to a KO. Round announcements, the win pose and the results screen work.
- [ ] Results screen: the match ends on a cut to the winner alone (the loser and its shadow are gone), whole and
      undimmed, facing screen-right, left of a slim panel (WINNER · P1/CPU/P2 tag, name, subtitle, REMATCH /
      CHARACTER SELECT / TITLE); no second, smaller winner sprite; the winner never mirrors while the camera
      sways. A window narrower than 3:4 gets a bottom bar with the winner above it. Rematch, character select
      and title bring both fighters back with no leftover framing shift.
- [ ] Pause (Esc/P/Start) → resume → quit to title works, and the title still works afterward.
- [ ] Training → pause → EXIT TRAINING lands on SELECT MODE with TRAINING & CONTROLS selected; Esc on the first pick of
      any character select returns to SELECT MODE on that mode.
- [ ] `npm run build` passes.

## Feature checklists

**Movement and defense**
- [ ] Run in 8 directions relative to the camera. Fighters face screen-left or screen-right only.
- [ ] Dash with a direction, double-tap dash, back dash, super dash (neutral). Super dash only once per airtime.
- [ ] Jump, air drift, land. Guard blocks only when facing the attacker. Chip never kills.
- [ ] Hold back to block (lab **Hold back to block**): the stick away from the opponent blocks their string with
      no button; with nothing coming it runs away; a shot or beam coming makes you turn and guard; a CPU holding
      back does not get it.

**Offense**
- [ ] Light ×4 auto combo. light4 wall-bounces at the barrier.
- [ ] Light ×3 → Heavy launches. Jump chases. Air L L → air Heavy spikes. The victim ground-bounces.
- [ ] Bounce budget (ADR 0026): at most 3 wall bounces (air stun 32 / 28 / 22) and 2 ground bounces (30 / 24) per
      combo; a 4th wall-bounce hit just knocks them down. Lab **Handball (3 wall bounces)**: WALL BOUNCE!, WALL BOUNCE
      ×2!, HANDBALL!, chips WALL ▸ DASH ▸ WALL ▸ VANISH ▸ WALL beside the counter, 9 hits with each of the four fighters.
      **Vanish ping-pong**: two vanishes, VANISH ×2!, a gold (true) counter.
- [ ] Combo ticker and rating (every match): techniques as chips beside the combo counter (clear of the special-name
      callout under it); when a combo ends, GREAT (10+), AMAZING (15+), LEGENDARY (20+) or STYLISH! (4+ different
      techniques) under the count. A super that grabs a reeling victim keeps counting (Killua: Light ×3 → SUPER = 12
      hits, GREAT).
- [ ] Every strike visibly **touches the body** when it connects, the spark sits on the contact point, and there
      are no hits across a visible depth gap.
- [ ] Hit flash (ENG-064): the victim pops white for 1 (light), 2 (heavy) or 3 (smash) frames, then keeps its line
      art with a bright rim and fades; never solid white through a string, a beam or a vortex. Counter hits (lab
      **Counter hit**), supers and KOs stay white a little longer; a Rasengan or Chidori pops 2 frames, and punishing a
      whiff (a missed throw, a dive's landing) is a normal hit. `?flash=classic` (or the lab chip) shows the old look.
- [ ] Vanish (1 bar) from neutral, on hit and from block.
- [ ] Special (tap) with super flash. Charge (hold) fills ki with an aura. Air projectile (½ bar).
- [ ] Power-ups (ADR 0023; lab **Charge to MAX (hold Special)** builds from an empty gauge in 230 frames): each
      fighter stays fully readable with no white or orange blob, and shows its canon cues: Naruto a red boiling
      outline, bubbles, the red eye glint from bar 2 and one chakra tail at MAX; Sasuke a dark violet outline, dark
      tongues from his back, small white Chidori arcs and the red Sharingan glint; Killua a flickering blue-white
      outline and arcs; Gojo only a faint shimmer, pebbles hanging in mid-air and the Six Eyes glint at MAX (no
      flash, rumble or crack). Budget (`?debug`, `freezeCpu()`, `hold('KeyL')`, `step(10)` × 24):
      `game.fx.items.filter(i => i.tag === 'charge' && i.life > 0).length` ≤ 16 every sample (Gojo ≤ 9), every
      charge sprite's glow ≤ 0.6, `game.fx.overlay.lines` < 0.05 between bar pulses, `overlay.flashA` ≤ 0.1 at
      MAX (0 for Gojo). While charging, `game.superFlashFor(game.fighters[1], 40, 0.5); step(40)` adds no charge
      sprites and no craters. After a release, guard, jump, hit or ultimate, `f.actor.shell.mesh.visible` is false.
      Tap **Charge to MAX** again mid-charge (a lab row resets the round, clearing every effect): the replay peaks
      at the same sprite count as the first run (`game.fighters[0].chargeFx.live` holds no handle left from before
      the reset). With the fighters apart in depth (`teleport(0, 0, ±1.5)`, `f.actor.depthK` ≠ 1) the eye glint
      stays on the drawn eyes and the chakra tail on the hips; `&depthscale=0` compares.
- [ ] Ultimate (3 bars): cut-in and the fighter's finisher. Fire yours into theirs (Gojo vs Naruto; lab:
      **Ultimate clash**, **Answer an ultimate**) → CLASH!: rings close on the target, each player's grade pops on
      their side, the bar follows the score, FINAL PUSH fills the target → OVERWHELMED! (250) or DRAW! (90 each).
      Pressing every frame scores OFF BEAT and loses. Lab **Special clash** (Naruto vs Sasuke): one ring, the closer
      press wins.
- [ ] Beam clash (ADR 0027), lab **Beam clash (energy vs energy)** in every pairing but the Naruto mirror (which says
      it can't): BEAM CLASH! with both attack names on their sides, two streams in each shot's colors (Narukami blue,
      Red red, Chidori Spear deep blue, Fireball orange) meeting halfway, or the stream meeting Naruto's Rasengan in
      front of his fist with the orb lit; the clash camera, rings and bar; the round timer holds. ~4.5 s; the winner's
      stream runs through, the loser takes 120 and wall-bounces (OVERWHELMED!); a dead heat is DRAW! (45 each).
      `game.clash.tier === 'struggle'`, `game.struggleCool` 900 after it. **Answer an energy shot**: the dummy's shot
      becomes a clash instead of a hit (you answer with a Rasengan / Chidori when you have one). **Beam clash from the
      air** (Killua, Sasuke, Gojo): the airborne owner hovers locked, then lands or falls normally. Negative: shots
      fired while one side is in hit stun or block, owners under 2.2 apart, a second exchange inside 900 frames, and a
      shuriken against any shot all cancel as before (no clash); Hollow Purple still erases shots. Regression: lab
      **Ultimate clash** is still `tier 'ultimate'`, 20 notes, 250 / 90; **Special clash** is still the one-beat
      `tier 'beat'` (`lite`).
- [ ] Kits (ADR 0009), with Killua and Gojo: Special, Special + → / ↑ / ↓ and air Special (+↓) each give the
      move in the README Fighters table. SUPER fires Whirlwind / Unlimited Void (the void stage replaces the
      arena, then comes back), and Naruto's SUPER fires his beam. Godspeed shows the mode bar and blink dashes.
      Infinity stops a projectile (callout), and the counter freezes a melee attacker.
      Debug recipe: `freezeCpu()`, set `game.fighters[0].ki = 300`, then `hold('KeyD'); press('KeyL', 3); release('KeyD')`
      and `step(1)` while logging `f.state`, `f.kitState?.kind`, and the opponent's state and HP.
- [ ] Air recover after launch (any button, or Guard held). At 22+ hits the victim auto-techs.
- [ ] KO by a big hit sends the loser out of the ring and into the stands.
- [ ] A KO'd body lies on the floor along its length: the contact shadow runs under it from head to feet, in the KO
      orbit and the victory shot, in both facings (ADR 0020). It never rests across the ring edge: within about 1 unit
      of the edge it slides off onto the grass. Debug recipe: `game.brains[1] = null`, `game.fighters[1].hp = 1`, a
      light attack, `step(1)` until `game.fighters[1].state === 'down'`; for the edge, put the victim about 7.7 units
      from the edge it is hit toward (a light KO carries it about 7.7 units).
- [ ] A KO during a flurry super (Speed of Lightning, Shadow Clone Barrage) or the Four-Tails mauling sends the body
      flying on its KO launch, with no hover.

**Ground damage (ADR 0024; lab **Ground damage**, `groundDemo()`, `groundTest()`)**
- [ ] Tiers: a launcher's fall cracks (crack_s / crack), an air heavy spike's ground bounce leaves a crater_big with
      rim chunks and floor slabs, a soft hop leaves nothing. `groundTest(0.2 / 0.45 / 0.7 / 1.0 / 1.4)` gives the five
      tiers, 1.4 to 7.6 units across; ten `groundTest(0.7, 'stone', { noMerge: true })` never repeat a variant back to
      back and cover every rotation.
- [ ] Styles: Rasengan scours a spiral, Chidori / Narukami / Thunderbolt leave lightning burns whose seams glow in the
      move's color and cool in about a second, Great Fireball scorches, Kirin blasts a glassy pit with a starburst,
      Amaterasu leaves black flame (and keeps marking under a burning victim), Lapse: Blue an implosion, Reversal: Red
      gouges, Hollow Purple a continuous trench (clipped at the ring edge, a furrow in the grass, nothing floating).
- [ ] Merge: the Four-Tails maul grows one claw crater over its slams; its roar fans a scorch toward the victim. A
      super jump (chase) right after the spike's ground bounce leaves the crater_big where it is (no second big impact).
- [ ] Impact debt: a special that hits an airborne victim makes its crater where they land, not under the hit.
- [ ] Off-ring KO: a dirt crater in the grass at grass height; a KO into the stands leaves a hole in the brick wall
      (body-shaped when fast) until the next round; knockdown and KO slides leave skids.
- [ ] Wall bounce (lab **Wall bounce**): a barrier crack at the impact, flicker, dissolve and falling shards by ~2.8 s.
- [ ] Charge: holding Special grows exactly one decal under the fighter (`game.fx.ground.decals.filter((d) => d.key ===
      'charge0').length === 1`): crack_s, crack, fracture_ring, then the fighter's fracture at MAX POWER, starting at
      the power-up's crack level (Naruto bar 2, Sasuke MAX). Killua's and Gojo's floor stays clean.
- [ ] Super flash: decals dim with the floor; a fighter standing on a crater keeps its sun shadow and blob shadow.
- [ ] Expiry: a crack dissolves pixel by pixel (~0.6 s), never a pop. The ring is clean at every round start.
- [ ] Training: cyan holo outlines, no chunks or slabs. Unlimited Void hides the arena's decals and brings them back.

**Input and UI**
- [ ] A gamepad doesn't steer until one of its buttons is pressed. Menus work with the D-pad, A and B.
- [ ] Controls panel: keyboard / PlayStation / Xbox layouts, a toggle between them, live input highlights.
- [ ] Rebinding: rebind a key and a pad button, reload the page, and the bindings persist. Reset restores defaults.
- [ ] Training room: the character responds to live input, the dummy modes work, health refills, there's no
      timer, and input history shows.
- [ ] Mute: `M` and the on-screen toggle (top corner, unobtrusive) both mute and unmute, and stay in sync.
- [ ] HUD: health trail, ki bars, burst gems, combo counter (gold, blue after a gap), technique banners, callouts,
      timer.

**Audio and music (ADR 0019)**
- [ ] `npm run test:music` passes (composer: determinism, variety, ranges, voice leading, heat gates).
- [ ] Flow: title → mode (menu mood; repeated confirms don't restart it) → match (crossfade to battle, no click) →
      pause (quieter, muffled; `music.state().ducks` = `['pause']`) → resume → results (crossfade to menu) → rematch
      (battle) → quit to title. Training plays the `training` mood (80 bpm).
- [ ] Ducks: a rhythm clash (lab **Ultimate clash**) shows `clash` until it ends; a KO shows `ko` until the win pose;
      Unlimited Void shows `domain`; after every round and match the list is empty.
- [ ] MUSIC row in both pause menus (training: right before EXIT TRAINING): ◀ ▶ in 10% steps, a tap steps up and
      wraps to OFF; the value survives a reload (`gcd.musicVol`); at OFF `music.state().scheduler` turns false.
- [ ] Muted (`M`): no music nodes are created while muted; the pad comes back on unmute.
- [ ] Stall: a 1.5 s busy loop in the console during a fight plays no burst of notes afterward.
- [ ] Offline render (paste a harness that builds `new MusicPlayer({ ctx: offlineCtx, music, noiseBuf, muted,
      musicVolume })` and calls `tick()` from `ctx.suspend()` points): no NaN, peaks under -10 dBFS at 100%, RMS
      about -36 dBFS at the default 70%, smooth levels across crossfades and song seams.

**Art loading**
- [ ] Without `public/characters/<id>/`: the console says `baked <id> from 3D`.
- [ ] With a complete custom sheet: the console says `using custom sheet for <id>`, and the portrait and cut-in
      use the PNGs.
- [ ] With an incomplete sheet: the baked placeholder is used unless `?art=custom` is set. Missing anims fall back.
- [ ] Custom VFX atlas: present → used; any missing effect → procedural.
- [ ] A corrupt `anims.json` or missing `sheet.png` falls back to the bake with a warning and no crash.
- [ ] A spec v2 custom fighter next to a baked placeholder: both stand about the same world height. The
      placeholder still looks chibi; that's expected until ENG-016.
- [ ] With a hi-res sheet loaded the renderer is in `hd` detail (sharper image); `?res=pixel` forces the
      chunky mode back for comparison.
- [ ] Depth-normalized size (ENG-067): with `?debug`, `freezeCpu()`, `const [p1, p2] = game.fighters`, put the
      fighters on a 45° diagonal (`p1.teleport(-1.41, 0, 1.41); p2.teleport(1.41, 0, -1.41); step(150)`) or lined
      up in depth (`teleport(0, 0, ±1.5)`). Both stand the same height on screen (a screenshot), and
      `game.fighters.map((f) => f.actor.depthK)` splits around 1 (about 0.95/1.05 on the diagonal, 0.90/1.10 lined
      up; clamp 0.82..1.22). With `&depthscale=0` the nearer fighter is 11-23% bigger. Fighters level in depth keep
      depthK 1 (no change from true perspective). A teleport of one fighter changes both sizes together, never one
      alone. Ghost trails and the `?boxes` outlines match the scaled body, and a held Rasengan or Chidori sits on the
      drawn palm of either fighter (its size scales with the body). `game.cam.set('focus', p1)` eases
      depthK back to 1 over about half a second (no pop); ko and victory too.

### Mobile (landscape touch)

Emulate a phone in the browser dev tools (landscape, width under 768 px so touch is emulated, e.g. 740 x 360),
or add `?touch=1` on desktop to force the touch UI (`?touch=0` hides it).

- [ ] Portrait shows the rotate screen; landscape shows the game.
- [ ] Title says TAP TO START; every menu works by tapping; the BACK button appears wherever Esc would work.
- [ ] Character select: tap fighters; difficulty arrows change the level, tapping the level starts the fight.
- [ ] Tap skips the intro. Touch controls appear only during the fight / training, not in menus or pause.
- [ ] Joystick moves (double flick dashes); every button acts; sliding a finger between buttons switches them;
      ULT fires the ultimate with 3 bars, VANISH with 1; both dim without enough ki.
- [ ] The fight stays framed left of / above the button cluster. Pause button pauses; BACK resumes.
- [ ] Results (740 x 360): panel on the right, the whole winner on the left, no touch buttons, no BACK button;
      tapping REMATCH / CHARACTER SELECT / TITLE works.
- [ ] Training: the panel starts collapsed; the TOUCH tab lists the controls and changes the button size.
- [ ] Desktop is unchanged: keyboard hint bar, no touch UI, no rotate screen.

## Character checklist

Run this for every new or re-packed character (`?fight=<id>,<other>&art=custom&debug`):

- [ ] All 38 animations (42 with the kit animations) play (or fall back sensibly). No frame pops out of the cell or gets clipped.
- [ ] The feet stay planted between idle, run and attacks (pivot consistent), with no jitter in loops.
- [ ] Body height matches the other fighters (or its ADR 0010 `standingBodyPx`), and design and palette are
      consistent across animations.
- [ ] Scale gate: `node tools/pack-sprites.mjs <id> --quantize 48` exits 0 (unapproved strips are strict; every `~`
      finding on an approved strip is a known, briefed ART-SCALE item; `--strict-scale` exits 0 only once all pass),
      `npm run scale -- <id>` heads sheet looked at, and `?scaleaudit` in a real match logs only the strips the packer
      flagged.
- [ ] Proportions stay at about 6.5 heads (spec v2) in every animation, with no chibi frames, and every
      packed animation comes from its approved version in `art/REVIEW.md` (the packer report names the
      `_vNN` file it used).
- [ ] Active frames show the limb fully extended toward screen-right (mirrored when facing left).
- [ ] Hitboxes cover only the striking limb, and hurtboxes cover the body without huge empty margins.
- [ ] The special's hand effect lines up with the drawn hand. The projectile leaves from the hand.
- [ ] The portrait (HUD), cut-in (ultimate) and select art show correctly.
- [ ] A mirror match (same character on both sides) is tinted and readable.

## IMPOSSIBLE CPU and defensive options (ADR 0014)

Run after changes to `aiMaster.js`, `DEFENSE`, hit boxes or juggle physics. Open `/?fight=naruto,sasuke&debug`.

1. **Mechanics by hand** (`freezeCpu()` first): Guard + tap S → `dodge` with 13 invulnerable frames; Space then
   Shift + D → `wavedash` slide (~1.6 units); jump, wait, Shift → `airDodge`; with P2 scripted to Heavy, press
   Guard 2-5 frames before its frame 12 → "PARRY!" and P2 `held`; 10 frames early → a normal block.
2. **Honest-dummy combo lab**: replace P2's brain with one that stands until hit, then holds Guard for 45 frames and
   presses Jump every other frame while launched or down (so only true combos count). Log P1's moves while
   `b.combo > 0`. Expect meterless routes around 230-295 and no route ending in a blocked special.
3. **Air-string link check**: P1 IMPOSSIBLE vs a frozen P2, 3 launcher routes per pairing, all 16 pairings:
   `airLight2` and `airHeavy` should connect in at least 90 % of attempts.
4. **Defense check**: script P1 to throw Heavy / Rasengan at the CPU from 1.1 / 3.0 units. Expect a mix of
   parry, spot dodge and block, no clean hits, and a punish after parries and blocked Heavies.
5. **CPU vs CPU**: the soak below with `mode=cpu` (both IMPOSSIBLE, showman, ADR 0016). Rounds should end by KO
   in about 30-60 s, with varied combos from the combo composer (ADR 0026, the targets in the soak section), and no
   stuck states. Over a match
   each fighter should show most of its kit and at least one three-bar move, plus parries, spot dodges, air
   dodges ("DODGE!" / "AIR DODGE!" callouts), wavedashes and charging. After a match,
   `game.brains.map((b) => b.show.unseen())` lists what each CPU never used; expect 0-5 tools each (fewer
   for the winner, since the loser has less time; `vanishWar` needs a vanish to answer).
   `game.brains.map((b) => b.show.report())` gives each CPU's defense: see the targets in "CPU defense showcase" below. With Naruto and / or Gojo on both sides (ultimates that clash),
   most matches should show at least one rhythm clash (ENG-056); `clash` in `unseen()` means none happened.
   **Every match shows a BEAM CLASH** (ADR 0027) except the Naruto mirror (`beamClash` in `unseen()` means none
   happened): log `game.clash?.tier === 'struggle'` starts and `game.director.beam` (`due` in frames, `cues`, `done`)
   per match. Pass: at least 95 % of matches that can have one do, the first one lands at varied times (the
   director's due is random), draws are at most ~20 %, and rounds still end by KO. CPU vs CPU can be watched at any
   level and Easy / Normal / Hard (`CpuBrain`) follow the director's cue too, so repeat it with `&level=easy`,
   `normal` and `hard`.
6. **Throws (ADR 0015)**: J + K at 0.9 units grabs a guarding P2 (80 damage, wall-bounce launch); P2 pressing
   Light + Heavy within 12 frames of the grab breaks it ("THROW BREAK", no damage); from 1.8 units it whiffs for ~32
   frames; a P2 jab started first beats it; a P2 spot dodge beats it. Light ×3 → Special (Rasengan / Chidori /
   → Rasenshuriken) against a dummy that guards whenever it can: never blocked. Guard-only dummy vs IMPOSSIBLE:
   throws land within 50 s.

## Combo escape, the blue counter and callouts (ADR 0022)

Run after changes to `DEFENSE.tech` / `DEFENSE.burst`, hit stun or juggle physics, `TAGS` or the CPUs' escape code.
The lab scenarios **Hold Guard to tech**, **Tech roll**, **Blue combo**, **Burst** and **Burst bait** show each part;
by hand, `/?fight=naruto,sasuke&mode=solo&debug`, `freezeCpu()`, then give P2 a scripted brain (for example
`game.brains[1].update = function () { const p = this.f.pad; p.tick(); p.set('guard', this.f.state === 'launched'); }`).

1. **True route**: Light ×3 → Heavy → Jump → air L L → air Heavy on a P2 that never techs: `b.comboBlue` stays
   false and `b.lastGap` is 0 on every hit; the counter stays gold.
2. **Blue**: Heavy, then super dash in ~45 frames later: the second hit has `lastGap` > 0, the counter turns blue
   with a pop, and the training room shows `GAP nF`.
3. **Hold Guard**: P2 holds Guard while launched: `airRecover` on the first frame air stun is 0 above 0.35 units,
   TECH! on P2's side, never a blue hit. Hold a direction too: toward / ↑ / ↓ change the hop.
4. **Tech roll**: Light ×4 (away from the wall) on a P2 holding Guard: `techRoll` instead of `down`, TECH ROLL!.
   After an air Heavy spike, a throw or a super finish: `down` (hard knockdown).
5. **Multi-hit lock**: a beam or a Rasenshuriken / Blue vortex on an airborne P2 at 15+ hits holding Guard: no tech
   until the move ends, no blue.
6. **Burst**: P2 with 200 ki presses Guard + Special during your string: BURST!, an 8 frame freeze, the shockwave
   launches you (10 damage), P2's ki −200, its gem goes dark, the combo ends. Refused when held (Domain, flurry,
   maul), grabbed, during your beam or three-bar move, under 200 ki, and a second time in the round. Not a burst:
   P2 charging ki (Special held) gets hit, then presses Guard (a tech, no BURST!, ki and gem kept). P2 bursting on
   the frame your hit connects: the burst wins (P2 doesn't land back in `hitstun`).
7. **Burst bait**: stop after a hit and hold Guard: the burst is blocked, P2 recovers for 30 frames, your punish
   shows PUNISH!.
8. **Callouts**: parry → PARRY! (big); spot dodge a heavy → DODGE!; spot dodge a throw → DODGE!; air dodge a super
   dash → AIR DODGE!; throw break → THROW BREAK; wavedash twice within 6 s → one WAVEDASH; a fourth banner pushes
   the oldest out; a special name right after a PARRY! leaves the banner alone; in training the left stack clears the
   input history.
9. **Training dummy**: DUMMY TECH never / hold / random / timed and DUMMY BURST off / on in the panel; the defaults keep the
   old dummy (GUARD mode with tech NEVER lets go of Guard for the whole launch: no TECH!, no TECH ROLL!).
10. **CPU**: the soak below (`mode=cpu`, and IMPOSSIBLE vs Hard) shows TECH! and TECH ROLL! every match and BURST!
    in most, never more than one burst per fighter per round (`burstUsed` ≤ 1), blue counters now and then, and
    rounds still ending by KO in the usual time.

## Tech poses (ADR 0030)

Run after changes to `src/game/techAnim.js`, `animPhase.js`, the tech states in `Fighter`, `DEFENSE` `animPhases`, the
packer's `TECH_POSES` / wall anchoring or the scale gate's `lowConfPhases`:

- [ ] `npm run test:anims`: the guide entries and fallbacks, every beat boundary, the frames a whole tech state shows
      (a back roll reversed), the wall facing at yaw -0.42 / 0 / 0.42, the wall line and body centre landing on the
      fighter (`wallShift`, either facing), reused result objects and `SheetAsset` fallbacks.
- [ ] `npm run test:sprites`: wall-anchored frames on the wall line x 8 with `wallLine` and `wallAnchor`, a full
      push-off fitting the cell, the thin-contact and size-band warnings, `partial` / `manual`, the recorded audit
      keeping every unread frame, no hit boxes on tech frames.
- [ ] Without the strips (today's sheets): `/lab.html` SCENARIOS "Timed tech off a spike", "Wall tech", "Wall-jump tech"
      and "Tech roll" show exactly the old poses (`land`, `land` then `airRecover`, `land` then `jumpUp`, `airRecover`).
- [ ] With a strip (a packed candidate, or stand-in strips injected into `game.fighters[1].actor.asset.meta.animations`):
      the same scenarios play it on the beats (tech in place 4/5/5/4 game frames per art frame; wall tech 3,3 | 4 | 4,4;
      the "Tech roll" scenario's back roll plays the tumble backward, and a cross-up mid-roll never flips it; the wall
      jump shows the push-off 4 frames, all of them turned away from the wall, then `jumpUp`, and an air attack out of
      it never brings the push-off back). On a side wall the strip's wall line sits on the barrier; a tech off a front
      or back barrier wall keeps facing the opponent and is re-centred by `wallAnchor`.
- [ ] `?art=procedural`: the baked placeholder has all three strips; the console is clean.

## Attack alts (ADR 0031)

Run after changes to `src/game/animAlts.js`, the move / hit-reaction animation hooks in `Fighter` (`startMove`,
`updateAttack`, `takeHit`), the alt entries of the animation contract or the packer's `altCheck`:

- [ ] `npm run test:alts`: the 11 guide entries and fallbacks, balance over 64 uses, never three of one version in a
      row, the light string mixing versions, a missing alt keeping the base (counter untouched), `?alts` modes, and
      `SheetAsset.has` never counting a FALLBACK.
- [ ] `npm run test:sprites`: an alt inheriting its base's frames, phases, timing and body height; warnings for another
      frame count or phases, a strike that falls short, the low's alt hitting high, an alt packed without its base; a
      matching alt, a hit reaction alt and an alt with no art stay silent.
- [ ] Without alt art (today's sheets): in a real match `light1`-`light4` and `heavy` play their base strips,
      `game.fighters[0].animUses` stays `{}`, the console is clean. `/lab.html` SCENARIOS "Attack alts (repeat a
      string)" plays light ×3 three times and two heavies, all base strips.
- [ ] With alts (a packed candidate, or stand-ins injected, e.g.
      `a = game.fighters[0].asset.meta.animations; a.light1Alt = { ...a.light2 }`): the same scenario alternates
      `light1` / `light1Alt` in the Thue-Morse pattern (light1: base, alt, base, base, alt, alt, base, base), the alt
      lands its hits from its own boxes on the base's phases, the dummy's hit reactions alternate too, and `&alts=1` /
      `&alts=0` show only alts / only bases. Check each alt's contact in the lab viewer with boxes on.

## Timed impact tech (ADR 0028)

Run after changes to `DEFENSE.impactTech`, `Fighter.readTechPress` / `tryImpactTech` / `startImpactTech`, landing or
barrier physics, the `noTech` flags, `aiTech.js` or the composer's `techRisk`. The lab scenarios **Timed tech off a
spike**, **Wall tech**, **Wall-jump tech** and **Tech too early (locked out)** show each part. Frame-exact checks by
hand: `/?fight=naruto,sasuke&mode=solo&level=hard&debug`, step until the fight, then put P2 in a known fall and give
it a scripted brain that presses Guard on chosen frames:

```js
const f = game.fighters[1]; let k = 0, at = new Set([16]);           // brain frame(s) that press Guard
game.brains[1] = { update() { const p = f.pad; p.tick(); p.setMove(0, 0); p.set('guard', at.has(k++)); } };
f.reset(0, 0); f.setState('launched'); f.pos.set(0, 3, 0); f.vel.set(0, 0, 0); f.air = true; f.airStun = 300;
f.combo = 3; f.comboFrom = f.pad.frame; f.gb = true; f.hardKD = true; k = 0;
for (let i = 0; i < 40; i++) step(1);                                  // the floor is 28 live frames away
f.state;                                                               // 'impactTech' (techKind 'inPlace')
```

A press on brain frame n is stamped on live frame n + 1, so with the impact on live frame 28:

1. **Window**: a press 11 live frames before the impact (brain frame 16) techs (TECH!, `impactTech`, combo 0, no
   ground bounce); 0 frames before (27) techs; 12 before (15) doesn't (GROUND BOUNCE!, then `down`); after the
   impact doesn't.
2. **Lockout**: presses 12 and 7 frames before (15 and 20): no tech, the second press is ignored (`itTry` keeps the
   first). Lab: **Tech too early** ends in `down`.
3. **Hold**: Guard held from before the combo (`comboFrom` after the press): no timed tech; a soft landing still tech
   rolls (ADR 0022) and a ground bounce still bounces.
4. **Hitstop and freezes**: P2 at y 0.4 with `hitstop = 10` (the floor 11 live frames away): a press on brain frame 2,
   inside the hitstop, techs (it counts from the first live frame). The same with `game.freeze = 8` from frame 3 and
   the press on frame 6.
5. **Super finishes**: `noTech` on the last hit (flurry final, Amaterasu, Kirin, Four-Tails final, Hollow Purple, the
   beam's final hit, an ultimate clash result): a press 5 frames before the floor does nothing. DUMMY TECH TIMED never
   techs them.
6. **Wall**: P2 at x 5, y 2, `vel (12, 2, 0)`, `wb = true` (the barrier 18 live frames away): a press 5 before techs
   (WALL TECH!, `impactTech` / `wall`, clings 6 f, kicks off, lands), `wbCount` stays 0 and no WALL BOUNCE!. With
   `my = 1` held: the wall jump, `air` at once (`airAttack` false, y about 3.4 at the top).
7. **Floor roll**: stick ← / → (`mx` ±1) at the impact: `roll`, about 1 unit, then `idle`.
8. **Forecast**: `(await import('/src/game/aiTech.js')).impactAhead(f).k` in those setups is 28 / 18 / 11, the frame the
   engine hits.
9. **CPU**: the soak below with `mode=cpu` shows TECH! and WALL TECH! every match; IMPOSSIBLE / showman tech about
   60-70 % of the techable impacts they meet (`techStats`), Hard about a third, and the composer's `comboLog` records
   `groundTech` / `wallTech` as end reasons.

## CPU defense showcase (ADR 0025)

Run after changes to `aiMaster.js` threats or answers, `aiDefense.js`, `DEF_PERSONAS` or `DEF_KNOBS`. The trials use
`/?fight=naruto,sasuke&mode=cpu&debug`, frame stepping (`step(n)`), a fresh showman on P1
(`new (game.brains[0].constructor)(game.fighters[0], 'showman')`) and the lab's `ScriptBrain` on P2
(`(await import('/src/lab/scripts.js')).ScriptBrain`), 3 units apart, P1 at 200 ki.

1. **Vanish**: P2 presses Guard + Special. Over 40 trials every answer P1 picks works: parry, spot dodge, counter,
   air dodge, and the vanish war (P1 vanishes too, P2's kick whiffs, P1's lands). Only a P1 caught in its own dash or
   attack gets hit. Same with Killua's Rhythm Echo (P2 → Special) and P1 Naruto: counter, parry, dodge, block all hold.
2. **Retry**: P2 (Killua) fires Narukami from 7 units while P1 back-dashes: the answer picked during the dash is
   `retry`, and P1 parries or dodges once the dash ends.
3. **Late-drawn strikes**: P2 Sasuke's raw Chidori from 1.1 / 2 / 3 units, or any heavy at 1.1, against a P1 forced
   to parry: parried every time (`reachT` times it to the frame the strike reaches out).
4. **Showcase soak**: 24+ CPU vs CPU matches over all pairings and a mirror (the soak below, `mode=cpu`). Per
   fighter-match: parries 3-6, spot dodges 2-5, visible air dodges or escapes 3-6, defensive wavedashes or backsteps
   2-5 (`report().done`: `wavedash`, `backstep`, `jumpOut` and the `hitstun:` / `getup:` / `block:` reversals); a
   counter-vanish (a fighter enters `vanish` while the other is vanishing or in `vanishKick`) in about half the
   matches; a parry exchange (two parries by alternating sides within 180 frames) in 40 %+; rounds averaging 40-50 s;
   no single answer above 50 % of a fighter's `defLog` picks in nearly every fighter-match; personas vary.
5. **Fairness ladder** (CPU vs CPU, not spectating: `game.brains = [makeBrain(f0, a), makeBrain(f1, b)]`, 8 matches
   each, sides alternating): Hard > Easy, Hard > Normal, Insane > Hard, Impossible > Insane within one win of ADR
   0025's log. P1 scripted raw Heavy ×20 at 1.1 units: Easy is hit 60 %+, Normal 35 %+; with a persona, Easy-Hard's
   `L` technique rates sum to the level's (`LEVELS`) when not spectating.
6. **BACKSTEP**: the lab scenario **Backstep** (the dummy heavies, you back dash at frame 6) shows BACKSTEP on your side.

## Soak (CPU vs CPU)

Use this for combat, AI, physics and performance changes. It catches stuck states, NaNs, ring-outs and rare crashes.

1. Open `/?fight=naruto,sasuke&mode=cpu&debug` (a page with `?debug`; the helper starts its own matches).
2. Run `soak(n, opts)` without awaiting it. It plays n matches (intro skipped) on the fixed step, one `game.frame` per
   frame, and checks every frame:

   | Violation | Means |
   |---|---|
   | `nan` | a position or velocity is not finite |
   | `ring` | a fighter that is not KO'd stands more than 0.01 past `ARENA_LIMIT` (one entry per excursion, `over` = the worst overshoot) |
   | `stuck` | a state other than idle / run / guard in a live round for 600+ frames of its own time (`opts.stuck`; hitstop and super flashes don't count) |
   | `error` | `console.error` or an uncaught error / rejection |
   | `timeout`, `stall`, `exception` | a match over `opts.maxFrames` (40000), `game.frameNo` not advancing, or the loop itself threw |

   Options: `pairs` (default: the page's pairing), `level` (`'impossible'`), `stuck`, `maxFrames`, `seed`. `Math.random`
   is reseeded per match (`seed + match index`, `perMatch[i].seed`): the same seed gives the same CPU personas and a
   similar match, not a frame-exact replay (wall-clock effects and leftovers of earlier matches still differ). A
   violation's frame, round, state and position say where to look; reproduce it by forcing the situation (the ENG-075
   check started both fighters at the wall with full ki by wrapping `game.resetRound`).
3. The call returns the live status at once and keeps running between yields: poll `window.__soak`
   (`done`, `n`, `frame`, `violations`, `finished`) with short calls (a browser tool call times out after ~45 s,
   so never `await` the whole soak there; in code, `await __soak.promise`). When `__soak.finished`, read
   `__soak.summary`: `pass`, `matches`, `winners`, `rounds`, `frames`, `violationCounts`, `violations` (match, frame in
   that match, round, fighter, side, state/move, position), and `perMatch` (pair, seed, winner, rounds, wins, seconds,
   `clashes` by tier, `maxOver` = how far past `ARENA_LIMIT` anyone got). `comboStats()` then has the combo numbers.

```js
soak(10, { pairs: [['naruto','sasuke'], ['killua','gojo'], ['gojo','naruto'], ['sasuke','killua'], ['naruto','killua'],
  ['gojo','sasuke'], ['killua','naruto'], ['sasuke','gojo'], ['naruto','gojo'], ['killua','sasuke']] });
// ... later, in short calls:
JSON.stringify({ done: __soak.done, v: __soak.violations, fin: __soak.finished });
JSON.stringify(__soak.summary.violationCounts);
```

4. Pass criteria: `summary.pass` (no violations, all n matches finished), rounds end by KO or time, and the frame rate
   stays smooth. Run **at least 3 full matches** per change, more for AI changes; switch characters and include
   mirrors (a Gojo mirror caught the ENG-075 clash push-back). A hidden pane runs the soak in a few seconds per match;
   a visible one renders every frame and is several times slower. The soak leaves the game in manual-step mode:
   `resumeLoop()` hands it back.

**Combo composer targets** (ADR 0026, after changes to `aiCombo.js`, `JUGGLE`, hit boxes or MasterBrain), over 10+
matches with all four fighters:

| `comboStats()` | target | 2026-10-10 (4 soaks, 10-12 matches each) | after the review fixes (20 matches) |
|---|---|---|---|
| `links.connected` (planned links that landed) | ≥ 85 % | 98-99 % | 99 % |
| `blue` (combos with a gap) | ~0 (the composer only plans true links) | 0-1 % | 0 % |
| `endedBy.tech` + `techRoll` share | < 15 % | 12-17 % (bursts end another 6-9 %) | 10 % (12 % with the wait / three-bar checks off) |
| `handballMatches` (a combo with 2+ wall bounces) | ≥ 50 % of matches | 60-75 % | 70 % |
| `vanishPerMatch` (in-combo vanishes) | ≥ 1 | 2.7-4.3 | 3.3 |
| `distinctRoutes` / `repeatPrev` | ≥ 80 % / ~0 | 85-91 % / 0 | 82 % / 1 % |
| `comboShare` (fight time in combos) | 35-55 % | 47-53 % | 49 % |
| `rounds.avg` | 30-75 s | 33-36 s (shortest 20-24 s) | 34 s (shortest 21 s) |
| `long12PerMatch` (combos of 12+ hits) | ≥ 1 per match (design goal) | 0.25-0.33 (longest 16) | 0.15 (longest 16): **not met**, see below |

**Open gap (ENG-072, needs a design decision):** the governor draws a highlight tier about 0.8 times per CPU per
round, but highlight-tier combos average 5 hits, so "one highlight per round per CPU" (about 4.6 per match) is met at
0.15 combos of 12+ hits per match.
`comboLog[i].steps` shows why: most highlights stop at an `end` that was the only edge left, typically after a vanish
kick with 1-8 frames of stun and no super dash or bar to follow it. Without meter a true combo tops out near 10-11 hits
under the current decay (ADR 0022); 12+ comes from a grind special (Rasenshuriken, Lapse: Blue), a vanish chain or a
super carried on. Options for the user and the coordinator: softer hitstun decay after a bounce or a vanish (`JUGGLE`,
affects players), a highlight tier that reserves bars before it can be drawn (CPU only), or more ki for the showman
(the super dash refund on a wall bounce was already rejected).

`comboLog[i].steps` lists each decision of a combo with the edges that were possible and their weights, which is the
place to start when a route ends early.

## Balance round-robin (CPU vs CPU)

Use it after any kit, stat or AI change, and when a fighter joins (ADR 0011). It plays every ordered pair
(both sides) with Hard CPUs on both sides, by frame stepping (works while the pane is hidden; ~110 s of game
per match, ~6 min of real time for 72 matches).

1. Open `/?fight=naruto,sasuke&mode=solo&level=hard&debug`.
2. Paste, then call `rrStep(30000)` repeatedly (each call ~20 s) until it returns `'done'`:

```js
const { CpuBrain } = await import('/src/game/ai.js');
const ids = ['naruto', 'sasuke', 'killua', 'gojo'];
window.RR = { queue: [], results: [], cur: null };
for (let k = 0; k < 6; k++) for (const a of ids) for (const b of ids) if (a !== b) RR.queue.push([a, b]);
window.rrStep = (budget) => {
  for (let used = 0; used < budget; used++) {
    if (!RR.cur) {
      const pair = RR.queue.shift(); if (!pair) return 'done';
      game.startMatch({ mode: 'solo', p1: pair[0], p2: pair[1], level: 'hard' });
      game.input.bindings = [];
      game.brains = game.fighters.map((f) => new CpuBrain(f, 'hard'));
      RR.cur = { pair, frames: 0 };
    }
    step(1); RR.cur.frames++;
    if (game.state === 'results' || RR.cur.frames > 45000) {
      const [a, b] = game.fighters;
      RR.results.push({ p1: RR.cur.pair[0], p2: RR.cur.pair[1], winner: a.wins > b.wins ? a.def.id : b.wins > a.wins ? b.def.id : 'draw' });
      RR.cur = null;
    }
  }
  return `${RR.results.length} done`;
};
```

3. Win rate per fighter = wins / matches played. **Target: every fighter within 40-60 %**, and P1-side wins near
   50 % (a big side bias is an engine bug, not balance). One run of 18 matches per fighter swings ±12 %, so pool
   several runs before tuning, change one or two numbers at a time, and log every run in ADR 0011's balance log.
4. The CPU is a stand-in for players: also check that each fighter's kit moves get used (count `kitState` /
   named moves), and trust hands-on play over CPU numbers when they disagree.

## Performance budget

| Metric | Budget | How to check |
|---|---|---|
| Frame rate | **60 fps at 1080p** during the heaviest moments (ultimate clash + auras + debris) on a mid-range laptop GPU | DevTools Performance or an FPS meter. Watch the clash and KO crash. |
| Fixed-step catch-up | the accumulator should rarely hit the 6-step cap | add a temporary counter in debug, then remove it |
| Placeholder bake | **< 1 s per character** | console: `[sprites] baked <id> from 3D in N ms` |
| Custom sheet size | ≤ 4096 × 4096 px (spec v2: 16 columns × 256 px = 4096 px wide; 42 animations = 175 frames = 11 rows = 2816 px tall). A GPU with a 2048 texture limit gets a downscaled sheet and a three.js warning. | packer report |
| VFX atlas | ≤ 2048 × 2048 px | packer report |
| Live effects | no unbounded growth in `game.fx.items`, ghosts or decals over a soak | check the array lengths before and after a soak |
| Ground damage | ≤ 40 floor decal meshes, ≤ 8 permanent marks, ≤ 128 rim chunks, ≤ 20 slabs, ≤ 4 barrier cracks and 4 wall holes, ≤ 4 decal pages per match | `game.fx.ground.stats()` during a soak (track the maximum of each) |
| Boot | menu interactive in < 3 s with 2 characters on a warm cache | stopwatch or Performance panel |

When adding characters, remember the bake is per roster entry at boot. Past ~6 placeholder characters,
consider lazy baking on select (a roadmap item).

## Before a release

- [ ] All checklists above pass on Chrome and Firefox (Edge spot check).
- [ ] Soak: 3 matches per character pairing.
- [ ] `npm run build && npm run preview`, then a smoke test against the built output.
- [ ] CHANGELOG, version and tag per [CONTRIBUTING.md](CONTRIBUTING.md#versioning-and-releases).
