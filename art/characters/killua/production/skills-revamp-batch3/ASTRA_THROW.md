# Astra post-fit audit: Killua throw v07

Date: 2026-10-18. Reviewer: GPT-6 Astra, medium. Branch: `art/killua-skills`.

**HOLD. The fitted v07 atlas clears the visible clipping and palette checks below, but arm/action continuity and the required middle-finger launch anchor remain unresolved. No full anatomy numeric pass is claimed. This is not user image approval.**

## Exact evidence and provenance

All paths below are relative to this checkout. Read `art/characters/killua/SKILLS_REVAMP.md`, ADR 0029 and `art/scale/title-style-pilot/PRODUCTION_CONTRACT.md`. Compared both exact approved cells: `public/art-review/title-style-pilot/killua-neutral_v01.png` and `killua-combat_v01.png`.

- Source: `art/characters/killua/raw/throw_v07.png`, SHA-256 `5fc8fe030ac007555751d86d0f4a2d23bbe9f62b164af7d91b4e8a9a1bbe3a96`, independently recomputed.
- Sidecar: `art/characters/killua/raw/throw_v07.json`, content `{"anatomy":{"measurement":"auto-head"}}`.
- Actual inspected quantized atlas: `public/characters/killua/sheet.png`, SHA-256 `42eabc73b8230bb9bb3e14d660d472f20016578f31c19326dd2d7c5520d7a927`, independently recomputed. It contains the recognizable v07 source poses.
- `public/characters/killua/anims.json`: throw atlas indexes 119,120,121,122; 256px cells, 16 columns; durations 50,60,70,50 ms; phases 1/1/2; loop false. Atlas crop origins respectively (1792,1792), (2048,1792), (2304,1792), (2560,1792).
- **Cache mismatch:** all four `art/characters/killua/frames/throw/throw_00.png` through `_03.png` differ from corresponding atlas crops. Their `.packer.json` explicitly identifies `raw/throw_v06.png`, version 6. These files are stale, unquantized v06 evidence (over 4,000 RGBA values each), not fitted v07. This audit uses atlas crops instead. Any body/head report made from that cache must be identified as stale until rebuilt.
- The older `PACK_REPORT.md` and `ASTRA_THROW_V07_AUDIT.md` describe the earlier failed pack. Their missing-final-atlas statement is superseded by this snapshot; their source-motion concerns remain relevant.

## Exact raster checks

Bounds are inclusive here, measured over nonzero alpha. Posed bounds are diagnostic only, never standing-height targets.

| Cell | Occupied bounds x/y | Width x height | Opaque pixels | RGBA values including transparency |
|---|---|---|---:|---:|
| Approved neutral | 87..168 / 55..240 | 82 x 186 | 7078 | reference, not candidate palette |
| Approved combat | 54..201 / 96..240 | 148 x 145 | 6749 | reference, not candidate palette |
| v07 f0 | 97..212 / 110..240 | 116 x 131 | 5751 | 47 |
| v07 f1 | 107..240 / 113..240 | 134 x 128 | 5865 | 48 |
| v07 f2 | 42..164 / 106..240 | 123 x 135 | 6154 | 46 |
| v07 f3 | 86..183 / 113..240 | 98 x 128 | 5616 | 47 |

Candidate atlas has exactly 48 opaque RGB colors plus transparent background; alpha values are only 0 and 255. Thus palette and binary-edge checks pass on this snapshot. All four cells have clear margins on every outer cell boundary: nearest right margin is 15px in f1 and bottom margin is 15px throughout. No visible amputated finger, shoe or hair tip at a cell edge. Earlier f1 right clipping is absent. No painted lightning or string is present; the steel prop occurs only in f0.

## Anatomy inspection and measurement limits

Inspected every actual atlas crop at native density beside both approved cells, and at nearest-neighbor enlargement. Hair, face, collar, cuffs, purple shirt, white hem, navy shorts and high-tops preserve Killua's identity. No extra or missing limb is evident. Shorts and sleeves retain their loose volume; f2 exposes broad shoe soles because of rotation. Shoe appearance alone does not establish an enlargement error.

Manual landmark estimates, in final pixels, are deliberately ranges: outer hair/head envelope about 36-41px wide in the throw versus about 41-44px in the references; hair-top to chin about 35-39px in throw versus roughly 39-43px in the references. Spike selection and chin/collar overlap contribute around 2-3px uncertainty per endpoint. Skull crown is concealed by hair, so no independent skull-height numeric pass is possible. Heads look slightly smaller than the references, without a large frame-to-frame jump; these estimates do not certify a +/-6% limit.

The torso is compressed and tilted throughout: visible shoulder-to-hem centerlines are approximately 30-39px in the throw, versus about 42-49px neutral and 31-38px combat. Hem is a garment landmark, not the hip joint; loose cloth, lean and shoulder overlap contribute at least 4-6px uncertainty. These ranges are consistent with a crouched/airborne torso but cannot prove anatomical shoulder-to-hip preservation. No narrow waist stretching or conspicuous shoulder inflation is visible.

