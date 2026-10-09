# Crowd style

How the 500+ spectators should **look**. Numbers (cell, pivot, height classes, poses) are in
[README.md](README.md) and [ADR 0008](../../docs/decisions/0008-world-art-and-parallel-production.md);
the ADR wins. The fighters' craft rules in [art/STYLE_GUIDE.md](../STYLE_GUIDE.md) apply to the crowd
too, except where this file says otherwise (front view instead of 3/4, a smaller palette, fewer tones).

## North star: the stands of the World Martial Arts Tournament

Picture the stands in the Dragon Ball tournament episodes: a **packed, loud, sunny, festive** crowd
where **nobody looks like anybody else**. Ordinary townsfolk in casual clothes sit next to martial
artists in gis, monks, rich patrons with parasols, punks, little kids on their parents' shoulders,
grandparents, food vendors, animal-headed citizens in everyday clothes (dog, cat, pig, bear, rabbit,
bird people), the odd robot or alien, and famous faces from other anime who came to watch.

From the arena camera it reads as one colorful, moving mass. A closer look rewards the player with
cameos and funny details. Every spectator passes three tests:

1. **Distinct**: no other spectator in the stands shares its silhouette plus colors.
2. **Readable**: at 64 x 96 (and smaller) you can tell who or what it is, and which pose it's in.
3. **Alive**: the three poses tell a small story: personality (idle), excitement (cheer), disbelief
   (shocked).

## From anime to a 64 x 96 sprite

The final sprite is tiny: a medium adult is 70 px tall with a head of about 11 px. Everything below
follows from that.

- **Draw big, think small.** The raw is drawn as chunky pixel art at about 8x (one art pixel = an
  8 x 8 block on the 1536 x 1024 canvas) and the packer shrinks it to the cell. A detail smaller
  than one art pixel disappears or turns into noise: thin lines, fine patterns, jewelry, small logos,
  buttons, stitching.
- **Silhouette first.** Give every spectator **one big shape** that nobody else has: a hair shape
  (spikes, buns, pompadour, afro, long flowing hair), a hat, a big prop (staff, flag, parasol,
  giant food, a baby or pet), a body shape (round, lanky, stooped, hulking), animal ears or a snout.
- **Identity in 2-3 signature colors.** Use big flat areas of the colors fans connect with the
  character (cameos) or a deliberate combination (originals). Small color specks don't survive the
  shrink.
- **Faces read through big shapes.** Bold brows, an eye shape that changes between poses, a mouth that
  opens big. Shocked uses the classic anime shock face: blank white eyes or tiny pupils, jaw dropped.
  Cheer shows a wide-open shouting mouth.
