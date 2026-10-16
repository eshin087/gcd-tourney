# Naruto post-calibration anatomy audit — 2026-10-15

GPT-6 Astra / medium. **HOLD: stagger v07 and taunt v09.** All six actual quantized atlas frames and transitions including wrap inspected. No image approval. Source commit `0725f445c19296f58a495d34385dab17742beb81`.

## Findings

The upright collar-to-hem central readings remain about 42–44 px against neutral 50.4 px (about 14–16% short). Neutral is the correct trunk comparator: these backs are upright despite stagger shoulder hunch and bent legs. Comparing these trunks only to the combat/idle crouch (~38 px) would conceal the residual. H is about43±2 for stagger,40±2 for taunt; packed idle07 H41±2, neutral39±2. Profile sandals are31±2 /29±2 against idle/neutral29±2. These are direct geometry readings, not colour-area foot probes.

**Evidence strength:** the central torso failure persists across every frame and is consistent with Claude’s finding. It is not a certified all-uncertainty-bounds failure: collar top versus zipper emergence shifts endpoints a few pixels, and neutral T is48–53. Stagger T42±3 and taunt43.4±3 can touch the0.94 edge under jointly favourable endpoints. Do not turn either the central estimate into an exact15% fact or the overlap into a pass. No new independent robust limb/shoe failure is established. A strict anatomy pass is unavailable.

## Native projected measurements

L/R mean screen left/right. H=crown-to-chin; T=collar-to-bottom jacket hem; UA/LA=shoulder-elbow/wrist; thigh/shin=hip-knee/ankle; S=visible profile heel-toe. Endpoints and full hashes are in [audit.json](audit.json). H/S uncertainty±2px, T±3px, each arm segment±6px, each leg segment±7px. These are manual intervals, not statistical confidence bounds.

| Frame | H | T | UA L/R | LA L/R | thigh L/R | shin L/R | S R | T/neutral |
|---|---:|---:|---|---|---|---|---:|---:|
| stagger f0 | 43.0 | 42.1 | 21.0/19.6 | 23.1/24.0 | 24.6/24.4 | 30.0/26.0 | 31.0 | 0.835 |
| stagger f1 | 43.0 | 42.0 | 21.0/19.6 | 23.1/24.0 | 24.6/24.4 | 30.0/26.0 | 31.0 | 0.833 |
| stagger f2 | 43.0 | 42.1 | 21.0/19.6 | 23.1/24.0 | 24.6/24.4 | 30.0/26.0 | 31.0 | 0.835 |
| stagger f3 | 43.0 | 42.0 | 21.0/19.6 | 23.1/24.0 | 24.6/24.4 | 30.0/26.0 | 31.0 | 0.833 |
| taunt f0 | 40.0 | 43.4 | 24.1/22.2 | 17.0/25.3 | 23.9/24.7 | 28.6/22.1 | 29.0 | 0.861 |
| taunt f1 | 40.0 | 43.4 | 24.1/22.2 | 17.0/25.3 | 23.9/24.7 | 28.6/22.1 | 29.0 | 0.861 |

Both visible limb chains were inspected, including clothing width and volume. Their garment-covered joint estimates are screens, not strict +/-6% passes. Stagger/taunt thighs and shins project differently from the wide crouched idle and the standing neutral; no bounding-box normalization was used. Taunt’s bent left forearm is foreshortened. The left sandal faces toward camera, so its width cannot certify shoe length. Shoulders are three-quarter and covered by sleeves; no reliable frontal shoulder measurement is available. These exclusions are explicit limitations, not automatic passes.

## Reference and loop checks

Exact neutral and combat cells were independently viewed beside actual packed idle f0. Existing approved idle07 source equals the fixed approved file byte-for-byte; its packed H41 and T~38 match the combat projection more closely than neutral T50.4. Neutral projected near-arm26/25.3 and leg35.9/34, combat21.9/17 and41.3/25.3, idle24.4/18.4 and its bent leg chain are contextual measurements with broad garment uncertainty (complete retained reference endpoints in JSON). The reference pose difference prevents using projected limb ratios as skeletal proportions.

Stagger0→1→2→3→0: feet and limbs remain stable; small head/trunk sway, no isolated scale discontinuity. Taunt0→1→0: stable pointing arm and hip hand, mouth/head motion; no isolated scale discontinuity. Loop assessment used ordered atlas frames and wrap comparison, not a claim of browser/in-game playback. Win09 was outside this re-audit.

## Evidence

[References + idle, same density](panel-0.png) · [stagger0–2](panel-3.png) · [stagger3 + taunt0–1](panel-6.png). Individual grid enlargements retain native coordinates. All crops came from the hashed atlas; no repack, source generation or production pixel edits occurred.

Coordinator reports new main inbox b60a693 authorizes the final remaining round-4 call for each strip; a separate source worker will execute it. This audit changes no source and does not approve a future output. A corrected-source route would target upright torso length relative to head/feet, preserving pose and identity. Manual in-game review is an explicit user decision, not an anatomy pass. Existing approval state stays needs review. Build omitted for documentation/evidence-only work as delegated.
