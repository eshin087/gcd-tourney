# Naruto: kit animations (move system v2)

> Naruto's four **kit** animations for his full move kit: `specialForward` (WIND STYLE: RASENSHURIKEN,
> held in the hand), `specialUp` (UZUMAKI BARRAGE rise), `specialDown` (NINE-TAILS CHAKRA CLOAK
> activation) and `superPose` (the Shadow Clone seal for his second super, SHADOW CLONE BARRAGE). The
> animation names, frame counts and fallbacks come from
> [ADR 0009](../../../docs/decisions/0009-move-system-v2.md); the moves come from ADR 0011 (kits for
> Naruto and Sasuke, in [docs/decisions/](../../../docs/decisions/README.md)). Everything in
> [CHARACTER.md](CHARACTER.md), [ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md)
> and [art/SPEC.md](../../SPEC.md) still applies: the standard body scale (200 px standing body, about
> 6.5 heads, head about 31 px), 256×256 cells, pivot `[128, 240]`, facing right, the current
> shorter-hair design. He is **early Shippuden, before Sage Mode**: no sage markings, no sage cloak, no
> toad features. If this file disagrees with ADR 0007 or SPEC.md, they win.
>
> This is a staging file: Codex is revising ANIMATIONS.md and PROMPTS.md (ART-NAR-12), so the kit
> lives here until Codex merges it.

## 1. Overview and merge

**Merge (Codex, step 9, the optional group):**

1. **ANIMATIONS.md:** add the 4 rows below to "All animations", change its count line to "42
   animations, 175 frames in total (11 rows of the 16-column sheet)", and paste section 2 as a new
   group `## Kit (move system v2, optional)` after the Attitude group, before "Changing an animation".
2. **PROMPTS.md:** add the 4 index rows below after A38, change "A24–A38 are optional polish" in "How
   to use" step 3 to "A24–A42", and paste section 3 (A39–A42) after A38, before `## UI art`.
3. **art/manifest.json** (`characters.naruto.animations`) and **art/TRACKER.md** (`## naruto`): add the
   4 rows below.
4. **CHARACTER.md:** add the 2 red eye colors to §7 (36 of 48 colors), add a `specialDown`-only
   exception to §2 item 10, the off-model line and §5 (red slit eyes, sharper canines, thicker
   whiskers, short claws), and add the kit terms below to the §9 replacement table.
5. Keep the shared prompt lines (CHARACTER, PROPORTIONS, LAYOUT, SCALE, SIZE, VIEW, STYLE, PALETTE,
   BACKGROUND) identical to the other strip blocks. They were copied from the current A01/A02 blocks
   (shorter-hair wording). If ART-NAR-12 changes them again before the merge, replace them here too.

