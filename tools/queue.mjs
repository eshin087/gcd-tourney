#!/usr/bin/env node
// Claim queue for parallel art production (ADR 0008).
//
//   npm run queue -- build                                   regenerate art/queue/batches.json
//   npm run queue -- claim [--type crowd|stage|npc|ui|vfx] --agent <name>
//   npm run queue -- done <batch> --agent <name> [--note "..."]
//   npm run queue -- release <batch> --agent <name>
//   npm run queue -- reopen <batch> [--items id1,id2] [--note "..."]   (lead only: redo rejected items)
//   npm run queue -- status                                  print progress, write art/queue/STATUS.md
//   npm run queue -- next-file <path-without-version>        e.g. art/crowd/raw/db-001 -> art/crowd/raw/db-001_v02.png
//
// Many Codex workers share one working copy. A claim is a file created with an exclusive
// create ('wx'), so two workers can never own the same batch. Only the lead edits shared files.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const Q = path.join(ROOT, 'art', 'queue');
const CLAIMS = path.join(Q, 'claims');
const HISTORY = path.join(CLAIMS, '_history');
const BATCHES = path.join(Q, 'batches.json');
const EXTRA = path.join(Q, 'extra.json'); // lead-only: re-opened batches (rejected items to redo)
const SOURCES = path.join(Q, 'sources.json');
const STALE_MS = 3 * 60 * 60 * 1000;
const CROWD_BATCH = 10;
const TYPE_ORDER = ['crowd', 'stage', 'npc', 'ui', 'vfx'];

const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const readJson = (p, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    if (fallback !== undefined && e.code === 'ENOENT') return fallback;
    throw new Error(`${rel(p)}: ${e.message}`);
  }
};
const writeJson = (p, v) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(v, null, 2) + '\n');
};
const now = () => new Date().toISOString();

function args(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      o[k] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
    } else o._.push(a);
  }
  return o;
}

// ---------------------------------------------------------------- versioned files
const VERSION_RE = /_v(\d{2,})\.png$/i;

