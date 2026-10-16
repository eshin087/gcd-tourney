# Naruto calibrated round-4 Astra audit

Source f3191a6. Both expected atlas/anims SHA256 hashes matched before extraction. Fourteen actual quantized-atlas frames inspected. **HOLD overall; no corrected preview certified.**

## Findings

- **stagger:** HOLD: current upright torso robustly short; calibration feasibility unresolved; no extra generation authorized by this audit.
- **taunt:** HOLD: current upright torso robustly short; calibration feasibility unresolved; no extra generation authorized by this audit.
- **win:** HOLD: current upright torso robustly short and body/head mismatch; one redraw direction sent to coordinator. H/S no-fit claim not proven after broad uncertainty.
- **jumpUp:** HOLD for strict numeric certification: no robust redraw-level failure found, but projection/occlusion prevents ±6% certification of every segment. Retain source pending Claude assessment.
- **superDash:** HOLD for strict numeric certification: no robust redraw-level failure found; hidden legs/profile shoes and pitched head prevent all-segment ±6% certification. Retain source pending Claude assessment.

The strong finding is the current **upright collar-to-hem relationship**, not bounding height. Neutral title collar (133,76) to hem (139,126) measures 50.4 px, conservative 48-53. Stagger collars near (135,109) to hems near (131,148) measure 39-40; taunt (125,115) to (131,151) measures 36.5; win (132,117) to (134,153) measures 36.1. These trunks are upright or mildly side-leaning, with no combat-like forward fold. Raised arms do not explain the compressed zipper/hem distance. Generous maximum candidate/minimum reference ratios: stagger 43/48=.896, taunt 41/48=.854, win 40/48=.833; each is below .94. This is a robust failure of the CURRENT upright garment/body relationship. A depth-tilt or jacket-shortening alternative would require evidence, not silent substitution of the combat reference.

Win H/S central values agree with the direction of Claude's 15-19% residual: H 39 versus reference ~40; shoe 24 versus ~29; relative H/S ~1.18. However **no-uniform-H/S-fit is not robustly proven after uncertainty**. Win redraw direction follows the confirmed short upright torso: preserve head/identity/celebration beats, restore neutral-title upright torso and body/clothing lengths; do not enlarge head and body together or choose bodyHeight by eye. Coordinator authorized one win call. This audit does not automatically authorize stagger/taunt redraws.

## Every frame

Native-pixel manual landmark estimates; H=crown/hair-to-chin, T=collar-to-jacket hem, S=visible profile heel-to-toe. UA/LA is the clearest side. Arm segments each have +/-6px uncertainty, thigh/shin each +/-7px through clothing: **not strict +/-6% passes**. Missing means unmeasurable. None offers a frontal shoulder span. Full endpoints, pose classifications, notes, reference measurements and hashes are in audit.json. Cyan/magenta/green overlays show torso/arm/leg landmarks.

| Frame | Atlas | H [range] | T [range] | UA/LA | Thigh/shin | S [range] |
|---|---:|---|---|---|---|---|
| stagger v06 f0 | 131 | 40 [38-43] | 39.2 [36, 43] | 19.6/22.6 | 27.9/31.1 | 29 [27-31] |
| stagger v06 f1 | 132 | 40 [38-43] | 39.1 [36, 43] | 19.6/22.6 | 27.9/31.1 | 29 [27-31] |
| stagger v06 f2 | 133 | 40 [38-43] | 39.2 [36, 43] | 19.6/22.6 | 27.9/31.1 | 29 [27-31] |
| stagger v06 f3 | 134 | 40 [38-43] | 39.2 [36, 43] | 19.6/22.6 | 27.9/31.1 | 29 [27-31] |
| taunt v07 f0 | 148 | 39 [37-42] | 36.5 [34, 41] | 23.1/20.0 | 35.0/27.5 | 28 [26-30] |
| taunt v07 f1 | 149 | 39 [37-42] | 37.5 [34, 41] | 23.1/20.0 | 35.0/27.5 | 28 [26-30] |
| win v08 f0 | 150 | 39 [37-42] | 36.1 [34, 40] | 25.3/19.0 | 27.7/28.9 | 24 [22-26] |
| win v08 f1 | 151 | 39 [37-42] | 36.1 [34, 40] | 25.3/19.0 | 27.7/28.9 | 24 [22-26] |
| win v08 f2 | 152 | 39 [37-42] | 37.1 [34, 40] | 25.3/19.0 | 27.7/28.9 | 24 [22-26] |
| win v08 f3 | 153 | 39 [37-42] | 36.1 [34, 40] | 23.5/19.6 | 27.7/28.9 | 24 [22-26] |
| jumpUp v06 f0 | 24 | 42 [39-45] | 43.4 [40, 47] | 36.4/27.5 | 33.1/34.9 | unmeasurable |
| jumpUp v06 f1 | 25 | 42 [39-45] | 43.0 [40, 47] | 38.3/25.6 | 33.4/36.4 | unmeasurable |
| superDash v03 f0 | 21 | 44 [40-47] | 38.6 [35, 42] | 21.5/15.0 | unmeasurable | unmeasurable |
| superDash v03 f1 | 22 | 44 [40-47] | 37.4 [34, 42] | 19.7/15.0 | unmeasurable | unmeasurable |

