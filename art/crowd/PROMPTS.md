# Crowd prompts

Paste-ready prompts for Codex's built-in image generator: **one image per spectator**, three poses
in one row. Fill the `{{slots}}` from the spectator's roster entry and paste the block. Workflow and
QA: [README.md](README.md). Look: [STYLE.md](STYLE.md). Numbers:
[ADR 0008](../../docs/decisions/0008-world-art-and-parallel-production.md) (it wins over this file).

| template | when |
|---|---|
| **A. Cameo** | roster `kind: "cameo"` (first try) |
| **B. Cameo fallback** | the generator refuses A, or A comes out off-model twice |
| **C. Original** | roster `kind: "original"` |
| **D. Fix one pose** | a good image with one bad pose |
| E1, E2 | filled examples (db-001 Master Roshi, org-ma-003) |

## Filling the slots

Paste roster text **verbatim**. Don't add or drop traits; if an entry is wrong or unusable, report
it to the lead.

| slot | comes from |
|---|---|
| `{{name}}` | `name` (cameos) |
| `{{series}}` | the entry's `series` if it has one, else the roster file's top-level `series` |
| `{{label}}` | `label` (originals) |
| `{{look}}` | `look` |
| `{{fallbackLook}}` | `fallbackLook` (cameos) |
| `{{idle}}`, `{{cheer}}`, `{{shocked}}` | `idle`, `cheer`, `shocked` |
| `{{heightClass}}` | `heightClass` |
| `{{heightNote}}` | the paste text for that class in the table below |

**Height notes.** The raw is drawn at about 8x the final cell (one art pixel = 8 x 8 canvas px), so
the cell's 64 x 96 becomes a 512 x 768 area per pose and the class's idle height times 8 is the
figure height on the canvas. The packer rescales each spectator to its class anyway; the numbers
just keep the drawings consistent and inside the cell.

| `heightClass` | `{{heightNote}}` (paste this) |
|---|---|
| `tiny` | a tiny spectator (a small child or a small creature) with natural child or creature proportions: big head, short limbs. The idle figure is about 350 px tall on the canvas (top of hair or hat to soles). |
| `short` | a short spectator (a short adult, an elder or a young teen). The idle figure is about 465 px tall on the canvas (top of hair or hat to soles). |
| `medium` | an average-height adult spectator. The idle figure is about 560 px tall on the canvas (top of hair or hat to soles). |
| `tall` | a tall adult spectator, as tall as a tournament fighter. The idle figure is about 625 px tall on the canvas (top of hair or hat to soles). In the cheer pose the arms go out to the sides with bent elbows and the hands at about head height, never straight up. |
| `huge` | a huge spectator (a giant or a very big, bulky build). The idle figure is about 670 px tall on the canvas (top of hair or hat to soles). In the cheer pose the arms go out to the sides with bent elbows and the hands at about head height, never straight up, and the body stays inside its 480 px column. |

**Style anchor (optional).** When the lead has named a style anchor in [README.md](README.md),
attach it and add this line right after the first line of the prompt:

```text
STYLE REFERENCE: the attached image shows the target pixel style for the whole crowd. Match its pixel size, outline weight, shading and colorfulness, but draw a completely different person.
```

---

## A. Cameo

