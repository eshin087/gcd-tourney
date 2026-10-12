> **Latest user-approved direction:** [Title-style production contract](scale/title-style-pilot/PRODUCTION_CONTRACT.md). Use its approved neutral/combat cells for these four characters; earlier cast-proportion numbers are superseded. Gates still apply. Inspect actual quantized atlas cells: `--quantize 48` does not refresh `frames/`, so cached frames can misrepresent the candidate.

> **Active baseline, user approved 2026-10-11:** [Approved cast baseline](scale/APPROVED_CAST_BASELINE.md) supersedes historical scale/build numbers below for the full redraw. Preserve common height ratios and individually measured anatomy; old values describe shipped art only. Claude owns formal spec/ADR integration.

# Shared fighter scale and anatomy gate

Status: required production check under ART-SCALE-01. User direction: retain Gojo's taller body and Killua's shorter body, while matching anatomical scale and preventing animation size changes. This operational guide implements ADR 0007 and ADR 0010; it does not change gameplay stats.

## Historical user decision 2026-10-10 (superseded for new redraw): Gojo's build is broadened (ART-GOJ-BUILD)

Gojo reads too thin and too small next to the cast: his packed idle has a 13-year-old's shoulders (deltoid ratio 0.23,
the same as Killua's). Keep his approved head (size, face, blindfold, white hair) and his 215 px standing skeleton;
his build becomes **athletic adult** (see Build classes: deltoid about 78 px, shoulder band 78-86 px on the packed
idle), and all 42 animations are redrawn to it in one art branch. This supersedes "slender adult proportions" in the
section below; the head half of it stands. Brief: `art/characters/gojo/BUILD_REDRAW.md`.

## User correction: preserve the original Gojo

The user reaffirmed that the original approved Gojo head scale and size are preferred. Enlarging Gojo toward a universal 31px head was an incorrect interpretation and is rejected. Preserve model v03 and idle v02 proportions, and use the original packed Gojo as the visual reference for the cast. Height differences remain intentional. Measure approved anatomy before choosing correction factors; numeric targets must not override this direction. Other fighters still require review against this baseline.

## Historical shipped nominal contract (superseded for new redraw)

| Property | Naruto | Sasuke | Killua | Gojo |
|---|---:|---:|---:|---:|
| Standing skeleton: soles to skull crown, px | 200 | 200 | 182 | 215 |
| Skull crown to chin, excluding hair, px | 31 nominal, review against Gojo | same | same | preserve approved reference |
| Nominal heads tall | 6.45 | 6.45 | 5.87 | approved proportions |
| pixelsPerUnit | 128 | 128 | 128 | 128 |
| Cell / feet pivot | 256x256 / [128,240] | same | same | same |
| Canon height (rule input) | 166 cm | 168 cm | 158 cm, child | 190+ cm, capped |
| Build class | athletic teen | athletic teen | child | athletic adult |
| Deltoid width, px (DR, by eye) | ~62 (0.31) | ~60 (0.30) | ~42 (0.23) | target 78 (0.36); idle v02 ~50 |
| Shoulder band, px (SBR) | 77 (0.385, guard) | 87 (0.435, guard) | 64 (0.352, guard) | target 82 (0.38, pockets); idle v02 52 |

A tilted head is measured along its skull-to-chin axis, not its vertical bounding box. Hair, bangs, hats, headbands, weapons, raised hands and effects do not count toward anatomical head or body height. Gojo's narrow adult face and Killua's youthful face remain distinct; equal anatomical scale does not mean identical silhouettes.

## Historical height conversion (superseded for new redraw)

Every fighter's `standingBodyPx` (ADR 0010) comes from his canon height in the depicted era:

1. **`standingBodyPx = round(1.2 × canon height in cm)`** (at ppu 128 one world unit is about 107 cm).
2. **Child:** a character aged 13 or younger in the depicted era takes **× 0.96**. The head keeps the cast's pixel
   density, so a child reads younger with a slightly shorter body for the same head.
3. **Shared standard:** a result within ±5 % of 200 may use the shared 200 px `bodyHeight` table (the gate's
   tolerance), as Naruto and Sasuke do.
