# Killua specialUp v09: final fitted-atlas audit

Date: 2026-10-18. Worktree: `.worktrees/art-killua-skills`, branch `art/killua-skills`.

**Finding: HOLD for full anatomy/scale certification.** The actual atlas contains the intended v09 poses and passes the inspected clipping/palette boundaries. Frame 5 remains an unresolved scale/foreshortening case. This audit is not user design approval. No files were repacked or art pixels changed by this audit.

## Exact evidence and provenance

- Contract: `art/characters/killua/SKILLS_REVAMP.md` section B1 and `art/scale/title-style-pilot/PRODUCTION_CONTRACT.md` (ADR 0029).
- Approved comparison images: `public/art-review/title-style-pilot/killua-neutral_v01.png` and `killua-combat_v01.png`, inspected at their native 256px cell density.
- Source: `art/characters/killua/raw/specialUp_v09.png`, 2172x724; sidecar `specialUp_v09.json` contains `{"anatomy":{"measurement":"auto-head"}}`.
- Actual quantized image: `public/characters/killua/sheet.png`; SHA-256 at inspection `42eabc73b8230bb9bb3e14d660d472f20016578f31c19326dd2d7c5520d7a927`. `anims.json` maps specialUp to atlas indices 161–166 and declares scaleAudit version 9.
- All six actual atlas cells were independently extracted/read and compared with `art/characters/killua/production/skills-revamp-batch2/atlas-specialUp-0.png` through `atlas-specialUp-5.png` for visual inspection.
- **Stale exports:** every `frames/specialUp/specialUp_0N.png` differs from the corresponding actual atlas cell. `frames/specialUp/.packer.json` explicitly identifies v08. Its f5 is the old overhead tucked pose, not the new dive. These cached exports are excluded from v09 conclusions.
- **Stale body report:** `art/scale/body-report.json` records specialUp v8 (median B 0.955, H 0.993). Those values do not measure v09 and cannot clear this candidate.

## Exact atlas measurements

Bounds use half-open coordinates `[left,top,right,bottom]`; measurements come from nonzero alpha. The probe values below are stored metadata, not newly measured anatomy ratios. Its reference identifies the title combat cell, despite the tool's `idle-palette` method label.

| Frame | Occupied bounds | Width x height | Stored head ratio | Stored footwear color proxy | Finding |
|---|---|---|---|---|---|
| f0 | 67,125,196,241 | 129 x 116 | 1.032 | 1.186 | Coil preserved; no clipping |
| f1 | 108,89,225,241 | 117 x 152 | 1.003 | 1.233 | Rise readable; bent knee remains |
| f2 | 117,66,243,241 | 126 x 175 | 0.975 | 1.264 | Up-forward claw intact; 13px right margin |
| f3 | 115,59,233,241 | 118 x 182 | 0.975 | 1.182 | Second rise intact; subtle pose variation |
| f4 | 83,114,193,241 | 110 x 127 | 1.006 | 1.176 | Raised gathering hand and down-forward aiming hand readable |
| f5 | 32,104,155,241 | 123 x 137 | 0.677 | 1.197 | Palm-first dive preserved; scale unresolved |

All six cells are 256x256, use binary alpha only, and have no opaque pixels on a cell edge. They contain 47/48/47/47/46/47 opaque colors respectively, 48 distinct opaque colors across the strip. The bottommost occupied pixel is y240. This is packed placement, not an assertion that airborne feet should contact that baseline. No obvious magenta contamination, chopped hands, clipped shoes, detached limbs, or rendered lightning was found. Footwear proxies above are color-area square-root ratios, **not shoe length measurements**.

## Anatomy and pose inspection, every frame

The white spiky hair, purple long sleeves, white hem/cuffs, navy shorts, exposed lower legs and purple high-tops maintain reference identity throughout. No extra limbs or shoulder inflation is evident. Skull-under-hair landmarks are partially concealed and cannot be assigned exact body-height ratios. The reference contract itself notes source-crown uncertainty; the former fixed body-height or universal head-ratio rules are not applied here.

Manual projected segment estimates below are approximate native-pixel intervals, measured visually from shoulder/hip, shoulder/elbow/wrist and visible leg-chain landmarks. They are **screen-space estimates**, not reconstructed anatomical lengths. Garment overlap and depth foreshortening add about 4–8px uncertainty, more for f4/f5. They must not be represented as a ±6% numeric pass.

