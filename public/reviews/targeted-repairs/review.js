const ROOT = new URL('./', location.href);
const imageCache = new Map();
const q = (selector, root = document) => root.querySelector(selector);
const byId = (id) => document.getElementById(id);
const url = (path) => new URL(path, ROOT).href;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function loadImage(path) {
  const src = url(path);
  if (!imageCache.has(src)) imageCache.set(src, new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${path}`));
    image.src = src;
  }));
  return imageCache.get(src);
}

function drawStripFrame(canvas, image, position) {
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, 256, 256);
  ctx.drawImage(image, position * 256, 0, 256, 256, 0, 0, 256, 256);
}

function drawReference(canvas, image) {
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, 256, 256);
  ctx.drawImage(image, 0, 0, 256, 256);
}

function makeView(label) {
  const view = el('div', 'view');
  view.append(el('p', 'view-label', label));
  const canvas = el('canvas', 'cell');
  canvas.width = 256;
  canvas.height = 256;
  view.append(canvas);
  return { view, canvas, label: q('.view-label', view) };
}

function makeButton(action, label, primary = false) {
  const button = el('button', `button${primary ? ' primary' : ''}`, label);
  button.type = 'button';
  button.dataset.action = action;
  button.disabled = true;
  return button;
}

function wirePlayback(card, item, candidateView, candidateImage, baseView, baseImage) {
  const frames = item.sourceFrames;
  let position = 0;
  let playing = false;
  let timer = 0;
  const state = q('.frame-state', card);
  const playButton = q('[data-action="play"]', card);
  const controls = card.querySelectorAll('.controls button');
  for (const button of controls) button.disabled = false;

  function update() {
    drawStripFrame(candidateView.canvas, candidateImage, position);
    state.textContent = `Frame ${position + 1} of ${frames.length} · ${item.durations[position]} ms · ${item.loop ? 'loops in source metadata' : 'one-shot; replay to start again'}`;
    if (baseView) {
      const basePosition = frames.length <= 1 ? 0 : Math.round(position * (item.baseSourceFrames.length - 1) / (frames.length - 1));
      drawStripFrame(baseView.canvas, baseImage, basePosition);
      baseView.label.textContent = `Packed base ${item.baseAnimation} · frame ${basePosition + 1} of ${item.baseSourceFrames.length}`;
    }
  }

  function stop() {
    playing = false;
    window.clearTimeout(timer);
    playButton.textContent = item.loop ? 'Play' : 'Replay';
    playButton.setAttribute('aria-label', item.loop ? 'Play animation' : 'Replay one-shot animation');
  }

  function schedule() {
    if (!playing) return;
    timer = window.setTimeout(() => {
      if (position === frames.length - 1) {
        if (item.loop) position = 0;
        else { stop(); update(); return; }
      } else position += 1;
      update();
      schedule();
    }, item.durations[position]);
  }

  function start(restart = false) {
    window.clearTimeout(timer);
    if (restart || (!item.loop && position === frames.length - 1)) position = 0;
    playing = true;
    playButton.textContent = 'Pause';
    playButton.setAttribute('aria-label', 'Pause animation');
    update();
    schedule();
  }

  q('[data-action="play"]', card).addEventListener('click', () => playing ? stop() : start(!item.loop && position === frames.length - 1));
  q('[data-action="previous"]', card).addEventListener('click', () => { stop(); position = (position - 1 + frames.length) % frames.length; update(); });
  q('[data-action="next"]', card).addEventListener('click', () => { stop(); position = (position + 1) % frames.length; update(); });
  update();
  return { start, stop, get playing() { return playing; } };
}

const visibility = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const card = entry.target;
    card._visible = entry.isIntersecting;
    if (entry.isIntersecting && !card._loaded) card._prepare();
    else if (!entry.isIntersecting && card._playback?.playing) card._playback.stop();
    if (entry.isIntersecting && card._playback && !card._playback.playing) card._playback.start(false);
  }
}, { threshold: 0.45 });

function makeCard(group, item) {
  const card = el('article', 'card');
  card.id = `${group.id}-${item.animation}`;
  const head = el('div', 'card-head');
  const title = el('div', 'title-line');
  title.append(el('h3', '', `${item.animation} · v${String(item.version).padStart(2, '0')}`));
  title.append(el('span', 'version', `${item.frames} frames`));
  head.append(title);
  const badges = el('div', 'title-line');
  badges.append(el('span', 'badge hold', item.verdict));
  if (item.visualApproved) badges.append(el('span', 'badge pass', 'VISUALLY APPROVED'));
  if (item.decision) badges.append(el('span', 'badge decision', 'YOUR CALL'));
  head.append(badges);
  card.append(head);
  card.append(el('p', 'summary', item.summary));
  if (item.residual) card.append(el('p', 'residual', item.residual));
  if (item.decision) card.append(el('p', 'user-call', 'Decision flagged in the handoff; give your direction in Codex chat.'));

  const row = el('div', 'compare');
  const candidateView = makeView(`${item.animation} candidate · native 256 px cell`);
  const idleView = makeView(`Approved idle v${String(group.approvedIdleVersion).padStart(2, '0')}`);
  const neutralView = makeView('Approved title neutral');
  const combatView = makeView('Approved title combat');
  row.append(candidateView.view, idleView.view, neutralView.view, combatView.view);
  let baseView = null;
  if (item.baseAnimation) {
    baseView = makeView(`Packed base ${item.baseAnimation}`);
    row.append(baseView.view);
  }
  card.append(row);

  const controls = el('div', 'controls');
  controls.append(makeButton('previous', 'Previous'), makeButton('play', 'Play', true), makeButton('next', 'Next'));
  card.append(controls);
  card.append(el('p', 'frame-state', 'Scroll this card into view to load its preview.'));
  card.append(el('p', 'hint', item.loop ? 'Playback follows the loop flag and frame durations in the packed metadata.' : 'This is a one-shot. It stops on its last frame; Replay starts it again.'));

  const evidence = el('details', 'evidence');
  evidence.append(el('summary', '', 'Source, verdict and atlas provenance'));
  const source = group.source;
  const details = [
    `Source branch: ${source.branch} · current source ${source.commit} · calibration basis ${source.calibrationCommit || source.commit}`,
    `Atlas sheet SHA-256: ${source.sheetHash}`,
    `Atlas metadata SHA-256: ${source.metadataHash}`,
    `Approved idle source ${group.idleSource.key}: ${group.idleSource.branch} @ ${group.idleSource.commit}; sheet SHA-256 ${group.idleSource.sheetHash}; metadata SHA-256 ${group.idleSource.metadataHash}; packed frame ${group.idleSource.frame}.`,
    `Approved title neutral SHA-256: ${group.neutralHash}; combat SHA-256: ${group.combatHash}.`,
    `Candidate: ${item.animation} v${String(item.version).padStart(2, '0')} · packed atlas cells ${item.sourceFrames.join(', ')}.`,
    item.auditNote,
  ].filter(Boolean);
  for (const line of details) evidence.append(el('p', '', line));
  for (const sourceFile of [
    { href: source.sheet, label: 'Open exact packed atlas sheet' },
    { href: source.metadata, label: 'Open exact packed animation metadata' },
    { href: group.idleSource.preview, label: 'Open approved idle comparator cell' },
    { href: group.neutral, label: 'Open approved title neutral cell' },
    { href: group.combat, label: 'Open approved title combat cell' },
  ]) {
    const p = el('p');
    const a = document.createElement('a');
    a.href = url(sourceFile.href);
    a.textContent = sourceFile.label;
    a.target = '_blank';
    a.rel = 'noopener';
    p.append(a);
    evidence.append(p);
  }
  for (const link of item.evidence || group.evidence || []) {
    const p = el('p');
    const a = document.createElement('a');
    a.href = url(link.href);
    a.textContent = link.label;
    a.target = '_blank';
    a.rel = 'noopener';
    p.append(a);
    evidence.append(p);
  }
  card.append(evidence);
  group._cards.append(card);

  card._prepare = async () => {
    if (card._loading || card._loaded) return;
    card._loading = true;
    try {
      const pending = [
        loadImage(item.preview), loadImage(group.idleSource.preview),
        loadImage(group.neutral), loadImage(group.combat),
      ];
      if (baseView) pending.push(loadImage(item.basePreview));
      const [candidateImage, idleImage, neutralImage, combatImage, baseImage] = await Promise.all(pending);
      if (candidateImage.naturalWidth !== item.frames * 256 || candidateImage.naturalHeight !== 256) throw new Error(`${item.animation} candidate crop dimensions do not match review data`);
      drawReference(idleView.canvas, idleImage);
      drawReference(neutralView.canvas, neutralImage);
      drawReference(combatView.canvas, combatImage);
      const playback = wirePlayback(card, item, candidateView, candidateImage, baseView, baseImage);
      card._playback = playback;
      card._loaded = true;
      if (card._visible) playback.start(false);
    } catch (error) {
      q('.frame-state', card).textContent = `Preview unavailable: ${error.message}`;
      console.error(error);
    } finally {
      card._loading = false;
    }
  };
  if (visibility) visibility.observe(card);
  else card._prepare();
}

async function main() {
  const response = await fetch(url('review-data.json'));
  if (!response.ok) throw new Error('Review data failed to load');
  const data = await response.json();
  byId('counts').textContent = `${data.total} strips · ${data.fighters} fighters · ${data.groups.length} sections · ${data.note}`;
  const nav = byId('nav');
  const groups = byId('groups');
  for (const group of data.groups) {
    group.source = data.sources[group.sourceKey];
    const anchor = document.createElement('a');
    anchor.href = `#${group.id}`;
    anchor.textContent = `${group.name} · ${group.items.length}`;
    nav.append(anchor);
    const section = el('section', 'group');
    section.id = group.id;
    const heading = el('div', 'group-head');
    heading.append(el('h2', '', group.name), el('span', 'group-count', `${group.items.length} review strips`));
    section.append(heading, el('p', 'muted group-note', group.note));
    if (group.referenceEvidence) {
      const note = el('p', 'muted group-note', group.referenceEvidence.note);
      const link = document.createElement('a');
      link.href = url(group.referenceEvidence.href);
      link.textContent = group.referenceEvidence.label;
      link.target = '_blank';
      link.rel = 'noopener';
      note.append(' ', link);
      section.append(note);
    }
    group._cards = section;
    for (const item of group.items) makeCard(group, item);
    groups.append(section);
  }
  const scrollToHash = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
  };
  window.addEventListener('hashchange', scrollToHash);
  scrollToHash();
}

main().catch((error) => {
  byId('counts').textContent = `Could not load review set: ${error.message}`;
  console.error(error);
});

byId('copy-draft').addEventListener('click', async () => {
  const value = byId('draft-text').value.trim();
  const status = byId('copy-status');
  if (!value) { status.textContent = 'Write a note first.'; return; }
  try {
    await navigator.clipboard.writeText(value);
    status.textContent = 'Copied. Paste it into the Codex chat to send your direction.';
  } catch {
    byId('draft-text').focus();
    byId('draft-text').select();
    status.textContent = 'Clipboard access is unavailable. The note is selected so you can copy it.';
  }
});
