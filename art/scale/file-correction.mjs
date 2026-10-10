import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import { isolate } from '../characters/sasuke/production/isolate.mjs';

const [id, anim, v, source] = process.argv.slice(2);
if (!['naruto','sasuke','killua','gojo'].includes(id) || !/^\d{2}$/.test(v)) throw Error('Invalid character/version');
const base=`art/characters/${id}`, file=`raw/${anim}_v${v}.png`, dest=`${base}/${file}`;
const manifestPath='art/manifest.json', manifest=JSON.parse(fs.readFileSync(manifestPath));
const entry=manifest.characters[id].animations[anim];
const prepared = source === '--prepared';
if(!entry || Number(v)<=entry.version || (!prepared && fs.existsSync(dest)))throw Error('Version must be new');
const original=`${base}/raw/_parts/${anim}_v${v}_A.png`;
if (prepared) {
  if (!fs.existsSync(dest) || !fs.existsSync(original)) throw Error('Prepared strip and source part required');
} else {
if(fs.existsSync(original))throw Error('Source version already exists');
fs.copyFileSync(source,original);
const separated=isolate(PNG.sync.read(fs.readFileSync(original)),entry.frames);
fs.writeFileSync(dest,PNG.sync.write(separated));
}
const ledgerPath='art/scale/corrections.json', ledger=JSON.parse(fs.readFileSync(ledgerPath));
ledger[id] ||= {};
ledger[id][anim]={version:Number(v),previousVersion:entry.version,approvedVersion:entry.approvedVersion,file,status:'raw',notes:'Imagegen head-proportion correction. Original source preserved in _parts; disconnected poses isolated. Anatomical calibration and motion QA pending.'};
fs.writeFileSync(ledgerPath,JSON.stringify(ledger,null,2)+'\n');
let text=fs.readFileSync(manifestPath,'utf8');
const start=text.indexOf('"'+id+'":'),a=text.indexOf('"'+anim+'":',text.indexOf('"animations":',start)),b=text.indexOf('}',a);
text=text.slice(0,a)+text.slice(a,b).replace(/"version":\s*\d+/,`"version": ${Number(v)}`)+text.slice(b);fs.writeFileSync(manifestPath,text);
const review='art/REVIEW.md';text=fs.readFileSync(review,'utf8');const at=text.indexOf('\n| 2026-');
const row=`| 2026-10-10 | ${id} | ${anim} | [${anim}_v${v}.png](characters/${id}/${file}) | v${v} | needs review | Correct anatomical head/body proportions while retaining taller or shorter character build | ART-SCALE-01; original source preserved, calibration and in-game transitions pending. |`;
fs.writeFileSync(review,text.slice(0,at)+'\n'+row+text.slice(at));
const tracker='art/TRACKER.md';text=fs.readFileSync(tracker,'utf8');const ta=text.indexOf('## '+id),tb=text.indexOf('\n## ',ta+5);
const section=text.slice(ta,tb<0?text.length:tb).split('\n').map(line=>{if(!line.startsWith('| '))return line;const cells=line.split('|').map(s=>s.trim());if(cells[2]!==anim)return line;cells[8]='v'+v;cells[10]='scale correction pending final review';return '| '+cells.slice(1,-1).join(' | ')+' |';}).join('\n');
fs.writeFileSync(tracker,text.slice(0,ta)+section+(tb<0?'':text.slice(tb)));
console.log(`Filed ${id} ${anim} v${v}; previous approval retained.`);
