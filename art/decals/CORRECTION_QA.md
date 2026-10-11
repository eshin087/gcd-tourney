# Core decal correction QA — 2026-10-11

All art remains unapproved. Five new versions are saved: crack_s v02 (A/B/C), scuff v02 (A/B), skid v02 (A/B), burn_lightning_big v02 (A/B), barrier_crack v02 (A/B). Each part used three built-in generation attempts and only its best candidate was filed. Previous versions and provisional style sheet v01 remain intact; no approved fixed-name reference was created.

The corrections reduce contamination but do **not** deliver a clean source-art pass. Recommend further correction before approval. Other 14 names retain their existing versions and baseline warnings; upper-left facet lighting still needs an art decision/correction on older stone sets. No character art, engine or packer code changed.

## Fresh source pack

Existing cleaned frames were moved to local `tmp/decal-before/frames`; all 19 names were imported from source. After adding explicit three-slot splitting for both barrier parts, the intermediate cache was moved to `tmp/decal-intermediate/frames` and the entire source import repeated. Final report: [pack-report-corrections.txt](pack-report-corrections.txt), exit 0, **19 names / 99 variants / 18 fringe warnings**. Barrier count is six and its grayscale-conversion warning is cleared. A cached repack can hide source warnings; the saved report is the fresh import.

| Name | Prior source-import warning | New source-import warning | Purple in final quantized cells |
|---|---:|---:|---:|
| crack_s | 3.9% | 2.9% | 0% |
| scuff | 3.8% | 1.9% | 0.284% |
| skid | 1.9% | 1.2% | 0.632% |
| burn_lightning_big | 4.7% | 1.1% | 0.449% |
| barrier_crack | grayscale conversion warning | no pack warning | 0% after grayscale conversion |

Raw source pixels after standard background removal remain imperfect: crack_s A/B/C 2.959% / 2.859% / 2.286% purple; scuff A/B 1.435% / 1.969%; skid A/B 1.328% / 0.944%; lightning big A/B 0.966% / 0.813%; barrier A/B 1.869% / 2.058%. Downsampling, grayscale conversion and quantization explain differences from final packed percentages. No threshold was relaxed to pass these assets.

All 99 packed cells have binary alpha and at most 24 colors per name. Every hot-key name retains pure white; lightning big has 15,371 hot pixels. See [variant-qa-corrections.json](variant-qa-corrections.json). Barrier sidecar splits three evenly spaced variants per part to prevent a gap heuristic joining the last two; visual inspection confirms distinct whole webs. Crack tips remain thin; tiny color fringe persists. Directional strips retain left-to-right motion. No new source image was overwritten.

## Tolerance loss audit

[tolerance-audit.json](tolerance-audit.json) compares original sources at 72, 90, 110 and 130 using the unchanged packer background removal. Higher tolerances did not clear fringe and removed pixels at least three pixels inside opaque areas (for example lightning big A loses 195 interior pixels already at 90). All sidecars retain 72. No tolerance 200 or warning suppression was used; no palette cleanup was hand-painted into generated outputs.

## Delivery and runtime

The review-only loader pauses simulation before loading and preloads the candidate pages for each group selection. The game releases images for unused groups, so a one-time loader was insufficient when returning to an earlier group; that cache shortcut was removed. No engine file changed.

The gallery bundles unchanged packer outputs under `public/art-review/decals/candidate/`. Its gallery and game harness use those files directly. The five previously tracked `public/preview/decals` files are removed from tracking and remain local only. Production `public/decals` is untouched. `game.html` loads the ordinary debug game and explicitly installs only this batch's candidate groups for review; it does not fetch a candidate atlas from `/preview/`.

The coordinator's current production build passed (79 modules). Hosted game validation is completed after publication and recorded separately; this document does not claim that step has passed yet. Check base, edge, lightning, fire and ki; rotate by 90 degrees and advance cooling. Sources and QA are available in the same gallery. This is review delivery, not approval or production integration.
