# כיפה ארסית — GAME SPEC (the winnable puzzle graph & per-scene briefs)

This is the SINGLE SOURCE OF TRUTH for content. Every scene/sprite/item agent MUST conform
to the flags, items, exits and IDs here so the game is fully connected and winnable.
Conform to `CONTRACT.md` for the engine API. Tone: Israeli street comedy, warm not crude.

## Cast (voices via GAME.RED/MOM/WOLF/GRANNY, speak colors in story.js)
- **כיפה (Red)** — the player. ארסית של השכונה: chill, slangy ("סבבה","וואלה","אחותי","על הפנים","פצצה","יאללה ביי"), confident, secretly sharp. Never crude/mean.
- **אמא (Mom)** — worried Israeli mom, guilt-trips lovingly.
- **הזאב (Wolf)** — vegetarian, anxious, gentle, misunderstood. Loves vegetables & sunflower seeds (גרעינים). Sad that everyone fears him. Speaks soft, apologetic, a bit hipster ("אני בקטע של אוכל מהצומח").
- **סבתא (Granny)** — sweet façade hiding a psychopath. Collects knives & taxidermy. Wants to hunt/skin the wolf. The TWIST villain. Sugary words, chilling subtext.
- **חוטב עצים (Woodcutter)** — grumpy, gives the plank, drops hints.
- **שכן/קיוסקאי (Neighbor)** — runs a hood kiosk; source of sunflower seeds.

## Items (ids, registered in js/items.js — one agent owns this file)
| id | name | desc | found in | used on |
|----|------|------|----------|---------|
| basket | הסל | סל קש עם חטיפים | room_red (done) | woodcutter (give cookie), granny |
| cookie | עוגיה | עוגיה מהסל לסבתא | derived from basket (take cookie from basket in inventory→via hotspot) | woodcutter |
| seeds | גרעינים | חבילת גרעינים שחורים | hood (neighbor) | wolf (in wolf_garden) |
| plank | קרש | קרש עץ ארוך | forest_edge (woodcutter) | river (the gap) |
| key | מפתח | מפתח חלוד | granny_ext (under the gnome) | granny_ext door |
| evidence | הוכחה | פתק של סבתא: "1. הזאב 2. ?" | wolf_garden (wolf gives it) | finale (expose granny) |

## Flags (names in story.js GAME.STORY.flags — use EXACT strings)
- hasMission, gotBasket, gaveCookie, hasSeeds(use GAME.has('seeds')), gaveSeeds, wolfFriend,
  bridgeFixed, grannyTruth (knowsGranny), knifeProof (has 'evidence'), grannyBeaten.

## Win condition (engine: finale scene checks)
Reach `finale` with `wolfFriend===true` AND `GAME.has('evidence')`. Then exposing granny → GAME.win().
Accuse granny WITHOUT evidence, or face her WITHOUT the wolf befriended → GAME.die() (Sierra death).

## Scene map (exits already stubbed — keep these IDs/targets)
room_red → living_room → hood → forest_edge → deep_forest → (wolf_garden ↺) → river → granny_ext → granny_int → finale

---

## SCENE BRIEFS (implement each as full scene file, replacing the stub)

### scene02 living_room — הסלון
Art: cozy worn Israeli living room — couch, CRT TV, framed photo, kitchen doorway, rug, window.
NPC: **mom** standing near kitchen (draw via GAME.drawSprite(ctx,'mom',...)).
Hotspots: couch, TV (onLook joke about a telenovela), photo (young granny looking *too* intense — foreshadow), rug.
Puzzle: TALK to mom → she gives the mission (setFlag hasMission), reminds to bring the basket to granny,
  and says "סבתא מוזרה לאחרונה... תיזהרי" (seed of doubt). score(5,'mission').
  If player tries exit 'out'→hood WITHOUT basket: mom blocks ("בלי הסל את לא זזה!"). With basket+mission → allowed.
Exits: back→room_red, out→hood (gated on gotBasket && hasMission).

### scene03 hood — השכונה
Art: sunny EGA street — apartment blocks, parked scooter, a small KIOSK stall, graffiti, palm tree, hood vibe.
NPC: **neighbor** at the kiosk.
Hotspots: graffiti (jokey), scooter, kiosk counter.
Puzzle: TALK to neighbor → comedic haggling; he gives **seeds** (גרעינים) ("קח, מתנה, סע בשלום"). GAME.give('seeds'); score(5,'seeds').
Exits: back→living_room, fwd→forest_edge.

### scene04 forest_edge — כניסה ליער
Art: where street meets forest — first big trees, a path, a chopping stump, log pile, a sign "יער".
NPC: **woodcutter** by the stump with an axe.
Hotspots: stump, axe (onTake: he stops you / death joke if you grab his axe), log pile, sign.
Puzzle: TALK to woodcutter → he's grumpy. Give him a **cookie** (use cookie on woodcutter) → he softens,
  hands over the **plank** (קרש) and warns: "הזאב? פרא תמים. תשמרי מהזקנה." GAME.give('plank'); setFlag-ish; score(5,'plank').
  (cookie is obtained from the basket: add a hotspot/inventory action — see Items note below.)
Exits: back→hood, fwd→deep_forest.

### scene05 deep_forest — עומק היער
Art: dense dark-green forest, shafts of light, twisted trees, mushrooms, a fork in the path.
NPC: **wolf** sitting sadly on a log (first meeting). Optional **critter** (rabbit) that flees.
Hotspots: mushrooms (don't eat → death gag if used/eaten), big tree, the sad wolf (TALK = intro:
  wolf explains he's vegetarian, everyone fears him; he's hungry for *seeds*; points to his garden).
