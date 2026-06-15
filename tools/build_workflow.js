export const meta = {
  name: 'kippa-arsit-build',
  description: 'Build the full "Kippa Arsit" Sierra-style adventure end-to-end (design, scenes, sprites, items, music, QA)',
  phases: [
    { title: 'Design',  detail: 'story bible, dialogue, art bible, comedy, deaths, intro/ending, RTL glossary' },
    { title: 'Build',   detail: 'one agent per scene / sprite / items / music / intro — writes its own file' },
    { title: 'Review',  detail: 'adversarial contract+puzzle conformance review per scene' },
    { title: 'Fix',     detail: 'apply review fixes per scene' },
    { title: 'Audit',   detail: 'winnability simulation, art consistency, RTL lint, integration verify, walkthrough' },
  ],
};

/* ---------- shared context every agent gets ---------- */
const PRE = `You are building a Sierra-style (late-80s SCI) point-and-click adventure GAME called
"כיפה ערסית" (Kippa Arsit): a Hebrew comedy retelling of Little Red Riding Hood where Red is an
Israeli street kid ("ערסית"), the Wolf is a gentle VEGETARIAN, and the Grandmother is a hidden PSYCHOPATH.
Vanilla JS + HTML5 Canvas, NO build step. Working dir is the project root.

MANDATORY READING before you write anything (use the Read tool):
  - CONTRACT.md            (the exact engine API + scene/sprite/item schemas + art rules)
  - docs/GAME_SPEC.md      (the winnable puzzle graph, item ids, flag names, per-scene briefs)
  - js/scenes/scene01_room.js  (the CANONICAL worked example — mirror its shape & quality)
  - js/sprites.js          (the 'red' sprite reference for pixel-art style)
Also read any relevant docs/*.md produced in the Design phase if present.

HARD RULES:
- Use ONLY the GAME.* API from CONTRACT.md. Never use document/window or raw canvas font text for Hebrew.
- All Hebrew text goes through GAME.say / GAME.speak / GAME.choice (RTL handled centrally).
- Hebrew arrows: use ← (not →) in Hebrew strings.
- Keep EXACT scene ids, exit targets, item ids, and flag names from GAME_SPEC.md so the game stays connected & winnable.
- Tone: warm Israeli street comedy. Slangy and funny, never crude or mean.
- Edit ONLY the single file you are assigned. Do not touch index.html, engine.js, or other agents' files.
- After writing, run \`node --check <yourfile>\` with the Bash tool and fix until it passes cleanly.
Your returned text is data for the orchestrator, not a message to a human. Return the structured fields only.`;

const BUILD_RET = { type:'object', additionalProperties:true,
  required:['path','ok','summary'],
  properties:{
    path:{type:'string'}, ok:{type:'boolean', description:'node --check passed'},
    summary:{type:'string'},
    usedItems:{type:'array', items:{type:'string'}},
    usedFlags:{type:'array', items:{type:'string'}},
  }};
const DOC_RET = { type:'object', additionalProperties:true, required:['path','summary'],
  properties:{ path:{type:'string'}, summary:{type:'string'} }};
const REVIEW_RET = { type:'object', additionalProperties:true, required:['path','conforms'],
  properties:{ path:{type:'string'}, conforms:{type:'boolean'},
    issues:{type:'array', items:{type:'object', additionalProperties:true,
      properties:{ severity:{type:'string'}, desc:{type:'string'} }}},
    mustFix:{type:'array', items:{type:'string'}} }};
const FIX_RET = { type:'object', additionalProperties:true, required:['path','ok'],
  properties:{ path:{type:'string'}, ok:{type:'boolean'}, changes:{type:'array', items:{type:'string'}} }};

