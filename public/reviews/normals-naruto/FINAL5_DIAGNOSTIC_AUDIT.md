# Naruto ENG-112 FINAL5 diagnostic atlas audit

2026-10-19 — GPT-6 Astra, medium. **HOLD for all ten latest strips; zero manual scale passes.** Technical audit only; no design approval, source promotion or production authorization.

## Exact artifact and scope

The supplied artifact is an isolated diagnostic two-page atlas, 64 animations / 315 cells / 48 opaque RGB colors (independently counted). All 70 cells of the ten new normals were extracted from the actual pages and visually inspected beside atlas idle f0 and the exact approved Naruto neutral/combat cells at native 256-pixel density. The other 245 existing cells were not individually re-audited. All ten normal animations have `loop: false`; their static frame sequences, active phases and endpoint transitions were checked. Timed playback, hold-button behavior and runtime hit/hurtbox tests were not performed and remain pending.

The temporary diagnostic manifest was removed before this audit. The production ledger reports temporary approvedVersion entries used as diagnostic plumbing. That is not approval, and `complete: true` in the diagnostic metadata is not a release certificate. The exact temporary manifest/configuration and pack stdout cannot be hashed or reproduced from retained files. The current working manifest hash is recorded separately; it is NOT a substitute for the missing diagnostic manifest.

- `sheet.png` SHA-256: `69c24a34301990b1e010d21c446ccad36110a928047cb34d3816d9fc7ab17e29`
- `sheet2.png` SHA-256: `777c730db966cae1d232b169bf431115ae03c951b4908053e60d1da52f259506`
- `anims.json` SHA-256: `65f1f4c601b4c8660e73cd1ea9c3e721d1963f844f17e6bed5154803571855a2`

Source hashes (29 saved versions), reference/working-manifest hashes, exact RGBA hashes, atlas indices, occupied bounds, durations and per-frame findings are in [FINAL5_DIAGNOSTIC_AUDIT.json](astra-evidence/FINAL5_DIAGNOSTIC_AUDIT.json). The source ledger records 30 invocations with the first fTilt result unsaved/unhashable. Candidate-to-atlas version binding follows retained scaleAudit.v and the producer ledger; the missing temporary manifest prevents complete independent pipeline reconstruction.

## Measurement limits and interpretation

- Occupied bounds are exact alpha extents, `[left, top, rightExclusive, bottomExclusive]`, not skeleton heights. Cropping at a cell edge is directly visible. Extent precision is one raster pixel; missing geometry beyond an edge cannot be measured from the cropped atlas.
- Head and shoe ratios in JSON are inherited packer color-region proxies, not independent skull or shoe-length measurements. Raised sleeves and clipping invalidate several apparent head pops. In particular dashAttack f2/f3, uSmash f6 and raised-arm uTilt/uair poses must not be described as proven anatomical shrinking from their probe values.
- The garment B proxy is invalid here: three declared body colors are missing from the palette, and the changed orange coverage is visibly undercounted. Ratios around .35-.59 do not establish a half-sized torso. Do not rescale the body using those values.
- Manual visible landmark localization is approximately +/-2-4 packed pixels, with hidden crown/shoulder/hip/ankle estimates about +/-4-8 or unmeasurable. At head/hand/shoe scale that uncertainty can exceed the required +/-6% segment tolerance. No complete per-frame skull, collar-to-hem, arm-chain, leg-chain and shoe-length numeric certificate was established; every candidate remains HOLD rather than inferring a pass.
- Identity cues are broadly preserved across all visible frames: spiky blond hair, forehead protector/tails, orange-and-black outfit, thigh band/pouch, shinobi shoes. The face is unavailable in cropped dashAttack active cells. Raw sources use softer/smoother contours and broader orange shading than the approved pixel reference. Quantization to 48 colors does not alone fix that style departure.
- Same-density reference comparisons show large heads in dTilt/dSmash/fair/bair, enlarged head/build in fSmash, a reduced silhouette in uSmash, and changed head-to-torso relationships in fTilt/uTilt/uair. These are visual holds, not invented numerical anthropometry. Crouching/foreshortening alone is never used as a scale failure.