JumpUp f0/f1: airborne, lifted pelvis/thigh, oblique trunk and perspective-affected shoes. T 40-47 sits between approved neutral/combat projections. No reliable all-segment numerical pass or robust redraw-level failure. SuperDash f0/f1: strong forward lean, tucked overlapping legs, rear-facing/occluded shoes. T 34-42 broadly matches combat/idle; head pitch and hidden anatomy remain uncertain. Retain both sources; no calls supported by this evidence.

## Generous uniform-scale possibility screens

k=[.94*ref_low/candidate_high,1.06*ref_high/candidate_low]. References: approved H envelope 37-43, upright T 48-53, profile S 27-31. These are POSSIBLE intervals, not a confidence-free prescription or proof of a passing factor. A nonempty intersection cannot certify calibration.

| Strip | H k | T k | S k | Joint possible k |
|---|---|---|---|---|
| stagger | [0.8088, 1.1995] | [1.0493, 1.5606] | [0.8187, 1.217] | [1.0493, 1.1995] |
| taunt | [0.8281, 1.2319] | [1.1005, 1.6524] | [0.846, 1.2638] | [1.1005, 1.2319] |
| win | [0.8281, 1.2319] | [1.128, 1.6524] | [0.9762, 1.4936] | [1.128, 1.2319] |

Ask Claude for actual head/torso/shoe/limb feasibility before another stagger/taunt call. Current torso failures are proven, mandatory redraws are not. Win source repair is targeted to the current body mismatch; this report does not claim all calibration possibilities have been excluded.

## Loops and sequences

Every adjacent pair and final-to-first pair was inspected in actual-atlas extracted frames. Timing GIFs are saved. **No browser playback tool was available to this agent; exports and pair inspection do not claim live/browser playback.**

- **stagger:** atlas [131, 132, 133, 134], durations [150, 150, 150, 150] ms, loop=true. No missing/cut limb or frame-boundary clipping found. Small torso/head sway; scale failure persists throughout loop.
- **taunt:** atlas [148, 149], durations [250, 250] ms, loop=true. No missing/cut limb or frame-boundary clipping found. Mouth opens; pointing body stable.
- **win:** atlas [150, 151, 152, 153], durations [110, 90, 260, 180] ms, loop=true. No missing/cut limb or frame-boundary clipping found. Arm pumps from chest to overhead, holds and changes to other-side fist, then returns; wrap is a visible pose snap, not an anatomy scale fix.
- **jumpUp:** atlas [24, 25], durations [80, 80] ms, loop=true. No missing/cut limb or frame-boundary clipping found. Raised leg and arm move between two poses; overlapping shoe in f1 is occlusion, not loss of anatomy.
- **superDash:** atlas [21, 22], durations [50, 50] ms, loop=true. No missing/cut limb or frame-boundary clipping found. Two poses preserve tuck; cloth/headband changes, no gross scale pop observed.

No cross-cell/clipped body part found. Win wrap has a pose snap, not a correction of its body proportions. Live in-game timing/contact remains Claude-owned.

## Limits and provenance

audit.json pins actual sheet/anims, approved neutral/combat/idle, and selected raw source hashes. Historical repair-audit/segments.json were not substituted for these pixels. No sources, sidecars, offsets, hitboxes, packer code, production atlas, approvals or deploys changed. Head-gate success is insufficient. Diagnostic crops/overlays/GIFs here are derived evidence, not new generated image versions or image-approval entries.

## Bilateral limb accounting and reference screens

Reference projected segment estimates (UA / LA / thigh / shin), with arm +/-6 px and leg +/-7 px uncertainty:

- neutral: {'UA': 26.0, 'LA': 25.3, 'thigh': 35.9, 'shin': 34.0}.
- combat: {'UA': 21.9, 'LA': 17.0, 'thigh': 41.3, 'shin': 25.3}.
- idle07_f0: {'UA': 24.4, 'LA': 18.4, 'thigh': 40.5, 'shin': 26.0}.

The first table measures the clearest side only. The following explicitly accounts for the opposite side; values are projected estimates and are **not numerical passes**. Refer to audit.json for native endpoints, measured-side labels and per-segment ratio screens.

