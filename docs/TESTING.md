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
| `window.game` | the live Game: `fighters`, `brains`, `cam`, `fx`, `hud`, `state`, `projectiles`, `beams` |
| `music.state()` | the music (ADR 0019): mood, seed, song, section, bar, heat, ducks, volume, scheduler running |
| `music.next()` / `music.seed(n)` | a new song (or song `n`) from the next bar; `?musicSeed=N` seeds the first one |

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

## Test lab (`/lab.html`, ADR 0018)

The fastest way to check a change by hand, locally or on a PR's preview link (`npm run pr -- preview`):

- **MOVES**: every move of YOU (normals, movement, defense, each directional special, SUPER, ultimate) with its frame
  data; ▶ resets the distance for that move and plays it against the dummy. Swap fighters with ⇄.
- **ANIMATIONS**: all 42 animations frame by frame on the real sheet, with hurt (blue) and hit (red) boxes, the
  frame's phase and timing, and a warning when the sheet lacks the animation (its fallback is shown).
- **SCENARIOS**: both fighters scripted: ultimate clash, answering an ultimate, special clash (the dummy plays clashes at
  Normal timing; you press), throw and break, parry, spot dodge, air dodge,
  wavedash, hold Guard to tech, tech roll, blue combo, burst, burst bait (ADR 0022), air combo, wall bounce, vanish,
  super dash, counter hit (hit flash), counter stance, Whirlwind, Hollow Purple vs a projectile. A
  scenario that the current pair can't show says so (for example "needs two rush specials").
- **TOOLS**: time (1×, ½×, ¼×, ⅒×), pause (P) and frame step (.), the dummy's behavior, record YOU and replay it on the
  dummy, infinite meter, boxes, the hit flash style (POP, TINT, RIM, CLASSIC, OFF) and strength, reset. ` hides the panel; the keyboard and touch controls still play YOU.
- Scripts are timelines on the fighter's pad (`src/lab/scripts.js`), built from the kit data, so new fighters and moves
  appear without lab changes. Add a scenario to `SCENARIOS` when a new shared mechanic lands.

## Smoke test (every change)

- [ ] The page loads, and the console shows only `[sprites] ...` info lines. **No errors.**
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
- [ ] Light ×3 → Heavy launches. Jump chases. Air L L → air Heavy spikes. Ground bounce happens once.
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
   in about 35-70 s, with combos of 3-7 hits ending in a special or vanish, and no stuck states. Over a match
   each fighter should show most of its kit and at least one three-bar move, plus parries, spot dodges, air
   dodges ("DODGE!" / "AIR DODGE!" callouts), wavedashes and charging. After a match,
   `game.brains.map((b) => b.show.unseen())` lists what each CPU never used; expect 0-5 tools each (fewer
   for the winner, since the loser has less time; `vanishWar` needs a vanish to answer).
   `game.brains.map((b) => b.show.report())` gives each CPU's defense: see the targets in "CPU defense showcase" below. With Naruto and / or Gojo on both sides (ultimates that clash),
   most matches should show at least one rhythm clash (ENG-056); `clash` in `unseen()` means none happened.
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
9. **Training dummy**: DUMMY TECH never / hold / random and DUMMY BURST off / on in the panel; the defaults keep the
   old dummy (GUARD mode with tech NEVER lets go of Guard for the whole launch: no TECH!, no TECH ROLL!).
10. **CPU**: the soak below (`mode=cpu`, and IMPOSSIBLE vs Hard) shows TECH! and TECH ROLL! every match and BURST!
    in most, never more than one burst per fighter per round (`burstUsed` ≤ 1), blue counters now and then, and
    rounds still ending by KO in the usual time.

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

Use this for combat, AI, physics and performance changes. It catches stuck states, NaNs and rare crashes.

1. Open `/?fight=naruto,sasuke&mode=solo&level=hard&debug`, with DevTools console open.
2. Paste:

```js
const { CpuBrain } = await import('/src/game/ai.js');
let matches = 0, errors = 0;
window.addEventListener('error', () => errors++);
const arm = () => {
  game.input.bindings = [];                                   // keyboard/gamepad no longer drive P1
  game.brains[0] = new CpuBrain(game.fighters[0], 'hard');    // CPU plays P1 too
};
arm();
const soak = setInterval(() => {
  for (const f of game.fighters) {
    if (![f.pos.x, f.pos.y, f.pos.z, f.vel.x, f.vel.y, f.vel.z].every(Number.isFinite)) console.error('[soak] NaN', f.def.id, f.state);
    if (!f.ko && (Math.abs(f.pos.x) > 8.6 || Math.abs(f.pos.z) > 8.6)) console.error('[soak] out of ring', f.def.id, f.state);
  }
  if (game.state === 'results') {
    matches++;
    console.info(`[soak] match ${matches} done, errors so far: ${errors}`);
    if (matches >= 3) { clearInterval(soak); console.info('[soak] finished'); return; }
    game.startMatch(game.cfg); arm();
  }
}, 500);
```

3. Let it run for **at least 3 full matches** (about 5 to 8 minutes). Pass criteria: no `[soak]` errors, no
   uncaught exceptions, no fighter stuck in one state for more than 10 s, rounds end
   by KO or time, and the frame rate stays smooth.
4. For long soaks, switch characters (`?fight=sasuke,naruto`, mirror matches) and levels.

If `src/main.js` gains a built-in soak helper later, prefer it and update this section.

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
| Boot | menu interactive in < 3 s with 2 characters on a warm cache | stopwatch or Performance panel |

When adding characters, remember the bake is per roster entry at boot. Past ~6 placeholder characters,
consider lazy baking on select (a roadmap item).

## Before a release

- [ ] All checklists above pass on Chrome and Firefox (Edge spot check).
- [ ] Soak: 3 matches per character pairing.
- [ ] `npm run build && npm run preview`, then a smoke test against the built output.
- [ ] CHANGELOG, version and tag per [CONTRIBUTING.md](CONTRIBUTING.md#versioning-and-releases).
