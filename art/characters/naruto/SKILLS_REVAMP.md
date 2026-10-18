# Naruto: skills revamp (specials, supers, ultimate)

> Brief for the Codex chat **"5 - Skills Effects"** (relay lane `skills`), written by the Claude chat of the same
> name on 2026-10-18. Claude does all engine work (`src/game/**`, the packer, effect names, the clone system, the
> cloak shader, the Four-Tails transformation). Codex draws the art below. Everything in
> [art/SPEC.md](../../SPEC.md), [ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md), the
> title-style contract ([ADR 0029](../../../docs/decisions/0029-title-style-scale-baseline.md)) and
> [art/vfx/README.md](../../vfx/README.md) still applies unless this file says otherwise.

## 1. The user's request and decisions

**Request (2026-10-18, in Claude):** revamp most of the characters' specials, supers and ultimates, starting with
Naruto, because most "don't seem like the iconic animations, effects from the original anime/manga":

- the Rasengan's art and animation should look like the anime;
- the Nine-Tails Cloak should be an orange fiery aura around him, like the user's reference image
  (Part 1 anime still: Naruto on all fours inside a see-through red-orange chakra shroud that hugs his whole outline,
  fizzing at the edges, a chakra tail rising behind him);
- Shadow Clone super: "make naruto summon his shadow clones to poof out and converge and beat up the target
  together";
- Four-Tails: "transform naruto into the 4 tails during the attack. right now it only adds random fire around him and
  looks really bad", and "make the cutscene art and his character be engulfed fully as the fox form and not have his
  human head show";
- evaluate the specials the user did not name, and use this Codex chat to generate the art.

**The user's answers to Claude's questions (2026-10-18, question box):**

| Question | Answer |
|---|---|
| Nine-Tails Cloak look | **Shroud + 1 tail**: see-through red-orange chakra hugging his whole outline in every animation, fizzing edges and bubbles, one chakra tail behind. No fox ears. |
| Shadow Clone super finish | **Kick up + Rasengan**: 6-8 clones poof in around the target, rush in and pummel together, kick them skyward (U-ZU-MA-KI), Naruto drops from above with a big Rasengan. |
| Rasengan formation | **Solo**: he forms it alone, two-handed. Only the orb, the hit and the blast are redone. |
| Other moves to revamp | **Rasenshuriken** (real wind blades, wind-blade sphere on hit), **Uzumaki Barrage** (real clones kick the target up, then his heel drop), **Substitution** (a log in the puff). The air shuriken stays. |

## 2. Why the Four-Tails looks wrong today (Claude's finding)

