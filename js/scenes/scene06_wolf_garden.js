/* scene06_wolf_garden.js — הגינה של הזאב
   Core puzzle: USE 'seeds' on the wolf → wolfFriend, then wolf gives 'evidence' (grannyTruth).
   Exit back → deep_forest. Conforms to CONTRACT.md + GAME_SPEC.md. */
(function(){
  const C=GAME.C, F=GAME.STORY.flags;

  // wolf NPC position (feet center) — standing among his plants
  const WX=205, WY=156;

  GAME.registerScene({
    id:'wolf_garden',
    name:'הגינה של הזאב',
    entry:{ x:50, y:178, dir:'right' },
    walkbox:[ {x:14,y:160,w:292,h:34} ],
    scale:{ near:1.0, far:0.82, horizon:150 },

    drawBackground(ctx){
      const C=GAME.C;
      // ---- sky ----
      GAME.gradV(ctx,0,0,320,92, C.cyan, C.blue);
      // soft clouds
      GAME.ellipse(ctx,60,24,16,5,C.white); GAME.ellipse(ctx,74,22,11,4,C.white);
      GAME.ellipse(ctx,238,18,18,5,C.white); GAME.ellipse(ctx,254,20,10,4,C.white);
      // warm sun
      GAME.ellipse(ctx,288,22,12,12,C.gold);
      GAME.ellipse(ctx,288,22,8,8,C.yellow);

      // ---- distant tree-line (this is a clearing carved out of the forest) ----
      for(let i=0;i<8;i++){
        const tx=8+i*42, th=20+((i*7)%14);
        GAME.ellipse(ctx,tx,86-th+10,16,14,C.darkGreen);
        GAME.rect(ctx,tx-2,90-th+18,4,th-6,C.brown);
      }
      GAME.line(ctx,0,90,320,90,C.darkGreen);

      // ---- ground: tidy garden soil + grass strip ----
      GAME.rect(ctx,0,90,320,16,C.green);            // back lawn
      GAME.dither(ctx,0,90,320,16,C.green,C.darkGreen);
      GAME.rect(ctx,0,106,320,94,C.brown);           // tilled soil
      GAME.dither(ctx,0,106,320,94,C.brown,C.tan);
      GAME.line(ctx,0,106,320,106,C.black);
      // front grass walking strip
      GAME.rect(ctx,0,158,320,42,C.green);
      GAME.dither(ctx,0,158,320,42,C.green,C.darkGreen);
      GAME.line(ctx,0,158,320,158,C.black);

      // ---- neat carrot rows (orange tops poking from soil) ----
      for(let r=0;r<2;r++){
        const ry=120+r*18;
        for(let cx=18;cx<150;cx+=14){
          GAME.rect(ctx,cx,ry-6,2,6,C.darkGreen);   // leafy fronds
          GAME.rect(ctx,cx-2,ry-9,2,3,C.green);
          GAME.rect(ctx,cx+2,ry-9,2,3,C.green);
          GAME.rect(ctx,cx,ry,3,5,C.orange);        // carrot crown
          GAME.px(ctx,cx,ry+5,C.darkRed);
        }
        GAME.line(ctx,12,ry+8,150,ry+8,C.darkGreen); // furrow shadow
      }

      // ---- tomato plants on stakes (right-back of beds) ----
      for(let t=0;t<3;t++){
        const tx=232+t*26, ty=148;
        GAME.line(ctx,tx,ty,tx,ty-22,C.brown);       // stake
        GAME.ellipse(ctx,tx,ty-22,7,8,C.green);      // bush
        GAME.ellipse(ctx,tx,ty-20,5,6,C.darkGreen);
        GAME.px(ctx,tx-3,ty-20,C.red); GAME.px(ctx,tx+2,ty-24,C.red);
        GAME.px(ctx,tx+3,ty-17,C.red); GAME.px(ctx,tx-2,ty-15,C.red);
      }

      // ---- sunflowers along the back fence ----
      for(let s=0;s<5;s++){
        const sx=24+s*30, base=104, h=34+((s*5)%10);
        GAME.line(ctx,sx,base,sx,base-h,C.darkGreen); // stalk
        GAME.rect(ctx,sx-3,base-h+8,3,4,C.green);      // leaf
        GAME.rect(ctx,sx+1,base-h+14,3,4,C.green);
        // petals
        GAME.ellipse(ctx,sx,base-h,6,6,C.yellow);
        GAME.ellipse(ctx,sx,base-h-4,3,2,C.gold);
        GAME.ellipse(ctx,sx,base-h+4,3,2,C.gold);
        GAME.ellipse(ctx,sx-4,base-h,2,3,C.gold);
        GAME.ellipse(ctx,sx+4,base-h,2,3,C.gold);
        GAME.ellipse(ctx,sx,base-h,3,3,C.brown);       // seed disc
        GAME.ellipse(ctx,sx,base-h,2,2,'#3a2410');      // dark seed core
        GAME.px(ctx,sx,base-h,C.black);                 // center dot
        GAME.px(ctx,sx-1,base-h-1,C.gold);              // top glint
      }

      // ---- low picket fence behind the beds ----
      GAME.rect(ctx,0,98,320,2,C.tan);
      for(let fx=4;fx<320;fx+=16){ GAME.rect(ctx,fx,94,2,8,C.tan); GAME.px(ctx,fx,93,C.brown); }
    },

    hotspots:[
      // ----- the wolf, tending his plants (the heart of the scene) -----
      { id:'wolf', name:'הזאב', rect:{x:WX-12,y:WY-42,w:26,h:44}, near:{x:WX-26,y:174},
        keepDraw:true,
        draw(ctx){
          GAME.drawSprite(ctx,'wolf', WX, WY, 0, 'left', 1.0);
        },
        onLook(){
          if(GAME.flag(F.wolfFriend))
            GAME.say('הזאב, חבר שלי עכשיו, ממלמל לעגבניות. הן נראות מרוצות.');
          else
            GAME.say('זאב גדול, רך, עצוב. כורע ליד שתיל ולוחש לו עידוד. שובר את הלב.');
        },
        onTake(){ GAME.RED('לחבק זאב? אולי אחר כך. קודם להבין מה הקטע פה.'); },
        onUse(item){
          // ===== CORE PUZZLE: give the wolf his sunflower seeds =====
          if(item==='seeds'){
            if(GAME.flag(F.wolfFriend)){ GAME.WOLF('כבר פינקת אותי בגרעינים, אחותי. אני מלא אהבה.'); return; }
            const n=this.near;
            GAME.walkTo(n.x,n.y,()=>{
              GAME.take('seeds');
              GAME.setFlag(F.wolfFriend,true);
              GAME.setFlag(F.gaveSeeds,true);
              GAME.score(10,'wolffriend');
              GAME.WOLF('גרעינים שחורים?! בשבילי?! אחותי... זאת המתנה הכי יפה שקיבלתי.');
              GAME.onMsgDone(()=>{
                GAME.WOLF('אנחנו חברים עכשיו, רשמית. ועכשיו שאת חברה — אני חייב לספר לך משהו. על הסבתא שלך.');
                GAME.onMsgDone(()=>{
                  GAME.WOLF('היא ניסתה לפשוט לי את העור. בחיוך. עם סכין. ורשמה רשימה.');
                  GAME.onMsgDone(()=>{
                    GAME.give('evidence');
                    GAME.setFlag(F.knowsGranny,true);   // grannyTruth
                    GAME.setFlag(F.hasKnifeProof,true); // knifeProof
                    GAME.score(10,'evidence');
                    GAME.WOLF('הפתק הזה נפל לסבתא שלך. כתוב: "1. הזאב 2. ?". אני מאוד לא אוהב להיות מספר אחת ברשימה הזאת. ובמקום 2 אני בכלל לא רוצה לחשוב. קחי אותו.');
                    GAME.onMsgDone(()=>{
                      GAME.RED('זאב צמחוני שמציל אותי מסבתא? וואלה, היער הזה מלא הפתעות.');
                      GAME.onMsgDone(()=>{
                        GAME.WOLF('אם תצטרכי אותי שם — תקראי. בלי לחץ, אבל אבוא. חברים זה חברים.');
                      });
                    });
                  });
                });
              });
            });
            return;
          }
          if(item==='basket' || item==='cookie'){ GAME.WOLF('תודה, אבל אני בקטע של אוכל מהצומח. שמרי את זה לסבתא.'); return; }
          if(item){ GAME.RED('לא נראה לי שזה מה שהזאב צריך עכשיו.'); return; }
          GAME.RED('אני לא סתם דוחפת לו דברים. תכל\'ס צריך לתת לו משהו שהוא אוהב.');
        },
        onTalk(){
          if(!GAME.flag(F.wolfFriend)){
            GAME.WOLF('אל תברחי, בבקשה... אני לא נושך. אני בכלל בקטע של אוכל מהצומח.');
            GAME.onMsgDone(()=>{
              GAME.choice('מה להגיד לזאב?', [
                { label:'מה אתה אוהב לאכול?', action(){
                    GAME.WOLF('אני אוהב גרעינים. גרעינים שחורים, מהקיוסק. זה האושר שלי, מבין?'); } },
                { label:'למה אתה עצוב?', action(){
                    GAME.WOLF('כולם רואים זאב וחושבים "אוכל אותי". וזה... פוגע, תכל\'ס.'); } },
                { label:'איזה גינה יפה יש לך', action(){
                    GAME.WOLF('תודה אחותי. ירקות, חמניות, אנרגיה רגועה. רק חסר לי מי שיחלוק את זה איתי.');
                    GAME.score(2,'gardencompliment'); } },
                { label:'יאללה ביי', action(){ GAME.RED('סבבה, אני פה ליד.'); } },
              ]);
            });
          } else {
            GAME.WOLF('בני אדם וזאבים יכולים להיות חברים. רק צריך קצת אנרגיה טובה. וגרעינים.');
          }
        },
      },

      // ----- sunflowers -----
      { id:'sunflowers', name:'החמניות', rect:{x:14,y:60,w:160,h:46}, near:{x:80,y:172},
        onLook(){ GAME.say('חמניות גבוהות, פנים אל השמש. בכל אחת אלפי גרעינים. גן עדן לזאב.'); },
        onTake(){
          if(GAME.flag(F.wolfFriend)) GAME.RED('לא תולשת לחבר את הפרחים. אני ערסית עם ערכים.');
          else GAME.RED('לקטוף לו את החמניות? זה ממש לא דרך להכיר מישהו חדש.');
        },
        onUse(){ GAME.RED('הן בסדר ככה. שיגדלו.'); },
      },

      // ----- the scarecrow in a sweater -----
      { id:'scarecrow', name:'הדחליל', rect:{x:118,y:96,w:24,h:48}, near:{x:130,y:172},
        draw(ctx){
          const C=GAME.C, sx=130, sy=110;
          GAME.line(ctx,sx,sy,sx,sy+34,C.brown);        // pole
          GAME.line(ctx,sx-12,sy+8,sx+12,sy+8,C.brown); // arms
          GAME.rect(ctx,sx-7,sy+6,14,16,C.darkBlue);    // sweater
          GAME.dither(ctx,sx-7,sy+6,14,4,C.darkBlue,C.blue);
          GAME.rect(ctx,sx-3,sy-8,6,8,C.tan);           // burlap head
          GAME.box(ctx,sx-3,sy-8,6,8,C.brown);
          GAME.px(ctx,sx-2,sy-5,C.black); GAME.px(ctx,sx+1,sy-5,C.black); // eyes
          GAME.line(ctx,sx-2,sy-2,sx+1,sy-2,C.black);   // stitched smile
          GAME.rect(ctx,sx-6,sy-12,12,4,C.gold);        // straw hat
          GAME.rect(ctx,sx-3,sy-15,6,3,C.gold);
        },
        onLook(){ GAME.say('הדחליל לבוש בסווצ\'ר. הזאב: "הוא קצת קר לו. גם לדחלילים מגיע חום." איזה נשמה.'); GAME.score(2,'scarecrow'); },
        onTake(){ GAME.RED('הדחליל עובד פה. לא חוטפים לאנשים את העבודה.'); },
        onTalk(){ GAME.RED('"שלום דחליל." הוא שתק בכבוד. שיחה מצוינת, האמת.'); },
        onUse(){ GAME.RED('משאירה לו את הסווצ\'ר. מגיע לו חום.'); },
      },

      // ----- watering can -----
      { id:'wateringcan', name:'מזלף', rect:{x:60,y:144,w:18,h:16}, near:{x:68,y:172},
        draw(ctx){
          const C=GAME.C, x=62, y=146;
          GAME.rect(ctx,x,y,12,9,C.gray);          // body
          GAME.box(ctx,x,y,12,9,C.dkGray);
          GAME.line(ctx,x+12,y+2,x+18,y-2,C.gray); // spout
          GAME.rect(ctx,x+16,y-3,3,2,C.ltGray);    // rose
          GAME.line(ctx,x+2,y,x+8,y-4,C.dkGray);   // handle
        },
        onLook(){ GAME.RED('הוא מדבר לעגבניות. הן ענו לו. שתינו צריכים לישון יותר.'); },
        onTake(){ GAME.RED('מה אני אקח מזלף? אני לא גוזלת ציוד גינון מזאב.'); },
        onUse(){ GAME.RED('להשקות לו את הגינה? נחמד, אבל זה הקטע שלו. לא נתערב.'); },
      },

      // ----- the wolf's hut -----
      { id:'hut', name:'הבקתה של הזאב', rect:{x:250,y:64,w:64,h:44}, near:{x:272,y:172},
        draw(ctx){
          const C=GAME.C, x=252, y=66;
          GAME.rect(ctx,x,y+12,58,30,C.brown);         // wall
          GAME.dither(ctx,x,y+12,58,30,C.brown,C.tan);
          GAME.box(ctx,x,y+12,58,30,C.black);
          GAME.poly(ctx,[[x-4,y+12],[x+29,y-6],[x+62,y+12]],C.darkRed); // roof
          GAME.line(ctx,x-4,y+12,x+62,y+12,C.black);
          GAME.rect(ctx,x+22,y+24,14,18,C.darkRed);    // door
          GAME.box(ctx,x+22,y+24,14,18,C.black);
          GAME.px(ctx,x+33,y+33,C.gold);               // knob
          GAME.box(ctx,x+6,y+18,10,9,C.cyan);          // window
          GAME.line(ctx,x+11,y+18,x+11,y+27,C.black);
          GAME.rect(ctx,x+44,y-2,4,8,C.dkGray);        // little chimney
          GAME.px(ctx,x+45,y-4,C.ltGray);
        },
        onLook(){ GAME.say('בקתת עץ קטנה וחמימה. על המזוזה: "כניסה לצמחונים בלבד". על השאר אנחנו לא נשפוט.'); },
        onTake(){ GAME.RED('אי אפשר לשים בקתה בכיס, אחי.'); },
        onTalk(){ GAME.RED('דופקת בדלת. אין תשובה. הזאב בחוץ, עם השתילים שלו.'); },
        onUse(){ GAME.RED('לא נכנסת לאנשים הביתה בלי הזמנה. גם לזאבים.'); },
      },

      // ----- the carrot/veg beds -----
      { id:'beds', name:'ערוגות הירק', rect:{x:14,y:112,w:150,h:44}, near:{x:80,y:172},
        onLook(){ GAME.RED('זאב עם גינת ירק? יש פה עגבניות יותר מסודרות מהחיים שלי. כל הכבוד, אחי.'); GAME.score(2,'gardenlook'); },
        onTake(){ GAME.RED('לתלוש לזאב גזר? זה הכי לא ערסי שיש. עוזבת.'); },
        onUse(){ GAME.RED('הירקות שלו. לא נוגעים בלי רשות.'); },
      },
    ],

    exits:[
      { id:'back', name:'חזרה ליער', rect:{x:0,y:160,w:24,h:34}, to:'deep_forest',
        entry:{x:170,y:178,dir:'down'}, arrow:'left' },
    ],

    onFirst(){
      GAME.say('הגינה של הזאב. מסתבר שמפלצת היער מגדלת את העגבניות הכי יפות בסביבה.');
      GAME.onMsgDone(()=>{
        GAME.RED('וואלה. שקט, ירוק, ריח של אדמה. אם זה הזאב הרע, אני רוצה לראות את הטוב.');
      });
    },
    onEnter(){},
  });
})();