## Per-animation and per-frame findings

### fTilt v02

HOLD: head-to-body balance and segment calibration unresolved; head probe .905-.931 is below target. This is not evidence that the entire body is uniformly small.

[Native atlas contact with references](astra-evidence/fTilt.png). [Source history, unequal-density thumbnails only](astra-evidence/fTilt-source-history.jpg).

| Frame / atlas cell | Finding |
|---|---|
| f0 / 245 | Guard: head appears small relative to longer torso and leg silhouette; feet fully present. |
| f1 / 246 | Wind-up: both arms readable; torso rotation; long front thigh retained. |
| f2 / 247 | Active straight punch reaches front mid height; elbow/wrist chain readable. |
| f3 / 248 | Active extension retained; complete hand in this packed cell, despite source adjacency warning. |
| f4 / 249 | Recovery retracts punch; front knee and hem shift. |
| f5 / 250 | Guard recovery, head/torso relationship remains different from idle. |
| f6 / 251 | Near start guard; no missing limb or cell-edge cut visible. |

v01 and v02 both show forward punch/retraction. Neither has a final alternative quantized pack here; no earlier winner certified.

### uTilt v03

HOLD: head/build mismatch needs landmark calibration; .910 low reading occurs with sleeve overlap and cannot establish actual within-strip shrinkage.

[Native atlas contact with references](astra-evidence/uTilt.png). [Source history, unequal-density thumbnails only](astra-evidence/uTilt-source-history.jpg).

| Frame / atlas cell | Finding |
|---|---|
| f0 / 252 | Guard: bulky hair/head and broader sleeve than idle. |
| f1 / 253 | Forearm raised in front of face; two arms legible. |
| f2 / 254 | Active fist in front of face; not absent, despite limb detector warning; elevation is transitional. |
| f3 / 255 | Active full upward punch; raised sleeve occludes side of head, so low head probe is unreliable. |
| f4 / 256 | Recovery fist still raised; face and jacket visible; page boundary preserved correctly. |
| f5 / 257 | Guard recovery: broad sleeve/head retained. |
| f6 / 258 | Guard endpoint near start; no gross seam, numeric segment pass unavailable. |

v01 places maximum overhead extension later (f4 recovery), while v02/v03 move it into active f3. v01 is not an obvious phase improvement.

### dTilt v03

HOLD: clipped f2 fist, f3 lacks the required second low active poke, enlarged head/build.

[Native atlas contact with references](astra-evidence/dTilt.png). [Source history, unequal-density thumbnails only](astra-evidence/dTilt-source-history.jpg).

| Frame / atlas cell | Finding |
|---|---|
| f0 / 259 | Guard: head and hair clearly larger than approved combat; wide jacket/leg volume. |
| f1 / 260 | Low forward wind-up; arm length readable and fist intact. |
| f2 / 261 | Active low punch: fist cut by right cell edge; not a complete contact drawing. |
| f3 / 262 | Second active frame already retracts to guard; no low projecting strike at intended shin target. |
| f4 / 263 | Recovery rises to broad guard; enlarged head retained. |
| f5 / 264 | Guard endpoint near start; enlarged proportions remain. |

v01 shows extended low-arm poses in BOTH f2/f3 and may improve active coverage over v03. v02/v03 retract at f3. v01 needs separate equal-density packing/scale review; not a pass.

### dashAttack v03

HOLD: four cropped frames including both active frames; face/front contact lost; do not diagnose .595 as true size pop.

[Native atlas contact with references](astra-evidence/dashAttack.png). [Source history, unequal-density thumbnails only](astra-evidence/dashAttack-source-history.jpg).

