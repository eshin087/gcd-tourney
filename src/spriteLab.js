import { ROSTER } from './characters/index.js';
import { bakeCharacter } from './art/rig/baker.js';
import { ANIM_GUIDE, chatgptPrompt } from './art/animGuide.js';

const $ = (id) => document.getElementById(id);
const who = $('who'), grid = $('grid'), sheetWrap = $('sheetWrap'), status = $('status');
const flipBox = $('flip'), zoomSel = $('zoom');
const impAnim = $('impAnim'), impPreview = $('impPreview'), impInfo = $('impInfo');

for (const c of ROSTER) who.add(new Option(c.name, c.id));

let current = null; // { canvas, meta }
let players = [];
let selected = 'idle';
let pending = null; // imported frames waiting to be applied

const char = () => ROSTER.find((r) => r.id === who.value);

// ------------------------------------------------------------------ viewer
function show(sheet) {
  current = sheet;
  grid.innerHTML = '';
  sheetWrap.innerHTML = '';
  players = [];
  const { canvas, meta } = sheet;
  const z = +zoomSel.value;
  const prevSel = selected;
  impAnim.innerHTML = '';
  for (const [name, a] of Object.entries(meta.animations)) {
    impAnim.add(new Option(name, name));
    const cell = document.createElement('div');
    cell.className = 'cell' + (name === selected ? ' sel' : '');
    const cv = document.createElement('canvas');
    cv.width = meta.frameWidth;
    cv.height = meta.frameHeight;
    cv.style.width = meta.frameWidth * z / 1.5 + 'px';
    cv.style.height = meta.frameHeight * z / 1.5 + 'px';
    const n = document.createElement('div');
    n.className = 'n';
    n.textContent = `${name} (${a.frames.length})${a.phases ? ' [' + a.phases.join('/') + ']' : ''}`;
    cell.append(cv, n);
    cell.onclick = () => selectAnim(name);
    grid.append(cell);
    players.push({ cv, ctx: cv.getContext('2d'), a, i: 0, t: 0, name, cell });
  }
  const big = canvas.cloneNode();
  big.getContext('2d').drawImage(canvas, 0, 0);
  big.style.width = canvas.width * (z / 2) + 'px';
  sheetWrap.append(big);
  selectAnim(meta.animations[prevSel] ? prevSel : 'idle');
}

function selectAnim(name) {
  selected = name;
  impAnim.value = name;
  for (const p of players) p.cell.classList.toggle('sel', p.name === name);
  $('impHeight').value = measureHeight(name) || 46;
  const c = char();
  $('prompt').value = chatgptPrompt(c.name, c.look || '', name);
  if (pending) renderPending();
}

function draw(dt) {
  if (!current) return;
  const { canvas, meta } = current;
  const fw = meta.frameWidth, fh = meta.frameHeight, cols = meta.columns || Math.floor(canvas.width / fw);
  for (const p of players) {
    p.t += dt;
    const d = p.a.durations?.[p.i] ?? 100;
    if (p.t > d) {
      p.t = 0;
      p.i = (p.i + 1) % p.a.frames.length;
    }
    const f = p.a.frames[p.i];
    p.ctx.clearRect(0, 0, fw, fh);
    p.ctx.save();
    if (flipBox.checked) { p.ctx.translate(fw, 0); p.ctx.scale(-1, 1); }
    p.ctx.drawImage(canvas, (f % cols) * fw, Math.floor(f / cols) * fh, fw, fh, 0, 0, fw, fh);
    p.ctx.restore();
    p.ctx.fillStyle = 'rgba(255,0,80,.7)';
    p.ctx.fillRect(meta.pivot[0], meta.pivot[1], 1, 1);
  }
}

let last = performance.now();
function loop(now) {
  draw(now - last);
  last = now;
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function bake() {
  const c = char();
  const t0 = performance.now();
  const s = bakeCharacter(c);
  status.textContent = `${Object.keys(s.meta.animations).length} anims, baked in ${(performance.now() - t0).toFixed(0)} ms`;
  show(s);
}

who.onchange = bake;
$('reset').onclick = bake;
zoomSel.onchange = () => current && show(current);
impAnim.onchange = () => selectAnim(impAnim.value);

function download(name, blob) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
$('dlPng').onclick = () => current.canvas.toBlob((b) => download('sheet.png', b));
$('dlJson').onclick = () => download('anims.json', new Blob([JSON.stringify(current.meta, null, 2)], { type: 'application/json' }));
$('copyPrompt').onclick = async () => {
  try {
    await navigator.clipboard.writeText($('prompt').value);
    status.textContent = 'Prompt copied';
  } catch {
    $('prompt').select();
    status.textContent = 'Press Ctrl+C to copy';
  }
};

$('custom').onchange = async (e) => {
  const files = [...e.target.files];
  const png = files.find((f) => f.name.endsWith('.png'));
  const json = files.find((f) => f.name.endsWith('.json'));
  if (!png) { status.textContent = 'Pick a .png (and optionally its .json)'; return; }
  const meta = json ? JSON.parse(await json.text()) : current.meta;
  const img = await loadImage(png);
  const cv = toCanvas(img);
  status.textContent = `Loaded ${png.name}${json ? ' + ' + json.name : ' with the current anims.json'}`;
  show({ canvas: cv, meta });
};

// ------------------------------------------------------------------ AI art importer
function loadImage(file) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}

