import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const raw = 'art/characters/gojo/raw/';
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard', '--', raw], { encoding: 'utf8' })
  .trim().split(/\r?\n/).filter(Boolean).filter((p) => p.endsWith('.png'));
const groups = new Map();
for (const path of untracked) {
  const match = path.match(/(?:^|\/)([A-Za-z][A-Za-z0-9]*)_v(\d{2})(?:_([A-Z]))?\.png$/);
  if (!match) continue;
  const [, asset, num] = match;
  const key = `${asset}:${num}`;
  if (!groups.has(key)) groups.set(key, { asset, num, paths: [] });
  groups.get(key).paths.push(path);
}

const issues = {
  'run:08': 'Head gate passes; A/B leg lead repeats, motion correction needed.',
  'jumpSquat:04': 'Head probe unmeasured; independent packed anatomy comparison pending.',
  'land:06': 'Head fit passes; full packed anatomy and loop check pending.',
  'land:05': 'Head ratio 0.94 fails gate; superseded by v06.',
  'land:04': 'Head ratio 0.93 fails gate; superseded by v06.',
  'light2:04': 'Parts cannot stitch: adjacent poses touch in part A; retry needed.',
  'light4:05': 'Parts cannot stitch: pose separation fails in part B; motion reads front kick, correction needed.',
  'heavy:04': 'Stitched but impact reads raised fist rather than required elbow; correction needed.',
  'getup:03': 'Source has four visible poses; five required. Correction needed.',
  'down:04': 'Original lying silhouette retained; floor and anatomy QA pending Claude.',
  'ko:05': 'Original KO silhouette retained; floor and anatomy QA pending Claude.',
};
let review = fs.readFileSync('art/REVIEW.md', 'utf8');
for (const num of ['04', '05']) {
  const re = new RegExp(`(^\\| 2026-10-11 \\| gojo \\| land \\| .*land_v${num}\\.png.*$)`, 'm');
  review = review.replace(re, (row) => row.replace('characters/gojo/raw/land_', 'characters/gojo/raw/_rejected/land_')
    .replace('needs review', 'rejected').replace('QA in progress; not approved, not ready to ship.', issues[`land:${num}`]));
}
const rows = [];
for (const group of groups.values()) {
  const { asset, num } = group;
  const key = `${asset}:${num}`;
  const paths = group.paths.sort();
  const existing = new RegExp(`^\\|[^\\n]*\\| gojo \\| ${asset} \\|[^\\n]*\\| v${num} \\|`, 'm');
  if (existing.test(review)) continue;
  const rejected = key === 'land:05' || key === 'land:04' || key === 'run:07' || key === 'light1:04';
  const links = paths.map((p) => `[${p.split('/').at(-1)}](${p.slice(4)})`).join(' / ');
  rows.push(`| 2026-10-11 | gojo | ${asset} | ${links} | v${num} | ${rejected ? 'rejected' : 'needs review'} | Title-style candidate from approved pilot; built-in image generation. | ${issues[key] || 'Source filed; full pack, anatomy and motion QA pending. No approval or shipping claim.'} |`);
}
const sep = '|---|---|---|---|---|---|---|---|\n';
if (!review.includes(sep)) throw new Error('Review table separator missing');
review = review.replace(sep, sep + rows.reverse().join('\n') + (rows.length ? '\n' : ''));
fs.writeFileSync('art/REVIEW.md', review);

let manifest = fs.readFileSync('art/manifest.json', 'utf8');
const start = manifest.indexOf('    "gojo": {', manifest.indexOf('"characters":'));
if (start < 0) throw new Error('Gojo manifest block missing');
let prefix = manifest.slice(0, start);
let gojo = manifest.slice(start);
const latest = new Map();
for (const { asset, num } of groups.values()) latest.set(asset, Math.max(latest.get(asset) || 0, Number(num)));
for (const [asset, num] of latest) {
  const startAsset = gojo.indexOf(`        "${asset}": {`);
  if (startAsset < 0) continue;
  const endAsset = gojo.indexOf('\n        },', startAsset);
  if (endAsset < 0) continue;
  let block = gojo.slice(startAsset, endAsset);
  block = block.replace(/"version": \d+/, (value) => `"version": ${Math.max(Number(value.match(/\d+/)[0]), num)}`);
  gojo = gojo.slice(0, startAsset) + block + gojo.slice(endAsset);
}
fs.writeFileSync('art/manifest.json', prefix + gojo);
console.log(`Recorded ${rows.length} review rows and ${latest.size} manifest version floors.`);
