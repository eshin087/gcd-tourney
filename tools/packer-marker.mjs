// The marker the sprite packer leaves in every frames/<name>/ folder it writes (.packer.json), and its hashes.
// Shared by tools/pack-sprites.mjs, which writes and reads the marker, and tools/pr.mjs, whose `prune` may throw away
// frames the marker proves nobody edited (TOOL-068). Node built-ins only and no side effects on import: pr.mjs also
// runs in worktrees where `npm ci` never ran, so it cannot import the packer itself (pngjs).

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const MARKER = '.packer.json';
// The marker's `generatedBy`: frames folders without it are hand-made.
export const GENERATED_BY = 'tools/pack-sprites.mjs';

export const sha1 = (buf) => crypto.createHash('sha1').update(buf).digest('hex');

// One hash over the files a strip was cleaned from (its raw files, then their sidecars), names included: `sourceHash`.
export function hashFiles(files) {
  const h = crypto.createHash('sha1');
  for (const f of files) { h.update(path.basename(f)); h.update(fs.readFileSync(f)); }
  return h.digest('hex');
}

const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };

// What stops files of a frames/<name>/ folder from being thrown away as packer output. [] means a pack writes them
// again: the folder's marker is the packer's, each of `names` is the marker or a frame with the hash the marker lists,
// no listed frame is gone, and the files the frames were cleaned from are on disk unchanged. Stricter than the
// packer's own "edited" test, which looks at the PNGs only: here a stray note or a deleted frame counts too, because
// the caller deletes the files. `names` are the files to judge (default: everything in the folder; `pr prune` passes
// the untracked ones, since a committed .gitkeep beside them is safe in git). `artDir` is the art root the marker's
// `source` paths are relative to.
// Each entry is { file, why }: `file` is a name inside the folder, or '' when the reason is about the whole folder.
export function framesDrift(dir, artDir, names = fs.readdirSync(dir)) {
  let marker;
  try { marker = JSON.parse(fs.readFileSync(path.join(dir, MARKER), 'utf8')); } catch { return [{ file: '', why: 'frames with no readable packer marker: hand-made?' }]; }
  const files = marker?.files;
  if (marker?.generatedBy !== GENERATED_BY || !files || typeof files !== 'object') return [{ file: '', why: `its ${MARKER} is not the packer's: hand-made frames?` }];
  const out = [];
  for (const name of names) {
    if (name === MARKER) continue;
    const file = path.join(dir, name);
    if (!isFile(file) || !Object.hasOwn(files, name)) out.push({ file: name, why: 'not in the packer marker' });
    else if (sha1(fs.readFileSync(file)) !== files[name]) out.push({ file: name, why: 'packer frame edited since it was packed' });
  }
  for (const f of Object.keys(files)) if (!isFile(path.join(dir, f))) out.push({ file: f, why: 'packer frame deleted since it was packed' });
  // unedited frames are only rebuildable while their source is: a raw that was deleted, or changed after the pack,
  // leaves these frames as the only copy of that drawing
  const source = Array.isArray(marker.source) ? marker.source.filter((s) => typeof s === 'string') : [];
  const paths = source.map((s) => path.join(artDir, s));
  const gone = source.filter((s, k) => !isFile(paths[k]));
  if (!source.length || typeof marker.sourceHash !== 'string') out.push({ file: '', why: 'its packer marker names no source to pack it from again' });
  else if (gone.length) out.push({ file: '', why: `the source it was packed from is not on disk: ${gone.join(', ')}` });
  else if (hashFiles(paths) !== marker.sourceHash) out.push({ file: '', why: `the source it was packed from changed since: ${source.join(', ')}` });
  return out;
}
