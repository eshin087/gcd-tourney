import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const root=process.cwd();
const inv=path.join(root,'art/vfx/production/spell-fx-r2/references');
function copyDir(from,to){
  fs.mkdirSync(to,{recursive:true});
  for(const name of fs.readdirSync(from)){
    const src=path.join(from,name),dst=path.join(to,name);
    if(fs.statSync(src).isFile()&&!fs.existsSync(dst))fs.copyFileSync(src,dst);
  }
}
copyDir(path.join(root,'art/vfx/frames/gigantArm'),path.join(inv,'gigantArm_v02_packed'));
copyDir(path.join(root,'art/vfx/frames/gigantFist'),path.join(inv,'gigantFist_v02_packed'));
copyDir(path.join(inv,'gigantArm_v01'),path.join(root,'art/vfx/frames/gigantArm'));
console.log('Archived all candidate arm/fist packed frames; restored the approved gigantArm v01 cells.');
