# כיפה ערסית — Death Screens (Sierra one-liners)

Sierra-style death messages, Hebrew, dark-comic but light — warm Israeli street comedy, never gory.
Each line is passed verbatim to `GAME.die('...')`. The engine handles the "מת/ה!" banner + Restore/Restart.

## Authoring rules
- Tone: funny first, "death" second. The joke softens the blow. Never crude, never mean.
- Keep each line 1–2 sentences. Punchy. Read it out loud — if it doesn't get a smirk, rewrite.
- Hebrew arrows use ← (not →) inside Hebrew strings.
- Apostrophes inside JS strings must be escaped: `'הזרם סחף אותך... כיפה ספרינט.'` — or use the line as-is below.
- Each line maps to a `GAME.die(...)` call in the scene that owns the hazard (see "Used in").

## The deaths

1. **Swimming the river (no bridge)** — scene07 river
   > `הזרם לקח אותך כמו פליימוביל בג'קוזי. כיפה אדומה? יותר כיפה כחולה.`

2. **Eating the forest mushrooms** — scene05 deep_forest
   > `אכלת פטריית יער אקראית. עכשיו את רואה את סבתא רוקדת סלסה. זה לא טוב.`

3. **Grabbing the woodcutter's axe** — scene04 forest_edge
   > `נגעת לחוטב בגרזן. הוא מאוד ביקש שלא. מנוחתך עדן, אחותי.`

4. **Accusing granny unarmed (no evidence)** — scene09 granny_int
   > `האשמת את סבתא בלי הוכחה. היא חייכה, שלפה סכין, והפסקת להאשים. בכלל.`

5. **Jumping the bedroom window** — scene10 finale / scene09
   > `קפצת מהחלון בלי תוכנית. הגינה של סבתא רכה — בערך כמו בטון. סוף.`

6. **Facing granny without befriending the wolf** — scene10 finale
   > `באת לעימות לבד, בלי הזאב. סבתא אוהבת אורחים. במיוחד טריים. ביי.`

7. **Touching the wall of knives** — scene09 granny_int
   > `"רק אבדוק אם זה חד" — בדקת. זה היה חד. שיעור יקר, תשלום סופי.`

8. **Petting the taxidermy trophy** — scene09 granny_int
   > `ליטפת את החיה המפוחלצת. היא לא הגיבה. אבל סבתא כן. אופס.`

9. **Drinking from granny's "תה מיוחד"** — scene09 granny_int
   > `שתית את התה של סבתא. טעם של אהבה ושל משהו עם שם בלטינית. לילה טוב.`

10. **Provoking the woodcutter past his patience** — scene04 forest_edge
    > `התעקשת לקרוא לחוטב "כפרה" עוד פעם אחת. היער שקט עכשיו. שקט מדי.`

## Used in (per-scene mapping for implementing agents)
| # | Hazard | Scene file | Trigger |
|---|--------|-----------|---------|
| 1 | swim river | scene07 river | USE/walk into water without `bridgeFixed` |
| 2 | eat mushrooms | scene05 deep_forest | USE/TAKE+eat mushrooms |
| 3 | grab axe | scene04 forest_edge | TAKE axe |
| 4 | accuse granny unarmed | scene09 granny_int | choice "להאשים" without `has('evidence')` |
| 5 | jump window | scene10 finale | USE/walk window during showdown |
| 6 | face granny solo | scene10 finale | enter showdown without `wolfFriend` |
| 7 | knives wall | scene09 granny_int | USE/TAKE knives |
| 8 | pet taxidermy | scene09 granny_int | TAKE/USE trophy |
| 9 | granny's tea | scene09 granny_int | drink offered tea |
| 10 | provoke woodcutter | scene04 forest_edge | repeat-talk insult loop |

> Sprinkle these for Sierra charm — death is part of the comedy, never the cruelty.
