// Art merge guard for `npm run pr -- merge` (TOOL-028). Imported by tools/pr.mjs; no side effects on import.
//
// The character packer ships the NEWEST art/characters/<id>/raw/<anim>_vNN.png whether or not the user approved it
// (manifest approvedVersion), and public/characters/<id>/ is committed, so a merge ships whatever the branch packed.
// Batch #24-30 merged off-size strips because approval alone let them through. Before the merge commit is made the guard
// looks at the MERGE RESULT (the tree `git merge-tree` wrote, i.e. main + the branch) and refuses when a strip the
// branch changed
//   - has a newer raw version than the manifest's approvedVersion (the packer would ship it unapproved), or ships a
//     committed pack version nobody approved: approve it, or move the raw to raw/_qa_hold/ (the packer reads only the
//     files directly in raw/, so _qa_hold/, _rejected/, _parts/ never ship), or
//   - fails the packer's strict scale gate (a dry run of `pack-sprites.mjs <id> --strict-scale` on the merge result,
//     materialised in a scratch folder: nothing under art/ or public/ is ever written), or is shadowed by old hand edits.
// Only strips the branch changed can refuse: older mismatches on main (they exist) are listed as notes, so a branch is
// never blamed for what it did not touch. `--force-art "<reason>"` overrides and records the reason in the merge commit.
// A branch without art changes costs one `git diff --name-only`.

import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scratchDir } from './scratch-dir.mjs';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKER = path.join(TOOL_DIR, 'pack-sprites.mjs');
const GUIDE = path.join(TOOL_DIR, '..', 'src', 'art', 'animGuide.js');

// the same file-name rules as the packer's scanRaw
const VERSION_RE = /^(.+?)_v(\d+)\.png$/i;
const VERSION_JSON_RE = /^(.+?)_v(\d+)\.json$/i;
const SINGLE_RE = /^(.+?)_(\d+)\.png$/i;
const NOT_ANIM = /^(ui|fx)_|_fix\d+\.png$/i;
const RAW_SUBFOLDERS = new Set(['_qa_hold', '_rejected']); // moving a strip in or out of these changes what is newest
// the paths that can change a shipped fighter; anything else (code, docs, other art kinds) is not the guard's business
const WATCHED = ['art/characters', 'art/manifest.json', 'art/scale', 'public/characters'];

// ------------------------------------------------------------------ git helpers
const gitBuf = (root, args, input) => execFileSync('git', args, { cwd: root, input, maxBuffer: 1 << 30, stdio: ['pipe', 'pipe', 'pipe'] });
const gitText = (root, args) => gitBuf(root, args).toString();
const showJson = (root, treeish, file) => {
  try { return JSON.parse(gitText(root, ['show', `${treeish}:${file}`]).replace(/^\uFEFF/, '')); } catch { return null; }
};

// [{ path, oid }] for every blob under the pathspecs of a tree-ish
function listTree(root, treeish, specs) {
  const out = gitBuf(root, ['ls-tree', '-r', '-z', '--full-tree', treeish, '--', ...specs]).toString();
  return out.split('\0').filter(Boolean).map((line) => {
    const tab = line.indexOf('\t');
    const [, , oid] = line.slice(0, tab).split(' ');
    return { path: line.slice(tab + 1), oid };
  });
}

// the blobs' contents, in order (git cat-file --batch, in chunks so one buffer stays small)
function readBlobs(root, oids) {
  const out = [];
  for (let i = 0; i < oids.length; i += 40) {
    const buf = gitBuf(root, ['cat-file', '--batch'], oids.slice(i, i + 40).join('\n') + '\n');
    let pos = 0;
    while (pos < buf.length) {
      const nl = buf.indexOf(10, pos);
      const [, type, size] = buf.subarray(pos, nl).toString().split(' ');
      if (type !== 'blob') throw new Error(`cat-file: unexpected ${type}`);
      out.push(buf.subarray(nl + 1, nl + 1 + Number(size)));
      pos = nl + 1 + Number(size) + 1;
    }
  }
  return out;
}

// What `merge` would create: the tree of main + branch. A conflicted merge still yields a tree (conflict markers in the
// conflicted files only, normally docs), which is what `check` judges; `merge` itself refuses a conflict before this
// matters. With no tree at all (an unknown ref) the branch tip is judged against the merge base. Writing the tree adds
// unreferenced objects; nothing else changes.
export function resolveHead(root, base, branch) {
  const r = spawnSync('git', ['merge-tree', '--write-tree', base, branch], { cwd: root, encoding: 'utf8' });
  const tree = (r.stdout || '').split('\n')[0].trim();
  if ((r.status === 0 || r.status === 1) && /^[0-9a-f]{40,64}$/.test(tree)) return { head: tree, base, merged: r.status === 0 };
  const mb = spawnSync('git', ['merge-base', base, branch], { cwd: root, encoding: 'utf8' });
  return { head: branch, base: mb.status === 0 ? mb.stdout.trim() : base, merged: false };
}

