# Son Goku: image prompts

Prompts follow `art/SPEC.md`, ADR 0007, ADR 0029 and the approved title-style production contract. Images remain versioned candidates and require user review. This batch creates only the title-style neutral/combat reference; no model sheet, expressions, idle or animation prompts are being run.

## Candidate inventory

| asset | candidate | generation attempts | selected attempt | status |
|---|---|---:|---:|---|
| title-style neutral + combat | `reference/title_style_draft_v01.png` | 2 | 2 | needs user review |

Attempt 1 was discarded; attempt 2 is the single saved candidate. `reference/title_style_lineup_v01.png` displays that candidate beside the exact four approved neutral cells at native 256px cell size. It is a review composition, not an additional generated candidate.

## Source and scale record

- Design provenance: Dragon Ball Z, Cell saga, adult Super Saiyan Goku in the orange gi worn against Cell.
- Stature provenance: secondary character-profile canon figure of approximately 175 cm, medium confidence, roughly ±2 cm. It is context only, not a scale formula.
- The approved title-style pilot gives a visual relationship, not certified pixels/cm. Goku is placed in the 6-cell lineup at common native cell density; neutral height was provisionally fitted to 204px body height (hair-inclusive content remains separate), with combat kept at the identical scale. Hair silhouette, boot sole and anatomical landmarks have not yet been independently measured; uncertainty is material and no numeric anatomy pass is claimed.
- Candidate palette and identity traits are documented in [CHARACTER.md](CHARACTER.md). Exact four comparison cells: `public/art-review/title-style-pilot/{naruto,sasuke,killua,gojo}-neutral_v01.png`.

## Candidate prompt used

```text
Create one polished pixel-art character reference candidate for a serious 2D anime fighting game. This is a single new fighter, Super Saiyan Goku from the Dragon Ball Z Cell saga, adult male. Show exactly TWO full-body views side by side, each on a perfectly flat solid magenta #FF00FF background, no labels: left a relaxed neutral standing pose facing right in 3/4 view; right a grounded combat guard facing right in 3/4 view, knees flexed and fists raised. Both poses must have the same anatomy, pixel density and height. Adult athletic proportions, not chibi: believable adult head, torso, arms and legs, strong but not bodybuilder shoulders. Golden upright spiky hair, teal-green eyes, orange sleeveless gi over dark navy-blue undershirt, blue waist sash, blue wristbands, dark blue martial arts boots. Crisp hard-edged pixel art, visible deliberate pixel clusters, clean dark outline, restrained cel shading, no anti-aliasing, no blur, no gradients, no dithering. No aura, glow, ki, projectile, shadow, text or symbols. Compose with generous separation between the two figures and ample blank magenta margin; complete figures fully visible. This is a review candidate, not a final approved asset.
```

## Later generation gates

Only after explicit approval of this title-style reference: create the model sheet, then expressions, then independently compare the first idle against both approved neutral and combat cells before any other animation. Each image has its own cumulative maximum of three attempts and candidate inventory. Attach only approved fixed-name references as specified by `art/PIPELINE.md`; never treat reference approval as approval of a later strip.

For future prompts, if the character/style name is refused, use this fallback description without names: “adult athletic martial artist with sharply spiked golden hair, teal-green eyes, orange sleeveless gi over a dark blue undershirt, blue sash, wristbands and boots.” Keep the requested original pose and the same title-style proportions.
