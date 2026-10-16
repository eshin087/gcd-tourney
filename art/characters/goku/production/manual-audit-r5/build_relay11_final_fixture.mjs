import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const base = 'art/characters/goku/production/manual-audit-r5';
const fixtureArt = path.join(base, 'final-fixture-art');
const fixturePublic = path.join(base, 'final-fixture-public');
if (fs.existsSync(fixtureArt) || fs.existsSync(fixturePublic)) throw new Error('r5 final fixture already exists');
fs.cpSync('art/characters/goku/production/reassembly-r03/final6-fixture-art', fixtureArt, { recursive: true });
fs.mkdirSync(fixturePublic, { recursive: true });
const manifestPath = path.join(fixtureArt, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const goku = manifest.characters.goku;
goku.scaleGate = 'strict';
const light3 = goku.animations.light3;
light3.version = 13;
light3.status = 'raw';
light3.bodyHeight = 237;
delete light3.scaleManualQA;
const source = 'art/characters/goku/raw/_qa_hold/light3_v13.png';
const sourceSidecar = 'art/characters/goku/raw/_qa_hold/light3_v13.json';
const fixtureRaw = path.join(fixtureArt, 'characters/goku/raw');
fs.mkdirSync(fixtureRaw, { recursive: true });
fs.copyFileSync(source, path.join(fixtureRaw, 'light3_v13.png'));
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
fs.writeFileSync(path.join(fixtureRaw, 'light3_v13.json'), JSON.stringify({
  ...JSON.parse(fs.readFileSync(sourceSidecar, 'utf8')),
  bodyHeight: 237,
  scaleCap: 'Ordinary manifest bodyHeight 237 cap applied by normal packer to 238px native extent; actual packed ratio 237/238 = 0.9957983193. This is not x1 and is not eligible for scaleManualQA under the current inbox rule.',
  evidence: 'art/characters/goku/production/manual-audit-r5/SOURCE_SCREEN.md; production/manual-audit-r5/Astra candidate audit'
}, null, 2) + '\n');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
const selected = Object.entries(goku.animations)
  .filter(([name, def]) => name === 'idle' || (def.version > 0 && def.scaleManualQA?.result === 'pass'))
  .map(([animation, def]) => ({ animation, version: def.version, bodyHeight: def.bodyHeight, frames: def.frames }));
const inventory = {
  schema: 'goku-relay11-final-atlas-fixture-v1',
  status: 'isolated provisional strict pack; candidate-level Astra anatomy/scale pass, but 237/238 cap is not x1; final combined audit pending; drawing approval pending',
  scaleGate: 'strict', quantizeColors: 48, cell: [256, 256], pivot: [128, 240],
  selected, selectedAnimationCount: selected.length,
  expectedFrameCount: selected.reduce((n, row) => n + row.frames, 0),
  candidate: { animation: 'light3', version: 13, bodyHeight: 237, source, sourceSha256: sha(source), assembled: 'art/characters/goku/raw/_qa_hold/light3_v13.png', assembledSha256: sha('art/characters/goku/raw/_qa_hold/light3_v13.png'), sourceFactor: 0.696133442603862, operationalFactor: 0.696133, actualNativeScaleRatio: 237 / 238, scaleManualQA: 'not permitted: pack ratio is fractional, not x1' },
  priorApprovedCandidate: { animation: 'heavy', version: 14, userApproval: 'relay #10', finalAudit: 'art/characters/goku/production/manual-audit-r4/FINAL_STRICT_AUDIT.md' },
  omittedOnHold: [],
  retainedBaseline: 'byte copy of exact relay9 final6 fixture (93-frame baseline plus approved heavy14); light3 v13 added only inside isolated fixture',
  sourceFixtureBuildsSha256: sha(path.join(fixtureArt, 'scale/builds.json')),
  manifestSnapshotSha256: sha(manifestPath),
  actualBranchPublicAtlasTouched: false,
};
fs.writeFileSync(path.join(base, 'final-fixture-inventory.json'), JSON.stringify(inventory, null, 2) + '\n');
console.log(JSON.stringify({ fixtureArt, fixturePublic, selectedAnimationCount: inventory.selectedAnimationCount, frameCount: inventory.expectedFrameCount, candidate: inventory.candidate, manifestSnapshotSha256: inventory.manifestSnapshotSha256 }, null, 2));
