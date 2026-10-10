import fs from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
const stage = 'art/characters/gojo/production/staging';
fs.mkdirSync(stage, { recursive: true });
const head = p => execFileSync('git', ['show', ':' + p], { encoding: 'utf8' }).replace(/\r\n/g, '\n');
const read = p => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const projections = new Map();
function section(s, name) { const a=s.indexOf(name); if(a<0)throw Error(name);const b=s.indexOf('\n## ',a+name.length);return [a,b<0?s.length:b]; }
for (const [p, name] of [['art/TRACKER.md','## gojo'],['docs/agents/CODEX_INBOX.md','## Gojo thread']]) {
  const h=head(p),c=read(p),[a,b]=section(h,name),[x,y]=section(c,name);
  projections.set(p,h.slice(0,a)+c.slice(x,y)+h.slice(b));
}
function objectRange(s) {
  const a=s.indexOf('{',s.indexOf('"gojo":'));let depth=0,quote=false,escape=false;
  for(let i=a;i<s.length;i++){const c=s[i];if(quote){if(escape)escape=false;else if(c==='\\')escape=true;else if(c==='"')quote=false;continue;}if(c==='"')quote=true;else if(c==='{')depth++;else if(c==='}'&&--depth===0)return[a,i+1];}
  throw Error('Missing Gojo block');
}
{
  const p='art/manifest.json',h=head(p),c=read(p),[a,b]=objectRange(h),[x,y]=objectRange(c);
  projections.set(p,h.slice(0,a)+c.slice(x,y)+h.slice(b));
}
{
  const p='art/REVIEW.md',h=head(p),rows=read(p).split('\n').filter(l=>l.includes('| gojo |'));
  let clean=h.split('\n').filter(l=>!l.includes('| gojo |')).join('\n');
  projections.set(p,clean.replace('|---|---|---|---|---|---|---|---|','$&\n'+rows.join('\n')));
}
{
  const p='docs/TASKS.md',c=read(p);let h=head(p);
  for(const id of ['ART-GOJ-01','ENG-032','ENG-035']){const re=new RegExp('^\\| '+id+' \\|[^\\n]+','m');h=h.replace(re,c.match(re)[0]);}
  projections.set(p,h);
}
{
  const p='CHANGELOG.md',h=head(p),lines=read(p).split('\n').filter(l=>l.startsWith('- ')&&/Gojo|gojo/.test(l)&&!h.includes(l));
  projections.set(p,h.replace('## [Unreleased]','## [Unreleased]\n\n'+lines.join('\n')));
}
{
  const p='docs/NOW.md',c=read(p);let h=head(p);
  const current=c.split('\n').find(l=>l.startsWith('2. **Gojo:'));
  h=h.replace(/^2\.[^\n]+/m,current);
  h=h.replace(/^\| gojo \|[^\n]+/m,c.split('\n').find(l=>l.startsWith('| gojo |')));
  h=h.split('\n').filter(l=>!l.startsWith('- **gojo**')).join('\n');
  projections.set(p,h);
}
let patch='';
for(const [p,projection]of projections){
  fs.writeFileSync(stage+'/before.txt',head(p));fs.writeFileSync(stage+'/after.txt',projection);
  const r=spawnSync('git',['diff','--no-index','--no-prefix','--',stage+'/before.txt',stage+'/after.txt'],{encoding:'utf8'});
  if(r.status>1)throw Error(r.stderr);
  patch+=r.stdout.replaceAll(stage+'/before.txt','a/'+p).replaceAll(stage+'/after.txt','b/'+p);
}
fs.writeFileSync(stage+'/gojo-shared.patch',patch);
console.log('Prepared Gojo-only shared-file patch; working files unchanged.');
