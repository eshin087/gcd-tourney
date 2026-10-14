# Monkey D. Luffy: character brief

| field | value |
|---|---|
| id (folder, engine) | `luffy` |
| display name (HUD) | `LUFFY` |
| full name | Monkey D. Luffy |
| source | One Piece, Enies Lobby arc (Gear Second/Gear Third era) |
| archetype | Lean rubber-bodied rushdown brawler |
| engine file | `src/characters/luffy.js` (Claude) |
| status | See [TRACKER.md](../../TRACKER.md) |

## One-paragraph look

A lean, wiry young man with messy short black hair, large dark eyes and a small scar under the left eye. In the Enies Lobby era he wears an open red sleeveless vest over his bare torso, blue knee-length shorts with thick white cuffs, a yellow sash, brown straw sandals and his familiar straw hat with a red band. His anatomy follows the approved title-style neutral and combat reference after user approval; no numeric head ratio or pixel-per-centimeter scale is asserted before landmark review. The straw hat and hair are separate from skull and body measurements.

## Identity checklist

- [ ] Hair: messy short black hair, uneven fringe
- [ ] Eyes: large dark eyes
- [ ] Face marks: small scar under left eye
- [ ] Headwear: round straw hat, red band; keep on in ordinary poses
- [ ] Top: open red sleeveless vest, bare chest
- [ ] Bottom: blue shorts ending at the knee, white rolled cuffs
- [ ] Hands/arms: bare; rubber extension is part of the body when a move calls for it
- [ ] Feet: brown straw sandals, toes visible
- [ ] Accessories: yellow sash; straw hat cord may secure hat on back in launched/spin/KO poses
- [ ] Silhouette key: straw hat brim and open vest over lean torso

## Palette

Candidate palette guidance; exact colors should be sampled/refined against the user's selected reference and kept within 48 colors.

| material | deep shadow | shadow | base | light | highlight | used on |
|---|---|---|---|---|---|---|
| skin | `#9b5b43` | `#c77b58` | `#e6a27a` | `#f3c29a` | - | face, torso, arms, legs, toes |
| hair | `#17151b` | `#29252b` | `#40363a` | `#62504a` | - | hair |
| vest | `#762b25` | `#b83c32` | `#e34c3d` | `#f4775c` | - | vest |
| shorts | `#183b68` | `#285a91` | `#3979b8` | `#68a2d3` | - | shorts |
| sash | `#a96c16` | `#d99b25` | `#f0bd43` | `#ffdc70` | - | sash |
| straw / sandals | `#6e4325` | `#a86a32` | `#d39a50` | `#f0c978` | - | hat, sandals |
| white cloth | - | `#a8a8a6` | `#e1ded4` | `#fff5df` | - | shorts cuffs |
| outline | `#211a20` | | | | | selective outline |

## Proportions and silhouette

- Era and stature: Enies Lobby / age 17; published character profile commonly gives 172 cm. Provenance: One Piece character profile; stature is canon reference, not a pixel conversion.
- Shared scale: compare the neutral and combat cells beside the exact approved title-style cells (ADR 0029). The title-style pilot establishes visual relationships, not pixels/cm. No approved Luffy stature measurement exists yet.
- Anatomy: candidate landmarks are provisional; hat/hair crown, skull, shoulders, waistband, knees, ankles and sandal soles must be measured on the final selected neutral. Candidate raster is 2172×724; two poses occupy roughly 724×724 source regions, but generated shading and pose perspective make precise landmark readings uncertain.
- Build: lean, wiry, defined torso; retain long limbs without exaggerating shoulder width. Vest, sash, hat and pose bounds are separate from body anatomy.
- Cell fit: native review cells are 256×256 with equal displayed density to the four approved neutral cells. Do not derive numeric body height from visual-fit scaling alone.
- Fighting stance: low, wide, playful but focused; knees bent, hands high, forward side presented toward screen-right.
- Run style: energetic forward lean, ordinary run rather than ninja run.
- Mirroring notes: scar is below the left eye; hat band remains red; sash knot and tail should stay consistent.

## Expressions

| expression | how it looks on this character |
|---|---|
| neutral / determined | relaxed mouth, attentive dark eyes |
| angry / focused | lowered brows, tightened jaw |
| shout | open mouth, brows drawn |
| grin / smirk | broad uncomplicated grin |
| pain | squeezed eyes, teeth clenched |
| eyes closed | laughing or exertion |
| special state | Gear Second pink flush; engine draws steam |

## Reference images

| file | content | candidates | from |
|---|---|---|---|
| `reference/title_style_draft.png` | user-approved title-style neutral + combat reference | `reference/title_style_draft_vNN.png` | candidate v01; approval pending |
| `reference/model_sheet.png` | approved turnaround and palette | `reference/model_sheet_vNN.png` | future step |
| `reference/expressions.png` | approved expressions | `reference/expressions_vNN.png` | future step |
| `reference/idle_approved.png` | approved idle strip | `raw/idle_vNN.png` | future step |
| `reference/title_style_lineup_v01.svg` | four approved neutral cells plus Luffy candidate at equal 256px display size | - | ADR 0029 review |
| `reference/notes.md` | provenance, candidate inventory and uncertainty | - | Codex |

## Don'ts for this character

- Never chibi or super-deformed; preserve the approved title-style anatomy once selected.
- Do not omit the small left-eye scar, straw hat, open red vest, white shorts cuffs or yellow sash.
- Do not draw generated steam, aura, speed lines or contact effects into character sprites.
- Do not stretch anatomy outside moves that explicitly use rubber extension in KIT.md.
