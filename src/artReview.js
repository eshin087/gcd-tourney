// Read-only art review using exported originals and packed sprite metadata.
// Timings come from each animation; this page never changes approval records.
import './artReview.css';

const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text) node.textContent = text;
  return node;
};
const baseUrl = new URL(import.meta.env.BASE_URL, window.location.href);
const publicUrl = (path) => new URL(path.replace(/^\/+/, ''), baseUrl).href;
const canvas = $('sprite');
const ctx = canvas.getContext('2d');
const imageCache = new Map();
const metaCache = new Map();
let catalog = null;
let character = null;
let asset = null;
let animation = null;
let sheet = null;
let meta = null;
let frameStarts = [];
let durations = [];
let cycleDuration = 0;
let frameIndex = 0;
let playhead = 0;
let playing = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let speed = 1;
let lastTime = performance.now();
let loadId = 0;

function versionLabel(value) {
  return `v${String(value).replace(/^v/i, '').padStart(2, '0')}`;
}

function statusLabel(value) {
  return value === 'approved' ? 'Approved' : value === 'rejected' ? 'Rejected' : 'Needs review';
}

async function fetchJson(path, options) {
  const response = await fetch(publicUrl(path), options);
  if (!response.ok) throw new Error('Review data unavailable');
  return response.json();
}

function loadImage(path) {
  if (!imageCache.has(path)) {
    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Image unavailable'));
      img.src = publicUrl(path);
    }).catch((error) => {
      imageCache.delete(path);
      throw error;
    });
    imageCache.set(path, promise);
  }
  return imageCache.get(path);
}

function loadMeta(path) {
  if (!metaCache.has(path)) {
    metaCache.set(path, fetchJson(path).catch((error) => {
      metaCache.delete(path);
      throw error;
    }));
  }
  return metaCache.get(path);
}

function setPlaying(value) {
  playing = value;
  lastTime = performance.now();
  $('play').textContent = playing ? 'Pause' : 'Play';
  $('play').setAttribute('aria-pressed', String(playing));
}

function syncFrameControls() {
  $('frame').value = frameIndex;
  $('frame-label').textContent = `${frameIndex + 1} / ${animation.frames.length}`;
  $('frame').setAttribute('aria-valuetext', `Frame ${frameIndex + 1} of ${animation.frames.length}`);
  const cadence = durations.every((duration) => duration === durations[0]) ? `${durations[0]} ms per frame` : 'Variable frame timings';
  $('timing').textContent = `${cadence} · ${(cycleDuration / 1000).toFixed(2)} s ${animation.loop ? 'loop' : 'sequence'} · current frame ${durations[frameIndex]} ms`;
  canvas.setAttribute('aria-label', `${character.name}, ${asset.label}, ${versionLabel(asset.version)}, frame ${frameIndex + 1} of ${animation.frames.length}`);
}

function drawFrame() {
  if (!animation || !sheet || !meta) return;
  const fw = meta.frameWidth, fh = meta.frameHeight;
  const tile = animation.frames[frameIndex];
  ctx.clearRect(0, 0, fw, fh);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sheet, (tile % meta.columns) * fw, Math.floor(tile / meta.columns) * fh, fw, fh, 0, 0, fw, fh);
  if ($('guides').checked && Array.isArray(meta.pivot)) {
    ctx.fillStyle = '#78e7c5';
    for (let x = 0; x < fw; x += 6) ctx.fillRect(x, meta.pivot[1], 3, 1);
    ctx.fillRect(meta.pivot[0], meta.pivot[1] - 5, 1, 11);
  }
  syncFrameControls();
}

function setFrame(index) {
  if (!animation) return;
  setPlaying(false);
  frameIndex = (index + animation.frames.length) % animation.frames.length;
  playhead = frameStarts[frameIndex];
  drawFrame();
}

