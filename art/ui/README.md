# Shared UI art

Art that belongs to the game rather than to one fighter: the **logo** and the **title-screen key
art**. Per-character UI (portrait, cut-in, select art) lives in `art/characters/<id>/ui/`, see
[SPEC.md](../SPEC.md#per-character-ui-images).

Prompts: [PROMPTS.md](PROMPTS.md). Status: [TRACKER.md](../TRACKER.md#shared-ui-step-11) and
`sharedUi` in [manifest.json](../manifest.json). This is step 11 of the
[generation order](../PIPELINE.md#generation-order): do it once the fighters' look is settled, so
the key art matches them.

## Folder

```
art/ui/
  README.md        this file
  PROMPTS.md       ChatGPT prompts
  raw/             raw ChatGPT output (logo_*.png, title_art_*.png), any size, magenta background
  final/           cleaned, exact-size files the game will use
```

## Assets

| asset | final file | size | background | status |
|---|---|---|---|---|
| logo: "GCD TOURNEY" + subtitle 天下一武闘祭 | `final/logo.png` | about 480 x 180 (exact size flexible; keep it crisp at 1x) | transparent | todo |
| title-screen key art | `final/title_art.png` | 640 x 360 (16:9, the game's internal resolution; shown at integer scale) | opaque | todo |
| title background only (optional) | `final/title_bg.png` | 640 x 360 | opaque | optional, for a layered/animated title later |

### Logo

- Text: **GCD TOURNEY**, with the subtitle **天下一武闘祭** (Tenka-ichi Budōsai, "the
  greatest martial-arts festival under heaven") under it.
- Style: a MythicTale-like anime fighting-game title, matching the current CSS logo on the title
  screen (`.logo-main` in `src/style.css`): heavy **italic, forward-slanted** letters, the whole
  logo tilted about 4 degrees counter-clockwise, filled with a **diagonal gradient from fiery
  orange `#ff6a10` through gold `#ffb000` and yellow `#ffe060` to sky blue `#7ae0ff` and deep blue
  `#2a7cff`** (orange vs blue = the two rivals), drawn as 5-7 hard color bands (stepped, not
  smooth), a thick dark navy outline `#1a1440` (2-3 px at final size), a white offset drop shadow
  down-right, then a second navy offset, a bevel highlight on the top edges and a few sparkle
  glints. The subtitle sits centered under it in white heavy Japanese gothic letters (like the
  Dela Gothic One font the title screen already uses) with a navy `#1a1440` outline.
- Must read at 1x on top of the busy arena: strong outline, high contrast, no thin strokes.
- Describe the style in words (the prompt already does); don't upload other games' logos to
  ChatGPT, and never copy their letterforms or names.

**Kanji check (ChatGPT often garbles CJK text).** The subtitle must be exactly these six
characters, in this order:

| 天 | 下 | 一 | 武 | 闘 | 祭 |
|---|---|---|---|---|---|
| ten (heaven) | ka (under) | ichi (one) | bu (martial) | tō (fight) | sai (festival) |

If any character is wrong or deformed, use the two-part route in [PROMPTS.md](PROMPTS.md): generate
the logo **without the subtitle**, then set the kanji with a real font in a pixel editor (Dela
Gothic One, already used by the title screen, or Noto Sans JP Black; both SIL Open Font License,
from Google Fonts), rendered at the final size without anti-aliasing, white with a navy outline.
Alternatively, keep the subtitle as the styled HTML text the title screen already renders.

### Title key art

- The two starter fighters face off in the tournament ring: Naruto on the left facing right,
  Sasuke on the right facing left, in fighting stances, auras flaring (orange vs blue).
- Setting (matches the in-game arena): a tiled stone tournament ring, mowed grass around it,
  a temple behind, packed cheering crowd stands, a big gate, trees, warm late-afternoon sky.
- Composition: keep the **top 35 % free** (sky) for the logo; fighters in the lower two thirds;
  readable at 640 x 360.
- HD-2D diorama look in crisp pixel art: light, bloom and glows drawn as hard-edged stepped
  shapes, no photographic blur.
- The fighters must match their approved model sheets (attach both).

## Cleaning and sizes

1. Save raw output in `raw/` (`logo_01.png`, `title_art_01.png`, ...).
2. Remove the magenta background (logo), crop, and downscale to the final size with
   nearest-neighbor or "mode" sampling (never bilinear/bicubic). Codex can do this with a small
   pngjs script or a pixel editor.
3. Check: crisp edges at 1x, no magenta fringe, logo readable on both a dark and a bright
   background, kanji correct.
4. Save in `final/`, update the status in TRACKER.md + manifest.json (`sharedUi`).

## Integration (not wired yet)

The game does not load these files yet. When the first one is approved, open a task for Claude in
`docs/TASKS.md`: copy to `public/ui/` and show it on the title screen (`src/ui/menus.js`) with
`image-rendering: pixelated` at an integer scale. Until then the title screen keeps its current
text logo.

## Backlog (not in the manifest yet)

Ideas for later shared UI art; add them to `manifest.json` (`sharedUi`) and TRACKER when someone
picks them up: round announcer graphics ("ROUND 1", "FIGHT!", "K.O.", "PERFECT"), character
select background, HUD bar frames, versus screen, pause menu frame.
