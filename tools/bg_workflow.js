export const meta = {
  name: 'kippa-backgrounds',
  description: 'Generate painted 90s-adventure backgrounds for all scenes (style+layout refs, verify, self-review, regen)',
  phases: [
    { title: 'Backgrounds', detail: 'one agent per scene: gen -> crop 1280x800 -> verify -> vision review -> regen if needed' },
    { title: 'Consistency', detail: 'final art-director judge across all backgrounds' },
  ],
};

const STYLE = `Hand-painted late-1990s LucasArts-style point-and-click adventure game background (think Curse of Monkey Island / Day of the Tentacle quality). Cartoon-painterly, BOLD clean dark ink outlines, soft cel-shading, warm saturated palette, rich atmospheric lighting and depth. CRITICAL: match the EXACT art style, line weight, brushwork, and color treatment of reference image #1 (the style key) so all rooms look like ONE game. Use reference image #2 ONLY as the composition/layout guide: keep the same camera framing, horizon line, perspective, and the approximate position & scale of the major objects and the walkable floor area. Repaint everything beautifully. ABSOLUTELY NO people/characters/animals, NO readable text/letters/words/signage, NO UI elements, NO border or frame. Fill the entire frame edge-to-edge, horizontal landscape.`;

const SCENES = [
  ['room_red', 'החדר של כיפה', `SCENE: a teenage Israeli street-girl's small messy bedroom in a working-class apartment. An unmade bed with a red/pink blanket on the LEFT, a window in the upper-left showing a glimpse of the neighborhood, a hip-hop/rap poster on the back wall, a mirror on the right wall, and a closed wooden door on the FAR RIGHT (the exit). Lived-in clutter, daytime warm light, purple-ish walls.`],
  ['living_room', 'הסלון', `SCENE: a worn cozy Israeli apartment living room. A sagging old couch, an old boxy CRT television, a framed family photo on the wall, a patterned rug on the floor, a doorway to a kitchen on one side, and a window letting in warm afternoon light. Homey, slightly dated, brown/tan tones.`],
  ['hood', 'השכונה', `SCENE: a sunny gritty Israeli neighborhood street ('shchuna'). Sand-colored apartment blocks with air-conditioner units and laundry lines, a small street KIOSK stall, a parked motor-scooter, a lone palm tree, cracked pavement. Bright midday, lively working-class vibe.`],
  ['deep_forest', 'עומק היער', `SCENE: a dense enchanted forest interior. Tall twisted ancient trees, shafts of golden light through the canopy, clusters of mushrooms, ferns and moss, a forked dirt path, a big fallen mossy log to sit on. Mysterious, deep greens, fairytale mood.`],
  ['wolf_garden', 'הגינה של הזאב', `SCENE: a surprisingly charming vegetable garden in a sunny forest clearing. Neat tidy rows of carrots and tomatoes, a row of tall sunflowers at the back, a friendly scarecrow, a watering can, and a small cozy wooden hut on the right. Wholesome, warm, green and inviting — an unexpectedly lovely garden tended with care.`],
  ['river', 'הנהר והגשר', `SCENE: a forest river cutting across the view. A wooden footbridge that is BROKEN with a clear GAP missing in the middle of its span, the near bank in the foreground and a far bank with a continuing path, reeds, a few stepping stones, dappled light on the water. Cool blues and greens.`],
  ['granny_ext', 'בית סבתא — חוץ', `SCENE: a creepy-cute fairytale cottage at the edge of the forest at dusk. A crooked little chimney with smoke, a small garden gnome by the path, a flower bed, a heavy closed wooden front door, and one dark window. Slightly ominous but storybook, long evening shadows, muted purples and warm window glow.`],
  ['granny_int', 'בית סבתא — פנים', `SCENE: a dim cottage interior. A bed with a quilt against the back wall, a stone fireplace with embers, a wall prominently displaying a neat ROW OF KNIVES of increasing size, a mounted taxidermy animal trophy, a small table with a folded note, and a rocking chair. Cozy yet deeply unsettling — warm firelight fighting cold shadows.`],
  ['finale', 'העימות', `SCENE: a moonlit cottage bedroom, dramatic and tense. Cold blue moonlight pouring through a window on the left, a bed in the center, long dramatic shadows, an open doorway on the right. High-contrast cinematic horror-comedy lighting, the calm before a confrontation. No characters.`],
  ['intro', 'פתיחה', `SCENE: a cinematic establishing vista for a title screen — a moody fairytale forest path in the foreground curving toward a distant working-class Israeli neighborhood skyline under a big pale moon and dusk sky. Atmospheric, painterly, wide open composition with empty sky area at the top (room for a title). Beautiful, inviting, a touch mysterious.`],
];

