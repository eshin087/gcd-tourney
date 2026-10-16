# Luffy getup v02 — authorized source call 2

Status: RETURNED source preserved; candidate assembly and QA pending. Authorization: user decision relayed by Claude, relay #8: “Fix down, Fix getup, Fix special (4th call)”. This authorizes exactly one getup call this round, taking cumulative calls from 1/3 to 2/3; no retry is authorized this round and it does not approve art.

Prior call count: 1/3. Candidate version: v02 (inventory checked across raw, _parts, _qa_hold, _rejected, and REVIEW_ROWS; no v02 exists).

Input image roles and SHA-256:

- Approved identity/style reference `reference/title_style_draft.png`: `1b7717c259a4da07a512508d702a6bd5775bdfc4298b4f1c3fcc671d283cb963`.
- Approved character/model reference `reference/model_sheet.png`: `c81bbe79608f291b70c8146a5ec3e95833d2c786470c7de05dc022902103e0cb`.
- Approved face reference `reference/expressions.png`: `cc214ac79f5eb453ac62b33db43b6e8585a87c85ecd083b25485828e2b70e700`.
- Approved pose reference `reference/idle_approved.png`: `b11ae08cddc02bd2be95a21663f0dfba993d2743c356a7a346dfdd00d7cecb4b`.
- Correction target `raw/_qa_hold/getup_v01.png`: `d4d5c2dd91c5adce01278cf69c83e9b4dfa3e9a02937b733ec8c3a7b7616971e`.

## Exact prompt

Use case: stylized-concept
Asset type: five-frame raw pixel-art fighting-game get-up strip for Enies Lobby Luffy
Primary request: Create exactly five sequential full-body sprite poses showing the same Enies Lobby Luffy recovering from lying on the ground and returning to his compact fighting guard. Keep all five poses recognizable as one continuous get-up action. Correct the excessive left-right span and 8px floor-contour gap in the old frame 0; explicitly make frame 3 a physically supported rise, not a floating or kick pose.
Input images: Image 1 approved title-style anatomy/style reference; Image 2 approved Luffy model/design reference; Image 3 approved facial reference; Image 4 approved eight-frame idle/guard density reference; Image 5 the current held five-frame get-up strip, for pose order and correction targets only. Use the approved references for character identity and body anatomy. Do not copy the clipped or unsupported geometry in Image 5.
Scene/backdrop: flat pure magenta #FF00FF, no ground shadow or floor drawing.
Subject: one young lean wiry pirate, open red sleeveless vest, blue knee-length rolled-cuff shorts, yellow sash, brown straw sandals, messy black hair, straw hat with red band and small scar under left eye.
Style/medium: same hard-edged, discrete-pixel finish and restrained cel shading as the approved Luffy references; preserve thin torso and natural limb volume.
Composition/framing: exactly five equal-width panels in one horizontal row, one full figure per panel, facing screen-right in 3/4 view. Keep one consistent pixel density across all five poses. No body part may cross its panel boundary; leave at least 4px horizontal clearance within each conceptual 256×256 cell. Every lowest body pixel touches the same y=240 floor/pivot line. Frame 0: compact side-lying pose with hips/knees bent enough for the whole silhouette to fit safely; do not stretch or shrink the whole body. Frame 1: roll up onto elbow and forearm, legs still supported on ground. Frame 2: both hands and one bent knee support the torso. Frame 3: raise the torso into a low supported kneel/crouch, with the supporting arm and planted foot clearly bearing weight and all limbs fully drawn; do not jump, float, or foreshorten the supporting limb. Frame 4: compact return to the approved fighting guard. Maintain head, torso, arm, leg, sash, shorts and sandal proportions across poses; only articulation and perspective may change. Hat remains worn.
Lighting/mood: restrained cel shading consistent with the references.
Color palette: use the exact established red vest, blue shorts, yellow sash, warm skin, straw and brown sandal colors from the model reference.
Constraints: exactly five poses and no extras; preserve Enies Lobby identity and approved build. Fix frame 0's approximately 269px old visible width by a compact articulated pose, not global scaling. Maintain continuous floor contact across all five frames. Inspect frame 3 support geometry explicitly. No cropping, duplicated limbs, extra person, text or watermark.
Avoid: a standing-height lying pose, an unsupported airborne f3, fully extended legs that exceed the safe panel, altered body proportions, cropped hat/hands/sandals, effects, motion lines, gradients, blur, anti-aliasing, translucent pixels, shadows or panel labels.

Call start: `2026-10-16T06:30:32.415Z`; return: `2026-10-16T06:30:57.338Z`. The imagegen tool did not expose a separate call ID; unique returned filename is `exec-fef14b6a-63c8-4f88-a8bd-805df21d208d.png`.

- Exact returned source: `E:\Vibe Coding\.codex\generated_images\01a13b02-1fa9-7633-a85b-094064bb6f4e\exec-fef14b6a-63c8-4f88-a8bd-805df21d208d.png`.
- Preserved copy: `production/generation-source/getup_v02_call02_returned-source.png`, 1,559,676 bytes, SHA-256 `674be6dfc0e3cda4546201392d5b0664681565e8d80cd28d8724276631611127`; copy hash matches returned source.
- The first local copy command used a mistyped generated-images directory suffix and failed to find the file; no asset was written. The exact path above was then copied successfully from the imagegen return metadata; there was no second image-generation call.
- Visual inspection: five coherent poses in the requested order, and f3 is visibly supported by a hand and planted leg. Frame 0 appears compact but still needs exact crop and packed-width/ground-contact measurement. No whole-strip fit, calibration pass, or approval is claimed yet.
- No further getup generation call is authorized this round.
