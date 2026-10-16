#!/usr/bin/env node
// Undeclared-identifier check (TOOL-027). Runs before every build (prebuild): a name that is used but never
// declared or imported is a ReferenceError waiting for the one code path that reaches it (ENG-062: the pause menu's
// `MODE_ORDER` was never declared, and the dead menu only showed after exiting training).
//
//   node tools/check-undeclared.mjs [dir]       default: src/ (every .js below it)
//
// Parser-free on purpose (no new dependency): a small lexer (strings, template literals with nested `${}`,
// comments, regex literals) feeds a scope pass. Declarations are collected per brace scope and hoisted, the same
// "visible anywhere in its block" reading a ReferenceError needs: const/let/class/function, imports, parameters
// (arrow, method, catch) and destructuring patterns. Anything that is not a reference is skipped: member names after
// `.`/`?.`, object keys, method and class-member names, labels, export aliases. Where the rules cannot tell, they lean
// permissive, so a miss costs a missed bug, never a false alarm on working code. Globals are the browser + JS ones
// the code is allowed to use; three.js comes in through its namespace import, so it needs no entry.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const GLOBALS = new Set(`
  Object Array String Number Boolean Symbol BigInt Math JSON Date RegExp Error TypeError RangeError SyntaxError
  ReferenceError EvalError AggregateError Promise Set Map WeakSet WeakMap WeakRef Proxy Reflect Intl Atomics Function
  ArrayBuffer SharedArrayBuffer DataView Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array
  Uint32Array Float32Array Float64Array BigInt64Array BigUint64Array
  isNaN isFinite parseInt parseFloat encodeURIComponent decodeURIComponent encodeURI decodeURI globalThis
  queueMicrotask structuredClone
  window document navigator location history screen console performance localStorage sessionStorage
  setTimeout clearTimeout setInterval clearInterval requestAnimationFrame cancelAnimationFrame requestIdleCallback
  fetch alert confirm prompt getComputedStyle matchMedia devicePixelRatio innerWidth innerHeight atob btoa
  Image ImageData ImageBitmap createImageBitmap OffscreenCanvas Audio AudioContext webkitAudioContext OfflineAudioContext
  URL URLSearchParams Blob File FileReader FormData Headers Request Response AbortController TextEncoder TextDecoder
  Event CustomEvent KeyboardEvent MouseEvent PointerEvent TouchEvent WheelEvent ResizeObserver IntersectionObserver
  MutationObserver Worker MessageChannel BroadcastChannel WebSocket XMLHttpRequest DOMParser CSS
  Option Node Element HTMLElement HTMLCanvasElement HTMLImageElement HTMLInputElement HTMLButtonElement HTMLSelectElement
  CanvasRenderingContext2D WebGLRenderingContext WebGL2RenderingContext Path2D
`.split(/\s+/).filter(Boolean));

// words that are never a reference (reserved + contextual); a variable that really uses one is declared anyway
const WORDS = new Set(`
  break case catch class const continue debugger default delete do else export extends finally for function if import
  in instanceof new return super switch this throw try typeof var void while with yield let static await async of get set
  null true false undefined NaN Infinity arguments from as
