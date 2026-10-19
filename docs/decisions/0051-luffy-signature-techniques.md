# 0051: Luffy's signature techniques: rubber limbs, a palette swap on the body, and super options

**Status:** Accepted (user request, 2026-10-18)
**Date:** 2026-10-18
**Task:** ENG-SKL-LUF (engine), ART-SKL-LUF (art, Codex chat "5 - Skills Effects")
**Builds on:** [ADR 0044](0044-signature-techniques.md) (HD effect cells, `blastFx`), [ADR 0047](0047-sasuke-signature-techniques.md)
(technique data on moves, shots and supers), [ADR 0032](0032-goku-and-luffy-kits.md) (his kit, `laneStrike`)

## Context

After Naruto and Sasuke the user asked for the same revamp of Luffy. In game (2026-10-18) the Gum-Gum Pistol's fist was
the shared `orb` tile (a blue-white swirl) and its arm barely stretched; the Bazooka, Rocket and Whip had no strips, so
he threw the Pistol's punch or crouched, and no leg ever stretched; every big hit was the white explosion; Gear Second
was pink flame tongues round a normal-skinned body; Jet Gatling was one fist per hit under white rings; and the Gigant
Pistol's "giant fist" was the `orb`, which the approved HD art had turned into Naruto's blue Rasengan, behind smoke
puffs that hid the inflating arm. The user's answers (question box, 2026-10-18): stay in the Enies Lobby era with
Gear Third and a chibi Luffy after it, Jet Gatling as a storm of fists ending in a Jet Bazooka, Gear Second with pink
skin, steam and the JET moves, and all four specials revamped.

## Decision

Everything is data read by shared code (CLAUDE.md rule 4), view-only where it can be:

1. **Rubber limbs.** A limb longer than the 256 px cell leaves the cell in its strip, and the strip's `hand` anchor sits
   where it leaves. The engine carries it on from there with a tube effect drawn pointing screen-right and stretched
   between two points (`Effects.limb`; its tube's share of the cell height says how to scale it to the limb's
   thickness) and its end (`Effects.limbEnd`: the fist). A projectile's `limb` (the shared piece, ENG-SKL-LIMB) draws the arm
   from the drawn hand to the shot and snaps its `end` (the fist) back to the hand when the shot ends (`ShotViews`,
   render clock; Killua's yo-yo string is a thin `limb` too); a rush's `sweep` lays a limb once its active frames start (the Whip); a dive's `grab` draws the arms up to what they grabbed (the Rocket)
   and `launchFx` snaps at the take-off; a `laneStrike`'s `arm` draws the giant arm and fist down the lane.
2. **Palette swap on the body.** The sprite shader swaps up to 8 exact sheet colours (`SpriteActor.setRecolor`),
   matched in sRGB bytes within 2 levels (the GPU's sRGB decode is a little off three.js's). A fighter's `recolor`
   table names the swaps; a mode or a super picks one by name (`recolor: 'gear2'`). Gear Second turns his packed skin
   colours into the pinks of his approved Gear Second frames in every animation, with no redraw. A placeholder bake has
   none of those colours and stays as it is.
3. **Mode look and names**, read through the shared `kit.modeLook` (the Goku session's mode visuals: `shell`, `tint`,
   `aura`, `burstFx`) from the move data, never from `f.mode`: `recolor` (above), `ghost` (an afterimage every that many
   frames while he moves) and `names` (the moves it renames in callouts and combo chips: GUM-GUM JET PISTOL). Gear
   Second's steam is an `aura`, its burst a `burstFx` with `center`, and `fx: 'none'` drops the element burst and the
   mode's crackle.
4. **Flurry options.** `flashPose` (shared), `fists` (an effect held between him and the target while the blows land),
   `hitFx` naming any effect, `hitScale`, `hitSpark`, `finalPose`, `finalSpark`, `finalCallout` and `finalFx` as a blast
   (`{ fx, scale, smoke }`). A super may carry `recolor` and `aura` while it runs (modeLook reads the running kit move).
5. **laneStrike options.** `windupOnce` (the windup strip played once through instead of looping), `windBack` (the
   strike strip's f0 for the last windup frames, no timing change), `puff` (effects at `[frame, forward, up]` on the
   windup), `arm`, `blastFx`, `hitRecovery` (a longer recovery after a hit, while the victim is still flying) and `after`
   (an effect that stands in for the body through the recovery once the arm is back; `SpriteActor.veil` hides the
   sprite mesh for the view only, never the saved visibility).
6. Fourteen HD effect names (`gumArm`, `gumFist`, `gumImpact`, `bazookaBlast`, `rocketSnap`, `whipSweep`, `gear2Steam`,
   `gear2Burst`, `gatlingFists`, `gear3Puff`, `gigantArm`, `gigantFist`, `gigantImpact`, `luffyChibi`) with procedural
   stand-ins until Codex's art is approved; `gumArm` and `gigantArm` are tile strips (exact 256 px frames).

## Consequences

- Frame data and damage are unchanged, except the Gigant Pistol's recovery after a hit (30 → 54 frames, while the
  victim is launched into the wall) and the slow-motion beat the smash spark gave the Rocket's slam, the Jet Bazooka
  and the Gigant Pistol (a hit with `blastFx` has none, as for Sasuke's techniques).
- The two determinism fixtures (no Luffy) still replay frame for frame, rollback stress included; they are re-recorded
  at merge on the new simulation fingerprint.
- Any fighter can reuse the pieces: a stretched limb (any rubber or extending attack), a palette swap (a Kaio-ken red
  flush, a Super Saiyan hair colour) and the super options.
- Until Codex's strips land, the Bazooka, Rocket and Whip keep their stand-in poses (the Pistol's and the crouch), the
  Pistol's arm leaves the v02 strip's fist and the giant arm the v02 strike; the effects are procedural.
- Found on the way, not changed here: `Effects.span` (Sasuke's Chidori Spear blade) sizes its quad by `len / (cell
  width x fill)` instead of `len / fill`, so the blade draws at about 45 % of its `len` (reported to the skills hub).