The extended sleeve/arm chain reads plausibly in f0-f2; foreshortened rear arms and hidden elbows prevent a reliable common endpoint measurement. Leg chains are especially occluded in f0/f1/f3; f2 is the clearest view and shows two distinct knees, shins and shoes with plausible bends. Approximate exposed knee-to-shoe-top spans are 22-30px in f2 versus roughly 26-33px in the standing reference, with 3-5px uncertainty from cuffs, knee contours and perspective. Shoe major-axis spans across all four throw frames are approximately 22-29px, versus about 24-30px in the combat cell, with 2-3px uncertainty from rotation. These observations are visual compatibility evidence, not five-segment numeric certification. The occupied-area counts above are not garment-volume measurements.

**Anatomy status: provisional visual compatibility, numeric HOLD.** No reliable segment-by-segment +/-6% conclusion follows from concealed joints, silhouette estimates or the auto-head sidecar. In particular a head-fit cannot independently certify the torso, arms, legs or shoes. Do not shrink or enlarge these tucked poses to a standing silhouette height.

## Every frame and transition

| Frame | Fitted atlas findings | Result |
|---|---|---|
| f0 wind-up | Raised rear hand clearly holds steel yo-yo beside head; opposite arm points forward. Both legs bend asymmetrically; one knee rises while the other drops. Hair and both shoes remain intact. | Identity/prop pass; airborne coil readable. |
| f1 snap | Down-forward reach reads at approximately 30-40 degrees below horizontal. But the f0 forward-pointing arm appears to become this throwing arm, while the prop-bearing arm becomes the trailing fist. At native density the open hand reads splayed; a specifically crooked middle finger is not established. | HOLD: apparent arm-role discontinuity and launch-anchor ambiguity. |
| f2 follow-through | Leading palm curls upward into a tug; legs swing forward, two soles distinct. Torso leans and shorts overlap the thighs without visible missing joints. The same leading-arm continuity concern persists. | Tug pose readable; HOLD inherited from f1. |
| f3 catch | Rear/chest hand opens near torso and opposite hand stays forward. Knees tuck, shoes remain separate; no painted prop. Catch intention is readable but the hand receiving it is not a clearly continuous completion of the f1/f2 throw arm. | HOLD: catch-arm continuity must be resolved with Claude. |

This is a nonlooping 230ms action, so no seamless f3-to-f0 loop is required. The f0-to-f1 arm-role change is the principal sequence issue. The f1-to-f2 leg swing and f2-to-f3 tuck are intentional and preserved from source; they should not be normalized to one posed height. Whole-body positions vary substantially (notably f2 shifted left); in-game root placement/string tracking requires Claude's playback/contact check. No browser/game playback was performed in this audit.

## Required handback

1. Keep v07 on technical hold for arm-role continuity and the f1 middle-finger/string anchor. Resolve the apparent source-motion conflict with Claude; do not assign an arbitrary palm anchor and call it verified.
2. Refresh or explicitly isolate stale v06 frame evidence before generating body/head sheets or another review page. Atlas crops, not those cached frames, are this audit's evidence.
3. Preserve raw v07 and its provenance. The inventory records 3/3 generation calls used; do not infer authorization for another call from this audit.
4. If corrected art or fitting changes atlas pixels, re-audit the affected final cells. User image/design approval remains separately required; this report grants none.

## Final repack addendum (2026-10-18)

Independently verified final `public/characters/killua/sheet.png` SHA-256: `35462c648a005491bca93a85e7cd291ca95999b1acf38caa08fb6725920f868a`. Re-extracted and visually inspected all four throw cells. Their geometry is unchanged: alpha masks and occupied bounds are byte-identical to the earlier audited crops. RGB values changed in 2,842 / 2,656 / 2,820 / 2,990 pixels for f0/f1/f2/f3 respectively, maximum channel difference 15/255, consistent with another palette quantization. They are not byte-identical crops. Pose, proportions, clipping and action findings above remain unchanged.

The frame marker now correctly identifies `raw/throw_v07.png`, version 7, and records autoHead 0.7831. The previous stale-v06-cache finding is therefore resolved. Cached frames still differ in RGBA values from the latest atlas after repacking; final atlas remains the visual authority, and exact-pixel comparisons must say which quantization they use.

Refreshed `art/scale/body-report.json`, `fighters.killua.anims.throw`, reports v7: B per frame 0.865 / 0.929 / 0.892 / 0.806, B median 0.879; H per frame 0.871 / 0.858 / 0.871 / 0.881, H median 0.871; advisory flag `small`. These measured proxies strengthen the need to retain the scale hold; they do not isolate skull, torso or limb dimensions, and are not a prescription to enlarge the whole airborne pose. In particular the lower H proxy agrees directionally with the smaller-head visual concern above but does not resolve hair versus skull uncertainty.

**Final result remains HOLD for anatomical scale certification and action/arm continuity.** Newly supplied hand anchors do not resolve the ambiguous drawn middle finger or wrong-arm sequence by themselves. No user approval is implied.

Post-audit cache sync: after the final repack, all four `frames/throw/throw_0N.png` cells were extracted from the final atlas and compared byte-for-byte; each now matches its atlas cell exactly. `.packer.json` identifies v07 and autoHead 0.7831. Final atlas SHA-256 is `35462c648a005491bca93a85e7cd291ca95999b1acf38caa08fb6725920f868a`; anatomy/action HOLD remains unchanged.
