import fs from 'node:fs';
import { PNG } from 'pngjs';
const base='art/characters/killua/';
const ledger=JSON.parse(fs.readFileSync(base+'production/progress.json'));
const qa=JSON.parse(fs.readFileSync(base+'production/qa-final.json'));
const meta=JSON.parse(fs.readFileSync('public/characters/killua/anims.json'));
const atlas=PNG.sync.read(fs.readFileSync('public/characters/killua/sheet.png'));
const colors=new Set(),alpha=new Set();
for(let k=0;k<atlas.data.length;k+=4){alpha.add(atlas.data[k+3]);if(atlas.data[k+3])colors.add(atlas.data.subarray(k,k+3).join(','));}
const animations=Object.values(meta.animations),frames=animations.reduce((n,a)=>n+a.frames.length,0);
if(animations.length!==42||frames!==175||qa.totalWarnings||colors.size>48||[...alpha].some(a=>a!==0&&a!==255))throw Error('Final atlas checks failed');
for(const [name,e]of Object.entries(ledger)){
  if(meta.animations[name]){e.status='packed';e.notes+=' Final atlas QA: expected frame count, no clipping/margin warnings, 48-color palette. See production/QA.md for visual caveats.';}
  if(name.startsWith('ui_')){e.status='packed';e.notes+=' Fitted preview in production/ui-preview; fixed-name approval copy pending final decision.';}
}
ledger.run.notes+=' run_v02.json aligns torso and lifts passing poses; bodyHeight unchanged.';
fs.writeFileSync(base+'production/progress.json',JSON.stringify(ledger,null,2)+'\n');
const checked={animations:animations.length,frames,palette:colors.size,alpha:[...alpha],width:atlas.width,height:atlas.height,packerWarnings:qa.totalWarnings,ui:{}};
for(const n of ['portrait','cutin','select']){const p=PNG.sync.read(fs.readFileSync(base+`production/ui-preview/characters/killua/${n}.png`));let transparent=0;for(let k=3;k<p.data.length;k+=4)if(p.data[k]!==255)transparent++;checked.ui[n]={width:p.width,height:p.height,nonOpaquePixels:transparent};}
if(checked.ui.cutin.nonOpaquePixels)throw Error('Cut-in must be opaque');
fs.writeFileSync(base+'production/qa-integrity.json',JSON.stringify(checked,null,2)+'\n');
console.log(JSON.stringify(checked));
let t=fs.readFileSync('docs/TASKS.md','utf8');
t=t.replace(/^\| ART-KIL-01 .*$/m,'| ART-KIL-01 | Killua complete art set for final approval | Codex | review | Complete final batch: expressions, 42 animations / 175 frames, 3 UI candidates. Strict 48-color pack and build pass; browser loads Killua custom sheet. One final approval requested by user; latest versions in art/characters/killua/production/progress.json. Review production/final-review.html and QA.md; visual reach/pose caveats remain (ENG-035). Model v01 approved. files: docs/NOW.md, CHANGELOG.md |');
fs.writeFileSync('docs/TASKS.md',t);
let now=fs.readFileSync('docs/NOW.md','utf8');
now=now.replace(/^5\. \*\*Killua:\*\*.*$/m,'5. **Killua: one final batch review.** Open http://127.0.0.1:5188/art/characters/killua/production/final-review.html on this computer. Expressions, all 42 animations (175 frames), and 3 UI candidates are ready. Reply `approve Killua final batch` or send changes in the Killua thread. Build and strict pack pass; review the documented pose/reach caveats. Model v01 stays approved.');
fs.writeFileSync('docs/NOW.md',now);
let log=fs.readFileSync('CHANGELOG.md','utf8');
log=log.replace('## [Unreleased]','## [Unreleased]\n\n- Killua complete candidate batch for one final review: expressions, 42 animations / 175 frames, and three UI images; corrected strip separation, run alignment and air-heavy boxes; strict 48-color pack, browser preview and build verified. Visual reach/pose caveats recorded in `art/characters/killua/production/QA.md` (ART-KIL-01).');
fs.writeFileSync('CHANGELOG.md',log);
