// Review-only neutral calibration. No production atlas or animation data is written.
import fs from 'node:fs';
import { readPng, encodePng, newImage, crop, blit, bbox, removeBackground, removeSpecks, resample, quantizeFrames } from '../../tools/pack-sprites.mjs';
const out = 'public/art-review/cast-proportion-pilot';
const cell = 320, floor = 304;
// Skull crowns inferred under hair by visual inspection, +/-10 source px.
// Soles are measured by the cleaned silhouette. Same 200/166 px-per-cm for everyone.
const rows = [
  { id: 'naruto', cm: 166, crownY: 153 },
  { id: 'sasuke', cm: 168, crownY: 165 },
  { id: 'killua', cm: 158, crownY: 176 },
  { id: 'gojo', cm: 190, crownY: 108 },
];
const board = newImage(cell * 4, cell);
for (let y = 0; y < cell; y++) for (let x = 0; x < board.w; x++)
  board.data.set(y === floor ? [93,110,134,255] : [24,29,42,255], (y * board.w + x) * 4);
const measurements = [];
function save(path, img) {
  if (fs.existsSync(path)) throw Error('Refusing overwrite: ' + path);
  fs.writeFileSync(path, encodePng(img));
}
for (const [col, row] of rows.entries()) {
  const file = 'art/characters/' + row.id + '/reference/height_neutral_v01.png';
  const img = readPng(file);
  removeBackground(img, { tol: 72, mode: 'char' }); removeSpecks(img);
  const b = bbox(img), sourceBody = b.y1 - row.crownY;
  const targetBody = row.cm * 200 / 166, factor = targetBody / sourceBody;
  const scaled = resample(crop(img, b.x0, b.y0, b.w, b.h), factor);
  const frame = newImage(cell, cell);
  const y = floor - scaled.h + 1;
  const lost = blit(frame, scaled, Math.round((cell - scaled.w) / 2), y);
  const palette = quantizeFrames([frame], 48);
  const packed = bbox(frame);
  if (lost || packed.x0 < 4 || packed.y0 < 4 || packed.x1 > 315) throw Error('Clipping: ' + row.id);
  save(out + '/' + row.id + '-neutral_v01.png', frame);
  blit(board, frame, col * cell, 0);
  measurements.push({ ...row, file, sourceBounds: b, sourceBody, targetBody, factor,
    estimatedCrownInCell: floor - targetBody, uncertaintyPx: 10 * factor,
    occupiedHeight: packed.h, palette, clipped: lost });
}
save(out + '/height_lineup_v01.png', board);
fs.writeFileSync(out + '/height_qa_v01.json', JSON.stringify({
  status: 'needs review', method: 'Neutral upright source, inferred skull crown to shoe sole; uniform scaling, 200/166 pixels per cm.',
  caveats: 'Gojo 190 is a conservative working value, not an exact canon height. Skull hidden by hair: +/-10 source px. Shoe soles used consistently, not barefoot anthropometry. Generated neutral references are new candidates, not proof old combat anatomy matches. Production scale gate not applicable to these static references.',
  measurements
}, null, 2) + '\n');
console.log(JSON.stringify(measurements.map(({ id, targetBody, occupiedHeight, palette, clipped }) => ({ id, targetBody, occupiedHeight, palette, clipped })), null, 2));
