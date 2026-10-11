// Shared world constants. 1 world unit = 1 floor tile.
export const RING_HALF = 9; // ring spans -9..9 on x and z
export const RING_TOP = 0.6; // height of the ring surface
export const ARENA_LIMIT = RING_HALF - 0.45; // how far fighters can move from center
export const FPS = 60; // fixed simulation rate
export const DT = 1 / FPS;
export const GRAVITY = 42;
export const MAX_HP = 1000;
export const MAX_KI = 300;
export const KI_BAR = 100;
export const ROUND_TIME = 99;
export const ROUNDS_TO_WIN = 2;
export const VFX_PPU = 28; // world scale of procedural effect sprites (64px cells)
export const CROWD_PPU = 28; // world scale of crowd / prop billboards
// Fighter sprites are camera-facing billboards, so true perspective draws the fighter nearer the camera up to
// ~23% bigger than the other one. In the fight and clash cameras each sprite is scaled by its view depth over
// the depth midway between the two fighters, raised to SPRITE_DEPTH_COMP (1 = both always the same size,
// 0 = true perspective), and clamped. Visual only: boxes and hand anchors stay unscaled; held hand VFX scale with
// the body (Effects.handTick) (ENG-067, ADR 0021; ?depthscale=0 compares).
export const SPRITE_DEPTH_COMP = 1;
export const SPRITE_DEPTH_CLAMP = [0.82, 1.22];
