# Sasuke charge v14 generation provenance

- Status: raw candidate only; not packed, measured against actual atlas, reviewed, or approved.
- Worktree/branch: `.worktrees/art-charge-sasuke` / `art/charge-sasuke`.
- Candidate: `art/characters/sasuke/raw/charge_v14.png` (copied unchanged from the generation output); 2172x724.
- SHA-256: CEE1E0D93999FFBC6D97358D3710A8F3B47F65CA49D64D968AF7D0468482156C
- Approved references attached: `reference/model_sheet.png`, `reference/expressions.png`, `reference/idle_approved.png`.
- Attempt budget: 3/3 image calls used. Attempt 1 generated a result but the wrapper returned only inline image data without a saved-path hint; it was not saved or selected and cannot be hash-verified from this run. Attempt 2 is the candidate below.
- No pack or public output was produced. No scale pass is claimed.

## Attempt 2 prompt

```text
Use case: game-asset. Make one horizontal strip of exactly six full-body game sprites, left to right, for the approved Sasuke character. Inputs: approved model sheet = identity/outfit; approved expression sheet = face; approved idle = precise pixel density, line style, body and footwear proportions. Draw a new strip, not an edit.

Every frame: same lean, pale teen ninja facing screen-right in the same 3/4 view; swept black spiky hair with blue sheen, long cheek bangs, white long-sleeve high stand collar shirt open in a deep V, purple rope belt and rear bow, navy knee-length waist cloth over long navy pants, dark forearm guards, black open-toed sandals. No forehead protector. Straight sword remains sheathed horizontally at small of back; only grip shows behind near hip. Match the approved idle's long legs and full-size footwear. Preserve head-to-body ratio and torso volume. No chibi.

Pixel sprite, crisp hard square clusters, hard stepped contours, flat cel shading, limited palette. Flat pure #FF00FF background. Six cleanly separated cell-like slots, identical scale and pixel density. Full figures visible. Soles on one shared horizontal baseline. All figures fit within their own cell.

The important repair: the crouched power pose must retain believable, full-length lower legs and full-width sandals. Bend both knees naturally, but keep the ankles, calves and feet at the same anatomical scale as the approved idle. Do not compress the legs, hide them under extra cloth, shrink shoes, enlarge the torso, or make the entire figure smaller. The low pose is created through knee flexion and hip drop. Compare each lower-leg segment and shoe visibly to the idle reference while drawing.

Six connected action beats:
f0 gather inhale: obvious deeper knee bend and hip drop, shoulders hunch, chin dips. Right hand rises from lower torso but stops at chest; left arm pulls down/back and clenches.
f1 release: lift chest and head into a stable wide low power stance. Right hand forms a single-hand seal before chin: index and middle fingers together pointing up, other fingers folded. Left arm down/back, fist tight. Red three-tomoe Sharingan; fierce brows and an unmistakably open shouting mouth. Loose hair, rope tails and cloth lift.
f2 hold A: settle into the same power pose as f1, feet planted.
f3 hold B: same locked body and anchors as f2; chest/shoulders rise subtly for an inhale and mouth opens widest; a distinct first upward-flowing hair and cloth shape.
f4 hold C: same locked anatomy, head, hands, hip, knees and feet; return chest height toward f2 and add tiny forearm/finger tension; distinct second cloth/hair shape.
f5 hold D: same fixed pose, shoulders ease 1 px, a fourth cloth/hair shape flows back toward f2 without a pop.

For f2-f5: feet, knee joints, hip, head center, seal and left fist are fixed. Only the breath in chest/shoulders, mouth, tiny fingers and hair/sleeve/rope/cloth updraft vary. Four figures must not be independently redesigned; they are the same figure held in one stance. Make the breath and shout changes legible at sprite size while keeping body pixels/anatomy stable. No jitter, redraw texture, body translation, foot bounce, palette changes or outfit changes. No aura, lightning, sparks, dust, steam, effects, shadow, text, border, gradient, blur, antialiasing, dithering, or painterly texture.
```

## Visual findings

- f0 reads as a gather: lowered head and knees, with the right hand still below the face.
- f1 changes into the two-finger seal and an open shout; the sword remains sheathed.
- f2-f5 keep a stable broad stance with visibly longer lower legs and full sandals than v13. This is a visual correction only; no pixel measurement or strict scale gate has been run.
- f2 and f4-f5 are nearly static; f3 has a wider mouth and a slight hair/cloth change. The requested four-beat breath/updraft is not clearly demonstrated. Keep this as a technical hold pending scale gate and frame-level loop audit.
- Image has crisp-looking stepped outlines at display scale; source quantization/palette and packed alpha are unverified.

## Attempt 3 (final call; unselected, not saved in the project)

- Source output path: E:\Vibe Coding\.codex\generated_images\01a152b7-b8be-7522-81f2-45a72b0ef90f\exec-8ae45693-5501-4302-a789-0d204e684b3d.png
- Dimensions: 2172x724.
- SHA-256: FBA58E88A3D5D093C2A7E98A411369D94E4C2F7FFC5D8F93A905E2CE2CC2BEA7.
- Disposition: unselected and left at the generator output path. It has a clearer deep gather and more visible mouth variation in the held frames than attempt 2, while maintaining long lower legs and full sandals. Attempt 2 remains the sole saved v14 because that versioned file was already created; it was not overwritten or reassigned. Attempt 3 is not packed or treated as a candidate.

### Exact attempt 3 prompt

Generate a six-frame, full-body horizontal sprite strip in crisp pixel art for the same approved Sasuke character in the attached model sheet, expressions and idle. These refs define identity, outfit, anatomy, pixel density and footwear. Keep the sword sheathed horizontally behind the belt. Right-facing 3/4. Pure magenta background. Six separated cells, same pixel scale, full figure, fixed floor line. Match the idle's lean adult proportions, long legs, full width sandals, head and torso ratio. Low stance comes from bent knees and lowered hips; preserve lower-leg segment and shoe size. No chibi.

Charge sequence should read unmistakably: f0 compressed inhale, knees bent, head low, right hand rising only to chest; f1 sharp release into low broad stance, chest lifted, right two-finger hand seal before chin, left fist back/down, red three-tomoe Sharingan, eyes fierce, mouth wide open yelling. f2-f5 are one sustained pose with identical leg, hip, foot, hand, and head positions. Make the four holds visibly different through localized movement only: f2 mouth open-medium, shoulders baseline, hair and rope drift slightly upward; f3 chest and shoulders lift 2px, mouth widest, bangs and rope lift higher; f4 shoulders return, fingers tighten and forearm quivers 1px, hair/cloth stream in a different upward shape; f5 shoulders settle 1px, mouth narrows but remains shouting, cloth and hair curl toward f2's starting shape. Difference must be easy to see at small sprite size, while torso volume and limb anatomy remain fixed. Make f2-to-f5 loop smoothly.

Sasuke identity: pale lean teenager, black swept-back spiky hair with blue sheen and long framing bangs, white open deep-V long sleeve high collar shirt, purple rope belt and bow, navy knee-length waist cloth over navy pants, navy forearm guards, black open-toed sandals. No forehead protector. Sword always sheathed; show short grip behind near hip. No aura, lightning, effects, steam, sparks, dust, shadow, text or border. Flat cel shading and hard stepped pixels only: no blur, antialiasing, gradient, dithering, soft painterly texture, or palette change.
