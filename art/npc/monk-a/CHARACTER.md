# Monk A (elder judge): character brief

> Read this first, then [ANIMATIONS.md](ANIMATIONS.md) (poses, timing, QA numbers) and
> [PROMPTS.md](PROMPTS.md) (paste-ready prompts). NPC spec, file flow and engine use:
> [art/npc/README.md](../README.md). Rules: [ADR 0008](../../../docs/decisions/0008-world-art-and-parallel-production.md)
> wins over everything else.

| | |
|---|---|
| Engine id | `monk-a` (folder `art/npc/monk-a/`, output `public/npc/monk-a/`) |
| Role | the **elder judge**: one of two tournament officials at the ring corners. Signals the start, ring-outs and the final decision with his referee paddle-fan |
| Kind | original design (no name, no fallback needed) |
| Animations | `idle` 2, `signal` 2 |
| Cell / pivot / ppu | 128 x 128 / [64, 124] / 80 |
| Idle height | **92 px** (1.15 world units: clearly short) |
| Placement | on the grass just outside a ring corner (proposed: back-left); the partner is [monk-b](../monk-b/CHARACTER.md) |

## One-paragraph look

> a short, round, slightly stooped elderly monk with a shiny bald head, long bushy white eyebrows that
> droop past his eyes, a white mustache and a long thin white beard reaching the middle of his chest,
> wearing an ankle-length saffron-yellow robe with wide sleeves and a crimson monk's mantle with a thin
> gold border draped diagonally over his left shoulder, a long necklace of big dark-wood prayer beads,
> and straw sandals, holding a referee's paddle-fan: a flat rounded crimson-lacquered paddle with a gold
> circle in the middle and a short black handle

## Who he is on screen

The calm authority of the tournament. He barely moves while the fighters tear the ring apart: eyes
half-closed, fingers on his prayer beads. When a call is needed he snaps awake and makes it with total
conviction, fan raised, then swept down at the ring. Dignified, a little comic in his smallness, never
a joke.

**Silhouette versus monk-b:** short, round and bottom-heavy (the robe flares wide at the hem), a big
beard and a flat fan. Monk-b is tall, narrow and vertical with a long staff. They must never read as
the same sprite.

## Identity checklist

1. **Head:** shiny **bald** head with one highlight on the crown; long bushy **white eyebrows** that
   droop past the outer corners of his eyes; a white mustache; a long thin white beard to mid-chest.
2. **Eyes:** calm narrow slits in `idle`; wide open only in `signal`.
3. **Robe:** ankle-length **saffron-yellow** robe with wide sleeves.
4. **Mantle:** a **crimson** monk's mantle with a thin **gold** border, draped diagonally from his left
   shoulder (the right side of the image) across the body; his right shoulder and right sleeve stay
   saffron.
5. **Prayer beads:** a long necklace of big dark-wood beads hanging to the belly.
6. **Referee paddle-fan (gunbai):** a flat, rounded, slightly gourd-shaped paddle lacquered crimson
   with a gold circle in the middle (no symbol, no text) and a short black handle. **Always in his left
   hand** (the right side of the image).
7. **Feet:** straw sandals, bare feet.
8. **Build:** short, round, slightly stooped elder; about 5 heads tall in his stooped stance (about 5.5
   if he stood straight). Natural anime proportions for an old man: not chibi, no oversized head or
   hands.

## Proportions and landmarks (idle, 128 cell, soles on y 124)

| landmark | y | x / notes |
|---|---|---|
| top of bald head | 32 | head leans a little forward (stoop) |
| white brows | 39-41 | tips droop to about y 46 |
| eyes | 41-43 | calm slits |
| chin (under the beard) | 50 | head about 18 px from crown to chin |
| shoulders | 54 | rounded, about x 48..80 |
| beard tip | ~70 | |
| prayer beads (lowest bead) | ~80 | |
| waist / mantle wrap | 80 | |
| robe hem | 118 | the robe flares to about x 44..84 |
| soles (floor) | 124 | sandals about x 54..74, centered on x 64 |
| fan (idle) | 86-110 | hanging paddle-down from the left hand, about x 84..96 |

## Facing and handedness

- 3/4 view facing the viewer, body turned about 30 degrees toward screen-right (toward the ring when he
  stands left of it), head turned a little more to the right, camera about 10 degrees above.
- His **right hand (prayer beads) is on the image's LEFT**; his **left hand (fan) is on the image's
  RIGHT**, the side the ring is on.
- Mirrored by the engine at a right-side corner (the mantle and fan then swap sides; accepted).

## Expressions

| expression | look | used in |
|---|---|---|
| serene | eyes closed as calm slits, a faint smile under the mustache | `idle` |
| alert | eyes snapped wide open, white brows lifted, mouth pressed shut | `signal` f0 |
| command | mouth wide open in a commanding shout, eyes wide, brows down | `signal` f1 |

## Palette (22 colors)

The crimson is the tournament's official red (the temple banners' `#c8323c`), shared with monk-b.

| # | material | light | base | shadow | deep / extra |
|---|---|---|---|---|---|
| 1 | outline | | | | `#1d1420` |
| 2-5 | skin (tanned elder) | `#f6d0a8` | `#e0a87e` | `#b87850` | `#86523a` (wrinkles, ear, nose) |
| 6-8 | white brows, mustache, beard | `#ffffff` (also the head shine) | `#e4e0ea` | `#b0aac0` | |
| 9-11 | saffron robe | `#ffd67e` | `#f4aa3c` | `#c47a1e` | |
| 12-14 | crimson mantle, fan paddle | `#ec5a62` | `#c8323c` | `#861c28` | |
| 15-16 | gold (mantle border, fan circle) | `#ffe27a` | `#c8982c` | | |
| 17-18 | prayer beads | `#8c5c36` | `#5a3a22` | | |
| 19 | fan handle (black lacquer) | | `#3a2a30` | | (+ outline) |
| 20-21 | straw sandals | `#e4c47c` | `#b08a4c` | | |
| 22 | mouth interior | | `#5a1a22` | | |

Material rules: the beard and brows are white shapes with `#e4e0ea` / `#b0aac0` shading, not hairline
strands; the bald head gets one `#ffffff` highlight on the crown facing the upper-left light. No
gradients, no dithering.

## Reference folder

| file | what |
|---|---|
| `reference/model_sheet_vNN.png` | model-sheet candidates (PROMPTS.md S1) |
| `reference/model_sheet.png` | approved sheet (lead copies it on approval) |
| `reference/idle_approved.png` | approved idle strip (lead copies it) |

## Files

| path | what |
|---|---|
| `CHARACTER.md` | this brief |
| `ANIMATIONS.md` | the 2 animations frame by frame, timing, heights, triggers, QA |
| `PROMPTS.md` | paste-ready prompts (model sheet first) |
| `reference/` | sheet candidates and approved copies |
| `raw/<anim>_vNN.png` | generated strips; `raw/_rejected/` for rejected ones |
| `frames/<anim>/` | cleaned 128 x 128 frames |
