# כיפה ערסית — INTRO & ENDING (Design Doc)

Design reference for the **scene00 intro cutscene** and the **scene10 finale**.
All Hebrew text MUST go through `GAME.say` / `GAME.speak` (`GAME.RED/MOM/WOLF/GRANNY`) — never raw canvas text.
Hebrew arrows use `←` (RTL), never `→`. Tone: warm Israeli street comedy, slangy, never crude.
Consistent with `GAME_SPEC.md` (finale win/lose conditions) and `CONTRACT.md` (engine API).

---

## (a) INTRO — scene00 storybook cutscene

A short "once upon a time" narration that sets up the premise with a wink, then hands off to
gameplay in `room_red`. Implement as a sequence of queued `GAME.say(...)` lines (storybook narrator
voice), optionally with one `GAME.RED(...)` button at the end, then `GAME.goto('room_red')`.

The narration is the white message bar — player clicks/space to advance each line.

### Narration sequence (queue in order)

1. `GAME.say('היה הייתה, פעם, אי-שם בשכונה שגובלת ביער — ילדה אחת. קוראים לה כיפה.');`
2. `GAME.say('לא "כיפה אדומה" מהספרים. כיפה עֲרְסִית. מלכת הרחוב, שרשרת זהב, אֶנֶרְגְיוֹת.');`
3. `GAME.say('אמא שלה ביקשה ממנה לקפוץ לסבתא עם סל חטיפים. בקטע, מה כבר יכול לקרות?');`
4. `GAME.say('מה שכיפה לא יודעת: ביער חי זאב. זאב צמחוני, רגיש, שכולם פוחדים ממנו בטעות.');`
5. `GAME.say('ומה שאף אחד לא יודע: סבתא המתוקה... היא לא בדיוק מה שנדמה. בכלל לא.');`
6. `GAME.say('יאללה. הסיפור הכי מוכר בעולם — רק שהפעם, את הסוף את כותבת.');`

Then a single closing line in Red's voice as a hook into gameplay, and transition:

```js
GAME.onMsgDone(()=>{
  GAME.RED('סבבה, בוא נזרום. ← היער, אני באה.');
  GAME.onMsgDone(()=> GAME.goto('room_red'));
});
```

### Notes for the scene00 art agent
- Storybook framing: a calm wide shot — silhouette of the hood blocks on the right, dark green
  forest tree-line on the left, a warm dawn `GAME.gradV` sky. Optional small `red` sprite walking
  silhouette mid-frame to anchor it. Keep it static & atmospheric; the comedy lives in the text.
- No hotspots, no walkbox interaction needed — it's a pure cutscene that auto-advances on click.
- 6 lines is the sweet spot (brief, sets the three-way premise: Red / vegetarian Wolf / psycho Granny).

---

## (b) FINALE — scene10 beats, victory text & alternate flavor

Per `GAME_SPEC.md` scene10: granny rises from the bed, drops the sweet act, reveals the butcher
knife. The branch is decided by the win condition.

**WIN CONDITION (engine check):** `GAME.flag(F.wolfFriend) === true && GAME.has('evidence')`.
- WIN → expose granny, call the wolf, subdue her, `setFlag(grannyBeaten)`, `score(20,'win')`, `GAME.win(...)`.
- LOSE → unarmed / no friend → `GAME.die(...)`.

### Finale beat sheet (script in `onEnter` via say/speak, then resolve)

1. **The act drops.** Granny's sugary voice curdles.
   - `GAME.GRANNY('בואי, בואי קרוב, מותק... סבתא רעבה היום.', ...);`
   - `GAME.say('סבתא קמה מהמיטה. השמיכה נופלת — ומתחתיה נוצצת סכין קצבים ענקית.');`
2. **The classic line, inverted.** Red delivers the famous beat as deadpan street snark.
   - `GAME.RED('וואלה סבתא... איזו סכין גדולה יש לך.');`
   - `GAME.GRANNY('כל הטוב יותר כדי לפרק אותך, יקירה. ואת הזאב — ראשון.', ...);`
3. **The fork** — resolved automatically by the win condition (no extra choice needed here; the
   meaningful CHOICE already happened in `granny_int`). Engine evaluates `wolfFriend && has('evidence')`:

#### WIN PATH (`wolfFriend && has('evidence')`)
- `GAME.RED('סכין? יש לי משהו יותר חד.');`
- `GAME.say('כיפה מניפה את הפתק — רשימת ה"ציד" של סבתא. "1. הזאב. 2. ?"');`
- `GAME.GRANNY('מאיפה לקחת... תני לי את זה!', ...);`
- `GAME.RED('זאב! עכשיו!');`
- `GAME.say('החלון מתנפץ — הזאב הצמחוני זינק פנימה, עדין אבל ענק. סבתא קפאה.');`
- `GAME.WOLF('סליחה שאני מאחר. הייתי באמצע להשקות עגבניות.', ...);`
- `GAME.say('הסכין נפלה. הסבתא נכבשה בלי טיפת אלימות — רק נוכחות ופתק מפליל.');`
- then:
```js
GAME.setFlag(F.grannyBeaten, true);
GAME.score(20,'win');
GAME.win('כיפה והזאב הצמחוני הצילו את היום. הסבתא נלקחה לטיפול, היער נושם לרווחה, והזאב סוף-סוף קיבל חיבוק. גמרת ב-100/100. סבבה לגמרי. ←');
```

#### LOSE PATH (missing wolf friend OR missing evidence)
```js
GAME.die('עמדת מול הסכין לבד, בלי חבר ובלי הוכחה. לפעמים הרחוב לא מספיק. סוף ארור.');
```

### Victory text (canonical string — use exactly)
> כיפה והזאב הצמחוני הצילו את היום. הסבתא נלקחה לטיפול, היער נושם לרווחה, והזאב סוף-סוף קיבל חיבוק. גמרת ב-100/100. סבבה לגמרי. ←

### Alternate ending flavor lines (pick 1–2 to sprinkle / for replays or stinger after win)
- `GAME.WOLF('אם אי-פעם תרצי גרעינים — הגינה פתוחה. בלי בשר, מבטיח.', ...);`
- `GAME.RED('הזאב הכי מפחיד ביער? מסתבר שהוא צמחוני שמפחד מעכבישים. כל הכבוד למי שלא שופט לפי שמועות.');`
- `GAME.say('שמועה אומרת שהסבתא פתחה בטיפול חוג קרמיקה. בלי סכינים. בינתיים.');`
- `GAME.say('ובכל זאת... מתחת לגמד בגינה עדיין מסתתר מפתח אחד. למי הוא? סיפור לפעם אחרת. ←');`

### Tone guardrails
- Comedy stays warm: Red wins by being sharp and loyal, not by being cruel. Granny is "taken for
  treatment," not harmed — the joke is the inversion (sweet granny = real monster; scary wolf = softie),
  never gore.
- Death screens are playful-fatalistic, classic Sierra, never mean-spirited.
