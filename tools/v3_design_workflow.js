export const meta = {
  name: 'kippa-v3-design',
  description: 'Per-scene LucasArts layer/depth/animation design specs (foreground occluders, depth ramp, ambient anim)',
  phases: [ { title: 'LayerSpecs', detail: 'one agent per scene -> docs/layers/<id>.json' },
            { title: 'Direction', detail: 'art-director consolidation pass' } ],
};

const SCHEMA_NOTE = `Produce a JSON spec describing how to turn this single-plane painted scene into a LAYERED LucasArts scene
with real z-depth. Coordinates are LOGICAL 320x200 (x:0=left..319, y:0=top..199; the floor/walkable area is the lower part).
Write the file docs/layers/<id>.json with EXACTLY this shape:
{
  "id": "<sceneId>",
  "depth": { "horizon": <y where the floor starts, e.g. 150>, "nearScale": 1.15, "farScale": 0.7 },
  "plate_additions": "<short extra prompt text to regenerate the BACKGROUND PLATE: keep composition but REMOVE/!flatten the big foreground occluders (they become separate props) and add richer surreal LucasArts background detail & gags>",
  "props": [
    { "name":"<short_snake>", "role":"foreground"|"midground",
      "x":<logical center x>, "baseline":<logical y where it meets the floor — used for depth sort & to decide if the player passes behind it>,
      "scale":<approx fraction of frame height, 0..1>,
      "anim": { "type":"none"|"sway"|"bob"|"pulse"|"drift"|"frames", "amp":<px or deg>, "speed":<0.1..3>, "fps":<for frames> },
      "prompt":"<prompt to paint ONLY this element as a standalone transparent prop in the game's painted style, matching the scene's light>" }
  ],
  "ambient": [ { "what":"<e.g. fireplace flicker / clouds / water shimmer / window light>", "type":"frames"|"pulse"|"drift"|"sway", "where":"<x,y region or prop name>", "notes":"" } ],
  "bizarre": "<2-4 surreal LucasArts visual gags to add to this scene's art>",
  "walk_notes": "<any change to the walkable floor area vs the current walkbox>"
}
Rules: pick 1-3 FOREGROUND occluders the character can believably pass BEHIND (a tree trunk, a kiosk counter, a bed footboard,
foreground reeds/crops, a rocking chair). Their baseline should be in the lower third so the player passes behind when further back.
Be concrete with x/baseline by LOOKING at the painted background. Keep it realistic to implement.`;

const RET = { type:'object', additionalProperties:true, required:['id','ok'],
  properties:{ id:{type:'string'}, ok:{type:'boolean'}, props:{type:'number'}, notes:{type:'string'} }};

const SCENES = [
  ['room_red','js/scenes/scene01_room.js'],
  ['living_room','js/scenes/scene02_living.js'],
  ['hood','js/scenes/scene03_hood.js'],
  ['forest_edge','js/scenes/scene04_forest_edge.js'],
  ['deep_forest','js/scenes/scene05_deep_forest.js'],
  ['wolf_garden','js/scenes/scene06_wolf_garden.js'],
  ['river','js/scenes/scene07_river.js'],
  ['granny_ext','js/scenes/scene08_granny_ext.js'],
  ['granny_int','js/scenes/scene09_granny_int.js'],
  ['finale','js/scenes/scene10_finale.js'],
  ['intro','js/scenes/scene00_intro.js'],
];

phase('LayerSpecs');
const specs = await parallel(SCENES.map(([id,file]) => () => agent(
`You are designing the LucasArts z-depth LAYER plan for scene '${id}' of "כיפה ארסית".
Read the design doc docs/V3_DESIGN.md (the engine contract). Read the scene file ${file} for hotspots/exits/walkbox/puzzle.
VIEW assets/bg/${id}.png (the current painted background) and assets/layout/${id}.png with the Read tool to ground your coordinates.
${SCHEMA_NOTE}
Write docs/layers/${id}.json. Return {id:'${id}', ok:true, props:<count>, notes}.`,
  { label:`layers:${id}`, phase:'LayerSpecs', agentType:'general-purpose', schema:RET }
)));

phase('Direction');
const dir = await agent(
`You are the art director for "כיפה ארסית" v3 (LucasArts SCUMM). Read all of docs/layers/*.json.
Check the layer plans are consistent and implementable: every scene has a depth ramp, sensible foreground occluders with
believable baselines, and ambient animation. Flag any scene whose plan is weak, contradictory, or missing foreground depth,
and give a one-line fix. Also propose a consistent global depth feel (nearScale/farScale range) and a short list of the
strongest "bizarre LucasArts" gags to ensure land across the game. Return a concise text report.`,
  { label:'art-director-v3', phase:'Direction', agentType:'general-purpose' }
);

return { specs: specs.filter(Boolean), direction: typeof dir==='string'? dir.slice(0,1800): dir };
