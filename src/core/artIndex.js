// Which optional art files exist. Production builds ship /art-index.json (written by
// tools/art-index.mjs before every `npm run build`), so the game never requests a file that
// isn't there: on a static host a missing file is a 404, and every 404 is a console error.
// The Vite dev server answers missing files with index.html instead, so in dev (and when the
// index can't be read) everything is probed directly, which also picks up freshly packed art.
let files = null;

export async function loadArtIndex() {
  if (import.meta.env.DEV) return;
  try {
    const res = await fetch('/art-index.json', { cache: 'no-store' });
    if (res.ok) files = new Set((await res.json()).files || []);
  } catch {
    files = null;
  }
}

// path: '/characters/naruto/portrait.png' (a query string is ignored)
export function hasArt(path) {
  return !files || files.has(path.split('?')[0].replace(/^\/+/, ''));
}

// Parsed JSON for an optional art file, or null when it is absent or not JSON.
export async function fetchArtJson(path) {
  if (!hasArt(path)) return null;
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok || !(res.headers.get('content-type') || '').includes('json')) return null;
  return res.json();
}

// ?art=custom also shows world art that is not approved yet: `npm run sprites -- --candidates` packs it into
// public/preview/ (git-ignored, so never deployed). Without the flag only approved art (public/vfx, /crowd) loads.
const PREVIEW = typeof location !== 'undefined' && new URLSearchParams(location.search).get('art') === 'custom';

// Like fetchArtJson for an atlas folder ('/vfx', '/crowd'), preferring the candidate preview under ?art=custom.
// Returns { data, dir } (dir = the folder its png lives in) or null.
export async function fetchAtlasJson(dir) {
  if (PREVIEW) {
    const data = await fetchArtJson(`/preview${dir}/atlas.json`);
    if (data) return { data, dir: `/preview${dir}` };
  }
  const data = await fetchArtJson(`${dir}/atlas.json`);
  return data ? { data, dir } : null;
}
