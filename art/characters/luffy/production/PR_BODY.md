# Luffy core — r5 recovery candidates and strict audit

This update preserves versioned sources and adopts the final strict 48-color pack with the deterministic down v03 and getup v03 assemblies. Both candidates remain pending the user's image review. No image or design approval is implied by Astra's technical pass.

## Review gallery

[Open the down/getup r5 review gallery](https://gcd-tourney-82qk6yott-eshin087s-projects.vercel.app/characters/luffy/calibration-r5/index.html). It shows playback from the actual packed atlas, approved reference context, and native-size v01/v02/v03 comparisons. The gallery labels down v03 and getup v03 as review candidates and keeps special visibly held.

## Proposed review rows

| date | character | asset | file | version | status | what changed | QA notes |
|---|---|---|---|---|---|---|---|
| 2026-10-16 | luffy | down | `art/characters/luffy/raw/down_v03.png` | v03 | needs review | Preserves the original f0 source crop and rebuilds only f1 from its intact original source crop at a direct measured factor. | Deterministic assembly; no new generation call. f1 factor .205; bodyHeight 106 / pack scale 1. Astra final strict r5 audit PASS within measurement uncertainty on the exact adopted atlas. Runtime/contact and user art approval pending. |
| 2026-10-16 | luffy | getup | `art/characters/luffy/raw/getup_v03.png` | v03 | needs review | Reassembles all five complete figures from the original continuous source with one uniform measured density. | Deterministic assembly; no new generation call. Factor .477; bodyHeight 209 / pack scale 1. Astra final strict r5 audit PASS within measurement uncertainty on the exact adopted atlas. Runtime/contact and user art approval pending. |

Full proposed character-local rows, earlier versions, provenance, and attempt history are in `art/characters/luffy/REVIEW_ROWS.md`.

## Strict pack and Astra audit

- `node tools/pack-sprites.mjs luffy --quantize 48 --json --no-writeback` exited 0: 22 selected animations / 100 frames, 48 colors, 4096×1792. Special is the only missing CORE animation.
- Final sheet SHA-256: `0fc2f4a87b9c01991271209c04df2ee3913799ad626a9cd2a68d0f91fb54d122`.
- Final metadata SHA-256: `dc679a50fe5a7536c76be12272da040a36495a105dda6e3028d7abf96777598f`.
- Astra inspected all 100 actual quantized frames and PASSed all 22 selected animations within recorded landmark uncertainty. The retained 93 frames had zero alpha-byte differences from the prior audited pack; RGB changes from shared-palette quantization were visually rechecked. Exact measurements and per-cell hashes are in `art/characters/luffy/production/manual-audit-r5/FINAL_STRICT_AUDIT.md` and `FINAL_PIXEL_HASHES.json`.
- This is anatomy/scale evidence only. It does not approve art, runtime contact/grounding, gameplay feel, or release.

## Call inventory and remaining hold

- Down: 2/3 generation calls used. Getup: 2/3 used. The v03 files are deterministic assemblies, not additional image calls.
- Special: the authorized fourth request failed input validation before generation because it supplied six references to a five-reference limit. The failure counts as call 4/4; no special v02 source exists. A fifth special call is not authorized in this round and requires a new explicit user decision. Special v01 remains held and absent from the pack.
- Historical down v01/getup v01 geometry holds are superseded by v03; their versioned files and review history remain preserved.
- Four user-accepted placement exceptions remain documented: run rear foot f3/f4/f7, airLight1 fist f2/f3, light3 toe f3, and light4 foot f4. BeamFire arm-only clipping is a separate Claude continuation exception. Nine fallback hitboxes and remaining runtime contact checks are for Claude's integration review.

## Browser QA

Local parent browser QA verified the gallery playback, native-size comparison cells and references, visible special hold, and absence of console warnings/errors. Authenticated fetch of the hosted preview verified the exact sheet and metadata hashes above and the current r5/100-frame/special-held gallery content. The hosted browser itself requires Vercel sign-in, so hosted playback is not claimed. See `art/characters/luffy/production/relay8-generation/PARENT_BROWSER_R5.md`. This does not certify gameplay contacts or grounding.

## Delivery

- Source worktree commit: `3a0476c917d013a6c79b62a0553f7c3d4bdc4f8f`.
- Initial art-only slim branch head: `9add7fb9`.
- Preview deployment: https://gcd-tourney-82qk6yott-eshin087s-projects.vercel.app

No merge or production deployment is included.
