# Killua round-2 corrections

**2026-10-12 approval update:** the user approved idle v08, stagger v05, taunt v05. These artworks are approved; technical/contact holds and other candidate decisions remain separate. See APPROVALS.md. Original QA findings below are retained as historical evidence.


Existing real worktree: `.worktrees/art-killua-title-production`, branch `art/killua-title-production`, PR70. Main merged first. Six named strips only; no tech, UI, down/KO, engine or tooling changes. Built-in imagegen prompts and call history are in [generation-record.json](generation-record.json).

## Recommendations and holds

| Candidate | Head vs approved combat | Recommendation | Native frame inspection |
|---|---:|---|---|
| idle v08 | 0.983, ok | Approve | Same head/torso/limbs/clothing build as combat; widths141-143 vs reference148, soles240. Crown95-98, f7-to-f0 dip2px, improved from4-6px; collar stable. Residual small breathing wobble disclosed. |
| stagger v05 | 0.996, ok | Approve | Compact spiky hair, head40x30 approximately vs reference40x31; body/poses preserved. Standing height182-185 vs neutral186. No new bulk or limb elongation. |
| taunt v05 | 0.996, ok | Approve | Compact spiky hair; identity and tongue/eye gesture retained. Height184-185 vs neutral186; torso and limbs match neutral. |
| charge v13 | 0.920, drift | HOLD | v12 over-shrank to0.84; final call improved but hair remains too small against its crouched torso. Both remaining calls exhausted. Not a probe exemption. |
| beamFire v09 | 1.038, ok | HOLD | Middle footprint128px vs140/141 and palms shift more than1-2px after packing. Source middle figure remains narrower despite request. Final available call used. No invented beam support or gameplay change. |
| run v09 | 1.032, ok | HOLD | Two new B calls still leave the opposite anatomical leg ambiguous. Head stable but step loop bobs with phase heights141-161. Do not approve merely because numeric gate says ok. A unchanged from v08, B exhausted5 cumulative. |

Every frame stays inside x4..251 (see [measurements](measurements.json)); facing right and lowest opaque pixel y240. Quantized output48 colors. Feet-color ratios include matching light pixels elsewhere, not literal footwear dimensions: inspect native footwear. Independent lead review agreed the three recommendations and three holds. Native stagger contact really contains the approved combat reference in its first256px cell (6749 opaque pixels); it is not a blank reference.

## Packing evidence

`node tools/pack-sprites.mjs killua --quantize 48 --strict-scale` exits1 on charge v13 and writes no fighter atlas. [Full report](full-strict-pack.txt). Existing coordinator manual-QA findings and historical baseline/floor warnings retained; no new exemptions, threshold or bodyHeight changes. The packer's incidental UI output rewrites are discarded because UI is outside this task.

Six-strip isolated strict pack also exits1 on charge. To inspect actual quantized held pixels, the disposable fixture explicitly switches only its character mode to warn, retaining the original combat reference and thresholds. [Diagnostic report](diagnostic-warn-pack.txt). This atlas is labelled diagnostic and is never a full fighter pass.

A separate idle/stagger/taunt-only fixture packs with `--quantize 48 --strict-scale`, exits0, all3 strips `ok`, no warning. [Passing strict report](passing-strict-pack.txt). It deliberately omits39 animations and is not a production sheet. Every version asserted against the candidate inventory. [Passing heads](passing-scale/heads-killua.png); [all six diagnostic heads](scale/heads-killua.png). Inspect `native-passing-*` for the three clean subset cells; `native-*` shows all six held-review atlas cells. `--quantize` leaves the regular `frames/` cache stale; it was not used for this inspection.

The [lineup](lineup-idle_v08.png) was generated with `npm run lineup -- --candidate` from the actual packed idle cell. Other cast columns are their currently packed older atlases; historical build-band warnings are not a new cast certification. Exact approved neutral/combat cells are available in the review page for equal-density comparison.

Reproduce from this worktree with `node art/characters/killua/production/title-style/round2/reproduce.mjs`. Disposable `fixture/` and `passing-fixture/` source copies are not committed. No per-frame art was painted or programmatically altered.

## Delivery checks

Production application build passed via `node --preserve-symlinks --preserve-symlinks-main ../../.codex/vite.mjs build` (82 modules); `git diff --check` clean; review page module passes `node --check`. Port5223 dev server reports ready, but browser access to localhost timed out from the bridge and read-only shell HTTP checks were blocked (EACCES then ETIMEDOUT when escalated). Live player rendering/console and gameplay-loop smoke are not certified here. The complete frame contacts and wrap transitions were independently inspected at native scale. The dedicated preview is configured to use the correct strict subset for the three recommended candidates and labels all held cells diagnostic; Claude still owns in-game contact/hurtbox integration.
