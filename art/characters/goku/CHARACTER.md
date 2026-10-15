# Son Goku: character brief

| field | value |
|---|---|
| id (folder, engine) | `goku` |
| display name (HUD) | `GOKU` |
| full name | Son Goku |
| source | Dragon Ball Z, Cell saga Super Saiyan (adult; orange gi worn against Cell) |
| archetype | athletic martial artist, calm confidence and explosive power |
| engine file | `src/characters/goku.js` (Claude) |
| status | see [TRACKER.md](../../TRACKER.md) |

## One-paragraph look

Adult, lean and powerfully athletic, with golden Super Saiyan hair in distinct upward spikes, teal-green eyes and a focused, open expression. He wears a vivid orange sleeveless gi over a deep blue short-sleeved undershirt, a dark blue sash, blue wristbands and blue martial-arts boots. The silhouette is defined by the tall fan of golden hair, compact tied waist and wide, grounded fighting stance. This reference is for the Cell saga; keep his adult anatomy and clothing volume consistent with the approved title-style cast lineup, not chibi.

## Identity checklist

- [ ] Hair: bright golden yellow, sharply separated upright spikes, no black hair
- [ ] Eyes: teal-green, determined
- [ ] Face marks: none
- [ ] Headwear: none
- [ ] Top: orange sleeveless gi over dark blue undershirt
- [ ] Bottom: loose orange gi trousers
- [ ] Hands/arms: blue wristbands, no gloves
- [ ] Feet: dark blue martial-arts boots
- [ ] Accessories: dark blue waist sash, no weapons
- [ ] Silhouette key: tall golden spike fan and orange gi with blue waist sash

## Palette

| material | deep shadow | shadow | base | light | highlight | used on |
|---|---|---|---|---|---|---|
| skin | `#8E4B35` | `#C87550` | `#E9A477` | `#F6C39A` | - | face, neck, hands |
| hair | `#B76516` | `#E99A20` | `#FFD23F` | `#FFE66A` | `#FFF2B0` | hair |
| gi orange | `#A83E1D` | `#D95A24` | `#F1842E` | `#FFA34A` | - | gi |
| blue cloth | `#14263F` | `#203D67` | `#315C91` | `#4C7DB0` | - | undershirt, sash, wristbands, boots |
| eyes | - | `#1B615C` | `#33A99A` | - | `#FFFFFF` | iris |
| outline | `#211A24` | | | | | outline |

## Proportions and silhouette

- Era and stature: Cell saga Super Saiyan adult. KIT.md records about 175 cm but no canon citation or uncertainty interval; treat exact stature as unverified context, not a scale input. User withdrew title-style v01 approval because hair-inclusive silhouette concealed a body about 20px shorter than Naruto; v02 is a corrected scale candidate, not approved.
- Shared scale: the four approved title-style cells are visual comparisons, not calibrated pixels/cm. In title_style_lineup_v02.png, neutral body height is 207±4px from estimated skull crown (hair excluded) to boot sole; full silhouette is 234px including hair. This lies above Naruto 195±3px and Sasuke 197±3px and below Gojo 222±3px. Goku skull-crown estimate is ±10 source px (~±3px after fit); sole is ±1px. Hair-inclusive and body-only bounds are separately labeled. This is a candidate measurement, not an anatomy certification.
- Anatomy: record skull, chin, shoulder, hip, knee and ankle landmarks from the proposed neutral after generation; no numeric pass before direct measurement. Hair mass is separate from skull size.
- Build: adult athletic build with defined shoulders, compact waist and muscular limbs; preserve torso and limb lengths independently of clothing width.
- Cell fit: use the common cast lineup density. No individual height cap or shoulder inflation.
- Fighting stance: forward-facing 3/4, fists raised, knees flexed, balanced and composed.
- Run style: grounded martial-arts sprint, arms pumping.
- Mirroring notes: no intentional asymmetrical outfit details.

## Expressions

| expression | how it looks on this character |
|---|---|
| neutral / determined | calm focus, direct teal-green eyes |
| angry / focused | brows lowered, jaw set |
| shout | mouth open, eyebrows tense |
| grin / smirk | warm confident smile |
| pain | eyes squeezed shut, teeth clenched |
| eyes closed | relaxed, peaceful face |
| special state | Super Saiyan appearance remains golden-haired; no eye transformation |

## Reference images

| file | content | candidates | from |
|---|---|---|---|
| reference/title_style_draft.png | unversioned fixed copy removed after v01 approval withdrawal; v02 neutral/combat candidate pending review | reference/title_style_draft_vNN.png; reference/title_style_lineup_v02.png | ADR 0029 lineup |
| reference/model_sheet.png | preserved fixed copy, inactive/held because v01 derives from withdrawn title-style v01 | reference/model_sheet_vNN.png | held, do not use |
| reference/expressions.png | preserved fixed copy, inactive/held because v01 derives from withdrawn title-style v01 | reference/expressions_vNN.png | held, do not use |
| reference/idle_approved.png | historical user-approved idle v01; not an active scale/identity anchor pending corrected title reference and independent revalidation | raw/idle_vNN.png | PROMPTS.md |

## Don'ts for this character

- Never chibi, super-deformed or child-proportioned; do not exaggerate head, hands, feet or shoulders.
- No base-form black hair, halo, power effects, aura, ki blasts, text, or background gradients in the reference candidate.
- No blue gi, undershirt-free torso, gloves, or weapons.