const RET = { type:'object', additionalProperties:true, required:['id','ok'],
  properties:{ id:{type:'string'}, ok:{type:'boolean'}, w:{type:'number'}, h:{type:'number'},
    attempts:{type:'number'}, styleMatch:{type:'string'}, notes:{type:'string'}, issues:{type:'array', items:{type:'string'}} }};

phase('Backgrounds');
const results = await parallel(SCENES.map(([id, name, scene]) => () => agent(
`You generate ONE painted background for the adventure game "כיפה ערסית", scene id='${id}' (${name}).
Work in the project root. Reference images already exist:
  - style key:       assets/style/style_key.png   (the locked art style — match it exactly)
  - layout guide:    assets/layout/${id}.png       (composition/object placement to follow)

STEP 1 — generate (this exact command, one line):
  node tools/genimg.mjs --out assets/raw/${id}.png --aspect 3:2 --size 2K --ref assets/style/style_key.png,assets/layout/${id}.png --prompt "${STYLE} ${scene}"

STEP 2 — crop to EXACT canvas size + verify:
  node tools/imgproc.mjs bg --in assets/raw/${id}.png --out assets/bg/${id}.png --w 1280 --h 800
  node tools/imgproc.mjs verify --in assets/bg/${id}.png --w 1280 --h 800 --alpha 0
  (both must print "ok":true. If imgproc fails, re-run STEP 1 then STEP 2.)

STEP 3 — VISION review: use the Read tool to open assets/bg/${id}.png AND assets/style/style_key.png AND assets/layout/${id}.png.
  Judge honestly: (a) does the style clearly match the style key (line weight, painterly look, palette, one cohesive game)? (b) does the composition roughly follow the layout guide (same camera, horizon, major objects in similar positions, walkable floor at the bottom)? (c) any garbled text, people, watermarks, blur, or empty/broken areas?
  If it is clearly wrong (broken, off-style, contains people/large text, or ignores the layout), RE-RUN step 1 (you may slightly strengthen the prompt, e.g. add "NO text whatsoever" or clarify a misplaced object) then step 2, then review again. Do at most 2 total generation attempts (to respect API rate limits) — keep the better result.

Return {id, ok (true if a valid 1280x800 bg exists), w, h, attempts, styleMatch (short verdict), notes, issues}.`,
  { label:`bg:${id}`, phase:'Backgrounds', agentType:'general-purpose', schema:RET }
)));

phase('Consistency');
const okIds = results.filter(Boolean).filter(r=>r.ok).map(r=>r.id).concat(['forest_edge']);
const judge = await agent(
`You are the art director for "כיפה ערסית". Use the Read tool to view ALL of these painted backgrounds and assess overall STYLE CONSISTENCY (they must look like one cohesive 90s LucasArts adventure game):
${okIds.map(id=>'  assets/bg/'+id+'.png').join('\n')}
The locked style reference is assets/style/style_key.png (= forest_edge).
For each background give a one-line verdict (consistent / mild-outlier / strong-outlier) and note any that clash in palette, line weight, lighting, or perspective, or contain stray text/people. List the worst 0-3 that should be regenerated and why. Be specific and honest.
Return a concise text report.`,
  { label:'art-director', phase:'Consistency', agentType:'general-purpose' }
);

return { built: results.filter(Boolean), judge: typeof judge==='string'? judge.slice(0,1500): judge };
