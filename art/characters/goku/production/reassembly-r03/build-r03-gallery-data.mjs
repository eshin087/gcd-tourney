import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const base = path.join(root, 'art/characters/goku/production/reassembly-r03');
const publicDir = path.join(root, 'public/characters/goku/calibration-r3');
const fixture = process.argv[2] ?? 'final5-fixture';
const inventory = JSON.parse(fs.readFileSync(path.join(base, `${fixture}-inventory.json`), 'utf8'));
const pack = JSON.parse(fs.readFileSync(path.join(base, `${fixture}-pack-report.json`), 'utf8'));
const crops = JSON.parse(fs.readFileSync(path.join(base, `${fixture}-crops/inventory.json`), 'utf8'));
const metaBytes = fs.readFileSync(path.join(base, `${fixture}-public/characters/goku/anims.json`));
const meta = JSON.parse(metaBytes);
const manifest = JSON.parse(fs.readFileSync(path.join(base, `${fixture}-art/manifest.json`), 'utf8'));
const original = JSON.parse(fs.readFileSync(path.join(root, 'art/manifest.json'), 'utf8'));
const hash = (b) => crypto.createHash('sha256').update(b).digest('hex');
const char = pack.characters.find((c) => c.id === 'goku');
const selected = new Map((inventory.selected ?? inventory.selectedNew ?? []).map((x) => [x.animation, x]));
const rows = {};
for (const [name, anim] of Object.entries(meta.animations)) {
  const pick = selected.get(name);
  const def = manifest.characters.goku.animations[name];
  const current = original.characters.goku.animations[name];
  const version = pick?.version ?? def?.version;
  const rawFile = path.join(root, 'art/characters/goku/raw', `${name}_v${String(version).padStart(2, '0')}.json`);
  const holdFile = path.join(root, 'art/characters/goku/raw/_qa_hold', `${name}_v${String(version).padStart(2, '0')}.json`);
  const sidePath = fs.existsSync(rawFile) ? rawFile : holdFile;
  const side = fs.existsSync(sidePath) ? JSON.parse(fs.readFileSync(sidePath, 'utf8')) : {};
  const packed = char.packed.find((x) => x.anim === name);
  const warning = (char.warnings ?? []).filter((x) => x.startsWith(`${name}:`) || x.startsWith(`scale: ${name}:`));
  const crop = crops.animations[name];
  const approved = current?.approvedVersion ?? null;
  const sourceApproval = approved != null && side.sourcePath
    ? `Original drawing approval remains v${String(approved).padStart(2, '0')}; this is a deterministic reassembly, with no new drawing call.`
    : approved != null ? `Original approval v${String(approved).padStart(2, '0')} remains recorded.` : 'No approved drawing version is recorded.';
  rows[name] = {
    version, bodyHeight: pick?.bodyHeight ?? current?.bodyHeight ?? def?.bodyHeight,
    approvedVersion: approved, sourceDrawingApproval: sourceApproval,
    status: name === 'idle' ? 'Approved reference v02' : 'Astra PASS — exact final5 version-bound pixels',
    factor: pick?.factor ?? side.selectedFactor ?? side.factor ?? side.reassembly?.factor ?? null,
    factorMethod: side.factorMethod ?? side.reassembly?.reason ?? null,
    sourcePath: side.sourcePath ?? side.reassembly?.source ?? side.sourceParts?.map((p) => p.path) ?? null,
    sourceSha256: side.sourceSha256 ?? side.reassembly?.sourceSha256 ?? side.sourceParts?.map((p) => p.sha256) ?? null,
    sourceParts: side.sourceParts ?? null,
    landmarks: side.landmarks ?? side.reassembly?.landmarks ?? side.frame0AndFrame6Landmarks ?? null,
    frameOffsets: side.frameOffsets ?? side.reassembly?.frameOffsets ?? null,
    erase: side.erase ?? null,
    nativeBodyHeight: side.nativeBodyHeight ?? side.nativeMaxHeight ?? side.candidateBodyHeightForX1Pack ?? pick?.bodyHeight ?? null,
    packScale: packed?.scale ?? null,
    frameScales: packed?.frameScales ?? [],
    loop: anim.loop, durationsMs: anim.durations,
    contact: `assets/contacts/${name}-one-density.png`,
    framePaths: crop.frames.map((f) => `assets/frames/${name}/${path.basename(f.path)}`),
    atlasIndices: crop.frames.map((f) => f.atlasIndex),
    frameHashes: crop.frames.map((f) => f.sha256),
    packWarnings: warning,
    sidecarPath: path.relative(root, sidePath).replaceAll('\\', '/'),
    selectedRawPath: packed?.from ?? null
  };
}
const atlas = fs.readFileSync(path.join(base, `${fixture}-public/characters/goku/sheet.png`));
const output = {
  label: 'Goku r03 strict selected quantized atlas. Candidate pixels are deterministic reassemblies from existing source art; zero image generation calls in this round.',
  fixture, scaleGate: 'strict isolated fixture', quantizeColors: 48, cell: [256,256], pivot: [128,240],
  atlasSha256: hash(atlas), metadataSha256: hash(metaBytes), colors: char.colors,
  animationCount: char.packed.length, frameCount: char.packed.reduce((s,a)=>s+a.frames,0),
  totalWarnings: pack.totalWarnings, warnings: char.warnings ?? [], animations: rows,
  references: { path: 'assets/references/approved-reference-lineup.png', contents: 'approved idle v02 beside title neutral and combat reference cells at 256px per cell', sourcePath: 'art/characters/goku/reference/title_style_pilot_v02.png and raw/idle_v02.png' },
  held: {
    light3: { version: 9, status: 'HOLD — body calibration unresolved; fit PASS. Excluded from strict selected atlas.', source: 'assets/held/light3_v09.png', evidence: 'assets/held/light3-capacity-source.png' },
    heavy: { version: 11, status: 'HOLD — body calibration unresolved; fit PASS. Excluded from strict selected atlas.', source: 'assets/held/heavy_v11.png', evidence: 'assets/held/heavy-capacity-source.png' }
  },
  reports: { pack: 'reports/pack-report.json', productionPack: 'reports/production-pack-report.json', crops: 'reports/crop-inventory.json', fixture: 'reports/fixture-inventory.json', atlas: 'reports/final5-sheet.png', metadata: 'reports/final5-anims.json', maskComparison: 'reports/final4-final5-mask-comparison.json', handoff: 'reports/FINAL_HANDOFF_R03.md', workflow: 'reports/WORKFLOW.md', versionCatalog: 'reports/R03_REVIEW_ROWS.md' }
};
fs.writeFileSync(path.join(publicDir, 'data.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ fixture, atlasSha256: output.atlasSha256, metadataSha256: output.metadataSha256, animationCount: output.animationCount, frameCount: output.frameCount }, null, 2));