```text
Hi-res pixel-art anime fan-art sprite for a 2D anime fighting game: ONE spectator in the tournament crowd, shown in three full-body poses.
CHARACTER: {{name}} from {{series}}, drawn as a crowd spectator in their usual outfit: {{look}}.
BUILD: height class {{heightClass}}: {{heightNote}}

LAYOUT: one 1536x1024 landscape canvas. Exactly three full-body poses of the SAME person in one horizontal row, each centered in its own third of the canvas (512 px wide), left to right:
1. LEFT, idle: {{idle}};
2. MIDDLE, cheer: {{cheer}};
3. RIGHT, shocked: {{shocked}}.
Same person, same outfit, same colors and exactly the same scale in all three poses (same head size, same body size). All feet stand on one shared horizontal baseline about 145 px above the bottom edge of the canvas, and the feet stay in the same spot in every pose: the arms, head, upper body and face do the acting. If a pose line mentions hopping, jumping, leaping, bouncing or kicking, show it with bent knees, tiptoes or one lifted heel instead: every sole still touches the baseline. Every pose fits inside a 480 px wide column, with at least 140 px of empty background above its highest point and clear empty gaps between the poses. Nothing touches the canvas edges.
VIEW: front view: body and face toward the viewer in all three poses, the camera slightly above (about 10 degrees, looking a little down). No side view, no back view, no 3/4 turn.
SIZE: draw big and clean. Chunky hi-res pixel art where every art pixel is a square block of about 8x8 canvas pixels. The finished sprite is shrunk to 64x96 pixels, so use big simple shapes, no detail smaller than one art pixel, and make the face, the hair shape and the 2-3 signature colors read at a glance.
STYLE: crisp hard-edged pixel art with a classic 90s shonen anime look: clean bold shapes, bright saturated colors, an expressive anime face with bold brows and a big readable mouth. A dark outline one art pixel thick (about 8 canvas px) around the whole figure. Flat cel shading with 2 to 3 tones per material, key light from the upper front, a little from the left of the image. At most 24 colors in total. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow.
PROPORTIONS: the character's usual anime build. Adults are not chibi and not super-deformed (no big heads, no oversized hands or feet) unless the character really looks like that.
BACKGROUND: flat solid magenta #FF00FF behind everything. Never use magenta or hot pink on the spectator; any pink is a soft pastel or salmon pink.
DO NOT DRAW: text, letters, numbers or kanji anywhere (lettering on clothes or signs becomes a plain shape or emblem); speech bubbles; labels; floating symbols (sweat drops, stars, exclamation marks, hearts); aura, energy or effects; seats, railings, floor, ground shadow, scenery or any other person.
```

## B. Cameo fallback (no names)

Use when A is refused or comes out off-model twice. If a pose line names a character, series or
technique, describe it instead (for example "holding a small orange ball with red stars" instead of a
named item).

```text
Hi-res pixel-art anime fan-art sprite for a personal non-commercial 2D anime fighting game: ONE spectator in the tournament crowd, shown in three full-body poses.
CHARACTER: an original anime crowd spectator inspired by classic shonen anime: {{fallbackLook}}.
BUILD: height class {{heightClass}}: {{heightNote}}

LAYOUT: one 1536x1024 landscape canvas. Exactly three full-body poses of the SAME person in one horizontal row, each centered in its own third of the canvas (512 px wide), left to right:
1. LEFT, idle: {{idle}};
2. MIDDLE, cheer: {{cheer}};
3. RIGHT, shocked: {{shocked}}.
Same person, same outfit, same colors and exactly the same scale in all three poses (same head size, same body size). All feet stand on one shared horizontal baseline about 145 px above the bottom edge of the canvas, and the feet stay in the same spot in every pose: the arms, head, upper body and face do the acting. If a pose line mentions hopping, jumping, leaping, bouncing or kicking, show it with bent knees, tiptoes or one lifted heel instead: every sole still touches the baseline. Every pose fits inside a 480 px wide column, with at least 140 px of empty background above its highest point and clear empty gaps between the poses. Nothing touches the canvas edges.
VIEW: front view: body and face toward the viewer in all three poses, the camera slightly above (about 10 degrees, looking a little down). No side view, no back view, no 3/4 turn.
SIZE: draw big and clean. Chunky hi-res pixel art where every art pixel is a square block of about 8x8 canvas pixels. The finished sprite is shrunk to 64x96 pixels, so use big simple shapes, no detail smaller than one art pixel, and make the face, the hair shape and the 2-3 signature colors read at a glance.
STYLE: crisp hard-edged pixel art with a classic 90s shonen anime look: clean bold shapes, bright saturated colors, an expressive anime face with bold brows and a big readable mouth. A dark outline one art pixel thick (about 8 canvas px) around the whole figure. Flat cel shading with 2 to 3 tones per material, key light from the upper front, a little from the left of the image. At most 24 colors in total. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow.
PROPORTIONS: natural anime proportions for this kind of person. Adults are not chibi and not super-deformed (no big heads, no oversized hands or feet); kids and creatures keep their natural build.
BACKGROUND: flat solid magenta #FF00FF behind everything. Never use magenta or hot pink on the spectator; any pink is a soft pastel or salmon pink.
DO NOT DRAW: text, letters, numbers or kanji anywhere (lettering on clothes or signs becomes a plain shape or emblem); speech bubbles; labels; floating symbols (sweat drops, stars, exclamation marks, hearts); aura, energy or effects; seats, railings, floor, ground shadow, scenery or any other person.
```