/* =================== PHASE 1 — DESIGN =================== */
phase('Design');
const designTasks = [
  ['docs/STORY_BIBLE.md', 'STORY BIBLE',
    `Write the full story bible: 3-act structure, comedic premise, each character\'s arc, the central twist
     (granny is the real villain hunting the vegetarian wolf), the emotional beat (Red + Wolf alliance), and the ending.
     Keep it consistent with docs/GAME_SPEC.md. ~500-800 words, Hebrew + light English notes ok.`],
  ['docs/DIALOGUE.md', 'DIALOGUE & VOICE',
    `Write a dialogue/voice guide with 8-15 ready-to-use Hebrew lines PER character (כיפה, אמא, הזאב, סבתא, חוטב עצים, שכן).
     Include the inverted-classic granny exchange ("איזה עיניים גדולות יש לך סבתא" → menacing sweet replies, ending on
     "איזה סכין גדולה יש לך"). Capture each voice (Red=ערסית slang; Wolf=soft vegan hipster; Granny=sugary-sinister).
     Scene agents will copy lines from here.`],
  ['docs/ART_BIBLE.md', 'ART BIBLE',
    `Write per-scene composition notes for scenes 2-10 (and intro): horizon/floor line, key shapes, palette picks from GAME.C,
     where the player walks, where NPCs/objects sit. Reinforce EGA-flat discipline, 1px black outlines, readable chunky shapes.
     This guides the scene agents so the 10 rooms feel cohesive.`],
  ['docs/COMEDY.md', 'COMEDY & EASTER EGGS',
    `Write 20+ jokes/gags/easter eggs spread across rooms: graffiti puns, item descriptions, look-at one-liners,
     references to Israeli street culture (גרעינים, קיוסק, אוסטרליה ביי), and meta Sierra jokes. Keep warm, not crude.`],
  ['docs/DEATHS.md', 'DEATH SCREENS',
    `Write 10 funny Sierra-style death one-liners (Hebrew) for: swimming the river, eating mushrooms, grabbing the
     woodcutter\'s axe, accusing granny unarmed, jumping the bedroom window, etc. Each 1-2 sentences, dark-comic but light.`],
  ['docs/INTRO_ENDING.md', 'INTRO & ENDING',
    `Write (a) a 4-6 line storybook INTRO narration sequence (for scene00 intro cutscene) setting up the premise with humor,
     and (b) the FINALE beats + the victory text and a couple of alternate ending flavor lines. Consistent with GAME_SPEC finale.`],
  ['docs/RTL_GLOSSARY.md', 'RTL & SLANG GLOSSARY',
    `Write the RTL writing rules (Hebrew uses ← not →) and a slang glossary for Red (סבבה, וואלה, אחותי, פצצה, על הפנים,
     יאללה ביי, חבל עליך, אש, גבר/גברת) with usage notes, so all dialogue stays consistent and authentic.`],
  ['docs/PUZZLE_FLOW.md', 'PUZZLE FLOW CHECK',
    `Re-state the intended solution path from GAME_SPEC.md as a numbered, testable checklist (room → action → flag/item gained → gate opened),
     and flag any dead-ends or missing links you notice. This becomes the QA reference.`],
];
const designResults = await parallel(designTasks.map(([path,title,task]) => () =>
  agent(`${PRE}\n\nDESIGN TASK — ${title}\nWrite the file ${path} (create it). ${task}\nReturn {path, summary}.`,
    { label:`design:${title}`, phase:'Design', agentType:'general-purpose', schema:DOC_RET })
));
log(`Design phase done: ${designResults.filter(Boolean).length}/${designTasks.length} docs written.`);

/* =================== PHASE 2 — BUILD =================== */
phase('Build');

