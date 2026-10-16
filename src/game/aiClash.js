// CPU side of the MELEE CLASH (ADR 0038), shared by both brains (ai.js CpuBrain, aiMaster.js MasterBrain): now and
// then it answers a fresh light or heavy with the same button so the two swings meet, and out of a clash's pushback it
// may press again to keep a chain going. One roll per opposing swing and per pushback, at the brain's `chance`.
import { MELEE_CLASH } from './moves.js';

const FREE = new Set(['idle', 'run', 'air', 'clashBack']);

// The button ('light' | 'heavy') to press now, or null. `memo` is the brain itself (it keeps the last swing it rolled
// for), `rand` its random source.
export function seekClash(f, chance, memo, rand) {
  if (!chance || f.hitstop > 0 || !FREE.has(f.state)) return null;
  const o = f.opp, C = MELEE_CLASH;
  // out of a pushback: go again (the other side may too)
  if (f.state === 'clashBack' && f.t === 1 && memo.clashBackAt !== f.clock) {
    memo.clashBackAt = f.clock;
    if (rand() < Math.min(0.85, chance * C.chainSeek)) return f.game.meleeChain.cls ?? 'light';
  }
  // their swing has just started: meet it (pressed now, ours is live within the clash window of theirs)
  if (o.state !== 'attack' || !o.move?.meleeClash || o.t > 2 || o.ko) return null;
  const key = f.game.frameNo - o.t;
  if (memo.clashKey === key) return null;
  memo.clashKey = key;
  const { sx, sd } = f.laneOffsets();
  if (Math.abs(sd) > 0.9 || Math.abs(sx) > C.seekRange || Math.abs(o.pos.y - f.pos.y) > 1.5) return null;
  return rand() < chance ? o.move.meleeClash : null;
}
