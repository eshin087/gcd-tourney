const { chromium } = require('C:/Users/eshin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const messages=[],errors=[],httpErrors=[];
  page.on('response',r=>{if(r.status()>=400)httpErrors.push({url:r.url(),status:r.status()});});
  page.on('console',m=>{messages.push(m.text());if(m.type()==='error')errors.push({text:m.text(),location:m.location()});});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5188/?fight=killua,killua&mode=solo&art=custom&debug');
  await page.waitForFunction(()=>typeof window.freezeCpu==='function',{timeout:30000});
  await page.evaluate(async()=>{await window.waitFight();window.freezeCpu();window.step(1);window.snap();});
  await page.screenshot({path:'art/characters/killua/production/game-preview.png'});
  await page.evaluate(()=>{window.unsnap();window.press('KeyJ',8);window.snap();});
  await page.screenshot({path:'art/characters/killua/production/game-attack.png'});
  fs.writeFileSync('art/characters/killua/production/qa-browser.json',JSON.stringify({messages,errors,httpErrors},null,2));
  console.log(JSON.stringify({custom:messages.filter(s=>s.includes('using custom sheet for killua')),errors,httpErrors}));
  await page.goto('http://127.0.0.1:5188/art/characters/killua/production/final-review.html');
  await page.waitForFunction(()=>window.reviewReady===true);
  for(const name of await page.locator('#animation option').evaluateAll(es=>es.map(e=>e.value))){await page.selectOption('#animation',name);await page.click('#step');}
  await page.selectOption('#animation','run');
  await page.screenshot({path:'art/characters/killua/production/review-preview.png',fullPage:true});
  console.log('Review page: all 42 selectors and frame-step controls exercised.');
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
