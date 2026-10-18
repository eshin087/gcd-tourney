# Naruto Skills Revamp Batch 1 candidate provenance

Date: 2026-10-17 (client local date). Generation was directed under the required **gpt-6-luna / medium** assignment. The built-in imagegen interface exposes no runtime-model metadata, so the selected directing model cannot be independently verified from the output interface.

The brief permits at most three imagegen calls per asset, cumulative across versions. Every successful output is preserved in the Codex generated-images folder; only selected outputs are copied into the versioned raw tree. No versioned file was overwritten.

| Asset/version | Call ledger (source id) | Total calls | Inputs | Candidate finding |
|---|---|---:|---|---|
| `beamCharge_v09.png` | 1: successful output returned as data URL, no saved path; 2: `exec-4885cca5-e33d-4424-b8c9-369699cdd7ee.png` | 2/3 | Approved title neutral/combat only; specified old shroud raws were absent from sparse worktree. | Saved initial candidate; later v10 improved tail visibility. SHA-256 `12a9028f0a16441390dd880309c4ad798c374aa973e692284d1901497e7b6fce`; 2172×724. |
| `beamCharge_v10.png` | 3: `exec-bf8b802a-9626-47c1-9525-9fb0c4137138.png` | 3/3 | Approved title neutral/combat; main approved `beamCharge_v05.png` and `beamFire_v07.png`. | Raw three-panel strip has four readable tails by initial visual inspection; Astra found packed count 3/4/3. SHA-256 `f2e2198cbcee83237526bba820717405f214fad5aeca1d8fd1b0b5690cab5f7d`; 2172×724. |
| `beamFire_v13.png` | 1: `exec-894c8192-85e0-44b5-98cf-a5bed28b069a.png` | 1/3 | Approved title neutral/combat only; old shroud raws absent at first call. | Saved initial candidate; later v14 improves separated tail count. SHA-256 `55e88a5fc5584076d8b9679096294a18b0626dfe405d55c8d7e8ccc68661eece`; 2172×724. |
| `beamFire_v14.png` | 2: `exec-55e6c060-86a0-4650-b735-a1b582e79c06.png` (ambiguous tails; not filed); 3: `exec-808f6978-ae47-44ff-9917-ec086bf2f760.png` | 3/3 | Approved title neutral/combat; main approved `beamCharge_v05.png` and `beamFire_v07.png`. | Four tails are distinct, but packed f0/f1 clip front claws and f2 reads as landing, not a single-claw slam. SHA-256 `82335d9dad17ca81e828c8f3814ed8228c60841cd4c1df55f394c594ecb576e3`; 2172×724. |
| `ui_ult_fg_v02.png` | 1: `exec-82fb2070-0e53-4db9-b14e-693e76230bf3.png` | 1/3 | Approved title cells; old splash was not present in initial sparse worktree. | Initial candidate, later v04 is the corrected tail-count version. SHA-256 `e96e2c17c128612e861d1e89fc86779568729febe93cf64fbf1329bc5f69be0e`; 1254×1254. |
| `ui_ult_fg_v03.png` | 2: `exec-f3b1841c-3614-4d08-8434-d1852757efec.png` | 2/3 | Approved title cells; main approved `ui_ult_fg_v01.png` and shroud refs. | Astra found five distinct tails; superseded. SHA-256 `3403871dca1bb589e97e9c81f34c3e9bd237113696ceeac5d12c46c8e698a4c0`; 1254×1254. |
| `ui_ult_fg_v04.png` | 3: `exec-03232865-318e-498c-afb1-8d1d93c9ee69.png` | 3/3 | Approved title cells; main approved splash v01 and shroud refs. | Astra confirms four tails and full engulfment; fitted composite and anatomy calibration remain on hold. SHA-256 `b82b3ec384dc58868e5dd7992d3864fd10ca3034fcb76845129a70eef5f39088`; 1254×1254. |
| `fourTailsRoar_v01.png` | 1: failed reference lookup to nonexistent VFX file; 2: successful output `exec-a618f82d-56d2-4488-a4ac-f9d69e89eb70.png` | 2/3 | No image refs on the successful generation. | 8-stage shockwave art; 1774×887, exact cell slicing/anchor/palette not yet validated. SHA-256 `af5036ffa46e3dbe4a91531ef2e4faab0c42effd73815c1306e7a462f92a842d`. |

