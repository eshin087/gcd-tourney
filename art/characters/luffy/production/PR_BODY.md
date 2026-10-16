# Luffy core: special recovery v02 review candidate

This update adds a single unapproved special recovery candidate, v02. It preserves the six original source-A poses and adds only the f6 partial retraction and f7 return-to-guard poses. Down v03 and getup v03 were separately approved by the user via Claude relay #10 (“Approved”); their approval does not extend to special v02.

## Review the candidate

- Preview gallery: [open Luffy special v02 review](https://gcd-tourney-j45zd4bei-eshin087s-projects.vercel.app/characters/luffy/calibration-r6/index.html) (interactive one-shot playback, native 256px cells, approved reference context, source A preservation comparison, exact call receipt and final audit).
- Please reply **“approve luffy special v02”** or provide pose/design feedback. This is the only art approval requested here.

## Proposed review rows

| Date | Character | Asset | File | Version | Status | What changed | QA notes |
|---|---|---|---|---|---|---|---|
| 2026-10-16 | luffy | down | `art/characters/luffy/raw/down_v03.png` | v03 | approved | Deterministic measured reassembly, replacing only f1; f0 source preserved. | User approved via relay #10 (“Approved”). Technical pass on final strict r5/r6 atlases; runtime contact and grounding remain separate. |
| 2026-10-16 | luffy | getup | `art/characters/luffy/raw/getup_v03.png` | v03 | approved | Five original complete figures uniformly reassembled at measured density. | User approved via relay #10 (“Approved”). Technical pass on final strict r5/r6 atlases; runtime contact and grounding remain separate. |
| 2026-10-16 | luffy | special | `art/characters/luffy/raw/special_v02.png` | v02 | needs review | One generation call (cumulative 5/5) supplies only f6/f7; original f0–f5 source A is preserved. | Astra final strict r6 audit PASSed all 108 actual quantized frames within uncertainty. f5→f6 projected arm reach contracts about 107→78px (±5px); f7 returns to guard. f7 torso 38.8±5px and shin 52.8±6px vs idle 41.5±6px / 52.8±6px. No design approval, timed playback certification, or runtime/contact validation. |

The final 48-color strict pack contains 23 animations / 108 frames. Special is included only as an unapproved preview candidate for this review; do not treat this PR preview as release approval.

- Sheet SHA-256: `e8d5ba9f95a833af82bd13441d3099d15cf44449573e15db5af404f01eb92ce0`
- Metadata SHA-256: `7acf280f3c8a7b7b7f2ae8ec75119d8bc61c42e507faaa6ae14a1ee84816ebcd`
- Astra report: `art/characters/luffy/production/manual-audit-r6/FINAL_STRICT_AUDIT.md`
- Attempt receipt and prompt/input hashes: `art/characters/luffy/production/relay11-generation/PENDING_CALL.md`
- f0–f5 source preservation comparison: `art/characters/luffy/production/relay11-generation/special_v02_sourceA-preservation.json`

The image-generation budget is exhausted for this round: the relay #8 input-validation failure counted as call 4/4; relay #11 authorized and used exactly one fifth call, which returned special v02. No retry remains. Manifest status is `packed`, while the review row remains `needs review` and `approvedVersion` is unset.

## Preview verification

The preview build completed successfully from committed worktree commit `c85c1e710b8a0d215033cee66e514432f60e5bf7`. Static review checks confirmed the published 23-animation / 108-frame sheet and metadata hashes above; all gallery asset links resolve. The coordinator also verified that the eight review cells are RGBA-identical to their actual public atlas crops and that frame durations match metadata. Live browser playback QA was unavailable after the desktop browser transport reset, so no browser playback claim is made here.

The coordinator's authenticated hosted-content check confirmed the exact sheet, metadata, and `frames.json` SHA-256 values against this audit/gallery. Hosted HTML contains the standard Vercel toolbar and line-ending normalization; the hosted browser itself was not used for playback QA.

## Other checks and remaining limits

The strict pack reports ten active frames using the front-28% fallback hitbox and the known placement clips. The four user-accepted placement exceptions remain run rear foot f3/f4/f7, airLight1 fist f2/f3, light3 toe f3, and light4 foot f4. Claude separately accepted beamFire arm-continuation clips. These placement/contact items are distinct from the special anatomy audit and remain gameplay integration checks. Runtime timing, contact zones, grounding, and gameplay feel are not certified here.

Astra's audit is technical anatomy/scale and static sequence evidence, not image approval. No merge or production deployment is included.
