# Luffy r3 sparse-checkout recovery record

The first required strict-pack invocation ran after merging main but before sparse art sources were materialized. It reported “no PNGs in raw/ or frames/<anim>/”, packed 0 animations, and removed stale untracked public files. This was a sparse-checkout visibility issue, not candidate loss.

The exact old untracked public outputs were immediately restored from `production/r2-validation/previous-public/` and hash-verified against the pre-run captures:

- Old sheet: `307f96d497147975c7932628cf0ed59a45be8324e59f59cd9c660260ecd63631`.
- Old metadata: `db8345df426b8460b3cd269622a6821d1b19e7f579c021259f37b8578c9887f4`.

The documented `npm run pr -- art luffy` helper then materialized all 66 tracked raw files. The second strict pack found the selected versioned sources and held candidates, wrote the new 19-animation/91-frame actual atlas, and exited 0. See `r3-strict-pack.log` (the initial no-source result) and `r3-strict-pack-after-sparse-repair.log` (the real pack). The four held sources stayed in `_qa_hold`; no image generation or candidate substitution occurred.
