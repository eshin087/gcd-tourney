const fs = require('node:fs');
const path = require('node:path');
const { PNG } = require('pngjs');

const root = path.resolve(__dirname, '../../../../..');
const atlasPath = path.join(root, 'public/characters/gojo/sheet.png');
const reviewDir = path.join(root, 'public/reviews/gojo-run-jkl');
const outputPath = path.join(reviewDir, 'dash_v09_contact_v01.png');
const qaPath = path.join(__dirname, 'phase2_dash_qa_v01.json');
const atlas = PNG.sync.read(fs.readFileSync(atlasPath));
const cell = 256;
const entries = [
  { label: 'idle f0', index: 0 },
  { label: 'dash v09 f0', index: 16 },
  { label: 'dash v09 f1', index: 17 },
];

function cropCell(index) {
  const sourceX = (index % 16) * cell;
  const sourceY = Math.floor(index / 16) * cell;
  const image = new PNG({ width: cell, height: cell });
  for (let y = 0; y < cell; y++) {
    const from = ((sourceY + y) * atlas.width + sourceX) * 4;
    const to = y * cell * 4;
    atlas.data.copy(image.data, to, from, from + cell * 4);
  }
  let minX = cell, minY = cell, maxX = -1, maxY = -1;
  for (let y = 0; y < cell; y++) for (let x = 0; x < cell; x++) {
    const alpha = image.data[(y * cell + x) * 4 + 3];
    if (alpha > 0) {
      minX = Math.min(minX, x); minY = Math.min(minY, y);
      maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
    }
  }
  return { image, bounds: { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1, right: maxX, bottom: maxY } };
}

const pad = 8;
const output = new PNG({ width: entries.length * cell, height: cell });
const measured = entries.map((entry, i) => {
  const { image, bounds } = cropCell(entry.index);
  for (let y = 0; y < cell; y++) {
    const from = y * cell * 4;
    output.data.set(image.data.subarray(from, from + cell * 4), (y * output.width + i * cell) * 4);
  }
  return { ...entry, bounds, hairToSolePx: bounds.height, posedWidthPx: bounds.width, xMarginPx: Math.min(bounds.x, cell - 1 - bounds.right) };
});
fs.mkdirSync(reviewDir, { recursive: true });
fs.writeFileSync(outputPath, PNG.sync.write(output));
const qa = {
  date: '2026-10-15', character: 'gojo', animation: 'dash', version: 'v09',
  source: 'public/characters/gojo/sheet.png', sourceSha256: require('node:crypto').createHash('sha256').update(fs.readFileSync(atlasPath)).digest('hex').toUpperCase(),
  atlasFrameIndices: { idleF0: 0, dashF0: 16, dashF1: 17 },
  measurement: 'Alpha bounds in actual quantized atlas; each cell is 256x256 at one shared pixel scale. Bounds measure pose envelope, not skeleton/body height.',
  frames: measured,
  contactSheet: 'public/reviews/gojo-run-jkl/dash_v09_contact_v01.png',
  technical: { packerCommand: 'node tools/pack-sprites.mjs gojo --quantize 48', packerExitCode: 0, scaleGate: 'pass', palette: 48, warnings: ['Existing approved down v05 and ko v06 lying frames float above floor line.', 'Existing light2#3 uses fallback hitbox.'] },
  holds: {
    run: 'v13 not saved; 3/3 calls exhausted. Calls 2 and 3 repeat rather than mirror phases; no candidate.',
    backDash: 'v05 and v06 held; v06 3/3 calls exhausted, scale gate head 1.11 / feet 1.03 of idle.',
    superDash: 'v10 and v11 held; v12 not saved after third call; target aspect/height not achieved.'
  },
  approval: 'Technical review candidate only; no image/design approval claimed.'
};
fs.writeFileSync(qaPath, `${JSON.stringify(qa, null, 2)}\n`);
console.log(JSON.stringify({ outputPath, qaPath, frames: measured, atlasSha256: qa.sourceSha256 }, null, 2));
