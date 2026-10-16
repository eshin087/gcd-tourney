# Naruto round-4 segment audit

Actual quantized atlas, 256px cells at one density. Every listed frame inspected; generated attempts are unapproved. No skull, hidden joint or shoe length is guessed to obtain a pass.

| Set / animation | Frame | Hair crown to chin | Collar marker to hem | Arm chain | Leg chain | Profile sandal |
|---|---:|---:|---:|---:|---:|---:|
| baseline / idle | 0 | 38 +-2 | 38.6 +-2 | 46 +-12 | 68  +-12 | 27.1  +-2 |
| baseline / stagger | 0 | 43 +-2 | 49.2 +-2 | 55 +-12 | 72  +-12 | 32  +-2 |
| baseline / stagger | 1 | 43 +-2 | 49 +-2 | 55 +-12 | 71  +-12 | 32  +-2 |
| baseline / stagger | 2 | 44 +-2 | 49.2 +-2 | 55 +-12 | 72  +-12 | 33  +-2 |
| baseline / stagger | 3 | 44 +-2 | 49 +-2 | 54 +-12 | 71  +-12 | 32  +-2 |
| baseline / taunt | 0 | 41 +-2 | 48.5 +-2 | 49 +-12 | 70  +-12 | 26  +-2 |
| baseline / taunt | 1 | 41 +-2 | 48.5 +-2 | 49 +-12 | 70  +-12 | 26  +-2 |
| baseline / jumpUp | 0 | 43 +-2 | 41 +-2 | 49 +-12 | 75  +-12 | skipped  |
| baseline / jumpUp | 1 | 43 +-2 | 41 +-2 | 49 +-12 | 73  +-12 | skipped  |
| baseline / win | 0 | 42 +-2 | 47 +-2 | 48 +-12 | 70  +-12 | 24  +-2 |
| baseline / win | 1 | 41 +-2 | 45 +-2 | 52 +-12 | 70  +-12 | 24  +-2 |
| baseline / win | 2 | 41 +-2 | 45 +-2 | 52 +-12 | 70  +-12 | 24  +-2 |
| baseline / win | 3 | 42 +-2 | 44 +-2 | 48 +-12 | 71  +-12 | 24  +-2 |
| baseline / superDash | 0 | 43 +-2 | 42.5 +-2 | 54 +-12 | skipped  | skipped  |
| baseline / superDash | 1 | 43 +-2 | 42 +-2 | 53 +-12 | skipped  | skipped  |
| candidate / stagger | 0 | 49 +-2 | 48 +-2 | 55 +-12 | 73  +-12 | 35  +-2 |
| candidate / stagger | 1 | 49 +-2 | 48 +-2 | 55 +-12 | 73  +-12 | 35  +-2 |
| candidate / stagger | 2 | 49 +-2 | 49 +-2 | 55 +-12 | 74  +-12 | 35  +-2 |
| candidate / stagger | 3 | 49 +-2 | 48 +-2 | 55 +-12 | 74  +-12 | 35  +-2 |
| candidate / taunt | 0 | 47 +-2 | 45 +-2 | 55 +-12 | 78  +-12 | 32  +-2 |
| candidate / taunt | 1 | 47 +-2 | 45 +-2 | 54 +-12 | 78  +-12 | 32  +-2 |
| candidate / win | 0 | 47 +-2 | 44 +-2 | 56 +-12 | 78  +-12 | 27  +-2 |
| candidate / win | 1 | 46 +-2 | 45 +-2 | 57 +-12 | 78  +-12 | 28  +-2 |
| candidate / win | 2 | 46 +-2 | 45 +-2 | 56 +-12 | 78  +-12 | 27  +-2 |
| candidate / win | 3 | 47 +-2 | 45 +-2 | 56 +-12 | 79  +-12 | 27  +-2 |

The first column is hair-inclusive visible head extent, not a skull measurement. Scalp is hidden by hair. Arm/leg chains are projected manual estimates with conservative total uncertainty; they cannot certify the +-6% gate. Frontal shoulders are skipped for every 3/4/rotated pose. JumpUp shoes and superDash folded legs/sole-on shoes are skipped for the reasons in segments.json.

- **stagger:** torso f0 49.2+-2 vs idle38.6+-2; conservative47.2/40.6=1.163. All four torso markers49-49.2. Profile shoe32+-2 vsidle27.1+-2 conservative30/29.1=1.031 inconclusive, not a shoe pass.
- **taunt:** torso both48.5+-2 vsidle38.6+-2; conservative46.5/40.6=1.145.
- **win:** torso f0 47.0+-2 vsidle38.6+-2; conservative45/40.6=1.108. Individualf1-f3 may be inconclusive, f0 suffices to evidence strip failure.

JumpUp and superDash remain inconclusive; zero calls, no redraw authorized by the noisy B proxy alone. Stagger, taunt and win each got one new built-in call, on top of three historical title calls. No new version or attempt resets that cumulative count. Their current packed candidates do not pass: Claude owns normalization/contact calibration.
