# art/vfx: effect sprites (hit sparks, auras, projectiles, smoke...)

This folder holds the bitmap art for every **visual effect** in GCD Tourney. Today the game draws
all effects procedurally (`src/art/vfxPainter.js`, baked at startup into a 64 px-cell atlas). When
custom art exists here **and the user approved it** (`approvedVersion` in `art/manifest.json`),
`npm run sprites vfx` packs it into `public/vfx/atlas.png` + `public/vfx/atlas.json` and the game uses it
instead. **Any effect without approved art keeps its procedural fallback**, so effects can be replaced one
at a time. To see candidates in a match before approval: `node tools/pack-sprites.mjs vfx --candidates`
(writes the git-ignored `public/preview/vfx/`), then open the game with `?art=custom`.

Spec v2 ([ADR 0007](../../docs/decisions/0007-art-spec-v2-shippuden-256.md)) changed the character
cells (256 px) but **not the VFX cells**: they stay 128 x 128 at ppu 56. What v2 adds here is the
versioned file names (`raw/<effect>_vNN.png`) and the review queue ([../REVIEW.md](../REVIEW.md)).

Who does what:

| Role | Job in this folder |
|---|---|
| **Codex** | Picks the next effect (from `../TRACKER.md` / `../manifest.json`), generates the strip with its built-in image generator using `PROMPTS.md` (style sheet attached once approved), saves it as the next `raw/<effect>_vNN.png`, queues it in `../REVIEW.md`, runs `npm run sprites vfx`, checks the result, records the user's decision and updates status. |
| **User** | Reviews each candidate in `../REVIEW.md` (approve / reject, in chat or in the table). Can still generate a strip in ChatGPT by hand; same naming. |
| **Claude (Claude Code)** | Engine side (`src/game/effects.js`), packer (`tools/pack-sprites.mjs`), new effect names, beam art support. |

## Files

| File | What it is |
|---|---|
| `README.md` | This page: rules, folder layout, workflow, QA. |
| `EFFECTS.md` | The brief: every effect, what it does in the game, frame by frame, size, anchor, color rule, timing. Also *Beams (future)*. |
| `PROMPTS.md` | Copy-paste image prompts, one per effect, plus fix-up prompts. |
| `raw/` | Unedited generator output, versioned: `raw/<effect>_vNN.png` (v01, v02, ...; never overwritten or reused). The packer uses the highest version; a plain `raw/<effect>.png` only when no versioned file exists. |
| `raw/_rejected/` | Rejected candidates (names kept). Never packed. |
| `raw/_proposed/` | Character effects the engine does not use yet: `<charId>_<effect>_vNN.png`. Never packed (see "Adding a new effect"). |
| `frames/<effect>/` | Cleaned final frames: `frames/<effect>/<effect>_00.png`, `_01.png`, ... (128x128, transparent). |
| `reference/` | Optional style anchors to attach to the image generator so every effect matches: candidates `vfx_style_sheet_vNN.png`, the approved one copied to `vfx_style_sheet.png` (or a screenshot of an approved effect). Never packed. |

## The 20 engine effects (names are fixed: the engine looks them up by name)

