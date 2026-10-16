import fs from 'node:fs';
import path from 'node:path';
import { readPng, encodePng, crop, blit, newImage } from '../../../../../tools/pack-sprites.mjs';

const root = process.cwd();
const source = 'public/characters/goku/calibration-r4';
const target = 'public/characters/goku/calibration-r5';
if (fs.existsSync(target)) throw new Error('calibration-r5 already exists; refusing overwrite');
fs.cpSync(source, target, { recursive: true });
const dataPath = path.join(target, 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const contactPath = path.join(target, 'assets/light3-v13-contact.png');
const strip = readPng(path.join(root, 'art/characters/goku/production/relay11-generation/light3_v13_48c_diagnostic.png'));
if (strip.w !== 1792 || strip.h !== 256) throw new Error(`Unexpected light3 v13 diagnostic dimensions ${strip.w}x${strip.h}`);
const contact = newImage(1792, 256);
const framePaths = [];
for (let i = 0; i < 7; i++) {
  const frame = crop(strip, i * 256, 0, 256, 256);
  blit(contact, frame, i * 256, 0);
  const file = `assets/frames/light3-v13-f${String(i).padStart(2, '0')}.png`;
  framePaths.push(file);
  fs.writeFileSync(path.join(target, file), encodePng(frame));
}
fs.writeFileSync(contactPath, encodePng(contact));
Object.assign(data.status, {
  drawingApproval: 'PENDING — light3 v13 is not user-approved. Heavy v14 remains user-approved via Claude relay #10 (“Approved”).',
  technicalAudit: 'Candidate anatomy/scale PASS within uncertainty. Exact 108-frame combined-atlas audit pending; no production manualQA or release claim for light3.',
  holdDecision: 'Light3 v13 drawing approval and any hold/release decision are separate; final combined audit pending.',
  finalAtlas: 'Actual branch atlas remains the audited 101-frame r4 sheet; light3 v13 is shown only as a separate candidate. Combined-atlas audit pending.'
});
data.animations.light3 = {
  ...data.animations.light3,
  version: 13,
  densityFactor: 0.696133442603862,
  packedScale: 1,
  bodyHeightCap: 237,
  occupiedNativeHeight: 238,
  framePaths,
  contact: 'assets/light3-v13-contact.png',
  auditState: 'Candidate-level Astra anatomy/scale PASS; exact combined-atlas audit pending; no user drawing approval.'
};
data.light3V11Historical = {
  version: 11,
  state: 'technical HOLD; excluded from actual atlas',
  clippedForegroundPixels: 800,
  note: 'Historical previous candidate. Its 256px diagnostic and complete 280px companion remain shown below.'
};
data.relay11 = {
  authorization: 'Claude relay #11, user quote “Goku luffy retry”; exactly one sixth cumulative light3 generation call, no drawing approval.',
  source: 'art/characters/goku/raw/_qa_hold/light3_v12.png',
  sourceSha256: 'C2320840541EF2B9A9EBD5919F632BF40F733092CE2C2DDCD54F37467447DCB1',
  assembly: 'art/characters/goku/raw/_qa_hold/light3_v13.png',
  assemblySha256: '3A55C5C25E389C6336A3938EF9716929EEEA7D6A90B7D834FAF0ED06A701CBC8',
  sourceFactor: 0.696133442603862,
  finalFixtureSheetSha256: 'EBB27850371179A0FDC9DA5D76816EBDB52B747712643B60CD40E14BFE6460CA',
  finalFixtureMetadataSha256: 'B43AF90A609DC0A36E688BAD916C50694962CE2FCED6FB02384CD400BCD814CA',
  finalFixtureFrames: 108,
  retainedBaselineAlphaDifferences: 0,
  actualBranchAtlasChanged: false
};
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');

const htmlPath = path.join(target, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace('<title>Goku Relay 9 calibration r4</title>', '<title>Goku Relay 11 calibration r5</title>');
html = html.replace('<h1>Goku Relay 9 — exact candidate review</h1>', '<h1>Goku Relay 11 — light3 v13 candidate review</h1>');
html = html.replace('These are separate decisions. Relay #10 user decision: "Approved" applies to Goku heavy v14. The call authorization itself did not approve the images. Light3 v11 remains on technical HOLD for clipping and is excluded from the atlas.', 'These decisions are separate. Heavy v14 remains user-approved via Claude relay #10 ("Approved"). Relay #11 authorized one light3 call only; it did not approve the image. Light3 v13 has a candidate-level anatomy/scale PASS; final combined-atlas audit and user drawing approval are pending.');
html = html.replace('Frame durations and phase boundaries follow the current Goku manifest; both moves are one-shots. Player pauses on the final frame.', 'Light3 v13 is the new compact stomach-height front-kick sequence; heavy v14 remains the approved reference candidate. Timed playback follows the recorded durations; both are one-shots.');
const oldStart = html.indexOf('<section class="panel">\n<h2>Light3 capacity comparison');
const oldEnd = html.indexOf('</section>', oldStart) + '</section>'.length;
if (oldStart < 0 || oldEnd < '</section>'.length) throw new Error('could not locate r4 historical light3 section');
const historical = `<section class="panel">\n<h2>Previous light3 v11 hold (historical)</h2>\n<p>Light3 v11 remains technically held and excluded from the actual atlas. At its then-supported .62 density the 256px diagnostic clipped 800 foreground-mask pixels; the 280px companion preserved the complete drawing. This is historical evidence only and does not describe v13 above.</p>\n<div class="framepair"><div class="framebox"><b>v11 256px diagnostic</b><img class="frame" src="assets/light3-contact.png" alt="Historical light3 v11 quantized contact strip"></div><div class="framebox"><b>v11 280px complete companion</b><img class="frame roomy" src="assets/light3-roomy-contact.png" alt="Historical light3 v11 roomy contact strip"></div></div>\n</section>`;
html = html.slice(0, oldStart) + historical + html.slice(oldEnd);
html = html.replace('<h2>Final exact combined strict atlas</h2>', '<h2>Current actual branch atlas (light3 v13 excluded)</h2>');
html = html.replace('This actual branch atlas contains 93 retained audited frames plus heavy v14 (101 total); light3 remains excluded. Final Astra exact-pixel audit passed. Heavy v14 was approved by the user via Claude relay #10; light3 v11 remains on technical HOLD and excluded.', 'This actual branch atlas is the unchanged audited r4 build: 93 retained frames plus heavy v14 (101 total). Light3 v13 remains a separate candidate and is excluded. Heavy v14 was approved via relay #10; light3 v13 combined audit and drawing approval are pending.');
html = html.replace('Only the isolated provisional fixture is displayed. It is not the current shipped atlas and is not approved.', 'The player above displays the actual current branch atlas from ../sheet.png and ../anims.json. The light3 v13 player above it is a separate diagnostic candidate.');
html = html.replace("const framePath=(name,i)=>`assets/frames/${name}-f${String(i).padStart(2,'0')}.png`;", "const framePath=(name,i)=>data.animations[name].framePaths?.[i]||`assets/frames/${name}-f${String(i).padStart(2,'0')}.png`;");
html = html.replace("img.src=`assets/${name}-contact.png`;", "img.src=a.contact||`assets/${name}-contact.png`;");
html = html.replace("if(name==='light3'){$('light3Diag').src=src;$('light3Roomy').src=framePath('light3-roomy',idx);$('clipCaption').textContent=`Frame ${idx+1}: 256px diagnostic loses ${data.light3Clipping.clippedForegroundPixelsByFrame[idx]} foreground-mask pixels; roomy companion loses 0.`}", "");
fs.writeFileSync(htmlPath, html);
console.log(JSON.stringify({ target, candidateContact: path.relative(root, contactPath), candidateFrames: framePaths, actualAtlas: data.finalAtlas, candidateState: data.animations.light3.auditState }, null, 2));
