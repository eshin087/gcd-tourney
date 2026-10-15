# Round-4 generation budget incidents

Recorded 2026-10-13 (local). These are execution errors, not extra user authorization. No image approval follows from recovery.

## Naruto light1Alt Part A

The recovered predecessor session log proves four successful Part A generations against the three-call maximum. A separate six-reference preflight error produced no image. The current worker reconciled the exact output sequence in `art/characters/naruto/production/alts/ATTEMPT_INVENTORY.md` on `art/naruto-alts`; Part B had two successful generations as of this checkpoint. No further Part A calls are allowed. Existing v01 is immutable and on technical HOLD; remaining ten alts continue within their own budgets.

## Gojo airLight2

The resumed worker made three calls when only one remained: five successful round-4 calls against the maximum of three. Calls 4 and 5 exceeded the authorization. It then copied the three new outputs onto temporary source names call1/call2/call3, overwriting the first two source copies. The versioned `raw/airLight2_v05.png` was untouched.

Root recovered both original source files and verified their original SHA-256 hashes:

- call1: `14fff9bdb7fcff22d02ab401a679cfdf88a939b3ed0b2d6d7dba05f324fc4414`, recovered from the preserved round-4 visualization source. An exact original also exists at `E:/Vibe Coding/.codex/generated_images/01a133e3-4794-7e63-bcc8-2642bbfd6728/exec-1a0fc08b-6257-46ea-842b-09593d9018f3.png`.
- call2: `84a80437cc13504a6c34567eeaab84f71e22d510ea0aaada0ad077bf5491f989`, recovered from immutable `raw/airLight2_v05.png`. An exact original also exists at `E:/Vibe Coding/.codex/generated_images/01a133fb-2574-7412-9111-ec0a0f6a9cb4/exec-64d7a95b-a544-4559-8356-7ec5c122a1d0.png`.

All three new outputs were first copied to unique `production/round4/sources/airLight2-budget-incident-20261013/round-call{3,4,5}.png` paths:

| Actual round call | SHA-256 |
|---|---|
| 3 | `7746b98688bf85559a895248b59eaa0bd3db4b6899ee94ad6eb0fbaaf8e73e4f` |
| 4 (over limit) | `5199f8c6ee6da0bb1971cbce832f5dfbc532fbd75e998feb9f89638370677e61` |
| 5 (over limit) | `f0907fb68eb8f3248a36baab566c53655278b3a0b619e4937607834578a1d307` |

The selected airLight2 candidate remains original call2, v05. The later outputs were not selected. Gojo generation stopped; measurement, final Astra audit and review packaging continue with existing candidates. The worker must expose the breach in its ledger, QA, task notes and REVIEW row. No source history is lost after recovery.

## Continuation constraint

Every future image call reserves its asset/part round count in the durable ledger before execution, then records original path and hash immediately afterward. A new version does not reset that count. Displaying an existing output uses an image-view tool and consumes no generation call. Source copies must use new paths and be verified before any recovery replacement.
## 2026-10-14 repair-call handling and taunt misfiling

The Naruto alt worker made three authorized successful repair renders (light2Alt Part A, light3Alt Part A, and the user's one complete airHeavyAlt redraw). It also made an unnecessary empty-prompt imagegen invocation after light2Alt; this returned HTTP 400 with no output. That fourth tool invocation is an execution error, not extra authorization, and remains recorded separately from the three successful renders. No replacement light2 render was made. Its initial result was not forwarded, so recovery binding relies on its task-local generated-images directory, timestamp/order and content, rather than a captured returned path. The later two outputs have explicit returned paths. Full provenance is in the alt branch's production/alts/ATTEMPT_INVENTORY.md.

Separately, the upright worker used a global latest-output lookup and incorrectly filed that light2Alt output (SHA256 c95b19c4d375ea10f5ae9aa07c40fa34334a4c55ed822a5be48b7bbcea510569) as taunt_v08. Root's visual check detected the four-frame kick. The incorrect bytes are preserved at raw/_qa_hold/taunt_v08.png, excluded from packing, with a REVIEW row. The earlier claim of taunt pose drift was a misfiling diagnosis error, not the actual taunt render. The correct two-frame pointing/callout image was recovered from the upright task's own generated-images directory and filed unchanged as taunt_v09 (SHA256 fa32086af1cf55398f81d840e8af7ef96eb31ff85bc69cef840b481cb47967ff). Stagger07 and taunt09 used exactly one new call each; recovery used no generation. Source commit fec0703 preserves the audit trail.

Future saves must capture the exact imagegen output path immediately and bind it to the prompt/call before filing. Never select a global newest file or generate a probe to recover a result. Neither recovery nor a new filename resets budgets or grants approval.