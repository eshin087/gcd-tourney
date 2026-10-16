import fs from 'node:fs';
import { PNG } from 'pngjs';
import { measureBody } from '../../../../../tools/body-sheet.mjs';
const base='art/characters/gojo/production/round4';
const p=`${base}/diagnostic-v05-public/characters/gojo`;
const sheet=PNG.sync.read(fs.readFileSync(`${p}/sheet.png`));
const meta=JSON.parse(fs.readFileSync(`${p}/anims.json`,'utf8'));
const scale=JSON.parse(fs.readFileSync('art/scale/builds.json','utf8')).fighters.gojo;
const anims=Object.entries(meta.animations).map(([name,record])=>({name,cells:record.frames.map(id=>{const out=new PNG({width:256,height:256});PNG.bitblt(sheet,out,(id%16)*256,Math.floor(id/16)*256,256,256,0,0);return out;})}));
const body=measureBody({anims,meta},scale.bodyColors);
const keep=['jumpFall','throw','airLight1','airRecover','airLight2','light3','guard','jumpUp','airLight3','hurtLow'];
const report={method:'Current vNN candidates measured from the actual isolated 48-color packed atlas, against approved idle v06. Head is the packer scale probe; B is TOOL-036 garment area, advisory +/-10%, not a segment pass. Full frame-by-frame visible anatomy remains manually assessed against the approved combat cell; occluded, depth-projected, curled, or sole-facing landmarks are marked inconclusive in the anatomy ledger.',atlas:`${p}/sheet.png`,animsJson:`${p}/anims.json`,paletteColors:meta.colors,gate:'warn in disposable fixture only; production thresholds unchanged; no approval inferred',candidates:{}};
for(const name of keep){const audit=meta.scaleAudit.anims[name];const b=body.anims[name];const source=`${name}_v${String(audit.v).padStart(2,'0')}.png`;report.candidates[name]={source,frames:audit.frames.map((head,i)=>({frame:i,H:+head.toFixed(3),B:b.body[i],verdict:audit.verdict,notes:meta.anims?.[name]?.notes??[]}))};}
fs.writeFileSync(`${base}/candidate-atlas-measurements.json`,JSON.stringify(report,null,2)+'\n');
console.log(Object.entries(report.candidates).map(([a,v])=>`${a} ${v.source}: ${v.frames.map(x=>`f${x.frame} H${x.H}/B${x.B}`).join(', ')}`).join('\n'));

