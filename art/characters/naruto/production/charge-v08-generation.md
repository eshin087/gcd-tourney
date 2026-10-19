# Naruto charge v08 generation record

Date: 2026-10-18. Candidate budget: 3 image-generation calls, exhausted. Generation directed under the assigned GPT-6 Luna / medium policy; the imagegen interface does not expose renderer model metadata. The worktree is `art/charge-naruto`.

## Identity inputs

Only approved fixed-name references were attached:

| Input | SHA-256 |
|---|---|
| `reference/model_sheet.png` | `2481B65323264130937450774351F3BEE8EEEF5A3C845CC2910C185A11D40CD9` |
| `reference/expressions.png` | `61A2914D6261B0A7160DCF24BB8A84EB44A1EB38766B2DE52AFC38B4CFD52BFE` |
| `reference/idle_approved.png` | `EEB62E3D8981C168CCC48FFEB847EF8308E267C84F9B3B5E2B29A690D1A15DB3` |

No `reference/source`, `_old`, or rejected candidates were attached.

## Attempt inventory

The interface returned an image for each call. Attempts 1 and 2 were not retained as candidate files. Their provider output paths were not captured at call time and cannot be recovered from this session record; this is a provenance gap, recorded rather than guessed. Attempt 3 is preserved unchanged. All three used the approved references listed above.

### Attempt 1 — not selected; output path lost

Returned an image output; exact provider path was not captured. No source file was saved. Prompt:

> Create ONE horizontal pixel-art sprite strip for an original Shippuden-era anime ninja fan-art game sprite, using the attached approved Naruto identity references only for character identity, palette, and proportions. Six equal square cells in a single row, each exactly 256x256 pixels, transparent? No: every cell has a perfectly flat solid #FF00FF magenta background. Hard-edged pixel art only, no antialiasing, blur, gradients, or dithering. Facing screen-right in a 3/4 view. Keep the same lean adult-anime anatomy, head size, clothing volume, palette, and consistent identity across every frame. Black headband with long tails, compact blond spikes, whisker marks, orange-and-black high-collar jacket, orange pants, black open-toed sandals. Feet soles exactly on y=240, feet planted at identical screen coordinates in frames 2-5; hips and knees locked in frames 2-5; head center differs by no more than 2 px in frames 2-5. No aura, chakra, sparks, steam, glow, dust, shadow, text, or extra figures.
>
> Six-frame acting sequence left to right, clearly separated within cells with the same figure scale and ground position: f0 GATHER: deep wide crouch, knees bent, torso hunched, head bowed, hands draw together low in front of abdomen, elbows tucked, hair and cloth at rest. f1 RELEASE: snap into deep wide power stance, torso opens and head rises, hands join into the classic Ram hand seal directly before the chest: index and middle fingers raised together, remaining fingers interlaced, elbows out; fierce open-mouthed roar, intense narrowed eyes. Hair and long headband tails lift slightly. f2 HOLD A: establish that same deep wide stance, Ram seal before chest, fierce roaring face, feet/hips/head fixed. f3 HOLD B: same locked pose and same body, chest and shoulders rise only 1-2 px, mouth widest in roar; small upward-shifted hair/tail silhouette. f4 HOLD C: same locked pose and same body, only hands/fingers and forearms quiver by at most 1 px; fourth distinct subtle upward-flow hair/tail shape. f5 HOLD D: same locked pose and same body, shoulders settle only 1-2 px, face still roaring; tails/hem settle subtly so it cycles seamlessly into frame 2.
>
> The f2-f5 differences are restricted to breath, mouth, slight hand/forearm tremor, and four distinct upward-flow shapes in hair, headband tails, jacket hems and pant cuffs. Do not move or redraw the body silhouette between held frames. All anatomy and outfit details remain consistent; every frame stays entirely inside its cell.

### Attempt 2 — not selected; output path lost

Returned an image output; exact provider path was not captured. No source file was saved. Prompt:

> Create a single horizontal strip of 6 equal square 256x256 hard pixel art cells on solid #FF00FF. Original Shippuden-era anime ninja, facing screen-right in 3/4 view, exact identity/anatomy/outfit/palette from the three attached approved references. No anti-aliasing, blur, gradients, dithering, aura, chakra, sparks, effects, shadow, text, or other figures. Black headband with long tails, compact bright blond spikes, whisker marks, orange and black high-collar jacket, orange pants, black open-toed sandals. Soles y=240. Frames left-to-right: f0 deep wide crouch, hunched, head bowed, hands gather low in front, elbows tucked; f1 opens into deep wide stance, hands form Ram seal before chest (index/middle fingers raised together, remaining fingers interlaced, elbows out), head up and fierce open-mouthed roar. f2 establishes this pose. f3 same pose, chest/shoulders up 1 px and wider shout. f4 same body pose, forearms/fingers tremble at most 1 px. f5 shoulders settle 1 px, seamlessly returns to f2. Across f2-f5 lock feet, knees, hips and head center (head movement <=2 px); body silhouette and anatomy must stay fixed. Only breath, mouth, slight forearm/finger tremor and distinct subtle rising shapes in hair, tails and hems may change in f2-f5. Keep body scale and clothing volume equal across all frames.

### Attempt 3 — selected for preservation, technical hold

Provider path: `E:\Vibe Coding\.codex\generated_images\01a1529b-7645-7a13-973f-5dbc139cd7c1\exec-fe076acb-e30e-4d7d-b8d6-559f4b292868.png`

Prompt:

> One horizontal strip, exactly six equal square 256x256 cells, hard pixel art on perfectly flat solid #FF00FF. Original Shippuden-era anime ninja fan-art, identity, face, clothing and palette faithful to attached approved references, facing screen-right in 3/4 view, lean adult anime proportions, black forehead band with two tails, compact blond spikes, three whisker marks each cheek, orange-and-black high collar jacket, orange pants, black sandals. No antialiasing, blur, gradients, dithering, shadow, aura, chakra, sparks, effects or text. The soles align at y=240. f0 gather: deep wide crouch, hunched shoulders, head bowed, hands coming together low before abdomen. f1 release: open into deep wide stance, head up, fierce roar, hands form clear Storm-style Ram seal before chest: index and middle fingers raised together, remaining fingers interlaced, elbows out. f2 establishes this pose. f3 same body pose, chest/shoulders rise subtly and shout widest. f4 same pose, slight 1px forearm/finger tremor. f5 shoulders settle subtly and loop seamlessly to f2. In f2-f5 keep feet, knees, hips and head locked (head center <=2px); body and clothing volume otherwise exactly fixed. Only subtle breath, mouth, hand/finger tremble and four distinct rising hair/headband-tail/hem silhouettes vary.

Provider-reported dimensions: 2172x724. SHA-256: `A7DBA8D21FFD4A122111E599C2C804DD1E857F56359BE4E66E4FF9687A88F320`. Preserved byte-identically as `raw/_qa_hold/charge_v08.png`.

Hold reason: the output is 2172x724 rather than six square cells in a horizontal 6:1 strip. The visible figures are arranged across the canvas, but cell boundaries and intended 256x256 framing are not established; this cannot be packed or treated as a technically valid candidate without an authorized reconstruction/calibration. The visual gather and Ram-seal release read clearly; held poses are broadly consistent. No user approval is claimed. No packing or review queue/manifest edits were made. Budget exhausted at 3/3 calls.