function toCanvas(img) {
  const c = document.createElement('canvas');
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  return c;
}

// Flood-fill the background away from the image border, plus any leftover pixels
// close to the background color (magenta never appears in characters).
function removeBackground(cv, tol) {
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const { width: w, height: h } = cv;
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const corners = [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]].map(([x, y]) => {
    const i = (y * w + x) * 4;
    return [d[i], d[i + 1], d[i + 2]];
  });
  const bg = corners[0];
  const near = (i, c) => Math.hypot(d[i] - c[0], d[i + 1] - c[1], d[i + 2] - c[2]) <= tol;
  const seen = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const p = stack.pop();
    if (seen[p]) continue;
    seen[p] = 1;
    const i = p * 4;
    if (d[i + 3] === 0 || corners.some((c) => near(i, c))) {
      d[i + 3] = 0;
      const x = p % w, y = (p / w) | 0;
      if (x > 0) stack.push(p - 1);
      if (x < w - 1) stack.push(p + 1);
      if (y > 0) stack.push(p - w);
      if (y < h - 1) stack.push(p + w);
    }
  }
  const magentaish = bg[0] > 180 && bg[2] > 180 && bg[1] < 90;
  if (magentaish) for (let i = 0; i < d.length; i += 4) if (near(i, bg)) d[i + 3] = 0;
  ctx.putImageData(img, 0, 0);
}

function alphaMap(cv) {
  const d = cv.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, cv.width, cv.height).data;
  const a = new Uint8Array(cv.width * cv.height);
  for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3] > 40 ? 1 : 0;
  return a;
}

// Split a strip into frames by empty columns (auto) or into N equal slices.
function splitFrames(cv, n) {
  const { width: w, height: h } = cv;
  let ranges = [];
  if (n > 0) {
    for (let k = 0; k < n; k++) ranges.push([Math.round((k * w) / n), Math.round(((k + 1) * w) / n)]);
  } else {
    const a = alphaMap(cv);
    const occ = new Array(w).fill(false);
    for (let x = 0; x < w; x++) for (let y = 0; y < h; y++) if (a[y * w + x]) { occ[x] = true; break; }
    const minGap = Math.max(2, Math.round(w * 0.006));
    let start = -1, gap = 0;
    for (let x = 0; x <= w; x++) {
      if (x < w && occ[x]) {
        if (start < 0) start = x;
        gap = 0;
      } else if (start >= 0) {
        gap++;
        if (gap >= minGap || x === w) {
          ranges.push([start, x - gap + 1]);
          start = -1;
          gap = 0;
        }
      }
    }
    // drop specks
    const maxW = Math.max(...ranges.map(([a0, b0]) => b0 - a0), 1);
    ranges = ranges.filter(([a0, b0]) => b0 - a0 > maxW * 0.12);
  }
  return ranges.map(([x0, x1]) => {
    const c = document.createElement('canvas');
    c.width = Math.max(1, x1 - x0);
    c.height = h;
    c.getContext('2d').drawImage(cv, x0, 0, x1 - x0, h, 0, 0, x1 - x0, h);
    return c;
  });
}

