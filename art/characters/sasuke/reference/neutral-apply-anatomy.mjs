import fs from 'node:fs';
const root='art/characters/sasuke/raw/',m=JSON.parse(fs.readFileSync('art/characters/sasuke/reference/neutral-anatomy-landmarks.json'));
for(const [name,v] of Object.entries(m)){
const f=fs.readdirSync(root).filter(x=>new RegExp('^'+name+'_v\\d+\\.png$').test(x)).sort((a,b)=>+a.match(/_v(\d+)/)[1]-+b.match(/_v(\d+)/)[1]).at(-1);
const j=root+f.replace('.png','.json'),side=fs.existsSync(j)?JSON.parse(fs.readFileSync(j)):{};
let heads=v.heads;
if(!heads){const s=side.stitch;heads=[...Array(s.poses[0]).fill(v.a*(s.scaledPart==='A'?s.scaledBy:1)),...Array(s.poses[1]).fill(v.b*(s.scaledPart==='B'?s.scaledBy:1))];}
side.anatomy={measurement:'skull-to-chin',targetHeadPx:24.48673197462748,sourceHeadPx:heads,note:v.note+' Manual inferred landmarks, not auto approval. Neutral target uncertainty about +/-2.84gamepx.'};
fs.writeFileSync(j,JSON.stringify(side,null,2)+'\n');
}

