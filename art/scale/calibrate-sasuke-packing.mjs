import fs from 'node:fs';
import crypto from 'node:crypto';

// A provisional visual correction pass. Crowns hidden under hair are estimates,
// not ground-truth landmarks; final acceptance requires anatomy/motion review.
const report = JSON.parse(fs.readFileSync('art/characters/sasuke/production/pack-progress.json','utf8').replace(/^\uFEFF/,''));
const estimates = {
  superDash:[23,23], heavy:[24,24,24,24,24,38,38,38],
  airLight3:[17,17,17,17,29,29], airHeavy:[19,19,19,19,30,30],
  launched:[24,24], down:[25,25], ko:[22],
  special:[30,30,30,16,16,16,16,16],
  specialForward:[21,21,21,21,31,31,31], specialUp:[23,23,23,23,31,31],
};
const ledger={};
for(const [anim,heads]of Object.entries(estimates)) {
 const row=report.characters[0].packed.find(p=>p.anim===anim);
 if(!row||row.source.startsWith('frames/')||heads.length!==row.frames)throw Error('Unexpected source/count '+anim);
 const image=`art/characters/sasuke/${row.from}`,side=image.replace(/\.png$/,'.json');
 if(fs.existsSync(side))throw Error('Calibration exists; inspect rather than applying twice: '+side);
 const sourceHeadPx=heads.map((h,i)=>+(h/row.frameScales[i]).toFixed(3));
 const sha256=crypto.createHash('sha256').update(fs.readFileSync(image)).digest('hex');
 fs.writeFileSync(side,JSON.stringify({anatomy:{measurement:'skull-to-chin',targetHeadPx:31,sourceHeadPx},calibrationNotes:'Provisional visual packed skull-axis estimates, traced through actual per-frame pack scales. Crown is obscured by hair. See art/scale/sasuke-packing-estimates.json; final landmark and motion review remains pending.'},null,2)+'\n',{flag:'wx'});
 ledger[anim]={source:image,sha256,packedHeadEstimate:heads,previousFrameScales:row.frameScales,sourceHeadPx,certainty:'visual estimate; not certified',evidence:'sasuke-heads-1..4.png and native full-body comparison'};
}
fs.writeFileSync('art/scale/sasuke-packing-estimates.json',JSON.stringify(ledger,null,2)+'\n',{flag:'wx'});
