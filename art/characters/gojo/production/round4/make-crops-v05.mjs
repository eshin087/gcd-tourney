import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
const base = 'art/characters/gojo/production/round4';
const q = path.join(base, 'diagnostic-v05-public/characters/gojo');
const sheet = PNG.sync.read(fs.readFileSync(path.join(q, 'sheet.png')));
const meta = JSON.parse(fs.readFileSync(path.join(q, 'anims.json'), 'utf8'));
const approved = PNG.sync.read(fs.readFileSync('public/characters/gojo/sheet.png'));
const approvedMeta = JSON.parse(fs.readFileSync('public/characters/gojo/anims.json', 'utf8'));
const combat = PNG.sync.read(fs.readFileSync('public/art-review/title-style-pilot/gojo-combat_v01.png'));
const idleId = approvedMeta.animations.idle.frames[0];
const cell = (image, id) => {
  const out = new PNG({ width: 256, height: 256 });
  PNG.bitblt(image, out, (id % 16) * 256, Math.floor(id / 16) * 256, 256, 256, 0, 0);
  return out;
};
const selected = ['jumpFall','throw','airLight1','airRecover','airLight2','light3','guard','jumpUp','airLight3','hurtLow'];
for (const name of selected) {
  const ids = meta.animations[name].frames;
  const frames = [cell(approved, idleId), combat, ...ids.map(id => cell(sheet, id))];
  const out = new PNG({ width: frames.length * 512, height: 512 });
  frames.forEach((frame, index) => {
    for (let y=0; y<256; y++) for (let x=0; x<256; x++) {
      const src=(y*256+x)*4;
      const px=frame.data[src], py=frame.data[src+1], pz=frame.data[src+2], pa=frame.data[src+3];
      for(let dy=0;dy<2;dy++) for(let dx=0;dx<2;dx++) {
        const dst=(((y*2+dy)*out.width)+(index*512+x*2+dx))*4;
        out.data[dst]=px;out.data[dst+1]=py;out.data[dst+2]=pz;out.data[dst+3]=pa;
      }
    }
  });
  fs.writeFileSync(path.join(base, `${name}-round4-2x.png`), PNG.sync.write(out));
}
