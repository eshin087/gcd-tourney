#!/usr/bin/env node
// GCD Tourney sprite packer: art/ (ChatGPT output) -> public/ (what the game loads).
//
//   npm run sprites                 pack every character + every world-art kind (vfx, crowd, stage, npc, ui)
//   npm run sprites naruto          pack one character (several ids allowed)
//   npm run sprites vfx             pack only the VFX atlas (approved effects only)
//   npm run sprites crowd           pack only the crowd atlas (approved spectators only)
//   npm run sprites stage npc ui    pack the approved stage slots, NPC sheets and shared UI images
//   npm run sprites decals          pack the approved ground-damage decals (tools/pack-decals.mjs, ADR 0024)
//   npm run sprites -- --candidates world art: pack every latest candidate into public/preview/ instead of the
//                                   shipped folders (git-ignored; the game shows it with ?art=custom)
//   npm run sprites -- --dry-run    report only, write nothing
//
// See tools/README.md for every option, art/SPEC.md for the sprite spec and
// docs/decisions/0007-art-spec-v2-shippuden-256.md for where the spec v2 numbers come from.
// Node ESM, single dependency: pngjs. Never throws on missing folders/animations: it reports them.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PNG } from 'pngjs';
import { auditCharacter, compactAudit, resolveGate, exemptionsFrom, verdictText, staleExemptText, FLAGGED, hex } from './scale-probe.mjs';
import { packDecals, printDecalReport, updateDecalStatus } from './pack-decals.mjs';
import { skippedFiles } from './sparse-art.mjs';
import { PAGE_PX, pageFile, sheetFiles, frameCell } from '../src/art/sheetPages.js';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(TOOL_DIR, '..');
const PACKER_VERSION = 2;

// ============================================================== spec (art/manifest.json "spec" block)
// The manifest's spec block is the authority. These are the spec v2 defaults (ADR 0007), used for any key
// the manifest leaves out or gets wrong (a malformed value is warned and replaced by its default).
const SPEC_DEFAULTS = Object.freeze({
  name: 'hi-res sprite spec v2', frameWidth: 256, frameHeight: 256, columns: 16, pivot: Object.freeze([128, 240]), pixelsPerUnit: 128,
  facing: 'right', maxColors: 48, warnColors: 64, cellMargin: 4, standingBodyPx: 200,
});
// The only version suffix the file scan understands (raw/<anim>_vNN.png).
const VERSION_SUFFIX = '_vNN';

// Max trimmed body height (px, hair included) per animation in the 256 cell: the ADR 0007 table. Upright poses are
// spec v1 x 204/135; lying and flying poses are set so they also fit the cell width. The manifest overrides these.
const BODY_HEIGHT = {
  idle: 204, run: 204, dash: 160, superDash: 120, backDash: 207, jumpSquat: 162, jumpUp: 198, jumpFall: 209, land: 174, airRecover: 180,
  light1: 204, light2: 204, light3: 215, light4: 207, heavy: 218, airLight1: 198, airLight2: 207, airLight3: 201, airHeavy: 198, throw: 201,
  guard: 198, block: 204, hurtHigh: 195, hurtLow: 183, launched: 136, spin: 160, down: 96, ko: 64, getup: 204, stagger: 207, charge: 198,
  beamCharge: 198, beamFire: 198, vanish: 221, special: 204, intro: 210, taunt: 212, win: 212,
  // tech poses (ADR 0030): the tallest frame is the settle stance (= idle), the recovery crouch (= jumpSquat) and the
  // fall handoff (= jumpFall); a fighter drawn at another stature overrides them per animation in the manifest
  techGround: 204, techRoll: 162, wallTech: 209,
  beamStruggle: 198, // beam clash struggle (ADR 0034): braced, no taller than beamFire
  beamStruggleAir: 190, // its air version: hovering, legs tucked (about the throw's height)
};
const DEFAULT_BODY_HEIGHT = 204;

// The pixel thresholds of the hitbox heuristics were tuned on spec v1 art (standing body ~136 px). They scale
// with the spec's standing body so a bigger sprite behaves the same (spec v2: 200 / 136 = x1.47).
const V1_STANDING_BODY_PX = 136;

// The game only switches to a custom sheet when all of these exist ("complete": true).
const CORE = ['idle', 'run', 'dash', 'jumpUp', 'jumpFall', 'land', 'light1', 'light2', 'light3', 'light4', 'heavy', 'airLight1', 'airHeavy',
  'guard', 'hurtHigh', 'launched', 'down', 'getup', 'special', 'beamCharge', 'beamFire', 'charge', 'win'];

// Default ms per frame (number = every frame). Mirrors the placeholder bake timings (src/art/rig/anims.js).
// When the frame count differs, the total duration is kept and spread evenly.
const DEFAULT_MS = {
  idle: 150, run: 60, dash: 60, superDash: 50, backDash: [60, 60, 80], jumpSquat: [70], jumpUp: 80, jumpFall: 80, land: [50, 70], airRecover: [50, 50, 60],
  light1: [30, 30, 40, 50, 50, 50, 30], light2: [35, 30, 40, 50, 60, 50, 30], light3: [40, 35, 45, 60, 60, 60, 30], light4: [50, 45, 35, 40, 70, 70, 70, 40],
  heavy: [40, 35, 30, 50, 70, 70, 60, 30], airLight1: [45, 35, 50, 50, 30], airLight2: [45, 40, 50, 50, 30], airLight3: [50, 40, 50, 70, 60, 30],
  airHeavy: [50, 45, 45, 70, 70, 40], throw: [50, 60, 70, 50], guard: 300, block: [60, 80], hurtHigh: [70, 90, 100], hurtLow: [70, 90, 100],
  launched: 70, spin: 60, down: [80, 420], ko: [500], getup: [70, 60, 60, 80, 70], stagger: 150, charge: [70, 90, 110, 110, 110, 110], beamCharge: 50, beamFire: 50,
  vanish: [50, 50], special: [120, 120, 120, 120, 120, 160, 110, 70], intro: 150, taunt: 250, win: 200,
  // tech poses: their beats at 60 fps (DEFENSE animPhases); the engine drives them by the tech state's clock anyway
  techGround: [67, 83, 83, 67], techRoll: [50, 63, 62, 63, 62, 67], wallTech: [50, 50, 67, 67, 66],
  beamStruggle: 70, beamStruggleAir: 70,
};

// Attacks whose damage comes from something else (projectile), and phased strips that never strike (the tech
// poses, ADR 0030: their middle beat is a roll or a push-off, not an active frame): no melee hitbox.
const NO_HITBOX = new Set(['throw', 'techGround', 'techRoll', 'wallTech']);

// Lying frames (ADR 0020). `footprint`: frames whose x span goes into anims.json, so the engine lays the contact shadow
// along the whole body. `check`: the resting frames of the ground check. Every frame's lowest pixel already sits on the
// floor line, so the check asks whether the BODY rests on it (head, back, hips and legs), which a pose drawn from above
// fails: one hand touches and the head end hangs in the air. down[0] (the bounce) and getup[1+] may leave the floor.
const LYING = { ko: { footprint: 'all', check: 'all' }, down: { footprint: 'all', check: 'last' }, getup: { footprint: 'first', check: 'first' } };
// Ground check thresholds in spec v2 px at a 200 px standing body (scaled with the character's standingBodyPx). Tuned on
// the shipped art: every top-down ko / down[1] fails (9-34% contact, a fifth 13-36 px up), every getup[0] passes.
const GROUND = { contactPx: 6, minContact: 0.4, maxGap: 12, segments: 5, tallFactor: 1.15 };

// Tech poses (ADR 0030, art/SPEC.md "Tech poses"). wall: the beats (phase indices) whose frames are WALL-ANCHORED:
// their leftmost opaque pixel goes on the wall line (WALL_LINE, near the cell's left edge) instead of the feet being
// centred, so a full diagonal push-off has the whole cell width to reach right. The engine puts that line on the
// barrier (anims.json wallLine) and, on a wall seen in depth, re-centres the body (anims.json wallAnchor: each such
// frame's body centre, px right of the pivot). contact: the cling beats whose wall line must carry the soles.
// envelope: beats whose frames are tucked, crouched or braced, with their allowed trimmed height as a share of the
// idle's: the idle's anatomical scale, never stretched to a standing height (the scale probe can't read the roll's or
// the cling's heads either: scale-probe lowConfPhases, a manual scale QA record per version).
const TECH_POSES = {
  techGround: { envelope: { phases: [0], min: 0.45, max: 0.85 } },
  techRoll: { envelope: { phases: [0, 1], min: 0.3, max: 0.68 } },
  wallTech: { wall: [0, 1], contact: [0], envelope: { phases: [0], min: 0.35, max: 0.9 } },
};
// the wall line: a cell column just inside the cell margin. Its first `cols` columns must hold `minPx` opaque px on a
// cling frame (px at a 200 px standing body, scaled with standingBodyPx)
const WALL_LINE = 8;
const wallLineOf = (spec) => Math.max(WALL_LINE, spec.cellMargin);
const WALL_CONTACT = { cols: 4, minPx: 12 };

// Attack alts (ADR 0031, art/SPEC.md "Attack alts"): an alt plays its base's move data (startup, active, recovery,
// reach) AND its base's hit and hurt boxes, copied frame for frame (inheritAltBoxes), so a different technique never
// changes what connects. The drawn strike still has to land near the base's box, or the hit spark (drawn where the
// boxes overlap) floats away from the fist or foot: altCheck compares the alt's own active-phase boxes (the auto
// finder or a hitboxes.json entry on the alt, before inheritance) with the base's, in cell px facing right. reach =
// the far edge right of the pivot, height = the vertical centre above the floor line. Warn only.
const ALT_TOLERANCE = { reachPx: 24, centrePx: 24 };

// Frame indices of an animation's beats (phase indices) for a strip of n frames (its phases rescaled to n, as packed).
function beatFrames(phases, n, beats) {
  const ph = phases && beats?.length ? rescalePhases(phases, n) : null;
  const out = new Set();
  if (!ph) return out;
  let start = 0;
  ph.forEach((c, i) => {
    if (beats.includes(i)) for (let k = start; k < start + c; k++) out.add(k);
    start += c;
  });
  return out;
}

// Used only if src/art/animGuide.js cannot be imported or parsed.
const FALLBACK_GUIDE = {
  idle: { frames: 8, loop: true }, run: { frames: 8, loop: true }, dash: { frames: 2, loop: true }, backDash: { frames: 3 },
  superDash: { frames: 2, loop: true }, jumpSquat: { frames: 1 }, jumpUp: { frames: 2, loop: true }, jumpFall: { frames: 2, loop: true },
  land: { frames: 2 }, light1: { frames: 7, phases: [2, 2, 3] }, light2: { frames: 7, phases: [2, 2, 3] }, light3: { frames: 7, phases: [2, 2, 3] },
  light4: { frames: 8, phases: [3, 2, 3] }, heavy: { frames: 8, phases: [3, 2, 3] }, airLight1: { frames: 5, phases: [1, 2, 2] },
  airLight2: { frames: 5, phases: [1, 2, 2] }, airLight3: { frames: 6, phases: [2, 2, 2] }, airHeavy: { frames: 6, phases: [2, 2, 2] },
  guard: { frames: 2, loop: true }, block: { frames: 2 }, hurtHigh: { frames: 3 }, hurtLow: { frames: 3 }, launched: { frames: 2, loop: true },
  spin: { frames: 4, loop: true }, airRecover: { frames: 3 }, down: { frames: 2 }, getup: { frames: 5 }, charge: { frames: 6, loop: true, loopFrom: 2 },
  throw: { frames: 4, phases: [1, 1, 2] }, beamCharge: { frames: 3, loop: true }, beamFire: { frames: 3, loop: true }, vanish: { frames: 2 },
  stagger: { frames: 4, loop: true }, ko: { frames: 1 }, special: { frames: 8, phases: [3, 3, 2] }, intro: { frames: 4, loop: true },
  taunt: { frames: 2, loop: true }, win: { frames: 4, loop: true },
  techGround: { frames: 4, phases: [1, 2, 1] }, techRoll: { frames: 6, phases: [1, 4, 1] }, wallTech: { frames: 5, phases: [2, 1, 2] },
  beamStruggle: { frames: 3, loop: true }, beamStruggleAir: { frames: 3, loop: true },
  light1Alt: { frames: 7, phases: [2, 2, 3], altOf: 'light1' }, light2Alt: { frames: 7, phases: [2, 2, 3], altOf: 'light2' },
  light3Alt: { frames: 7, phases: [2, 2, 3], altOf: 'light3' }, light4Alt: { frames: 8, phases: [3, 2, 3], altOf: 'light4' },
  heavyAlt: { frames: 8, phases: [3, 2, 3], altOf: 'heavy' }, airLight1Alt: { frames: 5, phases: [1, 2, 2], altOf: 'airLight1' },
  airLight2Alt: { frames: 5, phases: [1, 2, 2], altOf: 'airLight2' }, airLight3Alt: { frames: 6, phases: [2, 2, 2], altOf: 'airLight3' },
  airHeavyAlt: { frames: 6, phases: [2, 2, 2], altOf: 'airHeavy' }, hurtHighAlt: { frames: 3, altOf: 'hurtHigh' }, hurtLowAlt: { frames: 3, altOf: 'hurtLow' },
};

// VFX atlas spec. fill = size of the largest frame of the strip as a fraction of the cell
// (matches the procedural effects in src/art/vfxPainter.js so world sizes stay the same).
// baseX: bottom effects centered on the mean x of their base rows (keeps a leaning tip leaning).
// lumaAlpha: drawn as opaque grey rings on magenta; packed as white with alpha = grey value.
const VFX = Object.freeze({ cell: 128, ppu: 56, baseline: 120 });
// Signature effects (ADR 0044): twice the cell and the density, the same world size per cell (256 / 112 = 128 / 56).
// They pack into their own page, atlas_hd.png, described by atlas.json's `hd` block.
const VFX_HD = Object.freeze({ cell: 256, ppu: 112, baseline: 240 });
const VFX_EFFECTS = {
  spark: { frames: 5, ms: 30, tinted: true, fill: 0.85 },
  burst: { frames: 5, ms: 35, tinted: true, fill: 0.9 },
  ring: { frames: 6, ms: 35, tinted: true, fill: 0.94 },
  dust: { frames: 6, ms: 60, tinted: false, fill: 0.6 },
  smoke: { frames: 7, ms: 55, tinted: false, fill: 0.7 },
  shuriken: { frames: 4, ms: 40, tinted: false, fill: 0.3 },
  fire: { frames: 4, ms: 60, tinted: false, fill: 0.62 },
  flame: { frames: 7, ms: 55, tinted: true, fill: 0.75, anchor: 'bottom', baseX: true },
  lightning: { frames: 6, ms: 40, tinted: true, fill: 0.9 },
  orb: { frames: 6, ms: 40, tinted: false, fill: 0.42 },
  glow: { frames: 2, ms: 60, tinted: true, fill: 0.82, lumaAlpha: true },
  streak: { frames: 6, ms: 45, tinted: true, fill: 0.8, anchor: 'bottom' },
  star: { frames: 5, ms: 40, tinted: true, fill: 0.4 },
  crater: { frames: 3, ms: 1000, tinted: false, fill: 0.97 },
  lines: { frames: 4, ms: 40, tinted: true, fill: 0.95 },
  // canon power-ups (ENG-069, ADR 0023): drawn white, tinted per fighter at runtime
  bubble: { frames: 6, ms: 50, tinted: true, fill: 0.3 },
  wisp: { frames: 7, ms: 55, tinted: true, fill: 0.6, anchor: 'bottom', baseX: true },
  arc: { frames: 6, ms: 40, tinted: true, fill: 0.45 },
  ripple: { frames: 5, ms: 50, tinted: true, fill: 0.95 },
  naruto_chakraTail: { frames: 6, ms: 60, tinted: true, fill: 0.7, anchor: 'bottom', baseX: true },
  dustWave: { frames: 6, ms: 60, tinted: false, fill: 0.7, anchor: 'bottom' }, // ground damage (ADR 0024)
  // beam clash (ADR 0034). The stream bands tile horizontally: they ship as exact 128 x 128 frames in
  // art/vfx/frames/<effect>/ (final, never rescaled or re-centered); fill 1 keeps a full-width strip edge to edge
  clashBurst: { frames: 6, ms: 45, tinted: true, fill: 0.9 },
  streamBolt: { frames: 4, ms: 40, tinted: true, fill: 1, tile: true },
  streamLance: { frames: 4, ms: 40, tinted: true, fill: 1, tile: true },
  streamFlame: { frames: 4, ms: 50, tinted: false, fill: 1, tile: true },
  redOrb: { frames: 6, ms: 40, tinted: false, fill: 0.5 },
  // Naruto's signature techniques (ENG-SKL-NAR, ADR 0044): HD cells, art/characters/naruto/SKILLS_REVAMP.md
  rasengan: { frames: 8, ms: 40, tinted: false, fill: 0.55, hd: true },
  rasenganForm: { frames: 6, ms: 45, tinted: false, fill: 0.55, hd: true },
  rasenganBurst: { frames: 8, ms: 45, tinted: false, fill: 0.98, hd: true },
  rasenshuriken: { frames: 8, ms: 35, tinted: false, fill: 0.9, hd: true },
  rasenshurikenDome: { frames: 8, ms: 50, tinted: false, fill: 0.98, hd: true },
  poof: { frames: 7, ms: 40, tinted: false, fill: 0.75, hd: true },
  subLog: { frames: 5, ms: 70, tinted: false, fill: 0.85, anchor: 'bottom', hd: true },
  fourTailsRoar: { frames: 8, ms: 45, tinted: false, fill: 0.98, hd: true },
  beastBall: { frames: 8, ms: 45, tinted: false, fill: 0.5, hd: true },
  beastBeamRing: { frames: 6, ms: 40, tinted: false, fill: 0.95, hd: true },
  // Sasuke's signature techniques (ENG-SKL-SAS): HD cells, art/characters/sasuke/SKILLS_REVAMP.md. kirinBody is stacked
  // end to end down the dragon, so it ships as exact 256 x 256 frames in art/vfx/frames/kirinBody/ (never rescaled)
  chidori: { frames: 8, ms: 35, tinted: false, fill: 0.6, hd: true },
  chidoriForm: { frames: 6, ms: 40, tinted: false, fill: 0.6, hd: true },
  chidoriBurst: { frames: 8, ms: 40, tinted: false, fill: 0.98, hd: true },
  chidoriSpear: { frames: 8, ms: 35, tinted: false, fill: 0.98, hd: true },
  chidoriCurrent: { frames: 8, ms: 40, tinted: false, fill: 0.98, hd: true },
  amaterasu: { frames: 8, ms: 60, tinted: false, fill: 0.9, anchor: 'bottom', hd: true },
  amaterasuIgnite: { frames: 6, ms: 45, tinted: false, fill: 0.95, hd: true },
  greatFireball: { frames: 8, ms: 45, tinted: false, fill: 0.9, hd: true },
  greatFireballBurst: { frames: 8, ms: 50, tinted: false, fill: 0.98, hd: true },
  stormCloud: { frames: 4, ms: 120, tinted: false, fill: 0.98, hd: true },
  kirinBody: { frames: 4, ms: 40, tinted: false, fill: 1, hd: true },
  kirinHead: { frames: 6, ms: 40, tinted: false, fill: 0.95, hd: true },
  kirinStrike: { frames: 8, ms: 45, tinted: false, fill: 0.98, anchor: 'bottom', hd: true },
  // Luffy's signature techniques (ENG-SKL-LUF): HD cells, art/characters/luffy/SKILLS_REVAMP.md. The arm tubes are
  // stretched along a line to any length, so they ship as exact 256 x 256 frames in art/vfx/frames/<name>/ (tile)
  gumArm: { frames: 2, ms: 60, tinted: false, fill: 1, tile: true, hd: true, owner: 'luffy' },
  gumFist: { frames: 4, ms: 40, tinted: false, fill: 0.55, hd: true, owner: 'luffy' },
  gumImpact: { frames: 7, ms: 35, tinted: false, fill: 0.85, hd: true, owner: 'luffy' },
  bazookaBlast: { frames: 8, ms: 45, tinted: false, fill: 0.98, hd: true, owner: 'luffy' },
  rocketSnap: { frames: 6, ms: 45, tinted: false, fill: 0.9, anchor: 'bottom', hd: true, owner: 'luffy' },
  whipSweep: { frames: 6, ms: 40, tinted: false, fill: 1, hd: true, owner: 'luffy' },
  gear2Steam: { frames: 8, ms: 60, tinted: false, fill: 0.95, anchor: 'bottom', hd: true, owner: 'luffy' },
  gear2Burst: { frames: 7, ms: 45, tinted: false, fill: 0.98, hd: true, owner: 'luffy' },
  gatlingFists: { frames: 6, ms: 35, tinted: false, fill: 0.98, hd: true, owner: 'luffy' },
  gear3Puff: { frames: 6, ms: 45, tinted: false, fill: 0.6, hd: true, owner: 'luffy' },
  gigantArm: { frames: 2, ms: 60, tinted: false, fill: 1, tile: true, hd: true, owner: 'luffy' },
  gigantFist: { frames: 4, ms: 40, tinted: false, fill: 0.98, hd: true, owner: 'luffy' },
  gigantImpact: { frames: 8, ms: 50, tinted: false, fill: 0.98, hd: true, owner: 'luffy' },
  luffyChibi: { frames: 6, ms: 80, tinted: false, fill: 0.45, anchor: 'bottom', hd: true, owner: 'luffy' },
};
const VFX_ALPHA_LEVELS = [0, 110, 200, 255];

// Per-character UI images: art/characters/<id>/ui/<name>.png -> public/characters/<id>/<name>.png
const UI_ITEMS = {
  portrait: { w: 96, h: 96, align: 'bottom' },
  cutin: { w: 480, h: 128, align: 'center' },
  select: { w: 384, h: 384, align: 'bottom' },
  // super banner and ultimate splash layers (ADR 0035): opaque backdrops are center-cropped to the aspect, the
  // fighter cutouts contain-fitted and bottom-aligned
  super_bg: { w: 768, h: 192, align: 'center' },
  super_fg: { w: 384, h: 240, align: 'bottom' },
  ult_bg: { w: 768, h: 432, align: 'center' },
  ult_fg: { w: 576, h: 432, align: 'bottom' },
};

const MAGENTA = [255, 0, 255];
const MARKER = '.packer.json';

// ============================================================== CLI
class UsageError extends Error {}

const HELP = `GCD Tourney sprite packer  (art/ -> public/)

usage: node tools/pack-sprites.mjs [targets...] [options]
       npm run sprites [targets...] [-- options]

targets   character ids (folder names under art/characters/), "vfx", "crowd", "stage", "npc", "ui", "decals", or "all"
          (default: every character + every world-art kind)

options
  --root <dir>      art folder to read (default: ./art). Aliases: --src, --art
  --out <dir>       public folder to write (default: ./public) -> <out>/characters/<id>/, <out>/vfx|crowd|stage|npc|ui/
  --manifest <file> manifest to read (default: <root>/manifest.json; falls back to src/art/animGuide.js)
  --guide <file>    animation guide module (default: src/art/animGuide.js)
  --dry-run         analyse and report, write nothing
  --no-writeback    do not write cleaned frames back to art/.../frames/<anim>/
  --quantize <n>    snap each character to an n-color palette (median cut over all its frames), e.g. 48; a fighter's
                    "paletteReserve" in the manifest gives the strips it lists their own share of the n (ADR 0046)
  --keep-palette    with --quantize: snap to the colours of the character's current sheet.png instead of a new median
                    cut, so a pack that resizes one strip leaves every other strip byte for byte (ADR 0041)
  --tolerance <n>   background color tolerance (RGB distance, default 72)
  --update-manifest raise "status" in art/manifest.json: packed anims/effects/ui -> "packed",
                    raw that could not be packed -> "raw". Never lowers a status ("approved" stays).
                    Also raises "version" to the highest raw/<anim>_vNN.png found ("approvedVersion" is never touched).
  --candidates      world art (vfx, crowd, stage, npc, ui, decals) is approval-gated: by default only items with an
                    "approvedVersion" in the manifest are packed, and stale outputs are removed when their
                    approval is gone. --candidates packs every latest candidate into <out>/preview/<kind>/
                    instead (git-ignored, local review with ?art=custom); the shipped folders stay untouched.
  --allow-drop      let the vfx atlas lose an effect it ships whose source (raw/ or frames/) is missing on disk;
                    without it the packer refuses (exit 1) and leaves the atlas as it is (TOOL-048)
  --json            print the report as JSON (for scripts/agents) instead of text
  --strict          exit code 2 when there are warnings
  --strict-scale    scale gate (art/CHARACTER_SCALE.md): every strip whose head is off the idle's is an error,
                    approved or not (to check a fighter before setting "scaleGate": "strict"). Without it only
                    unapproved strips (candidates, new fighters) and "scaleGate": "strict" characters fail;
                    approved strips are listed as findings. A failure writes nothing for that character (exit 1)
  --fit-head <list> auto head fit for these strips, e.g. killua:airLight1,killua:hurtHigh (same as the sidecar
                    anatomy { "measurement": "auto-head" }): a raw strip drawn at the wrong size is rescaled so
                    its head matches the idle's. Only a 'uniform' verdict is fitted
  --page-rows <n>   test aid: at most n cell rows per sheet page instead of the 4096 px limit (16 rows of 256 px),
                    to see a fighter on two pages (sheet.png + sheet2.png, TOOL-060) before it has 256 frames
  -h, --help        this help
`;

function parseArgs(argv) {
  const o = { targets: [], root: null, out: null, manifest: null, guide: null, dryRun: false, writeback: true, allowDrop: false, json: false, strict: false, quantize: 0, tol: 72, updateManifest: false, candidates: false, help: false, strictScale: false, fitHead: [], pageRows: 0 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const eq = a.indexOf('=');
    const key = a.startsWith('--') && eq > 0 ? a.slice(0, eq) : a;
    const val = () => {
      const v = a.startsWith('--') && eq > 0 ? a.slice(eq + 1) : argv[++i];
      if (v == null || v === '') throw new UsageError(`${key} needs a value`);
      return v;
    };
    const num = () => {
      const v = Number(val());
      if (!Number.isFinite(v)) throw new UsageError(`${key} needs a number`);
      return v;
    };
    switch (key) {
      case '--root': case '--src': case '--art': o.root = val(); break;
      case '--out': o.out = val(); break;
      case '--manifest': o.manifest = val(); break;
      case '--guide': o.guide = val(); break;
      case '--dry-run': o.dryRun = true; break;
      case '--no-writeback': o.writeback = false; break;
      case '--allow-drop': o.allowDrop = true; break;
      case '--json': o.json = true; break;
      case '--update-manifest': o.updateManifest = true; break;
      case '--candidates': o.candidates = true; break;
      case '--strict': o.strict = true; break;
      case '--strict-scale': o.strictScale = true; break;
      case '--fit-head': o.fitHead.push(...val().split(',').map((s) => s.trim()).filter(Boolean)); break;
      case '--quantize': o.quantize = Math.round(num()); break;
      case '--keep-palette': o.keepPalette = true; break;
      case '--tolerance': case '--tol': o.tol = num(); break;
      case '--page-rows': o.pageRows = num(); break;
      case '-h': case '--help': o.help = true; break;
      default:
        if (a.startsWith('-')) throw new UsageError(`unknown option ${a}`);
        o.targets.push(a);
    }
  }
  if (o.quantize && (o.quantize < 2 || o.quantize > 256)) throw new UsageError('--quantize must be between 2 and 256');
  if (!(o.tol > 0 && o.tol <= 442)) throw new UsageError('--tolerance must be between 1 and 442 (RGB distance)');
  if (o.pageRows && !(Number.isInteger(o.pageRows) && o.pageRows >= 1)) throw new UsageError('--page-rows must be a whole number of rows (1 or more)');
  for (const f of o.fitHead) if (!/^[^:\s]+:[^:\s]+$/.test(f)) throw new UsageError(`--fit-head takes <id>:<anim>[,<id>:<anim>...] (got "${f}")`);
  return o;
}

// ============================================================== fs helpers
const isDir = (p) => { try { return fs.statSync(p).isDirectory(); } catch { return false; } };
const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };
const listDir = (p) => { try { return fs.readdirSync(p, { withFileTypes: true }); } catch { return []; } };
const listDirs = (p) => listDir(p).filter((d) => d.isDirectory()).map((d) => d.name).sort();
const listFiles = (p) => listDir(p).filter((d) => d.isFile()).map((d) => d.name);
const natural = (a, b) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' });
const listPngs = (p) => listFiles(p).filter((n) => /\.png$/i.test(n)).sort(natural);
const sha1 = (buf) => crypto.createHash('sha1').update(buf).digest('hex');
const rel = (from, p) => path.relative(from, p).split(path.sep).join('/');

function readJson(file) {
  if (!isFile(file)) return { exists: false, data: null, error: null };
  try {
    return { exists: true, data: JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, '')), error: null };
  } catch (e) {
    return { exists: true, data: null, error: e.message };
  }
}

// ============================================================== image helpers (RGBA8)
function newImage(w, h) { return { w, h, data: new Uint8Array(w * h * 4) }; }
function flipH(img) {
  const out = newImage(img.w, img.h);
  for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) {
    const s = (y * img.w + x) * 4, d = (y * img.w + (img.w - 1 - x)) * 4;
    for (let k = 0; k < 4; k++) out.data[d + k] = img.data[s + k];
  }
  return out;
}

const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const MAX_PIXELS = 40e6; // ChatGPT images are ~2 MP; anything this big is a mistake and could exhaust memory

function readPng(file) {
  const buf = fs.readFileSync(file);
  if (!buf.length) throw new Error('empty file');
  if (buf.length < 24 || !buf.subarray(0, 8).equals(PNG_SIG)) throw new Error('not a PNG file (wrong signature - re-save it as PNG)');
  const w0 = buf.readUInt32BE(16), h0 = buf.readUInt32BE(20);
  if (w0 * h0 > MAX_PIXELS) throw new Error(`image too large (${w0}x${h0})`);
  let png;
  try { png = PNG.sync.read(buf); } catch (e) { throw new Error(`corrupt PNG (${e.message})`); }
  return { w: png.width, h: png.height, data: new Uint8Array(png.data.buffer, png.data.byteOffset, png.data.length) };
}

