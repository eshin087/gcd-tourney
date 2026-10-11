# Approved cast baseline and full-frame redraw contract

Approved by the user in chat on 2026-10-11: cast height_lineup v01 and Naruto, Sasuke, Killua, Gojo height_neutral v01. User authorized remaking all 42 canonical animations per fighter. This approves the references and production direction, not future generated frames. Claude alone integrates, merges, deploys production, edits main/NOW/inbox. Workers may publish committed previews.

This user decision supersedes earlier conflicting anatomy directions: equal 31 px heads, forced 6.45/7-head ratios, Naruto bulk, Gojo shoulder inflation, child height discounts, near-equal-height rounding and individual tall-character caps. Old prompts/ADRs describe historical shipped art; Claude owns formal spec/ADR migration. No engine or gameplay change is authorized here.

## Three separate measurements

1. Canon stature: era-specific centimetres, with source and uncertainty. No shared fictional universe establishes crossover scale; use the same physical centimetre across series.
2. Anatomy: skull-to-chin length along the head axis; shoulder/chest/limb landmarks from approved neutral art. Hair is excluded from anatomical height, but retained as a separate visual mass. Preserve individual head-to-body ratios; do not force every character into a universal head count.
3. Occupied silhouette: hair, clothing, pose, arms and effects. A crouch, run, jump or fallen body must change its bounding box without changing the person's size. NEVER fit every pose's bounding box to standing height.

## Shared production scale

Approved review scale = 200/166 pixels/cm. Approved neutral occupied heights = 210, 213, 207, 242. Production standing envelope = 233 px. Apply ONE common factor K = 233/242 = 0.9628099173553719 to the entire cast, preserving all approved ratios. This is a pixel-budget adaptation, not a new anatomy choice. Cell 256×256, pivot [128,240], ppu 128 remain unchanged. Candidate metadata below requires Claude's reach/lunge/hurtbox validation before integration.

| fighter/era | height input cm | review body px | production body px | approved raw crown/sole y | raw skeleton px |
|---|---:|---:|---:|---|---:|
| Naruto Shippuden |166|200|192.561983|153/1100|947|
| Sasuke Shippuden |168|202.409639|194.882007|165/1128|963|
| Killua series profile |158|190.361446|183.281888|176/1099|923|
| Gojo adult |190 working lower bound for 190+|228.915663|220.402270|108/1153|1045|

Neutral raw factor = production body / raw skeleton. Measure the approved raw skull-to-chin length; multiply by that factor for each fighter's head target. Inferred crowns carry ±10 source pixels (~2 packed pixels) uncertainty. Shoe soles are the common baseline, not precise barefoot anthropometry. Do not silently invent a more precise Gojo height.

Use existing per-strip anatomy sidecars (measurement skull-to-chin, targetHeadPx, sourceHeadPx per frame), independently measured along tilted head axes. Per-frame measurement corrects generator drift, not intentional squash/stretch. Investigate source body length, feet and limb ratios too: forcing only head length can hide body drift. Never extrapolate a factor from posed occupied height. Stitched parts use measured head/landmark agreement, not eyeballed factors.

## Anatomy and build lessons

- Naruto and Sasuke have similar lean teenage builds. Sleeve volume, rope belt and fighting hands do not measure body weight or shoulder breadth.
- Gojo is a tall lean adult, not a bodybuilder. Preserve approved neutral chest, deltoids, arms, long limbs and compact head. Do not compensate for lost height by increasing bulk.
- Killua remains youthful through face, hair, build and costume. His 158 cm stature is already shorter; no extra age discount. Large hair is not a large skull.
- Preserve identity, costume and palette across views. Show front/three-quarter/side/back reference before adding a future character; neutral upright stance establishes stature, combat samples establish how it reads in motion.
- Count anatomical heads only from measured skull crown to chin, excluding hair. Record measured values and uncertainty; neither a prompt percentage nor a borrowed class ratio is QA evidence.

## Full-frame production and review

Inventory all 42 canonical animations and their exact frame counts from manifest and src/art/animGuide.js. Preserve KIT move design, phase/contact zones and timing. No new animation names. Lying down/ko must be drawn side-on at the game's camera with correct ground contact, per KO_DOWN_BRIEF.md; do not shrink width to fake fit.

Generate the new idle first from approved height_neutral.png. User authorized the full batch; a new candidate idle may be used provisionally as a working continuity reference, explicitly labelled unapproved. Never replace idle_approved.png or model_sheet.png with an unapproved candidate. Approval of a reference does not approve generated strips. Inspect idle independently because the current probe labels idle ref, not ok.

Long strips with 6 or more frames use parts with at most 5 frames per generated image, same source detail, then measured stitch. Up to 3 attempts per image; keep only best, new immutable version above every version in raw/_parts/_rejected/REVIEW. Save exact prompts, source landmark measurements and any version-specific sidecars.

