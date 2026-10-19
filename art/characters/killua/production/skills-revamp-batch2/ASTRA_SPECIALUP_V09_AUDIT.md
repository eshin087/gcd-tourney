# Astra anatomy and scale review: Killua `specialUp` v09

**Result: HOLD.** This is a raw-source review only. The formal final audit on the actual quantized v09 atlas is pending because the packer did not write that atlas.

## Evidence

- Source inspected: `art/characters/killua/raw/specialUp_v09.png` (2172x724; exact selected generator output, hash in the batch 2 attempt inventory).
- References: approved title-style neutral/combat cells, `reference/idle_approved.png`, production contract, and `SKILLS_REVAMP.md` §4 B1.
- `node tools/pack-sprites.mjs killua --quantize 48` detected six poses, then failed the within-strip head scale gate: f0 is 1.12x idle; f5 is 0.78x idle. It wrote no quantized v09 atlas.
- `frames/specialUp/.packer.json` identifies v08, not v09. The `npm run body -- killua specialUp` result measures the existing v08 frame set; it is not v09 evidence.

## Visual findings

- f0: low coil, open hands, intact limbs; identity and costume read clearly.
- f1: upward launch reads; one leg extends, the other stays strongly tucked.
- f2-f3: up-forward claw and rear arm read, but the poses are very similar and f3 does not clearly trail both legs.
- f4: apex tuck and raised open hand read; palm orientation is ambiguous.
- f5: approximately 45-degree palm-first dive reads; face is fierce and legs trail. The rear arm is mostly occluded, so its required swept-back anatomy cannot be confirmed.
- Hair, youthful build, purple shirt, navy shorts and high-tops stay visually consistent. No obvious raw-image edge cropping. Torso/limb segment measurement is uncertain in the foreshortened f0/f4/f5 poses.

Do not exempt or resize from the probe alone: the f0-f5 difference could include rotation or segmentation, but the current evidence cannot establish that. Resolve the gate, produce the actual quantized v09 atlas, then re-audit all six frames and measure head, torso, arms, legs and shoes. No numeric anatomy/scale pass and no visual approval are claimed here.
