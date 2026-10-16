# Astra final candidate audit — Naruto loose ends, 2026-10-15

**HOLD both candidates. No approval; no production scale pass.** Inspected all 13 candidate frames in the frozen 48-color diagnostic atlas, the 8-frame packed idle, base light2/airHeavy sequences, approved raw idle, and approved title-style neutral/combat cells. This is a diagnostic pack using isolated warning mode after the unchanged gate rejected both candidates. Claude calibration/contact review remains necessary.

## Provenance

- Frozen sheet SHA256: `99e7bda1f087e85c82d586d5a9db70abed7e672bbf082cd19b8b52cfb1c71a73`
- Frozen anims.json SHA256: `3a0b09f235e1f10d06151dd37dc2a1e0b3a0c1008cb8e9ee8883893a7234b3d0`
- Input: `../loose-ends/warn-mode-atlas/characters/naruto/`. Atlas indices light2Alt 182–188; airHeavyAlt 228–233.
- Exact crops and one-density contact sheets in this folder were extracted from those indices, without rescaling or repainting. Gridded sheets are nearest-neighbor display aids only.

## Measurement interpretation

All below are manual **projected** pixel estimates at 256px native cell density. H is hair-top to chin (includes hair); anatomical crown is hidden, so H is not skull length. T is neckline/shoulder-center to belt/hip-center; UA/FA are visible shoulder–elbow and elbow–wrist center chains; UL/LL are hip–knee and knee–ankle chains; S is longest visible heel–toe projection; W is garment shoulder span. Hidden joints and sleeves introduce approximately ±4px per endpoint, ±6px segment length; shoe endpoints ±2–3px. Head endpoints ±2px. The ranges deliberately exceed ±6% tolerance: **none is a numeric anatomy pass**. Foreshortening is not corrected by inventing 3D anatomy. Far limbs are occluded in most frames and excluded from intrinsic-length certification.

Native reference screening ranges: idle f0 H ~37–41, T ~39–47, UA ~23–31, FA ~20–29, UL ~39–49, LL ~32–43, S ~25–33, W ~35–45. Approved combat H ~36–42, T ~40–50; neutral H ~35–41, T ~47–57. Neutral is more upright: projected torso/limbs cannot be compared as an invariant standing bounding-box height. The neutral/combat build is lean; the candidate light2Alt torso and trouser volume remain recognizable, but its head silhouette is visibly larger than idle.

Endpoints below identify H as y hair-top:chin and T as (neck x,y)→(belt x,y), estimated on exact crops. Arm/leg numbers are the best-visible chain, not a promise that both sides were measurable.

| Candidate/frame | H endpoints / range | T endpoints / length | UA / FA | UL / LL | S / W | Finding |
|---|---|---|---|---|---|---|
| light2Alt v05 f0 | y60:103 / 41–45 | (135,106)→(128,146) / 37–45 | 27–35 / 20–29 | 42–52 / 31–41 | 30–37 / 39–49 | Large head; bent guard limbs partly hidden |
| f1 | y61:104 / 41–45 | (135,107)→(127,146) / 36–44 | 25–34 / 20–29 | 43–53 / 31–41 | 30–37 / 37–47 | Head consistent with f0; narrower shoulder projection |
| f2 | y60:103 / 41–45 | (134,107)→(126,148) / 38–46 | 28–37 / 29–38 | 42–52 / 31–41 | 30–37 / 39–49 | Extended lead palm, clear shoulder/elbow/wrist; head hold |
| f3 | y60:103 / 41–45 | (134,107)→(126,148) / 38–46 | 28–37 / 29–38 | 42–52 / 31–41 | 30–37 / 39–49 | Near-duplicate active pose; head hold |
| f4 | y60:103 / 41–45 | (135,107)→(129,148) / 38–46 | 25–34 / 20–29 | 43–53 / 31–41 | 30–37 / 37–47 | Retracts to guard, head hold |
| f5 | y60:103 / 41–45 | (135,107)→(128,148) / 38–46 | 27–35 / 20–29 | 43–53 / 31–41 | 30–37 / 39–49 | Stable build, head hold |
| f6 | y60:103 / 41–45 | (135,107)→(128,148) / 38–46 | 27–35 / 20–29 | 43–53 / 31–41 | 30–37 / 39–49 | Stable end pose; does not match smaller idle head |
| airHeavyAlt v04 f0 | y88:129 / 39–43 | (128,133)→(142,170) / 36–44 | 26–36 / 24–34 | 28–41 / 19–31 | 15–23 / 29–41 | Arms overhead, folded thighs/shins; intrinsic legs excluded |
| f1 | y89:130 / 39–43 | (130,133)→(143,170) / 35–44 | 26–36 / 24–34 | 28–41 / 19–31 | 15–23 / 29–41 | Small prep change; occluded far arm/leg |
| f2 | y101:140 / 37–41 | (172,143)→(153,178) / 36–44 | 28–38 / 26–36 | 26–39 / 18–30 | 15–23 / 31–43 | Head size visually coherent; bent torso, contact f2 good |
| f3 | y128:165 / 35–39 | (163,168)→(130,191) / 36–44 | 27–37 / 26–36 | 23–37 / 18–29 | 14–22 / 30–42 | Deeper curl; head rotates; contact method-dependent |
| f4 | y80:120 / 38–42 | (175,124)→(156,165) / 40–48 | 24–34 / 18–29 | 29–41 / 22–34 | 14–23 / 32–43 | Returning limbs, far foot occluded |
| f5 | y60:101 / 39–43 | (175,106)→(158,147) / 40–48 | 23–34 / 18–29 | 31–43 / 26–38 | 15–24 / 33–44 | Matches base airborne recovery broadly; shoes small/foreshortened |

