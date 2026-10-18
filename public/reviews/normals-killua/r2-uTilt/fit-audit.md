# ENG-112 Killua R2 corrected fitted-atlas recheck — Astra

**Fit-trial verdict: uSmash v02 visual scale PASS with measurement caveats; uair v02 anatomy HOLD for visibly compact body after fitting.** Following this audit, uair v02 and its sidecar were returned unchanged to `_qa_hold`, and the current atlas uses its stand-in. This is not image approval, runtime/contact certification or a five-segment numerical ±6% pass.

## Correction and scope

Parent clarified that relay #23 had already authorized uSmash f5 and uair f2; relay #25 added uSmash f4 and uair f3. All four frame-specific exemptions are retained, version 2. The prior audit's inference that f5/f2 lacked authorization is withdrawn. Its no-fit conclusions describe the earlier atlas only. The pack now succeeded with uSmash import ×0.8613 and uair ×0.75 (lower-bound clamp), per parent pack evidence. Current scale-report confirms both named pairs as exempt and reports `ok` for each strip.

I re-opened the quantized fit-trial atlas and inspected all 8 uSmash and 6 uair frames beside current idle f0 and the approved title-style neutral/combat cells. All moves are non-looping; static sequence/recovery inspection was performed, not runtime playback. No source or settings changed in this audit.

## Current findings

- **uSmash f0/f1/f2/f3/f6/f7:** head now near idle, torso and clothing retain a plausible lean build. Crouch depth explains f1/f2's shorter silhouette. Recovery f6/f7 is somewhat narrower and more upright than idle; I do not see a conspicuously undersized whole body. This is a visual pass with residual segment-length uncertainty, not proof every limb is within ±6%.
- **uSmash f4/f5:** raised sleeve still obscures hair; those low head probes remain false readings. Visible face/hair and arm/torso continuity do not show a real head collapse. Extended overhead arm remains connected. No extra exemption is proposed.
- **uair f0/f1/f4/f5:** head is corrected, but the shirt length, clothing volume and limbs now look compact relative to the head and idle. This is especially apparent in f0/f5, where the torso is fairly readable despite bent legs. Manual collar-to-hem estimates are about 32–37 px after fit versus idle about 43–48 px (approximately ±4–6 px uncertainty). Folding the legs explains occupied height, but does not explain the short readable torso. HOLD.
- **uair f2/f3:** raised shoe is still selected by the head probe; actual head remains visible and near idle size. Vertical kicking leg is connected, but the small trunk/remaining limb build is consistent with the other fitted frames. HOLD is for body proportions, not for those authorized false probes.
- All 14 frames retain connected major limbs and intact shoes/hands. No boundary clipping or missing foreign/severed limbs observed. There is no numerical whole-body scale clearance.

## Fit-trial scale-report proxies

The scale report uses reference head box 40×31 and reference feetPx 1325. Its own current idle f0 reads H1.032 / F1.307 (idle medians H1.038 / F1.329). Therefore reported H/F below are NOT exact ratios against current idle f0. Feet is a square-root color-area proxy; palette overlap and perspective prevent interpreting it as shoe length.

| Strip | Report median head / feet | Readable per-frame head | Feet range | Verdict |
|---|---|---|---|---|
| uSmash v02 | 1.013 / 1.215 | 0.992–1.032 excluding f4/f5 | 1.072–1.251 | Visual scale pass; no conspicuous undersize, segment uncertainty retained |
| uair v02 | 0.998 / 1.078 | 0.995–1.003 excluding f2/f3 | 1.011–1.153 | HOLD: small torso/body after fit |

For context only, dividing by current idle f0 proxies gives uSmash median H≈0.982/F≈0.930 and uair H≈0.967/F≈0.825. These are same-report proxy ratios, not direct anatomical dimensions. They reinforce why an `ok` head gate cannot settle body/footwear scale. No shoe redraw is recommended solely from the feet proxy.

Exempt readings: uSmash f4 H0.696, f5 H0.557; uair f2 H0.575, f3 H0.551. Their low readings remain limb-contaminated, not measured tiny heads.

## Fit-trial packed bounds and source provenance

Bounds are inclusive occupied pixels in 256×256 cells; x margins remain clear and y240 is the intended sole anchor, not clipping. Idle f0 bounds x68–186/y85–240. No frame uses x0, x255 or y0.

