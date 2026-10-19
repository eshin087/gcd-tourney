# Gojo: skills revamp (Blue, Red, Hollow Purple, Unlimited Void)

> Brief for the Codex chat **"5 - Gojo"** (relay lane `gojo-skills`), written by the Claude chat "Gojo skills revamp
> (ENG-SKL-GOJ)" on 2026-10-18. Claude does all engine work (`src/game/**`, `src/world/voidStage.js`, effect names and
> their procedural stand-ins, the domain sphere and the cosmos, the erased trench, the frozen shots) on branch
> `feature/gojo-skills`. Codex draws the art below. Everything in [art/SPEC.md](../../SPEC.md),
> [ADR 0007](../../../docs/decisions/0007-art-spec-v2-shippuden-256.md), the title-style contract
> ([ADR 0029](../../../docs/decisions/0029-title-style-scale-baseline.md)), [art/vfx/README.md](../../vfx/README.md) and
> the HD effect cell of [ADR 0044](../../../docs/decisions/0044-signature-techniques.md) still applies unless this file
> says otherwise. The Sasuke revamp ([sasuke/SKILLS_REVAMP.md](../sasuke/SKILLS_REVAMP.md)) is the worked example.

## 1. The user's request and decisions

**Request (2026-10-18):** revamp the specials, supers and ultimates so they look like the iconic anime/manga moves;
Naruto and Sasuke are done and live, Gojo runs in parallel with Killua, Goku and Luffy.

**What Claude found in game (2026-10-18):**

- **Lapse: Blue** is Naruto's Rasengan sprite (the shared 128 px `orb`) tinted blue under a big soft glow disc that hides
  the opponent; its end is the generic explosion.
- **Reversal: Red** is the same Rasengan sprite tinted dark red-purple under a pink disc; its hit is the generic
  explosion, which **whites out the screen**.
- **Infinity (passive)**: a stopped shot just vanishes in a ring.
- **Blink** leaves a ninja smoke puff and speed lines.
- **Unlimited Void**: `superPose` v05 is right (blindfold pushed up, Six Eyes, the crossed-finger sign), but the domain
  is a 0.9 white flash and a navy floor with rings; the stars are barely visible and the opponent just staggers.
- **Hollow Purple**: two small tinted Rasengans drift together between his still, spread hands under a violet glow disc
  that hides Gojo; the mass is a tinted Rasengan, the trench a flat grey strip, the hit a white explosion.

**The user's answers (2026-10-18, question box in this Claude chat):**

| Question | Answer |
|---|---|
| Hollow Purple | **Full sequence + hands together:** Red in one hand, Blue in the other; a new `beamCharge` brings his hands together in front of his chest where the two collide into Purple; a huge imaginary mass erases a clean trench; the hit swallows them in violet, no white-out. The release (`beamFire` v04, palm thrust) stays. No chant. |
| Unlimited Void | **Full domain sequence:** the Six Eyes glint, a black sphere bursts out of him and swallows the arena, an endless cosmos inside (blinding white-blue horizon, galaxy swirl, starlight streaming past, mirror floor), the opponent frozen with light pouring into their head, the void shattering like glass at the end. No white flashes. |
| Blue and Red | **Both:** Blue a dense navy-black sphere with cyan bands spiralling in, space collapsing into it, an implosion at the end; Red a crimson point on his fingertip, a white-hot crimson orb, a repulsion blast that hurls them into the wall. Effects only. |
| Also revamp | **Infinity passive** (shots stop dead in mid-air, hang, fade with a space ripple), **Blink** (no smoke: space folds, a tiny Blue implosion where he vanishes and reappears), **Six Eyes glint** (at the eyes when the blindfold comes up for the Domain, and on the Purple flash). The Infinity counter stays as it is. |

**Claude's calls on the details (no extra art):**

