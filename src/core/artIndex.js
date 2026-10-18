// Which optional art files exist. Production builds ship /art-index.json (written by
// tools/art-index.mjs before every `npm run build`), so the game never requests a file that
// isn't there: on a static host a missing file is a 404, and every 404 is a console error.
// The Vite dev server answers missing files with index.html instead, so in dev (and when the
// index can't be read) everything is probed directly, which also picks up freshly packed art.
// The index also lists the byte size of every large file, so the loading bar can follow bytes (loadProgress.js).
import { loadProgress } from './loadProgress.js';

let files = null;
let bytes = {};

export async function loadArtIndex() {
  if (import.meta.env.DEV) return;
  try {
    // no-cache, not no-store: the browser revalidates (a 304 when nothing changed) instead of downloading it again
    const res = await loadProgress.track(fetch('/art-index.json', { cache: 'no-cache' }));
    if (res.ok) {
      const data = await res.json();
      files = new Set(data.files || []);
      bytes = data.bytes || {};
    }
  } catch {
    files = null;
  }
}

// How much a file weighs on the loading bar: its size in kB when the index knows it (files under 32 kB are not
// listed and count as 16), 16 in dev, where there is no index.
export function artWeight(path) {
  return (bytes[path.split('?')[0].replace(/^\/+/, '')] ?? 16384) / 1024;
}

// The URL to request a packed art file by. Production asks for the plain path: Vercel serves public files with an
// ETag and `max-age=0, must-revalidate`, so the browser keeps its copy and gets a 304 until a deploy changes the file
// (ENG-102: a `?v=<now>` here made every visit download all 30 MB of art again). In dev a fresh query keeps a
// just-packed sheet from being served out of the browser cache.
export function artUrl(path) {
  return import.meta.env.DEV ? `${path}?v=${Date.now()}` : path;
}

// path: '/characters/naruto/portrait.png' (a query string is ignored)
export function hasArt(path) {
  return !files || files.has(path.split('?')[0].replace(/^\/+/, ''));
}

// Parsed JSON for an optional art file, or null when it is absent or not JSON.
export async function fetchArtJson(path) {
  if (!hasArt(path)) return null;
  const res = await loadProgress.track(fetch(path, { cache: 'no-cache' }), artWeight(path));
  if (!res.ok || !(res.headers.get('content-type') || '').includes('json')) return null;
  return res.json();
}

// ?art=custom also shows world art that is not approved yet: `node tools/pack-sprites.mjs vfx crowd stage npc ui
// --candidates` packs it into public/preview/ instead of the shipped folders (git-ignored, so never deployed).
// Without the flag only approved art (public/vfx, crowd, stage, npc, ui) loads.
const PREVIEW = typeof location !== 'undefined' && new URLSearchParams(location.search).get('art') === 'custom';

// Like fetchArtJson for a world-art folder ('/vfx', '/crowd', '/stage', '/npc/<id>', '/ui'), preferring the
// candidate preview under ?art=custom. Returns { data, dir } (dir = the folder its images live in) or null.
export async function fetchAtlasJson(dir, file = 'atlas.json') {
  if (PREVIEW) {
    const data = await fetchArtJson(`/preview${dir}/${file}`);
    if (data) return { data, dir: `/preview${dir}` };
  }
  const data = await fetchArtJson(`${dir}/${file}`);
  return data ? { data, dir } : null;
}