The shipped `beamCharge` v08 and `beamFire` v12 are **plain human Naruto** in a beam wind-up and a two-palm firing
pose: the title-style round of 2026-10-11 redrew them from the obsolete Rasen Cannon descriptions instead of the
Four-Tails brief ([KIT.md §5](KIT.md#5-four-tails-ultimate-adr-0017-redraw-beamcharge--beamfire-as-the-shroud-form)).
The engine already plays those two strips for the roar, the pounce and the slams, so the ultimate shows a human
Naruto with red flame particles. The approved shroud design exists at the old scale (`raw/beamCharge_v05.png`,
`raw/beamFire_v07.png`, approved 2026-10-10). The splash cutout `ui_ult_fg_v01` follows the old U6 prompt ("retain
recognizable short blond hair/headband"), which is why his human head shows.

## 3. Rules for this task

- **Models:** generate and direct every image with `gpt-6-luna`, reasoning `medium` (CLAUDE.md "Agent model
  selection"); if this chat runs another model, spawn a Luna subagent (`model`, `reasoning_effort: "medium"`,
  `fork_turns: "none"`) for the generation. The final **Astra** anatomy/scale audit (`gpt-6-astra`, medium) applies
  to the Four-Tails strips (B1, B2) and the splash cutout (B3). Effects (part A) need no Astra audit.
- **Budget:** at most 3 generation calls per image, cumulative across retries. Keep one candidate inventory with
  every call, its prompt file and its verdict.
- **Versions:** never overwrite, reuse or delete a `_vNN` file. Next free versions today: `beamCharge_v09`,
  `beamFire_v13`, `ui_ult_fg_v02`; every new effect starts at `_v01`.
- **Branch:** one worktree, branch `art/naruto-skills`, sparse with the raw art you need
  (`npm run pr -- start art/naruto-skills --art naruto,vfx` or the host's managed worktree plus
  `npm run pr -- art naruto,vfx`). Dev server on a free port (52xx). Commit only your own paths.
- **Engine names and packing:** Claude registers the eight new effect names (part A) with procedural stand-ins and
  adds the **HD effect cell** (below) to the packer on branch `feature/naruto-skills`. Until that reaches main,
  generate and review the raws and cleaned frames; Claude will tell you on this lane when candidate packing
  (`node tools/pack-sprites.mjs vfx --candidates`) works for the new names. Do not edit `src/` or `tools/`.
- **Approval:** the user approves every image version. The approvals desk is off: when a batch is ready, ring
  Claude with `node tools/relay.mjs ring skills --for user --kind approval --note "<items, versions, review link>"`
  from main and stop on that batch; Claude asks the user and relays the answer word for word. Never treat anything
  else as approval.

### The HD effect cell (new, for every part A effect)

The shared effects are drawn in 128 px cells at 56 px per world unit, half the density of the fighters (128 px per
unit), which is one reason the signature effects read as blobs. The eight new effects use a **256 x 256 cell at
112 px per unit** (the same world size per cell as today, twice the detail):

| Anchor | Where |
|---|---|
| center | the effect's center on pixel (128, 128) in every frame |
| bottom | centered on x = 128, base on y = 240 (16 px empty below) |

The packer still scales each strip so its largest frame is `fill` x 256 px; only the relative sizes between frames
come from the art. Draw the sizes below at that final scale.

**Style for every effect:** crisp hard-edged pixel art like the approved effects (`art/vfx/raw/*_v01.png`), flat
magenta background, no text, no black outline around the effect, no soft blur, airbrush, dithering noise or
anti-aliased gradients; shading in hard color bands; at most 16 colors per effect. Effects must read at small scale
in a busy fight: a bright core, clear spiral or blade shapes, a dark-blue (or dark-red) rim for contrast.

## 4. Part A: new effects (art/vfx, HD cell)

Raws: `art/vfx/raw/<name>_v01.png`, one row of frames left to right. Cleaned frames (optional until the packer
lands): `art/vfx/frames/<name>/<name>_00.png` ... at exactly 256 x 256.

| # | Name | Frames | ms | Plays | Color | Anchor | fill | Used for |
|---|---|---|---|---|---|---|---|---|
| A1 | `rasengan` | 8 | 40 | loop | full color | center | 0.55 | the Rasengan in his palm, the super's big Rasengan |
| A2 | `rasenganForm` | 6 | 45 | once | full color | center | 0.55 | the Rasengan forming in his hands (startup) |
| A3 | `rasenganBurst` | 8 | 45 | once | full color | center | 0.98 | the Rasengan hitting: grind, then spiral blast |
| A4 | `rasenshuriken` | 8 | 35 | loop | full color | center | 0.9 | the Rasenshuriken held in his hand |
| A5 | `rasenshurikenDome` | 8 | 50 | once, f2-f4 loop | full color | center | 0.98 | the wind-blade sphere that grinds the victim |
| A6 | `poof` | 7 | 40 | once | full color | center | 0.75 | every shadow clone appearing and vanishing, the Substitution puff |
| A7 | `subLog` | 5 | 70 | once, holds f4 | full color | bottom | 0.85 | the Substitution log left where he stood |
| A8 | `fourTailsRoar` | 8 | 45 | once | full color | center | 0.98 | the Four-Tails chakra roar (transformation and the final blast) |

### A1 `rasengan`: the sphere (8 frames, seamless spin loop)

The anime Rasengan: a **sphere of blue chakra about 140 px across** with a **bright white-cyan core** (about 45 px),
**many thin spiraling chakra streams wrapping its surface in criss-crossing directions** (like a ball of wind wound
in several directions at once), and a turbulent rim where short wisps flare off in the spin direction. A thin,
slightly larger ring of wind (about 160 px, broken into arcs) orbits it on a tilt. The streams advance about 1/8 of a
turn each frame so f7 flows into f0. Palette suggestion: `#FFFFFF`, `#DDF6FF`, `#A8E2FF`, `#6EC4FF`, `#3A8EF0`,
`#2259D0`, `#173C9E` (rim). Not a flat disc with a pinwheel (today's `orb`): the sphere must read as a 3D ball.

### A2 `rasenganForm`: forming (6 frames, once)

Chakra gathering at one point (the engine places it between his palms; do not draw hands). f0: four to six thin
blue chakra wisps spiraling inward from about 180 px across. f1: the wisps tighten into a ring around a small bright
core (about 24 px). f2: a small swirling ball (about 50 px) with streams still feeding in. f3: about 85 px, spiral
streams on its surface. f4: about 115 px, turbulent rim. f5: about 140 px, the same size and look as `rasengan` f0,
with a one-frame white rim flash.

### A3 `rasenganBurst`: the hit (8 frames, once)

f0: the sphere pressed against the target, squashed into a spinning disc about 170 px wide with grinding sparks
flying off its edge. f1: the disc twists into a spiral of four to six curved wind arms about 200 px across, white-hot
core. f2-f3: the explosive spiral blast filling the cell: curved blue-white wind arms spiraling outward, a white core,
chakra fragments. f4: a spiral ring at the cell edge, thinner, core fading. f5-f7: broken spiral wisps, small
sparks and fading ring arcs. Same palette as A1 plus pure white.

### A4 `rasenshuriken`: held (8 frames, seamless loop)

Wind Style: Rasenshuriken. A bright white-cyan Rasengan core (about 70 px) in the center, a thin flat white chakra
ring around it (about 120 px), and **four large flat wind blades** shaped like curved shuriken points reaching out to
about 230 px across. Seen nearly face-on, the disc tilted about 15-20 degrees toward the camera. The blades are
translucent-looking white with pale blue (`#BFE6FF`) shading bands and white edges, with faint motion streaks on
their trailing edges. The blade set turns 11.25 degrees per frame (90 / 8) so f7 flows into f0.

### A5 `rasenshurikenDome`: the hit (8 frames)

The Rasenshuriken expanding into a sphere of countless tiny wind blades. f0: a bright white flash about 120 px with
the four blades flaring. f1: a sphere about 180 px built from thin white needle-like strokes radiating and crossing.
f2-f4: the full dome about 240 px: a pale white-blue sphere packed with criss-crossing needle strokes, a darker blue
center (the engine draws the victim inside); f2, f3 and f4 loop seamlessly (the grind lasts about 0.7 s). f5: the
needle strokes break apart. f6-f7: fading needle shards and a thin ring.

### A6 `poof`: the shadow clone pop (7 frames, once)

The anime "poof" when a shadow clone appears or vanishes. f0: a small bright white burst with four to six short
speed puffs. f1: a dense round white cloud about 150 px with big puffy lobes. f2: the fullest, about 190 px. f3-f4:
the cloud splitting into separate lobes drifting outward. f5-f6: thin wisps fading out. White and cool greys only
(`#FFFFFF`, `#E9EDF2`, `#C9D0DA`, `#9AA3B2`). It appears many times per super (up to 16 at once), so it must read
clearly when small and short. Today's `smoke` is the fallback.

### A7 `subLog`: the Substitution log (5 frames, once, holds the last frame)

A cut wooden log about as tall as Naruto (the engine sets the size; draw it about 200 px tall when upright): rough
brown bark, pale cut ends with tree rings. f0: upright, half hidden in a white puff (only its silhouette). f1:
upright and clear, a fresh slash mark where the hit landed. f2: tipping about 20 degrees toward screen-right. f3:
about 60 degrees. f4: lying on its side on the floor line. Bottom anchor: its base (f0-f1) or its lower side (f4) on
y = 240.

### A8 `fourTailsRoar`: the chakra roar (8 frames, once)

f0: a dark red core flash about 100 px with a black center and a white-hot pinpoint. f1-f2: a shockwave ring of
boiling dark red-black chakra about 200 px, bubbles along its rim, a crimson glow inside. f3: the ring at the cell
edge, bubbles flying off it. f4-f7: the ring breaking up into bubbling chakra blobs and red embers, fading. Palette:
`#1A0204`, `#4A0606`, `#7A0C0C`, `#C8281E`, `#FF4A2A`, `#FFB08A`, and `#FFE8DC` only in f0.

## 5. Part B: Naruto character art

Scale and anatomy follow the title-style contract: same pixel density as his approved idle and combat cell, 256 px
cells, pivot `[128, 240]`, facing right, 48-color sheet palette. Attach the approved title-style neutral/combat cells
and the approved shroud design (`raw/beamCharge_v05.png`, `raw/beamFire_v07.png`) as references.

### B1 `beamCharge` v09 and B2 `beamFire` v13: the Four-Tails form

Redraw both strips as the **four-tailed shroud form** exactly as
[KIT.md §5](KIT.md#5-four-tails-ultimate-adr-0017-redraw-beamcharge--beamfire-as-the-shroud-form) describes them
(same frame tables, palette and "nothing outside the body outline" rule), at the title-style scale:

- **Fully engulfed:** no skin, hair, headband, clothes, sandals or human face anywhere. A solid near-black crimson
  body with a bubbling blood-red rim, a rounded fox-like head with two pointed ears, round blank white eyes and a wide
  jagged white mouth, four thick tapering chakra tails, clawed hands and feet.
- **His body, not a bigger one:** limb lengths and build match his approved combat cell; the skull (head without
  ears) calibrates to his title-style skull length, recorded with a versioned sidecar. Crouched and lunging poses are
  shorter and wider than standing; never stretch them to standing height.
- `beamCharge` f1 is also the frame of the point-blank roar blast; `beamFire` f2 is the claw-slam frame used for every
  slam. Feet and front claws on the floor line (y = 240) in every grounded frame.

Claude handles the transformation in the engine (red-black chakra swallowing the human `specialDown` frames, then
these frames, then a burst back to normal), so no transformation strip is needed.

### B3 `ui_ult_fg` v02: the Four-Tails splash cutout

Replace the U6 prompt in PROMPTS.md: same framing and size as v01 (full figure, low all-fours crouch, roaring
screen-right, four distinct tails fanned behind), but **fully engulfed**: dark crimson-black bubbling shroud over the
whole body, **no hair, headband, skin, face or clothing**, round glowing white eyes, a wide jagged white mouth, two
pointed fox ears. This resolves the Astra hold on v01. The backdrop `ui_ult_bg_v01` stays.

## 6. Order, review and handback

1. **Batch 1, the ultimate:** B1, B2, B3 and A8. Pack Naruto with the candidates, run `npm run body naruto beamCharge
   beamFire` and the Astra audit, publish one review page (raw strips, packed frames beside idle f0 and the approved
   combat cell, the loops as GIFs, the splash cutout over its backdrop), then ring Claude for the user's approval.
2. **Batch 2, the Rasengan and the clones:** A1, A2, A3, A6, A7. One review page; ring Claude.
3. **Batch 3, the Rasenshuriken:** A4, A5. One review page; ring Claude.

Each ring names the versions, any holds and the review URL. Record each candidate in `art/REVIEW.md`, and the effect
entries in `art/manifest.json` (`vfx.<name>`: frames, ms, colorRule, anchor, status, version) and `art/TRACKER.md`.
Claude integrates each approved batch in game and shows the user an in-game preview.
