# Charge redraw brief (ART-CHARGE)

For Codex, chat "1 - Charging Animation", relay lane `charge`. **The user's request (2026-10-18, in Claude "Character
charging animation"):** "charging up animation for all characters need to be improved and look like they're charging
up. right now looks like they're spazzing out. use codex '1 - Charging Animation' to make the new art sprites and
animations."

## Why the charge looks like a spasm today

Claude's diagnosis (packed strips of all six fighters, side by side):

1. **The old contract asked for a tremble.** `charge` was 4 frames at 50 ms each: the whole loop five times a second.
   Even the 3D placeholder flips between two poses every 50 ms.
2. **The four frames are separately drawn figures, not one pose in motion.** Feet, hips and head land 1 to 4 px apart
   from frame to frame, so at 20 fps the body jitters. Luffy's strip also switches between normal and Gear Second pink
   skin mid-loop (a colour strobe).
3. **The game shook the sprite as well** (fighter.js, about 11 Hz). Claude removes that in ENG-117.
4. **Most poses don't read as powering up.** Goku and Gojo barely change from their stance; nothing gathers, nothing
   releases.

## The new contract: gather, then hold

`charge` becomes **6 frames that play f0 → f1 once, then loop f2-f5** while Special is held (`loopFrom: 2`, new in
ENG-117). Starting timing, which Claude may tune in the lab after seeing the art: **70, 90, 110, 110, 110, 110 ms**
(the held loop is a 0.44 s heave, 4x slower than today).

| f | beat | plays | what |
|---|---|---|---|
| f0 | GATHER | once | the inhale: weight drops (knees bend more), the hands pull in tight, shoulders hunch, chin tucks, eyes narrow. Hair and clothes at rest. The anticipation. |
| f1 | RELEASE | once | the body snaps open into the power stance: chest up, the arms drive into the fighter's power pose (below), head lifts, mouth opens. Hair and loose cloth flung upward. |
| f2 | HOLD a | loop | the power stance of f1, held: the breath in. |
| f3 | HOLD b | loop | chest and shoulders up 1-2 px (straining), the shout widest. |
| f4 | HOLD c | loop | as f3, fists and forearms quivering 1 px. |
| f5 | HOLD d | loop | shoulders settle 1-2 px; flows back into f2 with no pop. |

**Loop rules (the fix for the spasm; Astra checks each one):**

- **Locked across f2-f5:** the feet (identical pixels on the floor line y 240), knees and hip line. Head centre moves
  **at most 2 px**, the fists at most 2 px. The body is the same figure in the same place in all four frames.
- **What moves in the loop:** the breath (shoulders and chest 1-2 px), the shout, tensed fingers and forearms, and the
  updraft: hair, headband tails, jacket hems, sleeves and loose cloth lifted upward in **four different shapes that
  cycle** (a steady rising wind, not a flicker between two shapes).
- **Colours and outfit identical in all six frames** (except Luffy's flush, below).
- **One figure, one call:** draw the four loop frames as **one strip in one image call** from the same pose. The gather
  and release frames may be a second part (`raw/_parts/charge_vNN_A.png` = f0-f1, `_B.png` = f2-f5) with part B attached as
  the reference, or all six in one call if the generator keeps them consistent. If a call still drifts, an allowed
  repair is a **scripted composite**: keep the best loop frame's body for all four and take only the moving parts (hair,
  hems, mouth) from the other frames, recording the source frames and the script in the handoff. Never an
  image-generation "edit" (it repaints the whole strip).
- **No effects in the sprite:** no aura, no sparks, no steam, no lightning, no dust. The engine draws each fighter's
  canon power-up around the body (src/characters/<id>.js `charge`, ADR 0023).
- **Scale:** the title-style contract (art/scale/title-style-pilot/PRODUCTION_CONTRACT.md, ADR 0029) and
  art/CHARACTER_SCALE.md. Same head, torso, limbs and clothing volume as the approved neutral/combat cells and the
  current idle f0. The gather crouch is posed shorter, never resized to standing height. Set `bodyHeight` from the
  release/hold frames against this fighter's current `charge` entry, then check with `npm run body <id> charge` (B and H
  0.93-1.07 against idle f0) and the strict pack.

