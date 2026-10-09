# Sasuke — ChatGPT image prompts (copy-paste, in order)

Every prompt here is ready to paste into the ChatGPT image generator. The poses come from
[ANIMATIONS.md](ANIMATIONS.md), and the design and palette from [CHARACTER.md](CHARACTER.md). If a
prompt and ANIMATIONS.md ever disagree, ANIMATIONS.md wins. Fix the prompt.

## How to run a session (user + Codex)

1. **One chat per character** (name it "GCD Sasuke sprites"). Start a fresh chat when it drifts or
   after about 6 strips (long chats drift). Every chat starts with the **PRIMER** (below) as the
   first message plus the reference images that exist so far: `reference/model_sheet.png`,
   `reference/expressions.png`, `reference/idle_approved.png`. Every strip prompt also restates the
   palette and pixel rules, so it works on its own.
2. Paste one strip prompt per message. Ask for a **landscape** image for 2 or more poses, and a
   **square** one for single poses.
3. Save the result as `art/characters/sasuke/raw/<anim>.png` using the exact, case-sensitive
   animation name (`jumpUp.png`, `airLight1.png`, `beamFire.png`, ...).
4. Codex runs `npm run sprites sasuke`, reads the report (frame-count mismatches, clipping,
   palette warnings), previews the strip in the Sprite Lab (`/sprites.html`), and sets the status
   to `raw` → `packed` in `art/TRACKER.md` and `art/manifest.json`. The user marks it `approved`
   after playing with it.
5. For 7 to 8 pose strips, if ChatGPT crams or overlaps the poses, ask for poses 1–4 and 5–8
   separately and save them as `raw/_parts/<anim>_A.png` and `raw/_parts/<anim>_B.png` (stitching:
   see `art/PIPELINE.md`).
6. A bad strip (wrong pose count, off-model, wrong direction) gets **regenerated**, not patched.
   Use the fix-up lines at the end of this file.
7. If ChatGPT refuses or produces a generic character, switch to the **fallback wording**
   (section F).

**Generation order** (same steps as `generationOrder` in `art/manifest.json`; core first, so the
game can switch to the custom sheet early):

| step | images | save to |
|---|---|---|
| 1 | model sheet: turnaround (front, 3/4 right, side, back) + fighting stance + palette swatches | `reference/model_sheet.png` |
| 2 | expression sheet (incl. Sharingan) | `reference/expressions.png` |
| 3 | `idle` (also copy the keeper to `reference/idle_approved.png`) | `raw/idle.png` |
| 4 | `run` | `raw/run.png` |
| 5 | core attacks: `light1`, `light2`, `light3`, `light4`, `heavy`, `airLight1`, `airHeavy` | `raw/<anim>.png` |
| 6 | reactions: `guard`, `hurtHigh`, `launched`, `down`, `getup` | `raw/<anim>.png` |
| 7 | specials: `charge`, `beamCharge`, `beamFire`, `special` | `raw/<anim>.png` |
| 8 | rest of the core: `dash`, `jumpUp`, `jumpFall`, `land`, `win` | `raw/<anim>.png` |
| 9 | optional: `throw`, `intro` (do these two first), `backDash`, `superDash`, `jumpSquat`, `airLight2`, `airLight3`, `block`, `hurtLow`, `spin`, `airRecover`, `vanish`, `stagger`, `ko`, `taunt` | `raw/<anim>.png` |
| 10 | shared VFX (once for all characters) | see `art/vfx/PROMPTS.md` |
| 11 | UI: portrait, cut-in, select art | `ui/<name>.png` (the packer removes the magenta and fits the size) |
| extra | optional Sasuke effect art (`sasuke_<effect>`, engine support pending) | `art/vfx/raw/_proposed/sasuke_<effect>.png` |

---

## PRIMER (paste once at the start of every chat)

```text
I'm making a personal, non-commercial fan-made 2D fighting game demo and I need anime fan-art pixel sprites. In this chat I'll ask for one image at a time. Follow these rules in every image unless I say otherwise.

CHARACTER: Sasuke Uchiha from Naruto, Part 1 (genin era) outfit, as an anime fan-art sprite. A slim, pale 12-year-old ninja boy. Spiky black hair with a blue sheen: thick spikes swept backward and up behind his head, two long bangs framing his face down to the jaw, shorter bangs over the headband. Sharp, narrow dark eyes, aloof serious expression. Navy-blue cloth forehead protector with a steel plate engraved with a leaf-swirl symbol, knotted at the back with two short tails. Dark-navy short-sleeved shirt with a tall stand-up collar up to the jaw (a red-and-white round fan crest on the upper back). White arm warmers from elbow to wrist. White shorts ending just above the knee. White bandage wraps on both shins. A small dark-navy holster strapped over a white bandage on his right thigh. Dark-navy open-toed ninja sandals. Match the attached reference images exactly: same design, proportions and colors.

STYLE: hi-res pixel art for a modern HD-2D fighting game. Crisp hard pixels on one consistent grid, every pixel the same size. No anti-aliasing, no blur, no gradients, no dithering, no noise, no painterly texture. A 1-pixel dark outline (#141018). 3-4 tone cel shading per material, key light from the upper front right. Classic early-2000s shonen anime look: sharp angular face, narrow eyes, bold clean shapes. Anime-accurate proportions, slightly stylized: about 4.25 heads tall, slim and wiry.

PALETTE (use only these): outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband cloth #3e548f #283a6c #162044; steel plate #ffffff #e4eaf4 #b8c2d2 #76829a; white cloth #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36, soles #2a2228; eyes #2c2c40; mouth #5a1a22; red (Sharingan, crest) #d81e28 #7c0c16.

VIEW: always facing RIGHT in a 3/4 view: body turned about 35 degrees toward the viewer, head turned a little more so both eyes show, camera slightly above. His RIGHT arm and leg are nearest the viewer. Fighting stance: left foot and left hand forward. Punches and kicks travel straight to the right, horizontally.

SPRITE STRIP FORMAT: one animation per image. Poses in ONE horizontal row, left to right in order, evenly spaced with clear empty gaps (no overlapping). Same character size in every pose, feet on the same baseline (airborne poses may sit higher), whole body visible, nothing cut off. Fast motion is shown with solid smear shapes, never blur.

BACKGROUND: one flat solid magenta #FF00FF everywhere (never use magenta on the character). No ground shadow, no text, no numbers, no labels, no frame borders, and no effects (no lightning, fire, aura, dust, glow or speed lines) unless I ask for them.

Reply with the image only. Say OK and wait for my first request.
```

