# Claude art handoff — ENG-112 Goku r2

Date: 2026-10-18. Branch: `art/normals-goku-r2`.

## User review needed

The one redraw round authorized by relays #41–#42 is complete. The candidates are uTilt v03 (call 3), uSmash v03 (call 3), and dSmash v03 (call 2); all attempts and hashes are retained in `raw/ENG-112_GOKU_R2_PROVENANCE.md`. The user-facing packed review page is `public/reviews/normals-goku-r2/index.html`.

Astra's exact quantized-atlas audit is `production/ENG112_R2_ASTRA_AUDIT.md`. All three remain technically held: uTilt/uSmash are visibly smaller than idle02, and dSmash is oversized, does not clearly show both low active strikes, and frame 2 cannot retain the four-pixel side margins by offset alone. The selected atlas uses a temporary placeholder scale manifest for diagnostics and must not ship. Working `art/manifest.json` has no scaleManualQA passes for these candidates. No new image calls remain in this authorization.

Please ask the user through the combat lane whether to authorize another scoped repair round or keep these moves on their stand-ins. No visual approval is recorded. After the user decision, check the delivered relay and act once. The original seven Goku moves remain as approved and merged on main; this branch contains only the three follow-up candidates plus their review and audit records.