| Effect | Frames | ms/frame | Color rule | Anchor | Used for |
|---|---|---|---|---|---|
| `spark` | 5 | 30 | white (tinted) | center | Crescent hit slash on every hit |
| `burst` | 5 | 35 | white (tinted) | center | Spiky impact star on heavy/smash hits, power-ups |
| `ring` | 6 | 35 | white (tinted) | center | Shockwave ring (hits, blocks, landings, dashes) |
| `dust` | 6 | 60 | full color | bottom | Footstep / dash / landing dust puffs |
| `smoke` | 7 | 55 | full color | center | Vanish "poof", explosion smoke |
| `shuriken` | 4 | 40 | full color | center | Thrown shuriken projectile (spin loop) |
| `fire` | 4 | 60 | full color | center | Fireball projectile (flicker loop) + trail |
| `flame` | 7 | 55 | white (tinted) | bottom | Ki aura flame tongue |
| `lightning` | 6 | 40 | white (tinted) | center | Lightning-blade hand crackle, beam clash bolts |
| `orb` | 6 | 40 | full color | center | Spiraling wind-sphere special in the hand (loop) |
| `glow` | 2 | 60 | white (tinted) + alpha | center | Soft light disc behind auras, hands, beams |
| `streak` | 6 | 45 | white (tinted) | bottom | Vertical aura light streak |
| `star` | 5 | 40 | white (tinted) | center | 4-point flare; frame 2 is also a tiny sparkle particle |
| `crater` | 3 | (variants) | full color | top-down decal | Floor crater after big slams |
| `lines` | 4 | 40 | white (tinted) | center | Radial impact lines on every hit |
| `bubble` | 6 | 50 | white (tinted) | center | Chakra bubble boiling off a power-up (Naruto) |
| `wisp` | 7 | 55 | white (tinted) | bottom | Thin energy wisp rising off a power-up (Sasuke, Naruto, Gojo) |
| `arc` | 6 | 40 | white (tinted) | center | One short electric arc over the body (Killua, Sasuke); random frame |
| `ripple` | 5 | 50 | white (tinted) | center | Faint round space ripple (Gojo's Infinity) |
| `naruto_chakraTail` | 6 | 60 | white (tinted) | bottom (base) | Naruto's one chakra tail at MAX ki (loop) |

Full detail per effect is in [`EFFECTS.md`](EFFECTS.md).

## Signature effects: the HD cell (ADR 0044)

A fighter's signature techniques are drawn at **twice the detail**: a **256 x 256 cell at 112 px per unit** (the
same world size per cell as the 128 px effects). The packer puts them on their own page, `public/vfx/atlas_hd.png`,
described by the `hd` block of `atlas.json`; the game reads each effect from whichever page holds it. Anchors: center
on (128, 128); bottom centered on x = 128 with the base on y = 240. Cleaned frames in `frames/<effect>/` are exactly
256 x 256. Everything else in this page applies (versions, approval, fill, color rule). Each has a small procedural
stand-in until its art is approved.

| Effect | Frames | ms/frame | Color rule | Anchor | Used for |
|---|---|---|---|---|---|
| `rasengan` | 8 | 40 | full color | center | Naruto's Rasengan in his palm (loop); the Shadow Clone Barrage's big Rasengan |
| `rasenganForm` | 6 | 45 | full color | center | the Rasengan forming during the startup |
| `rasenganBurst` | 8 | 45 | full color | center | the Rasengan's hit: grind, then spiral blast |
| `rasenshuriken` | 8 | 35 | full color | center | the Rasenshuriken held in his hand (loop) |
| `rasenshurikenDome` | 8 | 50 | full color | center | the sphere of wind blades grinding the victim (f2-f3 loop while it grinds, f4-f7 break it apart) |
| `poof` | 7 | 40 | full color | center | a shadow clone appearing or vanishing; the Substitution puff |
| `subLog` | 5 | 70 | full color | bottom | the Substitution log left where he stood |
| `fourTailsRoar` | 8 | 45 | full color | center | the Four-Tails chakra roar as the transformation completes |
| `beastBall` | 8 | 45 | full color | center | the Tailed Beast Ball gathering at the fox's mouth during the charge (loop) |
| `beastBeamRing` | 6 | 40 | full color | center | the shock rings sent down the Tailed Beast Ball beam |

The frame-by-frame brief is [art/characters/naruto/SKILLS_REVAMP.md](../characters/naruto/SKILLS_REVAMP.md).

## Hard rules (every effect)

1. **Cell 128x128 px**, transparent PNG, one frame per cell. The final frames in `frames/<effect>/`
   are exactly 128x128.
2. **Anchor**
   - *center* effects: the effect's center sits on pixel **(64, 64)** in every frame.
   - *bottom* effects (`dust`, `flame`, `streak`, `wisp`, `naruto_chakraTail`): horizontally centered on x = 64, the base sits on
     the line **y = 120** (8 px of empty space below). The engine places y = 120 on the ground or on
     the fighter's feet.
   - `crater`: centered on (64, 64), drawn **straight top-down** (the engine lays it flat on the floor
     and the 3D camera adds the perspective).
3. **Size: the packer sets it.** The atlas uses `ppu: 56`, so one 128 px cell is 2.29 world units,
   exactly the same as today's 64 px / 28 ppu procedural cell. The engine scales each effect per use
   (0.2x to 2.2x). The packer scales each strip with one factor so its largest frame = fill x 128 px
   (same world size as the procedural effect); only the relative sizes between frames are yours. The
   "max extent" numbers in `EFFECTS.md` are that final size.
