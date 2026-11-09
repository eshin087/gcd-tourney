# Sasuke ART-SIZE-R8 A1-A2 packed scale record

Date: 2026-11-08. This is technical candidate evidence, not the user's drawing approval, runtime contact QA or a final Astra anatomy audit.

## Exact candidate atlas

- Packer: `node tools/pack-sprites.mjs sasuke --quantize 48`, exit 0, 53 animations / 245 frames, 48 colors. No `scale gate:` line for A1 or A2. The pack still prints unrelated existing warnings for other Sasuke strips; they are not findings on these candidates.
- Candidate sheet SHA-256: `3d0d86e8c4de5e4ce557fb780baf31fe6575c4b04e1e0d6d63abd89a7a25f0b3`.
- Candidate metadata SHA-256: `99b178f3e511d867c6eea477b9ee4af06c61bbe84e6be23943780992c9587e4`.
- Old approved sheet used for prior-version crops SHA-256: `006321cd96309de35e319607d3b61b3e2995a6193b0a70f6bee428fc8b19b664` (committed base `4d764f299`).
- Contact page: [`public/reviews/size-r8-a1-a2/index.html`](../../../public/reviews/size-r8-a1-a2/index.html). Its packed cells are at native 256px density. Candidate and prior-version crop provenance is in that folder's `atlas-provenance.json`.

## A1 — `jumpSquat` v08

- Frame contract: 1 frame, 70 ms, non-looping; `bodyHeight` stays 162 and no `packScale` was added.
- The low-confidence head probe reads H `1.059`. Its box is x144-187/y80-116 (43×36 px); idle f0 is x91-134/y42-85 (43×43 px). Width matches exactly. The forward-pitched head shortens the vertical projection; the low-confidence crouch was therefore checked manually at one pixel density against idle f0 and the approved neutral/combat cells.
- Body sheet: B `0.925` (7.5% below idle), inside the documented ±10% pose-noise band. The pose folds the apron and overlaps the far-side limbs, so garment area is only advisory. The visible shoulder/torso, sleeves, near-side limb thickness and sandals show no material scale drift in the packed comparison. The rear arm and far leg are foreshortened/partly occluded and were not judged by their apparent lengths. Estimated edge uncertainty is about ±3 px on cloth folds.
- Exact packed head/body report: `art/scale/heads-sasuke.png`, `art/scale/body-sasuke-jumpSquat-stagger.png`. Result: manual low-confidence scale pass for v08 only; the image still needs user approval.

## A2 — `stagger` v09

- Frame contract: 4 frames, 150 ms each, looping; unchanged from v08. `bodyHeight` stays 216 and no `packScale` was added.
- Head H by frame: `0.988, 0.974, 1.010, 0.994` (median `0.991`; total spread 3.6 percentage points). Body B by frame: `1.001, 0.993, 0.964, 1.010` (median `0.997`). No frame is outside the packer's ±6% head tolerance; no size pop is flagged.
- The neutral cell comparison shows the frontal shoulder and torso width at the same density. Loose sleeves and the slight 3/4 turn make shoulder endpoints uncertain by about ±3 px; limb chains and sandals remain visibly consistent across the four frames. The body's ±10% B proxy is not flagged.
- Technical scale pass for candidate v09; the user still needs to approve the drawing.

## Scope

The exact images and generation-call counts are in `art/characters/sasuke/production/size-r8/GENERATION_INVENTORY.md`. The current-model waiver is only the user's relay `audit1 #2` decision for this round. A visual approval does not mark either candidate approved in the manifest or establish runtime integration.