`.split(/\s+/).filter(Boolean));

// a `/` after one of these starts a regex literal, after any other identifier it divides
const REGEX_AFTER = new Set(['return', 'typeof', 'case', 'delete', 'void', 'throw', 'new', 'in', 'of', 'instanceof', 'else', 'do', 'yield', 'await']);
// `(` ... `)` `{` after these is a control statement, not a parameter list
const CONTROL = new Set(['if', 'while', 'for', 'switch', 'with', 'await']);
const OPS = /^(?:>>>=|\.\.\.|===|!==|\*\*=|<<=|>>=|>>>|&&=|\|\|=|\?\?=|=>|==|!=|<=|>=|&&|\|\||\?\?|\?\.(?!\d)|\+\+|--|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|<<|>>|\*\*)/;
const ID_START = /[\p{ID_Start}$_]/u;
const ID_PART = /[\p{ID_Continue}$‌‍]/u;
const OPEN = new Set(['(', '[', '{', '${']);

// tokens: { t: 'id' | 'num' | 'str' | 'tpl' | 're' | 'p', v, line }
export function tokenize(src) {
  const toks = [];
  const n = src.length;
  let i = 0, line = 1, prev = null;
  const braces = []; // 'b' for `{`, 't' for a template `${`
  const add = (t, v) => { prev = { t, v, line }; toks.push(prev); };
  const regexOk = () => {
    if (!prev) return true;
    if (prev.t === 'id') return REGEX_AFTER.has(prev.v);
    if (prev.t === 'p') return !(prev.v === ')' || prev.v === ']' || prev.v === '}');
    return false;
  };
  // template text from i (just after the backtick, or after the `}` that closed a substitution)
  const template = () => {
    while (i < n) {
      const c = src[i];
      if (c === '\\') { if (src[i + 1] === '\n') line++; i += 2; continue; }
      if (c === '\n') line++;
      if (c === '`') { i++; add('tpl', ''); return; }
      if (c === '$' && src[i + 1] === '{') { i += 2; add('tpl', ''); add('p', '${'); braces.push('t'); return; }
      i++;
    }
  };
  while (i < n) {
    const c = src[i];
    if (c === '\n') { line++; i++; continue; }
    if (/\s/.test(c)) { i++; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') {
      const e = src.indexOf('*/', i + 2);
      const end = e < 0 ? n : e + 2;
      for (let k = i; k < end; k++) if (src[k] === '\n') line++;
      i = end;
      continue;
    }
    if (c === '"' || c === "'") {
      i++;
      while (i < n && src[i] !== c && src[i] !== '\n') { if (src[i] === '\\') { if (src[i + 1] === '\n') line++; i++; } i++; }
      i++;
      add('str', '');
      continue;
    }
    if (c === '`') { i++; template(); continue; }
    if (c === '}' && braces[braces.length - 1] === 't') { braces.pop(); i++; add('p', '}'); template(); continue; }
    if (c === '/' && regexOk()) {
      i++;
      let cls = false;
      while (i < n && src[i] !== '\n') {
        const d = src[i];
        if (d === '\\') { i += 2; continue; }
        if (cls) { if (d === ']') cls = false; } else if (d === '[') cls = true; else if (d === '/') break;
        i++;
      }
      i++;
      while (i < n && ID_PART.test(src[i])) i++;
      add('re', '');
      continue;
    }
    if ((c >= '0' && c <= '9') || (c === '.' && src[i + 1] >= '0' && src[i + 1] <= '9')) {
      i++;
      while (i < n && /[0-9a-zA-Z_.]/.test(src[i])) i++;
      add('num', '');
      continue;
    }
    if (ID_START.test(c) || (c === '#' && ID_START.test(src[i + 1] || ''))) {
      const s = i++;
      while (i < n && ID_PART.test(src[i])) i++;
      add('id', src.slice(s, i));
      continue;
    }
    const m = OPS.exec(src.slice(i, i + 4));
    if (m) { i += m[0].length; add('p', m[0]); continue; }
    if (c === '{') braces.push('b');
    else if (c === '}') braces.pop();
    i++;
    add('p', c);
  }
  return toks;
}

class Scope {
  constructor(parent) { this.parent = parent; this.names = new Set(); }
  has(name) { for (let s = this; s; s = s.parent) if (s.names.has(name)) return true; return false; }
}

