#!/usr/bin/env node
// npm run deploy: build and deploy exactly what is committed on HEAD to Vercel production.
//
// Claude and Codex share one working copy, so it usually holds someone's unfinished, unreviewed
// work. Deploying from a clean export of HEAD (minus art/, the ~1 GB of raw generations the game
// never reads) means only committed work can reach https://gcd-tourney.vercel.app.
// Needs: a linked Vercel project (.vercel/project.json, made by `vercel link`) and the Vercel CLI.

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
const tar = path.join(os.tmpdir(), `gcd-deploy-${head}.tar`);
try {
  git('archive', '--format=tar', '-o', tar, 'HEAD', '--', '.', ':(exclude)art');
  sh(`tar -xf "${tar}" -C "${work}"`, ROOT);
  fs.symlinkSync(path.join(ROOT, 'node_modules'), path.join(work, 'node_modules'), 'junction');
  fs.mkdirSync(path.join(work, '.vercel'), { recursive: true });
  fs.copyFileSync(path.join(ROOT, '.vercel', 'project.json'), path.join(work, '.vercel', 'project.json'));
  sh('vercel build --prod', work);
  sh('vercel deploy --prebuilt --prod', work);
  console.log(`\ndeployed commit ${head} (committed work only)`);
  if (dirty.length) console.log(`not deployed: ${dirty.length} uncommitted change(s) outside art/ (commit them first if they should go live)`);
} finally {
  try { fs.unlinkSync(path.join(work, 'node_modules')); } catch {}
  fs.rmSync(work, { recursive: true, force: true });
  fs.rmSync(tar, { force: true });
}
