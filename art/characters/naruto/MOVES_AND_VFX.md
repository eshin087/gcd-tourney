# Naruto: moves and VFX

> How every Naruto move plays in the engine, which animation and which engine effects it uses, and
> which Naruto-specific effect art to request. Poses: [ANIMATIONS.md](ANIMATIONS.md). Look and
> palette: [CHARACTER.md](CHARACTER.md). Shared effect art (shapes, frame by frame):
> [art/vfx/EFFECTS.md](../../vfx/EFFECTS.md). Cell numbers follow **art spec v2** (256×256 cells,
> pivot [128, 240], ppu 128): [ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md) and
> [art/SPEC.md](../../SPEC.md). If anything here disagrees with them, they win.
>
> Engine facts come from `src/game/moves.js` (timing, damage), `src/game/effects.js` (effect
> recipes), `src/game/game.js` and `src/game/projectiles.js`. They're current as of this brief. If
> the code changes, the code wins: update this file.

## 1. Combat contract (what the art must respect)

- **2.5D lanes.** Fighters move freely on the ring, but attacks fire along the **screen
  horizontal** and auto-step to line up depth. A melee hit needs **both**:
  1. the attacker's **hitbox** (from the sprite frame: where the fist / foot / palm actually is)
     overlapping the defender's **hurtbox** (where the body is on *their* current frame), and
  2. both fighters in the **same depth lane** (within about 0.6 world units front-to-back).
- **Boxes come from the art.** The packer writes `boxes` into `anims.json`: hurt = the body
  silhouette (inset), hit = the part of the silhouette that reaches past the idle front edge on
  **active** frames. `hitboxes.json` can override any frame (§6).
- **The spark goes where the boxes meet.** The engine spawns the hit spark at the center of the
  hitbox/hurtbox overlap, so a correctly drawn fist lights up exactly on the opponent's body.
- **Why this matters (the "hit without contact" bug).** The 3D placeholder sheets have no boxes,
  so the engine falls back to each move's `reach` number and the hit can register before the limb
  visibly touches. With hi-res sheets and boxes, what you see is what hits. That only works if
  every active frame is drawn with the limb fully extended toward screen-right, inside its ADR 0007
  contact zone (ANIMATIONS.md rule 4).
- **World size did not change in v2.** Effect offsets are in world units; at ppu 128 a point
  `forward, up` units from the feet sits at cell px `(128 + forward × 128, 240 − up × 128)`.

## 2. Move list

Default bindings (the in-game controls menu is the authority if they change). Timing is in 60 fps
game frames: startup / active / recovery. Damage is out of 1000 HP.

