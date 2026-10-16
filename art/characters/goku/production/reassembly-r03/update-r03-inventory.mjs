import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const base = path.join(root, 'art/characters/goku/production/reassembly-r03');
const hash = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const invPath = path.join(base, 'final5-fixture-inventory.json');
const inventory = JSON.parse(fs.readFileSync(invPath, 'utf8'));
const pack = JSON.parse(fs.readFileSync(path.join(base, 'production-pack-report.json'), 'utf8'));
const goku = pack.characters.find((c) => c.id === 'goku');
inventory.scaleGate = 'strict';
inventory.strictPack = {
  command: 'node tools/pack-sprites.mjs goku --quantize 48 --strict-scale --no-writeback --json',
  exitCode: 0,
  animations: goku.packed.length,
  frames: goku.frames,
  colors: goku.colors,
  scaleFailures: goku.scale?.failed ?? [],
  allScaleAndFramesX1: goku.packed.every((a) => a.scale === 1 && a.frameScales.every((s) => s === 1)),
  missingCore: goku.missingCore,
  warnings: goku.warnings
};
inventory.firstStrictAttempt = {
  exitCode: 1,
  disposition: 'Invalid fixture: it omitted the exact art/scale/builds.json dependency, so its probe mode/manual-record behavior was not evidence about the art. The fixture builder now copies and hashes this file byte-for-byte.'
};
inventory.fixtureManifestSha256 = hash(path.join(base, 'final5-fixture-art/manifest.json'));
inventory.buildsSnapshotSha256 = hash(path.join(base, 'final5-fixture-art/scale/builds.json'));
inventory.finalAtlasSha256 = hash(path.join(base, 'final5-fixture-public/characters/goku/sheet.png'));
inventory.finalMetadataSha256 = hash(path.join(base, 'final5-fixture-public/characters/goku/anims.json'));
inventory.productionManifestSha256 = hash(path.join(root, 'art/manifest.json'));
inventory.productionAtlasSha256 = hash(path.join(root, 'public/characters/goku/sheet.png'));
inventory.productionMetadataSha256 = hash(path.join(root, 'public/characters/goku/anims.json'));
inventory.finalAtlasMatchesAstra = inventory.finalAtlasSha256 === 'fbccd9bf1958a7d3e7c701ea062aa2b99f031456e3d25cd010a81c47e5286054' && inventory.finalMetadataSha256 === 'e98d7a2addcdbf932438ac43b89f507177b9071194359a40e042bab68fdfdc9f';
inventory.finalAtlasMatchesProduction = inventory.productionAtlasSha256 === inventory.finalAtlasSha256 && inventory.productionMetadataSha256 === inventory.finalMetadataSha256;
inventory.finalAstraAudit = 'art/characters/goku/production/manual-audit-r3/FINAL5_STRICT_AUDIT.md';
inventory.maskComparison = 'art/characters/goku/production/reassembly-r03/final4-final5-mask-comparison.json';
fs.writeFileSync(invPath, JSON.stringify(inventory, null, 2) + '\n');
console.log(JSON.stringify({ scaleGate: inventory.scaleGate, strictPack: inventory.strictPack, finalAtlasSha256: inventory.finalAtlasSha256, finalMetadataSha256: inventory.finalMetadataSha256, finalAtlasMatchesProduction: inventory.finalAtlasMatchesProduction, productionManifestSha256: inventory.productionManifestSha256 }, null, 2));
