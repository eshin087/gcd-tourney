# Goku skills revamp batch 4 candidate inventory

All seven candidates are v01, remain unapproved, and are queued for user review. The exact prompt and call record are in each linked provenance file. Character strips each used one generation call. `kiBlast` and `kiMuzzle` used one call each; `kiBlastBurst` and `superSaiyanBurst` used two calls each, within the three-call cap.

| Asset | Calls / selection | Source SHA-256 | Generation record | Current technical note |
|---|---:|---|---|---|
| `specialUp` v01 | 1 / call 1 | `9C664A4B11F7D7AC1E9D6CA4331878EF5E3C05036FA811F4E21566087D48BF44` | [provenance and exact prompt](specialUp_v01.md) | Candidate pack blocked by the known Goku head probe; no candidate atlas written. Source is 2172x724, packed diagnostic scale x0.366. |
| `throw` v01 | 1 / call 1 | `A70D621CB6CACD8BBBB3F78FF38F48BDB729FD424C391D3AEEB5AB3E53F2E09D` | [provenance and exact prompt](throw_v01.md) | Candidate pack blocked by the known Goku head probe; no candidate atlas written. Source is 2172x724, packed diagnostic scale x0.316. |
| `intro` v01 | 1 / call 1 | `03A16F4F1476888B7C0CEC83799C5DD2E2E60127AE00544353607D0DDF2455C4` | [provenance and exact prompt](intro_v01.md) | Candidate pack blocked by the known Goku head probe; no candidate atlas written. Source is 2172x724, packed diagnostic scale x0.305. |
| `kiBlast` v01 | 1 / call 1 | `4F683ECE78AE9238208FB108245D0C34E0B6502966D990067D3A6AE0982C3AFA` | [provenance and exact prompt](../../../vfx/production/skills-revamp-batch4/kiBlast_v01.md) | Six spheres detected; source layout is 2172x724, pack scale x0.363. Exact 64px core, anchor and loop remain unmeasured. |
| `kiMuzzle` v01 | 1 / call 1 | `DB4E54C78629D33EEC414E358C3BAFC74A706AA93855940066C0A19A70794740` | [provenance and exact prompt](../../../vfx/production/skills-revamp-batch4/kiMuzzle_v01.md) | Five frames detected; source layout is 2048x683, pack scale x0.354, five specks removed. Center and per-frame dimensions remain unmeasured. |
| `kiBlastBurst` v01 | 2 / call 2 selected | `294C42919AA644C9D9BABE0EA0069B886C30239CCCAF632DC49A87D94D14E1A2` | [provenance and exact prompt](../../../vfx/production/skills-revamp-batch4/kiBlastBurst_v01.md) | Seven frames detected; source pack scale x0.653, 17 specks removed. Soft/speckled edges remain. |
| `superSaiyanBurst` v01 | 2 / call 2 selected | `E6BB32F4FB33FE3CC4B2EC4AB90EEBAA64674BD04A8AED9EBE13C14B40AF3456` | [provenance and exact prompt](../../../vfx/production/skills-revamp-batch4/superSaiyanBurst_v01.md) | Packer found 9 frames for 8 expected, split one touching group, scaled x0.328 and reports clipping. Technical HOLD. |

Packer evidence: `node tools/pack-sprites.mjs goku --candidates --quantize 48` exits 1 because `specialUp`, `throw`, and `intro` lack version-bound `scaleManualQA` for the unusable head probe; no candidate Goku atlas is written. `node tools/pack-sprites.mjs vfx --candidates` packs 85 effects / 558 frames into the candidate atlas; `superSaiyanBurst` is 9/8 and clipped. These are source/layout and gate findings, not judgments about the user's visual approval.

The VFX candidate atlas is `public/preview/vfx/atlas_hd_goku.png`. The gallery contains copies of the seven untouched raw sources for direct review.