---

## Step 1. Model sheet (turnaround + stance + palette) → `reference/model_sheet.png`

Attach nothing the first time. Regenerate until the design is right, then attach the keeper to
every later prompt.

```text
Character model sheet, anime fan-art pixel art: Sasuke Uchiha (Naruto, Part 1 genin outfit), following all the rules above. Landscape image. Five full-body figures in one row, the same scale: four turnaround views standing relaxed with arms slightly away from the body: (1) front view; (2) 3/4 view facing RIGHT, the main game view: body turned 35 degrees toward the viewer, head turned a bit more so both eyes show, camera slightly above; (3) side profile facing right; (4) back view clearly showing the red-and-white round fan crest on the upper back of the shirt and the headband knot with two short tails; then (5) his fighting stance in the same 3/4 view facing right: low and compact, knees bent, left foot forward, left hand forward at chin height as an open knife-hand, right fist in front of the chest, cold glare. Below the figures, one row of plain square color swatches using exactly the palette colors. Show clearly: black hair with blue sheen highlights and spikes swept back, two long bangs to the jaw, tall shirt collar, white arm warmers, white shorts, shin bandages, holster on the right thigh, open-toed sandals. Flat magenta #FF00FF background, no text, no labels.
```

## Step 2. Expression sheet → `reference/expressions.png`

Attach `model_sheet.png`.

```text
Expression sheet of the same character, same pixel style and palette. Landscape image. 8 head-and-shoulder busts in a 4 by 2 grid, all in 3/4 view facing right, evenly spaced: 1) neutral cold glare, lids low, mouth a flat line; 2) smirk "Hmph": one mouth corner raised, half-lidded eyes, chin up; 3) focused/angry: brows hard down, eyes narrowed; 4) shout: mouth open with teeth, brows down; 5) pain: eyes squeezed shut, teeth gritted; 6) eyes shut, straining (blocking a hit); 7) dazed: half-lidded unfocused eyes, mouth slightly open; 8) Sharingan glare: glowing red irises (#d81e28) with a thin dark-red ring, a black pupil and three small black comma-shaped marks (tomoe) evenly spaced around the pupil, intense stare. Flat magenta #FF00FF background, no text.
```

---

## Steps 3–9. Animation strips → `raw/<anim>.png`

Attach `model_sheet.png`, `expressions.png` and, once it exists, `idle_approved.png`. Every
prompt starts with the same rules line, so each one also works on its own.

### Step 3

#### idle (8 poses) · core

```text
SASUKE SPRITE STRIP: idle, 8 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 8 poses, left to right, evenly spaced with empty gaps, facing RIGHT in 3/4 view (his right arm and leg nearest the viewer), same size in every pose, feet on one baseline, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: fighting-stance breathing loop. Base pose: low compact stance, knees bent, left foot forward pointing right, right foot back and turned out, torso leaning slightly forward; LEFT hand forward at chin height as an open knife-hand with fingers together; RIGHT fist in front of his chest; chin down, cold narrow-eyed glare to the right, mouth a flat line. The feet are IDENTICAL in all 8 poses; only the upper body moves, very subtly.
Pose 1: base pose. Pose 2: inhaling, chest and shoulders slightly up. Pose 3: top of the breath, left-hand fingers relax slightly, bangs swing slightly back. Pose 4: hold the top. Pose 5: exhaling. Pose 6: same height as pose 1. Pose 7: lowest point, knees bend a little more, bangs swing slightly forward. Pose 8: rising back toward pose 1.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

### Step 4

#### run (8 poses) · core

```text
SASUKE SPRITE STRIP: run, 8 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 8 poses, left to right, evenly spaced with empty gaps, facing RIGHT in 3/4 view (his right arm and leg nearest the viewer), same size in every pose, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: classic anime ninja run cycle, running to the right. Torso leans about 40 degrees forward, head up looking ahead, BOTH arms trailing straight back behind him, hands open, fingers together. Bangs and headband tails stream back to the left.
Pose 1: left leg reaching forward, ball of the foot touching the ground, right leg pushing off behind. Pose 2: weight on the left leg, knee bent, body lowest. Pose 3: right knee swinging forward past the left leg, body rising. Pose 4: both feet off the ground, right knee forward and up, left leg extended back, body highest. Pose 5: right leg reaching forward touching the ground, left leg pushing off. Pose 6: weight on the right leg, body lowest. Pose 7: left knee swinging forward. Pose 8: both feet off the ground, left knee forward and up, right leg extended back.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

### Step 5 · core attacks

#### light1 — jab (7 poses) · core

