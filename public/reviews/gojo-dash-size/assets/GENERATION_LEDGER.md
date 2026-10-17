# ART-GOJO-DASH-SIZE generation ledger

Date: 2026-10-17. Worktree `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-gojo-dash-size`, branch `art/gojo-dash-size`, based on `0c04b89e34339584db067ebcbd54679f8c68dde4`. Character art producer: GPT-6 Luna, medium. Built-in imagegen. User-authorized budget: three new calls per strip; all six calls are exhausted. Each generated return was preserved at its exact path before selecting a version. No unselected calls were filed as new raw art versions.

## Inputs for every generation call

All prompts used the asset's current pose reference, approved idle v08, approved title-style neutral/combat references, and garment-weight reference `raw/_parts/run_v14_A.png`. Roles were explicit: pose from current dash/superDash; relative size/build from idle and neutral/combat; clothing volume from run Part A. No effects requested.

| Reference | SHA-256 |
|---|---|
| `raw/dash_v10.png` | `6132E315714021F32BAD7D80F46E5C42B5A050A38C0E53AD5E56C9CD713C34FE` |
| `raw/superDash_v12.png` | `C953A5D0F01A23A393590C4A5767F4996AA739F9FDA272E723B8CD6C2B08E1F4` |
| `reference/idle_v08.png` | `6C1EC47C2C1E2B7DF2D3AA6CCF2256E46DC93BDD8E426607F2990F6F963913BB` |
| `public/art-review/title-style-pilot/gojo-neutral_v01.png` | `D9FD4DCA67C7CC133E897773A3C8128D6C5320A42402642C11409FEA770175A0` |
| `public/art-review/title-style-pilot/gojo-combat_v01.png` | `AB42BC6FACD14659BF35B48A4BCE8682CD17218F200D1E7FCDC6430F58451656` |
| `raw/_parts/run_v14_A.png` | `561951D6C1FE5DA76ABC3AEB5521EAC662572C9C0E31897019BD6037E18DD0CE` |

## Calls and selected sources

| Strip / attempt | Exact returned path | SHA-256 | Result |
|---|---|---|---|
| dash 1/3 | `E:/Vibe Coding/.codex/generated_images/01a14c1f-2776-75a2-a6d4-46bd0e621cc7/exec-7c99d4e1-0dc8-4710-8e20-40c287909f8a.png` | `7CC90DE97DEF6D218E45C878B8C81FFBDF2ABBFCDDD6934F1C7714038546937E` | Not selected |
| dash 2/3 | `E:/Vibe Coding/.codex/generated_images/01a14c1f-2776-75a2-a6d4-46bd0e621cc7/exec-f894df46-10f2-4c2b-8aaf-e3b6de53219b.png` | `BC9EDB3AD2EEA886D8972C04B78462321E766FE9FB0CA7F3EAD983B25608F0C2` | Not selected |
| dash 3/3 | `E:/Vibe Coding/.codex/generated_images/01a14c1f-2776-75a2-a6d4-46bd0e621cc7/exec-9ca11063-e638-4f6a-9739-52af57d2eeb7.png` | `0C2949BA6ABBD693975F2F21DED6709E136792C4224AA8DB367DA24AE801B59D` | Selected as `raw/_qa_hold/dash_v11.png`, same hash |
| superDash 1/3 | `E:/Vibe Coding/.codex/generated_images/01a14c1f-2776-75a2-a6d4-46bd0e621cc7/exec-3f563e13-250a-4dab-a8c8-5fdae19a6255.png` | `53A6EF884E77D447B799988452B1175D6AC7E9D9B99E79C755AE87443CA52C28` | Not selected |
| superDash 2/3 | `E:/Vibe Coding/.codex/generated_images/01a14c1f-2776-75a2-a6d4-46bd0e621cc7/exec-ced350ef-eac7-4797-bb90-bd7a7cc067b9.png` | `1D63D434BF28E34E82A67719C9D3BB9FC379793111A9E805CCFD1CFDB456AEA0` | Not selected |
| superDash 3/3 | `E:/Vibe Coding/.codex/generated_images/01a14c1f-2776-75a2-a6d4-46bd0e621cc7/exec-02d6e0c6-3a7a-4210-91d7-364b71c4ba8a.png` | `ED94A2A7267842054F10D5D6558F6A468C32EC0EE2D0B9BFF151F095FC6DF7A5` | Selected as `raw/_qa_hold/superDash_v13.png`, same hash |

The selected returned source sizes were 1774×887 (dash) and 1774×887 (superDash); the prior pose references were 1536×1024. The returned image is the raw generation; there was no manual pixel editing. Packer lineage is recorded in final `ASTRA_AUDIT.md` and the candidate atlas snapshots: source factors dash x0.256 and superDash x0.230, followed by quantization to 48 colors. Final sidecar offsets were measured from packed-cell head centers (dash 165.5/166.5; superDash 168/168.5), then both candidates were packed and audited again. This deterministic recentering changed metadata only, not generated pixels.

## Decision record

Candidates are held because the final quantized atlas misses task-specific targets. Dash feet proxies are 1.091/1.094, and B is .929 on f1 (target .93–1.07; reported .001 miss retained without rounding). SuperDash B is .903/.906 and auto-head correction is 1.1455 (target .93–1.07). Per-frame dash-versus-superDash B difference is .054 on f0 (target <=.05) and .023 on f1; medians do not replace the per-frame test. Head factors pass. Some visible-segment comparisons have pose occlusion/foreshortening uncertainty, so they remain unmeasured. Full measurement details, uncertainty, cell hashes, atlas hashes and no-clipping audit are in [ASTRA_AUDIT.md](ASTRA_AUDIT.md).

The candidate atlas is retained at `candidate-atlas-final/`; its pre-offset state is retained at `candidate-atlas-pre-offset/`. `public/reviews/gojo-dash-size/assets/candidate-sheet.png` and metadata show the corrected candidate cells. Live public atlas was restored from approved dash v10 / superDash v12; its files match the base main atlas. Manifest versions advance to 11/13 with status still `approved`, and `approvedVersion` remains 10/12. No image is approved by this record.
