import { hasArt, fetchArtJson } from '../core/artIndex.js';
import * as THREE from 'three';
import { bakeCharacter } from '../art/rig/baker.js';
import { RING_TOP, RING_HALF, SPRITE_DEPTH_COMP, SPRITE_DEPTH_CLAMP } from './constants.js';
import { AuraShell } from './auraShell.js';
import { phaseFrame } from './animPhase.js';

// Missing animations in a custom sheet fall back to something sensible.
export const FALLBACK = {
  intro: 'idle', taunt: 'idle', win: 'idle', jumpSquat: 'land', land: 'idle', block: 'guard', hurtLow: 'hurtHigh',
  airLight1: 'airLight', airLight2: 'airLight1', airLight3: 'airLight2', airLight: 'light3', airHeavy: 'heavy', throw: 'light1',
  special: 'heavy', beamCharge: 'charge', beamFire: 'light1', stagger: 'hurtHigh', ko: 'down', getup: 'idle', dash: 'run',
  superDash: 'dash', backDash: 'jumpFall', airRecover: 'jumpUp', vanish: 'dash', spin: 'launched',
  launched: 'hurtHigh', down: 'hurtHigh', guard: 'idle', charge: 'idle', light2: 'light1', light3: 'light1', light4: 'heavy',
  heavy: 'light1', jumpUp: 'idle', jumpFall: 'jumpUp', run: 'idle',
  // move system v2 (ADR 0009), optional per character
  specialForward: 'special', specialUp: 'special', specialDown: 'charge', superPose: 'taunt',
  // tech recoveries (ADR 0030): the poses the techs showed before their strips existed. Fighter itself keeps the
  // per-beat legacy poses (techAnim.js LEGACY_POSE) when a sheet lacks a strip; these cover direct lookups (lab, tools)
  techGround: 'land', techRoll: 'airRecover', wallTech: 'land',
};

// ?art=custom previews incomplete art packs; ?art=procedural ignores custom art entirely.
const ART_MODE = new URLSearchParams(location.search).get('art');
// ?depthscale=0 turns the depth-normalized sprite size off (true perspective) to compare; 0.5 = half strength
const DEPTH_Q = parseFloat(new URLSearchParams(location.search).get('depthscale'));
const DEPTH_COMP = Number.isFinite(DEPTH_Q) ? Math.min(1, Math.max(0, DEPTH_Q)) : SPRITE_DEPTH_COMP;
// per-60fps-frame easing of the switch between normalized and true size, so a cut to or from a close-up camera
// (focus, ko, victory) blends with the camera move (about half a second) instead of popping
const DEPTH_BLEND = 0.07;

// ?scaleaudit (dev only, TOOL-025): names, once each, the strips the packer's scale gate measured off the idle's head
// size (anims.json meta.scaleAudit) as they play, so a fighter who grows or shrinks can be traced to its strip.
const SCALE_AUDIT = new URLSearchParams(location.search).has('scaleaudit');
const scaleLogged = new Set();
function logScaleAudit(meta, name) {
  const s = meta.scaleAudit?.anims?.[name];
  const key = `${meta.character}:${name}`;
  if (!s || scaleLogged.has(key) || !['uniform', 'drift', 'pop'].includes(s.verdict)) return;
  scaleLogged.add(key);
  const fr = (s.frames || []).filter((h) => h != null);
  console.warn(`[sprites] ${meta.character} ${name}: head ${s.head?.toFixed(2)} of idle (${s.verdict}${s.verdict === 'pop' ? `, frames ${Math.min(...fr).toFixed(2)}-${Math.max(...fr).toFixed(2)}` : ''}, packer scale audit)`);
}

