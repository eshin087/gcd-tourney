import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const evidenceRoot = path.join(root, 'art/characters/goku/production/scale-qa/pilot-v01/fixture-output');
const gallery = path.join(root, 'public/characters/goku/calibration-r2');
const mkdir = (dir) => fs.mkdirSync(dir, { recursive: true });
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const copy = (source, relative) => {
  const target = path.join(gallery, relative);
  mkdir(path.dirname(target));
  if (!fs.existsSync(target)) fs.copyFileSync(source, target);
  else if (hash(target) !== hash(source)) throw new Error(`Refusing to replace different gallery file: ${target}`);
  return { file: relative.replaceAll('\\', '/'), sha256: hash(target), bytes: fs.statSync(target).size };
};
mkdir(gallery);
const files = [];
for (const mode of ['current', 'native-height']) {
  const src = path.join(evidenceRoot, mode);
  for (const anim of ['guard', 'light2']) {
    const frameDir = path.join(src, 'frames', anim);
    for (const filename of fs.readdirSync(frameDir).sort()) files.push(copy(path.join(frameDir, filename), `assets/${mode}/frames/${anim}/${filename}`));
    files.push(copy(path.join(src, 'contacts', `${anim}-one-density.png`), `assets/${mode}/contacts/${anim}-one-density.png`));
  }
  files.push(copy(path.join(src, 'strict-report.json'), `reports/${mode}-strict-report.json`));
  files.push(copy(path.join(src, 'render-report.json'), `reports/${mode}-render-report.json`));
  files.push(copy(path.join(src, 'characters/goku/sheet.png'), `reports/${mode}-atlas.png`));
  files.push(copy(path.join(src, 'characters/goku/anims.json'), `reports/${mode}-anims.json`));
  files.push(copy(path.join(src, 'diagnostic-manifest.json'), `reports/${mode}-diagnostic-manifest.json`));
}
for (const [source, target] of [
  ['references/title-neutral-v02.png', 'assets/references/title-neutral-v02.png'],
  ['references/title-combat-v02.png', 'assets/references/title-combat-v02.png'],
  ['contacts/approved-reference-lineup.png', 'assets/references/approved-reference-lineup.png'],
  ['references/idle_v02.png', 'assets/references/idle_v02.png'],
  ['references/idle_approved.png', 'assets/references/idle_approved.png'],
  [path.join(root, 'art/characters/goku/reference/title_style_draft.png'), 'assets/references/title_style_draft-v02.png'],
  ['references/title_style_lineup_v02.png', 'assets/references/title_style_lineup-v02.png']
]) files.push(copy(path.isAbsolute(source) ? source : path.join(evidenceRoot, source), target));
for (const name of ['guard_v05.png', 'light2_v05.png', 'guard_v05.json', 'light2_v05.json']) files.push(copy(path.join(root, 'art/characters/goku/raw', name), `assets/raw/${name}`));
files.push(copy(path.join(evidenceRoot, 'inventory.json'), 'reports/inventory.json'));
files.push(copy(path.join(evidenceRoot, 'packed-frames.json'), 'reports/packed-frames.json'));
files.push(copy(path.join(root, 'art/characters/goku/production/scale-qa/strict-pack-report.json'), 'reports/production-strict-pack-report.json'));

