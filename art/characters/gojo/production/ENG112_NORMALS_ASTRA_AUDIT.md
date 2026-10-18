# ENG-112 Gojo directional normals - final Astra audit

Date: 2026-10-18. Scope: nine packed candidates, 64 frames, no user/design approval. All nine remain **HOLD** for the reasons below; this does not reject their source images. No art, tracking or packer output was altered by this audit.

## Exact evidence

- Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-normals-gojo`, branch `art/normals-gojo`.
- Actual 48-color atlas `public/characters/gojo/sheet.png`: SHA256 `3b67265b9ba6feb00ec65bb7522ff65263da99902fe22d6a6dc11b11445a532a`.
- Actual `anims.json`: SHA256 `39c0a65f30b1c7e3e2a31579db485d735a3920049b5e2cceb12c5db274144d17`.
- References: actual atlas idle f0; approved `reference/idle_approved.png`; title-style `gojo-neutral_v01.png` and `gojo-combat_v01.png` in `public/art-review/title-style-pilot/`. The atlas idle and both title cells were displayed at equal pixel density. Title neutral has the tall, lean adult anatomy; idle is wider in stance, not a new standing-height target.
- Sources audited: fTilt v01, uTilt v01, dTilt v02, dashAttack v01, fSmash v01, uSmash v01, dSmash v01, fair v01, bair v02. No uair entry exists in this atlas; it is **not audited**, and the remaining generation-budget state belongs to the producer's ledger.

## Method and uncertainty

Every listed cell was extracted directly by the actual atlas frame index, inspected beside idle and the neutral/combat reference, and inspected in chronological sequence including the part boundary and recovery. fSmash f2/f3, fair f2/f3, bair f2 and uTilt f3 also received 2x nearest-neighbor inspection. All nine have `loop:false`; this was a static frame/transition audit, not timed browser playback or hitbox validation. A gameplay/contact pass remains Claude's work.

The per-frame table gives exact occupied alpha bounding boxes (exclusive right/bottom), the existing head probe H and garment-area-derived B, and shoe-color statistic F. H is relative to idle, not an independently measured skull; B and F are square-root color-area ratios, **not torso length or shoe length**. B has roughly +/-10% pose/occlusion noise. F includes matching dark colors elsewhere and is particularly unreliable here. Table values are reproduced from the supplied reports for the inspected pack; a successful head gate does not certify segments.

Manual projected segment estimates below are deliberately intervals, from visible landmark placement at native pixels: shoulder/hip centers and joint bends are ambiguous under the dark uniform. These are screening measurements, not exact skeletal lengths; approximately 4-8 px landmark uncertainty, more for occluded joints, prevents a strict +/-6% certification. The audit does not turn this uncertainty into a numeric pass. Head identity, torso volume, both arms, both legs and shoes were inspected for every frame; occluded segment lengths remain unmeasurable rather than presumed passing.

| Region | Idle f0 visual estimate, px | Candidate comparison / limitation |
|---|---:|---|
| Crown-to-chin excluding hair | 23-29 | Faces remain adult/blindfolded; H ranges in table include hair and cannot isolate skull. |
| Shoulder-to-hip projected centerline | 65-77 | fTilt near-standing 64-78; fSmash 55-69 after fit; fair 51-65 after fit. dTilt crouched 48-64 is foreshortened, not directly comparable to upright. |
| Visible shoulder-elbow-wrist chain | 64-80 | fTilt extended arm about 67-82; fSmash extended arm about 63-78; fair exposed forward arm about 55-71. Pocketed/occluded arms cannot be measured along their full chain. |
| Hip-knee-ankle chain | 99-119 | fTilt stance about 100-121; fair kicking chain about 92-110; dSmash split leg chains about 91-114 with hip ambiguity. Bent and foreshortened legs are not standing-height fits. |
| Visible near shoe heel-to-toe | 29-37 | fTilt about 29-38; uSmash raised shoe about 31-42 with rotation; fair raised shoe about 24-33 and prior clipping uncertainty. Rotations prevent exact direct ratios. |

These intervals support the visible small-body concern on fair/fSmash but are insufficient to certify or quantify all bones within +/-6%. No additional scaling factor is recommended from them. fTilt is the closest anatomy/style candidate; its hold is narrower than the visibly clipped strips.

## Strip decisions

| Candidate | Verdict | Decisive findings |
|---|---|---|
| fTilt v01 | HOLD | Anatomy visually close; f0 has both hands pocketed contrary to R-hand-out schedule. Fine tonal/edge texture persists after quantization; hard-pixel/style review and segment certification remain unresolved. No clipping or severed limb found. |
| uTilt v01 | HOLD | f5 shoe clipped at right edge; H f4 is 1.065. Kick arc is readable and f3 toe approximately level with hair top; do not claim a ceiling violation from the silhouette alone. |
| dTilt v02 | HOLD | f2 reaches x255; B 0.817-0.827 for f0-f3 versus 0.914-0.945 recovery, small jacket/thighs relative to head. Foreshortening prevents a precise shrinkage percentage. |
| dashAttack v01 | HOLD | f2/f3 lose right-shoe extent (reported 9/8 px); intact head and coherent A/B join do not repair clipping. Lean torso/legs need segment check. |
| fSmash v01 | HOLD | auto-head fit reduces whole figure, leaving lean torso/limbs; projection split warning needs source-bound cut verification. No obvious detached hand in final f2/f3. Canonical charge is f2, despite ANIMATIONS.md saying f1. |
| uSmash v01 | HOLD | H f2/f6/f7 over +6%; bulky footwear relative to lean body; active kick is diagonal rather than the local straight-up brief. Pose/over-head contact needs Claude review, not a silent redesign. |
| dSmash v01 | HOLD | Both-side split sweep reads and is contained. Full segment +/-6% remains uncertified, with compressed torso/leg volume in anticipation and noticeable head range through recovery; no proven clipping or malformed joint. |
| fair v01 | HOLD | B 0.815-0.860 after whole-figure auto-head shrink, small torso/limbs/shoes relative to head. Reported pre-fit clipping must be reconciled; final 7/8 px right inset alone does not prove intact source toes. |
| bair v02 | HOLD | f2 is still a bent-leg rear chamber during first active frame, f3 supplies the full rear strike; contact needs review. Footwear is visibly bulky in coil, but F cannot quantify its geometry. Full segment tolerance uncertified. |

## Fits, joins and style

- dTilt B stitch factor 0.69 (after-head fit 0.988), dashAttack 0.6431, fair 0.799, uTilt 1.0768: these are producer-reported source normalization values. Large factors are not failures by themselves. Actual packed dTilt has the notable active-to-recovery body-volume change; dashAttack head continuity is good, and fair stays small throughout.
- fSmash auto-head x0.9208 and fair x0.8803 shrink **all anatomy**, not only heads. H around 1 therefore cannot clear their smaller torso/limbs. fSmash sidecar persists `anatomy.measurement:auto-head`; 4+5 frame override and projection A split are recorded. Nine recognizable figures are present; source intersection/cut validation remains required before claiming the warning harmless.
- White hair, black blindfold, navy high collar/uniform and right-facing identity remain recognizable throughout. No gross extra limb or detached head was found. Pocket poses obscure hands; identity agreement does not certify their hidden anatomy.
- Quantization gives a 48-color output but cannot remove source soft shading/anti-aliasing by definition. fTilt's fine edge/tonal texture requires style comparison to approved pixels; no numerical edge-quality pass was performed.
- Recovery frames often use pocketed poses rather than the approved idle's hanging arms. This is partly the authorized pocket schedule. Timed transitions and incoming/outgoing air pose blending were not validated in the browser.

## Every packed frame

H/B/F are ratios; they are screening evidence with the limitations above. Bounds are measured directly from the hashed atlas. Each row is covered by its strip's HOLD.

| Strip/frame (atlas index) | Bounds x0,y0,x1,y1 | H | B | F | Inspection |
|---|---|---:|---:|---:|---|
| fTilt f0 (181) | 74,11,185,241 | 1.023 | 1.011 | 1.043 | Both hands begin pocketed; conflicts with local R-hand-out f0 schedule. Upright proportions close to idle. |
| fTilt f1 (182) | 74,9,187,241 | 1.028 | 0.987 | 1.071 | Near palm chambers; torso and legs retain volume. |
| fTilt f2 (183) | 72,12,197,241 | 1.044 | 0.962 | 1.035 | Palm starts extending; shoulder rotation explains narrower jacket. |
| fTilt f3 (184) | 73,12,209,241 | 1.032 | 0.986 | 1.048 | Full palm extension; arm chain coherent, no detached fingers. |
| fTilt f4 (185) | 74,9,188,241 | 1.031 | 0.985 | 1.039 | Retracts to chamber; no obvious scale jump at part join. |
| fTilt f5 (186) | 74,10,188,241 | 1.029 | 1.013 | 1.045 | Near arm drops; stance retains volume. |
| fTilt f6 (187) | 73,9,188,241 | 1.019 | 1.018 | 1.011 | Both pocketed; close to f0, but hands must emerge on transition to approved idle. |
| uTilt f0 (188) | 82,14,179,241 | 1.029 | 0.950 | 1.083 | Compact pocketed stance; body narrower than idle. |
| uTilt f1 (189) | 95,15,196,241 | 1.017 | 0.894 | 1.056 | Bent knee chamber; thigh occlusion prevents precise leg-length certification. |
| uTilt f2 (190) | 81,16,220,241 | 1.057 | 0.889 | 1.085 | Diagonal kick crosses face-height region; head/foot appear somewhat larger than idle. |
| uTilt f3 (191) | 77,13,225,241 | 1.049 | 0.922 | 1.071 | High kick; toe is near hair-top height, arc reads; no gross extra joint. |
| uTilt f4 (192) | 75,19,208,241 | 1.065 | 0.932 | 1.104 | Knee folds; head probe 1.065 exceeds the requested +6% screening bound. |
| uTilt f5 (193) | 87,20,256,241 | 1.055 | 0.938 | 1.072 | Recovery kick extends into x255; right-shoe clipping hold. |
| uTilt f6 (194) | 84,19,180,241 | 1.029 | 0.938 | 1.086 | Pocketed return; head lower than idle, narrow jacket/legs persist. |
| dTilt f0 (195) | 74,73,191,241 | 1.054 | 0.827 | 1.045 | Crouch; small jacket and thighs relative to unchanged head; garment B 0.827. |
| dTilt f1 (196) | 81,73,185,241 | 1.044 | 0.819 | 1.029 | Crouch deepens; foreshortening plus small body prevents size pass. |
| dTilt f2 (197) | 89,59,256,241 | 1.048 | 0.826 | 1.053 | Low instep reaches x255; violates safe margin; shin is drawn but toe boundary needs repair. |
| dTilt f3 (198) | 92,59,251,241 | 1.029 | 0.817 | 1.021 | Active low poke; toe contained x250, but body remains small. |
| dTilt f4 (199) | 81,40,182,241 | 1.029 | 0.914 | 0.996 | Rises; body volume increases markedly from active segment. |
| dTilt f5 (200) | 83,25,179,241 | 1.029 | 0.945 | 0.984 | Near-standing recovery; torso remains shorter/narrower than idle; f5 to idle needs check. |
| dashAttack f0 (201) | 37,50,175,241 | 1.015 | 0.879 | 1.235 | Running fold; intact limbs, large-looking rear shoe and narrower jacket. |
| dashAttack f1 (202) | 33,52,226,241 | 1.014 | 0.940 | 1.238 | Long lunge; extended leg chain plausible; shoe metric contaminated by dark clothing. |
| dashAttack f2 (203) | 58,41,256,241 | 1.003 | 0.845 | 1.174 | Forward kick hits right border; shoe silhouette truncated. |
| dashAttack f3 (204) | 40,30,256,241 | 0.995 | 0.873 | 1.145 | Higher forward kick also hits right border; missing toe extent is visible. |
| dashAttack f4 (205) | 58,41,192,241 | 0.992 | 0.907 | 1.057 | Run recovery resumes; head remains consistent across A/B join. |
| dashAttack f5 (206) | 55,24,174,241 | 1.000 | 0.903 | 0.999 | Hop/settle; torso and legs narrow; neither silhouette height nor B alone proves shrinkage. |
| dashAttack f6 (207) | 86,16,178,241 | 1.000 | 0.936 | 1.003 | Standing pocketed finish; smaller clothing volume than idle persists. |
| fSmash f0 (208) | 75,38,186,241 | 1.000 | 0.889 | 1.056 | Wide bent stance; whole figure reduced by auto-head fit. |
| fSmash f1 (209) | 74,40,184,241 | 0.971 | 0.901 | 1.061 | Open near palm chambers; source labels this charge but canonical hold is f2. |
| fSmash f2 (210) | 67,41,188,241 | 0.987 | 0.904 | 1.067 | Canonical held f2 has palm chamber and weight back, readable; source cut warning remains around f2/f3. |
| fSmash f3 (211) | 63,41,197,241 | 1.000 | 0.893 | 1.109 | Palm already fully extends during startup; abrupt turn from f2, both figures remain recognizable. |
| fSmash f4 (212) | 64,36,196,241 | 0.971 | 0.932 | 1.146 | First active palm; arm/torso visibly slim after fit; no detached fragment seen. |
| fSmash f5 (213) | 65,34,203,241 | 1.000 | 0.956 | 1.136 | Second active palm; coherent fingers, greater reach than f4. |
| fSmash f6 (214) | 66,35,194,241 | 1.012 | 0.925 | 1.099 | Retracts; body volume close to f4, head stable. |
| fSmash f7 (215) | 68,34,193,241 | 1.004 | 0.939 | 1.068 | Hands descend; coherent legs, no gross join fragment. |
| fSmash f8 (216) | 84,34,178,241 | 0.947 | 0.898 | 1.055 | Pocketed finish; head 0.947, smaller body and lower crown than idle; endpoint changes size/stance. |
| uSmash f0 (217) | 63,48,200,241 | 1.045 | 0.885 | 1.214 | Crouched anticipation; broad hands/shoes against narrow body. |
| uSmash f1 (218) | 70,53,192,241 | 1.057 | 0.874 | 1.257 | Deep crouch; clothing compressed, head stable. |
| uSmash f2 (219) | 71,13,182,241 | 1.063 | 0.919 | 1.220 | Knee chamber already upright; head probe 1.063. |
| uSmash f3 (220) | 54,14,219,241 | 1.059 | 0.932 | 1.223 | High diagonal kick; toe near own crown, not a straight vertical leg; long exposed shoe. |
| uSmash f4 (221) | 60,14,215,241 | 1.045 | 0.926 | 1.217 | Active kick remains diagonal; reaches face/head region but over-head reading is marginal. |
| uSmash f5 (222) | 28,18,237,241 | 1.055 | 0.967 | 1.252 | Knee folds outward; shoe/hand bulk persists. |
| uSmash f6 (223) | 48,19,200,241 | 1.075 | 0.971 | 1.247 | Wide recovery; head probe 1.075 exceeds +6%; jacket remains lean. |
| uSmash f7 (224) | 81,16,183,241 | 1.069 | 0.955 | 1.172 | Pocketed upright; head probe 1.069 exceeds +6%; endpoint does not match idle exactly. |
| dSmash f0 (225) | 75,43,191,241 | 0.955 | 0.878 | 1.064 | Shallow squat; head a little smaller, intact hands and feet. |
| dSmash f1 (226) | 41,67,194,241 | 0.971 | 0.845 | 1.074 | Crouch/turn; torso and leg clothing compress. |
| dSmash f2 (227) | 55,80,187,241 | 0.971 | 0.813 | 1.023 | Further crouch; low B mainly occlusion, cannot infer anatomy numerically. |
| dSmash f3 (228) | 18,121,237,241 | 1.020 | 0.906 | 1.024 | Both legs extend to opposite sides at floor/shin height; intact split silhouette. |
| dSmash f4 (229) | 17,120,245,241 | 1.023 | 0.952 | 1.060 | Both-side sweep sustained; head remains coherent across part join. |
| dSmash f5 (230) | 16,93,206,241 | 1.056 | 0.920 | 1.058 | Legs fold under body; head probe rises to 1.056; back contour changes with turn. |
| dSmash f6 (231) | 47,66,188,241 | 1.000 | 0.863 | 1.062 | Recovery crouch; limbs remain attached, no crossing ambiguity requiring redraw established. |
| dSmash f7 (232) | 86,25,180,241 | 0.985 | 0.937 | 1.020 | Pocketed standing recovery; head consistent, body leaner than idle. |
| fair f0 (233) | 95,44,203,241 | 1.000 | 0.838 | 0.959 | Airborne guard; small jacket/limbs relative to head after fit. |
| fair f1 (234) | 100,44,192,241 | 1.006 | 0.815 | 0.949 | Knee chamber; pronounced overlap, no extra limb. |
| fair f2 (235) | 92,52,249,241 | 1.017 | 0.860 | 0.959 | Active forward kick; final xmax248, but reported 10px pre-fit clipping remains unresolved; inspect source shoe outline. |
| fair f3 (236) | 93,49,248,241 | 1.006 | 0.856 | 0.942 | Active forward kick; final xmax247, reported 8px pre-fit clipping remains unresolved. |
| fair f4 (237) | 103,60,213,241 | 0.987 | 0.825 | 0.829 | Retraction; feet metric falls to 0.829 with pose, small footwear visually apparent. |
| fair f5 (238) | 83,52,171,241 | 1.022 | 0.858 | 0.797 | Air neutral; both pocketed; feet metric 0.797, body remains small. |
| bair f0 (239) | 71,22,205,241 | 1.058 | 0.942 | 1.194 | Airborne coil, two legs intact; head and shoes relatively large. |
| bair f1 (240) | 57,51,198,241 | 1.028 | 0.917 | 1.180 | Deep tuck; overlap makes exact limb measurement uncertain. |
| bair f2 (241) | 47,31,197,241 | 1.015 | 0.918 | 1.131 | First active pose still bent rear knee, heel behind hip rather than a full body-height extension. |
| bair f3 (242) | 5,31,199,241 | 1.051 | 0.942 | 1.212 | Second active pose extends left, right-facing head retained; xmin5 is safely inside left margin. |
| bair f4 (243) | 49,37,212,241 | 1.049 | 0.934 | 1.087 | Leg retracts; no visible head-size discontinuity at join. |
| bair f5 (244) | 86,30,186,241 | 1.024 | 0.888 | 1.023 | Pocketed air neutral; jacket and thighs leaner, no gross missing limb. |

## Required disposition

Drawing approvals for the nine listed strips were recorded via relay combat #30; keep them on technical HOLD pending resolved findings. Preserve every source version and sidecar. Luna/Claude should first resolve actual boundary loss and source splitting, then inspect the affected final atlas again; do not shrink whole bodies to hide contact-edge problems. Reconcile fSmash charge documentation with canonical f2. Confirm bair f2 and uSmash active pose/contact against the brief. Re-audit changed cells under Astra on the new hash, and provide explicit segment evidence before asserting +/-6% compliance. User image approval remains separate.

This report only changes this audit file. It does not authorize additional image calls, alter attempt budgets, approve art, merge, or deploy.

## Relay combat #32 packed-offset recheck (2026-10-18)

Version-bound raw sidecars preserve the approved drawings and apply only cell placement: uTilt v01 f5 dx=-7 (3px clipped + 4px margin), dTilt v02 f2 dx=-4 (no pixel loss; margin intrusion), dashAttack v01 f2/f3 dx=-13/-12 (9/8px lost + 4px margin); all other frames use [0,0]. Whole-character `node tools/pack-sprites.mjs gojo --quantize 48` completed at 53 animations / 245 frames and 48 colors, with no remaining clip/margin warning for these strips. Existing unrelated warnings remain for heavy size, fSmash source split, baseline discrepancy and approved down/ko floor poses.

Astra inspected the quantized atlas cells and refreshed hit-box overlays. uTilt cell 193 ends at x251; f4→f5 head landmark shift is ~3px and shoe shift ~6-7px, a small foot slide without a major body jump; f5 is recovery and has no active hit box. dTilt cell 197 ends at x251; its active box [172,158,83,49] covers the extended shin/shoe. dashAttack cells 203/204 end at x251 and active boxes [172,141,83,53] / [172,92,83,39] cover the lower leg/shoe. **Astra HOLD remains on dashAttack continuity:** the specified return to [0,0] at f4 produces an estimated ~58px head-landmark jump f3→f4 (±2px landmark estimate), with the -12px f3 shift adding to that transition. No frame-offset change beyond relay #32 was made; Claude must disposition this before merge. Existing nine-strip anatomy/pose holds remain distinct from this placement check.
