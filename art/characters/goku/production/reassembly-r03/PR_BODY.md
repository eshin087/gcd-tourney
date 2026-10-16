# Goku core reassembly r03

## Summary

- Reassembled existing source art at landmark-measured uniform density, repaired verified source-grid/component extraction and measured horizontal placement issues, and preserved all versioned candidates and sidecars.
- Used **zero image-generation calls**. Existing v04 drawing approvals remain attached to their original designs; deterministic scale/placement calibration does not request fresh drawing approval.
- Added the 20 final5-selected technical PASS rows plus idle and two explicit holds to [Goku review rows](../../REVIEW_ROWS.md). The complete 23-animation inventory and every version/hash/source row are linked from the [r03 handoff](FINAL_HANDOFF_R03.md).
- Strict branch-preview pack passed: 21 animations, 93 frames, 48 colors, every selected frame at x1. Exact atlas SHA256 `fbccd9bf1958a7d3e7c701ea062aa2b99f031456e3d25cd010a81c47e5286054` and metadata SHA256 `e98d7a2addcdbf932438ac43b89f507177b9071194359a40e042bab68fdfdc9f` match Astra's final5 exact-pixel audit.
- Parent browser QA passed the [r03 review gallery](../../../../../public/characters/goku/calibration-r3/index.html): native 256px cells, 768px references, animation controls, 14 images loaded, no captured browser warnings/errors.

## Holds and remaining review

- `light3_v09` and `heavy_v11` remain calibration holds and are omitted from the strict atlas; the pack does not fall back to older v04 drawings. Their source art is complete and assembly/cell fit pass. No redraw is established as necessary; Claude owns calibration or compact-pose disposition.
- Getup retains a floor/contact warning. Claude owns runtime grounding/contact, timed-loop and hit/hurtbox review. Technical image audit does not constitute user design approval, merge or deployment.
- The user's approved v04 attack drawings retain their design approval. Other unapproved drawings remain subject to user review; see the root review rows.

## Evidence

- [Astra final5 strict audit](../manual-audit-r3/FINAL5_STRICT_AUDIT.md)
- [Astra exact-pixel verification](../manual-audit-r3/FINAL5_PIXEL_VERIFICATION.json)
- [Complete 23-animation handoff](FINAL_HANDOFF_R03.md)
- [Versioned candidate inventory and hashes](R03_REVIEW_ROWS.md)
- [Final4 to final5 pixel comparison](final4-final5-mask-comparison.json)
- [Workflow note](WORKFLOW.md)

Preview: **pending parent publication** — add the preview URL here after it is available.

## Proposed review rows

# Proposed Goku review rows

## Final r03 reassembly and strict audit (2026-10-16)

These are deterministic reassemblies of existing Goku source art; **zero image-generation calls** were used. The strict branch-preview atlas contains approved idle v02 plus the 20 exact candidate versions marked Astra PASS below. Its sheet SHA256 is `fbccd9bf1958a7d3e7c701ea062aa2b99f031456e3d25cd010a81c47e5286054`; metadata SHA256 is `e98d7a2addcdbf932438ac43b89f507177b9071194359a40e042bab68fdfdc9f`. See [final5 exact-pixel Astra audit](production/manual-audit-r3/FINAL5_STRICT_AUDIT.md), [23-animation handoff inventory](production/reassembly-r03/FINAL_HANDOFF_R03.md), [full immutable version rows](production/reassembly-r03/R03_REVIEW_ROWS.md), and [branch-preview gallery](../../../public/characters/goku/calibration-r3/index.html). Technical PASS does not grant a new drawing approval. Existing v04 drawing approvals remain attached to their source designs through uniform reassembly.

