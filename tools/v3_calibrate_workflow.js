export const meta = {
  name: 'kippa-v3-calibrate',
  description: 'Calibrate per-scene prop proportions (units) + baselines against the character via headless preview render',
  phases: [ { title: 'Calibrate', detail: 'one agent per scene: render -> view -> tune units/baseline -> repeat' } ],
};

const ALL = ['room_red','living_room','hood','forest_edge','deep_forest','wolf_garden','river','granny_ext','granny_int','finale','intro'];
const ids = (Array.isArray(args) && args.length) ? args.filter(x=>ALL.includes(x)) : ALL;

const RET = { type:'object', additionalProperties:true, required:['id','ok'],
  properties:{ id:{type:'string'}, ok:{type:'boolean'}, rounds:{type:'number'},
    props:{type:'array', items:{type:'object', additionalProperties:true, properties:{name:{type:'string'}, units:{type:'number'}, baseline:{type:'number'}}}},
    notes:{type:'string'} }};

phase('Calibrate');
const res = await parallel(ids.map(id => () => agent(
`Calibrate the foreground-prop PROPORTIONS for scene '${id}' of the LucasArts adventure "כיפה ארסית". Work in project root.

THE PROBLEM you are fixing: the props were sized by rough guesses and look "pasted" / wrong-scale. You will tune each prop's
size so it is believable relative to the CHARACTER.

THE MODEL: the character (Red) is the scale UNIT = 1.0 character-height. Each prop in docs/layers/${id}.json has a numeric
"units" field = the prop's real-world height in character-heights. The engine renders height = units * 64 * perspectiveScale(baseline).
Realistic guides: a person =1.0 ; a chair ~1.0-1.3 ; a kiosk/market stall ~1.8-2.4 ; a motor-scooter ~0.9-1.2 ; a couch (height) ~0.8-1.0 ;
a CRT TV ~0.6-0.8 ; a bed footboard ~0.6-0.8 ; a fallen log ~0.7-1.2 ; a garden gnome ~0.4 ; a watering can ~0.3 ; a flower bed ~0.4 ;
reeds/grass tuft ~0.6-1.0 ; a boulder cluster ~0.8-1.2 ; a scarecrow ~1.4-1.7 ; a palm/forest tree ~3.0-5.0 ; a rug (flat, midground) ~0.5.

ITERATE (use the Bash + Read + Edit tools):
1) Render a preview that shows the scene with Red drawn at a FRONT (large) and a MID (smaller) position for scale reference:
     node tools/render_scene.mjs ${id}
   Then Read /tmp/preview_${id}.png.
2) Judge each prop vs the two Red figures: is it the believable real-world size? does its base sit on the floor (baseline) at a
   sensible spot, not floating or sunk? is it placed at a good x (not overlapping Red's walking lane / the exits)?
3) Edit docs/layers/${id}.json: set/adjust each prop's "units" (add the field if missing), and fix "baseline"/"x" if the prop
   floats or sits wrong. Keep edits to units/baseline/x only; do not change names/anim/layer/depth.
4) Re-render and re-view. Repeat 3-5 rounds until proportions read naturally (props look like they belong in the world with Red).
Foreground occluder trees may extend above the frame — that's fine (units 3-5). Midground/flat items (rugs) keep small units.

Return {id:'${id}', ok:true, rounds, props:[{name, units, baseline}...], notes}.`,
  { label:`calib:${id}`, phase:'Calibrate', agentType:'general-purpose', schema:RET }
)));
return { results: res.filter(Boolean) };
