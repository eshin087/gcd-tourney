# Parent browser check: Goku calibration r3

2026-10-16, Codex in-app browser, local port 5241.

- Review URL: `/characters/goku/calibration-r3/index.html`. Use the explicit filename: the directory URL served the game fallback in local Vite.
- All 14 image elements loaded for the selected idle view; no captured warning/error logs. Native frame is 256 by 256px; the three reference cells are 768px wide combined, and the idle-first contacts retain native density in horizontal scrolling panels.
- Found and fixed page overflow during review. Final document width is 1265px at a 1280px viewport; source/contact panels scroll internally.
- `light1 v04` played once, stopped on frame 7/7 and restored Play. `charge v05` displayed the canonical four-frame 50ms loop; pause and next-frame controls showed frame 2/4. This checks viewer behavior, not every runtime transition.
- Gallery clearly identifies the 21-animation / 93-frame selected pack, the two excluded body-calibration holds (`light3 v09`, `heavy v11`), existing drawing approvals and zero new generation calls. The two held source panels are separate from selected gameplay pixels.
- `/?fight=goku,goku&mode=solo&art=custom&debug` visibly rendered the detailed custom Super Saiyan sprites during combat. Captured game warning/error logs were empty. No specific sprite-loader info message was captured.

Actual public sheet SHA-256 `fbccd9bf1958a7d3e7c701ea062aa2b99f031456e3d25cd010a81c47e5286054` and metadata `e98d7a2addcdbf932438ac43b89f507177b9071194359a40e042bab68fdfdc9f` match Astra's final strict audit.

Claude still owns horizontal root/strike offsets, getup floor contact, hit/hurtboxes and full timed gameplay checks. This smoke check does not approve images or authorize integration/production deployment.

## Published preview verification

Preview source commit db3b5aca: https://gcd-tourney-f5adk3i5g-eshin087s-projects.vercel.app/characters/goku/calibration-r3/index.html . Authenticated Vercel fetches confirmed the hosted sheet and metadata exactly match the two audited hashes above. The hosted index SHA256 is 7c1bfb185298518a3f49f4d3295c944ac8efd5560b3f8476dd1999d58fafbd4f; its 10,871-character committed page is unchanged, followed only by Vercel's 163-character feedback-toolbar script. The committed index SHA256 is bc8f50b38a0b778c0fa6f489964478c828aeae6f0e58158c8386066ddb9be07d. The preview build passed. Hosted interactive browser QA was not repeated; local interactive evidence is above.