- **His poses already match the anime** for Blue (`special` v07: the two-finger point), Red (`specialForward` v06: f0 the
  index finger raised where Red forms, f1-f2 the flick, f3 the recoil; `throw` v05 in the air), Blink (`specialUp` v03:
  the sliced blur) and the Domain (`superPose` v05: blindfold up, Six Eyes, middle finger crossed over the index). They
  stay; the new effects carry the revamp.
- **Hollow Purple's release** stays `beamFire` v04 (the palm thrust); only the merge (`beamCharge`) is redrawn so his
  hands carry Red and Blue together.
- **Engine only, no art:** the black domain sphere and the cosmos inside it (shaders in `src/world/voidStage.js`), the
  mirror floor, the erased trench (the ground style `erasure`), the shot frozen in mid-air (its own sprite held and
  faded), the rubble dragged into Blue (the shared debris chunks).

## 2. Rules for this task

- **Models:** generate and direct every image with `gpt-6-luna`, reasoning `medium` (CLAUDE.md "Agent model
  selection"); if this chat runs another model, spawn a Luna subagent (`model`, `reasoning_effort: "medium"`,
  `fork_turns: "none"`) for the generation. The final **Astra** anatomy/scale audit (`gpt-6-astra`, medium) applies to
  the one character strip (B1) only. Effects (part A) need no Astra audit.
- **Budget:** at most 3 generation calls per image, cumulative across retries. One candidate inventory with every
  call, its prompt file and its verdict.
- **Versions:** never overwrite, reuse or delete a `_vNN` file. Next free versions (checked against disk, `_rejected/`,
  `_parts/`, REVIEW.md, git history and the Codex worktrees on 2026-10-18): **`beamCharge_v04`**; every new effect
  starts at `_v01` (none of the twelve names below exists anywhere).