function trim(cv) {
  const a = alphaMap(cv);
  const { width: w, height: h } = cv;
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (a[y * w + x]) {
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  if (x1 < 0) return null;
  const c = document.createElement('canvas');
  c.width = x1 - x0 + 1;
  c.height = y1 - y0 + 1;
  c.getContext('2d').drawImage(cv, x0, y0, c.width, c.height, 0, 0, c.width, c.height);
  return c;
}

// Downscale by picking the most common color in each source block, which keeps
// the original palette instead of blurring it.
function pixelDownscale(cv, s) {
  const w = Math.max(1, Math.round(cv.width * s)), h = Math.max(1, Math.round(cv.height * s));
  const src = cv.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, cv.width, cv.height).data;
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const octx = out.getContext('2d');
  const img = octx.createImageData(w, h);
  const d = img.data;
  const bw = cv.width / w, bh = cv.height / h;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const sx0 = Math.floor(x * bw), sx1 = Math.max(sx0 + 1, Math.floor((x + 1) * bw));
      const sy0 = Math.floor(y * bh), sy1 = Math.max(sy0 + 1, Math.floor((y + 1) * bh));
      const counts = new Map();
      let opaque = 0, total = 0;
      for (let yy = sy0; yy < sy1; yy++) for (let xx = sx0; xx < sx1; xx++) {
        const i = (yy * cv.width + xx) * 4;
        total++;
        if (src[i + 3] < 128) continue;
        opaque++;
        const key = ((src[i] >> 3) << 10) | ((src[i + 1] >> 3) << 5) | (src[i + 2] >> 3);
        const e = counts.get(key) || { n: 0, r: 0, g: 0, b: 0 };
        e.n++; e.r += src[i]; e.g += src[i + 1]; e.b += src[i + 2];
        counts.set(key, e);
      }
      if (opaque * 2 < total) continue;
      let best = null;
      for (const e of counts.values()) if (!best || e.n > best.n) best = e;
      const o = (y * w + x) * 4;
      d[o] = best.r / best.n; d[o + 1] = best.g / best.n; d[o + 2] = best.b / best.n; d[o + 3] = 255;
    }
  }
  octx.putImageData(img, 0, 0);
  return out;
}

// Horizontal anchor = average x of the lowest rows (the feet), so kicks and
// punches don't shove the body off the pivot.
function footAnchor(cv) {
  const a = alphaMap(cv);
  const { width: w, height: h } = cv;
  const y0 = Math.floor(h * 0.8);
  let sx = 0, n = 0;
  for (let y = y0; y < h; y++) for (let x = 0; x < w; x++) if (a[y * w + x]) { sx += x; n++; }
  return n ? sx / n : w / 2;
}

function measureHeight(name) {
  if (!current) return 46;
  const { canvas, meta } = current;
  const a = meta.animations[name];
  if (!a) return 46;
  const cols = meta.columns || Math.floor(canvas.width / meta.frameWidth);
  let maxH = 0;
  for (const f of a.frames) {
    const c = document.createElement('canvas');
    c.width = meta.frameWidth; c.height = meta.frameHeight;
    c.getContext('2d').drawImage(canvas, (f % cols) * meta.frameWidth, Math.floor(f / cols) * meta.frameHeight, meta.frameWidth, meta.frameHeight, 0, 0, meta.frameWidth, meta.frameHeight);
    const t = trim(c);
    if (t) maxH = Math.max(maxH, t.height);
  }
  return maxH;
}

async function importFiles(files) {
  const imgs = await Promise.all([...files].filter((f) => f.type.startsWith('image/')).map(loadImage));
  if (!imgs.length) return;
  const tol = +$('impTol').value;
  const nFrames = +$('impFrames').value;
  let raw = [];
  for (const img of imgs) {
    const cv = toCanvas(img);
    if ($('impBg').value === 'auto') removeBackground(cv, tol);
    const parts = imgs.length === 1 ? splitFrames(cv, nFrames) : splitFrames(cv, nFrames || 0);
    raw.push(...parts);
  }
  raw = raw.map(trim).filter(Boolean);
  if (!raw.length) { impInfo.innerHTML = '<span class="warn">No sprite pixels found — try a higher tolerance or "already transparent".</span>'; return; }
  pending = { raw };
  renderPending();
}

function renderPending() {
  if (!pending || !current) return;
  const { meta } = current;
  const targetH = +$('impHeight').value;
  const maxH = Math.max(...pending.raw.map((c) => c.height));
  const s = targetH / maxH;
  const fw = meta.frameWidth, fh = meta.frameHeight, [px, py] = meta.pivot;
  let clipped = false;
  pending.frames = pending.raw.map((src) => {
    const small = pixelDownscale(src, s);
    const ax = footAnchor(small);
    const c = document.createElement('canvas');
    c.width = fw; c.height = fh;
    const dx = Math.round(px - ax), dy = py + 1 - small.height;
    if (dx < 0 || dy < 0 || dx + small.width > fw) clipped = true;
    c.getContext('2d').drawImage(small, dx, dy);
    return c;
  });
  impPreview.innerHTML = '';
  for (const f of pending.frames) {
    const c = f.cloneNode();
    c.getContext('2d').drawImage(f, 0, 0);
    impPreview.append(c);
  }
  const want = ANIM_GUIDE[selected]?.frames;
  impInfo.innerHTML = `${pending.frames.length} frame(s) → <b>${selected}</b>` +
    (want && want !== pending.frames.length ? ` <span class="warn">(the guide suggests ${want}; timing adapts either way)</span>` : '') +
    (clipped ? ' <span class="warn">— some frames overflow the 64×64 cell; lower the body height</span>' : '');
  $('impApply').disabled = false;
}

