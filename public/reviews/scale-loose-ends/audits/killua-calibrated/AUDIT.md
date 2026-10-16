# Astra calibrated final-atlas audit - Killua, 2026-10-15

Auditor: GPT-6 Astra, medium. Input branch art/killua-loose-ends at 5bda5260. Inspected all seven final candidate cells, packed idle11 and approved neutral/combat cells at one pixel density. No generation, approval, calibration or atlas edit; unauthorized duplicate charge output remains excluded.

## Verdict

- **charge v14: PASS visual anatomy and ordered-loop screening.** Prior enlarged head is corrected; head/body proportions, shoulders, arms, knees and shoes remain coherent across all four frames. Numeric intrinsic +/-6% certification is unverified where the crouch hides/foreshortens joints. A broad/faint aura is not visible in final quantized cells, so aura retention remains **unverified** rather than passed.
- **down v08: PASS clipping/orientation and visual anatomy screening.** The prior gross oversizing and bilateral clipping are resolved. Both heads and every shoe now fit. F0 includes a bent raised knee, f1 extends the legs. Projected total extents 188/193px are compatible with the 186px upright neutral hair-inclusive extent once pose and footwear projection are considered; these extents are not an anatomy pass by themselves. Shoes in profile look longer than idle's oblique shoes; this remains projection-dependent, not a verified intrinsic enlargement or a numeric +/-6% pass.
- **ko v09 mirrored: PASS clipping/orientation and visual anatomy screening.** Complete head-left pose, no old right-edge head clipping, no 180-degree down-to-ko flip. The bent pose's 171px horizontal extent does not imply a shortened body. No visible gross overgrown torso/head remains.

**Grounding is a static visual screen, with runtime HOLD/unverified:** hands/shoes reach y240, but some lying head/back contours remain above that line by 2-13px. The approved contract explicitly allows oblique floor contours and assigns actual grounding/contact to Claude. These gaps are disclosed below; they are neither automatically a floating-pose failure nor proof of in-game grounding. No blanket numeric anatomy pass or user approval is granted.

## Measurement policy / reference comparison

Manual projected native-pixel intervals, not physical anthropometry: H hair-to-chin/analogous rotated axis, T neck-to-belt, UA/FA shoulder-elbow-wrist, UL/LL hip-knee-ankle, S heel-to-toe projection, W garment shoulder span. H endpoint uncertainty +/-2-3px; torso/limb endpoints +/-4-6px, segment uncertainty +/-6-8px; lying shoulder/hip and overlapping far limbs can exceed that. Shoes +/-3px. These are **pixel** uncertainties, not +/-6 percent. Hidden intrinsic anatomy and lying shoulder width are unmeasurable, never a numeric pass. Ranges include pose and landmark uncertainty.

Idle f0 H 36-42, T 35-45, UA 20-29, FA 18-27, UL 29-40, LL 29-39, S 20-29, W31-41px. Neutral is upright (torso roughly42-52px) and combat/idle crouched. Charge hair-to-chin is about40px (top126-127 to chin~166), matching idle visually despite its much lower crouch. Down torso ~43-49px and ko ~40-48px are consistent with the neutral's more extended trunk. Side-lying purple-shirt volume remains thicker in projection than the upright front view; shoulder width cannot be reliably recovered along that rotated silhouette. No child discount or lying-height target is used.

## Every-frame manual screening (native pixels)

| Frame | H | T | UA / FA | UL / LL | S / W | Observation |
|---|---|---|---|---|---|---|
| charge f0 | 37-43 | 22-32 | 17-27 / 14-24 | 18-30 / 16-27 | 18-26 / 30-40 | Hair y126 to chin~166; deep squat; shoulders and hands clear, far joints covered |
| charge f1 | 37-43 | 22-32 | 17-27 / 14-24 | 18-30 / 16-27 | 18-26 / 30-40 | Hair top127; tiny hand/torso motion, stable feet |
| charge f2 | 37-43 | 22-32 | 17-27 / 14-24 | 18-30 / 16-27 | 18-26 / 30-40 | Hair top127; stable build, crouched upper legs strongly projected |
| charge f3 | 37-43 | 22-32 | 17-27 / 14-24 | 18-30 / 16-27 | 18-26 / 30-40 | Hair top126; wrap returns without visible head or shoe pop |
| down f0 | 33-41 | 39-51 | 16-28 / 15-27 | 25-39 / 26-40 | 24-33 / unmeasurable | Rotated complete head; neck~(79,214) to belt~(123,218); upper knee raised |
| down f1 | 33-41 | 39-51 | 15-27 / 14-26 | 25-39 / 25-39 | 24-33 / unmeasurable | Neck~(70,220) to belt~(116,222); legs extend; hands overlap shoulder/forearm boundary |
| ko f0 | 32-40 | 36-50 | 15-28 / 14-27 | 23-38 / 23-37 | 22-31 / unmeasurable | Neck~(61,221) to belt~(103,217); folded legs; near hand supports head/torso area |

