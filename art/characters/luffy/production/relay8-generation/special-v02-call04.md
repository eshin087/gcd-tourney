# Luffy special v02 — authorized source call 4

Status: FAILED before image generation; no source output or candidate v02. Authorization: user decision relayed by Claude, relay #8: “Fix down, Fix getup, Fix special (4th call)”. This explicitly authorized one additional special source call, cumulative call 4/4. The previous call 3/3 is preserved and unusable for recovery; no retry is authorized this round. This is not art approval.

Prior call count: 3/3; after this call 4/4. Candidate version: v02 (inventory checked across raw, _parts, _qa_hold, _rejected, and REVIEW_ROWS; no v02 candidate exists. The recovered prior call is preserved under production/recovered-special-v02/ as source evidence, not a candidate).

Input image roles and SHA-256:

- Approved identity/style reference `reference/title_style_draft.png`: `1b7717c259a4da07a512508d702a6bd5775bdfc4298b4f1c3fcc671d283cb963`.
- Approved character/model reference `reference/model_sheet.png`: `c81bbe79608f291b70c8146a5ec3e95833d2c786470c7de05dc022902103e0cb`.
- Approved face reference `reference/expressions.png`: `cc214ac79f5eb453ac62b33db43b6e8585a87c85ecd083b25485828e2b70e700`.
- Approved pose reference `reference/idle_approved.png`: `b11ae08cddc02bd2be95a21663f0dfba993d2743c356a7a346dfdd00d7cecb4b`.
- Existing held strip/correction target `raw/_qa_hold/special_v01.png`: `df4bda5a14e459392d04bbc792716d32c034b002fa1eac1b836f0a0a12589ea2`.
- Immutable original special frames 0–5 source `raw/_parts/special_v01_A.png`: `7ec7381d83ca597c9e91f6c05bc7390c241a0fc24befa9a77e506828d1a55ceb`.

## Exact prompt

Use case: stylized-concept
Asset type: two-frame raw pixel-art recovery continuation for Luffy Gum-Gum Pistol
Primary request: Draw exactly two new sequential poses for special frames 6 and 7 only. Frame 5 in the continuity source is the fully extended anatomical arm punch. Frame 6 must visibly retract that same stretched arm halfway toward the torso, with a continuous shoulder-to-elbow-to-wrist-to-fist anatomy chain. Frame 7 is the complete upright recovery: the stretched arm is fully back to normal length and Luffy has returned to a compact fighting guard. These two distinct poses must visibly complete the motion from the prior extended punch; do not substitute two guard or attack poses.
Input images: Image 1 approved title-style anatomy/style reference; Image 2 approved Luffy model design; Image 3 approved face reference; Image 4 approved idle/fighting-guard density and pose reference; Image 5 the current held full special strip, showing the identity and action but including the unusable recovery; Image 6 the immutable original six-pose special source (frames 0–5), used solely as exact design/pose continuity reference. Do not redraw, replace or add frames 0–5; only create the two continuation poses requested here.
Scene/backdrop: flat pure magenta #FF00FF, no ground plane or shadow.
Subject: the same young lean wiry pirate Luffy from the references, messy black hair, small scar under left eye, straw hat, open red sleeveless vest, blue rolled-cuff shorts, yellow sash and brown sandals.
Style/medium: hard-edged detailed pixel art matching the approved references and source part A; same restrained cel shading and color relationships; no smoothing.
Composition/framing: exactly two separate full-body 256×256 conceptual cells arranged horizontally, equal pixel density across both. Face screen-right in 3/4 view; preserve the thin torso, build, leg and clothing volume of the approved identity. In f6 the previously stretched near arm is still visibly longer than normal but about halfway retracted; keep the entire hand and fist intact and within cell bounds. In f7 both arms are at normal length in a compact upright guard; this is the recovery endpoint, not another attack. Hat stays on head. Keep all anatomy inside the conceptual cells with 4px horizontal safety; feet grounded on y=240. Do not enlarge or shrink individual poses to their bounding boxes. Match the established source-A body density; later assembly will fit only the new two-frame part to the unchanged source-A landmarks.
Lighting/mood: consistent simple cel shading, no new lighting effects.
Color palette: match the same skin, vest, shorts, sash, straw, hair and sandal colors in the approved model/source references.
Constraints: exactly two new recovery poses, and only f6/f7; show the action transition clearly; preserve all prior source-A frame pixels unchanged during later assembly. The stretched arm is anatomy. No beam, projectile, detached giant fist, steam, smoke, aura or motion-line pixels.
Avoid: repeated guard poses, extra attacks, extra frames, a detached fist, missing hand/fingers or arm segments, altered Luffy build/outfit, cropped limbs, other characters, text, watermark, gradients, blur, antialiasing or panel labels.

Attempt outcome: the built-in imagegen interface rejected the invocation before generation because `referenced_image_paths` exceeded its maximum of five (this prompt supplied six). No image was generated or returned, so there is no call ID, savedPath, image hash, or candidate to inspect. The failed attempt is counted as the authorized 4/4 under the cumulative-attempt rule. No retry is made because the relay explicitly authorizes exactly one call and forbids retries this round. Special v01 remains held; a future correction requires new user authorization.
