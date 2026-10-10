import fs from 'node:fs';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
const dir='.tmp-art-stage/naruto-final';
fs.mkdirSync(dir,{recursive:true});
const read=p=>fs.readFileSync(p,'utf8').replaceAll('\r\n','\n');
const head=p=>execFileSync('git',['show','HEAD:'+p],{encoding:'utf8'}).replaceAll('\r\n','\n');
const rows=s=>s.split('\n');
const obj=(s,k)=>{const a=s.indexOf('{',s.indexOf('"'+k+'":'));let d=0,b=a;for(;b<s.length;b++){if(s[b]==='{')d++;if(s[b]==='}'&&!--d)break;}return[a,b+1];};
const section=(s,key)=>{const a=s.indexOf(key),end=s.indexOf('\n## ',a+5);return[a,end<0?s.length:end];};
const outputs={};
for(const file of ['art/manifest.json','art/TRACKER.md','art/REVIEW.md','docs/TASKS.md','docs/NOW.md','CHANGELOG.md']){
 let old=head(file),work=read(file),next=old;
 if(file==='art/manifest.json'){const[a,b]=obj(old,'naruto'),[c,d]=obj(work,'naruto');next=old.slice(0,a)+work.slice(c,d)+old.slice(b);}
 if(file==='art/TRACKER.md'){const[a,b]=section(old,'## naruto'),[c,d]=section(work,'## naruto');next=old.slice(0,a)+work.slice(c,d)+old.slice(b);next=next.replace(/^\| naruto .*$/m,rows(work).find(l=>l.startsWith('| naruto |')));}
 if(file==='art/REVIEW.md'){
  const key=l=>{const c=l.split('|').map(s=>s.trim());return c[3]+':'+c[5];};
  const map=new Map(rows(work).filter(l=>l.includes('| naruto |')).map(l=>[key(l),l]));
  next=rows(old).map(l=>{if(!l.includes('| naruto |'))return l;const k=key(l),n=map.get(k);if(!n)throw Error('Missing Naruto history '+k);map.delete(k);return n;}).join('\n');
  const i=next.indexOf('\n| 2026-');next=next.slice(0,i)+'\n'+[...map.values()].join('\n')+next.slice(i);
 }
 if(file==='docs/TASKS.md'){
  const map=new Map(rows(work).filter(l=>/^\| ART-NAR-/.test(l)).map(l=>[l.split('|')[1].trim(),l]));
  next=rows(old).map(l=>{if(!/^\| ART-NAR-/.test(l))return l;const k=l.split('|')[1].trim(),n=map.get(k);map.delete(k);return n||l;}).join('\n');
  if(map.size)next=next.replace('| ART-NAR-01 |',[...map.values()].join('\n')+'\n| ART-NAR-01 |');
 }
 if(file==='docs/NOW.md'){
  next=next.replace(/^1\. \*\*Naruto:.*$/m,rows(work).find(l=>l.startsWith('1. **Naruto:')));
  const a=next.indexOf('<!-- status:begin -->'),b=next.indexOf('<!-- status:end -->')+'<!-- status:end -->'.length;
  const c=work.indexOf('<!-- status:begin -->'),d=work.indexOf('<!-- status:end -->')+'<!-- status:end -->'.length;
  if(a>=0&&c>=0)next=next.slice(0,a)+work.slice(c,d)+next.slice(b);
 }
 if(file==='CHANGELOG.md'){const line=rows(work).find(l=>l.startsWith('- Naruto complete candidate batch'));if(!line)throw Error('Missing changelog');next=old.replace('## [Unreleased]','## [Unreleased]\n\n'+line);}
 outputs[file]={old,next};
}
let patch='';
for(const [file,{old,next}]of Object.entries(outputs)){
 const a=path.join(dir,'base',file),b=path.join(dir,'next',file);
 fs.mkdirSync(path.dirname(a),{recursive:true});fs.mkdirSync(path.dirname(b),{recursive:true});fs.writeFileSync(a,old);fs.writeFileSync(b,next);
 const result=spawnSync('git',['diff','--no-index','--',a,b],{encoding:'utf8'});
 if(result.status!==0&&result.status!==1)throw Error(result.stderr);
 const lines=result.stdout.split('\n').map(l=>l.startsWith('diff --git ')?'diff --git a/'+file+' b/'+file:l.startsWith('--- ')?'--- a/'+file:l.startsWith('+++ ')?'+++ b/'+file:l);
 patch+=lines.join('\n');
}
fs.writeFileSync(dir+'/owned.patch',patch);console.log(dir+'/owned.patch');
