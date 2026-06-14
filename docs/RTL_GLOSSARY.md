# כיפה ארסית — RTL & Slang Glossary

The shared reference for **all** dialogue in the game. Read this before writing any Hebrew string.
Goal: every line sounds like the same world — warm Israeli street comedy, never crude, never mean —
and every Hebrew character renders correctly inside an RTL bubble.

This file is **content guidance only**. For the engine API (how to *emit* text), see `CONTRACT.md`.
For who-says-what and the puzzle graph, see `GAME_SPEC.md`.

---

## 1. RTL writing rules (MANDATORY)

Hebrew reads **right-to-left**. The engine (`GAME.say` / `GAME.speak` / `GAME.choice`) handles the
bidi layout centrally, so you never touch raw `fillText`. But the *characters you type into the string*
still have to be correct. These rules are non-negotiable:

### Arrows: Hebrew uses `←`, never `→`
The arrow must point the way the eye is reading. In Hebrew that is right-to-left.

- ✅ `'יאללה, ליער ← קדימה'`  (the arrow points left, into the RTL flow)
- ❌ `'יאללה, ליער → קדימה'`  (points against the reading flow — looks broken)

Use the glyph `←` (U+2190). This applies **everywhere** a Hebrew string implies direction:
"next", "go to", transitions, list bullets, "and then". If a line is pure English, use `→` to match
English's left-to-right flow. Match the surrounding language.

> Exit chevrons drawn on the canvas (the `arrow:'right'`/`'left'` field on exits) are **art**, not text —
> they point at the physical doorway, so they follow the *scene geometry*, not reading direction.
> Only this arrow rule governs **arrows inside Hebrew strings**.

### Punctuation & numbers
- End-of-sentence punctuation (`.`, `!`, `?`, `…`) goes at the **logical end** of the Hebrew sentence —
  just type it after the last Hebrew word as normal. The engine renders it on the correct (left) side.
- Numbers and Latin words inside a Hebrew sentence (e.g. `100/100`, `1989`, `OK`) are fine — type them
  in natural reading order; bidi resolves them. Don't insert manual direction marks.
- Quotes around a phrase: use Hebrew-style `"..."` straddling the phrase as written, e.g.
  `'על הכרית כתוב "באלאגן זה סטייל".'` Keep the closing quote tight against the phrase.
- Apostrophes in transliterations (צ׳יל, ג׳וב) — prefer the Hebrew geresh `׳` (U+05F3) but a plain
  `'` is acceptable inside a JS single-quoted string only if escaped (`'צ\'יל'`). The geresh avoids escaping.

### Don't fight the engine
- No manual RTL/LTR markers (`‎`, `‏`) — the engine wraps text correctly. Adding them creates bugs.
- No leading/trailing spaces to "push" text around. Layout is centralized.
- One idea per `GAME.say` line. Queue multiple lines instead of cramming a paragraph into one bubble.

---

## 2. The cast voices (who sounds like what)

Emit speech through the per-character helpers (colors are set in `story.js`):
`GAME.RED(text)`, `GAME.MOM(text)`, `GAME.WOLF(text)`, `GAME.GRANNY(text)`.
Use `GAME.say(text)` for neutral narration (the white bar).

| Speaker | Helper | Register | Signature moves |
|---|---|---|---|
| כיפה (Red) | `GAME.RED` | chill street-smart ארסית, secretly sharp | full slang kit below; deadpan confidence |
| אמא (Mom) | `GAME.MOM` | loving guilt-trip | "אכלת משהו?", "תתקשרי כשתגיעי", soft worry |
| הזאב (Wolf) | `GAME.WOLF` | gentle, anxious, hipster-vegan | "אני בקטע של אוכל מהצומח", apologetic, sad |
| סבתא (Granny) | `GAME.GRANNY` | sugary façade, chilling subtext | sweet words + menace underneath ("מתוקה שלי...") |
| חוטב עצים (Woodcutter) | `GAME.say`/scene | grumpy, terse | drops hints, softens after the cookie |
| שכן/קיוסקאי (Neighbor) | `GAME.say`/scene | hood hustler, friendly | haggle banter, generous in the end |

---

## 3. Red's slang kit (the core glossary)

Red is the player and carries most of the comedy. Keep her **slangy and funny, never crude or mean**.
Sprinkle — don't drown. Roughly one slang beat per line; let the rhythm breathe.

