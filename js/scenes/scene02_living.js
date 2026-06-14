/* scene02_living.js — הסלון (full scene) */
(function(){
  const C=GAME.C, F=GAME.STORY.flags;

  GAME.registerScene({
    id:'living_room',
    name:'הסלון',
    entry:{ x:48, y:178, dir:'right' },
    walkbox:[ {x:14,y:160,w:292,h:32} ],
    scale:{ near:1.0, far:0.82, horizon:158 },

    drawBackground(ctx){
      // ---- walls (warm worn beige with a dither) ----
      GAME.rect(ctx,0,0,320,160,C.tan);
      GAME.dither(ctx,0,0,320,160,C.tan,C.brown);
      // skirting board
      GAME.rect(ctx,0,150,320,4,C.darkRed);
      // ---- floor (carpet-brown) ----
      GAME.rect(ctx,0,158,320,42,C.brown);
      GAME.dither(ctx,0,158,320,42,C.brown,C.dkGray);
      GAME.line(ctx,0,160,320,160,C.black);

      // ---- window (top-left) with morning hood sky ----
      GAME.box(ctx,18,26,58,52,C.black);
      GAME.gradV(ctx,20,28,54,48,C.cyan,C.blue);
      GAME.line(ctx,47,28,47,76,C.black);     // mullion vertical
      GAME.line(ctx,20,52,74,52,C.black);     // mullion horizontal
      GAME.rect(ctx,16,24,62,3,C.dkGray);     // curtain rail
      GAME.rect(ctx,14,27,6,52,C.darkRed);    // curtain L
      GAME.rect(ctx,74,27,6,52,C.darkRed);    // curtain R
      // a building + a tiny palm across the street
      GAME.rect(ctx,24,40,14,30,C.gray); GAME.px(ctx,28,46,C.yellow); GAME.px(ctx,32,54,C.yellow);
      GAME.rect(ctx,62,58,2,16,C.darkGreen); GAME.ellipse(ctx,63,56,5,4,C.green);

      // ---- framed photo of young-but-too-intense granny ----
      GAME.box(ctx,150,20,40,46,C.gold);
      GAME.box(ctx,151,21,38,44,C.brown);     // inner frame bevel
      GAME.rect(ctx,152,22,36,42,C.dkGray);
      GAME.rect(ctx,160,30,20,18,C.skin);     // face
      GAME.rect(ctx,160,30,20,1,C.tan);       // forehead highlight
      GAME.rect(ctx,158,26,24,6,C.gray);      // grey hair (set too perfectly)
      GAME.rect(ctx,158,26,24,1,C.ltGray);    // hair highlight
      GAME.rect(ctx,163,38,3,2,C.black); GAME.rect(ctx,174,38,3,2,C.black); // wide unblinking eyes
      GAME.px(ctx,164,38,C.white); GAME.px(ctx,175,38,C.white);             // a cold glint in each eye
      GAME.line(ctx,162,35,167,36,C.black); GAME.line(ctx,173,36,178,35,C.black); // arched brows
      GAME.rect(ctx,166,44,8,2,C.darkRed);    // tight, too-wide smile
      GAME.rect(ctx,168,49,4,10,C.purple);    // dress
      GAME.rect(ctx,170,52,8,2,C.orange);     // she's gripping... a "carrot"
      GAME.px(ctx,177,52,C.gold);             // ...with a suspiciously bright tip

      // ---- CRT TV on a low stand (right of center) ----
      GAME.rect(ctx,206,92,70,52,C.dkGray);   // TV body
      GAME.rect(ctx,206,92,70,2,C.gray);      // top-left case highlight
      GAME.box(ctx,206,92,70,52,C.black);
      GAME.rect(ctx,212,98,50,38,C.darkBlue); // screen
      GAME.dither(ctx,212,98,50,38,C.darkBlue,C.blue);
      GAME.rect(ctx,222,108,30,18,C.pink);    // telenovela faces glow
      GAME.px(ctx,230,114,C.black); GAME.px(ctx,242,114,C.black); // two staring faces
      GAME.rect(ctx,228,120,18,2,C.darkRed);  // a dramatic lipstick smear of a scene
      GAME.line(ctx,213,104,261,104,C.blue);  // CRT scanline
      GAME.line(ctx,213,118,261,118,C.blue);  // CRT scanline
      GAME.line(ctx,213,132,261,132,C.blue);  // CRT scanline
      GAME.px(ctx,258,100,C.white);           // screen corner glare
      GAME.rect(ctx,264,100,10,32,C.gray);    // knobs panel
      GAME.px(ctx,268,106,C.black); GAME.px(ctx,268,114,C.black); GAME.px(ctx,268,122,C.black);
      GAME.rect(ctx,216,86,4,8,C.gray); GAME.rect(ctx,256,84,4,10,C.gray); // rabbit-ear antennas
      GAME.px(ctx,217,84,C.ltGray); GAME.px(ctx,257,82,C.ltGray);          // foil-ball antenna tips
      GAME.rect(ctx,214,144,54,8,C.brown); GAME.box(ctx,214,144,54,8,C.black); // stand
      GAME.rect(ctx,222,152,4,6,C.black); GAME.rect(ctx,256,152,4,6,C.black); // legs

      // ---- couch (foreground left-center) ----
      GAME.rect(ctx,86,118,104,30,C.darkRed);     // back
      GAME.rect(ctx,86,118,104,2,C.red);          // top-left back highlight
      GAME.box(ctx,86,118,104,30,C.black);
      GAME.rect(ctx,80,130,116,24,C.red);         // seat block
      GAME.box(ctx,80,130,116,24,C.black);
      GAME.rect(ctx,80,124,12,30,C.darkRed);      // arm L
      GAME.box(ctx,80,124,12,30,C.black);
      GAME.rect(ctx,184,124,12,30,C.darkRed);     // arm R
      GAME.box(ctx,184,124,12,30,C.black);
      GAME.box(ctx,98,122,38,16,C.darkRed); GAME.box(ctx,140,122,38,16,C.darkRed); // cushions
      GAME.dither(ctx,80,130,116,8,C.red,C.darkRed); // worn sag in the seat
      GAME.line(ctx,138,130,138,154,C.darkRed);   // seat seam between two saggy halves
      GAME.px(ctx,176,140,C.gold);                // a lost coin caught in the cushions

      // ---- persian rug on the floor ----
      GAME.rect(ctx,108,166,108,22,C.purple);
      GAME.box(ctx,108,166,108,22,C.gold);
      GAME.dither(ctx,112,170,100,14,C.purple,C.darkRed);
      GAME.box(ctx,140,172,44,10,C.gold);   // central medallion
      GAME.px(ctx,162,177,C.yellow);

      // ---- kitchen doorway (far right) ----
      GAME.rect(ctx,290,86,30,74,C.black);
      GAME.rect(ctx,292,88,26,72,C.dkGray);     // dark kitchen beyond
      GAME.dither(ctx,292,88,26,72,C.dkGray,C.black);
      GAME.rect(ctx,300,96,12,16,C.brown);      // a cabinet glimpse
      GAME.box(ctx,288,84,34,4,C.brown);        // door lintel

      // ---- exit arch back to room (far left) ----
      GAME.rect(ctx,0,86,16,74,C.black);
      GAME.rect(ctx,2,88,12,72,C.darkRed);
      GAME.dither(ctx,2,88,12,72,C.darkRed,C.black);
    },

    hotspots:[
      // ---------- COUCH ----------
      { id:'couch', name:'הספה', rect:{x:80,y:118,w:116,h:36}, near:{x:138,y:172},
        onLook(){ GAME.RED('הספה הזאת בלעה את כל השלטים מאז 85\'. בלאגן זה סטייל.'); GAME.score(2,'couch'); },
        onTake(){ GAME.RED('מה אני אסחב ספה לסבתא? היא כבדה מהדרמה של הטלנובלה.'); },
        onUse(){ GAME.RED('שבתי שנייה. הספה בלעה לי גם את המוטיבציה. קמתי.'); },
        onTalk(){ GAME.RED('דיברתי עם הספה. היא לא ענתה, אבל היא מבינה אותי.'); },
      },

      // ---------- CRT TV ----------
      { id:'tv', name:'הטלוויזיה', rect:{x:206,y:84,w:70,h:60}, near:{x:230,y:170},
        onLook(){ GAME.say('בטלוויזיה: טלנובלה. הגיבורה גילתה שאחותה התאומה היא בעצם הדודה. דרמה.'); GAME.score(2,'tv'); },
        onUse(){ GAME.RED('כפתורים מלאים, ערוץ אחד. כמו משחקי הרפתקה — נראה עשיר, יש מסלול אחד.'); },
        onTake(){ GAME.RED('שואו, היא במשקל של בלוק. נשאיר לאמא את הדרמה.'); },
        onTalk(){ GAME.RED('"מי הרוצח?" שאלתי את המסך. המסך אמר "אחרי הפרסומות". קלאסי.'); },
      },

      // ---------- FRAMED PHOTO (foreshadow) ----------
      { id:'photo', name:'התמונה של סבתא', rect:{x:150,y:20,w:40,h:46}, near:{x:170,y:170},
        onLook(){
          if(GAME.flag(F.knowsGranny)){
            GAME.say('עכשיו כשמסתכלים שוב — זה ממש לא גזר. אוי ואבוי.');
          } else {
            GAME.say('סבתא הצעירה בתמונה. מחזיקה... זה גזר? למה היא מחזיקה אותו ככה? נו, סבתא.');
            GAME.score(3,'photo');
          }
        },
        onTake(){ GAME.RED('להוריד את התמונה של סבתא? אמא תהרוג אותי. ובבית הזה זה לא ביטוי.'); },
        onTalk(){ GAME.RED('דיברתי לתמונה. נשבעת שהעיניים עקבו אחריי. נשבעת.'); },
      },

      // ---------- PERSIAN RUG ----------
      { id:'rug', name:'השטיח', rect:{x:108,y:166,w:108,h:22}, near:{x:160,y:178},
        onLook(){ GAME.say('שטיח פרסי שעבר 3 דירות, 2 חתולים וחתונה אחת. ניצול.'); GAME.score(2,'rug'); },
        onTake(){ GAME.RED('"קח את השטיח" — סבבה, ואיפה אני שמה אותו, בסל לסבתא? לא.'); },
        onUse(){ GAME.RED('הרמתי פינה. מתחת — אבק עתיק ושטר של 5 שקל. השארתי לאמא, היא צריכה.'); },
      },

      // ---------- WINDOW ----------
      { id:'window', name:'החלון', rect:{x:14,y:24,w:66,h:55}, near:{x:48,y:172},
        onLook(){ GAME.say('מבעד לחלון: השכונה מתעוררת. מהיער הירוק בקצה — צ\'יל ירוק וחשוד.'); },
        onUse(){ GAME.RED('לא קופצת מהחלון. אני ארסית, לא טמבלית.'); },
        onTake(){ GAME.RED('חלון זה לא פריט באינוונטורי, אחי.'); },
      },

      // ---------- KITCHEN DOORWAY ----------
      { id:'kitchen', name:'המטבח', rect:{x:290,y:86,w:30,h:74}, near:{x:276,y:172},
        onLook(){ GAME.say('המטבח. ריח של עוגיות שאמא אפתה לסבתא. אחת חסרה. (זאת הייתי אני.)'); },
        onUse(){ GAME.RED('אמא בפתח. אם איכנס למטבח, אצא עם צלחת אוכל וחצי שעה אשמה.'); },
        onTalk(){ GAME.RED('צעקתי "מה יש לאכול?" לכיוון המטבח. זה בית ישראלי, התשובה תמיד "הכל".'); },
      },

      // ---------- MOM (the NPC, mission-giver) ----------
      { id:'mom', name:'אמא', rect:{x:266,y:118,w:30,h:44}, near:{x:258,y:172}, keepDraw:true,
        draw(ctx){ GAME.drawSprite(ctx,'mom',278,156,0,'left',0.95); },
        onLook(){ GAME.say('אמא, ליד המטבח, מנגבת ידיים במגבת ובוחנת אותך מכף רגל ועד כיפה.'); },
        onTake(){ GAME.RED('"קח את אמא" — זה לא העידן הזה, אחי. אמא לא זזה בלי קפה.'); },
        onUse(item){
          if(item==='basket'){ GAME.MOM('יופי, לקחת את הסל. עכשיו לכי, ושתחזרי לפני שחושך.'); return; }
          GAME.RED('לא משתמשת באמא. מדברים עם אמא.'); GAME.MOM('דברי איתי כמו בן אדם, נשמה.');
        },
        onTalk(){
          // First talk: hand out the mission.
          if(!GAME.flag(F.hasMission)){
            GAME.MOM('מותק, קומי כבר. סבתא מחכה והעוגיות מתקררות.');
            GAME.MOM('קחי את הסל ותלכי ישר לסבתא. בלי שטויות בדרך, נשמה.');
            GAME.MOM('ותגידי לסבתא שאמא אוהבת. גם אם היא... מוזרה לאחרונה.');
            GAME.MOM('סבתא מוזרה לאחרונה... מסתכלת מוזר. תיזהרי שם, מותק.');
            GAME.setFlag(F.hasMission,true);
            GAME.score(5,'mission');
            GAME.onMsgDone(()=>{ GAME.RED('סבתא מוזרה? וואלה. אבל חטיפים זה חטיפים. יאללה ביי.'); });
            return;
          }
          // Reminders after the mission is set.
          if(!GAME.has('basket')){
            GAME.MOM('מה, בלי הסל? חזרי קחי אותו. מה יגידו אצל סבתא?');
            return;
          }
          GAME.choice('מה לומר לאמא?', [
            { label:'"אכלתי, אמא, אל תדאגי."', action(){
                GAME.MOM('אכלת משהו? לא? אוי ואבוי. לפחות תיקחי חטיף מהסל. אבל אחד! זה לסבתא.');
            }},
            { label:'"אני זזה, נשיקות."', action(){
                GAME.MOM('את הילדה הכי חכמה בשכונה. רק... תשמרי על עצמך ביער. ברצינות.');
                GAME.onMsgDone(()=>{ GAME.RED('מתה עליי. תכל\'ס מתה. יאללה, אוסטרליה ביי, היער מחכה.'); });
            }},
          ]);
        },
      },
    ],

    exits:[
      { id:'back', name:'חזרה לחדר', rect:{x:0,y:86,w:16,h:74}, to:'room_red',
        entry:{x:270,y:178,dir:'left'}, arrow:'left' },

      { id:'out', name:'החוצה לשכונה', rect:{x:290,y:160,w:30,h:34}, to:'hood',
        entry:{x:40,y:178,dir:'left'}, arrow:'right',
        // GATE: must hold the basket AND have received mom's mission.
        gate(){ return GAME.has('basket') && GAME.flag(F.hasMission); },
        gateFail(){
          if(!GAME.flag(F.hasMission)){
            GAME.MOM('לאן את רצה? בואי, קודם תקשיבי לאמא רגע.');
          } else {
            GAME.MOM('בלי הסל את לא זזה! ומה, לא תתקשרי לאמא מהיער? תשמרי שדה כיסוי.');
          }
        },
      },
    ],

    onFirst(){
      GAME.say('הסלון. טלנובלה דולקת, סבתא בתמונה בוהה, ואמא כבר עם המגבת על הכתף.');
    },
    onEnter(){},
  });
})();
