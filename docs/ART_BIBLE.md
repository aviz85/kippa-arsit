# כיפה ארסית — ART BIBLE (per-scene composition guide for the 10 rooms)

This is the **visual contract** for every scene file. It keeps all 10 rooms (+ intro) feeling like one
cohesive late-80s SCI game (King's Quest IV / Police Quest vibe). Read it together with `CONTRACT.md`
(engine API + art rules) and `GAME_SPEC.md` (puzzle graph, IDs, flags). When in doubt, mirror the
canonical worked example `js/scenes/scene01_room.js`.

> **Edit ONLY your assigned scene file.** This doc is read-only guidance — do not change engine.js,
> sprites.js, items.js, story.js, or index.html.

---

## 0. THE GOLDEN RULES (apply to EVERY scene, no exceptions)

1. **Logical canvas is 320×200.** All coords are integers in `0..319` x, `0..199` y. Never use floats
   you didn't round.
2. **EGA-flat color only, from `GAME.C`.** Flat fills. The ONLY gradient allowed is `GAME.gradV` for
   sky/water. Everything else is a solid `GAME.rect` / `GAME.poly` / `GAME.ellipse`, optionally textured
   with `GAME.dither(a,b)`.
3. **1px black outlines on every readable object.** After you fill a shape, `GAME.box(...,C.black)` it,
   or trace edges with `GAME.line(...,C.black)`. Outlines are what make EGA art read. The player sprite
   has its own dark edges; your background objects must too.
4. **Chunky, few, readable shapes.** A late-80s room has ~6–12 hero shapes, not 50 tiny ones. Big silhouette
   first, 2–3 detail pixels second. If a detail is smaller than 2×2 px and not load-bearing, drop it.
5. **One consistent light direction: top-left.** Highlights on the top/left edge (lighter palette key),
   shadows on the bottom/right edge (darker key). Pick the pairs from §1.
6. **Horizon / floor line is sacred.** It must match the scene's `walkbox` top edge and `scale.horizon`
   so the player walks believably. See §2 for the standard bands.
7. **Hebrew text ONLY via `GAME.say/speak/choice`.** Never `ctx.fillText` Hebrew. Painted "text" in art
   (graffiti, signs) must be abstract glyph-blocks/scribbles, NOT real letters — describe the words in
   the `onLook` narration instead. Use `←` (not `→`) in any Hebrew string.
8. **Keep hotspots inside the walkbox-reachable zone**, or give them a `near:{x,y}` inside the walkbox.
9. **Paint order is bg → player → hotspot.draw.** Anything in a hotspot's `draw()` lands ON TOP of the
   player. Use that only for things that should occlude the player's feet (foreground props), otherwise
   paint the object in `drawBackground`.

---

## 1. PALETTE — the canonical pairs (`GAME.C`)

Full key list: `black white red darkRed pink brown tan skin gold yellow green darkGreen blue darkBlue
cyan gray ltGray dkGray purple orange steel moss night`.

Use these **fill / shadow / highlight triplets** so shading is consistent everywhere:

| Material | Base fill | Shadow (btm/right) | Highlight (top/left) |
|---|---|---|---|
| Sky (day) | `gradV(cyan → blue)` | `darkBlue` (far/low) | `white` (sun dots) |
| Sky (dusk/creepy) | `gradV(purple → night)` | `night` | `gold` (moon) |
| Grass / ground | `green` | `darkGreen` / `moss` | `yellow` flecks |
| Forest foliage | `darkGreen` | `moss` | `green` |
| Tree trunk / wood | `brown` | `darkRed`-ish via `brown`+dither | `tan` |
| Dirt path | `tan` | `brown` | — |
| Stone / wall / concrete | `gray` | `dkGray` | `ltGray` |
| Metal (knife, can, scooter) | `steel` | `dkGray` | `ltGray`/`white` glint |
| Water | `gradV(cyan → blue)` + `dither(blue,cyan)` ripples | `darkBlue` | `white` highlight line |
| Warm interior wall | `purple`/`brown`/`tan` + `dither` | darker sibling | — |
| Granny-evil accents | `darkRed`, `night`, `steel` | `black` | `red` |
| Wolf (friendly green-grey) | `gray` body, `green` accents | `dkGray` | `ltGray` |

**Texture trick (used in scene01):** lay a flat `rect`, then `dither(base, sibling)` over it for a
subtle EGA shimmer (e.g. walls, floor, foliage masses). Don't over-dither — large areas only.

**Sky call (memorize):** `GAME.gradV(ctx,0,0,320,90, C.cyan, C.blue)` for day exteriors.
**Creepy sky:** `GAME.gradV(ctx,0,0,320,95, C.purple, C.night)`.

---

## 2. THE STANDARD DEPTH BANDS (so the 10 rooms line up)

Pick ONE of two layouts per scene and keep the numbers consistent with your `walkbox`/`scale`:

**A. EXTERIOR (hood, forest, river, granny exterior, intro)**
- `y 0–90`   — **sky** (`gradV`). Horizon line at **y≈90**.
- `y 90–135` — **mid-ground band**: buildings / tree line / far bank. Big silhouettes, darker as they
  recede. Draw the black horizon line at the sky/ground seam.
- `y 135–200`— **foreground floor** the player walks on (grass/dirt/cobble). `walkbox` lives here,
  typically `{x:0,y:138,w:320,h:54}` or similar. `scale:{near:1.0, far:0.7, horizon:135}`.
- NPCs/objects sit with **feet on or just above the walkbox top edge**, scaled down the higher (farther)
  they stand.

**B. INTERIOR (living room, granny interior, finale, Red's room)**
- `y 0–150` — **walls** (flat fill + dither), with the back wall's baseboard/skirting line at **y≈150–158**.
- `y 150–200` — **floor** (wood/rug). `walkbox` e.g. `{x:18,y:160,w:288,h:32}` like scene01.
- `scale:{near:1.0, far:0.85, horizon:155}` (gentle — interiors are shallow).
- Furniture stands ON the floor band; tall items (shelves, knife wall) hang on the back wall above the
  skirting.

> Always draw `GAME.line(ctx, 0, FLOOR_Y, 320, FLOOR_Y, C.black)` at the floor seam — it's the single
> most important line for grounding the scene.

---

## 3. RECURRING MOTIFS (reuse for cohesion)

- **Trees**: trunk = `brown` rect + 1px `tan` left-highlight + black outline; canopy = stacked
  `darkGreen` ellipses, `green` top-left highlights, `moss` underside, black rim. Same recipe in
  forest_edge, deep_forest, wolf_garden, river, granny_ext — just vary count/density.
- **Israeli-hood detail**: dusty palm, AC units on buildings, scooter, kiosk, graffiti blocks, laundry
  lines. Warm/sunny.
- **Granny menace foreshadow**: any time granny's stuff appears (photo in living room, exterior cottage,
  interior), sneak in `darkRed`/`steel`/`night` and a too-sharp glint. The eye should feel "off" before
  the reveal.
- **Doors/exits**: frame with `box(...,C.black)`, a `gold` 3×4 handle, and inset panels (see scene01
  door). Put an exit where the matching arrow points (`arrow:'left'|'right'|'up'`).
- **Shadows under characters/objects**: `GAME.ellipse(ctx,cx,floorY,rx,2,'rgba(0,0,0,.3)')` — grounds them.

---

## 4. PER-SCENE COMPOSITION NOTES

For each: **layout band (A/B)**, horizon/floor, palette picks, where the player walks, where NPCs/objects
sit. Keep EXACT scene ids / exit targets / item ids / flag names from `GAME_SPEC.md`.

### INTRO (title / cold open — if implemented as a scene or onFirst sequence)
- **Layout A**, creepy-warm. Sky `gradV(purple → night)`, horizon y≈95. A lone path winding from a tiny
  lit house (left) toward a black forest tree-line (right) — visual promise of the journey.
- Foreground: a hand-painted "title plate" area in the lower third — but the TITLE TEXT must come through
  `GAME.say`, not painted letters. Paint only a decorative frame (`box` in `gold`, `darkRed` fill).
- Palette: `purple, night, gold` (moon, top-right, a `white`-cored `gold` disc), `darkGreen` tree-line,
  `tan` path, one warm `yellow` window dot in the house.
- No walking needed; if interactive, walkbox is irrelevant. Mood over detail.

### scene02 `living_room` — הסלון  (Layout B, interior)
- **Walls** `y0–152`: warm worn `tan`/`brown` wall, `dither(tan,brown)`. Skirting `darkRed` strip at
  y≈150. **Floor** `y152–200`: `brown` wood + a central `red`/`darkRed` **rug** (dithered) the player
  stands on. Floor seam line at y≈152. `walkbox:{x:14,y:158,w:292,h:36}`, `scale:{near:1,far:0.85,horizon:152}`.
- **Couch** (left, y≈120–155): `darkRed` body, `pink` cushions highlight, `brown` wooden legs, black
  outline. **CRT TV** (right of couch on a low stand): `dkGray` box, `cyan` screen with `white` scanline
  dither (telenovela glow). **Framed photo** on back wall: small `gold` frame, inside a tiny granny
  portrait with eyes drawn too intense (1–2 `darkRed` pixels for an unsettling stare) — foreshadow.
  **Window** with daytime `gradV(cyan,blue)`. **Kitchen doorway** (right or back): dark `dkGray`
  rectangle the mom stands beside.
- **NPC mom**: `GAME.drawSprite(ctx,'mom',MX,MY,...)` near the kitchen doorway, feet on walkbox top,
  facing into the room. (Sprite owned by sprites agent.)
- **Player walks** along the floor band between couch (left) and door-out (right). Exits: `back`→
  `room_red` (the bedroom door, arrow appropriate), `out`→`hood` (front door, gated `gotBasket &&
  hasMission`). Put the gated front door clearly on one side with an arrow.

### scene03 `hood` — השכונה  (Layout A, sunny exterior)
- Sky `gradV(cyan,blue)` y0–88, bright. Horizon y≈88. **Mid-ground** y88–135: 2–3 chunky apartment
  blocks (`gray`/`dkGray`, rows of `dkGray` windows with occasional `yellow`/`cyan` panes, `ltGray`
  top-left highlight edges, black outlines), AC boxes (`ltGray` squares). A dusty **palm tree** (brown
  trunk, `darkGreen`/`green` fronds). **Graffiti** = abstract `purple`/`orange`/`red` glyph-blocks on a
  wall (NO real letters — describe in onLook). **Foreground** y135–200: cracked `gray` cobble/sidewalk +
  `tan` dirt edge. `walkbox:{x:0,y:140,w:320,h:52}`, `scale:{near:1,far:0.72,horizon:135}`.
- **KIOSK stall** (right-center, on the sidewalk): `tan`/`brown` wooden booth, `orange` awning with
  `white` stripe dither, a counter ledge, snack/`seeds` packets as little `dkGray`/`gold` blocks. Place
  the kiosk so the player can reach the counter (`near` inside walkbox).
- **NPC neighbor** behind the kiosk counter: `GAME.drawSprite(ctx,'neighbor',...)`. **Scooter** parked
  foreground-left (`steel`/`red` body, black wheels, `ltGray` mirror) — Israeli hood staple.
- Exits: `back`→`living_room` (left, arrow:'left'), `fwd`→`forest_edge` (right toward the tree line,
  arrow:'right'). The forest hint: a sliver of `darkGreen` tree-line at the right horizon.

### scene04 `forest_edge` — כניסה ליער  (Layout A, transition street→forest)
- Sky y0–85 day, but cooler — `gradV(cyan,blue)` with more `darkBlue` low. Horizon y≈90. **Mid-ground**:
  the FIRST big trees on the right half (full tree recipe, dense `darkGreen`), the hood thinning out on
  the left (one last `gray` wall). A **dirt path** curves from lower-left into the trees (right).
  **Foreground** y135–200: `green` grass + `tan` path. `walkbox:{x:0,y:138,w:320,h:54}`,
  `scale:{near:1,far:0.7,horizon:135}`.
- **Chopping stump** (center-left, on grass): thick `brown` cylinder, `tan` top rings (concentric, drawn
  with a couple `tan`/`brown` ellipses), black outline. An **axe** stuck in it: `brown` handle + `steel`
  head with `ltGray` glint (TAKE = death/stop gag). **Log pile** (foreground-left): stacked `brown`
  cylinders, `tan` end-grain dots. **Sign "יער"**: a wooden board (`brown`, `tan` plank lines) on a post
  — paint abstract carved marks, the word lives in onLook.
- **NPC woodcutter** standing by the stump: `GAME.drawSprite(ctx,'woodcutter',...)`, feet on walkbox.
- Exits: `back`→`hood` (left, arrow:'left'), `fwd`→`deep_forest` (right into trees, arrow:'right').

### scene05 `deep_forest` — עומק היער  (Layout A, dense & dark)
- NO open sky — top band is **dense canopy**: fill `y0–70` with `darkGreen`, `moss` shadow clumps,
  scattered `green` highlights; let a few **light shafts** (thin `gradV` or pale `cyan`/`yellow` diagonal
  rects at low opacity feel) cut down. Horizon implied by the trunk bases at y≈130. **Mid-ground**:
  many twisted trunks (`brown`, `tan` highlight, black outline) of varying width creating depth; the
  bigger/lower = nearer. A **fork in the path**: the `tan` dirt path splits — one branch goes UP (to
  `wolf_garden`), one goes RIGHT (to `river`). **Foreground floor** y130–200: dark `moss`/`darkGreen`
  ground with `tan` path, a few **mushrooms** (`red` cap + `white` dots + `tan` stem — eat = death gag).
  `walkbox:{x:0,y:134,w:320,h:58}`, `scale:{near:1,far:0.65,horizon:130}`.
- **NPC wolf** sitting sadly on a fallen log (center): `GAME.drawSprite(ctx,'wolf',...)` — gentle grey/
  green palette, slumped pose if the sprite supports it. Optional **rabbit critter** that flees (small
  `ltGray`/`white` shape).
- Mood: this is the darkest exterior — lean on `darkGreen/moss/night` and keep highlights sparse so the
  later cottage feels like a continuation of the gloom.
- Exits: `back`→`forest_edge` (right? — keep arrow consistent with the path you painted; spec says
  back→forest_edge), `garden`→`wolf_garden` (UP branch, arrow:'up'), `fwd`→`river` (RIGHT branch,
  arrow:'right'). Make the two forward paths visually distinct so the player reads the fork.

### scene06 `wolf_garden` — הגינה של הזאב  (Layout A, surprisingly lovely)
- TONAL FLIP: brighter than deep_forest to signal safety. Sky peeking through canopy: a soft
  `gradV(cyan,blue)` slot at top, horizon y≈92. **Mid-ground**: the wolf's cozy **hut** (`brown` walls,
  `tan` highlights, `darkRed` little roof, `yellow` window dot, black outline) tucked among trees.
  **TALL sunflowers** along the back (`brown`/`green` stalks, `gold` flower discs with `brown` centers) —
  signature image of this room. A **scarecrow** (`tan` cross + straw `yellow` + a `brown` sack head).
  **Foreground**: neat **garden rows** — `brown` tilled soil strips with `green` carrot tops / `red`
  tomatoes / `green` lettuce in tidy lines. A **watering can** (`steel`, `ltGray` glint).
  `walkbox:{x:0,y:140,w:320,h:52}` (player walks the path between rows), `scale:{near:1,far:0.7,horizon:92}`.
