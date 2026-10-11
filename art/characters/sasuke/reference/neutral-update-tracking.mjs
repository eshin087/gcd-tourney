import fs from 'node:fs';
import cp from 'node:child_process';
const root='art/characters/sasuke/';
const inv=JSON.parse(fs.readFileSync(root+'reference/neutral-redraw-inventory.json')).rows;
const latest={};
for(const r of inv){latest[r.animation]=fs.readdirSync(root+'raw').filter(x=>new RegExp('^'+r.animation+'_v\\d+\\.png$').test(x)).map(x=>+x.match(/_v(\d+)/)[1]).sort((a,b)=>a-b).at(-1);}
let m=fs.readFileSync('art/manifest.json','utf8'),start=m.indexOf('    "sasuke": {'),end=m.indexOf('    "killua": {',start);
if(end<0)end=m.indexOf('    "gojo": {',start);
const before=m.slice(0,start),after=m.slice(end),sas=m.slice(start,end).split('\n').map(line=>{
 const match=line.match(/^        "([^"]+)": \{ "frames":/);return match&&latest[match[1]]?line.replace(/"version": \d+/, '"version": '+latest[match[1]]):line;
}).join('\n');
fs.writeFileSync('art/manifest.json',before+sas+after);
let t=fs.readFileSync('art/TRACKER.md','utf8'),ts=t.indexOf('## Sasuke'),te=t.indexOf('\n## ',ts+1);if(te<0)te=t.length;
let st=t.slice(ts,te).split('\n').map(line=>{if(!line.startsWith('|'))return line;const c=line.split('|');const n=c[2]?.trim();if(latest[n]){c[8]=' v'+String(latest[n]).padStart(2,'0')+' ';if(!c[10].includes('Neutral redraw pending'))c[10]=' Neutral redraw pending: scale/probe hold; see REVIEW and neutral QA. '+c[10].trim()+' ';}return c.join('|');}).join('\n');
st=st.replace(/2026-10-11 approved height_neutral[^\n]+/,'2026-10-11: user approved height_neutral v01 and authorized all42 redraw. All42 now saved, newest idle v06. Strict pack blocked; ref fragmentation and other art holds documented in neutral-redraw-QA.md. Existing animation approvals unchanged.');
t=t.slice(0,ts)+st+t.slice(te);fs.writeFileSync('art/TRACKER.md',t);
let review=fs.readFileSync('art/REVIEW.md','utf8');
const files=cp.execFileSync('git',['ls-files','--others','--exclude-standard','art/characters/sasuke/raw'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(f=>/\/[^/]+_v\d+\.png$/.test(f)&&!f.includes('/_parts/'));
const rows=[];
for(const f of files){if(review.includes(']('+f.replace(/^art\//,'')+')'))continue;const match=f.match(/\/([^/]+)_v(\d+)\.png$/),name=match[1],v=+match[2];if(!latest[name])continue;
rows.push('| 2026-10-11 | sasuke | '+name+' | ['+name+'_v'+match[2]+'.png]('+f.replace(/^art\//,'')+') | v'+match[2]+' | needs review | Approved-neutral full redraw. '+(v<latest[name]?'Historical intermediate retained; superseded candidate exists, no approval inferred. ':'Latest candidate. ')+'**HOLD:** strict pack fails; see [batch QA](characters/sasuke/reference/neutral-redraw-QA.md), [diagnostic frame gallery](../public/art-review/sasuke-neutral-redraw/index.html). [Heads](scale/heads-sasuke.png) and [lineup](scale/lineup.png) reflect last successful atlas, not all42 candidates. |');}
const lines=review.split('\n'),at=lines.findIndex(l=>/^\|[-: ]+\|/.test(l));if(at<0)throw Error('No review table');lines.splice(at+1,0,...rows.reverse());fs.writeFileSync('art/REVIEW.md',lines.join('\n'));
console.log({updatedVersions:latest,addedRows:rows.length});

