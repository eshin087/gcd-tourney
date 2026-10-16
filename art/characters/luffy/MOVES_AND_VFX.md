# Luffy: moves and VFX

The move assignments and mechanics here mirror [KIT.md](KIT.md) and ADR 0032. Engine support and gameplay values belong to Claude's character-data task. Sprite art draws rubber extension as anatomy; effects, steam, aura and motion lines come from the engine.

| slot | move | animation(s) | art notes |
|---|---|---|---|
| neutral Special | Gum-Gum Pistol | `special` | Physically stretched fist; engine projectile is skin-tinted `orb`. |
| forward Special | Gum-Gum Bazooka | `specialForward` | Short forward lunge, both extended palms. |
| up Special | Gum-Gum Rocket | `specialUp` → `airHeavy` → `land` | Slingshot launch and downward slam. |
| down Special | Gear Second | `charge` | Pink skin flush; engine `chakra` flame and `wisp` steam. |
| back Special | Gum-Gum Whip | `specialDown` | Low extended leg sweep. |
| air Special | Gum-Gum Pistol | `throw` | Air fist release. |
| air down Special | Gum-Gum Rocket | `airHeavy` → `land` | Drop-only slam. |
| SUPER | Gear Second: Jet Gatling | `superPose`, `dash`, `light2` / `light4`, `heavy` | Front dash, punch flurry, final wall-bounce punch. |
| ultimate | Gear Third: Gigant Pistol | `beamCharge` → `beamFire` | Giant inflated fist; one lane strike. Engine uses skin-tinted `orb`, `lines` and smoke puffs. |

## Effect anchor points

Defaults follow `art/SPEC.md`; measure actual hand locations after art approval and ask Claude to migrate offsets if needed.

| effect | default (x,y) | Luffy actual | frames |
|---|---:|---|---|
| orb-type fist | (205,148) | pending art | `special` |
| beam origin | (230,122) | pending art | `beamFire` |
| projectile release | (192,125) | pending art | `throw` |

## VFX used

| moment | atlas effects | tint |
|---|---|---|
| light hits | `spark`, `lines` | white / warm yellow |
| heavy hits | `burst`, `ring`, `lines`, `crater` | warm yellow |
| Gear Second | `flame`, `wisp` | pink flush / steam |
| Pistol | `orb`, `glow` | skin tone |
| Gigant Pistol | `orb`, `lines`, smoke puffs | skin tone |
| landing / dashes | `dust` | full color |

No character-specific VFX asset is proposed in this reference task. Any new effect needs a task for Claude and a separate review candidate.
