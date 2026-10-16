import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const goku = path.join(root, 'art/characters/goku');
const base = path.join(goku, 'production/reassembly-r03');
const src = path.join(base, 'final4-fixture-art');
const fixtureArt = path.join(base, 'final5-fixture-art');
const fixturePublic = path.join(base, 'final5-fixture-public');
if (fs.existsSync(fixtureArt) || fs.existsSync(fixturePublic)) throw new Error('final5 fixture exists; refusing overwrite');
fs.cpSync(src, fixtureArt, { recursive: true });
const fixtureScale = path.join(fixtureArt, 'scale');
fs.mkdirSync(fixtureScale, { recursive: true });
fs.copyFileSync(path.join(root, 'art/scale/builds.json'), path.join(fixtureScale, 'builds.json'));
const raw = path.join(fixtureArt, 'characters/goku/raw');
const hold = path.join(raw, '_qa_hold');
fs.mkdirSync(hold, { recursive: true });
for (const anim of ['light3', 'heavy']) {
  for (const filename of fs.readdirSync(raw)) {
    if (new RegExp(`^${anim}(?:_v\\d+)?\\.(?:png|json)$`).test(filename)) {
      fs.renameSync(path.join(raw, filename), path.join(hold, filename));
    }
  }
}
const manifestPath = path.join(fixtureArt, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.characters.goku.scaleGate = 'strict';
for (const animation of ['light3', 'heavy']) {
  const def = manifest.characters.goku.animations[animation];
  def.version = 0;
  def.status = 'todo';
  def.bodyHeight = 0;
  delete def.scaleManualQA;
}
const passVersions = {
  run: 9, dash: 9, jumpUp: 4, jumpFall: 4, land: 7, light1: 4, light2: 5,
  light4: 9, airLight1: 7, airHeavy: 6, guard: 5, hurtHigh: 8, launched: 8,
  down: 5, getup: 11, charge: 5, beamCharge: 7, beamFire: 7, special: 5, win: 5
};
for (const [animation, version] of Object.entries(passVersions)) {
  const def = manifest.characters.goku.animations[animation];
  def.scaleManualQA = {
    version,
    result: 'pass',
    by: 'GPT-6 Astra (medium) final4 quantized-pixel audit; fixture-only diagnostic record',
    note: 'Exact version-bound anatomy/fit recommendation from FINAL4_AUDIT.md. Private fixture only: no production calibration or approval is implied; final5 uses the same selected pixels at bodyHeight equal to native maximum, pack scale x1.',
    evidence: 'art/characters/goku/production/manual-audit-r3/FINAL4_AUDIT.md'
  };
}
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
const selected = Object.entries(passVersions).map(([animation, version]) => {
  const def = manifest.characters.goku.animations[animation];
  return { animation, version, bodyHeight: def.bodyHeight };
});
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const inventory = {
  label: 'Goku r03 final5 strict selected fixture: idle plus 20 Astra final4-reviewed animation versions; light3 and heavy omitted on calibration hold.',
  warning: 'Private isolated fixture. 20 exact-version Astra manual anatomy/fit recommendations are bound to those selected pixels; this is not a production manifest change or user design approval. Source reassemblies used zero image-generation calls this round.',
  scaleGate: 'strict', quantizeColors: 48, cell: [256, 256], pivot: [128, 240],
  selected, omittedOnHold: ['light3_v09', 'heavy_v11'],
  preservedHeldFiles: ['characters/goku/raw/_qa_hold/light3_v09.png', 'characters/goku/raw/_qa_hold/light3_v09.json', 'characters/goku/raw/_qa_hold/heavy_v11.png', 'characters/goku/raw/_qa_hold/heavy_v11.json'],
  frameCountExpected: 93,
  final4SourceAtlasSha256: 'c5017ea8067c35d2a956be1d1a306970ec20d507879b3208d56876ea2ef810f',
  final4SourceMetadataSha256: '3e5d1714c2c809bd0c19fa0cae08d54c8f825e538e57f9d932031daa38949dda',
  manifestSnapshotSha256: hash(fs.readFileSync(manifestPath)),
  buildsSnapshotSha256: hash(fs.readFileSync(path.join(fixtureScale, 'builds.json'))),
  source: 'A byte copy of final4 fixture art, with only held light3/heavy candidate files removed from the selected raw folder and fixture-only manual audit records attached.'
};
fs.writeFileSync(path.join(base, 'final5-fixture-inventory.json'), JSON.stringify(inventory, null, 2) + '\n');
fs.mkdirSync(fixturePublic, { recursive: true });
console.log(JSON.stringify({ fixtureArt, fixturePublic, selected: selected.length, omitted: inventory.omittedOnHold, manifestSnapshotSha256: inventory.manifestSnapshotSha256 }, null, 2));