- **NPC wolf** tending plants (standing, content). USE `seeds` on wolf/soil = `wolfFriend`, then he
  hands `evidence`. Visually keep the wolf approachable — green accents, soft outline.
- Palette picks: `green/darkGreen` veg, `gold/yellow` sunflowers, `brown/tan` soil & hut, `steel` can.
  Warm and friendly — the antithesis of granny's place.
- Exit: `back`→`deep_forest` (arrow per the path; spec: back only).

### scene07 `river` — הנהר והגשר  (Layout A, water hazard)
- Sky y0–80 day, horizon y≈85. **Far bank** y85–115: a strip of `green` grass + `darkGreen` tree-line +
  a `tan` path leading onward (toward granny). **The RIVER** y115–165: full-width `gradV(cyan,blue)` with
  `dither(blue,cyan)` ripples and a `white` highlight line; `darkBlue` in the deep center. **Reeds**
  (`darkGreen`/`green` vertical strokes) at the near edge. **BROKEN wooden bridge**: two `brown` plank
  decks reaching from each bank with a clear **GAP in the middle** over the deep water — black-outlined
  posts (`brown`), missing center span obvious. **Near bank / foreground** y165–200: `tan` dirt the
  player stands on. `walkbox:{x:0,y:168,w:320,h:30}` (near bank only — player CANNOT stand on water).
  `scale:{near:1,far:0.7,horizon:115}`.