| input (VS CPU · pad) | move | anim(s) | timing | damage and effect | engine VFX on use / on hit |
|---|---|---|---|---|---|
| J ×1 · □/X | jab | `light1` | 5 / 3 / 11 | 28, chains to light2 | whoosh · hit **light** |
| J ×2 | rear straight | `light2` | 5 / 3 / 12 | 30, chains to light3 | hit **light** |
| J ×3 | front push-kick (low) | `light3` | 6 / 4 / 14 | 36, chains to light4 | hit **light** (spark lower) |
| J ×4 | spinning roundhouse | `light4` | 9 / 4 / 22 | 58, launches, **wall bounce** | hit **smash** · `barrier` + hit heavy on wall |
| K · △/Y | rising uppercut launcher | `heavy` | 12 / 5 / 22 | 64, launches up; jump/dash on hit chases | hit **heavy** |
| J in air ×1–3 | air jab, air kick, air spin kick | `airLight1` · `airLight2` · `airLight3` | 4/4/9 · 4/4/10 · 6/4/14 | 24 · 26 · 40 (knock away, wall bounce) | hit **light** · light · **heavy** |
| K in air | double-fist hammer | `airHeavy` | 9 / 6 / 16 | 62, spike, **ground bounce** | hit **smash** · `dust` + `crater` on bounce |
| L tap · ○/B | **RASENGAN** rush (1 bar) | `special` | 24 / 22 / 20 | 150, launches, wall bounce | `orb` + `glow` + `star` at the palm · on hit: explosion, `crater`, debris, impact frame, blue flash, slow-mo |
| L in air | **SHURIKEN** ×3 (½ bar) | `throw` | 8 / 3 / 14 | 22 each, 3 in a fan | `shuriken` sprites · hit **light** |
| L hold | charge ki | `charge` | while held | fills ki | aura: `flame`, `streak`, `star`, `glow` |
| K+L · △+○ | **RASEN CANNON** ultimate (3 bars) | `beamCharge` → `beamFire` | windup 46, beam 84 | ticks of 12 + 130 final | super flash + cut-in, aura, beam ribbon, `glow` bulbs, tick sparks, explosion, `crater` |
| O / double-tap · R1/RB | dash | `dash` | | | `dust`, `ring` |
| O neutral | super dash (homing) | `superDash` | up to 42 frames | 38 on contact | big dash burst: `ring` + `lines` + `burst` (orange) · hit **heavy** |
| Shift+L · L1+○ | vanish (1 bar) | `vanish`, then `light4` as the vanish kick | kick 2 / 5 / 20 | 75, launch, wall bounce | out: `smoke` + `lines`; in: `star` + `ring` (orange) + afterimage · hit **smash** |
| Shift · L1 | guard | `guard`, `block` | | | block: `ring` + `star` + `lines` (light blue) |
| Space · ✕/A | jump | `jumpSquat`, `jumpUp`, `jumpFall`, `land` | | | `dust` on take-off and landing |
| any button while launched | air recover | `airRecover` | | | |
| (getting hit) | reactions | `hurtHigh`, `hurtLow`, `launched`, `spin`, `down`, `getup`, `stagger`, `ko` | | | `dust` on landing, `crater` on big slams |
| match start / taunt / win | attitude | `intro`, `taunt`, `win` | | | none yet (see §5 requests) |

Hit recipes (from `effects.js`), drawn on top of the fighters:

| kind | layers |
|---|---|
| **light** | `spark` (crescent slash, tinted) + `star` + `lines`, plus 3 small `star` particles |
| **heavy** | `spark` + `burst` + `lines` + `ring` + `star`, plus 5 particles |
| **smash** | white `glow` flash + 2 × `burst` + `lines` + `ring` + `star`, plus 8 particles |
| explosion | `glow` + smash + ground `ring` + 5 × `smoke` |

## 3. Move by move

### Auto combo (Light ×4)

Four escalating hits that read as one flowing string: a snappy **jab** (lead L fist to the face),
a fully rotated **rear straight** (R fist to the chin), a **push-kick** to the stomach with the rear
R leg, then the big **spinning roundhouse** that whips round (his black upper back and the red
spiral flash past on f2) and sends the opponent into the ring barrier. Each hit lunges him forward a
little (engine), so the art doesn't need travel. Faces escalate: focused, fierce, shout. With 6.5-head
proportions the reach comes from long, fully extended limbs and hip rotation, not from stepping
through the opponent.

### Launcher (Heavy)

A deep crouch, then he explodes upward with a **true uppercut**: on the hit frame the R forearm is
nearly vertical and the fist is at chin height **in front of** his body (zone x 180-208, y 58-86). On
the follow-through the fist rises over his head, still in front of his face (zone x 160-188, the
highest point of the strip). The engine adds a small hop and the opponent flies straight up. If the
player presses jump, he super-jumps after them for the air combo.

### Air combo (Light ×3 in the air, Heavy to finish)

Air jab, air front kick, air spinning back-heel kick (knock away), or the **double-fist hammer**:
arms raised overhead with fists clasped, then smashed down-forward. It spikes the opponent into the
floor (ground bounce, dust, sometimes a crater). All air attacks start and end in the shared air
base pose so they chain smoothly.

### RASENGAN (special, 1 bar)