All generated source outputs are under `E:\Vibe Coding\.codex\generated_images\01a14cbb-a7b1-7d92-a81e-8d4c4420056c\`. B1, B2 and B3 each reached the three-call cap; no further image calls are authorized for them in this round. The A8 failed lookup counts as a call even though it produced no image.

## QA and current holds

- `node tools/pack-sprites.mjs naruto --quantize 48` first created a partial two-strip atlas because the sparse worktree had no idle. After expanding the worktree with `npm run pr -- art naruto`, the full 54-animation candidate pack stopped at the strict scale gate: no head found for the fully engulfed `beamCharge`/`beamFire`, and beamFire f0/f1 clip the right edge by 15–16 px. The strict full pack did not write its atlas or cleaned frames.
- The earlier two-strip partial atlas is 4096×256, exactly 48 colors, and contains six candidate cells. Astra inspected all six cells and loop transitions; report: [ASTRA_AUDIT_v01.md](skills-revamp-batch1/ASTRA_AUDIT_v01.md). B1 v10 and B2 v14 are HOLD. B3 v03 is HOLD; v04 corrects its tail count and the isolated UI packer produced a candidate-only 576×432 fitted foreground. Astra verified four tails and transparency; contrast and anatomical calibration remain HOLDs.
- `npm run scale -- naruto` and `npm run body -- naruto beamCharge beamFire` reported no idle packed and could not measure. No scale exemption or manual QA has been recorded.
- Claude has not yet reported that candidate packing for the new 256×256 HD effect cell works. `fourTailsRoar_v01` remains raw and unvalidated.
- The technical evidence page is [public/reviews/naruto-skills-batch1/index.html](../../../../public/reviews/naruto-skills-batch1/index.html). Its poster image CSS was corrected to preserve foreground alpha and avoid rounded-corner clipping; Astra rechecked the rule by source inspection. All candidates are unapproved; no approval request has been sent.


## User-directed no-call repairs (relay skills #2, 2026-10-18)

No new image-generation calls were used. The cumulative budgets remain 3/3 for beamCharge, beamFire and ui_ult_fg; fourTailsRoar remains at 2/3.

- `beamCharge_v11.png` is a manual pixel edit from v10: f1's four-tail fan field was copied onto f0 and f2 while preserving pixels outside the 400x400 source fan region in those frames. SHA-256 `9a739a0b8a860c05e1099e739ea11b4757562a39a3fb8cc6491febad35ee8317`. Astra confirms four tails in all three raw frames and identifies a visible rectangular join at f2 local x400, y200-390; this remains an explicit technical hold on the review page.
- `beamFire_v14.json` records translation-only offsets `[-21,0],[-21,0],[0,0]`, bound to source SHA `82335d9dad17ca81e828c8f3814ed8228c60841cd4c1df55f394c594ecb576e3`. Current sidecar SHA-256 `26d00103aa7cbbc52b5b964c4581488c1fc13f74c70c82d0f56da42bf98359b8`. Diagnostic pack reported no clipping or 4px margin warning; full packed verification remains withheld by the expected no-head scale gate. The user requested f0 as the claw-slam and f2 as landing; Claude's engine mapping is pending.
- `ui_ult_fg_v04.png` is unchanged (SHA-256 `b82b3ec384dc58868e5dd7992d3864fd10ca3034fcb76845129a70eef5f39088`). The review page uses a stronger warm CSS drop-shadow; product splash CSS is Claude's integration task.
- `fourTailsRoar_v01.png` is unchanged (SHA-256 `af5036ffa46e3dbe4a91531ef2e4faab0c42effd73815c1306e7a462f92a842d`). Temporary local merge of `feature/naruto-skills` at `7ff4c256` enabled candidate packing; it produced an 8-frame 2048x256 HD atlas. The merge was aborted afterward, so no Claude engine changes are included in this art branch.

The review page is a static review artifact. It does not certify runtime splash rendering, final character atlas packing, contact zones, or scale. Astra's audit v02 records the raw seam and the remaining evidence boundary.


## Four-Tails roar circular correction (relay skills #3, 2026-10-18)

No image-generation call was made. `fourTailsRoar_v02.png` (SHA-256 `c73b1d3e54be81e284af19b4d99cd2284758d986113b727b23f63adeba45cbd7`) is a pixel edit derived from the previously packed `fourTailsRoar_v01` HD candidate atlas (v01 atlas SHA-256 `ca9fb92683b474066393484c3ab75352d26037ac69541fc896be641dbb613bd1`). Each of the eight 256px cells received a hard circular mask centered at (128,128), radius 118px. The vfx manifest sets fill to 0.922 (target 236px) to prevent the packer from scaling the burst back to cell edges. Candidate packing on a temporary feature/naruto-skills merge (aborted after packing) produced eight cells at x1.000; all alpha pixels measured within radius 117.99px of each cell center, with no cell-edge contact. FourTailsRoar packer reported 14 isolated specks removed and no effect-specific warnings. No engine/tool changes are included in the art branch.


## User approval and final no-call cleanup (relay skills #4, 2026-10-18)

The user approved `beamFire_v14.png` with `beamFire_v14.json` and `ui_ult_fg_v04.png` via Claude relay skills #4: “Approve beamFire v14 (with its sidecar) and ui_ult_fg v04.” `beamFire.approvedVersion` is 14; `ui.ult_fg.approvedVersion` is 4; the fixed-name UI image is copied from v04. Superseded, unapproved `beamFire_v13.png` and `ui_ult_fg_v02.png`/`v03.png` were moved to their `_rejected/` folders under the approval promotion rule.

`beamCharge_v12.png` and `beamCharge_v13.png` are preserved no-call repair history. The current `beamCharge_v14.png` derives from v13 and clears only f0/f2 pixels in the donor-empty source-local region x=500..534, y=173..305, in addition to the irregular fan-field correction. The extra disconnected/forked tail remnants are removed without touching any pixels at y>=436 compared with v11. No new image-generation call was made; cumulative budget remains 3/3. The new candidate is unapproved. Final Astra audit: [ASTRA_AUDIT_v05.md](skills-revamp-batch1/ASTRA_AUDIT_v05.md).

`beamCharge_v13.png` through `beamCharge_v16.png` are successive no-call pixel-edit revisions. Astra audits v03-v05 documented, then helped locate, the detached/stump/fork artifacts and rectangle boundaries. v16 extends the f1 donor fan field through the tail base for f0/f2 and leaves lower-body pixels y>=436 identical to v11. v16 SHA-256: ec041c2c287304471d7b0fa174e17e9681b7a86b376261456965171458df077c. The current image remains unapproved pending [ASTRA_AUDIT_v07.md](skills-revamp-batch1/ASTRA_AUDIT_v07.md) and user review.

`beamCharge_v17.png` is the current no-call repair candidate. It derives from v16 and replaces f0/f2 pixels inside the irregular contour of the f1 rightmost tail, then clears the old f0/f2 remnant where f1 has only background. The mask is not rectangular; no new image-generation call was used. SHA-256: 739422e85c83f572808abcb5a5f4cbd48e4bb68c2a8a879dcdd7ae58787fc9a3. The candidate is unapproved pending [ASTRA_AUDIT_v08.md](skills-revamp-batch1/ASTRA_AUDIT_v08.md).
