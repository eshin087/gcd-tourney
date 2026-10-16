# Luffy: image prompts

The user approved title-style v01, model-sheet v01, expressions v01 and idle v01. Fixed approved references are in `reference/`; see `art/TRACKER.md` for the current production and technical status. Candidate inventory and source provenance are in `reference/notes.md`.

## Title-style neutral + combat reference

Save as `reference/title_style_draft_vNN.png`. Attach no copyrighted source images. After generation, place neutral and combat cells beside the exact four approved neutral cells in `public/art-review/title-style-pilot/` at equal displayed density; review the resulting lineup before model sheet or idle work.

```text
Create a serious anime fan-art sprite reference for a young, lean, wiry male pirate from the Enies Lobby era. He has messy short black hair, dark eyes, a small scar under his left eye, an open red sleeveless vest, blue knee-length shorts with white rolled cuffs, a yellow sash, brown straw sandals, and a straw hat with a red band. Keep the hat on his head in both poses.

Show exactly two full-body poses of the same character, each in a separate 256×256 cell at common pixel density. Left: relaxed but alert neutral stand. Right: compact combat stance, knees bent, hands raised, cocky focused face. Both face screen-right in 3/4 view. Preserve identical head, torso, limb lengths and wiry build between poses. Keep hair and hat mass separate from skull and body measurements. Use the approved title-style anime anatomy and visual finish as seen in the attached approved cells; do not imitate their characters or costumes.

Native cell is 256×256, pivot [128,240], grounded soles near y=240. Cell geometry is a production constraint, not a numeric body-height target. The candidate must be measured against the four exact approved cells at equal pixel density; the pilot does not establish pixels/cm. Do not apply old 200 px, 31 px head, 6.5-head ratio, historical pixels/cm or any added child discount.

Hard-edged high-detail pixel art, selective dark outline, discrete cel-shading bands, no antialiasing, blur, gradients, dithering or semitransparent edges. Restrained palette: skin #9b5b43/#c77b58/#e6a27a/#f3c29a; hair #17151b/#29252b/#40363a/#62504a; vest #762b25/#b83c32/#e34c3d/#f4775c; shorts #183b68/#285a91/#3979b8/#68a2d3; sash #a96c16/#d99b25/#f0bd43; straw #6e4325/#a86a32/#d39a50/#f0c978; white cuffs #a8a8a6/#e1ded4/#fff5df; outline #211a20. Flat #FF00FF background. No text, aura, steam, motion lines, ground shadow or additional figures.
```

## Step 1: model sheet v01

One candidate generated after title-style draft v01 approval. Preserve the exact identity and proportions from `reference/title_style_draft_v01.png`; turnaround, fighting stance and palette swatches should occupy one image. Candidate `reference/model_sheet_v01.png` was approved by the user as v01; the fixed copy is `reference/model_sheet.png`.

## Step 2: expressions v01

Eight portraits: neutral, determined, angry/focused, shout, grin, pain, eyes-closed laughter and Gear Second flush. Candidate continuity inputs were the approved title-style reference and model-sheet v01, per the user's explicit batch instruction. The generated `reference/expressions_v01.png` was approved by the user; its fixed copy is `reference/expressions.png`.

## Step 3: idle v01

## Super banner and ultimate splash prompts (Round 2b)

These four UI images are unapproved candidates. This generation used the approved fixed `reference/title_style_draft.png` for Luffy identity and compared cutout face/anatomy with the approved title-style pilot cells. The approved model sheet, expressions and idle were not attached as inputs. See `art/characters/SUPER_ART_BRIEF.md` for the crop contract. No eye-strip prompt section existed in this file, so this section follows the existing idle prompt.

### SUPER: Jet Gatling (Gear Second)

`raw/ui_super_bg_v01.png` — 1536×1024 background only: Enies Lobby stone courthouse plaza, billowing steam and sharp solid-pixel fist afterimages hammering toward screen-right. Essential plaza and barrage sit in the middle 4:1 crop band (raw y=320..704); continue only architecture/sky/paving outside. No character/text/logo/border/UI; crisp pixel clusters, no antialiasing, blur, gradients, painterly texture or dithering; up to 48 colors.

`raw/ui_super_fg_v01.png` — 1024×1024 chest-up Gear Second Luffy facing/looking screen-right, straw hat with red band, short messy black hair, visible small scar under his LEFT eye, large dark but non-chibi eyes, open red sleeveless vest, lean wiry build. Flushed pink-red skin, fierce grin, one fist cocked back, distinct white hard-edged steam curls. Solid #FF00FF only, no shadow/text/logos/other figures; match approved title-style face, crisp pixel clusters and hard cel shading, no blur/antialiasing/gradients; at most 48 colors.

### ULTIMATE: Gigant Pistol (Gear Third)

`raw/ui_ult_bg_v01.png` — 1536×1024 background only: Enies Lobby courthouse tower, sea and dramatic sunset; an enormous inflated fist silhouette smashes down toward screen-right with cracked stone and debris. Keep tower and fist inside central 1152px for phone 4:3, also legible in 16:9 center crop. Fist is a disembodied move silhouette, no character or arm/person. No text/logo/border; crisp pixel clusters, hard cel shading, no blur, gradients or painterly texture; up to 48 colors.

`raw/ui_ult_fg_v01.png` — 1024×1536 full-figure Luffy, straw hat red band, short black hair, small scar below LEFT eye, open red vest, blue shorts with white cuffs, yellow sash, straw sandals. Three-quarter facing/looking and shouting screen-right. Keep lean body, head, torso, legs and second arm normal; one gigantic inflated arm/fist raised behind him. Entire silhouette visible, feet at bottom. Solid #FF00FF, no shadow/text/logo/other figures; crisp hard-pixel clusters, no antialiasing, blur, gradients or painterly texture; at most 48 colors.

Eight full-body 256px cells, right-facing 3/4 view, subtle breathing guard loop on flat magenta. Candidate continuity inputs were the approved title-style reference and unapproved model-sheet v01. The generated 4×2 cell grid was cropped and arranged into `raw/idle_v01.png` in canonical frame order using nearest-neighbor scaling. The user approved this v01, and `reference/idle_approved.png` is its fixed copy. The motion remains subtle; no pack or scale gate is claimed.

Use the canonical animation names and counts from `art/manifest.json`; kit-specific pose guidance is in `ANIMATIONS.md`.
