import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PNG } from 'pngjs';

const dir = path.resolve(process.argv[2] || 'art/characters/goku/production/preflight-v01');
const inventory = JSON.parse(fs.readFileSync(path.join(dir, 'inventory.json')));
const stageNames = ['current', 'native-control'];
const stages = Object.fromEntries(stageNames.map((name) => [name, {
  meta: JSON.parse(fs.readFileSync(path.join(dir, name, 'characters/goku/anims.json'))),
  sheet: PNG.sync.read(fs.readFileSync(path.join(dir, name, 'characters/goku/sheet.png'))),
  report: JSON.parse(fs.readFileSync(path.join(dir, name, 'strict-report.json'))).characters[0],
}]));
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const savePNG = (file, png) => {
  if (fs.existsSync(file)) throw new Error(`Refusing to overwrite ${file}`);
  fs.writeFileSync(file, PNG.sync.write(png));
};
const empty = (w, h) => {
  const p = new PNG({ width: w, height: h });
  for (let i = 0; i < p.data.length; i += 4) p.data.set([30, 28, 36, 255], i);
  return p;
};
function paste(src, sx, sy, dst, dx, dy, w = 256, h = 256) {
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const si = ((sy + y) * src.width + sx + x) * 4;
    const di = ((dy + y) * dst.width + dx + x) * 4;
    if (src.data[si + 3]) dst.data.set(src.data.subarray(si, si + 4), di);
  }
}
const nativeLineup = PNG.sync.read(fs.readFileSync('art/characters/goku/reference/title_style_lineup_v02.png'));
const refs = empty(768, 256);
paste(nativeLineup, 1024, 30, refs, 0, 0);
paste(nativeLineup, 1280, 30, refs, 256, 0);
paste(stages.current.sheet, 0, 0, refs, 512, 0);
savePNG(path.join(dir, 'references_v01.png'), refs);
fs.mkdirSync(path.join(dir, 'contacts'));
const summary = [];
for (const record of inventory.selected) {
  const contact = empty(256 * (record.frames + 1), 512);
  for (let row = 0; row < 2; row++) {
    const stage = stages[stageNames[row]];
    paste(stage.sheet, 0, 0, contact, 0, row * 256);
    stage.meta.animations[record.name].frames.forEach((index, f) => {
      paste(stage.sheet, index % 16 * 256, Math.floor(index / 16) * 256, contact, (f + 1) * 256, row * 256);
    });
  }
  savePNG(path.join(dir, `contacts/${record.name}_v${String(record.version).padStart(2, '0')}_comparison.png`), contact);
  const metrics = Object.fromEntries(stageNames.map((name) => {
    const s = stages[name], audit = s.meta.scaleAudit.anims[record.name];
    return [name, { scale: s.report.packed.find((p) => p.anim === record.name)?.scale,
      ...audit, warnings: s.report.warnings.filter((w) => w.startsWith(record.name + ':') || w.includes('scale gate: ' + record.name + ':')) }];
  }));
  summary.push({ ...record, metrics });
}
const data = { label: 'Diagnostic only. Held candidates, original thresholds; render uses warn mode.',
  stages: Object.fromEntries(stageNames.map((n) => [n, { meta: stages[n].meta, sheetSha256: sha(path.join(dir, n, 'characters/goku/sheet.png')), metaSha256: sha(path.join(dir, n, 'characters/goku/anims.json')) }])),
  summary };
