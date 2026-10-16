import fs from 'node:fs';
import path from 'node:path';
import { readPng, encodePng, crop } from '../../../../../tools/pack-sprites.mjs';

const root = process.cwd();
const base = 'public/characters/goku/calibration-r4';
const assets = path.join(base, 'assets');
const framesDir = path.join(assets, 'frames');
const refsDir = path.join(assets, 'references');
const evidenceDir = path.join(assets, 'evidence');
for (const d of [framesDir, refsDir, evidenceDir]) fs.mkdirSync(d, { recursive: true });
const sourceDir = 'art/characters/goku/raw/_qa_hold';
const prodDir = 'art/characters/goku/production/relay9-generation';
const copy = (from, to) => fs.copyFileSync(path.join(root, from), path.join(root, to));
const stripSpecs = [
  { asset: 'light3', source: `${prodDir}/light3_v11_48c_diagnostic.png`, count: 7, cell: 256 },
  { asset: 'heavy', source: `${prodDir}/heavy_v13_48c_diagnostic.png`, count: 8, cell: 256 },
  { asset: 'light3-roomy', source: `${prodDir}/light3_v11_roomy_280_48c.png`, count: 7, cell: 280 },
];
for (const spec of stripSpecs) {
  const img = readPng(path.join(root, spec.source));
  for (let i = 0; i < spec.count; i++) {
    const frame = crop(img, i * spec.cell, 0, spec.cell, spec.cell);
    const filename = `${spec.asset}-f${String(i).padStart(2, '0')}.png`;
    fs.writeFileSync(path.join(root, framesDir, filename), encodePng(frame));
  }
  copy(spec.source, `${assets}/${spec.asset}-contact.png`);
}
copy('art/characters/goku/reference/title_style_draft.png', `${refsDir}/title_style_draft.png`);
copy('art/characters/goku/reference/model_sheet.png', `${refsDir}/model_sheet.png`);
copy('art/characters/goku/reference/expressions.png', `${refsDir}/expressions.png`);
copy('art/characters/goku/reference/idle_approved.png', `${refsDir}/idle_approved.png`);
copy('public/characters/goku/calibration-r3/assets/references/approved-reference-lineup.png', `${refsDir}/approved-reference-lineup.png`);
copy(`${sourceDir}/light3_v10.png`, `${evidenceDir}/light3_v10_source.png`);
copy(`${sourceDir}/heavy_v12.png`, `${evidenceDir}/heavy_v12_source.png`);
copy('art/characters/goku/production/manual-audit-r4/SOURCE_SCREEN.md', `${evidenceDir}/SOURCE_SCREEN.md`);
copy(`${prodDir}/ASSEMBLY_R4.json`, `${evidenceDir}/ASSEMBLY_R4.json`);
copy(`${prodDir}/QUANTIZED_FIXTURE_R4.json`, `${evidenceDir}/QUANTIZED_FIXTURE_R4.json`);
copy(`${prodDir}/GENERATION_LEDGER.md`, `${evidenceDir}/GENERATION_LEDGER.md`);
const data = {
  status: {
    drawingApproval: 'PENDING — generated call authorization is not image/design approval.',
    technicalAudit: 'Candidate audit pending; no technical pass is claimed.',
    holdDecision: 'Separate from drawing approval; parent/Claude decision pending.',
    finalAtlas: null,
  },
  animations: {
    light3: { version: 11, cellSize: 256, frameCount: 7, phases: [2,2,3], durationsMs: [40,35,45,60,60,60,30], loop: false, densityFactor: 0.62, filePrefix: 'light3' },
    heavy: { version: 13, cellSize: 256, frameCount: 8, phases: [3,2,3], durationsMs: [40,35,30,50,70,70,60,30], loop: false, densityFactor: 0.73, filePrefix: 'heavy' },
  },
  light3Clipping: {
    sourceScale: 0.62,
    cellSize: 256,
    pivotBottomY: 240,
    clippedForegroundPixelsByFrame: [1,82,0,33,680,2,2],
    totalClippedForegroundPixels: 800,
    roomyCompanionCellSize: 280,
    roomyClippedForegroundPixelsByFrame: [0,0,0,0,0,0,0],
    note: 'Counts are foreground-mask pixels after nearest-neighbor scale and before 48-color quantization; source-to-output resampling deltas are documented separately in assembly evidence.',
  },
};
fs.writeFileSync(path.join(root, base, 'data.json'), JSON.stringify(data, null, 2) + '\n');