function encodePng(img) {
  const png = new PNG({ width: img.w, height: img.h });
  png.data = Buffer.from(img.data.buffer, img.data.byteOffset, img.data.length);
  return PNG.sync.write(png, { colorType: 6 });
}

function crop(img, x0, y0, w, h) {
  const out = newImage(w, h);
  for (let y = 0; y < h; y++) {
    const sy = y0 + y;
    if (sy < 0 || sy >= img.h) continue;
    for (let x = 0; x < w; x++) {
      const sx = x0 + x;
      if (sx < 0 || sx >= img.w) continue;
      const si = (sy * img.w + sx) * 4, di = (y * w + x) * 4;
      out.data[di] = img.data[si]; out.data[di + 1] = img.data[si + 1]; out.data[di + 2] = img.data[si + 2]; out.data[di + 3] = img.data[si + 3];
    }
  }
  return out;
}

// Copy src into dst at (dx, dy). Returns how many opaque src pixels fell outside dst.
function blit(dst, src, dx, dy) {
  let lost = 0;
  for (let y = 0; y < src.h; y++) {
    for (let x = 0; x < src.w; x++) {
      const si = (y * src.w + x) * 4;
      if (!src.data[si + 3]) continue;
      const tx = x + dx, ty = y + dy;
      if (tx < 0 || ty < 0 || tx >= dst.w || ty >= dst.h) { lost++; continue; }
      const di = (ty * dst.w + tx) * 4;
      dst.data[di] = src.data[si]; dst.data[di + 1] = src.data[si + 1]; dst.data[di + 2] = src.data[si + 2]; dst.data[di + 3] = src.data[si + 3];
    }
  }
  return lost;
}

function bbox(img, x0 = 0, y0 = 0, x1 = img.w - 1, y1 = img.h - 1) {
  let bx0 = Infinity, by0 = Infinity, bx1 = -1, by1 = -1, n = 0;
  const d = img.data;
  for (let y = Math.max(0, y0); y <= Math.min(img.h - 1, y1); y++) {
    for (let x = Math.max(0, x0); x <= Math.min(img.w - 1, x1); x++) {
      if (!d[(y * img.w + x) * 4 + 3]) continue;
      n++;
      if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y;
    }
  }
  return n ? { x0: bx0, y0: by0, x1: bx1, y1: by1, w: bx1 - bx0 + 1, h: by1 - by0 + 1, n } : null;
}

function trim(img) {
  const b = bbox(img);
  return b ? crop(img, b.x0, b.y0, b.w, b.h) : null;
}

const dist2 = (d, i, c) => (d[i] - c[0]) ** 2 + (d[i + 1] - c[1]) ** 2 + (d[i + 2] - c[2]) ** 2;
const isMagentaish = (c) => c[0] > 170 && c[2] > 170 && c[1] < 100;
// Anti-aliased magenta fringe (magenta blended with the outline/body colors).
const isMagentaHue = (r, g, b) => {
  const mn = Math.min(r, b);
  return mn > 70 && mn - g > 60 && Math.abs(r - b) < 0.35 * Math.max(r, b) + 20;
};

// Remove a flat background: cluster the border colors, flood-fill them from the edges, then
// drop every near-magenta pixel (magenta never appears in characters) and magenta fringe.
// mode 'char' binarizes alpha (hard pixels); mode 'vfx' keeps alpha (quantized later).
// Already-transparent art (a transparent border) keeps every opaque color: a tightly cropped frame
// touches the border with its own outline, which must not be mistaken for a background.
// A non-magenta background (white, black, ...) is off-spec: in 'char' mode it is flooded with half
// the tolerance so the dark outline survives next to a dark background (reported as `foreign`).
function removeBackground(img, { tol = 72, mode = 'char' } = {}) {
  const { w, h, data: d } = img;
  const tol2 = tol * tol;
  const clusters = [];
  let borderN = 0, borderClear = 0;
  const addBorder = (x, y) => {
    const i = (y * w + x) * 4;
    borderN++;
    if (d[i + 3] < 16) { borderClear++; return; }
    const side = (y === 0 ? 1 : 0) | (y === h - 1 ? 2 : 0) | (x === 0 ? 4 : 0) | (x === w - 1 ? 8 : 0);
    let best = null, bd = Infinity;
    for (const c of clusters) {
      const dd = dist2(d, i, [c.r / c.n, c.g / c.n, c.b / c.n]);
      if (dd < bd) { bd = dd; best = c; }
    }
    if (best && bd <= tol2 / 4) { best.r += d[i]; best.g += d[i + 1]; best.b += d[i + 2]; best.n++; best.sides |= side; }
    else if (clusters.length < 24) clusters.push({ r: d[i], g: d[i + 1], b: d[i + 2], n: 1, sides: side });
  };
  for (let x = 0; x < w; x++) { addBorder(x, 0); if (h > 1) addBorder(x, h - 1); }
  for (let y = 1; y < h - 1; y++) { addBorder(0, y); if (w > 1) addBorder(w - 1, y); }
  const mean = (c) => [c.r / c.n, c.g / c.n, c.b / c.n];
  const magN = clusters.filter((c) => isMagentaish(mean(c))).reduce((s, c) => s + c.n, 0);
  // On a magenta strip, another border color is background only if it spans the image (a ground band,
  // a frame) - feet or hair cut by one edge of a tight crop are character, not background.
  const spans = (c) => (c.sides & 3) === 3 || (c.sides & 12) === 12;
  let seeds = clusters.filter((c) => c.n >= borderN * 0.08 && (magN < borderN * 0.5 || isMagentaish(mean(c)) || spans(c))).map(mean);
  if (borderClear >= borderN * 0.25) seeds = seeds.filter(isMagentaish);
  const magentaBg = seeds.some(isMagentaish);
  const foreignSeeds = seeds.filter((c) => !isMagentaish(c));
  const foreign = foreignSeeds.length ? '#' + foreignSeeds[0].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('') : null;
  seeds.push(MAGENTA);
  const seedTol2 = seeds.map((c) => (mode === 'char' && !isMagentaish(c) ? tol2 / 4 : tol2));
  const isBg = (i) => d[i + 3] < 16 || seeds.some((c, k) => dist2(d, i, c) <= seedTol2[k]);

  const N = w * h;
  const seen = new Uint8Array(N);
  const stack = new Int32Array(N);
  let sp = 0;
  const push = (p) => { if (!seen[p]) { seen[p] = 1; stack[sp++] = p; } };
  for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
  let removed = 0;
  while (sp) {
    const p = stack[--sp];
    const i = p * 4;
    if (!isBg(i)) continue;
    if (d[i + 3]) removed++;
    d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
    const x = p % w;
    if (x > 0) push(p - 1);
    if (x < w - 1) push(p + 1);
    if (p >= w) push(p - w);
    if (p < N - w) push(p + w);
  }
  // enclosed background (between arm and body...): anything still near the magenta seeds
  const mSeeds = [MAGENTA, ...seeds.filter(isMagentaish)];
  for (let p = 0; p < N; p++) {
    const i = p * 4;
    if (d[i + 3] && mSeeds.some((c) => dist2(d, i, c) <= tol2)) { d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0; removed++; }
  }
  // fringe: magenta-hued pixels touching transparency (2 passes)
  if (magentaBg) {
    for (let pass = 0; pass < 2; pass++) {
      const kill = [];
      for (let p = 0; p < N; p++) {
        const i = p * 4;
        if (!d[i + 3] || !isMagentaHue(d[i], d[i + 1], d[i + 2])) continue;
        const x = p % w;
        if ((x > 0 && !d[i - 1]) || (x < w - 1 && !d[i + 7]) || (p >= w && !d[i - w * 4 + 3]) || (p < N - w && !d[i + w * 4 + 3])) kill.push(i);
      }
      for (const i of kill) d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
      removed += kill.length;
      if (!kill.length) break;
    }
  }
  if (mode === 'char') {
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 128) d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
      else d[i + 3] = 255;
    }
  } else {
    quantizeAlpha(img);
  }
  return { removed, magentaBg, foreign, seeds: seeds.length - 1 };
}

function quantizeAlpha(img, levels = VFX_ALPHA_LEVELS) {
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const a = d[i + 3];
    let best = levels[0];
    for (const l of levels) if (Math.abs(l - a) < Math.abs(best - a)) best = l;
    if (a < 40) best = 0;
    if (!best) d[i] = d[i + 1] = d[i + 2] = 0;
    d[i + 3] = best;
  }
}

// 8-connected components of the opaque pixels: label per pixel + { n, x0, y0, x1, y1 } per id (comps[0] unused).
function components(img) {
  const { w, h, data: d } = img;
  const N = w * h;
  const label = new Int32Array(N);
  const stack = new Int32Array(N);
  const comps = [null];
  for (let p0 = 0; p0 < N; p0++) {
    if (label[p0] || !d[p0 * 4 + 3]) continue;
    const id = comps.length;
    const c = { n: 0, x0: w, y0: h, x1: -1, y1: -1 };
    let sp = 0;
    label[p0] = id;
    stack[sp++] = p0;
    while (sp) {
      const p = stack[--sp];
      const x = p % w, y = (p - x) / w;
      c.n++;
      if (x < c.x0) c.x0 = x; if (x > c.x1) c.x1 = x; if (y < c.y0) c.y0 = y; if (y > c.y1) c.y1 = y;
      for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= w || (!dx && !dy)) continue;
          const q = yy * w + xx;
          if (!label[q] && d[q * 4 + 3]) { label[q] = id; stack[sp++] = q; }
        }
      }
    }
    comps.push(c);
  }
  return { label, comps };
}

function clearLabels(img, label, kill) {
  const d = img.data;
  for (let p = 0; p < label.length; p++) if (kill[label[p]]) { const i = p * 4; d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0; }
}

// The poses of a strip as whole figures (TITLE-STITCH), for when a column split cuts one: the `expected` biggest
// 8-connected components are the bodies (at least 4x bigger than the next component and 15 % of the biggest, so the
// choice is clear-cut), every smaller component joins the body whose box is nearest (a detached hair strand, a sleeve
// tip). expected 0 = every component of a quarter of the biggest or more. Returns the figures as trimmed images ordered
// left to right by box centre, or null when that is not clear-cut (two poses really touch).
function figureSplit(img, expected = 0) {
  const { label, comps } = components(img);
  const list = comps.slice(1).map((c, i) => ({ ...c, id: i + 1 })).sort((a, b) => b.n - a.n);
  if (!list.length) return null;
  let n = expected || list.filter((c) => c.n >= list[0].n * 0.25).length;
  if (list.length < n) return null;
  const smallest = list[n - 1].n, next = list[n]?.n ?? 0;
  if (smallest < list[0].n * 0.15 || smallest < next * 4) return null;
  const bodies = list.slice(0, n).map((c) => ({ x0: c.x0, y0: c.y0, x1: c.x1, y1: c.y1, ids: new Set([c.id]), cx: (c.x0 + c.x1) / 2 }));
  const gapTo = (a, b) => Math.hypot(Math.max(0, a.x0 - b.x1, b.x0 - a.x1), Math.max(0, a.y0 - b.y1, b.y0 - a.y1));
  for (const c of list.slice(n)) {
    let best = bodies[0], bd = Infinity;
    for (const b of bodies) { const g = gapTo(c, b); if (g < bd) { bd = g; best = b; } }
    best.ids.add(c.id);
    best.x0 = Math.min(best.x0, c.x0); best.y0 = Math.min(best.y0, c.y0); best.x1 = Math.max(best.x1, c.x1); best.y1 = Math.max(best.y1, c.y1);
  }
  return bodies.sort((a, b) => a.cx - b.cx).map((b) => {
    const out = newImage(b.x1 - b.x0 + 1, b.y1 - b.y0 + 1);
    for (let y = b.y0; y <= b.y1; y++) for (let x = b.x0; x <= b.x1; x++) {
      if (!b.ids.has(label[y * img.w + x])) continue;
      const i = (y * img.w + x) * 4, o = ((y - b.y0) * out.w + (x - b.x0)) * 4;
      out.data[o] = img.data[i]; out.data[o + 1] = img.data[i + 1]; out.data[o + 2] = img.data[i + 2]; out.data[o + 3] = img.data[i + 3];
    }
    return out;
  });
}

// Where a column split cuts a figure: the frame pairs "k/k+1" for every connected component with at least `min` pixels
// on both sides of a frame boundary (a hand reaching over the next pose's column, its fingertips landing in that frame).
function cutFigures(img, rects, min = 6) {
  const { label } = components(img);
  const seen = new Map(); // label -> Map(rect index -> pixels)
  rects.forEach((r, k) => {
    for (let y = r.y0; y < r.y1; y++) for (let x = r.x0; x < r.x1; x++) {
      const l = label[y * img.w + x];
      if (!l) continue;
      let m = seen.get(l);
      if (!m) seen.set(l, (m = new Map()));
      m.set(k, (m.get(k) || 0) + 1);
    }
  });
  const pairs = new Set();
  for (const m of seen.values()) {
    const ks = [...m].filter(([, n]) => n >= min).map(([k]) => k).sort((a, b) => a - b);
    for (let i = 1; i < ks.length; i++) pairs.add(`${ks[i - 1]}/${ks[i]}`);
  }
  return [...pairs];
}

// Drop tiny disconnected blobs (noise, stray specks).
function removeSpecks(img, { frac = 0.0015, min = 4 } = {}) {
  const { label, comps } = components(img);
  // a loop, not Math.max(...): a noisy image can have 100k+ blobs (spread would overflow the stack)
  let largest = 0;
  for (let k = 1; k < comps.length; k++) if (comps[k].n > largest) largest = comps[k].n;
  const limit = Math.max(min, largest * frac);
  let removed = 0, blobs = 0;
  const kill = new Uint8Array(comps.length);
  for (let k = 1; k < comps.length; k++) if (comps[k].n < limit) { kill[k] = 1; blobs++; removed += comps[k].n; }
  if (blobs) clearLabels(img, label, kill);
  return { blobs, removed };
}

// Sidecar "erase": [[x, y, w, h], ...] in raw-image pixels, painted magenta before background removal. For a leftover the
// automatic cleanup rightly keeps because it sits close to a body (the toe of an earlier version's pose left at a slot edge
// when one frame of a strip was replaced): the approved PNG stays immutable (ADR 0007) and the cleanup is recorded beside it.
function eraseRects(img, list, warn) {
  let n = 0;
  for (const r of list) {
    const ok = Array.isArray(r) && r.length === 4 && r.every((v) => Number.isInteger(v)) && r[0] >= 0 && r[1] >= 0 && r[2] > 0 && r[3] > 0;
    if (!ok || r[0] >= img.w || r[1] >= img.h) { warn(`sidecar "erase" ${JSON.stringify(r)} ignored - expected [x, y, w, h] integers inside the ${img.w}x${img.h} raw image`); continue; }
    const x1 = Math.min(img.w, r[0] + r[2]), y1 = Math.min(img.h, r[1] + r[3]);
    for (let y = r[1]; y < y1; y++) for (let x = r[0]; x < x1; x++) {
      const i = (y * img.w + x) * 4;
      img.data[i] = 255; img.data[i + 1] = 0; img.data[i + 2] = 255; img.data[i + 3] = 255;
    }
    n++;
  }
  return n;
}

// Per-frame cleanup of a raw character pose: a small blob far from the body (a stray mark above the
// head) or below the soles would set the trimmed height (= the scale of the whole animation) or the
// floor line. Small blobs close to the body (smears, sweat drops, sparks at the fist) are kept.
function dropStrays(img, { frac = 0.02, far = 0.1 } = {}) {
  const { label, comps } = components(img);
  if (comps.length <= 2) return 0;
  let L = 0;
  for (let k = 1; k < comps.length; k++) if (comps[k].n > L) L = comps[k].n;
  const main = { x0: Infinity, y0: Infinity, x1: -1, y1: -1 };
  for (let k = 1; k < comps.length; k++) {
    const c = comps[k];
    if (c.n < L * 0.1) continue;
    main.x0 = Math.min(main.x0, c.x0); main.y0 = Math.min(main.y0, c.y0); main.x1 = Math.max(main.x1, c.x1); main.y1 = Math.max(main.y1, c.y1);
  }
  const reach = far * (main.y1 - main.y0 + 1);
  const kill = new Uint8Array(comps.length);
  let n = 0;
  for (let k = 1; k < comps.length; k++) {
    const c = comps[k];
    if (c.n >= L * frac) continue;
    const gap = Math.max(0, c.x0 - main.x1, main.x0 - c.x1, c.y0 - main.y1, main.y0 - c.y1);
    if (gap > reach || c.y0 > main.y1) { kill[k] = 1; n++; }
  }
  if (n) clearLabels(img, label, kill);
  return n;
}

// Downscale by taking the most common color of each source block (palette-preserving, no blur).
function downscaleMode(img, w2, h2, { coverage = 0.5, alphaMin = 128 } = {}) {
  const { w, h, data: s } = img;
  const out = newImage(w2, h2);
  const d = out.data;
  const buckets = new Map();
  const exact = new Map();
  for (let y = 0; y < h2; y++) {
    const sy0 = Math.floor((y * h) / h2), sy1 = Math.max(sy0 + 1, Math.floor(((y + 1) * h) / h2));
    for (let x = 0; x < w2; x++) {
      const sx0 = Math.floor((x * w) / w2), sx1 = Math.max(sx0 + 1, Math.floor(((x + 1) * w) / w2));
      buckets.clear();
      let opaque = 0, total = 0, bestKey = -1, bestN = 0;
      for (let yy = sy0; yy < sy1; yy++) {
        for (let xx = sx0; xx < sx1; xx++) {
          const i = (yy * w + xx) * 4;
          total++;
          if (s[i + 3] < alphaMin) continue;
          opaque++;
          const key = ((s[i] >> 3) << 10) | ((s[i + 1] >> 3) << 5) | (s[i + 2] >> 3);
          const n = (buckets.get(key) || 0) + 1;
          buckets.set(key, n);
          if (n > bestN) { bestN = n; bestKey = key; }
        }
      }
      if (!opaque || opaque < total * coverage) continue;
      // exact most common color inside the winning bucket (keeps the source palette exactly)
      exact.clear();
      let bestC = 0, bestCN = 0;
      for (let yy = sy0; yy < sy1; yy++) {
        for (let xx = sx0; xx < sx1; xx++) {
          const i = (yy * w + xx) * 4;
          if (s[i + 3] < alphaMin) continue;
          if ((((s[i] >> 3) << 10) | ((s[i + 1] >> 3) << 5) | (s[i + 2] >> 3)) !== bestKey) continue;
          const c = ((s[i] << 24) | (s[i + 1] << 16) | (s[i + 2] << 8) | s[i + 3]) >>> 0;
          const n = (exact.get(c) || 0) + 1;
          exact.set(c, n);
          if (n > bestCN) { bestCN = n; bestC = c; }
        }
      }
      const o = (y * w2 + x) * 4;
      d[o] = bestC >>> 24; d[o + 1] = (bestC >>> 16) & 255; d[o + 2] = (bestC >>> 8) & 255; d[o + 3] = bestC & 255;
    }
  }
  return out;
}

function upscaleNearest(img, w2, h2) {
  const out = newImage(w2, h2);
  for (let y = 0; y < h2; y++) {
    const sy = Math.min(img.h - 1, Math.floor((y * img.h) / h2));
    for (let x = 0; x < w2; x++) {
      const sx = Math.min(img.w - 1, Math.floor((x * img.w) / w2));
      const si = (sy * img.w + sx) * 4, di = (y * w2 + x) * 4;
      out.data[di] = img.data[si]; out.data[di + 1] = img.data[si + 1]; out.data[di + 2] = img.data[si + 2]; out.data[di + 3] = img.data[si + 3];
    }
  }
  return out;
}

function resample(img, s, opts) {
  if (s === 1) return img;
  const w2 = Math.max(1, Math.round(img.w * s)), h2 = Math.max(1, Math.round(img.h * s));
  return s < 1 ? downscaleMode(img, w2, h2, opts) : upscaleNearest(img, w2, h2);
}

// ChatGPT cannot draw partial transparency on magenta, so `glow` is drawn as opaque grey rings:
// white with alpha = brightness (#FFFFFF 100%, #B4B4B4 ~70%, #5A5A5A ~35%; quantizeAlpha snaps the steps).
// Multiplying by the existing alpha leaves already-converted (white + alpha) art unchanged.
function lumaToAlpha(img) {
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    if (!d[i + 3]) continue;
    const l = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    d[i + 3] = Math.round((d[i + 3] * l) / 255);
    d[i] = d[i + 1] = d[i + 2] = 255;
  }
}

function toGreyscale(img) {
  const d = img.data;
  let colored = 0, opaque = 0;
  for (let i = 0; i < d.length; i += 4) {
    if (!d[i + 3]) continue;
    opaque++;
    const mx = Math.max(d[i], d[i + 1], d[i + 2]), mn = Math.min(d[i], d[i + 1], d[i + 2]);
    if (mx - mn > 40) colored++;
    const l = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
    d[i] = d[i + 1] = d[i + 2] = l;
  }
  return opaque ? colored / opaque : 0;
}

// ============================================================== strip splitting
// Runs of non-zero entries in occ, bridging zero-gaps shorter than minGap. Returns [[start, end)].
function runs(occ, minGap) {
  const out = [];
  let start = -1, lastOn = -1;
  for (let i = 0; i < occ.length; i++) {
    if (!occ[i]) continue;
    if (start < 0) start = i;
    else if (i - lastOn - 1 >= minGap) { out.push([start, lastOn + 1]); start = i; }
    lastOn = i;
  }
  if (start >= 0) out.push([start, lastOn + 1]);
  return out;
}

const median = (arr) => {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

// Split [a, b) into k parts, cutting at the emptiest column near each even cut.
function smartCuts(colOcc, a, b, k) {
  const parts = [];
  let prev = a;
  const step = (b - a) / k;
  for (let j = 1; j < k; j++) {
    const target = Math.round(a + j * step);
    const win = Math.max(1, Math.round(step * 0.2));
    let best = target, bestV = Infinity;
    for (let x = Math.max(prev + 1, target - win); x <= Math.min(b - 1, target + win); x++) {
      const v = colOcc[x];
      if (v < bestV || (v === bestV && Math.abs(x - target) < Math.abs(best - target))) { bestV = v; best = x; }
    }
    parts.push([prev, best]);
    prev = best;
  }
  parts.push([prev, b]);
  return parts.filter(([s, e]) => e > s);
}

const peakOf = (colOcc, a, b) => { let m = 0; for (let x = a; x < b; x++) if (colOcc[x] > m) m = colOcc[x]; return m; };

// Does [s, e) hold two bodies, i.e. a deep column valley between two tall peaks?
function twoBodies(colOcc, s, e, tall) {
  const n = e - s;
  if (n < 3) return false;
  const suf = new Int32Array(n);
  for (let i = n - 1; i >= 0; i--) suf[i] = Math.max(i < n - 1 ? suf[i + 1] : 0, colOcc[s + i]);
  let pre = colOcc[s];
  for (let i = 1; i < n - 1; i++) {
    const v = colOcc[s + i];
    if (pre >= tall && suf[i + 1] >= tall && v <= 0.5 * Math.min(pre, suf[i + 1])) return true;
    if (v > pre) pre = v;
  }
  return false;
}

// Strip-splitting thresholds. Characters: every pose is a body-sized piece, so small pieces are props
// to fold in and two bodies are never merged into one frame (`bodies`). VFX: frames grow (a first spark
// is a fraction of the last one) and are often made of separate pieces (rays), and a ring's hollow
// middle looks like a gap between two bodies, so a "body" may be smaller but a valley must be nearly empty.
const SPLIT = {
  char: { tall: 0.45, valley: 0.35, minW: 0.12, bodies: true },
  vfx: { tall: 0.2, valley: 0.15, minW: 0.05, bodies: false },
};

// Split a run of touching poses at the deep column valleys between bodies. A body is a column at least
// P.tall x as tall as the run's tallest; a valley is <= P.valley x the smaller of the tallest columns on
// each side. Valleys, not even slices: touching poses (or growing VFX frames) differ in width, and a
// single pose (a big 1-pose image, a punch with a long arm) has no such valley, so it is never sliced
// into slivers. Returns the slices (>= 2) or null.
function sliceRun(colOcc, a, b, bandH, P) {
  const n = b - a;
  if (n < 3) return null;
  const tall = P.tall * peakOf(colOcc, a, b), valley = P.valley;
  const L = new Int32Array(n), R = new Int32Array(n);
  for (let i = 0; i < n; i++) L[i] = Math.max(i ? L[i - 1] : 0, colOcc[a + i]);
  for (let i = n - 1; i >= 0; i--) R[i] = Math.max(i < n - 1 ? R[i + 1] : 0, colOcc[a + i]);
  const deep = (i) => L[i - 1] >= tall && R[i + 1] >= tall && colOcc[a + i] <= valley * Math.min(L[i - 1], R[i + 1]);
  const cuts = [];
  for (let i = 1; i < n - 1; i++) {
    if (!deep(i)) continue;
    let best = i;
    for (; i < n - 1 && deep(i); i++) if (colOcc[a + i] < colOcc[a + best]) best = i;
    const x = a + best;
    // two valleys with no body between them (forearm, then the gap after the fist) are one valley: keep the deeper
    const prev = cuts[cuts.length - 1];
    if (prev !== undefined && peakOf(colOcc, prev, x) < tall) { if (colOcc[x] <= colOcc[prev]) cuts[cuts.length - 1] = x; }
    else cuts.push(x);
  }
  if (!cuts.length) return null;
  const edges = [a, ...cuts, b];
  const parts = edges.slice(1).map((e, q) => [edges[q], e]);
  const minW = Math.max(3, bandH * P.minW);
  return parts.every(([s, e]) => e - s >= minW && peakOf(colOcc, s, e) >= tall) ? parts : null;
}

// Runs that are clearly not a pose (small area AND short) are merged into the nearest run when close,
// dropped when far: a detached prop or speed line must not become a frame of its own.
function absorbFragments(cols, colOcc, notes) {
  for (let guard = 0; cols.length > 1 && guard < 200; guard++) {
    const st = cols.map(([a, b]) => { let n = 0; for (let x = a; x < b; x++) n += colOcc[x]; return { n, pk: peakOf(colOcc, a, b), w: b - a }; });
    const maxN = Math.max(...st.map((s) => s.n)), maxP = Math.max(...st.map((s) => s.pk));
    const frag = st.map((s) => s.n < maxN * 0.2 && s.pk < maxP * 0.5);
    const k = frag.indexOf(true);
    if (k < 0) break;
    const medW = median(st.filter((_, q) => !frag[q]).map((s) => s.w));
    const gapL = k > 0 ? cols[k][0] - cols[k - 1][1] : Infinity;
    const gapR = k < cols.length - 1 ? cols[k + 1][0] - cols[k][1] : Infinity;
    if (Math.min(gapL, gapR) <= medW) {
      const lo = Math.min(k, gapL <= gapR ? k - 1 : k + 1);
      cols.splice(lo, 2, [cols[lo][0], cols[lo + 1][1]]);
    } else {
      notes.push(`dropped a detached piece at x=${cols[k][0]}`);
      cols.splice(k, 1);
    }
  }
  return cols;
}

// Returns { rects: [{x0,x1,y0,y1}], notes: [] } in reading order. expected <= 0 means "auto".
function splitStrip(img, expected, { split = 'auto', mode = 'char' } = {}) {
  const P = SPLIT[mode] || SPLIT.char;
  const { w, h, data: d } = img;
  const notes = [];
  const rowOcc = new Int32Array(h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3]) rowOcc[y]++;
  let bands = runs(rowOcc, Math.max(2, Math.round(h * 0.01)));
  if (!bands.length) return { rects: [], notes };

  // merge thin bands (detached bits) into their nearest neighbour
  for (let guard = 0; bands.length > 1 && guard < 100; guard++) {
    const maxH = Math.max(...bands.map(([a, b]) => b - a));
    const k = bands.findIndex(([a, b]) => b - a < maxH * 0.3);
    if (k < 0) break;
    const gapL = k > 0 ? bands[k][0] - bands[k - 1][1] : Infinity;
    const gapR = k < bands.length - 1 ? bands[k + 1][0] - bands[k][1] : Infinity;
    const j = gapL <= gapR ? k - 1 : k + 1;
    const lo = Math.min(k, j);
    bands.splice(lo, 2, [bands[lo][0], bands[lo + 1][1]]);
  }

  const colOccOf = (y0, y1) => {
    const occ = new Int32Array(w);
    for (let y = y0; y < y1; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3]) occ[x]++;
    return occ;
  };

  // multi-row grid only if the bands span overlapping x ranges (a jump arc drawn in one row does not)
  if (bands.length > 1) {
    const ext = bands.map(([y0, y1]) => {
      const r = runs(colOccOf(y0, y1), 1);
      return [r[0][0], r[r.length - 1][1]];
    });
    let grid = true;
    for (let k = 1; k < ext.length; k++) {
      const ov = Math.min(ext[k][1], ext[k - 1][1]) - Math.max(ext[k][0], ext[k - 1][0]);
      const mn = Math.min(ext[k][1] - ext[k][0], ext[k - 1][1] - ext[k - 1][0]);
      if (ov < mn * 0.5) grid = false;
    }
    if (grid) notes.push(`grid of ${bands.length} rows detected`);
    else bands = [[bands[0][0], bands[bands.length - 1][1]]];
  }

  const rects = [];
  for (const [y0, y1] of bands) {
    const colOcc = colOccOf(y0, y1);
    let cols;
    if (split === 'even' && expected > 0 && bands.length === 1) {
      cols = smartCuts(colOcc, 0, w, expected);
    } else {
      cols = runs(colOcc, Math.max(2, Math.round((y1 - y0) * 0.01)));
      // tiny runs: merge into the closer neighbour, or drop if far away
      for (let guard = 0; cols.length > 1 && guard < 200; guard++) {
        const maxW = Math.max(...cols.map(([a, b]) => b - a));
        const medW = median(cols.map(([a, b]) => b - a));
        const k = cols.findIndex(([a, b]) => b - a < maxW * 0.12);
        if (k < 0) break;
        const gapL = k > 0 ? cols[k][0] - cols[k - 1][1] : Infinity;
        const gapR = k < cols.length - 1 ? cols[k + 1][0] - cols[k][1] : Infinity;
        if (Math.min(gapL, gapR) < medW * 0.5) {
          const j = gapL <= gapR ? k - 1 : k + 1;
          const lo = Math.min(k, j);
          cols.splice(lo, 2, [cols[lo][0], cols[lo + 1][1]]);
        } else {
          notes.push(`dropped a small detached blob at x=${cols[k][0]}`);
          cols.splice(k, 1);
        }
      }
      if (bands.length === 1 && expected > 0) {
        // too many pieces: first fold in detached props/smears, then merge the clearly-smaller gaps,
        // but never two bodies into one frame (punch poses sit closer together than idle poses)
        if (cols.length > expected && P.bodies) absorbFragments(cols, colOcc, notes);
        const tall = P.tall * peakOf(colOcc, 0, w);
        while (cols.length > expected) {
          const gaps = cols.slice(1).map((c, k) => c[0] - cols[k][1]);
          const mg = median(gaps);
          let k = 0;
          for (let q = 1; q < gaps.length; q++) if (gaps[q] < gaps[k]) k = q;
          if (!(gaps[k] < mg * 0.5) || (P.bodies && twoBodies(colOcc, cols[k][0], cols[k + 1][1], tall))) break;
          cols.splice(k, 2, [cols[k][0], cols[k + 1][1]]);
        }
        // too few: poses touch each other -> cut the (wide) runs at the valleys between bodies (sliceRun)
        if (cols.length < expected) {
          if (cols.length === 1) {
            const parts = sliceRun(colOcc, cols[0][0], cols[0][1], y1 - y0, P);
            if (parts) {
              cols = parts;
              notes.push(`poses touch: split into ${parts.length}`);
            } else notes.push(`found 1 pose, expected ${expected} - not sliced (leave a gap between poses, or add raw/<anim>.json { "split": "even" })`);
          } else {
            const refW = median(cols.map(([a, b]) => b - a));
            const out = [];
            let groups = 0, whole = 0;
            for (const [a, b] of cols) {
              if (b - a >= refW * 1.6) {
                const parts = sliceRun(colOcc, a, b, y1 - y0, P);
                if (parts) { out.push(...parts); groups++; continue; }
                whole++;
              }
              out.push([a, b]);
            }
            if (groups) notes.push(`split ${groups} touching pose group(s)`);
            if (whole) notes.push(`kept ${whole} wide pose(s) whole (a long limb, not touching poses)`);
            cols = out;
          }
        }
      }
    }
    for (const [x0, x1] of cols) rects.push({ x0, x1, y0, y1 });
  }
  return { rects, notes };
}