These are screening measurements, not automatically extracted landmarks. The source/quantized anatomy cannot establish every hidden segment within ±6%. No blanket exemption or manual pass is warranted. Automatic warning-mode report supplied by packer: light2Alt head 1.13, feet 1.05; airHeavyAlt head 1.08, feet .86. The foot-color ratio is not a geometric shoe-length ratio.

## Contact geometry

Coordinates in the final 256px cell; inherited boxes treated as closed rectangles. Palm/fist envelopes are manually selected, approximately ±2–3px. Report all metrics because “within 24px of hitboxes” does not specify center versus boundary. No hitbox changed.

| Frame | Visible striking region (approx.) | Inherited rectangle | Nearest boundary gap | Strike center to nearest rectangle point | Center-to-center |
|---|---|---|---|---|---|
| light2Alt f2 | x195–217, y88–110 | x189–223,y84–110 | 0 (overlap) | 0 | ~2 |
| light2Alt f3 | x195–217, y88–110 | x190–214,y86–107 | 0 (overlap) | 0 | ~5 |
| airHeavyAlt f2 | x211–239,y175–197 | x219–248,y178–204 | 0 (overlap) | 0 | ~10 |
| airHeavyAlt f3 | x181–209,y210–230 | x224–251,y187–213 | ~15px | ~30px | ~47px |

For disjoint rectangles gap = sqrt(max(leftA-rightB,leftB-rightA,0)^2 + max(topA-bottomB,topB-bottomA,0)^2). Strike center f3 ≈(195,220); target center=(237.5,200). Point-to-rectangle distance ≈sqrt(29²+7²)=29.8px, center-to-center ≈47px. Its nearest edge is within 24px, but the visible fist center is outside that tolerance. **airHeavyAlt f3 remains contact HOLD for Claude**, not an edge-only pass. f2 and both light2Alt frames are robust overlaps.

## Sequential / replay review

Inspected every adjacent transition and end/start pair in the ordered atlas crops; no real-time game or timed browser playback was performed by this auditor. light2Alt 0→1 windup, 1→2 extension, 2→3 held palm, 3→4 retract, 4→5→6 reset are readable with no detached cell fragments. f6→f0 is visually coherent; f6→approved idle produces an obvious head/stance size change. Both soles remain around y240 and all poses fit the requested horizontal margin visually. The extended technique differs from base straight fist without losing chest contact.

airHeavyAlt 0→1 overhead preload, 1→2 descent, 2→3 deep follow-through, 3→4→5 recovery are coherent; f3→4 has a substantial head/torso upward positional change consistent with recovery, not a claimed size pass. Hair-top-to-chin range changes with rotation/foreshortening and cannot certify skull constancy. f5 resembles base airHeavy recovery. f5→f0 replay jumps as expected for a non-looping attack; do not advertise it as a seamless loop. No source strip or calibration was modified.

## Next step

Claude must calibrate and repack, resolve f3 contact semantics/placement, and obtain a re-audit of changed final pixels. User design approval remains pending. No further generation authorized by this audit.

## Source/reference hashes

- `.worktrees\art-naruto-alts-r2\art\characters\naruto\raw\light2Alt_v05.png` SHA256 `9bec0a0fffd2049c4e8084e487d34c7079a0be3e90bc832b20f00b90fede92b6`
- `.worktrees\art-naruto-alts-r2\art\characters\naruto\raw\airHeavyAlt_v04.png` SHA256 `c7411f1b739343984a5d54fb9d6c2b0907f9b9dc67d8e94b87ce9f66d12b68ac`
- `.worktrees\art-naruto-alts-r2\art\characters\naruto\reference\idle_approved.png` SHA256 `eeb62e3d8981c168ccc48ffeb847ef8308e267c84f9b3b5e2b29a690d1a15db3`
- `public\art-review\title-style-pilot\naruto-neutral_v01.png` SHA256 `acfd7240f9ee7fbe71c1b6c50ea8a269ceedeb05de44b929850ca8de06a0610f`
- `public\art-review\title-style-pilot\naruto-combat_v01.png` SHA256 `cdc6ff9838bbae102301b738ef7596be3b2cc8ecb6f24c98d27c02a0bb479751`

## Supporting coordinate traces

`projected-landmark-traces.json` gives approximate visible shoulder/elbow/wrist and hip/knee/ankle coordinates for every frame, with Euclidean projected segment calculations. The broad screening ranges above are visual estimates, not tight bounds on those coordinate calculations; discrepancies within endpoint uncertainty do not justify a pass. Hidden joints cannot be recovered from this evidence.
