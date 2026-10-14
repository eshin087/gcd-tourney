# Son Goku: moves and VFX

This art brief follows [KIT.md](KIT.md) and ADR 0032. The current work is limited to the title-style neutral/combat reference; it does not authorize animation or UI production. Gameplay values and shared VFX are owned by the engine data.

## Moveset flavor

| engine move | animation | Goku version | strike point / effect origin |
|---|---|---|---|
| Light 1-4 | `light1`–`light4` | compact lead jab, rear straight, low kick, spinning high kick | active fist or foot |
| Heavy | `heavy` | rising straight punch launcher | rear fist |
| Air attacks | `airLight1`–`airHeavy` | controlled air punches and kicks, downward double-fist spike | active fist or foot |
| Ki Blast Volley | `special` | three open-palm thrusts, near/far/near | thrusting palm |
| Dragon Fist | `specialForward` | full-body lunging straight punch | extended fist |
| Rising Kick | `specialUp` → `airHeavy` → `land` | rising front kick into forward flip and dive | lead foot |
| Instant Transmission | `specialDown` → `light4` | two fingers at forehead, vanish handled by engine, kick from behind | forehead gesture; then kicking foot |
| Ki Blast Volley (air) | `throw` | palm release of the three-shot volley | open palm |
| Kaio-ken Rush | `superPose`, `dash`, `light2`/`light4`, `airHeavy` | red-aura flurry resolved by the engine | contact punches and final spike |
| Kamehameha | `beamCharge` → `beamFire` | side-on cupped hands at hip, then arms thrust forward | cupped hands / palms |
| Charge | `charge` | Super Saiyan power-up look; engine renders golden aura and ground cues | none |

## Effect anchors

Use the shared defaults in `art/SPEC.md` unless Claude measures and updates runtime offsets. The artwork should clearly present the palms and fists at the existing anchors. Never paint energy effects into the character sprite.

| moment | shared effect | anchor |
|---|---|---|
| Ki Blast Volley startup/release | `orb`, white-blue tint | open palm |
| Dragon Fist | `kiFist` hand effect, golden glow/flame | extended fist |
| Kaio-ken | `chakra` bursts tinted red | engine-managed aura |
| Kamehameha | shared procedural `beam` palette | cupped hands / forward palms |
| Super Saiyan charge | `flame`, `wisp`, `star`, floor cue | engine-managed |
| vanish, landing, dashes | `smoke`, `dust` | engine-managed |

## Palette cues

Character colors are golden hair, orange gi, deep blue undershirt and sash, and teal-green eyes. Shared effect colors are separate: white-blue ki blasts, golden Dragon Fist effect, red Kaio-ken aura, and white/light-blue/blue Kamehameha. No new VFX atlas assets are proposed.

## UI direction for a future approved stage

- Cut-in: focused teal-green eyes and brow, golden hair visible, dark navy surround.
- Portrait: calm determined expression.
- Select art: full-body grounded guard or relaxed victory pose.

These are future prompts only; no UI candidate is part of this reference batch.
