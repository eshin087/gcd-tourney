# Spell effects round 2: the Gigant Pistol's arm and the Domain's shatter (ART-SPELL-R2, 2026-11-08)

Brief for the Codex chat **"Character Spell Chat"** (relay lane `spells`). Engine side: the Claude chat "Finish the spell
visual leftovers (ENG-132)" (ENG-132 follow-up). Format and style follow [SPELL_FX_R1_BRIEF.md](SPELL_FX_R1_BRIEF.md)
and [CLASH_HD_BRIEF.md](CLASH_HD_BRIEF.md) section 2 ("The HD effect cell").

## 1. Why

The user (2026-11-08) found spells weird in clashes and on their own. Claude's sweep (ENG-132) left six items for
later; four were engine work and are fixed on the Claude side. Two need new drawings, because the problem is in the art
itself:

- **Luffy, Gear Third: Gigant Pistol** (lab `/lab.html?p1=luffy&p2=naruto`, Moves tab, "Ultimate (Heavy + Special)",
  frames 104-140): "Only the fist is giant; the arm is a thin flat tan band stretched across the whole stage." The
  approved `gigantArm` v01 is a 96 px tube in flat horizontal colour bands, and `gigantFist` v01 is a 200 px fist whose
  wrist is cut to the same 96 px, so the arm is half the fist's height. In the anime the whole arm is inflated.
- **Gojo, Domain Expansion: the exit** (lab `/lab.html?p1=gojo&p2=naruto`, "SUPER: DOMAIN EXPANSION", the frames right
  after the domain ends): "The exit shards are chunky." `voidShatter` v01 is one 256 px cell that the engine stretches
  over the whole screen, so its pixels come out about 3.4 times the size of every other sprite's.

**Model:** the project rule (CLAUDE.md "Agent model selection") applies: character-specific art is generated under
`gpt-6-luna` with `medium` reasoning. The round-1 waiver ("Use their current model") covered round 1 only. If this chat
does not run that model, ring `node tools/relay.mjs ring spells --for user --kind decision --note "model for ART-SPELL-R2"`
and wait; do not generate until the answer is relayed.

## 2. Rules

As round 1: at most 3 generation calls per image, cumulative, one candidate inventory in
`art/vfx/production/spell-fx-r2/`; effects need no Astra audit. Never overwrite, reuse or delete a `_vNN` file. One
worktree on branch `art/spell-fx-r2` (`npm run pr -- start art/spell-fx-r2 --art vfx`, or the managed worktree plus
`npm run pr -- art vfx`), dev server on port 5255. Commit only your own paths; do not edit `src/` or `tools/` (Claude
wires the new art in). Change only these rows in `art/manifest.json`, `art/REVIEW.md` and `art/TRACKER.md`. Cell and
style exactly as CLASH_HD_BRIEF.md "The HD effect cell" (256 x 256 px at 112 px per world unit, crisp hard-edged pixel
art on flat magenta, hard colour bands, at most 16 colours, no blur, no anti-aliased gradients). The approvals desk is
off: when everything is ready, ring once with `node tools/relay.mjs ring spells --for user --kind approval --note
"<items, versions, review link>"` from main and stop. Claude asks the user and relays the answer word for word.

## 3. The drawings

| # | Name | Version | Frames | ms | Play | Fill | Notes |
|---|---|---|---|---|---|---|---|
| G1 | `gigantArm` | v02 | 2 | 60 | loop | 1 | tile, every column identical (as v01) |
| G2 | `gigantFist` | v02 | 4 | 40 | loop | 0.98 | wrist joins G1 exactly |
| V1 | `voidShatterTL` `voidShatterTR` `voidShatterBL` `voidShatterBR` | v01 each | 8 | 50 | once | exact tiles | one 512 x 512 shatter cut in four |

### G1 `gigantArm` v02: the inflated arm (2 frames, tile)

The Gear Third arm as a **giant inflated rubber limb**, not a ribbon: a horizontal tube **about 170 px thick**, centred
on y = 128 (rows 43-212), running from x = 0 to x = 255, **every column identical** (the engine stretches it down the
lane). Read it as a round cylinder: a 3 px dark brown outline top and bottom (`#492610`), a narrow bright highlight
band in the upper third (`#ffd7a8`), the skin tones of v01 (`#fcc081`, `#fbba79`, `#f9b171`) through the middle, then
two or three darker hard bands into the underside (`#dc8440`, `#c97c45`, `#a8622e`), so it has volume. f0: the tube
alone. f1: plus long pale speed lines (`#f8e8d1`, 2-3 px) along it just above and below it (y about 30 and 225).

### G2 `gigantFist` v02: the giant fist on the new arm (4 frames, loop)

The approved v01 fist (`art/vfx/raw/gigantFist_v01.png`): the same huge clenched fist rocketing screen-right, knuckles
to the right, knuckle highlights, finger creases, the thumb wrapped over, 3 px dark brown outline, the same speed lines
and wind trails and the 1-2 px tremble. About **220 px tall and 200 px long** (x 30-230). The change: its **wrist and a
short forearm stub are as thick as G1**, cut flat on the left side at x = 30, **exactly 170 px tall on y = 43-212**,
with G1's colour rows, so the arm runs straight into the fist with no step. The fist is only a little taller than the
arm, as an inflated arm would be.

### V1 `voidShatter` in four tiles: the void breaking like glass, twice as fine (8 frames each, once)

Redraw the approved `voidShatter` v01 sequence (`art/vfx/raw/voidShatter_v01.png`; Gojo's SKILLS_REVAMP.md A12, frame
by frame: the black pane, the cracks spidering out, about 20-30 angular shards with bright white-blue edges, the shards
pulling apart and flying outward with the centre opening, the last glints) as **one 512 x 512 picture per frame** with
twice the detail: crack lines and shard edges 1-2 px at that size, shards with crisp angular edges. Then cut each frame
into **four exact 256 x 256 tiles** around the centre (the shatter's centre on the corner the four tiles share): top-left
`voidShatterTL`, top-right `voidShatterTR`, bottom-left `voidShatterBL`, bottom-right `voidShatterBR`. Deliver the tiles
as final frames in `art/vfx/frames/<name>/` (`<name>_00.png` ... `_07.png`, exactly 256 x 256, no trimming) next to each
raw `_v01` strip, so the packer uses them as drawn and they line up edge to edge. The black pane must reach every outer
edge of its tile in f0-f2 (it covers the screen). Manifest: `"hd": true`, `"owner": "gojo"`, `"colorRule": "fullColor"`,
`"anchor": "center"`, `"fill": 1.0`. Keep `voidShatter` v01 as it is: the engine uses it until the tiles are approved.

## 4. Deliverables

The raws (`art/vfx/raw/gigantArm_v02.png`, `gigantFist_v02.png`, `voidShatterTL_v01.png` ...), the tile frames, the
manifest rows, a candidate pack (`node tools/pack-sprites.mjs vfx --candidates`), and a review page in
`public/reviews/spell-fx-r2/` that shows: G1 + G2 joined at game scale (the arm about 4 fist-lengths long) beside v01
joined the same way; V1's four tiles assembled 2 x 2 frame by frame beside v01 scaled to the same size; REVIEW.md rows;
a committed preview (`npm run pr -- preview`); then the ring in section 2.

## 5. What Claude does after the approval

Sets the Gigant Pistol's `arm.thick` / `arm.tube` (`src/game/moves.js` `gigantPistol.arm`) to the new tube, and makes
the Domain's exit (`src/world/voidStage.js` `shatter`) lay the four tiles 2 x 2 over the screen, then packs, checks both
in the lab and merges.
