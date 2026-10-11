import fs from 'node:fs';
const text=fs.readFileSync('art/characters/naruto/ANIMATIONS.md','utf8');
const names=JSON.parse(fs.readFileSync('art/characters/naruto/REDRAW_INVENTORY.json')).rows;
const result={};
for(const row of names){const start=text.indexOf('### `'+row.name+'`');const end=text.indexOf('\n### ',start+1);const section=text.slice(start,end<0?undefined:end);result[row.name]={...row,section};}
fs.writeFileSync('art/characters/naruto/PRODUCTION_POSES.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result));