function applyZoom() {
  if (!meta) return;
  canvas.style.width = `${meta.frameWidth * Number($('zoom').value)}px`;
  canvas.style.height = `${meta.frameHeight * Number($('zoom').value)}px`;
}

function tick(now) {
  const elapsed = now - lastTime;
  lastTime = now;
  if (playing && animation && !document.hidden) {
    playhead += elapsed * speed;
    if (animation.loop) playhead %= cycleDuration;
    else if (playhead >= cycleDuration) {
      playhead = cycleDuration - .001;
      setPlaying(false);
    }
    let nextFrame = frameStarts.length - 1;
    while (nextFrame > 0 && playhead < frameStarts[nextFrame]) nextFrame--;
    if (frameIndex !== nextFrame) {
      frameIndex = nextFrame;
      drawFrame();
    }
  }
  requestAnimationFrame(tick);
}

function validateAnimation(nextMeta, nextAnimation, nextSheet) {
  const { frameWidth, frameHeight, columns } = nextMeta;
  if (![frameWidth, frameHeight, columns].every((n) => Number.isInteger(n) && n > 0)) return false;
  if (!Array.isArray(nextAnimation?.frames) || !nextAnimation.frames.length) return false;
  if (!nextAnimation.frames.every((n) => Number.isInteger(n) && n >= 0)) return false;
  if (columns * frameWidth > nextSheet.width) return false;
  return nextAnimation.frames.every((n) => (Math.floor(n / columns) + 1) * frameHeight <= nextSheet.height);
}

async function selectAsset(id) {
  const requestId = ++loadId;
  asset = character.assets.find((item) => item.id === id) || character.assets[0];
  const selectedAsset = asset;
  animation = null;
  sheet = null;
  meta = null;
  frameIndex = 0;
  playhead = 0;
  $('asset-select').value = asset.id;
  $('character-name').textContent = character.name;
  $('asset-title').textContent = asset.label;
  $('version').textContent = versionLabel(asset.version);
  $('review-status').textContent = statusLabel(asset.status);
  $('review-status').className = `status ${asset.status === 'approved' ? 'approved' : asset.status === 'rejected' ? 'rejected' : 'pending'}`;
  $('qa-notes').replaceChildren(...(asset.notes?.length ? asset.notes : ['No additional QA notes for this asset.']).map((note) => el('li', '', note)));
  $('recommendation').textContent = asset.recommendation || '';
  $('recommendation').hidden = !asset.recommendation;
  $('animation-view').hidden = true;
  $('image-view').hidden = true;
  $('raw-panel').hidden = asset.kind !== 'animation';
  $('raw-panel').open = false;
  $('full-image').href = publicUrl(asset.raw);
  $('full-image').hidden = false;
  $('raw-image').src = publicUrl(asset.raw);
  $('raw-image').alt = `${character.name} ${asset.label} ${versionLabel(asset.version)}, original pose strip`;
  $('asset-loading').hidden = false;
  $('asset-loading').className = 'notice';
  $('asset-loading').textContent = 'Loading artwork…';
  const params = new URLSearchParams(window.location.search);
  params.set('c', character.id);
  params.set('a', asset.id);
  history.replaceState(null, '', `${window.location.pathname}?${params}${window.location.hash}`);
  try {
    if (asset.kind === 'animation') {
      const [nextMeta, nextSheet] = await Promise.all([loadMeta(asset.meta), loadImage(asset.sheet)]);
      if (requestId !== loadId) return;
      const nextAnimation = nextMeta.animations?.[selectedAsset.animation];
      if (!validateAnimation(nextMeta, nextAnimation, nextSheet)) throw new Error('Animation unavailable');
      if (!Array.isArray(nextAnimation.durations) || nextAnimation.durations.length !== nextAnimation.frames.length ||
          !nextAnimation.durations.every((duration) => Number.isFinite(duration) && duration > 0)) {
        throw new Error('Frame timings unavailable');
      }
      meta = nextMeta;
      sheet = nextSheet;
      animation = nextAnimation;
      durations = nextAnimation.durations;
      cycleDuration = durations.reduce((sum, duration) => sum + duration, 0);
      let start = 0;
      frameStarts = durations.map((duration) => { const frameStart = start; start += duration; return frameStart; });
      canvas.width = meta.frameWidth;
      canvas.height = meta.frameHeight;
      $('frame').max = animation.frames.length - 1;
      applyZoom();
      setPlaying(playing);
      drawFrame();
      $('animation-view').hidden = false;
    } else {
      const img = await loadImage(asset.raw);
      if (requestId !== loadId) return;
      $('reference-image').src = img.src;
      $('reference-image').alt = `${character.name} ${asset.label} ${versionLabel(asset.version)}`;
      $('image-view').hidden = false;
    }
    $('asset-loading').hidden = true;
  } catch {
    if (requestId !== loadId) return;
    $('asset-loading').className = 'notice error';
    $('asset-loading').textContent = 'This preview could not be loaded. Try another asset or reload the page. The original image link is available below.';
  }
}

