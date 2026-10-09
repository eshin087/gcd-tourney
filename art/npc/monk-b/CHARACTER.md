# Monk B (young judge): character brief

> Read this first, then [ANIMATIONS.md](ANIMATIONS.md) (poses, timing, QA numbers) and
> [PROMPTS.md](PROMPTS.md) (paste-ready prompts). NPC spec, file flow and engine use:
> [art/npc/README.md](../README.md). Rules: [ADR 0008](../../../docs/decisions/0008-world-art-and-parallel-production.md)
> wins over everything else.

| | |
|---|---|
| Engine id | `monk-b` (folder `art/npc/monk-b/`, output `public/npc/monk-b/`) |
| Role | the **young judge**: the second tournament official at the ring corners. Signals the start, ring-outs and the final decision with his staff |
| Kind | original design (no name, no fallback needed) |
| Animations | `idle` 2, `signal` 2 |
| Cell / pivot / ppu | 128 x 128 / [64, 124] / 80 |
| Idle height | **108 px** (1.35 world units: the tallest, leanest body of the NPCs) |
| Placement | on the grass just outside the ring corner opposite [monk-a](../monk-a/CHARACTER.md) (proposed: back-right, mirrored by the engine) |

## One-paragraph look

> a tall, lean young monk of about twenty with a cleanly shaved head, thick straight black eyebrows,
> sharp serious eyes and a strong jaw, wearing a slate-grey cross-collared martial robe that falls to
> the knees over loose grey trousers, a crimson collar band and a crimson sash tied at the waist with
> two hanging ends, white cloth leg wraps from ankle to knee and black cloth shoes, holding a long plain
> dark-wood staff with a crimson ribbon tied just below its top end

## Who he is on screen

Discipline. He stands straight as his staff and never relaxes, eyes on the ring at all times. Where the
elder judge is serene, the young judge is tense and sharp: when he makes a call it is fast and
martial, the staff snapping from overhead to point at the ring like a spear.

**Silhouette versus monk-a:** tall, narrow and vertical, the long staff doubling the vertical line;
monk-a is short, round and bottom-heavy with a flat fan. They must never read as the same sprite.

## Identity checklist

1. **Head:** cleanly **shaved** head (a faint grey stubble tone over the scalp, no hair shapes), thick
   straight **black eyebrows**, sharp serious eyes, strong jaw, clean-shaven face.
2. **Robe:** **slate-grey** cross-collared martial robe (left panel over right) falling to the knees,
   long sleeves, over loose grey trousers.
3. **Crimson:** a crimson collar band along the robe's opening and a **crimson sash** tied at the waist
   with two short hanging ends (the tournament's official red, shared with monk-a).
4. **Legs:** white cloth leg wraps from ankle to knee; black cloth shoes.
5. **Staff:** a long, plain, straight **dark-wood staff**, a little shorter than he is (its top at about
   his eye level when planted), with a **crimson ribbon** tied just below the top end, two short tails
   hanging. **Always held in his right hand** (the left side of the image) in `idle`; both hands in
   `signal`.
6. **Build:** young man, tall and lean, upright and rigid, about **7 heads** tall, natural anime
   proportions. Not chibi, not bulky, no big head.

## Proportions and landmarks (idle, 128 cell, soles on y 124)

| landmark | y | x / notes |
|---|---|---|
| top of shaved head | 16 | |
| eyebrows | 23 | |
| eyes | 25 | |
| chin | 32 | head about 16 px from crown to chin (about 7 heads) |
| shoulders | 37 | about x 50..78 |
| sash | 66-70 | sash ends hang to about y 80 |
| robe hem | ~94 | |
| knees | ~98 | |
| leg wraps | 98-118 | |
| soles (floor) | 124 | feet about x 54..74, centered on x 64 |
| staff (idle) | 24-124 | planted beside his right foot at about x 44..48; the ribbon hangs at about y 28..40 |

## Facing and handedness

- 3/4 view facing the viewer, body turned about 30 degrees toward screen-right, head turned a little
  more to the right, camera about 10 degrees above.
- His **right hand (staff in idle) is on the image's LEFT**; his **left hand is on the image's RIGHT**,
  the side the ring is on.
- Mirrored by the engine at a right-side corner (accepted).

## Expressions

| expression | look | used in |
|---|---|---|
| stern | eyes open and narrowed, brows straight, mouth a firm line | `idle` |
| alert | eyes wide, brows down, jaw set | `signal` f0 |
| call | mouth wide open in a sharp shout, brows hard down | `signal` f1 |

## Palette (21 colors)

| # | material | light | base | shadow | deep / extra |
|---|---|---|---|---|---|
| 1 | outline | | | | `#1d1420` |
| 2-5 | skin | `#ffdcbc` | `#ecba90` | `#c68a64` | `#966048` (ear, nose, jaw line) |
| 6 | scalp stubble tone | | `#a89aa8` | | |
| 7 | eyebrows, irises | | `#2b2232` | | |
| 8-11 | slate-grey robe, trousers, shoes | `#9aa4b8` | `#6a7488` | `#465066` | `#2c3344` (shoes, deep folds) |
| 12-14 | crimson collar band, sash, ribbon | `#ec5a62` | `#c8323c` | `#861c28` | |
| 15-17 | white leg wraps, eye whites, teeth | `#ffffff` | `#e4e0ea` | `#b0aac0` | |
| 18-20 | staff wood | `#cc965c` | `#9c683a` | `#6a4426` | |
| 21 | mouth interior | | `#5a1a22` | | |

Material rules: the shaved scalp is skin tones with a few `#a89aa8` stubble pixels on the shadow side,
never a hair silhouette; the staff is one straight line of wood (light edge toward the upper-left
light, dark edge on the other side). No gradients, no dithering.

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
