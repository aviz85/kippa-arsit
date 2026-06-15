export const meta = {
  name: 'kippa-items-ui',
  description: 'Generate painted inventory item icons + verb-bar UI icons on chroma-green, key to transparent PNG',
  phases: [
    { title: 'Items', detail: 'basket, cookie, seeds, plank, key, evidence (64px icons)' },
    { title: 'Verbs', detail: 'walk, look, talk, take, use (96px icons)' },
  ],
};

const ITEM = `A single inventory ITEM ICON for a late-1990s LucasArts-style adventure game. Hand-painted cartoon style, BOLD clean dark outline, soft cel-shading, warm saturated palette, slightly glossy game-icon look. ONE object only, centered, filling most of the frame. CRITICAL FOR KEYING: solid FLAT UNIFORM PURE-GREEN background (#00FF00) with a thin light outline around the object. NO text/letters, NO hand, NO cast shadow, NO frame.`;
const VERB = `A single UI ACTION ICON for a 1990s adventure-game verb bar. One bold simple painted symbol, thick dark outline, warm palette, very clear silhouette readable at tiny size, centered. CRITICAL FOR KEYING: solid FLAT UNIFORM PURE-GREEN background (#00FF00) with a light outline. NO text/letters, NO frame.`;

const RET = { type:'object', additionalProperties:true, required:['id','ok'],
  properties:{ id:{type:'string'}, ok:{type:'boolean'}, w:{type:'number'}, h:{type:'number'}, alphaCoverage:{type:'number'}, notes:{type:'string'} }};
const STYLE_REF = 'assets/style/style_key.png';

function iconAgent(kind, id, desc, size, aspect) {
  const raw = `assets/raw/${kind}_${id}.png`;
  const out = kind==='item' ? `assets/item/${id}.png` : `assets/ui/verb_${id}.png`;
  const base = kind==='item' ? ITEM : VERB;
  return () => agent(
`Generate ONE ${kind} icon for "כיפה ערסית": '${id}'. Work in project root. Style reference: ${STYLE_REF}.

STEP 1: node tools/genimg.mjs --out ${raw} --aspect ${aspect} --size 1K --ref ${STYLE_REF} --prompt "${base} SUBJECT: ${desc}"
STEP 2: node tools/imgproc.mjs icon --in ${raw} --out ${out} --size ${size}
        node tools/imgproc.mjs verify --in ${out} --w ${size} --h ${size} --alpha 1
        (both must print "ok":true; if not clean green, re-run STEP 1 with stronger "SOLID PURE GREEN #00FF00 background", then STEP 2.)
STEP 3: Read ${out}. Confirm a single clean, recognizable, well-keyed icon (transparent bg, no green fringe, painted style). If clearly bad, re-run step 1 (tweak prompt) then 2. Max 2 generation attempts.

Return {id:'${id}', ok, w, h, alphaCoverage, notes}.`,
    { label:`${kind}:${id}`, phase: kind==='item'?'Items':'Verbs', agentType:'general-purpose', schema:RET });
}

phase('Items');
const items = await parallel([
  iconAgent('item','basket','a woven straw picnic basket with a red-checkered cloth and a couple of goodies peeking out', 64,'1:1'),
  iconAgent('item','cookie','a single big golden chocolate-chip cookie', 64,'1:1'),
  iconAgent('item','seeds','a small snack packet/bag of black sunflower seeds (Israeli "garinim"), the bag slightly open with seeds visible', 64,'1:1'),
  iconAgent('item','plank','a single long weathered wooden plank / board', 64,'1:1'),
  iconAgent('item','key','an old ornate rusty iron skeleton door key', 64,'1:1'),
  iconAgent('item','evidence','a slightly crumpled handwritten note / scrap of paper, a sinister little to-do list, only scribble marks (NO readable text)', 64,'1:1'),
]);

phase('Verbs');
const verbs = await parallel([
  iconAgent('verb','walk','a single white sneaker / walking shoe', 96,'1:1'),
  iconAgent('verb','look','a single stylized open eye', 96,'1:1'),
  iconAgent('verb','talk','a single speech bubble', 96,'1:1'),
  iconAgent('verb','take','a single open grabbing hand', 96,'1:1'),
  iconAgent('verb','use','a single wrench-and-gear tool symbol', 96,'1:1'),
]);

return { items: items.filter(Boolean), verbs: verbs.filter(Boolean) };