- **Branch:** one worktree, branch `art/gojo-skills`, with the raw art you need (`npm run pr -- start art/gojo-skills
  --art gojo,vfx`, or the host's managed worktree plus `npm run pr -- art gojo,vfx`). Dev server on a free port (52xx).
  Commit only your own paths.
- **Shared files:** other Gojo art may be in flight (ENG-112 normals in the Codex chat "4 - Combat Overhaul"). In
  `art/manifest.json`, `art/characters/gojo/hitboxes.json`, `art/REVIEW.md` and `art/TRACKER.md` change only the rows of
  the animations and effects in this brief.
- **Packing:** a manifest entry `vfx.effects.<name>` with `"hd": true` plus `frames`, `ms`, `anchor` and `fill` from the
  tables below is all the packer needs, so `node tools/pack-sprites.mjs vfx --candidates` works for the new names right
  away. Claude registers the same names with procedural stand-ins on `feature/gojo-skills`. Do not edit `src/` or
  `tools/`.
- **Approval:** the user approves every image version. The approvals desk is off: when a batch is ready, ring the Claude chat
  "Gojo skills revamp (ENG-SKL-GOJ)"
  with `node tools/relay.mjs ring gojo-skills --for user --kind approval --note "<items, versions, review link>"` from
  main and stop on that batch; Claude asks the user and relays the answer word for word. Never treat anything else as
  approval.

### The HD effect cell (every part A effect)

256 x 256 px cell at 112 px per world unit (2.29 units across at scale 1; **Gojo standing is about 195 px tall** in
this cell's pixels, a cast member about 175-195 px). Anchors: **center** = the effect's center on pixel (128, 128) in
every frame; **bottom** = centered on x = 128, base on y = 240 (16 px empty below). The packer scales each strip so its
largest frame is `fill` x 256 px; only the relative sizes between frames come from the art. Draw the sizes below at
that final scale. Effects are drawn **facing screen-right** where they have a direction; the engine mirrors them.

**Style for every effect:** crisp hard-edged pixel art like the approved HD effects (`art/vfx/raw/rasengan_v01.png`,
`chidori_v01.png`, `amaterasu_v01.png`, `kirinHead_v01.png`), flat magenta background, no text, no black outline around
the effect, no soft blur, airbrush, dithering noise or anti-aliased gradients; shading in hard color bands; at most 16
colors per effect. Effects must read at small scale in a busy fight: a bright core, clear shapes, a dark rim for
contrast. **No effect may be a solid white disc or fill most of its cell with white or a flat glow:** Blue, Red and
Purple's old problem was exactly a soft disc over everything.

**Palettes** (white only in thin cores, sparks and edges):

- **Blue (A1, A2):** `#FFFFFF`, `#CFF4FF`, `#7FE0FF`, `#3AA8FF`, `#1E64E6`, `#12309A`, `#0A1650`, `#050A24` (the eye).
- **Red (A3-A5):** `#FFFFFF`, `#FFE0DC`, `#FF8A8A`, `#FF3A4A`, `#E0122E`, `#A00C22`, `#5A0614` (rim).
- **Purple (A8-A10):** `#FFFFFF`, `#FFE8FF`, `#F0A8FF`, `#D070FF`, `#B44CFF`, `#8A2CE8`, `#6A1CC8`, `#2A0A6A` (rim), plus
  a few pixels of the Red and Blue colors where the two techniques still show inside it.
- **Infinity and the Six Eyes (A6, A7):** `#FFFFFF`, `#E8F8FF`, `#BFF6FF`, `#8FD0FF`, `#5FE2FF`, `#1F8EE8`, `#4A90D8`.
- **The void (A11, A12):** `#FFFFFF`, `#E8F8FF`, `#BFE6FF`, `#8FC8FF`, `#5A6CE0`, `#2A1E78`, `#120C30`, `#05040C`.

## 3. Part A: new effects (art/vfx, HD cell, full color)

Raws: `art/vfx/raw/<name>_v01.png`, one row of frames left to right. Cleaned frames: `art/vfx/frames/<name>/<name>_00.png`
... at exactly 256 x 256.

| # | Name | Frames | ms | Plays | Anchor | fill | Used for |
|---|---|---|---|---|---|---|---|
| A1 | `lapseBlue` | 8 | 40 | loop | center | 0.9 | Lapse: Blue, the point that drags everything in; the Blue in his far hand (Purple) |
| A2 | `blueCollapse` | 8 | 40 | once | center | 0.98 | Blue's end: the implosion; small, Blink's fold where he vanishes and reappears |
| A3 | `redForm` | 6 | 40 | once | center | 0.6 | Red forming on his raised fingertip (the Red startup) |
| A4 | `reversalRed` | 8 | 40 | loop | center | 0.9 | Reversal: Red in flight; the Red in his near hand (Purple) |
| A5 | `redBurst` | 8 | 40 | once | center | 0.98 | Red hitting: the repulsion blast |
| A6 | `infinityRipple` | 6 | 40 | once | center | 0.6 | Infinity: the space ripple where a shot stops dead before him |
| A7 | `sixEyesGlint` | 6 | 35 | once | center | 0.4 | the Six Eyes glint (the Domain's blindfold up, the Purple flash) |
| A8 | `purpleForm` | 8 | 40 | once | center | 0.9 | Red and Blue colliding between his hands into Purple |
| A9 | `hollowPurple` | 8 | 45 | loop | center | 1.0 | Hollow Purple, the imaginary mass rolling forward |
| A10 | `purpleBurst` | 8 | 45 | once | center | 0.98 | Hollow Purple hitting: the mass swallowing them |
| A11 | `voidFlood` | 8 | 40 | loop | center | 0.9 | Unlimited Void: infinite information pouring into the frozen opponent's head |
| A12 | `voidShatter` | 8 | 50 | once | center | 1.0 | the domain breaking like glass back into the arena |

### A1 `lapseBlue`: the point that drags everything in (8 frames, seamless loop)

Lapse: Blue, the attraction point: a **small, dense sphere about 90 px across** around the cell center: a **deep
navy-black eye** about 40 px across in its middle (`#050A24`, `#0A1650`), **bright cyan and blue bands spiralling
inward** around the eye (three or four curved arms, `#7FE0FF` / `#3AA8FF` / `#1E64E6`), a thin bright cyan-white rim
(`#CFF4FF`, 2-3 px, white only on a few pixels). Around the sphere, **space bending in**: two or three thin, broken,
hard-edged concentric rings (pale `#7FE0FF` and `#3AA8FF` arcs, 2-3 px thick, gaps in them) at about 130, 180 and
230 px across, and 8-12 short specks and streaks pointing at the center as if sucked in. **Every frame the rings shrink
toward the sphere** (each ring moves inward by an eighth of the gap to the next, a new outer ring fading in on the edge
as the innermost one merges into the rim) and the spiral arms turn about 1/8 turn inward, so f7 flows into f0. The
eye stays dark: the sphere must never read as a white or glowing ball. Mostly empty between the rings, so the opponent
being dragged in stays visible.

### A2 `blueCollapse`: the implosion (8 frames, once)

Blue ending: everything collapses into the point, then one hard shock. **f0:** A1's look (sphere plus rings) but the
rings already close round the sphere. **f1:** the rings crushed onto the sphere, the sphere squeezed to about 60 px, the
spiral arms tight. **f2:** everything crushed into a **30 px point**, cyan streaks converging from all sides to it.
**f3:** a sharp **cyan-white four-point star** about 50 px across (thin spikes, a 10 px white center), the rest of the
cell empty. **f4:** a **thin hard-edged cyan shock ring** (3-4 px thick, not filled) bursting out to about 160 px, the
star shrinking to 16 px. **f5:** the ring at about 220 px, broken into arcs, a few blue specks flung outward. **f6-f7:**
the arcs thinning and fading, 2-3 px specks, nothing in the center by f7. No white disc in any frame. The engine also
plays it at a third of the size for Blink (where he folds out of space and back in).

### A3 `redForm`: Red forming on his fingertip (6 frames, once)

Reversal: Red gathering on the tip of his raised index finger (the engine puts the fingertip on the cell center).
**f0:** five or six tiny crimson sparks (2-3 px) scattered in an area about 70 px across, pointing at the center.
**f1:** the sparks jump together: a 10 px bright crimson point with a white center pixel. **f2:** a 20 px crimson
sphere (white-hot 6 px core, `#FF3A4A` / `#E0122E` bands) with a thin dark crimson ring at 40 px. **f3:** the sphere at
about 30 px, two or three short crackling red sparks jumping off it, the ring pushed out to 70 px. **f4:** the sphere
at about 36 px, pulsing **outward**: a second thin ring at 100 px, short spikes on the sphere's edge. **f5:** the sphere
at about 40 px with a white-hot core and a spiky shell, the rings gone: the look of A4's sphere at a smaller size (the
engine swaps to A4 on the flick).

### A4 `reversalRed`: Red in flight (8 frames, seamless loop, flying to screen-right)

The repulsion orb flying to screen-right: a **compact sphere about 70 px across, centered on (150, 128)**: a white-hot
core about 26 px (`#FFFFFF`, `#FFE0DC`), crimson bands round it (`#FF3A4A`, `#E0122E`), a thin dark rim (`#5A0614`).
Round the sphere, a **shell of short outward-pushing spikes** (8-12, 8-16 px long, `#FF8A8A` / `#FF3A4A`) that pulse
outward a few pixels each frame and snap back. **Trailing behind to screen-left**, its repulsion wake: two or three
**concentric half-ring shock waves** opening to the left (thin hard arcs, 2-3 px thick, from about x 110 back to x 20,
`#FF3A4A` and `#A00C22`), each one pushed a little further left every frame and fading as a new one forms behind the
sphere, so f7 flows into f0. No pink glow, no blur, no soft disc.

### A5 `redBurst`: the repulsion blast (8 frames, once)

Red hitting them: **repulsion**, an outward blast that throws them away, directed to screen-right. Not a white-out.
**f0:** the orb squashed flat against the target at the center: a 60 px white-crimson flash point with eight sharp
spikes. **f1:** a **crimson shock dome** opening to the right: a thick hard-banded half-ring about 130 px across
(`#FF3A4A` front edge, `#A00C22` inner band), with **straight crimson spikes shooting outward**, the longest to the right
(to x about 230). **f2:** the dome expanded to about 220 px, a second, thinner ring inside it, many long straight spikes
radiating (longest to the right, short ones to the left), a white-hot line only along the dome's front edge. **f3:** the
dome at the right cell edge, the inner ring at 150 px, the spikes breaking into dashes. **f4:** the rings thin and break
into arcs, crimson specks flying outward. **f5-f7:** specks and short arc fragments flying out and fading, nothing in
the center by f7.

### A6 `infinityRipple`: the shot stopped by Infinity (6 frames, once)

Where a shot stops dead before reaching him, space ripples: **hard-edged concentric distortion rings, slightly
hexagonal**, see-through (the frozen shot shows through the middle). **f0:** a small bright `#E8F8FF` point and one thin
ring at 20 px. **f1:** three thin rings (1-2 px, `#BFF6FF`, `#8FD0FF`, `#4A90D8`) at 30, 45 and 60 px. **f2:** the three
rings at 50, 75 and 100 px, a few short `#5FE2FF` glints on them. **f3:** at 70, 105 and 140 px, the inner ring fading.
**f4:** the outer two broken into arcs. **f5:** faint arcs only. The center stays empty after f0. No filled disc.

### A7 `sixEyesGlint`: the Six Eyes (6 frames, once)

The instant the Six Eyes show: a **sharp horizontal eye-gleam** centered on the cell (the engine puts it on his eye
line). **f0:** a 6 px `#5FE2FF` point. **f1:** a horizontal streak about 60 px long (2 px thick, white core,
`#BFF6FF` / `#5FE2FF` ends) with a small four-point star at its center (12 px). **f2:** the streak at about 110 px, the
star's vertical spikes 40 px, thin; a second, fainter streak 1 px above it. **f3:** the star turned about 15 degrees,
its arms thinning, the streak at 120 px fading at the ends. **f4:** a 30 px star, the streak gone. **f5:** a fading 4 px
point.

### A8 `purpleForm`: Red and Blue colliding into Purple (8 frames, once)

The two techniques meeting between his hands (the engine puts the cell center where his palms meet). **f0:** a **red
orb** (about 40 px, A4's look without the wake) at x about 84 and a **blue orb** (about 40 px, A1's sphere with its
navy eye) at x about 172, both on y = 128, a few red and blue crackles reaching toward each other. **f1:** the two orbs
closer (x about 104 and 152), **orbiting each other**: a red and a blue streak spiralling round the center. **f2:** they
touch: a **two-tone spiral** (red arms and blue arms wrapped round each other, about 70 px), violet sparks where they
cross. **f3:** a **violet sphere** about 70 px with a white-pink core, red and blue streaks folding into it from both
sides. **f4:** the sphere at 100 px, magenta arcs leaping off it, a thin violet shock ring at 160 px. **f5:** the sphere
at 130 px with the dark indigo rim of A9, the ring at 220 px and breaking. **f6-f7:** the sphere at about 150 px
settling into A9's look (bands, rim, swirl), the last arcs fading. The engine crossfades into A9.

### A9 `hollowPurple`: the imaginary mass (8 frames, seamless loop)

Hollow Technique: Purple, the **huge imaginary mass**: a sphere about **210 px across** around the cell center: a
**blinding white-pink core** about 70 px (`#FFFFFF`, `#FFE8FF`), a bright magenta-violet inner band (`#F0A8FF`,
`#D070FF`), a **saturated violet body** (`#B44CFF`, `#8A2CE8`, `#6A1CC8`) and a **dark indigo rim** about 6 px
(`#2A0A6A`) so it reads against a bright floor. Inside it, **swirling bands** that turn about 1/8 turn per frame, with a
few faint red and blue streaks (its two origins) folded into the violet. On its surface, **thin crackling magenta arcs**
(2-3 per frame) and a few arcs leaping off it to about 240 px. Around it, 6-10 small dark specks and broken shards
**being pulled into it and vanishing** at the rim (what it erases). f7 flows into f0. Hard bands only: no soft violet
glow round it.

### A10 `purpleBurst`: the mass swallowing them (8 frames, once)

Hollow Purple hitting: the target is **erased**, not exploded. Not a white-out. **f0:** the sphere's front edge flaring
round the hit point: a violet crescent wall about 200 px tall, its rim bright magenta. **f1:** a violet dome engulfing
the center, a 70 px white-pink core flash inside it (not larger), thick violet bands. **f2:** two violet shock rings
expanding (about 160 and 220 px), magenta arcs leaping out. **f3:** the rings at the cell edge, the **center going dark
indigo** (`#2A0A6A`): a dark hole about 100 px with a violet rim, the space erased. **f4:** the hole shrinking (70 px),
the rings breaking into violet shards. **f5-f7:** violet shards and specks flying out and fading, the hole closing to a
point and gone by f7.

### A11 `voidFlood`: infinite information (8 frames, seamless loop)

Unlimited Void floods the victim's mind with infinite information (the engine puts the cell center on their head while
they stand frozen). **Thin streaks of light converging from every direction onto the center**: 20-30 straight streaks
(1-2 px thick, 10-40 px long, `#FFFFFF` heads, `#BFE6FF` / `#8FC8FF` tails, a few `#5A6CE0`), starting at the cell
edges and racing inward; a **small bright point at the center** (10-12 px, white with a `#BFE6FF` ring at about 26 px)
that flickers. Each frame every streak moves about 1/8 of the way inward (new ones appear at the edges as old ones
reach the point), so f7 flows into f0. The ring of streaks is densest 40-110 px from the center and **the area inside
40 px is clear except the point**, so the face still shows. No fill, no glow.

### A12 `voidShatter`: the void breaking like glass (8 frames, once)

The domain ending: the black void **cracks and shatters like a pane of glass** in front of the camera (the engine scales
it to cover the screen). **f0:** the **whole cell a black pane** (`#05040C`, `#120C30` faint mottling) with three or
four thin white-blue crack lines (`#E8F8FF`, `#8FC8FF`) running from the center. **f1:** the cracks spidering out to
every edge, a radial web with a few cross cracks, small bright chips at the crack junctions. **f2:** the pane split into
about 20-30 **angular shards** with bright white-blue edges (1-2 px) and thin gaps between them (magenta = see-through).
**f3:** the shards pulling apart and flying outward from the center, the **center open** (magenta) about 80 px across.
**f4:** the shards tumbling (each turned a little), smaller, the open center about 160 px. **f5:** only shards near the
edges, the center fully open. **f6:** a few small shards at the very edges and white-blue glints. **f7:** two or three
tiny glints, nearly empty.

## 4. Part B: Gojo character art

Scale and anatomy follow the title-style contract: the same pixel density as his approved idle and combat cell, 256 px
cells, pivot `[128, 240]`, facing right, 48-color sheet palette, the **blindfold on** in every frame (the eyes show only
on `superPose` and the cut-in). Attach his approved title-style neutral/combat cells, his approved idle and the current
`beamCharge` v03 and `beamFire` v04 as references. **No orb, glow, lightning or energy in any sprite:** the engine draws
Red, Blue and Purple.

### B1 `beamCharge` v04: HOLLOW PURPLE, the hands coming together (4 frames, once, bodyHeight as v03, ms 60 each)

The anime's Hollow Purple merge: **Red in his R (near) hand, Blue in his L (far) hand, and the hands come together in
front of his chest** where the two collide. f0 is held through the 46-frame super flash, then f1-f3 play once over the
26-frame merge and the strip hands over to `beamFire` v04 (the palm thrust), so f3 must flow into `beamFire` f0.

- **f0 · the two techniques held apart:** the wide stance of v03 (feet apart, knees bent, weight centered, upright
  torso, head turned toward the opponent, a calm smirk). The **R (near) arm drawn back** at shoulder height, elbow bent,
  **R hand open and cupped, palm up, fingers curled as if holding a ball** at about (70, 96) (Red sits there); the **L
  (far) arm extended forward**, **L hand open and cupped, palm up** at about (192, 96) (Blue sits there). Hair and jacket
  hem stirring.
- **f1 · the swing:** the R arm sweeping forward round his body at chest height, the L arm drawing in toward the chest;
  the two cupped hands **about 60 px apart** in front of his chest (R hand at about (150, 104), L hand at about
  (210, 100)), the torso turning to face forward, the weight shifting onto the front leg.
- **f2 · the hands meet:** both hands in front of the chest, **palms facing each other with a ball's space (about
  24 px) between the fingertips**, fingers curved, elbows bent; the meeting point (where Purple forms) at about
  **(196, 106)**, the same place as `beamFire` v04's thrusting palm in its f0 (205, 107) so the release follows on;
  leaning slightly forward, head down toward the hands.