4. **Cap:** `standingBodyPx + hair px ≤ 233` (the tallest standing pose with hair fits y 7..240 with the 4 px margin).
   With 15-20 px of hair that is 213-218 px. A fighter whose canon height maps above the cap is drawn **at the cap**
   and shows the rest of his size through his **build class** (next section); never shrink a head to fit a tall body.
5. Any value other than the shared 200 needs the ADR 0010 steps: `standingBodyPx` in the manifest, a scaled
   `bodyHeight` table, a row in its reach table, and Claude's reach / lunge check.

Calibration (the rule reproduces all four declared values):

| fighter | canon height (depicted era) | 1.2 × cm | adjustment | `standingBodyPx` |
|---|---|---|---|---|
| Naruto | 166 cm (Shippuden, 16) | 199 | within ±5 % of 200: shared table | 200 |
| Sasuke | 168 cm (Shippuden, 16) | 202 | within ±5 % of 200: shared table | 200 |
| Killua | 158 cm (series profile at 12; about 13 in the Chimera Ant arc) | 190 | child × 0.96 | 182 |
| Gojo | over 190 cm | 228 | cap: 233 − 18 px hair | 215 |

Examples: a 161 cm teen → 193; a 175 cm adult → 210; a 181 cm adult with 20 px of hair → 217, capped at 213.

## Build classes

Height alone does not make a fighter read his size: Gojo was the tallest and still looked small, because his build
was a child's. Every fighter declares a **build class** in CHARACTER.md §3, and three ratios check it on the packed
idle.

**Measures** (packed idle, final-cell px):

- **DR, deltoid ratio** = deltoid-to-deltoid width ÷ `standingBodyPx`. Measured by eye on idle f0 at 4-5x
  nearest-neighbor: find the shoulder line (the row where the silhouette widens from the neck or collar into the
  shoulders) and, 6 to 10 px below it, measure from the outer edge of the near shoulder to the outer edge of the far
  shoulder. Exclude hands, forearms and anything held in front of the chest; on a raised far arm stop at the shoulder
  cap. About ±3 px. **This is the gate measure.**
- **SBR, shoulder-band ratio** = the widest opaque row in the band 15-30 % below the top of the idle figure (median
  over the idle loop) ÷ `standingBodyPx`. Automatic, but it counts guard hands, so it depends on the idle's hand
  style: measured, a guard idle reads DR + 0.07 to 0.13 (Naruto +0.075, Sasuke +0.13, Killua +0.12), a hands-down or
  hands-in-pockets idle DR + 0.01 to 0.02 (Gojo).
- **MWR, max-width ratio** = the idle's max opaque width ÷ the idle height including hair (median over the loop). An
  automatic screen for a thin-reading silhouette; it also depends on the stance width.

**Classes.** DR bands are the gate; the SBR bands follow from the hand-style offsets above. Only the calibrated rows
are measured; the others are proposals to recalibrate when the first fighter of that class is approved.

| class | who | DR | SBR, guard idle | SBR, hands down / pockets | calibration (2026-10-10) |
|---|---|---|---|---|---|
| child | 13 or younger | 0.21-0.26 | 0.30-0.38 | 0.22-0.28 | **Killua**: DR 0.23 (~42 / 182), SBR 0.352 |
| slim | lanky by design, teen or adult | 0.26-0.29 | 0.34-0.41 | 0.27-0.31 | none yet |
| athletic teen | about 14-18 | 0.29-0.33 | 0.37-0.45 | 0.30-0.35 | **Naruto**: DR 0.31 (~62 / 200), SBR 0.385 · **Sasuke**: DR 0.30 (~60 / 200), SBR 0.435 |
| athletic adult | adult fighters | 0.34-0.39 | 0.42-0.50 | 0.35-0.41 | **Gojo target**: DR 0.36 (78 / 215), SBR 0.38 · Gojo idle v02 (DR 0.23, SBR 0.242) **fails** |
| broad / heavy | big adults, brawlers; anyone above the height cap who must read huge | 0.39-0.46 | 0.47-0.55 | 0.41-0.48 | none yet |

MWR of the cast: Naruto 0.51, Sasuke 0.51, Killua 0.46, Gojo idle v02 0.36 (the known-bad value), Gojo target
0.45-0.49. An idle under 0.42 (0.40 for a child) needs a written reason in its REVIEW row.

