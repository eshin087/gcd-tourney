# Sasuke approved-neutral full redraw — 2026-10-11

## Active authorization and source hierarchy

The user explicitly approved the latest neutral cast study and Sasuke height_neutral v01 on 2026-10-11 and authorized all 42 animations. This supersedes the historical model/idle stops and old 7-head/8-percent targets below. No newly generated animation is approved. Keep idle_approved.png unchanged; use the new idle only as a provisional continuity anchor. Claude alone integrates, merges and publishes production. Worktree art-sasuke-proportions; port 5213.

Approved source: reference/height_neutral_v01.png, copied exactly to reference/height_neutral.png. The sibling prompt retains its generation-time candidate wording as provenance; this section records the subsequent user approval. Approved neutral anatomy governs skeleton/head/hair/body ratios. Existing fixed model and expressions establish identity only; latest four-pose sample is secondary pose guidance.

## Scale contract (lead finalized 2026-10-11)

Use ONE common pixels-per-centimetre factor for the cast, with Sasuke 168 cm; no character cap, child discount or independent pose fill. Neutral source skull crown estimate y165, uncertainty +/-10 source pixels; shoe soles establish standing skeleton. Infer chin independently under hair; never equate the hair bounding box with skull height. Preserve neutral head-to-body ratios rather than force earlier 7-head preferences. Final cell256, floor240, pivot[128,240], ppu128 remain unless Claude changes tooling. Common K=233/242=0.9628099173553719 multiplies ALL approved neutral targets. Sasuke skull-to-sole target194.88200736831624px; source963px (soles1128 minus inferred crown165); source-to-game factor0.2023696857417614. Visual neutral chin estimate y286 +/-10; inferred skull121 +/-14px gives provisional target24.49 +/-2.84px. Hidden crown uncertainty prevents false precision. Confirm matching landmarks on every generated part before anatomical sidecar.

SCALE LOCK prompt: Match the attached approved neutral's head, hair, shoulders, torso, hands, feet and limb lengths exactly, in one constant anatomical scale throughout the strip. Bending and perspective change visible bounds, never character size. Do not enlarge each pose to fill its slot. Keep hair mass stable through head rotation. Use supplied numeric source/target skeleton and crown-to-chin calibration after the shared production contract is finalized.

## Production inventory

42 animations /175 frames. Next versions inspected recursively in character folders including parts/rejected and Sasuke REVIEW links; existing versioned files remain immutable. Recheck before saving if concurrency changes state.

| Animation | Frames | Frame list | Next version |
|---|---:|---|---|
| idle | 8 | f0-f7 | v05 |
| run | 8 | f0-f7 | v03 |
| dash | 2 | f0-f1 | v02 |
| backDash | 3 | f0-f2 | v02 |
| superDash | 2 | f0-f1 | v02 |
| jumpSquat | 1 | f0-f0 | v02 |
| jumpUp | 2 | f0-f1 | v02 |
| jumpFall | 2 | f0-f1 | v02 |
| land | 2 | f0-f1 | v02 |
| light1 | 7 | f0-f6 | v03 |
| light2 | 7 | f0-f6 | v03 |
| light3 | 7 | f0-f6 | v03 |
| light4 | 8 | f0-f7 | v02 |
| heavy | 8 | f0-f7 | v07 |
| airLight1 | 5 | f0-f4 | v02 |
| airLight2 | 5 | f0-f4 | v03 |
| airLight3 | 6 | f0-f5 | v02 |
| airHeavy | 6 | f0-f5 | v03 |
| guard | 2 | f0-f1 | v02 |
| block | 2 | f0-f1 | v02 |
| hurtHigh | 3 | f0-f2 | v03 |
| hurtLow | 3 | f0-f2 | v02 |
| launched | 2 | f0-f1 | v02 |
| spin | 4 | f0-f3 | v02 |
| airRecover | 3 | f0-f2 | v02 |
| down | 2 | f0-f1 | v02 |
| getup | 5 | f0-f4 | v02 |
| charge | 4 | f0-f3 | v05 |
| throw | 4 | f0-f3 | v02 |
| beamCharge | 3 | f0-f2 | v02 |
| beamFire | 3 | f0-f2 | v02 |
| vanish | 2 | f0-f1 | v02 |
| stagger | 4 | f0-f3 | v02 |
| ko | 1 | f0-f0 | v03 |
| special | 8 | f0-f7 | v04 |
| intro | 4 | f0-f3 | v02 |
| taunt | 2 | f0-f1 | v02 |
| win | 4 | f0-f3 | v02 |
| specialForward | 7 | f0-f6 | v03 |
| specialUp | 6 | f0-f5 | v03 |
| specialDown | 4 | f0-f3 | v02 |
| superPose | 4 | f0-f3 | v02 |

