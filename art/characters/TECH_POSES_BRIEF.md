# Tech poses brief (ART-TECH-01)

For Codex. Three new optional animations for every fighter ([ADR 0029](../../docs/decisions/0029-tech-recovery-animations.md)):
the poses of the techs players and CPUs already do. Today the game shows `land`, `airRecover` and `jumpUp` for them; as
soon as a fighter's strip is packed, the game plays it instead (each strip switches on by itself). Contract:
[SPEC.md "Tech poses"](../SPEC.md#tech-poses); template rows and prompts:
[_template/ANIMATIONS.md](_template/ANIMATIONS.md#techground) and [_template/PROMPTS.md](_template/PROMPTS.md#techground).

| strip | what | frames | art beats | game beats (60 fps) | tallest frame (sets `bodyHeight`) |
|---|---|---|---|---|---|
| `techGround` | ground tech in place: impact brace, push up, back in the stance | 4 | 1 / 2 / 1 | 4 / 10 / 4 | f3, the stance (= the idle's height) |
| `techRoll` | ground tech roll: shoulder contact, one forward roll, low crouch | 6 (parts 3 + 3) | 1 / 4 / 1 | 3 / 15 / 4 (hold-Guard roll 3 / 15 / 2) | f5 or f0 (a crouch: about the `jumpSquat` height) |
| `wallTech` | wall tech: feet-first cling, push-off, airborne recovery | 5 | 2 / 1 / 2 | 6 / 4 / 8 | f4, the fall (= the `jumpFall` height) |

The engine drives each strip by the tech state's own clock, so the art never changes timing, invulnerability or movement.
`techRoll` is drawn as a forward roll toward screen-right; the game plays the four tumble frames backward for a roll away
from the opponent, so make them even quarter turns. `wallTech`'s wall is implied at the cell's left; the packer puts
the leftmost pixel of f0-f2 on x 128 (the barrier) and the game turns or re-centres the strip for each of the four
barrier walls. The wall jump (↑ at the kick) reuses f0-f2, then `jumpUp`: no extra strip.

## Rules for this batch

- **Work in the fighter's existing title-style production worktree** (it already has the approved title-style references
  and the fighter's current idle, jumpFall and jumpSquat): Naruto `.worktrees/art-naruto-title-production` (PR #69), Sasuke `.worktrees/art-sasuke-title-production`
  (PR #71), Killua `.worktrees/art-killua-title-production` (PR #70), Gojo `.worktrees/art-gojo-title-production` (PR #72). First run `git merge main` there, so the
  branch has this support (packer, scale gate, lab, guide), and commit the merge. Never a copy, never `--full`. If a
  worktree is missing, `npm run pr -- start <branch> --art <id>` recreates a real one. These branches stay WIP; Claude
  alone merges them.
- **Own only `techGround`, `techRoll`, `wallTech` of that fighter.** `down` and `ko` stay as they are (the user's
  chosen original poses): a tech never lies down.
- **The approved title-style contract applies** (`art/scale/title-style-pilot/PRODUCTION_CONTRACT.md` in PR #68): the
  approved neutral and combat cells are ground truth; one anatomical scale in every pose; head, torso, limb lengths and
  clothing volume preserved; a crouch, roll or brace is never fitted to a standing height; no generic head ratio.
- **Versions:** these names are new, so the first candidates are `_v01` unless Git history or `art/REVIEW.md` already
  holds one. Up to 3 attempts per image (count unsaved failures); keep only the best; never overwrite, reuse or delete a
  version. Each candidate gets its REVIEW row (status `needs review`), its manifest version and its tracker status.
- **Manifest:** add the three entries to `characters.<id>.animations` (copy them from `animationDefaults`: frames, beats,
  `hitbox: false`, step 9) and set each `bodyHeight` from the table above against THIS branch's own entries: techGround =
  this fighter's `idle` bodyHeight, wallTech = its `jumpFall` bodyHeight, techRoll = its `jumpSquat` bodyHeight to start.
  Then adjust only so the readable frames' head, torso and limbs match the approved combat cell at native size, never to
  make a tucked frame taller. Move the fighter's rows from the tracker's "Tech poses" table into its own section.

## Per fighter

| fighter | neutral (incl. hair) | combat stance | body target | attach (in the worktree) |
|---|---|---|---|---|
| Naruto | 94x205 px | 150x165 px | 195 px | `art/characters/naruto/reference/title_style_draft_v01.png`, `art/characters/naruto/reference/title_neutral_v01.png`, `art/characters/naruto/reference/title_combat_v01.png`; the fighter's current idle and jumpFall |
| Sasuke | 90x209 px | 155x180 px | 197 px | `art/characters/sasuke/reference/title_style_draft_v01.png`, the pilot cells `sasuke-neutral_v01.png` and `sasuke-combat_v01.png` (below); the fighter's current idle and jumpFall |
| Killua | 82x186 px | 148x146 px | 176 px | `art/characters/killua/reference/title_style_approved.png`, `art/characters/killua/reference/title_style_draft_v01.png`; the fighter's current idle and jumpFall |
| Gojo | 91x236 px | 156x214 px | 222 px | `art/characters/gojo/reference/title_style_approved.png`, `art/characters/gojo/reference/title_neutral_approved.png`; the fighter's current idle and jumpFall |

Ground truth for every fighter, at the exact packed scale: the approved pilot cells `<id>-neutral_v01.png` and `<id>-combat_v01.png` in `.worktrees/art-title-style-pilot/public/art-review/title-style-pilot/` (PR #68). Compare every new frame with them at native size.

Every prompt below is self-contained. Attach the listed approved references (and, for techRoll part B, part A of the same
version), then paste the block. Save as `art/characters/<id>/raw/techGround_vNN.png`, `raw/wallTech_vNN.png` and the roll
as two parts `raw/_parts/techRoll_vNN_A.png` (poses 1-3) + `_B.png` (poses 4-6).

### Naruto

Naruto's flavor: scrappy, loud, never gives up: every recovery has a grin or a shout.

**techGround** (4 poses)

```text
Anime fan-art sprite. Match the attached USER APPROVED title-style reference exactly for identity, head, torso, limb lengths, costume volume, colors and drawing style. Short compact bright golden-blond spikes, blue eyes, three thin whisker marks on each cheek, black cloth forehead protector with a polished metal plate and two trailing cloth tails, black-and-orange Shippuden track jacket with a high collar, orange pants, black ninja sandals. SCALE LOCK: neutral occupied 94x205px and combat 150x165px in a 256 cell at 128 ppu; the same anatomy in every pose. Do not enlarge crouches, rolls or braced poses, do not stretch them to a standing height, do not reduce the torso or limbs. No generic head ratio.
Crisp hard pixel art, 1-pixel dark outline, the reference's cel shading and palette. Flat solid magenta #FF00FF background. Body facing RIGHT. No floor, no wall, no ground shadow, no text, no labels, no effects (no aura, no speed lines, no impact flash). Poses in ONE horizontal row, left to right, evenly spaced, never touching.
ANIMATION: "techGround", a ground tech in place: he hits the floor from a fall, breaks the fall in a split second and is back in his stance (scrappy, loud, never gives up: every recovery has a grin or a shout). 4 poses, feet on one shared baseline.
1. IMPACT BRACE: lowest crouch, both feet planted on the baseline, the near palm slapped flat on the floor in front, knees deeply bent, torso low, head up looking right; lands in a wide three-point crouch, jacket hem and forehead-protector tails flaring from the impact, near palm slapped on the floor, teeth gritted.
2. PUSH UP: the palm leaves the floor, legs drive upward, half crouch; shoves off the floor with a grin.
3. RISE: nearly upright, knees slightly bent; rising, fists coming up.
4. STANCE: exactly the approved idle's first pose (same feet, same guard); his approved fighting stance.
```

**techRoll** part A (poses 1-3), then part B (poses 4-6, attach part A)

```text
Anime fan-art sprite. Match the attached USER APPROVED title-style reference exactly for identity, head, torso, limb lengths, costume volume, colors and drawing style. Short compact bright golden-blond spikes, blue eyes, three thin whisker marks on each cheek, black cloth forehead protector with a polished metal plate and two trailing cloth tails, black-and-orange Shippuden track jacket with a high collar, orange pants, black ninja sandals. SCALE LOCK: neutral occupied 94x205px and combat 150x165px in a 256 cell at 128 ppu; the same anatomy in every pose. Do not enlarge crouches, rolls or braced poses, do not stretch them to a standing height, do not reduce the torso or limbs. No generic head ratio.
Crisp hard pixel art, 1-pixel dark outline, the reference's cel shading and palette. Flat solid magenta #FF00FF background. Body facing RIGHT. No floor, no wall, no ground shadow, no text, no labels, no effects (no aura, no speed lines, no impact flash). Poses in ONE horizontal row, left to right, evenly spaced, never touching.
ANIMATION: "techRoll", a ground tech roll: he hits the floor and rolls FORWARD along it toward screen-right, back to a crouch (scrappy, loud, never gives up: every recovery has a grin or a shout). 6 poses in total; this image is PART A of 2 and shows poses 1 to 3. Every pose touches one shared floor line; the rolling poses are a tight ball about half his standing height, the same head and limb lengths folded.
1. CONTACT: hits the floor on the back of the near shoulder, chin tucked, knees pulled to the chest, the near hand slapping the floor; hits the floor on the back of the near shoulder, forehead-protector tails flung out.
2. ROLL: a quarter turn on from pose 1: hips rolling over the shoulders; tucked ball, tails trailing behind the roll.
3. ROLL: another quarter turn: upside down on his upper back, sandals over his head, tucked.
```

```text
Anime fan-art sprite. Match the attached USER APPROVED title-style reference exactly for identity, head, torso, limb lengths, costume volume, colors and drawing style. Short compact bright golden-blond spikes, blue eyes, three thin whisker marks on each cheek, black cloth forehead protector with a polished metal plate and two trailing cloth tails, black-and-orange Shippuden track jacket with a high collar, orange pants, black ninja sandals. SCALE LOCK: neutral occupied 94x205px and combat 150x165px in a 256 cell at 128 ppu; the same anatomy in every pose. Do not enlarge crouches, rolls or braced poses, do not stretch them to a standing height, do not reduce the torso or limbs. No generic head ratio.
Crisp hard pixel art, 1-pixel dark outline, the reference's cel shading and palette. Flat solid magenta #FF00FF background. Body facing RIGHT. No floor, no wall, no ground shadow, no text, no labels, no effects (no aura, no speed lines, no impact flash). Poses in ONE horizontal row, left to right, evenly spaced, never touching.
ANIMATION: "techRoll" PART B of 2: poses 4 to 6 of the same forward roll toward screen-right. Attached: part A of the same version; match its size exactly. Every pose touches one shared floor line; the rolling poses are a tight ball about half his standing height.
4. ROLL: a quarter turn on from part A's last pose: rolling onto his hips and feet.
5. ROLL: the last quarter turn: coming up onto both sandals, still tucked.
6. CROUCH: low crouch on both feet facing right, guard up, ready to stand; low crouch, one fist forward, the other hand on the floor, grinning.
```

**wallTech** (5 poses)

```text
Anime fan-art sprite. Match the attached USER APPROVED title-style reference exactly for identity, head, torso, limb lengths, costume volume, colors and drawing style. Short compact bright golden-blond spikes, blue eyes, three thin whisker marks on each cheek, black cloth forehead protector with a polished metal plate and two trailing cloth tails, black-and-orange Shippuden track jacket with a high collar, orange pants, black ninja sandals. SCALE LOCK: neutral occupied 94x205px and combat 150x165px in a 256 cell at 128 ppu; the same anatomy in every pose. Do not enlarge crouches, rolls or braced poses, do not stretch them to a standing height, do not reduce the torso or limbs. No generic head ratio.
Crisp hard pixel art, 1-pixel dark outline, the reference's cel shading and palette. Flat solid magenta #FF00FF background. Body facing RIGHT. No floor, no wall, no ground shadow, no text, no labels, no effects (no aura, no speed lines, no impact flash). Poses in ONE horizontal row, left to right, evenly spaced, never touching.
ANIMATION: "wallTech", a wall tech: he is knocked into an invisible wall at the LEFT of each pose, lands on it feet-first, clings for an instant and kicks off to the right (scrappy, loud, never gives up: every recovery has a grin or a shout). 5 poses. Do NOT draw the wall: it is implied. In poses 1-3 the soles are the LEFTMOST part of the figure: nothing further left (hair, cloth and tails trail upward or to the right).
1. CLING: feet-first on the wall: both soles flat against an imaginary vertical wall at the pose's left, knees pulled to the chest, torso tilted out from the wall, the near hand touching the wall, head turned right toward the opponent; both sandals flat on the wall like a frog, knees to the chest, near hand slapped on the wall, forehead-protector tails thrown toward the wall.
2. CLING: the same cling, coiled tighter; coiled tighter, glaring at the opponent.
3. PUSH-OFF: legs fully extended, only the toes still on the wall, body launched diagonally up and to the right; kicks off with a shout, arms swept back.
4. AIRBORNE: uncurling in mid-air, knees tucking under; uncurling, fists ready.
5. FALL: falling like his jumpFall, arms out (it hands over to his approved jumpFall).
```

### Sasuke

Sasuke's flavor: cold, precise, economical: no wasted motion, no shout; the sword stays sheathed at the back of the belt in every pose.

**techGround** (4 poses)

```text
Anime fan-art sprite. Match the attached USER APPROVED title-style reference exactly for identity, head, torso, limb lengths, costume volume, colors and drawing style. Black hair with a dark-blue sheen, spiky at the back with long bangs framing the face, pale skin, dark eyes (no Sharingan), white open-collar long-sleeve shirt, thick purple rope belt tied in a bow, dark blue cloth over navy trousers, dark arm guards, black sandals, a sword sheathed horizontally at the back of the belt. SCALE LOCK: neutral occupied 90x209px and combat 155x180px in a 256 cell at 128 ppu; the same anatomy in every pose. Do not enlarge crouches, rolls or braced poses, do not stretch them to a standing height, do not reduce the torso or limbs. No generic head ratio.
Crisp hard pixel art, 1-pixel dark outline, the reference's cel shading and palette. Flat solid magenta #FF00FF background. Body facing RIGHT. No floor, no wall, no ground shadow, no text, no labels, no effects (no aura, no speed lines, no impact flash). Poses in ONE horizontal row, left to right, evenly spaced, never touching.
ANIMATION: "techGround", a ground tech in place: he hits the floor from a fall, breaks the fall in a split second and is back in his stance (cold, precise, economical: no wasted motion, no shout; the sword stays sheathed at the back of the belt in every pose). 4 poses, feet on one shared baseline.
1. IMPACT BRACE: lowest crouch, both feet planted on the baseline, the near palm slapped flat on the floor in front, knees deeply bent, torso low, head up looking right; drops to one knee with the near palm flat on the floor, cool expression, sheathed sword level at his back.
2. PUSH UP: the palm leaves the floor, legs drive upward, half crouch; rises smoothly, palm leaving the floor.
3. RISE: nearly upright, knees slightly bent; almost upright, guard coming up.
4. STANCE: exactly the approved idle's first pose (same feet, same guard); his approved fighting stance.
```

**techRoll** part A (poses 1-3), then part B (poses 4-6, attach part A)

```text
Anime fan-art sprite. Match the attached USER APPROVED title-style reference exactly for identity, head, torso, limb lengths, costume volume, colors and drawing style. Black hair with a dark-blue sheen, spiky at the back with long bangs framing the face, pale skin, dark eyes (no Sharingan), white open-collar long-sleeve shirt, thick purple rope belt tied in a bow, dark blue cloth over navy trousers, dark arm guards, black sandals, a sword sheathed horizontally at the back of the belt. SCALE LOCK: neutral occupied 90x209px and combat 155x180px in a 256 cell at 128 ppu; the same anatomy in every pose. Do not enlarge crouches, rolls or braced poses, do not stretch them to a standing height, do not reduce the torso or limbs. No generic head ratio.
Crisp hard pixel art, 1-pixel dark outline, the reference's cel shading and palette. Flat solid magenta #FF00FF background. Body facing RIGHT. No floor, no wall, no ground shadow, no text, no labels, no effects (no aura, no speed lines, no impact flash). Poses in ONE horizontal row, left to right, evenly spaced, never touching.
ANIMATION: "techRoll", a ground tech roll: he hits the floor and rolls FORWARD along it toward screen-right, back to a crouch (cold, precise, economical: no wasted motion, no shout; the sword stays sheathed at the back of the belt in every pose). 6 poses in total; this image is PART A of 2 and shows poses 1 to 3. Every pose touches one shared floor line; the rolling poses are a tight ball about half his standing height, the same head and limb lengths folded.
1. CONTACT: hits the floor on the back of the near shoulder, chin tucked, knees pulled to the chest, the near hand slapping the floor; hits the floor on the back of the near shoulder, chin tucked, the sheath angled so it clears the floor.
2. ROLL: a quarter turn on from pose 1: hips rolling over the shoulders; tight precise roll, rope belt and cloth tucked in.
3. ROLL: another quarter turn: upside down on his upper back, legs tucked over, sheath along his back.
```

```text
Anime fan-art sprite. Match the attached USER APPROVED title-style reference exactly for identity, head, torso, limb lengths, costume volume, colors and drawing style. Black hair with a dark-blue sheen, spiky at the back with long bangs framing the face, pale skin, dark eyes (no Sharingan), white open-collar long-sleeve shirt, thick purple rope belt tied in a bow, dark blue cloth over navy trousers, dark arm guards, black sandals, a sword sheathed horizontally at the back of the belt. SCALE LOCK: neutral occupied 90x209px and combat 155x180px in a 256 cell at 128 ppu; the same anatomy in every pose. Do not enlarge crouches, rolls or braced poses, do not stretch them to a standing height, do not reduce the torso or limbs. No generic head ratio.
Crisp hard pixel art, 1-pixel dark outline, the reference's cel shading and palette. Flat solid magenta #FF00FF background. Body facing RIGHT. No floor, no wall, no ground shadow, no text, no labels, no effects (no aura, no speed lines, no impact flash). Poses in ONE horizontal row, left to right, evenly spaced, never touching.
ANIMATION: "techRoll" PART B of 2: poses 4 to 6 of the same forward roll toward screen-right. Attached: part A of the same version; match its size exactly. Every pose touches one shared floor line; the rolling poses are a tight ball about half his standing height.
4. ROLL: a quarter turn on from part A's last pose: rolling onto his hips and feet.
5. ROLL: the last quarter turn: coming up onto both sandals, still tucked.
6. CROUCH: low crouch on both feet facing right, guard up, ready to stand; low crouch, one hand near the sword hilt at his back, cold stare.
```

**wallTech** (5 poses)

```text
Anime fan-art sprite. Match the attached USER APPROVED title-style reference exactly for identity, head, torso, limb lengths, costume volume, colors and drawing style. Black hair with a dark-blue sheen, spiky at the back with long bangs framing the face, pale skin, dark eyes (no Sharingan), white open-collar long-sleeve shirt, thick purple rope belt tied in a bow, dark blue cloth over navy trousers, dark arm guards, black sandals, a sword sheathed horizontally at the back of the belt. SCALE LOCK: neutral occupied 90x209px and combat 155x180px in a 256 cell at 128 ppu; the same anatomy in every pose. Do not enlarge crouches, rolls or braced poses, do not stretch them to a standing height, do not reduce the torso or limbs. No generic head ratio.
Crisp hard pixel art, 1-pixel dark outline, the reference's cel shading and palette. Flat solid magenta #FF00FF background. Body facing RIGHT. No floor, no wall, no ground shadow, no text, no labels, no effects (no aura, no speed lines, no impact flash). Poses in ONE horizontal row, left to right, evenly spaced, never touching.
ANIMATION: "wallTech", a wall tech: he is knocked into an invisible wall at the LEFT of each pose, lands on it feet-first, clings for an instant and kicks off to the right (cold, precise, economical: no wasted motion, no shout; the sword stays sheathed at the back of the belt in every pose). 5 poses. Do NOT draw the wall: it is implied. In poses 1-3 the soles are the LEFTMOST part of the figure: nothing further left (hair, cloth and tails trail upward or to the right).
1. CLING: feet-first on the wall: both soles flat against an imaginary vertical wall at the pose's left, knees pulled to the chest, torso tilted out from the wall, the near hand touching the wall, head turned right toward the opponent; lands lightly with both sandals flat on the wall, knees bent, near hand braced on the wall, eyes on the opponent.
2. CLING: the same cling, coiled tighter; coiled, cold stare, no strain.
3. PUSH-OFF: legs fully extended, only the toes still on the wall, body launched diagonally up and to the right; efficient push-off, legs extended, one arm swept back.
4. AIRBORNE: uncurling in mid-air, knees tucking under; uncurling, composed.
5. FALL: falling like his jumpFall, arms out (it hands over to his approved jumpFall).
```

### Killua

Killua's flavor: a trained assassin: light, silent, catlike; the silver-white hair mass stays exactly the approved size in every pose (never shrunk in a tuck, never puffed up).

**techGround** (4 poses)

```text
Anime fan-art sprite. Match the attached USER APPROVED title-style reference exactly for identity, head, torso, limb lengths, costume volume, colors and drawing style. Silver-white fluffy spiky hair, sharp youthful blue-eyed face, lavender long-sleeve shirt with a navy wide collar, white undershirt cuffs and hem, navy knee shorts, purple high-top sneakers. SCALE LOCK: neutral occupied 82x186px and combat 148x146px in a 256 cell at 128 ppu; the same anatomy in every pose. Do not enlarge crouches, rolls or braced poses, do not stretch them to a standing height, do not reduce the torso or limbs. No generic head ratio.
Crisp hard pixel art, 1-pixel dark outline, the reference's cel shading and palette. Flat solid magenta #FF00FF background. Body facing RIGHT. No floor, no wall, no ground shadow, no text, no labels, no effects (no aura, no speed lines, no impact flash). Poses in ONE horizontal row, left to right, evenly spaced, never touching.
ANIMATION: "techGround", a ground tech in place: he hits the floor from a fall, breaks the fall in a split second and is back in his stance (a trained assassin: light, silent, catlike; the silver-white hair mass stays exactly the approved size in every pose (never shrunk in a tuck, never puffed up)). 4 poses, feet on one shared baseline.
1. IMPACT BRACE: lowest crouch, both feet planted on the baseline, the near palm slapped flat on the floor in front, knees deeply bent, torso low, head up looking right; lands catlike on the balls of his feet with the near fingertips on the floor, almost silent, hands like claws.
2. PUSH UP: the palm leaves the floor, legs drive upward, half crouch; springs up lightly.
3. RISE: nearly upright, knees slightly bent; nearly upright, hands loose.
4. STANCE: exactly the approved idle's first pose (same feet, same guard); his approved loose assassin stance.
```

**techRoll** part A (poses 1-3), then part B (poses 4-6, attach part A)

```text
Anime fan-art sprite. Match the attached USER APPROVED title-style reference exactly for identity, head, torso, limb lengths, costume volume, colors and drawing style. Silver-white fluffy spiky hair, sharp youthful blue-eyed face, lavender long-sleeve shirt with a navy wide collar, white undershirt cuffs and hem, navy knee shorts, purple high-top sneakers. SCALE LOCK: neutral occupied 82x186px and combat 148x146px in a 256 cell at 128 ppu; the same anatomy in every pose. Do not enlarge crouches, rolls or braced poses, do not stretch them to a standing height, do not reduce the torso or limbs. No generic head ratio.
Crisp hard pixel art, 1-pixel dark outline, the reference's cel shading and palette. Flat solid magenta #FF00FF background. Body facing RIGHT. No floor, no wall, no ground shadow, no text, no labels, no effects (no aura, no speed lines, no impact flash). Poses in ONE horizontal row, left to right, evenly spaced, never touching.
ANIMATION: "techRoll", a ground tech roll: he hits the floor and rolls FORWARD along it toward screen-right, back to a crouch (a trained assassin: light, silent, catlike; the silver-white hair mass stays exactly the approved size in every pose (never shrunk in a tuck, never puffed up)). 6 poses in total; this image is PART A of 2 and shows poses 1 to 3. Every pose touches one shared floor line; the rolling poses are a tight ball about half his standing height, the same head and limb lengths folded.
1. CONTACT: hits the floor on the back of the near shoulder, chin tucked, knees pulled to the chest, the near hand slapping the floor; hits the floor on the back of the near shoulder, chin tucked, hair mass unchanged.
2. ROLL: a quarter turn on from pose 1: hips rolling over the shoulders; a fast tight roll, a small tucked ball.
3. ROLL: another quarter turn: upside down on his upper back, sneakers over his head.
```

```text
Anime fan-art sprite. Match the attached USER APPROVED title-style reference exactly for identity, head, torso, limb lengths, costume volume, colors and drawing style. Silver-white fluffy spiky hair, sharp youthful blue-eyed face, lavender long-sleeve shirt with a navy wide collar, white undershirt cuffs and hem, navy knee shorts, purple high-top sneakers. SCALE LOCK: neutral occupied 82x186px and combat 148x146px in a 256 cell at 128 ppu; the same anatomy in every pose. Do not enlarge crouches, rolls or braced poses, do not stretch them to a standing height, do not reduce the torso or limbs. No generic head ratio.
Crisp hard pixel art, 1-pixel dark outline, the reference's cel shading and palette. Flat solid magenta #FF00FF background. Body facing RIGHT. No floor, no wall, no ground shadow, no text, no labels, no effects (no aura, no speed lines, no impact flash). Poses in ONE horizontal row, left to right, evenly spaced, never touching.
ANIMATION: "techRoll" PART B of 2: poses 4 to 6 of the same forward roll toward screen-right. Attached: part A of the same version; match its size exactly. Every pose touches one shared floor line; the rolling poses are a tight ball about half his standing height.
4. ROLL: a quarter turn on from part A's last pose: rolling onto his hips and feet.
5. ROLL: the last quarter turn: coming up onto the balls of his feet, still tucked.
6. CROUCH: low crouch on both feet facing right, guard up, ready to stand; low crouch on the balls of his feet, one hand open like a claw, bored look.
```

**wallTech** (5 poses)

```text
Anime fan-art sprite. Match the attached USER APPROVED title-style reference exactly for identity, head, torso, limb lengths, costume volume, colors and drawing style. Silver-white fluffy spiky hair, sharp youthful blue-eyed face, lavender long-sleeve shirt with a navy wide collar, white undershirt cuffs and hem, navy knee shorts, purple high-top sneakers. SCALE LOCK: neutral occupied 82x186px and combat 148x146px in a 256 cell at 128 ppu; the same anatomy in every pose. Do not enlarge crouches, rolls or braced poses, do not stretch them to a standing height, do not reduce the torso or limbs. No generic head ratio.
Crisp hard pixel art, 1-pixel dark outline, the reference's cel shading and palette. Flat solid magenta #FF00FF background. Body facing RIGHT. No floor, no wall, no ground shadow, no text, no labels, no effects (no aura, no speed lines, no impact flash). Poses in ONE horizontal row, left to right, evenly spaced, never touching.
ANIMATION: "wallTech", a wall tech: he is knocked into an invisible wall at the LEFT of each pose, lands on it feet-first, clings for an instant and kicks off to the right (a trained assassin: light, silent, catlike; the silver-white hair mass stays exactly the approved size in every pose (never shrunk in a tuck, never puffed up)). 5 poses. Do NOT draw the wall: it is implied. In poses 1-3 the soles are the LEFTMOST part of the figure: nothing further left (hair, cloth and tails trail upward or to the right).
1. CLING: feet-first on the wall: both soles flat against an imaginary vertical wall at the pose's left, knees pulled to the chest, torso tilted out from the wall, the near hand touching the wall, head turned right toward the opponent; lands feet-first on the wall like a cat, purple sneakers flat on it, knees to the chest, near hand on the wall.
2. CLING: the same cling, coiled tighter; coiled, eyes narrowed on the opponent.
3. PUSH-OFF: legs fully extended, only the toes still on the wall, body launched diagonally up and to the right; explosive push-off, legs fully extended, arms swept back.
4. AIRBORNE: uncurling in mid-air, knees tucking under; uncurling in mid-air, hands loose.
5. FALL: falling like his jumpFall, arms out (it hands over to his approved jumpFall).
```

### Gojo

Gojo's flavor: effortless and unbothered: the recoveries look easy; long legs, the same lean build, blindfold on.

**techGround** (4 poses)

```text
Anime fan-art sprite. Match the attached USER APPROVED title-style reference exactly for identity, head, torso, limb lengths, costume volume, colors and drawing style. White spiky hair, black blindfold, lean tall adult in a navy zipped high-collar jacket and trousers, black shoes. SCALE LOCK: neutral occupied 91x236px and combat 156x214px in a 256 cell at 128 ppu; the same anatomy in every pose. Do not enlarge crouches, rolls or braced poses, do not stretch them to a standing height, do not reduce the torso or limbs. No generic head ratio.
Crisp hard pixel art, 1-pixel dark outline, the reference's cel shading and palette. Flat solid magenta #FF00FF background. Body facing RIGHT. No floor, no wall, no ground shadow, no text, no labels, no effects (no aura, no speed lines, no impact flash). Poses in ONE horizontal row, left to right, evenly spaced, never touching.
ANIMATION: "techGround", a ground tech in place: he hits the floor from a fall, breaks the fall in a split second and is back in his stance (effortless and unbothered: the recoveries look easy; long legs, the same lean build, blindfold on). 4 poses, feet on one shared baseline.
1. IMPACT BRACE: lowest crouch, both feet planted on the baseline, the near palm slapped flat on the floor in front, knees deeply bent, torso low, head up looking right; barely braces: lands on one knee and the near palm, the other hand in his pocket, unbothered.
2. PUSH UP: the palm leaves the floor, legs drive upward, half crouch; rises without hurry, palm off the floor.
3. RISE: nearly upright, knees slightly bent; upright, hand still in the pocket.
4. STANCE: exactly the approved idle's first pose (same feet, same guard); his approved relaxed stance.
```

**techRoll** part A (poses 1-3), then part B (poses 4-6, attach part A)

```text
Anime fan-art sprite. Match the attached USER APPROVED title-style reference exactly for identity, head, torso, limb lengths, costume volume, colors and drawing style. White spiky hair, black blindfold, lean tall adult in a navy zipped high-collar jacket and trousers, black shoes. SCALE LOCK: neutral occupied 91x236px and combat 156x214px in a 256 cell at 128 ppu; the same anatomy in every pose. Do not enlarge crouches, rolls or braced poses, do not stretch them to a standing height, do not reduce the torso or limbs. No generic head ratio.
Crisp hard pixel art, 1-pixel dark outline, the reference's cel shading and palette. Flat solid magenta #FF00FF background. Body facing RIGHT. No floor, no wall, no ground shadow, no text, no labels, no effects (no aura, no speed lines, no impact flash). Poses in ONE horizontal row, left to right, evenly spaced, never touching.
ANIMATION: "techRoll", a ground tech roll: he hits the floor and rolls FORWARD along it toward screen-right, back to a crouch (effortless and unbothered: the recoveries look easy; long legs, the same lean build, blindfold on). 6 poses in total; this image is PART A of 2 and shows poses 1 to 3. Every pose touches one shared floor line; the rolling poses are a tight ball about half his standing height, the same head and limb lengths folded.
1. CONTACT: hits the floor on the back of the near shoulder, chin tucked, knees pulled to the chest, the near hand slapping the floor; hits the floor on the back of the near shoulder, long legs folding in.
2. ROLL: a quarter turn on from pose 1: hips rolling over the shoulders; a smooth long-limbed roll, tucked.
3. ROLL: another quarter turn: upside down on his upper back, long legs tucked over.
```

```text
Anime fan-art sprite. Match the attached USER APPROVED title-style reference exactly for identity, head, torso, limb lengths, costume volume, colors and drawing style. White spiky hair, black blindfold, lean tall adult in a navy zipped high-collar jacket and trousers, black shoes. SCALE LOCK: neutral occupied 91x236px and combat 156x214px in a 256 cell at 128 ppu; the same anatomy in every pose. Do not enlarge crouches, rolls or braced poses, do not stretch them to a standing height, do not reduce the torso or limbs. No generic head ratio.
Crisp hard pixel art, 1-pixel dark outline, the reference's cel shading and palette. Flat solid magenta #FF00FF background. Body facing RIGHT. No floor, no wall, no ground shadow, no text, no labels, no effects (no aura, no speed lines, no impact flash). Poses in ONE horizontal row, left to right, evenly spaced, never touching.
ANIMATION: "techRoll" PART B of 2: poses 4 to 6 of the same forward roll toward screen-right. Attached: part A of the same version; match its size exactly. Every pose touches one shared floor line; the rolling poses are a tight ball about half his standing height.
4. ROLL: a quarter turn on from part A's last pose: rolling onto his hips and feet.
5. ROLL: the last quarter turn: coming up onto both shoes, still tucked.
6. CROUCH: low crouch on both feet facing right, guard up, ready to stand; low relaxed crouch, one hand in the pocket.
```

**wallTech** (5 poses)

```text
Anime fan-art sprite. Match the attached USER APPROVED title-style reference exactly for identity, head, torso, limb lengths, costume volume, colors and drawing style. White spiky hair, black blindfold, lean tall adult in a navy zipped high-collar jacket and trousers, black shoes. SCALE LOCK: neutral occupied 91x236px and combat 156x214px in a 256 cell at 128 ppu; the same anatomy in every pose. Do not enlarge crouches, rolls or braced poses, do not stretch them to a standing height, do not reduce the torso or limbs. No generic head ratio.
Crisp hard pixel art, 1-pixel dark outline, the reference's cel shading and palette. Flat solid magenta #FF00FF background. Body facing RIGHT. No floor, no wall, no ground shadow, no text, no labels, no effects (no aura, no speed lines, no impact flash). Poses in ONE horizontal row, left to right, evenly spaced, never touching.
ANIMATION: "wallTech", a wall tech: he is knocked into an invisible wall at the LEFT of each pose, lands on it feet-first, clings for an instant and kicks off to the right (effortless and unbothered: the recoveries look easy; long legs, the same lean build, blindfold on). 5 poses. Do NOT draw the wall: it is implied. In poses 1-3 the soles are the LEFTMOST part of the figure: nothing further left (hair, cloth and tails trail upward or to the right).
1. CLING: feet-first on the wall: both soles flat against an imaginary vertical wall at the pose's left, knees pulled to the chest, torso tilted out from the wall, the near hand touching the wall, head turned right toward the opponent; lands lightly on the wall, long legs folded, both shoes flat on it, near hand on the wall, the other in his pocket, slight smirk.
2. CLING: the same cling, coiled tighter; coiled, calm.
3. PUSH-OFF: legs fully extended, only the toes still on the wall, body launched diagonally up and to the right; a long, casual push-off, legs extended.
4. AIRBORNE: uncurling in mid-air, knees tucking under; uncurling in mid-air, at ease.
5. FALL: falling like his jumpFall, arms out (it hands over to his approved jumpFall).
```

## Assemble, pack, check

1. **Roll:** `npm run stitch -- <id> techRoll <vNN> --counts 3,3` joins the parts at a measured factor (whole figures,
   never vertical slices). If the probe finds no head in a part (a tucked pose), measure one landmark by eye in both parts
   and pass `--factor <B/A> --reason "..." --landmarks "A f0 <landmark> <px>, B f2 <landmark> <px>" --uncertainty "<+- px>"`
   (recorded in the sidecar). The others are single images.
2. **Pack:** `node tools/pack-sprites.mjs <id> --quantize 48` must exit 0. Expect and clear:
   - no `cling frame(s) barely touch the wall line` warning (wallTech f0-f1: the soles flat on x 128-131);
   - no `tucked / braced frame(s) out of their size band` warning (techGround brace 0.45-0.85, techRoll tumble 0.30-0.68,
     wallTech cling 0.35-0.90 of the idle's height);
   - no clipping or cell-margin warning; 48 colors.
3. **Scale gate:** `techGround` is measured in full and must read `ok`. `techRoll` (f1-f4) and `wallTech` (f0-f2) have
   beats the probe cannot read: their readable frames must pass, and the strip reads `partial`, which is **not** a pass. Run
   `npm run scale -- <id>` and compare the unread frames with the approved combat cell at the same native scale (head,
   torso and limb lengths, not the box height; inspect every frame and the loop). Only when they match, record it in that
   animation's manifest entry: `"scaleManualQA": { "version": <v>, "result": "pass", "by": "<who>", "note": "<what was
   compared>", "evidence": "<image path>" }`. A redraw needs a new record. No exemptions to hide an anatomy problem.
4. **In the game:** `npm run dev` (or the `.codex/vite.mjs` adapter) on your port, then `/lab.html?p2=<id>`, SCENARIOS:
   "Timed tech off a spike" (techGround), "Tech roll" (techRoll played backward: a back roll), "Wall tech" (wallTech on a
   side wall) and "Wall-jump tech" (f0-f2 then jumpUp); the ANIMATIONS tab steps each strip frame by frame with its boxes.
   Check the handovers: techGround f3 and techRoll f5 into `idle`, wallTech f4 into `jumpFall`, nothing popping in size.
5. **Review:** REVIEW rows link the strip, the heads sheet (`art/scale/heads-<id>.png`), `npm run lineup` and the native
   comparison; commit with explicit paths, `npm run pr -- open` and `npm run pr -- preview`. Report the preview link and
   what to approve, then stop for the user's `approve <id> <anim> vNN`.
