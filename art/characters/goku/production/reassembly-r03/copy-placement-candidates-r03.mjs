import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const goku = path.join(root, 'art/characters/goku');
const hold = path.join(goku, 'raw/_qa_hold');
const candidates = [
  { animation: 'run', from: 8, to: 9, bodyHeight: 237, dx: { 2: -1, 3: 40, 4: -15, 5: 18, 6: 37 }, basis: 'packer report final3: f2 right margin1; f3 left clip36; f4 right clip11; f5 left clip14; f6 left clip33. Offsets place bounds into x=4..251; source-width maximum202px.' },
  { animation: 'light4', from: 8, to: 9, bodyHeight: 237, dx: { 4: -32, 5: -25 }, basis: 'packer report final3: f4 right clip28; f5 right clip21. Offsets place bounds into x=4..251; source-width maximum227px.' },
  { animation: 'heavy', from: 10, to: 11, bodyHeight: 237, dx: { 3: -27, 4: -39, 5: -36 }, basis: 'packer report final3: f3 right clip23; f4 right clip35; f5 right clip32. Offsets place bounds into x=4..251; source-width maximum225px.' },
  { animation: 'airLight1', from: 6, to: 7, bodyHeight: 237, dx: { 1: -4, 2: -74, 3: -66 }, basis: 'packer report final3: f1 right margin4; f2 right clip70; f3 right clip62. Offsets place bounds into x=4..251; source-width maximum226px.' },
  { animation: 'launched', from: 7, to: 8, bodyHeight: 200, dx: { 0: 24, 1: 42 }, basis: 'packer report final3: f0 left clip20; f1 left clip38. Offsets place bounds into x=4..251; source-width maximum218px.' }
];
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const results = [];
for (const c of candidates) {
  const input = `${c.animation}_v${String(c.from).padStart(2, '0')}`;
  const output = `${c.animation}_v${String(c.to).padStart(2, '0')}`;
  const pngIn = path.join(hold, `${input}.png`), jsonIn = path.join(hold, `${input}.json`);
  const pngOut = path.join(hold, `${output}.png`), jsonOut = path.join(hold, `${output}.json`);
  if (!fs.existsSync(pngIn) || !fs.existsSync(jsonIn) || fs.existsSync(pngOut) || fs.existsSync(jsonOut)) throw new Error(`missing input or refusing overwrite: ${output}`);
  const bytes = fs.readFileSync(pngIn), side = JSON.parse(fs.readFileSync(jsonIn, 'utf8'));
  const n = side.frames?.length ?? side.sourceGrid?.[2] ?? side.sourceCellPx?.[0];
  if (!Number.isInteger(n) || !n) throw new Error(`cannot infer frame count for ${input}`);
  const frameOffsets = Array.from({ length: n }, (_, i) => [c.dx[i] ?? 0, 0]);
  const newSide = { ...side, version: c.to, frameOffsets, status: 'diagnostic technical hold; same source pixels and factor, packer placement correction only; exact combined-palette audit pending', placementCorrection: { fromVersion: c.from, rule: 'dx from exact final3 packer clip/margin extent; dy=0; measured max silhouettes fit within x 4..251 without changing scale', basis: c.basis, sourcePngSha256: sha(bytes) } };
  fs.writeFileSync(pngOut, bytes);
  fs.writeFileSync(jsonOut, JSON.stringify(newSide, null, 2) + '\n');
  results.push({ animation: c.animation, version: c.to, bodyHeight: c.bodyHeight, sourcePixelsSha256: sha(bytes), frameOffsets, sourceFactor: side.selectedFactor ?? side.factor ?? null, basis: c.basis });
}
fs.writeFileSync(path.join(goku, 'production/reassembly-r03/placement-candidates-r03.json'), JSON.stringify({ method: 'Exact translation from final3 packer clip report; no scaling or drawing changes.', candidates: results }, null, 2) + '\n');
console.log(JSON.stringify(results, null, 2));