**Declaring it.** CHARACTER.md §3 of every fighter states the class and its targets, e.g. "Build class: athletic teen;
deltoid about 62 px (DR 0.31), shoulder band 77 px (guard idle)", and `art/scale/builds.json` carries the same
(`build`, `idleHands`, `canonCm`, `standingPx`, `deltoidPx` by eye) with the class bands, which `npm run lineup`
checks: SBR and MWR it measures, DR it takes from `deltoidPx`.

Rows for the "Nominal contract" table:

| Property | Naruto | Sasuke | Killua | Gojo |
|---|---:|---:|---:|---:|
| Canon height (rule input) | 166 cm | 168 cm | 158 cm, child | 190+ cm, capped |
| Build class | athletic teen | athletic teen | child | athletic adult |
| Deltoid width, px (DR) | ~62 (0.31) | ~60 (0.30) | ~42 (0.23) | target 78 (0.36); idle v02 ~50 |
| Shoulder band, px (SBR) | 77 (0.385, guard) | 87 (0.435, guard) | 64 (0.352, guard) | target 82 (0.38, pockets); idle v02 52 |

## Lineup review (mandatory)

A packed strip can pass every technical check and still look wrong next to the cast, so build and size are always
judged **side by side, at the same pixel density, on one floor line**.

- **When:** with the model sheet (step 1), the idle (step 3), the run (step 4) and the heavy (step 5) of every new
  fighter, and with any build or scale correction of an existing one. Without its lineup, an asset's scale gate is
  pending.
- **What:** one PNG at 2x nearest-neighbor on a flat dark background with a 32 px grid. Columns: the approved cast in
  roster order (Naruto, Sasuke, Killua, Gojo, then later fighters), the new or corrected fighter last. Rows: idle f0,
  run f3 (the flight frame), heavy f3 (the impact). Every cell on the shared floor line (y 240). For a model sheet:
  its 3/4 stance view, downscaled by the sheet's declared multiplier (normally 2, nearest-neighbor), soles on the floor
  line, in the idle row.
- **File:** `art/scale/lineup-<id>-<asset>_vNN.png`, where `vNN` is the version it checks; linked from that REVIEW.md
  row. Make it with **`npm run lineup`** (TOOL-023): `npm run lineup -- --out art/scale/lineup-<id>-idle_vNN.png` for
  packed strips (rows idle f0, run f3, heavy f3, the cast in roster order, a fighter's numbers printed and flagged
  against `art/scale/builds.json`), and for a model sheet `npm run lineup -- --rows idle:0 --candidate <view 5 cropped
  to one figure>.png --scale 0.5 --name <id>-model_sheet_vNN --out art/scale/lineup-<id>-model_sheet_vNN.png` (the
  `--scale` undoes the sheet's 2x).
- **Record** in the REVIEW row's QA notes: `standingBodyPx` (declared and measured), the head check (skull-to-chin
  against its reference), SBR, DR, MWR, the build class and its bands, pass or fail per number.
- **Look for:** age, height and mass read right at a glance; heads at the same pixel density (Gojo keeps his approved
  compact head); the heavy's f3 strike at the same world height as the cast's; no fighter looking small or thin for
  his class.
- **Approval:** "approve <id> idle vNN" (and the model sheet, run and heavy approvals) covers the lineup shown with it.

## The failure to prevent

A constant sprite bounding-box height does not establish constant anatomy. A raised hand makes the bounding box taller, a crouch makes it shorter, and a tucked aerial pose changes both dimensions. Scaling each strip to an estimated pose height can therefore shrink or enlarge the person. A zero-warning pack only proves technical validity; it does not prove scale consistency.

## Before generating a character

