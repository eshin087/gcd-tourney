import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';

const repo = process.cwd();
const artRoot = path.join(repo, 'art');
const character = path.join(artRoot, 'characters/goku');
const qaRoot = path.join(character, 'production/scale-qa/reassembly-r02');
const fixtureArt = path.join(qaRoot, 'fixture-art');
const fixturePublic = path.join(qaRoot, 'fixture-public');
const fixtureCharacter = path.join(fixtureArt, 'characters/goku');
const magenta = (d, i) => d[i] > 160 && d[i + 1] < 100 && d[i + 2] > 160;
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const candidates = [
  { name: 'idle', version: 2, from: 'raw/idle_v02.png', sidecar: null, pivot: [128, 240], disputed: null },
  { name: 'win', version: 4, from: 'raw/_qa_hold/win_v04.png', sidecar: 'raw/_qa_hold/win_v04.json', pivot: [128, 260], disputed: 'Factor prose erratum; top overflow recorded; include for audit only, not a pass.' },
  { name: 'light3', version: 5, from: 'raw/_qa_hold/light3_v05.png', sidecar: 'raw/_qa_hold/light3_v05.json', pivot: [128, 240], disputed: 'Raw v05 clips 11 rows in frame 4; source segmentation defect. Include quantized clipped version with crop loss diagnostics.' },
  { name: 'light4', version: 5, from: 'raw/_qa_hold/light4_v05.png', sidecar: 'raw/_qa_hold/light4_v05.json', pivot: [128, 260] },
  { name: 'run', version: 5, from: 'raw/_qa_hold/run_v05.png', sidecar: 'raw/_qa_hold/run_v05.json', pivot: [128, 260] },
  { name: 'dash', version: 4, from: 'raw/_qa_hold/dash_v04.png', sidecar: 'raw/_qa_hold/dash_v04.json', pivot: [128, 240] },
  { name: 'jumpFall', version: 3, from: 'raw/_qa_hold/jumpFall_v03.png', sidecar: 'raw/_qa_hold/jumpFall_v03.json', pivot: [128, 340], disputed: 'Superseded measurement endpoints are likely misplaced per Astra; include only as historical disputed candidate and exclude from audit pass.' },
  { name: 'land', version: 4, from: 'raw/_qa_hold/land_v04.png', sidecar: 'raw/_qa_hold/land_v04.json', pivot: [128, 240] },
  { name: 'light1', version: 3, from: 'raw/_qa_hold/light1_v03.png', sidecar: 'raw/_qa_hold/light1_v03.json', pivot: [128, 250], disputed: 'Two-pixel intrusion into required top margin; inspect crop diagnostics.' },
  { name: 'heavy', version: 5, from: 'raw/_qa_hold/heavy_v05.png', sidecar: 'raw/_qa_hold/heavy_v05.json', pivot: [128, 240], disputed: 'Source frames 3–5 show detached fist/hand fragments; include for technical audit only.' },
  { name: 'getup', version: 5, from: 'raw/_qa_hold/getup_v05.png', sidecar: 'raw/_qa_hold/getup_v05.json', pivot: [128, 240] },
  { name: 'hurtHigh', version: 8, from: 'raw/_qa_hold/hurtHigh_v08.png', sidecar: 'raw/_qa_hold/hurtHigh_v08.json', pivot: [128, 240] },
];
const ensure = (p) => fs.mkdirSync(p, { recursive: true });
for (const d of [fixtureCharacter, path.join(fixtureCharacter, 'raw'), path.join(fixtureCharacter, 'reference'), fixturePublic]) ensure(d);
const baseManifest = JSON.parse(fs.readFileSync(path.join(artRoot, 'manifest.json'), 'utf8'));
const fixtureManifest = JSON.parse(JSON.stringify(baseManifest));
const goku = fixtureManifest.characters.goku;
// This isolated fixture may emit diagnostic pixels, but must not imply art approval.
goku.scaleGate = 'warn';
const rows = [];
for (const c of candidates) {
  const sourceFile = path.join(character, c.from), source = PNG.sync.read(fs.readFileSync(sourceFile));
  if (source.width % 256 !== 0) throw new Error(`${c.name}: non-cell strip width ${source.width}`);
  const frames = source.width / 256;
  const dy = c.pivot[1] - 240, dx = c.pivot[0] - 128;
  const staged = new PNG({ width: source.width, height: 256 });
  for (let i = 0; i < staged.data.length; i += 4) staged.data.set([255, 0, 255, 255], i);
  let lostPixels = 0, retainedPixels = 0;
  const frameRows = [];
  for (let f = 0; f < frames; f++) {
    let minY = 256, maxY = -1, minX = 256, maxX = -1, frameLost = 0, frameRetained = 0;
    for (let sy = 0; sy < source.height; sy++) for (let sx = f * 256; sx < (f + 1) * 256; sx++) {
      const si = (sy * source.width + sx) * 4;
      if (source.data[si + 3] < 128 || magenta(source.data, si)) continue;
      const tx = sx + dx, ty = sy - dy;
      if (tx < f * 256 || tx >= (f + 1) * 256 || ty < 0 || ty >= 256) { frameLost++; continue; }
      const di = (ty * staged.width + tx) * 4;
      staged.data.set(source.data.subarray(si, si + 4), di);
      frameRetained++; minX = Math.min(minX, tx - f * 256); maxX = Math.max(maxX, tx - f * 256); minY = Math.min(minY, ty); maxY = Math.max(maxY, ty);
    }
    lostPixels += frameLost; retainedPixels += frameRetained;
    frameRows.push({ frame: f, sourceContentBounds: maxY >= 0 ? [minX, minY + dy, maxX, maxY + dy] : null, fixtureBounds: maxY >= 0 ? [minX, minY, maxX, maxY] : null, shiftedBy: [-dx, -dy], lostNonMagentaPixels: frameLost, retainedNonMagentaPixels: frameRetained });
  }
  const dstName = `${c.name}_v${String(c.version).padStart(2, '0')}.png`;
  const stagedFile = path.join(fixtureCharacter, 'raw', dstName);
  fs.writeFileSync(stagedFile, PNG.sync.write(staged));
  const stagedSha = sha(stagedFile), sourceSha = sha(sourceFile), inputDims = [source.width, source.height];
  const maxBodyHeight = Math.max(...frameRows.map(f => f.fixtureBounds ? f.fixtureBounds[3] - f.fixtureBounds[1] + 1 : 0));
  const anim = goku.animations[c.name];
  anim.bodyHeight = maxBodyHeight;
  anim.version = c.version;
  const log = {
    fixtureOnly: true, scaleGateMode: 'warn', approvalFieldsPreserved: true,
    note: 'Isolated warn-only fixture for diagnostic quantized pixels. Approval fields are copied unchanged from the production manifest; no art approval or scale pass is implied.',
    animation: c.name, version: c.version, sourcePath: `art/characters/goku/${c.from}`, sourceSha256: sourceSha, sourceDimensions: inputDims,
    sourcePivotPx: c.pivot, fixturePivotPx: [128, 240], sourceToFixtureShiftPx: [-dx, -dy],
    fixtureCellSizePx: [256, 256], frameCount: frames, nativeBodyHeight: maxBodyHeight,
    lostNonMagentaPixels: lostPixels, retainedNonMagentaPixels: retainedPixels, frameDiagnostics: frameRows,
    sidecarPath: c.sidecar ? `art/characters/goku/${c.sidecar}` : null, sourceSidecarSha256: c.sidecar ? sha(path.join(character, c.sidecar)) : null,
    stagedFixturePath: `art/characters/goku/raw/${dstName}`, stagedFixtureSha256: stagedSha,
    excludedFromScalePass: true, dispute: c.disputed ?? null
  };
  fs.writeFileSync(stagedFile.replace(/\.png$/, '.fixture.json'), JSON.stringify(log, null, 2) + '\n');
  rows.push(log);
}
for (const rel of ['idle_approved.png', 'idle_v02.png', 'title_style_draft.png', 'title_style_draft_v02.png', 'model_sheet.png', 'expressions.png']) {
  const src = path.join(character, 'reference', rel);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(fixtureCharacter, 'reference', rel));
}
fs.writeFileSync(path.join(fixtureArt, 'manifest.json'), JSON.stringify(fixtureManifest, null, 2) + '\n');
fs.writeFileSync(path.join(qaRoot, 'fixture-inventory.json'), JSON.stringify({ label: 'Native-density candidate fixture; no production settings changed.', reference: { idle: 'characters/goku/reference/idle_approved.png', idleV02: 'characters/goku/reference/idle_v02.png' }, candidates: rows }, null, 2) + '\n');
console.log(JSON.stringify(rows.map(r => ({ animation: r.animation, version: r.version, dimensions: r.sourceDimensions, fixtureHeight: r.nativeBodyHeight, lost: r.lostNonMagentaPixels, disputed: r.dispute })), null, 2));