- USE `plank` on the bridge gap → draw the center span filled in once `bridgeFixed` (in the hotspot
  `draw()`, check the flag and add the missing `brown` planks). Crossing without it / swimming = death.
- Exits: `back`→`deep_forest` (arrow per path), `fwd`→`granny_ext` (across the bridge to far bank,
  arrow:'up' or 'right'), **gated on `bridgeFixed`**.

### scene08 `granny_ext` — בית סבתא (חוץ)  (Layout A, creepy-cute)
- Sky shifts ominous: `gradV(blue, darkBlue)` or early-dusk `gradV(purple,night)` if you want it darker;
  horizon y≈90. **Mid/main**: the **cottage** dominating center-right — `tan`/`brown` walls with
  `dither`, a `darkRed` pitched roof, a **crooked chimney** (`gray`/`dkGray`, leaning, a wisp of `ltGray`
  smoke), a **locked door** (`brown`, `gold` handle, black outline, a `steel` lock plate), a **dark
  window** (`night` fill, a faint `steel` glint inside hinting at knives — onLook reveals taxidermy).
  **Foreground garden** y135–200: `green` grass, a **flower bed** (`red`/`pink`/`gold` dabs in a `brown`
  bed), a **garden GNOME** (small: `red` hat, `pink` face, `blue` body, white beard — the KEY hides
  under it), a **mailbox** on a post (`steel`/`red`, abstract name plate). `walkbox:{x:0,y:140,w:320,h:52}`,
  `scale:{near:1,far:0.7,horizon:90}`.