```text
SASUKE SPRITE STRIP: light1, 7 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 7 poses, left to right, evenly spaced with empty gaps, facing RIGHT in 3/4 view (his right side nearest the viewer), same size in every pose, feet on one baseline, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: fast jab with the LEFT (lead) fist, punching straight to the right at face height.
Pose 1: from his fighting stance, the left hand closes into a fist and pulls back toward the chest. Pose 2: left fist launching forward, elbow half extended. Pose 3: left arm FULLY EXTENDED horizontally to the right at shoulder height, left shoulder forward, chin tucked behind it, right fist guarding the chin, front foot stepped forward; a solid tapered smear shape trails behind the fist (no blur); angry glare. Pose 4: same full extension without the smear. Pose 5: fist pulling back halfway. Pose 6: left hand back near the guard, opening. Pose 7: back in the fighting stance.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### light2 — rear straight (7 poses) · core

```text
SASUKE SPRITE STRIP: light2, 7 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 7 poses, left to right, evenly spaced with empty gaps, facing RIGHT in 3/4 view (his right side nearest the viewer), same size in every pose, feet on one baseline, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: powerful straight punch with the RIGHT (rear, near) fist, straight to the right at chin height.
Pose 1: hips coil, right fist cocked beside his right cheek, weight on the back leg. Pose 2: hips and shoulders turning forward, right fist driving past his chin. Pose 3: right arm FULLY EXTENDED horizontally to the right at shoulder height, crossing in front of his body, torso turned almost to profile, right heel lifted, left hand pulled back to the chest, teeth showing; a solid smear shape trails behind the fist (no blur). Pose 4: same full extension without the smear. Pose 5: right fist pulling back. Pose 6: fist back in front of the chest. Pose 7: back in the fighting stance.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### light3 — front kick (7 poses) · core

```text
SASUKE SPRITE STRIP: light3, 7 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 7 poses, left to right, evenly spaced with empty gaps, facing RIGHT in 3/4 view (his right side nearest the viewer), same size in every pose, supporting foot on one baseline, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: snapping front kick with the RIGHT leg to the opponent's stomach, straight to the right.
Pose 1: weight shifts onto the left (front) leg, right knee starts to lift. Pose 2: right knee chambered high, thigh horizontal, shin hanging down, arms in guard. Pose 3: right leg FULLY EXTENDED straight to the right at stomach height, ball of the foot forward, torso leaning back slightly, right arm swung back for balance, left fist guarding, standing tall on the ball of the left foot; a solid smear arc from the knee to the foot (no blur); angry face. Pose 4: same extension without the smear. Pose 5: knee folding back in. Pose 6: right foot setting down, arms back to guard. Pose 7: fighting stance.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### light4 — spinning roundhouse (8 poses) · core

```text
SASUKE SPRITE STRIP: light4, 8 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 8 poses, left to right, evenly spaced with empty gaps, facing RIGHT, same size in every pose, supporting foot on one baseline, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: spinning roundhouse kick finisher, the right leg sweeps around to strike the opponent's head on the right.
Pose 1: wind-up, torso twisting, arms coiled, knees bent. Pose 2: spinning on the ball of the left foot, his BACK now faces the viewer (the red-and-white fan crest is visible), right leg lifting, head turning to look over his shoulder at the target. Pose 3: back to the viewer, right knee chambered high and turned over. Pose 4: right leg FULLY EXTENDED high and horizontal to the right, shin and instep at head height, torso leaning back to counterbalance, arms flung out, shouting; a big solid crescent smear from below up to the foot (no blur). Pose 5: same extension without the smear, bangs and tails whipping forward. Pose 6: leg dropping, rotation following through. Pose 7: right foot setting down. Pose 8: fighting stance.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### heavy — rising uppercut (8 poses) · core

```text
SASUKE SPRITE STRIP: heavy, 8 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 8 poses, left to right, evenly spaced with empty gaps, facing RIGHT in 3/4 view (his right side nearest the viewer), same size in every pose, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: rising uppercut launcher with the RIGHT fist and a small hop. The fist travels UP AND FORWARD in front of his face (it hits the chin of an opponent standing to the right), not straight up beside his head.
Pose 1: crouch begins, right fist dropping low beside the hip. Pose 2: deepest crouch, right fist low behind the hip, left hand guarding, eyes on the target. Pose 3: legs exploding upward, right fist starting to rise in front of the stomach. Pose 4: heels off the ground, right fist driving up and forward in front of his face, arm about 60 degrees above horizontal, torso leaning back slightly, shouting; a solid crescent smear from low to the fist (no blur). Pose 5: airborne peak, right arm up and forward, fist just above the top of his hair and no higher, bangs and tails pulled down. Pose 6: coming down, arm lowering, knees bending. Pose 7: landing crouch. Pose 8: fighting stance.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### airLight1 — air jab (5 poses) · core

```text
SASUKE SPRITE STRIP: airLight1, 5 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 5 poses, left to right, evenly spaced with empty gaps, facing RIGHT in 3/4 view, same size in every pose, all poses in mid-air, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: mid-air jab with the LEFT fist, straight to the right at chest height. Air pose: knees bent and tucked (left knee forward and up, right leg hanging slightly back), arms in guard.
Pose 1: air pose, left fist pulled back to the chest. Pose 2: left arm FULLY EXTENDED horizontally to the right at chest height, torso leaning forward slightly, angry glare; a solid smear trails the fist (no blur). Pose 3: same extension without the smear. Pose 4: fist pulling back. Pose 5: air pose.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### airHeavy — double-fist spike (6 poses) · core

