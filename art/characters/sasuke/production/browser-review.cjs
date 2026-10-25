const fs=require('node:fs');
const {chromium}=require('playwright');
(async()=>{
 const base=process.argv[2]||'http://127.0.0.1:5223',batch=process.argv[3]||'heavy-charge';
 const browser=await chromium.launch({headless:true,timeout:30000});
 const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[],logs=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{logs.push(m.text());if(m.type()==='error')errors.push(m.text())});
 try{
 const response=await page.goto(`${base}/art-review/sasuke-${batch}/`,{timeout:45000});
 await page.waitForFunction(()=>document.querySelector('#status')?.textContent==='Packed candidate atlas loaded');
 const images=await page.locator('img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0));
 await page.locator('input').first().fill('2');
 const frame=await page.locator('output').first().textContent();
 await page.screenshot({path:`art/characters/sasuke/production/${batch}-phone.png`,fullPage:true});
 await page.goto(`${base}/?fight=sasuke,sasuke&mode=solo&art=custom&debug`,{timeout:45000});
 await page.waitForFunction(()=>window.game?.fighters?.length===2&&window.freezeCpu,null,{timeout:45000});
 const state=await page.evaluate(()=>{freezeCpu();game.skipIntro();step(110);snap();return{state:game.state,animation:game.fighters[0].actor.animName};});
 await page.screenshot({path:`art/characters/sasuke/production/${batch}-game.png`});
 const result={http:response.status(),images,frame,state,errors,logs,base};
 fs.writeFileSync(`art/characters/sasuke/production/${batch}-browser-result.json`,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 if(errors.length||!images||frame!=='2'||!logs.some(s=>s.includes('using custom sheet for sasuke')))process.exitCode=1;
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