| phase | game frames | sprite frames | what the player sees |
|---|---|---|---|
| startup | 24 | f0–f2 | Naruto drops into a wide stance and shapes chakra between his hands. The engine draws the **orb** (`orb`, full color) at his R palm, growing from tiny to full size, with a pale-blue `glow` (`#8ac8ff`) and blue-white `star` sparkles (`#bfe4ff`) spitting off it. Rasengan whirr sound loops. |
| active | 22 | f3–f5 | He ninja-runs forward (the engine rushes him) holding the orb out front, then thrusts it palm-first into the opponent (f5). |
| recovery | 20 | f6–f7 | Follow-through and back to stance. The orb lingers a few frames if it hit. |
| on hit | | | Big explosion tinted Rasengan blue `#6ab4ff` (glow, bursts, rings, smoke), crater and debris, a 3-frame inverted **impact frame**, blue screen flash, slow-mo, camera shake and zoom punch, crowd cheer. The opponent is launched into the barrier. |

Art requirements:

- **Leave the palm empty** in every `special` frame. The orb is an engine effect.
- Keep the R palm where the engine draws the orb: 0.6 units in front of him at waist height
  (0.72 up), cell **(205, 148)**, on **every** frame. The full-size orb is about **86 px** across
  (0.72 world units at ppu 128), so the palm stays **within about 15 px** of that point. The engine
  does not move the orb on the thrust, so f5 is a short planted lunge with the palm in the contact
  zone x 194-222, y 128-158 (aim about (214, 142)), still inside the orb (SPEC.md "Effect anchor
  points").
- In the anime a **shadow clone** often helps form the Rasengan. That needs engine support for a
  second actor, so for now he forms it alone (L hand shaping over the R palm). See request R2 in §5.

### SHURIKEN (throw in the air, ½ bar)

He cocks his R arm back with three shuriken fanned between his fingers (f0, the only frame with a
prop), whips the arm forward (f1, hand open, empty), and follows through. The engine spawns three
`shuriken` sprites at his chest, 0.5 units in front and 0.9 up (cell **(192, 125)**; the hand passes
the release zone x 186-212, y 116-142 on f1), fanned 0.2 rad apart, flying at speed 22 toward the
opponent's chest (aim height y 131-138). Each one spins through the 4-frame `shuriken` loop and makes
a **light** hit spark on contact. The throwing arm itself never hits (`hit: []`, §6).

### RASEN CANNON (ultimate, 3 bars)

> **Superseded by ADR 0017:** the ultimate is now **Four-Tails** (a rampage, not a beam). The brief for its frames is
> [KIT.md §5](KIT.md#5-four-tails-ultimate-adr-0017-redraw-beamcharge--beamfire-as-the-shroud-form); this section is kept as the record.

| beat | engine | Naruto art |
|---|---|---|
| super flash | time freezes for 42 frames, the stage darkens, speed lines focus on him, and the HUD slides in his **cut-in** (`ui/cutin.png`: eyes strip) with "RASEN CANNON" | `ui/cutin.png` (UI art) |
| windup | 46 frames (14 when firing back into a beam), strong orange aura (`flame`, `streak`, `glow`) | `beamCharge` loop: hands cupped empty at the rear hip |
| beam | 84 frames; a ribbon beam (core `#fff6d8`, mid `#ffb43a`, edge `#ff6a10`) shoots from 0.8 units in front of him at chest height (0.92 up, cell **(230, 122)**), with `glow` bulbs at the origin and the head; damage ticks every 5 frames with tinted sparks; the last hit explodes | `beamFire` loop: palms thrust forward in the zone x 222-238, y 112-132 |
| beam clash | if the opponent fires back, the beams meet: pulsing `glow`, `lightning`, `ring`, `star`, `smoke` and debris at the clash point; both players mash | same `beamFire` loop |

### Super dash, dash, vanish

- **Dash:** the low ninja dash; the engine kicks up `dust` and a white ground `ring`.
- **Super dash:** missile flight with the R fist leading, angled about 25° upward with the knees
  bent (ADR 0007 pose note, about 230 px long); a big orange dash burst (`ring`, `lines`, `burst`
  tinted `#ff8a1c`) on launch; a **heavy** hit on contact.
- **Vanish:** a quick crouch and stretch (`vanish`), a `smoke` puff and radial `lines` where he
  was, then he reappears behind the opponent with a `star` flash, an orange `ring` and an orange
  afterimage, and lands the spinning kick (`light4` frames, faster startup). The `smoke` puff
  doubles as his shadow-clone "poof", so draw it as the classic poof (see §4).

### Charge, guard, reactions

- **Charge:** wide stance, fists down, shouting upward. The engine surrounds him with white flame
  tongues tinted his aura colors (`#ff8c1f` outer, `#ffeb8c` core), rising light `streak`s, dust
  motes (`star`) and a soft `glow`. Never draw aura in the sprite.
- **Guard / block:** cross-arm guard. The block spark is a light-blue `ring` + `star` + `lines`.
- **Reactions:** the hurt frames sell the impact. The spark appears where the attacker's limb
  overlaps his hurtbox, so keep the hurt silhouettes compact (arms flung back, not forward) so
  the hurtbox doesn't stretch toward the attacker. `launched` is arched diagonally and `down` / `ko`
  lie flat with the head toward screen-left (ADR 0007 pose notes).

## 4. Engine effects Naruto relies on (shared atlas)

The VFX atlas is shared by all characters. Effect names are fixed by the engine. Shapes, cell size
(128 px, ppu 56: unchanged in v2) and frame-by-frame descriptions live in
[art/vfx/EFFECTS.md](../../vfx/EFFECTS.md). Naruto-specific notes:

| effect | Naruto use | look notes for Naruto |
|---|---|---|
| `orb` (6 frames, full color) | **his Rasengan**, at the palm during `special` | A spiraling blue wind sphere: a solid core (`#ffffff` / `#e8f6ff` center), `#7ab8ff` body, `#3a7cf0` rim, with 3 to 4 curved white wind bands that rotate about 60° per frame so the 6 frames loop. Hard pixels, round silhouette, a few wind "fins" breaking the rim. No outline ring. |
| `shuriken` (4 frames, full color) | his thrown shuriken | Classic four-pointed steel star with a center hole: `#5a6070` blades, `#c8d0dc` edge highlights, `#1a1a24` hole. 4-fold symmetric, so the 4 frames rotate 0°, 22.5°, 45°, 67.5° and loop seamlessly. |
| `smoke` (7 frames, full color) | vanish puff, explosions, beam clash | Reads as the shadow-clone **poof**: a round puffy cool white/grey cloud (no pink or lavender) that bursts out from the center, with 3 to 4 bulbous lobes, then thins and breaks apart. Use the shared smoke colors. |
| `flame`, `streak`, `glow`, `star` (white, tinted) | charge and ultimate aura, Rasengan sparkles | The engine tints them `#ff8c1f` / `#ffeb8c`. Keep them pure white/grey in the art. |
| `spark`, `burst`, `lines`, `ring`, `star` (white, tinted) | every hit | Shared hit language, no Naruto-specific art. |
| `dust`, `crater` (full color) | landings, slams, Rasengan hit | Shared. |

**Shared-slot caveat:** `orb` is effectively Naruto's effect today. If a future character needs a
different hand sphere, don't repaint `orb`. Add a per-character effect instead (request R1's
mechanism below) and record the decision in an ADR.

## 5. Naruto-specific effect requests (proposed, need engine work)

These make Naruto look like the anime but need small engine or packer changes first. Each one
needs a task in `docs/TASKS.md` (owner: Claude for engine, Codex for the art), an ADR if it changes
the asset format, and entries in `art/manifest.json` before Codex marks anything `packed`. The
art can be generated ahead of time. The engine ignores it until the task lands. Naming follows the
rule for every character (`art/vfx/README.md` "Adding a new effect"): effects are
`naruto_<effect>` with versioned raws in `art/vfx/raw/_proposed/`; a proposed character animation
goes in `art/characters/naruto/raw/_proposed/`. Every candidate gets a `_vNN` version and a row in
`art/REVIEW.md`. The packer never reads `_proposed/` folders.

| id | name | what | cell / frames / ms | color rule | where the raw goes |
|---|---|---|---|---|---|
| R1 | `naruto_rasenganImpact` | A spiral shockwave when the Rasengan connects: a blue vortex disc that spins open, wind slashes flying outward, then breaks into rings | 128 px VFX cell, 6 frames, 40 ms | full color (`orb` palette) | `art/vfx/raw/_proposed/naruto_rasenganImpact_vNN.png` |
| R2 | `cloneAssist` (character animation) | A shadow clone that poofs in beside him during `special` startup and shapes the Rasengan with him: poof-in (smoke covering a half-formed clone), 3 frames of shaping (mirror of `special` f0–f1 from the clone's side), poof-out | 256 px character cell (spec v2), 6 frames, 80 ms | Naruto palette (engine may tint it slightly paler) | `art/characters/naruto/raw/_proposed/cloneAssist_vNN.png` |
| R3 | `introClones` (engine feature, reuses art) | During `intro`, two shadow clones poof in on either side holding the same seal | reuses `intro` frames + `smoke` | | no new art; engine spawns extra sprite actors |
| R4 | `naruto_cannonHead` | The Rasen Cannon's head: an orange spiraling sphere with wind fins that leads the beam (replaces the plain `glow` bulb) | 128 px VFX cell, 6 frames, 40 ms | full color (beam palette `#fff6d8` / `#ffb43a` / `#ff6a10`) | `art/vfx/raw/_proposed/naruto_cannonHead_vNN.png` |
| R5 | `naruto_windTrail` | Short curved wind streaks trailing behind the orb during the Rasengan rush | 128 px VFX cell, 4 frames, 45 ms | white (tinted `#8ac8ff`) | `art/vfx/raw/_proposed/naruto_windTrail_vNN.png` |

Frame-by-frame for the requests (use the same prompt framing as PROMPTS.md: magenta background,
hard pixels, centered in each slot; R2 also uses the full spec v2 character block: Shippuden
design, about 6.5 heads tall, not chibi):

- **R1 `naruto_rasenganImpact`:** f0 small bright white-blue core with 4 short spiral arms;
  f1 the spiral opens into a disc about 60% of the cell, arms curling clockwise; f2 full-size
  vortex disc with 6 wind slashes flying outward; f3 the disc breaks into two thin rings, slashes
  at the cell edge; f4 thin outer ring and scattered blue chips; f5 a few fading chips (3 hard alpha
  steps).
- **R2 `cloneAssist`:** f0 a `smoke` poof with a crouching clone half visible; f1 the clone
  (identical Naruto, facing right, on the far side) with both hands cupped over an empty point
  in front; f2–f3 shaping (hands circling, like `special` f0–f1); f4 the clone pulls back;
  f5 the clone bursts into a poof. Hands empty: the engine draws the orb.
- **R4 `naruto_cannonHead`:** f0–f5 a sphere about 70% of the cell, with an orange rim
  `#ff6a10`, `#ffb43a` body and `#fff6d8` core, and three spiral wind fins rotating 60° per frame.
  It loops.
- **R5 `naruto_windTrail`:** f0 two short curved white streaks; f1 streaks longer and curling
  back; f2 three streaks, thinner; f3 broken dashes fading.

## 6. Hitboxes: auto boxes and Naruto overrides

The packer makes boxes automatically (SPEC.md "Hitboxes and hurtboxes"):

- **hurt** = opaque bounding box, inset 18% on the left and right and 4% from the top;
- **hit** (active frames only), first rule that applies: 1) the limb that sticks out right of the
  idle front edge minus 9 px (about **x 174** for Naruto: his idle front edge is about x 182), boxed;
  2) a rising strike above the idle head (uppercut): the fist/forearm blob around the highest pixel;
  3) otherwise the front-most 28% of the bbox, full height.

