# Goku core: relays 9, 11, 12 and 14; full-set approval

## Review

- **Current full-set gallery:** [Goku core review](https://gcd-tourney-n4nm8l3wq-eshin087s-projects.vercel.app/characters/goku/core-review-final/index.html) from committed branch HEAD `ef61b68d`. Historical audited calibration gallery: [r5](https://gcd-tourney-9rbjxyx11-eshin087s-projects.vercel.app/characters/goku/calibration-r5/index.html).
- The full-set gallery presents all 23 approved core strips at native 256px beside the approved idle, with exact frame playback, version labels, provenance and the retained getup runtime caveat. It reuses the exact quantized atlas frame extracts.
- **Goku light3 v13 is approved by the user via Claude relay #12.** Exact user quote: "Approve Goku light3 v13 and Luffy special v02 as drawn." This approval applies to light3 v13 only for Goku. Heavy v14 remains approved via relay #10 ("Approved").

Three-line verdict:

- **Identity:** face, hair, orange gi, blue clothing and boots match the approved references.
- **Proportions and pose:** compact stomach-height front kick, bent-knee chamber/recovery, and guard return are coherent against the approved idle within measurement uncertainty.
- **Technical:** exact 23-animation / 108-frame / 48-color strict atlas PASS at x1; no clipped pixels; top margin is narrow. Existing getup grounding/contact warning remains separate for Claude.

## Relay 11 result

Claude relay #11 relayed the user quote “Goku luffy retry,” authorizing exactly one light3 redraw call, the sixth cumulative call. It authorized generation only, not drawing approval. The exact generated source is `art/characters/goku/raw/light3_v13.png` assembled from preserved source v12; source v12 remains held under `raw/_qa_hold/`; the active v13 assembly is `raw/light3_v13.png`, with a byte-identical preservation copy under `_qa_hold/`.

- Source v12: 1659x948, SHA-256 `C2320840541EF2B9A9EBD5919F632BF40F733092CE2C2DDCD54F37467447DCB1`.
- Assembly v13: uniform factor `.696133442603862`, chosen from torso/boot/belt landmarks against approved references; SHA-256 `3A55C5C25E389C6336A3938EF9716929EEEA7D6A90B7D834FAF0ED06A701CBC8`.
- Astra final audit: `art/characters/goku/production/manual-audit-r5/FINAL_ATLAS_AUDIT.md`; all seven frames inspected and the actual 108-frame atlas passed within measurement uncertainty. All 101 retained frame alpha masks match the prior audited atlas exactly. The packer retained the candidate at x1; four small magenta specks were removed.
- The real branch strict pack reproduced the audited sheet and metadata exactly. Sheet SHA-256: `ebb27850371179a0fdc9da5d76816ebdb52b747712643b60cd40e14bfe6460ca`; metadata SHA-256: `b43af90a609dc0a36e688bad916c50694962ce2fced6fb02384cd400bcd814ca`.
- The user approved light3 v13 via Claude relay #12 ("Approve Goku light3 v13 and Luffy special v02 as drawn."). Manifest version and approvedVersion are both 13.

## Preserved candidate and approval rows

| Candidate | Review state | Technical result and provenance |
|---|---|---|
| light3 v10 source — `art/characters/goku/raw/_qa_hold/light3_v10.png` | Historical technical hold | Fifth cumulative generation call via relay #9. The exact source was recovered from its exact session folder and call window after the wrapper omitted the output hint; the original `output_hint` was not captured. Receipt and caveat are recorded in `production/relay9-generation/GENERATION_LEDGER.md`. |
| light3 v11 — `raw/_qa_hold/light3_v11.png` plus `light3_v11_roomy_280.png` | Technical HOLD; historical, excluded | At uniform `.62`, the 256px diagnostic clips 800 foreground-mask pixels; the same-density 280px companion preserves the full scaled drawing. |
| light3 v12 source — `raw/_qa_hold/light3_v12.png` | Preserved exact call-6 source | Sixth cumulative call via relay #11. Exact returned path, prompt/reference hashes and tool receipt are in `production/relay11-generation/light3_v12_call_receipt.json`. |
| light3 v13 — `raw/light3_v13.png` | Exact 108-frame technical PASS; approved via Claude relay #12 ("Approve Goku light3 v13 and Luffy special v02 as drawn.") | Uniform `.696133442603862` assembly. Final quantized atlas PASS at x1; no clipped pixels. Evidence in `production/relay11-generation/ASSEMBLY_V13.json` and `production/manual-audit-r5/FINAL_ATLAS_AUDIT.md`. |
| heavy v12 source — `raw/_qa_hold/heavy_v12.png` | Preserved; v14 remains current | Fifth cumulative generation call via relay #9; source, prompt/reference hashes and ownership evidence in the relay9 generation ledger. |
| heavy v13 — `raw/_qa_hold/heavy_v13.png` | Superseded diagnostic; preserved | Earlier uniform `.73` assembly, retained as history. |
| heavy v14 — `raw/heavy_v14.png` | User-approved via Claude relay #10 (“Approved”) | Uniform `.720`, bodyHeight235, native x1; exact prior 101-frame audit PASS. User approval is unchanged. |

Cumulative attempts: light3 six calls (relay #11 authorized and used call 6; no seventh call authorized); heavy five calls (relay #9 call 5). Assembly, quantization and packing used no additional image-generation calls. All source and versioned history remains preserved. The old technical-only light3 v05 assembly and sidecar are archived under `raw/_rejected/`; its roomy diagnostic remains in the production evidence folder.

## Audit and delivery limits

- Final audit: `art/characters/goku/production/manual-audit-r5/FINAL_ATLAS_AUDIT.md`.
- Source measurements and candidate audit: `production/manual-audit-r5/SOURCE_SCREEN.md`, `SOURCE_MEASUREMENTS.json`, and `CANDIDATE_AUDIT.md`.
- Generation receipt, prompt, assembly and exact pack reports: `production/relay11-generation/` and `production/manual-audit-r5/`.
- Parent local browser QA from relay #9 is historical (`production/relay9-generation/PARENT_BROWSER_R4.md`). The parent CUA browser session was unavailable for r5; no new interactive browser QA is claimed. The committed preview build succeeded. Parent authenticated retrieval confirmed hosted sheet/meta match the exact audited hashes above, and hosted `data.json` is byte-identical to local SHA-256 `5d36078b1c6a11b246a2620de69235062547c46b2cb468b6ef2398b93d133a77`. Hosted `index.html` matches local content with only Vercel's 163-byte feedback toolbar script injected (deployment `dpl_5U3qZwYMtJx8xM39r8HkamWq2djM`); raw response hash is `b3c666f80bf79de1c9ee6ad8aa25dba3bc7f34ec4532f4c189db9b3d42270e6b`, local file hash is `b95a5dbb36f3de07fc2a0910f35fbe96dbd1885ae1862e70dbbb3cf8815c9bf0`.
- No gameplay contact, hidden-knee/ankle measurement, runtime timing, merge or production deployment is claimed.

## Relay 14 approval of all 23 core drawings (2026-10-16)

Gallery source: `public/characters/goku/core-review-final/index.html`. It reuses the exact audited atlas frame extracts, with all strips at native 256px beside idle frame 0, selectable cells and playback controls. The known getup floor/contact warning remains visible and links to the final atlas audit. **USER APPROVAL via Claude relay #14:** "Approve all 16 Goku strips and all 19 Luffy strips as drawn." Goku scope: run v09, dash v09, jumpUp v04, jumpFall v04, land v07, light1 v04, guard v05, hurtHigh v08, launched v08, down v05, getup v11, charge v05, beamCharge v07, beamFire v07, special v05 and win v05. All 23 Goku core drawings are now user-approved, including the earlier approvals listed above. No new image calls or pixel changes were made. Getup v11 still has the known floor/contact caveat for Claude runtime review; visual approval does not certify runtime contacts, timing or integration.