const data = {
  title: 'Goku pilot calibration r2 — HOLD',
  label: 'DIAGNOSTIC ONLY · no production pass · no approval change',
  branch: 'art/goku-core',
  sourceCommit: 'ec37e3ae3eb2a97aa3e9afc54d8b4ee14a1ec694',
  modes: {
    current: { label: 'Current manifest settings', bodyHeight: { guard: 198, light2: 204 }, packFactor: { guard: 0.86463, light2: 0.86441 }, use: 'Warn-mode isolated render of current production settings. The strict pack refused to write an atlas.' },
    'native-height': { label: 'Native-height diagnostic fixture', bodyHeight: { guard: 229, light2: 236 }, packFactor: { guard: 1, light2: 1 }, use: 'Private fixture only. Body heights equal measured max occupied source frame heights; not a production bodyHeight proposal.' }
  },
  animationTiming: { guard: { loop: true, durationsMs: [300, 300] }, light2: { loop: false, durationsMs: [35, 30, 40, 50, 60, 50, 30] } },
  files,
  refs: {
    inventory: 'reports/inventory.json', packedFrames: 'reports/packed-frames.json', strictReport: 'reports/production-strict-pack-report.json',
    referenceLineup: 'assets/references/approved-reference-lineup.png'
  }
};
fs.writeFileSync(path.join(gallery, 'data.json'), JSON.stringify(data, null, 2) + '\n');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Goku calibration r2 — HOLD</title>
<style>
:root{color-scheme:dark;font:16px system-ui,sans-serif;background:#141316;color:#f2eff4}body{margin:0 auto;max-width:1150px;padding:24px}h1{margin:0 0 8px}h2{margin:24px 0 10px}p{line-height:1.45}.hold{padding:14px;border:2px solid #edaf46;background:#35270f;color:#ffdf9a;font-weight:700}.panel{background:#211f24;border:1px solid #49454d;border-radius:8px;padding:16px;margin:16px 0}.controls{display:flex;gap:12px;flex-wrap:wrap;align-items:center}button,select{font:inherit;padding:8px 10px;background:#37343b;color:#fff;border:1px solid #716b76;border-radius:5px}img.pixel{image-rendering:pixelated;background:#ff00ff;max-width:100%;height:auto}.frame{width:256px;height:256px;object-fit:contain}.zoom{width:768px;height:768px;max-width:min(100%,768px);object-fit:contain}.row{display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap}.small{color:#c8c2cf;font-size:.9rem}.badge{display:inline-block;padding:3px 8px;background:#453719;border-radius:4px;color:#ffdf9a}.report{white-space:pre-wrap;word-break:break-word}.refs{display:flex;gap:8px;overflow:auto}.refs img{width:256px;height:256px;image-rendering:pixelated;background:#ff00ff}.frames{display:flex;gap:8px;overflow:auto}.frames img{width:128px;image-rendering:pixelated;background:#ff00ff}a{color:#a9d7ff}
</style></head><body>
<h1>Goku pilot calibration r2</h1><p class="hold">HOLD — diagnostic packed frames for Astra review. The production strict pack failed; the head probe is known invalid. Nothing here records approval, a scale pass, or production calibration.</p>
<div class="panel"><h2>Comparison setup</h2><p>Only guard v05 and light2 v05 are included. Source images are unchanged. Each display cell is an exact 256×256 crop from a 48-color quantized diagnostic atlas. The contacts place approved idle f0 beside every frame at one displayed density, with guides at idle hair top and y=240.</p><p><b>Current manifest mode:</b> bodyHeight guard 198, light2 204; pack factors 0.86463 and 0.86441. This reproduces the additional shrinkage in current production settings, rendered with isolated warn-only diagnostics after strict refusal.</p><p><b>Native-height mode:</b> fixture-only bodyHeight guard 229, light2 236; pack factor 1.0. This isolates the reassembled source density. These fixture values do not change the production manifest.</p><p>Approved comparisons: idle v02; title-style neutral and combat v02. <a href="assets/references/approved-reference-lineup.png">Open exact one-density reference lineup</a>. Original files and hashes are listed in <a href="reports/inventory.json">inventory.json</a> and <a href="reports/packed-frames.json">packed-frames.json</a>.</p></div>
<div class="panel"><h2>Timed playback and replay</h2><div class="controls"><label>Pack view <select id="mode"><option value="native-height">Native-height diagnostic</option><option value="current">Current manifest settings</option></select></label><label>Animation <select id="anim"><option value="guard">guard v05 · loops</option><option value="light2">light2 v05 · one-shot</option></select></label><button id="play">Pause</button><button id="replay">Replay from frame 0</button><span id="timing" class="small"></span></div><div class="row"><div><p class="small">Native 256 × 256 pixel crop</p><img id="native" class="pixel frame" alt="Current packed frame"></div><div><p class="small">Nearest-neighbor enlargement, 3×</p><img id="zoom" class="pixel zoom" alt="Current packed frame enlarged"></div></div><div id="frameStrip" class="frames"></div><p id="caption" class="small"></p></div>
<div class="panel"><h2>One-density contacts</h2><div class="controls"><label>Pack view <select id="contactMode"><option value="native-height">Native-height diagnostic</option><option value="current">Current manifest settings</option></select></label><label>Animation <select id="contactAnim"><option value="guard">guard v05</option><option value="light2">light2 v05</option></select></label></div><img id="contact" class="pixel" alt="Idle beside all frames at a common density"></div>
<div class="panel"><h2>Approved neutral and combat reference cells</h2><img class="pixel" style="width:768px;image-rendering:pixelated" src="assets/references/approved-reference-lineup.png" alt="Approved idle, neutral, and combat cells"><p class="small">Order: approved idle v02 f0, title-style neutral v02, title-style combat v02. Exact originals and hashes are linked in the inventory.</p></div>
<div class="panel"><h2>Evidence</h2><ul><li><a href="reports/production-strict-pack-report.json">Strict production pack report</a></li><li><a href="reports/current-strict-report.json">Isolated current-settings strict report</a></li><li><a href="reports/native-height-strict-report.json">Isolated native-height strict report</a></li><li><a href="reports/current-render-report.json">Current-settings diagnostic render report</a></li><li><a href="reports/native-height-render-report.json">Native-height diagnostic render report</a></li><li><a href="reports/current-anims.json">Current atlas metadata</a> · <a href="reports/native-height-anims.json">Native-height atlas metadata</a></li><li><a href="reports/inventory.json">Input/settings/tool hashes</a> · <a href="reports/packed-frames.json">Exact crop paths, hashes, bounds and durations</a></li></ul><p class="small">Old launched/down/getup raw-only manual records are not part of this pilot audit. The production strict report may still list them; this page's audit scope is only guard v05 and light2 v05.</p></div>
<script>
fetch('data.json').then(r=>r.json()).then(data=>{
 const $=id=>document.getElementById(id), mode=$('mode'), anim=$('anim'), native=$('native'), zoom=$('zoom'), play=$('play'), replay=$('replay'), timing=$('timing'), caption=$('caption'), strip=$('frameStrip');
 let timer=null,index=0,playing=true;
 const seq=()=>data.animationTiming[anim.value];
 function frameUrl(m,a,i){return 'assets/'+m+'/frames/'+a+'/f'+String(i).padStart(2,'0')+'.png'}
 function render(){const m=mode.value,a=anim.value,n=seq(),file=frameUrl(m,a,index);native.src=file;zoom.src=file;timing.textContent='Frame '+(index+1)+'/'+n.durationsMs.length+' · '+n.durationsMs[index]+' ms · '+(n.loop?'looping':'one-shot');caption.textContent=data.modes[m].label+'; guard and light2 are exact candidates v05.';strip.innerHTML='';for(let i=0;i<n.durationsMs.length;i++){const im=document.createElement('img');im.src=frameUrl(m,a,i);im.alt=a+' frame '+i;im.onclick=()=>{index=i;start()};strip.append(im)}}
 function start(){clearTimeout(timer);render();if(!playing)return;timer=setTimeout(()=>{const n=seq();if(index+1<n.durationsMs.length)index++;else if(n.loop)index=0;else{playing=false;play.textContent='Play';render();return}start()},seq().durationsMs[index])}
 function reset(){index=0;start()}
 mode.onchange=reset;anim.onchange=()=>{index=0;reset()};play.onclick=()=>{playing=!playing;play.textContent=playing?'Pause':'Play';start()};replay.onclick=()=>{playing=true;play.textContent='Pause';index=0;start()};
 for(const id of ['contactMode','contactAnim'])$(id).onchange=()=>{$('contact').src='assets/'+$('contactMode').value+'/contacts/'+$('contactAnim').value+'-one-density.png'};
 $('contact').src='assets/native-height/contacts/guard-one-density.png';reset();
});
</script></body></html>`;
fs.writeFileSync(path.join(gallery, 'index.html'), html);
fs.writeFileSync(path.join(gallery, 'gallery-files.json'), JSON.stringify({ label: 'Review-only gallery files; exact copied pixels with hashes.', files }, null, 2) + '\n');
console.log(JSON.stringify({ gallery: path.relative(root, gallery).replaceAll('\\', '/'), copiedFiles: files.length, page: path.relative(root, path.join(gallery, 'index.html')).replaceAll('\\', '/') }, null, 2));
