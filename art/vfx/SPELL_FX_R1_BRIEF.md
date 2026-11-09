# Spell effects round 1: rings, bursts and flares in HD (ART-SPELL-R1, 2026-11-08)

Brief for the Codex chat **"Character Spell Chat"** (relay lane `spells`). Engine side: the Claude chat "Character art
sprite consistency audit" on `feature/spell-visuals` (ENG-132). Format and style follow
[CLASH_HD_BRIEF.md](CLASH_HD_BRIEF.md) section 2 ("The HD effect cell"), which you can read as the template.

## 1. Why, and the user's decisions

The user (2026-11-08): "There are also some spells that look weird during the clashes and stuff." Asked to narrow it
down, they picked **glow discs / bubbles**, **the beams themselves** and **the clash point**, seen in beam clashes,
specials outside a clash and supers / ultimates on their own. Claude's sweep of every special, super, ultimate and clash
pairing found 29 problems. Most are engine work (Claude): big translucent `glow` discs (the 3-band stand-in from round
1) behind auras, ki blasts, the Dragon Fist, the Chidori, the Rasenshuriken and the Spirit Bomb; a white ball drawn
over the clash knot; beams anchored to the wrong place. Approved HD art exists for almost every move, so Claude swaps the
stand-ins for it.

Three stand-ins have **no HD replacement yet**, and they show in every fighter's moves:

- the 128 px **`ring`** (shock rings at impacts, counters, the Nine-Tails Cloak activation, clash ends), drawn with big
  stair-step pixels as thick ellipses and dash circles, so it looks low-res beside the HD art;
- the 128 px **`burst`** / **`clashBurst`** starbursts (clash breaks, the winner's blast on the loser, explosions,
  smash hits): plain white or blocky yellow blobs;
- the **`glow`** disc where a move needs a small light at a hand or at a beam's root while it charges or fires: three
  flat concentric bands that read as a bubble.

This round draws those three as HD pieces. **Model (user decision 2026-11-08, relayed as a USER DECISION):** "Use their
current model": this chat generates on the model it runs now; the GPT-6 Luna rule is waived for it this round only.
Every image goes to the user for approval. Until one is approved the game keeps today's stand-in, so nothing waits on
this.

## 2. Rules

- **Budget:** at most 3 generation calls per image, cumulative across retries; one candidate inventory (every call, its
  prompt file and its verdict) in `art/vfx/production/spell-fx-r1/`. These are effects: no Astra audit.
- **Versions:** the three names below are new (none exists in `art/vfx/`, its subfolders or git history on
  2026-11-08), so each starts at `_v01`. Never overwrite, reuse or delete a `_vNN` file.
- **Branch:** one worktree, branch `art/spell-fx-r1` (`npm run pr -- start art/spell-fx-r1 --art vfx`, or the host's
  managed worktree plus `npm run pr -- art vfx`), dev server on port 5253. Commit only your own paths. Do not edit
  `src/` or `tools/`: Claude wires the names into the engine on `feature/spell-visuals`.
- **Manifest:** add each name under `vfx.effects` with `"hd": true`, `"owner": "shared"`, `frames`, `ms`, `fill`,
  `"anchor": "center"`, `"colorRule": "tinted"` and `"tile": false` from the table below (all
  `node tools/pack-sprites.mjs vfx --candidates` needs). Change only these three rows in `art/manifest.json`,
  `art/REVIEW.md` and `art/TRACKER.md`.
- **Cell and style:** exactly as CLASH_HD_BRIEF.md "The HD effect cell": 256 x 256 px at 112 px per world unit (a
  standing fighter is about 175-186 px tall), centre on pixel (128, 128) in every frame, crisp hard-edged pixel art on
  flat magenta, no text, no black outline, no blur, airbrush, dithering noise or anti-aliased gradient; shading in hard
  bands, at most 16 colours. **Tinted:** like `clashKnot`, draw in white and greys only (white core, two or three hard
  grey steps); the engine colours each use. **No solid white disc and no white-filled cell:** white only in cores, thin
  edges and sparks. Read by shape, not brightness.
- **Approval:** the approvals desk is off. When the three are ready, ring Claude once with
  `node tools/relay.mjs ring spells --for user --kind approval --note "<items, versions, review link>"` from main and
  stop. Claude asks the user and relays the answer word for word; nothing else counts as approval.

## 3. The three effects

| # | Name | Frames | ms | Play | Fill | Replaces | Where the engine uses it |
|---|---|---|---|---|---|---|---|
| S1 | `shockRing` | 6 | 45 | once | 0.95 | `ring` | impact and shock rings, counters, the Nine-Tails Cloak activation, clash ends |
| S2 | `impactBurst` | 6 | 40 | once | 0.9 | `burst`, `clashBurst` at large sizes | a clash break, the winner's blast on the loser, explosions, smash hits |
| S3 | `flare` | 4 | 60 | loop | 0.6 | the small `glow` at a hand or a beam's root | a held light while a move charges or fires |

### S1 `shockRing`: a shockwave ring (6 frames, once, white tinted)

An expanding ring of force seen from a little above, so an ellipse about 2.4 times as wide as it is tall at its largest.
f0: a small, bright, tight ring about a third of the final width; f1-f3: it widens fast, a thin crisp bright inner edge
with two hard grey bands outside it; f4-f5: it thins and breaks into arcs and a few small chips flying outward. The ring
is a line, never a filled disc: the centre stays empty (magenta) in every frame.

### S2 `impactBurst`: a big-hit starburst (6 frames, once, white tinted)

The flash where a big attack lands. f0: a compact bright core (no wider than a fist at the final scale) with 6-8 sharp,
uneven spikes; f1-f2: the spikes at full length, a thin ring of force and a few flying shards; f3-f5: the spikes break
into shards and sparks that fly out and thin away. Uneven spike lengths and angles, so it never reads as a regular star
or a disc.

### S3 `flare`: a small held light (4 frames, seamless loop, white tinted)

The light in a palm or at the root of a beam while it charges or fires. A bright core about 24 px across at the final
scale with 4-6 short, irregular rays (out to about 90 px) that change length between frames so it flickers, and two or
three sparkle specks. No round halo around it: what made the old `glow` read as a bubble was its flat round bands.

## 4. Deliverables

The three strips as `art/vfx/raw/<name>_v01.png` (one row, one frame per cell), their manifest rows, a candidate pack
(`node tools/pack-sprites.mjs vfx --candidates`), a review page in `public/reviews/spell-fx-r1/` that shows each strip
frame by frame at one scale on a dark background and tinted three ways (white, blue `#7ab8ff`, orange `#ff8a3a`) beside
the stand-in it replaces, REVIEW.md rows, a committed preview (`npm run pr -- preview`), then the ring in section 2.
