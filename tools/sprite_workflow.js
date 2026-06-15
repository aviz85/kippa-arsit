export const meta = {
  name: 'kippa-sprites',
  description: 'Generate painted character sprites (player views + NPCs) on chroma-green, auto-key to transparent PNG, verify',
  phases: [
    { title: 'Player', detail: 'Red side + back views (front already exists), identity-locked to the front reference' },
    { title: 'NPCs', detail: 'wolf, granny, granny_beast, mom, neighbor, woodcutter, critter' },
  ],
};

const SPRITE = `Full-body single-character sprite for a late-1990s LucasArts-style point-and-click adventure game. Hand-painted cartoon style with BOLD clean dark ink outlines and soft cel-shading, warm saturated palette, matching the painted art style of the provided style reference image. The character is full body head-to-toe, standing on nothing, vertically centered with even margin. CRITICAL FOR CHROMA KEYING: the character must be ALONE on a COMPLETELY FLAT, UNIFORM, SOLID PURE-GREEN background (#00FF00 chroma green), and the character must have a thin clean 2-3px light/white outline separating it from the green. NO ground, NO shadow, NO extra props beyond those described, NO text, NO frame.`;

const RET = { type:'object', additionalProperties:true, required:['id','ok'],
  properties:{ id:{type:'string'}, ok:{type:'boolean'}, w:{type:'number'}, h:{type:'number'},
    alphaCoverage:{type:'number'}, attempts:{type:'number'}, notes:{type:'string'}, issues:{type:'array', items:{type:'string'}} }};

function spriteAgent(id, dir, aspect, refs, charDesc, extra) {
  const out = `assets/spr/${id}_${dir}.png`;
  const raw = `assets/raw/spr_${id}_${dir}.png`;
  return () => agent(
`Generate ONE character sprite for "כיפה ערסית": id='${id}', view='${dir}'. Work in project root.
Reference image(s): ${refs}

STEP 1 — generate:
  node tools/genimg.mjs --out ${raw} --aspect ${aspect} --size 2K --ref ${refs} --prompt "${SPRITE} CHARACTER: ${charDesc} ${extra||''}"

STEP 2 — auto chroma-key + trim to a tight transparent PNG, then verify it has alpha:
  node tools/imgproc.mjs sprite --in ${raw} --out ${out} --h 560
  node tools/imgproc.mjs verify --in ${out} --alpha 1
  (both must print "ok":true. If the sprite step reports it could not find content or alphaCoverage is ~0 or ~1, the background wasn't clean green — re-run STEP 1 with a stronger "SOLID PURE GREEN #00FF00 background" instruction, then STEP 2.)

STEP 3 — VISION review: Read ${out}. Confirm: a single clean full-body character, correctly keyed (transparent background, NO green halo/fringe, not cut off at edges, recognizable as described, painted style matching the game). Also Read assets/style/style_key.png to confirm the style matches. If clearly bad (green fringe, body cropped, wrong character, garbled), re-run step 1 (tweak prompt) then 2. At most 2 generation attempts total (respect API rate limits); keep the better result.

Return {id:'${id}_${dir}', ok, w, h, alphaCoverage, attempts, notes, issues}.`,
    { label:`spr:${id}_${dir}`, phase: id==='red'?'Player':'NPCs', agentType:'general-purpose', schema:RET });
}

const RED_REF = 'assets/raw/red_front_test.png,assets/style/style_key.png';
const STYLE_REF = 'assets/style/style_key.png';
const RED_CHAR = `the SAME EXACT character as the first reference image — a cheeky Israeli teenage street-girl ('arsit') with a bright red snapback cap, black sunglasses, thick gold chain, red zip track jacket, grey track pants with white side stripes, white chunky sneakers, confident smirk. Keep her face, outfit, colors and proportions identical to the reference.`;

phase('Player');
const playerJobs = [
  spriteAgent('red','side','2:3', RED_REF, RED_CHAR, `View: clean SIDE PROFILE facing RIGHT, in a relaxed mid-walk stride (one leg forward), arms at sides.`),
  spriteAgent('red','up','2:3', RED_REF, RED_CHAR, `View: seen from BEHIND (back view), facing away from the viewer, walking; we see the back of the red cap and jacket.`),
];

phase('NPCs');
const npcJobs = [
  spriteAgent('wolf','side','2:3', STYLE_REF, `a gentle, friendly, VEGETARIAN wolf — soft grey fur, big kind eyes, a shy warm smile, NOT scary at all, standing upright on two legs wearing a small gardening apron, calm hipster vibe.`, `View: 3/4 side view facing right.`),
  spriteAgent('granny','side','2:3', STYLE_REF, `a sweet-looking little old grandmother — grey hair in a tidy bun, round glasses, a knitted shawl over a floral nightgown, kindly smile but with a faint unsettling glint in her eyes.`, `View: standing, 3/4 view facing left.`),
  spriteAgent('granny_beast','side','2:3', STYLE_REF, `a sweet-looking little old grandmother (grey bun, round glasses, floral nightgown) but REVEALED as a menacing psychopath — wild eyes, a chilling wide grin, shawl askew, RAISING a large shiny butcher's knife in one hand. Scary-funny, theatrical.`, `View: dynamic, 3/4 view facing left.`),
  spriteAgent('mom','side','2:3', STYLE_REF, `a worried middle-aged Israeli mother — hair tied up, an apron over casual home clothes, hands on hips, a caring but stressed expression.`, `View: standing, 3/4 view facing right.`),
  spriteAgent('neighbor','side','2:3', STYLE_REF, `a friendly Israeli neighborhood kiosk shopkeeper — a man in a white tank top ('atleta') and a cap, a bit of a belly, stubble, a big welcoming grin.`, `View: standing, 3/4 view facing left.`),
  spriteAgent('woodcutter','side','2:3', STYLE_REF, `a grumpy burly woodcutter — big bushy beard, plaid flannel shirt, suspenders, a wood axe resting on his shoulder, a gruff frown.`, `View: standing, 3/4 view facing left.`),
  spriteAgent('critter','side','1:1', STYLE_REF, `a small cute forest rabbit — fluffy, big eyes, twitchy nose, sitting alert.`, `View: small, side 3/4 view.`),
];

const player = await parallel(playerJobs);
const npcs = await parallel(npcJobs);
return { player: player.filter(Boolean), npcs: npcs.filter(Boolean) };
