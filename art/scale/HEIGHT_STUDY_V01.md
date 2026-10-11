> APPROVED: user approved this lineup and all four neutral sources on2026-10-11. Historical generation/measurement notes follow. Full-frame redraw now authorized; use APPROVED_CAST_BASELINE.md.

# Neutral height calibration v01 — approved 2026-10-11

User authorized the recommended neutral comparison on 2026-10-11. Four separate built-in imagegen edits, one attempt each, preserve the recent design direction while replacing combat crouches with upright standing poses. Each source has its own height_neutral_v01_prompt.md. These are new reference candidates; matching existing combat anatomy is not established.

## Common scale

Use 200/166 pixels per centimetre, without the existing child discount, teen rounding or tall-character cap. Review-only proposal; no production spec, atlas, physics or approval changes.

| Character | Profile height input | Target soles-to-inferred-skull px | Ratio to Naruto |
|---|---:|---:|---:|
| Naruto, Shippuden | 166 cm | 200.00 | 1.0000 |
| Sasuke, Shippuden | 168 cm | 202.41 | 1.0120 |
| Killua | 158 cm | 190.36 | 0.9518 |
| Gojo, adult | over 190 cm; use 190 provisionally | 228.92 | 1.1446 |

Profile sources checked in the preceding review: [Naruto/Sasuke databook translation](https://mangahelpers.com/t/njt/releases/12100), [Killua profile citing guidebook](https://hunterxhunter.fandom.com/wiki/Killua_Zoldyck), [Gojo profile reporting](https://www.oricon-group.com/news/2821/). These are secondary/transcribed sources, not independently inspected original printed databooks. There is no canonical shared crossover universe scale; one centimetre is treated consistently across series. Gojo's exact height is not established.

Skull crown estimates under hair: source y153 Naruto, y165 Sasuke, y176 Killua, y108 Gojo, each +/-10 source pixels (about +/-2 packed pixels). Shoe-sole baseline is used consistently; this is not precise barefoot anthropometry. The PNG contains no guides; the gallery overlays the estimated skull lines optionally.

## QA

Run: node art/scale/pack-height-study.mjs. It uses unmodified packer helpers, one isotropic factor per source, and writes only public/art-review/. All four review images: 48 colours each, no clipping or margin failures. Occupied height including hair: Naruto210, Sasuke213, Killua207, Gojo242. Naruto/Sasuke lean teen designs retained; Killua youthful face/build retained; Gojo lean adult uniform retained. Straight upright poses eliminate most combat posture ambiguity; far/near footwear perspective and hidden crowns retain uncertainty.

Raw generated sources have illustrative antialiasing/high colour counts. Quantization is a review treatment, not proof of production pixel compliance. Static reference sheets do not run the animation scale gate; no exemption or passed strip gate is claimed. Old four-pose sources and outputs are unchanged, available in round-v04.html for context, and are not calibrated by this standing study.

Recommend reviewing the height relationship here before transferring it to combat samples and full strips. The new references do not replace approved fixed-name model sheets. Claude must resolve the production cell cap with a common cast scale or suitable renderer/cell solution after user approval.

Same worktree: .worktrees/art-cast-proportion-pilot. Same PR59; unmerged. Claude alone integrates and deploys production.