### uSmash

- f0, atlas 210: x79–174, y86–240.
- f1, atlas 211: x84–170, y107–240.
- f2, atlas 212: x84–170, y128–240.
- f3, atlas 213: x81–173, y94–240.
- f4, atlas 214: x78–177, y64–240.
- f5, atlas 215: x77–177, y57–240.
- f6, atlas 216: x80–181, y92–240.
- f7, atlas 217: x81–173, y86–240.
### uair

- f0, atlas 238: x103–187, y95–240.
- f1, atlas 239: x98–161, y108–240.
- f2, atlas 240: x65–154, y109–240.
- f3, atlas 241: x52–158, y81–240.
- f4, atlas 242: x50–143, y97–240.
- f5, atlas 243: x94–179, y95–240.

## Handoff

uSmash may proceed within the existing user decision after the parent completes required contact/production checks. **Keep uair held and report the visible small-body result to the user through the applicable approvals route. Do not further shrink it or treat the successful head gate as anatomy approval.** Its correction/accepted proportion tradeoff needs the user's decision.

Fit-trial evidence images: `ENG112_R2_FITTED_CONTACT.png` (all frames plus approved references at native equal density) and `ENG112_R2_FIT_BODY_SHEET.png` (TOOL-036 advisory body-size comparison). Both are linked from the [user review page](../../../../public/reviews/normals-killua/r2-uTilt/index.html). Earlier `ENG112_R2_FIT_CONTACT/DETAIL/LANDMARKS.png` show the superseded unfitted atlas and remain for provenance. The committed production atlas after holding uair uses uSmash's fit and the uair stand-in. No art was retouched.

### Fit-trial SHA-256 (uSmash and fitted uair both active)

- Fit-trial `public/characters/killua/sheet.png`: `c2cf3444ae9b98841321a87c32a022147db403f59d8bfa17cb5ae496b4701ca1`
- Fit-trial `public/characters/killua/anims.json`: `2678eace05126d9a61b3c8122c5391c9f7b3e744562abad39c51a06af7491a67`
- `art/characters/killua/raw/uSmash_v02.png`: `c3576858c65b7e2ed1141621c4a27ac53af54459dbbccf248f4d8a41a6c43732`
- `art/characters/killua/raw/uSmash_v02.json`: `8c2879f0f010fd12accbaedcc5d41442d01e3f81d032b991e3595b1d22133f0a`
- `art/characters/killua/raw/_qa_hold/uair_v02.png`: `6cee89c056c9d64053502c275aa25ac7d966cdf24448571b19aa54c3cdfe051c`
- `art/characters/killua/raw/_qa_hold/uair_v02.json`: `8c2879f0f010fd12accbaedcc5d41442d01e3f81d032b991e3595b1d22133f0a`
- `art/manifest.json`: `dc9f606f99f4fcafa8794906a4c45a2c9969e327a0375de1f6bdb832da6ea904`
- `art/scale/scale-report.json`: `c2eb302a9095adb8a0d3eaf0182cc0e0c692b877e2c1154062be17f4b521ac87`
- `public/art-review/title-style-pilot/killua-neutral_v01.png`: `86278707ba8f0fcb78942cbcedb3341d8ad8f559e95f8cbf48273d0bbdca1855`
- `public/art-review/title-style-pilot/killua-combat_v01.png`: `d32d8f9f297efac7bcd8ba7e0dfd34c4d458ada1fc5e45a9c93801340f5a63d6`

### Production atlas after holding uair

- `public/characters/killua/sheet.png`: `9f385fa66646ab68707a2031215554bbe20fd372e754ebE9578df843ed3b45cf`
- `public/characters/killua/anims.json`: `5207e01777269c7188f39e77e4026dab9370a0478fc2ff828e07bada3f052831`
- Packed set: 52 animations / 238 frames; uSmash uses its measured fit, uair remains on its stand-in.

---

## Superseded first-pass audit (unfitted atlas; authorization inference corrected above)

# ENG-112 Killua R2 measured-import audit — Astra