4. **Color rule**
   - **white (tinted)**: draw in **white and light greys only** (#FFFFFF, #E6E6E6, #C8C8C8, optionally
     #A8A8A8). No color, no black or dark outline. The shader multiplies the pixel by a runtime color
     (character color, hit color, block blue...) and pushes it into the bloom. Grey = a darker shade of
     that color, so greys are your shading steps.
   - **full color**: draw in the palette listed in `EFFECTS.md`. The engine does not tint these.
     A dark outline in the effect's own darkest tone is allowed; avoid pure black.
5. **Hard pixel art**: crisp square pixels, no anti-aliasing, no blur, no soft gradients, no
   noise/dithering fills, no motion blur. Motion is shown with solid smear shapes and speed lines.
   Alpha (only where noted) in 3-4 hard steps, never a smooth falloff. Pixels with alpha < 8% are
   discarded by the shader.
6. **Raw background is flat magenta #FF00FF.** Never use magenta, hot pink or violet inside an effect
   (the packer deletes near-magenta pixels). Watch for a pink fringe around white effects.
7. **No text, no frame numbers, no grid lines, no borders, no ground shadow.**
8. **Consistent scale within a strip.** Effects grow and shrink across frames on purpose (a ring
   expands, a star shrinks). Never zoom each frame to fill its slot.

## Workflow (one effect)

1. Check `../TRACKER.md` (or `../manifest.json` -> `vfx`) for the next effect with status `todo`.
   Suggested order: `spark`, `lines`, `burst`, `ring`, `star` (every hit uses them) -> `orb`,
   `lightning`, `fire`, `shuriken` (signature moves) -> `flame`, `streak` (aura) -> `dust`, `smoke`,
   `crater` -> `glow` (optional, the procedural one is fine) -> the power-up effects (`naruto_chakraTail`,
   `arc`, `wisp`, `bubble`, `ripple`; ENG-069).
2. Optional, once: generate the **VFX style sheet** (first prompt in `PROMPTS.md`) and save it as
   `reference/vfx_style_sheet_vNN.png`. When the user approves one, copy it to
   `reference/vfx_style_sheet.png` and attach that to every later effect prompt.
3. In the image generator (Codex's built-in one, or a ChatGPT chat), give the **preamble** from
   `PROMPTS.md`, then the effect's prompt. Attach the approved style sheet if there is one.
4. Check the image against the QA list below. Use a fix-up prompt if needed.
5. Save it as the next version `art/vfx/raw/<effect>_vNN.png` (exact engine name, lowercase; `NN` =
   1 + the highest number used for that effect, including `raw/_rejected/` and REVIEW.md). Add a
   `needs review` row to `../REVIEW.md` (character column `vfx`), set `version` in the manifest and
   status `raw`.
6. Run `node tools/pack-sprites.mjs vfx --candidates` to preview (`?art=custom`); after the user approves
   (manifest `approvedVersion`), `npm run sprites vfx` ships it. The packer takes the highest `_vNN` per effect (and prints which file),
   removes the magenta, splits the strip into frames, fits them into 128 px cells, writes cleaned
   frames to `frames/<effect>/` and builds `public/vfx/atlas.*`. Read the report for warnings (frame
   count mismatch, clipped frames). Set status `packed`.
7. Hand touch-ups go into `frames/<effect>/<effect>_NN.png` (edited frames win over `raw/` on the next
   pack; untouched packer-written frames are re-imported automatically when a new raw version appears).
8. Test in game (`npm run dev`): trigger the effect (see "Where to see it" in `EFFECTS.md`), check
   size, anchor, tint and timing next to the fighters, and write the result in the REVIEW row.
9. The user approves or rejects it. Approved: set the REVIEW row, `approvedVersion` and status
   `approved`, and add a line to `CHANGELOG.md` (`feat(art): vfx <effect> hi-res art`). Rejected: move
   the file to `raw/_rejected/` (the packer falls back to the highest version left) and generate the
   next version.

### Packing notes (for Codex / whoever maintains the packer)

- Effects are scaled with **one factor per strip** (not per frame), so growing/shrinking animations
  keep their proportions. Target: the largest frame of the strip = `fill` x 128 px (`VFX_EFFECTS` in
  `tools/pack-sprites.mjs`) = the "max extent" in `EFFECTS.md`.
- Frames keep their position inside the strip row instead of being re-centered on their own bbox:
  - vertically, center effects put the row's common center line (center of the union of the row's
    frames) on y = 64, so a wisp on top or a rising puff does not shift the effect;
  - bottom effects put the row's lowest opaque pixel on y = 120, so a frame drawn higher (a lifting
    streak, rising dust) stays higher; `flame` is centered on its base (x = 64) so the tip keeps its lean;
  - horizontally, a strip frame is centered on its split slot. With the default split the slot is the
    frame's own columns (no common reference exists in a strip), so a one-sided part (the `spark`
    flare) shifts that frame. For exact horizontal placement add `raw/<effect>.json` (applies to every version; a `raw/<effect>_vNN.json` next to one version is merged on top for that version only) with
    `{ "split": "even" }` (equal slots across the image; needs evenly spaced frames with equal margins),
    or save single frames `raw/<effect>_NN.png` on one canvas size (aligned on the union of all frames),
    or hand-place 128x128 frames in `frames/<effect>/`.
