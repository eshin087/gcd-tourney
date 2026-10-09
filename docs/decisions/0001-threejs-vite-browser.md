# 0001. Three.js + Vite, browser-only, plain JavaScript

- Status: Accepted
- Date: 2026-10-04 (recorded retroactively 2026-10-08)
- Deciders: User, Claude

## Context
The goal is a shareable demo of an anime arena fighter in the visual style of an HD-2D tournament clip:
a real 3D environment with pixel-art characters, a cinematic camera, bloom and lots of VFX. It should run
by opening a URL, iterate fast, and be easy for several AI tools to read and modify. There's no team, no
build infrastructure, and no need for consoles or app stores yet.

## Decision
- Build a **browser game** with **Three.js** for rendering and **Vite** for dev server and bundling.
- Write **plain JavaScript ES modules** with no framework and no TypeScript.
- **No runtime dependencies besides `three`.** Audio is synthesized with WebAudio, and textures, crowd, VFX
  and placeholder fighters are generated in code, so the demo ships with almost no binary assets.
- The dev server runs on `127.0.0.1:5188` (`strictPort`). A second script (`dev:alt`) uses port 5200 for
  parallel sessions. Two HTML entries: the game and the Sprite Lab.

## Alternatives considered
- **Godot / Unity**: excellent for fighters, but heavier to set up, binary scene files are harder for AI
  tools to diff and edit, and web export is less direct.
- **Phaser / PixiJS (pure 2D)**: simpler for sprites, but the HD-2D look needs real 3D geometry, lighting,
  shadows and a perspective camera.
- **TypeScript**: better tooling, but it adds a build step and type churn. Plain ESM keeps the
  edit-reload loop instant and readable for every agent. Can be revisited by ADR.

## Consequences
- Fast iteration (Vite HMR), trivial hosting (static `dist/`), and readable diffs for Claude and Codex.
- Performance has to be watched manually (one main thread, startup baking). See TESTING.md.
- No type safety: data contracts (anims.json, move tables, character files) must be documented and linted
  (TOOL-004).
- Gamepad, audio unlock and fullscreen follow browser rules (gesture required, gamepad activation on press).
- Node tooling (the sprite packer) is a separate dev-only concern and may use dev dependencies (`pngjs`).
