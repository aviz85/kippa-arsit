# כיפה ערסית — V3: True LucasArts SCUMM Overhaul (deep design)

Goal: turn the single-plane painted game (v2) into an authentic early-'90s **LucasArts SCUMM** adventure —
multi-layer scenes with real **z-depth** (the character walks *behind* foreground props and *in front* of others),
**ambient + character animation**, a **SCUMM verb interface**, a **custom cursor**, and richer, weirder, hand-painted art.
This requires BOTH new art AND substantial engine/UI code. v2 is preserved as its own commit.

## Pillars of the SCUMM feel (what we are recreating)
1. **Verb interface** — a wood/parchment panel at the bottom: verbs (Hebrew) on the left, an **inventory grid** of painted
   item icons on the right, and a **sentence line** that builds the action ("השתמש במפתח עם הדלת").
2. **Z-depth staging** — scenes are several planes: far background, the walkable floor, and **foreground occluders**
   (a tree, a counter, a bed footboard, reeds) that the character passes BEHIND. Depth is decided by a per-prop baseline.
3. **Depth scaling** — the character shrinks as she walks "into" the scene (scale ramps along the floor).
4. **Animation** — character **walk cycles** (multi-frame, per direction); **ambient** motion (fire flicker, swaying
   foliage, drifting clouds, water shimmer, blinking windows); subtle **NPC idle** (breath bob / blink).
5. **Custom cursor** — a LucasArts-style pointer that highlights interactables; the hovered object name feeds the sentence line.
6. **Bizarre, detailed art** — exaggerated cartoon proportions, surreal background gags, rich props. The "weird LucasArts" charm.

## Engine v3 architecture (code)

### Scene = layered prop graph
Replace the single `bg` draw with an ordered layer model per scene:
```
scene.layers = [
  { kind:'plate', img:'bg_<id>' },                                  // far background plate (full 320x200)
  { kind:'prop',  img:'prop_<id>_<name>', x, y, baseline, anim },   // midground/foreground element
  ...
]
scene.depth = { horizon, nearScale, farScale }                      // floor depth ramp for character scaling
```
- **Render order:** draw plate(s); then z-sort {props with baseline} + {player} + {NPCs} by their baseline-y ascending
  (smaller y = further back = drawn first). A prop with `baseline` above the player's feet → player draws in front;
  below → player draws behind. This is the classic painter's-algorithm depth interleave.
- **baseline** = the y (logical) where the prop "touches the floor"; used both for sort and (optionally) its own scale.
- Props can be foreground occluders (big tree, kiosk counter) OR animated set-dressing.

### Animation system
- `anim` on a prop/sprite, evaluated each frame from a global clock `t`:
  - `sway`   : gentle rotation `±deg * sin(t*spd + phase)` around the prop's base (foliage, signs).
  - `bob`    : vertical `±px * sin` (idle NPCs, hanging things).
  - `pulse`  : alpha/scale shimmer (water glints, glow).
  - `drift`  : looping translate (clouds, smoke) with wraparound.
  - `frames` : true frame loop — array of images cycled at `fps` (fire, candle, blinking eyes, water).
- Character **walk cycle**: player/NPC sprite becomes `frames` per direction (e.g. `spr_red_side_0..3`); the engine
  advances the frame while `moving`, holds frame 0 when idle. Down/up/side(+mirror for left).
- A single global `requestAnimationFrame` clock already exists; add `GAME.t` (ms) and a frame scheduler.

### SCUMM UI (DOM + canvas, restyled)
- **Verb panel** (bottom): painted wood panel background; Hebrew verbs as a grid of styled buttons:
  הסתכל · דבר · קח · השתמש · פתח · תן · דחוף · משוך (subset wired to the puzzles; extras are flavor).
- **Sentence line** (one line above the panel): live action string from {current verb}+{hovered object}+{selected item}.
  e.g. "הסתכל על המיטה", "תן עוגיה ל…", "השתמש במפתח עם הדלת".
- **Inventory grid**: painted slots showing item icons; selecting an item sets the "with X" part of the sentence.
- **Cursor**: CSS `cursor:url(assets/ui/cursor.png)`; swap to a "hot" cursor over interactables; object name → sentence line.
- Default-verb on hover (SCUMM-ish): right-click / quick-click = "look"/"walk"; left-click applies selected verb.

### Backward-compatible/progressive
- Keep v2's single-plate fallback: a scene with only a `plate` layer renders exactly like v2.
- `keepDraw` procedural fallback stays for any un-arted element.

## Art pipeline for v3 (generation)

### Per-scene LAYER PLAN (design workflow output, one per scene)
A structured spec: which elements are the **plate** vs **foreground occluders**; each occluder's name, rough x/baseline,
and animation; ambient animations; and "bizarre detail" notes. Drives the art + integration workflows.

### Generating layers (consistency via reference)
- **Plate**: regenerate the background *without* the big foreground occluder(s) and with richer surreal detail,
  referencing the v2 bg (for composition) + style key (for style). Keeps the floor open where props will sit.
- **Foreground props**: generate each occluder as a standalone transparent element by **referencing the scene plate**
  ("paint ONLY the big foreground <tree/counter/bed-foot> for this scene, same style & light, on solid #00FF00") → chroma-key.
  Referencing the plate keeps lighting/style/scale matched.
- **Animated frames** (fire, candle, water, blinking): generate 2–4 frames as a tiny set on green, key each.
- **Walk cycles**: per character/direction, generate 3–4 walk frames using the existing sprite as the identity anchor;
  content-slice if a sheet, else separate gens; verify per-frame bbox/height consistency so the feet stay anchored.
  Fallback: if frames jitter, keep the single sprite + procedural step (bob+squash) so animation still reads.
- **SCUMM UI art**: a painted wood/parchment verb-panel texture, inventory-slot frame, and a cursor (normal + hot).

### Deterministic verification (extend imgproc)
- props/frames: alpha present, tight bbox, consistent height across a frame-set (for walk cycles: assert all frames
  within ±N% height and feet-x within tolerance so the cycle doesn't wobble).
- plates: exact 1280×800, opaque.
- layer-fit check: composite plate+props headlessly and confirm no hard seams / full-frame coverage.

## Orchestration (many agents → sub-agents → sub-sub-agents)
Sequential workflows (serialized to respect the image-model rate limit), each fanning out:
1. **DESIGN** workflow — per-scene layer/animation/bizarre-detail specs (+ a global art-director pass). (no/low API)
2. **ENGINE v3** — I build the layered renderer, depth sort, animation system, SCUMM UI, cursor, walk-cycle support.
3. **PLATES + PROPS** workflow — per scene: regenerate plate, then generate its foreground props (sub-agents per prop),
   process + verify, self-review via vision, regen outliers.
4. **ANIMATION** workflow — walk cycles per character (sub-agents per direction), ambient frame-sets, verify cycle consistency.
5. **UI** workflow — verb panel, cursor, inventory frame art.
6. **INTEGRATE** workflow — per scene: wire layers, baselines, depth ramp, animations into scene files; wire SCUMM UI/cursor.
7. **QA** workflow — vision playthrough: depth-sort correctness (player behind/in-front), animation, UI usability, winnability;
   regen/fix outliers.

Each generation step uses genimg (429 backoff) + imgproc (deterministic checks) + agent vision review + bounded regen.
Commit after each major phase so every version is preserved.
