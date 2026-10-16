import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';

const root = process.cwd();
const goku = path.join(root, 'art/characters/goku');
const base = path.join(goku, 'production/reassembly-r03');
const fixtureArt = path.join(base, 'fixture-art');
const fixturePublic = path.join(base, 'fixture-public');
if (fs.existsSync(fixtureArt) || fs.existsSync(fixturePublic)) throw new Error('r03 fixture already exists; refusing overwrite');
fs.cpSync(path.join(goku, 'production/scale-qa/reassembly-r02/fixture-art'), fixtureArt, { recursive: true });
const manifestPath = path.join(fixtureArt, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const gm = manifest.characters.goku;
gm.scaleGate = 'warn';
const picks = [
  { animation: 'dash', version: 7, bodyHeight: 207, source: 'dash_v07.png' },
  { animation: 'land', version: 7, bodyHeight: 235, source: 'land_v07.png' }
];
const raw = path.join(fixtureArt, 'characters/goku/raw');
const hold = path.join(goku, 'raw/_qa_hold');
const hash = (b) => crypto.createHash('sha256').update(b).digest('hex');
const records = [];
for (const p of picks) {
  const src = path.join(hold, p.source), bytes = fs.readFileSync(src);
  const image = PNG.sync.read(bytes);
  if (image.height !== 256 || image.width % 256) throw new Error(`${p.animation}: not a 256px strip`);
  const destName = `${p.animation}_v${String(p.version).padStart(2, '0')}.png`;
  fs.copyFileSync(src, path.join(raw, destName));
  const anim = gm.animations[p.animation];
  anim.bodyHeight = p.bodyHeight;
  anim.version = p.version;
  records.push({ ...p, stagedFile: `characters/goku/raw/${destName}`, sourceSha256: hash(bytes), bodyHeightForX1: p.bodyHeight, approvalFieldsPreserved: true });
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(path.join(base, 'fixture-inventory.json'), JSON.stringify({
  label: 'Goku r03 source reassembly fixture. Isolated warn-only quantized pixels; no art approval implied.',
  scaleGate: 'warn', quantizeColors: 48, cell: [256, 256], pivot: [128, 240],
  selection: records, sourceFixture: 'production/scale-qa/reassembly-r02/fixture-art'
}, null, 2) + '\n');
fs.mkdirSync(fixturePublic, { recursive: true });
console.log(JSON.stringify(records, null, 2));
