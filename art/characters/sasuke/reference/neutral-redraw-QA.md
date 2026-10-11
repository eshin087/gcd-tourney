# Sasuke neutral redraw checkpoint — 2026-10-11

All 42 canonical animations / 175 frames have new immutable source candidates. Every newest strip has the expected split count and an anatomical sidecar. None is approved. The user approved height_neutral v01 only, not these strips. Fixed idle_approved.png is untouched.

## Decision

HOLD the batch. After the measured palette declaration correction, main-tool strict pack exits 1: 1 ref, 18 ok, 3 uniform, 8 unmeasured, 2 drift, 9 pop, 1 exempt. There are 14 failing strips. A ref or exempt label does not mean art passed. The idle mask fragmentation is resolved by art data; actual limb/build differences and pose defects remain. A hair-probe pass alone cannot establish art readiness.

[Phone gallery](../../../../public/art-review/sasuke-neutral-redraw/index.html) includes every diagnostic frame and all newest raw sources. It is not the production atlas. [Exact current main pack log](neutral-palette-corrected-pack.txt), [diagnostic audit](neutral-candidate-audit.json), [source count audit](neutral-source-audit.json), [attempt ledger](neutral-attempts.json).

## Approved anatomical contract

Common cast K=233/242. Sasuke standing skull-to-sole194.8820073683px; approved neutral inferred crown165±10 to soles1128 =963sourcepx. Inferred chin286±10 gives skull121sourcepx, target24.4867319746px with approximately±2.84px landmark uncertainty. This is an inference under hair, not an exact anatomical measurement. No universal head ratio or whole-bounds fit is used.

Idle v06 raw A/B inferred crown158→chin260 =102±8px; soles958 gives800px posed skeleton. Factor24.4867319746/102 gives192.053px posed skeleton, slightly below194.882 standing with bent knees. Stitch scales A by0.9769; sidecar A heads99.6438, B102. Parent visual review finds improved torso/shins and consistent identity. Hips/knees remain covered and exact segment lengths uncertain. Both parts have used3 attempts; no more authorized yet.

Most other strips were generated against provisional idle v05 before the longer torso/shin correction. Direct visual comparison reveals some shorter torso/shin silhouettes. Do not normalize those away by adjusting skull scale or dismiss them as pose bounds.

## Reproducible tooling handoff: idle head mask

Run from this worktree:
`node ../../tools/pack-sprites.mjs sasuke --root art --out public --quantize 48`
Result exit1; [log](neutral-all42-final-pack.txt). Inputs raw/idle_v06.png, its JSON, parts idle_v06_A/B.png; declarations art/scale/builds.json Sasuke. No tool changes made.

Diagnostic reproduction: `node art/characters/sasuke/reference/neutral-review-export.mjs` imports current main pack/probe helpers and uses anatomical sidecars. This independent extraction is not identical to production packing and is clearly labeled; final gate verdicts come from main command above.

A f0 mask box[109,40,144,73], ratio1.277; B f4 box[109,45,124,69], ratio0.718. All idle frame ratios:1.277,1.281,1.212,1.251,0.718,0.713,0.729,0.718. A mask captures broad hair; B omits much of the right hair mass. See [A mask](../../../../public/art-review/sasuke-neutral-redraw/idle-mask-0.png), [B mask](../../../../public/art-review/sasuke-neutral-redraw/idle-mask-4.png). The declared palette and the B hair colors need investigation. Do not blindly edit declarations or exempt a true mismatch. Main reports idle24x26 versus saved baseline42x41. The self-reference label bypasses an internal consistency verdict, so it cannot certify the new anchor.

## Full-frame visual inspection

All175 diagnostic cells were visually inspected on six contact boards. Compact observations below apply to every frame in each named strip; uncertainty remains for covered crown/joints and probe occlusion. Source scale varies and must not be judged from raw canvas height.

