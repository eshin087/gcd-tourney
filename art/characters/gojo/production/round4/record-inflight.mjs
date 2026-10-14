import fs from 'node:fs';
import crypto from 'node:crypto';
const p='art/characters/gojo/production/round4/sources/attempt-ledger.json';
const entries=JSON.parse(fs.readFileSync(p,'utf8'));
const additions={
  'throw-v05':{file:'throw-v05-call3.png',note:'Third and final authorized call in this turn; not selected because smooth anti-aliased painted rendering violates hard-pixel art direction. Keep call2 as selected candidate pending the already-required anatomy review.'},
  'airLight1-v07':{file:'airLight1-v07-call3.png',note:'Third and final authorized call in this turn; not selected because smooth anti-aliased painted rendering violates hard-pixel art direction. Keep call2 as selected candidate pending the already-required anatomy review.'}
};
for(const [asset,add] of Object.entries(additions)){
 const e=entries.find(x=>x.asset===asset); if(!e)throw Error(`missing ledger entry ${asset}`);
 const file=`art/characters/gojo/production/round4/sources/${add.file}`;
 e.calls=3;e.call3=fs.realpathSync(file);e.call3Sha256=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');e.call3Decision='discarded';e.call3Note=add.note;
}
fs.writeFileSync(p,JSON.stringify(entries,null,2)+'\n');
console.log(entries.filter(x=>x.calls>=3).map(x=>`${x.asset}: ${x.calls}/${x.maxNewCalls}, selected ${x.selectedSource}, call3 ${x.call3Sha256}`).join('\n'));
