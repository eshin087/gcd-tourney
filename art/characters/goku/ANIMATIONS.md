# Son Goku: animation brief

Canonical names, counts, phases, timing, and required flags remain those reserved for `goku` in `art/manifest.json` and `src/art/animGuide.js`. This file records Goku-specific posing from [KIT.md](KIT.md). All sprites face screen-right in 3/4 view; maintain identical adult anatomy in every pose. The engine draws all energy effects; do not paint aura, ki, blasts, or beams into sprites.

## Reference gate

The corrected title-style reference v02 is user-approved and is shown beside the four approved neutral cells in `reference/title_style_lineup_v02.png`. The user also approved model sheet v02, expressions v02 and idle v02. These approvals do not extend to other animations. Run v04 and light1 v02 remain held and unchanged. Light2, light3, light4, heavy, airLight1 and airHeavy each have a saved v04 candidate after an extra authorized redraw, and v04 is now user-approved as drawn, with strict scale/clipping warnings retained for technical follow-up; light2 required attempt 5 because the attempt-4 output path was lost. See [REVIEW_ROWS.md](REVIEW_ROWS.md); no core atlas is available for final audit yet.

## Charge (ART-CHARGE)

The six-frame v10 candidate follows [CHARGE_BRIEF.md](../CHARGE_BRIEF.md): f0 gathers in a deep crouch with fists at the hips, then f1 releases into Goku's wide Super Saiyan power stance. f2-f5 hold that stance and loop from frame 2; keep feet, knees and hips fixed, head and fists within 2 px, and vary only the breath, shout, forearms and updraft silhouettes. Timing is 70, 90, 110, 110, 110, 110 ms. The engine supplies aura and other effects; the sprite contains none. v10 is a raw candidate awaiting technical packed-atlas checks and user review; it is not approved.

## Shared combat language

Goku fights with a grounded martial-arts guard, elbows in, fists near chest and face, and a measured forward lean. His attacks use compact, direct fist and kick paths, with cloth following the torso turn. Keep golden Super Saiyan hair in every pose, including down and KO. Preserve the same head, torso, limb lengths, shoulder width and clothing volume; poses may change their bounding box but never their anatomy.

## Kit-specific animation poses

- `special` (Ki Blast Volley, 8 frames, phases 3/3/2): draw both palms back to the near hip; active frames thrust open palms straight forward, alternating near/far/near, body squared and shouting; recover to guard. Hand is the engine effect anchor.
- `specialForward` (Dragon Fist, 7 frames, phases 2/2/3): deep stance, near fist chambered and far hand forward; active lunge with near arm fully extended at chest height and rear leg straight; step back to guard. Fist is the effect anchor.
- `specialUp` (Rising Kick, 6 frames, phases 2/2/2): crouch, rise into a high front kick, then flip forward; final pose flows into `airHeavy` frame 00.
- `specialDown` (Instant Transmission, 4 frames, phases 2/1/1): upright and calm, eyes closed, near index and middle fingers at forehead; other arm relaxed. The engine handles the vanish; `light4` supplies the kick.
- `superPose` (Kaio-ken Rush, 4-frame loop): wide stance, fists clenched at sides, head back and shouting. Engine supplies red aura.
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

## Directional normals (ENG-112)

| Animation | What this fighter does |
|---|---|
| fTilt | A compact step-in straight punch at chest height, with the far fist guarding the face. |
| uTilt | A rising near-arm uppercut arc from in front of the face to above the golden hair. |
| dTilt | A low crouching shin sweep with the near leg; keep the torso and guard low. |
| dashAttack | A running lunge that turns into a forward side kick, carrying the body forward. |
| fSmash | Frame 01 is the deep held charge with the near fist chambered; then a full-body step-in straight punch at chest height and a balanced recovery. |
| uSmash | From a crouch, drive the near fist upward in a powerful rising uppercut, finishing over the head. |
| dSmash | A low spinning leg sweep that reaches both sides at shin height on the active frames. |
| fair | A compact forward mid-air kick at body height, toes aimed toward the opponent. |
| bair | A sharp mid-air back kick striking toward screen-left behind Goku while his body faces right. |
| uair | A rising mid-air heel kick straight overhead, with a controlled return to the aerial guard. |
