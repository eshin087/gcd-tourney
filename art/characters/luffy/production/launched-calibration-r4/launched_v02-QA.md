# Luffy launched v02 deterministic calibration diagnostic

Status: **pending independent Astra audit; not a scale pass or art approval.** The gameplay pack in `public/characters/luffy/` remains the audited r3 build and was not modified.

## Candidate and source

- Candidate: `art/characters/luffy/raw/launched_v02.png`, SHA-256 `834feedc5f97f0bc759601b4517da65fe4a50839910d3bdb8ee0bf6b226209ed`.
- Candidate recipe: `raw/launched_v02.json`; the immutable source is `raw/_qa_hold/launched_v01.png`, SHA-256 `fd0f981ecab9f4661a524b04d562010f530f4bf49aea339b14e303bdc599025b`.
- Source canvas: 1774×887. Figure bounds are f0 `[79,137]–[830,733]` and f1 `[946,146]–[1705,760]`; both original figures are complete and inside the canvas.
- Source-to-reference measurements come from `production/manual-audit-r2/measurements.json` and its `measure.cjs` landmark definitions. Idle shin is 52.8±6px; launched v01 shin is 36.7±6px and 39.8±6px. Idle neck-base-to-sash is 41.5±6px; launched v01 values are 29.8±6px and 27.8±6px. The four target/source ratios are 1.438692, 1.326633, 1.392617 and 1.492806; their median is 1.4156547739. Uncertainty is large relative to the segment measurements and is retained for Astra's assessment.
- A single uniform source resample uses `193/615 = 0.3138211382` so the tallest original figure maps to 193px. Both poses use the same scale; each keeps its original half-panel center. The sidecar offsets compensate only for packer foot-anchor placement. Resulting source pixel bounds are f0 236×187 and f1 239×193, with zero lost source pixels. The actual packed cell bounds are f0 `[14,54]–[249,240]`, f1 `[7,48]–[245,240]`.

## Isolated quantized pack

Command: `node tools/pack-sprites.mjs luffy --root art --manifest art/characters/luffy/production/launched-calibration-r4/manifest-diagnostic.json --out art/characters/luffy/production/launched-calibration-r4/public --no-writeback --quantize 48`.

The isolated output is 20 animations/93 frames, 4096×1536, quantized to 48 colors. It reports 18 already-manually-audited animations and launched v02 as the sole unmeasured animation; the 3 held core animations remain missing. This is a diagnostic output only. A prior invocation used a temporary manifest path that was not visible to a separate sandbox process; the packer consequently fell back to `animGuide.js`. That output was also isolated and is not used as evidence. The successful command above used the Luffy-local diagnostic manifest explicitly and left current public outputs unchanged.

- Diagnostic atlas: `public/characters/luffy/sheet.png`, SHA-256 `563832d5fc499f860a5a35e21f8e576c3885b4e1a9c76bd7173807187707a996`.
- Diagnostic metadata: `public/characters/luffy/anims.json`, SHA-256 `4267efd0a9d992af50cfe99d21da80319d16cbd02cb30495f4db98570253287d`.
- Actual packed launched frames are atlas indices 77 and 78. Native contact: `launched-v02-actual-cells-native.png`; 3× nearest-neighbor contact: `launched-v02-actual-cells-3x.png`. These are extracted from the exact atlas above.
- Reference evidence: `public/characters/luffy/calibration-r3/reference-approved-idle-f0.png`, `reference-neutral.png`, and `reference-combat.png`; the four approved cast neutral/combat cells remain under `public/art-review/title-style-pilot/`.

Visual extraction confirms both actual cells contain a complete airborne figure. The initial isolated fixture alone did not constitute an audit; Astra's later exact diagnostic finding and the separate final strict-fixture gate are recorded below. No user art approval is implied.

## Astra diagnostic result and final strict fixture

Astra's completed `production/manual-audit-r3/LAUNCHED02_AUDIT.md` reports **PASS within measurement uncertainty** on the exact diagnostic cells above. Corrected f0 neck-base/vest neckline `(94,96)` to sash `(121,129)` is 42.6±6px versus idle 41.5±6 and combat 40.5; f1 is approximately 39.1±6px. Exposed shins are 48.8±6px and 51.6±6px in f0, approximately 56.8±6px in f1, versus idle 52.8±6 and combat 54.6. Both frames show complete anatomy and coherent static recoil; there is no timed playback, runtime contact or grounding claim. Per-frame PNG/RGBA hashes are in `production/manual-audit-r3/LAUNCHED02_PIXELS.json`.

With that version-bound manual record in the Luffy manifest, the isolated final strict command `node tools/pack-sprites.mjs luffy --root art --out art/characters/luffy/production/launched-calibration-r4/final-strict-pack --no-writeback --quantize 48` exited 0. It packed 20 animations/93 frames at 48 colors and reported 1 reference/19 manual, with only down/getup/special missing as held core moves. Final strict sheet SHA-256 is `563832d5fc499f860a5a35e21f8e576c3885b4e1a9c76bd7173807187707a996`, byte-identical to the diagnostic sheet; metadata SHA-256 is `7c4cee7a4817fc31f2546c0eb358ed4f9533dcf9fb75c5c4c977d84bac144c6a`. Per-animation contacts and cell hashes for all 93 cells are indexed in `final-strict-pack/contacts/contacts-index.json`. Astra completed its full 93-frame recheck on those exact hashes: the previous 18 manual passes and launched v02 remain supported. The worker then ran the packer into `public/characters/luffy/`; public sheet and metadata hashes exactly match the audited fixture, so no additional pixel recheck was needed. The gallery is `public/characters/luffy/calibration-r4/index.html`. Three held core moves remain absent; user art approval and runtime/contact validation remain separate.
