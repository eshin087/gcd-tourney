// Links inside a worktree, taken out before git removes it (TOOL-070).
// Git for Windows' `git worktree remove` (not forced, as tools/pr.mjs runs it) recurses through an NTFS junction and
// deletes the contents of the folder it points to. On 2026-11-08 the prune after a merge emptied the main checkout's
// node_modules that way, through a node_modules junction in a finished Codex worktree. Removing each link itself first
// (never what it points to) leaves git nothing to follow. Symbolic links count too: `fs.symlinkSync(..., 'junction')`
// makes a junction on Windows and a directory symlink elsewhere, and both report isSymbolicLink().

import fs from 'node:fs';
import path from 'node:path';

// Every link under dir, without following any. Directory entries say what they are (a junction is a symbolic link to
// Node), so only an entry of unknown type costs an lstat. `.git` is git's own and never holds a link we put there.
export function findLinks(dir) {
  const links = [];
  const walk = (d) => {
    let entries;
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (e.name === '.git') continue;
      const p = path.join(d, e.name);
      let link = e.isSymbolicLink(), sub = e.isDirectory();
      if (!link && !sub && !e.isFile()) {
        try { const st = fs.lstatSync(p); link = st.isSymbolicLink(); sub = st.isDirectory(); } catch { continue; }
      }
      if (link) links.push(p);
      else if (sub) walk(p);
    }
  };
  walk(dir);
  return links;
}

// Removes every link under dir and returns what it removed ({ link, target, dir }), so restoreLinks can put them back
// when git then refuses the worktree after all. Throws, after restoring the ones it took, if a link will not go: the
// caller must not run git over a folder that still links outside.
export function dropLinks(dir) {
  const dropped = [];
  for (const link of findLinks(dir)) {
    let target = null, isDir = false;
    try { target = fs.readlinkSync(link); } catch { /* still removed; it just cannot be put back */ }
    try { isDir = fs.statSync(link).isDirectory(); } catch { /* a dangling link */ }
    try { fs.unlinkSync(link); } catch (e) {
      try { fs.rmdirSync(link); } catch {
        restoreLinks(dropped);
        throw new Error(`could not remove the link ${link} (${e.code || e.message})`);
      }
    }
    dropped.push({ link, target, dir: isDir });
  }
  return dropped;
}

// Puts links back as they were (a junction for a folder on Windows). Best effort: returns the ones it could not.
export function restoreLinks(dropped) {
  const failed = [];
  for (const { link, target, dir } of dropped) {
    if (!target) { failed.push(link); continue; }
    try { fs.symlinkSync(target, link, dir ? 'junction' : 'file'); } catch { failed.push(link); }
  }
  return failed;
}