| Frame / atlas cell | Finding |
|---|---|
| f0 / 265 | Forward run anticipation; head near right side but intact. |
| f1 / 266 | Run lean clips right head/front silhouette; no reliable head-width comparison. |
| f2 / 267 | Active: right head and front strike cut off; no readable complete striking limb. |
| f3 / 268 | Active: severe right crop removes head/front body; head probe null correctly signals no measurement. |
| f4 / 269 | Recovery still clips right; front hand/body incomplete. |
| f5 / 270 | Recovery returns in bounds; head and broad jacket larger than idle. |
| f6 / 271 | Guard endpoint translated far left from start; returning from clipped lunge does not validate motion. |

All three sources show running lean without a clearly extended front blow. v01/v02 are worth checking only for assembly, not accepted as strike fixes.

### fSmash v03

HOLD: enlarged head/build; charge and forward strike readable but no full segment pass.

[Native atlas contact with references](astra-evidence/fSmash.png). [Source history, unequal-density thumbnails only](astra-evidence/fSmash-source-history.jpg).

| Frame / atlas cell | Finding |
|---|---|
| f0 / 272 | Guard: larger head and heavier jacket/arms than idle. |
| f1 / 273 | Charge hold pose is a low twisted wind-up with rear fist; readable as a charge pose. |
| f2 / 274 | Torso rotates and near arm crosses face; no isolated elbow loss seen. |
| f3 / 275 | Pre-strike wind-up continues; enlarged head retained. |
| f4 / 276 | Active forward punch reaches mid; complete fist in packed cell. |
| f5 / 277 | Active punch with changed forearm angle; intact hand despite source adjacency warning. |
| f6 / 278 | Recovery abruptly returns guard; full-body proportions still larger. |
| f7 / 279 | Guard recovery near previous pose; legs and shoes intact. |
| f8 / 280 | Guard endpoint close to start; enlarged head/build remain. |

All three show charge, two forward strikes, recovery. No source-only basis to select an anatomy winner.

### uSmash v03

HOLD: reduced build/leg/shoe silhouette; overhead strike exists; .558 head probe is occlusion, not proven half-sized head.

[Native atlas contact with references](astra-evidence/uSmash.png). [Source history, unequal-density thumbnails only](astra-evidence/uSmash-source-history.jpg).

| Frame / atlas cell | Finding |
|---|---|
| f0 / 281 | Guard is visibly narrower and shorter-limbed than idle at same density. |
| f1 / 282 | Low crouch anticipation; reduced arm/leg volumes remain; do not use crouch height as scale. |
| f2 / 283 | Forearm preparation above face; compact torso and thin supporting legs. |
| f3 / 284 | Active upward fist is clearly above head; detector warning is not proof of missing strike; airborne narrow leg silhouette. |
| f4 / 285 | Active straight up with face partly occluded by upper arm; low head probe not reliable. |
| f5 / 286 | Recovery still fully extended overhead; narrow torso and short shoes. |
| f6 / 287 | Raised arm obscures head; .558 probe is not true half-size head; incomplete landmark visibility. |
| f7 / 288 | Guard endpoint returns to reduced build; no crop visible. |

v01/v02 delay full extension until f4/f5; v03 makes f3/f4 overhead. Earlier sources are not clearly better for active timing.

### dSmash v03

HOLD: enlarged head/build and left clipping on active f3/f4; both-sided contact not intact.

[Native atlas contact with references](astra-evidence/dSmash.png). [Source history, unequal-density thumbnails only](astra-evidence/dSmash-source-history.jpg).

| Frame / atlas cell | Finding |
|---|---|
| f0 / 289 | Guard: enlarged head/face and thigh volume relative to idle. |
| f1 / 290 | Crouched preparation; clothing bulk remains large. |
| f2 / 291 | Ground hand plant with compact knees; head large; visible hand coherent. |
| f3 / 292 | Active right low kick, with rear/left silhouette cut at cell boundary. |
| f4 / 293 | Active split reaches both sides, but left foot clipped; cannot certify both contacts. |
| f5 / 294 | Recovery rotates through back view; pouch/spiral retained, limbs strongly foreshortened. |
| f6 / 295 | Rising recovery, near thigh large; far limbs partly occluded. |
| f7 / 296 | Guard endpoint near start; enlarged head/build retained. |

