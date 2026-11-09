# Sasuke ART-SIZE-R8 A1-A2 packed scale and audit record

Date: 2026-11-09. This record links the user's drawing approvals, exact packed-cell measurements and independent GPT-6 Astra anatomy/scale audit. Runtime contact/hurtbox QA and integration remain with Claude.

## Exact candidate atlas

- Packer: `node tools/pack-sprites.mjs sasuke --quantize 48 --keep-palette`, exit 0, 53 animations / 245 frames, 48 colors. No `scale gate:` line for A1 or A2. Existing warnings for unrelated Sasuke strips remain outside this task.
- Candidate sheet SHA-256: `f2cdb72288827e04f285e6fb4257aefa3e36ad5e6a16d4a9aec5563a8550d236`.
- Candidate metadata SHA-256: `84791b2840ec878545694fcdc8909aff3e2ddfa4fdce7cbda7967982785d9da7`.
- Old approved sheet used for prior-version crops SHA-256: `006321cd96309de35e319607d3b61b3e2995a6193b0a70f6bee428fc8b19b664` (committed base `4d764f299`).
- Head report: `art/scale/heads-sasuke.png`, SHA-256 `1235d7937e17575a410752502e1b11be371dc130280afb66cdba8cb579a6da3c`.
- Body report: `art/scale/body-sasuke-jumpSquat-stagger.png`, SHA-256 `deb48126eabe8f477d366a443b87b9de6c4e60d0a633dd1119ea3f704d30c071`.
- Review page: [`public/reviews/size-r8-a1-a2/index.html`](../../../public/reviews/size-r8-a1-a2/index.html); provenance and atlas hashes are in that folder's `atlas-provenance.json`.

## A1 — `jumpSquat` v09, derived from the user-approved v08 drawing

- Contract: 1 frame, 70 ms, non-looping; `bodyHeight` remains 162. No `packScale` was added.
- Relay `audit1 #3` records the user's approval of the v08 drawing and direction to remove dark-red trouser-knee specks by script as v09, without another image-generation call. The original v08 file remains byte-for-byte preserved (SHA-256 `070d56d6b7d0ac8b9ac947958d098e7aed0a8c9dc52b25bd493da70c9e8eb9b3`). The v09 source is SHA-256 `ca0be85ccfbfe23ec7c38b740c41c2cd86fce8c8bd10b658374f273a391fe370`.
- The cleanup remapped 54 pixels inside two narrow knee-edge masks to nearby non-red outline or blue pixels. Pixel comparison confirms all other source pixels match v08; no pose geometry or head pixels changed. No image-generation call was used.
- Exact packed probe: H `1.059`; head box x144-187/y80-116 is 43×36 px, while idle f0 is 43×43 px. Width matches exactly; forward pitch shortens the vertical projection. This is a low-confidence crouch probe and was reviewed manually against idle f0 and approved title-style neutral/combat cells.
- Body sheet B `0.925` (7.5% below idle), inside the documented ±10% pose-noise advisory. The crouch folds/overlaps cloth and far-side limbs, so B remains advisory. Visible shoulder/torso width, sleeves, near-side limb thickness and sandals show no material scale drift. Rear arm and far leg are foreshortened or partly occluded; edge/landmark uncertainty is about ±3 px.
- Technical result: pack scale gate passes and manual visible anatomy/scale check passes. Independent Astra audit below also passes at moderate confidence. This does not establish runtime contact/hurtbox behavior.

## A2 — `stagger` v09, approved as drawn

- Contract: 4 frames, 150 ms each, looping; unchanged from v08. `bodyHeight` remains 216; no `packScale` was added.
- The user approved v09 as drawn via Claude relay `audit1 #3` (“Approve v09”). Source SHA-256: `074823f35e326544095ede3dbc0f31065457f3e9d709328427b239c643752751`.
- Head H by frame: `0.988, 0.974, 1.010, 0.994` (median `0.991`; total spread 3.6 percentage points). Body B by frame: `1.001, 0.993, 0.964, 1.010` (median `0.997`). No head frame exceeds the packer's ±6% tolerance; no size pop is flagged.
- Neutral comparison shows frontal shoulder and torso width at the same density. Loose sleeves and slight 3/4 turn make shoulder endpoints uncertain by about ±3 px. Limb chains and sandals remain visibly consistent across the four poses; no body proxy flag.
- Technical result: pack scale gate passes; Astra's audit passes all four frames and f3→f0 return at moderate-to-high confidence. Runtime contact/hurtbox behavior remains separate.

## Independent Astra anatomy and scale audit

GPT-6 Astra, medium reasoning, inspected the actual quantized atlas and metadata identified above, comparing A1/A2 to approved title-style neutral/combat cells and idle f0. See [`ASTRA_FINAL_AUDIT.md`](../../characters/sasuke/production/size-r8/ASTRA_FINAL_AUDIT.md) for findings and uncertainty.

| Candidate | Atlas cell(s) | Result | Confidence and uncertainty |
|---|---:|---|---|
| jumpSquat v09 | 23 | PASS | Moderate; crouch pitch and occlusion limit far-side limb/hip landmarks, about ±3 px. No visible build defect, clipping or detached remnant. |
| stagger v09 | 133-136 | PASS | Moderate-high; all four poses and loop return pass; hidden hip/knee landmarks about ±3 px. |

This is a visible-anatomy audit, not a claim that every hidden limb has a numeric ±6% measurement. It does not replace the user's approval or Claude's runtime contact/hurtbox checks.

## Approval and provenance

- A1 user approval: jumpSquat v08 drawing approved and v09 knee-speck cleanup specifically directed in relay `audit1 #3`; both versions and the no-call derivation are recorded in the [generation inventory](../../characters/sasuke/production/size-r8/GENERATION_INVENTORY.md).
- A2 user approval: stagger v09 as drawn via relay `audit1 #3`.
- Model waiver: relay `audit1 #2`, “Use their current model”, only for these three Codex art chats this round.
- Review images show the exact approved candidates and packed atlas. Art approval does not claim main integration or runtime validation.
