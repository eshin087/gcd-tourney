# Height and build revision — lineup v03

User feedback: the first corrected cast is much better, but Gojo needs to read much taller than Killua; Naruto and Sasuke should have similar lean builds; Naruto's head became too small; Sasuke is the preferred reference. This feedback is not a formal image approval.

## Changes

- **Sasuke v01 is unchanged:** identical source, palette and scale. This is the visual reference for the next pass.
- **Naruto proportion_sample v02:** built-in imagegen edit of v01; one attempt selected. Narrower torso, less inflated sleeves/trousers, and a modestly larger complete head/hair mass. Original body lengths, poses and packing factor retained. Prompt percentages are requests, not measured guarantees.
- **Gojo source v02 is reused:** all four poses receive the same factor `228/557 = 0.40934` instead of `215/557 = 0.38600`. This removes the prior 215px cap for this review only. Anatomy is not stretched or independently resized by pose.
- **Killua source v01 is reused:** all four poses receive the same factor `170/464 = 0.36638` instead of `182/464 = 0.39224`. This is a proposed visual reduction of the previous occupied-pose normalization, preserving all body/head relationships.

The previous method treated crouched occupied height too much like literal stature. The new review explicitly distinguishes them. The repository's height inputs (Naruto166, Sasuke168, Killua158 and Gojo190+ cm) inform the height ordering and near-equal teen builds. They are not independently reverified canon measurements here. The exact factors remain an artistic proposal, including a stronger child/adult separation; they do not prove an exact canon height ratio. No kilogram values were guessed from pixels: weight is represented through lean teen versus lighter child versus athletic adult silhouettes.

## Measured result

| Fighter | Source | Shared factor | Idle occupied height incl. hair | Difference from prior |
|---|---|---:|---:|---|
| Naruto | proportion_sample v02 | 0.44843 | 214 px | Slimmer body; larger head; prior 209 px |
| Sasuke | proportion_sample v01 | 0.39370 | 215 px | Identical 215 px |
| Killua | proportion_sample v01 | 0.36638 | 187 px | Prior 200 px |
| Gojo | proportion_sample v02 | 0.40934 | 244 px | Prior 229 px |

Gojo/Killua idle occupied-height ratio is **244/187 = 1.305**, versus prior229/200=1.145. Gojo/Sasuke is244/215=1.135. Crouching, hair and pose affect these numbers; they are not upright anatomical stature. Each fighter uses exactly one factor across idle, guard, run and light1.

Review cells are **320x320 with floor y304**, which gives Gojo room to be taller. The previous round is placed into the same review canvas at unchanged native scale, with its floor aligned. Sasuke should match exactly when toggling rounds. This changes no production cells, ppu, hitboxes, gameplay stats or renderer. If approved, Claude must resolve the production cap using a common cast scale or an appropriate renderer/cell change; silently capping only Gojo again would reintroduce the issue.

## QA and review scope

All16 poses pack into the review board with48 colors per fighter, zero clipped pixels and no margin failures. Naruto's golden hair/skin colors and illustrative source edges retain the earlier production-validation caveat. These are static key-pose reference samples, not completed animation strips; no production scale-gate pass or exemption is claimed. Existing production approvals remain untouched.

- [Latest lineup](../../public/art-review/cast-proportion-pilot/lineup_v03.png)
- [Previous round on the same canvas](../../public/art-review/cast-proportion-pilot/comparison_v03.png)
- [Measured report](../../public/art-review/cast-proportion-pilot/qa_v03.json)
- [Interactive review](../../public/art-review/cast-proportion-pilot/index.html)

Recommend reviewing Naruto `proportion_sample v02` and cast `proportion_lineup v03`. No full animation work starts before this checkpoint is decided. Integration and production deployment remain Claude's responsibility; same real worktree `.worktrees/art-cast-proportion-pilot`, PR59.