| Frame | Shoulder-to-hip estimate | Visible shoulder-to-wrist chain | Anatomy/volume assessment |
|---|---|---|---|
| Neutral reference | 48–54px | 50–58px | Upright calibration; loose shirt and long legs |
| Combat reference | 40–47px | 43–53px | Lean and flexion shorten projection |
| f0 | 34–40px | 43–50px | Crouch explains shortened torso projection; shirt not inflated; both open hands readable; bent thigh/shin chains remain plausible |
| f1 | 39–45px | 47–55px | Torso and sleeves comparable to combat; one knee tucked more than the brief's extending launch; visible long leg remains slender |
| f2 | 39–45px | 48–56px | Head, torso and upward arm visually coherent; bent near leg and trailing far leg distinct; boot volume stable |
| f3 | 36–42px | 45–53px | Slightly more compact body than f2; no gross limb pop, but same-density segment equivalence is not numerically established |
| f4 | 33–40px | 43–51px | Foreshortened torso and tucked thighs; larger visible near knee is consistent with depth; raised palm remains separate from hair |
| f5 | 28–35px | 36–44px | Small projected torso and reaching arm versus both references; rotation and foreshortening may explain part, but not enough evidence to certify preserved lengths |

Visible extended reference hip/knee/ankle chains are roughly 65–80px; f1–f3 exposed chains remain in approximately that range, while f0/f4/f5 contain folds, overlap or foreshortening and are not directly comparable. Reference and f0–f4 shoes are approximately in the low/mid-20px to low-30px major-axis range depending on view; f5's trailing shoes are near the low end. These estimates support qualitative inspection only. No precise leg or shoe ratio pass is claimed.

The f5 torso is rotated down-forward, its open hand leads the head, and both feet trail toward the upper-left. It satisfies the principal dive silhouette absent from the stale v08 exports. Its left arm is largely hidden along the torso, so its full length cannot be verified. The apparent head/torso/arm contraction relative to f4 requires a pose-aware landmark or registered comparison; the low head probe may be segmentation/rotation contamination, genuine scale change, or both. The manifest exemption is applied only to the user-identified probe misread (the inverted dive's shoes read as a head); it does not resolve this anatomy hold. **Do not enlarge f5 based on the current evidence.**

## Playback and disposition

Metadata specifies six frames, phases 2/2/2, durations 50/50/60/60/70/70ms, `loop:false`. This is not a seamless loop. All six cells and the f0→f5 order were inspected; no browser playback, game contact test, or runtime dive hold was performed. The move's held f5 deserves particular attention because its size will persist during the dive and super finish.

Technical boundary: PASS for inspected cell containment, six-pose correspondence, hard alpha, 48-color palette and absence of sprite-baked lightning. Identity: visually consistent. Pose: principal Narukami sequence present, with f1's tucked knee a minor brief deviation. Full anatomy/scale: **HOLD**, especially f5; aggregate head `ok` is insufficient when its stored frame value is 0.677 and torso/limb preservation remains uncertain.

Next action: retain v09 unchanged; obtain v09-derived body/segment evidence directly from the atlas, resolve f5's foreshortening/scale uncertainty and re-audit affected final pixels. Reconcile the stale frame cache before showing it as v09 evidence. Claude owns tooling/contact investigation. Any new generation remains subject to the cumulative attempt budget and user authorization rules; this audit authorizes neither a redraw nor approval.

## Addendum: synchronized v09 exports and final repack

The parent synchronized the frame exports from the first audited v09 atlas, updated hand/hitbox overrides, and repacked. Independently checked final sheet SHA-256: `35462c648a005491bca93a85e7cd291ca95999b1acf38caa08fb6725920f868a`.

The final six cells are **not byte-identical** to the first audit: re-quantization changes RGB values in 3091/3115/3171/3102/3366/2300 pixels respectively, with maximum per-channel difference 15. Their alpha masks are byte-identical and their occupied bounds are unchanged. The synchronized frame-export RGBA hashes match all six original audited-cell hashes exactly; the marker now identifies v09. Thus the earlier stale-v08-export finding is resolved, although these pre-requantization exports still differ in color from the final atlas. All six final atlas crops were re-extracted to `production/skills-revamp-batch2/atlas-specialUp-0.png` through `atlas-specialUp-5.png` and visually inspected again. Pose, silhouette and anatomy findings remain unchanged.

The refreshed `body-report.json` now identifies specialUp v9:

| Frame | Body garment proxy B | Reported head H |
|---|---|---|
| f0 | 0.846 | 0.902 |
| f1 | 0.887 | 0.839 |
| f2 | 0.917 | 0.925 |
| f3 | 0.907 | 0.903 |
| f4 | 0.934 | 0.950 |
| f5 | 0.762 | 0.677 |
| Median | 0.897 | 0.903 |

These replace the stale v8 body-report evidence. They remain color/segmentation proxies rather than anatomical segment lengths; re-quantization can affect those color measurements. A null advisory flag does not establish an anatomy pass. The f5 B 0.762 and H 0.677 support keeping the pose-aware scale investigation open. **The prior full-anatomy HOLD remains.** No design approval, runtime contact validation, or numeric segment pass is added.

Post-audit cache sync: after the final repack, all six `frames/specialUp/specialUp_0N.png` cells were extracted from the final atlas and compared byte-for-byte; each now matches its atlas cell exactly. `.packer.json` identifies v09 and autoHead 0.9251. Final atlas SHA-256 is `35462c648a005491bca93a85e7cd291ca95999b1acf38caa08fb6725920f868a`; scale/anatomy HOLD remains unchanged.
