# Scale fix brief (ART-SCALE-02)

For Codex, after TOOL-025 (`chore/scale-gate`, [ADR 0021](../../docs/decisions/0021-scale-gate-and-depth-normalized-sprites.md))
is merged. The user saw Killua "randomly growing big and small" in fights. The packer's new scale gate measured every
packed frame of the approved art against each fighter's approved idle (head silhouette with hair, and shoes); this
brief lists every approved strip it found off, with the fix. Contract and verdicts:
[CHARACTER_SCALE.md "Scale gate (automatic)"](../CHARACTER_SCALE.md#scale-gate-automatic). Evidence (before):
`art/scale/heads-<id>.png`, `art/scale/scale-report.json`, `art/scale/lineup.png` from `npm run lineup`.

## Rules for this batch

- **The approved idle is the reference** (user decision 2026-10-10). Killua keeps his big idle hair: every listed
  strip is brought to the idle, never the idle to the strips.
- **Order**: batch 1 = Killua (the user's complaint), batch 2 = Naruto, batch 3 = Sasuke. One art PR per batch
  (`npm run pr -- start art/scale-fix-<id> --full`). Gojo has no batch: his whole redraw (ART-GOJ-BUILD, PR #24) must
  pass the gate inside that PR (see Gojo below).
- **Not in this brief (owned by open art PRs, which must pass the strict gate themselves)**: Naruto `beamCharge`,
  `beamFire` (PR #25), `heavy`, `charge` (PR #29); Sasuke `heavy`, `charge` (PR #28), `light2`, `light3`, `special`
  (PR #27); Killua `heavy`, `charge` (PR #30), `beamCharge` (PR #26); Gojo everything (PR #24).
- **Every fix is a new `_vNN`** (next free numbers are in the tables) with its own REVIEW row, and waits for the user's
  `approve vNN`. Never overwrite, reuse or delete a version. The gate does not approve art.
- **Done means**, per strip: `node tools/pack-sprites.mjs <id> --quantize 48` exits 0 and shows the strip `ok` (no
  `scale gate:` line for it; the new version is a candidate, so it is strict there, and a failure writes nothing for
  the fighter). Do not use `--strict-scale` for this: it also fails on every approved strip not fixed yet.
  `npm run scale -- <id>` rewrote `art/scale/heads-<id>.png` and the REVIEW row links it, and `npm run lineup` is
  attached to the batch (its rows include guard, charge, airLight1 and hurtHigh). Strips of the same fighter that are
  not yet fixed still print `~` findings: that is expected until the batch is done.
  After the user approves, run `npm run scale` once more and commit `art/scale/scale-baseline.json` with the batch.
- **Exemptions**: if the heads sheet shows the probe reading something that is not the head (an arm over it, a slash
  arc in hair colours, an afterimage), add `"scaleExemptFrames": { "<frame>": "<reason>" }` and
  `"scaleExemptVersion": <the new version>` to that animation in `art/manifest.json` and say so in the REVIEW row.
  Never exempt a head that is really small. An exemption covers only the version it names: a new version of an
  exempt strip is measured in full (with a `scale:` warning) until you check its heads sheet and move
  `scaleExemptVersion` to it on purpose.

## The three routes

**A. Auto head fit (no new image)**, for verdict `uniform` (head and feet off together: the strip was packed at the
wrong size). The raw pixels are fine; the packer refits them.

1. Copy the approved raw to the next free version: `raw/<anim>_vNN.png` -> `raw/<anim>_vMM.png` (same pixels).
2. Write `raw/<anim>_vMM.json`: every key of `raw/<anim>_vNN.json` (if any) **except** `anatomy` and
   `calibrationNotes`, plus `"anatomy": { "measurement": "auto-head" }`. If the animation has a scale exemption in
   the manifest (Killua airHeavy, specialUp; Sasuke block), the same pixels hide the head the same way: set its
   `"scaleExemptVersion"` to MM before packing, so the fit is measured on the same frames.
3. If the table says **frames edited**, `frames/<anim>/` holds hand edits that would win over the new version: move the
   folder to `production/previous-frames/<anim>_vNN/` (that is where earlier frames are kept), then check the new
   frames for the specks the edit had removed (fix them in a `frames/` touch-up, noted in the REVIEW row).
4. `npm run sprites <id>`: the report notes `auto-head fit xF (head H, feet F of idle)`; then
   `node tools/pack-sprites.mjs <id> --quantize 48` (exit 0). A clip or margin warning for the fitted strip means a
   pose is too big at the idle's size: switch that strip to route C. `auto-head: verdict ... - not fitted` means the
   probe does not see one uniform size error (a misread frame, a pop): fix that first; the request stays and is
   measured again on the next pack.
5. `hitboxes.json` boxes and hand points of that animation are scaled about the feet automatically (a note says so):
   check them in the test lab (ANIMATIONS tab), correct them if needed and set `"_scale": F` in that animation's block.
6. REVIEW row: "same pixels as vNN, auto-head fit xF (head H -> 1.00 of the idle)".

**B. Re-stitch (no new image)**, for verdict `pop` in a strip stitched from `raw/_parts/` at a factor picked by eye.

1. `npm run stitch -- <id> <anim> <MM> --parts <NN>`: measures part B against part A and writes `raw/<anim>_vMM.png`
   plus the factor in `raw/<anim>_vMM.json`. If it warns that the parts differ by more than x0.75, or that the check
   after scaling is off, look at the stitched strip: fine by eye is fine, otherwise use route C.
2. Carry over the old sidecar's `frames`, `split`, `drop` and `frameOffsets` keys into `raw/<anim>_vMM.json` (keep the
   `stitch` key); never the old `anatomy` (`skull-to-chin` estimates are what made some strips small).
3. Pack. If the strip is now `uniform` (one size, the wrong one), add `"anatomy": { "measurement": "auto-head" }` to
   the same sidecar and pack again (route A steps 3-6).
4. REVIEW row: "re-stitched from the vNN parts, B factor xF measured".

**C. Redraw**, for verdict `drift` (the head or hair was drawn smaller or bigger than the idle's on the same body), for
pops without parts, and wherever A or B fails. Generate the strip again from its block in
`art/characters/<id>/PROMPTS.md` (Part A / Part B for 6+ frames, stitched with `npm run stitch`). Attach
`reference/idle_approved.png` **and `reference/head_scale_guide.png`** (made by `npm run scale -- --guide`: the idle at
the 2x generation size with the crown, hair-width and chin lines), and put the SCALE LOCK line below at the top of
every prompt block (Part A and Part B).

## SCALE LOCK lines (paste at the top of each prompt block)

Killua:

```text
SCALE LOCK: draw him exactly as big as in the attached idle_approved.png and head_scale_guide.png. Same head, same big spiky hair mass: at the 2x generation size the hair is 102 px wide and 64 px tall from the crown to the bottom of the hair mass, crown to chin 82 px, standing height with hair 364 px. Leaning, crouching, twisting or raising an arm changes the pose, never the size of the head, the hair or the body; a claw, slash arc or kick above the head must not make the figure smaller.
```

Naruto:

```text
SCALE LOCK: draw him exactly as big as in the attached idle_approved.png and head_scale_guide.png. Same head, same spiky yellow hair: at the 2x generation size the yellow hair is 64 px wide, crown to chin 78 px, standing height with hair 408 px. Leaning, crouching, twisting or raising an arm changes the pose, never the size of the head, the hair or the body; a fist or kick above the head must not make the figure smaller.
```

Sasuke:

```text
SCALE LOCK: draw him exactly as big as in the attached idle_approved.png and head_scale_guide.png. Same head, same dark spiky hair mass: at the 2x generation size the hair is 78 px wide and 82 px tall, and the face is the same height as in the idle; standing height with hair 404 px. Leaning, crouching, twisting or raising an arm changes the pose, never the size of the head, the hair or the body; arms raised over the head must not make the figure smaller.
```

## Batch 1: Killua (reference: idle v01, head 52 x 35 px, hair 51 px wide)

`frames edited` = `frames/<anim>/` has hand edits (route A step 3). Per-frame heads are in `scale-report.json`.

| anim | approved | verdict | head / feet vs idle | per-frame head | route | new version | notes |
|---|---|---|---|---|---|---|---|
| guard | v03 | drift | 0.80 / 1.01 | 0.81 0.78 | C | guard_v04 | hair mass drawn ~20 % small on a normal body; 2 frames |
| superPose | v03 | drift | 0.66 / 0.95 | 0.70 0.64 0.69 0.64 | C | superPose_v04 | the smallest hair of the cast; 4 frames |
| beamFire | v04 | drift | 0.89 / 1.14 | 0.87 0.89 0.89 | C | beamFire_v05 | head small, body big: redraw the whole figure at the idle's size |
| throw | v02 | drift | 0.90 / 0.96 | 0.89 0.91 0.91 0.89 | C | throw_v03 | frames edited; 4 frames |
| jumpUp | v01 | drift | 0.87 / 0.96 | 0.88 0.87 | C | jumpUp_v02 | the whole figure reads small; the feet do not confirm it, so not auto-fitted |
| block | v03 | pop | 0.80 / 1.08 | 0.89 0.72 | C | block_v04 | f1 head 18 points smaller than f0; one part only |
| specialForward | v04 | pop | 0.68 / 1.09 | 0.83 0.68 0.80 0.85 0.66 0.61 0.65 | C | specialForward_v05 | the stitch check cannot compare its parts (factor x0.37, after 0.78): redraw both parts at the idle's head, no f4 -> f5 shrink |
| airLight1 | v02 | uniform | 0.88 / 0.92 | 0.87-0.88 | A | airLight1_v03 | frames edited; expected fit about x1.14 |
| airLight2 | v02 | uniform | 0.87 / 0.95 | 0.84-0.91 | A | airLight2_v03 | dry-run fit x1.151 -> 0.995 |
| airLight3 | v02 | uniform | 0.84 / 0.92 | 0.81-0.86 | A | airLight3_v03 | dry-run fit x1.183 -> 0.986; has hitboxes.json overrides (scaled) |
| airHeavy | v01 | uniform | 0.85 / 0.92 | f3 0.88, f5 0.83 (f0 f1 f2 f4 exempt) | A | airHeavy_v02 | dry-run fit x1.170 -> 0.985; hitboxes.json overrides (scaled); raised-arm and slash-arc frames are exempt in the manifest |
| hurtHigh | v02 | uniform | 0.83 / 0.92 | 0.86 0.82 0.83 | A | hurtHigh_v03 | the by-eye `skull-to-chin` sidecar made it 17 % small; dry-run fit x1.206 -> 1.00 |
| hurtLow | v02 | uniform | 0.83 / 0.87 | 0.83 0.80 0.85 | A | hurtLow_v03 | same cause; dry-run fit x1.208 -> 0.995 |
| specialUp | v02 | uniform | 0.77 / 0.86 | 0.78 0.78 - 0.76 0.77 - (f2 slash arc, f5 arms exempt) | A | specialUp_v03 | frames edited; expected fit about x1.29; if a frame clips, route C |
| jumpFall | v01 | uniform | 1.10 / 1.17 | 1.08 1.12 | A | jumpFall_v02 | too BIG: dry-run fit x0.908 -> 1.00 |

Low-confidence poses (`launched`, `down`, `ko`, `jumpSquat`, `spin`, `airRecover`, `getup`, `vanish`) are not judged
by the gate; on the heads sheet Killua's `launched` (0.74) and `down` (0.84) read small: after this batch, check them
by eye next to the fixed hurt strips and, if they still look small, add them as route A (`launched_v02`,
`down_v02`, `ko_v03` with the auto head fit replacing ko's `skull-to-chin` sidecar).

## Batch 2: Naruto (reference: idle v02; his head colours are declared as the hair yellow only)

| anim | approved | verdict | head / feet vs idle | per-frame head | route | new version | notes |
|---|---|---|---|---|---|---|---|
| specialUp | v01 | pop | 0.71 / 0.96 | 0.82 0.82 0.73 0.70 0.52 0.45 | B, then A | specialUp_v02 (`--parts 1`) | stitched at x0.7 by eye; measured B factor x0.99, so f4/f5 come back to the strip's size, then the whole strip (about 0.8) gets the auto head fit |
| light3 | v01 | pop | 1.00 / 1.22 | 1.00 0.97 0.95 0.98 1.09 1.11 1.12 | B | light3_v02 (`--parts 1`) | measured B factor x0.80 (by eye it was x0.89) |
| light4 | v01 | pop | 0.97 / 1.04 | 0.95 1.00 0.91 0.97 0.94 1.00 0.97 1.03 | B | light4_v02 (`--parts 1`) | frames edited; measured x0.66 (by eye x0.71), beyond x0.75: check by eye, else regenerate part B (C) |
| airLight3 | v02 | pop | 0.92 / 1.11 | 1.03 0.94 0.84 0.85 0.94 0.91 | B | airLight3_v03 (`--parts 2`) | measured x0.70 (warns): check by eye, else C; drop the `skull-to-chin` sidecar |
| airHeavy | v03 | pop | 0.96 / 0.89 | 1.00 0.79 0.92 0.96 0.97 0.98 | B | airHeavy_v04 (`--parts 3`) | measured x0.77; drop the `skull-to-chin` sidecar; has hitboxes.json overrides |
| specialForward | v02 | pop | 0.82 / 0.80 | 0.82 0.82 0.79 0.82 1.00 0.97 0.99 | B, then A | specialForward_v03 (`--parts 2`) | frames edited; measured x0.63 (by eye x0.78), beyond x0.75: check by eye, else C; then the strip (about 0.82) gets the auto head fit |
| special | v03 | uniform | 0.79 / 0.85 | 0.82 0.82 0.81 0.77 0.79 0.71 0.77 0.79 | C | special_v04 | the auto head fit (x1.27) clips all 8 frames at the top: redraw at the idle's head; keep the frameOffsets intent; hitboxes.json overrides |
| superPose | v03 | drift | 0.71 / 1.70 | 0.71 0.71 0.71 0.66 | C | superPose_v04 | head and hair ~29 % small |
| guard | v03 | drift | 0.80 / 1.05 | 0.82 0.77 | C | guard_v04 | |
| block | v03 | uniform | 0.80 / 0.59 | 0.83 0.77 | C | block_v04 | the feet read (0.59) is unreliable in this pose: redraw rather than refit |
| jumpFall | v01 | drift | 0.88 / 1.03 | 0.87 0.88 | C | jumpFall_v02 | |
| stagger | v01 | drift | 0.91 / 0.99 | 0.91 0.91 0.95 0.91 | C | stagger_v02 | |
| land | v01 | uniform | 1.09 / 1.32 | 1.10 1.08 | A | land_v02 | too BIG: dry-run fit x0.915 -> 0.99 |
| hurtHigh | v01 | drift | 0.91 / 1.49 | 0.88 0.91 0.94 | check, then C | hurtHigh_v02 | borderline; f0 tilts the head back. Redraw only if it reads small next to the idle |
| hurtLow | v01 | pop | 1.01 / 1.23 | 1.03 1.01 0.91 | check, then C | hurtLow_v02 | borderline (12.1 points); f2 reads slightly small |
| throw | v02 | drift | 0.94 / 1.06 | 0.94 0.94 0.94 0.93 | check | - | borderline (6 %); frames edited; leave unless it looks small |

Exempt already (manifest, at the approved version): `win` f1-f2 (the raised fist covers the hair), `specialDown` f0-f1
(the bowed head shows its crown).

## Batch 3: Sasuke (reference: idle v01; his head colours are declared: navy hair shades)

| anim | approved | verdict | head / feet vs idle | per-frame head | route | new version | notes |
|---|---|---|---|---|---|---|---|
| run | v02 | uniform | 1.11 / 1.05 | 1.08-1.13 | A | run_v03 | too BIG: dry-run fit x0.903 -> 0.99; keep its frameOffsets |
| dash | v01 | uniform | 1.16 / 1.36 | 1.16 1.16 | A | dash_v02 | x0.865 -> 1.00 |
| superDash | v01 | uniform | 1.22 / 1.36 | 1.20 1.24 | A | superDash_v02 | x0.822 -> 0.985; replace the `skull-to-chin` sidecar, keep frameOffsets |
| airLight3 | v01 | uniform | 1.18 / 1.45 | 1.15-1.23 | A | airLight3_v02 | x0.846 -> 0.994; replace the `skull-to-chin` sidecar |
| jumpFall | v01 | uniform | 1.06 / 1.11 | 1.06 1.06 | A | jumpFall_v02 | x0.942 -> 0.98 |
| block | v01 | uniform | 1.09 / 1.18 | f0 1.09 (f1 exempt) | A | block_v02 | x0.915 -> 1.00 |
| beamFire | v01 | uniform | 1.06 / 1.44 | 1.07 1.01 1.06 | A | beamFire_v02 | x0.943 -> 1.00; check the beam origin hand points after the fit |
| throw | v01 | uniform | 0.89 / 0.94 | 0.86 0.96 0.91 0.84 | A | throw_v02 | x1.127 -> 0.994 |
| stagger | v01 | uniform | 0.88 / 0.77 | 0.94 0.88 0.89 0.87 | A | stagger_v02 | x1.131 -> 1.00 |
| intro | v01 | uniform | 0.91 / 0.74 | 0.89 0.93 0.94 0.89 | A | intro_v02 | x1.103 -> 1.01 |
| superPose | v01 | uniform | 0.93 / 0.79 | 0.93 0.93 0.95 0.93 | A | superPose_v02 | x1.079 -> 1.03 |
| airLight2 | v02 | uniform | 0.94 / 0.68 | 0.92-0.96 | A | airLight2_v03 | borderline; x1.064 -> 0.99 |
| airLight1 | v01 | drift | 0.89 / 1.22 | 0.87-0.90 | C | airLight1_v02 | |
| win | v01 | drift | 0.91 / 1.07 | 0.88 0.92 0.91 0.90 | C | win_v02 | |
| jumpUp | v01 | drift | 0.90 / 1.59 | - 0.90 (f0 exempt) | C | jumpUp_v02 | |
| light4 | v01 | drift | 0.92 / 1.20 | 0.99 0.93 0.92 0.92 0.93 0.90 0.88 0.89 | C | light4_v02 | a slow shrink across the strip (the second part small) |
| airHeavy | v02 | pop | 1.14 / 1.71 | 1.16 0.95 1.14 1.18 - 0.95 (f4 exempt) | check, then B or C | airHeavy_v03 | the stitch check cannot compare its parts (after 1.12): look at f1 and f5 on the heads sheet first |

Exempt already (manifest, at the approved version): `guard` and `beamCharge` (arms crossed or raised in hair shades),
`jumpUp` f0, `block` f1, `airHeavy` f4, `specialUp` f4-f5. `jumpUp_v02` (route C) and `airHeavy_v03` are new drawings:
they are measured in full, and f0 / f4 are re-exempted only if the heads sheet shows the same misread.

## Gojo

No batch here. ART-GOJ-BUILD (PR #24) redraws all 42 animations; every redrawn strip is a candidate and must pass
`node tools/pack-sprites.mjs gojo --quantize 48` against his approved compact head (idle head 31 x 19 px, hair 30 px
wide). Once all 42 are redrawn and approved, `--strict-scale` must exit 0 too; then set `"scaleGate": "strict"` on
him. Today's outliers not to repeat: beamFire +17 %, superDash +18 %, block +14 %, run +8 %, dash +10 %, throw -11 %,
airLight1/2 -8 %; specialUp f2-f3 and vanish are afterimage frames (exempt them with a reason and the new version if
the redraw keeps the afterimages).
