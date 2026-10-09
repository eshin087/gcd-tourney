# 0006. AI art pipeline: ChatGPT images, Node packer, Codex coordination

- Status: Accepted
- Date: 2026-10-08
- Deciders: User, Claude
- Amended by: [0007](0007-art-spec-v2-shippuden-256.md) (art spec v2 numbers and proportions replace the
  ones in Decision 1; Codex generates the images; every generated image gets a `_vNN` version and a row in
  `art/REVIEW.md`)

## Context
The user wants the game to look "stunning", with characters, projectiles and moves matching the original
manga/anime designs, and plans many more characters. Art is produced by the **user in the ChatGPT image
generator**. **Codex** and **Claude** have access to the same project folder. The 3D-baked placeholders
(ADR 0003) stay as the fallback. Image generators drift (size, palette, details), add anti-aliasing and
backgrounds, and can't reliably produce exact sprite sheets, so a cleanup and packing step is required.

## Decision
1. **Art target: hi-res pixel art.** 192×192 cells, 16 columns, pivot `[96,180]`, `pixelsPerUnit` 86 (the same
   world size as the placeholders), facing right, 3/4 view, ~4 to 4.5 heads tall, hard pixels, ≤ 32 colors per
   character. The full contract is in [art/SPEC.md](../../art/SPEC.md), and it's the single source of truth.
2. **Briefs as files.** `art/` holds the README, SPEC, STYLE_GUIDE, PIPELINE, TRACKER, `manifest.json`, a
   `characters/_template/` and per-character CHARACTER, ANIMATIONS, MOVES_AND_VFX and PROMPTS docs, plus
   `vfx/` and `ui/` briefs. Prompts describe visual traits and say "anime fan-art sprite", with fallback
   wording, rather than relying on character or artist names.
3. **Generation order.** A reference model sheet comes first (approved by the user), then strips per animation
   (one animation per image, a single row, magenta background), then VFX, then UI.
4. **Packer.** `tools/pack-sprites.mjs` (`npm run sprites [id|vfx]`, Node + `pngjs`) removes the background,
   splits strips, scales each strip to the manifest's `bodyHeight` with palette-preserving sampling, aligns
   the feet to the pivot, auto-generates boxes, applies `hitboxes.json` overrides, writes cleaned frames back
   to `frames/<anim>/`, and outputs `public/characters/<id>/sheet.png` + `anims.json` (`complete` when all CORE
   anims exist) plus UI PNGs. It also builds `public/vfx/atlas.*`, and prints a QA report.
5. **Runtime contract.** The game uses a custom sheet when it's present and `complete` (or with `?art=custom`),
   falls back per animation via `FALLBACK`, and falls back fully to the bake when files are missing or broken.
   The VFX atlas falls back per effect.
6. **Roles.** ChatGPT draws, Codex coordinates (next prompt, filing, packing, QA, statuses, new briefs), and
   Claude owns the packer, integration and engine. See [AI_COLLABORATION.md](../AI_COLLABORATION.md).
7. **Status tracking.** `todo → raw → packed → approved` per asset in the manifest and TRACKER.

## Alternatives considered
- **Hand-pixeling everything**: highest quality, but not feasible at this scope.
- **Sprite Lab in-browser import only** (the earlier path in ASSETS.md): fine for quick tests, but manual,
  not scriptable for Codex, and not reproducible. It stays as a quick-preview path.
- **Upscaling the 3D bake as the final art**: consistent, but doesn't reach the anime-accurate look the user wants.
- **Larger cells (256+)**: more detail, but sheet sizes exceed safe texture limits and generation consistency drops.

## Consequences
- Art production is parallel to engine work and resumable by any tool from repo state alone.
- Re-packing is deterministic from `raw/` and `frames/`. Raw images must be kept (they may need Git LFS later).
- Spec changes are expensive. They touch the packer, the game loader, every brief and the manifest, so they
  require an ADR.
- Legal: recognizable characters are acceptable for a personal or fan demo only. A public or commercial
  release needs licenses or original characters (see ROADMAP v1.0).
- The Sprite Lab's prompt builder (`chatgptPrompt` in animGuide.js) still targets the old chibi 112 px look
  and must be aligned (TOOL-002). Until then, the `art/` PROMPTS files win.
