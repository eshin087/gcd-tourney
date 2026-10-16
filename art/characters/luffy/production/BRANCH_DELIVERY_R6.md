# Luffy r6 branch delivery

- Source branch: `art/luffy-core`
- Source commit in the preview: `c85c1e710b8a0d215033cee66e514432f60e5bf7`
- PR: #96
- Preview: https://gcd-tourney-j45zd4bei-eshin087s-projects.vercel.app
- Gallery: https://gcd-tourney-j45zd4bei-eshin087s-projects.vercel.app/characters/luffy/calibration-r6/index.html
- Strict pack: 23 animations / 108 frames, 48 colors; sheet `e8d5ba9f95a833af82bd13441d3099d15cf44449573e15db5af404f01eb92ce0`; metadata `7acf280f3c8a7b7b7f2ae8ec75119d8bc61c42e507faaa6ae14a1ee84816ebcd`.
- Astra final strict r6 report: `manual-audit-r6/FINAL_STRICT_AUDIT.md`; all 108 actual quantized frames PASS within stated measurement uncertainty. Special v02 is `packed` for the review preview; its review row remains `needs review` and it is not user-approved.
- Static artifact checks: all gallery asset links exist; coordinator confirmed eight gallery cell images exactly match the corresponding public atlas RGBA crops, and the inline playback script parses with durations bound to metadata.
- Live browser playback QA was unavailable after the desktop CUA browser transport reset. No browser playback, gameplay contact, grounding, or runtime claims are made.
- The first preview attempt hit a network package-info fetch error and an `EPERM` temp-path resolution error. Retrying the authorized PR preview under scoped escalation succeeded. The deployment helper could not remove its temporary export because the folder remained locked; it is isolated under `art/characters/luffy/production/deploy-scratch/` and is eligible for the helper's stale-export cleanup.

The preview contains an unapproved candidate pack for user review only. No merge or production deployment was performed.

## Hosted content verification

Coordinator authenticated-fetch verification matched the hosted sheet SHA-256 `e8d5ba9f95a833af82bd13441d3099d15cf44449573e15db5af404f01eb92ce0`, metadata SHA-256 `7acf280f3c8a7b7b7f2ae8ec75119d8bc61c42e507faaa6ae14a1ee84816ebcd`, and `frames.json` SHA-256 `1a56d1cb6d20d15a71b7276660dedaa09e59e23fb1a3b7f27eb58cb7891aded4`. Hosted HTML includes the normal Vercel toolbar and line-ending normalization; no hosted playback is claimed.

After setting only Luffy special v02 manifest status to `packed` (version 2 and `approvedVersion: null` unchanged), a fresh strict `--no-writeback` pack reproduced the public sheet and metadata hashes exactly. No redeploy was needed; the preview assets are unchanged.
