const { chromium } = require('C:/Users/eshin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({headless:true,channel:'msedge'});
  try {
    const page = await browser.newPage({viewport:{width:1280,height:850}}), errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:5202/art/scale/review.html');
    await page.waitForFunction(()=>document.querySelectorAll('canvas').length===4 && document.querySelectorAll('#move option').length===42);
    await page.click('#play'); await page.uncheck('#alternate');
    for(const name of ['idle','run','light1','light2','light3','light4','heavy','guard','beamCharge']) {
      await page.selectOption('#move',name);
      await page.screenshot({path:`art/scale/browser-${name}.png`});
    }
    const names=await page.locator('#move option').evaluateAll(es=>es.map(e=>e.value));
    for(const name of names){await page.selectOption('#move',name);await page.click('#step');}
    await page.selectOption('#move','idle');
    await page.setViewportSize({width:390,height:844});
    await page.screenshot({path:'art/scale/browser-mobile.png',fullPage:true});
    const mobile=await page.evaluate(()=>({width:innerWidth,documentWidth:document.documentElement.scrollWidth,canvases:document.querySelectorAll('canvas').length}));
    const result={at:new Date().toISOString(),page:'local candidate comparison',animationsExercised:names.length,errors,mobile,scope:'Comparison UI smoke only; does not certify anatomy or final gameplay.'};
    fs.writeFileSync('art/scale/browser-qa.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
    if(errors.length || mobile.documentWidth>mobile.width)throw Error('Scale comparison browser QA failed');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1);});
