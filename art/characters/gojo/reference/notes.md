## Current status: complete batch approved

User approved all latest Gojo assets on 2026-10-09. Fixed model v03, expressions v02, idle v02 and UI copies are promoted. Full 42-animation atlas, strict packing and sandbox-compatible build pass. See ../production/QA.md for current results; the entries below are historical intermediate checks.

## Full candidate set — 2026-10-09

All 42 animations (175 frames) and three UI images are now generated. The user selected model v03 proportions and authorized full production without individual approvals. See [full QA](../production/QA.md) and [full review gallery](batch_review_v03.html). Earlier partial-batch notes below are historical. Final approval remains pending.

# Gojo production notes — 2026-10-09

## Current correction: user-selected proportions

The user rejected model v02 for its oversized head. It is preserved in `reference/_rejected/` and its review row is rejected. Their attached PNG was copied byte-for-byte as `model_sheet_v03.png` (SHA256 BEB03BEFE7857F1FDD30CD90AA3341B391D63044F52EB8B6DAE9A41914B8F389). Its small head, narrow adult face, long legs and slim silhouette override the earlier numeric head-ratio direction. Do not enlarge it again. This selects the production direction; it does not silently approve all generated assets.

Current assets: model v03, expressions v02, idle v02, run v03. Built-in imagegen generated expressions and both parts of idle/run from the supplied model. Run B needed one arm-swing correction. Source parts were stitched unchanged with a 24px gutter. Prompts and correction text are in `production/proportion-correction-prompts.json` and `production/movement-correction-prompts.json`.

Packing: `node tools/pack-sprites.mjs gojo --quantize 48` passes with zero warnings. The 16-frame atlas has 48 colors, binary transparency and no residual magenta or clipping. Idle hair top y20-22, soles y240, lower-foot center variation 0.46px. Run placement keeps the head centered near x156; grounded soles y240 and flight soles y227. The packer automatically split one touching pose group; the inspected contact sheet retains all eight poses. Raw reference/background/palette variation remains. Run arm swing transitions at the half-cycle remain a visual caveat.

### Testing without elevation

- `node art/characters/gojo/reference/qa/browser-qa.cjs` runs successfully with normal sandbox permissions. It starts and closes a loopback-only Vite server and headless Chromium. Game HTTP 200; custom Gojo sheet loads; fight starts in idle; holding KeyD selects run and changes x from -3.4 to -1.5671; no page/console errors. Browser audio-autoplay and WebGL performance messages are non-error diagnostics. Current game screenshots were visually inspected.
- The corrected local preview loads both references and the atlas. Frame scrubbing selects run frame 4 and pauses playback. Evidence: `qa/browser-result.json` and `qa/game-*.png`.
- `node art/characters/gojo/reference/qa/build-local.mjs` runs the art-index prebuild and the existing Vite build with `resolve.preserveSymlinks: true`. It passes inside the sandbox (60 modules). This standard Vite resolution option avoids the Windows realpath EPERM; it does not alter filesystem permissions or sandbox settings. The unmodified `npm run build` still encounters that EPERM. No engine/tool/config files were changed.

No per-step approval stop is requested. All corrected candidates retain final-review status, and no approved fixed-name copies were created. Full combat/UI production remains outstanding (2/42 animations currently packed).

## Earlier batch history (superseded)

The user authorized bulk reviews and provisional candidate references. Latest batch: model_sheet_v02, expressions_v01, idle_v01, run_v02. All approvedVersion values remain null; no fixed-name approved references have been created.

## Generation and references

- Built-in image generator used throughout. Model v02: selected third attempt, enlarged heads on a fresh pixel-art redraw after the first edit changed arm positions. Five requested views retained. Front anatomical skull-to-chin is estimated around 105-115 raw px, skull-to-sole around 740 px: roughly 6.4-7 heads. The skull is hidden by hair, so this is an estimate. Hair is exaggerated and the canvas figure scale still exceeds the 430px brief. Raw background and palette retain generated color variation.
- Expressions v01: S2 prompt, provisional model v02 attached; eight right-facing faces in the requested 4x2 order, only face 8 reveals blue eyes. Larger than nominal 4x scale. Raw near-magenta remains.
- Idle v01: A01 Part A/B, provisional model v02 and expressions v01 attached; B also attached A. First attempt each. Two 1536x1024 images stitched unchanged into 3096x1024 with a 24px magenta gutter.
- Run v01: A02 A/B with provisional model/expressions/idle; B also attached A. B retry reverses the near/far arm swing. Same stitch geometry. Raw v01 preserved.
- Run v02: identical image/parts to v01 plus supported frameOffsets sidecar. Corrects gait-dependent foot centering that displaced the head from x136 to x206. Flight frames f3/f7 lifted 6px. No bodyHeight or gameplay changes.

## Packed QA

Command: `node tools/pack-sprites.mjs gojo --quantize 48` (direct equivalent of the npm sprites script; PowerShell npm forwarding dropped --quantize in one attempt).

- 2 animations, 16 frames, 4096x256 atlas, pivot [128,240], ppu128. Exactly 48 colors, binary alpha, zero near-magenta pixels, zero packer warnings or clipping.
- Idle feet: all soles y240, lower-foot center x120.05-120.46 (under 0.5px variation). Hair top y20-26: f6 crouches more deeply than the requested subtle breathing. Hair shifts ~4px horizontally. Review loop smoothness visually.
- Run: grounded soles y240, flight soles y234. Hair centroid corrected to approximately x156 throughout. Down poses compress by ~12px; arm-swing seam and head-size match to idle still need aesthetic review. Automatic split separated two touching pose groups; all 8 poses are present and complete in the contact sheet. A few detached dark pixels remain near the trailing foot in the down poses; visual cleanup may be warranted.
- Atlas is intentionally partial: 21 core and 19 optional animations remain. Preview requires `?art=custom`; full combat art is not complete.
- Quantization is applied to the packed atlas. Source generations stay unchanged; references are not palette-cleaned. The quantize mode does not write cleaned frames, so QA reads the actual game atlas.

Evidence: `qa/packed-metrics.json`, `qa/movement-contact.png`. `qa/inspect.mjs` regenerates those from the atlas without editing art.

Browser QA passed in Chromium at the Gojo-vs-Gojo custom-art URL. The game logged its custom Gojo sheet, entered fight state with idle, then holding KeyD for 20 frames selected run frame 5 and moved x=-3.4 to x=-1.5671. No console or page errors; only WebGL performance messages. Screenshots visually inspected: correct right-facing player, mirrored opponent, aligned ground placement and visible running pose. This verifies the movement integration, not complete combat animation coverage or loop aesthetics. Evidence: `qa/browser-result.json`, `qa/game-idle.png`, `qa/game-run.png`. Temporary preview server closed after the check.

## Build

`npm run build` failed inside the sandbox: Vite EPERM realpath on index.html. The elevated build request was declined. Production build is unverified; this is not an art-packer error.