export async function loadImage(url) {
  if (!hasArt(url)) return null; // production: only request files the art index lists (no 404s)
  // load/error events, not img.decode(): decode() can stay pending while the tab is in the
  // background, which would freeze boot for a player who opened the game in another tab
  const img = new Image();
  const ok = await new Promise((resolve) => {
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
  return ok && img.naturalWidth > 0 ? img : null;
}

export class SheetAsset {
  constructor(image, meta, source) {
    this.meta = meta;
    this.source = source;
    this.image = image;
    const tex = new THREE.Texture(image);
    tex.magFilter = THREE.NearestFilter;
    // hi-res sheets are often drawn slightly smaller than 1:1; linear minification avoids pixel shimmer
    tex.minFilter = meta.pixelsPerUnit >= 70 ? THREE.LinearFilter : THREE.NearestFilter;
    tex.generateMipmaps = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    this.texture = tex;
    this.W = image.width;
    this.H = image.height;
    this.cols = meta.columns || Math.floor(this.W / meta.frameWidth);
  }

  // The sheet has this strip itself (not through FALLBACK): optional poses such as the tech strips switch on with it.
  has(name) {
    return !!this.meta.animations?.[name]?.frames?.length;
  }

  // A wall-anchored frame's horizontal shift (anims.json wallAnchor, ADR 0030): how far right of the pivot the body's
  // centre was packed, in local world units facing right, so a wall seen in depth can re-centre it. 0 for other frames.
  wallAnchor(frame) {
    const px = this.meta.wallAnchor?.[frame];
    return px ? px / this.meta.pixelsPerUnit : 0;
  }

  anim(name) {
    const A = this.meta.animations;
    let n = name, guard = 0;
    while (!A[n] && guard++ < 6) n = FALLBACK[n] || 'idle';
    return A[n] || A.idle || Object.values(A).find((a) => a?.frames?.length);
  }

  // Hit/hurt boxes of a frame in local world units, mirrored for side (-1 = facing left).
  // Returns [{x0, x1, y0, y1}] with x along the screen and y up from the feet.
  boxes(frame, kind, side = 1) {
    const list = this.meta.boxes?.[frame]?.[kind];
    if (!list) return null;
    if (!list.length) return kind === 'hurt' ? null : [];
    const ppu = this.meta.pixelsPerUnit, [px, py] = this.meta.pivot;
    return list.map(([x, y, w, h]) => {
      let x0 = (x - px) / ppu, x1 = (x + w - px) / ppu;
      if (side < 0) [x0, x1] = [-x1, -x0];
      return { x0, x1, y0: (py - (y + h)) / ppu, y1: (py - y) / ppu };
    });
  }

  // Hand anchor (palm / fingertips) for hand effects, shots and beams, in local world units: x along the
  // facing, y up from the feet. Art packs only: the baked placeholder keeps the engine's tuned fixed
  // offsets. Order: the frame's `hand` (hitboxes.json), its hit box, then the nearest frame of the same
  // animation that has one; null when the animation has none (callers fall back to fixed offsets).
  hand(anim, frame) {
    if (this.meta.source !== 'art-pack' || !anim?.frames) return null;
    const own = this.frameHand(frame);
    if (own) return own;
    const fr = anim.frames, i = Math.max(0, fr.indexOf(frame));
    for (let d = 1; d < fr.length; d++) {
      for (const j of [i + d, i - d]) {
        if (j < 0 || j >= fr.length) continue;
        const h = this.frameHand(fr[j]);
        if (h) return h;
      }
    }
    return null;
  }

  frameHand(frame) {
    this._hands = this._hands || new Map();
    if (this._hands.has(frame)) return this._hands.get(frame);
    const b = this.meta.boxes?.[frame];
    let p = b?.hand;
    if (!p && b?.hit?.length) {
      const [x, y, w, h] = b.hit[0];
      p = [x + w * 0.6, y + h / 2];
    }
    const ppu = this.meta.pixelsPerUnit, [px, py] = this.meta.pivot;
    const out = p ? { x: (p[0] - px) / ppu, y: (py - p[1]) / ppu } : null;
    this._hands.set(frame, out);
    return out;
  }

  // A lying frame's body span along the screen (anims.json `footprint`, ADR 0020) in local world units, facing right
  // (callers mirror it). null for upright frames and for packs without one (the baked placeholder).
  footprint(frame) {
    const f = this.meta.footprint?.[frame];
    if (!f) return null;
    this._feet = this._feet || new Map();
    let out = this._feet.get(frame);
    if (!out) {
      const ppu = this.meta.pixelsPerUnit, px = this.meta.pivot[0];
      out = { x0: (f[0] - px) / ppu, x1: (f[1] + 1 - px) / ppu };
      this._feet.set(frame, out);
    }
    return out;
  }

  uv(frame, out) {
    const { frameWidth: fw, frameHeight: fh } = this.meta;
    const c = frame % this.cols, r = Math.floor(frame / this.cols);
    const e = 0.02;
    out.set((c * fw + e) / this.W, 1 - ((r + 1) * fh - e) / this.H, ((c + 1) * fw - e) / this.W, 1 - (r * fh + e) / this.H);
    return out;
  }
}

// Packed art (public/characters/<id>/, written by `npm run sprites`) wins when it is
// complete; otherwise the character is baked from the procedural 3D rig.
export async function loadFighterAsset(def, renderer = null) {
  const base = `/characters/${def.id}/`;
  // hand-made UI art (portrait 96, cut-in 480x128, select 384) loads on its own: it can ship before the body sprites
  const ui = () => (ART_MODE === 'procedural' ? [null, null, null] : Promise.all(['portrait', 'cutin', 'select'].map((n) => loadImage(`${base}${n}.png`))));
  if (ART_MODE !== 'procedural') {
    try {
      const meta = await fetchArtJson(base + 'anims.json');
      if (meta) {
        if (!meta.animations?.idle?.frames?.length) {
          console.info(`[sprites] ${def.id}: art pack has no idle yet, using the placeholder`);
        } else if (meta.complete || ART_MODE === 'custom') {
          const img = await loadImage(`${base}sheet.png?v=${Date.now()}`);
          if (img) {
            const asset = new SheetAsset(img, meta, 'custom');
            [asset.portrait, asset.cutin, asset.select] = await ui();
            console.info(`[sprites] using custom sheet for ${def.id} (${Object.keys(meta.animations).length} animations${meta.complete ? '' : ', incomplete preview'})`);
            return asset;
          }
          console.warn(`[sprites] ${def.id}: anims.json found but sheet.png is missing`);
        } else {
          console.info(`[sprites] ${def.id}: art pack incomplete (core animations missing), using the placeholder. Preview it with ?art=custom`);
        }
      }
    } catch (e) {
      console.warn(`[sprites] custom sheet for ${def.id} failed, using procedural art`, e);
    }
  }
  const t0 = performance.now();
  const { canvas, meta, portrait, cutin } = bakeCharacter(def, { renderer });
  console.info(`[sprites] baked ${def.id} from 3D in ${(performance.now() - t0).toFixed(0)} ms`);
  const asset = new SheetAsset(canvas, meta, 'procedural');
  // hand-made UI images may arrive before the body sprites
  const [p, c, sel] = await ui();
  asset.portrait = p || portrait;
  asset.cutin = c || cutin;
  asset.select = sel;
  return asset;
}

const VERT = /* glsl */ `
  uniform vec4 uvRect;
  varying vec2 vUv;
  void main() {
    vUv = mix(uvRect.xy, uvRect.zw, uv);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;

// lift and rim are the hit flash's hold (src/game/hitFlash.js): both stay 0 outside a hit, so those branches are
// skipped for every other sprite (ghosts, menus) and a frame without a hit costs what it did before
const FRAG = /* glsl */ `
  uniform sampler2D map;
  uniform vec4 uvRect;
  uniform vec3 tint;
  uniform vec3 flashColor;
  uniform float flash;
  uniform float lift;
  uniform vec3 rimColor;
  uniform float rim;
  uniform float rimPx;
  uniform float opacity;
  uniform float silhouette;
  varying vec2 vUv;
  void main() {
    vec2 px = fwidth(vUv) * rimPx; // rim width in render pixels; derivatives are taken before the discard
    vec4 c = texture2D(map, vUv);
    if (c.a < 0.5) discard;
    vec3 col = c.rgb * tint;
    if (lift > 0.0) {
      // brighten in ~gamma space weighted by luma: fills go bright while dark line art stays dark
      vec3 g = sqrt(col);
      g = mix(g, vec3(1.0), lift * (0.35 + 0.65 * dot(g, vec3(0.299, 0.587, 0.114))));
      col = g * g;
    }
    if (rim > 0.0) {
      // inner edge: any of the 4 neighbours (clamped to this frame's cell, so nothing bleeds in) is transparent
      vec2 lo = uvRect.xy, hi = uvRect.zw;
      float e = 4.0 - step(0.5, textureLod(map, clamp(vUv + vec2(px.x, 0.0), lo, hi), 0.0).a)
                    - step(0.5, textureLod(map, clamp(vUv - vec2(px.x, 0.0), lo, hi), 0.0).a)
                    - step(0.5, textureLod(map, clamp(vUv + vec2(0.0, px.y), lo, hi), 0.0).a)
                    - step(0.5, textureLod(map, clamp(vUv - vec2(0.0, px.y), lo, hi), 0.0).a);
      col = mix(col, rimColor, rim * min(1.0, e));
    }
    col = mix(col, flashColor, flash);
    col = mix(col, flashColor, silhouette);
    gl_FragColor = vec4(col, opacity);
    #include <colorspace_fragment>
  }`;

export function spriteMaterial(texture, transparent = false) {
  return new THREE.ShaderMaterial({
    uniforms: {
      map: { value: texture },
      uvRect: { value: new THREE.Vector4(0, 0, 1, 1) },
      tint: { value: new THREE.Color(1, 1, 1) },
      flashColor: { value: new THREE.Color(1, 1, 1) },
      flash: { value: 0 },
      lift: { value: 0 },
      rim: { value: 0 },
      rimColor: { value: new THREE.Color(1, 1, 1) },
      rimPx: { value: 2 },
      opacity: { value: 1 },
      silhouette: { value: 0 },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent,
    depthWrite: !transparent,
    side: THREE.DoubleSide,
  });
}

const SUN_YAW = Math.atan2(-9, 13); // matches the arena's sun direction (x, z)

export class SpriteActor {
  constructor(asset, scene) {
    this.asset = asset;
    this.scene = scene;
    const m = asset.meta;
    const ppu = m.pixelsPerUnit;
    this.w = m.frameWidth / ppu;
    this.h = m.frameHeight / ppu;
    const geo = new THREE.PlaneGeometry(this.w, this.h);
    geo.translate((m.frameWidth / 2 - m.pivot[0]) / ppu, this.h / 2 - (m.frameHeight - m.pivot[1]) / ppu, 0);
    this.geo = geo;
    this.root = new THREE.Group();
    this.mat = spriteMaterial(asset.texture);
    this.mesh = new THREE.Mesh(geo, this.mat);
    this.mesh.renderOrder = 2;
    this.root.add(this.mesh);

    // silhouette shadow caster: upright plane facing the sun, invisible in the main pass
    this.shadowTex = asset.texture.clone();
    this.caster = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }));
    this.caster.castShadow = true;
    this.caster.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: this.shadowTex, alphaTest: 0.5 });
    this.caster.rotation.y = SUN_YAW;
    this.root.add(this.caster);

    // contact blob shadow
    const blobGeo = new THREE.CircleGeometry(0.42, 16);
    blobGeo.rotateX(-Math.PI / 2);
    this.blob = new THREE.Mesh(blobGeo, new THREE.MeshBasicMaterial({ color: 0x2a1a10, transparent: true, opacity: 0.32, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
    this.blob.scale.set(1.25, 1, 0.7);
    scene.add(this.blob);
    scene.add(this.root);

    this.flip = 1;
    this.lift = 1;
    this.animName = null;
    this.anim = null;
    this.fi = 0;
    this.ft = 0;
    this.done = false;
    this.frame = 0;
    this.ghosts = [];
    this._uv = new THREE.Vector4();
    // visual size factor that cancels perspective between the two fighters (see syncDepth)
    this.depthK = 1;
    this._depthTarget = 1;
    this._depthW = 0;
    this._depthWBase = 0;
    this._depthTime = -1;
    this._depthDt = 0;
    this.play('idle');
  }

  play(name, restart = false) {
    if (this.animName === name && !restart) return;
    this.animName = name;
    this.anim = this.asset.anim(name);
    if (SCALE_AUDIT) logScaleAudit(this.asset.meta, name);
    this.fi = 0;
    this.ft = 0;
    this.done = false;
    this.setFrame(this.anim.frames[0]);
  }

  setFrame(f) {
    this.frame = f;
    const uv = this.asset.uv(f, this._uv);
    this.mat.uniforms.uvRect.value.copy(uv);
    this.shadowTex.offset.set(uv.x, uv.y);
    this.shadowTex.repeat.set(uv.z - uv.x, uv.w - uv.y);
  }

  // Hand anchor of the frame on screen (or of `name`'s frames); see SheetAsset.hand.
  hand(name = null) {
    if (!name) return this.asset.hand(this.anim, this.frame);
    const a = this.asset.anim(name);
    return this.asset.hand(a, a?.frames?.[0]);
  }

  // Free-running playback (loops / one-shots).
  update(dtMs) {
    const a = this.anim;
    if (!a || this.done) return;
    this.ft += dtMs;
    let guard = 0;
    while (this.ft >= (a.durations?.[this.fi] ?? 100) && guard++ < 20) {
      this.ft -= a.durations?.[this.fi] ?? 100;
      this.fi++;
      if (this.fi >= a.frames.length) {
        if (a.loop) this.fi = 0;
        else { this.fi = a.frames.length - 1; this.done = true; break; }
      }
    }
    this.setFrame(a.frames[this.fi]);
  }

  hasAnim(name) {
    return this.asset.has(name);
  }

  // the current frame's wall-anchor shift (SheetAsset.wallAnchor), world units facing right
  wallAnchor() {
    return this.asset.wallAnchor(this.frame);
  }

  // Playback driven by a gameplay clock (an attack's phases, a tech state's beats): phase 0..2 with progress 0..1.
  // reverse plays the beat backward (a tech roll toward the back).
  setPhase(name, phase, p, reverse = false) {
    if (this.animName !== name) this.play(name);
    const a = this.anim;
    this.fi = phaseFrame(a.phases, a.frames.length, phase, reverse ? Math.max(0, 1 - p - 1e-6) : p);
    this.setFrame(a.frames[this.fi]);
  }

  place(x, y, z) {
    this.root.position.set(x, RING_TOP + y, z);
    const onRing = Math.abs(x) <= RING_HALF && Math.abs(z) <= RING_HALF;
    const floor = onRing ? RING_TOP : 0;
    this.blob.position.set(x, floor + 0.012, z);
    const s = Math.max(0.35, 1 - (RING_TOP + y - floor) * 0.18);
    this.lift = s; // 1 on the floor, smaller with height (fitShadow only stretches a grounded body's blob)
    this.blob.rotation.y = 0;
    const k = this.depthK; // the contact shadow keeps the width of the (depth-scaled) feet
    this.blob.scale.set(1.25 * s * k, 1, 0.7 * s * k);
    this.blob.material.opacity = 0.32 * s;
  }

  // Billboard toward the camera and mirror when facing screen-left. refDepth/time: see syncDepth.
  sync(camera, faceX, faceZ, camRight, refDepth = null, time = 0) {
    this.mesh.quaternion.copy(camera.quaternion);
    const d = faceX * camRight.x + faceZ * camRight.z;
    if (Math.abs(d) > 0.12) this.flip = d >= 0 ? 1 : -1;
    this.mesh.scale.x = this.flip;
    this.caster.scale.x = this.flip;
    this.fitShadow(camRight);
    for (const g of this.ghosts) g.mesh.quaternion.copy(camera.quaternion);
    this.syncDepth(camera, refDepth, time);
  }

  // Depth normalization (ENG-067): a billboard's on-screen size goes with 1 / view depth, so the fighter nearer
  // the camera looked up to ~23% bigger whenever the two stood apart in depth or one was in the air. Scaling the
  // root by (depth / refDepth) ^ SPRITE_DEPTH_COMP, with the same refDepth for both fighters (the fight and clash
  // cameras' eased depth midway between their feet), draws both at exactly one size: no lag between them, and a
  // vanish or a launch never makes one grow while the other shrinks. The root scales about the feet pivot and
  // carries the mesh, the shadow caster and the box viewer; the blob follows in place(). Boxes and hand anchors
  // are not scaled: the simulation must not depend on the camera (held hand VFX read depthK themselves,
  // Effects.handTick). A null refDepth (close-ups) blends back to the
  // true size; the blend weight is keyed on the camera clock so the two syncs of one rendered frame agree and the
  // later one (made after the camera moved) wins.
  syncDepth(camera, refDepth, time) {
    if (DEPTH_COMP === 0) return;
    if (time !== this._depthTime) {
      this._depthDt = Math.min(0.1, Math.max(0, time - this._depthTime));
      this._depthTime = time;
      this._depthWBase = this._depthW;
    }
    if (refDepth > 0) {
      const e = camera.matrixWorld.elements, p = this.root.position;
      // view depth along the camera's forward axis (-z column of its world matrix)
      const d = -((p.x - e[12]) * e[8] + (p.y - e[13]) * e[9] + (p.z - e[14]) * e[10]);
      if (d > 0) this._depthTarget = Math.min(SPRITE_DEPTH_CLAMP[1], Math.max(SPRITE_DEPTH_CLAMP[0], Math.pow(d / refDepth, DEPTH_COMP)));
    }
    const a = 1 - Math.pow(1 - DEPTH_BLEND, this._depthDt * 60);
    this._depthW = this._depthWBase + ((refDepth > 0 ? 1 : 0) - this._depthWBase) * a;
    this.depthK = 1 + (this._depthTarget - 1) * this._depthW;
    this.root.scale.setScalar(this.depthK);
  }

  // The round blob and the sun-facing caster suit an upright body. A lying one (a frame with a footprint, on the floor)
  // is up to 2 units long: stretch the blob along the drawn body so the head and feet ends are grounded too, and turn
  // the caster with the billboard so the silhouette's shadow runs under the body instead of off past the feet (ADR 0020).
  // Runs after place(), which resets the blob every frame. The root (so the drawn body) is depth-scaled about the
  // feet by depthK (syncDepth), so the footprint's offset and length take the same factor.
  fitShadow(camRight) {
    const fp = this.lift > 0.9 ? this.asset.footprint(this.frame) : null;
    if (!fp) {
      this.caster.rotation.y = SUN_YAW;
      return;
    }
    const k = this.depthK;
    const yaw = Math.atan2(-camRight.z, camRight.x);
    const c = ((this.flip * (fp.x0 + fp.x1)) / 2) * k;
    this.blob.position.x += camRight.x * c;
    this.blob.position.z += camRight.z * c;
    this.blob.rotation.y = yaw;
    this.blob.scale.set((((fp.x1 - fp.x0) / 2 + 0.1) / 0.42) * k, 1, 0.75 * k);
    this.blob.material.opacity = 0.36;
    this.caster.rotation.y = yaw;
  }

  ghost(color, life = 0.3, opacity = 0.55) {
    const mat = spriteMaterial(this.asset.texture, true);
    mat.uniforms.uvRect.value.copy(this._uv);
    mat.uniforms.flashColor.value.set(color);
    mat.uniforms.silhouette.value = 0.65;
    mat.uniforms.opacity.value = opacity;
    const mesh = new THREE.Mesh(this.geo, mat);
    mesh.position.copy(this.root.position);
    mesh.quaternion.copy(this.mesh.quaternion);
    mesh.scale.set(this.flip * this.depthK, this.depthK, this.depthK); // same size as the body it echoes
    mesh.renderOrder = 1;
    this.scene.add(mesh);
    this.ghosts.push({ mesh, life, max: life, opacity });
  }

  updateGhosts(dt) {
    for (let i = this.ghosts.length - 1; i >= 0; i--) {
      const g = this.ghosts[i];
      g.life -= dt;
      g.mesh.material.uniforms.opacity.value = Math.max(0, (g.life / g.max) * g.opacity);
      if (g.life <= 0) {
        this.scene.remove(g.mesh);
        g.mesh.material.dispose();
        this.ghosts.splice(i, 1);
      }
    }
  }

  // The power-up outline around the frame on screen (chargeFx.js), made on first use.
  auraShell() {
    return (this.shell ??= new AuraShell(this));
  }

  setVisible(v) {
    this.root.visible = v;
    this.blob.visible = v;
  }

  // Frees every GPU resource the actor created (asset.texture is shared by the roster and stays).
  dispose() {
    this.scene.remove(this.root);
    this.scene.remove(this.blob);
    for (const g of this.ghosts) {
      this.scene.remove(g.mesh);
      g.mesh.material.dispose();
    }
    this.ghosts.length = 0;
    this.shell?.dispose();
    this.mat.dispose();
    this.caster.material.dispose();
    this.caster.customDepthMaterial.dispose();
    this.shadowTex.dispose(); // a clone sharing the image: three refcounts the source
    this.blob.geometry.dispose();
    this.blob.material.dispose();
    this.geo.dispose(); // shared by the mesh, the caster and the ghosts
  }
}
