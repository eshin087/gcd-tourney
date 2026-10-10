import fs from 'node:fs';
const read = p => fs.readFileSync(p, 'utf8');
const write = (p, s) => fs.writeFileSync(p, s);
const task = '| ART-GOJ-01 | Gojo complete candidate art set | Codex | in-progress | 42 animations / 175 frames and 3 UI candidates generated from user-selected model v03. Strict pack clean, 48 colors; complete atlas and review gallery. Browser combat QA in progress. One final review only; approvedVersion remains unset. files: docs/NOW.md, docs/agents/CODEX_INBOX.md, CHANGELOG.md |';
write('docs/TASKS.md', read('docs/TASKS.md').replace(/^\| ART-GOJ-01 \|.*$/m, task));
let tracker = read('art/TRACKER.md');
const start = tracker.indexOf('## gojo'), end = tracker.indexOf('\n## ', start + 4);
let section = tracker.slice(start, end < 0 ? undefined : end);
section = section.replace('white hair swept up; ~7 heads.', 'white hair swept up. User-selected model v03 overrides the numeric head ratio: compact head, slim torso and long legs.');
section = section.replace(/production\/QA\.md\./g, '[full QA](characters/gojo/production/QA.md).');
write('art/TRACKER.md', tracker.slice(0, start) + section + (end < 0 ? '' : tracker.slice(end)));
let inbox = read('docs/agents/CODEX_INBOX.md');
const si=inbox.indexOf('## Gojo thread'),ei=inbox.indexOf('\n## ',si+4);
const next = `## Gojo thread\n\nDirect user direction supersedes the earlier recommendation for model v02: v02 was rejected; the supplied model v03 proportions govern the entire set.\n\n- [x] Run v02 stray-foot report: superseded by regenerated run v03; its packed contact sheet was inspected.\n- [x] Production order: generated all 42 animations and 3 UI candidates without intermediate review stops. Model v03, expressions v02 and idle v02 were provisional references authorized by the user.\n- [ ] Final bulk review: complete candidates remain unapproved. See art/characters/gojo/reference/batch_review_v03.html and production/QA.md.\n\n`;
write('docs/agents/CODEX_INBOX.md',inbox.slice(0,si)+next+(ei<0?'':inbox.slice(ei+1)));
const entry='- Gojo complete candidate set: 42 animations / 175 frames and three UI images from user-selected model v03; corrected merged strips and placement, added limb-specific hitbox overrides, strict 48-color pack and one full-set review gallery (ART-GOJ-01).\n';
let change=read('CHANGELOG.md');if(!change.includes(entry.trim()))write('CHANGELOG.md',change.replace('## [Unreleased]','## [Unreleased]\n\n'+entry));
let notes=read('art/characters/gojo/reference/notes.md');
const heading='## Full candidate set — 2026-10-09\n\nAll 42 animations (175 frames) and three UI images are now generated. The user selected model v03 proportions and authorized full production without individual approvals. See [full QA](../production/QA.md) and [full review gallery](batch_review_v03.html). Earlier partial-batch notes below are historical. Final approval remains pending.\n\n';
if(!notes.includes('## Full candidate set'))write('art/characters/gojo/reference/notes.md',heading+notes);
// Append measured QA to only Gojo candidate rows; retain the individual raw links and history.
let review=read('art/REVIEW.md');
review=review.split('\n').map(line=>{
  if(!line.startsWith('| 2026-10-09 | gojo |')||!line.includes('Full-set production')&&!line.includes('full-set production'))return line;
  return line.replace('Final measured QA recorded in production/QA.md.', 'Final pack: 42 animations / 175 frames, 48 colors, zero warnings. [QA and visual caveats](characters/gojo/production/QA.md); one final batch review.');
}).join('\n');
write('art/REVIEW.md',review);
console.log('Updated Gojo records only');
