const fs = require('node:fs');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');

(async () => {
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5189', '--strictPort'], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { server.kill(); reject(new Error('Preview server did not start')); }, 15000);
    server.stdout.on('data', d => { if (d.toString().includes('http://127.0.0.1:5189')) { clearTimeout(timer); resolve(); } });
    server.on('error', e => { clearTimeout(timer); reject(e); });
    server.on('exit', code => { clearTimeout(timer); reject(new Error(`Preview server exited ${code}`)); });
  });
  const browser = await chromium.launch({ headless: true, timeout: 30000 });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const logs = [], errors = [];
    page.on('console', m => { logs.push(m.text()); if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    const response = await page.goto('http://127.0.0.1:5189/?fight=gojo,gojo&mode=solo&art=custom&debug');
    await page.waitForFunction(() => window.game?.fighters?.length === 2 && window.freezeCpu, null, { timeout: 30000 });
    const state = await page.evaluate(() => {
      freezeCpu(); game.skipIntro(); step(110); game.hud.clearAnnounce();
      const f = game.fighters[0];
      return { gameState: game.state, animation: f.actor.animName, x: f.pos.x };
    });
    await page.evaluate(() => snap());
    await page.screenshot({ path: 'art/characters/gojo/reference/qa/game-idle.png' });
    const movement = await page.evaluate(() => { unsnap(); hold('KeyD'); step(20); release('KeyD'); snap(); const f = game.fighters[0]; return { animation: f.actor.animName, frame: f.actor.fi, x: f.pos.x }; });
    await page.screenshot({ path: 'art/characters/gojo/reference/qa/game-run.png' });
    await page.goto('http://127.0.0.1:5189/art/characters/gojo/reference/batch_review_v02.html');
    await page.waitForFunction(() => document.getElementById('status').textContent.startsWith('Packed atlas loaded'));
    const referenceImagesLoaded = await page.locator('img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0));
    await page.locator('#run-scrub').fill('3');
    await page.waitForFunction(() => document.getElementById('run-frame').textContent === '4');
    const preview = { referenceImagesLoaded, frameScrub: await page.locator('#run-frame').textContent(), paused: await page.locator('[data-name="run"]').textContent() };
    const result = { http: response.status(), state, movement, preview, logs, errors };
    fs.writeFileSync('art/characters/gojo/reference/qa/browser-result.json', JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result));
    if (errors.length || !referenceImagesLoaded || preview.paused !== 'Play' || state.gameState !== 'fight' || movement.animation !== 'run' || movement.x === state.x || !logs.some(s => s.includes('using custom sheet for gojo'))) process.exitCode = 1;
  } finally { await browser.close(); server.kill(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
