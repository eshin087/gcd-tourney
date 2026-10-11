#!/usr/bin/env node
// npm run deploy: build and deploy exactly what is committed on HEAD to Vercel production.
// npm run deploy -- --preview: the same, to a Vercel preview URL instead (a PR's branch, from its worktree):
//   the live site is untouched, and the user can try the PR on a phone before it merges (ADR 0018).
//
// Claude and Codex share one working copy, so it usually holds someone's unfinished, unreviewed
// work. Deploying from a clean export of HEAD (minus art/, the ~1 GB of raw generations the game
// never reads) means only committed work can reach https://gcd-tourney.vercel.app.
// Needs: a linked Vercel project (.vercel/project.json, made by `vercel link`) and the Vercel CLI.
// `vercel build` runs its own `npm install` in the export, so the deploy takes about a minute.

import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const git = (...args) => execFileSync('git', args, { cwd: ROOT }).toString().trim();
const sh = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' });
const PREVIEW = process.argv.includes('--preview');

const head = git('rev-parse', '--short', 'HEAD');
const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
const dirty = git('status', '--porcelain', '--', '.', ':(exclude)art').split('\n').filter(Boolean);
// the Vercel link lives in the main checkout only (.vercel is git-ignored, so a PR worktree has none)
const MAIN = path.dirname(git('rev-parse', '--path-format=absolute', '--git-common-dir'));
const LINK = [ROOT, MAIN].map((d) => path.join(d, '.vercel', 'project.json')).find((p) => fs.existsSync(p));
if (!LINK) {
  console.error('deploy: no .vercel/project.json; run `vercel link --project gcd-tourney` in the main checkout first');
  process.exit(1);
}
if (!PREVIEW && branch !== 'main') {
  console.error(`deploy: production deploys come from main (this is ${branch}); use --preview for a PR`);
  process.exit(1);
}

// Sweep exports that earlier runs left behind (a locked file outlived the retries, or the run was
// killed before `finally`). Each one is a few hundred MB, and parallel agents deploy often, so
// without this they piled up to tens of GB in %TEMP%. Only folders older than an hour are touched,
// so a deploy running concurrently in another worktree keeps its export.
const STALE_MS = 60 * 60 * 1000;
for (const name of fs.readdirSync(os.tmpdir())) {
  if (!name.startsWith('gcd-deploy-')) continue;
  const p = path.join(os.tmpdir(), name);
  try {
    if (Date.now() - fs.statSync(p).mtimeMs < STALE_MS) continue;
    fs.rmSync(p, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
    console.log(`deploy: removed stale temp export ${p}`);
  } catch {
    // still locked; the next deploy tries again
  }
}

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'gcd-deploy-'));
// export HEAD with git itself, through a private index file so the shared index (and anything
// another agent has staged) is never touched
const index = path.join(os.tmpdir(), `gcd-deploy-${process.pid}.index`);
const gitIdx = (...args) => execFileSync('git', args, { cwd: ROOT, env: { ...process.env, GIT_INDEX_FILE: index } });
try {
  gitIdx('read-tree', 'HEAD');
  gitIdx('rm', '--cached', '-r', '-q', '--ignore-unmatch', 'art');
  gitIdx('checkout-index', '-a', `--prefix=${work.split(path.sep).join('/')}/`);
  fs.mkdirSync(path.join(work, '.vercel'), { recursive: true });
  fs.copyFileSync(LINK, path.join(work, '.vercel', 'project.json'));
  if (PREVIEW) {
    sh('vercel build', work);
    // the CLI prints the deployment URL on stdout (progress goes to stderr)
    const out = execSync('vercel deploy --prebuilt', { cwd: work, stdio: ['ignore', 'pipe', 'inherit'] }).toString();
    const url = (out.match(/https:\/\/\S+\.vercel\.app/g) || []).pop();
    console.log(`\npreview of ${branch} at ${head} (committed work only): ${url ?? out.trim()}`);
    if (url) console.log(`PREVIEW_URL=${url}`);
  } else {
    sh('vercel build --prod', work);
    sh('vercel deploy --prebuilt --prod', work);
    console.log(`\ndeployed commit ${head} (committed work only)`);
  }
  if (dirty.length) console.log(`not deployed: ${dirty.length} uncommitted change(s) outside art/ (commit them first if they should go live)`);
} finally {
  // `vercel build` installs its own node_modules into the export (from package-lock.json); Windows can
  // hold file locks for a while after the CLI exits, so retry (~15 s) before giving up; anything left
  // is swept by the next deploy
  try {
    fs.rmSync(work, { recursive: true, force: true, maxRetries: 30, retryDelay: 500 });
  } catch {
    console.warn(`deploy: could not delete the temp export ${work} (locked); the next deploy removes it`);
  }
  fs.rmSync(index, { force: true });
}