- Sneak `darkRed`/`steel`/`night` accents so the "cute" cottage reads subtly wrong (foreshadow).
- TAKE gnome → find `key`. USE `key` on door → set `grannyDoorOpen`.
- Exits: `back`→`river` (arrow per path), `in`→`granny_int` (the door, arrow:'up'), gated on
  `grannyDoorOpen`.

### scene09 `granny_int` — בית סבתא (פנים)  (Layout B, dim & menacing)
- **Walls** y0–150: dim interior, `dkGray`/`brown` + `dither`, low light. Skirting at y≈150. **Floor**
  y150–200: `brown` boards, a small worn rug. `walkbox:{x:16,y:158,w:288,h:34}`,
  `scale:{near:1,far:0.85,horizon:152}`.
- **Bed** (left): `brown` frame, `pink`/`white` covers with a lumpy "granny" silhouette under them
  (`GAME.drawSprite(ctx,'granny',...)` head on the pillow, sweet façade). **Fireplace** (back wall):
  `gray` stone, `orange`/`red`/`yellow` flickering flames inside, black outline. **WALL OF KNIVES**
  (the chilling centerpiece, back wall): a rack of `steel` blades with `ltGray`/`white` glints, `brown`
  handles, black outlines — neat rows, unmistakable. **Stuffed-animal trophy** (taxidermy): a mounted
  `brown`/`tan` creature with unsettling `white`+`black` eyes on the wall. **Table** with a **NOTE/list**
  (`white`/`ltGray` paper, abstract marks — the `evidence`-type list; onLook confirms `grannyTruth`).
  **Rocking chair** (`brown`).
