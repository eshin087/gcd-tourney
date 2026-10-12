import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { PNG } from 'pngjs';
import { loadPacked } from '../../../../../../tools/scale-audit.mjs';
const dir = path.resolve('art/characters/sasuke/production/title-style/round2');
const jobs = JSON.parse(fs.readFileSync(path.join(dir, 'jobs.json')));
const manifest = JSON.parse(fs.readFileSync('art/manifest.json'));
const args = process.argv.slice(2), target = args[0];
const mode = args[1] || 'strict';
const job = jobs.jobs.find(j => j.asset === target);
if (!job) throw Error('Unknown owned asset');
const ver = `v${String(job.version).padStart(2,'0')}`;
const fixture = path.join(dir, 'fixtures', target);
const out = path.join(dir, 'packs', target, mode);
const m = structuredClone(manifest);
m.characters = { sasuke: structuredClone(manifest.characters.sasuke) };
m.characters.sasuke.animations = Object.fromEntries(['idle', target].map(k => [k, structuredClone(manifest.characters.sasuke.animations[k])]));
m.characters.sasuke.animations[target].version = job.version;
if (job.bodyHeight) m.characters.sasuke.animations[target].bodyHeight = job.bodyHeight;
if (mode === 'diagnostic') { m.spec.scaleGate = { ...m.spec.scaleGate, mode: 'warn' }; m.characters.sasuke.animations[target].approvedVersion = job.version; }
delete m.characters.sasuke.ui;
delete m.characters.sasuke.reference;
const raw = path.join(fixture, 'characters', 'sasuke', 'raw');
fs.mkdirSync(raw, {recursive:true});
fs.mkdirSync(path.join(fixture,'scale'),{recursive:true});
fs.writeFileSync(path.join(fixture,'manifest.json'), JSON.stringify(m,null,2));
fs.copyFileSync('art/scale/builds.json',path.join(fixture,'scale/builds.json'));
for (const [a,v] of [['idle','v07'],[target,ver]]) {
  for (const ext of ['png','json']) {
    const source=`art/characters/sasuke/raw/${a}_${v}.${ext}`;
    const dest=path.join(raw,`${a}_${v}.${ext}`);
    if (fs.existsSync(source)) fs.copyFileSync(source,dest);
    else if (fs.existsSync(dest)) fs.unlinkSync(dest);
  }
}
const command=['tools/pack-sprites.mjs','sasuke','--quantize','48', ...(mode==='strict'?['--strict-scale']:[]),'--root',fixture,'--out',out,'--no-writeback'];
const r = spawnSync(process.execPath,command,{encoding:'utf8'});
fs.mkdirSync(path.join(dir,'reports'),{recursive:true});
fs.writeFileSync(path.join(dir,'reports',`${target}-${mode}.txt`),`exit ${r.status}\nnode ${command.join(' ')}\n${r.stdout}${r.stderr}`);
console.log(r.stdout,r.stderr,`EXIT ${r.status}`);
if (fs.existsSync(path.join(out,'characters/sasuke/anims.json'))) {
  const p=loadPacked('sasuke',out);
  const cells=p.anims.find(a=>a.name===target).cells;
  const contact=new PNG({width:256*(cells.length+1),height:256});
  const idle=p.anims.find(a=>a.name==='idle').cells[0];
  for(const [i,c] of [idle,...cells].entries()) for(let y=0;y<256;y++) contact.data.set(c.data.subarray(y*1024,(y+1)*1024),y*contact.width*4+i*1024);
  fs.writeFileSync(path.join(dir,`${target}_${ver}_${mode}-native.png`),PNG.sync.write(contact));
  fs.writeFileSync(path.join(dir,'reports',`${target}-${mode}-audit.json`),JSON.stringify(p.meta.scaleAudit,null,2));
}