```text
SASUKE SPRITE STRIP: airHeavy, 6 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 6 poses, left to right, evenly spaced with empty gaps, facing RIGHT in 3/4 view, same size in every pose, all poses in mid-air, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: mid-air double-fist hammer blow that spikes the opponent down.
Pose 1: both hands clasped together (fingers interlocked) raised overhead, torso arching back, knees tucked, shouting. Pose 2: wind-up peak, arched further, clasped fists behind his head. Pose 3: torso whips forward, both straight arms swing DOWN AND FORWARD, the clasped fists in front of and below his chest, on the right; a large solid crescent smear from overhead down to the fists (no blur). Pose 4: same smash pose without the smear, fists slightly lower. Pose 5: arms rising, body uncurling. Pose 6: neutral mid-air pose, knees bent, arms in guard.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

### Step 6 · reactions

#### guard (2 poses) · core

```text
SASUKE SPRITE STRIP: guard, 2 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 2 poses, evenly spaced with empty gaps, facing RIGHT in 3/4 view, same size, feet on one baseline, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: blocking. Both forearms with the white arm warmers CROSSED in an X in front of his face and upper chest, right forearm in front, fists closed, elbows down; chin tucked, eyes glaring over the crossed arms; knees bent, weight back, left foot forward.
Pose 1: as described. Pose 2: identical but the body one step lower (breathing) and the bangs slightly shifted.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### hurtHigh (3 poses) · core

```text
SASUKE SPRITE STRIP: hurtHigh, 3 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 3 poses, evenly spaced with empty gaps, facing RIGHT in 3/4 view, same size, feet on one baseline, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: hit in the face by an attack from the right.
Pose 1: head snapped back with the chin up, torso arched back, both arms flung back and out with open hands, one foot slipping, eyes squeezed shut, mouth open in pain, bangs and headband tails whipping forward to the right. Pose 2: about one third recovered, head coming down, arms swinging back in. Pose 3: mostly recovered, still wincing, arms returning toward guard.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### launched (2 poses) · core

```text
SASUKE SPRITE STRIP: launched, 2 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 2 poses, evenly spaced with empty gaps, still facing RIGHT, same size, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: knocked flying backward to the left by a big hit from the right. Body arched back on a diagonal, about 55 degrees from upright (head to the upper left, feet to the lower right), arms flung up and back past his head, legs bent and trailing forward, eyes shut, mouth open, bangs and tails whipping to the right.
Pose 1: as described. Pose 2: arms and legs in slightly different flailing positions.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### down (2 poses) · core

```text
SASUKE SPRITE STRIP: down, 2 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 2 poses, evenly spaced with empty gaps, side view, same scale, lowest body points on one baseline, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: slammed into the ground on his back, head on the LEFT and feet on the RIGHT.
Pose 1: his back hits the floor, shoulders down, hips and legs still raised up to the right, arms flung out, eyes shut, mouth open, hair splashing out. Pose 2: lying flat on his back, arms out at his sides, legs straight, eyes closed, grimacing.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### getup (5 poses) · core

```text
SASUKE SPRITE STRIP: getup, 5 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 5 poses, left to right, evenly spaced with empty gaps, facing RIGHT, same scale in every pose, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: kip-up from lying on his back (head on the left) to standing.
Pose 1: lying on his back, knees pulled to his chest, palms planted beside his head, eyes open and angry. Pose 2: legs kicking up and over toward the upper right, rolling onto his shoulders, hands pushing off. Pose 3: springing up into the air, torso tilted back, legs folding under him, arms out. Pose 4: landing in a crouch, arms coming into guard. Pose 5: his fighting stance (left foot forward) with an angry glare.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

### Step 7 · specials

#### charge (4 poses) · core · Sharingan

```text
SASUKE SPRITE STRIP: charge, 4 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 4 poses, evenly spaced with empty gaps, facing RIGHT in 3/4 view, same size, feet on one baseline, flat magenta #FF00FF background, no shadow, no text, and NO aura or effects (the game adds them).
Animation: powering up his energy, looping. Wide stance with feet well apart and knees bent, arms down and out at his sides with fists clenched and shaking, torso leaning slightly back, head tilted up, shouting. His eyes are the Sharingan: glowing red irises with small black comma marks. Hair, bangs and headband tails blown UPWARD by a rising wind, shirt hem fluttering up.
Pose 1: as described, shifted slightly left. Pose 2: shifted slightly right, bangs and tails in a new flicker shape. Pose 3: slightly left, fists a bit higher. Pose 4: slightly right, another hair flicker shape.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### beamCharge — LIGHTNING LANCE charge (3 poses) · core · Sharingan

```text
SASUKE SPRITE STRIP: beamCharge, 3 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 3 poses, evenly spaced with empty gaps, facing RIGHT in 3/4 view, same size, feet on one baseline, flat magenta #FF00FF background, no shadow, no text, NO lightning or aura (the game adds them).
Animation: charging his ultimate lightning attack, looping. Deep front stance with the left foot forward and knees bent, torso twisted back away from the right, RIGHT HAND held low and back at his right hip, open, palm down, fingers spread; LEFT HAND gripping his right wrist; head turned toward the opponent on the right; Sharingan eyes (glowing red with small black comma marks), teeth gritted; hair, bangs and headband tails blown up and back, shirt hem fluttering.
Pose 1: as described. Pose 2: trembling slightly forward, bangs and tails in a new flicker shape. Pose 3: trembling slightly back, right fingers flexing.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### beamFire — LIGHTNING LANCE fire (3 poses) · core · Sharingan

