#!/usr/bin/env node
// npm run deploy: build and deploy exactly what is committed on HEAD to Vercel production.
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

const head = git('rev-parse', '--short', 'HEAD');
const dirty = git('status', '--porcelain', '--', '.', ':(exclude)art').split('\n').filter(Boolean);
if (!fs.existsSync(path.join(ROOT, '.vercel', 'project.json'))) {
  console.error('deploy: no .vercel/project.json; run `vercel link --project gcd-tourney` first');
  process.exit(1);
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
  fs.copyFileSync(path.join(ROOT, '.vercel', 'project.json'), path.join(work, '.vercel', 'project.json'));
  sh('vercel build --prod', work);
  sh('vercel deploy --prebuilt --prod', work);
  console.log(`\ndeployed commit ${head} (committed work only)`);
  if (dirty.length) console.log(`not deployed: ${dirty.length} uncommitted change(s) outside art/ (commit them first if they should go live)`);
} finally {
  // `vercel build` installs its own node_modules into the export (from package-lock.json); Windows can
  // hold file locks for a moment after the CLI exits, so retry before giving up
  try {
    fs.rmSync(work, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
  } catch {
    console.warn(`deploy: could not delete the temp export ${work} (locked); it is safe to delete by hand`);
  }
  fs.rmSync(index, { force: true });
}
