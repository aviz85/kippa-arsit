/* scene09_granny_int.js — בית סבתא (פנים). דירה אפלולית של פסיכופתית מנומסת. */
(function(){
  const C=GAME.C, F=GAME.STORY.flags;

  // small helper: a single mounted knife on the wall (blade up), at x with given length
  function knife(ctx,x,top,len){
    GAME.rect(ctx,x,top,2,len,C.ltGray);            // blade
    GAME.px(ctx,x,top,C.white);                      // glint
    GAME.rect(ctx,x-1,top+len,4,3,C.brown);          // handle
    GAME.px(ctx,x,top+len+1,C.gold);
  }

  GAME.registerScene({
    id:'granny_int',
    name:'בית סבתא — פנים',
    entry:{ x:36, y:178, dir:'right' },
    walkbox:[ {x:14,y:160,w:292,h:32} ],
    scale:{ near:1.0, far:0.82, horizon:158 },

    drawBackground(ctx){
      // walls — dim, sickly green-gray
      GAME.rect(ctx,0,0,320,160,C.dkGray);
      GAME.dither(ctx,0,0,320,160,C.dkGray,C.moss);
      // floor — old dark wood
      GAME.rect(ctx,0,158,320,42,C.brown);
      GAME.dither(ctx,0,158,320,42,C.brown,C.black);
      GAME.line(ctx,0,160,320,160,C.black);
      // floorboards
      for(let i=20;i<320;i+=40) GAME.line(ctx,i,160,i,200,'#3a2410');
      // skirting
      GAME.rect(ctx,0,154,320,4,C.night);

      /* ---- fireplace (left) — embers, no warmth ---- */
      GAME.rect(ctx,14,86,58,72,C.gray);
      GAME.box(ctx,14,86,58,72,C.black);
      GAME.rect(ctx,22,104,42,46,C.black);            // hearth mouth
      GAME.rect(ctx,26,138,34,10,C.darkRed);          // embers bed
      GAME.dither(ctx,26,138,34,10,C.darkRed,C.orange);
      GAME.px(ctx,32,136,C.gold); GAME.px(ctx,44,135,C.orange); GAME.px(ctx,52,137,C.gold);
      GAME.rect(ctx,10,80,66,8,C.steel);              // mantel
      GAME.box(ctx,10,80,66,8,C.black);
      // a tiny framed photo on the mantel (young granny, too intense)
      GAME.box(ctx,30,68,16,12,C.gold);
      GAME.rect(ctx,32,70,12,8,C.tan);
      GAME.px(ctx,36,73,C.black); GAME.px(ctx,40,73,C.black);

      /* ---- WALL OF KNIVES (center-left, above) ---- */
      GAME.rect(ctx,86,30,86,46,C.night);             // dark mounting board
      GAME.box(ctx,86,30,86,46,C.black);
      knife(ctx,94,36,30);  knife(ctx,104,34,34);  knife(ctx,114,38,26);
      knife(ctx,124,33,36); knife(ctx,134,37,28);  knife(ctx,144,34,33);
      knife(ctx,154,39,24); knife(ctx,164,35,31);
      // an empty hook — slot waiting to be filled (dread)
      GAME.line(ctx,176,36,178,40,C.gold);

      /* ---- doorway to the back room (the showdown) — distinct threshold ---- */
      GAME.rect(ctx,178,92,30,66,C.night);            // dark inner doorway
      GAME.box(ctx,178,92,30,66,C.black);             // frame
      GAME.rect(ctx,176,90,34,4,C.brown);             // lintel
      GAME.box(ctx,176,90,34,4,C.black);
      GAME.rect(ctx,180,94,26,62,C.black);            // pitch-black depth
      // a faint cold glint from inside (something is in there)
      GAME.px(ctx,192,120,C.steel); GAME.px(ctx,196,128,C.ltGray);
      GAME.px(ctx,188,134,C.steel);

      /* ---- taxidermy trophy (right wall) ---- */
      GAME.box(ctx,210,28,52,44,C.brown);             // wooden plaque
      GAME.rect(ctx,212,30,48,40,C.darkGreen);
      GAME.dither(ctx,212,30,48,40,C.darkGreen,C.moss);
      // a stuffed forest critter, frozen mid-grin
      GAME.ellipse(ctx,236,52,12,11,C.tan);           // body/head
      GAME.rect(ctx,228,30,4,12,C.tan); GAME.rect(ctx,240,30,4,12,C.tan); // ears
      GAME.px(ctx,231,50,C.black); GAME.px(ctx,241,50,C.black);           // eyes
      GAME.line(ctx,231,57,241,57,C.black);            // the wrong smile
      GAME.px(ctx,236,54,C.pink);                      // nose

      /* ---- window (back wall) — faint forest dusk ---- */
      GAME.box(ctx,272,84,38,46,C.black);
      GAME.gradV(ctx,274,86,34,42,C.steel,C.night);
      GAME.line(ctx,291,86,291,128,C.black);
      GAME.line(ctx,274,107,308,107,C.black);

      /* ---- the bed with "granny" (right) ---- */
      GAME.rect(ctx,196,118,108,40,C.darkRed);        // bed frame
      GAME.box(ctx,196,118,108,40,C.black);
      GAME.rect(ctx,196,108,10,50,C.brown);           // footboard post (left)
      GAME.rect(ctx,294,104,10,54,C.brown);           // headboard post (right)
      GAME.rect(ctx,204,116,96,12,C.purple);          // quilt
      GAME.dither(ctx,204,116,96,12,C.purple,C.darkRed);
      GAME.rect(ctx,278,110,22,12,C.white);           // pillow

      /* ---- table with the NOTE (center floor) ---- */
      GAME.rect(ctx,128,138,46,6,C.brown);            // tabletop
      GAME.box(ctx,128,138,46,6,C.black);
      GAME.rect(ctx,132,144,4,14,C.darkRed); GAME.rect(ctx,166,144,4,14,C.darkRed); // legs
      GAME.rect(ctx,142,133,18,6,C.white);            // the note (paper)
      GAME.px(ctx,145,135,C.black); GAME.px(ctx,150,135,C.black); GAME.px(ctx,155,135,C.black);
      // a single candle (the only light)
      GAME.rect(ctx,135,130,3,8,C.tan); GAME.px(ctx,136,128,C.gold); GAME.px(ctx,136,127,C.orange);

      /* ---- rocking chair (left-center) ---- */
      GAME.rect(ctx,86,118,4,40,C.brown);             // back posts
      GAME.rect(ctx,104,118,4,40,C.brown);
      GAME.rect(ctx,86,116,22,4,C.brown);             // top rail
      GAME.rect(ctx,84,138,28,4,C.brown);             // seat
      GAME.line(ctx,82,158,114,150,C.black);          // curved rocker
      GAME.line(ctx,82,156,114,148,C.brown);

      /* ---- the granny in bed (drawn over the frame) ---- */
      GAME.drawSprite(ctx,'granny',252,150,0,'left',0.9);
    },

    hotspots:[
      // -- the WALL OF KNIVES --
      { id:'knives', name:'קיר הסכינים', rect:{x:86,y:30,w:90,h:48}, near:{x:120,y:172},
        onLook(){ GAME.say('קיר שלם של סכינים, ממוין לפי גודל. "אוסף", סבתא אמרה. אוסף... מרשים ומפחיד.');
          GAME.onMsgDone(()=>{ GAME.say('ויש שם וו ריק אחד. כאילו מחכה לסכין חדשה. או למשהו אחר.'); });
          GAME.score(2,'look_knives'); },
        onTake(){ GAME.RED('לגעת בסכין של סבתא? אני ארסית, לא מתאבדת.'); },
        onUse(){ GAME.RED('עדיף לא. אוסף זה אוסף.'); },
      },

      // -- the TAXIDERMY trophy --
      { id:'trophy', name:'החיה הממולאת', rect:{x:210,y:28,w:52,h:44}, near:{x:222,y:172},
        onLook(){ GAME.say('חיה ממולאת על המדף, מחייכת חיוך שאסור לחיות מתות לחייך.');
          GAME.onMsgDone(()=>{ GAME.RED('וואלה. עכשיו אני מבינה למה הזאב לחוץ. תכל\'ס מבינה לגמרי.');
            GAME.setFlag(F.knowsGranny,true); GAME.score(3,'look_trophy'); }); },
        onTake(){ GAME.RED('לא נוגעת. זה היה פעם מישהו חמוד.'); },
        onTalk(){ GAME.RED('אמרתי לחיה הממולאת שלום. היא חייכה בחזרה. רצתי.'); },
      },

      // -- the NOTE on the table (confirms grannyTruth) --
      { id:'note', name:'הפתק על השולחן', rect:{x:128,y:128,w:46,h:18}, near:{x:150,y:172},
        onLook(){
          if(GAME.has('evidence')){
            GAME.say('פתק: "1. הזאב 2. ?" — יש לי כבר עותק כזה בכיס. הסבתא מעתיקה לעצמה. נחמד.');
          } else {
            GAME.say('פתק: "1. הזאב 2. ?" המספר 2 ריק. את ממש לא רוצה למלא את החלל הזה.');
          }
          GAME.onMsgDone(()=>{ if(!GAME.flag(F.knowsGranny)){ GAME.setFlag(F.knowsGranny,true);
            GAME.RED('אז זה נכון. הזאב לא שיקר. הזקנה הזאת — פרויקט.'); } });
          GAME.score(3,'look_note'); },
        onTake(){
          if(GAME.has('evidence')){ GAME.RED('כבר יש לי עותק. לא צריך שניים, אחי.'); return; }
          GAME.RED('זה כבר אצל הזאב. מה שיש לי בכיס מספיק להוכיח.'); },
        onUse(){ GAME.RED('הפתק הזה שווה זהב. שומרת אותו ליום הדין.'); },
      },

      // -- the FIREPLACE --
      { id:'fire', name:'האח', rect:{x:14,y:86,w:58,h:72}, near:{x:50,y:172},
        onLook(){ GAME.say('אח עם גחלים קרות. מעליה תמונה של סבתא הצעירה, מחזיקה משהו מחודד וחייכנית מדי.'); },
        onUse(){ GAME.RED('להתחמם פה? האח הזה קר יותר מהמבט שלה. לא תודה.'); },
        onTake(){ GAME.RED('מה אני אקח, גחלים? בלאגן זה סטייל, אבל לא ככה.'); },
      },

      // -- the ROCKING CHAIR --
      { id:'chair', name:'כיסא הנדנדה', rect:{x:80,y:116,w:36,h:44}, near:{x:98,y:172},
        onLook(){ GAME.say('כיסא נדנדה שמתנדנד לבד. אין רוח. אין הסבר. יאללה ביי.'); },
        onUse(){ GAME.RED('לשבת בכיסא של פסיכופתית? עברתי מספיק סרטים בשביל לדעת שלא.'); },
        onTalk(){ GAME.RED('"מי שם?" שאלתי את הכיסא. הוא המשיך להתנדנד. נחמד.'); },
      },

      // -- the WINDOW (death gag if you try to jump) --
      { id:'window', name:'החלון', rect:{x:272,y:84,w:38,h:46}, near:{x:266,y:172},
        onLook(){ GAME.say('דרך החלון: היער מחשיך. אם תצטרכי לקרוא לחבר — זה הכיוון.'); },
        onUse(){ GAME.RED('לקפוץ מהחלון להימלט? לא קופצת מהחלון. אני ארסית, לא טמבלית.'); },
        onTake(){ GAME.RED('חלון. לא נשלף, אחי.'); },
      },

      // -- GRANNY in bed: the inverted classic + the branch --
      { id:'granny', name:'סבתא', rect:{x:228,y:104,w:74,h:54}, near:{x:210,y:172}, keepDraw:true,
        draw(ctx){ GAME.drawSprite(ctx,'granny',252,150,0,'left',0.9); },
        onLook(){ GAME.say('סבתא במיטה, חיוך מתוק עד הקובייה. רק שהעיניים שלה לא קיבלו את התזכיר על החיוך.'); },
        onTake(){ GAME.RED('לחבק את סבתא? אחרי קיר הסכינים? תכל\'ס לא.'); },
        onUse(item){
          if(item==='evidence'){ GAME.RED('לא מנפנפת בהוכחה מוקדם מדי. סבלנות זה גם סטייל.'); return; }
          GAME.RED('מתקרבת אליה? עוד לא. כשאני מוכנה — אני מוכנה.');
        },
        onTalk(){ runGrannyTalk(); },
      },
    ],

    exits:[
      { id:'back', name:'החוצה', rect:{x:0,y:96,w:13,h:64}, to:'granny_ext',
        entry:{x:160,y:178,dir:'down'}, arrow:'left' },
      // distinct doorway/threshold — NO LONGER overlaps the granny hotspot,
      // so TALK/LOOK on granny and the accuse/stall choice stay reachable.
      { id:'fwd', name:'אל חדר הפנים (העימות)', rect:{x:178,y:92,w:30,h:66}, to:'finale',
        entry:{x:300,y:178,dir:'left'}, arrow:'right',
        gate(){ return GAME.flag(F.knowsGranny); },
        gateFail(){ GAME.RED('לאן אני נכנסת לבד? עוד לא הבנתי מה הקטע פה. דברי איתה, תסתכלי מסביב. אז נזוז.'); },
      },
    ],

    onFirst(){
      GAME.say('הבית של סבתא מבפנים. חמוד מבחוץ. מצמרר מבפנים.');
      GAME.onMsgDone(()=>{ GAME.RED('סבתא? זאת אני, כיפה. הבאתי... אווירה מוזרה, על הפנים.'); });
    },
    onEnter(){},
  });

  /* ---- the inverted-classic exchange + accuse/stall choice ---- */
  function runGrannyTalk(){
    const F=GAME.STORY.flags;
    GAME.RED('סבתא, איזה עיניים גדולות יש לך!');
    GAME.GRANNY('כדי לראות אותך טוב יותר, מותק שלי. כל פרט. כל סנטימטר.');
    GAME.RED('ואיזה אוזניים גדולות יש לך!');
    GAME.GRANNY('כדי לשמוע אם מישהו בא לעזור לך, בובה. אף אחד לא בא.');
    GAME.RED('ו... איזה ידיים גדולות יש לך, סבתא.');
    GAME.GRANNY('כדי להחזיק אותך חזק. חזק־חזק. שלא תזוזי, חמודה.');
    GAME.RED('ו... איזה שיניים גדולות יש לך!');
    GAME.GRANNY('אלה? אלה כלום, נשמה. תכל\'ס אני מעדיפה כלי עבודה.');
    GAME.RED('איזה... סכין גדולה יש לך, סבתא.');
    GAME.GRANNY('נכון, בובה. הכי גדולה שיש. וטרייה. בדיוק בשבילך.');
    // learning the truth from her own mouth, if not already
    GAME.onMsgDone(()=>{
      if(!GAME.flag(F.knowsGranny)){ GAME.setFlag(F.knowsGranny,true); GAME.score(3,'granny_talk'); }
      offerChoice();
    });
  }

  function offerChoice(){
    GAME.choice('מה את עושה עכשיו?', [
      { label:'להאשים אותה עכשיו', action(){
          if(!GAME.has('evidence')){
            GAME.RED('רגע טוב לשמור משחק. אם היה לי כפתור כזה בחיים.');
            GAME.GRANNY('פתק? איזה פתק, חמודה? אני לא יודעת על שום רשימה.');
            GAME.onMsgDone(()=>{
              GAME.die('סבתא שלפה סכין מהר ממך. בלי הוכחה זה רק קטטה. סוף ארור.');
            });
          } else {
            GAME.RED('תקשיבי לי טוב, סבתא — אני רואה בדיוק מה את. ויש לי הוכחה.');
            GAME.GRANNY('אז זה נכון. גילית. חבל, בובה — חיבבתי אותך. באמת.');
            GAME.onMsgDone(()=>{ GAME.goto('finale',{x:300,y:178,dir:'left'}); });
          }
        }
      },
      { label:'לאסוף עוד / להתחפף', action(){
          GAME.RED('עוד לא. קודם אוסף קצת יותר, ואז נראה. סבלנות זה גם סטייל.');
        }
      },
    ]);
  }
})();
