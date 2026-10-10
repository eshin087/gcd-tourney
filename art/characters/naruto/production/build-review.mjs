import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
const base='art/characters/naruto/', prod=base+'production/', out='public/art-review/naruto/final/';
const read=p=>fs.readFileSync(p,'utf8');
const ledger=JSON.parse(read(prod+'progress.json'));
const meta=JSON.parse(read('public/characters/naruto/anims.json'));
const report=JSON.parse(read(prod+'qa-final.json'));
const atlas=PNG.sync.read(fs.readFileSync('public/characters/naruto/sheet.png'));
const colors=new Set(),alpha=new Set();
for(let i=0;i<atlas.data.length;i+=4){alpha.add(atlas.data[i+3]);if(atlas.data[i+3])colors.add(atlas.data.subarray(i,i+3).join(','));}
const count=Object.values(meta.animations).reduce((n,a)=>n+a.frames.length,0);
if(Object.keys(meta.animations).length!==42||count!==175||report.totalWarnings||colors.size>48||[...alpha].some(a=>a!==0&&a!==255))throw Error('Atlas validation failed');
const ui={};
for(const name of ['portrait','cutin','select']){
 const p=PNG.sync.read(fs.readFileSync(prod+'ui-preview/characters/naruto/'+name+'.png'));
 let nonOpaque=0;for(let k=3;k<p.data.length;k+=4)if(p.data[k]!==255)nonOpaque++;
 ui[name]={width:p.width,height:p.height,nonOpaque};
}
if(ui.cutin.nonOpaque)throw Error('Cut-in is not opaque');
const integrity={animations:42,frames:count,colors:colors.size,alpha:[...alpha],width:atlas.width,height:atlas.height,warnings:report.totalWarnings,ui};
fs.writeFileSync(prod+'qa-integrity.json',JSON.stringify(integrity,null,2)+'\n');
for(const e of Object.values(ledger)){
 e.status='packed';
 if(!e.notes.includes('Final technical QA'))e.notes+=' Final technical QA: exact frame count, no cell clipping, 48-color atlas. Visual caveats in QA.md; final approval pending.';
}
fs.writeFileSync(prod+'progress.json',JSON.stringify(ledger,null,2)+'\n');
const review={idle:{version:2,file:'raw/idle_v02.png',notes:'Previously approved short-hair idle.',approved:true},run:{version:3,file:'raw/run_v03.png',notes:'Previously approved short-hair run.',approved:true},...ledger};
fs.mkdirSync(out+'raw',{recursive:true});
const copy=(a,b)=>{fs.mkdirSync(path.dirname(b),{recursive:true});fs.copyFileSync(a,b);};
copy('public/characters/naruto/sheet.png',out+'sheet.png');
copy('public/characters/naruto/anims.json',out+'anims.json');
fs.writeFileSync(out+'progress.json',JSON.stringify(review,null,2)+'\n');
for(const e of Object.values(review))copy(base+e.file,out+e.file);
for(const name of ['portrait','cutin','select'])copy(prod+'ui-preview/characters/naruto/'+name+'.png',out+name+'.png');
for(const name of ['model_sheet','expressions'])copy(base+'reference/'+name+'.png',out+name+'.png');
for(const name of ['QA.md','game-preview.png','game-attack.png','qa-integrity.json'])if(fs.existsSync(prod+name))copy(prod+name,out+name);
let html=read(prod+'final-review.html');
fs.writeFileSync(out+'index.html',html);
console.log(JSON.stringify(integrity));
