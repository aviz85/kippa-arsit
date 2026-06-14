# כיפה ארסית — COMEDY & EASTER EGGS

The joke bible. A living bank of gags, look-at one-liners, graffiti puns, item descriptions,
Israeli-street references and meta-Sierra winks — organized by scene so scene agents can drop them
straight into `onLook` / `onTalk` / `onUse` / item `desc` without reinventing the tone.

**Tone law (from GAME_SPEC):** warm Israeli street comedy. Slangy, funny, generous — *never* crude or mean.
Punch up at the genre and at clichés, never down at people. Granny's menace is played for chills-with-a-wink,
not gore.

**Hebrew arrows:** in Hebrew strings always use `←` (reading flows right-to-left). Never `→`.

**Voice cheat-sheet:**
- **כיפה (RED):** "סבבה / וואלה / אחותי / על הפנים / פצצה / יאללה ביי / אחי / תכל'ס".
- **אמא (MOM):** loving guilt-trip. "מתי תתקשרי? / לא אכלת כלום / תכסי את הצוואר".
- **הזאב (WOLF):** soft hipster vegan. "אני בקטע של אוכל מהצומח / זה מאוד מרגיע אותי / בלי לחץ".
- **סבתא (GRANNY):** sugar over a blade. "מתוקה שלי..." with a subtext that freezes the room.

> Numbering is for reference only — agents pick what fits their scene; not every line must ship.

---

## scene00 — intro / title

1. **Meta-Sierra cold open.** Narration: `GAME.say('1989. מסך טעינה היה לוקח 4 דקות. תהנו מהזמן שחסכנו לכם.')`
2. **Disk-swap gag.** `GAME.say('הכניסו דיסקט 2 מתוך 47. (סתם, אין דיסקטים, זה דפדפן.)')`
3. **Press-any-key classic.** RED one-liner over the title: `GAME.RED('לחצי על משהו, אחותי. כל החיים מחכים ללחיצה.')`