| Term | Meaning / vibe | When to use | Example line |
|---|---|---|---|
| **סבבה** | cool / all good / fine | agreement, shrug-off, accepting a task | `GAME.RED('סל? סבבה. בוא נזרום ליער.')` |
| **וואלה** | "for real" / mild surprise / emphasis | reacting to something, opening a line | `GAME.RED('וואלה אחותי, את חתיכת לוֹּק.')` |
| **אחותי** | "sis" — warm address to a girl/woman (or self in the mirror) | addressing Mom/Granny warmly, self-hype | `GAME.RED('אחותי, תרגיעי, אני על זה.')` |
| **גבר / גברת** | "bro / lady" — address to a male/female | talking to Wolf (גבר), Granny/Mom (גברת) | `GAME.RED('גבר, אתה צמחוני? כל הכבוד.')` |
| **פצצה** | awesome / nailed it | something turned out great | `GAME.RED('מסדרת את הכיפה. פצצה.')` |
| **אש** | fire / amazing (strong praise) | peak hype, a great find | `GAME.RED('הגינה הזאת? אש. ממש אש.')` |
| **על הפנים** | terrible / lousy / depressing | something bad, gross, or sad | `GAME.RED('הגשר שבור? על הפנים, באמת.')` |
| **חבל עליך** | "you have no idea" / "trust me" / "don't even" | warning, big claim, or pity | `GAME.RED('סבתא מפחידה? חבל עליך כמה.')` |
| **יאללה ביי** | "let's bounce" / dismissive sign-off | leaving, ending a convo, brushing off | `GAME.RED('סיפור מצחיק, יאללה ביי, אני זזה.')` |
| **יאללה** | "c'mon / let's go" (softer than יאללה ביי) | starting to move, urging | `GAME.RED('יאללה, ליער.')` |
| **בוא נזרום** | "let's roll / go with the flow" | agreeing to move on, easygoing | `GAME.RED('בוא נזרום, אין סטרס.')` |
| **על זה** | "on it / I got this" | accepting a mission confidently | `GAME.RED('המשימה? אני על זה.')` |
| **תרגיע/תרגיעי** | "chill / relax" | calming an anxious character (esp. Wolf) | `GAME.RED('תרגיע גבר, אני בעדך.')` |
| **לוֹּק** | "look / style" | complimenting appearance | `GAME.RED('כיפה אדומה? כיפה אֲדִירָה. איזה לוק.')` |
| **אין מצב** | "no way / unbelievable" | shock, refusal, disbelief | `GAME.RED('אין מצב שאני שוחה בנהר הזה.')` |
| **אחי** | "bro/dude" — casual filler address | to self, to anyone, low-key | `GAME.RED('יש לי כבר סל, אחי.')` |

### Usage notes
- **Don't stack.** "וואלה אחי סבבה פצצה" is noise. Pick one flavor per line.
- **אחותי / גבר / גברת are address forms** — they point at *who she's talking to*. Match the listener's
  gender: Wolf = `גבר`, Granny/Mom = `גברת`/`אחותי`, herself/the mirror = `אחותי`.
- **אש vs פצצה:** both mean "great". `פצצה` for a satisfying small win; `אש` for genuine awe (the garden).
- **על הפנים vs חבל עליך:** `על הפנים` = it's bad/sad. `חבל עליך` = an *intensifier* ("you can't imagine
  how much") — can be positive ("חבל עליך כמה טוב") or a warning ("חבל עליך כמה היא מפחידה").
- **יאללה ביי** is a *sign-off* (leaving / brushing off), not a greeting. Don't open a line with it.
- **Keep it clean.** Slangy ≠ vulgar. The canonical room scene self-censors (`איזה כיף, נ#$%`) — that masked
  beat is the *ceiling* for edginess. Stay warm. Punch up at situations, never down at people.

---

## 4. Quick do / don't

**Do**
- One idea per bubble; queue multiple `GAME.say`/`RED` calls for a beat.
- Use `←` in every Hebrew string that implies direction.
- Let each character keep their register (Wolf stays soft even when Red is cocky).
- Plant the granny dread softly — sugary words, cold subtext.

**Don't**
- ❌ Use `→` inside Hebrew text.
- ❌ Raw `fillText` / `document` / `window` for Hebrew — only `GAME.say/speak/choice`.
- ❌ Manual bidi marks or padding spaces.
- ❌ Crude, cruel, or mean jokes. Warm street comedy only.
- ❌ Slang word-salad — sprinkle, don't dump.

---

## 5. Mini phrasebook (reusable, on-brand)

Copy-paste starters that already fit the tone:

- Accepting a task: `GAME.RED('סבבה, אני על זה. בוא נזרום.')`
- Reacting to good news: `GAME.RED('וואלה? אש. ממש אש.')`
- Reacting to bad news: `GAME.RED('על הפנים. מה עושים עכשיו?')`
- Brushing something off: `GAME.RED('יאללה ביי, אין לי כוח לזה.')`
- Calming the wolf: `GAME.RED('תרגיע גבר. אני בעדך, צמחוני שכמוך.')`
- Self-hype at a mirror: `GAME.RED('אחותי, את פצצה. כיפה אֲדִירָה.')`
- Heading to the next area: `GAME.say('יאללה, קדימה ← היער קורא.')`
- Granny menace template: `GAME.GRANNY('בואי מתוקה שלי... יש לי בדיוק... משהו בשבילך.')`
- Wolf hipster template: `GAME.WOLF('אני בקטע של אוכל מהצומח. גרעינים? זה החיים שלי.')`
- Mom guilt template: `GAME.MOM('רק שתגיעי בשלום. ותתקשרי. ואכלת משהו?')`
