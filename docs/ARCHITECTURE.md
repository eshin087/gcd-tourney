# Architecture

How GCD Tourney is put together: the modules, what happens each frame, and how sprites, VFX, UI
and audio plug in. Keep this file true. If you change a flow described here, update it in the same
change.

- Stack: **Three.js 0.170 + Vite 6**, plain JavaScript ES modules, no other runtime dependencies.
- HTML entries: `index.html` (the game, `src/main.js`), `sprites.html` (Sprite Lab, `src/spriteLab.js`), `art-review.html`, and
  `lab.html` (the test lab, `src/lab/`: the training room plus scripted moves and scenarios on the fighters' pads, ADR 0018).
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
  audio.js                  AudioEngine: everything synthesized with WebAudio (sfx, loops, crowd), mute, the music bus
                            and MUSIC volume; music calls delegate to music.js
  music.js                  MusicPlayer (ADR 0019): performs composed songs (lookahead scheduler, Karplus-Strong koto,
                            pads, bass, brushed drums, echo), mood crossfades, ducks, intensity, lite mode
  musicPlan.js              pure seeded composer (ADR 0019): MOODS / DUCKS data, voiceLead, composeSong (Node-tested)
src/game/
  game.js                   Game: main loop, fixed-step sim, match/round flow, training room, melee hit test
                            (lanes + boxes; hits applied together in resolveMelee so same-frame hits trade),
                            projectile/beam/orb collisions, special, beam (ADR 0027) and ultimate clashes (clash
                            bodies, the struggle line, endings; startClash tiers 'ultimate' | 'struggle' | 'beat'),
                            event hooks
                            (onHit/onBlock/onVanish/onBurst/...), technique callouts (Game.tag(f, id) -> TAGS,
                            ADR 0022), super flash, KO, render orchestration
  clash.js                  rhythm clash (ADR 0017): seeded note chart, Judge (grades, strays, holds), CPU press plan
  fighter.js                Fighter: state machine (idle/run/guard/dash/superDash/vanish/air/attack/hitstun/
                            launched/down/getup/charge/beamCharge/beamFire/clash/techRoll/burst/...), cancels,
                            physics, takeHit; combo escape and true-combo tracking (gapF, comboBlue; ADR 0022)
  moves.js                  ALL gameplay numbers: MOVES, SUPER_DASH, VANISH, SPECIALS, PROJECTILES, ULTIMATE,
                            SPECIAL_MOVES (kit specials by id), SUPERS (second supers)
  kit.js                    fighter kits (ADR 0009/0011): stick -> special slot, special kinds (rush/shot/teleport/
                            pull/dive/counter/mode), supers and non-beam ultimates (flurry/domain/skyStrike/ignite),
                            passives, modes, burn; state 'kit'
  ai.js                     CpuBrain (Easy/Normal/Hard), DummyBrain (training), makeBrain: press buttons on a Pad
  aiMaster.js               MasterBrain (IMPOSSIBLE; `showman` style for CPU vs CPU), ADR 0014/0016
  aiShow.js                 Showcase (ADR 0016): which tools a CPU has shown this match -> option weights;
                            the per-match defense persona (ADR 0025)
  aiDefense.js              MasterBrain's defense showcase (ADR 0025): parry rallies, reversals, string reads,
                            tech escapes; reachT (threats timed to the drawn strike)
  showDirector.js           ShowDirector (ADR 0027, CPU vs CPU only): cues one beam clash per match (a random
                            moment and challenger) for the two brains to play; never presses a button
  projectiles.js            Projectile (shuriken, fireball, bolt, red; Infinity stops them), Vortex (Lapse: Blue
                            pull) and Beam (the ultimate, or a beam clash's stream in a shot's palette) with HDR shader
  effects.js                Effects: VFX sprite pool from the VFX atlas, aura/hand effects, debris, dust rings,
                            barrier flashes; Overlay (2D canvas: speed lines, flashes, impact frames); owns fx.ground
  ground.js                 GroundDamage (ADR 0024): force -> tier -> size, element styles, merges, impact debt,
                            lit clipped decals, rim chunks, slabs, wall/barrier marks, charge cracks, decal pages
  chargeFx.js               power-ups (ADR 0023): CHARGE_DEFAULT + per-fighter `charge` styles, the interpreter
                            (shell, emitters, eye glint, bar / MAX beats) and the restraint rules R1-R9
  auraShell.js              AuraShell: the body-hugging power-up outline (a shader dilates the frame's alpha)
  camera.js                 CameraDirector modes: orbit, intro, fight, focus, clash, ko, victory, results; shake,
                            zoom punch
  sprites.js                SheetAsset (sheet + anims.json + boxes), SpriteActor (billboard, flip, phases,
                            ghosts, shadow caster), loadFighterAsset (custom sheet or 3D bake), anim FALLBACK
  hitFlash.js               the victim's hit flash (ENG-064): tier per hit, render-only envelope (pop, lift,
                            rim, fade) on Game.frameNo, hitstop shake, ?flash=<style>; numbers in HIT_FLASH
  constants.js              world/ruleset constants (ring size, gravity, HP, ki, round time, PPUs)
src/characters/             one file per fighter + index.js (ROSTER, getChar)
src/art/
  animGuide.js              canonical animation list (frames, phases, pose text) + ChatGPT prompt builder
  vfxPainter.js             procedural VFX atlas (64 px cells), VFX_ANIMS table
  decalPainter.js           the decal contract (DECALS: names, cells, groups) + procedural decals at half density
  pixel.js, textures.js, crowdPainter.js   procedural pixel art: helpers, arena textures, crowd/announcer sprites
  rig/                      3D placeholder pipeline: geo.js, rig.js (chibi model), toon.js (toon + ID/depth pass),
                            pose.js (pose model, keyframes), anims.js (shared moveset), face.js (pixel faces),
                            baker.js (bake to sheet + boxes + portrait + cut-in)
src/world/arena.js          tournament grounds: ring, temple, stands + instanced crowd, gate, trees, sky, dimming
src/world/voidStage.js      Unlimited Void (Gojo's domain): starfield/streak sky shader + rippling floor, swapped in
                            by Game.startDomain via setStage('void')
src/ui/
  hud.js                    health/ki bars + burst gems, timer, combo counter (blue when escapable), callouts, TAGS
                            technique banners (ADR 0022), announcements, super cut-in, clash bar and rhythm track
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
2. director?.update()           CPU vs CPU only: the show director's beam-clash cue (ADR 0027)
   brains[i].update(game)       CpuBrain / DummyBrain press buttons on their own Pad (same interface as a human)
3. superFlash timer             a running super flash counts down
4. freeze > 0 ?                 super-flash time stop: only FX tick, then return (inputs keep buffering)
5. fighters[i].update()         state machine; attacks call game.checkMelee() on active frames;
                                lane auto-step; physics (gravity, ring barrier, wall/ground bounce, KO physics)
6. separate()                   push overlapping fighters apart
7. checkSpecialClash()          two signature rushes meeting -> a one-beat clash (the world holds still) or a trade
   checkUltimateClash()         two ultimates' bodies meeting head-on -> the rhythm clash
   checkEnergyClash()           two energy attacks meeting head-on, or an energy special answering one -> a beam
                                clash (before the shots move, so one can't hit its answerer first; ADR 0027)
8. projectiles update + projectileCollisions()   projectile vs fighter, projectile vs projectile (two energy shots
                                touching -> checkEnergyClash, else they cancel), beam eats projectiles
9. updateClash(), beams + orbs update, checkUltimateClash(), checkEnergyClash()   judge both pads against the chart,
                                move the bodies
10. fxTicks(frozen)             charge styles (chargeFx), aura / signature-hand effects, speed-line focus; during a
                                freeze or a special clash it runs with frozen = true (charges refresh, spawn nothing)
11. round timer                 99 s countdown (not in training)
```

Hitstop runs per fighter. `Fighter.update()` returns early while `hitstop > 0`, so attacker and victim
freeze while the rest of the world keeps going. Projectile and beam hits don't freeze the attacker.

### render (every rAF)

```
fighters.sync(alpha)        interpolate prev -> pos, hitstop shake, billboard + flip, flash uniforms (hit flash
                            pop/lift/rim from hitFlash.js, charge tint, dodge shimmer, super flash)
cam.update(dt)              CameraDirector mode logic, shake/kick, zoom punch, spriteRefDepth
fighters.sync again         (uses the camera's new right vector and depth), ghost trails fade
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

Round wins use the orbiting `victory` shot. `matchEnd` cuts to the `results` hero shot instead: the loser's
actor is hidden (only the winner, DBFZ-style; cleanupMatch disposes it, so a rematch brings it back), the winner
is pinned facing screen-right, and the camera only sways, so the billboard never mirrors. `Menus.results` is a
slim side panel (a bottom bar below 3:4), and `Game.render` shifts the projection by `Menus.resultsCover()` the
same way it does for the training panel, so the whole winner stands in the free space.

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
(Codex; reviewed in    (highest version wins; _rejected/ ignored;         (256 px cells, PPU 128, 4096 × 2816)
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
  shadow caster, a blob shadow and ghost trails (dash/vanish afterimages). On a lying frame (one with an anims.json
  `footprint`: `ko`, `down`, `getup` f0) resting on the floor, `fitShadow` stretches the blob along the drawn body
  and turns the caster with the billboard, so the whole body is grounded (ADR 0020); `SheetAsset.footprint(frame)`
  gives the span in local units, and `fitShadow` multiplies it by the actor's `depthK` like the drawn body.
- **The sprite shader** (`spriteMaterial`, shared by fighters and ghosts, one compiled program) tints the cell,
  then applies the hit flash's `lift` (a luma-weighted brighten in ~gamma space that keeps the dark line art) and
  `rim` (an inner outline `rimPx` render pixels wide: 4 alpha taps clamped to the frame's `uvRect`, so nothing
  bleeds in from the next cell), then the `flash` mix toward `flashColor` and the ghost `silhouette`. Lift and rim
  are 0 outside a hit, so those branches are skipped; `src/game/hitFlash.js` drives them per hit tier.
- **Depth-normalized size** (ENG-067, ADR 0021): a billboard's on-screen size goes with 1 / view depth, so under
  true perspective the fighter nearer the camera drew 9-23% bigger whenever the two stood apart in depth (the
  fight camera's yaw is clamped to ±0.42 rad, CPU lane steps) or one was in the air. In the `fight` and `clash`
  camera modes `CameraDirector.spriteRefDepth` is the view depth midway between the two fighters' feet (eased, so
  a vanish changes both sizes gently instead of popping the other fighter), and `SpriteActor.syncDepth` scales the
  actor root by `(depth / spriteRefDepth) ^ SPRITE_DEPTH_COMP`, clamped to `SPRITE_DEPTH_CLAMP` (constants.js: 1 and
  [0.82, 1.22]). Both use the same reference, so both fighters always draw at one size; fighters level in depth keep
  scale 1. The root scales about the feet pivot and carries the mesh, shadow caster and box-viewer lines; the blob
  shadow and ghost trails use the same `depthK`. Close-up modes (focus, ko, victory) set `spriteRefDepth` to null
  and a blend weight takes `depthK` back to 1 over about half a second, with the camera move. It is **visual only**:
  `SheetAsset.boxes()` and the hand anchors are never scaled, so the simulation stays camera-independent
  (projectiles and beams start at the unscaled hand anchor: about 0.1 units off the drawn palm in a typical depth
  gap, up to 0.25 at the clamp ends). Held VFX that only draw are scaled instead: `Effects.handTick` (Rasengan,
  Rasenshuriken, Chidori) multiplies its offset from the feet and its size by the actor's `depthK`, so the orb stays
  on the drawn palm. New on-body VFX at fixed body offsets should do the same with `f.actor.depthK`, unless their
  position feeds the simulation. `?depthscale=0` shows true perspective for comparison.
- World size stays the same across art sources. The chibi placeholder (112 px cells, PPU 44) and spec v2
  custom art (256 px cells, PPU 128, a ~200 px standing body = 1.56 units) both stand about 1.6 units
  tall. Only the proportions differ (the placeholder is chibi, v2 art is ~6.5 heads) until ENG-016.
- The engine reads frame size, pivot and PPU from `anims.json`, so a spec change needs no engine code.
- **Scale gate** (TOOL-025, [ADR 0021](decisions/0021-scale-gate-and-depth-normalized-sprites.md)): the engine never
  rescales a strip, so a fighter only looks the same size in every animation if the art is. The packer measures every
  frame's head (hair included) and feet against the idle (`tools/scale-probe.mjs`), fails unapproved strips that are
  off, and writes the result into `anims.json` (`scaleAudit`). It is dev-only at runtime: `?scaleaudit` logs the
  flagged strips as they play, `scaleReport()` lists them under `?debug`, and the test lab's `BoxViewer` draws the
  idle head size around the frame's head (`actor.headCheck`).
- **Hand anchors** (art packs only): `SheetAsset.hand(anim, frame)` / `SpriteActor.hand()` give the drawn
  palm or fingertip of the current frame (from `hand: [x, y]` in `hitboxes.json`, else the frame's hit box,
  else the nearest frame of the animation that has one). Hand effects (Rasengan, Rasenshuriken, Chidori),
  projectile spawns and beam origins start there; the baked placeholder keeps the fixed offsets.
- When any loaded sheet has `pixelsPerUnit` >= 70 (spec v2: 128), `Game.init` switches the renderer to its
  `hd` detail (buffer ~600+ px tall instead of ~340), so the extra detail isn't thrown away by the low-res
  buffer. `?res=pixel` / `?res=hd` override it.
- The contract for art (cell size, pivot, PPU, boxes, naming) is [art/SPEC.md](../art/SPEC.md), with the v2
  numbers decided in [ADR 0007](decisions/0007-art-spec-v2-shippuden-256.md). The packer is the only thing
  that writes `public/characters/**`.

## VFX pipeline

- `src/art/vfxPainter.js` paints a **procedural atlas** at boot (64 px cells, one row per effect, `VFX_PPU = 28`).
  Effect names are fixed: `spark burst ring dust smoke shuriken fire flame lightning orb glow streak star
  crater lines dustWave` (`crater` is no longer drawn: ground damage has its own decals, ADR 0024; `dustWave` rolls
  out of big craters).
- Custom VFX art: `npm run sprites vfx` writes `public/vfx/atlas.png` + `atlas.json` (128 px cells, `ppu` 56,
  the same world size) from the **approved** effects only (`approvedVersion` in `art/manifest.json`), and removes
  a stale atlas when none are approved. The game loads it when present, and missing effects fall back to
  procedural ones.

## Ground damage (ADR 0024)

- Every floor-marking event goes through `fx.ground` (`src/game/ground.js`): `hit` (Game.onHit), `land` (launched
  landings and ground bounces), `koMark`, `slide` (knockdown and KO skids), `dive`, `impact` (slams, specials, clash
  endings, Kirin, the maul and roar, shots hitting the floor, vortex pops, the super jump), `trail` (Hollow Purple's
  trench), `scuff` (wavedash and super dash takeoff), `wall` (barrier crack on a wall bounce), `wallCrater` (KO crash
  into the stands), `chargeTick` / `chargeMax` (the power-up).
- A **force** picks the tier and size (`GROUND.tiers`: crack_s, crack, crater, crater_big, crater_huge, 1.4 to 7.6
  units); a **style** picks the look (`GROUND_STYLES`, from `ground` fields on moves, projectiles, supers and
  characters). One impact is a cluster: underlay and satellites, the crater (or the style's own decal), the overlay,
  rubble, then rim chunks (one InstancedMesh), slabs (the ring's own materials), rocks, a `dustWave` ring and smoke.
  Nearby repeat slams merge into one growing crater; an airborne victim's crater waits for their landing
  (`groundMark`, impact debt).
- Decals are Lambert quads (lit, shadowed, dimmed in super flashes) sharing one program per kind; `onBeforeCompile`
  adds the ring/grass/wall clip, the reveal, the pixel dissolve and the hot key (pure white texels glow in the tint,
  then cool). The training room draws them as holo outlines, the domain hides them, and the ring is clean every round.
- Art: `public/decals/atlas.json` + pages (`npm run sprites decals`, ppu 64, pages per style group), merged per name
  over the procedural pages of `src/art/decalPainter.js` (painted at boot). A match uploads at most 4 pages
  (`prepare`). `?debug`: `groundDemo()`, `groundTest(force, style)`; `fx.ground.stats()` for soaks.

## World art: approval gate and candidate preview

- The packer ships world art (effects, crowd, stage, NPCs, title art) only after the user approved it, at the approved
  version. `node tools/pack-sprites.mjs vfx crowd stage npc ui --candidates` packs every latest candidate into
  `public/preview/<kind>/` instead of the shipped folders; that folder is git-ignored, so it never
  deploys. `?art=custom` makes the loaders prefer it (`fetchAtlasJson` in `src/core/artIndex.js`), which is how
  unapproved effects and spectators are reviewed in a real match.
- **Crowd:** `npm run sprites crowd` turns each approved spectator (`worldArt.crowd.batches.*.items` in the
  manifest, highest approved version) into three 64 x 96 cells (idle, cheer, shocked) of
  `public/crowd/atlas.png` + `atlas.json` (ADR 0008 layout: 21 spectators per 64-cell row, ppu 50, pivot
  [32, 94]); idle is scaled to the roster's height class. `loadCrowdAtlas()` in `src/world/arena.js` swaps it
  into the instanced crowd; without it the code-painted crowd stays.
- **Stage slots:** `buildArena` registers every painted texture under its slot name (`slotTex`, art/stage/ASSETS.md;
  `repeatTex` clones join their base's slot). `loadStageArt()` (`src/world/worldArt.js`) reads
  `public/stage/manifest.json` and `arena.applyStageArt()` swaps the image of every texture of a listed slot (dispose,
  new image, nearest filtering), so geometry and repeat counts, and therefore world coverage, never change.
- **NPCs:** `loadNpcArt()` reads `public/npc/<id>/anims.json` + `sheet.png` for each entry of `NPCS` (placement,
  mirroring); `arena.setNpcArt()` places one `NpcSprite` billboard per sheet (unlit, dimmed with the crowd; the announcer
  sheet hides the painted announcer). `Game` calls `arena.npcCue(kind)` on intro, round start, supers, ultimates,
  clashes, KOs and round end; `NPC_CUES` maps each event to an animation, priority and hold time.
- **Title art:** `loadUiArt()` reads `public/ui/manifest.json`; `Menus.title()` shows the logo image instead of the CSS
  logo and the key art behind it.
- **Ground decals (packer side, ADR 0024):** `npm run sprites decals` (`tools/pack-decals.mjs`, called by the sprite
  packer with its image helpers) packs each approved decal name (`decals.items` / `worldArt.decal` in the manifest) into
  `public/decals/atlas.json` + one PNG page per page set (`decals_<set>[_n].png`, each <= 2048 x 2048; base + edge share
  the 2 floor pages, chakra + ki, lightning + fire and cursed one each, so a pairing needs at most the engine's 4 pages):
  `{ ppu: 64, pages, pageSizes, decals: { <name>: { page, w, h, frames: [[x, y]...], mode, tinted, group, directional?,
  hotKey?, tile?, version } } }`. The names, cells and per-image variant counts are the engine's contract (`DECAL_SPECS`);
  pure #FFFFFF texels are the hot key the engine glows; `tile` variants span the full cell width.
  Art: `art/decals/`.
- `Effects.spawn(name, x, y, z, opts)` creates a camera-facing quad with a tint `color` (white art is
  tinted at runtime), `glow` (HDR boost into bloom), optional velocity, gravity, spin, follow and loop.
  `Effects.keep(id, ...)` updates a persistent effect (auras, hand orbs, clash glow).
- **Power-ups** (ADR 0023): `chargeFx.chargeTick(game, f, t, frozen)` runs a fighter's charge style each sim frame.
  Body spots live in the sprite's billboard plane (feet + camera right x side + camera up x height), so "behind the
  body" holds however far the camera pitches. `SpriteActor.auraShell()` makes an `AuraShell`, a child of the body
  mesh sharing its uvRect uniform (it inherits the billboard, flip and scale); `chargeEnd` hides it and drops held
  effects when the charge ends. Charge sprites are tagged `charge` (`chargeBar` for bar beats, `chargeKeep` for held
  ones) so tests can count them.
- `Overlay` is a 2D canvas over the game for anime speed lines, full-screen flashes and impact frames.

## UI layer

The HUD and menus are **DOM** (`#ui`) over the WebGL canvas (`#app`), styled in `src/style.css`. Menus use a
tiny `el()` helper and a generic `list()` with keyboard/gamepad navigation (`Menus.handle(events)`).
The menus never touch game state directly. They call `Game` methods (`startMatch`, `startTraining`,
`pause`, `quitToTitle`). Every way back from a match to the menus (`exitTraining`, `quitToTitle`, results →
CHARACTER SELECT) goes through `Game.toMenu(open)`: it tears the match down, hides the old screen, then opens the next
one, falling back to the title (with a `[menus]` console error) if that throws. The SELECT MODE rows live in one
`MODES` table in `menus.js`, which `modeIndex()` reads too, so a screen returns to the right row.

## Audio

`src/core/audio.js` synthesizes everything (oscillators + noise buffers): one-shots via `audio.play(name, vol)`,
loops via `audio.loop(id, kind, variant)` / `stopLoop(id)` (the charge loop's variant is the style's `sound`: hum, boil,
crackle, calm), and a crowd bed with an excitement level. The first user gesture
calls `audio.init()`; every later pointerdown, touchend or keydown resumes a context that isn't running (iOS
'interrupted'), and a hidden tab suspends it and wakes it on return. `audio.setMuted(bool)` mutes, bound to `M` and the on-screen speaker toggle. To swap in recorded
samples later, change the cases in `play()`. Callers don't change.

**Music** ([ADR 0019](decisions/0019-generative-lofi-music.md)) is generative lo-fi, composed per song and never
looped:

- `audio.startMusic(mood)` with `'menu'` (title, menus, results; 72 bpm), `'battle'` (matches; 86 bpm) or
  `'training'` (training room and lab; 80 bpm, calmer). A mood already playing is a no-op; a new one crossfades
  (2 s out, 1.5 s in). `stopMusic(fade)` fades out.
- `src/core/musicPlan.js` composes a whole song from a seed (pad voicings, bass, koto melody, arpeggio, drums,
  chimes; tune it in `MOODS`). `src/core/music.js` performs it with a 0.3 s lookahead scheduler; only that much
  exists as nodes, a step more than 80 ms late is skipped (no burst after a stall), and the next song is composed
  when one ends.
- Hooks in `Game`: `audio.setMusicIntensity(excite)` each rendered frame of a fight (busier drums, arpeggio,
  brighter pad as it heats up); `audio.duckMusic(id, on)` for `pause`, `clash` (rhythm clash), `ko` (until the win
  pose) and `domain`; `audio.clearMusicDucks()` in `resetRound` / `cleanupMatch`; the results screen switches to
  `'menu'`.
- Volume: `audio.musicVolume` (0..1, default 0.7, localStorage `gcd.musicVol`) via `setMusicVolume(v)` /
  `stepMusicVolume(d)`; the MUSIC row in both pause menus. Bus chain: track (crossfade) -> duck gain -> 5.2 kHz
  lowpass -> `audio.music` (volume) -> master -> compressor. At 0% nothing is scheduled.
- Phones (and 4 cores or fewer) get a lite mode with about half the nodes. `?debug` exposes `music.state()`,
  `music.next()`, `music.seed(n)` and `?musicSeed=N`.

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
| a signature special | a `SPECIAL_MOVES` entry of an existing kind + the fighter's `kit` slot ([ADR 0009](decisions/0009-move-system-v2.md)); rush specials also use `SPECIALS` + `Effects.handTick` + a loop sound |
| a new special kind / second super | a `START`/`UPDATE` branch in `src/game/kit.js` + an ADR + `CpuBrain.pickSpecial` weight + where `MasterBrain` uses it (`kitOptions`, `pickBig`, `comboSpecial`); `aiShow.js` `toolsOf` lists it automatically |
| a projectile type | `PROJECTILES` in `moves.js` (sprite = a VFX atlas name) |
| a VFX effect | `VFX_ANIMS` + painter in `vfxPainter.js`; custom art via `art/vfx/` |
| a ground damage look | a `ground` field on the move / projectile / super / character; a new look is a `GROUND_STYLES` entry in `ground.js` (+ decal names in `DECALS`, decalPainter.js, and their art) |
| a sound | a case in `AudioEngine.play()` / `loop()` |
| a camera move | a mode in `CameraDirector.update()` |
| a menu screen | a method on `Menus` + CSS |
| a stage | today one arena (`src/world/arena.js`), the training room and the domain void, switched by `Game.setStage`. Multi-stage support is on the roadmap. |
