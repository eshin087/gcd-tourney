# Son Goku: image prompts

Prompts follow `art/SPEC.md`, ADR 0007, ADR 0029 and the approved title-style production contract. Versioned source images remain preserved after approval. The user approved the title-style reference, model sheet, expressions, and idle v01 on 2026-10-14; approved fixed-name copies now exist for each reference asset.

## Candidate inventory

| asset | candidate | generation attempts | selected attempt | status |
|---|---|---:|---:|---|
| title-style neutral + combat | `reference/title_style_draft_v01.png` | 2 | 2 | approved 2026-10-14 |
| model sheet | `reference/model_sheet_v01.png` | 1 | 1 | approved 2026-10-14 |
| expressions | `reference/expressions_v01.png` | 1 | 1 | approved 2026-10-14 |
| idle | `raw/idle_v01.png` | 1 | 1 | approved 2026-10-14 |

Attempt 1 was discarded; attempt 2 is the single saved candidate. `reference/title_style_lineup_v01.png` displays that candidate beside the exact four approved neutral cells at native 256px cell size. The user approved both Goku reference poses on 2026-10-14; the lineup is not a separate generated candidate.

## Source and scale record

- Design provenance: Dragon Ball Z, Cell saga, adult Super Saiyan Goku in the orange gi worn against Cell.
- Stature provenance: the approved Goku KIT.md design brief says adult, about 175 cm; it includes no underlying canon citation or uncertainty interval. Treat exact stature as unverified context only, not a scale formula. The four approved fighters are visual comparisons, not Goku source references.
- The approved title-style pilot gives a visual relationship, not certified pixels/cm. Goku is placed in the 6-cell lineup at common native cell density; neutral height was provisionally fitted to 204px body height (hair-inclusive content remains separate), with combat kept at the identical scale. Hair silhouette, boot sole and anatomical landmarks have not yet been independently measured; uncertainty is material and no numeric anatomy pass is claimed.
- Candidate palette and identity traits are documented in [CHARACTER.md](CHARACTER.md). Exact four comparison cells: `public/art-review/title-style-pilot/{naruto,sasuke,killua,gojo}-neutral_v01.png`.

## Candidate prompt used

```text
Create one polished pixel-art character reference candidate for a serious 2D anime fighting game. This is a single new fighter, Super Saiyan Goku from the Dragon Ball Z Cell saga, adult male. Show exactly TWO full-body views side by side, each on a perfectly flat solid magenta #FF00FF background, no labels: left a relaxed neutral standing pose facing right in 3/4 view; right a grounded combat guard facing right in 3/4 view, knees flexed and fists raised. Both poses must have the same anatomy, pixel density and height. Adult athletic proportions, not chibi: believable adult head, torso, arms and legs, strong but not bodybuilder shoulders. Golden upright spiky hair, teal-green eyes, orange sleeveless gi over dark navy-blue undershirt, blue waist sash, blue wristbands, dark blue martial arts boots. Crisp hard-edged pixel art, visible deliberate pixel clusters, clean dark outline, restrained cel shading, no anti-aliasing, no blur, no gradients, no dithering. No aura, glow, ki, projectile, shadow, text or symbols. Compose with generous separation between the two figures and ample blank magenta margin; complete figures fully visible. This is a review candidate, not a final approved asset.
```

## Model sheet candidate: `reference/model_sheet_v01.png`

Attempts: 1 of max 3; saved attempt 1. Approved title-style reference and cast lineup were attached. The user approved v01 on 2026-10-14; fixed approved copy: `reference/model_sheet.png`.