const scenes = [
  ['js/scenes/scene02_living.js','living_room','הסלון',
    `Cozy worn Israeli living room (couch, CRT TV, framed photo of a too-intense young granny, kitchen doorway, rug, window).
     NPC: draw 'mom' near the kitchen via GAME.drawSprite. TALK to mom → setFlag('hasMission',true), she reminds to bring the
     basket to granny and warns "סבתא מוזרה לאחרונה... תיזהרי" + GAME.score(5,'mission'). GATE the 'out'→hood exit with
     gate(){return GAME.has('basket') && GAME.flag('hasMission');} and a gateFail mom line. Keep exits back→room_red, out→hood.`],
  ['js/scenes/scene03_hood.js','hood','השכונה',
    `Sunny EGA street: apartment blocks, parked scooter, a KIOSK stall, graffiti, palm tree. NPC: draw 'neighbor' at the kiosk.
     TALK to neighbor → comedic bit, then GAME.give('seeds'); GAME.score(5,'seeds'). Funny graffiti/scooter look-ats.
     Exits back→living_room, fwd→forest_edge.`],
  ['js/scenes/scene04_forest_edge.js','forest_edge','כניסה ליער',
    `Street meets forest: first big trees, path, chopping stump, log pile, a "יער" sign. NPC: 'woodcutter' by the stump with axe.
     Grabbing the axe (onTake) → GAME.die(funny). TALK = grumpy. When player does USE with the 'basket' OR 'cookie' item on the
     woodcutter (onUse(item) where item==='basket'||item==='cookie'): if basket, also GAME.give('cookie') flavor; he softens,
     GAME.give('plank'); GAME.score(5,'plank'); and warns "הזאב פרא תמים — תשמרי מהזקנה." Exits back→hood, fwd→deep_forest.`],
  ['js/scenes/scene05_deep_forest.js','deep_forest','עומק היער',
    `Dense dark-green forest, light shafts, twisted trees, mushrooms, a fork. NPC: 'wolf' sitting sadly on a log (first meeting) +
     optional 'critter' that flees. TALK to wolf → he explains he\'s vegetarian, feared by all, craving גרעינים, points to his garden.
     Eating/using mushrooms → GAME.die(funny). Exits back→forest_edge, garden→wolf_garden (arrow up), fwd→river (arrow right).`],
  ['js/scenes/scene06_wolf_garden.js','wolf_garden','הגינה של הזאב',
    `Lovely veg garden: rows of carrots/tomatoes, sunflowers, scarecrow, watering can, wolf\'s hut. NPC 'wolf' tending plants.
     CORE PUZZLE: USE 'seeds' on the wolf (onUse(item) item==='seeds') → setFlag('wolfFriend',true); GAME.score(10,'wolffriend');
     wolf reveals granny tried to skin him, GAME.give('evidence'); setFlag('grannyTruth',true); GAME.score(10,'evidence');
     wolf promises to come if called in the finale. Exit back→deep_forest.`],
  ['js/scenes/scene07_river.js','river','הנהר והגשר',
    `A river with a BROKEN wooden bridge (gap mid-span), far bank path, reeds, stones. Trying to swim/cross water → GAME.die(funny).
     PUZZLE: USE 'plank' on the broken bridge (onUse item==='plank') → setFlag('bridgeFixed',true); GAME.score(10,'bridge').
     GATE fwd→granny_ext with gate(){return GAME.flag('bridgeFixed');} + gateFail "הגשר שבור, אין מעבר." Exits back→deep_forest, fwd→granny_ext.`],
  ['js/scenes/scene08_granny_ext.js','granny_ext','בית סבתא — חוץ',
    `Creepy-cute cottage, crooked chimney, garden GNOME, flower bed, locked door, dark window. TAKE/look gnome → find 'key'
     (GAME.give('key'); GAME.score(5,'key')). Window onLook → glimpse knives/taxidermy (unease). USE 'key' on door →
     setFlag('grannyDoorOpen',true). GATE 'in'→granny_int with gate(){return GAME.flag('grannyDoorOpen');}. Exits back→river, in→granny_int.`],
  ['js/scenes/scene09_granny_int.js','granny_int','בית סבתא — פנים',
    `Dim interior: bed with "granny" (draw 'granny' sprite), fireplace, a WALL OF KNIVES, a taxidermy trophy, a table with a NOTE,
     rocking chair. Look-ats confirm psychopath vibes. TALK to granny → the inverted-classic exchange (use docs/DIALOGUE.md), then a
     GAME.choice: option "להאשים אותה עכשיו" → if !GAME.has('evidence') GAME.die(funny-grim) else GAME.goto('finale');
     option "לאסוף עוד / להתחפף". GATE fwd→finale with gate(){return GAME.flag('grannyTruth');}. Exits back→granny_ext, fwd→finale.`],
  ['js/scenes/scene10_finale.js','finale','העימות',
    `Dramatic bedroom showdown: granny rising revealing a butcher knife, moonlight, wolf silhouette at the window. Script via onEnter
     using GAME.speak/say sequence (chain with GAME.onMsgDone). Granny: "איזה כיפה גדולה... כמה בשר." WIN PATH: if
     GAME.flag('wolfFriend') && GAME.has('evidence'): Red shows evidence + calls wolf, wolf bursts in, granny subdued →
     setFlag('grannyBeaten',true); GAME.score(20,'win'); GAME.win('כיפה והזאב הצמחוני הצילו את היום! 100/100. יאללה ביי, סבתא.').
     LOSE PATH otherwise → GAME.die('בלי חבר ובלי הוכחות מול סכין... סוף ארור.'). Exit back→granny_int (only pre-resolution).`],
];

