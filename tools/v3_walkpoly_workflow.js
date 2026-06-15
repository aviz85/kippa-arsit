export const meta = {
  name: 'kippa-v3-walkpoly',
  description: 'Give exterior scenes depth-spanning floor-polygons (walk front<->back on the real ground, exclude obstacles)',
  phases: [ { title: 'Walkpoly', detail: 'one agent per exterior: trace a floor polygon via the headless overlay, iterate' } ],
};

const SCENES = [
  ['deep_forest', 'Floor = the winding dirt PATH + the open clearing. Let Red walk from the front clearing UP the path into the trees. EXCLUDE: the big foreground tree trunks (left/right), dense foliage, and anything above the treeline. The path narrows as it recedes.'],
  ['hood', 'Floor = the ROAD + sidewalk. Let Red walk from the front up the street toward the back (the road narrows with perspective). EXCLUDE: the buildings, the kiosk footprint, the raised sidewalks beyond the curb, and the far background. Keep within the paved area.'],
  ['forest_edge', 'Floor = the dirt/asphalt PATH from the front into the forest. Let Red walk front->back along it. EXCLUDE: tree trunks, the log pile, the chopping stump, dense undergrowth.'],
  ['granny_ext', 'Floor = the grassy YARD + the stone path to the door. Let Red roam the yard and approach the cottage door. EXCLUDE: the cottage footprint/walls, the flower bed, and the dense forest edges.'],
  ['wolf_garden', 'Floor = the front GRASS strip + the dirt AISLES between the planted crop beds. Let Red walk the front and up an aisle toward the back fence. EXCLUDE: the planted crop rows themselves (carrots/tomatoes), the fence, and the hut footprint.'],
];

const RET = { type:'object', additionalProperties:true, required:['id','ok'],
  properties:{ id:{type:'string'}, ok:{type:'boolean'}, points:{type:'number'}, rounds:{type:'number'},
    depthTuned:{type:'boolean'}, notes:{type:'string'} }};

phase('Walkpoly');
const res = await parallel(SCENES.map(([id, brief]) => () => agent(
`Give scene '${id}' of "כיפה ערסית" a depth-spanning WALKABLE FLOOR POLYGON so Red can walk front<->back on the real ground.
Work in project root. Logical coords are 320x200 (x:0-319, y:0-199); the floor is the lower part of the frame.

GOAL: ${brief}

TOOL — headless overlay (no browser): the polygon is read from docs/layers/${id}.json field "walkpoly" (array of [x,y] points).
  node tools/render_scene.mjs ${id}
  -> writes /tmp/preview_${id}.png showing: the scene + your polygon (cyan fill / magenta outline) + Red drawn at FRONT,
     MID and BACK sampled INSIDE the polygon (so you see coverage AND depth-scaling).

ITERATE (Bash + Read + Edit):
1) Edit docs/layers/${id}.json: add/adjust "walkpoly": a single polygon (8-16 points, ordered around the boundary) that covers the
   walkable ground from the FRONT edge (near y=196) back to where the ground meets the obstacles, hugging the path/floor shape and
   EXCLUDING everything in the GOAL's exclude list. Wider at the front, narrower toward the back (perspective).
2) node tools/render_scene.mjs ${id}  then Read /tmp/preview_${id}.png.
3) Check: does the cyan area sit ONLY on walkable ground (no water/walls/crops/foliage)? Do the 3 Red figures stand ON the ground
   and shrink naturally front->back? Is the front wide and the back narrow? Refine the points and repeat.
4) DEPTH: if Red looks wrong-sized at the back vs front, also tune docs/layers/${id}.json "depth" {horizon, nearScale, farScale}
   (horizon should sit at/above the back of the walkable area; nearScale ~1.1-1.5, farScale ~0.5-0.8). Re-render to confirm.
Do 4-7 rounds until it reads naturally. Keep exits reachable (don't carve the polygon away from the scene's exit areas).

Return {id:'${id}', ok:true, points:<count>, rounds, depthTuned, notes}.`,
  { label:`walkpoly:${id}`, phase:'Walkpoly', agentType:'general-purpose', schema:RET }
)));
return { results: res.filter(Boolean) };
