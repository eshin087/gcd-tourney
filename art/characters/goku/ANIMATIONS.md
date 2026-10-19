# Son Goku: animation brief

Canonical names, counts, phases, timing, and required flags remain those reserved for `goku` in `art/manifest.json` and `src/art/animGuide.js`. This file records Goku-specific posing from [KIT.md](KIT.md). All sprites face screen-right in 3/4 view; maintain identical adult anatomy in every pose. The engine draws all energy effects; do not paint aura, ki, blasts, or beams into sprites.

## Reference gate

The corrected title-style reference v02 is user-approved and is shown beside the four approved neutral cells in `reference/title_style_lineup_v02.png`. The user also approved model sheet v02, expressions v02 and idle v02. These approvals do not extend to other animations. Run v04 and light1 v02 remain held and unchanged. Light2, light3, light4, heavy, airLight1 and airHeavy each have a saved v04 candidate after an extra authorized redraw, and v04 is now user-approved as drawn, with strict scale/clipping warnings retained for technical follow-up; light2 required attempt 5 because the attempt-4 output path was lost. See [REVIEW_ROWS.md](REVIEW_ROWS.md); no core atlas is available for final audit yet.

## Shared combat language

Goku fights with a grounded martial-arts guard, elbows in, fists near chest and face, and a measured forward lean. His attacks use compact, direct fist and kick paths, with cloth following the torso turn. Keep golden Super Saiyan hair in every pose, including down and KO. Preserve the same head, torso, limb lengths, shoulder width and clothing volume; poses may change their bounding box but never their anatomy.

## Kit-specific animation poses

- `special` (Ki Blast Volley, 8 frames, phases 3/3/2): draw both palms back to the near hip; active frames thrust open palms straight forward, alternating near/far/near, body squared and shouting; recover to guard. Hand is the engine effect anchor.
- `specialForward` (Dragon Fist, 7 frames, phases 2/2/3): deep stance, near fist chambered and far hand forward; active lunge with near arm fully extended at chest height and rear leg straight; step back to guard. Fist is the effect anchor.
- `specialUp` (Rising Kick, 6 frames, phases 2/2/2): crouch, rise into a high front kick, then flip forward; final pose flows into `airHeavy` frame 00.
- `specialDown` (Instant Transmission, 4 frames, phases 2/1/1): upright and calm, eyes closed, near index and middle fingers at forehead; other arm relaxed. The engine handles the vanish; `light4` supplies the kick.
- `superPose` (Spirit Bomb since 2026-10-18, 4-frame loop): both arms raised high in a V, palms to the sky, head back; see [SKILLS_REVAMP.md](SKILLS_REVAMP.md) B3, which also briefs `specialForward`, `specialDown`, `specialUp`, `throw` and `intro`. Kaio-ken is a mode now and plays in `charge`.
- `beamCharge` (3-frame loop): side-on stance, knees bent, both cupped hands at rear hip. `beamFire` (3-frame loop): both arms thrust forward, wrists together and palms open, front knee bent. Hands mark the beam origin.
- `intro`: arms folded or calm guard, confident smile. `taunt`: beckon with near hand. `win`: relaxed smile, one fist raised.

## Other canonical animations

Use the corresponding generic action and timing in `art/manifest.json`; Goku's martial-arts style, outfit, anatomy, and right-facing orientation remain fixed. No new animation names are introduced.

- Locomotion: `idle`, `run`, `dash`, `backDash`, `superDash`, `jumpSquat`, `jumpUp`, `jumpFall`, `land`, `wallTech`.
- Ground attacks and variants: `light1`, `light1Alt`, `light2`, `light2Alt`, `light3`, `light3Alt`, `light4`, `light4Alt`, `heavy`, `heavyAlt`.
- Air attacks and variants: `airLight1`, `airLight1Alt`, `airLight2`, `airLight2Alt`, `airLight3`, `airLight3Alt`, `airHeavy`, `airHeavyAlt`.
- Defense and reactions: `guard`, `block`, `hurtHigh`, `hurtHighAlt`, `hurtLow`, `hurtLowAlt`, `launched`, `down`, `getup`, `ko`, `techGround`, `techRoll`, `wallTech`.
- Throws, specials and presentation: `throw`, `special`, `specialForward`, `specialUp`, `specialDown`, `beamCharge`, `beamFire`, `charge`, `superPose`, `intro`, `taunt`, `win`.

The exact canonical manifest list is authoritative where optional entries differ. Attack alternatives must use a distinct limb or technique while staying in the base move's contact zone and returning to its recovery pose.
