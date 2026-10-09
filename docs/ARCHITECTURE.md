# Architecture

How GCD Tourney is put together: the modules, what happens each frame, and how sprites, VFX, UI
and audio plug in. Keep this file true. If you change a flow described here, update it in the same
change.

- Stack: **Three.js 0.170 + Vite 6**, plain JavaScript ES modules, no other runtime dependencies.
- Two HTML entries: `index.html` (the game, `src/main.js`) and `sprites.html` (Sprite Lab, `src/spriteLab.js`).
- Dev tooling: `tools/pack-sprites.mjs` (Node + `pngjs`) packs `art/` into `public/`. It reads the art spec
  (cell, pivot, PPU) from the `spec` block in `art/manifest.json` and packs the highest `_vNN` version of
  each raw image.

## Module map

```
src/main.js                 boot: PixelRenderer + InputManager + Game, rAF loop, ?fight= shortcut, ?debug helpers
src/core/
  renderer.js               PixelRenderer: renders into a small buffer (360 px tall at 1080p; ~600+ px in the
                            `hd` detail used for hi-res art), CSS nearest-neighbor
                            upscale, EffectComposer with UnrealBloom (HDR > 1.0 glows) + a grade/vignette pass
  input.js                  InputManager (keyboard + gamepads -> per-player Pad), rebindable KEYMAPS / PAD_BUTTONS
  touch.js                  TouchControls: floating joystick + action buttons for phones (merged into P1's Pad by
                            InputManager.poll), IS_TOUCH_DEVICE, button size prefs
  artIndex.js               production art index (public/art-index.json): only request art files that exist
                            saved to localStorage ('gcd.bindings.v1'), PS/Xbox pad detection, menu events
  audio.js                  AudioEngine: everything synthesized with WebAudio (sfx, loops, music, crowd), mute
src/game/
  game.js                   Game: main loop, fixed-step sim, match/round flow, training room, melee hit test
                            (lanes + boxes), special clash, projectile/beam collisions, beam clash, event hooks
                            (onHit/onBlock/onVanish/...), super flash, KO, render orchestration
  fighter.js                Fighter: state machine (idle/run/guard/dash/superDash/vanish/air/attack/hitstun/
                            launched/down/getup/charge/beamCharge/beamFire/clash/...), cancels, physics, takeHit
  moves.js                  ALL gameplay numbers: MOVES, SUPER_DASH, VANISH, SPECIALS, PROJECTILES, ULTIMATE
  ai.js                     CpuBrain (Easy/Normal/Hard) and DummyBrain (training): press buttons on a Pad
  projectiles.js            Projectile (shuriken, fireball) and Beam (ultimate) with HDR shader
  effects.js                Effects: VFX sprite pool from the VFX atlas, aura/hand effects, debris, craters,
                            barrier flashes; Overlay (2D canvas: speed lines, flashes, impact frames)
  camera.js                 CameraDirector modes: orbit, intro, fight, focus, clash, ko, victory; shake, zoom punch
  sprites.js                SheetAsset (sheet + anims.json + boxes), SpriteActor (billboard, flip, phases,
                            ghosts, shadow caster), loadFighterAsset (custom sheet or 3D bake), anim FALLBACK
  constants.js              world/ruleset constants (ring size, gravity, HP, ki, round time, PPUs)
src/characters/             one file per fighter + index.js (ROSTER, getChar)
src/art/
  animGuide.js              canonical animation list (frames, phases, pose text) + ChatGPT prompt builder
  vfxPainter.js             procedural VFX atlas (64 px cells), VFX_ANIMS table
  pixel.js, textures.js, crowdPainter.js   procedural pixel art: helpers, arena textures, crowd/announcer sprites
  rig/                      3D placeholder pipeline: geo.js, rig.js (chibi model), toon.js (toon + ID/depth pass),
                            pose.js (pose model, keyframes), anims.js (shared moveset), face.js (pixel faces),
                            baker.js (bake to sheet + boxes + portrait + cut-in)
src/world/arena.js          tournament grounds: ring, temple, stands + instanced crowd, gate, trees, sky, dimming
src/ui/
  hud.js                    health/ki bars, timer, combo counter, callouts, announcements, super cut-in, clash meter
  menus.js                  DOM menus: title, mode select, char select, pause, results, training panel
  controls.js               controls panel: keyboard / PlayStation / Xbox layouts, live input highlights,
                            click-to-rebind, input history (training room + pause menu)
src/style.css               all DOM UI styling
```

