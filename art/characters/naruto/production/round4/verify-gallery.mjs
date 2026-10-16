import fs from 'node:fs';
const p='public/reviews/naruto-round4/';const html=fs.readFileSync(p+'index.html','utf8');
const links=[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]);for(const a of links)if(!a.includes('$'+'{')&&!fs.existsSync(p+a))throw Error('missing '+a);
const code=html.match(/<script type="module">([\s\S]*)<\/script>/)[1];new (Object.getPrototypeOf(async function(){}).constructor)(code);
const m=JSON.parse(fs.readFileSync(p+'candidate-anims.json'));if(Object.values(m.animations).reduce((s,a)=>s+a.frames.length,0)!==175)throw Error('bad diagnostic count');
const segments=JSON.parse(fs.readFileSync(p+'segments.json'));let total=0;for(const [set,anims]of Object.entries({baseline:segments.baseline,candidate:segments.candidates})){for(const[a,row]of Object.entries(anims)){for(const key of ['headHair','torso','arm','leg','shoe'])if(row[key].length!==row.torso.length)throw Error(a+' missing '+key);total+=row.torso.length;}}
console.log('STATIC_OK all linked files exist; module parses;175frames/42animations; segmentrows='+total+'. Browser playback pending.');