```text
SASUKE SPRITE STRIP: beamFire, 3 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 3 poses, evenly spaced with empty gaps, facing RIGHT in 3/4 view, same size, feet on one baseline, flat magenta #FF00FF background, no shadow, no text, NO beam or lightning (the game draws the beam).
Animation: firing his lightning spear beam to the right, looping. Deep lunge: left leg forward and bent, right leg straight back, torso leaning forward. RIGHT ARM THRUST STRAIGHT FORWARD to the right at chest height as a spear-hand (fingers straight and together, palm down); LEFT HAND gripping the right forearm just behind the wrist to brace it; head behind the right shoulder, Sharingan eyes (glowing red with small black comma marks), mouth open shouting. Hair, bangs, headband tails and shirt hem blown back to the left by the recoil.
Pose 1: as described. Pose 2: recoil, whole body pushed slightly back, bangs and tails in a new flicker shape. Pose 3: pushing slightly forward again.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### special — CHIDORI (8 poses) · core · Sharingan

```text
SASUKE SPRITE STRIP: special, 8 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 8 poses, left to right, evenly spaced with empty gaps, facing RIGHT in 3/4 view (his right arm nearest the viewer), same size in every pose, flat magenta #FF00FF background, no shadow, no text. Draw NO lightning: his right hand is open and empty (the game adds the lightning effect).
Animation: his signature lightning-hand rush (Chidori). In every pose his eyes are the Sharingan: glowing red irises with small black comma marks.
Pose 1: eyes flare red, feet planted, knees starting to bend, right arm snapping down and back, left hand reaching across his waist toward the right wrist. Pose 2: deep crouch, torso leaning forward, RIGHT ARM STRAIGHT DOWN AND BACK behind his right leg, palm open facing the floor, fingers spread, left hand gripping the right forearm, teeth gritted, hair and bangs blown upward. Pose 3: same crouch with more tension, shoulders hunched, right fingers clawed. Pose 4: sprinting to the right in a low ninja run, torso leaning about 45 degrees, head up glaring ahead, RIGHT ARM TRAILING STRAIGHT BACK AND LOW with the open hand just above the floor behind him, left arm swung back, left leg forward. Pose 5: same sprint with the legs swapped, right hand still trailing low behind. Pose 6: thrust: hips and shoulders whip forward, the RIGHT ARM SNAPS STRAIGHT FORWARD to the right at chest height as a spear-hand with straight fingers, left leg lunging forward, right leg straight back, shouting; a solid smear arc from the low trailing position up to the hand (no blur). Pose 7: impact pose: deepest lunge, right arm fully extended forward at chest height as if driven into an opponent, head down behind his shoulder, teeth gritted, bangs and tails whipping forward. Pose 8: recovering, arm still forward but bending, weight shifting back.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

### Step 8 · rest of the core

#### dash (2 poses) · core

```text
SASUKE SPRITE STRIP: dash, 2 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 2 poses, evenly spaced with empty gaps, facing RIGHT in 3/4 view, same size in both, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: very low, fast forward dash to the right. Torso leaning about 50 degrees forward, head up glaring ahead, left knee bent under his chest, right leg extended straight back with the toes dragging, both arms trailing straight back. Hair, bangs and headband tails streaming back hard.
Pose 1: as described. Pose 2: stride slightly wider, bangs and headband tails in a different flutter shape.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### jumpUp (2 poses) · core

```text
SASUKE SPRITE STRIP: jumpUp, 2 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 2 poses, evenly spaced with empty gaps, facing RIGHT in 3/4 view, same size in both, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: rising in a jump. Knees tucked high (left knee near the chest, right knee a bit lower), torso upright, RIGHT arm raised up and forward with a closed fist at the height of the top of his hair, left arm down and back, head tilted slightly up, cold glare. Bangs and headband tails dragged DOWNWARD by the upward motion.
Pose 1: as described. Pose 2: knees and right arm slightly lower, bangs and tails fluttering differently.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### jumpFall (2 poses) · core

```text
SASUKE SPRITE STRIP: jumpFall, 2 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 2 poses, evenly spaced with empty gaps, facing RIGHT in 3/4 view, same size in both, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: falling from a jump. Legs extending down (left leg slightly forward, right leg slightly back, both slightly bent, toes pointed down), arms out for balance (right arm out forward and up, left arm out back, hands open), cold glare. Bangs, hair tips and headband tails LIFTED UPWARD by the air, shirt hem lifted.
Pose 1: as described. Pose 2: arms slightly higher, bangs and tails fluttering differently.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### land (2 poses) · core

```text
SASUKE SPRITE STRIP: land, 2 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 2 poses, evenly spaced with empty gaps, facing RIGHT in 3/4 view, same size, feet on one baseline, flat magenta #FF00FF background, no shadow, no text, no effects.
Pose 1: landing impact crouch, knees deeply bent, torso leaning forward, arms out forward and down for balance, bangs swinging down past their rest position. Pose 2: rising halfway back into his fighting stance (left foot forward), arms returning to guard, bangs settling.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### win (4 poses) · core

```text
SASUKE SPRITE STRIP: win, 4 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 4 poses, evenly spaced with empty gaps, same size, feet on one baseline, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: cool victory pose, looping. 3/4 BACK VIEW: his back faces the viewer, the red-and-white round fan crest clearly visible on his upper back, standing upright as if about to walk away into the distance on the right. His head is turned over his RIGHT shoulder, glancing back at the viewer with a smirk (one dark eye visible). His RIGHT hand is raised beside his head at head height with the index and middle fingers up (a casual two-finger salute), never higher than the top of his hair. Left hand relaxed at his side.
Pose 1: as described. Pose 2: bangs, headband tails and shirt hem fluttering in a breeze. Pose 3: the two fingers flick forward slightly (salute). Pose 4: settling, another flutter shape.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

### Step 9 · optional (Sasuke tip: do `throw` and `intro` first, they show up every match)

#### throw — FIREBALL (4 poses) · optional (high priority) · Sharingan

```text
SASUKE SPRITE STRIP: throw, 4 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 4 poses, left to right, evenly spaced with empty gaps, facing RIGHT in 3/4 view, same size, all poses in mid-air, flat magenta #FF00FF background, no shadow, no text, and NO fire (the game draws the fireball).
Animation: mid-air fire-breathing technique (Great Fireball). Sharingan eyes in every pose (glowing red with small black comma marks). Air pose: knees bent and tucked.
Pose 1: inhaling, torso leaning back, chest puffed, cheeks full, both hands forming a hand-seal at his chin (fingers interlaced, both index and middle fingers pointing up together). Pose 2: exhaling hard: torso and head lunge forward and down toward the right, mouth wide open and round as if blowing, right hand raised beside his lips with index and middle fingers up, left arm swung back, bangs whipping back. Pose 3: still blowing with the mouth less open, body drifting back from the recoil, legs extending. Pose 4: neutral mid-air pose, hands lowering, mouth closed.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### intro (4 poses) · optional (high priority)

