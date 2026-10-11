> New characters must follow [approved cast baseline](../../scale/APPROVED_CAST_BASELINE.md): era/source, neutral stature, measured head/build, cast lineup approval, then animation gate. Do not apply an extra child discount or individual tall cap.

# {{NAME}}: character brief

> TEMPLATE. Copy `art/characters/_template/` to `art/characters/<id>/` and replace every
> `{{...}}`. Keep the section headings: Codex and the prompts rely on them. Describe what the
> character **looks like**; prompts must work without the character's name.

| field | value |
|---|---|
| id (folder, engine) | `{{id}}` (lowercase ascii) |
| display name (HUD) | `{{DISPLAY NAME}}` |
| full name | {{Full Name}} |
| source | {{series}}, {{which version / arc / outfit: e.g. "Shippuden outfit, about 16"}} |
| archetype | {{one line: e.g. "loud orange fox-ninja rushdown"}} |
| engine file | `src/characters/{{id}}.js` (Claude/Codex) |
| status | see [TRACKER.md](../../TRACKER.md) |

## One-paragraph look

{{3-5 sentences a stranger could draw from: age/build (state the ~6.5-head athletic build), hair, face,
outfit top to bottom, signature accessory or weapon, overall color impression. This paragraph is
pasted into every prompt as TRAITS.}}

## Identity checklist

Every frame must show all of these (QA checks them one by one):

- [ ] Hair: {{color, shape, spike count/layout, bangs}}
- [ ] Eyes: {{color, shape, special states}}
- [ ] Face marks: {{whiskers / scars / none}}
- [ ] Headwear: {{forehead protector, band color, plate, tails}}
- [ ] Top: {{garment, colors, collar, zip, sleeves}}
- [ ] Bottom: {{pants/shorts, color, wraps}}
- [ ] Hands/arms: {{warmers, gloves, bandages}}
- [ ] Feet: {{sandals color, toes visible}}
- [ ] Accessories: {{pouches, holster, rope belt, weapon}}
- [ ] Silhouette key: {{the 1-2 shapes that make this character recognizable in pure black}}

## Palette

Up to 48 colors in total (the packer warns above 64). 3-5 tones per material (deep shadow / shadow /
base / light / highlight); spend the extra tones on skin, hair and the main cloth for realistic form
shading (budget table in [STYLE_GUIDE.md](../../STYLE_GUIDE.md#shading-light-outline)). These hexes
are restated in every prompt (`PALETTE` block in `PROMPTS.md`).

| material | deep shadow | shadow | base | light | highlight | used on |
|---|---|---|---|---|---|---|
| skin | `#{{......}}` | `#{{......}}` | `#{{......}}` | `#{{......}}` | - | face, neck, hands, toes |
| hair | `#{{......}}` | `#{{......}}` | `#{{......}}` | `#{{......}}` | `#{{......}}` | hair |
| {{main cloth}} | `#{{......}}` | `#{{......}}` | `#{{......}}` | `#{{......}}` | - | {{where}} |
| {{second cloth}} | - | `#{{......}}` | `#{{......}}` | `#{{......}}` | - | {{where}} |
| {{metal}} | - | `#{{......}}` | `#{{......}}` | `#{{......}}` | - | {{forehead plate, zipper, sword guard}} |
| eyes | - | `#{{......}}` | `#{{......}}` | - | `#ffffff` | iris, catchlight |
| outline | `#{{......}}` (darkest) | | | | | 1 px outline (selective outline uses the material's shadow) |

Tip: start from the placeholder palette in `src/characters/{{id}}.js` (`model.palette`) if one
exists, then correct it against the anime colors.

## Proportions and silhouette

- Height: about 6.5 heads (serious Shippuden-era proportions, not chibi); standing upright about
  200 px to the top of the skull, head about 31 px (+ up to 20 px hair). Idle landmarks in
  [SPEC.md](../../SPEC.md#proportions-and-landmarks).
- {{Build: slim / athletic / broad, within the shared body scale}} {{if the character is notably
  taller/shorter than the cast, say by how much; Claude adjusts bodyHeight values in manifest.json via
  an ADR. If only the hair adds more or less height than ~16-20 px, note it: the bodyHeight overrides
  may need a tweak after the first idle is packed}}
- Fighting stance: {{orthodox lead-left, guard height, attitude: e.g. "fists up, forward lean,
  cocky"}}
- Run style: {{ninja run (arms straight back) / normal / floating}}
- Mirroring notes: {{asymmetric details that will swap sides when mirrored, e.g. "holster on the
  right thigh"}}

## Expressions

| expression | how it looks on this character |
|---|---|
| neutral / determined | {{...}} |
| angry / focused | {{...}} |
| shout | {{...}} |
| grin / smirk | {{...}} |
| pain | {{...}} |
| eyes closed | {{...}} |
| special state | {{e.g. red eyes with tomoe during the signature move / none}} |

## Reference images

Approved images that every later prompt attaches. Every generated candidate is saved with a version
(`_vNN`) and queued in [REVIEW.md](../../REVIEW.md); when the user approves one, Codex **copies** it
to the fixed name below (the fixed names are what prompts attach):

| file | content | candidates | from |
|---|---|---|---|
| `reference/model_sheet.png` | approved model sheet: turnaround (front, 3/4 right, side, back), the fighting stance facing right, palette swatches | `reference/model_sheet_vNN.png` | PROMPTS.md step 1 |
| `reference/expressions.png` | approved expression sheet (the table above, head shots) | `reference/expressions_vNN.png` | PROMPTS.md step 2 |
| `reference/idle_approved.png` | copy of the approved `idle` strip (pose and proportion anchor) | `raw/idle_vNN.png` | PROMPTS.md step 3 |
| `reference/notes.md` (optional) | what was fixed between attempts, which thread produced the keeper | - | Codex |
| `reference/_rejected/` | rejected reference candidates (names kept) | - | Codex |
| `reference/source/` (optional, local only) | official pictures the user collects for their own comparison | - | user |

Official screenshots are copyrighted: keep them local for comparison only, don't upload them to an
image generator as style sources (attach our own approved model sheet instead), and don't commit them
to a public repository.

## Don'ts for this character

- Never chibi or super-deformed: no big head, no short legs, no oversized hands or feet.
- {{e.g. "no Part 1 outfit pieces", "hair is never fully spiked up", "never draw the
  forehead-protector plate without the leaf mark", ...}}
