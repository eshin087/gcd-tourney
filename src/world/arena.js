import * as THREE from 'three';
import * as T from '../art/textures.js';
import { bakeCrowd, bakeAnnouncer, CROWD_W, CROWD_H } from '../art/crowdPainter.js';
import { CROWD_PPU as PPU } from '../game/constants.js';
import { RING_HALF, RING_TOP } from '../game/constants.js';

const lambert = (map, extra = {}) => new THREE.MeshLambertMaterial({ map, ...extra });

function repeatTex(base, rx, ry) {
  const t = base.clone();
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.needsUpdate = true;
  return t;
}

function box(w, h, d, mat, x, y, z, opts = {}) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  if (opts.cast) m.castShadow = true;
  if (opts.receive !== false) m.receiveShadow = true;
  return m;
}

// Billboarded, instanced crowd. Each instance picks a variant column in the atlas
// and flips between idle/cheer rows on its own rhythm; uExcite makes them go wild.
function makeCrowd(positions, atlas) {
  const tex = T.toTex(atlas.canvas);
  const base = new THREE.PlaneGeometry(1, 1);
  base.translate(0, 0.5, 0);
  const geo = new THREE.InstancedBufferGeometry();
  geo.index = base.index;
  geo.attributes.position = base.attributes.position;
  geo.attributes.uv = base.attributes.uv;
  const n = positions.length;
  const aPos = new Float32Array(n * 3), aVar = new Float32Array(n), aPhase = new Float32Array(n);
  positions.forEach((p, i) => {
    aPos.set([p.x, p.y, p.z], i * 3);
    aVar[i] = Math.floor(Math.random() * atlas.count);
    aPhase[i] = Math.random();
  });
  geo.setAttribute('aPos', new THREE.InstancedBufferAttribute(aPos, 3));
  geo.setAttribute('aVar', new THREE.InstancedBufferAttribute(aVar, 1));
  geo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(aPhase, 1));
  geo.instanceCount = n;
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      map: { value: tex },
      uTime: { value: 0 },
      uExcite: { value: 0 },
      uDim: { value: 0 },
      uSize: { value: new THREE.Vector2(CROWD_W / PPU, CROWD_H / PPU) },
      uCount: { value: atlas.count },
    },
    vertexShader: /* glsl */ `
      attribute vec3 aPos; attribute float aVar; attribute float aPhase;
      uniform float uTime; uniform float uExcite; uniform vec2 uSize; uniform float uCount;
      varying vec2 vUv;
      void main() {
        vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
        vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        float rate = 3.0 + aPhase * 4.0 + uExcite * 6.0;
        float s = sin(uTime * rate + aPhase * 40.0);
        float cheer = step(0.75 - uExcite * 0.9, s);
        float hop = max(0.0, s) * (0.03 + uExcite * 0.12);
        vec3 wp = aPos + right * (position.x * uSize.x) + up * (position.y * uSize.y) + vec3(0.0, hop, 0.0);
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
        vUv = vec2((aVar + uv.x) / uCount, (1.0 - cheer) * 0.5 + uv.y * 0.5);
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D map; uniform float uDim; varying vec2 vUv;
      void main() {
        vec4 c = texture2D(map, vUv);
        if (c.a < 0.5) discard;
        gl_FragColor = vec4(c.rgb * 0.97 * (1.0 - uDim * 0.8) * vec3(1.0 - uDim * 0.1, 1.0 - uDim * 0.18, 1.0), 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  return mesh;
}

function billboard(canvas, w, h, x, y, z, ppu = PPU) {
  const mat = new THREE.SpriteMaterial({ map: T.toTex(canvas), alphaTest: 0.5, transparent: false });
  const s = new THREE.Sprite(mat);
  s.center.set(0.5, 0);
  s.scale.set(w || canvas.width / ppu, h || canvas.height / ppu, 1);
  s.position.set(x, y, z);
  return s;
}

function gableRoof(len, depth, rise, mat, x, y, z, overhang = 0.6) {
  const g = new THREE.Group();
  const half = depth / 2 + overhang;
  const slope = Math.hypot(half, rise);
  const ang = Math.atan2(rise, half);
  for (const s of [-1, 1]) {
    const b = box(len + overhang * 2, 0.28, slope, mat, 0, rise / 2, (s * half) / 2);
    b.rotation.x = s * ang;
    g.add(b);
  }
  // ridge beam
  g.add(box(len + overhang * 2 + 0.2, 0.3, 0.4, mat, 0, rise + 0.05, 0));
  g.position.set(x, y, z);
  return g;
}

function slopeAwning(len, depth, drop, mat, x, y, z) {
  const b = box(len, 0.22, Math.hypot(depth, drop), mat, x, y - drop / 2, z + depth / 2);
  b.rotation.x = Math.atan2(drop, depth);
  return b;
}

export function buildArena(scene) {
  const world = new THREE.Group();
  scene.add(world);

  // ---------------------------------------------------------------- lights & sky
  const hemi = new THREE.HemisphereLight(0xe8f2ff, 0x9a8a6a, 1.55);
  world.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0d8, 2.3);
  sun.position.set(-9, 22, 13);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera;
  sc.left = -17; sc.right = 17; sc.top = 17; sc.bottom = -17; sc.near = 1; sc.far = 70;
  sun.shadow.bias = -0.0008;
  world.add(sun, sun.target);

  const sky = new THREE.Mesh(new THREE.SphereGeometry(400, 16, 12), new THREE.MeshBasicMaterial({ map: T.skyTexture(), side: THREE.BackSide, depthWrite: false, fog: false }));
  sky.renderOrder = -10;
  world.add(sky);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + 0.3;
    const cl = billboard(T.cloudCanvas(100 + i), 0, 0, Math.cos(a) * 220, 40 + (i % 3) * 18, Math.sin(a) * 220, 1.4);
    world.add(cl);
  }

  // ---------------------------------------------------------------- ground
  const grassTex = T.grassTexture();
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), lambert(repeatTex(grassTex, 50, 50)));
  grass.rotation.x = -Math.PI / 2;
  grass.receiveShadow = true;
  world.add(grass);

  const pathTex = T.pathTexture();
  const pathMat = (len) => lambert(repeatTex(pathTex, 2, len / 2));
  const path = (x, z, w, len) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, len), pathMat(len));
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.02, z);
    m.receiveShadow = true;
    world.add(m);
  };
  path(0, -15, 4, 12); // temple -> ring
  path(0, 25, 4, 32); // ring -> gate
  path(0, 50, 4, 20); // outside the gate

  // ---------------------------------------------------------------- ring
  const S = RING_HALF * 2;
  const sideTex = T.ringSideTexture();
  const sideMat = lambert(repeatTex(sideTex, S / 4, 1));
  const topMat = lambert(T.ringTopTexture(S, 24));
  const ring = new THREE.Mesh(new THREE.BoxGeometry(S, RING_TOP, S), [sideMat, sideMat, topMat, sideMat, sideMat, sideMat]);
  ring.position.y = RING_TOP / 2;
  ring.receiveShadow = true;
  world.add(ring);
  const lip = box(S + 0.7, 0.18, S + 0.7, lambert(repeatTex(sideTex, S / 3, 0.3)), 0, 0.09, 0);
  world.add(lip);

  // ---------------------------------------------------------------- temple
  const plaster = T.plasterTexture();
  const plasterMat = (rx, ry) => lambert(repeatTex(plaster, rx, ry));
  const woodTex = T.woodTexture();
  const woodMat = lambert(repeatTex(woodTex, 1, 1));
  const darkWoodMat = lambert(repeatTex(T.woodTexture('#6e4a2e'), 1, 1));
  const roofTexBase = T.roofTexture('#5e4436');
  const roofMat = lambert(repeatTex(roofTexBase, 16, 4));
  const stoneTex = T.stoneBaseTexture();
  const stoneMat = (rx, ry) => lambert(repeatTex(stoneTex, rx, ry));

  const TZ = -24;
  world.add(box(32, 0.9, 8, stoneMat(16, 1), 0, 0.45, TZ));
  const facade = lambert(T.templeFacadeTexture());
  const side = plasterMat(3, 3);
  world.add(box(28, 7, 6, [side, side, plasterMat(14, 3), side, facade, side], 0, 0.9 + 3.5, TZ));
  world.add(gableRoof(28, 6, 2.8, roofMat, 0, 7.9, TZ, 1.2));
  world.add(slopeAwning(28.6, 1.6, 0.7, roofMat, 0, 0.9 + 4.3, TZ + 3));
  // steps
  const stepsTex = T.stepsTexture();
  for (let i = 0; i < 3; i++) {
    world.add(box(6, 0.3 * (3 - i), 0.7, lambert(repeatTex(stepsTex, 3, 1)), 0, 0.15 * (3 - i), TZ + 4 + i * 0.7));
  }
  // banners
  const banners = [['#c8323c', '#fff0d0', '武'], ['#2a4a8a', '#f4f4ff', '道'], ['#2a4a8a', '#f4f4ff', '祭'], ['#c8323c', '#fff0d0', '闘']];
  [-10.5, -6.5, 6.5, 10.5].forEach((x, i) => {
    const [bg, fg, g] = banners[i];
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 3.2), new THREE.MeshLambertMaterial({ map: T.bannerTexture(bg, fg, g), alphaTest: 0.5, side: THREE.DoubleSide }));
    m.position.set(x, 0.9 + 4.6, TZ + 3.05);
    world.add(m);
  });

  // ---------------------------------------------------------------- props: gong, parasols, announcer
  const gong = new THREE.Group();
  gong.add(box(0.25, 2.8, 0.25, darkWoodMat, -1.1, 1.4, 0, { cast: true }));
  gong.add(box(0.25, 2.8, 0.25, darkWoodMat, 1.1, 1.4, 0, { cast: true }));
  gong.add(box(2.7, 0.25, 0.3, darkWoodMat, 0, 2.75, 0, { cast: true }));
  const disc = new THREE.Mesh(new THREE.CircleGeometry(0.85, 20), new THREE.MeshLambertMaterial({ map: T.gongTexture(), side: THREE.DoubleSide }));
  disc.position.set(0, 1.65, 0);
  disc.castShadow = true;
  gong.add(disc);
  gong.position.set(-9.5, 0, -15.5);
  gong.rotation.y = 0.25;
  world.add(gong);

  const parasolTex = T.parasolTexture();
  const parasol = (x, z) => {
    const g = new THREE.Group();
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.7, 0.8, 16, 1, true), new THREE.MeshLambertMaterial({ map: repeatTex(parasolTex, 2, 1), side: THREE.DoubleSide }));
    cone.position.y = 2.7;
    cone.castShadow = true;
    g.add(cone);
    g.add(box(0.08, 2.6, 0.08, darkWoodMat, 0, 1.3, 0));
    g.add(box(1.9, 0.12, 0.9, woodMat, 0, 0.75, 0.2, { cast: true }));
    g.add(box(0.1, 0.7, 0.1, darkWoodMat, -0.8, 0.35, 0.2));
    g.add(box(0.1, 0.7, 0.1, darkWoodMat, 0.8, 0.35, 0.2));
    g.position.set(x, 0, z);
    world.add(g);
  };
  parasol(-13.2, -15);
  parasol(13.2, -15);
  world.add(billboard(bakeAnnouncer(), 0, 0, -11.8, 0, -14.4));

  // ---------------------------------------------------------------- stands + crowd
  const brickTex = T.brickTexture();
  const crowdPos = [];
  const R = Math.random;
  const tierStep = 1.25, tierRise = 0.7, wallH = 1.25;
  const addCrowdRow = (x0, z0, x1, z1, y, density = 1.05, skipFn = null) => {
    const len = Math.hypot(x1 - x0, z1 - z0);
    const n = Math.floor(len / density);
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5 + (R() - 0.5) * 0.35) / n;
      const x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t;
      if (skipFn && skipFn(x, z)) continue;
      if (R() < 0.06) continue;
      crowdPos.push(new THREE.Vector3(x, y, z));
    }
  };
  // side stands (left/right), tiers rise outward
  for (const s of [-1, 1]) {
    const x0 = s * 12.6;
    const zA = -13, zB = 13;
    const L = zB - zA;
    world.add(box(0.4, wallH, L, lambert(repeatTex(brickTex, L / 2, 1)), x0, wallH / 2, 0));
    for (let i = 0; i < 4; i++) {
      const h = wallH - 0.35 + i * tierRise;
      const xc = x0 + s * (0.2 + tierStep * (i + 0.5));
      world.add(box(tierStep, h, L, [stoneMat(1, 1), stoneMat(1, 1), lambert(repeatTex(stepsTex, 1, L)), stoneMat(1, 1), stoneMat(1, h), stoneMat(1, h)], xc, h / 2, 0));
      addCrowdRow(xc, zA + 0.5, xc, zB - 0.5, h, 1.0, (x, z) => Math.abs(z) < 0.7 || Math.abs(Math.abs(z) - 8) < 0.6);
    }
    // aisle stairs
    for (const az of [-8, 0, 8]) world.add(box(tierStep * 4, 0.12, 1.0, lambert(repeatTex(stepsTex, 2, 1)), x0 + s * (0.2 + tierStep * 2), wallH + 0.9, az));
  }
  // front stands (either side of the entrance path), tiers rise toward the gate
  for (const s of [-1, 1]) {
    const xa = s * 3.2, xb = s * 12.4;
    const xc = (xa + xb) / 2, L = Math.abs(xb - xa);
    const z0 = 12.8;
    world.add(box(L, wallH, 0.4, lambert(repeatTex(brickTex, L / 2, 1)), xc, wallH / 2, z0));
    for (let i = 0; i < 4; i++) {
      const h = wallH - 0.35 + i * tierRise;
      const zc = z0 + 0.2 + tierStep * (i + 0.5);
      world.add(box(L, h, tierStep, [stoneMat(1, h), stoneMat(1, h), lambert(repeatTex(stepsTex, L, 1)), stoneMat(1, 1), stoneMat(L, h), stoneMat(L, h)], xc, h / 2, zc));
      addCrowdRow(xa + s * 0.5, zc, xb - s * 0.5, zc, h, 1.0);
    }
  }
  const atlas = bakeCrowd(28, 9);
  const crowd = makeCrowd(crowdPos, atlas);
  world.add(crowd);

  // ---------------------------------------------------------------- outer walls + gate
  const wallTop = lambert(repeatTex(roofTexBase, 40, 1));
  const wall = (x, z, len, alongX) => {
    const w = alongX ? len : 0.6, d = alongX ? 0.6 : len;
    world.add(box(w, 0.9, d, stoneMat(len / 2, 1), x, 0.45, z));
    world.add(box(w, 2.1, d, plasterMat(len / 2, 1), x, 0.9 + 1.05, z));
    world.add(box(alongX ? len : 0.9, 0.2, alongX ? 0.9 : len, darkWoodMat, x, 3.05, z));
    world.add(box(alongX ? len + 0.2 : 1.3, 0.3, alongX ? 1.3 : len + 0.2, wallTop, x, 3.3, z));
  };
  const WX = 25, WZ = 31;
  wall(-WX, 0, WZ * 2, false);
  wall(WX, 0, WZ * 2, false);
  wall(0, -WZ, WX * 2, true);
  wall(-(WX + 3.6) / 2, WZ, WX - 3.6, true);
  wall((WX + 3.6) / 2, WZ, WX - 3.6, true);

  // gate
  const gate = new THREE.Group();
  const pillarMat = lambert(repeatTex(T.woodTexture('#8a5634'), 1, 3));
  gate.add(box(0.7, 5.4, 0.7, pillarMat, -3.4, 2.7, 0, { cast: true }));
  gate.add(box(0.7, 5.4, 0.7, pillarMat, 3.4, 2.7, 0, { cast: true }));
  gate.add(box(8.6, 0.45, 0.6, darkWoodMat, 0, 4.9, 0));
  gate.add(box(7.4, 0.3, 0.5, darkWoodMat, 0, 4.1, 0));
  gate.add(gableRoof(8.4, 1.6, 0.9, lambert(repeatTex(roofTexBase, 6, 2)), 0, 5.15, 0, 0.6));
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.1), new THREE.MeshLambertMaterial({ map: T.signTexture('天下一武闘祭'), side: THREE.DoubleSide }));
  sign.position.set(0, 3.5, 0.36);
  gate.add(sign);
  const sign2 = sign.clone();
  sign2.position.z = -0.36;
  sign2.rotation.y = Math.PI;
  gate.add(sign2);
  for (const [x, g] of [[-3.4, '武'], [3.4, '祭']]) {
    const lan = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.95, 12), new THREE.MeshLambertMaterial({ map: T.lanternTexture(g) }));
    lan.position.set(x, 2.6, 0.75);
    gate.add(lan);
    gate.add(box(0.5, 0.12, 0.5, darkWoodMat, x, 3.12, 0.75));
    gate.add(box(0.5, 0.12, 0.5, darkWoodMat, x, 2.08, 0.75));
    gate.add(box(0.05, 0.6, 0.05, darkWoodMat, x, 3.45, 0.75));
  }
  gate.position.set(0, 0, WZ);
  world.add(gate);

  // ---------------------------------------------------------------- trees
  const treeCanvases = [T.treeCanvas(3, 'round'), T.treeCanvas(4, 'round'), T.treeCanvas(5, 'pine'), T.treeCanvas(6, 'round')];
  const treeMats = treeCanvases.map((c) => new THREE.SpriteMaterial({ map: T.toTex(c), alphaTest: 0.5 }));
  const tree = (x, z, s) => {
    const sp = new THREE.Sprite(treeMats[Math.floor(Math.random() * treeMats.length)]);
    sp.center.set(0.5, 0);
    sp.scale.set(3 * s, 4 * s, 1);
    sp.position.set(x, 0, z);
    world.add(sp);
  };
  for (let i = 0; i < 70; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 36 + Math.random() * 40;
    const x = Math.cos(a) * r * 0.9, z = Math.sin(a) * r;
    if (Math.abs(x) < 6 && z > 30) continue;
    tree(x, z, 1.6 + Math.random() * 1.2);
  }
  for (const [x, z] of [[-6.5, 36], [6.5, 36], [-9, 41], [9, 41], [-21, -27], [21, -27], [-21, 27], [21, 27], [-6.2, 45], [6.2, 45]]) tree(x, z, 1.3 + Math.random() * 0.4);

  // unlit materials that should darken during super flashes
  const unlit = new Set([sky.material]);
  world.traverse((o) => { if (o.isSprite) unlit.add(o.material); });
  const baseHemi = hemi.intensity, baseSun = sun.intensity;
  const hemiSky = hemi.color.clone();
  const dimSky = new THREE.Color('#3a2a6a');
  return {
    group: world,
    sun,
    crowd,
    gong: disc,
    update(time, excite) {
      crowd.material.uniforms.uTime.value = time;
      crowd.material.uniforms.uExcite.value = excite;
    },
    setDim(d) {
      hemi.intensity = baseHemi * (1 - d * 0.78);
      sun.intensity = baseSun * (1 - d * 0.92);
      hemi.color.copy(hemiSky).lerp(dimSky, d);
      const k = 1 - d * 0.8;
      for (const m of unlit) m.color.setRGB(k * (1 - d * 0.1), k * (1 - d * 0.18), k);
      crowd.material.uniforms.uDim.value = d;
    },
  };
}

