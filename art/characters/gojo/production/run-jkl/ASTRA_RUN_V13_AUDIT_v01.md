# Gojo run v13 — Astra final atlas audit

Date: 2026-10-15. Auditor: GPT-6 Astra / medium. Branch `art/gojo-run`, inspected HEAD `e09e4d11`.
Worktree: `E:\Vibe Coding\Claude Code\gcdTourney\.worktrees\art-gojo-run`.

**Verdict: HOLD — new free-arm disappearance in f6 (atlas slot 14).** The user approved run v13 via relay #6. This report does not revoke that visual approval or grant technical clearance. Main's current inbox explicitly accepts the same lead leg in both halves, the forward fist, and the B half sitting about 10 px lower. None of those three accepted deviations is a failure reason here.

## Scope and exact evidence

All eight actual quantized atlas run cells were decoded directly and inspected at equal pixel density beside approved title neutral/combat and packed idle f0. Nearest-neighbor enlargement was used for inspection; no image was rescaled to match a posed height. Contract: `art/scale/title-style-pilot/PRODUCTION_CONTRACT.md` and ADR 0029. This report is the only file written by this audit. Existing body-report files, art, sidecar, approval rows and manifest were left untouched. No packer rerun, art generation, commit, ring, merge, or deployment was performed.

| File | SHA256 verified in this audit |
|---|---|
| `art/characters/gojo/raw/run_v13.png` | `8C0D8C12BF85BF0FC5304E0D48C2069DD5A6AD89272DCD8914F4523630659F62` |
| `public/characters/gojo/sheet.png` | `610E84DC5972D2F810EC5114D4521E21282C3C4C87DFD89B0E92E9E8380B49D2` |
| `public/characters/gojo/anims.json` | `68290C97FE9AA6661B31F48CF65D54BFC55F56D5F4E125F425AE4FB4ED8E8586` |
| `art/characters/gojo/raw/run_v13.json` | `c4789609e9f0740f8332628f856caacb0b6f1258674478493599edd9485fe478` |
| `art/characters/gojo/reference/title_neutral_approved.png` | `d9fd4dca67c7cc133e897773a3c8128d6c5320a42402642c11409fea770175a0` |
| `public/art-review/title-style-pilot/gojo-combat_v01.png` | `ab42bc6facd14659bf35b48a4bce8682cd17218f200d1e7fcdc6430f58451656` |
| `art/characters/gojo/reference/idle_approved.png` | `6c1ec47c2c1e2b7df2d3aa6ccf2256e46dc93bdd8e426607f2990f6f963913bb` |
| `public/reviews/gojo-run-jkl/run_v13_loop_v01.gif` | `7c1160ccf2af465263725ebab495de8a07784aa4ccec8bd608290a2472334e48` |

Atlas: 4096 x 2816, 256 x 256 cells, 16 columns, pivot [128,240], ppu 128. `run.frames = [8,9,10,11,12,13,14,15]`, eight 60 ms durations, loop true (480 ms total). Run fN is crop `[(8+N)*256,0,256,256]`; idle f0 is slot 0. The metadata records run v13 and idle v8. The raw approved idle is a larger strip, so metric comparisons use packed idle f0 at the same density as the title cells.

The cache images `frames/run/run_00.png` through `_07.png` are not byte-equal in decoded RGBA to the atlas crops. They are not the audited placement/palette evidence; use the exact atlas or verified GIF. This audit does not classify that difference alone as an art defect.

## Exact atlas measurements

Alpha bounds below use inclusive coordinates; envelope height is **not** standing-body height. Hair-box dimensions and head ratios are the existing `anims.json.scaleAudit.anims.run` measurements, quoted as palette-probe evidence, not full head/skull or anatomy certification. Manual inspection independently found no gross hair inflation or frame-to-frame head-size jump.

| Frame / slot | Occupied x / y | Width x height | Hair probe box W x H | Head ratio | Opaque pixels |
|---|---|---|---|---:|---:|
| f0 / 8 | 57..212 / 34..240 | 156 x 207 | 36 x 22 | 1.002 | 9611 |
| f1 / 9 | 72..196 / 34..240 | 125 x 207 | 37 x 22 | 1.012 | 8993 |
| f2 / 10 | 58..197 / 34..240 | 140 x 207 | 36 x 21 | 1.007 | 9187 |
| f3 / 11 | 51..196 / 27..212 | 146 x 186 | 36 x 21 | 1.029 | 9110 |
| f4 / 12 | 50..218 / 45..240 | 169 x 196 | 36 x 22 | 1.000 | 9590 |
| f5 / 13 | 65..195 / 46..240 | 131 x 195 | 35 x 21 | 1.000 | 8964 |
| f6 / 14 | 56..189 / 44..240 | 134 x 197 | 35 x 21 | 0.996 | 7977 |
| f7 / 15 | 38..197 / 38..227 | 160 x 190 | 35 x 20 | 0.992 | 9280 |

