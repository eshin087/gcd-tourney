# Gojo skills revamp · Batch 1 provenance

Date: 2026-10-18. Branch: `art/gojo-skills`. Generation and direction model: `gpt-6-luna`, medium. Each effect retains its own cumulative three-call budget. Only the selected v01 source is filed under `art/vfx/raw/`; equal-slot sidecars record the intended split and do not change the generated pixels. The user approved all five v01 drawings as drawn via Claude relay gojo-skills #2 (“Approve all five v01”). Approval is visual; source-format deviations remain documented and unchanged.

## Candidate inventory

| Asset | Selected source | Calls used | Prompt source | Source audit | SHA-256 | Verdict |
|---|---|---:|---|---|---|---|
| A1 `lapseBlue` | `art/vfx/raw/lapseBlue_v01.png` | 1/3 | `art/characters/gojo/SKILLS_REVAMP.md`, A1 | 1774x887; 101,379 RGBA colors; corner RGB(243,15,241); packer 8/8, x0.767, 12 specks removed | `204BB0E89A8AED579B89308B8E57A69B1FC80C063FE596D029B8F9AA258F0B3E` | User approved v01 as drawn via Claude relay #2; source-format deviations remain documented. |
| A2 `blueCollapse` | `art/vfx/raw/blueCollapse_v01.png` | 1/3 | `art/characters/gojo/SKILLS_REVAMP.md`, A2 | 2172x724; 74,243 RGBA colors; corner RGB(242,14,241); packer 8/8, x0.789, 11 specks removed | `CB12F7BA34A78A7A2A425000F234EB831C5ADA7DDEDC3AFEB88B986789A8988B` | User approved v01 as drawn via Claude relay #2; source-format deviations remain documented. |
| A3 `redForm` | `art/vfx/raw/redForm_v01.png` | 2/3 | `art/characters/gojo/SKILLS_REVAMP.md`, A3 | 2172x724; 51,184 RGBA colors; corner RGB(245,15,241); packer 6/6, x0.431, 4 specks removed | `48CE667C46725AB124BDFD49A7A83C12C8A95B81F95D7E35402995D2E82E1702` | Call 1 output was lost before it could be saved. Call 2 has clear sparks-to-orb progression; selected and user-approved via Claude relay #2 as drawn; source-format deviations remain documented. |
| A4 `reversalRed` | `art/vfx/raw/reversalRed_v01.png` | 2/3 | `art/characters/gojo/SKILLS_REVAMP.md`, A4 | 2172x724; 61,765 RGBA colors; corner RGB(243,12,241); packer 8/8, x0.895 | `C20A9C3F6B1803624B87A5909827CBC6834CF91518FB4C2C30B1C0A9EB97C64D` | Call 1 output was lost. Call 2 preserves the orb and left-opening arcs, though loop motion is modest; selected and user-approved via Claude relay #2 as drawn; source-format deviations remain documented. |
| A5 `redBurst` | `art/vfx/raw/redBurst_v01.png` | 3/3 invocations | `art/characters/gojo/SKILLS_REVAMP.md`, A5 | 2172x724; 112,645 RGBA colors; corner RGB(245,15,244); packer 8/8, x0.65, 69 specks removed | `3751501CA8B44AFC508B92802C37EDCE24041109F6BA9B30BBDA3D150ADD4EB6` | Call 1 output was lost. Call 2 produced the selected candidate. Call 3 was an empty-prompt HTTP 400 failure. Budget exhausted; user approved as drawn via Claude relay #2; source-format deviations remain documented. |

## Call ledger

All five requested prompt definitions are in `art/characters/gojo/SKILLS_REVAMP.md` (A1-A5), including frame sequence, palette, cell scale, and shared effect constraints. All successful calls used the brief's effect-only, flat-magenta pixel-art direction. These original source deviations remain visible; the packer's cleaned preview is not a source repair.

- A1 call 1 returned `E:/Vibe Coding/.codex/generated_images/01a151b0-4ab7-7de3-b311-589db4803286/exec-e3b37a3b-9f8e-42ce-8ba1-76f11ff2ada6.png`, copied byte-for-byte to `lapseBlue_v01.png`.
- A2 call 1 returned `E:/Vibe Coding/.codex/generated_images/01a151b0-4ab7-7de3-b311-589db4803286/exec-3e6dc3b7-1597-46fb-b584-69df221775e9.png`, copied byte-for-byte to `blueCollapse_v01.png`.
- A3 call 1 output was not retained by the generation worker; call 2 returned an image data URL (length 1,631,490 characters), saved as `redForm_v01.png`.
- A4 call 1 output was not retained by the generation worker; call 2 returned an image data URL (length 1,644,306 characters), saved as `reversalRed_v01.png`.
- A5 call 1 output was not retained by the generation worker; call 2 was saved directly as `redBurst_v01.png`; call 3 returned HTTP 400 for an empty prompt and produced no image.

## Technical disposition

Every source violates the exact `2048x256`-style strip layout and ≤16-color/exact-`#FF00FF` requirements. Four are 2172x724; A1 is 1774x887. Corner pixels are near-magenta rather than exact; the source files have tens of thousands of RGBA values. `.json` sidecars force equal-column splitting to obtain the intended frame counts. Candidate packing returned exit 0 and placed all five effects in `public/preview/vfx/atlas_hd.png`; their frames were detected as 8, 8, 6, 8 and 8. The worktree is sparse: unrelated existing HD VFX sources are unavailable, so the overall candidate atlas is review-only and omits those existing effects. All five v01 assets have `approvedVersion: 1` via user approval through Claude relay gojo-skills #2.