// ============================================================== guide + manifest
async function loadGuide(file) {
  try {
    const mod = await import(pathToFileURL(file).href);
    if (mod && mod.ANIM_GUIDE && typeof mod.ANIM_GUIDE === 'object') return { guide: normalizeGuide(mod.ANIM_GUIDE), source: 'animGuide.js' };
  } catch { /* fall through to text parsing */ }
  try {
    const text = fs.readFileSync(file, 'utf8');
    const block = text.slice(text.indexOf('ANIM_GUIDE'));
    const g = {};
    const re = /^\s*([A-Za-z]\w*)\s*:\s*\{([^}]*)\}/gm;
    let m;
    while ((m = re.exec(block))) {
      const body = m[2];
      const frames = /frames\s*:\s*(\d+)/.exec(body);
      if (!frames) continue;
      const phases = /phases\s*:\s*\[\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\]/.exec(body);
      g[m[1]] = { frames: +frames[1], loop: /loop\s*:\s*true/.test(body) };
      if (phases) g[m[1]].phases = [+phases[1], +phases[2], +phases[3]];
      const altOf = /altOf\s*:\s*'(\w+)'/.exec(body);
      if (altOf) g[m[1]].altOf = altOf[1];
      const loopFrom = /loopFrom\s*:\s*(\d+)/.exec(body);
      if (loopFrom) g[m[1]].loopFrom = +loopFrom[1];
    }
    if (Object.keys(g).length >= 10) return { guide: g, source: 'animGuide.js (parsed)' };
  } catch { /* fall through */ }
  return { guide: normalizeGuide(FALLBACK_GUIDE), source: 'built-in fallback' };
}

function normalizeGuide(g) {
  const out = {};
  for (const [name, a] of Object.entries(g)) {
    if (!a || typeof a !== 'object') continue;
    out[name] = { frames: a.frames | 0 || 1, loop: !!a.loop };
    if (Array.isArray(a.phases) && a.phases.length === 3) out[name].phases = a.phases.map((v) => v | 0);
    if (a.durations) out[name].durations = a.durations;
    if (a.ms) out[name].ms = a.ms;
    if (typeof a.altOf === 'string') out[name].altOf = a.altOf;
    if (Number.isInteger(a.loopFrom)) out[name].loopFrom = a.loopFrom;
  }
  return out;
}

// Accepts objects keyed by name or arrays of { id|name, ... }.
function entries(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x.filter((v) => v && typeof v === 'object').map((v) => [String(v.id ?? v.name ?? v.anim ?? v.effect ?? ''), v]).filter(([k]) => k);
  if (typeof x === 'object') return Object.entries(x).filter(([k, v]) => !k.startsWith('_') && v && typeof v === 'object');
  return [];
}

function normalizeAnimEntry(v) {
  const o = {};
  if (typeof v.frames === 'number') o.frames = v.frames;
  else if (Array.isArray(v.frames)) o.frames = v.frames.length;
  else if (typeof v.frameCount === 'number') o.frames = v.frameCount;
  if (Array.isArray(v.phases) && v.phases.length === 3) o.phases = v.phases.map((n) => n | 0);
  const bh = v.bodyHeight ?? v.body_height ?? v.height;
  if (typeof bh === 'number' && bh > 0) o.bodyHeight = bh;
  if (typeof v.required === 'boolean') o.required = v.required;
  if (typeof v.core === 'boolean') o.required = o.required || v.core;
  if (typeof v.loop === 'boolean') o.loop = v.loop;
  if (Number.isInteger(v.loopFrom) && v.loopFrom >= 0) o.loopFrom = v.loopFrom;
  if (Array.isArray(v.durations)) o.durations = v.durations;
  else if (Array.isArray(v.ms)) o.durations = v.ms;
  else if (typeof v.ms === 'number') o.ms = v.ms;
  if (typeof v.hitbox === 'boolean') o.hitbox = v.hitbox;
  if (typeof v.status === 'string') o.status = v.status;
  if (Number.isInteger(v.approvedVersion) && v.approvedVersion > 0) o.approvedVersion = v.approvedVersion;
  if (typeof v.altOf === 'string') o.altOf = v.altOf;
  // a strip drawn at the wrong size against its own fighter (ADR 0041): its bodyHeight fit times this, 0.5-1.5
  if (typeof v.packScale === 'number' && v.packScale >= 0.5 && v.packScale <= 1.5) o.packScale = v.packScale;
  return o;
}

// The manifest "spec" block -> the spec the packer follows. Missing keys take the spec v2 default silently;
// malformed ones are reported (issues) and take the default. Informational keys (adr, rawBackground) are not used.
function resolveSpec(raw, issues) {
  const s = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const D = SPEC_DEFAULTS;
  // a spec block without a name is not necessarily v2: do not label it as such in the report
  const out = { ...D, pivot: [...D.pivot], name: s === raw ? 'unnamed manifest spec' : D.name };
  const int = (v, lo, hi) => Number.isInteger(v) && v >= lo && v <= hi;
  const take = (k, ok, want) => {
    if (s[k] === undefined) return;
    if (ok(s[k])) out[k] = s[k];
    else issues.push(`spec.${k} is ${JSON.stringify(s[k])} - must be ${want}; using ${JSON.stringify(out[k])}`);
  };
  take('name', (v) => typeof v === 'string' && v.trim() !== '', 'a non-empty string');
  take('frameWidth', (v) => int(v, 16, 2048), 'an integer 16-2048');
  take('frameHeight', (v) => int(v, 16, 2048), 'an integer 16-2048');
  take('columns', (v) => int(v, 1, 64), 'an integer 1-64');
  // checked against the frame size actually in use (a default pivot may not fit a non-default cell)
  const pivotOk = (v) => Array.isArray(v) && v.length === 2 && int(v[0], 0, out.frameWidth - 1) && int(v[1], 0, out.frameHeight - 1);
  take('pivot', pivotOk, `[x, y] integers inside the ${out.frameWidth}x${out.frameHeight} cell`);
  if (!pivotOk(out.pivot)) {
    const fixed = [Math.floor(out.frameWidth / 2), out.frameHeight - 1 - Math.round(out.frameHeight / 16)];
    issues.push(`spec.pivot ${JSON.stringify(out.pivot)} does not fit the ${out.frameWidth}x${out.frameHeight} cell - using ${JSON.stringify(fixed)}`);
    out.pivot = fixed;
  }
  take('pixelsPerUnit', (v) => typeof v === 'number' && Number.isFinite(v) && v > 0, 'a positive number');
  take('facing', (v) => v === 'right' || v === 'left', '"right" or "left"');
  take('maxColors', (v) => int(v, 2, 256), 'an integer 2-256');
  take('warnColors', (v) => int(v, 2, 1 << 24), 'an integer >= 2');
  take('cellMargin', (v) => int(v, 0, Math.floor(Math.min(out.frameWidth, out.frameHeight) / 4)), `an integer 0-${Math.floor(Math.min(out.frameWidth, out.frameHeight) / 4)}`);
  take('standingBodyPx', (v) => typeof v === 'number' && v >= 8 && v <= out.frameHeight, `a number 8-${out.frameHeight}`);
  if (s.versionSuffix !== undefined && s.versionSuffix !== VERSION_SUFFIX) issues.push(`spec.versionSuffix is ${JSON.stringify(s.versionSuffix)} - the packer only reads ${VERSION_SUFFIX} file names`);
  return out;
}

function normalizeManifest(raw) {
  const m = { characters: {}, vfx: {}, defaults: {}, core: [], specIssues: [], spec: null };
  m.spec = resolveSpec(raw && typeof raw === 'object' ? raw.spec : null, m.specIssues);
  if (!raw || typeof raw !== 'object') return m;
  const defAnims = raw.animationDefaults ?? raw.animations ?? raw.defaults?.animations ?? raw.spec?.animations;
  for (const [name, v] of entries(defAnims)) m.defaults[name] = normalizeAnimEntry(v);
  if (Array.isArray(raw.coreAnimations)) m.core = raw.coreAnimations.filter((n) => typeof n === 'string');
  for (const [id, c] of entries(raw.characters)) {
    const anims = {};
    for (const [name, v] of entries(c.animations ?? c.anims)) anims[name] = normalizeAnimEntry(v);
    // standingBodyPx: a genuinely taller/shorter fighter (ADR 0010) scales the hitbox heuristics with its body
    const sb = Number(c.standingBodyPx);
    // packScale: the whole fighter resized against the cast without new drawings (ADR 0041): every strip's bodyHeight,
    // frameOffsets and hitboxes.json point are multiplied by it, so each drawing keeps its pose and only its size changes
    let packScale = 1;
    if (c.packScale !== undefined) {
      const ps = Number(c.packScale);
      if (ps >= 0.5 && ps <= 1.5) packScale = ps;
      else m.specIssues.push(`characters.${id}.packScale is ${JSON.stringify(c.packScale)} - must be a number 0.5-1.5; using 1`);
    }
    // paletteReserve: strips drawn in colours the rest of the fighter never uses (a transformation) get their own share of
    // the --quantize palette instead of being snapped to his usual colours (ADR 0046)
    const paletteReserve = [], reserved = new Set();
    for (const [name, g] of entries(c.paletteReserve)) {
      const colors = Number(g.colors), list = Array.isArray(g.animations) ? g.animations.filter((a) => typeof a === 'string' && a) : [];
      if (!Number.isInteger(colors) || colors < 1 || colors > 32 || !list.length) {
        m.specIssues.push(`characters.${id}.paletteReserve.${name} must be { "colors": 1-32, "animations": ["<anim>", ...] } - ignored`);
        continue;
      }
      const twice = list.filter((a) => reserved.has(a));
      if (twice.length) m.specIssues.push(`characters.${id}.paletteReserve.${name}: ${twice.join(', ')} already in another group - kept there`);
      const own = [...new Set(list.filter((a) => !reserved.has(a)))];
      own.forEach((a) => reserved.add(a));
      if (own.length) paletteReserve.push({ name, colors, animations: own });
    }
    m.characters[id] = { name: c.name, animations: anims, standingBodyPx: sb >= 8 && sb <= m.spec.frameHeight ? Math.round(sb * packScale) : null, packScale, paletteReserve };
  }
  const vfx = raw.vfx?.effects ?? raw.vfx ?? raw.effects;
  for (const [name, v] of entries(vfx)) {
    const e = {};
    const n = typeof v.frames === 'number' ? v.frames : Array.isArray(v.frames) ? v.frames.length : typeof v.n === 'number' ? v.n : undefined;
    if (n) e.frames = n;
    if (typeof v.ms === 'number') e.ms = v.ms;
    if (typeof v.tinted === 'boolean') e.tinted = v.tinted;
    else if (typeof v.tint === 'boolean') e.tinted = v.tint;
    else if (typeof v.colorRule === 'string') e.tinted = /tint|white/i.test(v.colorRule);
    else if (typeof v.color === 'string') e.tinted = /white|tint/i.test(v.color);
    if (typeof v.fill === 'number') e.fill = v.fill;
    // hd / tile: an effect the packer's table does not know yet (a new signature effect) still gets its page and tiling
    for (const k of ['lumaAlpha', 'baseX', 'hd', 'tile']) if (typeof v[k] === 'boolean') e[k] = v[k];
    if (v.anchor === 'bottom' || v.bottomAnchored === true) e.anchor = 'bottom';
    else if (v.anchor === 'center') e.anchor = 'center';
    if (Number.isInteger(v.approvedVersion) && v.approvedVersion > 0) e.approvedVersion = v.approvedVersion;
    m.vfx[name] = e;
  }
  // the VFX cell is still a packer constant (the effects' fill sizes are tuned to it): flag drift
  const v = raw.vfx;
  if (v && typeof v === 'object') {
    for (const [k, want] of [['cell', VFX.cell], ['ppu', VFX.ppu], ['baseline', VFX.baseline]]) if (v[k] !== undefined && v[k] !== want) m.specIssues.push(`vfx.${k} is ${v[k]}, packer uses ${want}`);
  }
  return m;
}

// Ordered animation definitions for one character: guide order, then manifest-only extras.
function animDefsFor(id, env) {
  const mc = env.manifest.characters[id]?.animations || {};
  const names = [...Object.keys(env.guide)];
  for (const n of [...Object.keys(env.manifest.defaults), ...Object.keys(mc)]) if (!names.includes(n)) names.push(n);
  return names.map((name) => {
    const g = env.guide[name] || {};
    const d = env.manifest.defaults[name] || {};
    const c = mc[name] || {};
    // an attack alt (ADR 0031) packs like this fighter's base strip wherever its own entry is silent: same frames,
    // phases and timing (the packer warns when a drawn alt differs, altCheck)
    const altOf = c.altOf ?? d.altOf ?? g.altOf ?? null;
    const b = (altOf && mc[altOf]) || {};
    const pick = (k) => c[k] ?? b[k] ?? d[k] ?? g[k];
    const ms = (e) => e.durations ?? (e.ms != null ? e.ms : undefined);
    const frames = pick('frames') || 1;
    // where the loop restarts (ENG-117) belongs to a frame count: a fighter's 4-frame strip drawn under the old contract
    // doesn't take the loopFrom of a 6-frame default
    const lf = [c, b, d, g].find((e) => e.loopFrom != null);
    return {
      name,
      altOf,
      frames,
      phases: pick('phases') || null,
      loop: !!pick('loop'),
      loopFrom: lf && (lf.frames ?? frames) === frames ? lf.loopFrom : 0,
      bodyHeight: c.bodyHeight ?? b.bodyHeight ?? d.bodyHeight ?? BODY_HEIGHT[name] ?? BODY_HEIGHT[altOf] ?? DEFAULT_BODY_HEIGHT,
      required: CORE.includes(name) || env.manifest.core.includes(name) || c.required === true || (c.required === undefined && d.required === true),
      durations: ms(c) ?? ms(b) ?? ms(d) ?? g.durations ?? g.ms ?? DEFAULT_MS[name] ?? DEFAULT_MS[altOf] ?? 100,
      hitbox: (c.hitbox ?? b.hitbox ?? d.hitbox ?? !NO_HITBOX.has(name)) !== false,
      approvedVersion: c.approvedVersion ?? null,
      // the strip's own size correction; an alt is its own drawing, so it never inherits its base's
      packScale: c.packScale ?? 1,
    };
  });
}

function resolveDurations(spec, n) {
  let arr = typeof spec === 'number' ? Array(n).fill(spec) : Array.isArray(spec) ? spec.map(Number).filter(Number.isFinite) : [];
  if (!arr.length) arr = Array(n).fill(100);
  if (arr.length !== n) {
    const total = arr.reduce((p, c) => p + c, 0);
    arr = Array(n).fill(total / n);
  }
  return arr.map((v) => Math.max(16, Math.round(v)));
}

function rescalePhases(ph, n) {
  if (!ph) return null;
  const T = ph[0] + ph[1] + ph[2];
  if (T === n) return ph.slice();
  if (n <= 1) return [0, 1, 0];
  if (n === 2) return [1, 1, 0];
  const s0 = Math.min(n - 1, Math.max(1, Math.round((n * ph[0]) / T)));
  const s1 = Math.max(1, Math.min(n - s0, Math.round((n * ph[1]) / T)));
  return [s0, s1, Math.max(0, n - s0 - s1)];
}

// ============================================================== frame sources
const SINGLE_RE = /^(.+?)_(\d+)\.png$/i;
// Versioned candidates (ADR 0007): <anim>_vNN.png and their optional sidecar <anim>_vNN.json. Highest NN = latest.
const VERSION_RE = /^(.+?)_v(\d+)\.png$/i;
const VERSION_JSON_RE = /^(.+?)_v(\d+)\.json$/i;
// One half of a strip that was generated in parts (it belongs in raw/_parts/, joined into <anim>_vNN.png).
const PART_RE = /^(.+?)_v\d+_[a-z]\.png$/i;

// Index raw/ files by animation name (case-insensitive). Unrecognized files become warnings.
// Skipped silently: ui_* (UI raws such as ui_portrait_v02.png; the fitted UI lives in ui/), fx_* (effect art
// left in a character's raw/), <anim>_fixNN.png (fix-up attempts) and every subfolder: raw/_rejected/,
// raw/_parts/, raw/_old/, raw/_proposed/ ... are never read (listFiles does not descend).
function scanRaw(rawDir, knownNames, warn, label) {
  const byLower = new Map(knownNames.map((n) => [n.toLowerCase(), n]));
  const idx = new Map();
  const get = (n) => {
    if (!idx.has(n)) idx.set(n, { strip: null, versions: [], singles: [], sidecar: null, versionSidecars: new Map() });
    return idx.get(n);
  };
  for (const f of listFiles(rawDir).sort(natural)) {
    if (f.startsWith('.') || /^readme/i.test(f)) continue;
    if (/^(ui|fx)_/i.test(f) || /_fix\d+\.png$/i.test(f)) continue;
    if (/\.(jpe?g|webp|gif|bmp|avif)$/i.test(f)) { warn(`${label}/${f}: not a PNG - save it as .png`); continue; }
    if (/\.json$/i.test(f)) {
      const vm = VERSION_JSON_RE.exec(f);
      const vname = vm && byLower.get(vm[1].toLowerCase());
      if (vname) { get(vname).versionSidecars.set(Number(vm[2]), path.join(rawDir, f)); continue; }
      const name = byLower.get(f.slice(0, -5).toLowerCase());
      if (name) get(name).sidecar = path.join(rawDir, f);
      continue;
    }
    if (!/\.png$/i.test(f)) continue;
    const base = f.slice(0, -4);
    let name = byLower.get(base.toLowerCase());
    if (name) {
      if (name !== base) warn(`${label}/${f}: rename to ${name}.png (case)`);
      get(name).strip = path.join(rawDir, f);
      continue;
    }
    const vm = VERSION_RE.exec(f);
    name = vm && byLower.get(vm[1].toLowerCase());
    if (name) {
      const n = Number(vm[2]);
      const want = `${name}_v${String(n).padStart(2, '0')}.png`;
      if (vm[1] !== name) warn(`${label}/${f}: rename to ${want} (case)`);
      else if (vm[2].length < 2) warn(`${label}/${f}: use a two-digit version - rename to ${want}`);
      const e = get(name);
      const dup = e.versions.find((v) => v.n === n);
      if (dup) warn(`${label}/${f}: version ${n} already exists as ${path.basename(dup.file)} - ignored (versions are never reused; give it the next free number)`);
      else e.versions.push({ n, file: path.join(rawDir, f) });
      continue;
    }
    const m = SINGLE_RE.exec(f);
    name = m && byLower.get(m[1].toLowerCase());
    if (name) { get(name).singles.push(path.join(rawDir, f)); continue; }
    const pm = PART_RE.exec(f);
    if (pm && byLower.has(pm[1].toLowerCase())) { warn(`${label}/${f}: strip part - move it to raw/_parts/ (the packer reads only the joined <anim>_vNN.png)`); continue; }
    warn(`${label}/${f}: unrecognized name - use <anim>_vNN.png (versioned strip), <anim>.png (strip) or <anim>_NN.png (single frame)`);
  }
  return idx;
}

// The raw source of one animation, in order: the highest raw/<anim>_vNN.png (or version `want` when it exists, e.g.
// the approved one), else raw/<anim>.png, else the raw/<anim>_NN.png singles. Sidecars: raw/<anim>.json applies to
// every source of the animation; a versioned strip's own raw/<anim>_vNN.json is merged on top (its keys win).
function pickRaw(entry, name, want = null) {
  if (!entry) return null;
  const sidecars = entry.sidecar ? [entry.sidecar] : [];
  if (entry.versions.length) {
    const top = entry.versions.find((v) => v.n === want) || entry.versions.reduce((a, b) => (b.n > a.n ? b : a));
    const own = entry.versionSidecars.get(top.n);
    const ignored = [];
    if (entry.strip) ignored.push(`raw/${path.basename(entry.strip)}`);
    if (entry.singles.length) ignored.push(`${entry.singles.length} raw/${name}_NN.png single(s)`);
    return { files: [top.file], strip: true, version: top.n, label: `raw/${path.basename(top.file)}`, sidecars: own ? [...sidecars, own] : sidecars, ignored };
  }
  if (entry.strip) return { files: [entry.strip], strip: true, version: null, label: `raw/${path.basename(entry.strip)}`, sidecars, ignored: [], conflict: entry.singles.length };
  if (entry.singles.length) {
    const label = entry.singles.length === 1 ? `raw/${path.basename(entry.singles[0])}` : `raw/${name}_NN.png x${entry.singles.length}`;
    return { files: entry.singles, strip: false, version: null, label, sidecars, ignored: [] };
  }
  return null; // only a sidecar
}

function hashFiles(files) {
  const h = crypto.createHash('sha1');
  for (const f of files) { h.update(path.basename(f)); h.update(fs.readFileSync(f)); }
  return h.digest('hex');
}

// Which raw file packer-written frames were cleaned from (markers before packer v2 only list the source paths).
function markerOrigin(marker) {
  const src = Array.isArray(marker.source) ? marker.source.filter((s) => typeof s === 'string' && /\.png$/i.test(s)) : [];
  const file = typeof marker.sourceFile === 'string' ? marker.sourceFile : src.length === 1 ? `raw/${path.basename(src[0])}` : src.length ? `raw/ (${src.length} files)` : null;
  return { file, version: Number.isInteger(marker.version) ? marker.version : null };
}

// Decide where an animation's frames come from: frames/<anim>/ (cleaned frames) or raw/ (pickRaw).
// Packer-written frames carry a marker (.packer.json: source file name + hash, bodyHeight, cell). When the source
// changed (a newer _vNN, an edited raw or sidecar, another bodyHeight or cell size) and nobody edited the frames,
// they are re-imported; hand-edited frames of the same drawing win (warned). Hand edits made on an OLDER version
// than the newest raw/<anim>_vNN.png belong to another drawing: packing them would ship the old art under the new
// version's approval, so the source is the new raw and the animation is 'shadowed', which refuses the pack (move the
// folder to frames/_old/ or redo the edits on the new version). Frames without a marker are hand-made: they win.
// Untouched packer-made frames whose raw source is gone (its only version moved to raw/_rejected/) are 'stale':
// packing them would ship rejected art, so the animation counts as missing.
// ctx: { bodyHeight, cell, artDir } - what the frames must have been written for.
function chooseSource(framesDir, raw, ctx, warn, label) {
  if (raw?.conflict) warn(`${label}: raw strip and ${raw.conflict} single frame(s) both exist - using the strip`);
  // the sidecars are part of the source: editing one re-imports too
  const fromRaw = raw && { kind: 'raw', rawFiles: raw.files, hashInputs: [...raw.files, ...raw.sidecars], version: raw.version, label: raw.label, strip: raw.strip };
  const framePngs = listPngs(framesDir);
  if (!framePngs.length) return fromRaw;
  const marker = readJson(path.join(framesDir, MARKER)).data;
  if (!marker) return { kind: 'frames', framePngs, packerMade: false, origin: null };
  const origin = markerOrigin(marker);
  const files = marker.files || {};
  const isEdited = () => framePngs.length !== Object.keys(files).length ||
    framePngs.some((f) => files[f] !== sha1(fs.readFileSync(path.join(framesDir, f))));
  if (!raw) {
    const srcPngs = Array.isArray(marker.source) ? marker.source.filter((s) => typeof s === 'string' && /\.png$/i.test(s)) : [];
    const gone = srcPngs.length > 0 && srcPngs.some((s) => !isFile(path.join(ctx.artDir, s)));
    const edited = isEdited();
    if (gone && !edited) return { kind: 'stale', origin };
    return { kind: 'frames', framePngs, packerMade: true, edited, origin, autoHead: marker.autoHead ?? null };
  }
  const cellOf = (c) => JSON.stringify(c ?? null);
  const why = [];
  if (hashFiles(fromRaw.hashInputs) !== marker.sourceHash) {
    why.push(origin.file && origin.file !== raw.label ? `newer source ${raw.label} (frames/ came from ${origin.file})` : `${raw.label} or its sidecar changed`);
  }
  if ((marker.bodyHeight ?? null) !== (ctx.bodyHeight ?? null)) why.push(`bodyHeight changed (${marker.bodyHeight ?? 'none'} -> ${ctx.bodyHeight})`);
  if (cellOf(marker.cell) !== cellOf(ctx.cell)) why.push('the spec cell changed');
  // the auto head fit (TOOL-025) is measured at import: the marker's autoHead factor says the frames already have
  // their fitted size; asking for it without a recorded fit (never fitted yet) or dropping it re-imports
  if ((marker.autoHead != null) !== !!ctx.fitHead) why.push(ctx.fitHead ? 'auto head fit requested' : 'auto head fit removed');
  if (!why.length) return { kind: 'frames', framePngs, packerMade: true, origin, autoHead: marker.autoHead ?? null };
  const edited = isEdited();
  if (!edited) return { ...fromRaw, replaced: origin.file && origin.file !== raw.label ? origin.file : null };
  if (raw.version != null && origin.version != null && raw.version > origin.version) return { ...fromRaw, shadowed: origin };
  warn(`${label}: ${why.join(', ')} but frames/${path.basename(framesDir)}/ has manual edits - using frames/ (delete that folder to re-import from raw/)`);
  return { kind: 'frames', framePngs, packerMade: true, edited: true, origin, autoHead: marker.autoHead ?? null };
}

const staleText = (label, dir, src) => `${label}: frames/${dir}/ were cleaned from ${src.origin.file || 'a raw file'}, which is no longer in raw/ (rejected?) - not packed. Delete frames/${dir}/ or add a new raw version`;

// Merged sidecar keys (later files win). A broken file is warned and skipped.
function readSidecars(files, warn, label) {
  const out = {};
  for (const file of files || []) {
    const r = readJson(file);
    if (r.error) { warn(`${label}: ${path.basename(file)} is not valid JSON (${r.error}) - ignored`); continue; }
    if (r.data && typeof r.data === 'object' && !Array.isArray(r.data)) Object.assign(out, r.data);
  }
  return out;
}

