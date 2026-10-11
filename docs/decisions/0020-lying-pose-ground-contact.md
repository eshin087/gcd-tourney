# 0020. Lying poses touch the floor: packer ground check, per-frame footprint, grounded KO shadow

- Status: Proposed
- Date: 2026-10-10
- Deciders: User, Claude
- Builds on: [0007](0007-art-spec-v2-shippuden-256.md) (art spec v2), [0010](0010-per-character-body-scale.md)
  (per-character body scale), [0012](0012-art-integration-gates-and-hand-anchors.md) (art integration gates)
- Tasks: ENG-066 (engine + packer), TOOL-024 (gate), ART-KO-01 (the redraw, Codex)

## Context

The user reported that a defeated fighter floats instead of lying on the ground. The simulation was correct: the
KO'd body is clamped to the floor (the ring top, or the grass off the ring) and every packed `ko` / `down` frame has
its lowest pixel exactly on the floor line (pivot y 240). The float had three visual causes:

1. **The art.** All four fighters' `ko` and resting `down` frames were drawn from high above (a spread-eagle seen
   from overhead), not from the spec camera (about 12 degrees down). Only one hand or shoe touches y 240; the head
   end hangs 13-36 px (0.1-0.28 world units) above it. The KO frames are also taller than their `bodyHeight`
   (70-97 px against 58-70), because anatomy sidecars bypass the cap. art/SPEC.md only required "the lowest body
   pixel rests on y 240", which these frames meet, so nothing flagged them.
2. **The engine's floor cues assumed an upright body.** The contact blob is a fixed 1.05-unit ellipse at the pivot,
   but a lying sprite is 1.5-2 units long, so its head and feet ends had no contact shadow. The silhouette shadow
   caster faces the sun, so a lying silhouette cast a diagonal smear in front of and below the feet, detached from
   the drawn body.
3. **The ring edge.** The floor under a KO'd body is chosen from its pivot point alone, so a body could come to rest
   with half of its 2-unit sprite hanging over the 0.6-unit drop to the grass, or sunk in the stone lip. The orbiting
   KO camera shows that well.

A fourth, transient cause: Killua's and Naruto's flurry supers and Naruto's Four-Tails mauling zeroed the victim's
velocity after every hit, even after the hit that knocked them out, so the KO launch was erased and an airborne
victim was re-frozen in the air every 7 frames.

## Decision

1. **Measurable lying rule (art/SPEC.md "Lying poses").** `ko` and `down` are drawn **side-on at the spec camera**,
   never from above: head, back, hips and legs rest on y 240 along the body. A resting lying frame passes when at
   least **40 %** of its body columns have their lowest pixel within **6 px** of y 240, no fifth of its length is more
   than **12 px** above it at its lowest, and it is at most **bodyHeight x 1.15** tall (spec v2 px at a 200 px standing
   body, scaled by the character's `standingBodyPx`). The thresholds were tuned on today's art: every top-down `ko`
   and `down[1]` fails (9-34 % contact, a fifth 13-36 px up) and every kip-up start (`getup[0]`) passes (70-91 %,
   at most 6 px). Recheck them against the first side-on redraw.
2. **Packer ground check (warn only).** `tools/pack-sprites.mjs` checks the resting lying frames (`ko` all,
   `down` last, `getup` first) and warns `<anim>: N lying frame(s) float above the floor line (...)`, with the
   measured values. It never drops the animation (the game needs a `ko` and a `down`). For an approved version
   the warning adds "vNN is the approved version: queue a side-on redraw". The JSON report carries the measurements
   (`ground`).
3. **Footprint.** The packer writes `footprint: { "<sheet frame>": [x0, x1] }` into anims.json for every `ko` and
   `down` frame and `getup[0]` (the frame's opaque x span, inclusive cell px). `SheetAsset.footprint(frame)` returns
   it in local world units.
4. **Grounded shadow for lying frames.** When the frame on screen has a footprint and the body is on the floor,
   `SpriteActor.fitShadow` stretches the contact blob along the drawn body (camera-right, mirrored with the facing)
   and turns the silhouette caster with the billboard, so the head and feet ends are grounded and the cast shadow
   runs under the body. Upright frames keep the round blob and the sun-facing caster.
5. **KO edge rule.** A KO'd body on the ring within `KO_EDGE` (1 unit, half the longest lying sprite) of the edge,
   or on the grass within the lip (`RING_LIP`, 0.35) plus `KO_EDGE` of it, keeps sliding outward (at least
   `KO_SLIDE`, 3 units/s) until it lies clear, dropping onto the grass on the way. It never rests across the edge.
6. **Kit fix.** The flurry supers and the Four-Tails mauling stop holding a victim once it is knocked out; the KO
   launch plays out.
7. **The redraw (ART-KO-01).** Codex redraws `ko` (1 frame) and `down` (2 frames) side-on for Naruto, Sasuke and
   Killua (brief: art/scale/KO_DOWN_BRIEF.md); Gojo's come with his build redraw (ART-GOJ-BUILD). Each new version
   still needs the user's `approve vNN`; the ground check must report nothing for it.

## Alternatives considered

- **An engine y offset per frame, or a packer auto-settle** (align the median or mass bottom to the floor).
  Rejected: every frame already has its lowest pixel on the floor, so sinking a frame hides the one touching limb
  under the floor while the head still floats. The existing `frameOffsets` sidecar still allows a manual dy.
- **Laying lying sprites flat as decals**, or tilting the billboard back. Rejected: squashes 70-97 px pixel art to
  about 35-40 px at the KO camera, needs the art's unknown view angle and distorts in the low-res renderer.
- **Hiding the cast shadow for lying frames** and relying on the stretched blob. Simpler; kept as the fallback if the
  camera-aligned caster thins out when the orbiting KO camera is edge-on to the sun.
- **Nudging a KO'd body back onto the ring** instead of sliding it off. Avoids the ring-out look but visibly drags
  the body backward; the user chose the slide.
- **A hard packer failure.** Rejected: the packer's convention is warnings, and the game needs some `ko`.

## Consequences

- Until ART-KO-01 lands, the engine cues reduce but do not remove the float: Naruto's, Killua's and Sasuke's head
  ends still hover visibly at the low victory camera, and a `--strict` pack of the four current fighters exits 2 on
  the ground warnings (expected until the redraw is approved).
- Every new fighter's `ko` and `down` must pass the ground check; the character template and every ANIMATIONS.md
  carry the rule.
- A KO'd body near the edge now ends on the grass a little more often. Its crater (`Game.onKOLanded`, about 20 frames
  after touchdown) is placed where the body is by then, which for a body that landed within `KO_EDGE` of the edge is
  already off the ring, so `Effects.crater` lays every crater on the floor under it: the ring top on the ring, the
  grass off it (before, an off-ring crater hung at ring-top height, which also hit direct ring-out KOs).
- The placeholder bake writes no footprint, so placeholder fighters keep the round blob (optional follow-up: the
  baker can write the same span).