Packed idle f0 occupies x80..182/y10..240, 103 x 231. Idle's palette hair reference is 35 x 22. Run's recorded head median is 1.001 and feet median 1.029; feet-frame values are [1.070,1.022,1.035,1.037,1.028,1.030,0.969,1.018]. The latter are matching-color area-derived scale proxies, not shoe lengths. The atlas has 48 opaque colors plus transparency. All run cells have clear edges: minimum left margin 38 px, minimum right margin 37 px; no occupied pixel reaches a cell edge. Flight f3/f7 bottom y212/y227 reflects Claude's recorded -28/-13 vertical offsets, not clipping.

Hair probe horizontal centers are [168.5,169,168.5,169.5,170.5,170,169,171] px: only 2.5 px range. This confirms that the previous large horizontal registration slide is absent. Hair-probe y centers are [46.5,46.5,47,40,57.5,59,56,48.5]. The accepted B-half vertical offset is visible in corresponding phases (+11,+12.5,+9,+8.5 px).

## Anatomy measurements and limits

These manual projected measurements are rounded native pixels, estimated from visible garment/joint landmarks. Uncertainty is about ±3 px for hair/shoes and ±6–8 px for clothed torso/limb chains. They are not recovered 3D bone lengths. A bent/occluded segment is not certified merely because another segment or the hair probe passes.

Reference estimates: neutral/combat/idle hair-to-chin heights approximately 39/40/40 ±3 px; collar-base to central jacket-hem axes approximately 70/68/69 ±6 px. Relaxed/bent visible arm chains are approximately 70/62/66 ±7 px. Straighter visible hip-knee-ankle chains are approximately 111/109/105 ±8 px. Side-facing shoe heel-to-toe silhouettes are approximately 34/34/34 ±3 px. The combat reference provides pose context, while idle provides a packed-density cross-check.

| Frame | Collar-to-hem projected axis ±6 | Visible pocket-side shoulder/elbow/wrist chain ±7 | More readable leg hip/knee/ankle chain ±8 | Shoe observation |
|---|---:|---:|---:|---|
| f0 | about 55 | about 62 | about 95, forward leg | extended forward shoe about 39 ±3 |
| f1 | about 55 | about 62 | about 91, support leg | forward shoe about 36 ±3 |
| f2 | about 54 | about 61 | about 92, extended leg | lifted/rotated shoes: skip length certification |
| f3 | about 53 | about 61 | about 83, rear projected chain | both rotated; skip length certification |
| f4 | about 55 | about 62 | about 99, forward leg | forward shoe about 39 ±3 |
| f5 | about 53 | about 61 | about 90, support leg | forward shoe about 37 ±3 |
| f6 | about 54 | about 61 | about 94, extended leg | rotated/overlapped; skip length certification |
| f7 | about 54 | about 62 | about 93, rear projected chain | both rotated; skip length certification |

Example visible torso anchors: f0 collar base near (161,80), central hem near (147,133), giving approximately 55 px. Reference idle anchors near (131,56) and (136,125) give approximately 69 px. These are garment endpoints: forward lean, torso rotation, jacket compression and hem position affect them. The central estimates are shorter than the upright references, but this is **not a proven 20% skeletal shrink**. The uncertainty and projection prevent a full ±6% torso/limb certification. No whole-pose resize or redraw is prescribed from these garment measurements. Frame-to-frame torso volume appears stable; no extra inflation/collapse beyond f6's missing arm silhouette was established.

The folded thighs/shins in passing/flight poses, far arm origins, hidden pelvis, pocketed fingers and rear shoes are explicitly skipped for strict length certification. Projected limb chains generally overlap plausible reference ranges when their uncertainty and foreshortening are considered; they are not numeric passes. The f6 free arm is unmeasured because it is not visibly present. Head/face, high collar, adult build and dark clothing identity remain recognizable throughout. No extra leg, reversed knee, disconnected shoe or gross hair-scale change was found in the inspected atlas.

## Per-frame visual audit and transitions

