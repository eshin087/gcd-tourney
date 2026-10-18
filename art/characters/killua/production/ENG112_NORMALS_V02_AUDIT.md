# ENG-112 Killua normals v02: Astra atlas audit

**Result: technical HOLD for all ten moves.** This audit is static frame inspection of the exact temporary 48-color quantized diagnostic atlas used by the v02 review page. It is not runtime contact validation or art approval. The temporary manifest marked v02 as approved only to permit diagnostic extraction; the branch manifest remains raw/unapproved and the diagnostic sheet is not shipped.

- Atlas SHA-256: `b66a685b321f548570f4ddbb70392068972dcc20d9c3b08e8bd26e5fde69b41a`
- anims.json SHA-256: `60b4dddc3d139aeb6cc92089688eecdd42b7f5ba9e5ed28e2d10eaf30d69edbf`
- Candidate atlas indices: 181–250 (70 frames); stand-in and idle frames came from the same whole-character atlas. All moves are non-looping and timing matches SPEC.
- Branch-manifest strict pack: `node tools/pack-sprites.mjs killua --root art --out <scratch> --manifest art/manifest.json --strict-scale --quantize 48 --no-writeback --json` exited 1 and refused the candidate atlas. Scale-gate failed list: fTilt, dTilt, dashAttack, fSmash, uSmash, dSmash, fair, bair, uair. uTilt was not in that scale-failed list but remains held for assembly/anatomy. The branch production atlas stayed unchanged.
- Packed idle f0 silhouette bounds x68–186 / y85–240 (119×156 px); idle loop median head proxy 41.5×30.5 px, area 740 px. Approved combat reference silhouette x54–201 / y96–240 (148×145); approved neutral x87–168 / y55–240 (82×186). Silhouette dimensions are pose-dependent and are not anatomical stature measures. H/F below are head-color/shoe-color proxies; palette fragmentation, head turns and occlusion can invalidate them. No torso/limb ±6% certification follows.

| Move / atlas cells | H / F median | Audit result |
|---|---:|---|
| fTilt 181–187 (7) | 1.012 / 0.948 | HOLD: connected limbs, no clipping, full recovery. Punch reads near shoulder/face rather than clearly chest height. Torso/clothing segment parity unmeasured. |
| uTilt 188–194 (7) | 0.916 / 0.930 | HOLD: detached extra shoe/leg f1, severed rear leg f2, other shoe cuts. Overhead extension peaks in recovery f4 rather than active f2/f3; missing limbs invalidate scale clearance. |
| dTilt 195–200 (6) | 1.014 / 1.055 | HOLD: deep crouch and low kick read correctly. Active shoes fit (f2 x248, f3 x245). Head/body/leg/shoe parity lacks reliable landmark confirmation. |
| dashAttack 201–207 (7) | 1.049 / 1.013 | HOLD: active f2 is still guarded/chambered; punch occurs f3 and continues through recovery f4. No fist clipping. Body/clothing segment checks remain. |
| fSmash 208–216 (9) | 0.984 / 0.928 | HOLD: connected anatomy; charge/active sequence usable; no severed legs or boundary clipping. Shoes trend smaller than idle; full-body parity unmeasured. |
| uSmash 217–224 (8) | 1.069 / 1.023 | HOLD: first active f3 is guarded/rising; overhead extension occurs f4 and continues in recovery f5. Raised arm occludes head readings f4/f5; no whole-body pass. |
| dSmash 225–232 (8) | 1.144 / 1.019 | HOLD: active f3 strikes left only and f4 right only, contrary to SPEC's both-sides requirement on each active frame. Active hair boxes ~52–53×39 px versus idle ~42×31; feet near reference. |
| fair 233–238 (6) | 0.999 / 0.974 | HOLD: connected forward aerial kick. f2 reaches x253 (2 px beyond x251 safety margin); f3 ends x246. Full-body/style confirmation remains. |
| bair 239–244 (6) | 1.140 / 1.075 | HOLD: right-facing, leftward strike, but active f2/f3 hit x0 and clip the rear foot/leg. Planted support leg and grounded guards read as a standing kick, not an aerial. |
| uair 245–250 (6) | 1.197 / 1.136 | HOLD: upward kick, connected limbs and margins acceptable. Probe identifies the actual head in all six frames; H consistently enlarged 1.148–1.229. Head/torso/clothing size and pose translations remain unresolved. |

## Reconciliations and source constraints

Earlier clipping conclusions based on a different temporary atlas were withdrawn for this exact review pack: dTilt active f2/f3, dashAttack active f3, and fair active f2/f3 are not physically clipped here. fair f2 has a 2 px safety-margin violation without missing pixels. bair remains clipped at x0. uTilt retains source-segmentation limb damage. Near-reference head scale is seen in fTilt, dTilt, dashAttack, fSmash and fair; prior oversized-head readings for those are not applicable to this atlas. uair's head probe is valid here; its earlier raised-shoe false-reading finding is withdrawn.

All ten selected raw sources miss their requested one-row square-cell strip dimensions and keep smooth illustrated rendering rather than the specified hard-pixel source style. Packer identified touching/cut-figure grouping for eight strips. The source canvases range 1536×1024 to 2172×724; exact selected dimensions, SHA-256 values, call UUIDs, prompts and references are in [v02 generation provenance](../../raw/_qa_hold/ENG112_NORMALS_V02_PROVENANCE.md). Selected raw files byte-match those attempts; fTilt call01 was consumed but its output path/UUID was not returned by the wrapper. dSmash attempt02 prompt explicitly asked for alternating left/right active sweeps, contrary to the SPEC's requirement that each active frame strike both sides.

Review page: [v02 packed page](../../../../../../public/reviews/normals-killua/v02/index.html). H/F are proxies only; there is no full-body segment certification, contact validation, technical pass, or implied visual approval.
