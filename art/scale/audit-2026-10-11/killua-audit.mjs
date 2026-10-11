import fs from 'node:fs';import crypto from 'node:crypto';import cp from 'node:child_process';
import {loadPacked,auditPacked} from '../../../tools/scale-audit.mjs';import{newImage,blit,encodePng,bbox}from '../../../tools/pack-sprites.mjs';
const out='art/scale/audit-2026-10-11',main='C:/Users/eshin/Desktop/Claude Code/gcdTourney';
const font={};const t=fs.readFileSync('tools/scale-audit.mjs','utf8');const G=Function('return '+t.match(/const GLYPHS = (\{[\s\S]*?\n\});/)[1])();
function text(im,x,y,s){for(const c of s.toUpperCase()){let g=G[c]||G['?'];for(let r=0;r<5;r++)for(let q=0;q<3;q++)if(g[r*3+q]==='1')for(let a=0;a<2;a++)for(let b=0;b<2;b++)im.data.set([255,255,255,255],((y+r*2+a)*im.w+x+q*2+b)*4);x+=8;}}
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
let sources={mainHead:cp.execFileSync('git',['-C',main,'rev-parse','HEAD']).toString().trim(),capturedAt:new Date().toISOString(),files:{}};for(const f of ['public/characters/killua/sheet.png','public/characters/killua/anims.json','art/manifest.json','art/scale/builds.json'])sources.files[f]=hash(main+'/'+f);
fs.writeFileSync(out+'/killua-sources.json',JSON.stringify(sources,null,2));
let all=[];
for(const [kind,pub,art] of [['main',main+'/public',main+'/art'],['candidate','art/characters/killua/production/diagnostic-public','art']]){
const P=loadPacked('killua',pub);const audit=auditPacked('killua',{publicDir:pub,artDir:art});fs.writeFileSync(out+'/killua-'+kind+'-probe.json',JSON.stringify(audit.A,null,2));
const latest=JSON.parse(fs.readFileSync('art/characters/killua/production/scale-latest.json'));const idle=P.anims.find(a=>a.name==='idle').cells[0];
for(const a of P.anims){if(kind==='candidate'&&!latest[a.name])continue;let im=newImage(1024,Math.ceil((a.cells.length+1)/4)*280);for(let i=0;i<im.data.length;i+=4)im.data.set([65,69,78,255],i);[idle,...a.cells].forEach((c,i)=>{let x=(i%4)*256,y=Math.floor(i/4)*280;blit(im,c,x,y+24);text(im,x+4,y+6,i===0?'IDLE REF':a.name+' F'+(i-1));for(let xx=x;xx<x+256;xx++)im.data.set([125,135,145,255],((y+264)*im.w+xx)*4);});fs.writeFileSync(out+'/killua-'+kind+'-'+a.name+'.png',encodePng(im));
a.cells.forEach((c,i)=>all.push({source:kind,animation:a.name,frame:i,atlasIndex:a.frames[i],bbox:bbox(c),probe:audit.A.anims?.[a.name]?.frames?.[i]??null}));}}
fs.writeFileSync(out+'/killua-frame-metrics.json',JSON.stringify(all,null,2));console.log(all.length,all.filter(x=>x.source==='main').length);
