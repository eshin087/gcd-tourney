import fs from 'node:fs';
import { createHash } from 'node:crypto';
const assemblyPath = 'art/characters/goku/production/relay11-generation/ASSEMBLY_V13.json';
const assemblyHash = createHash('sha256').update(fs.readFileSync(assemblyPath)).digest('hex').toUpperCase();
for (const file of ['art/characters/goku/raw/_qa_hold/light3_v13.json', 'art/characters/goku/raw/light3_v13.json']) {
  const sidecar = JSON.parse(fs.readFileSync(file, 'utf8'));
  sidecar.bodyHeight = 237;
  sidecar.assemblyEvidenceSha256 = assemblyHash;
  sidecar.status = 'exact final-atlas technical PASS at x1; user drawing approval pending';
  sidecar.finalAudit = 'art/characters/goku/production/manual-audit-r5/FINAL_ATLAS_AUDIT.md';
  sidecar.finalAtlasSheetSha256 = 'ebb27850371179a0fdc9da5d76816ebdb52b747712643b60cd40e14bfe6460ca';
  sidecar.finalAtlasMetadataSha256 = 'b43af90a609dc0a36e688bad916c50694962ce2fced6fb02384cd400bcd814ca';
  fs.writeFileSync(file, JSON.stringify(sidecar, null, 2) + '\n');
}
console.log(JSON.stringify({ assemblyPath, assemblyHash, updated: 2 }));