## Prompt and acceptance rules

Use canonical per-frame blocks from PROMPTS.md, latest KIT.md for heavy/specials/Kirin, and KO_DOWN_BRIEF.md for grounded side-on ko/down. Replace old PROPORTIONS/SCALE/SIZE with the active neutral contract. Right-facing three-quarter view except prescribed side-on lying poses. White open shirt, dark navy cloth/pants/guards, rear purple rope bow, sword always sheathed; no baked effects. Flat magenta background, crisp pixels, at most48 colours after packing. Long strips use parts with at most5 poses each and measured stitching. Maximum3 attempts per image, save best only at next immutable version.

Idle first establishes a provisional candidate continuity anchor; never copy it to idle_approved.png without user approval. Subsequent candidates can be generated under the explicit full-batch authorization. Packing exit0 and each new non-idle strip ok are required before review, alongside heads and cast lineup. Packer labels idle ref and excludes it from strict matching; independently measure its head/anatomy and frame variation, and report this limitation honestly. No fake ok, baseline acceptance, blanket exemptions, source-pixel stretching or tools edits. Only demonstrated probe misreads justify a written version-scoped exemption.

Lying poses: side-on low camera, head screen-left, feet screen-right, back/head/hips/heels on one floor; at least40 percent columns within6px of floor, no fifth above12px; preserve anatomy and bend knees only as necessary to fit. Do not shrink individual poses. Record clipping/contact failures as blockers.

## Lessons carried forward

- A posed silhouette is not standing height. Calibrate upright source skeleton first, then preserve its anatomy through animation.
- Hair is not skull. Report inferred crown/chin uncertainty, plus independent silhouette stability.
- Idle self-comparison is not proof of correct anatomy; previous v03 and v04 showed opposite head-size errors despite pack exit0.
- A shared factor preserves relative cast stature; separate caps and pose fitting destroy it.
- Separate approved references, provisional continuity anchors and generated candidates in records and prompts.
- Quantization does not establish source pixel quality; inspect packed faces, outlines, palette and floor contacts.

---

# Historical brief and evidence (superseded targets and approval sequence)

# Sasuke proportion redraw

User direction 2026-10-10. Branch art/sasuke-proportions; port 5213. Claude alone integrates, merges, deploys production and edits main.

## Targets and invariants

| Measure | Current nominal | Target |
|---|---:|---:|
| Standing skeleton | 200 px | 200 px unchanged |
| Heads tall | 6.45 | about 7 |
| Skull crown to chin excluding hair | 31 px | 28.57 px |
| Head and hair linear scale | 1 | about 0.922 |
| Deltoid width in comparable 3/4 pose | about 60 px | unchanged, about 60 px (DR 0.30) |
| Build class | athletic teen | unchanged |
| Source multiplier | declared 2x | 2x; 400 px standing skeleton |

Face identity, hair pattern, costume, colors, body build, sword, limb lengths, facing, 256 px cells, [128,240] pivot and ppu 128 remain. Approximate nominal values are generation targets, not measured guarantees. The old sheet was previously estimated 7.3 heads in its review; the user's requested visual correction is judged against the packed cast, not that unreliable old estimate.

## Approval stages