1. Record standing-body height, skull-to-chin height, head width, shoulder width and upper/lower limb lengths from the approved neutral reference. Compare at the same pixel density and ground baseline with the existing cast.
2. Use existing approved identity references. Preserve character identity while correcting inconsistent proportions; never match the chibi placeholder.
3. Add the scale paragraph below to every body-animation prompt. Keep its source dimensions identical for parts A/B and all strips. Do not enlarge poses merely because fewer frames share the canvas.
4. Never approve a new baseline solely because its overall height matches. Check the head and the skeleton separately.
5. Record the canon height and the build class, compute `standingBodyPx` with the canon-height rule, write the class
   and its DR / SBR targets into CHARACTER.md §3 and a row into `art/scale/builds.json` before S1. The model sheet's
   3/4 views are checked against the class band (at the sheet's multiplier); the packed idle is the binding measurement.

### Prompt paragraph

Scale lock: preserve the approved character's skull-to-chin length, excluding hair. The nominal 31px value is not permission to enlarge Gojo; his approved proportions take precedence. Standing skeleton height is CHARACTER_BODY_PX. Draw source art at a declared common multiplier (normally 2x: skull 2 * approved skull length, standing skeleton 2 * CHARACTER_BODY_PX). Keep head size, torso width, upper-arm/forearm lengths and thigh/shin lengths constant in every pose and every part. Crouching, curling, jumping, raising a hand and leaning change pose bounds, not camera distance. Do not scale a pose to fill its slot. Leave empty background where needed. Use the same reference camera and perspective throughout. Build lock: keep the approved shoulder width, chest and limb thickness of the model sheet and idle in every pose; turning, slouching, crouching or hands in the pockets change the pose, never the build.

In prompts for any fighter other than Gojo, replace the paragraph's sentence about Gojo with "never enlarge or shrink
the head to reach a number": naming another fighter in a prompt can leak his features into the image.

## Measurement and packing

- Measure every candidate pose before final approval. Save skull crown and chin coordinates, the measured axis length, orientation/occlusion notes, and source version/hash. If either landmark is obscured, mark the measurement uncertain and compare another stable landmark; do not invent a precise value.
- Versioned raw sidecars can provide `anatomy: { measurement: "skull-to-chin", targetHeadPx: 31, sourceHeadPx: [...] }`, with one independently checked source measurement per frame. The packer uses target/source instead of pose-bounds normalization. Cached frames retain that scale; changed sidecars invalidate the source cache.
- `anatomy: { "measurement": "auto-head" }` instead lets the packer measure: it packs the strip as usual, measures it with the scale gate and, only when the verdict is `uniform`, rescales it from the raw by 1/head (clamped 0.75-1.33). An applied factor is stored in the `frames/<anim>/.packer.json` marker, so it is measured once (a request that was not fitted is measured again on every pack while it stands); `hitboxes.json` boxes and hand anchors of that animation are scaled about the pivot with it (`"_scale"` records the fit they were measured at). By-eye `sourceHeadPx` estimates (Killua's hurtHigh/hurtLow/ko) packed 16-17 % small: prefer `auto-head`.
- Strips generated in two parts are joined with `npm run stitch -- <id> <anim> <vNN>`: it measures part B's head against part A's and scales the bigger part down by that factor (art/PIPELINE.md "Long strips (parts)"). Never pick the factor by eye.
- `bodyHeight` remains the legacy fallback and pose planning envelope. It is not proof of anatomy and must not be changed simply to hide drift. Do not change pixelsPerUnit or stretch x/y independently to compensate.
- If correct anatomical scale clips a limb, redraw/repose that frame within the cell. Do not shrink the whole character to fit. Uniform scaling cannot repair a head that is proportionally too large relative to its torso; that needs an image edit.
- Preserve raw `_vNN` sources. Record every visual correction as a new version and retain previous approvals/history. Recompute and visually inspect hitboxes and hand anchors after scale or placement changes.

## Scale gate (automatic)

User decision 2026-10-10 (TOOL-025, [ADR 0021](../docs/decisions/0021-scale-gate-and-depth-normalized-sprites.md)):
Killua grew and shrank in fights because whole strips were packed 12-34 % off his idle. Every packed frame is now
measured against the fighter's **approved idle, which stays the reference** (Killua keeps his big idle hair; the
strips are redrawn to it, not the other way round).

**What is measured** (`tools/scale-probe.mjs`, on the packed cells):

- **Head silhouette, hair included.** Hair is what makes a head read big or small (Killua's hair mass is 51 px wide
  on the idle and 35-42 px in the drifted strips while his face stayed the same), so it counts. The head is the blob
  of the idle's head colours (colours much denser at the top of the idle than in its lower body; a fighter whose hair
  shares body colours declares `headColors` in `art/scale/builds.json`, as Naruto and Sasuke do) and its scale is
  the median of sqrt(area), width and height against the idle loop's median. 1.00 = the idle.