```text
SASUKE SPRITE STRIP: intro, 4 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 4 poses, evenly spaced with empty gaps, facing RIGHT in 3/4 view (body turned a bit more toward the viewer), same size, feet on one baseline, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: pre-fight attitude loop. Standing upright with straight legs, feet slightly apart, weight on the right leg, ARMS FOLDED across his chest (right forearm over the left), chin slightly raised, looking down his nose at the opponent on the right with half-lidded dark eyes and a one-sided smirk. A light breeze moves his bangs and headband tails.
Pose 1: as described. Pose 2: breathing, slightly up, bangs and tails swaying. Pose 3: head tilting slightly (smug), tails fluttering further. Pose 4: settling back toward pose 1.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### backDash (3 poses) · optional

```text
SASUKE SPRITE STRIP: backDash, 3 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 3 poses, evenly spaced with empty gaps, facing RIGHT in 3/4 view the whole time, same size, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: quick hop backward to the LEFT while still facing right.
Pose 1: push-off: knees bent, pushing off the ball of the front foot, torso upright leaning slightly back, forearms rising into guard. Pose 2: airborne, knees tucked, leaning back, arms forward for balance, bangs and headband tails whipping forward to the right. Pose 3: landing on the ball of the back foot, knees absorbing, arms returning to his stance.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### superDash (2 poses) · optional

```text
SASUKE SPRITE STRIP: superDash, 2 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 2 poses, evenly spaced with empty gaps, same size, flat magenta #FF00FF background, no shadow, no text, no speed lines or effects.
Animation: flying horizontally to the right like a missile. Body almost horizontal, head forward and slightly up with eyes locked on the target, RIGHT arm thrust straight forward with a closed fist leading the shape, left arm tucked along his side pointing back, legs together trailing behind with slightly bent knees and pointed toes, angry face, hair, bangs and tails streaming straight back.
Pose 1: as described. Pose 2: knees bent slightly more, shirt hem and tails fluttering differently.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### jumpSquat (1 pose) · optional

```text
SASUKE SPRITE: jumpSquat, 1 pose, centered. Square image. Same character, outfit, palette and hard-pixel style as the attached references, facing RIGHT in 3/4 view, flat magenta #FF00FF background, no shadow, no text, no effects.
Pose: deep crouch right before jumping: knees bent sharply, left foot forward, torso leaning forward, both arms swung down and back with open hands, head up looking forward and up, focused.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### airLight2 — air front kick (5 poses) · optional

```text
SASUKE SPRITE STRIP: airLight2, 5 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 5 poses, left to right, evenly spaced with empty gaps, facing RIGHT in 3/4 view, same size, all in mid-air, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: mid-air front kick with the RIGHT leg, to the right.
Pose 1: right knee chambered up to his chest, arms in guard. Pose 2: right leg extending STRAIGHT FORWARD to the right, angled slightly down, foot at stomach height of an opponent, torso leaning back, right arm out behind for balance, angry glare; a solid smear arc to the foot (no blur). Pose 3: same kick without the smear. Pose 4: knee folding back in. Pose 5: neutral mid-air pose, knees bent, arms in guard.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### airLight3 — air spinning kick (6 poses) · optional

```text
SASUKE SPRITE STRIP: airLight3, 6 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 6 poses, left to right, evenly spaced with empty gaps, facing RIGHT, same size, all in mid-air, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: mid-air spinning kick that knocks the opponent away to the right.
Pose 1: body twisting away so his back faces the viewer (fan crest visible), left knee chambered. Pose 2: spinning, hips turning over, head spotting the target on the right. Pose 3: LEFT leg fully extended forward to the right at chest-to-head height, body leaning back, right knee tucked, arms flung out, shouting; a big solid crescent smear (no blur). Pose 4: same kick without the smear. Pose 5: leg folding back in. Pose 6: neutral mid-air pose.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### block (2 poses) · optional

```text
SASUKE SPRITE STRIP: block, 2 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 2 poses, evenly spaced with empty gaps, facing RIGHT in 3/4 view, same size, feet on one baseline, flat magenta #FF00FF background, no shadow, no text, no effects.
Pose 1: blocking a heavy hit from the right: forearms still crossed in an X in front of his face but jarred upward, whole body leaning back and pushed back, right heel digging in, eyes shut tight, teeth gritted, bangs and tails blown back to the left. Pose 2: back in his steady crossed-arm guard (forearms crossed in front of his face, chin tucked, glaring over the arms, knees bent).
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### hurtLow (3 poses) · optional

```text
SASUKE SPRITE STRIP: hurtLow, 3 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 3 poses, evenly spaced with empty gaps, facing RIGHT in 3/4 view, same size, feet on one baseline, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: hit in the stomach from the right.
Pose 1: doubled over, torso bent forward about 40 degrees, head down, both arms clutching his stomach, knees bent, eyes wide with tiny pupils, mouth open, bangs swinging down. Pose 2: about one third recovered. Pose 3: rising, wincing, one hand still on his stomach.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### spin (4 poses) · optional