2026-10-18. **HOLD for both strips.** Audited the current actual 48-color atlas, not the older diagnostic atlas. No source, manifest, sidecar, packer or shipped output was edited by this audit. This is static sequential inspection of every packed frame; runtime contacts and playback were not tested. Both moves are non-looping. Inspection covers startup, active, recovery and return toward idle, not a claimed loop animation.

## Exact coverage and fit outcome

- uSmash v02: 8 frames, atlas cells 210–217, phases [4,2,2].
- uair v02: 6 frames, atlas cells 238–243, phases [2,2,2].
- Baseline: current atlas idle f0/cell 0 and approved title-style neutral/combat v01 at native 256-pixel cell size. Neutral is upright and combat/idle are crouched; occupied height is not a stature denominator. The approved neutral is 82×186 occupied pixels and combat has a much wider bent stance.
- Both sidecars request `anatomy.measurement: auto-head`. The parent pack report says the import was refused on within-strip POP, so the current atlas is **unfitted**. No resulting fitted body exists to certify.
- Relay #25/#26 as supplied authorizes false-probe exemptions uSmash f4 and uair f3. The remaining pack warnings concern **uSmash f5 and uair f2**, different frames. The previous final-import report named f5/f2, whereas the current instructions name f4/f3. These are zero-based distinct cells, not interchangeable numbering. Do not silently expand or swap the exemption list.

## Probe diagnosis and every-frame inspection

| Strip/frame | Head visibility and anatomy |
|---|---|
| uSmash f0 | Unobscured; genuinely larger head than idle, fuller shirt and longer upright leg presentation. Connected anatomy. |
| uSmash f1 | Unobscured; larger head. Bent knees shorten occupied height normally; no actual small-head change. |
| uSmash f2 | Unobscured; larger head retained through deep crouch. Thigh/shin flexion explains low silhouette. |
| uSmash f3 | Unobscured; rising guard, large head retained. |
| uSmash f4 | Raised sleeve crosses the left/crown hair region; low head proxy is unreliable. Visible face and right hair remain consistent with preceding enlarged heads. |
| uSmash f5 | Raised sleeve again crosses hair, more severely; the 0.65 probe is not a real 35% head shrink. This second false probe is NOT the currently named f4 exemption. |
| uSmash f6 | Head readable again, same enlarged appearance; connected recovery, no clipped extremity. |
| uSmash f7 | Enlarged head and fuller torso persist into upright recovery; return to crouched idle changes pose as well as scale. |
| uair f0 | Large readable head; folded legs and loose shirt. No boundary clipping. |
| uair f1 | Large readable head; hands near chest, knees tucked. |
| uair f2 | Raised shoe is above head and corrupts the top-of-figure probe; actual head remains fully readable and large. The 0.74 reading does not represent actual hair dimensions. This is NOT currently named f3. |
| uair f3 | Raised shoe likewise above head; hair is readable except nearby shoe/leg can contaminate a broad color ROI. Large head persists. |
| uair f4 | Large readable head, folded kicking leg; no evidence of the actual head becoming small. |
| uair f5 | Large readable head and aerial recovery. Body does not enlarge in proportion to the head. |

All 14 figures retain connected major limbs in this atlas; no uTilt-style foreign boot or severed leg is present. This does not certify contact boxes or fine finger anatomy.

## Measurements and uncertainty

Measurements below are native packed pixels. Bright-hair horizontal spans use manually restricted head ROIs, alpha >128, RGB minimum >145 and channel spread <82. They measure hair silhouette, NOT skull diameter, and carry approximately ±2 px uncertainty for readable heads. Raised sleeves, shoe highlights and face highlights can contaminate a broad ROI, so obstructed rows are withheld. No color-area proxy is used as a limb length.

| Reference / frame | Readable bright-hair width | Relative to idle 43 px |
|---|---:|---:|
| idle f0 | 43 | 1.00 |
| uSmash f0/f1/f2/f3/f6/f7 | 49 / 51 / 50 / 50 / 51 / 50 | 1.14–1.19 |
| uSmash f4/f5 | withheld: sleeve occlusion | not numeric passes |
| uair f0/f1/f2/f4/f5 | 56 / 58 / 55 / 57 / 57 | 1.28–1.35 |
| uair f3 | withheld: ROI contamination from raised shoe/leg | not numeric pass |

