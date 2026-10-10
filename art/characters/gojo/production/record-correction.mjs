import fs from 'node:fs';

// Read each shared document immediately before touching only Gojo's rows.
const update = (file, fn) => { const old = fs.readFileSync(file, 'utf8'); fs.writeFileSync(file, fn(old)); };
update('art/REVIEW.md', s => {
  s = s.split('\n').map(line => line.includes('| gojo | model sheet |') && line.includes('| v02 |')
    ? line.replace('(characters/gojo/reference/model_sheet_v02.png)', '(characters/gojo/reference/_rejected/model_sheet_v02.png)').replace('| needs review |', '| rejected |') + ' User rejected: head too large and proportions poor; use supplied proportions instead.' : line).join('\n');
  if (!s.includes('| gojo | model sheet | [model_sheet_v03.png]')) {
    const header = '|---|---|---|---|---|---|---|---|';
    s = s.replace(header, header + '\n| 2026-10-09 | gojo | model sheet | [model_sheet_v03.png](characters/gojo/reference/model_sheet_v03.png) | v03 | needs review | User-supplied preferred proportions, preserved byte-for-byte; overrides the enlarged-head v02 direction | Smaller head, longer legs, slender adult silhouette. Five views, blindfold throughout, hands in pockets; supplied image takes precedence over original neutral-arm and numeric head-ratio directions. Provisional production reference authorized; final approval not inferred. SHA256 BEB03BEFE7857F1FDD30CD90AA3341B391D63044F52EB8B6DAE9A41914B8F389. |');
  }
  return s;
});
update('art/manifest.json', s => {
  const i = s.indexOf('"gojo":');
  return s.slice(0, i) + s.slice(i).replace(/("modelSheet"[\s\S]*?"version":\s*)2/, '$13');
});
update('art/TRACKER.md', s => {
  const i = s.indexOf('## gojo');
  return s.slice(0, i) + s.slice(i).replace(/\| 1 \| reference\/model_sheet[^\r\n]+/, '| 1 | reference/model_sheet_vNN.png -> model_sheet.png | - | - | yes | - | raw | v03 | - | User-supplied small-head proportions replace rejected v02; provisional production reference, no per-step approval stops. |');
});
update('docs/TASKS.md', s => s.replace(/^\| ART-GOJ-01 \|.*$/m, '| ART-GOJ-01 | Gojo art production with user-selected proportions | Codex | in-progress | User rejected model v02; supplied image preserved as v03. Carry smaller head / long-leg proportions into assets. No intermediate approval stops; keep version history and final review status. Browser QA works with normal sandbox permissions; build remains blocked by EPERM. |'));
update('CHANGELOG.md', s => s.replace('## [Unreleased]', '## [Unreleased]\n\n- Gojo: user-selected smaller-head proportions filed as model v03; rejected v02 preserved. Production continues without intermediate approval requests; local browser QA verified under normal sandbox permissions.'));
