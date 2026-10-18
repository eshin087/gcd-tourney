import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// Gentle grade: a touch of saturation/contrast and a vignette, applied in linear space.
const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uVignette: { value: 0.32 },
    uSat: { value: 1.08 },
    uContrast: { value: 1.04 },
    uTint: { value: new THREE.Vector3(1, 1, 1) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float uVignette, uSat, uContrast; uniform vec3 uTint;
    varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      vec3 col = mix(vec3(l), c.rgb, uSat);
      col = (col - 0.18) * uContrast + 0.18;
      vec2 d = vUv - 0.5;
      float v = 1.0 - uVignette * smoothstep(0.25, 0.85, dot(d, d) * 2.2);
      gl_FragColor = vec4(max(col, 0.0) * v * uTint, c.a);
    }`,
};

// Renders the 3D scene into a small drawing buffer and lets CSS upscale it with
// nearest-neighbour sampling, so geometry, textures and sprites all share one
// chunky pixel grid (the "HD-2D" look). Bright (>1.0) effects bloom.
export class PixelRenderer {
  constructor(container) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: true });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;
    this.renderer.setPixelRatio(1);
    const cv = this.renderer.domElement;
    cv.id = 'game-canvas';
    container.appendChild(cv);
    this.pixelSize = 'auto';
    // 'pixel': ~340 px tall internal buffer (chunky placeholder art)
    // 'hd': ~600+ px tall so hi-res art packs (spec v2: pixelsPerUnit 128) keep their detail
    this.detail = 'pixel';
    this.width = 0;
    this.height = 0;
    this.onResize = [];
    this.bloomEnabled = true;
    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(new THREE.Scene(), new THREE.PerspectiveCamera());
    this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.55, 0.32, 1.0);
    this.grade = new ShaderPass(GradeShader);
    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.bloom);
    this.composer.addPass(this.grade);
    this.composer.addPass(new OutputPass());
    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  setDetail(mode) {
    if (mode !== 'hd' && mode !== 'pixel') return;
    this.detail = mode;
    this.resize();
  }

  setPixelSize(v) {
    this.pixelSize = v;
    this.resize();
  }

  resize() {
    // the container's box, not the window: the test lab docks its panel beside the game and shrinks #app (ADR 0018)
    const w = this.container.clientWidth || window.innerWidth, h = this.container.clientHeight || window.innerHeight;
    let scale;
    if (this.pixelSize === 'auto') scale = this.detail === 'hd' ? Math.max(1, Math.floor(h / 600)) : Math.max(1, Math.round(h / 340));
    else scale = +this.pixelSize;
    this.scale = scale;
    this.width = Math.max(1, Math.floor(w / scale));
    this.height = Math.max(1, Math.floor(h / scale));
    this.renderer.setSize(this.width, this.height, false);
    this.composer.setSize(this.width, this.height);
    const cv = this.renderer.domElement;
    cv.style.width = this.width * scale + 'px';
    cv.style.height = this.height * scale + 'px';
    for (const f of this.onResize) f(this.width, this.height);
  }

  render(scene, camera) {
    camera.aspect = this.width / this.height;
    camera.updateProjectionMatrix();
    if (this.bloomEnabled) {
      this.renderPass.scene = scene;
      this.renderPass.camera = camera;
      this.composer.render();
    } else this.renderer.render(scene, camera);
  }
}