```text
SASUKE SPRITE STRIP: spin, 4 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 4 poses, evenly spaced with empty gaps, same size, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: tumbling head over heels backward through the air after a big hit, balled up with knees to his chest and arms bent in, eyes shut in pain. One full backward rotation, turning COUNTER-CLOCKWISE on screen.
Pose 1: tilted back 30 degrees, head at the upper left. Pose 2: rotated 120 degrees, head pointing down-left. Pose 3: upside down, head at the bottom. Pose 4: rotated 300 degrees, head at the right, coming back upright.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### airRecover (3 poses) · optional

```text
SASUKE SPRITE STRIP: airRecover, 3 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 3 poses, evenly spaced with empty gaps, same size, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: backflip recovery in mid-air, rotating COUNTER-CLOCKWISE on screen.
Pose 1: tucked, knees to his chest, tilted back 60 degrees, eyes open and regaining focus. Pose 2: upside down, fully tucked. Pose 3: almost upright, unfolding: legs extending down, arms out, cool glare, facing right.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### vanish (2 poses) · optional

```text
SASUKE SPRITE STRIP: vanish, 2 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 2 poses, evenly spaced with empty gaps, facing RIGHT in 3/4 view, feet on one baseline, flat magenta #FF00FF background, no shadow, no text, no blur.
Animation: high-speed teleport.
Pose 1: quick crouch, torso leaning forward, arms pulled in, sharp eyes. Pose 2: body stretched a little taller and thinner, up on his toes, arms tight to his sides, hair and tails streaming upward, and the lower half of his body broken into 3 or 4 solid horizontal slices shifted sideways by small amounts (an anime high-speed afterimage), drawn with solid shapes in his own colors, no transparency.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### stagger (4 poses) · optional

```text
SASUKE SPRITE STRIP: stagger, 4 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 4 poses, evenly spaced with empty gaps, facing RIGHT in 3/4 view, same size, feet on one baseline, flat magenta #FF00FF background, no shadow, no text, no effects (no stars or swirls).
Animation: dizzy, looping. Standing almost upright on wobbly knees, arms hanging loose, eyes half-lidded and unfocused, mouth slightly open, headband slightly askew.
Pose 1: torso and head leaning to the right. Pose 2: centered upright. Pose 3: leaning to the left. Pose 4: centered.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### ko (1 pose) · optional