Readable uSmash hair vertical spans are about 33–34 px versus idle 28; uair about 37–38 px. Hair style/pose contributes uncertainty, but repeated width and height differences across readable frames establish genuine enlargement in addition to probe errors.

Manual garment/limb landmarks from the atlas are approximate, explicitly not a five-segment ±6% pass:

| Segment | idle f0 | uSmash f0/f7 | uair f0/f5 |
|---|---:|---:|---:|
| Collar to shirt hem along torso | about 43–48 px | about 48–54 px | about 43–49 px |
| Visible shoulder-to-elbow-to-wrist chain | about 39–46 px | about 43–50 px | about 46–54 px |
| Hip-to-knee-to-ankle chain | about 62–70 px | about 68–77 px | about 69–80 px |
| Readable shoe long axis | about 22–27 px | about 24–29 px | about 28–34 px |

Landmark uncertainty is ±4–6 px for garment ends and ±6–10 px for joint chains hidden by shorts/sleeves. These are visual interval estimates, not automated skeleton measurements. The airborne diagonal shoes are not compared by axis-aligned box height. Clothing fullness is visibly greater for uSmash, whereas uair's shirt length is near idle despite its much larger hair. Approved combat has the same lean build and substantially extended bent stance; neutral confirms a lean adolescent body, not a universal head-count target.

A hypothetical width fit for uSmash is 43/50 ≈0.86; its estimated 48–54 px shirt becomes 41–46 px, plausibly near idle. That is a diagnostic estimate only; there is no authorized successful fit to inspect. A width fit for uair is 43/57 ≈0.75; its estimated 43–49 px shirt becomes 32–37 px, conspicuously shorter than idle's 43–48 px, with shortened limb chains as well. The body/head imbalance makes forcing a whole-strip head fit particularly unsafe for uair. Do not convert these estimates into an anatomy sidecar or a pass.

## Disposition

Keep both on technical HOLD. Ask the approvals desk to clarify the additional false-probe frames (uSmash f5 and uair f2) and whether a measured trial is authorized. uSmash could plausibly fit without becoming undersized, but must be repacked and audited after any authorized correction. **For uair, report the likely small-body outcome before forcing a fit; a source-proportion correction or explicitly accepted tradeoff requires the user's decision.** Neither a probe exemption nor this audit approves the image. Parent coordinator owns relay, shared records and further pack work.

Evidence: ENG112_R2_FIT_CONTACT.png (all frames and approved cells), ENG112_R2_FIT_DETAIL.png (nearest-neighbor enlargement), ENG112_R2_FIT_LANDMARKS.png (native cells with y guides). These are analysis crops of the exact atlas; no art pixels were retouched.

## SHA-256 provenance

- `public/characters/killua/sheet.png`: `a6b587ae059e25750ffbaf2a8e58d18eaec8da5ee37d3de712bc14b1cf66bbd2`
- `public/characters/killua/anims.json`: `225976cebf31728cd0284614653888829b03b56bcbf2a6049f220bbe3beaf0f1`
- `art/characters/killua/raw/uSmash_v02.png`: `c3576858c65b7e2ed1141621c4a27ac53af54459dbbccf248f4d8a41a6c43732`
- `art/characters/killua/raw/uSmash_v02.json`: `8c2879f0f010fd12accbaedcc5d41442d01e3f81d032b991e3595b1d22133f0a`
- `art/characters/killua/raw/_qa_hold/uair_v02.png`: `6cee89c056c9d64053502c275aa25ac7d966cdf24448571b19aa54c3cdfe051c`
- `art/characters/killua/raw/_qa_hold/uair_v02.json`: `8c2879f0f010fd12accbaedcc5d41442d01e3f81d032b991e3595b1d22133f0a`
- `art/manifest.json`: `7cdfb436e4bcc67cbadcdc3889c30d6233fba042fe5b25a1d71df3e68bdd0298`
- `public/art-review/title-style-pilot/killua-neutral_v01.png`: `86278707ba8f0fcb78942cbcedb3341d8ad8f559e95f8cbf48273d0bbdca1855`
- `public/art-review/title-style-pilot/killua-combat_v01.png`: `d32d8f9f297efac7bcd8ba7e0dfd34c4d458ada1fc5e45a9c93801340f5a63d6`