function selectCharacter(id, assetId) {
  character = catalog.characters.find((item) => item.id === id) || catalog.characters[0];
  if (character.accent) document.documentElement.style.setProperty('--accent', character.accent);
  for (const button of $('characters').children) button.setAttribute('aria-pressed', String(button.dataset.id === character.id));
  $('asset-select').replaceChildren(...character.assets.map((item) => new Option(`${item.label} · ${versionLabel(item.version)} · ${statusLabel(item.status)}`, item.id)));
  const preferred = assetId || character.assets.find((item) => item.status === 'needs review')?.id || character.assets[0].id;
  selectAsset(preferred);
}

async function loadCatalog() {
  $('retry').hidden = true;
  $('catalog-status').hidden = false;
  $('catalog-status').className = 'notice';
  $('catalog-status').textContent = 'Loading review collection…';
  try {
    catalog = await fetchJson('art-review/review.json', { cache: 'no-store' });
    if (!catalog.characters?.length || catalog.characters.some((item) => !item.assets?.length)) throw new Error('Empty collection');
    $('characters').replaceChildren(...catalog.characters.map((item) => {
      const button = el('button', '', item.name);
      button.dataset.id = item.id;
      button.type = 'button';
      button.addEventListener('click', () => selectCharacter(item.id, asset?.id));
      return button;
    }));
    if (catalog.updatedAt) {
      const date = new Date(catalog.updatedAt);
      $('collection-date').textContent = Number.isNaN(date.getTime()) ? '' : `Collection updated ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    $('collection').hidden = false;
    $('catalog-status').hidden = true;
    const params = new URLSearchParams(window.location.search);
    selectCharacter(params.get('c'), params.get('a'));
  } catch {
    $('catalog-status').className = 'notice error';
    $('catalog-status').textContent = 'The review collection is unavailable. Reload to try again.';
    $('retry').hidden = false;
  }
}

$('asset-select').addEventListener('change', (event) => selectAsset(event.target.value));
$('play').addEventListener('click', () => {
  if (!animation) return;
  if (!playing && !animation.loop && playhead >= cycleDuration - 1) playhead = 0;
  setPlaying(!playing);
});
$('previous').addEventListener('click', () => setFrame(frameIndex - 1));
$('next').addEventListener('click', () => setFrame(frameIndex + 1));
$('frame').addEventListener('input', (event) => setFrame(Number(event.target.value)));
$('speed').addEventListener('change', (event) => { speed = Number(event.target.value); lastTime = performance.now(); });
$('zoom').addEventListener('change', applyZoom);
$('background').addEventListener('change', (event) => { $('stage').className = `stage ${event.target.value}`; });
$('guides').addEventListener('change', drawFrame);
$('retry').addEventListener('click', loadCatalog);
document.addEventListener('visibilitychange', () => { lastTime = performance.now(); });
requestAnimationFrame(tick);
loadCatalog();
