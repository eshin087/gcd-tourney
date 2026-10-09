# Code style guide

These are the conventions the existing code already follows. When in doubt, **match the surrounding code**.
No formatter or linter is configured yet. Adding one is an ADR-level decision, because reformatting the
whole tree would churn every file.

## Language and modules

- Plain **JavaScript ES modules** (`"type": "module"`). No TypeScript, no JSX, no framework.
- Browser code lives in `src/`. Node tooling (`tools/*.mjs`) may use Node built-ins and dev dependencies only.
- Three.js: `import * as THREE from 'three'`. Addons come from `'three/addons/...'`.
- Use relative imports with the `.js` extension (`import { MOVES } from './moves.js'`).
- Prefer named exports. A default export is used only for character definitions (`export default { id: ... }`).
- **No new runtime dependencies** without an ADR. Dev dependencies for tooling are fine when documented.

## Formatting

- 2-space indent, single quotes, semicolons, trailing commas in multi-line literals.
- Logic lines aim for ≤ 140 characters. **Data tables may be long one-liners** (one move per line in `MOVES`,
  one keyframe per line in anims), because scanning a column of numbers beats wrapping.
- Short `if` bodies can share a line (`if (!def.hittable) return;`). Use braces for anything longer.
- Group related assignments on one line when they're symmetric (`this.vel.x *= 0.6; this.vel.z *= 0.6;`).

## Naming

| Thing | Style | Example |
|---|---|---|
| files | camelCase `.js` | `spriteLab.js`, `vfxPainter.js` |
| classes | PascalCase | `SpriteActor`, `CameraDirector` |
| functions, methods, variables | camelCase | `loadFighterAsset`, `takeHit` |
| constant tables and tunables | UPPER_SNAKE | `MOVES`, `RING_HALF`, `LANE` |
| animation and move names | camelCase strings, **fixed contract** | `'airLight1'`, `'beamCharge'` |
| character ids | lowercase alphanumeric | `'naruto'`, `'sasuke'` |
| events / hooks on Game | `onSomething` | `onHit`, `onWallBounce` |

Short local names are fine in tight math (`f`, `o`, `m`, `t`, `dx`, `A/B/C` for phase boundaries) when the
surrounding code makes them obvious.

## Comments

- Each module starts with a 1 to 3 line header that says what it is and why it exists.
- Comments explain **why**: intent, game-feel reasoning, non-obvious constraints, gotchas. Don't narrate
  what the code plainly does.
- Data tables document their fields once at the top (see the header of `src/game/moves.js`).
- GLSL strings are tagged `/* glsl */` for editor highlighting.

## Units and conventions

- Simulation time is in **frames at 60 fps**. Velocities are units per second, integrated with `DT`.
- World units are **floor tiles**. `pos.y` is height above the ring surface (`RING_TOP` is added only when
  placing meshes).
- Pose data uses degrees. Everything else uses radians.
- Sprite pixel coordinates are frame-local, origin top-left, facing right. The pivot is the feet.
- Screen-relative input goes through `cam.dirFromInput()`. Fighters face via `side` (+1 screen-right, -1 left).

## Architecture rules

- **Gameplay numbers live in data**: `src/game/moves.js`, `src/game/constants.js`, `src/characters/<id>.js`.
  Logic reads them and doesn't hard-code them.
- **No character special-casing** in shared code. Add a field to the character definition.
- **The CPU uses the Pad interface.** AI never reaches into fighter state to act, only to observe.
- **Fail soft** for content: missing art, VFX or UI images fall back with one console line (`[sprites]`,
  `[vfx]` prefixes). Bugs in code should still throw loudly in dev.
- Game ↔ UI: menus and the HUD call `Game` methods and read state. The game calls `hud.*` / `menus.*` for
  presentation. Don't let DOM code mutate fighter state.
- Debug-only helpers live behind `?debug` in `src/main.js`.

## Performance

- Avoid allocations in per-frame hot paths. Reuse module-level temporaries (`const v3 = new THREE.Vector3()`)
  where it's easy. Occasional `new Vector2` in event code (on hit) is fine.
- Dispose what you create: materials, textures and geometries made per match or per effect
  (`SpriteActor.dispose`, `Effects.kill`).
- Textures for pixel art use `NearestFilter`, no mipmaps, `SRGBColorSpace`.
- Keep startup baking cheap (< 1 s per character). Do heavy work once at load, not per frame.

## DOM and CSS

- Build DOM with the small `el(tag, cls, html)` helper. Put all styles in `src/style.css` with CSS variables
  for theme colors.
- UI should be readable at 720p and 4K. Use relative units and `image-rendering: pixelated` for pixel art.
- Keyboard and gamepad must both navigate every menu (`Menus.list` handles `up/down/confirm/back`).

## Error handling and logging

- `console.info` for one-line lifecycle facts (`[sprites] baked naruto from 3D in 412 ms`).
- `console.warn` for recoverable content problems (a broken custom sheet, then fallback).
- No `console.log` spam in committed code. Remove temporary logs before committing.
- `try/catch` only around I/O and optional content (fetch, image decode, localStorage).

## Tools (`tools/`)

- Node ESM (`.mjs`), runnable via an npm script, with a clear console report and exit code 0 unless a real
  error occurred.
- Never crash on missing optional folders. Report and continue.
- Tools write only to their documented outputs (`public/characters/**`, `public/vfx/**`, cleaned
  `art/**/frames/**`).