```text
SASUKE SPRITE: ko, 1 pose, centered. Square image. Same character, outfit, palette and hard-pixel style as the attached references, side view, flat magenta #FF00FF background, no shadow, no text, no effects.
Pose: knocked out, lying flat on his back with his head on the LEFT and feet on the RIGHT, completely limp, arms splayed, one knee slightly bent, eyes closed, mouth slightly open, headband slightly askew, hair spread on the ground.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

#### taunt (2 poses) · optional · Sharingan

```text
SASUKE SPRITE STRIP: taunt, 2 poses. Same character, outfit, palette and hard-pixel style as the attached references. ONE horizontal row of 2 poses, evenly spaced with empty gaps, facing RIGHT in 3/4 view (body turned toward the viewer), same size, feet on one baseline, flat magenta #FF00FF background, no shadow, no text, no effects.
Animation: "come at me", looping. Standing upright, chin down, Sharingan eyes (glowing red with small black comma marks) glaring at the opponent on the right with a slight smirk; LEFT arm extended forward at chest height, palm up; right hand relaxed at his side.
Pose 1: left fingers straight, palm up. Pose 2: left fingers curled in (beckoning), headband tails flicking.
Crisp hard pixel art, 1-pixel dark outline (#141018), 3-4 tone cel shading, no anti-aliasing/blur/gradients. Use only these colors: outline #141018; skin #fff1e4 #fbd8bd #e0a283 #c4866a; hair #4a5684 #2e3556 #1e2032 #0e0f18; shirt #4a64ac #2e4282 #1a2650; headband #3e548f #283a6c #162044; plate #ffffff #e4eaf4 #b8c2d2 #76829a; white #ebe8f2 #aaa5c0; shorts #f2f0f8 #d8d6e4 #9893b2; sandals #454f8c #2a2f58 #171a36 #2a2228; eyes #2c2c40; mouth #5a1a22; red #d81e28 #7c0c16.
```

---

## Step 11. UI art → `ui/`

Save each image straight into `ui/` under the name in its heading. The packer removes the magenta
background (portrait and select become transparent), crops and fits it to the exact size with
nearest-neighbor / "mode" sampling (SPEC.md "Per-character UI images"). Optionally keep the
untouched originals as `raw/ui_portrait.png`, `raw/ui_cutin.png` and `raw/ui_select.png` (the
packer skips them). Hand touch-ups go into `ui/<name>.png` at the exact size.

### Portrait → `ui/portrait.png` (96×96, transparent)

```text
Pixel-art fighting-game HUD portrait of the same character (attached references), same palette and hard-pixel style. Square image. Head and shoulders only, 3/4 view facing RIGHT, cold confident glare with dark eyes (not red), brows angled down, mouth a flat line, steel headband plate catching the light, tall collar up to the jaw, long bangs framing the face, back spikes visible behind the head. Bold, readable shapes that still work when shrunk to 96 by 96 pixels. Flat magenta #FF00FF background, no text, no border.
```

### Cut-in eyes → `ui/cutin.png` (480×128, opaque)

```text
Pixel-art super-move cut-in banner for a fighting game, like the eye close-up flash before a super attack in Dragon Ball FighterZ, same character and palette as the attached references. Landscape image: draw ONE very wide horizontal strip across the middle of the canvas, 3.75 times wider than it is tall, and fill the rest of the canvas with flat magenta #FF00FF. Inside the strip: an extreme close-up of both of his eyes and brows filling the strip edge to edge, brows angled down hard, intense stare to the right, both eyes are the Sharingan: glowing red irises (#d81e28) with a thin dark-red ring, a black pupil and three black comma-shaped marks (tomoe) around it; long black-blue bangs cut diagonally across the strip, the edge of the steel headband plate along the top, a few tiny blue-white lightning glints. The face fills the strip; a flat dark navy background band may show only around the eyes and brows. No speed lines (the game adds them). Hard pixels, no blur, no text.
```

### Select art → `ui/select.png` (384×384, transparent)

```text
Pixel-art character select illustration of the same character (attached references), same palette and hard-pixel style, a little more detailed than the sprites. Square image. Full body, facing RIGHT in 3/4 view, low dramatic stance: crouched forward, RIGHT hand held low behind him crackling with a ball of blue-white lightning (draw the lightning in this image: white core, light-blue and blue jagged arcs, a few arcs striking the ground), LEFT hand gripping his right wrist, Sharingan eyes (glowing red with black comma marks) glaring at the viewer's right, hair, bangs and headband tails blown by the energy wind. Whole body visible with some margin. Flat magenta #FF00FF background, no ground shadow, no text.
```

## Extra. Optional Sasuke effect art → `art/vfx/raw/_proposed/sasuke_<effect>.png`

Specs in [MOVES_AND_VFX.md](MOVES_AND_VFX.md) section 4. The engine does not read these yet, and the
packer never reads `_proposed/`. Naming rule for every character: `art/vfx/README.md` "Adding a new
effect".

```text
Pixel-art game effect sprite strip: sasuke_chidoriBall, 8 frames, ONE horizontal row, evenly spaced, each frame a square cell with the effect centered. A dense crackling ball of lightning held in a hand (the hand is NOT drawn): a white-hot core (#ffffff), forked jagged bolts in #d8f0ff, #9ad8ff and #5aa8ff with dark blue #3a54ff tips, 3 to 6 long tendrils whipping out, a different arc pattern in every frame so it flickers when looped. Hard pixels, no blur, no glow gradients, flat magenta #FF00FF background, no text.
```

```text
Pixel-art game effect sprite strip: sasuke_fireballCore, 6 frames, ONE horizontal row, evenly spaced, each frame a square cell with the effect centered. A large roiling ball of fire moving to the RIGHT, flame tongues streaming back to the LEFT, a swirling yellow-white core (#fff4c0, #ffd04a), orange body (#ff9a24, #f05a14), red and dark-red edges (#c42a10, #6a1a0a), the flames churn differently in every frame so it loops. Hard pixels, flat cel-shaded flame shapes, no blur, no gradients, flat magenta #FF00FF background, no text.
```

For `sasuke_chidoriDrag`, `sasuke_chidoriPierce`, `sasuke_fireballBreath`, `sasuke_fireballBlast`,
`sasuke_lanceTip` and `sasuke_sharinganGlint`, reuse the same wording with the description and
colors from the MOVES_AND_VFX.md table. Tinted effects (`sasuke_lanceTip`, `sasuke_sharinganGlint`)
are drawn in white and light grey only.

---

## F. Fallback wording (if ChatGPT refuses or drifts)

1. In the PRIMER, replace the first sentence of CHARACTER (from "Sasuke Uchiha" to "fan-art
   sprite.") with: **"an original anime-style ninja character for my game:"**. Keep the full trait
   description that follows (it has no names). Also remove "fan-made" from the first line if needed.
2. In every prompt, replace "SASUKE" with "NINJA", "Sasuke Uchiha (Naruto, Part 1 genin outfit)"
   with "the character described above", "Sharingan eyes" with "glowing red eyes with three small
   black comma marks around the pupil", "Chidori" with "lightning-hand rush", and "Great Fireball"
   with "fire-breathing technique".
3. Never write "in the style of" a person. If the look drifts, add: **"classic early-2000s shonen
   anime look: sharp angular face, narrow eyes, bold clean line art, flat cel shading."**
4. If a single detail triggers a refusal (the fan crest, the leaf symbol), describe it more
   generically ("a red-and-white round emblem", "a swirl symbol on the plate") rather than dropping
   it.

## Fix-up lines (append to a regeneration)

| problem | add this line |
|---|---|
| wrong number of poses | "Exactly N poses in one row, no more, no less." |
| poses overlap or touch | "Leave a wide empty magenta gap between every pose." |
| size changes between poses | "Every pose is the same character size as pose 1; feet on one baseline." |
| facing left | "He faces RIGHT in every pose (his right arm nearest the viewer)." |
| strike goes up, down or into the screen | "The punch/kick travels straight to the right, horizontally, at <height> height." |
| blurry or painterly | "Clean hard-edged pixel art on one pixel grid, fewer colors, no anti-aliasing, no gradients." |
| shadow, text or effects added | "No ground shadow, no text, no effects; plain flat magenta background." |
| hair brown or grey, or eyes blue | "Hair is black with a blue sheen; eyes are dark (red Sharingan only where I ask)." |
| outfit drifts (no collar, sleeves too long, missing warmers) | "Match the attached model sheet exactly: tall collar, short sleeves, white arm warmers, white shorts, shin bandages." |
| off-model face | "Attach expressions.png. Same face as the reference: narrow sharp eyes, angular jaw." |
