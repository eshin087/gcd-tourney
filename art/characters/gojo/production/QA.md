# Gojo approved complete set

2026-10-09. The user selected model v03 proportions and authorized all production and QA before one bulk review. The user subsequently approved the complete batch: all 47 latest assets are approved and fixed references/UI are promoted.

## Delivered

- Model v03 (the supplied reference, unchanged), expressions v02.
- All 42 canonical animations, 175 frames. Idle v02, run v03, light4 v02, beamFire v02, airHeavy v02, ko v02; remaining animations v01.
- Portrait, cut-in and selection v01, fitted by the packer to 96x96, 480x128 and 384x384.
- [Full interactive review](../reference/batch_review_v03.html), per-animation contact sheets in `contact/`, raw generations, long-strip parts, versioned placement sidecars, hitbox overrides, pack report and browser evidence.

## Technical checks

| Check | Result |
|---|---|
| Strict candidate pack | 42 animations, 175 expected frames, 48 colors, no missing core animations, no count/clipping/margin warnings |
| Atlas | 4096x2816, 16 columns, 256x256 cells, pivot [128,240], ppu128; `complete: true` |
| Pixel inspection | 48 opaque RGB colors, alpha only 0/255, zero residual magenta; all 42 frame counts match manifest |
| Visual inspection | Every packed strip inspected; merged light4/beamFire poses regenerated; knockout pose regenerated; dash/launched/down/KO placement corrected with sidecars |
| Attack boxes | Explicit boxes over hands/elbow where automatic extraction included unrelated pixels; Blink has no contact hitboxes. Air-heavy v02 regenerated after its first browser reach check failed |
| UI | All three packer outputs have expected sizes, hard alpha and no residual magenta. Their palettes remain generated: portrait 1149, cut-in 10598, select 11572 colors |
| Build | Sandbox-compatible Vite production build passed, 60 modules, using `reference/qa/build-local.mjs` |
| Review controls | 42 cards, images loaded, frame scrub pauses playback, filter returns all four special strips, no horizontal overflow at 390px width |

Final browser combat results are recorded in `browser-result.json` (exit 0). The complete custom Gojo sheet and UI load without `art=custom`; movement works; all nine normal attacks connect from a one-world-unit starting separation. Damage results: light1 28, light2 30, light3 36, light4 58, heavy 64, airLight1 24, airLight2 26, airLight3 40, airHeavy 62. Air-heavy v02 fixes the first pass's short reach. Blue, Red, Infinity, Blink, Domain and Purple paths were exercised; all return without leaving the fighter hidden. Browser errors were empty. Infinity/Domain checks verify animation/state paths, not counter triggers or every super interaction.

## Visual caveats for the single review

- The supplied compact head and long-legged direction overrides earlier seven-head guidance. Separate generations still vary slightly in hair shape, head scale, jacket folds and apparent body size, especially airborne/tucked poses and recovery transitions.
- Raw generation uses many colors and some softened interior edges. The final body atlas has a strict 48-color palette and binary transparency. Reference sheets and UI retain their generated palettes.
- Several attack contact points differ from the generic SPEC rectangles. Light1 ends around x205-210; light2 is shorter than its x214-236 target. AirLight1/2 strike higher than the generic target; beam and Blue use Gojo-specific one-hand casting poses. Hitboxes follow visible limbs rather than extending invisibly into the target zones. All nine Gojo normals connect at the tested one-unit spacing; broader matchup balance remains a project-level concern.
- Run has an arm-swing seam between generated halves. AirLight3 uses placement offsets to keep the active kick from dropping with bottom anchoring. Heavy uses a forward elbow rather than the generic uppercut fist, as specified in Gojo's brief.
- Packer fallback notes are calculated before overrides. Explicit Gojo boxes replace the suspect hand/elbow results, and `specialUp` contact boxes are empty.
- Blink now shows specialUp frames 0-1 during six startup ticks, hides for six ticks, then shows frames 4-5 for six recovery ticks. Other teleports retain their existing timing. Shared VFX are the game's existing atlas; proposed Gojo-exclusive Blue/Red effect sheets are not runtime assets.
- Browser smoke checks do not establish full balance, all matchups, controller hardware behavior, or a long CPU soak.

## Reproduce

1. `node tools/pack-sprites.mjs gojo --quantize 48 --strict --json`
2. `node art/characters/gojo/production/inspect-all.mjs`
3. `node art/characters/gojo/production/build-gallery.mjs`
4. `node art/characters/gojo/production/browser-full.cjs`
5. `node art/characters/gojo/reference/qa/build-local.mjs`

Approval copies versioned references, idle and UI to the canonical fixed names. Superseded candidates and long-strip parts are retained in their adjacent _rejected directories. The canonical packer generated the final public atlas.

The browser's loopback connection was denied under the sandbox on the full-set pass; the required browser command was subsequently authorized outside it. The build stayed within the sandbox using Vite's preserveSymlinks option. No filesystem permissions, damage values or manifest body heights were changed. The scoped engine change adds optional startup/recovery to teleport moves and enables it for Blink.

The full batch is approved. No deployment was requested.

## Approved-sheet reach check

World units from sprite pivot to the furthest active hitbox edge, before lunge/padding (raw data: reach.json):

| Fighter | Idle hurt top | light1 | light3 | light4 | airHeavy |
|---|---|---|---|---|---|
| Gojo | 1.648 | 0.648 | 0.758 | 0.922 | 0.531 |
| Killua (read-only comparison) | 1.359 | 0.641 | 0.828 | 0.734 | 0.398 |

Gojo needs no lunge/stat adjustment for the tested one-unit mirror spacing. Killua measurements do not establish its combat results. Packer regression: 160 passed. Teleport regression verifies legacy Rhythm Echo timing/follow-up and Blink startup/hide/recovery with exactly one relocation.

Final post-approval browser run: PASS, no page/console errors. Both fighters loaded complete custom Gojo art without preview flags; all nine normals hit; six special/super paths completed; Blink showed visible startup frames 0/1, a hidden interval, visible recovery frames 4/5 and a normal exit. Gallery loaded all 42 cards, scrub/filter worked, and mobile had no horizontal overflow. The initial 25-step Blink assertion ended during effect hit-stop; extending observation to 80 rendered steps captured the complete sequence.

## Integration check (Claude, 2026-10-10)

- Hand anchors for throw f1 and beamFire f0-2 (Reversal: Red and Hollow Purple start at the drawn hand), ADR 0012.
- Blink: the smoke puff, speed lines and sound now fire when he disappears (after the specialUp wind-up), not at the
  button press.
- 144 CPU matches with the art packs: Gojo 56 %, no errors (ADR 0011 log run 10-11).

## 2026-10-10 scale candidate pass

See [final cross-cast QA](../../../scale/FINAL_QA.md) for selected versions, source hashes, all-frame inspection, browser checks, contact anchors, measurement uncertainty and final approval scope. Earlier records below/above describe previous versions.
