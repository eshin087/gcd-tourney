import fs from 'node:fs';
const base='art/characters/sasuke/production/round4';
// Crown points are visible upper hair tips in the native-cell head ROI (see crown-probe).
// Chin points are manually located outer jaw turns on the 3x coordinate crops, not scalp guesses.
// 5-7px total axis uncertainty includes multiple equal-height hair tips and +/-2px chin location.
const baseline={
  superDash:[[172,135,190,172,5],[173,134,190,169,5]],
  jumpSquat:[[174,80,195,115,5]],
  beamFire:[[131,45,151,82,6],[129,45,149,82,6],[132,44,152,82,5]],
  dash:[[214,83,228,119,6],[219,84,235,122,6]],
  run:[[157,97,177,134,5],[157,97,177,136,5],[157,97,176,134,5],[156,101,176,139,5],[159,100,178,137,5],[158,102,176,139,5],[157,97,175,134,5],[157,104,176,141,5]],
  airLight3:[[149,49,163,86,7],[98,57,116,93,5],[51,114,80,150,5],[71,114,98,151,5],['Head turned away; back view hides chin'],[157,78,176,115,5]],
  specialUp:[[160,113,178,153,5],[154,61,174,101,5],[133,71,151,109,5],[130,59,150,97,5],['Raised navy guards cover upper crown; visible lower hair is not crown'],['Raised forearm meets and covers upper crown; probe includes forearm']],
  hurtLow:[[162,99,172,142,6],[142,85,157,128,6],[125,76,140,117,5]],
  airRecover:[[83,125,111,159,6],['Inverted curled head: crown near(125,237), chin near(112,213), 27+/-10px; forearm/jaw overlap and hair rotation make this inconclusive'],[128,63,140,103,6]],
};
const candidate={
  superDash:[[185,99,206,132,7],[179,98,201,133,7]],
  jumpSquat:[[165,80,187,116,5]],
  beamFire:[[120,75,135,114,6],[121,74,137,113,6],[119,75,134,114,6]],
  dash:[[218,83,234,122,7],[218,84,234,121,7]],
};
const idle={crown:[110,65],chin:[128,104],axis:Math.hypot(18,39),uncertainty:5};
const table=['## Visible crown-to-chin axes (native cell px, hair included)','',
  'Round4 uses the **visible hair crown to chin**, not the hidden skull. This corrects the earlier interpretation. Crown coordinates select an actual top-row hair pixel; multiple equally high spikes are explicitly included in the 5-7px **total axis** uncertainty. Chin coordinates are manual outer-jaw turns at +/-2px per coordinate. Axis length is Euclidean distance between the points. This is a distinct measurement from the automatic H column. Idle f0: crown(110,65), chin(128,104), axis42.95+/-5px. Broad intervals overlap the +/-6% boundary and establish no pass. No body segments or contacts were inferred from H.','',
  '| atlas / strip / frame | crown (x,y) | chin (x,y) | axis px | ratio interval to idle | result / visibility |','|---|---|---|---:|---|---|'];
const records=[];
for(const [atlas,items]of Object.entries({baseline,candidate}))for(const [anim,list]of Object.entries(items))for(const [frame,a]of list.entries()){
  if(typeof a[0]==='string'){table.push(`| ${atlas} ${anim} f${frame} | skipped | skipped | uncertain | unmeasured | ${a[0]} |`);records.push({atlas,anim,frame,skip:a[0]});continue;}
  const[cx,cy,jx,jy,u]=a;const axis=Math.hypot(jx-cx,jy-cy);const lo=(axis-u)/(idle.axis+idle.uncertainty),hi=(axis+u)/(idle.axis-idle.uncertainty);
  table.push(`| ${atlas} ${anim} f${frame} | (${cx},${cy}) | (${jx},${jy}) | ${axis.toFixed(2)} +/-${u} | ${lo.toFixed(3)}..${hi.toFixed(3)} | Inconclusive; crown-tip / jaw uncertainty |`);
  records.push({atlas,anim,frame,crown:[cx,cy],chin:[jx,jy],axis,axisUncertainty:u,ratioInterval:[lo,hi],result:'inconclusive'});
}
fs.writeFileSync(base+'/visible-head-landmarks.json',JSON.stringify({idle,method:'Manually read outer visible jaw and actual upper hair tip in native atlas; Euclidean axis, broad endpoint ambiguity included; no scalp interpolation',records},null,2));
let audit=fs.readFileSync(base+'/SEGMENT_AUDIT.md','utf8').split('## Visible crown-to-chin axes')[0];
audit=audit.replace(/The head-probe numbers below[\s\S]*?The approved combat cell is included on both body sheets at its original density\./,'The H column is the automatic hair silhouette probe. The separate visible crown-to-chin coordinate table below measures the round4 head axis including hair; no hidden scalp interpolation is needed. The approved combat cell is included on both body sheets at its original density.');
audit=audit.replace('The +/-1px interval allows uncertainty at each extreme as a total length uncertainty.','The integer opaque-pixel bounds are deterministic. The +/-1px total length interval allocates +/-0.5px subpixel edge location to each endpoint; it does not mean +/-1px at each endpoint. Rotated/partial silhouettes are skipped rather than assigned that small error budget.');
const final=JSON.parse(fs.readFileSync(base+'/pack-final.json')).characters[0].scale.anims;
const idx=audit.indexOf('## Selected diagnostic candidates');let before=audit.slice(0,idx),after=audit.slice(idx);
after=after.replace(/\| (\w+) v\d+ \/ (\d+) \| [^|]+ \|/g,(match,a,f)=>match.replace(/\| [^|]+ \|$/,`| ${final[a]?.frames?.[+f]??'low'}${a==='jumpSquat'?', low confidence':''} |`));
audit=before+after;
audit=audit.replace(/Hidden skull\/joints/g,'Covered joints');
audit+='\n\n'+table.join('\n')+'\n';
fs.writeFileSync(base+'/SEGMENT_AUDIT.md',audit);fs.copyFileSync(base+'/SEGMENT_AUDIT.md','public/reviews/sasuke-round4/audit.md');
let review=fs.readFileSync('art/REVIEW.md','utf8').replaceAll('Hidden skull/joints prevent','Covered joints prevent');
review=review.split('\n').map(line=>{if(!line.includes('| sasuke |')||!line.includes('2026-10-12'))return line;const c=line.split('|'),a=c[3]?.trim(),v=c[5]?.trim();c[8]=c[8]?.replace(/ Manual visible crown-chin axis [^;]+; idle42\.95\+\/-5\. /,' ');const selected={superDash:'v07',jumpSquat:'v06',beamFire:'v07',dash:'v07'};if(selected[a]!==v)return c.join('|');const values=records.filter(r=>r.atlas==='candidate'&&r.anim===a&&r.axis).map(r=>r.axis);if(!values.length)return c.join('|');c[8]=' Manual visible crown-chin axis '+Math.min(...values).toFixed(1)+'-'+Math.max(...values).toFixed(1)+'px +/-5-7; idle42.95+/-5. '+c[8].trim();return c.join('|');}).join('\n');fs.writeFileSync('art/REVIEW.md',review);
console.log('Visible crown/chin table recorded; no head-only or full-body pass.');
