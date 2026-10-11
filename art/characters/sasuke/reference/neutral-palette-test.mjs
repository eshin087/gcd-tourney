import fs from 'node:fs';
const p='art/scale/builds.json';let s=fs.readFileSync(p,'utf8');fs.writeFileSync('art/characters/sasuke/reference/neutral-builds-before-palette.json',s);
const old=JSON.parse(s).fighters.sasuke.headColors;
const added=['#20315b','#292b53','#294686','#293b6c'];
const list=[...new Set([...old,...added])];
s=s.replace(JSON.stringify(old).replaceAll(',',', '),'X'); // formatting-independent replacement below
s=fs.readFileSync(p,'utf8').replace(/("sasuke"[^\n]*"headColors": )\[[^\]]+\]/,(_,a)=>a+JSON.stringify(list));
fs.writeFileSync(p,s);
console.log(list);