1. Generate only model_sheet v02 and its cast lineup. STOP for explicit user approval. Never promote the fixed model reference before approval.
2. After model approval, new idle with lineup and heads evidence. STOP again for idle approval.
3. Only after idle approval redraw all 42 animations below against that new approved idle. This replaces Sasuke SCALE_FIX_BRIEF Batch 3 and KO_DOWN_BRIEF work. Preserve current poses/timings; KIT.md latest heavy and Kirin details take precedence over older prompt descriptions.
4. Every strip must pass node tools/pack-sprites.mjs sasuke --quantize 48 with exit 0 and strip ok; attach heads and lineup. Exempt only a demonstrated probe misread with version and reason. Update Sasuke nominal-heads row in CHARACTER_SCALE.md with the approved baseline, not during this pending model-only stage.

## Full frame list

Canonical manifest inventory: 42 animations, 175 frames. Next versions must be rechecked in raw, parts, rejected and REVIEW at execution time.

| Animation | Frames | Frame indices | bodyHeight unchanged | Current newest |
|---|---:|---|---:|---|
| idle | 8 | f0-f7 | 204 | v01 |
| run | 8 | f0-f7 | 204 | v02 |
| dash | 2 | f0-f1 | 160 | v01 |
| backDash | 3 | f0-f2 | 207 | v01 |
| superDash | 2 | f0-f1 | 120 | v01 |
| jumpSquat | 1 | f0-f0 | 162 | v01 |
| jumpUp | 2 | f0-f1 | 198 | v01 |
| jumpFall | 2 | f0-f1 | 209 | v01 |
| land | 2 | f0-f1 | 174 | v01 |
| light1 | 7 | f0-f6 | 204 | v01 |
| light2 | 7 | f0-f6 | 204 | v02 |
| light3 | 7 | f0-f6 | 215 | v02 |
| light4 | 8 | f0-f7 | 207 | v01 |
| heavy | 8 | f0-f7 | 218 | v06 |
| airLight1 | 5 | f0-f4 | 198 | v01 |
| airLight2 | 5 | f0-f4 | 207 | v02 |
| airLight3 | 6 | f0-f5 | 201 | v01 |
| airHeavy | 6 | f0-f5 | 198 | v02 |
| guard | 2 | f0-f1 | 198 | v01 |
| block | 2 | f0-f1 | 204 | v01 |
| hurtHigh | 3 | f0-f2 | 195 | v02 |
| hurtLow | 3 | f0-f2 | 183 | v01 |
| launched | 2 | f0-f1 | 136 | v01 |
| spin | 4 | f0-f3 | 160 | v01 |
| airRecover | 3 | f0-f2 | 180 | v01 |
| down | 2 | f0-f1 | 96 | v01 |
| getup | 5 | f0-f4 | 204 | v01 |
| charge | 4 | f0-f3 | 198 | v04 |
| throw | 4 | f0-f3 | 201 | v01 |
| beamCharge | 3 | f0-f2 | 230 | v01 |
| beamFire | 3 | f0-f2 | 198 | v01 |
| vanish | 2 | f0-f1 | 221 | v01 |
| stagger | 4 | f0-f3 | 207 | v01 |
| ko | 1 | f0-f0 | 64 | v02 |
| special | 8 | f0-f7 | 204 | v03 |
| intro | 4 | f0-f3 | 210 | v01 |
| taunt | 2 | f0-f1 | 212 | v01 |
| win | 4 | f0-f3 | 212 | v01 |
| specialForward | 7 | f0-f6 | 204 | v02 |
| specialUp | 6 | f0-f5 | 214 | v02 |
| specialDown | 4 | f0-f3 | 204 | v01 |
| superPose | 4 | f0-f3 | 208 | v01 |

## S1 model-sheet prompt

Attach only approved model_sheet.png and expressions.png.

