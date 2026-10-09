# Vendor (snack seller): character brief

> Read this first, then [ANIMATIONS.md](ANIMATIONS.md) (poses, timing, QA numbers) and
> [PROMPTS.md](PROMPTS.md) (paste-ready prompts). NPC spec, file flow and engine use:
> [art/npc/README.md](../README.md). Rules: [ADR 0008](../../../docs/decisions/0008-world-art-and-parallel-production.md)
> wins over everything else.

| | |
|---|---|
| Engine id | `vendor` (folder `art/npc/vendor/`, output `public/npc/vendor/`) |
| Role | the **snack vendor** working the stands: noodles, dumpling skewers and buns from a tray hung around his neck. Pure atmosphere: he keeps hawking his food whatever happens in the ring |
| Kind | original design (no name, no fallback needed) |
| Animations | `idle` 2 |
| Cell / pivot / ppu | 128 x 128 / [64, 124] / 80 |
| Idle height | **104 px** (1.30 world units: a stocky, slightly short adult) |
| Placement | in an aisle of the stands: the stair gaps of the side stands or the entrance path between the front stands. The engine may drift him slowly along the aisle (no walk animation) |

## One-paragraph look

> a stocky, cheerful middle-aged snack vendor with a round friendly face, rosy cheeks, a small black
> mustache and short black hair, a twisted white towel tied around his forehead as a headband with the
> knot and two short ends at one side, a short-sleeved indigo festival coat with white trim along the
> collar edges and the sleeves rolled to the elbows, tied with a dark belt over a white undershirt,
> dark-brown knee-length shorts and straw sandals; hung from a rope strap around his neck he carries a
> shallow wooden tray at belly height holding two red lacquered bowls of noodles with chopsticks, three
> skewers of tri-color dumplings (pink, white and green) and three white steamed buns

## Who he is on screen

The festival around the fight. Big voice, big grin, small eyes squeezed shut when he laughs; he bobs
along with his tray and calls out his food like it is the main event. Friendly and a little comic,
drawn with natural proportions (stocky, not chibi). He never reacts to the fight: that contrast with the
screaming crowd is the joke.

## Identity checklist

1. **Headband:** a twisted **white towel** tied around the forehead, the knot and two short ends on his
   left side (the right side of the image). Short black hair shows above and below it.
2. **Face:** round, friendly, **rosy cheeks**, a small black **mustache**, small eyes that close into
   happy arcs when he calls out.
3. **Coat:** a short-sleeved **indigo festival coat** (happi style) with **white trim** along the collar
   edges, sleeves rolled to the elbows, tied with a dark belt, open over a **white undershirt**. Plain:
   **no letters, crests or patterns with writing** on it.
4. **Legs:** dark-brown knee-length shorts, straw sandals.
5. **Tray:** a shallow rectangular **wooden tray** on a rope strap around the neck, carried in front at
   belly height, seen a little from above so the food reads: **two red lacquered noodle bowls** with
   chopsticks, **three dumpling skewers** (pink, white, green balls on a stick) and **three white steamed
   buns**. The same food in the same places in every frame. No steam drawn (the engine may add it).
6. **Build:** stocky, round belly, broad shoulders, slightly short; about **5.5 heads** tall, natural
   anime proportions. Not chibi, no oversized head or hands.

## Proportions and landmarks (idle, 128 cell, soles on y 124)

| landmark | y | x / notes |
|---|---|---|
| top of the towel headband | 20 | knot ends stick out to about x 82 |
| eyes | 31 | |
| chin | 40 | head about 20 px from crown to chin |
| shoulders | 44 | broad: about x 46..82 |
| food on the tray (tallest skewer tip) | ~52 | |
| tray (front edge) | 64-74 | about x 38..90 |
| belt / waist | 76 | |
| shorts hem | 96 | |
| knees | 102 | |
| soles (floor) | 124 | feet about x 52..76, centered on x 64 |

## Facing and handedness

- 3/4 view facing the viewer, body turned about 30 degrees toward screen-right, head turned a little
  more to the right, camera about 10 degrees above (it lets the tray's top surface show).
- His **right hand is on the image's LEFT** (the calling hand); his **left hand is on the image's
  RIGHT** (steadying the tray).
- The engine may mirror him (aisle on the other side, or walking the other way); accepted.

## Expressions

| expression | look | used in |
|---|---|---|
| calling out | mouth wide open, eyes closed in happy arcs, brows up | `idle` f0 |
| grin | big closed-mouth grin, cheeks pushed up, eyes open and twinkling | `idle` f1 |

## Palette (27 colors)

| # | material | light | base | shadow | deep / extra |
|---|---|---|---|---|---|
| 1 | outline | | | | `#1d1420` |
| 2-5 | skin (sun-tanned) | `#ffd8b0` | `#eeb487` | `#c88560` | `#985a40` (ear, nose, mouth corners) |
| 6 | cheek blush | | `#f08a7a` | | |
| 7-8 | hair, mustache, chopsticks' dark ends | `#4a3a3e` | `#2a2028` | | |
| 9-11 | white (towel, trim, undershirt, buns, white dumplings) | `#ffffff` | `#e6e2ea` | `#b8b2c4` | |
| 12-14 | indigo coat | `#4f70bc` | `#30488c` | `#1d2b5c` | |
| 15-17 | brown shorts, belt | `#7c5c42` | `#5a3e2a` | `#3a2618` | |
| 18-20 | tray wood, rope strap, straw sandals, skewer sticks, chopsticks | `#e2b27c` | `#b8814a` | `#84562f` | |
| 21-22 | red lacquer bowls | `#e44a4a` | `#a82a32` | | |
| 23-24 | noodles | `#ffe9a6` | `#eec45e` | | |
| 25 | pink dumplings | | `#ffb2c6` | | |
| 26 | green dumplings | | `#8cd27a` | | |
| 27 | mouth interior | | `#5a1a22` | | |

Material rules: the food is a few bold, readable shapes (round bowl rims, three-ball skewers, round
buns), not tiny noise; at 1x the tray must read as "food tray" in one glance. No gradients, no
dithering.

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
| `ANIMATIONS.md` | the animation frame by frame, timing, height, QA |
| `PROMPTS.md` | paste-ready prompts (model sheet first) |
| `reference/` | sheet candidates and approved copies |
| `raw/idle_vNN.png` | generated strips; `raw/_rejected/` for rejected ones |
| `frames/idle/` | cleaned 128 x 128 frames |
