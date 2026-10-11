# Approved cast baseline and full-frame redraw contract

Approved by the user in chat on 2026-10-11: cast height_lineup v01 and Naruto, Sasuke, Killua, Gojo height_neutral v01. User authorized remaking all 42 canonical animations per fighter. This approves the references and production direction, not future generated frames. Claude alone integrates, merges, deploys production, edits main/NOW/inbox. Workers may publish committed previews.

This user decision supersedes earlier conflicting anatomy directions: equal31px heads, forced6.45/7heads, Naruto bulk, Gojo shoulder inflation, child height discounts, near-equal-height rounding and individual tall-character caps. Old prompts/ADRs describe historical shipped art; Claude owns formal spec/ADR migration. No engine or gameplay change is authorized here.

## Three separate measurements

1. Canon stature: era-specific centimetres, with source and uncertainty. No shared fictional universe establishes crossover scale; use the same physical centimetre across series.
2. Anatomy: skull-to-chin length along the head axis; shoulder/chest/limb landmarks from approved neutral art. Hair is excluded from anatomical height, but retained as a separate visual mass. Preserve individual head-to-body ratios; do not force every character into a universal head count.
3. Occupied silhouette: hair, clothing, pose, arms and effects. A crouch, run, jump or fallen body must change its bounding box without changing the person's size. NEVER fit every pose's bounding box to standing height.

## Shared production scale

Approved review scale =200/166 pixels/cm. Approved neutral occupied heights=210,213,207,242. Production standing envelope=233px. Apply ONE common factor K=233/242=0.9628099173553719 to the entire cast, preserving all approved ratios. This is a pixel-budget adaptation, not a new anatomy choice. Cell256x256, pivot[128,240], ppu128 remain unchanged. Candidate metadata below requires Claude's reach/lunge/hurtbox validation before integration.

| fighter/era | height input cm | review body px | production body px | approved raw crown/sole y | raw skeleton px |
|---|---:|---:|---:|---|---:|
| Naruto Shippuden |166|200|192.561983|153/1100|947|
| Sasuke Shippuden |168|202.409639|194.882007|165/1128|963|
| Killua series profile |158|190.361446|183.281888|176/1099|923|
| Gojo adult |190 working lower bound for190+|228.915663|220.402270|108/1153|1045|

Neutral raw factor = production body / raw skeleton. Measure the approved raw skull-to-chin length; multiply by that factor for each fighter's head target. Inferred crowns carry +/-10source pixels (~2packed pixels) uncertainty. Shoe soles are the common baseline, not precise barefoot anthropometry. Do not silently invent a more precise Gojo height.

Use existing per-strip anatomy sidecars (measurement skull-to-chin, targetHeadPx, sourceHeadPx per frame), independently measured along tilted head axes. Per-frame measurement corrects generator drift, not intentional squash/stretch. Investigate source body length, feet and limb ratios too: forcing only head length can hide body drift. Never extrapolate a factor from posed occupied height. Stitched parts use measured head/landmark agreement, not eyeballed factors.

## Anatomy and build lessons

- Naruto and Sasuke have similar lean teenage builds. Sleeve volume, rope belt and fighting hands do not measure body weight or shoulder breadth.
- Gojo is a tall lean adult, not a bodybuilder. Preserve approved neutral chest, deltoids, arms, long limbs and compact head. Do not compensate for lost height by increasing bulk.
- Killua remains youthful through face, hair, build and costume. His158cm stature is already shorter; no extra age discount. Large hair is not a large skull.
- Preserve identity, costume and palette across views. Show front/three-quarter/side/back reference before adding a future character; neutral upright stance establishes stature, combat samples establish how it reads in motion.
- Count anatomical heads only from measured skull crown to chin, excluding hair. Record measured values and uncertainty; neither a prompt percentage nor a borrowed class ratio is QA evidence.

## Full-frame production and review

Inventory all42 canonical animations and their exact frame counts from manifest and src/art/animGuide.js. Preserve KIT move design, phase/contact zones and timing. No new animation names. Lying down/ko must be drawn side-on at the game's camera with correct ground contact, per KO_DOWN_BRIEF.md; do not shrink width to fake fit.

Generate the new idle first from approved height_neutral.png. User authorized the full batch; a new candidate idle may be used provisionally as a working continuity reference, explicitly labelled unapproved. Never replace idle_approved.png or model_sheet.png with an unapproved candidate. Approval of a reference does not approve generated strips. Inspect idle independently because the current probe labels idle ref, not ok.

Long strips>=6frames use parts with at most5frames per generated image, same source detail, then measured stitch. Up to3 attempts per image; keep only best, new immutable version above every version in raw/_parts/_rejected/REVIEW. Save exact prompts, source landmark measurements and any version-specific sidecars.

For each new strip: pack with --quantize48, require exit0 and strip ok; inspect every frame, head sheet and cast lineup. Check head/hair stability, limb lengths/build, feet/floor, palette edges, facing, contact reach, clipping and correct pose phase. Current gate: median head±6%, within-strip pop<=12points. Manual QA remains mandatory. Exempt only a genuine demonstrated probe misread, with frame/version and a written reason; never weaken thresholds to accept bad art.

When replacing a whole baseline, old approved strips may report mismatches temporarily. Keep old-versus-new results explicit; do not claim full-character clean until all42 replacements pass. A passing reference review pack is not an animation scale-gate pass. Build, browser/game custom-sheet load, console and representative movement/attack playback precede handoff.

## Future characters

Record era, stature source/confidence and build in CHARACTER.md; create neutral reference, measured anatomical landmarks and cast lineup at the common pixels/cm. User approves before full production. If a taller/wider future design cannot fit, bring the constraint to Claude for a cast-wide or renderer/cell decision. Never silently shrink that fighter, enlarge its head or bulk it up. Keep one numeric contract linked from CHARACTER_SCALE, STYLE_GUIDE, PIPELINE, character prompts and template; archive conflicting values clearly.

## Coordinator handoff

Formal updates to SPEC/ADRs and any renderer/reach/gameplay decisions remain Claude's. Candidate standingBodyPx values and existing anatomical sidecars suffice for art previews; shipping requires contact/hurtbox validation, especially smaller teens and tallerGojo. Do not tune gameplay to conceal art issues. No new asset is merge-ready without the user's final image decisions.

Baseline artifacts: art/characters/<id>/reference/height_neutral_v01.png and fixed height_neutral.png. Measurement provenance: HEIGHT_STUDY_V01.md and public/art-review/cast-proportion-pilot/height_qa_v01.json. Approved gallery: public/art-review/cast-proportion-pilot/height_lineup_v01.png.
