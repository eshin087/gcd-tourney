const fs=require('fs');
const src=fs.readFileSync('art/characters/killua/production/landmark-board.mjs','utf8');
const groups=[['beamCharge_v07',3,'beamFire_v07',3],['specialDown_v03',4,'superPose_v06',4],['light2_v04',7,'light3_v04',7],['heavy_v09',8,'airHeavy_v04',6],['airLight1_v05',5,'airLight2_v06',5],['airLight3_v05',6,'specialForward_v09',7],['getup_v04',5,'throw_v05',4],['superDash_v04',2,'jumpSquat_v04',1],['land_v03',2,'airRecover_v04',3],['launched_v03',2,'spin_v03',4],['vanish_v03',2,'down_v04',2],['ko_v05',1,'_parts/specialUp_v07_B',2]];
for(let k=0;k<groups.length;k++){
 const [a,n,b,m]=groups[k],name='correction-board-'+String(k+1).padStart(2,'0');
 const sources=[['NEUTRAL','reference/height_neutral.png',1,.8],[a,'raw/'+a+'.png',n,.65],[b,'raw/'+b+'.png',m,.65]];
 let s=src.replace(/let sources=\[.*?\];/, 'let sources='+JSON.stringify(sources)+';').replaceAll('idle-landmark-board',name);
 fs.writeFileSync('art/characters/killua/production/'+name+'.mjs',s);
}