- Palette leans `dkGray/brown/steel/darkRed`, with the fire's `orange/red/yellow` as the only warmth —
  and that warmth should feel sinister, not cozy.
- **NPC granny** in bed. TALK → classic inverted escalation + a `GAME.choice`. Exits: `back`→
  `granny_ext`, `fwd`→`finale`, require `grannyTruth`.

### scene10 `finale` — העימות  (Layout B, dramatic close-up)
- Same bedroom but **pushed in / dramatized**: tighter framing, **moonlight** pouring from the window
  (`night` sky outside, a pale `ltGray`/`white` moonbeam rect across the floor). The fire low. **Granny
  rising from the bed** revealing a **butcher KNIFE** (big `steel` blade, `ltGray`/`white` glint,
  `brown` handle, black outline — the hero prop of the scene). The **WOLF's silhouette** at the window/
  door (a dark `dkGray`/`night` outline with two faint `gold` eye dots — ambiguous until the win beat).
- Palette: `night/dkGray` darkness, `steel` knife, `ltGray/white` moonbeam, `darkRed` blood-free menace,
  `gold` for the wolf's eyes / the moment of rescue. Maximize contrast — this is the climax, keep it
  bold and readable, not busy.
- Mostly scripted via `say/speak/choice` (see GAME_SPEC §scene10). WIN if `wolfFriend && has('evidence')`
  → `GAME.win(...)`; else `GAME.die(...)`. Exit `back`→`granny_int` only before the showdown resolves.

