# Sasuke title-style production QA — 2026-10-11

User-approved source: `reference/title_style_draft_v01.png`, plus the 256 px neutral and combat cells copied here from the title-style pilot. The neutral occupies 90×209 px, has a 197 px pre-fit body target, and soles at y240. The combat cell occupies 155×180 px. These values govern this batch; the old universal head-count prompt does not.

## Idle v07

- Git history contains idle v01–v06. The two v07 source parts are 4 poses each; `npm run stitch -- sasuke idle v07` measured B factor 1.0296, scaled A by 0.9713, and reported B/A 0.988 after stitching. No factor was chosen by eye.
- The 48-color packer selected `raw/idle_v07.png` at x0.337 and exited 0. `bodyHeight` is 180 for the crouched idle, to preserve the approved combat scale rather than enlarge the crouch to the 209 px neutral envelope.
- Actual packed idle frame 0 occupies x46..204, y64..240 = 159×177 px. The approved combat sample occupies x50..204, y61..240 = 155×180 px. Same floor and comparable occupied scale, head/torso/limb build, outfit, face and sheathed sword. [First frame](packed-idle-v07-f0.png) and [all eight frames](packed-idle-v07-loop.png) are extracted from `public/characters/sasuke/sheet.png`; the old `frames/idle/` cache is not the new candidate.
- Every frame was inspected at native size. Feet stay planted; the loop changes only subtly. v07 is a provisional continuity reference, not `idle_approved.png` and not user-approved.

## Guard v03 → v04

- v03 was rejected on technical QA: the second frame crouched about 20 packed pixels lower and compressed the torso and limbs. The first and second v03 frames are saved in [QA preview](packed-guard-v03-qa.png); the raw image is in `raw/_rejected/`.
- v04 corrects the pop. Both [packed QA frames](packed-guard-v04-qa.png) have hair top y61, upper head silhouette x100..142 and x101..142 at y50..94, planted feet y240, and close torso/leg shapes. Idle's corresponding upper head region is x95..134, hair top y64. The few-pixel contour differences are within the pilot's approximately ±3 packed-pixel crown uncertainty; there is no visible 38% head enlargement.
- The automatic guard probe reads 1.38× idle because the crossed navy forearms touch the dark hair mask. That is an invalid skull measurement. A v04-only exemption documents this demonstrated mask problem. It is a **manual anatomy acceptance, not a numeric scale pass**. With that exemption, `node tools/pack-sprites.mjs sasuke --quantize 48` exits 0 and selects guard v04. The older approved Sasuke strips still show scale mismatches against the new idle and are not represented as complete or strict-clean.

## Run v04 → v05

- v04 measured A/B factor 0.9901 but failed the new-strip gate: head pop (f1 1.29×, f7 0.88×) and flight frames 3/7 clipped 22/24 px at the right edge. [Native QA](packed-run-v04-qa.png) shows the defect; this version is a technical reject.
- v05 redrew both parts. Measured B factor 0.9959, final B/A 1.012. The packer's first import revealed the pose max height was about 438 source pixels; the measured idle-head source factor 0.3523 implied a 154 px run envelope. The gate at 154 px found hair ratio 1.06, just beyond tolerance. A 150 px envelope gives scale 0.342 and a numeric pass with no clipping. It was selected from those measurements and then checked visually, not chosen from the run's bounding box by eye.
- [All eight packed frames](packed-run-v05.png) were extracted from the actual written atlas. Frame bounds are 125–151 px wide and 142–150 px high; every frame stays inside x4..251 and y4..240. The same face, hair, torso, lean build, long legs, sheath and costume persist. The sequence has left/right contacts, passing strides and flight phases; f7 flows into f0. Current candidate is technically packable but still awaits the full-set visual review.

## Light1 v06

- Seven-frame left-lead jab, four poses in A and three in B. Stitch measured B factor 1.0362, scaled A 0.9651, and reported final B/A 1.036; no guessed size factor.
- `node tools/pack-sprites.mjs sasuke --quantize 48` selected `raw/light1_v06.png` at x0.355 and exited 0. [All seven actual packed cells](packed-light1-v06.png) were inspected. The active fist is the rightmost element at head level in f2/f3, with a small solid smear in f2; f4–f6 retract to the idle guard. Feet remain grounded and hair, torso and leg proportions read consistently.
- Visual defects: f1's punch is already near full extension, so the anticipation-to-impact distinction is modest; f6 has an open lead palm instead of returning to neutral closed-fist guard. Correct before final acceptance. User final batch review remains pending.

## Light2 v05 → v06

- v05 stitched with measured B factor 0.9856 but failed the new-strip gate. The dark right fist touching the face inflated f1's mask to 1.24× idle. Masking that frame exposed a 1.09× uniform head reading; actual packed upper hair width was 46–48 px versus 40 px in idle. [v05 QA cells](packed-light2-v05-qa.png) show the larger head. This is a technical reject, archived under `raw/_rejected/` with both parts preserved under `raw/_parts/_rejected/`.
- v06 redraw narrowed the head and separated the fist contour. The measured stitch scaled B by 0.9686, final B/A 0.975. The 48-color candidate gate exits 0 **without a scale exemption** at bodyHeight 180, preserving the same standing envelope as the approved combat pilot. [All seven cells](packed-light2-v06.png) were extracted from the actual public atlas and inspected: coiled startup, right near fist extending at head level in f2/f3, and retraction into closed-fist guard by f6. The source maintains the lean torso/long-leg build and common y240 soles. Independent [3× nearest-neighbor head crop](packed-light2-v06-heads.png) shows upper dark-hair width 38–39 px through f0–f4 versus 40 px in idle. The crown and face both shift down about 6 px during f4 recovery while the head width, torso, legs and y240 soles remain at the same anatomical scale. This is a posed head drop, not evidence of a shrunken head; visual anatomy passes with that documented pose change. User final review remains pending.

## Light1 v06 → v07

- v06 packed but failed visual pose QA: f1 was almost fully extended in startup and f6 ended with an open lead palm. It is now a technical reject under `raw/_rejected/`, with both parts preserved under `raw/_parts/_rejected/` and [old packed cells](packed-light1-v06.png) retained for comparison.
- v07 redrew both parts: f1 is a bent-arm halfway jab, f2/f3 are extended impact, f4 retracts, and f6 returns to two closed fists near the face. The stitch measured B factor 0.9697, final B/A 0.974. The 48-color new-strip gate exits 0 without exemption. [All seven actual atlas cells](packed-light1-v07.png) were inspected at native resolution; shared y240 soles and narrow head/lean anatomy persist. User final batch review remains pending.

## Remaining checks

The escalated local Vite adapter served port 5222. The in-app browser showed two Sasuke fighters at the same game depth with the new idle, matched apparent height and grounded feet. The console logged `[sprites] using custom sheet for sasuke (42 animations)` and no errors. The production build passed (80 modules) and the adapter's HTTP self-check returned four 200 responses. Full production, full-character strict scale, contact/hurtbox validation, user image approval, integration and deployment remain open.
