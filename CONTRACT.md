# כיפה ערסית — Engine Contract (READ FIRST, conform exactly)

A Sierra-style (late-80s SCI) point-and-click adventure. Vanilla JS + HTML5 Canvas, **no build step**.
Logical scene resolution is **320×200**, integer-upscaled. UI chrome is HTML around the canvas.
Language: **Hebrew, RTL**. Comedy tone. Palette is fixed EGA-ish 16+ colors.

## Global engine API (already implemented in `js/engine.js`)

Everything hangs off the `GAME` global.

### Drawing helpers (pixel-art DSL) — use these in `drawBackground` / `draw` / sprites
All coords are logical (0..319 x, 0..199 y). `ctx` is the 320×200 buffer context.

- `GAME.px(ctx, x, y, color)` — one pixel
- `GAME.rect(ctx, x, y, w, h, color)` — filled rect
- `GAME.box(ctx, x, y, w, h, color)` — 1px outline
- `GAME.line(ctx, x0, y0, x1, y1, color)` — Bresenham line
- `GAME.gradV(ctx, x, y, w, h, colorTop, colorBottom)` — vertical 2-color dither gradient (sky)
- `GAME.dither(ctx, x, y, w, h, colorA, colorB)` — 50% checker fill
- `GAME.ellipse(ctx, cx, cy, rx, ry, color)` — filled ellipse
- `GAME.poly(ctx, points, color)` — filled polygon, points = [[x,y],...]
- `GAME.text(ctx, str, x, y, color, opts)` — tiny bitmap-ish text (uses canvas font); RTL-safe
- `GAME.C` — the palette object. Keys: `black white red darkRed pink brown tan skin gold yellow green darkGreen blue darkBlue cyan gray ltGray dkGray purple orange`. Each is a CSS hex string.

### State
- `GAME.flag(name)` → value (default false/undefined) · `GAME.setFlag(name, val)`
- `GAME.has(itemId)` → bool · `GAME.give(itemId)` · `GAME.take(itemId)` (removes)
- `GAME.score(points, reason)` — add to score (idempotent per reason; same reason won't double-count)
- `GAME.state` — free-form object for scene-local persistence

### Flow / output
- `GAME.say(text)` — narration line (the white message bar). Queue multiple; player clicks/space to advance.
- `GAME.speak(speaker, text, color)` — character speech (shows "speaker: text", colored).
- `GAME.choice(promptText, options)` — dialogue menu. `options = [{label, action}]`. RTL.
- `GAME.goto(sceneId, entry)` — change scene. `entry` optional `{x,y,dir}`.
- `GAME.die(text)` — Sierra death screen ("מת/ה!"), offers Restore/Restart.
- `GAME.win(text)` — victory screen.
- `GAME.walkTo(x, y, cb)` — walk player to point then run cb (used by hotspot handlers that need proximity).
- `GAME.playerAt()` → `{x,y}` current player feet position.
- `GAME.sfx(name)` — play a chiptune sfx by name (see js/engine.js SFX list). Safe no-op if unknown.

### The current verb
- `GAME.verb` is one of `'walk' 'look' 'talk' 'take' 'use'`. When a hotspot is clicked the engine
  calls the matching handler. With `use` + a selected inventory item, `onUse(item)` fires.

## Scene object schema — each `js/scenes/sceneXX.js` calls `GAME.registerScene({...})`

```js
GAME.registerScene({
  id: 'room_red',                 // unique snake_case
  name: 'החדר של כיפה',           // Hebrew, shown in top bar
  music: null,                    // optional sfx loop id or null
  entry: { x: 160, y: 170, dir: 'right' }, // default spawn (feet position)
  walkbox: [ { x:0, y:150, w:320, h:50 } ],// rects the player feet may stand in (floor)
  scale: { near: 1.0, far: 0.6, horizon: 150 }, // optional pseudo-depth scaling; omit for flat 1.0

  drawBackground(ctx) { /* paint the room with GAME.px/rect/... */ },

  // objects painted ON TOP of player are rare; default paint order is bg -> player -> hotspot.draw
  hotspots: [
    {
      id: 'bed', name: 'המיטה',
      rect: { x: 20, y: 120, w: 80, h: 40 },   // click target (logical)
      draw(ctx) {},                            // optional, drawn over background
      onLook()  { GAME.say('מיטה לא מסודרת. אמא הייתה מתה.'); },
      onTake()  { GAME.say('מה אני אקח, מיטה? סבבה לוקיישן.'); },
      onUse(item){ /* item is an inventory id string or null */ },
      onTalk()  { GAME.say('דיברת עם מיטה. הכל טוב?'); },
      near: { x: 60, y: 160 },                  // optional: walk here first before handler fires
    }
  ],

  exits: [
    { id:'door', name:'הדלת', rect:{x:280,y:80,w:40,h:90}, to:'living_room',
      entry:{x:40,y:170,dir:'right'}, arrow:'right',
      // OPTIONAL gating: player walks to the exit, then gate() is checked.
      gate(){ return GAME.has('basket'); },          // if false -> stays
      gateFail(){ GAME.MOM('בלי הסל את לא זזה!'); },   // message shown when blocked
    }
  ],

  onEnter() {},   // runs each time scene becomes active
  onFirst() {},   // runs only the first time ever
});
```

## Sprites (`js/sprites.js`)
Register a character drawer: `GAME.registerSprite('red', { w, h, draw(ctx, x, y, frame, dir, scale) })`.
`x,y` = feet center (bottom-center). `dir` ∈ `'left'|'right'|'up'|'down'`. `frame` increments while walking.
Player sprite id is `'red'`. NPCs are drawn by scenes via `GAME.drawSprite(ctx, spriteId, x, y, frame, dir, scale)`.

## Items (`js/items.js`)
`GAME.registerItem('basket', { name:'הסל', desc:'סל קש עם חטיפים.', draw(ctx,x,y,s){} })`.
`draw` paints a ~16×16 icon at top-left x,y.

## Art rules (keep it consistent across all scenes)
- EGA-flat colors only from `GAME.C`. No gradients except `GAME.gradV` for sky.
- Outdoor sky = `GAME.gradV(ctx,0,0,320,90, GAME.C.cyan, GAME.C.blue)` style. Ground meets sky ~y=90-150.
- Black 1px outlines on key objects. Chunky, readable shapes. Think King's Quest IV / Police Quest.
- Horizon/floor line consistent so the player can walk and scale with depth.
- Keep important hotspots inside the walkbox-reachable area.
- Hebrew text via `GAME.say/speak/choice` only — never raw fillText (RTL handled centrally).

## Load order (index.html)
engine.js → sprites.js → items.js → story.js → scenes/*.js → boot.js (calls GAME.start('room_red')).
