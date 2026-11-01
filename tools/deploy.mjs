#!/usr/bin/env node
// npm run deploy: build and deploy exactly what is committed on HEAD to Vercel production.
// npm run deploy -- --preview: the same, to a Vercel preview URL instead (a PR's branch, from its worktree):
//   the live site is untouched, and the user can try the PR on a phone before it merges (ADR 0018).
//
// Claude and Codex share one working copy, so it usually holds someone's unfinished, unreviewed
// work. Deploying from a clean export of HEAD (minus art/, public/reviews/ and public/art-review/: the ~2.3 GB of
// raw generations and review material the game never reads, see tools/export-head.mjs) means only committed work
// can reach https://gcd-tourney.vercel.app, and a deployment is ~175 MB instead of 1.26 GB.
// Needs: a linked Vercel project (.vercel/project.json, made by `vercel link`) and the Vercel CLI.
// `vercel build` runs its own `npm install` in the export, so the deploy takes about a minute.

import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { changedReviewFiles, exportTree } from './export-head.mjs';
import { checkDeploySize, formatSize } from './deploy-size.mjs';
import { removeCopy, scratchDir, sweepStale } from './scratch-dir.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const git = (...args) => execFileSync('git', args, { cwd: ROOT }).toString().trim();
// no telemetry: the CLI's background flush outlived `vercel deploy` and kept files in the export locked (TOOL-053)
const VERCEL_ENV = { ...process.env, VERCEL_TELEMETRY_DISABLED: '1' };
const sh = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit', env: VERCEL_ENV });
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

// Sweep exports that earlier runs left behind (rm-later.mjs gave up, or the run was killed before `finally`). Each one
// is several hundred MB, and parallel agents deploy often, so without this they piled up to tens of GB. Only copies
// older than an hour are touched, so a deploy running concurrently in another worktree keeps its export. The scratch
// folder (tools/scratch-dir.mjs) is on the project's drive; the temp folders and their `codex-gcd-*` folders are swept
// too (TOOL-052).
const SCRATCH = scratchDir();
sweepStale({ log: (m) => console.log(`deploy: ${m}`) });

const work = fs.mkdtempSync(path.join(SCRATCH, 'gcd-deploy-'));
// export HEAD minus art/ and the review folders with git itself (tools/export-head.mjs: a private index, safe in sparse art worktrees)
const index = path.join(SCRATCH, `gcd-deploy-${process.pid}.index`);
// The review folders stay out of every deploy (TOOL-066), but a preview brings back the review files its own branch
// changed, so the review page the user opens on a phone works without shipping every older batch (TOOL-067)
const include = PREVIEW ? changedReviewFiles({ root: ROOT, rev: 'HEAD', base: 'main' }) : [];
if (include.length) console.log(`deploy: the preview carries ${include.length} review file(s) this branch changed`);
// Refuse an oversized build before anything is uploaded: every retained deployment counts against the account's
// 10 GB of deployment storage (tools/deploy-size.mjs, TOOL-067)
const guardSize = () => {
  const r = checkDeploySize(path.join(work, '.vercel', 'output'));
  formatSize(r).forEach((l) => (r.ok ? console.log(l) : console.error(l)));
  if (!r.ok) { process.exitCode = 1; throw new Error('deploy refused: build output over the size limit'); }
};
try {
  exportTree({ root: ROOT, rev: 'HEAD', dest: work, index, include });
  fs.mkdirSync(path.join(work, '.vercel'), { recursive: true });
  fs.copyFileSync(LINK, path.join(work, '.vercel', 'project.json'));
  if (PREVIEW) {
    sh('vercel build', work);
    guardSize();
    // the CLI prints the deployment URL on stdout (progress goes to stderr)
    const out = execSync('vercel deploy --prebuilt', { cwd: work, stdio: ['ignore', 'pipe', 'inherit'], env: VERCEL_ENV }).toString();
    const url = (out.match(/https:\/\/\S+\.vercel\.app/g) || []).pop();
    console.log(`\npreview of ${branch} at ${head} (committed work only): ${url ?? out.trim()}`);
    if (url) console.log(`PREVIEW_URL=${url}`);
  } else {
    sh('vercel build --prod', work);
    guardSize();
    sh('vercel deploy --prebuilt --prod', work);
    console.log(`\ndeployed commit ${head} (committed work only)`);
  }
  if (dirty.length) console.log(`not deployed: ${dirty.length} uncommitted change(s) outside art/ (commit them first if they should go live)`);
} finally {
  // `vercel build` installs its own node_modules into the export (from package-lock.json). Windows keeps some of its
  // files locked for a little while after the CLI exits (esbuild.exe, Defender), so a copy that will not go yet is
  // handed to a detached tools/rm-later.mjs, which keeps trying for ~10 min after this process ends (TOOL-053)
  for (const p of [work, index]) {
    const r = removeCopy(p);
    if (r.removed) continue;
    console.warn(`deploy: could not delete ${p} yet (${r.code}); `
      + (r.later ? 'a background cleaner retries for 10 min' : 'the next sweep removes it'));
  }
}
