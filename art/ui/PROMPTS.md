# Shared UI: ChatGPT prompts

Copy-paste blocks for the ChatGPT image generator. Rules and sizes: [README.md](README.md). Save
raw results in `art/ui/raw/`, clean them into `art/ui/final/`.

Tips: one asset per chat. For the logo, generate 3-4 variants, pick one, then iterate on it with
single changes ("same logo, thicker outline"). Check the kanji character by character every time.

## Logo (all-in-one)

Save as: `raw/logo_01.png` (then `_02`, `_03` for variants) -> final `final/logo.png` (~480x180,
transparent). Optional attachment: a screenshot of our own current title screen (its CSS logo shows
the colors and slant). Don't upload other games' logos; the prompt describes the style.

```text
Pixel art video game title logo for an anime arena fighting game, wide landscape image.
Main title text, exactly: "GCD TOURNEY" (capital letters, one line).
Under it, a smaller subtitle in Japanese, exactly these six characters in this order: 天下一武闘祭
Style: heroic anime fighting-game logo. Heavy, bold, italic letters slanted forward, the whole logo tilted slightly counter-clockwise. The title letters are filled with a diagonal gradient from fiery orange (#ff6a10) through gold (#ffb000) and yellow (#ffe060) to sky blue (#7ae0ff) and deep blue (#2a7cff), drawn as 5 to 7 hard color bands (stepped pixel-art gradient, no smooth blending). Thick dark navy outline (#1a1440), a white offset drop shadow toward the lower right and a second navy offset behind it, a bright bevel highlight along the top edges of the letters, and a few small four-point sparkle glints.
The subtitle: white heavy Japanese gothic lettering with a navy (#1a1440) outline, centered under the title.
Crisp hard pixel art: hard pixel edges, no anti-aliasing, no blur, no soft glow, no photographic effects. High contrast, readable when small.
Background: flat solid magenta #FF00FF everywhere. No other text, no characters, no scenery, no frame.
```

## Logo (two-part route, if the kanji come out wrong)

Save as: `raw/logo_title_01.png` -> composite the subtitle yourself (see README "Kanji check").

```text
Pixel art video game title logo for an anime arena fighting game, wide landscape image.
Text, exactly: "GCD TOURNEY" (capital letters, one line). No other text.
Style: heroic anime fighting-game logo. Heavy, bold, italic letters slanted forward, the whole logo tilted slightly counter-clockwise. The letters are filled with a diagonal gradient from fiery orange (#ff6a10) through gold (#ffb000) and yellow (#ffe060) to sky blue (#7ae0ff) and deep blue (#2a7cff), drawn as 5 to 7 hard color bands (stepped pixel-art gradient). Thick dark navy outline (#1a1440), a white offset drop shadow toward the lower right and a second navy offset behind it, a bright bevel highlight along the top edges, a few small four-point sparkle glints. Leave empty space under the title for a subtitle.
Crisp hard pixel art: hard pixel edges, no anti-aliasing, no blur, no soft glow. High contrast.
Background: flat solid magenta #FF00FF everywhere. No characters, no scenery, no frame.
```

## Title-screen key art

Save as: `raw/title_art_01.png` -> final `final/title_art.png` (640x360). Attach: both fighters'
approved `reference/model_sheet.png` files (naruto and sasuke).

```text
Hi-res pixel art key art for the title screen of an anime arena fighting game, 16:9 wide image, HD-2D diorama look.
Scene: a large square tournament ring of pale tiled stone, seen from slightly above and in front, surrounded by short mowed grass. Behind it, a traditional Japanese temple with curved roofs, a big wooden gate, green trees, and packed stands of cheering spectators in many colors. Warm late-afternoon light, golden sky with a few clouds.
On the ring, the two fighters from the attached model sheets face off in fighting stances, matching their designs, proportions and colors exactly:
on the LEFT, facing right: an original anime fan-art ninja boy, about 12 years old, scrappy and cocky, with a huge mass of thick spiky bright golden-blond hair that sticks out in every direction, big bright blue eyes, three thin whisker-like marks on each cheek, a navy-blue cloth forehead band with two long tails and a polished steel plate engraved with a leaf-swirl symbol, a bright orange zip-up jumpsuit jacket with navy-black shoulders and upper back, a big white stand-up collar with a silver zipper ring, matching orange pants bound tight at the lower shins, a small navy holster over a white bandage on his right thigh, and blue open-toed ninja sandals, with a flaring orange aura;
on the RIGHT, facing left: a slim, pale 12-year-old anime ninja boy with spiky black hair that has a blue sheen, thick spikes swept backward and up behind his head, and two long bangs framing his face down to the jaw; sharp narrow dark eyes and an aloof, serious expression; a navy-blue cloth forehead band with a steel plate engraved with a leaf-swirl symbol; a dark-navy short-sleeved shirt with a tall stand-up collar (a red-and-white round paper-fan emblem on the upper back); white arm warmers on his forearms; white shorts; white bandage wraps on his shins; a small dark holster strapped to his right thigh; dark-navy open-toed ninja sandals, with crackling blue lightning in one hand and a blue aura.
Composition: the fighters stand in the lower two thirds; keep the top third of the image as open sky with no important details (a logo goes there). Dramatic but readable.
Crisp hard pixel art: dark outlines on the characters, 3-4 tone cel shading, light glows and auras drawn as hard-edged stepped shapes, no anti-aliasing, no photographic blur, no text, no logo, no frame.
```

The two fighter descriptions are the `## One-paragraph look` sections of
`art/characters/naruto/CHARACTER.md` and `art/characters/sasuke/CHARACTER.md`. When the roster or a
design changes, paste the new characters' `## One-paragraph look` text in their place.

## Title background only (optional)

Save as: `raw/title_bg_01.png` -> final `final/title_bg.png` (640x360).

```text
Hi-res pixel art background for the title screen of an anime arena fighting game, 16:9 wide image, HD-2D diorama look.
Scene: a large square tournament ring of pale tiled stone, seen from slightly above and in front, surrounded by short mowed grass. Behind it, a traditional Japanese temple with curved roofs, a big wooden gate, green trees, and packed stands of cheering spectators. Warm late-afternoon light, golden sky with a few clouds. The ring is empty.
Keep the top third of the image as open sky. Crisp hard pixel art, hard-edged light shapes, no anti-aliasing, no photographic blur, no text, no characters, no frame.
```

## Fix-ups

```text
Same logo, but {{one change: "the subtitle must be exactly 天下一武闘祭" / "thicker navy outline" / "less tilt" / "bigger sparkles"}}. Keep everything else identical. Flat magenta #FF00FF background.
```

```text
Same image, but {{one change: "move both fighters lower so the top third is empty sky" / "make the left fighter's hair match the attached model sheet"}}. Keep everything else identical.
```