- **A strip is measured from its own pixels and the idle's only** (ART-KIL-PROBE, 2026-10-10): the colours are reduced
  to the idle's own palette before the shipped `--quantize`, so another strip's new colours (a candidate's glow, a
  redraw's new shades) never move the idle's head or anyone else's numbers. `npm run scale` reports the gate's own
  recorded numbers.
- **Feet**: the area of the shoe colours, a second, independent size proxy.

**The contract per strip** (the defaults in `tools/scale-probe.mjs`; an optional `spec.scaleGate` block in `art/manifest.json` overrides them):

| rule | limit |
|---|---|
| median head of the strip vs the idle | within ±6 % (`stripTol` 0.06) |
| largest minus smallest head inside one strip (a pop) | at most 12 points (`popTol` 0.12) |
| hair | strands may move, but the hair MASS stays within ±8 % of the idle's (the ±6 % median plus a frame's noise) |

**Verdicts** (`npm run sprites` report, `anims.json` `meta.scaleAudit`, `npm run scale`):

| verdict | means | fix |
|---|---|---|
| `ok` | head within ±6 %, no pop | none |
| `uniform` | head AND feet off in the same direction (the feet confirm at least a third of it): the strip was drawn or packed at the wrong size | the packer's **auto head fit**: a new version with the same raw pixels and the sidecar `{ "anatomy": { "measurement": "auto-head" } }` (or `--fit-head <id>:<anim>` to try it) |
| `drift` | the head (hair) is off but the body is not | **redraw** the head to the approved idle, with `reference/head_scale_guide.png` attached |
| `pop` | two sizes inside one strip (two parts stitched at different scales) | **re-stitch** with a measured factor (`npm run stitch`), or redraw |
| `unmeasured` | a low-confidence pose (`launched`, `spin`, `down`, `ko`, `airRecover`, `getup`, `jumpSquat`, `vanish`) or no head found | a candidate fails until a person checks it (below) |
| `manual` | an `unmeasured` strip a person compared with the approved idle at one scale, recorded for exactly that version: `"scaleManualQA": { "version": N, "result": "pass", "by": "<who>", "note": "<what was compared>", "evidence": "<image>" }` on the manifest animation (TOOL-ROTATED-ANATOMY) | none; a redraw (another version) is unmeasured again, and a record never turns a measured failure into a pass |
| `exempt` | the manifest says why (`"scaleExempt": "reason"` on the animation, or `"scaleExemptFrames": { "4": "reason" }`), with `"scaleExemptVersion": N`, the strip version it was written for | none; the reason must name what hides or fakes the head (arms over it, an afterimage, a slash arc in hair colours). Another version of the strip (a redraw, a refit) is measured again, with a warning, until someone checks its heads sheet and re-exempts it on purpose |

**Strictness** (staged, so approved art never blocks a pack while it is being fixed):

- A strip that is **not approved yet** (a candidate version newer than `approvedVersion`, or any strip of a new
  fighter) **must pass** the default pack, `node tools/pack-sprites.mjs <id> --quantize 48`: `uniform`, `drift`, `pop`
  or an `unmeasured` strip without a `scaleManualQA` record for its version fails it (`scale gate:` line, exit code 1)
  and **refuses the pack**: nothing is written for that fighter (`public/characters/<id>/` keeps its last pack,
  `frames/` are not written back).
- **Approved reference instead of the idle** (`art/scale/builds.json` fighter `scaleReference`): for a fighter whose idle
  biases the probe, the gate measures every strip and the idle itself against the user-approved reference cells (for the
  title-style batch, the approved combat cell in `art/scale/title-style-pilot`). The idle then needs its own pass. This
  is configuration with evidence (same-pixel comparisons), never a lowered threshold.
