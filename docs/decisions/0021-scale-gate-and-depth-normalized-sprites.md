# 0021. Measured scale gate for every packed frame; depth-normalized fighter sprites in the fight cameras

- Status: Proposed
- Date: 2026-10-10
- Deciders: User, Claude
- Amends: [0010](0010-per-character-body-scale.md) (how "the head stays the same size" is checked)

## Context

The user saw Killua "randomly growing big and small" in fights and asked for the art to be reviewed and the problem
fixed permanently, for the existing fighters and every new one.

The engine never rescales a fighter per animation: `SpriteActor` builds one plane from `frameWidth / pixelsPerUnit`
and only mirrors it, and all four packs have all 42 animations, so the placeholder fallback never mixes in. The size
changes come from two places:

1. **The packed art.** Measured on all 700 packed frames against each fighter's idle, Killua's head silhouette is
   20-34 % smaller in charge, beamCharge, guard, block, superPose and specialForward (the face is the same size; the
   hair mass is 24-34 % narrower), and his whole body is 12-26 % smaller in the air attacks, hurt, launched, down,
   specialUp and heavy. Naruto shows the same pattern at 10-21 %, Sasuke's run, dash, superDash, airLight3 and special
   are 11-22 % too big, Gojo's beamFire, superDash and block 14-18 % too big. Four process gaps let it ship:
   - the scale contract (art/CHARACTER_SCALE.md) measured skull to chin and **excluded hair**, so redraws matched the
     face and drew a much smaller hair mass, which is what makes Killua's head read big;
   - the packer scales each strip so its **tallest frame** matches a body height: a claw, slash arc or kick above
     the head shrinks the whole person (Killua heavy -12 %, Naruto specialUp -21 %);
   - part B of a two-part strip was rescaled by a **factor picked by eye** (Naruto specialUp x0.7: its last two
     frames packed at -45 %);
   - head sizes in some sidecars were **visual estimates** applied as exact factors (Killua hurtHigh/hurtLow -17 %),
     and nothing measured the result: a zero-warning pack was taken as a pass.
2. **Perspective.** Fighters are camera-facing billboards in a real 3D scene, so a fighter nearer the camera is
   drawn bigger: a 1.3-unit sidestep gives 1.10x, a 45° diagonal 1.11x (permanent under the fight camera's yaw
   clamp), fighters lined up in depth 1.23x, one airborne 3 units 1.09x.

ADR 0010 already rejected engine-side scaling of art (it breaks the shared texel grid and the hit/hurt box
correspondence), so the art itself has to be right, and checked by a machine every time it is packed.

## Decision

1. **The approved idle is the reference** (user decision). Every strip of a fighter must draw him at his idle's
   size; Killua keeps his big idle hair and the strips that drifted are redrawn to it.
2. **A measured scale gate in the packer** (`tools/scale-probe.mjs`, run by `tools/pack-sprites.mjs` on every pack):
   every frame's **head silhouette including hair** (the idle's head colours, or `headColors` declared in
   `art/scale/builds.json`; opened, the highest blob, holes filled) and its **shoe area** are compared with the idle
   loop's. Per strip: the median head must be within **±6 %** of the idle's and the head may not move more than
   **12 points inside the strip**. Verdicts: `ok`, `uniform` (head and feet off together: the strip is at the wrong
   size), `drift` (the head is off, the body is not: a drawing problem), `pop` (two sizes in one strip),
   `unmeasured` (tumbling, lying, tucked and afterimage poses, or no head found), `exempt` (a written reason in the
   manifest: `scaleExempt`, `scaleExemptFrames`). Thresholds are data (`spec.scaleGate`).
3. **Staged strictness** (user decision): unapproved strips (a candidate version newer than `approvedVersion`, or any
   strip of a new fighter) fail the pack (exit code 1); approved strips that are off are listed as findings until
   they are fixed (ART-SCALE-02), so art that already ships never blocks a pack. `--strict-scale` (and
   `"scaleGate": "strict"` per character) makes every strip strict; a fighter is flipped to strict once all his
   strips pass. The art pipeline requires a strip to pass `--strict-scale` before its review row is filed.