| Frame | Finding |
|---|---|
| f0 | Contact/extended forward leg, separate rear leg, pocket-side hand at hip and forward fist visible. Adult build and clothing read consistently. |
| f1 | Down/support phase, rear knee bends; both arms remain readable, pocket wrist stays at the opening. No new clipping or limb break observed. |
| f2 | Passing/high-knee pose, leg overlap remains readable; forward fist visible. Folded limb length is not independently certified. |
| f3 | Airborne pose after vertical offset, both feet above y240; forward fist and pocket hand visible. No edge clipping. |
| f4 | Repeated leading-leg contact and lower B registration, both accepted. Forward arm/fist still visible. |
| f5 | Down phase in B, forward fist visible near x189/y114, pocket hand at hip. |
| **f6** | **New HOLD:** only the pocket-side bent arm/hand is separately visible. There is no forward sleeve, forearm or fist beyond the chest, unlike f2 and adjacent f5/f7. The missing silhouette is inside the cell, not cropped at an edge. A fully occluded limb is possible in a different pose, but this frame does not depict the accepted forward-fist pose or a coherent visible transition into/out of it. |
| f7 | Flight pose, forward arm/fist reappears. Pocket hand still visible at hip. No new clipping; B's accepted lower registration persists. |

Pocket hand stays at the hip/pocket opening in all eight frames; fingers are mostly hidden, so insertion depth and anatomical left/right identity cannot be numerically proven from the 3/4 overlap. No hand visibly swings away from the pocket. Leg shading/overlap preserves two distinct legs, but the same lead-leg sequence recurs in both halves as already accepted. This audit does not reopen that approval.

All adjacent transitions 0→1→2→3→4→5→6→7→0 were compared. The large horizontal head jump found in the earlier dash audit does not occur here. 3→4 contains the accepted vertical reset and repeated leg sequence. **5→6→7 has a new one-frame free-arm dropout/pop**, which is the decisive technical hold. 7→0 returns the head y center by about -2 px and changes flight to contact; no additional seam defect beyond the accepted gait pattern was established from the discrete cells. Smoothness in live playback remains unverified as described below.

Exact f6 evidence: atlas slot 14, crop x3584/y0/w256/h256. SHA256 of its decoded 256 x 256 RGBA byte array (row-major RGBA, not PNG encoding): `ec218df626a82c0d8efd247ed2070cd7453bfc1870dba5969fe84699619812af`. Adjacent f5 RGBA SHA256: `34dad105366a03132903748fb622420e3b6451238eda4975a7e977e7b738d667`; f7: `ec7712724f8c22f8a7ce91b2dbeec84cf93ba3e09b13ab31862765b4400e017c`. F6 has 7977 opaque pixels versus 8964/9280 in its neighbors, but this area difference alone is not the anatomy verdict; the direct visible arm disappearance is.

## Loop evidence and playback limitation

The existing review GIF is 512 x 512 with eight frames, each 60 ms. I decoded all frames and sampled at their native 256 px density: every opaque atlas pixel's RGB matches the corresponding GIF frame (zero differences in each of all eight frames). Thus the review GIF is valid evidence of these exact run silhouettes, not the cached frame PNGs. The GIF's own palette/background is not substituted for atlas alpha/geometry measurements.

Live playback was attempted via the browser tools using a temporary read-only localhost server on port 5243. IAB was unavailable; Chrome returned `net::ERR_CONNECTION_TIMED_OUT` for the local review page. The temporary server was stopped. **I cannot claim to have watched the 60 ms loop play in a browser or to have verified game/runtime contacts.** The frame order, timing, pixel correspondence and every discrete transition were verified. The parent may complete live playback separately; it does not remove the directly demonstrated f6 dropout.

## Disposition / handoff

HOLD for the new f6 arm dropout. Claude should decide whether a permitted tooling/assembly correction can address it or route the newly identified defect through the user's approval desk; no new generation or art edit is authorized by this report. Any changed final atlas must be re-audited with new hashes. Existing visual approval and the three accepted deviations remain recorded. Strict full-body numeric clearance is not claimed, and the passing hair gate is not a substitute.

Main's current AGENTS relay/status rules, Gojo run-v13 inbox, Every thread instructions and coordination records were read. `gojo-run` is the mapped lane; relay #6 is the current approval, watcher reported on. Parent owns committing this report, updating the handoff and the one required lane notification. This subagent did not ring or edit main. The prior handoff/inventory texts describing an unstitched run are historical and do not override the current approved run-v13 inbox/atlas evidence.
