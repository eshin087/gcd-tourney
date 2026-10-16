from PIL import Image, ImageDraw
from pathlib import Path
import json, sys, statistics, hashlib, subprocess, base64, shutil

root=Path(sys.argv[1]); cfg=json.loads(Path(sys.argv[2]).read_text()); out=root/'public/reviews/gojo-run-ghi'; out.mkdir(parents=True,exist_ok=True)
art=root/'art/characters/gojo/production/run-ghi'
bg=(17,23,38); allframes={}; metrics={}
def clean(im):
    im=im.convert('RGBA'); p=im.load()
    for y in range(im.height):
        for x in range(im.width):
            r,g,b,a=p[x,y]
            if r-g>35 and b-g>35 and r+b>200: p[x,y]=(0,0,0,0)
    # Remove disconnected background flecks; the entire full-body figure is one connected component.
    seen=set(); largest=[]
    for y in range(im.height):
        for x in range(im.width):
            if not p[x,y][3] or (x,y) in seen:continue
            stack=[(x,y)]; seen.add((x,y)); component=[]
            while stack:
                a,b=stack.pop();component.append((a,b))
                for dx,dy in ((1,0),(-1,0),(0,1),(0,-1),(1,1),(-1,-1),(1,-1),(-1,1)):
                    xx,yy=a+dx,b+dy
                    if 0<=xx<im.width and 0<=yy<im.height and (xx,yy) not in seen and p[xx,yy][3]:seen.add((xx,yy));stack.append((xx,yy))
            if len(component)>len(largest):largest=component
    keep=set(largest)
    for xy in seen:
        if xy not in keep:p[xy]=(0,0,0,0)
    box=im.getbbox()
    if not box: raise ValueError('empty frame')
    return im.crop(box)
def hair(im):
    pts=[]
    for y in range(min(im.height,round(im.height*.23))):
        for x in range(im.width):
            r,g,b,a=im.getpixel((x,y))
            if a and min(r,g,b)>120 and max(r,g,b)-min(r,g,b)<65:pts.append((x,y))
    if not pts:raise ValueError('no hair')
    xs,ys=zip(*pts); return [min(xs),min(ys),max(xs)+1,max(ys)+1]
ref=clean(Image.open(root/'public/art-review/title-style-pilot/gojo-neutral_v01.png')); hb=hair(ref); refw=hb[2]-hb[0]
for name,item in cfg.items():
    frames=[]; factors=[]; base_width=None
    for part in item['parts']:
        partframes=[]
        src=Image.open(part['file']); cols=part.get('cols',4); rows=part.get('rows',1)
        for index in part.get('indices',list(range(cols*rows))):
            col=index%cols; row=index//cols
            slot=src.crop((round(col*src.width/cols),round(row*src.height/rows),round((col+1)*src.width/cols),round((row+1)*src.height/rows)))
            partframes.append(clean(slot))
        mw=statistics.median([hair(f)[2]-hair(f)[0] for f in partframes])
        if base_width is None:base_width=mw
        factor=base_width/mw; factors.append(factor)
        # Match source-part pixel density using measured hair width; never fit poses individually.
        frames.extend([f.resize((round(f.width*factor),round(f.height*factor)),Image.Resampling.NEAREST) for f in partframes])
    assert len(frames)==8,(name,len(frames))
    widths=[hair(f)[2]-hair(f)[0] for f in frames]; heights=[f.height for f in frames]
    base_scale=min(refw/statistics.median(widths),234/max(heights))
    # Correct the whole strip from the measured quantized neutral-head audit.
    # Limit only for the 256-cell safety margin; never resize individual poses.
    scale=min(base_scale/item.get('diagnosticHeadRatio',1),234/max(heights))
    cells=[]; mm=[]; crown_y=241-round(max(heights)*scale)
    for i,f in enumerate(frames):
        f=f.resize((round(f.width*scale),round(f.height*scale)),Image.Resampling.NEAREST)
        h=hair(f); cx=(h[0]+h[2])/2
        cell=Image.new('RGBA',(256,256)); x=round(128-cx); y=crown_y
        cell.alpha_composite(f,(x,y)); box=cell.getbbox()
        assert box[0]>=4 and box[2]<=252 and box[1]>=4 and box[3]<=241,(name,i,box)
        cells.append(cell); mm.append({'frame':i,'bounds':box,'hairWidth':h[2]-h[0],'hairHeight':h[3]-h[1],'headCenterX':128,'crownY':box[1],'scale':scale})
    allframes[name]=cells; metrics[name]={'scale':scale,'diagnosticHeadRatio':item.get('diagnosticHeadRatio',1),'measuredDensityCorrection':scale/base_scale,'measuredPartFactors':factors,'placement':'fixed hair crown and head center; floor pivot remains [128,240]; foot lift retained','referenceHairWidth':refw,'frames':mm,'uniformScale':True,'noClipping':True,'anatomyStatus':'visual review required; hair geometry does not certify torso or legs'}
