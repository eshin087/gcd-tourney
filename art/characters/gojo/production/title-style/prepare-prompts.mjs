import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const text=fs.readFileSync('art/characters/gojo/PROMPTS.md','utf8');
const history=execFileSync('git',['log','--all','--name-only','--format=','--','art/characters/gojo/raw'],{encoding:'utf8'});
const floor={};for(const m of history.matchAll(/\/(\w+)_v(\d+)/g))floor[m[1]]=Math.max(floor[m[1]]||0,+m[2]);
const out=[];
for(const m of text.matchAll(/```text\r?\n([\s\S]*?)```/g)){
 const block=m[1];const a=block.match(/ANIMATION: "(\w+)"/);if(!a)continue;
 const motion=block.slice(block.indexOf('ANIMATION:'),block.indexOf('LAYOUT:'));
 const layout=block.match(/LAYOUT:.*$/m)?.[0]||'';
 const view=block.match(/VIEW:.*$/m)?.[0]||'';
 out.push({asset:a[1],v:(floor[a[1]]||0)+1,part:block.includes('PART B of')?'B':block.includes('PART A of')?'A':null,prompt:'Anime fan-art sprite. Match the attached USER APPROVED title-style reference exactly for identity, head, torso, limb lengths, costume volume, colors and style. White spiky hair, black blindfold, lean tall adult in navy zipped highcollar jacket/trousers, black shoes. SCALE LOCK: neutral occupied91x236px in256cell at128ppu. Preserve that anatomy through all poses, do not enlarge head or shoulders or stretch legs. No generic head ratio.\n'+motion+'\n'+layout+'\n'+view+'\nSTYLE: clean hard-edged anime pixel art, restrained celshading matching approved reference; no gradients, texture, blur or glow. Background flat #FF00FF, no shadows/text/effects. Complete separated figures, same anatomical scale everyframe.'});
}
fs.writeFileSync('art/characters/gojo/production/title-style/prompts.json',JSON.stringify(out,null,2));
console.log(out.map(x=>x.asset+(x.part||'')+'v'+x.v).join(' '));