| Frame | Opposite UA/LA | Opposite thigh/shin | Limitation |
|---|---|---|---|
| stagger f0 | 21.2/20.6 | 25.3/34.4 | Opposite screen-left arm hangs visibly; screen-left leg bends outward. Both garment-covered; same broad endpoint uncertainty. |
| stagger f1 | 21.2/20.6 | 25.3/34.4 | Opposite screen-left arm hangs visibly; screen-left leg bends outward. Both garment-covered; same broad endpoint uncertainty. |
| stagger f2 | 21.2/20.6 | 25.3/34.4 | Opposite screen-left arm hangs visibly; screen-left leg bends outward. Both garment-covered; same broad endpoint uncertainty. |
| stagger f3 | 21.2/20.6 | 25.3/34.4 | Opposite screen-left arm hangs visibly; screen-left leg bends outward. Both garment-covered; same broad endpoint uncertainty. |
| taunt f0 | 30.4/20.1 | 29.2/29.2 | Screen-left hand on hip; elbow and wrist visible but shoulder partly covered. Pointing arm depth rotation and bent opposite elbow prevent physical length comparison from projection alone. |
| taunt f1 | 30.4/20.1 | 29.2/29.2 | Screen-left hand on hip; elbow and wrist visible but shoulder partly covered. Pointing arm depth rotation and bent opposite elbow prevent physical length comparison from projection alone. |
| win f0 | 26.6/13.0 | 29.5/33.3 | Opposite arm is bent toward chest in f0, raised/foreshortened beside head f1-f2, opposite raised fist f3. Projected upper arm can shorten without physical limb shortening; no neutral-length pass from those values. |
| win f1 | 15.2/21.5 | 29.5/33.3 | Opposite arm is bent toward chest in f0, raised/foreshortened beside head f1-f2, opposite raised fist f3. Projected upper arm can shorten without physical limb shortening; no neutral-length pass from those values. |
| win f2 | 15.2/21.5 | 29.5/33.3 | Opposite arm is bent toward chest in f0, raised/foreshortened beside head f1-f2, opposite raised fist f3. Projected upper arm can shorten without physical limb shortening; no neutral-length pass from those values. |
| win f3 | 21.6/16.1 | 29.5/33.3 | Opposite arm is bent toward chest in f0, raised/foreshortened beside head f1-f2, opposite raised fist f3. Projected upper arm can shorten without physical limb shortening; no neutral-length pass from those values. |
| jumpUp f0 | 19.2/19.9 | unmeasurable | Opposite arm raised beside head and foreshortened. Raised leg orange silhouette is visible but hip is under jacket and knee is hidden within a broad folded trouser contour; separate thigh/shin joint-center lengths unmeasurable. Distal lower leg overlaps hanging thigh/foot more in f1. |
| jumpUp f1 | 19.2/19.9 | unmeasurable | Opposite arm raised beside head and foreshortened. Raised leg orange silhouette is visible but hip is under jacket and knee is hidden within a broad folded trouser contour; separate thigh/shin joint-center lengths unmeasurable. Distal lower leg overlaps hanging thigh/foot more in f1. |
| superDash f0 | 23.3/14.4 | unmeasurable | Opposite screen-left arm trails with shoulder/elbow under dark/orange sleeve. Both thighs tuck beneath torso; hip and knee centers hidden by torso, clothing and each other. Distal rear lower leg partly visible, but knee unseen; neither left nor right thigh/shin length certifiable. |
| superDash f1 | 23.3/14.4 | unmeasurable | Opposite screen-left arm trails with shoulder/elbow under dark/orange sleeve. Both thighs tuck beneath torso; hip and knee centers hidden by torso, clothing and each other. Distal rear lower leg partly visible, but knee unseen; neither left nor right thigh/shin length certifiable. |

Upright primary-side ratios to neutral (UA / LA / thigh / shin) are diagnostic comparisons, not skeletal passes. The pointing taunt arm has a different projection, so its ratio cannot prove a physical length failure. Opposite bent/raised arms and rotated legs lack exact matching reference projections; their anatomical ratios are explicitly skipped. Airborne jumpUp/superDash ratios are skipped for the same reason, with specific hidden joints identified above.

- stagger f0: {'UA': 0.754, 'LA': 0.893, 'thigh': 0.777, 'shin': 0.915}; HOLD uncertainty.
- stagger f1: {'UA': 0.754, 'LA': 0.893, 'thigh': 0.777, 'shin': 0.915}; HOLD uncertainty.
- stagger f2: {'UA': 0.754, 'LA': 0.893, 'thigh': 0.777, 'shin': 0.915}; HOLD uncertainty.
- stagger f3: {'UA': 0.754, 'LA': 0.893, 'thigh': 0.777, 'shin': 0.915}; HOLD uncertainty.
- taunt f0: {'UA': 0.888, 'LA': 0.791, 'thigh': 0.975, 'shin': 0.809}; HOLD uncertainty.
- taunt f1: {'UA': 0.888, 'LA': 0.791, 'thigh': 0.975, 'shin': 0.809}; HOLD uncertainty.
- win f0: {'UA': 0.973, 'LA': 0.751, 'thigh': 0.772, 'shin': 0.85}; HOLD uncertainty.
- win f1: {'UA': 0.973, 'LA': 0.751, 'thigh': 0.772, 'shin': 0.85}; HOLD uncertainty.
- win f2: {'UA': 0.973, 'LA': 0.751, 'thigh': 0.772, 'shin': 0.85}; HOLD uncertainty.
- win f3: {'UA': 0.904, 'LA': 0.775, 'thigh': 0.772, 'shin': 0.85}; HOLD uncertainty.
