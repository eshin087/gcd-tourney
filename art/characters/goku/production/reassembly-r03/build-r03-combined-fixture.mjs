import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const goku = path.join(root, 'art/characters/goku');
const base = path.join(goku, 'production/reassembly-r03');
const fixtureArt = path.join(base, 'combined-fixture-art');
const fixturePublic = path.join(base, 'combined-fixture-public');
if (fs.existsSync(fixtureArt) || fs.existsSync(fixturePublic)) throw new Error('combined fixture exists; refusing overwrite');
fs.cpSync(path.join(goku, 'production/scale-qa/reassembly-r02/fixture-art'), fixtureArt, { recursive: true });
const manifestPath = path.join(fixtureArt, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const gm = manifest.characters.goku;
gm.scaleGate = 'warn';
const hold = path.join(goku, 'raw/_qa_hold');
const raw = path.join(fixtureArt, 'characters/goku/raw');
const picks = [
  { animation: 'dash', version: 8, bodyHeight: 207 },
  { animation: 'land', version: 7, bodyHeight: 235 },
  { animation: 'down', version: 5, bodyHeight: 115 }
];
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const selected = [];
for (const pick of picks) {
  const name = `${pick.animation}_v${String(pick.version).padStart(2, '0')}`;
  const imagePath = path.join(hold, `${name}.png`);
  const sidecarPath = path.join(hold, `${name}.json`);
  const bytes = fs.readFileSync(imagePath);
  fs.copyFileSync(imagePath, path.join(raw, `${name}.png`));
  fs.copyFileSync(sidecarPath, path.join(raw, `${name}.json`));
  gm.animations[pick.animation].version = pick.version;
  gm.animations[pick.animation].bodyHeight = pick.bodyHeight;
  selected.push({ ...pick, source: `raw/_qa_hold/${name}.png`, sourceSha256: hash(bytes), scaleGate: 'warn-only fixture; no approval or pass implied' });
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
fs.mkdirSync(fixturePublic, { recursive: true });
fs.writeFileSync(path.join(base, 'combined-fixture-inventory.json'), JSON.stringify({
  label: 'Goku r03 combined diagnostic fixture; isolated quantized atlas, warn-only, not a gameplay release or approval.',
  quantizeColors: 48,
  scaleGate: 'warn',
  cell: [256, 256],
  pivot: [128, 240],
  calibratedInheritedSelections: ['guard_v05', 'light2_v05', 'jumpUp_v04', 'jumpFall_v04', 'hurtHigh_v08'],
  newlySelected: selected,
  sourceFixture: 'production/scale-qa/reassembly-r02/fixture-art'
}, null, 2) + '\n');
console.log(JSON.stringify(selected, null, 2));