// ------------------------------------------------------------------ arguments
const VALUE_FLAGS = ['--title', '--force-art', '--art'];
// The first bare argument that is not the value of an option (the reason of --force-art must never become the branch).
export function positionalArg(rest) {
  return rest.find((a, i) => !a.startsWith('--') && !VALUE_FLAGS.includes(rest[i - 1]));
}

// The reason of --force-art "<reason>" (null when the flag is absent); throws when the reason is missing or blank.
export function forceReason(rest) {
  const i = rest.indexOf('--force-art');
  if (i < 0) return null;
  const reason = rest[i + 1];
  if (!reason || reason.startsWith('--') || !reason.trim()) throw new Error('--force-art needs a reason: --force-art "why this art may ship"');
  return reason.trim();
}

// ------------------------------------------------------------------ what the branch changed
// "art/characters/naruto/raw/_qa_hold/run_v08.png" -> { id: 'naruto', anim: 'run' }; null when the path names no strip
function stripOf(file) {
  let m = /^art\/characters\/([^/_.][^/]*)\/frames\/([^/_.][^/]*)\//.exec(file);
  if (m) return { id: m[1], anim: m[2] };
  m = /^art\/characters\/([^/_.][^/]*)\/raw\/(?:([^/]+)\/)?([^/]+)$/.exec(file);
  if (!m || (m[2] && !RAW_SUBFOLDERS.has(m[2])) || NOT_ANIM.test(m[3])) return null;
  const f = m[3];
  const hit = VERSION_RE.exec(f) || VERSION_JSON_RE.exec(f) || SINGLE_RE.exec(f) || /^(.+?)\.(?:png|json)$/i.exec(f);
  return hit ? { id: m[1], anim: hit[1] } : null;
}

// { id -> Set(anim) } of the strips the merge changes, from the changed paths, the manifest entries and the committed packs
function changedStrips(root, base, head, paths) {
  const out = new Map();
  const add = (id, anim) => { if (!out.has(id)) out.set(id, new Set()); if (anim) out.get(id).add(anim); };
  for (const p of paths) {
    const s = stripOf(p);
    if (s) { add(s.id, s.anim); continue; }
    const m = /^(?:art\/characters|public\/characters)\/([^/_.][^/]*)\//.exec(p);
    if (m) add(m[1], null); // the fighter changed (hitboxes, sheet ...); only named strips are judged
  }
  const mb = showJson(root, base, 'art/manifest.json')?.characters || {}, mh = showJson(root, head, 'art/manifest.json')?.characters || {};
  for (const id of Object.keys(mh).filter((k) => !k.startsWith('_'))) {
    const a = mb[id]?.animations || {}, b = mh[id]?.animations || {};
    for (const anim of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (JSON.stringify(a[anim] ?? null) !== JSON.stringify(b[anim] ?? null)) add(id, anim);
    }
  }
  for (const id of [...out.keys()]) {
    const ap = showJson(root, base, `public/characters/${id}/anims.json`)?.scaleAudit?.anims || {};
    const bp = showJson(root, head, `public/characters/${id}/anims.json`)?.scaleAudit?.anims || {};
    for (const anim of new Set([...Object.keys(ap), ...Object.keys(bp)])) if ((ap[anim]?.v ?? null) !== (bp[anim]?.v ?? null)) add(id, anim);
  }
  return out;
}

// The version the packer would ship per animation: the highest raw/<anim>_vNN.png directly in raw/ (case-insensitive).
function newestRaw(files, id) {
  const prefix = `art/characters/${id}/raw/`;
  const newest = new Map();
  for (const f of files) {
    if (!f.path.startsWith(prefix)) continue;
    const name = f.path.slice(prefix.length);
    const m = !name.includes('/') && !NOT_ANIM.test(name) && VERSION_RE.exec(name);
    if (m && Number(m[2]) > (newest.get(m[1].toLowerCase()) || 0)) newest.set(m[1].toLowerCase(), Number(m[2]));
  }
  return newest;
}