const sprites = [
  ['js/sprites.js','red',
    `IMPROVE the player 'red' sprite (keep registering 'red' AND 'placeholder'; do not remove the rel() helper or break the file).
     Make a crisp ערסית: red beanie/cap, sunglasses, gold chain, red zip jacket, track pants w/ white stripes, sneakers, attitude.
     Support dir left/right/up/down and a 2-step walk cycle via frame (0..3). x,y = feet bottom-center. Add a soft shadow ellipse.
     This file is yours alone.`],
  ['js/npc/wolf.js','wolf',
    `Draw the VEGETARIAN wolf sprite: tall, gentle posture, soft grey fur, big sad friendly eyes, maybe a little leaf/sprout motif or
     an apron in spirit (a gentle vibe, NOT scary). dir support + idle. Register GAME.registerSprite('wolf',{...}). File is yours alone.`],
  ['js/npc/granny.js','granny',
    `Draw sweet-old-lady granny in/near bed pose: grey bun, glasses, shawl, kindly face — but a faint unsettling glint.
     Register 'granny'. File yours alone.`],
  ['js/npc/granny_beast.js','granny_beast',
    `Draw the PSYCHOPATH reveal form of granny: same lady but menacing — wild eyes, a butcher knife raised, shawl askew, sinister grin.
     Register 'granny_beast'. Used in the finale. File yours alone.`],
  ['js/npc/mom.js','mom',
    `Draw worried Israeli mom: apron, hair up, hands-on-hips vibe. Register 'mom'. File yours alone.`],
  ['js/npc/neighbor.js','neighbor',
    `Draw a hood kiosk neighbor/shopkeeper: tank top, cap, a bit of belly, friendly. Register 'neighbor'. File yours alone.`],
  ['js/npc/woodcutter.js','woodcutter',
    `Draw a grumpy woodcutter: beard, flannel/lumberjack vibe, axe on shoulder. Register 'woodcutter'. File yours alone.`],
  ['js/npc/critter.js','critter',
    `Draw a small forest critter (rabbit or hedgehog), ~16px tall, cute. Register 'critter'. File yours alone.`],
];