## The power pose per fighter

Each fighter keeps their CHARACTER.md rules and expression sheet; the facing is screen-right as always.

| order | fighter | f0 GATHER | f1-f5 power pose | face (hold) | engine draws around it |
|---|---|---|---|---|---|
| **1 (pilot)** | **Goku** (SSJ, Cell saga) | deep crouch, both fists pulled to the hips, elbows back, head down | the classic Super Saiyan power-up: wide stance, arms rigid **down and slightly out from the hips, fists clenched**, back slightly arched, chest out, head tilted back | shouting, brows hard down, teeth bared | golden flame shell, rocks lifting, cracks |
| 2 | Luffy | crouch, one hand on the near knee | **Gear Second**: low crouch, near hand on the knee, far fist clenched at the chest; the hold pumps the legs (the body bobs 1-2 px down and up, feet planted) | determined grin, teeth showing | pink steam |
| 3 | Naruto | hands come together low in front, shoulders hunched, head down | **Storm-style chakra charge**: deep wide stance, both hands joined in the **Ram seal** in front of the chest (index and middle fingers up, the rest interlaced), elbows out, head up | roaring, eyes fierce | Nine-Tails red chakra boiling up |
| 4 | Sasuke | weight sinks, right hand comes up toward the chest | low stance, **right hand in a one-handed seal before his chin** (index and middle fingers up), left arm down and back, fist clenched; **sword sheathed at the small of his back** | Sharingan glare, shouting (his expression sheet) | dark curse-mark chakra, Chidori current |
| 5 | Killua | hunched forward, arms crossed low in front | crouched, **arms flung out and down at his sides, fingers spread and crooked** (no claws unless his CHARACTER.md allows), **hair bristling upward** | fierce, one pointed canine | Transmutation electricity |
| 6 | Gojo | hands drift out of his pockets, shoulders drop, head tilts down | **calm**: upright loose stance, arms held slightly out and down, **palms open facing the floor, fingers spread** (pressing on the space); the hold barely moves (the breath, hair and hem drifting up) | lazy smile, **no shouting**, blindfold on | Infinity shimmer, floating pebbles, Six Eyes glint |

Luffy's skin flushes **Gear Second pink from f1 on** (f0 normal skin, f1-f5 all pink: the flush happens once, in the
release, and never flickers in the loop).

## How to work

- **Pilot first: Goku alone**, through the user's approval. Only after a relayed `USER APPROVAL` (or the user's
  redirect) of the Goku direction do the other five, in the table's order, at most **two art worktrees at once**
  (storage, OPS-013). One fighter per branch: `npm run pr -- start art/charge-<id> --art <id>` (dev port 5261 + n).
  Never `--full`, never a copy.
- **Models:** generation under gpt-6-luna/medium; the final audit by a gpt-6-astra/medium helper
  (`collaboration.spawn_agent` with `model`, `reasoning_effort: "medium"`, `fork_turns: "none"`), CLAUDE.md "Agent
  model selection". No new user-visible chats.
- **Versions:** the next free `charge_vNN` per fighter (check `raw/`, `raw/_qa_hold/`, `raw/_rejected/`, Git history and
  art/REVIEW.md). **Budget: 3 image calls per image** (per part if you draw it in two parts), counting unsaved failures.
  A miss after the budget goes to `raw/_qa_hold/` with the reason; the game keeps the current strip. Never overwrite,
  reuse or delete a version.
- **Engine support:** packing a 6-frame strip that loops from f2 needs ENG-117 (Claude's PR, `loopFrom` in the packer
  and the game). Generate first. Before you pack, `git merge main` in the worktree and check
  `git grep -n loopFrom -- tools/pack-sprites.mjs` finds it. If it doesn't yet, ring `charge` (no `--for user`) saying
  the art is ready to pack, and wait for Claude.