---

## 5. CONSISTENCY CHECKLIST (run before you call `node --check`)

- [ ] Floor seam drawn as a black line at the documented FLOOR_Y, matching my `walkbox` top.
- [ ] `walkbox` + `scale.horizon` use the band numbers from §2 for my layout (A or B).
- [ ] Sky uses `gradV` with the §1 pair; no other gradients anywhere.
- [ ] Every hero object has a 1px black outline (`box`/`line`).
- [ ] Light is top-left (highlights top/left, shadows bottom/right) using the §1 triplets.
- [ ] All Hebrew goes through `GAME.say/speak/choice`; painted "text" is abstract glyphs only.
- [ ] Hebrew strings use `←`, never `→`.
- [ ] Scene `id`, exit `to:` targets, item ids, and flags are EXACTLY as in `GAME_SPEC.md`.
- [ ] Hotspots are reachable: inside walkbox or given a `near:{x,y}` inside it.
- [ ] NPCs drawn via `GAME.drawSprite(ctx, '<id>', ...)`, feet on the walkbox top, depth-scaled.
- [ ] Foreground props that should occlude the player live in a hotspot `draw()`; everything else is in
      `drawBackground`.
- [ ] Recurring motifs (trees, doors, shadows) follow the §3 recipes so the room matches its neighbors.

Cohesion comes from discipline: same bands, same light, same outlines, same palette triplets — across all
ten rooms. Paint flat, paint chunky, outline everything, and let `GAME.say` carry every Hebrew word.
