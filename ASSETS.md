> **Scale and anatomy ([ADR 0029](docs/decisions/0029-title-style-scale-baseline.md), 2026-10-11):** the approved title-style cells and the [production contract](art/scale/title-style-pilot/PRODUCTION_CONTRACT.md) set every fighter's scale and anatomy, including new characters. The 200 px body, 31 px head, 6.5/7-head, canon-height and pixels/cm numbers in this file describe today's shipped art or a superseded direction; never use them as targets for new drawings. Inspect the actual quantized atlas: `--quantize 48` does not refresh `frames/`.

# Assets

All art work now lives in **[art/](art/README.md)**. Start there. Current spec: **hi-res sprite spec v2**
([ADR 0007](docs/decisions/0007-art-spec-v2-shippuden-256.md)): Naruto Shippuden designs, about 6.5
heads tall (not chibi), 256 x 256 cells, pivot [128, 240], 128 px per world unit, <= 48 colors per
character, and a `_vNN` version on every generated image.

| need | go to |
|---|---|
| what to draw next, and how | [art/PIPELINE.md](art/PIPELINE.md) (generation order, step by step, QA checklist) |
| exact sizes, pivot, animation list, anims.json, hitboxes | [art/SPEC.md](art/SPEC.md) (source of truth) |
| look, posing, making hits connect, prompt wording | [art/STYLE_GUIDE.md](art/STYLE_GUIDE.md) |
| what is waiting for review (newest first) | [art/REVIEW.md](art/REVIEW.md) |
| status of every asset | [art/TRACKER.md](art/TRACKER.md) + [art/manifest.json](art/manifest.json) |
| a character's brief and image prompts | `art/characters/<id>/` (new character: copy `art/characters/_template/`) |
| effects (sparks, Rasengan orb, lightning...) | `art/vfx/` |
| logo and title art | [art/ui/](art/ui/README.md) |

## How art reaches the game

```
art/characters/<id>/raw/<anim>_vNN.png  --npm run sprites <id>-->  public/characters/<id>/sheet.png + anims.json
art/vfx/raw/<effect>_vNN.png            --npm run sprites vfx --->  public/vfx/atlas.png + atlas.json
```

The game uses a character's packed sheet once every core animation exists (`"complete": true` in
`anims.json`); preview a partial sheet with `?art=custom`. The packer uses the highest `_vNN` version
of each strip. Anything missing falls back to the procedural art, so characters and effects can be
replaced one at a time.

Every fighter has a kit ([ADR 0009](docs/decisions/0009-move-system-v2.md), baseline
[ADR 0011](docs/decisions/0011-kit-baseline-and-balance.md)), so every fighter has four extra optional strips:
`specialForward`, `specialUp`, `specialDown` and `superPose` (Naruto's and Sasuke's briefs:
`art/characters/<id>/KIT.md` until Codex merges them). When one is missing it
falls back to `special`, `special`, `charge` and `taunt`. A character drawn taller or shorter than
the 200 px standard body (Killua 182 px, Gojo 215 px) follows
[ADR 0010](docs/decisions/0010-per-character-body-scale.md).

Every fighter can also draw three optional **tech** strips ([ADR 0030](docs/decisions/0030-tech-recovery-animations.md),
art/SPEC.md "Tech poses"): `techGround` (tech in place), `techRoll` (tech roll) and `wallTech` (wall tech). Until a
fighter has one, the game keeps showing `land` / `airRecover` / `jumpUp` for that tech. Per-frame brief and prompts:
`art/characters/TECH_POSES_BRIEF.md`.

Every fighter with an energy move (all but Luffy) can draw one optional **struggle** strip
([ADR 0034](docs/decisions/0034-beam-clash-visuals.md)): `beamStruggle`, braced and pushing that move into the
other side's in a beam clash, and `beamStruggleAir`, the same from the air for a fighter with an air energy shot. Until
they exist the clash shows `beamFire` and the `throw` release frame. Brief: `art/characters/BEAM_STRUGGLE_BRIEF.md`.
The beam clash also reads five optional VFX effects (`clashBurst`, `streamBolt`, `streamLance`, `streamFlame`,
`redOrb`; art/vfx/EFFECTS.md "Beam clash"); each falls back to a procedural stand-in.

Every attack and both hit reactions can also have one optional **alt** strip
([ADR 0031](docs/decisions/0031-attack-alt-animations.md), art/SPEC.md "Attack alts"): `light1Alt`, `light2Alt`,
`light3Alt`, `light4Alt`, `heavyAlt`, `airLight1Alt`, `airLight2Alt`, `airLight3Alt`, `airHeavyAlt`, `hurtHighAlt` and
`hurtLowAlt`. An alt has its base's frame count and phases and strikes at the base's height and reach with another
technique; the game alternates the two in a fixed pattern and plays the base while the alt is missing. The packer warns
when an alt's frames, phases or strike differ from its base's. Review with `?alts=1` (every alt) or `?alts=0` (none).

## Sprite Lab

Open **http://127.0.0.1:5188/sprites.html** (or *Sprite Lab* in the main menu) while `npm run dev`
is running. It plays every animation of each fighter at game speed, with a flip toggle and 2x-4x
zoom. By itself it always shows the baked 3D placeholder; it does not load the packed sheet. To
review packed strips, open `/sprites.html?c=<id>`, click **Load full sheet (.png + .json)…** and
pick `public/characters/<id>/sheet.png` and `anims.json`. It can also:

- show a quick image prompt per animation (**Copy prompt**). Do not use the Sprite Lab "Copy
  prompt" for production art: it still targets the old chibi placeholder (TOOL-002). Use
  `art/characters/<id>/PROMPTS.md`,
- quick-import a strip to try a pose (drop it on the drop zone: background removal, frame split,
  body-height scaling, feet alignment), then **Download sheet.png / anims.json**.

The Sprite Lab importer was built for the old 112 px placeholder cells. For the hi-res production
art (256 px cells, spec v2), use `npm run sprites`, which follows [art/SPEC.md](art/SPEC.md).

## Placeholder art

Until real art is packed, each fighter is **baked from a 3D chibi model at startup**
(`src/art/rig/`, 112 px cells, ppu 44): colors, outfit and hair in `src/characters/<id>.js`
(`model`), the shared moveset in `src/art/rig/anims.js`. That code is the lead engineer's (see
`CLAUDE.md`). The placeholder stays chibi until a separate restyle task; the spec v2 art packs
replace it character by character.
