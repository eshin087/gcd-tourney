import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const base = path.join(root, 'art/characters/goku/production/reassembly-r03');
const rawRoot = path.join(root, 'art/characters/goku/raw');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'art/manifest.json'), 'utf8'));
const inventory = JSON.parse(fs.readFileSync(path.join(base, 'final5-fixture-inventory.json'), 'utf8'));
const selected = new Map(inventory.selected.map((r) => [`${r.animation}_v${String(r.version).padStart(2, '0')}`, r]));
const held = new Set(['light3_v09', 'heavy_v11']);
const approved = Object.fromEntries(Object.entries(manifest.characters.goku.animations).map(([name, a]) => [name, a.approvedVersion]));
const hash = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const files = [];
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.isFile() && ent.name.toLowerCase().endsWith('.png') && /_v\d{2}/i.test(ent.name)) files.push(p);
  }
}
walk(rawRoot);
files.sort((a, b) => a.localeCompare(b));
const lines = [
  '# Goku immutable version review catalog',
  '',
  'This catalog covers every versioned PNG presently saved under Goku `raw/` and its subfolders, including superseded assemblies and source-part PNGs. It records artifacts and hashes; it does not imply that every historical version has a current anatomy pass or requires a new design approval.',
  '',
  'All r03 reassemblies are deterministic edits of existing source drawings and used zero image-generation calls. For each selected version, the final5 Astra PASS is bound only to the exact quantized atlas/metadata hashes in `FINAL_HANDOFF_R03.md`. Held or superseded versions remain preserved; the latest source drawing approval remains attached to its original version only.',
  '',
  `Catalog entries: ${files.length}.`,
  '',
  '| Saved file | SHA256 | Sidecar/source provenance | Current status |',
  '|---|---|---|---|'
];
for (const file of files) {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  const basename = path.basename(file, '.png');
  const animMatch = basename.match(/^([A-Za-z0-9]+)_v\d{2}/);
  const anim = animMatch?.[1] ?? 'unknown';
  const approvedVersion = approved[anim];
  const sidePath = file.slice(0, -4) + '.json';
  let side = {};
  if (fs.existsSync(sidePath)) {
    try { side = JSON.parse(fs.readFileSync(sidePath, 'utf8')); } catch { side = { parseError: true }; }
  }
  const item = selected.get(basename);
  let state = item ? 'Selected; final5 exact-pixel Astra PASS, technical only' : held.has(basename) ? 'Final5 calibration HOLD; excluded from strict selection' : 'Preserved historical/superseded candidate; no final5 pass implied';
  const versionMatch = basename.match(/_v(\d{2})/);
  if (approvedVersion != null && versionMatch && Number(versionMatch[1]) === approvedVersion && !item) state = `Original drawing approved v${versionMatch[1]}; technical selection remains separate`;
  if (rel.includes('_qa_hold/_pre-final5-raw/')) state = 'Preserved duplicate of prior raw source displaced to prevent held fallback';
  const provenance = [
    fs.existsSync(sidePath) ? `sidecar [${path.relative(root, sidePath).replaceAll('\\', '/')}]` : 'no sidecar',
    side.sourcePath ? `source ${Array.isArray(side.sourcePath) ? side.sourcePath.join('; ') : side.sourcePath}` : null,
    side.sourceSha256 ? `source SHA ${Array.isArray(side.sourceSha256) ? side.sourceSha256.join('; ') : side.sourceSha256}` : null,
    side.selectedFactor ?? side.factor ? `factor ${side.selectedFactor ?? side.factor}` : null
  ].filter(Boolean).join('<br>');
  lines.push(`| ${rel} | ${hash(file)} | ${provenance || '—'} | ${state} |`);
}
lines.push('');
lines.push('The two exact body-calibration holds are `light3_v09` and `heavy_v11`; older versions are kept for source/review history. Source version v04 approvals remain historical. Final pack selection omits both held animations rather than falling back to v04.');
fs.writeFileSync(path.join(base, 'R03_REVIEW_ROWS.md'), lines.join('\n') + '\n');
console.log(JSON.stringify({ entries: files.length, path: path.join(base, 'R03_REVIEW_ROWS.md') }, null, 2));
