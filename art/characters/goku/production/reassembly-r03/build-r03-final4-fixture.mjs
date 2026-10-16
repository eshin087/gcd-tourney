import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const goku = path.join(root, 'art/characters/goku');
const base = path.join(goku, 'production/reassembly-r03');
const fixtureArt = path.join(base, 'final4-fixture-art');
const fixturePublic = path.join(base, 'final4-fixture-public');
if (fs.existsSync(fixtureArt) || fs.existsSync(fixturePublic)) throw new Error('final4 fixture exists; refusing overwrite');
const raw = path.join(fixtureArt, 'characters/goku/raw');
const ref = path.join(fixtureArt, 'characters/goku/reference');
fs.mkdirSync(path.dirname(raw), { recursive: true });
fs.cpSync(path.join(goku, 'raw'), raw, { recursive: true });
fs.cpSync(path.join(goku, 'reference'), ref, { recursive: true });
const manifestPath = path.join(fixtureArt, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'art/manifest.json'), 'utf8'));
manifest.characters.goku.scaleGate = 'warn';
const picks = [
  { animation: 'dash', version: 9, bodyHeight: 207 },
  { animation: 'land', version: 7, bodyHeight: 235 },
  { animation: 'down', version: 5, bodyHeight: 115 },
  { animation: 'beamCharge', version: 7, bodyHeight: 236 },
  { animation: 'beamFire', version: 7, bodyHeight: 233 },
  { animation: 'run', version: 9, bodyHeight: 237 },
  { animation: 'light1', version: 4, bodyHeight: 237 },
  { animation: 'light3', version: 9, bodyHeight: 237 },
  { animation: 'light4', version: 9, bodyHeight: 237 },
  { animation: 'heavy', version: 11, bodyHeight: 237 },
  { animation: 'airLight1', version: 7, bodyHeight: 237 },
  { animation: 'airHeavy', version: 6, bodyHeight: 237 },
  { animation: 'launched', version: 8, bodyHeight: 200 },
  { animation: 'getup', version: 11, bodyHeight: 237 },
  { animation: 'special', version: 5, bodyHeight: 237 },
  { animation: 'win', version: 5, bodyHeight: 237 },
  { animation: 'charge', version: 5, bodyHeight: 237 }
];
const hold = path.join(goku, 'raw/_qa_hold');
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const records = [];
for (const pick of picks) {
  const filename = `${pick.animation}_v${String(pick.version).padStart(2, '0')}`;
  const bytes = fs.readFileSync(path.join(hold, `${filename}.png`));
  const sidecar = JSON.parse(fs.readFileSync(path.join(hold, `${filename}.json`), 'utf8'));
  fs.writeFileSync(path.join(raw, `${filename}.png`), bytes);
  fs.writeFileSync(path.join(raw, `${filename}.json`), JSON.stringify(sidecar, null, 2) + '\n');
  manifest.characters.goku.animations[pick.animation].version = pick.version;
  manifest.characters.goku.animations[pick.animation].bodyHeight = pick.bodyHeight;
  records.push({ ...pick, factor: sidecar.selectedFactor ?? sidecar.factor ?? null, sourceSha256: sidecar.sourceSha256 ?? null, outputSha256: hash(bytes), factorMethod: sidecar.factorMethod ?? null, frameOffsets: sidecar.frameOffsets ?? null, rawLoss: sidecar.sourcePixelsLostAtRawAssembly ?? sidecar.totalLostPixels ?? sidecar.frames?.reduce((n, f) => n + (f.lostNonMagenta ?? f.lost ?? 0), 0) ?? 0 });
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
fs.mkdirSync(fixturePublic, { recursive: true });
fs.writeFileSync(path.join(base, 'final4-fixture-inventory.json'), JSON.stringify({
  label: 'Goku r03 final4 combined 48-color quantized diagnostic fixture. Source-bound candidates plus current calibrated pixels; isolated warn-only copy; no source approvals, body-size approvals, or production scale passes implied.',
  warning: 'All candidates are deterministic reassemblies of existing drawings; zero generator calls this round. Existing drawing approvals remain attached only to their original approved versions. This fixture changes version/bodyHeight selection in its private manifest copy only.',
  scaleGate: 'warn', quantizeColors: 48, cell: [256, 256], pivot: [128, 240],
  selectedNew: records,
  calibratedCurrentRows: ['guard_v05=229', 'light2_v05=236', 'jumpUp_v04=206', 'jumpFall_v04=232', 'hurtHigh_v08=223'],
  fixtureManifestSourceSha256: hash(fs.readFileSync(path.join(root, 'art/manifest.json'))),
  fixtureRawSource: 'current worktree art/characters/goku/raw copied at build time'
}, null, 2) + '\n');
console.log(JSON.stringify(records, null, 2));
