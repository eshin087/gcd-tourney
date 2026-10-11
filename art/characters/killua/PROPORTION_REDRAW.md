# Killua approved-neutral full proportion redraw

User approved height_neutral v01 on 2026-10-11 and authorized all42 animations. This supersedes the former scale-fix routes. Fixed height_neutral.png copies that exact approved reference; no new strip is approved. New idle is a provisional production anchor only and never overwrites idle_approved.png without user approval.

## Anatomy contract

Approved silhouette, head/hair mass, face, costume and build are the source of truth. Shared linear cast scale removes child discount and individual tall cap. Final common pack target pending lead numeric contract; no pack target guessed. Study review target190.36px is not yet a production target. Neutral source1254 square: inferred skull crown176±10, soles1098±2; inferred head crown-to-chin roughly122±12px. Identity expressions remain approved expressions.png. Old model sheet anatomy and182px/6-head text no longer control redraw.

SCALE LOCK: same approved neutral anatomy in every pose, identical skull-to-chin length and hair mass, shoulder build and limb lengths. Preserve foreshortening without resizing the body to the strip bounds. No per-pose fit. All parts at most5frames; partB uses selectedpartA and measured stitch.

## Full frame list and immutable next versions

| Animation | Frames | Parts | Next version |
|---|---|---|---|
| idle | f0, f1, f2, f3, f4, f5, f6, f7 | 4+4 | v02 |
| run | f0, f1, f2, f3, f4, f5, f6, f7 | 4+4 | v04 |
| dash | f0, f1 | 2 | v03 |
| backDash | f0, f1, f2 | 3 | v02 |
| superDash | f0, f1 | 2 | v03 |
| jumpSquat | f0 | 1 | v03 |
| jumpUp | f0, f1 | 2 | v03 |
| jumpFall | f0, f1 | 2 | v03 |
| land | f0, f1 | 2 | v02 |
| light1 | f0, f1, f2, f3, f4, f5, f6 | 4+3 | v03 |
| light2 | f0, f1, f2, f3, f4, f5, f6 | 4+3 | v03 |
| light3 | f0, f1, f2, f3, f4, f5, f6 | 4+3 | v03 |
| light4 | f0, f1, f2, f3, f4, f5, f6, f7 | 4+4 | v03 |
| heavy | f0, f1, f2, f3, f4, f5, f6, f7 | 4+4 | v08 |
| airLight1 | f0, f1, f2, f3, f4 | 5 | v04 |
| airLight2 | f0, f1, f2, f3, f4 | 5 | v05 |
| airLight3 | f0, f1, f2, f3, f4, f5 | 3+3 | v04 |
| airHeavy | f0, f1, f2, f3, f4, f5 | 3+3 | v03 |
| guard | f0, f1 | 2 | v05 |
| block | f0, f1 | 2 | v05 |
| hurtHigh | f0, f1, f2 | 3 | v04 |
| hurtLow | f0, f1, f2 | 3 | v04 |
| launched | f0, f1 | 2 | v02 |
| spin | f0, f1, f2, f3 | 4 | v02 |
| airRecover | f0, f1, f2 | 3 | v03 |
| down | f0, f1 | 2 | v03 |
| getup | f0, f1, f2, f3, f4 | 5 | v03 |
| charge | f0, f1, f2, f3 | 4 | v09 |
| throw | f0, f1, f2, f3 | 4 | v04 |
| beamCharge | f0, f1, f2 | 3 | v06 |
| beamFire | f0, f1, f2 | 3 | v06 |
| vanish | f0, f1 | 2 | v02 |
| stagger | f0, f1, f2, f3 | 4 | v02 |
| ko | f0 | 1 | v04 |
| special | f0, f1, f2, f3, f4, f5, f6, f7 | 4+4 | v03 |
| intro | f0, f1, f2, f3 | 4 | v02 |
| taunt | f0, f1 | 2 | v02 |
| win | f0, f1, f2, f3 | 4 | v02 |
| specialForward | f0, f1, f2, f3, f4, f5, f6 | 4+3 | v08 |
| specialUp | f0, f1, f2, f3, f4, f5 | 3+3 | v06 |
| specialDown | f0, f1, f2, f3 | 4 | v02 |
| superPose | f0, f1, f2, f3 | 4 | v05 |

## Prompt blocks and QA

Use canonical animation/pose descriptions from PROMPTS.md and KIT.md, replacing their old anatomy clauses with the SCALE LOCK above; keep all timings/frame counts/poses/contact intentions. Prefix each generation: anime fan-art sprite, approved height_neutral.png primary anatomy and identity reference; expressions.png expression reference; provisional new idle source as consistency anchor after idle. Same right-facing3/4 camera, dark outlined hard pixels, flat limited palette and #FF00FF, no effects, text, shadow or grid. Max3attempts per image; retain best, never overwrite version history.

Idle first:8frames4+4, fixed feet, breathing through knees/chest only. Generate entire remaining42-scope against this new provisional anchor without invented approval. KO/down use KO_DOWN_BRIEF side-on long low grounded body, same anatomical scale; head/back/hips/heels share floor. Heavy/charge follow KIT revised actions.

Required perstrip: finalquantize48pack exit0 with stripok, heads and castlineup visual check; lying poses floor-contact check; browser load and transitions. Probe ambiguities need specific measured proof; no blanket exemptions. Claude owns tools/integration/production and main bookkeeping. Existing untracked audit/sample artifacts preserved.

## Final common production contract

K=233/242=0.9628099173553719 applied to every approved neutral study target. Killua standing skull-to-sole183.28188788210693px; source1099-176=923px; factor0.198572; measured neutral skull-to-chin122±12sourcepx gives target24.23±2.38gamepx. No universal31pxhead. Pixelcell256,pivot128/240,ppu128 unchanged. Sidecars use measured sourcehead alongitsaxis, never posedbounds.