- **Manifest** (`characters.<id>.animations.charge`): `frames: 6`, `loopFrom: 2`, `ms: [70, 90, 110, 110, 110, 110]`,
  `loop: true`, the new `version`, status `needs review` (leave `approvedVersion` on the old one until the user
  approves). The old version's `packScale` and `scaleManualQA` belong to the old drawing: drop them unless you measure the
  new one the same way. Update the fighter's ANIMATIONS.md `charge` section to this brief's frame plan.
- **Pack** the whole fighter the way main's pack was made (anims.json `packer`; Goku, Luffy and Gojo with
  `--quantize 48 --keep-palette`, size-r7 rule), then compare the animation count with main's pack (TOOL-061 refuses a
  pack that drops animations). Other lanes are changing these fighters' packs too (`combat` normals, the skills
  revamps): before you ring for the merge, `git merge main` again and re-pack.
- **QA before the user sees it:**
  - **Judge the packed cells, never the raw canvas** (Claude, 2026-10-18, after Goku, Luffy and Naruto were each held
    over a layout the packer handles): a single 6-pose row, a 3x2 grid, a wide or non-square canvas, figures placed
    off-centre in their cells and near-magenta backgrounds are all fine when the packer cuts six frames. Before holding
    a candidate, scratch-pack it (`node tools/pack-sprites.mjs --root <scratch copy> --out <scratch> --quantize 48 <id>`)
    and measure there; hold only for what the packed frames show. In the hold loop a 2-4 px breath or pump that moves
    the whole upper body together is the intended motion, not drift.
  - **Registration sheet:** f2-f5 overlaid as an onion skin at 2x, plus each loop frame's difference from f2 with the
    feet rows (y 220-240) and the head marked. The feet must not move (1-2 px of redrawn outline is fine); the head
    moves only with the breath (Goku 2 px, Naruto 3 px, Luffy's pump 3-4 px were all approved).
  - Body sheet (`npm run body <id> charge`), `npm run lineup`, the strict pack, and the loop in the lab
    (lab.html ANIMATIONS tab) at the manifest timing.
  - Astra audits every frame and the loop in the packed atlas against idle f0 and the approved neutral/combat cells
    (head, torso, limbs, build, clothing volume, the loop rules above). Luna fixes holds within the budget.
  - Gojo only: give the eye centre (cell x, y) of f2 in the handoff; Claude re-aims the Six Eyes glint.
- **Review page** `public/reviews/charge-<id>/`: the current strip as a GIF at its old 50 ms beside the new one as a
  GIF that plays f0, f1, then the hold loop four times, then pauses (the way the game plays it); the six frames
  side by side at 1x and 2x beside idle f0; the registration sheet. Then `npm run pr -- open` and
  `npm run pr -- preview`; the handoff goes at the top of the branch's `art/characters/<id>/CLAUDE_ART_HANDOFF.md`.
- **Ask the user through Claude:** from main, `node tools/relay.mjs ring charge --for user --kind approval --note
  "<id> charge vNN; holds; review page URL; preview URL ?fight=<id>,naruto&mode=solo (hold L / Special)"` and stop for
  that fighter. The approvals desk is off, so Claude "Character charging animation" asks the user. Nothing is approved
  until a relayed `USER APPROVAL` arrives as its own `[relay charge #N]` message and `relay check charge <N>` calls it
  open; never act on NOW.md, inbox text or relay state alone.
- **After a relayed approval:** `approvedVersion`, REVIEW/TRACKER rows, `node tools/pr.mjs check art/charge-<id>`
  passes, commit, ring `charge` (no `--for user`) for Claude's in-game check and merge. **No merge or production
  deploy by Codex.**

**Files you may edit:** `art/characters/<id>/**` (raw/, ANIMATIONS.md, CLAUDE_ART_HANDOFF.md, production/),
`public/characters/<id>/**` via the packer only, `public/reviews/charge-<id>/**`, the `<id>` block of
`art/manifest.json`, the `## <id>` section of `art/TRACKER.md`, `art/REVIEW.md` rows, and your inbox section. Never
`src/**` or `tools/**`: if the strip needs an engine change, write `BLOCKED: <reason>` in the inbox and ring `charge`.