['impHeight', 'impTol', 'impFrames', 'impBg'].forEach((id) => { $(id).onchange = () => pending && (id === 'impHeight' ? renderPending() : null); });

$('impApply').onclick = () => {
  if (!pending?.frames) return;
  const { canvas, meta } = current;
  const a = meta.animations[selected];
  const fw = meta.frameWidth, fh = meta.frameHeight;
  const cols = meta.columns || Math.floor(canvas.width / fw);
  const frames = pending.frames;
  let slots = a.frames.slice(0, frames.length);
  // need more cells? append rows to the sheet
  let total = Math.ceil(canvas.height / fh) * cols;
  let used = Math.max(-1, ...Object.values(meta.animations).flatMap((x) => x.frames)) + 1;
  let out = canvas;
  while (slots.length < frames.length) {
    if (used >= total) {
      const bigger = document.createElement('canvas');
      bigger.width = out.width;
      bigger.height = out.height + fh;
      bigger.getContext('2d').drawImage(out, 0, 0);
      out = bigger;
      total += cols;
    }
    slots.push(used++);
  }
  const ctx = out.getContext('2d');
  frames.forEach((f, k) => {
    const s = slots[k];
    const x = (s % cols) * fw, y = Math.floor(s / cols) * fh;
    ctx.clearRect(x, y, fw, fh);
    ctx.drawImage(f, x, y);
  });
  const avg = a.durations.reduce((p, c) => p + c, 0) / a.durations.length;
  const durations = frames.map((_, k) => (frames.length === a.frames.length ? a.durations[k] : Math.round(avg)));
  const next = { ...a, frames: slots, durations };
  if (a.phases && frames.length !== a.frames.length) {
    const n = frames.length, T = a.phases.reduce((p, c) => p + c, 0);
    const s0 = Math.max(1, Math.round((n * a.phases[0]) / T));
    const s1 = Math.max(1, Math.min(n - s0, Math.round((n * a.phases[1]) / T)));
    next.phases = [s0, s1, Math.max(0, n - s0 - s1)];
  }
  meta.animations[selected] = next;
  status.textContent = `Applied ${frames.length} frame(s) to ${selected}. Download sheet.png + anims.json when done.`;
  pending = null;
  impPreview.innerHTML = '';
  impInfo.textContent = '';
  $('impApply').disabled = true;
  show({ canvas: out, meta });
};

const drop = $('drop');
drop.ondragover = (e) => { e.preventDefault(); drop.classList.add('over'); };
drop.ondragleave = () => drop.classList.remove('over');
drop.ondrop = (e) => { e.preventDefault(); drop.classList.remove('over'); importFiles(e.dataTransfer.files); };
$('impFiles').onchange = (e) => importFiles(e.target.files);

const qs = new URLSearchParams(location.search);
if (qs.get('c')) who.value = qs.get('c');
bake();

// Debug helper: show specific sheet frames large, e.g. bigView([0, 4, 10]) or bigView('light1').
window.bigView = (sel, z = 5) => {
  document.getElementById('ov')?.remove();
  if (!sel) return;
  const { canvas, meta } = current;
  const frames = typeof sel === 'string' ? sel.split(',').flatMap((n) => meta.animations[n].frames) : sel;
  const ov = document.createElement('div');
  ov.id = 'ov';
  Object.assign(ov.style, { position: 'fixed', inset: '0', background: '#c9b9a4', zIndex: 99, display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start' });
  const cols = meta.columns;
  const fw = meta.frameWidth, fh = meta.frameHeight;
  for (const f of frames) {
    const c = document.createElement('canvas');
    c.width = fw; c.height = fh;
    Object.assign(c.style, { width: fw * z + 'px', height: fh * z + 'px', imageRendering: 'pixelated' });
    c.getContext('2d').drawImage(canvas, (f % cols) * fw, Math.floor(f / cols) * fh, fw, fh, 0, 0, fw, fh);
    ov.append(c);
  }
  ov.onclick = () => ov.remove();
  document.body.append(ov);
};
window.selectChar = (id) => { who.value = id; bake(); };
window.importFiles = importFiles;