// Load + clean raw images into trimmed frame images (source resolution). strip: one image holding every pose
// (split it) rather than one image per frame.
function framesFromRaw(rawFiles, expected, side, env, mode, warn, label, strip) {
  const notes = [];
  const out = [];
  const sideTol = Number(side.tolerance ?? side.tol);
  const tol = sideTol > 0 ? sideTol : env.tol;
  const speck = mode === 'vfx' ? { frac: 0.0002, min: 3 } : { frac: 0.0015, min: 4 };
  let unreadable = 0, strays = 0;
  const foreign = new Set();
  for (const f of rawFiles) {
    let img;
    try { img = readPng(f); } catch (e) { warn(`${label}: cannot read ${path.basename(f)} (${e.message})`); unreadable++; continue; }
    if (Array.isArray(side.erase) && side.erase.length) {
      const n = eraseRects(img, side.erase, (m) => warn(`${label}: ${m}`));
      if (n) notes.push(`erased ${n} rect(s) of ${path.basename(f)} (sidecar)`);
    }
    const bg = removeBackground(img, { tol, mode });
    if (!bg.magentaBg && bg.removed === 0 && !hasTransparency(img)) warn(`${label}: ${path.basename(f)} has no removable background (use flat magenta #FF00FF)`);
    else if (mode === 'char' && bg.foreign && bg.removed) foreign.add(bg.foreign);
    const sp = removeSpecks(img, speck);
    if (sp.blobs > 3) notes.push(`removed ${sp.blobs} specks`);
    if (strip) {
      const want = Number(side.frames) > 0 ? Number(side.frames) : expected;
      const { rects, notes: n2 } = splitStrip(img, want, { split: side.split === 'even' ? 'even' : 'auto', mode });
      notes.push(...n2);
      // a column split that cuts a figure (a hand over the next pose's column) or miscounts the poses: take the poses as
      // whole figures instead, when they are clear-cut; one-row strips only (a grid's figures are ordered by row)
      let figs = null;
      if (mode === 'char' && want > 1 && side.split !== 'even' && new Set(rects.map((r) => r.y0)).size <= 1) {
        const cut = rects.length > 1 ? cutFigures(img, rects) : [];
        if (cut.length || rects.length !== want) {
          figs = figureSplit(img, want);
          if (figs) notes.push(cut.length ? `split by whole figures: the column split cut a figure between frames ${cut.join(', ')}` : `split by whole figures: the column split found ${rects.length} pose(s), ${want} expected`);
          else if (cut.length) warn(`${label}: the column split cuts a figure between frames ${cut.join(', ')} and the poses touch - leave a gap between them (a hand reaching into the next pose's column ends up in that frame)`);
        }
      }
      if (figs) {
        for (const t of figs) { strays += dropStrays(t); const b = bbox(t); if (b) out.push(crop(t, b.x0, b.y0, b.w, b.h)); }
        continue;
      }
      for (const r of rects) {
        const piece = crop(img, r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
        if (mode === 'char') strays += dropStrays(piece);
        const b = bbox(piece);
        if (!b) continue;
        const t = crop(piece, b.x0, b.y0, b.w, b.h);
        // where the frame sat in the strip (VFX keep their offset inside the strip row, see vfxAnchors)
        if (mode === 'vfx') t.at = { row: `${r.y0}:${r.y1}`, slotCx: (r.x0 + r.x1) / 2, left: r.x0 + b.x0, top: r.y0 + b.y0, bottom: r.y0 + b.y1 };
        out.push(t);
      }
    } else {
      if (mode === 'char') strays += dropStrays(img);
      const b = bbox(img);
      if (b) {
        const t = crop(img, b.x0, b.y0, b.w, b.h);
        if (mode === 'vfx') t.at = { row: 'single', canvas: `${img.w}x${img.h}`, left: b.x0, right: b.x1, top: b.y0, bottom: b.y1 };
        out.push(t);
      } else warn(`${label}: ${path.basename(f)} is empty after background removal`);
    }
  }
  if (strays) notes.push(`dropped ${strays} stray mark(s) far from the body`);
  if (foreign.size) warn(`${label}: background ${[...foreign].join('/')} is not magenta #FF00FF - removed with half tolerance; gaps enclosed by the body (between arm and torso) stay filled. Regenerate on magenta`);
  let frames = out;
  // Sidecar "flipX": a pose drawn facing the other way (Killua ko v09 lies head-right where down and the approved ko lie
  // head-left) is mirrored frame by frame, after the split, so the frame order stays the drawing's
  if (side.flipX === true) {
    if (mode === 'char') { frames = frames.map(flipH); notes.push('mirrored left-right (sidecar flipX)'); }
    else warn(`${label}: sidecar "flipX" is for character strips only - ignored`);
  }
  if (Array.isArray(side.drop) && side.drop.length) {
    const drop = new Set(side.drop.map(Number).filter((k) => Number.isInteger(k) && k >= 0 && k < frames.length));
    const bad = side.drop.filter((k) => !drop.has(Number(k)));
    if (bad.length) warn(`${label}: sidecar "drop" ${JSON.stringify(bad)} ignored - frame indices are 0-${frames.length - 1}`);
    if (drop.size) {
      frames = frames.filter((_, k) => !drop.has(k));
      notes.push(`dropped frame(s) ${[...drop].join(',')} (sidecar)`);
    }
  }
  if (mode === 'vfx') vfxAnchors(frames, notes);
  return { frames, notes, unreadable: unreadable === rawFiles.length };
}

// Effects grow, shrink, rise and lean on purpose, so a VFX frame must not be re-centered on its own
// bbox (a spark flare that disappears would make the crescent jump, a rising puff would not rise).
// Sets frame.anchor = { cx, cy, gap } in source px, relative to the trimmed frame's top-left:
//  - strip: cy = center of the union of the row's frames (all frames share the row's center line),
//    gap = how far the frame's lowest pixel sits above the row's lowest pixel (bottom effects),
//    cx = center of the frame's split slot (its own columns, or an even slot with { "split": "even" });
//  - single files of one canvas size: the union of all frames on that shared canvas, in x and y.
// Single files of different sizes have no common reference: they stay centered per frame.
function vfxAnchors(frames, notes) {
  const singles = frames.filter((f) => f.at?.row === 'single');
  if (singles.length > 1 && new Set(singles.map((f) => f.at.canvas)).size > 1) {
    for (const f of singles) delete f.at;
    notes.push('single frames have different canvas sizes - each frame centered on its own bbox');
  }
  const rows = new Map();
  for (const f of frames) if (f.at) { if (!rows.has(f.at.row)) rows.set(f.at.row, []); rows.get(f.at.row).push(f); }
  for (const [row, list] of rows) {
    const uy0 = Math.min(...list.map((f) => f.at.top)), uy1 = Math.max(...list.map((f) => f.at.bottom));
    const ux = row === 'single' ? (Math.min(...list.map((f) => f.at.left)) + Math.max(...list.map((f) => f.at.right)) + 1) / 2 : null;
    for (const f of list) {
      f.anchor = { cx: (ux ?? f.at.slotCx) - f.at.left, cy: (uy0 + uy1 + 1) / 2 - f.at.top, gap: uy1 - f.at.bottom };
      delete f.at;
    }
  }
}

function hasTransparency(img) {
  const d = img.data;
  for (let i = 3; i < d.length; i += 4) if (d[i] < 128) return true;
  return false;
}

function framesFromFolder(dir, files, mode, env, warn, label, vfxCell = VFX.cell) {
  const out = [];
  for (const f of files) {
    let img;
    try { img = readPng(path.join(dir, f)); } catch (e) { warn(`${label}: cannot read frames/${f} (${e.message})`); continue; }
    if (mode === 'vfx' && img.w === vfxCell && img.h === vfxCell) { quantizeAlpha(img); out.push({ img, final: true }); continue; }
    removeBackground(img, { tol: env.tol, mode });
    // a forgotten stray pixel would change the trimmed size (and so the scale of the whole anim)
    const stray = mode === 'char' ? removeSpecks(img, { frac: 0, min: 3 }).removed : 0;
    const t = trim(img);
    if (t) out.push({ img: t, final: false, stray });
    else warn(`${label}: frames/${f} is empty`);
  }
  return out;
}

// ============================================================== character packing
function footAnchor(img) {
  const y0 = Math.min(img.h - 1, Math.floor(img.h * 0.8));
  let sx = 0, n = 0;
  for (let y = y0; y < img.h; y++) for (let x = 0; x < img.w; x++) if (img.data[(y * img.w + x) * 4 + 3]) { sx += x; n++; }
  return n ? sx / n : img.w / 2;
}

// A versioned sidecar can correct a pose's gait center and lift flight frames without changing the
// shared cell pivot or the raw art. Offsets are final-cell pixels, after the animation's common scale.
function frameOffsetsFor(side, count, spec, warn, label) {
  if (!Object.hasOwn(side, 'frameOffsets')) return null;
  const offsets = side.frameOffsets;
  const valid = Array.isArray(offsets) && offsets.length === count && offsets.every((pair) =>
    Array.isArray(pair) && pair.length === 2 && pair.every(Number.isInteger) &&
    Math.abs(pair[0]) <= spec.frameWidth && Math.abs(pair[1]) <= spec.frameHeight);
  if (!valid) {
    warn(`${label}: frameOffsets must have ${count} [dx,dy] integer pair(s) within the cell size - ignored`);
    return null;
  }
  return offsets;
}

// frameOffsets are cell px measured at packScale 1: a resized fighter moves by the same share of its size
const scaleOffsets = (offsets, k) => (offsets && k !== 1 ? offsets.map(([dx, dy]) => [Math.round(dx * k), Math.round(dy * k)]) : offsets);

// Anatomical calibration measures skull-to-chin in each raw pose, along the head axis.
// Hair, raised hands and crouching change bounds without changing the person's scale.
function anatomicalScalesFor(side, count, warn, label) {
  if (!Object.hasOwn(side, 'anatomy')) return null;
  const a = side.anatomy;
  if (a?.measurement === 'auto-head') return null; // measured by the scale probe after the gather (TOOL-025)
  if (!a || a.measurement !== 'skull-to-chin' || !Number.isFinite(a.targetHeadPx) ||
      a.targetHeadPx < 8 || a.targetHeadPx > 64 || !Array.isArray(a.sourceHeadPx) ||
      a.sourceHeadPx.length !== count || !a.sourceHeadPx.every((n) => Number.isFinite(n) && n >= 8 && n <= 2048)) {
    warn(label + ': anatomy requires measurement skull-to-chin, targetHeadPx 8..64, and ' + count + ' sourceHeadPx measurements (8..2048) - ignored');
    return null;
  }
  return a.sourceHeadPx.map((n) => a.targetHeadPx / n);
}

// Feet center on the pivot x, lowest row on the pivot y (the floor line) before any per-frame correction.
// clip = pixels lost outside the cell; margin = pixels inside its safe margin (including below the floor).
function placeCharFrame(sprite, spec, offset = [0, 0], anchor = null) {
  const W = spec.frameWidth, H = spec.frameHeight, m = spec.cellMargin;
  const cell = newImage(W, H);
  const off = offset || [0, 0];
  // a wall-anchored frame (TECH_POSES, ADR 0030): its wall side, the leftmost opaque pixel, on the wall line
  const dx = (anchor === 'wall' ? wallLineOf(spec) - (bbox(sprite)?.x0 ?? 0) : Math.round(spec.pivot[0] - footAnchor(sprite))) + off[0];
  const dy = spec.pivot[1] - (sprite.h - 1) + off[1];
  const lost = blit(cell, sprite, dx, dy);
  const clip = [];
  if (dx < 0) clip.push(`left ${-dx}px`);
  if (dx + sprite.w > W) clip.push(`right ${dx + sprite.w - W}px`);
  if (dy < 0) clip.push(`top ${-dy}px`);
  if (dy + sprite.h > H) clip.push(`bottom ${dy + sprite.h - H}px`);
  const margin = [];
  const b = !lost && m ? bbox(sprite) : null;
  if (b) {
    const x0 = b.x0 + dx, x1 = b.x1 + dx, y0 = b.y0 + dy;
    if (x0 < m) margin.push(`left ${m - x0}px`);
    if (x1 > W - 1 - m) margin.push(`right ${x1 - (W - 1 - m)}px`);
    if (y0 < m) margin.push(`top ${m - y0}px`);
    if (b.y1 + dy > spec.pivot[1]) margin.push(`below floor ${b.y1 + dy - spec.pivot[1]}px`);
  }
  return { cell, lost, clip, margin };
}

// Pixel thresholds for the box heuristics, scaled from their spec v1 tuning (see V1_STANDING_BODY_PX).
function boxTuning(spec) {
  const k = spec.standingBodyPx / V1_STANDING_BODY_PX;
  const px = (v) => Math.max(1, Math.round(v * k));
  return { band: px(40), slack: px(6), thick: px(16), tipLen: px(6), blobN: Math.max(4, Math.round(12 * k * k)), fwdExt: px(4), upExt: px(6), upSlack: px(2), pad: px(2), near: px(6) };
}

const clampBox = ([x, y, w, h], W, H) => {
  const x0 = Math.max(0, x), y0 = Math.max(0, y), x1 = Math.min(W, x + w), y1 = Math.min(H, y + h);
  return [x0, y0, Math.max(1, x1 - x0), Math.max(1, y1 - y0)];
};

function hurtBox(cell) {
  const b = bbox(cell);
  if (!b) return null;
  const ix = Math.round(b.w * 0.18), it = Math.round(b.h * 0.04);
  return [b.x0 + ix, b.y0 + it, Math.max(2, b.w - 2 * ix), Math.max(2, b.h - it)];
}

// How a lying body meets the floor line (pivot y). Per column: the gap between its lowest opaque pixel and the floor.
// contact = share of body columns within contactPx; gaps = the smallest gap in each equal segment of the body's length
// (a segment that never comes near the floor is a hovering head or feet end); h = trimmed height.
function groundContact(cell, floorY, G) {
  const b = bbox(cell);
  if (!b) return null;
  const gaps = new Array(G.segments).fill(Infinity);
  let cols = 0, near = 0;
  for (let x = b.x0; x <= b.x1; x++) {
    let low = -1;
    for (let y = b.y1; y >= b.y0; y--) if (cell.data[(y * cell.w + x) * 4 + 3] >= 128) { low = y; break; }
    if (low < 0) continue;
    const gap = Math.max(0, floorY - low);
    cols++;
    if (gap <= G.contactPx) near++;
    const s = Math.min(G.segments - 1, Math.floor(((x - b.x0) * G.segments) / b.w));
    gaps[s] = Math.min(gaps[s], gap);
  }
  const seen = gaps.filter(Number.isFinite);
  return { x0: b.x0, x1: b.x1, contact: cols ? near / cols : 0, gaps: gaps.map((g) => (Number.isFinite(g) ? g : null)), worst: seen.length ? Math.max(...seen) : 0, h: b.h };
}

// Lying frames (LYING): warn when a resting frame floats above the floor line (warn only: the game still needs a ko and
// a down) and return the footprint map { "<sheet frame>": [x0, x1] } (inclusive cell px). R.ground gets the measurements.
function groundCheck(anims, meta, spec, standingBodyPx, warn, R) {
  const k = standingBodyPx / SPEC_DEFAULTS.standingBodyPx;
  const G = { ...GROUND, contactPx: Math.max(1, Math.round(GROUND.contactPx * k)), maxGap: Math.max(1, Math.round(GROUND.maxGap * k)) };
  const floorY = spec.pivot[1];
  const pick = (rule, n) => (rule === 'all' ? [...Array(n).keys()] : rule === 'last' ? [n - 1] : rule === 'first' ? [0] : []);
  const footprint = {};
  for (const a of anims) {
    const rule = LYING[a.def.name];
    if (!rule) continue;
    const frames = meta.animations[a.def.name].frames;
    const fp = new Set(pick(rule.footprint, a.cells.length)), checked = new Set(pick(rule.check, a.cells.length));
    const bad = [];
    a.cells.forEach((cell, i) => {
      if (!fp.has(i) && !checked.has(i)) return;
      const g = groundContact(cell, floorY, G);
      if (!g) return;
      if (fp.has(i)) footprint[String(frames[i])] = [g.x0, g.x1];
      if (!checked.has(i)) return;
      const tallMax = Math.round(a.bodyHeight * G.tallFactor);
      const why = [];
      if (g.contact < G.minContact || g.worst > G.maxGap) why.push(`${Math.round(g.contact * 100)}% of the body within ${G.contactPx}px of y ${floorY}, worst fifth ${g.worst}px above it`);
      if (g.h > tallMax) why.push(`${g.h}px tall > ${a.bodyHeight}x${G.tallFactor}`);
      R.ground[a.def.name] = R.ground[a.def.name] || [];
      R.ground[a.def.name].push({ frame: i, contact: +g.contact.toFixed(2), gaps: g.gaps, worst: g.worst, h: g.h, ok: !why.length });
      if (why.length) bad.push(`#${i}: ${why.join(', ')}`);
    });
    // an approved version that predates the rule still warns (the art is wrong), but says what to do about it
    const known = a.def.approvedVersion != null && a.version === a.def.approvedVersion ? `; v${String(a.version).padStart(2, '0')} is the approved version: queue a side-on redraw` : '';
    if (bad.length) warn(`${a.def.name}: ${bad.length} lying frame(s) float above the floor line (${bad.join('; ')}) - draw lying poses side-on at the spec camera (about 12 degrees down) with the head, back, hips and legs resting on y ${floorY} (art/SPEC.md "Lying poses", ADR 0020)${known}`);
  }
  return footprint;
}

// Tech poses (TECH_POSES, ADR 0030), warn only: a cling frame whose wall line holds too few opaque px (a fingertip, not
// the soles), and a tucked / crouched / braced frame outside its height band against the idle's median height (the
// giveaway of a pose packed at a standing height). Returns the wall anchors { "<sheet frame>": px of the body centre
// right of the pivot } for the engine. R.tech gets the measurements.
function techPoseCheck(anims, meta, spec, standingBodyPx, warn, R) {
  const k = standingBodyPx / SPEC_DEFAULTS.standingBodyPx;
  const minPx = Math.max(1, Math.round(WALL_CONTACT.minPx * k));
  const idle = anims.find((a) => a.def.name === 'idle');
  const hs = idle ? idle.cells.map((c) => bbox(c)?.h).filter(Number.isFinite).sort((p, q) => p - q) : [];
  const idleH = hs.length ? hs[Math.floor(hs.length / 2)] : NaN;
  const px0 = wallLineOf(spec);
  const out = {};
  for (const a of anims) {
    const rule = TECH_POSES[a.def.name];
    if (!rule) continue;
    const n = a.cells.length, phases = a.def.phases;
    const frames = meta.animations[a.def.name]?.frames || [];
    const wall = beatFrames(phases, n, rule.wall), contact = beatFrames(phases, n, rule.contact), band = beatFrames(phases, n, rule.envelope?.phases);
    const thin = [], off = [], rec = [];
    a.cells.forEach((cell, i) => {
      const b = bbox(cell);
      if (!b) return;
      const m = { frame: i };
      if (wall.has(i)) {
        if (frames[i] != null) out[String(frames[i])] = Math.round((b.x0 + b.x1) / 2 - spec.pivot[0]);
        let touch = 0;
        for (let y = b.y0; y <= b.y1; y++) for (let x = px0; x < px0 + WALL_CONTACT.cols; x++) if (cell.data[(y * cell.w + x) * 4 + 3] >= 128) touch++;
        m.wallPx = touch;
        if (contact.has(i) && touch < minPx) thin.push(`#${i}: ${touch}px on x ${px0}-${px0 + WALL_CONTACT.cols - 1}`);
      }
      if (band.has(i) && Number.isFinite(idleH)) {
        const r = b.h / idleH;
        m.height = +r.toFixed(2);
        if (r < rule.envelope.min || r > rule.envelope.max) off.push(`#${i} ${r.toFixed(2)}`);
      }
      rec.push(m);
    });
    R.tech[a.def.name] = rec;
    if (thin.length) warn(`${a.def.name}: ${thin.length} cling frame(s) barely touch the wall line (${thin.join('; ')}) - the soles (and the back or a hand) rest flat on the wall at the cell's left; the packer puts the leftmost pixel on x ${px0} (art/SPEC.md "Tech poses", ADR 0030)`);
    if (off.length) warn(`${a.def.name}: ${off.length} tucked / braced frame(s) out of their size band (${off.join(', ')} of the idle's height, band ${rule.envelope.min}-${rule.envelope.max}) - draw them at the idle's anatomical scale, never stretched to a standing height; check the strip's bodyHeight or its auto head fit (art/SPEC.md "Tech poses")`);
  }
  return out;
}

// Attack alts (ALT_TOLERANCE, ADR 0031), warn only: every packed alt whose base is packed keeps the base's frame count
// and phases, and its drawn strike (its own active-phase hit boxes, after hitboxes.json and before inheritAltBoxes)
// lands within the tolerance of the base's. R.alts gets the measurements:
// { "<alt>": { base, strike: { reach, centre }, baseStrike, boxes } } in px; boxes is set by inheritAltBoxes.
function altCheck(packed, meta, spec, warn, R) {
  const byName = new Map(packed.map((p) => [p.name, p]));
  const [px, py] = spec.pivot;
  const strike = (p) => {
    const ph = p.phases;
    if (!ph) return null;
    let x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (let k = ph[0]; k < ph[0] + ph[1] && k < p.indices.length; k++) {
      for (const [x, y, w, h] of meta.boxes[String(p.indices[k])]?.hit || []) {
        x1 = Math.max(x1, x + w);
        y0 = Math.min(y0, y);
        y1 = Math.max(y1, y + h);
      }
    }
    return Number.isFinite(x1) ? { reach: x1 - px, centre: +(py - (y0 + y1) / 2).toFixed(1) } : null;
  };
  const signed = (v) => `${v > 0 ? '+' : ''}${+v.toFixed(1)}px`;
  const rule = 'an alt plays its base\'s move data and hit boxes, so it keeps the frame count and phases, and its drawn strike lands where the base\'s hit registers, or the hit spark floats off the limb (art/SPEC.md "Attack alts", ADR 0031)';
  for (const p of packed) {
    const baseName = p.def.altOf;
    if (!baseName) continue;
    const base = byName.get(baseName);
    if (!base) {
      warn(`${p.name}: packed without its base ${baseName} - the game alternates it with whatever stands in for ${baseName}; pack ${baseName} first`);
      continue;
    }
    const rec = { base: baseName };
    const phases = (q) => (q.phases ? ` (phases ${q.phases.join('/')})` : '');
    if (p.indices.length !== base.indices.length || String(p.phases) !== String(base.phases)) {
      warn(`${p.name}: ${p.indices.length} frame(s)${phases(p)}, its base ${baseName} has ${base.indices.length}${phases(base)} - ${rule}`);
    }
    const a = strike(p), b = strike(base);
    if (a) rec.strike = a;
    if (b) rec.baseStrike = b;
    if (b && !a) warn(`${p.name}: no hit box found on its active frames, ${baseName} strikes ${b.reach}px out at ${b.centre}px high - draw the strike on the active frames, or point a hitboxes.json entry for ${p.name} at the drawn fist or foot (it only feeds this check); ${rule}`);
    // the auto finder can pick a torso or a guard fist on a new drawing: a hitboxes.json entry on the alt fixes the reading
    if (a && b) {
      const dReach = a.reach - b.reach, dCentre = a.centre - b.centre;
      if (Math.abs(dReach) > ALT_TOLERANCE.reachPx) {
        warn(`${p.name}: drawn strike reach ${a.reach}px from the pivot, ${baseName}'s hit ${b.reach}px (${signed(dReach)}, tolerance ${ALT_TOLERANCE.reachPx}px) - ${rule}`);
      }
      if (Math.abs(dCentre) > ALT_TOLERANCE.centrePx) {
        warn(`${p.name}: drawn strike height ${a.centre}px above the floor, ${baseName}'s hit ${b.centre}px (${signed(dCentre)}, tolerance ${ALT_TOLERANCE.centrePx}px) - ${rule}`);
      }
    }
    R.alts[p.name] = rec;
  }
}

// Attack alts take their base's hit and hurt boxes frame for frame (ADR 0031): what connects, what can be hit and
// the hit spark's spot are the base move's, whatever the alt draws, so the alternation is visual only. Runs after
// altCheck, which judged the alt's own drawn strike. An alt's own `hand` anchor stays (hand effects follow the drawn
// hand). An alt whose frame count differs from its base's has no frame-for-frame match: it keeps its own boxes, and
// altCheck has already warned.
function inheritAltBoxes(packed, meta, R) {
  const byName = new Map(packed.map((p) => [p.name, p]));
  const copy = (list) => list.map((b) => [...b]);
  for (const p of packed) {
    const base = byName.get(p.def.altOf);
    if (!base || base.indices.length !== p.indices.length) continue;
    p.indices.forEach((frame, k) => {
      const from = meta.boxes[String(base.indices[k])] || {}, key = String(frame);
      const to = meta.boxes[key] = meta.boxes[key] || {};
      if (from.hit?.length) to.hit = copy(from.hit); else delete to.hit;
      if (from.hurt?.length) to.hurt = copy(from.hurt); else delete to.hurt;
    });
    // the --json hit box report describes what ships
    if (R.hitBoxes[p.name]) R.hitBoxes[p.name] = R.hitBoxes[p.name].map((e) => ({ frame: e.frame, hit: meta.boxes[String(p.indices[e.frame])]?.hit ?? null, rule: `base ${base.name}` }));
    if (R.alts[p.name]) R.alts[p.name].boxes = 'base';
  }
}

// The striking part: the 8-connected blob containing (sx, sy) inside a region, plus any other blob
// of the region within `near` px of it (a smear or spark drawn just in front of the fist).
function strikeBox(img, sx, sy, x0, y0, x1, y1, near = 6) {
  x0 = Math.max(0, x0); y0 = Math.max(0, y0); x1 = Math.min(img.w - 1, x1); y1 = Math.min(img.h - 1, y1);
  if (sx < x0 || sx > x1 || sy < y0 || sy > y1 || x1 < x0 || y1 < y0) return null;
  const W = x1 - x0 + 1, H = y1 - y0 + 1;
  const op = (x, y) => img.data[(y * img.w + x) * 4 + 3] !== 0;
  const label = new Int32Array(W * H);
  const blobs = [];
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (label[(y - y0) * W + x - x0] || !op(x, y)) continue;
    const id = blobs.length + 1;
    const b = { x0: x, y0: y, x1: x, y1: y, n: 0 };
    const stack = [[x, y]];
    label[(y - y0) * W + x - x0] = id;
    while (stack.length) {
      const [px, py] = stack.pop();
      b.n++;
      if (px < b.x0) b.x0 = px; if (px > b.x1) b.x1 = px; if (py < b.y0) b.y0 = py; if (py > b.y1) b.y1 = py;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = px + dx, yy = py + dy;
        if (xx < x0 || xx > x1 || yy < y0 || yy > y1) continue;
        const k = (yy - y0) * W + xx - x0;
        if (label[k] || !op(xx, yy)) continue;
        label[k] = id;
        stack.push([xx, yy]);
      }
    }
    blobs.push(b);
  }
  const start = label[(sy - y0) * W + sx - x0] - 1;
  if (start < 0) return null;
  const box = { ...blobs[start] };
  const used = new Set([start]);
  for (let grown = true; grown;) {
    grown = false;
    blobs.forEach((b, i) => {
      if (used.has(i) || b.x0 > box.x1 + near || b.x1 < box.x0 - near || b.y0 > box.y1 + near || b.y1 < box.y0 - near) return;
      used.add(i);
      box.x0 = Math.min(box.x0, b.x0); box.y0 = Math.min(box.y0, b.y0); box.x1 = Math.max(box.x1, b.x1); box.y1 = Math.max(box.y1, b.y1); box.n += b.n;
      grown = true;
    });
  }
  return { ...box, w: box.x1 - box.x0 + 1, h: box.y1 - box.y0 + 1 };
}

// Opaque pixel of column x (or row y) closest to the middle of its opaque run.
function midOpaque(img, { x, y }) {
  const hits = [];
  if (x !== undefined) { for (let yy = 0; yy < img.h; yy++) if (img.data[(yy * img.w + x) * 4 + 3]) hits.push(yy); }
  else for (let xx = 0; xx < img.w; xx++) if (img.data[(y * img.w + xx) * 4 + 3]) hits.push(xx);
  return hits.length ? hits[hits.length >> 1] : -1;
}

function colCount(img, x) {
  let n = 0;
  for (let y = 0; y < img.h; y++) if (img.data[(y * img.w + x) * 4 + 3]) n++;
  return n;
}

// Hitbox for an active frame. Spec rule ("the part of the silhouette beyond the idle pose's maxX - 6px",
// px at spec v1 scale; T scales every px threshold to the spec's body size), made robust for real art:
//  1. forward strike (reaches past the idle front): walk back from the tip until the columns get
//     torso-thick, so only the limb counts; take the blob holding the forward-most pixel (+ smears
//     touching it) within +-T.band px of the tip row (a guard fist next to a kick is excluded);
//  2. rising strike (uppercut, rises above the standing head): the same idea around the highest pixel;
//     whichever of 1/2 reaches further past the reference is tried first. ref.minY is the approved upright cell's top
//     (builds.json standingReference), not the idle's: a crouched idle made every upright pose's hair "rise";
//  3. otherwise the forward-most 28% of the body at strike height.
function hitBox(cell, ref, T) {
  const b = bbox(cell);
  if (!b) return null;
  const pad = (bb) => clampBox([bb.x0 - T.pad, bb.y0 - T.pad, bb.w + 2 * T.pad, bb.h + 2 * T.pad], cell.w, cell.h);
  const forward = () => {
    let start = ref.maxX - T.slack + 1;
    const thick = Math.max(T.thick, Math.round(b.h * 0.25));
    for (let x = b.x1; x >= Math.max(start, b.x0); x--) if (colCount(cell, x) > thick) { start = x + 1; break; }
    if (b.x1 - start + 1 < T.tipLen) return null;
    const ty = midOpaque(cell, { x: b.x1 });
    const tip = strikeBox(cell, b.x1, ty, start, ty - T.band, cell.w - 1, ty + T.band, T.near);
    if (tip && tip.n >= T.blobN) return { box: pad(tip), rule: 'forward' };
    const fwd = bbox(cell, start, 0, cell.w - 1, cell.h - 1);
    return fwd && fwd.n >= T.blobN ? { box: pad(fwd), rule: 'forward' } : null;
  };
  const up = () => {
    // walk down from the top until the rows get head-thick: fist + forearm only
    let bottom = ref.minY - T.upSlack;
    const thick = Math.max(T.thick, Math.round(b.w * 0.45));
    for (let y = b.y0; y <= b.y0 + b.h * 0.5; y++) {
      let n = 0;
      for (let x = b.x0; x <= b.x1; x++) if (cell.data[(y * cell.w + x) * 4 + 3]) n++;
      if (n > thick) { bottom = Math.max(bottom, y - 1); break; }
    }
    const tx = midOpaque(cell, { y: b.y0 });
    const top = strikeBox(cell, tx, b.y0, tx - T.band, 0, tx + T.band, bottom, T.near);
    return top && top.n >= T.blobN ? { box: pad(top), rule: 'up' } : null;
  };
  const fwdExt = b.x1 - ref.maxX, upExt = ref.minY - b.y0;
  const tries = [];
  if (fwdExt >= T.fwdExt) tries.push([fwdExt, forward]);
  if (upExt >= T.upExt) tries.push([upExt, up]);
  tries.sort((p, q) => q[0] - p[0]);
  for (const [, fn] of tries) { const h = fn(); if (h) return h; }
  const cw = Math.max(1, Math.round(b.w * 0.28));
  const front = bbox(cell, b.x1 - cw + 1, 0, b.x1, cell.h - 1);
  return { box: pad(front), rule: 'front' };
}

