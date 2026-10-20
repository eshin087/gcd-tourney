const moves=[
 ['fTilt','light2','Head-to-body balance and segment calibration unresolved; the .905–.931 head-region proxy does not show a uniformly small figure. Both versions show a forward punch/retraction.'],
 ['uTilt','heavy','Head/build mismatch needs landmark calibration; sleeve overlap makes the .910 probe unreliable. Active f2/f3 upward punches are visible; no measured segment pass.'],
 ['dTilt','light3','f2 fist is clipped; f3 retracts before the required second low poke. Visible head/build appears enlarged. v01 holds both low active poses and merits a controlled pack comparison.'],
 ['dashAttack','light4','Both active frames are cropped, losing face/front contact. Do not read .595 as a size pop; all versions lack a clearly extended front blow.'],
 ['fSmash','light4','Head/build appear enlarged vs idle; charge and forward strike read clearly, but no complete segment measurement supports a scale pass.'],
 ['uSmash','heavy','Visibly reduced build/leg/shoe silhouette; overhead strike is present. The .558 head probe is occluded and does not mean a half-sized head.'],
 ['dSmash','light3','Visibly enlarged head/build; active f3/f4 clip left, so both-sided contact is incomplete.'],
 ['fair','airLight2','Head appears enlarged relative to feet/body; right margin is very tight. v02/v03 are more compact than v01; equal-density packing is needed to compare reach.'],
 ['bair','airLight3','Head appears enlarged relative to footwear; the rear strike correctly travels left behind the body.'],
 ['uair','airHeavy','Small footwear and occluded head measurements leave limb scale uncertain. The active pose is an above-head punch, which misses the requested true up-kick brief.']
];
const diagnostic='diagnostic-atlas/characters/naruto/';
const production='../../characters/naruto/';
const $=s=>document.querySelector(s);
const image=(src)=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src});
function cell(meta,index){const pageFrames=meta.pageFrames||256,page=Math.floor(index/pageFrames),inPage=index%pageFrames;return{page,x:(inPage%meta.columns)*meta.frameWidth,y:Math.floor(inPage/meta.columns)*meta.frameHeight,w:meta.frameWidth,h:meta.frameHeight}}
function makeCanvas(parent,label,scale=1){const box=document.createElement('div');box.className='box';const cap=document.createElement('strong');cap.textContent=label;const c=document.createElement('canvas');c.width=256*scale;c.height=256*scale;box.append(cap,c);parent.append(box);return c}
function drawCell(ctx,img,meta,index,scale=1){const r=cell(meta,index);ctx.clearRect(0,0,256*scale,256*scale);ctx.imageSmoothingEnabled=false;ctx.drawImage(img[r.page],r.x,r.y,r.w,r.h,0,0,256*scale,256*scale)}
function animate(canvas,imgs,meta,anim){const c=canvas.getContext('2d'),frames=anim.frames,durs=anim.durations||frames.map(()=>100);let frame=0,ts=0;function tick(now){if(!ts)ts=now;if(now-ts>=durs[frame]){ts=now;frame=(frame+1)%frames.length}drawCell(c,imgs,meta,frames[frame]);requestAnimationFrame(tick)}requestAnimationFrame(tick)}
async function main(){
 const meta=await (await fetch(diagnostic+'anims.json')).json(), live=await (await fetch(production+'anims.json')).json();
 const diagImgs=await Promise.all(meta.pages.map(p=>image(diagnostic+p))),livePages=(live.pages||['sheet.png']).map(p=>p);const liveImgs=await Promise.all(livePages.map(p=>image(production+p)));
 const idle=makeCanvas($('#lineup'),'idle f0');drawCell(idle.getContext('2d'),diagImgs,meta,meta.animations.idle.frames[0]);
 for(const [move,fallback,reason] of moves){const a=meta.animations[move],phase=a.phases||[0,Math.floor(a.frames.length/3),a.frames.length-Math.floor(a.frames.length/3)],activeStart=phase[0],activeIndex=a.frames[Math.min(activeStart,a.frames.length-1)],stand=live.animations[fallback];const cand=makeCanvas($('#lineup'),move+' · active');drawCell(cand.getContext('2d'),diagImgs,meta,activeIndex);const sb=makeCanvas($('#lineup'),fallback+' · stand-in');drawCell(sb.getContext('2d'),liveImgs,live,stand.frames[Math.min(activeStart,stand.frames.length-1)]);
 const card=document.createElement('article');card.className='card';card.id=move;card.innerHTML=`<h2>${move} — technical hold</h2><p class="state">${reason}</p><p class="small"><a href="astra-evidence/${move}.png">Astra native-cell/reference evidence</a> · <a href="astra-evidence/${move}-source-history.jpg">source history</a></p><div class="columns"></div><h3>Quantized candidate frames · ${a.frames.length} cells</h3><div class="frames"></div><h3>Every saved source version</h3><div class="versions"></div>`;$('#moves').append(card);const cols=card.querySelector('.columns');const idleC=makeCanvas(cols,'approved idle f0');drawCell(idleC.getContext('2d'),diagImgs,meta,meta.animations.idle.frames[0]);const candLoop=makeCanvas(cols,'latest quantized candidate loop');animate(candLoop,diagImgs,meta,a);const standC=makeCanvas(cols,`production stand-in: ${fallback}`);animate(standC,liveImgs,live,stand);
 const fs=card.querySelector('.frames');a.frames.forEach((n,i)=>{const c=document.createElement('canvas');c.width=c.height=128;c.title=`${move} packed candidate frame ${i} (atlas cell ${n})`;fs.append(c);drawCell(c.getContext('2d'),diagImgs,meta,n,.5)});
 const vs=card.querySelector('.versions');for(let v=1;v<=3;v++){const src=`candidates/${move}_v${String(v).padStart(2,'0')}.webp`;try{await image(src);const div=document.createElement('div');div.className='ver';div.innerHTML=`<strong>v${String(v).padStart(2,'0')} · technical hold</strong><br><img class="strip" src="${src}" alt="${move} version ${v} source strip"><br><a href="${src}">open source strip</a>`;vs.append(div)}catch{}}
 }
}
main().catch(e=>{document.body.insertAdjacentHTML('beforeend',`<p class="hold">Review renderer failed: ${e}</p>`)})