// ------------------------------------------------------------------ the scale gate (a packer dry run on scratch copies)
// Copies what the packer reads for a pack of these fighters from the merge result: the manifest, builds.json and the
// baseline, hitboxes.json, the approved reference cells builds.json names, frames/, and from raw/ the newest version of
// every animation plus the sidecars (older versions and subfolders cannot change the pick).
function materialize(root, head, ids, dir) {
  const want = [];
  const keep = (list, ok) => { for (const f of list) if (ok(f.path)) want.push(f); };
  keep(listTree(root, head, ['art/manifest.json', 'art/scale/builds.json', 'art/scale/scale-baseline.json']), () => true);
  const builds = showJson(root, head, 'art/scale/builds.json')?.fighters || {};
  for (const id of ids) {
    const base = `art/characters/${id}/`;
    const files = listTree(root, head, [base.slice(0, -1)]);
    const newest = newestRaw(files, id);
    const refs = new Set((builds[id]?.scaleReference?.cells || []).map((c) => `art/${c}`));
    keep(files, (p) => {
      const rest = p.slice(base.length);
      if (rest === 'hitboxes.json' || refs.has(p)) return true;
      if (rest.startsWith('frames/')) return !rest.startsWith('frames/_') && !p.endsWith('.gitkeep');
      if (!rest.startsWith('raw/') || rest.slice(4).includes('/') || /^\./.test(path.basename(p)) || /^(ui|fx)_/i.test(rest.slice(4))) return false;
      const v = VERSION_RE.exec(rest.slice(4));
      return !v || newest.get(v[1].toLowerCase()) === Number(v[2]);
    });
  }
  const blobs = readBlobs(root, want.map((f) => f.oid));
  want.forEach((f, i) => {
    const dest = path.join(dir, f.path);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, blobs[i]);
  });
  return want.length;
}

