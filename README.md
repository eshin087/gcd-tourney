# GCD Tourney

A browser demo of an **HD-2D pixel anime arena fighter** with a Dragon Ball FighterZ-style
feel, modeled on Studio Genki's MythicTale tournament clip. It's a real 3D tournament
ground (tiled ring, mowed grass, temple, cheering crowd, gate) with pixel-art fighters
standing inside it, a cinematic camera, auras, super flashes and rhythm-duel ultimate clashes.

Four fighters are playable: Naruto (early Shippuden), Sasuke (Hebi era), Killua (Godspeed era) and Gojo.
Every fighter has the same baseline kit: directional specials, a second super and an ultimate (see
[Fighters](#fighters) and [ADR 0011](docs/decisions/0011-kit-baseline-and-balance.md)).
Their sprites are **3D-baked placeholders**: chibi models built in code,
animated with smooth keyframes and rendered into pixel-art sprite sheets at startup.
Hi-res pixel art replaces them one character at a time. It follows art spec v2
([ADR 0007](docs/decisions/0007-art-spec-v2-shippuden-256.md)): Shippuden-era designs at about
6.5 heads tall (serious anime proportions, not chibi) in 256 px cells. Codex generates the images,
and every version is queued in [art/REVIEW.md](art/REVIEW.md) for the user's approval (the packer packs
the newest candidate for preview; rejected ones move to `_rejected/`). See
[art/README.md](art/README.md) for the full pipeline, or [ASSETS.md](ASSETS.md) for the quick Sprite Lab import.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Then open http://127.0.0.1:5188

| Command | What it does |
|---|---|
| `npm run dev` | dev server on port 5188 |
| `npm run dev:alt` | the same on port 5200 (when 5188 is busy) |
| `npm run build` / `npm run preview` | production build into `dist/` / serve it |
| `npm run sprites [id\|vfx]` | pack generated art from `art/` into `public/` (see [art/README.md](art/README.md)) |
| `npm run test:sprites` | self-test for the sprite packer |

## Modes

- **VS CPU**: pick your fighter and the CPU's (Easy / Normal / Hard / **Impossible**). Impossible reads frame
  data: it parries and dodges what it sees coming, punishes whiffs, runs max-damage routes and wavedashes around
  you. It only reacts to what's on screen, so fast jabs and mix-ups are guesses for it too. Every level uses its
  whole kit over a match (specials, modes, supers, ultimates) and, from Normal up, parries, spot dodges, air
  dodges and wavedashes now and then.
- **2 Players**: shared keyboard, or two gamepads
- **CPU vs CPU**: pick two fighters and watch the computer play both sides. The level defaults to Impossible
  in its showman style: short flashy combos, every special and super in the kit, spells dodged and parried
  ("DODGE!" / "PARRY!"), wavedashes and power-ups, so you see what the engine can do; Esc / Start pauses and
  the results screen offers a rematch
- **Controls / training room** (new in the upcoming 0.3.0): keyboard, PlayStation and Xbox layouts (toggle
  between them), key and button rebinding saved in your browser, and a live training room where your fighter
  copies your inputs so you can try the controls in real time
- **Sprite Lab** (`/sprites.html`): preview every animation, import art strips, export sheets
- **Test lab** (`/lab.html?p1=naruto&p2=sasuke`): play any move of either fighter in one tap, step through every animation
  with its hit and hurt boxes, replay shared mechanics (ultimate and special clashes, throws, parries, dodges, wavedash,
  air combos, bounces, vanish, super dash), slow motion, frame step, record and replay on the dummy

Best of 3 rounds, 99 seconds each. The intro flythrough can be skipped with Enter / Start.

## Controls

These are the default bindings. You can rebind them in the controls menu.

| | VS CPU | P1 (2P) | P2 (2P) | Gamepad |
|---|---|---|---|---|
| Move | WASD / Arrows | WASD | Arrows | Left stick / D-pad |
| Light (auto combo) | J | F | , | □ / X |
| Heavy (launcher) | K | G | . | △ / Y |
| Special (tap, + direction) / charge ki (hold) | L | H | / | ○ / B |
| Jump | Space | Space | L | ✕ / A |
| Guard | Shift | L-Shift | ; | L1 / LB |
| Dash (with direction) / **super dash** (neutral) | O · double-tap | R · double-tap | K · double-tap | R1 / RB |
| **Ultimate beam** | **K + L** | **G + H** | **. + /** | **△ + ○** |
| **Vanish** | **Shift + L** | **L-Shift + H** | **; + /** | **L1 + ○** |
| **Super** (2nd super, 3 bars) | **H** or **B** | **T** | **'** | **L2 / LT** |
| **Throw** (close) / break a throw | **J + K** | **F + G** | **, + .** | **□ + △** |

Adding the SUPER button reset saved key bindings once (new storage key). Rebind again if you had
custom keys.

### The DBFZ-style toolkit

- **Auto combo**: Light ×4. The last hit is a smash that can **wall-bounce** off the ring's ki barrier.
- **Launcher**: Heavy (or Light ×3 → Heavy). Press **Jump** on hit to super-jump after them.
- **Air combo**: Light ×3 in the air, or end with **Heavy** (double-axe spike) for a **ground bounce**.
- **Super dash**: Dash with no direction. Homing flight that hits on contact, once per trip through the air.
- **Vanish** (1 bar): teleport behind the opponent and smash them. Also works while blocking.
- **Specials** (½-1 bar): tap Special for the neutral special. Hold a direction while you press it
  (→ toward the opponent, ↑, ↓) for the fighter's other specials. In the air: Special (+↓ for some
  fighters). The direction you hold when you *press* Special counts, so a quick tap works.
- **Ultimate** (3 bars, Heavy + Special): super flash with a cut-in, then the fighter's finisher (see Fighters).
  Fire yours into theirs (a beam, Hollow Purple or the Four-Tails pounce) and they **clash**: press Light, Heavy
  or Special as each ring closes on the target, then hold the last one (FINAL PUSH). Better timing pushes harder,
  presses off the beat push you back, and the winner's ultimate lands.
- **Special clash**: two rush specials meeting head-on (Rasengan into Chidori) get one ring; the closer press wins.
- **Super** (3 bars, SUPER button): the fighter's second super. A fighter without one fires their beam.
- **Air recover**: press any button while launched (hitstun decay makes long combos escapable).
- **Parry**: tap Guard just before a hit lands (6-frame window). No damage, and a melee attacker staggers, so
  punish. Mashing Guard doesn't work: each press locks parries out for 24 frames, but a parry re-arms at once.
- **Spot dodge**: hold Guard and push ↓. Briefly intangible, then a short recovery (gets slower if you spam it).
- **Air dodge**: Guard in the air, once per jump, with a direction to dodge that way.
- **Wavedash**: Jump, then right away Guard + a direction: you air dodge into the floor and slide. Attack out of
  the slide and the momentum carries into it.
- **Throw**: Light + Heavy up close grabs someone who's blocking (or parrying, or in a counter stance) and
  tosses them into the wall. Whiff it and you're wide open. If you get grabbed, press Light + Heavy quickly to
  **break** it. Jabs, jumps and spot dodges beat throws.
- KO with a big hit sends the loser flying out of the ring into the stands.
- Esc / P / Start: pause. M (or the small speaker toggle in the top corner): mute.
- A gamepad only takes control after you press one of its buttons, so an idle controller with a
  drifting stick can't move your fighter.

### Phone / tablet (landscape)

Open https://gcd-tourney.vercel.app on your phone and turn it sideways (portrait shows a "rotate" screen).
Android goes fullscreen on the first tap; on iPhone use Share > Add to Home Screen for a fullscreen app.

- **Left half of the screen:** a joystick appears under your thumb. Flick twice in a direction to dash.
- **Right side:** LIGHT, HEAVY, SPECIAL, JUMP, GUARD, DASH, plus **ULT** (Heavy + Special), **VANISH**
  (Guard + Special) and **SUPER**, so you never need a two-finger chord. They dim until you have the ki.
  Hold the joystick in a direction while you tap SPECIAL for the directional specials.
- **Top-left:** pause. In menus, tap items; the **BACK** button bottom-left replaces Esc. Tap the screen to
  skip the pre-fight intro.
- Button size: Pause > Controls > TOUCH tab (small / medium / large).

## Fighters

| | Special (tap) | → Special | ↑ Special | ↓ Special | air Special | Super (SUPER) | Ultimate |
|---|---|---|---|---|---|---|---|
| **Naruto** | Rasengan (rush) | Rasenshuriken, handheld (slower, grinds them in a wind vortex, costs him some HP) | Uzumaki Barrage (clones kick them up, heel drop; anti-air) | **Nine-Tails Cloak** (8 s: tougher, stronger, a bit faster) · **← Special:** Substitution (counter: a log takes the hit, he kicks them from behind, ½ bar) | shuriken; +↓ Barrage dive | **Shadow Clone Barrage** (clone combo, Giant Rasengan finish) | **Four-Tails** (the shroud boils up and he pounces on all fours; a catch is a mauling and a chakra roar; side-step during the roar to dodge it) |
| **Sasuke** | Chidori (rush) | Chidori Sharp Spear (short, instant lightning lance, ½ bar) | Lion's Barrage (rising kick, slam; anti-air) | Sharingan (counter: reads the attack and kicks back, ½ bar) | fireball; +↓ Lion's dive | **Kirin** (marks where they stand; lightning dragon hits hard, but they can dash out) | **Amaterasu** (black flames burn them for a few seconds; can't be blocked) |
| **Killua** | Narukami (lightning bolt, ½ bar) | Rhythm Echo (afterimage teleport behind, then a wall-bounce strike) | Thunderbolt (lightning leap and slam, anti-air) | **Godspeed** (8 s: faster, +12 % damage, dashes become lightning blinks) | Narukami; +↓ Thunderbolt dive | **Godspeed: Speed of Lightning** (dash, 8-hit afterimage flurry, slam) | **Godspeed: Whirlwind** (for 5 s his body counters up to 4 strikes or shots by itself; throw him or wait it out) |
| **Gojo** | Lapse: Blue (gravity vortex: pulls in, ticks, pops up) | Reversal: Red (repulsion blast, wall bounce) | Blink (teleport above them, ½ bar) | Infinity (counter: a melee hit freezes the attacker, ½ bar) | Reversal: Red | **Domain Expansion: Unlimited Void** (the void swallows the stage, opponent frozen ~2.5 s) | **Hollow Purple** (Red and Blue fuse into a huge orb that rolls across the stage and erases projectiles; leave its lane) |

**Gojo's Infinity passive:** projectiles stop before they touch him whenever he can act and has ki (each
volley of projectiles he stops costs him 15 ki; not while he's in hitstun or knocked down). Beams still connect, and so does everyone up close.
Design notes: [ADR 0009](docs/decisions/0009-move-system-v2.md) and [docs/COMBAT_DESIGN.md](docs/COMBAT_DESIGN.md).

## How it's built

- **Three.js + Vite**, no other runtime dependencies. Audio is synthesized with WebAudio, so there
  are no sound files.
- The scene renders at about 360p and is upscaled with nearest-neighbor sampling
  (`src/core/renderer.js`), so geometry, textures and sprites share one pixel grid. HDR effects
  bloom, and a light grade and vignette sit on top.
- **3D-baked sprites** (`src/art/rig/`): chibi characters built from smooth primitives, posed with
  keyframed joint angles, rendered with a toon shader into 112×112 cells. Contour lines, outlines,
  anime eyes and motion smears are added in a pixel post-pass. The output is a normal sprite sheet
  plus `anims.json`.
- Sprites are camera-facing planes anchored at the feet, with a hidden sun-facing copy that casts a
  silhouette shadow.
- A 60 Hz fixed-step simulation with render interpolation, hitstop and victim shake, slow-mo,
  directional camera kicks, and super-flash time freezes.
- **2.5D lanes + per-frame hitboxes**: fighters face screen-left or screen-right, attacks step into the
  opponent's depth lane, and a hit only lands where the fist or foot on the current sprite frame overlaps the
  body ([ADR 0005](docs/decisions/0005-25d-lanes-frame-hitboxes.md)).
- **Custom art**: `public/characters/<id>/sheet.png` + `anims.json` (spec v2: 256 px hi-res cells, pivot
  `[128,240]`, 128 px per world unit, a 4096 × 2816 sheet; written by `npm run sprites`) replace the baked
  placeholder when present. Missing animations fall back per animation, and missing files fall back to the
  bake. Hi-res sheets switch the renderer to a sharper `hd` detail mode automatically.

```
src/
  core/        renderer (pixel upscale + bloom), input (keyboard + gamepad pads), audio (synth)
  art/rig/     3D chibi rig, toon shader, pose/keyframe system, animation library, sprite baker
  art/         pixel helpers, environment textures, crowd painter, VFX painter, ChatGPT prompt guide
  characters/  roster: one file per fighter (model, stance, signature anims, stats, colors)
  world/       arena builder (ring, temple, stands + instanced crowd, gate, trees, sky)
  game/        game loop & match flow, fighter state machine, moves, CPU AI,
               projectiles & beams, effects, camera director
  ui/          HUD (bars, combo counter, cut-ins) + menus + controls panel (DOM overlay)
tools/         pack-sprites.mjs: packs art/ into public/ (npm run sprites)
art/           art briefs, image prompts, versioned raws, cleaned frames, review queue, tracker + manifest (not shipped)
public/characters/<id>/   sheet.png + anims.json (+ portrait/cutin/select.png) that replace the placeholder art
public/vfx/               optional custom VFX atlas
docs/          architecture, combat design, workflows, ADRs, task board
```

## Dev shortcuts

- `/?fight=naruto,sasuke&mode=solo&level=hard` skips the menus and starts a match (`level` = easy, normal, hard
  or impossible; `mode=versus` for 2P, `mode=cpu` to spectate two CPUs; that one defaults to `level=impossible`).
- `&art=custom` uses custom sheets even when they're incomplete (useful while art is in production).
- `/?debug` adds console helpers: `step(n)` (frame-step, pauses the live loop), `resumeLoop()`,
  `press('KeyJ')`, `hold('KeyD')` / `release('KeyD')`, `tap(['KeyK','KeyL'])`, `freezeCpu()`,
  `snap()` / `unsnap()`. See [docs/TESTING.md](docs/TESTING.md) for the test checklists and the CPU-vs-CPU soak.

## Docs

The project is set up for long-term work by a human plus AI tools: Claude Code for engine work, Codex for
art generation and production (the user reviews and approves every image), and optionally ChatGPT when the
user wants to generate an image by hand.

| Doc | What's in it |
|---|---|
| [CLAUDE.md](CLAUDE.md) | instructions for Claude Code: commands, architecture map, rules, testing, definition of done |
| [AGENTS.md](AGENTS.md) | instructions for Codex and other agents, focused on the art workflow |
| [CHANGELOG.md](CHANGELOG.md) | what changed in each version |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | modules, per-frame data flow, sprite and VFX pipelines, UI, audio |
| [docs/COMBAT_DESIGN.md](docs/COMBAT_DESIGN.md) | moveset, frame data, combo systems, ki, hit detection rules |
| [docs/ADDING_A_CHARACTER.md](docs/ADDING_A_CHARACTER.md) | end-to-end recipe for a new fighter |
| [docs/AI_COLLABORATION.md](docs/AI_COLLABORATION.md) | Claude / Codex / user roles, handoffs, the art review loop, review gates |
| [docs/TESTING.md](docs/TESTING.md) | manual checklists, debug helpers, soak test, performance budget |
| [docs/ROADMAP.md](docs/ROADMAP.md) | milestones from training mode to more characters, stages and online |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | branches, conventional commits, review checklist, versioning |
| [docs/TASKS.md](docs/TASKS.md) | the task board (owner + status) |
| [docs/STYLE_GUIDE_CODE.md](docs/STYLE_GUIDE_CODE.md) | coding conventions |
| [docs/decisions/](docs/decisions/README.md) | architecture decision records (ADRs) |
| [docs/agents/CODEX_PROMPT.md](docs/agents/CODEX_PROMPT.md) | copy-paste prompts to start Codex as the art producer (Prompt 0: spec v2 restart) |
| [art/README.md](art/README.md) | art pipeline entry point: spec, style guide, pipeline, tracker, per-character briefs and prompts |
| [art/REVIEW.md](art/REVIEW.md) | art review queue: every generated image version, newest first |
| [ASSETS.md](ASSETS.md) | sprite sheet format and the Sprite Lab quick-import path |

## A note on characters

Using recognizable anime characters is fine for a personal demo. A public or commercial
release would need licenses from the rights holders (Shueisha / Studio Pierrot for Naruto,
Shueisha / Madhouse for Hunter x Hunter, Shueisha / MAPPA for Jujutsu Kaisen, for example), or
original characters inspired by those archetypes.
