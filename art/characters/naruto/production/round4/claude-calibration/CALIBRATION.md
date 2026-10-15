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

# Round 2 (2026-10-14): win09, and stagger06 / taunt07 feasibility

Requested by Codex's "win09 ready for recalibration" section (branch at `ef4c2d5`), after Astra's calibrated audit
(`../calibrated-astra-audit/AUDIT.md`) found the upright torsos short at round 1's head-first factors.

## win09: calibrated at k 1.0 (bodyHeight 193, `raw/win_v09.json`)

Luna's redraw fixed the body: at 193 the strip already sits on every rigid marker.

| marker (at 193) | win09 | reference | ratio |
|---|---|---|---|
| head probe | 1.043 (frames 1.014-1.059) | idle07 | gate 0.94-1.06 |
| upright collar-to-hem T | about 46-48 px | neutral cell 50.4 | 0.92-0.96 |
| visible profile sandal S | about 28-29 px | idle07 / neutral about 30-31 (same ruler reading) | 0.92-0.95 |

T and S are hand readings on 4x crops with a 5 px ruler (`win09-ruler-torso-4x.png`, `win09-ruler-feet-4x.png`),
+-1-2 px. A larger factor lifts T and S but pushes f3's head past 1.06; a smaller one drops T and S below 0.94. 1.0 is
the only factor near all three; T and S sit at the low edge, so Astra's audit decides the pass. Win's hurt box top is
1.40-1.44 units (win is not a combat state).

## stagger06 and taunt07: no uniform factor fits (source residual)

At round 1's calibration the head and the profile sandal already match (Astra: stagger H 40, S 29; taunt H 39, S 28,
against references about 40 / 29), while the upright collar-to-hem is short against the neutral cell's 50.4:

| strip | T now | T / neutral | factor T needs (+-6 %) | factor H and S allow | overlap |
|---|---|---|---|---|---|
| stagger06 | 39.2 (Astra), 35-39 (Claude's ruler, `win09-ruler-torso-3x.png`) | 0.70-0.78 | 1.21-1.36 | 0.94-1.06 | **none** |
| taunt07 | 36.5-37.5 (Astra), about 36 (ruler) | 0.71-0.74 | 1.27-1.43 | 0.94-1.06 | **none** |

The collar and hem are crisp pixel edges, read to about +-2 px. Astra's nonempty windows (stagger 1.049-1.200, taunt
1.101-1.232) appear only when every endpoint takes its most favourable value at once (T at +4 px, the neutral at
-2.4 px, H and S at the favourable ends of their ranges together). At the central values, the factor that fixes T makes
the head and sandals 21-43 % too big. **Result: a proven source residual for both, if the poses are read as upright**
(Astra's reading, which Claude shares: both stand with straight backs, only the shoulders hunched in stagger). The
torso is drawn about 20-25 % short relative to the head and sandals (T/H about 0.95-0.98 against the neutral's 1.29;
it matches the crouched combat/idle projection, 0.99, which an upright pose should not have). The remedy is one redraw
each with the upright torso at the neutral's proportion, the same pose and the same head size; both strips keep their
round-1 calibration until then.

## jumpUp06 and superDash03

No change. The rigid marker that can be read passes (head probe 1.011 / 0.986), and nothing comparable shows a body-size
error: the airborne and leaning projections hide the torso and sandal lengths, as Astra found. A defensible review
decision needs no more measurement, only the user's visual check in game beside the idle: record it as a
`scaleManualQA` pass or a redraw request from that review, not from a bounding box.

## Atlas

`public/characters/naruto/sheet.png` sha256 `fa585aa6d901a0b6ca69014b339b64529091b1bee5f0803f56544924febefa60`,
`anims.json` sha256 `a31a076b6e0404e76da77cf98b69832421155406c52e174ec532dc4c2d58d667` (`--quantize 48`, normal gate passes;
stagger and taunt pixels unchanged from round 1 apart from the shared palette).

# Round 3 (2026-10-14): stagger07 and taunt09

Luna's torso redraws (`fec0703`) halved the residual but did not remove it.

| marker at the default size (stagger 216, taunt 198) | stagger07 | taunt09 | reference |
|---|---|---|---|
| head probe | 1.20 | 1.20 | idle07 |
| visible profile sandal | about 1.2x | about 1.2-1.3x (foot yaw) | idle07 / neutral |
| upright collar-to-hem | about 47-50 px (about 1.0) | about 49 px (about 1.0) | neutral cell 50.4 |

Head and feet agree with each other (both about 1.2x); the torso is the short segment, about 15 % short relative to
them (v06 / v07 were 22-30 %). Matching head and sandal exactly (k 0.83) leaves the torso at about 0.81 of the neutral;
the chosen **k 0.86** keeps the head (stagger 1.031, taunt 1.027 packed) and the sandal (about 1.05) inside 6 % and
lifts the torso to about 0.84. No factor reaches 0.94 for the torso without pushing the head past the 1.06 gate.
Sidecars `raw/stagger_v07.json` (bodyHeight 186) and `raw/taunt_v09.json` (170). Evidence:
`round3-torso-at-default-3x.png`, `round3-feet-at-default-3x.png` (ruler every 5 px).

**Decision for Codex and the user:** each strip has one round-4 call left. Either spend it on the same correction (the
generator has under-drawn the upright torso four times in a row, so ask for it explicitly as "collar to belt = 1.3 x
the head height, like the neutral cell"), or accept a torso about 15 % short at the correct head size and let the user
judge it in game. win09 (k 1.0) is unchanged.

Contact: stagger hurt box top 1.38/1.38/1.39/1.39 units (idle 1.20); taunt and win are not combat states.

Atlas: sheet sha256 `c933c9cd9080e278e372d19e574c39ee3142b8d9a51ba0420385c6fa52a45e5f`, anims.json sha256
`5c012d7d7554589b6ea807c32fc6a87cf17259389e76d737ea62b2fd80d04930` (`--quantize 48`, normal gate passes).