Check every attack in the Sprite Lab after packing. Expected Naruto overrides, to add **after** the
art is packed and the real pixels are known. Coordinates are frame-local `[x, y, w, h]` in the final
**256×256** cell, facing right; keys are the frame number within the animation (0-based, the `NN` in
`<anim>_NN.png`; `"3"` and `"03"` both work). An explicit **`"hit": []` means "this frame cannot
hit"**; a frame without a `hit` key falls back to the move's reach numbers.

| anim | frames (NN) | why | override |
|---|---|---|---|
| `special` | 03, 04, 05 | The orb is an engine effect, so the auto hitbox only covers the hand. Extend it to most of the orb around the palm (the orb is about 86 px across) | `hit` box about 54×54 px centered on the orb point (205, 148) on 03-04 and on the thrust palm (about (214, 142)) on 05 |
| `heavy` | 03, 04 | The uppercut fist only just clears the idle front edge on 03 and rises above the head on 04, so the auto box may be a sliver or land on the forearm | `hit` box around the fist and forearm, inside the zones x 180-208, y 58-86 (03) and x 160-188, y 22-46 (04) |
| `airHeavy` | 02, 03 | The down-forward fists may sit below the idle front-edge test band | `hit` box around the clasped fists, inside the zone x 180-218, y 160-206 |
| `throw` | 01 | It's a projectile move, so the arm should not hit in melee | `hit: []` (cannot hit) |