```text
Character model sheet for a hi-res pixel-art 2D anime arena fighting game (anime fan-art).
CHARACTER: the pale black-haired teenage ninja in the attached approved model sheet, about 16 years old, drawn as an anime fan-art sprite: a lean, pale young man with a cold, calm, precise air. Black hair with a dark-blue sheen: spiky and swept back at the back of his head, long bangs framing both sides of his face down past the jaw, a few strands falling between his sharp, narrow dark eyes. NO forehead protector. A white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, a small red-and-white round fan crest on the back of the collar. A thick purple rope belt wrapped around his waist and tied in a big bow at the back. A dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants. Dark navy arm guards on his forearms (the white sleeves end under them). Black open-toed ninja sandals. A straight sword in a black sheath tucked horizontally through the rope belt at the small of his back, its dark grip past his right hip; the sword always stays sheathed.
PROPORTIONS: about 7 heads tall, serious teenage anime proportions, lean athletic teenage build, long legs (the crotch at about half his height), small head, defined but narrow shoulders, long neck under the collar; serious, cold tone. Not chibi, not super-deformed, no big head, no oversized hands or feet, not western-realistic.

Draw the same character 5 times in one row on a 1536x1024 landscape canvas, all at exactly the same scale, standing on one shared baseline, with clear gaps between them:
1. FRONT view, relaxed neutral stand, arms slightly away from the body, facing the viewer (the sword grip shows beside his right hip, the sheath tip beside his left hip);
2. 3/4 view facing RIGHT (body turned about 35 degrees toward the viewer, head turned a bit more so both eyes show), relaxed neutral stand: this is the main game view;
3. TRUE SIDE PROFILE facing RIGHT: turned exactly 90 degrees, only ONE eye visible, nose, lips and chin in silhouette pointing straight to the right, the far arm and leg hidden behind the near ones, the long bangs and back spikes in profile; NOT a 3/4 view;
4. BACK view: the spiky back of his hair, the small red-and-white round fan crest on the back of the collar, the sheathed sword lying horizontally across the small of his back, tucked through the rope belt, with the big purple bow knot over the middle of the sheath;
5. 3/4 view facing RIGHT in his fighting stance: low and compact, knees bent, left foot forward, right foot back, left hand forward at chin height as an open knife-hand, right fist in front of his chest, cold narrow-eyed stare.
Below the figures, one row of 34 small square color swatches (no text), one per palette color, in the palette order listed below.
Show clearly in every view: no forehead protector; long bangs framing both sides of the face; the tall white collar open in a deep V with his chest showing; long white sleeves ending under the dark navy forearm guards; the purple rope belt and its bow; the knee-length navy waist cloth over navy pants; black open-toed sandals; the sword sheathed at the back of the belt.
SIZE: each pose is cut into a 256x256 game sprite where the standing body is about 200 px tall: draw hi-res pixel art with roughly three times the detail of a classic 16-bit fighting-game sprite. On this sheet draw at 2x: every art pixel is a 2x2 block, so the standing body (soles to top of the skull) is about 400 px tall on the canvas (the skull crown to chin about 57.14 px, excluding hair), the hair on top of that.
SCALE LOCK: standing skeleton stays 200 px from soles to skull crown; skull crown to chin is 200 / 7 = 28.57 px excluding hair (formerly nominal 31 px). Head AND hair silhouette linear dimensions approximately 0.922 of the old nominal baseline, about 8% smaller. Source multiplier exactly 2x: 400 px standing skeleton, 57.14 px skull crown to chin. Preserve torso width, shoulders, chest, limb thickness and lengths, hands and feet. No lankier or thinner body. Constant anatomical scale in every view and pose; bending changes pose bounds, never camera distance. Keep hair design and face identity, only reduce their scale. Never scale to fill a slot.
CHANGE: attached model and expression sheets are identity/color references. The old sheet did not obey the declared 2x source size; redraw at the stated 400 px standing skeleton, leaving generous magenta space. Preserve all five views, costume, sheathed sword, white collar, purple rope, cold face and athletic body build. The fifth stance may be shorter because of bent knees.
STYLE: crisp hard-edged hi-res pixel art. No anti-aliasing, no blur, no gradients, no dithering, no noise, no glow, no painterly texture. 1-pixel dark outline (#141018) around the silhouette, darker same-color lines inside. 4 to 5 tone cel shading with clear anatomy and cloth-fold planes (cheekbones, jaw, collarbones and the open chest, knuckles, shirt, sleeve and waist-cloth folds, rope twists), key light from the upper right (the character's front). Smear frames are solid shapes, never motion blur.
PALETTE (use only these 34 colors): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a #9c6450; hair #6a78a8 #4a5684 #2e3556 #1e2032 #0e0f18; eyes #2c2c40; Sharingan and crest red #d81e28 #7c0c16; mouth #5a1a22; white shirt #ffffff #f4f2f8 #e2dfec #bdb7d0 #928ca8; purple rope belt #c4a2ec #9a72d2 #6a46a6 #432a72; navy waist cloth, pants and arm guards #4a64ac #2e4282 #1a2650 #10173a; black sandals and sword sheath #4a4c62 #2e3044 #1e1f2e; steel sword fittings #e4eaf4 #b8c2d2 #76829a.
BACKGROUND: flat solid magenta #FF00FF behind everything (never use magenta on the character). No text, no labels, no ground shadow, no floor, no effects.
```

