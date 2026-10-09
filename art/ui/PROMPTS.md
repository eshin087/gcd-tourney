# Shared UI: image prompts

Copy-paste blocks for the image generator (Codex's built-in generator, or ChatGPT run by the user).
Rules and sizes: [README.md](README.md). Save every result in `art/ui/raw/` under the next free
version (`_v01`, `_v02`, ...; never overwrite, never reuse a number), add a `needs review` row to
[REVIEW.md](../REVIEW.md), and clean the approved one into `art/ui/final/`.

Tips: one asset per thread. For the logo, generate 3-4 variants (each one its own version), let the
user pick one, then iterate on it with single changes ("same logo, thicker outline"), saving each
result as the next version. Check the kanji character by character every time.

## Logo (all-in-one)

Save as: `raw/logo_vNN.png` (each variant is the next version) -> approved one cleaned into
`final/logo.png` (~480x180, transparent). Optional attachment: a screenshot of our own current title
screen (its CSS logo shows the colors and slant). Don't upload other games' logos; the prompt
describes the style.

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

Save as: `raw/logo_title_vNN.png` -> composite the subtitle yourself (see README "Kanji check").

```text
Pixel art video game title logo for an anime arena fighting game, wide landscape image.
Text, exactly: "GCD TOURNEY" (capital letters, one line). No other text.
Style: heroic anime fighting-game logo. Heavy, bold, italic letters slanted forward, the whole logo tilted slightly counter-clockwise. The letters are filled with a diagonal gradient from fiery orange (#ff6a10) through gold (#ffb000) and yellow (#ffe060) to sky blue (#7ae0ff) and deep blue (#2a7cff), drawn as 5 to 7 hard color bands (stepped pixel-art gradient). Thick dark navy outline (#1a1440), a white offset drop shadow toward the lower right and a second navy offset behind it, a bright bevel highlight along the top edges, a few small four-point sparkle glints. Leave empty space under the title for a subtitle.
Crisp hard pixel art: hard pixel edges, no anti-aliasing, no blur, no soft glow. High contrast.
Background: flat solid magenta #FF00FF everywhere. No characters, no scenery, no frame.
```

## Title-screen key art

Save as: `raw/title_art_vNN.png` -> approved one cleaned into `final/title_art.png` (640x360).
Attach: both fighters' approved spec v2 `reference/model_sheet.png` files (naruto and sasuke). Do it
only after both are approved. This is the only prompt that puts both characters in one image.

```text
Hi-res pixel art key art for the title screen of an anime arena fighting game, 16:9 wide image, HD-2D diorama look.
Scene: a large square tournament ring of pale tiled stone, seen from slightly above and in front, surrounded by short mowed grass. Behind it, a traditional Japanese temple with curved roofs, a big wooden gate, green trees, and packed stands of cheering spectators in many colors. Warm late-afternoon light, golden sky with a few clouds.
On the ring, the two fighters from the attached model sheets face off in fighting stances, matching their designs, proportions and colors exactly. Both are drawn with realistic anime proportions, about 6.5 heads tall, athletic teenage builds, serious and intense expressions; not chibi, not super-deformed:
on the LEFT, facing right: a lean, athletic young ninja of about 16 with a confident, determined air; thick spiky golden-blond hair with spiky bangs, bright blue eyes, three thin whisker-like marks on each cheek; a long black cloth forehead band with a polished steel plate engraved with a leaf-swirl symbol; a black-and-orange zip-up track jacket (black shoulders, upper chest, upper sleeves and high collar, orange body and lower sleeves, a red spiral emblem on the back); orange pants; a small holster on his right thigh; black open-toed ninja sandals; with a flaring orange aura;
on the RIGHT, facing left: a lean, pale young ninja of about 16 with a cold, calm, precise air; black hair with a dark-blue sheen, spiky and swept back at the back of his head, with long bangs framing both sides of his face down past the jaw; sharp, narrow dark eyes; no forehead band; a white long-sleeved shirt with a tall stand-up collar, worn open in a deep V to mid-chest, with a small red-and-white round paper-fan emblem on the back of the collar; a thick purple rope belt tied in a big bow at the back; a dark navy cloth wrapped around his waist and hanging to his knees over dark navy pants; dark navy arm guards on his forearms; black open-toed ninja sandals; a straight sword in a black sheath tucked horizontally through the rope belt at the small of his back; with crackling blue lightning in one hand and a blue aura.
Composition: the fighters stand in the lower two thirds; keep the top third of the image as open sky with no important details (a logo goes there). Dramatic but readable.
Crisp hard pixel art: dark outlines on the characters, 3-4 tone cel shading, light glows and auras drawn as hard-edged stepped shapes, no anti-aliasing, no photographic blur, no text, no logo, no frame.
```

The two fighter descriptions follow the `## One-paragraph look` sections of
`art/characters/naruto/CHARACTER.md` and `art/characters/sasuke/CHARACTER.md` (spec v2, Shippuden).
Before running this prompt, check them against those sections and paste the current text if a brief
changed; when the roster changes, paste the new characters' `## One-paragraph look` text in their
place.

## Title background only (optional)

Save as: `raw/title_bg_vNN.png` -> approved one cleaned into `final/title_bg.png` (640x360).

```text
Hi-res pixel art background for the title screen of an anime arena fighting game, 16:9 wide image, HD-2D diorama look.
Scene: a large square tournament ring of pale tiled stone, seen from slightly above and in front, surrounded by short mowed grass. Behind it, a traditional Japanese temple with curved roofs, a big wooden gate, green trees, and packed stands of cheering spectators. Warm late-afternoon light, golden sky with a few clouds. The ring is empty.
Keep the top third of the image as open sky. Crisp hard pixel art, hard-edged light shapes, no anti-aliasing, no photographic blur, no text, no characters, no frame.
```

## Fix-ups

Paste in the same thread, right after a result. Save each result you keep as the next version.

```text
Same logo, but {{one change: "the subtitle must be exactly 天下一武闘祭" / "thicker navy outline" / "less tilt" / "bigger sparkles"}}. Keep everything else identical. Flat magenta #FF00FF background.
```

```text
Same image, but {{one change: "move both fighters lower so the top third is empty sky" / "make the left fighter's hair match the attached model sheet" / "both fighters about 6.5 heads tall, smaller heads, not chibi"}}. Keep everything else identical.
```