4. **Auto head fit, opt-in, for `uniform` strips only**: the sidecar `anatomy: { "measurement": "auto-head" }` (or
   `--fit-head`) rescales a raw strip by 1/head (clamped 0.75-1.33) at import. The factor is kept in the frames/
   marker (`autoHead`), so it is measured once and repeat packs are byte-identical; `hitboxes.json` boxes and hand
   anchors of that animation are scaled about the pivot (`"_scale"` records the fit they were measured at). Drift
   and pops are never auto-fitted: rescaling cannot fix a drawing. A fit is still a new version the user approves.
5. **Stitching with a measured factor** (TOOL-008, `npm run stitch`): both parts are measured against the idle and
   the bigger one is scaled down to match; a manual factor needs a written reason.
6. **Evidence for every review**: `npm run scale` writes `art/scale/heads-<id>.png` (every frame's head next to the
   idle's), `scale-report.json` and `scale-baseline.json` (a strip that moves more than 3 % at the same version is
   warned); `--guide` writes `reference/head_scale_guide.png` (the idle at the generation multiplier with crown,
   hair-width and chin lines) for redraw prompts; `npm run lineup` adds guard, charge, airLight1 and hurtHigh rows
   and each fighter's head scale per animation.
7. **Runtime checks stay dev-only**: the packer writes its audit into `anims.json` (`scaleAudit`); `?scaleaudit` logs
   the flagged strips as they play, `scaleReport()` lists them under `?debug`, the test lab draws the idle head size
   around each frame's head. The game never rescales a strip at runtime.
8. **Depth-normalized fighter sprites** (user decision: full compensation in the fight and clash cameras): in those
   camera modes each fighter sprite is scaled by its view depth relative to the camera's look point (clamped,
   smoothed), so both fighters appear the same size wherever they stand; close-ups (focus, KO, victory) keep true
   perspective, and `?depthscale=0` turns it off for comparison. It is **visual only**: hit and hurt boxes and hand
   anchors stay in world units, so gameplay does not depend on the camera. Implemented by ENG-067 (branch
   `feature/sprite-depth-scale`); this ADR records the decision for both.

## Alternatives considered

- **Per-animation runtime scale factors** (an `animScale` in anims.json applied by `SpriteActor`): fixes only
  `uniform` errors, breaks the shared texel grid and the box correspondence. Rejected as in ADR 0010.
- **Skull-to-chin landmarks by eye in a sidecar for every frame** (the ART-SCALE-01 process): slow, unverifiable
  ("visual estimates"), leaves out hair, and produced the Killua hurt and KO errors.
- **Always normalize strips by head size instead of the body-height table**: cannot tell a small head on a normal
  body from a small person, so it would enlarge bodies wherever the generator drew a small head (Killua's charge and
  beamCharge would come out 25 % too big).
- **Multi-scale template matching of the idle head**: colour-independent and more robust to arms over the head, but
  heavier; a phase 2 if the blob probe stays noisy. Exemptions with reasons cover the known false readings today.
- **Strict for every strip at once**: would stop `npm run sprites` for all four approved fighters until ART-SCALE-02
  is done. Rejected for staged strictness.
- **Keep true perspective** or **half compensation**: the user chose full compensation in the fight cameras.

## Consequences

- No strip can ship off-size unnoticed: new art fails the pack, approved art carries a visible finding and a brief
  (`art/scale/SCALE_FIX_BRIEF.md`, ART-SCALE-02) until it is redrawn, re-stitched or re-imported.
- The head and feet numbers are proxies. A raised arm in hair colours, an afterimage or a slash arc can misread; the
  answer is an exemption with a reason plus the heads contact sheet, never a silent pass. Fighters whose hair shares
  body colours need `headColors` (Naruto: the hair yellow; Sasuke: his navy shades).
- Packing takes about a second longer per fighter; `anims.json` grows by about 10 KB (`scaleAudit`), ignored by the
  game outside the dev tools.
- Every review attaches one more image (the heads sheet). Codex follows the gate in AGENTS.md and
  docs/agents/CODEX_PROMPT.md.
- Revisit when the first fighter with a hat, mask or hood is added (the head palette may need a declared list), and
  when all four fighters pass: flip them to `"scaleGate": "strict"`.
