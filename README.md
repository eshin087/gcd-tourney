# GCD Tourney

A browser demo of an **HD-2D pixel anime arena fighter** with a Dragon Ball FighterZ-style
feel, modeled on Studio Genki's MythicTale tournament clip. It's a real 3D tournament
ground (tiled ring, mowed grass, temple, cheering crowd, gate) with pixel-art fighters
standing inside it, a cinematic camera, auras, super flashes and beam clashes.

The two starter fighters are a Naruto-style orange fox ninja and a Sasuke-style
lightning ninja. Their sprites are **3D-baked placeholders**: chibi models built in code,
animated with smooth keyframes and rendered into pixel-art sprite sheets at startup.
Hi-res pixel art generated with ChatGPT replaces them one character at a time. See
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
| `npm run sprites [id\|vfx]` | pack ChatGPT art from `art/` into `public/` (see [art/README.md](art/README.md)) |
| `npm run test:sprites` | self-test for the sprite packer |

## Modes

- **VS CPU**: pick your fighter and the CPU's (Easy / Normal / Hard)
- **2 Players**: shared keyboard, or two gamepads
- **Controls / training room** (new in the upcoming 0.3.0): keyboard, PlayStation and Xbox layouts (toggle
  between them), key and button rebinding saved in your browser, and a live training room where your fighter
  copies your inputs so you can try the controls in real time
- **Sprite Lab** (`/sprites.html`): preview every animation, import ChatGPT art, export sheets

Best of 3 rounds, 99 seconds each. The intro flythrough can be skipped with Enter / Start.

## Controls

These are the default bindings. You can rebind them in the controls menu.

| | VS CPU | P1 (2P) | P2 (2P) | Gamepad |
|---|---|---|---|---|
| Move | WASD / Arrows | WASD | Arrows | Left stick / D-pad |
| Light (auto combo) | J | F | , | □ / X |
| Heavy (launcher) | K | G | . | △ / Y |
| Special (tap) / charge ki (hold) | L | H | / | ○ / B |
| Jump | Space | Space | L | ✕ / A |
| Guard | Shift | L-Shift | ; | L1 / LB |
| Dash (with direction) / **super dash** (neutral) | O · double-tap | R · double-tap | K · double-tap | R1 / RB |
| **Ultimate beam** | **K + L** | **G + H** | **. + /** | **△ + ○** |
| **Vanish** | **Shift + L** | **L-Shift + H** | **; + /** | **L1 + ○** |

### The DBFZ-style toolkit

- **Auto combo**: Light ×4. The last hit is a smash that can **wall-bounce** off the ring's ki barrier.
- **Launcher**: Heavy (or Light ×3 → Heavy). Press **Jump** on hit to super-jump after them.
- **Air combo**: Light ×3 in the air, or end with **Heavy** (double-axe spike) for a **ground bounce**.
- **Super dash**: Dash with no direction. Homing flight that hits on contact, once per trip through the air.
- **Vanish** (1 bar): teleport behind the opponent and smash them. Also works while blocking.
- **Signature rush** (1 bar): Rasengan / Chidori. **Projectile** (½ bar): Special in the air.
- **Ultimate** (3 bars): super flash with a cut-in, then a beam. Fire back during their beam
  to start a **beam clash** and mash.
- **Air recover**: press any button while launched (hitstun decay makes long combos escapable).
- KO with a big hit sends the loser flying out of the ring into the stands.
- Esc / P / Start: pause. M (or the small speaker toggle in the top corner): mute.
- A gamepad only takes control after you press one of its buttons, so an idle controller with a
  drifting stick can't move your fighter.

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
- **Custom art**: `public/characters/<id>/sheet.png` + `anims.json` (192 px hi-res cells, written by
  `npm run sprites`) replace the baked placeholder when present. Missing animations fall back per animation,
  and missing files fall back to the bake.

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
art/           art briefs, ChatGPT prompts, raw and cleaned frames, tracker + manifest (not shipped)
public/characters/<id>/   sheet.png + anims.json (+ portrait/cutin/select.png) that replace the placeholder art
public/vfx/               optional custom VFX atlas
docs/          architecture, combat design, workflows, ADRs, task board
```

## Dev shortcuts

- `/?fight=naruto,sasuke&mode=solo&level=hard` skips the menus and starts a match.
- `&art=custom` uses custom sheets even when they're incomplete (useful while art is in production).
- `/?debug` adds console helpers: `step(n)` (frame-step, pauses the live loop), `resumeLoop()`,
  `press('KeyJ')`, `hold('KeyD')` / `release('KeyD')`, `tap(['KeyK','KeyL'])`, `freezeCpu()`,
  `snap()` / `unsnap()`. See [docs/TESTING.md](docs/TESTING.md) for the test checklists and the CPU-vs-CPU soak.

## Docs

The project is set up for long-term work by a human plus three AI tools (Claude Code for engine work,
ChatGPT for art, Codex for art coordination).

| Doc | What's in it |
|---|---|
| [CLAUDE.md](CLAUDE.md) | instructions for Claude Code: commands, architecture map, rules, testing, definition of done |
| [AGENTS.md](AGENTS.md) | instructions for Codex and other agents, focused on the art workflow |
| [CHANGELOG.md](CHANGELOG.md) | what changed in each version |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | modules, per-frame data flow, sprite and VFX pipelines, UI, audio |
| [docs/COMBAT_DESIGN.md](docs/COMBAT_DESIGN.md) | moveset, frame data, combo systems, ki, hit detection rules |
| [docs/ADDING_A_CHARACTER.md](docs/ADDING_A_CHARACTER.md) | end-to-end recipe for a new fighter |
| [docs/AI_COLLABORATION.md](docs/AI_COLLABORATION.md) | Claude / ChatGPT / Codex roles, handoffs, review gates |
| [docs/TESTING.md](docs/TESTING.md) | manual checklists, debug helpers, soak test, performance budget |
| [docs/ROADMAP.md](docs/ROADMAP.md) | milestones from training mode to more characters, stages and online |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | branches, conventional commits, review checklist, versioning |
| [docs/TASKS.md](docs/TASKS.md) | the task board (owner + status) |
| [docs/STYLE_GUIDE_CODE.md](docs/STYLE_GUIDE_CODE.md) | coding conventions |
| [docs/decisions/](docs/decisions/README.md) | architecture decision records (ADRs) |
| [docs/agents/CODEX_PROMPT.md](docs/agents/CODEX_PROMPT.md) | copy-paste prompts to start Codex as the art coordinator |
| [art/README.md](art/README.md) | art pipeline entry point: spec, style guide, pipeline, tracker, per-character briefs and prompts |
| [ASSETS.md](ASSETS.md) | sprite sheet format and the Sprite Lab quick-import path |

## A note on characters

Using recognizable anime characters is fine for a personal demo. A public or commercial
release would need licenses from the rights holders (Shueisha / Studio Pierrot for Naruto,
for example), or original characters inspired by those archetypes.