| Character | Asset | Selected version | Review state | Technical finding |
|---|---|---:|---|---|
| Goku | idle | [idle_v02.png](raw/idle_v02.png) | approved reference | Baseline; included in final5 atlas. |
| Goku | run | [run_v09.png](raw/run_v09.png) | needs review | Astra PASS in exact final5 pixels; x1. |
| Goku | dash | [dash_v09.png](raw/dash_v09.png) | needs review | Astra PASS in exact final5 pixels; x1, repaired measured frame placement. |
| Goku | jumpUp | [jumpUp_v04.png](raw/jumpUp_v04.png) | needs review | Astra qualified PASS in exact final5 pixels; x1. |
| Goku | jumpFall | [jumpFall_v04.png](raw/jumpFall_v04.png) | needs review | Astra PASS in exact final5 pixels; x1. |
| Goku | land | [land_v07.png](raw/land_v07.png) | needs review | Astra PASS in exact final5 pixels; x1. |
| Goku | light1 | [light1_v04.png](raw/light1_v04.png) | needs review | Astra PASS in exact final5 pixels; x1. |
| Goku | light2 | [light2_v05.png](raw/light2_v05.png) | approved source drawing; calibration retained | Reassembly of user-approved v04; Astra PASS in exact final5 pixels; x1. |
| Goku | light3 | [light3_v09.png](raw/_qa_hold/light3_v09.png) | technical hold | Excluded from strict atlas. Body calibration unresolved; assembly and fit pass. No redraw established as necessary. Original approved v04 design is preserved in `_qa_hold`; no fallback used. |
| Goku | light4 | [light4_v09.png](raw/light4_v09.png) | approved source drawing; calibration retained | Reassembly of user-approved v04; Astra PASS in exact final5 pixels; x1. |
| Goku | heavy | [heavy_v11.png](raw/_qa_hold/heavy_v11.png) | technical hold | Excluded from strict atlas. Body calibration unresolved; assembly and fit pass. No redraw established as necessary. Original approved v04 design is preserved in `_qa_hold`; no fallback used. |
| Goku | airLight1 | [airLight1_v07.png](raw/airLight1_v07.png) | approved source drawing; calibration retained | Reassembly of user-approved v04; Astra PASS in exact final5 pixels; x1. |
| Goku | airHeavy | [airHeavy_v06.png](raw/airHeavy_v06.png) | approved source drawing; calibration retained | Reassembly of user-approved v04; Astra PASS in exact final5 pixels; x1. |
| Goku | guard | [guard_v05.png](raw/guard_v05.png) | needs review | Astra PASS in exact final5 pixels; x1. |
| Goku | hurtHigh | [hurtHigh_v08.png](raw/hurtHigh_v08.png) | needs review | Astra PASS in exact final5 pixels; x1. |
| Goku | launched | [launched_v08.png](raw/launched_v08.png) | needs review | Astra PASS in exact final5 pixels; x1, repaired measured frame placement. |
| Goku | down | [down_v05.png](raw/down_v05.png) | needs review | Astra PASS in exact final5 pixels; x1. |
| Goku | getup | [getup_v11.png](raw/getup_v11.png) | needs review | Astra PASS in exact final5 pixels; x1. Separate floor/contact warning remains for Claude runtime review. |
| Goku | charge | [charge_v05.png](raw/charge_v05.png) | needs review | Astra PASS in exact final5 pixels; x1; assembled source sequence resolves prior loop seam. |
| Goku | beamCharge | [beamCharge_v07.png](raw/beamCharge_v07.png) | needs review | Astra PASS in exact final5 pixels; x1. |
| Goku | beamFire | [beamFire_v07.png](raw/beamFire_v07.png) | needs review | Astra PASS in exact final5 pixels; x1. |
| Goku | special | [special_v05.png](raw/special_v05.png) | needs review | Astra PASS in exact final5 pixels; x1; verified grid separators removed from extraction. |
| Goku | win | [win_v05.png](raw/win_v05.png) | needs review | Astra PASS in exact final5 pixels; x1. |

The final pack is 21 animations / 93 frames / 48 colors; the strict scale gate exited 0 and all selected scales are x1. The two holds above are omitted rather than restoring their older technically held versions. Runtime timing, contact/hurtbox alignment, merge/deploy and any unapproved drawing review remain separate decisions. The complete r03 version catalog preserves each saved version and superseded/held state.
