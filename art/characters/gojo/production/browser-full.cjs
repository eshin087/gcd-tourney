const fs = require('node:fs');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');
const base = 'art/characters/gojo/production/';
(async () => {
  const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5189', '--strictPort'], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  let browser;
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(Error('Server timeout')), 15000);
      server.stdout.on('data', d => { if (d.toString().includes('127.0.0.1:5189')) { clearTimeout(timer); resolve(); } });
      server.on('error', reject);
      server.on('exit', code => { clearTimeout(timer); reject(Error('Server exit ' + code)); });
    });
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [], logs = [], result = { errors, logs };
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); else logs.push(m.text()); });
    await page.goto('http://127.0.0.1:5189/?fight=gojo,gojo&mode=solo&debug');
    await page.waitForFunction(() => window.game?.fighters?.length === 2 && window.freezeCpu);
    result.load = await page.evaluate(() => {
      freezeCpu(); game.skipIntro(); step(110); game.hud.clearAnnounce();
      return game.fighters.map(f => ({ source: f.asset.source, complete: f.asset.meta.complete, animations: Object.keys(f.asset.meta.animations).length, portrait: !!f.asset.portrait, cutin: !!f.asset.cutin }));
    });
    await page.evaluate(() => snap());
    await page.screenshot({ path: base + 'game-idle.png' });
    result.movement = await page.evaluate(() => { unsnap(); const x=game.fighters[0].pos.x; hold('KeyD'); step(20); release('KeyD'); snap(); return { moved: game.fighters[0].pos.x !== x, animation: game.fighters[0].actor.animName }; });
    await page.screenshot({ path: base + 'game-run.png' });
    result.combat = await page.evaluate(async () => {
      unsnap(); const { MOVES } = await import('/src/game/moves.js');
      const f=game.fighters[0],o=game.fighters[1],R=game.cam.right;
      const rows=[];
      for(const name of ['light1','light2','light3','light4','heavy','airLight1','airLight2','airLight3','airHeavy']) {
        f.reset(-R.x*.5,-R.z*.5);o.reset(R.x*.5,R.z*.5); game.state='fight'; game.hitstop=0;
        if(name.startsWith('air')){f.pos.y=o.pos.y=1.5;f.prev.copy(f.pos);o.prev.copy(o.pos);f.air=o.air=true;f.setState('air','jumpUp');o.setState('air','jumpUp');}
        const hp=o.hp;f.startMove(name,MOVES[name]);const seen=new Set();
        for(let i=0;i<85;i++){step(1);seen.add(f.actor.animName);}
        rows.push({name,damage:hp-o.hp,animationSeen:seen.has(name)});
      }
      return rows;
    });
    result.blink = await page.evaluate(() => {
      const f=game.fighters[0],o=game.fighters[1]; f.reset(-1,0);o.reset(1,0);game.state='fight';game.hitstop=0;
      f.spMx=0;f.spMy=1;f.doSpecial();const frames=[];
      for(let i=0;i<80;i++){frames.push({t:f.t,anim:f.actor.animName,frame:f.actor.fi,hidden:f.hidden,y:f.pos.y});step(1);}
      return {frames, startup:[0,1].every(n=>frames.some(r=>r.anim==='specialUp'&&r.frame===n&&!r.hidden)), hidden:frames.some(r=>r.hidden), recovery:[4,5].every(n=>frames.some(r=>r.anim==='specialUp'&&r.frame===n&&!r.hidden&&r.y>2)), finished:f.state!=='kit'&&!f.hidden};
    });
    result.specials = await page.evaluate(async () => {
      const kit=await import('/src/game/kit.js');const f=game.fighters[0],o=game.fighters[1],R=game.cam.right,rows=[];
      for(const [name,mx,my]of [['Blue',0,0],['Red',1,0],['Infinity',0,-1],['Blink',0,1],['Domain',0,0],['Purple',0,0]]){
        f.reset(-R.x,-R.z);o.reset(R.x,R.z);f.ki=1000;o.ki=0;game.state='fight';game.hitstop=0;
        f.pad.setMove(mx,my);f.spMx=mx;f.spMy=my;
        if(name==='Domain')kit.startSuper(f);else if(name==='Purple')f.startUltimate();else f.doSpecial();
        const seen=new Set([f.actor.animName]);for(let i=0;i<200;i++){step(1);seen.add(f.actor.animName);}
        rows.push({name,animations:[...seen],damage:1000-o.hp,hidden:f.hidden});
      }
      f.reset(-R.x,-R.z);o.reset(R.x,R.z);game.state='fight';f.actor.play('superPose',true);snap();return rows;
    });
    await page.screenshot({ path: base + 'game-domain-pose.png' });
    await page.goto('http://127.0.0.1:5189/art/characters/gojo/reference/batch_review_v03.html');
    await page.waitForFunction(() => document.getElementById('status').textContent.startsWith('Atlas loaded'));
    result.gallery = { cards: await page.locator('.card').count(), imagesLoaded: await page.locator('img').evaluateAll(a=>a.every(i=>i.complete&&i.naturalWidth>0)) };
    await page.locator('[data-scrub="light4"]').fill('4');
    await page.waitForFunction(()=>document.getElementById('frame-light4').textContent==='5');
    result.gallery.scrubPaused = await page.locator('[data-play="light4"]').textContent()==='Play';
    await page.locator('#filter').fill('special');
    result.gallery.filtered = await page.locator('.card:visible').count();
    await page.screenshot({ path: base + 'gallery-desktop.png' });
    await page.setViewportSize({width:390,height:844});await page.locator('#filter').fill('');
    result.gallery.mobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    await page.screenshot({path:base+'gallery-mobile.png'});
    fs.writeFileSync(base+'browser-result.json',JSON.stringify(result,null,2));
    console.log(JSON.stringify(result));
    if(errors.length||!result.blink.startup||!result.blink.hidden||!result.blink.recovery||!result.blink.finished||result.load.some(f=>f.source!=='custom'||!f.complete||f.animations!==42||!f.portrait||!f.cutin)||!result.movement.moved||result.combat.some(r=>!r.animationSeen||r.damage<=0)||!result.gallery.imagesLoaded||!result.gallery.scrubPaused||result.gallery.cards!==42||result.gallery.mobileOverflow)process.exitCode=1;
  } finally { if(browser)await browser.close();server.kill(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