The complete final head/feet replace the old report's unmeasurable clipped head/feet. The old diagnostic torso lengths (~60-92px) do not apply to this calibrated atlas. No row certifies all hidden limbs within +/-6%.

## Exact clipping and floor-contour evidence

Alpha bounds are half-open [left,top,right,bottom]: down f0 [37,184,225,241], f1 [28,196,221,241], ko f0 [22,197,193,241]. All fully inside 256x256 cells; maximum opaque y is240. Charge bounds [84,126 or127,178,241]. Thus previous boundary clipping is resolved.

The following are exact lower opaque contour ranges over stated x columns, measured from final RGBA pixels, not inferred anatomical contact points. A column may include a hand beneath the head; labels describe approximate regions and do not isolate semantic parts.

| Frame / x columns | Bottom contour y | Gap from y240 |
|---|---|---|
| down f0 head/hand x45-70 | 232-240 | 0-8px |
| down f0 trunk/hip x110-135 | 231-234 | 6-9px |
| down f0 straight shoe x204-220 | 234-236 | 4-6px |
| down f1 head x35-55 | 235-237 | 3-5px |
| down f1 trunk/hip x104-125 | 235-236 | 4-5px |
| down f1 shoe x200-216 | 236-238 | 2-4px |
| ko f0 head x28-48 | 229-232 | 8-11px |
| ko f0 trunk/hip x86-104 | 227-236 | 4-13px |
| ko f0 shoe x165-185 | 231-240 | 0-9px |

These are curved/oblique resting poses, not side-on rulers. Final in-game floor/camera check remains Claude's responsibility; preserve the selected poses.

## Transitions / replay coverage

All charge adjacent pairs and f3-to-f0 inspected: subtle breathing/hand twitch at 50ms each, no obvious size pop; the loop is only200ms. Down f0-to-f1 lowers the raised knee and extends the body, with a small head shift; f1-to-f0 replay is an intentional impact reset for a nonlooping 80/420ms sequence. KO repeats one identical cell. Down-to-ko keeps head-left orientation but moves from extended rest to curled legs, shifts head roughly10-15px left and contracts horizontal extent by22px. This is a pose transition, not evidence of a global scale change. Actual state-switch visibility must be checked in game. Compared candidate frames and reference/idle crops in sequence; no timed game/browser playback was performed by this auditor. Parent review-page QA reports playback separately.

Final auto data: charge head1.002, individual1.006/.997/1.009/.995, feet1.065 (a color-area-derived linear ratio, not shoe length). Down head.796 aggregate, f0.575/f1 1.016; f0 hair probe incorrectly lands on the thigh region x130-152/y192-211, so it is not a head-size measurement. Down feet1.018. KO head.986/feet.995. Down/ko remain manual QA; the head-only numbers do not certify torso/limbs. No changed source is silently approved.

## Evidence

`pixel-evidence.json` stores exact alpha bounds, indices, timing and hashes. Native reference/strip images and exact cell crops come directly from the final public atlas; gridded enlarged images use nearest neighbor only. Historical loose-ends-astra evidence is retained and superseded for final-pixel findings.

## Input SHA256

- sheet.png: `aabe89b82fc8e1eb5886e233fb20b5c18ea9a9235d3686f52d659d3998d9ed25`
- anims.json: `9ed1703e018f22709dbf018afa8235aa35e27ca7c7b4e0da135d745163405696`
- neutral: `86278707ba8f0fcb78942cbcedb3341d8ad8f559e95f8cbf48273d0bbdca1855`
- combat: `d32d8f9f297efac7bcd8ba7e0dfd34c4d458ada1fc5e45a9c93801340f5a63d6`

## Parent preview-player verification

Root reports timed browser QA at390x844: all candidates loaded at256px native density with consistent CSS; Naruto attacks and down progressed to final/replay, airHeavyAlt replay progressed through active/recovery/end, charge autoplay/pause/next worked, KO ended as a one-shot. No console warnings/errors or page overflow. This is delegated preview-player evidence, not this auditor directly observing timed playback and not runtime gameplay/contact/floor validation.

## Remaining action boundary

No new redraw requirement is demonstrated by this audit. Hidden/foreshortened anatomy is ordinary measurement uncertainty, not proof of a defect and not a numeric pass. User design review remains independent. Claude should confirm actual game contact/grounding and, for Naruto airHeavyAlt f3, resolve whether the accepted24px test measures center-to-center or center-to-box and verify the borderline center with a reproducible hand landmark. Do not change art solely to make an uncertain landmark pass; no further image calls are authorized.