// the opaque colours of a fighter's packed sheet (every page its anims.json lists), or null when a page is missing or
// they are more than n (not a quantized pack); pages: the page images, for learnPalette
function sheetPalette(dir, n) {
  const files = sheetFiles(readJson(path.join(dir, 'anims.json')).data).map((f) => path.join(dir, f));
  if (!files.every((f) => fs.existsSync(f))) return null;
  const pages = files.map(readPng), seen = new Set();
  for (const img of pages) for (let i = 0; i < img.data.length; i += 4) if (img.data[i + 3]) seen.add((img.data[i] << 16) | (img.data[i + 1] << 8) | img.data[i + 2]);
  return seen.size && seen.size <= n ? { pages, palette: [...seen].map((k) => [k >> 16, (k >> 8) & 255, k & 255]) } : null;
}

// For --keep-palette: every strip whose cells have the same shape as in the current sheet (anims.json next to it) shows
// which palette colour each of its source colours became last time; strips that changed shape teach nothing
function learnPalette(anims, pages, metaFile, spec) {
  const meta = readJson(metaFile).data;
  if (!meta?.animations) return null;
  const learned = new Map(), fw = spec.frameWidth, cols = meta.columns ?? spec.columns;
  for (const a of anims) {
    const old = meta.animations[a.def.name]?.frames;
    if (!old || old.length !== a.cells.length) continue;
    const olds = old.map((f) => { const at = frameCell(meta, f, cols); return pages[at.page] ? crop(pages[at.page], at.x, at.y, fw, fw) : null; });
    if (olds.includes(null)) continue;
    if (!a.cells.every((c, k) => c.data.every((v, i) => (i & 3) !== 3 || (v > 0) === (olds[k].data[i] > 0)))) continue;
    a.cells.forEach((c, k) => {
      for (let i = 0; i < c.data.length; i += 4) if (c.data[i + 3]) {
        const key = (c.data[i] << 16) | (c.data[i + 1] << 8) | c.data[i + 2];
        if (!learned.has(key)) learned.set(key, (olds[k].data[i] << 16) | (olds[k].data[i + 1] << 8) | olds[k].data[i + 2]);
      }
    });
  }
  return learned;
}

function validBox(b) { return Array.isArray(b) && b.length === 4 && b.every((v) => Number.isFinite(v)); }

function applyOverrides(file, packed, boxes, warn, label, fits = null, pivot = null, notes = null, hitSet = null) {
  const r = readJson(file);
  if (!r.exists) return 0;
  if (r.error) { warn(`${label}/hitboxes.json is not valid JSON (${r.error}) - ignored`); return 0; }
  let n = 0;
  for (const [anim, frames] of Object.entries(r.data || {})) {
    if (anim.startsWith('_') || !frames || typeof frames !== 'object') continue;
    const p = packed.find((a) => a.name === anim);
    if (!p) { warn(`hitboxes.json: "${anim}" is not packed - override skipped`); continue; }
    // the animation's cells were rescaled by an auto head fit or the fighter's packScale since these boxes were measured (see scaleAboutPivot)
    const fit = fits?.get(anim) ?? 1, measuredAt = Number(frames._scale) > 0 ? Number(frames._scale) : 1;
    const tf = pivot && Math.abs(fit / measuredAt - 1) > 1e-6 ? { k: fit / measuredAt, px: pivot[0], py: pivot[1] } : null;
    if (tf) notes?.push(`hitboxes.json ${anim}: boxes and hand anchors scaled x${tf.k.toFixed(3)} about the pivot (auto-head fit and packScale x${+fit.toFixed(4)}); re-measure them and set "_scale": ${+fit.toFixed(4)}`);
    const keys = Object.keys(frames).filter((k) => !k.startsWith('_')).sort((a, b) => (a === '*' ? -1 : b === '*' ? 1 : 0));
    for (const k of keys) {
      const ov = frames[k];
      const targets = k === '*' ? p.indices.map((_, i) => i) : [Number(k)];
      if (!targets.every((i) => Number.isInteger(i) && i >= 0 && i < p.indices.length)) { warn(`hitboxes.json: ${anim} frame "${k}" out of range (0-${p.indices.length - 1})`); continue; }
      for (const i of targets) {
        const key = String(p.indices[i]);
        boxes[key] = boxes[key] || {};
        for (const kind of ['hit', 'hurt']) {
          if (!(kind in (ov || {}))) continue;
          const list = ov[kind];
          if (!Array.isArray(list) || !list.every(validBox)) { warn(`hitboxes.json: ${anim}[${k}].${kind} must be [[x,y,w,h], ...]`); continue; }
          // an explicit empty `hit` list is kept: the engine reads it as "this frame cannot hit"
          // (a missing list falls back to the move's reach); an empty `hurt` list means "use the default body box"
          if (list.length) boxes[key][kind] = list.map((bx) => (tf ? scaleAboutPivot(bx, tf, true) : bx).map((v) => Math.round(v)));
          else if (kind === 'hit') boxes[key].hit = [];
          else delete boxes[key][kind];
          if (kind === 'hit') hitSet?.add(key);
        }
        // hand: the palm/fingertip point the engine anchors hand effects, shots and beams to
        // ([x, y] in the 256 cell; the engine falls back to the hit box, then fixed offsets)
        if ('hand' in (ov || {})) {
          const h = ov.hand;
          if (Array.isArray(h) && h.length === 2 && h.every((v) => Number.isFinite(v))) boxes[key].hand = (tf ? scaleAboutPivot(h, tf, false) : h).map((v) => Math.round(v));
          else if (h === null) delete boxes[key].hand;
          else warn(`hitboxes.json: ${anim}[${k}].hand must be [x, y]`);
        }
        n++;
      }
    }
  }
  return n;
}

// Median-cut palette over all opaque pixels, then snap every pixel to it.
function quantizeFrames(cells, n, fixed = null, learned = null) {
  if (fixed) return mapToPalette(cells, fixed, learned);
  const colors = colourCounts(cells);
  if (colors.size <= n) return colors.size;
  return mapToPalette(cells, medianCut(colors, n));
}

// opaque colour (0xRRGGBB) -> pixel count, in the order the pixels are met
function colourCounts(cells) {
  const colors = new Map();
  for (const c of cells) for (let i = 0; i < c.data.length; i += 4) if (c.data[i + 3]) {
    const k = (c.data[i] << 16) | (c.data[i + 1] << 8) | c.data[i + 2];
    colors.set(k, (colors.get(k) || 0) + 1);
  }
  return colors;
}

// n colours for a colour -> count map (its own colours when it has no more than n)
function medianCut(colors, n) {
  if (colors.size <= n) return [...colors.keys()].map((k) => [k >> 16, (k >> 8) & 255, k & 255]);
  let boxes = [[...colors.entries()].map(([k, cnt]) => [k >> 16, (k >> 8) & 255, k & 255, cnt])];
  while (boxes.length < n) {
    let bi = -1, bestRange = -1, ch = 0;
    boxes.forEach((bx, i) => {
      if (bx.length < 2) return;
      for (let c = 0; c < 3; c++) {
        let mn = 255, mx = 0;
        for (const p of bx) { if (p[c] < mn) mn = p[c]; if (p[c] > mx) mx = p[c]; }
        if (mx - mn > bestRange) { bestRange = mx - mn; bi = i; ch = c; }
      }
    });
    if (bi < 0 || bestRange <= 0) break;
    const bx = boxes[bi].sort((a, b) => a[ch] - b[ch]);
    const total = bx.reduce((s, p) => s + p[3], 0);
    let acc = 0, cut = 1;
    for (let i = 0; i < bx.length - 1; i++) { acc += bx[i][3]; if (acc >= total / 2) { cut = i + 1; break; } }
    boxes.splice(bi, 1, bx.slice(0, cut), bx.slice(cut));
  }
  return boxes.map((bx) => {
    let r = 0, g = 0, b = 0, t = 0;
    for (const p of bx) { r += p[0] * p[3]; g += p[1] * p[3]; b += p[2] * p[3]; t += p[3]; }
    return [Math.round(r / t), Math.round(g / t), Math.round(b / t)];
  });
}

// --quantize with a paletteReserve (ADR 0046). A strip drawn in colours the rest of the fighter never uses (Naruto's
// crimson Four-Tails fox) loses them in one median cut that his orange jumpsuit dominates. Here the shared palette is
// the usual one (the median cut over every strip, or the kept sheet's colours) less the entries the other strips need
// least, merged into their nearest neighbours; each group then gets that many colours cut from its own strips, and its
// strips snap to the shared palette plus their own. The other strips keep their colours (only pixels on a merged entry
// move, to the next nearest) and never pick a group's colour, so a group's art never moves them.
// groups: [{ name, colors, anims: [anim, ...] }]; kept: { palette, reserved: Set of the colours only the groups' strips
// used last time } with --keep-palette; learn(anims): learnPalette for those strips
function quantizeReserved(anims, n, groups, kept = null, learn = () => null) {
  const own = new Set(groups.flatMap((g) => g.anims));
  const shared = anims.filter((a) => !own.has(a)), sharedCells = shared.flatMap((a) => a.cells);
  const all = colourCounts(anims.flatMap((a) => a.cells));
  if (!kept && all.size <= n) return { colors: all.size, shared: all.size, merged: 0 }; // every colour fits as drawn
  const ck = (p) => (p[0] << 16) | (p[1] << 8) | p[2];
  const base = kept ? kept.palette.filter((p) => !kept.reserved.has(ck(p))) : medianCut(all, n);
  const learnedShared = learn(shared);
  const sharedPal = shrinkPalette(colourCounts(sharedCells), base, n - groups.reduce((s, g) => s + g.colors, 0), learnedShared);
  // a learned target that was merged away is no target any more
  const onlyTo = (learned, pal) => {
    if (!learned) return null;
    const keys = new Set(pal.map(ck));
    return new Map([...learned].filter(([, v]) => keys.has(v)));
  };
  mapToPalette(sharedCells, sharedPal, onlyTo(learnedShared, sharedPal));
  const sharedKeys = new Set(sharedPal.map(ck));
  for (const g of groups) {
    const cells = g.anims.flatMap((a) => a.cells);
    const pal = [...sharedPal, ...medianCut(colourCounts(cells), g.colors).filter((p) => !sharedKeys.has(ck(p)))];
    mapToPalette(cells, pal, onlyTo(learn(g.anims), pal));
  }
  return { colors: countColors(anims.flatMap((a) => a.cells)), shared: sharedPal.length, merged: base.length - sharedPal.length };
}

// Drops palette entries until `target` are left, each time the one whose pixels lose least by moving to their nearest
// remaining entry (pixels x squared RGB distance, summed over colors: colour -> count). Near-duplicate shades go first.
// learned (--keep-palette): where a colour went last time; it stays there while that entry is left.
function shrinkPalette(colors, palette, target, learned = null) {
  const m = palette.length;
  if (m <= target) return palette;
  const keys = [...colors.keys()], cnt = keys.map((k) => colors.get(k)), U = keys.length;
  const at = new Map(palette.map((p, i) => [(p[0] << 16) | (p[1] << 8) | p[2], i]));
  const alive = new Uint8Array(m).fill(1), cost = new Float64Array(m);
  const first = new Int32Array(U), second = new Int32Array(U), loss = new Float64Array(U);
  const d2 = (k, p) => ((k >> 16) - p[0]) ** 2 + (((k >> 8) & 255) - p[1]) ** 2 + ((k & 255) - p[2]) ** 2;
  // the entry a colour sits on (learned, else the nearest; ties to the earlier entry, as mapToPalette) and what it
  // would lose by moving to the nearest other one
  const scan = (j) => {
    const k = keys[j], li = learned?.has(k) ? at.get(learned.get(k)) : undefined;
    const pinned = li !== undefined && alive[li] === 1;
    let a = pinned ? li : -1, da = pinned ? d2(k, palette[li]) : Infinity, b = -1, db = Infinity;
    for (let i = 0; i < m; i++) {
      if (!alive[i] || i === a) continue;
      const d = d2(k, palette[i]);
      if (!pinned && d < da) { b = a; db = da; a = i; da = d; }
      else if (d < db) { b = i; db = d; }
    }
    first[j] = a; second[j] = b; loss[j] = b < 0 ? 0 : cnt[j] * (db - da);
  };
  for (let j = 0; j < U; j++) { scan(j); cost[first[j]] += loss[j]; }
  for (let left = m; left > target; left--) {
    let e = -1;
    for (let i = 0; i < m; i++) if (alive[i] && (e < 0 || cost[i] < cost[e])) e = i;
    alive[e] = 0;
    for (let j = 0; j < U; j++) if (first[j] === e || second[j] === e) {
      if (first[j] !== e) cost[first[j]] -= loss[j];
      scan(j);
      cost[first[j]] += loss[j];
    }
  }
  return palette.filter((_, i) => alive[i]);
}

// the colours a packed sheet (every page) shows only in the cells of the named animations (a reserved group's own,
// last pack)
function onlyIn(pages, metaFile, names, spec) {
  const meta = readJson(metaFile).data, inside = new Set(), outside = new Set();
  if (!meta?.animations) return inside;
  const fw = spec.frameWidth, cols = meta.columns ?? spec.columns;
  for (const [name, a] of Object.entries(meta.animations)) for (const f of a.frames || []) {
    const set = names.has(name) ? inside : outside, at = frameCell(meta, f, cols), sheet = pages[at.page];
    if (!sheet) continue;
    for (let y = at.y; y < at.y + fw && y < sheet.h; y++) for (let x = at.x; x < at.x + fw; x++) {
      const i = (y * sheet.w + x) * 4;
      if (sheet.data[i + 3]) set.add((sheet.data[i] << 16) | (sheet.data[i + 1] << 8) | sheet.data[i + 2]);
    }
  }
  return new Set([...inside].filter((k) => !outside.has(k)));
}

// the fighter's paletteReserve groups with the strips this pack has; null when they would leave too little to share
function reserveGroups(id, anims, names, env, warn) {
  const list = env.manifest.characters[id]?.paletteReserve || [];
  const groups = [];
  for (const g of list) {
    const unknown = g.animations.filter((a) => !names.has(a));
    if (unknown.length) warn(`paletteReserve.${g.name}: ${unknown.join(', ')} is not an animation of ${id} - ignored`);
    const strips = anims.filter((a) => g.animations.includes(a.def.name));
    if (strips.length) groups.push({ name: g.name, colors: g.colors, anims: strips });
  }
  const reserve = groups.reduce((s, g) => s + g.colors, 0);
  if (reserve > env.quantize / 2) {
    warn(`paletteReserve asks for ${reserve} of the ${env.quantize} colours: at most half can be reserved - ignored, one shared palette`);
    return [];
  }
  return groups;
}

// every opaque pixel to its nearest palette colour (RGB distance); the palette's own colours map to themselves
// learned: source colour -> the palette colour the previous pack chose for it (--keep-palette), so a colour that is as
// near to two palette entries as to each other lands where it did before, whatever order the palette is in
function mapToPalette(cells, palette, learned = null) {
  const cache = new Map(learned ? [...learned].map(([k, v]) => [k, [v >> 16, (v >> 8) & 255, v & 255]]) : []);
  for (const c of cells) for (let i = 0; i < c.data.length; i += 4) if (c.data[i + 3]) {
    const k = (c.data[i] << 16) | (c.data[i + 1] << 8) | c.data[i + 2];
    let p = cache.get(k);
    if (!p) {
      let bd = Infinity;
      for (const q of palette) { const dd = (q[0] - c.data[i]) ** 2 + (q[1] - c.data[i + 1]) ** 2 + (q[2] - c.data[i + 2]) ** 2; if (dd < bd) { bd = dd; p = q; } }
      cache.set(k, p);
    }
    c.data[i] = p[0]; c.data[i + 1] = p[1]; c.data[i + 2] = p[2];
  }
  return palette.length;
}

function countColors(cells) {
  const s = new Set();
  for (const c of cells) for (let i = 0; i < c.data.length; i += 4) if (c.data[i + 3]) s.add((c.data[i] << 16) | (c.data[i + 1] << 8) | c.data[i + 2]);
  return s.size;
}

// The sheet pages in a fighter's output folder past the first n (sheet2.png is page 2): left over from a bigger pack.
function stalePages(dir, n) {
  if (!isDir(dir)) return [];
  return fs.readdirSync(dir).filter((f) => { const m = /^sheet([1-9]\d*)\.png$/.exec(f); return m && Number(m[1]) >= 2 && Number(m[1]) > n; }).map((f) => path.join(dir, f));
}

function writeFile(env, file, buf, R) {
  if (env.dryRun) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buf);
  R.wrote.push(rel(env.cwd, file));
}

// Clean frames written back to art/.../frames/<anim>/ so humans can touch them up.
function writeBack(env, dir, prefix, cells, src, R, extra = {}) {
  if (env.dryRun || !env.writeback) return;
  fs.mkdirSync(dir, { recursive: true });
  const old = readJson(path.join(dir, MARKER)).data;
  if (old?.files) for (const f of Object.keys(old.files)) if (new RegExp(`^${prefix}_\\d+\\.png$`, 'i').test(f)) { try { fs.unlinkSync(path.join(dir, f)); } catch { /* gone */ } }
  const files = {};
  cells.forEach((c, k) => {
    const name = `${prefix}_${String(k).padStart(2, '0')}.png`;
    const buf = encodePng(c);
    fs.writeFileSync(path.join(dir, name), buf);
    files[name] = sha1(buf);
  });
  const marker = {
    generatedBy: 'tools/pack-sprites.mjs', note: 'Frames cleaned from raw/. Edit freely: edited frames are never overwritten.',
    sourceFile: src.label, version: src.version ?? null, source: src.hashInputs.map((f) => rel(env.artDir, f)), sourceHash: hashFiles(src.hashInputs), ...extra, files,
  };
  fs.writeFileSync(path.join(dir, MARKER), JSON.stringify(marker, null, 2) + '\n');
  R.writeback.push(rel(env.cwd, dir));
}

// ============================================================== scale gate (TOOL-025, ADR 0021, art/CHARACTER_SCALE.md)
// tools/scale-probe.mjs measures every strip against the idle of this pack, on the cells before --quantize, with the
// colours reduced to the idle's own palette (measurementCells), so the audit is the same with or without --quantize
// and no strip's colours move another strip's numbers.
function auditAnims(id, anims, env) {
  const decl = env.builds?.[id] || {};
  return auditCharacter(anims.map((a) => ({ name: a.def.name, cells: a.cells, version: a.version, phases: a.def.phases })), {
    decl, gate: env.gate, exempt: exemptionsFrom(env.manifestRaw?.characters?.[id]?.animations), maxColors: env.spec.maxColors,
    reference: scaleReferenceFor(id, env),
  });
}
const scaleReferenceFor = (id, env) => loadScaleReference(env.artDir, env.builds?.[id] || {}) || env.approvedIdleRef?.[id] || null;

// A new idle candidate as the newest raw would become the scale gate's reference and move every strip's head numbers
// and auto head fits (TOOL-040: Gojo idle v07 made superDash read 0.47). While the packed idle is not the approved
// version, the gate measures against the approved idle instead, imported and placed exactly like the live one, and
// the candidate idle is gated like any other strip. A builds.json scaleReference still wins.
function approvedIdleReference(id, defs, anims, rawIdx, env, R, warn) {
  const def = defs.find((d) => d.name === 'idle');
  const live = anims.find((a) => a.def.name === 'idle');
  if (def?.approvedVersion == null || live?.version == null || live.version === def.approvedVersion) return;
  if (loadScaleReference(env.artDir, env.builds?.[id] || {})) return;
  const vv = (n) => `v${String(n).padStart(2, '0')}`;
  const raw = pickRaw(rawIdx.get('idle'), 'idle', def.approvedVersion);
  if (raw?.version !== def.approvedVersion) {
    warn(`idle: candidate ${vv(live.version)} is packed and no raw/idle_${vv(def.approvedVersion)}.png is left - every strip is measured against the candidate`);
    return;
  }
  const side = readSidecars(raw.sidecars, warn, 'idle');
  const { frames } = framesFromRaw(raw.files, def.frames, side, env, 'char', () => {}, 'idle', raw.strip);
  if (!frames.length) return;
  const packScale = (env.manifest.characters[id]?.packScale ?? 1) * def.packScale;
  const bodyHeight = Math.round((Number(side.bodyHeight) > 0 ? Number(side.bodyHeight) : def.bodyHeight) * packScale);
  const maxH = Math.max(...frames.map((s) => s.h));
  const scale = Math.abs(maxH - bodyHeight) <= 1 ? 1 : bodyHeight / maxH;
  const offsets = scaleOffsets(frameOffsetsFor(side, frames.length, env.spec, () => {}, 'idle'), packScale);
  const cells = frames.map((s, k) => placeCharFrame(resample(s, scale, { coverage: 0.5, alphaMin: 128 }), env.spec, offsets?.[k], null).cell);
  (env.approvedIdleRef ??= {})[id] = { cells, label: `approved idle ${vv(def.approvedVersion)} (${raw.label})` };
  R.notes.push(`scale: measured against the approved idle ${vv(def.approvedVersion)}, not the packed candidate ${vv(live.version)}`);
}

// builds.json fighter "scaleReference": { "cells": ["characters/<id>/reference/<approved cell>.png", ...], "why": "..." }
// (paths under art/): approved reference cells at the packed scale (256 px, feet on the pivot line) that the gate
// measures every strip against, the idle included, instead of the idle (scale-probe auditCharacter). null when unset;
// a missing or wrong-size cell is { error }, never silently the idle.
// "standingReference" has the same shape and is the approved upright cell the hit box finder measures "above the head"
// against (loadStandingReference).
const scaleRefCache = new Map();
function loadReferenceCells(artDir, list, key) {
  if (!Array.isArray(list) || !list.length) return null;
  const ck = `${key}|${artDir}|${list.join('|')}`;
  if (scaleRefCache.has(ck)) return scaleRefCache.get(ck);
  const cells = list.map((f) => {
    const file = path.join(artDir, f);
    if (!fs.existsSync(file)) return `builds.json ${key}: ${f} does not exist under ${artDir}`;
    const img = readPng(file);
    if (img.w !== SPEC_CELL || img.h !== SPEC_CELL) return `builds.json ${key}: ${f} is ${img.w}x${img.h}, not a ${SPEC_CELL} px game cell`;
    return img;
  });
  const bad = cells.find((c) => typeof c === 'string');
  const out = bad ? { error: bad } : { cells, label: list.join(', ') };
  scaleRefCache.set(ck, out);
  return out;
}
export function loadScaleReference(artDir, decl) {
  return loadReferenceCells(artDir, decl?.scaleReference?.cells, 'scaleReference');
}
export function loadStandingReference(artDir, decl) {
  return loadReferenceCells(artDir, decl?.standingReference?.cells, 'standingReference');
}
const SPEC_CELL = 256;

// Auto head fit (opt-in per strip): a raw strip whose head AND feet are off the idle's in the same direction ('uniform')
// was drawn or packed at the wrong size, so it is resampled once more from the raw by 1/head. Drift (the head alone)
// and pops are never fitted: rescaling cannot fix a drawing. An applied factor goes into the frames/ marker, so the fit
// is measured once at import and repeat packs keep the fitted frames byte for byte. A request that was not fitted is
// not recorded: it re-imports and is measured again on every pack while it stands, so a new exemption, headColors
// or idle can still make it fit.
function fitHeads(id, anims, env, R) {
  const A = auditAnims(id, anims, env);
  const spec = env.spec, g = env.gate;
  for (const a of anims) {
    if (!a.fit) continue;
    const s = A.anims?.[a.def.name];
    if (!s || s.verdict !== 'uniform') {
      a.notes.push(`auto-head: ${s ? `verdict ${s.verdict}${s.head != null ? ` (head ${s.head.toFixed(2)})` : ''}` : A.error} - not fitted (only a uniform size error is)`);
      R.warnings.push(...a.fit.placeWarn); // not fitted: the pre-fit cells are the ones that ship
      continue;
    }
    // the head was measured on cells that already carry the strip's own packScale (ADR 0041): fitting the head back to
    // the idle's would undo that correction, so the fit keeps it (the probe misreads some strips, Gojo light1 v05)
    let f = a.def.packScale / s.head;
    if (f < g.fitMin || f > g.fitMax) {
      R.warnings.push(`${a.def.name}: auto-head fit x${f.toFixed(2)} is outside ${g.fitMin}-${g.fitMax} - clamped; redraw the strip at the idle's size`);
      f = Math.min(g.fitMax, Math.max(g.fitMin, f));
    }
    f = Math.round(f * 1e4) / 1e4;
    const clipped = [], tight = [];
    a.cells = a.fit.sprites.map((sp, k) => {
      const { cell, lost, clip, margin } = placeCharFrame(resample(sp, a.fit.scales[k] * f, { coverage: 0.5, alphaMin: 128 }), spec, a.fit.frameOffsets?.[k], a.fit.wallFrames?.has(k) ? 'wall' : null);
      if (lost) clipped.push(`#${k} ${clip.join('/')}`);
      else if (margin.length) tight.push(`#${k} ${margin.join('/')}`);
      return cell;
    });
    a.frameScales = a.fit.scales.map((v) => +(v * f).toFixed(5));
    a.scale *= f;
    a.autoHead = f;
    a.notes.push(`auto-head fit x${f} (head ${s.head.toFixed(2)}, feet ${s.feet == null ? '-' : s.feet.toFixed(2)} of idle)`);
    if (a.frameScales.some((v) => v > 1)) R.warnings.push(`${a.def.name}: auto-head fit upscales the raw art (nearest) - generate it bigger`);
    if (clipped.length) R.warnings.push(`${a.def.name}: auto-head fit clips ${clipped.length} frame(s) (${clipped.join(', ')}) - repose those frames inside the cell`);
    if (tight.length) R.warnings.push(`${a.def.name}: auto-head fit puts ${tight.length} frame(s) into the ${spec.cellMargin}px cell margin (${tight.join(', ')})`);
  }
}

// Every strip against the approved idle. A strict strip that is off refuses the pack (nothing written, exit code 1):
// unapproved ones in the default 'auto' mode (a candidate version, a new fighter), every strip with --strict-scale or
// "scaleGate": "strict". Approved strips are findings until they are fixed (ART-SCALE-02), so art that already ships
// never blocks a pack. A folder without a manifest entry (scratch art, no manifest) is only reported ('warn').
// Returns the compact audit for anims.json (meta.scaleAudit), or null when nothing could be measured.
function scaleGate(id, anims, env, R) {
  const mc = env.manifestRaw?.characters?.[id];
  const mode = env.scaleStrict ? 'strict' : !mc ? 'warn' : ['strict', 'warn', 'auto'].includes(mc.scaleGate) ? mc.scaleGate : 'auto';
  const out = { gate: mode, failed: [], findings: [], anims: {} };
  R.scale = out;
  const approved = (a) => a.def.approvedVersion != null && (a.version == null || a.version <= a.def.approvedVersion);
  // the idle is the reference and never fails, unless builds.json names an approved reference: then it is gated too
  const external = !!scaleReferenceFor(id, env)?.cells;
  const isStrict = (a) => (a.def.name !== 'idle' || external) && (mode === 'strict' || (mode === 'auto' && !approved(a)));
  if (!anims.some((a) => a.def.name === 'idle')) { out.error = 'no idle packed yet - nothing to measure against'; R.notes.push(`scale: ${out.error}`); return null; }
  const A = auditAnims(id, anims, env);
  if (A.error) {
    out.error = A.error;
    const strict = anims.filter(isStrict).map((a) => a.def.name);
    if (strict.length) { out.failed.push(...strict); R.warnings.push(`scale gate: ${A.error} (strict strips: ${strict.join(', ')})`); }
    else R.notes.push(`scale: ${A.error}`);
    return null;
  }
  out.ref = { box: A.ref.box, headPx: A.ref.headPx, palette: [...A.palette.head].map(hex), source: A.palette.headSource, ...(A.reference ? { reference: A.reference } : {}) };
  const base = env.baseline?.[id];
  const tol = env.gate.stripTol;
  if (base?.ref?.headPx && A.ref.headPx.some((v, k) => Math.abs(v / base.ref.headPx[k] - 1) > tol)) {
    R.warnings.push(`scale: the idle head is ${A.ref.headPx.join('x')} px, ${base.ref.headPx.join('x')} in art/scale/scale-baseline.json - every strip is now measured against this idle (check the lineup; npm run scale -- --baseline accepts it)`);
  }
  for (const a of anims) {
    const name = a.def.name, s = A.anims[name], strict = isStrict(a);
    out.anims[name] = { head: s.head, feet: s.feet, range: s.range, verdict: s.verdict, strict, version: a.version, reason: s.reason, frames: s.frames.map((f) => f.head) };
    const vv = a.version != null ? `v${String(a.version).padStart(2, '0')}` : 'unversioned';
    // a candidate the probe cannot read is not a pass: it needs a person's check of that version (scaleManualQA,
    // verdict 'manual') before it ships (TOOL-ROTATED-ANATOMY); approved strips stay findings as before
    const failing = FLAGGED.has(s.verdict) || s.verdict === 'unmeasured' || s.verdict === 'partial';
    if (failing && strict) {
      out.failed.push(name);
      R.warnings.push(`scale gate: ${verdictText(name, s)} [${vv}, ${mode === 'auto' ? 'not approved yet' : 'strict'}]`);
    } else if (FLAGGED.has(s.verdict)) out.findings.push(`${verdictText(name, s)} [approved ${vv}]`);
    // an exemption is tied to the drawing it was written for: a redraw is measured until it is re-exempted on purpose
    if (s.staleExempt) R.warnings.push(`scale: ${staleExemptText(name, s.staleExempt)}`);
    if (s.staleManual) R.warnings.push(`scale: ${name}: the manual QA record (scaleManualQA) is for v${String(s.staleManual.v).padStart(2, '0')} but the packed strip is ${vv} - check this version and record it again`);
    // an approved strip whose head moved at the same version: a sidecar, bodyHeight or packer change resized it silently
    const b = base?.anims?.[name];
    if (b && a.version != null && b.v === a.version && Number.isFinite(b.head) && s.head != null && Math.abs(s.head - b.head) > env.gate.baselineTol) {
      R.warnings.push(`scale: ${name} head ${s.head.toFixed(2)} was ${b.head.toFixed(2)} in art/scale/scale-baseline.json at the same version ${vv} - a sidecar, bodyHeight or packer change resized it (npm run scale -- --baseline accepts an intended change)`);
    }
  }
  return compactAudit(A, env.gate);
}

