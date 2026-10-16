# Naruto light2Alt v04 final packed audit

2026-10-15. GPT-6 Astra, medium. Source commit b8d800bdd676045730f4077d41bb41365a2bbbd3, branch art/naruto-alts. Scope is the actual seven quantized v04 cells, six adjacent transitions, preview repeat boundary, packed light2 base and approved title neutral/combat plus working idle v07. No generation, repack, calibration, hitbox or approval changes.

**HOLD: the authorized repair did not resolve or measurably improve vertical contact.** Exact inherited hit rectangles remain [189,84,34,26] and [190,86,24,21]. Independently read sandal extents are f2 [220,116,249,132] and f3 [204,117,229,132], uncertainty +/-3px. Their center residuals are (+28.5,+27) and (+14.5,+28)px. Neither sandal vertically overlaps its hit rectangle. Prior v03 residuals were (+29.5,+27), (+21,+27.5): f2 change is within reading uncertainty, f3 retracts about 6.5px horizontally, and neither foot is meaningfully higher. The prompt's y97 +/-8px goal was missed. Do not describe this as a successful contact repair.

## Identity and exact evidence

- sheet.png SHA-256: 57e7121351e064a0ca0e4b7d898f29b9739d9d71dfd6b15486f7b6f0f28a7e0f
- anims.json SHA-256: e753b6da62a2bc78cff2c3966af33eb90db0a387a26ee639d7b5a267ed631ef6
- Raw v04 SHA-256: 447bd8842c27636bf0056f1672ac38df74676855363f023fc7388b28448e4d53
- Exact generated repair output SHA-256: b00f0443bc3f512205cfdec263b50c6f7244043c30c1979125ade137153b42a3. The pre-audit REVIEW text omitted its final digit; corrected in the v04 row.
- [evidence.json](evidence.json) records all seven atlas indices, RGBA hashes, bounds, source/reference hashes and base-box equality. Metadata names selected version 4. Raw v03/v04 difference is confined to x785..1664,y45..532; sidecars are byte-identical. Independently comparing old/new packed occupancy finds 0 changed mask pixels in f0/f1/f4/f5/f6 and 1284/923 in f2/f3. Thus this is new packed active art, not stale v03. Palette quantization changed RGBA values even in unchanged poses, so those packed cells are not claimed byte-identical.
- All seven hit/hurt objects equal the base. Timing/phases retain [35,30,40,50,60,50,30]/[2,2,3]; loop false. No cell-edge clipping; f2 exclusive right bound250 leaves6px.
- [sequence.png](sequence.png): all seven actual frames, base frames and idle at one density. [contact.png](contact.png): base/alt f2/f3 with green inherited target and red foot extent. [landmarks.png](landmarks.png), [MEASUREMENTS.md](MEASUREMENTS.md), [measurements.json](measurements.json): every-frame H/skull/T/UA/FA/thigh/shin/shoe coordinates, lengths and exclusions.

## Anatomy and transitions

All seven frames retain the approved identity, slim build, orange/black clothing volume, two arms/two legs and open sandals. Neutral is the reference for upright anatomy; combat and idle are the appropriate bent-pose comparisons. The active chest leans, so its shorter projected collar-to-hem distance than neutral is not independently a torso-shortening defect. No pose was normalized to standing height. Reference measurements are inherited from the prior audit and visually rechecked against the same exact reference cells; decimal distances are calculations from coarse manual coordinates.

f0 guard to f1 chamber: support stance narrows, head rises about8px; intentional pose change. f1 to f2: chamber opens to kick, head lowers about7px, torso tips back and kicking leg extends. H-hair about40 to41px; no demonstrated head/body size jump. The inserted pose still reads as a long forward kick below the intended target. f2 to f3: visible foot retracts, support leg and guard remain stable; head40-ish pixels across both. f3 to f4: leg folds back into chamber, head shifts right/up with the body; H-hair about39 to41px and collar-to-hem about42 to40px are consistent within reading uncertainty. No demonstrated global scale pop at either insert boundary, but exact limb length under cloth/depth remains unresolved. f4 to f5 opens to grounded guard; f5 to f6 widens the stance. f6 to f0 preview repeat is a small guard/stance shift. Gameplay loop is false; no infinite-loop claim.

Every frame has selected visible endpoint annotations. Hidden heel in f1/f4 and other-side joints are excluded explicitly. The striking knee is inferred under orange cloth; thigh/shin split cannot certify intrinsic proportions. H and footwear uncertainty +/-4px, torso/arms +/-6px, legs +/-7px exceeds a strict +/-6% certificate for several segments before depth uncertainty. This is an anatomy precision HOLD, not evidence that every limb is malformed. Hair-probe ratios1.111/1.087 do not by themselves demonstrate intrinsic head enlargement.

Recommendation: retain v04 as needs review with contact HOLD; no further call or calibration authorized by this audit. User image approval and Claude's integration/contact decision remain separate. No full-fighter tests/build were repeated for this evidence-only audit.
