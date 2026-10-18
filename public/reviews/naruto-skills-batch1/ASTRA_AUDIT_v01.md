# Astra audit v01: Naruto skills batch 1

Date: 2026-10-18 UTC. Auditor: GPT-6 Astra, medium. Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-naruto-skills`, branch `art/naruto-skills`.

**B1 beamCharge v10: HOLD. B2 beamFire v14: HOLD. B3 ui_ult_fg v03: HOLD.** No image is approved. No manifest exemption or scaleManualQA is granted. No generation calls were used.

## Evidence and scope

Inspected all three raw B1 frames, all three raw B2 frames, B3, approved title neutral/combat v01 cells, `reference/idle_approved.png`, old approved shroud `beamCharge_v05.png` / `beamFire_v07.png`, and old splash `ui_ult_fg_v01.png`. Read SKILLS_REVAMP.md, KIT.md section 5 and the title-style PRODUCTION_CONTRACT.md.

Also inspected **the actual quantized partial atlas**, `public/characters/naruto/sheet.png`, at native geometry and with nearest-neighbor enlargement of each cell. This is not a raw-only audit. The atlas is 4096 x 256; exactly 48 occupied RGB colors were counted. Its anims.json declares `complete: false`, only beamCharge cells 0/1/2 and beamFire cells 3/4/5, both looping at 50 ms/frame. No idle cell exists in this partial atlas, so raw approved idle was inspected for anatomy but is not claimed as an equal-density packed-idle measurement. Atlas poses/tail silhouettes match the named candidates visually; the metadata does not independently encode source filenames. Hashes below bind the actual pixels inspected. The coordinator reports a subsequent strict full pack failure (no head found, plus 15-16 px right clipping); this audit did not rerun that pack or certify its success.

| Input | SHA-256 |
|---|---|
| raw/beamCharge_v10.png | f2e2198cbcee83237526bba820717405f214fad5aeca1d8fd1b0b5690cab5f7d |
| raw/beamFire_v14.png | 82335d9dad17ca81e828c8f3814ed8228c60841cd4c1df55f394c594ecb576e3 |
| raw/ui_ult_fg_v03.png | 3403871dca1bb589e97e9c81f34c3e9bd237113696ceeac5d12c46c8e698a4c0 |
| public/characters/naruto/sheet.png | 1581028fb82111cea65019cddd6ab4505a0e216a6a65d8886167639996fb5c12 |
| public/characters/naruto/anims.json | b46c8ef90138bdd5a11a3d9e8ad6b3caa572b09646f3afac463f44cb57614703 |

## Exact framing measurements and frame findings

Bounds below are alpha bounds measured directly from the final atlas, in local 256 px cells, inclusive coordinates. They include tails and ears and **are not body-height measurements**.

| Asset/frame | Occupied x | Occupied y | Distinct tails | Finding |
|---|---|---|---|---|
| B1 f0 / atlas 0 | 33..212 | 70..240 | 3 | Three visible tail tips and trunks, no fourth independently readable tail. Four limbs present; fully engulfed. |
| B1 f1 / atlas 1 | 15..212 | 71..240 | 4 | Four tails; roar mouth open; body close to f0. Front-near claw reaches y240, but the far front claw and rear feet are above it in the oblique stance. |
| B1 f2 / atlas 2 | 18..210 | 85..240 | 3 | Three tails again. Body close to f0/f1; tail fan drops 14-15 px at its highest point. |
| B2 f0 / atlas 3 | 48..255 | 101..240 | 4 | Launch pose readable, but extended hands/front claws are cut at the cell's right border. Raw has those claws intact. |
| B2 f1 / atlas 4 | 54..255 | 88..240 | 4 | Airborne tuck readable; hands/front claws again cut off. Lowest trailing claw is placed at y240 despite airborne pose; engine placement needs review. |
| B2 f2 / atlas 5 | 15..220 | 89..240 | 4 | Whole figure fits. Both forelimbs descend into a crouched landing; there is no clear single claw strike at hip height as KIT section 5 requests. |

B1's 3/4/3 count is a high-confidence visual design defect in both source and final cells. Occlusion cannot establish compliance with the required four distinct tails. B2's four tails are readable in every frame. Its clipped claws are a high-confidence packing defect independently visible at x255; the exact lost 15-16 px figure is from the coordinator's pack report, not derivable from the already-clipped atlas alone. Preserve intact sources for a measured framing/contact correction.

Both strips fix the human-head problem: no blond hair, headband, skin, clothing or sandals is visible. Two ears, blank white eyes, jagged mouths and crimson-black shroud are readable. Muscular contour lines resemble the old approved shroud baseline; that old-scale baseline supports identity only, not present scale.

## Skull, torso, limbs and build

These are **manual projected landmark estimates**, not certified bone lengths. Ears are excluded from skull estimates; an open roar jaw is recorded separately from the cranial dome. Coordinates are local packed pixels. Crown location beneath hair in the human cells is inferred, with substantial uncertainty. Values cannot support a +/-6% pass.

| Comparison | Estimate and uncertainty |
|---|---|
| Neutral title cell skull | Under-hair crown approximately (132,49), chin (132,76): 27 +/-4 px. Hair top is excluded. |
| Combat title cell skull | Under-hair crown approximately (140,90), chin (140,115): 25 +/-4 px. |
| B1 f0/f1/f2 head | Ear-base cranial dome about y145; open lower jaw about y174-176: projected crown-to-open-jaw 29-31 +/-4 px in all three. The anatomical chin at a closed mouth cannot be recovered confidently. This is NOT a skull calibration pass. |
| B2 f0 | Cranial dome near (226,146), jaw near (229,172): about 26 +/-4 px. |
| B2 f1 | Cranial dome near (222,145), jaw near (224,170): about 25 +/-4 px. |
| B2 f2 | Cranial dome near (181,168), jaw near (185,196): about 28 +/-4 px. |
| Combat projected shoulder-to-hip | Approximately (132,121) to (120,160), length 41 +/-7 px. Garment and rotation obscure joints. |
| B1 f0 projected near shoulder-to-hip | Approximately (137,178) to (101,194), length 39 +/-8 px; f1/f2 appear similar within 3-5 px, insufficient precision for certification. |
| B1 f0 near arm chain | Shoulder (137,178), elbow (114,207), wrist (124,231): about 62 +/-9 px before fingers. Visible bent arm, no disconnected joint; matching human joints are obscured/foreshortened. |
| B2 f0/f1 near arm | Shoulder around (191,158), elbow around (220,175), wrist/claws off-cell: full chain unmeasurable. |
| B2 f2 near arm | Shoulder about (145,182), elbow (127,204), wrist (143,230): about 58 +/-9 px. |

Every frame's torso, arms and legs was inspected. B1's trunk and limb drawing is stable across the three poses; B2's projecting limbs shorten and overlap with the launch/air/landing poses. No obvious extra or disconnected limb was found. Broad exposed deltoid/thigh rendering makes the beast look more heavily muscled than the jacketed title cells; the old shroud has similar muscular contours, but this does not prove equal underlying build. Shoulder/hip landmarks and far limbs are too uncertain to certify title-style length or volume tolerance. Rear thigh and shin chains are bent/overlapped, and human reference garments conceal comparable joints. Shoes do not exist in this fully engulfed design; compare clawed feet separately, without claiming a footwear ratio.

No version-specific `beamCharge_v10.json` or `beamFire_v14.json` sidecar was found by the filename check. A reproducible skull-fit record and a same-density packed idle/reference comparison are still required. The 29-31 px open roar jaw must not be silently equated to the 25-27 px human closed skull, nor should ears/tails or overall crouched bounds drive rescaling. An unmeasured head probe cannot be turned into a manual numeric pass.

## Sequence/loop assessment

All ordered transitions, including f2 -> f0, were compared from the exact cells. This is frame/transition inspection, not a browser playback or engine-contact test.

- B1 body is nearly stationary and its minor contour/placement changes read as the intended tremble. Tail count visibly changes 3 -> 4 -> 3; the loop cannot pass even though f2 -> f0 returns to three tails. Tail fan movement dominates the body tremble.
- B2 launch -> airborne -> crouched landing -> launch is readable as a pounce cycle. The two reaching frames lose the very claws that establish the attack. f2 needs a clearer down-strike silhouette and Claude's engine/contact check; its present forelimbs read as landing/brace. No claim of smooth gameplay motion or successful slam contact is made.

## B3 splash: HOLD

Raw-only B3 audit: no final cleaned/quantized splash composition was provided or certified here. `ui_ult_fg_v03.png` is 1254 x 1254. A near-magenta exclusion mask (R>200, G<80, B>200 excluded) gives occupied x15..1229, y123..1130, i.e. roughly 15 px left / 24 px right margin. No limb or tail is visibly cut off, but the composition is very tight horizontally.

**Five distinct tails**, high confidence: tips approximately (20,540), (100,270), (310,176), (590,126), (892,312) in source pixels, each tracing back toward the rump. Two fox ears are separate and not counted. This fails the explicit four-tail design.

The figure is fully engulfed, with four attached limbs, a low all-fours crouch, screen-right roar, white eye and jagged mouth. Near shoulder/elbow/wrist bends are readable; no visible human face or clothes. The shoulder/upper arm is notably bulky and a matching human skeletal scale cannot be certified from a perspective splash. Approximate cranial dome to open jaw (excluding both ears) is y670..875, about 205 +/-20 source px; no production import scale establishes equivalence with a 25-27 px title skull. This is not a numeric anatomy pass.

The old v01 is 1536 x 1024 (landscape), while v03 is square. Thus the explicit same-size/framing requirement is not met at source-file level. The full-figure concept is retained, but final crop/placement against the unchanged backdrop needs review after correcting tail count. Old v01 contains a full painted background; a magenta mask cannot recover comparable occupied bounds from it.

## Required next work

1. Luna fixes B1 tail count and B3 five-tail drawing only within the remaining cumulative call authorization; exhausted budgets stay on hold.
2. Claude/packing owner resolves B2 framing using measured source placement while preserving skull/body density and verifies ground/hand contacts. Do not shrink the whole figure simply to conceal clipping.
3. Clarify/fix B2 f2 strike readability, then produce a successful strict quantized candidate pack with exact source provenance and a versioned skull-fit sidecar. Audit the new actual atlas, all affected frames and transitions against packed idle/title references.
4. Correct B3 dimensions/composition as required by the approved splash contract, then inspect its cleaned final composite.
5. User review remains separate from these technical findings. All three assets remain HOLD; no main merge, deploy or approval is authorized by this report.

## Addendum: B3 ui_ult_fg v04 (separate candidate audit)

Date: 2026-10-18 UTC. GPT-6 Astra, medium. The preceding v03 findings are preserved verbatim and apply only to v03. Coordinator identifies v04 as the third/final authorized call, returned source `exec-03232865-318e-498c-afb1-8d1d93c9ee69.png`; this audit made no generation call.

**Overall B3 v04: HOLD for final fitted/composite evidence and unresolved anatomical calibration. Raw tail-count and engulfed-identity checks PASS.** This is not image/design approval.

### Exact raw inspected

`art/characters/naruto/raw/ui_ult_fg_v04.png`: 1254 x 1254, SHA-256 `b82b3ec384dc58868e5dd7992d3864fd10ca3034fcb76845129a70eef5f39088`.

There are **exactly four independently readable tails**, high confidence. Approximate tip locations in source pixels: (263,214), (47,414), (17,647), (47,873). Each broad tapering tail has its own outline and returns toward the lower back. The two ears are separate from the tail fan. Thus v04 corrects v03's five-tail defect.

Full figure, low all-fours crouch, right-facing open roar, two pointed ears, blank white eye and jagged mouth are present. No human hair, headband, skin, clothing or sandals is visible. Four attached limbs are readable, with the far rear leg folded beneath the torso. No detached limb, extra leg or visibly clipped claw was found. The red/black contour remains contained in the figure/tails; no broad exterior glow or background scene is painted into this raw.

Near-magenta exclusion mask, same thresholds as above: occupied x13..1241, y153..1161 inclusive. Margins are 13 px left, 12 px right, 153 px top and 92 px bottom. Entire silhouette fits, but tail/claw side margins are tight. Large upper tail fan and low body preserve the broad composition concept of v01; the source is square versus v01's 1536 x 1024 landscape.

This source aspect difference alone does not prove a final UI failure: SPEC sets the **packed transparent foreground** to 576 x 432, bottom-aligned, and the unchanged backdrop to 768 x 432. The previous v03 section's source-dimension mismatch must therefore be read as an unresolved framing requirement, not evidence that a square raw can never be fitted correctly. v04 requires inspection of its actual fitted result, preserving all four tails and claws without distorting the anatomy or cropping to the square source.

The projected head crown excluding ears is approximately (1045,737), with open lower jaw near (1065,936): about 200 +/-20 source px. An open jaw does not yield a reliable closed-skull calibration. Shoulder/hip and limb joints remain perspective estimates: near shoulder approximately (820,791), elbow (677,943), wrist (745,1090). The muscular deltoid and thigh volumes are conspicuous compared with Naruto's jacketed title cells, but also resemble the historical shroud design. No definitive added/disconnected anatomy is seen; no +/-6% title-scale or build-volume pass is supported without the final import scale and matched reference landmarks. Do not use total tail-inclusive bounds to infer body scale.

### Packed foreground and backdrop inspected

At this audit, `public/characters/naruto/ult_fg.png` is **not v04**. It visibly retains the blond hair, headband, human face and orange clothing from v01. Its file modification time also precedes v04, but the visible identity is the decisive evidence. This old output must not be shown or labeled as the v04 fitted candidate.

| Output inspected | Dimensions | SHA-256 | Coverage |
|---|---|---|---|
| public/characters/naruto/ult_fg.png | 576 x 432 RGBA | 8228bdea2105bf70805e482463223ad9447c191bbb35e66355932b1726251205 | Old human-head foreground, not v04; alpha bounds x6..571, y54..425 |
| public/characters/naruto/ult_bg.png | 768 x 432 RGBA | 1fb570ad35162f0c1c83ca416b7381b138b4cc8cfdb5d78d7a0f430b5b3c252d | Existing red crater/tail backdrop inspected; opaque full-canvas bounds |

The backdrop has four large dark tail silhouettes across its upper half; these belong to the background and are not counted as extra anatomical tails on v04. Its dense red/black palette can obscure v04's similarly colored contour. Final contrast and separation must be judged in the actual v04 composite, not inferred from the raw magenta preview. No v04 fitted foreground or composite was available to certify at the inspected path.

Required next step: produce a clearly labeled candidate-only fitted v04 foreground and composite against the unchanged backdrop through the permitted pipeline, inspect transparency, bottom alignment, complete silhouette, body size and contrast, then recheck the affected final output. Preserve this raw and the exhausted cumulative budget; no further generation is authorized by this audit. B1/B2 holds above remain unchanged.

## Addendum: B3 v04 fitted candidate and review composition

Date: 2026-10-18 UTC. GPT-6 Astra, medium. This addendum inspects the newly supplied candidate preview; preceding source/version findings remain unchanged.

**Fitted-size/transparency availability hold: CLEARED. Composite presentation hold: REMAINS. Overall B3 v04 remains HOLD**, including the previously unresolved anatomical calibration. No image approval is given.

| Exact artifact | Dimensions / bounds | SHA-256 |
|---|---|---|
| public/reviews/naruto-skills-batch1/media/ui_ult_fg_v04_fitted.png | 576 x 432 RGBA; occupied alpha bounds x25..551, y0..431 inclusive | 287800d7f66d07b80c10dc125122e0cd9d2fa9f60af004bd5c73e8ebaee9dc61 |
| public/reviews/naruto-skills-batch1/media/ui_ult_bg_v01.png | 768 x 432 RGBA; full-canvas occupied bounds | 1fb570ad35162f0c1c83ca416b7381b138b4cc8cfdb5d78d7a0f430b5b3c252d |

The fitted candidate was directly inspected. It visibly matches v04: four distinct tails, full shroud, no human head/clothes, complete clawed limbs. Transparent negative spaces are present; no magenta source background is visible in the fitted PNG. Correct 576 x 432 size and bottom alignment are established. Left/right transparent margins are 25/24 px. Upper tail contour and bottom front claw touch y0/y431: zero vertical breathing room. This is a tight fit, not by itself proof of missing source pixels. No obvious severed tip or claw is visible. Do not report the source's square aspect as a remaining standalone failure now that this fitted output exists.

At the supplied CSS placement (`.poster` 16:9, foreground width 75%, left 12.5%, bottom 0), a 768 x 432 poster draws this foreground at its native 576 x 432, offset (96,0). Its occupied composite bounds therefore become x121..647, y0..431. A temporary diagnostic alpha composite at this exact placement was inspected against the unchanged backdrop. All four foreground tails remain traceable when inspected closely; their deep red interiors and bright red borders compete with the background's red sky and black tail silhouettes. The white eye/mouth remain strongly readable. Several flank/leg contours and tail boundaries are difficult to separate at reduced display size. Contrast is therefore a review concern, not a demonstrated accessibility-ratio failure; no numerical contrast threshold is imposed here.

**Actual review-page CSS defect:** `index.html` applies `img { background: #ff00ff; border-radius: 6px; }` globally. `.poster img` only overrides positioning, and `.poster-fg` sets size/placement. Consequently transparent foreground pixels display the image element's magenta background over the backdrop. The intended alpha composite described above is a diagnostic of the intended placement, not a browser screenshot or a claim that the current page displays it correctly. The inherited corner radius can also clip pixels near the tight foreground canvas edges. Scope an override to `.poster img` with transparent background and zero radius, then inspect the actual page at its displayed size. This is a review-page presentation fix; it does not require another generation call.

Once that CSS defect is corrected, the composite can be shown accurately for review, but this audit does not silently accept its low silhouette separation or unresolved anatomical calibration. Preserve the fitted hash and version identity, and keep user/design approval distinct from technical presentation checks. The old `public/characters/naruto/ult_fg.png` is still not the candidate path audited here.

## Addendum: v04 review CSS correction verified

Date: 2026-10-18 UTC. GPT-6 Astra, medium. Verified `public/reviews/naruto-skills-batch1/index.html` now contains `.poster img { position: absolute; background: transparent; border-radius: 0; }`. This more specific rule overrides the global image magenta background and 6 px radius for both poster images. The foreground retains the audited 75% width, 12.5% left offset and bottom alignment. Fitted PNG SHA-256 remains `287800d7f66d07b80c10dc125122e0cd9d2fa9f60af004bd5c73e8ebaee9dc61`.

**The identified CSS presentation defect is CLEARED by source inspection.** The intended transparent composition is now supported by the stylesheet, with no inherited corner clipping. This is not a new browser-render verification. The previously inspected exact-placement diagnostic remains applicable because the candidate pixels and placement are unchanged.

**B3 v04 overall HOLD remains:** weak red-on-red silhouette separation is still an explicit visual review concern, zero vertical margin remains noted, and anatomical/title-scale calibration is unresolved. The cleared CSS defect must not remain listed as an active blocker; contrast and anatomy must not be represented as cleared. Artwork, approval status and B1/B2 findings are unchanged.