For each new strip: run `node tools/pack-sprites.mjs <id> --quantize 48`, require exit 0 and strip `ok`; inspect every frame, head sheet from `npm run scale -- <id>` and cast lineup from `npm run lineup`. Check head/hair stability, limb lengths/build, feet/floor, palette edges, facing, contact reach, clipping and correct pose phase. Current gate: median head ±6%, within-strip pop ≤12 percentage points. Manual QA remains mandatory. Exempt only a genuine demonstrated probe misread, with frame/version and a written reason; never weaken thresholds to accept bad art.

When replacing a whole baseline, old approved strips may report mismatches temporarily. Keep old-versus-new results explicit; do not claim full-character clean until all 42 replacements pass. A passing reference review pack is not an animation scale-gate pass. Build, browser/game custom-sheet load, console and representative movement/attack playback precede handoff.

## Future characters

Record era, stature source/confidence and build in CHARACTER.md; create neutral reference, measured anatomical landmarks and cast lineup at the common pixels/cm. User approves before full production. If a taller/wider future design cannot fit, bring the constraint to Claude for a cast-wide or renderer/cell decision. Never silently shrink that fighter, enlarge its head or bulk it up. Keep one numeric contract linked from CHARACTER_SCALE, STYLE_GUIDE, PIPELINE, character prompts and template; archive conflicting values clearly.

## Coordinator handoff

Formal updates to SPEC/ADRs and any renderer/reach/gameplay decisions remain Claude's. Candidate standingBodyPx values and existing anatomical sidecars suffice for art previews; shipping requires contact/hurtbox validation, especially smaller teens and taller Gojo. The historical ENG-061 assumption of 30% wider Gojo hurt boxes is superseded; derive geometry from the lean approved frames. Do not tune gameplay to conceal art issues. No new asset is merge-ready without the user's final image decisions.

Baseline artifacts: art/characters/<id>/reference/height_neutral_v01.png and fixed height_neutral.png. Measurement provenance: HEIGHT_STUDY_V01.md and public/art-review/cast-proportion-pilot/height_qa_v01.json. Approved gallery: public/art-review/cast-proportion-pilot/height_lineup_v01.png.

## Full-batch QA lessons (2026-10-11)

- Check the working idle against the approved neutral before using it to judge other strips. A stable head probe can still hide compressed torsos, shortened shins, or a wider build. Compare shoulder-to-hip length and hip-knee-ankle chains at the same anatomical scale; bent knees change occupied height, not bone lengths.
- Record the packer commit and input paths. The idle must be measured using its own palette; whole-atlas palette changes can otherwise move the apparent reference between runs.
- Inspect the pack report's selected source for every animation. Historical manually edited frame caches may supersede a new raw candidate; preserve the cache as evidence before intentionally importing the new strip.
- A head-probe verdict of unmeasured is not a pass. Rotated heads, blindfolds, overlap and white effect arcs require independent anatomical landmarks and visual comparison. Document uncertainty and never use exemptions for real drift.
- Check cell margins and the floor after anatomy calibration. A small measured position offset can fix pivot-related clipping without changing scale; a pose wider than the cell needs reposing, not a character-specific shrink.
- Percentage requests to the generator are approximate. Re-measure the result; head-only corrections can overshoot dramatically. The three-attempt limit applies across version numbers, including saved corrections. Exhausted failures stay on technical hold.
- Source completion, passing pack, visual QA, user approval, and integrated release are separate states. Report each honestly.

### Stitch reference and mask integrity

The Killua light1 correction demonstrated that a stale packed idle can corrupt stitching even when A/B source anatomy matches. The stitch refinement enlarged a trial above the cell, clipped the true head, and then measured a white shirt hem as hair. A numeric ratio from that mask is invalid. Before accepting an automatic stitch factor, verify the reference idle version/hash, every intermediate cell margin, and that the selected head ROI is actually the head. If the working full pack is blocked, the public atlas may still hold an older idle. Use independently measured source skull/torso/limb agreement for a documented stitch, then run the final candidate gate; do not waive that gate. Exact reproduction and masks are in Killua production/STITCH_TOOLING_HANDOFF.md and light1-v04-stitch-roi.png/JSON on its redraw branch. Claude owns the tooling correction.

Sasuke also required actual new-idle hair colors in its art declaration: a palette change caused the probe to select only part of the hair. A measured declaration update restored full A/B masks without a tool change or exemption. Inspect masks before deciding whether a failure is drawing drift.

The probe deliberately marks configured low-confidence animations `unmeasured` before comparing numeric thresholds. This is not necessarily a wrong head ROI. Do not create a blanket exemption just because the pose is rotated or tucked. Retain independent landmarks and per-frame contacts, and ask Claude to validate the explicit acceptance path (TOOL-ROTATED-ANATOMY); do not label these as strict numeric passes.
