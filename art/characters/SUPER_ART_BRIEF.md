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
| `ui_super_fg_vNN.png` | `ui/super_fg.png` | 384 x 240 (contain-fit, bottom-aligned) | 1024 x 1024 on magenta | the fighter **chest-up** in the super's pose. The banner is 192 tall; the head and a raised hand may break 48 px out of its top |
| `ui_ult_bg_vNN.png` | `ui/ult_bg.png` | 768 x 432, opaque | 1536 x 1024 | the ultimate's full-screen backdrop. Center-cropped to 16:9 (y 80-944); phones crop the sides to 4:3, so **keep the focal symbol inside the middle 1152 px** |
| `ui_ult_fg_vNN.png` | `ui/ult_fg.png` | 576 x 432 (contain-fit, bottom-aligned) | 1024 x 1536 on magenta | the fighter **three-quarter to full figure** in the ultimate's pose, bottom of the figure at the bottom edge |

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
  the move name and the banner frame). The `fg` is on flat magenta #FF00FF with no magenta or hot pink on the
  character. The fighter's own CHARACTER.md palette always wins, purples included (Sasuke's rope belt stays purple);
  energy the fighter holds (lightning in a hand, a flame at the feet) belongs in the `fg`.
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

## Lessons from the Sasuke pilot (apply to every fighter)

- The two backdrops passed on their first call; both cutouts needed three rounds, always for the **face** (wider,
  rounder eyes and a raised chin than the approved cells) and for **small identity details** (the eye pattern, which
  eye bleeds). So for every `fg`: compare the face with the approved title-style cells *before* review, name the
  identity details in the prompt as hard constraints, and when a version is close, **edit only the face/detail region**
  of it instead of regenerating the whole figure.
- The character's own CHARACTER.md palette always wins (purples included).
- The HUD shows a backdrop with the eye strip until a cutout is approved, so a backdrop can be approved and shipped alone.

## Round 2 (user go-ahead 2026-10-15): Naruto, Killua, Gojo, Goku, Luffy

Read each fighter's CHARACTER.md (identity checklist, face, palette) first. Same four images per fighter, same sizes and
rules. Goku and Luffy: draw their `fg` only once their title-style reference is approved (else do the two backdrops
and mark the cutouts blocked).

### Naruto (Shippuden, Sage-era look per CHARACTER.md)

- **SUPER: Shadow Clone Barrage.** `super_bg`: a wall of shadow clones charging across a dusk battlefield in a blur of
  orange and black, smoke puffs where clones vanish, a **Giant Rasengan** forming at the right of the band (blue-white
  sphere, spiraling streaks). `super_fg`: Naruto chest-up, one palm thrust forward toward the right holding the
  Rasengan's glow (no full orb, the engine draws it), grin of effort, headband tails whipping, two clone silhouettes
  just behind his shoulders.
- **ULTIMATE: Four-Tails.** `ult_bg`: a scorched crater under a blood-red sky, boiling red-black chakra rising like
  smoke, **four chakra tails** silhouetted huge across the upper half, cracks glowing ember-orange. `ult_fg`: Naruto in
  the Four-Tails cloak: a dark crimson-black chakra shroud over his body, bubbling edge, white glowing eyes and mouth,
  four tails behind him, crouched on all fours, roaring toward the right. Keep his build readable under the shroud.

### Killua (Godspeed era per CHARACTER.md)

- **SUPER: Speed of Lightning.** `super_bg`: a dark night city rooftop band shattered by **dozens of blue-white
  afterimage streaks** criss-crossing, lightning forks, a faint Godspeed aura glow at the right. `super_fg`: Killua
  chest-up, hair standing up crackling with blue lightning, claw hand raised beside his face, cold half-lidded stare
  toward the right, blue sparks along both arms.
- **ULTIMATE: Whirlwind (Godspeed).** `ult_bg`: a storm-black void filled by a **spiral of electricity** coiling around
  the center like a tornado, a pale blue core, shards of rock floating. `ult_fg`: Killua full figure in a low ready
  crouch toward the right, his whole body sheathed in crackling blue-white electricity, hair streaming up, eyes glowing
  blue, one hand forward in a claw.

### Gojo (blindfold look per CHARACTER.md)

- **SUPER: Domain Expansion: Unlimited Void.** `super_bg`: an infinite starfield of white and violet light lines
  rushing toward a vanishing point at the right, the floor a mirror-black plane; a faint ring of the domain's boundary.
  `super_fg`: Gojo chest-up, **blindfold pulled down to reveal the Six Eyes** (bright cyan-blue, iris rings), right
  hand raised at chest height with index and middle fingers crossed (the domain sign), slight smile.
- **ULTIMATE: Hollow Purple.** `ult_bg`: a city skyline torn open by a **violet orb carving a trench** toward the
  viewer, red and blue light fusing at the center into purple, debris lifting. `ult_fg`: Gojo three-quarter figure,
  Six Eyes uncovered, one arm extended toward the right with the hand open, the other raised, both glowing (left blue,
  right red), hair lifted by the force.

### Goku (Cell saga, Super Saiyan per CHARACTER.md)

- **SUPER: Kaio-ken Rush.** `super_bg`: a rocky wasteland under a dark sky, a **red Kaio-ken aura** flaring across the
  band, afterimages of punches, rock pillars cracking. `super_fg`: Goku chest-up, fist pulled back, red aura licking
  around him, teeth clenched, eyes locked right.
- **ULTIMATE: Kamehameha.** `ult_bg`: the Cell Games ring and sky, a **blue-white beam** blasting across from left to
  right, the light washing the clouds. `ult_fg`: Goku full figure in the classic Kamehameha pose, both palms cupped
  forward to the right, golden hair, blue-white glow between his hands (the engine draws the beam).

### Luffy (Enies Lobby per CHARACTER.md)

- **SUPER: Jet Gatling (Gear Second).** `super_bg`: a stone courthouse plaza band, **steam billowing**, a storm of
  blurred fists hammering toward the right. `super_fg`: Luffy chest-up in Gear Second: flushed pink-red skin, steam
  rising off his body, fist cocked back, straw hat on, fierce grin.
- **ULTIMATE: Gigant Pistol (Gear Third).** `ult_bg`: the Enies Lobby tower and sea at sunset, a **giant inflated fist**
  silhouette smashing down toward the right. `ult_fg`: Luffy full figure with one **gigantic inflated arm** raised
  behind him (Gear Third), the rest of him normal size, straw hat, determined shout toward the right.