## scene01 — room_red — החדר של כיפה
*(canonical scene already ships the mirror & poster gags — these extend the bank, don't duplicate)*

4. **Mirror flex (shipped variant ok):** `GAME.RED('כיפה אדומה? כיפה אֲדִירָה. תסתכלו ותלמדו.')`
5. **The poster autograph:** `GAME.say('חתום: "להישאר ערס — תודה." היד רעדה לו מהתרגשות.')`
6. **Closet / drawer easter egg (if scene adds one):** `GAME.say('בפנים: 14 זוגות אותן גרביים לבנות. הקלאסיקה לא מתווכחים איתה.')`
7. **Phone charger gag:** `GAME.RED('מטען. 1989 ואין לי מה להטעין. הקדמתי את זמני, מה לעשות.')`

## scene02 — living_room — הסלון

8. **TV telenovela:** `GAME.say('בטלוויזיה: טלנובלה. הגיבורה גילתה שאחותה התאומה היא בעצם הדודה. דרמה.')`
9. **TV — Sierra wink:** `GAME.RED('כפתורים מלאים, ערוץ אחד. כמו משחקי הרפתקה — נראה עשיר, יש מסלול אחד.')`
10. **The granny photo (foreshadow, played light):** `GAME.say('סבתא הצעירה בתמונה. מחזיקה... זה גזר? למה היא מחזיקה אותו ככה? נו, סבתא.')`
    Second look after meeting the wolf (gate on grannyTruth): `GAME.say('עכשיו כשמסתכלים שוב — זה ממש לא גזר. אוי ואבוי.')`
11. **The couch:** `GAME.RED('הספה הזאת בלעה את כל השלטים מאז 85\'. בולאגן זה סטייל.')`
12. **MOM guilt-trip on exit attempt without basket:** `GAME.MOM('בלי הסל את לא זזה! ומה, לא תתקשרי לאמא מהיער? תשמרי שדה כיסוי.')`
13. **The rug:** `GAME.say('שטיח פרסי שעבר 3 דירות, 2 חתולים וחתונה אחת. ניצול.')`

## scene03 — hood — השכונה

14. **Graffiti pun #1:** `GAME.say('על הקיר רוסס: "כיפה הייתה כאן. גם הצבע."')`
15. **Graffiti pun #2 (street-art classic):** `GAME.say('"אוסטרליה ביי" וליד זה חץ ← שמצביע ישר על הקיר. הכיוון ברור, התקציב פחות.')`
16. **Graffiti pun #3 (love):** `GAME.say('בתוך לב מרוסס: "ד. + כיפה". סבתא ד.? לא, לא נחשוב על זה עכשיו.')`
17. **The kiosk — seeds haggle:** NEIGHBOR: `GAME.speak('קיוסקאי','גרעינים? יש שחורים, יש לבנים, יש מלוחים שלוקחים לך שנתיים מהחיים. קח, מתנה.')`
18. **Kiosk meta gag:** `GAME.say('בקיוסק: במבה, ביסלי, ושלט "אין אשראי, אין רֵסטוֹר, אין רחמים." רוח של פוליס קווסט.')`
19. **The scooter:** `GAME.RED('קטנוע. אין מפתח, אין קסדה, אין ביטוח. כלומר — מושלם. אבל לא היום.')`
    Try to take it: `GAME.RED('לגנוב קטנוע בשכונה שלי? אני ארסית עם ערכים, אחי.')`
20. **The palm tree:** `GAME.say('דקל בודד באמצע אספלט. שורד יותר טוב מרוב מערכות היחסים פה.')`

## scene04 — forest_edge — כניסה ליער

21. **The sign:** `GAME.say('שלט: "יער". מתחת, בכתב יד: "כן, יער. מה ציפית."')`
22. **The axe — death gag (grabbing it):** WOODCUTTER: `GAME.speak('חוטב','אל הגרזן. נגעת — הלכת.')` → `GAME.die('החוטב לא מתבדח לגבי הגרזן. סוף חד.')`
23. **Woodcutter softening (after cookie):** `GAME.speak('חוטב','...עוגיה. עברו שנים. טוב, קחי קרש. ותשמרי מהזקנה — היא לא מה שנדמה.')`
24. **The log pile:** `GAME.RED('ערימת בולים מסודרת בול לבול. מישהו פה עם בעיות שצריך לטפל בהן.')`
25. **The stump (taking a seat):** `GAME.RED('שבתי על הגזע רגע. וואלה, מדיטציה ביער. הזאב היה גאה.')`

## scene05 — deep_forest — עומק היער

26. **Mushrooms — death gag (eating):** `GAME.RED('פטרייה ביער מסתורי? מה הכי גרוע שיק...')` → `GAME.die('הפטרייה הייתה דעה. עכשיו את חלק מהיער. ספרותי, אבל מת.')`
27. **The fleeing rabbit:** `GAME.say('ארנב הציץ, ראה אותך, נזכר בפגישה דחופה, ונעלם.')`
28. **First meeting the wolf — subverting the cliché:** WOLF: `GAME.speak('הזאב','שלום... בבקשה אל תצרחי. אני בקטע של אוכל מהצומח. צרחות זה ממש מלחיץ אותי.')`
29. **Wolf continues:** `GAME.speak('הזאב','כולם בורחים ממני. ואני רק רוצה גרעינים וקצת שקט. את הראשונה שלא ברחה. תודה.')`
30. **The big tree:** `GAME.say('עץ ענק עם חריטה: "א.ק. אהב את כ.ק." ולמטה: "תיקון: כ.ק. לא ידעה." דרמת יער.')`

## scene06 — wolf_garden — הגינה של הזאב

31. **Garden reveal:** `GAME.RED('זאב עם גינת ירק? יש פה עגבניות יותר מסודרות מהחיים שלי. כל הכבוד, אחי.')`
32. **The scarecrow:** `GAME.say('הדחליל לבוש בסווצ\'ר. הזאב: "הוא קצת קר לו. גם לדחלילים מגיע חום." איזה נשמה.')`
33. **Giving seeds — the win beat:** WOLF: `GAME.speak('הזאב','גרעינים שחורים?! בשבילי?! אחותי... זאת המתנה הכי יפה שקיבלתי. אנחנו חברים עכשיו, רשמית.')`
34. **The evidence handover (chills-with-a-wink):** WOLF: `GAME.speak('הזאב','תראי את הפתק הזה. סבתא שלך הפילה אותו. כתוב: "1. הזאב 2. ?" אני מאוד לא אוהב להיות מספר אחת ברשימה הזאת.')`
35. **Wolf's promise (sets up finale):** `GAME.speak('הזאב','אם תצטרכי אותי שם — אבוא. בלי לחץ, אבל אבוא. חברים זה חברים.')`
36. **Watering can:** `GAME.RED('הוא מדבר לעגבניות. הן ענו לו. שתינו צריכים לישון יותר.')`

## scene07 — river — הנהר והגשר

37. **The broken bridge:** `GAME.say('גשר עם חור באמצע. מי שתכנן אותו תכנן גם את החיים שלי, כנראה.')`
38. **Water — death gag (swimming without bridge):** `GAME.RED('זרם? סבבה, אני שחיינית.')` → `GAME.die('הזרם סחף אותך... סוף עצוב. ולא, לא היית שחיינית.')`
39. **Fixing with plank — meta puzzle wink:** `GAME.RED('קרש על חור. זה כל הפאזל? אחי, פתרתי משחקי הרפתקה בשביל זה.')` → `GAME.say('הגשר תוקן. הנדסה ברמה של כיתה ב\', אבל עובד.')`
40. **The reeds:** `GAME.say('קנים. מתאים לחליל, לא מתאים לגשר. ניסיון יפה, מחשבה שגויה.')`

## scene08 — granny_ext — בית סבתא (חוץ)

41. **The mailbox name:** `GAME.say('על תיבת הדואר: "ד.צ. אכזרית". חשבת שזה ראשי תיבות חמודים. זה לא.')`
42. **The gnome (finding the key):** `GAME.RED('גמד גינה. מתחתיו... מפתח חלוד. וגם משהו שלא נסתכל עליו יותר מדי.')`
43. **The window — first dread:** `GAME.say('דרך החלון: קיר מלא סכינים מבריקות וחיה ממולאת שמסתכלת עליך. "חמוד" זו לא המילה.')`
44. **The flowerbed (dark-cute):** `GAME.say('ערוגת פרחים מטופחת להפליא. שלט קטן: "כאן גדל אהוב/ה". בלי שם. נחמד? מפחיד? כן.')`
45. **The crooked chimney:** `GAME.RED('הארובה עקומה. הבית עקום. משהו פה עקום, ואני לא מדברת על אדריכלות.')`

## scene09 — granny_int — בית סבתא (פנים)

46. **The knife wall:** `GAME.say('קיר שלם של סכינים, ממוין לפי גודל. "אוסף", סבתא אמרה. אוסף... מרשים ומפחיד.')`
47. **The taxidermy trophy:** `GAME.say('חיה ממולאת על המדף, מחייכת חיוך שאסור לחיות מתות לחייך.')`
48. **The note on the table:** `GAME.say('פתק: "1. הזאב 2. ?" המספר 2 ריק. את ממש לא רוצה למלא את החלל הזה.')`
49. **The inverted classic — "what big eyes" (RED leads):** `GAME.RED('סבתא, איזה עיניים גדולות יש לך...')` → GRANNY: `GAME.speak('סבתא','כדי לראות אותך טוב יותר, מתוקה שלי. כל-כך טוב.')`
50. **...big hands:** RED: `GAME.RED('ואיזה ידיים גדולות...')` → GRANNY: `GAME.speak('סבתא','כדי לחבק אותך חזק. ולא לתת לך ללכת. לעולם.')`
51. **The rocking chair:** `GAME.say('כיסא נדנדה שמתנדנד לבד. אין רוח. אין הסבר. יאללה ביי.')`

## scene10 — finale — העימות

52. **Granny drops the act:** `GAME.speak('סבתא','מה כיפה גדולה... כמה בשר. ישבתי כל-כך הרבה זמן בשביל הרגע הזה.')`
53. **The classic flipped into the reveal — "what a big knife":** `GAME.RED('ואיזה סכין גדולה יש לך, סבתא!')` → GRANNY: `GAME.speak('סבתא','כדי לפרק אותך יפה-יפה, אהובה. אל תיקחי את זה אישית.')`
54. **WIN beat — Red calls the wolf:** `GAME.RED('פתק ביד, חבר בדלת. את גמרת, סבתא. הזאב הצמחוני בא להציל ארסית. מי היה מאמין.')`
55. **WIN — wolf bursts in:** WOLF: `GAME.speak('הזאב','סליחה שאני מאחר! חיפשתי חניה ליער. סבתא — זה נגמר.')`
56. **WIN screen:** `GAME.win('כיפה והזאב הצמחוני הצילו את היום. הסבתא נלקחה לטיפול. גמרת ב-100/100! יאללה ביי, סבתא.')`
57. **LOSE beat (no wolf / no evidence):** `GAME.die('בלי חבר ובלי הוכחות, מול סכין... סוף ארור. תשמרי בנקודה אחרת בפעם הבאה.')`

---

## Cross-scene running gags (sprinkle, don't overuse)

- **"אוסטרליה ביי":** the hood's universal goodbye. Reuse on at least two scene exits as RED's mutter.
- **גרעינים as currency/love-language:** the wolf measures affection in sunflower seeds; the kiosk measures life in them.
- **Meta-Sierra "save your game":** any genuinely dangerous spot, RED can mutter `GAME.RED('רגע טוב לשמור משחק. אם היה לי כפתור כזה בחיים.')`
- **"בלאגן זה סטייל":** Red's life philosophy, callback from the room.
- **The empty "2. ?" on granny's list:** the engine of dread — referenced in garden, ext window, interior note. Pays off at finale.

## Item descriptions (for js/items.js — warm one-liners)

- **basket / הסל:** `'סל קש עם חטיפים לסבתא. אמא ארזה באהבה ובחרדה, חצי-חצי.'`
- **cookie / עוגיה:** `'עוגיה מהסל. סוחטת לב של חוטבי עצים מרירים מאז 1812.'`
- **seeds / גרעינים:** `'חבילת גרעינים שחורים. מטבע השכונה, שפת האהבה של הזאב.'`
- **plank / קרש:** `'קרש עץ ארוך. פתרון של פאזל הרפתקה קלאסי שמחכה לחור מתאים.'`
- **key / מפתח:** `'מפתח חלוד מתחת לגמד. נפתח דלתות וגם כמה שאלות לא נעימות.'`
- **evidence / הוכחה:** `'פתק של סבתא: "1. הזאב 2. ?" ההוכחה שהופכת ארסית לבלשית.'`

## Death-screen one-liners (Sierra charm, never gory)

- River: `'הזרם סחף אותך... סוף עצוב. ולא, לא היית שחיינית.'`
- Mushroom: `'הפטרייה הייתה דעה. עכשיו את חלק מהיער.'`
- Woodcutter's axe: `'החוטב לא מתבדח לגבי הגרזן. סוף חד.'`
- Accusing granny unarmed: `'סבתא שלפה סכין מהר ממך. בלי הוכחה זה רק קטטה. סוף ארור.'`
- Bedroom window jump: `'קפצת מהחלון כמו בסרט. החיים הם לא סרט. סוף קליל-קשה.'`
</content>
</invoke>
