import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const report=JSON.parse(fs.readFileSync('art/scale/raw-scale-report.json'));
const estimates={
 naruto:{heavy:[25,25,25,25,25,25,25,25],airLight1:[28,28,28,28,28],airLight3:[34,34,34,34,34,34],airHeavy:[27,27,30,30,30,30],guard:[36,36],block:[34,34],launched:[25,25],airRecover:[28,28,28],down:[28,28],ko:[22],special:[39,39,39,39,39,39,39,39],win:[25,25,25,25],beamCharge:[35,35,35],beamFire:[35,35,35],superPose:[35,35,35,35]},
 killua:{guard:[40,40],block:[40,40],hurtHigh:[36,36,36],hurtLow:[36,36,36],charge:[42,42,42,42],beamCharge:[38,38,38],beamFire:[45,45,45],ko:[21],specialForward:[40,40,40,40,38,38,38],superPose:[39,39,39,39]}
};
// This is a visual correction candidate, not an automatic measurement or approval.
// Raw-only pack scales trace packed head estimates back to source pixels.
for(const [id,anims]of Object.entries(estimates))for(const [anim,heads]of Object.entries(anims)){
 const manifest=JSON.parse(fs.readFileSync('art/manifest.json')),entry=manifest.characters[id].animations[anim],base=`art/characters/${id}/`;
 if(heads.length!==entry.frames)throw Error('Count mismatch '+id+'/'+anim);
 const r=report.characters.find(c=>c.id===id).packed.find(a=>a.anim===anim);
 if(r.version!==entry.version)throw Error('Already changed; inspect '+id+'/'+anim);
 let highest=entry.version;
 for(const dir of ['raw','raw/_parts','raw/_rejected'])if(fs.existsSync(base+dir))for(const f of fs.readdirSync(base+dir)){const match=f.match(new RegExp('^'+anim+'_v(\\d+)'));if(match)highest=Math.max(highest,+match[1]);}
 const old=String(entry.version).padStart(2,'0'),v=String(highest+1).padStart(2,'0');
 fs.copyFileSync(`${base}raw/${anim}_v${old}.png`,`${base}raw/${anim}_v${v}.png`,fs.constants.COPYFILE_EXCL);
 for(const part of ['A','B']){const p=`${base}raw/_parts/${anim}_v${old}_${part}.png`;if(fs.existsSync(p))fs.copyFileSync(p,`${base}raw/_parts/${anim}_v${v}_${part}.png`,fs.constants.COPYFILE_EXCL);}
 const preserved=`${base}raw/_parts/${anim}_v${v}_A.png`;
 if(!fs.existsSync(preserved))fs.copyFileSync(`${base}raw/${anim}_v${old}.png`,preserved,fs.constants.COPYFILE_EXCL);
 const oldSide=`${base}raw/${anim}_v${old}.json`,side=fs.existsSync(oldSide)?JSON.parse(fs.readFileSync(oldSide)):{};
 if(side.frameOffsets)side.frameOffsets=side.frameOffsets.map((o,i)=>o.map(n=>Math.round(n*31/heads[i])));
 side.anatomy={measurement:'skull-to-chin',targetHeadPx:31,sourceHeadPx:heads.map(h=>+(h/r.scale).toFixed(3))};
 side.calibrationNotes='Provisional visual estimates from full-frame and head-crop review. Crown hidden by hair; anatomy and motion acceptance remains pending. No automatic segmentation used as a measurement.';
 fs.writeFileSync(`${base}raw/${anim}_v${v}.json`,JSON.stringify(side,null,2)+'\n',{flag:'wx'});
 execFileSync(process.execPath,['art/scale/file-correction.mjs',id,anim,v,'--prepared'],{stdio:'inherit'});
 const p='art/scale/corrections.json',ledger=JSON.parse(fs.readFileSync(p));Object.assign(ledger[id][anim],{packedHeadEstimate:heads,sourceScale:r.scale,notes:side.calibrationNotes});fs.writeFileSync(p,JSON.stringify(ledger,null,2)+'\n');
}