- **Proportions.** Adults follow spec v2 realism: about 6.5 heads, never chibi or super-deformed.
  Kids and creatures keep their natural proportions (a kid's head is bigger relative to the body).
  **Cameos keep the build fans know**: a short old hermit stays short, a giant stays huge; the
  roster's `heightClass` carries it.
- **Front view.** Body and face toward the viewer, camera slightly above (about 10 degrees). A small
  lean or head tilt is fine; side views and 3/4 turns are not (billboards always face the camera).

## Poses that animate well

- The engine **flips between idle and cheer quickly** (faster when the match heats up). So the **feet
  stay planted in the same spot** and the body stays centered in all three poses; the arms, head,
  upper body and face do the acting. A pose that shifts the whole body sideways makes the spectator
  jitter. Pose lines that say "hopping" or "jumping" become bent knees or tiptoes with the soles
  still on the baseline (the prompt templates say so too).
- **idle**: a calm, personal action that says who this is: arms crossed, eating, sipping a drink,
  holding a sign, leaning on a staff, carrying a kid, taking notes, scowling.
- **cheer**: big and obvious: arms up, fist pump, waving a flag or a towel, shouting. Arms may reach
  the top of the cell. **`tall` and `huge` spectators cheer with the arms out to the sides** (elbows
  bent, hands about head height) because there's no room above them.
- **shocked**: the biggest face change: jaw drop, hands on the head or cheeks, leaning back, hair
  or hat jumping up, a dropped snack.
- **Stay inside the cell.** Every pose fits within the 64 px width: flags and props are held up close
  to the body, not at arm's length to the side. Long things (staffs, spears, flagpoles) point up,
  not sideways.
- **Props welcome**: food (meat on the bone, onigiri, ice cream, popcorn, skewers), drinks, flags
  and banners with plain colors or simple patterns, foam fingers, paper fans, parasols, binoculars,
  cameras, babies, small pets, staffs. **Signs show shapes only** (a star, a fist, a heart, a flame,
  a ball with stars): no letters, numbers or kanji.

## Light, shading and outline

- **The crowd is unlit in the engine**: the light painted into the sprite is the only light it
  gets. Paint every spectator with the same light so the stands read as one scene: **key light from
  the upper front, a little from the left of the image** (the same side as the arena sun; the NPCs in
  art/npc/ use the same painted light, since all unlit world billboards must match). Shadows
  sit on the right side of forms (the viewer's right), under the chin, under hat brims and sleeves,
  and between the legs.
- **2-3 tones per material** (fighters use 3-5; the crowd cell is too small for more): shadow, base,
  and an optional light. Hard cel shapes; no gradients, airbrush, noise or dithering. Hue-shift the
  ramps a little: shadows cooler, lights warmer.
- **Outline: one art pixel, dark** (about 8 canvas px in the raw, 1 px in the cell), closed around
  the whole silhouette. Inner lines are fine where they separate big shapes (arm over torso, hair over
  face). A dark colored outline (deep brown, navy, plum) is fine; keep it darker than every fill.

## Palette (<= 24 colors per spectator)

A typical budget:

| material | colors |
|---|---|
| outline | 1-2 |
| skin (or fur, or metal for robots) | 3 |
| hair or headwear | 3 |
| main clothing | 3 |
| second clothing | 2-3 |
| accents (belt, scarf, trim, shoes) | 2-3 |
| eyes, mouth | 2 |
| prop | 3-4 |

Rules:

- **No magenta.** Never #FF00FF and no hot pink close to it: the packer keys out magenta-like
  pixels. Pink hair, skin or clothes use **soft pastel pink, bubblegum pink or salmon**, clearly
  lighter and less purple than the background.
- **Avoid big areas of pure black.** At a distance they read as holes in the crowd. Use a very dark
  navy, brown or charcoal for black clothes and hair, with a visible light tone.
- **Separate values, not just hues.** Skin, hair and main clothing differ in brightness too, so the
  spectator still reads when the stands are darkened during super flashes.
- **Saturated signature colors**, calmer secondary colors. One loud color per spectator usually
  reads better than three.
- Across a batch, vary the dominant color: ten spectators in orange read as a clone army.

## Variety across the crowd

For roster authors and reviewers. Within each group and across groups, mix:

- **builds**: thin, lanky, stocky, round, muscular, hulking, stooped elders, small kids;
- **ages**: toddlers on shoulders, kids, teens, adults, elders;
- **skin tones** across the full human range, plus animal-folk fur colors and robot metals;
- **hair**: shapes and anime colors (black, brown, blond, white, silver, red, blue, green, pink
  pastels), bald heads, hats, helmets, hoods;
- **clothing worlds**: martial-arts gis and Chinese-style jackets, monk robes, casual 80s/90s
  clothes, suits and dresses, school uniforms, biker coats, kimono and yukata, armor, sci-fi suits;
- **attitudes**: fans, skeptics, rivals sizing up the fighters, bored kids, betting gamblers, people
  more interested in their food.

## Avoid

| do | don't |
|---|---|
| one unique silhouette + 2-3 signature colors per spectator | generic clones and palette swaps of one body |
| big, simple shapes that survive an 8x shrink | tiny details: thin lines, fine patterns, jewelry, small logos |
| flat cel shading, 2-3 tones, one consistent light | photoreal shading, gradients, soft airbrush, glow, rim lights from random sides |
| expressive anime faces with bold brows and mouths | blank, identical faces |
| front view, camera slightly above | side views, 3/4 turns, back views |
| feet planted in the same spot in all three poses | a body that slides between poses |
| signs and clothes with shapes and emblems | any text, letters, numbers or kanji (lettering on an outfit becomes a plain emblem) |
| one person per image, nothing around them | seats, railings, floors, ground shadows, other people, scenery |
| a power-up shown by hair color or costume | auras, energy, sparks, speed lines, floating manga symbols (sweat drops, stars, marks) |
| adults about 6.5 heads; cameos in their known build | big-headed chibi adults |

## Prompt wording

- Lead with **"hi-res pixel-art anime fan-art sprite"**, then the character, then the pose list and
  the technical rules. The templates in [PROMPTS.md](PROMPTS.md) already do this.
- **Describe, don't just name.** Cameos give the name and series plus the `look` traits, and the
  traits carry the identity. Never name a living artist and never ask for a studio's style; "a
  classic 90s shonen anime look" is the most specific style wording allowed.
- Restate the rules that drift in every prompt: front view, three poses at the same scale, feet on
  one baseline, no text, magenta background.
