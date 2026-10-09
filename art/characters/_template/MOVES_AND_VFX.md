# {{NAME}}: moves and VFX

> TEMPLATE. Maps the shared engine moveset to this character's flavor, and lists every effect,
> color and anchor point the art and the engine must agree on. Gameplay numbers live in
> `src/game/moves.js` (shared) and `src/characters/{{id}}.js` (per character). Ask Claude (task in
> `docs/TASKS.md`) for anything that needs code: a new special, projectile, or effect.

## Engine fields (for `src/characters/{{id}}.js`)

| field | value | notes |
|---|---|---|
| `id` | `{{id}}` | same as the art folder |
| `name` | `{{DISPLAY NAME}}` | HUD name |
| `subtitle` | `{{short epithet}}` | select screen |
| `look` | {{one-line trait list (used by the Sprite Lab prompt builder)}} | |
| `color` | `#{{......}}` | UI accent |
| `aura` / `auraCore` | `[r, g, b]` / `[r, g, b]` (0-1) | aura flame and core tint |
| `beam` | `{ core: '#......', mid: '#......', edge: '#......', name: '{{ULTIMATE NAME}}' }` | ultimate beam colors |
| `special` | `'{{rasengan / chidori / new}}'` | key in `SPECIALS` (moves.js) |
| `specialName` | `{{SIGNATURE MOVE}}` | shown in the cut-in |
| `projectile` | `'{{shuriken / fireball / new}}'` | key in `PROJECTILES` (moves.js) |
| `projectileName` | `{{PROJECTILE NAME}}` | |
| `stats` | `{ speed: {{5.5-6.5}}, power: {{0.9-1.1}}, defense: {{0.9-1.1}} }` | |

## Moveset flavor

The animation names are shared by every fighter; this table says how **this** character performs
them. Frame details go in `ANIMATIONS.md`.

| engine move | animation | {{NAME}} version | strike point | zone |
|---|---|---|---|---|
| Light 1 | `light1` | {{e.g. "quick lead jab"}} | lead fist | HIGH |
| Light 2 | `light2` | {{...}} | rear fist | HIGH |
| Light 3 | `light3` | {{...}} | near foot | LOW |
| Light 4 (wall bounce) | `light4` | {{...}} | kicking foot | HIGH |
| Heavy (launcher) | `heavy` | {{...}} | rear fist | HIGH, then overhead |
| Air light 1-3 | `airLight1-3` | {{...}} | fist / foot / heel | MID (airLight2: LOW) |
| Air heavy (ground bounce) | `airHeavy` | {{...}} | clasped fists | down-forward |
| Super dash | `superDash` | {{...}} | lead fist (contact) | - |
| Vanish attack | `vanish` -> `light4` | {{...}} | kicking foot | HIGH |
| Projectile (air, half bar) | `throw` | {{e.g. "throws 3 shuriken" / "hand sign then breathes a fireball"}} | hand / mouth | release point |
| Signature rush (1 bar) | `special` | {{name + description}} | technique hand | LOW (stomach) |
| Ultimate (3 bars) | `beamCharge` -> `beamFire` | {{name + description}} | palms | beam origin |
| Charge ki | `charge` | {{...}} | - | - |
| Intro / taunt / win | `intro` / `taunt` / `win` | {{signature poses, with the source moment they come from}} | - | - |

## Effect anchor points

Where the engine draws effects relative to the sprite (px in the 256 cell, facing right, pivot
[128, 240]). Defaults come from [SPEC.md](../../SPEC.md#effect-anchor-points). Draw the hands there,
or measure your art and fill the "{{NAME}} actual" column so Claude can move the engine offsets.

| effect | default (x, y) | {{NAME}} actual (x, y) | frames |
|---|---|---|---|
| signature technique in hand (startup + run) | {{(205, 148) orb-type / (64, 199) trailing-low type}} | {{...}} | `special` 00-04 |
| signature technique at the thrust | {{(205, 148) orb-type (all frames) / (218, 140) trailing-low type, only after a hit}} | {{...}} | `special` 05 (orb-type), 06-07 after a hit (trailing type; see SPEC.md known gap) |
| beam origin (palms) | (230, 122) | {{...}} | `beamFire` all |
| projectile release | (192, 125) | {{...}} | `throw` 01 |

## VFX used

Shared effects come from the atlas (`art/vfx/`, names fixed). Tinted effects take this
character's colors at runtime.

| moment | atlas effects | tint |
|---|---|---|
| light hits | `spark`, `lines` | white / {{color}} |
| heavy / smash hits | `burst`, `ring`, `lines`, `crater` (ground bounce) | {{color}} |
| aura (charge, specials) | `flame`, `streak`, `glow` | `aura` / `auraCore` |
| signature technique | {{`orb` / `lightning` / new}} + `glow` | {{color}} |
| projectile | {{`shuriken` / `fire` / new}} | {{full color / tint}} |
| ultimate beam | procedural beam + `glow` | `beam` colors |
| vanish | `smoke` | full color |
| landing / dashes | `dust` | full color |

## New VFX requests

If this character needs an effect that is not in the atlas (a different technique, a weapon
trail, a summon), describe it here and open a task for Claude in `docs/TASKS.md` (new effect names
need engine code). One rule for every character (`art/vfx/README.md` "Adding a new effect"): name
it `{{id}}_<effect>`, keep the brief in this table and the prompt in `PROMPTS.md`, and save raws as
`art/vfx/raw/_proposed/{{id}}_<effect>_vNN.png` (the packer never reads `_proposed/`; queue each
candidate in `art/REVIEW.md` like any other image). It moves to
`art/vfx/EFFECTS.md` when the engine task lands.

| proposed effect | frames | color rule | anchor | description |
|---|---|---|---|---|
| `{{id}}_{{effect}}` | {{n}} | {{tinted / full color}} | {{center / bottom}} | {{...}} |

## Cut-in and portraits

UI candidates are saved as `raw/ui_<name>_vNN.png` and queued in `art/REVIEW.md`; the approved one is
copied to `ui/<name>.png` (SPEC.md "Per-character UI images"). Same Shippuden design and ~6.5-head
proportions as the sprites.

- Cut-in (`ui/cutin.png`, 480x128): {{eye description, expression, special eye state}}. The face
  fills the strip; a flat {{background band color: character color or dark navy}} may show only
  around the eyes/brows; no speed lines (the HUD adds them).
- Portrait (`ui/portrait.png`, 96x96): {{expression}}
- Select art (`ui/select.png`, 384x384): {{full-body pose; usually the intro or win pose}}
