# Assets

All art work now lives in **[art/](art/README.md)**. Start there.

| need | go to |
|---|---|
| what to draw next, and how | [art/PIPELINE.md](art/PIPELINE.md) (generation order, step by step, QA checklist) |
| exact sizes, pivot, animation list, anims.json, hitboxes | [art/SPEC.md](art/SPEC.md) (source of truth) |
| look, posing, making hits connect, prompt wording | [art/STYLE_GUIDE.md](art/STYLE_GUIDE.md) |
| status of every asset | [art/TRACKER.md](art/TRACKER.md) + [art/manifest.json](art/manifest.json) |
| a character's brief and ChatGPT prompts | `art/characters/<id>/` (new character: copy `art/characters/_template/`) |
| effects (sparks, Rasengan orb, lightning...) | `art/vfx/` |
| logo and title art | [art/ui/](art/ui/README.md) |

## How art reaches the game

```
art/characters/<id>/raw/<anim>.png  --npm run sprites <id>-->  public/characters/<id>/sheet.png + anims.json
art/vfx/raw/<effect>.png            --npm run sprites vfx --->  public/vfx/atlas.png + atlas.json
```

The game uses a character's packed sheet once every core animation exists (`"complete": true` in
`anims.json`); preview a partial sheet with `?art=custom`. Anything missing falls back to the
procedural art, so characters and effects can be replaced one at a time.

## Sprite Lab

Open **http://127.0.0.1:5188/sprites.html** (or *Sprite Lab* in the main menu) while `npm run dev`
is running. It plays every animation of each fighter at game speed (the procedural placeholder, or
the custom sheet in `public/characters/<id>/`), with a flip toggle and 2x-4x zoom. Use it to
review packed strips. It can also:

- show a quick ChatGPT prompt per animation (**Copy prompt**). Do not use the Sprite Lab "Copy
  prompt" for production art: it still targets the old chibi placeholder (TOOL-002). Use
  `art/characters/<id>/PROMPTS.md`,
- quick-import a strip to try a pose (drop it on the drop zone: background removal, frame split,
  body-height scaling, feet alignment), then **Download sheet.png / anims.json**.

The Sprite Lab importer was built for the old 112 px placeholder cells. For the hi-res production
art (192 px cells), use `npm run sprites`, which follows [art/SPEC.md](art/SPEC.md).

## Placeholder art

Until real art is packed, each fighter is **baked from a 3D chibi model at startup**
(`src/art/rig/`): colors, outfit and hair in `src/characters/<id>.js` (`model`), the shared
moveset in `src/art/rig/anims.js`. That code is the lead engineer's (see `CLAUDE.md`).