```text
Create one hi-res pixel-art model sheet candidate for a serious anime fighting game, following the attached approved title-style neutral/combat reference and lineup strictly for Goku's face, anatomy, scale, style, hair, outfit and palette. Character: adult Son Goku as Super Saiyan during the Dragon Ball Z Cell saga, golden upward-spiked hair, teal-green eyes, orange sleeveless gi over a dark navy-blue undershirt, dark blue sash, blue wristbands, dark blue martial-arts boots. Wide landscape canvas, flat #FF00FF background. Top row: four complete full-body turnarounds of the SAME adult character, equal body anatomy and pixel density: front, 3/4 facing screen-right, true side profile facing screen-right with only one eye visible, back view. Bottom row: one full-body right-facing 3/4 fighting stance with knees flexed and fists raised, then a tidy row of flat square color swatches matching orange, blue, gold, skin, eye green and outline. Keep every figure fully inside the canvas with clear spacing, no overlaps. Neutral faces except the focused combat stance. Maintain the approved reference's adult head/body relationship and the approved visual scale; no chibi, no head enlargement, no shoulder inflation, no individual height cap. Draw as crisp hard pixel art with deliberate clusters, 3-5 tone cel shading, 1px-equivalent dark outline, upper-front-right light, no anti-aliasing, blur, gradients, or dithering. Use a restrained palette based on the attached reference. No labels, text, logos, shadows, aura, ki, weapons, or effects. Candidate only, not final approval.
```

## Expressions candidate: `reference/expressions_v01.png`

Attempts: 1 of max 3; saved attempt 1. `model_sheet_v01.png` was attached as an unapproved working continuity reference. The user approved v01 on 2026-10-14; fixed approved copy: `reference/expressions.png`.

```text
Create one hi-res pixel-art expression sheet for the same Goku shown in the attached model sheet candidate. Exactly seven head-and-shoulders portraits in one horizontal row, equal scale and spacing, all facing right in 3/4 view: (1) determined neutral, (2) angry focused, (3) shouting mouth open, (4) confident warm grin, (5) pain with eyes squeezed shut, (6) peaceful eyes closed, (7) intensely focused Super Saiyan expression with teal-green eyes, no eye transformation. Match the attached candidate's facial anatomy, golden sharply spiked hair, teal-green eyes, orange gi, dark blue undershirt and pixel density exactly. Serious adult anime proportions, not chibi; no enlarged head. Crisp hard pixel art, deliberate clusters, clear dark outline, restrained cel shading, no anti-aliasing, blur, gradients or dithering. Flat solid magenta #FF00FF background; no text, numbers, labels, symbols, aura, ki or effects. Ensure all seven heads and shoulders are fully inside the wide canvas, separated and uncropped. This is a review candidate, not an approved reference.
```

## Idle candidate: `raw/idle_v01.png`

Attempts: 1 of max 3; saved attempt 1. The approved title reference, model-sheet candidate and expression candidate were attached for visual continuity. The user approved v01 on 2026-10-14; fixed approved copy: `reference/idle_approved.png`.

```text
Create one animation strip candidate: exactly 8 consecutive frames of Goku's idle fighting stance, in a single horizontal row, left to right. Use the attached approved title-style reference for style, scale and anatomy; use the attached candidate model sheet and candidate expression sheet as working continuity references only (neither is approved yet). Character is adult Cell-saga Super Saiyan Goku: golden upward-spiked hair, teal-green eyes, orange sleeveless gi over deep blue undershirt, blue sash, blue wristbands and dark blue boots. Right-facing 3/4 stance, knees comfortably bent, fists held in a compact guard. Frames form a seamless, restrained breathing loop: 00 base stance, 01 chest and shoulders rise slightly, 02 settles, 03 small cloth/hair movement, 04 returns close to base, 05 subtle breathing variation, 06 settles, 07 nearly matches frame 00. Keep feet in the exact same place and every pose at exactly the same size, with the soles aligned to one common baseline. Preserve adult head, torso and limb proportions; no anatomy changes, no pose resizing. Eight complete full-body figures, evenly spaced with clear gaps, not touching or overlapping, all fully visible. Single horizontal strip only, no grid. Flat solid #FF00FF background, crisp hard-edged pixel art, deliberate clusters, cel shading, no antialiasing, blur, gradients, dithering, shadows, text, frame numbers, labels, aura, ki, or effects. Candidate only; not final approval.
```

Before producing other animations, the user must review this batch. Any image approved later is copied to its fixed name only after that explicit approval. Each image has its own cumulative maximum of three attempts and candidate inventory; a reference approval does not approve a later candidate.

For future prompts, if the character/style name is refused, use this fallback description without names: “adult athletic martial artist with sharply spiked golden hair, teal-green eyes, orange sleeveless gi over a dark blue undershirt, blue sash, wristbands and boots.” Keep the requested original pose and the same title-style proportions.
