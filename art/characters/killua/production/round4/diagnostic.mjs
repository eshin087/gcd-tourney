// Disposable quantized measurement atlas. Fixture approval flags suppress write blocking
// only here; they are never user approvals or copied to the production manifest.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { PNG } from 'pngjs';
const dir = 'art/characters/killua/production/round4';
const m = JSON.parse(fs.readFileSync('art/manifest.json'));
const names = ['idle', 'guard', 'superDash', 'jumpUp', 'jumpFall', 'airRecover', 'stagger', 'win', 'airLight1', 'airLight2'];
const versions = { idle: 11, guard: 9, superDash: 8, jumpUp: 5, jumpFall: 5, airRecover: 5, stagger: 7, win: 5, airLight1: 6, airLight2: 7 };
for (const [name,a] of Object.entries(m.characters.killua.animations)) {
  const files = fs.readdirSync('art/characters/killua/raw').filter(f => f.match(new RegExp('^'+name+'_v[0-9]+\\.png$')));
  a.approvedVersion = Math.max(...files.map(f => Number(f.match(/_v([0-9]+)/)[1])));
}
m.characters = { killua: { ...m.characters.killua, scaleGate: 'warn' } };
fs.writeFileSync(`${dir}/diagnostic-manifest.json`, JSON.stringify(m,null,2));
const out = `${dir}/diagnostic-public`;
const p = spawnSync(process.execPath,['tools/pack-sprites.mjs','killua','--quantize','48','--no-writeback','--manifest',`${dir}/diagnostic-manifest.json`,'--out',out],{encoding:'utf8'});
fs.writeFileSync(`${dir}/diagnostic-pack.txt`, p.stdout+p.stderr);
if(p.status) throw new Error('Diagnostic pack failed: '+p.status);
const meta=JSON.parse(fs.readFileSync(`${out}/characters/killua/anims.json`));
const sheet=PNG.sync.read(fs.readFileSync(`${out}/characters/killua/sheet.png`));
for(const name of names){
 if(meta.scaleAudit.anims[name].v!==versions[name]) throw new Error('Inventory mismatch '+name);
 const ids=meta.animations[name].frames;
 const montage=new PNG({width:(ids.length+2)*256,height:256});
 const combat=PNG.sync.read(fs.readFileSync('art/characters/killua/reference/title_style_combat_cell_v01.png'));
 PNG.bitblt(combat,montage,0,0,256,256,0,0);
 const idle=meta.animations.idle.frames[0];
 PNG.bitblt(sheet,montage,idle%16*256,Math.floor(idle/16)*256,256,256,256,0);
 for(const [i,id] of ids.entries()){
  PNG.bitblt(sheet,montage,id%16*256,Math.floor(id/16)*256,256,256,(i+2)*256,0);
  const cell=new PNG({width:256,height:256});
  PNG.bitblt(sheet,cell,id%16*256,Math.floor(id/16)*256,256,256,0,0);
  fs.writeFileSync(`${dir}/${name}-${i}.png`,PNG.sync.write(cell));
 }
 fs.writeFileSync(`${dir}/${name}-comparison.png`,PNG.sync.write(montage));
}
console.log('Wrote labelled diagnostic quantized atlas and native comparison cells; this is not a strict pass.');


