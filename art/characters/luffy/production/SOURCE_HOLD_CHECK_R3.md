# Luffy source-hold check r3

Read-only inspection of the original generation files for `special_v01` and `launched_v01`. No source or candidate pixels, packing outputs, manifest values, approval states, or attempt counts were changed. This note does not approve either candidate or authorize a new generation call.

## Special v01: recovery poses are absent from the generated sources

The source-call inventory in `REVIEW_ROWS.md` binds the original two selected generation outputs:

| Part | Exact original source | Bytes | SHA-256 | Source canvas | Visible whole-figure bounds after magenta removal |
|---|---|---:|---|---:|---|
| A, frames 0–5 | `E:\Vibe Coding\.codex\generated_images\01a13b02-1fa9-7633-a85b-094064bb6f4e\exec-4e1d7b69-cb25-4246-9d18-a3912b3c0edb.png` | 1,622,738 | `7ec7381d83ca597c9e91f6c05bc7390c241a0fc24befa9a77e506828d1a55ceb` | 2172×724 | f0 x13–365 y188–580; f1 x372–704 y191–580; f2 x717–1022 y188–580; f3 x1029–1356 y188–580; f4 x1368–1736 y188–581; f5 x1739–2156 y188–581 |
| B, selected as frames 6–7 | `E:\Vibe Coding\.codex\generated_images\01a13b02-1fa9-7633-a85b-094064bb6f4e\exec-76749e07-ed51-489f-b6c0-1675277edd0c.png` | 1,405,822 | `f8612f7c756f8d2ddad120b6fa8182056b2ef923128f6ba27ea75824fb26a22f` | 2172×724 | first pose x386–935 y92–657; second pose x1344–1876 y92–658 |

The first source has six distinct, complete action poses. The selected second source visibly contains two complete fighting-guard poses. It does not contain the requested arm retraction at f6 or upright return at f7. These missing actions are not hidden by the six-to-two part boundary and cannot be recovered by changing a crop or stitch factor.

There is also a separate assembly cut: current `raw/_parts/special_v01_B.png` is 1448×724, SHA-256 `d1be8cf34c5c1da435154f4b97b9696749701ef0fd73fa43c13e4e8dafa8e87f`. It crops through the first original pose on its right edge and the second pose on its left edge. The selected held strip `raw/_qa_hold/special_v01.png` is SHA-256 `df4bda5a14e459392d04bbc792716d32c034b002fa1eac1b836f0a0a12589ea2`. Recovering the original full guard figures could remove those crop cuts, but would still not provide f6/f7 recovery motion. Current cumulative count remains 3/3; no new call is available in this assignment.

## Launched v01: intact source; measured uniform rescale is geometrically plausible

Original generation output: `E:\Vibe Coding\.codex\generated_images\01a13b02-1fa9-7633-a85b-094064bb6f4e\exec-996b1beb-0620-4066-a07f-c16f24c5ad21.png`. It is byte-identical to `raw/_qa_hold/launched_v01.png`: 1,496,540 bytes, SHA-256 `fd0f981ecab9f4661a524b04d562010f530f4bf49aea339b14e303bdc599025b`. Canvas is 1774×887. Both source figures are fully inside the image: f0 x79–830 y137–733 (752×597); f1 x946–1705 y146–760 (760×615). Visible hair, hands, legs, and sandals are present in both source drawings; neither figure touches the source canvas edge. The original does not establish a missing-limb redraw need.

The current manifest target is `bodyHeight: 136`; normalizing the tallest source silhouette (615px) to that target gives factor 136/615 = 0.2211. Astra’s existing r2 source-to-idle measurements for the packed candidate are uncertain (±6px per segment): shin 36.7px and 39.8px versus idle 52.8px; neck-base-to-sash 29.8px and 27.8px versus idle 41.5px. The four direct target/source ratios are 1.439, 1.327, 1.393, and 1.493; their median is 1.416. Using a single illustrative factor of 1.413 across both original source poses would yield approximately:

| Frame | Estimated scaled whole-figure bounds | Safe content width |
|---|---:|---:|
| f0 | 235×187px | 248px |
| f1 | 238×192px | 248px |

Thus a uniform measured reassembly at roughly 1.41× appears to fit the horizontal cell width and cell height without drawing a replacement pose. The corresponding bodyHeight would be roughly 192px rather than the current 136px so the packer would not normalize the enlargement away. This is a geometry estimate, not a pass: the source segment endpoints were measured on the already normalized candidate, each has ±6px uncertainty, and pivot placement, head/build/clothing-volume continuity, strict scale gate, and final packed anatomy would need to be checked on any derived version. No reassembly or candidate version was created here. A deterministic source-based rescale/repack check can be considered before spending a generation call; coordinator approval and a full QA pass would still be required.

## Evidence used

- Candidate inventory and generation-call bindings: `REVIEW_ROWS.md` (special and launched rows and original source call inventory).
- Special part/candidate hashes and dimensions: `raw/_parts/special_v01_A.png`, `raw/_parts/special_v01_B.png`, `raw/_qa_hold/special_v01.png`, and `raw/_qa_hold/special_v01.json`.
- Launched source measurements and uncertainty: `production/manual-audit-r2/measurements.json`, `production/manual-audit-r2/measure.cjs`, and `production/manual-audit-r3/AUDIT.md`.
- This inspection read original source PNGs and existing files only. No pack command or source-writing operation was run.

## Follow-up: launched v02 deterministic calibration (2026-10-16)

The preceding statement describes the original read-only inspection only. After that check, the coordinator authorized one source-based calibration candidate with no generation call. The complete original `launched_v01` source was retained unchanged; `raw/launched_v02.png` is a uniformly resampled derivative, with per-frame offsets only to preserve original panel centers under the packer pivot. Its endpoints, ratios, uncertainty, exact source and candidate hashes, packed cell bounds, isolated quantized atlas hashes, and pending Astra gate are documented in [`launched-calibration-r4/launched_v02-QA.md`](launched-calibration-r4/launched_v02-QA.md). This candidate is not yet a measured pass and has not changed the actual public atlas or manifest.
