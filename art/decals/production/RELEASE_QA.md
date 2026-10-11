# Decal release QA - 2026-10-11

User approved the final previews for PRs #52-54, then explicitly authorized Codex coordination while Claude was paused, and separately authorized production deployment. Merged sequentially: #53 (local f06c473), #52 (0842ae7), #54 (7f2410d). GitHub reports all three MERGED. Production is committed main 7f2410d at https://gcd-tourney.vercel.app (deployment gcd-tourney-rd2bvz57j-eshin087s-projects.vercel.app).

- Packer regression: 308 passed, 0 failed. Production build: 80 modules, exit 0.
- Approved atlas: 31 names / 143 variants, 5 stored pages, maximum 4 loaded pages per pairing. Integration audit compares every variant's pixels against the three user-reviewed galleries; zero differences. Metadata is preserved apart from atlas placement and source approval flag.
- Live atlas JSON and all five PNGs exactly match local production files (release-qa.json).
- Browser: ordinary production lab registers all 31 names as custom ground damage. Naruto/Sasuke Ground damage scenario and Gojo/Sasuke Lapse Blue run; no captured warning/error logs. This is a focused smoke check, not an exhaustive gameplay soak.
- Existing visual caveats remain user-accepted: final cached combined pack has 13 color warnings; historical fresh-source reports are retained. No claim of clean source art.
- No engine/tool/character diff from pre-integration ce3ccd4. Other character redraw work and PR59 were not changed.
- Three merged decal worktrees removed. Versioned sources and QA remain in local main; GitHub keeps the project's usual filtered copy. Untracked scratch notes/cache backups preserved under .worktrees/_preserved-decals.

The separate provisional style sheet was not part of the approved final gallery and remains pending; it does not block these shipped decal versions. Historical review galleries retain their original unapproved labels as review snapshots; manifest/REVIEW and this release receipt record the subsequent approval.
