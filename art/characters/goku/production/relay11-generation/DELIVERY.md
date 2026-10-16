# Goku relay 11 delivery

Light3 v13 is now in the real branch atlas after Astra's exact 23-animation/108-frame strict audit. User drawing approval is still pending; the gallery explicitly asks for `approve Goku light3 v13`. Heavy v14 remains user-approved from relay #10.

- Gallery path: `public/characters/goku/calibration-r5/index.html`.
- Final sheet/meta SHA-256: `ebb27850371179a0fdc9da5d76816ebdb52b747712643b60cd40e14bfe6460ca` / `b43af90a609dc0a36e688bad916c50694962ce2fced6fb02384cd400bcd814ca`.
- Real strict pack report: `production/manual-audit-r5/real-branch-pack-report.json`; it reproduces the final audit hashes and packs light3 v13 at x1. One pre-existing getup grounding/contact warning remains.
- Astra report: `production/manual-audit-r5/FINAL_ATLAS_AUDIT.md`. All 101 retained frame alpha masks are unchanged; the final atlas has 108 frames total.
- Call count: light3 six cumulative calls, exactly the sixth authorized by relay #11; no seventh call. Source v12 and measured assembly v13 are both retained under `_qa_hold/`, and the selected v13 is also under `raw/`.
- Parent's r4 interactive browser QA is historical. The parent CUA browser session is unavailable for r5, so no new browser-interaction check is claimed. Committed preview: https://gcd-tourney-9rbjxyx11-eshin087s-projects.vercel.app/characters/goku/calibration-r5/index.html. Vercel built successfully from committed branch HEAD `3bc9169b`.
- Parent authenticated hosted retrieval verified the exact atlas sheet and metadata hashes above. Hosted `data.json` SHA-256 `5d36078b1c6a11b246a2620de69235062547c46b2cb468b6ef2398b93d133a77` matches the local file byte-for-byte. Hosted `index.html` is the local page plus Vercel's 163-byte feedback toolbar script (`https://vercel.live/_next-live/feedback/feedback.js`, deployment `dpl_5U3qZwYMtJx8xM39r8HkamWq2djM`); local SHA-256 `b95a5dbb36f3de07fc2a0910f35fbe96dbd1885ae1862e70dbbb3cf8815c9bf0`, hosted-response SHA-256 `b3c666f80bf79de1c9ee6ad8aa25dba3bc7f34ec4532f4c189db9b3d42270e6b`. No browser-interaction QA is claimed.
- Parent's static/source artifact check verified the gallery's image/evidence links exist. The light3 and heavy approval players now point at the exact audited atlas cell extractions and matching contacts, not standalone diagnostic pixels. This is artifact/source verification, not browser runtime QA.
- Review request: approve light3 v13 as drawn through Claude `0 - Approvals`; technical audit does not grant drawing approval.
