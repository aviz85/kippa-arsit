export const meta = {
  name: 'kippa-v3-plates-props',
  description: 'Regenerate background PLATES (foreground removed, richer detail) + generate foreground PROP layers per scene',
  phases: [ { title: 'PlatesProps', detail: 'one agent per scene: plate + N foreground props from its layer spec' } ],
};

const STYLE = `Hand-painted late-1990s LucasArts adventure art (Curse of Monkey Island / Day of the Tentacle quality): bold clean dark ink outlines, soft cel-shading, warm saturated palette, rich painterly depth. Match the style of reference image #1 (style key) exactly so everything is one cohesive game.`;

const ALL = ['room_red','living_room','hood','forest_edge','deep_forest','wolf_garden','river','granny_ext','granny_int','finale','intro'];
const ids = (Array.isArray(args) && args.length) ? args.filter(x=>ALL.includes(x)) : ALL;

const RET = { type:'object', additionalProperties:true, required:['id','ok'],
  properties:{ id:{type:'string'}, ok:{type:'boolean'}, plate_ok:{type:'boolean'},
    props:{type:'array', items:{type:'object', additionalProperties:true, properties:{ name:{type:'string'}, ok:{type:'boolean'} }}},
    notes:{type:'string'} }};

phase('PlatesProps');
const res = await parallel(ids.map(id => () => agent(
`Generate the LAYERED art for scene '${id}' of "כיפה ערסית" (LucasArts v3). Work in project root.
Read the layer spec docs/layers/${id}.json (it has: plate_additions, and props[] each with {name, prompt, ...}).

=== STEP 1: BACKGROUND PLATE (foreground removed) ===
Regenerate the scene as a clean plate so the foreground props can overlay it WITHOUT duplicates.
  node tools/genimg.mjs --out assets/raw/plate_${id}.png --aspect 3:2 --size 2K --ref assets/style/style_key.png,assets/bg/${id}.png --prompt "${STYLE} This is a BACKGROUND PLATE. Keep the SAME composition, camera, horizon and perspective as reference image #2. <plate_additions from the JSON>. CRITICAL: REMOVE the foreground occluder objects named in the spec's props (they become separate layers) and paint clean ground / wall / space where they were, so nothing is duplicated. Add richer surreal LucasArts background detail and gags. NO characters/people/animals, NO readable text/letters, NO UI, NO border. Fill the whole frame."
  node tools/imgproc.mjs bg --in assets/raw/plate_${id}.png --out assets/bg/${id}.png --w 1280 --h 800
  node tools/imgproc.mjs verify --in assets/bg/${id}.png --w 1280 --h 800 --alpha 0   (must be ok:true)

=== STEP 2: FOREGROUND PROPS ===
For EACH prop in the spec's props[] array, generate it as a standalone transparent element matched to the plate's light:
  node tools/genimg.mjs --out assets/raw/prop_${id}_<name>.png --aspect <pick 2:3 for tall things like trees, 3:2 for wide things like counters/logs, else 1:1> --size 2K --ref assets/bg/${id}.png,assets/style/style_key.png --prompt "<the prop's 'prompt' from the JSON>. Paint ONLY this single element as a standalone foreground prop in the game's hand-painted LucasArts style, matching the exact lighting, palette and line-weight of the scene. Place it ALONE on a COMPLETELY FLAT SOLID PURE-GREEN (#00FF00) background with a thin clean light outline. NO ground, NO shadow, NO other objects, NO text."
  node tools/imgproc.mjs sprite --in assets/raw/prop_${id}_<name>.png --out assets/prop/${id}_<name>.png --h 700
  node tools/imgproc.mjs verify --in assets/prop/${id}_<name>.png --alpha 1   (must be ok:true; if alphaCoverage ~0 or ~1, regen with stronger pure-green instruction)

=== STEP 3: VISION REVIEW ===
Read the new assets/bg/${id}.png and each assets/prop/${id}_*.png. Confirm: (a) the plate no longer contains the foreground
occluders (clean floor where props go), is on-style, no text/characters; (b) each prop is cleanly keyed (no green fringe),
recognizable, and matches the scene's style & light. Regenerate any clearly-bad item ONCE (max 2 attempts each; respect rate limits).

Return {id:'${id}', ok, plate_ok, props:[{name, ok} ...], notes}.`,
  { label:`plateprops:${id}`, phase:'PlatesProps', agentType:'general-purpose', schema:RET }
)));
return { results: res.filter(Boolean) };