const buildThunks = [
  ...scenes.map(([file,id,name,brief]) => () =>
    agent(`${PRE}\n\nBUILD SCENE — id='${id}' (${name}), file=${file}.\nReplace the stub at ${file} with a FULL, polished scene\n(rich drawBackground pixel art + hotspots with look/take/use/talk + exits per spec).\nBRIEF:\n${brief}\nPull dialogue from docs/DIALOGUE.md and look-at gags from docs/COMEDY.md where they fit. Mirror scene01\'s quality.\nReturn {path, ok, summary, usedItems, usedFlags}.`,
      { label:`scene:${id}`, phase:'Build', agentType:'general-purpose', schema:BUILD_RET })),
  ...sprites.map(([file,sid,brief]) => () =>
    agent(`${PRE}\n\nBUILD SPRITE — '${sid}', file=${file}.\n${brief}\nFollow the sprite drawing convention in js/sprites.js (rel() offsets from feet bottom-center; scale param). Keep it readable at small size.\nReturn {path, ok, summary}.`,
      { label:`sprite:${sid}`, phase:'Build', agentType:'general-purpose', schema:BUILD_RET })),
  // items.js (single owner)
  () => agent(`${PRE}\n\nBUILD ITEMS — file=js/items.js.\nRewrite js/items.js to register ALL inventory items with 16x16 pixel icons + Hebrew name/desc:
     basket (keep existing), cookie (עוגיה), seeds (גרעינים), plank (קרש), key (מפתח), evidence (הוכחה - granny\'s creepy note).
     Use the exact item ids from GAME_SPEC.md. Keep the existing module IIFE shape.\nReturn {path, ok, summary, usedItems}.`,
    { label:'items', phase:'Build', agentType:'general-purpose', schema:BUILD_RET }),
  // music.js
  () => agent(`${PRE}\n\nBUILD MUSIC — file=js/music.js.\nImplement GAME.music(name) using WebAudio (oscillators), with looping low-volume chiptune themes:
     'hood' (upbeat street), 'forest' (mellow), 'granny' (creepy), and GAME.music('stop'). Keep volume subtle (~0.03).
     Must be safe if AudioContext is unavailable (no throw). Provide GAME.music as the API. Self-contained IIFE.\nReturn {path, ok, summary}.`,
    { label:'music', phase:'Build', agentType:'general-purpose', schema:BUILD_RET }),
  // intro cutscene
  () => agent(`${PRE}\n\nBUILD INTRO — file=js/scenes/scene00_intro.js, scene id='intro'.\nReplace the stub with a storybook intro cutscene:
     draw a simple illustrated title/forest scene, play the intro narration from docs/INTRO_ENDING.md via a chained GAME.say sequence
     (use GAME.onMsgDone to chain), then GAME.goto('room_red') at the end. No player walking needed (tiny walkbox). Keep it short & funny.\nReturn {path, ok, summary}.`,
    { label:'scene:intro', phase:'Build', agentType:'general-purpose', schema:BUILD_RET }),
];

const buildResults = (await parallel(buildThunks)).filter(Boolean);
log(`Build phase done: ${buildResults.length}/${buildThunks.length} files. node --check ok: ${buildResults.filter(r=>r.ok).length}.`);

/* =================== PHASE 3+4 — REVIEW → FIX (pipeline per scene) =================== */
phase('Review');
const sceneFiles = scenes.map(s=>({file:s[0], id:s[1], name:s[2], brief:s[3]}));
const reviewed = await pipeline(
  sceneFiles,
  (s) => agent(`${PRE}\n\nADVERSARIAL REVIEW of ${s.file} (scene '${s.id}').\nRead the file and check, strictly:
     1) Conforms to CONTRACT.md (valid scene object, only GAME.* API, no raw Hebrew fillText).
     2) Matches its GAME_SPEC brief: correct exit ids/targets, correct item ids & flag names, gates present where required,
        the core puzzle actually works and is reachable, score calls present.
     3) No JS bugs (run \`node --check\`). 4) Hebrew uses ← not →. 5) Art is non-empty & uses the palette.
     Be skeptical — assume there\'s a bug and find it. Return {path, conforms, issues:[{severity,desc}], mustFix:[...]}.`,
    { label:`review:${s.id}`, phase:'Review', agentType:'general-purpose', schema:REVIEW_RET }),
  (review, s) => {
    const must = (review && (review.mustFix||[]).concat((review.issues||[]).map(i=>i.desc||''))) || [];
    const issueBlob = must.filter(Boolean);
    return agent(`${PRE}\n\nHARDEN & POLISH the scene file ${s.file} (scene '${s.id}').\nFirst FIX every issue the reviewer raised (if any):\n${JSON.stringify(issueBlob.length?issueBlob:['(reviewer found none — do a quality polish pass)'], null, 1)}\nThen do a quality pass: tighten the pixel art, sharpen the comedy in look-at lines (pull from docs/COMEDY.md), confirm the
     puzzle from GAME_SPEC.md actually works (exits/gates/items/flags/score), and ensure Hebrew uses ← not →.
     Preserve everything that already works. After editing, run \`node --check ${s.file}\` until clean.\nReturn {path, ok, changes:[...]}.`,
      { label:`polish:${s.id}`, phase:'Fix', agentType:'general-purpose', schema:FIX_RET });
  }
);
log(`Review→Fix done for ${reviewed.filter(Boolean).length} scenes.`);

