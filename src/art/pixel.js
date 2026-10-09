// Tiny indexed pixel rasterizer used to paint placeholder sprites procedurally.
// Shapes are drawn into a "part" buffer; finalize() turns parts into cel-shaded
// colors with inner contour lines, then outline() adds the dark silhouette edge.

export function hex(h) {
  const n = parseInt(h.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function pack(rgb, a = 255) {
  return ((a << 24) | (rgb[2] << 16) | (rgb[1] << 8) | rgb[0]) >>> 0;
}

export function unpack(c) {
  return [c & 255, (c >> 8) & 255, (c >> 16) & 255, (c >>> 24) & 255];
}

const clamp255 = (v) => Math.max(0, Math.min(255, Math.round(v)));

// Darken with a slight hue shift toward purple/blue, like hand-picked pixel ramps.
export function darken(rgb, amt) {
  return [
    clamp255(rgb[0] * (1 - amt) - 6 * amt),
    clamp255(rgb[1] * (1 - amt * 1.05) - 4 * amt),
    clamp255(rgb[2] * (1 - amt * 0.7) + 18 * amt),
  ];
}

// Lighten with a slight warm shift.
export function lighten(rgb, amt) {
  return [
    clamp255(rgb[0] + (255 - rgb[0]) * amt + 6 * amt),
    clamp255(rgb[1] + (255 - rgb[1]) * amt + 3 * amt),
    clamp255(rgb[2] + (255 - rgb[2]) * amt * 0.8),
  ];
}

export function mix(a, b, t) {
  return [clamp255(a[0] + (b[0] - a[0]) * t), clamp255(a[1] + (b[1] - a[1]) * t), clamp255(a[2] + (b[2] - a[2]) * t)];
}

// A material is a little color ramp: base / shade / highlight / contour line.
export function makeMat(base, opt = {}) {
  const b = typeof base === 'string' ? hex(base) : base;
  const shade = opt.shade ? hex(opt.shade) : darken(b, 0.28);
  const hi = opt.hi === false ? null : opt.hi ? hex(opt.hi) : lighten(b, 0.25);
  const line = opt.line ? hex(opt.line) : darken(b, 0.6);
  return {
    rgb: b,
    base: pack(b),
    shade: pack(shade),
    hi: hi ? pack(hi) : 0,
    line: pack(line),
  };
}

// Same material pushed into shadow (for limbs on the far side of the body).
export function backMat(m, amt = 0.22) {
  const b = darken(m.rgb, amt);
  return {
    rgb: b,
    base: pack(b),
    shade: pack(darken(b, 0.3)),
    hi: m.hi ? pack(m.rgb) : 0,
    line: pack(darken(b, 0.62)),
  };
}

export class PixelCanvas {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.part = new Int16Array(w * h).fill(-1);
    this.parts = [];
    this.px = new Uint32Array(w * h);
  }

  newPart(mat, group, opt = {}) {
    this.parts.push({ mat, group, shadeDepth: opt.shadeDepth ?? 1, hiDepth: opt.hiDepth ?? 1, noLine: !!opt.noLine, flat: !!opt.flat });
    return this.parts.length - 1;
  }

  _fill(x0, y0, x1, y1, test, p) {
    x0 = Math.max(0, Math.floor(x0));
    y0 = Math.max(0, Math.floor(y0));
    x1 = Math.min(this.w - 1, Math.ceil(x1));
    y1 = Math.min(this.h - 1, Math.ceil(y1));
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        if (test(x + 0.5, y + 0.5)) this.part[y * this.w + x] = p;
      }
    }
  }

  plot(x, y, p) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.part[y * this.w + x] = p;
  }

  disc(cx, cy, r, p) {
    const r2 = r * r;
    this._fill(cx - r - 1, cy - r - 1, cx + r + 1, cy + r + 1, (x, y) => (x - cx) ** 2 + (y - cy) ** 2 <= r2, p);
  }

  ellipse(cx, cy, rx, ry, p, rot = 0, clip = null) {
    const c = Math.cos(rot), s = Math.sin(rot);
    const m = Math.max(rx, ry) + 1;
    this._fill(cx - m, cy - m, cx + m, cy + m, (x, y) => {
      if (clip && !clip(x, y)) return false;
      const dx = x - cx, dy = y - cy;
      const u = dx * c + dy * s, v = -dx * s + dy * c;
      return (u * u) / (rx * rx) + (v * v) / (ry * ry) <= 1;
    }, p);
  }

  // Tapered capsule from (ax,ay) radius ra to (bx,by) radius rb.
  capsule(ax, ay, bx, by, ra, rb, p) {
    const m = Math.max(ra, rb) + 1;
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy || 1e-6;
    this._fill(Math.min(ax, bx) - m, Math.min(ay, by) - m, Math.max(ax, bx) + m, Math.max(ay, by) + m, (x, y) => {
      let t = ((x - ax) * dx + (y - ay) * dy) / len2;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const qx = ax + dx * t - x, qy = ay + dy * t - y;
      const r = ra + (rb - ra) * t;
      return qx * qx + qy * qy <= r * r;
    }, p);
  }

  poly(pts, p) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const [x, y] of pts) {
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
    }
    const n = pts.length;
    this._fill(x0 - 1, y0 - 1, x1 + 1, y1 + 1, (x, y) => {
      let inside = false;
      for (let i = 0, j = n - 1; i < n; j = i++) {
        const [xi, yi] = pts[i], [xj, yj] = pts[j];
        if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    }, p);
  }

  rect(x, y, w, h, p) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.plot(x + i, y + j, p);
  }

  // Resolve parts into shaded colors. Light comes from the upper-front (upper-right
  // for a right-facing sprite), so bottom-back edges take the shade color.
  finalize(light = [1, -1]) {
    const { w, h, part, parts, px } = this;
    const sx = -light[0], sy = -light[1];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        const p = part[i];
        if (p < 0) { px[i] = 0; continue; }
        const info = parts[p];
        const m = info.mat;
        let c = m.base;
        if (!info.flat) {
          // contour line where a later (in-front) part of another group borders us
          let line = false;
          if (!info.noLine) {
            const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            for (const [ox, oy] of nb) {
              const xx = x + ox, yy = y + oy;
              if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
              const q = part[yy * w + xx];
              if (q > p && parts[q].group !== info.group && !parts[q].noLine) { line = true; break; }
            }
          }
          if (line) c = m.line;
          else {
            let shaded = false;
            for (let d = 1; d <= info.shadeDepth; d++) {
              const xx = x + sx * d, yy = y + sy * d;
              if (xx < 0 || yy < 0 || xx >= w || yy >= h || part[yy * w + xx] !== p) { shaded = true; break; }
            }
            if (shaded) c = m.shade;
            else if (m.hi) {
              for (let d = 1; d <= info.hiDepth; d++) {
                const xx = x - sx * d, yy = y - sy * d;
                if (xx < 0 || yy < 0 || xx >= w || yy >= h || part[yy * w + xx] !== p) { c = m.hi; break; }
              }
            }
          }
        }
        px[i] = c;
      }
    }
  }

  pset(x, y, color) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.px[y * this.w + x] = color;
  }

  get(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return 0;
    return this.px[y * this.w + x];
  }

  // Dark 1px silhouette outline around everything opaque.
  outline(color) {
    const { w, h, px } = this;
    const out = new Uint32Array(px);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (px[i] >>> 24) continue;
        if ((x > 0 && px[i - 1] >>> 24) || (x < w - 1 && px[i + 1] >>> 24) || (y > 0 && px[i - w] >>> 24) || (y < h - 1 && px[i + w] >>> 24)) {
          out[i] = color;
        }
      }
    }
    this.px = out;
  }

  drawTo(ctx, dx, dy) {
    const img = ctx.createImageData(this.w, this.h);
    new Uint32Array(img.data.buffer).set(this.px);
    ctx.putImageData(img, dx, dy);
  }
}

// Seeded RNG so procedural art is stable between reloads.
export function rng(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}
