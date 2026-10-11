import fs from 'node:fs';
const root='art/characters/sasuke/';
for(const [anim,v,a,b] of [['light1',5,77,101],['light2',4,97,107],['light3',4,81,108]]) {
  const p=root+'raw/'+anim+'_v'+String(v).padStart(2,'0')+'.json', j=JSON.parse(fs.readFileSync(p));
  const sa=j.stitch.scaledPart==='A'?j.stitch.scaledBy:1,sb=j.stitch.scaledPart==='B'?j.stitch.scaledBy:1;
  j.anatomy={measurement:'skull-to-chin',targetHeadPx:24.48673197462748,sourceHeadPx:[...Array(4).fill(a*sa),...Array(3).fill(b*sb)],note:`Source inferred skull A${a}, B${b} +/-12px; measured skull ratio used for stitch, not old public idle hair refinement. Longer torso/shins correction. Skull crown under hair remains uncertain; independent body review and technical holds apply. Not approved.`};
  fs.writeFileSync(p,JSON.stringify(j,null,2));
}
const p=root+'reference/neutral-attempts.json',j=JSON.parse(fs.readFileSync(p));
Object.assign(j.overrides,{light1B:3,light2A:2,light2B:2,light3A:2,light3B:2});fs.writeFileSync(p,JSON.stringify(j,null,2));
