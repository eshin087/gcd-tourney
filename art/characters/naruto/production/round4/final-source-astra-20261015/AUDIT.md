# Naruto final source screen, 2026-10-15

**HOLD for numeric anatomy certification. Both source redraws improve the torso, but do not establish the requested ~1.3 head-height upright torso.** They are available for Claude's inspection/calibration; this is neither an atlas pass nor image approval. No calls remain in this round. Do not generate again from this finding.

Scope: all four stagger v08 poses and both taunt v10 poses, left to right, against their preceding source versions, approved neutral/combat cells and approved idle v07. Exact input hashes and native source coordinates are in `coordinates.json`. Hashes of the new files match the coordinator's supplied values. Sources are 2172x724 (stagger) and 1774x887 (taunt). No packed-pixel conversion is reported.

## Torso result

H is vertical hair crown to chin, consistent with the requested crown-to-chin denominator. T is the projected center collar/top-of-zip to bottom jacket hem, including the black hem band; neither lower collar seam nor orange panel bottom substitutes for these endpoints. Neutral collar (133,76) to hem (139,126) gives T50.4, H39, T/H1.292. Neutral H37-41 and T48-53 reflect edge selection uncertainty. The sloping rear collar is higher than the central collar in these poses: measuring from that higher corner would inflate T and would change the method relative to the neutral. Source landmark overlays make this choice reviewable.

| Source pose | H source px | T source px | T/H | Prior same-pose T/H |
|---|---:|---:|---:|---:|
| stagger08 f0 | 132 +/-4 | 158.3 +/-6 | 1.20 | 1.07 |
| stagger08 f1 | 132 +/-4 | 158.3 +/-6 | 1.20 | ~1.07 |
| stagger08 f2 | 132 +/-4 | 158.3 +/-6 | 1.20 | ~1.07 |
| stagger08 f3 | 132 +/-4 | 158.3 +/-6 | 1.20 | ~1.07 |
| taunt10 f0 | 151 +/-4 | 181.5 +/-6 | 1.20 | 1.12 |
| taunt10 f1 | 151 +/-4 | 181.5 +/-6 | 1.20 | ~1.12 |

Repeated central estimates represent visually near-identical landmarks with stated precision, not proven pixel identity. Full-image x coordinates are approximate within about 8 source pixels; the useful vertical endpoint uncertainty is given above. Prior f0 endpoints are recorded explicitly; other prior poses visually match those lengths within the same uncertainty.

The torso increases approximately12% in stagger and7% in taunt at essentially preserved head size. The central ratio remains about7% below neutral and about8% below the prompt's1.3. Approximate candidate ratio ranges are1.12-1.28 and1.13-1.28; the reference ratio is itself uncertain (~1.17-1.43 at independent extremes). Thus central evidence does not meet the target, but uncertainty overlaps the relative6% band: this is an unresolved measurement HOLD, not a robust proof that another redraw is necessary. A tolerance cannot be enlarged by using uncertainty, and overlap is not a numeric pass.

## Six-pose anatomy and transition screen

- stagger f0/f1/f2/f3: same dazed face, hanging arms, slight neck/shoulder hunch, planted feet and outward screen-right sandal are preserved. Jacket length increases downward; legs consequently occupy slightly less vertical room between hem and fixed soles. Head, sandal silhouette, clothing volume and visible limb topology show no obvious new gross scale pop. Upper leg joint centers are hidden by hem/pouch; elbows and knees are garment-covered. No exact skeletal length or all-segment6% pass is justified.
- stagger transitions0->1,1->2,2->3 and3->0: almost repeated phases, small contours/placement changes, no substantial new stagger sway or recovery. This preserves the requested existing poses; the earlier limited phase variety remains. Static sequence inspection only, no timing or live playback certification.
- taunt f0: closed-mouth grin and point; f1: open-mouth callout and point. Both retain the planted wide stance, bent screen-left arm, extended screen-right arm and original head/shoe scale to visual precision. Hip/knee locations are hidden under the jacket/trousers; the pointing arm and near hand have depth projection. Exclude those projected lengths from rigid neutral/idle segment comparisons. The rear collar and raised shoulder must not be used to claim extra central torso length.
- taunt0->1 and1->0: expression swap with stable gross body scale and pose, no new visible pop or lost extremity. Complete fingers and feet are inside the original sources. The focused landmark image intentionally crops extremities; it is not clipping evidence.

The approved neutral is the appropriate upright torso comparator. The combat cell and idle07 are crouched, with compressed/rotated torso projection; their shorter displayed T must not certify these upright sources. Their head/identity, build, limbs and footwear were visually consulted. No frontal shoulder-width certification: all six are three-quarter figures. Occlusion/projection exclusions are limitations, never automatic passes.

## Handoff

Claude may inspect these improved immutable sources and decide calibration/repack or manual-review treatment. A final verdict still needs the actual quantized atlas, every packed frame, contact/clipping checks and user review. Keep both versions `needs review`/technical HOLD. No shared tracking rows, calibration, sidecars, public atlases or sources were changed, and no generation, pack, commit, merge or deployment was performed by this audit. Only this new directory was written. Diagnostic evidence: `coordinates.json`, `six-source-landmarks.png`, and three focused pixel-grid crops.
