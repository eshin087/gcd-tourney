import fs from 'node:fs';
const p='art/manifest.json';let s=fs.readFileSync(p,'utf8'),start=s.indexOf('    "sasuke": {'),end=s.indexOf('    "killua": {',start),chunk=s.slice(start,end);
const obj=JSON.parse('{'+chunk.trim().replace(/,$/,'')+'}').sasuke;
const inv=JSON.parse(fs.readFileSync('art/characters/sasuke/reference/neutral-redraw-inventory.json')).rows;
for(const r of inv){const versions=fs.readdirSync('art/characters/sasuke/raw').filter(f=>new RegExp('^'+r.animation+'_v\\d+\\.png$').test(f)).map(f=>+f.match(/_v(\d+)/)[1]);obj.animations[r.animation].version=Math.max(...versions);}
obj.standingBodyPx=194.88200736831624;
const evidence='See reference/neutral-probe-exceptions.md and public/art-review/sasuke-neutral-redraw/ masks. Technical misread only; anatomy/pose review still pending.';
Object.assign(obj.animations.jumpUp,{scaleExempt:'v02 raised-wrist probe box [155,57,178,83] misses actual head near [97,62,135,97]. '+evidence,scaleExemptVersion:2});
Object.assign(obj.animations.beamCharge,{scaleExempt:'v02 raised forearm box [146,26,157,52] misses head near [94,45,140,81]. '+evidence,scaleExemptVersion:2});
Object.assign(obj.animations.airHeavy,{scaleExemptFrames:{'1':'v03 probe selects overhead forearm [87,95,105,113], not skull. '+evidence,'4':'v03 probe [105,60,122,80] selects forearm above head. '+evidence},scaleExemptVersion:3});
Object.assign(obj.animations.block,{scaleExemptFrames:{'1':'v02 crossed forearms join hair: box [105,79,152,125] extends below actual hair. '+evidence},scaleExemptVersion:2});
const replacement='    "sasuke": '+JSON.stringify(obj,null,2).split('\n').map((l,i)=>i? '    '+l:l).join('\n')+',\n';
fs.writeFileSync(p,s.slice(0,start)+replacement+s.slice(end));
const q='art/characters/sasuke/raw/superDash_v03.json',a=JSON.parse(fs.readFileSync(q));a.frameOffsets=[[0,0],[-9,0]];a.placementNote='Main pack f1 right5px clipping; measured x=-9 adds4px safe margin without changing anatomy.';fs.writeFileSync(q,JSON.stringify(a,null,2));