All three show hand plant and low sweep/split. No source-only basis to resolve final-cell clipping or anatomy.

### fair v03

HOLD: enlarged head relative to feet/body and very tight right margin; kick direction readable.

[Native atlas contact with references](astra-evidence/fair.png). [Source history, unequal-density thumbnails only](astra-evidence/fair-source-history.jpg).

| Frame / atlas cell | Finding |
|---|---|
| f0 / 297 | Airborne tuck: oversized head and thick torso; feet present. |
| f1 / 298 | Knee chamber: raised thigh occludes torso; do not infer short thigh from projection. |
| f2 / 299 | Active front kick complete but only a few pixels from right edge; head remains large. |
| f3 / 300 | Active kick with complete right shoe near edge; limb chain readable; head large. |
| f4 / 301 | Recovery knee tuck; torso and head volume persist. |
| f5 / 302 | Air tuck endpoint near start; no gross sequence seam; final scale unproven. |

v02/v03 use visibly more compact front-kick staging than v01 at thumbnail scale. Native final packing is needed to compare reach and proportions.

### bair v03

HOLD: enlarged head relative to footwear; correct rear strike does not certify anatomy.

[Native atlas contact with references](astra-evidence/bair.png). [Source history, unequal-density thumbnails only](astra-evidence/bair-source-history.jpg).

| Frame / atlas cell | Finding |
|---|---|
| f0 / 303 | Airborne guard: head visibly enlarged; feet much less enlarged. |
| f1 / 304 | Back-kick chamber: pelvis turns while face remains right; near thigh broad. |
| f2 / 305 | Active kick left with complete boot; correct behind-body strike while head faces right. |
| f3 / 306 | Active left kick maintained; head/boot proportion inconsistent with reference scale. |
| f4 / 307 | Recovery heel folds behind; near leg partly occluded. |
| f5 / 308 | Air guard endpoint near start; head enlargement persists. |

All three preserve right-facing head and leftward kick; no final-atlas evidence selects an older anatomy winner.

### uair v03

Brief correction: relay combat #55 explicitly requested true mid-air up kicks. The working table accidentally rephrased this as a fist; the authorized kick brief governs.

HOLD: produced an upward fist, which misses relay combat #55's explicit true mid-air up-kick brief. Small footwear/uncertain limb scale and occluded head measurements also remain.

[Native atlas contact with references](astra-evidence/uair.png). [Source history, unequal-density thumbnails only](astra-evidence/uair-source-history.jpg).

| Frame / atlas cell | Finding |
|---|---|
| f0 / 309 | Air guard: tucked thighs, comparatively small feet; head slightly broad. |
| f1 / 310 | Wind-up rear fist, torso twists; both arms visible. |
| f2 / 311 | Active fist is above head; this is a punch, not the authorized mid-air up kick. Raised sleeve occludes head causing unreliable probe reduction. |
| f3 / 312 | Active straight-up fist at full extension; intact fist with top margin, head partially occluded. No upward kicking leg: misses authorized up-kick brief. |
| f4 / 313 | Recovery folds arm over hair; foot/leg anatomy partly occluded. |
| f5 / 314 | Air guard endpoint near start; small shoe scale and unmeasured limb chains remain. |

All three sources show above-head punches rather than the relay #55 authorized mid-air up kick. None resolves the move-identity mismatch; no source-only basis for an older scale pass.

## Disposition

Keep all 29 sources in `_qa_hold` and retain existing stand-ins. No `scaleManualQA` record is issued (empty object in audit JSON). Earlier versions are HOLD / not finally audited; only dTilt v01 presents a clear source-level active-phase alternative worth a controlled pack comparison. Assembly/clipping and scale investigation should precede any request for further image calls. All changed output needs a fresh hash-bound audit, complete segment measurements where a pass is sought, and user review. Coordinator owns the handoff and any bookkeeping; this auditor changed evidence files only.