// hitboxes.json boxes and hand anchors were measured on cells of one size: when the auto head fit rescales an
// animation by f, they are scaled by f about the pivot (the feet). "_scale" in the animation's block records the fit
// they were measured at (default 1), so re-measured boxes are not scaled twice.
const scaleAboutPivot = (v, t, isBox) => {
  const x = t.px + (v[0] - t.px) * t.k, y = t.py + (v[1] - t.py) * t.k;
  return isBox ? [x, y, v[2] * t.k, v[3] * t.k] : [x, y];
};

function packCharacter(id, env) {
  const R = { id, packed: [], missing: [], missingCore: [], failed: [], blocked: [], versions: {}, complete: false, frames: 0, sheet: null, colors: 0, warnings: [], notes: [], wrote: [], writeback: [], ui: [], uiItems: [], ground: {}, tech: {}, alts: {}, hitBoxes: {} };
  const warn = (m) => R.warnings.push(m);
  const spec = env.spec;
  const charDir = path.join(env.artDir, 'characters', id);
  const label = `characters/${id}`;
  if (!isDir(charDir)) {
    warn(`no folder art/characters/${id}/ - copy art/characters/_template/ to start it`);
    R.missingCore = [...CORE];
    return R;
  }
  const defs = animDefsFor(id, env);
  const packScale = env.manifest.characters[id]?.packScale ?? 1;
  if (packScale !== 1) {
    R.notes.push(`packScale x${packScale}: every strip, frameOffsets and hitboxes.json point resized about the pivot (ADR 0041)`);
    const decl = env.builds?.[id] || {};
    if (decl.scaleReference || decl.standingReference) warn(`packScale x${packScale}: builds.json scaleReference/standingReference cells are compared at their own size - cut them again at the new size`);
  }
  const names = defs.map((d) => d.name);
  const rawIdx = scanRaw(path.join(charDir, 'raw'), names, warn, `${label}/raw`);
  const framesRoot = path.join(charDir, 'frames');
  for (const d of listDirs(framesRoot)) {
    if (!d.startsWith('_') && !names.includes(d) && listPngs(path.join(framesRoot, d)).length) warn(`${label}/frames/${d}/: unknown animation (not in manifest or animGuide) - ignored`);
  }
  // written into every frames/<anim>/.packer.json: a different cell (spec change) re-imports untouched frames
  const cellKey = { frameWidth: spec.frameWidth, frameHeight: spec.frameHeight, pivot: [...spec.pivot] };
  // the tallest pose must fit between the top margin of the cell and the floor line (pivot y)
  const maxBody = spec.pivot[1] + 1 - spec.cellMargin;

  // 1) gather + normalize every animation
  const anims = [];
  for (const def of defs) {
    const alabel = `${def.name}`;
    try {
      const framesDir = path.join(framesRoot, def.name);
      const raw = pickRaw(rawIdx.get(def.name), def.name);
      if (raw?.version != null) R.versions[def.name] = raw.version;
      const side = readSidecars(raw?.sidecars, warn, alabel);
      const fitHead = side.anatomy?.measurement === 'auto-head' || env.fitHead.has(`${id}:${def.name}`);
      const stripScale = packScale * def.packScale; // the fighter's packScale times this strip's own
      if (def.packScale !== 1) R.notes.push(`${alabel}: packScale x${def.packScale} (this strip, ADR 0041)`);
      let bodyHeight = Math.round((Number(side.bodyHeight) > 0 ? Number(side.bodyHeight) : def.bodyHeight) * stripScale);
      let tooTall = null;
      const asked = bodyHeight;
      if (!(bodyHeight >= 8 && bodyHeight <= maxBody)) {
        const fixed = Math.min(maxBody, Math.max(8, bodyHeight || DEFAULT_BODY_HEIGHT));
        tooTall = `${alabel}: bodyHeight ${bodyHeight} does not fit the ${spec.frameHeight}px cell (8-${maxBody}px: floor line y ${spec.pivot[1]}, ${spec.cellMargin}px top margin) - using ${fixed}`;
        bodyHeight = fixed;
      }
      const src = chooseSource(framesDir, raw, { bodyHeight, cell: cellKey, artDir: env.artDir, fitHead }, warn, alabel);
      if (!src) { R.missing.push(def.name); continue; }
      if (src.kind === 'stale') { warn(staleText(alabel, def.name, src)); R.missing.push(def.name); continue; }
      if (src.shadowed) {
        const was = `v${String(src.shadowed.version).padStart(2, '0')}`;
        R.blocked.push(def.name);
        warn(`${alabel}: frames/${def.name}/ has hand edits made on ${was} (${src.shadowed.file}), but ${src.label} is newer - those edits belong to another drawing, so the pack is refused rather than shipping ${was} as ${src.label}. Move frames/${def.name}/ to frames/_old/${def.name}_${was}/ to pack ${src.label}, or redo the edits on it`);
      }
      if (tooTall) warn(tooTall); // only for animations that have art: the rest would be noise
      let sprites, notes = [], sourceLabel, unreadable = false;
      // what the art came from: the raw file (also behind packer-written frames/), its version, hand edits
      let origin = null, version = null, edited = false, handMade = false;
      if (src.kind === 'frames') {
        const items = framesFromFolder(framesDir, src.framePngs, 'char', env, warn, alabel);
        sprites = items.map((f) => f.img);
        const stray = items.reduce((s, f) => s + f.stray, 0);
        if (stray) notes.push(`ignored ${stray} stray pixel(s) - clean them in frames/${def.name}/`);
        sourceLabel = `frames/${def.name}/`;
        if (src.origin) ({ file: origin, version } = src.origin);
        edited = !!src.edited;
        handMade = !src.packerMade;
      } else {
        ({ frames: sprites, notes, unreadable } = framesFromRaw(src.rawFiles, def.frames, side, env, 'char', warn, alabel, src.strip));
        sourceLabel = origin = src.label;
        version = src.version;
        if (src.replaced) notes.push(`re-imported: replaces frames/ cleaned from ${src.replaced}`);
      }
      if (raw?.ignored.length) notes.push(`ignored ${raw.ignored.join(' and ')} (a _vNN version exists)`);
      if (def.approvedVersion && version != null && version !== def.approvedVersion) notes.push(`candidate v${String(version).padStart(2, '0')} (approved: v${String(def.approvedVersion).padStart(2, '0')})`);
      if (!sprites.length) {
        if (!unreadable) warn(`${alabel}: no sprite pixels found in ${sourceLabel}`);
        R.missing.push(def.name); R.failed.push(def.name); continue;
      }
      const maxH = Math.max(...sprites.map((s) => s.h));
      let scale = bodyHeight / maxH;
      // raw art is scaled exactly; already-clean frames are only resampled when clearly off-size
      // (mode-downscaling can lose a partial top row, so a clean frame may be 1-2px short)
      const keep = src.kind === 'frames' ? Math.max(2, Math.round(bodyHeight * 0.04)) : 1;
      if (Math.abs(maxH - bodyHeight) <= keep) {
        if (maxH !== bodyHeight && src.kind === 'frames' && !src.packerMade) notes.push(`kept native size (${maxH}px vs ${bodyHeight}px)`);
        scale = 1;
      }
      const anatomyScales = anatomicalScalesFor(side, sprites.length, warn, alabel)?.map((a) => a * stripScale) ?? null;
      if (anatomyScales) {
        // Cached or hand-edited cells already have their final anatomy. Never normalize them
        // to bodyHeight again; source/sidecar hash invalidation handles fresh raw imports.
        scale = 1;
        notes.push('anatomical scale: skull-to-chin ' + side.anatomy.targetHeadPx + 'px; bounds are pose-dependent');
        if (src.kind !== 'frames' && anatomyScales.some((n) => n > 1)) warn(alabel + ': anatomical calibration upscales raw art - generate larger source poses');
      }
      // frames written by an auto head fit already have their fitted size: never pull them back to bodyHeight
      const autoHead = src.kind === 'frames' && fitHead ? src.autoHead ?? null : null;
      if (autoHead != null && autoHead !== 1) { scale = 1; notes.push(`auto-head fit x${autoHead} (from the import)`); }
      if (scale > 1) warn(`${alabel}: art is smaller than the target (${maxH}px < ${bodyHeight}px) - upscaled x${scale.toFixed(2)} (nearest); generate it bigger`);
      const frameOffsets = scaleOffsets(frameOffsetsFor(side, sprites.length, spec, warn, alabel), stripScale);
      const wallFrames = beatFrames(def.phases, sprites.length, TECH_POSES[def.name]?.wall);
      const cells = [];
      const frameScales = [];
      const clipped = [], tight = [];
      sprites.forEach((s, k) => {
        const poseScale = anatomyScales && src.kind !== 'frames' ? anatomyScales[k] : scale;
        frameScales.push(+poseScale.toFixed(5));
        const small = resample(s, poseScale, { coverage: 0.5, alphaMin: 128 });
        const { cell, lost, clip, margin } = placeCharFrame(small, spec, frameOffsets?.[k], wallFrames.has(k) ? 'wall' : null);
        if (lost) clipped.push(`#${k} ${clip.join('/')}`);
        else if (margin.length) tight.push(`#${k} ${margin.join('/')}`);
        cells.push(cell);
      });
      const fitAdvice = anatomyScales ? 'repose or reposition while preserving anatomical scale' : 'lower bodyHeight or redraw';
      // a strip that asks for the auto head fit is placed again at its fitted size (fitHeads), so its clip and margin
      // warnings wait for that: the pre-fit cells are discarded and their warnings described pixels that never ship
      // (Sasuke special v13: "clipped 15px" for a fitted frame that sits inside the cell)
      const placeWarn = [];
      if (clipped.length) placeWarn.push(`${alabel}: ${clipped.length} frame(s) clipped by the ${spec.frameWidth}x${spec.frameHeight} cell (${clipped.join(', ')}) - pose too wide/tall for the pivot; ${fitAdvice}`);
      if (tight.length) placeWarn.push(`${alabel}: ${tight.length} frame(s) reach into the ${spec.cellMargin}px cell margin (${tight.join(', ')}) - keep every pixel inside x ${spec.cellMargin}..${spec.frameWidth - 1 - spec.cellMargin}, y >= ${spec.cellMargin}; ${fitAdvice}`);
      if (!(fitHead && src.kind === 'raw')) placeWarn.forEach(warn);
      if (cells.length !== def.frames) warn(`${alabel}: ${cells.length} frame(s), manifest expects ${def.frames}${def.phases ? ` (phases rescaled to ${rescalePhases(def.phases, cells.length).join('/')})` : ''}`);
      // fit: what the auto head fit needs to rescale a raw strip after the scale audit (raw sources only)
      const fit = fitHead && src.kind === 'raw' ? { sprites, scales: frameScales.slice(), frameOffsets, wallFrames, placeWarn } : null;
      if (fitHead && src.kind !== 'raw' && autoHead == null) notes.push('auto-head fit needs the raw source (frames/ were hand-edited or the raw is gone) - not fitted');
      // what the strip was really resized by: a bodyHeight capped by the cell scales its hitboxes.json points less too
      const sizeFit = stripScale * (asked > 0 ? bodyHeight / asked : 1);
      anims.push({ def, cells, scale, frameScales, sizeFit, sourceLabel, src, notes, bodyHeight, origin, version, edited, handMade, fitHead, autoHead, fit });
    } catch (e) {
      warn(`${alabel}: failed - ${e.message}`);
      R.missing.push(def.name);
      R.failed.push(def.name);
    }
  }

  approvedIdleReference(id, defs, anims, rawIdx, env, R, warn);

  // UI images are independent of the sheet
  packUi(id, charDir, env, R);

  R.missingCore = defs.filter((d) => d.required && !anims.some((a) => a.def.name === d.name)).map((d) => d.name);
  if (!anims.length) {
    // A pack this packer made earlier, whose every source is gone (e.g. the only idle version moved to
    // raw/_rejected/), must not keep shipping the rejected art: remove it so the game falls back to the
    // placeholder. A sheet that did not come from the packer (Sprite Lab download, hand-made) is left alone.
    const outChar = path.join(env.outDir, 'characters', id);
    const existing = path.join(outChar, 'anims.json');
    if (isFile(existing)) {
      const old = readJson(existing).data;
      if (old?.source === 'art-pack') {
        const stale = [existing, path.join(outChar, 'sheet.png'), ...stalePages(outChar, 1)].filter(isFile);
        if (!env.dryRun) for (const f of stale) fs.unlinkSync(f);
        R.removed = stale.map((f) => rel(env.cwd, f));
        R.notes.push(`${env.dryRun ? 'would remove' : 'removed'} the stale art pack (nothing packable left): ${R.removed.join(', ')}; the game uses the placeholder`);
      } else {
        R.notes.push(`no frames in art/ - left the existing ${rel(env.cwd, existing)} untouched (not made by the packer)`);
      }
    }
    return R;
  }

  // 1b) auto head fit for the strips that asked for it (sidecar anatomy auto-head or --fit-head)
  if (anims.some((a) => a.fit)) fitHeads(id, anims, env, R);

  // 2) scale gate: every strip's head (hair included) and feet against the approved idle. It runs before the palette
  // snap: the shipped median cut covers every strip, so measuring after it let one strip's colours move another's
  // numbers (ART-KIL-PROBE); the probe reduces colours to the idle's own palette instead (scale-probe measurementCells)
  const scaleAudit = scaleGate(id, anims, env, R);

  // 2b) optional palette snap (across the whole character so colors stay consistent; a paletteReserve gives strips
  // drawn in other colours their own share, ADR 0046)
  const allCells = anims.flatMap((a) => a.cells);
  if (env.quantize) {
    const outChar = path.join(env.outDir, 'characters', id), metaFile = path.join(outChar, 'anims.json');
    const kept = env.keepPalette ? sheetPalette(outChar, env.quantize) : null;
    if (env.keepPalette && !kept) warn(`--keep-palette: no current sheet.png with at most ${env.quantize} colours for ${id} - median cut instead`);
    const learn = (list) => (kept ? learnPalette(list, kept.pages, metaFile, spec) : null);
    const groups = reserveGroups(id, anims, new Set(names), env, warn);
    if (groups.length) {
      const own = new Set(groups.flatMap((g) => g.anims.map((a) => a.def.name)));
      const q = quantizeReserved(anims, env.quantize, groups, kept && { palette: kept.palette, reserved: onlyIn(kept.pages, metaFile, own, spec) }, learn);
      const shares = groups.map((g) => `${g.name} ${g.colors} (${g.anims.map((a) => a.def.name).join(', ')})`).join(', ');
      R.notes.push(`${kept ? 'palette kept from the current sheet.png' : 'palette snapped'}: ${q.colors} colors, ${q.shared} shared${q.merged ? ` (${q.merged} merged into their nearest neighbours)` : ''} + paletteReserve ${shares}`);
    } else {
      R.notes.push(kept ? `palette kept from the current sheet.png (${quantizeFrames(allCells, env.quantize, kept.palette, learn(anims))} colors)` : `palette snapped to ${quantizeFrames(allCells, env.quantize)} colors`);
    }
  }
  R.colors = countColors(allCells);
  if (R.colors > spec.warnColors) warn(`palette has ${R.colors} colors (> ${spec.warnColors}; spec target <= ${spec.maxColors}) - clean the art or re-run with --quantize ${spec.maxColors}`);
  else if (R.colors > spec.maxColors) R.notes.push(`palette has ${R.colors} colors: above the spec target of ${spec.maxColors} (warned above ${spec.warnColors})`);

  // 3) sheet layout + metadata (the engine reads frame size, pivot and ppu from here). A page holds at most PAGE_PX of
  // cell rows (16 at spec v2, 256 frames): a fighter with more frames goes on sheet2.png ..., numbered straight through
  // (src/art/sheetPages.js, TOOL-060). A one-page pack gets no page keys, so it is byte for byte what it was.
  const total = anims.reduce((n, a) => n + a.cells.length, 0);
  const perPage = spec.columns * (env.pageRows || Math.max(1, Math.floor(PAGE_PX / spec.frameHeight)));
  const nPages = Math.max(1, Math.ceil(total / perPage));
  const meta = {
    frameWidth: spec.frameWidth, frameHeight: spec.frameHeight, columns: spec.columns,
    ...(nPages > 1 ? { pages: Array.from({ length: nPages }, (_, p) => pageFile(p)), pageFrames: perPage } : {}), pivot: [...spec.pivot], pixelsPerUnit: spec.pixelsPerUnit,
    facing: spec.facing, spec: spec.name, source: 'art-pack', character: id, packer: PACKER_VERSION, complete: R.missingCore.length === 0,
    missingCore: R.missingCore, animations: {}, boxes: {},
  };
  if (scaleAudit) meta.scaleAudit = scaleAudit; // read by ?scaleaudit and the lab's ghost head box
  let idx = 0;
  const packed = [];
  for (const a of anims) {
    const indices = a.cells.map(() => idx++);
    const m = { frames: indices, durations: resolveDurations(a.def.durations, indices.length), loop: a.def.loop };
    // intro frames that play once before the loop (ENG-117); written only when set, so other strips' anims.json stay
    // byte for byte
    if (a.def.loop && a.def.loopFrom > 0) {
      if (a.def.loopFrom < indices.length && indices.length === a.def.frames) m.loopFrom = a.def.loopFrom;
      else warn(`${id} ${a.def.name}: loopFrom ${a.def.loopFrom} is for ${a.def.frames} frames, the strip has ${indices.length} - it loops the whole strip`);
    }
    const ph = rescalePhases(a.def.phases, indices.length);
    if (ph) m.phases = ph;
    meta.animations[a.def.name] = m;
    packed.push({ name: a.def.name, indices, cells: a.cells, phases: ph, def: a.def });
  }

  // 4) boxes: hurt on every frame, hit on active attack frames
  // ref.minY is the top of an UPRIGHT head: the rising-strike rule (hitBox) looks for a fist above it. The title-style
  // idles are crouched combat stances (Killua's is 146 px against a 186 px neutral), so every upright pose's hair would
  // read as "rising above the idle head"; builds.json "standingReference" (the approved neutral cell) is the measure
  // instead, and a fighter without one keeps the idle (TOOL-037). ref.maxX stays the idle's front (the forward rule).
  const idle = packed.find((p) => p.name === 'idle');
  const standing = loadStandingReference(env.artDir, env.builds?.[id] || {});
  if (standing?.error) warn(`${standing.error} - the rising-strike hit box rule is measured against the idle`);
  const standingTop = standing?.cells ? Math.min(...standing.cells.map((c) => bbox(c)?.y0).filter(Number.isFinite)) : NaN;
  let ref;
  if (idle) {
    const bs = idle.cells.map((c) => bbox(c)).filter(Boolean);
    ref = { maxX: Math.max(...bs.map((b) => b.x1)), minY: Math.min(...bs.map((b) => b.y0)) };
  } else {
    const bh = defs.find((d) => d.name === 'idle')?.bodyHeight ?? DEFAULT_BODY_HEIGHT;
    ref = { maxX: spec.pivot[0] + Math.round(bh * 0.26), minY: spec.pivot[1] - bh };
    warn('idle is not packed yet - hitboxes estimated from the idle bodyHeight');
  }
  if (Number.isFinite(standingTop)) { ref.idleMinY = ref.minY; ref.minY = standingTop; R.hitRef = { maxX: ref.maxX, minY: ref.minY, idleMinY: ref.idleMinY, source: standing.label }; }
  const T = boxTuning({ ...spec, standingBodyPx: env.manifest.characters[id]?.standingBodyPx ?? spec.standingBodyPx });
  const autoRule = new Map(); // frame index -> { rule, at } that drew its auto hit box (R.hitBoxes, the "front" note)
  const big = [];
  for (const p of packed) {
    p.cells.forEach((cell, k) => {
      const key = String(p.indices[k]);
      const hb = hurtBox(cell);
      meta.boxes[key] = hb ? { hurt: [hb] } : {};
      const active = p.phases && p.def.hitbox && k >= p.phases[0] && k < p.phases[0] + p.phases[1];
      if (active) {
        const h = hitBox(cell, ref, T);
        if (h?.box) {
          meta.boxes[key].hit = [h.box];
          autoRule.set(key, { rule: h.rule, at: `${p.name}#${k}` });
          const b = bbox(cell);
          if (h.box[2] * h.box[3] > 0.4 * b.w * b.h) big.push(`${p.name}#${k}`);
        }
      }
    });
  }
  if (big.length) warn(`large auto hitbox (> 40% of the body) on ${big.join(', ')} - check in the Sprite Lab, add hitboxes.json overrides if needed`);
  const fits = new Map(anims.map((a) => [a.def.name, (a.autoHead ?? 1) * (a.sizeFit ?? 1)]).filter(([, f]) => Math.abs(f - 1) > 1e-6));
  const overridden = new Set(); // frames whose hit box hitboxes.json replaced
  const ov = applyOverrides(path.join(charDir, 'hitboxes.json'), packed, meta.boxes, warn, label, fits, spec.pivot, R.notes, overridden);
  if (ov) R.notes.push(`${ov} hitbox override(s) from hitboxes.json`);
  // the active-frame hit boxes as shipped, with the rule that drew each auto one (--json report: before/after tables)
  for (const p of packed) {
    if (!p.phases || !p.def.hitbox) continue;
    const list = [];
    for (let k = p.phases[0]; k < p.phases[0] + p.phases[1] && k < p.indices.length; k++) {
      const key = String(p.indices[k]);
      list.push({ frame: k, hit: meta.boxes[key]?.hit ?? null, rule: overridden.has(key) ? 'override' : autoRule.get(key)?.rule ?? null });
    }
    R.hitBoxes[p.name] = list;
  }
  // only the frames still on the auto box: an override replaced the rest, so "check them" would send the artist to
  // frames that are already handled (TOOL-037)
  const front = [...autoRule].filter(([key, a]) => a.rule === 'front' && !overridden.has(key)).map(([, a]) => a.at);
  if (front.length) R.notes.push(`${front.length} active frame(s) had no clear strike limb - hitbox = front 28% of the body (${front.join(', ')}; check them in the Sprite Lab or add hitboxes.json overrides)`);
  // lying frames (ADR 0020): the ground check (warn only) and the footprint the engine lays the contact shadow along
  const footprint = groundCheck(anims, meta, spec, env.manifest.characters[id]?.standingBodyPx ?? spec.standingBodyPx, warn, R);
  if (Object.keys(footprint).length) meta.footprint = footprint;
  // tech poses (ADR 0030): the wall line contact and the tucked / braced size band (warn only), and the wall anchors
  const wallAnchor = techPoseCheck(anims, meta, spec, env.manifest.characters[id]?.standingBodyPx ?? spec.standingBodyPx, warn, R);
  if (Object.keys(wallAnchor).length) { meta.wallAnchor = wallAnchor; meta.wallLine = wallLineOf(spec); }
  // attack alts (ADR 0031): frame count, phases and where the drawn strike lands against the base (warn only), then
  // the base's hit and hurt boxes on every alt frame, so an alt never changes what connects
  altCheck(packed, meta, spec, warn, R);
  inheritAltBoxes(packed, meta, R);

  // 5) write the sheet page(s) + json (+ write-back of cleaned frames); each page is only as tall as its frames need
  const cols = spec.columns;
  const pages = Array.from({ length: nPages }, (_, p) => newImage(cols * spec.frameWidth, Math.ceil(Math.min(perPage, idx - p * perPage) / cols) * spec.frameHeight));
  for (const p of packed) p.cells.forEach((cell, k) => {
    const at = frameCell(meta, p.indices[k]);
    blit(pages[at.page], cell, at.x, at.y);
  });
  R.frames = idx;
  R.sheet = pages.map((pg) => `${pg.w}x${pg.h}`).join(' + ');
  if (nPages > 1) R.pages = meta.pages;
  R.complete = meta.complete;
  const outDir = path.join(env.outDir, 'characters', id);
  // a strict strip that failed the scale gate refuses the pack (ADR 0021): neither public/ nor frames/ is written, so
  // the last good sheet stays and a missed exit code cannot carry an off-size strip into a commit or a deploy
  const refused = !!R.scale?.failed.length || R.blocked.length > 0;
  if (refused) {
    if (R.scale) R.scale.refused = true;
    R.refused = true;
    warn(`scale gate: ${env.dryRun ? 'would not write' : 'did not write'} ${rel(env.cwd, outDir)}/ (it keeps its last pack) or frames/ - fix the failing strips, or exempt a misread head with a reason and its scaleExemptVersion`);
  }
  if (!refused) {
    pages.forEach((pg, p) => writeFile(env, path.join(outDir, pageFile(p)), encodePng(pg), R));
    // a pack that needs fewer pages than the last one leaves no old page behind for the art index to ship
    const old = stalePages(outDir, nPages);
    if (old.length) {
      if (!env.dryRun) for (const f of old) fs.unlinkSync(f);
      R.notes.push(`${env.dryRun ? 'would remove' : 'removed'} ${old.map((f) => rel(env.cwd, f)).join(', ')}: the pack has ${nPages} page(s) now`);
    }
  }
  if (!refused) writeFile(env, path.join(outDir, 'anims.json'), Buffer.from(stringifyCompact(meta) + '\n'), R);
  for (const a of anims) {
    R.packed.push({
      anim: a.def.name, frames: a.cells.length, expected: a.def.frames, source: a.sourceLabel, from: a.origin, version: a.version,
      edited: a.edited, handMade: a.handMade, scale: +a.scale.toFixed(3), frameScales: a.frameScales, notes: a.notes,
    });
    if (a.src.kind === 'raw' && !env.quantize && !refused) writeBack(env, path.join(framesRoot, a.def.name), a.def.name, a.cells, a.src, R, { bodyHeight: a.bodyHeight, cell: cellKey, ...(a.autoHead ? { autoHead: a.autoHead } : {}) });
  }
  return R;
}

// portrait / cutin / select / super and ultimate layers: remove magenta bg, fit to the spec size, write next to the sheet.
function packUi(id, charDir, env, R) {
  const uiDir = path.join(charDir, 'ui');
  for (const [name, spec] of Object.entries(UI_ITEMS)) {
    const file = path.join(uiDir, `${name}.png`);
    if (!isFile(file)) continue;
    try {
      let img = readPng(file);
      const corner = [0, (img.w - 1) * 4, (img.h - 1) * img.w * 4, ((img.h - 1) * img.w + img.w - 1) * 4];
      if (corner.some((i) => isMagentaish([img.data[i], img.data[i + 1], img.data[i + 2]]) && img.data[i + 3] > 128)) removeBackground(img, { tol: env.tol, mode: 'char' });
      // a blank image would replace the game's fallback portrait/cut-in with nothing
      if (!bbox(img)) { R.warnings.push(`ui/${name}.png: empty after background removal - not written`); continue; }
      let note = 'copied';
      if (img.w !== spec.w || img.h !== spec.h) {
        const t = hasTransparency(img) ? trim(img) : null;
        if (t) {
          // contain-fit the trimmed art
          const s = Math.min(spec.w / t.w, spec.h / t.h);
          const small = resample(t, Math.abs(s - 1) < 0.005 ? 1 : s, { coverage: 0.5 });
          const out = newImage(spec.w, spec.h);
          const dx = Math.round((spec.w - small.w) / 2);
          const dy = spec.align === 'bottom' ? spec.h - small.h : Math.round((spec.h - small.h) / 2);
          blit(out, small, dx, dy);
          img = out;
        } else {
          // opaque art: center-crop to the aspect ratio, then downscale
          const ar = spec.w / spec.h;
          let cw = img.w, ch = Math.round(img.w / ar);
          if (ch > img.h) { ch = img.h; cw = Math.round(img.h * ar); }
          const c = crop(img, Math.floor((img.w - cw) / 2), Math.floor((img.h - ch) / 2), cw, ch);
          img = cw > spec.w ? downscaleMode(c, spec.w, spec.h, { coverage: 0.5 }) : upscaleNearest(c, spec.w, spec.h);
        }
        note = `fitted to ${spec.w}x${spec.h}`;
      }
      writeFile(env, path.join(env.outDir, 'characters', id, `${name}.png`), encodePng(img), R);
      R.ui.push(`${name} (${note})`);
      R.uiItems.push(name);
    } catch (e) {
      R.warnings.push(`ui/${name}.png: failed - ${e.message}`);
    }
  }
}

// ============================================================== world art approval gate
// World art (effects, spectators) ships only once the user approved it (ADR 0007/0008: "approvedVersion" in the
// manifest). Candidates are packed with --candidates into <out>/preview/ (git-ignored; the game shows them with
// ?art=custom), so the shipped public/vfx|crowd never holds unapproved art.
const worldOut = (env, kind) => path.join(env.candidates ? path.join(env.outDir, 'preview') : env.outDir, kind);

// An output whose inputs are no longer approved (or gone) is removed: public/ is packer output only (CLAUDE.md rule 3).
function removeOutputs(env, dir, names, R) {
  for (const n of names) {
    const f = path.join(dir, n);
    if (!fs.existsSync(f)) continue;
    if (!env.dryRun) fs.unlinkSync(f);
    R.removed.push(rel(env.cwd, f));
  }
}

const vv = (n) => `v${String(n).padStart(2, '0')}`;

// ============================================================== VFX packing
// any opaque pixel in the first and in the last column (a horizontally tiling stream band)
function reachesSides(img) {
  const hit = (x) => { for (let y = 0; y < img.h; y++) if (img.data[(y * img.w + x) * 4 + 3] >= 128) return true; return false; };
  return hit(0) && hit(img.w - 1);
}

