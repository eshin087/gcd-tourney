# Super banner and ultimate splash brief (ART-SUPER-ART)

For Codex. Four layered UI images per fighter: a wide **banner** for the SUPER and a full-screen **splash** for the
ULTIMATE, each as a backdrop (`bg`) and a fighter cutout (`fg`). Contract: [ADR 0035](../../docs/decisions/0035-super-banners-and-ultimate-splashes.md),
[SPEC.md "Per-character UI images"](../SPEC.md#per-character-ui-images). The user asked for "the iconic anime/manga
stunning epic feel" and art that shows "more than just their partial face". **Sasuke is the pilot**; the other
fighters follow the same recipe only after the user approves his four images.

Until an image is approved and packed, the game shows today's eye strip on speed lines, so nothing waits on this.

## The four images

| raw (art/characters/<id>/raw/) | approved copy | final size | generate at | what it is |
|---|---|---|---|---|
| `ui_super_bg_vNN.png` | `ui/super_bg.png` | 768 x 192, opaque | 1536 x 1024 | the super's backdrop. The packer center-crops to 4:1 (y 320-704 of the raw): **everything that matters sits in that middle band**, above and below only continues the sky/ground |
| `ui_super_fg_vNN.png` | `ui/super_fg.png` | fitted to 240 tall | 1024 x 1024 on magenta | the fighter **chest-up** in the super's pose. The banner is 192 tall; the head and a raised hand may break 48 px out of its top |
| `ui_ult_bg_vNN.png` | `ui/ult_bg.png` | 768 x 432, opaque | 1536 x 1024 | the ultimate's full-screen backdrop. Center-cropped to 16:9 (y 80-944); phones crop the sides to 4:3, so **keep the focal symbol inside the middle 1152 px** |
| `ui_ult_fg_vNN.png` | `ui/ult_fg.png` | fitted to 432 tall | 1024 x 1536 on magenta | the fighter **three-quarter to full figure** in the ultimate's pose, bottom of the figure at the bottom edge |

## Rules (every fighter)

- **Style.** Crisp hard-edged hi-res pixel art in the approved title style, at **2 x 2 screen pixels per art pixel**
  (768 art pixels across a 1536 canvas). No anti-aliasing, blur, soft gradients or painterly texture; energy and light
  are drawn in hard bands of 3-5 tones. The `bg` may use up to 48 colors, the `fg` the fighter's CHARACTER.md palette
  plus the move's energy colors (at most 48 in all).
- **Anatomy.** The `fg` face, hair, eyes and build match the approved title-style neutral and combat cells
  (`public/art-review/title-style-pilot/`) and the fighter's CHARACTER.md identity checklist. Not chibi. Compare the
  head and shoulders against the approved `select.png` and `portrait.png` before review; a different-looking face is a hold.
- **Facing.** The fighter faces and looks toward **screen right** (the opponent). The engine mirrors the art for the
  right-hand player.
- **Layers stay separate.** The `bg` has **no character** in it, and no text, logo, border or speed lines (the HUD adds
  the move name and the banner frame). The `fg` is on flat magenta #FF00FF with no magenta, hot pink or violet on the
  character; energy the fighter holds (lightning in a hand, a flame at the feet) belongs in the `fg`.
- **Iconic first.** Each image shows the move the way the anime's most famous shot of it does, then fits it to the
  frame. A viewer should name the move from the backdrop alone.
- **Budget.** At most 3 generation calls per image (failed ones count). One candidate inventory per image in its
  REVIEW.md row. Model policy (CLAUDE.md): every generation under `gpt-6-luna` medium; the anatomy check of the two
  `fg` images under `gpt-6-astra` medium against the approved cells.

## Review page (every round)

`public/reviews/super-art-<id>-r1/index.html`, phone-first:
1. Each image alone at its final size, then 3x.
2. **Banner mock:** a game screenshot (any match frame) with `super_bg` as a full-width band at 30% from the top, the
   `fg` over it on the left third, its head breaking the top edge, and "KIRIN" lettered in plain white under it.
3. **Splash mock:** `ult_bg` + `ult_fg` at 16:9 and center-cropped to 4:3, with the move name in plain white.
4. The `fg` heads beside the approved `select.png` / title-style neutral cell at one density.

## Sasuke (pilot)

Read art/characters/sasuke/CHARACTER.md §2, §5 and §7 first. Hebi-era Shippuden look: white open-chest shirt, purple
rope belt, navy waist cloth, Kusanagi on the back. Eyes: the **3-tomoe Sharingan** for Kirin, **his own Mangekyō** for
Amaterasu (ANIMATIONS.md "superPose": the one animation that already uses it). Red `#d81e28` iris with the `#7c0c16`
rim, black tomoe; they must read as **red at a glance** in every image.

### SUPER: Kirin (banner)

- **`super_bg`:** a night thunderstorm over a ruined mountaintop. Black-violet clouds churning in a spiral, and inside
  them **Kirin, the lightning dragon**, coiling and diving toward the right of the band, its head and open jaws the
  brightest shape. White-blue core lightning with pale violet edges, thin forks branching to the ground, slanted rain
  streaks. The band reads dark at the edges and bright where the dragon's head is (right of center).
- **`super_fg`:** Sasuke chest-up, three-quarter view toward the right, **right arm raised straight up**, hand open
  to the sky, a few hard white-blue sparks along that arm (not a full Chidori). Chin slightly down, eyes up at the
  storm: a cold, certain look, the Sharingan bright red. Hair and shirt collar whipped by the wind.

### ULTIMATE: Amaterasu (splash)

- **`ult_bg`:** a blood-red sky with a **colossal Mangekyō Sharingan** filling the upper middle like an eclipsing
  moon (his own pattern from ANIMATIONS.md superPose, black on red with the dark rim). Below, a wall of **black
  Amaterasu flames** rising across the whole width: pure black flame bodies with thin dark-crimson rims and a few
  ember sparks, burned rock silhouettes at the bottom. No other color than red, black, crimson and a little ember orange.
- **`ult_fg`:** Sasuke three-quarter figure toward the right, standing in the flames' glow, **left hand raised to
  his left eye**, the right eye's Mangekyō staring straight out at the viewer, a thin line of blood under the left eye
  (the strain of the technique; keep it one thin line). Black flames lick around his feet and lower legs. Rim light
  in crimson on his right side, the rest of him in shadow so the eye is the brightest thing on him.
