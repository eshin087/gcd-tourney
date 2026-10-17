// Where tools build throw-away copies (deploy exports, art-guard scratch trees; publishing uses .publish-cache/).
//
// Not os.tmpdir() when that is on another drive than the project: a deploy export (committed tree plus
// `vercel build`) is ~4 GB, and parallel agents deploy often, so on a machine whose project drive is not the system
// drive that filled the system drive. The scratch folder is `gcd-scratch` at the root of the project's drive, shared
// by every worktree so stale-export sweeps see each other's leftovers. Same drive as the temp folder (and Linux, mac
// and CI, where there is only one root): plain os.tmpdir(), unchanged. GCD_SCRATCH_DIR overrides both. It is honoured
// (a sandbox may only be able to write there), but warned about when it puts scratch on the system drive while the
// project lives elsewhere: Codex's %TEMP%\codex-gcd-<task> folders took 4.9 GB of C: per preview deploy (TOOL-052).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const driveOf = (p) => path.parse(path.resolve(p)).root.toLowerCase();
const SYSTEM = process.env.SystemDrive ? driveOf(process.env.SystemDrive + '\\') : driveOf(os.tmpdir());
let warned = false;

export function scratchDir() {
  const override = process.env.GCD_SCRATCH_DIR;
  if (override && !warned && driveOf(override) === SYSTEM && driveOf(ROOT) !== SYSTEM) {
    warned = true;
    console.warn(`[scratch] GCD_SCRATCH_DIR=${override} is on the system drive, but the project is on ${driveOf(ROOT)}: `
      + `deploy exports and guard copies fill the system drive. Unset it (default ${path.join(path.parse(ROOT).root, 'gcd-scratch')}) `
      + `or point it at a folder on ${driveOf(ROOT)}`);
  }
  const dir = override
    || (driveOf(ROOT) === driveOf(os.tmpdir()) ? os.tmpdir() : path.join(path.parse(ROOT).root, 'gcd-scratch'));
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// ------------------------------------------------------------------ throw-away copies: sweeping and late removal
// Every tool names its throw-away copy `<prefix>XXXXXX` (fs.mkdtempSync) directly in a scratch folder. A copy a tool
// could not delete (Windows keeps files locked for a while after a process exits: the Vercel CLI's telemetry flush,
// esbuild.exe, Defender) is handed to tools/rm-later.mjs; one a killed run left is swept by the next tool run.
export const SCRATCH_PREFIXES = ['gcd-deploy-', 'gcd-art-guard-', 'gcd-stitch-ref-'];
const STALE_MS = 60 * 60 * 1000;

const subdirs = (dir, prefix) => {
  try {
    return fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory() && e.name.startsWith(prefix)).map((e) => path.join(dir, e.name));
  } catch { return []; }
};

// The folders that may hold copies: the scratch folder, the OS temp folder (older versions of the tools used it), the
// Windows user temp (each agent may have its own TEMP: Claude's is on E:, Codex's on C:) and their `codex-gcd-*`
// folders (Codex pointed GCD_SCRATCH_DIR at a new %TEMP%\codex-gcd-<task> per run, TOOL-052).
export function scratchRoots() {
  const temps = [...new Set([os.tmpdir(), process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Temp')].filter(Boolean))];
  return [...new Set([scratchDir(), ...temps, ...temps.flatMap((t) => subdirs(t, 'codex-gcd-'))].map((d) => path.resolve(d)))];
}

// true only for a tool's own throw-away copy (or a deploy's private index file) directly inside a scratch root:
// the one kind of path the sweep and rm-later.mjs may delete
export function isScratchCopy(p) {
  const abs = path.resolve(p), name = path.basename(abs);
  if (!/^gcd-(deploy|art-guard|stitch-ref)-[\w.-]+$/.test(name)) return false;
  const parent = path.dirname(abs).toLowerCase();
  return scratchRoots().some((r) => r.toLowerCase() === parent);
}

// Delete copies older than an hour (a copy running in another worktree right now is younger), from every scratch root.
// -> paths removed
export function sweepStale({ log = (m) => console.log(m), maxAgeMs = STALE_MS } = {}) {
  const removed = [];
  for (const dir of scratchRoots()) {
    let names = [];
    try { names = fs.readdirSync(dir); } catch { continue; }
    for (const name of names) {
      if (!SCRATCH_PREFIXES.some((pre) => name.startsWith(pre))) continue;
      const p = path.join(dir, name);
      try {
        if (Date.now() - fs.statSync(p).mtimeMs < maxAgeMs) continue;
        fs.rmSync(p, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
        removed.push(p);
        log(`[scratch] removed stale copy ${p}`);
      } catch {
        // still locked; the next run tries again
      }
    }
  }
  return removed;
}

// Remove a throw-away copy now, or hand it to a detached tools/rm-later.mjs that keeps trying for ~10 min after this
// process exits. -> { removed: true } | { removed: false, code, later: true|false }
export function removeCopy(p, { tries = 10, retryDelay = 300 } = {}) {
  try {
    fs.rmSync(p, { recursive: true, force: true, maxRetries: tries, retryDelay });
    return { removed: true };
  } catch (e) {
    if (!isScratchCopy(p)) return { removed: false, code: e.code || e.message, later: false };
    // cwd outside the copy so the cleaner itself never locks it; no stdio, so it holds no caller's pipe open
    const child = spawn(process.execPath, [path.join(ROOT, 'tools', 'rm-later.mjs'), p],
      { cwd: path.dirname(p), detached: true, stdio: 'ignore', windowsHide: true, env: process.env });
    child.unref();
    return { removed: false, code: e.code || e.message, later: true };
  }
}