| Animations | Visual findings / correction route |
|---|---|
| idle | v06 torso/shins improved; A/B palette mask inconsistency. Tool investigation then independent landmarks; cap reached both parts. |
| run | Stride readable; residual hair drift B, cap reached. Diagnostic f6 right clip6px differs from main report (main no clipping); investigate extraction difference. |
| dash, backDash | Low leaned poses; head/build differences remain, compare extended limb lengths to neutral then redraw if confirmed. |
| superDash | Leading fist corrected; main right clipping fixed with measured f1 x=-11 offset, scale unchanged. Head/build hold remains. |
| jumpSquat, jumpUp, jumpFall, land | Readable low/air/landing silhouettes. Probe uncertainty in tucked/occluded heads; no new exemptions. Preserve pose-dependent height. |
| light1, light2, light3 | Canonical forward attacks readable, correct counts. Recovery parts/body lengths need direct neutral comparison. light1 A cap reached. |
| light4 | Correct8frames; B noticeably smaller build/head than A. True anatomy/part consistency hold, redraw needed; A cap reached. |
| heavy | High kick/toes visible; folded landing/recovery body differences. Compare limb lengths before any measured refit. |
| airLight1, airLight2 | Aerial attacks readable, energy removed on correction. Hair/body consistency hold remains. |
| airLight3 | Correct6frames; B smaller head/body than A. Redraw part consistency. |
| airHeavy | Overhead downward action; white motion shape and arm occlusion require judgment. Probe pop may partly be head masking; not exempted. |
| guard, block | Forearms obscure hair. Existing guard version-specific evidence retained; no blanket exemptions. Anatomy still requires review. |
| hurtHigh, hurtLow | Reactions readable; hurtHigh corrected3frames and hand artifact. hurtHigh cap reached. |
| launched | Groundless horizontal body headleft/feetright; measured f0 x=+15 removes main left clipping, scale unchanged. |
| spin, airRecover | Rotation/tumble readable; changing facing is intentional rotation, not a fixed-facing error. Probe unmeasured cannot establish anatomy. |
| down, ko | Side-on ground poses headleft/feetright. No main ground/clipping warning; unmeasured heads require manual landmark review. |
| getup | Kip-up readable but pink ghost cluster f2 persists after3 attempts. HOLD, redraw once further attempts authorized. |
| charge | Flutter causes hair/rope variation; distinguish actual hair mass drift from intentional movement. |
| throw | Mouth blow without fire; readable. Head/body hold. |
| beamCharge | Overhead arms occlude head; masking uncertain. No exemption. |
| beamFire | Finger pointing readable; scale/build hold. |
| vanish | Two sliced silhouettes intentional; unmeasured, not passed. |
| stagger | f0/f2 lean same way rather than opposite canonical directions. Redraw pose correction remains. |
| special | Thrust recovery hand still spread rather than straight spear. B cap reached; hold. |
| intro, taunt, win | Folded arms / beckon / back crest readable. Head/build calibration remains; back view cannot compare hair bbox blindly. |
| specialForward | Correct7frames, spear hand and guard readable; B cap reached. Part head/limb differences remain. |
| specialUp | Rise/overhead movement readable. Raised foot height and head occlusion require correction/verification. |
| specialDown | Raised far left hand instead of canonical near right; pose correction remains. |
| superPose | Temple gesture/readable red iris; pinwheel detail not certified at game scale. Head/build hold. |

The observed limb differences require redraw, not scalar refitting. Refitting is suitable only when a whole part has the same anatomy but a measured uniform size difference. Keep rotation and genuine foreshortening distinct from anatomical compression.

## Technical evidence and limitations

Latest source audit:42/42 strips,175/175 frames,42/42 anatomical sidecars, no count mismatch. Palette is quantized48 for diagnostic display, not proof of a successful fighter atlas. Sidecar landmarks carry uncertainty (usually±8–12sourcepx). Main clipping warnings for superDash/launched were removed by measured placement-only offsets.