If B is refused too: use template C with `{{label}}` = `Original spectator` and `{{look}}` = the
`fallbackLook` with any series-specific item described as a plain object (same colours, build and
props), save it under the printed path and report `<id>: refused, generated as original` in `done
--note` (the queue rule, [art/queue/README.md](../queue/README.md#worker-loop) step 7). Don't keep
rephrasing on your own; the lead rewrites the roster entry and reopens the id if needed.

## C. Original

```text
Hi-res pixel-art anime fan-art sprite for a 2D anime fighting game: ONE spectator in the tournament crowd, shown in three full-body poses.
CHARACTER: an original crowd spectator at an anime martial-arts tournament, in a colorful anime world where humans and animal-headed townsfolk watch the fights side by side. {{label}}: {{look}}.
BUILD: height class {{heightClass}}: {{heightNote}}

LAYOUT: one 1536x1024 landscape canvas. Exactly three full-body poses of the SAME person in one horizontal row, each centered in its own third of the canvas (512 px wide), left to right:
1. LEFT, idle: {{idle}};
2. MIDDLE, cheer: {{cheer}};
3. RIGHT, shocked: {{shocked}}.
Same person, same outfit, same colors and exactly the same scale in all three poses (same head size, same body size). All feet stand on one shared horizontal baseline about 145 px above the bottom edge of the canvas, and the feet stay in the same spot in every pose: the arms, head, upper body and face do the acting. If a pose line mentions hopping, jumping, leaping, bouncing or kicking, show it with bent knees, tiptoes or one lifted heel instead: every sole still touches the baseline. Every pose fits inside a 480 px wide column, with at least 140 px of empty background above its highest point and clear empty gaps between the poses. Nothing touches the canvas edges.
VIEW: front view: body and face toward the viewer in all three poses, the camera slightly above (about 10 degrees, looking a little down). No side view, no back view, no 3/4 turn.
SIZE: draw big and clean. Chunky hi-res pixel art where every art pixel is a square block of about 8x8 canvas pixels. The finished sprite is shrunk to 64x96 pixels, so use big simple shapes, no detail smaller than one art pixel, and make the face, the hair or head shape and the 2-3 signature colors read at a glance.
STYLE: crisp hard-edged pixel art with a classic 90s shonen anime look: clean bold shapes, bright saturated colors, an expressive anime face with bold brows and a big readable mouth. A dark outline one art pixel thick (about 8 canvas px) around the whole figure. Flat cel shading with 2 to 3 tones per material, key light from the upper front, a little from the left of the image. At most 24 colors in total. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow.
PROPORTIONS: natural anime proportions for this kind of person: adults about 6.5 heads tall, not chibi and not super-deformed (no big heads, no oversized hands or feet); kids and creatures keep their natural build.
BACKGROUND: flat solid magenta #FF00FF behind everything. Never use magenta or hot pink on the spectator; any pink is a soft pastel or salmon pink.
DO NOT DRAW: text, letters, numbers or kanji anywhere (lettering on clothes or signs becomes a plain shape or emblem); speech bubbles; labels; floating symbols (sweat drops, stars, exclamation marks, hearts); aura, energy or effects; seats, railings, floor, ground shadow, scenery or any other person.
```

## D. Fix one pose

Attach the image being fixed (the highest `art/crowd/raw/<id>_vNN.png`). The result is a whole new
image: save it as the next version. Compare the two kept poses with the attached image; if they
drifted (different face, colors or scale), drop the result and regenerate from A, B or C instead.

| slot | example |
|---|---|
| `{{fixPose}}` | `MIDDLE (cheer)` |
| `{{keepPoses}}` | `LEFT (idle) and RIGHT (shocked)` |
| `{{poseText}}` | the roster's pose text for the fixed pose |
| `{{problem}}` | what is wrong, in one sentence: `the arms are cut off by the top edge`, `he turned sideways`, `the sign has letters on it` |

```text
The attached image is a pixel-art sprite of one tournament spectator in three poses (LEFT idle, MIDDLE cheer, RIGHT shocked) on a flat magenta #FF00FF background.
Redraw the whole image as a new image. Keep the {{keepPoses}} poses exactly as they are: same person, same outfit, same colors, same scale, same position, same pixel style. Change only the {{fixPose}} pose: {{poseText}}. Fix this problem: {{problem}}.
Keep the same layout: one 1536x1024 canvas, three full-body poses of the same person in one row, the feet of all three on the same baseline and in the same spot, no pose hopping or jumping off the baseline (bent knees or tiptoes instead), every pose at exactly the same scale as the others, front view facing the viewer with the camera slightly above, every pose inside its 480 px column with at least 140 px of empty background above it. Same chunky hard-edged pixel art with the same dark outline and flat cel shading, at most 24 colors.
Flat magenta #FF00FF background. No text, letters, numbers or kanji, no speech bubbles, no floating symbols, no aura or effects, no floor, no ground shadow, no other people.
```

## Retry wording

When an attempt fails quick QA, add the matching sentence to the end of the same prompt and try
again (3 attempts per spectator, then move on; see README).

| problem | add |
|---|---|
| poses at different scales | `All three poses are exactly the same scale: the head is the same size in every pose and the idle and shocked figures are the same height.` |
| side view or 3/4 turn | `Every pose faces the viewer straight on: chest, hips and face toward the camera.` |
| more or fewer than three figures, or other people | `Exactly three figures, all of the same single person, and nobody else.` |
| text, letters, numbers on clothes or signs | `There is no writing anywhere: every sign and every piece of clothing shows only plain colors and simple shapes.` |
| floor, ground shadow, scenery | `The figures stand on pure flat magenta: no floor line, no shadow under the feet, nothing behind them.` |
| feet on different heights, figure slides between poses | `The soles of all three poses touch the same baseline, and the feet are in the same spot in every pose.` |
| chibi or big-headed adult | `Realistic anime adult proportions, about 6.5 heads tall: small head, long legs, normal-size hands; not chibi.` |
| painterly, noisy or too detailed | `Chunky pixel art: every art pixel is an 8x8 block; big flat color areas, hard edges, about 20 colors.` |
| magenta or hot pink on the spectator | `Every pink on the spectator is a soft pastel pink, clearly lighter than the magenta background.` |
| cheer arms cut off or too wide | `In the cheer pose the arms bend at the elbows and stay within the column, hands at about head height.` |
| the three poses look the same | `The three poses must be clearly different: calm in the idle pose, arms up and shouting in the cheer pose, jaw dropped and eyes wide in the shocked pose.` |
| cameo off-model | Move the missing trait from `look` to the start of the CHARACTER line; after two off-model results, switch to template B. |

---

## E1. Filled example: db-001 Master Roshi (cameo, short)

Roster entry copied from `art/crowd/roster/dragon-ball.json` on 2026-10-08 (the roster wins if it
changed): `name` Master Roshi · `series` Dragon Ball / Dragon Ball Z / Dragon Ball Super / Dragon Ball GT · `heightClass` short.
Save as `art/crowd/raw/db-001_v01.png` (the first version).

```text
Hi-res pixel-art anime fan-art sprite for a 2D anime fighting game: ONE spectator in the tournament crowd, shown in three full-body poses.
CHARACTER: Master Roshi from Dragon Ball / Dragon Ball Z / Dragon Ball Super / Dragon Ball GT, drawn as a crowd spectator in their usual outfit: slightly hunched elderly martial-arts master with a shiny bald head, a long white beard and bushy white mustache, round black sunglasses, a big green turtle shell strapped to his back like a backpack, an orange short-sleeve shirt with a small white flower print, tan shorts, sandals and a gnarled wooden walking staff.
BUILD: height class short: a short spectator (a short adult, an elder or a young teen). The idle figure is about 465 px tall on the canvas (top of hair or hat to soles).

LAYOUT: one 1536x1024 landscape canvas. Exactly three full-body poses of the SAME person in one horizontal row, each centered in its own third of the canvas (512 px wide), left to right:
1. LEFT, idle: leaning on his staff with both hands, sly grin;
2. MIDDLE, cheer: staff raised high, hopping and cackling;
3. RIGHT, shocked: sunglasses slipping down his nose, jaw dropped, beard flying.
Same person, same outfit, same colors and exactly the same scale in all three poses (same head size, same body size). All feet stand on one shared horizontal baseline about 145 px above the bottom edge of the canvas, and the feet stay in the same spot in every pose: the arms, head, upper body and face do the acting. If a pose line mentions hopping, jumping, leaping, bouncing or kicking, show it with bent knees, tiptoes or one lifted heel instead: every sole still touches the baseline. Every pose fits inside a 480 px wide column, with at least 140 px of empty background above its highest point and clear empty gaps between the poses. Nothing touches the canvas edges.
VIEW: front view: body and face toward the viewer in all three poses, the camera slightly above (about 10 degrees, looking a little down). No side view, no back view, no 3/4 turn.
SIZE: draw big and clean. Chunky hi-res pixel art where every art pixel is a square block of about 8x8 canvas pixels. The finished sprite is shrunk to 64x96 pixels, so use big simple shapes, no detail smaller than one art pixel, and make the face, the hair shape and the 2-3 signature colors read at a glance.
STYLE: crisp hard-edged pixel art with a classic 90s shonen anime look: clean bold shapes, bright saturated colors, an expressive anime face with bold brows and a big readable mouth. A dark outline one art pixel thick (about 8 canvas px) around the whole figure. Flat cel shading with 2 to 3 tones per material, key light from the upper front, a little from the left of the image. At most 24 colors in total. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow.
PROPORTIONS: the character's usual anime build. Adults are not chibi and not super-deformed (no big heads, no oversized hands or feet) unless the character really looks like that.
BACKGROUND: flat solid magenta #FF00FF behind everything. Never use magenta or hot pink on the spectator; any pink is a soft pastel or salmon pink.
DO NOT DRAW: text, letters, numbers or kanji anywhere (lettering on clothes or signs becomes a plain shape or emblem); speech bubbles; labels; floating symbols (sweat drops, stars, exclamation marks, hearts); aura, energy or effects; seats, railings, floor, ground shadow, scenery or any other person.
```

If this is refused, the template B CHARACTER line becomes:

```text
CHARACTER: an original anime crowd spectator inspired by classic shonen anime: small hunched elderly martial-arts hermit with a bald head, a long white beard, round dark sunglasses, a green turtle shell worn like a backpack, an orange flower-print short-sleeve shirt, tan shorts, sandals and a wooden walking staff.
```

QA focus for this one: the white beard and the sunglasses read at 1/8 size; the green shell rim
shows behind his shoulders in front view; the staff points up in the cheer pose (not out to the
side) and the "hopping" reads as tiptoes with both soles on the baseline; the sunglasses visibly slip in the shocked pose.

## E2. Filled example: org-ma-003 heavyweight wrestler (original, huge)

Roster entry copied from `art/crowd/roster/martial-artists.json` on 2026-10-08 (the roster wins if it
changed): `label` Heavyweight wrestler in a yukata · `heightClass` huge.
Save as `art/crowd/raw/org-ma-003_v01.png`.

```text
Hi-res pixel-art anime fan-art sprite for a 2D anime fighting game: ONE spectator in the tournament crowd, shown in three full-body poses.
CHARACTER: an original crowd spectator at an anime martial-arts tournament, in a colorful anime world where humans and animal-headed townsfolk watch the fights side by side. Heavyweight wrestler in a yukata: enormous round heavyweight wrestler with oiled black hair in a small topknot, a round friendly face with tiny eyes and a huge belly, wearing a dark-blue cotton yukata loosely open at the chest, a thick white rope belt and wooden geta sandals.
BUILD: height class huge: a huge spectator (a giant or a very big, bulky build). The idle figure is about 670 px tall on the canvas (top of hair or hat to soles). In the cheer pose the arms go out to the sides with bent elbows and the hands at about head height, never straight up, and the body stays inside its 480 px column.

LAYOUT: one 1536x1024 landscape canvas. Exactly three full-body poses of the SAME person in one horizontal row, each centered in its own third of the canvas (512 px wide), left to right:
1. LEFT, idle: arms folded over his big belly, calmly watching;
2. MIDDLE, cheer: both arms spread wide out to the sides, booming belly laugh;
3. RIGHT, shocked: palms slapped to his puffed cheeks, eyes popping.
Same person, same outfit, same colors and exactly the same scale in all three poses (same head size, same body size). All feet stand on one shared horizontal baseline about 145 px above the bottom edge of the canvas, and the feet stay in the same spot in every pose: the arms, head, upper body and face do the acting. If a pose line mentions hopping, jumping, leaping, bouncing or kicking, show it with bent knees, tiptoes or one lifted heel instead: every sole still touches the baseline. Every pose fits inside a 480 px wide column, with at least 140 px of empty background above its highest point and clear empty gaps between the poses. Nothing touches the canvas edges.
VIEW: front view: body and face toward the viewer in all three poses, the camera slightly above (about 10 degrees, looking a little down). No side view, no back view, no 3/4 turn.
SIZE: draw big and clean. Chunky hi-res pixel art where every art pixel is a square block of about 8x8 canvas pixels. The finished sprite is shrunk to 64x96 pixels, so use big simple shapes, no detail smaller than one art pixel, and make the face, the hair or head shape and the 2-3 signature colors read at a glance.
STYLE: crisp hard-edged pixel art with a classic 90s shonen anime look: clean bold shapes, bright saturated colors, an expressive anime face with bold brows and a big readable mouth. A dark outline one art pixel thick (about 8 canvas px) around the whole figure. Flat cel shading with 2 to 3 tones per material, key light from the upper front, a little from the left of the image. At most 24 colors in total. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow.
PROPORTIONS: natural anime proportions for this kind of person: adults about 6.5 heads tall, not chibi and not super-deformed (no big heads, no oversized hands or feet); kids and creatures keep their natural build.
BACKGROUND: flat solid magenta #FF00FF behind everything. Never use magenta or hot pink on the spectator; any pink is a soft pastel or salmon pink.
DO NOT DRAW: text, letters, numbers or kanji anywhere (lettering on clothes or signs becomes a plain shape or emblem); speech bubbles; labels; floating symbols (sweat drops, stars, exclamation marks, hearts); aura, energy or effects; seats, railings, floor, ground shadow, scenery or any other person.
```

QA focus for this one: the cheer arms "spread wide" must still bend at the elbows and stay inside
the 480 px column (huge class: the widest pose is the risk); the dark-blue yukata keeps a visible
light tone so it doesn't read as a black hole; the tiny eyes still change between poses (popping in
shocked).
