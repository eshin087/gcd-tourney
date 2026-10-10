import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import { isolate } from './isolate.mjs';

// Filing and deterministic strip assembly only; all source art comes from imagegen.
const root = process.cwd();
const base = path.join(root, 'art/characters/sasuke');
const ledgerPath = path.join(base, 'production/progress.json');
const read = p => fs.readFileSync(p, 'utf8');
const write = (p, s) => fs.writeFileSync(p, s);
const ledger = fs.existsSync(ledgerPath) ? JSON.parse(read(ledgerPath)) : {};
const sections = read(path.join(base, 'PROMPTS.md')).split(/(?=^#{2,3} )/m);
const plans = sections.filter(s => /^#{2,3} (S[12]|A\d\d|U[123]) ·/.test(s)).map(s => ({
  id: s.match(/^#{2,3} (\w+)/)[1],
  title: s.split('\n')[0],
  intro: s.split('```text')[0],
  blocks: [...s.matchAll(/```text\r?\n([\s\S]*?)\r?\n```/g)].map(m => m[1]),
}));
const [cmd, ...args] = process.argv.slice(2);
function save(source, relative) {
  const dest = path.join(base, relative);
  if (fs.existsSync(dest)) throw new Error(`Refusing to overwrite ${relative}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(source, dest);
  return dest;
}
function bbox(p) {
  let x0=p.width,y0=p.height,x1=-1,y1=-1;
  for(let y=0;y<p.height;y++)for(let x=0;x<p.width;x++){
    const i=(y*p.width+x)*4,r=p.data[i],g=p.data[i+1],b=p.data[i+2];
    if(p.data[i+3]>127 && !(r>180&&b>175&&g<110&&r-g>70&&b-g>70)){
      x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);
    }
  }
  return {x0,y0,x1,y1};
}
function record(asset, version, file, notes) {
  ledger[asset]={version,file,notes,status:'raw'};
  write(ledgerPath,JSON.stringify(ledger,null,2)+'\n');
}
function replaceObject(s,key,fn,start=0){
  const k=s.indexOf('"'+key+'":',start);if(k<0)throw Error(`Missing ${key}`);
  const a=s.indexOf('{',k);let depth=0,b=a;
  for(;b<s.length;b++){if(s[b]==='{')depth++;if(s[b]==='}'&&!--depth)break;}
  return s.slice(0,a)+fn(s.slice(a,b+1))+s.slice(b+1);
}
if(cmd==='plan') console.log(JSON.stringify(plans.map(p=>({id:p.id,title:p.title,blocks:p.blocks.length}))));
else if(cmd==='prompt') {const p=plans.find(p=>p.id===args[0]);if(!p)throw Error('Unknown prompt');console.log(JSON.stringify(p));}
else if(cmd==='save') {save(args[0],args[1]);if(args[2])record(args[2],Number(args[3]),args[1],args[4]||'Generated candidate; final review pending.');}
else if(cmd==='single') {
  const [source,asset,v]=args;
  const original=save(source,`raw/_parts/${asset}_v${v}_A.png`);
  const count=JSON.parse(read(path.join(root,'art/manifest.json'))).characters.sasuke.animations[asset].frames;
  const separated=isolate(PNG.sync.read(fs.readFileSync(original)),count);
  const file=`raw/${asset}_v${v}.png`,dest=path.join(base,file);
  if(fs.existsSync(dest))throw Error('Version exists');
  fs.writeFileSync(dest,PNG.sync.write(separated));
  record(asset,Number(v),file,'Original generation retained in raw/_parts; disconnected poses separated for packing. Anatomical and motion QA pending.');
}
else if(cmd==='stitch') {
  const [asset,v]=args;
  const names=['A','B'].map(p=>`raw/_parts/${asset}_v${v}_${p}.png`);
  const parts=names.map(n=>PNG.sync.read(fs.readFileSync(path.join(base,n))));
  const factor=Number(args[2]||1);
  if(factor!==1){
    const p=parts[1],q=new PNG({width:Math.round(p.width*factor),height:Math.round(p.height*factor)});
    for(let y=0;y<q.height;y++)for(let x=0;x<q.width;x++){
      const si=(Math.min(p.height-1,Math.floor(y/factor))*p.width+Math.min(p.width-1,Math.floor(x/factor)))*4;
      p.data.copy(q.data,(y*q.width+x)*4,si,si+4);
    }
    parts[1]=q;
  }
  const boxes=parts.map(bbox),floor=Math.max(...boxes.map(b=>b.y1));
  const out=new PNG({width:parts[0].width+24+parts[1].width,height:Math.max(...parts.map((p,i)=>p.height+floor-boxes[i].y1))});
  for(let i=0;i<out.data.length;i+=4){out.data[i]=255;out.data[i+1]=0;out.data[i+2]=255;out.data[i+3]=255;}
  parts.forEach((p,i)=>PNG.bitblt(p,out,0,0,p.width,p.height,i?parts[0].width+24:0,floor-boxes[i].y1));
  const file=`raw/${asset}_v${v}.png`,dest=path.join(base,file);if(fs.existsSync(dest))throw Error('Version exists');
  const count=JSON.parse(read(path.join(root,'art/manifest.json'))).characters.sasuke.animations[asset].frames;
  const separated=isolate(out,count);fs.writeFileSync(dest,PNG.sync.write(separated));record(asset,Number(v),file,`Two source parts stitched then connected poses isolated into 80 px gaps; B nearest-neighbor scale ${factor}; part baseline offsets ${boxes.map(b=>floor-b.y1).join('/')}. Final review pending.`);
  console.log(JSON.stringify({file,width:out.width,height:out.height,boxes}));
}
else if(cmd==='note') {if(!ledger[args[0]])throw Error('Asset absent');ledger[args[0]].notes=args.slice(1).join(' ');write(ledgerPath,JSON.stringify(ledger,null,2)+'\n');}
else if(cmd==='sync') {
  const mp=path.join(root,'art/manifest.json');let m=read(mp);const ks=m.indexOf('"sasuke":');
  for(const [asset,e]of Object.entries(ledger)){
    const key=asset.startsWith('ui_')?asset.slice(3):asset;
    m=replaceObject(m,key,s=>s.replace(/"status":\s*"(todo|raw|packed)"/,`"status": "${e.status}"`).replace(/"version":\s*\d+/,`"version": ${e.version}`),ks);
  }
  JSON.parse(m);write(mp,m);
  const tp=path.join(root,'art/TRACKER.md');let t=read(tp);const a=t.indexOf('## sasuke'),b=t.indexOf('\n## ',a+5);let section=t.slice(a,b<0?t.length:b);
  section=section.split('\n').map(line=>{
    if(!line.startsWith('| '))return line;const c=line.split('|').map(x=>x.trim());
    const asset=c[2]?.startsWith('reference/expressions')?'expressions':c[2]?.startsWith('ui/')?'ui_'+c[2].split('/')[1].split('.')[0]:c[2];
    const e=ledger[asset];if(!e)return line;c[7]=e.status;c[8]='v'+String(e.version).padStart(2,'0');c[10]='final review pending; see REVIEW.md';return '| '+c.slice(1,-1).join(' | ')+' |';
  }).join('\n');write(tp,t.slice(0,a)+section+(b<0?'':t.slice(b)));
  const rp=path.join(root,'art/REVIEW.md');let r=read(rp);const rows=[];
  for(const [asset,e]of Object.entries(ledger)){
    const v='v'+String(e.version).padStart(2,'0');const label=asset.startsWith('ui_')?asset:asset;
    const row=`| 2026-10-10 | sasuke | ${label} | [${path.basename(e.file)}](characters/sasuke/${e.file}) | ${v} | needs review | Generated for one final approval, as requested; approved model, expressions and idle used as identity references | ${e.notes.replaceAll('|','/')} |`;
    const lines=r.split('\n'),idx=lines.findIndex(l=>l.includes(`| sasuke | ${label} |`)&&l.includes(`| ${v} |`));
    if(idx>=0){lines[idx]=row;r=lines.join('\n');}else rows.unshift(row);
  }
  if(rows.length)r=r.replace('|---|---|---|---|---|---|---|---|','|---|---|---|---|---|---|---|---|\n'+rows.join('\n'));
  write(rp,r);console.log(`Recorded ${Object.keys(ledger).length} Sasuke candidates.`);
}
else throw Error('Unknown command');
