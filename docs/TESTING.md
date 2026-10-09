# Testing

Apart from the packer self-test (`npm run test:sprites`), there's no automated test suite yet (see
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
| `/?fight=naruto,sasuke&mode=solo&level=hard` | skip menus into a VS CPU match (`level` = easy, normal or hard) |
| `/?fight=naruto,sasuke&mode=versus` | skip into a 2P match |
| `&debug` | expose console helpers (below) |
| `&art=custom` | use custom sheets even when they're incomplete (falls back per animation) |
| `&res=pixel` / `&res=hd` | force the render detail (default: `hd` when any loaded sheet has `pixelsPerUnit` >= 70, e.g. spec v2 art) |
| `/sprites.html` | Sprite Lab: preview every animation, prompts, import |

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

## Smoke test (every change)

- [ ] The page loads, and the console shows only `[sprites] ...` info lines. **No errors.**
- [ ] Title → mode select → char select → match starts. The intro flythrough can be skipped with Enter.
- [ ] One full round plays to a KO. Round announcements, the win pose and the results screen work.
- [ ] Pause (Esc/P/Start) → resume → quit to title works, and the title still works afterward.
- [ ] `npm run build` passes.

## Feature checklists

**Movement and defense**
- [ ] Run in 8 directions relative to the camera. Fighters face screen-left or screen-right only.
- [ ] Dash with a direction, double-tap dash, back dash, super dash (neutral). Super dash only once per airtime.
- [ ] Jump, air drift, land. Guard blocks only when facing the attacker. Chip never kills.

**Offense**
- [ ] Light ×4 auto combo. light4 wall-bounces at the barrier.
- [ ] Light ×3 → Heavy launches. Jump chases. Air L L → air Heavy spikes. Ground bounce happens once.
- [ ] Every strike visibly **touches the body** when it connects, the spark sits on the contact point, and there
      are no hits across a visible depth gap.
- [ ] Vanish (1 bar) from neutral, on hit and from block.
- [ ] Special (tap) with super flash. Charge (hold) fills ki with an aura. Air projectile (½ bar).
- [ ] Ultimate (3 bars): cut-in, beam. Counter-beam during theirs → clash → mash → winner or draw.
- [ ] Kits (ADR 0009), with Killua and Gojo: Special, Special + → / ↑ / ↓ and air Special (+↓) each give the
      move in the README Fighters table. SUPER fires Whirlwind / Unlimited Void (the void stage replaces the
      arena, then comes back), and Naruto's SUPER fires his beam. Godspeed shows the mode bar and blink dashes.
      Infinity stops a projectile (callout), and the counter freezes a melee attacker.
      Debug recipe: `freezeCpu()`, set `game.fighters[0].ki = 300`, then `hold('KeyD'); press('KeyL', 3); release('KeyD')`
      and `step(1)` while logging `f.state`, `f.kitState?.kind`, and the opponent's state and HP.
- [ ] Air recover after launch. At 22+ hits the victim auto-techs.
- [ ] KO by a big hit sends the loser out of the ring and into the stands.

**Input and UI**
- [ ] A gamepad doesn't steer until one of its buttons is pressed. Menus work with the D-pad, A and B.
- [ ] Controls panel: keyboard / PlayStation / Xbox layouts, a toggle between them, live input highlights.
- [ ] Rebinding: rebind a key and a pad button, reload the page, and the bindings persist. Reset restores defaults.
- [ ] Training room: the character responds to live input, the dummy modes work, health refills, there's no
      timer, and input history shows.
- [ ] Mute: `M` and the on-screen toggle (top corner, unobtrusive) both mute and unmute, and stay in sync.
- [ ] HUD: health trail, ki bars, combo counter, callouts, timer.

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

## Performance budget

| Metric | Budget | How to check |
|---|---|---|
| Frame rate | **60 fps at 1080p** during the heaviest moments (beam clash + auras + debris) on a mid-range laptop GPU | DevTools Performance or an FPS meter. Watch the clash and KO crash. |
| Fixed-step catch-up | the accumulator should rarely hit the 6-step cap | add a temporary counter in debug, then remove it |
| Placeholder bake | **< 1 s per character** | console: `[sprites] baked <id> from 3D in N ms` |
| Custom sheet size | ≤ 4096 × 4096 px (spec v2: 16 columns × 256 px = 4096 px wide; 154 frames = 10 rows = 2560 px tall). A GPU with a 2048 texture limit gets a downscaled sheet and a three.js warning. | packer report |
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
