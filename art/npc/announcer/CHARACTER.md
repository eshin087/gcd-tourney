# Announcer: character brief

> Read this first, then [ANIMATIONS.md](ANIMATIONS.md) (poses, timing, QA numbers) and
> [PROMPTS.md](PROMPTS.md) (paste-ready prompts). NPC spec, file flow and engine use:
> [art/npc/README.md](../README.md). Rules: [ADR 0008](../../../docs/decisions/0008-world-art-and-parallel-production.md)
> wins over everything else.

| | |
|---|---|
| Engine id | `announcer` (folder `art/npc/announcer/`, output `public/npc/announcer/`) |
| Role | tournament MC: introduces the fighters, calls the start, hypes the big moves, points at the winner, and dives for cover when an ultimate goes off. Since ENG-118 he walks the ring edge to follow the fight, hops onto the ring to call a KO and comments in small captions above his head (drawn by the engine) |
| Kind | **cameo**: an homage to the World Martial Arts Tournament announcer from Dragon Ball / Dragon Ball Z (allowed by ADR 0008; see [Legal](#legal)) |
| Animations | `idle` 2, `point` 2, `shout` 2, `cower` 2; batch `npc-announcer-r1` (ENG-118): `walk` 4, `run` 4, `shocked` 2, `micThrust` 2; batch `npc-announcer-r2` (ENG-119): `blownAway` 2, `popUp` 2, `cheer` 2, `facepalm` 2, `micTap` 2, `checkWatch` 2, `patHair` 2, `sooty` 2, `wince` 2, `mopBrow` 2 |
| Cell / pivot / ppu | 128 x 128 / [64, 124] / 80 |
| Idle height | **112 px** incl. hair (1.40 world units, a medium adult) |
| Placement | starts beside the ring on the grass, back-left, next to the gong; during a match he walks the ring edge to stay behind the fight (ENG-118, `src/world/announcer.js`) |

## One-paragraph look

Trait-only description (no names). It is the fallback `CHARACTER:` line in PROMPTS.md:

> an adult male tournament announcer with a voluminous mop of curly golden-blond hair, black
> sunglasses, a clean-shaven friendly face with a wide expressive mouth, a black two-button suit with
> matching trousers, a crisp white shirt, a deep-red necktie and black dress shoes, holding a classic
> handheld microphone with a round silver mesh head and a black handle

## Who he is on screen

The loudest man in the arena. He is always talking: mic at his mouth, free hand gesturing, leaning
toward the action. Big, readable, slightly comedic body language (he is the audience's stand-in), but
drawn with normal adult proportions, not as a gag character. When the fighters go all out he panics
and ducks, then pops back up and keeps announcing.

## Identity checklist

If a frame misses one of these, it is off-model.

1. **Hair:** a voluminous mop of curly, wavy **golden-blond** hair: puffy on top and at the sides,
   covering the tops of the ears, ending above the collar at the back. Rounded curl clumps, never
   straight, never spiky, never brown or platinum. About 8 px above the skull in the 128 cell.
2. **Sunglasses:** dark, almost black lenses with a thin dark frame; both lenses visible in the 3/4
   view; one white glint pixel on the lens nearer the light (upper left of the image). His eyes are **never**
   visible, not even when shocked (the glasses may slip a little in `cower`).
3. **Face:** friendly adult, clean-shaven, small nose, a wide mobile mouth (he talks or shouts in most
   frames), defined jaw.
4. **Suit:** black (charcoal-black) two-button suit jacket with lapels, matching trousers, a crisp white
   shirt collar and cuffs showing, a **deep-red necktie**.
5. **Microphone:** a classic handheld microphone, round silver mesh head and black handle, no cable.
   **Always in his right hand** (the hand on the LEFT side of the image), held near his mouth. It never
   switches hands.
6. **Shoes:** black dress shoes.
7. **Build:** slim adult man of average height, about **6.5 heads** tall, natural anime proportions.
   Not chibi, not muscular, no big head, no oversized hands or feet.

## Proportions and landmarks (idle, 128 cell, soles on y 124)

| landmark | y | x / notes |
|---|---|---|
| top of hair | 12 | curls puff out to about x 52..78 |
| top of skull | 20 | |
| sunglasses | 27-30 | both lenses visible, glasses centered about x 66 |
| chin | 36 | head about 16 px from skull to chin (6.5 heads) |
| microphone head | 32-37 | about x 54-58: in front of the chin, left of the face (his right hand) |
| shoulders | 41 | about x 50..78 (the far, right-side shoulder a little narrower) |
| elbows | ~58 | |
| belt | 72 | |
| crotch | 79 | |
| knees | 101 | |
| soles (floor) | 124 | feet about x 54..74, centered on x 64 |

Head size (about 16 px) is the same in every frame of every animation.

## Facing and handedness

- 3/4 view facing the viewer, body turned about 30 degrees toward screen-right (toward the ring when he
  stands left of it), head turned a little more to the right. Camera about 10 degrees above.
- He mostly faces the viewer, so his **right hand (microphone) is on the LEFT side of the image** and
  his **left hand (gestures, pointing) is on the RIGHT side**, the side the fight is on.
- The engine mirrors him when he stands right of the ring; the mic then appears in the other hand.
  That is accepted.

## Expressions

| expression | look | used in |
|---|---|---|
| talking grin | mouth open in a friendly half-grin, brows up | `idle` |
| announcing | mouth wide open (dark interior `#5a1a22` visible), brows raised, chin forward | `point` |
| hype shout | mouth at its widest, head thrown back slightly, brows high, sunglasses glinting | `shout` |
| panic | teeth gritted in a wobbly grimace, brows pinched up, one small blue sweat drop | `cower` |

## Palette (26 colors)

Use only these. One shared outline color with the fighters and the other NPCs.

| # | material | light | base | shadow | deep / extra |
|---|---|---|---|---|---|
| 1 | outline | | | | `#1d1420` |
| 2-5 | skin | `#ffe2c6` | `#f6c69e` | `#d9946e` | `#a8644a` (ear, nose, mouth corners) |
| 6-10 | hair (golden blond) | `#fff3b0` (glints), `#ffdd5c` | `#f2b630` | `#c47f1a` | `#8a5212` (deep curl gaps) |
| 11-12 | sunglasses | | `#15131d` (lens) | | `#3b3a52` (lens sheen, frame edge) |
| 13-15 | black suit, trousers, shoes, mic handle | `#4c4b60` | `#2f2e3e` | `#23222f` | |
| 16-18 | white shirt, glint, teeth | `#ffffff` | `#e9e7f1` | `#b6b2c6` | |
| 19-21 | red necktie | `#e85454` | `#c0303e` | `#7e1828` | |
| 22-24 | microphone head (silver) | `#eef1f6` | `#aab2c2` | `#6c7488` | |
| 25 | mouth interior | | `#5a1a22` | | |
| 26 | sweat drop (`cower`, `mopBrow`) | | `#8fd3ff` | | (+ `#ffffff` highlight) |
| 27-28 | smoke wisps (`sooty` only) | `#cfccd8` | `#9a97a8` | | |

Material rules: black suit reads by its light planes (`#4c4b60` on lapels, shoulders and sleeve tops
facing the upper-left light) and a selective outline, so it never melts into the outline. Hair is
mostly `#f2b630` with `#ffdd5c` on the lit top of each curl and `#c47f1a` / `#8a5212` in the gaps; a few
`#fff3b0` glints. No gradients, no dithering.

## Reference folder

| file | what |
|---|---|
| `reference/model_sheet_vNN.png` | model-sheet candidates (PROMPTS.md S1) |
| `reference/model_sheet.png` | approved sheet (lead copies it on approval); attached to every strip prompt |
| `reference/idle_approved.png` | approved idle strip (lead copies it); attached to every strip after idle |

Official screenshots of the original character are copyrighted: keep any you collect local
(`reference/source/`, not committed) for your own comparison and never upload them to the generator.

## Legal

This NPC is fan art of a copyrighted character. That is fine for the private fan project and, like
every cameo, must be removed or replaced before any public or commercial release unless licensed
(ADR 0008, task ENG-020, `cameos: false` build flag). The name-free fallback above still looks like the
homage, so it does not solve the license question.

**Original variant (for the cameo-free build, not to be generated now):** a lanky tournament MC with
slicked-back silver-grey hair, a thin mustache, round gold-rimmed glasses, a cream-white suit with a
crimson bow tie and brown shoes, holding the same microphone. Same poses, same palette budget.

## Files

| path | what |
|---|---|
| `CHARACTER.md` | this brief |
| `ANIMATIONS.md` | the 4 animations frame by frame, timing, heights, triggers, QA |
| `PROMPTS.md` | paste-ready prompts (model sheet first) |
| `reference/` | sheet candidates and approved copies |
| `raw/<anim>_vNN.png` | generated strips; `raw/_rejected/` for rejected ones |
| `frames/<anim>/` | cleaned 128 x 128 frames |