[Heads sheet](../../../scale/heads-sasuke.png) and [cast lineup](../../../scale/lineup.png) were regenerated from the LAST SUCCESSFUL PARTIAL ATLAS. They do not represent all42 newest strips because the strict pack writes nothing on failure. Game verification of that atlas is only partial integration evidence. Current review gallery shows every newest candidate separately.

Browser verification: gallery index.html loads all42 sections and175 frames with zero broken images. Partial-atlas game loads Sasuke custom sheet (42 animation names, mixed old/partial candidates) and no console errors. This does not verify newest42 strips in game; strict failure prevents that atlas. Build passes. No approval, merge, or production deployment is implied.


Build verification: local restricted-profile Vite adapter build passed (79 modules). Lead independently compared reconstructed idle f0/f4 at common cast scale against the approved neutral: Sasuke v06 qualitatively matches neutral body well. This is direction endorsement, not image approval or numeric certification.

## Measured palette resolution (supersedes the initial tooling blocker)

Actual idle hair ROI paints #20315b, #292b53, #294686, #293b6c were added only to Sasuke headColors in art/scale/builds.json. No engine/tool edits, no new exemption. Both A/B full head masks are now selected. New idle ratios [1.005,1.029,1.029,1,1,.995,1,1]; boxes approximately34–35 by32–34px. The same navy occurs on clothing; spatial head isolation remains necessary. Feet measurements are inconsistent and not used as anatomical proof. Compare gallery idle-mask-before-0/4.png with idle-mask-0/4.png. Old failure evidence above is retained historically.

Main final failures: backDash, superDash, jumpUp, light4, heavy, airLight3, airHeavy, block, charge, beamCharge, special, win, specialForward, specialUp. All42 source counts remain correct and no main clipping warning remains. The independent short-torso/shin and canonical-pose findings above remain holds even for animations marked ok by the hair probe. No scale factor was changed to force a pass.
## Follow-up: bounded corrections after checkpoint025ab20

Twelve latest candidates add longer torso/shins or correct canonical action: backDash v03, superDash v03, stagger v03, specialDown v03, win v03, charge v06, heavy v08, light4 v04, airLight3 v04, light1 v05, light2 v04, light3 v04. Earlier rows remain historical. SpecialDown now uses the near right arm, but f0 red iris remains a capped identity hold. Stagger now alternates lean correctly. Improved proportions still require user review.

Current main strict pack remains EXIT1 and writes no new atlas: light4, heavy, airLight3, charge, special, specialForward. Logs: neutral-corrections-pack-final.txt. All42 sources/175 frames and42 sidecars exist; no frame count mismatch. Body review remains separate from measured hair results.

Measured skull-ratio stitches for light1/2 avoid stale-public-idle refinement (after B/A1.002/1.015). Light3 initial inferred source landmark was corrected on enlarged review: A crown155/chin249=94±10, B155/257=102±10; sidecar changes are measurements, not a redraw or art approval. AirHeavy uses per-frame source crown/chin evidence instead of blanket100. These changes resolve their technical failures while pose/anatomy uncertainty remains documented.

Exact version/frame probe exceptions are in neutral-probe-exceptions.md; specialUp v03 f4 also selects the overhead navy forearm, clearly visible in specialUp-mask-4.png against specialUp-4.png. No real drift is exempted. Idle remains ref, unmeasured frames are not passed, and feet palette does not establish anatomy.

Capped failed images: light4 A/B3, heavy B3, airLight3 B3, charge3, special B3, specialForward B3. Their counterpart A attempts still available where ledger says so; redrawing A alone does not fix a capped bad B. Additional manual holds include getup pink ghost (cap3), specialDown red iris (cap3), runB residual drift uncertainty (cap3). No additional attempts authorized. The precise ledger is neutral-attempts.json. Remaining non-capped images are not automatically approved or anatomically certified.

Build passed79 modules after correction export. Candidate gallery contains diagnostic cells for newest42; game and heads/lineup still show last successful partial atlas. PR62 remains draft, not ready to merge. No engine/tool changes, approved idle replacement, merge, or production deploy.