// -> [{ name, line }] for every identifier used but never declared, imported or global
export function findUndeclared(src) {
  const toks = tokenize(src);
  const N = toks.length;
  const match = new Array(N).fill(-1);
  const stack = [];
  toks.forEach((t, i) => {
    if (t.t !== 'p') return;
    if (OPEN.has(t.v)) stack.push(i);
    else if (t.v === ')' || t.v === ']' || t.v === '}') {
      const o = stack.pop();
      if (o !== undefined) { match[o] = i; match[i] = o; }
    }
  });
  const isP = (i, v) => i >= 0 && i < N && toks[i].t === 'p' && toks[i].v === v;
  const isId = (i, v) => i >= 0 && i < N && toks[i].t === 'id' && (v === undefined || toks[i].v === v);
  const jump = (j) => Math.max(match[j], j); // past a bracketed group (its closer; the caller's j++ steps over it)

  const declare = (tok, scope) => { tok.decl = true; scope.names.add(tok.v); };
  // stops at the next depth-0 `,` (or the end): a default value inside a pattern or parameter list
  const skipExpr = (j, end) => {
    for (; j < end; j++) {
      const t = toks[j];
      if (t.t === 'p') { if (t.v === ',') return j; if (OPEN.has(t.v)) j = jump(j); }
    }
    return j;
  };
  // a binding pattern (identifier, {..} or [..]) starting at i: declares its names, returns the index after it
  const pattern = (i, scope) => {
    if (i >= N) return i;
    if (toks[i].t === 'id') { declare(toks[i], scope); return i + 1; }
    if (isP(i, '{') || isP(i, '[')) {
      const end = match[i];
      const obj = isP(i, '{');
      let j = i + 1;
      while (j < end) {
        if (isP(j, ',')) { j++; continue; }
        if (isP(j, '...')) { j = pattern(j + 1, scope); continue; }
        if (obj) {
          const keyEnd = isP(j, '[') ? match[j] + 1 : j + 1;
          if (isP(keyEnd, ':')) { // key: target (the key is a property name, not a reference)
            if (toks[j].t === 'id') toks[j].nonref = true;
            j = pattern(keyEnd + 1, scope);
          } else if (toks[j].t === 'id') { declare(toks[j], scope); j++; } // shorthand
          else j = keyEnd;
        } else j = pattern(j, scope);
        if (isP(j, '=')) j = skipExpr(j + 1, end);
      }
      return end + 1;
    }
    return i + 1;
  };
  // where a declarator ends: the next depth-0 `,` `;` `of` `in`, or the closer of the enclosing group
  const declEnd = (j) => {
    for (; j < N; j++) {
      const t = toks[j];
      if (t.t === 'p') {
        if (OPEN.has(t.v)) { j = jump(j); continue; }
        if (t.v === ',' || t.v === ';' || t.v === ')' || t.v === ']' || t.v === '}') return j;
      } else if (t.t === 'id' && (t.v === 'of' || t.v === 'in')) return j;
    }
    return j;
  };
  const declList = (i, scope) => {
    for (;;) {
      i = pattern(i, scope);
      let j = i;
      if (isP(j, '=')) j = declEnd(j + 1);
      if (isP(j, ',')) { i = j + 1; continue; }
      return;
    }
  };
  // class body members: their names are not references (methods, fields, accessors, static blocks)
  const classMembers = (open) => {
    const close = match[open];
    let j = open + 1;
    while (j < close) {
      if (isP(j, ';')) { j++; continue; }
      while (j < close && toks[j].t === 'id' && ['static', 'async', 'get', 'set'].includes(toks[j].v) &&
        !isP(j + 1, '(') && !isP(j + 1, '=') && !isP(j + 1, ';') && !isP(j + 1, '}')) j++;
      if (isP(j, '*')) j++;
      if (isP(j, '{')) { j = match[j] + 1; continue; } // static { ... }
      if (isP(j, '[')) j = match[j] + 1;
      else { if (toks[j].t === 'id') toks[j].nonref = true; j++; }
      if (isP(j, '(')) { j = match[j] + 1; if (isP(j, '{')) j = match[j] + 1; }
      else if (isP(j, '=')) { // field initializer, up to its `;`
        for (j++; j < close && !isP(j, ';'); j++) if (toks[j].t === 'p' && OPEN.has(toks[j].v)) j = jump(j);
      }
    }
  };

  const root = new Scope(null);
  let cur = root;
  const closeAt = new Set(); // token indexes where the current scope ends
  const bodyScope = new Map(); // `{` index -> the function scope that already holds its parameters

  for (let i = 0; i < N; i++) {
    const t = toks[i];
    t.scope = cur;
    if (t.t === 'p') {
      if (t.v === '(') {
        const k = match[i];
        const before = toks[i - 1];
        const arrow = isP(k + 1, '=>');
        const block = isP(k + 1, '{');
        const control = before && before.t === 'id' && CONTROL.has(before.v);
        if (k > i && (arrow || (block && !control))) { // a parameter list (function, method, arrow, catch)
          const S = new Scope(cur);
          if (before && before.t === 'id' && !before.decl) before.nonref = true; // method name
          let j = i + 1;
          while (j < k) {
            if (isP(j, ',')) { j++; continue; }
            if (isP(j, '...')) j++;
            j = pattern(j, S);
            if (isP(j, '=')) j = skipExpr(j + 1, k);
          }
          if ((arrow && isP(k + 2, '{'))) bodyScope.set(k + 2, S);
          else if (block) bodyScope.set(k + 1, S);
          else for (const name of S.names) cur.names.add(name); // expression-bodied arrow: leaky, so permissive
          cur = S;
          closeAt.add(k);
        }
      } else if (t.v === '{') {
        cur = bodyScope.get(i) || new Scope(cur);
        closeAt.add(match[i]);
      } else if (t.v === '=>' && isId(i - 1)) { // x => ...
        const x = toks[i - 1];
        x.decl = true;
        if (isP(i + 1, '{')) { const S = new Scope(cur); S.names.add(x.v); bodyScope.set(i + 1, S); }
        else cur.names.add(x.v);
      }
    } else if (t.t === 'id') {
      const v = t.v;
      const prev = toks[i - 1];
      const member = prev && prev.t === 'p' && (prev.v === '.' || prev.v === '?.');
      if (member) { t.nonref = true; }
      else if (v === 'const' || v === 'let' || v === 'var') declList(i + 1, v === 'var' ? root : cur); // var is function-scoped: file-wide is the permissive reading
      else if (v === 'function') {
        let j = i + 1;
        if (isP(j, '*')) j++;
        if (isId(j)) declare(toks[j], cur);
      } else if (v === 'class') {
        let j = i + 1;
        if (isId(j) && toks[j].v !== 'extends') declare(toks[j], cur);
        for (; j < N && !isP(j, '{'); j++) if (toks[j].t === 'p' && (toks[j].v === '(' || toks[j].v === '[')) j = jump(j);
        if (isP(j, '{')) classMembers(j);
      } else if (v === 'import' && !isP(i + 1, '(') && !isP(i + 1, '.')) {
        for (let j = i + 1; j < N && !isId(j, 'from') && toks[j].t !== 'str'; j++) {
          if (isP(j, '{')) {
            const end = match[j];
            for (let q = j + 1; q < end; q++) {
              if (toks[q].t !== 'id') continue;
              if (isId(q + 1, 'as')) { toks[q].nonref = true; declare(toks[q + 2], cur); q += 2; } else declare(toks[q], cur);
            }
            j = end;
          } else if (isId(j, 'as')) continue;
          else if (isId(j)) declare(toks[j], cur);
        }
      } else if (v === 'export' && isP(i + 1, '{')) {
        const end = match[i + 1];
        const reexport = isId(end + 1, 'from');
        for (let q = i + 2; q < end; q++) {
          if (toks[q].t !== 'id') continue;
          if (reexport) toks[q].nonref = true; // names of another module
          else if (isId(q + 1, 'as')) { q += 2; toks[q].nonref = true; } // `local as exported`: the alias is not a reference
        }
      } else if (v === 'export' && isP(i + 1, '*') && isId(i + 2, 'as') && isId(i + 3)) toks[i + 3].nonref = true;
      else if ((v === 'break' || v === 'continue') && isId(i + 1) && toks[i + 1].line === t.line) toks[i + 1].nonref = true;
    }
    if (closeAt.has(i)) cur = cur.parent;
  }

  const found = [];
  for (let i = 0; i < N; i++) {
    const t = toks[i];
    if (t.t !== 'id' || t.decl || t.nonref) continue;
    const name = t.v;
    if (name[0] === '#' || WORDS.has(name) || GLOBALS.has(name)) continue;
    const prev = toks[i - 1];
    // `{ key: v }` / `, key: v` (an object key) and `label:` are not references; `a ? b : c` and `case X:` are
    if (isP(i + 1, ':') && prev && prev.t === 'p' && (prev.v === '{' || prev.v === ',' || prev.v === ';' || prev.v === '}')) continue;
    if (!t.scope.has(name)) found.push({ name, line: t.line });
  }
  return found;
}

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.js')) yield p;
  }
}

// -> [{ file, name, line }], file relative to root
export function checkTree(dir, root = dir) {
  const out = [];
  for (const file of walk(dir)) {
    for (const f of findUndeclared(fs.readFileSync(file, 'utf8'))) out.push({ file: path.relative(root, file).split(path.sep).join('/'), ...f });
  }
  return out;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const dir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(repo, 'src');
  const t0 = performance.now();
  const bad = checkTree(dir, process.argv[2] ? dir : repo);
  const ms = Math.round(performance.now() - t0);
  for (const b of bad) console.error(`check-undeclared: ${b.file}:${b.line}: "${b.name}" is used but never declared or imported`);
  if (bad.length) {
    console.error(`check-undeclared: failed (${bad.length} undeclared use(s)) in ${ms} ms`);
    process.exit(1);
  }
  console.log(`check-undeclared: ok in ${ms} ms`);
}
