# Astra calibrated final-atlas audit - Naruto, 2026-10-15

Auditor: GPT-6 Astra, medium. Input branch art/naruto-alts-r2 at 802e673b. All 13 candidate cells inspected directly from the final 48-color public atlas, beside packed idle, base light2/airHeavy, and approved neutral/combat cells at one pixel density. No generation, approval, calibration or atlas edit.

## Verdict

- **light2Alt v05: PASS visual anatomy/contact screening; numeric full-anatomy +/-6% certification remains unverified.** The prior oversized-head finding is resolved. All seven figures retain coherent head, slim torso, trouser volume, limb articulation and shoes. Both active palms touch the base-box lower edge; palm-center offsets are approximately 20 and 19px from base-box centers, with +/-3px placement uncertainty, inside the 24px screening tolerance. This is not a centered strike.
- **airHeavyAlt v04: PASS visual anatomy screening; HOLD strict f3 center-to-center contact certification.** F2 center distance is about 12px. F3 center distance is about 23px with +/-3px uncertainty, straddling 24px; its fist center is only about 9px beyond the box edge. These two distances must not be conflated. No clear intrinsic anatomy enlargement is visible; small projected shoes belong to folded/oblique feet. Hidden joints prevent a full numeric +/-6% pass. This is the same double-fist technique as base airHeavy, a pose variant rather than a different technique.

These are technical screening findings, not user image approval. Existing technical uncertainty is retained; no new generation is requested. Claude must interpret borderline f3 contact in runtime or establish a precise accepted landmark/contact metric before calling it a strict contact pass.

## Measurement policy and reference comparison

H is hair-top to chin, not skull-under-hair height. T is projected neck-to-belt; UA/FA and UL/LL are best-visible shoulder-elbow-wrist and hip-knee-ankle chains; S is visible heel-to-toe projection; W is projected garment shoulder span. Table ranges are manual screening intervals on final pixels. Typical H endpoints +/-2-3px, limb/torso endpoints +/-4px, segment uncertainty about +/-6-8px, shoes +/-3px. This uncertainty is much greater than 6 percent for most segments. Far/covered limbs and intrinsic 3D length are **unmeasurable**, not silently passed. Similar ranges do not mean pixel-identical poses.

Packed idle f0 screening: H 36-42, T 38-48, UA 23-33, FA 20-30, UL 38-49, LL 31-43, S 25-33, W 34-45px. Approved combat resembles idle; neutral has straighter legs and longer projected torso (~47-57px). The final light2Alt head is ~36-40px, within the visual relationship; its stance is slightly narrower than idle and the torso remains slim. Air poses shorten projected chains through flexion/foreshortening, not by applying a standing-height target. No clear shoulder inflation or detached/cut limb is visible in the final cells. Hands, sleeve cuffs and distant legs partly occlude joints.

## Every-frame manual screening (native pixels)

| Frame | H | T | UA / FA | UL / LL | S / W | Observation |
|---|---|---|---|---|---|---|
| light2Alt f0 | 36-40 | 35-44 | 23-32 / 18-27 | 37-47 / 28-38 | 26-33 / 34-43 | Guard; hair y77 to chin about115; shoes and trouser volume coherent |
| f1 | 36-40 | 34-44 | 22-31 / 18-27 | 38-48 / 28-38 | 26-33 / 33-43 | Near hand rises; shoulder projection narrows, no build pop |
| f2 | 36-40 | 35-45 | 23-33 / 21-31 | 37-47 / 28-38 | 26-33 / 34-44 | Straight lead arm and open palm; far arm stays guarded |
| f3 | 36-40 | 35-45 | 23-33 / 21-31 | 37-47 / 28-38 | 26-33 / 34-44 | Active hold; no new limb fragment at source split |
| f4 | 36-41 | 35-45 | 22-31 / 18-27 | 38-48 / 28-38 | 26-33 / 33-43 | Hand retracts, torso stable |
| f5 | 36-40 | 35-45 | 23-32 / 18-27 | 38-48 / 28-38 | 26-33 / 34-43 | Guard recovery |
| f6 | 36-40 | 35-45 | 23-32 / 18-27 | 38-48 / 28-38 | 26-33 / 34-43 | Guard end; modest stance difference from idle, no head-size pop |
| airHeavyAlt f0 | 33-39 | 34-44 | 25-36 / 24-35 | 30-43 / 16-29 | 13-21 / 27-39 | Arms overhead; folded knees and oblique shoes |
| f1 | 33-39 | 33-44 | 25-36 / 24-35 | 30-43 / 16-29 | 13-21 / 27-39 | Prep shifts hands left; no size pop |
| f2 | 32-38 | 33-45 | 27-38 / 20-32 | 25-38 / 18-31 | 13-21 / 29-40 | Downward double fist; forearms overlap; torso inclines |
| f3 | 31-37 | 33-45 | 26-38 / 20-32 | 21-35 / 18-30 | 13-21 / 28-40 | Deep curl; foot and far leg partly covered; contact borderline |
| f4 | 33-39 | 36-46 | 21-31 / 17-27 | 26-39 / 20-32 | 13-22 / 29-40 | Returns to guard, curled rear foot |
| f5 | 33-39 | 36-46 | 20-31 / 17-27 | 28-40 / 23-35 | 13-22 / 30-41 | Air recovery; smaller projected shoes than standing idle remain pose-dependent |