Puzzle: meeting the wolf opens the story. No hard gate; both paths open (garden + river).
Exits: back→forest_edge, garden→wolf_garden (up), fwd→river (right).

### scene06 wolf_garden — הגינה של הזאב
Art: surprisingly lovely veg garden — rows of carrots/tomatoes, sunflowers, a scarecrow, watering can, wolf's hut.
NPC: **wolf** tending plants.
Puzzle (core): USE **seeds** on wolf (or on the soil) → wolf overjoyed, becomes friend:
  setFlag(wolfFriend,true); score(10,'wolffriend'). Then wolf confides the TWIST: granny tried to skin him,
  shows/gives **evidence** (her hit-list note) → GAME.give('evidence'); setFlag(grannyTruth/knifeProof); score(10,'evidence').
  Wolf promises: "אם תצטרכי אותי שם — אבוא." (sets up finale rescue).
Exits: back→deep_forest.

### scene07 river — הנהר והגשר
Art: a river cutting through forest, a BROKEN wooden bridge (gap in the middle), far bank with a path, reeds, stones.
Hotspots: water (USE/look → "נראה עמוק"; trying to swim/cross without bridge → GAME.die('הזרם סחף אותך... סוף עצוב.')),
  reeds, broken bridge.
Puzzle: USE **plank** on the broken bridge gap → setFlag(bridgeFixed); score(10,'bridge'); now exit fwd works.
Exit fwd→granny_ext is GATED on bridgeFixed (else "אין מעבר, הגשר שבור").
Exits: back→deep_forest, fwd→granny_ext (gated).

### scene08 granny_ext — בית סבתא (חוץ)
Art: creepy-cute cottage at forest edge, crooked chimney, a garden GNOME, flower bed, locked door, dark window.
Hotspots: gnome (TAKE/look → find **key** under it: GAME.give('key'); score(5,'key')), window
  (onLook → glimpse knives/taxidermy inside → unease, hints grannyTruth), flowerbed, mailbox (jokey name "ד.צ. אכזרית").
Puzzle: USE **key** on door → unlocks; then exit 'in'→granny_int works. (Locked until key used.)
Exits: back→river, in→granny_int (gated on door unlocked flag e.g. GAME.flag('grannyDoorOpen')).

### scene09 granny_int — בית סבתא (פנים)
Art: dim cottage interior — bed with "granny" under covers, fireplace, a wall of KNIVES, a stuffed animal trophy,
  a table with a NOTE/list, rocking chair.
NPC: **granny** in bed (sweet façade). Use GAME.drawSprite(ctx,'granny',...).
Hotspots: knives wall (onLook → "אוסף... מרשים ומפחיד"), trophy (taxidermy → confirms psychopath),
  the note on table (onLook → confirms grannyTruth if not already), bed/granny (TALK → the inverted classic:
  "סבתא, איזה עיניים גדולות..." → granny's sugary-menacing replies).
Puzzle/branch:
  - TALK to granny gives the classic escalation. A CHOICE appears:
      • "להאשים אותה עכשיו" → if NOT has('evidence'): granny attacks → GAME.die('סבתא שלפה סכין...').
        if has('evidence'): proceed → goto finale (armed).
      • "להמשיך להעמיד פנים / לאסוף עוד" → stay.
  - Going fwd→finale also possible once grannyTruth known.
Exits: back→granny_ext, fwd→finale (the bedroom showdown). Make fwd require grannyTruth.

### scene10 finale — העימות
Art: dramatic close-up bedroom — granny rising from bed revealing butcher KNIFE, moonlight, the wolf's silhouette at the window/door.
Sequence (onEnter / scripted via say/speak/choice):
  - granny drops the act: "מה כיפה גדולה... כמה בשר." reveals knife ("איזה סכין גדולה יש לך, סבתא!").
  - WIN PATH: if wolfFriend && has('evidence'):
      Red shows the evidence + calls the wolf; wolf bursts in to help; granny is exposed & subdued
      → setFlag(grannyBeaten); score(20,'win'); GAME.win('כיפה והזאב הצמחוני הצילו את היום. הסבתא נלקחה לטיפול. גמרת ב-100/100!').
  - LOSE PATH: else → GAME.die('בלי חבר ובלי הוכחות, מול סכין... סוף ארור.').
Exits: back→granny_int (only before the showdown resolves).

---

## Items note — getting the cookie from the basket
In room/hood onward, add to the BASKET a way to extract a cookie: simplest = a hotspot is not ideal.
Implement in items.js: when player has 'basket' and uses it (a verb 'use' on... ) — too fiddly.
SIMPLER CANON: the woodcutter scene accepts `use basket on woodcutter` (give whole basket? no).
DECISION: give the player a 'cookie' automatically together with 'basket' is wrong (mom's gift for granny).
FINAL DECISION: In scene04, when the player USES the **basket** on the woodcutter, code does:
  if GAME.has('basket'){ GAME.give('cookie'); /* she sneaks one cookie out */ then treats as gave cookie }.
So 'cookie' need not be a separately findable item; the woodcutter interaction handles it. Keep 'cookie' registered
in items.js for inventory display in case a scene wants it. Woodcutter accepts `use basket` OR `use cookie`.

## Death scenes to sprinkle (Sierra charm) — keep funny, not gory
- river without bridge, eating forest mushrooms, grabbing the woodcutter's axe, accusing granny unarmed,
  jumping out the bedroom window. Each via GAME.die('...').
