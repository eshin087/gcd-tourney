import fs from 'node:fs';
import crypto from 'node:crypto';
const source = 'art/characters/goku/production/reassembly-r03/final6-fixture-art/manifest.json';
const target = 'art/characters/goku/production/manual-audit-r5/final-fixture-art/manifest.json';
const manifest = JSON.parse(fs.readFileSync(source, 'utf8'));
const goku = manifest.characters.goku;
goku.scaleGate = 'strict';
const light3 = goku.animations.light3;
light3.version = 13;
light3.status = 'raw';
light3.bodyHeight = 237;
delete light3.scaleManualQA;
light3.scaleManualQA = {
  version: 13,
  result: 'pass',
  by: 'GPT-6 Astra (medium), exact 7-cell 48-color candidate audit',
  note: 'Candidate-level anatomy/scale pass only for the uniform .696133 assembly within measurement uncertainty. This fixture record permits inspection of exact combined atlas pixels; it is not a final-atlas pass, production calibration decision, drawing approval, release approval, or runtime/contact approval. Actual packed ratio must be read from the normal pack report.',
  evidence: 'art/characters/goku/production/manual-audit-r5/CANDIDATE_AUDIT.md'
};
const output = JSON.stringify(manifest, null, 2) + '\n';
fs.writeFileSync(target, output);
console.log(JSON.stringify({ target, sha256: crypto.createHash('sha256').update(output).digest('hex'), scaleGate: goku.scaleGate, light3 }, null, 2));