## Animation prompt replacement blocks (after approvals)

Apply this complete replacement PROPORTIONS and SCALE LOCK block to every A01-A42 prompt from PROMPTS.md; retain its exact frame-by-frame pose, timing, view and palette blocks, with latest KIT.md corrections. Attach newly approved model_sheet.png, expressions.png (identity only), and idle_approved.png after the idle gate.

```text
PROPORTIONS: about 7 heads tall; serious athletic teenage anime build. Same shoulder width, chest, arm and leg thickness as the approved model sheet. Small head and compact hair mass, cold sharp face and original hair design. Never thin the body to compensate for the head.
SCALE LOCK: standing skeleton stays 200 px from soles to skull crown; skull crown to chin is 200 / 7 = 28.57 px excluding hair (formerly nominal 31 px). Head AND hair silhouette linear dimensions approximately 0.922 of the old nominal baseline, about 8% smaller. Source multiplier exactly 2x: 400 px standing skeleton, 57.14 px skull crown to chin. Preserve torso width, shoulders, chest, limb thickness and lengths, hands and feet. No lankier or thinner body. Constant anatomical scale in every view and pose; bending changes pose bounds, never camera distance. Keep hair design and face identity, only reduce their scale. Never scale to fill a slot.
MATCH: the newly approved model sheet and idle determine proportions; expressions determine face only, not head size.
```

## Lying-pose prompt override (ko and down)

```text
VIEW: side-on from the same approximately 12-degree-down camera as idle, never overhead. Head screen-left, feet screen-right. FLOOR CONTACT: back of head, shoulder blades, back, hips, backs of legs and heels rest on one horizontal baseline; limp arms on the floor. Far limbs at most 8 final pixels higher. Flat, about three times wider than tall. Same new approved idle head scale; body length roughly 205-225 px. ko height at most64 px; down f0 at most96 px, f1 copies ko. Keep inside x4..251; bend a knee rather than shrink the body.
SCALE LOCK: standing skeleton stays 200 px from soles to skull crown; skull crown to chin is 200 / 7 = 28.57 px excluding hair (formerly nominal 31 px). Head AND hair silhouette linear dimensions approximately 0.922 of the old nominal baseline, about 8% smaller. Source multiplier exactly 2x: 400 px standing skeleton, 57.14 px skull crown to chin. Preserve torso width, shoulders, chest, limb thickness and lengths, hands and feet. No lankier or thinner body. Constant anatomical scale in every view and pose; bending changes pose bounds, never camera distance. Keep hair design and face identity, only reduce their scale. Never scale to fill a slot.
```

Follow KO_DOWN_BRIEF frame tables: ko f0 eyes closed mouth slightly open, sword grip near hip and waist cloth flat; down f0 small impact bounce, f1 settled on the same contact line. Ground gate: >=40% columns within6 px of floor, no fifth more than12 px above floor.

## Acceptance and follow-up

Review five views, true profile, reduced head/hair against unchanged body; actual source scale and raw palette must be measured and deviations reported. Candidate lineup uses measured skeleton scale, never visual guessing. No model-sheet packer scale-gate claim: it only tests animation strips. Review references do not change live game sprites. After future redraws remeasure hitboxes and anchors, preserve contact zones, run pack, scale, lineup and build and perform game QA before asking Claude to merge.
