# Sasuke charge v15 final Astra audit — HOLD

Audit date: 2026-10-18 (local). Auditor: GPT-6 Astra, medium. Candidate remains unapproved. Scope: the actual quantized atlas present in this worktree, six charge cells and idle f0, compared at equal pixel density with approved title-style neutral/combat cells. No raw-image layout rejection and no candidate edits.

## Exact artifact

- Raw v15 SHA256: `d9b4fb88c1b43b4499ba067cbf278e3c3cd76d8473d2cdd916d63c375ce46154`.
- `public/characters/sasuke/sheet.png`: `edc26de0ba788f585a23c1b4e7f38db56248498e7d5ab11877984aa985811233`.
- `public/characters/sasuke/anims.json`: `fd1afa3f762cae5df70362e7253b5fd4df007bfee00387e08e650a741cb06e24`.
- Charge v15 occupies atlas cells 115–120. Durations are 70, 90, 110, 110, 110, 110 ms; loop true; loopFrom 2. Correct.
- Manifest approvedVersion remains 12. The existing `status: approved` does not approve v15 (`reviewStatus: needs review`).

## Verdict and remaining gates

**HOLD for full brief clearance.** The static anatomy comparison is broadly consistent and the foot composite substantially improves registration. However, the per-frame H check is outside the brief at f3 (1.077 versus maximum 1.07), and timed lab playback has not been performed by this auditor. Do not report a full numeric scale or temporal-shimmer pass. These are bounded unresolved checks, not a recommendation to regenerate the whole image.

1. **Resolve f3 H explicitly.** Its expanded trailing hair changes the probe box from x107–147 to x103–147 while the face remains in approximately the same place. This is evidence of a hair-shape contribution, not proof of skull growth. The atlas median gate says `ok` at H=1.046; that does not certify every frame against the brief's 0.93–1.07 interval. A measured skull/face comparison or corrected packed result is needed before clearing this exception. Do not exempt it merely to hide the value.
2. **Run the loop in the lab at the specified timing and inspect f5→f2.** Static differences cover thousands of pixels throughout the upper garment and trousers. Some are expected cloth motion; pixel counts alone cannot distinguish smooth breathing from shimmer. This audit inspected every static frame and transition differences, but did not observe browser/lab playback. The authored GIF alone is not evidence that this atlas played correctly in the lab.

## Anatomy and identity, all six frames

See `comparison.png` (1x) and `anatomy-2x.png` (nearest-neighbor 2x): charge f0–f5, then current idle f0, approved neutral, approved combat. All evidence is freshly extracted from the hashed atlas; no cached `frames/` files were used.

- f0: lowered head, compressed upper body and seal gathering at the chest read as anticipation. The figure is 170 px including hair versus 180 px in release; it has not been stretched back to standing height. Both feet and complete bent limbs remain present.
- f1: head and torso rise into the seal pose, mouth opens, left fist is lowered. Shoulder/upper-arm and bent forearm lengths are visually compatible with idle and the combat reference. Complete silhouette with no cell clipping.
- f2: stable held seal, intact torso, waist rope, baggy trousers and sandals. Outfit and overall build match the reference family; apparent leg shortening comes from the more symmetrical deep squat.
- f3: mouth widens and loose hair/cloth projects farther. The extra hair width is the principal visible change associated with the high H value. No visibly duplicated limb or swollen torso. Waist panel and trouser highlights change broadly; evaluate at speed.
- f4: the composite open mouth remains visible without a rectangular patch edge at 2x. Arms, torso and lower body remain continuous. The rope and blue drape change back toward f2; this is not four identical copies.
- f5: body remains intact and returns toward f2's held pose. The packed right sandal outer edge is 2 px inward, despite the raw lower-body composite, and lower-leg sampling changes. This is within the brief's later 1–2 px redrawn-outline allowance, but should be watched at the wrap.
- Across all frames: white open shirt, dark forearm guards, purple rope belt, blue waist drape/trousers and sandals remain consistent. Sword remains sheathed across the rear waist; no drawn blade or baked aura/sparks/lightning. The raised fingers read as the intended one-handed seal before the chin. The rightward head and three-quarter body direction remain consistent. Sharingan iris detail is too small for a confident exact iris-pattern claim.
- Head/torso/arms/legs/shoes were visually compared to both approved cells and current idle. Torso and limb articulation show no obvious gross scale violation, but joint landmarks under the loose sleeves, rope and baggy trousers have roughly 2–4 px uncertainty. This is **not** a numeric ±6% certificate for each skeletal segment. Foot probe ratios of 1.375–1.427 are matching-color area metrics, not measured sandal widths; they are not used as proof of oversize feet.

## Numeric evidence

| Frame | B against idle | H against idle | Occupied bounds (exclusive end) |
|---|---:|---:|---|
| f0 | 0.977 | 1.051 | 68,71–190,241 |
| f1 | 0.987 | 1.034 | 69,61–190,241 |
| f2 | 0.991 | 1.048 | 69,61–190,241 |
| f3 | 0.973 | **1.077** | 69,61–190,241 |
| f4 | 0.989 | 1.041 | 69,61–190,241 |
| f5 | 1.006 | 1.043 | 69,61–188,241 |

B is the repository garment-color area proxy, not a direct torso-length measurement. All B values satisfy the brief. H is the existing atlas head probe and includes hair; f3 does not satisfy the brief numerically. Values are copied from the current v15 body report and corroborated against atlas scaleAudit.

Head probe box centers for f2–f5: (127,81), (125,80.5), (127,80.5), (127,81). The 2 px horizontal extreme is caused by the extra left hair extent; the face appears stable within approximately 1–2 px. Fists and knee/hip anatomical position appear stable within about 1–2 px visually, but garment edges are not exact anatomical landmarks.

Feet rows y220–240 are byte-identical for f2/f3/f4. f5 differs from f2 at 133 pixels in those rows; its right-foot occupied x interval changes from [162,190) to [162,188), left interval remains [69,92), soles remain y240. Thus the literal identical-pixel rule does not hold for f5, while the revised 1–2 px outline allowance is met geometrically. No floating sole or large slide is visible.

Loop differences from f2 involve 4456 pixels in f3, 3561 in f4, and 4082 in f5. They include shading and moving cloth, not only silhouette displacement. Four different held images exist, but that alone does not establish a smooth updraft cycle. `registration.png` marks the foot band and differences; `onion-2x.png` overlays the four silhouettes.

## Limits and next step

This audit did not run a browser, lab, in-game contact test, production build or an independent strict repack. It inspected the already packed artifacts requested by the parent. No runtime, deployment, user-approval or full-loop-playback claim is made. Parent should resolve the f3 measurement, perform lab playback, and request a focused re-audit of that evidence. Preserve v15 and the composite provenance; no regeneration is required merely by these unresolved checks.

The audit script and evidence are confined to this directory. Worktree: `E:/Vibe Coding/Claude Code/gcdTourney/.worktrees/art-charge-sasuke`, branch `art/charge-sasuke`. Routine worktree audit found `art-gojo-skills` merged but dirty; it was left untouched. No other agent's files were staged.