- `glow` is converted luma -> alpha (see its section in `EFFECTS.md`).
- `frames/<effect>/` files that are already 128x128 are final: used exactly as drawn, alpha kept.
- If the packer's behavior differs from these notes, the code is the truth: update this file.

## QA checklist (per effect)

- [ ] Right number of frames, one row, left to right in playback order.
- [ ] Background was flat #FF00FF, nothing touches the image border, clear gaps between frames.
- [ ] Hard pixels, no blur, no smooth gradient halos, no pink fringe after packing.
- [ ] White-tinted effects contain only white/light grey; full-color effects use their palette.
- [ ] Same center (or baseline) in every frame; no jitter when played.
- [ ] Size matches "max extent" in `EFFECTS.md`; growth/shrink reads clearly frame to frame.
- [ ] Loops (`shuriken`, `fire`, `orb`, `glow`) loop seamlessly from the last frame back to frame 0.
- [ ] In game: readable at the smallest scale it is used at (e.g. `star` frame 2 as a tiny sparkle).

## What is NOT in the atlas (procedural, no art needed today)

- **Super / ultimate beams**: drawn by a shader (`src/game/projectiles.js`). Optional future art is
  described in `EFFECTS.md` -> *Beams (future)*.
- **Fullscreen anime speed lines, screen flashes, impact (invert) frames**: `Overlay` in
  `src/game/effects.js`, screen-space.
- **Hexagon ki-barrier wall flash** at the ring edge: procedural hex texture.
- **Flying debris rocks**: low-poly 3D meshes.

## Adding a new effect (e.g. for a new character's signature move)

New effect names need engine support, so this is a joint Claude + art task:

1. Open a task in `docs/TASKS.md` (owner: Claude for the engine side).
2. Name it: reusable effects get a generic name (`slash`, `wind`, `water`); character-specific
   ones always get the prefix `<charId>_<effect>` (e.g. `sasuke_chidoriBall`, `naruto_rasenganImpact`,
   `naruto_beamBody`). One rule for every character:
   - the brief (frames, size, anchor, colors) is a row in that character's `MOVES_AND_VFX.md`;
   - the prompt goes in that character's `PROMPTS.md`;
   - raws are saved as `art/vfx/raw/_proposed/<charId>_<effect>_vNN.png` (queued in `../REVIEW.md`). The packer never reads
     `_proposed/`, so art can be made before the engine supports it, without warnings.
3. When the engine task lands: move the brief to `EFFECTS.md` and the prompt to `PROMPTS.md`, add an
   entry in `../manifest.json` (`vfx`, with `version` / `approvedVersion`) and `../TRACKER.md`, move the raws to `raw/<name>_vNN.png` (same numbers) and create
   `frames/<name>/` with a `.gitkeep`.
4. Claude adds the procedural fallback / recipe in `src/art/vfxPainter.js` + `src/game/effects.js`,
   the packer entry (`VFX_EFFECTS` in `tools/pack-sprites.mjs`: frames, ms, tinted, fill, anchor) and an
   ADR if it changes the atlas format.