function scaleRun(root, head, ids) {
  const tmp = fs.mkdtempSync(path.join(scratchDir(), 'gcd-art-guard-'));
  try {
    materialize(root, head, ids, tmp);
    const q = showJson(root, head, 'art/manifest.json')?.spec?.maxColors || 48;
    const r = spawnSync(process.execPath, [PACKER, '--root', path.join(tmp, 'art'), '--out', path.join(tmp, 'public'), '--guide', GUIDE,
      '--dry-run', '--strict-scale', '--no-writeback', '--json', '--quantize', String(q), ...ids], { encoding: 'utf8', maxBuffer: 1 << 29 });
    try { return { rep: JSON.parse(r.stdout), code: r.status }; } catch {
      return { error: `the packer dry run gave no report (exit ${r.status}): ${(r.stderr || r.stdout || '').trim().split('\n').slice(-3).join(' | ')}` };
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// ------------------------------------------------------------------ the guard
const vv = (n) => (n == null ? '-' : `v${String(n).padStart(2, '0')}`);

// -> { ok, skipped, changed: { id: [anim] }, refusals: [{ id, anim, kind, newest, approved, shipped, text, fix }], notes: [] }
export function checkArt({ root, base = 'main', head, scale = true }) {
  const res = { ok: true, skipped: false, changed: {}, refusals: [], notes: [] };
  const paths = gitText(root, ['diff', '--name-only', '-z', '--no-renames', base, head, '--', ...WATCHED]).split('\0').filter(Boolean);
  if (!paths.length) { res.skipped = true; return res; }
  const strips = changedStrips(root, base, head, paths);
  const manifestH = showJson(root, head, 'art/manifest.json')?.characters || {};
  const scaleIds = [];
  for (const [id, set] of strips) {
    if (!set.size) { res.notes.push(`${id}: files changed but no strip is named (hitboxes.json, sheet ...): not judged`); continue; }
    const canon = new Map(Object.keys(manifestH[id]?.animations || {}).map((k) => [k.toLowerCase(), k]));
    const anims = [...new Set([...set].map((a) => canon.get(a.toLowerCase()) || a))].sort();
    res.changed[id] = anims;
    const files = listTree(root, head, [`art/characters/${id}/raw`]);
    const newest = newestRaw(files, id);
    const packAnims = showJson(root, head, `public/characters/${id}/anims.json`)?.scaleAudit?.anims || {};
    const approvedOf = (m, a) => m[id]?.animations?.[a]?.approvedVersion ?? null;
    const hold = 'approve it (art/manifest.json approvedVersion + art/REVIEW.md), or move it to raw/_qa_hold/';
    for (const anim of anims) {
      const n = newest.get(anim.toLowerCase()) ?? null, ap = approvedOf(manifestH, anim), shipped = packAnims[anim]?.v ?? null;
      if (n != null && n !== ap) {
        const missing = ap != null && n < ap;
        res.refusals.push({ id, anim, kind: 'unapproved', newest: n, approved: ap, shipped,
          text: missing ? `approved ${vv(ap)} has no raw file (newest is ${vv(n)})` : `newest raw ${vv(n)} is ${ap == null ? 'not approved' : `not the approved ${vv(ap)}`}: the packer would ship it`,
          fix: missing ? `restore raw/${anim}_${vv(ap)}.png, or correct approvedVersion` : hold });
      } else if (shipped != null && (ap == null || shipped > ap)) {
        res.refusals.push({ id, anim, kind: 'shipped', newest: n, approved: ap, shipped,
          text: `the committed pack in public/characters/${id}/ ships ${vv(shipped)}, which is ${ap == null ? 'not approved' : `newer than the approved ${vv(ap)}`}`, fix: `repack the approved version (npm run sprites ${id}), or ${hold}` });
      } else if (shipped != null && shipped < ap) {
        res.notes.push(`${id} ${anim}: the committed pack ships ${vv(shipped)}, older than the approved ${vv(ap)} (repack: npm run sprites ${id})`);
      }
    }
    // pre-existing mismatches (strips the branch did not touch) are information, never a refusal
    const old = [...newest].filter(([k, n]) => !anims.some((a) => a.toLowerCase() === k) && approvedOf(manifestH, canon.get(k) || k) !== n).map(([k, n]) => `${k} ${vv(n)}`);
    if (old.length) res.notes.push(`${id}: ${old.length} strip(s) the branch did not touch ship an unapproved newest raw (not judged): ${old.join(', ')}`);
    scaleIds.push(id);
  }
  if (scale && scaleIds.length) {
    const run = scaleRun(root, head, scaleIds);
    if (run.error) res.refusals.push({ id: scaleIds.join(','), anim: '*', kind: 'packer', text: run.error, fix: 'run `node tools/pack-sprites.mjs <id> --dry-run --strict-scale` and fix what it reports' });
    else {
      for (const c of run.rep.characters || []) {
        const mine = new Set((res.changed[c.id] || []).map((a) => a.toLowerCase()));
        const failed = (c.scale?.failed || []).filter((a) => mine.has(a.toLowerCase()));
        for (const anim of failed) {
          const line = (c.warnings || []).find((w) => w.startsWith(`scale gate: ${anim}`)) || `scale gate: ${anim} failed`;
          res.refusals.push({ id: c.id, anim, kind: 'scale', newest: c.versions?.[anim] ?? null, approved: manifestH[c.id]?.animations?.[anim]?.approvedVersion ?? null, text: line.replace(/^scale gate: /, ''),
            fix: 'fix the strip (art/CHARACTER_SCALE.md), record a manual QA pass (scaleManualQA), or move it to raw/_qa_hold/' });
        }
        for (const anim of (c.blocked || []).filter((a) => mine.has(a.toLowerCase()))) {
          res.refusals.push({ id: c.id, anim, kind: 'blocked', text: 'old hand edits in frames/ shadow a newer raw version (the pack is refused)', fix: `move frames/${anim}/ to frames/_old/, or redo the edits on the new version` });
        }
        const rest = (c.scale?.failed || []).length - failed.length;
        if (rest > 0) res.notes.push(`${c.id}: ${rest} strip(s) the branch did not touch also fail the strict scale gate (not judged)`);
      }
    }
  }
  res.ok = !res.refusals.length;
  return res;
}

// ------------------------------------------------------------------ output
export function formatReport(res, branch = '') {
  const L = [];
  const tag = branch ? `${branch}: ` : '';
  if (res.skipped) return [`[pr] art guard: ${tag}no fighter art changes, nothing to check`];
  const ids = Object.entries(res.changed).map(([id, a]) => `${id} (${a.length} strip${a.length === 1 ? '' : 's'})`).join(', ');
  L.push(`[pr] art guard: ${tag}changed ${ids || 'no judged strips'}`);
  for (const r of res.refusals) {
    L.push(`[pr]   REFUSED ${r.id} ${r.anim}  newest ${vv(r.newest)}  approved ${vv(r.approved)}  (${r.kind})`, `[pr]     ${r.text}`, `[pr]     fix: ${r.fix}`);
  }
  for (const n of res.notes) L.push(`[pr]   note: ${n}`);
  L.push(res.ok ? '[pr] art guard: passed' : `[pr] art guard: ${res.refusals.length} refusal(s)`);
  return L;
}

// the merge commit paragraphs that record a --force-art override
export function overrideMessage(branch, reason, res) {
  const list = res.refusals.map((r) => `${r.id} ${r.anim} (${r.kind}; newest ${vv(r.newest)}, approved ${vv(r.approved)})`).join('; ');
  return [`Merge branch '${branch}'`, `art guard override (--force-art): ${reason}`, `Overrode: ${list}`];
}