import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { readPng, encodePng, crop, blit, newImage } from '../../../../../tools/pack-sprites.mjs';

const root = process.cwd();
const gallery = 'public/characters/goku/calibration-r5';
const actual = 'public/characters/goku';
const assets = path.join(gallery, 'assets');
const finalDir = path.join(assets, 'final-atlas');
const framesDir = path.join(assets, 'frames-final');
fs.mkdirSync(finalDir, { recursive: true });
fs.mkdirSync(framesDir, { recursive: true });
const sheetPath = path.join(actual, 'sheet.png');
const metadataPath = path.join(actual, 'anims.json');
const sheetBytes = fs.readFileSync(sheetPath);
const metaBytes = fs.readFileSync(metadataPath);
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const sheet = readPng(sheetPath);
const meta = JSON.parse(metaBytes.toString('utf8'));
const manifest = JSON.parse(fs.readFileSync('art/manifest.json', 'utf8'));
const defs = manifest.characters.goku.animations;
const result = {
  sheet: '../sheet.png', metadata: '../anims.json', sheetSha256: hash(sheetBytes), metadataSha256: hash(metaBytes),
  frameCount: Object.values(meta.animations).reduce((n, a) => n + a.frames.length, 0),
  animationCount: Object.keys(meta.animations).length, animations: {}
};
fs.copyFileSync(sheetPath, path.join(finalDir, 'sheet.png'));
fs.copyFileSync(metadataPath, path.join(finalDir, 'anims.json'));
for (const [name, animation] of Object.entries(meta.animations)) {
  const cellFiles = [];
  const cells = animation.frames.map((index, frameIndex) => {
    const x = (index % meta.columns) * meta.frameWidth;
    const y = Math.floor(index / meta.columns) * meta.frameHeight;
    const frame = crop(sheet, x, y, meta.frameWidth, meta.frameHeight);
    const file = `${name}-f${String(frameIndex).padStart(2, '0')}.png`;
    cellFiles.push(`assets/frames-final/${file}`);
    fs.writeFileSync(path.join(framesDir, file), encodePng(frame));
    return frame;
  });
  const contact = newImage(cells.length * meta.frameWidth, meta.frameHeight);
  cells.forEach((cell, i) => blit(contact, cell, i * meta.frameWidth, 0));
  const contactPath = `assets/final-atlas/${name}-contact.png`;
  fs.writeFileSync(path.join(gallery, contactPath), encodePng(contact));
  const def = defs[name] || {};
  result.animations[name] = {
    frameCount: animation.frames.length,
    frameIndices: animation.frames,
    durationsMs: animation.durations,
    loop: animation.loop,
    phases: animation.phases,
    version: def.version,
    bodyHeight: def.bodyHeight,
    framePaths: cellFiles,
    contact: contactPath
  };
}
const dataPath = path.join(gallery, 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
data.status.technicalAudit = 'PASS — exact 23-animation/108-frame strict atlas. Light3 v13 passed anatomy/scale at x1; heavy v14 remains passed. These technical findings do not approve the light3 drawing.';
data.status.drawingApproval = 'PENDING — review request: approve Goku light3 v13. Heavy v14 remains user-approved via Claude relay #10 (“Approved”).';
data.status.holdDecision = 'Light3 v13 is technically audited and presented for drawing approval; no separate hold decision is recorded.';
data.status.finalAtlas = 'Exact branch strict atlas audited PASS by Astra: 23 animations / 108 frames. Light3 v13 is included technically; user drawing approval remains pending.';
data.finalAtlas = result;
data.relay11.finalFixtureSheetSha256 = result.sheetSha256;
data.relay11.finalFixtureMetadataSha256 = result.metadataSha256;
data.relay11.finalFixtureFrames = result.frameCount;
data.relay11.retainedBaselineAlphaDifferences = 0;
data.relay11.realBranchPackReproducedFixture = true;
data.relay11.actualBranchAtlasChanged = true;
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');

const htmlPath = path.join(gallery, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace('Light3 v13 has a candidate-level anatomy/scale PASS; final combined-atlas audit and user drawing approval are pending.', 'Light3 v13 passed Astra’s exact 108-frame atlas audit at x1; user drawing approval is pending.');
html = html.replace('<h2>Current actual branch atlas (light3 v13 excluded)</h2>', '<h2>Actual branch atlas after exact final audit</h2>');
html = html.replace('This actual branch atlas is the unchanged audited r4 build: 93 retained frames plus heavy v14 (101 total). Light3 v13 remains a separate candidate and is excluded. Heavy v14 was approved via relay #10; light3 v13 combined audit and drawing approval are pending.', 'This actual branch atlas contains 23 animations / 108 frames. Astra passed the exact 48-color pixels; light3 v13 is technically included at x1, but user drawing approval remains pending. Heavy v14 remains user-approved via relay #10.');
html = html.replace('<p class="small">The player below reads the exact audited branch public sheet and anims.json. Heavy v14 is user-approved; light3 v13 remains a separate unapproved candidate and is excluded.</p>', '<p class="small">The player below reads the exact audited branch public sheet and anims.json. Light3 v13 is technically included; drawing approval remains pending.</p>');
const reviewVerdict = `<section class="panel state"><h2>Review request: approve Goku light3 v13</h2><p><b>Identity:</b> face, hair, orange gi, blue clothing and boots match the approved references.</p><p><b>Proportions and pose:</b> compact stomach-height front kick with chamber, two extensions, bent-knee retraction and guard recovery; anatomy is consistent within stated measurement uncertainty.</p><p><b>Technical:</b> exact 108-frame strict 48-color atlas PASS at x1 with zero retained-frame alpha differences; top margin is narrow but there is no clipping. Existing getup grounding/contact warning remains separate for Claude.</p><p>Technical PASS is not drawing approval. Please review the light3 v13 candidate above.</p></section>`;
html = html.replace('<section class="panel">\n<h2>Native candidate player</h2>', `${reviewVerdict}\n<section class="panel">\n<h2>Native candidate player</h2>`);
fs.writeFileSync(htmlPath, html);
console.log(JSON.stringify({ finalAtlas: result, report: 'art/characters/goku/production/manual-audit-r5/FINAL_ATLAS_AUDIT.md', gallery: `${gallery}/index.html` }, null, 2));