## Contact against BASE boxes, not candidate override

Rectangles are [x,y,width,height] from the base animation's actual metadata. Manual hand centers have +/-3px uncertainty; rectangular hand envelopes are screening annotations, not automatic segmentation.

| Active frame | Base box | Approx drawn palm/fist center | Center-to-center | Center-to-box edge |
|---|---|---|---|---|
| light2Alt f2 | [189,84,34,26] | (196,114) | 19.7px | 4px below |
| light2Alt f3 | [190,86,24,21] | (196,114) | 18.5px | 7px below |
| airHeavyAlt f2 | [219,178,29,26] | (221.5,189.5) | 12.1px | 0px, inside |
| airHeavyAlt f3 | [224,187,27,26] | (230.5,221.5) | 22.6px | 8.5px below |

Light2Alt palm envelopes approximately x187-205/y105-123 touch the lower part of both base boxes. Air f2 fists approximately x213-230/y181-198 overlap. Air f3 fists approximately x218-243/y211-232 touch the lower edge (~2px vertical overlap); most of the drawn fists lie below it. The final metadata also duplicates these inherited base boxes for the alts, so an override does not prove centered contact. See the two `*-base-contact-grid.png` overlays.

## Transitions / replay coverage

Inspected all adjacent cells in order, final-to-first replay pairs, idle-to-light2Alt and recovery-to-idle, and base/alt corresponding phases. light2Alt f2-f3 is a near-hold; f3-f4 retracts cleanly; f6-f0 is coherent. No frame-cut fragments were found. Air f1-f2 swings overhead arms down, f2-f3 lowers the head/fists, f3-f4 unfolds to guard and f4-f5 rises. The large spatial head movement is also present in base airHeavy; it is pose/placement rather than visible head growth. Air f5-f0 is a deliberately abrupt one-shot replay reset, not a looping attack. Ordered crop inspection and metadata timing are covered here; this auditor did not perform timed game/browser playback. Parent review-page QA must report that separately.

Final auto head ratios: light2Alt 0.995 (frames .982/1.010/.995/.979/1.053/.978/1.014), feet .929. Air .990; individual hair probes .978/.970/1.074/1.105/1.011/1.002. Active f2/f3 are manually exempted for sleeve/hair segmentation contamination; their elevated probes are not anatomy measurements. No strict numeric whole-body conclusion follows from the aggregate gate.

## Evidence

`pixel-evidence.json` records exact alpha bounds, indices, timings and hashes. `references.png` and each `*-strip.png` retain one native density; grid images are nearest-neighbor inspection aids. Every candidate crop came directly from the final public atlas, not historical warning-mode output. The historical loose-ends-astra report is retained but does not describe these final pixels.

## Input SHA256

- sheet.png: `dfc90091a8a6a2ce772112ecbce99be1dfcffad210c38ab3a7a3ee01c644ea1c`
- anims.json: `9320cc5c3f397fb04f669b264074ffded3bed6f06c43e073a92a26fe83d2a10b`
- neutral: `acfd7240f9ee7fbe71c1b6c50ea8a269ceedeb05de44b929850ca8de06a0610f`
- combat: `cdc6ff9838bbae102301b738ef7596be3b2cc8ecb6f24c98d27c02a0bb479751`

## Parent preview-player verification

Root reports timed browser QA at390x844: all candidates loaded at256px native density with consistent CSS; Naruto attacks and down progressed to final/replay, airHeavyAlt replay progressed through active/recovery/end, charge autoplay/pause/next worked, KO ended as a one-shot. No console warnings/errors or page overflow. This is delegated preview-player evidence, not this auditor directly observing timed playback and not runtime gameplay/contact/floor validation.

## Remaining action boundary

No new redraw requirement is demonstrated by this audit. Hidden/foreshortened anatomy is ordinary measurement uncertainty, not proof of a defect and not a numeric pass. User design review remains independent. Claude should confirm actual game contact/grounding and, for Naruto airHeavyAlt f3, resolve whether the accepted24px test measures center-to-center or center-to-box and verify the borderline center with a reproducible hand landmark. Do not change art solely to make an uncertain landmark pass; no further image calls are authorized.
