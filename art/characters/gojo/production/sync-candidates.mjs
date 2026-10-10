import fs from 'node:fs';
const root = 'art/characters/gojo/';
const packed = process.argv.includes('--packed');
const manifestText = fs.readFileSync('art/manifest.json', 'utf8');
const manifest = JSON.parse(manifestText), gojo = manifest.characters.gojo;
const rawFiles = fs.readdirSync(root + 'raw');
const records = [];
for (const [kind, defs] of [['animation', gojo.animations], ['ui', gojo.ui]]) for (const [key, def] of Object.entries(defs)) {
  const base = kind === 'ui' ? 'ui_' + key : key;
  const files = rawFiles.filter(f => new RegExp('^' + base + '_v\\d+\\.png$').test(f)).sort();
  if (!files.length) continue;
  const version = Number(files.at(-1).match(/_v(\d+)/)[1]);
  def.version = version;
  if (def.status !== 'approved') def.status = packed ? 'packed' : def.status === 'packed' ? 'packed' : 'raw';
  for (const file of files) records.push({ kind, key, base, file, version: Number(file.match(/_v(\d+)/)[1]), latest: file === files.at(-1), def });
}
// Replace only Gojo's JSON object; preserve concurrent edits to other characters byte-for-byte.
const current = fs.readFileSync('art/manifest.json', 'utf8');
const start = current.indexOf('{', current.indexOf('"gojo":'));
let depth = 0, quoted = false, escaped = false, end;
for (let i = start; i < current.length; i++) {
  const c = current[i];
  if (quoted) { if (escaped) escaped = false; else if (c === '\\') escaped = true; else if (c === '"') quoted = false; continue; }
  if (c === '"') quoted = true;
  else if (c === '{') depth++;
  else if (c === '}' && --depth === 0) { end = i + 1; break; }
}
const block = JSON.stringify(gojo, null, 2).split('\n').map((l, i) => i ? '    ' + l : l).join('\n');
fs.writeFileSync('art/manifest.json', current.slice(0, start) + block + current.slice(end));

let review = fs.readFileSync('art/REVIEW.md', 'utf8');
const rows = [];
for (const r of records) {
  if (review.includes(`(characters/gojo/raw/${r.file})`)) continue;
  const parts = ['A', 'B'].map(p => `${r.base}_v${String(r.version).padStart(2, '0')}_${p}.png`);
  const links = parts.every(p => fs.existsSync(root + 'raw/_parts/' + p)) ? ` ([A](characters/gojo/raw/_parts/${parts[0]}), [B](characters/gojo/raw/_parts/${parts[1]}))` : '';
  rows.push(`| 2026-10-09 | gojo | ${r.base} | [${r.file}](characters/gojo/raw/${r.file})${links} | v${String(r.version).padStart(2, '0')} | needs review | Built-in imagegen from user-selected model v03, expressions v02 and idle v02; full-set production authorized without intermediate approvals | ${r.kind === 'animation' ? r.def.frames + ' intended frames' : 'UI candidate'}; compact-head direction. Raw generated palette/background variation. Final measured QA recorded in production/QA.md. |`);
}
if (rows.length) {
  review = review.replace('|---|---|---|---|---|---|---|---|', '|---|---|---|---|---|---|---|---|\n' + rows.reverse().join('\n'));
  fs.writeFileSync('art/REVIEW.md', review);
}
const tracker = fs.readFileSync('art/TRACKER.md', 'utf8');
const ti = tracker.indexOf('## gojo'), te = tracker.indexOf('\n## ', ti + 4);
let section = tracker.slice(ti, te < 0 ? undefined : te);
section = section.split('\n').map(line => {
  const cells = line.split('|').map(c => c.trim());
  const rec = records.find(r => r.latest && (cells[2] === r.base || cells[2] === r.key || cells[2]?.startsWith(`ui/${r.key}.png`)));
  if (!rec || cells.length < 11) return line;
  cells[7] = rec.def.status; cells[8] = 'v' + String(rec.version).padStart(2, '0');
  cells[10] = 'Full-set final review; user-selected proportions. See production/QA.md.';
  return '| ' + cells.slice(1, -1).join(' | ') + ' |';
}).join('\n');
fs.writeFileSync('art/TRACKER.md', tracker.slice(0, ti) + section + (te < 0 ? '' : tracker.slice(te)));
console.log(JSON.stringify({ animations: Object.values(gojo.animations).filter(d => d.version > 0).length, ui: Object.values(gojo.ui).filter(d => d.version > 0).length, newReviewRows: rows.length }));
