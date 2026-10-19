# Astra final anatomy and scale audit: Gojo charge v08

Date: 2026-10-19. Auditor: GPT-6 Astra, medium. **Overall HOLD.** This is a technical audit, not user approval.

## Version and evidence boundary

Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-charge-gojo`.

- Candidate: `art/characters/gojo/raw/_qa_hold/charge_v08.png`; SHA256 `eac1216109fe36d3e47eb26d9623f5c6d11350345f556827d45dc05e4abfddb7` (independently verified).
- Actual diagnostic quantized atlas: `public/characters/gojo/sheet.png`; SHA256 `6083cfe0ad268a54fc12b31a9065a61fcd8ff8660987b36631df8be05c2f25cb`.
- Atlas metadata: `public/characters/gojo/anims.json`; SHA256 `dc49bf8d13be89c33780c5dad1beb6cdca2cb99892ba72a750db02680122da09`.
- Charge has exactly six packed cells, indices 115,116,117,118,119,120, durations 70,90,110,110,110,110 ms, loop=true, loopFrom=2. One selected raw source was supplied. Image-generation attempt counts were not independently audited.
- Parent reports this atlas was made with `--quantize 48 --keep-palette` and a temporary character scaleGate=warn solely for diagnosis after strict packing failed. The actual atlas reports v8, head=0.886, feet=0.999, verdict=drift. **Warning-mode completion is not a strict pass or a shipping pack.** No fresh pack was run by this auditor.
- Inspected the actual atlas cells extracted directly from sheet.png, not cached frames. `frames/charge/.packer.json` still identifies raw charge_v01 and four frames; that cache cannot evidence v08.
- Approved comparisons inspected: `public/art-review/title-style-pilot/gojo-neutral_v01.png`, `gojo-combat_v01.png`, and `art/characters/gojo/reference/idle_approved.png`; the actual packed idle f0 was the equal-density working comparison.
- Additional evidence: `body-gojo-charge.png`, `body-report.json`, `ASTRA_ATLAS_CELLS.png` (direct nearest-neighbor atlas extraction), `ASTRA_PIXEL_MEASUREMENTS.json` (4-connected opaque-component measurements).
- Read PRODUCTION_CONTRACT.md, CHARGE_BRIEF.md, CHARACTER_SCALE.md and Gojo CHARACTER.md/ANIMATIONS.md. The title-style contract supersedes historical universal head/height targets.

## Per-frame findings

All numeric boxes below are cell-local. Body B is a garment-area square-root proxy, not a segment length. Head H includes hair and is not skull-to-chin anatomy. All six H values miss the charge brief 0.93-1.07 range; the strip median also fails the automatic +/-6% gate.

| Frame | H | B | Main figure bounding box (inclusive) | Main sole y | Finding |
|---|---:|---:|---|---:|---|
| f0 gather | .886 | .760 | 85,59 to 180,222 | 222 | HOLD: shortened crouch is legitimate in principle, but feet float and head/body scale remain small. Hands drawn near abdomen rather than a subtle pocket release. |
| f1 release | .909 | .819 | 77,37 to 179,222 | 222 | HOLD: relaxed open-hand stance reads correctly, but floated body and vertical stray pixels are unacceptable. |
| f2 hold a | .871 | .816 | 77,55 to 178,240 | 240 | HOLD: anchored to floor, but smaller head and reduced torso/limb volume versus idle/reference. |
| f3 hold b | .886 | .816 | 80,37 to 181,222 | 222 | HOLD: 18 px body rise from f2; stray line; not a 1-2 px breath. |
| f4 hold c | .864 | .820 | 78,55 to 179,240 | 240 | HOLD: drops 18 px from f3; same smaller-build issue. |
| f5 hold d | .909 | .818 | 85,37 to 186,222 | 222 | HOLD: rises 18 px, then drops to f2 on wrap; sideways placement also changes. |

Main-component bounding boxes exclude detached pixel debris. Fine diagonal hair can itself create tiny disconnected components, so the other-component count is not a defect count. The long vertical lines seen on the atlas extraction are visible defects; their pixels make naive whole-alpha bounds misleading (f1/f3/f5 whole-alpha top y20 versus actual figure hair y37). True main sole y222 versus240 is robust and does not depend on the head probe.

## Anatomy, identity and motion verdicts

- **Identity: PASS (visual identity only).** All six retain white spiky hair, black blindfold, covered eyes, navy high collar/zipper, trousers, closed black shoes, and adult facial silhouette. No sprite aura, shouting mouth or exposed Six Eyes observed. Release/hold hands are open and directed down/out; the calm pose direction is recognizable.
- **Head: HOLD.** H values .864-.909, median .886: 11.4% below the idle probe reference. Hair and face visibly read smaller next to packed idle and approved cells. This is not certified as a pure hair/probe error. Head-center probe boxes for f2-f5 are [111,58,142,76], [115,39,145,58], [112,58,143,76], [119,39,150,58]; centers (126.5,67), (130,48.5), (127.5,67), (134.5,48.5). Vertical range18.5 px and horizontal range8 px exceed the 2 px allowance. These are hair-mask centers, not anatomical eye centers, but visually agree with whole-body jumping.
- **Torso: HOLD.** Release/hold collar-to-hem span and jacket volume visibly shrink relative to idle and the approved adult torso. B median .817 (18.3% low) corroborates the concern but is advisory (~10% pose noise). Hands are clear of the chest in held frames, so crossed-arm occlusion cannot explain the sustained deficit. No +/-6% segment pass is asserted without confident collar/hip landmark tracing.
- **Arms/hands: HOLD for anatomical certification.** All six have recognizable paired arms/hands without obvious missing limbs. The f0 elbows bend and overlap the torso, making direct projected length unsuitable. Held arms show reduced sleeve volume and different downward reach relative to idle. No precise upper-arm/forearm length is certified from sleeve folds; these require version-bound landmark measurements after registration/scale repair.
- **Legs/shoes: HOLD.** Long-legged adult identity survives, but thigh/shin and trouser volume appear reduced in held frames; hips/knees translate with the alternating whole-body placement. Shoe-color proxy [.985,1.053,.956,1.012,.984,1.057] does not prove matching leg or shoe geometry. It is a square-root color-area proxy. Foot outlines/positions are not identical, and floating soles alone fail grounding. Do not uniformly enlarge the crouch to standing height.
- **Build/clothing: HOLD.** Navy outfit is stable in identity; relative garment volume is persistently too low versus idle. Broad adult shoulder/torso relationships need a measured correction, not a head-only exemption. The approved title neutral is slim, but the candidate must also preserve its long torso/limb relationships and maintain current idle continuity.
- **Loop lock: HOLD, definite.** f2/f4 grounded, f3/f5 lifted18 px, with horizontal drift. Knees, hips, chest, head and hands travel together rather than a small upper-body breath. f5-to-f2 repeats the large downward pop. Four distinct subtle updraft shapes cannot compensate for this. No runtime lab playback was performed by this auditor; the static displacement already conclusively fails the contract.

## Technical verdicts

- **Count/timing/cell contract: PASS.** Six actual atlas cells, correct listed timings, loopFrom2, 256x256 cells,16 columns, pivot[128,240], pixelsPerUnit128, facing right. Metadata says complete=true and missingCore=[]; no main-vs-branch animation inventory comparison was independently performed.
- **Clipping: PASS narrowly for these six body silhouettes.** No main figure reaches an outer cell boundary (x0/255 or y0/255); no missing extremity from cell-edge truncation observed. This does not excuse floating feet or stray pixels.
- **Palette and pixel alpha: PASS narrowly on sampled charge cells.** Opaque RGB counts by frame:41,43,40,38,43,42; alpha values only0/255. Hard opaque silhouettes and quantized shading are present. Atlas-wide unique color budget and source anti-aliasing were not independently certified.
- **Clean background/hard-pixel finish: HOLD.** Vertical opaque debris is visible beside f1/f3/f5 and sparse detached pixels exist elsewhere. No public outputs were edited. Packing/source-keying diagnosis belongs to the producer/Claude; do not paint out the public atlas manually.
- **Ground registration: HOLD.** The pivot in metadata is correct but the main soles are y222 in f0/f1/f3/f5. Metadata alone does not establish foot registration.
- **Strict gate: HOLD.** Recorded drift plus parent-reported strict failure. No exemption or warning setting may be described as acceptance.

## Required follow-up and uncertainty

Keep v08 on technical hold. Investigate source extraction/registration and opaque vertical debris before commissioning another image: this audit establishes packed defects, not their cause. Preserve the versioned source. Any repaired candidate must be repacked at strict settings, measured against the exact approved references and idle for head, collar-to-hem, arm chains, thigh/shin chains, shoe geometry and clothing volume, and re-audited in the actual resulting atlas. Loop feet/hips/knees must remain fixed and head movement must fall inside the charge brief. A corrected atlas/hash requires a new audit; this report binds only to the hashes above.

Exact skull crown, elbow, hip and knee landmarks are partly obscured by hair/clothing. This report intentionally does not invent exact segment ratios or declare them passing. No contact/hurtbox certification, browser loop verification, build verification, integration, production deployment, or user approval is implied. Gojo f2 Six Eyes glint anchor should be measured only after the corrected registration is final.
