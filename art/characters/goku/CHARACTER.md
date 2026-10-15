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

- Era and stature: Cell saga Super Saiyan adult. The approved Goku KIT.md design brief records about 175 cm; it supplies no underlying canon citation or uncertainty interval. Treat era/adult status as the approved design direction and exact stature as unverified context, not a scale input.
- Shared scale: compare native 256px neutral and combat cells against the four approved title-style cells. The pilot is a visual relationship, not a formally calibrated pixels/cm scale. Hair crown, boot sole, and pose landmarks are uncertain until measured from the candidate; do not infer body height from hair-inclusive bounds.
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
| `reference/title_style_draft.png` | approved title-style neutral and combat reference beside approved cast (user approved v01 2026-10-14) | `reference/title_style_draft_vNN.png` | ADR 0029 lineup |
| `reference/model_sheet.png` | approved turnaround and stance (v01 approved 2026-10-14) | `reference/model_sheet_vNN.png` | PROMPTS.md; approved from v01 |
| `reference/expressions.png` | approved expression sheet (v01 approved 2026-10-14) | `reference/expressions_vNN.png` | PROMPTS.md; approved from v01 |
| `reference/idle_approved.png` | approved idle (v01 approved 2026-10-14) | `raw/idle_vNN.png` | PROMPTS.md; approved copy from v01 |

## Don'ts for this character

- Never chibi, super-deformed or child-proportioned; do not exaggerate head, hands, feet or shoulders.
- No base-form black hair, halo, power effects, aura, ki blasts, text, or background gradients in the reference candidate.
- No blue gi, undershirt-free torso, gloves, or weapons.
