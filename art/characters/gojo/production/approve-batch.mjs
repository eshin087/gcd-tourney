import fs from 'node:fs';
import path from 'node:path';
const root = 'art/characters/gojo/';
const manifest = JSON.parse(fs.readFileSync('art/manifest.json'));
const g = manifest.characters.gojo;
const latest = new Map();
for (const [group, defs] of Object.entries({ reference: g.reference, animations: g.animations, ui: g.ui })) {
  for (const [key, d] of Object.entries(defs)) {
    const base = group === 'reference' ? key === 'modelSheet' ? 'model_sheet' : key : group === 'ui' ? 'ui_' + key : key;
    const dir = group === 'reference' ? 'reference' : 'raw';
    const file = `${base}_v${String(d.version).padStart(2, '0')}.png`;
    if (!fs.existsSync(root + dir + '/' + file)) throw Error('Missing approved source ' + file);
    latest.set(base, d.version);
    d.status = 'approved'; d.approvedVersion = d.version;
    if (group === 'reference' || group === 'ui' || key === 'idle') {
      const dest = group === 'reference' ? `reference/${base}.png` : group === 'ui' ? `ui/${key}.png` : 'reference/idle_approved.png';
      fs.mkdirSync(path.dirname(root + dest), { recursive: true });
      fs.copyFileSync(root + dir + '/' + file, root + dest);
    }
  }
}
// Archive superseded source files and parts without overwriting version history.
const moved = new Map();
for (const dir of ['reference', 'raw', 'raw/_parts']) {
  for (const file of fs.readdirSync(root + dir)) {
    const m = file.match(/^(.+)_v(\d+)(?:_[AB])?\.(png|json)$/);
    if (!m || !latest.has(m[1]) || Number(m[2]) === latest.get(m[1])) continue;
    const from = root + dir + '/' + file, to = root + dir + '/_rejected/' + file;
    if (fs.existsSync(to)) throw Error('Archive collision ' + to);
    fs.mkdirSync(path.dirname(to), { recursive: true }); fs.renameSync(from, to);
    moved.set(from.slice(4), to.slice(4));
  }
}
let review = fs.readFileSync('art/REVIEW.md', 'utf8');
let approved = 0;
review = review.split('\n').map(line => {
  if (!line.includes('| gojo |')) return line;
  for (const [from, to] of moved) line = line.split('(' + from + ')').join('(' + to + ')');
  const cells = line.split('|');
  const match = cells[4]?.match(/\/([^/]+)_v(\d+)\.png\)/);
  if (!match || !latest.has(match[1])) return line;
  if (Number(match[2]) === latest.get(match[1])) {
    cells[6] = ' approved '; approved++;
    cells[7] += ' User approved complete batch 2026-10-09. ';
  } else if (cells[6].trim() === 'needs review') {
    cells[6] = ' rejected ';
    cells[7] += ` Superseded by approved v${String(latest.get(match[1])).padStart(2, '0')}. `;
  }
  return cells.join('|');
}).join('\n');
if (approved !== 47) throw Error('Expected 47 approval rows, got ' + approved);
fs.writeFileSync('art/REVIEW.md', review);
// Preserve the other characters' current JSON text.
const text = fs.readFileSync('art/manifest.json', 'utf8');
const start = text.indexOf('{', text.indexOf('"gojo":'));
let depth = 0, quoted = false, escaped = false, end;
for (let i = start; i < text.length; i++) {
  const c = text[i];
  if (quoted) { if (escaped) escaped = false; else if (c === '\\') escaped = true; else if (c === '"') quoted = false; continue; }
  if (c === '"') quoted = true; else if (c === '{') depth++; else if (c === '}' && --depth === 0) { end = i + 1; break; }
}
const block = JSON.stringify(g, null, 2).split('\n').map((l, i) => i ? '    ' + l : l).join('\n');
fs.writeFileSync('art/manifest.json', text.slice(0, start) + block + text.slice(end));
let tracker = fs.readFileSync('art/TRACKER.md', 'utf8');
const ti = tracker.indexOf('## gojo'), te = tracker.indexOf('\n## ', ti + 4);
let section = tracker.slice(ti, te < 0 ? undefined : te).split('\n').map(line => {
  const c = line.split('|').map(s => s.trim());
  if (!/^v\d+$/.test(c[8] ?? '')) return line;
  c[7] = 'approved'; c[9] = c[8]; c[10] = 'User approved complete batch 2026-10-09; see production/QA.md.';
  return '| ' + c.slice(1, -1).join(' | ') + ' |';
}).join('\n');
fs.writeFileSync('art/TRACKER.md', tracker.slice(0, ti) + section + (te < 0 ? '' : tracker.slice(te)));
console.log({ approved, archived: moved.size });