- **No old frames under a new version:** hand edits in `frames/<anim>/` made on an older version than the newest
  `raw/<anim>_vNN.png` refuse the pack too (`OLD HAND EDITS SHADOW A NEWER VERSION`): they belong to another drawing.
  Move the folder to `frames/_old/<anim>_vNN/` (never read) or redo the edits on the new version.
- An **approved** strip that is off is listed as a finding (`~` lines) until ART-SCALE-02 fixes it.
- `npm run sprites -- --strict-scale <id>` treats every strip as unapproved, so it fails while any approved strip of
  the fighter is still off (all four fighters until ART-SCALE-02 is done): it is the check before setting
  `"scaleGate": "strict"` on a character, which makes that permanent; `"warn"` reports only.
- `art/scale/scale-baseline.json` records each approved strip's head at its version: a strip whose head moves more
  than 3 % at the same version (a sidecar, `bodyHeight` or packer change) is warned. `npm run scale` adds new rows;
  `npm run scale -- --baseline` accepts an intended change.

**Every strip's review** attaches the heads contact sheet `art/scale/heads-<id>.png` from `npm run scale` (one row
per animation: the idle head, then every frame's head with its box and number; the dotted box is the idle head's
size) and, for size changes, the `npm run lineup` image (its rows now include guard, charge, airLight1 and hurtHigh).
A redraw prompt attaches `reference/head_scale_guide.png` (`npm run scale -- --guide`: the idle at the generation
multiplier with its crown, hair-width and chin lines). The gate does not approve art: the user still approves every
version.

## Acceptance gate

- **Scale gate**: `node tools/pack-sprites.mjs <id> --quantize 48` exits 0 with no `scale gate:` line for the strip
  (see "Scale gate (automatic)"), and its REVIEW row links `art/scale/heads-<id>.png`.
- Skull-to-chin target from approved proportions (nominal 31 px only where visually appropriate); tolerance +/-2 px for clear comparable views. Document foreshortened/occluded exceptions explicitly. An exemption from the automatic gate needs a written reason in the manifest.
- Comparable-frame head axis and width vary by at most 2 px within a loop and across adjacent animation transitions. Hair strands may move, but the hair mass stays within ±8 % of the approved idle's: a smaller hair mass reads as a smaller head.
- Neutral skeleton height stays within 5% of the character's declared height. Review cross-cast anatomy against the original Gojo; preserve his preferred head and deliberate body-height differences.
- Verify limb lengths and torso width in comparable views. Rotation/foreshortening may change projection; cropping or zoom may not.
- Inspect ALL packed frames at native scale, plus idle-to-run, idle-to-attack, recovery-to-idle, jump-to-air-attack and knockdown-to-getup transitions at game speed.
- Check fixed cell/ppu/pivot, no clipping, correct facing, feet/airborne placement, palette and regenerated contact/effect anchors.
- Run packer regression tests after tooling changes, strict packing, build, and same-depth browser mirror/cross-cast checks. Compare on a common camera/depth so perspective does not masquerade as scale drift.
- The automatic gate's head and feet numbers are proxies: they block a strip that is off and flag it for eyes, and a
  clean number plus the heads contact sheet is the evidence the reviewer approves. A frame the proxy misreads gets a
  written exemption, never a silent pass.

- **Build gate (blocking for the model sheet, idle and run approvals, and for any build change).** The fighter's
  `standingBodyPx` follows the canon-height rule, or an ADR records why not. On the packed idle, the **DR lies inside
  the declared build-class band** and the SBR inside the band for its idle hand style; the MWR is 0.42 or more (0.40
  for a child) or the REVIEW row explains why. A value outside its band means the asset is rejected, even with a
  zero-warning pack. Reference failure: Gojo idle v02, an athletic adult at DR 0.23, SBR 0.242, MWR 0.36.
- **Build consistency in every strip.** Shoulder width, torso width and limb thickness stay within ±8 % of the
  approved idle's in comparable views.
- **Lineup.** The model sheet, idle, run and heavy reviews include the `npm run lineup` image; without it the gate is
  pending.

## Evidence

Audit and before/after comparisons live in `art/scale/`. Each character's production QA must link its measured results and unresolved exceptions. A missing or incomplete measurement record means the anatomical gate is pending, even when the atlas packs successfully.
