import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const goku = path.join(root, 'art/characters/goku');
const base = path.join(goku, 'production/reassembly-r03');
const fixtureArt = path.join(base, 'final-fixture-art');
const fixturePublic = path.join(base, 'final-fixture-public');
if (fs.existsSync(fixtureArt) || fs.existsSync(fixturePublic)) throw new Error('final fixture exists; refusing overwrite');
const raw = path.join(fixtureArt, 'characters/goku/raw');
const ref = path.join(fixtureArt, 'characters/goku/reference');
fs.mkdirSync(path.dirname(raw), { recursive: true });
fs.cpSync(path.join(goku, 'raw'), raw, { recursive: true });
fs.cpSync(path.join(goku, 'reference'), ref, { recursive: true });
const manifestPath = path.join(fixtureArt, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'art/manifest.json'), 'utf8'));
manifest.characters.goku.scaleGate = 'warn';
const selected = [
  { animation: 'dash', version: 9, bodyHeight: 207 },
  { animation: 'land', version: 7, bodyHeight: 235 },
  { animation: 'down', version: 5, bodyHeight: 115 }
];
const hold = path.join(goku, 'raw/_qa_hold');
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const records = [];
for (const pick of selected) {
  const filename = `${pick.animation}_v${String(pick.version).padStart(2, '0')}`;
  const bytes = fs.readFileSync(path.join(hold, `${filename}.png`));
  const sidecar = JSON.parse(fs.readFileSync(path.join(hold, `${filename}.json`), 'utf8'));
  fs.writeFileSync(path.join(raw, `${filename}.png`), bytes);
  fs.writeFileSync(path.join(raw, `${filename}.json`), JSON.stringify(sidecar, null, 2) + '\n');
  manifest.characters.goku.animations[pick.animation].version = pick.version;
  manifest.characters.goku.animations[pick.animation].bodyHeight = pick.bodyHeight;
  records.push({ ...pick, sourceSha256: hash(bytes), factor: sidecar.selectedFactor ?? sidecar.factor ?? null, sidecar: `characters/goku/raw/${filename}.json` });
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
fs.mkdirSync(fixturePublic, { recursive: true });
fs.writeFileSync(path.join(base, 'final-fixture-inventory.json'), JSON.stringify({
  label: 'Goku r03 complete-source diagnostic fixture. Exact current manifest copied then scoped to selected candidates. Warn-only pack; no approval or gameplay status implied.',
  scaleGate: 'warn',
  quantizeColors: 48,
  cell: [256, 256],
  pivot: [128, 240],
  calibratedSelectionsPreservedFromCurrentManifest: ['guard_v05', 'light2_v05', 'jumpUp_v04', 'jumpFall_v04', 'hurtHigh_v08'],
  selectedNew: records,
  fixtureRawSource: 'current worktree art/characters/goku/raw copied at build time',
  fixtureManifestSourceSha256: hash(fs.readFileSync(path.join(root, 'art/manifest.json')))
}, null, 2) + '\n');
console.log(JSON.stringify(records, null, 2));