fs.writeFileSync(path.join(dir, 'comparison.json'), JSON.stringify(data, null, 2) + '\n');
const html = `<!doctype html><html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Goku pipeline diagnosis</title>
<style>body{background:#17151c;color:#eee;font:16px system-ui;margin:24px}h1{font-size:24px}p{max-width:950px;line-height:1.5}.warning{color:#ffd36f}canvas,img{image-rendering:pixelated;max-width:none}article{border-top:1px solid #555;padding:16px 0}.row{display:flex;gap:16px;overflow:auto}.panel{flex-shrink:0;width:256px}.small{font-size:13px;color:#ccc}button{padding:8px}input{vertical-align:middle}summary{cursor:pointer}pre{white-space:pre-wrap;font-size:12px}label{margin-left:20px}</style>
<h1>Goku: source and measurement diagnosis</h1>
<p class="warning">Diagnostic only: includes held art. Rendering with gate warnings gives us pixels to inspect; it does not pass the strict gate, approve images, or clear release. No source art changed.</p>
<p>Left: approved idle. Middle: current template normalization. Right: assembled native-size control (the packer may cap tall poses at 237px). Run/light1 are non-native and remain at their original normalization. The right column is an experiment, not a proposed blanket calibration.</p>
<p>Approved title neutral, combat, then current idle at one pixel density:</p><div class="row"><img src="references_v01.png" width="768" height="256"></div>
<p><button id="play">Pause</button><label><input type="checkbox" id="boxes" checked>Show checker’s head boxes</label></p><div id="cards"></div>
<script>const D=${JSON.stringify(data).replaceAll('<','\\u003c')};let playing=true;document.querySelector('#play').onclick=e=>{playing=!playing;e.target.textContent=playing?'Pause':'Play'};const images={};const names=['current','native-control'];for(const n of names){images[n]=new Image();images[n].src=n+'/characters/goku/sheet.png'}const cards=[];for(const r of D.summary){const a=document.createElement('article');const h=document.createElement('h2');h.textContent=r.name+' v'+String(r.version).padStart(2,'0');a.append(h);const info=document.createElement('p');info.className='small';info.textContent='Pack scale: '+r.metrics.current.scale+' → '+r.metrics['native-control'].scale+'; current head ratios '+JSON.stringify(r.metrics.current.frames)+'; source '+r.dimensions.join('×');a.append(info);const row=document.createElement('div');row.className='row';const canvases=[];for(const name of ['Approved idle','Current pack','Native-size control']){const p=document.createElement('div');p.className='panel';p.append(name);const c=document.createElement('canvas');c.width=c.height=256;p.append(c);row.append(p);canvases.push(c)}a.append(row);const slider=document.createElement('input');slider.type='range';slider.min=0;slider.max=r.frames-1;slider.value=0;a.append(slider);const f=document.createElement('span');a.append(f);const details=document.createElement('details'),s=document.createElement('summary');s.textContent='Recorded warnings';details.append(s);const pre=document.createElement('pre');pre.textContent=JSON.stringify({current:r.metrics.current.warnings,native:r.metrics['native-control'].warnings},null,2);details.append(pre);a.append(details);document.querySelector('#cards').append(a);cards.push({r,canvases,slider,f})}
function draw(c,stage,anim,k){const meta=D.stages[stage].meta;const a=meta.animations[anim],idx=a.frames[k%a.frames.length];const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle='#211f29';x.fillRect(0,0,256,256);if(images[stage].complete)x.drawImage(images[stage],(idx%16)*256,Math.floor(idx/16)*256,256,256,0,0,256,256);x.strokeStyle='#62715c';x.beginPath();x.moveTo(0,240.5);x.lineTo(256,240.5);x.stroke();const b=meta.scaleAudit.anims[anim].boxes[k%a.frames.length];if(document.querySelector('#boxes').checked&&b){x.strokeStyle='#00ffff';x.strokeRect(b[0]-.5,b[1]-.5,b[2]-b[0]+1,b[3]-b[1]+1)}}let last=0;function tick(t){if(t-last>120){last=t;for(const c of cards){if(playing)c.slider.value=(+c.slider.value+1)%c.r.frames;const k=+c.slider.value;c.f.textContent=' frame '+k;draw(c.canvases[0],'current','idle',0);draw(c.canvases[1],'current',c.r.name,k);draw(c.canvases[2],'native-control',c.r.name,k)}}requestAnimationFrame(tick)}requestAnimationFrame(tick);</script></html>`;
fs.writeFileSync(path.join(dir, 'index.html'), html);
console.log(`Wrote comparison.json, 23 exact-pixel contact sheets, references and index.html in ${dir}`);
