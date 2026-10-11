// Review-page-only candidate loader. It never writes approvals or production files.
export async function installReviewCandidates(frame, allowedGroups) {
  const w = frame.contentWindow;
  const ground = w?.game?.fx?.ground;
  if (!ground || typeof w.groundDemo !== 'function') throw new Error('Wait for the match to finish loading.');
  // The game releases pages when changing groups. Reinstall preloaded images
  // on every selection so revisiting an earlier group also renders immediately.
  w.step(0);
  const dir = new URL('./candidate/', import.meta.url);
  const response = await fetch(new URL('atlas.json', dir));
  if (!response.ok) throw new Error('Review atlas could not load: ' + response.status);
  const data = await response.json();
  if (data.source !== 'candidates' || !Array.isArray(data.pages) || !data.decals) throw new Error('Invalid candidate atlas.');
  const groups = new Set(allowedGroups);
  const decals = {};
  for (const [name, entry] of Object.entries(data.decals)) {
    if (!groups.has(entry.group)) continue;
    if (!Number.isInteger(entry.page) || entry.page < 0 || entry.page >= data.pages.length ||
        !Array.isArray(entry.frames) || !entry.frames.length || !(entry.w > 0 && entry.h > 0)) {
      throw new Error('Invalid review decal: ' + name);
    }
    decals[name] = { ...entry };
  }
  if (!Object.keys(decals).length) throw new Error('No candidates for this review group.');
  const needed = new Set(Object.values(decals).map(entry => entry.page));
  const pages = await Promise.all(data.pages.map(async (file, index) => {
    if (!/^[a-zA-Z0-9_.-]+\.png$/.test(file)) throw new Error('Invalid review page name.');
    let img = null;
    if (needed.has(index)) {
      img = new Image();
      img.src = new URL(file, dir).href;
      await img.decode();
    }
    return { file, img, tex: null, loading: null, failed: false };
  }));
  ground.clear();
  ground.epoch++;
  for (const page of ground.custom?.pages ?? []) page.tex?.dispose();
  ground.custom = { dir: dir.pathname.replace(/\/$/, ''), pages, decals };
  const result = { names: Object.keys(decals), variants: Object.values(decals).reduce((sum, e) => sum + e.frames.length, 0) };
  return result;
}
export async function showReviewGroup(frame, group, allowedGroups) {
  if (!allowedGroups.includes(group)) throw new Error('This group is not part of this review.');
  await installReviewCandidates(frame, allowedGroups);
  const w = frame.contentWindow;
  w.freezeCpu();
  const result = w.groundDemo(group);
  w.step(1);
  const ground = w.game.fx.ground;
  const expected = Object.entries(ground.custom.decals).filter(([, e]) => e.group === group);
  const missing = expected.filter(([name]) => ground.active[name]?.src !== 'custom').map(([name]) => name);
  if (missing.length) throw new Error('Candidate pages did not activate: ' + missing.join(', '));
  return result;
}
export function rotateReview(frame) {
  const w = frame.contentWindow;
  if (!w?.game?.fx?.ground) throw new Error('Wait for the match to finish loading.');
  const decals = w.game.fx.ground.decals;
  for (const decal of decals) decal.mesh.rotation.y += Math.PI / 2;
  w.step(1);
  return 'Rotated ' + decals.length + ' decal parts by 90 degrees.';
}
