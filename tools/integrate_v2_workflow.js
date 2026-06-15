export const meta = {
  name: 'kippa-integrate-v2',
  description: 'Make NPC/item sprites render correctly over the painted backgrounds (keepDraw flags, relocate draws, finale beast reveal)',
  phases: [ { title: 'Integrate', detail: 'one agent per scene with NPC/item draws' } ],
};

const RULE = `CONTEXT: The game "כיפה ערסית" now uses painted PNG backgrounds. The engine render rules changed:
  - When a painted background exists for a scene, the engine SKIPS the scene's drawBackground() entirely.
  - It also SKIPS each hotspot's draw() UNLESS that hotspot has the property  keepDraw:true.
  - NPCs and world-items are drawn via GAME.drawSprite(...) / GAME.itemDef('x').draw(...). These MUST still appear.
YOUR JOB for the assigned scene file:
  1) Make sure EVERY GAME.drawSprite(...) (NPCs/player extras) and every GAME.itemDef('...').draw(...) (world items)
     renders on top of the painted bg. Concretely: each such call must live inside a hotspot's draw(), and that hotspot
     must have  keepDraw:true  added as a property.
  2) If any GAME.drawSprite/itemDef draw currently lives inside drawBackground() (which is now skipped), MOVE that specific
     draw call into the matching interactive hotspot's draw() (the one you talk-to / take), adding keepDraw:true. Do not delete
     the hotspot's handlers.
  3) Do NOT change puzzle logic, flags, item ids, exits, hotspot rects, dialogue, or any text. Keep everything else intact.
  4) Keep the procedural drawBackground() function in the file (it's the fallback) — just don't worry about it.
  5) Run \`node --check <file>\` until clean.
Return {file, flagged:[hotspot ids you set keepDraw on], moved:[...], notes}.`;

const RET = { type:'object', additionalProperties:true, required:['file'],
  properties:{ file:{type:'string'}, flagged:{type:'array',items:{type:'string'}}, moved:{type:'array',items:{type:'string'}}, notes:{type:'string'} }};

const SCENES = [
  ['js/scenes/scene01_room.js','room_red','World item: the basket on the floor (basket_spot hotspot draws GAME.itemDef("basket")). Flag it keepDraw so the painted basket icon shows.'],
  ['js/scenes/scene02_living.js','living_room','NPC: mom (GAME.drawSprite "mom"). Flag her hotspot keepDraw. She should stand near the kitchen on the painted floor.'],
  ['js/scenes/scene03_hood.js','hood','NPC: neighbor at the kiosk (GAME.drawSprite "neighbor"). Flag keepDraw.'],
  ['js/scenes/scene04_forest_edge.js','forest_edge','NPC: woodcutter (GAME.drawSprite "woodcutter"). Flag keepDraw.'],
  ['js/scenes/scene05_deep_forest.js','deep_forest','NPCs: wolf and critter (GAME.drawSprite). Flag both hotspots keepDraw.'],
  ['js/scenes/scene06_wolf_garden.js','wolf_garden','NPC: wolf tending the garden (GAME.drawSprite "wolf"). Flag keepDraw.'],
  ['js/scenes/scene09_granny_int.js','granny_int','NPC: granny in bed (GAME.drawSprite "granny"). Flag keepDraw.'],
  ['js/scenes/scene10_finale.js','finale','NPC: granny rising from bed. Flag keepDraw. SPECIAL: when the showdown phase reaches knife-revealed (the code uses a phase variable, e.g. st.t>=2 / phase>=2), draw the sprite id "granny_beast" instead of "granny" so the menacing knife form shows at the reveal. Keep the lying/sitting earlier phases as "granny".'],
  ['js/scenes/scene00_intro.js','intro','The intro draws a tiny red player on the vista. The intro now has a painted vista background. If the small red sprite over the painted vista looks out of place, you may remove that single GAME.drawSprite("red",...) call from the intro (the intro is a brief cutscene that auto-advances). Keep the narration/onEnter goto logic intact.'],
];

phase('Integrate');
const res = await parallel(SCENES.map(([file,id,note]) => () => agent(
`${RULE}\n\nASSIGNED SCENE: ${file} (id='${id}').\nView the painted background at assets/bg/${id}.png with the Read tool to sanity-check NPC placement on the visible floor (you may nudge a drawSprite x,y slightly so the character stands on the ground, but keep it minimal).\nScene-specific note: ${note}\nReturn {file, flagged, moved, notes}.`,
  { label:`integrate:${id}`, phase:'Integrate', agentType:'general-purpose', schema:RET }
)));
return { results: res.filter(Boolean) };
