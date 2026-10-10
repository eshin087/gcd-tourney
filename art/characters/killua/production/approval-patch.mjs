import fs from 'node:fs';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
const root='art/characters/killua/production/staging';fs.mkdirSync(root,{recursive:true});
const files=['art/manifest.json','art/TRACKER.md','art/REVIEW.md','docs/TASKS.md','CHANGELOG.md','docs/NOW.md','docs/agents/CODEX_INBOX.md'];
const read=p=>fs.readFileSync(p,'utf8').replaceAll('\r\n','\n');
let patch='';
function section(s,start,end){const a=s.indexOf(start),b=s.indexOf(end,a+start.length);if(a<0||b<0)throw Error('Section not found');return s.slice(a,b);}
for(const file of files){
  const old=execFileSync('git',['show','HEAD:'+file],{encoding:'utf8'}).replaceAll('\r\n','\n'),current=read(file);let next=old;
  if(file==='art/manifest.json')next=old.replace(section(old,'    "killua":','    "gojo":'),section(current,'    "killua":','    "gojo":'));
  else if(file==='art/TRACKER.md')next=old.replace(section(old,'## killua','## gojo'),section(current,'## killua','## gojo'));
  else if(file==='art/REVIEW.md'){
    const rows=current.split('\n').filter(l=>l.includes('| killua |'));
    next=old.split('\n').filter(l=>!l.includes('| killua |')).join('\n').replace('|---|---|---|---|---|---|---|---|','|---|---|---|---|---|---|---|---|\n'+rows.join('\n'));
  }else if(file==='docs/TASKS.md')next=old.replace(/^\| ART-KIL-01 .*$/m,current.match(/^\| ART-KIL-01 .*$/m)[0]);
  else if(file==='CHANGELOG.md'){
    const rows=current.split('\n').filter(l=>l.startsWith('- ')&&l.includes('Killua')&&!old.includes(l));
    next=old.replace('## [Unreleased]','## [Unreleased]\n\n'+rows.join('\n'));
  }else if(file==='docs/NOW.md'){
    next=old.replace(/^4\. \*\*Killua.*$/m,current.match(/^4\. \*\*Killua.*$/m)[0]);
    next=next.replace(section(next,'<!-- status:begin -->','<!-- status:end -->'),section(current,'<!-- status:begin -->','<!-- status:end -->'));
  }else next=old.replace(section(old,'## Killua thread','## Gojo thread'),section(current,'## Killua thread','## Gojo thread'));
  const before=path.join(root,'before',file),after=path.join(root,'after',file);
  for(const p of [before,after])fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(before,old);fs.writeFileSync(after,next);
  const d=spawnSync('git',['diff','--no-index','--no-ext-diff','--',before,after],{encoding:'utf8'});
  if(d.status>1)throw Error(d.stderr);
  patch+=d.stdout.replace(/^diff --git .*$/m,`diff --git a/${file} b/${file}`).replace(/^--- .*$/m,`--- a/${file}`).replace(/^\+\+\+ .*$/m,`+++ b/${file}`);
}
fs.writeFileSync(root+'/approval.patch',patch);console.log('Prepared scoped shared-file patch: '+files.join(', '));