- **f3 · the force between them:** the same pose trembling 1-2 px, the **jacket hem, sleeves and hair blown back** by the
  mass forming between his hands, the shoulders braced.

**Anchors (hitboxes.json `beamCharge`, `_v`: 4):** record `hand` = the point between the two palms where Purple forms on
**f2 and f3**, and on f0 and f1 the R (near) palm center (Red). Write the **R and L palm centers of every frame** in the
block's `_hands` note (final-cell pixels, measured on the packed cells): the engine places Red and Blue on them. No hit
boxes (`"hit": []` on every frame). Keep his head within the strict scale gate against idle (the packer's auto head
fit), keep both feet on the floor line (y = 240), and keep the body, limbs and clothing volume of v03 (no shrinking in
the wide stance).

Manifest (`characters.gojo.anims.beamCharge`): `frames` 4, `loop` **false**, `ms` `[60, 60, 60, 60]`, `bodyHeight` as
measured, `version` 4. The engine plays it by progress (f0 during the flash, f1-f3 over the merge), not by its ms.

## 5. Order, review and handback

1. **Batch 1, Blue and Red** (the moves seen every match): A1 `lapseBlue`, A2 `blueCollapse`, A3 `redForm`,
   A4 `reversalRed`, A5 `redBurst`. One review page: the raw strips, the effects at game scale as GIFs over a
   stage-colored background, A1 beside a standing opponent silhouette (it must not hide them), A4 flying left to right;
   ring Claude for the user's approval.
2. **Batch 2, Hollow Purple:** B1 `beamCharge` v04 (pack Gojo with the candidate, run `npm run body gojo beamCharge`
   and the Astra audit on it), A8 `purpleForm`, A9 `hollowPurple`, A10 `purpleBurst`, A7 `sixEyesGlint`. One review
   page (B1's packed frames beside idle f0 and the approved combat cell; A8 played over B1 f2's hands; A9 beside a
   standing body for size); ring Claude.
3. **Batch 3, Infinity and the Domain:** A6 `infinityRipple`, A11 `voidFlood`, A12 `voidShatter`. One review page (A11
   over a head and shoulders; A12 at full-screen size over a black background); ring Claude.

Each ring names the versions, any holds and the review URL. Record each candidate in `art/REVIEW.md`, the effect
entries in `art/manifest.json` (`vfx.effects.<name>`: frames, ms, colorRule `fullColor`, anchor, fill, `hd: true`,
step, status, version) and `art/TRACKER.md`. Claude integrates each approved batch in game and shows the user an
in-game preview.