# One palette for the three review loops; preserve binary alpha and hard pixels.
mosaic=Image.new('RGB',(256*8,256*3),(255,0,255))
for row,(name,frames) in enumerate(allframes.items()):
    for i,f in enumerate(frames):mosaic.paste(f,(i*256,row*256),f)
pal=mosaic.quantize(colors=48,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE)
for name,frames in allframes.items():
    for i,f in enumerate(frames):
        rgb=Image.new('RGB',f.size,(255,0,255));rgb.paste(f,mask=f.getchannel('A'))
        q=rgb.quantize(palette=pal,dither=Image.Dither.NONE).convert('RGBA');q.putalpha(f.getchannel('A'));frames[i]=q
        fd=out/f'{name}_frames_v01';fd.mkdir(exist_ok=True);q.save(fd/f'frame_{i:02}.png')
    strip=Image.new('RGBA',(2048,256))
    contact=Image.new('RGB',(1024,560),bg); draw=ImageDraw.Draw(contact)
    for i,f in enumerate(frames):
        strip.alpha_composite(f,(i*256,0)); x=(i%4)*256;y=(i//4)*280
        contact.paste(f,(x,y+24),f);draw.text((x+12,y+7),f'{name} / frame {i}',fill='white')
    strip.save(out/f'{name}_strip_v01.png');contact.save(out/f'{name}_contact_v01.png')
    video=[]
    for i,f in enumerate(frames):
        stage=Image.new('RGB',(384,304),bg); d=ImageDraw.Draw(stage)
        d.rectangle((0,269,384,304),fill=(26,36,49));d.line((0,269,384,269),fill=(86,119,148),width=1)
        d.text((16,10),f'{name} - '+cfg[name]['title'],fill='white');d.text((16,29),f'frame {i} / 7   60 ms',fill=(143,168,186))
        stage.paste(f,(64,29),f);video.append(stage)
    video[0].save(out/f'{name}_loop_v01.gif',save_all=True,append_images=video[1:],duration=60,loop=0,disposal=2,optimize=False)
    vd=out/f'{name}_video_frames';vd.mkdir(exist_ok=True)
    for i,im in enumerate(video*8):im.save(vd/f'{i:03}.png')
    subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-framerate','50/3','-i',str(vd/'%03d.png'),'-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',str(out/f'{name}_loop_v01.mp4')],check=True)
    assert vd.resolve().is_relative_to(out.resolve());shutil.rmtree(vd)
comparison=[]
for i in range(8):
    im=Image.new('RGB',(1056,328),bg);d=ImageDraw.Draw(im)
    d.text((18,12),'GOJO / G H I - review candidates only',fill='white')
    for k,(name,frames) in enumerate(allframes.items()):
        x=k*352; d.text((x+20,38),name+' - '+cfg[name]['title'],fill=(171,209,235));d.line((x,301,x+352,301),fill=(85,122,156));im.paste(frames[i],(x+48,61),frames[i]);d.text((x+20,310),f'frame {i}',fill='white')
    comparison.append(im)
comparison[0].save(out/'GHI_comparison_v01.gif',save_all=True,append_images=comparison[1:],duration=60,loop=0,disposal=2,optimize=False)
sheet=Image.new('RGB',(2048,864),bg);d=ImageDraw.Draw(sheet)
for k,(name,frames) in enumerate(allframes.items()):
    y=k*288;d.text((14,y+7),name+' - '+cfg[name]['title'],fill='white')
    for i,f in enumerate(frames):sheet.paste(f,(i*256,y+24),f);d.text((i*256+10,y+272),str(i),fill='white')
sheet.save(out/'GHI_all_24_frames_v01.png')
for name in allframes:
    gif=Image.open(out/f'{name}_loop_v01.gif');assert gif.n_frames==8;assert gif.info['loop']==0
    metrics[name]['gif']={'frames':gif.n_frames,'durationMs':gif.info['duration'],'infiniteLoop':True}
    metrics[name]['mp4Decoded']=subprocess.run(['ffmpeg','-v','error','-i',str(out/f'{name}_loop_v01.mp4'),'-f','null','-'],capture_output=True).returncode==0
(out/'media-qa_v01.json').write_text(json.dumps(metrics,indent=2))
# Fully embedded images: file:// and localhost both work, no fetch or module dependency.
imgs={n:base64.b64encode((out/f'{n}_strip_v01.png').read_bytes()).decode() for n in allframes}
html='''<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gojo G H I review</title>
<style>body{background:#111726;color:#e9f0f5;font:16px system-ui;margin:24px}button,select{font:inherit;margin:8px;padding:8px}main{display:flex;flex-wrap:wrap;gap:20px}canvas{image-rendering:pixelated;width:320px;height:320px;background:#172235}article{width:320px}a{color:#9cd5ff}#state{font-variant-numeric:tabular-nums}</style>
<h1>Gojo G / H / I</h1><p>Review candidates only. New arm treatments following D. Eight-frame loops at game timing (60 ms/frame).</p>
<button id="play">Pause</button><button id="step">Next frame</button><select id="speed" aria-label="Playback speed"><option value="1">Normal</option><option value="0.5">Half speed</option><option value="0.25">Quarter speed</option></select><span id="state">Loading</span><main></main>
<script>const images=IMAGES,titles=TITLES;let loaded=0,frame=0,playing=true,speed=1,loops=0;const entries=[];
for(const name of ['G','H','I']){const a=document.createElement('article');a.innerHTML='<h2>'+name+' — '+titles[name]+'</h2><canvas width="256" height="256" aria-label="'+name+' animation"></canvas><p><a href="'+name+'_loop_v01.gif">GIF</a> · <a href="'+name+'_loop_v01.mp4">MP4</a> · <a href="'+name+'_contact_v01.png">All eight frames</a></p>';document.querySelector('main').append(a);const img=new Image();img.onload=()=>{loaded++;draw()};img.src='data:image/png;base64,'+images[name];entries.push({img,c:a.querySelector('canvas')})}
function draw(){if(loaded!==3)return;for(const {img,c} of entries){const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.clearRect(0,0,256,256);x.fillStyle='#172235';x.fillRect(0,0,256,256);x.fillStyle='#5c7c92';x.fillRect(0,240,256,1);x.drawImage(img,frame*256,0,256,256,0,0,256,256)}document.querySelector('#state').textContent='Loaded 3/3 · frame '+frame+'/7 · loops '+loops+' · '+(playing?'playing':'paused')}
function advance(){frame=(frame+1)%8;if(frame===0)loops++;draw()}
document.querySelector('#play').onclick=()=>{playing=!playing;document.querySelector('#play').textContent=playing?'Pause':'Play';draw()};document.querySelector('#step').onclick=()=>{playing=false;document.querySelector('#play').textContent='Play';advance()};document.querySelector('#speed').onchange=e=>{speed=Number(e.target.value)};let last=performance.now();function tick(t){if(playing&&loaded===3&&t-last>=60/speed){last=t;advance()}requestAnimationFrame(tick)}requestAnimationFrame(tick);</script>'''
html=html.replace('IMAGES',json.dumps(imgs)).replace('TITLES',json.dumps({n:i['title'] for n,i in cfg.items()}));(out/'demo_v01.html').write_text(html,encoding='utf-8')
print(json.dumps(metrics,indent=2))