| anim | move | frames | phases S/A/R | loop | bodyHeight | default ms | hit box | fallback | prompt | images |
|---|---|---|---|---|---|---|---|---|---|---|
| [`specialForward`](#specialforward) | WIND STYLE: RASENSHURIKEN, held in the hand | 7 | 2/2/3 | | 204 | 60 60 70 90 80 80 60 | R palm, f2–f3 | `special` | A39 | 2 (f0–f3 + f4–f6) |
| [`specialUp`](#specialup) | UZUMAKI BARRAGE rising flip kick | 6 | 2/2/2 | | 214 | 50 50 60 60 70 70 | R foot, f2–f3 (engine rise hit) | `special` | A40 | 2 (f0–f3 + f4–f5) |
| [`specialDown`](#specialdown) | NINE-TAILS CHAKRA CLOAK activation | 4 | 2/1/1 | | 204 | 80 80 220 90 | none | `charge` | A41 | 1 |
| [`superPose`](#superpose) | SHADOW CLONE seal (SHADOW CLONE BARRAGE super flash) | 4 | | yes | 208 | 140 140 140 140 | none | `taunt` | A42 | 1 |

The engine draws every effect: the wind shuriken, the clone afterimages, the red chakra cloak, the
clones of the super, smoke and aura. **No sprite frame contains energy, orbs, aura, smoke or clones.**

### Rows to paste

ANIMATIONS.md, "All animations" table:

```text
| [`specialForward`](#specialforward) | WIND STYLE: RASENSHURIKEN, held in the hand (kit) | 7 | 2/2/3 |  |  | 204 | 60, 60, 70, 90, 80, 80, 60 | A39 | 2 (A + B) |
| [`specialUp`](#specialup) | UZUMAKI BARRAGE rising flip kick (kit) | 6 | 2/2/2 |  |  | 214 | 50, 50, 60, 60, 70, 70 | A40 | 2 (A + B) |
| [`specialDown`](#specialdown) | NINE-TAILS CHAKRA CLOAK activation (kit) | 4 | 2/1/1 |  |  | 204 | 80, 80, 220, 90 | A41 | 1 |
| [`superPose`](#superpose) | SHADOW CLONE seal, super flash (kit, loop) | 4 |  | yes |  | 208 | 140, 140, 140, 140 | A42 | 1 |
```

PROMPTS.md, Index:

```text
| 9 | A39 | `specialForward`: WIND STYLE: RASENSHURIKEN (held in the hand) | 7 | 2 |  | `raw/_parts/specialForward_vNN_A.png` + `raw/_parts/specialForward_vNN_B.png` → `raw/specialForward_vNN.png` |
| 9 | A40 | `specialUp`: UZUMAKI BARRAGE rising flip kick | 6 | 2 |  | `raw/_parts/specialUp_vNN_A.png` + `raw/_parts/specialUp_vNN_B.png` → `raw/specialUp_vNN.png` |
| 9 | A41 | `specialDown`: NINE-TAILS CHAKRA CLOAK activation | 4 | 1 |  | `raw/specialDown_vNN.png` |
| 9 | A42 | `superPose`: SHADOW CLONE seal (super flash, loop) | 4 | 1 |  | `raw/superPose_vNN.png` |
```

art/manifest.json, `characters.naruto.animations` (after `win`; mind the comma on the line before):

```json
"specialForward": { "frames": 7, "loop": false, "phases": [2, 2, 3], "bodyHeight": 204, "ms": [60, 60, 70, 90, 80, 80, 60], "required": false, "step": 9, "status": "todo", "version": 0, "approvedVersion": null },
"specialUp": { "frames": 6, "loop": false, "phases": [2, 2, 2], "bodyHeight": 214, "ms": [50, 50, 60, 60, 70, 70], "required": false, "step": 9, "status": "todo", "version": 0, "approvedVersion": null },
"specialDown": { "frames": 4, "loop": false, "phases": [2, 1, 1], "bodyHeight": 204, "ms": [80, 80, 220, 90], "required": false, "hitbox": false, "step": 9, "status": "todo", "version": 0, "approvedVersion": null },
"superPose": { "frames": 4, "loop": true, "bodyHeight": 208, "ms": [140, 140, 140, 140], "required": false, "step": 9, "status": "todo", "version": 0, "approvedVersion": null }
```

art/TRACKER.md, `## naruto` (after `taunt`):

```text
| 9 | specialForward | 7 | 2/2/3 | no | 204 | todo | - | - | kit (ADR 0009/0011): Rasenshuriken held in the hand; palm EMPTY |
| 9 | specialUp | 6 | 2/2/2 | no | 214 | todo | - | - | kit: Uzumaki Barrage rise; f5 = airHeavy f0 |
| 9 | specialDown | 4 | 2/1/1 | no | 204 | todo | - | - | kit: Nine-Tails cloak activation; red slit eyes in this strip only; no hit box |
| 9 | superPose | 4 | - | no | 208 | todo | - | - | kit: Shadow Clone seal for the Shadow Clone Barrage super flash |
```

### Kit terms for the fallback wording (CHARACTER.md §9)

If the generator refuses a kit prompt, use the fallback CHARACTER line and these terms. Also drop
"Rasenshuriken", "Nine-Tails" and "Uzumaki Barrage".

| instead of | write |
|---|---|
| WIND STYLE: RASENSHURIKEN | "a spinning wind-energy technique held on his open palm (the game draws it; his hand stays empty)" |
| UZUMAKI BARRAGE | "a rising flip kick that ends in a mid-air double-fist hammer blow" |
| NINE-TAILS CHAKRA CLOAK | "a feral beast-power awakening: red eyes with vertical slit pupils, thicker dark whisker marks, sharper canines, short claws" |
| SHADOW CLONE seal / SHADOW CLONE BARRAGE | "a cross-shaped hand sign: index and middle fingers of both hands extended and crossed in a plus shape" (already in §9) |

---

## 2. Animations (merge into ANIMATIONS.md)

<a id="specialforward"></a>

### `specialForward`: WIND STYLE: RASENSHURIKEN, held in the hand

7 frames · phases 2/2/3 (startup f0–f1, active f2–f3, recovery f4–f6) · plays once · optional (kit, fallback `special`) · bodyHeight 204 · ms 60/60/70/90/80/80/60 · prompt A39 (2 images: f0–f3 + f4–f6)

Before Sage Mode he cannot throw the Rasenshuriken. He raises it on his open palm, lunges in and slams it into the opponent by hand, and the technique tears up his own arm. The engine draws the spinning wind shuriken at his palm on the startup and active frames and the wind explosion on hit, so the palm stays EMPTY in every frame.

- **Strike target:** f2–f3: open R palm in the contact zone **x 194-222, y 128-158** (aim about x 212, y 146), the same LOW zone as the Rasengan thrust. The engine draws the wind shuriken at about **(205, 148)** on the active frames, so the palm center stays within about 15 px of that point. Only the R arm goes past the idle front edge (about x 182).
- **Raised-palm anchor:** f0–f1: the raised R palm, palm up, center about **(172, 44)**. Codex measures the packed palm center on f0 and f1 and writes it in the REVIEW QA notes, so Claude can set the engine's startup anchor.
- **Hair and cloth:** Technique wind blows the hair, temple tufts and headband tails up and back on f0–f1. They stream back (left) on f2–f3, whip forward on f4 as he staggers back, and settle by f6.
- **QA:** f0–f1 (raised palm) and f6 (stance) are the tallest frames, about 204: the top of the raised palm is no higher than the idle hair top (about y 36). If an approved strip still packs smaller than idle (head clearly under 31 px), Codex raises this row's `bodyHeight` in the manifest instead of redrawing. The lunge stays inside x 4-251 (rear R foot about x 40-60). If the packed f2–f3 hit box takes in the front knee or foot, Codex adds a `hitboxes.json` override for the palm only (MOVES_AND_VFX.md §6).

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `specialForward_00` | startup | Raising the technique: weight back on the R (rear) leg, knees bent about 30°, torso leaning back about 10°, L foot forward. R arm raised up and forward with the elbow slightly bent, the open R palm facing UP above the front of his head, fingers spread, EMPTY. L hand grips the R wrist from below to steady it. | fierce: teeth gritted, eyes intense on the opponent | Hair/tails: blown up and back · QA: R palm center ~(172, 44), palm top ≤ ~y 36 |
| f1 | `specialForward_01` | startup | Straining: knees deeper, torso leaning back a touch more, R arm trembling, L hand still on the R wrist; palm still up and EMPTY. | fierce, teeth gritted, one eye narrower | Hair/tails: second wind shape · QA: palm within ~4 px of f0 |
| f2 | `specialForward_02` | **active** | IMPACT: deep lunge to the right, L knee bent far forward (L toes no further than ~x 190), R leg straight behind; torso pitched forward about 25° and rotated so the R shoulder leads (chest toward the viewer). R arm fully extended straight forward at his own chest height (the deep lunge drops it to an opponent's stomach), open palm facing screen-right, fingers spread and pointing up, EMPTY. L fist pulled back to the L hip. | shout ("RASENSHURIKEN!") | **Smear:** a solid streak behind the R forearm · QA: R palm x 212 ±8, y 146 ±8 (zone x 194-222, y 128-158; within ~15 px of (205, 148)); hair and tails behind x 172 |
| f3 | `specialForward_03` | **active** | Hold the extension (palm 2 px back), clean arm, no smear. | shout | QA: palm ~x 210 |
| f4 | `specialForward_04` | recovery | Recoil: staggering half a step back onto the R leg, torso hunched; the R arm hangs limp straight down at his side (the technique hurt it), the L hand clutching the R forearm. No wounds, burns or bandages drawn. | pain: one eye squeezed shut, teeth gritted | Hair/tails: tails whip forward (right), still behind the head |
| f5 | `specialForward_05` | recovery | Straightening up: the R arm still low and limp, fingers twitching; the L fist rising toward the guard; weight re-centering. | pained, teeth gritted, eyes open | |
| f6 | `specialForward_06` | recovery | Back in the stance (same as idle f0), the R fist back beside the jaw. | determined, teeth slightly gritted | QA: within 1-2 px of idle f0 |

<a id="specialup"></a>

### `specialUp`: UZUMAKI BARRAGE rising flip kick

6 frames · phases 2/2/2 (startup f0–f1, active f2–f3, recovery f4–f5) · plays once · optional (kit, fallback `special`) · bodyHeight 214 · ms 50/50/60/60/70/70 · prompt A40 (2 images: f0–f3 + f4–f5)

A `dive` kind: he springs straight up with a rising flip kick (an anti-air hit on the way up), turns over at the top of the arc and hammers down. The engine adds the shadow-clone afterimages (ghost copies of his sprite) and a smoke puff on the rise. This strip covers the takeoff, the rise and the turn-over. **The slam reuses `airHeavy`** and the landing reuses `land`. In the current dive kind (`src/game/kit.js`) the rise plays f0–f1, then f2–f3, and the hang already switches to `airHeavy` startup. f4–f5 bridge into `airHeavy` f0 (the Sprite Lab preview and any later engine use), so f5 must match `airHeavy` f0.

- **Strike target:** f2–f3: the R foot leads up and forward, in front of his face, about **x 150-182, y 26-50**. Its top is the highest point of the strip (about y 26 at bodyHeight 214). The rise hit is a distance check in the engine, not the packed box, so the kick only has to read clearly. Like the `heavy` uppercut, it must end in front of his body, never only straight above his own head.
- **Hair and cloth:** Rising: hair spikes, temple tufts and headband tails are dragged DOWN on f1–f3 and float up at the apex (f4–f5). The jacket hem and pant legs flap down while rising.
- **QA:** f2 is the tallest frame (214). f1 stays lower than f2 (knees still bent, leaning forward, not stretched up on the toes). Nothing on f4–f5 rises above the f2 foot. f5 matches `airHeavy` f0 closely: same clasped fists overhead, same arch, same head size (about 31 px). The lowest point of every frame sits on the baseline. In f2–f3 the lowest point is the trailing L foot, under the hips, so the packer centers the body on it.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `specialUp_00` | startup | Crouch (like `jumpSquat`): knees bent about 90°, torso leaning forward, both arms swung down and back behind the hips, heels down, head up looking up-forward at the target. | focused | Hair/tails: spikes compressed 2 px, tails droop |
| f1 | `specialUp_01` | startup | Spring: legs driving up, heels off, toes last on the floor, knees still slightly bent; arms swinging forward and up to shoulder height; body leaning up and forward. | fierce | QA: lower than f2 |
| f2 | `specialUp_02` | **active** | RISING FLIP KICK: airborne, the body leaning back about 40° from vertical as he flips; the R leg kicks straight up and slightly forward, fully extended, instep and toes leading at the top right, in front of his face; the L leg trails straight down under the hips with pointed toes (the lowest point); both arms swept down and back for balance; head tilted back, eyes on the foot and the target above. | shout ("U-ZU-MA-KI!") | **Smear:** a solid crescent in the pant-leg colors trailing below and behind the R leg along its upward arc · QA: R foot x 150-182, top ~y 26 (the highest point, 214) |
| f3 | `specialUp_03` | **active** | Hold the kick, no smear; legs 2 px wider apart. | shout | QA: foot no higher than in f2 |
| f4 | `specialUp_04` | recovery | Turning over at the top of the arc: the R leg swings down and folds, the body rolls forward toward upright, knees pulled up toward the chest, both hands coming together above the shoulders, head coming forward and looking down at the target (below-right). | focused | Hair/tails: floating up |
| f5 | `specialUp_05` | recovery | Apex, the same pose as `airHeavy` f0: both arms raised overhead, fists clasped together (one hand wrapped over the other fist) above and slightly behind the head; torso arched back about 20°; knees tucked. | shout | QA: matches `airHeavy` f0; hands on to the slam |

<a id="specialdown"></a>

### `specialDown`: NINE-TAILS CHAKRA CLOAK activation

4 frames · phases 2/1/1 (startup f0–f1, activation f2, recovery f3) · plays once · no hit box · optional (kit, fallback `charge`) · bodyHeight 204 · ms 80/80/220/90 · prompt A41

A `mode` kind: the one-tail Nine-Tails chakra cloak. He drops into a feral crouch, roars and rises, still feral. The engine draws the red chakra cloak around him for the whole mode and the activation burst. It does not swap his sprites, so after f3 he plays his normal animations with his normal blue eyes. This is the **only** strip with the feral face, an exception to CHARACTER.md §2 item 10 and the off-model list.

- **Feral face and hands (fully on f2–f3, starting on f1):** eyes RED with thin black vertical slit pupils: iris base `#e0302a` ✚, lower-edge light `#ff6a4d` ✚, dark upper half and rim `#8a1a20` (shared with the back spiral), slit and lash line `#1d1420`, whites `#f1eef6`, one `#ffffff` catch-light. Whisker marks 2 px thick, slightly jagged, in `#1d1420` (instead of 1 px `#b9704f`). Two small pointed upper canines in the white ramp. Fingernails grown into short pointed claws (3-4 px past the fingertips) in the pale skin and white tones, outlined; never metal, never glowing. The hair keeps the approved short, compact shape; it may bristle up 1-2 px.
- **Palette:** + 2 colors (`#e0302a`, `#ff6a4d`), used in this strip only: 36 of 48. The packed strip must still report 48 colors or fewer.
- **No hit box:** the manifest row sets `"hitbox": false`.
- **Hair and cloth:** Chakra updraft: hair, temple tufts and headband tails lift on f0–f1 and blow straight up on f2; the jacket hem lifts; everything settles on f3.
- **QA:** f2 is the tallest frame (about 204: head up, knees still bent). The feet stay planted on the same spot in all 4 frames. No cloak, glow, bubbles, chakra tail, red skin tint or aura in the sprite.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `specialDown_00` | startup | Dropping into a feral crouch: knees bent about 80°, feet planted wide, torso hunched far forward (about 40°), both hands low in front of the knees with the fingers curled like claws, head down so the bangs shade the eyes. | teeth gritted, eyes hidden in the shadow of the bangs | Hair/tails: starting to lift |
| f1 | `specialDown_01` | startup | Deeper: crouched lower, shoulders hunched and trembling, the clawed hands nearly touching the floor, head still down; the whisker marks start to thicken and the nails start to grow. | teeth gritted, a red glint in the shadowed eyes | |
| f2 | `specialDown_02` | activation (no hit) | ROAR (held longest): torso rising and arched back, chest out, knees still bent and wide; both arms spread down and out to the sides, hands open with the fingers hooked into claws; head thrown up and back, mouth wide open. | feral roar: red slit eyes, canines bared, thick dark whiskers | Hair/tails: blown straight up · QA: tallest frame (204) |
| f3 | `specialDown_03` | recovery | Rising back toward the stance, still feral: knees bent, a slight forward lean, both hands raised in front at chest height as open claws instead of fists, head level, glaring at the opponent. | feral snarl: red slit eyes, lips pulled back over clenched teeth and canines | Flows into idle (the engine switches back to his normal sprites) |

<a id="superpose"></a>

### `superPose`: SHADOW CLONE seal (SHADOW CLONE BARRAGE super flash)

4 frames · loops · optional (kit, fallback `taunt`) · bodyHeight 208 · ms 140/140/140/140 · prompt A42

Shown during the super flash of his second super, SHADOW CLONE BARRAGE: he forms the seal, rushes in, his shadow clones beat the opponent up and he finishes with a Giant Rasengan. The engine draws the clones (ghost copies of his sprites), the smoke puffs, the cut-in and the Giant Rasengan; this strip is only the seal pose. It differs from `intro` (calm, feet shoulder width, a hint of a smile): here he is braced wide and shouting.

- **Seal:** both hands in front of the middle of the chest, about x 148-176, y 100-128: index and middle fingers of both hands extended and crossed in a plus shape (R hand fingers vertical, L hand fingers horizontal), the other fingers curled, elbows out. The hands never cover the face, and the collar never hides the seal.
- **Hair and cloth:** Super-flash wind: hair spikes, temple tufts and headband tails blown up and back; the tails, jacket hem and pant legs cycle through wind shapes. Hands, face and feet stay put.
- **QA:** The feet are identical in all 4 frames (no sliding in the loop). The tallest frame (hair blown up) is about 208.

| f | file | phase | pose | face | notes |
|---|---|---|---|---|---|
| f0 | `superPose_00` | loop | Braced: feet well wider than the shoulders (L foot forward), knees bent about 30°, weight low and centered; torso upright and turned a bit more toward the viewer so the seal reads; both hands in the seal in front of the chest; head up, eyes on the opponent. | shout: brows hard down, determined | Hair/tails: blown up and back |
| f1 | `superPose_01` | loop | Same, body 1 px lower; tails and jacket hem in a second wind shape. | shout | |
| f2 | `superPose_02` | loop | Same as f0, hair spikes 1 px up, tails in a third shape. | shout | |
| f3 | `superPose_03` | loop | Same as f1 with the pant legs fluttering. Flows into f0. | shout | |

---

## 3. Prompts A39–A42 (merge into PROMPTS.md)

**Step 9 · optional, kit (ADR 0009 / ADR 0011)**

These four strips show Naruto's kit moves. Until a strip exists the engine plays its fallback (in the
titles). Each block restates the shared lines of the other strip blocks, so it also works in a fresh
thread.

### A39 · `specialForward`: WIND STYLE: RASENSHURIKEN, held in the hand (kit, fallback `special`)

7 frames, phases 2/2/3. **Two images** (poses 1-4, then 5-7). Save as: `raw/_parts/specialForward_vNN_A.png` and `raw/_parts/specialForward_vNN_B.png` (same NN); Codex stitches them into `raw/specialForward_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `special` strip (`raw/special_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#specialforward).

Leave the palm EMPTY in every pose: the engine draws the wind shuriken. If the generator refuses, replace "Rasenshuriken" wording per CHARACTER.md §9.

Part A (save as `raw/_parts/specialForward_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "special" strip, for continuity (same scale, same pose language).
ERA: early Shippuden, before Sage Mode: no orange eye pigment or markings around the eyes, no sage cloak, no toad features, no glowing chakra-mode body.

ANIMATION: "specialForward", WIND STYLE: RASENSHURIKEN, held in his hand: he raises the technique on his open palm, lunges in and slams it into the opponent by hand, and it hurts his own arm. 7 frames in total, numbered 1 to 7 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames: the open right palm is fully extended toward the right and is the right-most part of the character; leave the palm EMPTY (the game draws the technique); head, hair, short temple tufts and headband tails stay behind it.
1. Raising the technique: weight back on the right (rear) leg, knees bent about 30°, torso leaning back slightly, left foot forward; the right arm raised up and forward with the elbow slightly bent, the open right palm facing UP above the front of his head (no higher than the top of his hair), fingers spread, EMPTY; the left hand grips the right wrist from below to steady it. Face: fierce, teeth gritted, eyes intense on the opponent. Hair/headband tails: blown up and back.
2. Straining: knees deeper, torso leaning back a touch more, the right arm trembling, the left hand still on the right wrist; the palm still up and EMPTY. Face: fierce, teeth gritted. Hair/headband tails: second wind shape.
3. IMPACT: a deep lunge to the right, left knee bent far forward, right leg straight behind; torso pitched forward and rotated so the right shoulder leads (chest toward the viewer); the right arm fully extended straight forward at the height of his own chest (the deep lunge lowers it to an opponent's stomach), the open palm facing the right edge of the image, fingers spread and pointing up, EMPTY; the left fist pulled back to the left hip. Face: shout. SMEAR: a solid streak behind the right forearm (hard pixels, no blur).
4. Hold the extension (palm slightly back from frame 3), clean arm without smear. Face: shout.
MOTION: The right palm stays EMPTY in every pose: draw NO wind shuriken, no energy ball, no wind lines, no glow (the game draws the technique at his palm). Hair and headband tails are blown up and back on frames 1-2, stream back behind the head on frames 3-4 (never past the palm), whip forward on frame 5 and settle by frame 7.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/specialForward_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "special" strip, for continuity (same scale, same pose language).
ERA: early Shippuden, before Sage Mode: no orange eye pigment or markings around the eyes, no sage cloak, no toad features, no glowing chakra-mode body.

ANIMATION: "specialForward", WIND STYLE: RASENSHURIKEN, held in his hand: he raises the technique on his open palm, lunges in and slams it into the opponent by hand, and it hurts his own arm. 7 frames in total, numbered 1 to 7 from left to right; this image is PART B of 2 and shows only poses 5 to 7 (the attached part A shows poses 1 to 4).
5. Recoil: staggering half a step back onto the right leg, torso hunched; the right arm hangs limp straight down at his side (the technique hurt it), the left hand clutching the right forearm. No wounds, burns or bandages. Face: pain, one eye squeezed shut, teeth gritted. Hair/headband tails: tails whip forward, still behind the head.
6. Straightening up: the right arm still low and limp, fingers twitching; the left fist rising toward the guard; weight re-centering. Face: pained, teeth gritted, eyes open.
7. Back in the stance (same as idle frame 1), the right fist back beside the jaw. Face: determined, teeth slightly gritted.
MOTION: The right palm stays EMPTY in every pose: draw NO wind shuriken, no energy ball, no wind lines, no glow (the game draws the technique at his palm). Hair and headband tails are blown up and back on frames 1-2, stream back behind the head on frames 3-4 (never past the palm), whip forward on frame 5 and settle by frame 7.

LAYOUT: one single horizontal row of exactly 3 poses on a 1536x1024 landscape canvas. Split the width into 3 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A40 · `specialUp`: UZUMAKI BARRAGE rising flip kick (kit, fallback `special`)

6 frames, phases 2/2/2. **Two images** (poses 1-4, then 5-6). Save as: `raw/_parts/specialUp_vNN_A.png` and `raw/_parts/specialUp_vNN_B.png` (same NN); Codex stitches them into `raw/specialUp_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `airHeavy` strip (`raw/airHeavy_vNN.png` with NN = its `approvedVersion`); for part B also part A. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#specialup).

The slam is his `airHeavy` strip, so pose 6 must match `airHeavy` pose 1. Draw no clones, afterimages or smoke: the engine adds them. If the generator refuses, replace "Uzumaki Barrage" wording per CHARACTER.md §9.

Part A (save as `raw/_parts/specialUp_vNN_A.png`):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "airHeavy" strip, for continuity (same scale, same pose language).

ANIMATION: "specialUp", UZUMAKI BARRAGE rising flip kick: he springs straight up with a rising flip kick, turns over at the top and ends ready for a double-fist hammer blow. 6 frames in total, numbered 1 to 6 from left to right; this image is PART A of 2 and shows only poses 1 to 4. Poses 3 and 4 are the HIT frames (an anti-air kick on the way up): the right foot leads up and forward, in front of his face, and is the highest and right-most part of the character; head, hair and headband tails stay behind it.
1. Crouch: knees bent about 90°, torso leaning forward, both arms swung down and back behind the hips, heels down, head up looking up and forward at the target. Face: focused. Hair/headband tails: spikes compressed slightly, tails droop.
2. Spring: legs driving up, heels off the ground, toes last on the floor, knees still slightly bent; arms swinging forward and up to shoulder height; body leaning up and forward (not stretched fully upright). Face: fierce.
3. IMPACT: rising flip kick in mid-air: the body leaning back about 40° from vertical as he flips; the right leg kicks straight up and slightly forward, fully extended, instep and toes leading at the top right, in front of his face; the left leg trails straight down under the hips with pointed toes (the lowest point); both arms swept down and back for balance; head tilted back, eyes on the foot and the target above. Face: shout. SMEAR: a solid crescent in the pant-leg colors trailing below and behind the right leg along its upward arc (hard pixels, no blur). Hair/headband tails: dragged down.
4. Hold the kick without the smear, the legs slightly wider apart, the foot no higher than in frame 3. Face: shout. Hair/headband tails: dragged down, second shape.
MOTION: Poses 3 to 6 are in mid-air. While rising, the hair spikes, short temple tufts and headband tails are dragged DOWN; at the top of the arc (poses 5 and 6) they float up. Draw NO clones, no afterimages, no smoke: the game adds the shadow-clone afterimages. Nothing in poses 5 and 6 rises above the kicking foot of pose 3.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

Part B (attach part A too; save as `raw/_parts/specialUp_vNN_B.png`, same NN):

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "airHeavy" strip, for continuity (same scale, same pose language).

ANIMATION: "specialUp", UZUMAKI BARRAGE rising flip kick: he springs straight up with a rising flip kick, turns over at the top and ends ready for a double-fist hammer blow. 6 frames in total, numbered 1 to 6 from left to right; this image is PART B of 2 and shows only poses 5 to 6 (the attached part A shows poses 1 to 4).
5. Turning over at the top of the arc: the right leg swings down and folds, the body rolls forward toward upright, knees pulled up toward the chest, both hands coming together above the shoulders, head coming forward and looking down at the target below on the right. Face: focused. Hair/headband tails: floating up.
6. Apex: both arms raised overhead, fists clasped together (one hand wrapped over the other fist) above and slightly behind the head; torso arched back about 20°; knees tucked. This pose leads straight into his double-fist hammer slam: match the first pose of the attached airHeavy strip exactly. Face: shout.
MOTION: Poses 3 to 6 are in mid-air. While rising, the hair spikes, short temple tufts and headband tails are dragged DOWN; at the top of the arc (poses 5 and 6) they float up. Draw NO clones, no afterimages, no smoke: the game adds the shadow-clone afterimages. Nothing in poses 5 and 6 rises above the kicking foot of pose 3.

LAYOUT: one single horizontal row of exactly 2 poses on a 1536x1024 landscape canvas. Split the width into 2 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline. The attached part A sets the scale: use exactly the same head size, baseline and design as part A.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A41 · `specialDown`: NINE-TAILS CHAKRA CLOAK activation (kit, fallback `charge`)

4 frames, phases 2/1/1. Save as: `raw/specialDown_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`. Details and QA: [ANIMATIONS.md](ANIMATIONS.md#specialdown).

Draw NO chakra cloak, aura or glow: the engine wraps him in the red chakra cloak. The red slit eyes, thicker whiskers, canines and claws appear in this strip only, so its PALETTE line adds the 2 red eye colors (36 colors). The attached expression sheet shows his normal blue eyes; the prompt overrides them for this strip. If the generator refuses, replace "Nine-Tails" wording per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose.
ERA: early Shippuden, before Sage Mode: no orange eye pigment or markings around the eyes, no sage cloak, no toad features, no glowing chakra-mode body.

ANIMATION: "specialDown", NINE-TAILS CHAKRA CLOAK activation: a feral power-up, not an attack. 4 frames in total, numbered 1 to 4 from left to right.
FERAL: in the poses marked (FERAL) his eyes are RED with thin black VERTICAL SLIT pupils (red iris #e0302a with a lighter lower edge #ff6a4d and a dark upper half and rim #8a1a20, white eye whites, one tiny white catch-light); the three whisker marks on each cheek are thicker, darker (#1d1420) and slightly jagged; his upper canines are sharper (two small pointed fangs); his fingernails have grown into short pointed claws (pale, in his skin-highlight and white tones, never metal, never glowing). In poses 1 and 2 the change is only starting. His short hair, outfit and colors stay exactly as on the model sheet.
1. Dropping into a feral crouch: knees bent about 80°, feet planted wide, torso hunched far forward, both hands low in front of the knees with the fingers curled like claws, head down so the bangs shade the eyes. Face: teeth gritted, eyes hidden in the shadow of the bangs. Hair/headband tails: starting to lift.
2. Deeper: crouched lower, shoulders hunched and trembling, the clawed hands nearly touching the floor, head still down; the whisker marks starting to thicken and the nails starting to grow. Face: teeth gritted, a small red glint in the shadowed eyes. Hair/headband tails: lifting.
3. ROAR (FERAL): torso rising and arched back, chest out, knees still bent and wide; both arms spread down and out to the sides, hands open with the fingers hooked into claws; head thrown up and back, mouth wide open roaring, the sharp canines bared. Face: feral roar, red slit eyes. Hair/headband tails: blown straight up.
4. (FERAL) Rising back toward his fighting stance, still feral: knees bent, a slight forward lean, both hands raised in front at chest height as open claws instead of fists, head level, glaring at the opponent on the right. Face: feral snarl, red slit eyes, lips pulled back over the clenched teeth and canines. Hair/headband tails: settling.
MOTION: The feet stay planted on the same spot in all 4 poses. Draw NO red chakra cloak, no aura, no glow, no bubbling energy, no chakra tail, no red skin tint, no smoke: the game draws the cloak around him.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 36 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20; red eyes (this strip only) #e0302a #ff6a4d.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

### A42 · `superPose`: SHADOW CLONE seal, super flash (kit, fallback `taunt`)

4 frames, loops. Save as: `raw/superPose_vNN.png`. Attach: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`, the approved `intro` strip (`raw/intro_vNN.png` with NN = its `approvedVersion`; if `intro` has no approved version yet, leave it out and delete the "Also attached" sentence). Details and QA: [ANIMATIONS.md](ANIMATIONS.md#superpose).

Draw NO clones and no smoke: the engine adds the shadow clones and the super flash. Without this strip the super flash shows the pointing taunt, so generate it. If the generator refuses, replace the "Shadow Clone" wording per CHARACTER.md §9.

```text
Hi-res pixel-art sprite strip for a 2D anime arena fighting game (anime fan-art sprite).
CHARACTER: Naruto Uzumaki in his Naruto Shippuden design (about 16 years old, after the time skip; not his Part 1 childhood outfit), drawn as anime fan-art: a lean, athletic teenage ninja with a serious, confident, determined air; short, compact bright golden-blond spikes, shortened pointed bangs ending above or at the top edge of his forehead plate, short temple tufts ending around the upper ears with no cheek- or jaw-length locks, and short back hair close to the nape; sharp bright blue eyes; three thin whisker marks on each cheek; a black cloth forehead protector with two long tails and a polished steel plate engraved with a leaf-swirl symbol; an orange-and-black zip-up track jacket (black across the shoulders, upper chest, upper back and upper sleeves, a black high stand-up collar, a front zipper with a small steel pull, orange body and lower sleeves, a red spiral emblem on the back); loose orange pants with the hems folded up at the lower shins; a black kunai holster strapped to his right thigh; black open-toed ninja sandals.
PROPORTIONS: about 6.5 heads tall, serious anime proportions, athletic build, not chibi, not super-deformed. A small head on a long body: long legs (about half the body height), broad defined shoulders, a slim waist, realistic hands and feet. The spiky hair adds about half a head on top.
Match the attached model sheet and approved idle strip exactly: same face, whisker marks, hair, headband, outfit, colors, proportions and character scale in every pose. Also attached: the approved "intro" strip, for continuity (same scale, same hand seal).

ANIMATION: "superPose", SHADOW CLONE JUTSU hand seal for his shadow-clone barrage super (shown during the super flash). 4 frames in total, numbered 1 to 4 from left to right. It loops: the last frame must flow smoothly back into the first.
1. Braced: feet well wider than the shoulders (left foot forward), knees bent about 30°, weight low and centered; torso upright and turned a bit more toward the viewer so the seal reads; both hands in front of the middle of the chest forming the cross-shaped seal: index and middle fingers of both hands extended and crossed in a plus shape (right hand fingers vertical, left hand fingers horizontal), other fingers curled, elbows out; head up, eyes on the opponent on the right. Face: shout, brows hard down, determined. Hair/headband tails: blown up and back.
2. Same, body slightly lower; the headband tails and jacket hem in a second wind shape. Face: shout.
3. Same as frame 1, hair spikes slightly up, the tails in a third shape. Face: shout.
4. Same as frame 2 with the pant legs fluttering. Flows into frame 1. Face: shout.
MOTION: A held, powerful pose with a small wind loop: only the hair, headband tails, jacket hem and pant legs move; the hands, face and feet stay put. The hands never cover his face. Draw NO clones, no smoke puffs, no aura: the game adds the shadow clones and the super flash.

LAYOUT: one single horizontal row of exactly 4 poses on a 1536x1024 landscape canvas. Split the width into 4 equal slots and center one pose in each slot, in order from left to right. Leave clear magenta gaps between neighbouring poses: no pose overlaps another or crosses into the next slot. Make the character as large as the slots allow.
SCALE: exactly the same character scale in every pose (same head size). Grounded poses all stand on one shared horizontal baseline.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite.
VIEW: the character faces RIGHT in every pose. 3/4 view: body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above (about 12 degrees). His right arm and right leg are nearest the viewer. Punches, kicks and palm strikes travel horizontally toward the right edge of the image.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#1d1420) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, knuckles, jacket and pant folds), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #1d1420; skin #ffe2c6 #f8c69b #eaa77e #d98a66, whiskers and nose #b9704f, deepest skin shadow #8a4a3a; hair #fff6c2 #ffe36a #ffc935 #e0861c #a85a14; orange jacket and pants #ffc878 #ffac48 #f88320 #c44d14 #8f3310; black cloth (shoulders and upper sleeves, collar, headband cloth and tails, sandals, holster) #5a5c74 #3a3b4e #26273a #15151f; steel headband plate and zipper pull #e4eaf4 #b8c2d2 #76829a; eyes #7cc0ff #2f86ec #1a3f8e; whites #ffffff #f1eef6 #bbb5cc; mouth #5a1a22 #a8424a; back spiral #c8282a #8a1a20.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No ground shadow, no floor, no text, no numbers, no labels, no frame borders or grid lines, no energy effects, no aura, no extra characters.
```

---

## 4. QA checklist (after `npm run sprites naruto`)

Every kit strip: facing right, about 6.5 heads (head about 31 px after packing, compared with idle in
the Sprite Lab), the current short-hair design, whiskers on both cheeks, early Shippuden (no sage
markings, no sage cloak, no toad features), and **no energy, orbs, aura, smoke, afterimages or clones
drawn**. The packed palette stays at 48 colors or fewer.

**`specialForward` (A39)**

- The R palm is EMPTY on all 7 frames: no shuriken, wind, ball, lines or glow.
- f0–f1: palm up and raised, L hand steadying the R wrist, palm top no higher than the idle hair top;
  the packed palm center is measured and written in the REVIEW QA notes (target about (172, 44)).
- f2–f3: the palm is the right-most point, inside x 194-222, y 128-158 and within about 15 px of
  (205, 148); hair and tails behind x 172.
- f4–f5 read as a hurt R arm (limp, clutched), without drawn wounds; f6 is within 1-2 px of idle f0.

**`specialUp` (A40)**

- f2–f3: the kicking R foot leads up and forward in front of the face; the f2 foot top is the
  highest point of the strip (214); the trailing L foot is the lowest point.
- f1 is lower than f2; nothing on f4–f5 rises above the f2 foot.
- f5 matches `airHeavy` f0 (same clasped fists overhead, same arch, same head size).

**`specialDown` (A41)**

- Red vertical slit eyes, thick dark whiskers, sharper canines and short claws on f2–f3 (only a red
  glint on f1), and in no other strip of the sheet.
- No cloak, glow, chakra tail, bubbles, red skin tint or aura.
- The feet stay planted on the same spot; f2 is the tallest frame (about 204); the hair keeps its
  approved short shape.
- The eye reds are `#e0302a`, `#ff6a4d` and `#8a1a20`; Codex remaps strays to them.

**`superPose` (A42)**

- The seal reads clearly at sprite size: two crossed finger pairs forming a plus in front of the
  chest, both hands visible, not covering the face.
- He is braced wide and shouting, clearly different from the calm `intro` seal.
- The feet are identical in all 4 frames; only the hair, tails, jacket hem and pant legs move.
