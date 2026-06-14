/* scene05_deep_forest.js — עומק היער (full scene) */
(function(){
  const C=GAME.C, F=GAME.STORY.flags;

  // a twisted tree trunk at (bx) base, with a gnarled fork
  function tree(ctx,bx,topY,trunkW,col,shade){
    GAME.rect(ctx,bx,topY,trunkW,158-topY,col);
    GAME.rect(ctx,bx,topY,Math.max(1,trunkW/3|0),158-topY,shade); // shaded edge
    GAME.box(ctx,bx,topY,trunkW,158-topY,C.black);
    // a couple of gnarls
    GAME.px(ctx,bx+1,topY+14,C.black); GAME.px(ctx,bx+trunkW-2,topY+30,C.black);
  }

  // dark leaf canopy blob
  function canopy(ctx,cx,cy,rx,ry){
    GAME.ellipse(ctx,cx,cy,rx,ry,C.moss);
    GAME.ellipse(ctx,cx-rx*0.4|0,cy+2,rx*0.7|0,ry*0.7|0,C.darkGreen);
    GAME.ellipse(ctx,cx+rx*0.4|0,cy-1,rx*0.5|0,ry*0.6|0,C.darkGreen);
    GAME.ellipse(ctx,cx,cy-ry+2,rx*0.3|0,2,C.green); // tiny highlight
  }

  // a clump of red-cap mushrooms at base (mx,my)
  function mushrooms(ctx,mx,my){
    // big one
    GAME.rect(ctx,mx+3,my+5,3,6,C.tan); GAME.box(ctx,mx+3,my+5,3,6,C.black);
    GAME.ellipse(ctx,mx+4,my+5,5,3,C.red);
    GAME.px(ctx,mx+2,my+4,C.white); GAME.px(ctx,mx+6,my+5,C.white); GAME.px(ctx,mx+4,my+3,C.white);
    // small one
    GAME.rect(ctx,mx+9,my+8,2,4,C.tan);
    GAME.ellipse(ctx,mx+10,my+8,3,2,C.red);
    GAME.px(ctx,mx+9,my+7,C.white); GAME.px(ctx,mx+11,my+8,C.white);
  }

  GAME.registerScene({
    id:'deep_forest',
    name:'עומק היער',
    entry:{ x:40, y:178, dir:'right' },
    walkbox:[ {x:10,y:160,w:300,h:34} ],
    scale:{ near:1.0, far:0.78, horizon:150 },

    drawBackground(ctx){
      // dim sky barely seen through canopy
      GAME.gradV(ctx,0,0,320,60,C.darkBlue,C.moss);
      // dense dark-green forest mass
      GAME.rect(ctx,0,40,320,118,C.darkGreen);
      GAME.dither(ctx,0,40,320,70,C.darkGreen,C.moss);

      // shafts of light cutting down through the leaves (thin slanted bright cones)
      GAME.poly(ctx,[[118,40],[126,40],[150,150],[136,150]],'rgba(255,240,90,0.12)');
      GAME.poly(ctx,[[210,40],[220,40],[200,150],[188,150]],'rgba(255,240,90,0.10)');
      GAME.poly(ctx,[[58,40],[64,40],[80,150],[70,150]],'rgba(255,240,90,0.08)');

      // far canopy blobs (the ceiling of leaves)
      canopy(ctx,40,46,40,18); canopy(ctx,120,42,46,18);
      canopy(ctx,210,46,44,18); canopy(ctx,290,44,42,18);

      // twisted trees, near→far, depth via width
      tree(ctx,12,52,16,C.brown,'#5a3417');     // big foreground left
      tree(ctx,288,50,18,C.brown,'#5a3417');    // big foreground right
      tree(ctx,96,66,9,'#6a3f1c','#4a2c12');    // mid
      tree(ctx,236,64,10,'#6a3f1c','#4a2c12');  // mid
      tree(ctx,165,72,6,'#5a3417','#3a2210');   // slim, near the fork

      // forest floor
      GAME.rect(ctx,0,158,320,42,C.moss);
      GAME.dither(ctx,0,158,320,42,C.moss,C.darkGreen);
      GAME.line(ctx,0,158,320,158,C.black);

      // THE FORK in the path — two dirt trails diverging toward camera
      GAME.poly(ctx,[[150,158],[174,158],[300,196],[250,196]],C.brown); // right fork → river
      GAME.poly(ctx,[[150,158],[174,158],[210,196],[150,196]],C.tan);   // left/up fork → garden mouth
      GAME.dither(ctx,150,160,150,36,C.brown,C.tan);
      GAME.line(ctx,162,158,275,196,C.black);

      // little garden-path sign pointing up the left fork
      GAME.rect(ctx,150,128,4,18,C.brown);
      GAME.rect(ctx,138,120,28,10,C.tan); GAME.box(ctx,138,120,28,10,C.black);
      GAME.line(ctx,158,124,144,124,C.brown); // a painted ← arrow on the sign, pointing up-fork

      // scattered floor mushrooms (decor; the hotspot clump is drawn in its hotspot)
      GAME.ellipse(ctx,46,168,3,2,C.red); GAME.px(ctx,45,167,C.tan);
      GAME.ellipse(ctx,300,172,3,2,C.red); GAME.px(ctx,299,171,C.tan);
      // a fallen leaf or two on the floor
      GAME.px(ctx,128,180,C.green); GAME.px(ctx,212,184,C.moss);

      // a couple of fireflies for atmosphere
      GAME.px(ctx,180,100,C.yellow); GAME.px(ctx,90,120,C.yellow); GAME.px(ctx,255,110,C.gold);
      GAME.px(ctx,148,86,C.yellow); GAME.px(ctx,30,108,C.gold);
    },

    hotspots:[
      // --- the sad WOLF on a log (first meeting) ----------------------------
      { id:'wolf', name:'הזאב', rect:{x:196,y:118,w:54,h:50}, near:{x:200,y:170},
        draw(ctx){
          // the log he sits on
          GAME.rect(ctx,196,150,58,12,C.brown); GAME.box(ctx,196,150,58,12,C.black);
          GAME.ellipse(ctx,196,156,4,5,C.tan); GAME.ellipse(ctx,254,156,4,5,C.tan); // log ends (rings)
          GAME.px(ctx,196,156,C.black); GAME.px(ctx,254,156,C.black);
          // the wolf himself, sitting (feet on the log top)
          GAME.drawSprite(ctx,'wolf',225,152,0,'left',0.95);
        },
        onLook(){
          if(GAME.flag('wolfFriend')){
            GAME.RED('הזאב שלי. הכי נשמה ביער. מי היה מאמין.');
          } else if(GAME.state.metWolf){
            GAME.say('הזאב יושב על הבול, עצוב, מקלף קליפת עץ בלי שום סיבה. מסכן.');
          } else {
            GAME.say('זאב. אמיתי. יושב על בול עץ ונאנח. רגע — זאב נאנח?');
          }
        },
        onTalk(){
          if(GAME.flag('wolfFriend')){
            GAME.WOLF('אחותי! איזה כיף שחזרת. רוצה גרעין? יש לי בגינה.');
            return;
          }
          if(!GAME.state.metWolf){
            GAME.state.metWolf=true;
            GAME.setFlag('metWolf',true);
            GAME.WOLF('שלום... בבקשה אל תצרחי. אני בקטע של אוכל מהצומח. צרחות זה ממש מלחיץ אותי.');
            GAME.RED('זאב צמחוני? וואלה, היער הזה מלא הפתעות.');
            GAME.WOLF('כולם בורחים ממני. ואני רק רוצה גרעינים וקצת שקט. את הראשונה שלא ברחה. תודה.');
            GAME.WOLF('תקשיבי, יש לי גינה. ירקות, חמניות, אנרגיה רגועה. בואי, אני אראה לך — זה ← למעלה בשביל.');
            GAME.RED('אחי, אני לא בקטע של דרמות. אבל הדרמה כבר התחילה.');
            GAME.score(5,'metwolf');
          } else {
            // repeat-talk: short menu so it never dead-ends
            GAME.choice('על מה לדבר עם הזאב?',[
              { label:'"מה הקטע עם הגרעינים?"', action(){
                  GAME.WOLF('אני אוהב גרעינים. גרעינים שחורים, מהקיוסק. זה האושר שלי, מבין?');
                  GAME.RED('סבבה. אם אני נתקלת בגרעינים — אני יודעת למי.'); } },
              { label:'"איפה הגינה שלך?"', action(){
                  GAME.WOLF('למעלה בשביל השמאלי. ← תעלי, ביישן ביער שומר על הגינה הכי שלווה שיש.'); } },
              { label:'"למה כולם פוחדים ממך?"', action(){
                  GAME.WOLF('סליחה שאני סוחב עצב. פשוט עייפתי להיות הרע בכל סיפור.');
                  GAME.RED('על הפנים. אבל בסטייל אפשר לשנות את זה.'); } },
              { label:'יאללה, נזוז.', action(){ GAME.RED('אוסטרליה ביי, זאב.'); } },
            ]);
          }
        },
        onTake(){ GAME.RED('לסחוב זאב? הוא לא חיית מחמד, אחי. וגם — הוא יותר גדול ממני.'); },
        onUse(item){
          if(item==='seeds'){
            GAME.WOLF('וואו... גרעינים. אבל לא פה, אחותי — בגינה, ברוגע. בואי ← למעלה, נעשה את זה כמו שצריך.');
          } else if(item){
            GAME.RED('לא נראה לי שזה מה שהזאב צריך עכשיו.');
          } else {
            GAME.RED('אולי עדיף פשוט לדבר איתו. דיבור זה גם משהו.');
          }
        },
      },

      // --- the suspicious MUSHROOM clump (death gag) ------------------------
      { id:'mushrooms', name:'הפטריות', rect:{x:60,y:150,w:24,h:18}, near:{x:74,y:172},
        draw(ctx){ mushrooms(ctx,62,150); },
        onLook(){ GAME.say('פטריות יער עם נקודות לבנות. צבעוניות, מזמינות, וצורחות "רעילה" בכל שפה. רגע טוב לשמור משחק.'); },
        onTake(){ GAME.RED('פטרייה ביער מסתורי? מה הכי גרוע שיק...');
          GAME.onMsgDone(()=> GAME.die('הפטרייה הייתה דעה. עכשיו את חלק מהיער. ספרותי, אבל מת.')); },
        onUse(item){
          if(item){ GAME.RED('לא מערבבים פטריות חשודות עם כלום. כלל אצבע ביער.'); return; }
          GAME.RED('פטרייה ביער מסתורי? מה הכי גרוע שיק...');
          GAME.onMsgDone(()=> GAME.die('אכלת פטריית יער אקראית. עכשיו את רואה את סבתא רוקדת סלסה. זה לא טוב.'));
        },
      },

      // --- the giant carved tree (gag) -------------------------------------
      { id:'bigtree', name:'העץ הגדול', rect:{x:288,y:50,w:24,h:108}, near:{x:280,y:172},
        onLook(){ GAME.say('עץ ענק עם חריטה: "א.ק. אהב את כ.ק." ולמטה: "תיקון: כ.ק. לא ידעה." דרמת יער.'); },
        onTake(){ GAME.RED('לתלוש עץ ענק? אני חזקה, אחי, אבל לא ככה.'); },
        onUse(){ GAME.RED('דופקת על העץ. היער ענה בהד. מצמרר קצת.'); GAME.sfx('door'); },
        onTalk(){ GAME.RED('"היי עץ." העץ שתק בכבוד. כמו שעצים עושים.'); },
      },

      // --- the fleeing critter / rabbit ------------------------------------
      { id:'critter', name:'הארנב', rect:{x:96,y:146,w:22,h:16}, near:{x:108,y:172},
        draw(ctx){ if(GAME.state.critterGone) return;
          GAME.drawSprite(ctx,'critter',104,160,0,'left',0.9); },
        onLook(){ if(GAME.state.critterGone){ GAME.say('הארנב כבר עף מפה. היה לו תור.'); return; }
          GAME.say('ארנב יער קטן מציץ מאחורי שורש. מסתכל עלייך בחשד מקצועי.'); },
        onTalk(){ if(GAME.state.critterGone){ GAME.RED('אין למי לדבר. הארנב התפטר.'); return; }
          GAME.RED('"היי חמוד, בוא נה..."'); GAME.onMsgDone(()=>{
            GAME.state.critterGone=true;
            GAME.say('ארנב הציץ, ראה אותך, נזכר בפגישה דחופה, ונעלם.'); }); },
        onTake(){ if(GAME.state.critterGone){ GAME.RED('מאוחר מדי, אחי. הוא כבר בשכונה אחרת.'); return; }
          GAME.state.critterGone=true;
          GAME.say('ניסית לתפוס אותו. הוא היה מהיר יותר. ארנבים תמיד מהירים יותר.'); },
        onUse(){ GAME.RED('הארנב לא מעוניין בכלום ממני. בעיקר לא בקרבה.'); },
      },

      // --- the path fork ----------------------------------------------------
      { id:'fork', name:'הצומת', rect:{x:140,y:158,w:60,h:34}, near:{x:160,y:174},
        onLook(){ GAME.say('השביל מתפצל: ← למעלה לגינה של הזאב, וקדימה ימינה אל הנהר. שני שבילים, סוף אחד טוב. אולי.'); },
        onUse(){ GAME.RED('צומת. לא בוחרים בו — הולכים אותו. תכל\'ס.'); },
        onTalk(){ GAME.RED('"שמאלה או ישר?" שאלתי את הצומת. כרגיל, אין תשובה.'); },
        onTake(){ GAME.RED('לקחת שביל הביתה? היה נחמד. אבל לא.'); },
      },
    ],

    exits:[
      { id:'back', name:'חזרה לכניסת היער', rect:{x:0,y:60,w:22,h:98}, to:'forest_edge',
        entry:{x:280,y:178,dir:'left'}, arrow:'left' },

      { id:'garden', name:'הגינה של הזאב', rect:{x:138,y:118,w:30,h:42}, to:'wolf_garden',
        entry:{x:160,y:178,dir:'down'}, arrow:'up' },

      { id:'fwd', name:'אל הנהר', rect:{x:298,y:60,w:22,h:98}, to:'river',
        entry:{x:30,y:178,dir:'right'}, arrow:'right' },
    ],

    onFirst(){
      GAME.say('היער הירוק נושם לאט. משהו בו לא בסדר, ורק כיפה עוד לא יודעת.');
      GAME.onMsgDone(()=>{ GAME.RED('עומק היער. אפלולי, ירוק, ומלא רעשים. סבבה לאווירה.'); });
    },
    onEnter(){},
  });
})();