// Highest existing version of <base>_vNN.png (0 when none). Ignores _rejected/ (it's a subfolder).
function latestVersion(base) {
  const dir = path.dirname(base), stem = path.basename(base);
  let best = 0;
  let names = [];
  try { names = fs.readdirSync(dir); } catch { return 0; }
  for (const n of names) {
    if (!n.toLowerCase().startsWith(stem.toLowerCase() + '_v')) continue;
    const m = n.match(VERSION_RE);
    if (m && n.slice(0, n.length - m[0].length).toLowerCase() === stem.toLowerCase()) best = Math.max(best, +m[1]);
  }
  // rejected versions still count, so a number is never reused
  try {
    for (const n of fs.readdirSync(path.join(dir, '_rejected'))) {
      const m = n.match(VERSION_RE);
      if (m && n.slice(0, n.length - m[0].length).toLowerCase() === stem.toLowerCase()) best = Math.max(best, +m[1]);
    }
  } catch {}
  return best;
}
const nextFile = (base) => `${base}_v${String(latestVersion(path.join(ROOT, base)) + 1).padStart(2, '0')}.png`;
// an output "exists" when at least one non-rejected version is present
function hasCurrent(base) {
  const dir = path.join(ROOT, path.dirname(base)), stem = path.basename(base).toLowerCase();
  try {
    return fs.readdirSync(dir).some((n) => {
      const m = n.match(VERSION_RE);
      return m && n.slice(0, n.length - m[0].length).toLowerCase() === stem;
    });
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------- batch sources
function crowdBatches() {
  const dir = path.join(ROOT, 'art', 'crowd', 'roster');
  let files = [];
  try { files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort(); } catch { return []; }
  const out = [];
  const seen = new Set();
  for (const f of files) {
    const r = readJson(path.join(dir, f));
    const group = r.group || path.basename(f, '.json');
    const ids = (r.spectators || []).map((s) => s.id).filter((id) => {
      if (!id || seen.has(id)) { console.warn(`  warn: ${f}: duplicate or missing id ${id}`); return false; }
      seen.add(id);
      return true;
    });
    for (let i = 0; i < ids.length; i += CROWD_BATCH) {
      const items = ids.slice(i, i + CROWD_BATCH);
      out.push({
        id: `crowd-${group}-${String(i / CROWD_BATCH + 1).padStart(2, '0')}`,
        type: 'crowd',
        items,
        roster: `art/crowd/roster/${f}`,
        prompt: 'art/crowd/PROMPTS.md',
        outputs: items.map((id) => `art/crowd/raw/${id}`),
      });
    }
  }
  return out;
}

function sourceBatches() {
  const s = readJson(SOURCES, {});
  const out = [];
  for (const slot of s.stage || []) {
    out.push({ id: `stage-${slot.id}`, type: 'stage', items: [slot.id], prompt: 'art/stage/PROMPTS.md', brief: 'art/stage/ASSETS.md', outputs: [`art/stage/raw/${slot.id}`] });
  }
  for (const npc of s.npc || []) {
    out.push({
      id: `npc-${npc.id}`,
      type: 'npc',
      items: ['model_sheet', ...npc.anims],
      prompt: `art/npc/${npc.id}/PROMPTS.md`,
      brief: `art/npc/${npc.id}/CHARACTER.md`,
      outputs: [`art/npc/${npc.id}/reference/model_sheet`, ...npc.anims.map((a) => `art/npc/${npc.id}/raw/${a}`)],
    });
  }
  for (const ui of s.ui || []) {
    out.push({ id: `ui-${ui.id}`, type: 'ui', items: [ui.id], prompt: 'art/ui/PROMPTS.md', outputs: [`art/ui/raw/${ui.id}`] });
  }
  for (const fx of s.vfx || []) {
    out.push({ id: `vfx-${fx.id}`, type: 'vfx', items: [fx.id], prompt: 'art/vfx/PROMPTS.md', brief: 'art/vfx/EFFECTS.md', outputs: [`art/vfx/raw/${fx.id}`] });
  }
  return out;
}

function allBatches() {
  const base = readJson(BATCHES, { batches: [] }).batches;
  const extra = readJson(EXTRA, { batches: [] }).batches;
  return [...base, ...extra];
}

// ---------------------------------------------------------------- claims
const claimPath = (id) => path.join(CLAIMS, `${id}.json`);
const readClaim = (id) => readJson(claimPath(id), null);

function tryClaim(batch, agent) {
  fs.mkdirSync(CLAIMS, { recursive: true });
  const p = claimPath(batch.id);
  const existing = readClaim(batch.id);
  if (existing) {
    const age = Date.now() - Date.parse(existing.touchedAt || existing.claimedAt);
    if (existing.status !== 'claimed' || age < STALE_MS) return false;
    // stale: move it aside atomically; whoever wins the rename may re-claim
    fs.mkdirSync(HISTORY, { recursive: true });
    try { fs.renameSync(p, path.join(HISTORY, `${batch.id}.stale-${Date.now()}.json`)); } catch { return false; }
  }
  const claim = { batch: batch.id, type: batch.type, agent, status: 'claimed', claimedAt: now(), touchedAt: now(), items: batch.items };
  try {
    const fd = fs.openSync(p, 'wx');
    fs.writeSync(fd, JSON.stringify(claim, null, 2) + '\n');
    fs.closeSync(fd);
    return true;
  } catch (e) {
    if (e.code === 'EEXIST') return false;
    throw e;
  }
}

function describe(batch) {
  const lines = [`BATCH ${batch.id}  (${batch.type}, ${batch.items.length} item(s))`];
  if (batch.note) lines.push(`note: ${batch.note}`);
  if (batch.roster) lines.push(`roster: ${batch.roster}  (read each item's entry there)`);
  if (batch.brief) lines.push(`brief:  ${batch.brief}`);
  lines.push(`prompt: ${batch.prompt}`);
  lines.push('save each image as the next free version (never overwrite):');
  for (const o of batch.outputs) lines.push(`  ${nextFile(o)}`);
  lines.push(`when every item is saved: npm run queue -- done ${batch.id} --agent <you>`);
  return lines.join('\n');
}

// ---------------------------------------------------------------- commands
function cmdBuild() {
  const batches = [...crowdBatches(), ...sourceBatches()];
  writeJson(BATCHES, { builtAt: now(), note: 'generated by `npm run queue -- build`; do not edit by hand', batches });
  const by = {};
  for (const b of batches) by[b.type] = (by[b.type] || 0) + 1;
  console.log(`built ${batches.length} batches: ${Object.entries(by).map(([k, v]) => `${k} ${v}`).join(', ') || 'none'}`);
}

function cmdClaim(o) {
  const agent = o.agent;
  if (!agent || agent === true) return fail('claim needs --agent <name>');
  const types = o.type && o.type !== true ? [o.type] : TYPE_ORDER;
  const batches = allBatches();
  if (!batches.length) return fail('no batches: run `npm run queue -- build` first');
  for (const t of types) {
    for (const b of batches.filter((x) => x.type === t)) {
      if (tryClaim(b, agent)) {
        console.log(describe(b));
        return;
      }
    }
  }
  console.log(`nothing left to claim${o.type ? ` for type ${o.type}` : ''}`);
}

function ownClaim(id, agent, verb) {
  const c = readClaim(id);
  if (!c) return fail(`${id} is not claimed`);
  if (agent && agent !== true && c.agent !== agent) return fail(`${id} is claimed by ${c.agent}, not ${agent}`);
  if (c.status !== 'claimed') return fail(`${id} is already ${c.status}; cannot ${verb}`);
  return c;
}

function cmdDone(o) {
  const id = o._[1];
  const c = ownClaim(id, o.agent, 'finish');
  if (!c) return;
  const b = allBatches().find((x) => x.id === id);
  if (!b) return fail(`unknown batch ${id}`);
  const missing = b.outputs.filter((base) => !hasCurrent(base));
  if (missing.length) return fail(`${id}: missing output(s):\n${missing.map((m) => `  ${m}_vNN.png`).join('\n')}`);
  writeJson(claimPath(id), { ...c, status: 'done', doneAt: now(), touchedAt: now(), note: o.note && o.note !== true ? o.note : c.note });
  console.log(`${id} done (${b.outputs.length} output(s)). Claim the next one: npm run queue -- claim --agent ${c.agent}`);
}

function cmdRelease(o) {
  const id = o._[1];
  const c = ownClaim(id, o.agent, 'release');
  if (!c) return;
  fs.mkdirSync(HISTORY, { recursive: true });
  fs.renameSync(claimPath(id), path.join(HISTORY, `${id}.released-${Date.now()}.json`));
  console.log(`${id} released`);
}

// Lead only: give rejected items back to the pool as a new batch (<id>-rN).
function cmdReopen(o) {
  const id = o._[1];
  const b = allBatches().find((x) => x.id === id);
  if (!b) return fail(`unknown batch ${id}`);
  const items = o.items && o.items !== true ? o.items.split(',').map((s) => s.trim()).filter(Boolean) : b.items;
  const bad = items.filter((i) => !b.items.includes(i));
  if (bad.length) return fail(`${id} has no item(s): ${bad.join(', ')}`);
  const extra = readJson(EXTRA, { batches: [] });
  const base = id.replace(/-r\d+$/, '');
  let n = 1;
  while (allBatches().some((x) => x.id === `${base}-r${n}`)) n++;
  const outputs = b.outputs.filter((out) => items.some((i) => out.endsWith(`/${i}`) || out.endsWith(`/raw/${i}`)));
  const nb = { ...b, id: `${base}-r${n}`, items, outputs: outputs.length ? outputs : b.outputs, note: o.note && o.note !== true ? o.note : 'redo rejected item(s): move the rejected file to _rejected/ first, then save the next version' };
  extra.batches.push(nb);
  writeJson(EXTRA, extra);
  console.log(`re-opened as ${nb.id}: ${items.join(', ')}`);
}

function cmdStatus() {
  const batches = allBatches();
  const rows = [];
  const counts = {};
  const active = [];
  for (const b of batches) {
    const c = readClaim(b.id);
    const st = !c ? 'free' : c.status === 'claimed' && Date.now() - Date.parse(c.touchedAt || c.claimedAt) > STALE_MS ? 'stale' : c.status;
    const k = (counts[b.type] = counts[b.type] || { free: 0, claimed: 0, stale: 0, done: 0, total: 0 });
    k[st] = (k[st] || 0) + 1;
    k.total++;
    if (c && st !== 'done') active.push(`| ${b.id} | ${c.agent} | ${st} | ${c.claimedAt} |`);
  }
  for (const [t, k] of Object.entries(counts)) rows.push(`| ${t} | ${k.total} | ${k.done} | ${k.claimed} | ${k.stale} | ${k.free} |`);
  const md = [
    '# Art queue status',
    '',
    `Generated by \`npm run queue -- status\` at ${now()}. Do not edit by hand.`,
    '',
    '| type | batches | done | claimed | stale | free |',
    '|---|---|---|---|---|---|',
    ...rows,
    '',
    '## Active claims',
    '',
    '| batch | agent | state | claimed at |',
    '|---|---|---|---|',
    ...(active.length ? active : ['| - | - | - | - |']),
    '',
  ].join('\n');
  fs.mkdirSync(Q, { recursive: true });
  fs.writeFileSync(path.join(Q, 'STATUS.md'), md);
  console.log(md);
}

function fail(msg) {
  console.error(`queue: ${msg}`);
  process.exitCode = 1;
}

const o = args(process.argv.slice(2));
const cmd = o._[0];
try {
  if (cmd === 'build') cmdBuild();
  else if (cmd === 'claim') cmdClaim(o);
  else if (cmd === 'done') cmdDone(o);
  else if (cmd === 'release') cmdRelease(o);
  else if (cmd === 'reopen') cmdReopen(o);
  else if (cmd === 'status') cmdStatus();
  else if (cmd === 'next-file') console.log(nextFile(o._[1] || fail('next-file needs a path like art/crowd/raw/db-001')));
  else {
    console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 12).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
    if (cmd) process.exitCode = 1;
  }
} catch (e) {
  fail(e.message);
}
