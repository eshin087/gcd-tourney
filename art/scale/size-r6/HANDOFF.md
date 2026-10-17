# ART-SIZE-R6 technical handoff

Task branch: `art/size-r6` in `.worktrees/art-size-r6`; reserved local port 5246. Scope includes all packed strips for Naruto, Sasuke, Killua, Gojo (excluding Gojo `dash`/`superDash`, owned by `art/gojo-dash-size`), Goku and Luffy. No camera or engine change was made.

## Inventory and screening

The baseline atlas inventory contains 230 strips and 40 readable comparison pages. Machine evidence is in [inventory.json](all-strip-sheets/inventory.json); the generated index with per-strip input, atlas, reference, probe and page hashes is [PACKED_INVENTORY.md](PACKED_INVENTORY.md). [FILTERED_CANDIDATES.md](FILTERED_CANDIDATES.md) reports the per-frame probe and body-area triage flags separately from segment evidence. Goku/Luffy pages are explicitly idle-only; their approved native reference provenance is recorded separately.

Independent visual screening across the six fighters found no other confirmed redraw. The lead lists remain unresolved until homologous segments are measured. Do not turn body-area B or scale-probe H into anatomy passes. The prior rough Sasuke/Gojo/Killua ratios that lacked endpoints remain withdrawn in [CONFIRMED.md](CONFIRMED.md); that file marks unresolved rows as holds rather than passes.

## Sasuke `beamStruggle`

The approved v01 raw and atlas are unchanged. Candidate v03 is an immutable byte-identical copy of approved v01, held at `art/characters/sasuke/raw/_qa_hold/beamStruggle_v03.png`; SHA-256 `00ADE94028B861DE74CE8095B5644A75D0AA5106013D4B55764B0045FDB993F1`. Manifest remains `version: 3`, `approvedVersion: 1`, production bodyHeight 122, and v03 `scaleManualQA` is pending.

I generated diagnostic-only packed comparisons at bodyHeight 146. Their candidate atlas hash is `F986CBDC5E9B1D48EF0B125DEB00CA4B71D4D200EEABE06D5464D456D23188BB`; the approved production sheet/anims were restored to `40AB6E09…BE873` / `685DD401…A12452`. The candidate page shows approved idle and combat, old packed v01, candidate frames with a player, and all three unchanged `beamStruggleAir` v01 frames: [review page](../../../public/reviews/size-r6/sasuke-beamStruggle-v03/index.html). It is a technical hold, not an approval request.

The head probe overreads because the extended navy sleeve shares the declared hair palette. Visual crown-to-chin estimates on v03 are near the idle range within ±2–3 px; this does not establish a repeatable >10% error. The purple-palette connected-component measurement is 46 px on idle f0 and 38–42 px across the candidate, but that component is fragmented and includes sash tails, so those are not comparable belt endpoints. The intended 44–48 px sash width needs Claude to mark the homologous endpoints on idle/combat and each beam frame. No manual-QA pass or calibration success is claimed. Details, hashes and the preserved v02-label incident are in [Sasuke v03 technical record](SASUKE_BEAMSTRUGGLE_V03.md).

## Other holds and next technical action

Killua `airLight2` v07 stays approved; v08 is held at `art/characters/killua/raw/_qa_hold/airLight2_v08.png` after the strict pack gate failed. Its generation ledger records two cumulative calls and the exact lost-call incident. The earlier unsupported leg/shoe ratios are withdrawn; no further call is justified.

Next: Claude annotates the intended Sasuke sash endpoints; Codex then records the same measurements for all three frames against approved idle/combat at native packed density, and decides whether v03 can meet both head and sash targets with one factor. Continue the six-fighter segment audit only for the filtered rows and preserve all uncertainty. Do not change production manifest scale data or ask the user to approve a technical hold. Final Astra audit, any user art approval, merge and deployment remain pending.

## Validation

- `node tools/pack-sprites.mjs sasuke --quantize 48`: the diagnostic bodyHeight146 atlas completed (44 animations, 181 frames, 4096×3072, 48 colors) only with a provisional manual-QA setting; that provisional setting was removed and the production atlas restored. Do not treat the diagnostic pack as passing final anatomy QA.
- `npm run build`: passed. The local adapter process for port 5246 is running, but the current browser and HTTP checks time out; no functioning preview URL is confirmed yet. No final Astra audit, art approval, merge or production deploy was performed.
