// Hit flash on the victim's sprite (ENG-064). The old look turned the whole body solid white for the hitstop plus
// five frames, which hid the art for most of a string. Now a hit pops pure white for a frame or three by weight
// (the snap that sells it), then holds a lift that keeps the line art plus a bright inner rim through hitstop, then
// eases out. Full white stays for counter hits, specials, supers and KOs. Tuning lives in HIT_FLASH (moves.js).
// Render only: the envelope runs on Game.frameNo, which advances every sim frame (through hitstop, the super-flash
// and parry freezes and clashes) and holds while paused, so the flash length never depends on the hitstop and the
// simulation never reads it. The lift and rim live in the sprite shader (sprites.js).
import * as THREE from 'three';
import { HIT_FLASH } from './moves.js';

export const FLASH_STYLES = ['pop', 'tint', 'rim', 'classic', 'off'];

// ?flash=<style> tries a style in a real match (a phone preview has no lab); the lab's Tools chips switch it live
const q = new URLSearchParams(location.search).get('flash');
if (FLASH_STYLES.includes(q)) HIT_FLASH.style = q;

// tiers that keep their full-white pop in every style (the user asked for full white on counter hits, supers and KOs)
const BIG = new Set(['counter', 'special', 'ko']);

export function resetHitFlash(f) {
  f.hfx ??= { on: false, at: 0, tier: null, pop: 0, popAt: -1, lift: 0, rim: 0, hold: 0, fade: 1, shake: 0.05, color: new THREE.Color() };
  f.hfx.on = false;
}

// Which HIT_FLASH tier a hit plays. Called from takeHit after the damage and before the victim's move is cleared,
// so a KO and a counter hit (the victim was in its own move) can still be read.
export function flashTier(f, m) {
  if (f.hp <= 0 && !f.game.training) return 'ko';
  if (m.hitFlash) return m.hitFlash;
  if (m.special || (m.beam && m.big)) return 'special';
  if ((m.hitstop ?? 6) <= 3 && !m.big) return 'tick';
  if (interrupted(f)) return 'counter';
  if (m.spark === 'smash') return 'smash';
  if (m.big || m.spark === 'heavy') return 'heavy';
  return 'light';
}

// a hit landing in the startup or active frames of the victim's own attack, special, throw or beam charge
const interrupted = (f) => (f.state === 'attack' && f.move && f.t < f.move.startup + f.move.active)
  || f.state === 'kit' || f.state === 'throw' || f.state === 'beamCharge';

// Start the envelope. hs = the hit's hitstop (the lift and rim hold through it); color = the rim color for tiers
// whose rimColor is null (burn: the attacker's color).
export function startHitFlash(f, tier, hs = 0, color = null) {
  const P = HIT_FLASH[tier], F = f.hfx;
  if (!P || !F) return;
  // a tick (beam, vortex, flurry hit) never cuts a stronger flash short while it is still popping or holding
  if (!P.pop && F.on && f.game.frameNo - F.at <= F.hold) return;
  let pop = P.pop === 'hs' ? Math.min(hs, P.popMax) : P.pop;
  if (f.combo >= HIT_FLASH.comboPop && !BIG.has(tier)) pop = Math.min(pop, 1); // deep in a combo: a blink per hit
  F.on = true;
  F.at = f.game.frameNo;
  F.tier = tier;
  F.pop = pop;
  F.popAt = -1;
  F.lift = P.lift;
  F.rim = P.rim;
  F.hold = Math.max(pop, hs);
  F.fade = Math.max(1, P.fade);
  F.shake = P.shake;
  F.color.set(P.rimColor ?? color ?? f.opp.def.color); // parsed once here, copied every frame
}

// Per render: writes the lift and rim uniforms and returns the white flash amount for the shader's flash uniform
// (Fighter.sync layers the charge tint, getup blink, dodge shimmer and super flash on top). `time` is Game.time,
// the same for both syncs of one render.
export function hitFlashUniforms(f, u, time) {
  const H = HIT_FLASH, F = f.hfx;
  let flash = 0, lift = 0, rim = 0;
  if (H.style === 'classic') flash = f.flash > 0.6 ? 1 : f.flash * 0.6; // the old look, exactly, for A/B
  else if (F.on && H.style !== 'off') {
    const t = f.game.frameNo - F.at;
    if (t < 0 || t > F.hold + F.fade) F.on = false;
    else {
      // the pop shows on at least one rendered frame, even when a slow phone runs two sim steps per frame
      if (F.pop > 0 && (H.style !== 'rim' || BIG.has(F.tier)) && (t < F.pop || F.popAt < 0 || F.popAt === time)) {
        flash = 1;
        if (t < F.pop || F.popAt < 0) F.popAt = time;
      }
      const k = t <= F.hold ? 1 : (1 - (t - F.hold) / F.fade) ** 2;
      lift = Math.min(1, F.lift * k * H.strength * (H.style === 'rim' ? 0.3 : 1));
      rim = H.style === 'tint' ? 0 : Math.min(1, F.rim * k * H.strength);
      u.rimColor.value.copy(F.color);
    }
  }
  u.lift.value = lift;
  u.rim.value = rim;
  u.rimPx.value = H.rimPx;
  return flash;
}

// Hitstop jitter of the victim's sprite along the screen. The new styles alternate between two offsets once per sim
// frame, so the sprite never sits between pixels (no shimmer); 'classic' keeps the old sine.
export function hitShake(f, time) {
  const k = Math.min(1, f.hitstop / 4);
  if (HIT_FLASH.style === 'classic') return Math.sin(time * 95) * 0.05 * k;
  const amp = f.state === 'block' ? HIT_FLASH.blockShake : f.hfx?.shake ?? 0.05;
  return (f.hitstop & 1 ? amp : -amp) * k;
}