## Boot sequence

1. `main.js` creates `PixelRenderer`, `InputManager` and `Game`, and sets `window.game`.
2. After a 30 ms delay (so "BAKING FIGHTERS..." can paint), `game.init()` runs `loadFighterAsset()` for each
   roster entry:
   - If `public/characters/<id>/anims.json` + `sheet.png` exist (and are complete, or `?art=custom` is set),
     it builds a `SheetAsset` from them (`source: 'custom'`) and loads `portrait.png` / `cutin.png` when present.
   - Otherwise it **bakes the 3D placeholder** (`bakeCharacter`, blocking, logs `baked <id> from 3D in N ms`).
3. The title menu shows, and the camera orbits. With `?fight=a,b` a match starts right away.

## The frame

`Game.frame(dtReal)` runs once per `requestAnimationFrame`:

```
frame(dtReal)                                   (real time, clamped to 0.1 s)
├─ input.pollMenu() -> menu events -> Menus.handle (menus/pause/results) or game events (skip intro, pause)
├─ if not paused:
│   ├─ slow-mo bookkeeping (timeScale, slowT)
│   ├─ accumulator += dt * timeScale
│   ├─ while acc >= 1/60 (max 6 steps): fixedUpdate()          <- the simulation
│   ├─ alpha = acc / DT                                         <- render interpolation factor
│   └─ flow()                                                   <- match flow state machine (real time)
└─ render(dtReal)
```

### fixedUpdate (60 Hz, deterministic order)

```
1. input.poll()                 keyboard + gamepads -> Pad (pressed/released edges, buffers, double-tap dash)
2. brains[i].update(game)       CpuBrain / DummyBrain press buttons on their own Pad (same interface as a human)
3. superFlash timer             a running super flash counts down
4. freeze > 0 ?                 super-flash time stop: only FX tick, then return (inputs keep buffering)
5. fighters[i].update()         state machine; attacks call game.checkMelee() on active frames;
                                lane auto-step; physics (gravity, ring barrier, wall/ground bounce, KO physics)
6. separate()                   push overlapping fighters apart
7. checkSpecialClash()          two signature rushes meeting -> both blown back
8. projectiles update + projectileCollisions()   projectile vs fighter, projectile vs projectile, beam eats projectiles
9. beams update, checkBeamClash(), updateClash()  ultimate beams, beam clash mash-off
10. fxTicks()                   aura / signature-hand effects, speed-line focus
11. round timer                 99 s countdown (not in training)
```

Hitstop runs per fighter. `Fighter.update()` returns early while `hitstop > 0`, so attacker and victim
freeze while the rest of the world keeps going. Projectile and beam hits don't freeze the attacker.

### render (every rAF)

```
fighters.sync(alpha)        interpolate prev -> pos, hitstop shake, billboard + flip, flash uniforms
cam.update(dt)              CameraDirector mode logic, shake/kick, zoom punch
fighters.sync again         (uses the camera's new right vector), ghost trails fade
beams.sync, fx.update       VFX sprites face the camera, animate, fade; Overlay speed lines/flashes
arena.setDim / update       super-flash dimming, crowd excitement
hud.update                  bars, timer, combo counter
renderer.render             low-res render -> bloom -> grade -> nearest upscale
```

### Match flow (`Game.flow`, real time)

`menu -> intro (flythrough, fighter cards) -> roundIntro ("ROUND n", "FIGHT!") -> fight -> ko | timeup
-> roundEnd -> (nextRound | matchEnd -> results)`, plus `draw` and `training`. Best of 3 rounds
(`ROUNDS_TO_WIN = 2`), 99 s each. `Game.state` and `Game.stateT` hold the current state and how long
it has run.