Starting values for `art/characters/naruto/hitboxes.json` (adjust after measuring the packed
frames):

```json
{
  "special": {
    "03": { "hit": [[178, 121, 54, 54]] },
    "04": { "hit": [[178, 121, 54, 54]] },
    "05": { "hit": [[187, 115, 54, 54]] }
  },
  "heavy": {
    "03": { "hit": [[180, 58, 28, 44]] },
    "04": { "hit": [[160, 22, 28, 26]] }
  },
  "airHeavy": {
    "02": { "hit": [[180, 160, 38, 46]] },
    "03": { "hit": [[180, 162, 38, 44]] }
  },
  "throw": {
    "01": { "hit": [] }
  }
}
```

Don't create `hitboxes.json` until the frames exist. Overrides on placeholder coordinates are
worse than the auto boxes. Codex measures, writes the file, re-packs, and notes it in the REVIEW.md
row and the tracker.

## 7. Naruto QA checklist (after `npm run sprites naruto`)

1. The packer report names the expected source for every animation (the highest `raw/<anim>_vNN.png`).
   Sprite Lab: every CORE animation present. `anims.json` has `"complete": true`.
2. Idle and run: same head size as each other (about 31 px), **about 6.5 heads tall, not chibi**,
   Shippuden outfit (black headband, orange-and-black jacket with the black high collar, black
   sandals); no sliding between run frames.
3. Each attack's active frames: the hitbox outline sits on the fist / foot / palm inside its ADR 0007
   contact zone, and nothing but the striking limb is inside it.
4. In a match (`/?fight=naruto,sasuke&mode=solo&art=custom` for partial sheets): jab, straight,
   push-kick, roundhouse, uppercut, air string and hammer all spark **on** Sasuke's body at
   point-blank and at max range, and whiff when drawn short.
5. Rasengan: the engine orb sits in the cupped palm on f0–f4 and still covers the palm on the
   f5 thrust (palm within ~15 px of (205, 148)); the explosion happens at the palm.
6. Shuriken leave the hand on the release frame (hand near (192, 125)), not before.
7. Rasen Cannon: the beam starts at the palms (230, 122); the cut-in shows both eyes and the whiskers.
8. Down / ko / getup: head toward screen-left, about 210 px long, inside x 4-251; no pop between
   `down` f1 and `getup` f0. superDash and launched are not clipped (ADR 0007 pose notes).
9. Palette: packer report at 48 colors or fewer for Naruto (it warns above 64); the palette in
   CHARACTER.md §7 has 34.
