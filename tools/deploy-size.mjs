// Deploy size guard for tools/deploy.mjs (TOOL-067): measures the built output before `vercel deploy` uploads it and
// refuses a deploy over the limit. The Vercel Hobby plan holds 10 GB of deployment storage for the whole account, and
// every retained deployment counts in full. On 2026-11-01 review folders under public/ had made each deployment
// ~1.26 GB (TOOL-066) and nothing noticed until the account showed 347 GB. A production deploy was ~175 MB after the
// fix, most of it public/characters/, which grows by roughly 20 to 30 MB per fighter.
//
// The limit is GCD_DEPLOY_MAX_MB (default DEFAULT_MAX_MB). Raise it on purpose, with a reason in the commit, when the
// cast has grown; never to push a one-off folder through.
import fs from 'node:fs';
import path from 'node:path';

export const DEFAULT_MAX_MB = 250;

const MB = 1024 * 1024;

export function maxMb(env = process.env) {
  const n = Number(env.GCD_DEPLOY_MAX_MB);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_MAX_MB;
}

// -> bytes of every file under dir (0 when it does not exist)
export function dirBytes(dir) {
  if (!fs.existsSync(dir)) return 0;
  let total = 0;
  for (const f of fs.readdirSync(dir, { recursive: true, withFileTypes: true })) {
    if (f.isFile()) total += fs.statSync(path.join(f.parentPath ?? f.path, f.name)).size;
  }
  return total;
}

// -> { ok, mb, limit, top: [{ dir, mb }] }: top lists the largest folders two levels down (static/<folder> in a Vercel
// build output, the copy of public/<folder>), so a refusal names the folder to move out instead of only a total
export function checkDeploySize(dir, { limit = maxMb(), count = 8 } = {}) {
  const sizes = [];
  const subdirs = (d) => (fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }) : []).filter((e) => e.isDirectory())
    .map((e) => path.join(d, e.name));
  for (const p of subdirs(dir).flatMap(subdirs)) {
    sizes.push({ dir: path.relative(dir, p).split(path.sep).join('/'), mb: dirBytes(p) / MB });
  }
  const mb = dirBytes(dir) / MB;
  return { ok: mb <= limit, mb, limit, top: sizes.sort((a, b) => b.mb - a.mb).slice(0, count) };
}

export function formatSize(r) {
  const head = `deploy: build output ${r.mb.toFixed(1)} MB (limit ${r.limit} MB, GCD_DEPLOY_MAX_MB)`;
  if (r.ok) return [head];
  return [
    `${head}: REFUSED, nothing was uploaded`,
    'deploy: largest folders in the output:',
    ...r.top.map((t) => `  ${t.mb.toFixed(1).padStart(8)} MB  ${t.dir}`),
    'deploy: move large review or source material out of public/ (or add it to EXCLUDE in tools/export-head.mjs);',
    'deploy: raise GCD_DEPLOY_MAX_MB only when the shipped game itself has grown (see tools/deploy-size.mjs)',
  ];
}