// TOOL-048: effects the current atlas ships that this pack would lose because their source is missing on disk. An
// effect that lost its approval leaves on purpose; one whose raw/ and frames/ are simply not there is almost always a
// checkout problem (a sparse worktree without art/vfx/raw/ dropped six live effects from a committed atlas on
// 2026-10-15), so the atlas is refused until the raws are back or --allow-drop says the loss is intended.
function lostVfx(env, outVfx, R) {
  if (env.candidates || env.allowDrop) return [];
  const data = readJson(path.join(outVfx, 'atlas.json')).data;
  const shipped = data?.anims && { ...data.anims, ...data.hd?.anims };
  const lost = shipped ? Object.keys(shipped).filter((n) => R.missing.includes(n) && !R.unapproved.includes(n)) : [];
  if (!lost.length) return lost;
  const skipped = isDir(env.artDir) ? skippedFiles(env.artDir, 'vfx/raw').filter((p) => !/\/(_rejected|_old)\//.test(p)) : [];
  const fix = skipped.length
    ? `art/vfx/raw/ is not checked out in this sparse worktree (${skipped.length} tracked file(s) left off disk): run \`npm run pr -- art vfx\` in this worktree, then pack again`
    : 'restore their raw/ or frames/, or pass --allow-drop if removing them from the atlas is intended';
  R.warnings.push(`VFX ATLAS NOT WRITTEN: ${rel(env.cwd, path.join(outVfx, 'atlas.json'))} ships ${lost.join(', ')}, but their source is missing here - ${fix}`);
  return lost;
}

function packVfx(env) {
  const R = { packed: [], missing: [], failed: [], unapproved: [], removed: [], refused: [], preview: !!env.candidates, versions: {}, frames: 0, atlas: null, warnings: [], notes: [], wrote: [], writeback: [] };
  const warn = (m) => R.warnings.push(m);
  const vfxDir = path.join(env.artDir, 'vfx');
  const outVfx = worldOut(env, 'vfx');
  const effects = { ...VFX_EFFECTS };
  for (const [name, e] of Object.entries(env.manifest.vfx)) effects[name] = { ...(VFX_EFFECTS[name] || { frames: e.frames || 4, ms: 50, tinted: false, fill: 0.8 }), ...e };
  // an approval recorded on a worldArt.vfx batch (vfx-<effect>, vfx-<effect>-rN) counts like vfx.effects (highest wins)
  for (const [name, v] of worldApprovals(env.manifestRaw, 'vfx')) if (effects[name] && v > (effects[name].approvedVersion || 0)) effects[name].approvedVersion = v;
  if (!isDir(vfxDir)) {
    R.missing = Object.keys(effects);
    if ((R.refused = lostVfx(env, outVfx, R)).length) return R;
    removeOutputs(env, outVfx, ['atlas.png', 'atlas_hd.png', 'atlas.json'], R);
    return R;
  }
  const names = Object.keys(effects);
  const rawIdx = scanRaw(path.join(vfxDir, 'raw'), names, warn, 'vfx/raw');
  const framesRoot = path.join(vfxDir, 'frames');
  for (const d of listDirs(framesRoot)) if (!names.includes(d) && listPngs(path.join(framesRoot, d)).length) warn(`vfx/frames/${d}/: unknown effect - ignored (engine names are fixed)`);

  const packed = [];
  for (const name of names) {
    const e = effects[name];
    try {
      const framesDir = path.join(framesRoot, name);
      const latest = pickRaw(rawIdx.get(name), name);
      if (latest?.version != null) R.versions[name] = latest.version;
      if (!env.candidates && !e.approvedVersion) { R.unapproved.push(name); continue; }
      // ship the approved version even when a newer candidate is waiting for review
      const raw = env.candidates ? latest : pickRaw(rawIdx.get(name), name, e.approvedVersion);
      // an HD effect's frames/ carry their 256 px cell: untouched frames cleaned at the 128 px cell (before its manifest
      // entry said hd) re-import from raw/ instead of being upscaled
      const src = chooseSource(framesDir, raw, { bodyHeight: null, cell: e.hd ? VFX_HD.cell : null, artDir: env.artDir }, warn, name);
      if (!src) { R.missing.push(name); continue; }
      if (src.kind === 'stale') { warn(staleText(name, name, src)); R.missing.push(name); continue; }
      let items, notes = [], sourceLabel, origin = null, version = null;
      if (src.kind === 'frames') {
        items = framesFromFolder(framesDir, src.framePngs, 'vfx', env, warn, name, (e.hd ? VFX_HD : VFX).cell);
        sourceLabel = `frames/${name}/`;
        if (src.origin) ({ file: origin, version } = src.origin);
      } else {
        const side = readSidecars(raw.sidecars, warn, name);
        const r = framesFromRaw(src.rawFiles, e.frames, side, env, 'vfx', warn, name, src.strip);
        items = r.frames.map((img) => ({ img, final: false }));
        notes = r.notes;
        sourceLabel = origin = src.label;
        version = src.version;
        if (src.replaced) notes.push(`re-imported: replaces frames/ cleaned from ${src.replaced}`);
        if (!items.length && r.unreadable) { R.missing.push(name); R.failed.push(name); continue; }
      }
      if (raw?.ignored.length) notes.push(`ignored ${raw.ignored.join(' and ')} (a _vNN version exists)`);
      if (!items.length) { warn(`${name}: no pixels found in ${sourceLabel}`); R.missing.push(name); R.failed.push(name); continue; }
      if (!env.candidates && latest?.version > (version ?? 0)) notes.push(`newer candidate ${vv(latest.version)} not shipped (approve it to ship it)`);
      if (!env.candidates && version != null && version !== e.approvedVersion) {
        warn(`${name}: the source is ${vv(version)} but ${vv(e.approvedVersion)} is approved - not packed (approve ${vv(version)} or move it to raw/_rejected/)`);
        R.unapproved.push(name);
        continue;
      }
      const loose = items.filter((it) => !it.final).map((it) => it.img);
      const C = e.hd ? VFX_HD : VFX;
      const target = Math.round(C.cell * (e.fill || 0.8));
      const maxDim = loose.length ? Math.max(...loose.map((s) => Math.max(s.w, s.h))) : 0;
      let scale = loose.length ? target / maxDim : 1;
      if (Math.abs(maxDim - target) <= 1) scale = 1;
      const cells = items.map((it) => {
        if (it.final) return it.img;
        const s = resample(it.img, scale, { coverage: 0.34, alphaMin: 40 });
        const cell = newImage(C.cell, C.cell);
        // keep the frame's offset inside its strip row (vfxAnchors); no anchor = center on its own bbox
        const a = it.img.anchor;
        const half = C.cell / 2;
        let dx = a ? Math.round(half - a.cx * scale) : Math.round((C.cell - s.w) / 2);
        let dy = a ? Math.round(half - a.cy * scale) : Math.round((C.cell - s.h) / 2);
        if (e.anchor === 'bottom') {
          dy = C.baseline - (s.h - 1) - (a ? Math.round(a.gap * scale) : 0);
          if (e.baseX) dx = Math.round(half - (footAnchor(s) + 0.5));
        }
        if (blit(cell, s, dx, dy)) notes.push('clipped');
        return cell;
      });
      if (e.tinted) {
        const colored = Math.max(...cells.map(toGreyscale));
        if (colored > 0.05) warn(`${name}: drawn in color but the engine tints it - converted to greyscale (draw it white/grey)`);
      }
      if (e.lumaAlpha) cells.forEach((c, k) => { if (!items[k].final) lumaToAlpha(c); });
      // a stream band is laid end to end along the stream (ADR 0034): every frame must reach both cell edges
      if (e.tile) cells.forEach((c, k) => { if (!reachesSides(c)) warn(`${name}: frame ${k} does not reach both cell edges, so it cannot tile along a stream (deliver exact ${C.cell} x ${C.cell} tiles in frames/${name}/)`); });
      for (const c of cells) quantizeAlpha(c);
      if (cells.length !== e.frames) warn(`${name}: ${cells.length} frame(s), expected ${e.frames}`);
      packed.push({ name, e, cells, src, sourceLabel, notes, scale, origin, version, edited: !!src.edited, handMade: src.kind === 'frames' && !src.packerMade });
    } catch (err) {
      warn(`${name}: failed - ${err.message}`);
      R.missing.push(name);
      R.failed.push(name);
    }
  }
  if ((R.refused = lostVfx(env, outVfx, R)).length) return R;
  if (!packed.length) { removeOutputs(env, outVfx, ['atlas.png', 'atlas_hd.png', 'atlas.json'], R); return R; }

  // one page per cell size: the shared 128 px effects in atlas.png, the HD signature effects in atlas_hd.png
  const page = (list, C) => {
    const cols = Math.max(1, ...list.map((p) => p.cells.length));
    const img = newImage(cols * C.cell, Math.max(1, list.length) * C.cell);
    const anims = {};
    list.forEach((p, row) => {
      p.cells.forEach((c, i) => blit(img, c, i * C.cell, row * C.cell));
      anims[p.name] = { row, n: p.cells.length, ms: p.e.ms ?? 50 };
      R.packed.push({ effect: p.name, frames: p.cells.length, expected: p.e.frames, source: p.sourceLabel, from: p.origin, version: p.version, edited: p.edited, handMade: p.handMade, scale: +p.scale.toFixed(3), notes: [...new Set(p.notes)], ...(p.e.hd ? { hd: true } : {}) });
      R.frames += p.cells.length;
    });
    return { img, cols, rows: list.length, anims };
  };
  const std = page(packed.filter((p) => !p.e.hd), VFX);
  const hdList = packed.filter((p) => p.e.hd);
  const meta = { cell: VFX.cell, cols: std.cols, rows: std.rows, ppu: VFX.ppu, source: 'art-pack', packer: PACKER_VERSION, anims: std.anims };
  R.atlas = `${std.img.w}x${std.img.h}`;
  writeFile(env, path.join(outVfx, 'atlas.png'), encodePng(std.img), R);
  if (hdList.length) {
    const hd = page(hdList, VFX_HD);
    meta.hd = { image: 'atlas_hd.png', cell: VFX_HD.cell, cols: hd.cols, rows: hd.rows, ppu: VFX_HD.ppu, anims: hd.anims };
    R.atlasHd = `${hd.img.w}x${hd.img.h}`;
    writeFile(env, path.join(outVfx, 'atlas_hd.png'), encodePng(hd.img), R);
  } else removeOutputs(env, outVfx, ['atlas_hd.png'], R);
  writeFile(env, path.join(outVfx, 'atlas.json'), Buffer.from(stringifyCompact(meta) + '\n'), R);
  for (const p of packed) if (p.src.kind === 'raw') writeBack(env, path.join(framesRoot, p.name), p.name, p.cells, p.src, R, p.e.hd ? { cell: VFX_HD.cell } : {});
  return R;
}

// ============================================================== crowd packing (ADR 0008)
// art/crowd/raw/<id>_vNN.png (3 poses on magenta) -> public/crowd/atlas.{png,json}: each spectator = 3 consecutive
// 64 x 96 cells (idle, cheer, shocked) in one row, idle scaled to its height class, feet on the pivot.
const CROWD = Object.freeze({ cell: [64, 96], cols: 64, ppu: 50, pivot: [32, 94], top: 2, frames: ['idle', 'cheer', 'shocked'], maxColors: 24 });
const CROWD_HEIGHT = { tiny: 44, short: 58, medium: 70, tall: 78, huge: 84 };
const CROWD_PER_ROW = Math.floor(CROWD.cols / CROWD.frames.length); // 21: a spectator's cells never wrap a row

// Every roster entry (art/crowd/roster/*.json, file order): who may appear and at which height class.
function crowdRoster(crowdDir, warn) {
  const out = [], seen = new Set();
  const dir = path.join(crowdDir, 'roster');
  if (!isDir(dir)) return out;
  for (const f of fs.readdirSync(dir).filter((n) => n.toLowerCase().endsWith('.json')).sort()) {
    const j = readJson(path.join(dir, f));
    if (!j.data) { warn(`crowd/roster/${f}: ${j.error || 'unreadable'} - skipped`); continue; }
    for (const sp of j.data.spectators || []) {
      if (!sp?.id) continue;
      if (seen.has(sp.id)) { warn(`crowd: ${sp.id} is listed twice (roster/${f}) - the first entry is used`); continue; }
      seen.add(sp.id);
      out.push({ id: sp.id, group: j.data.group || f.replace(/\.json$/i, ''), kind: sp.kind || j.data.kind || 'original', heightClass: sp.heightClass, tags: Array.isArray(sp.tags) ? sp.tags : [] });
    }
  }
  return out;
}

// Approved version per spectator (manifest worldArt.crowd.batches.*.items): a redo batch may approve a later one.
function crowdApprovals(rawManifest) {
  const m = new Map();
  for (const b of Object.values(rawManifest?.worldArt?.crowd?.batches || {})) {
    for (const [id, it] of Object.entries(b?.items || {})) {
      const v = it?.approvedVersion;
      if (Number.isInteger(v) && v > 0 && v > (m.get(id) || 0)) m.set(id, v);
    }
  }
  return m;
}

// One raw -> the 3 cells. The idle frame sets the scale (its height = the class height); the other two share it,
// shrunk only if a pose would leave the cell (arms above y 2, wider than 64). Each pose stands on the pivot line,
// centered on its feet.
function crowdCells(file, classPx, env, notes) {
  const [CW, CH] = CROWD.cell;
  const img = readPng(file);
  const bg = removeBackground(img, { tol: env.tol, mode: 'char' });
  if (!bg.magentaBg && !bg.removed && !hasTransparency(img)) throw new Error('no removable background (flat magenta #FF00FF expected)');
  if (bg.foreign) notes.push(`background ${bg.foreign} is not magenta`);
  const sp = removeSpecks(img, { frac: 0.0015, min: 4 });
  if (sp.blobs > 3) notes.push(`removed ${sp.blobs} specks`);
  let { rects } = splitStrip(img, 3, { mode: 'char' });
  if (rects.length !== 3) {
    const n = rects.length;
    ({ rects } = splitStrip(img, 3, { split: 'even', mode: 'char' }));
    notes.push(`${n} pose(s) found, split into even thirds`);
  }
  if (rects.length !== 3) throw new Error(`${rects.length} pose(s) found, expected 3 (idle, cheer, shocked)`);
  const poses = rects.map((r) => {
    const piece = crop(img, r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
    dropStrays(piece);
    const b = bbox(piece);
    if (!b) throw new Error('a pose is empty after background removal');
    return crop(piece, b.x0, b.y0, b.w, b.h);
  });
  const room = CROWD.pivot[1] - CROWD.top + 1;
  let s = classPx / poses[0].h;
  const fit = Math.min(s, ...poses.map((p) => room / p.h), ...poses.map((p) => CW / p.w));
  if (fit < s - 1e-9) { notes.push(`shrunk to fit the cell (idle ${Math.round(poses[0].h * fit)} px, class ${classPx})`); s = fit; }
  const cells = poses.map((p) => {
    const small = resample(p, s, { coverage: 0.5, alphaMin: 128 });
    for (let i = 3; i < small.data.length; i += 4) small.data[i] = small.data[i] >= 128 ? 255 : 0;
    const b = bbox(small);
    const t = b ? crop(small, b.x0, b.y0, b.w, b.h) : small;
    const cell = newImage(CW, CH);
    const dx = Math.max(0, Math.min(CW - t.w, Math.round(CROWD.pivot[0] - (footAnchor(t) + 0.5))));
    const dy = CROWD.pivot[1] - (t.h - 1);
    if (blit(cell, t, dx, dy)) notes.push('clipped');
    return cell;
  });
  const colors = quantizeFrames(cells, CROWD.maxColors);
  return { cells, colors, scale: s };
}

function packCrowd(env) {
  const R = { packed: [], missing: [], failed: [], unapproved: 0, removed: [], preview: !!env.candidates, spectators: 0, atlas: null, warnings: [], notes: [], wrote: [] };
  const warn = (m) => R.warnings.push(m);
  const crowdDir = path.join(env.artDir, 'crowd');
  const outCrowd = worldOut(env, 'crowd');
  const roster = crowdRoster(crowdDir, warn);
  const approved = crowdApprovals(env.manifestRaw);
  const rosterIds = new Set(roster.map((r) => r.id));
  for (const id of approved.keys()) if (!rosterIds.has(id)) warn(`crowd: ${id} is approved in the manifest but not in any roster - skipped (no height class)`);

  // raw/<id>_vNN.png per id (raw/_rejected/ is not scanned)
  const raws = new Map();
  const rawDir = path.join(crowdDir, 'raw');
  if (isDir(rawDir)) {
    for (const f of fs.readdirSync(rawDir)) {
      const m = VERSION_RE.exec(f);
      if (!m) continue;
      if (!raws.has(m[1])) raws.set(m[1], new Map());
      raws.get(m[1]).set(Number(m[2]), path.join(rawDir, f));
    }
  }

  const packed = [];
  for (const sp of roster) {
    const want = env.candidates ? Math.max(0, ...(raws.get(sp.id)?.keys() || [])) || null : approved.get(sp.id) || null;
    if (!want) { if (!env.candidates) R.unapproved++; continue; }
    const file = raws.get(sp.id)?.get(want);
    if (!file) { warn(`crowd: ${sp.id} ${vv(want)} is ${env.candidates ? 'the latest' : 'approved'} but raw/${sp.id}_${vv(want)}.png is missing`); R.missing.push(sp.id); continue; }
    let classPx = CROWD_HEIGHT[sp.heightClass];
    if (!classPx) { warn(`crowd: ${sp.id} has heightClass ${JSON.stringify(sp.heightClass)} - packed as medium`); classPx = CROWD_HEIGHT.medium; }
    const notes = [];
    const newest = Math.max(0, ...(raws.get(sp.id)?.keys() || []));
    if (newest > want) notes.push(`newer candidate ${vv(newest)} not shipped (approve it to ship it)`);
    try {
      const r = crowdCells(file, classPx, env, notes);
      packed.push({ ...sp, version: want, ...r, notes });
    } catch (e) {
      warn(`crowd: ${sp.id} ${vv(want)}: ${e.message} - skipped`);
      R.failed.push(sp.id);
    }
  }
  if (!packed.length) { removeOutputs(env, outCrowd, ['atlas.png', 'atlas.json'], R); return R; }

  const [CW, CH] = CROWD.cell;
  const rows = Math.ceil(packed.length / CROWD_PER_ROW);
  const atlas = newImage(CROWD.cols * CW, rows * CH);
  const meta = { cell: [CW, CH], cols: CROWD.cols, ppu: CROWD.ppu, pivot: [...CROWD.pivot], frames: [...CROWD.frames], source: env.candidates ? 'candidates' : 'approved', packer: PACKER_VERSION, spectators: [] };
  packed.forEach((p, k) => {
    const row = Math.floor(k / CROWD_PER_ROW), col = (k % CROWD_PER_ROW) * CROWD.frames.length;
    p.cells.forEach((c, f) => blit(atlas, c, (col + f) * CW, row * CH));
    meta.spectators.push({ id: p.id, cell: row * CROWD.cols + col, heightClass: p.heightClass, kind: p.kind, tags: p.tags, version: p.version });
    R.packed.push({ id: p.id, group: p.group, version: p.version, colors: p.colors, scale: +p.scale.toFixed(4), notes: [...new Set(p.notes)] });
  });
  R.spectators = packed.length;
  R.atlas = `${atlas.w}x${atlas.h}`;
  writeFile(env, path.join(outCrowd, 'atlas.png'), encodePng(atlas), R);
  writeFile(env, path.join(outCrowd, 'atlas.json'), Buffer.from(stringifyCompact(meta) + '\n'), R);
  return R;
}

// ============================================================== stage, NPC and UI packing (ADR 0008, ADR 0012)
// Approved version per item of a world-art kind: manifest worldArt.<kind>.batches.<batch>.items.<item>.approvedVersion
// (highest wins when a redo batch approves a later one). `key(batchId, item)` names the item.
function worldApprovals(rawManifest, kind, key = (b, item) => item) {
  const m = new Map();
  for (const [bid, b] of Object.entries(rawManifest?.worldArt?.[kind]?.batches || {})) {
    for (const [item, it] of Object.entries(b?.items || {})) {
      const v = it?.approvedVersion;
      const k = key(bid, item);
      if (Number.isInteger(v) && v > 0 && v > (m.get(k) || 0)) m.set(k, v);
    }
  }
  return m;
}

// Highest version of `<prefix>_vNN.png` (or `<prefix><infix>_vNN.png`) in a folder; { version, file } or null.
function latestVersion(dir, re) {
  let best = null;
  for (const f of listPngs(dir)) {
    const m = re.exec(f);
    if (m && (!best || Number(m[1]) > best.version)) best = { version: Number(m[1]), file: path.join(dir, f) };
  }
  return best;
}
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Opaque texture: alpha forced to 255. Cutout / sprite: magenta removed if the image still has it, alpha 0 or 255.
function cleanWorldImage(img, cutout, env) {
  const notes = [];
  if (!cutout) {
    let soft = 0;
    for (let i = 3; i < img.data.length; i += 4) if (img.data[i] !== 255) { soft++; img.data[i] = 255; }
    if (soft) notes.push(`${soft} transparent px made opaque (texture slot)`);
    return notes;
  }
  if (!hasTransparency(img)) {
    const bg = removeBackground(img, { tol: env.tol, mode: 'char' });
    if (bg.removed) notes.push('magenta background removed');
  }
  // fit scripts key the background but can leave a 1 px magenta-blend fringe on the edge (2 passes)
  const { w, data: d } = img;
  let fringe = 0;
  for (let pass = 0; pass < 2; pass++) {
    const kill = [];
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 128 || !isMagentaHue(d[i], d[i + 1], d[i + 2])) continue;
      const p = i >> 2, x = p % w;
      const clear = (q) => q < 0 || q >= d.length || d[q + 3] < 128;
      if ((x > 0 && clear(i - 4)) || (x < w - 1 && clear(i + 4)) || clear(i - w * 4) || clear(i + w * 4)) kill.push(i);
    }
    for (const i of kill) d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
    fringe += kill.length;
    if (!kill.length) break;
  }
  if (fringe) notes.push(`${fringe} magenta fringe px removed`);
  let soft = 0;
  for (let i = 3; i < img.data.length; i += 4) {
    const a = img.data[i];
    if (a !== 0 && a !== 255) soft++;
    img.data[i] = a >= 128 ? 255 : 0;
    if (!img.data[i]) img.data[i - 3] = img.data[i - 2] = img.data[i - 1] = 0;
  }
  if (soft) notes.push(`${soft} soft-alpha px snapped to 0/255`);
  return notes;
}

// The 30 stage slots (art/stage/ASSETS.md "All slots"): exact final size and kind. The engine maps each image on
// the painter's geometry and repeat counts, so the size only sets the detail, never the world coverage.
const STAGE_SLOTS = {
  ringTop: [1152, 1152, 'texture'], ringSide: [256, 40, 'texture'], grass: [256, 256, 'texture'], steps: [64, 64, 'texture'],
  stoneBase: [128, 64, 'texture'], brick: [128, 64, 'texture'], path: [128, 128, 'texture'], templeFacade: [1536, 384, 'texture'],
  roof: [128, 80, 'texture'], bannerBu: [64, 192, 'cutout'], bannerDo: [64, 192, 'cutout'], bannerSai: [64, 192, 'cutout'],
  bannerTo: [64, 192, 'cutout'], plaster: [128, 128, 'texture'], sky: [16, 512, 'texture'], cloudA: [256, 96, 'sprite'],
  cloudB: [256, 96, 'sprite'], cloudC: [256, 96, 'sprite'], gong: [128, 128, 'texture'], parasol: [256, 96, 'cutout'],
  woodDark: [64, 128, 'texture'], treeRoundA: [192, 256, 'sprite'], treeRoundB: [192, 256, 'sprite'], treePine: [192, 256, 'sprite'],
  treePalm: [192, 256, 'sprite'], sign: [288, 72, 'texture'], lanternBu: [128, 64, 'texture'], lanternSai: [128, 64, 'texture'],
  woodPillar: [64, 128, 'texture'], wood: [64, 128, 'texture'],
};

// Source of a stage slot. Approved: final/<slot>.png (the lead's approved copy), else the approved version's
// palette-cleaned or fitted candidate. Candidates: the highest version of review/<slot>_palette_vNN.png or
// raw/_fit/<slot>_vNN.png (palette-cleaned wins on a tie); a slot with no candidate previews its approved image.
function stageSource(dir, slot, version, candidates) {
  const pal = (v) => path.join(dir, 'review', `${slot}_palette_v${String(v).padStart(2, '0')}.png`);
  const fit = (v) => path.join(dir, 'raw', '_fit', `${slot}_v${String(v).padStart(2, '0')}.png`);
  if (!candidates) {
    const fin = path.join(dir, 'final', `${slot}.png`);
    return [fin, pal(version), fit(version)].find((f) => fs.existsSync(f)) || null;
  }
  return [pal(version), fit(version)].find((f) => fs.existsSync(f)) || null;
}

function packStage(env) {
  const R = { packed: [], missing: [], failed: [], unapproved: 0, removed: [], preview: !!env.candidates, warnings: [], wrote: [] };
  const warn = (m) => R.warnings.push(m);
  const dir = path.join(env.artDir, 'stage');
  const out = worldOut(env, 'stage');
  const approved = worldApprovals(env.manifestRaw, 'stage');
  for (const s of approved.keys()) if (!STAGE_SLOTS[s]) warn(`stage: "${s}" is approved but is not a stage slot - ignored`);
  const slots = {};
  for (const [slot, [w, h, kind]] of Object.entries(STAGE_SLOTS)) {
    let version = approved.get(slot) || null, candidate = false;
    const re = (inf) => new RegExp(`^${escRe(slot)}${inf}_v(\\d+)\\.png$`, 'i');
    const latest = Math.max(latestVersion(path.join(dir, 'review'), re('_palette'))?.version || 0, latestVersion(path.join(dir, 'raw', '_fit'), re(''))?.version || 0);
    if (env.candidates && latest) { version = latest; candidate = true; }
    if (!version) { if (!env.candidates) R.unapproved++; continue; }
    const file = stageSource(dir, slot, version, candidate);
    if (!file) { warn(`stage: ${slot} ${vv(version)} is ${env.candidates ? 'the latest' : 'approved'} but no final/, review/ or raw/_fit/ file exists`); R.missing.push(slot); continue; }
    try {
      const img = readPng(file);
      if (img.w !== w || img.h !== h) { warn(`stage: ${rel(env.artDir, file)} is ${img.w}x${img.h}, the ${slot} slot needs exactly ${w}x${h} - skipped`); R.failed.push(slot); continue; }
      const notes = cleanWorldImage(img, kind !== 'texture', env);
      if (!candidate && latest > version) notes.push(`newer candidate ${vv(latest)} not shipped (approve it to ship it)`);
      const colors = countColors([img]);
      writeFile(env, path.join(out, `${slot}.png`), encodePng(img), R);
      slots[slot] = { file: `${slot}.png`, size: [w, h], kind, version };
      R.packed.push({ slot, version, from: rel(env.artDir, file), colors, notes });
    } catch (e) {
      warn(`stage: ${slot}: ${e.message} - skipped`);
      R.failed.push(slot);
    }
  }
  // public/ only holds what this run packed: an image whose approval was withdrawn stops shipping
  removeOutputs(env, out, Object.keys(STAGE_SLOTS).filter((s) => !slots[s]).map((s) => `${s}.png`), R);
  if (!R.packed.length) removeOutputs(env, out, ['manifest.json'], R);
  else writeFile(env, path.join(out, 'manifest.json'), Buffer.from(stringifyCompact({ source: env.candidates ? 'candidates' : 'approved', packer: PACKER_VERSION, slots }) + '\n'), R);
  return R;
}

// NPC cells (art/npc/README.md "NPC spec").
const NPC = Object.freeze({ cell: 128, columns: 8, pivot: [64, 124], ppu: 80, margin: 4, maxColors: 32, frames: 2 });

// The animation table of art/npc/<id>/ANIMATIONS.md (anim | what | frames | loop | ms per frame | height ...) is the
// one source for an NPC's animations, timing and target heights; idle first.
function npcSpecs(npcDir, warn, id) {
  const file = path.join(npcDir, 'ANIMATIONS.md');
  if (!fs.existsSync(file)) { warn(`npc ${id}: no ANIMATIONS.md - skipped`); return null; }
  const specs = [];
  let inTable = false;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (/^\|\s*anim\s*\|/i.test(line)) { inTable = true; continue; }
    if (!inTable) continue;
    if (!line.startsWith('|')) { if (specs.length) break; continue; }
    const c = line.split('|').slice(1, -1).map((s) => s.trim());
    const name = (c[0].match(/`([A-Za-z0-9]+)`/) || [])[1];
    if (!name) continue;
    if (c.length < 6) { warn(`npc ${id}: the ANIMATIONS.md row for ${name} has ${c.length} columns (needs anim, what, frames, loop, ms, height) - skipped`); continue; }
    const ms = (c[4].match(/\d+/g) || []).map(Number);
    specs.push({ name, loop: /^yes/i.test(c[3]), ms: ms.length ? ms : [500, 500], height: Number((c[5].match(/\d+/) || [])[0]) || null });
  }
  if (!specs.find((s) => s.name === 'idle')) { warn(`npc ${id}: ANIMATIONS.md has no idle row in its animation table - skipped`); return null; }
  return specs.sort((a, b) => (a.name === 'idle' ? -1 : b.name === 'idle' ? 1 : 0));
}

