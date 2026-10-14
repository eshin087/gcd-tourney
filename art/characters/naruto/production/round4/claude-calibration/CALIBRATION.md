# Naruto round 4: Claude calibration (QA-NAR-R4-CAL, 2026-10-14)

Requested in docs/agents/CLAUDE_ART_HANDOFF.md (Codex, 2026-10-13). Inputs: Luna's `../repair-analysis.md` and
Astra's `../repair-audit/PRE-CALIBRATION.md` on this branch (`2bbb71d`). No generation, no budget change, no art
approval, no merge, no production deploy.

## What changed

The **quantized atlas** changed (packer `bodyHeight`), not a runtime-only scale, so every packed pixel Astra
measures is new. Each calibration lives in that version's raw sidecar, so a later version or a rollback to the
approved strip is not resized by it:

| strip | sidecar | bodyHeight | factor | packed head probe (strip / frames) |
|---|---|---:|---:|---|
| stagger v06 | `raw/stagger_v06.json` | 216 -> **175** | 0.81 | 0.959 / 0.954-0.967 |
| taunt v07 | `raw/taunt_v07.json` | 198 -> **168** | 0.85 | 1.007 / 1.000-1.014 |
| win v08 | `raw/win_v08.json` | 193 -> **168** | 0.87 | 1.039 / 1.010-1.074 |
| jumpUp v06 | unchanged | 205 | 1 | 1.011 / 0.97-1.053 |
| superDash v03 | unchanged | 120 | 1 | 0.986 / 0.973-1.000 |

Pack: `node tools/pack-sprites.mjs naruto --quantize 48` on this branch. `--strict-scale` fails only on `spin`, the
recorded stand-in size exception (head 12 % big, round-3 item), not on any strip touched here.
`public/characters/naruto/sheet.png` sha256 `051c6c59baf0f1a137b8174eea6e19b8d4327aa4d0dae0c1fcae22620ff4d93e`,
`anims.json` sha256 `7debe0114b917e14a2cbb5023219b88b893b864379f705ca392c008c655ef923`.
The whole sheet is re-quantized (one 48-colour palette), so other strips' colours can shift by a few levels; their
geometry and scale are unchanged.

## How the factors were chosen

Rigid markers decide scale: the hair-inclusive head (crown to chin) and the visible profile shoe, which do not change
with pose. The torso projection does (Astra: neutral collar-to-hem about 50.5 px vs combat/idle 38.5), so it is not a
scale marker here. Three independent readings at the old packing, each turned into the factor range that puts it
within +-6 % of idle07:

| strip | gate head probe | Astra H (idle 37-41) | Astra S (idle 25-30) | feasible k (all three) | chosen |
|---|---|---|---|---|---|
| stagger06 | 1.19 -> k 0.790-0.891 | 48-52 -> k 0.733-0.827 | 33-37 -> k 0.739-0.833 | **0.790-0.827** | 0.81 |
| taunt07 | 1.20 -> k 0.783-0.883 | 45-49 -> k 0.780-0.880 | 29-34 -> k 0.821-0.925 | **0.821-0.880** | 0.85 |
| win08 | 1.19 -> k 0.790-0.891 | 44-49 -> k 0.788-0.889 | 25-30 -> k 0.94-1.06 | **empty** | 0.87 (interim) |

H and S ranges use the central values of Astra's intervals. They screen for one shared factor; they are not a pass.

## Residual: win08

No single factor satisfies win's head and shoe together: at the old size its shoe already matched the idle while its
head read about 1.19. Even at the interim factor, win f0's head probe reads 1.074, just past +6 %. The head is drawn roughly 15-19 % large for this body (equivalently, the body is small for the
head). The interim factor puts the head first, so it no longer pops in game, but the shoe now reads about 0.87 and the
standing figure is about 0.82 of the neutral's height (the body sheet's garment number B is 0.68 here, advisory). If
Astra confirms this on the calibrated atlas, it is a **robust measured failure** and qualifies win08 for one of its two
remaining round-4 calls: a redraw at idle07's head-to-body ratio (head about 15 % smaller relative to the body), same
pose. Taunt's B also reads 0.69; that number is pose-dependent (open stance, raised pointing arm), so it needs Astra's
segment audit rather than a redraw on this evidence.

## Contact effects (hurt boxes, world units)

| strip | hurt top main -> branch | hurt width main -> branch | in combat? |
|---|---|---|---|
| stagger | 1.61 -> 1.30 | 0.54 -> 0.45 (the game widens every hurt box to at least 0.56) | yes: the guard-crush / parry stagger |
| taunt | 1.47 -> 1.25 | 0.74 -> 0.70 | no |
| win | 1.43 -> 1.24 | 0.51 -> 0.52 | no |

Stagger's old 1.61 top came from the inflated v05 body; 1.30 sits just above the idle's 1.20, as a staggering
upright body should. A head-high strike aimed above 1.30 now whiffs on a staggered Naruto where it used to connect;
Claude checks that in game (CPU soak) at integration. No hit boxes change (none of these strips attacks).

## Evidence

- `compare-2x.png`: neutral cell, combat cell, idle07 f0, stagger f0/f2, taunt f0, win f0/f1/f3 from the calibrated
  atlas at 2x on one floor line.
- `body-naruto-stagger-taunt-win-jumpUp-superDash.png` + `body-report.json`: `npm run body` on the calibrated atlas.

## Next

Astra rechecks every frame and loop of stagger, taunt and win (plus jumpUp and superDash) in this atlas: H, T against
the right reference cell per pose, upper and lower limbs where visible, S, frontal shoulders when available. Codex
spends a remaining call only on a residual Astra confirms. Claude's reservation of the five strips' bodyHeight,
offsets, sidecars, hitboxes and this folder ends with this note; ask again before re-calibrating after a redraw.
