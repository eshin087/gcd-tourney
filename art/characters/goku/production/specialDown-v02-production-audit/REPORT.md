# Goku specialDown v02: production atlas anatomy and scale audit

2026-10-18. GPT-6 Astra, medium reasoning. Relay goku-skills #12.

**PASS for visible anatomy, pose continuity and cell containment at bodyHeight 236. Numeric anatomical head scale remains UNRESOLVED; this is not an unconditional numeric scale pass.** I found no concrete two-landmark scale failure in these production cells. The former bodyHeight-204 diagnostic's gross undersize finding does not describe this atlas. Do not copy its measurements or verdict onto this pack.

## Exact audited inputs

Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-goku-skills`, branch `art/goku-skills`, HEAD `0704a625` at inspection. Both requested hashes matched before visual inspection:

- `public/characters/goku/sheet.png`: SHA256 `46d7eed6303d9d79d049589c98472cc578313d005cf4b1ee575fd852753d94e2`.
- `public/characters/goku/anims.json`: SHA256 `8b7d7bcd9992d9c85c9233483f8e0240f4c109b4f362a50cd7b4c5b253e5f5f1`.
- Selected raw `art/characters/goku/raw/specialDown_v02.png`: SHA256 `25543eddefd72a295f0f98a55fab0b557acda3cd4043f6eabcc9be02dc5b7b9a`.
- Approved fixed title-style neutral/combat pair `art/characters/goku/reference/title_style_draft.png`: SHA256 `f7ae672771e9282f31e7804b02bb3f0ed46488618efd6050a4b864b2203dea42`.

The manifest records v02 approved by the user via Claude relay #11 at bodyHeight 236. That visual approval is separate from this technical inspection. I did not change approval, manifest, source art, atlas or metadata, and did not run tests or repack.

## Method and reproducible cells

Inspected the actual production atlas at equal pixel density, all four specialDown frames alongside idle f0, plus the approved neutral/combat pair. The latter supplies identity and build context; the current packed idle supplies the numeric comparator. Followed `art/scale/title-style-pilot/PRODUCTION_CONTRACT.md`: inspect torso, head, limbs, clothing and continuity; do not normalize posed bounds to standing height. Main's size-r7 inbox requires two agreeing landmarks for a concrete scale-off finding and permits unresolved measurements.

Atlas is 4096 x 3072, 16 columns, 256 x 256 cells. For cell c, crop `(256*(c%16), 256*floor(c/16), 256, 256)` without resizing the figure. Temporary contact/grid images used nearest-neighbor enlargement only and are disposable, not new art inputs.

| Frame | Cell | Alpha bounds, half-open local coordinates | Occupied size | Visible verdict |
|---|---|---|---|---|
| idle f0 | 0 | (55,28)-(205,241) | 150 x 213 | Comparator |
| specialDown f0 | 117 | (77,25)-(183,241) | 106 x 216 | PASS |
| f1 | 118 | (77,25)-(183,241) | 106 x 216 | PASS |
| f2 | 119 | (77,25)-(184,241) | 107 x 216 | PASS |
| f3 | 120 | (72,24)-(189,241) | 117 x 217 | PASS |

Bounds are exact pixel observations, not anatomical scale measurements. All figures have empty margin on every cell edge. Soles end at y=240 inclusive; no cropped toe, hair tip or fingertip is visible. Relative to idle, the top differs by only 3-4px and soles remain registered; there is no large height pop.

## Body regions and uncertainty

- **Head and hair:** the gold spiked silhouette, face and neck remain coherent in every frame. Approximate hair-top-to-chin envelope is 52-54px in the candidate versus about 56px in idle, around 0.93-0.96x. Landmark uncertainty is about +/-3px per envelope, with head angle and hair shape affecting the comparison. This is a hair-inclusive visual envelope, not crown-to-chin anatomy. Skull crown is hidden under hair in both images; the raised fingers also border/overlap the face in f1-f3. The unreliable automatic Goku head probe was not used to declare a pass. **A tight numeric anatomical head-scale pass cannot be certified here.**
- **Torso/build:** the corrected cells have a substantial chest, continuous neck/shoulder connections and an orange gi with blue undershirt and belt matching the reference design. Lower-neck to belt-center projected span is about 34-36px in f0-f3 versus about 38px in idle. Representative f0 landmarks are approximately (133,80) and (130,115); idle approximately (137,86) and (129,123). Endpoints carry about +/-3px uncertainty each and differ with torso angle, collar placement and belt thickness. This suggests a modest shorter projected torso, but does not establish a reliable greater-than-5% anatomical failure. The old 29-31px diagnostic span is no longer applicable.
- **Arms and hands:** f0 shows the raised two-finger gesture near the forehead; f1 and f2 bring it into contact; f3 changes the lean/arm angle. Shoulder-elbow-wrist connections remain intact, with readable wristbands and no extra or missing limb. The other arm hangs with a closed hand. Upper-arm volume looks compatible with the muscular idle/reference build. Different bends and overlap prevent a reliable tight skeletal chain-length ratio; no numeric arm-length pass is claimed.
- **Legs and garment volume:** both legs remain connected through the hips, with loose orange trousers tapering into the boot shafts. The more upright and narrow stance explains much of the silhouette-width difference from idle's bent wide guard. No conspicuous shortened leg, collapsed knee or inflated thigh appears in any frame. Hidden hip/knee centers prevent a tight femur/shin ratio. Claude's reported garment B=1.015-1.035 is corroborative context only, not independently recalculated here; it cannot certify heads or limb lengths.
- **Boots:** both complete shafts and toes are present throughout. Screen-right cuff-to-sole visible span is approximately 35-37px versus idle about 35-37px, with +/-2px endpoint uncertainty and different trouser overlap. Boot geometry supports removal of the old gross undersize concern. This is not an exact shoe-length gate; the ankle angle and cuff coverage differ.

There are not two reliable landmarks agreeing on a scale-off finding. The remaining uncertainty must stay explicit: visual similarity does not prove every segment is within a tight percentage tolerance.

## Every frame and transition

f0/c117 is an intact preparation pose with the gesture already raised. f1/c118 moves the fingers to the forehead while preserving head, chest and lower-body volume. f2/c119 holds that gesture with a small hand/face adjustment; no isolated limb or cell-boundary cut appears. f3/c120 makes a mild lateral torso/stance change; its wider bounds follow pose rather than a conspicuous whole-body resize. The f0-to-f1, f1-to-f2 and f2-to-f3 transitions retain consistent identity and connected anatomy.

Metadata is `loop: false`, phases `[2,1,1]`, durations `[80,80,160,90]`; there is no specialDown loop seam to certify. The endpoint-to-idle pose change is expected because idle is a wide guard and this move is upright. This audit inspected consecutive atlas poses, not a browser/gameplay playback, teleport effect, hitbox or contact integration.

## Handoff

Record this exact atlas as **visible anatomy PASS, numeric head scale unresolved**, rather than copying the earlier diagnostic HOLD or claiming a full numeric head pass from garment B. If `scaleManualQA` has only a single pass/hold field and that field is interpreted as certifying the full numeric gate, it must remain hold/unresolved until the head requirement is resolved; retain the scoped visible PASS in its note. No redraw or blanket rescale is justified by this audit alone. Claude owns the gate/contact integration decision. User image approval remains the separate relay #11 record.

The prior `specialDown-v02-audit/REPORT.md` and its bodyHeight-204 evidence were preserved unchanged.