// One strip -> its trimmed poses (magenta, specks and stray marks removed).
function npcPoses(file, env, notes) {
  const img = readPng(file);
  const bg = removeBackground(img, { tol: env.tol, mode: 'char' });
  if (!bg.magentaBg && !bg.removed && !hasTransparency(img)) throw new Error('no removable background (flat magenta #FF00FF expected)');
  const sp = removeSpecks(img, { frac: 0.0015, min: 4 });
  if (sp.blobs > 3) notes.push(`removed ${sp.blobs} specks`);
  let { rects } = splitStrip(img, NPC.frames, { mode: 'char' });
  if (rects.length !== NPC.frames) {
    const n = rects.length;
    ({ rects } = splitStrip(img, NPC.frames, { split: 'even', mode: 'char' }));
    notes.push(`${n} pose(s) found, split into even halves`);
  }
  if (rects.length !== NPC.frames) throw new Error(`${rects.length} pose(s) found, expected ${NPC.frames}`);
  return rects.map((r) => {
    const piece = crop(img, r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
    dropStrays(piece);
    const b = bbox(piece);
    if (!b) throw new Error('a pose is empty after background removal');
    return crop(piece, b.x0, b.y0, b.w, b.h);
  });
}

function packNpcs(env) {
  const R = { packed: [], skipped: [], unapproved: 0, removed: [], preview: !!env.candidates, warnings: [], wrote: [] };
  const warn = (m) => R.warnings.push(m);
  const root = path.join(env.artDir, 'npc');
  const outRoot = worldOut(env, 'npc');
  // npc-<id> and its redo batches npc-<id>-rN approve the same NPC (highest approved version wins)
  const approved = worldApprovals(env.manifestRaw, 'npc', (b, item) => `${b.replace(/^npc-/, '').replace(/-r\d+$/, '')}/${item}`);
  for (const k of approved.keys()) if (!isDir(path.join(root, k.split('/')[0]))) warn(`npc: ${k} is approved but art/npc/${k.split('/')[0]}/ does not exist`);
  const C = NPC.cell, [PX, PY] = NPC.pivot, M = NPC.margin;
  for (const id of listDirs(root).filter((n) => !n.startsWith('_') && !n.startsWith('.'))) {
    const dir = path.join(root, id), out = path.join(outRoot, id);
    const drop = (why) => { if (why) R.skipped.push(`${id}: ${why}`); removeOutputs(env, out, ['sheet.png', 'anims.json'], R); };
    const specs = npcSpecs(dir, warn, id);
    if (!specs) { drop(null); continue; }
    const anims = [];
    for (const s of specs) {
      const re = new RegExp(`^${escRe(s.name)}_v(\\d+)\\.png$`, 'i');
      const newest = latestVersion(path.join(dir, 'raw'), re)?.version;
      const version = env.candidates ? newest : approved.get(`${id}/${s.name}`);
      if (!version) { if (!env.candidates) R.unapproved++; continue; }
      const file = path.join(dir, 'raw', `${s.name}_${vv(version)}.png`);
      if (!fs.existsSync(file)) { warn(`npc ${id}: ${s.name} ${vv(version)} is ${env.candidates ? 'the latest' : 'approved'} but raw/${s.name}_${vv(version)}.png is missing`); continue; }
      const notes = [];
      if (newest > version) notes.push(`newer candidate ${vv(newest)} not shipped (approve it to ship it)`);
      try {
        anims.push({ ...s, version, poses: npcPoses(file, env, notes), notes });
      } catch (e) {
        warn(`npc ${id}: ${s.name} ${vv(version)}: ${e.message} - skipped`);
      }
    }
    if (!anims.find((a) => a.name === 'idle')) { drop(anims.length ? 'no usable idle (it sets the scale) - not packed' : null); continue; }
    // Each strip is scaled to its own target height from ANIMATIONS.md (the trimmed height of its tallest frame):
    // generated strips drift in scale from one image to the next, and the per-animation heights already encode
    // the poses (a crouch is shorter, a raised fist taller), so the head stays the same size across animations.
    // An animation without a height row takes idle's scale. Feet always land on the pivot line.
    const tallest = (a) => Math.max(...a.poses.map((p) => p.h));
    const npcNotes = [];
    const fitted = (a, sc) => {
      const fit = Math.min(sc, ...a.poses.map((p) => (PY - M + 1) / p.h), ...a.poses.map((p) => (C - 2 * M) / p.w));
      if (fit < sc - 1e-9) { a.notes.push(`shrunk to fit the cell margin (${Math.round(tallest(a) * fit)} px, target ${a.height ?? Math.round(tallest(a) * sc)})`); return fit; }
      return sc;
    };
    anims[0].scale = fitted(anims[0], (anims[0].height || tallest(anims[0])) / tallest(anims[0]));
    for (const a of anims.slice(1)) a.scale = fitted(a, a.height ? a.height / tallest(a) : anims[0].scale);
    const s = anims[0].scale;
    const cells = [];
    const meta = { frameWidth: C, frameHeight: C, columns: NPC.columns, pivot: [PX, PY], pixelsPerUnit: NPC.ppu, facing: 'viewer-right', source: env.candidates ? 'candidates' : 'art-pack', npc: id, packer: PACKER_VERSION, complete: true, animations: {} };
    for (const a of anims) {
      const frames = [];
      for (const p of a.poses) {
        const small = resample(p, a.scale, { coverage: 0.5, alphaMin: 128 });
        for (let i = 3; i < small.data.length; i += 4) small.data[i] = small.data[i] >= 128 ? 255 : 0;
        const b = bbox(small);
        const t = b ? crop(small, b.x0, b.y0, b.w, b.h) : small;
        const cell = newImage(C, C);
        const dx = Math.max(M, Math.min(C - M - t.w, Math.round(PX - (footAnchor(t) + 0.5))));
        if (blit(cell, t, dx, PY - (t.h - 1))) a.notes.push('clipped');
        frames.push(cells.length);
        cells.push(cell);
      }
      meta.animations[a.name] = { frames, durations: frames.map((_, k) => a.ms[k] ?? a.ms[a.ms.length - 1]), loop: a.loop, version: a.version };
    }
    const colors = quantizeFrames(cells, NPC.maxColors);
    const sheet = newImage(NPC.columns * C, Math.ceil(cells.length / NPC.columns) * C);
    cells.forEach((c, k) => blit(sheet, c, (k % NPC.columns) * C, Math.floor(k / NPC.columns) * C));
    writeFile(env, path.join(out, 'sheet.png'), encodePng(sheet), R);
    writeFile(env, path.join(out, 'anims.json'), Buffer.from(stringifyCompact(meta) + '\n'), R);
    const missing = specs.filter((sp) => !meta.animations[sp.name]).map((sp) => sp.name);
    R.packed.push({ id, anims: anims.map((a) => `${a.name} ${vv(a.version)}`), missing, colors, scale: +s.toFixed(4), notes: [...npcNotes, ...new Set(anims.flatMap((a) => a.notes.map((n) => `${a.name}: ${n}`)))] });
  }
  return R;
}

// Shared UI (art/ui/README.md): the logo keeps its size (at most 640 x 240) and transparency, the title art is
// exactly 640 x 360 and opaque. Manifest approval: worldArt.ui (ui-<asset> batches) or sharedUi.<key>.
const UI_ASSETS = { logo: { key: 'logo', size: null, max: [640, 240], cutout: true }, title_art: { key: 'titleArt', size: [640, 360], max: [640, 360], cutout: false } };

function packSharedUi(env) {
  const R = { packed: [], missing: [], failed: [], unapproved: 0, removed: [], preview: !!env.candidates, warnings: [], wrote: [] };
  const warn = (m) => R.warnings.push(m);
  const dir = path.join(env.artDir, 'ui');
  const out = worldOut(env, 'ui');
  const approved = worldApprovals(env.manifestRaw, 'ui');
  const assets = {};
  for (const [name, A] of Object.entries(UI_ASSETS)) {
    const shared = env.manifestRaw?.sharedUi?.[A.key]?.approvedVersion;
    const ok = (v) => Number.isInteger(v) && v > 0;
    let version = Math.max(approved.get(name) || 0, ok(shared) ? shared : 0) || null, candidate = false;
    const re = (inf) => new RegExp(`^${escRe(name)}${inf}_v(\\d+)\\.png$`, 'i');
    // the latest review candidate; with --candidates an asset without one previews its approved image
    const latest = Math.max(latestVersion(path.join(dir, 'review'), re('_palette'))?.version || 0, latestVersion(path.join(dir, 'review'), re('_fit'))?.version || 0);
    if (env.candidates && latest) { version = latest; candidate = true; }
    if (!version) { if (!env.candidates) R.unapproved++; continue; }
    const pal = path.join(dir, 'review', `${name}_palette_${vv(version)}.png`), fit = path.join(dir, 'review', `${name}_fit_${vv(version)}.png`);
    const file = [...(candidate ? [] : [path.join(dir, 'final', `${name}.png`)]), pal, fit].find((f) => fs.existsSync(f));
    if (!file) { warn(`ui: ${name} ${vv(version)} is ${env.candidates ? 'the latest' : 'approved'} but no final/ or review/ file exists`); R.missing.push(name); continue; }
    try {
      const img = readPng(file);
      if (A.size ? img.w !== A.size[0] || img.h !== A.size[1] : img.w > A.max[0] || img.h > A.max[1]) {
        warn(`ui: ${rel(env.artDir, file)} is ${img.w}x${img.h}; ${name} needs ${A.size ? `exactly ${A.size.join('x')}` : `at most ${A.max.join('x')}`} - skipped`);
        R.failed.push(name);
        continue;
      }
      const notes = cleanWorldImage(img, A.cutout, env);
      if (!candidate && latest > version) notes.push(`newer candidate ${vv(latest)} not shipped (approve it to ship it)`);
      writeFile(env, path.join(out, `${name}.png`), encodePng(img), R);
      assets[name] = { file: `${name}.png`, size: [img.w, img.h], version };
      R.packed.push({ asset: name, version, from: rel(env.artDir, file), colors: countColors([img]), notes });
    } catch (e) {
      warn(`ui: ${name}: ${e.message} - skipped`);
      R.failed.push(name);
    }
  }
  removeOutputs(env, out, Object.keys(UI_ASSETS).filter((n) => !assets[n]).map((n) => `${n}.png`), R);
  if (!R.packed.length) removeOutputs(env, out, ['manifest.json'], R);
  else writeFile(env, path.join(out, 'manifest.json'), Buffer.from(stringifyCompact({ source: env.candidates ? 'candidates' : 'approved', packer: PACKER_VERSION, assets }) + '\n'), R);
  return R;
}

// ============================================================== manifest status sync (--update-manifest)
const STATUS_ORDER = ['todo', 'raw', 'packed', 'approved'];

function raiseStatus(obj, status) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return 0;
  const cur = STATUS_ORDER.indexOf(obj.status);
  if (cur >= STATUS_ORDER.indexOf(status)) return 0;
  obj.status = status;
  return 1;
}

// "version" = the latest candidate number (ADR 0007): raised to the highest raw/<anim>_vNN.png found, never lowered
// (a rejected version moved to raw/_rejected/ was still a candidate). "approvedVersion" is the reviewer's: never touched.
function raiseVersion(obj, v) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj) || !Number.isInteger(v)) return 0;
  if (Number.isInteger(obj.version) && obj.version >= v) return 0;
  obj.version = v;
  return 1;
}

function updateManifestStatus(raw, rep) {
  let n = 0;
  for (const c of rep.characters) {
    const mc = raw.characters?.[c.id];
    if (!mc || typeof mc !== 'object') continue;
    const anims = mc.animations || {};
    for (const p of c.packed) n += raiseStatus(anims[p.anim], c.refused ? 'raw' : 'packed'); // a refused pack wrote nothing
    for (const a of c.failed) n += raiseStatus(anims[a], 'raw');
    for (const [a, v] of Object.entries(c.versions || {})) n += raiseVersion(anims[a], v);
    for (const u of c.uiItems) n += raiseStatus(mc.ui?.[u], 'packed');
  }
  const fx = raw.vfx?.effects;
  if (rep.vfx && fx && typeof fx === 'object') {
    for (const p of rep.vfx.packed) n += raiseStatus(fx[p.effect], 'packed');
    for (const e of rep.vfx.failed) n += raiseStatus(fx[e], 'raw');
    for (const [e, v] of Object.entries(rep.vfx.versions || {})) n += raiseVersion(fx[e], v);
  }
  return n;
}

// JSON with small leaf objects/arrays on one line (the manifest's hand-written style; small git diffs).
function stringifyCompact(v, indent = '') {
  const inner = indent + '  ';
  const prim = (x) => x === null || typeof x !== 'object';
  const primArr = (x) => Array.isArray(x) && x.every(prim);
  const leaf = (x) => prim(x) || primArr(x) || (Array.isArray(x) && x.every(primArr));
  if (prim(v)) return JSON.stringify(v);
  if (Array.isArray(v)) {
    if (leaf(v)) {
      const one = `[${v.map((x) => (prim(x) ? JSON.stringify(x) : stringifyCompact(x, inner))).join(', ')}]`;
      if (one.length <= 140) return one;
    }
    if (!v.length) return '[]';
    return `[\n${v.map((x) => inner + stringifyCompact(x, inner)).join(',\n')}\n${indent}]`;
  }
  const keys = Object.keys(v);
  if (!keys.length) return '{}';
  if (keys.every((k) => leaf(v[k]))) {
    const one = `{ ${keys.map((k) => `${JSON.stringify(k)}: ${stringifyCompact(v[k], inner)}`).join(', ')} }`;
    if (one.length <= 160 && !one.includes('\n')) return one;
  }
  return `{\n${keys.map((k) => `${inner}${JSON.stringify(k)}: ${stringifyCompact(v[k], inner)}`).join(',\n')}\n${indent}}`;
}

// ============================================================== report
// Where an animation's pixels came from, for the report: "raw/idle_v03.png", "frames/idle/ (raw/idle_v03.png)",
// "frames/idle/ (hand-edited, from raw/idle_v02.png)", "frames/light3/ (hand-made)".
function originText(p) {
  if (!p.source.startsWith('frames/')) return p.source;
  if (p.handMade) return `${p.source} (hand-made)`;
  if (p.edited) return `${p.source} (hand-edited${p.from ? `, from ${p.from}` : ''})`;
  return p.from ? `${p.source} (${p.from})` : p.source;
}

function printReport(rep, env) {
  const L = (s = '') => console.log(s);
  const S = rep.spec;
  L(`GCD Tourney sprite packer v${PACKER_VERSION}${env.dryRun ? '  (dry run - nothing written)' : ''}`);
  L(`  art:  ${rep.art}${rep.artExists ? '' : '  (missing)'}`);
  L(`  out:  ${rep.out}`);
  L(`  anims: ${rep.guideSource}${rep.manifest}`);
  L(`  spec: ${S.name} (${S.frameWidth}x${S.frameHeight} cells, pivot [${S.pivot.join(',')}], ppu ${S.pixelsPerUnit}, <= ${S.maxColors} colors)`);
  for (const w of rep.warnings) L(`  ! ${w}`);
  for (const c of rep.characters) {
    L('');
    L(`== ${c.id} ${'='.repeat(Math.max(3, 60 - c.id.length))}`);
    if (!c.packed.length) {
      L('  nothing packed yet (no PNGs in raw/ or frames/<anim>/) - see art/PIPELINE.md');
      if (!c.removed?.length) L('  public/ was not touched for the sheet.');
    } else {
      L(`  packed ${c.packed.length} anims, ${c.frames} frames -> sheet ${c.sheet}${c.pages ? ` (${c.pages.length} pages: ${c.pages.join(', ')})` : ''}, ${c.colors} colors, ${c.refused ? `NOT WRITTEN (${c.blocked?.length ? `old hand edits shadow ${c.blocked.join(', ')}` : 'the scale gate failed'}, see below)` : c.complete ? 'COMPLETE (game will use it)' : 'PARTIAL (complete=false; preview with ?art=custom)'}`);
      for (const p of c.packed) {
        const n = `${p.frames}`.padStart(2) + (p.frames !== p.expected ? `/${p.expected}` : '');
        L(`    ${p.anim.padEnd(11)} ${n.padEnd(6)} <- ${originText(p).padEnd(28)} x${p.scale}${p.notes.length ? '  (' + p.notes.join('; ') + ')' : ''}`);
      }
    }
    if (c.scale) {
      const S = c.scale, n = {};
      for (const a of Object.values(S.anims)) n[a.verdict] = (n[a.verdict] || 0) + 1;
      L(`  scale gate (${S.gate}; head with hair vs the idle, art/CHARACTER_SCALE.md): ${S.error || Object.entries(n).map(([k, v]) => `${v} ${k}`).join(', ')}${S.failed.length ? `  FAILED: ${S.failed.join(', ')} - nothing written` : ''}`);
      for (const f of S.findings) L(`    ~ ${f}`);
    }
    if (c.missingCore.length) L(`  missing core (${c.missingCore.length}): ${c.missingCore.join(', ')}`);
    const opt = c.missing.filter((m) => !c.missingCore.includes(m));
    if (opt.length) L(`  missing optional (${opt.length}): ${opt.join(', ')}`);
    if (c.ui.length) L(`  ui: ${c.ui.join(', ')}`);
    for (const n of c.notes) L(`  - ${n}`);
    for (const w of c.warnings) L(`  ! ${w}`);
    if (c.writeback.length) L(`  cleaned frames written back to ${c.writeback.length} folder(s) under art/characters/${c.id}/frames/`);
    for (const f of c.wrote) L(`  wrote ${f}`);
  }
  if (rep.vfx) {
    const v = rep.vfx;
    L('');
    L(`== vfx ${'='.repeat(57)}`);
    if (v.preview) L('  candidates: every effect, approved or not -> preview/vfx/ (the game shows it with ?art=custom)');
    else if (v.unapproved.length) L(`  not approved yet (${v.unapproved.length}, procedural in game; preview with --candidates): ${v.unapproved.join(', ')}`);
    if (v.refused?.length) L(`  NOT WRITTEN: the atlas would lose ${v.refused.join(', ')} (source missing on disk; see the ! line below)`);
    else if (!v.packed.length) L(`  nothing packed${v.unapproved.length && !v.preview ? ' (no approved effects)' : ' (no PNGs in art/vfx/raw/ or art/vfx/frames/<effect>/)'} - the game keeps its procedural effects`);
    else {
      L(`  packed ${v.packed.length} effects, ${v.frames} frames -> atlas ${v.atlas}${v.atlasHd ? ` + HD ${v.atlasHd}` : ''} (missing ones stay procedural)`);
      for (const p of v.packed) L(`    ${p.effect.padEnd(11)} ${(String(p.frames).padStart(2) + (p.frames !== p.expected ? '/' + p.expected : '')).padEnd(6)} <- ${originText(p).padEnd(28)} x${p.scale}${p.notes.length ? '  (' + p.notes.join('; ') + ')' : ''}`);
    }
    if (v.missing.length && v.packed.length) L(`  missing (procedural fallback): ${v.missing.join(', ')}`);
    for (const w of v.warnings) L(`  ! ${w}`);
    for (const f of v.wrote) L(`  wrote ${f}`);
    for (const f of v.removed) L(`  ${env.dryRun ? 'would remove' : 'removed'} ${f} (no approved effects left to ship)`);
  }
  if (rep.crowd) {
    const c = rep.crowd;
    L('');
    L(`== crowd ${'='.repeat(55)}`);
    if (c.preview) L('  candidates: the latest version of every spectator -> preview/crowd/ (the game shows it with ?art=custom)');
    else if (c.unapproved) L(`  ${c.unapproved} roster spectator(s) not approved yet (not shipped; preview with --candidates)`);
    if (!c.packed.length) L('  nothing packed - the game keeps its procedural crowd');
    else {
      const colors = c.packed.map((p) => p.colors);
      L(`  packed ${c.spectators} spectators (${c.spectators * CROWD.frames.length} cells) -> atlas ${c.atlas}, ${Math.min(...colors)}-${Math.max(...colors)} colors each`);
      const groups = new Map();
      for (const p of c.packed) groups.set(p.group, (groups.get(p.group) || 0) + 1);
      L(`    ${[...groups].map(([g, n]) => `${g} ${n}`).join(', ')}`);
      for (const p of c.packed) if (p.notes.length) L(`    ${p.id} ${vv(p.version)}: ${p.notes.join('; ')}`);
    }
    for (const w of c.warnings) L(`  ! ${w}`);
    for (const f of c.wrote) L(`  wrote ${f}`);
    for (const f of c.removed) L(`  ${env.dryRun ? 'would remove' : 'removed'} ${f} (no approved spectators left to ship)`);
  }
  const worldSection = (title, r, what, rows) => {
    if (!r) return;
    L('');
    L(`== ${title} ${'='.repeat(Math.max(3, 60 - title.length))}`);
    if (r.preview) L(`  candidates: the latest version of every ${what} -> preview/ (the game shows it with ?art=custom)`);
    else if (r.unapproved) L(`  ${r.unapproved} ${what}(s) not approved yet (not shipped; preview with --candidates)`);
    if (!r.packed.length) L('  nothing packed - the game keeps its fallback art');
    for (const row of r.packed) L(`    ${rows(row)}`);
    for (const x of r.skipped || []) L(`  - ${x}`);
    for (const w of r.warnings) L(`  ! ${w}`);
    for (const f of r.wrote) L(`  wrote ${f}`);
    for (const f of r.removed) L(`  ${env.dryRun ? 'would remove' : 'removed'} ${f} (not approved / no source any more)`);
  };
  worldSection('stage', rep.stage, 'stage slot', (p) => `${p.slot.padEnd(13)} ${vv(p.version)} <- ${p.from} (${p.colors} colors)${p.notes.length ? '  (' + p.notes.join('; ') + ')' : ''}`);
  worldSection('npc', rep.npc, 'NPC animation', (p) => `${p.id.padEnd(10)} ${p.anims.join(', ')}${p.missing.length ? ` (missing: ${p.missing.join(', ')})` : ''}, ${p.colors} colors, x${p.scale}${p.notes.length ? '  (' + p.notes.join('; ') + ')' : ''}`);
  worldSection('ui', rep.ui, 'UI image', (p) => `${p.asset.padEnd(10)} ${vv(p.version)} <- ${p.from} (${p.colors} colors)${p.notes.length ? '  (' + p.notes.join('; ') + ')' : ''}`);
  printDecalReport(rep.decals, { dryRun: env.dryRun, L });
  if (rep.manifestUpdates !== undefined) L(`\nmanifest: ${rep.manifestUpdates} status/version value(s) raised${env.dryRun ? ' (dry run: not saved)' : ''}${rep.manifestUpdates ? ' - sync art/TRACKER.md' : ''}`);
  L('');
  const nw = rep.totalWarnings;
  const crowdLine = rep.crowd ? (rep.crowd.packed.length ? `crowd atlas packed (${rep.crowd.spectators})` : 'no crowd art') : 'crowd skipped';
  const more = [['stage', 'stage slot'], ['npc', 'NPC'], ['ui', 'UI image'], ['decals', 'decal']].filter(([k]) => rep[k]).map(([k, n]) => `${rep[k].packed.length} ${n}(s)`);
  const gateFailed = rep.characters.filter((c) => c.scale?.failed.length);
  if (rep.vfx?.refused?.length) L(`VFX ATLAS NOT WRITTEN: it would lose ${rep.vfx.refused.join(', ')} - check out art/vfx/raw/ (\`npm run pr -- art vfx\` in a sparse worktree) or pass --allow-drop`);
  if (gateFailed.length) L(`SCALE GATE FAILED: ${gateFailed.map((c) => `${c.id} (${c.scale.failed.join(', ')})`).join('; ')} - not written; see art/CHARACTER_SCALE.md "Scale gate (automatic)"`);
  const shadowed = rep.characters.filter((c) => c.blocked?.length);
  if (shadowed.length) L(`OLD HAND EDITS SHADOW A NEWER VERSION: ${shadowed.map((c) => `${c.id} (${c.blocked.join(', ')})`).join('; ')} - not written; move each frames/<anim>/ to frames/_old/ or redo the edits on the new version`);
  L(`done: ${rep.characters.filter((c) => c.packed.length).length}/${rep.characters.length} character(s) packed, ${rep.vfx ? (rep.vfx.refused?.length ? 'vfx atlas NOT WRITTEN' : rep.vfx.packed.length ? 'vfx atlas packed' : 'no vfx art') : 'vfx skipped'}, ${crowdLine}${more.length ? ', ' + more.join(', ') : ''}, ${nw} warning(s).`);
}

// The decal packer (tools/pack-decals.mjs, ADR 0024) uses this file's helpers, passed in (it predates the export list
// and main() guard at the end of this file, which stitch-parts.mjs imports through).
const decalHelpers = () => ({ readPng, encodePng, newImage, crop, blit, bbox, removeBackground, removeSpecks, splitStrip, resample, downscaleMode, upscaleNearest, toGreyscale,
  quantizeFrames, countColors, hasTransparency, chooseSource, readSidecars, staleText, writeFile, writeBack, removeOutputs, worldOut, worldApprovals,
  stringifyCompact, PACKER_VERSION });

// ============================================================== main
async function main() {
  let opts;
  try { opts = parseArgs(process.argv.slice(2)); } catch (e) {
    if (e instanceof UsageError) { console.error(`error: ${e.message}\n\n${HELP}`); return 1; }
    throw e;
  }
  if (opts.help) { console.log(HELP); return 0; }
  const cwd = process.cwd();
  const artDir = path.resolve(opts.root || path.join(PROJECT_ROOT, 'art'));
  const outDir = path.resolve(opts.out || path.join(PROJECT_ROOT, 'public'));
  const manifestPath = path.resolve(opts.manifest || path.join(artDir, 'manifest.json'));
  const guidePath = path.resolve(opts.guide || path.join(PROJECT_ROOT, 'src', 'art', 'animGuide.js'));
  const rep = { art: rel(cwd, artDir) || '.', artExists: isDir(artDir), out: rel(cwd, outDir) || '.', warnings: [], characters: [], vfx: null, crowd: null, stage: null, npc: null, ui: null, decals: null };

  const { guide, source: guideSource } = await loadGuide(guidePath);
  rep.guideSource = guideSource;
  const mj = readJson(manifestPath);
  if (mj.error) rep.warnings.push(`${rel(cwd, manifestPath)} is not valid JSON (${mj.error}) - using animGuide.js + spec defaults`);
  const manifest = normalizeManifest(mj.data);
  for (const s of manifest.specIssues) rep.warnings.push(`manifest ${s}`);
  rep.manifest = mj.data ? ` + ${rel(cwd, manifestPath)}` : mj.exists ? '' : ' (no manifest.json yet - spec defaults)';
  rep.spec = manifest.spec;
  const env = { cwd, artDir, outDir, guide, manifest, manifestRaw: mj.data, spec: manifest.spec, dryRun: opts.dryRun, writeback: opts.writeback, allowDrop: opts.allowDrop, quantize: opts.quantize, keepPalette: !!opts.keepPalette, tol: opts.tol, candidates: opts.candidates, pageRows: opts.pageRows };
  // scale gate inputs (TOOL-025): thresholds from spec.scaleGate, declared head/feet colours, the committed baseline
  const gateIssues = [];
  Object.assign(env, {
    gate: resolveGate(mj.data?.spec?.scaleGate, gateIssues), scaleStrict: opts.strictScale, fitHead: new Set(opts.fitHead),
    builds: readJson(path.join(artDir, 'scale', 'builds.json')).data?.fighters || {},
    baseline: readJson(path.join(artDir, 'scale', 'scale-baseline.json')).data?.fighters || null,
  });
  for (const s of gateIssues) rep.warnings.push(`manifest ${s}`);

  const folderIds = listDirs(path.join(artDir, 'characters')).filter((n) => !n.startsWith('_') && !n.startsWith('.'));
  const allIds = [...folderIds, ...Object.keys(manifest.characters).filter((n) => !n.startsWith('_') && !folderIds.includes(n))];
  let ids = [], doVfx = false;
  const world = new Set();
  const targets = opts.targets.length ? opts.targets : ['all'];
  for (const t of targets) {
    if (t === 'all') { ids.push(...allIds); doVfx = true; ['crowd', 'stage', 'npc', 'ui', 'decals'].forEach((k) => world.add(k)); }
    else if (t === 'vfx') doVfx = true;
    else if (t === 'decal') world.add('decals');
    else if (['crowd', 'stage', 'npc', 'ui', 'decals'].includes(t)) world.add(t);
    else if (allIds.includes(t)) ids.push(t);
    else {
      console.error(`error: unknown character "${t}". Known: ${allIds.join(', ') || '(none - create art/characters/<id>/ from _template)'}`);
      return 1;
    }
  }
  ids = [...new Set(ids)];

  for (const id of ids) rep.characters.push(packCharacter(id, env));
  // World art ships by approval. Without a readable manifest the approvals are unknown: a half-edited or
  // conflicted manifest must not un-ship approved art, so every world-art output is left as it is.
  const untouched = (kind) => ({
    packed: [], missing: [], failed: [], skipped: [], removed: [], wrote: [], writeback: [], preview: false, frames: 0, spectators: 0,
    unapproved: kind === 'vfx' ? [] : 0,
    warnings: [`${rel(cwd, manifestPath)} is missing or not valid JSON: approvals unknown, ${kind} output left untouched (fix the manifest and re-run)`],
  });
  const worldPack = (kind, fn) => (mj.data ? fn(env) : untouched(kind));
  if (doVfx) rep.vfx = worldPack('vfx', packVfx);
  if (world.has('crowd')) rep.crowd = worldPack('crowd', packCrowd);
  if (world.has('stage')) rep.stage = worldPack('stage', packStage);
  if (world.has('npc')) rep.npc = worldPack('npc', packNpcs);
  if (world.has('ui')) rep.ui = worldPack('ui', packSharedUi);
  if (world.has('decals')) rep.decals = worldPack('decals', (e) => packDecals(e, decalHelpers()));
  if (opts.updateManifest) {
    if (!mj.data) rep.warnings.push('--update-manifest: no readable manifest.json - nothing updated');
    else {
      const n = updateManifestStatus(mj.data, rep) + updateDecalStatus(mj.data, rep.decals, raiseStatus, raiseVersion);
      rep.manifestUpdates = n;
      if (n && !opts.dryRun) fs.writeFileSync(manifestPath, stringifyCompact(mj.data) + '\n');
    }
  }
  rep.totalWarnings = rep.warnings.length + rep.characters.reduce((s, c) => s + c.warnings.length, 0) + ['vfx', 'crowd', 'stage', 'npc', 'ui', 'decals'].reduce((s, k) => s + (rep[k]?.warnings.length || 0), 0);

  if (opts.json) console.log(JSON.stringify(rep, null, 2));
  else printReport(rep, env);
  if (rep.characters.some((c) => c.scale?.failed.length || c.blocked?.length)) return 1; // the scale gate failed or old hand edits shadow a newer version
  if (rep.vfx?.refused?.length) return 1; // the vfx atlas would lose effects whose source is not on disk (TOOL-048)
  return opts.strict && rep.totalWarnings ? 2 : 0;
}

// Imported by tools/stitch-parts.mjs (the same background removal, splitting and resampling), run as the packer otherwise.
export { readPng, encodePng, newImage, crop, blit, bbox, removeBackground, removeSpecks, dropStrays, splitStrip, figureSplit, resample, placeCharFrame, quantizeFrames, readJson };

const samePath = (a, b) => (process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b);
if (process.argv[1] && samePath(path.resolve(process.argv[1]), fileURLToPath(import.meta.url))) {
  main().then((code) => { process.exitCode = code; }).catch((e) => {
    console.error(`pack-sprites failed: ${e.stack || e.message}`);
    process.exitCode = 1;
  });
}
