import fs from 'node:fs';
const update = (file, fn) => { const old = fs.readFileSync(file, 'utf8'); fs.writeFileSync(file, fn(old)); };
const rows = [
  '| 2026-10-09 | gojo | run | [run_v03.png](characters/gojo/raw/run_v03.png) ([placement](characters/gojo/raw/run_v03.json), [A](characters/gojo/raw/_parts/run_v03_A.png), [B](characters/gojo/raw/_parts/run_v03_B.png)) | v03 | needs review | Regenerated against user-supplied small-head model v03; B retry reverses arm swing. Source parts stitched unchanged, placement sidecar centers head and lifts flight frames | Eight poses; 48 packed colors, binary alpha, no magenta/clipping or packer warnings. Grounded soles y240, flight y227. Raw palette variation remains; alternate arm swing changes at the half-cycle. No individual approval stop, per user direction. [QA](characters/gojo/reference/notes.md). |',
  '| 2026-10-09 | gojo | idle | [idle_v02.png](characters/gojo/raw/idle_v02.png) ([A](characters/gojo/raw/_parts/idle_v02_A.png), [B](characters/gojo/raw/_parts/idle_v02_B.png)) | v02 | needs review | New small-head, long-leg proportions from user-supplied model v03; first attempt per part, stitched unchanged | Eight hands-in-pockets poses, blindfold on. Hair top y20-22 (2px bob), soles y240, lower-foot center variation 0.46px. 48-color packed atlas, hard alpha, no clipping or magenta. User-directed provisional production reference. |',
  '| 2026-10-09 | gojo | expressions | [expressions_v02.png](characters/gojo/reference/expressions_v02.png) | v02 | needs review | Regenerated against user-supplied model v03; narrower adult face and matching collar/hair | Eight right-facing faces, eyes covered in 1-7 and revealed in 8. Raw 1536x1024 reference retains near-magenta and generated palette variation. Provisional use authorized without individual approval. |'
];
update('art/REVIEW.md', s => {
  s = s.replace('| User rejected: head too large and proportions poor; use supplied proportions instead.', 'User rejected: head too large and proportions poor; use supplied proportions instead. |');
  const pending = rows.filter(r => !s.includes(r.split(' | needs review')[0]));
  return s.replace('|---|---|---|---|---|---|---|---|', '|---|---|---|---|---|---|---|---|\n' + pending.join('\n'));
});
update('art/manifest.json', s => {
  const i = s.indexOf('"gojo":');
  let block = s.slice(i);
  for (const [key, n] of [['expressions', 2], ['idle', 2], ['run', 3]]) {
    block = block.replace(new RegExp('("' + key + '"\\s*:\\s*\\{[^}]*?"version":\\s*)\\d+'), (_, prefix) => prefix + n);
  }
  return s.slice(0, i) + block;
});
update('art/TRACKER.md', s => {
  const i = s.indexOf('## gojo');
  let block = s.slice(i);
  block = block.replace(/\| 2 \| reference\/expressions[^\r\n]+/, '| 2 | reference/expressions_vNN.png -> expressions.png | - | - | yes | - | raw | v02 | - | Corrected face from user-selected model v03; provisional production reference. |');
  block = block.replace(/\| 3 \| idle[^\r\n]+/, '| 3 | idle | 8 | - | **yes** | 222 | packed | v02 | - | Small-head proportions; 2px bob, soles y240, foot-center variation 0.46px; 48 colors, no warnings. |');
  block = block.replace(/\| 4 \| run[^\r\n]+/, '| 4 | run | 8 | - | **yes** | 222 | packed | v03 | - | Small-head proportions, alternating arm swing, placement corrected; flight soles y227; 48 colors, no warnings. |');
  return s.slice(0, i) + block;
});

const oldPreview = fs.readFileSync('art/characters/gojo/reference/batch_review_v01.html', 'utf8');
const preview = oldPreview.replaceAll('batch 1', 'proportion correction').replaceAll('model_sheet_v02.png', 'model_sheet_v03.png').replaceAll('expressions_v01.png', 'expressions_v02.png')
  .replace('Four candidates for one review: model v02, expressions v01, idle v01, run v02. Approval is recorded in chat.', 'Your selected proportions: model v03, expressions v02, idle v02, run v03. Production and local tests continue without individual approval stops.')
  .replace('Model · v02', 'Model · v03').replace('Expressions · v01', 'Expressions · v02').replace('Idle · v01', 'Idle · v02').replace('Run · v02', 'Run · v03')
  .replace('Larger anatomical heads; five views including true profile. Hair size and raw palette remain review caveats.', 'Your supplied image, preserved unchanged. This compact head and long-leg silhouette sets the direction.')
  .replace('Feet stay planted; the low pose has a deeper bob.', 'Feet stay planted; the breathing bob is reduced to 2 pixels.')
  .replace('Check the deeper idle bob, run arm transition and small detached pixels near the trailing foot.', 'New proportions are packed at game size. The arm swing alternates across the two halves of the run.')
  .replace('Production build is currently unverified.', 'Local production build passes using the sandbox-compatible Vite test command. No deployment.')
  .replace('Remaining combat animations require later batches.', 'Combat animation production remains outstanding.');
fs.writeFileSync('art/characters/gojo/reference/batch_review_v02.html', preview, { flag: 'wx' });
update('art/characters/gojo/reference/batch_review_v01.html', s => s.replace('model_sheet_v02.png', '_rejected/model_sheet_v02.png').replace('model_sheet_v02.png', '_rejected/model_sheet_v02.png').replace('<main>', '<main><p>This is the earlier, superseded preview. <a href="batch_review_v02.html">Open the corrected proportions.</a></p>'));
