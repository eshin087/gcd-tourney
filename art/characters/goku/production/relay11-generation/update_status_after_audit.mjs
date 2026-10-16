import fs from 'node:fs';
const promptPath = 'art/characters/goku/PROMPTS.md';
let prompts = fs.readFileSync(promptPath, 'utf8');
const oldPrompt = 'Its candidate-level Astra anatomy/scale audit passes within uncertainty; the exact 108-frame atlas audit remains pending. The calibrated source factor is .696133442603862 from approved-reference torso/boot/belt landmarks; the normal fixture uses bodyHeight237 and the packer retained the observed 238px extent at x1 within native tolerance. No production `scaleManualQA`, atlas adoption, or drawing approval is claimed before the final combined audit.';
const newPrompt = 'Astra passed the exact 23-animation/108-frame strict quantized atlas within measurement uncertainty; all 101 retained frames are alpha-identical to the prior audited baseline and light3 v13 packed at x1. Its calibrated source factor .696133442603862 comes from multi-reference torso/boot/belt landmarks, not posed-bbox fit. `scaleManualQA` is version-bound to `production/manual-audit-r5/FINAL_ATLAS_AUDIT.md`; user drawing approval remains pending.';
if (!prompts.includes(oldPrompt)) throw new Error('PROMPTS relay11 status paragraph changed unexpectedly');
prompts = prompts.replace(oldPrompt, newPrompt);
fs.writeFileSync(promptPath, prompts);

const trackerPath = 'art/TRACKER.md';
let tracker = fs.readFileSync(trackerPath, 'utf8');
const oldTracker = 'Astra\'s exact 48-color seven-cell candidate audit found anatomy/scale PASS within uncertainty. Isolated final fixture contains 23 animations/108 frames; normal pack retained the 238px source extent at x1 under its 237px native tolerance. The final exact combined-atlas Astra audit is pending; no production manualQA or drawing approval is claimed for light3.';
const newTracker = 'Astra passed the exact 23-animation/108-frame quantized atlas within measurement uncertainty; all 101 retained alpha masks match the prior audited baseline and light3 v13 packs x1 at bodyHeight237 within native-size tolerance. The real strict branch pack reproduces audited sheet/meta hashes. Manifest newest version is 13 with technical `scaleManualQA` bound to the final audit; approvedVersion remains 4 and user drawing approval is still pending.';
if (!tracker.includes(oldTracker)) throw new Error('TRACKER relay11 status paragraph changed unexpectedly');
tracker = tracker.replace(oldTracker, newTracker);
tracker = tracker.replace('The exact 48-color atlas contains 22 animations / 101 frames and passes Astra review; branch sheet/meta hashes are f117d996d5d9f225b13bfc6d7b19a741e603fa04a329b1410422263eadd824f2 and 2ee25e2a2103a145f1a888700b5e55cd19ddb0fd7a755649f1056226e6fdbbd6.', 'The exact 48-color atlas contains 23 animations / 108 frames and passes Astra review; branch sheet/meta hashes are ebb27850371179a0fdc9da5d76816ebdb52b747712643b60cd40e14bfe6460ca and b43af90a609dc0a36e688bad916c50694962ce2fced6fb02384cd400bcd814ca.');
tracker = tracker.replace('light3 v11 is held for 800 clipped pixels in the standard 256px cell and remains excluded; its same-density 280px companion preserves all scaled pixels.', 'Light3 v11 remains a historical 800-pixel clipping hold; light3 v13 passed the exact final atlas audit at x1 and awaits user drawing approval.');
tracker = tracker.replace('../public/characters/goku/calibration-r4/index.html', '../public/characters/goku/calibration-r5/index.html');
fs.writeFileSync(trackerPath, tracker);

const reviewPath = 'art/characters/goku/REVIEW_ROWS.md';
let review = fs.readFileSync(reviewPath, 'utf8');
review = review.replace('| candidate anatomy/scale PASS; combined audit pending; no drawing approval |', '| exact 108-frame technical PASS; user drawing approval pending |');
review = review.replace('| candidate anatomy/scale PASS; exact combined-atlas audit pending; user drawing approval pending |', '| exact 108-frame technical PASS; user drawing approval pending |');
review = review.replace('Candidate audit: `production/manual-audit-r5/CANDIDATE_AUDIT.md`. Isolated 108-frame fixture report retained under `production/manual-audit-r5/`; actual public atlas remains unchanged until final audit.', 'Final atlas audit: `production/manual-audit-r5/FINAL_ATLAS_AUDIT.md`; exact branch pack reproduces audited hashes. The atlas includes v13 technically; user drawing approval is still pending.');
fs.writeFileSync(reviewPath, review);

const inventoryPath = 'art/characters/goku/production/manual-audit-r5/final-fixture-inventory.json';
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
inventory.status = 'exact 48-color combined pack passed final Astra audit; drawing approval pending';
inventory.finalAudit = 'art/characters/goku/production/manual-audit-r5/FINAL_ATLAS_AUDIT.md';
inventory.realBranchStrictPackReproducedFixture = true;
inventory.actualBranchPublicAtlasTouched = true;
inventory.finalFixtureSheetSha256 = 'ebb27850371179a0fdc9da5d76816ebdb52b747712643b60cd40e14bfe6460ca';
inventory.finalFixtureMetadataSha256 = 'b43af90a609dc0a36e688bad916c50694962ce2fced6fb02384cd400bcd814ca';
inventory.realPackReportSha256 = '5bb6457a15ad00bca088fc52cb3def3b43c60bb4f0de36e0ba9b19d99602f13d';
fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2) + '\n');

console.log('Updated Goku-only prompt, tracker, review rows and relay11 inventory after exact final atlas audit.');
