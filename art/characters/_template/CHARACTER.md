# {{NAME}}: character brief

> TEMPLATE. Copy `art/characters/_template/` to `art/characters/<id>/` and replace every
> `{{...}}`. Keep the section headings: Codex and the prompts rely on them. Describe what the
> character **looks like**; prompts must work without the character's name.

| field | value |
|---|---|
| id (folder, engine) | `{{id}}` (lowercase ascii) |
| display name (HUD) | `{{DISPLAY NAME}}` |
| full name | {{Full Name}} |
| source | {{series}}, {{which version / arc / outfit: e.g. "Part 1 outfit"}} |
| archetype | {{one line: e.g. "loud orange fox-ninja rushdown"}} |
| engine file | `src/characters/{{id}}.js` (Claude/Codex) |
| status | see [TRACKER.md](../../TRACKER.md) |

## One-paragraph look

{{3-5 sentences a stranger could draw from: age/build, hair, face, outfit top to bottom, signature
accessory, overall color impression. This paragraph is pasted into every prompt as TRAITS.}}

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

Up to 32 colors in total. 3-4 tones per material (shadow / base / light / highlight). These hexes
are restated in every prompt (`PALETTE` block in `PROMPTS.md`).

| material | shadow | base | light | highlight | used on |
|---|---|---|---|---|---|
| skin | `#{{......}}` | `#{{......}}` | `#{{......}}` | - | face, hands, toes |
| hair | `#{{......}}` | `#{{......}}` | `#{{......}}` | `#{{......}}` | hair |
| {{material}} | `#{{......}}` | `#{{......}}` | `#{{......}}` | - | {{where}} |
| {{material}} | `#{{......}}` | `#{{......}}` | `#{{......}}` | - | {{where}} |
| eyes | `#{{......}}` | `#{{......}}` | - | `#ffffff` | iris, catchlight |
| outline | `#{{......}}` (darkest) | | | | 1 px outline (selective outline uses the material's shadow) |

Tip: start from the placeholder palette in `src/characters/{{id}}.js` (`model.palette`) if one
exists, then correct it against the anime colors.

## Proportions and silhouette

- Height: about 4-4.5 heads; standing about 136 px to the top of the skull (+ up to 16 px hair).
- {{Build: slim / stocky / tall for the cast}} {{if the character is notably taller/shorter than
  the cast, say by how much; Claude adjusts bodyHeight values in manifest.json via an ADR}}
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

Approved images that every later prompt attaches. Codex files them in `reference/`:

| file | content | from |
|---|---|---|
| `reference/model_sheet.png` | approved model sheet: turnaround (front, 3/4 right, side, back), the fighting stance facing right, palette swatches | PROMPTS.md step 1 |
| `reference/expressions.png` | approved expression sheet (the table above, head shots) | PROMPTS.md step 2 |
| `reference/idle_approved.png` | copy of the approved `idle` strip (pose and proportion anchor) | PROMPTS.md step 3 |
| `reference/notes.md` (optional) | what was fixed between attempts, which chat produced the keeper | Codex |
| `reference/source/` (optional, local only) | official pictures the user collects for their own comparison | user |

Official screenshots are copyrighted: keep them local for comparison only, don't upload them to
ChatGPT as style sources (attach our own approved model sheet instead), and don't commit them to a
public repository.

## Don'ts for this character

- {{e.g. "no Shippuden outfit pieces", "hair is never fully spiked up", "never draw the
  forehead-protector plate without the leaf mark", ...}}