## Coordinates and units

- World: **1 unit = 1 floor tile**. The ring spans x and z in -9..9 (`RING_HALF`), and the ring surface is at
  y = 0.6 (`RING_TOP`). Fighter `pos.y` is height above the ring surface. Fighters stay inside
  `ARENA_LIMIT = 8.55` except during a KO.
- Time: the sim counts **frames at 60 fps** (`DT = 1/60`). Move data in `moves.js` is in frames. Velocities are
  units per second.
- Screen axes: `cam.right` (screen horizontal) and `cam.fwd` (depth, away from the camera) are flattened onto
  the floor. Player input is mapped through `cam.dirFromInput()`, so "right" always means screen-right.
- **2.5D lanes**: fighters face screen-left or screen-right only (`Fighter.side` = +1 or -1). Attacks auto-step in
  depth to line up with the opponent. A melee hit needs the same lane plus hitbox/hurtbox overlap.
  See [COMBAT_DESIGN.md](COMBAT_DESIGN.md#hit-detection-25d-lanes-and-frame-boxes) and
  [ADR 0005](decisions/0005-25d-lanes-frame-hitboxes.md).

## Sprite pipeline

Every fighter renders from a **sprite sheet + `anims.json`**. There are two ways to get one.

```
                       ┌────────────────────────────── placeholder (always available) ─┐
src/characters/<id>.js ─> rig/anims.js + extraAnims ─> rig/baker.js ──> canvas sheet (112 px cells, PPU 44)
                                                                        + meta (animations, phases, boxes)
                                                                        + portrait + cut-in canvases
                       └────────────────────────────────────────────────────────────────┘
                       ┌────────────────────────────── custom hi-res art (spec v2) ─────┐
generated strips ─> art/characters/<id>/raw/<anim>_vNN.png ─> npm run sprites ─> public/characters/<id>/sheet.png
(Codex; reviewed in    (highest version wins; _rejected/ ignored;         (256 px cells, PPU 128, 4096 × 2560)
 art/REVIEW.md)         + frames/, hitboxes.json)                         + anims.json (animations, phases, boxes, complete)
                                                                          + portrait.png, cutin.png, select.png
                       └────────────────────────────────────────────────────────────────┘
                                          │
                              loadFighterAsset() picks custom if present and complete (or ?art=custom),
                              else bakes. One console line says which.
                                          │
                              SheetAsset (texture, nearest filtering) -> SpriteActor per fighter
```

- **SheetAsset** wraps the image and meta. `anim(name)` resolves missing animations through `FALLBACK`
  (e.g. `superDash -> dash -> run -> idle`). `boxes(frame, kind, side)` converts frame-local pixel boxes into
  local world units, mirrored for facing left.
- **SpriteActor** is a camera-facing plane anchored at the pivot (feet). It mirrors by `side`, plays loops and
  one-shots by `durations`, and for attacks `setPhase(anim, phase, progress)` maps the move's
  startup/active/recovery onto the animation's `phases` frame counts. It also has a hidden sun-facing
  shadow caster, a blob shadow and ghost trails (dash/vanish afterimages).
- World size stays the same across art sources. The chibi placeholder (112 px cells, PPU 44) and spec v2
  custom art (256 px cells, PPU 128, a ~200 px standing body = 1.56 units) both stand about 1.6 units
  tall. Only the proportions differ (the placeholder is chibi, v2 art is ~6.5 heads) until ENG-016.
- The engine reads frame size, pivot and PPU from `anims.json`, so a spec change needs no engine code.
- When any loaded sheet has `pixelsPerUnit` >= 70 (spec v2: 128), `Game.init` switches the renderer to its
  `hd` detail (buffer ~600+ px tall instead of ~340), so the extra detail isn't thrown away by the low-res
  buffer. `?res=pixel` / `?res=hd` override it.
- The contract for art (cell size, pivot, PPU, boxes, naming) is [art/SPEC.md](../art/SPEC.md), with the v2
  numbers decided in [ADR 0007](decisions/0007-art-spec-v2-shippuden-256.md). The packer is the only thing
  that writes `public/characters/**`.

## VFX pipeline

- `src/art/vfxPainter.js` paints a **procedural atlas** at boot (64 px cells, one row per effect, `VFX_PPU = 28`).
  Effect names are fixed: `spark burst ring dust smoke shuriken fire flame lightning orb glow streak star
  crater lines`.
- Custom VFX art: `npm run sprites vfx` writes `public/vfx/atlas.png` + `atlas.json` (128 px cells, `ppu` 56,
  the same world size). The game loads it when present, and missing effects fall back to procedural ones.
- `Effects.spawn(name, x, y, z, opts)` creates a camera-facing quad with a tint `color` (white art is
  tinted at runtime), `glow` (HDR boost into bloom), optional velocity, gravity, spin, follow and loop.
  `Effects.keep(id, ...)` updates a persistent effect (auras, hand orbs, clash glow).
- `Overlay` is a 2D canvas over the game for anime speed lines, full-screen flashes and impact frames.

## UI layer

The HUD and menus are **DOM** (`#ui`) over the WebGL canvas (`#app`), styled in `src/style.css`. Menus use a
tiny `el()` helper and a generic `list()` with keyboard/gamepad navigation (`Menus.handle(events)`).
The menus never touch game state directly. They call `Game` methods (`startMatch`, `startTraining`,
`pause`, `quitToTitle`).

## Audio

`src/core/audio.js` synthesizes everything (oscillators + noise buffers): one-shots via `audio.play(name, vol)`,
loops via `audio.loop(id, kind)` / `stopLoop(id)`, music styles `menu` / `battle`, and a crowd bed with an
excitement level. The first user gesture calls `audio.init()`. `audio.setMuted(bool)` mutes, bound to `M`, and
the in-progress on-screen mute toggle uses it too. To swap in recorded samples later, change the cases in
`play()`. Callers don't change.

## Training room

`Game.startTraining()` runs a match with no timer and no KO, refilling health, and optionally infinite ki. P2 is
driven by `DummyBrain` (stand / guard / hop / fight back). The controls panel (`src/ui/controls.js`) shows the
active device's layout (keyboard, PlayStation, Xbox, toggleable), lights up inputs live, and supports
click-to-rebind. Bindings persist in localStorage.

- Stage: `src/world/trainingRoom.js` (holographic grid, same ring footprint) replaces the arena via
  `Game.setStage('training')`; it carries its own hemisphere light for lit debris.
- `Game.render` shifts the projection with `camera.setViewOffset` so the fight stays centered in the space the
  side panel leaves free (`Menus.panelCover()`); `CameraDirector` frames for the visible aspect.
- `src/game/boxViewer.js` outlines the current frame's hurt (blue) and hit (red) boxes when `game.showBoxes`
  is on (training HITBOXES toggle, or `?boxes`).
- Input boundaries: `InputManager.flush()` runs on resume / training start / reset, so a key or button held
  from the menu is ignored until released (no stray jump on RESUME). Pad rebinds suppress the bound button
  the same way.
- Hotkeys in training: Tab hides the panel, Backspace / gamepad Create resets positions.

## Extension points (where new things go)

| You want to add | Put it in |
|---|---|
| a fighter | `src/characters/<id>.js` + `index.js`; art in `art/characters/<id>/` ([ADDING_A_CHARACTER.md](ADDING_A_CHARACTER.md)) |
| a move or tuning change | `src/game/moves.js` (data), with state logic in `fighter.js` only if it's a new mechanic |
| a signature special | `SPECIALS` in `moves.js` + hand effect in `Effects.handTick` + loop sound in `audio.js` |
| a projectile type | `PROJECTILES` in `moves.js` (sprite = a VFX atlas name) |
| a VFX effect | `VFX_ANIMS` + painter in `vfxPainter.js`; custom art via `art/vfx/` |
| a sound | a case in `AudioEngine.play()` / `loop()` |
| a camera move | a mode in `CameraDirector.update()` |
| a menu screen | a method on `Menus` + CSS |
| a stage | today one arena (`src/world/arena.js`). Multi-stage support is on the roadmap. |