/* =================== PHASE 5 — AUDIT =================== */
phase('Audit');
const audits = await parallel([
  () => agent(`${PRE}\n\nWINNABILITY AUDIT.\nUsing docs/PUZZLE_FLOW.md and by READING every js/scenes/*.js + js/items.js + js/story.js,
     trace the full solution path from intro to GAME.win(). Verify each gate can be opened with items/flags obtainable earlier,
     every referenced item id is registered, every flag set before it\'s read, and no exit points to a missing scene id.
     List any blockers that make the game unwinnable. Return {winnable, path:[steps...], blockers:[...]} (as JSON in your text).`,
    { label:'audit:winnable', phase:'Audit', agentType:'general-purpose' }),
  () => agent(`${PRE}\n\nART CONSISTENCY CRITIC.\nRead all scene drawBackground functions + sprites. Check the 10 rooms share a coherent
     horizon/floor, palette discipline (only GAME.C), readable shapes, and that NPC sprites are drawn where the brief expects.
     List concrete art issues with file + fix suggestion. Do NOT edit files; just report.`,
    { label:'audit:art', phase:'Audit', agentType:'general-purpose' }),
  () => agent(`${PRE}\n\nRTL/HEBREW LINTER.\nGrep all js/**/*.js for Hebrew strings containing the wrong arrow → (U+2192) and for any
     suspicious raw ctx.fillText with Hebrew. Report exact file:line offenders and the correct fix (use ←). Do not edit; report only.`,
    { label:'audit:rtl', phase:'Audit', agentType:'general-purpose' }),
  () => agent(`${PRE}\n\nINTEGRATION VERIFIER.\nRun \`node --check\` on EVERY js file (engine, sprites, npc/*, items, story, music, boot, scenes/*).
     Confirm index.html references every file that exists and that every <script> path exists on disk. Report any failures precisely.
     Return a short pass/fail summary with the failing files.`,
    { label:'audit:integration', phase:'Audit', agentType:'general-purpose' }),
  () => agent(`${PRE}\n\nWRITE README.md and docs/WALKTHROUGH.md.\nREADME: what the game is, how to run (python3 -m http.server then open index.html),
     controls, credits ("נבנה ע"י צי סוכנים"). WALKTHROUGH: the exact winning steps. Keep them tight and correct vs the built scenes.
     Return {path:'README.md', summary}.`,
    { label:'audit:docs', phase:'Audit', agentType:'general-purpose' }),
]);
log('Audit phase complete.');

return {
  designDocs: designResults.filter(Boolean).map(d=>d.path),
  built: buildResults.map(r=>({path:r.path, ok:r.ok})),
  reviewedScenes: reviewed.filter(Boolean).map(r=>r.path||r),
  audits: audits.filter(Boolean).map((a,i)=> typeof a==='string'? a.slice(0,400) : a),
};
