import fs from 'node:fs';
import path from 'node:path';
const base=path.resolve('art/characters/killua');
const ledger=JSON.parse(fs.readFileSync(path.join(base,'production/progress.json')));
const read=p=>fs.readFileSync(p,'utf8'),write=(p,s)=>fs.writeFileSync(p,s);
let review=read('art/REVIEW.md');let approved=0,rejected=0;
review=review.split('\n').map(line=>{
  const c=line.split('|').map(s=>s.trim());
  if(c[2]!=='killua'||!ledger[c[3]])return line;
  const e=ledger[c[3]],v='v'+String(e.version).padStart(2,'0');
  if(c[5]===v){c[6]='approved';c[8]+=' User approved final batch on 2026-10-09, including documented QA caveats.';approved++;}
  else if(c[6]==='needs review'){
    const relative=c[4].match(/\]\(characters\/killua\/(.*?)\)/)?.[1];
    if(!relative)throw Error('Missing candidate path');
    const from=path.resolve(base,relative),to=path.join(path.dirname(from),'_rejected',path.basename(from));
    if(!from.startsWith(base+path.sep)||!to.startsWith(base+path.sep))throw Error('Unsafe candidate path');
    if(fs.existsSync(to))throw Error('Rejected destination exists');
    fs.mkdirSync(path.dirname(to),{recursive:true});fs.renameSync(from,to);
    c[4]=`[${path.basename(to)}](characters/killua/${path.relative(base,to).replaceAll('\\','/')})`;
    c[6]='rejected';c[8]+=` Superseded by approved ${v} in final batch on 2026-10-09.`;rejected++;
  }
  return '| '+c.slice(1,-1).join(' | ')+' |';
}).join('\n');
if(approved!==46)throw Error(`Expected 46 latest approvals, found ${approved}`);
write('art/REVIEW.md',review);
let manifest=read('art/manifest.json');const start=manifest.indexOf('    "killua":'),end=manifest.indexOf('    "gojo":',start);
let block=manifest.slice(start,end);
block=block.replace(/"status": "(?:raw|packed)", "version": (\d+), "approvedVersion": null/g,(_,v)=>`"status": "approved", "version": ${v}, "approvedVersion": ${v}`);
write('art/manifest.json',manifest.slice(0,start)+block+manifest.slice(end));
let tracker=read('art/TRACKER.md'),a=tracker.indexOf('## killua'),b=tracker.indexOf('\n## ',a+5);
let section=tracker.slice(a,b).split('\n').map(line=>{
  if(!line.startsWith('|'))return line;
  const c=line.split('|').map(x=>x.trim());
  const name=c[2]?.replaceAll('`','');
  const e=ledger[name]||ledger['ui_'+name];
  if(!e)return line;
  const v='v'+String(e.version).padStart(2,'0');
  const status=c.findIndex(x=>['raw','packed'].includes(x));
  if(status>=0){c[status]='approved';c[status+1]=v;c[status+2]=v;c[status+3]='User approved final batch 2026-10-09; QA caveats retained in production/QA.md';}
  return '| '+c.slice(1,-1).join(' | ')+' |';
}).join('\n');
write('art/TRACKER.md',tracker.slice(0,a)+section+tracker.slice(b));
for(const [name,e]of Object.entries(ledger)){
  e.status='approved';e.approvedVersion=e.version;e.approvedDate='2026-10-09';
  e.notes=e.notes.replace(/final (?:review|approval) pending\.?/gi,'Approved in final batch 2026-10-09.').replace('fixed-name approval copy pending final decision.','fixed-name approval copy promoted.');
  let dest=name==='expressions'?'reference/expressions.png':name==='idle'?'reference/idle_approved.png':name.startsWith('ui_')?`ui/${name.slice(3)}.png`:null;
  if(dest){fs.mkdirSync(path.dirname(path.join(base,dest)),{recursive:true});fs.copyFileSync(path.join(base,e.file),path.join(base,dest));}
}
write(path.join(base,'production/progress.json'),JSON.stringify(ledger,null,2)+'\n');
let tasks=read('docs/TASKS.md');tasks=tasks.replace(/^\| ART-KIL-01 .*$/m,'| ART-KIL-01 | Killua complete art set | Codex | done | User approved final batch 2026-10-09: expressions, all 42 animations / 175 frames, 3 UI assets. Approved fixed references/UI promoted; superseded candidates archived. QA caveats remain documented; ENG-035 owns gameplay reach follow-up. files: docs/NOW.md, docs/agents/CODEX_INBOX.md, CHANGELOG.md |');write('docs/TASKS.md',tasks);
let now=read('docs/NOW.md');now=now.replace(/^4\. \*\*Killua:.*$/m,'4. **Killua: final batch approved.** Expressions, 42 animations (175 frames), and all 3 UI assets are approved and installed locally. No art approval remains. Claude can proceed with ENG-035 gameplay reach checks and deployment.');write('docs/NOW.md',now);
let log=read('CHANGELOG.md');log=log.replace('## [Unreleased]','## [Unreleased]\n\n- Approved Killua final art batch: expressions, 42 animations / 175 frames and all three UI assets; promoted fixed references/UI and archived 16 superseded candidates. Documented visual caveats retained (ART-KIL-01).');write('CHANGELOG.md',log);
let qa=read(path.join(base,'production/QA.md'));qa=qa.replace('expressions, animation and UI candidates are **not yet approved**','the complete final batch was **approved by the user on 2026-10-09**');qa=qa.replace(/Reply \*\*approve Killua final batch\*\*[\s\S]*$/,'User approved the latest 46 versions in progress.json on 2026-10-09. Expression/idle/UI fixed-name files are promoted and 16 superseded candidate rows are rejected with sources archived. The model reference remains approved. The recorded visual deviations remain part of the approval record.\n\nNo deployment was made in this approval step.\n');write(path.join(base,'production/QA.md'),qa);
let html=read(path.join(base,'production/final-review.html'));html=html.replace('ONE FINAL REVIEW · CANDIDATES','APPROVED · 2026-10-09').replace('Everything below is awaiting your final decision.','The full batch below is approved.').replace(/<footer>[\s\S]*?<\/footer>/,'<footer>Complete batch approved by the user on 2026-10-09. Historical QA notes are retained above.</footer>');write(path.join(base,'production/final-review.html'),html);
console.log(JSON.stringify({approved,rejected,promoted:5}));
